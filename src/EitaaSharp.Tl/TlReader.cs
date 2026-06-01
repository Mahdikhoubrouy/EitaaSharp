using System.Buffers.Binary;
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

    public TlReader(byte[] buffer, TlRegistry? registry = null)
    {
        _buffer = buffer;
        _position = 0;
        _registry = registry ?? TlRegistry.Default;
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
        uint id = ReadConstructorId();

        if (id == GzipPackedId)
        {
            byte[] inflated = GzipInflate(ReadBytes());
            return new TlReader(inflated, _registry).ReadObject();
        }

        return _registry.Create(id, this);
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
