// Wire-signature audit: compares my schema's on-the-wire field layout for every type
// against the ACTUAL readParams body in the decompiled Android source (the source of truth).
// True-flags (presence bits, no bytes) are intentionally ignored — only byte-consuming fields
// are compared, in order, as category tokens (i/l/s/b/d/B/o/V), with `c` marking a flag-gated
// (conditional) field. A mismatch means a real wire difference (field added/removed/retyped).
//
//   node tools/extract-tl/wire-audit.js [name1 name2 ...]   # audit all, or only the named types

const fs = require('fs');
const path = require('path');
const a = require(path.join(__dirname, '..', '..', 'scheme', 'api.json'));
const src = fs.readFileSync(path.join(__dirname, '..', '..',
  'eitaa-android-source', 'sources', 'ir', 'eitaa', 'tgnet', 'TLRPC.java'), 'utf8');
const toSigned = (n) => { n = Number(n) >>> 0; return (n & 0x80000000) ? n - 0x100000000 : n; };

// ---- my-schema param list -> wire token sequence -------------------------------------------
function wireFromParams(params) {
  const out = [];
  for (const p of params || []) {
    let t = p.type;
    if (t === '#') { out.push('F'); continue; }
    const mm = t.match(/^[A-Za-z_]\w*\.(\d+)\?(.+)$/);
    const cond = !!mm;
    if (mm) t = mm[2];
    if (t === 'true') continue; // presence-only, no bytes
    let tok;
    if (/^Vector</.test(t) || /^%?Vector$/.test(t)) tok = 'V';
    else if (t === 'int' || t === '#') tok = 'i';
    else if (t === 'long') tok = 'l';
    else if (t === 'string') tok = 's';
    else if (t === 'bytes') tok = 'b';
    else if (t === 'double') tok = 'd';
    else if (t === 'Bool') tok = 'B';
    else tok = 'o';
    out.push((cond ? 'c' : '') + tok);
  }
  return out.join(' ');
}

// ---- android readParams body -> wire token sequence ----------------------------------------
function wireFromRead(body) {
  if (body == null) return null;

  // conditional intervals: any `if ((<expr with &>) != 0) {  ... }` (flag-gated read block)
  const condIntervals = [];
  const reIf = /if \(\([^()]*&[^()]*\) != 0\) \{/g;
  let mi;
  while ((mi = reIf.exec(body))) {
    const start = mi.index + mi[0].length;
    let d = 1, p = start;
    for (; p < body.length; p++) { if (body[p] === '{') d++; else if (body[p] === '}') { d--; if (d === 0) break; } }
    condIntervals.push([start, p]);
  }
  const inCond = (i) => condIntervals.some(([s, e]) => i >= s && i < e);

  // vector blocks: from just before the Vector magic (to catch the `int322 = readInt32` magic
  // read) through the end of the `.add(...)` statement (suppress count + element reads).
  const vecRanges = [];
  let vm; const reVec = /481674261/g;
  while ((vm = reVec.exec(body))) {
    const s = vm.index - 70;
    const addI = body.indexOf('.add(', vm.index);
    const e = addI >= 0 ? body.indexOf(';', addI) : vm.index + 1;
    vecRanges.push([s, e]);
  }
  const inVec = (i) => vecRanges.some(([s, e]) => i >= s && i <= e);

  // boxed-read blocks: the constructor-id arg inside `X.TLdeserialize(data, data.readInt32(z), z)`
  // is NOT a separate wire field — suppress readInt32 that fall inside a `.TLdeserialize(` call.
  const boxRanges = [];
  let bm; const reBox = /\.TLdeserialize\(/g;
  while ((bm = reBox.exec(body))) {
    let d = 1, p = bm.index + bm[0].length;
    for (; p < body.length; p++) { if (body[p] === '(') d++; else if (body[p] === ')') { d--; if (d === 0) break; } }
    boxRanges.push([bm.index + bm[0].length, p]);
  }
  const inBox = (i) => boxRanges.some(([s, e]) => i >= s && i < e);

  const ev = [];
  const reAll = /readInt64|readByteArray|readByteBuffer|readString|readDouble|readBool|readInt32|\.TLdeserialize|481674261/g;
  let m;
  while ((m = reAll.exec(body))) {
    const i = m.index, t = m[0];
    if (t === '481674261') { ev.push([i, (inCond(i) ? 'c' : '') + 'V']); continue; }
    if (inVec(i)) continue;           // count / element read inside a vector loop
    if (t === 'readInt32' && inBox(i)) continue; // constructor-id arg of a boxed read
    let tok;
    if (t === 'readInt64') tok = 'l';
    else if (t === 'readByteArray' || t === 'readByteBuffer') tok = 'b';
    else if (t === 'readString') tok = 's';
    else if (t === 'readDouble') tok = 'd';
    else if (t === 'readBool') tok = 'B';
    else if (t === '.TLdeserialize') tok = 'o';
    else { // readInt32 — is it a flags field?
      const before = body.slice(Math.max(0, i - 70), i);
      const after = body.slice(i, i + 90);
      const isFlags = /this\.(flags?|eFlags)\s*=\s*(?:abstractSerializedData\.)?$/.test(before) ||
                      /readInt32\(z\);\s*this\.(flags?|eFlags)\s*=\s*int32/.test(after);
      tok = isFlags ? 'F' : 'i';
    }
    ev.push([i, (inCond(i) ? 'c' : '') + tok]);
  }
  return ev.map((e) => e[1]).join(' ');
}

// ---- index android readParams by id --------------------------------------------------------
const aRead = {};
const re = /public static class (TL_[A-Za-z0-9_]+) extends ([A-Za-z0-9_.]+)\s*\{([\s\S]*?)\n    \}/g;
let mm;
while ((mm = re.exec(src))) {
  if (/_layer\d+$/.test(mm[1])) continue;
  const cm = mm[3].match(/constructor = (-?[0-9]+);/);
  if (!cm) continue;
  const id = toSigned(cm[1]);
  const k = mm[3].indexOf('readParams');
  if (k < 0) { if (!(id in aRead)) aRead[id] = null; continue; }
  let j = mm[3].indexOf('{', k), d = 0, p = j;
  for (; p < mm[3].length; p++) { if (mm[3][p] === '{') d++; else if (mm[3][p] === '}') { d--; if (d === 0) break; } }
  aRead[id] = mm[3].slice(j + 1, p);
}

const only = process.argv.slice(2);
let checked = 0; const mism = [];
for (const c of a.constructors) {
  if (only.length && !only.includes(c.predicate)) continue;
  const id = toSigned(c.id);
  if (!(id in aRead) || aRead[id] == null) continue;
  checked++;
  const aw = wireFromRead(aRead[id]);
  const mw = wireFromParams(c.params);
  if (aw !== mw) mism.push({ name: c.predicate, id, source: aw, mine: mw });
}

console.log(`checked ${checked} constructors against source readParams; mismatches: ${mism.length}`);
fs.writeFileSync(path.join(require('os').homedir(), 'wirediff.json'), JSON.stringify(mism, null, 1));
if (only.length) for (const x of mism) console.log(`\n[${x.name}] id=${x.id}\n  source: ${x.source}\n  mine  : ${x.mine}`);
