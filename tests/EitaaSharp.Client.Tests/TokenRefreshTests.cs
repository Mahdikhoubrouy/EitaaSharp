using EitaaSharp.Client.Rpc;
using EitaaSharp.Client.Session;
using EitaaSharp.Client.Transport;
using EitaaSharp.Schema;
using EitaaSharp.Tl;
using Mt = EitaaSharp.Schema.Mt;

namespace EitaaSharp.Client.Tests;

public class TokenRefreshTests
{
    /// <summary>Returns a scripted response per call.</summary>
    private sealed class ScriptedTransport(Func<int, byte[]> responder) : IEitaaTransport
    {
        public int Calls { get; private set; }

        public Task<byte[]> SendAsync(ReadOnlyMemory<byte> payload, CancellationToken cancellationToken = default)
            => Task.FromResult(responder(Calls++));
    }

    private static byte[] Serialize(ITlObject obj)
    {
        var w = new TlWriter();
        obj.Serialize(w);
        return w.ToArray();
    }

    private static byte[] AuthKeyInvalid() => Serialize(new Error { Code = 401, Text = "AUTH_KEY_INVALID" });

    private static byte[] NearestDc() =>
        Serialize(new NearestDc { Country = "IR", ThisDc = 2, NearestDcValue = 2 });

    [Fact]
    public async Task ExpiredSession_RefreshesAndRetriesOnce()
    {
        // 1st call: AUTH_KEY_INVALID (expired). After refresh, 2nd call: success.
        var transport = new ScriptedTransport(call => call == 0 ? AuthKeyInvalid() : NearestDc());
        var session = new MemorySession("imei", token: "old");

        using var client = new EitaaClient(transport, session)
        {
            TokenRefreshHandler = (c, _) =>
            {
                c.Session.Token = "fresh"; // simulate a successful refresh
                return Task.FromResult(true);
            },
        };

        var result = await client.GetNearestDcAsync();

        Assert.Equal(2, ((NearestDc)result).ThisDc);
        Assert.Equal(2, transport.Calls);      // original + one retry
        Assert.Equal("fresh", session.Token);  // token was refreshed
    }

    [Fact]
    public async Task ExpiredSession_WithoutHandler_Throws()
    {
        var transport = new ScriptedTransport(_ => AuthKeyInvalid());
        using var client = new EitaaClient(transport, "tok", "imei");

        var ex = await Assert.ThrowsAsync<SessionExpiredException>(() => client.GetNearestDcAsync());
        Assert.Equal("AUTH_KEY_INVALID", ex.ErrorMessage);
        Assert.Equal(1, transport.Calls); // no retry
    }

    [Fact]
    public async Task ExpiredSession_HandlerReturnsFalse_DoesNotRetry()
    {
        var transport = new ScriptedTransport(_ => AuthKeyInvalid());
        using var client = new EitaaClient(transport, "tok", "imei")
        {
            TokenRefreshHandler = (_, _) => Task.FromResult(false), // refresh failed
        };

        await Assert.ThrowsAsync<SessionExpiredException>(() => client.GetNearestDcAsync());
        Assert.Equal(1, transport.Calls);
    }

    [Fact]
    public async Task RefreshTokenAsync_ParsesUpdatesToken_AndStoresNewToken()
    {
        // eitaaRefreshToken answers with eitaa_updates_token (token/expire/date/msg_id/socket_token);
        // the new token must be parsed out and written back to the session.
        var transport = new ScriptedTransport(_ => Serialize(new Mt.EitaaUpdatesToken
        {
            Token = "fresh-token", Expire = 999, Date = 1, MsgId = 7, SocketToken = "sk",
        }));
        var session = new MemorySession("imei", token: "stale");
        using var client = new EitaaClient(transport, session);

        var result = (Mt.EitaaUpdatesToken)await client.RefreshTokenAsync(new Mt.EitaaAppInfo
        {
            BuildVersion = 0, DeviceModel = "t", SystemVersion = "t",
            AppVersion = "t", LangCode = "en", Sign = "",
        });

        Assert.Equal("fresh-token", result.Token);     // 5-field eitaa_updates_token parsed
        Assert.Equal(7, result.MsgId);
        Assert.Equal("fresh-token", session.Token);    // and persisted to the session
    }
}
