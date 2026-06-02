using Schema = EitaaSharp.Schema;
using Messages = EitaaSharp.Schema.Messages;
using Channels = EitaaSharp.Schema.Channels;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>Marks a chat as read up to a message. Routes to the channel-specific call for channels.</summary>
    /// <param name="chat">The chat to mark read.</param>
    /// <param name="maxId">Read up to and including this id (0 = all).</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns><c>true</c> on success.</returns>
    public async Task<bool> ReadChatHistoryAsync(ChatId chat, int maxId = 0, CancellationToken cancellationToken = default)
    {
        var peer = await ResolvePeerAsync(chat, cancellationToken).ConfigureAwait(false);
        if (peer is Schema.InputPeerChannel ipc)
            return await CallAsync(new Channels.ReadHistory
            {
                Channel = new Schema.InputChannel { ChannelId = ipc.ChannelId, AccessHash = ipc.AccessHash },
                MaxId = maxId,
            }, cancellationToken).ConfigureAwait(false);

        await CallAsync(new Messages.ReadHistory { Peer = peer, MaxId = maxId }, cancellationToken).ConfigureAwait(false);
        return true;
    }
}
