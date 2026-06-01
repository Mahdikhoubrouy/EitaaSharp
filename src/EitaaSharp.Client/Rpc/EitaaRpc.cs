using System.Buffers.Binary;
using EitaaSharp.Client.Session;
using EitaaSharp.Client.Transport;
using EitaaSharp.Schema;
using EitaaSharp.Tl;
using Mt = EitaaSharp.Schema.Mt;

namespace EitaaSharp.Client.Rpc;

/// <summary>
/// The Eitaa RPC layer: serializes a method, wraps it in an <see cref="EitaaObject"/>
/// envelope (token/imei/packed_data/layer), sends it, and deserializes the response.
/// A returned <c>rpc_error</c> is surfaced as an <see cref="RpcException"/>.
/// Port of <c>src/rpc/index.js</c> (the Eitaa plaintext path, with error handling added).
/// </summary>
public sealed class EitaaRpc
{
    private readonly IEitaaTransport _transport;
    private readonly IEitaaSession _session;
    private readonly int _layer;
    private readonly TlRegistry _registry;

    /// <summary>The session this RPC reads token/imei from (token is sent fresh each request).</summary>
    public IEitaaSession Session => _session;

    public EitaaRpc(
        IEitaaTransport transport,
        IEitaaSession session,
        int layer = 133,
        TlRegistry? registry = null)
    {
        _transport = transport;
        _session = session;
        _layer = layer;
        _registry = registry ?? TlRegistry.Default;

        // Make every generated constructor dispatchable for response parsing.
        GeneratedSchema.RegisterAll(_registry);
    }

    /// <summary>Convenience overload that wraps a fixed token/imei in an in-memory session.</summary>
    public EitaaRpc(IEitaaTransport transport, string token, string imei, int layer = 133, TlRegistry? registry = null)
        : this(transport, new MemorySession(imei, token), layer, registry)
    {
    }

    /// <summary>Calls a TL method and returns its strongly-typed result.</summary>
    public async Task<TResult> CallAsync<TResult>(
        ITlMethod<TResult> method,
        CancellationToken cancellationToken = default)
    {
        byte[] response = await SendAsync(method, cancellationToken).ConfigureAwait(false);
        ThrowIfError(response);

        var reader = new TlReader(response, _registry);
        return method.ReadResult(reader);
    }

    /// <summary>Calls a method and returns the raw deserialized boxed object (throws on <c>rpc_error</c>).</summary>
    public async Task<ITlObject> CallObjectAsync(
        ITlObject method,
        CancellationToken cancellationToken = default)
    {
        byte[] response = await SendAsync(method, cancellationToken).ConfigureAwait(false);
        ThrowIfError(response);

        return new TlReader(response, _registry).ReadObject();
    }

    private async Task<byte[]> SendAsync(ITlObject method, CancellationToken cancellationToken)
    {
        var inner = new TlWriter();
        method.Serialize(inner);

        var envelope = new EitaaObject
        {
            Token = _session.Token ?? string.Empty,
            Imei = _session.Imei,
            PackedData = inner.ToArray(),
            Layer = _layer,
        };

        var outer = new TlWriter();
        envelope.Serialize(outer);

        return await _transport
            .SendAsync(outer.ToArray(), cancellationToken)
            .ConfigureAwait(false);
    }

    /// <summary>
    /// Throws if the response is an error envelope. Eitaa returns its own
    /// <c>error#c4b9f9bb code:int text:string</c> (observed live), and the MTProto path
    /// can return <c>rpc_error</c>; both surface as <see cref="RpcException"/>.
    /// </summary>
    private static void ThrowIfError(byte[] response)
    {
        if (response.Length < 4)
            return;

        uint id = BinaryPrimitives.ReadUInt32LittleEndian(response);

        if (id == Error.TypeId)
        {
            var reader = new TlReader(response);
            reader.ReadConstructorId();
            var error = Error.Deserialize(reader);
            throw MakeError(error.Code, error.Text);
        }

        if (id == Mt.RpcError.TypeId)
        {
            var reader = new TlReader(response);
            reader.ReadConstructorId();
            var error = Mt.RpcError.Deserialize(reader);
            throw MakeError(error.ErrorCode, error.ErrorMessage);
        }

        // Eitaa signals an expired/updating session by returning these markers in place of a result.
        if (id == Mt.EitaaUpdatesExpireToken.TypeId)
            throw new SessionExpiredException(401, "EITAA_UPDATES_EXPIRE_TOKEN");

        if (id == Mt.EitaaTokenUpdating.TypeId)
            throw new SessionExpiredException(401, "EITAA_TOKEN_UPDATING");
    }

    /// <summary>Maps an error to <see cref="SessionExpiredException"/> when its text means the session is dead.</summary>
    private static RpcException MakeError(int code, string message)
        => IsSessionExpired(message)
            ? new SessionExpiredException(code, message)
            : new RpcException(code, message);

    private static bool IsSessionExpired(string message)
        => message.Contains("INVALID_LOGIN", StringComparison.Ordinal)
        || message.Contains("AUTH_KEY_INVALID", StringComparison.Ordinal)
        || message.Contains("AUTH_KEY_UNREGISTERED", StringComparison.Ordinal)
        || message.Contains("SESSION_EXPIRED", StringComparison.Ordinal)
        || message.Contains("SESSION_REVOKED", StringComparison.Ordinal);
}
