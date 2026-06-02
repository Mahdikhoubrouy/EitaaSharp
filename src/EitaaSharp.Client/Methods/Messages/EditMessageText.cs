using Messages = EitaaSharp.Schema.Messages;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>Replaces the text of a message you can edit.</summary>
    /// <param name="chat">The chat the message belongs to.</param>
    /// <param name="messageId">Id of the message to edit.</param>
    /// <param name="text">The new text.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns>The edited <see cref="Message"/>.</returns>
    public async Task<Message> EditMessageTextAsync(
        ChatId chat, int messageId, string text, CancellationToken cancellationToken = default)
    {
        var peer = await ResolvePeerAsync(chat, cancellationToken).ConfigureAwait(false);
        var updates = await CallAsync(new Messages.EditMessage { Peer = peer, Id = messageId, Message = text }, cancellationToken)
            .ConfigureAwait(false);
        return ResultParser.MessageFromUpdates(this, updates, peer, text);
    }
}
