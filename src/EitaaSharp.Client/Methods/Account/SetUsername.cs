using Account = EitaaSharp.Schema.Account;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>Sets (or clears) the signed-in user's public username.</summary>
    /// <param name="username">The new username without a leading '@'; empty to remove it.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns><c>true</c> on success.</returns>
    public async Task<bool> SetUsernameAsync(string username, CancellationToken cancellationToken = default)
    {
        await CallAsync(new Account.UpdateUsername { Username = username }, cancellationToken).ConfigureAwait(false);
        return true;
    }
}
