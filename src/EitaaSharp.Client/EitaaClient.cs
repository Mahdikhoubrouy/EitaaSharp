using EitaaSharp.Client.Files;
using EitaaSharp.Client.Rpc;
using EitaaSharp.Client.Session;
using EitaaSharp.Client.Transport;
using EitaaSharp.Client.Updates;
using EitaaSharp.Schema;
using EitaaSharp.Tl;
using Auth = EitaaSharp.Schema.Auth;

namespace EitaaSharp.Client;

/// <summary>
/// High-level, strongly-typed Eitaa client — the C# counterpart of Pyrogram's <c>Client</c>.
/// The convenience methods are split by category into the <c>Methods/EitaaClient.*.cs</c>
/// partials; anything not wrapped is reachable via <see cref="InvokeAsync{TResult}"/> over the
/// generated raw TL records.
/// </summary>
public sealed partial class EitaaClient : IDisposable
{
    // Eitaa ignores api_id/api_hash for sendCode (auth comes from the token/imei envelope) and
    // actually rejects the "official" app id with "can't send activation code". The working JS
    // reference sends empty values, so we default to the same.

    /// <summary>Default API id sent with <c>sendCode</c>. Eitaa ignores it; defaults to 0 (empty), which works.</summary>
    public const int DefaultApiId = 0;

    /// <summary>Default API hash sent with <c>sendCode</c>. Eitaa ignores it; defaults to empty, which works.</summary>
    public const string DefaultApiHash = "";

    private readonly IDisposable? _ownedTransport;
    private readonly EitaaRpc _rpc;
    private readonly IEitaaSession _session;
    private readonly global::EitaaSharp.Schema.Mt.IEitaaAppInfo? _appInfo;
    private readonly bool _autoFloodWait = true;
    private readonly int _maxFloodWaitSeconds = 60;

    // Methods the server serves only over the official client's socket (they answer INVALID_CONSTRUCTOR
    // over HTTP) — skipped from then on, mirroring the web client's `eitaaNoSend` list. Seeded with
    // messages.setTyping; grown automatically the first time any method is rejected this way.
    private readonly System.Collections.Concurrent.ConcurrentDictionary<Type, byte> _unsupportedMethods =
        new(new[] { new KeyValuePair<Type, byte>(typeof(global::EitaaSharp.Schema.Messages.SetTyping), (byte)0) });

    private readonly PeerResolver _peers;
    private readonly UpdateDispatcher _dispatcher = new();
    private FileUploader? _uploads;
    private FileDownloader? _downloads;

    /// <summary>API id sent with <see cref="SendCodeAsync(string, System.Threading.CancellationToken)"/> when not given explicitly.</summary>
    public int ApiId { get; set; } = DefaultApiId;

    /// <summary>API hash sent with <see cref="SendCodeAsync(string, System.Threading.CancellationToken)"/> when not given explicitly.</summary>
    public string ApiHash { get; set; } = DefaultApiHash;

    /// <summary>The session backing this client (token, imei, peer cache).</summary>
    public IEitaaSession Session => _session;

    /// <summary>Resolves peers to <c>InputPeer</c>/<c>InputChannel</c>/<c>InputUser</c> using the learned access-hash cache.</summary>
    public PeerResolver Peers => _peers;

    /// <summary>Chunked file upload (<c>upload.saveFilePart</c> / <c>saveBigFilePart</c>).</summary>
    public FileUploader Uploads => _uploads ??= new FileUploader(_rpc);

    /// <summary>Chunked file download (<c>upload.getFile</c>).</summary>
    public FileDownloader Downloads => _downloads ??= new FileDownloader(_rpc);

    /// <summary>True once an authorization has been received this session.</summary>
    public bool IsAuthorized { get; private set; }

    /// <summary>
    /// Invoked when a call fails because the session/token expired. It should obtain a fresh token,
    /// store it in <see cref="Session"/>, and return <c>true</c>; the failed call is then retried once.
    /// Returning <c>false</c> (or leaving this <c>null</c>) lets the original error propagate.
    /// </summary>
    public Func<EitaaClient, CancellationToken, Task<bool>>? TokenRefreshHandler { get; set; }

    /// <summary>Raised after a successful sign-in/sign-up.</summary>
    public event EventHandler<Auth.IAuthorization>? Authorized;

    /// <summary>Raised for every <see cref="IUpdates"/> container returned by any call.</summary>
    public event EventHandler<IUpdates>? UpdatesReceived
    {
        add => _dispatcher.UpdatesReceived += value;
        remove => _dispatcher.UpdatesReceived -= value;
    }

    /// <summary>Raised for every individual <see cref="IUpdate"/> extracted from a container.</summary>
    public event EventHandler<IUpdate>? UpdateReceived
    {
        add => _dispatcher.UpdateReceived += value;
        remove => _dispatcher.UpdateReceived -= value;
    }

    public EitaaClient(EitaaClientOptions options)
    {
        ArgumentNullException.ThrowIfNull(options);

        _session = options.Session ?? new MemorySession(
            options.Imei ?? throw new ArgumentException("Imei or Session is required", nameof(options)),
            options.Token);

        var transport = new HttpEitaaTransport(options.Endpoint, timeout: options.Timeout, maxRetries: options.MaxRetries);
        _ownedTransport = transport;
        _rpc = new EitaaRpc(transport, _session, options.Layer);
        _peers = new PeerResolver(_session);
        _appInfo = options.AppInfo;
        _autoFloodWait = options.AutoFloodWait;
        _maxFloodWaitSeconds = options.MaxFloodWaitSeconds;
        // Mirror the Android client: refresh the token automatically on expiry unless the caller
        // supplied their own handler (or explicitly disabled it).
        TokenRefreshHandler = options.TokenRefreshHandler
            ?? (options.AutoRefreshToken ? DefaultTokenRefreshAsync : null);
        ApiId = options.ApiId;
        ApiHash = options.ApiHash;
    }

