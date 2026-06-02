using Schema = EitaaSharp.Schema;

namespace EitaaSharp.Client;

/// <summary>A friendly view over a TL <c>message</c>, with bound convenience methods.</summary>
public sealed class Message
{
    private readonly EitaaClient _client;

    internal Message(
        EitaaClient client, int id, string text, DateTimeOffset date,
        Chat chat, User? from, bool outgoing, int? replyToMessageId,
        Schema.IMessageMedia? media, Schema.IMessage? raw)
    {
        _client = client;
        Id = id;
        Text = text;
        Date = date;
        Chat = chat;
        From = from;
        Outgoing = outgoing;
        ReplyToMessageId = replyToMessageId;
        Media = media;
        Raw = raw;
    }

    /// <summary>The message id within its chat.</summary>
    public int Id { get; }

    /// <summary>The text/caption of the message (empty for media without a caption).</summary>
    public string Text { get; }

    /// <summary>When the message was sent.</summary>
    public DateTimeOffset Date { get; }

    /// <summary>The chat the message belongs to.</summary>
    public Chat Chat { get; }

    /// <summary>The sender, when known.</summary>
    public User? From { get; }

    /// <summary>True if the message was sent by the logged-in account.</summary>
    public bool Outgoing { get; }

    /// <summary>The id of the message this one replies to, if any.</summary>
    public int? ReplyToMessageId { get; }

    /// <summary>Attached media, if any.</summary>
    public Schema.IMessageMedia? Media { get; }

    /// <summary>The raw TL <c>message</c> (null when reconstructed from a short update).</summary>
    public Schema.IMessage? Raw { get; }

    /// <summary>Replies to this message with text.</summary>
    public Task<Message> ReplyAsync(string text, CancellationToken cancellationToken = default)
        => _client.SendMessageAsync(Chat.Id, text, replyToMessageId: Id, cancellationToken: cancellationToken);

    public override string ToString() => $"Message(id={Id}, chat={Chat.Id}, \"{Text}\")";
}
