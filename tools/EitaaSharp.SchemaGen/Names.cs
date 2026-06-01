using System.Text;

namespace EitaaSharp.SchemaGen;

/// <summary>Maps TL identifiers (predicate/method/type/param names) to C# identifiers and namespaces.</summary>
public static class Names
{
    public const string RootNamespace = "EitaaSharp.Schema";

    /// <summary>Converts snake_case / camelCase to PascalCase, preserving internal humps.</summary>
    public static string Pascal(string name)
    {
        var sb = new StringBuilder(name.Length);
        bool upperNext = true;
        foreach (char c in name)
        {
            if (c == '_' || c == '.')
            {
                upperNext = true;
                continue;
            }
            sb.Append(upperNext ? char.ToUpperInvariant(c) : c);
            upperNext = false;
        }
        var result = sb.ToString();
        if (result.Length == 0)
            result = "Empty";
        if (char.IsDigit(result[0]))
            result = "_" + result;
        return result;
    }

    /// <summary>Splits a (possibly dotted) TL name into its C# namespace suffix and bare name.</summary>
    public static (string Namespace, string Name) Split(string dotted)
    {
        int dot = dotted.IndexOf('.');
        if (dot < 0)
            return ("", dotted);
        return (dotted[..dot], dotted[(dot + 1)..]);
    }

    /// <summary>The full C# namespace for a TL name (root, or a sub-namespace for a dotted prefix).</summary>
    public static string NamespaceFor(string dotted)
    {
        var (ns, _) = Split(dotted);
        return ns.Length == 0 ? RootNamespace : $"{RootNamespace}.{Pascal(ns)}";
    }

    /// <summary>The fully-qualified interface name for a boxed TL type, e.g. <c>auth.SentCode</c> → <c>...Auth.ISentCode</c>.</summary>
    public static string InterfaceFullName(string tlType)
    {
        var (ns, name) = Split(tlType);
        string nsFull = ns.Length == 0 ? RootNamespace : $"{RootNamespace}.{Pascal(ns)}";
        return $"global::{nsFull}.I{Pascal(name)}";
    }
}
