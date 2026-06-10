using EitaaSharp.Client.Files;
using EitaaSharp.Client.Rpc;
using EitaaSharp.Client.Transport;
using EitaaSharp.Schema;
using EitaaSharp.Tl;
using Upload = EitaaSharp.Schema.Upload;
using Storage = EitaaSharp.Schema.Storage;

namespace EitaaSharp.Client.Tests;

public class FileTests
{
    /// <summary>Replays a fixed sequence of responses, one per call.</summary>
    private sealed class ScriptedTransport(Func<int, byte[]> responder) : IEitaaTransport
    {
        public int Calls { get; private set; }

        public Task<byte[]> SendAsync(ReadOnlyMemory<byte> payload, CancellationToken cancellationToken = default)
            => Task.FromResult(responder(Calls++));
    }

    private static byte[] BoolTrue()
    {
        var w = new TlWriter();
        w.WriteBool(true);
        return w.ToArray();
    }

    private static byte[] Serialize(ITlObject obj)
    {
        var w = new TlWriter();
        obj.Serialize(w);
        return w.ToArray();
    }

    [Fact]
    public async Task Upload_SplitsIntoParts_AndReturnsInputFile()
    {
        // 1 MB => ceil(1MB / 512KB) = 2 parts => 2 saveFilePart calls.
        var data = new byte[1024 * 1024];
        for (int i = 0; i < data.Length; i++) data[i] = (byte)i;

        var transport = new ScriptedTransport(_ => BoolTrue());
        var rpc = new EitaaRpc(transport, "tok", "imei");
        var uploader = new FileUploader(rpc);

        var input = await uploader.UploadAsync(new MemoryStream(data), "photo.jpg");

        var file = Assert.IsType<InputFile>(input);
        Assert.Equal(2, file.Parts);
        Assert.Equal("photo.jpg", file.Name);
        Assert.Equal(2, transport.Calls);
        Assert.Equal(32, file.Md5Checksum.Length); // 16-byte MD5 as hex
    }

    [Fact]
    public async Task Download_LoopsUntilShortChunk()
    {
        // First call: a full chunk; second call: a short chunk (ends the loop).
        byte[] full = Serialize(new Upload.File
        {
            Type = new Storage.FileJpeg(),
            Mtime = 0,
            Bytes = new byte[FileDownloader.ChunkSize],
        });
        byte[] tail = Serialize(new Upload.File
        {
            Type = new Storage.FileJpeg(),
            Mtime = 0,
            Bytes = new byte[100],
        });

        var transport = new ScriptedTransport(call => call == 0 ? full : tail);
        var rpc = new EitaaRpc(transport, "tok", "imei");
        var downloader = new FileDownloader(rpc);

        var location = new InputFileLocation
        {
            VolumeId = 1,
            LocalId = 2,
            Secret = 3,
            FileReference = [],
        };

        byte[] result = await downloader.DownloadAsync(location);

        Assert.Equal(FileDownloader.ChunkSize + 100, result.Length);
        Assert.Equal(2, transport.Calls);
    }

    [Fact]
    public async Task Upload_FromBytes_UsesFileNameAndUploads()
    {
        var transport = new ScriptedTransport(_ => BoolTrue());
        var uploader = new FileUploader(new EitaaRpc(transport, "tok", "imei"));

        var input = await uploader.UploadAsync(InputFileSource.FromBytes(new byte[] { 1, 2, 3 }, "note.txt"));

        var file = Assert.IsType<InputFile>(input);
        Assert.Equal("note.txt", file.Name);
        Assert.Equal(1, file.Parts);
        Assert.Equal(1, transport.Calls);
    }

    [Fact]
    public async Task Upload_FromStream_UsesFileName()
    {
        var transport = new ScriptedTransport(_ => BoolTrue());
        var uploader = new FileUploader(new EitaaRpc(transport, "tok", "imei"));

        using var ms = new MemoryStream(new byte[] { 4, 5, 6, 7 });
        var input = await uploader.UploadAsync(InputFileSource.FromStream(ms, "clip.mp4"));

        Assert.Equal("clip.mp4", Assert.IsType<InputFile>(input).Name);
    }

    [Fact]
    public void InputFileSource_ImplicitFromPath_TakesFileName()
    {
        InputFileSource source = "/some/dir/picture.png"; // implicit string -> path
        Assert.Equal("picture.png", source.FileName);
    }

    private sealed class SyncProgress : IProgress<long>
    {
        public List<long> Reports { get; } = new();
        public void Report(long value) => Reports.Add(value);
    }

    [Fact]
    public async Task Upload_ReportsCumulativeProgress_EndingAtFileSize()
    {
        var data = new byte[FileUploader.PartSize + 100]; // 2 parts
        var uploader = new FileUploader(new EitaaRpc(new ScriptedTransport(_ => BoolTrue()), "tok", "imei"));
        var progress = new SyncProgress();

        await uploader.UploadAsync(InputFileSource.FromBytes(data, "x.bin"), default, progress);

        Assert.Equal(2, progress.Reports.Count);
        Assert.Equal(FileUploader.PartSize, progress.Reports[0]); // after part 0
        Assert.Equal(data.Length, progress.Reports[^1]);          // clamped to the true size
    }

    [Fact]
    public async Task Download_ReportsCumulativeProgress()
    {
        byte[] full = Serialize(new Upload.File
        {
            Type = new Storage.FileUnknown(),
            Mtime = 0,
            Bytes = new byte[FileDownloader.ChunkSize],
        });
        byte[] tail = Serialize(new Upload.File
        {
            Type = new Storage.FileUnknown(),
            Mtime = 0,
            Bytes = new byte[100],
        });

        var rpc = new EitaaRpc(new ScriptedTransport(call => call == 0 ? full : tail), "tok", "imei");
        var downloader = new FileDownloader(rpc);
        var progress = new SyncProgress();

        var location = new InputFileLocation { VolumeId = 1, LocalId = 2, Secret = 3, FileReference = [] };
        await downloader.DownloadAsync(location, default, progress);

        Assert.Equal(new long[] { FileDownloader.ChunkSize, FileDownloader.ChunkSize + 100 }, progress.Reports);
    }
}
