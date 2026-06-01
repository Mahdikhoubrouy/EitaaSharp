using System.Text.Json;
using System.Text.Json.Serialization;

namespace EitaaSharp.SchemaGen;

public sealed class TlParam
{
    [JsonPropertyName("name")] public string Name { get; set; } = "";
    [JsonPropertyName("type")] public string Type { get; set; } = "";
}

public sealed class TlConstructor
{
    [JsonPropertyName("id")] public long Id { get; set; }
    [JsonPropertyName("predicate")] public string Predicate { get; set; } = "";
    [JsonPropertyName("params")] public List<TlParam> Params { get; set; } = new();
    [JsonPropertyName("type")] public string Type { get; set; } = "";
}

public sealed class TlMethod
{
    [JsonPropertyName("id")] public long Id { get; set; }
    [JsonPropertyName("method")] public string Method { get; set; } = "";
    [JsonPropertyName("params")] public List<TlParam> Params { get; set; } = new();
    [JsonPropertyName("type")] public string Type { get; set; } = "";
}

public sealed class TlSchema
{
    [JsonPropertyName("constructors")] public List<TlConstructor> Constructors { get; set; } = new();
    [JsonPropertyName("methods")] public List<TlMethod> Methods { get; set; } = new();

    public static TlSchema Load(string path)
    {
        var json = File.ReadAllText(path);
        return JsonSerializer.Deserialize<TlSchema>(json)
               ?? throw new InvalidOperationException($"Failed to parse {path}");
    }
}
