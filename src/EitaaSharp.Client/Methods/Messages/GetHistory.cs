using EitaaSharp.Schema;
using Messages = EitaaSharp.Schema.Messages;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Fetches a page of a conversation's message history, returning the newest messages first.
    /// </summary>
    /// <param name="peer">The chat, channel, or user whose history to read.</param>
    /// <param name="limit">Maximum number of messages to return (the server caps this around 100).</param>
    /// <param name="offsetId">Return messages older than this message id; <c>0</c> starts from the latest.</param>
    /// <param name="addOffset">Extra offset on the result window; use negative values to page toward newer messages.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns>The messages together with the users and chats they reference.</returns>
    public Task<Messages.IMessages> GetHistoryAsync(
        IInputPeer peer, int limit = 100, int offsetId = 0, int addOffset = 0,
        CancellationToken cancellationToken = default)
        => CallAsync(new Messages.GetHistory
        {
            Peer = peer,
            OffsetId = offsetId,
            OffsetDate = 0,
            AddOffset = addOffset,
            Limit = limit,
            MaxId = 0,
            MinId = 0,
            Hash = 0,
        }, cancellationToken);
}
