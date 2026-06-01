using System.Text;

namespace EitaaSharp.SchemaGen;

/// <summary>
/// Generates strongly-typed C# records for every TL constructor/method plus per-type
/// marker interfaces and a registry of id → deserializer. Ports the body logic of
/// <c>scripts/generate-builder.js</c> and <c>generate-parser.js</c>.
/// </summary>
public sealed class Emitter
{
    // Constructor ids handled directly by the engine (bool/vector/null/true/gzip) — not generated.
    // Mirrors the bodyById special cases in generate-parser.js.
    private static readonly HashSet<uint> SpecialIds = new()
    {
        481674261,   // vector
        3162085175,  // boolFalse
        2574415285,  // boolTrue
        1072550713,  // true
        1450380236,  // null
        812830625,   // gzip_packed
    };

    private static readonly HashSet<string> ReservedMemberNames = new()
    {
        "TypeId", "ConstructorId", "Serialize", "Deserialize", "ReadResult",
        "Equals", "GetHashCode", "ToString", "GetType",
    };

    private readonly Dictionary<string, StringBuilder> _byNamespace = new();
    private readonly HashSet<string> _interfaces = new();           // full interface TL type strings
    private readonly Dictionary<string, HashSet<string>> _usedNames = new(); // namespace -> used type names
    private readonly List<(uint Id, string FullName)> _registrations = new();
    private readonly HashSet<uint> _seenIds = new();
    private readonly HashSet<string> _reservedRootNames = new();    // names that clash with sub-namespaces

    /// <summary>Reserves the C# names of every sub-namespace so root-level types never collide with them.</summary>
    public void ReserveNamespaceNames(IEnumerable<string> dottedNames)
    {
        foreach (var name in dottedNames)
        {
            int dot = name.IndexOf('.');
            if (dot > 0)
                _reservedRootNames.Add(Names.Pascal(name[..dot]));
        }
    }

    private string? _activePrefix;
    private HashSet<string>? _activeTypeSet;

    public void AddConstructors(IEnumerable<TlConstructor> constructors, string? forcedPrefix, HashSet<string>? prefixedTypes = null)
    {
        _activePrefix = forcedPrefix;
        _activeTypeSet = prefixedTypes;
        foreach (var c in constructors)
        {
            uint id = unchecked((uint)c.Id);
            if (SpecialIds.Contains(id))
                continue;

            string predicate = Prefixed(c.Predicate, forcedPrefix);
            string typeName = Prefixed(c.Type, forcedPrefix);
            RegisterInterface(typeName);
            foreach (var leaf in ReferencedBoxedLeaves(c.Params))
                RegisterInterface(leaf);

            if (!_seenIds.Add(id))
                continue; // duplicate id across schemas — keep the first

            string fullName = EmitObject(predicate, id, c.Params, isMethod: false, resultType: null,
                implementsInterface: typeName);
            _registrations.Add((id, fullName));
        }
    }

    public void AddMethods(IEnumerable<TlMethod> methods, string? forcedPrefix, HashSet<string>? prefixedTypes = null)
    {
        _activePrefix = forcedPrefix;
        _activeTypeSet = prefixedTypes;
        foreach (var m in methods)
        {
            uint id = unchecked((uint)m.Id);
            string method = Prefixed(m.Method, forcedPrefix);
            string resultType = QualifyResultType(m.Type);

            // Ensure referenced result interfaces exist.
            foreach (var leaf in ReferencedBoxedLeaves(m.Params))
                RegisterInterface(leaf);
            RegisterResultInterface(resultType);

            EmitObject(method, id, m.Params, isMethod: true, resultType: resultType,
                implementsInterface: null);
        }
    }

    private static string Prefixed(string name, string? forcedPrefix)
        => forcedPrefix is null || name.Contains('.') ? name : $"{forcedPrefix}.{name}";

    // ---- interface tracking -------------------------------------------------

    private void RegisterInterface(string tlType)
    {
        string leaf = TypeResolver.StripBare(tlType);
        if (TypeResolver.IsEngineHandled(leaf))
            return;
        _interfaces.Add(leaf);
    }

    private void RegisterResultInterface(string resultType)
    {
        if (resultType.StartsWith("Vector<", StringComparison.OrdinalIgnoreCase))
        {
            RegisterInterface(VectorElem(resultType));
            return;
        }
        RegisterInterface(resultType);
    }

