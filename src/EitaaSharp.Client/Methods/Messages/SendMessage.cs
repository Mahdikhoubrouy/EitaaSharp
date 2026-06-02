using Messages = EitaaSharp.Schema.Messages;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Sends a text message to a user, group, or channel.
    /// </summary>
    /// <param name="chat">Destination — a numeric id, <c>@username</c>, or <c>"me"</c>.</param>
    /// <param name="text">Message body (UTF-8, up to 4096 characters).</param>
    /// <param name="replyToMessageId">Id of the message to reply to, or <c>null</c> for a standalone message.</param>
    /// <param name="silent">Send without triggering a notification sound on the recipients.</param>
    /// <param name="disableWebPagePreview">Disable the link preview Eitaa would generate for URLs.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns>The sent <see cref="Message"/>.</returns>
    public async Task<Message> SendMessageAsync(
        ChatId chat, string text, int? replyToMessageId = null, bool silent = false,
        bool disableWebPagePreview = false, CancellationToken cancellationToken = default)
    {
        var peer = await ResolvePeerAsync(chat, cancellationToken).ConfigureAwait(false);

        var updates = await CallAsync(new Messages.SendMessage
        {
            Peer = peer,
            Message = text,
            RandomId = RandomId(),
            ReplyToMsgId = replyToMessageId,
            Silent = silent,
            NoWebpage = disableWebPagePreview,
        }, cancellationToken).ConfigureAwait(false);

        return ParseContext.FromSendResult(this, updates, peer, text);
    }
}
