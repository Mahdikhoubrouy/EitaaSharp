using EitaaSharp.Schema;
using Users = EitaaSharp.Schema.Users;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Fetches the full profile of a user by id (bio, common chats, settings).
    /// </summary>
    /// <param name="userId">Id of the user (access hash comes from the peer cache).</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns>The user's full profile.</returns>
    public Task<IUserFull> GetFullUserAsync(long userId, CancellationToken cancellationToken = default)
        => CallAsync(new Users.GetFullUser { Id = _peers.User(userId) }, cancellationToken);
}
