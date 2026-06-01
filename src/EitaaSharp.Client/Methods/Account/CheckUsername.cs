using Account = EitaaSharp.Schema.Account;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Checks whether a username is free to take for the signed-in account.
    /// </summary>
    /// <param name="username">The username to check (without a leading <c>@</c>).</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns><c>true</c> if the username is available.</returns>
    public Task<bool> CheckUsernameAsync(string username, CancellationToken cancellationToken = default)
        => CallAsync(new Account.CheckUsername { Username = username }, cancellationToken);
}
