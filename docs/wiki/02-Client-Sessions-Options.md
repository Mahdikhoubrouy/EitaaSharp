# Client, Sessions & Options

[← Home](Home.md)

## `EitaaClient`

The high-level entry point. Construct it once, reuse it, and dispose it when done.

### Constructors

```csharp
// Recommended — configured via options (owns an HTTP transport).
public EitaaClient(EitaaClientOptions options)

// Advanced/testing — supply your own transport + session.
public EitaaClient(IEitaaTransport transport, IEitaaSession session, int layer = 133)
public EitaaClient(IEitaaTransport transport, string token, string imei, int layer = 133)
```

### Key properties

| Member | Type | Notes |
|---|---|---|
| `Session` | `IEitaaSession` | The backing session (token, imei, peer cache). |
| `Peers` | `PeerResolver` | Resolves ids/usernames to `InputPeer`/`InputUser`/`InputChannel`. |
| `Uploads` | `FileUploader` | Chunked upload (`upload.saveFilePart` / `saveBigFilePart`). |
| `Downloads` | `FileDownloader` | Chunked download (`upload.getFile`). |
| `IsAuthorized` | `bool` | True once an authorization arrived this session. |
| `ApiId` / `ApiHash` | `int` / `string` | Sent with `SendCodeAsync`; Eitaa ignores them (defaults work). |
| `TokenRefreshHandler` | `Func<EitaaClient,CancellationToken,Task<bool>>?` | Custom token-refresh callback (see [Error Handling](12-Error-Handling.md)). |
| `ThrowOnDeserializeError` | `bool` | Default `true`. When `false`, an unmodeled response returns `default` + fires `OnDeserializeError`. |
| `OnDeserializeError` | `Action<Exception>?` | Called when a response can't be deserialized (with the flag off). |

### Key events

| Event | Signature | Fires when |
|---|---|---|
| `Authorized` | `EventHandler<Auth.IAuthorization>` | After a successful sign-in / sign-up. |
| `UpdatesReceived` | `EventHandler<IUpdates>` | For every `Updates` container returned by any call. |
| `UpdateReceived` | `EventHandler<IUpdate>` | For every individual update extracted from a container. |

Update **handlers** (`OnMessage`, `OnEditedMessage`, …) and the poll loop (`RunAsync`) are documented
in [Updates & Events](08-Updates-Events.md).

### Universal call entry points

Every high-level method ultimately calls one of these; you can call them directly for any raw TL method:

```csharp
Task<TResult> CallAsync<TResult>(ITlMethod<TResult> method, CancellationToken ct = default)
Task<TResult> InvokeAsync<TResult>(ITlMethod<TResult> method, CancellationToken ct = default) // alias
Task<ITlObject> CallObjectAsync(ITlObject method, CancellationToken ct = default)
```

They apply the client's resilience policy automatically: **update dispatch**, **token auto-refresh**,
**`FLOOD_WAIT` auto-retry**, and the **`eitaaNoSend`** skip for socket-only methods. See
[Raw API & Architecture](11-Raw-API-Architecture.md).

---

## `EitaaClientOptions`

Every property is optional unless noted.

| Property | Type | Default | Purpose |
|---|---|---|---|
| `Session` | `IEitaaSession?` | `null` | An explicit session (e.g. `JsonFileSession`). When set, `Token`/`Imei`/`SessionString` are ignored. |
| `SessionString` | `string?` | `null` | Build the client from a portable **session string** (see below). Mutually exclusive with `Session`. |
| `Token` | `string?` | `null` | Account token (usually left null until sign-in). |
| `Imei` | `string?` | `null` | Stable per-device id. **Required** if neither `Session` nor `SessionString` is set. |
| `ApiId` / `ApiHash` | `int` / `string` | `0` / `""` | Sent with `sendCode`; Eitaa ignores them. |
| `TokenRefreshHandler` | `Func<…,Task<bool>>?` | `null` | Custom expired-token handler. |
| `AutoRefreshToken` | `bool` | `true` | Auto-refresh an expired token via `eitaaRefreshToken` and retry once. |
| `AppInfo` | `Mt.IEitaaAppInfo?` | `null` | Device descriptor sent with the automatic token refresh. |
| `AutoFloodWait` | `bool` | `true` | Wait out `FLOOD_WAIT_x` and retry (up to `MaxFloodWaitSeconds`). |
| `MaxFloodWaitSeconds` | `int` | `60` | Longest flood wait handled automatically; longer waits surface as an error. |
| `Layer` | `int` | `137` | TL layer advertised in the envelope. |
| `ThrowOnDeserializeError` | `bool` | `true` | See [Error Handling](12-Error-Handling.md). |
| `Endpoint` | `string?` | `null` | A single HTTPS endpoint. When null, the client load-balances/fails over across Eitaa's DC-1 host pool. |
| `Timeout` | `TimeSpan` | 30s | Per-request timeout. |
| `MaxRetries` | `int` | `2` | Transient-failure retries before giving up. |

