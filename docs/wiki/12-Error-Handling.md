# Error Handling

[← Home](Home.md)

## Exception types

All live under `EitaaSharp.Client.Rpc` (RPC) and `EitaaSharp.Tl` (deserialization).

### `RpcException`
Thrown when the server returns an error envelope.

```csharp
public int ErrorCode { get; }        // e.g. 400, 420, 401
public string ErrorMessage { get; }  // e.g. "FLOOD_WAIT_30"
public string ErrorType { get; }     // e.g. "FLOOD_WAIT"
public int? Parameter { get; }       // trailing number, e.g. 30 for FLOOD_WAIT_30
public bool IsFloodWait => ErrorType == "FLOOD_WAIT";
public bool IsInvalidConstructor => ErrorType == "INVALID_CONSTRUCTOR";
```

```csharp
try
{
    await client.SendMessageAsync("@channel", "hi");
}
catch (RpcException ex)
{
    Console.WriteLine($"RPC {ex.ErrorCode}: {ex.ErrorMessage}");
}
```

### `SessionExpiredException : RpcException`
A specialization thrown when the token/session is dead (`INVALID_LOGIN`, `AUTH_KEY_INVALID`,
`AUTH_KEY_UNREGISTERED`, `SESSION_EXPIRED`, `SESSION_REVOKED`, or an Eitaa token-updating marker). It
usually triggers the automatic token refresh before you ever see it (see below).

### `TlException` / `TlDeserializeException`
Thrown when a response can't be deserialized (an unknown/unmodeled TL constructor).
`TlDeserializeException` carries `ConstructorId`, `Offset`, and a `TypePath` breadcrumb.

---

## Built-in resilience (automatic)

`CallAsync` / `CallObjectAsync` — and therefore **every** high-level method — apply these policies:

### Token auto-refresh
On a `SessionExpiredException`, if `AutoRefreshToken` is on (default) or a `TokenRefreshHandler` is set,
the client refreshes the token via `eitaaRefreshToken`, stores it in the session, and **retries the call
once**. Supply your own handler for custom logic:

```csharp
new EitaaClientOptions
{
    TokenRefreshHandler = async (client, ct) =>
    {
        var newToken = await MyVault.GetFreshTokenAsync();
        client.Session.Token = newToken;
        await client.Session.SaveAsync(ct);
        return true; // retry the failed call
    }
};
```
Return `false` (or leave the handler null with `AutoRefreshToken = false`) to let the error propagate.

### Flood-wait auto-retry
On `FLOOD_WAIT_x` (with `AutoFloodWait` on, default), the client waits `x + 1` seconds and retries, up to
`MaxFloodWaitSeconds` (default 60) and at most 10 times. A longer wait surfaces as an `RpcException` so
you can decide.

```csharp
new EitaaClientOptions { AutoFloodWait = true, MaxFloodWaitSeconds = 120 };
```

### `eitaaNoSend` (socket-only methods)
Methods the server serves only over its native socket answer `INVALID_CONSTRUCTOR`; the client remembers
them and returns `default` thereafter instead of throwing. See
[Raw API & Architecture](11-Raw-API-Architecture.md#the-eitaanosend-mechanism).

---

## Deserialize-error policy

By default an unmodeled response **throws** a `TlException`. Turn that into a soft failure for every call:

```csharp
using var client = new EitaaClient(new EitaaClientOptions
{
    Session = JsonFileSession.Open(path),
    ThrowOnDeserializeError = false,   // return default instead of throwing
});

client.OnDeserializeError = ex =>
    Console.Error.WriteLine($"[deser] {ex.Message}"); // includes offset + type-path breadcrumb
```

Both are also settable at runtime (`client.ThrowOnDeserializeError`, `client.OnDeserializeError`).

The breadcrumb is actionable — it names exactly which nested field failed:
```
No TL type registered for constructor id 0xD20B9F3C (-770990276) at offset 92
while reading Contacts.ResolvedPeer → Channel
```
When you hit one, look the id up in `eitaa-android-source/.../TLRPC.java`, hand-derive its params from
`readParams`, and add it via a `tools/extract-tl/sync-*.js` splice (verified with `wire-audit.js`).

---

## The update loop never dies

`RunAsync` already catches deserialization failures per batch: it reports them via `OnReceiveError`,
resyncs from the server's current state, and keeps polling. So a single unmodeled update type degrades to
a logged, skipped batch — not a crashed bot. See [Updates & Events](08-Updates-Events.md).
