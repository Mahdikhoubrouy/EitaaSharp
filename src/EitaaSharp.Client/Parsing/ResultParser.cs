using Schema = EitaaSharp.Schema;
using Messages = EitaaSharp.Schema.Messages;

namespace EitaaSharp.Client;

/// <summary>
/// The single catalog of "raw TL result → friendly type" transformers. Every high-level method
/// resolves its inputs, calls the raw API, then runs the result through one of these — keeping
/// each method a uniform, few-line wrapper.
/// </summary>
internal static class ResultParser
{
    /// <summary>An <c>Updates</c> result from a send/edit → the single produced <see cref="Message"/>.</summary>
    public static Message MessageFromUpdates(EitaaClient client, Schema.IUpdates updates, Schema.IInputPeer sentTo, string text)
        => ParseContext.FromSendResult(client, updates, sentTo, text);

    /// <summary>An <c>Updates</c> result from a forward → all produced messages.</summary>
    public static IReadOnlyList<Message> MessagesFromUpdates(EitaaClient client, Schema.IUpdates updates)
        => ParseContext.AllFromUpdates(client, updates);

    /// <summary>A <c>messages.Messages*</c> result → its messages as friendly objects.</summary>
    public static IReadOnlyList<Message> Messages(EitaaClient client, Messages.IMessages result)
        => ParseContext.FromMessages(client, result);

    /// <summary>An <c>messages.affectedMessages</c> → the number of affected messages.</summary>
    public static int AffectedCount(Messages.IAffectedMessages affected)
        => affected is Messages.AffectedMessages a ? a.PtsCount : 0;

    /// <summary>A <c>users.userFull</c> → the friendly <see cref="User"/>.</summary>
    public static User UserFromFull(EitaaClient client, Schema.IUserFull full)
        => User.From(client, (full as Schema.UserFull)?.User)
           ?? throw new InvalidOperationException("userFull contained no user.");
}
