using EitaaSharp.Client.Session;

namespace EitaaSharp.Client.Tests;

/// <summary>
/// Round-trip, isolation, and robustness tests for the portable Base64 session string
/// (<see cref="SessionString"/> / <see cref="MemorySession.ExportString"/> / <see cref="MemorySession.FromString"/>).
/// </summary>
public class SessionStringTests
{
    private static MemorySession BuildSession()
    {
        var s = new MemorySession("mtpasdsxfg0a1b2c__web", "tok-1234")
        {
            PhoneNumber = "+989121234567",
            PhoneCodeHash = "hash-abc",
        };
        s.SetPeer(69834263, 111222333, PeerType.User);
        s.SetPeer(-100500600700, 999888777, PeerType.Channel);
        s.SetAccessHash(42, 7); // access hash with no learned kind
        return s;
    }

    [Fact]
    public void RoundTrip_PreservesEverything()
    {
        var original = BuildSession();

        var restored = MemorySession.FromString(original.ExportString());

        Assert.Equal("mtpasdsxfg0a1b2c__web", restored.Imei);
        Assert.Equal("tok-1234", restored.Token);
        Assert.Equal("+989121234567", restored.PhoneNumber);
        Assert.Equal("hash-abc", restored.PhoneCodeHash);

        Assert.True(restored.TryGetPeer(69834263, out var h1, out var t1));
        Assert.Equal(111222333, h1);
        Assert.Equal(PeerType.User, t1);

        Assert.True(restored.TryGetPeer(-100500600700, out var h2, out var t2));
        Assert.Equal(999888777, h2);
        Assert.Equal(PeerType.Channel, t2);

        // A peer with no learned kind keeps its access hash but reports no kind.
        Assert.True(restored.TryGetAccessHash(42, out var h3));
        Assert.Equal(7, h3);
        Assert.False(restored.TryGetPeer(42, out _, out _));
    }

    [Fact]
    public void ExcludePeers_KeepsCredentialsButDropsCache_AndIsShorter()
    {
        var original = BuildSession();

        var withPeers = original.ExportString(includePeers: true);
        var without = original.ExportString(includePeers: false);

        Assert.True(without.Length < withPeers.Length);

        var restored = MemorySession.FromString(without);
        Assert.Equal("tok-1234", restored.Token);
        Assert.False(restored.TryGetAccessHash(69834263, out _));
    }

    [Fact]
    public void NullToken_RoundTripsAsNull()
    {
        var s = new MemorySession("imei-only");
        var restored = MemorySession.FromString(s.ExportString());

        Assert.Equal("imei-only", restored.Imei);
        Assert.Null(restored.Token);
        Assert.Null(restored.PhoneNumber);
    }

    [Fact]
    public void TwoStrings_ProduceFullyIndependentSessions()
    {
        var a = new MemorySession("imei-a", "tok-a");
        a.SetPeer(1, 10, PeerType.User);
        var b = new MemorySession("imei-b", "tok-b");
        b.SetPeer(2, 20, PeerType.Channel);

        var ra = MemorySession.FromString(a.ExportString());
        var rb = MemorySession.FromString(b.ExportString());

        Assert.Equal("tok-a", ra.Token);
        Assert.Equal("tok-b", rb.Token);
        Assert.True(ra.TryGetPeer(1, out _, out _));
        Assert.False(ra.TryGetPeer(2, out _, out _)); // a doesn't know b's peer
        Assert.True(rb.TryGetPeer(2, out _, out _));
        Assert.False(rb.TryGetPeer(1, out _, out _));
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData("not-base64!!!")]
    [InlineData("aGVsbG8=")]           // valid Base64, but not an ESS payload
    public void GarbageOrForeignStrings_ThrowFormatException(string bad)
    {
        Assert.Throws<FormatException>(() => MemorySession.FromString(bad));
    }

    [Fact]
    public void TruncatedString_ThrowsFormatException()
    {
        var full = Convert.FromBase64String(BuildSession().ExportString());
        var truncated = Convert.ToBase64String(full.AsSpan(0, full.Length / 2).ToArray());

        Assert.Throws<FormatException>(() => MemorySession.FromString(truncated));
    }

    [Fact]
    public void FutureVersion_WithTrailingBytes_StillImportsKnownFields()
    {
        // Simulate a newer writer: bump the version byte and append unknown trailing bytes.
        var bytes = Convert.FromBase64String(new MemorySession("imei-x", "tok-x").ExportString());
        bytes[3] = 99; // version byte (after 3-byte "ESS" magic)
        var extended = bytes.Concat(new byte[] { 1, 2, 3, 4 }).ToArray();

        var restored = SessionString.Deserialize(Convert.ToBase64String(extended));

        Assert.Equal("imei-x", restored.Imei);
        Assert.Equal("tok-x", restored.Token);
    }

    [Fact]
    public void ClientOptions_SessionString_ConstructsUsableSession()
    {
        var str = new MemorySession("imei-opt", "tok-opt").ExportString();

        using var client = new EitaaClient(new EitaaClientOptions { SessionString = str });

        Assert.Equal("tok-opt", client.Session.Token);
        Assert.Equal("imei-opt", client.Session.Imei);
        // Export from the client reproduces the same credentials.
        var reExported = MemorySession.FromString(client.ExportSessionString());
        Assert.Equal("tok-opt", reExported.Token);
    }

    [Fact]
    public void ClientOptions_BothSessionAndString_Throws()
    {
        var str = new MemorySession("imei", "tok").ExportString();
        Assert.Throws<ArgumentException>(() =>
            new EitaaClient(new EitaaClientOptions { Session = new MemorySession("imei"), SessionString = str }));
    }
}
