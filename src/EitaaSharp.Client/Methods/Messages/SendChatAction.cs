using EitaaSharp.Client.Rpc;
using Messages = EitaaSharp.Schema.Messages;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Shows an activity indicator (typing, uploading, …) in a chat. The current Eitaa server does
    /// not implement <c>messages.setTyping</c> (it answers <c>INVALID_CONSTRUCTOR</c>); like the
    /// official client, this is treated as a no-op and returns <c>false</c> rather than throwing, so
    /// it never breaks the surrounding flow (e.g. an "uploading photo…" hint before a send).
    /// </summary>
    /// <param name="chat">The chat to show the activity in.</param>
    /// <param name="action">The activity; defaults to typing.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns><c>true</c> if accepted; <c>false</c> if the server doesn't support it.</returns>
    public async Task<bool> SendChatActionAsync(
        ChatId chat, ChatAction action = ChatAction.Typing, CancellationToken cancellationToken = default)
    {
        var peer = await ResolvePeerAsync(chat, cancellationToken).ConfigureAwait(false);
        try
        {
            return await CallAsync(new Messages.SetTyping { Peer = peer, Action = action.ToTl() }, cancellationToken)
                .ConfigureAwait(false);
        }
        catch (RpcException ex) when (ex.IsInvalidConstructor)
        {
            return false; // Eitaa doesn't implement setTyping — mirror the official client and ignore.
        }
    }
}
