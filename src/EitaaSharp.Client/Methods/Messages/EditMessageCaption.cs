namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Edits the caption of a media message (photo/video/document). For a plain text message this
    /// edits its text, exactly like <see cref="EditMessageTextAsync"/>.
    /// </summary>
    /// <param name="chat">The chat the message is in — a numeric id, <c>@username</c>, or <c>"me"</c>.</param>
    /// <param name="messageId">The id of the message to edit.</param>
    /// <param name="caption">The new caption.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns>The edited <see cref="Message"/>.</returns>
    public Task<Message> EditMessageCaptionAsync(
        ChatId chat, int messageId, string caption, CancellationToken cancellationToken = default)
        => EditMessageTextAsync(chat, messageId, caption, cancellationToken);
}
