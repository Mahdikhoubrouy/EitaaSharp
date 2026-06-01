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
    public const int ChunkSize = 512 * 1024;

    private readonly EitaaRpc _rpc;

    public FileDownloader(EitaaRpc rpc) => _rpc = rpc;

    /// <summary>Downloads the whole file into memory.</summary>
    public async Task<byte[]> DownloadAsync(
        IInputFileLocation location, CancellationToken cancellationToken = default)
    {
        using var output = new MemoryStream();
        await DownloadAsync(location, output, cancellationToken).ConfigureAwait(false);
        return output.ToArray();
    }

    /// <summary>Streams the file into <paramref name="destination"/>.</summary>
    public async Task DownloadAsync(
        IInputFileLocation location, Stream destination, CancellationToken cancellationToken = default)
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
            }, cancellationToken).ConfigureAwait(false);

            if (result is not Upload.File file)
                throw new NotSupportedException(
                    $"Unsupported upload.getFile result: {result.GetType().Name} (CDN redirects are not handled).");

            if (file.Bytes.Length == 0)
                break;

            await destination.WriteAsync(file.Bytes, cancellationToken).ConfigureAwait(false);
            offset += file.Bytes.Length;

            if (file.Bytes.Length < ChunkSize)
                break;
        }
    }
}
