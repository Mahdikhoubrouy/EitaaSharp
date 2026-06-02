using System.Collections;
using EitaaSharp.Client.Session;
using EitaaSharp.Schema;
using EitaaSharp.Tl;

namespace EitaaSharp.Client;

/// <summary>
/// Learns peer access hashes from response graphs (any <see cref="IUser"/>/<see cref="IChat"/>
/// it can reach) and builds the <c>InputPeer</c>/<c>InputUser</c>/<c>InputChannel</c> values
/// needed to address those peers by id — the access-hash bookkeeping Pyrogram hides for you.
/// </summary>
public sealed class PeerResolver
{
    private readonly IEitaaSession _session;

    public PeerResolver(IEitaaSession session) => _session = session;

    /// <summary>Scans a response object graph and caches the access hash of every peer it finds.</summary>
    public void Learn(object? root)
    {
        var visited = new HashSet<ITlObject>(ReferenceEqualityComparer.Instance);
        Walk(root, 0, visited);
    }

    private void Walk(object? obj, int depth, HashSet<ITlObject> visited)
    {
        if (obj is null || depth > 6)
            return;

        if (obj is IUser or IChat)
            Cache(obj);

        switch (obj)
        {
            case string:
            case byte[]:
                return;

            case IEnumerable enumerable:
                foreach (var item in enumerable)
                    Walk(item, depth + 1, visited);
                return;

            case ITlObject tl:
                if (!visited.Add(tl))
                    return;
                foreach (var prop in tl.GetType().GetProperties())
                {
                    if (prop.GetIndexParameters().Length > 0)
                        continue;
                    Walk(prop.GetValue(tl), depth + 1, visited);
                }
                return;
        }
    }

    private void Cache(object entity)
    {
        var type = entity.GetType();
        if (type.GetProperty("Id")?.GetValue(entity) is long id &&
            type.GetProperty("AccessHash")?.GetValue(entity) is long accessHash)
        {
            // Only IUser and Channel expose an AccessHash; basic Chat has none.
            var peerType = entity is IUser ? PeerType.User : PeerType.Channel;
            _session.SetPeer(id, accessHash, peerType);
        }
    }

    private long HashOf(long id) => _session.TryGetAccessHash(id, out var h) ? h : 0;

    /// <summary>Builds an <c>inputPeerUser</c> for a known user id (access hash from the cache).</summary>
    public InputPeerUser UserPeer(long userId) => new() { UserId = userId, AccessHash = HashOf(userId) };

    /// <summary>Builds an <c>inputPeerChannel</c> for a known channel id.</summary>
    public InputPeerChannel ChannelPeer(long channelId) => new() { ChannelId = channelId, AccessHash = HashOf(channelId) };

    /// <summary>Builds an <c>inputPeerChat</c> (basic groups carry no access hash).</summary>
    public InputPeerChat ChatPeer(long chatId) => new() { ChatId = chatId };

    /// <summary>Builds an <c>inputUser</c> for a known user id.</summary>
    public InputUser User(long userId) => new() { UserId = userId, AccessHash = HashOf(userId) };

    /// <summary>Builds an <c>inputChannel</c> for a known channel id.</summary>
    public InputChannel Channel(long channelId) => new() { ChannelId = channelId, AccessHash = HashOf(channelId) };
}
