namespace EitaaSharp.Client;

/// <summary>
/// A single emoji reaction on a message together with how many users applied it — the friendly,
/// aggregated view returned by <see cref="EitaaClient.GetMessageReactionsAsync"/>.
/// </summary>
/// <param name="Emoji">The reaction emoji (e.g. <c>"👍"</c>).</param>
/// <param name="Count">How many users reacted with this emoji.</param>
public sealed record MessageReaction(string Emoji, int Count);
