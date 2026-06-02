using Contacts = EitaaSharp.Schema.Contacts;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>Blocks a user (or peer), preventing them from contacting the account.</summary>
    /// <param name="chat">The peer to block — id or @username.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns><c>true</c> on success.</returns>
    public async Task<bool> BlockUserAsync(ChatId chat, CancellationToken cancellationToken = default)
    {
        var peer = await ResolvePeerAsync(chat, cancellationToken).ConfigureAwait(false);
        return await CallAsync(new Contacts.Block { Id = peer }, cancellationToken).ConfigureAwait(false);
    }
}
