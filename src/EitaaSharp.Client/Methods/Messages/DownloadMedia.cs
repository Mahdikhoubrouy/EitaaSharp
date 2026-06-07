using Schema = EitaaSharp.Schema;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>Downloads a message's photo or document into memory.</summary>
    /// <param name="message">The message carrying the media.</param>
    /// <param name="cancellationToken">Cancels the download.</param>
    /// <returns>The media bytes.</returns>
    public async Task<byte[]> DownloadMediaAsync(Message message, CancellationToken cancellationToken = default)
    {
        var location = LocationFor(message.Media)
            ?? throw new InvalidOperationException("This message has no downloadable photo/document.");
        return await WithRefreshRetryAsync(ct => Downloads.DownloadAsync(location, ct), cancellationToken).ConfigureAwait(false);
    }

    /// <summary>Downloads a message's photo or document to a file path.</summary>
    public async Task DownloadMediaAsync(Message message, string destinationPath, CancellationToken cancellationToken = default)
    {
        var location = LocationFor(message.Media)
            ?? throw new InvalidOperationException("This message has no downloadable photo/document.");
        await using var file = System.IO.File.Create(destinationPath);
        await WithRefreshRetryAsync(async ct =>
        {
            await Downloads.DownloadAsync(location, file, ct).ConfigureAwait(false);
            return true;
        }, cancellationToken).ConfigureAwait(false);
    }

    private static Schema.IInputFileLocation? LocationFor(Schema.IMessageMedia? media) => media switch
    {
        Schema.MessageMediaPhoto { Photo: Schema.Photo p } => new Schema.InputPhotoFileLocation
        {
            Id = p.Id,
            AccessHash = p.AccessHash,
            FileReference = p.FileReference,
            ThumbSize = LargestPhotoSize(p.Sizes),
        },
        Schema.MessageMediaDocument { Document: Schema.Document d } => new Schema.InputDocumentFileLocation
        {
            Id = d.Id,
            AccessHash = d.AccessHash,
            FileReference = d.FileReference,
            ThumbSize = string.Empty,
        },
        _ => null,
    };

    private static string LargestPhotoSize(Schema.IPhotoSize[] sizes)
    {
        string type = "";
        int best = -1;
        foreach (var s in sizes)
        {
            var (t, size) = s switch
            {
                Schema.PhotoSize ps => (ps.Type, ps.Size),
                Schema.PhotoSizeProgressive pp => (pp.Type, pp.Sizes.Length > 0 ? pp.Sizes[^1] : 0),
                _ => ("", -1),
            };
            if (size > best)
            {
                best = size;
                type = t;
            }
        }
        return type;
    }
}
