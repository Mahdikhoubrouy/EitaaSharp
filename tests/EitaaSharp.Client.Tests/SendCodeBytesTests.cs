using EitaaSharp.Schema;
using EitaaSharp.Tl;
using Auth = EitaaSharp.Schema.Auth;

namespace EitaaSharp.Client.Tests;

public class SendCodeBytesTests
{
    // Golden bytes captured from the working JS client (Serializer over auth.sendCode with
    // api_id=undefined, api_hash=undefined -> serialized as 0 / empty string). Eitaa accepts this
    // form and sends the code; the "official" api_id 94575 is rejected.
    private const string ExpectedHex =
        "4f2477a60d2b3938393339363332303539380000000000000000000083bebede00000000";

    [Fact]
    public void SendCode_WithEmptyApiCredentials_MatchesWorkingJsBytes()
    {
        var sendCode = new Auth.SendCode
        {
            PhoneNumber = "+989396320598",
            ApiId = 0,
            ApiHash = "",
            Settings = new CodeSettings(),
        };

        var w = new TlWriter();
        sendCode.Serialize(w);
        string hex = Convert.ToHexString(w.ToArray()).ToLowerInvariant();

        Assert.Equal(ExpectedHex, hex);
    }

    [Fact]
    public void DefaultApiCredentials_AreEmpty()
    {
        Assert.Equal(0, EitaaClient.DefaultApiId);
        Assert.Equal("", EitaaClient.DefaultApiHash);
    }
}
