using EitaaSharp.Schema;
using Messages = EitaaSharp.Schema.Messages;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Fetches the reactions on a message, aggregated by emoji into friendly counts.
    /// </summary>
    /// <param name="chat">The chat the message is in — a numeric id, <c>@username</c>, or <c>"me"</c>.</param>
    /// <param name="messageId">The id of the message whose reactions to read.</param>
    /// <param name="limit">Maximum number of individual reactions to sample when aggregating (default 100).</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns>
    /// One <see cref="MessageReaction"/> per distinct emoji with its user count, ordered most-reacted first.
    /// Empty when the message has no reactions (or the server does not serve this method over HTTP).
    /// </returns>
    public async Task<IReadOnlyList<MessageReaction>> GetMessageReactionsAsync(
        ChatId chat, int messageId, int limit = 100, CancellationToken cancellationToken = default)
    {
        var peer = await ResolvePeerAsync(chat, cancellationToken).ConfigureAwait(false);

        var result = await CallObjectAsync(new Messages.GetMessageReactionsList
        {
            Peer = peer,
            Id = messageId,
            Limit = limit,
        }, cancellationToken).ConfigureAwait(false);

        if (result is not MessageReactionsList list)
            return [];

        return list.Reactions
            .OfType<MessageUserReaction>()
            .GroupBy(r => r.Reaction, StringComparer.Ordinal)
            .Select(g => new MessageReaction(g.Key, g.Count()))
            .OrderByDescending(r => r.Count)
            .ToList();
    }
}
