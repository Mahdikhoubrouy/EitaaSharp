using EitaaSharp.Client.Session;
using EitaaSharp.Client.Transport;
using EitaaSharp.Schema;
using EitaaSharp.Tl;
using Auth = EitaaSharp.Schema.Auth;

namespace EitaaSharp.Client.Tests;

public class TokenPersistenceTests
{
    private sealed class FixedTransport(byte[] response) : IEitaaTransport
    {
        public Task<byte[]> SendAsync(ReadOnlyMemory<byte> payload, CancellationToken cancellationToken = default)
            => Task.FromResult(response);
    }

    [Fact]
    public async Task SignIn_PersistsTokenToJsonFileOnDisk()
    {
        var path = Path.Combine(Path.GetTempPath(), $"eitaa-{Guid.NewGuid():N}.session.json");
        try
        {
            var w = new TlWriter();
            new Auth.Authorization { Token = "tok-xyz", User = new EitaaSharp.Schema.User { Id = 1 } }.Serialize(w);
            var transport = new FixedTransport(w.ToArray());

            var session = JsonFileSession.Open(path, imei: "mtpasdsxfgaabbcc__web");
            session.PhoneNumber = "+989000000000";
            session.PhoneCodeHash = "hash";

            using (var client = new EitaaClient(transport, session))
            {
                await client.SignInAsync("12345");
                Assert.Equal("tok-xyz", session.Token); // in memory
            }

            // Re-open from disk in a fresh session to prove it was actually written.
            var reloaded = JsonFileSession.Open(path);
            Assert.Equal("tok-xyz", reloaded.Token);
        }
        finally
        {
            if (File.Exists(path)) File.Delete(path);
        }
    }
}
