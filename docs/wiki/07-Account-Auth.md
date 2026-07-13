# Account & Auth

[← Home](Home.md)

## Login flow

Eitaa delivers the login **code inside the app** on another logged-in device (not by SMS). The flow is
`sendCode` → `signIn`; the `phone_code_hash` is persisted in the session between the two steps.

### `StartAsync` (recommended)
```csharp
Task<User> StartAsync(
    Func<Task<string>>? requestPhoneNumber = null,
    Func<Task<string>>? requestCode = null,
    CancellationToken ct = default)
```
Connect + log in in one call. Prompts (via your callbacks) only when there is no stored token; a pending
code from a previous run is resumed automatically. Returns the logged-in [`User`](10-Types-Enums.md#user).
If a step is needed and its callback is `null`, it throws `InvalidOperationException`.

```csharp
User me = await client.StartAsync(
    requestPhoneNumber: () => Prompt("Phone: "),
    requestCode:        () => Prompt("Code: "));
```

### `SendCodeAsync`
```csharp
Task<Auth.ISentCode> SendCodeAsync(string phoneNumber, CancellationToken ct = default)
```
Requests a login code for a phone number and stores the returned `phone_code_hash` in the session.

### `SignInAsync`
```csharp
Task<Auth.IAuthorization> SignInAsync(string phoneCode, CancellationToken ct = default)
```
Confirms the code and signs in. On success the account token is stored in the session and the
`Authorized` event fires.

### `ResendCodeAsync`
```csharp
Task<Auth.ISentCode> ResendCodeAsync(string phoneNumber, string phoneCodeHash, CancellationToken ct = default)
```
Requests the code again (e.g. via a different delivery type).

### `CancelCodeAsync`
```csharp
Task<bool> CancelCodeAsync(string phoneNumber, string phoneCodeHash, CancellationToken ct = default)
```
Cancels a pending login-code request.

### `SignUpAsync`
```csharp
Task<Auth.IAuthorization> SignUpAsync(Auth.SignUp request, CancellationToken ct = default)
```
Registers a **new** account after `sendCode` (for numbers with no existing account). Build the raw
`Auth.SignUp` request with the phone/hash/first-name/last-name.

### `LogOutAsync`
```csharp
Task<bool> LogOutAsync(CancellationToken ct = default)
```
Logs out and invalidates the token.

---

## Profile & account

### `UpdateProfileAsync`
```csharp
Task<User> UpdateProfileAsync(string? firstName = null, string? lastName = null, string? bio = null, CancellationToken ct = default)
```
Updates your name and/or bio (pass only the fields you want to change). Returns the updated user.

### `SetUsernameAsync`
```csharp
Task<bool> SetUsernameAsync(string username, CancellationToken ct = default)
```
Sets (or clears, with an empty string) your public username.

### `CheckUsernameAsync`
```csharp
Task<bool> CheckUsernameAsync(string username, CancellationToken ct = default)
```
Checks whether a username is available.

### `SetOnlineAsync`
```csharp
Task<bool> SetOnlineAsync(bool online = true, CancellationToken ct = default)
```
Updates your online/offline status.

### `BlockUserAsync` / `UnblockUserAsync`
```csharp
Task<bool> BlockUserAsync(ChatId chat, CancellationToken ct = default)
Task<bool> UnblockUserAsync(ChatId chat, CancellationToken ct = default)
```
Blocks or unblocks a user.

### `GetWallPapersAsync`
```csharp
Task<Account.IWallPapers> GetWallPapersAsync(CancellationToken ct = default)
```
Returns the available chat wallpapers (raw TL result).

---

## Utility / diagnostics

| Method | Returns | Purpose |
|---|---|---|
| `GetStateAsync()` | `Updates.IState` | Current update state (pts/qts/date) — the seed the receive loop polls from. |
| `GetConfigAsync()` | `IConfig` | Server config. |
| `GetNearestDcAsync()` | `INearestDc` | Nearest-datacenter info. |
| `RefreshTokenAsync(appInfo)` | `Mt.IEitaaUpdatesToken` | Manually refresh the session token (usually automatic — see [Error Handling](12-Error-Handling.md)). |

```csharp
var state = await client.GetStateAsync();
Console.WriteLine($"pts={((EitaaSharp.Schema.Updates.State)state).Pts}");
```
