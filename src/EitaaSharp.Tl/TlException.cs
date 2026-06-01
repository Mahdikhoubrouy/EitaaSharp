namespace EitaaSharp.Tl;

/// <summary>Base type for errors raised by the TL engine.</summary>
public class TlException : Exception
{
    public TlException(string message) : base(message) { }
    public TlException(string message, Exception inner) : base(message, inner) { }
}

/// <summary>Thrown when a constructor id read off the wire has no registered factory.</summary>
public sealed class TlDeserializeException : TlException
{
    public uint ConstructorId { get; }

    public TlDeserializeException(uint constructorId)
        : base($"No TL type registered for constructor id 0x{constructorId:X8} ({unchecked((int)constructorId)})")
    {
        ConstructorId = constructorId;
    }
}
