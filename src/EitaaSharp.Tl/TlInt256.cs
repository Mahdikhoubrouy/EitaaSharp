namespace EitaaSharp.Tl;

/// <summary>
/// A raw 256-bit TL value (32 bytes), serialized without a length prefix.
/// Used for fields typed <c>int256</c> in the TL schema.
/// </summary>
public readonly struct TlInt256 : IEquatable<TlInt256>
{
    private readonly byte[] _bytes;

    public TlInt256(ReadOnlySpan<byte> bytes)
    {
        if (bytes.Length != 32)
            throw new ArgumentException("int256 must be exactly 32 bytes", nameof(bytes));
        _bytes = bytes.ToArray();
    }

    public ReadOnlySpan<byte> AsSpan() => _bytes ?? new byte[32];

    public byte[] ToArray() => (_bytes ?? new byte[32]).ToArray();

    public bool Equals(TlInt256 other) => AsSpan().SequenceEqual(other.AsSpan());

    public override bool Equals(object? obj) => obj is TlInt256 o && Equals(o);

    public override int GetHashCode()
    {
        var hash = new HashCode();
        hash.AddBytes(AsSpan());
        return hash.ToHashCode();
    }

    public override string ToString() => Convert.ToHexString(AsSpan());
}
