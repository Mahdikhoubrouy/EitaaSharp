using System.Text;
using EitaaSharp.Client;
using EitaaSharp.Client.Rpc;
using EitaaSharp.Client.Session;

// End-to-end sample:
//   1) StartAsync logs in if needed (Eitaa delivers the code in-app to your other device),
//      reusing the stored token on later runs.
//   2) Send a message, then page through a chat's recent history.
//
// API id/hash default to empty (Eitaa ignores them; the official app id is rejected).

// Eitaa error text is UTF-8 (often Persian); make the Windows console render it correctly.
try { Console.OutputEncoding = Encoding.UTF8; Console.InputEncoding = Encoding.UTF8; } catch { /* redirected */ }

// Store the session in a stable per-user location so the token survives rebuilds.
string sessionPath = Path.Combine(
    Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "eitaa-sample", "eitaa.session.json");
Console.WriteLine($"Session file: {sessionPath}");

var session = JsonFileSession.Open(sessionPath);
using var client = new EitaaClient(new EitaaClientOptions { Session = session });

try
{
    // ---- 1) Login (one call; prompts only on a fresh login) ----
    User me = await client.StartAsync(
        requestPhoneNumber: () => Prompt("Phone number (e.g. +98912...): "),
        requestCode:        () => Prompt("Enter the code sent to your Eitaa app: "));
    Console.WriteLine($"✅ Signed in as {me.FullName} (id={me.Id}).");

    // ---- 2) Send a message ----
    string target = (await Prompt("\nSend to (@username or id, blank = Saved Messages): ")) is { Length: > 0 } t ? t : "me";
    string text = await Prompt("Message text: ");

    Message sent = await client.SendMessageAsync(target, text.Length > 0 ? text : "Hello from EitaaSharp 👋");
    Console.WriteLine($"✅ Sent. id={sent.Id}, chat={sent.Chat.Id}");

    // ---- 3) Read recent history ----
    Console.WriteLine($"\nRecent messages in {target}:");
    await foreach (Message m in client.GetChatHistoryAsync(target, limit: 10))
        Console.WriteLine($"  [{m.Id}] {m.From?.Username ?? m.From?.FirstName}: {m.Text}");
}
catch (RpcException ex)
{
    Console.WriteLine($"❌ RPC error {ex.ErrorCode}: {ex.ErrorMessage}");
    if (ex.IsFloodWait)
        Console.WriteLine($"   Wait {ex.Parameter}s before retrying.");
}

static Task<string> Prompt(string label)
{
    Console.Write(label);
    return Task.FromResult((Console.ReadLine() ?? "").Trim());
}
