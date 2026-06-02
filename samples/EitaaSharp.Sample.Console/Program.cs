using System.Text;
using EitaaSharp.Client;
using EitaaSharp.Client.Rpc;
using EitaaSharp.Client.Session;

// End-to-end sample:
//   1) If we are not logged in yet, run the interactive login (phone -> code -> sign in).
//   2) Once logged in, send a text message to a target user.
//
// The session (token + peer cache) is saved to a JSON file, so the next run skips the login.
//
// API id/hash default to empty (Eitaa ignores them and sends the code anyway — the official
// app id is actually rejected). Override via EitaaClientOptions.ApiId / ApiHash only if needed.

// Eitaa error/text is UTF-8 (often Persian); make the Windows console render it correctly.
try { Console.OutputEncoding = Encoding.UTF8; Console.InputEncoding = Encoding.UTF8; } catch { /* redirected */ }

// Store the session in a stable per-user location so the token survives rebuilds
// (a relative path maps to bin/ and is wiped on Rebuild).
string sessionDir = Path.Combine(
    Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "eitaa-sample");
string sessionPath = Path.Combine(sessionDir, "eitaa.session.json");
Console.WriteLine($"Session file: {sessionPath}");

var session = JsonFileSession.Open(sessionPath);

using var client = new EitaaClient(new EitaaClientOptions { Session = session });

client.UpdateReceived += (_, u) => Console.WriteLine($"   · update: {u.GetType().Name}");

try
{
    // ---- 1) Login (only if needed) ----
    if (string.IsNullOrEmpty(session.Token))
    {
        Console.WriteLine("Not logged in — starting login.");
        await LoginAsync(client);
    }
    else
    {
        Console.WriteLine("Already logged in (token loaded from session).");
    }

    var me = await client.GetMeAsync();
    Console.WriteLine($"✅ Signed in as {me.FullName} (id={me.Id}).");

    // ---- 2) Send a message ----
    Console.Write("\nSend to (@username or id, blank = Saved Messages): ");
    string target = (Console.ReadLine() ?? "").Trim();
    if (target.Length == 0) target = "me";

    Console.Write("Message text: ");
    string text = Console.ReadLine() ?? "Hello from EitaaSharp 👋";

    // ChatId accepts "@username", a numeric id, or "me" — resolution is automatic.
    Message sent = await client.SendMessageAsync(target, text);
    Console.WriteLine($"✅ Message sent. id={sent.Id}, chat={sent.Chat.Id}");
}
catch (RpcException ex)
{
    Console.WriteLine($"❌ RPC error {ex.ErrorCode}: {ex.ErrorMessage}");
    if (ex.IsFloodWait)
        Console.WriteLine($"   Wait {ex.Parameter}s before retrying.");
}

// --------------------------------------------------------------------------

async Task LoginAsync(EitaaClient c)
{
    // Resume a pending login (a code was already sent in a previous run) instead of
    // re-requesting one, which would invalidate the code the user already received.
    if (!string.IsNullOrEmpty(c.Session.PhoneCodeHash) && !string.IsNullOrEmpty(c.Session.PhoneNumber))
    {
        Console.WriteLine($"A code was already sent to {c.Session.PhoneNumber}. Enter it (or leave blank to request a new one).");
        Console.Write("Code: ");
        string pending = (Console.ReadLine() ?? "").Trim();
        if (pending.Length > 0)
        {
            await c.SignInAsync(pending);
            Console.WriteLine("✅ Logged in; token saved to the session file.");
            return;
        }
    }

    Console.Write("Phone number (e.g. +98912...): ");
    string phone = (Console.ReadLine() ?? "").Trim();

    // Eitaa delivers the code in-app to your other logged-in device (not by SMS).
    // SendCodeAsync stores the phone + phone_code_hash in the session.
    await c.SendCodeAsync(phone); // uses the default API id/hash
    Console.WriteLine("📩 Code sent to your other Eitaa device.");

    Console.Write("Enter the code you received: ");
    string code = (Console.ReadLine() ?? "").Trim();

    // No need to pass phone/hash again — SignInAsync reads them from the session,
    // then stores and persists the token on success.
    await c.SignInAsync(code);
    Console.WriteLine("✅ Logged in; token saved to the session file.");
}

