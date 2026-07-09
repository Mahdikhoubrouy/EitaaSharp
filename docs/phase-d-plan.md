# Phase D — Production-readiness plan

Closes the three highest-impact gaps identified in the readiness review:

1. **Deserializer hardening** — never crash on an unknown/unmodeled TL constructor.
2. **Schema completeness** — verify & complete the reachable merged types (reactions,
   attach-menu / mini-app, web-view, Eitaa notifications) that came from the ~77%-accurate
   extractor.
3. **High-level API gaps** — add the most-requested missing operations (pin, edit-media,
   full chat info, delete history, single-message fetch).

Each item ships on its own `feat/*` branch, merged to `main` with `--no-ff` after
`dotnet build -warnaserror` and `dotnet test` are green. Existing invariants must hold:
0 warnings, golden-byte parity tests unchanged, layer 137.

---

## Item 1 — Deserializer hardening (branch `feat/deser-hardening`)

### Objective
A single unknown or malformed TL constructor must never crash a caller. Today only the
update receive loop catches `TlException`; a direct `InvokeAsync`/`CallAsync` whose response
contains an unregistered constructor throws `TlDeserializeException`.

### Constraint (why "just skip it" is not enough)
TL deserialization is **positional**: an unknown *boxed* value mid-stream has no length
prefix, so the reader cannot skip it and keep reading later fields. Robustness therefore
comes from three layers, not one magic catch.

### Design
1. **Top-level fallback (recoverable case).** In `TlReader.ReadObject()` / `TlRegistry`,
   when the *top-level* constructor id is unknown, return a typed
   `UnknownConstructor(uint Id, byte[] RawBody)` (implements `ITlObject`) instead of throwing.
   This covers "the whole response is a type we don't model" without losing the bytes.
   - Files: `src/EitaaSharp.Tl/TlRegistry.cs`, `src/EitaaSharp.Tl/UnknownConstructor.cs` (new),
     `src/EitaaSharp.Tl/TlReader.cs`.
   - Gated by a `TlReader` option (`tolerateUnknownTopLevel`, default **on** for response
     parsing) so strict paths (golden tests) can keep the throwing behavior.

2. **Richer diagnostics (unrecoverable case).** Enrich `TlDeserializeException` with the
   byte **offset**, the unknown **id (hex+signed)**, and a short **type-path breadcrumb**
   (the reader pushes/pops the type name it is currently reading). Turns "unknown id" into
   "unknown id 0x… at offset N while reading messages.Messages → Vector<Message> → …".
   - Files: `src/EitaaSharp.Tl/TlReader.cs`, `src/EitaaSharp.Tl/TlException.cs`.

3. **Client-level policy.** Add an `OnDeserializeError` hook and an
   `EitaaClientOptions.ThrowOnDeserializeError` flag (default `true`, preserving current
   behavior). When `false`, `CallAsync`/`CallObjectAsync` catch `TlException`, invoke the
   hook, and return `default` — the same resilience the receive loop already has, available
   to every call.
   - Files: `src/EitaaSharp.Client/EitaaClient.cs`, `EitaaClientOptions.cs`.

4. **Completeness safety net.** Register the `_layerNN` variants of the **core** abstract
   types the server can actually send (user/chat/channel/message/peer/photo/document families)
   so nested unknowns become rare in practice. Only ids we can verify against `TLRPC.java`
   are added (no blind registration — wrong params are worse than a clean error). This
   overlaps Item 2's tooling and is the real fix for risk #2.

### Verification
- Unit: unknown top-level id → `UnknownConstructor` with correct id + bytes; strict mode
  still throws; `ThrowOnDeserializeError=false` returns `default` and fires the hook.
- Golden-byte tests unchanged (strict mode).
- Live smoke: run the bot ~10 min; confirm no `TlException` reaches the app and any
  `OnReceiveError`/`OnDeserializeError` breadcrumbs are actionable.

### Risks & mitigations
- *Silent data loss when tolerating unknowns* → always log via the hook and expose
  `UnknownConstructor` so it is observable, never truly silent.
- *Behavior change* → all tolerant behavior is opt-in or top-level only; defaults preserve
  today's semantics.

---

## Item 2 — Schema completeness for reachable clusters (branch `feat/schema-clusters`)

