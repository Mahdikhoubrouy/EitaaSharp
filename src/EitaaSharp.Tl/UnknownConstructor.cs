namespace EitaaSharp.Tl;

/// <summary>
/// A boxed TL value whose constructor id has no registered factory, captured instead of
/// throwing when a reader is in tolerant top-level mode (see
/// <see cref="TlReader(byte[], TlRegistry?, bool)"/>).
/// <para>
/// TL deserialization is positional, so this can only be produced for the <b>top-level</b>
/// object of a response — where the unknown body is simply "the rest of the buffer" and no
/// later fields depend on it. A nested unknown constructor is unrecoverable and still throws.
/// The original id and raw body bytes are preserved so callers can log, inspect, or forward an
/// unmodeled response without losing data.
/// </para>
/// </summary>
/// <param name="Id">The unregistered constructor id read off the wire.</param>
/// <param name="RawBody">The object body bytes that followed the id (everything up to end of buffer).</param>
public sealed record UnknownConstructor(uint Id, byte[] RawBody) : ITlObject
{
    /// <summary>The unregistered constructor id (same as <see cref="Id"/>).</summary>
    public uint ConstructorId => Id;

    /// <summary>Re-emits the captured constructor id followed by the raw body verbatim.</summary>
    /// <param name="writer">The writer to emit into.</param>
    public void Serialize(TlWriter writer)
    {
        writer.WriteUInt32(Id);
        writer.WriteRawBytes(RawBody);
    }
}
