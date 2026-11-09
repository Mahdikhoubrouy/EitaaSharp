using Photos = EitaaSharp.Schema.Photos;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>Uploads a new profile photo for the signed-in user.</summary>
    public async Task<Photos.IPhoto> UploadProfilePhotoAsync(
        InputFileSource photo, CancellationToken cancellationToken = default)
    {
        var file = await WithRefreshRetryAsync(
            ct => Uploads.UploadAsync(photo, ct), cancellationToken).ConfigureAwait(false);

        return await CallAsync(new Photos.UploadProfilePhoto { File = file }, cancellationToken)
            .ConfigureAwait(false);
    }
}
