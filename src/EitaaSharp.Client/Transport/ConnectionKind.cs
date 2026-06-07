namespace EitaaSharp.Client.Transport;

/// <summary>
/// Which datacenter connection a request belongs to. The official Eitaa client routes each kind to
/// a dedicated group of datacenter-1 hosts (see <see cref="HttpEitaaTransport.DefaultHosts"/>): media
/// uploads and downloads go to separate hosts from ordinary API calls.
/// </summary>
public enum ConnectionKind
{
    /// <summary>Ordinary API calls (messages, updates, …). Android's connectionType 0 / flag-0 hosts.</summary>
    Generic = 0,

    /// <summary>File downloads (<c>upload.getFile</c>). Android's connectionType 2 / flag-2 hosts.</summary>
    Download = 2,

    /// <summary>File uploads (<c>upload.saveFilePart</c> / <c>saveBigFilePart</c>). Android's connectionType 4 / flag-4 hosts.</summary>
    Upload = 4,
}
