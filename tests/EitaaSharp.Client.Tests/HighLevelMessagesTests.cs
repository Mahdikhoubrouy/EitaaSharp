using EitaaSharp.Client;
using EitaaSharp.Client.Session;
using EitaaSharp.Client.Transport;
using EitaaSharp.Tl;
using Schema = EitaaSharp.Schema;
using Messages = EitaaSharp.Schema.Messages;

namespace EitaaSharp.Client.Tests;

public class HighLevelMessagesTests
{
    private sealed class FixedTransport(byte[] response) : IEitaaTransport
    {
        public Task<byte[]> SendAsync(ReadOnlyMemory<byte> payload, CancellationToken cancellationToken = default)
            => Task.FromResult(response);
    }

    private static byte[] Serialize(ITlObject obj)
    {
        var w = new TlWriter();
        obj.Serialize(w);
        return w.ToArray();
    }

    private static EitaaClient Client(byte[] response)
        => new(new FixedTransport(response), new MemorySession("mtpasdsxfgaabbcc__web", token: "t"));

    private static Schema.Message Msg(int id, string text) => new()
    {
        Id = id,
        PeerId = new Schema.PeerUser { UserId = 5 },
        FromId = new Schema.PeerUser { UserId = 5 },
        Date = 1_700_000_000,
        MessageValue = text,
    };

    [Fact]
    public async Task GetChatHistory_ParsesAndStopsAtLimit()
    {
        byte[] resp = Serialize(new Messages.Messages
        {
            MessagesValue = [Msg(2, "two"), Msg(1, "one")],
            Users = [new Schema.User { Id = 5, FirstName = "Ali", AccessHash = 1 }],
            Chats = [],
        });

        var client = Client(resp);
        client.Session.SetPeer(5, 1, PeerType.User);

        var collected = new List<Message>();
        await foreach (var m in client.GetChatHistoryAsync(5, limit: 2))
            collected.Add(m);

        Assert.Equal(2, collected.Count);
        Assert.Equal("two", collected[0].Text);
        Assert.Equal("Ali", collected[0].From?.FirstName);
    }

    [Fact]
    public async Task DeleteMessages_ReturnsAffectedCount()
    {
        byte[] resp = Serialize(new Messages.AffectedMessages { Pts = 10, PtsCount = 3 });

        int deleted = await Client(resp).DeleteMessagesAsync("me", [1, 2, 3]);

        Assert.Equal(3, deleted);
    }
}