    private IEnumerable<string> ReferencedBoxedLeaves(IEnumerable<TlParam> ps)
    {
        foreach (var p in ps)
        {
            foreach (var leaf in LeafTypesOf(p.Type))
                yield return QualifyLeaf(leaf);
        }
    }

    /// <summary>Qualifies a method result type (handles the <c>Vector&lt;T&gt;</c> wrapper).</summary>
    private string QualifyResultType(string resultType)
    {
        if (resultType.StartsWith("Vector<", StringComparison.OrdinalIgnoreCase))
            return $"Vector<{QualifyLeaf(TypeResolver.StripBare(VectorElem(resultType)))}>";
        return QualifyLeaf(resultType);
    }

    /// <summary>Applies the active schema prefix to a boxed leaf type, but only to types that schema defines.</summary>
    private string QualifyLeaf(string leaf)
    {
        if (TypeResolver.IsEngineHandled(leaf) || leaf.Contains('.'))
            return leaf;
        if (_activePrefix is not null && _activeTypeSet is not null && _activeTypeSet.Contains(leaf))
            return $"{_activePrefix}.{leaf}";
        return leaf;
    }

    private static IEnumerable<string> LeafTypesOf(string type)
    {
        if (type == "#") yield break;
        string work = type;
        if (work.Contains('?'))
            work = work.Split('?', 2)[1];
        if (work == "true") yield break;
        if (work.StartsWith("Vector<", StringComparison.OrdinalIgnoreCase))
            work = VectorElem(work);
        yield return TypeResolver.StripBare(work);
    }

    // ---- record emission ----------------------------------------------------

    private string EmitObject(string tlName, uint id, List<TlParam> ps, bool isMethod,
        string? resultType, string? implementsInterface)
    {
        var (ns, _) = Names.Split(tlName);
        string fullNs = ns.Length == 0 ? Names.RootNamespace : $"{Names.RootNamespace}.{Names.Pascal(ns)}";
        string recordName = UniqueName(fullNs, Names.Pascal(SplitName(tlName)), id);

        var sb = NamespaceBuilder(fullNs);

        // Decompose params once.
        var parsed = ps.Select(Parse).ToList();

        string interfaces = isMethod
            ? $"global::EitaaSharp.Tl.ITlMethod<{ResultCsType(resultType!)}>"
            : Names.InterfaceFullName(implementsInterface!);

        sb.AppendLine($"    /// <summary>TL <c>{tlName}#{id:x8}</c>.</summary>");
        sb.AppendLine($"    public sealed record {recordName} : {interfaces}");
        sb.AppendLine("    {");
        sb.AppendLine($"        public const uint TypeId = 0x{id:X8}u;");
        sb.AppendLine("        public uint ConstructorId => TypeId;");
        sb.AppendLine();

        EmitProperties(sb, parsed, recordName);
        sb.AppendLine();
        EmitSerialize(sb, parsed);

        if (!isMethod)
        {
            sb.AppendLine();
            EmitDeserialize(sb, parsed, recordName);
        }
        else
        {
            sb.AppendLine();
            EmitReadResult(sb, resultType!);
        }

        sb.AppendLine("    }");
        sb.AppendLine();

        return $"global::{fullNs}.{recordName}";
    }

    private void EmitProperties(StringBuilder sb, List<ParsedParam> parsed, string recordName)
    {
        foreach (var p in parsed)
        {
            if (p.Kind == ParamKind.Flags) continue;

            string propName = p.PropName;
            if (propName == recordName || ReservedMemberNames.Contains(propName))
                propName += "Value";
            p.EmittedPropName = propName;

            switch (p.Kind)
            {
                case ParamKind.ConditionalTrue:
                    sb.AppendLine($"        public bool {propName} {{ get; init; }}");
                    break;
                case ParamKind.Conditional:
                    sb.AppendLine($"        public {TypeResolver.CSharpType(p.Leaf)}? {propName} {{ get; init; }}");
                    break;
                case ParamKind.Vector:
                    sb.AppendLine($"        public required {TypeResolver.CSharpType(p.Leaf)}[] {propName} {{ get; init; }}");
                    break;
                case ParamKind.FlagVector:
                    sb.AppendLine($"        public {TypeResolver.CSharpType(p.Leaf)}[]? {propName} {{ get; init; }}");
                    break;
                default: // Plain
                    sb.AppendLine($"        public required {TypeResolver.CSharpType(p.Leaf)} {propName} {{ get; init; }}");
                    break;
            }
        }
    }

