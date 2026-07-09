using Messages = EitaaSharp.Schema.Messages;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Deletes the message history of a private chat or basic group. The server clears messages in
    /// batches and reports how many remain; this repeats until the history is fully cleared.
    /// </summary>
    /// <param name="chat">The chat to clear — a numeric id, <c>@username</c>, or <c>"me"</c>.</param>
    /// <param name="revoke">Also delete the history for the other party (not just your own copy).</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns>The total number of messages affected.</returns>
    public async Task<int> DeleteChatHistoryAsync(
        ChatId chat, bool revoke = false, CancellationToken cancellationToken = default)
    {
        var peer = await ResolvePeerAsync(chat, cancellationToken).ConfigureAwait(false);

        int total = 0;
        while (true)
        {
            var affected = await CallAsync(new Messages.DeleteHistory
            {
                Peer = peer,
                MaxId = 0,
                Revoke = revoke,
            }, cancellationToken).ConfigureAwait(false);

            if (affected is not Messages.AffectedHistory ah)
                break;

            total += ah.PtsCount;
            if (ah.Offset <= 0) // 0 means nothing more to delete
                break;
        }

        return total;
    }
}
