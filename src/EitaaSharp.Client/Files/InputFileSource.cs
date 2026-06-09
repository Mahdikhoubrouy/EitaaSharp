namespace EitaaSharp.Client;

/// <summary>
/// A source of bytes to upload for the <c>Send*Async</c> media methods. It can be a file on disk, a
/// <see cref="System.IO.Stream"/>, or an in-memory <c>byte[]</c> — so callers are never forced to
/// write a temp file first. A plain <see cref="string"/> path converts implicitly, so
/// <c>SendPhotoAsync(chat, "pic.jpg")</c> keeps working unchanged.
/// </summary>
public sealed class InputFileSource
{
    private readonly string? _path;
    private readonly Stream? _stream;
    private readonly byte[]? _bytes;
    private readonly long? _size;

    private InputFileSource(string fileName, string? path, Stream? stream, byte[]? bytes, long? size)
    {
        FileName = fileName;
        _path = path;
        _stream = stream;
        _bytes = bytes;
        _size = size;
    }

    /// <summary>The file name attached to the upload (used for the document/file attribute).</summary>
    public string FileName { get; }

    /// <summary>A file on disk. The file name is taken from the path.</summary>
    public static InputFileSource FromPath(string path)
    {
        ArgumentException.ThrowIfNullOrEmpty(path);
        return new InputFileSource(Path.GetFileName(path), path, null, null, null);
    }

    /// <summary>
    /// A stream. If it is not seekable and <paramref name="size"/> is not given, it is buffered into
    /// memory first (the part count must be known up front). The stream is not disposed by the upload.
    /// </summary>
    public static InputFileSource FromStream(Stream stream, string fileName, long? size = null)
    {
        ArgumentNullException.ThrowIfNull(stream);
        ArgumentException.ThrowIfNullOrEmpty(fileName);
        return new InputFileSource(fileName, null, stream, null, size);
    }

    /// <summary>In-memory bytes (e.g. an image rendered on the fly).</summary>
    public static InputFileSource FromBytes(byte[] bytes, string fileName)
    {
        ArgumentNullException.ThrowIfNull(bytes);
        ArgumentException.ThrowIfNullOrEmpty(fileName);
        return new InputFileSource(fileName, null, null, bytes, bytes.LongLength);
    }

    /// <summary>A local path converts implicitly, so existing path-based calls keep working.</summary>
    public static implicit operator InputFileSource(string path) => FromPath(path);

    /// <summary>
    /// Opens the underlying bytes as a stream. <c>OwnsStream</c> is true when the returned stream was
    /// created here (path/bytes) and must be disposed by the caller; false for a user-provided stream.
    /// </summary>
    internal (Stream Stream, long? Size, bool OwnsStream) Open()
    {
        if (_path is not null)
        {
            var fs = File.OpenRead(_path);
            return (fs, fs.Length, true);
        }
        if (_bytes is not null)
            return (new MemoryStream(_bytes, writable: false), _bytes.LongLength, true);
        return (_stream!, _size, false);
    }
}
