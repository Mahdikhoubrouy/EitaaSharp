# Addressing Peers (`ChatId`)

[← Home](Home.md)

Every high-level method that targets a chat, channel, or user takes a **`ChatId`** — a small
`readonly struct` that can be a numeric id, a `@username`, or the literal `"me"`. You almost never
construct it explicitly: `long` and `string` convert **implicitly**.

```csharp
await client.SendMessageAsync(123456789, "by numeric id");
await client.SendMessageAsync("@my_channel", "by username");
await client.SendMessageAsync("me", "to Saved Messages");
```

## How a `ChatId` resolves

| Form | Example | Resolution |
|---|---|---|
| `"me"` / `"self"` | `"me"` | `InputPeerSelf` — the logged-in account (Saved Messages). |
| `@username` | `"@durov"` | Resolved via `contacts.resolveUsername` and cached. Works for users, groups, channels, and bots. |
| numeric id | `-100123…` / `123…` | Looked up in the session **peer cache**. Must have been seen before (see below). |

### The peer-cache requirement for numeric ids

Addressing a peer by **bare numeric id** requires its access hash to already be in the session cache.
The cache is populated automatically whenever the peer appears in a response — e.g. after
`GetChatAsync`, `GetDialogsAsync`, `GetChatHistoryAsync`, or resolving it by `@username` once. If the
id is unknown, resolution throws:

```
InvalidOperationException: Peer <id> is not in the cache. Fetch it first
(GetChatAsync/GetDialogsAsync/GetChatHistoryAsync) or address it by @username.
```

**Rule of thumb:** the first time you touch a peer in a session, use its `@username` (or fetch your
dialogs). After that, the bare id works and persists in a `JsonFileSession` across runs.

## Members

```csharp
public readonly struct ChatId : IEquatable<ChatId>
{
    public bool IsSelf { get; }       // the "me" form
    public bool IsId { get; }         // a numeric id
    public bool IsUsername { get; }   // an @username
    public long Id { get; }           // the numeric id (0 if not IsId)
    public string Username { get; }   // the username without '@' ("" if not IsUsername)

    public static implicit operator ChatId(long id);
    public static implicit operator ChatId(string value); // "me" / "@name" / "name"
}
```

A `string` value is interpreted as `"me"`/`"self"` → self, otherwise as a username (a leading `@` is
optional). Pass a numeric id as a `long` (not a numeric string) so it is treated as an id.

## Resolving to raw input peers

If you drop to the [raw API](11-Raw-API-Architecture.md), resolve a `ChatId` to the TL input type first:

```csharp
IInputPeer peer = await client.ResolvePeerAsync("@my_channel");
// then use peer in a raw Messages.SendMessage { Peer = peer, … }
```

`client.Peers` (a `PeerResolver`) also exposes `UserPeer`/`ChannelPeer`/`ChatPeer` helpers that build
input peers from cached ids.
