using Contacts = EitaaSharp.Schema.Contacts;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Fetches the signed-in account's saved contacts.
    /// </summary>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns>The contact list together with the corresponding users.</returns>
    public Task<Contacts.IContacts> GetContactsAsync(CancellationToken cancellationToken = default)
        => CallAsync(new Contacts.GetContacts { Hash = 0 }, cancellationToken);
}
