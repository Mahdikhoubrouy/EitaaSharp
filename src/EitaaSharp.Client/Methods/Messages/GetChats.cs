using Messages = EitaaSharp.Schema.Messages;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Fetches basic group chats by their ids.
    /// </summary>
    /// <param name="chatIds">Ids of the basic group chats to fetch.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns>The requested chats.</returns>
    public Task<Messages.IChats> GetChatsAsync(long[] chatIds, CancellationToken cancellationToken = default)
        => CallAsync(new Messages.GetChats { Id = chatIds }, cancellationToken);
}
