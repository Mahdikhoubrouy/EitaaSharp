using EitaaSharp.Schema;
using Users = EitaaSharp.Schema.Users;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Fetches the full profile of the currently signed-in user (the "me" account).
    /// </summary>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns>The current user's full profile.</returns>
    public Task<IUserFull> GetMeAsync(CancellationToken cancellationToken = default)
        => CallAsync(new Users.GetFullUser { Id = new InputUserSelf() }, cancellationToken);
}
