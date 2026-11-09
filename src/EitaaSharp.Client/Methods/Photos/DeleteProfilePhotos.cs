using Photos = EitaaSharp.Schema.Photos;
using Schema = EitaaSharp.Schema;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Deletes profile photos by id. Pass the current photo's <see cref="Schema.InputPhoto"/> (from
    /// <c>photos.getUserPhotos</c> or an upload result).
    /// </summary>
    public Task<long[]> DeleteProfilePhotosAsync(
        IReadOnlyList<Schema.IInputPhoto> photos, CancellationToken cancellationToken = default)
        => CallAsync(new Photos.DeletePhotos { Id = photos.ToArray() }, cancellationToken);

    /// <summary>Lists the signed-in user's profile photos (newest first).</summary>
    public Task<Photos.IPhotos> GetMyProfilePhotosAsync(
        int offset = 0, long maxId = 0, int limit = 10, CancellationToken cancellationToken = default)
        => CallAsync(new Photos.GetUserPhotos
        {
            UserId = new Schema.InputUserSelf(),
            Offset = offset,
            MaxId = maxId,
            Limit = limit,
        }, cancellationToken);
}
