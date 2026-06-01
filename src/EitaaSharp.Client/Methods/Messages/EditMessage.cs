using EitaaSharp.Schema;
using Messages = EitaaSharp.Schema.Messages;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Replaces the text of an existing message that you are allowed to edit.
    /// </summary>
    /// <param name="peer">The chat or channel the message belongs to.</param>
    /// <param name="messageId">Id of the message to edit.</param>
    /// <param name="text">The new message text (UTF-8).</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns>The server updates reflecting the edited message.</returns>
    public Task<IUpdates> EditMessageAsync(
        IInputPeer peer, int messageId, string text, CancellationToken cancellationToken = default)
        => CallAsync(new Messages.EditMessage { Peer = peer, Id = messageId, Message = text }, cancellationToken);
}
