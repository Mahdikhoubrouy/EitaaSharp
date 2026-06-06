using System.IO.Compression;
using System.Text;
using EitaaSharp.Client;
using EitaaSharp.Client.Rpc;
using EitaaSharp.Client.Session;

// ─────────────────────────────────────────────────────────────────────────────
// EitaaSharp command bot
//
//   1) StartAsync logs in (reusing the stored token on later runs).
//   2) RunAsync polls updates.getDifference and raises OnMessage for every new
//      message. The handler replies to a small set of slash-commands.
//
// Commands:
//   /ping          → pong 🏓
//   /date | /time  → the current date & time
//   /echo <text>   → repeats <text> back
//   /whoami        → who the sender is (name + id)
//   /photo         → generates a gradient PNG on the fly and sends it
//   /help | /start → lists the commands
//
// Eitaa has no realtime push for the HTTP transport, so updates arrive on the
// poll interval (≈2s) — fast enough for a command bot.
// ─────────────────────────────────────────────────────────────────────────────

try { Console.OutputEncoding = Encoding.UTF8; Console.InputEncoding = Encoding.UTF8; } catch { /* redirected */ }

string sessionPath = Path.Combine(
    Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "eitaa-bot", "eitaa.session.json");
Console.WriteLine($"Session file: {sessionPath}");

var session = JsonFileSession.Open(sessionPath);
using var client = new EitaaClient(new EitaaClientOptions { Session = session });

// Stop cleanly on Ctrl+C.
using var cts = new CancellationTokenSource();
Console.CancelKeyPress += (_, e) => { e.Cancel = true; cts.Cancel(); };

User me;
try
{
    me = await client.StartAsync(
        requestPhoneNumber: () => Prompt("Phone number (e.g. +98912...): "),
        requestCode:        () => Prompt("Enter the code sent to your Eitaa app: "));
}
catch (RpcException ex)
{
    Console.WriteLine($"❌ Login failed — RPC {ex.ErrorCode}: {ex.ErrorMessage}");
    return;
}

Console.WriteLine($"✅ Bot online as {me.FullName} (id={me.Id}). Send it /help. Press Ctrl+C to stop.");

// One handler, dispatched for every new message the poll loop sees.
client.OnMessage(async message =>
{
    // Never react to our own outgoing messages (the loop sees those too) or to empty text.
    if (message.Outgoing || string.IsNullOrWhiteSpace(message.Text))
        return;

    if (!TryParseCommand(message.Text, out string command, out string argument))
        return;

    try
    {
        await HandleCommandAsync(client, message, command, argument, cts.Token);
    }
    catch (RpcException ex)
    {
        Console.WriteLine($"   ⚠ reply failed — RPC {ex.ErrorCode}: {ex.ErrorMessage}");
    }
});

try
{
    await client.RunAsync(cancellationToken: cts.Token);
}
catch (OperationCanceledException) { /* Ctrl+C */ }

Console.WriteLine("\n👋 Bot stopped.");
return;

// ── command handling ─────────────────────────────────────────────────────────

static async Task HandleCommandAsync(
    EitaaClient client, Message message, string command, string argument, CancellationToken ct)
{
    string who = message.From?.FirstName ?? message.From?.Username ?? "someone";
    Console.WriteLine($"← {who}: {message.Text}");

    switch (command)
    {
        case "/ping":
            await message.ReplyAsync("pong 🏓", ct);
            break;

        case "/date":
        case "/time":
            var now = DateTimeOffset.Now;
            await message.ReplyAsync($"🕒 {now:dddd, dd MMMM yyyy — HH:mm:ss} (UTC{now:zzz})", ct);
            break;

        case "/echo":
            await message.ReplyAsync(
                argument.Length > 0 ? argument : "Usage: /echo <text>", ct);
            break;

        case "/whoami":
            var u = message.From;
            await message.ReplyAsync(
                u is null
                    ? "I can't tell who you are here."
                    : $"You are {u.FullName}" +
                      (u.Username is { Length: > 0 } un ? $" (@{un})" : "") +
                      $"\nid: {u.Id}", ct);
            break;

        case "/photo":
            // Show the "uploading photo…" indicator, then send a freshly generated image —
            // straight from memory, no temp file (InputFileSource.FromBytes).
            await client.SendChatActionAsync(message.Chat.Id, ChatAction.UploadPhoto, ct);
            await client.SendPhotoAsync(
                message.Chat.Id,
                InputFileSource.FromBytes(Png.Gradient(480, 270), "gradient.png"),
                caption: "Here's a freshly rendered gradient 🎨",
                cancellationToken: ct);
            break;

        case "/help":
        case "/start":
            await message.ReplyAsync(
                "🤖 EitaaSharp bot — commands:\n" +
                "/ping — pong\n" +
                "/date — current date & time\n" +
                "/echo <text> — repeat text\n" +
                "/whoami — your name & id\n" +
                "/photo — send a generated image\n" +
                "/help — this list", ct);
            break;

        default:
            await message.ReplyAsync($"Unknown command {command}. Try /help.", ct);
            break;
    }
}

