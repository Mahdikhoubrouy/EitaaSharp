using Channels = EitaaSharp.Schema.Channels;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>Leaves a channel or supergroup.</summary>
    /// <param name="chat">The channel — id or <c>@username</c>.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns><c>true</c> on success.</returns>
    public async Task<bool> LeaveChatAsync(ChatId chat, CancellationToken cancellationToken = default)
    {
        var peer = await ResolvePeerAsync(chat, cancellationToken).ConfigureAwait(false);
        await CallAsync(new Channels.LeaveChannel { Channel = ToInputChannel(peer) }, cancellationToken).ConfigureAwait(false);
        return true;
    }
}
