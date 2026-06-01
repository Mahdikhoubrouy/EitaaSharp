using Channels = EitaaSharp.Schema.Channels;
using Messages = EitaaSharp.Schema.Messages;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Fetches a channel's full details (description, member count, linked chat, settings).
    /// </summary>
    /// <param name="channelId">Id of the channel.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns>The full channel info plus the users and chats it references.</returns>
    public Task<Messages.IChatFull> GetFullChannelAsync(long channelId, CancellationToken cancellationToken = default)
        => CallAsync(new Channels.GetFullChannel { Channel = _peers.Channel(channelId) }, cancellationToken);
}
