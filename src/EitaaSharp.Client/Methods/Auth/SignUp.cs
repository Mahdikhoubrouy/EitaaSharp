using Auth = EitaaSharp.Schema.Auth;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Registers a brand-new account after <c>SendCodeAsync</c> reports the phone number is unregistered.
    /// On success the session token is stored in <see cref="Session"/> and persisted.
    /// </summary>
    /// <param name="request">
    /// The sign-up request (phone number, <c>phone_code_hash</c>, code, first/last name, and Eitaa app info).
    /// </param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns>The authorization for the newly created account. Raises the <see cref="Authorized"/> event.</returns>
    public async Task<Auth.IAuthorization> SignUpAsync(
        Auth.SignUp request, CancellationToken cancellationToken = default)
    {
        var auth = await CallAsync(request, cancellationToken).ConfigureAwait(false);
        await OnAuthorizedAsync(auth, cancellationToken).ConfigureAwait(false);
        return auth;
    }
}
