namespace EitaaSharp.Client.Session;

/// <summary>The kind of a cached peer, used to build the correct <c>InputPeer</c> from a bare id.</summary>
public enum PeerType
{
    User,
    Chat,
    Channel,
}
