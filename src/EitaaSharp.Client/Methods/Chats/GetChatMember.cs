using Channels = EitaaSharp.Schema.Channels;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>Fetches a single member of a channel/supergroup.</summary>
    /// <param name="chat">The channel.</param>
    /// <param name="user">The member — id or @username.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    public async Task<ChatMember> GetChatMemberAsync(ChatId chat, ChatId user, CancellationToken cancellationToken = default)
    {
        var channel = ToInputChannel(await ResolvePeerAsync(chat, cancellationToken).ConfigureAwait(false));
        var participant = await ResolvePeerAsync(user, cancellationToken).ConfigureAwait(false);
        var result = await CallAsync(new Channels.GetParticipant { Channel = channel, Participant = participant }, cancellationToken)
            .ConfigureAwait(false);
        return ResultParser.Member(this, result);
    }
}
