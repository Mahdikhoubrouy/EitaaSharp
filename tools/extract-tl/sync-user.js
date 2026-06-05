// The Eitaa layer-137 server actually sends the `TL_user_layer135` constructor
// (id -321753653 / 0xECD26DCB) for users — NOT the unsuffixed `TL_user`. The earlier
// merge skipped every `_layerNN` class, so that id was unregistered and deserializing a
// real update threw "No TL type registered for constructor id 0xECD26DCB".
//
// This makes the layer-135 definition the canonical `user` (so the generated `User`
// record — which the high-level layer maps — matches what the wire carries) and keeps the
// previous unsuffixed `user` registered under a distinct predicate as a parse-safety net.
//
// `user` carries THREE bitmask fields (`flags`, `flags2`, `eFlags`); the generator handles
// arbitrarily-named `#` flag fields. Hand-derived from TL_user_layer135.readParams.
//
//   node tools/extract-tl/sync-user.js

const fs = require('fs');
const path = require('path');
const apiPath = path.join(__dirname, '..', '..', 'scheme', 'api.json');
const api = require(apiPath);
const p = (name, type) => ({ name, type });

const USER_137 = [
  p('flags', '#'), p('flags2', '#'), p('eFlags', '#'),
  // flags presence bits
  p('self', 'flags.10?true'), p('contact', 'flags.11?true'), p('mutual_contact', 'flags.12?true'),
  p('deleted', 'flags.13?true'), p('bot', 'flags.14?true'), p('bot_chat_history', 'flags.15?true'),
  p('bot_nochats', 'flags.16?true'), p('verified', 'flags.17?true'), p('restricted', 'flags.18?true'),
  p('min', 'flags.20?true'), p('bot_inline_geo', 'flags.21?true'), p('support', 'flags.23?true'),
  p('trusty', 'flags.24?true'), p('apply_min_photo', 'flags.25?true'), p('fake', 'flags.26?true'),
  p('MXB_VIRTUAL_USER', 'flags.9?true'), p('MXB_REGISTERED_USER', 'flags.8?true'),
  // eFlags presence bits
  p('miniApp', 'eFlags.0?true'), p('badge_red_color', 'eFlags.2?true'), p('miniAppGeo', 'eFlags.4?true'),
  // body
  p('id', 'long'),
  p('access_hash', 'flags.0?long'),
  p('first_name', 'flags.1?string'),
  p('last_name', 'flags.2?string'),
  p('username', 'flags.3?string'),
  p('phone', 'flags.4?string'),
  p('photo', 'flags.5?UserProfilePhoto'),
  p('status', 'flags.6?UserStatus'),
  p('bot_info_version', 'flags.14?int'),
  p('restriction_reason', 'flags.18?Vector<RestrictionReason>'),
  p('bot_inline_placeholder', 'flags.19?string'),
  p('lang_code', 'flags.22?string'),
  p('badge_name', 'eFlags.1?string'),
  p('bot_active_users', 'flags2.12?int'),
];

const userIdx = api.constructors.findIndex((c) => c.predicate === 'user');
if (userIdx < 0) throw new Error('no `user` constructor in api.json');

const previous = api.constructors[userIdx]; // unsuffixed TL_user (id 1073147056)

// Canonical `user` = the layer-135 wire format the server sends.
api.constructors[userIdx] = { id: -321753653, predicate: 'user', params: USER_137, type: 'User' };

// Keep the previous one registered (distinct predicate) so it still parses if ever sent.
if (Number(previous.id) !== -321753653 && !api.constructors.some((c) => c.predicate === 'userWeb')) {
  api.constructors.push({ id: previous.id, predicate: 'userWeb', params: previous.params, type: 'User' });
}

fs.writeFileSync(apiPath, JSON.stringify(api, null, 2) + '\n');
console.log(`user -> id -321753653 (TL_user_layer135), ${USER_137.length} params; previous kept as \`userWeb\` (id ${previous.id}).`);
