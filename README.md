# EitaaSharp (.NET 10)

A professional C# rewrite of the JavaScript `@mtproto/core` Eitaa fork. Implements the
Telegram-style TL (Type Language) binary wire format and the Eitaa transport envelope
(plaintext-over-HTTPS — no MTProto encryption), with strongly-typed, code-generated
schema bindings.

## Projects

| Project | Purpose |
|---|---|
| `src/EitaaSharp.Tl` | Hand-written TL engine: `TlWriter`/`TlReader`, `ITlObject`, `ITlMethod<T>`, `TlRegistry`, `TlInt128/256`. |
| `src/EitaaSharp.Schema` | **Generated** — one record per TL constructor/method (~1400 types), per-type marker interfaces, and the id→deserializer registry. |
| `src/EitaaSharp.Client` | Transport (`HttpEitaaTransport`), RPC (`EitaaRpc`, `RpcException`), and the high-level `EitaaClient`. |
| `tools/EitaaSharp.SchemaGen` | Console code generator (port of `scripts/generate-builder.js` / `generate-parser.js`). |
| `tests/*` | xUnit tests: primitive round-trips, **golden-byte parity vs. the JS serializer**, RPC + client behavior. |
| `samples/EitaaSharp.Sample.Console` | Interactive end-to-end demo: log in if needed, then send a message. |

## Build & test

```bash
dotnet build EitaaSharp.slnx
dotnet test  EitaaSharp.slnx
```

## Running the sample

Interactive login + send a message (the session is saved to `eitaa.session.json`, so later
runs skip the login):

```bash
dotnet run --project samples/EitaaSharp.Sample.Console
```

It prompts for your phone number and the code (delivered in-app to your other Eitaa
device), signs in, then asks for a target (`@username`, or blank for Saved Messages) and
the text to send. The session is stored under `%APPDATA%/eitaa-sample/` so it survives
rebuilds.

## Regenerating the schema

After editing `scheme/api.json` or `scheme/mtproto.json`:

```bash
dotnet run --project tools/EitaaSharp.SchemaGen
```

Generated output (`src/EitaaSharp.Schema/Generated/*.g.cs`) is committed and code-reviewed.

## Usage (SDK)

A Pyrogram-like high-level client with a persistent session, automatic peer-hash
caching, update events, and a typed passthrough for the full raw API.

```csharp
using EitaaSharp.Client;
using EitaaSharp.Client.Session;

// A persistent session file remembers the token + peer cache across runs.
var session = JsonFileSession.Open("my-account.session.json");

using var client = new EitaaClient(new EitaaClientOptions { Session = session });

// Update events
client.UpdateReceived += (_, update) => Console.WriteLine($"update: {update.GetType().Name}");

// First run: log in. Eitaa sends the code in-app to your other logged-in device.
// SendCodeAsync stores the phone + phone_code_hash in the session, so SignInAsync(code)
// just needs the code. The token is saved into the session automatically on success.
if (string.IsNullOrEmpty(session.Token))
{
    await client.SendCodeAsync("+98912...");   // default (empty) api_id/hash — what Eitaa accepts
    await client.SignInAsync("12345");          // reads phone + hash from the session; token persisted
}

// High-level helpers (peers addressed by id; access hashes are cached for you)
await client.SendMessageAsync(client.Peers.ChannelPeer(channelId: 123), "Hello from C#!");
var dialogs = await client.GetDialogsAsync(limit: 50);
var history = await client.GetHistoryAsync(client.Peers.UserPeer(userId: 456), limit: 20);
await client.SendPhotoAsync(client.Peers.ChannelPeer(123), "photo.jpg", caption: "nice");
await client.JoinChannelAsync(123);
var me = await client.GetMeAsync();

// Anything not wrapped: call the raw TL method record directly (full API surface).
var wallpapers = await client.InvokeAsync(new EitaaSharp.Schema.Account.GetWallPapers { Hash = 0 });
```

### Building blocks
- `JsonFileSession` / `MemorySession` — persistent vs in-memory session (token, imei, peer cache).
- `client.Peers` — `UserPeer(id)` / `ChannelPeer(id)` / `User(id)` / `Channel(id)` resolution.
- `client.Uploads` / `client.Downloads` — chunked file transfer.
- `client.UpdatesReceived` / `client.UpdateReceived` — update events.
- `client.CallAsync` / `client.InvokeAsync` — invoke any of the ~423 TL methods, strongly typed.

## Design notes

- **TL `long`** is canonical little-endian Int64 (verified against the JS numeric path;
  the reversed `[low,high]` array path in the JS source is internal message-id only and
  unused on the Eitaa wire).
- **Constructor ids** are written as signed Int32 but dispatched as `uint` (`id >>> 0`).
- **Boxed unions** are modeled as `I{Type}` interfaces; each constructor is a `sealed record`
  implementing its type's interface. Method results are returned as the interface — cast or
  pattern-match to the concrete constructor.
- **Optional (`flags.N?T`) fields** are nullable; the bit is set when the value is non-null.
  (This is stricter/more correct than the JS truthiness check, which dropped `0`/empty values.)
- **Error responses** surface as `RpcException`. Eitaa returns its own
  `error#c4b9f9bb code:int text:string` (confirmed live — e.g. `400 PHONE_NUMBER_INVALID`),
  not MTProto's `rpc_error`; both are handled.
- **`gzip_packed`** responses are transparently inflated.

## Live-validated

The full flow was exercised against the real Eitaa gateway (`fateme.eitaa.com`): a login
code was delivered to the device, `auth.signIn` returned an authorization, the token was
persisted, and `messages.sendMessage` delivered a message — end-to-end proof of the
serialization, envelope, transport, response parsing, and login/session flow.

Note: Eitaa only sends the login code to a web-client device id of the form
`mtpasdsxfg{6 hex}__web` (handled by `EitaaImei`), and ignores `api_id`/`api_hash` (sent
empty by default).

## Status / not yet ported

- MTProto crypto (PQ/RSA/AES-IGE/SRP) — intentionally deferred; the Eitaa path is plaintext.
- `eitaaUpdatesExpireToken` / `eitaaTokenUpdating` — referenced by the JS client but **absent
  from the TL schema**; not implemented (ids must not be invented). Token refresh is instead
  exposed as a pluggable `TokenRefreshHandler`.
