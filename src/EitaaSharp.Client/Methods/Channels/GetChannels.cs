using EitaaSharp.Schema;
using Channels = EitaaSharp.Schema.Channels;
using Messages = EitaaSharp.Schema.Messages;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Fetches basic info for several channels at once, by id.
    /// </summary>
    /// <param name="channelIds">Ids of the channels to fetch (access hashes come from the peer cache).</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns>The requested channels.</returns>
    public Task<Messages.IChats> GetChannelsAsync(long[] channelIds, CancellationToken cancellationToken = default)
        => CallAsync(new Channels.GetChannels
        {
            Id = Array.ConvertAll<long, IInputChannel>(channelIds, _peers.Channel),
        }, cancellationToken);
}
