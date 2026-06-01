using EitaaSharp.Schema;
using Channels = EitaaSharp.Schema.Channels;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Lists the members of a channel or supergroup, page by page.
    /// </summary>
    /// <param name="channelId">Id of the channel whose members to list.</param>
    /// <param name="offset">Number of members to skip (for paging).</param>
    /// <param name="limit">Maximum number of members to return in this page.</param>
    /// <param name="filter">Which members to include; defaults to recently active members when <c>null</c>.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns>The matching participants together with the referenced users and chats.</returns>
    public Task<Channels.IChannelParticipants> GetParticipantsAsync(
        long channelId, int offset = 0, int limit = 100,
        IChannelParticipantsFilter? filter = null, CancellationToken cancellationToken = default)
        => CallAsync(new Channels.GetParticipants
        {
            Channel = _peers.Channel(channelId),
            Filter = filter ?? new ChannelParticipantsRecent(),
            Offset = offset,
            Limit = limit,
            Hash = 0,
        }, cancellationToken);
}
