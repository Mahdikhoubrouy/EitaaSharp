using Messages = EitaaSharp.Schema.Messages;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Sets (or clears) the current account's emoji reaction on a message.
    /// </summary>
    /// <param name="chat">The chat the message is in — a numeric id, <c>@username</c>, or <c>"me"</c>.</param>
    /// <param name="messageId">The id of the message to react to.</param>
    /// <param name="emoji">The reaction emoji (e.g. <c>"👍"</c>), or <c>null</c> to remove the reaction.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    public async Task SendReactionAsync(
        ChatId chat, int messageId, string? emoji, CancellationToken cancellationToken = default)
    {
        var peer = await ResolvePeerAsync(chat, cancellationToken).ConfigureAwait(false);

        await CallAsync(new Messages.SendReaction
        {
            Peer = peer,
            MsgId = messageId,
            Reaction = emoji, // null clears the reaction (the flag is left unset)
        }, cancellationToken).ConfigureAwait(false);
    }
}