    private void EmitSerialize(StringBuilder sb, List<ParsedParam> parsed)
    {
        sb.AppendLine("        public void Serialize(global::EitaaSharp.Tl.TlWriter writer)");
        sb.AppendLine("        {");
        sb.AppendLine("            writer.WriteUInt32(TypeId);");

        foreach (var p in parsed)
        {
            switch (p.Kind)
            {
                case ParamKind.Flags:
                    sb.AppendLine($"            int {p.FlagsName} = 0;");
                    foreach (var dep in parsed.Where(x => x.FlagsRef == p.FlagsName))
                    {
                        int mask = 1 << dep.Bit;
                        string cond = dep.Kind == ParamKind.ConditionalTrue
                            ? dep.EmittedPropName!
                            : $"{dep.EmittedPropName} is not null";
                        sb.AppendLine($"            if ({cond}) {p.FlagsName} |= 0x{mask:X};");
                    }
                    sb.AppendLine($"            writer.WriteInt32({p.FlagsName});");
                    break;

                case ParamKind.ConditionalTrue:
                    break; // presence-only, no bytes

                case ParamKind.Conditional:
                    {
                        string acc = TypeResolver.IsValueType(p.Leaf)
                            ? $"{p.EmittedPropName}.Value"
                            : p.EmittedPropName!;
                        sb.AppendLine($"            if ({p.EmittedPropName} is not null) {TypeResolver.WriteExpr(p.Leaf, acc)};");
                    }
                    break;

                case ParamKind.Vector:
                    sb.AppendLine($"            writer.WriteVector({p.EmittedPropName}, {TypeResolver.VectorWriteLambda(p.Leaf)});");
                    break;

                case ParamKind.FlagVector:
                    sb.AppendLine($"            if ({p.EmittedPropName} is not null) writer.WriteVector({p.EmittedPropName}, {TypeResolver.VectorWriteLambda(p.Leaf)});");
                    break;

                default: // Plain
                    sb.AppendLine($"            {TypeResolver.WriteExpr(p.Leaf, p.EmittedPropName!)};");
                    break;
            }
        }

        sb.AppendLine("        }");
    }

    private void EmitDeserialize(StringBuilder sb, List<ParsedParam> parsed, string recordName)
    {
        sb.AppendLine($"        public static {recordName} Deserialize(global::EitaaSharp.Tl.TlReader reader)");
        sb.AppendLine("        {");

        var initializers = new List<string>();

        foreach (var p in parsed)
        {
            switch (p.Kind)
            {
                case ParamKind.Flags:
                    sb.AppendLine($"            int {p.FlagsName} = reader.ReadInt32();");
                    break;

                case ParamKind.ConditionalTrue:
                    sb.AppendLine($"            bool _{p.EmittedPropName} = ({p.FlagsRef} & 0x{1 << p.Bit:X}) != 0;");
                    initializers.Add($"{p.EmittedPropName} = _{p.EmittedPropName}");
                    break;

                case ParamKind.Conditional:
                    {
                        string nullLit = TypeResolver.IsValueType(p.Leaf)
                            ? $"({TypeResolver.CSharpType(p.Leaf)}?)null"
                            : "null";
                        sb.AppendLine($"            {TypeResolver.CSharpType(p.Leaf)}? _{p.EmittedPropName} = ({p.FlagsRef} & 0x{1 << p.Bit:X}) != 0 ? {TypeResolver.ReadExpr(p.Leaf)} : {nullLit};");
                        initializers.Add($"{p.EmittedPropName} = _{p.EmittedPropName}");
                    }
                    break;

                case ParamKind.Vector:
                    sb.AppendLine($"            {TypeResolver.CSharpType(p.Leaf)}[] _{p.EmittedPropName} = reader.ReadVector({TypeResolver.VectorReadLambda(p.Leaf)}{(p.Bare ? ", true" : "")});");
                    initializers.Add($"{p.EmittedPropName} = _{p.EmittedPropName}");
                    break;

                case ParamKind.FlagVector:
                    sb.AppendLine($"            {TypeResolver.CSharpType(p.Leaf)}[]? _{p.EmittedPropName} = ({p.FlagsRef} & 0x{1 << p.Bit:X}) != 0 ? reader.ReadVector({TypeResolver.VectorReadLambda(p.Leaf)}) : null;");
                    initializers.Add($"{p.EmittedPropName} = _{p.EmittedPropName}");
                    break;

                default: // Plain
                    sb.AppendLine($"            {TypeResolver.CSharpType(p.Leaf)} _{p.EmittedPropName} = {TypeResolver.ReadExpr(p.Leaf)};");
                    initializers.Add($"{p.EmittedPropName} = _{p.EmittedPropName}");
                    break;
            }
        }

        if (initializers.Count == 0)
            sb.AppendLine($"            return new {recordName}();");
        else
            sb.AppendLine($"            return new {recordName} {{ {string.Join(", ", initializers)} }};");

        sb.AppendLine("        }");
    }

