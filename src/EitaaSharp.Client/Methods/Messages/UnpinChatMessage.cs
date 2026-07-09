using Messages = EitaaSharp.Schema.Messages;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Unpins a previously pinned message in a chat, group, or channel.
    /// </summary>
    /// <param name="chat">The chat the message is in — a numeric id, <c>@username</c>, or <c>"me"</c>.</param>
    /// <param name="messageId">The id of the message to unpin.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    public async Task UnpinChatMessageAsync(
        ChatId chat, int messageId, CancellationToken cancellationToken = default)
    {
        var peer = await ResolvePeerAsync(chat, cancellationToken).ConfigureAwait(false);

        await CallAsync(new Messages.UpdatePinnedMessage
        {
            Peer = peer,
            Id = messageId,
            Unpin = true,
        }, cancellationToken).ConfigureAwait(false);
    }
}
