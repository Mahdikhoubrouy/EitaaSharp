using EitaaSharp.Schema;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Asks the server which datacenter is nearest to the caller.
    /// </summary>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns>The nearest-datacenter info (current and nearest dc ids, detected country).</returns>
    public Task<INearestDc> GetNearestDcAsync(CancellationToken cancellationToken = default)
        => CallAsync(new EitaaSharp.Schema.Help.GetNearestDc(), cancellationToken);
}
