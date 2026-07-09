using EitaaSharp.Client.Rpc;
using EitaaSharp.Tl;
using Schema = EitaaSharp.Schema;
using Upd = EitaaSharp.Schema.Updates;

namespace EitaaSharp.Client;

public sealed partial class EitaaClient
{
    private readonly List<Func<Message, Task>> _messageHandlers = new();
    private readonly List<Func<Message, Task>> _editedHandlers = new();
    private readonly List<Func<DeletedMessages, Task>> _deletedHandlers = new();
    private readonly List<Func<Schema.IUpdate, Task>> _rawHandlers = new();

    /// <summary>Registers a handler invoked for every new incoming/outgoing message while <see cref="RunAsync"/> runs.</summary>
    public void OnMessage(Func<Message, Task> handler) => _messageHandlers.Add(handler);

    /// <summary>Registers a message handler that only runs when <paramref name="filter"/> matches.</summary>
    public void OnMessage(Func<Message, bool> filter, Func<Message, Task> handler)
        => _messageHandlers.Add(m => filter(m) ? handler(m) : Task.CompletedTask);

    /// <summary>Registers a handler invoked when a message is edited.</summary>
    public void OnEditedMessage(Func<Message, Task> handler) => _editedHandlers.Add(handler);

    /// <summary>Registers a handler invoked when messages are deleted (carrying their ids).</summary>
    public void OnDeletedMessages(Func<DeletedMessages, Task> handler) => _deletedHandlers.Add(handler);

    /// <summary>Registers a handler invoked for every raw <see cref="Schema.IUpdate"/> — the escape hatch for update types without a friendly wrapper.</summary>
    public void OnRawUpdate(Func<Schema.IUpdate, Task> handler) => _rawHandlers.Add(handler);

    /// <summary>
    /// Invoked when <see cref="RunAsync"/> cannot deserialize an update batch (e.g. the server sent a
    /// TL constructor not yet modelled). The loop logs via this hook, resyncs the update state, and
    /// keeps running instead of crashing. Leave null to ignore.
    /// </summary>
    public Action<Exception>? OnReceiveError { get; set; }

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
            catch (TlException ex)
            {
                // An update referenced a TL constructor we don't model yet. Deserialization is
                // positional, so the whole batch is unreadable — skip it and resync from the
                // server's current state instead of letting the loop die.
                OnReceiveError?.Invoke(ex);
                try
                {
                    var fresh = (Upd.State)await GetStateAsync(cancellationToken).ConfigureAwait(false);
                    (pts, qts, date) = (fresh.Pts, fresh.Qts, fresh.Date);
                }
                catch (OperationCanceledException) { break; }
                catch { /* keep previous state and retry */ }
                await DelaySafe(interval, cancellationToken).ConfigureAwait(false);
                continue;
            }

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

    internal async Task DispatchAsync(
        Schema.IMessage[] newMessages, Schema.IUpdate[] otherUpdates, Schema.IUser[] users, Schema.IChat[] chats)
    {
        var ctx = new ParseContext(this, users, chats);

        // New messages arrive flattened in new_messages.
        foreach (var m in newMessages)
            if (ctx.ParseMessage(m) is { } pm)
                await FireAsync(_messageHandlers, pm).ConfigureAwait(false);

        // Everything else (edits, deletions, read receipts, …) is in other_updates.
        foreach (var update in otherUpdates)
        {
            foreach (var raw in _rawHandlers)
                await raw(update).ConfigureAwait(false);

            switch (update)
            {
                case Schema.UpdateNewMessage u when ctx.ParseMessage(u.Message) is { } pm:
                    await FireAsync(_messageHandlers, pm).ConfigureAwait(false);
                    break;
                case Schema.UpdateNewChannelMessage u when ctx.ParseMessage(u.Message) is { } pm:
                    await FireAsync(_messageHandlers, pm).ConfigureAwait(false);
                    break;
                case Schema.UpdateEditMessage u when ctx.ParseMessage(u.Message) is { } pm:
                    await FireAsync(_editedHandlers, pm).ConfigureAwait(false);
                    break;
                case Schema.UpdateEditChannelMessage u when ctx.ParseMessage(u.Message) is { } pm:
                    await FireAsync(_editedHandlers, pm).ConfigureAwait(false);
                    break;
                case Schema.UpdateDeleteMessages u:
                    await FireDeletedAsync(new DeletedMessages(u.Messages, null)).ConfigureAwait(false);
                    break;
                case Schema.UpdateDeleteChannelMessages u:
                    await FireDeletedAsync(new DeletedMessages(u.Messages, u.ChannelId)).ConfigureAwait(false);
                    break;
            }
        }
    }

    private static async Task FireAsync(List<Func<Message, Task>> handlers, Message message)
    {
        foreach (var handler in handlers)
            await handler(message).ConfigureAwait(false);
    }

    private async Task FireDeletedAsync(DeletedMessages deleted)
    {
        foreach (var handler in _deletedHandlers)
            await handler(deleted).ConfigureAwait(false);
    }

    private static (int pts, int qts, int date) StateOf(Upd.IState state)
        => state is Upd.State s ? (s.Pts, s.Qts, s.Date) : (0, 0, 0);

    private static async Task DelaySafe(TimeSpan delay, CancellationToken ct)
    {
        try { await Task.Delay(delay, ct).ConfigureAwait(false); }
        catch (OperationCanceledException) { /* loop will exit */ }
    }
}
