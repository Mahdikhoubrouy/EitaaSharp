using EitaaSharp.Schema;
using Messages = EitaaSharp.Schema.Messages;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Forwards one or more messages from a source peer to a destination peer.
    /// </summary>
    /// <param name="fromPeer">Source peer the messages currently live in.</param>
    /// <param name="toPeer">Destination peer to forward them to.</param>
    /// <param name="messageIds">Ids of the source messages, in the order they should be forwarded.</param>
    /// <param name="silent">Forward without a notification sound.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns>The server updates produced by the forward, containing the new messages.</returns>
    public Task<IUpdates> ForwardMessagesAsync(
        IInputPeer fromPeer, IInputPeer toPeer, int[] messageIds, bool silent = false,
        CancellationToken cancellationToken = default)
        => CallAsync(new Messages.ForwardMessages
        {
            FromPeer = fromPeer,
            ToPeer = toPeer,
            Id = messageIds,
            RandomId = Array.ConvertAll(messageIds, _ => RandomId()),
            Silent = silent,
        }, cancellationToken);
}