---

## Sessions

A **session** holds the auth `Token`, the device `Imei`, the in-progress-login fields
(`PhoneNumber`, `PhoneCodeHash`), and a **peer cache** (learned access hashes, so peers can be
addressed by bare id across runs — the equivalent of a Pyrogram `.session` file).

### `IEitaaSession`

```csharp
string? Token { get; set; }
string  Imei  { get; set; }
string? PhoneNumber { get; set; }
string? PhoneCodeHash { get; set; }

void SetAccessHash(long peerId, long accessHash);
bool TryGetAccessHash(long peerId, out long accessHash);
void SetPeer(long peerId, long accessHash, PeerType type);
bool TryGetPeer(long peerId, out long accessHash, out PeerType type);
Task SaveAsync(CancellationToken ct = default);
```

### Implementations

| Type | Persistence |
|---|---|
| `MemorySession` | In-memory only; `SaveAsync` is a no-op. Thread-safe (`ConcurrentDictionary` peer cache). |
| `JsonFileSession` | Extends `MemorySession`; persists to a JSON file (atomic temp-file + move, `SemaphoreSlim`-guarded). |

```csharp
// Open (or create) a persistent session file. imei is generated if the file is new.
public static JsonFileSession Open(string path, string? imei = null)

// A throwaway in-memory session (you supply imei; token optional).
var mem = new MemorySession("mtpasdsxfg0a1b2c__web", token: null);
```

---

## Portable session strings

Export a whole session to a single compact **Base64 string** and rebuild a client from it later —
ideal for storing **N accounts in a database** with no `.session` files on disk. This is the Eitaa
equivalent of Pyrogram's session string.

### API

```csharp
// On the client:
string EitaaClient.ExportSessionString(bool includePeers = true)

// On MemorySession (and JsonFileSession, which derives from it):
static MemorySession MemorySession.FromString(string session)
string              MemorySession.ExportString(bool includePeers = true)

// Construct a client straight from a string:
new EitaaClient(new EitaaClientOptions { SessionString = str })

// Low-level helper:
string      SessionString.Serialize(SessionData data, bool includePeers = true)
SessionData SessionString.Deserialize(string session) // throws FormatException on bad/old input
```

### Storing accounts in a database

```csharp
// After login/refresh, persist the string (e.g. an encrypted DB column):
string session = client.ExportSessionString();     // token + imei + peer cache
myDb.Save(accountId, session);

// On startup, reconstruct the client from just the string — no file involved:
using var c = new EitaaClient(new EitaaClientOptions { SessionString = myDb.Load(accountId) });
User me = await c.GetMeAsync();

// Token-only (smaller; the peer cache rebuilds from updates/dialogs):
string minimal = client.ExportSessionString(includePeers: false);
```

Each client keeps its own in-memory state, so many independent sessions can run in one process.

> ⚠️ **Security:** a session string is a **bearer credential** — it contains the account token.
> Store it in a secret store or an encrypted column, and never log it.

### Format

`magic "ESS"` · `version:byte` · `imei` · `token?` · `phoneNumber?` · `phoneCodeHash?` ·
`peerCount:7-bit-int` · `peers[]{ id:long, hash:long, type:byte }`, Base64-encoded. The `version`
byte fails bad/old strings fast and lets the format evolve by appending; unknown trailing bytes are
ignored on read. A truncated or foreign string throws a clear `FormatException`.
