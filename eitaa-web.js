!function(e) {
    var t = {};
    function a(n) {
        if (t[n])
            return t[n].exports;
        var s = t[n] = {
            i: n,
            l: !1,
            exports: {}
        };
        return e[n].call(s.exports, s, s.exports, a),
        s.l = !0,
        s.exports
    }
    a.m = e,
    a.c = t,
    a.d = function(e, t, n) {
        a.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: n
        })
    }
    ,
    a.r = function(e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }),
        Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }
    ,
    a.t = function(e, t) {
        if (1 & t && (e = a(e)),
        8 & t)
            return e;
        if (4 & t && "object" == typeof e && e && e.__esModule)
            return e;
        var n = Object.create(null);
        if (a.r(n),
        Object.defineProperty(n, "default", {
            enumerable: !0,
            value: e
        }),
        2 & t && "string" != typeof e)
            for (var s in e)
                a.d(n, s, function(t) {
                    return e[t]
                }
                .bind(null, s));
        return n
    }
    ,
    a.n = function(e) {
        var t = e && e.__esModule ? function() {
            return e.default
        }
        : function() {
            return e
        }
        ;
        return a.d(t, "a", t),
        t
    }
    ,
    a.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }
    ,
    a.p = "",
    a(a.s = 1)
}([function(e, t, a) {
    /*! pako 2.1.0 https://github.com/nodeca/pako @license (MIT AND Zlib) */
    !function(e) {
        "use strict";
        var t = (e, t, a, n) => {
            let s = 65535 & e | 0
              , i = e >>> 16 & 65535 | 0
              , r = 0;
            for (; 0 !== a; ) {
                r = a > 2e3 ? 2e3 : a,
                a -= r;
                do {
                    s = s + t[n++] | 0,
                    i = i + s | 0
                } while (--r);
                s %= 65521,
                i %= 65521
            }
            return s | i << 16 | 0
        }
        ;
        const a = new Uint32Array(( () => {
            let e, t = [];
            for (var a = 0; a < 256; a++) {
                e = a;
                for (var n = 0; n < 8; n++)
                    e = 1 & e ? 3988292384 ^ e >>> 1 : e >>> 1;
                t[a] = e
            }
            return t
        }
        )());
        var n = (e, t, n, s) => {
            const i = a
              , r = s + n;
            e ^= -1;
            for (let a = s; a < r; a++)
                e = e >>> 8 ^ i[255 & (e ^ t[a])];
            return -1 ^ e
        }
        ;
        const s = 16209;
        var i = function(e, t) {
            let a, n, i, r, p, o, m, d, y, l, c, g, h, u, f, _, v, b, P, w, S, k, I, C;
            const A = e.state;
            a = e.next_in,
            I = e.input,
            n = a + (e.avail_in - 5),
            i = e.next_out,
            C = e.output,
            r = i - (t - e.avail_out),
            p = i + (e.avail_out - 257),
            o = A.dmax,
            m = A.wsize,
            d = A.whave,
            y = A.wnext,
            l = A.window,
            c = A.hold,
            g = A.bits,
            h = A.lencode,
            u = A.distcode,
            f = (1 << A.lenbits) - 1,
            _ = (1 << A.distbits) - 1;
            e: do {
                g < 15 && (c += I[a++] << g,
                g += 8,
                c += I[a++] << g,
                g += 8),
                v = h[c & f];
                t: for (; ; ) {
                    if (b = v >>> 24,
                    c >>>= b,
                    g -= b,
                    b = v >>> 16 & 255,
                    0 === b)
                        C[i++] = 65535 & v;
                    else {
                        if (!(16 & b)) {
                            if (0 == (64 & b)) {
                                v = h[(65535 & v) + (c & (1 << b) - 1)];
                                continue t
                            }
                            if (32 & b) {
                                A.mode = 16191;
                                break e
                            }
                            e.msg = "invalid literal/length code",
                            A.mode = s;
                            break e
                        }
                        P = 65535 & v,
                        b &= 15,
                        b && (g < b && (c += I[a++] << g,
                        g += 8),
                        P += c & (1 << b) - 1,
                        c >>>= b,
                        g -= b),
                        g < 15 && (c += I[a++] << g,
                        g += 8,
                        c += I[a++] << g,
                        g += 8),
                        v = u[c & _];
                        a: for (; ; ) {
                            if (b = v >>> 24,
                            c >>>= b,
                            g -= b,
                            b = v >>> 16 & 255,
                            !(16 & b)) {
                                if (0 == (64 & b)) {
                                    v = u[(65535 & v) + (c & (1 << b) - 1)];
                                    continue a
                                }
                                e.msg = "invalid distance code",
                                A.mode = s;
                                break e
                            }
                            if (w = 65535 & v,
                            b &= 15,
                            g < b && (c += I[a++] << g,
                            g += 8,
                            g < b && (c += I[a++] << g,
                            g += 8)),
                            w += c & (1 << b) - 1,
                            w > o) {
                                e.msg = "invalid distance too far back",
                                A.mode = s;
                                break e
                            }
                            if (c >>>= b,
                            g -= b,
                            b = i - r,
                            w > b) {
                                if (b = w - b,
                                b > d && A.sane) {
                                    e.msg = "invalid distance too far back",
                                    A.mode = s;
                                    break e
                                }
                                if (S = 0,
                                k = l,
                                0 === y) {
                                    if (S += m - b,
                                    b < P) {
                                        P -= b;
                                        do {
                                            C[i++] = l[S++]
                                        } while (--b);
                                        S = i - w,
                                        k = C
                                    }
                                } else if (y < b) {
                                    if (S += m + y - b,
                                    b -= y,
                                    b < P) {
                                        P -= b;
                                        do {
                                            C[i++] = l[S++]
                                        } while (--b);
                                        if (S = 0,
                                        y < P) {
                                            b = y,
                                            P -= b;
                                            do {
                                                C[i++] = l[S++]
                                            } while (--b);
                                            S = i - w,
                                            k = C
                                        }
                                    }
                                } else if (S += y - b,
                                b < P) {
                                    P -= b;
                                    do {
                                        C[i++] = l[S++]
                                    } while (--b);
                                    S = i - w,
                                    k = C
                                }
                                for (; P > 2; )
                                    C[i++] = k[S++],
                                    C[i++] = k[S++],
                                    C[i++] = k[S++],
                                    P -= 3;
                                P && (C[i++] = k[S++],
                                P > 1 && (C[i++] = k[S++]))
                            } else {
                                S = i - w;
                                do {
                                    C[i++] = C[S++],
                                    C[i++] = C[S++],
                                    C[i++] = C[S++],
                                    P -= 3
                                } while (P > 2);
                                P && (C[i++] = C[S++],
                                P > 1 && (C[i++] = C[S++]))
                            }
                            break
                        }
                    }
                    break
                }
            } while (a < n && i < p);
            P = g >> 3,
            a -= P,
            g -= P << 3,
            c &= (1 << g) - 1,
            e.next_in = a,
            e.next_out = i,
            e.avail_in = a < n ? n - a + 5 : 5 - (a - n),
            e.avail_out = i < p ? p - i + 257 : 257 - (i - p),
            A.hold = c,
            A.bits = g
        };
        const r = new Uint16Array([3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0])
          , p = new Uint8Array([16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78])
          , o = new Uint16Array([1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0])
          , m = new Uint8Array([16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64]);
        var d = (e, t, a, n, s, i, d, y) => {
            const l = y.bits;
            let c, g, h, u, f, _, v = 0, b = 0, P = 0, w = 0, S = 0, k = 0, I = 0, C = 0, A = 0, M = 0, R = null;
            const E = new Uint16Array(16)
              , T = new Uint16Array(16);
            let V, U, D, x = null;
            for (v = 0; v <= 15; v++)
                E[v] = 0;
            for (b = 0; b < n; b++)
                E[t[a + b]]++;
            for (S = l,
            w = 15; w >= 1 && 0 === E[w]; w--)
                ;
            if (S > w && (S = w),
            0 === w)
                return s[i++] = 20971520,
                s[i++] = 20971520,
                y.bits = 1,
                0;
            for (P = 1; P < w && 0 === E[P]; P++)
                ;
            for (S < P && (S = P),
            C = 1,
            v = 1; v <= 15; v++)
                if (C <<= 1,
                C -= E[v],
                C < 0)
                    return -1;
            if (C > 0 && (0 === e || 1 !== w))
                return -1;
            for (T[1] = 0,
            v = 1; v < 15; v++)
                T[v + 1] = T[v] + E[v];
            for (b = 0; b < n; b++)
                0 !== t[a + b] && (d[T[t[a + b]]++] = b);
            if (0 === e ? (R = x = d,
            _ = 20) : 1 === e ? (R = r,
            x = p,
            _ = 257) : (R = o,
            x = m,
            _ = 0),
            M = 0,
            b = 0,
            v = P,
            f = i,
            k = S,
            I = 0,
            h = -1,
            A = 1 << S,
            u = A - 1,
            1 === e && A > 852 || 2 === e && A > 592)
                return 1;
            for (; ; ) {
                V = v - I,
                d[b] + 1 < _ ? (U = 0,
                D = d[b]) : d[b] >= _ ? (U = x[d[b] - _],
                D = R[d[b] - _]) : (U = 96,
                D = 0),
                c = 1 << v - I,
                g = 1 << k,
                P = g;
                do {
                    g -= c,
                    s[f + (M >> I) + g] = V << 24 | U << 16 | D | 0
                } while (0 !== g);
                for (c = 1 << v - 1; M & c; )
                    c >>= 1;
                if (0 !== c ? (M &= c - 1,
                M += c) : M = 0,
                b++,
                0 == --E[v]) {
                    if (v === w)
                        break;
                    v = t[a + d[b]]
                }
                if (v > S && (M & u) !== h) {
                    for (0 === I && (I = S),
                    f += P,
                    k = v - I,
                    C = 1 << k; k + I < w && (C -= E[k + I],
                    !(C <= 0)); )
                        k++,
                        C <<= 1;
                    if (A += 1 << k,
                    1 === e && A > 852 || 2 === e && A > 592)
                        return 1;
                    h = M & u,
                    s[h] = S << 24 | k << 16 | f - i | 0
                }
            }
            return 0 !== M && (s[f + M] = v - I << 24 | 64 << 16 | 0),
            y.bits = S,
            0
        }
          , y = {
            Z_NO_FLUSH: 0,
            Z_PARTIAL_FLUSH: 1,
            Z_SYNC_FLUSH: 2,
            Z_FULL_FLUSH: 3,
            Z_FINISH: 4,
            Z_BLOCK: 5,
            Z_TREES: 6,
            Z_OK: 0,
            Z_STREAM_END: 1,
            Z_NEED_DICT: 2,
            Z_ERRNO: -1,
            Z_STREAM_ERROR: -2,
            Z_DATA_ERROR: -3,
            Z_MEM_ERROR: -4,
            Z_BUF_ERROR: -5,
            Z_NO_COMPRESSION: 0,
            Z_BEST_SPEED: 1,
            Z_BEST_COMPRESSION: 9,
            Z_DEFAULT_COMPRESSION: -1,
            Z_FILTERED: 1,
            Z_HUFFMAN_ONLY: 2,
            Z_RLE: 3,
            Z_FIXED: 4,
            Z_DEFAULT_STRATEGY: 0,
            Z_BINARY: 0,
            Z_TEXT: 1,
            Z_UNKNOWN: 2,
            Z_DEFLATED: 8
        };
        const {Z_FINISH: l, Z_BLOCK: c, Z_TREES: g, Z_OK: h, Z_STREAM_END: u, Z_NEED_DICT: f, Z_STREAM_ERROR: _, Z_DATA_ERROR: v, Z_MEM_ERROR: b, Z_BUF_ERROR: P, Z_DEFLATED: w} = y
          , S = 16180
          , k = 16190
          , I = 16191
          , C = 16192
          , A = 16194
          , M = 16199
          , R = 16200
          , E = 16206
          , T = 16209
          , V = e => (e >>> 24 & 255) + (e >>> 8 & 65280) + ((65280 & e) << 8) + ((255 & e) << 24);
        function U() {
            this.strm = null,
            this.mode = 0,
            this.last = !1,
            this.wrap = 0,
            this.havedict = !1,
            this.flags = 0,
            this.dmax = 0,
            this.check = 0,
            this.total = 0,
            this.head = null,
            this.wbits = 0,
            this.wsize = 0,
            this.whave = 0,
            this.wnext = 0,
            this.window = null,
            this.hold = 0,
            this.bits = 0,
            this.length = 0,
            this.offset = 0,
            this.extra = 0,
            this.lencode = null,
            this.distcode = null,
            this.lenbits = 0,
            this.distbits = 0,
            this.ncode = 0,
            this.nlen = 0,
            this.ndist = 0,
            this.have = 0,
            this.next = null,
            this.lens = new Uint16Array(320),
            this.work = new Uint16Array(288),
            this.lendyn = null,
            this.distdyn = null,
            this.sane = 0,
            this.back = 0,
            this.was = 0
        }
        const D = e => {
            if (!e)
                return 1;
            const t = e.state;
            return !t || t.strm !== e || t.mode < S || t.mode > 16211 ? 1 : 0
        }
          , x = e => {
            if (D(e))
                return _;
            const t = e.state;
            return e.total_in = e.total_out = t.total = 0,
            e.msg = "",
            t.wrap && (e.adler = 1 & t.wrap),
            t.mode = S,
            t.last = 0,
            t.havedict = 0,
            t.flags = -1,
            t.dmax = 32768,
            t.head = null,
            t.hold = 0,
            t.bits = 0,
            t.lencode = t.lendyn = new Int32Array(852),
            t.distcode = t.distdyn = new Int32Array(592),
            t.sane = 1,
            t.back = -1,
            h
        }
          , B = e => {
            if (D(e))
                return _;
            const t = e.state;
            return t.wsize = 0,
            t.whave = 0,
            t.wnext = 0,
            x(e)
        }
          , F = (e, t) => {
            let a;
            if (D(e))
                return _;
            const n = e.state;
            return t < 0 ? (a = 0,
            t = -t) : (a = 5 + (t >> 4),
            t < 48 && (t &= 15)),
            t && (t < 8 || t > 15) ? _ : (null !== n.window && n.wbits !== t && (n.window = null),
            n.wrap = a,
            n.wbits = t,
            B(e))
        }
          , L = (e, t) => {
            if (!e)
                return _;
            const a = new U;
            e.state = a,
            a.strm = e,
            a.window = null,
            a.mode = S;
            const n = F(e, t);
            return n !== h && (e.state = null),
            n
        }
        ;
        let O, N, q = !0;
        const G = e => {
            if (q) {
                O = new Int32Array(512),
                N = new Int32Array(32);
                let t = 0;
                for (; t < 144; )
                    e.lens[t++] = 8;
                for (; t < 256; )
                    e.lens[t++] = 9;
                for (; t < 280; )
                    e.lens[t++] = 7;
                for (; t < 288; )
                    e.lens[t++] = 8;
                for (d(1, e.lens, 0, 288, O, 0, e.work, {
                    bits: 9
                }),
                t = 0; t < 32; )
                    e.lens[t++] = 5;
                d(2, e.lens, 0, 32, N, 0, e.work, {
                    bits: 5
                }),
                q = !1
            }
            e.lencode = O,
            e.lenbits = 9,
            e.distcode = N,
            e.distbits = 5
        }
          , z = (e, t, a, n) => {
            let s;
            const i = e.state;
            return null === i.window && (i.wsize = 1 << i.wbits,
            i.wnext = 0,
            i.whave = 0,
            i.window = new Uint8Array(i.wsize)),
            n >= i.wsize ? (i.window.set(t.subarray(a - i.wsize, a), 0),
            i.wnext = 0,
            i.whave = i.wsize) : (s = i.wsize - i.wnext,
            s > n && (s = n),
            i.window.set(t.subarray(a - n, a - n + s), i.wnext),
            (n -= s) ? (i.window.set(t.subarray(a - n, a), 0),
            i.wnext = n,
            i.whave = i.wsize) : (i.wnext += s,
            i.wnext === i.wsize && (i.wnext = 0),
            i.whave < i.wsize && (i.whave += s))),
            0
        }
        ;
        var j = B
          , K = L
          , W = (e, a) => {
            let s, r, p, o, m, y, U, x, B, F, L, O, N, q, j, K, W, H, J, Z, Q, X, Y = 0;
            const $ = new Uint8Array(4);
            let ee, te;
            const ae = new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
            if (D(e) || !e.output || !e.input && 0 !== e.avail_in)
                return _;
            s = e.state,
            s.mode === I && (s.mode = C),
            m = e.next_out,
            p = e.output,
            U = e.avail_out,
            o = e.next_in,
            r = e.input,
            y = e.avail_in,
            x = s.hold,
            B = s.bits,
            F = y,
            L = U,
            X = h;
            e: for (; ; )
                switch (s.mode) {
                case S:
                    if (0 === s.wrap) {
                        s.mode = C;
                        break
                    }
                    for (; B < 16; ) {
                        if (0 === y)
                            break e;
                        y--,
                        x += r[o++] << B,
                        B += 8
                    }
                    if (2 & s.wrap && 35615 === x) {
                        0 === s.wbits && (s.wbits = 15),
                        s.check = 0,
                        $[0] = 255 & x,
                        $[1] = x >>> 8 & 255,
                        s.check = n(s.check, $, 2, 0),
                        x = 0,
                        B = 0,
                        s.mode = 16181;
                        break
                    }
                    if (s.head && (s.head.done = !1),
                    !(1 & s.wrap) || (((255 & x) << 8) + (x >> 8)) % 31) {
                        e.msg = "incorrect header check",
                        s.mode = T;
                        break
                    }
                    if ((15 & x) !== w) {
                        e.msg = "unknown compression method",
                        s.mode = T;
                        break
                    }
                    if (x >>>= 4,
                    B -= 4,
                    Q = 8 + (15 & x),
                    0 === s.wbits && (s.wbits = Q),
                    Q > 15 || Q > s.wbits) {
                        e.msg = "invalid window size",
                        s.mode = T;
                        break
                    }
                    s.dmax = 1 << s.wbits,
                    s.flags = 0,
                    e.adler = s.check = 1,
                    s.mode = 512 & x ? 16189 : I,
                    x = 0,
                    B = 0;
                    break;
                case 16181:
                    for (; B < 16; ) {
                        if (0 === y)
                            break e;
                        y--,
                        x += r[o++] << B,
                        B += 8
                    }
                    if (s.flags = x,
                    (255 & s.flags) !== w) {
                        e.msg = "unknown compression method",
                        s.mode = T;
                        break
                    }
                    if (57344 & s.flags) {
                        e.msg = "unknown header flags set",
                        s.mode = T;
                        break
                    }
                    s.head && (s.head.text = x >> 8 & 1),
                    512 & s.flags && 4 & s.wrap && ($[0] = 255 & x,
                    $[1] = x >>> 8 & 255,
                    s.check = n(s.check, $, 2, 0)),
                    x = 0,
                    B = 0,
                    s.mode = 16182;
                case 16182:
                    for (; B < 32; ) {
                        if (0 === y)
                            break e;
                        y--,
                        x += r[o++] << B,
                        B += 8
                    }
                    s.head && (s.head.time = x),
                    512 & s.flags && 4 & s.wrap && ($[0] = 255 & x,
                    $[1] = x >>> 8 & 255,
                    $[2] = x >>> 16 & 255,
                    $[3] = x >>> 24 & 255,
                    s.check = n(s.check, $, 4, 0)),
                    x = 0,
                    B = 0,
                    s.mode = 16183;
                case 16183:
                    for (; B < 16; ) {
                        if (0 === y)
                            break e;
                        y--,
                        x += r[o++] << B,
                        B += 8
                    }
                    s.head && (s.head.xflags = 255 & x,
                    s.head.os = x >> 8),
                    512 & s.flags && 4 & s.wrap && ($[0] = 255 & x,
                    $[1] = x >>> 8 & 255,
                    s.check = n(s.check, $, 2, 0)),
                    x = 0,
                    B = 0,
                    s.mode = 16184;
                case 16184:
                    if (1024 & s.flags) {
                        for (; B < 16; ) {
                            if (0 === y)
                                break e;
                            y--,
                            x += r[o++] << B,
                            B += 8
                        }
                        s.length = x,
                        s.head && (s.head.extra_len = x),
                        512 & s.flags && 4 & s.wrap && ($[0] = 255 & x,
                        $[1] = x >>> 8 & 255,
                        s.check = n(s.check, $, 2, 0)),
                        x = 0,
                        B = 0
                    } else
                        s.head && (s.head.extra = null);
                    s.mode = 16185;
                case 16185:
                    if (1024 & s.flags && (O = s.length,
                    O > y && (O = y),
                    O && (s.head && (Q = s.head.extra_len - s.length,
                    s.head.extra || (s.head.extra = new Uint8Array(s.head.extra_len)),
                    s.head.extra.set(r.subarray(o, o + O), Q)),
                    512 & s.flags && 4 & s.wrap && (s.check = n(s.check, r, O, o)),
                    y -= O,
                    o += O,
                    s.length -= O),
                    s.length))
                        break e;
                    s.length = 0,
                    s.mode = 16186;
                case 16186:
                    if (2048 & s.flags) {
                        if (0 === y)
                            break e;
                        O = 0;
                        do {
                            Q = r[o + O++],
                            s.head && Q && s.length < 65536 && (s.head.name += String.fromCharCode(Q))
                        } while (Q && O < y);
                        if (512 & s.flags && 4 & s.wrap && (s.check = n(s.check, r, O, o)),
                        y -= O,
                        o += O,
                        Q)
                            break e
                    } else
                        s.head && (s.head.name = null);
                    s.length = 0,
                    s.mode = 16187;
                case 16187:
                    if (4096 & s.flags) {
                        if (0 === y)
                            break e;
                        O = 0;
                        do {
                            Q = r[o + O++],
                            s.head && Q && s.length < 65536 && (s.head.comment += String.fromCharCode(Q))
                        } while (Q && O < y);
                        if (512 & s.flags && 4 & s.wrap && (s.check = n(s.check, r, O, o)),
                        y -= O,
                        o += O,
                        Q)
                            break e
                    } else
                        s.head && (s.head.comment = null);
                    s.mode = 16188;
                case 16188:
                    if (512 & s.flags) {
                        for (; B < 16; ) {
                            if (0 === y)
                                break e;
                            y--,
                            x += r[o++] << B,
                            B += 8
                        }
                        if (4 & s.wrap && x !== (65535 & s.check)) {
                            e.msg = "header crc mismatch",
                            s.mode = T;
                            break
                        }
                        x = 0,
                        B = 0
                    }
                    s.head && (s.head.hcrc = s.flags >> 9 & 1,
                    s.head.done = !0),
                    e.adler = s.check = 0,
                    s.mode = I;
                    break;
                case 16189:
                    for (; B < 32; ) {
                        if (0 === y)
                            break e;
                        y--,
                        x += r[o++] << B,
                        B += 8
                    }
                    e.adler = s.check = V(x),
                    x = 0,
                    B = 0,
                    s.mode = k;
                case k:
                    if (0 === s.havedict)
                        return e.next_out = m,
                        e.avail_out = U,
                        e.next_in = o,
                        e.avail_in = y,
                        s.hold = x,
                        s.bits = B,
                        f;
                    e.adler = s.check = 1,
                    s.mode = I;
                case I:
                    if (a === c || a === g)
                        break e;
                case C:
                    if (s.last) {
                        x >>>= 7 & B,
                        B -= 7 & B,
                        s.mode = E;
                        break
                    }
                    for (; B < 3; ) {
                        if (0 === y)
                            break e;
                        y--,
                        x += r[o++] << B,
                        B += 8
                    }
                    switch (s.last = 1 & x,
                    x >>>= 1,
                    B -= 1,
                    3 & x) {
                    case 0:
                        s.mode = 16193;
                        break;
                    case 1:
                        if (G(s),
                        s.mode = M,
                        a === g) {
                            x >>>= 2,
                            B -= 2;
                            break e
                        }
                        break;
                    case 2:
                        s.mode = 16196;
                        break;
                    case 3:
                        e.msg = "invalid block type",
                        s.mode = T
                    }
                    x >>>= 2,
                    B -= 2;
                    break;
                case 16193:
                    for (x >>>= 7 & B,
                    B -= 7 & B; B < 32; ) {
                        if (0 === y)
                            break e;
                        y--,
                        x += r[o++] << B,
                        B += 8
                    }
                    if ((65535 & x) != (x >>> 16 ^ 65535)) {
                        e.msg = "invalid stored block lengths",
                        s.mode = T;
                        break
                    }
                    if (s.length = 65535 & x,
                    x = 0,
                    B = 0,
                    s.mode = A,
                    a === g)
                        break e;
                case A:
                    s.mode = 16195;
                case 16195:
                    if (O = s.length,
                    O) {
                        if (O > y && (O = y),
                        O > U && (O = U),
                        0 === O)
                            break e;
                        p.set(r.subarray(o, o + O), m),
                        y -= O,
                        o += O,
                        U -= O,
                        m += O,
                        s.length -= O;
                        break
                    }
                    s.mode = I;
                    break;
                case 16196:
                    for (; B < 14; ) {
                        if (0 === y)
                            break e;
                        y--,
                        x += r[o++] << B,
                        B += 8
                    }
                    if (s.nlen = 257 + (31 & x),
                    x >>>= 5,
                    B -= 5,
                    s.ndist = 1 + (31 & x),
                    x >>>= 5,
                    B -= 5,
                    s.ncode = 4 + (15 & x),
                    x >>>= 4,
                    B -= 4,
                    s.nlen > 286 || s.ndist > 30) {
                        e.msg = "too many length or distance symbols",
                        s.mode = T;
                        break
                    }
                    s.have = 0,
                    s.mode = 16197;
                case 16197:
                    for (; s.have < s.ncode; ) {
                        for (; B < 3; ) {
                            if (0 === y)
                                break e;
                            y--,
                            x += r[o++] << B,
                            B += 8
                        }
                        s.lens[ae[s.have++]] = 7 & x,
                        x >>>= 3,
                        B -= 3
                    }
                    for (; s.have < 19; )
                        s.lens[ae[s.have++]] = 0;
                    if (s.lencode = s.lendyn,
                    s.lenbits = 7,
                    ee = {
                        bits: s.lenbits
                    },
                    X = d(0, s.lens, 0, 19, s.lencode, 0, s.work, ee),
                    s.lenbits = ee.bits,
                    X) {
                        e.msg = "invalid code lengths set",
                        s.mode = T;
                        break
                    }
                    s.have = 0,
                    s.mode = 16198;
                case 16198:
                    for (; s.have < s.nlen + s.ndist; ) {
                        for (; Y = s.lencode[x & (1 << s.lenbits) - 1],
                        j = Y >>> 24,
                        K = Y >>> 16 & 255,
                        W = 65535 & Y,
                        !(j <= B); ) {
                            if (0 === y)
                                break e;
                            y--,
                            x += r[o++] << B,
                            B += 8
                        }
                        if (W < 16)
                            x >>>= j,
                            B -= j,
                            s.lens[s.have++] = W;
                        else {
                            if (16 === W) {
                                for (te = j + 2; B < te; ) {
                                    if (0 === y)
                                        break e;
                                    y--,
                                    x += r[o++] << B,
                                    B += 8
                                }
                                if (x >>>= j,
                                B -= j,
                                0 === s.have) {
                                    e.msg = "invalid bit length repeat",
                                    s.mode = T;
                                    break
                                }
                                Q = s.lens[s.have - 1],
                                O = 3 + (3 & x),
                                x >>>= 2,
                                B -= 2
                            } else if (17 === W) {
                                for (te = j + 3; B < te; ) {
                                    if (0 === y)
                                        break e;
                                    y--,
                                    x += r[o++] << B,
                                    B += 8
                                }
                                x >>>= j,
                                B -= j,
                                Q = 0,
                                O = 3 + (7 & x),
                                x >>>= 3,
                                B -= 3
                            } else {
                                for (te = j + 7; B < te; ) {
                                    if (0 === y)
                                        break e;
                                    y--,
                                    x += r[o++] << B,
                                    B += 8
                                }
                                x >>>= j,
                                B -= j,
                                Q = 0,
                                O = 11 + (127 & x),
                                x >>>= 7,
                                B -= 7
                            }
                            if (s.have + O > s.nlen + s.ndist) {
                                e.msg = "invalid bit length repeat",
                                s.mode = T;
                                break
                            }
                            for (; O--; )
                                s.lens[s.have++] = Q
                        }
                    }
                    if (s.mode === T)
                        break;
                    if (0 === s.lens[256]) {
                        e.msg = "invalid code -- missing end-of-block",
                        s.mode = T;
                        break
                    }
                    if (s.lenbits = 9,
                    ee = {
                        bits: s.lenbits
                    },
                    X = d(1, s.lens, 0, s.nlen, s.lencode, 0, s.work, ee),
                    s.lenbits = ee.bits,
                    X) {
                        e.msg = "invalid literal/lengths set",
                        s.mode = T;
                        break
                    }
                    if (s.distbits = 6,
                    s.distcode = s.distdyn,
                    ee = {
                        bits: s.distbits
                    },
                    X = d(2, s.lens, s.nlen, s.ndist, s.distcode, 0, s.work, ee),
                    s.distbits = ee.bits,
                    X) {
                        e.msg = "invalid distances set",
                        s.mode = T;
                        break
                    }
                    if (s.mode = M,
                    a === g)
                        break e;
                case M:
                    s.mode = R;
                case R:
                    if (y >= 6 && U >= 258) {
                        e.next_out = m,
                        e.avail_out = U,
                        e.next_in = o,
                        e.avail_in = y,
                        s.hold = x,
                        s.bits = B,
                        i(e, L),
                        m = e.next_out,
                        p = e.output,
                        U = e.avail_out,
                        o = e.next_in,
                        r = e.input,
                        y = e.avail_in,
                        x = s.hold,
                        B = s.bits,
                        s.mode === I && (s.back = -1);
                        break
                    }
                    for (s.back = 0; Y = s.lencode[x & (1 << s.lenbits) - 1],
                    j = Y >>> 24,
                    K = Y >>> 16 & 255,
                    W = 65535 & Y,
                    !(j <= B); ) {
                        if (0 === y)
                            break e;
                        y--,
                        x += r[o++] << B,
                        B += 8
                    }
                    if (K && 0 == (240 & K)) {
                        for (H = j,
                        J = K,
                        Z = W; Y = s.lencode[Z + ((x & (1 << H + J) - 1) >> H)],
                        j = Y >>> 24,
                        K = Y >>> 16 & 255,
                        W = 65535 & Y,
                        !(H + j <= B); ) {
                            if (0 === y)
                                break e;
                            y--,
                            x += r[o++] << B,
                            B += 8
                        }
                        x >>>= H,
                        B -= H,
                        s.back += H
                    }
                    if (x >>>= j,
                    B -= j,
                    s.back += j,
                    s.length = W,
                    0 === K) {
                        s.mode = 16205;
                        break
                    }
                    if (32 & K) {
                        s.back = -1,
                        s.mode = I;
                        break
                    }
                    if (64 & K) {
                        e.msg = "invalid literal/length code",
                        s.mode = T;
                        break
                    }
                    s.extra = 15 & K,
                    s.mode = 16201;
                case 16201:
                    if (s.extra) {
                        for (te = s.extra; B < te; ) {
                            if (0 === y)
                                break e;
                            y--,
                            x += r[o++] << B,
                            B += 8
                        }
                        s.length += x & (1 << s.extra) - 1,
                        x >>>= s.extra,
                        B -= s.extra,
                        s.back += s.extra
                    }
                    s.was = s.length,
                    s.mode = 16202;
                case 16202:
                    for (; Y = s.distcode[x & (1 << s.distbits) - 1],
                    j = Y >>> 24,
                    K = Y >>> 16 & 255,
                    W = 65535 & Y,
                    !(j <= B); ) {
                        if (0 === y)
                            break e;
                        y--,
                        x += r[o++] << B,
                        B += 8
                    }
                    if (0 == (240 & K)) {
                        for (H = j,
                        J = K,
                        Z = W; Y = s.distcode[Z + ((x & (1 << H + J) - 1) >> H)],
                        j = Y >>> 24,
                        K = Y >>> 16 & 255,
                        W = 65535 & Y,
                        !(H + j <= B); ) {
                            if (0 === y)
                                break e;
                            y--,
                            x += r[o++] << B,
                            B += 8
                        }
                        x >>>= H,
                        B -= H,
                        s.back += H
                    }
                    if (x >>>= j,
                    B -= j,
                    s.back += j,
                    64 & K) {
                        e.msg = "invalid distance code",
                        s.mode = T;
                        break
                    }
                    s.offset = W,
                    s.extra = 15 & K,
                    s.mode = 16203;
                case 16203:
                    if (s.extra) {
                        for (te = s.extra; B < te; ) {
                            if (0 === y)
                                break e;
                            y--,
                            x += r[o++] << B,
                            B += 8
                        }
                        s.offset += x & (1 << s.extra) - 1,
                        x >>>= s.extra,
                        B -= s.extra,
                        s.back += s.extra
                    }
                    if (s.offset > s.dmax) {
                        e.msg = "invalid distance too far back",
                        s.mode = T;
                        break
                    }
                    s.mode = 16204;
                case 16204:
                    if (0 === U)
                        break e;
                    if (O = L - U,
                    s.offset > O) {
                        if (O = s.offset - O,
                        O > s.whave && s.sane) {
                            e.msg = "invalid distance too far back",
                            s.mode = T;
                            break
                        }
                        O > s.wnext ? (O -= s.wnext,
                        N = s.wsize - O) : N = s.wnext - O,
                        O > s.length && (O = s.length),
                        q = s.window
                    } else
                        q = p,
                        N = m - s.offset,
                        O = s.length;
                    O > U && (O = U),
                    U -= O,
                    s.length -= O;
                    do {
                        p[m++] = q[N++]
                    } while (--O);
                    0 === s.length && (s.mode = R);
                    break;
                case 16205:
                    if (0 === U)
                        break e;
                    p[m++] = s.length,
                    U--,
                    s.mode = R;
                    break;
                case E:
                    if (s.wrap) {
                        for (; B < 32; ) {
                            if (0 === y)
                                break e;
                            y--,
                            x |= r[o++] << B,
                            B += 8
                        }
                        if (L -= U,
                        e.total_out += L,
                        s.total += L,
                        4 & s.wrap && L && (e.adler = s.check = s.flags ? n(s.check, p, L, m - L) : t(s.check, p, L, m - L)),
                        L = U,
                        4 & s.wrap && (s.flags ? x : V(x)) !== s.check) {
                            e.msg = "incorrect data check",
                            s.mode = T;
                            break
                        }
                        x = 0,
                        B = 0
                    }
                    s.mode = 16207;
                case 16207:
                    if (s.wrap && s.flags) {
                        for (; B < 32; ) {
                            if (0 === y)
                                break e;
                            y--,
                            x += r[o++] << B,
                            B += 8
                        }
                        if (4 & s.wrap && x !== (4294967295 & s.total)) {
                            e.msg = "incorrect length check",
                            s.mode = T;
                            break
                        }
                        x = 0,
                        B = 0
                    }
                    s.mode = 16208;
                case 16208:
                    X = u;
                    break e;
                case T:
                    X = v;
                    break e;
                case 16210:
                    return b;
                default:
                    return _
                }
            return e.next_out = m,
            e.avail_out = U,
            e.next_in = o,
            e.avail_in = y,
            s.hold = x,
            s.bits = B,
            (s.wsize || L !== e.avail_out && s.mode < T && (s.mode < E || a !== l)) && z(e, e.output, e.next_out, L - e.avail_out),
            F -= e.avail_in,
            L -= e.avail_out,
            e.total_in += F,
            e.total_out += L,
            s.total += L,
            4 & s.wrap && L && (e.adler = s.check = s.flags ? n(s.check, p, L, e.next_out - L) : t(s.check, p, L, e.next_out - L)),
            e.data_type = s.bits + (s.last ? 64 : 0) + (s.mode === I ? 128 : 0) + (s.mode === M || s.mode === A ? 256 : 0),
            (0 === F && 0 === L || a === l) && X === h && (X = P),
            X
        }
          , H = e => {
            if (D(e))
                return _;
            let t = e.state;
            return t.window && (t.window = null),
            e.state = null,
            h
        }
          , J = (e, t) => {
            if (D(e))
                return _;
            const a = e.state;
            return 0 == (2 & a.wrap) ? _ : (a.head = t,
            t.done = !1,
            h)
        }
          , Z = (e, a) => {
            const n = a.length;
            let s, i, r;
            return D(e) ? _ : (s = e.state,
            0 !== s.wrap && s.mode !== k ? _ : s.mode === k && (i = 1,
            i = t(i, a, n, 0),
            i !== s.check) ? v : (r = z(e, a, n, n),
            r ? (s.mode = 16210,
            b) : (s.havedict = 1,
            h)))
        }
        ;
        const Q = (e, t) => Object.prototype.hasOwnProperty.call(e, t);
        let X = !0;
        try {
            String.fromCharCode.apply(null, new Uint8Array(1))
        } catch (e) {
            X = !1
        }
        const Y = new Uint8Array(256);
        for (let e = 0; e < 256; e++)
            Y[e] = e >= 252 ? 6 : e >= 248 ? 5 : e >= 240 ? 4 : e >= 224 ? 3 : e >= 192 ? 2 : 1;
        Y[254] = Y[254] = 1;
        var $ = (e, t) => {
            const a = t || e.length;
            if ("function" == typeof TextDecoder && TextDecoder.prototype.decode)
                return (new TextDecoder).decode(e.subarray(0, t));
            let n, s;
            const i = new Array(2 * a);
            for (s = 0,
            n = 0; n < a; ) {
                let t = e[n++];
                if (t < 128) {
                    i[s++] = t;
                    continue
                }
                let r = Y[t];
                if (r > 4)
                    i[s++] = 65533,
                    n += r - 1;
                else {
                    for (t &= 2 === r ? 31 : 3 === r ? 15 : 7; r > 1 && n < a; )
                        t = t << 6 | 63 & e[n++],
                        r--;
                    r > 1 ? i[s++] = 65533 : t < 65536 ? i[s++] = t : (t -= 65536,
                    i[s++] = 55296 | t >> 10 & 1023,
                    i[s++] = 56320 | 1023 & t)
                }
            }
            return ( (e, t) => {
                if (t < 65534 && e.subarray && X)
                    return String.fromCharCode.apply(null, e.length === t ? e : e.subarray(0, t));
                let a = "";
                for (let n = 0; n < t; n++)
                    a += String.fromCharCode(e[n]);
                return a
            }
            )(i, s)
        }
          , ee = (e, t) => {
            (t = t || e.length) > e.length && (t = e.length);
            let a = t - 1;
            for (; a >= 0 && 128 == (192 & e[a]); )
                a--;
            return a < 0 || 0 === a ? t : a + Y[e[a]] > t ? a : t
        }
          , te = {
            2: "need dictionary",
            1: "stream end",
            0: "",
            "-1": "file error",
            "-2": "stream error",
            "-3": "data error",
            "-4": "insufficient memory",
            "-5": "buffer error",
            "-6": "incompatible version"
        }
          , ae = function() {
            this.input = null,
            this.next_in = 0,
            this.avail_in = 0,
            this.total_in = 0,
            this.output = null,
            this.next_out = 0,
            this.avail_out = 0,
            this.total_out = 0,
            this.msg = "",
            this.state = null,
            this.data_type = 2,
            this.adler = 0
        }
          , ne = function() {
            this.text = 0,
            this.time = 0,
            this.xflags = 0,
            this.os = 0,
            this.extra = null,
            this.extra_len = 0,
            this.name = "",
            this.comment = "",
            this.hcrc = 0,
            this.done = !1
        };
        const se = Object.prototype.toString
          , {Z_NO_FLUSH: ie, Z_FINISH: re, Z_OK: pe, Z_STREAM_END: oe, Z_NEED_DICT: me, Z_STREAM_ERROR: de, Z_DATA_ERROR: ye, Z_MEM_ERROR: le} = y;
        function ce(e) {
            this.options = function(e) {
                const t = Array.prototype.slice.call(arguments, 1);
                for (; t.length; ) {
                    const a = t.shift();
                    if (a) {
                        if ("object" != typeof a)
                            throw new TypeError(a + "must be non-object");
                        for (const t in a)
                            Q(a, t) && (e[t] = a[t])
                    }
                }
                return e
            }({
                chunkSize: 65536,
                windowBits: 15,
                to: ""
            }, e || {});
            const t = this.options;
            t.raw && t.windowBits >= 0 && t.windowBits < 16 && (t.windowBits = -t.windowBits,
            0 === t.windowBits && (t.windowBits = -15)),
            !(t.windowBits >= 0 && t.windowBits < 16) || e && e.windowBits || (t.windowBits += 32),
            t.windowBits > 15 && t.windowBits < 48 && 0 == (15 & t.windowBits) && (t.windowBits |= 15),
            this.err = 0,
            this.msg = "",
            this.ended = !1,
            this.chunks = [],
            this.strm = new ae,
            this.strm.avail_out = 0;
            let a = K(this.strm, t.windowBits);
            if (a !== pe)
                throw new Error(te[a]);
            if (this.header = new ne,
            J(this.strm, this.header),
            t.dictionary && ("string" == typeof t.dictionary ? t.dictionary = (e => {
                if ("function" == typeof TextEncoder && TextEncoder.prototype.encode)
                    return (new TextEncoder).encode(e);
                let t, a, n, s, i, r = e.length, p = 0;
                for (s = 0; s < r; s++)
                    a = e.charCodeAt(s),
                    55296 == (64512 & a) && s + 1 < r && (n = e.charCodeAt(s + 1),
                    56320 == (64512 & n) && (a = 65536 + (a - 55296 << 10) + (n - 56320),
                    s++)),
                    p += a < 128 ? 1 : a < 2048 ? 2 : a < 65536 ? 3 : 4;
                for (t = new Uint8Array(p),
                i = 0,
                s = 0; i < p; s++)
                    a = e.charCodeAt(s),
                    55296 == (64512 & a) && s + 1 < r && (n = e.charCodeAt(s + 1),
                    56320 == (64512 & n) && (a = 65536 + (a - 55296 << 10) + (n - 56320),
                    s++)),
                    a < 128 ? t[i++] = a : a < 2048 ? (t[i++] = 192 | a >>> 6,
                    t[i++] = 128 | 63 & a) : a < 65536 ? (t[i++] = 224 | a >>> 12,
                    t[i++] = 128 | a >>> 6 & 63,
                    t[i++] = 128 | 63 & a) : (t[i++] = 240 | a >>> 18,
                    t[i++] = 128 | a >>> 12 & 63,
                    t[i++] = 128 | a >>> 6 & 63,
                    t[i++] = 128 | 63 & a);
                return t
            }
            )(t.dictionary) : "[object ArrayBuffer]" === se.call(t.dictionary) && (t.dictionary = new Uint8Array(t.dictionary)),
            t.raw && (a = Z(this.strm, t.dictionary),
            a !== pe)))
                throw new Error(te[a])
        }
        function ge(e, t) {
            const a = new ce(t);
            if (a.push(e),
            a.err)
                throw a.msg || te[a.err];
            return a.result
        }
        ce.prototype.push = function(e, t) {
            const a = this.strm
              , n = this.options.chunkSize
              , s = this.options.dictionary;
            let i, r, p;
            if (this.ended)
                return !1;
            for (r = t === ~~t ? t : !0 === t ? re : ie,
            "[object ArrayBuffer]" === se.call(e) ? a.input = new Uint8Array(e) : a.input = e,
            a.next_in = 0,
            a.avail_in = a.input.length; ; ) {
                for (0 === a.avail_out && (a.output = new Uint8Array(n),
                a.next_out = 0,
                a.avail_out = n),
                i = W(a, r),
                i === me && s && (i = Z(a, s),
                i === pe ? i = W(a, r) : i === ye && (i = me)); a.avail_in > 0 && i === oe && a.state.wrap > 0 && 0 !== e[a.next_in]; )
                    j(a),
                    i = W(a, r);
                switch (i) {
                case de:
                case ye:
                case me:
                case le:
                    return this.onEnd(i),
                    this.ended = !0,
                    !1
                }
                if (p = a.avail_out,
                a.next_out && (0 === a.avail_out || i === oe))
                    if ("string" === this.options.to) {
                        let e = ee(a.output, a.next_out)
                          , t = a.next_out - e
                          , s = $(a.output, e);
                        a.next_out = t,
                        a.avail_out = n - t,
                        t && a.output.set(a.output.subarray(e, e + t), 0),
                        this.onData(s)
                    } else
                        this.onData(a.output.length === a.next_out ? a.output : a.output.subarray(0, a.next_out));
                if (i !== pe || 0 !== p) {
                    if (i === oe)
                        return i = H(this.strm),
                        this.onEnd(i),
                        this.ended = !0,
                        !0;
                    if (0 === a.avail_in)
                        break
                }
            }
            return !0
        }
        ,
        ce.prototype.onData = function(e) {
            this.chunks.push(e)
        }
        ,
        ce.prototype.onEnd = function(e) {
            e === pe && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = (e => {
                let t = 0;
                for (let a = 0, n = e.length; a < n; a++)
                    t += e[a].length;
                const a = new Uint8Array(t);
                for (let t = 0, n = 0, s = e.length; t < s; t++) {
                    let s = e[t];
                    a.set(s, n),
                    n += s.length
                }
                return a
            }
            )(this.chunks)),
            this.chunks = [],
            this.err = e,
            this.msg = this.strm.msg
        }
        ;
        var he = ce
          , ue = ge
          , fe = function(e, t) {
            return (t = t || {}).raw = !0,
            ge(e, t)
        }
          , _e = ge
          , ve = y
          , be = {
            Inflate: he,
            inflate: ue,
            inflateRaw: fe,
            ungzip: _e,
            constants: ve
        };
        e.Inflate = he,
        e.constants = ve,
        e.default = be,
        e.inflate = ue,
        e.inflateRaw = fe,
        e.ungzip = _e,
        Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }(t)
}
, function(e, t, a) {
    "use strict";
    function n(e) {
        const t = e.length
          , a = new Array(t);
        for (let n = 0; n < t; ++n)
            a[n] = (e[n] < 16 ? "0" : "") + (e[n] || 0).toString(16);
        return a.join("")
    }
    function s(e) {
        const t = e.length
          , a = new Uint8Array(Math.ceil(t / 2));
        let n = 0;
        t % 2 && (a[n++] = parseInt(e.charAt(0), 16));
        for (let s = n; s < t; s += 2)
            a[n++] = parseInt(e.substr(s, 2), 16);
        return a
    }
    function i(e, t) {
        const a = e.length;
        if (a !== t.length)
            return !1;
        for (let n = 0; n < a; ++n)
            if (e[n] !== t[n])
                return !1;
        return !0
    }
    function r(e, t) {
        const a = e.length
          , n = new Uint8Array(a);
        for (let s = 0; s < a; ++s)
            n[s] = e[s] ^ t[s];
        return n
    }
    function p(e) {
        return e instanceof Uint8Array ? e : "string" == typeof e ? (new TextEncoder).encode(e) : new Uint8Array(e)
    }
    function o(...e) {
        const t = e.reduce( (e, t) => e + (t.byteLength || t.length), 0)
          , a = new Uint8Array(t);
        let n = 0;
        return e.forEach(e => {
            a.set(e instanceof ArrayBuffer ? new Uint8Array(e) : e, n),
            n += e.byteLength || e.length
        }
        ),
        a
    }
    function m(e) {
        const t = new Uint8Array(e.byteLength);
        for (let a = 0, n = 4 * e.length; a < n; ++a)
            t[a] = e[a >>> 2] >>> 24 - a % 4 * 8 & 255;
        return t
    }
    function d(e) {
        const t = p(e)
          , a = [];
        for (let e = 0, n = t.length; e < n; ++e)
            a[e >>> 2] |= t[e] << 24 - e % 4 * 8;
        return new Uint32Array(a)
    }
    a.r(t),
    a.d(t, "isWebpSupported", (function() {
        return Sa
    }
    )),
    Object.defineProperty(Uint8Array.prototype, "hex", {
        get: function() {
            return n(this)
        },
        set: function(e) {
            this.set(s(e))
        },
        enumerable: !0,
        configurable: !0
    }),
    Uint8Array.prototype.randomize = function() {
        if (!crypto || !("getRandomValues"in crypto))
            throw new Error("NO_SECURE_RANDOM");
        return crypto.getRandomValues(this),
        this
    }
    ,
    Uint8Array.prototype.concat = function(...e) {
        return o(this, ...e)
    }
    ,
    Uint8Array.prototype.toJSON = function() {
        return [...this]
    }
    ,
    Array.prototype.findAndSplice = function(e) {
        let t = this.findIndex(e);
        return -1 !== t ? this.splice(t, 1)[0] : void 0
    }
    ,
    String.prototype.toHHMMSS = function(e=!1) {
        const t = parseInt(this + "", 10)
          , a = Math.floor(t / 3600);
        let n = Math.floor((t - 3600 * a) / 60)
          , s = t - 3600 * a - 60 * n;
        return a && (e = !0),
        n < 10 && (n = e ? "0" + n : n),
        s < 10 && (s = "0" + s),
        (a ? a + ":" : "") + n + ":" + s
    }
    ,
    Promise.prototype.finally = Promise.prototype.finally || function(e) {
        const t = t => Promise.resolve(e()).then(t);
        return this.then(e => t( () => e), e => t( () => Promise.reject(e)))
    }
    ,
    Promise.prototype.safeFinally = function(e) {
        return this.catch( () => {}
        ).finally(e)
    }
    ;
    var y = {
        test: location.search.indexOf("test=1") > 0,
        debug: !1,
        http: !0,
        ssl: !0,
        multipleConnections: !0,
        asServiceWorker: !1
    };
    const l = y.debug
      , c = "undefined" != typeof window ? window : self;
    var g = l;
    const h = "undefined" != typeof WorkerGlobalScope && self instanceof WorkerGlobalScope
      , u = "undefined" != typeof ServiceWorkerGlobalScope && self instanceof ServiceWorkerGlobalScope
      , f = h || u
      , _ = (e, ...t) => {
        self.clients.matchAll({
            includeUncontrolled: !1,
            type: "window"
        }).then(a => {
            a.length && a.slice(e ? 0 : -1).forEach(e => {
                e.postMessage(...t)
            }
            )
        }
        )
    }
      , v = (...e) => {
        self.postMessage(...e)
    }
      , b = () => {}
      , P = u ? _.bind(null, !1) : h ? v : b
      , w = u ? _.bind(null, !0) : h ? v : b;
    class S {
        constructor() {
            this.prefix = "",
            this.cache = {},
            this.useStorage = !0,
            y.test && (this.prefix = "t_")
        }
        get(e, t=!0) {
            if (this.cache.hasOwnProperty(e) && t)
                return this.cache[e];
            if (this.useStorage) {
                let t;
                try {
                    t = localStorage.getItem(this.prefix + e)
                } catch (e) {
                    this.useStorage = !1
                }
                if (null !== t)
                    try {
                        t = JSON.parse(t)
                    } catch (e) {}
                else
                    t = void 0;
                return t
            }
        }
        set(e, t=!1) {
            for (const a in e)
                if (e.hasOwnProperty(a)) {
                    const n = e[a];
                    if (this.cache[a] = n,
                    this.useStorage && !t)
                        try {
                            const e = JSON.stringify(n);
                            localStorage.setItem(this.prefix + a, e)
                        } catch (e) {
                            this.useStorage = !1
                        }
                }
        }
        delete(e, t=!1) {
            e = "" + e,
            t || delete this.cache[e];
            try {
                localStorage.removeItem(this.prefix + e)
            } catch (e) {}
        }
        clear() {
            const e = ["dc", "server_time_offset", "xt_instance", "user_auth", "state_id", "token", "eitaa_auth"];
            for (let t = 1; t <= 5; ++t)
                e.push(`dc${t}_server_salt`),
                e.push(`dc${t}_auth_key`);
            for (let t of e)
                this.delete(t, !0)
        }
        toggleStorage(e) {
            if (this.useStorage = e,
            e)
                return this.set(this.cache);
            this.clear()
        }
    }
    class k {
        constructor() {
            this.taskId = 0,
            this.tasks = {},
            k.STORAGES.push(this),
            f || (this.storage = new S)
        }
        finishTask(e, t) {
            this.tasks.hasOwnProperty(e) && (this.tasks[e](t),
            delete this.tasks[e])
        }
        proxy(e, ...t) {
            return new Promise( (a, n) => {
                if (f) {
                    const n = this.taskId++;
                    this.tasks[n] = a;
                    P({
                        type: "localStorageProxy",
                        id: n,
                        payload: {
                            type: e,
                            args: t
                        }
                    })
                } else {
                    t = Array.prototype.slice.call(t);
                    a(this.storage[e].apply(this.storage, t))
                }
            }
            )
        }
        get(e, t) {
            return this.proxy("get", e, t)
        }
        set(e, t) {
            return this.proxy("set", e, t)
        }
        delete(e, t) {
            return this.proxy("delete", e, t)
        }
        clear() {
            return this.proxy("clear")
        }
        toggleStorage(e) {
            return this.proxy("toggleStorage", e)
        }
    }
    k.STORAGES = [];
    const I = new k;
    c.appStorage = I;
    var C, A = I, M = 0, R = 0, E = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_=!@#$%^&*()[]{}|;:,.<>/?`~ \\'\"+-";
    for (M = 0; 1 << M + 1 > 1 << M; M++)
        ;
    C = (R = (1 << (M >>= 1)) - 1) + 1;
    var T, V, U = pe(1, 1, 1), D = (pe(0, 1, 1),
    new Array(0)), x = D, B = D, F = D, L = D, O = D, N = D, q = D, G = D, z = D, j = D, K = D, W = D, H = D;
    function J(e) {
        var t, a, n;
        for (t = e.length - 1; 0 == e[t] && t > 0; t--)
            ;
        for (a = 0,
        n = e[t]; n; n >>= 1,
        a++)
            ;
        return a += M * t
    }
    function Z(e, t) {
        var a = pe(0, (e.length > t ? e.length : t) * M, 0);
        return ue(a, e),
        a
    }
    function Q(e, t) {
        var a = he(e);
        return Re(a, t),
        Ve(a, 1)
    }
    function X(e, t) {
        var a = Z(e, e.length + t.length);
        return function(e, t) {
            var a;
            x.length != 2 * e.length && (x = new Array(2 * e.length));
            for (fe(x, 0),
            a = 0; a < t.length; a++)
                t[a] && ke(x, e, t[a], a);
            ue(e, x)
        }(a, t),
        Ve(a, 1)
    }
    function Y(e, t, a) {
        var n = Z(e, a.length);
        return Ue(n, Ve(t, 2), Ve(a, 2)),
        Ve(n, 1)
    }
    function $(e, t) {
        var a = Z(e, e.length > t.length ? e.length + 1 : t.length + 1);
        return Ae(a, t),
        Ve(a, 1)
    }
    function ee(e, t) {
        var a = Z(e, e.length > t.length ? e.length + 1 : t.length + 1);
        return Me(a, t),
        Ve(a, 1)
    }
    function te(e, t, a, n, s) {
        var i = 0
          , r = Math.max(e.length, t.length);
        for (z.length != r && (z = new Array(r),
        j = new Array(r),
        K = new Array(r),
        W = new Array(r),
        H = new Array(r)); !(1 & e[0] || 1 & t[0]); )
            be(e),
            be(t),
            i++;
        for (ue(z, e),
        ue(a, t),
        fe(j, 1),
        fe(K, 0),
        fe(W, 0),
        fe(H, 1); ; ) {
            for (; !(1 & z[0]); )
                be(z),
                1 & j[0] || 1 & K[0] ? (Me(j, t),
                be(j),
                Ae(K, e),
                be(K)) : (be(j),
                be(K));
            for (; !(1 & a[0]); )
                be(a),
                1 & W[0] || 1 & H[0] ? (Me(W, t),
                be(W),
                Ae(H, e),
                be(H)) : (be(W),
                be(H));
            if (se(a, z) ? (Ae(a, z),
            Ae(W, j),
            Ae(H, K)) : (Ae(z, a),
            Ae(j, W),
            Ae(K, H)),
            me(z, 0)) {
                for (; ae(W); )
                    Me(W, t),
                    Ae(H, e);
                return we(H, -1),
                ue(n, W),
                ue(s, H),
                void Pe(a, i)
            }
        }
    }
    function ae(e) {
        return e[e.length - 1] >> M - 1 & 1
    }
    function ne(e, t, a) {
        var n, s = e.length, i = t.length;
        for (T = s + a < i ? s + a : i,
        n = i - 1 - a; n < s && n >= 0; n++)
            if (e[n] > 0)
                return 1;
        for (n = s - 1 + a; n < i; n++)
            if (t[n] > 0)
                return 0;
        for (n = T - 1; n >= a; n--) {
            if (e[n - a] > t[n])
                return 1;
            if (e[n - a] < t[n])
                return 0
        }
        return 0
    }
    function se(e, t) {
        var a, n = e.length < t.length ? e.length : t.length;
        for (a = e.length; a < t.length; a++)
            if (t[a])
                return 0;
        for (a = t.length; a < e.length; a++)
            if (e[a])
                return 1;
        for (a = n - 1; a >= 0; a--) {
            if (e[a] > t[a])
                return 1;
            if (e[a] < t[a])
                return 0
        }
        return 0
    }
    function ie(e, t, a, n) {
        var s, i, r, p, o, m, d, y;
        for (ue(n, e),
        i = t.length; 0 === t[i - 1]; i--)
            ;
        for (y = t[i - 1],
        d = 0; y; d++)
            y >>= 1;
        for (Pe(t, d = M - d),
        Pe(n, d),
        s = n.length; 0 === n[s - 1] && s > i; s--)
            ;
        for (fe(a, 0); !ne(t, n, s - i); )
            Ce(n, t, s - i),
            a[s - i]++;
        for (r = s - 1; r >= i; r--) {
            for (n[r] == t[i - 1] ? a[r - i] = R : a[r - i] = Math.floor((n[r] * C + n[r - 1]) / t[i - 1]); m = (o = (i > 1 ? t[i - 2] : 0) * a[r - i]) >> M,
            o &= R,
            m = (p = m + a[r - i] * t[i - 1]) >> M,
            p &= R,
            m == n[r] ? p == n[r - 1] ? o > (r > 1 ? n[r - 2] : 0) : p > n[r - 1] : m > n[r]; )
                a[r - i]--;
            ke(n, t, -a[r - i], r - i),
            ae(n) && (Ie(n, t, r - i),
            a[r - i]--)
        }
        ve(t, d),
        ve(n, d)
    }
    function re(e, t) {
        var a, n = 0;
        for (a = e.length - 1; a >= 0; a--)
            n = (n * C + e[a]) % t;
        return n
    }
    function pe(e, t, a) {
        var n;
        n = a > (n = Math.ceil(t / M) + 1) ? a : n;
        var s = new Array(n);
        return fe(s, e),
        s
    }
    function oe(e, t, a) {
        var n, s, i, r, p, o = e.length;
        if (-1 === t) {
            for (i = new Array(0); ; ) {
                for (r = new Array(i.length + 1),
                s = 0; s < i.length; s++)
                    r[s + 1] = i[s];
                if (r[0] = parseInt(e, 10),
                i = r,
                (n = e.indexOf(",", 0)) < 1)
                    break;
                if (0 == (e = e.substring(n + 1)).length)
                    break
            }
            return i.length < a ? (ue(r = new Array(a), i),
            r) : i
        }
        for (i = pe(0, t * o, 0),
        s = 0; s < o && (n = E.indexOf(e.substring(s, s + 1), 0),
        t <= 36 && n >= 36 && (n -= 26),
        !(n >= t || n < 0)); s++)
            we(i, t),
            _e(i, n);
        for (o = i.length; o > 0 && !i[o - 1]; o--)
            ;
        for (o = a > o + 1 ? a : o + 1,
        r = new Array(o),
        p = o < i.length ? o : i.length,
        s = 0; s < p; s++)
            r[s] = i[s];
        for (; s < o; s++)
            r[s] = 0;
        return r
    }
    function me(e, t) {
        var a;
        if (e[0] != t)
            return 0;
        for (a = 1; a < e.length; a++)
            if (e[a])
                return 0;
        return 1
    }
    function de(e, t) {
        var a, n = e.length < t.length ? e.length : t.length;
        for (a = 0; a < n; a++)
            if (e[a] !== t[a])
                return 0;
        if (e.length > t.length) {
            for (; a < e.length; a++)
                if (e[a])
                    return 0
        } else
            for (; a < t.length; a++)
                if (t[a])
                    return 0;
        return 1
    }
    function ye(e) {
        var t;
        for (t = 0; t < e.length; t++)
            if (e[t])
                return 0;
        return 1
    }
    function le(e, t) {
        var a, n, s = "";
        if (N.length !== e.length ? N = he(e) : ue(N, e),
        -1 === t) {
            for (a = e.length - 1; a > 0; a--)
                s += e[a] + ",";
            s += e[0]
        } else
            for (; !ye(N); )
                n = Se(N, t),
                s = E.substring(n, n + 1) + s;
        return 0 === s.length && (s = "0"),
        s
    }
    function ce(e, t=!0) {
        N.length !== e.length ? N = he(e) : ue(N, e);
        const a = [];
        for (; !ye(N); )
            D = Se(N, 256),
            a.push(D);
        return t && a.reverse(),
        a
    }
    function ge(e, t) {
        return se(e, t) ? 1 : de(e, t) ? 0 : -1
    }
    function he(e) {
        return ue(V = Array(e.length), e),
        V
    }
    function ue(e, t) {
        var a, n = e.length < t.length ? e.length : t.length;
        for (a = 0; a < n; a++)
            e[a] = t[a];
        for (a = n; a < e.length; a++)
            e[a] = 0
    }
    function fe(e, t) {
        var a, n, s = e.length;
        for (n = t,
        a = 0; a < s; a++)
            e[a] = n & R,
            n >>= M
    }
    function _e(e, t) {
        var a, n, s, i;
        for (e[0] += t,
        n = e.length,
        s = 0,
        a = 0; a < n; a++)
            if (i = 0,
            (s += e[a]) < 0 && (s += (i = -(s >> M)) * C),
            e[a] = s & R,
            !(s = (s >> M) - i))
                return
    }
    function ve(e, t) {
        var a, n = Math.floor(t / M);
        if (n) {
            for (a = 0; a < e.length - n; a++)
                e[a] = e[a + n];
            for (; a < e.length; a++)
                e[a] = 0;
            t %= M
        }
        for (a = 0; a < e.length - 1; a++)
            e[a] = R & (e[a + 1] << M - t | e[a] >> t);
        e[a] >>= t
    }
    function be(e) {
        var t;
        for (t = 0; t < e.length - 1; t++)
            e[t] = R & (e[t + 1] << M - 1 | e[t] >> 1);
        e[t] = e[t] >> 1 | e[t] & C >> 1
    }
    function Pe(e, t) {
        var a, n = Math.floor(t / M);
        if (n) {
            for (a = e.length; a >= n; a--)
                e[a] = e[a - n];
            for (; a >= 0; a--)
                e[a] = 0;
            t %= M
        }
        if (t) {
            for (a = e.length - 1; a > 0; a--)
                e[a] = R & (e[a] << t | e[a - 1] >> M - t);
            e[a] = R & e[a] << t
        }
    }
    function we(e, t) {
        var a, n, s, i;
        if (t)
            for (n = e.length,
            s = 0,
            a = 0; a < n; a++)
                i = 0,
                (s += e[a] * t) < 0 && (s += (i = -(s >> M)) * C),
                e[a] = s & R,
                s = (s >> M) - i
    }
    function Se(e, t) {
        var a, n, s = 0;
        for (a = e.length - 1; a >= 0; a--)
            n = s * C + e[a],
            e[a] = Math.floor(n / t),
            s = n % t;
        return s
    }
    function ke(e, t, a, n) {
        var s, i, r, p;
        for (r = e.length < n + t.length ? e.length : n + t.length,
        p = e.length,
        i = 0,
        s = n; s < r; s++)
            i += e[s] + a * t[s - n],
            e[s] = i & R,
            i >>= M;
        for (s = r; i && s < p; s++)
            i += e[s],
            e[s] = i & R,
            i >>= M
    }
    function Ie(e, t, a) {
        var n, s, i, r;
        for (i = e.length < a + t.length ? e.length : a + t.length,
        r = e.length,
        s = 0,
        n = a; n < i; n++)
            s += e[n] + t[n - a],
            e[n] = s & R,
            s >>= M;
        for (n = i; s && n < r; n++)
            s += e[n],
            e[n] = s & R,
            s >>= M
    }
    function Ce(e, t, a) {
        var n, s, i, r;
        for (i = e.length < a + t.length ? e.length : a + t.length,
        r = e.length,
        s = 0,
        n = a; n < i; n++)
            s += e[n] - t[n - a],
            e[n] = s & R,
            s >>= M;
        for (n = i; s && n < r; n++)
            s += e[n],
            e[n] = s & R,
            s >>= M
    }
    function Ae(e, t) {
        var a, n, s;
        for (s = e.length < t.length ? e.length : t.length,
        n = 0,
        a = 0; a < s; a++)
            n += e[a] - t[a],
            e[a] = n & R,
            n >>= M;
        for (a = s; n && a < e.length; a++)
            n += e[a],
            e[a] = n & R,
            n >>= M
    }
    function Me(e, t) {
        var a, n, s;
        for (s = e.length < t.length ? e.length : t.length,
        n = 0,
        a = 0; a < s; a++)
            n += e[a] + t[a],
            e[a] = n & R,
            n >>= M;
        for (a = s; n && a < e.length; a++)
            n += e[a],
            e[a] = n & R,
            n >>= M
    }
    function Re(e, t) {
        L.length !== e.length ? L = he(e) : ue(L, e),
        O.length !== e.length && (O = he(e)),
        ie(L, t, O, e)
    }
    function Ee(e, t, a) {
        var n;
        for (B.length != 2 * e.length && (B = new Array(2 * e.length)),
        fe(B, 0),
        n = 0; n < t.length; n++)
            t[n] && ke(B, e, t[n], n);
        Re(B, a),
        ue(e, B)
    }
    function Te(e, t) {
        var a, n, s, i, r;
        for (i = e.length; i > 0 && !e[i - 1]; i--)
            ;
        for (r = i > t.length ? 2 * i : 2 * t.length,
        B.length != r && (B = new Array(r)),
        fe(B, 0),
        a = 0; a < i; a++) {
            for (s = B[2 * a] + e[a] * e[a],
            B[2 * a] = s & R,
            s >>= M,
            n = a + 1; n < i; n++)
                s = B[a + n] + 2 * e[a] * e[n] + s,
                B[a + n] = s & R,
                s >>= M;
            B[a + i] = s
        }
        Re(B, t),
        ue(e, B)
    }
    function Ve(e, t) {
        var a, n;
        for (a = e.length; a > 0 && !e[a - 1]; a--)
            ;
        return ue(n = new Array(a + t), e),
        n
    }
    function Ue(e, t, a) {
        var n, s, i, r;
        if (q.length != a.length && (q = he(a)),
        0 != (1 & a[0])) {
            for (fe(q, 0),
            i = a.length; i > 0 && !a[i - 1]; i--)
                ;
            for (r = C - function(e, t) {
                for (var a = 1, n = 0; ; ) {
                    if (1 === e)
                        return a;
                    if (0 === e)
                        return 0;
                    if (n -= a * Math.floor(t / e),
                    1 === (t %= e))
                        return n;
                    if (0 === t)
                        return 0;
                    a -= n * Math.floor(e / t),
                    e %= t
                }
            }(re(a, C), C),
            q[i] = 1,
            Ee(e, q, a),
            F.length != e.length ? F = he(e) : ue(F, e),
            n = t.length - 1; n > 0 & !t[n]; n--)
                ;
            if (0 != t[n]) {
                for (s = 1 << M - 1; s && !(t[n] & s); s >>= 1)
                    ;
                for (; ; ) {
                    if (!(s >>= 1)) {
                        if (--n < 0)
                            return void De(e, U, a, r);
                        s = 1 << M - 1
                    }
                    De(e, e, a, r),
                    s & t[n] && De(e, F, a, r)
                }
            } else
                fe(e, 1)
        } else
            for (ue(q, e),
            fe(e, 1); !me(t, 0); )
                1 & t[0] && Ee(e, q, a),
                Se(t, 2),
                Te(q, a)
    }
    function De(e, t, a, n) {
        var s, i, r, p, o, m, d = a.length, y = t.length;
        for (G.length != d && (G = new Array(d)),
        fe(G, 0); d > 0 && 0 == a[d - 1]; d--)
            ;
        for (; y > 0 && 0 == t[y - 1]; y--)
            ;
        for (m = G.length - 1,
        s = 0; s < d; s++) {
            for (r = (o = G[0] + e[s] * t[0]) + (p = (o & R) * n & R) * a[0] >> M,
            o = e[s],
            i = 1; i < y - 4; )
                r += G[i] + p * a[i] + o * t[i],
                G[i - 1] = r & R,
                r >>= M,
                i++,
                r += G[i] + p * a[i] + o * t[i],
                G[i - 1] = r & R,
                r >>= M,
                i++,
                r += G[i] + p * a[i] + o * t[i],
                G[i - 1] = r & R,
                r >>= M,
                i++,
                r += G[i] + p * a[i] + o * t[i],
                G[i - 1] = r & R,
                r >>= M,
                i++,
                r += G[i] + p * a[i] + o * t[i],
                G[i - 1] = r & R,
                r >>= M,
                i++;
            for (; i < y; )
                r += G[i] + p * a[i] + o * t[i],
                G[i - 1] = r & R,
                r >>= M,
                i++;
            for (; i < d - 4; )
                r += G[i] + p * a[i],
                G[i - 1] = r & R,
                r >>= M,
                i++,
                r += G[i] + p * a[i],
                G[i - 1] = r & R,
                r >>= M,
                i++,
                r += G[i] + p * a[i],
                G[i - 1] = r & R,
                r >>= M,
                i++,
                r += G[i] + p * a[i],
                G[i - 1] = r & R,
                r >>= M,
                i++,
                r += G[i] + p * a[i],
                G[i - 1] = r & R,
                r >>= M,
                i++;
            for (; i < d; )
                r += G[i] + p * a[i],
                G[i - 1] = r & R,
                r >>= M,
                i++;
            for (; i < m; )
                r += G[i],
                G[i - 1] = r & R,
                r >>= M,
                i++;
            G[i - 1] = r & R
        }
        se(a, G) || Ae(G, a),
        ue(e, G)
    }
    function xe(e) {
        return "object" == typeof e && null !== e
    }
    function Be(e) {
        return e >>> 0
    }
    function Fe(e, t) {
        e = Be(e),
        t = Be(t);
        const a = oe(e.toString(16), 16, 32);
        Pe(a, 32),
        Me(a, oe(t.toString(16), 16, 32));
        return le(a, 10)
    }
    function Le(e, t=16, a, n=!1, s=!1) {
        const i = e.byteLength || e.length
          , r = n ? t - i : t - i % t;
        if (r > 0 && r < t) {
            const t = new Uint8Array(r);
            if (a)
                for (let e = 0; e < r; ++e)
                    t[e] = 0;
            else
                t.randomize();
            return e instanceof ArrayBuffer ? (s ? o(t, e) : o(e, t)).buffer : e instanceof Uint8Array ? s ? o(t, e) : o(e, t) : s ? [...t].concat(e) : e.concat([...t])
        }
        return e
    }
    var Oe = {
        MTProto: {
            constructors: [{
                id: 481674261,
                predicate: "vector",
                params: [],
                type: "Vector t"
            }, {
                id: 85337187,
                predicate: "resPQ",
                params: [{
                    name: "nonce",
                    type: "int128"
                }, {
                    name: "server_nonce",
                    type: "int128"
                }, {
                    name: "pq",
                    type: "bytes"
                }, {
                    name: "server_public_key_fingerprints",
                    type: "Vector<long>"
                }],
                type: "ResPQ"
            }, {
                id: -1443537003,
                predicate: "p_q_inner_data_dc",
                params: [{
                    name: "pq",
                    type: "bytes"
                }, {
                    name: "p",
                    type: "bytes"
                }, {
                    name: "q",
                    type: "bytes"
                }, {
                    name: "nonce",
                    type: "int128"
                }, {
                    name: "server_nonce",
                    type: "int128"
                }, {
                    name: "new_nonce",
                    type: "int256"
                }, {
                    name: "dc",
                    type: "int"
                }],
                type: "P_Q_inner_data"
            }, {
                id: 1459478408,
                predicate: "p_q_inner_data_temp_dc",
                params: [{
                    name: "pq",
                    type: "bytes"
                }, {
                    name: "p",
                    type: "bytes"
                }, {
                    name: "q",
                    type: "bytes"
                }, {
                    name: "nonce",
                    type: "int128"
                }, {
                    name: "server_nonce",
                    type: "int128"
                }, {
                    name: "new_nonce",
                    type: "int256"
                }, {
                    name: "dc",
                    type: "int"
                }, {
                    name: "expires_in",
                    type: "int"
                }],
                type: "P_Q_inner_data"
            }, {
                id: -790100132,
                predicate: "server_DH_params_ok",
                params: [{
                    name: "nonce",
                    type: "int128"
                }, {
                    name: "server_nonce",
                    type: "int128"
                }, {
                    name: "encrypted_answer",
                    type: "bytes"
                }],
                type: "Server_DH_Params"
            }, {
                id: -1249309254,
                predicate: "server_DH_inner_data",
                params: [{
                    name: "nonce",
                    type: "int128"
                }, {
                    name: "server_nonce",
                    type: "int128"
                }, {
                    name: "g",
                    type: "int"
                }, {
                    name: "dh_prime",
                    type: "bytes"
                }, {
                    name: "g_a",
                    type: "bytes"
                }, {
                    name: "server_time",
                    type: "int"
                }],
                type: "Server_DH_inner_data"
            }, {
                id: 1715713620,
                predicate: "client_DH_inner_data",
                params: [{
                    name: "nonce",
                    type: "int128"
                }, {
                    name: "server_nonce",
                    type: "int128"
                }, {
                    name: "retry_id",
                    type: "long"
                }, {
                    name: "g_b",
                    type: "bytes"
                }],
                type: "Client_DH_Inner_Data"
            }, {
                id: 1003222836,
                predicate: "dh_gen_ok",
                params: [{
                    name: "nonce",
                    type: "int128"
                }, {
                    name: "server_nonce",
                    type: "int128"
                }, {
                    name: "new_nonce_hash1",
                    type: "int128"
                }],
                type: "Set_client_DH_params_answer"
            }, {
                id: 1188831161,
                predicate: "dh_gen_retry",
                params: [{
                    name: "nonce",
                    type: "int128"
                }, {
                    name: "server_nonce",
                    type: "int128"
                }, {
                    name: "new_nonce_hash2",
                    type: "int128"
                }],
                type: "Set_client_DH_params_answer"
            }, {
                id: -1499615742,
                predicate: "dh_gen_fail",
                params: [{
                    name: "nonce",
                    type: "int128"
                }, {
                    name: "server_nonce",
                    type: "int128"
                }, {
                    name: "new_nonce_hash3",
                    type: "int128"
                }],
                type: "Set_client_DH_params_answer"
            }, {
                id: 1973679973,
                predicate: "bind_auth_key_inner",
                params: [{
                    name: "nonce",
                    type: "long"
                }, {
                    name: "temp_auth_key_id",
                    type: "long"
                }, {
                    name: "perm_auth_key_id",
                    type: "long"
                }, {
                    name: "temp_session_id",
                    type: "long"
                }, {
                    name: "expires_at",
                    type: "int"
                }],
                type: "BindAuthKeyInner"
            }, {
                id: -212046591,
                predicate: "rpc_result",
                params: [{
                    name: "req_msg_id",
                    type: "long"
                }, {
                    name: "result",
                    type: "Object"
                }],
                type: "RpcResult"
            }, {
                id: 558156313,
                predicate: "rpc_error",
                params: [{
                    name: "error_code",
                    type: "int"
                }, {
                    name: "error_message",
                    type: "string"
                }],
                type: "RpcError"
            }, {
                id: 1579864942,
                predicate: "rpc_answer_unknown",
                params: [],
                type: "RpcDropAnswer"
            }, {
                id: -847714938,
                predicate: "rpc_answer_dropped_running",
                params: [],
                type: "RpcDropAnswer"
            }, {
                id: -1539647305,
                predicate: "rpc_answer_dropped",
                params: [{
                    name: "msg_id",
                    type: "long"
                }, {
                    name: "seq_no",
                    type: "int"
                }, {
                    name: "bytes",
                    type: "int"
                }],
                type: "RpcDropAnswer"
            }, {
                id: 155834844,
                predicate: "future_salt",
                params: [{
                    name: "valid_since",
                    type: "int"
                }, {
                    name: "valid_until",
                    type: "int"
                }, {
                    name: "salt",
                    type: "long"
                }],
                type: "FutureSalt"
            }, {
                id: -1370486635,
                predicate: "future_salts",
                params: [{
                    name: "req_msg_id",
                    type: "long"
                }, {
                    name: "now",
                    type: "int"
                }, {
                    name: "salts",
                    type: "vector<future_salt>"
                }],
                type: "FutureSalts"
            }, {
                id: 880243653,
                predicate: "pong",
                params: [{
                    name: "msg_id",
                    type: "long"
                }, {
                    name: "ping_id",
                    type: "long"
                }],
                type: "Pong"
            }, {
                id: -501201412,
                predicate: "destroy_session_ok",
                params: [{
                    name: "session_id",
                    type: "long"
                }],
                type: "DestroySessionRes"
            }, {
                id: 1658015945,
                predicate: "destroy_session_none",
                params: [{
                    name: "session_id",
                    type: "long"
                }],
                type: "DestroySessionRes"
            }, {
                id: -1631450872,
                predicate: "new_session_created",
                params: [{
                    name: "first_msg_id",
                    type: "long"
                }, {
                    name: "unique_id",
                    type: "long"
                }, {
                    name: "server_salt",
                    type: "long"
                }],
                type: "NewSession"
            }, {
                id: 1945237724,
                predicate: "msg_container",
                params: [{
                    name: "messages",
                    type: "vector<%Message>"
                }],
                type: "MessageContainer"
            }, {
                id: 1538843921,
                predicate: "message",
                params: [{
                    name: "msg_id",
                    type: "long"
                }, {
                    name: "seqno",
                    type: "int"
                }, {
                    name: "bytes",
                    type: "int"
                }, {
                    name: "body",
                    type: "Object"
                }],
                type: "Message"
            }, {
                id: -530561358,
                predicate: "msg_copy",
                params: [{
                    name: "orig_message",
                    type: "Message"
                }],
                type: "MessageCopy"
            }, {
                id: 812830625,
                predicate: "gzip_packed",
                params: [{
                    name: "packed_data",
                    type: "bytes"
                }],
                type: "Object"
            }, {
                id: 1658238041,
                predicate: "msgs_ack",
                params: [{
                    name: "msg_ids",
                    type: "Vector<long>"
                }],
                type: "MsgsAck"
            }, {
                id: -1477445615,
                predicate: "bad_msg_notification",
                params: [{
                    name: "bad_msg_id",
                    type: "long"
                }, {
                    name: "bad_msg_seqno",
                    type: "int"
                }, {
                    name: "error_code",
                    type: "int"
                }],
                type: "BadMsgNotification"
            }, {
                id: -307542917,
                predicate: "bad_server_salt",
                params: [{
                    name: "bad_msg_id",
                    type: "long"
                }, {
                    name: "bad_msg_seqno",
                    type: "int"
                }, {
                    name: "error_code",
                    type: "int"
                }, {
                    name: "new_server_salt",
                    type: "long"
                }],
                type: "BadMsgNotification"
            }, {
                id: 2105940488,
                predicate: "msg_resend_req",
                params: [{
                    name: "msg_ids",
                    type: "Vector<long>"
                }],
                type: "MsgResendReq"
            }, {
                id: -630588590,
                predicate: "msgs_state_req",
                params: [{
                    name: "msg_ids",
                    type: "Vector<long>"
                }],
                type: "MsgsStateReq"
            }, {
                id: 81704317,
                predicate: "msgs_state_info",
                params: [{
                    name: "req_msg_id",
                    type: "long"
                }, {
                    name: "info",
                    type: "bytes"
                }],
                type: "MsgsStateInfo"
            }, {
                id: -1933520591,
                predicate: "msgs_all_info",
                params: [{
                    name: "msg_ids",
                    type: "Vector<long>"
                }, {
                    name: "info",
                    type: "bytes"
                }],
                type: "MsgsAllInfo"
            }, {
                id: 661470918,
                predicate: "msg_detailed_info",
                params: [{
                    name: "msg_id",
                    type: "long"
                }, {
                    name: "answer_msg_id",
                    type: "long"
                }, {
                    name: "bytes",
                    type: "int"
                }, {
                    name: "status",
                    type: "int"
                }],
                type: "MsgDetailedInfo"
            }, {
                id: -2137147681,
                predicate: "msg_new_detailed_info",
                params: [{
                    name: "answer_msg_id",
                    type: "long"
                }, {
                    name: "bytes",
                    type: "int"
                }, {
                    name: "status",
                    type: "int"
                }],
                type: "MsgDetailedInfo"
            }, {
                id: -161422892,
                predicate: "destroy_auth_key_ok",
                params: [],
                type: "DestroyAuthKeyRes"
            }, {
                id: 178201177,
                predicate: "destroy_auth_key_none",
                params: [],
                type: "DestroyAuthKeyRes"
            }, {
                id: -368010477,
                predicate: "destroy_auth_key_fail",
                params: [],
                type: "DestroyAuthKeyRes"
            }, {
                id: -601545863,
                predicate: "eitaa_updates_expire_token",
                params: [],
                type: "EitaaUpdatesExpireToken"
            }, {
                id: -1519642063,
                predicate: "eitaa_updates_token",
                params: [{
                    name: "token",
                    type: "string"
                }, {
                    name: "expire",
                    type: "int"
                }, {
                    name: "date",
                    type: "int"
                }],
                type: "EitaaUpdatesToken"
            }, {
                id: -601545867,
                predicate: "eitaa_token_updating",
                params: [],
                type: "EitaaTokenUpdating"
            }, {
                id: -899560710,
                predicate: "adsOpenLinkAction",
                params: [{
                    name: "link",
                    type: "string"
                }],
                type: "AdsClickAction"
            }, {
                id: -1661694581,
                predicate: "adsOpenExternalLinkAction",
                params: [{
                    name: "link",
                    type: "string"
                }],
                type: "AdsClickAction"
            }, {
                id: 155099767,
                predicate: "adsIntentAction",
                params: [{
                    name: "uri",
                    type: "string"
                }],
                type: "AdsClickAction"
            }, {
                id: -545239366,
                predicate: "adsAdPack",
                params: [{
                    name: "title",
                    type: "string"
                }, {
                    name: "ads",
                    type: "Vector<AdsAd>"
                }],
                type: "AdsAdPack"
            }, {
                id: 812057886,
                method: "adsDialogAd",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "pinnedBackground",
                    type: "flags.2?true"
                }, {
                    name: "muted",
                    type: "flags.3?true"
                }, {
                    name: "verified",
                    type: "flags.4?true"
                }, {
                    name: "expire",
                    type: "int"
                }, {
                    name: "type",
                    type: "int"
                }, {
                    name: "id",
                    type: "int"
                }, {
                    name: "action",
                    type: "AdsClickAction"
                }, {
                    name: "title",
                    type: "string"
                }, {
                    name: "badge",
                    type: "string"
                }, {
                    name: "message",
                    type: "string"
                }, {
                    name: "thumbs",
                    type: "Vector<PhotoSize>"
                }, {
                    name: "unreadCount",
                    type: "int"
                }],
                type: "AdsAd.adsDialogAd"
            }, {
                id: -1205172244,
                method: "adsEmptyAd",
                params: [{
                    name: "expires",
                    type: "int"
                }],
                type: "AdsAd.adsEmptyAd"
            }, {
                id: 1635347945,
                predicate: "eitaaAppInfo",
                params: [{
                    name: "build_version",
                    type: "int"
                }, {
                    name: "device_model",
                    type: "string"
                }, {
                    name: "system_version",
                    type: "string"
                }, {
                    name: "app_version",
                    type: "string"
                }, {
                    name: "lang_code",
                    type: "string"
                }, {
                    name: "sign",
                    type: "string"
                }],
                type: "EitaaAppInfo"
            }, {
                id: 1587643126,
                predicate: "account.noPassword",
                params: [{
                    name: "new_salt",
                    type: "bytes"
                }, {
                    name: "new_secure_salt",
                    type: "bytes"
                }, {
                    name: "secure_random",
                    type: "bytes"
                }, {
                    name: "email_unconfirmed_pattern",
                    type: "string"
                }],
                type: "account.Password"
            }],
            methods: [{
                id: -1099002127,
                method: "req_pq_multi",
                params: [{
                    name: "nonce",
                    type: "int128"
                }],
                type: "ResPQ"
            }, {
                id: -686627650,
                method: "req_DH_params",
                params: [{
                    name: "nonce",
                    type: "int128"
                }, {
                    name: "server_nonce",
                    type: "int128"
                }, {
                    name: "p",
                    type: "bytes"
                }, {
                    name: "q",
                    type: "bytes"
                }, {
                    name: "public_key_fingerprint",
                    type: "long"
                }, {
                    name: "encrypted_data",
                    type: "bytes"
                }],
                type: "Server_DH_Params"
            }, {
                id: -184262881,
                method: "set_client_DH_params",
                params: [{
                    name: "nonce",
                    type: "int128"
                }, {
                    name: "server_nonce",
                    type: "int128"
                }, {
                    name: "encrypted_data",
                    type: "bytes"
                }],
                type: "Set_client_DH_params_answer"
            }, {
                id: 1491380032,
                method: "rpc_drop_answer",
                params: [{
                    name: "req_msg_id",
                    type: "long"
                }],
                type: "RpcDropAnswer"
            }, {
                id: -1188971260,
                method: "get_future_salts",
                params: [{
                    name: "num",
                    type: "int"
                }],
                type: "FutureSalts"
            }, {
                id: 2059302892,
                method: "ping",
                params: [{
                    name: "ping_id",
                    type: "long"
                }],
                type: "Pong"
            }, {
                id: -213746804,
                method: "ping_delay_disconnect",
                params: [{
                    name: "ping_id",
                    type: "long"
                }, {
                    name: "disconnect_delay",
                    type: "int"
                }],
                type: "Pong"
            }, {
                id: -414113498,
                method: "destroy_session",
                params: [{
                    name: "session_id",
                    type: "long"
                }],
                type: "DestroySessionRes"
            }, {
                id: -1835453025,
                method: "http_wait",
                params: [{
                    name: "max_delay",
                    type: "int"
                }, {
                    name: "wait_after",
                    type: "int"
                }, {
                    name: "max_wait",
                    type: "int"
                }],
                type: "HttpWait"
            }, {
                id: -784117408,
                method: "destroy_auth_key",
                params: [],
                type: "DestroyAuthKeyRes"
            }, {
                id: -601545863,
                method: "eitaaUpdatesExpireToken",
                params: [],
                type: "EitaaUpdatesExpireToken"
            }, {
                id: -601545867,
                method: "eitaaTokenUpdating",
                params: [],
                type: "EitaaTokenUpdating"
            }]
        },
        API: {
            constructors: [{
                id: -1132882121,
                predicate: "boolFalse",
                params: [],
                type: "Bool"
            }, {
                id: -1720552011,
                predicate: "boolTrue",
                params: [],
                type: "Bool"
            }, {
                id: 1072550713,
                predicate: "true",
                params: [],
                type: "True"
            }, {
                id: 481674261,
                predicate: "vector",
                params: [],
                type: "Vector t"
            }, {
                id: -994444869,
                predicate: "error",
                params: [{
                    name: "code",
                    type: "int"
                }, {
                    name: "text",
                    type: "string"
                }],
                type: "Error"
            }, {
                id: 1450380236,
                predicate: "null",
                params: [],
                type: "Null"
            }, {
                id: 2134579434,
                predicate: "inputPeerEmpty",
                params: [],
                type: "InputPeer"
            }, {
                id: 2107670217,
                predicate: "inputPeerSelf",
                params: [],
                type: "InputPeer"
            }, {
                id: 900291769,
                predicate: "inputPeerChat",
                params: [{
                    name: "chat_id",
                    type: "long"
                }],
                type: "InputPeer"
            }, {
                id: -571955892,
                predicate: "inputPeerUser",
                params: [{
                    name: "user_id",
                    type: "long"
                }, {
                    name: "access_hash",
                    type: "long"
                }],
                type: "InputPeer"
            }, {
                id: 666680316,
                predicate: "inputPeerChannel",
                params: [{
                    name: "channel_id",
                    type: "long"
                }, {
                    name: "access_hash",
                    type: "long"
                }],
                type: "InputPeer"
            }, {
                id: -1468331492,
                predicate: "inputPeerUserFromMessage",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "msg_id",
                    type: "int"
                }, {
                    name: "user_id",
                    type: "long"
                }],
                type: "InputPeer"
            }, {
                id: -1121318848,
                predicate: "inputPeerChannelFromMessage",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "msg_id",
                    type: "int"
                }, {
                    name: "channel_id",
                    type: "long"
                }],
                type: "InputPeer"
            }, {
                id: -1182234929,
                predicate: "inputUserEmpty",
                params: [],
                type: "InputUser"
            }, {
                id: -138301121,
                predicate: "inputUserSelf",
                params: [],
                type: "InputUser"
            }, {
                id: -233744186,
                predicate: "inputUser",
                params: [{
                    name: "user_id",
                    type: "long"
                }, {
                    name: "access_hash",
                    type: "long"
                }],
                type: "InputUser"
            }, {
                id: 497305826,
                predicate: "inputUserFromMessage",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "msg_id",
                    type: "int"
                }, {
                    name: "user_id",
                    type: "long"
                }],
                type: "InputUser"
            }, {
                id: -208488460,
                predicate: "inputPhoneContact",
                params: [{
                    name: "client_id",
                    type: "long"
                }, {
                    name: "phone",
                    type: "string"
                }, {
                    name: "first_name",
                    type: "string"
                }, {
                    name: "last_name",
                    type: "string"
                }],
                type: "InputContact"
            }, {
                id: -181407105,
                predicate: "inputFile",
                params: [{
                    name: "id",
                    type: "long"
                }, {
                    name: "parts",
                    type: "int"
                }, {
                    name: "name",
                    type: "string"
                }, {
                    name: "md5_checksum",
                    type: "string"
                }],
                type: "InputFile"
            }, {
                id: -95482955,
                predicate: "inputFileBig",
                params: [{
                    name: "id",
                    type: "long"
                }, {
                    name: "parts",
                    type: "int"
                }, {
                    name: "name",
                    type: "string"
                }],
                type: "InputFile"
            }, {
                id: -1771768449,
                predicate: "inputMediaEmpty",
                params: [],
                type: "InputMedia"
            }, {
                id: 505969924,
                predicate: "inputMediaUploadedPhoto",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "file",
                    type: "InputFile"
                }, {
                    name: "stickers",
                    type: "flags.0?Vector<InputDocument>"
                }, {
                    name: "ttl_seconds",
                    type: "flags.1?int"
                }],
                type: "InputMedia"
            }, {
                id: -1279654347,
                predicate: "inputMediaPhoto",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "id",
                    type: "InputPhoto"
                }, {
                    name: "ttl_seconds",
                    type: "flags.0?int"
                }],
                type: "InputMedia"
            }, {
                id: -104578748,
                predicate: "inputMediaGeoPoint",
                params: [{
                    name: "geo_point",
                    type: "InputGeoPoint"
                }],
                type: "InputMedia"
            }, {
                id: -122978821,
                predicate: "inputMediaContact",
                params: [{
                    name: "phone_number",
                    type: "string"
                }, {
                    name: "first_name",
                    type: "string"
                }, {
                    name: "last_name",
                    type: "string"
                }, {
                    name: "vcard",
                    type: "string"
                }],
                type: "InputMedia"
            }, {
                id: 1530447553,
                predicate: "inputMediaUploadedDocument",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "nosound_video",
                    type: "flags.3?true"
                }, {
                    name: "force_file",
                    type: "flags.4?true"
                }, {
                    name: "file",
                    type: "InputFile"
                }, {
                    name: "thumb",
                    type: "flags.2?InputFile"
                }, {
                    name: "mime_type",
                    type: "string"
                }, {
                    name: "attributes",
                    type: "Vector<DocumentAttribute>"
                }, {
                    name: "stickers",
                    type: "flags.0?Vector<InputDocument>"
                }, {
                    name: "ttl_seconds",
                    type: "flags.1?int"
                }],
                type: "InputMedia"
            }, {
                id: 860303448,
                predicate: "inputMediaDocument",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "id",
                    type: "InputDocument"
                }, {
                    name: "ttl_seconds",
                    type: "flags.0?int"
                }, {
                    name: "query",
                    type: "flags.1?string"
                }],
                type: "InputMedia"
            }, {
                id: -1052959727,
                predicate: "inputMediaVenue",
                params: [{
                    name: "geo_point",
                    type: "InputGeoPoint"
                }, {
                    name: "title",
                    type: "string"
                }, {
                    name: "address",
                    type: "string"
                }, {
                    name: "provider",
                    type: "string"
                }, {
                    name: "venue_id",
                    type: "string"
                }, {
                    name: "venue_type",
                    type: "string"
                }],
                type: "InputMedia"
            }, {
                id: -440664550,
                predicate: "inputMediaPhotoExternal",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "url",
                    type: "string"
                }, {
                    name: "ttl_seconds",
                    type: "flags.0?int"
                }],
                type: "InputMedia"
            }, {
                id: -78455655,
                predicate: "inputMediaDocumentExternal",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "url",
                    type: "string"
                }, {
                    name: "ttl_seconds",
                    type: "flags.0?int"
                }],
                type: "InputMedia"
            }, {
                id: -750828557,
                predicate: "inputMediaGame",
                params: [{
                    name: "id",
                    type: "InputGame"
                }],
                type: "InputMedia"
            }, {
                id: -646342540,
                predicate: "inputMediaInvoice",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "title",
                    type: "string"
                }, {
                    name: "description",
                    type: "string"
                }, {
                    name: "photo",
                    type: "flags.0?InputWebDocument"
                }, {
                    name: "invoice",
                    type: "Invoice"
                }, {
                    name: "payload",
                    type: "bytes"
                }, {
                    name: "provider",
                    type: "string"
                }, {
                    name: "provider_data",
                    type: "DataJSON"
                }, {
                    name: "start_param",
                    type: "flags.1?string"
                }],
                type: "InputMedia"
            }, {
                id: -1759532989,
                predicate: "inputMediaGeoLive",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "stopped",
                    type: "flags.0?true"
                }, {
                    name: "geo_point",
                    type: "InputGeoPoint"
                }, {
                    name: "heading",
                    type: "flags.2?int"
                }, {
                    name: "period",
                    type: "flags.1?int"
                }, {
                    name: "proximity_notification_radius",
                    type: "flags.3?int"
                }],
                type: "InputMedia"
            }, {
                id: 261416433,
                predicate: "inputMediaPoll",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "poll",
                    type: "Poll"
                }, {
                    name: "correct_answers",
                    type: "flags.0?Vector<bytes>"
                }, {
                    name: "solution",
                    type: "flags.1?string"
                }, {
                    name: "solution_entities",
                    type: "flags.1?Vector<MessageEntity>"
                }],
                type: "InputMedia"
            }, {
                id: -428884101,
                predicate: "inputMediaDice",
                params: [{
                    name: "emoticon",
                    type: "string"
                }],
                type: "InputMedia"
            }, {
                id: 480546647,
                predicate: "inputChatPhotoEmpty",
                params: [],
                type: "InputChatPhoto"
            }, {
                id: -968723890,
                predicate: "inputChatUploadedPhoto",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "file",
                    type: "flags.0?InputFile"
                }, {
                    name: "video",
                    type: "flags.1?InputFile"
                }, {
                    name: "video_start_ts",
                    type: "flags.2?double"
                }],
                type: "InputChatPhoto"
            }, {
                id: -1991004873,
                predicate: "inputChatPhoto",
                params: [{
                    name: "id",
                    type: "InputPhoto"
                }],
                type: "InputChatPhoto"
            }, {
                id: -457104426,
                predicate: "inputGeoPointEmpty",
                params: [],
                type: "InputGeoPoint"
            }, {
                id: 1210199983,
                predicate: "inputGeoPoint",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "lat",
                    type: "double"
                }, {
                    name: "long",
                    type: "double"
                }, {
                    name: "accuracy_radius",
                    type: "flags.0?int"
                }],
                type: "InputGeoPoint"
            }, {
                id: 483901197,
                predicate: "inputPhotoEmpty",
                params: [],
                type: "InputPhoto"
            }, {
                id: 1001634122,
                predicate: "inputPhoto",
                params: [{
                    name: "id",
                    type: "long"
                }, {
                    name: "access_hash",
                    type: "long"
                }, {
                    name: "file_reference",
                    type: "bytes"
                }],
                type: "InputPhoto"
            }, {
                id: -539317279,
                predicate: "inputFileLocation",
                params: [{
                    name: "volume_id",
                    type: "long"
                }, {
                    name: "local_id",
                    type: "int"
                }, {
                    name: "secret",
                    type: "long"
                }, {
                    name: "file_reference",
                    type: "bytes"
                }],
                type: "InputFileLocation"
            }, {
                id: -182231723,
                predicate: "inputEncryptedFileLocation",
                params: [{
                    name: "id",
                    type: "long"
                }, {
                    name: "access_hash",
                    type: "long"
                }],
                type: "InputFileLocation"
            }, {
                id: -1160743548,
                predicate: "inputDocumentFileLocation",
                params: [{
                    name: "id",
                    type: "long"
                }, {
                    name: "access_hash",
                    type: "long"
                }, {
                    name: "file_reference",
                    type: "bytes"
                }, {
                    name: "thumb_size",
                    type: "string"
                }],
                type: "InputFileLocation"
            }, {
                id: -876089816,
                predicate: "inputSecureFileLocation",
                params: [{
                    name: "id",
                    type: "long"
                }, {
                    name: "access_hash",
                    type: "long"
                }],
                type: "InputFileLocation"
            }, {
                id: 700340377,
                predicate: "inputTakeoutFileLocation",
                params: [],
                type: "InputFileLocation"
            }, {
                id: 1075322878,
                predicate: "inputPhotoFileLocation",
                params: [{
                    name: "id",
                    type: "long"
                }, {
                    name: "access_hash",
                    type: "long"
                }, {
                    name: "file_reference",
                    type: "bytes"
                }, {
                    name: "thumb_size",
                    type: "string"
                }],
                type: "InputFileLocation"
            }, {
                id: -667654413,
                predicate: "inputPhotoLegacyFileLocation",
                params: [{
                    name: "id",
                    type: "long"
                }, {
                    name: "access_hash",
                    type: "long"
                }, {
                    name: "file_reference",
                    type: "bytes"
                }, {
                    name: "volume_id",
                    type: "long"
                }, {
                    name: "local_id",
                    type: "int"
                }, {
                    name: "secret",
                    type: "long"
                }],
                type: "InputFileLocation"
            }, {
                id: 925204121,
                predicate: "inputPeerPhotoFileLocation",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "big",
                    type: "flags.0?true"
                }, {
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "photo_id",
                    type: "long"
                }, {
                    name: "volume_id",
                    type: "long"
                }, {
                    name: "local_id",
                    type: "int"
                }],
                type: "InputFileLocation"
            }, {
                id: -1652231205,
                predicate: "inputStickerSetThumb",
                params: [{
                    name: "stickerset",
                    type: "InputStickerSet"
                }, {
                    name: "thumb_version",
                    type: "int"
                }],
                type: "InputFileLocation"
            }, {
                id: 93890858,
                predicate: "inputGroupCallStream",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "call",
                    type: "InputGroupCall"
                }, {
                    name: "time_ms",
                    type: "long"
                }, {
                    name: "scale",
                    type: "int"
                }, {
                    name: "video_channel",
                    type: "flags.0?int"
                }, {
                    name: "video_quality",
                    type: "flags.0?int"
                }],
                type: "InputFileLocation"
            }, {
                id: 1498486562,
                predicate: "peerUser",
                params: [{
                    name: "user_id",
                    type: "long"
                }],
                type: "Peer"
            }, {
                id: 918946202,
                predicate: "peerChat",
                params: [{
                    name: "chat_id",
                    type: "long"
                }],
                type: "Peer"
            }, {
                id: -1566230754,
                predicate: "peerChannel",
                params: [{
                    name: "channel_id",
                    type: "long"
                }],
                type: "Peer"
            }, {
                id: -1432995067,
                predicate: "storage.fileUnknown",
                params: [],
                type: "storage.FileType"
            }, {
                id: 1086091090,
                predicate: "storage.filePartial",
                params: [],
                type: "storage.FileType"
            }, {
                id: 8322574,
                predicate: "storage.fileJpeg",
                params: [],
                type: "storage.FileType"
            }, {
                id: -891180321,
                predicate: "storage.fileGif",
                params: [],
                type: "storage.FileType"
            }, {
                id: 172975040,
                predicate: "storage.filePng",
                params: [],
                type: "storage.FileType"
            }, {
                id: -1373745011,
                predicate: "storage.filePdf",
                params: [],
                type: "storage.FileType"
            }, {
                id: 1384777335,
                predicate: "storage.fileMp3",
                params: [],
                type: "storage.FileType"
            }, {
                id: 1258941372,
                predicate: "storage.fileMov",
                params: [],
                type: "storage.FileType"
            }, {
                id: -1278304028,
                predicate: "storage.fileMp4",
                params: [],
                type: "storage.FileType"
            }, {
                id: 276907596,
                predicate: "storage.fileWebp",
                params: [],
                type: "storage.FileType"
            }, {
                id: -742634630,
                predicate: "userEmpty",
                params: [{
                    name: "id",
                    type: "long"
                }],
                type: "User"
            }, {
                id: -321753653,
                predicate: "user",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "flags2",
                    type: "#"
                }, {
                    name: "eFlags",
                    type: "#"
                }, {
                    name: "self",
                    type: "flags.10?true"
                }, {
                    name: "contact",
                    type: "flags.11?true"
                }, {
                    name: "mutual_contact",
                    type: "flags.12?true"
                }, {
                    name: "deleted",
                    type: "flags.13?true"
                }, {
                    name: "bot",
                    type: "flags.14?true"
                }, {
                    name: "bot_chat_history",
                    type: "flags.15?true"
                }, {
                    name: "bot_nochats",
                    type: "flags.16?true"
                }, {
                    name: "verified",
                    type: "flags.17?true"
                }, {
                    name: "restricted",
                    type: "flags.18?true"
                }, {
                    name: "min",
                    type: "flags.20?true"
                }, {
                    name: "bot_inline_geo",
                    type: "flags.21?true"
                }, {
                    name: "support",
                    type: "flags.23?true"
                }, {
                    name: "scam",
                    type: "flags.24?true"
                }, {
                    name: "apply_min_photo",
                    type: "flags.25?true"
                }, {
                    name: "fake",
                    type: "flags.26?true"
                }, {
                    name: "id",
                    type: "long"
                }, {
                    name: "access_hash",
                    type: "flags.0?long"
                }, {
                    name: "first_name",
                    type: "flags.1?string"
                }, {
                    name: "last_name",
                    type: "flags.2?string"
                }, {
                    name: "username",
                    type: "flags.3?string"
                }, {
                    name: "phone",
                    type: "flags.4?string"
                }, {
                    name: "photo",
                    type: "flags.5?UserProfilePhoto"
                }, {
                    name: "status",
                    type: "flags.6?UserStatus"
                }, {
                    name: "bot_info_version",
                    type: "flags.14?int"
                }, {
                    name: "restriction_reason",
                    type: "flags.18?Vector<RestrictionReason>"
                }, {
                    name: "bot_inline_placeholder",
                    type: "flags.19?string"
                }, {
                    name: "lang_code",
                    type: "flags.22?string"
                }, {
                    name: "miniApp",
                    type: "eFlags.0?true"
                }, {
                    name: "badge_name",
                    type: "eFlags.1?string"
                }, {
                    name: "badge_red_color",
                    type: "eFlags.2?true"
                }, {
                    name: "miniAppGeo",
                    type: "eFlags.4?true"
                }, {
                    name: "bot_active_users",
                    type: "flags2.12?int"
                }],
                type: "User"
            }, {
                id: 1326562017,
                predicate: "userProfilePhotoEmpty",
                params: [],
                type: "UserProfilePhoto"
            }, {
                id: 1775479590,
                predicate: "userProfilePhoto",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "has_video",
                    type: "flags.0?true"
                }, {
                    name: "photo_id",
                    type: "long"
                }, {
                    name: "photo_small",
                    type: "FileLocation"
                }, {
                    name: "photo_big",
                    type: "FileLocation"
                }, {
                    name: "dc_id",
                    type: "int"
                }],
                type: "UserProfilePhoto"
            }, {
                id: 164646985,
                predicate: "userStatusEmpty",
                params: [],
                type: "UserStatus"
            }, {
                id: -306628279,
                predicate: "userStatusOnline",
                params: [{
                    name: "expires",
                    type: "int"
                }],
                type: "UserStatus"
            }, {
                id: 9203775,
                predicate: "userStatusOffline",
                params: [{
                    name: "was_online",
                    type: "int"
                }],
                type: "UserStatus"
            }, {
                id: -496024847,
                predicate: "userStatusRecently",
                params: [],
                type: "UserStatus"
            }, {
                id: 129960444,
                predicate: "userStatusLastWeek",
                params: [],
                type: "UserStatus"
            }, {
                id: 2011940674,
                predicate: "userStatusLastMonth",
                params: [],
                type: "UserStatus"
            }, {
                id: 693512293,
                predicate: "chatEmpty",
                params: [{
                    name: "id",
                    type: "long"
                }],
                type: "Chat"
            }, {
                id: 1103884886,
                predicate: "chat",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "creator",
                    type: "flags.0?true"
                }, {
                    name: "kicked",
                    type: "flags.1?true"
                }, {
                    name: "left",
                    type: "flags.2?true"
                }, {
                    name: "deactivated",
                    type: "flags.5?true"
                }, {
                    name: "call_active",
                    type: "flags.23?true"
                }, {
                    name: "call_not_empty",
                    type: "flags.24?true"
                }, {
                    name: "noforwards",
                    type: "flags.25?true"
                }, {
                    name: "id",
                    type: "long"
                }, {
                    name: "title",
                    type: "string"
                }, {
                    name: "photo",
                    type: "ChatPhoto"
                }, {
                    name: "participants_count",
                    type: "int"
                }, {
                    name: "date",
                    type: "int"
                }, {
                    name: "version",
                    type: "int"
                }, {
                    name: "migrated_to",
                    type: "flags.6?InputChannel"
                }, {
                    name: "admin_rights",
                    type: "flags.14?ChatAdminRights"
                }, {
                    name: "default_banned_rights",
                    type: "flags.18?ChatBannedRights"
                }],
                type: "Chat"
            }, {
                id: 1704108455,
                predicate: "chatForbidden",
                params: [{
                    name: "id",
                    type: "long"
                }, {
                    name: "title",
                    type: "string"
                }],
                type: "Chat"
            }, {
                id: -2107528095,
                predicate: "channel",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "creator",
                    type: "flags.0?true"
                }, {
                    name: "left",
                    type: "flags.2?true"
                }, {
                    name: "broadcast",
                    type: "flags.5?true"
                }, {
                    name: "verified",
                    type: "flags.7?true"
                }, {
                    name: "megagroup",
                    type: "flags.8?true"
                }, {
                    name: "restricted",
                    type: "flags.9?true"
                }, {
                    name: "signatures",
                    type: "flags.11?true"
                }, {
                    name: "min",
                    type: "flags.12?true"
                }, {
                    name: "scam",
                    type: "flags.19?true"
                }, {
                    name: "has_link",
                    type: "flags.20?true"
                }, {
                    name: "has_geo",
                    type: "flags.21?true"
                }, {
                    name: "slowmode_enabled",
                    type: "flags.22?true"
                }, {
                    name: "call_active",
                    type: "flags.23?true"
                }, {
                    name: "call_not_empty",
                    type: "flags.24?true"
                }, {
                    name: "fake",
                    type: "flags.25?true"
                }, {
                    name: "gigagroup",
                    type: "flags.26?true"
                }, {
                    name: "noforwards",
                    type: "flags.27?true"
                }, {
                    name: "id",
                    type: "long"
                }, {
                    name: "access_hash",
                    type: "flags.13?long"
                }, {
                    name: "title",
                    type: "string"
                }, {
                    name: "username",
                    type: "flags.6?string"
                }, {
                    name: "photo",
                    type: "ChatPhoto"
                }, {
                    name: "date",
                    type: "int"
                }, {
                    name: "restriction_reason",
                    type: "flags.9?Vector<RestrictionReason>"
                }, {
                    name: "admin_rights",
                    type: "flags.14?ChatAdminRights"
                }, {
                    name: "banned_rights",
                    type: "flags.15?ChatBannedRights"
                }, {
                    name: "default_banned_rights",
                    type: "flags.18?ChatBannedRights"
                }, {
                    name: "participants_count",
                    type: "flags.17?int"
                }, {
                    name: "live_msg_id",
                    type: "flags.29?int"
                }],
                type: "Chat"
            }, {
                id: 399807445,
                predicate: "channelForbidden",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "broadcast",
                    type: "flags.5?true"
                }, {
                    name: "megagroup",
                    type: "flags.8?true"
                }, {
                    name: "id",
                    type: "long"
                }, {
                    name: "access_hash",
                    type: "long"
                }, {
                    name: "title",
                    type: "string"
                }, {
                    name: "until_date",
                    type: "flags.16?int"
                }],
                type: "Chat"
            }, {
                id: 1304281241,
                predicate: "chatFull",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "can_set_username",
                    type: "flags.7?true"
                }, {
                    name: "has_scheduled",
                    type: "flags.8?true"
                }, {
                    name: "id",
                    type: "long"
                }, {
                    name: "about",
                    type: "string"
                }, {
                    name: "participants",
                    type: "ChatParticipants"
                }, {
                    name: "chat_photo",
                    type: "flags.2?Photo"
                }, {
                    name: "notify_settings",
                    type: "PeerNotifySettings"
                }, {
                    name: "exported_invite",
                    type: "flags.13?ExportedChatInvite"
                }, {
                    name: "bot_info",
                    type: "flags.3?Vector<BotInfo>"
                }, {
                    name: "pinned_msg_id",
                    type: "flags.6?int"
                }, {
                    name: "folder_id",
                    type: "flags.11?int"
                }, {
                    name: "call",
                    type: "flags.12?InputGroupCall"
                }, {
                    name: "ttl_period",
                    type: "flags.14?int"
                }, {
                    name: "groupcall_default_join_as",
                    type: "flags.15?Peer"
                }, {
                    name: "theme_emoticon",
                    type: "flags.16?string"
                }],
                type: "ChatFull"
            }, {
                id: -374179305,
                predicate: "channelFull",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "can_view_participants",
                    type: "flags.3?true"
                }, {
                    name: "can_set_username",
                    type: "flags.6?true"
                }, {
                    name: "can_set_stickers",
                    type: "flags.7?true"
                }, {
                    name: "hidden_prehistory",
                    type: "flags.10?true"
                }, {
                    name: "can_set_location",
                    type: "flags.16?true"
                }, {
                    name: "has_scheduled",
                    type: "flags.19?true"
                }, {
                    name: "can_view_stats",
                    type: "flags.20?true"
                }, {
                    name: "blocked",
                    type: "flags.22?true"
                }, {
                    name: "id",
                    type: "long"
                }, {
                    name: "about",
                    type: "string"
                }, {
                    name: "participants_count",
                    type: "flags.0?int"
                }, {
                    name: "admins_count",
                    type: "flags.1?int"
                }, {
                    name: "kicked_count",
                    type: "flags.2?int"
                }, {
                    name: "banned_count",
                    type: "flags.2?int"
                }, {
                    name: "online_count",
                    type: "flags.13?int"
                }, {
                    name: "read_inbox_max_id",
                    type: "int"
                }, {
                    name: "read_outbox_max_id",
                    type: "int"
                }, {
                    name: "unread_count",
                    type: "int"
                }, {
                    name: "chat_photo",
                    type: "Photo"
                }, {
                    name: "notify_settings",
                    type: "PeerNotifySettings"
                }, {
                    name: "exported_invite",
                    type: "flags.23?ExportedChatInvite"
                }, {
                    name: "bot_info",
                    type: "Vector<BotInfo>"
                }, {
                    name: "migrated_from_chat_id",
                    type: "flags.4?long"
                }, {
                    name: "migrated_from_max_id",
                    type: "flags.4?int"
                }, {
                    name: "pinned_msg_id",
                    type: "flags.5?int"
                }, {
                    name: "stickerset",
                    type: "flags.8?StickerSet"
                }, {
                    name: "available_min_id",
                    type: "flags.9?int"
                }, {
                    name: "folder_id",
                    type: "flags.11?int"
                }, {
                    name: "linked_chat_id",
                    type: "flags.14?long"
                }, {
                    name: "location",
                    type: "flags.15?ChannelLocation"
                }, {
                    name: "slowmode_seconds",
                    type: "flags.17?int"
                }, {
                    name: "slowmode_next_send_date",
                    type: "flags.18?int"
                }, {
                    name: "stats_dc",
                    type: "flags.12?int"
                }, {
                    name: "pts",
                    type: "int"
                }, {
                    name: "call",
                    type: "flags.21?InputGroupCall"
                }, {
                    name: "ttl_period",
                    type: "flags.24?int"
                }, {
                    name: "pending_suggestions",
                    type: "flags.25?Vector<string>"
                }, {
                    name: "groupcall_default_join_as",
                    type: "flags.26?Peer"
                }, {
                    name: "theme_emoticon",
                    type: "flags.27?string"
                }, {
                    name: "business_location",
                    type: "flags.28?int"
                }, {
                    name: "default_send_as",
                    type: "flags.29?int"
                }],
                type: "ChatFull"
            }, {
                id: -1070776313,
                predicate: "chatParticipant",
                params: [{
                    name: "user_id",
                    type: "long"
                }, {
                    name: "inviter_id",
                    type: "long"
                }, {
                    name: "date",
                    type: "int"
                }],
                type: "ChatParticipant"
            }, {
                id: -462696732,
                predicate: "chatParticipantCreator",
                params: [{
                    name: "user_id",
                    type: "long"
                }],
                type: "ChatParticipant"
            }, {
                id: -1600962725,
                predicate: "chatParticipantAdmin",
                params: [{
                    name: "user_id",
                    type: "long"
                }, {
                    name: "inviter_id",
                    type: "long"
                }, {
                    name: "date",
                    type: "int"
                }],
                type: "ChatParticipant"
            }, {
                id: -2023500831,
                predicate: "chatParticipantsForbidden",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "chat_id",
                    type: "long"
                }, {
                    name: "self_participant",
                    type: "flags.0?ChatParticipant"
                }],
                type: "ChatParticipants"
            }, {
                id: 1018991608,
                predicate: "chatParticipants",
                params: [{
                    name: "chat_id",
                    type: "long"
                }, {
                    name: "participants",
                    type: "Vector<ChatParticipant>"
                }, {
                    name: "version",
                    type: "int"
                }],
                type: "ChatParticipants"
            }, {
                id: 935395612,
                predicate: "chatPhotoEmpty",
                params: [],
                type: "ChatPhoto"
            }, {
                id: -770990276,
                predicate: "chatPhoto",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "has_video",
                    type: "flags.0?true"
                }, {
                    name: "photo_id",
                    type: "long"
                }, {
                    name: "photo_small",
                    type: "FileLocation"
                }, {
                    name: "photo_big",
                    type: "FileLocation"
                }, {
                    name: "dc_id",
                    type: "int"
                }],
                type: "ChatPhoto"
            }, {
                id: -1868117372,
                predicate: "messageEmpty",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "id",
                    type: "int"
                }, {
                    name: "peer_id",
                    type: "flags.0?Peer"
                }],
                type: "Message"
            }, {
                id: -2049520670,
                predicate: "message",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "out",
                    type: "flags.1?true"
                }, {
                    name: "mentioned",
                    type: "flags.4?true"
                }, {
                    name: "media_unread",
                    type: "flags.5?true"
                }, {
                    name: "silent",
                    type: "flags.13?true"
                }, {
                    name: "post",
                    type: "flags.14?true"
                }, {
                    name: "from_scheduled",
                    type: "flags.18?true"
                }, {
                    name: "legacy",
                    type: "flags.19?true"
                }, {
                    name: "edit_hide",
                    type: "flags.21?true"
                }, {
                    name: "pinned",
                    type: "flags.24?true"
                }, {
                    name: "id",
                    type: "int"
                }, {
                    name: "from_id",
                    type: "flags.8?Peer"
                }, {
                    name: "peer_id",
                    type: "Peer"
                }, {
                    name: "fwd_from",
                    type: "flags.2?MessageFwdHeader"
                }, {
                    name: "via_bot_id",
                    type: "flags.11?long"
                }, {
                    name: "reply_to",
                    type: "flags.3?MessageReplyHeader"
                }, {
                    name: "date",
                    type: "int"
                }, {
                    name: "message",
                    type: "string"
                }, {
                    name: "media",
                    type: "flags.9?MessageMedia"
                }, {
                    name: "reply_markup",
                    type: "flags.6?ReplyMarkup"
                }, {
                    name: "entities",
                    type: "flags.7?Vector<MessageEntity>"
                }, {
                    name: "views",
                    type: "flags.10?int"
                }, {
                    name: "forwards",
                    type: "flags.10?int"
                }, {
                    name: "replies",
                    type: "flags.23?MessageReplies"
                }, {
                    name: "edit_date",
                    type: "flags.15?int"
                }, {
                    name: "post_author",
                    type: "flags.16?string"
                }, {
                    name: "grouped_id",
                    type: "flags.17?long"
                }, {
                    name: "restriction_reason",
                    type: "flags.22?Vector<RestrictionReason>"
                }, {
                    name: "ttl_period",
                    type: "flags.25?int"
                }, {
                    name: "noforwards",
                    type: "flags.26?true"
                }],
                type: "Message"
            }, {
                id: 721967202,
                predicate: "messageService",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "out",
                    type: "flags.1?true"
                }, {
                    name: "mentioned",
                    type: "flags.4?true"
                }, {
                    name: "media_unread",
                    type: "flags.5?true"
                }, {
                    name: "silent",
                    type: "flags.13?true"
                }, {
                    name: "post",
                    type: "flags.14?true"
                }, {
                    name: "legacy",
                    type: "flags.19?true"
                }, {
                    name: "id",
                    type: "int"
                }, {
                    name: "from_id",
                    type: "flags.8?Peer"
                }, {
                    name: "peer_id",
                    type: "Peer"
                }, {
                    name: "reply_to",
                    type: "flags.3?MessageReplyHeader"
                }, {
                    name: "date",
                    type: "int"
                }, {
                    name: "action",
                    type: "MessageAction"
                }, {
                    name: "ttl_period",
                    type: "flags.25?int"
                }],
                type: "Message"
            }, {
                id: 1038967584,
                predicate: "messageMediaEmpty",
                params: [],
                type: "MessageMedia"
            }, {
                id: 1766936791,
                predicate: "messageMediaPhoto",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "photo",
                    type: "flags.0?Photo"
                }, {
                    name: "ttl_seconds",
                    type: "flags.2?int"
                }],
                type: "MessageMedia"
            }, {
                id: 1457575028,
                predicate: "messageMediaGeo",
                params: [{
                    name: "geo",
                    type: "GeoPoint"
                }],
                type: "MessageMedia"
            }, {
                id: 1882335561,
                predicate: "messageMediaContact",
                params: [{
                    name: "phone_number",
                    type: "string"
                }, {
                    name: "first_name",
                    type: "string"
                }, {
                    name: "last_name",
                    type: "string"
                }, {
                    name: "vcard",
                    type: "string"
                }, {
                    name: "user_id",
                    type: "long"
                }],
                type: "MessageMedia"
            }, {
                id: -1618676578,
                predicate: "messageMediaUnsupported",
                params: [],
                type: "MessageMedia"
            }, {
                id: -1666158377,
                predicate: "messageMediaDocument",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "document",
                    type: "flags.0?Document"
                }, {
                    name: "ttl_seconds",
                    type: "flags.2?int"
                }],
                type: "MessageMedia"
            }, {
                id: -1557277184,
                predicate: "messageMediaWebPage",
                params: [{
                    name: "webpage",
                    type: "WebPage"
                }],
                type: "MessageMedia"
            }, {
                id: 784356159,
                predicate: "messageMediaVenue",
                params: [{
                    name: "geo",
                    type: "GeoPoint"
                }, {
                    name: "title",
                    type: "string"
                }, {
                    name: "address",
                    type: "string"
                }, {
                    name: "provider",
                    type: "string"
                }, {
                    name: "venue_id",
                    type: "string"
                }, {
                    name: "venue_type",
                    type: "string"
                }],
                type: "MessageMedia"
            }, {
                id: -38694904,
                predicate: "messageMediaGame",
                params: [{
                    name: "game",
                    type: "Game"
                }],
                type: "MessageMedia"
            }, {
                id: -2074799289,
                predicate: "messageMediaInvoice",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "shipping_address_requested",
                    type: "flags.1?true"
                }, {
                    name: "test",
                    type: "flags.3?true"
                }, {
                    name: "title",
                    type: "string"
                }, {
                    name: "description",
                    type: "string"
                }, {
                    name: "photo",
                    type: "flags.0?WebDocument"
                }, {
                    name: "receipt_msg_id",
                    type: "flags.2?int"
                }, {
                    name: "currency",
                    type: "string"
                }, {
                    name: "total_amount",
                    type: "long"
                }, {
                    name: "start_param",
                    type: "string"
                }],
                type: "MessageMedia"
            }, {
                id: -1186937242,
                predicate: "messageMediaGeoLive",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "geo",
                    type: "GeoPoint"
                }, {
                    name: "heading",
                    type: "flags.0?int"
                }, {
                    name: "period",
                    type: "int"
                }, {
                    name: "proximity_notification_radius",
                    type: "flags.1?int"
                }],
                type: "MessageMedia"
            }, {
                id: 1272375192,
                predicate: "messageMediaPoll",
                params: [{
                    name: "poll",
                    type: "Poll"
                }, {
                    name: "results",
                    type: "PollResults"
                }],
                type: "MessageMedia"
            }, {
                id: 1065280907,
                predicate: "messageMediaDice",
                params: [{
                    name: "value",
                    type: "int"
                }, {
                    name: "emoticon",
                    type: "string"
                }],
                type: "MessageMedia"
            }, {
                id: -1230047312,
                predicate: "messageActionEmpty",
                params: [],
                type: "MessageAction"
            }, {
                id: -1119368275,
                predicate: "messageActionChatCreate",
                params: [{
                    name: "title",
                    type: "string"
                }, {
                    name: "users",
                    type: "Vector<long>"
                }],
                type: "MessageAction"
            }, {
                id: -1247687078,
                predicate: "messageActionChatEditTitle",
                params: [{
                    name: "title",
                    type: "string"
                }],
                type: "MessageAction"
            }, {
                id: 2144015272,
                predicate: "messageActionChatEditPhoto",
                params: [{
                    name: "photo",
                    type: "Photo"
                }],
                type: "MessageAction"
            }, {
                id: -1780220945,
                predicate: "messageActionChatDeletePhoto",
                params: [],
                type: "MessageAction"
            }, {
                id: 365886720,
                predicate: "messageActionChatAddUser",
                params: [{
                    name: "users",
                    type: "Vector<long>"
                }],
                type: "MessageAction"
            }, {
                id: -1539362612,
                predicate: "messageActionChatDeleteUser",
                params: [{
                    name: "user_id",
                    type: "long"
                }],
                type: "MessageAction"
            }, {
                id: 51520707,
                predicate: "messageActionChatJoinedByLink",
                params: [{
                    name: "inviter_id",
                    type: "long"
                }],
                type: "MessageAction"
            }, {
                id: -1781355374,
                predicate: "messageActionChannelCreate",
                params: [{
                    name: "title",
                    type: "string"
                }],
                type: "MessageAction"
            }, {
                id: -519864430,
                predicate: "messageActionChatMigrateTo",
                params: [{
                    name: "channel_id",
                    type: "long"
                }],
                type: "MessageAction"
            }, {
                id: -365344535,
                predicate: "messageActionChannelMigrateFrom",
                params: [{
                    name: "title",
                    type: "string"
                }, {
                    name: "chat_id",
                    type: "long"
                }],
                type: "MessageAction"
            }, {
                id: -1799538451,
                predicate: "messageActionPinMessage",
                params: [],
                type: "MessageAction"
            }, {
                id: -1615153660,
                predicate: "messageActionHistoryClear",
                params: [],
                type: "MessageAction"
            }, {
                id: -1834538890,
                predicate: "messageActionGameScore",
                params: [{
                    name: "game_id",
                    type: "long"
                }, {
                    name: "score",
                    type: "int"
                }],
                type: "MessageAction"
            }, {
                id: -1892568281,
                predicate: "messageActionPaymentSentMe",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "currency",
                    type: "string"
                }, {
                    name: "total_amount",
                    type: "long"
                }, {
                    name: "payload",
                    type: "bytes"
                }, {
                    name: "info",
                    type: "flags.0?PaymentRequestedInfo"
                }, {
                    name: "shipping_option_id",
                    type: "flags.1?string"
                }, {
                    name: "charge",
                    type: "PaymentCharge"
                }],
                type: "MessageAction"
            }, {
                id: 1080663248,
                predicate: "messageActionPaymentSent",
                params: [{
                    name: "currency",
                    type: "string"
                }, {
                    name: "total_amount",
                    type: "long"
                }],
                type: "MessageAction"
            }, {
                id: -2132731265,
                predicate: "messageActionPhoneCall",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "video",
                    type: "flags.2?true"
                }, {
                    name: "call_id",
                    type: "long"
                }, {
                    name: "reason",
                    type: "flags.0?PhoneCallDiscardReason"
                }, {
                    name: "duration",
                    type: "flags.1?int"
                }],
                type: "MessageAction"
            }, {
                id: 1200788123,
                predicate: "messageActionScreenshotTaken",
                params: [],
                type: "MessageAction"
            }, {
                id: -85549226,
                predicate: "messageActionCustomAction",
                params: [{
                    name: "message",
                    type: "string"
                }],
                type: "MessageAction"
            }, {
                id: -1410748418,
                predicate: "messageActionBotAllowed",
                params: [{
                    name: "domain",
                    type: "string"
                }],
                type: "MessageAction"
            }, {
                id: 455635795,
                predicate: "messageActionSecureValuesSentMe",
                params: [{
                    name: "values",
                    type: "Vector<SecureValue>"
                }, {
                    name: "credentials",
                    type: "SecureCredentialsEncrypted"
                }],
                type: "MessageAction"
            }, {
                id: -648257196,
                predicate: "messageActionSecureValuesSent",
                params: [{
                    name: "types",
                    type: "Vector<SecureValueType>"
                }],
                type: "MessageAction"
            }, {
                id: -202219658,
                predicate: "messageActionContactSignUp",
                params: [],
                type: "MessageAction"
            }, {
                id: -1730095465,
                predicate: "messageActionGeoProximityReached",
                params: [{
                    name: "from_id",
                    type: "Peer"
                }, {
                    name: "to_id",
                    type: "Peer"
                }, {
                    name: "distance",
                    type: "int"
                }],
                type: "MessageAction"
            }, {
                id: 2047704898,
                predicate: "messageActionGroupCall",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "call",
                    type: "InputGroupCall"
                }, {
                    name: "duration",
                    type: "flags.0?int"
                }],
                type: "MessageAction"
            }, {
                id: 1345295095,
                predicate: "messageActionInviteToGroupCall",
                params: [{
                    name: "call",
                    type: "InputGroupCall"
                }, {
                    name: "users",
                    type: "Vector<long>"
                }],
                type: "MessageAction"
            }, {
                id: -1441072131,
                predicate: "messageActionSetMessagesTTL",
                params: [{
                    name: "period",
                    type: "int"
                }],
                type: "MessageAction"
            }, {
                id: -1281329567,
                predicate: "messageActionGroupCallScheduled",
                params: [{
                    name: "call",
                    type: "InputGroupCall"
                }, {
                    name: "schedule_date",
                    type: "int"
                }],
                type: "MessageAction"
            }, {
                id: -1434950843,
                predicate: "messageActionSetChatTheme",
                params: [{
                    name: "emoticon",
                    type: "string"
                }],
                type: "MessageAction"
            }, {
                id: 739712882,
                predicate: "dialog",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "pinned",
                    type: "flags.2?true"
                }, {
                    name: "unread_mark",
                    type: "flags.3?true"
                }, {
                    name: "peer",
                    type: "Peer"
                }, {
                    name: "top_message",
                    type: "int"
                }, {
                    name: "read_inbox_max_id",
                    type: "int"
                }, {
                    name: "read_outbox_max_id",
                    type: "int"
                }, {
                    name: "unread_count",
                    type: "int"
                }, {
                    name: "unread_mentions_count",
                    type: "int"
                }, {
                    name: "notify_settings",
                    type: "PeerNotifySettings"
                }, {
                    name: "pts",
                    type: "flags.0?int"
                }, {
                    name: "draft",
                    type: "flags.1?DraftMessage"
                }, {
                    name: "folder_id",
                    type: "flags.4?int"
                }],
                type: "Dialog"
            }, {
                id: 1908216652,
                predicate: "dialogFolder",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "pinned",
                    type: "flags.2?true"
                }, {
                    name: "folder",
                    type: "Folder"
                }, {
                    name: "peer",
                    type: "Peer"
                }, {
                    name: "top_message",
                    type: "int"
                }, {
                    name: "unread_muted_peers_count",
                    type: "int"
                }, {
                    name: "unread_unmuted_peers_count",
                    type: "int"
                }, {
                    name: "unread_muted_messages_count",
                    type: "int"
                }, {
                    name: "unread_unmuted_messages_count",
                    type: "int"
                }],
                type: "Dialog"
            }, {
                id: 590459437,
                predicate: "photoEmpty",
                params: [{
                    name: "id",
                    type: "long"
                }],
                type: "Photo"
            }, {
                id: -82216347,
                predicate: "photo",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "has_stickers",
                    type: "flags.0?true"
                }, {
                    name: "id",
                    type: "long"
                }, {
                    name: "access_hash",
                    type: "long"
                }, {
                    name: "file_reference",
                    type: "bytes"
                }, {
                    name: "date",
                    type: "int"
                }, {
                    name: "sizes",
                    type: "Vector<PhotoSize>"
                }, {
                    name: "video_sizes",
                    type: "flags.1?Vector<VideoSize>"
                }, {
                    name: "dc_id",
                    type: "int"
                }],
                type: "Photo"
            }, {
                id: 236446268,
                predicate: "photoSizeEmpty",
                params: [{
                    name: "type",
                    type: "string"
                }],
                type: "PhotoSize"
            }, {
                id: 1976012384,
                predicate: "photoSize",
                params: [{
                    name: "type",
                    type: "string"
                }, {
                    name: "w",
                    type: "int"
                }, {
                    name: "h",
                    type: "int"
                }, {
                    name: "size",
                    type: "int"
                }],
                type: "PhotoSize"
            }, {
                id: 35527382,
                predicate: "photoCachedSize",
                params: [{
                    name: "type",
                    type: "string"
                }, {
                    name: "w",
                    type: "int"
                }, {
                    name: "h",
                    type: "int"
                }, {
                    name: "bytes",
                    type: "bytes"
                }],
                type: "PhotoSize"
            }, {
                id: -525288402,
                predicate: "photoStrippedSize",
                params: [{
                    name: "type",
                    type: "string"
                }, {
                    name: "bytes",
                    type: "bytes"
                }],
                type: "PhotoSize"
            }, {
                id: -96535659,
                predicate: "photoSizeProgressive",
                params: [{
                    name: "type",
                    type: "string"
                }, {
                    name: "w",
                    type: "int"
                }, {
                    name: "h",
                    type: "int"
                }, {
                    name: "sizes",
                    type: "Vector<int>"
                }],
                type: "PhotoSize"
            }, {
                id: -668906175,
                predicate: "photoPathSize",
                params: [{
                    name: "type",
                    type: "string"
                }, {
                    name: "bytes",
                    type: "bytes"
                }],
                type: "PhotoSize"
            }, {
                id: 286776671,
                predicate: "geoPointEmpty",
                params: [],
                type: "GeoPoint"
            }, {
                id: -1297942941,
                predicate: "geoPoint",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "long",
                    type: "double"
                }, {
                    name: "lat",
                    type: "double"
                }, {
                    name: "access_hash",
                    type: "long"
                }, {
                    name: "accuracy_radius",
                    type: "flags.0?int"
                }],
                type: "GeoPoint"
            }, {
                id: 541710092,
                predicate: "geoPoint_84",
                params: [{
                    name: "long",
                    type: "double"
                }, {
                    name: "lat",
                    type: "double"
                }],
                type: "GeoPoint"
            }, {
                id: 1577067778,
                predicate: "auth.sentCode",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "type",
                    type: "auth.SentCodeType"
                }, {
                    name: "phone_code_hash",
                    type: "string"
                }, {
                    name: "next_type",
                    type: "flags.1?auth.CodeType"
                }, {
                    name: "timeout",
                    type: "flags.2?int"
                }],
                type: "auth.SentCode"
            }, {
                id: -855308010,
                predicate: "auth.authorization",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "token",
                    type: "string"
                }, {
                    name: "user",
                    type: "User"
                }],
                type: "auth.Authorization"
            }, {
                id: 1148485274,
                predicate: "auth.authorizationSignUpRequired",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "terms_of_service",
                    type: "flags.0?help.TermsOfService"
                }],
                type: "auth.Authorization"
            }, {
                id: -1271602504,
                predicate: "auth.exportedAuthorization",
                params: [{
                    name: "id",
                    type: "long"
                }, {
                    name: "bytes",
                    type: "bytes"
                }],
                type: "auth.ExportedAuthorization"
            }, {
                id: -1195615476,
                predicate: "inputNotifyPeer",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }],
                type: "InputNotifyPeer"
            }, {
                id: 423314455,
                predicate: "inputNotifyUsers",
                params: [],
                type: "InputNotifyPeer"
            }, {
                id: 1251338318,
                predicate: "inputNotifyChats",
                params: [],
                type: "InputNotifyPeer"
            }, {
                id: -1311015810,
                predicate: "inputNotifyBroadcasts",
                params: [],
                type: "InputNotifyPeer"
            }, {
                id: -1673717362,
                predicate: "inputPeerNotifySettings",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "show_previews",
                    type: "flags.0?Bool"
                }, {
                    name: "silent",
                    type: "flags.1?Bool"
                }, {
                    name: "mute_until",
                    type: "flags.2?int"
                }, {
                    name: "sound",
                    type: "flags.3?string"
                }],
                type: "InputPeerNotifySettings"
            }, {
                id: -1353671392,
                predicate: "peerNotifySettings",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "show_previews",
                    type: "flags.0?Bool"
                }, {
                    name: "silent",
                    type: "flags.1?Bool"
                }, {
                    name: "mute_until",
                    type: "flags.2?int"
                }, {
                    name: "sound",
                    type: "flags.3?string"
                }],
                type: "PeerNotifySettings"
            }, {
                id: 1933519201,
                predicate: "peerSettings",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "report_spam",
                    type: "flags.0?true"
                }, {
                    name: "add_contact",
                    type: "flags.1?true"
                }, {
                    name: "block_contact",
                    type: "flags.2?true"
                }, {
                    name: "share_contact",
                    type: "flags.3?true"
                }, {
                    name: "need_contacts_exception",
                    type: "flags.4?true"
                }, {
                    name: "report_geo",
                    type: "flags.5?true"
                }, {
                    name: "autoarchived",
                    type: "flags.7?true"
                }, {
                    name: "invite_members",
                    type: "flags.8?true"
                }, {
                    name: "geo_distance",
                    type: "flags.6?int"
                }],
                type: "PeerSettings"
            }, {
                id: -1539849235,
                predicate: "wallPaper",
                params: [{
                    name: "id",
                    type: "long"
                }, {
                    name: "flags",
                    type: "#"
                }, {
                    name: "creator",
                    type: "flags.0?true"
                }, {
                    name: "default",
                    type: "flags.1?true"
                }, {
                    name: "pattern",
                    type: "flags.3?true"
                }, {
                    name: "dark",
                    type: "flags.4?true"
                }, {
                    name: "access_hash",
                    type: "long"
                }, {
                    name: "slug",
                    type: "string"
                }, {
                    name: "document",
                    type: "Document"
                }, {
                    name: "settings",
                    type: "flags.2?WallPaperSettings"
                }],
                type: "WallPaper"
            }, {
                id: -528465642,
                predicate: "wallPaperNoFile",
                params: [{
                    name: "id",
                    type: "long"
                }, {
                    name: "flags",
                    type: "#"
                }, {
                    name: "default",
                    type: "flags.1?true"
                }, {
                    name: "dark",
                    type: "flags.4?true"
                }, {
                    name: "settings",
                    type: "flags.2?WallPaperSettings"
                }],
                type: "WallPaper"
            }, {
                id: 1490799288,
                predicate: "inputReportReasonSpam",
                params: [],
                type: "ReportReason"
            }, {
                id: 505595789,
                predicate: "inputReportReasonViolence",
                params: [],
                type: "ReportReason"
            }, {
                id: 777640226,
                predicate: "inputReportReasonPornography",
                params: [],
                type: "ReportReason"
            }, {
                id: -1376497949,
                predicate: "inputReportReasonChildAbuse",
                params: [],
                type: "ReportReason"
            }, {
                id: -1041980751,
                predicate: "inputReportReasonOther",
                params: [],
                type: "ReportReason"
            }, {
                id: -1685456582,
                predicate: "inputReportReasonCopyright",
                params: [],
                type: "ReportReason"
            }, {
                id: -606798099,
                predicate: "inputReportReasonGeoIrrelevant",
                params: [],
                type: "ReportReason"
            }, {
                id: -170010905,
                predicate: "inputReportReasonFake",
                params: [],
                type: "ReportReason"
            }, {
                id: -694681851,
                predicate: "userFull",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "blocked",
                    type: "flags.0?true"
                }, {
                    name: "phone_calls_available",
                    type: "flags.4?true"
                }, {
                    name: "phone_calls_private",
                    type: "flags.5?true"
                }, {
                    name: "can_pin_message",
                    type: "flags.7?true"
                }, {
                    name: "has_scheduled",
                    type: "flags.12?true"
                }, {
                    name: "video_calls_available",
                    type: "flags.13?true"
                }, {
                    name: "user",
                    type: "User"
                }, {
                    name: "about",
                    type: "flags.1?string"
                }, {
                    name: "settings",
                    type: "PeerSettings"
                }, {
                    name: "profile_photo",
                    type: "flags.2?Photo"
                }, {
                    name: "notify_settings",
                    type: "PeerNotifySettings"
                }, {
                    name: "bot_info",
                    type: "flags.3?BotInfo"
                }, {
                    name: "pinned_msg_id",
                    type: "flags.6?int"
                }, {
                    name: "common_chats_count",
                    type: "int"
                }, {
                    name: "folder_id",
                    type: "flags.11?int"
                }, {
                    name: "ttl_period",
                    type: "flags.14?int"
                }, {
                    name: "theme_emoticon",
                    type: "flags.15?string"
                }],
                type: "UserFull"
            }, {
                id: 341499403,
                predicate: "contact",
                params: [{
                    name: "user_id",
                    type: "long"
                }, {
                    name: "mutual",
                    type: "Bool"
                }],
                type: "Contact"
            }, {
                id: -1052885936,
                predicate: "importedContact",
                params: [{
                    name: "user_id",
                    type: "long"
                }, {
                    name: "client_id",
                    type: "long"
                }],
                type: "ImportedContact"
            }, {
                id: 383348795,
                predicate: "contactStatus",
                params: [{
                    name: "user_id",
                    type: "long"
                }, {
                    name: "status",
                    type: "UserStatus"
                }],
                type: "ContactStatus"
            }, {
                id: -1219778094,
                predicate: "contacts.contactsNotModified",
                params: [],
                type: "contacts.Contacts"
            }, {
                id: -353862078,
                predicate: "contacts.contacts",
                params: [{
                    name: "contacts",
                    type: "Vector<Contact>"
                }, {
                    name: "users",
                    type: "Vector<User>"
                }],
                type: "contacts.Contacts"
            }, {
                id: 2010127419,
                predicate: "contacts.importedContacts",
                params: [{
                    name: "imported",
                    type: "Vector<ImportedContact>"
                }, {
                    name: "popular_invites",
                    type: "Vector<PopularContact>"
                }, {
                    name: "retry_contacts",
                    type: "Vector<long>"
                }, {
                    name: "users",
                    type: "Vector<User>"
                }],
                type: "contacts.ImportedContacts"
            }, {
                id: 182326673,
                predicate: "contacts.blocked",
                params: [{
                    name: "blocked",
                    type: "Vector<PeerBlocked>"
                }, {
                    name: "chats",
                    type: "Vector<Chat>"
                }, {
                    name: "users",
                    type: "Vector<User>"
                }],
                type: "contacts.Blocked"
            }, {
                id: -513392236,
                predicate: "contacts.blockedSlice",
                params: [{
                    name: "count",
                    type: "int"
                }, {
                    name: "blocked",
                    type: "Vector<PeerBlocked>"
                }, {
                    name: "chats",
                    type: "Vector<Chat>"
                }, {
                    name: "users",
                    type: "Vector<User>"
                }],
                type: "contacts.Blocked"
            }, {
                id: 364538944,
                predicate: "messages.dialogs",
                params: [{
                    name: "dialogs",
                    type: "Vector<Dialog>"
                }, {
                    name: "messages",
                    type: "Vector<Message>"
                }, {
                    name: "chats",
                    type: "Vector<Chat>"
                }, {
                    name: "users",
                    type: "Vector<User>"
                }],
                type: "messages.Dialogs"
            }, {
                id: 1910543603,
                predicate: "messages.dialogsSlice",
                params: [{
                    name: "count",
                    type: "int"
                }, {
                    name: "dialogs",
                    type: "Vector<Dialog>"
                }, {
                    name: "messages",
                    type: "Vector<Message>"
                }, {
                    name: "chats",
                    type: "Vector<Chat>"
                }, {
                    name: "users",
                    type: "Vector<User>"
                }],
                type: "messages.Dialogs"
            }, {
                id: -253500010,
                predicate: "messages.dialogsNotModified",
                params: [{
                    name: "count",
                    type: "int"
                }],
                type: "messages.Dialogs"
            }, {
                id: -1938715001,
                predicate: "messages.messages",
                params: [{
                    name: "messages",
                    type: "Vector<Message>"
                }, {
                    name: "chats",
                    type: "Vector<Chat>"
                }, {
                    name: "users",
                    type: "Vector<User>"
                }],
                type: "messages.Messages"
            }, {
                id: 978610270,
                predicate: "messages.messagesSlice",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "inexact",
                    type: "flags.1?true"
                }, {
                    name: "count",
                    type: "int"
                }, {
                    name: "next_rate",
                    type: "flags.0?int"
                }, {
                    name: "offset_id_offset",
                    type: "flags.2?int"
                }, {
                    name: "messages",
                    type: "Vector<Message>"
                }, {
                    name: "chats",
                    type: "Vector<Chat>"
                }, {
                    name: "users",
                    type: "Vector<User>"
                }],
                type: "messages.Messages"
            }, {
                id: 1682413576,
                predicate: "messages.channelMessages",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "inexact",
                    type: "flags.1?true"
                }, {
                    name: "pts",
                    type: "int"
                }, {
                    name: "count",
                    type: "int"
                }, {
                    name: "offset_id_offset",
                    type: "flags.2?int"
                }, {
                    name: "messages",
                    type: "Vector<Message>"
                }, {
                    name: "chats",
                    type: "Vector<Chat>"
                }, {
                    name: "users",
                    type: "Vector<User>"
                }],
                type: "messages.Messages"
            }, {
                id: 1951620897,
                predicate: "messages.messagesNotModified",
                params: [{
                    name: "count",
                    type: "int"
                }],
                type: "messages.Messages"
            }, {
                id: 1694474197,
                predicate: "messages.chats",
                params: [{
                    name: "chats",
                    type: "Vector<Chat>"
                }],
                type: "messages.Chats"
            }, {
                id: -1663561404,
                predicate: "messages.chatsSlice",
                params: [{
                    name: "count",
                    type: "int"
                }, {
                    name: "chats",
                    type: "Vector<Chat>"
                }],
                type: "messages.Chats"
            }, {
                id: -438840932,
                predicate: "messages.chatFull",
                params: [{
                    name: "full_chat",
                    type: "ChatFull"
                }, {
                    name: "chats",
                    type: "Vector<Chat>"
                }, {
                    name: "users",
                    type: "Vector<User>"
                }],
                type: "messages.ChatFull"
            }, {
                id: -1269012015,
                predicate: "messages.affectedHistory",
                params: [{
                    name: "pts",
                    type: "int"
                }, {
                    name: "pts_count",
                    type: "int"
                }, {
                    name: "offset",
                    type: "int"
                }],
                type: "messages.AffectedHistory"
            }, {
                id: 1474492012,
                predicate: "inputMessagesFilterEmpty",
                params: [],
                type: "MessagesFilter"
            }, {
                id: -1777752804,
                predicate: "inputMessagesFilterPhotos",
                params: [],
                type: "MessagesFilter"
            }, {
                id: -1614803355,
                predicate: "inputMessagesFilterVideo",
                params: [],
                type: "MessagesFilter"
            }, {
                id: 1458172132,
                predicate: "inputMessagesFilterPhotoVideo",
                params: [],
                type: "MessagesFilter"
            }, {
                id: -1629621880,
                predicate: "inputMessagesFilterDocument",
                params: [],
                type: "MessagesFilter"
            }, {
                id: 2129714567,
                predicate: "inputMessagesFilterUrl",
                params: [],
                type: "MessagesFilter"
            }, {
                id: -3644025,
                predicate: "inputMessagesFilterGif",
                params: [],
                type: "MessagesFilter"
            }, {
                id: 1358283666,
                predicate: "inputMessagesFilterVoice",
                params: [],
                type: "MessagesFilter"
            }, {
                id: 928101534,
                predicate: "inputMessagesFilterMusic",
                params: [],
                type: "MessagesFilter"
            }, {
                id: 975236280,
                predicate: "inputMessagesFilterChatPhotos",
                params: [],
                type: "MessagesFilter"
            }, {
                id: -2134272152,
                predicate: "inputMessagesFilterPhoneCalls",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "missed",
                    type: "flags.0?true"
                }],
                type: "MessagesFilter"
            }, {
                id: 2054952868,
                predicate: "inputMessagesFilterRoundVoice",
                params: [],
                type: "MessagesFilter"
            }, {
                id: -1253451181,
                predicate: "inputMessagesFilterRoundVideo",
                params: [],
                type: "MessagesFilter"
            }, {
                id: -1040652646,
                predicate: "inputMessagesFilterMyMentions",
                params: [],
                type: "MessagesFilter"
            }, {
                id: -419271411,
                predicate: "inputMessagesFilterGeo",
                params: [],
                type: "MessagesFilter"
            }, {
                id: -530392189,
                predicate: "inputMessagesFilterContacts",
                params: [],
                type: "MessagesFilter"
            }, {
                id: 464520273,
                predicate: "inputMessagesFilterPinned",
                params: [],
                type: "MessagesFilter"
            }, {
                id: 522914557,
                predicate: "updateNewMessage",
                params: [{
                    name: "message",
                    type: "Message"
                }, {
                    name: "pts",
                    type: "int"
                }, {
                    name: "pts_count",
                    type: "int"
                }],
                type: "Update"
            }, {
                id: 1318109142,
                predicate: "updateMessageID",
                params: [{
                    name: "id",
                    type: "int"
                }, {
                    name: "random_id",
                    type: "long"
                }],
                type: "Update"
            }, {
                id: -1576161051,
                predicate: "updateDeleteMessages",
                params: [{
                    name: "messages",
                    type: "Vector<int>"
                }, {
                    name: "pts",
                    type: "int"
                }, {
                    name: "pts_count",
                    type: "int"
                }],
                type: "Update"
            }, {
                id: -1071741569,
                predicate: "updateUserTyping",
                params: [{
                    name: "user_id",
                    type: "long"
                }, {
                    name: "action",
                    type: "SendMessageAction"
                }],
                type: "Update"
            }, {
                id: -2092401936,
                predicate: "updateChatUserTyping",
                params: [{
                    name: "chat_id",
                    type: "long"
                }, {
                    name: "from_id",
                    type: "Peer"
                }, {
                    name: "action",
                    type: "SendMessageAction"
                }],
                type: "Update"
            }, {
                id: 125178264,
                predicate: "updateChatParticipants",
                params: [{
                    name: "participants",
                    type: "ChatParticipants"
                }],
                type: "Update"
            }, {
                id: -440534818,
                predicate: "updateUserStatus",
                params: [{
                    name: "user_id",
                    type: "long"
                }, {
                    name: "status",
                    type: "UserStatus"
                }],
                type: "Update"
            }, {
                id: -1007549728,
                predicate: "updateUserName",
                params: [{
                    name: "user_id",
                    type: "long"
                }, {
                    name: "first_name",
                    type: "string"
                }, {
                    name: "last_name",
                    type: "string"
                }, {
                    name: "username",
                    type: "string"
                }],
                type: "Update"
            }, {
                id: -232290676,
                predicate: "updateUserPhoto",
                params: [{
                    name: "user_id",
                    type: "long"
                }, {
                    name: "date",
                    type: "int"
                }, {
                    name: "photo",
                    type: "UserProfilePhoto"
                }, {
                    name: "previous",
                    type: "Bool"
                }],
                type: "Update"
            }, {
                id: 314359194,
                predicate: "updateNewEncryptedMessage",
                params: [{
                    name: "message",
                    type: "EncryptedMessage"
                }, {
                    name: "qts",
                    type: "int"
                }],
                type: "Update"
            }, {
                id: 386986326,
                predicate: "updateEncryptedChatTyping",
                params: [{
                    name: "chat_id",
                    type: "int"
                }],
                type: "Update"
            }, {
                id: -1264392051,
                predicate: "updateEncryption",
                params: [{
                    name: "chat",
                    type: "EncryptedChat"
                }, {
                    name: "date",
                    type: "int"
                }],
                type: "Update"
            }, {
                id: 956179895,
                predicate: "updateEncryptedMessagesRead",
                params: [{
                    name: "chat_id",
                    type: "int"
                }, {
                    name: "max_date",
                    type: "int"
                }, {
                    name: "date",
                    type: "int"
                }],
                type: "Update"
            }, {
                id: 1037718609,
                predicate: "updateChatParticipantAdd",
                params: [{
                    name: "chat_id",
                    type: "long"
                }, {
                    name: "user_id",
                    type: "long"
                }, {
                    name: "inviter_id",
                    type: "long"
                }, {
                    name: "date",
                    type: "int"
                }, {
                    name: "version",
                    type: "int"
                }],
                type: "Update"
            }, {
                id: -483443337,
                predicate: "updateChatParticipantDelete",
                params: [{
                    name: "chat_id",
                    type: "long"
                }, {
                    name: "user_id",
                    type: "long"
                }, {
                    name: "version",
                    type: "int"
                }],
                type: "Update"
            }, {
                id: -1906403213,
                predicate: "updateDcOptions",
                params: [{
                    name: "dc_options",
                    type: "Vector<DcOption>"
                }],
                type: "Update"
            }, {
                id: -1094555409,
                predicate: "updateNotifySettings",
                params: [{
                    name: "peer",
                    type: "NotifyPeer"
                }, {
                    name: "notify_settings",
                    type: "PeerNotifySettings"
                }],
                type: "Update"
            }, {
                id: -337352679,
                predicate: "updateServiceNotification",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "popup",
                    type: "flags.0?true"
                }, {
                    name: "inbox_date",
                    type: "flags.1?int"
                }, {
                    name: "type",
                    type: "string"
                }, {
                    name: "message",
                    type: "string"
                }, {
                    name: "media",
                    type: "MessageMedia"
                }, {
                    name: "entities",
                    type: "Vector<MessageEntity>"
                }],
                type: "Update"
            }, {
                id: -298113238,
                predicate: "updatePrivacy",
                params: [{
                    name: "key",
                    type: "PrivacyKey"
                }, {
                    name: "rules",
                    type: "Vector<PrivacyRule>"
                }],
                type: "Update"
            }, {
                id: 88680979,
                predicate: "updateUserPhone",
                params: [{
                    name: "user_id",
                    type: "long"
                }, {
                    name: "phone",
                    type: "string"
                }],
                type: "Update"
            }, {
                id: -1667805217,
                predicate: "updateReadHistoryInbox",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "folder_id",
                    type: "flags.0?int"
                }, {
                    name: "peer",
                    type: "Peer"
                }, {
                    name: "max_id",
                    type: "int"
                }, {
                    name: "still_unread_count",
                    type: "int"
                }, {
                    name: "pts",
                    type: "int"
                }, {
                    name: "pts_count",
                    type: "int"
                }],
                type: "Update"
            }, {
                id: 791617983,
                predicate: "updateReadHistoryOutbox",
                params: [{
                    name: "peer",
                    type: "Peer"
                }, {
                    name: "max_id",
                    type: "int"
                }, {
                    name: "pts",
                    type: "int"
                }, {
                    name: "pts_count",
                    type: "int"
                }],
                type: "Update"
            }, {
                id: 2139689491,
                predicate: "updateWebPage",
                params: [{
                    name: "webpage",
                    type: "WebPage"
                }, {
                    name: "pts",
                    type: "int"
                }, {
                    name: "pts_count",
                    type: "int"
                }],
                type: "Update"
            }, {
                id: 1757493555,
                predicate: "updateReadMessagesContents",
                params: [{
                    name: "messages",
                    type: "Vector<int>"
                }, {
                    name: "pts",
                    type: "int"
                }, {
                    name: "pts_count",
                    type: "int"
                }],
                type: "Update"
            }, {
                id: 277713951,
                predicate: "updateChannelTooLong",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "channel_id",
                    type: "long"
                }, {
                    name: "pts",
                    type: "flags.0?int"
                }],
                type: "Update"
            }, {
                id: 1666927625,
                predicate: "updateChannel",
                params: [{
                    name: "channel_id",
                    type: "long"
                }],
                type: "Update"
            }, {
                id: 1656358105,
                predicate: "updateNewChannelMessage",
                params: [{
                    name: "message",
                    type: "Message"
                }, {
                    name: "pts",
                    type: "int"
                }, {
                    name: "pts_count",
                    type: "int"
                }],
                type: "Update"
            }, {
                id: -1842450928,
                predicate: "updateReadChannelInbox",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "folder_id",
                    type: "flags.0?int"
                }, {
                    name: "channel_id",
                    type: "long"
                }, {
                    name: "max_id",
                    type: "int"
                }, {
                    name: "still_unread_count",
                    type: "int"
                }, {
                    name: "pts",
                    type: "int"
                }],
                type: "Update"
            }, {
                id: -1020437742,
                predicate: "updateDeleteChannelMessages",
                params: [{
                    name: "channel_id",
                    type: "long"
                }, {
                    name: "messages",
                    type: "Vector<int>"
                }, {
                    name: "pts",
                    type: "int"
                }, {
                    name: "pts_count",
                    type: "int"
                }],
                type: "Update"
            }, {
                id: -232346616,
                predicate: "updateChannelMessageViews",
                params: [{
                    name: "channel_id",
                    type: "long"
                }, {
                    name: "id",
                    type: "int"
                }, {
                    name: "views",
                    type: "int"
                }],
                type: "Update"
            }, {
                id: -674602590,
                predicate: "updateChatParticipantAdmin",
                params: [{
                    name: "chat_id",
                    type: "long"
                }, {
                    name: "user_id",
                    type: "long"
                }, {
                    name: "is_admin",
                    type: "Bool"
                }, {
                    name: "version",
                    type: "int"
                }],
                type: "Update"
            }, {
                id: 1753886890,
                predicate: "updateNewStickerSet",
                params: [{
                    name: "stickerset",
                    type: "messages.StickerSet"
                }],
                type: "Update"
            }, {
                id: 196268545,
                predicate: "updateStickerSetsOrder",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "masks",
                    type: "flags.0?true"
                }, {
                    name: "order",
                    type: "Vector<long>"
                }],
                type: "Update"
            }, {
                id: 1135492588,
                predicate: "updateStickerSets",
                params: [],
                type: "Update"
            }, {
                id: -1821035490,
                predicate: "updateSavedGifs",
                params: [],
                type: "Update"
            }, {
                id: 1232025500,
                predicate: "updateBotInlineQuery",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "query_id",
                    type: "long"
                }, {
                    name: "user_id",
                    type: "long"
                }, {
                    name: "query",
                    type: "string"
                }, {
                    name: "geo",
                    type: "flags.0?GeoPoint"
                }, {
                    name: "peer_type",
                    type: "flags.1?InlineQueryPeerType"
                }, {
                    name: "offset",
                    type: "string"
                }],
                type: "Update"
            }, {
                id: 317794823,
                predicate: "updateBotInlineSend",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "user_id",
                    type: "long"
                }, {
                    name: "query",
                    type: "string"
                }, {
                    name: "geo",
                    type: "flags.0?GeoPoint"
                }, {
                    name: "id",
                    type: "string"
                }, {
                    name: "msg_id",
                    type: "flags.1?InputBotInlineMessageID"
                }],
                type: "Update"
            }, {
                id: 457133559,
                predicate: "updateEditChannelMessage",
                params: [{
                    name: "message",
                    type: "Message"
                }, {
                    name: "pts",
                    type: "int"
                }, {
                    name: "pts_count",
                    type: "int"
                }],
                type: "Update"
            }, {
                id: -1177566067,
                predicate: "updateBotCallbackQuery",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "query_id",
                    type: "long"
                }, {
                    name: "user_id",
                    type: "long"
                }, {
                    name: "peer",
                    type: "Peer"
                }, {
                    name: "msg_id",
                    type: "int"
                }, {
                    name: "chat_instance",
                    type: "long"
                }, {
                    name: "data",
                    type: "flags.0?bytes"
                }, {
                    name: "game_short_name",
                    type: "flags.1?string"
                }],
                type: "Update"
            }, {
                id: -469536605,
                predicate: "updateEditMessage",
                params: [{
                    name: "message",
                    type: "Message"
                }, {
                    name: "pts",
                    type: "int"
                }, {
                    name: "pts_count",
                    type: "int"
                }],
                type: "Update"
            }, {
                id: 1763610706,
                predicate: "updateInlineBotCallbackQuery",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "query_id",
                    type: "long"
                }, {
                    name: "user_id",
                    type: "long"
                }, {
                    name: "msg_id",
                    type: "InputBotInlineMessageID"
                }, {
                    name: "chat_instance",
                    type: "long"
                }, {
                    name: "data",
                    type: "flags.0?bytes"
                }, {
                    name: "game_short_name",
                    type: "flags.1?string"
                }],
                type: "Update"
            }, {
                id: -1218471511,
                predicate: "updateReadChannelOutbox",
                params: [{
                    name: "channel_id",
                    type: "long"
                }, {
                    name: "max_id",
                    type: "int"
                }],
                type: "Update"
            }, {
                id: -299124375,
                predicate: "updateDraftMessage",
                params: [{
                    name: "peer",
                    type: "Peer"
                }, {
                    name: "draft",
                    type: "DraftMessage"
                }],
                type: "Update"
            }, {
                id: 1461528386,
                predicate: "updateReadFeaturedStickers",
                params: [],
                type: "Update"
            }, {
                id: -1706939360,
                predicate: "updateRecentStickers",
                params: [],
                type: "Update"
            }, {
                id: -1574314746,
                predicate: "updateConfig",
                params: [],
                type: "Update"
            }, {
                id: 861169551,
                predicate: "updatePtsChanged",
                params: [],
                type: "Update"
            }, {
                id: 791390623,
                predicate: "updateChannelWebPage",
                params: [{
                    name: "channel_id",
                    type: "long"
                }, {
                    name: "webpage",
                    type: "WebPage"
                }, {
                    name: "pts",
                    type: "int"
                }, {
                    name: "pts_count",
                    type: "int"
                }],
                type: "Update"
            }, {
                id: 1852826908,
                predicate: "updateDialogPinned",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "pinned",
                    type: "flags.0?true"
                }, {
                    name: "folder_id",
                    type: "flags.1?int"
                }, {
                    name: "peer",
                    type: "DialogPeer"
                }],
                type: "Update"
            }, {
                id: -99664734,
                predicate: "updatePinnedDialogs",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "folder_id",
                    type: "flags.1?int"
                }, {
                    name: "order",
                    type: "flags.0?Vector<DialogPeer>"
                }],
                type: "Update"
            }, {
                id: -2095595325,
                predicate: "updateBotWebhookJSON",
                params: [{
                    name: "data",
                    type: "DataJSON"
                }],
                type: "Update"
            }, {
                id: -1684914010,
                predicate: "updateBotWebhookJSONQuery",
                params: [{
                    name: "query_id",
                    type: "long"
                }, {
                    name: "data",
                    type: "DataJSON"
                }, {
                    name: "timeout",
                    type: "int"
                }],
                type: "Update"
            }, {
                id: -1246823043,
                predicate: "updateBotShippingQuery",
                params: [{
                    name: "query_id",
                    type: "long"
                }, {
                    name: "user_id",
                    type: "long"
                }, {
                    name: "payload",
                    type: "bytes"
                }, {
                    name: "shipping_address",
                    type: "PostAddress"
                }],
                type: "Update"
            }, {
                id: -1934976362,
                predicate: "updateBotPrecheckoutQuery",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "query_id",
                    type: "long"
                }, {
                    name: "user_id",
                    type: "long"
                }, {
                    name: "payload",
                    type: "bytes"
                }, {
                    name: "info",
                    type: "flags.0?PaymentRequestedInfo"
                }, {
                    name: "shipping_option_id",
                    type: "flags.1?string"
                }, {
                    name: "currency",
                    type: "string"
                }, {
                    name: "total_amount",
                    type: "long"
                }],
                type: "Update"
            }, {
                id: -1425052898,
                predicate: "updatePhoneCall",
                params: [{
                    name: "phone_call",
                    type: "PhoneCall"
                }],
                type: "Update"
            }, {
                id: 1180041828,
                predicate: "updateLangPackTooLong",
                params: [{
                    name: "lang_code",
                    type: "string"
                }],
                type: "Update"
            }, {
                id: 1442983757,
                predicate: "updateLangPack",
                params: [{
                    name: "difference",
                    type: "LangPackDifference"
                }],
                type: "Update"
            }, {
                id: -451831443,
                predicate: "updateFavedStickers",
                params: [],
                type: "Update"
            }, {
                id: 1153291573,
                predicate: "updateChannelReadMessagesContents",
                params: [{
                    name: "channel_id",
                    type: "long"
                }, {
                    name: "messages",
                    type: "Vector<int>"
                }],
                type: "Update"
            }, {
                id: 1887741886,
                predicate: "updateContactsReset",
                params: [],
                type: "Update"
            }, {
                id: -1304443240,
                predicate: "updateChannelAvailableMessages",
                params: [{
                    name: "channel_id",
                    type: "long"
                }, {
                    name: "available_min_id",
                    type: "int"
                }],
                type: "Update"
            }, {
                id: -513517117,
                predicate: "updateDialogUnreadMark",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "unread",
                    type: "flags.0?true"
                }, {
                    name: "peer",
                    type: "DialogPeer"
                }],
                type: "Update"
            }, {
                id: -1398708869,
                predicate: "updateMessagePoll",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "poll_id",
                    type: "long"
                }, {
                    name: "poll",
                    type: "flags.0?Poll"
                }, {
                    name: "results",
                    type: "PollResults"
                }],
                type: "Update"
            }, {
                id: 1421875280,
                predicate: "updateChatDefaultBannedRights",
                params: [{
                    name: "peer",
                    type: "Peer"
                }, {
                    name: "default_banned_rights",
                    type: "ChatBannedRights"
                }, {
                    name: "version",
                    type: "int"
                }],
                type: "Update"
            }, {
                id: 422972864,
                predicate: "updateFolderPeers",
                params: [{
                    name: "folder_peers",
                    type: "Vector<FolderPeer>"
                }, {
                    name: "pts",
                    type: "int"
                }, {
                    name: "pts_count",
                    type: "int"
                }],
                type: "Update"
            }, {
                id: 1786671974,
                predicate: "updatePeerSettings",
                params: [{
                    name: "peer",
                    type: "Peer"
                }, {
                    name: "settings",
                    type: "PeerSettings"
                }],
                type: "Update"
            }, {
                id: -1263546448,
                predicate: "updatePeerLocated",
                params: [{
                    name: "peers",
                    type: "Vector<PeerLocated>"
                }],
                type: "Update"
            }, {
                id: 967122427,
                predicate: "updateNewScheduledMessage",
                params: [{
                    name: "message",
                    type: "Message"
                }],
                type: "Update"
            }, {
                id: -1870238482,
                predicate: "updateDeleteScheduledMessages",
                params: [{
                    name: "peer",
                    type: "Peer"
                }, {
                    name: "messages",
                    type: "Vector<int>"
                }],
                type: "Update"
            }, {
                id: -2112423005,
                predicate: "updateTheme",
                params: [{
                    name: "theme",
                    type: "Theme"
                }],
                type: "Update"
            }, {
                id: -2027964103,
                predicate: "updateGeoLiveViewed",
                params: [{
                    name: "peer",
                    type: "Peer"
                }, {
                    name: "msg_id",
                    type: "int"
                }],
                type: "Update"
            }, {
                id: 1448076945,
                predicate: "updateLoginToken",
                params: [],
                type: "Update"
            }, {
                id: 274961865,
                predicate: "updateMessagePollVote",
                params: [{
                    name: "poll_id",
                    type: "long"
                }, {
                    name: "user_id",
                    type: "long"
                }, {
                    name: "options",
                    type: "Vector<bytes>"
                }, {
                    name: "qts",
                    type: "int"
                }],
                type: "Update"
            }, {
                id: 654302845,
                predicate: "updateDialogFilter",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "id",
                    type: "int"
                }, {
                    name: "filter",
                    type: "flags.0?DialogFilter"
                }],
                type: "Update"
            }, {
                id: -1512627963,
                predicate: "updateDialogFilterOrder",
                params: [{
                    name: "order",
                    type: "Vector<int>"
                }],
                type: "Update"
            }, {
                id: 889491791,
                predicate: "updateDialogFilters",
                params: [],
                type: "Update"
            }, {
                id: 643940105,
                predicate: "updatePhoneCallSignalingData",
                params: [{
                    name: "phone_call_id",
                    type: "long"
                }, {
                    name: "data",
                    type: "bytes"
                }],
                type: "Update"
            }, {
                id: -761649164,
                predicate: "updateChannelMessageForwards",
                params: [{
                    name: "channel_id",
                    type: "long"
                }, {
                    name: "id",
                    type: "int"
                }, {
                    name: "forwards",
                    type: "int"
                }],
                type: "Update"
            }, {
                id: -693004986,
                predicate: "updateReadChannelDiscussionInbox",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "channel_id",
                    type: "long"
                }, {
                    name: "top_msg_id",
                    type: "int"
                }, {
                    name: "read_max_id",
                    type: "int"
                }, {
                    name: "broadcast_id",
                    type: "flags.0?long"
                }, {
                    name: "broadcast_post",
                    type: "flags.0?int"
                }],
                type: "Update"
            }, {
                id: 1767677564,
                predicate: "updateReadChannelDiscussionOutbox",
                params: [{
                    name: "channel_id",
                    type: "long"
                }, {
                    name: "top_msg_id",
                    type: "int"
                }, {
                    name: "read_max_id",
                    type: "int"
                }],
                type: "Update"
            }, {
                id: 610945826,
                predicate: "updatePeerBlocked",
                params: [{
                    name: "peer_id",
                    type: "Peer"
                }, {
                    name: "blocked",
                    type: "Bool"
                }],
                type: "Update"
            }, {
                id: -1937192669,
                predicate: "updateChannelUserTyping",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "channel_id",
                    type: "long"
                }, {
                    name: "top_msg_id",
                    type: "flags.0?int"
                }, {
                    name: "from_id",
                    type: "Peer"
                }, {
                    name: "action",
                    type: "SendMessageAction"
                }],
                type: "Update"
            }, {
                id: -309990731,
                predicate: "updatePinnedMessages",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "pinned",
                    type: "flags.0?true"
                }, {
                    name: "peer",
                    type: "Peer"
                }, {
                    name: "messages",
                    type: "Vector<int>"
                }, {
                    name: "pts",
                    type: "int"
                }, {
                    name: "pts_count",
                    type: "int"
                }],
                type: "Update"
            }, {
                id: 1538885128,
                predicate: "updatePinnedChannelMessages",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "pinned",
                    type: "flags.0?true"
                }, {
                    name: "channel_id",
                    type: "long"
                }, {
                    name: "messages",
                    type: "Vector<int>"
                }, {
                    name: "pts",
                    type: "int"
                }, {
                    name: "pts_count",
                    type: "int"
                }],
                type: "Update"
            }, {
                id: -124097970,
                predicate: "updateChat",
                params: [{
                    name: "chat_id",
                    type: "long"
                }],
                type: "Update"
            }, {
                id: -219423922,
                predicate: "updateGroupCallParticipants",
                params: [{
                    name: "call",
                    type: "InputGroupCall"
                }, {
                    name: "participants",
                    type: "Vector<GroupCallParticipant>"
                }, {
                    name: "version",
                    type: "int"
                }],
                type: "Update"
            }, {
                id: 347227392,
                predicate: "updateGroupCall",
                params: [{
                    name: "chat_id",
                    type: "long"
                }, {
                    name: "call",
                    type: "GroupCall"
                }],
                type: "Update"
            }, {
                id: -1147422299,
                predicate: "updatePeerHistoryTTL",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "peer",
                    type: "Peer"
                }, {
                    name: "ttl_period",
                    type: "flags.0?int"
                }],
                type: "Update"
            }, {
                id: -796432838,
                predicate: "updateChatParticipant",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "chat_id",
                    type: "long"
                }, {
                    name: "date",
                    type: "int"
                }, {
                    name: "actor_id",
                    type: "long"
                }, {
                    name: "user_id",
                    type: "long"
                }, {
                    name: "prev_participant",
                    type: "flags.0?ChatParticipant"
                }, {
                    name: "new_participant",
                    type: "flags.1?ChatParticipant"
                }, {
                    name: "invite",
                    type: "flags.2?ExportedChatInvite"
                }, {
                    name: "qts",
                    type: "int"
                }],
                type: "Update"
            }, {
                id: -1738720581,
                predicate: "updateChannelParticipant",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "channel_id",
                    type: "long"
                }, {
                    name: "date",
                    type: "int"
                }, {
                    name: "actor_id",
                    type: "long"
                }, {
                    name: "user_id",
                    type: "long"
                }, {
                    name: "prev_participant",
                    type: "flags.0?ChannelParticipant"
                }, {
                    name: "new_participant",
                    type: "flags.1?ChannelParticipant"
                }, {
                    name: "invite",
                    type: "flags.2?ExportedChatInvite"
                }, {
                    name: "qts",
                    type: "int"
                }],
                type: "Update"
            }, {
                id: -997782967,
                predicate: "updateBotStopped",
                params: [{
                    name: "user_id",
                    type: "long"
                }, {
                    name: "date",
                    type: "int"
                }, {
                    name: "stopped",
                    type: "Bool"
                }, {
                    name: "qts",
                    type: "int"
                }],
                type: "Update"
            }, {
                id: 192428418,
                predicate: "updateGroupCallConnection",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "presentation",
                    type: "flags.0?true"
                }, {
                    name: "params",
                    type: "DataJSON"
                }],
                type: "Update"
            }, {
                id: 1299263278,
                predicate: "updateBotCommands",
                params: [{
                    name: "peer",
                    type: "Peer"
                }, {
                    name: "bot_id",
                    type: "long"
                }, {
                    name: "commands",
                    type: "Vector<BotCommand>"
                }],
                type: "Update"
            }, {
                id: -1519637954,
                predicate: "updates.state",
                params: [{
                    name: "pts",
                    type: "int"
                }, {
                    name: "qts",
                    type: "int"
                }, {
                    name: "date",
                    type: "int"
                }, {
                    name: "seq",
                    type: "int"
                }, {
                    name: "unread_count",
                    type: "int"
                }],
                type: "updates.State"
            }, {
                id: 1567990072,
                predicate: "updates.differenceEmpty",
                params: [{
                    name: "date",
                    type: "int"
                }, {
                    name: "seq",
                    type: "int"
                }],
                type: "updates.Difference"
            }, {
                id: 16030880,
                predicate: "updates.difference",
                params: [{
                    name: "new_messages",
                    type: "Vector<Message>"
                }, {
                    name: "new_encrypted_messages",
                    type: "Vector<EncryptedMessage>"
                }, {
                    name: "other_updates",
                    type: "Vector<Update>"
                }, {
                    name: "chats",
                    type: "Vector<Chat>"
                }, {
                    name: "users",
                    type: "Vector<User>"
                }, {
                    name: "state",
                    type: "updates.State"
                }],
                type: "updates.Difference"
            }, {
                id: -1459938943,
                predicate: "updates.differenceSlice",
                params: [{
                    name: "new_messages",
                    type: "Vector<Message>"
                }, {
                    name: "new_encrypted_messages",
                    type: "Vector<EncryptedMessage>"
                }, {
                    name: "other_updates",
                    type: "Vector<Update>"
                }, {
                    name: "chats",
                    type: "Vector<Chat>"
                }, {
                    name: "users",
                    type: "Vector<User>"
                }, {
                    name: "intermediate_state",
                    type: "updates.State"
                }],
                type: "updates.Difference"
            }, {
                id: 1258196845,
                predicate: "updates.differenceTooLong",
                params: [{
                    name: "pts",
                    type: "int"
                }],
                type: "updates.Difference"
            }, {
                id: -484987010,
                predicate: "updatesTooLong",
                params: [],
                type: "Updates"
            }, {
                id: 826001400,
                predicate: "updateShortMessage",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "out",
                    type: "flags.1?true"
                }, {
                    name: "mentioned",
                    type: "flags.4?true"
                }, {
                    name: "media_unread",
                    type: "flags.5?true"
                }, {
                    name: "silent",
                    type: "flags.13?true"
                }, {
                    name: "id",
                    type: "int"
                }, {
                    name: "user_id",
                    type: "long"
                }, {
                    name: "message",
                    type: "string"
                }, {
                    name: "pts",
                    type: "int"
                }, {
                    name: "pts_count",
                    type: "int"
                }, {
                    name: "date",
                    type: "int"
                }, {
                    name: "fwd_from",
                    type: "flags.2?MessageFwdHeader"
                }, {
                    name: "via_bot_id",
                    type: "flags.11?long"
                }, {
                    name: "reply_to",
                    type: "flags.3?MessageReplyHeader"
                }, {
                    name: "entities",
                    type: "flags.7?Vector<MessageEntity>"
                }, {
                    name: "ttl_period",
                    type: "flags.25?int"
                }],
                type: "Updates"
            }, {
                id: 1299050149,
                predicate: "updateShortChatMessage",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "out",
                    type: "flags.1?true"
                }, {
                    name: "mentioned",
                    type: "flags.4?true"
                }, {
                    name: "media_unread",
                    type: "flags.5?true"
                }, {
                    name: "silent",
                    type: "flags.13?true"
                }, {
                    name: "id",
                    type: "int"
                }, {
                    name: "from_id",
                    type: "long"
                }, {
                    name: "chat_id",
                    type: "long"
                }, {
                    name: "message",
                    type: "string"
                }, {
                    name: "pts",
                    type: "int"
                }, {
                    name: "pts_count",
                    type: "int"
                }, {
                    name: "date",
                    type: "int"
                }, {
                    name: "fwd_from",
                    type: "flags.2?MessageFwdHeader"
                }, {
                    name: "via_bot_id",
                    type: "flags.11?long"
                }, {
                    name: "reply_to",
                    type: "flags.3?MessageReplyHeader"
                }, {
                    name: "entities",
                    type: "flags.7?Vector<MessageEntity>"
                }, {
                    name: "ttl_period",
                    type: "flags.25?int"
                }],
                type: "Updates"
            }, {
                id: 2027216577,
                predicate: "updateShort",
                params: [{
                    name: "update",
                    type: "Update"
                }, {
                    name: "date",
                    type: "int"
                }],
                type: "Updates"
            }, {
                id: 1918567619,
                predicate: "updatesCombined",
                params: [{
                    name: "updates",
                    type: "Vector<Update>"
                }, {
                    name: "users",
                    type: "Vector<User>"
                }, {
                    name: "chats",
                    type: "Vector<Chat>"
                }, {
                    name: "date",
                    type: "int"
                }, {
                    name: "seq_start",
                    type: "int"
                }, {
                    name: "seq",
                    type: "int"
                }],
                type: "Updates"
            }, {
                id: 1957577280,
                predicate: "updates",
                params: [{
                    name: "updates",
                    type: "Vector<Update>"
                }, {
                    name: "users",
                    type: "Vector<User>"
                }, {
                    name: "chats",
                    type: "Vector<Chat>"
                }, {
                    name: "date",
                    type: "int"
                }, {
                    name: "seq",
                    type: "int"
                }],
                type: "Updates"
            }, {
                id: -1877614335,
                predicate: "updateShortSentMessage",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "out",
                    type: "flags.1?true"
                }, {
                    name: "id",
                    type: "int"
                }, {
                    name: "pts",
                    type: "int"
                }, {
                    name: "pts_count",
                    type: "int"
                }, {
                    name: "date",
                    type: "int"
                }, {
                    name: "media",
                    type: "flags.9?MessageMedia"
                }, {
                    name: "entities",
                    type: "flags.7?Vector<MessageEntity>"
                }, {
                    name: "ttl_period",
                    type: "flags.25?int"
                }],
                type: "Updates"
            }, {
                id: -1916114267,
                predicate: "photos.photos",
                params: [{
                    name: "photos",
                    type: "Vector<Photo>"
                }, {
                    name: "users",
                    type: "Vector<User>"
                }],
                type: "photos.Photos"
            }, {
                id: 352657236,
                predicate: "photos.photosSlice",
                params: [{
                    name: "count",
                    type: "int"
                }, {
                    name: "photos",
                    type: "Vector<Photo>"
                }, {
                    name: "users",
                    type: "Vector<User>"
                }],
                type: "photos.Photos"
            }, {
                id: 539045032,
                predicate: "photos.photo",
                params: [{
                    name: "photo",
                    type: "Photo"
                }, {
                    name: "users",
                    type: "Vector<User>"
                }],
                type: "photos.Photo"
            }, {
                id: 157948117,
                predicate: "upload.file",
                params: [{
                    name: "type",
                    type: "storage.FileType"
                }, {
                    name: "mtime",
                    type: "int"
                }, {
                    name: "bytes",
                    type: "bytes"
                }],
                type: "upload.File"
            }, {
                id: -242427324,
                predicate: "upload.fileCdnRedirect",
                params: [{
                    name: "dc_id",
                    type: "int"
                }, {
                    name: "file_token",
                    type: "bytes"
                }, {
                    name: "encryption_key",
                    type: "bytes"
                }, {
                    name: "encryption_iv",
                    type: "bytes"
                }, {
                    name: "file_hashes",
                    type: "Vector<FileHash>"
                }],
                type: "upload.File"
            }, {
                id: 414687501,
                predicate: "dcOption",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "ipv6",
                    type: "flags.0?true"
                }, {
                    name: "media_only",
                    type: "flags.1?true"
                }, {
                    name: "tcpo_only",
                    type: "flags.2?true"
                }, {
                    name: "cdn",
                    type: "flags.3?true"
                }, {
                    name: "static",
                    type: "flags.4?true"
                }, {
                    name: "id",
                    type: "int"
                }, {
                    name: "ip_address",
                    type: "string"
                }, {
                    name: "port",
                    type: "int"
                }, {
                    name: "secret",
                    type: "flags.10?bytes"
                }],
                type: "DcOption"
            }, {
                id: 856375399,
                predicate: "config",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "phonecalls_enabled",
                    type: "flags.1?true"
                }, {
                    name: "default_p2p_contacts",
                    type: "flags.3?true"
                }, {
                    name: "preload_featured_stickers",
                    type: "flags.4?true"
                }, {
                    name: "ignore_phone_entities",
                    type: "flags.5?true"
                }, {
                    name: "revoke_pm_inbox",
                    type: "flags.6?true"
                }, {
                    name: "blocked_mode",
                    type: "flags.8?true"
                }, {
                    name: "pfs_enabled",
                    type: "flags.13?true"
                }, {
                    name: "date",
                    type: "int"
                }, {
                    name: "expires",
                    type: "int"
                }, {
                    name: "test_mode",
                    type: "Bool"
                }, {
                    name: "this_dc",
                    type: "int"
                }, {
                    name: "dc_options",
                    type: "Vector<DcOption>"
                }, {
                    name: "dc_txt_domain_name",
                    type: "string"
                }, {
                    name: "chat_size_max",
                    type: "int"
                }, {
                    name: "megagroup_size_max",
                    type: "int"
                }, {
                    name: "forwarded_count_max",
                    type: "int"
                }, {
                    name: "online_update_period_ms",
                    type: "int"
                }, {
                    name: "offline_blur_timeout_ms",
                    type: "int"
                }, {
                    name: "offline_idle_timeout_ms",
                    type: "int"
                }, {
                    name: "online_cloud_timeout_ms",
                    type: "int"
                }, {
                    name: "notify_cloud_delay_ms",
                    type: "int"
                }, {
                    name: "notify_default_delay_ms",
                    type: "int"
                }, {
                    name: "push_chat_period_ms",
                    type: "int"
                }, {
                    name: "push_chat_limit",
                    type: "int"
                }, {
                    name: "saved_gifs_limit",
                    type: "int"
                }, {
                    name: "edit_time_limit",
                    type: "int"
                }, {
                    name: "revoke_time_limit",
                    type: "int"
                }, {
                    name: "revoke_pm_time_limit",
                    type: "int"
                }, {
                    name: "rating_e_decay",
                    type: "int"
                }, {
                    name: "stickers_recent_limit",
                    type: "int"
                }, {
                    name: "stickers_faved_limit",
                    type: "int"
                }, {
                    name: "channels_read_media_period",
                    type: "int"
                }, {
                    name: "tmp_sessions",
                    type: "flags.0?int"
                }, {
                    name: "pinned_dialogs_count_max",
                    type: "int"
                }, {
                    name: "pinned_infolder_count_max",
                    type: "int"
                }, {
                    name: "call_receive_timeout_ms",
                    type: "int"
                }, {
                    name: "call_ring_timeout_ms",
                    type: "int"
                }, {
                    name: "call_connect_timeout_ms",
                    type: "int"
                }, {
                    name: "call_packet_timeout_ms",
                    type: "int"
                }, {
                    name: "me_url_prefix",
                    type: "string"
                }, {
                    name: "autoupdate_url_prefix",
                    type: "flags.7?string"
                }, {
                    name: "gif_search_username",
                    type: "flags.9?string"
                }, {
                    name: "venue_search_username",
                    type: "flags.10?string"
                }, {
                    name: "img_search_username",
                    type: "flags.11?string"
                }, {
                    name: "static_maps_provider",
                    type: "flags.12?string"
                }, {
                    name: "caption_length_max",
                    type: "int"
                }, {
                    name: "message_length_max",
                    type: "int"
                }, {
                    name: "webfile_dc_id",
                    type: "int"
                }, {
                    name: "suggested_lang_code",
                    type: "flags.2?string"
                }, {
                    name: "lang_pack_version",
                    type: "flags.2?int"
                }, {
                    name: "base_lang_pack_version",
                    type: "flags.2?int"
                }, {
                    name: "schedule_period_foreground_ms",
                    type: "int"
                }, {
                    name: "schedule_period_background_ms",
                    type: "int"
                }, {
                    name: "schedule_period_background_delay_ms",
                    type: "int"
                }, {
                    name: "upload_chunk_size_kb",
                    type: "int"
                }, {
                    name: "download_chunk_size_kb",
                    type: "int"
                }],
                type: "Config"
            }, {
                id: -1910892683,
                predicate: "nearestDc",
                params: [{
                    name: "country",
                    type: "string"
                }, {
                    name: "this_dc",
                    type: "int"
                }, {
                    name: "nearest_dc",
                    type: "int"
                }],
                type: "NearestDc"
            }, {
                id: -860107216,
                predicate: "help.appUpdate",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "can_not_skip",
                    type: "flags.0?true"
                }, {
                    name: "id",
                    type: "int"
                }, {
                    name: "version",
                    type: "string"
                }, {
                    name: "text",
                    type: "string"
                }, {
                    name: "entities",
                    type: "Vector<MessageEntity>"
                }, {
                    name: "document",
                    type: "flags.1?Document"
                }, {
                    name: "url",
                    type: "flags.2?string"
                }, {
                    name: "sticker",
                    type: "flags.3?Document"
                }],
                type: "help.AppUpdate"
            }, {
                id: -1000708810,
                predicate: "help.noAppUpdate",
                params: [],
                type: "help.AppUpdate"
            }, {
                id: 415997816,
                predicate: "help.inviteText",
                params: [{
                    name: "message",
                    type: "string"
                }],
                type: "help.InviteText"
            }, {
                id: -1417756512,
                predicate: "encryptedChatEmpty",
                params: [{
                    name: "id",
                    type: "int"
                }],
                type: "EncryptedChat"
            }, {
                id: 1722964307,
                predicate: "encryptedChatWaiting",
                params: [{
                    name: "id",
                    type: "int"
                }, {
                    name: "access_hash",
                    type: "long"
                }, {
                    name: "date",
                    type: "int"
                }, {
                    name: "admin_id",
                    type: "long"
                }, {
                    name: "participant_id",
                    type: "long"
                }],
                type: "EncryptedChat"
            }, {
                id: 1223809356,
                predicate: "encryptedChatRequested",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "folder_id",
                    type: "flags.0?int"
                }, {
                    name: "id",
                    type: "int"
                }, {
                    name: "access_hash",
                    type: "long"
                }, {
                    name: "date",
                    type: "int"
                }, {
                    name: "admin_id",
                    type: "long"
                }, {
                    name: "participant_id",
                    type: "long"
                }, {
                    name: "g_a",
                    type: "bytes"
                }],
                type: "EncryptedChat"
            }, {
                id: 1643173063,
                predicate: "encryptedChat",
                params: [{
                    name: "id",
                    type: "int"
                }, {
                    name: "access_hash",
                    type: "long"
                }, {
                    name: "date",
                    type: "int"
                }, {
                    name: "admin_id",
                    type: "long"
                }, {
                    name: "participant_id",
                    type: "long"
                }, {
                    name: "g_a_or_b",
                    type: "bytes"
                }, {
                    name: "key_fingerprint",
                    type: "long"
                }],
                type: "EncryptedChat"
            }, {
                id: 505183301,
                predicate: "encryptedChatDiscarded",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "history_deleted",
                    type: "flags.0?true"
                }, {
                    name: "id",
                    type: "int"
                }],
                type: "EncryptedChat"
            }, {
                id: -247351839,
                predicate: "inputEncryptedChat",
                params: [{
                    name: "chat_id",
                    type: "int"
                }, {
                    name: "access_hash",
                    type: "long"
                }],
                type: "InputEncryptedChat"
            }, {
                id: -1038136962,
                predicate: "encryptedFileEmpty",
                params: [],
                type: "EncryptedFile"
            }, {
                id: 1248893260,
                predicate: "encryptedFile",
                params: [{
                    name: "id",
                    type: "long"
                }, {
                    name: "access_hash",
                    type: "long"
                }, {
                    name: "size",
                    type: "int"
                }, {
                    name: "dc_id",
                    type: "int"
                }, {
                    name: "key_fingerprint",
                    type: "int"
                }],
                type: "EncryptedFile"
            }, {
                id: 406307684,
                predicate: "inputEncryptedFileEmpty",
                params: [],
                type: "InputEncryptedFile"
            }, {
                id: 1690108678,
                predicate: "inputEncryptedFileUploaded",
                params: [{
                    name: "id",
                    type: "long"
                }, {
                    name: "parts",
                    type: "int"
                }, {
                    name: "md5_checksum",
                    type: "string"
                }, {
                    name: "key_fingerprint",
                    type: "int"
                }],
                type: "InputEncryptedFile"
            }, {
                id: 1511503333,
                predicate: "inputEncryptedFile",
                params: [{
                    name: "id",
                    type: "long"
                }, {
                    name: "access_hash",
                    type: "long"
                }],
                type: "InputEncryptedFile"
            }, {
                id: 767652808,
                predicate: "inputEncryptedFileBigUploaded",
                params: [{
                    name: "id",
                    type: "long"
                }, {
                    name: "parts",
                    type: "int"
                }, {
                    name: "key_fingerprint",
                    type: "int"
                }],
                type: "InputEncryptedFile"
            }, {
                id: -317144808,
                predicate: "encryptedMessage",
                params: [{
                    name: "random_id",
                    type: "long"
                }, {
                    name: "chat_id",
                    type: "int"
                }, {
                    name: "date",
                    type: "int"
                }, {
                    name: "bytes",
                    type: "bytes"
                }, {
                    name: "file",
                    type: "EncryptedFile"
                }],
                type: "EncryptedMessage"
            }, {
                id: 594758406,
                predicate: "encryptedMessageService",
                params: [{
                    name: "random_id",
                    type: "long"
                }, {
                    name: "chat_id",
                    type: "int"
                }, {
                    name: "date",
                    type: "int"
                }, {
                    name: "bytes",
                    type: "bytes"
                }],
                type: "EncryptedMessage"
            }, {
                id: -1058912715,
                predicate: "messages.dhConfigNotModified",
                params: [{
                    name: "random",
                    type: "bytes"
                }],
                type: "messages.DhConfig"
            }, {
                id: 740433629,
                predicate: "messages.dhConfig",
                params: [{
                    name: "g",
                    type: "int"
                }, {
                    name: "p",
                    type: "bytes"
                }, {
                    name: "version",
                    type: "int"
                }, {
                    name: "random",
                    type: "bytes"
                }],
                type: "messages.DhConfig"
            }, {
                id: 1443858741,
                predicate: "messages.sentEncryptedMessage",
                params: [{
                    name: "date",
                    type: "int"
                }],
                type: "messages.SentEncryptedMessage"
            }, {
                id: -1802240206,
                predicate: "messages.sentEncryptedFile",
                params: [{
                    name: "date",
                    type: "int"
                }, {
                    name: "file",
                    type: "EncryptedFile"
                }],
                type: "messages.SentEncryptedMessage"
            }, {
                id: 1928391342,
                predicate: "inputDocumentEmpty",
                params: [],
                type: "InputDocument"
            }, {
                id: 448771445,
                predicate: "inputDocument",
                params: [{
                    name: "id",
                    type: "long"
                }, {
                    name: "access_hash",
                    type: "long"
                }, {
                    name: "file_reference",
                    type: "bytes"
                }],
                type: "InputDocument"
            }, {
                id: 922273905,
                predicate: "documentEmpty",
                params: [{
                    name: "id",
                    type: "long"
                }],
                type: "Document"
            }, {
                id: 512177195,
                predicate: "document",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "id",
                    type: "long"
                }, {
                    name: "access_hash",
                    type: "long"
                }, {
                    name: "file_reference",
                    type: "bytes"
                }, {
                    name: "date",
                    type: "int"
                }, {
                    name: "mime_type",
                    type: "string"
                }, {
                    name: "size",
                    type: "int"
                }, {
                    name: "thumbs",
                    type: "flags.0?Vector<PhotoSize>"
                }, {
                    name: "video_thumbs",
                    type: "flags.1?Vector<VideoSize>"
                }, {
                    name: "dc_id",
                    type: "int"
                }, {
                    name: "attributes",
                    type: "Vector<DocumentAttribute>"
                }],
                type: "Document"
            }, {
                id: 398898678,
                predicate: "help.support",
                params: [{
                    name: "phone_number",
                    type: "string"
                }, {
                    name: "user",
                    type: "User"
                }],
                type: "help.Support"
            }, {
                id: -1613493288,
                predicate: "notifyPeer",
                params: [{
                    name: "peer",
                    type: "Peer"
                }],
                type: "NotifyPeer"
            }, {
                id: -1261946036,
                predicate: "notifyUsers",
                params: [],
                type: "NotifyPeer"
            }, {
                id: -1073230141,
                predicate: "notifyChats",
                params: [],
                type: "NotifyPeer"
            }, {
                id: -703403793,
                predicate: "notifyBroadcasts",
                params: [],
                type: "NotifyPeer"
            }, {
                id: 381645902,
                predicate: "sendMessageTypingAction",
                params: [],
                type: "SendMessageAction"
            }, {
                id: -44119819,
                predicate: "sendMessageCancelAction",
                params: [],
                type: "SendMessageAction"
            }, {
                id: -1584933265,
                predicate: "sendMessageRecordVideoAction",
                params: [],
                type: "SendMessageAction"
            }, {
                id: -378127636,
                predicate: "sendMessageUploadVideoAction",
                params: [{
                    name: "progress",
                    type: "int"
                }],
                type: "SendMessageAction"
            }, {
                id: -718310409,
                predicate: "sendMessageRecordAudioAction",
                params: [],
                type: "SendMessageAction"
            }, {
                id: -212740181,
                predicate: "sendMessageUploadAudioAction",
                params: [{
                    name: "progress",
                    type: "int"
                }],
                type: "SendMessageAction"
            }, {
                id: -774682074,
                predicate: "sendMessageUploadPhotoAction",
                params: [{
                    name: "progress",
                    type: "int"
                }],
                type: "SendMessageAction"
            }, {
                id: -1441998364,
                predicate: "sendMessageUploadDocumentAction",
                params: [{
                    name: "progress",
                    type: "int"
                }],
                type: "SendMessageAction"
            }, {
                id: 393186209,
                predicate: "sendMessageGeoLocationAction",
                params: [],
                type: "SendMessageAction"
            }, {
                id: 1653390447,
                predicate: "sendMessageChooseContactAction",
                params: [],
                type: "SendMessageAction"
            }, {
                id: -580219064,
                predicate: "sendMessageGamePlayAction",
                params: [],
                type: "SendMessageAction"
            }, {
                id: -1997373508,
                predicate: "sendMessageRecordRoundAction",
                params: [],
                type: "SendMessageAction"
            }, {
                id: 608050278,
                predicate: "sendMessageUploadRoundAction",
                params: [{
                    name: "progress",
                    type: "int"
                }],
                type: "SendMessageAction"
            }, {
                id: -651419003,
                predicate: "speakingInGroupCallAction",
                params: [],
                type: "SendMessageAction"
            }, {
                id: -606432698,
                predicate: "sendMessageHistoryImportAction",
                params: [{
                    name: "progress",
                    type: "int"
                }],
                type: "SendMessageAction"
            }, {
                id: -1336228175,
                predicate: "sendMessageChooseStickerAction",
                params: [],
                type: "SendMessageAction"
            }, {
                id: 1781674934,
                predicate: "sendMessageEmojiInteraction",
                params: [{
                    name: "emoticon",
                    type: "string"
                }, {
                    name: "interaction",
                    type: "DataJSON"
                }],
                type: "SendMessageAction"
            }, {
                id: -1234857938,
                predicate: "sendMessageEmojiInteractionSeen",
                params: [{
                    name: "emoticon",
                    type: "string"
                }],
                type: "SendMessageAction"
            }, {
                id: -1290580579,
                predicate: "contacts.found",
                params: [{
                    name: "my_results",
                    type: "Vector<Peer>"
                }, {
                    name: "results",
                    type: "Vector<Peer>"
                }, {
                    name: "chats",
                    type: "Vector<Chat>"
                }, {
                    name: "users",
                    type: "Vector<User>"
                }],
                type: "contacts.Found"
            }, {
                id: 1335282456,
                predicate: "inputPrivacyKeyStatusTimestamp",
                params: [],
                type: "InputPrivacyKey"
            }, {
                id: -1107622874,
                predicate: "inputPrivacyKeyChatInvite",
                params: [],
                type: "InputPrivacyKey"
            }, {
                id: -88417185,
                predicate: "inputPrivacyKeyPhoneCall",
                params: [],
                type: "InputPrivacyKey"
            }, {
                id: -610373422,
                predicate: "inputPrivacyKeyPhoneP2P",
                params: [],
                type: "InputPrivacyKey"
            }, {
                id: -1529000952,
                predicate: "inputPrivacyKeyForwards",
                params: [],
                type: "InputPrivacyKey"
            }, {
                id: 1461304012,
                predicate: "inputPrivacyKeyProfilePhoto",
                params: [],
                type: "InputPrivacyKey"
            }, {
                id: 55761658,
                predicate: "inputPrivacyKeyPhoneNumber",
                params: [],
                type: "InputPrivacyKey"
            }, {
                id: -786326563,
                predicate: "inputPrivacyKeyAddedByPhone",
                params: [],
                type: "InputPrivacyKey"
            }, {
                id: -1137792208,
                predicate: "privacyKeyStatusTimestamp",
                params: [],
                type: "PrivacyKey"
            }, {
                id: 1343122938,
                predicate: "privacyKeyChatInvite",
                params: [],
                type: "PrivacyKey"
            }, {
                id: 1030105979,
                predicate: "privacyKeyPhoneCall",
                params: [],
                type: "PrivacyKey"
            }, {
                id: 961092808,
                predicate: "privacyKeyPhoneP2P",
                params: [],
                type: "PrivacyKey"
            }, {
                id: 1777096355,
                predicate: "privacyKeyForwards",
                params: [],
                type: "PrivacyKey"
            }, {
                id: -1777000467,
                predicate: "privacyKeyProfilePhoto",
                params: [],
                type: "PrivacyKey"
            }, {
                id: -778378131,
                predicate: "privacyKeyPhoneNumber",
                params: [],
                type: "PrivacyKey"
            }, {
                id: 1124062251,
                predicate: "privacyKeyAddedByPhone",
                params: [],
                type: "PrivacyKey"
            }, {
                id: 218751099,
                predicate: "inputPrivacyValueAllowContacts",
                params: [],
                type: "InputPrivacyRule"
            }, {
                id: 407582158,
                predicate: "inputPrivacyValueAllowAll",
                params: [],
                type: "InputPrivacyRule"
            }, {
                id: 320652927,
                predicate: "inputPrivacyValueAllowUsers",
                params: [{
                    name: "users",
                    type: "Vector<InputUser>"
                }],
                type: "InputPrivacyRule"
            }, {
                id: 195371015,
                predicate: "inputPrivacyValueDisallowContacts",
                params: [],
                type: "InputPrivacyRule"
            }, {
                id: -697604407,
                predicate: "inputPrivacyValueDisallowAll",
                params: [],
                type: "InputPrivacyRule"
            }, {
                id: -1877932953,
                predicate: "inputPrivacyValueDisallowUsers",
                params: [{
                    name: "users",
                    type: "Vector<InputUser>"
                }],
                type: "InputPrivacyRule"
            }, {
                id: -2079962673,
                predicate: "inputPrivacyValueAllowChatParticipants",
                params: [{
                    name: "chats",
                    type: "Vector<long>"
                }],
                type: "InputPrivacyRule"
            }, {
                id: -380694650,
                predicate: "inputPrivacyValueDisallowChatParticipants",
                params: [{
                    name: "chats",
                    type: "Vector<long>"
                }],
                type: "InputPrivacyRule"
            }, {
                id: -123988,
                predicate: "privacyValueAllowContacts",
                params: [],
                type: "PrivacyRule"
            }, {
                id: 1698855810,
                predicate: "privacyValueAllowAll",
                params: [],
                type: "PrivacyRule"
            }, {
                id: -1198497870,
                predicate: "privacyValueAllowUsers",
                params: [{
                    name: "users",
                    type: "Vector<long>"
                }],
                type: "PrivacyRule"
            }, {
                id: -125240806,
                predicate: "privacyValueDisallowContacts",
                params: [],
                type: "PrivacyRule"
            }, {
                id: -1955338397,
                predicate: "privacyValueDisallowAll",
                params: [],
                type: "PrivacyRule"
            }, {
                id: -463335103,
                predicate: "privacyValueDisallowUsers",
                params: [{
                    name: "users",
                    type: "Vector<long>"
                }],
                type: "PrivacyRule"
            }, {
                id: 1796427406,
                predicate: "privacyValueAllowChatParticipants",
                params: [{
                    name: "chats",
                    type: "Vector<long>"
                }],
                type: "PrivacyRule"
            }, {
                id: 1103656293,
                predicate: "privacyValueDisallowChatParticipants",
                params: [{
                    name: "chats",
                    type: "Vector<long>"
                }],
                type: "PrivacyRule"
            }, {
                id: 1352683077,
                predicate: "account.privacyRules",
                params: [{
                    name: "rules",
                    type: "Vector<PrivacyRule>"
                }, {
                    name: "chats",
                    type: "Vector<Chat>"
                }, {
                    name: "users",
                    type: "Vector<User>"
                }],
                type: "account.PrivacyRules"
            }, {
                id: -1194283041,
                predicate: "accountDaysTTL",
                params: [{
                    name: "days",
                    type: "int"
                }],
                type: "AccountDaysTTL"
            }, {
                id: 1815593308,
                predicate: "documentAttributeImageSize",
                params: [{
                    name: "w",
                    type: "int"
                }, {
                    name: "h",
                    type: "int"
                }],
                type: "DocumentAttribute"
            }, {
                id: 297109817,
                predicate: "documentAttributeAnimated",
                params: [],
                type: "DocumentAttribute"
            }, {
                id: 1662637586,
                predicate: "documentAttributeSticker",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "mask",
                    type: "flags.1?true"
                }, {
                    name: "alt",
                    type: "string"
                }, {
                    name: "stickerset",
                    type: "InputStickerSet"
                }, {
                    name: "mask_coords",
                    type: "flags.0?MaskCoords"
                }],
                type: "DocumentAttribute"
            }, {
                id: 250621158,
                predicate: "documentAttributeVideo",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "round_message",
                    type: "flags.0?true"
                }, {
                    name: "supports_streaming",
                    type: "flags.1?true"
                }, {
                    name: "duration",
                    type: "int"
                }, {
                    name: "w",
                    type: "int"
                }, {
                    name: "h",
                    type: "int"
                }],
                type: "DocumentAttribute"
            }, {
                id: -1739392570,
                predicate: "documentAttributeAudio",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "voice",
                    type: "flags.10?true"
                }, {
                    name: "duration",
                    type: "int"
                }, {
                    name: "title",
                    type: "flags.0?string"
                }, {
                    name: "performer",
                    type: "flags.1?string"
                }, {
                    name: "waveform",
                    type: "flags.2?bytes"
                }],
                type: "DocumentAttribute"
            }, {
                id: 358154344,
                predicate: "documentAttributeFilename",
                params: [{
                    name: "file_name",
                    type: "string"
                }],
                type: "DocumentAttribute"
            }, {
                id: -1744710921,
                predicate: "documentAttributeHasStickers",
                params: [],
                type: "DocumentAttribute"
            }, {
                id: -244016606,
                predicate: "messages.stickersNotModified",
                params: [],
                type: "messages.Stickers"
            }, {
                id: 816245886,
                predicate: "messages.stickers",
                params: [{
                    name: "hash",
                    type: "long"
                }, {
                    name: "stickers",
                    type: "Vector<Document>"
                }],
                type: "messages.Stickers"
            }, {
                id: 313694676,
                predicate: "stickerPack",
                params: [{
                    name: "emoticon",
                    type: "string"
                }, {
                    name: "documents",
                    type: "Vector<long>"
                }],
                type: "StickerPack"
            }, {
                id: -395967805,
                predicate: "messages.allStickersNotModified",
                params: [],
                type: "messages.AllStickers"
            }, {
                id: -843329861,
                predicate: "messages.allStickers",
                params: [{
                    name: "hash",
                    type: "long"
                }, {
                    name: "sets",
                    type: "Vector<StickerSet>"
                }],
                type: "messages.AllStickers"
            }, {
                id: -2066640507,
                predicate: "messages.affectedMessages",
                params: [{
                    name: "pts",
                    type: "int"
                }, {
                    name: "pts_count",
                    type: "int"
                }],
                type: "messages.AffectedMessages"
            }, {
                id: -350980120,
                predicate: "webPageEmpty",
                params: [{
                    name: "id",
                    type: "long"
                }],
                type: "WebPage"
            }, {
                id: -981018084,
                predicate: "webPagePending",
                params: [{
                    name: "id",
                    type: "long"
                }, {
                    name: "date",
                    type: "int"
                }],
                type: "WebPage"
            }, {
                id: -392411726,
                predicate: "webPage",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "id",
                    type: "long"
                }, {
                    name: "url",
                    type: "string"
                }, {
                    name: "display_url",
                    type: "string"
                }, {
                    name: "hash",
                    type: "int"
                }, {
                    name: "type",
                    type: "flags.0?string"
                }, {
                    name: "site_name",
                    type: "flags.1?string"
                }, {
                    name: "title",
                    type: "flags.2?string"
                }, {
                    name: "description",
                    type: "flags.3?string"
                }, {
                    name: "photo",
                    type: "flags.4?Photo"
                }, {
                    name: "embed_url",
                    type: "flags.5?string"
                }, {
                    name: "embed_type",
                    type: "flags.5?string"
                }, {
                    name: "embed_width",
                    type: "flags.6?int"
                }, {
                    name: "embed_height",
                    type: "flags.6?int"
                }, {
                    name: "duration",
                    type: "flags.7?int"
                }, {
                    name: "author",
                    type: "flags.8?string"
                }, {
                    name: "document",
                    type: "flags.9?Document"
                }, {
                    name: "cached_page",
                    type: "flags.10?Page"
                }, {
                    name: "attributes",
                    type: "flags.12?Vector<WebPageAttribute>"
                }],
                type: "WebPage"
            }, {
                id: 1930545681,
                predicate: "webPageNotModified",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "cached_page_views",
                    type: "flags.0?int"
                }],
                type: "WebPage"
            }, {
                id: -1392388579,
                predicate: "authorization",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "current",
                    type: "flags.0?true"
                }, {
                    name: "official_app",
                    type: "flags.1?true"
                }, {
                    name: "password_pending",
                    type: "flags.2?true"
                }, {
                    name: "hash",
                    type: "long"
                }, {
                    name: "device_model",
                    type: "string"
                }, {
                    name: "platform",
                    type: "string"
                }, {
                    name: "system_version",
                    type: "string"
                }, {
                    name: "api_id",
                    type: "int"
                }, {
                    name: "app_name",
                    type: "string"
                }, {
                    name: "app_version",
                    type: "string"
                }, {
                    name: "date_created",
                    type: "int"
                }, {
                    name: "date_active",
                    type: "int"
                }, {
                    name: "ip",
                    type: "string"
                }, {
                    name: "country",
                    type: "string"
                }, {
                    name: "region",
                    type: "string"
                }],
                type: "Authorization"
            }, {
                id: 307276766,
                predicate: "account.authorizations",
                params: [{
                    name: "authorizations",
                    type: "Vector<Authorization>"
                }],
                type: "account.Authorizations"
            }, {
                id: 408623183,
                predicate: "account.password",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "has_recovery",
                    type: "flags.0?true"
                }, {
                    name: "has_secure_values",
                    type: "flags.1?true"
                }, {
                    name: "has_password",
                    type: "flags.2?true"
                }, {
                    name: "current_algo",
                    type: "flags.2?PasswordKdfAlgo"
                }, {
                    name: "srp_B",
                    type: "flags.2?bytes"
                }, {
                    name: "srp_id",
                    type: "flags.2?long"
                }, {
                    name: "hint",
                    type: "flags.3?string"
                }, {
                    name: "email_unconfirmed_pattern",
                    type: "flags.4?string"
                }, {
                    name: "new_algo",
                    type: "PasswordKdfAlgo"
                }, {
                    name: "new_secure_algo",
                    type: "SecurePasswordKdfAlgo"
                }, {
                    name: "secure_random",
                    type: "bytes"
                }, {
                    name: "pending_reset_date",
                    type: "flags.5?int"
                }],
                type: "account.Password"
            }, {
                id: -902187961,
                predicate: "account.password2",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "has_recovery",
                    type: "flags.0?true"
                }, {
                    name: "has_secure_values",
                    type: "flags.1?true"
                }, {
                    name: "current_salt",
                    type: "bytes"
                }, {
                    name: "new_salt",
                    type: "bytes"
                }, {
                    name: "new_secure_salt",
                    type: "bytes"
                }, {
                    name: "secure_random",
                    type: "bytes"
                }, {
                    name: "hint",
                    type: "string"
                }, {
                    name: "email_unconfirmed_pattern",
                    type: "string"
                }],
                type: "account.Password2"
            }, {
                id: -1705233435,
                predicate: "account.passwordSettings",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "email",
                    type: "flags.0?string"
                }, {
                    name: "secure_settings",
                    type: "flags.1?SecureSecretSettings"
                }],
                type: "account.PasswordSettings"
            }, {
                id: 2077869041,
                predicate: "account.passwordSettings68",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "email",
                    type: "flags.0?string"
                }, {
                    name: "secure_salt",
                    type: "flags.1?string"
                }, {
                    name: "secure_secret",
                    type: "flags.2?string"
                }, {
                    name: "secure_secret_id",
                    type: "flags.3?string"
                }],
                type: "account.PasswordSettings"
            }, {
                id: -1036572727,
                predicate: "account.passwordInputSettings",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "new_algo",
                    type: "flags.0?PasswordKdfAlgo"
                }, {
                    name: "new_password_hash",
                    type: "flags.0?bytes"
                }, {
                    name: "hint",
                    type: "flags.0?string"
                }, {
                    name: "email",
                    type: "flags.1?string"
                }, {
                    name: "new_secure_settings",
                    type: "flags.2?SecureSecretSettings"
                }],
                type: "account.PasswordInputSettings"
            }, {
                id: 570402317,
                predicate: "account.passwordInputSettingsLayer68",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "new_salt",
                    type: "flags.0?bytes"
                }, {
                    name: "new_password_hash",
                    type: "flags.0?bytes"
                }, {
                    name: "hint",
                    type: "flags.0?string"
                }, {
                    name: "email",
                    type: "flags.1?string"
                }, {
                    name: "new_secure_salt",
                    type: "flags.2?bytes"
                }, {
                    name: "new_secure_secret",
                    type: "flags.2?bytes"
                }, {
                    name: "new_secure_secret_id",
                    type: "flags.2?long"
                }],
                type: "account.PasswordInputSettings"
            }, {
                id: 326715557,
                predicate: "auth.passwordRecovery",
                params: [{
                    name: "email_pattern",
                    type: "string"
                }],
                type: "auth.PasswordRecovery"
            }, {
                id: -1551583367,
                predicate: "receivedNotifyMessage",
                params: [{
                    name: "id",
                    type: "int"
                }, {
                    name: "flags",
                    type: "int"
                }],
                type: "ReceivedNotifyMessage"
            }, {
                id: -1316944408,
                predicate: "chatInviteExported",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "revoked",
                    type: "flags.0?true"
                }, {
                    name: "permanent",
                    type: "flags.5?true"
                }, {
                    name: "link",
                    type: "string"
                }, {
                    name: "admin_id",
                    type: "long"
                }, {
                    name: "date",
                    type: "int"
                }, {
                    name: "start_date",
                    type: "flags.4?int"
                }, {
                    name: "expire_date",
                    type: "flags.1?int"
                }, {
                    name: "usage_limit",
                    type: "flags.2?int"
                }, {
                    name: "usage",
                    type: "flags.3?int"
                }],
                type: "ExportedChatInvite"
            }, {
                id: -64092740,
                predicate: "chatInviteExportedLayer122",
                params: [{
                    name: "link",
                    type: "string"
                }],
                type: "ExportedChatInvite"
            }, {
                id: 1776236393,
                predicate: "chatInviteEmptyLayer122",
                params: [],
                type: "ExportedChatInvite"
            }, {
                id: 1516793212,
                predicate: "chatInviteAlready",
                params: [{
                    name: "chat",
                    type: "Chat"
                }],
                type: "ChatInvite"
            }, {
                id: -540871282,
                predicate: "chatInvite",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "channel",
                    type: "flags.0?true"
                }, {
                    name: "broadcast",
                    type: "flags.1?true"
                }, {
                    name: "public",
                    type: "flags.2?true"
                }, {
                    name: "megagroup",
                    type: "flags.3?true"
                }, {
                    name: "title",
                    type: "string"
                }, {
                    name: "photo",
                    type: "Photo"
                }, {
                    name: "participants_count",
                    type: "int"
                }, {
                    name: "participants",
                    type: "flags.4?Vector<User>"
                }],
                type: "ChatInvite"
            }, {
                id: -613092008,
                predicate: "chatInviteLayer84",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "channel",
                    type: "flags.0?true"
                }, {
                    name: "broadcast",
                    type: "flags.1?true"
                }, {
                    name: "public",
                    type: "flags.2?true"
                }, {
                    name: "megagroup",
                    type: "flags.3?true"
                }, {
                    name: "title",
                    type: "string"
                }, {
                    name: "photo",
                    type: "ChatPhoto"
                }, {
                    name: "participants_count",
                    type: "int"
                }, {
                    name: "participants",
                    type: "flags.4?Vector<User>"
                }],
                type: "ChatInvite"
            }, {
                id: 1634294960,
                predicate: "chatInvitePeek",
                params: [{
                    name: "chat",
                    type: "Chat"
                }, {
                    name: "expires",
                    type: "int"
                }],
                type: "ChatInvite"
            }, {
                id: -4838507,
                predicate: "inputStickerSetEmpty",
                params: [],
                type: "InputStickerSet"
            }, {
                id: -1645763991,
                predicate: "inputStickerSetID",
                params: [{
                    name: "id",
                    type: "long"
                }, {
                    name: "access_hash",
                    type: "long"
                }],
                type: "InputStickerSet"
            }, {
                id: -2044933984,
                predicate: "inputStickerSetShortName",
                params: [{
                    name: "short_name",
                    type: "string"
                }],
                type: "InputStickerSet"
            }, {
                id: 42402760,
                predicate: "inputStickerSetAnimatedEmoji",
                params: [],
                type: "InputStickerSet"
            }, {
                id: -427863538,
                predicate: "inputStickerSetDice",
                params: [{
                    name: "emoticon",
                    type: "string"
                }],
                type: "InputStickerSet"
            }, {
                id: -673242758,
                predicate: "stickerSet",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "archived",
                    type: "flags.1?true"
                }, {
                    name: "official",
                    type: "flags.2?true"
                }, {
                    name: "masks",
                    type: "flags.3?true"
                }, {
                    name: "animated",
                    type: "flags.5?true"
                }, {
                    name: "installed_date",
                    type: "flags.0?int"
                }, {
                    name: "id",
                    type: "long"
                }, {
                    name: "access_hash",
                    type: "long"
                }, {
                    name: "title",
                    type: "string"
                }, {
                    name: "short_name",
                    type: "string"
                }, {
                    name: "thumbs",
                    type: "flags.4?Vector<PhotoSize>"
                }, {
                    name: "thumb_dc_id",
                    type: "flags.4?int"
                }, {
                    name: "thumb_version",
                    type: "flags.4?int"
                }, {
                    name: "count",
                    type: "int"
                }, {
                    name: "hash",
                    type: "int"
                }],
                type: "StickerSet"
            }, {
                id: -1240849242,
                predicate: "messages.stickerSet",
                params: [{
                    name: "set",
                    type: "StickerSet"
                }, {
                    name: "packs",
                    type: "Vector<StickerPack>"
                }, {
                    name: "documents",
                    type: "Vector<Document>"
                }],
                type: "messages.StickerSet"
            }, {
                id: -1032140601,
                predicate: "botCommand",
                params: [{
                    name: "command",
                    type: "string"
                }, {
                    name: "description",
                    type: "string"
                }],
                type: "BotCommand"
            }, {
                id: 460632885,
                predicate: "botInfo",
                params: [{
                    name: "user_id",
                    type: "long"
                }, {
                    name: "description",
                    type: "string"
                }, {
                    name: "commands",
                    type: "Vector<BotCommand>"
                }],
                type: "BotInfo"
            }, {
                id: -1560655744,
                predicate: "keyboardButton",
                params: [{
                    name: "text",
                    type: "string"
                }],
                type: "KeyboardButton"
            }, {
                id: 629866245,
                predicate: "keyboardButtonUrl",
                params: [{
                    name: "text",
                    type: "string"
                }, {
                    name: "url",
                    type: "string"
                }],
                type: "KeyboardButton"
            }, {
                id: 901503851,
                predicate: "keyboardButtonCallback",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "requires_password",
                    type: "flags.0?true"
                }, {
                    name: "text",
                    type: "string"
                }, {
                    name: "data",
                    type: "bytes"
                }],
                type: "KeyboardButton"
            }, {
                id: -1318425559,
                predicate: "keyboardButtonRequestPhone",
                params: [{
                    name: "text",
                    type: "string"
                }],
                type: "KeyboardButton"
            }, {
                id: -59151553,
                predicate: "keyboardButtonRequestGeoLocation",
                params: [{
                    name: "text",
                    type: "string"
                }],
                type: "KeyboardButton"
            }, {
                id: 90744648,
                predicate: "keyboardButtonSwitchInline",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "same_peer",
                    type: "flags.0?true"
                }, {
                    name: "text",
                    type: "string"
                }, {
                    name: "query",
                    type: "string"
                }],
                type: "KeyboardButton"
            }, {
                id: 1358175439,
                predicate: "keyboardButtonGame",
                params: [{
                    name: "text",
                    type: "string"
                }],
                type: "KeyboardButton"
            }, {
                id: -1344716869,
                predicate: "keyboardButtonBuy",
                params: [{
                    name: "text",
                    type: "string"
                }],
                type: "KeyboardButton"
            }, {
                id: 280464681,
                predicate: "keyboardButtonUrlAuth",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "text",
                    type: "string"
                }, {
                    name: "fwd_text",
                    type: "flags.0?string"
                }, {
                    name: "url",
                    type: "string"
                }, {
                    name: "button_id",
                    type: "int"
                }],
                type: "KeyboardButton"
            }, {
                id: -802258988,
                predicate: "inputKeyboardButtonUrlAuth",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "request_write_access",
                    type: "flags.0?true"
                }, {
                    name: "text",
                    type: "string"
                }, {
                    name: "fwd_text",
                    type: "flags.1?string"
                }, {
                    name: "url",
                    type: "string"
                }, {
                    name: "bot",
                    type: "InputUser"
                }],
                type: "KeyboardButton"
            }, {
                id: -1144565411,
                predicate: "keyboardButtonRequestPoll",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "quiz",
                    type: "flags.0?Bool"
                }, {
                    name: "text",
                    type: "string"
                }],
                type: "KeyboardButton"
            }, {
                id: 2002815875,
                predicate: "keyboardButtonRow",
                params: [{
                    name: "buttons",
                    type: "Vector<KeyboardButton>"
                }],
                type: "KeyboardButtonRow"
            }, {
                id: -1606526075,
                predicate: "replyKeyboardHide",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "selective",
                    type: "flags.2?true"
                }],
                type: "ReplyMarkup"
            }, {
                id: -2035021048,
                predicate: "replyKeyboardForceReply",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "single_use",
                    type: "flags.1?true"
                }, {
                    name: "selective",
                    type: "flags.2?true"
                }, {
                    name: "placeholder",
                    type: "flags.3?string"
                }],
                type: "ReplyMarkup"
            }, {
                id: -2049074735,
                predicate: "replyKeyboardMarkup",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "resize",
                    type: "flags.0?true"
                }, {
                    name: "single_use",
                    type: "flags.1?true"
                }, {
                    name: "selective",
                    type: "flags.2?true"
                }, {
                    name: "rows",
                    type: "Vector<KeyboardButtonRow>"
                }, {
                    name: "placeholder",
                    type: "flags.3?string"
                }],
                type: "ReplyMarkup"
            }, {
                id: 1218642516,
                predicate: "replyInlineMarkup",
                params: [{
                    name: "rows",
                    type: "Vector<KeyboardButtonRow>"
                }],
                type: "ReplyMarkup"
            }, {
                id: -1148011883,
                predicate: "messageEntityUnknown",
                params: [{
                    name: "offset",
                    type: "int"
                }, {
                    name: "length",
                    type: "int"
                }],
                type: "MessageEntity"
            }, {
                id: -100378723,
                predicate: "messageEntityMention",
                params: [{
                    name: "offset",
                    type: "int"
                }, {
                    name: "length",
                    type: "int"
                }],
                type: "MessageEntity"
            }, {
                id: 1868782349,
                predicate: "messageEntityHashtag",
                params: [{
                    name: "offset",
                    type: "int"
                }, {
                    name: "length",
                    type: "int"
                }],
                type: "MessageEntity"
            }, {
                id: 1827637959,
                predicate: "messageEntityBotCommand",
                params: [{
                    name: "offset",
                    type: "int"
                }, {
                    name: "length",
                    type: "int"
                }],
                type: "MessageEntity"
            }, {
                id: 1859134776,
                predicate: "messageEntityUrl",
                params: [{
                    name: "offset",
                    type: "int"
                }, {
                    name: "length",
                    type: "int"
                }],
                type: "MessageEntity"
            }, {
                id: 1692693954,
                predicate: "messageEntityEmail",
                params: [{
                    name: "offset",
                    type: "int"
                }, {
                    name: "length",
                    type: "int"
                }],
                type: "MessageEntity"
            }, {
                id: -1117713463,
                predicate: "messageEntityBold",
                params: [{
                    name: "offset",
                    type: "int"
                }, {
                    name: "length",
                    type: "int"
                }],
                type: "MessageEntity"
            }, {
                id: -2106619040,
                predicate: "messageEntityItalic",
                params: [{
                    name: "offset",
                    type: "int"
                }, {
                    name: "length",
                    type: "int"
                }],
                type: "MessageEntity"
            }, {
                id: 681706865,
                predicate: "messageEntityCode",
                params: [{
                    name: "offset",
                    type: "int"
                }, {
                    name: "length",
                    type: "int"
                }],
                type: "MessageEntity"
            }, {
                id: 1938967520,
                predicate: "messageEntityPre",
                params: [{
                    name: "offset",
                    type: "int"
                }, {
                    name: "length",
                    type: "int"
                }, {
                    name: "language",
                    type: "string"
                }],
                type: "MessageEntity"
            }, {
                id: 1990644519,
                predicate: "messageEntityTextUrl",
                params: [{
                    name: "offset",
                    type: "int"
                }, {
                    name: "length",
                    type: "int"
                }, {
                    name: "url",
                    type: "string"
                }],
                type: "MessageEntity"
            }, {
                id: -595914432,
                predicate: "messageEntityMentionName",
                params: [{
                    name: "offset",
                    type: "int"
                }, {
                    name: "length",
                    type: "int"
                }, {
                    name: "user_id",
                    type: "long"
                }],
                type: "MessageEntity"
            }, {
                id: 546203849,
                predicate: "inputMessageEntityMentionName",
                params: [{
                    name: "offset",
                    type: "int"
                }, {
                    name: "length",
                    type: "int"
                }, {
                    name: "user_id",
                    type: "InputUser"
                }],
                type: "MessageEntity"
            }, {
                id: -1687559349,
                predicate: "messageEntityPhone",
                params: [{
                    name: "offset",
                    type: "int"
                }, {
                    name: "length",
                    type: "int"
                }],
                type: "MessageEntity"
            }, {
                id: 1280209983,
                predicate: "messageEntityCashtag",
                params: [{
                    name: "offset",
                    type: "int"
                }, {
                    name: "length",
                    type: "int"
                }],
                type: "MessageEntity"
            }, {
                id: -1672577397,
                predicate: "messageEntityUnderline",
                params: [{
                    name: "offset",
                    type: "int"
                }, {
                    name: "length",
                    type: "int"
                }],
                type: "MessageEntity"
            }, {
                id: -1090087980,
                predicate: "messageEntityStrike",
                params: [{
                    name: "offset",
                    type: "int"
                }, {
                    name: "length",
                    type: "int"
                }],
                type: "MessageEntity"
            }, {
                id: 34469328,
                predicate: "messageEntityBlockquote",
                params: [{
                    name: "offset",
                    type: "int"
                }, {
                    name: "length",
                    type: "int"
                }],
                type: "MessageEntity"
            }, {
                id: 1981704948,
                predicate: "messageEntityBankCard",
                params: [{
                    name: "offset",
                    type: "int"
                }, {
                    name: "length",
                    type: "int"
                }],
                type: "MessageEntity"
            }, {
                id: -292807034,
                predicate: "inputChannelEmpty",
                params: [],
                type: "InputChannel"
            }, {
                id: -212145112,
                predicate: "inputChannel",
                params: [{
                    name: "channel_id",
                    type: "long"
                }, {
                    name: "access_hash",
                    type: "long"
                }],
                type: "InputChannel"
            }, {
                id: 1536380829,
                predicate: "inputChannelFromMessage",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "msg_id",
                    type: "int"
                }, {
                    name: "channel_id",
                    type: "long"
                }],
                type: "InputChannel"
            }, {
                id: 2131196633,
                predicate: "contacts.resolvedPeer",
                params: [{
                    name: "peer",
                    type: "Peer"
                }, {
                    name: "chats",
                    type: "Vector<Chat>"
                }, {
                    name: "users",
                    type: "Vector<User>"
                }],
                type: "contacts.ResolvedPeer"
            }, {
                id: 182649427,
                predicate: "messageRange",
                params: [{
                    name: "min_id",
                    type: "int"
                }, {
                    name: "max_id",
                    type: "int"
                }],
                type: "MessageRange"
            }, {
                id: 1041346555,
                predicate: "updates.channelDifferenceEmpty",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "final",
                    type: "flags.0?true"
                }, {
                    name: "pts",
                    type: "int"
                }, {
                    name: "timeout",
                    type: "flags.1?int"
                }],
                type: "updates.ChannelDifference"
            }, {
                id: -1531132162,
                predicate: "updates.channelDifferenceTooLong",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "final",
                    type: "flags.0?true"
                }, {
                    name: "timeout",
                    type: "flags.1?int"
                }, {
                    name: "dialog",
                    type: "Dialog"
                }, {
                    name: "messages",
                    type: "Vector<Message>"
                }, {
                    name: "chats",
                    type: "Vector<Chat>"
                }, {
                    name: "users",
                    type: "Vector<User>"
                }],
                type: "updates.ChannelDifference"
            }, {
                id: 543450958,
                predicate: "updates.channelDifference",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "final",
                    type: "flags.0?true"
                }, {
                    name: "pts",
                    type: "int"
                }, {
                    name: "timeout",
                    type: "flags.1?int"
                }, {
                    name: "new_messages",
                    type: "Vector<Message>"
                }, {
                    name: "other_updates",
                    type: "Vector<Update>"
                }, {
                    name: "chats",
                    type: "Vector<Chat>"
                }, {
                    name: "users",
                    type: "Vector<User>"
                }],
                type: "updates.ChannelDifference"
            }, {
                id: -1798033689,
                predicate: "channelMessagesFilterEmpty",
                params: [],
                type: "ChannelMessagesFilter"
            }, {
                id: -847783593,
                predicate: "channelMessagesFilter",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "exclude_new_messages",
                    type: "flags.1?true"
                }, {
                    name: "ranges",
                    type: "Vector<MessageRange>"
                }],
                type: "ChannelMessagesFilter"
            }, {
                id: -1072953408,
                predicate: "channelParticipant",
                params: [{
                    name: "user_id",
                    type: "long"
                }, {
                    name: "date",
                    type: "int"
                }],
                type: "ChannelParticipant"
            }, {
                id: 682146919,
                predicate: "channelParticipantSelf",
                params: [{
                    name: "user_id",
                    type: "long"
                }, {
                    name: "inviter_id",
                    type: "long"
                }, {
                    name: "date",
                    type: "int"
                }],
                type: "ChannelParticipant"
            }, {
                id: 803602899,
                predicate: "channelParticipantCreator",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "user_id",
                    type: "long"
                }, {
                    name: "admin_rights",
                    type: "ChatAdminRights"
                }, {
                    name: "rank",
                    type: "flags.0?string"
                }],
                type: "ChannelParticipant"
            }, {
                id: 885242707,
                predicate: "channelParticipantAdmin",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "can_edit",
                    type: "flags.0?true"
                }, {
                    name: "self",
                    type: "flags.1?true"
                }, {
                    name: "user_id",
                    type: "long"
                }, {
                    name: "inviter_id",
                    type: "flags.1?long"
                }, {
                    name: "promoted_by",
                    type: "long"
                }, {
                    name: "date",
                    type: "int"
                }, {
                    name: "admin_rights",
                    type: "ChatAdminRights"
                }, {
                    name: "rank",
                    type: "flags.2?string"
                }],
                type: "ChannelParticipant"
            }, {
                id: 1844969806,
                predicate: "channelParticipantBanned",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "left",
                    type: "flags.0?true"
                }, {
                    name: "peer",
                    type: "Peer"
                }, {
                    name: "kicked_by",
                    type: "long"
                }, {
                    name: "date",
                    type: "int"
                }, {
                    name: "banned_rights",
                    type: "ChatBannedRights"
                }],
                type: "ChannelParticipant"
            }, {
                id: 453242886,
                predicate: "channelParticipantLeft",
                params: [{
                    name: "peer",
                    type: "Peer"
                }],
                type: "ChannelParticipant"
            }, {
                id: -566281095,
                predicate: "channelParticipantsRecent",
                params: [],
                type: "ChannelParticipantsFilter"
            }, {
                id: -1268741783,
                predicate: "channelParticipantsAdmins",
                params: [],
                type: "ChannelParticipantsFilter"
            }, {
                id: -1548400251,
                predicate: "channelParticipantsKicked",
                params: [{
                    name: "q",
                    type: "string"
                }],
                type: "ChannelParticipantsFilter"
            }, {
                id: -1328445861,
                predicate: "channelParticipantsBots",
                params: [],
                type: "ChannelParticipantsFilter"
            }, {
                id: 338142689,
                predicate: "channelParticipantsBanned",
                params: [{
                    name: "q",
                    type: "string"
                }],
                type: "ChannelParticipantsFilter"
            }, {
                id: 106343499,
                predicate: "channelParticipantsSearch",
                params: [{
                    name: "q",
                    type: "string"
                }],
                type: "ChannelParticipantsFilter"
            }, {
                id: -1150621555,
                predicate: "channelParticipantsContacts",
                params: [{
                    name: "q",
                    type: "string"
                }],
                type: "ChannelParticipantsFilter"
            }, {
                id: -531931925,
                predicate: "channelParticipantsMentions",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "q",
                    type: "flags.0?string"
                }, {
                    name: "top_msg_id",
                    type: "flags.1?int"
                }],
                type: "ChannelParticipantsFilter"
            }, {
                id: -1699676497,
                predicate: "channels.channelParticipants",
                params: [{
                    name: "count",
                    type: "int"
                }, {
                    name: "participants",
                    type: "Vector<ChannelParticipant>"
                }, {
                    name: "chats",
                    type: "Vector<Chat>"
                }, {
                    name: "users",
                    type: "Vector<User>"
                }],
                type: "channels.ChannelParticipants"
            }, {
                id: -266911767,
                predicate: "channels.channelParticipantsNotModified",
                params: [],
                type: "channels.ChannelParticipants"
            }, {
                id: -541588713,
                predicate: "channels.channelParticipant",
                params: [{
                    name: "participant",
                    type: "ChannelParticipant"
                }, {
                    name: "chats",
                    type: "Vector<Chat>"
                }, {
                    name: "users",
                    type: "Vector<User>"
                }],
                type: "channels.ChannelParticipant"
            }, {
                id: 2013922064,
                predicate: "help.termsOfService",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "popup",
                    type: "flags.0?true"
                }, {
                    name: "id",
                    type: "DataJSON"
                }, {
                    name: "text",
                    type: "string"
                }, {
                    name: "entities",
                    type: "Vector<MessageEntity>"
                }, {
                    name: "min_age_confirm",
                    type: "flags.1?int"
                }],
                type: "help.TermsOfService"
            }, {
                id: -402498398,
                predicate: "messages.savedGifsNotModified",
                params: [],
                type: "messages.SavedGifs"
            }, {
                id: -2069878259,
                predicate: "messages.savedGifs",
                params: [{
                    name: "hash",
                    type: "long"
                }, {
                    name: "gifs",
                    type: "Vector<Document>"
                }],
                type: "messages.SavedGifs"
            }, {
                id: 864077702,
                predicate: "inputBotInlineMessageMediaAuto",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "message",
                    type: "string"
                }, {
                    name: "entities",
                    type: "flags.1?Vector<MessageEntity>"
                }, {
                    name: "reply_markup",
                    type: "flags.2?ReplyMarkup"
                }],
                type: "InputBotInlineMessage"
            }, {
                id: 1036876423,
                predicate: "inputBotInlineMessageText",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "no_webpage",
                    type: "flags.0?true"
                }, {
                    name: "message",
                    type: "string"
                }, {
                    name: "entities",
                    type: "flags.1?Vector<MessageEntity>"
                }, {
                    name: "reply_markup",
                    type: "flags.2?ReplyMarkup"
                }],
                type: "InputBotInlineMessage"
            }, {
                id: -1768777083,
                predicate: "inputBotInlineMessageMediaGeo",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "geo_point",
                    type: "InputGeoPoint"
                }, {
                    name: "heading",
                    type: "flags.0?int"
                }, {
                    name: "period",
                    type: "flags.1?int"
                }, {
                    name: "proximity_notification_radius",
                    type: "flags.3?int"
                }, {
                    name: "reply_markup",
                    type: "flags.2?ReplyMarkup"
                }],
                type: "InputBotInlineMessage"
            }, {
                id: 1098628881,
                predicate: "inputBotInlineMessageMediaVenue",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "geo_point",
                    type: "InputGeoPoint"
                }, {
                    name: "title",
                    type: "string"
                }, {
                    name: "address",
                    type: "string"
                }, {
                    name: "provider",
                    type: "string"
                }, {
                    name: "venue_id",
                    type: "string"
                }, {
                    name: "venue_type",
                    type: "string"
                }, {
                    name: "reply_markup",
                    type: "flags.2?ReplyMarkup"
                }],
                type: "InputBotInlineMessage"
            }, {
                id: -1494368259,
                predicate: "inputBotInlineMessageMediaContact",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "phone_number",
                    type: "string"
                }, {
                    name: "first_name",
                    type: "string"
                }, {
                    name: "last_name",
                    type: "string"
                }, {
                    name: "vcard",
                    type: "string"
                }, {
                    name: "reply_markup",
                    type: "flags.2?ReplyMarkup"
                }],
                type: "InputBotInlineMessage"
            }, {
                id: 1262639204,
                predicate: "inputBotInlineMessageGame",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "reply_markup",
                    type: "flags.2?ReplyMarkup"
                }],
                type: "InputBotInlineMessage"
            }, {
                id: -672693723,
                predicate: "inputBotInlineMessageMediaInvoice",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "title",
                    type: "string"
                }, {
                    name: "description",
                    type: "string"
                }, {
                    name: "photo",
                    type: "flags.0?InputWebDocument"
                }, {
                    name: "invoice",
                    type: "Invoice"
                }, {
                    name: "payload",
                    type: "bytes"
                }, {
                    name: "provider",
                    type: "string"
                }, {
                    name: "provider_data",
                    type: "DataJSON"
                }, {
                    name: "reply_markup",
                    type: "flags.2?ReplyMarkup"
                }],
                type: "InputBotInlineMessage"
            }, {
                id: -2000710887,
                predicate: "inputBotInlineResult",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "id",
                    type: "string"
                }, {
                    name: "type",
                    type: "string"
                }, {
                    name: "title",
                    type: "flags.1?string"
                }, {
                    name: "description",
                    type: "flags.2?string"
                }, {
                    name: "url",
                    type: "flags.3?string"
                }, {
                    name: "thumb",
                    type: "flags.4?InputWebDocument"
                }, {
                    name: "content",
                    type: "flags.5?InputWebDocument"
                }, {
                    name: "send_message",
                    type: "InputBotInlineMessage"
                }],
                type: "InputBotInlineResult"
            }, {
                id: -1462213465,
                predicate: "inputBotInlineResultPhoto",
                params: [{
                    name: "id",
                    type: "string"
                }, {
                    name: "type",
                    type: "string"
                }, {
                    name: "photo",
                    type: "InputPhoto"
                }, {
                    name: "send_message",
                    type: "InputBotInlineMessage"
                }],
                type: "InputBotInlineResult"
            }, {
                id: -459324,
                predicate: "inputBotInlineResultDocument",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "id",
                    type: "string"
                }, {
                    name: "type",
                    type: "string"
                }, {
                    name: "title",
                    type: "flags.1?string"
                }, {
                    name: "description",
                    type: "flags.2?string"
                }, {
                    name: "document",
                    type: "InputDocument"
                }, {
                    name: "send_message",
                    type: "InputBotInlineMessage"
                }],
                type: "InputBotInlineResult"
            }, {
                id: 1336154098,
                predicate: "inputBotInlineResultGame",
                params: [{
                    name: "id",
                    type: "string"
                }, {
                    name: "short_name",
                    type: "string"
                }, {
                    name: "send_message",
                    type: "InputBotInlineMessage"
                }],
                type: "InputBotInlineResult"
            }, {
                id: 1984755728,
                predicate: "botInlineMessageMediaAuto",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "message",
                    type: "string"
                }, {
                    name: "entities",
                    type: "flags.1?Vector<MessageEntity>"
                }, {
                    name: "reply_markup",
                    type: "flags.2?ReplyMarkup"
                }],
                type: "BotInlineMessage"
            }, {
                id: -1937807902,
                predicate: "botInlineMessageText",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "no_webpage",
                    type: "flags.0?true"
                }, {
                    name: "message",
                    type: "string"
                }, {
                    name: "entities",
                    type: "flags.1?Vector<MessageEntity>"
                }, {
                    name: "reply_markup",
                    type: "flags.2?ReplyMarkup"
                }],
                type: "BotInlineMessage"
            }, {
                id: 85477117,
                predicate: "botInlineMessageMediaGeo",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "geo",
                    type: "GeoPoint"
                }, {
                    name: "heading",
                    type: "flags.0?int"
                }, {
                    name: "period",
                    type: "flags.1?int"
                }, {
                    name: "proximity_notification_radius",
                    type: "flags.3?int"
                }, {
                    name: "reply_markup",
                    type: "flags.2?ReplyMarkup"
                }],
                type: "BotInlineMessage"
            }, {
                id: -1970903652,
                predicate: "botInlineMessageMediaVenue",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "geo",
                    type: "GeoPoint"
                }, {
                    name: "title",
                    type: "string"
                }, {
                    name: "address",
                    type: "string"
                }, {
                    name: "provider",
                    type: "string"
                }, {
                    name: "venue_id",
                    type: "string"
                }, {
                    name: "venue_type",
                    type: "string"
                }, {
                    name: "reply_markup",
                    type: "flags.2?ReplyMarkup"
                }],
                type: "BotInlineMessage"
            }, {
                id: 416402882,
                predicate: "botInlineMessageMediaContact",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "phone_number",
                    type: "string"
                }, {
                    name: "first_name",
                    type: "string"
                }, {
                    name: "last_name",
                    type: "string"
                }, {
                    name: "vcard",
                    type: "string"
                }, {
                    name: "reply_markup",
                    type: "flags.2?ReplyMarkup"
                }],
                type: "BotInlineMessage"
            }, {
                id: 894081801,
                predicate: "botInlineMessageMediaInvoice",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "shipping_address_requested",
                    type: "flags.1?true"
                }, {
                    name: "test",
                    type: "flags.3?true"
                }, {
                    name: "title",
                    type: "string"
                }, {
                    name: "description",
                    type: "string"
                }, {
                    name: "photo",
                    type: "flags.0?WebDocument"
                }, {
                    name: "currency",
                    type: "string"
                }, {
                    name: "total_amount",
                    type: "long"
                }, {
                    name: "reply_markup",
                    type: "flags.2?ReplyMarkup"
                }],
                type: "BotInlineMessage"
            }, {
                id: 295067450,
                predicate: "botInlineResult",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "id",
                    type: "string"
                }, {
                    name: "type",
                    type: "string"
                }, {
                    name: "title",
                    type: "flags.1?string"
                }, {
                    name: "description",
                    type: "flags.2?string"
                }, {
                    name: "url",
                    type: "flags.3?string"
                }, {
                    name: "thumb",
                    type: "flags.4?WebDocument"
                }, {
                    name: "content",
                    type: "flags.5?WebDocument"
                }, {
                    name: "send_message",
                    type: "BotInlineMessage"
                }],
                type: "BotInlineResult"
            }, {
                id: 400266251,
                predicate: "botInlineMediaResult",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "id",
                    type: "string"
                }, {
                    name: "type",
                    type: "string"
                }, {
                    name: "photo",
                    type: "flags.0?Photo"
                }, {
                    name: "document",
                    type: "flags.1?Document"
                }, {
                    name: "title",
                    type: "flags.2?string"
                }, {
                    name: "description",
                    type: "flags.3?string"
                }, {
                    name: "send_message",
                    type: "BotInlineMessage"
                }],
                type: "BotInlineResult"
            }, {
                id: -1803769784,
                predicate: "messages.botResults",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "gallery",
                    type: "flags.0?true"
                }, {
                    name: "query_id",
                    type: "long"
                }, {
                    name: "next_offset",
                    type: "flags.1?string"
                }, {
                    name: "switch_pm",
                    type: "flags.2?InlineBotSwitchPM"
                }, {
                    name: "results",
                    type: "Vector<BotInlineResult>"
                }, {
                    name: "cache_time",
                    type: "int"
                }, {
                    name: "users",
                    type: "Vector<User>"
                }],
                type: "messages.BotResults"
            }, {
                id: 1571494644,
                predicate: "exportedMessageLink",
                params: [{
                    name: "link",
                    type: "string"
                }, {
                    name: "html",
                    type: "string"
                }],
                type: "ExportedMessageLink"
            }, {
                id: 1601666510,
                predicate: "messageFwdHeader",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "imported",
                    type: "flags.7?true"
                }, {
                    name: "from_id",
                    type: "flags.0?Peer"
                }, {
                    name: "from_name",
                    type: "flags.5?string"
                }, {
                    name: "date",
                    type: "int"
                }, {
                    name: "channel_post",
                    type: "flags.2?int"
                }, {
                    name: "post_author",
                    type: "flags.3?string"
                }, {
                    name: "saved_from_peer",
                    type: "flags.4?Peer"
                }, {
                    name: "saved_from_msg_id",
                    type: "flags.4?int"
                }, {
                    name: "psa_type",
                    type: "flags.6?string"
                }],
                type: "MessageFwdHeader"
            }, {
                id: 1923290508,
                predicate: "auth.codeTypeSms",
                params: [],
                type: "auth.CodeType"
            }, {
                id: 1948046307,
                predicate: "auth.codeTypeCall",
                params: [],
                type: "auth.CodeType"
            }, {
                id: 577556219,
                predicate: "auth.codeTypeFlashCall",
                params: [],
                type: "auth.CodeType"
            }, {
                id: 1035688326,
                predicate: "auth.sentCodeTypeApp",
                params: [{
                    name: "length",
                    type: "int"
                }],
                type: "auth.SentCodeType"
            }, {
                id: -1073693790,
                predicate: "auth.sentCodeTypeSms",
                params: [{
                    name: "length",
                    type: "int"
                }],
                type: "auth.SentCodeType"
            }, {
                id: 1398007207,
                predicate: "auth.sentCodeTypeCall",
                params: [{
                    name: "length",
                    type: "int"
                }],
                type: "auth.SentCodeType"
            }, {
                id: -1425815847,
                predicate: "auth.sentCodeTypeFlashCall",
                params: [{
                    name: "pattern",
                    type: "string"
                }],
                type: "auth.SentCodeType"
            }, {
                id: 911761060,
                predicate: "messages.botCallbackAnswer",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "alert",
                    type: "flags.1?true"
                }, {
                    name: "has_url",
                    type: "flags.3?true"
                }, {
                    name: "native_ui",
                    type: "flags.4?true"
                }, {
                    name: "message",
                    type: "flags.0?string"
                }, {
                    name: "url",
                    type: "flags.2?string"
                }, {
                    name: "cache_time",
                    type: "int"
                }],
                type: "messages.BotCallbackAnswer"
            }, {
                id: 649453030,
                predicate: "messages.messageEditData",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "caption",
                    type: "flags.0?true"
                }],
                type: "messages.MessageEditData"
            }, {
                id: -1995686519,
                predicate: "inputBotInlineMessageID",
                params: [{
                    name: "dc_id",
                    type: "int"
                }, {
                    name: "id",
                    type: "long"
                }, {
                    name: "access_hash",
                    type: "long"
                }],
                type: "InputBotInlineMessageID"
            }, {
                id: -1227287081,
                predicate: "inputBotInlineMessageID64",
                params: [{
                    name: "dc_id",
                    type: "int"
                }, {
                    name: "owner_id",
                    type: "long"
                }, {
                    name: "id",
                    type: "int"
                }, {
                    name: "access_hash",
                    type: "long"
                }],
                type: "InputBotInlineMessageID"
            }, {
                id: 1008755359,
                predicate: "inlineBotSwitchPM",
                params: [{
                    name: "text",
                    type: "string"
                }, {
                    name: "start_param",
                    type: "string"
                }],
                type: "InlineBotSwitchPM"
            }, {
                id: 863093588,
                predicate: "messages.peerDialogs",
                params: [{
                    name: "dialogs",
                    type: "Vector<Dialog>"
                }, {
                    name: "messages",
                    type: "Vector<Message>"
                }, {
                    name: "chats",
                    type: "Vector<Chat>"
                }, {
                    name: "users",
                    type: "Vector<User>"
                }, {
                    name: "state",
                    type: "updates.State"
                }],
                type: "messages.PeerDialogs"
            }, {
                id: -305282981,
                predicate: "topPeer",
                params: [{
                    name: "peer",
                    type: "Peer"
                }, {
                    name: "rating",
                    type: "double"
                }],
                type: "TopPeer"
            }, {
                id: -1419371685,
                predicate: "topPeerCategoryBotsPM",
                params: [],
                type: "TopPeerCategory"
            }, {
                id: 344356834,
                predicate: "topPeerCategoryBotsInline",
                params: [],
                type: "TopPeerCategory"
            }, {
                id: 104314861,
                predicate: "topPeerCategoryCorrespondents",
                params: [],
                type: "TopPeerCategory"
            }, {
                id: -1122524854,
                predicate: "topPeerCategoryGroups",
                params: [],
                type: "TopPeerCategory"
            }, {
                id: 371037736,
                predicate: "topPeerCategoryChannels",
                params: [],
                type: "TopPeerCategory"
            }, {
                id: 511092620,
                predicate: "topPeerCategoryPhoneCalls",
                params: [],
                type: "TopPeerCategory"
            }, {
                id: -1472172887,
                predicate: "topPeerCategoryForwardUsers",
                params: [],
                type: "TopPeerCategory"
            }, {
                id: -68239120,
                predicate: "topPeerCategoryForwardChats",
                params: [],
                type: "TopPeerCategory"
            }, {
                id: -75283823,
                predicate: "topPeerCategoryPeers",
                params: [{
                    name: "category",
                    type: "TopPeerCategory"
                }, {
                    name: "count",
                    type: "int"
                }, {
                    name: "peers",
                    type: "Vector<TopPeer>"
                }],
                type: "TopPeerCategoryPeers"
            }, {
                id: -567906571,
                predicate: "contacts.topPeersNotModified",
                params: [],
                type: "contacts.TopPeers"
            }, {
                id: 1891070632,
                predicate: "contacts.topPeers",
                params: [{
                    name: "categories",
                    type: "Vector<TopPeerCategoryPeers>"
                }, {
                    name: "chats",
                    type: "Vector<Chat>"
                }, {
                    name: "users",
                    type: "Vector<User>"
                }],
                type: "contacts.TopPeers"
            }, {
                id: -1255369827,
                predicate: "contacts.topPeersDisabled",
                params: [],
                type: "contacts.TopPeers"
            }, {
                id: 453805082,
                predicate: "draftMessageEmpty",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "date",
                    type: "flags.0?int"
                }],
                type: "DraftMessage"
            }, {
                id: -40996577,
                predicate: "draftMessage",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "no_webpage",
                    type: "flags.1?true"
                }, {
                    name: "reply_to_msg_id",
                    type: "flags.0?int"
                }, {
                    name: "message",
                    type: "string"
                }, {
                    name: "entities",
                    type: "flags.3?Vector<MessageEntity>"
                }, {
                    name: "date",
                    type: "int"
                }],
                type: "DraftMessage"
            }, {
                id: -958657434,
                predicate: "messages.featuredStickersNotModified",
                params: [{
                    name: "count",
                    type: "int"
                }],
                type: "messages.FeaturedStickers"
            }, {
                id: -2067782896,
                predicate: "messages.featuredStickers",
                params: [{
                    name: "hash",
                    type: "long"
                }, {
                    name: "count",
                    type: "int"
                }, {
                    name: "sets",
                    type: "Vector<StickerSetCovered>"
                }, {
                    name: "unread",
                    type: "Vector<long>"
                }],
                type: "messages.FeaturedStickers"
            }, {
                id: 186120336,
                predicate: "messages.recentStickersNotModified",
                params: [],
                type: "messages.RecentStickers"
            }, {
                id: -1999405994,
                predicate: "messages.recentStickers",
                params: [{
                    name: "hash",
                    type: "long"
                }, {
                    name: "packs",
                    type: "Vector<StickerPack>"
                }, {
                    name: "stickers",
                    type: "Vector<Document>"
                }, {
                    name: "dates",
                    type: "Vector<int>"
                }],
                type: "messages.RecentStickers"
            }, {
                id: 1338747336,
                predicate: "messages.archivedStickers",
                params: [{
                    name: "count",
                    type: "int"
                }, {
                    name: "sets",
                    type: "Vector<StickerSetCovered>"
                }],
                type: "messages.ArchivedStickers"
            }, {
                id: 946083368,
                predicate: "messages.stickerSetInstallResultSuccess",
                params: [],
                type: "messages.StickerSetInstallResult"
            }, {
                id: 904138920,
                predicate: "messages.stickerSetInstallResultArchive",
                params: [{
                    name: "sets",
                    type: "Vector<StickerSetCovered>"
                }],
                type: "messages.StickerSetInstallResult"
            }, {
                id: 1678812626,
                predicate: "stickerSetCovered",
                params: [{
                    name: "set",
                    type: "StickerSet"
                }, {
                    name: "cover",
                    type: "Document"
                }],
                type: "StickerSetCovered"
            }, {
                id: 872932635,
                predicate: "stickerSetMultiCovered",
                params: [{
                    name: "set",
                    type: "StickerSet"
                }, {
                    name: "covers",
                    type: "Vector<Document>"
                }],
                type: "StickerSetCovered"
            }, {
                id: -1361650766,
                predicate: "maskCoords",
                params: [{
                    name: "n",
                    type: "int"
                }, {
                    name: "x",
                    type: "double"
                }, {
                    name: "y",
                    type: "double"
                }, {
                    name: "zoom",
                    type: "double"
                }],
                type: "MaskCoords"
            }, {
                id: 1251549527,
                predicate: "inputStickeredMediaPhoto",
                params: [{
                    name: "id",
                    type: "InputPhoto"
                }],
                type: "InputStickeredMedia"
            }, {
                id: 70813275,
                predicate: "inputStickeredMediaDocument",
                params: [{
                    name: "id",
                    type: "InputDocument"
                }],
                type: "InputStickeredMedia"
            }, {
                id: -1107729093,
                predicate: "game",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "id",
                    type: "long"
                }, {
                    name: "access_hash",
                    type: "long"
                }, {
                    name: "short_name",
                    type: "string"
                }, {
                    name: "title",
                    type: "string"
                }, {
                    name: "description",
                    type: "string"
                }, {
                    name: "photo",
                    type: "Photo"
                }, {
                    name: "document",
                    type: "flags.0?Document"
                }],
                type: "Game"
            }, {
                id: 53231223,
                predicate: "inputGameID",
                params: [{
                    name: "id",
                    type: "long"
                }, {
                    name: "access_hash",
                    type: "long"
                }],
                type: "InputGame"
            }, {
                id: -1020139510,
                predicate: "inputGameShortName",
                params: [{
                    name: "bot_id",
                    type: "InputUser"
                }, {
                    name: "short_name",
                    type: "string"
                }],
                type: "InputGame"
            }, {
                id: 1940093419,
                predicate: "highScore",
                params: [{
                    name: "pos",
                    type: "int"
                }, {
                    name: "user_id",
                    type: "long"
                }, {
                    name: "score",
                    type: "int"
                }],
                type: "HighScore"
            }, {
                id: -1707344487,
                predicate: "messages.highScores",
                params: [{
                    name: "scores",
                    type: "Vector<HighScore>"
                }, {
                    name: "users",
                    type: "Vector<User>"
                }],
                type: "messages.HighScores"
            }, {
                id: -599948721,
                predicate: "textEmpty",
                params: [],
                type: "RichText"
            }, {
                id: 1950782688,
                predicate: "textPlain",
                params: [{
                    name: "text",
                    type: "string"
                }],
                type: "RichText"
            }, {
                id: 1730456516,
                predicate: "textBold",
                params: [{
                    name: "text",
                    type: "RichText"
                }],
                type: "RichText"
            }, {
                id: -653089380,
                predicate: "textItalic",
                params: [{
                    name: "text",
                    type: "RichText"
                }],
                type: "RichText"
            }, {
                id: -1054465340,
                predicate: "textUnderline",
                params: [{
                    name: "text",
                    type: "RichText"
                }],
                type: "RichText"
            }, {
                id: -1678197867,
                predicate: "textStrike",
                params: [{
                    name: "text",
                    type: "RichText"
                }],
                type: "RichText"
            }, {
                id: 1816074681,
                predicate: "textFixed",
                params: [{
                    name: "text",
                    type: "RichText"
                }],
                type: "RichText"
            }, {
                id: 1009288385,
                predicate: "textUrl",
                params: [{
                    name: "text",
                    type: "RichText"
                }, {
                    name: "url",
                    type: "string"
                }, {
                    name: "webpage_id",
                    type: "long"
                }],
                type: "RichText"
            }, {
                id: -564523562,
                predicate: "textEmail",
                params: [{
                    name: "text",
                    type: "RichText"
                }, {
                    name: "email",
                    type: "string"
                }],
                type: "RichText"
            }, {
                id: 2120376535,
                predicate: "textConcat",
                params: [{
                    name: "texts",
                    type: "Vector<RichText>"
                }],
                type: "RichText"
            }, {
                id: -311786236,
                predicate: "textSubscript",
                params: [{
                    name: "text",
                    type: "RichText"
                }],
                type: "RichText"
            }, {
                id: -939827711,
                predicate: "textSuperscript",
                params: [{
                    name: "text",
                    type: "RichText"
                }],
                type: "RichText"
            }, {
                id: 55281185,
                predicate: "textMarked",
                params: [{
                    name: "text",
                    type: "RichText"
                }],
                type: "RichText"
            }, {
                id: 483104362,
                predicate: "textPhone",
                params: [{
                    name: "text",
                    type: "RichText"
                }, {
                    name: "phone",
                    type: "string"
                }],
                type: "RichText"
            }, {
                id: 136105807,
                predicate: "textImage",
                params: [{
                    name: "document_id",
                    type: "long"
                }, {
                    name: "w",
                    type: "int"
                }, {
                    name: "h",
                    type: "int"
                }],
                type: "RichText"
            }, {
                id: 894777186,
                predicate: "textAnchor",
                params: [{
                    name: "text",
                    type: "RichText"
                }, {
                    name: "name",
                    type: "string"
                }],
                type: "RichText"
            }, {
                id: 324435594,
                predicate: "pageBlockUnsupported",
                params: [],
                type: "PageBlock"
            }, {
                id: 1890305021,
                predicate: "pageBlockTitle",
                params: [{
                    name: "text",
                    type: "RichText"
                }],
                type: "PageBlock"
            }, {
                id: -1879401953,
                predicate: "pageBlockSubtitle",
                params: [{
                    name: "text",
                    type: "RichText"
                }],
                type: "PageBlock"
            }, {
                id: -1162877472,
                predicate: "pageBlockAuthorDate",
                params: [{
                    name: "author",
                    type: "RichText"
                }, {
                    name: "published_date",
                    type: "int"
                }],
                type: "PageBlock"
            }, {
                id: -1076861716,
                predicate: "pageBlockHeader",
                params: [{
                    name: "text",
                    type: "RichText"
                }],
                type: "PageBlock"
            }, {
                id: -248793375,
                predicate: "pageBlockSubheader",
                params: [{
                    name: "text",
                    type: "RichText"
                }],
                type: "PageBlock"
            }, {
                id: 1182402406,
                predicate: "pageBlockParagraph",
                params: [{
                    name: "text",
                    type: "RichText"
                }],
                type: "PageBlock"
            }, {
                id: -1066346178,
                predicate: "pageBlockPreformatted",
                params: [{
                    name: "text",
                    type: "RichText"
                }, {
                    name: "language",
                    type: "string"
                }],
                type: "PageBlock"
            }, {
                id: 1216809369,
                predicate: "pageBlockFooter",
                params: [{
                    name: "text",
                    type: "RichText"
                }],
                type: "PageBlock"
            }, {
                id: -618614392,
                predicate: "pageBlockDivider",
                params: [],
                type: "PageBlock"
            }, {
                id: -837994576,
                predicate: "pageBlockAnchor",
                params: [{
                    name: "name",
                    type: "string"
                }],
                type: "PageBlock"
            }, {
                id: -454524911,
                predicate: "pageBlockList",
                params: [{
                    name: "items",
                    type: "Vector<PageListItem>"
                }],
                type: "PageBlock"
            }, {
                id: 641563686,
                predicate: "pageBlockBlockquote",
                params: [{
                    name: "text",
                    type: "RichText"
                }, {
                    name: "caption",
                    type: "RichText"
                }],
                type: "PageBlock"
            }, {
                id: 1329878739,
                predicate: "pageBlockPullquote",
                params: [{
                    name: "text",
                    type: "RichText"
                }, {
                    name: "caption",
                    type: "RichText"
                }],
                type: "PageBlock"
            }, {
                id: 391759200,
                predicate: "pageBlockPhoto",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "photo_id",
                    type: "long"
                }, {
                    name: "caption",
                    type: "PageCaption"
                }, {
                    name: "url",
                    type: "flags.0?string"
                }, {
                    name: "webpage_id",
                    type: "flags.0?long"
                }],
                type: "PageBlock"
            }, {
                id: 2089805750,
                predicate: "pageBlockVideo",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "autoplay",
                    type: "flags.0?true"
                }, {
                    name: "loop",
                    type: "flags.1?true"
                }, {
                    name: "video_id",
                    type: "long"
                }, {
                    name: "caption",
                    type: "PageCaption"
                }],
                type: "PageBlock"
            }, {
                id: 972174080,
                predicate: "pageBlockCover",
                params: [{
                    name: "cover",
                    type: "PageBlock"
                }],
                type: "PageBlock"
            }, {
                id: -1468953147,
                predicate: "pageBlockEmbed",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "full_width",
                    type: "flags.0?true"
                }, {
                    name: "allow_scrolling",
                    type: "flags.3?true"
                }, {
                    name: "url",
                    type: "flags.1?string"
                }, {
                    name: "html",
                    type: "flags.2?string"
                }, {
                    name: "poster_photo_id",
                    type: "flags.4?long"
                }, {
                    name: "w",
                    type: "flags.5?int"
                }, {
                    name: "h",
                    type: "flags.5?int"
                }, {
                    name: "caption",
                    type: "PageCaption"
                }],
                type: "PageBlock"
            }, {
                id: -229005301,
                predicate: "pageBlockEmbedPost",
                params: [{
                    name: "url",
                    type: "string"
                }, {
                    name: "webpage_id",
                    type: "long"
                }, {
                    name: "author_photo_id",
                    type: "long"
                }, {
                    name: "author",
                    type: "string"
                }, {
                    name: "date",
                    type: "int"
                }, {
                    name: "blocks",
                    type: "Vector<PageBlock>"
                }, {
                    name: "caption",
                    type: "PageCaption"
                }],
                type: "PageBlock"
            }, {
                id: 1705048653,
                predicate: "pageBlockCollage",
                params: [{
                    name: "items",
                    type: "Vector<PageBlock>"
                }, {
                    name: "caption",
                    type: "PageCaption"
                }],
                type: "PageBlock"
            }, {
                id: 52401552,
                predicate: "pageBlockSlideshow",
                params: [{
                    name: "items",
                    type: "Vector<PageBlock>"
                }, {
                    name: "caption",
                    type: "PageCaption"
                }],
                type: "PageBlock"
            }, {
                id: -283684427,
                predicate: "pageBlockChannel",
                params: [{
                    name: "channel",
                    type: "Chat"
                }],
                type: "PageBlock"
            }, {
                id: -2143067670,
                predicate: "pageBlockAudio",
                params: [{
                    name: "audio_id",
                    type: "long"
                }, {
                    name: "caption",
                    type: "PageCaption"
                }],
                type: "PageBlock"
            }, {
                id: 504660880,
                predicate: "pageBlockKicker",
                params: [{
                    name: "text",
                    type: "RichText"
                }],
                type: "PageBlock"
            }, {
                id: -1085412734,
                predicate: "pageBlockTable",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "bordered",
                    type: "flags.0?true"
                }, {
                    name: "striped",
                    type: "flags.1?true"
                }, {
                    name: "title",
                    type: "RichText"
                }, {
                    name: "rows",
                    type: "Vector<PageTableRow>"
                }],
                type: "PageBlock"
            }, {
                id: -1702174239,
                predicate: "pageBlockOrderedList",
                params: [{
                    name: "items",
                    type: "Vector<PageListOrderedItem>"
                }],
                type: "PageBlock"
            }, {
                id: 1987480557,
                predicate: "pageBlockDetails",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "open",
                    type: "flags.0?true"
                }, {
                    name: "blocks",
                    type: "Vector<PageBlock>"
                }, {
                    name: "title",
                    type: "RichText"
                }],
                type: "PageBlock"
            }, {
                id: 370236054,
                predicate: "pageBlockRelatedArticles",
                params: [{
                    name: "title",
                    type: "RichText"
                }, {
                    name: "articles",
                    type: "Vector<PageRelatedArticle>"
                }],
                type: "PageBlock"
            }, {
                id: -1538310410,
                predicate: "pageBlockMap",
                params: [{
                    name: "geo",
                    type: "GeoPoint"
                }, {
                    name: "zoom",
                    type: "int"
                }, {
                    name: "w",
                    type: "int"
                }, {
                    name: "h",
                    type: "int"
                }, {
                    name: "caption",
                    type: "PageCaption"
                }],
                type: "PageBlock"
            }, {
                id: -2048646399,
                predicate: "phoneCallDiscardReasonMissed",
                params: [],
                type: "PhoneCallDiscardReason"
            }, {
                id: -527056480,
                predicate: "phoneCallDiscardReasonDisconnect",
                params: [],
                type: "PhoneCallDiscardReason"
            }, {
                id: 1471006352,
                predicate: "phoneCallDiscardReasonHangup",
                params: [],
                type: "PhoneCallDiscardReason"
            }, {
                id: -84416311,
                predicate: "phoneCallDiscardReasonBusy",
                params: [],
                type: "PhoneCallDiscardReason"
            }, {
                id: 2104790276,
                predicate: "dataJSON",
                params: [{
                    name: "data",
                    type: "string"
                }],
                type: "DataJSON"
            }, {
                id: -886477832,
                predicate: "labeledPrice",
                params: [{
                    name: "label",
                    type: "string"
                }, {
                    name: "amount",
                    type: "long"
                }],
                type: "LabeledPrice"
            }, {
                id: 215516896,
                predicate: "invoice",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "test",
                    type: "flags.0?true"
                }, {
                    name: "name_requested",
                    type: "flags.1?true"
                }, {
                    name: "phone_requested",
                    type: "flags.2?true"
                }, {
                    name: "email_requested",
                    type: "flags.3?true"
                }, {
                    name: "shipping_address_requested",
                    type: "flags.4?true"
                }, {
                    name: "flexible",
                    type: "flags.5?true"
                }, {
                    name: "phone_to_provider",
                    type: "flags.6?true"
                }, {
                    name: "email_to_provider",
                    type: "flags.7?true"
                }, {
                    name: "currency",
                    type: "string"
                }, {
                    name: "prices",
                    type: "Vector<LabeledPrice>"
                }, {
                    name: "max_tip_amount",
                    type: "flags.8?long"
                }, {
                    name: "suggested_tip_amounts",
                    type: "flags.8?Vector<long>"
                }],
                type: "Invoice"
            }, {
                id: -368917890,
                predicate: "paymentCharge",
                params: [{
                    name: "id",
                    type: "string"
                }, {
                    name: "provider_charge_id",
                    type: "string"
                }],
                type: "PaymentCharge"
            }, {
                id: 512535275,
                predicate: "postAddress",
                params: [{
                    name: "street_line1",
                    type: "string"
                }, {
                    name: "street_line2",
                    type: "string"
                }, {
                    name: "city",
                    type: "string"
                }, {
                    name: "state",
                    type: "string"
                }, {
                    name: "country_iso2",
                    type: "string"
                }, {
                    name: "post_code",
                    type: "string"
                }],
                type: "PostAddress"
            }, {
                id: -1868808300,
                predicate: "paymentRequestedInfo",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "name",
                    type: "flags.0?string"
                }, {
                    name: "phone",
                    type: "flags.1?string"
                }, {
                    name: "email",
                    type: "flags.2?string"
                }, {
                    name: "shipping_address",
                    type: "flags.3?PostAddress"
                }],
                type: "PaymentRequestedInfo"
            }, {
                id: -842892769,
                predicate: "paymentSavedCredentialsCard",
                params: [{
                    name: "id",
                    type: "string"
                }, {
                    name: "title",
                    type: "string"
                }],
                type: "PaymentSavedCredentials"
            }, {
                id: 475467473,
                predicate: "webDocument",
                params: [{
                    name: "url",
                    type: "string"
                }, {
                    name: "access_hash",
                    type: "long"
                }, {
                    name: "size",
                    type: "int"
                }, {
                    name: "mime_type",
                    type: "string"
                }, {
                    name: "attributes",
                    type: "Vector<DocumentAttribute>"
                }],
                type: "WebDocument"
            }, {
                id: -104284986,
                predicate: "webDocumentNoProxy",
                params: [{
                    name: "url",
                    type: "string"
                }, {
                    name: "size",
                    type: "int"
                }, {
                    name: "mime_type",
                    type: "string"
                }, {
                    name: "attributes",
                    type: "Vector<DocumentAttribute>"
                }],
                type: "WebDocument"
            }, {
                id: -1678949555,
                predicate: "inputWebDocument",
                params: [{
                    name: "url",
                    type: "string"
                }, {
                    name: "size",
                    type: "int"
                }, {
                    name: "mime_type",
                    type: "string"
                }, {
                    name: "attributes",
                    type: "Vector<DocumentAttribute>"
                }],
                type: "InputWebDocument"
            }, {
                id: -1036396922,
                predicate: "inputWebFileLocation",
                params: [{
                    name: "url",
                    type: "string"
                }, {
                    name: "access_hash",
                    type: "long"
                }],
                type: "InputWebFileLocation"
            }, {
                id: -1625153079,
                predicate: "inputWebFileGeoPointLocation",
                params: [{
                    name: "geo_point",
                    type: "InputGeoPoint"
                }, {
                    name: "access_hash",
                    type: "long"
                }, {
                    name: "w",
                    type: "int"
                }, {
                    name: "h",
                    type: "int"
                }, {
                    name: "zoom",
                    type: "int"
                }, {
                    name: "scale",
                    type: "int"
                }],
                type: "InputWebFileLocation"
            }, {
                id: 568808380,
                predicate: "upload.webFile",
                params: [{
                    name: "size",
                    type: "int"
                }, {
                    name: "mime_type",
                    type: "string"
                }, {
                    name: "file_type",
                    type: "storage.FileType"
                }, {
                    name: "mtime",
                    type: "int"
                }, {
                    name: "bytes",
                    type: "bytes"
                }],
                type: "upload.WebFile"
            }, {
                id: 378828315,
                predicate: "payments.paymentForm",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "can_save_credentials",
                    type: "flags.2?true"
                }, {
                    name: "password_missing",
                    type: "flags.3?true"
                }, {
                    name: "form_id",
                    type: "long"
                }, {
                    name: "bot_id",
                    type: "long"
                }, {
                    name: "invoice",
                    type: "Invoice"
                }, {
                    name: "provider_id",
                    type: "long"
                }, {
                    name: "url",
                    type: "string"
                }, {
                    name: "native_provider",
                    type: "flags.4?string"
                }, {
                    name: "native_params",
                    type: "flags.4?DataJSON"
                }, {
                    name: "saved_info",
                    type: "flags.0?PaymentRequestedInfo"
                }, {
                    name: "saved_credentials",
                    type: "flags.1?PaymentSavedCredentials"
                }, {
                    name: "users",
                    type: "Vector<User>"
                }],
                type: "payments.PaymentForm"
            }, {
                id: -784000893,
                predicate: "payments.validatedRequestedInfo",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "id",
                    type: "flags.0?string"
                }, {
                    name: "shipping_options",
                    type: "flags.1?Vector<ShippingOption>"
                }],
                type: "payments.ValidatedRequestedInfo"
            }, {
                id: 1314881805,
                predicate: "payments.paymentResult",
                params: [{
                    name: "updates",
                    type: "Updates"
                }],
                type: "payments.PaymentResult"
            }, {
                id: -666824391,
                predicate: "payments.paymentVerificationNeeded",
                params: [{
                    name: "url",
                    type: "string"
                }],
                type: "payments.PaymentResult"
            }, {
                id: 1891958275,
                predicate: "payments.paymentReceipt",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "date",
                    type: "int"
                }, {
                    name: "bot_id",
                    type: "long"
                }, {
                    name: "provider_id",
                    type: "long"
                }, {
                    name: "title",
                    type: "string"
                }, {
                    name: "description",
                    type: "string"
                }, {
                    name: "photo",
                    type: "flags.2?WebDocument"
                }, {
                    name: "invoice",
                    type: "Invoice"
                }, {
                    name: "info",
                    type: "flags.0?PaymentRequestedInfo"
                }, {
                    name: "shipping",
                    type: "flags.1?ShippingOption"
                }, {
                    name: "tip_amount",
                    type: "flags.3?long"
                }, {
                    name: "currency",
                    type: "string"
                }, {
                    name: "total_amount",
                    type: "long"
                }, {
                    name: "credentials_title",
                    type: "string"
                }, {
                    name: "users",
                    type: "Vector<User>"
                }],
                type: "payments.PaymentReceipt"
            }, {
                id: -74456004,
                predicate: "payments.savedInfo",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "has_saved_credentials",
                    type: "flags.1?true"
                }, {
                    name: "saved_info",
                    type: "flags.0?PaymentRequestedInfo"
                }],
                type: "payments.SavedInfo"
            }, {
                id: -1056001329,
                predicate: "inputPaymentCredentialsSaved",
                params: [{
                    name: "id",
                    type: "string"
                }, {
                    name: "tmp_password",
                    type: "bytes"
                }],
                type: "InputPaymentCredentials"
            }, {
                id: 873977640,
                predicate: "inputPaymentCredentials",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "save",
                    type: "flags.0?true"
                }, {
                    name: "data",
                    type: "DataJSON"
                }],
                type: "InputPaymentCredentials"
            }, {
                id: 178373535,
                predicate: "inputPaymentCredentialsApplePay",
                params: [{
                    name: "payment_data",
                    type: "DataJSON"
                }],
                type: "InputPaymentCredentials"
            }, {
                id: -1966921727,
                predicate: "inputPaymentCredentialsGooglePay",
                params: [{
                    name: "payment_token",
                    type: "DataJSON"
                }],
                type: "InputPaymentCredentials"
            }, {
                id: -614138572,
                predicate: "account.tmpPassword",
                params: [{
                    name: "tmp_password",
                    type: "bytes"
                }, {
                    name: "valid_until",
                    type: "int"
                }],
                type: "account.TmpPassword"
            }, {
                id: -1239335713,
                predicate: "shippingOption",
                params: [{
                    name: "id",
                    type: "string"
                }, {
                    name: "title",
                    type: "string"
                }, {
                    name: "prices",
                    type: "Vector<LabeledPrice>"
                }],
                type: "ShippingOption"
            }, {
                id: -6249322,
                predicate: "inputStickerSetItem",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "document",
                    type: "InputDocument"
                }, {
                    name: "emoji",
                    type: "string"
                }, {
                    name: "mask_coords",
                    type: "flags.0?MaskCoords"
                }],
                type: "InputStickerSetItem"
            }, {
                id: 506920429,
                predicate: "inputPhoneCall",
                params: [{
                    name: "id",
                    type: "long"
                }, {
                    name: "access_hash",
                    type: "long"
                }],
                type: "InputPhoneCall"
            }, {
                id: 1399245077,
                predicate: "phoneCallEmpty",
                params: [{
                    name: "id",
                    type: "long"
                }],
                type: "PhoneCall"
            }, {
                id: -987599081,
                predicate: "phoneCallWaiting",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "video",
                    type: "flags.6?true"
                }, {
                    name: "id",
                    type: "long"
                }, {
                    name: "access_hash",
                    type: "long"
                }, {
                    name: "date",
                    type: "int"
                }, {
                    name: "admin_id",
                    type: "long"
                }, {
                    name: "participant_id",
                    type: "long"
                }, {
                    name: "protocol",
                    type: "PhoneCallProtocol"
                }, {
                    name: "receive_date",
                    type: "flags.0?int"
                }],
                type: "PhoneCall"
            }, {
                id: 347139340,
                predicate: "phoneCallRequested",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "video",
                    type: "flags.6?true"
                }, {
                    name: "id",
                    type: "long"
                }, {
                    name: "access_hash",
                    type: "long"
                }, {
                    name: "date",
                    type: "int"
                }, {
                    name: "admin_id",
                    type: "long"
                }, {
                    name: "participant_id",
                    type: "long"
                }, {
                    name: "g_a_hash",
                    type: "bytes"
                }, {
                    name: "protocol",
                    type: "PhoneCallProtocol"
                }],
                type: "PhoneCall"
            }, {
                id: 912311057,
                predicate: "phoneCallAccepted",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "video",
                    type: "flags.6?true"
                }, {
                    name: "id",
                    type: "long"
                }, {
                    name: "access_hash",
                    type: "long"
                }, {
                    name: "date",
                    type: "int"
                }, {
                    name: "admin_id",
                    type: "long"
                }, {
                    name: "participant_id",
                    type: "long"
                }, {
                    name: "g_b",
                    type: "bytes"
                }, {
                    name: "protocol",
                    type: "PhoneCallProtocol"
                }],
                type: "PhoneCall"
            }, {
                id: -1770029977,
                predicate: "phoneCall",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "p2p_allowed",
                    type: "flags.5?true"
                }, {
                    name: "video",
                    type: "flags.6?true"
                }, {
                    name: "id",
                    type: "long"
                }, {
                    name: "access_hash",
                    type: "long"
                }, {
                    name: "date",
                    type: "int"
                }, {
                    name: "admin_id",
                    type: "long"
                }, {
                    name: "participant_id",
                    type: "long"
                }, {
                    name: "g_a_or_b",
                    type: "bytes"
                }, {
                    name: "key_fingerprint",
                    type: "long"
                }, {
                    name: "protocol",
                    type: "PhoneCallProtocol"
                }, {
                    name: "connections",
                    type: "Vector<PhoneConnection>"
                }, {
                    name: "start_date",
                    type: "int"
                }],
                type: "PhoneCall"
            }, {
                id: 1355435489,
                predicate: "phoneCallDiscarded",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "need_rating",
                    type: "flags.2?true"
                }, {
                    name: "need_debug",
                    type: "flags.3?true"
                }, {
                    name: "video",
                    type: "flags.6?true"
                }, {
                    name: "id",
                    type: "long"
                }, {
                    name: "reason",
                    type: "flags.0?PhoneCallDiscardReason"
                }, {
                    name: "duration",
                    type: "flags.1?int"
                }],
                type: "PhoneCall"
            }, {
                id: -1655957568,
                predicate: "phoneConnection",
                params: [{
                    name: "id",
                    type: "long"
                }, {
                    name: "ip",
                    type: "string"
                }, {
                    name: "ipv6",
                    type: "string"
                }, {
                    name: "port",
                    type: "int"
                }, {
                    name: "peer_tag",
                    type: "bytes"
                }],
                type: "PhoneConnection"
            }, {
                id: 1667228533,
                predicate: "phoneConnectionWebrtc",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "turn",
                    type: "flags.0?true"
                }, {
                    name: "stun",
                    type: "flags.1?true"
                }, {
                    name: "id",
                    type: "long"
                }, {
                    name: "ip",
                    type: "string"
                }, {
                    name: "ipv6",
                    type: "string"
                }, {
                    name: "port",
                    type: "int"
                }, {
                    name: "username",
                    type: "string"
                }, {
                    name: "password",
                    type: "string"
                }],
                type: "PhoneConnection"
            }, {
                id: -58224696,
                predicate: "phoneCallProtocol",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "udp_p2p",
                    type: "flags.0?true"
                }, {
                    name: "udp_reflector",
                    type: "flags.1?true"
                }, {
                    name: "min_layer",
                    type: "int"
                }, {
                    name: "max_layer",
                    type: "int"
                }, {
                    name: "library_versions",
                    type: "Vector<string>"
                }],
                type: "PhoneCallProtocol"
            }, {
                id: -326966976,
                predicate: "phone.phoneCall",
                params: [{
                    name: "phone_call",
                    type: "PhoneCall"
                }, {
                    name: "users",
                    type: "Vector<User>"
                }],
                type: "phone.PhoneCall"
            }, {
                id: -290921362,
                predicate: "upload.cdnFileReuploadNeeded",
                params: [{
                    name: "request_token",
                    type: "bytes"
                }],
                type: "upload.CdnFile"
            }, {
                id: -1449145777,
                predicate: "upload.cdnFile",
                params: [{
                    name: "bytes",
                    type: "bytes"
                }],
                type: "upload.CdnFile"
            }, {
                id: -914167110,
                predicate: "cdnPublicKey",
                params: [{
                    name: "dc_id",
                    type: "int"
                }, {
                    name: "public_key",
                    type: "string"
                }],
                type: "CdnPublicKey"
            }, {
                id: 1462101002,
                predicate: "cdnConfig",
                params: [{
                    name: "public_keys",
                    type: "Vector<CdnPublicKey>"
                }],
                type: "CdnConfig"
            }, {
                id: -892239370,
                predicate: "langPackString",
                params: [{
                    name: "key",
                    type: "string"
                }, {
                    name: "value",
                    type: "string"
                }],
                type: "LangPackString"
            }, {
                id: 1816636575,
                predicate: "langPackStringPluralized",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "key",
                    type: "string"
                }, {
                    name: "zero_value",
                    type: "flags.0?string"
                }, {
                    name: "one_value",
                    type: "flags.1?string"
                }, {
                    name: "two_value",
                    type: "flags.2?string"
                }, {
                    name: "few_value",
                    type: "flags.3?string"
                }, {
                    name: "many_value",
                    type: "flags.4?string"
                }, {
                    name: "other_value",
                    type: "string"
                }],
                type: "LangPackString"
            }, {
                id: 695856818,
                predicate: "langPackStringDeleted",
                params: [{
                    name: "key",
                    type: "string"
                }],
                type: "LangPackString"
            }, {
                id: -209337866,
                predicate: "langPackDifference",
                params: [{
                    name: "lang_code",
                    type: "string"
                }, {
                    name: "from_version",
                    type: "int"
                }, {
                    name: "version",
                    type: "int"
                }, {
                    name: "strings",
                    type: "Vector<LangPackString>"
                }],
                type: "LangPackDifference"
            }, {
                id: -288727837,
                predicate: "langPackLanguage",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "official",
                    type: "flags.0?true"
                }, {
                    name: "rtl",
                    type: "flags.2?true"
                }, {
                    name: "beta",
                    type: "flags.3?true"
                }, {
                    name: "name",
                    type: "string"
                }, {
                    name: "native_name",
                    type: "string"
                }, {
                    name: "lang_code",
                    type: "string"
                }, {
                    name: "base_lang_code",
                    type: "flags.1?string"
                }, {
                    name: "plural_code",
                    type: "string"
                }, {
                    name: "strings_count",
                    type: "int"
                }, {
                    name: "translated_count",
                    type: "int"
                }, {
                    name: "translations_url",
                    type: "string"
                }],
                type: "LangPackLanguage"
            }, {
                id: -421545947,
                predicate: "channelAdminLogEventActionChangeTitle",
                params: [{
                    name: "prev_value",
                    type: "string"
                }, {
                    name: "new_value",
                    type: "string"
                }],
                type: "ChannelAdminLogEventAction"
            }, {
                id: 1427671598,
                predicate: "channelAdminLogEventActionChangeAbout",
                params: [{
                    name: "prev_value",
                    type: "string"
                }, {
                    name: "new_value",
                    type: "string"
                }],
                type: "ChannelAdminLogEventAction"
            }, {
                id: 1783299128,
                predicate: "channelAdminLogEventActionChangeUsername",
                params: [{
                    name: "prev_value",
                    type: "string"
                }, {
                    name: "new_value",
                    type: "string"
                }],
                type: "ChannelAdminLogEventAction"
            }, {
                id: 1129042607,
                predicate: "channelAdminLogEventActionChangePhoto",
                params: [{
                    name: "prev_photo",
                    type: "Photo"
                }, {
                    name: "new_photo",
                    type: "Photo"
                }],
                type: "ChannelAdminLogEventAction"
            }, {
                id: 460916654,
                predicate: "channelAdminLogEventActionToggleInvites",
                params: [{
                    name: "new_value",
                    type: "Bool"
                }],
                type: "ChannelAdminLogEventAction"
            }, {
                id: 648939889,
                predicate: "channelAdminLogEventActionToggleSignatures",
                params: [{
                    name: "new_value",
                    type: "Bool"
                }],
                type: "ChannelAdminLogEventAction"
            }, {
                id: -370660328,
                predicate: "channelAdminLogEventActionUpdatePinned",
                params: [{
                    name: "message",
                    type: "Message"
                }],
                type: "ChannelAdminLogEventAction"
            }, {
                id: 1889215493,
                predicate: "channelAdminLogEventActionEditMessage",
                params: [{
                    name: "prev_message",
                    type: "Message"
                }, {
                    name: "new_message",
                    type: "Message"
                }],
                type: "ChannelAdminLogEventAction"
            }, {
                id: 1121994683,
                predicate: "channelAdminLogEventActionDeleteMessage",
                params: [{
                    name: "message",
                    type: "Message"
                }],
                type: "ChannelAdminLogEventAction"
            }, {
                id: 405815507,
                predicate: "channelAdminLogEventActionParticipantJoin",
                params: [],
                type: "ChannelAdminLogEventAction"
            }, {
                id: -124291086,
                predicate: "channelAdminLogEventActionParticipantLeave",
                params: [],
                type: "ChannelAdminLogEventAction"
            }, {
                id: -484690728,
                predicate: "channelAdminLogEventActionParticipantInvite",
                params: [{
                    name: "participant",
                    type: "ChannelParticipant"
                }],
                type: "ChannelAdminLogEventAction"
            }, {
                id: -422036098,
                predicate: "channelAdminLogEventActionParticipantToggleBan",
                params: [{
                    name: "prev_participant",
                    type: "ChannelParticipant"
                }, {
                    name: "new_participant",
                    type: "ChannelParticipant"
                }],
                type: "ChannelAdminLogEventAction"
            }, {
                id: -714643696,
                predicate: "channelAdminLogEventActionParticipantToggleAdmin",
                params: [{
                    name: "prev_participant",
                    type: "ChannelParticipant"
                }, {
                    name: "new_participant",
                    type: "ChannelParticipant"
                }],
                type: "ChannelAdminLogEventAction"
            }, {
                id: -1312568665,
                predicate: "channelAdminLogEventActionChangeStickerSet",
                params: [{
                    name: "prev_stickerset",
                    type: "InputStickerSet"
                }, {
                    name: "new_stickerset",
                    type: "InputStickerSet"
                }],
                type: "ChannelAdminLogEventAction"
            }, {
                id: 1599903217,
                predicate: "channelAdminLogEventActionTogglePreHistoryHidden",
                params: [{
                    name: "new_value",
                    type: "Bool"
                }],
                type: "ChannelAdminLogEventAction"
            }, {
                id: 771095562,
                predicate: "channelAdminLogEventActionDefaultBannedRights",
                params: [{
                    name: "prev_banned_rights",
                    type: "ChatBannedRights"
                }, {
                    name: "new_banned_rights",
                    type: "ChatBannedRights"
                }],
                type: "ChannelAdminLogEventAction"
            }, {
                id: -1895328189,
                predicate: "channelAdminLogEventActionStopPoll",
                params: [{
                    name: "message",
                    type: "Message"
                }],
                type: "ChannelAdminLogEventAction"
            }, {
                id: 84703944,
                predicate: "channelAdminLogEventActionChangeLinkedChat",
                params: [{
                    name: "prev_value",
                    type: "long"
                }, {
                    name: "new_value",
                    type: "long"
                }],
                type: "ChannelAdminLogEventAction"
            }, {
                id: 241923758,
                predicate: "channelAdminLogEventActionChangeLocation",
                params: [{
                    name: "prev_value",
                    type: "ChannelLocation"
                }, {
                    name: "new_value",
                    type: "ChannelLocation"
                }],
                type: "ChannelAdminLogEventAction"
            }, {
                id: 1401984889,
                predicate: "channelAdminLogEventActionToggleSlowMode",
                params: [{
                    name: "prev_value",
                    type: "int"
                }, {
                    name: "new_value",
                    type: "int"
                }],
                type: "ChannelAdminLogEventAction"
            }, {
                id: 589338437,
                predicate: "channelAdminLogEventActionStartGroupCall",
                params: [{
                    name: "call",
                    type: "InputGroupCall"
                }],
                type: "ChannelAdminLogEventAction"
            }, {
                id: -610299584,
                predicate: "channelAdminLogEventActionDiscardGroupCall",
                params: [{
                    name: "call",
                    type: "InputGroupCall"
                }],
                type: "ChannelAdminLogEventAction"
            }, {
                id: -115071790,
                predicate: "channelAdminLogEventActionParticipantMute",
                params: [{
                    name: "participant",
                    type: "GroupCallParticipant"
                }],
                type: "ChannelAdminLogEventAction"
            }, {
                id: -431740480,
                predicate: "channelAdminLogEventActionParticipantUnmute",
                params: [{
                    name: "participant",
                    type: "GroupCallParticipant"
                }],
                type: "ChannelAdminLogEventAction"
            }, {
                id: 1456906823,
                predicate: "channelAdminLogEventActionToggleGroupCallSetting",
                params: [{
                    name: "join_muted",
                    type: "Bool"
                }],
                type: "ChannelAdminLogEventAction"
            }, {
                id: 1557846647,
                predicate: "channelAdminLogEventActionParticipantJoinByInvite",
                params: [{
                    name: "invite",
                    type: "ExportedChatInvite"
                }],
                type: "ChannelAdminLogEventAction"
            }, {
                id: 1515256996,
                predicate: "channelAdminLogEventActionExportedInviteDelete",
                params: [{
                    name: "invite",
                    type: "ExportedChatInvite"
                }],
                type: "ChannelAdminLogEventAction"
            }, {
                id: 1091179342,
                predicate: "channelAdminLogEventActionExportedInviteRevoke",
                params: [{
                    name: "invite",
                    type: "ExportedChatInvite"
                }],
                type: "ChannelAdminLogEventAction"
            }, {
                id: -384910503,
                predicate: "channelAdminLogEventActionExportedInviteEdit",
                params: [{
                    name: "prev_invite",
                    type: "ExportedChatInvite"
                }, {
                    name: "new_invite",
                    type: "ExportedChatInvite"
                }],
                type: "ChannelAdminLogEventAction"
            }, {
                id: 1048537159,
                predicate: "channelAdminLogEventActionParticipantVolume",
                params: [{
                    name: "participant",
                    type: "GroupCallParticipant"
                }],
                type: "ChannelAdminLogEventAction"
            }, {
                id: 1855199800,
                predicate: "channelAdminLogEventActionChangeHistoryTTL",
                params: [{
                    name: "prev_value",
                    type: "int"
                }, {
                    name: "new_value",
                    type: "int"
                }],
                type: "ChannelAdminLogEventAction"
            }, {
                id: -26672755,
                predicate: "channelAdminLogEventActionChangeTheme",
                params: [{
                    name: "prev_value",
                    type: "string"
                }, {
                    name: "new_value",
                    type: "string"
                }],
                type: "ChannelAdminLogEventAction"
            }, {
                id: 531458253,
                predicate: "channelAdminLogEvent",
                params: [{
                    name: "id",
                    type: "long"
                }, {
                    name: "date",
                    type: "int"
                }, {
                    name: "user_id",
                    type: "long"
                }, {
                    name: "action",
                    type: "ChannelAdminLogEventAction"
                }],
                type: "ChannelAdminLogEvent"
            }, {
                id: -309659827,
                predicate: "channels.adminLogResults",
                params: [{
                    name: "events",
                    type: "Vector<ChannelAdminLogEvent>"
                }, {
                    name: "chats",
                    type: "Vector<Chat>"
                }, {
                    name: "users",
                    type: "Vector<User>"
                }],
                type: "channels.AdminLogResults"
            }, {
                id: -368018716,
                predicate: "channelAdminLogEventsFilter",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "join",
                    type: "flags.0?true"
                }, {
                    name: "leave",
                    type: "flags.1?true"
                }, {
                    name: "invite",
                    type: "flags.2?true"
                }, {
                    name: "ban",
                    type: "flags.3?true"
                }, {
                    name: "unban",
                    type: "flags.4?true"
                }, {
                    name: "kick",
                    type: "flags.5?true"
                }, {
                    name: "unkick",
                    type: "flags.6?true"
                }, {
                    name: "promote",
                    type: "flags.7?true"
                }, {
                    name: "demote",
                    type: "flags.8?true"
                }, {
                    name: "info",
                    type: "flags.9?true"
                }, {
                    name: "settings",
                    type: "flags.10?true"
                }, {
                    name: "pinned",
                    type: "flags.11?true"
                }, {
                    name: "edit",
                    type: "flags.12?true"
                }, {
                    name: "delete",
                    type: "flags.13?true"
                }, {
                    name: "group_call",
                    type: "flags.14?true"
                }, {
                    name: "invites",
                    type: "flags.15?true"
                }],
                type: "ChannelAdminLogEventsFilter"
            }, {
                id: 1558266229,
                predicate: "popularContact",
                params: [{
                    name: "client_id",
                    type: "long"
                }, {
                    name: "importers",
                    type: "int"
                }],
                type: "PopularContact"
            }, {
                id: -1634752813,
                predicate: "messages.favedStickersNotModified",
                params: [],
                type: "messages.FavedStickers"
            }, {
                id: 750063767,
                predicate: "messages.favedStickers",
                params: [{
                    name: "hash",
                    type: "long"
                }, {
                    name: "packs",
                    type: "Vector<StickerPack>"
                }, {
                    name: "stickers",
                    type: "Vector<Document>"
                }],
                type: "messages.FavedStickers"
            }, {
                id: 1189204285,
                predicate: "recentMeUrlUnknown",
                params: [{
                    name: "url",
                    type: "string"
                }],
                type: "RecentMeUrl"
            }, {
                id: -1188296222,
                predicate: "recentMeUrlUser",
                params: [{
                    name: "url",
                    type: "string"
                }, {
                    name: "user_id",
                    type: "long"
                }],
                type: "RecentMeUrl"
            }, {
                id: -1294306862,
                predicate: "recentMeUrlChat",
                params: [{
                    name: "url",
                    type: "string"
                }, {
                    name: "chat_id",
                    type: "long"
                }],
                type: "RecentMeUrl"
            }, {
                id: -347535331,
                predicate: "recentMeUrlChatInvite",
                params: [{
                    name: "url",
                    type: "string"
                }, {
                    name: "chat_invite",
                    type: "ChatInvite"
                }],
                type: "RecentMeUrl"
            }, {
                id: -1140172836,
                predicate: "recentMeUrlStickerSet",
                params: [{
                    name: "url",
                    type: "string"
                }, {
                    name: "set",
                    type: "StickerSetCovered"
                }],
                type: "RecentMeUrl"
            }, {
                id: 235081943,
                predicate: "help.recentMeUrls",
                params: [{
                    name: "urls",
                    type: "Vector<RecentMeUrl>"
                }, {
                    name: "chats",
                    type: "Vector<Chat>"
                }, {
                    name: "users",
                    type: "Vector<User>"
                }],
                type: "help.RecentMeUrls"
            }, {
                id: 482797855,
                predicate: "inputSingleMedia",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "media",
                    type: "InputMedia"
                }, {
                    name: "random_id",
                    type: "long"
                }, {
                    name: "message",
                    type: "string"
                }, {
                    name: "entities",
                    type: "flags.0?Vector<MessageEntity>"
                }],
                type: "InputSingleMedia"
            }, {
                id: -1493633966,
                predicate: "webAuthorization",
                params: [{
                    name: "hash",
                    type: "long"
                }, {
                    name: "bot_id",
                    type: "long"
                }, {
                    name: "domain",
                    type: "string"
                }, {
                    name: "browser",
                    type: "string"
                }, {
                    name: "platform",
                    type: "string"
                }, {
                    name: "date_created",
                    type: "int"
                }, {
                    name: "date_active",
                    type: "int"
                }, {
                    name: "ip",
                    type: "string"
                }, {
                    name: "region",
                    type: "string"
                }],
                type: "WebAuthorization"
            }, {
                id: -313079300,
                predicate: "account.webAuthorizations",
                params: [{
                    name: "authorizations",
                    type: "Vector<WebAuthorization>"
                }, {
                    name: "users",
                    type: "Vector<User>"
                }],
                type: "account.WebAuthorizations"
            }, {
                id: -1502174430,
                predicate: "inputMessageID",
                params: [{
                    name: "id",
                    type: "int"
                }],
                type: "InputMessage"
            }, {
                id: -1160215659,
                predicate: "inputMessageReplyTo",
                params: [{
                    name: "id",
                    type: "int"
                }],
                type: "InputMessage"
            }, {
                id: -2037963464,
                predicate: "inputMessagePinned",
                params: [],
                type: "InputMessage"
            }, {
                id: -1392895362,
                predicate: "inputMessageCallbackQuery",
                params: [{
                    name: "id",
                    type: "int"
                }, {
                    name: "query_id",
                    type: "long"
                }],
                type: "InputMessage"
            }, {
                id: -55902537,
                predicate: "inputDialogPeer",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }],
                type: "InputDialogPeer"
            }, {
                id: 1684014375,
                predicate: "inputDialogPeerFolder",
                params: [{
                    name: "folder_id",
                    type: "int"
                }],
                type: "InputDialogPeer"
            }, {
                id: -445792507,
                predicate: "dialogPeer",
                params: [{
                    name: "peer",
                    type: "Peer"
                }],
                type: "DialogPeer"
            }, {
                id: 1363483106,
                predicate: "dialogPeerFolder",
                params: [{
                    name: "folder_id",
                    type: "int"
                }],
                type: "DialogPeer"
            }, {
                id: 223655517,
                predicate: "messages.foundStickerSetsNotModified",
                params: [],
                type: "messages.FoundStickerSets"
            }, {
                id: -1963942446,
                predicate: "messages.foundStickerSets",
                params: [{
                    name: "hash",
                    type: "long"
                }, {
                    name: "sets",
                    type: "Vector<StickerSetCovered>"
                }],
                type: "messages.FoundStickerSets"
            }, {
                id: 1648543603,
                predicate: "fileHash",
                params: [{
                    name: "offset",
                    type: "int"
                }, {
                    name: "limit",
                    type: "int"
                }, {
                    name: "hash",
                    type: "bytes"
                }],
                type: "FileHash"
            }, {
                id: 1968737087,
                predicate: "inputClientProxy",
                params: [{
                    name: "address",
                    type: "string"
                }, {
                    name: "port",
                    type: "int"
                }],
                type: "InputClientProxy"
            }, {
                id: -483352705,
                predicate: "help.termsOfServiceUpdateEmpty",
                params: [{
                    name: "expires",
                    type: "int"
                }],
                type: "help.TermsOfServiceUpdate"
            }, {
                id: 686618977,
                predicate: "help.termsOfServiceUpdate",
                params: [{
                    name: "expires",
                    type: "int"
                }, {
                    name: "terms_of_service",
                    type: "help.TermsOfService"
                }],
                type: "help.TermsOfServiceUpdate"
            }, {
                id: 859091184,
                predicate: "inputSecureFileUploaded",
                params: [{
                    name: "id",
                    type: "long"
                }, {
                    name: "parts",
                    type: "int"
                }, {
                    name: "md5_checksum",
                    type: "string"
                }, {
                    name: "file_hash",
                    type: "bytes"
                }, {
                    name: "secret",
                    type: "bytes"
                }],
                type: "InputSecureFile"
            }, {
                id: 1399317950,
                predicate: "inputSecureFile",
                params: [{
                    name: "id",
                    type: "long"
                }, {
                    name: "access_hash",
                    type: "long"
                }],
                type: "InputSecureFile"
            }, {
                id: 1679398724,
                predicate: "secureFileEmpty",
                params: [],
                type: "SecureFile"
            }, {
                id: -534283678,
                predicate: "secureFile",
                params: [{
                    name: "id",
                    type: "long"
                }, {
                    name: "access_hash",
                    type: "long"
                }, {
                    name: "size",
                    type: "int"
                }, {
                    name: "dc_id",
                    type: "int"
                }, {
                    name: "date",
                    type: "int"
                }, {
                    name: "file_hash",
                    type: "bytes"
                }, {
                    name: "secret",
                    type: "bytes"
                }],
                type: "SecureFile"
            }, {
                id: -1964327229,
                predicate: "secureData",
                params: [{
                    name: "data",
                    type: "bytes"
                }, {
                    name: "data_hash",
                    type: "bytes"
                }, {
                    name: "secret",
                    type: "bytes"
                }],
                type: "SecureData"
            }, {
                id: 2103482845,
                predicate: "securePlainPhone",
                params: [{
                    name: "phone",
                    type: "string"
                }],
                type: "SecurePlainData"
            }, {
                id: 569137759,
                predicate: "securePlainEmail",
                params: [{
                    name: "email",
                    type: "string"
                }],
                type: "SecurePlainData"
            }, {
                id: -1658158621,
                predicate: "secureValueTypePersonalDetails",
                params: [],
                type: "SecureValueType"
            }, {
                id: 1034709504,
                predicate: "secureValueTypePassport",
                params: [],
                type: "SecureValueType"
            }, {
                id: 115615172,
                predicate: "secureValueTypeDriverLicense",
                params: [],
                type: "SecureValueType"
            }, {
                id: -1596951477,
                predicate: "secureValueTypeIdentityCard",
                params: [],
                type: "SecureValueType"
            }, {
                id: -1717268701,
                predicate: "secureValueTypeInternalPassport",
                params: [],
                type: "SecureValueType"
            }, {
                id: -874308058,
                predicate: "secureValueTypeAddress",
                params: [],
                type: "SecureValueType"
            }, {
                id: -63531698,
                predicate: "secureValueTypeUtilityBill",
                params: [],
                type: "SecureValueType"
            }, {
                id: -1995211763,
                predicate: "secureValueTypeBankStatement",
                params: [],
                type: "SecureValueType"
            }, {
                id: -1954007928,
                predicate: "secureValueTypeRentalAgreement",
                params: [],
                type: "SecureValueType"
            }, {
                id: -1713143702,
                predicate: "secureValueTypePassportRegistration",
                params: [],
                type: "SecureValueType"
            }, {
                id: -368907213,
                predicate: "secureValueTypeTemporaryRegistration",
                params: [],
                type: "SecureValueType"
            }, {
                id: -1289704741,
                predicate: "secureValueTypePhone",
                params: [],
                type: "SecureValueType"
            }, {
                id: -1908627474,
                predicate: "secureValueTypeEmail",
                params: [],
                type: "SecureValueType"
            }, {
                id: 411017418,
                predicate: "secureValue",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "type",
                    type: "SecureValueType"
                }, {
                    name: "data",
                    type: "flags.0?SecureData"
                }, {
                    name: "front_side",
                    type: "flags.1?SecureFile"
                }, {
                    name: "reverse_side",
                    type: "flags.2?SecureFile"
                }, {
                    name: "selfie",
                    type: "flags.3?SecureFile"
                }, {
                    name: "translation",
                    type: "flags.6?Vector<SecureFile>"
                }, {
                    name: "files",
                    type: "flags.4?Vector<SecureFile>"
                }, {
                    name: "plain_data",
                    type: "flags.5?SecurePlainData"
                }, {
                    name: "hash",
                    type: "bytes"
                }],
                type: "SecureValue"
            }, {
                id: -618540889,
                predicate: "inputSecureValue",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "type",
                    type: "SecureValueType"
                }, {
                    name: "data",
                    type: "flags.0?SecureData"
                }, {
                    name: "front_side",
                    type: "flags.1?InputSecureFile"
                }, {
                    name: "reverse_side",
                    type: "flags.2?InputSecureFile"
                }, {
                    name: "selfie",
                    type: "flags.3?InputSecureFile"
                }, {
                    name: "translation",
                    type: "flags.6?Vector<InputSecureFile>"
                }, {
                    name: "files",
                    type: "flags.4?Vector<InputSecureFile>"
                }, {
                    name: "plain_data",
                    type: "flags.5?SecurePlainData"
                }],
                type: "InputSecureValue"
            }, {
                id: -316748368,
                predicate: "secureValueHash",
                params: [{
                    name: "type",
                    type: "SecureValueType"
                }, {
                    name: "hash",
                    type: "bytes"
                }],
                type: "SecureValueHash"
            }, {
                id: -391902247,
                predicate: "secureValueErrorData",
                params: [{
                    name: "type",
                    type: "SecureValueType"
                }, {
                    name: "data_hash",
                    type: "bytes"
                }, {
                    name: "field",
                    type: "string"
                }, {
                    name: "text",
                    type: "string"
                }],
                type: "SecureValueError"
            }, {
                id: 12467706,
                predicate: "secureValueErrorFrontSide",
                params: [{
                    name: "type",
                    type: "SecureValueType"
                }, {
                    name: "file_hash",
                    type: "bytes"
                }, {
                    name: "text",
                    type: "string"
                }],
                type: "SecureValueError"
            }, {
                id: -2037765467,
                predicate: "secureValueErrorReverseSide",
                params: [{
                    name: "type",
                    type: "SecureValueType"
                }, {
                    name: "file_hash",
                    type: "bytes"
                }, {
                    name: "text",
                    type: "string"
                }],
                type: "SecureValueError"
            }, {
                id: -449327402,
                predicate: "secureValueErrorSelfie",
                params: [{
                    name: "type",
                    type: "SecureValueType"
                }, {
                    name: "file_hash",
                    type: "bytes"
                }, {
                    name: "text",
                    type: "string"
                }],
                type: "SecureValueError"
            }, {
                id: 2054162547,
                predicate: "secureValueErrorFile",
                params: [{
                    name: "type",
                    type: "SecureValueType"
                }, {
                    name: "file_hash",
                    type: "bytes"
                }, {
                    name: "text",
                    type: "string"
                }],
                type: "SecureValueError"
            }, {
                id: 1717706985,
                predicate: "secureValueErrorFiles",
                params: [{
                    name: "type",
                    type: "SecureValueType"
                }, {
                    name: "file_hash",
                    type: "Vector<bytes>"
                }, {
                    name: "text",
                    type: "string"
                }],
                type: "SecureValueError"
            }, {
                id: -2036501105,
                predicate: "secureValueError",
                params: [{
                    name: "type",
                    type: "SecureValueType"
                }, {
                    name: "hash",
                    type: "bytes"
                }, {
                    name: "text",
                    type: "string"
                }],
                type: "SecureValueError"
            }, {
                id: -1592506512,
                predicate: "secureValueErrorTranslationFile",
                params: [{
                    name: "type",
                    type: "SecureValueType"
                }, {
                    name: "file_hash",
                    type: "bytes"
                }, {
                    name: "text",
                    type: "string"
                }],
                type: "SecureValueError"
            }, {
                id: 878931416,
                predicate: "secureValueErrorTranslationFiles",
                params: [{
                    name: "type",
                    type: "SecureValueType"
                }, {
                    name: "file_hash",
                    type: "Vector<bytes>"
                }, {
                    name: "text",
                    type: "string"
                }],
                type: "SecureValueError"
            }, {
                id: 871426631,
                predicate: "secureCredentialsEncrypted",
                params: [{
                    name: "data",
                    type: "bytes"
                }, {
                    name: "hash",
                    type: "bytes"
                }, {
                    name: "secret",
                    type: "bytes"
                }],
                type: "SecureCredentialsEncrypted"
            }, {
                id: -1389486888,
                predicate: "account.authorizationForm",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "required_types",
                    type: "Vector<SecureRequiredType>"
                }, {
                    name: "values",
                    type: "Vector<SecureValue>"
                }, {
                    name: "errors",
                    type: "Vector<SecureValueError>"
                }, {
                    name: "users",
                    type: "Vector<User>"
                }, {
                    name: "privacy_policy_url",
                    type: "flags.0?string"
                }],
                type: "account.AuthorizationForm"
            }, {
                id: -2128640689,
                predicate: "account.sentEmailCode",
                params: [{
                    name: "email_pattern",
                    type: "string"
                }, {
                    name: "length",
                    type: "int"
                }],
                type: "account.SentEmailCode"
            }, {
                id: 1722786150,
                predicate: "help.deepLinkInfoEmpty",
                params: [],
                type: "help.DeepLinkInfo"
            }, {
                id: 1783556146,
                predicate: "help.deepLinkInfo",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "update_app",
                    type: "flags.0?true"
                }, {
                    name: "message",
                    type: "string"
                }, {
                    name: "entities",
                    type: "flags.1?Vector<MessageEntity>"
                }],
                type: "help.DeepLinkInfo"
            }, {
                id: 289586518,
                predicate: "savedPhoneContact",
                params: [{
                    name: "phone",
                    type: "string"
                }, {
                    name: "first_name",
                    type: "string"
                }, {
                    name: "last_name",
                    type: "string"
                }, {
                    name: "date",
                    type: "int"
                }],
                type: "SavedContact"
            }, {
                id: 1304052993,
                predicate: "account.takeout",
                params: [{
                    name: "id",
                    type: "long"
                }],
                type: "account.Takeout"
            }, {
                id: -732254058,
                predicate: "passwordKdfAlgoUnknown",
                params: [],
                type: "PasswordKdfAlgo"
            }, {
                id: 982592842,
                predicate: "passwordKdfAlgoSHA256SHA256PBKDF2HMACSHA512iter100000SHA256ModPow",
                params: [{
                    name: "salt1",
                    type: "bytes"
                }, {
                    name: "salt2",
                    type: "bytes"
                }, {
                    name: "g",
                    type: "int"
                }, {
                    name: "p",
                    type: "bytes"
                }],
                type: "PasswordKdfAlgo"
            }, {
                id: 4883767,
                predicate: "securePasswordKdfAlgoUnknown",
                params: [],
                type: "SecurePasswordKdfAlgo"
            }, {
                id: -1141711456,
                predicate: "securePasswordKdfAlgoPBKDF2HMACSHA512iter100000",
                params: [{
                    name: "salt",
                    type: "bytes"
                }],
                type: "SecurePasswordKdfAlgo"
            }, {
                id: -2042159726,
                predicate: "securePasswordKdfAlgoSHA512",
                params: [{
                    name: "salt",
                    type: "bytes"
                }],
                type: "SecurePasswordKdfAlgo"
            }, {
                id: 354925740,
                predicate: "secureSecretSettings",
                params: [{
                    name: "secure_algo",
                    type: "SecurePasswordKdfAlgo"
                }, {
                    name: "secure_secret",
                    type: "bytes"
                }, {
                    name: "secure_secret_id",
                    type: "long"
                }],
                type: "SecureSecretSettings"
            }, {
                id: -1736378792,
                predicate: "inputCheckPasswordEmpty",
                params: [],
                type: "InputCheckPasswordSRP"
            }, {
                id: -763367294,
                predicate: "inputCheckPasswordSRP",
                params: [{
                    name: "srp_id",
                    type: "long"
                }, {
                    name: "A",
                    type: "bytes"
                }, {
                    name: "M1",
                    type: "bytes"
                }],
                type: "InputCheckPasswordSRP"
            }, {
                id: -2103600678,
                predicate: "secureRequiredType",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "native_names",
                    type: "flags.0?true"
                }, {
                    name: "selfie_required",
                    type: "flags.1?true"
                }, {
                    name: "translation_required",
                    type: "flags.2?true"
                }, {
                    name: "type",
                    type: "SecureValueType"
                }],
                type: "SecureRequiredType"
            }, {
                id: 41187252,
                predicate: "secureRequiredTypeOneOf",
                params: [{
                    name: "types",
                    type: "Vector<SecureRequiredType>"
                }],
                type: "SecureRequiredType"
            }, {
                id: -1078332329,
                predicate: "help.passportConfigNotModified",
                params: [],
                type: "help.PassportConfig"
            }, {
                id: -1600596305,
                predicate: "help.passportConfig",
                params: [{
                    name: "hash",
                    type: "int"
                }, {
                    name: "countries_langs",
                    type: "DataJSON"
                }],
                type: "help.PassportConfig"
            }, {
                id: 488313413,
                predicate: "inputAppEvent",
                params: [{
                    name: "time",
                    type: "double"
                }, {
                    name: "type",
                    type: "string"
                }, {
                    name: "peer",
                    type: "long"
                }, {
                    name: "data",
                    type: "JSONValue"
                }],
                type: "InputAppEvent"
            }, {
                id: -1059185703,
                predicate: "jsonObjectValue",
                params: [{
                    name: "key",
                    type: "string"
                }, {
                    name: "value",
                    type: "JSONValue"
                }],
                type: "JSONObjectValue"
            }, {
                id: 1064139624,
                predicate: "jsonNull",
                params: [],
                type: "JSONValue"
            }, {
                id: -952869270,
                predicate: "jsonBool",
                params: [{
                    name: "value",
                    type: "Bool"
                }],
                type: "JSONValue"
            }, {
                id: 736157604,
                predicate: "jsonNumber",
                params: [{
                    name: "value",
                    type: "double"
                }],
                type: "JSONValue"
            }, {
                id: -1222740358,
                predicate: "jsonString",
                params: [{
                    name: "value",
                    type: "string"
                }],
                type: "JSONValue"
            }, {
                id: -146520221,
                predicate: "jsonArray",
                params: [{
                    name: "value",
                    type: "Vector<JSONValue>"
                }],
                type: "JSONValue"
            }, {
                id: -1715350371,
                predicate: "jsonObject",
                params: [{
                    name: "value",
                    type: "Vector<JSONObjectValue>"
                }],
                type: "JSONValue"
            }, {
                id: 878078826,
                predicate: "pageTableCell",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "header",
                    type: "flags.0?true"
                }, {
                    name: "align_center",
                    type: "flags.3?true"
                }, {
                    name: "align_right",
                    type: "flags.4?true"
                }, {
                    name: "valign_middle",
                    type: "flags.5?true"
                }, {
                    name: "valign_bottom",
                    type: "flags.6?true"
                }, {
                    name: "text",
                    type: "flags.7?RichText"
                }, {
                    name: "colspan",
                    type: "flags.1?int"
                }, {
                    name: "rowspan",
                    type: "flags.2?int"
                }],
                type: "PageTableCell"
            }, {
                id: -524237339,
                predicate: "pageTableRow",
                params: [{
                    name: "cells",
                    type: "Vector<PageTableCell>"
                }],
                type: "PageTableRow"
            }, {
                id: 1869903447,
                predicate: "pageCaption",
                params: [{
                    name: "text",
                    type: "RichText"
                }, {
                    name: "credit",
                    type: "RichText"
                }],
                type: "PageCaption"
            }, {
                id: -1188055347,
                predicate: "pageListItemText",
                params: [{
                    name: "text",
                    type: "RichText"
                }],
                type: "PageListItem"
            }, {
                id: 635466748,
                predicate: "pageListItemBlocks",
                params: [{
                    name: "blocks",
                    type: "Vector<PageBlock>"
                }],
                type: "PageListItem"
            }, {
                id: 1577484359,
                predicate: "pageListOrderedItemText",
                params: [{
                    name: "num",
                    type: "string"
                }, {
                    name: "text",
                    type: "RichText"
                }],
                type: "PageListOrderedItem"
            }, {
                id: -1730311882,
                predicate: "pageListOrderedItemBlocks",
                params: [{
                    name: "num",
                    type: "string"
                }, {
                    name: "blocks",
                    type: "Vector<PageBlock>"
                }],
                type: "PageListOrderedItem"
            }, {
                id: -1282352120,
                predicate: "pageRelatedArticle",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "url",
                    type: "string"
                }, {
                    name: "webpage_id",
                    type: "long"
                }, {
                    name: "title",
                    type: "flags.0?string"
                }, {
                    name: "description",
                    type: "flags.1?string"
                }, {
                    name: "photo_id",
                    type: "flags.2?long"
                }, {
                    name: "author",
                    type: "flags.3?string"
                }, {
                    name: "published_date",
                    type: "flags.4?int"
                }],
                type: "PageRelatedArticle"
            }, {
                id: -1738178803,
                predicate: "page",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "part",
                    type: "flags.0?true"
                }, {
                    name: "rtl",
                    type: "flags.1?true"
                }, {
                    name: "v2",
                    type: "flags.2?true"
                }, {
                    name: "url",
                    type: "string"
                }, {
                    name: "blocks",
                    type: "Vector<PageBlock>"
                }, {
                    name: "photos",
                    type: "Vector<Photo>"
                }, {
                    name: "documents",
                    type: "Vector<Document>"
                }, {
                    name: "views",
                    type: "flags.3?int"
                }],
                type: "Page"
            }, {
                id: -1945767479,
                predicate: "help.supportName",
                params: [{
                    name: "name",
                    type: "string"
                }],
                type: "help.SupportName"
            }, {
                id: -206688531,
                predicate: "help.userInfoEmpty",
                params: [],
                type: "help.UserInfo"
            }, {
                id: 32192344,
                predicate: "help.userInfo",
                params: [{
                    name: "message",
                    type: "string"
                }, {
                    name: "entities",
                    type: "Vector<MessageEntity>"
                }, {
                    name: "author",
                    type: "string"
                }, {
                    name: "date",
                    type: "int"
                }],
                type: "help.UserInfo"
            }, {
                id: 1823064809,
                predicate: "pollAnswer",
                params: [{
                    name: "text",
                    type: "string"
                }, {
                    name: "option",
                    type: "bytes"
                }],
                type: "PollAnswer"
            }, {
                id: -2032041631,
                predicate: "poll",
                params: [{
                    name: "id",
                    type: "long"
                }, {
                    name: "flags",
                    type: "#"
                }, {
                    name: "closed",
                    type: "flags.0?true"
                }, {
                    name: "public_voters",
                    type: "flags.1?true"
                }, {
                    name: "multiple_choice",
                    type: "flags.2?true"
                }, {
                    name: "quiz",
                    type: "flags.3?true"
                }, {
                    name: "question",
                    type: "string"
                }, {
                    name: "answers",
                    type: "Vector<PollAnswer>"
                }, {
                    name: "close_period",
                    type: "flags.4?int"
                }, {
                    name: "close_date",
                    type: "flags.5?int"
                }],
                type: "Poll"
            }, {
                id: 997055186,
                predicate: "pollAnswerVoters",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "chosen",
                    type: "flags.0?true"
                }, {
                    name: "correct",
                    type: "flags.1?true"
                }, {
                    name: "option",
                    type: "bytes"
                }, {
                    name: "voters",
                    type: "int"
                }],
                type: "PollAnswerVoters"
            }, {
                id: -591909213,
                predicate: "pollResults",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "min",
                    type: "flags.0?true"
                }, {
                    name: "results",
                    type: "flags.1?Vector<PollAnswerVoters>"
                }, {
                    name: "total_voters",
                    type: "flags.2?int"
                }, {
                    name: "recent_voters",
                    type: "flags.3?Vector<long>"
                }, {
                    name: "solution",
                    type: "flags.4?string"
                }, {
                    name: "solution_entities",
                    type: "flags.4?Vector<MessageEntity>"
                }],
                type: "PollResults"
            }, {
                id: -264117680,
                predicate: "chatOnlines",
                params: [{
                    name: "onlines",
                    type: "int"
                }],
                type: "ChatOnlines"
            }, {
                id: 1202287072,
                predicate: "statsURL",
                params: [{
                    name: "url",
                    type: "string"
                }],
                type: "StatsURL"
            }, {
                id: 1605510357,
                predicate: "chatAdminRights",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "change_info",
                    type: "flags.0?true"
                }, {
                    name: "post_messages",
                    type: "flags.1?true"
                }, {
                    name: "edit_messages",
                    type: "flags.2?true"
                }, {
                    name: "delete_messages",
                    type: "flags.3?true"
                }, {
                    name: "ban_users",
                    type: "flags.4?true"
                }, {
                    name: "invite_users",
                    type: "flags.5?true"
                }, {
                    name: "pin_messages",
                    type: "flags.7?true"
                }, {
                    name: "add_admins",
                    type: "flags.9?true"
                }, {
                    name: "anonymous",
                    type: "flags.10?true"
                }, {
                    name: "manage_call",
                    type: "flags.11?true"
                }, {
                    name: "other",
                    type: "flags.12?true"
                }, {
                    name: "post_live",
                    type: "flags.20?true"
                }],
                type: "ChatAdminRights"
            }, {
                id: -1626209256,
                predicate: "chatBannedRights",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "view_messages",
                    type: "flags.0?true"
                }, {
                    name: "send_messages",
                    type: "flags.1?true"
                }, {
                    name: "send_media",
                    type: "flags.2?true"
                }, {
                    name: "send_stickers",
                    type: "flags.3?true"
                }, {
                    name: "send_gifs",
                    type: "flags.4?true"
                }, {
                    name: "send_games",
                    type: "flags.5?true"
                }, {
                    name: "send_inline",
                    type: "flags.6?true"
                }, {
                    name: "send_polls",
                    type: "flags.8?true"
                }, {
                    name: "change_info",
                    type: "flags.10?true"
                }, {
                    name: "embed_links",
                    type: "flags.12?true"
                }, {
                    name: "view_participants",
                    type: "flags.13?true"
                }, {
                    name: "invite_users",
                    type: "flags.15?true"
                }, {
                    name: "pin_messages",
                    type: "flags.17?true"
                }, {
                    name: "send_forwarded_messages",
                    type: "flags.11?true"
                }, {
                    name: "until_date",
                    type: "int"
                }],
                type: "ChatBannedRights"
            }, {
                id: -433014407,
                predicate: "inputWallPaper",
                params: [{
                    name: "id",
                    type: "long"
                }, {
                    name: "access_hash",
                    type: "long"
                }],
                type: "InputWallPaper"
            }, {
                id: 1913199744,
                predicate: "inputWallPaperSlug",
                params: [{
                    name: "slug",
                    type: "string"
                }],
                type: "InputWallPaper"
            }, {
                id: -1770371538,
                predicate: "inputWallPaperNoFile",
                params: [{
                    name: "id",
                    type: "long"
                }],
                type: "InputWallPaper"
            }, {
                id: 471437699,
                predicate: "account.wallPapersNotModified",
                params: [],
                type: "account.WallPapers"
            }, {
                id: -842824308,
                predicate: "account.wallPapers",
                params: [{
                    name: "hash",
                    type: "long"
                }, {
                    name: "wallpapers",
                    type: "Vector<WallPaper>"
                }],
                type: "account.WallPapers"
            }, {
                id: -557924733,
                predicate: "codeSettings",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "allow_flashcall",
                    type: "flags.0?true"
                }, {
                    name: "current_number",
                    type: "flags.1?true"
                }, {
                    name: "allow_app_hash",
                    type: "flags.4?true"
                }],
                type: "CodeSettings"
            }, {
                id: 499236004,
                predicate: "wallPaperSettings",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "blur",
                    type: "flags.1?true"
                }, {
                    name: "motion",
                    type: "flags.2?true"
                }, {
                    name: "background_color",
                    type: "flags.0?int"
                }, {
                    name: "second_background_color",
                    type: "flags.4?int"
                }, {
                    name: "third_background_color",
                    type: "flags.5?int"
                }, {
                    name: "fourth_background_color",
                    type: "flags.6?int"
                }, {
                    name: "intensity",
                    type: "flags.3?int"
                }, {
                    name: "rotation",
                    type: "flags.4?int"
                }],
                type: "WallPaperSettings"
            }, {
                id: -532532493,
                predicate: "autoDownloadSettings",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "disabled",
                    type: "flags.0?true"
                }, {
                    name: "video_preload_large",
                    type: "flags.1?true"
                }, {
                    name: "audio_preload_next",
                    type: "flags.2?true"
                }, {
                    name: "phonecalls_less_data",
                    type: "flags.3?true"
                }, {
                    name: "photo_size_max",
                    type: "int"
                }, {
                    name: "video_size_max",
                    type: "int"
                }, {
                    name: "file_size_max",
                    type: "int"
                }, {
                    name: "video_upload_maxbitrate",
                    type: "int"
                }],
                type: "AutoDownloadSettings"
            }, {
                id: 1674235686,
                predicate: "account.autoDownloadSettings",
                params: [{
                    name: "low",
                    type: "AutoDownloadSettings"
                }, {
                    name: "medium",
                    type: "AutoDownloadSettings"
                }, {
                    name: "high",
                    type: "AutoDownloadSettings"
                }],
                type: "account.AutoDownloadSettings"
            }, {
                id: -709641735,
                predicate: "emojiKeyword",
                params: [{
                    name: "keyword",
                    type: "string"
                }, {
                    name: "emoticons",
                    type: "Vector<string>"
                }],
                type: "EmojiKeyword"
            }, {
                id: 594408994,
                predicate: "emojiKeywordDeleted",
                params: [{
                    name: "keyword",
                    type: "string"
                }, {
                    name: "emoticons",
                    type: "Vector<string>"
                }],
                type: "EmojiKeyword"
            }, {
                id: 1556570557,
                predicate: "emojiKeywordsDifference",
                params: [{
                    name: "lang_code",
                    type: "string"
                }, {
                    name: "from_version",
                    type: "int"
                }, {
                    name: "version",
                    type: "int"
                }, {
                    name: "keywords",
                    type: "Vector<EmojiKeyword>"
                }],
                type: "EmojiKeywordsDifference"
            }, {
                id: -1519029347,
                predicate: "emojiURL",
                params: [{
                    name: "url",
                    type: "string"
                }],
                type: "EmojiURL"
            }, {
                id: -1275374751,
                predicate: "emojiLanguage",
                params: [{
                    name: "lang_code",
                    type: "string"
                }],
                type: "EmojiLanguage"
            }, {
                id: -11252123,
                predicate: "folder",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "autofill_new_broadcasts",
                    type: "flags.0?true"
                }, {
                    name: "autofill_public_groups",
                    type: "flags.1?true"
                }, {
                    name: "autofill_new_correspondents",
                    type: "flags.2?true"
                }, {
                    name: "id",
                    type: "int"
                }, {
                    name: "title",
                    type: "string"
                }, {
                    name: "photo",
                    type: "flags.3?ChatPhoto"
                }],
                type: "Folder"
            }, {
                id: -70073706,
                predicate: "inputFolderPeer",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "folder_id",
                    type: "int"
                }],
                type: "InputFolderPeer"
            }, {
                id: -373643672,
                predicate: "folderPeer",
                params: [{
                    name: "peer",
                    type: "Peer"
                }, {
                    name: "folder_id",
                    type: "int"
                }],
                type: "FolderPeer"
            }, {
                id: -398136321,
                predicate: "messages.searchCounter",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "inexact",
                    type: "flags.1?true"
                }, {
                    name: "filter",
                    type: "MessagesFilter"
                }, {
                    name: "count",
                    type: "int"
                }],
                type: "messages.SearchCounter"
            }, {
                id: -1831650802,
                predicate: "urlAuthResultRequest",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "request_write_access",
                    type: "flags.0?true"
                }, {
                    name: "bot",
                    type: "User"
                }, {
                    name: "domain",
                    type: "string"
                }],
                type: "UrlAuthResult"
            }, {
                id: -1886646706,
                predicate: "urlAuthResultAccepted",
                params: [{
                    name: "url",
                    type: "string"
                }],
                type: "UrlAuthResult"
            }, {
                id: -1445536993,
                predicate: "urlAuthResultDefault",
                params: [],
                type: "UrlAuthResult"
            }, {
                id: -1078612597,
                predicate: "channelLocationEmpty",
                params: [],
                type: "ChannelLocation"
            }, {
                id: 547062491,
                predicate: "channelLocation",
                params: [{
                    name: "geo_point",
                    type: "GeoPoint"
                }, {
                    name: "address",
                    type: "string"
                }],
                type: "ChannelLocation"
            }, {
                id: -901375139,
                predicate: "peerLocated",
                params: [{
                    name: "peer",
                    type: "Peer"
                }, {
                    name: "expires",
                    type: "int"
                }, {
                    name: "distance",
                    type: "int"
                }],
                type: "PeerLocated"
            }, {
                id: -118740917,
                predicate: "peerSelfLocated",
                params: [{
                    name: "expires",
                    type: "int"
                }],
                type: "PeerLocated"
            }, {
                id: -797791052,
                predicate: "restrictionReason",
                params: [{
                    name: "platform",
                    type: "string"
                }, {
                    name: "reason",
                    type: "string"
                }, {
                    name: "text",
                    type: "string"
                }],
                type: "RestrictionReason"
            }, {
                id: 1012306921,
                predicate: "inputTheme",
                params: [{
                    name: "id",
                    type: "long"
                }, {
                    name: "access_hash",
                    type: "long"
                }],
                type: "InputTheme"
            }, {
                id: -175567375,
                predicate: "inputThemeSlug",
                params: [{
                    name: "slug",
                    type: "string"
                }],
                type: "InputTheme"
            }, {
                id: -402474788,
                predicate: "theme",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "creator",
                    type: "flags.0?true"
                }, {
                    name: "default",
                    type: "flags.1?true"
                }, {
                    name: "for_chat",
                    type: "flags.5?true"
                }, {
                    name: "id",
                    type: "long"
                }, {
                    name: "access_hash",
                    type: "long"
                }, {
                    name: "slug",
                    type: "string"
                }, {
                    name: "title",
                    type: "string"
                }, {
                    name: "document",
                    type: "flags.2?Document"
                }, {
                    name: "settings",
                    type: "flags.3?ThemeSettings"
                }, {
                    name: "installs_count",
                    type: "flags.4?int"
                }],
                type: "Theme"
            }, {
                id: -199313886,
                predicate: "account.themesNotModified",
                params: [],
                type: "account.Themes"
            }, {
                id: -1707242387,
                predicate: "account.themes",
                params: [{
                    name: "hash",
                    type: "long"
                }, {
                    name: "themes",
                    type: "Vector<Theme>"
                }],
                type: "account.Themes"
            }, {
                id: 1654593920,
                predicate: "auth.loginToken",
                params: [{
                    name: "expires",
                    type: "int"
                }, {
                    name: "token",
                    type: "bytes"
                }],
                type: "auth.LoginToken"
            }, {
                id: 110008598,
                predicate: "auth.loginTokenMigrateTo",
                params: [{
                    name: "dc_id",
                    type: "int"
                }, {
                    name: "token",
                    type: "bytes"
                }],
                type: "auth.LoginToken"
            }, {
                id: 957176926,
                predicate: "auth.loginTokenSuccess",
                params: [{
                    name: "authorization",
                    type: "auth.Authorization"
                }],
                type: "auth.LoginToken"
            }, {
                id: 1474462241,
                predicate: "account.contentSettings",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "sensitive_enabled",
                    type: "flags.0?true"
                }, {
                    name: "sensitive_can_change",
                    type: "flags.1?true"
                }],
                type: "account.ContentSettings"
            }, {
                id: -1456996667,
                predicate: "messages.inactiveChats",
                params: [{
                    name: "dates",
                    type: "Vector<int>"
                }, {
                    name: "chats",
                    type: "Vector<Chat>"
                }, {
                    name: "users",
                    type: "Vector<User>"
                }],
                type: "messages.InactiveChats"
            }, {
                id: -1012849566,
                predicate: "baseThemeClassic",
                params: [],
                type: "BaseTheme"
            }, {
                id: -69724536,
                predicate: "baseThemeDay",
                params: [],
                type: "BaseTheme"
            }, {
                id: -1212997976,
                predicate: "baseThemeNight",
                params: [],
                type: "BaseTheme"
            }, {
                id: 1834973166,
                predicate: "baseThemeTinted",
                params: [],
                type: "BaseTheme"
            }, {
                id: 1527845466,
                predicate: "baseThemeArctic",
                params: [],
                type: "BaseTheme"
            }, {
                id: -1881255857,
                predicate: "inputThemeSettings",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "message_colors_animated",
                    type: "flags.2?true"
                }, {
                    name: "base_theme",
                    type: "BaseTheme"
                }, {
                    name: "accent_color",
                    type: "int"
                }, {
                    name: "outbox_accent_color",
                    type: "flags.3?int"
                }, {
                    name: "message_colors",
                    type: "flags.0?Vector<int>"
                }, {
                    name: "wallpaper",
                    type: "flags.1?InputWallPaper"
                }, {
                    name: "wallpaper_settings",
                    type: "flags.1?WallPaperSettings"
                }],
                type: "InputThemeSettings"
            }, {
                id: -94849324,
                predicate: "themeSettings",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "message_colors_animated",
                    type: "flags.2?true"
                }, {
                    name: "base_theme",
                    type: "BaseTheme"
                }, {
                    name: "accent_color",
                    type: "int"
                }, {
                    name: "outbox_accent_color",
                    type: "flags.3?int"
                }, {
                    name: "message_colors",
                    type: "flags.0?Vector<int>"
                }, {
                    name: "wallpaper",
                    type: "flags.1?WallPaper"
                }],
                type: "ThemeSettings"
            }, {
                id: 1421174295,
                predicate: "webPageAttributeTheme",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "documents",
                    type: "flags.0?Vector<Document>"
                }, {
                    name: "settings",
                    type: "flags.1?ThemeSettings"
                }],
                type: "WebPageAttribute"
            }, {
                id: 886196148,
                predicate: "messageUserVote",
                params: [{
                    name: "user_id",
                    type: "long"
                }, {
                    name: "option",
                    type: "bytes"
                }, {
                    name: "date",
                    type: "int"
                }],
                type: "MessageUserVote"
            }, {
                id: 1017491692,
                predicate: "messageUserVoteInputOption",
                params: [{
                    name: "user_id",
                    type: "long"
                }, {
                    name: "date",
                    type: "int"
                }],
                type: "MessageUserVote"
            }, {
                id: -1973033641,
                predicate: "messageUserVoteMultiple",
                params: [{
                    name: "user_id",
                    type: "long"
                }, {
                    name: "options",
                    type: "Vector<bytes>"
                }, {
                    name: "date",
                    type: "int"
                }],
                type: "MessageUserVote"
            }, {
                id: 136574537,
                predicate: "messages.votesList",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "count",
                    type: "int"
                }, {
                    name: "votes",
                    type: "Vector<MessageUserVote>"
                }, {
                    name: "users",
                    type: "Vector<User>"
                }, {
                    name: "next_offset",
                    type: "flags.0?string"
                }],
                type: "messages.VotesList"
            }, {
                id: -177732982,
                predicate: "bankCardOpenUrl",
                params: [{
                    name: "url",
                    type: "string"
                }, {
                    name: "name",
                    type: "string"
                }],
                type: "BankCardOpenUrl"
            }, {
                id: 1042605427,
                predicate: "payments.bankCardData",
                params: [{
                    name: "title",
                    type: "string"
                }, {
                    name: "open_urls",
                    type: "Vector<BankCardOpenUrl>"
                }],
                type: "payments.BankCardData"
            }, {
                id: 1949890536,
                predicate: "dialogFilter",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "contacts",
                    type: "flags.0?true"
                }, {
                    name: "non_contacts",
                    type: "flags.1?true"
                }, {
                    name: "groups",
                    type: "flags.2?true"
                }, {
                    name: "broadcasts",
                    type: "flags.3?true"
                }, {
                    name: "bots",
                    type: "flags.4?true"
                }, {
                    name: "admin",
                    type: "flags.5?true"
                }, {
                    name: "exclude_muted",
                    type: "flags.11?true"
                }, {
                    name: "exclude_read",
                    type: "flags.12?true"
                }, {
                    name: "exclude_archived",
                    type: "flags.13?true"
                }, {
                    name: "id",
                    type: "int"
                }, {
                    name: "title",
                    type: "string"
                }, {
                    name: "emoticon",
                    type: "flags.25?string"
                }, {
                    name: "pinned_peers",
                    type: "Vector<InputPeer>"
                }, {
                    name: "include_peers",
                    type: "Vector<InputPeer>"
                }, {
                    name: "exclude_peers",
                    type: "Vector<InputPeer>"
                }],
                type: "DialogFilter"
            }, {
                id: 2004110666,
                predicate: "dialogFilterSuggested",
                params: [{
                    name: "filter",
                    type: "DialogFilter"
                }, {
                    name: "description",
                    type: "string"
                }],
                type: "DialogFilterSuggested"
            }, {
                id: -1237848657,
                predicate: "statsDateRangeDays",
                params: [{
                    name: "min_date",
                    type: "int"
                }, {
                    name: "max_date",
                    type: "int"
                }],
                type: "StatsDateRangeDays"
            }, {
                id: -884757282,
                predicate: "statsAbsValueAndPrev",
                params: [{
                    name: "current",
                    type: "double"
                }, {
                    name: "previous",
                    type: "double"
                }],
                type: "StatsAbsValueAndPrev"
            }, {
                id: -875679776,
                predicate: "statsPercentValue",
                params: [{
                    name: "part",
                    type: "double"
                }, {
                    name: "total",
                    type: "double"
                }],
                type: "StatsPercentValue"
            }, {
                id: 1244130093,
                predicate: "statsGraphAsync",
                params: [{
                    name: "token",
                    type: "string"
                }],
                type: "StatsGraph"
            }, {
                id: -1092839390,
                predicate: "statsGraphError",
                params: [{
                    name: "error",
                    type: "string"
                }],
                type: "StatsGraph"
            }, {
                id: -1901828938,
                predicate: "statsGraph",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "json",
                    type: "DataJSON"
                }, {
                    name: "zoom_token",
                    type: "flags.0?string"
                }],
                type: "StatsGraph"
            }, {
                id: -1387279939,
                predicate: "messageInteractionCounters",
                params: [{
                    name: "msg_id",
                    type: "int"
                }, {
                    name: "views",
                    type: "int"
                }, {
                    name: "forwards",
                    type: "int"
                }],
                type: "MessageInteractionCounters"
            }, {
                id: -1107852396,
                predicate: "stats.broadcastStats",
                params: [{
                    name: "period",
                    type: "StatsDateRangeDays"
                }, {
                    name: "followers",
                    type: "StatsAbsValueAndPrev"
                }, {
                    name: "views_per_post",
                    type: "StatsAbsValueAndPrev"
                }, {
                    name: "shares_per_post",
                    type: "StatsAbsValueAndPrev"
                }, {
                    name: "enabled_notifications",
                    type: "StatsPercentValue"
                }, {
                    name: "growth_graph",
                    type: "StatsGraph"
                }, {
                    name: "followers_graph",
                    type: "StatsGraph"
                }, {
                    name: "mute_graph",
                    type: "StatsGraph"
                }, {
                    name: "top_hours_graph",
                    type: "StatsGraph"
                }, {
                    name: "interactions_graph",
                    type: "StatsGraph"
                }, {
                    name: "iv_interactions_graph",
                    type: "StatsGraph"
                }, {
                    name: "views_by_source_graph",
                    type: "StatsGraph"
                }, {
                    name: "new_followers_by_source_graph",
                    type: "StatsGraph"
                }, {
                    name: "languages_graph",
                    type: "StatsGraph"
                }, {
                    name: "recent_message_interactions",
                    type: "Vector<MessageInteractionCounters>"
                }],
                type: "stats.BroadcastStats"
            }, {
                id: -1728664459,
                predicate: "help.promoDataEmpty",
                params: [{
                    name: "expires",
                    type: "int"
                }],
                type: "help.PromoData"
            }, {
                id: -1942390465,
                predicate: "help.promoData",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "proxy",
                    type: "flags.0?true"
                }, {
                    name: "expires",
                    type: "int"
                }, {
                    name: "peer",
                    type: "Peer"
                }, {
                    name: "chats",
                    type: "Vector<Chat>"
                }, {
                    name: "users",
                    type: "Vector<User>"
                }, {
                    name: "psa_type",
                    type: "flags.1?string"
                }, {
                    name: "psa_message",
                    type: "flags.2?string"
                }],
                type: "help.PromoData"
            }, {
                id: -567037804,
                predicate: "videoSize",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "type",
                    type: "string"
                }, {
                    name: "w",
                    type: "int"
                }, {
                    name: "h",
                    type: "int"
                }, {
                    name: "size",
                    type: "int"
                }, {
                    name: "video_start_ts",
                    type: "flags.0?double"
                }],
                type: "VideoSize"
            }, {
                id: -1660637285,
                predicate: "statsGroupTopPoster",
                params: [{
                    name: "user_id",
                    type: "long"
                }, {
                    name: "messages",
                    type: "int"
                }, {
                    name: "avg_chars",
                    type: "int"
                }],
                type: "StatsGroupTopPoster"
            }, {
                id: -682079097,
                predicate: "statsGroupTopAdmin",
                params: [{
                    name: "user_id",
                    type: "long"
                }, {
                    name: "deleted",
                    type: "int"
                }, {
                    name: "kicked",
                    type: "int"
                }, {
                    name: "banned",
                    type: "int"
                }],
                type: "StatsGroupTopAdmin"
            }, {
                id: 1398765469,
                predicate: "statsGroupTopInviter",
                params: [{
                    name: "user_id",
                    type: "long"
                }, {
                    name: "invitations",
                    type: "int"
                }],
                type: "StatsGroupTopInviter"
            }, {
                id: -276825834,
                predicate: "stats.megagroupStats",
                params: [{
                    name: "period",
                    type: "StatsDateRangeDays"
                }, {
                    name: "members",
                    type: "StatsAbsValueAndPrev"
                }, {
                    name: "messages",
                    type: "StatsAbsValueAndPrev"
                }, {
                    name: "viewers",
                    type: "StatsAbsValueAndPrev"
                }, {
                    name: "posters",
                    type: "StatsAbsValueAndPrev"
                }, {
                    name: "growth_graph",
                    type: "StatsGraph"
                }, {
                    name: "members_graph",
                    type: "StatsGraph"
                }, {
                    name: "new_members_by_source_graph",
                    type: "StatsGraph"
                }, {
                    name: "languages_graph",
                    type: "StatsGraph"
                }, {
                    name: "messages_graph",
                    type: "StatsGraph"
                }, {
                    name: "actions_graph",
                    type: "StatsGraph"
                }, {
                    name: "top_hours_graph",
                    type: "StatsGraph"
                }, {
                    name: "weekdays_graph",
                    type: "StatsGraph"
                }, {
                    name: "top_posters",
                    type: "Vector<StatsGroupTopPoster>"
                }, {
                    name: "top_admins",
                    type: "Vector<StatsGroupTopAdmin>"
                }, {
                    name: "top_inviters",
                    type: "Vector<StatsGroupTopInviter>"
                }, {
                    name: "users",
                    type: "Vector<User>"
                }],
                type: "stats.MegagroupStats"
            }, {
                id: -1096616924,
                predicate: "globalPrivacySettings",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "archive_and_mute_new_noncontact_peers",
                    type: "flags.0?Bool"
                }],
                type: "GlobalPrivacySettings"
            }, {
                id: 1107543535,
                predicate: "help.countryCode",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "country_code",
                    type: "string"
                }, {
                    name: "prefixes",
                    type: "flags.0?Vector<string>"
                }, {
                    name: "patterns",
                    type: "flags.1?Vector<string>"
                }],
                type: "help.CountryCode"
            }, {
                id: -1014526429,
                predicate: "help.country",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "hidden",
                    type: "flags.0?true"
                }, {
                    name: "iso2",
                    type: "string"
                }, {
                    name: "default_name",
                    type: "string"
                }, {
                    name: "name",
                    type: "flags.1?string"
                }, {
                    name: "country_codes",
                    type: "Vector<help.CountryCode>"
                }],
                type: "help.Country"
            }, {
                id: -1815339214,
                predicate: "help.countriesListNotModified",
                params: [],
                type: "help.CountriesList"
            }, {
                id: -2016381538,
                predicate: "help.countriesList",
                params: [{
                    name: "countries",
                    type: "Vector<help.Country>"
                }, {
                    name: "hash",
                    type: "int"
                }],
                type: "help.CountriesList"
            }, {
                id: 1163625789,
                predicate: "messageViews",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "views",
                    type: "flags.0?int"
                }, {
                    name: "forwards",
                    type: "flags.1?int"
                }, {
                    name: "replies",
                    type: "flags.2?MessageReplies"
                }],
                type: "MessageViews"
            }, {
                id: -1228606141,
                predicate: "messages.messageViews",
                params: [{
                    name: "views",
                    type: "Vector<MessageViews>"
                }, {
                    name: "chats",
                    type: "Vector<Chat>"
                }, {
                    name: "users",
                    type: "Vector<User>"
                }],
                type: "messages.MessageViews"
            }, {
                id: -1506535550,
                predicate: "messages.discussionMessage",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "messages",
                    type: "Vector<Message>"
                }, {
                    name: "max_id",
                    type: "flags.0?int"
                }, {
                    name: "read_inbox_max_id",
                    type: "flags.1?int"
                }, {
                    name: "read_outbox_max_id",
                    type: "flags.2?int"
                }, {
                    name: "unread_count",
                    type: "int"
                }, {
                    name: "chats",
                    type: "Vector<Chat>"
                }, {
                    name: "users",
                    type: "Vector<User>"
                }],
                type: "messages.DiscussionMessage"
            }, {
                id: -1495959709,
                predicate: "messageReplyHeader",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "reply_to_msg_id",
                    type: "int"
                }, {
                    name: "reply_to_peer_id",
                    type: "flags.0?Peer"
                }, {
                    name: "reply_to_top_id",
                    type: "flags.1?int"
                }],
                type: "MessageReplyHeader"
            }, {
                id: -2083123262,
                predicate: "messageReplies",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "comments",
                    type: "flags.0?true"
                }, {
                    name: "replies",
                    type: "int"
                }, {
                    name: "replies_pts",
                    type: "int"
                }, {
                    name: "recent_repliers",
                    type: "flags.1?Vector<Peer>"
                }, {
                    name: "channel_id",
                    type: "flags.0?long"
                }, {
                    name: "max_id",
                    type: "flags.2?int"
                }, {
                    name: "read_max_id",
                    type: "flags.3?int"
                }],
                type: "MessageReplies"
            }, {
                id: -386039788,
                predicate: "peerBlocked",
                params: [{
                    name: "peer_id",
                    type: "Peer"
                }, {
                    name: "date",
                    type: "int"
                }],
                type: "PeerBlocked"
            }, {
                id: -1986399595,
                predicate: "stats.messageStats",
                params: [{
                    name: "views_graph",
                    type: "StatsGraph"
                }],
                type: "stats.MessageStats"
            }, {
                id: 2004925620,
                predicate: "groupCallDiscarded",
                params: [{
                    name: "id",
                    type: "long"
                }, {
                    name: "access_hash",
                    type: "long"
                }, {
                    name: "duration",
                    type: "int"
                }],
                type: "GroupCall"
            }, {
                id: -711498484,
                predicate: "groupCall",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "join_muted",
                    type: "flags.1?true"
                }, {
                    name: "can_change_join_muted",
                    type: "flags.2?true"
                }, {
                    name: "join_date_asc",
                    type: "flags.6?true"
                }, {
                    name: "schedule_start_subscribed",
                    type: "flags.8?true"
                }, {
                    name: "can_start_video",
                    type: "flags.9?true"
                }, {
                    name: "record_video_active",
                    type: "flags.11?true"
                }, {
                    name: "id",
                    type: "long"
                }, {
                    name: "access_hash",
                    type: "long"
                }, {
                    name: "participants_count",
                    type: "int"
                }, {
                    name: "title",
                    type: "flags.3?string"
                }, {
                    name: "stream_dc_id",
                    type: "flags.4?int"
                }, {
                    name: "record_start_date",
                    type: "flags.5?int"
                }, {
                    name: "schedule_date",
                    type: "flags.7?int"
                }, {
                    name: "unmuted_video_count",
                    type: "flags.10?int"
                }, {
                    name: "unmuted_video_limit",
                    type: "int"
                }, {
                    name: "version",
                    type: "int"
                }],
                type: "GroupCall"
            }, {
                id: -659913713,
                predicate: "inputGroupCall",
                params: [{
                    name: "id",
                    type: "long"
                }, {
                    name: "access_hash",
                    type: "long"
                }],
                type: "InputGroupCall"
            }, {
                id: -341428482,
                predicate: "groupCallParticipant",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "muted",
                    type: "flags.0?true"
                }, {
                    name: "left",
                    type: "flags.1?true"
                }, {
                    name: "can_self_unmute",
                    type: "flags.2?true"
                }, {
                    name: "just_joined",
                    type: "flags.4?true"
                }, {
                    name: "versioned",
                    type: "flags.5?true"
                }, {
                    name: "min",
                    type: "flags.8?true"
                }, {
                    name: "muted_by_you",
                    type: "flags.9?true"
                }, {
                    name: "volume_by_admin",
                    type: "flags.10?true"
                }, {
                    name: "self",
                    type: "flags.12?true"
                }, {
                    name: "video_joined",
                    type: "flags.15?true"
                }, {
                    name: "peer",
                    type: "Peer"
                }, {
                    name: "date",
                    type: "int"
                }, {
                    name: "active_date",
                    type: "flags.3?int"
                }, {
                    name: "source",
                    type: "int"
                }, {
                    name: "volume",
                    type: "flags.7?int"
                }, {
                    name: "about",
                    type: "flags.11?string"
                }, {
                    name: "raise_hand_rating",
                    type: "flags.13?long"
                }, {
                    name: "video",
                    type: "flags.6?GroupCallParticipantVideo"
                }, {
                    name: "presentation",
                    type: "flags.14?GroupCallParticipantVideo"
                }],
                type: "GroupCallParticipant"
            }, {
                id: -1636664659,
                predicate: "phone.groupCall",
                params: [{
                    name: "call",
                    type: "GroupCall"
                }, {
                    name: "participants",
                    type: "Vector<GroupCallParticipant>"
                }, {
                    name: "participants_next_offset",
                    type: "string"
                }, {
                    name: "chats",
                    type: "Vector<Chat>"
                }, {
                    name: "users",
                    type: "Vector<User>"
                }],
                type: "phone.GroupCall"
            }, {
                id: -193506890,
                predicate: "phone.groupParticipants",
                params: [{
                    name: "count",
                    type: "int"
                }, {
                    name: "participants",
                    type: "Vector<GroupCallParticipant>"
                }, {
                    name: "next_offset",
                    type: "string"
                }, {
                    name: "chats",
                    type: "Vector<Chat>"
                }, {
                    name: "users",
                    type: "Vector<User>"
                }, {
                    name: "version",
                    type: "int"
                }],
                type: "phone.GroupParticipants"
            }, {
                id: 813821341,
                predicate: "inlineQueryPeerTypeSameBotPM",
                params: [],
                type: "InlineQueryPeerType"
            }, {
                id: -2093215828,
                predicate: "inlineQueryPeerTypePM",
                params: [],
                type: "InlineQueryPeerType"
            }, {
                id: -681130742,
                predicate: "inlineQueryPeerTypeChat",
                params: [],
                type: "InlineQueryPeerType"
            }, {
                id: 1589952067,
                predicate: "inlineQueryPeerTypeMegagroup",
                params: [],
                type: "InlineQueryPeerType"
            }, {
                id: 1664413338,
                predicate: "inlineQueryPeerTypeBroadcast",
                params: [],
                type: "InlineQueryPeerType"
            }, {
                id: 375566091,
                predicate: "messages.historyImport",
                params: [{
                    name: "id",
                    type: "long"
                }],
                type: "messages.HistoryImport"
            }, {
                id: 1578088377,
                predicate: "messages.historyImportParsed",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "pm",
                    type: "flags.0?true"
                }, {
                    name: "group",
                    type: "flags.1?true"
                }, {
                    name: "title",
                    type: "flags.2?string"
                }],
                type: "messages.HistoryImportParsed"
            }, {
                id: -275956116,
                predicate: "messages.affectedFoundMessages",
                params: [{
                    name: "pts",
                    type: "int"
                }, {
                    name: "pts_count",
                    type: "int"
                }, {
                    name: "offset",
                    type: "int"
                }, {
                    name: "messages",
                    type: "Vector<int>"
                }],
                type: "messages.AffectedFoundMessages"
            }, {
                id: 190633460,
                predicate: "chatInviteImporter",
                params: [{
                    name: "user_id",
                    type: "long"
                }, {
                    name: "date",
                    type: "int"
                }],
                type: "ChatInviteImporter"
            }, {
                id: -1111085620,
                predicate: "messages.exportedChatInvites",
                params: [{
                    name: "count",
                    type: "int"
                }, {
                    name: "invites",
                    type: "Vector<ExportedChatInvite>"
                }, {
                    name: "users",
                    type: "Vector<User>"
                }],
                type: "messages.ExportedChatInvites"
            }, {
                id: 410107472,
                predicate: "messages.exportedChatInvite",
                params: [{
                    name: "invite",
                    type: "ExportedChatInvite"
                }, {
                    name: "users",
                    type: "Vector<User>"
                }],
                type: "messages.ExportedChatInvite"
            }, {
                id: 572915951,
                predicate: "messages.exportedChatInviteReplaced",
                params: [{
                    name: "invite",
                    type: "ExportedChatInvite"
                }, {
                    name: "new_invite",
                    type: "ExportedChatInvite"
                }, {
                    name: "users",
                    type: "Vector<User>"
                }],
                type: "messages.ExportedChatInvite"
            }, {
                id: -2118733814,
                predicate: "messages.chatInviteImporters",
                params: [{
                    name: "count",
                    type: "int"
                }, {
                    name: "importers",
                    type: "Vector<ChatInviteImporter>"
                }, {
                    name: "users",
                    type: "Vector<User>"
                }],
                type: "messages.ChatInviteImporters"
            }, {
                id: -219353309,
                predicate: "chatAdminWithInvites",
                params: [{
                    name: "admin_id",
                    type: "long"
                }, {
                    name: "invites_count",
                    type: "int"
                }, {
                    name: "revoked_invites_count",
                    type: "int"
                }],
                type: "ChatAdminWithInvites"
            }, {
                id: -1231326505,
                predicate: "messages.chatAdminsWithInvites",
                params: [{
                    name: "admins",
                    type: "Vector<ChatAdminWithInvites>"
                }, {
                    name: "users",
                    type: "Vector<User>"
                }],
                type: "messages.ChatAdminsWithInvites"
            }, {
                id: -1571952873,
                predicate: "messages.checkedHistoryImportPeer",
                params: [{
                    name: "confirm_text",
                    type: "string"
                }],
                type: "messages.CheckedHistoryImportPeer"
            }, {
                id: -1343921601,
                predicate: "phone.joinAsPeers",
                params: [{
                    name: "peers",
                    type: "Vector<Peer>"
                }, {
                    name: "chats",
                    type: "Vector<Chat>"
                }, {
                    name: "users",
                    type: "Vector<User>"
                }],
                type: "phone.JoinAsPeers"
            }, {
                id: 541839704,
                predicate: "phone.exportedGroupCallInvite",
                params: [{
                    name: "link",
                    type: "string"
                }],
                type: "phone.ExportedGroupCallInvite"
            }, {
                id: -592373577,
                predicate: "groupCallParticipantVideoSourceGroup",
                params: [{
                    name: "semantics",
                    type: "string"
                }, {
                    name: "sources",
                    type: "Vector<int>"
                }],
                type: "GroupCallParticipantVideoSourceGroup"
            }, {
                id: 1735736008,
                predicate: "groupCallParticipantVideo",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "paused",
                    type: "flags.0?true"
                }, {
                    name: "endpoint",
                    type: "string"
                }, {
                    name: "source_groups",
                    type: "Vector<GroupCallParticipantVideoSourceGroup>"
                }, {
                    name: "audio_source",
                    type: "flags.1?int"
                }],
                type: "GroupCallParticipantVideo"
            }, {
                id: -2046910401,
                predicate: "stickers.suggestedShortName",
                params: [{
                    name: "short_name",
                    type: "string"
                }],
                type: "stickers.SuggestedShortName"
            }, {
                id: 795652779,
                predicate: "botCommandScopeDefault",
                params: [],
                type: "BotCommandScope"
            }, {
                id: 1011811544,
                predicate: "botCommandScopeUsers",
                params: [],
                type: "BotCommandScope"
            }, {
                id: 1877059713,
                predicate: "botCommandScopeChats",
                params: [],
                type: "BotCommandScope"
            }, {
                id: -1180016534,
                predicate: "botCommandScopeChatAdmins",
                params: [],
                type: "BotCommandScope"
            }, {
                id: -610432643,
                predicate: "botCommandScopePeer",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }],
                type: "BotCommandScope"
            }, {
                id: 1071145937,
                predicate: "botCommandScopePeerAdmins",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }],
                type: "BotCommandScope"
            }, {
                id: 169026035,
                predicate: "botCommandScopePeerUser",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "user_id",
                    type: "InputUser"
                }],
                type: "BotCommandScope"
            }, {
                id: -478701471,
                predicate: "account.resetPasswordFailedWait",
                params: [{
                    name: "retry_date",
                    type: "int"
                }],
                type: "account.ResetPasswordResult"
            }, {
                id: -370148227,
                predicate: "account.resetPasswordRequestedWait",
                params: [{
                    name: "until_date",
                    type: "int"
                }],
                type: "account.ResetPasswordResult"
            }, {
                id: -383330754,
                predicate: "account.resetPasswordOk",
                params: [],
                type: "account.ResetPasswordResult"
            }, {
                id: -318022605,
                predicate: "chatTheme",
                params: [{
                    name: "emoticon",
                    type: "string"
                }, {
                    name: "theme",
                    type: "Theme"
                }, {
                    name: "dark_theme",
                    type: "Theme"
                }],
                type: "ChatTheme"
            }, {
                id: -535699004,
                predicate: "account.chatThemesNotModified",
                params: [],
                type: "account.ChatThemes"
            }, {
                id: -28524867,
                predicate: "account.chatThemes",
                params: [{
                    name: "hash",
                    type: "int"
                }, {
                    name: "themes",
                    type: "Vector<ChatTheme>"
                }],
                type: "account.ChatThemes"
            }, {
                id: 708589599,
                predicate: "sponsoredMessage",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "random_id",
                    type: "bytes"
                }, {
                    name: "from_id",
                    type: "Peer"
                }, {
                    name: "start_param",
                    type: "flags.0?string"
                }, {
                    name: "message",
                    type: "string"
                }, {
                    name: "entities",
                    type: "flags.1?Vector<MessageEntity>"
                }],
                type: "SponsoredMessage"
            }, {
                id: 1705297877,
                predicate: "messages.sponsoredMessages",
                params: [{
                    name: "messages",
                    type: "Vector<SponsoredMessage>"
                }, {
                    name: "chats",
                    type: "Vector<Chat>"
                }, {
                    name: "users",
                    type: "Vector<User>"
                }],
                type: "messages.SponsoredMessages"
            }, {
                id: 2059302893,
                predicate: "eitaaObject",
                params: [{
                    name: "token",
                    type: "string"
                }, {
                    name: "imei",
                    type: "string"
                }, {
                    name: "packed_data",
                    type: "bytes"
                }, {
                    name: "layer",
                    type: "int"
                }, {
                    name: "flags",
                    type: "int"
                }],
                type: "EitaaObject"
            }, {
                id: 1908593196,
                predicate: "eitaaIosObject",
                params: [{
                    name: "token",
                    type: "string"
                }, {
                    name: "imei",
                    type: "string"
                }, {
                    name: "flags",
                    type: "#"
                }, {
                    name: "packed_data",
                    type: "bytes"
                }, {
                    name: "layer",
                    type: "int"
                }, {
                    name: "build_version",
                    type: "int"
                }],
                type: "EitaaIosObject"
            }, {
                id: 1194436538,
                predicate: "liveGetMedia",
                params: [{
                    name: "flags",
                    type: "int"
                }, {
                    name: "id",
                    type: "long"
                }, {
                    name: "access_hash",
                    type: "long"
                }],
                type: "LiveGetMedia"
            }, {
                id: 1632839530,
                predicate: "chatPhoto",
                params: [{
                    name: "photo_small",
                    type: "FileLocation"
                }, {
                    name: "photo_big",
                    type: "FileLocation"
                }],
                type: "ChatPhoto"
            }, {
                id: -1132476723,
                predicate: "fileLocationToBeDeprecated",
                params: [{
                    name: "volume_id",
                    type: "long"
                }, {
                    name: "local_id",
                    type: "int"
                }],
                type: "FileLocation"
            }, {
                id: 1406570614,
                predicate: "fileLocation",
                params: [{
                    name: "dc_id",
                    type: "int"
                }, {
                    name: "volume_id",
                    type: "long"
                }, {
                    name: "local_id",
                    type: "int"
                }, {
                    name: "secret",
                    type: "long"
                }],
                type: "FileLocation"
            }, {
                id: -374917894,
                predicate: "photoCachedSize",
                params: [{
                    name: "type",
                    type: "string"
                }, {
                    name: "location",
                    type: "FileLocation"
                }, {
                    name: "w",
                    type: "int"
                }, {
                    name: "h",
                    type: "int"
                }, {
                    name: "bytes",
                    type: "bytes"
                }],
                type: "PhotoSize"
            }, {
                id: 2009052699,
                predicate: "photoSize",
                params: [{
                    name: "type",
                    type: "string"
                }, {
                    name: "location",
                    type: "FileLocation"
                }, {
                    name: "w",
                    type: "int"
                }, {
                    name: "h",
                    type: "int"
                }, {
                    name: "size",
                    type: "int"
                }],
                type: "PhotoSize"
            }, {
                id: -873187034,
                predicate: "messageMediaLiveStream",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "from_self",
                    type: "flags.1?true"
                }, {
                    name: "id",
                    type: "long"
                }, {
                    name: "access_hash",
                    type: "long"
                }, {
                    name: "total_viewers",
                    type: "flags.0?int"
                }, {
                    name: "state",
                    type: "LiveStreamState"
                }, {
                    name: "thumbs",
                    type: "flags.2?Vector<PhotoSize>"
                }],
                type: "MessageMedia"
            }, {
                id: -1263446626,
                predicate: "liveStreamStateInit",
                params: [],
                type: "LiveStreamState"
            }, {
                id: -1151640075,
                predicate: "liveStreamStateBroadcasting",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "paused",
                    type: "flags.0?true"
                }, {
                    name: "liveStream",
                    type: "LiveStream"
                }],
                type: "LiveStreamState"
            }, {
                id: -1202907733,
                predicate: "liveStreamStateEnded",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "duration",
                    type: "int"
                }, {
                    name: "expire_date",
                    type: "flags.0?int"
                }, {
                    name: "archive_link",
                    type: "flags.0?string"
                }],
                type: "LiveStreamState"
            }, {
                id: -53427794,
                predicate: "liveStreamStateEnded2",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "duration",
                    type: "int"
                }, {
                    name: "expire_date",
                    type: "flags.0?int"
                }, {
                    name: "archive_link",
                    type: "flags.0?string"
                }, {
                    name: "archive_size",
                    type: "flags.0?int"
                }],
                type: "LiveStreamState"
            }, {
                id: 765942443,
                predicate: "liveStream",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "read_link",
                    type: "flags.0?string"
                }, {
                    name: "write_link",
                    type: "flags.1?string"
                }, {
                    name: "start_date",
                    type: "int"
                }],
                type: "LiveStream"
            }, {
                id: -2008309847,
                predicate: "liveGetParticipants",
                params: [{
                    name: "id",
                    type: "long"
                }, {
                    name: "access_hash",
                    type: "long"
                }],
                type: "LiveGetParticipants"
            }, {
                id: -219577344,
                predicate: "liveParticipants",
                params: [{
                    name: "users",
                    type: "Vector<User>"
                }],
                type: "LiveParticipants"
            }, {
                id: -1829372741,
                predicate: "adsInputAdsLocationRecommend",
                params: [],
                type: "AdsLocation"
            }, {
                id: -338836925,
                predicate: "adsInputAdsLocationChatMembers",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }],
                type: "AdsLocation"
            }, {
                id: -415214013,
                predicate: "adsInputAdsLocationContacts",
                params: [],
                type: "AdsLocation"
            }, {
                id: 1557811792,
                predicate: "adsInputAdsLocationTrends",
                params: [{
                    name: "groupTitle",
                    type: "string"
                }],
                type: "AdsLocation"
            }, {
                id: 314488883,
                predicate: "adsInputAdsLocationDialog",
                params: [],
                type: "AdsLocation"
            }, {
                id: -1626620176,
                predicate: "statAd",
                params: [{
                    name: "id",
                    type: "int"
                }, {
                    name: "adsLocation",
                    type: "AdsLocation"
                }],
                type: "StatAd"
            }, {
                id: 1635347945,
                predicate: "eitaaAppInfo",
                params: [{
                    name: "build_version",
                    type: "int"
                }, {
                    name: "device_model",
                    type: "string"
                }, {
                    name: "system_version",
                    type: "string"
                }, {
                    name: "app_version",
                    type: "string"
                }, {
                    name: "lang_code",
                    type: "string"
                }, {
                    name: "sign",
                    type: "string"
                }],
                type: "EitaaAppInfo"
            }, {
                id: -1095770451,
                predicate: "userPayHash",
                params: [{
                    name: "flag",
                    type: "int"
                }, {
                    name: "hash",
                    type: "string"
                }],
                type: "UserPayHash"
            }, {
                id: -203687195,
                predicate: "latestBuildVersion",
                params: [{
                    name: "build_version",
                    type: "int"
                }],
                type: "LatestBuildVersion"
            }],
            methods: [{
                id: -878758099,
                method: "invokeAfterMsg",
                params: [{
                    name: "msg_id",
                    type: "long"
                }, {
                    name: "query",
                    type: "!X"
                }],
                type: "X"
            }, {
                id: 1036301552,
                method: "invokeAfterMsgs",
                params: [{
                    name: "msg_ids",
                    type: "Vector<long>"
                }, {
                    name: "query",
                    type: "!X"
                }],
                type: "X"
            }, {
                id: -1043505495,
                method: "initConnection",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "api_id",
                    type: "int"
                }, {
                    name: "device_model",
                    type: "string"
                }, {
                    name: "system_version",
                    type: "string"
                }, {
                    name: "app_version",
                    type: "string"
                }, {
                    name: "system_lang_code",
                    type: "string"
                }, {
                    name: "lang_pack",
                    type: "string"
                }, {
                    name: "lang_code",
                    type: "string"
                }, {
                    name: "proxy",
                    type: "flags.0?InputClientProxy"
                }, {
                    name: "params",
                    type: "flags.1?JSONValue"
                }, {
                    name: "query",
                    type: "!X"
                }],
                type: "X"
            }, {
                id: -627372787,
                method: "invokeWithLayer",
                params: [{
                    name: "layer",
                    type: "int"
                }, {
                    name: "query",
                    type: "!X"
                }],
                type: "X"
            }, {
                id: -1080796745,
                method: "invokeWithoutUpdates",
                params: [{
                    name: "query",
                    type: "!X"
                }],
                type: "X"
            }, {
                id: 911373810,
                method: "invokeWithMessagesRange",
                params: [{
                    name: "range",
                    type: "MessageRange"
                }, {
                    name: "query",
                    type: "!X"
                }],
                type: "X"
            }, {
                id: -1398145746,
                method: "invokeWithTakeout",
                params: [{
                    name: "takeout_id",
                    type: "long"
                }, {
                    name: "query",
                    type: "!X"
                }],
                type: "X"
            }, {
                id: -1502141361,
                method: "auth.sendCode",
                params: [{
                    name: "phone_number",
                    type: "string"
                }, {
                    name: "api_id",
                    type: "int"
                }, {
                    name: "api_hash",
                    type: "string"
                }, {
                    name: "settings",
                    type: "CodeSettings"
                }],
                type: "auth.SentCode"
            }, {
                id: -2131827673,
                method: "auth.signUp",
                params: [{
                    name: "phone_number",
                    type: "string"
                }, {
                    name: "phone_code_hash",
                    type: "string"
                }, {
                    name: "phone_code",
                    type: "string"
                }, {
                    name: "first_name",
                    type: "string"
                }, {
                    name: "last_name",
                    type: "string"
                }, {
                    name: "app_info",
                    type: "EitaaAppInfo"
                }],
                type: "auth.Authorization"
            }, {
                id: -1126886015,
                method: "auth.signIn",
                params: [{
                    name: "phone_number",
                    type: "string"
                }, {
                    name: "phone_code_hash",
                    type: "string"
                }, {
                    name: "phone_code",
                    type: "string"
                }],
                type: "auth.Authorization"
            }, {
                id: 1461180992,
                method: "auth.logOut",
                params: [],
                type: "Bool"
            }, {
                id: -1616179942,
                method: "auth.resetAuthorizations",
                params: [],
                type: "Bool"
            }, {
                id: -440401971,
                method: "auth.exportAuthorization",
                params: [{
                    name: "dc_id",
                    type: "int"
                }],
                type: "auth.ExportedAuthorization"
            }, {
                id: -1518699091,
                method: "auth.importAuthorization",
                params: [{
                    name: "id",
                    type: "long"
                }, {
                    name: "bytes",
                    type: "bytes"
                }],
                type: "auth.Authorization"
            }, {
                id: -841733627,
                method: "auth.bindTempAuthKey",
                params: [{
                    name: "perm_auth_key_id",
                    type: "long"
                }, {
                    name: "nonce",
                    type: "long"
                }, {
                    name: "expires_at",
                    type: "int"
                }, {
                    name: "encrypted_message",
                    type: "bytes"
                }],
                type: "Bool"
            }, {
                id: 1738800940,
                method: "auth.importBotAuthorization",
                params: [{
                    name: "flags",
                    type: "int"
                }, {
                    name: "api_id",
                    type: "int"
                }, {
                    name: "api_hash",
                    type: "string"
                }, {
                    name: "bot_auth_token",
                    type: "string"
                }],
                type: "auth.Authorization"
            }, {
                id: -779399914,
                method: "auth.checkPassword",
                params: [{
                    name: "password",
                    type: "InputCheckPasswordSRP"
                }],
                type: "auth.Authorization"
            }, {
                id: -1987323361,
                method: "auth.checkPassword2",
                params: [{
                    name: "password_hash",
                    type: "bytes"
                }, {
                    name: "flags",
                    type: "#"
                }, {
                    name: "phone_code",
                    type: "flags.0?string"
                }, {
                    name: "phone_number",
                    type: "flags.1?string"
                }],
                type: "auth.Authorization"
            }, {
                id: -661144474,
                method: "auth.requestPasswordRecovery",
                params: [],
                type: "auth.PasswordRecovery"
            }, {
                id: 923364464,
                method: "auth.recoverPassword",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "code",
                    type: "string"
                }, {
                    name: "new_settings",
                    type: "flags.0?account.PasswordInputSettings"
                }],
                type: "auth.Authorization"
            }, {
                id: 1056025023,
                method: "auth.resendCode",
                params: [{
                    name: "phone_number",
                    type: "string"
                }, {
                    name: "phone_code_hash",
                    type: "string"
                }],
                type: "auth.SentCode"
            }, {
                id: 520357240,
                method: "auth.cancelCode",
                params: [{
                    name: "phone_number",
                    type: "string"
                }, {
                    name: "phone_code_hash",
                    type: "string"
                }],
                type: "Bool"
            }, {
                id: -1907842680,
                method: "auth.dropTempAuthKeys",
                params: [{
                    name: "except_auth_keys",
                    type: "Vector<long>"
                }],
                type: "Bool"
            }, {
                id: -1210022402,
                method: "auth.exportLoginToken",
                params: [{
                    name: "api_id",
                    type: "int"
                }, {
                    name: "api_hash",
                    type: "string"
                }, {
                    name: "except_ids",
                    type: "Vector<long>"
                }],
                type: "auth.LoginToken"
            }, {
                id: -1783866140,
                method: "auth.importLoginToken",
                params: [{
                    name: "token",
                    type: "bytes"
                }],
                type: "auth.LoginToken"
            }, {
                id: -392909491,
                method: "auth.acceptLoginToken",
                params: [{
                    name: "token",
                    type: "bytes"
                }],
                type: "Authorization"
            }, {
                id: 221691769,
                method: "auth.checkRecoveryPassword",
                params: [{
                    name: "code",
                    type: "string"
                }],
                type: "Bool"
            }, {
                id: -326762118,
                method: "account.registerDevice",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "no_muted",
                    type: "flags.0?true"
                }, {
                    name: "token_type",
                    type: "int"
                }, {
                    name: "token",
                    type: "string"
                }, {
                    name: "app_sandbox",
                    type: "Bool"
                }, {
                    name: "secret",
                    type: "bytes"
                }, {
                    name: "other_uids",
                    type: "Vector<long>"
                }],
                type: "Bool"
            }, {
                id: 1779249670,
                method: "account.unregisterDevice",
                params: [{
                    name: "token_type",
                    type: "int"
                }, {
                    name: "token",
                    type: "string"
                }, {
                    name: "other_uids",
                    type: "Vector<long>"
                }],
                type: "Bool"
            }, {
                id: -2067899501,
                method: "account.updateNotifySettings",
                params: [{
                    name: "peer",
                    type: "InputNotifyPeer"
                }, {
                    name: "settings",
                    type: "InputPeerNotifySettings"
                }],
                type: "Bool"
            }, {
                id: 313765169,
                method: "account.getNotifySettings",
                params: [{
                    name: "peer",
                    type: "InputNotifyPeer"
                }],
                type: "PeerNotifySettings"
            }, {
                id: -612493497,
                method: "account.resetNotifySettings",
                params: [],
                type: "Bool"
            }, {
                id: 2018596725,
                method: "account.updateProfile",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "first_name",
                    type: "flags.0?string"
                }, {
                    name: "last_name",
                    type: "flags.1?string"
                }, {
                    name: "about",
                    type: "flags.2?string"
                }],
                type: "User"
            }, {
                id: 1713919532,
                method: "account.updateStatus",
                params: [{
                    name: "offline",
                    type: "Bool"
                }],
                type: "Bool"
            }, {
                id: 127302966,
                method: "account.getWallPapers",
                params: [{
                    name: "hash",
                    type: "long"
                }],
                type: "account.WallPapers"
            }, {
                id: -977650298,
                method: "account.reportPeer",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "reason",
                    type: "ReportReason"
                }, {
                    name: "message",
                    type: "string"
                }],
                type: "Bool"
            }, {
                id: 655677548,
                method: "account.checkUsername",
                params: [{
                    name: "username",
                    type: "string"
                }],
                type: "Bool"
            }, {
                id: 1040964988,
                method: "account.updateUsername",
                params: [{
                    name: "username",
                    type: "string"
                }],
                type: "User"
            }, {
                id: -623130288,
                method: "account.getPrivacy",
                params: [{
                    name: "key",
                    type: "InputPrivacyKey"
                }],
                type: "account.PrivacyRules"
            }, {
                id: -906486552,
                method: "account.setPrivacy",
                params: [{
                    name: "key",
                    type: "InputPrivacyKey"
                }, {
                    name: "rules",
                    type: "Vector<InputPrivacyRule>"
                }],
                type: "account.PrivacyRules"
            }, {
                id: 1099779595,
                method: "account.deleteAccount",
                params: [{
                    name: "reason",
                    type: "string"
                }],
                type: "Bool"
            }, {
                id: 150761757,
                method: "account.getAccountTTL",
                params: [],
                type: "AccountDaysTTL"
            }, {
                id: 608323678,
                method: "account.setAccountTTL",
                params: [{
                    name: "ttl",
                    type: "AccountDaysTTL"
                }],
                type: "Bool"
            }, {
                id: -2108208411,
                method: "account.sendChangePhoneCode",
                params: [{
                    name: "phone_number",
                    type: "string"
                }, {
                    name: "settings",
                    type: "CodeSettings"
                }],
                type: "auth.SentCode"
            }, {
                id: 1891839707,
                method: "account.changePhone",
                params: [{
                    name: "phone_number",
                    type: "string"
                }, {
                    name: "phone_code_hash",
                    type: "string"
                }, {
                    name: "phone_code",
                    type: "string"
                }],
                type: "User"
            }, {
                id: 954152242,
                method: "account.updateDeviceLocked",
                params: [{
                    name: "period",
                    type: "int"
                }],
                type: "Bool"
            }, {
                id: -484392616,
                method: "account.getAuthorizations",
                params: [],
                type: "account.Authorizations"
            }, {
                id: -545786948,
                method: "account.resetAuthorization",
                params: [{
                    name: "hash",
                    type: "long"
                }],
                type: "Bool"
            }, {
                id: 1418342645,
                method: "account.getPassword",
                params: [],
                type: "account.Password"
            }, {
                id: 3612004724,
                method: "account.getPasswordLayer68",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "phone_code",
                    type: "flags.0?string"
                }, {
                    name: "phone_number",
                    type: "flags.1?string"
                }],
                type: "account.Password"
            }, {
                id: -1663767815,
                method: "account.getPasswordSettings",
                params: [{
                    name: "password",
                    type: "InputCheckPasswordSRP"
                }],
                type: "account.PasswordSettings"
            }, {
                id: -1131605573,
                method: "account.getPasswordSettings68",
                params: [{
                    name: "password_hash",
                    type: "bytes"
                }],
                type: "account.PasswordSettings"
            }, {
                id: -1516564433,
                method: "account.updatePasswordSettings",
                params: [{
                    name: "password",
                    type: "InputCheckPasswordSRP"
                }, {
                    name: "new_settings",
                    type: "account.PasswordInputSettings"
                }],
                type: "Bool"
            }, {
                id: -92517498,
                method: "account.updatePasswordSettingsLayer68",
                params: [{
                    name: "current_password_hash",
                    type: "bytes"
                }, {
                    name: "new_settings",
                    type: "account.PasswordInputSettings"
                }],
                type: "Bool"
            }, {
                id: 457157256,
                method: "account.sendConfirmPhoneCode",
                params: [{
                    name: "hash",
                    type: "string"
                }, {
                    name: "settings",
                    type: "CodeSettings"
                }],
                type: "auth.SentCode"
            }, {
                id: 1596029123,
                method: "account.confirmPhone",
                params: [{
                    name: "phone_code_hash",
                    type: "string"
                }, {
                    name: "phone_code",
                    type: "string"
                }],
                type: "Bool"
            }, {
                id: 1151208273,
                method: "account.getTmpPassword",
                params: [{
                    name: "password",
                    type: "InputCheckPasswordSRP"
                }, {
                    name: "period",
                    type: "int"
                }],
                type: "account.TmpPassword"
            }, {
                id: 405695855,
                method: "account.getWebAuthorizations",
                params: [],
                type: "account.WebAuthorizations"
            }, {
                id: 755087855,
                method: "account.resetWebAuthorization",
                params: [{
                    name: "hash",
                    type: "long"
                }],
                type: "Bool"
            }, {
                id: 1747789204,
                method: "account.resetWebAuthorizations",
                params: [],
                type: "Bool"
            }, {
                id: -1299661699,
                method: "account.getAllSecureValues",
                params: [],
                type: "Vector<SecureValue>"
            }, {
                id: 1936088002,
                method: "account.getSecureValue",
                params: [{
                    name: "types",
                    type: "Vector<SecureValueType>"
                }],
                type: "Vector<SecureValue>"
            }, {
                id: -1986010339,
                method: "account.saveSecureValue",
                params: [{
                    name: "value",
                    type: "InputSecureValue"
                }, {
                    name: "secure_secret_id",
                    type: "long"
                }],
                type: "SecureValue"
            }, {
                id: -1199522741,
                method: "account.deleteSecureValue",
                params: [{
                    name: "types",
                    type: "Vector<SecureValueType>"
                }],
                type: "Bool"
            }, {
                id: -1456907910,
                method: "account.getAuthorizationForm",
                params: [{
                    name: "bot_id",
                    type: "long"
                }, {
                    name: "scope",
                    type: "string"
                }, {
                    name: "public_key",
                    type: "string"
                }],
                type: "account.AuthorizationForm"
            }, {
                id: -202552205,
                method: "account.acceptAuthorization",
                params: [{
                    name: "bot_id",
                    type: "long"
                }, {
                    name: "scope",
                    type: "string"
                }, {
                    name: "public_key",
                    type: "string"
                }, {
                    name: "value_hashes",
                    type: "Vector<SecureValueHash>"
                }, {
                    name: "credentials",
                    type: "SecureCredentialsEncrypted"
                }],
                type: "Bool"
            }, {
                id: -1516022023,
                method: "account.sendVerifyPhoneCode",
                params: [{
                    name: "phone_number",
                    type: "string"
                }, {
                    name: "settings",
                    type: "CodeSettings"
                }],
                type: "auth.SentCode"
            }, {
                id: 1305716726,
                method: "account.verifyPhone",
                params: [{
                    name: "phone_number",
                    type: "string"
                }, {
                    name: "phone_code_hash",
                    type: "string"
                }, {
                    name: "phone_code",
                    type: "string"
                }],
                type: "Bool"
            }, {
                id: 1880182943,
                method: "account.sendVerifyEmailCode",
                params: [{
                    name: "email",
                    type: "string"
                }],
                type: "account.SentEmailCode"
            }, {
                id: -323339813,
                method: "account.verifyEmail",
                params: [{
                    name: "email",
                    type: "string"
                }, {
                    name: "code",
                    type: "string"
                }],
                type: "Bool"
            }, {
                id: -262453244,
                method: "account.initTakeoutSession",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "contacts",
                    type: "flags.0?true"
                }, {
                    name: "message_users",
                    type: "flags.1?true"
                }, {
                    name: "message_chats",
                    type: "flags.2?true"
                }, {
                    name: "message_megagroups",
                    type: "flags.3?true"
                }, {
                    name: "message_channels",
                    type: "flags.4?true"
                }, {
                    name: "files",
                    type: "flags.5?true"
                }, {
                    name: "file_max_size",
                    type: "flags.5?int"
                }],
                type: "account.Takeout"
            }, {
                id: 489050862,
                method: "account.finishTakeoutSession",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "success",
                    type: "flags.0?true"
                }],
                type: "Bool"
            }, {
                id: -1881204448,
                method: "account.confirmPasswordEmail",
                params: [{
                    name: "code",
                    type: "string"
                }],
                type: "Bool"
            }, {
                id: 2055154197,
                method: "account.resendPasswordEmail",
                params: [],
                type: "Bool"
            }, {
                id: -1043606090,
                method: "account.cancelPasswordEmail",
                params: [],
                type: "Bool"
            }, {
                id: -1626880216,
                method: "account.getContactSignUpNotification",
                params: [],
                type: "Bool"
            }, {
                id: -806076575,
                method: "account.setContactSignUpNotification",
                params: [{
                    name: "silent",
                    type: "Bool"
                }],
                type: "Bool"
            }, {
                id: 1398240377,
                method: "account.getNotifyExceptions",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "compare_sound",
                    type: "flags.1?true"
                }, {
                    name: "peer",
                    type: "flags.0?InputNotifyPeer"
                }],
                type: "Updates"
            }, {
                id: -57811990,
                method: "account.getWallPaper",
                params: [{
                    name: "wallpaper",
                    type: "InputWallPaper"
                }],
                type: "WallPaper"
            }, {
                id: -578472351,
                method: "account.uploadWallPaper",
                params: [{
                    name: "file",
                    type: "InputFile"
                }, {
                    name: "mime_type",
                    type: "string"
                }, {
                    name: "settings",
                    type: "WallPaperSettings"
                }],
                type: "WallPaper"
            }, {
                id: 1817860919,
                method: "account.saveWallPaper",
                params: [{
                    name: "wallpaper",
                    type: "InputWallPaper"
                }, {
                    name: "unsave",
                    type: "Bool"
                }, {
                    name: "settings",
                    type: "WallPaperSettings"
                }],
                type: "Bool"
            }, {
                id: -18000023,
                method: "account.installWallPaper",
                params: [{
                    name: "wallpaper",
                    type: "InputWallPaper"
                }, {
                    name: "settings",
                    type: "WallPaperSettings"
                }],
                type: "Bool"
            }, {
                id: -1153722364,
                method: "account.resetWallPapers",
                params: [],
                type: "Bool"
            }, {
                id: 1457130303,
                method: "account.getAutoDownloadSettings",
                params: [],
                type: "account.AutoDownloadSettings"
            }, {
                id: 1995661875,
                method: "account.saveAutoDownloadSettings",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "low",
                    type: "flags.0?true"
                }, {
                    name: "high",
                    type: "flags.1?true"
                }, {
                    name: "settings",
                    type: "AutoDownloadSettings"
                }],
                type: "Bool"
            }, {
                id: 473805619,
                method: "account.uploadTheme",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "file",
                    type: "InputFile"
                }, {
                    name: "thumb",
                    type: "flags.0?InputFile"
                }, {
                    name: "file_name",
                    type: "string"
                }, {
                    name: "mime_type",
                    type: "string"
                }],
                type: "Document"
            }, {
                id: -2077048289,
                method: "account.createTheme",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "slug",
                    type: "string"
                }, {
                    name: "title",
                    type: "string"
                }, {
                    name: "document",
                    type: "flags.2?InputDocument"
                }, {
                    name: "settings",
                    type: "flags.3?InputThemeSettings"
                }],
                type: "Theme"
            }, {
                id: 1555261397,
                method: "account.updateTheme",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "format",
                    type: "string"
                }, {
                    name: "theme",
                    type: "InputTheme"
                }, {
                    name: "slug",
                    type: "flags.0?string"
                }, {
                    name: "title",
                    type: "flags.1?string"
                }, {
                    name: "document",
                    type: "flags.2?InputDocument"
                }, {
                    name: "settings",
                    type: "flags.3?InputThemeSettings"
                }],
                type: "Theme"
            }, {
                id: -229175188,
                method: "account.saveTheme",
                params: [{
                    name: "theme",
                    type: "InputTheme"
                }, {
                    name: "unsave",
                    type: "Bool"
                }],
                type: "Bool"
            }, {
                id: 2061776695,
                method: "account.installTheme",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "dark",
                    type: "flags.0?true"
                }, {
                    name: "format",
                    type: "flags.1?string"
                }, {
                    name: "theme",
                    type: "flags.1?InputTheme"
                }],
                type: "Bool"
            }, {
                id: -1919060949,
                method: "account.getTheme",
                params: [{
                    name: "format",
                    type: "string"
                }, {
                    name: "theme",
                    type: "InputTheme"
                }, {
                    name: "document_id",
                    type: "long"
                }],
                type: "Theme"
            }, {
                id: 1913054296,
                method: "account.getThemes",
                params: [{
                    name: "format",
                    type: "string"
                }, {
                    name: "hash",
                    type: "long"
                }],
                type: "account.Themes"
            }, {
                id: -1250643605,
                method: "account.setContentSettings",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "sensitive_enabled",
                    type: "flags.0?true"
                }],
                type: "Bool"
            }, {
                id: -1952756306,
                method: "account.getContentSettings",
                params: [],
                type: "account.ContentSettings"
            }, {
                id: 1705865692,
                method: "account.getMultiWallPapers",
                params: [{
                    name: "wallpapers",
                    type: "Vector<InputWallPaper>"
                }],
                type: "Vector<WallPaper>"
            }, {
                id: -349483786,
                method: "account.getGlobalPrivacySettings",
                params: [],
                type: "GlobalPrivacySettings"
            }, {
                id: 517647042,
                method: "account.setGlobalPrivacySettings",
                params: [{
                    name: "settings",
                    type: "GlobalPrivacySettings"
                }],
                type: "GlobalPrivacySettings"
            }, {
                id: -91437323,
                method: "account.reportProfilePhoto",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "photo_id",
                    type: "InputPhoto"
                }, {
                    name: "reason",
                    type: "ReportReason"
                }, {
                    name: "message",
                    type: "string"
                }],
                type: "Bool"
            }, {
                id: -1828139493,
                method: "account.resetPassword",
                params: [],
                type: "account.ResetPasswordResult"
            }, {
                id: 1284770294,
                method: "account.declinePasswordReset",
                params: [],
                type: "Bool"
            }, {
                id: -690545285,
                method: "account.getChatThemes",
                params: [{
                    name: "hash",
                    type: "int"
                }],
                type: "account.ChatThemes"
            }, {
                id: 227648840,
                method: "users.getUsers",
                params: [{
                    name: "id",
                    type: "Vector<InputUser>"
                }],
                type: "Vector<User>"
            }, {
                id: -902781519,
                method: "users.getFullUser",
                params: [{
                    name: "id",
                    type: "InputUser"
                }],
                type: "UserFull"
            }, {
                id: -1865902923,
                method: "users.setSecureValueErrors",
                params: [{
                    name: "id",
                    type: "InputUser"
                }, {
                    name: "errors",
                    type: "Vector<SecureValueError>"
                }],
                type: "Bool"
            }, {
                id: 2061264541,
                method: "contacts.getContactIDs",
                params: [{
                    name: "hash",
                    type: "long"
                }],
                type: "Vector<int>"
            }, {
                id: -995929106,
                method: "contacts.getStatuses",
                params: [],
                type: "Vector<ContactStatus>"
            }, {
                id: 1574346258,
                method: "contacts.getContacts",
                params: [{
                    name: "hash",
                    type: "long"
                }],
                type: "contacts.Contacts"
            }, {
                id: 746589157,
                method: "contacts.importContacts",
                params: [{
                    name: "contacts",
                    type: "Vector<InputContact>"
                }],
                type: "contacts.ImportedContacts"
            }, {
                id: 157945344,
                method: "contacts.deleteContacts",
                params: [{
                    name: "id",
                    type: "Vector<InputUser>"
                }],
                type: "Updates"
            }, {
                id: 269745566,
                method: "contacts.deleteByPhones",
                params: [{
                    name: "phones",
                    type: "Vector<string>"
                }],
                type: "Bool"
            }, {
                id: 1758204945,
                method: "contacts.block",
                params: [{
                    name: "id",
                    type: "InputPeer"
                }],
                type: "Bool"
            }, {
                id: -1096393392,
                method: "contacts.unblock",
                params: [{
                    name: "id",
                    type: "InputPeer"
                }],
                type: "Bool"
            }, {
                id: -176409329,
                method: "contacts.getBlocked",
                params: [{
                    name: "offset",
                    type: "int"
                }, {
                    name: "limit",
                    type: "int"
                }],
                type: "contacts.Blocked"
            }, {
                id: 301470424,
                method: "contacts.search",
                params: [{
                    name: "q",
                    type: "string"
                }, {
                    name: "limit",
                    type: "int"
                }],
                type: "contacts.Found"
            }, {
                id: -113456221,
                method: "contacts.resolveUsername",
                params: [{
                    name: "username",
                    type: "string"
                }],
                type: "contacts.ResolvedPeer"
            }, {
                id: -1758168906,
                method: "contacts.getTopPeers",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "correspondents",
                    type: "flags.0?true"
                }, {
                    name: "bots_pm",
                    type: "flags.1?true"
                }, {
                    name: "bots_inline",
                    type: "flags.2?true"
                }, {
                    name: "phone_calls",
                    type: "flags.3?true"
                }, {
                    name: "forward_users",
                    type: "flags.4?true"
                }, {
                    name: "forward_chats",
                    type: "flags.5?true"
                }, {
                    name: "groups",
                    type: "flags.10?true"
                }, {
                    name: "channels",
                    type: "flags.15?true"
                }, {
                    name: "offset",
                    type: "int"
                }, {
                    name: "limit",
                    type: "int"
                }, {
                    name: "hash",
                    type: "long"
                }],
                type: "contacts.TopPeers"
            }, {
                id: 451113900,
                method: "contacts.resetTopPeerRating",
                params: [{
                    name: "category",
                    type: "TopPeerCategory"
                }, {
                    name: "peer",
                    type: "InputPeer"
                }],
                type: "Bool"
            }, {
                id: -2020263951,
                method: "contacts.resetSaved",
                params: [],
                type: "Bool"
            }, {
                id: -2098076769,
                method: "contacts.getSaved",
                params: [],
                type: "Vector<SavedContact>"
            }, {
                id: -2062238246,
                method: "contacts.toggleTopPeers",
                params: [{
                    name: "enabled",
                    type: "Bool"
                }],
                type: "Bool"
            }, {
                id: -386636848,
                method: "contacts.addContact",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "add_phone_privacy_exception",
                    type: "flags.0?true"
                }, {
                    name: "id",
                    type: "InputUser"
                }, {
                    name: "first_name",
                    type: "string"
                }, {
                    name: "last_name",
                    type: "string"
                }, {
                    name: "phone",
                    type: "string"
                }],
                type: "Updates"
            }, {
                id: -130964977,
                method: "contacts.acceptContact",
                params: [{
                    name: "id",
                    type: "InputUser"
                }],
                type: "Updates"
            }, {
                id: -750207932,
                method: "contacts.getLocated",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "background",
                    type: "flags.1?true"
                }, {
                    name: "geo_point",
                    type: "InputGeoPoint"
                }, {
                    name: "self_expires",
                    type: "flags.0?int"
                }],
                type: "Updates"
            }, {
                id: 698914348,
                method: "contacts.blockFromReplies",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "delete_message",
                    type: "flags.0?true"
                }, {
                    name: "delete_history",
                    type: "flags.1?true"
                }, {
                    name: "report_spam",
                    type: "flags.2?true"
                }, {
                    name: "msg_id",
                    type: "int"
                }],
                type: "Updates"
            }, {
                id: 1673946374,
                method: "messages.getMessages",
                params: [{
                    name: "id",
                    type: "Vector<InputMessage>"
                }],
                type: "messages.Messages"
            }, {
                id: -1594569905,
                method: "messages.getDialogs",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "exclude_pinned",
                    type: "flags.0?true"
                }, {
                    name: "folder_id",
                    type: "flags.1?int"
                }, {
                    name: "offset_date",
                    type: "int"
                }, {
                    name: "offset_id",
                    type: "int"
                }, {
                    name: "offset_peer",
                    type: "InputPeer"
                }, {
                    name: "limit",
                    type: "int"
                }, {
                    name: "hash",
                    type: "long"
                }],
                type: "messages.Dialogs"
            }, {
                id: 1143203525,
                method: "messages.getHistory",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "offset_id",
                    type: "int"
                }, {
                    name: "offset_date",
                    type: "int"
                }, {
                    name: "add_offset",
                    type: "int"
                }, {
                    name: "limit",
                    type: "int"
                }, {
                    name: "max_id",
                    type: "int"
                }, {
                    name: "min_id",
                    type: "int"
                }, {
                    name: "hash",
                    type: "long"
                }],
                type: "messages.Messages"
            }, {
                id: -1593989278,
                method: "messages.search",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "q",
                    type: "string"
                }, {
                    name: "from_id",
                    type: "flags.0?InputPeer"
                }, {
                    name: "top_msg_id",
                    type: "flags.1?int"
                }, {
                    name: "filter",
                    type: "MessagesFilter"
                }, {
                    name: "min_date",
                    type: "int"
                }, {
                    name: "max_date",
                    type: "int"
                }, {
                    name: "offset_id",
                    type: "int"
                }, {
                    name: "add_offset",
                    type: "int"
                }, {
                    name: "limit",
                    type: "int"
                }, {
                    name: "max_id",
                    type: "int"
                }, {
                    name: "min_id",
                    type: "int"
                }, {
                    name: "hash",
                    type: "long"
                }],
                type: "messages.Messages"
            }, {
                id: 238054714,
                method: "messages.readHistory",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "max_id",
                    type: "int"
                }],
                type: "messages.AffectedMessages"
            }, {
                id: 469850889,
                method: "messages.deleteHistory",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "just_clear",
                    type: "flags.0?true"
                }, {
                    name: "revoke",
                    type: "flags.1?true"
                }, {
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "max_id",
                    type: "int"
                }],
                type: "messages.AffectedHistory"
            }, {
                id: -443640366,
                method: "messages.deleteMessages",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "revoke",
                    type: "flags.0?true"
                }, {
                    name: "id",
                    type: "Vector<int>"
                }],
                type: "messages.AffectedMessages"
            }, {
                id: 94983360,
                method: "messages.receivedMessages",
                params: [{
                    name: "max_id",
                    type: "int"
                }],
                type: "Vector<ReceivedNotifyMessage>"
            }, {
                id: 1486110434,
                method: "messages.setTyping",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "top_msg_id",
                    type: "flags.0?int"
                }, {
                    name: "action",
                    type: "SendMessageAction"
                }],
                type: "Bool"
            }, {
                id: 1376532592,
                method: "messages.sendMessage",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "no_webpage",
                    type: "flags.1?true"
                }, {
                    name: "silent",
                    type: "flags.5?true"
                }, {
                    name: "background",
                    type: "flags.6?true"
                }, {
                    name: "clear_draft",
                    type: "flags.7?true"
                }, {
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "reply_to_msg_id",
                    type: "flags.0?int"
                }, {
                    name: "message",
                    type: "string"
                }, {
                    name: "random_id",
                    type: "long"
                }, {
                    name: "reply_markup",
                    type: "flags.2?ReplyMarkup"
                }, {
                    name: "entities",
                    type: "flags.3?Vector<MessageEntity>"
                }, {
                    name: "schedule_date",
                    type: "flags.10?int"
                }, {
                    name: "noforwards",
                    type: "flags.14?true"
                }],
                type: "Updates"
            }, {
                id: 881978281,
                method: "messages.sendMedia",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "silent",
                    type: "flags.5?true"
                }, {
                    name: "background",
                    type: "flags.6?true"
                }, {
                    name: "clear_draft",
                    type: "flags.7?true"
                }, {
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "reply_to_msg_id",
                    type: "flags.0?int"
                }, {
                    name: "media",
                    type: "InputMedia"
                }, {
                    name: "message",
                    type: "string"
                }, {
                    name: "random_id",
                    type: "long"
                }, {
                    name: "reply_markup",
                    type: "flags.2?ReplyMarkup"
                }, {
                    name: "entities",
                    type: "flags.3?Vector<MessageEntity>"
                }, {
                    name: "schedule_date",
                    type: "flags.10?int"
                }, {
                    name: "noforwards",
                    type: "flags.14?true"
                }],
                type: "Updates"
            }, {
                id: -637606386,
                method: "messages.forwardMessages",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "silent",
                    type: "flags.5?true"
                }, {
                    name: "background",
                    type: "flags.6?true"
                }, {
                    name: "with_my_score",
                    type: "flags.8?true"
                }, {
                    name: "drop_author",
                    type: "flags.11?true"
                }, {
                    name: "drop_media_captions",
                    type: "flags.12?true"
                }, {
                    name: "from_peer",
                    type: "InputPeer"
                }, {
                    name: "id",
                    type: "Vector<int>"
                }, {
                    name: "random_id",
                    type: "Vector<long>"
                }, {
                    name: "to_peer",
                    type: "InputPeer"
                }, {
                    name: "schedule_date",
                    type: "flags.10?int"
                }, {
                    name: "noforwards",
                    type: "flags.14?true"
                }],
                type: "Updates"
            }, {
                id: -820669733,
                method: "messages.reportSpam",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }],
                type: "Bool"
            }, {
                id: 913498268,
                method: "messages.getPeerSettings",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }],
                type: "PeerSettings"
            }, {
                id: -1991005362,
                method: "messages.report",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "id",
                    type: "Vector<int>"
                }, {
                    name: "reason",
                    type: "ReportReason"
                }, {
                    name: "message",
                    type: "string"
                }],
                type: "Bool"
            }, {
                id: 1240027791,
                method: "messages.getChats",
                params: [{
                    name: "id",
                    type: "Vector<long>"
                }],
                type: "messages.Chats"
            }, {
                id: -1364194508,
                method: "messages.getFullChat",
                params: [{
                    name: "chat_id",
                    type: "long"
                }],
                type: "messages.ChatFull"
            }, {
                id: 1937260541,
                method: "messages.editChatTitle",
                params: [{
                    name: "chat_id",
                    type: "long"
                }, {
                    name: "title",
                    type: "string"
                }],
                type: "Updates"
            }, {
                id: 903730804,
                method: "messages.editChatPhoto",
                params: [{
                    name: "chat_id",
                    type: "long"
                }, {
                    name: "photo",
                    type: "InputChatPhoto"
                }],
                type: "Updates"
            }, {
                id: -230206493,
                method: "messages.addChatUser",
                params: [{
                    name: "chat_id",
                    type: "long"
                }, {
                    name: "user_id",
                    type: "InputUser"
                }, {
                    name: "fwd_limit",
                    type: "int"
                }],
                type: "Updates"
            }, {
                id: -1575461717,
                method: "messages.deleteChatUser",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "revoke_history",
                    type: "flags.0?true"
                }, {
                    name: "chat_id",
                    type: "long"
                }, {
                    name: "user_id",
                    type: "InputUser"
                }],
                type: "Updates"
            }, {
                id: 164303470,
                method: "messages.createChat",
                params: [{
                    name: "users",
                    type: "Vector<InputUser>"
                }, {
                    name: "title",
                    type: "string"
                }],
                type: "Updates"
            }, {
                id: 651135312,
                method: "messages.getDhConfig",
                params: [{
                    name: "version",
                    type: "int"
                }, {
                    name: "random_length",
                    type: "int"
                }],
                type: "messages.DhConfig"
            }, {
                id: -162681021,
                method: "messages.requestEncryption",
                params: [{
                    name: "user_id",
                    type: "InputUser"
                }, {
                    name: "random_id",
                    type: "int"
                }, {
                    name: "g_a",
                    type: "bytes"
                }],
                type: "EncryptedChat"
            }, {
                id: 1035731989,
                method: "messages.acceptEncryption",
                params: [{
                    name: "peer",
                    type: "InputEncryptedChat"
                }, {
                    name: "g_b",
                    type: "bytes"
                }, {
                    name: "key_fingerprint",
                    type: "long"
                }],
                type: "EncryptedChat"
            }, {
                id: -208425312,
                method: "messages.discardEncryption",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "delete_history",
                    type: "flags.0?true"
                }, {
                    name: "chat_id",
                    type: "int"
                }],
                type: "Bool"
            }, {
                id: 2031374829,
                method: "messages.setEncryptedTyping",
                params: [{
                    name: "peer",
                    type: "InputEncryptedChat"
                }, {
                    name: "typing",
                    type: "Bool"
                }],
                type: "Bool"
            }, {
                id: 2135648522,
                method: "messages.readEncryptedHistory",
                params: [{
                    name: "peer",
                    type: "InputEncryptedChat"
                }, {
                    name: "max_date",
                    type: "int"
                }],
                type: "Bool"
            }, {
                id: 1157265941,
                method: "messages.sendEncrypted",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "silent",
                    type: "flags.0?true"
                }, {
                    name: "peer",
                    type: "InputEncryptedChat"
                }, {
                    name: "random_id",
                    type: "long"
                }, {
                    name: "data",
                    type: "bytes"
                }],
                type: "messages.SentEncryptedMessage"
            }, {
                id: 1431914525,
                method: "messages.sendEncryptedFile",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "silent",
                    type: "flags.0?true"
                }, {
                    name: "peer",
                    type: "InputEncryptedChat"
                }, {
                    name: "random_id",
                    type: "long"
                }, {
                    name: "data",
                    type: "bytes"
                }, {
                    name: "file",
                    type: "InputEncryptedFile"
                }],
                type: "messages.SentEncryptedMessage"
            }, {
                id: 852769188,
                method: "messages.sendEncryptedService",
                params: [{
                    name: "peer",
                    type: "InputEncryptedChat"
                }, {
                    name: "random_id",
                    type: "long"
                }, {
                    name: "data",
                    type: "bytes"
                }],
                type: "messages.SentEncryptedMessage"
            }, {
                id: 1436924774,
                method: "messages.receivedQueue",
                params: [{
                    name: "max_qts",
                    type: "int"
                }],
                type: "Vector<long>"
            }, {
                id: 1259113487,
                method: "messages.reportEncryptedSpam",
                params: [{
                    name: "peer",
                    type: "InputEncryptedChat"
                }],
                type: "Bool"
            }, {
                id: 916930423,
                method: "messages.readMessageContents",
                params: [{
                    name: "id",
                    type: "Vector<int>"
                }],
                type: "messages.AffectedMessages"
            }, {
                id: -710552671,
                method: "messages.getStickers",
                params: [{
                    name: "emoticon",
                    type: "string"
                }, {
                    name: "hash",
                    type: "long"
                }],
                type: "messages.Stickers"
            }, {
                id: -1197432408,
                method: "messages.getAllStickers",
                params: [{
                    name: "hash",
                    type: "long"
                }],
                type: "messages.AllStickers"
            }, {
                id: -1956073268,
                method: "messages.getWebPagePreview",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "message",
                    type: "string"
                }, {
                    name: "entities",
                    type: "flags.3?Vector<MessageEntity>"
                }],
                type: "MessageMedia"
            }, {
                id: 347716823,
                method: "messages.exportChatInvite",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "legacy_revoke_permanent",
                    type: "flags.2?true"
                }, {
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "expire_date",
                    type: "flags.0?int"
                }, {
                    name: "usage_limit",
                    type: "flags.1?int"
                }],
                type: "ExportedChatInvite"
            }, {
                id: 2106086025,
                method: "messages.exportChatInviteLayer84",
                params: [{
                    name: "chat_id",
                    type: "int"
                }],
                type: "ExportedChatInvite"
            }, {
                id: 1051570619,
                method: "messages.checkChatInvite",
                params: [{
                    name: "hash",
                    type: "string"
                }],
                type: "ChatInvite"
            }, {
                id: 1817183516,
                method: "messages.importChatInvite",
                params: [{
                    name: "hash",
                    type: "string"
                }],
                type: "Updates"
            }, {
                id: 639215886,
                method: "messages.getStickerSet",
                params: [{
                    name: "stickerset",
                    type: "InputStickerSet"
                }],
                type: "messages.StickerSet"
            }, {
                id: -946871200,
                method: "messages.installStickerSet",
                params: [{
                    name: "stickerset",
                    type: "InputStickerSet"
                }, {
                    name: "archived",
                    type: "Bool"
                }],
                type: "messages.StickerSetInstallResult"
            }, {
                id: -110209570,
                method: "messages.uninstallStickerSet",
                params: [{
                    name: "stickerset",
                    type: "InputStickerSet"
                }],
                type: "Bool"
            }, {
                id: -421563528,
                method: "messages.startBot",
                params: [{
                    name: "bot",
                    type: "InputUser"
                }, {
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "random_id",
                    type: "long"
                }, {
                    name: "start_param",
                    type: "string"
                }],
                type: "Updates"
            }, {
                id: 1468322785,
                method: "messages.getMessagesViews",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "id",
                    type: "Vector<int>"
                }, {
                    name: "increment",
                    type: "Bool"
                }],
                type: "messages.MessageViews"
            }, {
                id: -1470377534,
                method: "messages.editChatAdmin",
                params: [{
                    name: "chat_id",
                    type: "long"
                }, {
                    name: "user_id",
                    type: "InputUser"
                }, {
                    name: "is_admin",
                    type: "Bool"
                }],
                type: "Bool"
            }, {
                id: -1568189671,
                method: "messages.migrateChat",
                params: [{
                    name: "chat_id",
                    type: "long"
                }],
                type: "Updates"
            }, {
                id: 1271290010,
                method: "messages.searchGlobal",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "folder_id",
                    type: "flags.0?int"
                }, {
                    name: "q",
                    type: "string"
                }, {
                    name: "filter",
                    type: "MessagesFilter"
                }, {
                    name: "min_date",
                    type: "int"
                }, {
                    name: "max_date",
                    type: "int"
                }, {
                    name: "offset_rate",
                    type: "int"
                }, {
                    name: "offset_peer",
                    type: "InputPeer"
                }, {
                    name: "offset_id",
                    type: "int"
                }, {
                    name: "limit",
                    type: "int"
                }],
                type: "messages.Messages"
            }, {
                id: 711765008,
                method: "messages.searchGlobalExt",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "q",
                    type: "string"
                }, {
                    name: "offset_date",
                    type: "int"
                }, {
                    name: "offset_peer",
                    type: "InputPeer"
                }, {
                    name: "offset_id",
                    type: "int"
                }, {
                    name: "limit",
                    type: "int"
                }],
                type: "messages.Messages"
            }, {
                id: 2016638777,
                method: "messages.reorderStickerSets",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "masks",
                    type: "flags.0?true"
                }, {
                    name: "order",
                    type: "Vector<long>"
                }],
                type: "Bool"
            }, {
                id: 864953444,
                method: "messages.getDocumentByHash",
                params: [{
                    name: "sha256",
                    type: "bytes"
                }, {
                    name: "size",
                    type: "int"
                }, {
                    name: "mime_type",
                    type: "string"
                }],
                type: "Document"
            }, {
                id: 1559270965,
                method: "messages.getSavedGifs",
                params: [{
                    name: "hash",
                    type: "long"
                }],
                type: "messages.SavedGifs"
            }, {
                id: 846868683,
                method: "messages.saveGif",
                params: [{
                    name: "id",
                    type: "InputDocument"
                }, {
                    name: "unsave",
                    type: "Bool"
                }],
                type: "Bool"
            }, {
                id: 1364105629,
                method: "messages.getInlineBotResults",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "bot",
                    type: "InputUser"
                }, {
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "geo_point",
                    type: "flags.0?InputGeoPoint"
                }, {
                    name: "query",
                    type: "string"
                }, {
                    name: "offset",
                    type: "string"
                }],
                type: "messages.BotResults"
            }, {
                id: -346119674,
                method: "messages.setInlineBotResults",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "gallery",
                    type: "flags.0?true"
                }, {
                    name: "private",
                    type: "flags.1?true"
                }, {
                    name: "query_id",
                    type: "long"
                }, {
                    name: "results",
                    type: "Vector<InputBotInlineResult>"
                }, {
                    name: "cache_time",
                    type: "int"
                }, {
                    name: "next_offset",
                    type: "flags.2?string"
                }, {
                    name: "switch_pm",
                    type: "flags.3?InlineBotSwitchPM"
                }],
                type: "Bool"
            }, {
                id: 570955184,
                method: "messages.sendInlineBotResult",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "silent",
                    type: "flags.5?true"
                }, {
                    name: "background",
                    type: "flags.6?true"
                }, {
                    name: "clear_draft",
                    type: "flags.7?true"
                }, {
                    name: "hide_via",
                    type: "flags.11?true"
                }, {
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "reply_to_msg_id",
                    type: "flags.0?int"
                }, {
                    name: "random_id",
                    type: "long"
                }, {
                    name: "query_id",
                    type: "long"
                }, {
                    name: "id",
                    type: "string"
                }, {
                    name: "schedule_date",
                    type: "flags.10?int"
                }],
                type: "Updates"
            }, {
                id: -39416522,
                method: "messages.getMessageEditData",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "id",
                    type: "int"
                }],
                type: "messages.MessageEditData"
            }, {
                id: 1224152952,
                method: "messages.editMessage",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "no_webpage",
                    type: "flags.1?true"
                }, {
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "id",
                    type: "int"
                }, {
                    name: "message",
                    type: "flags.11?string"
                }, {
                    name: "media",
                    type: "flags.14?InputMedia"
                }, {
                    name: "reply_markup",
                    type: "flags.2?ReplyMarkup"
                }, {
                    name: "entities",
                    type: "flags.3?Vector<MessageEntity>"
                }, {
                    name: "schedule_date",
                    type: "flags.15?int"
                }],
                type: "Updates"
            }, {
                id: -2091549254,
                method: "messages.editInlineBotMessage",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "no_webpage",
                    type: "flags.1?true"
                }, {
                    name: "id",
                    type: "InputBotInlineMessageID"
                }, {
                    name: "message",
                    type: "flags.11?string"
                }, {
                    name: "media",
                    type: "flags.14?InputMedia"
                }, {
                    name: "reply_markup",
                    type: "flags.2?ReplyMarkup"
                }, {
                    name: "entities",
                    type: "flags.3?Vector<MessageEntity>"
                }],
                type: "Bool"
            }, {
                id: -1824339449,
                method: "messages.getBotCallbackAnswer",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "game",
                    type: "flags.1?true"
                }, {
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "msg_id",
                    type: "int"
                }, {
                    name: "data",
                    type: "flags.0?bytes"
                }, {
                    name: "password",
                    type: "flags.2?InputCheckPasswordSRP"
                }],
                type: "messages.BotCallbackAnswer"
            }, {
                id: -712043766,
                method: "messages.setBotCallbackAnswer",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "alert",
                    type: "flags.1?true"
                }, {
                    name: "query_id",
                    type: "long"
                }, {
                    name: "message",
                    type: "flags.0?string"
                }, {
                    name: "url",
                    type: "flags.2?string"
                }, {
                    name: "cache_time",
                    type: "int"
                }],
                type: "Bool"
            }, {
                id: -462373635,
                method: "messages.getPeerDialogs",
                params: [{
                    name: "peers",
                    type: "Vector<InputPeer>"
                }],
                type: "messages.PeerDialogs"
            }, {
                id: -1137057461,
                method: "messages.saveDraft",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "no_webpage",
                    type: "flags.1?true"
                }, {
                    name: "reply_to_msg_id",
                    type: "flags.0?int"
                }, {
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "message",
                    type: "string"
                }, {
                    name: "entities",
                    type: "flags.3?Vector<MessageEntity>"
                }],
                type: "Bool"
            }, {
                id: 1782549861,
                method: "messages.getAllDrafts",
                params: [],
                type: "Updates"
            }, {
                id: 1685588756,
                method: "messages.getFeaturedStickers",
                params: [{
                    name: "hash",
                    type: "long"
                }],
                type: "messages.FeaturedStickers"
            }, {
                id: 1527873830,
                method: "messages.readFeaturedStickers",
                params: [{
                    name: "id",
                    type: "Vector<long>"
                }],
                type: "Bool"
            }, {
                id: -1649852357,
                method: "messages.getRecentStickers",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "attached",
                    type: "flags.0?true"
                }, {
                    name: "hash",
                    type: "long"
                }],
                type: "messages.RecentStickers"
            }, {
                id: 958863608,
                method: "messages.saveRecentSticker",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "attached",
                    type: "flags.0?true"
                }, {
                    name: "id",
                    type: "InputDocument"
                }, {
                    name: "unsave",
                    type: "Bool"
                }],
                type: "Bool"
            }, {
                id: -1986437075,
                method: "messages.clearRecentStickers",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "attached",
                    type: "flags.0?true"
                }],
                type: "Bool"
            }, {
                id: 1475442322,
                method: "messages.getArchivedStickers",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "masks",
                    type: "flags.0?true"
                }, {
                    name: "offset_id",
                    type: "long"
                }, {
                    name: "limit",
                    type: "int"
                }],
                type: "messages.ArchivedStickers"
            }, {
                id: 1678738104,
                method: "messages.getMaskStickers",
                params: [{
                    name: "hash",
                    type: "long"
                }],
                type: "messages.AllStickers"
            }, {
                id: -866424884,
                method: "messages.getAttachedStickers",
                params: [{
                    name: "media",
                    type: "InputStickeredMedia"
                }],
                type: "Vector<StickerSetCovered>"
            }, {
                id: -1896289088,
                method: "messages.setGameScore",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "edit_message",
                    type: "flags.0?true"
                }, {
                    name: "force",
                    type: "flags.1?true"
                }, {
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "id",
                    type: "int"
                }, {
                    name: "user_id",
                    type: "InputUser"
                }, {
                    name: "score",
                    type: "int"
                }],
                type: "Updates"
            }, {
                id: 363700068,
                method: "messages.setInlineGameScore",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "edit_message",
                    type: "flags.0?true"
                }, {
                    name: "force",
                    type: "flags.1?true"
                }, {
                    name: "id",
                    type: "InputBotInlineMessageID"
                }, {
                    name: "user_id",
                    type: "InputUser"
                }, {
                    name: "score",
                    type: "int"
                }],
                type: "Bool"
            }, {
                id: -400399203,
                method: "messages.getGameHighScores",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "id",
                    type: "int"
                }, {
                    name: "user_id",
                    type: "InputUser"
                }],
                type: "messages.HighScores"
            }, {
                id: 258170395,
                method: "messages.getInlineGameHighScores",
                params: [{
                    name: "id",
                    type: "InputBotInlineMessageID"
                }, {
                    name: "user_id",
                    type: "InputUser"
                }],
                type: "messages.HighScores"
            }, {
                id: -468934396,
                method: "messages.getCommonChats",
                params: [{
                    name: "user_id",
                    type: "InputUser"
                }, {
                    name: "max_id",
                    type: "long"
                }, {
                    name: "limit",
                    type: "int"
                }],
                type: "messages.Chats"
            }, {
                id: -2023787330,
                method: "messages.getAllChats",
                params: [{
                    name: "except_ids",
                    type: "Vector<long>"
                }],
                type: "messages.Chats"
            }, {
                id: 852135825,
                method: "messages.getWebPage",
                params: [{
                    name: "url",
                    type: "string"
                }, {
                    name: "hash",
                    type: "int"
                }],
                type: "WebPage"
            }, {
                id: -1489903017,
                method: "messages.toggleDialogPin",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "pinned",
                    type: "flags.0?true"
                }, {
                    name: "peer",
                    type: "InputDialogPeer"
                }],
                type: "Bool"
            }, {
                id: 991616823,
                method: "messages.reorderPinnedDialogs",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "force",
                    type: "flags.0?true"
                }, {
                    name: "folder_id",
                    type: "int"
                }, {
                    name: "order",
                    type: "Vector<InputDialogPeer>"
                }],
                type: "Bool"
            }, {
                id: -692498958,
                method: "messages.getPinnedDialogs",
                params: [{
                    name: "folder_id",
                    type: "int"
                }],
                type: "messages.PeerDialogs"
            }, {
                id: -436833542,
                method: "messages.setBotShippingResults",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "query_id",
                    type: "long"
                }, {
                    name: "error",
                    type: "flags.0?string"
                }, {
                    name: "shipping_options",
                    type: "flags.1?Vector<ShippingOption>"
                }],
                type: "Bool"
            }, {
                id: 163765653,
                method: "messages.setBotPrecheckoutResults",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "success",
                    type: "flags.1?true"
                }, {
                    name: "query_id",
                    type: "long"
                }, {
                    name: "error",
                    type: "flags.0?string"
                }],
                type: "Bool"
            }, {
                id: 1369162417,
                method: "messages.uploadMedia",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "media",
                    type: "InputMedia"
                }],
                type: "MessageMedia"
            }, {
                id: -914493408,
                method: "messages.sendScreenshotNotification",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "reply_to_msg_id",
                    type: "int"
                }, {
                    name: "random_id",
                    type: "long"
                }],
                type: "Updates"
            }, {
                id: 82946729,
                method: "messages.getFavedStickers",
                params: [{
                    name: "hash",
                    type: "long"
                }],
                type: "messages.FavedStickers"
            }, {
                id: -1174420133,
                method: "messages.faveSticker",
                params: [{
                    name: "id",
                    type: "InputDocument"
                }, {
                    name: "unfave",
                    type: "Bool"
                }],
                type: "Bool"
            }, {
                id: 1180140658,
                method: "messages.getUnreadMentions",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "offset_id",
                    type: "int"
                }, {
                    name: "add_offset",
                    type: "int"
                }, {
                    name: "limit",
                    type: "int"
                }, {
                    name: "max_id",
                    type: "int"
                }, {
                    name: "min_id",
                    type: "int"
                }],
                type: "messages.Messages"
            }, {
                id: 251759059,
                method: "messages.readMentions",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }],
                type: "messages.AffectedHistory"
            }, {
                id: 1881817312,
                method: "messages.getRecentLocations",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "limit",
                    type: "int"
                }, {
                    name: "hash",
                    type: "long"
                }],
                type: "messages.Messages"
            }, {
                id: -872345397,
                method: "messages.sendMultiMedia",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "silent",
                    type: "flags.5?true"
                }, {
                    name: "background",
                    type: "flags.6?true"
                }, {
                    name: "clear_draft",
                    type: "flags.7?true"
                }, {
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "reply_to_msg_id",
                    type: "flags.0?int"
                }, {
                    name: "multi_media",
                    type: "Vector<InputSingleMedia>"
                }, {
                    name: "schedule_date",
                    type: "flags.10?int"
                }, {
                    name: "noforwards",
                    type: "flags.14?true"
                }],
                type: "Updates"
            }, {
                id: 1347929239,
                method: "messages.uploadEncryptedFile",
                params: [{
                    name: "peer",
                    type: "InputEncryptedChat"
                }, {
                    name: "file",
                    type: "InputEncryptedFile"
                }],
                type: "EncryptedFile"
            }, {
                id: 896555914,
                method: "messages.searchStickerSets",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "exclude_featured",
                    type: "flags.0?true"
                }, {
                    name: "q",
                    type: "string"
                }, {
                    name: "hash",
                    type: "long"
                }],
                type: "messages.FoundStickerSets"
            }, {
                id: 486505992,
                method: "messages.getSplitRanges",
                params: [],
                type: "Vector<MessageRange>"
            }, {
                id: -1031349873,
                method: "messages.markDialogUnread",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "unread",
                    type: "flags.0?true"
                }, {
                    name: "peer",
                    type: "InputDialogPeer"
                }],
                type: "Bool"
            }, {
                id: 585256482,
                method: "messages.getDialogUnreadMarks",
                params: [],
                type: "Vector<DialogPeer>"
            }, {
                id: 2119757468,
                method: "messages.clearAllDrafts",
                params: [],
                type: "Bool"
            }, {
                id: -760547348,
                method: "messages.updatePinnedMessage",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "silent",
                    type: "flags.0?true"
                }, {
                    name: "unpin",
                    type: "flags.1?true"
                }, {
                    name: "pm_oneside",
                    type: "flags.2?true"
                }, {
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "id",
                    type: "int"
                }],
                type: "Updates"
            }, {
                id: 283795844,
                method: "messages.sendVote",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "msg_id",
                    type: "int"
                }, {
                    name: "options",
                    type: "Vector<bytes>"
                }],
                type: "Updates"
            }, {
                id: 1941660731,
                method: "messages.getPollResults",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "msg_id",
                    type: "int"
                }],
                type: "Updates"
            }, {
                id: 1848369232,
                method: "messages.getOnlines",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }],
                type: "ChatOnlines"
            }, {
                id: -2127811866,
                method: "messages.getStatsURL",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "dark",
                    type: "flags.0?true"
                }, {
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "params",
                    type: "string"
                }],
                type: "StatsURL"
            }, {
                id: -554301545,
                method: "messages.editChatAbout",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "about",
                    type: "string"
                }],
                type: "Bool"
            }, {
                id: -1517917375,
                method: "messages.editChatDefaultBannedRights",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "banned_rights",
                    type: "ChatBannedRights"
                }],
                type: "Updates"
            }, {
                id: 899735650,
                method: "messages.getEmojiKeywords",
                params: [{
                    name: "lang_code",
                    type: "string"
                }],
                type: "EmojiKeywordsDifference"
            }, {
                id: 352892591,
                method: "messages.getEmojiKeywordsDifference",
                params: [{
                    name: "lang_code",
                    type: "string"
                }, {
                    name: "from_version",
                    type: "int"
                }],
                type: "EmojiKeywordsDifference"
            }, {
                id: 1318675378,
                method: "messages.getEmojiKeywordsLanguages",
                params: [{
                    name: "lang_codes",
                    type: "Vector<string>"
                }],
                type: "Vector<EmojiLanguage>"
            }, {
                id: -709817306,
                method: "messages.getEmojiURL",
                params: [{
                    name: "lang_code",
                    type: "string"
                }],
                type: "EmojiURL"
            }, {
                id: 1932455680,
                method: "messages.getSearchCounters",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "filters",
                    type: "Vector<MessagesFilter>"
                }],
                type: "Vector<messages.SearchCounter>"
            }, {
                id: 428848198,
                method: "messages.requestUrlAuth",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "peer",
                    type: "flags.1?InputPeer"
                }, {
                    name: "msg_id",
                    type: "flags.1?int"
                }, {
                    name: "button_id",
                    type: "flags.1?int"
                }, {
                    name: "url",
                    type: "flags.2?string"
                }],
                type: "UrlAuthResult"
            }, {
                id: -1322487515,
                method: "messages.acceptUrlAuth",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "write_allowed",
                    type: "flags.0?true"
                }, {
                    name: "peer",
                    type: "flags.1?InputPeer"
                }, {
                    name: "msg_id",
                    type: "flags.1?int"
                }, {
                    name: "button_id",
                    type: "flags.1?int"
                }, {
                    name: "url",
                    type: "flags.2?string"
                }],
                type: "UrlAuthResult"
            }, {
                id: 1336717624,
                method: "messages.hidePeerSettingsBar",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }],
                type: "Bool"
            }, {
                id: -183077365,
                method: "messages.getScheduledHistory",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "hash",
                    type: "long"
                }],
                type: "messages.Messages"
            }, {
                id: -1111817116,
                method: "messages.getScheduledMessages",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "id",
                    type: "Vector<int>"
                }],
                type: "messages.Messages"
            }, {
                id: -1120369398,
                method: "messages.sendScheduledMessages",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "id",
                    type: "Vector<int>"
                }],
                type: "Updates"
            }, {
                id: 1504586518,
                method: "messages.deleteScheduledMessages",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "id",
                    type: "Vector<int>"
                }],
                type: "Updates"
            }, {
                id: -1200736242,
                method: "messages.getPollVotes",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "id",
                    type: "int"
                }, {
                    name: "option",
                    type: "flags.0?bytes"
                }, {
                    name: "offset",
                    type: "flags.1?string"
                }, {
                    name: "limit",
                    type: "int"
                }],
                type: "messages.VotesList"
            }, {
                id: -1257951254,
                method: "messages.toggleStickerSets",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "uninstall",
                    type: "flags.0?true"
                }, {
                    name: "archive",
                    type: "flags.1?true"
                }, {
                    name: "unarchive",
                    type: "flags.2?true"
                }, {
                    name: "stickersets",
                    type: "Vector<InputStickerSet>"
                }],
                type: "Bool"
            }, {
                id: -241247891,
                method: "messages.getDialogFilters",
                params: [],
                type: "Vector<DialogFilter>"
            }, {
                id: -1566780372,
                method: "messages.getSuggestedDialogFilters",
                params: [],
                type: "Vector<DialogFilterSuggested>"
            }, {
                id: 450142282,
                method: "messages.updateDialogFilter",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "id",
                    type: "int"
                }, {
                    name: "filter",
                    type: "flags.0?DialogFilter"
                }],
                type: "Bool"
            }, {
                id: -983318044,
                method: "messages.updateDialogFiltersOrder",
                params: [{
                    name: "order",
                    type: "Vector<int>"
                }],
                type: "Bool"
            }, {
                id: 2127598753,
                method: "messages.getOldFeaturedStickers",
                params: [{
                    name: "offset",
                    type: "int"
                }, {
                    name: "limit",
                    type: "int"
                }, {
                    name: "hash",
                    type: "long"
                }],
                type: "messages.FeaturedStickers"
            }, {
                id: 584962828,
                method: "messages.getReplies",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "msg_id",
                    type: "int"
                }, {
                    name: "offset_id",
                    type: "int"
                }, {
                    name: "offset_date",
                    type: "int"
                }, {
                    name: "add_offset",
                    type: "int"
                }, {
                    name: "limit",
                    type: "int"
                }, {
                    name: "max_id",
                    type: "int"
                }, {
                    name: "min_id",
                    type: "int"
                }, {
                    name: "hash",
                    type: "long"
                }],
                type: "messages.Messages"
            }, {
                id: 1147761405,
                method: "messages.getDiscussionMessage",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "msg_id",
                    type: "int"
                }],
                type: "messages.DiscussionMessage"
            }, {
                id: -147740172,
                method: "messages.readDiscussion",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "msg_id",
                    type: "int"
                }, {
                    name: "read_max_id",
                    type: "int"
                }],
                type: "Bool"
            }, {
                id: -265962357,
                method: "messages.unpinAllMessages",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }],
                type: "messages.AffectedHistory"
            }, {
                id: 1540419152,
                method: "messages.deleteChat",
                params: [{
                    name: "chat_id",
                    type: "long"
                }],
                type: "Bool"
            }, {
                id: -104078327,
                method: "messages.deletePhoneCallHistory",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "revoke",
                    type: "flags.0?true"
                }],
                type: "messages.AffectedFoundMessages"
            }, {
                id: 1140726259,
                method: "messages.checkHistoryImport",
                params: [{
                    name: "import_head",
                    type: "string"
                }],
                type: "messages.HistoryImportParsed"
            }, {
                id: 873008187,
                method: "messages.initHistoryImport",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "file",
                    type: "InputFile"
                }, {
                    name: "media_count",
                    type: "int"
                }],
                type: "messages.HistoryImport"
            }, {
                id: 713433234,
                method: "messages.uploadImportedMedia",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "import_id",
                    type: "long"
                }, {
                    name: "file_name",
                    type: "string"
                }, {
                    name: "media",
                    type: "InputMedia"
                }],
                type: "MessageMedia"
            }, {
                id: -1271008444,
                method: "messages.startHistoryImport",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "import_id",
                    type: "long"
                }],
                type: "Bool"
            }, {
                id: -1565154314,
                method: "messages.getExportedChatInvites",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "revoked",
                    type: "flags.3?true"
                }, {
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "admin_id",
                    type: "InputUser"
                }, {
                    name: "offset_date",
                    type: "flags.2?int"
                }, {
                    name: "offset_link",
                    type: "flags.2?string"
                }, {
                    name: "limit",
                    type: "int"
                }],
                type: "messages.ExportedChatInvites"
            }, {
                id: 1937010524,
                method: "messages.getExportedChatInvite",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "link",
                    type: "string"
                }],
                type: "messages.ExportedChatInvite"
            }, {
                id: 48562110,
                method: "messages.editExportedChatInvite",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "revoked",
                    type: "flags.2?true"
                }, {
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "link",
                    type: "string"
                }, {
                    name: "expire_date",
                    type: "flags.0?int"
                }, {
                    name: "usage_limit",
                    type: "flags.1?int"
                }],
                type: "messages.ExportedChatInvite"
            }, {
                id: 1452833749,
                method: "messages.deleteRevokedExportedChatInvites",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "admin_id",
                    type: "InputUser"
                }],
                type: "Bool"
            }, {
                id: -731601877,
                method: "messages.deleteExportedChatInvite",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "link",
                    type: "string"
                }],
                type: "Bool"
            }, {
                id: 958457583,
                method: "messages.getAdminsWithInvites",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }],
                type: "messages.ChatAdminsWithInvites"
            }, {
                id: 654013065,
                method: "messages.getChatInviteImporters",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "link",
                    type: "string"
                }, {
                    name: "offset_date",
                    type: "int"
                }, {
                    name: "offset_user",
                    type: "InputUser"
                }, {
                    name: "limit",
                    type: "int"
                }],
                type: "messages.ChatInviteImporters"
            }, {
                id: -1207017500,
                method: "messages.setHistoryTTL",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "period",
                    type: "int"
                }],
                type: "Updates"
            }, {
                id: 1573261059,
                method: "messages.checkHistoryImportPeer",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }],
                type: "messages.CheckedHistoryImportPeer"
            }, {
                id: -432283329,
                method: "messages.setChatTheme",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "emoticon",
                    type: "string"
                }],
                type: "Updates"
            }, {
                id: 745510839,
                method: "messages.getMessageReadParticipants",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "msg_id",
                    type: "int"
                }],
                type: "Vector<long>"
            }, {
                id: -304838614,
                method: "updates.getState",
                params: [],
                type: "updates.State"
            }, {
                id: 630429265,
                method: "updates.getDifference",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "pts",
                    type: "int"
                }, {
                    name: "pts_total_limit",
                    type: "flags.0?int"
                }, {
                    name: "date",
                    type: "int"
                }, {
                    name: "qts",
                    type: "int"
                }],
                type: "updates.Difference"
            }, {
                id: 51854712,
                method: "updates.getChannelDifference",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "force",
                    type: "flags.0?true"
                }, {
                    name: "channel",
                    type: "InputChannel"
                }, {
                    name: "filter",
                    type: "ChannelMessagesFilter"
                }, {
                    name: "pts",
                    type: "int"
                }, {
                    name: "limit",
                    type: "int"
                }],
                type: "updates.ChannelDifference"
            }, {
                id: 1926525996,
                method: "photos.updateProfilePhoto",
                params: [{
                    name: "id",
                    type: "InputPhoto"
                }],
                type: "photos.Photo"
            }, {
                id: -1980559511,
                method: "photos.uploadProfilePhoto",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "file",
                    type: "flags.0?InputFile"
                }, {
                    name: "video",
                    type: "flags.1?InputFile"
                }, {
                    name: "video_start_ts",
                    type: "flags.2?double"
                }],
                type: "photos.Photo"
            }, {
                id: -2016444625,
                method: "photos.deletePhotos",
                params: [{
                    name: "id",
                    type: "Vector<InputPhoto>"
                }],
                type: "Vector<long>"
            }, {
                id: -1848823128,
                method: "photos.getUserPhotos",
                params: [{
                    name: "user_id",
                    type: "InputUser"
                }, {
                    name: "offset",
                    type: "int"
                }, {
                    name: "max_id",
                    type: "long"
                }, {
                    name: "limit",
                    type: "int"
                }],
                type: "photos.Photos"
            }, {
                id: -1291540959,
                method: "upload.saveFilePart",
                params: [{
                    name: "file_id",
                    type: "long"
                }, {
                    name: "file_part",
                    type: "int"
                }, {
                    name: "bytes",
                    type: "bytes"
                }, {
                    name: "flags",
                    type: "#"
                }, {
                    name: "peer",
                    type: "flags.0?Peer"
                }, {
                    name: "totalFileSize",
                    type: "flags.1?long"
                }],
                type: "Bool"
            }, {
                id: -1319462148,
                method: "upload.getFile",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "precise",
                    type: "flags.0?true"
                }, {
                    name: "cdn_supported",
                    type: "flags.1?true"
                }, {
                    name: "location",
                    type: "InputFileLocation"
                }, {
                    name: "offset",
                    type: "int"
                }, {
                    name: "limit",
                    type: "int"
                }],
                type: "upload.File"
            }, {
                id: -475607115,
                method: "upload.getFile2",
                params: [{
                    name: "location",
                    type: "InputFileLocation"
                }, {
                    name: "offset",
                    type: "int"
                }, {
                    name: "limit",
                    type: "int"
                }],
                type: "upload.File"
            }, {
                id: -562337987,
                method: "upload.saveBigFilePart",
                params: [{
                    name: "file_id",
                    type: "long"
                }, {
                    name: "file_part",
                    type: "int"
                }, {
                    name: "file_total_parts",
                    type: "int"
                }, {
                    name: "bytes",
                    type: "bytes"
                }, {
                    name: "flags",
                    type: "#"
                }, {
                    name: "peer",
                    type: "flags.0?Peer"
                }, {
                    name: "totalFileSize",
                    type: "flags.1?long"
                }],
                type: "Bool"
            }, {
                id: 619086221,
                method: "upload.getWebFile",
                params: [{
                    name: "location",
                    type: "InputWebFileLocation"
                }, {
                    name: "offset",
                    type: "int"
                }, {
                    name: "limit",
                    type: "int"
                }],
                type: "upload.WebFile"
            }, {
                id: 536919235,
                method: "upload.getCdnFile",
                params: [{
                    name: "file_token",
                    type: "bytes"
                }, {
                    name: "offset",
                    type: "int"
                }, {
                    name: "limit",
                    type: "int"
                }],
                type: "upload.CdnFile"
            }, {
                id: -1691921240,
                method: "upload.reuploadCdnFile",
                params: [{
                    name: "file_token",
                    type: "bytes"
                }, {
                    name: "request_token",
                    type: "bytes"
                }],
                type: "Vector<FileHash>"
            }, {
                id: 1302676017,
                method: "upload.getCdnFileHashes",
                params: [{
                    name: "file_token",
                    type: "bytes"
                }, {
                    name: "offset",
                    type: "int"
                }],
                type: "Vector<FileHash>"
            }, {
                id: -956147407,
                method: "upload.getFileHashes",
                params: [{
                    name: "location",
                    type: "InputFileLocation"
                }, {
                    name: "offset",
                    type: "int"
                }],
                type: "Vector<FileHash>"
            }, {
                id: -990308245,
                method: "help.getConfig",
                params: [],
                type: "Config"
            }, {
                id: 531836966,
                method: "help.getNearestDc",
                params: [],
                type: "NearestDc"
            }, {
                id: 1378703997,
                method: "help.getAppUpdate",
                params: [{
                    name: "source",
                    type: "string"
                }],
                type: "help.AppUpdate"
            }, {
                id: 1295590211,
                method: "help.getInviteText",
                params: [],
                type: "help.InviteText"
            }, {
                id: -1663104819,
                method: "help.getSupport",
                params: [],
                type: "help.Support"
            }, {
                id: -1877938321,
                method: "help.getAppChangelog",
                params: [{
                    name: "prev_app_version",
                    type: "string"
                }],
                type: "Updates"
            }, {
                id: -333262899,
                method: "help.setBotUpdatesStatus",
                params: [{
                    name: "pending_updates_count",
                    type: "int"
                }, {
                    name: "message",
                    type: "string"
                }],
                type: "Bool"
            }, {
                id: 1375900482,
                method: "help.getCdnConfig",
                params: [],
                type: "CdnConfig"
            }, {
                id: 1036054804,
                method: "help.getRecentMeUrls",
                params: [{
                    name: "referer",
                    type: "string"
                }],
                type: "help.RecentMeUrls"
            }, {
                id: 749019089,
                method: "help.getTermsOfServiceUpdate",
                params: [],
                type: "help.TermsOfServiceUpdate"
            }, {
                id: -294455398,
                method: "help.acceptTermsOfService",
                params: [{
                    name: "id",
                    type: "DataJSON"
                }],
                type: "Bool"
            }, {
                id: 1072547679,
                method: "help.getDeepLinkInfo",
                params: [{
                    name: "path",
                    type: "string"
                }],
                type: "help.DeepLinkInfo"
            }, {
                id: -1735311088,
                method: "help.getAppConfig",
                params: [],
                type: "JSONValue"
            }, {
                id: 1862465352,
                method: "help.saveAppLog",
                params: [{
                    name: "events",
                    type: "Vector<InputAppEvent>"
                }],
                type: "Bool"
            }, {
                id: -966677240,
                method: "help.getPassportConfig",
                params: [{
                    name: "hash",
                    type: "int"
                }],
                type: "help.PassportConfig"
            }, {
                id: -748624084,
                method: "help.getSupportName",
                params: [],
                type: "help.SupportName"
            }, {
                id: 59377875,
                method: "help.getUserInfo",
                params: [{
                    name: "user_id",
                    type: "InputUser"
                }],
                type: "help.UserInfo"
            }, {
                id: 1723407216,
                method: "help.editUserInfo",
                params: [{
                    name: "user_id",
                    type: "InputUser"
                }, {
                    name: "message",
                    type: "string"
                }, {
                    name: "entities",
                    type: "Vector<MessageEntity>"
                }],
                type: "help.UserInfo"
            }, {
                id: -1063816159,
                method: "help.getPromoData",
                params: [],
                type: "help.PromoData"
            }, {
                id: 505748629,
                method: "help.hidePromoData",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }],
                type: "Bool"
            }, {
                id: -183649631,
                method: "help.dismissSuggestion",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "suggestion",
                    type: "string"
                }],
                type: "Bool"
            }, {
                id: 1935116200,
                method: "help.getCountriesList",
                params: [{
                    name: "lang_code",
                    type: "string"
                }, {
                    name: "hash",
                    type: "int"
                }],
                type: "help.CountriesList"
            }, {
                id: -871347913,
                method: "channels.readHistory",
                params: [{
                    name: "channel",
                    type: "InputChannel"
                }, {
                    name: "max_id",
                    type: "int"
                }],
                type: "Bool"
            }, {
                id: -2067661490,
                method: "channels.deleteMessages",
                params: [{
                    name: "channel",
                    type: "InputChannel"
                }, {
                    name: "id",
                    type: "Vector<int>"
                }],
                type: "messages.AffectedMessages"
            }, {
                id: -787622117,
                method: "channels.deleteUserHistory",
                params: [{
                    name: "channel",
                    type: "InputChannel"
                }, {
                    name: "user_id",
                    type: "InputUser"
                }],
                type: "messages.AffectedHistory"
            }, {
                id: -32999408,
                method: "channels.reportSpam",
                params: [{
                    name: "channel",
                    type: "InputChannel"
                }, {
                    name: "user_id",
                    type: "InputUser"
                }, {
                    name: "id",
                    type: "Vector<int>"
                }],
                type: "Bool"
            }, {
                id: -1383294429,
                method: "channels.getMessages",
                params: [{
                    name: "channel",
                    type: "InputChannel"
                }, {
                    name: "id",
                    type: "Vector<InputMessage>"
                }],
                type: "messages.Messages"
            }, {
                id: 2010044880,
                method: "channels.getParticipants",
                params: [{
                    name: "channel",
                    type: "InputChannel"
                }, {
                    name: "filter",
                    type: "ChannelParticipantsFilter"
                }, {
                    name: "offset",
                    type: "int"
                }, {
                    name: "limit",
                    type: "int"
                }, {
                    name: "hash",
                    type: "long"
                }],
                type: "channels.ChannelParticipants"
            }, {
                id: -1599378234,
                method: "channels.getParticipant",
                params: [{
                    name: "channel",
                    type: "InputChannel"
                }, {
                    name: "participant",
                    type: "InputPeer"
                }],
                type: "channels.ChannelParticipant"
            }, {
                id: 176122811,
                method: "channels.getChannels",
                params: [{
                    name: "id",
                    type: "Vector<InputChannel>"
                }],
                type: "messages.Chats"
            }, {
                id: 141781513,
                method: "channels.getFullChannel",
                params: [{
                    name: "channel",
                    type: "InputChannel"
                }],
                type: "messages.ChatFull"
            }, {
                id: 1029681423,
                method: "channels.createChannel",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "broadcast",
                    type: "flags.0?true"
                }, {
                    name: "megagroup",
                    type: "flags.1?true"
                }, {
                    name: "for_import",
                    type: "flags.3?true"
                }, {
                    name: "title",
                    type: "string"
                }, {
                    name: "about",
                    type: "string"
                }, {
                    name: "geo_point",
                    type: "flags.2?InputGeoPoint"
                }, {
                    name: "address",
                    type: "flags.2?string"
                }],
                type: "Updates"
            }, {
                id: -751007486,
                method: "channels.editAdmin",
                params: [{
                    name: "channel",
                    type: "InputChannel"
                }, {
                    name: "user_id",
                    type: "InputUser"
                }, {
                    name: "admin_rights",
                    type: "ChatAdminRights"
                }, {
                    name: "rank",
                    type: "string"
                }],
                type: "Updates"
            }, {
                id: 1450044624,
                method: "channels.editTitle",
                params: [{
                    name: "channel",
                    type: "InputChannel"
                }, {
                    name: "title",
                    type: "string"
                }],
                type: "Updates"
            }, {
                id: -248621111,
                method: "channels.editPhoto",
                params: [{
                    name: "channel",
                    type: "InputChannel"
                }, {
                    name: "photo",
                    type: "InputChatPhoto"
                }],
                type: "Updates"
            }, {
                id: 283557164,
                method: "channels.checkUsername",
                params: [{
                    name: "channel",
                    type: "InputChannel"
                }, {
                    name: "username",
                    type: "string"
                }],
                type: "Bool"
            }, {
                id: 890549214,
                method: "channels.updateUsername",
                params: [{
                    name: "channel",
                    type: "InputChannel"
                }, {
                    name: "username",
                    type: "string"
                }],
                type: "Bool"
            }, {
                id: 615851205,
                method: "channels.joinChannel",
                params: [{
                    name: "channel",
                    type: "InputChannel"
                }],
                type: "Updates"
            }, {
                id: -130635115,
                method: "channels.leaveChannel",
                params: [{
                    name: "channel",
                    type: "InputChannel"
                }],
                type: "Updates"
            }, {
                id: 429865580,
                method: "channels.inviteToChannel",
                params: [{
                    name: "channel",
                    type: "InputChannel"
                }, {
                    name: "users",
                    type: "Vector<InputUser>"
                }],
                type: "Updates"
            }, {
                id: 3344304261,
                method: "channels.inviteToChannelLayer84",
                params: [{
                    name: "channel",
                    type: "InputChannel"
                }],
                type: "Updates"
            }, {
                id: -1072619549,
                method: "channels.deleteChannel",
                params: [{
                    name: "channel",
                    type: "InputChannel"
                }],
                type: "Updates"
            }, {
                id: -432034325,
                method: "channels.exportMessageLink",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "grouped",
                    type: "flags.0?true"
                }, {
                    name: "thread",
                    type: "flags.1?true"
                }, {
                    name: "channel",
                    type: "InputChannel"
                }, {
                    name: "id",
                    type: "int"
                }],
                type: "ExportedMessageLink"
            }, {
                id: 527021574,
                method: "channels.toggleSignatures",
                params: [{
                    name: "channel",
                    type: "InputChannel"
                }, {
                    name: "enabled",
                    type: "Bool"
                }],
                type: "Updates"
            }, {
                id: -122669393,
                method: "channels.getAdminedPublicChannels",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "by_location",
                    type: "flags.0?true"
                }, {
                    name: "check_limit",
                    type: "flags.1?true"
                }],
                type: "messages.Chats"
            }, {
                id: -1763259007,
                method: "channels.editBanned",
                params: [{
                    name: "channel",
                    type: "InputChannel"
                }, {
                    name: "participant",
                    type: "InputPeer"
                }, {
                    name: "banned_rights",
                    type: "ChatBannedRights"
                }],
                type: "Updates"
            }, {
                id: 870184064,
                method: "channels.getAdminLog",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "channel",
                    type: "InputChannel"
                }, {
                    name: "q",
                    type: "string"
                }, {
                    name: "events_filter",
                    type: "flags.0?ChannelAdminLogEventsFilter"
                }, {
                    name: "admins",
                    type: "flags.1?Vector<InputUser>"
                }, {
                    name: "max_id",
                    type: "long"
                }, {
                    name: "min_id",
                    type: "long"
                }, {
                    name: "limit",
                    type: "int"
                }],
                type: "channels.AdminLogResults"
            }, {
                id: -359881479,
                method: "channels.setStickers",
                params: [{
                    name: "channel",
                    type: "InputChannel"
                }, {
                    name: "stickerset",
                    type: "InputStickerSet"
                }],
                type: "Bool"
            }, {
                id: -357180360,
                method: "channels.readMessageContents",
                params: [{
                    name: "channel",
                    type: "InputChannel"
                }, {
                    name: "id",
                    type: "Vector<int>"
                }],
                type: "Bool"
            }, {
                id: -1355375294,
                method: "channels.deleteHistory",
                params: [{
                    name: "channel",
                    type: "InputChannel"
                }, {
                    name: "max_id",
                    type: "int"
                }],
                type: "Bool"
            }, {
                id: -356796084,
                method: "channels.togglePreHistoryHidden",
                params: [{
                    name: "channel",
                    type: "InputChannel"
                }, {
                    name: "enabled",
                    type: "Bool"
                }],
                type: "Updates"
            }, {
                id: -2092831552,
                method: "channels.getLeftChannels",
                params: [{
                    name: "offset",
                    type: "int"
                }],
                type: "messages.Chats"
            }, {
                id: -170208392,
                method: "channels.getGroupsForDiscussion",
                params: [],
                type: "messages.Chats"
            }, {
                id: 1079520178,
                method: "channels.setDiscussionGroup",
                params: [{
                    name: "broadcast",
                    type: "InputChannel"
                }, {
                    name: "group",
                    type: "InputChannel"
                }],
                type: "Bool"
            }, {
                id: -1892102881,
                method: "channels.editCreator",
                params: [{
                    name: "channel",
                    type: "InputChannel"
                }, {
                    name: "user_id",
                    type: "InputUser"
                }, {
                    name: "password",
                    type: "InputCheckPasswordSRP"
                }],
                type: "Updates"
            }, {
                id: 1491484525,
                method: "channels.editLocation",
                params: [{
                    name: "channel",
                    type: "InputChannel"
                }, {
                    name: "geo_point",
                    type: "InputGeoPoint"
                }, {
                    name: "address",
                    type: "string"
                }],
                type: "Bool"
            }, {
                id: -304832784,
                method: "channels.toggleSlowMode",
                params: [{
                    name: "channel",
                    type: "InputChannel"
                }, {
                    name: "seconds",
                    type: "int"
                }],
                type: "Updates"
            }, {
                id: 300429806,
                method: "channels.getInactiveChannels",
                params: [],
                type: "messages.InactiveChats"
            }, {
                id: 187239529,
                method: "channels.convertToGigagroup",
                params: [{
                    name: "channel",
                    type: "InputChannel"
                }],
                type: "Updates"
            }, {
                id: -1095836780,
                method: "channels.viewSponsoredMessage",
                params: [{
                    name: "channel",
                    type: "InputChannel"
                }, {
                    name: "random_id",
                    type: "bytes"
                }],
                type: "Bool"
            }, {
                id: -333377601,
                method: "channels.getSponsoredMessages",
                params: [{
                    name: "channel",
                    type: "InputChannel"
                }],
                type: "messages.SponsoredMessages"
            }, {
                id: -1440257555,
                method: "bots.sendCustomRequest",
                params: [{
                    name: "custom_method",
                    type: "string"
                }, {
                    name: "params",
                    type: "DataJSON"
                }],
                type: "DataJSON"
            }, {
                id: -434028723,
                method: "bots.answerWebhookJSONQuery",
                params: [{
                    name: "query_id",
                    type: "long"
                }, {
                    name: "data",
                    type: "DataJSON"
                }],
                type: "Bool"
            }, {
                id: 85399130,
                method: "bots.setBotCommands",
                params: [{
                    name: "scope",
                    type: "BotCommandScope"
                }, {
                    name: "lang_code",
                    type: "string"
                }, {
                    name: "commands",
                    type: "Vector<BotCommand>"
                }],
                type: "Bool"
            }, {
                id: 1032708345,
                method: "bots.resetBotCommands",
                params: [{
                    name: "scope",
                    type: "BotCommandScope"
                }, {
                    name: "lang_code",
                    type: "string"
                }],
                type: "Bool"
            }, {
                id: -481554986,
                method: "bots.getBotCommands",
                params: [{
                    name: "scope",
                    type: "BotCommandScope"
                }, {
                    name: "lang_code",
                    type: "string"
                }],
                type: "Vector<BotCommand>"
            }, {
                id: -1976353651,
                method: "payments.getPaymentForm",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "msg_id",
                    type: "int"
                }, {
                    name: "theme_params",
                    type: "flags.0?DataJSON"
                }],
                type: "payments.PaymentForm"
            }, {
                id: 611897804,
                method: "payments.getPaymentReceipt",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "msg_id",
                    type: "int"
                }],
                type: "payments.PaymentReceipt"
            }, {
                id: -619695760,
                method: "payments.validateRequestedInfo",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "save",
                    type: "flags.0?true"
                }, {
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "msg_id",
                    type: "int"
                }, {
                    name: "info",
                    type: "PaymentRequestedInfo"
                }],
                type: "payments.ValidatedRequestedInfo"
            }, {
                id: 818134173,
                method: "payments.sendPaymentForm",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "form_id",
                    type: "long"
                }, {
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "msg_id",
                    type: "int"
                }, {
                    name: "requested_info_id",
                    type: "flags.0?string"
                }, {
                    name: "shipping_option_id",
                    type: "flags.1?string"
                }, {
                    name: "credentials",
                    type: "InputPaymentCredentials"
                }, {
                    name: "tip_amount",
                    type: "flags.2?long"
                }],
                type: "payments.PaymentResult"
            }, {
                id: 578650699,
                method: "payments.getSavedInfo",
                params: [],
                type: "payments.SavedInfo"
            }, {
                id: -667062079,
                method: "payments.clearSavedInfo",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "credentials",
                    type: "flags.0?true"
                }, {
                    name: "info",
                    type: "flags.1?true"
                }],
                type: "Bool"
            }, {
                id: 779736953,
                method: "payments.getBankCardData",
                params: [{
                    name: "number",
                    type: "string"
                }],
                type: "payments.BankCardData"
            }, {
                id: -1876841625,
                method: "stickers.createStickerSet",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "masks",
                    type: "flags.0?true"
                }, {
                    name: "animated",
                    type: "flags.1?true"
                }, {
                    name: "user_id",
                    type: "InputUser"
                }, {
                    name: "title",
                    type: "string"
                }, {
                    name: "short_name",
                    type: "string"
                }, {
                    name: "thumb",
                    type: "flags.2?InputDocument"
                }, {
                    name: "stickers",
                    type: "Vector<InputStickerSetItem>"
                }, {
                    name: "software",
                    type: "flags.3?string"
                }],
                type: "messages.StickerSet"
            }, {
                id: -143257775,
                method: "stickers.removeStickerFromSet",
                params: [{
                    name: "sticker",
                    type: "InputDocument"
                }],
                type: "messages.StickerSet"
            }, {
                id: -4795190,
                method: "stickers.changeStickerPosition",
                params: [{
                    name: "sticker",
                    type: "InputDocument"
                }, {
                    name: "position",
                    type: "int"
                }],
                type: "messages.StickerSet"
            }, {
                id: -2041315650,
                method: "stickers.addStickerToSet",
                params: [{
                    name: "stickerset",
                    type: "InputStickerSet"
                }, {
                    name: "sticker",
                    type: "InputStickerSetItem"
                }],
                type: "messages.StickerSet"
            }, {
                id: -1707717072,
                method: "stickers.setStickerSetThumb",
                params: [{
                    name: "stickerset",
                    type: "InputStickerSet"
                }, {
                    name: "thumb",
                    type: "InputDocument"
                }],
                type: "messages.StickerSet"
            }, {
                id: 676017721,
                method: "stickers.checkShortName",
                params: [{
                    name: "short_name",
                    type: "string"
                }],
                type: "Bool"
            }, {
                id: 1303364867,
                method: "stickers.suggestShortName",
                params: [{
                    name: "title",
                    type: "string"
                }],
                type: "stickers.SuggestedShortName"
            }, {
                id: 1430593449,
                method: "phone.getCallConfig",
                params: [],
                type: "DataJSON"
            }, {
                id: 1124046573,
                method: "phone.requestCall",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "video",
                    type: "flags.0?true"
                }, {
                    name: "user_id",
                    type: "InputUser"
                }, {
                    name: "random_id",
                    type: "int"
                }, {
                    name: "g_a_hash",
                    type: "bytes"
                }, {
                    name: "protocol",
                    type: "PhoneCallProtocol"
                }],
                type: "phone.PhoneCall"
            }, {
                id: 1003664544,
                method: "phone.acceptCall",
                params: [{
                    name: "peer",
                    type: "InputPhoneCall"
                }, {
                    name: "g_b",
                    type: "bytes"
                }, {
                    name: "protocol",
                    type: "PhoneCallProtocol"
                }],
                type: "phone.PhoneCall"
            }, {
                id: 788404002,
                method: "phone.confirmCall",
                params: [{
                    name: "peer",
                    type: "InputPhoneCall"
                }, {
                    name: "g_a",
                    type: "bytes"
                }, {
                    name: "key_fingerprint",
                    type: "long"
                }, {
                    name: "protocol",
                    type: "PhoneCallProtocol"
                }],
                type: "phone.PhoneCall"
            }, {
                id: 399855457,
                method: "phone.receivedCall",
                params: [{
                    name: "peer",
                    type: "InputPhoneCall"
                }],
                type: "Bool"
            }, {
                id: -1295269440,
                method: "phone.discardCall",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "video",
                    type: "flags.0?true"
                }, {
                    name: "peer",
                    type: "InputPhoneCall"
                }, {
                    name: "duration",
                    type: "int"
                }, {
                    name: "reason",
                    type: "PhoneCallDiscardReason"
                }, {
                    name: "connection_id",
                    type: "long"
                }],
                type: "Updates"
            }, {
                id: 1508562471,
                method: "phone.setCallRating",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "user_initiative",
                    type: "flags.0?true"
                }, {
                    name: "peer",
                    type: "InputPhoneCall"
                }, {
                    name: "rating",
                    type: "int"
                }, {
                    name: "comment",
                    type: "string"
                }],
                type: "Updates"
            }, {
                id: 662363518,
                method: "phone.saveCallDebug",
                params: [{
                    name: "peer",
                    type: "InputPhoneCall"
                }, {
                    name: "debug",
                    type: "DataJSON"
                }],
                type: "Bool"
            }, {
                id: -8744061,
                method: "phone.sendSignalingData",
                params: [{
                    name: "peer",
                    type: "InputPhoneCall"
                }, {
                    name: "data",
                    type: "bytes"
                }],
                type: "Bool"
            }, {
                id: 1221445336,
                method: "phone.createGroupCall",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "random_id",
                    type: "int"
                }, {
                    name: "title",
                    type: "flags.0?string"
                }, {
                    name: "schedule_date",
                    type: "flags.1?int"
                }],
                type: "Updates"
            }, {
                id: -1322057861,
                method: "phone.joinGroupCall",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "muted",
                    type: "flags.0?true"
                }, {
                    name: "video_stopped",
                    type: "flags.2?true"
                }, {
                    name: "call",
                    type: "InputGroupCall"
                }, {
                    name: "join_as",
                    type: "InputPeer"
                }, {
                    name: "invite_hash",
                    type: "flags.1?string"
                }, {
                    name: "params",
                    type: "DataJSON"
                }],
                type: "Updates"
            }, {
                id: 1342404601,
                method: "phone.leaveGroupCall",
                params: [{
                    name: "call",
                    type: "InputGroupCall"
                }, {
                    name: "source",
                    type: "int"
                }],
                type: "Updates"
            }, {
                id: 2067345760,
                method: "phone.inviteToGroupCall",
                params: [{
                    name: "call",
                    type: "InputGroupCall"
                }, {
                    name: "users",
                    type: "Vector<InputUser>"
                }],
                type: "Updates"
            }, {
                id: 2054648117,
                method: "phone.discardGroupCall",
                params: [{
                    name: "call",
                    type: "InputGroupCall"
                }],
                type: "Updates"
            }, {
                id: 1958458429,
                method: "phone.toggleGroupCallSettings",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "reset_invite_hash",
                    type: "flags.1?true"
                }, {
                    name: "call",
                    type: "InputGroupCall"
                }, {
                    name: "join_muted",
                    type: "flags.0?Bool"
                }],
                type: "Updates"
            }, {
                id: 68699611,
                method: "phone.getGroupCall",
                params: [{
                    name: "call",
                    type: "InputGroupCall"
                }, {
                    name: "limit",
                    type: "int"
                }],
                type: "phone.GroupCall"
            }, {
                id: -984033109,
                method: "phone.getGroupParticipants",
                params: [{
                    name: "call",
                    type: "InputGroupCall"
                }, {
                    name: "ids",
                    type: "Vector<InputPeer>"
                }, {
                    name: "sources",
                    type: "Vector<int>"
                }, {
                    name: "offset",
                    type: "string"
                }, {
                    name: "limit",
                    type: "int"
                }],
                type: "phone.GroupParticipants"
            }, {
                id: -1248003721,
                method: "phone.checkGroupCall",
                params: [{
                    name: "call",
                    type: "InputGroupCall"
                }, {
                    name: "sources",
                    type: "Vector<int>"
                }],
                type: "Vector<int>"
            }, {
                id: -248985848,
                method: "phone.toggleGroupCallRecord",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "start",
                    type: "flags.0?true"
                }, {
                    name: "video",
                    type: "flags.2?true"
                }, {
                    name: "call",
                    type: "InputGroupCall"
                }, {
                    name: "title",
                    type: "flags.1?string"
                }, {
                    name: "video_portrait",
                    type: "flags.2?Bool"
                }],
                type: "Updates"
            }, {
                id: -1524155713,
                method: "phone.editGroupCallParticipant",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "call",
                    type: "InputGroupCall"
                }, {
                    name: "participant",
                    type: "InputPeer"
                }, {
                    name: "muted",
                    type: "flags.0?Bool"
                }, {
                    name: "volume",
                    type: "flags.1?int"
                }, {
                    name: "raise_hand",
                    type: "flags.2?Bool"
                }, {
                    name: "video_stopped",
                    type: "flags.3?Bool"
                }, {
                    name: "video_paused",
                    type: "flags.4?Bool"
                }, {
                    name: "presentation_paused",
                    type: "flags.5?Bool"
                }],
                type: "Updates"
            }, {
                id: 480685066,
                method: "phone.editGroupCallTitle",
                params: [{
                    name: "call",
                    type: "InputGroupCall"
                }, {
                    name: "title",
                    type: "string"
                }],
                type: "Updates"
            }, {
                id: -277077702,
                method: "phone.getGroupCallJoinAs",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }],
                type: "phone.JoinAsPeers"
            }, {
                id: -425040769,
                method: "phone.exportGroupCallInvite",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "can_self_unmute",
                    type: "flags.0?true"
                }, {
                    name: "call",
                    type: "InputGroupCall"
                }],
                type: "phone.ExportedGroupCallInvite"
            }, {
                id: 563885286,
                method: "phone.toggleGroupCallStartSubscription",
                params: [{
                    name: "call",
                    type: "InputGroupCall"
                }, {
                    name: "subscribed",
                    type: "Bool"
                }],
                type: "Updates"
            }, {
                id: 1451287362,
                method: "phone.startScheduledGroupCall",
                params: [{
                    name: "call",
                    type: "InputGroupCall"
                }],
                type: "Updates"
            }, {
                id: 1465786252,
                method: "phone.saveDefaultGroupCallJoinAs",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "join_as",
                    type: "InputPeer"
                }],
                type: "Bool"
            }, {
                id: -873829436,
                method: "phone.joinGroupCallPresentation",
                params: [{
                    name: "call",
                    type: "InputGroupCall"
                }, {
                    name: "params",
                    type: "DataJSON"
                }],
                type: "Updates"
            }, {
                id: 475058500,
                method: "phone.leaveGroupCallPresentation",
                params: [{
                    name: "call",
                    type: "InputGroupCall"
                }],
                type: "Updates"
            }, {
                id: -219008246,
                method: "langpack.getLangPack",
                params: [{
                    name: "lang_pack",
                    type: "string"
                }, {
                    name: "lang_code",
                    type: "string"
                }],
                type: "LangPackDifference"
            }, {
                id: -269862909,
                method: "langpack.getStrings",
                params: [{
                    name: "lang_pack",
                    type: "string"
                }, {
                    name: "lang_code",
                    type: "string"
                }, {
                    name: "keys",
                    type: "Vector<string>"
                }],
                type: "Vector<LangPackString>"
            }, {
                id: -845657435,
                method: "langpack.getDifference",
                params: [{
                    name: "lang_pack",
                    type: "string"
                }, {
                    name: "lang_code",
                    type: "string"
                }, {
                    name: "from_version",
                    type: "int"
                }],
                type: "LangPackDifference"
            }, {
                id: 1120311183,
                method: "langpack.getLanguages",
                params: [{
                    name: "lang_pack",
                    type: "string"
                }],
                type: "Vector<LangPackLanguage>"
            }, {
                id: 1784243458,
                method: "langpack.getLanguage",
                params: [{
                    name: "lang_pack",
                    type: "string"
                }, {
                    name: "lang_code",
                    type: "string"
                }],
                type: "LangPackLanguage"
            }, {
                id: 1749536939,
                method: "folders.editPeerFolders",
                params: [{
                    name: "folder_peers",
                    type: "Vector<InputFolderPeer>"
                }],
                type: "Updates"
            }, {
                id: 472471681,
                method: "folders.deleteFolder",
                params: [{
                    name: "folder_id",
                    type: "int"
                }],
                type: "Updates"
            }, {
                id: -1421720550,
                method: "stats.getBroadcastStats",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "dark",
                    type: "flags.0?true"
                }, {
                    name: "channel",
                    type: "InputChannel"
                }],
                type: "stats.BroadcastStats"
            }, {
                id: 1646092192,
                method: "stats.loadAsyncGraph",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "token",
                    type: "string"
                }, {
                    name: "x",
                    type: "flags.0?long"
                }],
                type: "StatsGraph"
            }, {
                id: -589330937,
                method: "stats.getMegagroupStats",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "dark",
                    type: "flags.0?true"
                }, {
                    name: "channel",
                    type: "InputChannel"
                }],
                type: "stats.MegagroupStats"
            }, {
                id: 1445996571,
                method: "stats.getMessagePublicForwards",
                params: [{
                    name: "channel",
                    type: "InputChannel"
                }, {
                    name: "msg_id",
                    type: "int"
                }, {
                    name: "offset_rate",
                    type: "int"
                }, {
                    name: "offset_peer",
                    type: "InputPeer"
                }, {
                    name: "offset_id",
                    type: "int"
                }, {
                    name: "limit",
                    type: "int"
                }],
                type: "messages.Messages"
            }, {
                id: -1226791947,
                method: "stats.getMessageStats",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "dark",
                    type: "flags.0?true"
                }, {
                    name: "channel",
                    type: "InputChannel"
                }, {
                    name: "msg_id",
                    type: "int"
                }],
                type: "stats.MessageStats"
            }, {
                id: 2059302893,
                method: "eitaaObject",
                params: [{
                    name: "token",
                    type: "string"
                }, {
                    name: "imei",
                    type: "string"
                }, {
                    name: "packed_data",
                    type: "bytes"
                }, {
                    name: "layer",
                    type: "int"
                }, {
                    name: "flags",
                    type: "int"
                }],
                type: "EitaaObject"
            }, {
                id: 1908593196,
                method: "eitaaIosObject",
                params: [{
                    name: "token",
                    type: "string"
                }, {
                    name: "imei",
                    type: "string"
                }, {
                    name: "flags",
                    type: "#"
                }, {
                    name: "packed_data",
                    type: "bytes"
                }, {
                    name: "layer",
                    type: "int"
                }, {
                    name: "build_version",
                    type: "int"
                }],
                type: "EitaaIosObject"
            }, {
                id: -599448727,
                method: "eitaaRefreshToken",
                params: [{
                    name: "app_info",
                    type: "EitaaAppInfo"
                }],
                type: "EitaaRefreshToken"
            }, {
                id: 1194436538,
                method: "liveGetMedia",
                params: [{
                    name: "flags",
                    type: "#"
                }, {
                    name: "id",
                    type: "long"
                }, {
                    name: "access_hash",
                    type: "long"
                }],
                type: "LiveGetMedia"
            }, {
                id: 950734118,
                method: "adsGetAdsPack",
                params: [{
                    name: "flags",
                    type: "int"
                }, {
                    name: "location",
                    type: "AdsLocation"
                }],
                type: "AdsGetAdsPack"
            }, {
                id: -1626620176,
                method: "statAd",
                params: [{
                    name: "id",
                    type: "int"
                }, {
                    name: "adsLocation",
                    type: "AdsLocation"
                }],
                type: "StatAd"
            }, {
                id: -1311039949,
                method: "sendTwoStepVerificationCode",
                params: [],
                type: "auth.SentCode"
            }, {
                id: 1470999061,
                method: "verifyTwoStepVerificationCode",
                params: [{
                    name: "phone_code_hash",
                    type: "string"
                }, {
                    name: "phone_code",
                    type: "string"
                }],
                type: "Bool"
            }, {
                id: -1261786457,
                method: "statReportAdActionPerformed",
                params: [{
                    name: "statAd",
                    type: "StatAd"
                }],
                type: "StatReportAdActionPerformed"
            }, {
                id: 512862199,
                method: "crashReport",
                params: [{
                    name: "flags",
                    type: "int"
                }, {
                    name: "body",
                    type: "bytes"
                }, {
                    name: "uri",
                    type: "string"
                }, {
                    name: "queryParams",
                    type: "string"
                }],
                type: "Bool"
            }, {
                id: -559038801,
                method: "getPayHash",
                params: [{
                    name: "flag",
                    type: "int"
                }, {
                    name: "msg_id",
                    type: "int"
                }, {
                    name: "peer",
                    type: "Peer"
                }],
                type: "UserPayHash"
            }, {
                id: 266615290,
                method: "getLatestBuildVersion",
                params: [{
                    name: "flags",
                    type: "int"
                }],
                type: "LatestBuildVersion"
            }, {
                id: -1323389022,
                method: "messages.toggleNoForwards",
                params: [{
                    name: "peer",
                    type: "InputPeer"
                }, {
                    name: "enabled",
                    type: "Bool"
                }],
                type: "Updates"
            }]
        },
        layer: 135
    }
      , Ne = new Uint8Array(256)
      , qe = new Uint8Array(256)
      , Ge = new Uint32Array(256)
      , ze = new Uint32Array(256)
      , je = new Uint32Array(256)
      , Ke = new Uint32Array(256)
      , We = new Uint32Array(256)
      , He = new Uint32Array(256)
      , Je = new Uint32Array(256)
      , Ze = new Uint32Array(256);
    function Qe(e) {
        if (e instanceof Uint32Array)
            return e;
        if ("string" == typeof e) {
            if (e.length % 4 != 0)
                for (var t = e.length % 4; t <= 4; t++)
                    e += "\0x00";
            var a = new Uint32Array(e.length / 4);
            for (t = 0; t < e.length; t += 4)
                a[t / 4] = (s = t,
                (n = e).charCodeAt(s) << 24 ^ n.charCodeAt(s + 1) << 16 ^ n.charCodeAt(s + 2) << 8 ^ n.charCodeAt(s + 3));
            return a
        }
        var n, s;
        if (e instanceof Uint8Array) {
            for (a = new Uint32Array(e.length / 4),
            t = 0; t < e.length; t += 4)
                a[t / 4] = e[t] << 24 ^ e[t + 1] << 16 ^ e[t + 2] << 8 ^ e[t + 3];
            return a
        }
        throw new Error("Unable to create 32-bit words")
    }
    function Xe(e, t, a) {
        void 0 === a && (a = e);
        for (var n = 0; n < e.length; n++)
            a[n] = e[n] ^ t[n]
    }
    !function() {
        for (var e, t, a, n, s, i = new Uint8Array(256), r = new Uint8Array(256), p = 0, o = 0, m = 0; m < 256; m++)
            i[m] = m << 1 ^ 283 * (m >> 7),
            r[i[m] ^ m] = m;
        for (; !Ne[p]; p ^= e || 1)
            a = (a = o ^ o << 1 ^ o << 2 ^ o << 3 ^ o << 4) >> 8 ^ 255 & a ^ 99,
            Ne[p] = a,
            qe[a] = p,
            s = 16843009 * i[t = i[e = i[p]]] ^ 65537 * t ^ 257 * e ^ 16843008 * p,
            n = 257 * i[a] ^ 16843008 * a,
            Ge[p] = n = n << 24 ^ n >>> 8,
            ze[p] = n = n << 24 ^ n >>> 8,
            je[p] = n = n << 24 ^ n >>> 8,
            Ke[p] = n = n << 24 ^ n >>> 8,
            We[a] = s = s << 24 ^ s >>> 8,
            He[a] = s = s << 24 ^ s >>> 8,
            Je[a] = s = s << 24 ^ s >>> 8,
            Ze[a] = s = s << 24 ^ s >>> 8,
            o = r[o] || 1
    }();
    var Ye = function() {
        function e(e) {
            var t = Qe(e);
            if (4 !== t.length && 6 !== t.length && 8 !== t.length)
                throw new Error("Invalid key size");
            this.encKey = new Uint32Array(4 * t.length + 28),
            this.decKey = new Uint32Array(4 * t.length + 28),
            this.encKey.set(t);
            for (var a, n = 1, s = t.length; s < 4 * t.length + 28; s++)
                a = this.encKey[s - 1],
                (s % t.length == 0 || 8 === t.length && s % t.length == 4) && (a = Ne[a >>> 24] << 24 ^ Ne[a >> 16 & 255] << 16 ^ Ne[a >> 8 & 255] << 8 ^ Ne[255 & a],
                s % t.length == 0 && (a = a << 8 ^ a >>> 24 ^ n << 24,
                n = n << 1 ^ 283 * (n >> 7))),
                this.encKey[s] = this.encKey[s - t.length] ^ a;
            for (var i = 0; s; i++,
            s--)
                a = this.encKey[3 & i ? s : s - 4],
                this.decKey[i] = s <= 4 || i < 4 ? a : We[Ne[a >>> 24]] ^ He[Ne[a >> 16 & 255]] ^ Je[Ne[a >> 8 & 255]] ^ Ze[Ne[255 & a]]
        }
        return e.prototype.encrypt = function(e) {
            for (var t, a, n, s = Qe(e), i = new Uint32Array(4), r = s[0] ^ this.encKey[0], p = s[1] ^ this.encKey[1], o = s[2] ^ this.encKey[2], m = s[3] ^ this.encKey[3], d = this.encKey.length / 4 - 2, y = 4, l = 0; l < d; l++)
                t = Ge[r >>> 24] ^ ze[p >> 16 & 255] ^ je[o >> 8 & 255] ^ Ke[255 & m] ^ this.encKey[y],
                a = Ge[p >>> 24] ^ ze[o >> 16 & 255] ^ je[m >> 8 & 255] ^ Ke[255 & r] ^ this.encKey[y + 1],
                n = Ge[o >>> 24] ^ ze[m >> 16 & 255] ^ je[r >> 8 & 255] ^ Ke[255 & p] ^ this.encKey[y + 2],
                m = Ge[m >>> 24] ^ ze[r >> 16 & 255] ^ je[p >> 8 & 255] ^ Ke[255 & o] ^ this.encKey[y + 3],
                r = t,
                p = a,
                o = n,
                y += 4;
            for (l = 0; l < 4; l++)
                i[l] = Ne[r >>> 24] << 24 ^ Ne[p >> 16 & 255] << 16 ^ Ne[o >> 8 & 255] << 8 ^ Ne[255 & m] ^ this.encKey[y++],
                t = r,
                r = p,
                p = o,
                o = m,
                m = t;
            return i
        }
        ,
        e.prototype.decrypt = function(e) {
            for (var t, a, n, s = Qe(e), i = new Uint32Array(4), r = s[0] ^ this.decKey[0], p = s[3] ^ this.decKey[1], o = s[2] ^ this.decKey[2], m = s[1] ^ this.decKey[3], d = this.decKey.length / 4 - 2, y = 4, l = 0; l < d; l++)
                t = We[r >>> 24] ^ He[p >> 16 & 255] ^ Je[o >> 8 & 255] ^ Ze[255 & m] ^ this.decKey[y],
                a = We[p >>> 24] ^ He[o >> 16 & 255] ^ Je[m >> 8 & 255] ^ Ze[255 & r] ^ this.decKey[y + 1],
                n = We[o >>> 24] ^ He[m >> 16 & 255] ^ Je[r >> 8 & 255] ^ Ze[255 & p] ^ this.decKey[y + 2],
                m = We[m >>> 24] ^ He[r >> 16 & 255] ^ Je[p >> 8 & 255] ^ Ze[255 & o] ^ this.decKey[y + 3],
                r = t,
                p = a,
                o = n,
                y += 4;
            for (l = 0; l < 4; l++)
                i[3 & -l] = qe[r >>> 24] << 24 ^ qe[p >> 16 & 255] << 16 ^ qe[o >> 8 & 255] << 8 ^ qe[255 & m] ^ this.decKey[y++],
                t = r,
                r = p,
                p = o,
                o = m,
                m = t;
            return i
        }
        ,
        e
    }()
      , $e = function() {
        function e(e, t, a) {
            void 0 === a && (a = 16),
            this.key = Qe(e),
            this.iv = Qe(t),
            this.cipher = new Ye(e),
            this.blockSize = a / 4
        }
        return e.prototype.encrypt = function(e, t) {
            for (var a = Qe(e), n = t || new Uint32Array(a.length), s = this.iv.subarray(this.blockSize, this.iv.length), i = this.iv.subarray(0, this.blockSize), r = new Uint32Array(this.blockSize), p = 0; p < a.length; p += this.blockSize) {
                var o = a.subarray(p, p + this.blockSize);
                Xe(o, i, r);
                var m = this.cipher.encrypt(r);
                Xe(m, s),
                s = o,
                i = m;
                for (var d = p, y = 0; d < a.length && y < 4; d++,
                y++)
                    n[d] = m[y]
            }
            return n
        }
        ,
        e.prototype.decrypt = function(e, t) {
            for (var a = Qe(e), n = t || new Uint32Array(a.length), s = this.iv.subarray(this.blockSize, this.iv.length), i = this.iv.subarray(0, this.blockSize), r = new Uint32Array(this.blockSize), p = 0; p < n.length; p += this.blockSize) {
                var o = a.subarray(p, p + this.blockSize);
                Xe(o, s, r);
                var m = this.cipher.decrypt(r);
                Xe(m, i),
                i = o,
                s = m;
                for (var d = p, y = 0; d < n.length && y < 4; d++,
                y++)
                    n[d] = m[y]
            }
            return n
        }
        ,
        e
    }()
      , et = (function() {
        function e(e, t, a) {
            if (void 0 === a && (a = 16),
            this.offset = 0,
            this.key = Qe(e),
            this.counter = Qe(t),
            this.cipher = new Ye(e),
            this.blockSize = a / 4,
            4 !== this.counter.length)
                throw new Error("AES-CTR mode counter must be 16 bytes length")
        }
        e.prototype.encrypt = function(e, t) {
            for (var a = Qe(e), n = t || new Uint32Array(a.length), s = this.offset, i = 0; i < a.length; i += this.blockSize) {
                for (var r = this.cipher.encrypt(this.counter), p = i, o = s; p < a.length && o < this.blockSize; p++,
                o++)
                    n[p] = r[o] ^ a[p];
                a.length - i >= this.blockSize && this.incrementCounter(),
                s && (i -= s,
                s = 0)
            }
            return this.offset = (this.offset + a.length % 4) % 4,
            n
        }
        ,
        e.prototype.decrypt = function(e, t) {
            return this.encrypt(e, t)
        }
        ,
        e.prototype.incrementCounter = function() {
            for (var e = this.counter.length - 1; e >= 0 && !(++this.counter[e] < 4294967295); e--)
                ;
        }
    }(),
    a(0))
      , tt = a.n(et);
    const at = {
        8: new Uint8Array(1),
        16: new Uint16Array(1),
        32: new Uint32Array(1)
    };
    function nt(e) {
        const t = at[e];
        return crypto.getRandomValues(t),
        t[0]
    }
    function st() {
        return "" + nt(32) + nt(32) % 16777215
    }
    var it = function(e, t, a, n) {
        return new (a || (a = Promise))((function(s, i) {
            function r(e) {
                try {
                    o(n.next(e))
                } catch (e) {
                    i(e)
                }
            }
            function p(e) {
                try {
                    o(n.throw(e))
                } catch (e) {
                    i(e)
                }
            }
            function o(e) {
                var t;
                e.done ? s(e.value) : (t = e.value,
                t instanceof a ? t : new a((function(e) {
                    e(t)
                }
                ))).then(r, p)
            }
            o((n = n.apply(e, t || [])).next())
        }
        ))
    };
    const rt = "undefined" != typeof window && "crypto"in window ? window.crypto.subtle : self.crypto.subtle;
    function pt(e) {
        return rt.digest("SHA-1", p(e)).then(e => new Uint8Array(e))
    }
    function ot(e) {
        return rt.digest("SHA-256", p(e)).then(e => new Uint8Array(e))
    }
    function mt(e, t, a) {
        e = Le(e);
        return m(new $e(d(t),d(a)).encrypt(d(e)))
    }
    function dt(e, t, a) {
        return m(new $e(d(t),d(a)).decrypt(d(e)))
    }
    function yt(e, t) {
        const a = oe(t.modulus, 16)
          , i = oe(t.exponent, 16);
        return s(le(Y(oe(n(e), 16), i, a), 16))
    }
    function lt(e, t, a) {
        return it(this, void 0, void 0, (function*() {
            const n = yield rt.importKey("raw", e, {
                name: "PBKDF2"
            }, !1, ["deriveBits"]);
            return rt.deriveBits({
                name: "PBKDF2",
                salt: t,
                iterations: a,
                hash: {
                    name: "SHA-512"
                }
            }, n, 512).then(e => new Uint8Array(e))
        }
        ))
    }
    function ct(e) {
        let t;
        try {
            t = function(e) {
                var t, a, n, s, i, r, p = Math.ceil(64 / M) + 1, o = 0, m = new Array(p), d = new Array(p), y = new Array(p), l = new Array(p), c = new Array(p), g = new Array(p), h = new Array(p);
                for (t = 0; t < 3; ++t) {
                    for (a = 17 + (15 & nt(8)),
                    ue(g, Q(pe(nt(32), 32, 0), e)),
                    ue(h, g),
                    s = 1 << t + 18,
                    n = 1; n < s; ++n) {
                        for (++o,
                        ue(m, g),
                        ue(d, g),
                        fe(y, a); !ye(d); )
                            1 & d[0] && (Me(y, m),
                            se(y, e) && Ae(y, e)),
                            Me(m, m),
                            se(m, e) && Ae(m, e),
                            ve(d, 1);
                        if (ue(g, y),
                        se(g, h) ? (ue(c, g),
                        Ae(c, h)) : (ue(c, h),
                        Ae(c, g)),
                        te(c, e, l, m, d),
                        !me(l, 1))
                            break;
                        0 == (n & n - 1) && ue(h, g)
                    }
                    if (se(l, U))
                        break
                }
                ie(e, l, g, h),
                se(l, g) ? (i = g,
                r = l) : (i = l,
                r = g);
                return [new Uint8Array(ce(i)), new Uint8Array(ce(r)), o]
            }(oe(n(e), 16, Math.ceil(64 / M) + 1))
        } catch (e) {
            console.error("Pq leemon Exception", e)
        }
        return t
    }
    function gt(e, t, a) {
        try {
            const i = oe(n(e), 16)
              , r = oe(n(t), 16)
              , p = oe(n(a), 16);
            return s(le(Y(i, r, p), 16))
        } catch (e) {
            console.error("mod pow error", e)
        }
    }
    function ht(e, t) {
        return tt.a.inflate(e, t ? {
            to: "string"
        } : void 0)
    }
    const ut = +Oe.API.constructors.find(e => "boolFalse" === e.predicate).id
      , ft = +Oe.API.constructors.find(e => "boolTrue" === e.predicate).id
      , _t = +Oe.API.constructors.find(e => "vector" === e.predicate).id
      , vt = +Oe.MTProto.constructors.find(e => "gzip_packed" === e.predicate).id;
    class bt {
        constructor(e={}) {
            this.maxLength = 2048,
            this.offset = 0,
            this.mtproto = !1,
            this.debug = !1,
            this.maxLength = e.startMaxLength || 2048,
            this.mtproto = e.mtproto || !1,
            this.createBuffer()
        }
        createBuffer() {
            this.buffer = new ArrayBuffer(this.maxLength),
            this.intView = new Int32Array(this.buffer),
            this.byteView = new Uint8Array(this.buffer)
        }
        getArray() {
            const e = new ArrayBuffer(this.offset)
              , t = new Int32Array(e);
            return t.set(this.intView.subarray(0, this.offset / 4)),
            t
        }
        getBuffer() {
            return this.getArray().buffer
        }
        getBytes(e=!0) {
            if (e) {
                const e = new ArrayBuffer(this.offset)
                  , t = new Uint8Array(e);
                return t.set(this.byteView.subarray(0, this.offset)),
                t
            }
            const t = new Array(this.offset);
            for (let e = 0; e < this.offset; e++)
                t[e] = this.byteView[e];
            return t
        }
        getOffset() {
            return this.offset
        }
        checkLength(e) {
            if (this.offset + e < this.maxLength)
                return;
            this.maxLength = 4 * Math.ceil(Math.max(2 * this.maxLength, this.offset + e + 16) / 4);
            const t = this.buffer
              , a = new Int32Array(t);
            this.createBuffer(),
            new Int32Array(this.buffer).set(a)
        }
        writeInt(e, t) {
            this.debug && console.log(">>>", e.toString(16), e, t);
            const a = this.offset / 4;
            return this.checkLength(4),
            this.intView[a] = e,
            this.offset += 4,
            a
        }
        storeInt(e, t) {
            return this.writeInt(e, (t || "") + ":int")
        }
        storeBool(e, t) {
            e ? this.writeInt(ft, (t || "") + ":bool") : this.writeInt(ut, (t || "") + ":bool")
        }
        storeLongP(e, t, a) {
            this.writeInt(t, (a || "") + ":long[low]"),
            this.writeInt(e, (a || "") + ":long[high]")
        }
        storeLong(e, t) {
            if (Array.isArray(e))
                return 2 === e.length ? this.storeLongP(e[0], e[1], t) : this.storeIntBytes(e, 64, t);
            "string" != typeof e && (e = e ? e.toString() : "0");
            const a = 4294967296
              , n = oe(e, 10, 64)
              , s = he(n)
              , i = he(n);
            ie(n, oe(a.toString(16), 16, 64), s, i);
            const r = +le(s, 10);
            let p = +le(i, 10);
            r < p && (p -= a),
            this.writeInt(p, (t || "") + ":long[low]"),
            this.writeInt(r, (t || "") + ":long[high]")
        }
        storeDouble(e, t) {
            const a = new ArrayBuffer(8)
              , n = new Int32Array(a);
            new Float64Array(a)[0] = e,
            this.writeInt(n[0], (t || "") + ":double[low]"),
            this.writeInt(n[1], (t || "") + ":double[high]")
        }
        storeString(e, t) {
            this.debug && console.log(">>>", e, (t || "") + ":string"),
            void 0 === e && (e = "");
            const a = unescape(encodeURIComponent(e));
            this.checkLength(a.length + 8);
            const n = a.length;
            n <= 253 ? this.byteView[this.offset++] = n : (this.byteView[this.offset++] = 254,
            this.byteView[this.offset++] = 255 & n,
            this.byteView[this.offset++] = (65280 & n) >> 8,
            this.byteView[this.offset++] = (16711680 & n) >> 16);
            for (let e = 0; e < n; e++)
                this.byteView[this.offset++] = a.charCodeAt(e);
            for (; this.offset % 4; )
                this.byteView[this.offset++] = 0
        }
        storeBytes(e, t) {
            e instanceof ArrayBuffer ? e = new Uint8Array(e) : void 0 === e && (e = []),
            this.debug && console.log(">>>", n(e), (t || "") + ":bytes");
            const a = e.length;
            for (this.checkLength(a + 8),
            a <= 253 ? this.byteView[this.offset++] = a : (this.byteView[this.offset++] = 254,
            this.byteView[this.offset++] = 255 & a,
            this.byteView[this.offset++] = (65280 & a) >> 8,
            this.byteView[this.offset++] = (16711680 & a) >> 16),
            this.byteView.set(e, this.offset),
            this.offset += a; this.offset % 4; )
                this.byteView[this.offset++] = 0
        }
        storeIntBytes(e, t, a) {
            e instanceof ArrayBuffer && (e = new Uint8Array(e));
            const s = e.length;
            if (t % 32 || 8 * s !== t) {
                const n = new Error("Invalid bits: " + t + ", " + s);
                throw console.error(n, e, a),
                n
            }
            this.debug && console.log(">>>", n(e), (a || "") + ":int" + t),
            this.checkLength(s),
            this.byteView.set(e, this.offset),
            this.offset += s
        }
        storeRawBytes(e, t) {
            e instanceof ArrayBuffer && (e = new Uint8Array(e));
            const a = e.length;
            this.debug && console.log(">>>", n(e), t || ""),
            this.checkLength(a),
            this.byteView.set(e, this.offset),
            this.offset += a
        }
        storeMethod(e, t) {
            const a = (this.mtproto ? Oe.MTProto : Oe.API).methods.find(t => t.method === e);
            if (!a)
                throw new Error("No method " + e + " found");
            this.storeInt(a.id, e + "[id]");
            const n = t.pFlags || t
              , s = {};
            for (const i of a.params) {
                let a = i.type;
                if (-1 !== a.indexOf("?")) {
                    const e = a.split("?")
                      , s = e[0].split(".");
                    if (!(t[s[0]] & 1 << +s[1])) {
                        if (!("true" === e[1] ? n[i.name] : void 0 !== t[i.name]))
                            continue;
                        t[s[0]] |= 1 << +s[1]
                    }
                    a = e[1]
                }
                const r = this.storeObject(t[i.name], a, e + "[" + i.name + "]");
                "#" === a && (t[i.name] = t[i.name] || 0,
                s[i.name] = r)
            }
            for (let e in s)
                this.intView[s[e]] = t[e];
            return a.type
        }
        storeObject(e, t, a) {
            switch (t) {
            case "#":
                e = e || 0;
            case "int":
                return this.storeInt(e, a);
            case "long":
                return this.storeLong(e, a);
            case "int128":
                return this.storeIntBytes(e, 128, a);
            case "int256":
                return this.storeIntBytes(e, 256, a);
            case "int512":
                return this.storeIntBytes(e, 512, a);
            case "string":
                return this.storeString(e, a);
            case "bytes":
                return this.storeBytes(e, a);
            case "double":
                return this.storeDouble(e, a);
            case "Bool":
                return this.storeBool(e, a);
            case "true":
                return
            }
            if (Array.isArray(e)) {
                if ("Vector" === t.substr(0, 6))
                    this.writeInt(_t, a + "[id]");
                else if ("vector" !== t.substr(0, 6))
                    throw new Error("Invalid vector type " + t);
                const n = t.substr(7, t.length - 8);
                this.writeInt(e.length, a + "[count]");
                for (let t = 0; t < e.length; t++)
                    this.storeObject(e[t], n, a + "[" + t + "]");
                return !0
            }
            if ("vector" === t.substr(0, 6).toLowerCase())
                throw new Error("Invalid vector object");
            if (!xe(e))
                throw new Error("Invalid object for type " + t);
            const n = this.mtproto ? Oe.MTProto : Oe.API
              , s = e._;
            let i = !1;
            const r = n.constructors.find(e => e.predicate === s);
            if ((i = "%" === t.charAt(0)) && (t = t.substr(1)),
            !r)
                throw new Error("No predicate " + s + " found");
            s === t && (i = !0),
            i || this.writeInt(r.id, a + "[" + s + "][id]");
            const p = e.pFlags
              , o = {};
            for (const t of r.params) {
                let n = t.type;
                if (-1 !== n.indexOf("?")) {
                    const a = n.split("?")
                      , s = a[0].split(".");
                    if (!(e[s[0]] & 1 << +s[1])) {
                        if (!("true" === a[1] ? p && p[t.name] : void 0 !== e[t.name]))
                            continue;
                        e[s[0]] |= 1 << +s[1]
                    }
                    n = a[1]
                }
                const i = this.storeObject(e[t.name], n, a + "[" + s + "][" + t.name + "]");
                "#" === n && (e[t.name] = e[t.name] || 0,
                o[t.name] = i)
            }
            for (let t in o)
                this.intView[o[t]] = e[t];
            return r.type
        }
    }
    class Pt {
        constructor(e, t={}) {
            this.offset = 0,
            this.mtproto = !1,
            e instanceof ArrayBuffer ? (this.buffer = e,
            this.intView = new Int32Array(e),
            this.byteView = new Uint8Array(this.buffer)) : (this.buffer = e.buffer,
            this.intView = new Int32Array(e.buffer),
            this.byteView = e),
            this.override = t.override || {},
            this.mtproto = !!t.mtproto,
            this.debug = void 0 !== t.debug && t.debug
        }
        readInt(e) {
            if (this.byteView.length - this.offset < 4)
                throw console.error(this.byteView, this.offset),
                new Error("Nothing to fetch: " + e);
            const t = this.intView[this.offset / 4];
            return this.debug && console.log("<<<", t.toString(16), t, e, this.byteView.slice(this.offset - 16, this.offset + 16), this.byteView.slice(this.offset - 16, this.offset + 16).hex),
            this.offset += 4,
            t
        }
        fetchInt(e) {
            return this.readInt((e || "") + ":int")
        }
        fetchDouble(e) {
            const t = new ArrayBuffer(8)
              , a = new Int32Array(t)
              , n = new Float64Array(t);
            return a[0] = this.readInt((e || "") + ":double[low]"),
            a[1] = this.readInt((e || "") + ":double[high]"),
            n[0]
        }
        fetchLong(e) {
            const t = this.readInt((e || "") + ":long[low]")
              , a = Fe(this.readInt((e || "") + ":long[high]"), t);
            if (!this.mtproto) {
                const e = +a;
                if (Number.isSafeInteger(e))
                    return e
            }
            return a
        }
        fetchBool(e) {
            const t = this.readInt((e || "") + ":bool");
            return t === ft || t !== ut && (this.offset -= 4,
            this.fetchObject("Object", e))
        }
        fetchString(e) {
            let t = this.byteView[this.offset++];
            254 === t && (t = this.byteView[this.offset++] | this.byteView[this.offset++] << 8 | this.byteView[this.offset++] << 16);
            let a, n = "";
            for (let e = 0; e < t; e++)
                n += String.fromCharCode(this.byteView[this.offset++]);
            for (; this.offset % 4; )
                this.offset++;
            try {
                a = decodeURIComponent(escape(n))
            } catch (e) {
                a = n
            }
            return this.debug && console.log("<<<", a, (e || "") + ":string"),
            a
        }
        fetchBytes(e) {
            let t = this.byteView[this.offset++];
            254 === t && (t = this.byteView[this.offset++] | this.byteView[this.offset++] << 8 | this.byteView[this.offset++] << 16);
            const a = this.byteView.subarray(this.offset, this.offset + t);
            for (this.offset += t; this.offset % 4; )
                this.offset++;
            return this.debug && console.log("<<<", n(a), (e || "") + ":bytes"),
            a
        }
        fetchIntBytes(e, t=!0, a) {
            if (e % 32)
                throw new Error("Invalid bits: " + e);
            const s = e / 8;
            if (t) {
                const e = this.byteView.subarray(this.offset, this.offset + s);
                return this.offset += s,
                e
            }
            const i = new Array(s);
            for (let e = 0; e < s; e++)
                i[e] = this.byteView[this.offset++];
            return this.debug && console.log("<<<", n(i), (a || "") + ":int" + e),
            i
        }
        fetchRawBytes(e, t=!0, a) {
            if (!1 === e && (e = this.readInt((a || "") + "_length")) > this.byteView.byteLength)
                throw new Error("Invalid raw bytes length: " + e + ", buffer len: " + this.byteView.byteLength);
            if (t) {
                const t = new Uint8Array(e);
                return t.set(this.byteView.subarray(this.offset, this.offset + e)),
                this.offset += e,
                t
            }
            const s = new Array(e);
            for (let t = 0; t < e; t++)
                s[t] = this.byteView[this.offset++];
            return this.debug && console.log("<<<", n(s), a || ""),
            s
        }
        fetchVector(e, t) {
            const a = this.readInt(t + "[count]")
              , n = new Array(a);
            if (a > 0) {
                const s = e.substr(7, e.length - 8);
                for (let e = 0; e < a; ++e)
                    n[e] = this.fetchObject(s, t + "[" + e + "]")
            }
            return n
        }
        fetchObject(e, t, a="123456789") {
            switch (e) {
            case "#":
            case "int":
                return this.fetchInt(t);
            case "long":
                return this.fetchLong(t);
            case "int128":
                return this.fetchIntBytes(128, !0, t);
            case "int256":
                return this.fetchIntBytes(256, !0, t);
            case "int512":
                return this.fetchIntBytes(512, !0, t);
            case "string":
                return this.fetchString(t);
            case "bytes":
                return this.fetchBytes(t);
            case "double":
                return this.fetchDouble(t);
            case "Bool":
                return this.fetchBool(t);
            case "true":
                return !0
            }
            if (t = t || e || "Object",
            "v" === e.charAt(0) && "ector" === e.substr(1, 5))
                return this.fetchVector(e, t);
            const n = this.mtproto ? Oe.MTProto : Oe.API;
            let s = null
              , i = !1;
            if ("%" === e.charAt(0)) {
                const t = e.substr(1);
                if (s = n.constructors.find(e => e.type === t),
                !s)
                    throw new Error("Constructor not found for type: " + e)
            } else {
                const a = this.readInt(t + "[id]");
                if (a === vt) {
                    const a = ht(this.fetchBytes(t + "[packed_string]"));
                    return new Pt(a).fetchObject(e, t)
                }
                if (a === _t)
                    return this.fetchVector(e, t);
                let r = n.constructorsIndex;
                if (!r) {
                    n.constructorsIndex = r = {};
                    for (let e = 0, t = n.constructors.length; e < t; e++)
                        r[n.constructors[e].id] = e
                }
                const p = r[a];
                if (void 0 !== p && (s = n.constructors[p]),
                !s && this.mtproto) {
                    const e = Oe.API;
                    for (let t = 0, n = e.constructors.length; t < n; t++)
                        if (+e.constructors[t].id === a) {
                            s = e.constructors[t],
                            delete this.mtproto,
                            i = !0;
                            break
                        }
                }
                if (!s) {
                    let e, n;
                    console.error("Constructor not found:", a);
                    try {
                        e = this.fetchInt(t),
                        n = this.fetchInt(t)
                    } catch (e) {}
                    throw console.trace({
                        error: "Constructor not found: " + a + " " + e + " " + n + " " + t,
                        karevan: "tl_utils.ts fetchObject():761"
                    }),
                    new Error("Constructor not found: " + a + " " + e + " " + n + " " + t)
                }
            }
            const r = s.predicate
              , p = {
                _: r
            };
            p._constructor = s.id;
            const o = (this.mtproto ? "mt_" : "") + r;
            if (this.override[o])
                this.override[o](p, t + "[" + r + "]");
            else
                for (let e = 0, a = s.params.length; e < a; e++) {
                    const a = s.params[e];
                    let n = a.type;
                    "#" === n && void 0 === p.pFlags && (p.pFlags = {});
                    const i = -1 !== n.indexOf("?");
                    if (i) {
                        const e = n.split("?")
                          , t = e[0].split(".");
                        if (!(p[t[0]] & 1 << +t[1]))
                            continue;
                        n = e[1]
                    }
                    const o = this.fetchObject(n, t + "[" + r + "][" + a.name + "]");
                    i && "true" === n ? p.pFlags[a.name] = o : p[a.name] = o
                }
            return i && (this.mtproto = !0),
            "boolTrue" === (null == p ? void 0 : p._) || "boolFalse" !== (null == p ? void 0 : p._) && p
        }
        getOffset() {
            return this.offset
        }
        setOffset(e) {
            this.offset = e
        }
    }
    c.TLDeserialization = Pt,
    c.TLSerialization = bt;
    var wt;
    !function(e) {
        e[e.None = 0] = "None",
        e[e.Error = 1] = "Error",
        e[e.Warn = 2] = "Warn",
        e[e.Log = 4] = "Log",
        e[e.Debug = 8] = "Debug"
    }(wt || (wt = {}));
    const St = [wt.None, wt.Error, wt.Warn, wt.Log, wt.Debug]
      , kt = Date.now();
    function It() {
        return "[" + ((Date.now() - kt) / 1e3).toFixed(3) + "]"
    }
    function Ct(e, t=wt.Log | wt.Warn | wt.Error, a=!1) {
        function n(...a) {
            return t & wt.Log && console.log(It(), e, ...a)
        }
        return g || a || (t = wt.Error),
        n.warn = function(...a) {
            return t & wt.Warn && console.warn(It(), e, ...a)
        }
        ,
        n.info = function(...a) {
            return t & wt.Log && console.info(It(), e, ...a)
        }
        ,
        n.error = function(...a) {
            return t & wt.Error && console.error(It(), e, ...a)
        }
        ,
        n.trace = function(...a) {
            return t & wt.Log && console.trace(It(), e, ...a)
        }
        ,
        n.debug = function(...a) {
            return t & wt.Debug && console.debug(It(), e, ...a)
        }
        ,
        n.setPrefix = function(t) {
            e = "[" + t + "]:"
        }
        ,
        n.setPrefix(e),
        n.setLevel = function(e) {
            t = St.slice(0, e + 1).reduce( (e, t) => e | t, 0)
        }
        ,
        n
    }
    var At = function(e, t, a, n) {
        return new (a || (a = Promise))((function(s, i) {
            function r(e) {
                try {
                    o(n.next(e))
                } catch (e) {
                    i(e)
                }
            }
            function p(e) {
                try {
                    o(n.throw(e))
                } catch (e) {
                    i(e)
                }
            }
            function o(e) {
                var t;
                e.done ? s(e.value) : (t = e.value,
                t instanceof a ? t : new a((function(e) {
                    e(t)
                }
                ))).then(r, p)
            }
            o((n = n.apply(e, t || [])).next())
        }
        ))
    };
    Ct("SRP", wt.Error);
    function Mt(e, t, a) {
        return At(this, void 0, void 0, (function*() {
            if ("account.password" === t._) {
                const i = a ? t.new_algo : t.current_algo
                  , m = oe(n(i.p), 16)
                  , d = pe(i.g, 32, 256)
                  , y = oe(n(yield function(e, t, a) {
                    return At(this, void 0, void 0, (function*() {
                        let n = yield Rt.invokeCrypto("sha256-hash", o(t, (new TextEncoder).encode(e), t));
                        n = o(a, n, a),
                        n = yield Rt.invokeCrypto("sha256-hash", n);
                        let s = yield Rt.invokeCrypto("pbkdf2", new Uint8Array(n), t, 1e5);
                        return s = o(a, s, a),
                        n = yield Rt.invokeCrypto("sha256-hash", s),
                        n
                    }
                    ))
                }(e, i.salt1, i.salt2)), 16)
                  , l = function(e, t) {
                    return e instanceof Uint8Array || (e = p(e)),
                    Le(e, t, !0, !0, !0)
                }
                  , c = Y(d, y, m)
                  , g = e => {
                    const t = new Uint8Array(e.length);
                    for (let a = 0; a < e.length; a += 4)
                        t[a] = e[a + 3],
                        t[a + 1] = e[a + 2],
                        t[a + 2] = e[a + 1],
                        t[a + 3] = e[a];
                    return t
                }
                ;
                if (a) {
                    return l(s(le(c, 16)), 256)
                }
                const h = oe(n(t.srp_B), 16)
                  , u = l(s(le(m, 16)), 256)
                  , f = l(s(le(d, 16)), 256)
                  , _ = l(s(le(h, 16)), 256)
                  , v = Q(X(oe(n(yield Rt.invokeCrypto("sha256-hash", o(u, f))), 16), c), m)
                  , b = (e, t) => {
                    const a = $(t, e);
                    return !(ae(a) || J(a) < 1984 || J(e) < 1984 || Math.floor((J(e) + 7) / 8) > 256)
                }
                  , P = () => At(this, void 0, void 0, (function*() {
                    for (; ; ) {
                        const e = oe(n(g(t.secure_random)), 16)
                          , a = Y(d, e, m);
                        if (b(a, m)) {
                            const t = s(le(a, 16))
                              , n = oe((yield Rt.invokeCrypto("sha256-hash", o(t, _))).hex, 16);
                            if (!ye(n) && !ae(n))
                                return {
                                    a: e,
                                    a_for_hash: t,
                                    u: n
                                }
                        }
                    }
                }
                ))
                  , {a: w, a_for_hash: S, u: k} = yield P();
                let I;
                I = se(h, v) ? h : ee(h, m),
                I = Q($(I, v), m);
                const C = Y(I, ee(w, X(k, y)), m)
                  , A = yield Rt.invokeCrypto("sha256-hash", l(s(le(C, 16)), 256));
                let M = yield Rt.invokeCrypto("sha256-hash", u);
                M = r(M, yield Rt.invokeCrypto("sha256-hash", f));
                const R = o(M, yield Rt.invokeCrypto("sha256-hash", i.salt1), yield Rt.invokeCrypto("sha256-hash", i.salt2), S, _, A)
                  , E = yield Rt.invokeCrypto("sha256-hash", R);
                return {
                    _: "inputCheckPasswordSRP",
                    srp_id: t.srp_id,
                    A: new Uint8Array(S),
                    M1: E
                }
            }
        }
        ))
    }
    var Rt = new class extends class {
        invokeCrypto(e, ...t) {
            return this.performTaskWorker(e, ...t)
        }
    }
    {
        constructor() {
            super(),
            this.webWorker = !1,
            this.taskId = 0,
            this.awaiting = {},
            this.pending = [],
            this.debug = !1,
            console.log("CW constructor"),
            this.utils = {
                "sha1-hash": pt,
                "sha256-hash": ot,
                pbkdf2: lt,
                "aes-encrypt": mt,
                "aes-decrypt": dt,
                "rsa-encrypt": yt,
                factorize: ct,
                "mod-pow": gt,
                gzipUncompress: ht,
                computeSRP: Mt
            }
        }
        performTaskWorker(e, ...t) {
            return this.debug && console.log("CW start", e, t),
            Promise.resolve(this.utils[e](...t))
        }
    }
    ;
    const Et = new class {
        constructor() {
            this.lastMessageId = [0, 0],
            this.timeOffset = 0,
            A.get("server_time_offset").then(e => {
                e && (this.timeOffset = e)
            }
            )
        }
        generateId() {
            const e = Date.now();
            let t = [Math.floor(e / 1e3) + this.timeOffset, e % 1e3 << 21 | nt(16) << 3 | 4];
            (this.lastMessageId[0] > t[0] || this.lastMessageId[0] === t[0] && this.lastMessageId[1] >= t[1]) && (t = [this.lastMessageId[0], this.lastMessageId[1] + 4]),
            this.lastMessageId = t;
            return Fe(t[0], t[1])
        }
        applyServerTime(e, t) {
            const a = e - (t = (t || Date.now()) / 1e3 | 0)
              , n = Math.abs(this.timeOffset - a) > 10;
            A.set({
                server_time_offset: a
            }),
            this.lastMessageId = [0, 0],
            this.timeOffset = a;
            return P({
                type: "applyServerTimeOffset",
                payload: a
            }),
            n
        }
    }
    ;
    c.timeManager = Et;
    var Tt = Et;
    const Vt = {
        id: 1025907,
        hash: "452b0359b988148995f22ff0f4229750",
        version: "4.6.12",
        versionFull: "4.6.12 (78)",
        build: 78,
        langPackVersion: "0.3.7",
        langPack: "macos",
        langPackCode: "fa",
        domains: ["web.eitaa.com"],
        baseDcId: 2,
        isMainDomain: "web.eitaa.com" === location.hostname,
        suffix: "K",
        eitaaMaxInvalidLoginCount: 7,
        eitaaNoSend: ["messages.receivedMessages", "account.registerDevice", "messages.getAllStickers", "messages.getStickers", "messages.getStickerSet", "auth.exportAuthorization", "http_wait", "account.getNotifySettings", "messages.setTyping", "messages.getAllDrafts", "messages.getScheduledHistory", "messages.getEmojiKeywordsDifference", "messages.getInlineBotResults", "messages.saveDraft", "account.getContentSettings"],
        sentryRate: "0.05"
    };
    Vt.isMainDomain && (Vt.id = 2496,
    Vt.hash = "8da85b0d5bfe62527e5b244c209159c3");
    var Ut = Vt;
    function Dt() {}
    class xt {
        constructor(e, t, a) {
            this.dcId = e,
            this.url = t,
            this.type = a
        }
        send(e) {
            return fetch(this.url, {
                method: "POST",
                body: e
            }).then(e => {
                if (200 !== e.status)
                    throw e.arrayBuffer().then(e => {
                        console.log("not 200", new TextDecoder("utf-8").decode(new Uint8Array(e)))
                    }
                    ),
                    e;
                return e.arrayBuffer().then(e => new Uint8Array(e))
            }
            )
        }
        getConfig() {
            return {
                dcId: this.dcId,
                url: this.url,
                type: this.type
            }
        }
    }
    var Bt;
    !function(e) {
        e[e.Connected = 0] = "Connected",
        e[e.Connecting = 1] = "Connecting",
        e[e.Closed = 2] = "Closed",
        e[e.TimedOut = 3] = "TimedOut"
    }(Bt || (Bt = {}));
    var Ft = "undefined" != typeof window ? window : self;
    class Lt {
        constructor(e) {
            this._constructor(e)
        }
        _constructor(e=!1) {
            this.reuseResults = e,
            this.listeners = {},
            this.listenerResults = {}
        }
        addEventListener(e, t, a) {
            var n, s;
            (null !== (n = this.listeners[e]) && void 0 !== n ? n : this.listeners[e] = []).push({
                callback: t,
                options: a
            }),
            this.listenerResults.hasOwnProperty(e) && (t(...this.listenerResults[e]),
            null === (s = a) || void 0 === s ? void 0 : s.once) && this.listeners[e].pop()
        }
        addMultipleEventsListeners(e) {
            for (const t in e)
                this.addEventListener(t, e[t])
        }
        removeEventListener(e, t, a) {
            this.listeners[e] && this.listeners[e].findAndSplice(e => e.callback === t)
        }
        invokeListenerCallback(e, t, ...a) {
            var n;
            let s, i;
            try {
                s = t.callback(...a)
            } catch (e) {
                i = e
            }
            if ((null === (n = t.options) || void 0 === n ? void 0 : n.once) && this.removeEventListener(e, t.callback),
            i)
                throw i;
            return s
        }
        _dispatchEvent(e, t, ...a) {
            this.reuseResults && (this.listenerResults[e] = a);
            const n = t && []
              , s = this.listeners[e];
            if (s) {
                s.slice().forEach(t => {
                    if (-1 === s.findIndex(e => e.callback === t.callback))
                        return;
                    const i = this.invokeListenerCallback(e, t, ...a);
                    n && n.push(i)
                }
                )
            }
            return n
        }
        dispatchResultableEvent(e, ...t) {
            return this._dispatchEvent(e, !0, ...t)
        }
        dispatchEvent(e, ...t) {
            this.reuseResults && (this.listenerResults[e] = t);
            const a = []
              , n = this.listeners[e];
            if (n) {
                n.slice().forEach(s => {
                    var i;
                    -1 !== n.findIndex(e => e.callback === s.callback) && (a.push(s.callback(...t)),
                    (null === (i = s.options) || void 0 === i ? void 0 : i.once) && this.removeEventListener(e, s.callback))
                }
                )
            }
            return a
        }
        cleanup() {
            this.listeners = {},
            this.listenerResults = {}
        }
    }
    const Ot = new class extends Lt {
        constructor() {
            super(),
            this.overlaysActive = 0,
            this.idle = {
                isIDLE: !0,
                deactivated: !1,
                focusPromise: Promise.resolve(),
                focusResolve: () => {}
            },
            this.connectionStatus = {},
            this.filterId = 0,
            this.config = {
                forwarded_count_max: 100,
                edit_time_limit: 26784e4,
                pinned_dialogs_count_max: 5,
                pinned_infolder_count_max: 100,
                message_length_max: 4096,
                caption_length_max: 1024,
                schedule_period_foreground_ms: 15e3,
                schedule_period_background_ms: 18e4,
                schedule_period_background_delay_ms: 6e4
            },
            this.payHash = "",
            this.addEventListener("peer_changed", e => {
                this.peerId = e
            }
            ),
            this.addEventListener("user_auth", ({id: e}) => {
                this.myId = +e
            }
            ),
            this.addEventListener("connection_status_change", e => {
                this.connectionStatus[e.name] = e
            }
            ),
            this.addEventListener("idle", e => {
                e ? this.idle.focusPromise = new Promise(e => {
                    this.idle.focusResolve = e
                }
                ) : this.idle.focusResolve()
            }
            )
        }
        get themeColorElem() {
            return void 0 !== this._themeColorElem ? this._themeColorElem : this._themeColorElem = document.head.querySelector('[name="theme-color"]') || null
        }
        setThemeColor(e=this.themeColor) {
            e || (e = this.isNight() ? "#212121" : "#ffffff");
            const t = this.themeColorElem;
            t && t.setAttribute("content", e)
        }
        setThemeListener() {
            try {
                const e = window.matchMedia("(prefers-color-scheme: dark)")
                  , t = () => {
                    this.systemTheme = e.matches ? "night" : "day",
                    this.myId ? this.dispatchEvent("theme_change") : this.setTheme()
                }
                ;
                "addEventListener"in e ? e.addEventListener("change", t) : "addListener"in e && e.addListener(t),
                t()
            } catch (e) {}
        }
        setTheme() {
            const e = this.isNight()
              , t = document.head.querySelector('[name="color-scheme"]');
            t && t.setAttribute("content", e ? "dark" : "light"),
            document.documentElement.classList.toggle("night", e),
            this.setThemeColor()
        }
        get isOverlayActive() {
            return this.overlaysActive > 0
        }
        set isOverlayActive(e) {
            this.overlaysActive += e ? 1 : -1,
            this.dispatchEvent("overlay_toggle", this.isOverlayActive)
        }
        isNight() {
            return "night" === this.getTheme().name
        }
        setPlatform() {
            A.get("eitaa_platform").then(e => {
                this.platform = e
            }
            )
        }
        setUserAgent() {
            A.get("eitaa_user_agent").then(e => {
                this.userAgent = e
            }
            )
        }
        setVersion() {
            A.get("eitaa_version").then(e => {
                this.version = e
            }
            )
        }
        getTheme(e=("system" === this.settings.theme ? this.systemTheme : this.settings.theme)) {
            return this.settings.themes.find(t => t.name === e)
        }
        setDirection() {
            "rtl" === document.documentElement.dir ? (document.documentElement.dir = "ltr",
            document.documentElement.classList.remove("is-rtl")) : (document.documentElement.dir = "rtl",
            document.documentElement.classList.add("is-rtl")),
            this.setThemeColor()
        }
        getDirection(e=this.settings.direction) {
            return this.settings.directions.find(t => t.name === e)
        }
    }
    ;
    c.rootScope = Ot;
    var Nt = Ot;
    function qt() {
        let e = {
            isFulfilled: !1,
            isRejected: !1,
            notify: () => {}
            ,
            notifyAll: (...t) => {
                e.lastNotify = t,
                e.listeners.forEach(e => e(...t))
            }
            ,
            listeners: [],
            addNotifyListener: t => {
                e.lastNotify && t(...e.lastNotify),
                e.listeners.push(t)
            }
        }
          , t = new Promise( (a, n) => {
            e.resolve = e => {
                t.isFulfilled || t.isRejected || (t.isFulfilled = !0,
                a(e))
            }
            ,
            e.reject = (...e) => {
                t.isRejected || t.isFulfilled || (t.isRejected = !0,
                n(...e))
            }
        }
        );
        return t.catch(Dt).finally( () => {
            t.notify = t.notifyAll = t.lastNotify = null,
            t.listeners.length = 0,
            t.cancel && (t.cancel = () => {}
            )
        }
        ),
        Object.assign(t, e),
        t
    }
    function Gt(e, t, a=!0) {
        let n, s, i = null;
        return (...r) => {
            n = !0,
            s = r,
            i || (a && (n = !1,
            e(...s)),
            i = setInterval( () => {
                if (!n)
                    return clearInterval(i),
                    void (i = null);
                n = !1,
                e(...s)
            }
            , t))
        }
    }
    function zt(e, t) {
        return new Promise(a => {
            const n = new FileReader;
            n.addEventListener("loadend", e => a(e.target.result)),
            n[t](e)
        }
        )
    }
    function jt(e) {
        return zt(e, "readAsArrayBuffer")
    }
    function Kt(e, t="") {
        let a;
        const n = function(e) {
            if (-1 === ["image/jpeg", "image/png", "image/gif", "image/svg+xml", "image/webp", "image/bmp", "video/mp4", "video/webm", "video/quicktime", "audio/ogg", "audio/mpeg", "audio/mp4", "application/json", "application/pdf"].indexOf(e))
                return "application/octet-stream";
            return e
        }(t);
        try {
            a = new Blob(e,{
                type: n
            })
        } catch (t) {
            let s = new BlobBuilder;
            e.forEach(e => {
                s.append(e)
            }
            ),
            a = s.getBlob(n)
        }
        return a
    }
    class Wt {
        constructor(e, t) {
            this.storageIsAvailable = !0,
            function(e, t) {
                if (t)
                    for (let a in t)
                        void 0 !== t[a] && (e[a] = t[a])
            }(this, e),
            y.test && (this.name += "_test"),
            this.storeName = t,
            this.log = Ct("IDB-" + this.storeName),
            this.openDatabase(!0),
            Wt.STORAGES.push(this)
        }
        static closeDatabases(e) {
            this.STORAGES.forEach(t => {
                if (e && e === t)
                    return;
                const a = t.db;
                a && (a.onclose = () => {}
                ,
                a.close())
            }
            )
        }
        static clearObjectStores() {
            const e = this.STORAGES[0];
            this.closeDatabases(e);
            const t = Array.from(e.db.objectStoreNames).map(t => e.clear(t));
            return Promise.all(t)
        }
        isAvailable() {
            return this.storageIsAvailable
        }
        openDatabase(e=!1) {
            if (this.openDbPromise && !e)
                return this.openDbPromise;
            try {
                var t = indexedDB.open(this.name, this.version);
                if (!t)
                    return Promise.reject()
            } catch (e) {
                return this.log.error("error opening db", e.message),
                this.storageIsAvailable = !1,
                Promise.reject(e)
            }
            let a = !1;
            return setTimeout( () => {
                a || t.onerror({
                    type: "IDB_CREATE_TIMEOUT"
                })
            }
            , 3e3),
            this.openDbPromise = new Promise( (e, n) => {
                t.onsuccess = s => {
                    a = !0;
                    const i = t.result;
                    let r = !1;
                    this.log("Opened"),
                    i.onerror = e => {
                        this.storageIsAvailable = !1,
                        this.log.error("Error creating/accessing IndexedDB database", e),
                        n(e)
                    }
                    ,
                    i.onclose = e => {
                        this.log.error("closed:", e),
                        !r && this.openDatabase()
                    }
                    ,
                    i.onabort = e => {
                        this.log.error("abort:", e);
                        const t = e.target;
                        this.openDatabase(r = !0),
                        t.onerror && t.onerror(e),
                        i.close()
                    }
                    ,
                    i.onversionchange = e => {
                        this.log.error("onversionchange, lol?")
                    }
                    ,
                    e(this.db = i)
                }
                ,
                t.onerror = e => {
                    a = !0,
                    this.storageIsAvailable = !1,
                    this.log.error("Error creating/accessing IndexedDB database", e),
                    n(e)
                }
                ,
                t.onupgradeneeded = e => {
                    a = !0,
                    this.log.warn("performing idb upgrade from", e.oldVersion, "to", e.newVersion);
                    var t = e.target.result;
                    this.stores.forEach(e => {
                        t.objectStoreNames.contains(e.name) || ( (e, t) => {
                            var a;
                            const n = e.createObjectStore(t.name);
                            if (null === (a = t.indexes) || void 0 === a ? void 0 : a.length)
                                for (const e of t.indexes)
                                    n.createIndex(e.indexName, e.keyPath, e.objectParameters)
                        }
                        )(t, e)
                    }
                    )
                }
            }
            )
        }
        delete(e) {
            return Array.isArray(e) || (e = [].concat(e)),
            this.getObjectStore("readwrite", t => e.map(e => t.delete(e)), "")
        }
        clear(e) {
            return this.getObjectStore("readwrite", e => e.clear(), "", e)
        }
        save(e, t) {
            return Array.isArray(e) || (e = [].concat(e),
            t = [].concat(t)),
            this.getObjectStore("readwrite", a => e.map( (e, n) => a.put(t[n], e)), "")
        }
        saveFile(e, t) {
            return t instanceof Blob || (t = Kt([t])),
            this.save(e, t)
        }
        get(e) {
            return Array.isArray(e) || (e = [].concat(e)),
            this.getObjectStore("readonly", t => e.map(e => t.get(e)), "")
        }
        getObjectStore(e, t, a, n=this.storeName) {
            let s;
            return a && (s = performance.now(),
            this.log(a + ": start")),
            this.openDatabase().then(i => new Promise( (r, p) => {
                const o = i.transaction([n], e);
                o.onerror = e => {
                    clearTimeout(m),
                    p(o.error)
                }
                ,
                o.oncomplete = e => {
                    clearTimeout(m),
                    a && this.log(a + ": end", performance.now() - s);
                    const t = l.map(e => e.result);
                    r(y ? t : t[0])
                }
                ;
                const m = setTimeout( () => {
                    this.log.error("transaction not finished", o)
                }
                , 1e4)
                  , d = t(o.objectStore(n))
                  , y = Array.isArray(d)
                  , l = y ? d : [].concat(d)
            }
            ))
        }
        getAll() {
            return this.getObjectStore("readonly", e => e.getAll(), "")
        }
    }
    Wt.STORAGES = [];
    var Ht = function(e, t, a, n) {
        return new (a || (a = Promise))((function(s, i) {
            function r(e) {
                try {
                    o(n.next(e))
                } catch (e) {
                    i(e)
                }
            }
            function p(e) {
                try {
                    o(n.throw(e))
                } catch (e) {
                    i(e)
                }
            }
            function o(e) {
                var t;
                e.done ? s(e.value) : (t = e.value,
                t instanceof a ? t : new a((function(e) {
                    e(t)
                }
                ))).then(r, p)
            }
            o((n = n.apply(e, t || [])).next())
        }
        ))
    };
    function Jt() {}
    class Zt {
        constructor(e, t) {
            this.db = e,
            this.storeName = t,
            this.cache = {},
            this.useStorage = !0,
            this.getPromises = new Map,
            this.keysToSet = new Set,
            this.saveDeferred = qt(),
            this.keysToDelete = new Set,
            this.deleteDeferred = qt(),
            this.storage = new Wt(e,t),
            Zt.STORAGES.length && (this.useStorage = Zt.STORAGES[0].useStorage),
            Zt.STORAGES.push(this),
            this.saveThrottled = Gt( () => Ht(this, void 0, void 0, (function*() {
                const e = this.saveDeferred;
                this.saveDeferred = qt();
                const t = this.keysToSet;
                if (t.size) {
                    const e = Array.from(t.values());
                    t.clear();
                    try {
                        const t = e.map(e => this.cache[e]);
                        yield this.storage.save(e, t)
                    } catch (t) {
                        console.error("[AS]: set error:", t, e)
                    }
                }
                e.resolve(),
                t.size && this.saveThrottled()
            }
            )), 16, !1),
            this.deleteThrottled = Gt( () => Ht(this, void 0, void 0, (function*() {
                const e = this.deleteDeferred;
                this.deleteDeferred = qt();
                const t = this.keysToDelete;
                if (t.size) {
                    const e = Array.from(t.values());
                    t.clear();
                    try {
                        yield this.storage.delete(e)
                    } catch (t) {
                        console.error("[AS]: delete error:", t, e)
                    }
                }
                e.resolve(),
                t.size && this.deleteThrottled()
            }
            )), 16, !1),
            this.getThrottled = Gt( () => Ht(this, void 0, void 0, (function*() {
                const e = Array.from(this.getPromises.keys());
                this.storage.get(e).then(t => {
                    for (let a = 0, n = e.length; a < n; ++a) {
                        const n = e[a]
                          , s = this.getPromises.get(n);
                        s && (s.resolve(this.cache[n] = t[a]),
                        this.getPromises.delete(n))
                    }
                }
                , a => {
                    ["NO_ENTRY_FOUND", "STORAGE_OFFLINE"].includes(a) || (this.useStorage = !1,
                    console.error("[AS]: get error:", a, e, t));
                    for (let t = 0, a = e.length; t < a; ++t) {
                        const a = e[t]
                          , n = this.getPromises.get(a);
                        n && (n.resolve(void 0),
                        this.getPromises.delete(a))
                    }
                }
                ).finally( () => {
                    this.getPromises.size && this.getThrottled()
                }
                )
            }
            )), 16, !1)
        }
        isAvailable() {
            return this.useStorage
        }
        getCache() {
            return this.cache
        }
        getFromCache(e) {
            return this.cache[e]
        }
        setToCache(e, t) {
            return this.cache[e] = t
        }
        get(e, t=!0) {
            return Ht(this, void 0, void 0, (function*() {
                if (this.cache.hasOwnProperty(e) && t)
                    return this.getFromCache(e);
                if (this.useStorage) {
                    const t = this.getPromises.get(e);
                    if (t)
                        return t;
                    const a = qt();
                    return this.getPromises.set(e, a),
                    this.getThrottled(),
                    a
                }
            }
            ))
        }
        getAll() {
            return this.storage.getAll().catch( () => [])
        }
        set(e, t=!1) {
            for (const a in e)
                if (e.hasOwnProperty(a)) {
                    const n = e[a];
                    this.setToCache(a, n),
                    this.useStorage && !t && (this.keysToSet.add(a),
                    this.keysToDelete.delete(a),
                    this.saveThrottled())
                }
            return this.useStorage ? this.saveDeferred : Promise.resolve()
        }
        delete(e, t=!1) {
            return e = "" + e,
            t || delete this.cache[e],
            this.useStorage && (this.keysToSet.delete(e),
            this.keysToDelete.add(e),
            this.deleteThrottled()),
            this.useStorage ? this.deleteDeferred : Promise.resolve()
        }
        clear(e=!1) {
            if (!e)
                for (const e in this.cache)
                    delete this.cache[e];
            return this.storage.clear().catch(Jt)
        }
        static toggleStorage(e) {
            return Promise.all(this.STORAGES.map(t => (t.useStorage = e,
            e ? t.set(t.cache) : (t.keysToSet.clear(),
            t.keysToDelete.clear(),
            t.getPromises.forEach(e => e.resolve(void 0)),
            t.getPromises.clear(),
            t.clear(!0))))).catch(Jt)
        }
    }
    Zt.STORAGES = [];
    const Qt = new Zt({
        name: "tweb",
        version: 7,
        stores: [{
            name: "session"
        }, {
            name: "stickerSets"
        }, {
            name: "users"
        }, {
            name: "chats"
        }, {
            name: "dialogs"
        }, {
            name: "messages"
        }]
    },"session");
    c.stateStorage = Qt;
    var Xt = Qt;
    class Yt {
        constructor() {
            this.sslSubdomains = ["pluto", "venus", "aurora", "vesta", "flora"],
            this.failedServers = {
                client: [],
                download: [],
                upload: []
            },
            this.resetFilteredServersCount = 0,
            this.maxResetFilteredServersCount = 3,
            this.dcClients = y.debug ? ["https://dev3.eitaa.com/eitaa/index.php"] : ["https://hasan.eitaa.ir/eitaa/", "https://hosna.eitaa.com/eitaa/", "https://armita.eitaa.com/eitaa/", "https://majid.eitaa.com/eitaa/", "https://alireza.eitaa.com/eitaa/", "https://mostafa.eitaa.com/eitaa/", "https://sajad.eitaa.ir/eitaa/", "https://bagher.eitaa.ir/eitaa/", "https://sadegh.eitaa.ir/eitaa/", "https://kazem.eitaa.ir/eitaa/"],
            this.dcDownloads = y.debug ? ["https://mohsen.eitaa.com/eitaa/"] : ["https://mohsen.eitaa.com/eitaa/", "https://ghasem.eitaa.com/eitaa/", "https://hadi.eitaa.com/eitaa/", "https://hossein.eitaa.com/eitaa/", "https://vahid.eitaa.com/eitaa/"],
            this.dcUploads = y.debug ? ["https://alzheimer.eitaa.com/eitaa/"] : ["https://alzheimer.eitaa.com/eitaa/", "https://fateme.eitaa.com/eitaa/", "https://ali.eitaa.com/eitaa/", "https://meysam.eitaa.com/eitaa/"],
            this.chosenServers = {},
            this.filterServers = (e, t) => {
                if (t.length) {
                    return e.filter(e => !t.includes(e))
                }
                return e
            }
            ,
            this.checkForClearFilteredServers = (e, t) => {
                this.failedServers[e].length === t.length && (this.clearFilteredServers(e),
                this.resetFilteredServersCount++)
            }
            ,
            this.clearFilteredServers = e => {
                this.failedServers[e] = []
            }
            ,
            this.transportHTTP = (e, t, a) => {
                let n, s;
                switch (t) {
                case "client":
                    this.checkForClearFilteredServers(t, this.dcClients),
                    s = this.filterServers(this.dcClients, this.failedServers[t]);
                    break;
                case "download":
                    this.checkForClearFilteredServers(t, this.dcDownloads),
                    s = this.filterServers(this.dcDownloads, this.failedServers[t]);
                    break;
                case "upload":
                    this.checkForClearFilteredServers(t, this.dcUploads),
                    s = this.filterServers(this.dcUploads, this.failedServers[t])
                }
                return n = s[Math.floor(Math.random() * s.length)],
                new xt(e,n,t)
            }
        }
        chooseServer(e, t="client", a="websocket", n=!0) {
            this.chosenServers.hasOwnProperty(a) || (this.chosenServers[a] = {
                client: {},
                download: {},
                upload: {}
            });
            const s = this.chosenServers[a][t];
            e in s || (s[e] = []);
            const i = s[e];
            if (!i.length || !n) {
                let a;
                const s = "client" === t ? "" : "-1";
                return a = this.transportHTTP(e, t, s),
                a ? (n && i.push(a),
                a) : (console.error("No chosenServer!", e),
                null)
            }
            return i[0]
        }
        static removeTransport(e, t) {
            for (const a in e)
                for (const n in e[a])
                    for (const s in e[a][n]) {
                        const i = e[a][n][s]
                          , r = i.indexOf(t);
                        -1 !== r && i.splice(r, 1)
                    }
        }
    }
    var $t = new Yt
      , ea = function(e, t, a, n) {
        return new (a || (a = Promise))((function(s, i) {
            function r(e) {
                try {
                    o(n.next(e))
                } catch (e) {
                    i(e)
                }
            }
            function p(e) {
                try {
                    o(n.throw(e))
                } catch (e) {
                    i(e)
                }
            }
            function o(e) {
                var t;
                e.done ? s(e.value) : (t = e.value,
                t instanceof a ? t : new a((function(e) {
                    e(t)
                }
                ))).then(r, p)
            }
            o((n = n.apply(e, t || [])).next())
        }
        ))
    };
    var ta;
    !function(e) {
        e[e.fa = 32] = "fa",
        e[e.ar = 64] = "ar",
        e[e.en = 128] = "en"
    }(ta || (ta = {}));
    class aa {
        constructor(e, t, a, n, s, i={}, r="", o="", m="", d="", l="") {
            this.dcId = e,
            this.authKey = t,
            this.authKeyId = a,
            this.transport = s,
            this.lastServerMessages = [],
            this.sentMessages = {},
            this.pendingMessages = {},
            this.pendingAcks = [],
            this.pendingResends = [],
            this.connectionInited = !1,
            this.nextReq = 0,
            this.longPollPending = 0,
            this.checkConnectionPeriod = 0,
            this.sleepAfter = 0,
            this.offline = !1,
            this.seqNo = 0,
            this.lastResendReq = null,
            this.isOnline = !1,
            this.status = Bt.Closed,
            this.lastResponseTime = 0,
            this.debug = g || y.debug,
            this.activeRequests = 0,
            this.failToFetchCount = 0,
            this.checkLongPoll = () => {
                const e = this.cleanupSent();
                if (this.longPollPending && Date.now() < this.longPollPending || this.offline || this.isStopped())
                    return !1;
                A.get("dc").then(t => {
                    !e || t !== this.dcId || this.isFileNetworker || this.sleepAfter && (Date.now(),
                    this.sleepAfter)
                }
                )
            }
            ,
            this.checkConnection = e => {
                this.log("Check connection", e),
                clearTimeout(this.checkConnectionTimeout),
                this.checkConnectionTimeout = 0;
                const t = new bt({
                    mtproto: !0
                })
                  , a = st();
                t.storeMethod("ping", {
                    ping_id: a
                });
                const n = {
                    msg_id: Tt.generateId(),
                    seq_no: this.generateSeqNo(!0),
                    body: t.getBytes(!0)
                };
                this.sendEncryptedRequest(n).then(e => {
                    this.toggleOffline(!1)
                }
                , () => {
                    this.log("Delay ", 1e3 * this.checkConnectionPeriod),
                    this.checkConnectionTimeout = setTimeout(this.checkConnection, 1e3 * this.checkConnectionPeriod | 0),
                    this.checkConnectionPeriod = Math.min(60, 1.5 * this.checkConnectionPeriod)
                }
                )
            }
            ,
            this.updateLangCode = () => {
                Xt.get("langPack").then(e => {
                    sa.setLanguage(e.lang_code)
                }
                )
            }
            ,
            aa.imei = r,
            aa.token = o,
            aa.platform = m,
            aa.version = d,
            aa.userAgent = l,
            this.authKeyUint8 = p(this.authKey),
            this.serverSalt = p(n),
            this.isFileUpload = !!i.fileUpload,
            this.isFileDownload = !!i.fileDownload,
            this.isFileNetworker = this.isFileUpload || this.isFileDownload;
            const c = this.isFileUpload ? "-U" : this.isFileDownload ? "-D" : "";
            this.name = "NET-" + e + c,
            this.log = Ct(this.name, wt.Log | wt.Error | wt.Warn),
            this.log("constructor"),
            this.updateSession(),
            this.transport instanceof xt ? (setInterval(this.checkLongPoll, 1e4),
            this.checkLongPoll()) : this.transport.networker = this,
            this.transport.connected && this.setConnectionStatus(Bt.Connected),
            this.updateLangCode(),
            Nt.addEventListener("language_change", () => {
                this.updateLangCode()
            }
            )
        }
        updateExpireToken() {
            if (!aa.getRequestExpireToken)
                return;
            aa.getRequestExpireToken = !1;
            const e = new bt;
            let t, a, n = 0, s = "1.0.0";
            if ("ios" === aa.platform) {
                t = aa.userAgent || "Unknown UserAgent",
                a = aa.platform;
                let e = aa.version;
                "" !== e && (n = parseInt(e.substring(e.indexOf("(") + 1, e.lastIndexOf(")"))),
                s = e.substring(0, e.lastIndexOf("(")))
            } else
                n = Ut.id,
                a = navigator.platform || "Unknown Platform",
                t = sa.userAgent || "Unknown UserAgent",
                s = Ut.version + (Ut.isMainDomain ? " " + Ut.suffix : "");
            const i = {
                _: "eitaaAppInfo",
                build_version: n,
                device_model: t,
                system_version: a,
                app_version: s,
                lang_code: sa.language,
                sign: ""
            };
            e.storeMethod("eitaaRefreshToken", {
                app_info: i
            });
            const r = new Uint8Array(e.getBuffer())
              , p = {
                msg_id: Tt.generateId(),
                seq_no: 1111111111,
                body: r
            };
            this.sendEncryptedRequest(p).then(e => {
                this.parseResponse(e).then(e => {
                    var t;
                    if ("eitaa_updates_token" === (null === (t = null == e ? void 0 : e.response) || void 0 === t ? void 0 : t._)) {
                        const t = e.response.token;
                        ya.setToken(t).then( () => {
                            aa.token = t,
                            aa.getRequestExpireToken = !0,
                            aa.invalidLoginCount = 0,
                            sa.startAll()
                        }
                        ).catch( () => {
                            sa.stopAll(),
                            ya.logOut()
                        }
                        )
                    } else
                        this.tryRefreshToken(),
                        console.error("Try Refresh Token:3")
                }
                ).catch(e => {
                    this.tryRefreshToken(),
                    console.error("Try Refresh Token:2")
                }
                )
            }
            ).catch(e => {
                this.tryRefreshToken(),
                console.error("Try Refresh Token:1")
            }
            )
        }
        tryRefreshToken(e=1e3) {
            aa.trySendRequestExpireToken ? clearTimeout(aa.trySendRequestExpireToken) : aa.trySendRequestExpireToken = setTimeout( () => {
                aa.getRequestExpireToken = !0,
                this.updateExpireToken()
            }
            , e)
        }
        updateSession() {
            this.seqNo = 0,
            this.prevSessionId = this.sessionId,
            this.sessionId = new Uint8Array(8).randomize()
        }
        updateSentMessage(e) {
            const t = this.sentMessages[e];
            return !!t && (t.container && function(e, t) {
                for (let a = e.length - 1; a >= 0; --a)
                    t(e[a], a, e)
            }(t.inner, (e, a) => {
                const n = this.updateSentMessage(e);
                n ? t.inner[a] = n.msg_id : t.inner.splice(a, 1)
            }
            ),
            t.msg_id = Tt.generateId(),
            t.seq_no = this.generateSeqNo(t.notContentRelated || t.container),
            this.sentMessages[t.msg_id] = t,
            delete this.sentMessages[e],
            t)
        }
        generateSeqNo(e) {
            let t = 2 * this.seqNo;
            return e || (t++,
            this.seqNo++),
            t
        }
        wrapMtpCall(e, t, a) {
            const n = new bt({
                mtproto: !0
            });
            n.storeMethod(e, t);
            const s = Tt.generateId()
              , i = this.generateSeqNo()
              , r = {
                msg_id: s,
                seq_no: i,
                body: n.getBytes(!0),
                methodName: e
            };
            return y.debug && this.log("MT call", e, t, s, i),
            this.pushMessage(r, a)
        }
        wrapMtpMessage(e, t) {
            const a = new bt({
                mtproto: !0
            });
            a.storeObject(e, "Object");
            const n = Tt.generateId()
              , s = this.generateSeqNo(t.notContentRelated)
              , i = {
                msg_id: n,
                seq_no: s,
                body: a.getBytes(!0)
            };
            return y.debug && this.log("MT message", e, n, s),
            this.pushMessage(i, t)
        }
        wrapApiCall(e, t={}, a={}) {
            const n = new bt(a);
            a.resultType = n.storeMethod(e, t);
            const s = {
                msg_id: Tt.generateId(),
                seq_no: this.generateSeqNo(),
                body: n.getBytes(!0),
                isAPI: !0,
                methodName: e
            };
            return y.debug ? this.log("Api call", e, s, t, a) : this.debug && this.log("Api call", e, t, a),
            this.pushMessage(s, a)
        }
        destroy() {
            this.log("destroy")
        }
        forceReconnectTimeout() {
            this.transport.reconnect ? this.transport.reconnect() : this.resend()
        }
        forceReconnect() {
            this.transport.forceReconnect ? this.transport.forceReconnect() : this.checkConnection("force reconnect")
        }
        sendLongPoll() {
            this.longPollPending = Date.now() + 25e3,
            this.wrapMtpCall("http_wait", {
                max_delay: 500,
                wait_after: 150,
                max_wait: 25e3
            }, {
                noResponse: !0,
                longPoll: !0
            }).then( () => {
                this.longPollPending = 0,
                setTimeout(this.checkLongPoll, 0)
            }
            , e => {
                this.log("Long-poll failed", e)
            }
            )
        }
        toggleOffline(e) {
            if (void 0 !== this.offline && this.offline === e)
                return !1;
            this.offline = e,
            this.offline ? (clearTimeout(this.nextReqTimeout),
            this.nextReqTimeout = 0,
            this.nextReq = 0,
            this.checkConnectionPeriod < 1.5 && (this.checkConnectionPeriod = 0),
            this.checkConnectionTimeout = setTimeout(this.checkConnection, 1e3 * this.checkConnectionPeriod | 0),
            this.checkConnectionPeriod = Math.min(30, 1.5 * (1 + this.checkConnectionPeriod))) : (this.checkLongPoll(),
            this.scheduleRequest(),
            clearTimeout(this.checkConnectionTimeout),
            this.checkConnectionTimeout = 0)
        }
        handleSentEncryptedRequestHTTP(e, t, a) {
            e.then(e => {
                this.toggleOffline(!1),
                this.parseResponse(e, t.msg_id).then(e => {
                    y.debug && this.log.debug("Server response", e),
                    this.processMessage(e.response, e.messageId, e.sessionId),
                    a.forEach(e => {
                        if (this.sentMessages[e]) {
                            const t = this.sentMessages[e].deferred;
                            delete this.sentMessages[e],
                            t.resolve()
                        }
                    }
                    ),
                    this.checkLongPoll(),
                    this.checkConnectionPeriod = Math.max(1.1, Math.sqrt(this.checkConnectionPeriod))
                }
                )
            }
            , e => {
                if (this.log.error("Encrypted request failed", e, t),
                this.failToFetchCount++,
                this.failToFetchCount >= aa.maxFailCountOnFetch) {
                    this.failToFetchCount = 0;
                    const e = this.transport.getConfig();
                    $t.failedServers[e.type].push(e.url),
                    this.transport = $t.chooseServer(this.dcId, e.type, "https", !1)
                }
                t.container ? t.inner.forEach(e => {
                    this.pushResend(e)
                }
                ) : this.pushResend(t.msg_id),
                a.forEach(e => {
                    if (this.sentMessages[e]) {
                        const t = this.sentMessages[e].deferred;
                        delete this.sentMessages[e],
                        delete this.pendingMessages[e],
                        t.reject()
                    }
                }
                ),
                $t.resetFilteredServersCount >= $t.maxResetFilteredServersCount && (this.toggleOffline(!0),
                $t.resetFilteredServersCount = 0)
            }
            )
        }
        pushMessage(e, t) {
            const a = new Promise( (a, n) => {
                this.sentMessages[e.msg_id] = Object.assign(e, t, t.notContentRelated ? void 0 : {
                    deferred: {
                        resolve: a,
                        reject: n
                    }
                }),
                this.pendingMessages[e.msg_id] = 0,
                t.noSchedule || this.scheduleRequest(),
                xe(t) && (t.messageId = e.msg_id)
            }
            );
            if (!t.notContentRelated && !t.noResponse) {
                const t = setTimeout( () => {
                    this.lastResponseTime && Date.now() - this.lastResponseTime < 5e3 || (this.log.error("timeout", e),
                    this.isOnline && this.setConnectionStatus(Bt.TimedOut))
                }
                , 5e3);
                a.catch(Dt).finally( () => {
                    clearTimeout(t),
                    this.setConnectionStatus(Bt.Connected),
                    --this.activeRequests,
                    this.setDrainTimeout()
                }
                ),
                ++this.activeRequests,
                void 0 !== this.onDrainTimeout && (clearTimeout(this.onDrainTimeout),
                this.onDrainTimeout = void 0)
            }
            return a
        }
        setDrainTimeout() {
            !this.activeRequests && this.onDrain && void 0 === this.onDrainTimeout && (this.onDrainTimeout = self.setTimeout( () => {
                this.onDrainTimeout = void 0,
                this.log("drain"),
                this.onDrain()
            }
            , 1e4))
        }
        setConnectionStatus(e, t) {
            const a = e === Bt.Connected
              , n = this.status !== e;
            this.isOnline = a,
            this.status = e,
            n && (sa.onConnectionStatusChange && sa.onConnectionStatusChange({
                _: "networkerStatus",
                status: e,
                dcId: this.dcId,
                name: this.name,
                isFileNetworker: this.isFileNetworker,
                isFileDownload: this.isFileDownload,
                isFileUpload: this.isFileUpload,
                retryAt: t
            }),
            this.isOnline && this.scheduleRequest())
        }
        pushResend(e, t=100) {
            const a = t ? Date.now() + t : 0
              , n = this.sentMessages[e];
            if (n.container)
                for (const e of n.inner)
                    this.pendingMessages[e] = a;
            else
                this.pendingMessages[e] = a;
            n.acked && this.log.error("pushResend: acked message?", n),
            this.debug && this.log.debug("pushResend:", e, n, this.pendingMessages, t),
            this.scheduleRequest(t)
        }
        getMsgKey(e, t) {
            return ea(this, void 0, void 0, (function*() {
                return e
            }
            ))
        }
        getAesKeyIv(e, t) {
            const a = t ? 0 : 8
              , n = new Uint8Array(52)
              , s = new Uint8Array(52)
              , i = [];
            return n.set(e, 0),
            n.set(this.authKeyUint8.subarray(a, a + 36), 16),
            i.push(Rt.invokeCrypto("sha256-hash", n)),
            s.set(this.authKeyUint8.subarray(40 + a, 40 + a + 36), 0),
            s.set(e, 36),
            i.push(Rt.invokeCrypto("sha256-hash", s)),
            Promise.all(i).then(e => {
                const t = new Uint8Array(32)
                  , a = new Uint8Array(32)
                  , n = new Uint8Array(e[0])
                  , s = new Uint8Array(e[1]);
                return t.set(n.subarray(0, 8)),
                t.set(s.subarray(8, 24), 8),
                t.set(n.subarray(24, 32), 24),
                a.set(s.subarray(0, 8)),
                a.set(n.subarray(8, 24), 8),
                a.set(s.subarray(24, 32), 24),
                [t, a]
            }
            )
        }
        isStopped() {
            return sa.akStopped && !this.isFileNetworker
        }
        performScheduledRequest() {
            if (this.isStopped())
                return !1;
            if (this.pendingResends.length) {
                const e = this.pendingResends.slice()
                  , t = {
                    noSchedule: !0,
                    notContentRelated: !0,
                    messageId: ""
                };
                this.wrapMtpMessage({
                    _: "msg_resend_req",
                    msg_ids: e
                }, t),
                this.lastResendReq = {
                    req_msg_id: t.messageId,
                    resend_msg_ids: e
                }
            }
            let e;
            const t = [];
            let a = !1
              , n = !1
              , s = !1;
            const i = Object.keys(this.pendingMessages).map(e => oe(e, 10)).sort( (e, t) => ge(e, t)).map(e => le(e, 10));
            for (const r of i) {
                const i = this.sentMessages[r];
                if (i && i.body) {
                    if (0 + (i.body.length + 32) > 655360 && (this.log.warn("lengthOverflow", i, t),
                    s = !0,
                    e))
                        break;
                    t.push(i),
                    i.isAPI ? a = !0 : i.longPoll && (n = !0),
                    e = i
                }
                delete this.pendingMessages[r]
            }
            if (this.transport,
            !t.length)
                return;
            const r = t.filter(e => e.noResponse).map(e => e.msg_id);
            this.pendingAcks = [],
            t.forEach(e => {
                if (void 0 === e.methodName || e.methodName && -1 === Ut.eitaaNoSend.indexOf(e.methodName)) {
                    const t = this.sendEncryptedRequest(e);
                    this.transport instanceof xt ? this.handleSentEncryptedRequestHTTP(t, e, r) : this.cleanupSent(),
                    s && this.scheduleRequest()
                } else
                    (this.sentMessages[e.msg_id] || this.pendingMessages[e.msg_id]) && (this.sentMessages[e.msg_id].deferred && this.sentMessages[e.msg_id].deferred.reject({
                        _: "error",
                        code: 404,
                        message: "NOT_AVAILABLE_CONSTRUCTOR",
                        handled: !0,
                        type: e.methodName,
                        pFlags: {},
                        notAvailable: !0
                    }),
                    delete this.sentMessages[e.msg_id],
                    delete this.pendingMessages[e.msg_id])
            }
            )
        }
        generateContainerMessage(e, t) {
            const a = new bt({
                mtproto: !0,
                startMaxLength: e + 64
            });
            a.storeInt(1945237724, "CONTAINER[id]"),
            a.storeInt(t.length, "CONTAINER[count]");
            const n = [];
            t.forEach( (e, t) => {
                n.push(e.msg_id),
                a.storeLong(e.msg_id, "CONTAINER[" + t + "][msg_id]"),
                a.storeInt(e.seq_no, "CONTAINER[" + t + "][seq_no]"),
                a.storeInt(e.body.length, "CONTAINER[" + t + "][bytes]"),
                a.storeRawBytes(e.body, "CONTAINER[" + t + "][body]")
            }
            );
            const s = {
                msg_id: Tt.generateId(),
                seq_no: this.generateSeqNo(!0),
                container: !0,
                inner: n
            };
            return y.debug && this.log.warn("Container", n, s.msg_id, s.seq_no),
            {
                message: s,
                messageWithBody: Object.assign({
                    body: a.getBytes(!0)
                }, s)
            }
        }
        getEncryptedMessage(e) {
            return ea(this, void 0, void 0, (function*() {
                const t = yield this.getMsgKey(e, !0);
                return {
                    bytes: e,
                    msgKey: t
                }
            }
            ))
        }
        getDecryptedMessage(e, t) {
            return this.getAesKeyIv(e, !1).then(e => t)
        }
        getEncryptedOutput(e) {
            const t = new bt;
            t.storeBytes(e.body);
            const a = t.getBuffer()
              , n = new Uint8Array(a)
              , s = 16 - t.getOffset() % 16 + 16 * (1 + nt(8) % 5);
            o(a, new Uint8Array(s).randomize());
            return this.getEncryptedMessage(n).then(e => {
                const t = new bt;
                t.storeRawBytes(e.bytes);
                return t.getBytes(!0)
            }
            )
        }
        sendEncryptedRequest(e) {
            return this.getEncryptedOutput(e).then(t => {
                const a = new bt
                  , n = ta[sa.language];
                if ("ios" === aa.platform) {
                    let t = "";
                    "" !== aa.version && (t = aa.version.substring(aa.version.indexOf("(") + 1, aa.version.lastIndexOf(")"))),
                    a.storeMethod("eitaaIosObject", {
                        token: aa.token,
                        imei: aa.imei,
                        flags: n,
                        packed_data: e.body,
                        layer: 135,
                        build_version: t
                    })
                } else
                    a.storeMethod("eitaaObject", {
                        token: aa.token,
                        imei: aa.imei,
                        packed_data: e.body,
                        layer: 135,
                        flags: n
                    });
                t = a.getBytes(!0),
                this.debug && this.log.debug("sendEncryptedRequest: launching message into space:", e, [e.msg_id].concat(e.inner || []));
                const s = this.transport.send(t);
                if (!(this.transport instanceof xt))
                    return s;
                const i = {
                    code: 406,
                    type: "NETWORK_BAD_RESPONSE",
                    transport: this.transport
                };
                return s.then(e => e && e.byteLength ? e : Promise.reject(i), e => (e.message || e.type || (e = Object.assign(i, {
                    type: "NETWORK_BAD_REQUEST",
                    originalError: e
                })),
                Promise.reject(e)))
            }
            )
        }
        parseResponse(e, t="123456789") {
            this.lastResponseTime = Date.now();
            const a = new Uint8Array;
            return this.getDecryptedMessage(a, e).then(e => {
                var a;
                let n, s = new Pt(e,{
                    mtproto: !0
                });
                try {
                    n = "photos.deletePhotos" === (null === (a = this.sentMessages[t]) || void 0 === a ? void 0 : a.methodName) ? s.fetchObject("long", "vector") : s.fetchObject("", "INPUT")
                } catch (e) {
                    g && console.error({
                        e: e,
                        response: n,
                        messageId: t,
                        karevan: "networker.ts getDecryptedMessage():1548"
                    })
                }
                return {
                    response: n,
                    messageId: t,
                    sessionId: new Uint8Array,
                    seqNo: 112233
                }
            }
            )
        }
        applyServerSalt(e) {
            const t = Le(new Uint8Array(ce(oe(e, 10), !1)), 8, !0, !1, !1);
            A.set({
                ["dc" + this.dcId + "_server_salt"]: n(t)
            }),
            this.serverSalt = new Uint8Array(t)
        }
        scheduleRequest(e) {
            this.transport instanceof xt && this.offline && this.checkConnection("forced schedule");
            const t = Date.now() + (e || 0);
            if (this.nextReq && (void 0 === e || this.nextReq <= t))
                return;
            this.nextReqTimeout && clearTimeout(this.nextReqTimeout);
            const a = () => {
                this.nextReqTimeout = 0,
                this.nextReq = 0,
                this.transport instanceof xt && this.offline || this.performScheduledRequest()
            }
            ;
            this.nextReq = t,
            void 0 !== e ? this.nextReqTimeout = Ft.setTimeout(a, e) : a()
        }
        ackMessage(e) {
            this.pendingAcks.push(e),
            this.scheduleRequest(3e4)
        }
        reqResendMessage(e) {
            this.debug && this.log.debug("Req resend", e),
            this.pendingResends.push(e),
            this.scheduleRequest(100)
        }
        cleanupSent() {
            let e = !1;
            return Object.keys(this.sentMessages).forEach(t => {
                const a = this.sentMessages[t];
                if (a.notContentRelated && void 0 === this.pendingMessages[t])
                    delete this.sentMessages[t];
                else if (a.container) {
                    for (const t of a.inner)
                        if (void 0 !== this.sentMessages[t])
                            return void (e = !0);
                    delete this.sentMessages[t]
                } else
                    e = !0
            }
            ),
            !e
        }
        processMessageAck(e) {
            const t = this.sentMessages[e];
            t && !t.acked && (t.acked = !0)
        }
        processError(e) {
            const t = (e.error_message || "").match(/^([A-Z_0-9]+\b)(: (.+))?/) || [];
            return e.error_code = e.error_code,
            {
                code: !e.error_code || e.error_code <= 0 ? 500 : e.error_code,
                type: t[1] || "UNKNOWN",
                description: t[3] || "CODE#" + e.error_code + " " + e.error_message,
                originalError: e
            }
        }
        resend() {
            for (const e in this.sentMessages) {
                const t = this.sentMessages[e];
                (t.body || t.container) && this.pushResend(e)
            }
        }
        processMessage(e, t, a) {
            var n, s;
            if ("messageEmpty" === e._)
                return void this.log.warn("processMessage: messageEmpty", e, t);
            if (parseInt(t.substr(0, -10), 10) % 2)
                this.log.warn("Server even message id: ", t, e);
            else
                switch (e._) {
                case "msg_container":
                    for (const t of e.messages)
                        this.processMessage(t, t.msg_id, a);
                    break;
                case "bad_server_salt":
                    this.log("Bad server salt", e),
                    this.applyServerSalt(e.new_server_salt),
                    this.sentMessages[e.bad_msg_id] && this.pushResend(e.bad_msg_id),
                    this.ackMessage(t);
                    break;
                case "bad_msg_notification":
                    switch (this.log.error("Bad msg notification", e),
                    e.error_code) {
                    case 16:
                    case 17:
                    case 32:
                    case 33:
                    case 64:
                        {
                            const a = oe(t, 10);
                            ve(a, 32);
                            const n = Tt.applyServerTime(+le(a, 10));
                            (17 === e.error_code || n) && (this.log("Update session"),
                            this.updateSession());
                            const s = this.updateSentMessage(e.bad_msg_id);
                            s && this.pushResend(s.msg_id)
                        }
                    }
                    break;
                case "message":
                    if (-1 !== this.lastServerMessages.indexOf(t))
                        return void this.ackMessage(t);
                    this.lastServerMessages.push(t),
                    this.lastServerMessages.length > 100 && this.lastServerMessages.shift(),
                    this.processMessage(e.body, e.msg_id, a);
                    break;
                case "new_session_created":
                    this.ackMessage(t),
                    this.debug && this.log.debug("new_session_created", e),
                    this.processMessageAck(e.first_msg_id),
                    this.applyServerSalt(e.server_salt),
                    A.get("dc").then(t => {
                        t === this.dcId && !this.isFileNetworker && sa.updatesProcessor && sa.updatesProcessor(e)
                    }
                    );
                    break;
                case "msgs_ack":
                    for (const t of e.msg_ids)
                        this.processMessageAck(t);
                    break;
                case "msg_detailed_info":
                    if (!this.sentMessages[e.msg_id]) {
                        this.ackMessage(e.answer_msg_id);
                        break
                    }
                case "msg_new_detailed_info":
                    if (this.pendingAcks.indexOf(e.answer_msg_id))
                        break;
                    this.reqResendMessage(e.answer_msg_id);
                    break;
                case "msgs_state_info":
                    if (this.ackMessage(e.answer_msg_id),
                    this.lastResendReq && this.lastResendReq.req_msg_id === e.req_msg_id && this.pendingResends.length)
                        for (const e of this.lastResendReq.resend_msg_ids) {
                            const t = this.pendingResends.indexOf(e);
                            -1 !== t && this.pendingResends.splice(t, 1)
                        }
                    break;
                case "rpc_result":
                    {
                        this.ackMessage(t);
                        const a = e.req_msg_id
                          , n = this.sentMessages[a];
                        if (this.processMessageAck(a),
                        n) {
                            const t = n.deferred;
                            if ("rpc_error" === e.result._) {
                                const a = this.processError(e.result);
                                this.log("Rpc error", a),
                                t && t.reject(a)
                            } else
                                t && t.resolve(e.result),
                                n.isAPI && !this.connectionInited && (this.connectionInited = !0);
                            delete this.sentMessages[a]
                        } else
                            this.debug && this.log("Rpc result for unknown message:", a, e);
                        break
                    }
                case "pong":
                    if (this.transport.networker) {
                        const t = e.msg_id
                          , a = this.sentMessages[t];
                        a && (a.deferred.resolve(e),
                        delete this.sentMessages[t])
                    }
                    break;
                case "error":
                    {
                        const a = e;
                        a.type = e.text,
                        this.log("error", a),
                        404 === (null == e ? void 0 : e.code) && "INVALID_CONSTRUCTOR" === (null == e ? void 0 : e.text.toUpperCase()) && (null === (n = this.sentMessages[t]) || void 0 === n ? void 0 : n.methodName) && -1 === Ut.eitaaNoSend.indexOf(this.sentMessages[t].methodName) && Ut.eitaaNoSend.push(this.sentMessages[t].methodName),
                        aa.getRequestExpireToken && 401 === (null == e ? void 0 : e.code) && "INVALID_LOGIN" === (null == e ? void 0 : e.text.toUpperCase()) && (aa.invalidLoginCount > Ut.eitaaMaxInvalidLoginCount ? (sa.stopAll(),
                        ya.logOut()) : (aa.invalidLoginCount++,
                        g && console.error("invalid login count:" + aa.invalidLoginCount))),
                        "object" == typeof (null === (s = this.sentMessages[t]) || void 0 === s ? void 0 : s.deferred) && this.sentMessages[t].deferred.reject(a),
                        delete this.sentMessages[t];
                        break
                    }
                default:
                    const i = this.sentMessages[t];
                    if (i) {
                        const a = i.deferred;
                        if ("auth.authorization" === e._ && (sa.stopAll(),
                        this.pushResend(t),
                        ya.setToken(e.token).then( () => {
                            aa.token = e.token,
                            aa.getRequestExpireToken = !0,
                            aa.invalidLoginCount = 0,
                            sa.startAll()
                        }
                        )),
                        "eitaa_updates_expire_token" === e._ || "eitaa_token_updating" === e._) {
                            sa.stopAll(),
                            this.pushResend(t),
                            this.updateExpireToken();
                            break
                        }
                        a && a.resolve(e),
                        i.isAPI && !this.connectionInited && (this.connectionInited = !0),
                        delete this.sentMessages[t]
                    }
                    null !== sa.updatesProcessor && sa.updatesProcessor(e)
                }
        }
    }
    aa.maxFailCountOnFetch = 4,
    aa.getRequestExpireToken = !0,
    aa.invalidLoginCount = 0,
    aa.allowApplyServerTime = !1,
    aa.trySendRequestExpireToken = null;
    const na = new class {
        constructor() {
            this.networkers = [],
            this.language = navigator.language || Ut.langPackCode,
            this.updatesProcessor = null,
            this.onConnectionStatusChange = null,
            this.akStopped = !1,
            this.userAgent = navigator.userAgent
        }
        removeNetworker(e) {
            const t = this.networkers.indexOf(e);
            -1 !== t && this.networkers.splice(t, 1)
        }
        setUpdatesProcessor(e) {
            this.updatesProcessor = e
        }
        getNetworker(e, t, a, n, s, i, r="", p="", o="", m="", d="") {
            const y = new aa(e,t,a,n,s,i,r,p,o,m,d);
            return this.networkers.push(y),
            y
        }
        startAll() {
            if (this.akStopped) {
                const e = this.networkers.filter(e => e.isStopped());
                this.akStopped = !1,
                this.updatesProcessor && this.updatesProcessor({
                    _: "new_session_created"
                });
                for (const t of e)
                    t.scheduleRequest()
            }
        }
        stopAll() {
            this.akStopped = !0
        }
        setLanguage(e) {
            this.language = e;
            for (const e of this.networkers)
                e.isFileNetworker || (e.connectionInited = !1)
        }
        forceReconnectTimeout() {
            for (const e of this.networkers)
                e.forceReconnectTimeout()
        }
        forceReconnect() {
            for (const e of this.networkers)
                if (!e.isFileNetworker) {
                    e.forceReconnect();
                    break
                }
        }
    }
    ;
    c && (c.networkerFactory = na);
    var sa = na
      , ia = function(e, t, a, n) {
        return new (a || (a = Promise))((function(s, i) {
            function r(e) {
                try {
                    o(n.next(e))
                } catch (e) {
                    i(e)
                }
            }
            function p(e) {
                try {
                    o(n.throw(e))
                } catch (e) {
                    i(e)
                }
            }
            function o(e) {
                var t;
                e.done ? s(e.value) : (t = e.value,
                t instanceof a ? t : new a((function(e) {
                    e(t)
                }
                ))).then(r, p)
            }
            o((n = n.apply(e, t || [])).next())
        }
        ))
    };
    new class {
        constructor() {
            this.testPublicKeysHex = [{
                modulus: "c8c11d635691fac091dd9489aedced2932aa8a0bcefef05fa800892d9b52ed03200865c9e97211cb2ee6c7ae96d3fb0e15aeffd66019b44a08a240cfdd2868a85e1f54d6fa5deaa041f6941ddf302690d61dc476385c2fa655142353cb4e4b59f6e5b6584db76fe8b1370263246c010c93d011014113ebdf987d093f9d37c2be48352d69a1683f8f6e6c2167983c761e3ab169fde5daaa12123fa1beab621e4da5935e9c198f82f35eae583a99386d8110ea6bd1abb0f568759f62694419ea5f69847c43462abef858b4cb5edc84e7b9226cd7bd7e183aa974a712c079dde85b9dc063b8a5c08e8f859c0ee5dcd824c7807f20153361a7f63cfd2a433a1be7f5",
                exponent: "010001"
            }],
            this.publisKeysHex = [{
                modulus: "e8bb3305c0b52c6cf2afdf7637313489e63e05268e5badb601af417786472e5f93b85438968e20e6729a301c0afc121bf7151f834436f7fda680847a66bf64accec78ee21c0b316f0edafe2f41908da7bd1f4a5107638eeb67040ace472a14f90d9f7c2b7def99688ba3073adb5750bb02964902a359fe745d8170e36876d4fd8a5d41b2a76cbff9a13267eb9580b2d06d10357448d20d9da2191cb5d8c93982961cdfdeda629e37f1fb09a0722027696032fe61ed663db7a37f6f263d370f69db53a0dc0a1748bdaaff6209d5645485e6e001d1953255757e4b8e42813347b11da6ab500fd0ace7e6dfa3736199ccaf9397ed0745a427dcfa6cd67bcb1acff3",
                exponent: "010001"
            }],
            this.publicKeysParsed = {},
            this.prepared = !1,
            this.preparePromise = null,
            y.test && (this.publisKeysHex = this.testPublicKeysHex)
        }
        prepare() {
            return this.preparePromise ? this.preparePromise : this.prepared ? Promise.resolve() : this.preparePromise = Promise.all(this.publisKeysHex.map(e => {
                const t = new bt;
                t.storeBytes(s(e.modulus), "n"),
                t.storeBytes(s(e.exponent), "e");
                const a = t.getBuffer();
                return Rt.invokeCrypto("sha1-hash", a).then(t => {
                    const a = t.slice(-8);
                    a.reverse(),
                    this.publicKeysParsed[n(a).toLowerCase()] = {
                        modulus: e.modulus,
                        exponent: e.exponent
                    }
                }
                )
            }
            )).then( () => {
                this.prepared = !0,
                this.preparePromise = null
            }
            )
        }
        select(e) {
            return ia(this, void 0, void 0, (function*() {
                yield this.prepare();
                for (let t = 0; t < e.length; ++t) {
                    let a = le(oe(e[t], 10), 16).toLowerCase();
                    a.length < 16 && (a = new Array(16 - a.length).fill("0").join("") + a);
                    const n = this.publicKeysParsed[a];
                    if (n)
                        return Object.assign({
                            fingerprint: e[t]
                        }, n)
                }
            }
            ))
        }
    }
    ;
    var ra = function(e, t, a, n) {
        return new (a || (a = Promise))((function(s, i) {
            function r(e) {
                try {
                    o(n.next(e))
                } catch (e) {
                    i(e)
                }
            }
            function p(e) {
                try {
                    o(n.throw(e))
                } catch (e) {
                    i(e)
                }
            }
            function o(e) {
                var t;
                e.done ? s(e.value) : (t = e.value,
                t instanceof a ? t : new a((function(e) {
                    e(t)
                }
                ))).then(r, p)
            }
            o((n = n.apply(e, t || [])).next())
        }
        ))
    };
    var pa = new class {
        constructor() {
            this.cached = {},
            this.log = Ct("AUTHORIZER", wt.Error | wt.Log)
        }
        sendPlainRequest(e, t) {
            const a = t.byteLength
              , n = new bt;
            n.storeLongP(0, 0, "auth_key_id"),
            n.storeLong(Tt.generateId(), "msg_id"),
            n.storeInt(a, "request_length");
            const s = n.getBytes(!0)
              , i = new Uint8Array(s.byteLength + a);
            i.set(s),
            i.set(t, s.length);
            const r = $t.chooseServer(e)
              , p = {
                code: 406,
                type: "NETWORK_BAD_RESPONSE"
            };
            g && this.log("mtpSendPlainRequest: creating requestPromise");
            return r.send(i).then(e => {
                if (g && this.log("mtpSendPlainRequest: in good sector", e),
                !e || !e.byteLength)
                    throw p;
                try {
                    const t = new Pt(e,{
                        mtproto: !0
                    });
                    if (4 === e.length) {
                        const e = t.fetchInt();
                        throw this.log.error("mtpSendPlainRequest: wrong response, error code:", e),
                        e
                    }
                    const a = t.fetchLong("auth_key_id");
                    "0" !== a && this.log.error("auth_key_id !== 0", a);
                    const n = t.fetchLong("msg_id");
                    "0" === n && this.log.error("msg_id === 0", n);
                    const s = t.fetchInt("msg_len");
                    return s || this.log.error("no msg_len", s),
                    t
                } catch (e) {
                    this.log.error("mtpSendPlainRequest: deserialization went bad", e);
                    throw Object.assign(p, {
                        originalError: e
                    })
                }
            }
            , e => {
                throw e.message || e.type || (e = Object.assign(p, {
                    originalError: e
                })),
                e
            }
            )
        }
        sendReqPQ(e) {
            return ra(this, void 0, void 0, (function*() {
                return this.sendReqDhParams(e)
            }
            ))
        }
        sendReqDhParams(e) {
            return ra(this, void 0, void 0, (function*() {
                return this.sendSetClientDhParams(e)
            }
            ))
        }
        decryptServerDhDataAnswer(e, t) {
            return ra(this, void 0, void 0, (function*() {
                e.localTime = Date.now(),
                e.tmpAesKey = (yield Rt.invokeCrypto("sha1-hash", e.newNonce.concat(e.serverNonce))).concat((yield Rt.invokeCrypto("sha1-hash", e.serverNonce.concat(e.newNonce))).slice(0, 12)),
                e.tmpAesIv = (yield Rt.invokeCrypto("sha1-hash", e.serverNonce.concat(e.newNonce))).slice(12).concat(yield Rt.invokeCrypto("sha1-hash", e.newNonce.concat(e.newNonce)), e.newNonce.slice(0, 4));
                const a = new Uint8Array(yield Rt.invokeCrypto("aes-decrypt", t, e.tmpAesKey, e.tmpAesIv))
                  , n = a.slice(0, 20)
                  , s = a.slice(20)
                  , r = new Pt(s,{
                    mtproto: !0
                })
                  , p = r.fetchObject("Server_DH_inner_data");
                if ("server_DH_inner_data" !== p._)
                    throw new Error("[MT] server_DH_inner_data response invalid: " + p);
                if (!i(e.nonce, p.nonce))
                    throw new Error("[MT] server_DH_inner_data nonce mismatch");
                if (!i(e.serverNonce, p.server_nonce))
                    throw new Error("[MT] server_DH_inner_data serverNonce mismatch");
                g && this.log("Done decrypting answer"),
                e.g = p.g,
                e.dhPrime = p.dh_prime,
                e.gA = p.g_a,
                e.serverTime = p.server_time,
                e.retry = 0,
                this.verifyDhParams(e.g, e.dhPrime, e.gA);
                const o = r.getOffset();
                if (!i(n, yield Rt.invokeCrypto("sha1-hash", s.slice(0, o))))
                    throw new Error("[MT] server_DH_inner_data SHA1-hash mismatch");
                Tt.applyServerTime(e.serverTime, e.localTime)
            }
            ))
        }
        verifyDhParams(e, t, a) {
            g && this.log("Verifying DH params", e, t, a);
            const s = n(t);
            if (3 !== e || "c71caeb9c6b1c9048e6c522f70f13f73980d40238e3e21c14934d037563d930f48198a0aa7c14058229493d22530f4dbfa336f6e0ac925139543aed44cce7c3720fd51f69458705ac68cd4fe6b6b13abdc9746512969328454f18faf8c595f642477fe96bb2a941d5bcd1d4ac8cc49880708fa9b378e3c4f3a9060bee67cf9a4a4a695811051907e162753b56b0f6b410dba74d8a84b2a14b3144e0ef1284754fd17ed950d5965b4b9dd46582db1178d169c6bc465b0d6ff9ca3928fef5b9ae4e418fc15e83ebea0f87fa9ff5eed70050ded2849f47bf959d956850ce929851f0d8115f635b105ee2e4e15d04b2454bf6f4fadf034b10403119cd8e3b92fcc5b" !== s)
                throw new Error("[MT] DH params are not verified: unknown dhPrime");
            g && this.log("dhPrime cmp OK");
            const i = oe(n(a), 16)
              , r = oe(s, 16);
            if (ge(i, U) <= 0)
                throw new Error("[MT] DH params are not verified: gA <= 1");
            if (ge(i, $(r, U)) >= 0)
                throw new Error("[MT] DH params are not verified: gA >= dhPrime - 1");
            g && this.log("1 < gA < dhPrime-1 OK");
            const p = function(e, t) {
                let a = he(e);
                t -= 1;
                for (let n = 0; n < t; ++n)
                    a = X(a, e);
                return Ve(a, 1)
            }(pe(2, 32, 0), 1984);
            if (ge(i, p) < 0)
                throw new Error("[MT] DH params are not verified: gA < 2^{2048-64}");
            if (ge(i, $(r, p)) >= 0)
                throw new Error("[MT] DH params are not verified: gA > dhPrime - 2^{2048-64}");
            return g && this.log("2^{2048-64} < gA < dhPrime-2^{2048-64} OK"),
            !0
        }
        sendSetClientDhParams(e) {
            return ra(this, void 0, void 0, (function*() {
                return e
            }
            ))
        }
        auth(e) {
            return ra(this, void 0, void 0, (function*() {
                if (e in this.cached)
                    return this.cached[e];
                const t = new Uint8Array(16).randomize();
                if (!$t.chooseServer(e))
                    throw new Error("[MT] No server found for dc " + e);
                const a = {
                    dcId: e,
                    nonce: t,
                    localTry: 1
                };
                try {
                    const t = this.sendReqPQ(a);
                    return this.cached[e] = t,
                    yield t
                } catch (t) {
                    if (a.localTry <= 3)
                        return this.sendReqPQ({
                            dcId: a.dcId,
                            nonce: new Uint8Array(16).randomize(),
                            localTry: a.localTry + 1
                        });
                    throw delete this.cached[e],
                    t
                }
            }
            ))
        }
    }
      , oa = function(e, t, a, n) {
        return new (a || (a = Promise))((function(s, i) {
            function r(e) {
                try {
                    o(n.next(e))
                } catch (e) {
                    i(e)
                }
            }
            function p(e) {
                try {
                    o(n.throw(e))
                } catch (e) {
                    i(e)
                }
            }
            function o(e) {
                var t;
                e.done ? s(e.value) : (t = e.value,
                t instanceof a ? t : new a((function(e) {
                    e(t)
                }
                ))).then(r, p)
            }
            o((n = n.apply(e, t || [])).next())
        }
        ))
    };
    class ma {
        constructor() {
            this.cachedNetworkers = {},
            this.cachedExportPromise = {},
            this.gettingNetworkers = {},
            this.baseDcId = 0,
            this.log = Ct("API"),
            this.afterMessageTempIds = {}
        }
        getImei() {
            return oa(this, void 0, void 0, (function*() {
                if (ma.imei)
                    return ma.imei;
                const e = yield A.get("imei");
                if (!ma.imei)
                    if (e)
                        ma.imei = e;
                    else {
                        const e = ((new Date).getTime() % 9e65).toString(36) + ((new Date).getTime() % 9e10).toString(36) + "__web";
                        yield this.setImei(e)
                    }
                return ma.imei
            }
            ))
        }
        setImei(e) {
            return ma.imei = e,
            A.set({
                imei: ma.imei
            })
        }
        getToken() {
            return oa(this, void 0, void 0, (function*() {
                if (ma.token)
                    return ma.token;
                const e = yield A.get("token");
                return ma.token || (e ? ma.token = e : yield this.setToken("")),
                ma.token
            }
            ))
        }
        setToken(e) {
            return ma.token = e,
            A.set({
                token: ma.token
            })
        }
        getPlatform() {
            return oa(this, void 0, void 0, (function*() {
                if (ma.platform)
                    return ma.platform;
                const e = yield A.get("eitaa_platform");
                return ma.platform = e || void 0,
                ma.platform
            }
            ))
        }
        getVersion() {
            return oa(this, void 0, void 0, (function*() {
                if (ma.version)
                    return ma.version;
                const e = yield A.get("eitaa_version");
                return ma.version = e || void 0,
                ma.version
            }
            ))
        }
        getUserAgent() {
            return oa(this, void 0, void 0, (function*() {
                if (ma.userAgent)
                    return ma.userAgent;
                const e = yield A.get("eitaa_user_agent");
                return ma.userAgent = e || "unknown",
                ma.userAgent
            }
            ))
        }
        getBaseDcId() {
            return oa(this, void 0, void 0, (function*() {
                if (this.baseDcId)
                    return this.baseDcId;
                const e = yield A.get("dc");
                return this.baseDcId || (e ? this.baseDcId = e : this.setBaseDcId(Ut.baseDcId)),
                this.baseDcId
            }
            ))
        }
        setUserAuth(e) {
            return oa(this, void 0, void 0, (function*() {
                if (!e.dcID) {
                    const t = yield this.getBaseDcId();
                    e.dcID = t
                }
                A.set({
                    user_auth: e
                })
            }
            ))
        }
        setBaseDcId(e) {
            const t = this.baseDcId;
            t && this.getNetworker(t).then(e => {
                this.setOnDrainIfNeeded(e)
            }
            ),
            this.baseDcId = e,
            A.set({
                dc: this.baseDcId
            })
        }
        logOut() {
            return oa(this, void 0, void 0, (function*() {
                const e = [];
                for (let t = 1; t <= 5; t++)
                    e.push("dc" + t + "_auth_key");
                const t = yield Promise.all(e.map(e => A.get(e)))
                  , a = [];
                for (let e = 0; e < t.length; e++)
                    t[e] && a.push(this.invokeApi("auth.logOut", {}, {
                        dcId: e + 1,
                        ignoreErrors: !0
                    }));
                const n = () => {
                    this.baseDcId = void 0,
                    Wt.closeDatabases(),
                    self.postMessage({
                        type: "clear"
                    })
                }
                ;
                return setTimeout(n, 1e3),
                Promise.all(a).catch(e => {
                    e.handled = !0
                }
                ).finally(n)
            }
            ))
        }
        getNetworker(e, t={}) {
            const a = t.fileDownload ? "download" : t.fileUpload ? "upload" : "client"
              , n = "https";
            this.cachedNetworkers.hasOwnProperty(n) || (this.cachedNetworkers[n] = {
                client: {},
                download: {},
                upload: {}
            });
            const i = this.cachedNetworkers[n][a];
            e in i || (i[e] = []);
            const r = i[e]
              , p = "client" === a || "https" === n ? 1 : 3;
            if (r.length >= p) {
                let e = r.length - 1
                  , t = !1;
                for (; e >= 0; --e)
                    if (r[e].isOnline) {
                        t = !0;
                        break
                    }
                const a = t ? r.splice(e, 1)[0] : r.pop();
                return r.unshift(a),
                Promise.resolve(a)
            }
            const o = [e, n, a].join("-");
            if (this.gettingNetworkers[o])
                return this.gettingNetworkers[o];
            const m = `dc${e}_auth_key`
              , d = `dc${e}_server_salt`;
            return this.gettingNetworkers[o] = Promise.all([m, d].map(e => A.get(e))).then( ([i,p]) => oa(this, void 0, void 0, (function*() {
                const y = $t.chooseServer(e, a, n, "client" === a);
                let l;
                if (i && 512 === i.length) {
                    p && 16 === p.length || (p = "AAAAAAAAAAAAAAAA");
                    const a = s(i)
                      , n = (yield Rt.invokeCrypto("sha1-hash", a)).slice(-8)
                      , r = s(p);
                    l = sa.getNetworker(e, a, n, r, y, t, yield this.getImei(), yield this.getToken(), yield this.getPlatform(), yield this.getVersion(), yield this.getUserAgent())
                } else
                    try {
                        const a = yield pa.auth(e)
                          , n = {
                            [m]: "0a1e0ef57335a388b213f2d0925dae7b3db25fb4ce9564ffffd9465cce11399c1668200d6b5c4260238453273e1484868f9d64557e4713f13bc78b8e1a03f8e88519ab1fd394148fbc665743b59923308557da0eca7c008451401aa43ddd41d13d0e707ac308659b76b04933086c4b0674c7ba2e4e987e78008ecbd25c5aeceaf95698cfa4157e7e0cdff2e118b0b22fcb6fb409e7fc0182c4dfa0982af43e6fe81cd0f5ff04049d8ac8a7b0d28856cf8b2c036009f27953b1dcfee0522c74e9e731182f539560c9bf3ff000c4da07e367c0a433e447b1720cc62d9c18bf2c545886dc9f609a03aba022820f754d137fc18d45c952f4af2152966a98864ab0e3",
                            [d]: "b7304c2e7cf08c82"
                        };
                        A.set(n),
                        l = sa.getNetworker(e, a.authKey, a.authKeyId, a.serverSalt, y, t, yield this.getImei(), yield this.getToken(), yield this.getPlatform(), yield this.getVersion(), yield this.getUserAgent())
                    } catch (e) {
                        throw this.log("Get networker error", e, e.stack),
                        delete this.gettingNetworkers[o],
                        e
                    }
                return delete this.gettingNetworkers[o],
                r.unshift(l),
                this.setOnDrainIfNeeded(l),
                l
            }
            )))
        }
        setOnDrainIfNeeded(e) {
            if (e.onDrain)
                return;
            (e.isFileNetworker ? Promise.resolve(!0) : this.getBaseDcId().then(t => e.dcId !== t)).then(t => {
                e.onDrain || t && (e.onDrain = () => {
                    this.log("networker drain", e.dcId),
                    e.onDrain = void 0,
                    e.destroy(),
                    sa.removeNetworker(e),
                    Yt.removeTransport(this.cachedNetworkers, e),
                    Yt.removeTransport($t.chosenServers, e.transport)
                }
                ,
                e.setDrainTimeout())
            }
            )
        }
        invokeApi(e, t={}, a={}) {
            const n = qt();
            let {afterMessageId: s, prepareTempMessageId: i} = a;
            if (i && n.then( () => {
                delete this.afterMessageTempIds[i]
            }
            ),
            c) {
                const s = Date.now()
                  , i = Ft.setInterval( () => {
                    o && o.isStopped() || this.log.error("Request is still processing:", e, t, a, "time:", (Date.now() - s) / 1e3)
                }
                , 5e3);
                n.catch(Dt).finally( () => {
                    clearInterval(i)
                }
                )
            }
            const r = e => {
                e ? xe(e) || (e = {
                    message: e
                }) : e = {
                    type: "ERROR_EMPTY"
                },
                n.reject(e),
                (401 === e.code && "SESSION_REVOKED" === e.type || 406 === e.code && "AUTH_KEY_DUPLICATED" === e.type) && this.logOut(),
                401 === e.code && e.type,
                a.ignoreErrors || (406 === e.code && (e.handled = !0),
                a.noErrorBox)
            }
            ;
            let p, o;
            (new Error).stack;
            const m = d => {
                if (s) {
                    const e = this.afterMessageTempIds[s];
                    e && (a.afterMessageId = e.messageId)
                }
                const y = (o = d).wrapApiCall(e, t, a);
                return i && (this.afterMessageTempIds[i] = {
                    messageId: a.messageId,
                    promise: n
                }),
                y.then(n.resolve, i => {
                    if ("FILE_REFERENCE_EXPIRED" !== i.type && this.log.error("Error", i.code, i.type, this.baseDcId, p, e, t),
                    401 === i.code && this.baseDcId === p)
                        i.type,
                        r(i);
                    else if (401 === i.code && this.baseDcId && p !== this.baseDcId) {
                        if (void 0 === this.cachedExportPromise[p]) {
                            const e = new Promise( (e, t) => {
                                this.invokeApi("auth.exportAuthorization", {
                                    dc_id: p
                                }, {
                                    noErrorBox: !0
                                }).then(a => {
                                    this.invokeApi("auth.importAuthorization", {
                                        id: a.id,
                                        bytes: a.bytes
                                    }, {
                                        dcId: p,
                                        noErrorBox: !0
                                    }).then(e, t)
                                }
                                , t)
                            }
                            );
                            this.cachedExportPromise[p] = e
                        }
                        this.cachedExportPromise[p].then( () => {
                            this.invokeApi(e, t, a).then(n.resolve, r)
                        }
                        , r)
                    } else if (303 === i.code) {
                        const s = +i.type.match(/^(PHONE_MIGRATE_|NETWORK_MIGRATE_|USER_MIGRATE_)(\d+)/)[2];
                        s !== p && (a.dcId ? a.dcId = s : this.setBaseDcId(s),
                        this.getNetworker(s, a).then(s => {
                            s.wrapApiCall(e, t, a).then(n.resolve, r)
                        }
                        , r))
                    } else if (400 === i.code && 0 === i.type.indexOf("FILE_MIGRATE")) {
                        const s = +i.type.match(/^(FILE_MIGRATE_)(\d+)/)[2];
                        s !== p ? this.getNetworker(s, a).then(s => {
                            s.wrapApiCall(e, t, a).then(n.resolve, r)
                        }
                        , r) : r(i)
                    } else if (a.rawError || 420 !== i.code)
                        if (!a.rawError && ["MSG_WAIT_FAILED", "MSG_WAIT_TIMEOUT"].includes(i.type)) {
                            const e = this.afterMessageTempIds[s];
                            s = void 0,
                            delete a.afterMessageId,
                            e ? e.promise.then( () => m(o)) : m(o)
                        } else if (a.rawError || 500 !== i.code)
                            "UNKNOWN" === i.type ? setTimeout( () => {
                                m(o)
                            }
                            , 1e3) : r(i);
                        else {
                            const e = Date.now();
                            if (a.stopTime && e >= a.stopTime)
                                return r(i);
                            a.waitTime = a.waitTime ? Math.min(60, 1.5 * a.waitTime) : 1,
                            setTimeout( () => {
                                m(o)
                            }
                            , 1e3 * a.waitTime)
                        }
                    else {
                        const e = +i.type.match(/^FLOOD_WAIT_(\d+)/)[1] || 1;
                        if (e > (void 0 !== a.floodMaxTimeout ? a.floodMaxTimeout : 60) && !a.prepareTempMessageId)
                            return r(i);
                        setTimeout( () => {
                            m(o)
                        }
                        , 1e3 * e)
                    }
                }
                )
            }
            ;
            return (p = a.dcId || this.baseDcId) ? this.getNetworker(p, a).then(m, r) : this.getBaseDcId().then(e => {
                this.getNetworker(p = e, a).then(m, r)
            }
            ),
            n
        }
    }
    ma.imei = "",
    ma.token = "",
    ma.platform = "",
    ma.version = "",
    ma.userAgent = "";
    const da = new ma;
    c.apiManager = da;
    var ya = da;
    var la = function(e, t, a, n) {
        return new (a || (a = Promise))((function(s, i) {
            function r(e) {
                try {
                    o(n.next(e))
                } catch (e) {
                    i(e)
                }
            }
            function p(e) {
                try {
                    o(n.throw(e))
                } catch (e) {
                    i(e)
                }
            }
            function o(e) {
                var t;
                e.done ? s(e.value) : (t = e.value,
                t instanceof a ? t : new a((function(e) {
                    e(t)
                }
                ))).then(r, p)
            }
            o((n = n.apply(e, t || [])).next())
        }
        ))
    };
    var ca = new class {
        constructor() {
            this.blobSupported = !0;
            try {
                Kt([], "")
            } catch (e) {
                this.blobSupported = !1
            }
        }
        isAvailable() {
            return this.blobSupported
        }
        write(e, t) {
            return t instanceof Blob ? (a = t,
            jt(a).then(e => new Uint8Array(e))).then(t => e.write(t)) : e.write(t);
            var a
        }
        getFakeFileWriter(e, t) {
            const a = [];
            return {
                write: e => la(this, void 0, void 0, (function*() {
                    if (!this.blobSupported)
                        throw !1;
                    a.push(e)
                }
                )),
                truncate: () => {
                    a.length = 0
                }
                ,
                finalize: (n=!0) => {
                    const s = Kt(a, e);
                    return n && t && t(s),
                    s
                }
            }
        }
    }
      , ga = function(e, t, a, n) {
        return new (a || (a = Promise))((function(s, i) {
            function r(e) {
                try {
                    o(n.next(e))
                } catch (e) {
                    i(e)
                }
            }
            function p(e) {
                try {
                    o(n.throw(e))
                } catch (e) {
                    i(e)
                }
            }
            function o(e) {
                var t;
                e.done ? s(e.value) : (t = e.value,
                t instanceof a ? t : new a((function(e) {
                    e(t)
                }
                ))).then(r, p)
            }
            o((n = n.apply(e, t || [])).next())
        }
        ))
    };
    class ha {
        constructor(e) {
            this.dbName = e,
            this.useStorage = !0,
            y.test && (this.dbName += "_test"),
            ha.STORAGES.length && (this.useStorage = ha.STORAGES[0].useStorage),
            this.openDatabase(),
            ha.STORAGES.push(this)
        }
        openDatabase() {
            var e;
            return null !== (e = this.openDbPromise) && void 0 !== e ? e : this.openDbPromise = caches.open(this.dbName)
        }
        delete(e) {
            return this.timeoutOperation(t => t.delete("/" + e))
        }
        deleteAll() {
            return caches.delete(this.dbName)
        }
        get(e) {
            return this.timeoutOperation(t => t.match("/" + e))
        }
        save(e, t) {
            return this.timeoutOperation(a => a.put("/" + e, t))
        }
        getFile(e, t="blob") {
            return this.get(e).then(e => {
                if (!e)
                    throw "NO_ENTRY_FOUND";
                return e[t]()
            }
            )
        }
        saveFile(e, t) {
            t instanceof Blob || (t = Kt(t));
            const a = new Response(t,{
                headers: {
                    "Content-Length": "" + t.size
                }
            });
            return this.save(e, a).then( () => t)
        }
        timeoutOperation(e) {
            return this.useStorage ? new Promise( (t, a) => ga(this, void 0, void 0, (function*() {
                let n = !1;
                const s = setTimeout( () => {
                    a(),
                    n = !0
                }
                , 15e3);
                try {
                    const a = yield this.openDatabase();
                    if (!a)
                        throw this.useStorage = !1,
                        this.openDbPromise = void 0,
                        "no cache?";
                    const s = yield e(a);
                    if (n)
                        return;
                    t(s)
                } catch (e) {
                    a(e)
                }
                clearTimeout(s)
            }
            ))) : Promise.reject("STORAGE_OFFLINE")
        }
        getFileWriter(e, t) {
            const a = ca.getFakeFileWriter(t, t => this.saveFile(e, t).catch( () => t));
            return Promise.resolve(a)
        }
        static toggleStorage(e) {
            return Promise.all(this.STORAGES.map(t => {
                if (t.useStorage = e,
                !e)
                    return t.deleteAll()
            }
            ))
        }
    }
    ha.STORAGES = [];
    var ua = function(e, t, a, n) {
        return new (a || (a = Promise))((function(s, i) {
            function r(e) {
                try {
                    o(n.next(e))
                } catch (e) {
                    i(e)
                }
            }
            function p(e) {
                try {
                    o(n.throw(e))
                } catch (e) {
                    i(e)
                }
            }
            function o(e) {
                var t;
                e.done ? s(e.value) : (t = e.value,
                t instanceof a ? t : new a((function(e) {
                    e(t)
                }
                ))).then(r, p)
            }
            o((n = n.apply(e, t || [])).next())
        }
        ))
    };
    class fa {
        constructor() {
            this.cacheStorage = new ha("cachedFiles"),
            this.cachedDownloadPromises = {},
            this.uploadPromises = {},
            this.downloadPulls = {},
            this.downloadActives = {},
            this.webpConvertPromises = {},
            this.refreshReferencePromises = {},
            this.log = Ct("AFM", wt.Error | wt.Log),
            this.tempId = 0,
            this.queueId = 0,
            this.debug = y.debug,
            this.uncompressTGS = (e, t) => Rt.invokeCrypto("gzipUncompress", e.slice().buffer, !0),
            this.convertWebp = (e, t) => {
                const a = qt();
                return P({
                    type: "convertWebp",
                    payload: {
                        fileName: t,
                        bytes: e
                    }
                }),
                this.webpConvertPromises[t] = a
            }
            ,
            setInterval( () => {
                for (const e in this.refreshReferencePromises) {
                    const {deferred: t} = this.refreshReferencePromises[e];
                    (t.isFulfilled || t.isRejected) && delete this.refreshReferencePromises[e]
                }
            }
            , 18e5)
        }
        downloadRequest(e, t, a, n, s=0) {
            void 0 === this.downloadPulls[e] && (this.downloadPulls[e] = [],
            this.downloadActives[e] = 0);
            const i = this.downloadPulls[e]
              , r = new Promise( (e, r) => {
                i.push({
                    id: t,
                    queueId: s,
                    cb: a,
                    deferred: {
                        resolve: e,
                        reject: r
                    },
                    activeDelta: n
                })
            }
            );
            return setTimeout( () => {
                this.downloadCheck(e)
            }
            , 0),
            r
        }
        downloadCheck(e) {
            const t = this.downloadPulls[e]
              , a = "upload" === e ? 24 : 36;
            if (this.downloadActives[e] >= a || !t || !t.length)
                return !1;
            const n = t.findAndSplice(e => 0 === e.queueId) || t.findAndSplice(e => e.queueId === this.queueId) || t.shift()
              , s = n.activeDelta || 1;
            this.downloadActives[e] += s,
            n.cb().then(t => {
                this.downloadActives[e] -= s,
                this.downloadCheck(e),
                n.deferred.resolve(t)
            }
            , t => {
                t && t.type && ("DOWNLOAD_CANCELED" === t.type || "UPLOAD_CANCELED" === t.type) || this.log.error("downloadCheck error:", t),
                this.downloadActives[e] -= s,
                this.downloadCheck(e),
                n.deferred.reject(t)
            }
            )
        }
        setQueueId(e) {
            this.queueId = e
        }
        getFileStorage() {
            return this.cacheStorage
        }
        cancelDownload(e) {
            const t = (this.cachedDownloadPromises[e] ? [this.cachedDownloadPromises[e]] : void 0) || (this.uploadPromises[e] ? Array.from(this.uploadPromises[e]) : []);
            let a = !1;
            for (let e = 0, n = t.length; e < n; ++e) {
                const n = t[e];
                !n || n.isRejected || n.isFulfilled || (n.cancel(),
                a = !0)
            }
            return a
        }
        requestWebFilePart(e, t, a, n, s=0, i=0, r) {
            return this.downloadRequest(e, s, () => ua(this, void 0, void 0, (function*() {
                return r && r(),
                ya.invokeApi("upload.getWebFile", {
                    location: t,
                    offset: a,
                    limit: n
                }, {
                    dcId: e,
                    fileDownload: !0
                })
            }
            )), this.getDelta(n), i)
        }
        requestFilePart(e, t, a, s, i=0, r=0, p) {
            return this.downloadRequest(e, i, () => ua(this, void 0, void 0, (function*() {
                p && p();
                const i = () => ua(this, void 0, void 0, (function*() {
                    p && p();
                    return ya.invokeApi("upload.getFile", {
                        location: t,
                        offset: a,
                        limit: s
                    }, {
                        dcId: e,
                        fileDownload: !0
                    }).catch(e => {
                        if ("FILE_REFERENCE_EXPIRED" === e.type)
                            return this.refreshReference(t).then(i);
                        throw e
                    }
                    )
                }
                ))
                  , r = t.file_reference;
                if (r && !t.checkedReference) {
                    t.checkedReference = !0;
                    const e = n(r);
                    if (this.refreshReferencePromises[e])
                        return this.refreshReference(t).then(i)
                }
                return i()
            }
            )), this.getDelta(s), r)
        }
        getDelta(e) {
            return e / 1024 / 128
        }
        getLimitPart(e) {
            let t;
            return t = 512,
            524288
        }
        refreshReference(e) {
            const t = e.file_reference
              , a = n(t);
            let s = this.refreshReferencePromises[a];
            if (!s) {
                const n = qt();
                s = this.refreshReferencePromises[a] = {
                    deferred: n,
                    timeout: Ft.setTimeout( () => {
                        this.log.error("Didn't refresh the reference:", e),
                        n.reject("REFERENCE_IS_NOT_REFRESHED")
                    }
                    , 6e4)
                },
                n.catch(Dt).finally( () => {
                    clearTimeout(s.timeout)
                }
                );
                P({
                    type: "refreshReference",
                    payload: t
                })
            }
            return s.deferred.then(t => {
                if (a === n(t))
                    throw "REFERENCE_IS_NOT_REFRESHED";
                e.file_reference = t
            }
            )
        }
        downloadFile(e) {
            var t;
            if (!ca.isAvailable())
                return Promise.reject({
                    type: "BROWSER_BLOB_NOT_SUPPORTED"
                });
            const a = null !== (t = e.size) && void 0 !== t ? t : 0
              , {dcId: n, location: s} = e;
            let i;
            "image/webp" !== e.mimeType || Sa() ? "application/x-tgsticker" === e.mimeType && (i = this.uncompressTGS,
            e.mimeType = "application/json") : (i = this.convertWebp,
            e.mimeType = "image/png");
            const r = function(e, t) {
                const a = ""["".length - 1] || "";
                let n;
                switch (e._) {
                case "inputPhotoFileLocation":
                    n = ["photo", ""[0], e.id, e.thumb_size].filter(Boolean).join("_");
                    break;
                case "inputDocumentFileLocation":
                    n = ["document", ""[0], e.id, e.thumb_size].filter(Boolean).join("_");
                    break;
                case "inputPeerPhotoFileLocation":
                    n = ["peerPhoto", e.photo_id, e.pFlags.big ? "big" : "small"].join("_");
                    break;
                case "inputStickerSetThumb":
                    n = ["stickerSetThumb", e.stickerset.id || e.stickerset.short_name || e.stickerset.emoticon || e.stickerset._, e.thumb_version].join("_");
                    break;
                case "inputFileLocation":
                    n = e.volume_id + "_" + e.local_id;
                    break;
                case "inputWebFileLocation":
                    n = ["webFile", e.url].join("_");
                    break;
                default:
                    console.error("Unrecognized location:", e),
                    n = ""
                }
                return n + (a ? "." + a : a)
            }(s, e.fileName)
              , p = this.cachedDownloadPromises[r]
              , o = this.getFileStorage();
            if (this.debug && this.log("downloadFile", r, a, s, e.mimeType),
            p)
                return a ? p.then(t => t.size < a ? (this.debug && this.log("downloadFile need to deleteFile, wrong size:", t.size, a),
                this.deleteFile(r).then( () => this.downloadFile(e)).catch( () => this.downloadFile(e))) : t) : p;
            const m = qt()
              , d = e.mimeType || "image/jpeg";
            let y, l, c = !1, g = e => {
                y = e,
                delete this.cachedDownloadPromises[r],
                m.reject(y),
                g = () => {}
                ,
                !l || y && "DOWNLOAD_CANCELED" === y.type || l.truncate()
            }
            ;
            const h = this.tempId++;
            o.getFile(r).then(e => ua(this, void 0, void 0, (function*() {
                if (e.size < a)
                    throw yield this.deleteFile(r),
                    !1;
                m.resolve(e)
            }
            ))).catch( () => {
                o.getFileWriter(r, d).then(t => {
                    l = t;
                    const p = e.limitPart || this.getLimitPart(a);
                    let o, d, y = Promise.resolve();
                    const f = (e, t) => ua(this, void 0, void 0, (function*() {
                        if (i) {
                            return yield i(e, r)
                        }
                        return e
                    }
                    ))
                      , _ = "inputWebFileLocation" === s._ ? this.requestWebFilePart.bind(this) : this.requestFilePart.bind(this)
                      , v = [];
                    o = 0;
                    do {
                        d = qt(),
                        v.push({
                            offset: o,
                            writeFilePromise: y,
                            writeFileDeferred: d
                        }),
                        y = d,
                        o += p
                    } while (o < a);
                    let b = 0;
                    const P = () => ua(this, void 0, void 0, (function*() {
                        const {offset: i, writeFilePromise: o, writeFileDeferred: d} = v.shift();
                        try {
                            u();
                            const y = yield _(n, s, i, p, h, e.queueId, u)
                              , l = y.bytes;
                            v.length && P(),
                            this.debug && this.log("downloadFile requestFilePart result:", r, y);
                            const g = i + p >= a || !l.byteLength;
                            if (l.byteLength) {
                                b += l.byteLength,
                                m.notify({
                                    done: b,
                                    offset: i,
                                    total: a
                                });
                                const e = yield f(l);
                                u(),
                                yield o,
                                u(),
                                yield ca.write(t, e)
                            }
                            d.resolve(),
                            g && (c = !0,
                            m.resolve(t.finalize(a < 2e7)))
                        } catch (e) {
                            g(e)
                        }
                    }
                    ));
                    for (let e = 0, t = Math.min(1 / 0, v.length); e < t; ++e)
                        P()
                }
                ).catch(e => {
                    ["STORAGE_OFFLINE"].includes(e) || this.log.error("saveFile error:", e)
                }
                )
            }
            );
            const u = () => {
                if (y)
                    throw y
            }
            ;
            return m.cancel = () => {
                if (!y && !c) {
                    const e = new Error("Canceled");
                    e.type = "DOWNLOAD_CANCELED",
                    g(e)
                }
            }
            ,
            m.notify = e => {
                w({
                    progress: Object.assign({
                        fileName: r
                    }, e)
                })
            }
            ,
            this.cachedDownloadPromises[r] = m,
            m.safeFinally( () => {
                delete this.cachedDownloadPromises[r]
            }
            ),
            m
        }
        deleteFile(e) {
            return delete this.cachedDownloadPromises[e],
            this.getFileStorage().delete(e)
        }
        uploadFile({file: e, fileName: t, peer: a}) {
            var n;
            null === fa.peer && (fa.peer = a);
            const s = e.size
              , i = s >= 10485760;
            let r = !1
              , p = !1
              , o = 0
              , m = 262144;
            s > 67108864 ? m = 524288 : s < 102400 && (m = 32768);
            const d = this.getDelta(m)
              , y = Math.ceil(s / m)
              , l = st();
            let c = 0;
            const g = {
                _: i ? "inputFileBig" : "inputFile",
                id: l,
                parts: y,
                name: t,
                md5_checksum: ""
            }
              , h = {
                notify: e => {}
            }
              , u = new Promise( (e, t) => {
                if (y > 4e3)
                    return t({
                        type: "FILE_TOO_BIG"
                    });
                h.resolve = e,
                h.reject = t
            }
            );
            if (Object.assign(u, h),
            y > 4e3)
                return u;
            let f = e => {
                "UPLOAD_CANCELED" !== (null == e ? void 0 : e.type) && this.log.error("Up Error", e),
                u.reject(e),
                r = !0,
                f = () => {}
            }
            ;
            const _ = i ? "upload.saveBigFilePart" : "upload.saveFilePart"
              , v = this.tempId++
              , b = this;
            const P = function*() {
                for (let t = 0; t < s; t += m) {
                    const n = c++;
                    yield b.downloadRequest("upload", v, () => jt(e.slice(t, t + m)).then(e => {
                        if (r)
                            throw {
                                type: "UPLOAD_CANCELED"
                            };
                        return b.debug && b.log("Upload file part, isBig:", i, n, e.byteLength, new Uint8Array(e).length, new Uint8Array(e).slice().length),
                        ya.invokeApi(_, {
                            file_id: l,
                            file_part: n,
                            file_total_parts: y,
                            bytes: e,
                            peer: a,
                            totalFileSize: s
                        }, {
                            fileUpload: !0
                        }).then(e => {
                            o++,
                            u.notify({
                                done: o * m,
                                total: s
                            }),
                            o >= y && (u.resolve(g),
                            p = !0)
                        }
                        , f)
                    }
                    ), d).catch(f)
                }
            }()
              , S = () => {
                if (r)
                    return;
                const e = P.next();
                e.done || r || e.value.then(S)
            }
            ;
            for (let e = 0, t = Math.min(1 / 0, y); e < t; ++e)
                S();
            u.cancel = () => {
                r || p || (r = !0,
                f({
                    type: "UPLOAD_CANCELED"
                }))
            }
            ,
            u.notify = e => {
                w({
                    progress: Object.assign({
                        fileName: t
                    }, e)
                })
            }
            ,
            u.finally( () => {
                k.delete(u),
                k.size || delete this.uploadPromises[t]
            }
            );
            const k = null !== (n = this.uploadPromises[t]) && void 0 !== n ? n : this.uploadPromises[t] = new Set;
            return k.add(u),
            u
        }
    }
    fa.peer = null;
    const _a = new fa;
    c.apiFileManager = _a;
    var va = _a;
    const ba = new Map;
    var Pa = function(e, t, a, n) {
        return new (a || (a = Promise))((function(s, i) {
            function r(e) {
                try {
                    o(n.next(e))
                } catch (e) {
                    i(e)
                }
            }
            function p(e) {
                try {
                    o(n.throw(e))
                } catch (e) {
                    i(e)
                }
            }
            function o(e) {
                var t;
                e.done ? s(e.value) : (t = e.value,
                t instanceof a ? t : new a((function(e) {
                    e(t)
                }
                ))).then(r, p)
            }
            o((n = n.apply(e, t || [])).next())
        }
        ))
    };
    let wa = !1;
    const Sa = () => wa;
    sa.setUpdatesProcessor(e => {
        w({
            update: e
        })
    }
    ),
    sa.onConnectionStatusChange = e => {
        w({
            type: "connectionStatusChange",
            payload: e
        })
    }
    ;
    const ka = {
        convertWebp: e => {
            const {fileName: t, bytes: a} = e.payload
              , n = va.webpConvertPromises[t];
            n && (n.resolve(a),
            delete va.webpConvertPromises[t])
        }
        ,
        webpSupport: e => {
            wa = e.payload
        }
        ,
        socketProxy: e => {
            const t = e.payload
              , a = t.id
              , n = ba.get(a);
            "message" === t.type ? n.dispatchEvent("message", t.payload) : "open" === t.type ? n.dispatchEvent("open") : "close" === t.type && (n.dispatchEvent("close"),
            ba.delete(a))
        }
        ,
        localStorageProxy: e => {
            A.finishTask(e.id, e.payload)
        }
        ,
        userAgent: e => {
            sa.userAgent = e.payload
        }
        ,
        online: () => {
            sa.forceReconnectTimeout()
        }
        ,
        forceReconnect: () => {
            sa.forceReconnect()
        }
        ,
        toggleStorage: e => {
            const t = e.payload;
            ha.toggleStorage(t)
        }
        ,
        refreshReference: e => {
            const t = n(e.originalPayload)
              , a = va.refreshReferencePromises[t]
              , s = null == a ? void 0 : a.deferred;
            s && (e.error ? s.reject(e.error) : s.resolve(e.payload))
        }
    };
    Ft.addEventListener("message", e => Pa(void 0, void 0, void 0, (function*() {
        try {
            const t = e.data
              , a = t.taskId
              , n = ka[t.type];
            if (n)
                return void n(t);
            if (!t.task)
                return;
            switch (t.task) {
            case "computeSRP":
            case "gzipUncompress":
                return Rt.invokeCrypto(t.task, ...t.args).then(e => {
                    w({
                        taskId: a,
                        result: e
                    })
                }
                );
            case "requestFilePart":
            case "setQueueId":
            case "cancelDownload":
            case "uploadFile":
            case "downloadFile":
                try {
                    let e = va[t.task].apply(va, t.args);
                    e instanceof Promise && (e = yield e),
                    w({
                        taskId: a,
                        result: e
                    })
                } catch (e) {
                    w({
                        taskId: a,
                        error: e
                    })
                }
                break;
            case "getNetworker":
                ya[t.task].apply(ya, t.args).finally( () => {
                    w({
                        taskId: a,
                        result: null
                    })
                }
                );
                break;
            case "setLanguage":
            case "startAll":
            case "stopAll":
                sa[t.task].apply(sa, t.args);
                break;
            default:
                try {
                    let e = ya[t.task].apply(ya, t.args);
                    e instanceof Promise && (e = yield e),
                    w({
                        taskId: a,
                        result: e
                    })
                } catch (e) {
                    w({
                        taskId: a,
                        error: e
                    })
                }
            }
        } catch (e) {
            console.error("worker task error:", e)
        }
    }
    ))),
    w("ready")
}
]);
