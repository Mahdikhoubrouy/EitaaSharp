using Account = EitaaSharp.Schema.Account;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Sets the account's online/offline presence.
    /// </summary>
    /// <param name="offline"><c>true</c> to appear offline; <c>false</c> to appear online.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns><c>true</c> if the status was updated.</returns>
    public Task<bool> UpdateStatusAsync(bool offline, CancellationToken cancellationToken = default)
        => CallAsync(new Account.UpdateStatus { Offline = offline }, cancellationToken);
}
