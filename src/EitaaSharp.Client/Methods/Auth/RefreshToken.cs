using EitaaSharp.Client.Rpc;
using EitaaSharp.Schema;
using Mt = EitaaSharp.Schema.Mt;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    private readonly SemaphoreSlim _refreshLock = new(1, 1);

    /// <summary>
    /// Called after every successful token renewal with the new token and its expiry. See
    /// <see cref="EitaaClientOptions.OnTokenRefreshed"/>.
    /// </summary>
    public Func<EitaaClient, TokenRefreshedEventArgs, CancellationToken, Task>? OnTokenRefreshed { get; set; }

    /// <summary>
    /// Renews the Eitaa session token (Eitaa-specific <c>eitaaRefreshToken</c> call) and stores the
    /// new token in <see cref="Session"/>. The server answers with <c>eitaa_updates_token</c>, which
    /// carries the fresh <c>token</c>.
    /// </summary>
    /// <param name="appInfo">Client/app descriptor identifying this device to Eitaa.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns>The token response (new token + expiry).</returns>
    public async Task<Mt.IEitaaUpdatesToken> RefreshTokenAsync(
        Mt.IEitaaAppInfo appInfo, CancellationToken cancellationToken = default)
    {
        var result = await CallAsync(new Mt.EitaaRefreshToken { AppInfo = appInfo }, cancellationToken)
            .ConfigureAwait(false);
        await StoreRefreshedTokenAsync(result, cancellationToken).ConfigureAwait(false);
        return result;
    }

    /// <summary>
    /// Renews the token without going through the refresh-retry wrapper — so it is safe to call from inside a
    /// custom <see cref="TokenRefreshHandler"/> — and returns whether a fresh token is now in the session.
    /// <para>
    /// Concurrent callers are collapsed: whoever waited for the refresh lock while another caller renewed the
    /// token returns <c>true</c> without asking Eitaa again. Without that, every call that failed on the same
    /// expired token would each fetch a new one, and each could invalidate the one before it.
    /// </para>
    /// </summary>
    public async Task<bool> TryRefreshTokenAsync(CancellationToken cancellationToken = default)
    {
        var before = _session.Token;

        await _refreshLock.WaitAsync(cancellationToken).ConfigureAwait(false);
        try
        {
            if (!string.Equals(_session.Token, before, StringComparison.Ordinal) && !string.IsNullOrEmpty(_session.Token))
                return true; // renewed by whoever held the lock before us

            var result = await _rpc.CallAsync(
                new Mt.EitaaRefreshToken { AppInfo = _appInfo ?? DefaultAppInfo() }, cancellationToken)
                .ConfigureAwait(false);
            return await StoreRefreshedTokenAsync(result, cancellationToken).ConfigureAwait(false);
        }
        catch (SessionExpiredException)
        {
            return false; // the refresh itself was rejected — surface the original error
        }
        finally
        {
            _refreshLock.Release();
        }
    }

    /// <summary>
    /// Default <see cref="TokenRefreshHandler"/> (used unless one is supplied via options): mirrors the
    /// Android client — on an expired/updating session it calls <c>eitaaRefreshToken</c>, stores the new
    /// token, and reports success so the failed call is retried.
    /// </summary>
    private Task<bool> DefaultTokenRefreshAsync(EitaaClient client, CancellationToken cancellationToken)
        => TryRefreshTokenAsync(cancellationToken);

    private async Task<bool> StoreRefreshedTokenAsync(Mt.IEitaaUpdatesToken result, CancellationToken cancellationToken)
    {
        if (result is not Mt.EitaaUpdatesToken token || string.IsNullOrEmpty(token.Token))
            return false;

        _session.Token = token.Token;
        await _session.SaveAsync(cancellationToken).ConfigureAwait(false);

        if (OnTokenRefreshed is { } callback)
        {
            var expiresAt = token.Expire > 0 ? DateTimeOffset.FromUnixTimeSeconds(token.Expire) : (DateTimeOffset?)null;
            await callback(this, new TokenRefreshedEventArgs(token.Token, expiresAt, token.SocketToken), cancellationToken)
                .ConfigureAwait(false);
        }

        return true;
    }

    /// <summary>A neutral app descriptor for the token refresh when the caller didn't supply one.</summary>
    private static Mt.EitaaAppInfo DefaultAppInfo() => new()
    {
        BuildVersion = 0,
        DeviceModel = "EitaaSharp",
        SystemVersion = ".NET",
        AppVersion = "EitaaSharp",
        LangCode = "en",
        Sign = string.Empty,
    };
}
