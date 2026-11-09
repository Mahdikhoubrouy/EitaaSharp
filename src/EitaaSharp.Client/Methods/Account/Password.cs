using Account = EitaaSharp.Schema.Account;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Fetches cloud-password / 2FA status. Reading needs no SRP; mutating still does
    /// (see Ads <c>ADR-2FA.md</c>).
    /// </summary>
    public Task<Account.IPassword> GetPasswordAsync(CancellationToken cancellationToken = default)
        => CallAsync(new Account.GetPassword(), cancellationToken);
}
