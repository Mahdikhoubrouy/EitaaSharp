using EitaaSharp.Schema;
using Contacts = EitaaSharp.Schema.Contacts;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Blocks a peer, preventing them from contacting the signed-in account.
    /// </summary>
    /// <param name="peer">The peer to block.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns><c>true</c> if the peer was blocked.</returns>
    public Task<bool> BlockAsync(IInputPeer peer, CancellationToken cancellationToken = default)
        => CallAsync(new Contacts.Block { Id = peer }, cancellationToken);
}
