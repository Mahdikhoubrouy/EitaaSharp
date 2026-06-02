using Schema = EitaaSharp.Schema;
using Contacts = EitaaSharp.Schema.Contacts;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>Fetches the signed-in account's saved contacts.</summary>
    /// <param name="cancellationToken">Cancels the request.</param>
    public async Task<IReadOnlyList<User>> GetContactsAsync(CancellationToken cancellationToken = default)
    {
        var result = await CallAsync(new Contacts.GetContacts { Hash = 0 }, cancellationToken).ConfigureAwait(false);
        return result is Contacts.Contacts c ? ResultParser.Users(this, c.Users) : Array.Empty<User>();
    }
}
