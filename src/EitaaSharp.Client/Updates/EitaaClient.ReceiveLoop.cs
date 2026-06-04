using EitaaSharp.Client.Rpc;
using Schema = EitaaSharp.Schema;
using Upd = EitaaSharp.Schema.Updates;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    private readonly List<Func<Message, Task>> _messageHandlers = new();

    /// <summary>Registers a handler invoked for every new incoming/outgoing message while <see cref="RunAsync"/> runs.</summary>
    public void OnMessage(Func<Message, Task> handler) => _messageHandlers.Add(handler);

    /// <summary>Registers a message handler that only runs when <paramref name="filter"/> matches.</summary>
    public void OnMessage(Func<Message, bool> filter, Func<Message, Task> handler)
        => _messageHandlers.Add(m => filter(m) ? handler(m) : Task.CompletedTask);

    /// <summary>
    /// Polls Eitaa for new updates (via <c>updates.getDifference</c>) and dispatches new messages to the
    /// handlers registered with <see cref="OnMessage(Func{Message,Task})"/> until cancelled. The HTTP
    /// transport has no push channel, so updates are delivered by polling.
    /// </summary>
    /// <param name="pollInterval">Delay between polls when idle (default 2s).</param>
    /// <param name="cancellationToken">Stops the loop.</param>
    public async Task RunAsync(TimeSpan? pollInterval = null, CancellationToken cancellationToken = default)
    {
        var interval = pollInterval ?? TimeSpan.FromSeconds(2);

        var state = (Upd.State)await GetStateAsync(cancellationToken).ConfigureAwait(false);
        int pts = state.Pts, qts = state.Qts, date = state.Date;

        while (!cancellationToken.IsCancellationRequested)
        {
            Upd.IDifference diff;
            try
            {
                diff = await CallAsync(new Upd.GetDifference { Pts = pts, Date = date, Qts = qts }, cancellationToken)
                    .ConfigureAwait(false);
            }
            catch (OperationCanceledException) { break; }
            catch (RpcException) { await DelaySafe(interval, cancellationToken).ConfigureAwait(false); continue; }

            bool immediate = false;
            switch (diff)
            {
                case Upd.Difference d:
                    await DispatchAsync(d.NewMessages, d.OtherUpdates, d.Users, d.Chats).ConfigureAwait(false);
                    (pts, qts, date) = StateOf(d.State);
                    break;

                case Upd.DifferenceSlice ds:
                    await DispatchAsync(ds.NewMessages, ds.OtherUpdates, ds.Users, ds.Chats).ConfigureAwait(false);
                    (pts, qts, date) = StateOf(ds.IntermediateState);
                    immediate = true; // more to fetch — don't wait
                    break;

                case Upd.DifferenceEmpty de:
                    date = de.Date;
                    break;

                case Upd.DifferenceTooLong dt:
                    pts = dt.Pts; // gap too large — resync from the new pts
                    break;
            }

            if (!immediate)
                await DelaySafe(interval, cancellationToken).ConfigureAwait(false);
        }
    }

    private async Task DispatchAsync(
        Schema.IMessage[] newMessages, Schema.IUpdate[] otherUpdates, Schema.IUser[] users, Schema.IChat[] chats)
    {
        var messages = ParseContext.MessagesFromDifference(this, newMessages, otherUpdates, users, chats);
        foreach (var message in messages)
            foreach (var handler in _messageHandlers)
                await handler(message).ConfigureAwait(false);
    }

    private static (int pts, int qts, int date) StateOf(Upd.IState state)
        => state is Upd.State s ? (s.Pts, s.Qts, s.Date) : (0, 0, 0);

    private static async Task DelaySafe(TimeSpan delay, CancellationToken ct)
    {
        try { await Task.Delay(delay, ct).ConfigureAwait(false); }
        catch (OperationCanceledException) { /* loop will exit */ }
    }
}
