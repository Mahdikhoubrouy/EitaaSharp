using System.Net;
using EitaaSharp.Client.Transport;

namespace EitaaSharp.Client.Tests;

public class TransportTests
{
    /// <summary>Routes by host: a null body simulates a dead host (throws), bytes simulate success.</summary>
    private sealed class RoutingHandler(Func<Uri, byte[]?> route) : HttpMessageHandler
    {
        public List<Uri> Seen { get; } = new();

        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken ct)
        {
            Seen.Add(request.RequestUri!);
            var body = route(request.RequestUri!);
            return body is null
                ? Task.FromException<HttpResponseMessage>(new HttpRequestException("simulated dead host"))
                : Task.FromResult(new HttpResponseMessage(HttpStatusCode.OK) { Content = new ByteArrayContent(body) });
        }
    }

    [Fact]
    public async Task FailsOver_FromDeadHost_ToNextHost()
    {
        var handler = new RoutingHandler(uri => uri.Host == "good.example" ? new byte[] { 1, 2, 3 } : null);
        using var http = new HttpClient(handler);
        var transport = new HttpEitaaTransport(
            new[] { "https://dead.example/eitaa/index.php", "https://good.example/eitaa/index.php" }, http);

        var result = await transport.SendAsync(new byte[] { 9 });

        Assert.Equal(new byte[] { 1, 2, 3 }, result);
        Assert.Equal("dead.example", handler.Seen[0].Host);   // tried the dead host first
        Assert.Equal("good.example", handler.Seen[1].Host);   // then failed over
    }

    [Fact]
    public async Task AllHostsDead_Throws()
    {
        var handler = new RoutingHandler(_ => null);
        using var http = new HttpClient(handler);
        var transport = new HttpEitaaTransport(
            new[] { "https://a.example/x", "https://b.example/x" }, http, maxRetries: 1);

        await Assert.ThrowsAsync<HttpRequestException>(() => transport.SendAsync(new byte[] { 1 }));
    }

    [Fact]
    public void DefaultEndpoints_CoverAllHosts_WithIndexPhpPath()
    {
        var endpoints = HttpEitaaTransport.DefaultEndpoints();

        Assert.Equal(HttpEitaaTransport.DefaultHosts.Length, endpoints.Length);
        Assert.All(endpoints, e => Assert.EndsWith("/eitaa/index.php", e));
        // every configured host is represented (order is shuffled)
        Assert.True(HttpEitaaTransport.DefaultHosts.All(h => endpoints.Any(e => e.Contains(h))));
    }
}
