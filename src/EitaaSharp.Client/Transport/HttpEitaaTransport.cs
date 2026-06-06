using System.Net.Http.Headers;

namespace EitaaSharp.Client.Transport;

/// <summary>
/// HTTPS transport: POSTs the serialized envelope as the raw request body and returns the response
/// body. Mirrors the official client's connection model — datacenter 1 exposes the request under
/// <c>/eitaa/index.php</c> on several interchangeable hosts; this transport shuffles them on startup
/// and fails over to the next host on a network error, with bounded retry/back-off.
/// </summary>
public sealed class HttpEitaaTransport : IEitaaTransport, IDisposable
{
    /// <summary>The request path on every Eitaa datacenter host (from the Android client's WEB_ADD).</summary>
    public const string DefaultPath = "/eitaa/index.php";

    /// <summary>
    /// The interchangeable datacenter-1 hosts the official Android client ships (all HTTPS:443).
    /// Any of them serves the full API; the transport load-balances and fails over across them.
    /// </summary>
    public static readonly string[] DefaultHosts =
    {
        "fateme.eitaa.com", "alzheimer.eitaa.com",
        "ghasem.eitaa.com", "mohsen.eitaa.com", "hossein.eitaa.com",
        "armita.eitaa.com", "majid.eitaa.com", "mostafa.eitaa.com", "alireza.eitaa.com", "hosna.eitaa.com",
        "ghasem.eitaa.ir", "mohsen.eitaa.ir", "hossein.eitaa.ir",
        "armita.eitaa.ir", "majid.eitaa.ir", "mostafa.eitaa.ir", "alireza.eitaa.ir", "hosna.eitaa.ir",
    };

    /// <summary>A single canonical endpoint (kept for back-compat; the default uses the full host pool).</summary>
    public const string DefaultEndpoint = "https://fateme.eitaa.com" + DefaultPath;

    private readonly HttpClient _http;
    private readonly bool _ownsHttp;
    private readonly Uri[] _endpoints;
    private readonly int _maxRetries;
    private int _current; // index of the host that last worked; advanced on failure (failover)

    /// <summary>Creates a transport. With <paramref name="endpoint"/> null, uses the shuffled default host pool.</summary>
    public HttpEitaaTransport(
        string? endpoint = null,
        HttpClient? httpClient = null,
        TimeSpan? timeout = null,
        int maxRetries = 2)
        : this(endpoint is null ? DefaultEndpoints() : new[] { endpoint }, httpClient, timeout, maxRetries)
    {
    }

    /// <summary>Creates a transport over an explicit set of endpoints (tried in order, with failover).</summary>
    public HttpEitaaTransport(
        IEnumerable<string> endpoints,
        HttpClient? httpClient = null,
        TimeSpan? timeout = null,
        int maxRetries = 2)
    {
        ArgumentNullException.ThrowIfNull(endpoints);
        _endpoints = endpoints.Select(e => new Uri(e)).ToArray();
        if (_endpoints.Length == 0)
            throw new ArgumentException("At least one endpoint is required.", nameof(endpoints));

        _ownsHttp = httpClient is null;
        _http = httpClient ?? new HttpClient();
        if (timeout is { } t)
            _http.Timeout = t;
        _maxRetries = Math.Max(0, maxRetries);
    }

    /// <summary>The default host pool as full endpoint URLs, shuffled for load distribution.</summary>
    public static string[] DefaultEndpoints()
    {
        var endpoints = DefaultHosts.Select(h => $"https://{h}{DefaultPath}").ToArray();
        for (int i = endpoints.Length - 1; i > 0; i--) // Fisher–Yates, like Android's Collections.shuffle
        {
            int j = Random.Shared.Next(i + 1);
            (endpoints[i], endpoints[j]) = (endpoints[j], endpoints[i]);
        }
        return endpoints;
    }

    public async Task<byte[]> SendAsync(ReadOnlyMemory<byte> payload, CancellationToken cancellationToken = default)
    {
        int n = _endpoints.Length;
        int attempts = Math.Max(_maxRetries + 1, n); // try every host at least once
        int idx = Volatile.Read(ref _current);
        Exception? lastError = null;

        for (int attempt = 0; attempt < attempts; attempt++)
        {
            var endpoint = _endpoints[idx % n];
            try
            {
                using var content = new ReadOnlyMemoryContent(payload);
                content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");

                using var response = await _http.PostAsync(endpoint, content, cancellationToken).ConfigureAwait(false);
                response.EnsureSuccessStatusCode();

                Volatile.Write(ref _current, idx % n); // stick to the host that worked
                return await response.Content.ReadAsByteArrayAsync(cancellationToken).ConfigureAwait(false);
            }
            catch (Exception ex) when (IsTransient(ex, cancellationToken) && attempt + 1 < attempts)
            {
                lastError = ex;
                idx++; // fail over to the next host
                await Task.Delay(TimeSpan.FromMilliseconds(200 * (attempt + 1)), cancellationToken).ConfigureAwait(false);
            }
        }

        throw new HttpRequestException(
            $"Eitaa transport failed after {attempts} attempt(s) across {n} host(s).", lastError);
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
