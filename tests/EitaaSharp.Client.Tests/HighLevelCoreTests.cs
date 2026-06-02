using EitaaSharp.Client;
using EitaaSharp.Client.Session;
using EitaaSharp.Client.Transport;
using EitaaSharp.Tl;
using Schema = EitaaSharp.Schema;

namespace EitaaSharp.Client.Tests;

public class HighLevelCoreTests
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

    // ---- ChatId ----

    [Theory]
    [InlineData(123L)]
    public void ChatId_FromLong_IsId(long id)
    {
        ChatId c = id;
        Assert.True(c.IsId);
        Assert.Equal(id, c.Id);
    }

    [Fact]
    public void ChatId_FromStrings()
    {
        ChatId user = "@channel";
        Assert.True(user.IsUsername);
        Assert.Equal("channel", user.Username);

        ChatId me = "me";
        Assert.True(me.IsSelf);

        ChatId numeric = "456";
        Assert.True(numeric.IsId);
        Assert.Equal(456, numeric.Id);
    }

    // ---- ResolvePeerAsync ----

    [Fact]
    public async Task ResolvePeer_Self_And_CachedId()
    {
        var client = Client([]);

        var self = await client.ResolvePeerAsync("me");
        Assert.IsType<Schema.InputPeerSelf>(self);

        client.Session.SetPeer(100, 999, PeerType.Channel);
        var ch = Assert.IsType<Schema.InputPeerChannel>(await client.ResolvePeerAsync(100));
        Assert.Equal(100, ch.ChannelId);
        Assert.Equal(999, ch.AccessHash);

        await Assert.ThrowsAsync<InvalidOperationException>(() => client.ResolvePeerAsync(404));
    }

    // ---- SendMessageAsync -> Message ----

    [Fact]
    public async Task SendMessage_ShortSentStub_BuildsOutgoingMessage()
    {
        byte[] resp = Serialize(new Schema.UpdateShortSentMessage
        {
            Out = true, Id = 42, Pts = 1, PtsCount = 1, Date = 1_700_000_000,
        });

        var sent = await Client(resp).SendMessageAsync("me", "hello self");

        Assert.Equal(42, sent.Id);
        Assert.Equal("hello self", sent.Text);
        Assert.True(sent.Outgoing);
    }

    [Fact]
    public async Task SendMessage_FullUpdate_ParsesMessageWithSenderAndChat()
    {
        byte[] resp = Serialize(new Schema.UpdatesContainer
        {
            Updates =
            [
                new Schema.UpdateNewMessage
                {
                    Message = new Schema.Message
                    {
                        Id = 7,
                        PeerId = new Schema.PeerUser { UserId = 5 },
                        FromId = new Schema.PeerUser { UserId = 5 },
                        Date = 1_700_000_000,
                        MessageValue = "hi",
                    },
                    Pts = 1,
                    PtsCount = 1,
                },
            ],
            Users = [new Schema.User { Id = 5, FirstName = "Ali", AccessHash = 1 }],
            Chats = [],
            Date = 0,
            Seq = 0,
        });

        // Address by a cached id so resolution doesn't hit the network.
        var client = Client(resp);
        client.Session.SetPeer(5, 1, PeerType.User);

        var sent = await client.SendMessageAsync(5, "hi");

        Assert.Equal(7, sent.Id);
        Assert.Equal("hi", sent.Text);
        Assert.Equal(5, sent.Chat.Id);
        Assert.Equal("Ali", sent.From?.FirstName);
    }
}
