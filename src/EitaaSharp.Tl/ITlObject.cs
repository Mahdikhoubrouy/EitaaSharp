namespace EitaaSharp.Tl;

/// <summary>
/// A serializable TL object (a "constructor" in TL terms). Implementations write
/// their constructor id followed by their body, mirroring the JS builder map
/// where each function starts with <c>this.int32(id)</c>.
/// </summary>
public interface ITlObject
{
    /// <summary>The TL constructor id, dispatched as an unsigned 32-bit value.</summary>
    uint ConstructorId { get; }

    /// <summary>Writes this object's constructor id and body to the writer (boxed form).</summary>
    void Serialize(TlWriter writer);
}

/// <summary>
/// A TL method (RPC function) whose result deserializes to <typeparamref name="TResult"/>.
/// Lets <c>EitaaRpc.Call</c> return a strongly-typed result. <see cref="ReadResult"/>
/// knows how to read this method's specific return type (boxed object, bool, vector, …).
/// </summary>
/// <typeparam name="TResult">The deserialized response type.</typeparam>
public interface ITlMethod<out TResult> : ITlObject
{
    /// <summary>Reads this method's result from a reader positioned at the start of the response.</summary>
    TResult ReadResult(TlReader reader);
}
