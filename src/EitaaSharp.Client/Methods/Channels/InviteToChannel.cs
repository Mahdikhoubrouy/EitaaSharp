using EitaaSharp.Schema;
using Channels = EitaaSharp.Schema.Channels;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Adds one or more users to a channel or supergroup.
    /// </summary>
    /// <param name="channelId">Id of the target channel.</param>
    /// <param name="userIds">Ids of the users to add (access hashes come from the peer cache).</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns>The server updates reflecting the added members.</returns>
    public Task<IUpdates> InviteToChannelAsync(
        long channelId, long[] userIds, CancellationToken cancellationToken = default)
        => CallAsync(new Channels.InviteToChannel
        {
            Channel = _peers.Channel(channelId),
            Users = Array.ConvertAll<long, IInputUser>(userIds, _peers.User),
        }, cancellationToken);
}
