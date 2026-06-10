using Schema = EitaaSharp.Schema;
using Messages = EitaaSharp.Schema.Messages;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>Uploads an image and sends it as a photo.</summary>
    /// <param name="chat">Destination — id, <c>@username</c>, or <c>"me"</c>.</param>
    /// <param name="photo">The image — a file path, a <see cref="System.IO.Stream"/>, or bytes
    /// (<see cref="InputFileSource.FromStream"/> / <see cref="InputFileSource.FromBytes"/>); a plain
    /// path string also works.</param>
    /// <param name="caption">Optional caption.</param>
    /// <param name="cancellationToken">Cancels the upload and send.</param>
    /// <returns>The sent <see cref="Message"/>.</returns>
    public async Task<Message> SendPhotoAsync(
        ChatId chat, InputFileSource photo, string caption = "", CancellationToken cancellationToken = default,
        IProgress<long>? progress = null)
    {
        var peer = await ResolvePeerAsync(chat, cancellationToken).ConfigureAwait(false);
        var file = await WithRefreshRetryAsync(ct => Uploads.UploadAsync(photo, ct, progress), cancellationToken).ConfigureAwait(false);
        var updates = await CallAsync(new Messages.SendMedia
        {
            Peer = peer,
            Media = new Schema.InputMediaUploadedPhoto { File = file },
            Message = caption,
            RandomId = RandomId(),
        }, cancellationToken).ConfigureAwait(false);
        return ResultParser.MessageFromUpdates(this, updates, peer, caption);
    }
}
