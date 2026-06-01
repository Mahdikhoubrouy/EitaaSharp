using EitaaSharp.Schema;
using Account = EitaaSharp.Schema.Account;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Sets (or clears) the signed-in user's public username.
    /// </summary>
    /// <param name="username">The new username without a leading <c>@</c>; pass an empty string to remove it.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns>The updated user.</returns>
    public Task<IUser> UpdateUsernameAsync(string username, CancellationToken cancellationToken = default)
        => CallAsync(new Account.UpdateUsername { Username = username }, cancellationToken);
}
