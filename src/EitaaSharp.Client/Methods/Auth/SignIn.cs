using Auth = EitaaSharp.Schema.Auth;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Completes the login flow using the phone number and <c>phone_code_hash</c> stored in
    /// <see cref="Session"/> by <see cref="SendCodeAsync(string, System.Threading.CancellationToken)"/>.
    /// </summary>
    /// <param name="phoneCode">The confirmation code the user received on their other device.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns>The authorization, including the signed-in user.</returns>
    /// <exception cref="InvalidOperationException">If <c>SendCodeAsync</c> was not called first.</exception>
    public Task<Auth.IAuthorization> SignInAsync(string phoneCode, CancellationToken cancellationToken = default)
    {
        var phone = Session.PhoneNumber
            ?? throw new InvalidOperationException("Call SendCodeAsync before SignInAsync (no phone number in session).");
        var hash = Session.PhoneCodeHash
            ?? throw new InvalidOperationException("Call SendCodeAsync before SignInAsync (no phone_code_hash in session).");

        return SignInAsync(phone, hash, phoneCode, cancellationToken);
    }

    /// <summary>
    /// Completes the login flow with an explicit phone number and <c>phone_code_hash</c>.
    /// On success the returned session token is stored in <see cref="Session"/> and persisted,
    /// so later runs stay signed in.
    /// </summary>
    /// <param name="phoneNumber">The phone number being signed in.</param>
    /// <param name="phoneCodeHash">The <c>phone_code_hash</c> returned by <c>SendCodeAsync</c>.</param>
    /// <param name="phoneCode">The confirmation code entered by the user.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns>The authorization, including the signed-in user. Raises the <see cref="Authorized"/> event.</returns>
    public async Task<Auth.IAuthorization> SignInAsync(
        string phoneNumber, string phoneCodeHash, string phoneCode, CancellationToken cancellationToken = default)
    {
        var auth = await CallAsync(new Auth.SignIn
        {
            PhoneNumber = phoneNumber,
            PhoneCodeHash = phoneCodeHash,
            PhoneCode = phoneCode,
        }, cancellationToken).ConfigureAwait(false);

        await OnAuthorizedAsync(auth, cancellationToken).ConfigureAwait(false);
        return auth;
    }
}
