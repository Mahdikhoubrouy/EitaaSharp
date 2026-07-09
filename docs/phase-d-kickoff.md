# Phase D — kickoff prompt for a fresh session

Paste this whole file as your first message. It is self-contained: everything a new
session needs to implement Phase D correctly, in order, without prior context.

---

## Your task

Implement **Phase D** of the EitaaSharp SDK, following `docs/phase-d-plan.md` **in this order**:

1. **Item 1 — Deserializer hardening** (branch `feat/deser-hardening`)
2. **Item 5 — Portable session strings** (branch `feat/session-string`) — self-contained, do it early
3. **Item 2 — Schema completeness for reachable clusters** (branch `feat/schema-clusters`)
4. **Item 4 — High-demand high-level methods** (branch `feat/highlevel-gaps`)

Read `docs/phase-d-plan.md` first — it has the full design, file list, verification, and
risks for each item. Do each item on its own branch, verify, merge to `main` with `--no-ff`,
then start the next. After all four, bump the version to **0.3.0** and update the README.

---

## What this project is

EitaaSharp is a strongly-typed, Pyrogram-style **C# / .NET 10 SDK for the Eitaa messenger**.
Eitaa uses the Telegram **TL (Type Language)** binary wire format but a *simplified transport*:
each request is wrapped in an `eitaaObject` envelope `{token, imei, packed_data, layer}` and
sent as **plaintext over HTTPS POST** (no MTProto encryption). Current TL layer is **137**.

- Repo root: `F:\Eitaa\EitaaSharp` (git, remote `github.com/Mahdikhoubrouy/EitaaSharp`, branch `main`).
- ⚠️ The Bash tool's cwd resets to `F:\Eitaa\mtproto-core` between calls — always use absolute
  paths or `cd "F:/Eitaa/EitaaSharp" && …`.
- Platform: Windows 11, PowerShell primary + Bash (git-bash). `node` and `dotnet` are on PATH.

### Layout
```
EitaaSharp.slnx                      # solution (net10.0)
src/EitaaSharp.Tl/                   # TL engine: TlReader, TlWriter, TlRegistry, ITlObject, TlException
src/EitaaSharp.Schema/Generated/     # GENERATED records/interfaces (*.g.cs) — do not hand-edit
src/EitaaSharp.Client/               # high-level client, transport, session, parsing, methods
  Methods/<Category>/                # ONE public method per file (Auth, Messages, Chats, Users, …)
  Types/<Category>/                  # friendly types (Message, Chat, User, …), sub-foldered
  Parsing/                           # ParseContext, ResultParser (raw TL -> friendly)
  Session/                           # IEitaaSession, MemorySession, JsonFileSession, EitaaImei
  Transport/                         # IEitaaTransport, HttpEitaaTransport, ConnectionKind
  Rpc/                               # EitaaRpc, RpcException, SessionExpiredException
  Updates/                           # EitaaClient.ReceiveLoop.cs, UpdateDispatcher
tools/EitaaSharp.SchemaGen/          # api.json+mtproto.json -> Generated/*.g.cs (dotnet run)
tools/extract-tl/*.js                # TLRPC.java -> schema tooling (see below)
tests/EitaaSharp.{Tl,Client}.Tests/  # xUnit; InternalsVisibleTo is set for Client.Tests
samples/EitaaSharp.Sample.{Console,Bot}/
scheme/api.json, scheme/mtproto.json # the TL schema the generator consumes
eitaa-android-source/                # decompiled Android app (git-ignored, reference). TLRPC.java = TL defs
eitaa-web.js                         # decompiled web client (git-ignored, reference). HTTP-only, `eitaaNoSend`
docs/phase-d-plan.md                 # THE PLAN
```

### The schema pipeline
`scheme/api.json` + `scheme/mtproto.json` → `dotnet run --project tools/EitaaSharp.SchemaGen`
→ `src/EitaaSharp.Schema/Generated/*.g.cs`. To change a TL type you edit the JSON (usually via a
`tools/extract-tl/sync-*.js` splice), regenerate, then build.

`tools/extract-tl/` (Node):
- `extract.js` — TLRPC.java → JSON.  `merge.js` — add missing ids.  `sync-changed.js` /
  `sync-wire.js` / `sync-user.js` — replace specific entries with exact defs hand-derived from source.
- `wire-audit.js` — **your correctness oracle for Item 2**: reconstructs each type's byte-level
  field sequence from the source `readParams` and diffs it against the schema.
  `node tools/extract-tl/wire-audit.js <predicate…>` (no args = audit all; writes `~/wirediff.json`).

---

