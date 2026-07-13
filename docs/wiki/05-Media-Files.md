# Media & Files

[← Home](Home.md)

Every media-send method accepts an **[`InputFileSource`](#inputfilesource)** — a path, a `Stream`, or
raw bytes — and returns the sent [`Message`](10-Types-Enums.md#message). Uploads are chunked and
resilient (they reuse the client's token-refresh + retry policy) and can report progress.

## `InputFileSource`

A unified media input. A plain `string` path converts **implicitly**, so path-based calls keep working.

```csharp
public string FileName { get; }

public static InputFileSource FromPath(string path);
public static InputFileSource FromStream(Stream stream, string fileName, long? size = null);
public static InputFileSource FromBytes(byte[] bytes, string fileName);
public static implicit operator InputFileSource(string path); // => FromPath(path)
```

```csharp
await client.SendPhotoAsync("me", "photo.jpg");                                  // path (implicit)
await client.SendPhotoAsync("me", InputFileSource.FromBytes(png, "gen.png"));    // bytes
await client.SendDocumentAsync("me", InputFileSource.FromStream(fs, "a.pdf"));   // stream
```

## Progress reporting

Upload methods take an optional trailing `IProgress<long>? progress` reporting **bytes uploaded**:

```csharp
var progress = new Progress<long>(sent => Console.WriteLine($"{sent} bytes"));
await client.SendVideoAsync("me", "clip.mp4", progress: progress);
```

---

## Sending media

### `SendPhotoAsync`
```csharp
Task<Message> SendPhotoAsync(
    ChatId chat, InputFileSource photo, string caption = "",
    CancellationToken ct = default, IProgress<long>? progress = null)
```
Uploads an image and sends it as a photo.

### `SendVideoAsync`
```csharp
Task<Message> SendVideoAsync(
    ChatId chat, InputFileSource video, string caption = "",
    int duration = 0, int width = 0, int height = 0, string mimeType = "video/mp4",
    CancellationToken ct = default, IProgress<long>? progress = null)
```
Uploads and sends a video. `duration`/`width`/`height` populate the video attributes (0 = unspecified).

### `SendAudioAsync`
```csharp
Task<Message> SendAudioAsync(
    ChatId chat, InputFileSource audio, string caption = "",
    int duration = 0, string? title = null, string? performer = null, bool voice = false,
    string mimeType = "audio/mpeg", CancellationToken ct = default, IProgress<long>? progress = null)
```
Uploads and sends an audio track (with optional `title`/`performer`). Set `voice: true` to send it as a
voice note instead of a music track.

### `SendVoiceAsync`
```csharp
Task<Message> SendVoiceAsync(
    ChatId chat, InputFileSource voice, string caption = "", int duration = 0,
    string mimeType = "audio/ogg", CancellationToken ct = default, IProgress<long>? progress = null)
```
Sends a voice message (an audio document flagged as a voice note).

### `SendDocumentAsync`
```csharp
Task<Message> SendDocumentAsync(
    ChatId chat, InputFileSource document, string caption = "", string mimeType = "application/octet-stream",
    CancellationToken ct = default, IProgress<long>? progress = null)
```
Uploads and sends any file as a document. The filename comes from `document.FileName`.

### `SendLocationAsync`
```csharp
Task<Message> SendLocationAsync(ChatId chat, double latitude, double longitude, CancellationToken ct = default)
```
Sends a geo point.

### `SendContactAsync`
```csharp
Task<Message> SendContactAsync(
    ChatId chat, string phoneNumber, string firstName, string lastName = "", string vcard = "",
    CancellationToken ct = default)
```
Sends a contact card.

### `SendPollAsync`
```csharp
Task<Message> SendPollAsync(
    ChatId chat, string question, IEnumerable<string> options,
    bool multipleChoice = false, bool quiz = false, CancellationToken ct = default)
```
Sends a poll. `multipleChoice` allows multiple selections; `quiz` makes it a quiz-mode poll.

### `EditMessageMediaAsync`
```csharp
Task<Message> EditMessageMediaAsync(
    ChatId chat, int messageId, InputFileSource media, string? caption = null,
    bool asDocument = false, string mimeType = "application/octet-stream",
    CancellationToken ct = default, IProgress<long>? progress = null)
```
Replaces the media of an existing message with a newly uploaded photo (default) or document
(`asDocument: true`). `caption: null` leaves the caption unchanged.

---

## Downloading media

### `DownloadMediaAsync`
```csharp
Task<byte[]> DownloadMediaAsync(Message message, CancellationToken ct = default, IProgress<long>? progress = null)
```
Downloads a message's photo or document into memory. The `IProgress<long>` reports **bytes downloaded**.
Check `message.HasMedia` first. Also available as the bound method `message.DownloadAsync()`.

```csharp
if (message.HasMedia)
{
    byte[] bytes = await message.DownloadAsync();
    await File.WriteAllBytesAsync("out.bin", bytes);
}
```

Downloads stop exactly at the known file size (so a file that is an exact multiple of the 128 KB chunk
does not read one chunk past EOF). Uploads and their follow-up `sendMedia` always hit the same host,
because Eitaa stores upload parts host-locally.

---

## Low-level transfer

For advanced scenarios you can use the chunked engines directly:

- `client.Uploads` (`FileUploader`) — `upload.saveFilePart` / `saveBigFilePart`.
- `client.Downloads` (`FileDownloader`) — `upload.getFile`, with an `expectedSize` to stop at EOF.

Most code should prefer the high-level `Send*`/`DownloadMedia` methods above.
