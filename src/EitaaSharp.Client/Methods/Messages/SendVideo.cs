using Schema = EitaaSharp.Schema;
using Messages = EitaaSharp.Schema.Messages;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>Uploads a video and sends it as a streamable video message.</summary>
    /// <param name="chat">Destination — id, <c>@username</c>, or <c>"me"</c>.</param>
    /// <param name="video">The video — a path, a <see cref="System.IO.Stream"/>, or bytes
    /// (<see cref="InputFileSource.FromStream"/> / <see cref="InputFileSource.FromBytes"/>); a plain
    /// path string also works.</param>
    /// <param name="caption">Optional caption.</param>
    /// <param name="duration">Duration in seconds (0 if unknown).</param>
    /// <param name="width">Frame width in pixels (0 if unknown).</param>
    /// <param name="height">Frame height in pixels (0 if unknown).</param>
    /// <param name="mimeType">MIME type; defaults to <c>video/mp4</c>.</param>
    /// <param name="cancellationToken">Cancels the upload and send.</param>
    /// <returns>The sent <see cref="Message"/>.</returns>
    public async Task<Message> SendVideoAsync(
        ChatId chat, InputFileSource video, string caption = "",
        int duration = 0, int width = 0, int height = 0, string mimeType = "video/mp4",
        CancellationToken cancellationToken = default, IProgress<long>? progress = null)
    {
        var peer = await ResolvePeerAsync(chat, cancellationToken).ConfigureAwait(false);
        var file = await WithRefreshRetryAsync(ct => Uploads.UploadAsync(video, ct, progress), cancellationToken).ConfigureAwait(false);
        var updates = await CallAsync(new Messages.SendMedia
        {
            Peer = peer,
            Media = new Schema.InputMediaUploadedDocument
            {
                File = file,
                MimeType = mimeType,
                Attributes =
                [
                    new Schema.DocumentAttributeVideo
                    {
                        SupportsStreaming = true,
                        Duration = duration,
                        W = width,
                        H = height,
                    },
                    new Schema.DocumentAttributeFilename { FileName = video.FileName },
                ],
            },
            Message = caption,
            RandomId = RandomId(),
        }, cancellationToken).ConfigureAwait(false);
        return ResultParser.MessageFromUpdates(this, updates, peer, caption);
    }
}
