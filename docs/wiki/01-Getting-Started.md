# Getting Started

[← Home](Home.md)

## 1. Requirements

- **.NET 10 SDK** (the library targets `net10.0`).
- A phone number with an **Eitaa account already logged in on another device** — the login code
  is delivered inside the Eitaa app, not by SMS.

## 2. Add the library

The library lives in `src/EitaaSharp.Client` (which pulls in `EitaaSharp.Schema` and `EitaaSharp.Tl`).
Reference it from your project:

```xml
<ItemGroup>
  <ProjectReference Include="path/to/src/EitaaSharp.Client/EitaaSharp.Client.csproj" />
</ItemGroup>
```

(When published as a NuGet package, add a normal `<PackageReference Include="EitaaSharp.Client" />`.)

## 3. Create a client

The simplest, production-friendly setup uses a **persistent file session** so the token and the
learned peer cache survive restarts:

```csharp
using EitaaSharp.Client;
using EitaaSharp.Client.Session;

using var client = new EitaaClient(new EitaaClientOptions
{
    Session = JsonFileSession.Open("my-account.session.json"),
});
```

`JsonFileSession.Open(path)` loads an existing session file or creates a fresh one (auto-generating a
device `imei` if the file is new). See [Client, Sessions & Options](02-Client-Sessions-Options.md) for
in-memory sessions and portable session strings.

> `EitaaClient` implements `IDisposable` — wrap it in `using` (it owns its HTTP transport).

## 4. Log in

`StartAsync` connects and logs in **in one call**. It only prompts when there is no stored token; on
later runs the stored token is reused and no prompts appear.

```csharp
User me = await client.StartAsync(
    requestPhoneNumber: () => Prompt("Phone (e.g. +98912…): "),
    requestCode:        () => Prompt("Code sent to your Eitaa app: "));

Console.WriteLine($"Signed in as {me.FullName} (id={me.Id})");

static Task<string> Prompt(string label)
{
    Console.Write(label);
    return Task.FromResult((Console.ReadLine() ?? "").Trim());
}
```

Under the hood `StartAsync` runs `SendCodeAsync` → `SignInAsync` → `GetMeAsync`, persisting the
`phone_code_hash` between the two steps so a code requested in one run can be confirmed in another.
See [Account & Auth](07-Account-Auth.md) for the individual steps and sign-up.

## 5. Do something

```csharp
// Send a message to Saved Messages.
Message msg = await client.SendMessageAsync("me", "Hello, EitaaSharp!");

// Reply to it (bound method).
await msg.ReplyAsync("…and a reply");

// Send a photo straight from memory.
await client.SendPhotoAsync("me", InputFileSource.FromBytes(pngBytes, "pic.png"), caption: "nice");
```

## 6. Receive updates (a simple bot)

```csharp
using var cts = new CancellationTokenSource();
Console.CancelKeyPress += (_, e) => { e.Cancel = true; cts.Cancel(); };

client.OnMessage(async m =>
{
    if (m.Outgoing || string.IsNullOrWhiteSpace(m.Text)) return;
    if (m.Text.Trim() == "/ping") await m.ReplyAsync("pong 🏓");
});

await client.RunAsync(cancellationToken: cts.Token); // polls until Ctrl+C
```

The HTTP transport has no push channel, so `RunAsync` polls `updates.getDifference` (≈2s by default).
See [Updates & Events](08-Updates-Events.md).

## Next steps

- [Client, Sessions & Options](02-Client-Sessions-Options.md) — resilience knobs, session strings, storing N accounts in a DB.
- [Messages](04-Messages.md) and [Media & Files](05-Media-Files.md) — the full send/edit surface.
- [Error Handling](12-Error-Handling.md) — how flood-wait, token refresh, and RPC errors behave.
