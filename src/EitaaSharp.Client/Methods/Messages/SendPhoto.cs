using EitaaSharp.Schema;
using Messages = EitaaSharp.Schema.Messages;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Uploads a local image file and sends it as a photo. The upload is chunked automatically
    /// (see <see cref="Uploads"/>).
    /// </summary>
    /// <param name="peer">Destination peer.</param>
    /// <param name="path">Path to the local image file to upload.</param>
    /// <param name="caption">Optional caption shown under the photo.</param>
    /// <param name="cancellationToken">Cancels the upload and the send.</param>
    /// <returns>The server updates produced by the send, containing the new media message.</returns>
    public async Task<IUpdates> SendPhotoAsync(
        IInputPeer peer, string path, string caption = "", CancellationToken cancellationToken = default)
    {
        var file = await Uploads.UploadAsync(path, cancellationToken).ConfigureAwait(false);
        return await CallAsync(new Messages.SendMedia
        {
            Peer = peer,
            Media = new InputMediaUploadedPhoto { File = file },
            Message = caption,
            RandomId = RandomId(),
        }, cancellationToken).ConfigureAwait(false);
    }
}
