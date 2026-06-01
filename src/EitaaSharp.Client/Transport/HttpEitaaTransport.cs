using System.Net.Http.Headers;

namespace EitaaSharp.Client.Transport;

/// <summary>
/// HTTPS transport: POSTs the serialized envelope as the raw request body to the
/// Eitaa endpoint and returns the response body. Adds timeout and bounded retry on
/// transient network failures — the missing robustness noted in the JS source.
/// </summary>
public sealed class HttpEitaaTransport : IEitaaTransport, IDisposable
{
    public const string DefaultEndpoint = "https://fateme.eitaa.com/eitaa/";

    private readonly HttpClient _http;
    private readonly bool _ownsHttp;
    private readonly Uri _endpoint;
    private readonly int _maxRetries;

    public HttpEitaaTransport(
        string? endpoint = null,
        HttpClient? httpClient = null,
        TimeSpan? timeout = null,
        int maxRetries = 2)
    {
        _endpoint = new Uri(endpoint ?? DefaultEndpoint);
        _ownsHttp = httpClient is null;
        _http = httpClient ?? new HttpClient();
        if (timeout is { } t)
            _http.Timeout = t;
        _maxRetries = Math.Max(0, maxRetries);
    }

    public async Task<byte[]> SendAsync(ReadOnlyMemory<byte> payload, CancellationToken cancellationToken = default)
    {
        HttpRequestException? lastError = null;

        for (int attempt = 0; attempt <= _maxRetries; attempt++)
        {
            try
            {
                using var content = new ReadOnlyMemoryContent(payload);
                content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");

                using var response = await _http.PostAsync(_endpoint, content, cancellationToken)
                    .ConfigureAwait(false);
                response.EnsureSuccessStatusCode();

                return await response.Content.ReadAsByteArrayAsync(cancellationToken).ConfigureAwait(false);
            }
            catch (HttpRequestException ex) when (attempt < _maxRetries)
            {
                lastError = ex;
                await Task.Delay(TimeSpan.FromMilliseconds(200 * (attempt + 1)), cancellationToken)
                    .ConfigureAwait(false);
            }
        }

        throw new HttpRequestException(
            $"Eitaa transport failed after {_maxRetries + 1} attempt(s).", lastError);
    }

    public void Dispose()
    {
        if (_ownsHttp)
            _http.Dispose();
    }
}
