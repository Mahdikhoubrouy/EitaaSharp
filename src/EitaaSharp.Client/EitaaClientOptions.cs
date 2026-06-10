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

    /// <summary>
    /// When <c>true</c> (the default) and no <see cref="TokenRefreshHandler"/> is supplied, the client
    /// refreshes an expired token automatically via <c>eitaaRefreshToken</c> and retries the call —
    /// the same behaviour as the official Android client. Set <c>false</c> to surface the error instead.
    /// </summary>
    public bool AutoRefreshToken { get; init; } = true;

    /// <summary>
    /// Optional device descriptor sent with the automatic token refresh. A neutral EitaaSharp
    /// descriptor is used when null.
    /// </summary>
    public EitaaSharp.Schema.Mt.IEitaaAppInfo? AppInfo { get; init; }

    /// <summary>
    /// When <c>true</c> (the default), a <c>FLOOD_WAIT_x</c> error is handled by waiting the requested
    /// number of seconds and retrying automatically (up to <see cref="MaxFloodWaitSeconds"/>). Set
    /// <c>false</c> to surface the <see cref="Rpc.RpcException"/> instead.
    /// </summary>
    public bool AutoFloodWait { get; init; } = true;

    /// <summary>
    /// The longest <c>FLOOD_WAIT</c> the client waits out automatically. A longer wait is surfaced as an
    /// error so the caller can decide. Default 60 seconds.
    /// </summary>
    public int MaxFloodWaitSeconds { get; init; } = 60;

    /// <summary>The TL layer advertised in the envelope. Matches the current Eitaa Android client (137).</summary>
    public int Layer { get; init; } = 137;

    /// <summary>
    /// A single HTTPS endpoint to use. When null (the default), the client load-balances and fails
    /// over across the official Eitaa datacenter-1 host pool (<see cref="Transport.HttpEitaaTransport.DefaultHosts"/>).
    /// </summary>
    public string? Endpoint { get; init; }

    /// <summary>Per-request timeout.</summary>
    public TimeSpan Timeout { get; init; } = TimeSpan.FromSeconds(30);

    /// <summary>Number of transient-failure retries before giving up.</summary>
    public int MaxRetries { get; init; } = 2;
}
