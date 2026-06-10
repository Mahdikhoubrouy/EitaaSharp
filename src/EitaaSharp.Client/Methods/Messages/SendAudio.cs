using Schema = EitaaSharp.Schema;
using Messages = EitaaSharp.Schema.Messages;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>Uploads an audio file and sends it as a music track.</summary>
    /// <param name="chat">Destination — id, <c>@username</c>, or <c>"me"</c>.</param>
    /// <param name="audio">The audio — a path, a <see cref="System.IO.Stream"/>, or bytes
    /// (<see cref="InputFileSource.FromStream"/> / <see cref="InputFileSource.FromBytes"/>); a plain
    /// path string also works.</param>
    /// <param name="caption">Optional caption.</param>
    /// <param name="duration">Duration in seconds (0 if unknown).</param>
    /// <param name="title">Optional track title.</param>
    /// <param name="performer">Optional performer.</param>
    /// <param name="voice">Send as a voice message rather than a music track.</param>
    /// <param name="mimeType">MIME type; defaults to <c>audio/mpeg</c>.</param>
    /// <param name="cancellationToken">Cancels the upload and send.</param>
    /// <returns>The sent <see cref="Message"/>.</returns>
    public async Task<Message> SendAudioAsync(
        ChatId chat, InputFileSource audio, string caption = "",
        int duration = 0, string? title = null, string? performer = null, bool voice = false,
        string mimeType = "audio/mpeg", CancellationToken cancellationToken = default, IProgress<long>? progress = null)
    {
        var peer = await ResolvePeerAsync(chat, cancellationToken).ConfigureAwait(false);
        var file = await WithRefreshRetryAsync(ct => Uploads.UploadAsync(audio, ct, progress), cancellationToken).ConfigureAwait(false);
        var updates = await CallAsync(new Messages.SendMedia
        {
            Peer = peer,
            Media = new Schema.InputMediaUploadedDocument
            {
                File = file,
                MimeType = mimeType,
                Attributes =
                [
                    new Schema.DocumentAttributeAudio
                    {
                        Voice = voice,
                        Duration = duration,
                        Title = title,
                        Performer = performer,
                    },
                    new Schema.DocumentAttributeFilename { FileName = audio.FileName },
                ],
            },
            Message = caption,
            RandomId = RandomId(),
        }, cancellationToken).ConfigureAwait(false);
        return ResultParser.MessageFromUpdates(this, updates, peer, caption);
    }
}
