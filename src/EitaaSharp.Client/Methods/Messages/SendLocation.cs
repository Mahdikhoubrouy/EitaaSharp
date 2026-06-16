using Schema = EitaaSharp.Schema;
using Messages = EitaaSharp.Schema.Messages;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>Sends a geographic location (a point on the map).</summary>
    /// <param name="chat">Destination — id, <c>@username</c>, or <c>"me"</c>.</param>
    /// <param name="latitude">Latitude in degrees.</param>
    /// <param name="longitude">Longitude in degrees.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns>The sent <see cref="Message"/>.</returns>
    public async Task<Message> SendLocationAsync(
        ChatId chat, double latitude, double longitude, CancellationToken cancellationToken = default)
    {
        var peer = await ResolvePeerAsync(chat, cancellationToken).ConfigureAwait(false);
        var updates = await CallAsync(new Messages.SendMedia
        {
            Peer = peer,
            Media = new Schema.InputMediaGeoPoint
            {
                GeoPoint = new Schema.InputGeoPoint { Lat = latitude, Long = longitude },
            },
            Message = string.Empty,
            RandomId = RandomId(),
        }, cancellationToken).ConfigureAwait(false);
        return ResultParser.MessageFromUpdates(this, updates, peer, string.Empty);
    }
}
