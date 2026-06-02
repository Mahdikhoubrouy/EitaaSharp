using Schema = EitaaSharp.Schema;
using Users = EitaaSharp.Schema.Users;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Fetches the profile of the currently signed-in user (the "me" account) and remembers its id.
    /// </summary>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns>The current user.</returns>
    public async Task<User> GetMeAsync(CancellationToken cancellationToken = default)
    {
        var full = await CallAsync(new Users.GetFullUser { Id = new Schema.InputUserSelf() }, cancellationToken)
            .ConfigureAwait(false);

        var me = User.From(this, UserOf(full))
            ?? throw new InvalidOperationException("users.getFullUser returned no user.");

        SelfId = me.Id;
        return me;
    }

    private static Schema.IUser? UserOf(Schema.IUserFull full)
        => full is Schema.UserFull uf ? uf.User : null;
}
