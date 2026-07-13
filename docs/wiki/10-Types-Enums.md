# Types & Enums Reference

[← Home](Home.md)

The friendly types returned by the high-level API. Each wraps the raw TL object (exposed via `Raw`) and
adds bound convenience methods.

## `Message`

```csharp
public int Id { get; }
public string Text { get; }                    // "" for media-only messages
public DateTimeOffset Date { get; }
public Chat Chat { get; }
public User? From { get; }                     // sender (null for some channel posts)
public bool Outgoing { get; }                  // true if sent by this account
public int? ReplyToMessageId { get; }
public Schema.IMessageMedia? Media { get; }    // raw media, if any
public bool HasMedia { get; }                  // photo or document present
public Schema.IMessage? Raw { get; }           // the underlying TL message
```

Bound methods (see [Messages](04-Messages.md#bound-methods-on-message)):
`ReplyAsync`, `EditAsync`, `DeleteAsync`, `ForwardAsync`, `DownloadAsync`, `ReactAsync`, `PinAsync`, `UnpinAsync`.

## `Chat`

```csharp
public long Id { get; }
public ChatType Type { get; }                  // Private / Bot / Group / Supergroup / Channel
public string? Title { get; }                  // groups/channels; full name for a private chat
public string? Username { get; }               // without a leading '@'
public string? FirstName { get; }              // private chats
public string? LastName { get; }
public int? MembersCount { get; }              // groups/channels, when known
public string? About { get; }                  // description (populated by GetChatAsync)
public Schema.IChat? Raw { get; }              // null for a user-backed private chat

public Task<Message> SendMessageAsync(string text, CancellationToken ct = default);
```

## `User`

```csharp
public long Id { get; }
public string? Username { get; }
public string? FirstName { get; }
public string? LastName { get; }
public string? Phone { get; }
public bool IsBot { get; }
public bool IsSelf { get; }                    // the logged-in account
public string FullName { get; }                // First + Last
public Schema.User Raw { get; }

public Task<Message> SendMessageAsync(string text, CancellationToken ct = default);
```

## `Dialog`

```csharp
public Chat Chat { get; }
public int TopMessageId { get; }
public int UnreadCount { get; }
public Schema.IDialog Raw { get; }
```

## `ChatMember`

```csharp
public User User { get; }
public ChatMemberStatus Status { get; }        // Member / Administrator / Creator / Banned / Left
public Schema.IChannelParticipant Raw { get; }
```

## `DeletedMessages`

```csharp
public sealed record DeletedMessages(IReadOnlyList<int> MessageIds, long? ChannelId);
```

## `MessageReaction`

```csharp
public sealed record MessageReaction(string Emoji, int Count);
```

---

## Enums

### `ChatType`
`Private` · `Bot` · `Group` · `Supergroup` · `Channel`

### `ChatMemberStatus`
`Member` · `Administrator` · `Creator` · `Banned` · `Left`

### `PeerType`
`User` · `Chat` · `Channel` — the kind stored per peer in the session cache.

### `ChatAction`
Used by [`SendChatActionAsync`](04-Messages.md#sendchatactionasync):

`Typing` · `Cancel` · `UploadPhoto` · `RecordVideo` · `UploadVideo` · `RecordAudio` · `UploadAudio` ·
`UploadDocument` · `FindLocation` · `ChooseContact` · `Playing`
