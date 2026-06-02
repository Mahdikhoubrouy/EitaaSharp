using System.Runtime.CompilerServices;
using Messages = EitaaSharp.Schema.Messages;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>Iterates a chat's history (newest first), paging automatically up to <paramref name="limit"/>.</summary>
    /// <param name="chat">The chat to read.</param>
    /// <param name="limit">Maximum number of messages to yield.</param>
    /// <param name="offsetId">Start before this message id (0 = latest).</param>
    /// <param name="cancellationToken">Stops iteration.</param>
    public async IAsyncEnumerable<Message> GetChatHistoryAsync(
        ChatId chat, int limit = 100, int offsetId = 0,
        [EnumeratorCancellation] CancellationToken cancellationToken = default)
    {
        var peer = await ResolvePeerAsync(chat, cancellationToken).ConfigureAwait(false);
        int yielded = 0;
        while (yielded < limit)
        {
            int batch = Math.Min(100, limit - yielded);
            var result = await CallAsync(new Messages.GetHistory
            {
                Peer = peer, OffsetId = offsetId, OffsetDate = 0, AddOffset = 0,
                Limit = batch, MaxId = 0, MinId = 0, Hash = 0,
            }, cancellationToken).ConfigureAwait(false);

            var page = ResultParser.Messages(this, result);
            if (page.Count == 0)
                yield break;

            foreach (var m in page)
            {
                yield return m;
                if (++yielded >= limit)
                    yield break;
            }
            offsetId = page[^1].Id;
        }
    }
}
