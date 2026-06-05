// Extracts the TL schema from the decompiled Eitaa Android client (TLRPC.java) into the
// api.json / mtproto.json shape used by tools/EitaaSharp.SchemaGen.
//
//   node tools/extract-tl/extract.js validate              # compare vs existing scheme/*.json
//   node tools/extract-tl/extract.js write <out.json>      # write extracted schema (api shape)
//
// Strategy: field declarations give the complete typed field set (incl. vectors); readParams
// (types) / serializeToStream (methods) give the on-wire order and the flag gating.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const TLRPC = path.join(ROOT, 'eitaa-android-source', 'sources', 'ir', 'eitaa', 'tgnet', 'TLRPC.java');

const NS = new Set([
  'auth', 'account', 'messages', 'channels', 'contacts', 'help', 'updates', 'photos', 'upload',
  'users', 'bots', 'payments', 'phone', 'stats', 'stickers', 'folders', 'langpack', 'chatlists',
  'stories', 'premium', 'smsjobs', 'fragment',
]);

const toSigned = (n) => { n = Number(n) >>> 0; return (n & 0x80000000) ? n - 0x100000000 : n; };
const log2 = (n) => Math.round(Math.log2(n));

function predicateName(cls) {
  let n = cls.replace(/^TL_/, '');
  const i = n.indexOf('_');
  if (i > 0 && NS.has(n.slice(0, i))) return n.slice(0, i) + '.' + n.slice(i + 1);
  return n;
}

function abstractOf(base) {
  const i = base.indexOf('_');
  if (i > 0 && NS.has(base.slice(0, i).toLowerCase())) return base.slice(0, i) + '.' + base.slice(i + 1);
  return base.replace(/^TLRPC\./, '');
}

const SCALAR = { Integer: 'int', int: 'int', Long: 'long', long: 'long', String: 'string', Boolean: 'Bool', boolean: 'Bool', Double: 'double', double: 'double' };

function elemType(j) {
  j = j.trim();
  if (SCALAR[j]) return SCALAR[j];
  return j.replace(/^TLRPC\./, '').replace(/^TL_/, '');
}

// Java field type -> TL category. 'boolean' is a true-flag marker handled later.
function fieldType(javaType) {
  javaType = javaType.trim();
  let m;
  if ((m = javaType.match(/^ArrayList<(.+)>$/))) return 'Vector<' + elemType(m[1]) + '>';
  if ((m = javaType.match(/^(.+)\[\]$/))) {
    if (m[1] === 'byte') return 'bytes';
    return 'Vector<' + elemType(m[1]) + '>';
  }
  switch (javaType) {
    case 'int': return 'int';
    case 'long': return 'long';
    case 'String': return 'string';
    case 'boolean': return 'true';
    case 'double': return 'double';
    case 'NativeByteBuffer': return 'bytes';
    default: return javaType.replace(/^TLRPC\./, '').replace(/^TL_/, '');
  }
}

const RTYPE = { Int32: 'int', Int64: 'long', String: 'string', Bool: 'Bool', Bytes: 'bytes', Double: 'double' };
const wrap = (flag, type) => (flag ? `${flag.flags}.${flag.bit}?${type}` : type);
const strip = (t) => t.replace(/^TLRPC\./, '').replace(/^TL_/, '');
const add = (out, seen, name, type) => { if (!seen.has(name)) { seen.add(name); out.push({ name, type }); } };

