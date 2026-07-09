namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Fetches a single message by id — a convenience wrapper over <see cref="GetMessagesAsync"/>.
    /// </summary>
    /// <param name="chat">The chat the message is in — a numeric id, <c>@username</c>, or <c>"me"</c>.</param>
    /// <param name="messageId">The id of the message to fetch.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns>The <see cref="Message"/>, or <c>null</c> if it does not exist or is inaccessible.</returns>
    public async Task<Message?> GetMessageAsync(
        ChatId chat, int messageId, CancellationToken cancellationToken = default)
    {
        var messages = await GetMessagesAsync(chat, [messageId], cancellationToken).ConfigureAwait(false);
        return messages.Count > 0 ? messages[0] : null;
    }
}
