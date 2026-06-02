using Contacts = EitaaSharp.Schema.Contacts;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>Searches contacts plus public users/chats by name or username.</summary>
    /// <param name="query">The text to search for.</param>
    /// <param name="limit">Maximum number of results.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns>The matched peers as chats (own results first, then global results).</returns>
    public async Task<IReadOnlyList<Chat>> SearchGlobalAsync(
        string query, int limit = 50, CancellationToken cancellationToken = default)
    {
        var result = await CallAsync(new Contacts.Search { Q = query, Limit = limit }, cancellationToken).ConfigureAwait(false);
        if (result is not Contacts.Found found)
            return Array.Empty<Chat>();

        var peers = found.MyResults.Concat(found.Results);
        return ParseContext.ChatsFromPeers(this, peers, found.Users, found.Chats);
    }
}
