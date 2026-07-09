using Messages = EitaaSharp.Schema.Messages;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Shows an activity indicator (typing, uploading, …) in a chat. Both the official Android and web
    /// clients send <c>messages.setTyping</c> only over their socket path and never over HTTP (the web
    /// client keeps it in <c>eitaaNoSend</c>). Over this HTTP-only transport it is therefore a no-op:
    /// <see cref="CallAsync{TResult}"/> skips such socket-only methods and returns <c>false</c> instead
    /// of throwing, so it never breaks the surrounding flow (e.g. an "uploading photo…" hint before a send).
    /// </summary>
    /// <param name="chat">The chat to show the activity in.</param>
    /// <param name="action">The activity; defaults to typing.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns><c>true</c> if accepted; <c>false</c> for the socket-only call over HTTP.</returns>
    public async Task<bool> SendChatActionAsync(
        ChatId chat, ChatAction action = ChatAction.Typing, CancellationToken cancellationToken = default)
    {
        var peer = await ResolvePeerAsync(chat, cancellationToken).ConfigureAwait(false);
        return await CallAsync(new Messages.SetTyping { Peer = peer, Action = action.ToTl() }, cancellationToken)
            .ConfigureAwait(false);
    }
}