    /// <summary>Creates a client over a custom transport and session (for testing or alternative channels).</summary>
    public EitaaClient(IEitaaTransport transport, IEitaaSession session, int layer = 133)
    {
        ArgumentNullException.ThrowIfNull(transport);
        _session = session;
        _ownedTransport = transport as IDisposable;
        _rpc = new EitaaRpc(transport, session, layer);
        _peers = new PeerResolver(_session);
    }

    /// <summary>Creates a client over a custom transport with a fixed token/imei (for testing).</summary>
    public EitaaClient(IEitaaTransport transport, string token, string imei, int layer = 133)
        : this(transport, new MemorySession(imei, token), layer)
    {
    }

    /// <summary>
    /// Calls any TL method and returns its typed result. Any <see cref="IUpdates"/> result is
    /// dispatched to update events, an expired token is refreshed and the call retried, and a
    /// <c>FLOOD_WAIT</c> is waited out. A method the server answers with <c>INVALID_CONSTRUCTOR</c>
    /// (i.e. it is served only over the official client's socket, like <c>messages.setTyping</c>) is
    /// remembered and skipped from then on, returning <c>default</c> — mirroring the web client's
    /// <c>eitaaNoSend</c> list.
    /// </summary>
    public async Task<TResult> CallAsync<TResult>(ITlMethod<TResult> method, CancellationToken cancellationToken = default)
    {
        if (_unsupportedMethods.ContainsKey(method.GetType()))
            return default!;
        try
        {
            var result = await WithRefreshRetryAsync(ct => _rpc.CallAsync(method, ct), cancellationToken).ConfigureAwait(false);
            OnResult(result);
            return result;
        }
        catch (RpcException ex) when (ex.IsInvalidConstructor)
        {
            _unsupportedMethods.TryAdd(method.GetType(), 0);
            return default!;
        }
    }

    /// <summary>Calls any TL method and returns the raw deserialized object (with the same auto-refresh + eitaaNoSend behavior).</summary>
    public async Task<ITlObject> CallObjectAsync(ITlObject method, CancellationToken cancellationToken = default)
    {
        if (_unsupportedMethods.ContainsKey(method.GetType()))
            return default!;
        ITlObject result;
        try
        {
            result = await WithRefreshRetryAsync(ct => _rpc.CallObjectAsync(method, ct), cancellationToken).ConfigureAwait(false);
        }
        catch (RpcException ex) when (ex.IsInvalidConstructor)
        {
            _unsupportedMethods.TryAdd(method.GetType(), 0);
            return default!;
        }
        OnResult(result);
        return result;
    }

    /// <summary>
    /// Runs <paramref name="action"/> with the client's resilience policies: an expired session is
    /// refreshed once (via <see cref="TokenRefreshHandler"/>) and retried, and a <c>FLOOD_WAIT_x</c>
    /// (when <see cref="EitaaClientOptions.AutoFloodWait"/> is on) is waited out and retried, as long
    /// as the wait stays within <see cref="EitaaClientOptions.MaxFloodWaitSeconds"/>.
    /// </summary>
    private async Task<T> WithRefreshRetryAsync<T>(Func<CancellationToken, Task<T>> action, CancellationToken cancellationToken)
    {
        const int maxFloodRetries = 10;
        bool refreshed = false;
        int floodRetries = 0;
        while (true)
        {
            try
            {
                return await action(cancellationToken).ConfigureAwait(false);
            }
            catch (SessionExpiredException) when (!refreshed && TokenRefreshHandler is not null)
            {
                refreshed = true;
                if (!await TokenRefreshHandler(this, cancellationToken).ConfigureAwait(false))
                    throw;
                // token refreshed + stored in the session — loop to retry the original call.
            }
            catch (RpcException ex) when (_autoFloodWait && ex.IsFloodWait && floodRetries < maxFloodRetries
                                          && ex.Parameter is int seconds && seconds <= _maxFloodWaitSeconds)
            {
                floodRetries++;
                // Respect the server's cooldown (+1s margin) and retry.
                await Task.Delay(TimeSpan.FromSeconds(seconds + 1), cancellationToken).ConfigureAwait(false);
            }
        }
    }

    /// <summary>Alias for <see cref="CallAsync{TResult}"/> — invoke any raw TL method (the full ~423-method API).</summary>
    public Task<TResult> InvokeAsync<TResult>(ITlMethod<TResult> method, CancellationToken cancellationToken = default)
        => CallAsync(method, cancellationToken);

    /// <summary>A fresh 64-bit random id for message/media de-duplication.</summary>
    private static long RandomId() => Random.Shared.NextInt64();

    private void OnResult(object? result)
    {
        _peers.Learn(result);
        if (result is IUpdates updates)
            _dispatcher.Dispatch(updates);
    }

    private async Task OnAuthorizedAsync(Auth.IAuthorization auth, CancellationToken cancellationToken)
    {
        IsAuthorized = true;

        // Eitaa's auth.authorization carries the session token — persist it.
        if (auth is Auth.Authorization { Token: { Length: > 0 } token })
        {
            _session.Token = token;
            await _session.SaveAsync(cancellationToken).ConfigureAwait(false);
        }

        Authorized?.Invoke(this, auth);
    }

    public void Dispose() => _ownedTransport?.Dispose();
}
