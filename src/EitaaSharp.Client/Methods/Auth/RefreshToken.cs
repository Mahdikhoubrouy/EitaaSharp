using EitaaSharp.Schema;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Renews the Eitaa session token (Eitaa-specific <c>eitaaRefreshToken</c> call).
    /// </summary>
    /// <param name="appInfo">Client/app descriptor identifying this device to Eitaa.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns>The refreshed-token response from the server.</returns>
    public Task<IEitaaRefreshToken> RefreshTokenAsync(
        IEitaaAppInfo appInfo, CancellationToken cancellationToken = default)
        => CallAsync(new EitaaRefreshToken { AppInfo = appInfo }, cancellationToken);
}
