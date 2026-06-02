using EitaaSharp.Client.Session;
using EitaaSharp.Client.Transport;
using EitaaSharp.Schema;
using EitaaSharp.Tl;
using Auth = EitaaSharp.Schema.Auth;

namespace EitaaSharp.Client.Tests;

public class LoginFlowTests
{
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

    [Fact]
    public async Task SendCode_StoresHashAndPhone_AndSignIn_ReadsThemBack()
    {
        byte[] sentCode = Serialize(new Auth.SentCode
        {
            Type = new Auth.SentCodeTypeApp { Length = 5 },
            PhoneCodeHash = "HASH123",
        });
        byte[] authorization = Serialize(new Auth.Authorization
        {
            Token = "session-token",
            User = new EitaaSharp.Schema.User { Id = 99 },
        });

        var transport = new ScriptedTransport(call => call == 0 ? sentCode : authorization);
        var session = new MemorySession("imei");
        using var client = new EitaaClient(transport, session);

        // 1) sendCode stores phone + phone_code_hash in the session.
        await client.SendCodeAsync("+989121234567");
        Assert.Equal("+989121234567", session.PhoneNumber);
        Assert.Equal("HASH123", session.PhoneCodeHash);

        // 2) signIn(code) reads them back — no need to repeat phone/hash.
        var auth = await client.SignInAsync("12345");

        Assert.Equal("session-token", ((Auth.Authorization)auth).Token);
        Assert.Equal("session-token", session.Token); // token persisted to session
        Assert.True(client.IsAuthorized);
        Assert.Equal(2, transport.Calls);
    }

    [Fact]
    public async Task SignIn_WithoutSendCode_Throws()
    {
        var transport = new ScriptedTransport(_ => Array.Empty<byte>());
        using var client = new EitaaClient(transport, "tok", "imei");

        await Assert.ThrowsAsync<InvalidOperationException>(() => client.SignInAsync("12345"));
    }
}
