using Schema = EitaaSharp.Schema;
using Messages = EitaaSharp.Schema.Messages;
using Channels = EitaaSharp.Schema.Channels;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>Changes a chat/channel title (requires the right permissions).</summary>
    /// <param name="chat">The chat to rename.</param>
    /// <param name="title">The new title.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns><c>true</c> on success.</returns>
    public async Task<bool> SetChatTitleAsync(ChatId chat, string title, CancellationToken cancellationToken = default)
    {
        var peer = await ResolvePeerAsync(chat, cancellationToken).ConfigureAwait(false);
        if (peer is Schema.InputPeerChat ipch)
            await CallAsync(new Messages.EditChatTitle { ChatId = ipch.ChatId, Title = title }, cancellationToken)
                .ConfigureAwait(false);
        else
            await CallAsync(new Channels.EditTitle { Channel = ToInputChannel(peer), Title = title }, cancellationToken)
                .ConfigureAwait(false);
        return true;
    }
}
