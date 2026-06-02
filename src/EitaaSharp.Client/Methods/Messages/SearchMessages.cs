using System.Runtime.CompilerServices;
using Schema = EitaaSharp.Schema;
using Messages = EitaaSharp.Schema.Messages;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>Searches a chat for messages containing <paramref name="query"/>, paging automatically.</summary>
    /// <param name="chat">The chat to search.</param>
    /// <param name="query">Text to search for.</param>
    /// <param name="limit">Maximum number of matches to yield.</param>
    /// <param name="cancellationToken">Stops iteration.</param>
    public async IAsyncEnumerable<Message> SearchMessagesAsync(
        ChatId chat, string query, int limit = 100,
        [EnumeratorCancellation] CancellationToken cancellationToken = default)
    {
        var peer = await ResolvePeerAsync(chat, cancellationToken).ConfigureAwait(false);
        int yielded = 0, offsetId = 0;
        while (yielded < limit)
        {
            int batch = Math.Min(100, limit - yielded);
            var result = await CallAsync(new Messages.Search
            {
                Peer = peer, Q = query, Filter = new Schema.InputMessagesFilterEmpty(),
                MinDate = 0, MaxDate = 0, OffsetId = offsetId, AddOffset = 0,
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
