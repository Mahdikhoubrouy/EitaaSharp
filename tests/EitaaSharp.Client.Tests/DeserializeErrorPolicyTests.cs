using EitaaSharp.Client.Transport;
using EitaaSharp.Tl;

namespace EitaaSharp.Client.Tests;

/// <summary>
/// Verifies the client-level deserialize-error policy: by default an unmodeled response throws a
/// <see cref="TlException"/>, but with <see cref="EitaaClient.ThrowOnDeserializeError"/> off the call
/// returns <c>default</c> and reports the error through <see cref="EitaaClient.OnDeserializeError"/>.
/// </summary>
public class DeserializeErrorPolicyTests
{
    private sealed class StubTransport(byte[] response) : IEitaaTransport
    {
        public Task<byte[]> SendAsync(ReadOnlyMemory<byte> payload, CancellationToken cancellationToken = default)
            => Task.FromResult(response);
    }

    // A boxed response whose top-level constructor id is not modelled (and is not an error envelope).
    private static byte[] UnknownResponse()
    {
        var w = new TlWriter();
        w.WriteUInt32(0xDEADBEEFu);
        w.WriteInt32(0);
        return w.ToArray();
    }

    [Fact]
    public async Task Default_ThrowsTlException_OnUnknownResponse()
    {
        using var client = new EitaaClient(new StubTransport(UnknownResponse()), "tok", "imei");

        await Assert.ThrowsAsync<TlDeserializeException>(() => client.GetNearestDcAsync());
    }

    [Fact]
    public async Task PolicyOff_ReturnsDefault_AndFiresHook()
    {
        Exception? captured = null;
        using var client = new EitaaClient(new StubTransport(UnknownResponse()), "tok", "imei")
        {
            ThrowOnDeserializeError = false,
            OnDeserializeError = ex => captured = ex,
        };

        var result = await client.GetNearestDcAsync();

        Assert.Null(result);
        var tl = Assert.IsType<TlDeserializeException>(captured);
        Assert.Equal(0xDEADBEEFu, tl.ConstructorId);
    }
}
