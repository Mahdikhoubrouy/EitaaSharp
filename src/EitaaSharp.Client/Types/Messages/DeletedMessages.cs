namespace EitaaSharp.Client;

/// <summary>
/// A batch of deleted messages reported by the update loop. For a channel/supergroup the
/// <see cref="ChannelId"/> is set; for private chats and basic groups it is <c>null</c>.
/// </summary>
/// <param name="MessageIds">The ids of the deleted messages.</param>
/// <param name="ChannelId">The channel id, when the deletion is in a channel/supergroup.</param>
public sealed record DeletedMessages(IReadOnlyList<int> MessageIds, long? ChannelId);
