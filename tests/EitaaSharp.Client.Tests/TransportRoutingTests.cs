using System.Net;
using EitaaSharp.Client.Transport;

namespace EitaaSharp.Client.Tests;

public class TransportRoutingTests
{
    /// <summary>Records the URI of every request and returns a canned 200.</summary>
    private sealed class RecordingHandler : HttpMessageHandler
    {
        public List<Uri> Requests { get; } = new();

        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            Requests.Add(request.RequestUri!);
            return Task.FromResult(new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new ByteArrayContent(new byte[] { 1, 2, 3, 4 }),
            });
        }
    }

    [Fact]
    public async Task RoutesEachKindToItsHostGroup_OnTheIndexPhpPath()
    {
        var handler = new RecordingHandler();
        using var http = new HttpClient(handler);
        using var transport = new HttpEitaaTransport(endpoint: null, httpClient: http);

        await transport.SendAsync(new byte[] { 0 }, ConnectionKind.Download);
        await transport.SendAsync(new byte[] { 0 }, ConnectionKind.Upload);
        await transport.SendAsync(new byte[] { 0 }, ConnectionKind.Generic);

        // download -> a download host; upload & generic -> an upload-capable (primary) host.
        Assert.Contains(handler.Requests[0].Host, HttpEitaaTransport.DownloadHosts);
        Assert.Contains(handler.Requests[1].Host, HttpEitaaTransport.PrimaryHosts);
        Assert.Contains(handler.Requests[2].Host, HttpEitaaTransport.PrimaryHosts);

        // upload and generic share one pinned host (so saveFilePart + sendMedia co-locate).
        Assert.Equal(handler.Requests[1].Host, handler.Requests[2].Host);

        // every request uses the canonical Eitaa path.
        Assert.All(handler.Requests, u => Assert.Equal(HttpEitaaTransport.DefaultPath, u.AbsolutePath));
    }

    [Fact]
    public async Task ExplicitEndpoint_OverridesRouting_ForAllKinds()
    {
        var handler = new RecordingHandler();
        using var http = new HttpClient(handler);
        using var transport = new HttpEitaaTransport("https://custom.example/eitaa/index.php", http);

        await transport.SendAsync(new byte[] { 0 }, ConnectionKind.Upload);
        await transport.SendAsync(new byte[] { 0 }, ConnectionKind.Download);

        Assert.All(handler.Requests, u => Assert.Equal("custom.example", u.Host));
    }
}
