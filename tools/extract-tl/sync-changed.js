// Replaces the 15 TL entries that CHANGED between layer 133 and 137 (same name, new
// constructor id => fields were added/changed) with their exact layer-137 definitions,
// hand-derived from eitaa-android-source/.../TLRPC.java (serializeToStream / readParams).
//
// All old/legacy variants of these names are removed and exactly one correct 137 entry
// is inserted, so the generated C# record (e.g. Channel) matches the wire shape the
// server actually sends at layer 137.
//
//   node tools/extract-tl/sync-changed.js
//
// NOTE: Eitaa's `channel` carries a SECOND bitmask `eFlags` after `flags` (custom Eitaa
// fields: trusty/fake/shop/sponsoredMessage/badge_red_color/badge_name). The generator
// supports arbitrarily-named `#` flag fields, so `eFlags.N?` works like `flags.N?`.

const fs = require('fs');
const path = require('path');
const apiPath = path.join(__dirname, '..', '..', 'scheme', 'api.json');
const api = require(apiPath);

const p = (name, type) => ({ name, type });

const CONSTRUCTORS = [
  { id: 476978193, predicate: 'chatPhoto', type: 'ChatPhoto', params: [
    p('flags', '#'), p('has_video', 'flags.0?true'), p('photo_id', 'long'),
    p('stripped_thumb', 'flags.1?bytes'), p('dc_id', 'int') ] },

  { id: -2100168954, predicate: 'userProfilePhoto', type: 'UserProfilePhoto', params: [
    p('flags', '#'), p('has_video', 'flags.0?true'), p('photo_id', 'long'),
    p('stripped_thumb', 'flags.1?bytes'), p('dc_id', 'int') ] },

  { id: 630664139, predicate: 'sendMessageEmojiInteraction', type: 'SendMessageAction', params: [
    p('emoticon', 'string'), p('msg_id', 'int'), p('interaction', 'DataJSON') ] },

  { id: -328632012, predicate: 'messageMediaLiveStream', type: 'MessageMedia', params: [
    p('flags', '#'), p('from_self', 'flags.1?true'), p('id', 'long'), p('access_hash', 'long'),
    p('total_viewers', 'flags.0?int'), p('state', 'LiveStreamState'),
    p('thumbs', 'flags.2?Vector<PhotoSize>'), p('geo', 'flags.3?GeoPoint') ] },

  { id: -206066487, predicate: 'inputGeoPoint', type: 'InputGeoPoint', params: [
    p('lat', 'double'), p('long', 'double') ] },

  { id: -1892676777, predicate: 'botInfo', type: 'BotInfo', params: [
    p('flags', '#'), p('user_id', 'flags.0?long'), p('description', 'flags.1?string'),
    p('description_photo', 'flags.4?Photo'), p('description_document', 'flags.5?Document'),
    p('commands', 'flags.2?Vector<BotCommand>'), p('menu_button', 'flags.3?BotMenuButton') ] },

  { id: 524838915, predicate: 'exportedMessageLink', type: 'ExportedMessageLink', params: [
    p('link', 'string') ] },

  // Eitaa channel: flags + a second bitmask eFlags. Derived from TL_channel.serializeToStream.
  { id: -959364334, predicate: 'channel', type: 'Chat', params: [
    p('flags', '#'),
    p('creator', 'flags.0?true'), p('left', 'flags.2?true'), p('broadcast', 'flags.5?true'),
    p('verified', 'flags.7?true'), p('megagroup', 'flags.8?true'), p('restricted', 'flags.9?true'),
    p('signatures', 'flags.11?true'), p('min', 'flags.12?true'), p('has_link', 'flags.20?true'),
    p('has_geo', 'flags.21?true'), p('slowmode_enabled', 'flags.22?true'),
    p('call_active', 'flags.23?true'), p('call_not_empty', 'flags.24?true'),
    p('gigagroup', 'flags.26?true'), p('noforwards', 'flags.27?true'),
    p('eFlags', '#'),
    p('trusty', 'eFlags.0?true'), p('fake', 'eFlags.1?true'), p('shop', 'eFlags.2?true'),
    p('sponsoredMessage', 'eFlags.3?true'), p('badge_red_color', 'eFlags.5?true'),
    p('id', 'long'),
    p('access_hash', 'flags.13?long'),
    p('title', 'string'),
    p('username', 'flags.6?string'),
    p('photo', 'ChatPhoto'),
    p('date', 'int'),
    p('restriction_reason', 'flags.9?Vector<RestrictionReason>'),
    p('admin_rights', 'flags.14?ChatAdminRights'),
    p('banned_rights', 'flags.15?ChatBannedRights'),
    p('default_banned_rights', 'flags.18?ChatBannedRights'),
    p('participants_count', 'flags.17?int'),
    p('live_stream_msg_id', 'flags.29?int'),
    p('badge_name', 'eFlags.4?string') ] },
];

const METHODS = [
  { id: 1109588596, method: 'messages.getMessages', type: 'messages.Messages', params: [
    p('id', 'Vector<int>') ] },

  { id: -1814580409, method: 'channels.getMessages', type: 'messages.Messages', params: [
    p('channel', 'InputChannel'), p('id', 'Vector<int>') ] },

  { id: -1366559620, method: 'messages.checkChatInvite', type: 'ChatInvite', params: [
    p('hash', 'string') ] },

  { id: 670809526, method: 'help.getAppConfig', type: 'JSONValue', params: [
    p('date', 'int') ] },

  { id: -1699363442, method: 'langpack.getLangPack', type: 'LangPackDifference', params: [
    p('lang_code', 'string') ] },

  { id: 773776152, method: 'langpack.getStrings', type: 'Vector<LangPackString>', params: [
    p('lang_code', 'string'), p('keys', 'Vector<string>') ] },

  { id: -2146445955, method: 'langpack.getLanguages', type: 'Vector<LangPackLanguage>', params: [] },
];

const cNames = new Set(CONSTRUCTORS.map((c) => c.predicate));
const mNames = new Set(METHODS.map((m) => m.method));

const cBefore = api.constructors.length, mBefore = api.methods.length;
api.constructors = api.constructors.filter((c) => !cNames.has(c.predicate)).concat(CONSTRUCTORS);
api.methods = api.methods.filter((m) => !mNames.has(m.method)).concat(METHODS);

fs.writeFileSync(apiPath, JSON.stringify(api, null, 2) + '\n');
console.log(`constructors: ${cBefore} -> ${api.constructors.length} (replaced ${cNames.size} names)`);
console.log(`methods:      ${mBefore} -> ${api.methods.length} (replaced ${mNames.size} names)`);
