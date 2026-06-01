using EitaaSharp.Schema;
using Messages = EitaaSharp.Schema.Messages;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Fetches specific messages by their ids from private chats and basic groups.
    /// </summary>
    /// <param name="messageIds">Ids of the messages to fetch.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns>The requested messages along with the users and chats they reference.</returns>
    public Task<Messages.IMessages> GetMessagesAsync(int[] messageIds, CancellationToken cancellationToken = default)
        => CallAsync(new Messages.GetMessages
        {
            Id = Array.ConvertAll<int, IInputMessage>(messageIds, x => new InputMessageID { Id = x }),
        }, cancellationToken);
}
