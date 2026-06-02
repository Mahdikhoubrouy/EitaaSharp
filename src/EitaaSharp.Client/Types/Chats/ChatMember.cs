using Schema = EitaaSharp.Schema;

namespace EitaaSharp.Client;

/// <summary>A member of a chat/channel — the user plus their role.</summary>
public sealed class ChatMember
{
    internal ChatMember(User user, ChatMemberStatus status, Schema.IChannelParticipant raw)
    {
        User = user;
        Status = status;
        Raw = raw;
    }

    /// <summary>The member's user.</summary>
    public User User { get; }

    /// <summary>The member's role.</summary>
    public ChatMemberStatus Status { get; }

    /// <summary>The raw TL participant.</summary>
    public Schema.IChannelParticipant Raw { get; }

    public override string ToString() => $"ChatMember({User.Id}, {Status})";
}
