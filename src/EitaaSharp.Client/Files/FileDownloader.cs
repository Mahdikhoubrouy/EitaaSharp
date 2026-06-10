using EitaaSharp.Client.Rpc;
using EitaaSharp.Schema;
using Upload = EitaaSharp.Schema.Upload;

namespace EitaaSharp.Client.Files;

/// <summary>
/// Downloads a file by looping <c>upload.getFile</c> over 512 KB windows until the
/// server returns a short (final) chunk. The real chunked download the JS source lacked.
/// </summary>
public sealed class FileDownloader
{
    // 128 KB — the chunk size the official Eitaa/Telegram client uses for downloads
    // (FileLoadOperation.downloadChunkSizeBig). A valid getFile limit (1 MB % 128 KB == 0).
    public const int ChunkSize = 128 * 1024;

    private readonly EitaaRpc _rpc;

    public FileDownloader(EitaaRpc rpc) => _rpc = rpc;

    /// <summary>Downloads the whole file into memory.</summary>
    /// <param name="progress">Optional callback reporting cumulative bytes downloaded.</param>
    /// <param name="expectedSize">The file size, when known, so the loop stops exactly at EOF.</param>
    public async Task<byte[]> DownloadAsync(
        IInputFileLocation location, CancellationToken cancellationToken = default, IProgress<long>? progress = null,
        long? expectedSize = null)
    {
        using var output = new MemoryStream();
        await DownloadAsync(location, output, cancellationToken, progress, expectedSize).ConfigureAwait(false);
        return output.ToArray();
    }

    /// <summary>Streams the file into <paramref name="destination"/>.</summary>
    /// <param name="progress">Optional callback reporting cumulative bytes downloaded.</param>
    /// <param name="expectedSize">The file size, when known, so the loop stops exactly at EOF.</param>
    public async Task DownloadAsync(
        IInputFileLocation location, Stream destination, CancellationToken cancellationToken = default,
        IProgress<long>? progress = null, long? expectedSize = null)
    {
        ArgumentNullException.ThrowIfNull(location);
        ArgumentNullException.ThrowIfNull(destination);

        int offset = 0;
        while (true)
        {
            var result = await _rpc.CallAsync(new Upload.GetFile
            {
                Location = location,
                Offset = offset,
                Limit = ChunkSize,
            }, cancellationToken, Transport.ConnectionKind.Download).ConfigureAwait(false);

            if (result is not Upload.File file)
                throw new NotSupportedException(
                    $"Unsupported upload.getFile result: {result.GetType().Name} (CDN redirects are not handled).");

            if (file.Bytes.Length == 0)
                break;

            await destination.WriteAsync(file.Bytes, cancellationToken).ConfigureAwait(false);
            offset += file.Bytes.Length;
            progress?.Report(offset);

            if (file.Bytes.Length < ChunkSize)
                break;

            // A file whose size is an exact multiple of the chunk size would otherwise trigger one
            // more getFile past EOF, which the server rejects with RETRY_LIMIT. Stop at the known size.
            if (expectedSize is { } size && offset >= size)
                break;
        }
    }
}
