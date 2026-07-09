using Schema = EitaaSharp.Schema;
using Messages = EitaaSharp.Schema.Messages;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Replaces the media of an existing message with a newly uploaded photo or document.
    /// </summary>
    /// <param name="chat">The chat the message is in — a numeric id, <c>@username</c>, or <c>"me"</c>.</param>
    /// <param name="messageId">The id of the message to edit.</param>
    /// <param name="media">The replacement media — a file path, a <see cref="System.IO.Stream"/>, or bytes
    /// (<see cref="InputFileSource.FromStream"/> / <see cref="InputFileSource.FromBytes"/>).</param>
    /// <param name="caption">An optional new caption; <c>null</c> leaves the caption unchanged.</param>
    /// <param name="asDocument">Send the media as a document instead of a photo.</param>
    /// <param name="mimeType">MIME type when <paramref name="asDocument"/> is set; defaults to a generic binary type.</param>
    /// <param name="cancellationToken">Cancels the upload and edit.</param>
    /// <param name="progress">Optional upload progress in bytes.</param>
    /// <returns>The edited <see cref="Message"/>.</returns>
    public async Task<Message> EditMessageMediaAsync(
        ChatId chat, int messageId, InputFileSource media, string? caption = null,
        bool asDocument = false, string mimeType = "application/octet-stream",
        CancellationToken cancellationToken = default, IProgress<long>? progress = null)
    {
        var peer = await ResolvePeerAsync(chat, cancellationToken).ConfigureAwait(false);
        var file = await WithRefreshRetryAsync(ct => Uploads.UploadAsync(media, ct, progress), cancellationToken)
            .ConfigureAwait(false);

        Schema.IInputMedia input = asDocument
            ? new Schema.InputMediaUploadedDocument
            {
                File = file,
                MimeType = mimeType,
                Attributes = [new Schema.DocumentAttributeFilename { FileName = media.FileName }],
            }
            : new Schema.InputMediaUploadedPhoto { File = file };

        var updates = await CallAsync(new Messages.EditMessage
        {
            Peer = peer,
            Id = messageId,
            Media = input,
            Message = caption,
        }, cancellationToken).ConfigureAwait(false);

        return ResultParser.MessageFromUpdates(this, updates, peer, caption ?? "");
    }
}
