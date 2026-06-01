namespace EitaaSharp.Tl;

/// <summary>
/// Maps TL constructor ids to factories that deserialize the object body
/// (the id has already been consumed by <see cref="TlReader.ReadObject"/>).
/// Mirrors the JS <c>parserMap</c> keyed by <c>id &gt;&gt;&gt; 0</c>.
/// </summary>
public sealed class TlRegistry
{
    private readonly Dictionary<uint, Func<TlReader, ITlObject>> _factories = new();

    /// <summary>
    /// The shared registry the generated schema registers into and that
    /// <see cref="TlReader"/> uses by default.
    /// </summary>
    public static TlRegistry Default { get; } = new();

    public void Register(uint constructorId, Func<TlReader, ITlObject> factory)
        => _factories[constructorId] = factory;

    public bool TryGet(uint constructorId, out Func<TlReader, ITlObject> factory)
        => _factories.TryGetValue(constructorId, out factory!);

    public ITlObject Create(uint constructorId, TlReader reader)
    {
        if (!_factories.TryGetValue(constructorId, out var factory))
            throw new TlDeserializeException(constructorId);
        return factory(reader);
    }

    public int Count => _factories.Count;
}
