namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Fetches the current update state (pts/qts/seq/date), the starting point for polling updates.
    /// </summary>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns>The current update state.</returns>
    public Task<EitaaSharp.Schema.Updates.IState> GetStateAsync(CancellationToken cancellationToken = default)
        => CallAsync(new EitaaSharp.Schema.Updates.GetState(), cancellationToken);
}
