using Auth = EitaaSharp.Schema.Auth;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Cancels a pending login attempt and invalidates the confirmation code.
    /// </summary>
    /// <param name="phoneNumber">The phone number the code was sent to.</param>
    /// <param name="phoneCodeHash">The <c>phone_code_hash</c> returned by <c>SendCodeAsync</c>.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns><c>true</c> if the pending code was cancelled.</returns>
    public Task<bool> CancelCodeAsync(
        string phoneNumber, string phoneCodeHash, CancellationToken cancellationToken = default)
        => CallAsync(new Auth.CancelCode { PhoneNumber = phoneNumber, PhoneCodeHash = phoneCodeHash }, cancellationToken);
}