// Extract params from a readParams body (types are inferred directly from the read calls,
// because jadx emits no field declarations).
function parseTypeParams(body) {
  const lines = body.split('\n');
  const out = [], seen = new Set();
  let flag = null;
  for (const line of lines) {
    let m;
    if ((m = line.match(/this\.(flags\d*)\s*=\s*(?:\w+\.readInt32|int32)/))) { add(out, seen, m[1], '#'); continue; }
    if ((m = line.match(/this\.(\w+)\s*=\s*\(\s*\w+\s*&\s*(\d+)\s*\)\s*!=\s*0/))) { add(out, seen, m[1], `flags.${log2(+m[2])}?true`); continue; }
    if ((m = line.match(/if\s*\(\(\s*this\.(flags\d*)\s*&\s*(\d+)\s*\)/))) { flag = { flags: m[1], bit: log2(+m[2]) }; continue; }
    if ((m = line.match(/this\.(\w+)\.add\(\s*([A-Za-z0-9_]+)\.TLdeserialize/))) { add(out, seen, m[1], wrap(flag, `Vector<${strip(m[2])}>`)); flag = null; continue; }
    if ((m = line.match(/this\.(\w+)\.add\(\s*(Integer|Long|Boolean|Double)/))) { const t = { Integer: 'int', Long: 'long', Boolean: 'Bool', Double: 'double' }[m[2]]; add(out, seen, m[1], wrap(flag, `Vector<${t}>`)); flag = null; continue; }
    if ((m = line.match(/this\.(\w+)\.add\(\s*\w+\.readString/))) { add(out, seen, m[1], wrap(flag, 'Vector<string>')); flag = null; continue; }
    if ((m = line.match(/this\.(\w+)\s*=\s*([A-Za-z0-9_]+)\.TLdeserialize/))) { add(out, seen, m[1], wrap(flag, strip(m[2]))); flag = null; continue; }
    if ((m = line.match(/this\.(\w+)\s*=\s*\w+\.read(Int32|Int64|String|Bool|Bytes|Double)/))) {
      if (/^flags\d*$/.test(m[1])) { add(out, seen, m[1], '#'); continue; }
      add(out, seen, m[1], wrap(flag, RTYPE[m[2]])); flag = null; continue;
    }
  }
  return out;
}

// Extract params from a serializeToStream body (methods have no readParams). Boxed param types
// are not recoverable from the write side, so they fall back to a generic boxed type.
function parseMethodParams(body) {
  const lines = body.split('\n');
  const out = [], seen = new Set();
  let flag = null, flagsEmitted = false;
  for (const line of lines) {
    let m;
    if (/write(Int32|Int64)\s*\(\s*constructor/.test(line)) continue;
    // true-flag compute: this.<x> ? this.flags | N
    if ((m = line.match(/this\.(\w+)\s*\?\s*this\.flags\d*\s*\|\s*(\d+)/))) {
      if (!flagsEmitted) { add(out, seen, 'flags', '#'); flagsEmitted = true; }
      add(out, seen, m[1], `flags.${log2(+m[2])}?true`); continue;
    }
    if ((m = line.match(/if\s*\(\(\s*this\.(flags\d*)\s*&\s*(\d+)\s*\)/))) { flag = { flags: m[1], bit: log2(+m[2]) }; continue; }
    if ((m = line.match(/\.write(Int32|Int64|String|Bool|Bytes|Double)\s*\(\s*this\.(\w+)\s*\)/))) {
      const [, w, name] = m;
      if (/^flags\d*$/.test(name)) { add(out, seen, name, '#'); flagsEmitted = true; continue; }
      add(out, seen, name, wrap(flag, RTYPE[{ Int32: 'Int32', Int64: 'Int64', String: 'String', Bool: 'Bool', Bytes: 'Bytes', Double: 'Double' }[w]])); flag = null; continue;
    }
    if ((m = line.match(/this\.(\w+)\.serializeToStream/))) { add(out, seen, m[1], wrap(flag, 'Object')); flag = null; continue; }
    // vector write: this.<name>.get(i)... — record as Vector<Object>
    if ((m = line.match(/this\.(\w+)\.get\(/)) || (m = line.match(/this\.(\w+)\.size\(\)/))) { add(out, seen, m[1], wrap(flag, 'Vector<Object>')); flag = null; continue; }
  }
  return out;
}

// Returns the body of a method definition (matched by a regex on its signature),
// up to its closing brace (a method closes at 8-space indent: "\n        }").
function methodBody(body, sigRe) {
  const m = body.match(sigRe);
  if (!m) return '';
  const rest = body.slice(m.index);
  const end = rest.indexOf('\n        }');
  return end < 0 ? rest : rest.slice(0, end);
}

function methodReturnType(body, classByName) {
  const ds = methodBody(body, /public\s+TLObject\s+deserializeResponse\s*\(/);
  let m = ds.match(/return\s+([A-Za-z0-9_]+)\.TLdeserialize/);
  if (m) { const c = classByName.get(m[1]); return c ? abstractOf(c.base) : abstractOf(m[1]); }
  if (/Vector/.test(ds)) {
    const em = ds.match(/=\s*([A-Za-z0-9_]+)\.TLdeserialize/);
    return 'Vector<' + (em ? elemType(em[1]) : 'Object') + '>';
  }
  if (/Bool\b/.test(ds)) return 'Bool';
  return 'Object';
}

function parseAll() {
  const src = fs.readFileSync(TLRPC, 'utf8');
  const re = /public static class (TL_[A-Za-z0-9_]+) extends ([A-Za-z0-9_.]+)\s*\{([\s\S]*?)\n    \}/g;
  const classByName = new Map();
  const entries = [];
  let m;
  while ((m = re.exec(src))) {
    const [, name, base, body] = m;
    const cm = body.match(/constructor\s*=\s*(-?\d+);/);
    if (!cm) continue;
    const e = { name, base, body, id: toSigned(cm[1]), isMethod: /deserializeResponse/.test(body) };
    classByName.set(name, e);
    entries.push(e);
  }
  return { entries, classByName };
}

function build() {
  const { entries, classByName } = parseAll();
  const out = [];
  const seen = new Set();
  for (const e of entries) {
    if (seen.has(e.id)) continue; seen.add(e.id);
    if (e.isMethod) {
      const ser = methodBody(e.body, /public\s+void\s+serializeToStream\s*\(/);
      out.push({ kind: 'method', id: e.id, method: predicateName(e.name), params: parseMethodParams(ser), type: methodReturnType(e.body, classByName) });
    } else {
      let rd = methodBody(e.body, /public\s+void\s+readParams\s*\(/);
      if (rd.length < 5) rd = methodBody(e.body, /public\s+static\s+\S+\s+TLdeserialize\s*\(/);
      out.push({ kind: 'constructor', id: e.id, predicate: predicateName(e.name), params: parseTypeParams(rd), type: abstractOf(e.base) });
    }
  }
  return out;
}

const mode = process.argv[2] || 'validate';
const all = build();

if (mode === 'validate') {
  const api = require(path.join(ROOT, 'scheme', 'api.json'));
  const mt = require(path.join(ROOT, 'scheme', 'mtproto.json'));
  const mine = new Map();
  for (const c of [...api.constructors, ...mt.constructors]) mine.set(toSigned(c.id), { name: c.predicate, params: c.params });
  for (const x of [...api.methods, ...mt.methods]) mine.set(toSigned(x.id), { name: x.method, params: x.params });

  let overlap = 0, nameOk = 0, countOk = 0, typeOk = 0, mism = [];
  for (const e of all) {
    if (!mine.has(e.id)) continue;
    overlap++;
    const me = mine.get(e.id), exName = e.method || e.predicate;
    if (me.name === exName) nameOk++;
    const ep = e.params || [], mp = me.params || [];
    if (ep.length === mp.length) {
      countOk++;
      const cats = (p) => (p.type || '').replace(/flags\d*\.\d+\?/, '?').replace(/<.*>/, '<>');
      if (ep.every((p, i) => cats(p) === cats(mp[i]))) typeOk++;
      else if (mism.length < 12) mism.push(`${exName}: ` + ep.map((p, i) => p.type === mp[i].type ? '' : `${mp[i].name}:${mp[i].type}!=${p.type}`).filter(Boolean).join(' '));
    } else if (mism.length < 12) mism.push(`${exName}: ${ep.length} vs ${mp.length}`);
  }
  console.log(`overlap: ${overlap}`);
  console.log(`name match      : ${Math.round(nameOk / overlap * 100)}%`);
  console.log(`param-count match: ${Math.round(countOk / overlap * 100)}%`);
  console.log(`param-type match : ${Math.round(typeOk / overlap * 100)}% (of full entries)`);
  console.log('--- sample mismatches ---\n' + mism.join('\n'));
} else {
  const outPath = path.resolve(process.argv[3] || 'extracted.json');
  fs.writeFileSync(outPath, JSON.stringify({
    constructors: all.filter(e => e.kind === 'constructor').map(({ id, predicate, params, type }) => ({ id, predicate, params, type })),
    methods: all.filter(e => e.kind === 'method').map(({ id, method, params, type }) => ({ id, method, params, type })),
  }, null, 2));
  console.log(`wrote ${all.length} entries -> ${outPath}`);
}
