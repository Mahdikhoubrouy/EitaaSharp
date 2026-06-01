using EitaaSharp.Schema;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Fetches the server configuration (datacenter list, limits, feature flags).
    /// </summary>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns>The current server configuration.</returns>
    public Task<IConfig> GetConfigAsync(CancellationToken cancellationToken = default)
        => CallAsync(new EitaaSharp.Schema.Help.GetConfig(), cancellationToken);
}
