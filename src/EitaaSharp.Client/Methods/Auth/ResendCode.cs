using Auth = EitaaSharp.Schema.Auth;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Requests the confirmation code again through the next available delivery method
    /// (for example, falling back from SMS to a phone call).
    /// </summary>
    /// <param name="phoneNumber">The same phone number passed to <c>SendCodeAsync</c>.</param>
    /// <param name="phoneCodeHash">The <c>phone_code_hash</c> returned by <c>SendCodeAsync</c>.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns>Updated sent-code info, possibly with a new delivery method and code hash.</returns>
    public Task<Auth.ISentCode> ResendCodeAsync(
        string phoneNumber, string phoneCodeHash, CancellationToken cancellationToken = default)
        => CallAsync(new Auth.ResendCode { PhoneNumber = phoneNumber, PhoneCodeHash = phoneCodeHash }, cancellationToken);
}
