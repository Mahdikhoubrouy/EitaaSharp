// sync-clusters.js — completes the four reachable clusters (reactions, attach-menu / mini-app,
// web-view, Eitaa notifications) by splicing wire-correct params into scheme/api.json. Every field
// order/type below is hand-derived from the decompiled Android source (TLRPC.java readParams) and
// verified by tools/extract-tl/wire-audit.js. Matches entries by predicate; ids are never touched.
//
//   node tools/extract-tl/sync-clusters.js
//
// Idempotent: safe to re-run.

const fs = require('fs');
const path = require('path');
const apiPath = path.join(__dirname, '..', '..', 'scheme', 'api.json');
const api = JSON.parse(fs.readFileSync(apiPath, 'utf8'));

const byPredicate = (p) => api.constructors.find((c) => c.predicate === p);
const P = (name, type) => ({ name, type });

// --- 1) promote leaf constructors to proper abstract types so Vector<Leaf> resolves --------------
const retype = {
  reactionCount: 'ReactionCount',
  messageUserReaction: 'MessageUserReaction',
  attachMenuBotIcon: 'AttachMenuBotIcon',
  attachMenuBotIconColor: 'AttachMenuBotIconColor',
  EitaaNotification_message: 'EitaaNotification_message',
};
for (const [pred, type] of Object.entries(retype)) {
  const c = byPredicate(pred);
  if (!c) throw new Error(`expected constructor ${pred} not found`);
  c.type = type;
}

// --- 2) corrected param lists (exact wire order from source readParams) ---------------------------
const params = {
  // reactions cluster
  messageReactions: [
    P('flags', '#'), P('min', 'flags.0?true'),
    P('results', 'Vector<ReactionCount>'),
  ],
  messageReactionsList: [
    P('flags', '#'), P('count', 'int'),
    P('reactions', 'Vector<MessageUserReaction>'),
    P('users', 'Vector<User>'),
    P('next_offset', 'flags.0?string'),
  ],
  // attach-menu / mini-app cluster
  attachMenuBot: [
    P('flags', '#'),
    P('inactive', 'flags.0?true'), P('has_settings', 'flags.1?true'),
    P('request_write_access', 'flags.2?true'), P('show_in_attach_menu', 'flags.3?true'),
    P('show_in_side_menu', 'flags.4?true'), P('side_menu_disclaimer_needed', 'flags.5?true'),
    P('bot_id', 'long'), P('short_name', 'string'),
    P('peer_types', 'Vector<AttachMenuPeerType>'),
    P('icons', 'Vector<AttachMenuBotIcon>'),
  ],
  attachMenuBotIcon: [
    P('flags', '#'), P('name', 'string'), P('icon', 'Document'),
    P('colors', 'flags.0?Vector<AttachMenuBotIconColor>'),
  ],
  attachMenuBots: [
    P('hash', 'long'),
    P('bots', 'Vector<AttachMenuBot>'),
    P('users', 'Vector<User>'),
  ],
  attachMenuBotsBot: [
    P('bot', 'AttachMenuBot'),
    P('users', 'Vector<User>'),
  ],
  // Eitaa notifications cluster
  updateEitaaNotification: [
    P('flags', '#'), P('id', 'int'), P('deleted', 'flags.0?true'),
    P('link', 'flags.1?string'), P('expireDate', 'int'),
    P('message', 'EitaaNotification_message'),
  ],
  EitaaNotification_message: [
    P('flags', '#'), P('title', 'string'), P('message', 'string'),
    P('entity', 'flags.0?Vector<MessageEntity>'),
    P('photo', 'flags.1?PhotoSize'),
    P('button', 'flags.2?Vector<EitaaNotification_button>'),
    P('banner', 'flags.3?PhotoSize'),
  ],
};
for (const [pred, list] of Object.entries(params)) {
  const c = byPredicate(pred);
  if (!c) throw new Error(`expected constructor ${pred} not found`);
  c.params = list;
}

// --- 3) add the one missing leaf: TL_EitaaNotification_button (id 1988797784) ---------------------
if (!byPredicate('EitaaNotification_button')) {
  api.constructors.push({
    id: 1988797784,
    predicate: 'EitaaNotification_button',
    params: [P('url', 'string'), P('buttonText', 'string')],
    type: 'EitaaNotification_button',
  });
}

fs.writeFileSync(apiPath, JSON.stringify(api, null, 2) + '\n');
console.log('sync-clusters: patched', Object.keys(params).length, 'constructors, retyped',
  Object.keys(retype).length, 'leaves, ensured EitaaNotification_button.');
