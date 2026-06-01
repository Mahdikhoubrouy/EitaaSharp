using EitaaSharp.SchemaGen;

// Generates strongly-typed C# for the whole TL schema.
//
// Usage:
//   dotnet run --project tools/EitaaSharp.SchemaGen -- <apiJson> <mtprotoJson> <outputDir>
// Defaults resolve the repo's scheme/ folder and src/EitaaSharp.Schema/Generated.

string repoRoot = FindRepoRoot();
string apiPath = args.ElementAtOrDefault(0) ?? Path.Combine(repoRoot, "scheme", "api.json");
string mtPath = args.ElementAtOrDefault(1) ?? Path.Combine(repoRoot, "scheme", "mtproto.json");
string outDir = args.ElementAtOrDefault(2) ?? Path.Combine(repoRoot, "src", "EitaaSharp.Schema", "Generated");

Console.WriteLine($"api.json:  {apiPath}");
Console.WriteLine($"mtproto:   {mtPath}");
Console.WriteLine($"output:    {outDir}");

var api = TlSchema.Load(apiPath);
var mt = TlSchema.Load(mtPath);

var emitter = new Emitter();

// Reserve sub-namespace names (auth, messages, updates, …) so root types never clash with them.
emitter.ReserveNamespaceNames(api.Constructors.Select(c => c.Type).Concat(api.Constructors.Select(c => c.Predicate)));
emitter.ReserveNamespaceNames(api.Methods.Select(m => m.Type).Concat(api.Methods.Select(m => m.Method)));
emitter.ReserveNamespaceNames(new[] { "mt.x" }); // the forced Mt prefix

// mtproto entries live under the Mt namespace (mirrors the JS mt_ prefix). Only the types
// mtproto itself defines get the prefix; cross-references to API types stay unprefixed.
var mtprotoTypes = new HashSet<string>(mt.Constructors.Select(c => c.Type));
emitter.AddConstructors(mt.Constructors, forcedPrefix: "mt", prefixedTypes: mtprotoTypes);
emitter.AddMethods(mt.Methods, forcedPrefix: "mt", prefixedTypes: mtprotoTypes);
emitter.AddConstructors(api.Constructors, forcedPrefix: null);
emitter.AddMethods(api.Methods, forcedPrefix: null);

emitter.Write(outDir);

Console.WriteLine($"Done. Constructors: {api.Constructors.Count + mt.Constructors.Count}, " +
                  $"Methods: {api.Methods.Count + mt.Methods.Count}");

static string FindRepoRoot()
{
    var dir = new DirectoryInfo(AppContext.BaseDirectory);
    while (dir is not null)
    {
        if (Directory.Exists(Path.Combine(dir.FullName, "scheme")) &&
            File.Exists(Path.Combine(dir.FullName, "EitaaSharp.slnx")))
            return dir.FullName;
        dir = dir.Parent;
    }
    return Directory.GetCurrentDirectory();
}
