using EitaaSharp.Schema;
using EitaaSharp.Tl;
using Auth = EitaaSharp.Schema.Auth;

namespace EitaaSharp.Tl.Tests;

/// <summary>
/// Asserts the C# serializer produces byte-for-byte identical output to the JS
/// reference implementation (src/tl/serializer). Golden hex strings were captured
/// from the JS <c>Serializer</c> for fixed inputs.
/// </summary>
public class GoldenByteTests
{
    private const string PhoneNumber = "+989123456789";
    private const int ApiId = 94575;
    private const string ApiHash = "a3406de8d171bb422bb6ddf3bbd800e2";

    // Captured from the JS Serializer for the inputs used in each test below.
    private const string GoldenCodeSettings = "83bebede00000000";
    private const string GoldenAuthSendCode = "4f2477a60d2b39383931323334353637383900006f71010020613334303664653864313731626234323262623664646633626264383030653200000083bebede00000000";
    private const string GoldenEitaaObject = "ed77be7a0954455354544f4b454e00000d746573742d696d65692d3132330000444f2477a60d2b39383931323334353637383900006f71010020613334303664653864313731626234323262623664646633626264383030653200000083bebede0000000000000085000000";

    private static string Hex(ITlObject obj)
    {
        var w = new TlWriter();
        obj.Serialize(w);
        return Convert.ToHexString(w.WrittenSpan).ToLowerInvariant();
    }

    private static Auth.SendCode SampleSendCode() => new()
    {
        PhoneNumber = PhoneNumber,
        ApiId = ApiId,
        ApiHash = ApiHash,
        Settings = new CodeSettings(),
    };

    [Fact]
    public void CodeSettings_MatchesJs()
        => Assert.Equal(GoldenCodeSettings, Hex(new CodeSettings()));

    [Fact]
    public void AuthSendCode_MatchesJs()
        => Assert.Equal(GoldenAuthSendCode, Hex(SampleSendCode()));

    [Fact]
    public void EitaaObject_WrappingAuthSendCode_MatchesJs()
    {
        var innerWriter = new TlWriter();
        SampleSendCode().Serialize(innerWriter);

        var envelope = new EitaaObject
        {
            Token = "TESTTOKEN",
            Imei = "test-imei-123",
            PackedData = innerWriter.ToArray(),
            Layer = 133,
        };

        Assert.Equal(GoldenEitaaObject, Hex(envelope));
    }

    [Fact]
    public void AuthSentCode_RoundTrips_ThroughRegistry()
    {
        GeneratedSchema.RegisterAll();

        var original = new Auth.SentCode
        {
            Type = new Auth.SentCodeTypeApp { Length = 5 },
            PhoneCodeHash = "abc123hash",
            Timeout = 60,
        };

        var w = new TlWriter();
        original.Serialize(w);

        var reader = new TlReader(w.ToArray());
        var parsed = reader.ReadObject<Auth.SentCode>();

        Assert.Equal("abc123hash", parsed.PhoneCodeHash);
        Assert.Equal(60, parsed.Timeout);
        Assert.Null(parsed.NextType);
        Assert.IsType<Auth.SentCodeTypeApp>(parsed.Type);
        Assert.Equal(5, ((Auth.SentCodeTypeApp)parsed.Type).Length);
    }
}
