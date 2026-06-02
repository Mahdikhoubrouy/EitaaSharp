using Schema = EitaaSharp.Schema;
using Messages = EitaaSharp.Schema.Messages;
using Channels = EitaaSharp.Schema.Channels;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>Deletes messages. Routes to the channel-specific call for channels/supergroups.</summary>
    /// <param name="chat">The chat the messages belong to.</param>
    /// <param name="messageIds">Ids to delete.</param>
    /// <param name="revoke">Delete for everyone (private chats / basic groups).</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns>The number of messages affected.</returns>
    public async Task<int> DeleteMessagesAsync(
        ChatId chat, int[] messageIds, bool revoke = true, CancellationToken cancellationToken = default)
    {
        var peer = await ResolvePeerAsync(chat, cancellationToken).ConfigureAwait(false);
        Messages.IAffectedMessages affected = peer is Schema.InputPeerChannel ipc
            ? await CallAsync(new Channels.DeleteMessages
            {
                Channel = new Schema.InputChannel { ChannelId = ipc.ChannelId, AccessHash = ipc.AccessHash },
                Id = messageIds,
            }, cancellationToken).ConfigureAwait(false)
            : await CallAsync(new Messages.DeleteMessages { Id = messageIds, Revoke = revoke }, cancellationToken)
                .ConfigureAwait(false);
        return ResultParser.AffectedCount(affected);
    }
}
