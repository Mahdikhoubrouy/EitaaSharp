using Schema = EitaaSharp.Schema;

namespace EitaaSharp.Client;

/// <summary>An activity shown to the other side of a chat (the "typing…" indicator and friends).</summary>
public enum ChatAction
{
    Typing,
    Cancel,
    UploadPhoto,
    RecordVideo,
    UploadVideo,
    RecordAudio,
    UploadAudio,
    UploadDocument,
    FindLocation,
    ChooseContact,
    Playing,
}

internal static class ChatActionMap
{
    public static Schema.ISendMessageAction ToTl(this ChatAction action) => action switch
    {
        ChatAction.Typing => new Schema.SendMessageTypingAction(),
        ChatAction.Cancel => new Schema.SendMessageCancelAction(),
        ChatAction.UploadPhoto => new Schema.SendMessageUploadPhotoAction { Progress = 0 },
        ChatAction.RecordVideo => new Schema.SendMessageRecordVideoAction(),
        ChatAction.UploadVideo => new Schema.SendMessageUploadVideoAction { Progress = 0 },
        ChatAction.RecordAudio => new Schema.SendMessageRecordAudioAction(),
        ChatAction.UploadAudio => new Schema.SendMessageUploadAudioAction { Progress = 0 },
        ChatAction.UploadDocument => new Schema.SendMessageUploadDocumentAction { Progress = 0 },
        ChatAction.FindLocation => new Schema.SendMessageGeoLocationAction(),
        ChatAction.ChooseContact => new Schema.SendMessageChooseContactAction(),
        ChatAction.Playing => new Schema.SendMessageGamePlayAction(),
        _ => new Schema.SendMessageTypingAction(),
    };
}
