using EitaaSharp.Client.Session;

namespace EitaaSharp.Client.Tests;

/// <summary>
/// The receive loop (RunAsync) learns peers concurrently with user calls that read them, so the
/// session's peer cache must tolerate concurrent reads/writes. These hammer it from many tasks.
/// </summary>
public class SessionConcurrencyTests
{
    [Fact]
    public async Task PeerCache_ConcurrentReadWrite_StaysConsistent()
    {
        var session = new MemorySession("imei");
        const int peers = 500;
        using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(10));

        // Writers set peers; readers concurrently look them up. Must not throw or corrupt state.
        var writers = Enumerable.Range(0, peers).Select(i => Task.Run(() =>
            session.SetPeer(i, accessHash: i * 7L, PeerType.User), cts.Token));

        var readers = Enumerable.Range(0, peers).Select(_ => Task.Run(() =>
        {
            for (int k = 0; k < peers; k++)
                session.TryGetPeer(k, out long _, out PeerType _);
        }, cts.Token));

        await Task.WhenAll(writers.Concat(readers));

        // Every write is observable with the right access hash and kind afterwards.
        for (int i = 0; i < peers; i++)
        {
            Assert.True(session.TryGetPeer(i, out var hash, out var type));
            Assert.Equal(i * 7L, hash);
            Assert.Equal(PeerType.User, type);
        }
    }

    [Fact]
    public async Task JsonFileSession_ConcurrentSaves_DoNotCorruptTheFile()
    {
        var path = Path.Combine(Path.GetTempPath(), $"eitaa-conc-{Guid.NewGuid():N}.json");
        try
        {
            var session = JsonFileSession.Open(path);
            session.Token = "tok";
            for (int i = 0; i < 200; i++)
                session.SetPeer(i, i, PeerType.Chat);

            await Task.WhenAll(Enumerable.Range(0, 16).Select(_ => session.SaveAsync()));

            // The file is still valid JSON and round-trips.
            var reopened = JsonFileSession.Open(path);
            Assert.Equal("tok", reopened.Token);
            Assert.True(reopened.TryGetPeer(42, out var hash, out _));
            Assert.Equal(42, hash);
        }
        finally
        {
            try { File.Delete(path); } catch { /* best effort */ }
        }
    }
}
