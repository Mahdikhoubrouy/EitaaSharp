using Messages = EitaaSharp.Schema.Messages;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>Shows an activity indicator (typing, uploading, …) in a chat.</summary>
    /// <param name="chat">The chat to show the activity in.</param>
    /// <param name="action">The activity; defaults to typing.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns><c>true</c> if accepted.</returns>
    public async Task<bool> SendChatActionAsync(
        ChatId chat, ChatAction action = ChatAction.Typing, CancellationToken cancellationToken = default)
    {
        var peer = await ResolvePeerAsync(chat, cancellationToken).ConfigureAwait(false);
        return await CallAsync(new Messages.SetTyping { Peer = peer, Action = action.ToTl() }, cancellationToken)
            .ConfigureAwait(false);
    }
}
