using EitaaSharp.Schema;
using Channels = EitaaSharp.Schema.Channels;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Joins a public channel or supergroup by id. The channel's access hash is taken from the
    /// peer cache, so the channel must have been seen in a previous response.
    /// </summary>
    /// <param name="channelId">Id of the channel to join.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns>The server updates reflecting the new membership.</returns>
    public Task<IUpdates> JoinChannelAsync(long channelId, CancellationToken cancellationToken = default)
        => CallAsync(new Channels.JoinChannel { Channel = _peers.Channel(channelId) }, cancellationToken);
}
