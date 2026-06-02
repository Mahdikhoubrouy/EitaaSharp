using Account = EitaaSharp.Schema.Account;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>Updates the signed-in user's profile. Only the non-<c>null</c> fields change.</summary>
    /// <param name="firstName">New first name, or <c>null</c> to keep.</param>
    /// <param name="lastName">New last name, or <c>null</c> to keep.</param>
    /// <param name="bio">New bio/about text, or <c>null</c> to keep.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns>The updated <see cref="User"/>.</returns>
    public async Task<User> UpdateProfileAsync(
        string? firstName = null, string? lastName = null, string? bio = null, CancellationToken cancellationToken = default)
    {
        var user = await CallAsync(new Account.UpdateProfile { FirstName = firstName, LastName = lastName, About = bio }, cancellationToken)
            .ConfigureAwait(false);
        return User.From(this, user) ?? throw new InvalidOperationException("account.updateProfile returned no user.");
    }
}