### Objective
Make the **reachable** merged types wire-correct and fully typed (no `Object` params, no
missing leaf types), verified with the existing `wire-audit.js`, for the clusters a real app
touches: **reactions**, **attach-menu / mini-app**, **web-view bots**, **Eitaa notifications**.

### Method (reuses the tooling already built)
For each cluster, one deterministic pass:
1. **Enumerate** the cluster's constructors + methods and their **missing leaf types** from
   `TLRPC.java` (e.g. `Reaction`/`ReactionCount`/`MessagePeerReaction`,
   `AttachMenuPeerType`/`AttachMenuBotIcon`/`AttachMenuBotIconColor`, `Ads_ClickAction`,
   `EitaaNotification_button`).
2. **Hand-derive** each type's params from the source `readParams`/`serializeToStream`
   (the proven method used for `channel`/`user`/`photoSize`), authored in a
   `tools/extract-tl/sync-clusters.js` splice (id-based; existing entries untouched).
3. **Add the leaf constructors** so the abstract types exist; **repoint** the parent types'
   `Object` params to the real leaf types.
4. **Regenerate** (`EitaaSharp.SchemaGen`), then run `wire-audit.js <names…>` until the
   cluster reports **0 mismatches**; build; golden-byte parity must still hold.
5. **Wire the valuable high-level methods** on top:
   - `SendReactionAsync(chat, messageId, emoji)` + `message.ReactAsync(emoji)`.
   - `GetMessageReactionsAsync(...)`.
   - `RequestWebViewAsync(...) → url` (mini-app launch; already wire-functional, add a typed
     wrapper + return the URL).
6. **Live-verify** the ones Eitaa accepts (reactions on a chat that allows them; web-view URL).

### Scope guard
Only the four reachable clusters + their leaves. Dead/secret-chat/`_old`/`_layerNN` variants
stay excluded (they are documented as intentionally skipped). `log()` anything dropped so
coverage is never silently overstated.

### Verification
- `wire-audit.js` → 0 mismatches for every touched constructor.
- Round-trip tests for the new leaf/parent types (e.g. `Reaction`, `AttachMenuBot` with its
  two vectors).
- Golden-byte parity unchanged; build `-warnaserror` clean.
- Live smoke for reactions + web-view where the account permits.

### Risks & mitigations
- *Extractor imperfection* → every added/edited type is hand-verified against source and
  proven by wire-audit (not trusted blindly).
- *Interface/name collisions* (seen before, e.g. `AdsLocation` vs `Ads_Location`) → the
  Emitter already dedups by generated C# name; re-run the full generate+build after each
  cluster.

---

## Item 4 — High-demand high-level methods (branch `feat/highlevel-gaps`)

### Objective
Add the most-requested operations currently reachable only via raw `InvokeAsync`, following
the established recipe: **resolve peer → call TL method → transform via `ResultParser`**, one
method per file, full XML docs, and a bound method on `Message`/`Chat` where natural.

### Methods (each = one file under `Methods/<category>/`)
| Method | TL call | Notes / bound method |
|---|---|---|
| `PinChatMessageAsync` / `UnpinChatMessageAsync` | `messages.updatePinnedMessage` | `message.PinAsync()` / `UnpinAsync()` |
| `EditMessageMediaAsync` | `messages.editMessage` (+ `InputMedia*`) | reuses `InputFileSource` upload path |
| `EditMessageCaptionAsync` | `messages.editMessage` (message only) | thin wrapper |
| `GetChatFullAsync` | `channels.getFullChannel` / `messages.getFullChat` | returns an enriched `Chat` (about, members count) |
| `DeleteChatHistoryAsync` | `messages.deleteHistory` | — |
| `GetMessageAsync` | `messages.getMessages` (single id) | convenience over `GetMessagesAsync` |

### Approach
- Extend `ResultParser`/`ParseContext` only where a new result shape appears (e.g. full-chat
  → enriched `Chat`); otherwise reuse existing transformers (`MessageFromUpdates`,
  `AffectedCount`, `MessagesFromDifference`).
- Bound methods delegate to the client method (no duplicated logic), matching the existing
  `ReplyAsync`/`EditAsync`/`DeleteAsync` pattern.
- Keep `ChatId` input + friendly output consistent with the rest of the surface.

### Verification
- Unit: each method serializes the expected TL request (scripted transport asserts the
  outgoing constructor/args) and maps a canned response correctly.
