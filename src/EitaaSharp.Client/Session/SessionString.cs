using System.Text;

namespace EitaaSharp.Client.Session;

/// <summary>
/// Serializes a <see cref="SessionData"/> snapshot to a compact, portable Base64 <b>session string</b>
/// and back — the Eitaa equivalent of Pyrogram's session string. A session string is much shorter and
/// more portable than the JSON session file, so it can live in a database row, an environment variable,
/// or a secret store, and lets any number of independent sessions run in one process with no file on disk.
/// <para>
/// <b>Security:</b> a session string is a bearer credential — it contains the account
/// <see cref="SessionData.Token"/>. Store it in a secret store or an encrypted column, never in logs.
/// </para>
/// <para>
/// Binary layout (little-endian, length-prefixed via <see cref="BinaryWriter"/>): magic <c>"ESS"</c> ·
/// <c>version:byte</c> · <c>imei:string</c> · <c>token?</c> · <c>phoneNumber?</c> · <c>phoneCodeHash?</c> ·
/// <c>peerCount:7-bit-int</c> · <c>peers[]{ id:long, hash:long, type:byte }</c>. The <c>version</c> byte
/// makes bad/old strings fail fast and lets the format evolve by appending; unknown trailing bytes are
/// ignored on read.
/// </para>
/// </summary>
public static class SessionString
{
    private static readonly byte[] Magic = "ESS"u8.ToArray();

    /// <summary>The current on-wire format version.</summary>
    private const byte CurrentVersion = 1;

    // Sentinel written for a peer whose kind was never learned (PeerEntry.Type == null).
    private const byte UnknownPeerType = 0xFF;

    /// <summary>Serializes a session snapshot to a Base64 session string.</summary>
    /// <param name="data">The session state to encode.</param>
    /// <param name="includePeers">
    /// When <c>true</c> (the default), the learned peer-access-hash cache is included. Pass <c>false</c>
    /// for a minimal token-only string (the cache is rebuildable from updates/dialogs).
    /// </param>
    /// <returns>A Base64 string that <see cref="Deserialize"/> reads back into an equivalent snapshot.</returns>
    public static string Serialize(SessionData data, bool includePeers = true)
    {
        ArgumentNullException.ThrowIfNull(data);

        using var buffer = new MemoryStream();
        using (var w = new BinaryWriter(buffer, Encoding.UTF8, leaveOpen: true))
        {
            w.Write(Magic);
            w.Write(CurrentVersion);
            w.Write(data.Imei ?? string.Empty);
            WriteOptional(w, data.Token);
            WriteOptional(w, data.PhoneNumber);
            WriteOptional(w, data.PhoneCodeHash);

            if (includePeers && data.Peers is { Count: > 0 })
            {
                w.Write7BitEncodedInt(data.Peers.Count);
                foreach (var (id, entry) in data.Peers)
                {
                    w.Write(id);
                    w.Write(entry.Hash);
                    w.Write(entry.Type is { } t ? (byte)t : UnknownPeerType);
                }
            }
            else
            {
                w.Write7BitEncodedInt(0);
            }
        }

        return Convert.ToBase64String(buffer.ToArray());
    }

    /// <summary>Reads a Base64 session string produced by <see cref="Serialize"/> back into a snapshot.</summary>
    /// <param name="session">The Base64 session string.</param>
    /// <returns>The decoded session state.</returns>
    /// <exception cref="FormatException">The string is not valid Base64, is truncated, or lacks the Eitaa header.</exception>
    public static SessionData Deserialize(string session)
    {
        if (string.IsNullOrWhiteSpace(session))
            throw new FormatException("Session string is empty.");

        byte[] bytes;
        try
        {
            bytes = Convert.FromBase64String(session.Trim());
        }
        catch (FormatException ex)
        {
            throw new FormatException("Session string is not valid Base64.", ex);
        }

        try
        {
            using var buffer = new MemoryStream(bytes, writable: false);
            using var r = new BinaryReader(buffer, Encoding.UTF8, leaveOpen: true);

            var magic = r.ReadBytes(Magic.Length);
            if (magic.Length != Magic.Length || !magic.AsSpan().SequenceEqual(Magic))
                throw new FormatException("Session string is missing the Eitaa \"ESS\" header.");

            byte version = r.ReadByte();
            if (version < 1)
                throw new FormatException($"Unsupported session-string version {version}.");
            // Any version >= 1 shares the v1 core layout; newer fields (if any) are appended and ignored here.

            var data = new SessionData
            {
                Imei = r.ReadString(),
                Token = ReadOptional(r),
                PhoneNumber = ReadOptional(r),
                PhoneCodeHash = ReadOptional(r),
            };

            int peerCount = r.Read7BitEncodedInt();
            if (peerCount < 0)
                throw new FormatException("Session string has a negative peer count.");
            for (int i = 0; i < peerCount; i++)
            {
                long id = r.ReadInt64();
                long hash = r.ReadInt64();
                byte type = r.ReadByte();
                data.Peers[id] = new PeerEntry
                {
                    Hash = hash,
                    Type = type == UnknownPeerType ? null : (PeerType)type,
                };
            }

            return data;
        }
        catch (EndOfStreamException ex)
        {
            throw new FormatException("Session string is truncated.", ex);
        }
    }

    private static void WriteOptional(BinaryWriter w, string? value)
    {
        w.Write(value is not null);
        if (value is not null)
            w.Write(value);
    }

    private static string? ReadOptional(BinaryReader r) => r.ReadBoolean() ? r.ReadString() : null;
}
