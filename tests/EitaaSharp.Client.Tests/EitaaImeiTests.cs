using System.Text.RegularExpressions;
using EitaaSharp.Client.Session;

namespace EitaaSharp.Client.Tests;

public class EitaaImeiTests
{
    [Fact]
    public void Generate_MatchesEitaaWebClientFormat()
    {
        // Same shape the working JS client uses: mtpasdsxfg{6 hex}__web
        var imei = EitaaImei.Generate();

        Assert.Matches(new Regex("^mtpasdsxfg[0-9a-f]{6}__web$"), imei);
        Assert.True(EitaaImei.IsValid(imei));
    }

    [Theory]
    [InlineData("mtpasdsxfg1a2b3c__web", true)]
    [InlineData("0f8a1b2c3d4e5f6a7b8c9d0e1f2a3b4c", false)] // legacy GUID imei
    [InlineData("mtpasdsxfg1a2b3c", false)]                 // missing suffix
    [InlineData(null, false)]
    public void IsValid_ChecksShape(string? imei, bool expected)
        => Assert.Equal(expected, EitaaImei.IsValid(imei));

    [Fact]
    public void JsonFileSession_UpgradesLegacyImei()
    {
        var path = Path.Combine(Path.GetTempPath(), $"eitaa-{Guid.NewGuid():N}.session.json");
        try
        {
            // Simulate an old session file written with a GUID imei.
            File.WriteAllText(path, "{\"Imei\":\"0f8a1b2c3d4e5f6a7b8c9d0e1f2a3b4c\"}");

            var session = JsonFileSession.Open(path);

            Assert.True(EitaaImei.IsValid(session.Imei));
        }
        finally
        {
            if (File.Exists(path)) File.Delete(path);
        }
    }
}
