using Auth = EitaaSharp.Schema.Auth;
using EitaaSharp.Schema;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Starts the login flow using the client's configured <see cref="ApiId"/> / <see cref="ApiHash"/>
    /// (Eitaa's public app credentials by default).
    /// </summary>
    /// <param name="phoneNumber">Phone number in international format, e.g. <c>+989121234567</c>.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns>
    /// The sent-code info, including the <c>phone_code_hash</c> you must pass back to <c>SignInAsync</c>.
    /// </returns>
    public Task<Auth.ISentCode> SendCodeAsync(string phoneNumber, CancellationToken cancellationToken = default)
        => SendCodeAsync(phoneNumber, ApiId, ApiHash, cancellationToken);

    /// <summary>
    /// Starts the login flow with explicit API credentials (overriding <see cref="ApiId"/> / <see cref="ApiHash"/>).
    /// Eitaa delivers the code in-app to the user's other logged-in device. The returned
    /// <c>phone_code_hash</c> and the phone number are stored in <see cref="Session"/> so the
    /// no-argument <see cref="SignInAsync(string, System.Threading.CancellationToken)"/> can use them.
    /// </summary>
    /// <param name="phoneNumber">Phone number in international format, e.g. <c>+989121234567</c>.</param>
    /// <param name="apiId">The application's API id issued by Eitaa.</param>
    /// <param name="apiHash">The application's API hash issued by Eitaa.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns>
    /// The sent-code info, including the <c>phone_code_hash</c>, and which delivery method was used.
    /// </returns>
    public async Task<Auth.ISentCode> SendCodeAsync(
        string phoneNumber, int apiId, string apiHash, CancellationToken cancellationToken = default)
    {
        var sent = await CallAsync(new Auth.SendCode
        {
            PhoneNumber = phoneNumber,
            ApiId = apiId,
            ApiHash = apiHash,
            Settings = new CodeSettings(),
        }, cancellationToken).ConfigureAwait(false);

        // Remember what SignIn will need (same imei is already carried by the session).
        Session.PhoneNumber = phoneNumber;
        if (sent is Auth.SentCode code)
            Session.PhoneCodeHash = code.PhoneCodeHash;
        await Session.SaveAsync(cancellationToken).ConfigureAwait(false);

        return sent;
    }
}
