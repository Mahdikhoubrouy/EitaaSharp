using EitaaSharp.Schema;

namespace EitaaSharp.Client.Updates;

/// <summary>
/// Unpacks an <see cref="IUpdates"/> container into individual <see cref="IUpdate"/>
/// events. The JS source never dispatched updates at all.
/// </summary>
public sealed class UpdateDispatcher
{
    /// <summary>Raised once per received <see cref="IUpdates"/> container.</summary>
    public event EventHandler<IUpdates>? UpdatesReceived;

    /// <summary>Raised once per individual <see cref="IUpdate"/> extracted from a container.</summary>
    public event EventHandler<IUpdate>? UpdateReceived;

    public void Dispatch(IUpdates updates)
    {
        UpdatesReceived?.Invoke(this, updates);
        foreach (var update in Extract(updates))
            UpdateReceived?.Invoke(this, update);
    }

    /// <summary>Extracts the individual updates carried by a container (empty for shorthand/too-long forms).</summary>
    public static IReadOnlyList<IUpdate> Extract(IUpdates updates) => updates switch
    {
        UpdatesContainer c => c.Updates,
        UpdatesCombined c => c.Updates,
        UpdateShort s => new[] { s.Update },
        _ => Array.Empty<IUpdate>(),
    };
}
