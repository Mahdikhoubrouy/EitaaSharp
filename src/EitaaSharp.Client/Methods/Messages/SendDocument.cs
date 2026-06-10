using Schema = EitaaSharp.Schema;
using Messages = EitaaSharp.Schema.Messages;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>Uploads a file and sends it as a document.</summary>
    /// <param name="chat">Destination — id, <c>@username</c>, or <c>"me"</c>.</param>
    /// <param name="document">The file — a path, a <see cref="System.IO.Stream"/>, or bytes
    /// (<see cref="InputFileSource.FromStream"/> / <see cref="InputFileSource.FromBytes"/>); a plain
    /// path string also works.</param>
    /// <param name="caption">Optional caption.</param>
    /// <param name="mimeType">MIME type; defaults to a generic binary type.</param>
    /// <param name="cancellationToken">Cancels the upload and send.</param>
    /// <returns>The sent <see cref="Message"/>.</returns>
    public async Task<Message> SendDocumentAsync(
        ChatId chat, InputFileSource document, string caption = "", string mimeType = "application/octet-stream",
        CancellationToken cancellationToken = default, IProgress<long>? progress = null)
    {
        var peer = await ResolvePeerAsync(chat, cancellationToken).ConfigureAwait(false);
        var file = await WithRefreshRetryAsync(ct => Uploads.UploadAsync(document, ct, progress), cancellationToken).ConfigureAwait(false);
        var updates = await CallAsync(new Messages.SendMedia
        {
            Peer = peer,
            Media = new Schema.InputMediaUploadedDocument
            {
                File = file,
                MimeType = mimeType,
                Attributes = [new Schema.DocumentAttributeFilename { FileName = document.FileName }],
            },
            Message = caption,
            RandomId = RandomId(),
        }, cancellationToken).ConfigureAwait(false);
        return ResultParser.MessageFromUpdates(this, updates, peer, caption);
    }
}
