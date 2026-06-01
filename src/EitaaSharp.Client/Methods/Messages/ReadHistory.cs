using EitaaSharp.Schema;
using Messages = EitaaSharp.Schema.Messages;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Marks a conversation as read up to a given message, clearing its unread counter.
    /// </summary>
    /// <param name="peer">The chat or user whose history to mark as read.</param>
    /// <param name="maxId">Mark everything up to and including this message id; <c>0</c> marks the whole history.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns>The affected message range reported by the server.</returns>
    public Task<Messages.IAffectedMessages> ReadHistoryAsync(
        IInputPeer peer, int maxId = 0, CancellationToken cancellationToken = default)
        => CallAsync(new Messages.ReadHistory { Peer = peer, MaxId = maxId }, cancellationToken);
}
