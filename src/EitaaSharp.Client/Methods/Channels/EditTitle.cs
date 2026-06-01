using EitaaSharp.Schema;
using Channels = EitaaSharp.Schema.Channels;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Renames a channel or supergroup (requires the right permissions).
    /// </summary>
    /// <param name="channelId">Id of the channel to rename.</param>
    /// <param name="title">The new title.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns>The server updates reflecting the new title.</returns>
    public Task<IUpdates> EditChannelTitleAsync(
        long channelId, string title, CancellationToken cancellationToken = default)
        => CallAsync(new Channels.EditTitle { Channel = _peers.Channel(channelId), Title = title }, cancellationToken);
}
