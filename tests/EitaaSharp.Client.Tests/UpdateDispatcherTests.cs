using EitaaSharp.Client.Updates;
using EitaaSharp.Schema;

namespace EitaaSharp.Client.Tests;

public class UpdateDispatcherTests
{
    [Fact]
    public void Dispatch_RaisesContainerAndPerUpdateEvents()
    {
        var dispatcher = new UpdateDispatcher();

        IUpdates? container = null;
        var updates = new List<IUpdate>();
        dispatcher.UpdatesReceived += (_, u) => container = u;
        dispatcher.UpdateReceived += (_, u) => updates.Add(u);

        var payload = new UpdatesContainer
        {
            Updates = [new UpdateNewMessage { Message = new MessageEmpty { Id = 1 }, Pts = 1, PtsCount = 1 }],
            Users = [],
            Chats = [],
            Date = 0,
            Seq = 0,
        };

        dispatcher.Dispatch(payload);

        Assert.Same(payload, container);
        Assert.Single(updates);
        Assert.IsType<UpdateNewMessage>(updates[0]);
    }

    [Fact]
    public void Extract_HandlesUpdateShort()
    {
        var inner = new UpdateNewMessage { Message = new MessageEmpty { Id = 7 }, Pts = 1, PtsCount = 1 };
        var extracted = UpdateDispatcher.Extract(new UpdateShort { Update = inner, Date = 0 });

        Assert.Single(extracted);
        Assert.Same(inner, extracted[0]);
    }
}
