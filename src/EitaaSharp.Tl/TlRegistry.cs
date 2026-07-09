namespace EitaaSharp.Tl;

/// <summary>
/// Maps TL constructor ids to factories that deserialize the object body
/// (the id has already been consumed by <see cref="TlReader.ReadObject"/>).
/// Mirrors the JS <c>parserMap</c> keyed by <c>id &gt;&gt;&gt; 0</c>.
/// </summary>
public sealed class TlRegistry
{
    private readonly Dictionary<uint, Func<TlReader, ITlObject>> _factories = new();
    private readonly Dictionary<uint, string> _names = new();

    /// <summary>
    /// The shared registry the generated schema registers into and that
    /// <see cref="TlReader"/> uses by default.
    /// </summary>
    public static TlRegistry Default { get; } = new();

    /// <summary>Registers a deserializer for <paramref name="constructorId"/>.</summary>
    /// <param name="constructorId">The boxed constructor id.</param>
    /// <param name="factory">Reads the object body and returns the constructed object.</param>
    public void Register(uint constructorId, Func<TlReader, ITlObject> factory)
        => _factories[constructorId] = factory;

    /// <summary>Registers a deserializer plus a human-readable type name (used in error breadcrumbs).</summary>
    /// <param name="constructorId">The boxed constructor id.</param>
    /// <param name="factory">Reads the object body and returns the constructed object.</param>
    /// <param name="typeName">A short type name (e.g. <c>Updates.Difference</c>) for diagnostics.</param>
    public void Register(uint constructorId, Func<TlReader, ITlObject> factory, string typeName)
    {
        _factories[constructorId] = factory;
        _names[constructorId] = typeName;
    }

    /// <summary>True when a factory is registered for <paramref name="constructorId"/>.</summary>
    public bool Contains(uint constructorId) => _factories.ContainsKey(constructorId);

    public bool TryGet(uint constructorId, out Func<TlReader, ITlObject> factory)
        => _factories.TryGetValue(constructorId, out factory!);

    /// <summary>Returns the registered type name for a constructor id, or null if none was registered.</summary>
    public string? GetName(uint constructorId)
        => _names.TryGetValue(constructorId, out var name) ? name : null;

    public ITlObject Create(uint constructorId, TlReader reader)
    {
        if (!_factories.TryGetValue(constructorId, out var factory))
            throw new TlDeserializeException(constructorId);
        return factory(reader);
    }

    public int Count => _factories.Count;
}
