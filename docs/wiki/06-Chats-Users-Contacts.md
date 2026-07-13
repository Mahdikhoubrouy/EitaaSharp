# Chats, Users & Contacts

[← Home](Home.md)

## Chats

### `GetChatAsync`
```csharp
Task<Chat> GetChatAsync(ChatId chat, CancellationToken ct = default)
```
Fetches a chat, channel, or user as a friendly [`Chat`](10-Types-Enums.md#chat). This is the **full-info**
call — it goes through `getFullChannel` / `getFullChat` / `getFullUser`, so the result includes
`MembersCount` and the `About` description in addition to `Title`/`Username`.
```csharp
Chat c = await client.GetChatAsync("@eitaa");
Console.WriteLine($"{c.Title} — {c.MembersCount} members — {c.About}");
```

### `JoinChatAsync`
```csharp
Task<Chat> JoinChatAsync(ChatId chat, CancellationToken ct = default)
```
Joins a public group/channel and returns it.

### `LeaveChatAsync`
```csharp
Task<bool> LeaveChatAsync(ChatId chat, CancellationToken ct = default)
```
Leaves a group/channel.

### `SetChatTitleAsync`
```csharp
Task<bool> SetChatTitleAsync(ChatId chat, string title, CancellationToken ct = default)
```
Renames a group/channel.

### `AddChatMembersAsync`
```csharp
Task<bool> AddChatMembersAsync(ChatId chat, ChatId[] users, CancellationToken ct = default)
```
Adds users to a group/channel.

## Members

### `GetChatMembersAsync`
```csharp
IAsyncEnumerable<ChatMember> GetChatMembersAsync(ChatId chat, int limit = 200, CancellationToken ct = default)
```
Streams a channel/supergroup's participants (auto-paged) as [`ChatMember`](10-Types-Enums.md#chatmember).
```csharp
await foreach (ChatMember m in client.GetChatMembersAsync("@group", limit: 1000))
    Console.WriteLine($"{m.User.FullName} — {m.Status}");
```

### `GetChatMemberAsync`
```csharp
Task<ChatMember> GetChatMemberAsync(ChatId chat, ChatId user, CancellationToken ct = default)
```
Fetches a single participant's membership (role/status) in a chat.

## Dialogs

### `GetDialogsAsync`
```csharp
IAsyncEnumerable<Dialog> GetDialogsAsync(int limit = 100, CancellationToken ct = default)
```
Streams your conversation list (auto-paged) as [`Dialog`](10-Types-Enums.md#dialog). Fetching dialogs also
populates the peer cache, so afterwards you can address those chats by bare id.
```csharp
await foreach (Dialog d in client.GetDialogsAsync(limit: 200))
    Console.WriteLine($"{d.Chat.Title ?? d.Chat.Id.ToString()} — {d.UnreadCount} unread");
```

## Users

### `GetMeAsync`
```csharp
Task<User> GetMeAsync(CancellationToken ct = default)
```
Returns the logged-in account as a [`User`](10-Types-Enums.md#user). Also caches the self-id used to
address `"me"`.

### `GetUsersAsync`
```csharp
Task<IReadOnlyList<User>> GetUsersAsync(ChatId[] users, CancellationToken ct = default)
```
Fetches several users at once.

## Contacts

### `GetContactsAsync`
```csharp
Task<IReadOnlyList<User>> GetContactsAsync(CancellationToken ct = default)
```
Returns your saved contacts.

### `SearchGlobalAsync`
```csharp
Task<IReadOnlyList<Chat>> SearchGlobalAsync(string query, int limit = 50, CancellationToken ct = default)
```
Global search for public chats/channels/users matching a query.

---

## Bound methods

- `chat.SendMessageAsync(text)` — send a text message to that chat.
- `user.SendMessageAsync(text)` — start/continue a private conversation with that user.

```csharp
Chat channel = await client.GetChatAsync("@my_channel");
await channel.SendMessageAsync("posted via the bound method");
```
