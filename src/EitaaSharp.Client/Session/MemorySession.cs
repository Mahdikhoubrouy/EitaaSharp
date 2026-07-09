using System.Collections.Concurrent;

namespace EitaaSharp.Client.Session;

/// <summary>An in-memory session. Nothing is persisted; <see cref="SaveAsync"/> is a no-op.</summary>
public class MemorySession : IEitaaSession
{
    private readonly ConcurrentDictionary<long, PeerEntry> _peers;

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
        _peers = new ConcurrentDictionary<long, PeerEntry>();
    }

    protected MemorySession(SessionData data)
    {
        Imei = data.Imei;
        Token = data.Token;
        PhoneNumber = data.PhoneNumber;
        PhoneCodeHash = data.PhoneCodeHash;
        _peers = new ConcurrentDictionary<long, PeerEntry>(data.Peers);
    }

    public void SetAccessHash(long peerId, long accessHash) =>
        _peers.AddOrUpdate(peerId,
            _ => new PeerEntry { Hash = accessHash },
            (_, e) => new PeerEntry { Hash = accessHash, Type = e.Type });

    public bool TryGetAccessHash(long peerId, out long accessHash)
    {
        if (_peers.TryGetValue(peerId, out var e))
        {
            accessHash = e.Hash;
            return true;
        }
        accessHash = 0;
        return false;
    }

    public void SetPeer(long peerId, long accessHash, PeerType type) =>
        _peers[peerId] = new PeerEntry { Hash = accessHash, Type = type };

    public bool TryGetPeer(long peerId, out long accessHash, out PeerType type)
    {
        if (_peers.TryGetValue(peerId, out var e) && e.Type is { } t)
        {
            accessHash = e.Hash;
            type = t;
            return true;
        }
        accessHash = 0;
        type = default;
        return false;
    }

    public virtual Task SaveAsync(CancellationToken cancellationToken = default) => Task.CompletedTask;

    /// <summary>
    /// Builds a <see cref="MemorySession"/> from a portable Base64 session string (see
    /// <see cref="SessionString"/>). Ideal for loading one of N sessions stored in a database.
    /// </summary>
    /// <param name="session">A Base64 session string produced by <see cref="ExportString"/>.</param>
    /// <returns>A ready in-memory session (token, imei, and — if the string carried it — the peer cache).</returns>
    /// <exception cref="FormatException">The string is not a valid Eitaa session string.</exception>
    public static MemorySession FromString(string session) => new(SessionString.Deserialize(session));

    /// <summary>
    /// Exports this session to a portable Base64 session string. It contains the account token — treat it
    /// as a secret (store it in a secret store or an encrypted column, never in logs).
    /// </summary>
    /// <param name="includePeers">When <c>true</c> (the default), includes the learned peer-access-hash cache.</param>
    /// <returns>A Base64 session string that <see cref="FromString"/> reads back.</returns>
    public string ExportString(bool includePeers = true) => SessionString.Serialize(Snapshot(), includePeers);

    /// <summary>Snapshots the current state for persistence.</summary>
    protected SessionData Snapshot() => new()
    {
        Token = Token,
        Imei = Imei,
        PhoneNumber = PhoneNumber,
        PhoneCodeHash = PhoneCodeHash,
        Peers = new Dictionary<long, PeerEntry>(_peers),
    };
}

/// <summary>A cached peer: its access hash and (once learned) its kind.</summary>
public sealed class PeerEntry
{
    public long Hash { get; set; }
    public PeerType? Type { get; set; }
}

/// <summary>Serializable session state.</summary>
public sealed class SessionData
{
    public string? Token { get; set; }
    public string Imei { get; set; } = "";
    public string? PhoneNumber { get; set; }
    public string? PhoneCodeHash { get; set; }
    public Dictionary<long, PeerEntry> Peers { get; set; } = new();
}
