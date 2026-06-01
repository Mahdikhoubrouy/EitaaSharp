using EitaaSharp.Schema;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Fetches the basic info (name, username, photo) of several users at once.
    /// </summary>
    /// <param name="userIds">Ids of the users to fetch (access hashes come from the peer cache).</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns>The requested users.</returns>
    public Task<IUser[]> GetUsersAsync(long[] userIds, CancellationToken cancellationToken = default)
        => CallAsync(new EitaaSharp.Schema.Users.GetUsers
        {
            Id = Array.ConvertAll<long, IInputUser>(userIds, _peers.User),
        }, cancellationToken);
}
