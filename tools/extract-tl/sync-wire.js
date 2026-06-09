// Corrects the on-the-wire field layout of existing types whose Eitaa (layer-137) definition
// differs from the bundled schema, as found by tools/extract-tl/wire-audit.js. Each entry is
// hand-derived from the type's readParams body in the decompiled Android source. Only the
// `params` are replaced (the id and abstract `type` are preserved).
//
// Scope: high-value types whose every referenced abstract type already exists in the schema
// (login flow, replies, and a few Eitaa-specific types). The attach-menu / mini-app / ads
// cluster is intentionally NOT here — those need their leaf types (AttachMenuPeerType,
// Ads_ClickAction, EitaaNotification_button, …) added first.
//
//   node tools/extract-tl/sync-wire.js

const fs = require('fs');
const path = require('path');
const apiPath = path.join(__dirname, '..', '..', 'scheme', 'api.json');
const api = require(apiPath);
const p = (name, type) => ({ name, type });

// predicate -> corrected params (id + type preserved from the existing entry)
const FIX = {
  // auth.sentCode#5e002502 — Eitaa adds `message:flags.8?string` (the in-app activation-code text).
  'auth.sentCode': [
    p('flags', '#'), p('type', 'auth.SentCodeType'), p('phone_code_hash', 'string'),
    p('next_type', 'flags.1?auth.CodeType'), p('timeout', 'flags.2?int'),
    p('message', 'flags.8?string'),
  ],

  // auth.authorization — Eitaa layout: flags, token:string, tmp_sessions:flags.0?int, user:User.
  // (was missing tmp_sessions, which would desync `user` whenever flags.0 is set.)
  'auth.authorization': [
    p('flags', '#'), p('token', 'string'), p('tmp_sessions', 'flags.0?int'), p('user', 'User'),
  ],

  // inputReplyToMessage — adds quote_entities (flags.3) and quote_offset (flags.4).
  'inputReplyToMessage': [
    p('flags', '#'), p('reply_to_msg_id', 'int'), p('top_msg_id', 'flags.0?int'),
    p('reply_to_peer_id', 'flags.1?InputPeer'), p('quote_text', 'flags.2?string'),
    p('quote_entities', 'flags.3?Vector<MessageEntity>'), p('quote_offset', 'flags.4?int'),
  ],

  // businessLocation — geo_point is flags.0?GeoPoint (was unconditional).
  'businessLocation': [
    p('flags', '#'), p('geo_point', 'flags.0?GeoPoint'), p('address', 'string'),
  ],

  // mxbUserRegisterInfo (Eitaa) — accessHash is gated by flags.0 alongside user_id.
  'mxbUserRegisterInfo': [
    p('flags', '#'), p('nickname', 'string'), p('avatar', 'flags.1?int'),
    p('messenger_id', 'int'), p('phone', 'string'), p('mxb_user_id', 'int'),
    p('user_id', 'flags.0?int'), p('accessHash', 'flags.0?int'),
  ],

  // UserPayHash (Eitaa VOIP) — voip fields are gated by flag.0 / flag.1 (flags field is `flag`).
  'UserPayHash': [
    p('flag', '#'), p('hash', 'string'),
    p('voipHostName', 'flag.0?string'), p('voipPort', 'flag.0?int'),
    p('voipUserName', 'flag.1?string'), p('voipPassword', 'flag.1?string'),
  ],
};

let n = 0;
for (const c of api.constructors) {
  if (FIX[c.predicate]) { c.params = FIX[c.predicate]; n++; }
}
fs.writeFileSync(apiPath, JSON.stringify(api, null, 2) + '\n');
console.log(`patched ${n}/${Object.keys(FIX).length} constructor wire layouts`);
