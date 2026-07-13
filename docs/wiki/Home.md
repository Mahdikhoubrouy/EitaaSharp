# EitaaSharp Wiki

**EitaaSharp** is a strongly-typed, Pyrogram-style **C# / .NET 10 SDK for the [Eitaa](https://eitaa.com) messenger**.
Eitaa speaks Telegram's **TL (Type Language)** binary wire format but over a *simplified transport*:
every request is wrapped in an `eitaaObject` envelope `{token, imei, packed_data, layer}` and sent as
**plaintext over HTTPS POST** (no MTProto encryption). The current TL layer is **137**.

This wiki documents the whole library and every public method.

- **Version:** 0.3.0
- **Target framework:** `net10.0`
- **License:** GPL-3.0-only
- **Repo:** https://github.com/Mahdikhoubrouy/EitaaSharp

---

## Table of contents

| Page | What it covers |
|---|---|
| [Getting Started](01-Getting-Started.md) | Install, create a client, log in, send your first message |
| [Client, Sessions & Options](02-Client-Sessions-Options.md) | `EitaaClient`, `EitaaClientOptions`, sessions, **session strings**, resilience |
| [Addressing Peers (`ChatId`)](03-Addressing-Peers.md) | How to reference users/chats/channels by id, `@username`, or `"me"` |
| [Messages](04-Messages.md) | Send / edit / get / delete / forward / pin / react + bound methods |
| [Media & Files](05-Media-Files.md) | Send photo/video/audio/voice/document, download, `InputFileSource`, progress |
| [Chats, Users & Contacts](06-Chats-Users-Contacts.md) | Get chats, members, dialogs, users, contacts, search |
| [Account & Auth](07-Account-Auth.md) | Login flow, profile, username, block, log out |
| [Updates & Events](08-Updates-Events.md) | The receive loop, `OnMessage` handlers, events |
| [Reactions & Web-View](09-Reactions-WebView.md) | Emoji reactions, bot mini-app URLs |
| [Types & Enums Reference](10-Types-Enums.md) | `Message`, `Chat`, `User`, `Dialog`, `ChatMember`, enums |
| [Raw API & Architecture](11-Raw-API-Architecture.md) | `InvokeAsync`, the schema pipeline, how the wire works |
| [Error Handling](12-Error-Handling.md) | Exceptions, flood-wait, token refresh, deserialize policy |

---

## The 30-second tour

```csharp
using EitaaSharp.Client;
using EitaaSharp.Client.Session;

// A persistent session file remembers the token + peer cache across runs.
using var client = new EitaaClient(new EitaaClientOptions
{
    Session = JsonFileSession.Open("my-account.session.json"),
});

// One-call login (Eitaa delivers the code in-app to your other logged-in device).
User me = await client.StartAsync(
    requestPhoneNumber: () => Task.FromResult(Console.ReadLine()!),
    requestCode:        () => Task.FromResult(Console.ReadLine()!));
Console.WriteLine($"Signed in as {me.FullName}");

// Address chats/users/channels by id, @username, or "me" — resolution is automatic.
Message sent = await client.SendMessageAsync("@my_channel", "Hello from C#!");
await sent.ReplyAsync("a reply");
await sent.PinAsync();

// Friendly objects with auto-paging.
await foreach (Message m in client.GetChatHistoryAsync("@news", limit: 200))
    Console.WriteLine($"{m.From?.Username}: {m.Text}");
```

## Two layers (like Pyrogram)

1. **High-level** — friendly methods returning `Message` / `Chat` / `User` / `Dialog` / `ChatMember`,
   accepting a [`ChatId`](03-Addressing-Peers.md) (numeric id, `@username`, or `"me"`), with **bound
   methods** on the returned objects (`message.ReplyAsync(...)`, `chat.SendMessageAsync(...)`).
2. **Raw** — `client.InvokeAsync(new Messages.SendMessage { … })` reaches every TL method
   (~420 methods, ~1,170 constructors). See [Raw API & Architecture](11-Raw-API-Architecture.md).

## Namespaces at a glance

| Namespace | Contents |
|---|---|
| `EitaaSharp.Client` | `EitaaClient`, `EitaaClientOptions`, `ChatId`, friendly types (`Message`, `Chat`, …), `InputFileSource`, enums |
| `EitaaSharp.Client.Session` | `IEitaaSession`, `MemorySession`, `JsonFileSession`, `SessionString`, `SessionData`, `PeerType` |
| `EitaaSharp.Client.Rpc` | `RpcException`, `SessionExpiredException`, `EitaaRpc` |
| `EitaaSharp.Client.Transport` | `IEitaaTransport`, `HttpEitaaTransport`, `ConnectionKind` |
| `EitaaSharp.Schema` | the generated raw TL records (`Messages.SendMessage`, `User`, …) |
| `EitaaSharp.Tl` | the TL engine (`TlReader`, `TlWriter`, `TlRegistry`, `TlException`) |
