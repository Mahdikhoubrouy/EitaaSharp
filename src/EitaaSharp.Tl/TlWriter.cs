using System.Buffers.Binary;
using System.Text;

namespace EitaaSharp.Tl;

/// <summary>
/// Writes the TL binary wire format (little-endian). Backed by a growable buffer,
/// so unlike the JS implementation it needs no separate two-pass length counter.
/// Port of <c>src/tl/serializer/index.js</c>.
/// </summary>
public sealed class TlWriter
{
    public const uint VectorId = 0x1CB5C415;
    public const uint BoolTrueId = 0x997275B5;
    public const uint BoolFalseId = 0xBC799737;

    private byte[] _buffer;
    private int _position;

    public TlWriter(int initialCapacity = 256)
    {
        _buffer = new byte[Math.Max(16, initialCapacity)];
        _position = 0;
    }

    public int Length => _position;

    public ReadOnlySpan<byte> WrittenSpan => _buffer.AsSpan(0, _position);

    public byte[] ToArray() => _buffer.AsSpan(0, _position).ToArray();

    private Span<byte> Reserve(int count)
    {
        if (_position + count > _buffer.Length)
            Grow(_position + count);
        var span = _buffer.AsSpan(_position, count);
        _position += count;
        return span;
    }

    private void Grow(int required)
    {
        int newSize = _buffer.Length * 2;
        while (newSize < required)
            newSize *= 2;
        Array.Resize(ref _buffer, newSize);
    }

    public void WriteInt32(int value)
        => BinaryPrimitives.WriteInt32LittleEndian(Reserve(4), value);

    public void WriteUInt32(uint value)
        => BinaryPrimitives.WriteUInt32LittleEndian(Reserve(4), value);

    /// <summary>
    /// Writes a TL <c>long</c> as canonical little-endian Int64 (low dword first).
    /// Verified against the JS <c>serializer.long</c> numeric path: <c>long(1)</c>
    /// emits <c>01 00 00 00 00 00 00 00</c>. (The reversed [low,high] array path in
    /// the JS source is only used for internal message ids, not the Eitaa wire.)
    /// </summary>
    public void WriteLong(long value)
        => BinaryPrimitives.WriteInt64LittleEndian(Reserve(8), value);

    public void WriteULong(ulong value)
        => BinaryPrimitives.WriteUInt64LittleEndian(Reserve(8), value);

    public void WriteDouble(double value)
        => BinaryPrimitives.WriteDoubleLittleEndian(Reserve(8), value);

    public void WriteInt128(TlInt128 value) => value.AsSpan().CopyTo(Reserve(16));

    public void WriteInt256(TlInt256 value) => value.AsSpan().CopyTo(Reserve(32));

    /// <summary>Writes raw bytes with no length prefix or padding.</summary>
    public void WriteRawBytes(ReadOnlySpan<byte> bytes) => bytes.CopyTo(Reserve(bytes.Length));

    /// <summary>
    /// Writes a TL <c>bytes</c> value: a length prefix (1 byte if len ≤ 253,
    /// otherwise 0xFE + 3-byte little-endian length), the data, then zero
    /// padding to the next multiple of 4.
    /// </summary>
    public void WriteBytes(ReadOnlySpan<byte> bytes)
    {
        int length = bytes.Length;
        int start = _position;

        if (length <= 253)
        {
            Reserve(1)[0] = (byte)length;
        }
        else
        {
            var header = Reserve(4);
            header[0] = 254;
            header[1] = (byte)(length & 0xFF);
            header[2] = (byte)((length >> 8) & 0xFF);
            header[3] = (byte)((length >> 16) & 0xFF);
        }

        bytes.CopyTo(Reserve(length));

        int written = _position - start;
        int padding = (4 - (written % 4)) % 4;
        if (padding > 0)
            Reserve(padding).Clear();
    }

    public void WriteString(string value)
        => WriteBytes(Encoding.UTF8.GetBytes(value));

    public void WriteBool(bool value)
        => WriteUInt32(value ? BoolTrueId : BoolFalseId);

    /// <summary>Writes a boxed vector: the vector tag, the count, then each item.</summary>
    public void WriteVector<T>(IReadOnlyList<T> items, Action<TlWriter, T> writeItem)
    {
        WriteUInt32(VectorId);
        WriteInt32(items.Count);
        for (int i = 0; i < items.Count; i++)
            writeItem(this, items[i]);
    }

    /// <summary>Writes a bare vector (no <c>0x1cb5c415</c> tag): count then items.</summary>
    public void WriteBareVector<T>(IReadOnlyList<T> items, Action<TlWriter, T> writeItem)
    {
        WriteInt32(items.Count);
        for (int i = 0; i < items.Count; i++)
            writeItem(this, items[i]);
    }

    /// <summary>Writes a boxed object (its constructor id followed by its body).</summary>
    public void WriteObject(ITlObject value) => value.Serialize(this);
}
