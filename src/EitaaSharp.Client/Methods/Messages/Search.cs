using EitaaSharp.Schema;
using Messages = EitaaSharp.Schema.Messages;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Searches for messages containing the given text within a single peer.
    /// </summary>
    /// <param name="peer">The chat, channel, or user to search inside.</param>
    /// <param name="query">The text to search for.</param>
    /// <param name="limit">Maximum number of matches to return.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns>The matching messages together with the users and chats they reference.</returns>
    public Task<Messages.IMessages> SearchAsync(
        IInputPeer peer, string query, int limit = 100, CancellationToken cancellationToken = default)
        => CallAsync(new Messages.Search
        {
            Peer = peer,
            Q = query,
            Filter = new InputMessagesFilterEmpty(),
            MinDate = 0,
            MaxDate = 0,
            OffsetId = 0,
            AddOffset = 0,
            Limit = limit,
            MaxId = 0,
            MinId = 0,
            Hash = 0,
        }, cancellationToken);
}
