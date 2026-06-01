using EitaaSharp.Client.Rpc;
using EitaaSharp.Client.Transport;
using EitaaSharp.Schema;
using EitaaSharp.Tl;
using Auth = EitaaSharp.Schema.Auth;
using Mt = EitaaSharp.Schema.Mt;

namespace EitaaSharp.Client.Tests;

public class EitaaRpcTests
{
    /// <summary>A transport that captures the request and replays a canned response.</summary>
    private sealed class FakeTransport(byte[] response) : IEitaaTransport
    {
        public byte[]? LastPayloadSent { get; private set; }

        public Task<byte[]> SendAsync(ReadOnlyMemory<byte> payload, CancellationToken cancellationToken = default)
        {
            LastPayloadSent = payload.ToArray();
            return Task.FromResult(response);
        }
    }

    private static byte[] Serialize(ITlObject obj)
    {
        var w = new TlWriter();
        obj.Serialize(w);
        return w.ToArray();
    }

    [Fact]
    public async Task CallAsync_ParsesTypedResult()
    {
        var serverResponse = Serialize(new Auth.SentCode
        {
            Type = new Auth.SentCodeTypeSms { Length = 5 },
            PhoneCodeHash = "deadbeefhash",
            Timeout = 120,
        });

        var transport = new FakeTransport(serverResponse);
        var rpc = new EitaaRpc(transport, token: "tok", imei: "imei");

        var method = new Auth.SendCode
        {
            PhoneNumber = "+989123456789",
            ApiId = 94575,
            ApiHash = "a3406de8d171bb422bb6ddf3bbd800e2",
            Settings = new CodeSettings(),
        };

        var result = Assert.IsType<Auth.SentCode>(await rpc.CallAsync(method));

        Assert.Equal("deadbeefhash", result.PhoneCodeHash);
        Assert.Equal(120, result.Timeout);
        Assert.IsType<Auth.SentCodeTypeSms>(result.Type);

        // The transport must have received an eitaaObject envelope (id 0x7abe77ed, LE).
        Assert.NotNull(transport.LastPayloadSent);
        Assert.Equal(new byte[] { 0xed, 0x77, 0xbe, 0x7a }, transport.LastPayloadSent!.Take(4).ToArray());
    }

    [Fact]
    public async Task CallAsync_ThrowsRpcExceptionOnError()
    {
        var serverResponse = Serialize(new Mt.RpcError
        {
            ErrorCode = 420,
            ErrorMessage = "FLOOD_WAIT_42",
        });

        var rpc = new EitaaRpc(new FakeTransport(serverResponse), token: "tok", imei: "imei");

        var method = new Auth.SendCode
        {
            PhoneNumber = "+989123456789",
            ApiId = 94575,
            ApiHash = "hash",
            Settings = new CodeSettings(),
        };

        var ex = await Assert.ThrowsAsync<RpcException>(() => rpc.CallAsync(method));
        Assert.Equal(420, ex.ErrorCode);
        Assert.True(ex.IsFloodWait);
        Assert.Equal("FLOOD_WAIT", ex.ErrorType);
        Assert.Equal(42, ex.Parameter);
    }

    [Fact]
    public async Task CallAsync_ThrowsOnEitaaError()
    {
        // Eitaa returns its own error#c4b9f9bb (observed live: code 400 PHONE_NUMBER_INVALID).
        var serverResponse = Serialize(new Error
        {
            Code = 400,
            Text = "PHONE_NUMBER_INVALID",
        });

        var rpc = new EitaaRpc(new FakeTransport(serverResponse), token: "tok", imei: "imei");

        var method = new Auth.SendCode
        {
            PhoneNumber = "+9890000000000",
            ApiId = 94575,
            ApiHash = "hash",
            Settings = new CodeSettings(),
        };

        var ex = await Assert.ThrowsAsync<RpcException>(() => rpc.CallAsync(method));
        Assert.Equal(400, ex.ErrorCode);
        Assert.Equal("PHONE_NUMBER_INVALID", ex.ErrorMessage);
    }
}
