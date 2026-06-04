using Schema = EitaaSharp.Schema;
using Messages = EitaaSharp.Schema.Messages;
using Channels = EitaaSharp.Schema.Channels;

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

    /// <summary>Parses every new/edited message carried by an <c>Updates</c> result (used by forward).</summary>
    public static IReadOnlyList<Message> AllFromUpdates(EitaaClient client, Schema.IUpdates updates)
    {
        switch (updates)
        {
            case Schema.UpdatesContainer c:
                return CollectMessages(client, c.Updates, c.Users, c.Chats);
            case Schema.UpdatesCombined c:
                return CollectMessages(client, c.Updates, c.Users, c.Chats);
            case Schema.UpdateShort s:
            {
                var ctx = new ParseContext(client, null, null);
                return ctx.MessageFromUpdate(s.Update) is { } m ? new[] { m } : Array.Empty<Message>();
            }
            default:
                return Array.Empty<Message>();
        }
    }

    private static IReadOnlyList<Message> CollectMessages(
        EitaaClient client, IReadOnlyList<Schema.IUpdate> updates, Schema.IUser[] users, Schema.IChat[] chats)
    {
        var ctx = new ParseContext(client, users, chats);
        var list = new List<Message>();
        foreach (var u in updates)
            if (ctx.MessageFromUpdate(u) is { } m)
                list.Add(m);
        return list;
    }

    /// <summary>Parses the new messages from an <c>updates.getDifference</c> result.</summary>
    public static IReadOnlyList<Message> MessagesFromDifference(
        EitaaClient client, Schema.IMessage[] newMessages, IReadOnlyList<Schema.IUpdate> otherUpdates,
        Schema.IUser[] users, Schema.IChat[] chats)
    {
        var ctx = new ParseContext(client, users, chats);
        var list = new List<Message>();
        foreach (var m in newMessages)
            if (ctx.ParseMessage(m) is { } pm)
                list.Add(pm);
        foreach (var u in otherUpdates)
            if (ctx.MessageFromUpdate(u) is { } pm)
                list.Add(pm);
        return list;
    }

    /// <summary>Parses a <c>messages.Messages</c>/<c>MessagesSlice</c>/<c>ChannelMessages</c> result.</summary>
    public static IReadOnlyList<Message> FromMessages(EitaaClient client, Messages.IMessages result)
    {
        var (msgs, users, chats) = Unpack(result);
        var ctx = new ParseContext(client, users, chats);
        var list = new List<Message>();
        foreach (var m in msgs)
            if (ctx.ParseMessage(m) is { } pm)
                list.Add(pm);
        return list;
    }

    private static (Schema.IMessage[] messages, Schema.IUser[] users, Schema.IChat[] chats) Unpack(Messages.IMessages result)
        => result switch
        {
            Messages.Messages m => (m.MessagesValue, m.Users, m.Chats),
            Messages.MessagesSlice s => (s.Messages, s.Users, s.Chats),
            Messages.ChannelMessages c => (c.Messages, c.Users, c.Chats),
            _ => (Array.Empty<Schema.IMessage>(), Array.Empty<Schema.IUser>(), Array.Empty<Schema.IChat>()),
        };

    /// <summary>Resolves a list of peers (e.g. global-search results) to friendly <see cref="Chat"/> objects.</summary>
    public static IReadOnlyList<Chat> ChatsFromPeers(
        EitaaClient client, IEnumerable<Schema.IPeer> peers, Schema.IUser[] users, Schema.IChat[] chats)
    {
        var ctx = new ParseContext(client, users, chats);
        var list = new List<Chat>();
        foreach (var p in peers)
            list.Add(ctx.ResolveChat(p));
        return list;
    }

    // ---- chats / members / dialogs ----

    private User? UserById(long id) => _users.TryGetValue(id, out var u) ? new User(_client, u) : null;

    /// <summary>Finds the chat with <paramref name="id"/> inside a full-chat result.</summary>
    public static Chat ChatFromFull(EitaaClient client, Messages.IChatFull full, long id)
    {
        if (full is Messages.ChatFull cf)
            foreach (var ch in cf.Chats)
                if (ChatId(ch) == id)
                    return Chat.FromRaw(client, ch);
        return Chat.Minimal(client, id, ChatType.Group);
    }

    /// <summary>Maps a channel-participants result to friendly <see cref="ChatMember"/> objects.</summary>
    public static IReadOnlyList<ChatMember> MembersFrom(EitaaClient client, Channels.IChannelParticipants result)
    {
        if (result is not Channels.ChannelParticipants cp)
            return Array.Empty<ChatMember>();

        var ctx = new ParseContext(client, cp.Users, cp.Chats);
        var list = new List<ChatMember>();
        foreach (var p in cp.Participants)
        {
            var (uid, status) = ParticipantInfo(p);
            var user = ctx.UserById(uid) ?? new User(client, new Schema.User { Id = uid });
            list.Add(new ChatMember(user, status, p));
        }
        return list;
    }

    /// <summary>Maps a dialogs result to friendly <see cref="Dialog"/> objects.</summary>
    public static IReadOnlyList<Dialog> DialogsFrom(EitaaClient client, Messages.IDialogs result)
    {
        var (dialogs, users, chats) = UnpackDialogs(result);
        var ctx = new ParseContext(client, users, chats);
        var list = new List<Dialog>();
        foreach (var d in dialogs)
            if (d is Schema.Dialog dd)
                list.Add(new Dialog(ctx.ResolveChat(dd.Peer), dd.TopMessage, dd.UnreadCount, dd));
        return list;
    }

    /// <summary>Maps a single channel-participant result to a friendly <see cref="ChatMember"/>.</summary>
    public static ChatMember MemberFrom(EitaaClient client, Channels.IChannelParticipant result)
    {
        if (result is Channels.ChannelParticipant cp)
        {
            var ctx = new ParseContext(client, cp.Users, cp.Chats);
            var (uid, status) = ParticipantInfo(cp.Participant);
            var user = ctx.UserById(uid) ?? new User(client, new Schema.User { Id = uid });
            return new ChatMember(user, status, cp.Participant);
        }
        throw new InvalidOperationException($"Unexpected participant result: {result.GetType().Name}");
    }

    private static (long uid, ChatMemberStatus status) ParticipantInfo(Schema.IChannelParticipant p) => p switch
    {
        Schema.ChannelParticipantCreator c => (c.UserId, ChatMemberStatus.Creator),
        Schema.ChannelParticipantAdmin a => (a.UserId, ChatMemberStatus.Administrator),
        Schema.ChannelParticipantSelf s => (s.UserId, ChatMemberStatus.Member),
        Schema.ChannelParticipantBanned b => (PeerUid(b.Peer), ChatMemberStatus.Banned),
        Schema.ChannelParticipantLeft l => (PeerUid(l.Peer), ChatMemberStatus.Left),
        Schema.ChannelParticipant cp => (cp.UserId, ChatMemberStatus.Member),
        _ => (0, ChatMemberStatus.Member),
    };

    private static long PeerUid(Schema.IPeer peer) => peer is Schema.PeerUser u ? u.UserId : 0;

    private static (Schema.IDialog[] dialogs, Schema.IUser[] users, Schema.IChat[] chats) UnpackDialogs(Messages.IDialogs result)
    {
        if (result is Messages.Dialogs d)
            return (d.DialogsValue, d.Users, d.Chats);

        var t = result.GetType();
        var dialogs = (t.GetProperty("Dialogs") ?? t.GetProperty("DialogsValue"))?.GetValue(result) as Schema.IDialog[]
                      ?? Array.Empty<Schema.IDialog>();
        var users = t.GetProperty("Users")?.GetValue(result) as Schema.IUser[] ?? Array.Empty<Schema.IUser>();
        var chats = t.GetProperty("Chats")?.GetValue(result) as Schema.IChat[] ?? Array.Empty<Schema.IChat>();
        return (dialogs, users, chats);
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
