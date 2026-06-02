using Schema = EitaaSharp.Schema;

namespace EitaaSharp.Client;

/// <summary>
/// Turns raw TL messages and <c>Updates</c> containers into friendly <see cref="Message"/> objects,
/// resolving <see cref="Chat"/>/<see cref="User"/> from the users/chats carried alongside.
/// </summary>
internal sealed class ParseContext
{
    private readonly EitaaClient _client;
    private readonly Dictionary<long, Schema.User> _users = new();
    private readonly Dictionary<long, Schema.IChat> _chats = new();

    public ParseContext(EitaaClient client, IEnumerable<Schema.IUser>? users, IEnumerable<Schema.IChat>? chats)
    {
        _client = client;
        if (users is not null)
            foreach (var u in users)
                if (u is Schema.User cu)
                    _users[cu.Id] = cu;
        if (chats is not null)
            foreach (var c in chats)
                if (ChatId(c) is { } id)
                    _chats[id] = c;
    }

    public Message? ParseMessage(Schema.IMessage raw)
    {
        if (raw is Schema.Message m)
        {
            var chat = ResolveChat(m.PeerId);
            var from = ResolveUser(m.FromId);
            var replyTo = (m.ReplyTo as Schema.MessageReplyHeader)?.ReplyToMsgId;
            return new Message(
                _client, m.Id, m.MessageValue, DateTimeOffset.FromUnixTimeSeconds(m.Date),
                chat, from, m.Out, replyTo, m.Media, m);
        }

        if (raw is Schema.MessageService s)
        {
            return new Message(
                _client, s.Id, string.Empty, DateTimeOffset.FromUnixTimeSeconds(s.Date),
                ResolveChat(s.PeerId), ResolveUser(s.FromId), s.Out, null, null, s);
        }

        return null; // messageEmpty
    }

    public Chat ResolveChat(Schema.IPeer peer) => peer switch
    {
        Schema.PeerUser u when _users.TryGetValue(u.UserId, out var ru) => Chat.FromUser(_client, new User(_client, ru)),
        Schema.PeerUser u => Chat.Minimal(_client, u.UserId, ChatType.Private),
        Schema.PeerChannel c when _chats.TryGetValue(c.ChannelId, out var rc) => Chat.FromRaw(_client, rc),
        Schema.PeerChannel c => Chat.Minimal(_client, c.ChannelId, ChatType.Channel),
        Schema.PeerChat g when _chats.TryGetValue(g.ChatId, out var rc) => Chat.FromRaw(_client, rc),
        Schema.PeerChat g => Chat.Minimal(_client, g.ChatId, ChatType.Group),
        _ => Chat.Minimal(_client, 0, ChatType.Private),
    };

    public User? ResolveUser(Schema.IPeer? peer)
        => peer is Schema.PeerUser u && _users.TryGetValue(u.UserId, out var ru) ? new User(_client, ru) : null;

    private static long? ChatId(Schema.IChat chat) => chat switch
    {
        Schema.Channel c => c.Id,
        Schema.Chat c => c.Id,
        _ => chat.GetType().GetProperty("Id")?.GetValue(chat) as long?,
    };

    // ---- send-result extraction ----

    /// <summary>
    /// Reconstructs the <see cref="Message"/> produced by a send/forward call from its
    /// <c>Updates</c> result. Falls back to building one from the request when the server returns
    /// only an <c>updateShortSentMessage</c> stub.
    /// </summary>
    public static Message FromSendResult(EitaaClient client, Schema.IUpdates updates, Schema.IInputPeer sentTo, string text)
    {
        switch (updates)
        {
            case Schema.UpdateShortSentMessage sent:
            {
                var chat = ChatFromInput(client, sentTo);
                return new Message(
                    client, sent.Id, text, DateTimeOffset.FromUnixTimeSeconds(sent.Date),
                    chat, null, outgoing: true, replyToMessageId: null, sent.Media, raw: null);
            }
            case Schema.UpdatesContainer c:
                return FromContainer(client, c.Updates, c.Users, c.Chats)
                       ?? Fallback(client, sentTo, text);
            case Schema.UpdatesCombined c:
                return FromContainer(client, c.Updates, c.Users, c.Chats)
                       ?? Fallback(client, sentTo, text);
            case Schema.UpdateShort s:
            {
                var ctx = new ParseContext(client, null, null);
                return ctx.MessageFromUpdate(s.Update) ?? Fallback(client, sentTo, text);
            }
            default:
                return Fallback(client, sentTo, text);
        }
    }

    private static Message? FromContainer(
        EitaaClient client, IReadOnlyList<Schema.IUpdate> updates, Schema.IUser[] users, Schema.IChat[] chats)
    {
        var ctx = new ParseContext(client, users, chats);
        foreach (var u in updates)
            if (ctx.MessageFromUpdate(u) is { } m)
                return m;
        return null;
    }

    private Message? MessageFromUpdate(Schema.IUpdate update) => update switch
    {
        Schema.UpdateNewMessage u => ParseMessage(u.Message),
        Schema.UpdateNewChannelMessage u => ParseMessage(u.Message),
        Schema.UpdateEditMessage u => ParseMessage(u.Message),
        Schema.UpdateEditChannelMessage u => ParseMessage(u.Message),
        _ => null,
    };

    private static Message Fallback(EitaaClient client, Schema.IInputPeer sentTo, string text)
        => new(client, 0, text, DateTimeOffset.UnixEpoch, ChatFromInput(client, sentTo), null, true, null, null, null);

    private static Chat ChatFromInput(EitaaClient client, Schema.IInputPeer peer) => peer switch
    {
        Schema.InputPeerUser u => Chat.Minimal(client, u.UserId, ChatType.Private),
        Schema.InputPeerChannel c => Chat.Minimal(client, c.ChannelId, ChatType.Channel),
        Schema.InputPeerChat g => Chat.Minimal(client, g.ChatId, ChatType.Group),
        Schema.InputPeerSelf => Chat.Minimal(client, client.SelfId ?? 0, ChatType.Private),
        _ => Chat.Minimal(client, 0, ChatType.Private),
    };
}
