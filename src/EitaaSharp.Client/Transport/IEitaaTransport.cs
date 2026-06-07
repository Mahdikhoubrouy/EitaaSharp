namespace EitaaSharp.Client.Transport;

/// <summary>
/// Sends a fully-serialized Eitaa envelope to the server and returns the raw
/// response bytes. The Eitaa path is plaintext-over-HTTPS (no MTProto encryption),
/// so this is a simple request/response channel. Port of <c>src/transport</c>.
/// </summary>
public interface IEitaaTransport
{
    /// <summary>Sends a request over the generic connection.</summary>
    Task<byte[]> SendAsync(ReadOnlyMemory<byte> payload, CancellationToken cancellationToken = default);

    /// <summary>
    /// Sends a request over the connection for <paramref name="kind"/> (upload/download/generic), so
    /// media traffic is routed to its dedicated hosts like the official client. Transports that don't
    /// distinguish connections fall back to <see cref="SendAsync(ReadOnlyMemory{byte}, CancellationToken)"/>.
    /// </summary>
    Task<byte[]> SendAsync(ReadOnlyMemory<byte> payload, ConnectionKind kind, CancellationToken cancellationToken = default)
        => SendAsync(payload, cancellationToken);
}
