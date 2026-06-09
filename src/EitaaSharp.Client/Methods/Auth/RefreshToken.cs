using EitaaSharp.Client.Rpc;
using EitaaSharp.Schema;
using Mt = EitaaSharp.Schema.Mt;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    private readonly SemaphoreSlim _refreshLock = new(1, 1);

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
    /// Default <see cref="TokenRefreshHandler"/> (used unless one is supplied via options): mirrors the
    /// Android client — on an expired/updating session it calls <c>eitaaRefreshToken</c>, stores the new
    /// token, and reports success so the failed call is retried. Goes straight through the transport to
    /// avoid recursing back into the refresh-retry wrapper.
    /// </summary>
    private async Task<bool> DefaultTokenRefreshAsync(EitaaClient client, CancellationToken cancellationToken)
    {
        await _refreshLock.WaitAsync(cancellationToken).ConfigureAwait(false);
        try
        {
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

    private async Task<bool> StoreRefreshedTokenAsync(Mt.IEitaaUpdatesToken result, CancellationToken cancellationToken)
    {
        if (result is not Mt.EitaaUpdatesToken token || string.IsNullOrEmpty(token.Token))
            return false;

        _session.Token = token.Token;
        await _session.SaveAsync(cancellationToken).ConfigureAwait(false);
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
