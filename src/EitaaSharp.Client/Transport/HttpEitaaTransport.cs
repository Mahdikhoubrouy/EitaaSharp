using System.Net.Http.Headers;

namespace EitaaSharp.Client.Transport;

/// <summary>
/// HTTPS transport: POSTs the serialized envelope as the raw request body and returns the response
/// body. Mirrors the official client's connection model — datacenter 1 is reached over several
/// interchangeable hosts under <c>/eitaa/index.php</c>, split into three groups by purpose
/// (generic / download / upload). Each <see cref="ConnectionKind"/> is routed to its own group,
/// shuffled on startup and failed over host-by-host on a network error, with bounded back-off.
/// </summary>
public sealed class HttpEitaaTransport : IEitaaTransport, IDisposable
{
    /// <summary>The request path on every Eitaa datacenter host (from the Android client's WEB_ADD).</summary>
    public const string DefaultPath = "/eitaa/index.php";

    /// <summary>Generic-API hosts (Android datacenter-1, flag 0 / connectionType 0).</summary>
    public static readonly string[] GenericHosts =
    {
        "armita.eitaa.com", "majid.eitaa.com", "mostafa.eitaa.com", "alireza.eitaa.com", "hosna.eitaa.com",
        "armita.eitaa.ir", "majid.eitaa.ir", "mostafa.eitaa.ir", "alireza.eitaa.ir", "hosna.eitaa.ir",
    };

    /// <summary>Download hosts for <c>upload.getFile</c> (Android flag 2 / connectionType 2).</summary>
    public static readonly string[] DownloadHosts =
    {
        "ghasem.eitaa.com", "mohsen.eitaa.com", "hossein.eitaa.com",
        "ghasem.eitaa.ir", "mohsen.eitaa.ir", "hossein.eitaa.ir",
    };

    /// <summary>Upload hosts for <c>upload.saveFilePart</c>/<c>saveBigFilePart</c> (Android flag 4 / connectionType 4).</summary>
    public static readonly string[] UploadHosts =
    {
        "alzheimer.eitaa.com", "fateme.eitaa.com",
    };

    /// <summary>
    /// The hosts the default session is pinned to. These are the upload-capable datacenter-1 hosts —
    /// they serve generic, download and upload, and (unlike the generic-only hosts) keep an uploaded
    /// file's parts reachable for the follow-up <c>sendMedia</c>. The list provides failover.
    /// </summary>
    public static readonly string[] PrimaryHosts = UploadHosts;

    /// <summary>Every datacenter-1 host across all groups.</summary>
    public static readonly string[] DefaultHosts =
        GenericHosts.Concat(DownloadHosts).Concat(UploadHosts).ToArray();

    /// <summary>A single canonical endpoint (kept for back-compat; the default uses the host groups).</summary>
    public const string DefaultEndpoint = "https://fateme.eitaa.com" + DefaultPath;

    /// <summary>A shuffled, failover-capable list of endpoints for one connection kind.</summary>
    private sealed class Pool(Uri[] endpoints)
    {
        public readonly Uri[] Endpoints = endpoints;
        public int Current;
    }

    private readonly HttpClient _http;
    private readonly bool _ownsHttp;
    private readonly int _maxRetries;
    private readonly Pool _generic;
    private readonly Pool _download;
    private readonly Pool _upload;

    /// <summary>Creates a transport. With <paramref name="endpoint"/> null, uses the shuffled host groups.</summary>
    public HttpEitaaTransport(
        string? endpoint = null,
        HttpClient? httpClient = null,
        TimeSpan? timeout = null,
        int maxRetries = 2)
    {
        _ownsHttp = httpClient is null;
        _http = httpClient ?? new HttpClient();
        if (timeout is { } t)
            _http.Timeout = t;
        _maxRetries = Math.Max(0, maxRetries);

        if (endpoint is null)
        {
            // Generic + upload share ONE sticky pool over the upload-capable hosts. Eitaa's HTTP gateway
            // stores upload parts on the *instance* that received them, so saveFilePart and the follow-up
            // messages.sendMedia must reach the same host — uploads only succeed when pinned to one
            // upload-capable host. Downloads address a file globally (upload.getFile) and are served by a
            // dedicated host group, exactly like the Android client; using the upload hosts for downloads
            // gets RETRY_LIMIT.
            var primary = new Pool(Shuffle(EndpointsFor(PrimaryHosts)));
            _generic = _upload = primary;
            _download = new Pool(Shuffle(EndpointsFor(DownloadHosts)));
        }
        else
        {
            // An explicit endpoint overrides routing: every kind uses it.
            var shared = new Pool(new[] { new Uri(endpoint) });
            _generic = _download = _upload = shared;
        }
    }

