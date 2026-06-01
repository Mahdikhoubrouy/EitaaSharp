using EitaaSharp.Schema;
using Contacts = EitaaSharp.Schema.Contacts;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Removes a peer from the block list.
    /// </summary>
    /// <param name="peer">The peer to unblock.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns><c>true</c> if the peer was unblocked.</returns>
    public Task<bool> UnblockAsync(IInputPeer peer, CancellationToken cancellationToken = default)
        => CallAsync(new Contacts.Unblock { Id = peer }, cancellationToken);
}
