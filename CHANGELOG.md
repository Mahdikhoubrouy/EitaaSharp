# Changelog

All notable changes to EitaaSharp are documented here. This project adheres to
[Semantic Versioning](https://semver.org/).

## [0.4.0]

Connection reuse and observable token renewal — for hosts that create many short-lived clients.

### Added
- **`EitaaClientOptions.HttpClient`** — send through a shared `HttpClient` (e.g. one per process over a
  pooled `SocketsHttpHandler`). Short-lived clients then reuse warm connections instead of paying DNS, TCP
  and TLS on every call. A supplied client is never disposed or modified.
- **`EitaaClient.TryRefreshTokenAsync`** — renews the token without the refresh-retry wrapper (safe inside a
  custom `TokenRefreshHandler`). Concurrent callers are collapsed into a single `eitaaRefreshToken`.
- **`OnTokenRefreshed`** (option and settable property) with `TokenRefreshedEventArgs(Token, ExpiresAt,
  SocketToken)` — raised after every renewal, including the automatic one, so the expiry can be persisted.

### Changed
- `HttpEitaaTransport` applies its timeout **per attempt** (a linked cancellation token) instead of through
  `HttpClient.Timeout`. A caller-supplied `HttpClient` no longer has its `Timeout` mutated; an owned client
  uses an infinite client timeout. An attempt that times out fails over to the next host; the final failure
  is an `HttpRequestException` whose inner exception is a `TimeoutException`. A caller's own cancellation is
  still not retried.
- The default automatic token refresh now also de-duplicates concurrent renewals.

## [0.3.0]

Production-readiness release (Phase D): deserializer hardening, portable session
strings, wire-correct reachable clusters, and a batch of high-level methods.

### Added
- **Deserializer hardening.** An unknown/unmodeled TL constructor no longer crashes a caller:
  - `UnknownConstructor(id, rawBody)` — a tolerant top-level fallback (`CallObjectAsync` returns
    it instead of throwing; nested unknowns stay positionally unrecoverable and still throw).
  - `TlDeserializeException` now carries the byte `Offset` and a `TypePath` breadcrumb of the
    parent types being read (e.g. `… while reading Contacts.ResolvedPeer → Channel`).
  - `EitaaClient.ThrowOnDeserializeError` (default `true`) + `OnDeserializeError` hook — opt into
    returning `default` and reporting the error instead of throwing, for every call.
- **Portable session strings.** Export/import a session as one compact Base64 string for
  database / env / secret-store storage and N independent in-process sessions:
  `EitaaClient.ExportSessionString(includePeers)`, `MemorySession.FromString` / `ExportString`,
  and `EitaaClientOptions.SessionString`. (A session string is a bearer credential — store it in
  a secret store or an encrypted column, never in logs.)
- **Reactions:** `SendReactionAsync` / `message.ReactAsync` (set/clear an emoji reaction) and
  `GetMessageReactionsAsync` (aggregated `MessageReaction` counts).
- **Web-view:** `RequestWebViewAsync` — resolve a bot mini-app / web-view launch URL.
- **Messages:** `PinChatMessageAsync` / `UnpinChatMessageAsync` (+ `message.PinAsync` /
  `UnpinAsync`), `EditMessageMediaAsync`, `EditMessageCaptionAsync`, `DeleteChatHistoryAsync`,
  `GetMessageAsync`.
- **Chats:** `Chat.About` — `GetChatAsync` now also returns the chat/channel description.

### Fixed / schema completeness
- Made the reachable merged clusters wire-correct and fully typed, verified with `wire-audit.js`
  (cluster mismatches 8 → 0): reactions (`messageReactions`, `messageReactionsList` and their
  leaves), attach-menu / mini-app (`attachMenuBot(s)`, `attachMenuBotIcon`, icon colors), and
  Eitaa notifications (`updateEitaaNotification`, `EitaaNotification_message` + `_button`).
- Registered `chatPhoto_layer126#d20b9f3c`, the `ChatPhoto` variant the server returns inside a
  `Channel` — fixes a crash when resolving public channels.

### Notes
- Golden-byte parity is intact; all schema changes are additive or source-verified. Layer stays 137.
- 117 tests pass; the library builds clean under `-warnaserror`.

## [0.2.0]

- Layer-137 schema sync, token auto-refresh, `FLOOD_WAIT` auto-retry, resilient update receive
  loop, progress-reporting chunked upload/download, expanded media sends (voice/location/contact/
  poll), and the `eitaaNoSend` handling for socket-only methods.