    /// <summary>Creates a transport over an explicit set of endpoints (shared by all kinds, with failover).</summary>
    public HttpEitaaTransport(
        IEnumerable<string> endpoints,
        HttpClient? httpClient = null,
        TimeSpan? timeout = null,
        int maxRetries = 2)
    {
        ArgumentNullException.ThrowIfNull(endpoints);
        var uris = endpoints.Select(e => new Uri(e)).ToArray();
        if (uris.Length == 0)
            throw new ArgumentException("At least one endpoint is required.", nameof(endpoints));

        _ownsHttp = httpClient is null;
        _http = httpClient ?? new HttpClient();
        if (timeout is { } t)
            _http.Timeout = t;
        _maxRetries = Math.Max(0, maxRetries);

        var shared = new Pool(uris);
        _generic = _download = _upload = shared;
    }

    /// <summary>All datacenter-1 hosts as full endpoint URLs, shuffled.</summary>
    public static string[] DefaultEndpoints() => Shuffle(EndpointsFor(DefaultHosts)).Select(u => u.ToString()).ToArray();

    public Task<byte[]> SendAsync(ReadOnlyMemory<byte> payload, CancellationToken cancellationToken = default)
        => SendAsync(payload, ConnectionKind.Generic, cancellationToken);

    public async Task<byte[]> SendAsync(
        ReadOnlyMemory<byte> payload, ConnectionKind kind, CancellationToken cancellationToken = default)
    {
        var pool = kind switch
        {
            ConnectionKind.Download => _download,
            ConnectionKind.Upload => _upload,
            _ => _generic,
        };

        int n = pool.Endpoints.Length;
        int attempts = Math.Max(_maxRetries + 1, n); // try every host in the group at least once
        int idx = Volatile.Read(ref pool.Current);
        Exception? lastError = null;

        for (int attempt = 0; attempt < attempts; attempt++)
        {
            var endpoint = pool.Endpoints[idx % n];
            try
            {
                using var content = new ReadOnlyMemoryContent(payload);
                content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");

                using var response = await _http.PostAsync(endpoint, content, cancellationToken).ConfigureAwait(false);
                response.EnsureSuccessStatusCode();

                Volatile.Write(ref pool.Current, idx % n); // stick to the host that worked
                return await response.Content.ReadAsByteArrayAsync(cancellationToken).ConfigureAwait(false);
            }
            catch (Exception ex) when (IsTransient(ex, cancellationToken) && attempt + 1 < attempts)
            {
                lastError = ex;
                idx++; // fail over to the next host in the group
                await Task.Delay(TimeSpan.FromMilliseconds(200 * (attempt + 1)), cancellationToken).ConfigureAwait(false);
            }
        }

        throw new HttpRequestException(
            $"Eitaa {kind} transport failed after {attempts} attempt(s) across {n} host(s).", lastError);
    }

    private static Uri[] EndpointsFor(string[] hosts) => hosts.Select(h => new Uri($"https://{h}{DefaultPath}")).ToArray();

    private static Uri[] Shuffle(Uri[] items)
    {
        for (int i = items.Length - 1; i > 0; i--) // Fisher–Yates, like Android's Collections.shuffle
        {
            int j = Random.Shared.Next(i + 1);
            (items[i], items[j]) = (items[j], items[i]);
        }
        return items;
    }

    // A network error or a per-request timeout (not a caller cancellation) is worth retrying elsewhere.
    private static bool IsTransient(Exception ex, CancellationToken ct)
        => !ct.IsCancellationRequested && ex is HttpRequestException or TaskCanceledException or TimeoutException;

    public void Dispose()
    {
        if (_ownsHttp)
            _http.Dispose();
    }
}
