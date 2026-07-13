# Reactions & Web-View

[← Home](Home.md)

## Reactions

Eitaa uses **string (emoji) reactions**.

### `SendReactionAsync`
```csharp
Task SendReactionAsync(ChatId chat, int messageId, string? emoji, CancellationToken ct = default)
```
Sets the current account's reaction on a message. Pass `emoji: null` to **remove** the reaction.

```csharp
await client.SendReactionAsync("@channel", 1234, "👍");
await client.SendReactionAsync("@channel", 1234, null); // clear
```

Also available as the bound method:
```csharp
await message.ReactAsync("❤️");
await message.ReactAsync(null); // clear
```

### `GetMessageReactionsAsync`
```csharp
Task<IReadOnlyList<MessageReaction>> GetMessageReactionsAsync(
    ChatId chat, int messageId, int limit = 100, CancellationToken ct = default)
```
Returns the reactions on a message, aggregated by emoji into friendly counts, ordered most-reacted first.
`limit` bounds how many individual reactions are sampled when aggregating.

```csharp
foreach (MessageReaction r in await client.GetMessageReactionsAsync("@channel", 1234))
    Console.WriteLine($"{r.Emoji} × {r.Count}");
```

`MessageReaction` is a simple record:
```csharp
public sealed record MessageReaction(string Emoji, int Count);
```

> Reactions are only accepted where the chat allows them; on a chat that doesn't, the server rejects the
> call. If Eitaa serves a given method only over its native socket, the call is skipped gracefully via
> the `eitaaNoSend` mechanism (returns an empty list rather than throwing).

---

## Web-view / bot mini-apps

### `RequestWebViewAsync`
```csharp
Task<string?> RequestWebViewAsync(
    ChatId chat, ChatId bot, string? url = null, string? startParam = null,
    string platform = "android", CancellationToken ct = default)
```
Resolves the launch **URL** for a bot's web-view / mini-app in a chat. Returns the URL to load in a web
view, or `null` if the server didn't return one.

| Parameter | Meaning |
|---|---|
| `chat` | The chat to open the web-view in. |
| `bot` | The bot that owns the web-view (id or `@username`). |
| `url` | A specific web-view URL to open; `null` opens the bot's default menu app. |
| `startParam` | An optional start parameter passed to the mini-app. |
| `platform` | Platform string reported to the app (default `"android"`). |

```csharp
string? launchUrl = await client.RequestWebViewAsync("me", "@some_bot");
if (launchUrl is not null)
    OpenInBrowser(launchUrl);
```
