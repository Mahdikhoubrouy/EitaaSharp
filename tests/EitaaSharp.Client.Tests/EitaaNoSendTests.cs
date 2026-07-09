using EitaaSharp.Client.Transport;
using EitaaSharp.Schema;
using EitaaSharp.Tl;

namespace EitaaSharp.Client.Tests;

/// <summary>
/// Mirrors the official web client's <c>eitaaNoSend</c> behaviour: socket-only methods
/// (<c>messages.setTyping</c>) are never sent over HTTP, and any method the server rejects with
/// <c>INVALID_CONSTRUCTOR</c> is remembered and skipped thereafter.
/// </summary>
public class EitaaNoSendTests
{
    private sealed class CountingTransport(Func<int, byte[]> responder) : IEitaaTransport
    {
        public int Calls { get; private set; }
        public Task<byte[]> SendAsync(ReadOnlyMemory<byte> payload, CancellationToken cancellationToken = default)
            => Task.FromResult(responder(Calls++));
    }

    private static byte[] Serialize(ITlObject o) { var w = new TlWriter(); o.Serialize(w); return w.ToArray(); }
    private static byte[] InvalidConstructor() => Serialize(new Error { Code = 404, Text = "INVALID_CONSTRUCTOR" });

    [Fact]
    public async Task SetTyping_IsSkipped_WithoutHittingTheNetwork()
    {
        var transport = new CountingTransport(_ => throw new InvalidOperationException("should not be called"));
        using var client = new EitaaClient(transport, "tok", "imei");

        var accepted = await client.SendChatActionAsync("me", ChatAction.Typing);

        Assert.False(accepted);
        Assert.Equal(0, transport.Calls); // seeded in eitaaNoSend — never sent
    }

    [Fact]
    public async Task InvalidConstructor_MarksMethodUnsupported_AndSkipsNextTime()
    {
        var transport = new CountingTransport(_ => InvalidConstructor());
        using var client = new EitaaClient(transport, "tok", "imei");

        var first = await client.GetNearestDcAsync();   // hits the server, gets INVALID_CONSTRUCTOR
        var second = await client.GetNearestDcAsync();  // now skipped

        Assert.Null(first);
        Assert.Null(second);
        Assert.Equal(1, transport.Calls); // only the first call reached the transport
    }
}