    private void EmitReadResult(StringBuilder sb, string resultType)
    {
        sb.AppendLine($"        public {ResultCsType(resultType)} ReadResult(global::EitaaSharp.Tl.TlReader reader)");
        sb.AppendLine($"            => {ResultReadExpr(resultType)};");
    }

    private static string ResultCsType(string resultType)
    {
        if (resultType.StartsWith("Vector<", StringComparison.OrdinalIgnoreCase))
            return $"{TypeResolver.CSharpType(TypeResolver.StripBare(VectorElem(resultType)))}[]";
        return TypeResolver.CSharpType(resultType);
    }

    private static string ResultReadExpr(string resultType)
    {
        if (resultType.StartsWith("Vector<", StringComparison.OrdinalIgnoreCase))
        {
            string elem = TypeResolver.StripBare(VectorElem(resultType));
            return $"reader.ReadVector({TypeResolver.VectorReadLambda(elem)})";
        }
        return TypeResolver.ReadExpr(resultType);
    }

    // ---- param decomposition ------------------------------------------------

    private enum ParamKind { Plain, Flags, Conditional, ConditionalTrue, Vector, FlagVector }

    private sealed class ParsedParam
    {
        public ParamKind Kind;
        public string PropName = "";
        public string? EmittedPropName;
        public string Leaf = "";
        public string? FlagsName;   // for Flags param: its own name
        public string? FlagsRef;    // for conditionals: which flags field
        public int Bit;
        public bool Bare;
    }

    private ParsedParam Parse(TlParam param)
    {
        string type = param.Type;
        string prop = Names.Pascal(param.Name);

        if (type == "#")
            return new ParsedParam { Kind = ParamKind.Flags, PropName = prop, FlagsName = param.Name };

        if (type.Contains('?'))
        {
            var (left, right) = (type.Split('?', 2)[0], type.Split('?', 2)[1]);
            var (flagsName, bitStr) = (left.Split('.')[0], left.Split('.')[1]);
            int bit = int.Parse(bitStr);

            if (right == "true")
                return new ParsedParam { Kind = ParamKind.ConditionalTrue, PropName = prop, FlagsRef = flagsName, Bit = bit };

            if (right.StartsWith("Vector<", StringComparison.OrdinalIgnoreCase))
                return new ParsedParam { Kind = ParamKind.FlagVector, PropName = prop, Leaf = QualifyLeaf(TypeResolver.StripBare(VectorElem(right))), FlagsRef = flagsName, Bit = bit };

            return new ParsedParam { Kind = ParamKind.Conditional, PropName = prop, Leaf = QualifyLeaf(TypeResolver.StripBare(right)), FlagsRef = flagsName, Bit = bit };
        }

        if (type.StartsWith("Vector<", StringComparison.OrdinalIgnoreCase))
        {
            string inner = VectorElem(type);
            return new ParsedParam { Kind = ParamKind.Vector, PropName = prop, Leaf = QualifyLeaf(TypeResolver.StripBare(inner)), Bare = inner.StartsWith('%') };
        }

        return new ParsedParam { Kind = ParamKind.Plain, PropName = prop, Leaf = QualifyLeaf(type) };
    }

    // ---- helpers ------------------------------------------------------------

    private static string VectorElem(string vectorType)
    {
        int lt = vectorType.IndexOf('<');
        int gt = vectorType.LastIndexOf('>');
        return vectorType.Substring(lt + 1, gt - lt - 1);
    }

    private static string SplitName(string dotted)
    {
        int dot = dotted.IndexOf('.');
        return dot < 0 ? dotted : dotted[(dot + 1)..];
    }

