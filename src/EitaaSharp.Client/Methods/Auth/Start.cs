namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Connects and signs in in one call (Pyrogram's <c>start()</c>). If the session already has a
    /// token, it just returns the current user. Otherwise it runs the login flow, asking for the
    /// phone number and code through the supplied callbacks (Eitaa delivers the code in-app).
    /// </summary>
    /// <param name="requestPhoneNumber">Called to obtain the phone number when a fresh login is needed.</param>
    /// <param name="requestCode">Called to obtain the confirmation code.</param>
    /// <param name="cancellationToken">Cancels the flow.</param>
    /// <returns>The signed-in <see cref="User"/>.</returns>
    public async Task<User> StartAsync(
        Func<Task<string>>? requestPhoneNumber = null,
        Func<Task<string>>? requestCode = null,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrEmpty(Session.Token))
        {
            // A code may already be pending from a previous run (stored in the session).
            if (string.IsNullOrEmpty(Session.PhoneCodeHash))
            {
                var phone = Session.PhoneNumber ?? await Ask(requestPhoneNumber, "phone number").ConfigureAwait(false);
                await SendCodeAsync(phone, cancellationToken).ConfigureAwait(false);
            }

            var code = await Ask(requestCode, "login code").ConfigureAwait(false);
            await SignInAsync(code, cancellationToken).ConfigureAwait(false);
        }

        return await GetMeAsync(cancellationToken).ConfigureAwait(false);

        static async Task<string> Ask(Func<Task<string>>? provider, string what)
            => provider is null
                ? throw new InvalidOperationException($"Not logged in and no callback was provided to obtain the {what}.")
                : (await provider().ConfigureAwait(false)).Trim();
    }
}
