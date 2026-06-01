using System.Collections.Concurrent;

namespace EitaaSharp.Client.Session;

/// <summary>An in-memory session. Nothing is persisted; <see cref="SaveAsync"/> is a no-op.</summary>
public class MemorySession : IEitaaSession
{
    private readonly ConcurrentDictionary<long, long> _accessHashes;

    public string? Token { get; set; }
    public string Imei { get; set; }
    public string? PhoneNumber { get; set; }
    public string? PhoneCodeHash { get; set; }

    public MemorySession(string imei, string? token = null)
    {
        if (string.IsNullOrEmpty(imei))
            throw new ArgumentException("Imei is required", nameof(imei));
        Imei = imei;
        Token = token;
        _accessHashes = new ConcurrentDictionary<long, long>();
    }

    protected MemorySession(SessionData data)
    {
        Imei = data.Imei;
        Token = data.Token;
        PhoneNumber = data.PhoneNumber;
        PhoneCodeHash = data.PhoneCodeHash;
        _accessHashes = new ConcurrentDictionary<long, long>(data.AccessHashes);
    }

    public void SetAccessHash(long peerId, long accessHash) => _accessHashes[peerId] = accessHash;

    public bool TryGetAccessHash(long peerId, out long accessHash) => _accessHashes.TryGetValue(peerId, out accessHash);

    public virtual Task SaveAsync(CancellationToken cancellationToken = default) => Task.CompletedTask;

    /// <summary>Snapshots the current state for persistence.</summary>
    protected SessionData Snapshot() => new()
    {
        Token = Token,
        Imei = Imei,
        PhoneNumber = PhoneNumber,
        PhoneCodeHash = PhoneCodeHash,
        AccessHashes = new Dictionary<long, long>(_accessHashes),
    };
}

/// <summary>Serializable session state.</summary>
public sealed class SessionData
{
    public string? Token { get; set; }
    public string Imei { get; set; } = "";
    public string? PhoneNumber { get; set; }
    public string? PhoneCodeHash { get; set; }
    public Dictionary<long, long> AccessHashes { get; set; } = new();
}
