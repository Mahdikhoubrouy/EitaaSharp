using System.Runtime.CompilerServices;
using Schema = EitaaSharp.Schema;
using Channels = EitaaSharp.Schema.Channels;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>Iterates the members of a channel/supergroup, paging automatically.</summary>
    /// <param name="chat">The channel whose members to list.</param>
    /// <param name="limit">Maximum number of members to yield.</param>
    /// <param name="cancellationToken">Stops iteration.</param>
    public async IAsyncEnumerable<ChatMember> GetChatMembersAsync(
        ChatId chat, int limit = 200, [EnumeratorCancellation] CancellationToken cancellationToken = default)
    {
        var peer = await ResolvePeerAsync(chat, cancellationToken).ConfigureAwait(false);
        var channel = ToInputChannel(peer);
        int offset = 0;
        while (offset < limit)
        {
            int batch = Math.Min(200, limit - offset);
            var result = await CallAsync(new Channels.GetParticipants
            {
                Channel = channel, Filter = new Schema.ChannelParticipantsRecent(), Offset = offset, Limit = batch, Hash = 0,
            }, cancellationToken).ConfigureAwait(false);

            var page = ResultParser.Members(this, result);
            if (page.Count == 0)
                yield break;

            foreach (var m in page)
                yield return m;
            offset += page.Count;
        }
    }
}
