namespace EitaaSharp.Client;

/// <summary>
/// A flexible reference to a chat, channel, or user. Implicitly converts from a numeric id
/// or a string (<c>"@username"</c>, <c>"username"</c>, or <c>"me"</c>/<c>"self"</c>), so the
/// high-level methods can be called as <c>SendMessageAsync(123, …)</c>,
/// <c>SendMessageAsync("@channel", …)</c>, or <c>SendMessageAsync("me", …)</c>.
/// </summary>
public readonly struct ChatId : IEquatable<ChatId>
{
    private enum Kind { Id, Username, Self }

    private readonly long _id;
    private readonly string? _username;
    private readonly Kind _kind;

    private ChatId(long id)
    {
        _id = id;
        _username = null;
        _kind = Kind.Id;
    }

    private ChatId(string username, Kind kind)
    {
        _id = 0;
        _username = username;
        _kind = kind;
    }

    /// <summary>True if this refers to the logged-in account ("me"/"self").</summary>
    public bool IsSelf => _kind == Kind.Self;

    /// <summary>True if this is a numeric peer id.</summary>
    public bool IsId => _kind == Kind.Id;

    /// <summary>True if this is a @username reference.</summary>
    public bool IsUsername => _kind == Kind.Username;

    /// <summary>The numeric id (valid when <see cref="IsId"/>).</summary>
    public long Id => _id;

    /// <summary>The username without a leading '@' (valid when <see cref="IsUsername"/>).</summary>
    public string Username => _username ?? "";

    public static implicit operator ChatId(long id) => new(id);

    public static implicit operator ChatId(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new ArgumentException("ChatId string cannot be empty.", nameof(value));

        var v = value.Trim();
        if (string.Equals(v, "me", StringComparison.OrdinalIgnoreCase) ||
            string.Equals(v, "self", StringComparison.OrdinalIgnoreCase))
            return new ChatId("", Kind.Self);

        if (long.TryParse(v, out var id))
            return new ChatId(id);

        return new ChatId(v.TrimStart('@'), Kind.Username);
    }

    public bool Equals(ChatId other) => _kind == other._kind && _id == other._id && _username == other._username;
    public override bool Equals(object? obj) => obj is ChatId other && Equals(other);
    public override int GetHashCode() => HashCode.Combine(_kind, _id, _username);

    public override string ToString() => _kind switch
    {
        Kind.Self => "me",
        Kind.Username => "@" + _username,
        _ => _id.ToString(),
    };
}
