using Auth = EitaaSharp.Schema.Auth;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Ends the current session on the server and clears the in-memory authorized flag.
    /// The stored token in <see cref="Session"/> is left untouched — clear it yourself if you want a fresh login.
    /// </summary>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns><c>true</c> if the server accepted the logout.</returns>
    public async Task<bool> LogOutAsync(CancellationToken cancellationToken = default)
    {
        var result = await CallAsync(new Auth.LogOut(), cancellationToken).ConfigureAwait(false);
        IsAuthorized = false;
        return result;
    }
}
