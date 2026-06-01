using EitaaSharp.Schema;
using Account = EitaaSharp.Schema.Account;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Updates the signed-in user's profile. Only the non-<c>null</c> fields are changed.
    /// </summary>
    /// <param name="firstName">New first name, or <c>null</c> to leave it unchanged.</param>
    /// <param name="lastName">New last name, or <c>null</c> to leave it unchanged.</param>
    /// <param name="about">New bio/about text, or <c>null</c> to leave it unchanged.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns>The updated user.</returns>
    public Task<IUser> UpdateProfileAsync(
        string? firstName = null, string? lastName = null, string? about = null,
        CancellationToken cancellationToken = default)
        => CallAsync(new Account.UpdateProfile { FirstName = firstName, LastName = lastName, About = about }, cancellationToken);
}