// Parses "/cmd@bot some args" into ("/cmd", "some args"). Returns false for non-commands.
static bool TryParseCommand(string text, out string command, out string argument)
{
    command = "";
    argument = "";
    text = text.Trim();
    if (text.Length == 0 || text[0] != '/')
        return false;

    int space = text.IndexOf(' ');
    string head = space < 0 ? text : text[..space];
    argument = space < 0 ? "" : text[(space + 1)..].Trim();

    int at = head.IndexOf('@'); // allow "/ping@somebot"
    command = (at < 0 ? head : head[..at]).ToLowerInvariant();
    return command.Length > 1;
}

static Task<string> Prompt(string label)
{
    Console.Write(label);
    return Task.FromResult((Console.ReadLine() ?? "").Trim());
}

// ── a tiny dependency-free PNG encoder (RGB, no filtering) ────────────────────
static class Png
{
    /// <summary>Builds a left-to-right blue→pink gradient PNG of the given size.</summary>
    public static byte[] Gradient(int width, int height)
    {
        // Raw scanlines: each row is a filter byte (0 = none) followed by RGB triples.
        var raw = new byte[height * (1 + width * 3)];
        int p = 0;
        for (int y = 0; y < height; y++)
        {
            raw[p++] = 0; // filter: None
            for (int x = 0; x < width; x++)
            {
                raw[p++] = (byte)(40 + 215 * x / width);          // R
                raw[p++] = (byte)(60 + 120 * y / height);         // G
                raw[p++] = (byte)(255 - 200 * x / width);         // B
            }
        }

        using var output = new MemoryStream();
        output.Write(new byte[] { 137, 80, 78, 71, 13, 10, 26, 10 }); // PNG signature

        // IHDR
        var ihdr = new byte[13];
        WriteBigEndian(ihdr, 0, width);
        WriteBigEndian(ihdr, 4, height);
        ihdr[8] = 8;  // bit depth
        ihdr[9] = 2;  // color type: truecolor (RGB)
        // 10..12 = compression / filter / interlace = 0
        WriteChunk(output, "IHDR", ihdr);

        // IDAT — zlib-compressed scanlines (ZLibStream emits the zlib wrapper PNG needs)
        using (var deflated = new MemoryStream())
        {
            using (var zlib = new ZLibStream(deflated, CompressionLevel.Optimal, leaveOpen: true))
                zlib.Write(raw, 0, raw.Length);
            WriteChunk(output, "IDAT", deflated.ToArray());
        }

        WriteChunk(output, "IEND", Array.Empty<byte>());
        return output.ToArray();
    }

    private static void WriteChunk(Stream s, string type, byte[] data)
    {
        var typeBytes = Encoding.ASCII.GetBytes(type);
        var len = new byte[4];
        WriteBigEndian(len, 0, data.Length);
        s.Write(len);
        s.Write(typeBytes);
        s.Write(data);

        uint crc = Crc32(typeBytes, data);
        var crcBytes = new byte[4];
        WriteBigEndian(crcBytes, 0, (int)crc);
        s.Write(crcBytes);
    }

    private static void WriteBigEndian(byte[] buffer, int offset, int value)
    {
        buffer[offset] = (byte)(value >> 24);
        buffer[offset + 1] = (byte)(value >> 16);
        buffer[offset + 2] = (byte)(value >> 8);
        buffer[offset + 3] = (byte)value;
    }

    private static uint Crc32(byte[] a, byte[] b)
    {
        uint crc = 0xFFFFFFFF;
        foreach (var part in new[] { a, b })
            foreach (var x in part)
            {
                crc ^= x;
                for (int k = 0; k < 8; k++)
                    crc = (crc & 1) != 0 ? (crc >> 1) ^ 0xEDB88320 : crc >> 1;
            }
        return crc ^ 0xFFFFFFFF;
    }
}
