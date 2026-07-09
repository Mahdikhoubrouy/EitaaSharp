using Messages = EitaaSharp.Schema.Messages;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Pins a message in a chat, group, or channel.
    /// </summary>
    /// <param name="chat">The chat the message is in — a numeric id, <c>@username</c>, or <c>"me"</c>.</param>
    /// <param name="messageId">The id of the message to pin.</param>
    /// <param name="silent">Pin without notifying members (no service message / notification).</param>
    /// <param name="oneSideOnly">In a private chat, pin only on your side.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    public async Task PinChatMessageAsync(
        ChatId chat, int messageId, bool silent = false, bool oneSideOnly = false,
        CancellationToken cancellationToken = default)
    {
        var peer = await ResolvePeerAsync(chat, cancellationToken).ConfigureAwait(false);

        await CallAsync(new Messages.UpdatePinnedMessage
        {
            Peer = peer,
            Id = messageId,
            Silent = silent,
            PmOneside = oneSideOnly,
        }, cancellationToken).ConfigureAwait(false);
    }
}
