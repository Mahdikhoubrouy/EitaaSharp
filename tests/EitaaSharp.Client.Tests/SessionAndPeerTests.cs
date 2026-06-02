using EitaaSharp.Client;
using EitaaSharp.Client.Session;
using EitaaSharp.Schema;

namespace EitaaSharp.Client.Tests;

public class SessionAndPeerTests
{
    [Fact]
    public async Task JsonFileSession_PersistsTokenAndPeers()
    {
        var path = Path.Combine(Path.GetTempPath(), $"eitaa-{Guid.NewGuid():N}.session.json");
        try
        {
            var session = JsonFileSession.Open(path, imei: "mtpasdsxfgaabbcc__web");
            session.Token = "my-token";
            session.SetAccessHash(42, 1234567890123);
            await session.SaveAsync();

            Assert.True(File.Exists(path));

            // Re-open and confirm everything round-trips (a valid imei is preserved as-is).
            var reloaded = JsonFileSession.Open(path);
            Assert.Equal("mtpasdsxfgaabbcc__web", reloaded.Imei);
            Assert.Equal("my-token", reloaded.Token);
            Assert.True(reloaded.TryGetAccessHash(42, out var hash));
            Assert.Equal(1234567890123, hash);
        }
        finally
        {
            if (File.Exists(path)) File.Delete(path);
        }
    }

    [Fact]
    public void PeerResolver_LearnsAccessHash_FromResponseGraph()
    {
        var session = new MemorySession("imei");
        var peers = new PeerResolver(session);

        // A nested container carrying users — like a real updates/dialogs response.
        // The walker reaches users through the array property and caches their access hash.
        var response = new UpdatesContainer
        {
            Updates = [],
            Users = [new EitaaSharp.Schema.User { Id = 7, AccessHash = 555 }, new EitaaSharp.Schema.User { Id = 8, AccessHash = 888 }],
            Chats = [],
            Date = 0,
            Seq = 0,
        };

        peers.Learn(response);

        Assert.Equal(555, peers.UserPeer(7).AccessHash);
        Assert.Equal(888, peers.UserPeer(8).AccessHash);
        Assert.Equal(7, peers.User(7).UserId);
        // Unknown peer => access hash falls back to 0.
        Assert.Equal(0, peers.UserPeer(999).AccessHash);
    }
}
