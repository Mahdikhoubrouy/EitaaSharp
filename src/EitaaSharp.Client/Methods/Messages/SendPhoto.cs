using Schema = EitaaSharp.Schema;
using Messages = EitaaSharp.Schema.Messages;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>Uploads a local image and sends it as a photo.</summary>
    /// <param name="chat">Destination — id, <c>@username</c>, or <c>"me"</c>.</param>
    /// <param name="path">Path to the local image file.</param>
    /// <param name="caption">Optional caption.</param>
    /// <param name="cancellationToken">Cancels the upload and send.</param>
    /// <returns>The sent <see cref="Message"/>.</returns>
    public async Task<Message> SendPhotoAsync(
        ChatId chat, string path, string caption = "", CancellationToken cancellationToken = default)
    {
        var peer = await ResolvePeerAsync(chat, cancellationToken).ConfigureAwait(false);
        var file = await Uploads.UploadAsync(path, cancellationToken).ConfigureAwait(false);
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
