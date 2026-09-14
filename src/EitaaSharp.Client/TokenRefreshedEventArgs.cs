namespace EitaaSharp.Client;

/// <summary>A renewed session token, as Eitaa returned it.</summary>
/// <param name="Token">The new token (already stored in the client's session).</param>
/// <param name="ExpiresAt">When it expires, from <c>eitaa_updates_token.expire</c>; null if Eitaa sent none.</param>
/// <param name="SocketToken">The companion socket token Eitaa returns alongside it.</param>
public sealed record TokenRefreshedEventArgs(string Token, DateTimeOffset? ExpiresAt, string? SocketToken);
