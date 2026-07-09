using EitaaSharp.Client.Session;
using EitaaSharp.Client.Transport;
using EitaaSharp.Tl;
using Schema = EitaaSharp.Schema;
using Messages = EitaaSharp.Schema.Messages;

namespace EitaaSharp.Client.Tests;

/// <summary>
/// Unit tests for the Item 4 high-level methods: each asserts the outgoing TL request (constructor
/// + flags, decoded from the captured envelope) and/or that a canned response maps correctly.
/// </summary>
public class HighLevelGapsTests
{
    private sealed class CapturingTransport(byte[] response) : IEitaaTransport
    {
        public byte[]? LastPayload { get; private set; }
        public Task<byte[]> SendAsync(ReadOnlyMemory<byte> payload, CancellationToken cancellationToken = default)
        {
            LastPayload = payload.ToArray();
            return Task.FromResult(response);
        }
    }

    private static byte[] Serialize(ITlObject obj) { var w = new TlWriter(); obj.Serialize(w); return w.ToArray(); }

    private static EitaaClient Client(CapturingTransport t)
    {
        var c = new EitaaClient(t, new MemorySession("mtpasdsxfgaabbcc__web", token: "tok"));
        c.Session.SetPeer(5, 1, PeerType.User);
        return c;
    }

    // Unwraps the eitaaObject envelope and returns a reader positioned at the start of the inner method.
    private static TlReader OutgoingBody(CapturingTransport t)
    {
        var r = new TlReader(t.LastPayload!);
        r.ReadConstructorId();
        var env = Schema.EitaaObject.Deserialize(r);
        return new TlReader(env.PackedData);
    }

    private static Schema.Message Msg(int id, string text) => new()
    {
        Id = id,
        PeerId = new Schema.PeerUser { UserId = 5 },
        FromId = new Schema.PeerUser { UserId = 5 },
        Date = 1_700_000_000,
        MessageValue = text,
    };

    [Fact]
    public async Task Pin_SendsUpdatePinnedMessage_WithoutUnpinFlag()
    {
        var t = new CapturingTransport(Serialize(new Schema.UpdatesTooLong()));
        await Client(t).PinChatMessageAsync(5, 42);

        var body = OutgoingBody(t);
        Assert.Equal(Messages.UpdatePinnedMessage.TypeId, body.ReadConstructorId());
        int flags = body.ReadInt32();
        Assert.Equal(0, flags & 0x2); // unpin bit clear
    }

    [Fact]
    public async Task Unpin_SendsUpdatePinnedMessage_WithUnpinFlag()
    {
        var t = new CapturingTransport(Serialize(new Schema.UpdatesTooLong()));
        await Client(t).UnpinChatMessageAsync(5, 42);

        var body = OutgoingBody(t);
        Assert.Equal(Messages.UpdatePinnedMessage.TypeId, body.ReadConstructorId());
        int flags = body.ReadInt32();
        Assert.NotEqual(0, flags & 0x2); // unpin bit set
    }

    [Fact]
    public async Task GetMessage_ReturnsTheSingleMessage()
    {
        var t = new CapturingTransport(Serialize(new Messages.Messages
        {
            MessagesValue = [Msg(7, "hi")],
            Users = [new Schema.User { Id = 5, FirstName = "Ali", AccessHash = 1 }],
            Chats = [],
        }));

        var msg = await Client(t).GetMessageAsync(5, 7);

        Assert.NotNull(msg);
        Assert.Equal(7, msg!.Id);
        Assert.Equal("hi", msg.Text);
    }

    [Fact]
    public async Task GetMessage_ReturnsNull_WhenNoneFound()
    {
        var t = new CapturingTransport(Serialize(new Messages.Messages
        {
            MessagesValue = [],
            Users = [],
            Chats = [],
        }));

        Assert.Null(await Client(t).GetMessageAsync(5, 99));
    }

    [Fact]
    public async Task DeleteChatHistory_ReturnsAffectedCount()
    {
        var t = new CapturingTransport(Serialize(new Messages.AffectedHistory { Pts = 1, PtsCount = 7, Offset = 0 }));

        int affected = await Client(t).DeleteChatHistoryAsync(5, revoke: true);

        Assert.Equal(7, affected);
        var body = OutgoingBody(t);
        Assert.Equal(Messages.DeleteHistory.TypeId, body.ReadConstructorId());
    }
}
