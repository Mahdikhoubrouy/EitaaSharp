namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>Uploads and sends an audio file as a voice message (the round play-button bubble).</summary>
    /// <param name="chat">Destination — id, <c>@username</c>, or <c>"me"</c>.</param>
    /// <param name="voice">The audio — a path, a <see cref="System.IO.Stream"/>, or bytes.</param>
    /// <param name="caption">Optional caption.</param>
    /// <param name="duration">Duration in seconds (0 if unknown).</param>
    /// <param name="mimeType">MIME type; defaults to <c>audio/ogg</c>.</param>
    /// <param name="cancellationToken">Cancels the upload and send.</param>
    /// <param name="progress">Optional upload progress callback.</param>
    /// <returns>The sent <see cref="Message"/>.</returns>
    public Task<Message> SendVoiceAsync(
        ChatId chat, InputFileSource voice, string caption = "", int duration = 0,
        string mimeType = "audio/ogg", CancellationToken cancellationToken = default, IProgress<long>? progress = null)
        => SendAudioAsync(chat, voice, caption, duration, title: null, performer: null, voice: true,
            mimeType: mimeType, cancellationToken: cancellationToken, progress: progress);
}
