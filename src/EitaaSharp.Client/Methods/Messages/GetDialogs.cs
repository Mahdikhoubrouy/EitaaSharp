using EitaaSharp.Schema;
using Messages = EitaaSharp.Schema.Messages;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Lists the most recent conversations (dialogs) as shown on the chat list.
    /// </summary>
    /// <param name="limit">Maximum number of dialogs to return.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns>The dialogs plus the messages, users, and chats they reference.</returns>
    public Task<Messages.IDialogs> GetDialogsAsync(int limit = 100, CancellationToken cancellationToken = default)
        => CallAsync(new Messages.GetDialogs
        {
            OffsetDate = 0,
            OffsetId = 0,
            OffsetPeer = new InputPeerEmpty(),
            Limit = limit,
            Hash = 0,
        }, cancellationToken);
}
