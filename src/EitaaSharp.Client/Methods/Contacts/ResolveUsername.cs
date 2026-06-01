using Contacts = EitaaSharp.Schema.Contacts;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Looks up a public peer by its @username. The returned user/chat is added to the peer cache,
    /// after which you can address it with <see cref="Peers"/>.
    /// </summary>
    /// <param name="username">The username to resolve, with or without a leading <c>@</c>.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns>The resolved peer plus the referenced users and chats.</returns>
    public Task<Contacts.IResolvedPeer> ResolveUsernameAsync(string username, CancellationToken cancellationToken = default)
        => CallAsync(new Contacts.ResolveUsername { Username = username.TrimStart('@') }, cancellationToken);
}
