using System.Text.RegularExpressions;

namespace EitaaSharp.Client.Rpc;

/// <summary>
/// Raised when the server returns a TL <c>rpc_error</c> instead of a result.
/// Parses the Telegram-style <c>FLOOD_WAIT_x</c> / <c>*_MIGRATE_x</c> suffix into
/// <see cref="Parameter"/> when present.
/// </summary>
public partial class RpcException : Exception
{
    public int ErrorCode { get; }

    /// <summary>The raw error string, e.g. <c>FLOOD_WAIT_42</c> or <c>PHONE_NUMBER_INVALID</c>.</summary>
    public string ErrorMessage { get; }

    /// <summary>The error type with any trailing number stripped, e.g. <c>FLOOD_WAIT</c>.</summary>
    public string ErrorType { get; }

    /// <summary>The trailing number parsed from the error string, if any (e.g. flood-wait seconds).</summary>
    public int? Parameter { get; }

    public RpcException(int errorCode, string errorMessage)
        : base($"RPC error {errorCode}: {errorMessage}")
    {
        ErrorCode = errorCode;
        ErrorMessage = errorMessage;

        var match = TrailingNumber().Match(errorMessage);
        if (match.Success)
        {
            ErrorType = errorMessage[..match.Index].TrimEnd('_');
            Parameter = int.Parse(match.Value);
        }
        else
        {
            ErrorType = errorMessage;
            Parameter = null;
        }
    }

    /// <summary>True for <c>FLOOD_WAIT_x</c> errors; <see cref="Parameter"/> holds the seconds to wait.</summary>
    public bool IsFloodWait => ErrorType == "FLOOD_WAIT";

    /// <summary>
    /// True when Eitaa answered <c>INVALID_CONSTRUCTOR</c> — i.e. the server does not implement the
    /// method that was sent (e.g. <c>messages.setTyping</c>). The official client silently ignores
    /// these, so they are safe to swallow for fire-and-forget calls.
    /// </summary>
    public bool IsInvalidConstructor => ErrorType == "INVALID_CONSTRUCTOR";

    [GeneratedRegex(@"\d+$")]
    private static partial Regex TrailingNumber();
}
