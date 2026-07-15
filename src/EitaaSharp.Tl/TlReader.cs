using System.Buffers.Binary;
using System.Linq;
using System.Text;

namespace EitaaSharp.Tl;

/// <summary>
/// Reads the TL binary wire format (little-endian). Port of
/// <c>src/tl/deserializer/index.js</c>.
/// </summary>
public sealed class TlReader
{
    private readonly byte[] _buffer;
    private int _position;
    private readonly TlRegistry _registry;
    private readonly bool _tolerateUnknownTopLevel;

    // Depth of the current ReadObject nesting (0 = the outermost/top-level object) and the chain of
    // constructor ids the reader is currently inside, used to build an error breadcrumb.
    private int _depth;
    private readonly Stack<uint> _typeStack = new();

    /// <param name="buffer">The wire bytes to read.</param>
    /// <param name="registry">Constructor registry to dispatch on (defaults to <see cref="TlRegistry.Default"/>).</param>
    /// <param name="tolerateUnknownTopLevel">
    /// When <c>true</c>, an unknown <b>top-level</b> constructor id yields an
    /// <see cref="UnknownConstructor"/> (capturing the id and remaining bytes) instead of throwing.
    /// Nested unknowns still throw (they are positionally unrecoverable). Defaults to <c>false</c> so
    /// strict paths (e.g. golden-byte tests) keep the throwing behaviour.
    /// </param>
    public TlReader(byte[] buffer, TlRegistry? registry = null, bool tolerateUnknownTopLevel = false)
    {
        _buffer = buffer;
        _position = 0;
        _registry = registry ?? TlRegistry.Default;
        _tolerateUnknownTopLevel = tolerateUnknownTopLevel;
    }

    public int Position => _position;

    public int Remaining => _buffer.Length - _position;

    private ReadOnlySpan<byte> Take(int count)
    {
        if (_position + count > _buffer.Length)
            throw new TlException(
                $"Unexpected end of buffer: needed {count} bytes at offset {_position}, have {Remaining}");
        var span = _buffer.AsSpan(_position, count);
        _position += count;
        return span;
    }

    public int ReadInt32() => BinaryPrimitives.ReadInt32LittleEndian(Take(4));

    public uint ReadUInt32() => BinaryPrimitives.ReadUInt32LittleEndian(Take(4));

    /// <summary>Reads a TL <c>long</c> as canonical little-endian Int64 (matches <see cref="TlWriter.WriteLong"/>).</summary>
    public long ReadLong() => BinaryPrimitives.ReadInt64LittleEndian(Take(8));

    public ulong ReadULong() => BinaryPrimitives.ReadUInt64LittleEndian(Take(8));

    public double ReadDouble() => BinaryPrimitives.ReadDoubleLittleEndian(Take(8));

    public TlInt128 ReadInt128() => new(Take(16));

    public TlInt256 ReadInt256() => new(Take(32));

    public byte[] ReadRawBytes(int count) => Take(count).ToArray();

    /// <summary>Reads a TL <c>bytes</c> value (length prefix, data, padding to a multiple of 4).</summary>
    public byte[] ReadBytes()
    {
        int length = Take(1)[0];
        if (length == 254)
        {
            var header = Take(3);
            length = header[0] | (header[1] << 8) | (header[2] << 16);
        }

        byte[] data = Take(length).ToArray();

        int consumed = (length <= 253 ? 1 : 4) + length;
        int padding = (4 - (consumed % 4)) % 4;
        if (padding > 0)
            Take(padding);

        return data;
    }

    public string ReadString() => Encoding.UTF8.GetString(ReadBytes());

    public bool ReadBool() => ReadUInt32() == TlWriter.BoolTrueId;

    /// <summary>Reads a boxed vector (skips the <c>0x1cb5c415</c> tag) or, when <paramref name="bare"/>, a bare vector.</summary>
    public T[] ReadVector<T>(Func<TlReader, T> readItem, bool bare = false)
    {
        if (!bare)
            ReadUInt32(); // vector tag

        int length = ReadInt32();
        var result = new T[length];
        for (int i = 0; i < length; i++)
            result[i] = readItem(this);
        return result;
    }

    /// <summary>Reads the next constructor id (unsigned, mirroring JS <c>int32() &gt;&gt;&gt; 0</c>).</summary>
    public uint ReadConstructorId() => ReadUInt32();

    /// <summary>gzip_packed#3072cfa1 — a gzip-compressed inner object.</summary>
    private const uint GzipPackedId = 0x3072CFA1;

    /// <summary>Reads a boxed object: dispatches on the constructor id via the registry.</summary>
    public ITlObject ReadObject()
    {
        int idOffset = _position;
        uint id = ReadConstructorId();

        if (id == GzipPackedId)
        {
            byte[] inflated = GzipInflate(ReadBytes());
            // Preserve tolerance across the gzip boundary: the inflated object is still "top-level".
            return new TlReader(inflated, _registry, _tolerateUnknownTopLevel).ReadObject();
        }

        if (!_registry.TryGet(id, out var factory))
        {
            // Recoverable only at the top level, where the unknown body is simply the rest of the
            // buffer and no later fields depend on it. A nested unknown is positionally unrecoverable.
            if (_tolerateUnknownTopLevel && _depth == 0)
                return new UnknownConstructor(id, ReadRawBytes(Remaining));

            throw new TlDeserializeException(id, idOffset, BuildTypePath(), HexDumpFrom(0));
        }

        _depth++;
        _typeStack.Push(id);
        try
        {
            return factory(this);
        }
        finally
        {
            _typeStack.Pop();
            _depth--;
        }
    }

    /// <summary>
    /// Hex-dumps the wire bytes from <paramref name="start"/> to the end of the buffer (capped) so an
    /// unknown constructor — often an Eitaa rehash of a standard type — can be decoded by hand and
    /// registered. Called with <c>start = 0</c> to dump the whole object; the offending id sits at the
    /// exception's <see cref="TlDeserializeException.Offset"/> within the dump.
    /// </summary>
    private string HexDumpFrom(int start)
    {
        const int cap = 2048;
        int available = _buffer.Length - start;
        if (available <= 0)
            return string.Empty;

        int count = Math.Min(cap, available);
        var hex = Convert.ToHexString(_buffer, start, count);
        return count < available ? $"{hex}… (+{available - count} more)" : hex;
    }

    /// <summary>Builds an outermost-first, arrow-separated breadcrumb of the types currently being read.</summary>
    private string? BuildTypePath()
    {
        if (_typeStack.Count == 0)
            return null;

        // Stack enumerates top (innermost) first — reverse for outermost-first reading order.
        var names = _typeStack
            .Reverse()
            .Select(id => _registry.GetName(id) ?? $"0x{id:X8}");
        return string.Join(" → ", names);
    }

    private static byte[] GzipInflate(byte[] compressed)
    {
        using var input = new MemoryStream(compressed);
        using var gzip = new System.IO.Compression.GZipStream(
            input, System.IO.Compression.CompressionMode.Decompress);
        using var output = new MemoryStream();
        gzip.CopyTo(output);
        return output.ToArray();
    }

    /// <summary>Reads a boxed object and casts it to <typeparamref name="T"/>.</summary>
    public T ReadObject<T>() where T : ITlObject => (T)ReadObject();
}