- Live smoke against Saved Messages / a test chat for the state-changing ones (pin, edit,
  delete) where safe.
- Build `-warnaserror` clean; XML docs complete.

### Risks & mitigations
- *Edit-media re-upload semantics* → reuse the verified `FileUploader` + refresh-retry
  wrapper; live-verify one edit-media round-trip.
- *Full-chat shape variance* → guard the parser with pattern matches + fallbacks (never
  throw on an unexpected sub-shape; return the base `Chat`).

---

## Item 5 — Portable session strings (branch `feat/session-string`)

### Objective
Export a session to a single compact **Base64 string** and import it back, so sessions can be
stored anywhere (a database row, an env var, a secret store) and **N independent sessions** can
run in one process without any session file on disk. This is the Pyrogram "session string"
equivalent, adapted to Eitaa (no MTProto auth-key/DC — the state is `imei` + `token` + the
learned peer cache + the in-progress-login fields).

### Design
1. **Binary, versioned, self-describing payload.** A `SessionString` helper serializes the
   existing `SessionData` (already the serializable snapshot) into a compact binary blob and
   Base64-encodes it — much shorter and more portable than the JSON file.
   - Layout: `magic "ESS"` · `version:byte` · `imei` · `token?` · `phoneNumber?` ·
     `phoneCodeHash?` · `peerCount:varint` · `peers[]{ id:long, hash:long, type:byte }`.
   - Written/read with a tiny length-prefixed `BinaryWriter`/`BinaryReader` (or the existing
     `TlWriter`/`TlReader` primitives) — no new dependency.
   - `version` byte guarantees forward/backward-compatible evolution; unknown trailing bytes
     are ignored on read.
   - Peer cache is included by default but export takes an `includePeers` flag (a token-only
     string stays tiny; the cache is rebuildable from updates/dialogs).

2. **API surface (small, discoverable).**
   - `string EitaaClient.ExportSessionString(bool includePeers = true)`.
   - `static MemorySession MemorySession.FromString(string session)` — build a ready session.
   - `string MemorySession.ExportString(bool includePeers = true)` (instance).
   - `EitaaClientOptions { string? SessionString }` — construct a client straight from a string
     (mutually exclusive with `Session`; a plain `MemorySession` is created under the hood).
   - Files: `src/EitaaSharp.Client/Session/SessionString.cs` (new),
     `MemorySession.cs`, `EitaaClient.cs`, `EitaaClientOptions.cs`.

3. **Multi-session / DB fit.** Everything stays in `MemorySession` (in-memory, thread-safe —
   already `ConcurrentDictionary`-backed). The app owns persistence: on login/refresh it calls
   `ExportSessionString()` and writes the string to its DB; on startup it loads the string per
   account and constructs a client. No global/static state — N clients coexist. A short guide
   goes in the README ("Storing sessions in a database").

### Verification
- Unit: round-trip `Export → Import` preserves imei/token/phone/peer-cache exactly (with and
  without `includePeers`); a truncated/garbage string throws a clear `FormatException`; a
  future `version` with extra trailing bytes still imports the known fields.
- Unit: two clients built from two different session strings keep fully independent state.
- Live smoke: export a logged-in session to a string, construct a fresh client from only that
  string, and successfully `GetMe`/send a message (no session file involved).

### Risks & mitigations
- *Secret handling* — a session string is a bearer credential (contains the token). Document
  this prominently and recommend storing it in a secret store / encrypted DB column, not logs.
  (Ties into the optional at-rest encryption noted in the readiness review.)
- *Format drift* — the `magic`+`version` header makes bad/old strings fail fast and lets the
  format evolve without silent corruption.

---

## Sequencing & definition of done

1. **Item 1** first — it is the safety net that makes exercising Items 2 & 4 safe (no crash
   while probing new types).
2. **Item 5** can land early/in parallel — it is self-contained (no schema dependency) and
   unblocks the DB / multi-session workflow immediately.
3. **Item 2** — completeness reduces the unknowns Item 1 has to tolerate.
4. **Item 4** last — builds on the now-complete, wire-correct schema.

**Definition of done (per item):** dedicated branch; 0 warnings under `-warnaserror`; all
existing tests + new tests green; golden-byte parity intact; live smoke where feasible;
merged to `main` with `--no-ff`; CHANGELOG/README note added. After all items, bump to
**0.3.0**.
