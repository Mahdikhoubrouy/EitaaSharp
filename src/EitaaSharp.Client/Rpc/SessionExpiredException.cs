namespace EitaaSharp.Client.Rpc;

/// <summary>
/// Raised when a call fails because the session/token is no longer valid — either an
/// <c>INVALID_LOGIN</c> / <c>AUTH_KEY_INVALID</c> rpc error, or an Eitaa token-updating /
/// token-expired response. Derives from <see cref="RpcException"/>, so existing
/// <c>catch (RpcException)</c> blocks still work.
/// <para>
/// <see cref="EitaaClient"/> intercepts this: if a token-refresh handler is configured, it is
/// invoked and the failed call is retried once.
/// </para>
/// </summary>
public sealed class SessionExpiredException : RpcException
{
    public SessionExpiredException(int errorCode, string errorMessage)
        : base(errorCode, errorMessage)
    {
    }
}
