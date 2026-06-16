using Schema = EitaaSharp.Schema;
using Messages = EitaaSharp.Schema.Messages;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>Sends a phone contact.</summary>
    /// <param name="chat">Destination — id, <c>@username</c>, or <c>"me"</c>.</param>
    /// <param name="phoneNumber">The contact's phone number.</param>
    /// <param name="firstName">The contact's first name.</param>
    /// <param name="lastName">The contact's last name (optional).</param>
    /// <param name="vcard">An optional vCard payload.</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns>The sent <see cref="Message"/>.</returns>
    public async Task<Message> SendContactAsync(
        ChatId chat, string phoneNumber, string firstName, string lastName = "", string vcard = "",
        CancellationToken cancellationToken = default)
    {
        var peer = await ResolvePeerAsync(chat, cancellationToken).ConfigureAwait(false);
        var updates = await CallAsync(new Messages.SendMedia
        {
            Peer = peer,
            Media = new Schema.InputMediaContact
            {
                PhoneNumber = phoneNumber,
                FirstName = firstName,
                LastName = lastName,
                Vcard = vcard,
            },
            Message = string.Empty,
            RandomId = RandomId(),
        }, cancellationToken).ConfigureAwait(false);
        return ResultParser.MessageFromUpdates(this, updates, peer, string.Empty);
    }
}
