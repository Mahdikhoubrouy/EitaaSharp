using Contacts = EitaaSharp.Schema.Contacts;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>Removes a peer from the block list.</summary>
    /// <param name="chat">The peer to unblock — id or @username.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns><c>true</c> on success.</returns>
    public async Task<bool> UnblockUserAsync(ChatId chat, CancellationToken cancellationToken = default)
    {
        var peer = await ResolvePeerAsync(chat, cancellationToken).ConfigureAwait(false);
        return await CallAsync(new Contacts.Unblock { Id = peer }, cancellationToken).ConfigureAwait(false);
    }
}
