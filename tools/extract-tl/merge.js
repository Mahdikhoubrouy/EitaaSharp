// Merges the entries extracted from the Android client (scheme/_android_extracted.json) that are
// missing from scheme/api.json (+ mtproto.json) into scheme/api.json — by constructor id, so the
// verified existing entries are never touched. Skips old `_layerNN` method variants.
//
// New entries' boxed param/return types are normalized to the schema's existing abstract-type
// names (e.g. dataJSON -> DataJSON); types with no matching constructor fall back to `Object`
// (-> ITlObject). This avoids duplicate / orphan generated interfaces.
//
//   node tools/extract-tl/merge.js

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const apiPath = path.join(ROOT, 'scheme', 'api.json');
const api = require(apiPath);
const mt = require(path.join(ROOT, 'scheme', 'mtproto.json'));
const ex = require(path.join(ROOT, 'scheme', '_android_extracted.json'));

const toSigned = (n) => { n = Number(n) >>> 0; return (n & 0x80000000) ? n - 0x100000000 : n; };
const isOld = (name) => /_layer\d+$/.test(name || '');
const up = (s) => s ? s[0].toUpperCase() + s.slice(1) : s;

const PRIM = new Set(['int', 'long', 'double', 'string', 'bytes', 'Bool', 'true', '#', 'int128', 'int256', 'X', '!X', 'Object', 'Vector']);

// canonical abstract-type names = every constructor `type`, keyed by its PascalCase form.
// Existing schema wins (added first, never overwritten) so new entries align to it.
const canon = new Map();
const addCanon = (t) => { if (t && !PRIM.has(t) && !canon.has(up(t))) canon.set(up(t), t); };
for (const c of [...api.constructors, ...mt.constructors]) addCanon(c.type);
for (const c of ex.constructors) if (!isOld(c.predicate)) addCanon(c.type);

// A constructor's own `type` must stay a real abstract type — canonicalize casing, keep if unknown.
const normCtorType = (t) => canon.get(up(t)) || t;

// A param/return boxed type canonicalizes to an existing abstract type, or falls back to Object.
function normType(t) {
  if (!t || PRIM.has(t) || t === '#') return t;
  let m;
  if ((m = t.match(/^(flags\d*\.\d+\?)(.+)$/))) return m[1] + normType(m[2]);
  if ((m = t.match(/^%?Vector<(.+)>$/i))) return 'Vector<' + normType(m[1]) + '>';
  const k = up(t);
  return canon.has(k) ? canon.get(k) : 'Object';
}
const normParams = (ps) => (ps || []).map((p) => ({ name: p.name, type: normType(p.type) }));

const have = new Set();
for (const x of [...api.constructors, ...api.methods, ...mt.constructors, ...mt.methods]) have.add(toSigned(x.id));

let addedC = 0, addedM = 0;
for (const c of ex.constructors) {
  if (have.has(toSigned(c.id)) || isOld(c.predicate)) continue;
  api.constructors.push({ id: c.id, predicate: c.predicate, params: normParams(c.params), type: normCtorType(c.type) });
  have.add(toSigned(c.id)); addedC++;
}
for (const m of ex.methods) {
  if (have.has(toSigned(m.id)) || isOld(m.method)) continue;
  api.methods.push({ id: m.id, method: m.method, params: normParams(m.params), type: normType(m.type) });
  have.add(toSigned(m.id)); addedM++;
}

fs.writeFileSync(apiPath, JSON.stringify(api, null, 2) + '\n');
console.log(`merged into scheme/api.json: +${addedC} constructors, +${addedM} methods`);
console.log(`api.json now: ${api.constructors.length} constructors, ${api.methods.length} methods`);
