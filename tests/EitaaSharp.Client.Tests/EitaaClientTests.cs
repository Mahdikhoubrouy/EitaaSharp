using EitaaSharp.Client;
using EitaaSharp.Client.Transport;
using EitaaSharp.Schema;
using EitaaSharp.Tl;
using Auth = EitaaSharp.Schema.Auth;

namespace EitaaSharp.Client.Tests;

public class EitaaClientTests
{
    private sealed class FakeTransport(byte[] response) : IEitaaTransport
    {
        public Task<byte[]> SendAsync(ReadOnlyMemory<byte> payload, CancellationToken cancellationToken = default)
            => Task.FromResult(response);
    }

    private static byte[] Serialize(ITlObject obj)
    {
        var w = new TlWriter();
        obj.Serialize(w);
        return w.ToArray();
    }

    [Fact]
    public async Task SendCodeAsync_ReturnsTypedSentCode()
    {
        var response = Serialize(new Auth.SentCode
        {
            Type = new Auth.SentCodeTypeApp { Length = 5 },
            PhoneCodeHash = "hash-xyz",
        });

        using var client = new EitaaClient(new FakeTransport(response), token: "t", imei: "i");
        var sent = Assert.IsType<Auth.SentCode>(
            await client.SendCodeAsync("+989123456789", 94575, "apihash"));

        Assert.Equal("hash-xyz", sent.PhoneCodeHash);
    }

    [Fact]
    public async Task SignInAsync_RaisesAuthorizedEvent()
    {
        var response = Serialize(new Auth.Authorization
        {
            Token = "session-token",
            User = new UserEmpty { Id = 12345 },
        });

        using var client = new EitaaClient(new FakeTransport(response), token: "t", imei: "i");

        Auth.IAuthorization? captured = null;
        client.Authorized += (_, a) => captured = a;

        var auth = await client.SignInAsync("+989123456789", "hash", "11111");

        Assert.True(client.IsAuthorized);
        Assert.NotNull(captured);
        Assert.Same(auth, captured);
    }
}
