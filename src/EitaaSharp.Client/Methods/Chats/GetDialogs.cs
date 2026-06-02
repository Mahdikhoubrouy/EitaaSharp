using System.Runtime.CompilerServices;
using Schema = EitaaSharp.Schema;
using Messages = EitaaSharp.Schema.Messages;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>Iterates the chat list (conversations), paging automatically up to <paramref name="limit"/>.</summary>
    /// <param name="limit">Maximum number of dialogs to yield.</param>
    /// <param name="cancellationToken">Stops iteration.</param>
    public async IAsyncEnumerable<Dialog> GetDialogsAsync(
        int limit = 100, [EnumeratorCancellation] CancellationToken cancellationToken = default)
    {
        int yielded = 0, offsetDate = 0, offsetId = 0;
        Schema.IInputPeer offsetPeer = new Schema.InputPeerEmpty();

        while (yielded < limit)
        {
            int batch = Math.Min(100, limit - yielded);
            var result = await CallAsync(new Messages.GetDialogs
            {
                OffsetDate = offsetDate, OffsetId = offsetId, OffsetPeer = offsetPeer, Limit = batch, Hash = 0,
            }, cancellationToken).ConfigureAwait(false);

            var page = ResultParser.Dialogs(this, result);
            if (page.Count == 0)
                yield break;

            foreach (var d in page)
            {
                yield return d;
                if (++yielded >= limit)
                    yield break;
            }

            // Advance the cursor to the oldest dialog of this page (build the peer from its kind,
            // which never throws — basic groups carry no access hash).
            var last = page[^1];
            offsetId = last.TopMessageId;
            offsetPeer = last.Chat.Type switch
            {
                ChatType.Channel or ChatType.Supergroup => _peers.ChannelPeer(last.Chat.Id),
                ChatType.Group => _peers.ChatPeer(last.Chat.Id),
                _ => _peers.UserPeer(last.Chat.Id),
            };
        }
    }
}
