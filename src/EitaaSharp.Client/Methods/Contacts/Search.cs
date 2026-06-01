using Contacts = EitaaSharp.Schema.Contacts;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Searches contacts plus public users and chats by name or username.
    /// </summary>
    /// <param name="query">The text to search for.</param>
    /// <param name="limit">Maximum number of results to return.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns>The matched peers (own results and global results) with referenced users and chats.</returns>
    public Task<Contacts.IFound> SearchContactsAsync(
        string query, int limit = 50, CancellationToken cancellationToken = default)
        => CallAsync(new Contacts.Search { Q = query, Limit = limit }, cancellationToken);
}
