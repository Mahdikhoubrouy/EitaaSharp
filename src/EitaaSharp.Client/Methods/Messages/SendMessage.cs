using EitaaSharp.Schema;
using Messages = EitaaSharp.Schema.Messages;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Sends a text message to a user, group, or channel.
    /// </summary>
    /// <param name="peer">Destination peer. Build it via <see cref="Peers"/> — e.g. <c>client.Peers.ChannelPeer(channelId)</c>.</param>
    /// <param name="text">Message body (UTF-8, up to 4096 characters).</param>
    /// <param name="replyToMsgId">Id of the message to reply to, or <c>null</c> for a standalone message.</param>
    /// <param name="silent">Send without triggering a notification sound on the recipients.</param>
    /// <param name="noWebpage">Disable the link preview that Eitaa would otherwise generate for URLs.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns>The server updates produced by the send, containing the newly created message.</returns>
    public Task<IUpdates> SendMessageAsync(
        IInputPeer peer, string text, int? replyToMsgId = null, bool silent = false, bool noWebpage = false,
        CancellationToken cancellationToken = default)
        => CallAsync(new Messages.SendMessage
        {
            Peer = peer,
            Message = text,
            RandomId = RandomId(),
            ReplyToMsgId = replyToMsgId,
            Silent = silent,
            NoWebpage = noWebpage,
        }, cancellationToken);
}
