# Raw API & Architecture

[← Home](Home.md)

## The raw API

Not every one of Eitaa's ~420 TL methods has a friendly wrapper. Any of them is reachable via the
generated **raw records** in `EitaaSharp.Schema` and the universal call entry points:

```csharp
Task<TResult> InvokeAsync<TResult>(ITlMethod<TResult> method, CancellationToken ct = default) // alias of CallAsync
Task<TResult> CallAsync<TResult>(ITlMethod<TResult> method, CancellationToken ct = default)
Task<ITlObject> CallObjectAsync(ITlObject method, CancellationToken ct = default)
```

```csharp
using Account = EitaaSharp.Schema.Account;

var wallpapers = await client.InvokeAsync(new Account.GetWallPapers { Hash = 0 });
```

- Every generated **method** is a `sealed record` implementing `ITlMethod<TResult>` — it knows how to
  serialize its arguments and read its own result type.
- Every generated **constructor** is a `sealed record` implementing its type's `I{Type}` interface.
  Boxed unions are modelled as interfaces; pattern-match or cast the result to the concrete constructor.
- Optional `flags.N?T` fields are nullable; the flag bit is set automatically when the value is non-null.
- Raw records live under sub-namespaces matching TL: `EitaaSharp.Schema.Messages`,
  `EitaaSharp.Schema.Auth`, `EitaaSharp.Schema.Channels`, `EitaaSharp.Schema.Updates`, `…Mt`, etc.

`CallAsync`/`CallObjectAsync` apply the client's resilience policy (update dispatch, token refresh,
flood-wait, `eitaaNoSend`) to raw calls too — see [Error Handling](12-Error-Handling.md).

---

## How the wire works

### The envelope

Eitaa does **not** use MTProto encryption. Each request is a method serialized to TL bytes, wrapped in an
`eitaaObject` envelope, and POSTed as plaintext over HTTPS:

```
eitaaObject { token:string, imei:string, packed_data:bytes, layer:int }
```

- `token` — the account token (sent fresh from the session on every request).
- `imei` — the stable per-device id (format `mtpasdsxfg{6 hex}__web`).
- `packed_data` — the actual TL method, serialized.
- `layer` — the TL layer (**137**).

### Transport

`HttpEitaaTransport` POSTs to `…/eitaa/index.php` across Eitaa's datacenter-1 host pool, split into
three groups by **`ConnectionKind`**:

| `ConnectionKind` | Value | Host group | Why |
|---|---|---|---|
| `Generic` | 0 | primary (= upload hosts) | Ordinary calls. |
| `Upload` | 4 | upload hosts | Upload parts are stored **host-locally**, so `saveFilePart` and the follow-up `sendMedia` must hit the same host. |
| `Download` | 2 | download hosts | `getFile` is global; a separate host group. |

The pool shuffles and fails over across interchangeable hosts. You can pin a single endpoint via
`EitaaClientOptions.Endpoint`.

### TL engine (`EitaaSharp.Tl`)

- `TlWriter` / `TlReader` — little-endian TL serialize/deserialize primitives (ints, longs, doubles,
  `bytes`/`string` with length+padding, vectors, booleans, gzip-packed).
- `TlRegistry` — maps constructor ids → deserializers (and a short type name for diagnostics).
- `ITlObject` / `ITlMethod<TResult>` — the interfaces every generated record implements.

> **Key fact:** the same constructor id does **not** always mean the same wire. Eitaa reuses upstream
> Telegram ids with customised bodies, and the server sometimes sends older `_layerNN` variants. All
> schema entries are verified byte-for-byte against the decompiled Android source.

---

## The schema pipeline

The generated code under `src/EitaaSharp.Schema/Generated/*.g.cs` is produced from JSON schemas:

```
scheme/api.json + scheme/mtproto.json
   └─ dotnet run --project tools/EitaaSharp.SchemaGen
        └─ src/EitaaSharp.Schema/Generated/*.g.cs   (records + the registry)
```

To change a TL type you edit the JSON (usually via a `tools/extract-tl/sync-*.js` splice that is
hand-derived from `eitaa-android-source/.../TLRPC.java`), regenerate, and rebuild.

`tools/extract-tl/`:
- `extract.js` — `TLRPC.java` → JSON.  `merge.js` — add missing ids.
- `sync-*.js` — replace/add specific entries with source-verified exact definitions.
- **`wire-audit.js`** — the correctness oracle: reconstructs each type's byte-level field sequence from
  the source `readParams` and diffs it against the schema. `node tools/extract-tl/wire-audit.js [names…]`.

Golden-byte tests (`tests/EitaaSharp.Tl.Tests/GoldenByteTests.cs`) prove existing entries serialize
byte-for-byte identically to the reference implementation; schema changes stay additive or source-verified.

---

## The `eitaaNoSend` mechanism

Some TL methods (e.g. `messages.setTyping`) are served by the official client **only over its native
socket** (`libtmessages.40.so`), which is not re-implementable and which the web client also lacks. Over
HTTP they answer `INVALID_CONSTRUCTOR`. Mirroring the official web client's `eitaaNoSend` list,
`EitaaClient`:

- **seeds** the list with `messages.setTyping`, and
- **grows** it automatically the first time any method is rejected with `INVALID_CONSTRUCTOR`.

Such methods are then skipped and return `default` (e.g. `SendChatActionAsync` returns `false` without
touching the network). This is why chat-action methods are safe to call but are no-ops over HTTP.

---

## Deserializer robustness

`EitaaClient`/`TlReader` never crash a caller on an unmodeled constructor:

- An unknown **top-level** response becomes an `UnknownConstructor(id, rawBody)` (via `CallObjectAsync`)
  instead of throwing — the id and bytes are preserved for inspection.
- `TlDeserializeException` carries the byte **offset** and a **type-path breadcrumb** of the parent
  types being read, e.g. `… while reading Contacts.ResolvedPeer → Channel`.
- `EitaaClient.ThrowOnDeserializeError` (default `true`) + `OnDeserializeError` let you turn a hard
  throw into a logged, `default`-returning soft failure for every call.

See [Error Handling](12-Error-Handling.md).
