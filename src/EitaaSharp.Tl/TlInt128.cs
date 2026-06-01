namespace EitaaSharp.Tl;

/// <summary>
/// A raw 128-bit TL value (16 bytes), serialized without a length prefix.
/// Used for fields typed <c>int128</c> in the TL schema.
/// </summary>
public readonly struct TlInt128 : IEquatable<TlInt128>
{
    private readonly byte[] _bytes;

    public TlInt128(ReadOnlySpan<byte> bytes)
    {
        if (bytes.Length != 16)
            throw new ArgumentException("int128 must be exactly 16 bytes", nameof(bytes));
        _bytes = bytes.ToArray();
    }

    public ReadOnlySpan<byte> AsSpan() => _bytes ?? new byte[16];

    public byte[] ToArray() => (_bytes ?? new byte[16]).ToArray();

    public bool Equals(TlInt128 other) => AsSpan().SequenceEqual(other.AsSpan());

    public override bool Equals(object? obj) => obj is TlInt128 o && Equals(o);

    public override int GetHashCode()
    {
        var hash = new HashCode();
        hash.AddBytes(AsSpan());
        return hash.ToHashCode();
    }

    public override string ToString() => Convert.ToHexString(AsSpan());
}
