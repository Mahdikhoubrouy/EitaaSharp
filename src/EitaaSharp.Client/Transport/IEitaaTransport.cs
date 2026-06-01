namespace EitaaSharp.Client.Transport;

/// <summary>
/// Sends a fully-serialized Eitaa envelope to the server and returns the raw
/// response bytes. The Eitaa path is plaintext-over-HTTPS (no MTProto encryption),
/// so this is a simple request/response channel. Port of <c>src/transport</c>.
/// </summary>
public interface IEitaaTransport
{
    Task<byte[]> SendAsync(ReadOnlyMemory<byte> payload, CancellationToken cancellationToken = default);
}
