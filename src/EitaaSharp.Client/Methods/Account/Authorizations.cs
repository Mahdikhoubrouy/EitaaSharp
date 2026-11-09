using Account = EitaaSharp.Schema.Account;
using Auth = EitaaSharp.Schema.Auth;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>Lists active sessions / devices for the signed-in account.</summary>
    public Task<Account.IAuthorizations> GetAuthorizationsAsync(CancellationToken cancellationToken = default)
        => CallAsync(new Account.GetAuthorizations(), cancellationToken);

    /// <summary>Terminates one other session by its authorization hash.</summary>
    public Task<bool> ResetAuthorizationAsync(long hash, CancellationToken cancellationToken = default)
        => CallAsync(new Account.ResetAuthorization { Hash = hash }, cancellationToken);

    /// <summary>Terminates every session except the current one.</summary>
    public Task<bool> ResetOtherAuthorizationsAsync(CancellationToken cancellationToken = default)
        => CallAsync(new Auth.ResetAuthorizations(), cancellationToken);
}