    private string UniqueName(string ns, string baseName, uint id)
    {
        if (!_usedNames.TryGetValue(ns, out var used))
            _usedNames[ns] = used = new HashSet<string>();

        bool clashesWithNamespace = ns == Names.RootNamespace && _reservedRootNames.Contains(baseName);

        if (clashesWithNamespace)
        {
            // A root type whose name equals a sub-namespace (e.g. `updates` vs the Updates namespace):
            // give it a readable, stable suffix rather than a hex id.
            string preferred = $"{baseName}Container";
            string name = used.Contains(preferred) ? $"{baseName}_{id:X8}" : preferred;
            used.Add(name);
            return name;
        }

        if (!used.Add(baseName))
        {
            string suffixed = $"{baseName}_{id:X8}";
            used.Add(suffixed);
            return suffixed;
        }

        return baseName;
    }

    private StringBuilder NamespaceBuilder(string ns)
    {
        if (!_byNamespace.TryGetValue(ns, out var sb))
        {
            sb = new StringBuilder();
            sb.AppendLine("// <auto-generated>Generated by EitaaSharp.SchemaGen. Do not edit.</auto-generated>");
            sb.AppendLine("#nullable enable");
            sb.AppendLine($"namespace {ns}");
            sb.AppendLine("{");
            _byNamespace[ns] = sb;
        }
        return sb;
    }

    // ---- output -------------------------------------------------------------

    public void Write(string outputDir)
    {
        Directory.CreateDirectory(outputDir);
        foreach (var old in Directory.GetFiles(outputDir, "*.g.cs"))
            File.Delete(old);

        // Emit interfaces grouped by their namespace.
        foreach (var tlType in _interfaces)
        {
            var (ns, name) = Names.Split(tlType);
            string fullNs = ns.Length == 0 ? Names.RootNamespace : $"{Names.RootNamespace}.{Names.Pascal(ns)}";
            var sb = NamespaceBuilder(fullNs);
            sb.AppendLine($"    /// <summary>TL boxed type <c>{tlType}</c>.</summary>");
            sb.AppendLine($"    public interface I{Names.Pascal(name)} : global::EitaaSharp.Tl.ITlObject {{ }}");
            sb.AppendLine();
        }

        foreach (var (ns, sb) in _byNamespace)
        {
            sb.AppendLine("}");
            string fileName = ns.Replace('.', '_') + ".g.cs";
            File.WriteAllText(Path.Combine(outputDir, fileName), sb.ToString());
        }

        WriteRegistry(outputDir);
    }

    private void WriteRegistry(string outputDir)
    {
        var sb = new StringBuilder();
        sb.AppendLine("// <auto-generated>Generated by EitaaSharp.SchemaGen. Do not edit.</auto-generated>");
        sb.AppendLine("#nullable enable");
        sb.AppendLine("namespace EitaaSharp.Schema");
        sb.AppendLine("{");
        sb.AppendLine("    /// <summary>Registers every generated constructor with a <see cref=\"global::EitaaSharp.Tl.TlRegistry\"/>.</summary>");
        sb.AppendLine("    public static class GeneratedSchema");
        sb.AppendLine("    {");
        sb.AppendLine("        private static bool _registered;");
        sb.AppendLine("        private static readonly object Gate = new();");
        sb.AppendLine();
        sb.AppendLine("        public static void RegisterAll(global::EitaaSharp.Tl.TlRegistry? registry = null)");
        sb.AppendLine("        {");
        sb.AppendLine("            registry ??= global::EitaaSharp.Tl.TlRegistry.Default;");
        sb.AppendLine("            lock (Gate)");
        sb.AppendLine("            {");
        sb.AppendLine("                if (registry == global::EitaaSharp.Tl.TlRegistry.Default && _registered) return;");
        foreach (var (id, fullName) in _registrations)
            sb.AppendLine($"                registry.Register(0x{id:X8}u, {fullName}.Deserialize);");
        sb.AppendLine("                if (registry == global::EitaaSharp.Tl.TlRegistry.Default) _registered = true;");
        sb.AppendLine("            }");
        sb.AppendLine("        }");
        sb.AppendLine($"        public const int ConstructorCount = {_registrations.Count};");
        sb.AppendLine("    }");
        sb.AppendLine("}");
        File.WriteAllText(Path.Combine(outputDir, "GeneratedSchema.Registry.g.cs"), sb.ToString());
    }
}
