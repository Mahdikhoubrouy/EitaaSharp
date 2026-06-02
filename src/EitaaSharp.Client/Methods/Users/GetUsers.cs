using Schema = EitaaSharp.Schema;
using Users = EitaaSharp.Schema.Users;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>Fetches the basic info of one or more users.</summary>
    /// <param name="users">The users — ids, @usernames, or <c>"me"</c>.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    public async Task<IReadOnlyList<User>> GetUsersAsync(ChatId[] users, CancellationToken cancellationToken = default)
    {
        var inputUsers = new Schema.IInputUser[users.Length];
        for (int i = 0; i < users.Length; i++)
            inputUsers[i] = ToInputUser(await ResolvePeerAsync(users[i], cancellationToken).ConfigureAwait(false));

        var result = await CallAsync(new Users.GetUsers { Id = inputUsers }, cancellationToken).ConfigureAwait(false);
        return ResultParser.Users(this, result);
    }
}
