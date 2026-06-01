using EitaaSharp.Schema;
using Messages = EitaaSharp.Schema.Messages;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Uploads a local file and sends it as a document (any non-photo file). The upload is chunked
    /// automatically (see <see cref="Uploads"/>).
    /// </summary>
    /// <param name="peer">Destination peer.</param>
    /// <param name="path">Path to the local file to upload.</param>
    /// <param name="caption">Optional caption shown with the document.</param>
    /// <param name="mimeType">MIME type of the file, e.g. <c>application/pdf</c>; defaults to a generic binary type.</param>
    /// <param name="cancellationToken">Cancels the upload and the send.</param>
    /// <returns>The server updates produced by the send, containing the new media message.</returns>
    public async Task<IUpdates> SendDocumentAsync(
        IInputPeer peer, string path, string caption = "", string mimeType = "application/octet-stream",
        CancellationToken cancellationToken = default)
    {
        var file = await Uploads.UploadAsync(path, cancellationToken).ConfigureAwait(false);
        return await CallAsync(new Messages.SendMedia
        {
            Peer = peer,
            Media = new InputMediaUploadedDocument
            {
                File = file,
                MimeType = mimeType,
                Attributes = [new DocumentAttributeFilename { FileName = Path.GetFileName(path) }],
            },
            Message = caption,
            RandomId = RandomId(),
        }, cancellationToken).ConfigureAwait(false);
    }
}
