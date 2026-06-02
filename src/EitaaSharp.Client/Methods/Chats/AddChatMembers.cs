using Schema = EitaaSharp.Schema;
using Messages = EitaaSharp.Schema.Messages;
using Channels = EitaaSharp.Schema.Channels;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>Adds one or more users to a chat/channel.</summary>
    /// <param name="chat">The target chat.</param>
    /// <param name="users">Users to add — ids or @usernames.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns><c>true</c> on success.</returns>
    public async Task<bool> AddChatMembersAsync(ChatId chat, ChatId[] users, CancellationToken cancellationToken = default)
    {
        var peer = await ResolvePeerAsync(chat, cancellationToken).ConfigureAwait(false);

        var inputUsers = new Schema.IInputUser[users.Length];
        for (int i = 0; i < users.Length; i++)
            inputUsers[i] = ToInputUser(await ResolvePeerAsync(users[i], cancellationToken).ConfigureAwait(false));

        if (peer is Schema.InputPeerChat ipch)
        {
            foreach (var u in inputUsers)
                await CallAsync(new Messages.AddChatUser { ChatId = ipch.ChatId, UserId = u, FwdLimit = 50 }, cancellationToken)
                    .ConfigureAwait(false);
        }
        else
        {
            await CallAsync(new Channels.InviteToChannel { Channel = ToInputChannel(peer), Users = inputUsers }, cancellationToken)
                .ConfigureAwait(false);
        }
        return true;
    }
}
