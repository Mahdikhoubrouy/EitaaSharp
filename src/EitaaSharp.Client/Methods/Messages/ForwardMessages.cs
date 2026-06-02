using Messages = EitaaSharp.Schema.Messages;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>Forwards messages from one chat to another.</summary>
    /// <param name="to">Destination chat.</param>
    /// <param name="from">Source chat.</param>
    /// <param name="messageIds">Source message ids, in order.</param>
    /// <param name="silent">Forward without a notification sound.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns>The forwarded messages.</returns>
    public async Task<IReadOnlyList<Message>> ForwardMessagesAsync(
        ChatId to, ChatId from, int[] messageIds, bool silent = false, CancellationToken cancellationToken = default)
    {
        var toPeer = await ResolvePeerAsync(to, cancellationToken).ConfigureAwait(false);
        var fromPeer = await ResolvePeerAsync(from, cancellationToken).ConfigureAwait(false);
        var updates = await CallAsync(new Messages.ForwardMessages
        {
            FromPeer = fromPeer,
            ToPeer = toPeer,
            Id = messageIds,
            RandomId = Array.ConvertAll(messageIds, _ => RandomId()),
            Silent = silent,
        }, cancellationToken).ConfigureAwait(false);
        return ResultParser.MessagesFromUpdates(this, updates);
    }
}
