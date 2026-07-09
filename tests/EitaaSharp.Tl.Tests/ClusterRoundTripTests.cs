using EitaaSharp.Schema;
using EitaaSharp.Tl;

namespace EitaaSharp.Tl.Tests;

/// <summary>
/// Round-trips the newly-completed cluster types (reactions, attach-menu, Eitaa notifications) through
/// serialize → deserialize to prove the Vector fields restored in Item 2 are wire-symmetric. Array
/// members mean records aren't structurally equal, so fields are asserted explicitly.
/// </summary>
public class ClusterRoundTripTests
{
    private static T RoundTrip<T>(T obj) where T : ITlObject
    {
        GeneratedSchema.RegisterAll();
        var w = new TlWriter();
        obj.Serialize(w);
        return (T)new TlReader(w.ToArray()).ReadObject();
    }

    [Fact]
    public void MessageReactions_WithReactionCounts_RoundTrips()
    {
        var original = new MessageReactions
        {
            Min = true,
            Results =
            [
                new ReactionCount { Reaction = "👍", Count = 3, Chosen = true },
                new ReactionCount { Reaction = "❤️", Count = 1 },
            ],
        };

        var back = RoundTrip<ITLObject>(original);
        var r = Assert.IsType<MessageReactions>(back);

        Assert.True(r.Min);
        Assert.Equal(2, r.Results.Length);
        var first = Assert.IsType<ReactionCount>(r.Results[0]);
        Assert.Equal("👍", first.Reaction);
        Assert.Equal(3, first.Count);
        Assert.True(first.Chosen);
        Assert.Equal("❤️", Assert.IsType<ReactionCount>(r.Results[1]).Reaction);
    }

    [Fact]
    public void MessageReactionsList_WithUserReactions_RoundTrips()
    {
        var original = new MessageReactionsList
        {
            Count = 2,
            Reactions =
            [
                new MessageUserReaction { UserId = 10, Reaction = "👍" },
                new MessageUserReaction { UserId = 20, Reaction = "❤️" },
            ],
            Users = [],
            NextOffset = "cursor",
        };

        var back = RoundTrip<ITLObject>(original);
        var r = Assert.IsType<MessageReactionsList>(back);

        Assert.Equal(2, r.Count);
        Assert.Equal("cursor", r.NextOffset);
        Assert.Equal(2, r.Reactions.Length);
        var u = Assert.IsType<MessageUserReaction>(r.Reactions[0]);
        Assert.Equal(10, u.UserId);
        Assert.Equal("👍", u.Reaction);
        Assert.Empty(r.Users);
    }

    [Fact]
    public void AttachMenuBot_WithTwoVectors_RoundTrips()
    {
        var original = new AttachMenuBot
        {
            Inactive = true,
            ShowInAttachMenu = true,
            BotId = 123456789,
            ShortName = "mybot",
            PeerTypes = [],           // Eitaa never populates this (no leaf constructors)
            Icons = [],               // empty avoids needing a nested Document
        };

        var back = RoundTrip<IAttachMenuBot>(original);
        var r = Assert.IsType<AttachMenuBot>(back);

        Assert.True(r.Inactive);
        Assert.True(r.ShowInAttachMenu);
        Assert.False(r.HasSettings);
        Assert.Equal(123456789, r.BotId);
        Assert.Equal("mybot", r.ShortName);
        Assert.Empty(r.PeerTypes);
        Assert.Empty(r.Icons);
    }

    [Fact]
    public void EitaaNotificationMessage_WithButtons_RoundTrips()
    {
        var original = new EitaaNotificationMessage
        {
            Title = "Update",
            Message = "A new version is available",
            Entity = null,
            Photo = null,
            Button =
            [
                new EitaaNotificationButton { Url = "https://eitaa.com", ButtonText = "Open" },
            ],
            Banner = null,
        };

        var back = RoundTrip<IEitaaNotificationMessage>(original);
        var r = Assert.IsType<EitaaNotificationMessage>(back);

        Assert.Equal("Update", r.Title);
        Assert.Equal("A new version is available", r.Message);
        Assert.Null(r.Entity);
        Assert.NotNull(r.Button);
        var btn = Assert.IsType<EitaaNotificationButton>(r.Button![0]);
        Assert.Equal("https://eitaa.com", btn.Url);
        Assert.Equal("Open", btn.ButtonText);
    }
}
