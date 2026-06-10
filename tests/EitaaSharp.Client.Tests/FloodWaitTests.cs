using EitaaSharp.Client.Rpc;
using EitaaSharp.Client.Transport;
using EitaaSharp.Schema;
using EitaaSharp.Tl;

namespace EitaaSharp.Client.Tests;

public class FloodWaitTests
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

    private static byte[] Flood(int seconds) => Serialize(new Error { Code = 420, Text = $"FLOOD_WAIT_{seconds}" });
    private static byte[] NearestDc() => Serialize(new NearestDc { Country = "IR", ThisDc = 2, NearestDcValue = 2 });

    [Fact]
    public async Task FloodWait_WithinCap_IsWaitedOutAndRetried()
    {
        // First call floods (0s => ~1s wait), second succeeds.
        var transport = new ScriptedTransport(call => call == 0 ? Flood(0) : NearestDc());
        using var client = new EitaaClient(transport, "tok", "imei");

        var result = await client.GetNearestDcAsync();

        Assert.Equal(2, ((NearestDc)result).ThisDc);
        Assert.Equal(2, transport.Calls); // original + one retry after waiting
    }

    [Fact]
    public async Task FloodWait_AboveCap_IsSurfaced_WithoutWaiting()
    {
        // 999s exceeds the default 60s cap, so it is thrown rather than waited out.
        var transport = new ScriptedTransport(_ => Flood(999));
        using var client = new EitaaClient(transport, "tok", "imei");

        var ex = await Assert.ThrowsAsync<RpcException>(() => client.GetNearestDcAsync());
        Assert.True(ex.IsFloodWait);
        Assert.Equal(999, ex.Parameter);
        Assert.Equal(1, transport.Calls); // no retry
    }
}
