namespace EitaaSharp.Client;

/// <summary>Ready-made predicates for <c>client.OnMessage(filter, handler)</c>.</summary>
public static class Filters
{
    /// <summary>Messages that carry non-empty text.</summary>
    public static Func<Message, bool> Text => m => !string.IsNullOrEmpty(m.Text);

    /// <summary>Messages sent by the logged-in account.</summary>
    public static Func<Message, bool> Outgoing => m => m.Outgoing;

    /// <summary>Messages from someone else.</summary>
    public static Func<Message, bool> Incoming => m => !m.Outgoing;

    /// <summary>Messages with a downloadable photo/document.</summary>
    public static Func<Message, bool> Media => m => m.HasMedia;

    /// <summary>Messages in a private (one-to-one) chat.</summary>
    public static Func<Message, bool> Private => m => m.Chat.Type is ChatType.Private or ChatType.Bot;

    /// <summary>Messages whose text is the given bot command, e.g. <c>Filters.Command("start")</c> matches "/start".</summary>
    public static Func<Message, bool> Command(string name)
    {
        var token = "/" + name.TrimStart('/');
        return m => m.Text is { Length: > 0 } t &&
                    (string.Equals(t, token, StringComparison.OrdinalIgnoreCase) ||
                     t.StartsWith(token + " ", StringComparison.OrdinalIgnoreCase) ||
                     t.StartsWith(token + "@", StringComparison.OrdinalIgnoreCase));
    }
}
