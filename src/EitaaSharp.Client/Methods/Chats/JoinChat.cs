using Channels = EitaaSharp.Schema.Channels;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>Joins a channel or supergroup.</summary>
    /// <param name="chat">The channel — id or <c>@username</c>.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns>The joined <see cref="Chat"/>.</returns>
    public async Task<Chat> JoinChatAsync(ChatId chat, CancellationToken cancellationToken = default)
    {
        var peer = await ResolvePeerAsync(chat, cancellationToken).ConfigureAwait(false);
        await CallAsync(new Channels.JoinChannel { Channel = ToInputChannel(peer) }, cancellationToken).ConfigureAwait(false);
        return await GetChatAsync(chat, cancellationToken).ConfigureAwait(false);
    }
}
