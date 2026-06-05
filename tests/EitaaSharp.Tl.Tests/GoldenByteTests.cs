using EitaaSharp.Schema;
using EitaaSharp.Tl;
using Auth = EitaaSharp.Schema.Auth;
using Upload = EitaaSharp.Schema.Upload;

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
    public void Channel_DualBitmask_RoundTrips()
    {
        // Eitaa's `channel` carries a SECOND bitmask `eFlags` after `flags`. This proves
        // both flag fields are serialized/parsed independently and in the right order.
        GeneratedSchema.RegisterAll();

        var original = new Channel
        {
            Megagroup = true,           // flags.8
            Restricted = false,
            Id = 123456789L,
            AccessHash = 9876543210L,    // flags.13
            Title = "Eitaa Channel",
            Username = "eitaa_channel", // flags.6
            Photo = new ChatPhotoEmpty(),
            Date = 1700000000,
            ParticipantsCount = 4200,    // flags.17
            Trusty = true,               // eFlags.0
            Shop = true,                 // eFlags.2
            BadgeName = "verified-shop", // eFlags.4
        };

        var w = new TlWriter();
        original.Serialize(w);
        var parsed = new TlReader(w.ToArray()).ReadObject<Channel>();

        Assert.Equal(123456789L, parsed.Id);
        Assert.Equal(9876543210L, parsed.AccessHash);
        Assert.Equal("Eitaa Channel", parsed.Title);
        Assert.Equal("eitaa_channel", parsed.Username);
        Assert.Equal(4200, parsed.ParticipantsCount);
        Assert.True(parsed.Megagroup);
        Assert.False(parsed.Creator);
        // second bitmask (eFlags) survives independently
        Assert.True(parsed.Trusty);
        Assert.True(parsed.Shop);
        Assert.False(parsed.Fake);
        Assert.Equal("verified-shop", parsed.BadgeName);
    }

    [Fact]
    public void User_TripleBitmask_RoundTrips()
    {
        // The Eitaa layer-137 server sends user id -321753653 (TL_user_layer135), which carries
        // THREE bitmask fields — flags / flags2 / eFlags — plus the mini-app presence bits.
        // This is the constructor that previously threw "No TL type registered".
        GeneratedSchema.RegisterAll();

        var original = new User
        {
            Bot = true,                 // flags.14 (coupled with bot_info_version)
            BotInfoVersion = 3,          // flags.14
            Id = 555000111L,
            AccessHash = 12345678901L,   // flags.0
            FirstName = "Mini",          // flags.1
            Username = "miniapp_bot",    // flags.3
            MiniApp = true,              // eFlags.0
            MiniAppGeo = true,           // eFlags.4
            BadgeName = "official",      // eFlags.1
            BotActiveUsers = 9001,       // flags2.12
        };

        var w = new TlWriter();
        original.Serialize(w);
        var parsed = new TlReader(w.ToArray()).ReadObject<User>();

        Assert.Equal(555000111L, parsed.Id);
        Assert.Equal(12345678901L, parsed.AccessHash);
        Assert.Equal("Mini", parsed.FirstName);
        Assert.Equal("miniapp_bot", parsed.Username);
        Assert.True(parsed.Bot);
        // the second & third bitmasks survive independently
        Assert.True(parsed.MiniApp);
        Assert.True(parsed.MiniAppGeo);
        Assert.False(parsed.Self);
        Assert.Equal("official", parsed.BadgeName);
        Assert.Equal(9001, parsed.BotActiveUsers);
    }

    [Fact]
    public void SaveFilePart_AlwaysCarriesTotalSize()
    {
        // Eitaa's upload.saveFilePart always sets flags bit1 (=2) and writes totalFileSize,
        // unlike upstream Telegram. Omitting it caused the server to answer INVALID_CONSTRUCTOR.
        var w = new TlWriter();
        new Upload.SaveFilePart
        {
            FileId = 7,
            FilePart = 0,
            Bytes = new byte[] { 1, 2, 3 },
            TotalFileSize = 999,
        }.Serialize(w);

        var r = new TlReader(w.ToArray());
        r.ReadInt32();                                   // constructor id
        Assert.Equal(7L, r.ReadLong());                  // file_id
        Assert.Equal(0, r.ReadInt32());                  // file_part
        Assert.Equal(new byte[] { 1, 2, 3 }, r.ReadBytes());
        Assert.Equal(2, r.ReadInt32());                  // flags: bit1 set, no peer (bit0)
        Assert.Equal(999L, r.ReadLong());                // totalFileSize present
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
