namespace EitaaSharp.Client;

/// <summary>The kind of a <see cref="Chat"/>.</summary>
public enum ChatType
{
    /// <summary>A one-to-one conversation with a user.</summary>
    Private,

    /// <summary>A one-to-one conversation with a bot.</summary>
    Bot,

    /// <summary>A basic group.</summary>
    Group,

    /// <summary>A supergroup (megagroup channel).</summary>
    Supergroup,

    /// <summary>A broadcast channel.</summary>
    Channel,
}
