using Messages = EitaaSharp.Schema.Messages;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Fetches the full details of a basic group chat (members, about, settings).
    /// </summary>
    /// <param name="chatId">Id of the basic group chat.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns>The full chat info plus the users and chats it references.</returns>
    public Task<Messages.IChatFull> GetFullChatAsync(long chatId, CancellationToken cancellationToken = default)
        => CallAsync(new Messages.GetFullChat { ChatId = chatId }, cancellationToken);
}
