// sync-core-variants.js — registers the _layerNN variants of CORE abstract types that the Eitaa
// server actually sends but the extractor skipped (verified against TLRPC.java, ids preserved).
// These surface as nested "No TL type registered" crashes on common operations; each is added as an
// additive leaf (existing constructors untouched), so golden-byte parity is preserved.
//
//   node tools/extract-tl/sync-core-variants.js
//
// Idempotent: safe to re-run.

const fs = require('fs');
const path = require('path');
const apiPath = path.join(__dirname, '..', '..', 'scheme', 'api.json');
const api = JSON.parse(fs.readFileSync(apiPath, 'utf8'));
const P = (name, type) => ({ name, type });

// TL_chatPhoto_layer126#d20b9f3c — the ChatPhoto the server returns inside Channel/Chat when resolving
// public channels (photo_small/photo_big:FileLocation instead of the newer stripped_thumb form).
const additions = [
  {
    id: -770990276,
    predicate: 'chatPhoto_layer126',
    type: 'ChatPhoto',
    params: [
      P('flags', '#'),
      P('has_video', 'flags.0?true'),
      P('photo_id', 'long'),
      P('photo_small', 'FileLocation'),
      P('photo_big', 'FileLocation'),
      P('dc_id', 'int'),
    ],
  },
];

let added = 0;
for (const a of additions) {
  if (api.constructors.some((c) => c.id === a.id)) continue;
  api.constructors.push(a);
  added++;
}

fs.writeFileSync(apiPath, JSON.stringify(api, null, 2) + '\n');
console.log('sync-core-variants: added', added, 'of', additions.length, 'core _layerNN variants.');
