using Schema = EitaaSharp.Schema;
using Messages = EitaaSharp.Schema.Messages;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    /// <summary>
    /// Sends a poll. Polls are only accepted in groups and channels — sending one to a private chat
    /// or Saved Messages is rejected by the server with <c>MEDIA_INVALID</c>.
    /// </summary>
    /// <param name="chat">Destination group/channel — id or <c>@username</c>.</param>
    /// <param name="question">The poll question.</param>
    /// <param name="options">The answer options (2–10).</param>
    /// <param name="multipleChoice">Allow selecting more than one option.</param>
    /// <param name="quiz">Make it a quiz (a single correct answer).</param>
    /// <param name="cancellationToken">Cancels the request.</param>
    /// <returns>The sent <see cref="Message"/>.</returns>
    public async Task<Message> SendPollAsync(
        ChatId chat, string question, IEnumerable<string> options,
        bool multipleChoice = false, bool quiz = false, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(options);
        var answers = options
            .Select((text, i) => (Schema.IPollAnswer)new Schema.PollAnswer { Text = text, Option = [(byte)i] })
            .ToArray();

        var peer = await ResolvePeerAsync(chat, cancellationToken).ConfigureAwait(false);
        var updates = await CallAsync(new Messages.SendMedia
        {
            Peer = peer,
            Media = new Schema.InputMediaPoll
            {
                Poll = new Schema.Poll
                {
                    Id = 0, // server assigns
                    Question = question,
                    Answers = answers,
                    MultipleChoice = multipleChoice,
                    Quiz = quiz,
                },
            },
            Message = string.Empty,
            RandomId = RandomId(),
        }, cancellationToken).ConfigureAwait(false);
        return ResultParser.MessageFromUpdates(this, updates, peer, string.Empty);
    }
}
