namespace EitaaSharp.Tl;

/// <summary>Base type for errors raised by the TL engine.</summary>
public class TlException : Exception
{
    public TlException(string message) : base(message) { }
    public TlException(string message, Exception inner) : base(message, inner) { }
}

/// <summary>
/// Thrown when a constructor id read off the wire has no registered factory. Carries enough
/// context to diagnose the failure: the offending <see cref="ConstructorId"/> (hex + signed),
/// the byte <see cref="Offset"/> at which it was read, and a <see cref="TypePath"/> breadcrumb
/// of the parent types the reader was inside — turning "unknown id" into
/// "unknown id 0x… at offset N while reading Updates.Difference → …".
/// </summary>
public sealed class TlDeserializeException : TlException
{
    /// <summary>The unregistered constructor id, dispatched as an unsigned 32-bit value.</summary>
    public uint ConstructorId { get; }

    /// <summary>The byte offset of the offending constructor id within the buffer, or -1 if unknown.</summary>
    public int Offset { get; }

    /// <summary>
    /// A breadcrumb of the parent TL types the reader was reading when it hit the unknown id
    /// (outermost first, arrow-separated), or null when read at the top level / unavailable.
    /// </summary>
    public string? TypePath { get; }

    /// <summary>Creates the exception with just the offending id (no positional context).</summary>
    /// <param name="constructorId">The unregistered constructor id.</param>
    public TlDeserializeException(uint constructorId)
        : this(constructorId, offset: -1, typePath: null)
    {
    }

    /// <summary>Creates the exception with the id, its byte offset, and a parent-type breadcrumb.</summary>
    /// <param name="constructorId">The unregistered constructor id.</param>
    /// <param name="offset">The byte offset the id was read at, or -1 if unknown.</param>
    /// <param name="typePath">Arrow-separated parent types the reader was inside, or null at top level.</param>
    public TlDeserializeException(uint constructorId, int offset, string? typePath)
        : base(BuildMessage(constructorId, offset, typePath))
    {
        ConstructorId = constructorId;
        Offset = offset;
        TypePath = typePath;
    }

    private static string BuildMessage(uint constructorId, int offset, string? typePath)
    {
        string message = $"No TL type registered for constructor id 0x{constructorId:X8} ({unchecked((int)constructorId)})";
        if (offset >= 0)
            message += $" at offset {offset}";
        if (!string.IsNullOrEmpty(typePath))
            message += $" while reading {typePath}";
        return message;
    }
}
