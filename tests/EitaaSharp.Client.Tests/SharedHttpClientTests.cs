using System.Net;
using EitaaSharp.Client.Rpc;
using EitaaSharp.Client.Session;
using EitaaSharp.Client.Transport;
using EitaaSharp.Schema;
using EitaaSharp.Tl;
using Mt = EitaaSharp.Schema.Mt;

namespace EitaaSharp.Client.Tests;

/// <summary>
/// A process-wide <see cref="HttpClient"/> shared by every <see cref="EitaaClient"/>, so short-lived clients stop
/// paying a TLS handshake per call — and token renewals that report their expiry and do not stampede.
/// </summary>
public class SharedHttpClientTests
{
    private sealed class Handler(Func<HttpRequestMessage, CancellationToken, Task<HttpResponseMessage>> send) : HttpMessageHandler
    {
        public int Requests;
        public bool Disposed;

        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken ct)
        {
            Interlocked.Increment(ref Requests);
            return send(request, ct);
        }

        protected override void Dispose(bool disposing)
        {
            Disposed = true;
            base.Dispose(disposing);
        }
    }

    private static HttpResponseMessage Ok(byte[] body) => new(HttpStatusCode.OK) { Content = new ByteArrayContent(body) };

    [Fact]
    public async Task A_shared_client_is_neither_modified_nor_disposed()
    {
        var handler = new Handler((_, _) => Task.FromResult(Ok([1])));
        var http = new HttpClient(handler) { Timeout = TimeSpan.FromSeconds(77) };

        using (var client = new EitaaClient(new EitaaClientOptions
               {
                   Imei = "imei", Token = "t", HttpClient = http, Endpoint = "https://a.example/x", Timeout = TimeSpan.FromSeconds(3),
               }))
        {
            // Disposing the EitaaClient disposes its transport.
        }

        Assert.Equal(TimeSpan.FromSeconds(77), http.Timeout);
        Assert.False(handler.Disposed);

        // Still usable by the next client.
        var transport = new HttpEitaaTransport("https://a.example/x", http, TimeSpan.FromSeconds(3));
        Assert.Equal(new byte[] { 1 }, await transport.SendAsync(new byte[] { 9 }));
    }

    [Fact]
    public async Task A_slow_host_times_out_per_attempt_and_fails_over()
    {
        var handler = new Handler(async (request, ct) =>
        {
            if (request.RequestUri!.Host == "slow.example")
                await Task.Delay(Timeout.Infinite, ct);
            return Ok([7]);
        });
        using var http = new HttpClient(handler) { Timeout = Timeout.InfiniteTimeSpan };
        var transport = new HttpEitaaTransport(
            ["https://slow.example/x", "https://fast.example/x"], http, timeout: TimeSpan.FromMilliseconds(200), maxRetries: 1);

        var started = DateTime.UtcNow;
        var result = await transport.SendAsync(new byte[] { 1 });

        Assert.Equal(new byte[] { 7 }, result);
        Assert.True(DateTime.UtcNow - started < TimeSpan.FromSeconds(5), "the attempt timeout, not the client's, decided");
    }

    [Fact]
    public async Task Every_host_timing_out_reports_a_timeout()
    {
        var handler = new Handler(async (_, ct) => { await Task.Delay(Timeout.Infinite, ct); return Ok([]); });
        using var http = new HttpClient(handler) { Timeout = Timeout.InfiniteTimeSpan };
        var transport = new HttpEitaaTransport(
            ["https://a.example/x", "https://b.example/x"], http, timeout: TimeSpan.FromMilliseconds(100), maxRetries: 1);

        var ex = await Assert.ThrowsAsync<HttpRequestException>(() => transport.SendAsync(new byte[] { 1 }));
        Assert.IsType<TimeoutException>(ex.InnerException);
    }

    [Fact]
    public async Task A_caller_cancellation_is_not_retried()
    {
        using var cts = new CancellationTokenSource();
        var handler = new Handler(async (_, ct) => { cts.Cancel(); await Task.Delay(Timeout.Infinite, ct); return Ok([]); });
        using var http = new HttpClient(handler) { Timeout = Timeout.InfiniteTimeSpan };
        var transport = new HttpEitaaTransport(
            ["https://a.example/x", "https://b.example/x"], http, timeout: TimeSpan.FromSeconds(30), maxRetries: 3);

        await Assert.ThrowsAnyAsync<OperationCanceledException>(() => transport.SendAsync(new byte[] { 1 }, cts.Token));
        Assert.Equal(1, handler.Requests);
    }

    // ---- token renewal ----

    private sealed class CountingTransport(Func<byte[], byte[]> respond) : IEitaaTransport
    {
        public int Refreshes;

        public async Task<byte[]> SendAsync(ReadOnlyMemory<byte> payload, CancellationToken cancellationToken = default)
        {
            await Task.Delay(50, cancellationToken);
            return respond(payload.ToArray());
        }
    }

    private static byte[] Serialize(ITlObject obj)
    {
        var w = new TlWriter();
        obj.Serialize(w);
        return w.ToArray();
    }

    private static byte[] Token(string token, int expire) => Serialize(new Mt.EitaaUpdatesToken
    {
        Token = token, Expire = expire, Date = 0, MsgId = 0, SocketToken = "sock",
    });

    [Fact]
    public async Task Concurrent_refreshes_ask_eitaa_once()
    {
        var refreshes = 0;
        var transport = new CountingTransport(_ => { Interlocked.Increment(ref refreshes); return Token($"fresh-{refreshes}", 2_000_000_000); });
        using var client = new EitaaClient(transport, new MemorySession("imei", token: "old"));

        var results = await Task.WhenAll(Enumerable.Range(0, 5).Select(_ => client.TryRefreshTokenAsync()));

        Assert.All(results, Assert.True);
        Assert.Equal(1, refreshes);
        Assert.Equal("fresh-1", client.Session.Token);
    }

    [Fact]
    public async Task A_renewal_reports_the_new_token_and_its_expiry()
    {
        var transport = new CountingTransport(_ => Token("fresh", 1_900_000_000));
        using var client = new EitaaClient(transport, new MemorySession("imei", token: "old"));

        TokenRefreshedEventArgs? seen = null;
        client.OnTokenRefreshed = (_, args, _) => { seen = args; return Task.CompletedTask; };

        Assert.True(await client.TryRefreshTokenAsync());

        Assert.NotNull(seen);
        Assert.Equal("fresh", seen!.Token);
        Assert.Equal(DateTimeOffset.FromUnixTimeSeconds(1_900_000_000), seen.ExpiresAt);
        Assert.Equal("sock", seen.SocketToken);
    }
}
