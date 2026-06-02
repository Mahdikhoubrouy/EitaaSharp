using EitaaSharp.Client.Session;
using EitaaSharp.Schema;
using Contacts = EitaaSharp.Schema.Contacts;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>The logged-in account's user id, learned from <c>GetMeAsync</c>/sign-in (used to address "me").</summary>
    internal long? SelfId { get; set; }

    /// <summary>
    /// Resolves a <see cref="ChatId"/> (numeric id, <c>@username</c>, or <c>"me"</c>) to an <see cref="IInputPeer"/>.
    /// Usernames are resolved via <c>contacts.resolveUsername</c> (and cached); numeric ids must already be in
    /// the peer cache (seen via a previous response) or addressed by username.
    /// </summary>
    public async Task<IInputPeer> ResolvePeerAsync(ChatId chat, CancellationToken cancellationToken = default)
    {
        if (chat.IsSelf)
            return new InputPeerSelf();

        if (chat.IsUsername)
        {
            var resolved = (Contacts.ResolvedPeer)await CallAsync(
                new Contacts.ResolveUsername { Username = chat.Username }, cancellationToken).ConfigureAwait(false);
            return PeerToInput(resolved.Peer);
        }

        long id = chat.Id;
        if (_session.TryGetPeer(id, out var hash, out var type))
            return type switch
            {
                PeerType.User => new InputPeerUser { UserId = id, AccessHash = hash },
                PeerType.Channel => new InputPeerChannel { ChannelId = id, AccessHash = hash },
                _ => new InputPeerChat { ChatId = id },
            };

        throw new InvalidOperationException(
            $"Peer {id} is not in the cache. Fetch it first (GetChatAsync/GetDialogsAsync/GetChatHistoryAsync) " +
            "or address it by @username.");
    }

    private IInputPeer PeerToInput(IPeer peer) => peer switch
    {
        PeerUser u => _peers.UserPeer(u.UserId),
        PeerChannel c => _peers.ChannelPeer(c.ChannelId),
        PeerChat g => _peers.ChatPeer(g.ChatId),
        _ => throw new NotSupportedException($"Unsupported peer: {peer.GetType().Name}"),
    };

    private static IInputUser ToInputUser(IInputPeer peer) => peer switch
    {
        InputPeerSelf => new InputUserSelf(),
        InputPeerUser u => new InputUser { UserId = u.UserId, AccessHash = u.AccessHash },
        _ => throw new InvalidOperationException("This chat is not a user."),
    };

    private static InputChannel ToInputChannel(IInputPeer peer) => peer is InputPeerChannel c
        ? new InputChannel { ChannelId = c.ChannelId, AccessHash = c.AccessHash }
        : throw new InvalidOperationException("This chat is not a channel/supergroup.");
}
