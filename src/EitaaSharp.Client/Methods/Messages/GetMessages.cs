using Schema = EitaaSharp.Schema;
using Messages = EitaaSharp.Schema.Messages;
using Channels = EitaaSharp.Schema.Channels;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>Fetches specific messages by id from a chat (routes to the channel call for channels).</summary>
    /// <param name="chat">The chat the messages belong to.</param>
    /// <param name="messageIds">Ids to fetch.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns>The requested messages.</returns>
    public async Task<IReadOnlyList<Message>> GetMessagesAsync(
        ChatId chat, int[] messageIds, CancellationToken cancellationToken = default)
    {
        var peer = await ResolvePeerAsync(chat, cancellationToken).ConfigureAwait(false);
        var ids = Array.ConvertAll<int, Schema.IInputMessage>(messageIds, x => new Schema.InputMessageID { Id = x });
        Messages.IMessages result = peer is Schema.InputPeerChannel ipc
            ? await CallAsync(new Channels.GetMessages
            {
                Channel = new Schema.InputChannel { ChannelId = ipc.ChannelId, AccessHash = ipc.AccessHash },
                Id = ids,
            }, cancellationToken).ConfigureAwait(false)
            : await CallAsync(new Messages.GetMessages { Id = ids }, cancellationToken).ConfigureAwait(false);
        return ResultParser.Messages(this, result);
    }
}
