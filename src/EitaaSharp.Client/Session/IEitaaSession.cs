namespace EitaaSharp.Client.Session;

/// <summary>
/// Persistent session state for a client: the auth <see cref="Token"/>, the device
/// <see cref="Imei"/>, and a cache of peer access hashes (so peers can be addressed by
/// id across runs — the equivalent of a Pyrogram <c>.session</c> file).
/// </summary>
public interface IEitaaSession
{
    /// <summary>The current auth token (null before sign-in). Updated after a successful login.</summary>
    string? Token { get; set; }

    /// <summary>The stable per-device identifier sent in every request envelope.</summary>
    string Imei { get; set; }

    /// <summary>The phone number the in-progress login is for (set by <c>SendCodeAsync</c>).</summary>
    string? PhoneNumber { get; set; }

    /// <summary>
    /// The <c>phone_code_hash</c> from the last <c>SendCodeAsync</c>, required by <c>SignInAsync</c>.
    /// Persisted so the code can be requested in one run and confirmed in another.
    /// </summary>
    string? PhoneCodeHash { get; set; }

    /// <summary>Records a peer's access hash (learned from a response) for later addressing.</summary>
    void SetAccessHash(long peerId, long accessHash);

    /// <summary>Looks up a cached access hash for a peer id.</summary>
    bool TryGetAccessHash(long peerId, out long accessHash);

    /// <summary>Persists the session (no-op for in-memory sessions).</summary>
    Task SaveAsync(CancellationToken cancellationToken = default);
}
