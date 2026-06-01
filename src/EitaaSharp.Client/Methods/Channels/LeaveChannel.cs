using EitaaSharp.Schema;
using Channels = EitaaSharp.Schema.Channels;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Leaves a channel or supergroup by id.
    /// </summary>
    /// <param name="channelId">Id of the channel to leave.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns>The server updates reflecting the removed membership.</returns>
    public Task<IUpdates> LeaveChannelAsync(long channelId, CancellationToken cancellationToken = default)
        => CallAsync(new Channels.LeaveChannel { Channel = _peers.Channel(channelId) }, cancellationToken);
}
