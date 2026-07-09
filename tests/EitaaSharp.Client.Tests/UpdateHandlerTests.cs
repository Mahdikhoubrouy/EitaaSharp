using EitaaSharp.Client.Transport;
using Schema = EitaaSharp.Schema;

namespace EitaaSharp.Client.Tests;

public class UpdateHandlerTests
{
    private sealed class NoopTransport : IEitaaTransport
    {
        public Task<byte[]> SendAsync(ReadOnlyMemory<byte> payload, CancellationToken cancellationToken = default)
            => Task.FromResult(Array.Empty<byte>());
    }

    private static EitaaClient Client() => new(new NoopTransport(), "tok", "imei");

    [Fact]
    public async Task DeleteUpdates_RouteToOnDeletedMessages_WithIdsAndChannel()
    {
        var client = Client();
        var deleted = new List<DeletedMessages>();
        client.OnDeletedMessages(d => { deleted.Add(d); return Task.CompletedTask; });

        await client.DispatchAsync(
            Array.Empty<Schema.IMessage>(),
            new Schema.IUpdate[]
            {
                new Schema.UpdateDeleteMessages { Messages = [10, 11], Pts = 1, PtsCount = 2 },
                new Schema.UpdateDeleteChannelMessages { ChannelId = 555, Messages = [7], Pts = 1, PtsCount = 1 },
            },
            Array.Empty<Schema.IUser>(), Array.Empty<Schema.IChat>());

        Assert.Equal(2, deleted.Count);
        Assert.Equal(new[] { 10, 11 }, deleted[0].MessageIds);
        Assert.Null(deleted[0].ChannelId);
        Assert.Equal(new[] { 7 }, deleted[1].MessageIds);
        Assert.Equal(555, deleted[1].ChannelId);
    }

    [Fact]
    public async Task EveryUpdate_RoutesToOnRawUpdate()
    {
        var client = Client();
        var raw = new List<Schema.IUpdate>();
        client.OnRawUpdate(u => { raw.Add(u); return Task.CompletedTask; });

        var updates = new Schema.IUpdate[]
        {
            new Schema.UpdateDeleteMessages { Messages = [1], Pts = 1, PtsCount = 1 },
            new Schema.UpdateDeleteChannelMessages { ChannelId = 9, Messages = [2], Pts = 1, PtsCount = 1 },
        };
        await client.DispatchAsync(Array.Empty<Schema.IMessage>(), updates, Array.Empty<Schema.IUser>(), Array.Empty<Schema.IChat>());

        Assert.Equal(2, raw.Count);
    }
}
