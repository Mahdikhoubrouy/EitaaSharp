# Updates & Events

[← Home](Home.md)

Eitaa's HTTP transport has **no push channel**, so updates are delivered by **polling**
`updates.getDifference`. `RunAsync` runs that loop and dispatches new items to the handlers you register.

## The receive loop

### `RunAsync`
```csharp
Task RunAsync(TimeSpan? pollInterval = null, CancellationToken ct = default)
```
Polls for updates (default every **2 seconds** when idle) and dispatches them until cancelled. It seeds
from `GetStateAsync` and advances the `pts`/`qts`/`date` cursor as batches arrive. Slices are fetched
back-to-back with no idle delay.

```csharp
using var cts = new CancellationTokenSource();
Console.CancelKeyPress += (_, e) => { e.Cancel = true; cts.Cancel(); };

client.OnMessage(async m => { /* … */ });
await client.RunAsync(cancellationToken: cts.Token); // returns when cancelled
```

The loop is **resilient**: if a batch references a TL constructor that isn't modelled yet, it can't be
read positionally, so the loop reports it via `OnReceiveError`, resyncs from the server's current state,
and keeps running instead of crashing.

## Handlers

Register any number; each fires for matching updates while `RunAsync` is active.

```csharp
void OnMessage(Func<Message, Task> handler)
void OnMessage(Func<Message, bool> filter, Func<Message, Task> handler)  // filtered
void OnEditedMessage(Func<Message, Task> handler)
void OnDeletedMessages(Func<DeletedMessages, Task> handler)
void OnRawUpdate(Func<Schema.IUpdate, Task> handler)   // escape hatch: every raw update
Action<Exception>? OnReceiveError { get; set; }        // batch couldn't be read
```

| Handler | Payload | Fires for |
|---|---|---|
| `OnMessage` | [`Message`](10-Types-Enums.md#message) | New incoming **and** outgoing messages (check `m.Outgoing`). |
| `OnEditedMessage` | `Message` | Edited messages. |
| `OnDeletedMessages` | `DeletedMessages(IReadOnlyList<int> MessageIds, long? ChannelId)` | Deletions (carrying the ids). |
| `OnRawUpdate` | `Schema.IUpdate` | Every raw update — use for types without a friendly wrapper (e.g. `updateEitaaNotification`). |
| `OnReceiveError` | `Exception` | A batch failed to deserialize; the loop resyncs and continues. |

```csharp
client.OnMessage(m => m.Text.StartsWith("/"), async m =>   // only commands
{
    if (m.Outgoing) return;
    switch (m.Text.Split(' ')[0])
    {
        case "/ping": await m.ReplyAsync("pong 🏓"); break;
        case "/id":   await m.ReplyAsync($"chat {m.Chat.Id}"); break;
    }
});

client.OnDeletedMessages(async d =>
    Console.WriteLine($"deleted {string.Join(",", d.MessageIds)} in {d.ChannelId}"));

client.OnReceiveError = ex => Console.Error.WriteLine($"[updates] {ex.Message}");
```

## Events (call-level)

Independent of the poll loop, these fire for updates returned inside **any** call's result:

```csharp
event EventHandler<Auth.IAuthorization> Authorized;   // after sign-in / sign-up
event EventHandler<IUpdates>            UpdatesReceived; // every Updates container
event EventHandler<IUpdate>             UpdateReceived;  // every individual update
```

## Handling Eitaa notifications

Eitaa pushes a service update, `updateEitaaNotification`, carrying an `EitaaNotificationMessage`
(title, message, optional entities/photo/buttons/banner). Reach it via `OnRawUpdate`:

```csharp
client.OnRawUpdate(update =>
{
    if (update is EitaaSharp.Schema.UpdateEitaaNotification n &&
        n.Message is EitaaSharp.Schema.EitaaNotificationMessage msg)
        Console.WriteLine($"🔔 {msg.Title}: {msg.Message}");
    return Task.CompletedTask;
});
```
