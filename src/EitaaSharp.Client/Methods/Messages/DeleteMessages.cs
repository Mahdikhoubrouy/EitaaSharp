using Messages = EitaaSharp.Schema.Messages;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Deletes messages in a private chat or basic group. For channels and supergroups, delete
    /// through the channel-specific call in the raw API instead.
    /// </summary>
    /// <param name="messageIds">Ids of the messages to delete.</param>
    /// <param name="revoke">When <c>true</c>, deletes for everyone; when <c>false</c>, only for this account.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns>The affected message range (pts bookkeeping) reported by the server.</returns>
    public Task<Messages.IAffectedMessages> DeleteMessagesAsync(
        int[] messageIds, bool revoke = true, CancellationToken cancellationToken = default)
        => CallAsync(new Messages.DeleteMessages { Id = messageIds, Revoke = revoke }, cancellationToken);
}
