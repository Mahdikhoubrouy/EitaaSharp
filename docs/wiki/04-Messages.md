# Messages

[← Home](Home.md)

All methods return friendly [`Message`](10-Types-Enums.md#message) objects (or lists thereof) and take a
[`ChatId`](03-Addressing-Peers.md). Media sending lives on its own page: [Media & Files](05-Media-Files.md).

## Sending & editing

### `SendMessageAsync`
```csharp
Task<Message> SendMessageAsync(
    ChatId chat, string text, int? replyToMessageId = null, bool silent = false,
    bool disableWebPagePreview = false, CancellationToken ct = default)
```
Sends a text message (UTF-8, up to 4096 chars). `replyToMessageId` makes it a reply; `silent` suppresses
the notification sound; `disableWebPagePreview` turns off link previews. Returns the sent message.
```csharp
Message m = await client.SendMessageAsync("@channel", "hi", disableWebPagePreview: true);
```

### `EditMessageTextAsync`
```csharp
Task<Message> EditMessageTextAsync(ChatId chat, int messageId, string text, CancellationToken ct = default)
```
Replaces the text of a message you can edit. Returns the edited message.

### `EditMessageCaptionAsync`
```csharp
Task<Message> EditMessageCaptionAsync(ChatId chat, int messageId, string caption, CancellationToken ct = default)
```
Edits the caption of a **media** message. For a plain text message this behaves exactly like
`EditMessageTextAsync`.

### `EditMessageMediaAsync`
See [Media & Files](05-Media-Files.md#editmessagemediaasync) — replaces a message's media with a newly
uploaded photo or document.

## Fetching

### `GetMessageAsync`
```csharp
Task<Message?> GetMessageAsync(ChatId chat, int messageId, CancellationToken ct = default)
```
Fetches a single message by id. Returns `null` if it doesn't exist or is inaccessible.

### `GetMessagesAsync`
```csharp
Task<IReadOnlyList<Message>> GetMessagesAsync(ChatId chat, int[] messageIds, CancellationToken ct = default)
```
Fetches specific messages by id (routes to the channel call for channels).

### `GetChatHistoryAsync`
```csharp
IAsyncEnumerable<Message> GetChatHistoryAsync(
    ChatId chat, int limit = 100, int offsetId = 0, CancellationToken ct = default)
```
Streams a chat's history newest-first, auto-paging until `limit` is reached. `offsetId` starts paging
below a given message id.
```csharp
await foreach (Message m in client.GetChatHistoryAsync("@news", limit: 500))
    Console.WriteLine($"{m.Id}: {m.Text}");
```

### `SearchMessagesAsync`
```csharp
IAsyncEnumerable<Message> SearchMessagesAsync(
    ChatId chat, string query, int limit = 100, CancellationToken ct = default)
```
Streams messages in `chat` matching a text `query`, auto-paging up to `limit`.

## Deleting

### `DeleteMessagesAsync`
```csharp
Task<int> DeleteMessagesAsync(ChatId chat, int[] messageIds, bool revoke = true, CancellationToken ct = default)
```
Deletes specific messages. `revoke: true` deletes for everyone. Returns the number affected.

### `DeleteChatHistoryAsync`
```csharp
Task<int> DeleteChatHistoryAsync(ChatId chat, bool revoke = false, CancellationToken ct = default)
```
Clears the entire history of a private chat or basic group, looping the server's batched delete until
nothing remains. `revoke: true` also deletes the other party's copy. Returns the total affected.
> Destructive and irreversible — there is no confirmation.

## Forwarding

### `ForwardMessagesAsync`
```csharp
Task<IReadOnlyList<Message>> ForwardMessagesAsync(
    ChatId to, ChatId from, int[] messageIds, bool silent = false, CancellationToken ct = default)
```
Forwards messages from one chat to another. Returns the new (forwarded) messages.

## Pinning

### `PinChatMessageAsync`
```csharp
Task PinChatMessageAsync(ChatId chat, int messageId, bool silent = false, bool oneSideOnly = false, CancellationToken ct = default)
```
Pins a message. `silent` pins without a service message/notification; `oneSideOnly` (private chats) pins
only on your side.

### `UnpinChatMessageAsync`
```csharp
Task UnpinChatMessageAsync(ChatId chat, int messageId, CancellationToken ct = default)
```
Unpins a previously pinned message.

## Reactions

`SendReactionAsync`, `GetMessageReactionsAsync` and the bound `message.ReactAsync(...)` are documented on
[Reactions & Web-View](09-Reactions-WebView.md).

## Chat actions ("typing…")

### `SendChatActionAsync`
```csharp
Task<bool> SendChatActionAsync(ChatId chat, ChatAction action = ChatAction.Typing, CancellationToken ct = default)
```
Shows a chat-action indicator (typing, uploading photo, recording voice, …). See the
[`ChatAction`](10-Types-Enums.md#chataction) enum. Returns `false` without hitting the network — on Eitaa
this method is served only over the native socket, so it is handled by the `eitaaNoSend` no-op (see
[Raw API & Architecture](11-Raw-API-Architecture.md#the-eitaanosend-mechanism)). It is safe to call; it
simply does nothing over HTTP.

### `ReadChatHistoryAsync`
```csharp
Task<bool> ReadChatHistoryAsync(ChatId chat, int maxId = 0, CancellationToken ct = default)
```
Marks a chat's history as read up to `maxId` (0 = everything).

---

## Bound methods on `Message`

Every returned `Message` carries convenience methods that reuse its chat + id:

```csharp
message.ReplyAsync(text)              // reply in the same chat
message.EditAsync(text)               // edit this message's text
message.DeleteAsync(revoke = true)    // delete this message → affected count
message.ForwardAsync(to)              // forward to another chat → forwarded messages
message.DownloadAsync()               // download its photo/document → byte[]
message.ReactAsync(emoji)             // set/clear an emoji reaction (null clears)
message.PinAsync(silent = false)      // pin this message
message.UnpinAsync()                  // unpin this message
```

```csharp
Message m = await client.SendMessageAsync("me", "draft");
await m.EditAsync("final");
await m.PinAsync();
await m.ReactAsync("👍");
```

See [Types & Enums](10-Types-Enums.md#message) for `Message`'s properties (`Id`, `Text`, `Date`, `Chat`,
`From`, `Outgoing`, `ReplyToMessageId`, `Media`, `HasMedia`, `Raw`).
