using Schema = EitaaSharp.Schema;

namespace EitaaSharp.Client;

/// <summary>A conversation in the chat list — the chat plus unread/top-message info.</summary>
public sealed class Dialog
{
    internal Dialog(Chat chat, int topMessageId, int unreadCount, Schema.IDialog raw)
    {
        Chat = chat;
        TopMessageId = topMessageId;
        UnreadCount = unreadCount;
        Raw = raw;
    }

    /// <summary>The chat this dialog refers to.</summary>
    public Chat Chat { get; }

    /// <summary>Id of the most recent message.</summary>
    public int TopMessageId { get; }

    /// <summary>Number of unread messages.</summary>
    public int UnreadCount { get; }

    /// <summary>The raw TL dialog.</summary>
    public Schema.IDialog Raw { get; }

    public override string ToString() => $"Dialog(chat={Chat.Id}, unread={UnreadCount})";
}
