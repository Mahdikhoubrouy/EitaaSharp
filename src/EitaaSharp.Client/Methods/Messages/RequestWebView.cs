using EitaaSharp.Schema;
using Messages = EitaaSharp.Schema.Messages;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Requests the launch URL for a bot's web-view / mini-app in a chat.
    /// </summary>
    /// <param name="chat">The chat to open the web-view in — a numeric id, <c>@username</c>, or <c>"me"</c>.</param>
    /// <param name="bot">The bot that owns the web-view — a numeric id or <c>@username</c>.</param>
    /// <param name="url">An optional specific web-view URL to open; <c>null</c> opens the bot's default menu app.</param>
    /// <param name="startParam">An optional start parameter passed to the mini-app.</param>
    /// <param name="platform">The platform string reported to the app (default <c>"android"</c>).</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns>The URL to load in a web view, or <c>null</c> if the server did not return one.</returns>
    public async Task<string?> RequestWebViewAsync(
        ChatId chat, ChatId bot, string? url = null, string? startParam = null,
        string platform = "android", CancellationToken cancellationToken = default)
    {
        var peer = await ResolvePeerAsync(chat, cancellationToken).ConfigureAwait(false);
        var botPeer = await ResolvePeerAsync(bot, cancellationToken).ConfigureAwait(false);

        var result = await CallObjectAsync(new Messages.RequestWebView
        {
            Peer = peer,
            Bot = ToInputUser(botPeer),
            Url = url,
            StartParam = startParam,
            Platform = platform,
            SendAs = new InputPeerEmpty(), // Eitaa's requestWebView takes send_as unconditionally
        }, cancellationToken).ConfigureAwait(false);

        return result is WebViewResultUrl webView ? webView.Url : null;
    }
}
