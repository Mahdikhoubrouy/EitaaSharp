using Account = EitaaSharp.Schema.Account;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>Sets the account's online/offline presence.</summary>
    /// <param name="online"><c>true</c> to appear online; <c>false</c> to appear offline.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns><c>true</c> on success.</returns>
    public Task<bool> SetOnlineAsync(bool online = true, CancellationToken cancellationToken = default)
        => CallAsync(new Account.UpdateStatus { Offline = !online }, cancellationToken);
}
