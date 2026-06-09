# TLRPC → schema extractor

Extracts the TL schema from the **decompiled Eitaa Android client** (`TLRPC.java`) into the
`api.json` shape used by `tools/EitaaSharp.SchemaGen`. Use it to see what the current Eitaa app
(layer **137**) exposes versus the bundled `scheme/*.json` (layer **133**).

```bash
node tools/extract-tl/extract.js validate                 # accuracy check vs scheme/*.json
node tools/extract-tl/extract.js write scheme/_android_extracted.json
node tools/extract-tl/merge.js                            # add the MISSING ids to scheme/api.json
node tools/extract-tl/sync-changed.js                    # replace the CHANGED ids with exact 137 defs
dotnet run --project tools/EitaaSharp.SchemaGen           # regenerate the C# bindings
```

Two complementary passes bring the schema to a coherent layer **137**:

1. **`merge.js`** adds only the **missing** ids (by constructor id, so verified existing entries are
   never touched), skips old `_layerNN` variants, and normalizes new boxed param/return types to the
   schema's existing abstract-type names (orphans → `Object`/`ITlObject`).
2. **`sync-changed.js`** handles the 15 names that *changed* between 133→137 (same name, new id ⇒
   fields were added). In TL a changed definition gets a new constructor id, so an additive merge
   would leave a **stale 133 entry alongside the new 137 one**. This pass removes every legacy
   variant of those names and inserts one exact, hand-verified 137 definition (derived from the
   `serializeToStream`/`readParams` bodies). Most notably Eitaa's `channel` carries a **second
   bitmask `eFlags`** (custom `trusty`/`fake`/`shop`/`sponsoredMessage`/`badge_red_color`/`badge_name`
   fields) after `flags` — the generator supports arbitrarily-named `#` flag fields, and
   `Channel_DualBitmask_RoundTrips` locks the behaviour in.

After both passes the envelope layer is **137**, every layer-137 constructor/method id from the
Android source is represented, and the golden-byte tests confirm the unchanged entries still
serialize byte-for-byte identically.

### Wire audit (`wire-audit.js`) + targeted fixes (`sync-wire.js`)

A matching constructor **id** does not, by itself, guarantee a matching wire layout: Eitaa reuses
some upstream Telegram ids with a customised body (e.g. `user` swaps `scam`→`trusty` and adds the
`MXB_*` presence flags — wire-compatible, true-flags only). To catch cases where the body actually
differs on the wire, `wire-audit.js` reconstructs each type's byte-level field sequence from the
`readParams` body in the source and diffs it against the schema:

```bash
node tools/extract-tl/wire-audit.js                 # audit every type; writes ~/wirediff.json
node tools/extract-tl/wire-audit.js user channel    # audit only the named types
```

It ignores true-flags (no bytes) and compares ordered category tokens (`i/l/s/b/d/B/o/V`, `c` =
flag-gated). Of 836 audited types most diffs are dead secret-chat / `_old` / `_layerNN` variants the
SDK never touches; the genuinely reachable diffs are corrected, hand-derived from the source, in
`sync-wire.js` (login `auth.sentCode`/`auth.authorization`, `inputReplyToMessage`, and a few Eitaa
types). Run it after the merge passes, before regenerating:

```bash
node tools/extract-tl/sync-wire.js
```

Still raw-only / not yet wired up (need their leaf types added first): the attach-menu / mini-app
listing cluster (`attachMenuBot` icons & peer_types, `AttachMenuPeerType`, `Ads_ClickAction`),
`EitaaNotification_message` buttons, and the reactions types. The mini-app *entry points*
themselves (`messages.requestWebView` → `webViewResultUrl`) are wire-functional today.

Place the decompiled source at `eitaa-android-source/sources/ir/eitaa/tgnet/TLRPC.java`
(git-ignored — it is large and not part of the SDK).

## What it produces

`scheme/_android_extracted.json` — every TL constructor/method the app defines (≈1730), incl. the
~414 ids missing from the bundled schema (54 methods + 399 types): reactions, attach-menu/web-view
bots, langpack, and Eitaa-specific calls (`Live_getMedia`, `messages.EitaaCheckChatInvite`,
`updateEitaaNotification`, `get_trends`, `socketPing`, `shop_*`, `ads_*`, `stat_*`, …).

## Accuracy & caveats

Measured against the 1277 overlapping ids: **name ~95%**, **param-count ~77%**. Because jadx emits
no field declarations, types are inferred from the `readParams`/`serializeToStream` bodies:

- **Types (constructors)** extract well — boxed types come from `X.TLdeserialize`, vectors from the
  `.add(Elem.TLdeserialize)` loop.
- **Method boxed params** lose their type on the write side and fall back to `Object` (serializes
  correctly — the caller passes a concrete TL object — but is a less specific C# type).
- Complex types with many boolean flags or nested vectors may miss a field.

**Therefore this output is a reference / starting point, not auto-merged into the production
schema** — merging the imperfect entries wholesale could break response parsing for the affected
types. To adopt a specific new method/type, copy its entry into `scheme/api.json`, verify its params
against `TLRPC.java`, then run `EitaaSharp.SchemaGen` + the golden-byte tests.
