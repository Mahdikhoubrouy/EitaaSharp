using System.Security.Cryptography;
using EitaaSharp.Client.Rpc;
using EitaaSharp.Schema;
using Upload = EitaaSharp.Schema.Upload;

namespace EitaaSharp.Client.Files;

/// <summary>
/// Uploads a file in 512 KB parts via <c>upload.saveFilePart</c> (or
/// <c>upload.saveBigFilePart</c> for files larger than 10 MB) and returns an
/// <see cref="IInputFile"/> ready to attach to <c>messages.sendMedia</c>.
/// This is the real chunked upload the JS source never implemented.
/// </summary>
public sealed class FileUploader
{
    public const int PartSize = 512 * 1024;          // 524288
    public const long BigFileThreshold = 10 * 1024 * 1024;

    private readonly EitaaRpc _rpc;

    public FileUploader(EitaaRpc rpc) => _rpc = rpc;

    /// <summary>Uploads the bytes of a file on disk.</summary>
    public async Task<IInputFile> UploadAsync(string path, CancellationToken cancellationToken = default)
        => await UploadAsync(InputFileSource.FromPath(path), cancellationToken).ConfigureAwait(false);

    /// <summary>Uploads from any <see cref="InputFileSource"/> — a path, stream, or byte array.</summary>
    public async Task<IInputFile> UploadAsync(InputFileSource source, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(source);
        var (stream, size, ownsStream) = source.Open();
        try
        {
            return await UploadAsync(stream, source.FileName, size, cancellationToken).ConfigureAwait(false);
        }
        finally
        {
            if (ownsStream)
                await stream.DisposeAsync().ConfigureAwait(false);
        }
    }

    /// <summary>Uploads a stream. The length must be known (seekable stream or explicit <paramref name="size"/>).</summary>
    public async Task<IInputFile> UploadAsync(
        Stream content, string fileName, long? size = null, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(content);

        // Materialize if we cannot determine the length, since part counts must be known up front.
        if (size is null && !content.CanSeek)
        {
            var buffer = new MemoryStream();
            await content.CopyToAsync(buffer, cancellationToken).ConfigureAwait(false);
            buffer.Position = 0;
            content = buffer;
        }

        long length = size ?? content.Length;
        bool isBig = length > BigFileThreshold;
        int totalParts = (int)((length + PartSize - 1) / PartSize);
        long fileId = Random.Shared.NextInt64();

        using var md5 = isBig ? null : IncrementalHash.CreateHash(HashAlgorithmName.MD5);

        var part = new byte[PartSize];
        int partIndex = 0;

        while (true)
        {
            int read = await ReadFullAsync(content, part, cancellationToken).ConfigureAwait(false);
            if (read == 0)
                break;

            var chunk = read == PartSize ? part : part[..read];
            md5?.AppendData(chunk);

            // Eitaa's saveBigFilePart always carries the total file size (flags.1) — unlike upstream
            // Telegram — but saveFilePart (no peer) is the plain 3-field call: writing extra bytes
            // after `bytes` desyncs the request (server: INVALID_CONSTRUCTOR).
            bool ok = isBig
                ? await _rpc.CallAsync(new Upload.SaveBigFilePart
                {
                    FileId = fileId,
                    FilePart = partIndex,
                    FileTotalParts = totalParts,
                    Bytes = chunk,
                    TotalFileSize = length,
                }, cancellationToken).ConfigureAwait(false)
                : await _rpc.CallAsync(new Upload.SaveFilePart
                {
                    FileId = fileId,
                    FilePart = partIndex,
                    Bytes = chunk,
                }, cancellationToken).ConfigureAwait(false);

            if (!ok)
                throw new InvalidOperationException($"Server rejected file part {partIndex} of {fileName}.");

            partIndex++;
            if (read < PartSize)
                break;
        }

        if (isBig)
            return new InputFileBig { Id = fileId, Parts = partIndex, Name = fileName };

        string md5Hex = Convert.ToHexString(md5!.GetHashAndReset()).ToLowerInvariant();
        return new InputFile { Id = fileId, Parts = partIndex, Name = fileName, Md5Checksum = md5Hex };
    }

    private static async Task<int> ReadFullAsync(Stream stream, byte[] buffer, CancellationToken ct)
    {
        int total = 0;
        while (total < buffer.Length)
        {
            int read = await stream.ReadAsync(buffer.AsMemory(total), ct).ConfigureAwait(false);
            if (read == 0)
                break;
            total += read;
        }
        return total;
    }
}
