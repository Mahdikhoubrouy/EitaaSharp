using Account = EitaaSharp.Schema.Account;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Fetches the chat wallpapers offered by Eitaa.
    /// </summary>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns>The available wallpapers.</returns>
    public Task<Account.IWallPapers> GetWallPapersAsync(CancellationToken cancellationToken = default)
        => CallAsync(new Account.GetWallPapers { Hash = 0 }, cancellationToken);
}
