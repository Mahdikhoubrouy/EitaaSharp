using Schema = EitaaSharp.Schema;

namespace EitaaSharp.Client;

/// <summary>A friendly view over a TL <c>user</c>, with bound convenience methods.</summary>
public sealed class User
{
    private readonly EitaaClient _client;

    internal User(EitaaClient client, Schema.User raw)
    {
        _client = client;
        Raw = raw;
        Id = raw.Id;
        Username = raw.Username;
        FirstName = raw.FirstName;
        LastName = raw.LastName;
        Phone = raw.Phone;
        IsBot = raw.Bot;
        IsSelf = raw.Self;
    }

    /// <summary>The unique user id.</summary>
    public long Id { get; }

    /// <summary>The @username without a leading '@', if any.</summary>
    public string? Username { get; }

    public string? FirstName { get; }
    public string? LastName { get; }

    /// <summary>The phone number, if visible.</summary>
    public string? Phone { get; }

    /// <summary>True if this user is a bot.</summary>
    public bool IsBot { get; }

    /// <summary>True if this user is the logged-in account.</summary>
    public bool IsSelf { get; }

    /// <summary>The raw TL <c>user</c>.</summary>
    public Schema.User Raw { get; }

    /// <summary>First and last name joined, or the username as a fallback.</summary>
    public string FullName
    {
        get
        {
            var name = string.Join(' ', new[] { FirstName, LastName }.Where(s => !string.IsNullOrEmpty(s)));
            return name.Length > 0 ? name : (Username ?? Id.ToString());
        }
    }

    /// <summary>Sends a text message to this user.</summary>
    public Task<Message> SendMessageAsync(string text, CancellationToken cancellationToken = default)
        => _client.SendMessageAsync(Id, text, cancellationToken: cancellationToken);

    public override string ToString() => $"User(id={Id}, {FullName})";

    /// <summary>Wraps a raw <see cref="Schema.IUser"/>; returns null for <c>userEmpty</c>.</summary>
    internal static User? From(EitaaClient client, Schema.IUser? raw)
        => raw is Schema.User u ? new User(client, u) : null;
}
