namespace EitaaSharp.SchemaGen;

/// <summary>
/// Maps a TL "leaf" type (a value type after any flag/vector wrapper is removed) to its
/// C# property type and the writer/reader expressions used to serialize it.
/// </summary>
public static class TypeResolver
{
    /// <summary>True for TL types the engine handles directly (no generated interface).</summary>
    public static bool IsValueType(string leaf) => leaf switch
    {
        "int" or "#" or "long" or "double" or "Bool" or "true" or "int128" or "int256" => true,
        _ => false,
    };

    /// <summary>True for the generic TL supertypes that map to <c>ITlObject</c> rather than a generated interface.</summary>
    public static bool IsGenericObject(string leaf) => leaf is "!X" or "X" or "Object";

    /// <summary>True for any leaf the engine serializes without a generated interface.</summary>
    public static bool IsEngineHandled(string leaf) =>
        IsValueType(leaf) || IsGenericObject(leaf) || leaf is "string" or "bytes"
        || leaf.StartsWith("Vector<", StringComparison.OrdinalIgnoreCase);

    /// <summary>The C# property type for a leaf TL type (without nullability).</summary>
    public static string CSharpType(string leaf) => leaf switch
    {
        "int" or "#" => "int",
        "long" => "long",
        "double" => "double",
        "string" => "string",
        "bytes" => "byte[]",
        "int128" => "global::EitaaSharp.Tl.TlInt128",
        "int256" => "global::EitaaSharp.Tl.TlInt256",
        "Bool" or "true" => "bool",
        "!X" or "X" or "Object" => "global::EitaaSharp.Tl.ITlObject",
        _ => Names.InterfaceFullName(StripBare(leaf)),
    };

    /// <summary>A statement that writes <paramref name="accessor"/> as the given leaf type.</summary>
    public static string WriteExpr(string leaf, string accessor) => leaf switch
    {
        "int" or "#" => $"writer.WriteInt32({accessor})",
        "long" => $"writer.WriteLong({accessor})",
        "double" => $"writer.WriteDouble({accessor})",
        "string" => $"writer.WriteString({accessor})",
        "bytes" => $"writer.WriteBytes({accessor})",
        "int128" => $"writer.WriteInt128({accessor})",
        "int256" => $"writer.WriteInt256({accessor})",
        "Bool" => $"writer.WriteBool({accessor})",
        "!X" or "X" or "Object" => $"writer.WriteObject({accessor})",
        _ => $"writer.WriteObject({accessor})", // boxed
    };

    /// <summary>An expression that reads the given leaf type from <c>reader</c>.</summary>
    public static string ReadExpr(string leaf) => leaf switch
    {
        "int" or "#" => "reader.ReadInt32()",
        "long" => "reader.ReadLong()",
        "double" => "reader.ReadDouble()",
        "string" => "reader.ReadString()",
        "bytes" => "reader.ReadBytes()",
        "int128" => "reader.ReadInt128()",
        "int256" => "reader.ReadInt256()",
        "Bool" => "reader.ReadBool()",
        "!X" or "X" or "Object" => "reader.ReadObject()",
        _ => $"reader.ReadObject<{Names.InterfaceFullName(StripBare(leaf))}>()", // boxed
    };

    /// <summary>A lambda <c>(w, x) =&gt; ...</c> that writes one vector element of the leaf type.</summary>
    public static string VectorWriteLambda(string leaf) => leaf switch
    {
        "int" or "#" => "(w, x) => w.WriteInt32(x)",
        "long" => "(w, x) => w.WriteLong(x)",
        "double" => "(w, x) => w.WriteDouble(x)",
        "string" => "(w, x) => w.WriteString(x)",
        "bytes" => "(w, x) => w.WriteBytes(x)",
        "int128" => "(w, x) => w.WriteInt128(x)",
        "int256" => "(w, x) => w.WriteInt256(x)",
        "Bool" => "(w, x) => w.WriteBool(x)",
        "!X" or "X" or "Object" => "(w, x) => w.WriteObject(x)",
        _ => "(w, x) => w.WriteObject(x)", // boxed
    };

    /// <summary>A lambda <c>r =&gt; ...</c> that reads one vector element of the leaf type.</summary>
    public static string VectorReadLambda(string leaf) => leaf switch
    {
        "int" or "#" => "r => r.ReadInt32()",
        "long" => "r => r.ReadLong()",
        "double" => "r => r.ReadDouble()",
        "string" => "r => r.ReadString()",
        "bytes" => "r => r.ReadBytes()",
        "int128" => "r => r.ReadInt128()",
        "int256" => "r => r.ReadInt256()",
        "Bool" => "r => r.ReadBool()",
        "!X" or "X" or "Object" => "r => r.ReadObject()",
        _ => $"r => r.ReadObject<{Names.InterfaceFullName(StripBare(leaf))}>()", // boxed
    };

    public static string StripBare(string t) => t.StartsWith('%') ? t[1..] : t;
}
