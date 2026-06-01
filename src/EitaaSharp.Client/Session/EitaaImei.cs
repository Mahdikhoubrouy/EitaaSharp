namespace EitaaSharp.Client.Session;

/// <summary>
/// Generates Eitaa-style device identifiers. Eitaa only delivers login codes to a recognized
/// web-client imei of the form <c>mtpasdsxfg{6 hex}__web</c> (e.g. <c>mtpasdsxfg1a2b3c__web</c>);
/// other formats are rejected with "can't send activation code".
/// </summary>
public static class EitaaImei
{
    private const string Prefix = "mtpasdsxfg";
    private const string Suffix = "__web";
    private const int RandomHexLength = 6; // 3 random bytes -> 6 hex chars

    /// <summary>Creates a fresh, valid Eitaa web-client imei.</summary>
    public static string Generate()
    {
        Span<byte> bytes = stackalloc byte[RandomHexLength / 2];
        Random.Shared.NextBytes(bytes);
        return Prefix + Convert.ToHexString(bytes).ToLowerInvariant() + Suffix;
    }

    /// <summary>True if <paramref name="imei"/> has the Eitaa web-client shape Eitaa accepts.</summary>
    public static bool IsValid(string? imei)
        => imei is not null
        && imei.Length == Prefix.Length + RandomHexLength + Suffix.Length
        && imei.StartsWith(Prefix, StringComparison.Ordinal)
        && imei.EndsWith(Suffix, StringComparison.Ordinal);
}
