using EitaaSharp.Schema;
using Messages = EitaaSharp.Schema.Messages;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Shows an activity indicator (typing, uploading, etc.) to the other side of a chat.
    /// </summary>
    /// <param name="peer">The chat to show the activity in.</param>
    /// <param name="action">The activity to display; defaults to "typing" when <c>null</c>.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns><c>true</c> if the server accepted the activity update.</returns>
    public Task<bool> SetTypingAsync(
        IInputPeer peer, ISendMessageAction? action = null, CancellationToken cancellationToken = default)
        => CallAsync(new Messages.SetTyping
        {
            Peer = peer,
            Action = action ?? new SendMessageTypingAction(),
        }, cancellationToken);
}
