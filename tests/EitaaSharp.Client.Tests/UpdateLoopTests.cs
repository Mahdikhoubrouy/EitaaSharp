using EitaaSharp.Client;
using EitaaSharp.Client.Session;
using EitaaSharp.Client.Transport;
using EitaaSharp.Tl;
using Schema = EitaaSharp.Schema;
using Upd = EitaaSharp.Schema.Updates;

namespace EitaaSharp.Client.Tests;

public class UpdateLoopTests
{
    /// <summary>Returns a scripted byte response per call index.</summary>
    private sealed class ScriptedTransport(Func<int, byte[]> responder) : IEitaaTransport
    {
        public int Calls { get; private set; }
        public Task<byte[]> SendAsync(ReadOnlyMemory<byte> payload, CancellationToken cancellationToken = default)
            => Task.FromResult(responder(Calls++));
    }

    private static byte[] Serialize(ITlObject obj)
    {
        var w = new TlWriter();
        obj.Serialize(w);
        return w.ToArray();
    }

    [Fact]
    public async Task RunAsync_DispatchesNewMessagesToHandlers()
    {
        byte[] state = Serialize(new Upd.State { Pts = 1, Qts = 0, Date = 100, Seq = 0, UnreadCount = 0 });
        byte[] difference = Serialize(new Upd.Difference
        {
            NewMessages =
            [
                new Schema.Message
                {
                    Id = 11,
                    PeerId = new Schema.PeerUser { UserId = 5 },
                    FromId = new Schema.PeerUser { UserId = 5 },
                    Date = 100,
                    MessageValue = "ping",
                },
            ],
            NewEncryptedMessages = [],
            OtherUpdates = [],
            Users = [new Schema.User { Id = 5, Username = "ali", AccessHash = 1 }],
            Chats = [],
            State = new Upd.State { Pts = 2, Qts = 0, Date = 101, Seq = 0, UnreadCount = 0 },
        });
        byte[] empty = Serialize(new Upd.DifferenceEmpty { Date = 101, Seq = 0 });

        // call 0 = getState, call 1 = first getDifference (has the message), then empty forever.
        var transport = new ScriptedTransport(call => call switch { 0 => state, 1 => difference, _ => empty });
        using var client = new EitaaClient(transport, new MemorySession("mtpasdsxfgaabbcc__web", token: "t"));

        var received = new List<Message>();
        using var cts = new CancellationTokenSource();
        client.OnMessage(m =>
        {
            received.Add(m);
            cts.Cancel(); // stop after the first message
            return Task.CompletedTask;
        });

        await client.RunAsync(TimeSpan.FromMilliseconds(1), cts.Token);

        Assert.Single(received);
        Assert.Equal("ping", received[0].Text);
        Assert.Equal("ali", received[0].From?.Username);
    }

    [Fact]
    public void CommandFilter_MatchesSlashCommand()
    {
        var isStart = Filters.Command("start");
        var client = new EitaaClient(
            new ScriptedTransport(_ => Array.Empty<byte>()), new MemorySession("mtpasdsxfgaabbcc__web"));

        Message Make(string text) => new(client, 1, text, DateTimeOffset.UnixEpoch,
            Chat.Minimal(client, 1, ChatType.Private), null, false, null, null, null);

        Assert.True(isStart(Make("/start")));
        Assert.True(isStart(Make("/start hello")));
        Assert.False(isStart(Make("start")));
        Assert.False(isStart(Make("/stop")));
    }
}
