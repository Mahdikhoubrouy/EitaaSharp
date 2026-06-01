using System.Text.Json;

namespace EitaaSharp.Client.Session;

/// <summary>
/// A session persisted to a JSON file on disk — the Pyrogram <c>.session</c> equivalent.
/// Open an existing file (or create a new one with a fresh IMEI), then call
/// <see cref="SaveAsync"/> to write token/peer-cache updates back.
/// </summary>
public sealed class JsonFileSession : MemorySession
{
    private static readonly JsonSerializerOptions JsonOptions = new() { WriteIndented = true };
    private static readonly SemaphoreSlim WriteGate = new(1, 1);

    private readonly string _path;

    private JsonFileSession(string path, SessionData data) : base(data) => _path = path;

    /// <summary>
    /// Opens the session at <paramref name="path"/>, or creates a new one if the file does not
    /// exist (using <paramref name="imei"/>, or a generated device id when omitted).
    /// </summary>
    public static JsonFileSession Open(string path, string? imei = null)
    {
        ArgumentException.ThrowIfNullOrEmpty(path);

        if (File.Exists(path))
        {
            var json = File.ReadAllText(path);
            var data = JsonSerializer.Deserialize<SessionData>(json, JsonOptions)
                       ?? throw new InvalidOperationException($"Corrupt session file: {path}");
            if (imei is not null)
                data.Imei = imei;
            else if (!EitaaImei.IsValid(data.Imei))
                data.Imei = EitaaImei.Generate(); // upgrade a missing/legacy imei to the accepted format
            return new JsonFileSession(path, data);
        }

        return new JsonFileSession(path, new SessionData
        {
            Imei = imei ?? EitaaImei.Generate(),
        });
    }

    public override async Task SaveAsync(CancellationToken cancellationToken = default)
    {
        var json = JsonSerializer.Serialize(Snapshot(), JsonOptions);

        await WriteGate.WaitAsync(cancellationToken).ConfigureAwait(false);
        try
        {
            var dir = Path.GetDirectoryName(_path);
            if (!string.IsNullOrEmpty(dir))
                Directory.CreateDirectory(dir);

            // Write atomically via a temp file + replace.
            var tmp = _path + ".tmp";
            await File.WriteAllTextAsync(tmp, json, cancellationToken).ConfigureAwait(false);
            File.Move(tmp, _path, overwrite: true);
        }
        finally
        {
            WriteGate.Release();
        }
    }
}
