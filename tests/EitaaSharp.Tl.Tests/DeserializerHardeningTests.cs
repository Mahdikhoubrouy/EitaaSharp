using EitaaSharp.Tl;

namespace EitaaSharp.Tl.Tests;

/// <summary>
/// Covers the deserializer-hardening behaviour: an unknown <b>top-level</b> constructor becomes an
/// <see cref="UnknownConstructor"/> in tolerant mode, strict mode throws a
/// <see cref="TlDeserializeException"/> carrying the offset and a type-path breadcrumb, and a
/// nested unknown is never tolerated (positionally unrecoverable).
/// </summary>
public class DeserializerHardeningTests
{
    private const uint UnknownId = 0xDEADBEEFu;

    // A minimal registered wrapper whose body is a single nested boxed object — lets us exercise the
    // nested-unknown path and the breadcrumb naming.
    private sealed record Wrapper(ITlObject Child) : ITlObject
    {
        public const uint TypeId = 0xAABBCCDDu;
        public uint ConstructorId => TypeId;
        public void Serialize(TlWriter writer) { writer.WriteUInt32(TypeId); writer.WriteObject(Child); }
        public static Wrapper Deserialize(TlReader reader) => new(reader.ReadObject());
    }

    private static byte[] Buffer(params uint[] ids)
    {
        var w = new TlWriter();
        foreach (var id in ids) w.WriteUInt32(id);
        return w.ToArray();
    }

    [Fact]
    public void UnknownTopLevel_InTolerantMode_YieldsUnknownConstructorWithRawBody()
    {
        var w = new TlWriter();
        w.WriteUInt32(UnknownId);
        w.WriteInt32(42); // arbitrary body
        var buffer = w.ToArray();

        var reader = new TlReader(buffer, new TlRegistry(), tolerateUnknownTopLevel: true);
        var obj = reader.ReadObject();

        var unknown = Assert.IsType<UnknownConstructor>(obj);
        Assert.Equal(UnknownId, unknown.Id);
        Assert.Equal(new byte[] { 42, 0, 0, 0 }, unknown.RawBody);
        Assert.Equal(0, reader.Remaining); // the whole body was captured
    }

    [Fact]
    public void UnknownTopLevel_InStrictMode_ThrowsWithOffsetAndNoTypePath()
    {
        var reader = new TlReader(Buffer(UnknownId), new TlRegistry()); // strict (default)

        var ex = Assert.Throws<TlDeserializeException>(() => reader.ReadObject());

        Assert.Equal(UnknownId, ex.ConstructorId);
        Assert.Equal(0, ex.Offset);     // the id sat at the very start
        Assert.Null(ex.TypePath);       // nothing above it
    }

    [Fact]
    public void NestedUnknown_ThrowsEvenInTolerantMode_WithBreadcrumb()
    {
        var registry = new TlRegistry();
        registry.Register(Wrapper.TypeId, Wrapper.Deserialize, "Test.Wrapper");

        // wrapper id, then an unknown child id at offset 4
        var reader = new TlReader(Buffer(Wrapper.TypeId, UnknownId), registry, tolerateUnknownTopLevel: true);

        var ex = Assert.Throws<TlDeserializeException>(() => reader.ReadObject());

        Assert.Equal(UnknownId, ex.ConstructorId);
        Assert.Equal(4, ex.Offset);
        Assert.Equal("Test.Wrapper", ex.TypePath);
        Assert.Contains("0xDEADBEEF", ex.Message);
        Assert.Contains("Test.Wrapper", ex.Message);
    }

    [Fact]
    public void UnknownConstructor_RoundTrips()
    {
        var original = new UnknownConstructor(UnknownId, new byte[] { 1, 2, 3, 4 });
        var w = new TlWriter();
        original.Serialize(w);

        // little-endian id (EF BE AD DE) followed by the raw body verbatim
        Assert.Equal(new byte[] { 0xEF, 0xBE, 0xAD, 0xDE, 1, 2, 3, 4 }, w.ToArray());
    }
}