## Non-negotiable conventions & invariants

- **Git**: GitHub Flow. One `feat/*` branch per item; **Conventional Commits**; merge to `main`
  with `git merge --no-ff`. End every commit message with:
  `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`. Commit/push only what the task needs.
- **Naming**: every async public method ends with `Async`. One public method per file under
  `Methods/<Category>/`. Friendly types under `Types/<Category>/` (sub-foldered). `ChatId` input,
  friendly output. Add a **bound method** on `Message`/`Chat` where natural (mirror `ReplyAsync`).
- **Docs**: full English XML docs (`<summary>` + `<param>` + `<returns>`) on public members.
- **Zero warnings**: CI builds with `-warnaserror`. `CS1591` and `CS1573` are already in
  `Directory.Build.props` `NoWarn`; do not reintroduce other warnings.
- **Golden-byte parity**: `tests/EitaaSharp.Tl.Tests/GoldenByteTests.cs` proves existing entries
  serialize byte-for-byte identically. These must stay green — only make **additive** schema
  changes, or replace an entry with a source-verified exact definition.
- **Layer stays 137.**

## Verify after every change (and before every merge)
```bash
cd "F:/Eitaa/EitaaSharp"
dotnet build EitaaSharp.slnx -c Release -warnaserror   # MUST be 0 warnings / 0 errors
dotnet test  EitaaSharp.slnx -c Release                # ALL green
```
⚠️ Do **not** pipe `dotnet build` into `grep` before an `&&` you care about — the pipe's exit
code is grep's, which silently hides a failed build. Check the build's own exit code.

## Live smoke testing (optional but expected where feasible)
A logged-in session exists at `%APPDATA%\eitaa-bot\eitaa.session.json`. To exercise the live
server, create a **throwaway** console project under `tools/diag-<name>/` that references
`src/EitaaSharp.Client`, open the session with `JsonFileSession.Open(path)`, run with
`dotnet run --project tools/diag-<name>`, then **delete the folder** (never commit diag
projects). Send tests to `"me"` (Saved Messages). Example session load:
```csharp
string sp = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "eitaa-bot", "eitaa.session.json");
using var c = new EitaaClient(new EitaaClientOptions { Session = JsonFileSession.Open(sp) });
```

---

## Hard-won facts (avoid re-learning these)

- **The Eitaa socket is native** (`libtmessages.40.so`); the web client is HTTP-only. Do **not**
  try to implement a socket. Socket-only methods (e.g. `messages.setTyping`) are handled by the
  `eitaaNoSend` mechanism in `EitaaClient.CallAsync` (skip + remember on `INVALID_CONSTRUCTOR`).
- **Same constructor id ≠ same wire.** Eitaa reuses upstream Telegram ids with customised bodies
  (e.g. `user` swaps `scam`→`trusty`, adds `MXB_*`; has `flags2`/`eFlags`). Always confirm with
  `wire-audit.js` against `TLRPC.java`, never assume.
- **The server sends `_layerNN` variants** the merge skipped (e.g. it sends `TL_user_layer135`,
  id `-321753653`, not the unsuffixed `user`). When a type mismatches, make the variant the
  **server actually sends** the canonical one (see `tools/extract-tl/sync-user.js`).
- **Upload parts are stored host-locally** → `saveFilePart` and the follow-up `sendMedia` must hit
  the same host; downloads use a separate host group. `HttpEitaaTransport` already routes this by
  `ConnectionKind`; don't split uploads across hosts.
- **Downloads must stop at the known size** (a file that is an exact multiple of the 128 KB chunk
  otherwise reads one chunk past EOF → server `RETRY_LIMIT`). `FileDownloader` takes `expectedSize`.
- `EitaaClient` already has: token auto-refresh, `FLOOD_WAIT` auto-retry, resilient receive loop
  (`OnReceiveError`), `OnMessage`/`OnEditedMessage`/`OnDeletedMessages`/`OnRawUpdate`, and the
  `eitaaNoSend` set. Reuse `WithRefreshRetryAsync(...)` for anything that hits the network.

## Current baseline
`main` builds clean (`-warnaserror`), **90 tests** pass, version **0.2.0**. Tasks #1–#21 of the
project are done; Phase D is the next work.

---

## Definition of done (repeat per item)
Dedicated branch → 0 warnings under `-warnaserror` → all existing + new tests green →
golden-byte parity intact → live smoke where feasible → merge to `main` `--no-ff` → README/notes
updated. After all four items, bump to **0.3.0**.

Start with **Item 1**. Read `docs/phase-d-plan.md`, create `feat/deser-hardening`, and go.
