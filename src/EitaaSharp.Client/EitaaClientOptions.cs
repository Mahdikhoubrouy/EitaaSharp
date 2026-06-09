using EitaaSharp.Client.Session;

namespace EitaaSharp.Client;

/// <summary>Configuration for an <see cref="EitaaClient"/>.</summary>
public sealed class EitaaClientOptions
{
    /// <summary>
    /// An explicit session (e.g. <see cref="JsonFileSession"/> for persistence). When set,
    /// <see cref="Token"/> and <see cref="Imei"/> are ignored.
    /// </summary>
    public IEitaaSession? Session { get; init; }

    /// <summary>The Eitaa account token. Optional — null/empty until sign-in. Ignored if <see cref="Session"/> is set.</summary>
    public string? Token { get; init; }

    /// <summary>A stable per-device identifier. Required unless <see cref="Session"/> is set.</summary>
    public string? Imei { get; init; }

    /// <summary>API id used by the no-argument <c>SendCodeAsync</c> overload. Defaults to Eitaa's public app id.</summary>
    public int ApiId { get; init; } = EitaaClient.DefaultApiId;

    /// <summary>API hash used by the no-argument <c>SendCodeAsync</c> overload. Defaults to Eitaa's public app hash.</summary>
    public string ApiHash { get; init; } = EitaaClient.DefaultApiHash;

    /// <summary>
    /// Optional handler invoked when a call fails because the session/token expired
    /// (<c>INVALID_LOGIN</c>, <c>AUTH_KEY_INVALID</c>, or an Eitaa token-updating response).
    /// It should obtain a fresh token, store it in the session, and return <c>true</c>; the failed
    /// call is then retried once. Return <c>false</c> to surface the original error.
    /// </summary>
    public Func<EitaaClient, CancellationToken, Task<bool>>? TokenRefreshHandler { get; init; }

    /// <summary>The TL layer advertised in the envelope. Matches the current Eitaa Android client (137).</summary>
    public int Layer { get; init; } = 137;

    /// <summary>The HTTPS endpoint. Defaults to the production Eitaa gateway.</summary>
    public string Endpoint { get; init; } = Transport.HttpEitaaTransport.DefaultEndpoint;

    /// <summary>Per-request timeout.</summary>
    public TimeSpan Timeout { get; init; } = TimeSpan.FromSeconds(30);

    /// <summary>Number of transient-failure retries before giving up.</summary>
    public int MaxRetries { get; init; } = 2;
}
