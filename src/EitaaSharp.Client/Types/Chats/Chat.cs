using Schema = EitaaSharp.Schema;

namespace EitaaSharp.Client;

/// <summary>
/// A friendly view over a chat/channel/user-as-chat, with bound convenience methods.
/// A private conversation with a user is also represented as a <see cref="Chat"/> (Pyrogram-style).
/// </summary>
public sealed class Chat
{
    private readonly EitaaClient _client;

    private Chat(EitaaClient client, long id, ChatType type)
    {
        _client = client;
        Id = id;
        Type = type;
    }

    /// <summary>The unique chat/channel/user id.</summary>
    public long Id { get; }

    /// <summary>The kind of chat.</summary>
    public ChatType Type { get; private init; }

    /// <summary>Title for groups/channels; full name for a private chat.</summary>
    public string? Title { get; private init; }

    /// <summary>Public @username without a leading '@', if any.</summary>
    public string? Username { get; private init; }

    /// <summary>For a private chat: the user's first/last name.</summary>
    public string? FirstName { get; private init; }
    public string? LastName { get; private init; }

    /// <summary>Member count for groups/channels, when known.</summary>
    public int? MembersCount { get; private init; }

    /// <summary>The chat/channel description ("about"), populated by <see cref="EitaaClient.GetChatAsync"/>.</summary>
    public string? About { get; internal set; }

    /// <summary>The raw TL <c>chat</c>/<c>channel</c> (null for a user-backed private chat).</summary>
    public Schema.IChat? Raw { get; private init; }

    /// <summary>Sends a text message to this chat.</summary>
    public Task<Message> SendMessageAsync(string text, CancellationToken cancellationToken = default)
        => _client.SendMessageAsync(Id, text, cancellationToken: cancellationToken);

    public override string ToString() => $"Chat(id={Id}, {Type}, {Title ?? Username ?? FirstName})";

    // ---- factories ----

    internal static Chat FromUser(EitaaClient client, User u) => new(client, u.Id, u.IsBot ? ChatType.Bot : ChatType.Private)
    {
        FirstName = u.FirstName,
        LastName = u.LastName,
        Username = u.Username,
        Title = u.FullName,
    };

    internal static Chat FromChannel(EitaaClient client, Schema.Channel c) => new(client, c.Id, c.Megagroup ? ChatType.Supergroup : ChatType.Channel)
    {
        Title = c.Title,
        Username = c.Username,
        MembersCount = c.ParticipantsCount,
        Raw = c,
    };

    internal static Chat FromBasic(EitaaClient client, Schema.Chat c) => new(client, c.Id, ChatType.Group)
    {
        Title = c.Title,
        MembersCount = c.ParticipantsCount,
        Raw = c,
    };

    internal static Chat FromRaw(EitaaClient client, Schema.IChat raw) => raw switch
    {
        Schema.Channel c => FromChannel(client, c),
        Schema.Chat c => FromBasic(client, c),
        _ => Minimal(client, RawId(raw), ChatType.Group),
    };

    internal static Chat Minimal(EitaaClient client, long id, ChatType type) => new(client, id, type);

    private static long RawId(Schema.IChat raw)
        => raw.GetType().GetProperty("Id")?.GetValue(raw) is long id ? id : 0;
}
