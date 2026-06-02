using Schema = EitaaSharp.Schema;
using Users = EitaaSharp.Schema.Users;
using Messages = EitaaSharp.Schema.Messages;
using Channels = EitaaSharp.Schema.Channels;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>Fetches a chat, channel, or user as a friendly <see cref="Chat"/>.</summary>
    /// <param name="chat">The target — id, <c>@username</c>, or <c>"me"</c>.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    public async Task<Chat> GetChatAsync(ChatId chat, CancellationToken cancellationToken = default)
    {
        var peer = await ResolvePeerAsync(chat, cancellationToken).ConfigureAwait(false);
        switch (peer)
        {
            case Schema.InputPeerChannel ipc:
            {
                var full = await CallAsync(new Channels.GetFullChannel
                {
                    Channel = new Schema.InputChannel { ChannelId = ipc.ChannelId, AccessHash = ipc.AccessHash },
                }, cancellationToken).ConfigureAwait(false);
                return ResultParser.ChatFromFull(this, full, ipc.ChannelId);
            }
            case Schema.InputPeerChat ipch:
            {
                var full = await CallAsync(new Messages.GetFullChat { ChatId = ipch.ChatId }, cancellationToken)
                    .ConfigureAwait(false);
                return ResultParser.ChatFromFull(this, full, ipch.ChatId);
            }
            default:
            {
                var full = await CallAsync(new Users.GetFullUser { Id = ToInputUser(peer) }, cancellationToken)
                    .ConfigureAwait(false);
                return Chat.FromUser(this, ResultParser.UserFromFull(this, full));
            }
        }
    }
}
