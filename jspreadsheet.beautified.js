var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.arrayIteratorImpl = function (p) {
    var q = 0;
    return function () {
        return q < p.length ? {
            done: !1,
            value: p[q++]
        } : { done: !0 };
    };
};
$jscomp.arrayIterator = function (p) {
    return { next: $jscomp.arrayIteratorImpl(p) };
};
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.SIMPLE_FROUND_POLYFILL = !1;
$jscomp.ISOLATE_POLYFILLS = !1;
$jscomp.FORCE_POLYFILL_PROMISE = !1;
$jscomp.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION = !1;
$jscomp.defineProperty = $jscomp.ASSUME_ES5 || 'function' == typeof Object.defineProperties ? Object.defineProperty : function (p, q, h) {
    if (p == Array.prototype || p == Object.prototype)
        return p;
    p[q] = h.value;
    return p;
};
$jscomp.getGlobal = function (p) {
    p = [
        'object' == typeof globalThis && globalThis,
        p,
        'object' == typeof window && window,
        'object' == typeof self && self,
        'object' == typeof global && global
    ];
    for (var q = 0; q < p.length; ++q) {
        var h = p[q];
        if (h && h.Math == Math)
            return h;
    }
    throw Error('Cannot find global object');
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.IS_SYMBOL_NATIVE = 'function' === typeof Symbol && 'symbol' === typeof Symbol('x');
$jscomp.TRUST_ES6_POLYFILLS = !$jscomp.ISOLATE_POLYFILLS || $jscomp.IS_SYMBOL_NATIVE;
$jscomp.polyfills = {};
$jscomp.propertyToPolyfillSymbol = {};
$jscomp.POLYFILL_PREFIX = '$jscp$';
var $jscomp$lookupPolyfilledValue = function (p, q) {
    var h = $jscomp.propertyToPolyfillSymbol[q];
    if (null == h)
        return p[q];
    h = p[h];
    return void 0 !== h ? h : p[q];
};
$jscomp.polyfill = function (p, q, h, e) {
    q && ($jscomp.ISOLATE_POLYFILLS ? $jscomp.polyfillIsolated(p, q, h, e) : $jscomp.polyfillUnisolated(p, q, h, e));
};
$jscomp.polyfillUnisolated = function (p, q, h, e) {
    h = $jscomp.global;
    p = p.split('.');
    for (e = 0; e < p.length - 1; e++) {
        var t = p[e];
        if (!(t in h))
            return;
        h = h[t];
    }
    p = p[p.length - 1];
    e = h[p];
    q = q(e);
    q != e && null != q && $jscomp.defineProperty(h, p, {
        configurable: !0,
        writable: !0,
        value: q
    });
};
$jscomp.polyfillIsolated = function (p, q, h, e) {
    var t = p.split('.');
    p = 1 === t.length;
    e = t[0];
    e = !p && e in $jscomp.polyfills ? $jscomp.polyfills : $jscomp.global;
    for (var z = 0; z < t.length - 1; z++) {
        var C = t[z];
        if (!(C in e))
            return;
        e = e[C];
    }
    t = t[t.length - 1];
    h = $jscomp.IS_SYMBOL_NATIVE && 'es6' === h ? e[t] : null;
    q = q(h);
    null != q && (p ? $jscomp.defineProperty($jscomp.polyfills, t, {
        configurable: !0,
        writable: !0,
        value: q
    }) : q !== h && (void 0 === $jscomp.propertyToPolyfillSymbol[t] && (h = 1000000000 * Math.random() >>> 0, $jscomp.propertyToPolyfillSymbol[t] = $jscomp.IS_SYMBOL_NATIVE ? $jscomp.global.Symbol(t) : $jscomp.POLYFILL_PREFIX + h + '$' + t), $jscomp.defineProperty(e, $jscomp.propertyToPolyfillSymbol[t], {
        configurable: !0,
        writable: !0,
        value: q
    })));
};
$jscomp.initSymbol = function () {
};
$jscomp.polyfill('Symbol', function (p) {
    if (p)
        return p;
    var q = function (z, C) {
        this.$jscomp$symbol$id_ = z;
        $jscomp.defineProperty(this, 'description', {
            configurable: !0,
            writable: !0,
            value: C
        });
    };
    q.prototype.toString = function () {
        return this.$jscomp$symbol$id_;
    };
    var h = 'jscomp_symbol_' + (1000000000 * Math.random() >>> 0) + '_', e = 0, t = function (z) {
            if (this instanceof t)
                throw new TypeError('Symbol is not a constructor');
            return new q(h + (z || '') + '_' + e++, z);
        };
    return t;
}, 'es6', 'es3');
$jscomp.polyfill('Symbol.iterator', function (p) {
    if (p)
        return p;
    p = Symbol('Symbol.iterator');
    for (var q = 'Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array'.split(' '), h = 0; h < q.length; h++) {
        var e = $jscomp.global[q[h]];
        'function' === typeof e && 'function' != typeof e.prototype[p] && $jscomp.defineProperty(e.prototype, p, {
            configurable: !0,
            writable: !0,
            value: function () {
                return $jscomp.iteratorPrototype($jscomp.arrayIteratorImpl(this));
            }
        });
    }
    return p;
}, 'es6', 'es3');
$jscomp.iteratorPrototype = function (p) {
    p = { next: p };
    p[Symbol.iterator] = function () {
        return this;
    };
    return p;
};
$jscomp.iteratorFromArray = function (p, q) {
    p instanceof String && (p += '');
    var h = 0, e = !1, t = {
            next: function () {
                if (!e && h < p.length) {
                    var z = h++;
                    return {
                        value: q(z, p[z]),
                        done: !1
                    };
                }
                e = !0;
                return {
                    done: !0,
                    value: void 0
                };
            }
        };
    t[Symbol.iterator] = function () {
        return t;
    };
    return t;
};
$jscomp.polyfill('Array.prototype.keys', function (p) {
    return p ? p : function () {
        return $jscomp.iteratorFromArray(this, function (q) {
            return q;
        });
    };
}, 'es6', 'es3');
(function (p, q) {
    'object' === typeof exports && 'undefined' !== typeof module ? module.exports = q() : 'function' === typeof define && define.amd ? define(q) : p.formula = q();
}(this, function () {
    var p = function (q) {
        var h = function () {
                var g = {};
                g.nil = Error('#NULL!');
                g.div0 = Error('#DIV/0!');
                g.value = Error('#VALUE!');
                g.ref = Error('#REF!');
                g.name = Error('#NAME?');
                g.num = Error('#NUM!');
                g.na = Error('#N/A');
                g.error = Error('#ERROR!');
                g.data = Error('#GETTING_DATA');
                return g;
            }(), e = function () {
                var g = {
                        flattenShallow: function (a) {
                            return a && a.reduce ? a.reduce(function (c, d) {
                                var f = Array.isArray(c), k = Array.isArray(d);
                                return f && k ? c.concat(d) : f ? (c.push(d), c) : k ? [c].concat(d) : [
                                    c,
                                    d
                                ];
                            }) : a;
                        },
                        isFlat: function (a) {
                            if (!a)
                                return !1;
                            for (var c = 0; c < a.length; ++c)
                                if (Array.isArray(a[c]))
                                    return !1;
                            return !0;
                        },
                        flatten: function () {
                            for (var a = g.argsToArray.apply(null, arguments); !g.isFlat(a);)
                                a = g.flattenShallow(a);
                            return a;
                        },
                        argsToArray: function (a) {
                            var c = [];
                            g.arrayEach(a, function (d) {
                                c.push(d);
                            });
                            return c;
                        },
                        numbers: function () {
                            return this.flatten.apply(null, arguments).filter(function (a) {
                                return 'number' === typeof a;
                            });
                        },
                        cleanFloat: function (a) {
                            return Math.round(100000000000000 * a) / 100000000000000;
                        },
                        parseBool: function (a) {
                            if ('boolean' === typeof a || a instanceof Error)
                                return a;
                            if ('number' === typeof a)
                                return 0 !== a;
                            if ('string' === typeof a) {
                                var c = a.toUpperCase();
                                if ('TRUE' === c)
                                    return !0;
                                if ('FALSE' === c)
                                    return !1;
                            }
                            return a instanceof Date && !isNaN(a) ? !0 : h.value;
                        },
                        parseNumber: function (a) {
                            return void 0 === a || '' === a ? h.value : isNaN(a) ? h.value : parseFloat(a);
                        },
                        parseNumberArray: function (a) {
                            var c;
                            if (!a || 0 === (c = a.length))
                                return h.value;
                            for (var d; c--;) {
                                d = g.parseNumber(a[c]);
                                if (d === h.value)
                                    return d;
                                a[c] = d;
                            }
                            return a;
                        },
                        parseMatrix: function (a) {
                            if (!a || 0 === a.length)
                                return h.value;
                            for (var c, d = 0; d < a.length; d++)
                                if (c = g.parseNumberArray(a[d]), a[d] = c, c instanceof Error)
                                    return c;
                            return a;
                        }
                    }, b = new Date(Date.UTC(1900, 0, 1));
                g.parseDate = function (a) {
                    if (!isNaN(a)) {
                        if (a instanceof Date)
                            return new Date(a);
                        a = parseInt(a, 10);
                        return 0 > a ? h.num : 60 >= a ? new Date(b.getTime() + 86400000 * (a - 1)) : new Date(b.getTime() + 86400000 * (a - 2));
                    }
                    return 'string' !== typeof a || (a = new Date(a), isNaN(a)) ? h.value : a;
                };
                g.parseDateArray = function (a) {
                    for (var c = a.length, d; c--;) {
                        d = this.parseDate(a[c]);
                        if (d === h.value)
                            return d;
                        a[c] = d;
                    }
                    return a;
                };
                g.anyIsError = function () {
                    for (var a = arguments.length; a--;)
                        if (arguments[a] instanceof Error)
                            return !0;
                    return !1;
                };
                g.arrayValuesToNumbers = function (a) {
                    for (var c = a.length, d; c--;)
                        d = a[c], 'number' !== typeof d && (!0 === d ? a[c] = 1 : !1 === d ? a[c] = 0 : 'string' === typeof d && (d = this.parseNumber(d), a[c] = d instanceof Error ? 0 : d));
                    return a;
                };
                g.rest = function (a, c) {
                    return a && 'function' === typeof a.slice ? a.slice(c || 1) : a;
                };
                g.initial = function (a, c) {
                    return a && 'function' === typeof a.slice ? a.slice(0, a.length - (c || 1)) : a;
                };
                g.arrayEach = function (a, c) {
                    for (var d = -1, f = a.length; ++d < f && !1 !== c(a[d], d, a););
                    return a;
                };
                g.transpose = function (a) {
                    return a ? a[0].map(function (c, d) {
                        return a.map(function (f) {
                            return f[d];
                        });
                    }) : h.value;
                };
                return g;
            }(), t = {};
        t.datetime = function () {
            function g(d) {
                return (d - a) / 86400000 + (-2203891200000 < d ? 2 : 1);
            }
            var b = {}, a = new Date(1900, 0, 1), c = [
                    [],
                    [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7
                    ],
                    [
                        7,
                        1,
                        2,
                        3,
                        4,
                        5,
                        6
                    ],
                    [
                        6,
                        0,
                        1,
                        2,
                        3,
                        4,
                        5
                    ],
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                    [
                        7,
                        1,
                        2,
                        3,
                        4,
                        5,
                        6
                    ],
                    [
                        6,
                        7,
                        1,
                        2,
                        3,
                        4,
                        5
                    ],
                    [
                        5,
                        6,
                        7,
                        1,
                        2,
                        3,
                        4
                    ],
                    [
                        4,
                        5,
                        6,
                        7,
                        1,
                        2,
                        3
                    ],
                    [
                        3,
                        4,
                        5,
                        6,
                        7,
                        1,
                        2
                    ],
                    [
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        1
                    ],
                    [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7
                    ]
                ];
            b.DATE = function (d, f, k) {
                d = e.parseNumber(d);
                f = e.parseNumber(f);
                k = e.parseNumber(k);
                return e.anyIsError(d, f, k) ? h.value : 0 > d || 0 > f || 0 > k ? h.num : new Date(d, f - 1, k);
            };
            b.DATEVALUE = function (d) {
                if ('string' !== typeof d)
                    return h.value;
                d = Date.parse(d);
                return isNaN(d) ? h.value : -2203891200000 >= d ? (d - a) / 86400000 + 1 : (d - a) / 86400000 + 2;
            };
            b.DAY = function (d) {
                d = e.parseDate(d);
                return d instanceof Error ? d : d.getDate();
            };
            b.DAYS = function (d, f) {
                d = e.parseDate(d);
                f = e.parseDate(f);
                return d instanceof Error ? d : f instanceof Error ? f : g(d) - g(f);
            };
            b.DAYS360 = function (d, f, k) {
            };
            b.EDATE = function (d, f) {
                d = e.parseDate(d);
                if (d instanceof Error)
                    return d;
                if (isNaN(f))
                    return h.value;
                f = parseInt(f, 10);
                d.setMonth(d.getMonth() + f);
                return g(d);
            };
            b.EOMONTH = function (d, f) {
                d = e.parseDate(d);
                if (d instanceof Error)
                    return d;
                if (isNaN(f))
                    return h.value;
                f = parseInt(f, 10);
                return g(new Date(d.getFullYear(), d.getMonth() + f + 1, 0));
            };
            b.HOUR = function (d) {
                d = e.parseDate(d);
                return d instanceof Error ? d : d.getHours();
            };
            b.INTERVAL = function (d) {
                if ('number' !== typeof d && 'string' !== typeof d)
                    return h.value;
                d = parseInt(d, 10);
                var f = Math.floor(d / 946080000);
                d %= 946080000;
                var k = Math.floor(d / 2592000);
                d %= 2592000;
                var l = Math.floor(d / 86400);
                d %= 86400;
                var m = Math.floor(d / 3600);
                d %= 3600;
                var n = Math.floor(d / 60);
                d %= 60;
                return 'P' + (0 < f ? f + 'Y' : '') + (0 < k ? k + 'M' : '') + (0 < l ? l + 'D' : '') + 'T' + (0 < m ? m + 'H' : '') + (0 < n ? n + 'M' : '') + (0 < d ? d + 'S' : '');
            };
            b.ISOWEEKNUM = function (d) {
                d = e.parseDate(d);
                if (d instanceof Error)
                    return d;
                d.setHours(0, 0, 0);
                d.setDate(d.getDate() + 4 - (d.getDay() || 7));
                var f = new Date(d.getFullYear(), 0, 1);
                return Math.ceil(((d - f) / 86400000 + 1) / 7);
            };
            b.MINUTE = function (d) {
                d = e.parseDate(d);
                return d instanceof Error ? d : d.getMinutes();
            };
            b.MONTH = function (d) {
                d = e.parseDate(d);
                return d instanceof Error ? d : d.getMonth() + 1;
            };
            b.NETWORKDAYS = function (d, f, k) {
            };
            b.NETWORKDAYS.INTL = function (d, f, k, l) {
            };
            b.NOW = function () {
                return new Date();
            };
            b.SECOND = function (d) {
                d = e.parseDate(d);
                return d instanceof Error ? d : d.getSeconds();
            };
            b.TIME = function (d, f, k) {
                d = e.parseNumber(d);
                f = e.parseNumber(f);
                k = e.parseNumber(k);
                return e.anyIsError(d, f, k) ? h.value : 0 > d || 0 > f || 0 > k ? h.num : (3600 * d + 60 * f + k) / 86400;
            };
            b.TIMEVALUE = function (d) {
                d = e.parseDate(d);
                return d instanceof Error ? d : (3600 * d.getHours() + 60 * d.getMinutes() + d.getSeconds()) / 86400;
            };
            b.TODAY = function () {
                return new Date();
            };
            b.WEEKDAY = function (d, f) {
                d = e.parseDate(d);
                if (d instanceof Error)
                    return d;
                void 0 === f && (f = 1);
                d = d.getDay();
                return c[f][d];
            };
            b.WEEKNUM = function (d, f) {
            };
            b.WORKDAY = function (d, f, k) {
            };
            b.WORKDAY.INTL = function (d, f, k, l) {
            };
            b.YEAR = function (d) {
                d = e.parseDate(d);
                return d instanceof Error ? d : d.getFullYear();
            };
            b.YEARFRAC = function (d, f, k) {
            };
            return b;
        }();
        t.database = function () {
            function g(a, c) {
                for (var d = {}, f = 1; f < a[0].length; ++f)
                    d[f] = !0;
                var k = c[0].length;
                for (f = 1; f < c.length; ++f)
                    c[f].length > k && (k = c[f].length);
                for (f = 1; f < a.length; ++f)
                    for (var l = 1; l < a[f].length; ++l) {
                        for (var m = !1, n = !1, r = 0; r < c.length; ++r) {
                            var u = c[r];
                            if (!(u.length < k) && a[f][0] === u[0]) {
                                n = !0;
                                for (var w = 1; w < u.length; ++w)
                                    m = m || eval(a[f][l] + u[w]);
                            }
                        }
                        n && (d[l] = d[l] && m);
                    }
                c = [];
                for (k = 0; k < a[0].length; ++k)
                    d[k] && c.push(k - 1);
                return c;
            }
            var b = {
                FINDFIELD: function (a, c) {
                    for (var d = null, f = 0; f < a.length; f++)
                        if (a[f][0] === c) {
                            d = f;
                            break;
                        }
                    return null == d ? h.value : d;
                },
                DAVERAGE: function (a, c, d) {
                    if (isNaN(c) && 'string' !== typeof c)
                        return h.value;
                    d = g(a, d);
                    'string' === typeof c ? (c = b.FINDFIELD(a, c), a = e.rest(a[c])) : a = e.rest(a[c]);
                    for (var f = c = 0; f < d.length; f++)
                        c += a[d[f]];
                    return 0 === d.length ? h.div0 : c / d.length;
                },
                DCOUNT: function (a, c, d) {
                },
                DCOUNTA: function (a, c, d) {
                },
                DGET: function (a, c, d) {
                    if (isNaN(c) && 'string' !== typeof c)
                        return h.value;
                    d = g(a, d);
                    'string' === typeof c ? (c = b.FINDFIELD(a, c), a = e.rest(a[c])) : a = e.rest(a[c]);
                    return 0 === d.length ? h.value : 1 < d.length ? h.num : a[d[0]];
                },
                DMAX: function (a, c, d) {
                    if (isNaN(c) && 'string' !== typeof c)
                        return h.value;
                    d = g(a, d);
                    'string' === typeof c ? (c = b.FINDFIELD(a, c), a = e.rest(a[c])) : a = e.rest(a[c]);
                    c = a[d[0]];
                    for (var f = 1; f < d.length; f++)
                        c < a[d[f]] && (c = a[d[f]]);
                    return c;
                },
                DMIN: function (a, c, d) {
                    if (isNaN(c) && 'string' !== typeof c)
                        return h.value;
                    d = g(a, d);
                    'string' === typeof c ? (c = b.FINDFIELD(a, c), a = e.rest(a[c])) : a = e.rest(a[c]);
                    c = a[d[0]];
                    for (var f = 1; f < d.length; f++)
                        c > a[d[f]] && (c = a[d[f]]);
                    return c;
                },
                DPRODUCT: function (a, c, d) {
                    if (isNaN(c) && 'string' !== typeof c)
                        return h.value;
                    d = g(a, d);
                    if ('string' === typeof c) {
                        c = b.FINDFIELD(a, c);
                        var f = e.rest(a[c]);
                    } else
                        f = e.rest(a[c]);
                    a = [];
                    for (c = 0; c < d.length; c++)
                        a[c] = f[d[c]];
                    if (d = a)
                        for (a = [], c = 0; c < d.length; ++c)
                            d[c] && a.push(d[c]);
                    else
                        a = d;
                    d = 1;
                    for (c = 0; c < a.length; c++)
                        d *= a[c];
                    return d;
                },
                DSTDEV: function (a, c, d) {
                },
                DSTDEVP: function (a, c, d) {
                },
                DSUM: function (a, c, d) {
                },
                DVAR: function (a, c, d) {
                },
                DVARP: function (a, c, d) {
                },
                MATCH: function (a, c, d) {
                    if (!a && !c)
                        return h.na;
                    2 === arguments.length && (d = 1);
                    if (!(c instanceof Array) || -1 !== d && 0 !== d && 1 !== d)
                        return h.na;
                    for (var f, k, l = 0; l < c.length; l++)
                        if (1 === d) {
                            if (c[l] === a)
                                return l + 1;
                            c[l] < a && (k ? c[l] > k && (f = l + 1, k = c[l]) : (f = l + 1, k = c[l]));
                        } else if (0 === d)
                            if ('string' === typeof a) {
                                if (a = a.replace(/\?/g, '.'), c[l].toLowerCase().match(a.toLowerCase()))
                                    return l + 1;
                            } else {
                                if (c[l] === a)
                                    return l + 1;
                            }
                        else if (-1 === d) {
                            if (c[l] === a)
                                return l + 1;
                            c[l] > a && (k ? c[l] < k && (f = l + 1, k = c[l]) : (f = l + 1, k = c[l]));
                        }
                    return f ? f : h.na;
                }
            };
            return b;
        }();
        t.engineering = function () {
            var g = {
                BESSELI: function (b, a) {
                },
                BESSELJ: function (b, a) {
                },
                BESSELK: function (b, a) {
                },
                BESSELY: function (b, a) {
                },
                BIN2DEC: function (b) {
                    if (!/^[01]{1,10}$/.test(b))
                        return h.num;
                    var a = parseInt(b, 2);
                    b = b.toString();
                    return 10 === b.length && '1' === b.substring(0, 1) ? parseInt(b.substring(1), 2) - 512 : a;
                },
                BIN2HEX: function (b, a) {
                    if (!/^[01]{1,10}$/.test(b))
                        return h.num;
                    var c = b.toString();
                    if (10 === c.length && '1' === c.substring(0, 1))
                        return (1099511627264 + parseInt(c.substring(1), 2)).toString(16);
                    b = parseInt(b, 2).toString(16);
                    if (void 0 === a)
                        return b;
                    if (isNaN(a))
                        return h.value;
                    if (0 > a)
                        return h.num;
                    a = Math.floor(a);
                    return a >= b.length ? REPT('0', a - b.length) + b : h.num;
                },
                BIN2OCT: function (b, a) {
                    if (!/^[01]{1,10}$/.test(b))
                        return h.num;
                    var c = b.toString();
                    if (10 === c.length && '1' === c.substring(0, 1))
                        return (1073741312 + parseInt(c.substring(1), 2)).toString(8);
                    b = parseInt(b, 2).toString(8);
                    if (void 0 === a)
                        return b;
                    if (isNaN(a))
                        return h.value;
                    if (0 > a)
                        return h.num;
                    a = Math.floor(a);
                    return a >= b.length ? REPT('0', a - b.length) + b : h.num;
                },
                BITAND: function (b, a) {
                    b = e.parseNumber(b);
                    a = e.parseNumber(a);
                    return e.anyIsError(b, a) ? h.value : 0 > b || 0 > a || Math.floor(b) !== b || Math.floor(a) !== a || 281474976710655 < b || 281474976710655 < a ? h.num : b & a;
                },
                BITLSHIFT: function (b, a) {
                    b = e.parseNumber(b);
                    a = e.parseNumber(a);
                    return e.anyIsError(b, a) ? h.value : 0 > b || Math.floor(b) !== b || 281474976710655 < b || 53 < Math.abs(a) ? h.num : 0 <= a ? b << a : b >> -a;
                },
                BITOR: function (b, a) {
                    b = e.parseNumber(b);
                    a = e.parseNumber(a);
                    return e.anyIsError(b, a) ? h.value : 0 > b || 0 > a || Math.floor(b) !== b || Math.floor(a) !== a || 281474976710655 < b || 281474976710655 < a ? h.num : b | a;
                },
                BITRSHIFT: function (b, a) {
                    b = e.parseNumber(b);
                    a = e.parseNumber(a);
                    return e.anyIsError(b, a) ? h.value : 0 > b || Math.floor(b) !== b || 281474976710655 < b || 53 < Math.abs(a) ? h.num : 0 <= a ? b >> a : b << -a;
                },
                BITXOR: function (b, a) {
                    b = e.parseNumber(b);
                    a = e.parseNumber(a);
                    return e.anyIsError(b, a) ? h.value : 0 > b || 0 > a || Math.floor(b) !== b || Math.floor(a) !== a || 281474976710655 < b || 281474976710655 < a ? h.num : b ^ a;
                },
                COMPLEX: function (b, a, c) {
                    b = e.parseNumber(b);
                    a = e.parseNumber(a);
                    if (e.anyIsError(b, a))
                        return b;
                    c = void 0 === c ? 'i' : c;
                    return 'i' !== c && 'j' !== c ? h.value : 0 === b && 0 === a ? 0 : 0 === b ? 1 === a ? c : a.toString() + c : 0 === a ? b.toString() : b.toString() + (0 < a ? '+' : '') + (1 === a ? c : a.toString() + c);
                },
                CONVERT: function (b, a, c) {
                    b = e.parseNumber(b);
                    if (b instanceof Error)
                        return b;
                    for (var d = [
                                [
                                    'a.u. of action',
                                    '?',
                                    null,
                                    'action',
                                    !1,
                                    !1,
                                    1.05457168181818e-34
                                ],
                                [
                                    'a.u. of charge',
                                    'e',
                                    null,
                                    'electric_charge',
                                    !1,
                                    !1,
                                    1.60217653141414e-19
                                ],
                                [
                                    'a.u. of energy',
                                    'Eh',
                                    null,
                                    'energy',
                                    !1,
                                    !1,
                                    4.35974417757576e-18
                                ],
                                [
                                    'a.u. of length',
                                    'a?',
                                    null,
                                    'length',
                                    !1,
                                    !1,
                                    5.29177210818182e-11
                                ],
                                [
                                    'a.u. of mass',
                                    'm?',
                                    null,
                                    'mass',
                                    !1,
                                    !1,
                                    9.10938261616162e-31
                                ],
                                [
                                    'a.u. of time',
                                    '?/Eh',
                                    null,
                                    'time',
                                    !1,
                                    !1,
                                    2.41888432650516e-17
                                ],
                                [
                                    'admiralty knot',
                                    'admkn',
                                    null,
                                    'speed',
                                    !1,
                                    !0,
                                    0.514773333
                                ],
                                [
                                    'ampere',
                                    'A',
                                    null,
                                    'electric_current',
                                    !0,
                                    !1,
                                    1
                                ],
                                [
                                    'ampere per meter',
                                    'A/m',
                                    null,
                                    'magnetic_field_intensity',
                                    !0,
                                    !1,
                                    1
                                ],
                                [
                                    'ångström',
                                    'Å',
                                    ['ang'],
                                    'length',
                                    !1,
                                    !0,
                                    1e-10
                                ],
                                [
                                    'are',
                                    'ar',
                                    null,
                                    'area',
                                    !1,
                                    !0,
                                    100
                                ],
                                [
                                    'astronomical unit',
                                    'ua',
                                    null,
                                    'length',
                                    !1,
                                    !1,
                                    1.49597870691667e-11
                                ],
                                [
                                    'bar',
                                    'bar',
                                    null,
                                    'pressure',
                                    !1,
                                    !1,
                                    100000
                                ],
                                [
                                    'barn',
                                    'b',
                                    null,
                                    'area',
                                    !1,
                                    !1,
                                    1e-28
                                ],
                                [
                                    'becquerel',
                                    'Bq',
                                    null,
                                    'radioactivity',
                                    !0,
                                    !1,
                                    1
                                ],
                                [
                                    'bit',
                                    'bit',
                                    ['b'],
                                    'information',
                                    !1,
                                    !0,
                                    1
                                ],
                                [
                                    'btu',
                                    'BTU',
                                    ['btu'],
                                    'energy',
                                    !1,
                                    !0,
                                    1055.05585262
                                ],
                                [
                                    'byte',
                                    'byte',
                                    null,
                                    'information',
                                    !1,
                                    !0,
                                    8
                                ],
                                [
                                    'candela',
                                    'cd',
                                    null,
                                    'luminous_intensity',
                                    !0,
                                    !1,
                                    1
                                ],
                                [
                                    'candela per square metre',
                                    'cd/m?',
                                    null,
                                    'luminance',
                                    !0,
                                    !1,
                                    1
                                ],
                                [
                                    'coulomb',
                                    'C',
                                    null,
                                    'electric_charge',
                                    !0,
                                    !1,
                                    1
                                ],
                                [
                                    'cubic ångström',
                                    'ang3',
                                    ['ang^3'],
                                    'volume',
                                    !1,
                                    !0,
                                    1e-30
                                ],
                                [
                                    'cubic foot',
                                    'ft3',
                                    ['ft^3'],
                                    'volume',
                                    !1,
                                    !0,
                                    0.028316846592
                                ],
                                [
                                    'cubic inch',
                                    'in3',
                                    ['in^3'],
                                    'volume',
                                    !1,
                                    !0,
                                    0.000016387064
                                ],
                                [
                                    'cubic light-year',
                                    'ly3',
                                    ['ly^3'],
                                    'volume',
                                    !1,
                                    !0,
                                    8.46786664623715e-47
                                ],
                                [
                                    'cubic metre',
                                    'm?',
                                    null,
                                    'volume',
                                    !0,
                                    !0,
                                    1
                                ],
                                [
                                    'cubic mile',
                                    'mi3',
                                    ['mi^3'],
                                    'volume',
                                    !1,
                                    !0,
                                    4168181825.44058
                                ],
                                [
                                    'cubic nautical mile',
                                    'Nmi3',
                                    ['Nmi^3'],
                                    'volume',
                                    !1,
                                    !0,
                                    6352182208
                                ],
                                [
                                    'cubic Pica',
                                    'Pica3',
                                    [
                                        'Picapt3',
                                        'Pica^3',
                                        'Picapt^3'
                                    ],
                                    'volume',
                                    !1,
                                    !0,
                                    7.58660370370369e-8
                                ],
                                [
                                    'cubic yard',
                                    'yd3',
                                    ['yd^3'],
                                    'volume',
                                    !1,
                                    !0,
                                    0.764554857984
                                ],
                                [
                                    'cup',
                                    'cup',
                                    null,
                                    'volume',
                                    !1,
                                    !0,
                                    0.0002365882365
                                ],
                                [
                                    'dalton',
                                    'Da',
                                    ['u'],
                                    'mass',
                                    !1,
                                    !1,
                                    1.66053886282828e-27
                                ],
                                [
                                    'day',
                                    'd',
                                    ['day'],
                                    'time',
                                    !1,
                                    !0,
                                    86400
                                ],
                                [
                                    'degree',
                                    '\xB0',
                                    null,
                                    'angle',
                                    !1,
                                    !1,
                                    0.0174532925199433
                                ],
                                [
                                    'degrees Rankine',
                                    'Rank',
                                    null,
                                    'temperature',
                                    !1,
                                    !0,
                                    0.555555555555556
                                ],
                                [
                                    'dyne',
                                    'dyn',
                                    ['dy'],
                                    'force',
                                    !1,
                                    !0,
                                    0.00001
                                ],
                                [
                                    'electronvolt',
                                    'eV',
                                    ['ev'],
                                    'energy',
                                    !1,
                                    !0,
                                    1.60217656514141
                                ],
                                [
                                    'ell',
                                    'ell',
                                    null,
                                    'length',
                                    !1,
                                    !0,
                                    1.143
                                ],
                                [
                                    'erg',
                                    'erg',
                                    ['e'],
                                    'energy',
                                    !1,
                                    !0,
                                    1e-7
                                ],
                                [
                                    'farad',
                                    'F',
                                    null,
                                    'electric_capacitance',
                                    !0,
                                    !1,
                                    1
                                ],
                                [
                                    'fluid ounce',
                                    'oz',
                                    null,
                                    'volume',
                                    !1,
                                    !0,
                                    0.0000295735295625
                                ],
                                [
                                    'foot',
                                    'ft',
                                    null,
                                    'length',
                                    !1,
                                    !0,
                                    0.3048
                                ],
                                [
                                    'foot-pound',
                                    'flb',
                                    null,
                                    'energy',
                                    !1,
                                    !0,
                                    1.3558179483314
                                ],
                                [
                                    'gal',
                                    'Gal',
                                    null,
                                    'acceleration',
                                    !1,
                                    !1,
                                    0.01
                                ],
                                [
                                    'gallon',
                                    'gal',
                                    null,
                                    'volume',
                                    !1,
                                    !0,
                                    0.003785411784
                                ],
                                [
                                    'gauss',
                                    'G',
                                    ['ga'],
                                    'magnetic_flux_density',
                                    !1,
                                    !0,
                                    1
                                ],
                                [
                                    'grain',
                                    'grain',
                                    null,
                                    'mass',
                                    !1,
                                    !0,
                                    0.0000647989
                                ],
                                [
                                    'gram',
                                    'g',
                                    null,
                                    'mass',
                                    !1,
                                    !0,
                                    0.001
                                ],
                                [
                                    'gray',
                                    'Gy',
                                    null,
                                    'absorbed_dose',
                                    !0,
                                    !1,
                                    1
                                ],
                                [
                                    'gross registered ton',
                                    'GRT',
                                    ['regton'],
                                    'volume',
                                    !1,
                                    !0,
                                    2.8316846592
                                ],
                                [
                                    'hectare',
                                    'ha',
                                    null,
                                    'area',
                                    !1,
                                    !0,
                                    10000
                                ],
                                [
                                    'henry',
                                    'H',
                                    null,
                                    'inductance',
                                    !0,
                                    !1,
                                    1
                                ],
                                [
                                    'hertz',
                                    'Hz',
                                    null,
                                    'frequency',
                                    !0,
                                    !1,
                                    1
                                ],
                                [
                                    'horsepower',
                                    'HP',
                                    ['h'],
                                    'power',
                                    !1,
                                    !0,
                                    745.69987158227
                                ],
                                [
                                    'horsepower-hour',
                                    'HPh',
                                    [
                                        'hh',
                                        'hph'
                                    ],
                                    'energy',
                                    !1,
                                    !0,
                                    2684519.538
                                ],
                                [
                                    'hour',
                                    'h',
                                    ['hr'],
                                    'time',
                                    !1,
                                    !0,
                                    3600
                                ],
                                [
                                    'imperial gallon (U.K.)',
                                    'uk_gal',
                                    null,
                                    'volume',
                                    !1,
                                    !0,
                                    0.00454609
                                ],
                                [
                                    'imperial hundredweight',
                                    'lcwt',
                                    [
                                        'uk_cwt',
                                        'hweight'
                                    ],
                                    'mass',
                                    !1,
                                    !0,
                                    50.802345
                                ],
                                [
                                    'imperial quart (U.K)',
                                    'uk_qt',
                                    null,
                                    'volume',
                                    !1,
                                    !0,
                                    0.0011365225
                                ],
                                [
                                    'imperial ton',
                                    'brton',
                                    [
                                        'uk_ton',
                                        'LTON'
                                    ],
                                    'mass',
                                    !1,
                                    !0,
                                    1016.046909
                                ],
                                [
                                    'inch',
                                    'in',
                                    null,
                                    'length',
                                    !1,
                                    !0,
                                    0.0254
                                ],
                                [
                                    'international acre',
                                    'uk_acre',
                                    null,
                                    'area',
                                    !1,
                                    !0,
                                    4046.8564224
                                ],
                                [
                                    'IT calorie',
                                    'cal',
                                    null,
                                    'energy',
                                    !1,
                                    !0,
                                    4.1868
                                ],
                                [
                                    'joule',
                                    'J',
                                    null,
                                    'energy',
                                    !0,
                                    !0,
                                    1
                                ],
                                [
                                    'katal',
                                    'kat',
                                    null,
                                    'catalytic_activity',
                                    !0,
                                    !1,
                                    1
                                ],
                                [
                                    'kelvin',
                                    'K',
                                    ['kel'],
                                    'temperature',
                                    !0,
                                    !0,
                                    1
                                ],
                                [
                                    'kilogram',
                                    'kg',
                                    null,
                                    'mass',
                                    !0,
                                    !0,
                                    1
                                ],
                                [
                                    'knot',
                                    'kn',
                                    null,
                                    'speed',
                                    !1,
                                    !0,
                                    0.514444444444444
                                ],
                                [
                                    'light-year',
                                    'ly',
                                    null,
                                    'length',
                                    !1,
                                    !0,
                                    9460730472580800
                                ],
                                [
                                    'litre',
                                    'L',
                                    [
                                        'l',
                                        'lt'
                                    ],
                                    'volume',
                                    !1,
                                    !0,
                                    0.001
                                ],
                                [
                                    'lumen',
                                    'lm',
                                    null,
                                    'luminous_flux',
                                    !0,
                                    !1,
                                    1
                                ],
                                [
                                    'lux',
                                    'lx',
                                    null,
                                    'illuminance',
                                    !0,
                                    !1,
                                    1
                                ],
                                [
                                    'maxwell',
                                    'Mx',
                                    null,
                                    'magnetic_flux',
                                    !1,
                                    !1,
                                    1e-18
                                ],
                                [
                                    'measurement ton',
                                    'MTON',
                                    null,
                                    'volume',
                                    !1,
                                    !0,
                                    1.13267386368
                                ],
                                [
                                    'meter per hour',
                                    'm/h',
                                    ['m/hr'],
                                    'speed',
                                    !1,
                                    !0,
                                    0.00027777777777778
                                ],
                                [
                                    'meter per second',
                                    'm/s',
                                    ['m/sec'],
                                    'speed',
                                    !0,
                                    !0,
                                    1
                                ],
                                [
                                    'meter per second squared',
                                    'm?s??',
                                    null,
                                    'acceleration',
                                    !0,
                                    !1,
                                    1
                                ],
                                [
                                    'parsec',
                                    'pc',
                                    ['parsec'],
                                    'length',
                                    !1,
                                    !0,
                                    30856775814671900
                                ],
                                [
                                    'meter squared per second',
                                    'm?/s',
                                    null,
                                    'kinematic_viscosity',
                                    !0,
                                    !1,
                                    1
                                ],
                                [
                                    'metre',
                                    'm',
                                    null,
                                    'length',
                                    !0,
                                    !0,
                                    1
                                ],
                                [
                                    'miles per hour',
                                    'mph',
                                    null,
                                    'speed',
                                    !1,
                                    !0,
                                    0.44704
                                ],
                                [
                                    'millimetre of mercury',
                                    'mmHg',
                                    null,
                                    'pressure',
                                    !1,
                                    !1,
                                    133.322
                                ],
                                [
                                    'minute',
                                    '?',
                                    null,
                                    'angle',
                                    !1,
                                    !1,
                                    0.000290888208665722
                                ],
                                [
                                    'minute',
                                    'min',
                                    ['mn'],
                                    'time',
                                    !1,
                                    !0,
                                    60
                                ],
                                [
                                    'modern teaspoon',
                                    'tspm',
                                    null,
                                    'volume',
                                    !1,
                                    !0,
                                    0.000005
                                ],
                                [
                                    'mole',
                                    'mol',
                                    null,
                                    'amount_of_substance',
                                    !0,
                                    !1,
                                    1
                                ],
                                [
                                    'morgen',
                                    'Morgen',
                                    null,
                                    'area',
                                    !1,
                                    !0,
                                    2500
                                ],
                                [
                                    'n.u. of action',
                                    '?',
                                    null,
                                    'action',
                                    !1,
                                    !1,
                                    1.05457168181818e-34
                                ],
                                [
                                    'n.u. of mass',
                                    'm?',
                                    null,
                                    'mass',
                                    !1,
                                    !1,
                                    9.10938261616162e-31
                                ],
                                [
                                    'n.u. of speed',
                                    'c?',
                                    null,
                                    'speed',
                                    !1,
                                    !1,
                                    299792458
                                ],
                                [
                                    'n.u. of time',
                                    '?/(me?c??)',
                                    null,
                                    'time',
                                    !1,
                                    !1,
                                    1.28808866778687e-21
                                ],
                                [
                                    'nautical mile',
                                    'M',
                                    ['Nmi'],
                                    'length',
                                    !1,
                                    !0,
                                    1852
                                ],
                                [
                                    'newton',
                                    'N',
                                    null,
                                    'force',
                                    !0,
                                    !0,
                                    1
                                ],
                                [
                                    'œrsted',
                                    'Oe ',
                                    null,
                                    'magnetic_field_intensity',
                                    !1,
                                    !1,
                                    79.5774715459477
                                ],
                                [
                                    'ohm',
                                    'Ω',
                                    null,
                                    'electric_resistance',
                                    !0,
                                    !1,
                                    1
                                ],
                                [
                                    'ounce mass',
                                    'ozm',
                                    null,
                                    'mass',
                                    !1,
                                    !0,
                                    0.028349523125
                                ],
                                [
                                    'pascal',
                                    'Pa',
                                    null,
                                    'pressure',
                                    !0,
                                    !1,
                                    1
                                ],
                                [
                                    'pascal second',
                                    'Pa?s',
                                    null,
                                    'dynamic_viscosity',
                                    !0,
                                    !1,
                                    1
                                ],
                                [
                                    'pferdestärke',
                                    'PS',
                                    null,
                                    'power',
                                    !1,
                                    !0,
                                    735.49875
                                ],
                                [
                                    'phot',
                                    'ph',
                                    null,
                                    'illuminance',
                                    !1,
                                    !1,
                                    0.0001
                                ],
                                [
                                    'pica (1/6 inch)',
                                    'pica',
                                    null,
                                    'length',
                                    !1,
                                    !0,
                                    0.00035277777777778
                                ],
                                [
                                    'pica (1/72 inch)',
                                    'Pica',
                                    ['Picapt'],
                                    'length',
                                    !1,
                                    !0,
                                    0.00423333333333333
                                ],
                                [
                                    'poise',
                                    'P',
                                    null,
                                    'dynamic_viscosity',
                                    !1,
                                    !1,
                                    0.1
                                ],
                                [
                                    'pond',
                                    'pond',
                                    null,
                                    'force',
                                    !1,
                                    !0,
                                    0.00980665
                                ],
                                [
                                    'pound force',
                                    'lbf',
                                    null,
                                    'force',
                                    !1,
                                    !0,
                                    4.4482216152605
                                ],
                                [
                                    'pound mass',
                                    'lbm',
                                    null,
                                    'mass',
                                    !1,
                                    !0,
                                    0.45359237
                                ],
                                [
                                    'quart',
                                    'qt',
                                    null,
                                    'volume',
                                    !1,
                                    !0,
                                    0.000946352946
                                ],
                                [
                                    'radian',
                                    'rad',
                                    null,
                                    'angle',
                                    !0,
                                    !1,
                                    1
                                ],
                                [
                                    'second',
                                    '?',
                                    null,
                                    'angle',
                                    !1,
                                    !1,
                                    0.00000484813681109536
                                ],
                                [
                                    'second',
                                    's',
                                    ['sec'],
                                    'time',
                                    !0,
                                    !0,
                                    1
                                ],
                                [
                                    'short hundredweight',
                                    'cwt',
                                    ['shweight'],
                                    'mass',
                                    !1,
                                    !0,
                                    45.359237
                                ],
                                [
                                    'siemens',
                                    'S',
                                    null,
                                    'electrical_conductance',
                                    !0,
                                    !1,
                                    1
                                ],
                                [
                                    'sievert',
                                    'Sv',
                                    null,
                                    'equivalent_dose',
                                    !0,
                                    !1,
                                    1
                                ],
                                [
                                    'slug',
                                    'sg',
                                    null,
                                    'mass',
                                    !1,
                                    !0,
                                    14.59390294
                                ],
                                [
                                    'square ångström',
                                    'ang2',
                                    ['ang^2'],
                                    'area',
                                    !1,
                                    !0,
                                    1e-20
                                ],
                                [
                                    'square foot',
                                    'ft2',
                                    ['ft^2'],
                                    'area',
                                    !1,
                                    !0,
                                    0.09290304
                                ],
                                [
                                    'square inch',
                                    'in2',
                                    ['in^2'],
                                    'area',
                                    !1,
                                    !0,
                                    0.00064516
                                ],
                                [
                                    'square light-year',
                                    'ly2',
                                    ['ly^2'],
                                    'area',
                                    !1,
                                    !0,
                                    8.95054210748189e+31
                                ],
                                [
                                    'square meter',
                                    'm?',
                                    null,
                                    'area',
                                    !0,
                                    !0,
                                    1
                                ],
                                [
                                    'square mile',
                                    'mi2',
                                    ['mi^2'],
                                    'area',
                                    !1,
                                    !0,
                                    2589988.110336
                                ],
                                [
                                    'square nautical mile',
                                    'Nmi2',
                                    ['Nmi^2'],
                                    'area',
                                    !1,
                                    !0,
                                    3429904
                                ],
                                [
                                    'square Pica',
                                    'Pica2',
                                    [
                                        'Picapt2',
                                        'Pica^2',
                                        'Picapt^2'
                                    ],
                                    'area',
                                    !1,
                                    !0,
                                    0.00001792111111111
                                ],
                                [
                                    'square yard',
                                    'yd2',
                                    ['yd^2'],
                                    'area',
                                    !1,
                                    !0,
                                    0.83612736
                                ],
                                [
                                    'statute mile',
                                    'mi',
                                    null,
                                    'length',
                                    !1,
                                    !0,
                                    1609.344
                                ],
                                [
                                    'steradian',
                                    'sr',
                                    null,
                                    'solid_angle',
                                    !0,
                                    !1,
                                    1
                                ],
                                [
                                    'stilb',
                                    'sb',
                                    null,
                                    'luminance',
                                    !1,
                                    !1,
                                    0.0001
                                ],
                                [
                                    'stokes',
                                    'St',
                                    null,
                                    'kinematic_viscosity',
                                    !1,
                                    !1,
                                    0.0001
                                ],
                                [
                                    'stone',
                                    'stone',
                                    null,
                                    'mass',
                                    !1,
                                    !0,
                                    6.35029318
                                ],
                                [
                                    'tablespoon',
                                    'tbs',
                                    null,
                                    'volume',
                                    !1,
                                    !0,
                                    0.0000147868
                                ],
                                [
                                    'teaspoon',
                                    'tsp',
                                    null,
                                    'volume',
                                    !1,
                                    !0,
                                    0.00000492892
                                ],
                                [
                                    'tesla',
                                    'T',
                                    null,
                                    'magnetic_flux_density',
                                    !0,
                                    !0,
                                    1
                                ],
                                [
                                    'thermodynamic calorie',
                                    'c',
                                    null,
                                    'energy',
                                    !1,
                                    !0,
                                    4.184
                                ],
                                [
                                    'ton',
                                    'ton',
                                    null,
                                    'mass',
                                    !1,
                                    !0,
                                    907.18474
                                ],
                                [
                                    'tonne',
                                    't',
                                    null,
                                    'mass',
                                    !1,
                                    !1,
                                    1000
                                ],
                                [
                                    'U.K. pint',
                                    'uk_pt',
                                    null,
                                    'volume',
                                    !1,
                                    !0,
                                    0.00056826125
                                ],
                                [
                                    'U.S. bushel',
                                    'bushel',
                                    null,
                                    'volume',
                                    !1,
                                    !0,
                                    0.03523907
                                ],
                                [
                                    'U.S. oil barrel',
                                    'barrel',
                                    null,
                                    'volume',
                                    !1,
                                    !0,
                                    0.158987295
                                ],
                                [
                                    'U.S. pint',
                                    'pt',
                                    ['us_pt'],
                                    'volume',
                                    !1,
                                    !0,
                                    0.000473176473
                                ],
                                [
                                    'U.S. survey mile',
                                    'survey_mi',
                                    null,
                                    'length',
                                    !1,
                                    !0,
                                    1609.347219
                                ],
                                [
                                    'U.S. survey/statute acre',
                                    'us_acre',
                                    null,
                                    'area',
                                    !1,
                                    !0,
                                    4046.87261
                                ],
                                [
                                    'volt',
                                    'V',
                                    null,
                                    'voltage',
                                    !0,
                                    !1,
                                    1
                                ],
                                [
                                    'watt',
                                    'W',
                                    null,
                                    'power',
                                    !0,
                                    !0,
                                    1
                                ],
                                [
                                    'watt-hour',
                                    'Wh',
                                    ['wh'],
                                    'energy',
                                    !1,
                                    !0,
                                    3600
                                ],
                                [
                                    'weber',
                                    'Wb',
                                    null,
                                    'magnetic_flux',
                                    !0,
                                    !1,
                                    1
                                ],
                                [
                                    'yard',
                                    'yd',
                                    null,
                                    'length',
                                    !1,
                                    !0,
                                    0.9144
                                ],
                                [
                                    'year',
                                    'yr',
                                    null,
                                    'time',
                                    !1,
                                    !0,
                                    31557600
                                ]
                            ], f = {
                                Yi: [
                                    'yobi',
                                    80,
                                    1.2089258196146292e+24,
                                    'Yi',
                                    'yotta'
                                ],
                                Zi: [
                                    'zebi',
                                    70,
                                    1.1805916207174113e+21,
                                    'Zi',
                                    'zetta'
                                ],
                                Ei: [
                                    'exbi',
                                    60,
                                    1152921504606847000,
                                    'Ei',
                                    'exa'
                                ],
                                Pi: [
                                    'pebi',
                                    50,
                                    1125899906842624,
                                    'Pi',
                                    'peta'
                                ],
                                Ti: [
                                    'tebi',
                                    40,
                                    1099511627776,
                                    'Ti',
                                    'tera'
                                ],
                                Gi: [
                                    'gibi',
                                    30,
                                    1073741824,
                                    'Gi',
                                    'giga'
                                ],
                                Mi: [
                                    'mebi',
                                    20,
                                    1048576,
                                    'Mi',
                                    'mega'
                                ],
                                ki: [
                                    'kibi',
                                    10,
                                    1024,
                                    'ki',
                                    'kilo'
                                ]
                            }, k = {
                                Y: [
                                    'yotta',
                                    1e+24,
                                    'Y'
                                ],
                                Z: [
                                    'zetta',
                                    1e+21,
                                    'Z'
                                ],
                                E: [
                                    'exa',
                                    1000000000000000000,
                                    'E'
                                ],
                                P: [
                                    'peta',
                                    1000000000000000,
                                    'P'
                                ],
                                T: [
                                    'tera',
                                    1000000000000,
                                    'T'
                                ],
                                G: [
                                    'giga',
                                    1000000000,
                                    'G'
                                ],
                                M: [
                                    'mega',
                                    1000000,
                                    'M'
                                ],
                                k: [
                                    'kilo',
                                    1000,
                                    'k'
                                ],
                                h: [
                                    'hecto',
                                    100,
                                    'h'
                                ],
                                e: [
                                    'dekao',
                                    10,
                                    'e'
                                ],
                                d: [
                                    'deci',
                                    0.1,
                                    'd'
                                ],
                                c: [
                                    'centi',
                                    0.01,
                                    'c'
                                ],
                                m: [
                                    'milli',
                                    0.001,
                                    'm'
                                ],
                                u: [
                                    'micro',
                                    0.000001,
                                    'u'
                                ],
                                n: [
                                    'nano',
                                    1e-9,
                                    'n'
                                ],
                                p: [
                                    'pico',
                                    1e-12,
                                    'p'
                                ],
                                f: [
                                    'femto',
                                    1e-15,
                                    'f'
                                ],
                                a: [
                                    'atto',
                                    1e-18,
                                    'a'
                                ],
                                z: [
                                    'zepto',
                                    1e-21,
                                    'z'
                                ],
                                y: [
                                    'yocto',
                                    1e-24,
                                    'y'
                                ]
                            }, l = null, m = null, n = a, r = c, u = 1, w = 1, x, v = 0; v < d.length; v++) {
                        x = null === d[v][2] ? [] : d[v][2];
                        if (d[v][1] === n || 0 <= x.indexOf(n))
                            l = d[v];
                        if (d[v][1] === r || 0 <= x.indexOf(r))
                            m = d[v];
                    }
                    if (null === l)
                        for (x = f[a.substring(0, 2)], v = k[a.substring(0, 1)], 'da' === a.substring(0, 2) && (v = [
                                'dekao',
                                10,
                                'da'
                            ]), x ? (u = x[2], n = a.substring(2)) : v && (u = v[1], n = a.substring(v[2].length)), a = 0; a < d.length; a++)
                            if (x = null === d[a][2] ? [] : d[a][2], d[a][1] === n || 0 <= x.indexOf(n))
                                l = d[a];
                    if (null === m)
                        for (f = f[c.substring(0, 2)], k = k[c.substring(0, 1)], 'da' === c.substring(0, 2) && (k = [
                                'dekao',
                                10,
                                'da'
                            ]), f ? (w = f[2], r = c.substring(2)) : k && (w = k[1], r = c.substring(k[2].length)), c = 0; c < d.length; c++)
                            if (x = null === d[c][2] ? [] : d[c][2], d[c][1] === r || 0 <= x.indexOf(r))
                                m = d[c];
                    return null === l || null === m || l[3] !== m[3] ? h.na : b * l[6] * u / (m[6] * w);
                },
                DEC2BIN: function (b, a) {
                    b = e.parseNumber(b);
                    if (b instanceof Error)
                        return b;
                    if (!/^-?[0-9]{1,3}$/.test(b) || -512 > b || 511 < b)
                        return h.num;
                    if (0 > b)
                        return '1' + REPT('0', 9 - (512 + b).toString(2).length) + (512 + b).toString(2);
                    b = parseInt(b, 10).toString(2);
                    if ('undefined' === typeof a)
                        return b;
                    if (isNaN(a))
                        return h.value;
                    if (0 > a)
                        return h.num;
                    a = Math.floor(a);
                    return a >= b.length ? REPT('0', a - b.length) + b : h.num;
                },
                DEC2HEX: function (b, a) {
                    b = e.parseNumber(b);
                    if (b instanceof Error)
                        return b;
                    if (!/^-?[0-9]{1,12}$/.test(b) || -549755813888 > b || 549755813887 < b)
                        return h.num;
                    if (0 > b)
                        return (1099511627776 + b).toString(16);
                    b = parseInt(b, 10).toString(16);
                    if ('undefined' === typeof a)
                        return b;
                    if (isNaN(a))
                        return h.value;
                    if (0 > a)
                        return h.num;
                    a = Math.floor(a);
                    return a >= b.length ? REPT('0', a - b.length) + b : h.num;
                },
                DEC2OCT: function (b, a) {
                    b = e.parseNumber(b);
                    if (b instanceof Error)
                        return b;
                    if (!/^-?[0-9]{1,9}$/.test(b) || -536870912 > b || 536870911 < b)
                        return h.num;
                    if (0 > b)
                        return (1073741824 + b).toString(8);
                    b = parseInt(b, 10).toString(8);
                    if ('undefined' === typeof a)
                        return b;
                    if (isNaN(a))
                        return h.value;
                    if (0 > a)
                        return h.num;
                    a = Math.floor(a);
                    return a >= b.length ? REPT('0', a - b.length) + b : h.num;
                },
                DELTA: function (b, a) {
                    a = void 0 === a ? 0 : a;
                    b = e.parseNumber(b);
                    a = e.parseNumber(a);
                    return e.anyIsError(b, a) ? h.value : b === a ? 1 : 0;
                },
                ERF: function (b, a) {
                }
            };
            g.ERF.PRECISE = function () {
            };
            g.ERFC = function (b) {
            };
            g.ERFC.PRECISE = function () {
            };
            g.GESTEP = function (b, a) {
                a = a || 0;
                b = e.parseNumber(b);
                return e.anyIsError(a, b) ? b : b >= a ? 1 : 0;
            };
            g.HEX2BIN = function (b, a) {
                if (!/^[0-9A-Fa-f]{1,10}$/.test(b))
                    return h.num;
                var c = 10 === b.length && 'f' === b.substring(0, 1).toLowerCase() ? !0 : !1;
                b = c ? parseInt(b, 16) - 1099511627776 : parseInt(b, 16);
                if (-512 > b || 511 < b)
                    return h.num;
                if (c)
                    return '1' + REPT('0', 9 - (512 + b).toString(2).length) + (512 + b).toString(2);
                c = b.toString(2);
                if (void 0 === a)
                    return c;
                if (isNaN(a))
                    return h.value;
                if (0 > a)
                    return h.num;
                a = Math.floor(a);
                return a >= c.length ? REPT('0', a - c.length) + c : h.num;
            };
            g.HEX2DEC = function (b) {
                if (!/^[0-9A-Fa-f]{1,10}$/.test(b))
                    return h.num;
                b = parseInt(b, 16);
                return 549755813888 <= b ? b - 1099511627776 : b;
            };
            g.HEX2OCT = function (b, a) {
                if (!/^[0-9A-Fa-f]{1,10}$/.test(b))
                    return h.num;
                b = parseInt(b, 16);
                if (536870911 < b && 1098974756864 > b)
                    return h.num;
                if (1098974756864 <= b)
                    return (b - 1098437885952).toString(8);
                b = b.toString(8);
                if (void 0 === a)
                    return b;
                if (isNaN(a))
                    return h.value;
                if (0 > a)
                    return h.num;
                a = Math.floor(a);
                return a >= b.length ? REPT('0', a - b.length) + b : h.num;
            };
            g.IMABS = function (b) {
                var a = g.IMREAL(b);
                b = g.IMAGINARY(b);
                return e.anyIsError(a, b) ? h.value : Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
            };
            g.IMAGINARY = function (b) {
                if (void 0 === b || !0 === b || !1 === b)
                    return h.value;
                if (0 === b || '0' === b)
                    return 0;
                if (0 <= [
                        'i',
                        'j'
                    ].indexOf(b))
                    return 1;
                b = b.replace('+i', '+1i').replace('-i', '-1i').replace('+j', '+1j').replace('-j', '-1j');
                var a = b.indexOf('+'), c = b.indexOf('-');
                0 === a && (a = b.indexOf('+', 1));
                0 === c && (c = b.indexOf('-', 1));
                var d = b.substring(b.length - 1, b.length);
                d = 'i' === d || 'j' === d;
                return 0 <= a || 0 <= c ? d ? 0 <= a ? isNaN(b.substring(0, a)) || isNaN(b.substring(a + 1, b.length - 1)) ? h.num : Number(b.substring(a + 1, b.length - 1)) : isNaN(b.substring(0, c)) || isNaN(b.substring(c + 1, b.length - 1)) ? h.num : -Number(b.substring(c + 1, b.length - 1)) : h.num : d ? isNaN(b.substring(0, b.length - 1)) ? h.num : b.substring(0, b.length - 1) : isNaN(b) ? h.num : 0;
            };
            g.IMARGUMENT = function (b) {
                var a = g.IMREAL(b);
                b = g.IMAGINARY(b);
                return e.anyIsError(a, b) ? h.value : 0 === a && 0 === b ? h.div0 : 0 === a && 0 < b ? Math.PI / 2 : 0 === a && 0 > b ? -Math.PI / 2 : 0 === b && 0 < a ? 0 : 0 === b && 0 > a ? -Math.PI : 0 < a ? Math.atan(b / a) : 0 > a && 0 <= b ? Math.atan(b / a) + Math.PI : Math.atan(b / a) - Math.PI;
            };
            g.IMCONJUGATE = function (b) {
                var a = g.IMREAL(b), c = g.IMAGINARY(b);
                if (e.anyIsError(a, c))
                    return h.value;
                var d = b.substring(b.length - 1);
                return 0 !== c ? g.COMPLEX(a, -c, 'i' === d || 'j' === d ? d : 'i') : b;
            };
            g.IMCOS = function (b) {
                var a = g.IMREAL(b), c = g.IMAGINARY(b);
                if (e.anyIsError(a, c))
                    return h.value;
                b = b.substring(b.length - 1);
                return g.COMPLEX(Math.cos(a) * (Math.exp(c) + Math.exp(-c)) / 2, -Math.sin(a) * (Math.exp(c) - Math.exp(-c)) / 2, 'i' === b || 'j' === b ? b : 'i');
            };
            g.IMCOSH = function (b) {
                var a = g.IMREAL(b), c = g.IMAGINARY(b);
                if (e.anyIsError(a, c))
                    return h.value;
                b = b.substring(b.length - 1);
                return g.COMPLEX(Math.cos(c) * (Math.exp(a) + Math.exp(-a)) / 2, Math.sin(c) * (Math.exp(a) - Math.exp(-a)) / 2, 'i' === b || 'j' === b ? b : 'i');
            };
            g.IMCOT = function (b) {
                var a = g.IMREAL(b), c = g.IMAGINARY(b);
                return e.anyIsError(a, c) ? h.value : g.IMDIV(g.IMCOS(b), g.IMSIN(b));
            };
            g.IMDIV = function (b, a) {
                var c = g.IMREAL(b), d = g.IMAGINARY(b), f = g.IMREAL(a), k = g.IMAGINARY(a);
                if (e.anyIsError(c, d, f, k))
                    return h.value;
                b = b.substring(b.length - 1);
                var l = a.substring(a.length - 1);
                a = 'i';
                'j' === b ? a = 'j' : 'j' === l && (a = 'j');
                if (0 === f && 0 === k)
                    return h.num;
                b = f * f + k * k;
                return g.COMPLEX((c * f + d * k) / b, (d * f - c * k) / b, a);
            };
            g.IMEXP = function (b) {
                var a = g.IMREAL(b), c = g.IMAGINARY(b);
                if (e.anyIsError(a, c))
                    return h.value;
                b = b.substring(b.length - 1);
                a = Math.exp(a);
                return g.COMPLEX(a * Math.cos(c), a * Math.sin(c), 'i' === b || 'j' === b ? b : 'i');
            };
            g.IMLN = function (b) {
                var a = g.IMREAL(b), c = g.IMAGINARY(b);
                if (e.anyIsError(a, c))
                    return h.value;
                b = b.substring(b.length - 1);
                return g.COMPLEX(Math.log(Math.sqrt(a * a + c * c)), Math.atan(c / a), 'i' === b || 'j' === b ? b : 'i');
            };
            g.IMLOG10 = function (b) {
                var a = g.IMREAL(b), c = g.IMAGINARY(b);
                if (e.anyIsError(a, c))
                    return h.value;
                b = b.substring(b.length - 1);
                return g.COMPLEX(Math.log(Math.sqrt(a * a + c * c)) / Math.log(10), Math.atan(c / a) / Math.log(10), 'i' === b || 'j' === b ? b : 'i');
            };
            g.IMLOG2 = function (b) {
                var a = g.IMREAL(b), c = g.IMAGINARY(b);
                if (e.anyIsError(a, c))
                    return h.value;
                b = b.substring(b.length - 1);
                return g.COMPLEX(Math.log(Math.sqrt(a * a + c * c)) / Math.log(2), Math.atan(c / a) / Math.log(2), 'i' === b || 'j' === b ? b : 'i');
            };
            g.IMPOWER = function (b, a) {
                a = e.parseNumber(a);
                var c = g.IMREAL(b), d = g.IMAGINARY(b);
                if (e.anyIsError(a, c, d))
                    return h.value;
                c = b.substring(b.length - 1);
                c = 'i' === c || 'j' === c ? c : 'i';
                d = Math.pow(g.IMABS(b), a);
                b = g.IMARGUMENT(b);
                return g.COMPLEX(d * Math.cos(a * b), d * Math.sin(a * b), c);
            };
            g.IMPRODUCT = function () {
                for (var b = arguments[0], a = 1; a < arguments.length; a++) {
                    var c = g.IMREAL(b);
                    b = g.IMAGINARY(b);
                    var d = g.IMREAL(arguments[a]), f = g.IMAGINARY(arguments[a]);
                    if (e.anyIsError(c, b, d, f))
                        return h.value;
                    b = g.COMPLEX(c * d - b * f, c * f + b * d);
                }
                return b;
            };
            g.IMREAL = function (b) {
                if (void 0 === b || !0 === b || !1 === b)
                    return h.value;
                if (0 === b || '0' === b || 0 <= 'i +i 1i +1i -i -1i j +j 1j +1j -j -1j'.split(' ').indexOf(b))
                    return 0;
                var a = b.indexOf('+'), c = b.indexOf('-');
                0 === a && (a = b.indexOf('+', 1));
                0 === c && (c = b.indexOf('-', 1));
                var d = b.substring(b.length - 1, b.length);
                d = 'i' === d || 'j' === d;
                return 0 <= a || 0 <= c ? d ? 0 <= a ? isNaN(b.substring(0, a)) || isNaN(b.substring(a + 1, b.length - 1)) ? h.num : Number(b.substring(0, a)) : isNaN(b.substring(0, c)) || isNaN(b.substring(c + 1, b.length - 1)) ? h.num : Number(b.substring(0, c)) : h.num : d ? isNaN(b.substring(0, b.length - 1)) ? h.num : 0 : isNaN(b) ? h.num : b;
            };
            g.IMSEC = function (b) {
                if (!0 === b || !1 === b)
                    return h.value;
                var a = g.IMREAL(b), c = g.IMAGINARY(b);
                return e.anyIsError(a, c) ? h.value : g.IMDIV('1', g.IMCOS(b));
            };
            g.IMSECH = function (b) {
                var a = g.IMREAL(b), c = g.IMAGINARY(b);
                return e.anyIsError(a, c) ? h.value : g.IMDIV('1', g.IMCOSH(b));
            };
            g.IMSIN = function (b) {
                var a = g.IMREAL(b), c = g.IMAGINARY(b);
                if (e.anyIsError(a, c))
                    return h.value;
                b = b.substring(b.length - 1);
                return g.COMPLEX(Math.sin(a) * (Math.exp(c) + Math.exp(-c)) / 2, Math.cos(a) * (Math.exp(c) - Math.exp(-c)) / 2, 'i' === b || 'j' === b ? b : 'i');
            };
            g.IMSINH = function (b) {
                var a = g.IMREAL(b), c = g.IMAGINARY(b);
                if (e.anyIsError(a, c))
                    return h.value;
                b = b.substring(b.length - 1);
                return g.COMPLEX(Math.cos(c) * (Math.exp(a) - Math.exp(-a)) / 2, Math.sin(c) * (Math.exp(a) + Math.exp(-a)) / 2, 'i' === b || 'j' === b ? b : 'i');
            };
            g.IMSQRT = function (b) {
                var a = g.IMREAL(b), c = g.IMAGINARY(b);
                if (e.anyIsError(a, c))
                    return h.value;
                a = b.substring(b.length - 1);
                a = 'i' === a || 'j' === a ? a : 'i';
                c = Math.sqrt(g.IMABS(b));
                b = g.IMARGUMENT(b);
                return g.COMPLEX(c * Math.cos(b / 2), c * Math.sin(b / 2), a);
            };
            g.IMCSC = function (b) {
                if (!0 === b || !1 === b)
                    return h.value;
                var a = g.IMREAL(b), c = g.IMAGINARY(b);
                return e.anyIsError(a, c) ? h.num : g.IMDIV('1', g.IMSIN(b));
            };
            g.IMCSCH = function (b) {
                if (!0 === b || !1 === b)
                    return h.value;
                var a = g.IMREAL(b), c = g.IMAGINARY(b);
                return e.anyIsError(a, c) ? h.num : g.IMDIV('1', g.IMSINH(b));
            };
            g.IMSUB = function (b, a) {
                var c = this.IMREAL(b), d = this.IMAGINARY(b), f = this.IMREAL(a), k = this.IMAGINARY(a);
                if (e.anyIsError(c, d, f, k))
                    return h.value;
                b = b.substring(b.length - 1);
                a = a.substring(a.length - 1);
                var l = 'i';
                'j' === b ? l = 'j' : 'j' === a && (l = 'j');
                return this.COMPLEX(c - f, d - k, l);
            };
            g.IMSUM = function () {
                for (var b = e.flatten(arguments), a = b[0], c = 1; c < b.length; c++) {
                    var d = this.IMREAL(a);
                    a = this.IMAGINARY(a);
                    var f = this.IMREAL(b[c]), k = this.IMAGINARY(b[c]);
                    if (e.anyIsError(d, a, f, k))
                        return h.value;
                    a = this.COMPLEX(d + f, a + k);
                }
                return a;
            };
            g.IMTAN = function (b) {
                if (!0 === b || !1 === b)
                    return h.value;
                var a = g.IMREAL(b), c = g.IMAGINARY(b);
                return e.anyIsError(a, c) ? h.value : this.IMDIV(this.IMSIN(b), this.IMCOS(b));
            };
            g.OCT2BIN = function (b, a) {
                if (!/^[0-7]{1,10}$/.test(b))
                    return h.num;
                var c = 10 === b.length && '7' === b.substring(0, 1) ? !0 : !1;
                b = c ? parseInt(b, 8) - 1073741824 : parseInt(b, 8);
                if (-512 > b || 511 < b)
                    return h.num;
                if (c)
                    return '1' + REPT('0', 9 - (512 + b).toString(2).length) + (512 + b).toString(2);
                c = b.toString(2);
                if ('undefined' === typeof a)
                    return c;
                if (isNaN(a))
                    return h.value;
                if (0 > a)
                    return h.num;
                a = Math.floor(a);
                return a >= c.length ? REPT('0', a - c.length) + c : h.num;
            };
            g.OCT2DEC = function (b) {
                if (!/^[0-7]{1,10}$/.test(b))
                    return h.num;
                b = parseInt(b, 8);
                return 536870912 <= b ? b - 1073741824 : b;
            };
            g.OCT2HEX = function (b, a) {
                if (!/^[0-7]{1,10}$/.test(b))
                    return h.num;
                b = parseInt(b, 8);
                if (536870912 <= b)
                    return 'ff' + (b + 3221225472).toString(16);
                b = b.toString(16);
                if (void 0 === a)
                    return b;
                if (isNaN(a))
                    return h.value;
                if (0 > a)
                    return h.num;
                a = Math.floor(a);
                return a >= b.length ? REPT('0', a - b.length) + b : h.num;
            };
            return g;
        }();
        t.financial = function () {
            function g(c) {
                return c && c.getTime && !isNaN(c.getTime());
            }
            function b(c) {
                return c instanceof Date ? c : new Date(c);
            }
            var a = {
                ACCRINT: function (c, d, f, k, l, m, n) {
                    c = b(c);
                    d = b(d);
                    f = b(f);
                    return g(c) && g(d) && g(f) ? 0 >= k || 0 >= l || -1 === [
                        1,
                        2,
                        4
                    ].indexOf(m) || -1 === [
                        0,
                        1,
                        2,
                        3,
                        4
                    ].indexOf(n) || f <= c ? '#NUM!' : (l || 0) * k * YEARFRAC(c, f, n || 0) : '#VALUE!';
                },
                ACCRINTM: null,
                AMORDEGRC: null,
                AMORLINC: null,
                COUPDAYBS: null,
                COUPDAYS: null,
                COUPDAYSNC: null,
                COUPNCD: null,
                COUPNUM: null,
                COUPPCD: null,
                CUMIPMT: function (c, d, f, k, l, m) {
                    c = e.parseNumber(c);
                    d = e.parseNumber(d);
                    f = e.parseNumber(f);
                    if (e.anyIsError(c, d, f))
                        return h.value;
                    if (0 >= c || 0 >= d || 0 >= f || 1 > k || 1 > l || k > l || 0 !== m && 1 !== m)
                        return h.num;
                    d = a.PMT(c, d, f, 0, m);
                    var n = 0;
                    1 === k && 0 === m && (n = -f, k++);
                    for (; k <= l; k++)
                        n = 1 === m ? n + (a.FV(c, k - 2, d, f, 1) - d) : n + a.FV(c, k - 1, d, f, 0);
                    return n * c;
                },
                CUMPRINC: function (c, d, f, k, l, m) {
                    c = e.parseNumber(c);
                    d = e.parseNumber(d);
                    f = e.parseNumber(f);
                    if (e.anyIsError(c, d, f))
                        return h.value;
                    if (0 >= c || 0 >= d || 0 >= f || 1 > k || 1 > l || k > l || 0 !== m && 1 !== m)
                        return h.num;
                    d = a.PMT(c, d, f, 0, m);
                    var n = 0;
                    1 === k && (n = 0 === m ? d + f * c : d, k++);
                    for (; k <= l; k++)
                        n = 0 < m ? n + (d - (a.FV(c, k - 2, d, f, 1) - d) * c) : n + (d - a.FV(c, k - 1, d, f, 0) * c);
                    return n;
                },
                DB: function (c, d, f, k, l) {
                    l = void 0 === l ? 12 : l;
                    c = e.parseNumber(c);
                    d = e.parseNumber(d);
                    f = e.parseNumber(f);
                    k = e.parseNumber(k);
                    l = e.parseNumber(l);
                    if (e.anyIsError(c, d, f, k, l))
                        return h.value;
                    if (0 > c || 0 > d || 0 > f || 0 > k || -1 === [
                            1,
                            2,
                            3,
                            4,
                            5,
                            6,
                            7,
                            8,
                            9,
                            10,
                            11,
                            12
                        ].indexOf(l) || k > f)
                        return h.num;
                    if (d >= c)
                        return 0;
                    d = (1 - Math.pow(d / c, 1 / f)).toFixed(3);
                    for (var m = l = c * d * l / 12, n = 0, r = k === f ? f - 1 : k, u = 2; u <= r; u++)
                        n = (c - m) * d, m += n;
                    return 1 === k ? l : k === f ? (c - m) * d : n;
                },
                DDB: function (c, d, f, k, l) {
                    l = void 0 === l ? 2 : l;
                    c = e.parseNumber(c);
                    d = e.parseNumber(d);
                    f = e.parseNumber(f);
                    k = e.parseNumber(k);
                    l = e.parseNumber(l);
                    if (e.anyIsError(c, d, f, k, l))
                        return h.value;
                    if (0 > c || 0 > d || 0 > f || 0 > k || 0 >= l || k > f)
                        return h.num;
                    if (d >= c)
                        return 0;
                    for (var m = 0, n = 0, r = 1; r <= k; r++)
                        n = Math.min(l / f * (c - m), c - d - m), m += n;
                    return n;
                },
                DISC: null,
                DOLLARDE: function (c, d) {
                    c = e.parseNumber(c);
                    d = e.parseNumber(d);
                    if (e.anyIsError(c, d))
                        return h.value;
                    if (0 > d)
                        return h.num;
                    if (0 <= d && 1 > d)
                        return h.div0;
                    d = parseInt(d, 10);
                    var f = parseInt(c, 10);
                    f += c % 1 * Math.pow(10, Math.ceil(Math.log(d) / Math.LN10)) / d;
                    c = Math.pow(10, Math.ceil(Math.log(d) / Math.LN2) + 1);
                    return f = Math.round(f * c) / c;
                },
                DOLLARFR: function (c, d) {
                    c = e.parseNumber(c);
                    d = e.parseNumber(d);
                    if (e.anyIsError(c, d))
                        return h.value;
                    if (0 > d)
                        return h.num;
                    if (0 <= d && 1 > d)
                        return h.div0;
                    d = parseInt(d, 10);
                    var f = parseInt(c, 10);
                    return f += c % 1 * Math.pow(10, -Math.ceil(Math.log(d) / Math.LN10)) * d;
                },
                DURATION: null,
                EFFECT: function (c, d) {
                    c = e.parseNumber(c);
                    d = e.parseNumber(d);
                    if (e.anyIsError(c, d))
                        return h.value;
                    if (0 >= c || 1 > d)
                        return h.num;
                    d = parseInt(d, 10);
                    return Math.pow(1 + c / d, d) - 1;
                },
                FV: function (c, d, f, k, l) {
                    k = k || 0;
                    l = l || 0;
                    c = e.parseNumber(c);
                    d = e.parseNumber(d);
                    f = e.parseNumber(f);
                    k = e.parseNumber(k);
                    l = e.parseNumber(l);
                    if (e.anyIsError(c, d, f, k, l))
                        return h.value;
                    0 === c ? c = k + f * d : (d = Math.pow(1 + c, d), c = 1 === l ? k * d + f * (1 + c) * (d - 1) / c : k * d + f * (d - 1) / c);
                    return -c;
                },
                FVSCHEDULE: function (c, d) {
                    c = e.parseNumber(c);
                    d = e.parseNumberArray(e.flatten(d));
                    if (e.anyIsError(c, d))
                        return h.value;
                    for (var f = d.length, k = 0; k < f; k++)
                        c *= 1 + d[k];
                    return c;
                },
                INTRATE: null,
                IPMT: function (c, d, f, k, l, m) {
                    l = l || 0;
                    m = m || 0;
                    c = e.parseNumber(c);
                    d = e.parseNumber(d);
                    f = e.parseNumber(f);
                    k = e.parseNumber(k);
                    l = e.parseNumber(l);
                    m = e.parseNumber(m);
                    if (e.anyIsError(c, d, f, k, l, m))
                        return h.value;
                    f = a.PMT(c, f, k, l, m);
                    return (1 === d ? 1 === m ? 0 : -k : 1 === m ? a.FV(c, d - 2, f, k, 1) - f : a.FV(c, d - 1, f, k, 0)) * c;
                },
                IRR: function (c, d) {
                    d = d || 0;
                    c = e.parseNumberArray(e.flatten(c));
                    d = e.parseNumber(d);
                    if (e.anyIsError(c, d))
                        return h.value;
                    for (var f = function (u, w, x) {
                                x += 1;
                                for (var v = u[0], y = 1; y < u.length; y++)
                                    v += u[y] / Math.pow(x, (w[y] - w[0]) / 365);
                                return v;
                            }, k = function (u, w, x) {
                                x += 1;
                                for (var v = 0, y = 1; y < u.length; y++) {
                                    var E = (w[y] - w[0]) / 365;
                                    v -= E * u[y] / Math.pow(x, E + 1);
                                }
                                return v;
                            }, l = [], m = !1, n = !1, r = 0; r < c.length; r++)
                        l[r] = 0 === r ? 0 : l[r - 1] + 365, 0 < c[r] && (m = !0), 0 > c[r] && (n = !0);
                    if (!m || !n)
                        return h.num;
                    d = void 0 === d ? 0.1 : d;
                    m = !0;
                    do
                        r = f(c, l, d), m = d - r / k(c, l, d), n = Math.abs(m - d), d = m, m = 1e-10 < n && 1e-10 < Math.abs(r);
                    while (m);
                    return d;
                },
                ISPMT: function (c, d, f, k) {
                    c = e.parseNumber(c);
                    d = e.parseNumber(d);
                    f = e.parseNumber(f);
                    k = e.parseNumber(k);
                    return e.anyIsError(c, d, f, k) ? h.value : k * c * (d / f - 1);
                },
                MDURATION: null,
                MIRR: function (c, d, f) {
                    c = e.parseNumberArray(e.flatten(c));
                    d = e.parseNumber(d);
                    f = e.parseNumber(f);
                    if (e.anyIsError(c, d, f))
                        return h.value;
                    for (var k = c.length, l = [], m = [], n = 0; n < k; n++)
                        0 > c[n] ? l.push(c[n]) : m.push(c[n]);
                    c = -a.NPV(f, m) * Math.pow(1 + f, k - 1);
                    d = a.NPV(d, l) * (1 + d);
                    return Math.pow(c / d, 1 / (k - 1)) - 1;
                },
                NOMINAL: function (c, d) {
                    c = e.parseNumber(c);
                    d = e.parseNumber(d);
                    if (e.anyIsError(c, d))
                        return h.value;
                    if (0 >= c || 1 > d)
                        return h.num;
                    d = parseInt(d, 10);
                    return (Math.pow(c + 1, 1 / d) - 1) * d;
                },
                NPER: function (c, d, f, k, l) {
                    l = void 0 === l ? 0 : l;
                    k = void 0 === k ? 0 : k;
                    c = e.parseNumber(c);
                    d = e.parseNumber(d);
                    f = e.parseNumber(f);
                    k = e.parseNumber(k);
                    l = e.parseNumber(l);
                    return e.anyIsError(c, d, f, k, l) ? h.value : Math.log((d * (1 + c * l) - k * c) / (f * c + d * (1 + c * l))) / Math.log(1 + c);
                },
                NPV: function () {
                    var c = e.parseNumberArray(e.flatten(arguments));
                    if (c instanceof Error)
                        return c;
                    for (var d = c[0], f = 0, k = 1; k < c.length; k++)
                        f += c[k] / Math.pow(1 + d, k);
                    return f;
                },
                ODDFPRICE: null,
                ODDFYIELD: null,
                ODDLPRICE: null,
                ODDLYIELD: null,
                PDURATION: function (c, d, f) {
                    c = e.parseNumber(c);
                    d = e.parseNumber(d);
                    f = e.parseNumber(f);
                    return e.anyIsError(c, d, f) ? h.value : 0 >= c ? h.num : (Math.log(f) - Math.log(d)) / Math.log(1 + c);
                },
                PMT: function (c, d, f, k, l) {
                    k = k || 0;
                    l = l || 0;
                    c = e.parseNumber(c);
                    d = e.parseNumber(d);
                    f = e.parseNumber(f);
                    k = e.parseNumber(k);
                    l = e.parseNumber(l);
                    if (e.anyIsError(c, d, f, k, l))
                        return h.value;
                    0 === c ? c = (f + k) / d : (d = Math.pow(1 + c, d), c = 1 === l ? (k * c / (d - 1) + f * c / (1 - 1 / d)) / (1 + c) : k * c / (d - 1) + f * c / (1 - 1 / d));
                    return -c;
                },
                PPMT: function (c, d, f, k, l, m) {
                    l = l || 0;
                    m = m || 0;
                    c = e.parseNumber(c);
                    f = e.parseNumber(f);
                    k = e.parseNumber(k);
                    l = e.parseNumber(l);
                    m = e.parseNumber(m);
                    return e.anyIsError(c, f, k, l, m) ? h.value : a.PMT(c, f, k, l, m) - a.IPMT(c, d, f, k, l, m);
                },
                PRICE: null,
                PRICEDISC: null,
                PRICEMAT: null,
                PV: function (c, d, f, k, l) {
                    k = k || 0;
                    l = l || 0;
                    c = e.parseNumber(c);
                    d = e.parseNumber(d);
                    f = e.parseNumber(f);
                    k = e.parseNumber(k);
                    l = e.parseNumber(l);
                    return e.anyIsError(c, d, f, k, l) ? h.value : 0 === c ? -f * d - k : ((1 - Math.pow(1 + c, d)) / c * f * (1 + c * l) - k) / Math.pow(1 + c, d);
                },
                RATE: function (c, d, f, k, l, m) {
                    m = void 0 === m ? 0.01 : m;
                    k = void 0 === k ? 0 : k;
                    l = void 0 === l ? 0 : l;
                    c = e.parseNumber(c);
                    d = e.parseNumber(d);
                    f = e.parseNumber(f);
                    k = e.parseNumber(k);
                    l = e.parseNumber(l);
                    m = e.parseNumber(m);
                    if (e.anyIsError(c, d, f, k, l, m))
                        return h.value;
                    for (var n = 0, r = !1; 100 > n && !r;) {
                        var u = Math.pow(m + 1, c), w = Math.pow(m + 1, c - 1);
                        u = m - (k + u * f + d * (u - 1) * (m * l + 1) / m) / (c * w * f - d * (u - 1) * (m * l + 1) / Math.pow(m, 2) + (c * d * w * (m * l + 1) / m + d * (u - 1) * l / m));
                        0.000001 > Math.abs(u - m) && (r = !0);
                        n++;
                        m = u;
                    }
                    return r ? m : Number.NaN + m;
                },
                RECEIVED: null,
                RRI: function (c, d, f) {
                    c = e.parseNumber(c);
                    d = e.parseNumber(d);
                    f = e.parseNumber(f);
                    return e.anyIsError(c, d, f) ? h.value : 0 === c || 0 === d ? h.num : Math.pow(f / d, 1 / c) - 1;
                },
                SLN: function (c, d, f) {
                    c = e.parseNumber(c);
                    d = e.parseNumber(d);
                    f = e.parseNumber(f);
                    return e.anyIsError(c, d, f) ? h.value : 0 === f ? h.num : (c - d) / f;
                },
                SYD: function (c, d, f, k) {
                    c = e.parseNumber(c);
                    d = e.parseNumber(d);
                    f = e.parseNumber(f);
                    k = e.parseNumber(k);
                    if (e.anyIsError(c, d, f, k))
                        return h.value;
                    if (0 === f || 1 > k || k > f)
                        return h.num;
                    k = parseInt(k, 10);
                    return (c - d) * (f - k + 1) * 2 / (f * (f + 1));
                },
                TBILLEQ: function (c, d, f) {
                    c = e.parseDate(c);
                    d = e.parseDate(d);
                    f = e.parseNumber(f);
                    return e.anyIsError(c, d, f) ? h.value : 0 >= f || c > d || 31536000000 < d - c ? h.num : 365 * f / (360 - f * DAYS360(c, d, !1));
                },
                TBILLPRICE: function (c, d, f) {
                    c = e.parseDate(c);
                    d = e.parseDate(d);
                    f = e.parseNumber(f);
                    return e.anyIsError(c, d, f) ? h.value : 0 >= f || c > d || 31536000000 < d - c ? h.num : 100 * (1 - f * DAYS360(c, d, !1) / 360);
                },
                TBILLYIELD: function (c, d, f) {
                    c = e.parseDate(c);
                    d = e.parseDate(d);
                    f = e.parseNumber(f);
                    return e.anyIsError(c, d, f) ? h.value : 0 >= f || c > d || 31536000000 < d - c ? h.num : 360 * (100 - f) / (f * DAYS360(c, d, !1));
                },
                VDB: null,
                XIRR: function (c, d, f) {
                    c = e.parseNumberArray(e.flatten(c));
                    d = e.parseDateArray(e.flatten(d));
                    f = e.parseNumber(f);
                    if (e.anyIsError(c, d, f))
                        return h.value;
                    for (var k = function (u, w, x) {
                                x += 1;
                                for (var v = u[0], y = 1; y < u.length; y++)
                                    v += u[y] / Math.pow(x, DAYS(w[y], w[0]) / 365);
                                return v;
                            }, l = function (u, w, x) {
                                x += 1;
                                for (var v = 0, y = 1; y < u.length; y++) {
                                    var E = DAYS(w[y], w[0]) / 365;
                                    v -= E * u[y] / Math.pow(x, E + 1);
                                }
                                return v;
                            }, m = !1, n = !1, r = 0; r < c.length; r++)
                        0 < c[r] && (m = !0), 0 > c[r] && (n = !0);
                    if (!m || !n)
                        return h.num;
                    f = f || 0.1;
                    m = !0;
                    do
                        r = k(c, d, f), m = f - r / l(c, d, f), n = Math.abs(m - f), f = m, m = 1e-10 < n && 1e-10 < Math.abs(r);
                    while (m);
                    return f;
                },
                XNPV: function (c, d, f) {
                    c = e.parseNumber(c);
                    d = e.parseNumberArray(e.flatten(d));
                    f = e.parseDateArray(e.flatten(f));
                    if (e.anyIsError(c, d, f))
                        return h.value;
                    for (var k = 0, l = 0; l < d.length; l++)
                        k += d[l] / Math.pow(1 + c, DAYS(f[l], f[0]) / 365);
                    return k;
                },
                YIELD: null,
                YIELDDISC: null,
                YIELDMAT: null
            };
            return a;
        }();
        t.information = function () {
            var g = {
                CELL: null,
                ERROR: {}
            };
            g.ERROR.TYPE = function (b) {
                switch (b) {
                case h.nil:
                    return 1;
                case h.div0:
                    return 2;
                case h.value:
                    return 3;
                case h.ref:
                    return 4;
                case h.name:
                    return 5;
                case h.num:
                    return 6;
                case h.na:
                    return 7;
                case h.data:
                    return 8;
                }
                return h.na;
            };
            g.INFO = null;
            g.ISBLANK = function (b) {
                return null === b;
            };
            g.ISBINARY = function (b) {
                return /^[01]{1,10}$/.test(b);
            };
            g.ISERR = function (b) {
                return 0 <= [
                    h.value,
                    h.ref,
                    h.div0,
                    h.num,
                    h.name,
                    h.nil
                ].indexOf(b) || 'number' === typeof b && (isNaN(b) || !isFinite(b));
            };
            g.ISERROR = function (b) {
                return g.ISERR(b) || b === h.na;
            };
            g.ISEVEN = function (b) {
                return Math.floor(Math.abs(b)) & 1 ? !1 : !0;
            };
            g.ISFORMULA = null;
            g.ISLOGICAL = function (b) {
                return !0 === b || !1 === b;
            };
            g.ISNA = function (b) {
                return b === h.na;
            };
            g.ISNONTEXT = function (b) {
                return 'string' !== typeof b;
            };
            g.ISNUMBER = function (b) {
                return 'number' === typeof b && !isNaN(b) && isFinite(b);
            };
            g.ISODD = function (b) {
                return Math.floor(Math.abs(b)) & 1 ? !0 : !1;
            };
            g.ISREF = null;
            g.ISTEXT = function (b) {
                return 'string' === typeof b;
            };
            g.N = function (b) {
                return this.ISNUMBER(b) ? b : b instanceof Date ? b.getTime() : !0 === b ? 1 : !1 === b ? 0 : this.ISERROR(b) ? b : 0;
            };
            g.NA = function () {
                return h.na;
            };
            g.SHEET = null;
            g.SHEETS = null;
            g.TYPE = function (b) {
                if (this.ISNUMBER(b))
                    return 1;
                if (this.ISTEXT(b))
                    return 2;
                if (this.ISLOGICAL(b))
                    return 4;
                if (this.ISERROR(b))
                    return 16;
                if (Array.isArray(b))
                    return 64;
            };
            return g;
        }();
        t.logical = function () {
            return {
                AND: function () {
                    for (var g = e.flatten(arguments), b = !0, a = 0; a < g.length; a++)
                        g[a] || (b = !1);
                    return b;
                },
                CHOOSE: function () {
                    if (2 > arguments.length)
                        return h.na;
                    var g = arguments[0];
                    return 1 > g || 254 < g || arguments.length < g + 1 ? h.value : arguments[g];
                },
                FALSE: function () {
                    return !1;
                },
                IF: function (g, b, a) {
                    return g ? b : a;
                },
                IFERROR: function (g, b) {
                    return ISERROR(g) ? b : g;
                },
                IFNA: function (g, b) {
                    return g === h.na ? b : g;
                },
                NOT: function (g) {
                    return !g;
                },
                OR: function () {
                    for (var g = e.flatten(arguments), b = !1, a = 0; a < g.length; a++)
                        g[a] && (b = !0);
                    return b;
                },
                TRUE: function () {
                    return !0;
                },
                XOR: function () {
                    for (var g = e.flatten(arguments), b = 0, a = 0; a < g.length; a++)
                        g[a] && b++;
                    return Math.floor(Math.abs(b)) & 1 ? !0 : !1;
                },
                SWITCH: function () {
                    if (0 < arguments.length) {
                        var g = arguments[0], b = arguments.length - 1, a = Math.floor(b / 2), c = !1;
                        b = 0 === b % 2 ? null : arguments[arguments.length - 1];
                        if (a)
                            for (var d = 0; d < a; d++)
                                if (g === arguments[2 * d + 1]) {
                                    var f = arguments[2 * d + 2];
                                    c = !0;
                                    break;
                                }
                        !c && b && (f = b);
                    }
                    return f;
                }
            };
        }();
        t.math = function () {
            var g = {
                ABS: function (a) {
                    a = e.parseNumber(a);
                    return a instanceof Error ? a : Math.abs(e.parseNumber(a));
                },
                ACOS: function (a) {
                    a = e.parseNumber(a);
                    return a instanceof Error ? a : Math.acos(a);
                },
                ACOSH: function (a) {
                    a = e.parseNumber(a);
                    return a instanceof Error ? a : Math.log(a + Math.sqrt(a * a - 1));
                },
                ACOT: function (a) {
                    a = e.parseNumber(a);
                    return a instanceof Error ? a : Math.atan(1 / a);
                },
                ACOTH: function (a) {
                    a = e.parseNumber(a);
                    return a instanceof Error ? a : 0.5 * Math.log((a + 1) / (a - 1));
                },
                AGGREGATE: null,
                ARABIC: function (a) {
                    if (!/^M*(?:D?C{0,3}|C[MD])(?:L?X{0,3}|X[CL])(?:V?I{0,3}|I[XV])$/.test(a))
                        return h.value;
                    var c = 0;
                    a.replace(/[MDLV]|C[MD]?|X[CL]?|I[XV]?/g, function (d) {
                        c += {
                            M: 1000,
                            CM: 900,
                            D: 500,
                            CD: 400,
                            C: 100,
                            XC: 90,
                            L: 50,
                            XL: 40,
                            X: 10,
                            IX: 9,
                            V: 5,
                            IV: 4,
                            I: 1
                        }[d];
                    });
                    return c;
                },
                ASIN: function (a) {
                    a = e.parseNumber(a);
                    return a instanceof Error ? a : Math.asin(a);
                },
                ASINH: function (a) {
                    a = e.parseNumber(a);
                    return a instanceof Error ? a : Math.log(a + Math.sqrt(a * a + 1));
                },
                ATAN: function (a) {
                    a = e.parseNumber(a);
                    return a instanceof Error ? a : Math.atan(a);
                },
                ATAN2: function (a, c) {
                    a = e.parseNumber(a);
                    c = e.parseNumber(c);
                    return e.anyIsError(a, c) ? h.value : Math.atan2(a, c);
                },
                ATANH: function (a) {
                    a = e.parseNumber(a);
                    return a instanceof Error ? a : Math.log((1 + a) / (1 - a)) / 2;
                },
                BASE: function (a, c, d) {
                    d = d || 0;
                    a = e.parseNumber(a);
                    c = e.parseNumber(c);
                    d = e.parseNumber(d);
                    if (e.anyIsError(a, c, d))
                        return h.value;
                    d = void 0 === d ? 0 : d;
                    a = a.toString(c);
                    return Array(Math.max(d + 1 - a.length, 0)).join('0') + a;
                },
                CEILING: function (a, c, d) {
                    c = void 0 === c ? 1 : c;
                    d = void 0 === d ? 0 : d;
                    a = e.parseNumber(a);
                    c = e.parseNumber(c);
                    d = e.parseNumber(d);
                    if (e.anyIsError(a, c, d))
                        return h.value;
                    if (0 === c)
                        return 0;
                    c = Math.abs(c);
                    return 0 <= a ? Math.ceil(a / c) * c : 0 === d ? -1 * Math.floor(Math.abs(a) / c) * c : -1 * Math.ceil(Math.abs(a) / c) * c;
                }
            };
            g.CEILING.MATH = g.CEILING;
            g.CEILING.PRECISE = g.CEILING;
            g.COMBIN = function (a, c) {
                a = e.parseNumber(a);
                c = e.parseNumber(c);
                return e.anyIsError(a, c) ? h.value : g.FACT(a) / (g.FACT(c) * g.FACT(a - c));
            };
            g.COMBINA = function (a, c) {
                a = e.parseNumber(a);
                c = e.parseNumber(c);
                return e.anyIsError(a, c) ? h.value : 0 === a && 0 === c ? 1 : g.COMBIN(a + c - 1, a - 1);
            };
            g.COS = function (a) {
                a = e.parseNumber(a);
                return a instanceof Error ? a : Math.cos(a);
            };
            g.COSH = function (a) {
                a = e.parseNumber(a);
                return a instanceof Error ? a : (Math.exp(a) + Math.exp(-a)) / 2;
            };
            g.COT = function (a) {
                a = e.parseNumber(a);
                return a instanceof Error ? a : 1 / Math.tan(a);
            };
            g.COTH = function (a) {
                a = e.parseNumber(a);
                if (a instanceof Error)
                    return a;
                a = Math.exp(2 * a);
                return (a + 1) / (a - 1);
            };
            g.CSC = function (a) {
                a = e.parseNumber(a);
                return a instanceof Error ? a : 1 / Math.sin(a);
            };
            g.CSCH = function (a) {
                a = e.parseNumber(a);
                return a instanceof Error ? a : 2 / (Math.exp(a) - Math.exp(-a));
            };
            g.DECIMAL = function (a, c) {
                return 1 > arguments.length ? h.value : parseInt(a, c);
            };
            g.DEGREES = function (a) {
                a = e.parseNumber(a);
                return a instanceof Error ? a : 180 * a / Math.PI;
            };
            g.EVEN = function (a) {
                a = e.parseNumber(a);
                return a instanceof Error ? a : g.CEILING(a, -2, -1);
            };
            g.EXP = Math.exp;
            var b = [];
            g.FACT = function (a) {
                a = e.parseNumber(a);
                if (a instanceof Error)
                    return a;
                a = Math.floor(a);
                if (0 === a || 1 === a)
                    return 1;
                0 < b[a] || (b[a] = g.FACT(a - 1) * a);
                return b[a];
            };
            g.FACTDOUBLE = function (a) {
                a = e.parseNumber(a);
                if (a instanceof Error)
                    return a;
                a = Math.floor(a);
                return 0 >= a ? 1 : a * g.FACTDOUBLE(a - 2);
            };
            g.FLOOR = function (a, c, d) {
                c = void 0 === c ? 1 : c;
                d = void 0 === d ? 0 : d;
                a = e.parseNumber(a);
                c = e.parseNumber(c);
                d = e.parseNumber(d);
                if (e.anyIsError(a, c, d))
                    return h.value;
                if (0 === c)
                    return 0;
                c = Math.abs(c);
                return 0 <= a ? Math.floor(a / c) * c : 0 === d ? -1 * Math.ceil(Math.abs(a) / c) * c : -1 * Math.floor(Math.abs(a) / c) * c;
            };
            g.FLOOR.MATH = g.FLOOR;
            g.GCD = null;
            g.INT = function (a) {
                a = e.parseNumber(a);
                return a instanceof Error ? a : Math.floor(a);
            };
            g.LCM = function () {
                var a = e.parseNumberArray(e.flatten(arguments));
                if (a instanceof Error)
                    return a;
                for (var c, d, f, k = 1; void 0 !== (f = a.pop());)
                    for (; 1 < f;) {
                        if (f % 2) {
                            c = 3;
                            for (d = Math.floor(Math.sqrt(f)); c <= d && f % c; c += 2);
                            d = c <= d ? c : f;
                        } else
                            d = 2;
                        f /= d;
                        k *= d;
                        for (c = a.length; c; 0 === a[--c] % d && 1 === (a[c] /= d) && a.splice(c, 1));
                    }
                return k;
            };
            g.LN = function (a) {
                a = e.parseNumber(a);
                return a instanceof Error ? a : Math.log(a);
            };
            g.LOG = function (a, c) {
                a = e.parseNumber(a);
                c = void 0 === c ? 10 : e.parseNumber(c);
                return e.anyIsError(a, c) ? h.value : Math.log(a) / Math.log(c);
            };
            g.LOG10 = function (a) {
                a = e.parseNumber(a);
                return a instanceof Error ? a : Math.log(a) / Math.log(10);
            };
            g.MDETERM = null;
            g.MINVERSE = null;
            g.MMULT = null;
            g.MOD = function (a, c) {
                a = e.parseNumber(a);
                c = e.parseNumber(c);
                if (e.anyIsError(a, c))
                    return h.value;
                if (0 === c)
                    return h.div0;
                a = Math.abs(a % c);
                return 0 < c ? a : -a;
            };
            g.MROUND = function (a, c) {
                a = e.parseNumber(a);
                c = e.parseNumber(c);
                return e.anyIsError(a, c) ? h.value : 0 > a * c ? h.num : Math.round(a / c) * c;
            };
            g.MULTINOMIAL = function () {
                var a = e.parseNumberArray(e.flatten(arguments));
                if (a instanceof Error)
                    return a;
                for (var c = 0, d = 1, f = 0; f < a.length; f++)
                    c += a[f], d *= g.FACT(a[f]);
                return g.FACT(c) / d;
            };
            g.MUNIT = null;
            g.ODD = function (a) {
                a = e.parseNumber(a);
                if (a instanceof Error)
                    return a;
                var c = Math.ceil(Math.abs(a));
                c = c & 1 ? c : c + 1;
                return 0 < a ? c : -c;
            };
            g.PI = function () {
                return Math.PI;
            };
            g.POWER = function (a, c) {
                a = e.parseNumber(a);
                c = e.parseNumber(c);
                if (e.anyIsError(a, c))
                    return h.value;
                a = Math.pow(a, c);
                return isNaN(a) ? h.num : a;
            };
            g.PRODUCT = function () {
                var a = e.parseNumberArray(e.flatten(arguments));
                if (a instanceof Error)
                    return a;
                for (var c = 1, d = 0; d < a.length; d++)
                    c *= a[d];
                return c;
            };
            g.QUOTIENT = function (a, c) {
                a = e.parseNumber(a);
                c = e.parseNumber(c);
                return e.anyIsError(a, c) ? h.value : parseInt(a / c, 10);
            };
            g.RADIANS = function (a) {
                a = e.parseNumber(a);
                return a instanceof Error ? a : a * Math.PI / 180;
            };
            g.RAND = function () {
                return Math.random();
            };
            g.RANDBETWEEN = function (a, c) {
                a = e.parseNumber(a);
                c = e.parseNumber(c);
                return e.anyIsError(a, c) ? h.value : a + Math.ceil((c - a + 1) * Math.random()) - 1;
            };
            g.ROMAN = null;
            g.ROUND = function (a, c) {
                a = e.parseNumber(a);
                c = e.parseNumber(c);
                return e.anyIsError(a, c) ? h.value : Math.round(a * Math.pow(10, c)) / Math.pow(10, c);
            };
            g.ROUNDDOWN = function (a, c) {
                a = e.parseNumber(a);
                c = e.parseNumber(c);
                return e.anyIsError(a, c) ? h.value : (0 < a ? 1 : -1) * Math.floor(Math.abs(a) * Math.pow(10, c)) / Math.pow(10, c);
            };
            g.ROUNDUP = function (a, c) {
                a = e.parseNumber(a);
                c = e.parseNumber(c);
                return e.anyIsError(a, c) ? h.value : (0 < a ? 1 : -1) * Math.ceil(Math.abs(a) * Math.pow(10, c)) / Math.pow(10, c);
            };
            g.SEC = function (a) {
                a = e.parseNumber(a);
                return a instanceof Error ? a : 1 / Math.cos(a);
            };
            g.SECH = function (a) {
                a = e.parseNumber(a);
                return a instanceof Error ? a : 2 / (Math.exp(a) + Math.exp(-a));
            };
            g.SERIESSUM = function (a, c, d, f) {
                a = e.parseNumber(a);
                c = e.parseNumber(c);
                d = e.parseNumber(d);
                f = e.parseNumberArray(f);
                if (e.anyIsError(a, c, d, f))
                    return h.value;
                for (var k = f[0] * Math.pow(a, c), l = 1; l < f.length; l++)
                    k += f[l] * Math.pow(a, c + l * d);
                return k;
            };
            g.SIGN = function (a) {
                a = e.parseNumber(a);
                return a instanceof Error ? a : 0 > a ? -1 : 0 === a ? 0 : 1;
            };
            g.SIN = function (a) {
                a = e.parseNumber(a);
                return a instanceof Error ? a : Math.sin(a);
            };
            g.SINH = function (a) {
                a = e.parseNumber(a);
                return a instanceof Error ? a : (Math.exp(a) - Math.exp(-a)) / 2;
            };
            g.SQRT = function (a) {
                a = e.parseNumber(a);
                return a instanceof Error ? a : 0 > a ? h.num : Math.sqrt(a);
            };
            g.SQRTPI = function (a) {
                a = e.parseNumber(a);
                return a instanceof Error ? a : Math.sqrt(a * Math.PI);
            };
            g.SUBTOTAL = null;
            g.ADD = function (a, c) {
                if (2 !== arguments.length)
                    return h.na;
                a = e.parseNumber(a);
                c = e.parseNumber(c);
                return e.anyIsError(a, c) ? h.value : a + c;
            };
            g.MINUS = function (a, c) {
                if (2 !== arguments.length)
                    return h.na;
                a = e.parseNumber(a);
                c = e.parseNumber(c);
                return e.anyIsError(a, c) ? h.value : a - c;
            };
            g.DIVIDE = function (a, c) {
                if (2 !== arguments.length)
                    return h.na;
                a = e.parseNumber(a);
                c = e.parseNumber(c);
                return e.anyIsError(a, c) ? h.value : 0 === c ? h.div0 : a / c;
            };
            g.MULTIPLY = function (a, c) {
                if (2 !== arguments.length)
                    return h.na;
                a = e.parseNumber(a);
                c = e.parseNumber(c);
                return e.anyIsError(a, c) ? h.value : a * c;
            };
            g.GTE = function (a, c) {
                if (2 !== arguments.length)
                    return h.na;
                a = e.parseNumber(a);
                c = e.parseNumber(c);
                return e.anyIsError(a, c) ? h.error : a >= c;
            };
            g.LT = function (a, c) {
                if (2 !== arguments.length)
                    return h.na;
                a = e.parseNumber(a);
                c = e.parseNumber(c);
                return e.anyIsError(a, c) ? h.error : a < c;
            };
            g.LTE = function (a, c) {
                if (2 !== arguments.length)
                    return h.na;
                a = e.parseNumber(a);
                c = e.parseNumber(c);
                return e.anyIsError(a, c) ? h.error : a <= c;
            };
            g.EQ = function (a, c) {
                return 2 !== arguments.length ? h.na : a === c;
            };
            g.NE = function (a, c) {
                return 2 !== arguments.length ? h.na : a !== c;
            };
            g.POW = function (a, c) {
                if (2 !== arguments.length)
                    return h.na;
                a = e.parseNumber(a);
                c = e.parseNumber(c);
                return e.anyIsError(a, c) ? h.error : g.POWER(a, c);
            };
            g.SUM = function () {
                for (var a = 0, c = Object.keys(arguments), d = 0; d < c.length; ++d) {
                    var f = arguments[c[d]];
                    'number' === typeof f ? a += f : 'string' === typeof f ? (f = parseFloat(f), !isNaN(f) && (a += f)) : Array.isArray(f) && (a += g.SUM.apply(null, f));
                }
                return a;
            };
            g.SUMIF = function () {
                var a = e.argsToArray(arguments), c = a.pop();
                a = e.parseNumberArray(e.flatten(a));
                if (a instanceof Error)
                    return a;
                for (var d = 0, f = 0; f < a.length; f++)
                    d += eval(a[f] + c) ? a[f] : 0;
                return d;
            };
            g.SUMIFS = function () {
                var a = e.argsToArray(arguments), c = e.parseNumberArray(e.flatten(a.shift()));
                if (c instanceof Error)
                    return c;
                for (var d = c.length, f = a.length, k = 0, l = 0; l < d; l++) {
                    for (var m = c[l], n = '', r = 0; r < f; r += 2)
                        n = isNaN(a[r][l]) ? n + ('"' + a[r][l] + '"' + a[r + 1]) : n + (a[r][l] + a[r + 1]), r !== f - 1 && (n += ' && ');
                    n = n.slice(0, -4);
                    eval(n) && (k += m);
                }
                return k;
            };
            g.SUMPRODUCT = null;
            g.SUMSQ = function () {
                var a = e.parseNumberArray(e.flatten(arguments));
                if (a instanceof Error)
                    return a;
                for (var c = 0, d = a.length, f = 0; f < d; f++)
                    c += ISNUMBER(a[f]) ? a[f] * a[f] : 0;
                return c;
            };
            g.SUMX2MY2 = function (a, c) {
                a = e.parseNumberArray(e.flatten(a));
                c = e.parseNumberArray(e.flatten(c));
                if (e.anyIsError(a, c))
                    return h.value;
                for (var d = 0, f = 0; f < a.length; f++)
                    d += a[f] * a[f] - c[f] * c[f];
                return d;
            };
            g.SUMX2PY2 = function (a, c) {
                a = e.parseNumberArray(e.flatten(a));
                c = e.parseNumberArray(e.flatten(c));
                if (e.anyIsError(a, c))
                    return h.value;
                var d = 0;
                a = e.parseNumberArray(e.flatten(a));
                c = e.parseNumberArray(e.flatten(c));
                for (var f = 0; f < a.length; f++)
                    d += a[f] * a[f] + c[f] * c[f];
                return d;
            };
            g.SUMXMY2 = function (a, c) {
                a = e.parseNumberArray(e.flatten(a));
                c = e.parseNumberArray(e.flatten(c));
                if (e.anyIsError(a, c))
                    return h.value;
                var d = 0;
                a = e.flatten(a);
                c = e.flatten(c);
                for (var f = 0; f < a.length; f++)
                    d += Math.pow(a[f] - c[f], 2);
                return d;
            };
            g.TAN = function (a) {
                a = e.parseNumber(a);
                return a instanceof Error ? a : Math.tan(a);
            };
            g.TANH = function (a) {
                a = e.parseNumber(a);
                if (a instanceof Error)
                    return a;
                a = Math.exp(2 * a);
                return (a - 1) / (a + 1);
            };
            g.TRUNC = function (a, c) {
                c = void 0 === c ? 0 : c;
                a = e.parseNumber(a);
                c = e.parseNumber(c);
                return e.anyIsError(a, c) ? h.value : (0 < a ? 1 : -1) * Math.floor(Math.abs(a) * Math.pow(10, c)) / Math.pow(10, c);
            };
            return g;
        }();
        t.misc = function () {
            var g = {
                UNIQUE: function () {
                    for (var b = [], a = 0; a < arguments.length; ++a) {
                        for (var c = !1, d = arguments[a], f = 0; f < b.length && !(c = b[f] === d); ++f);
                        c || b.push(d);
                    }
                    return b;
                }
            };
            g.FLATTEN = e.flatten;
            g.ARGS2ARRAY = function () {
                return Array.prototype.slice.call(arguments, 0);
            };
            g.REFERENCE = function (b, a) {
                try {
                    var c = a.split('.');
                    for (a = 0; a < c.length; ++a) {
                        var d = c[a];
                        if (']' === d[d.length - 1]) {
                            var f = d.indexOf('['), k = d.substring(f + 1, d.length - 1);
                            b = b[d.substring(0, f)][k];
                        } else
                            b = b[d];
                    }
                    return b;
                } catch (l) {
                }
            };
            g.JOIN = function (b, a) {
                return b.join(a);
            };
            g.NUMBERS = function () {
                return e.flatten(arguments).filter(function (b) {
                    return 'number' === typeof b;
                });
            };
            g.NUMERAL = null;
            return g;
        }();
        t.text = function () {
            var g = {
                ASC: null,
                BAHTTEXT: null,
                CHAR: function (b) {
                    b = e.parseNumber(b);
                    return b instanceof Error ? b : String.fromCharCode(b);
                },
                CLEAN: function (b) {
                    return (b || '').replace(/[\0-\x1F]/g, '');
                },
                CODE: function (b) {
                    return (b || '').charCodeAt(0);
                },
                CONCATENATE: function () {
                    for (var b = e.flatten(arguments), a; -1 < (a = b.indexOf(!0));)
                        b[a] = 'TRUE';
                    for (; -1 < (a = b.indexOf(!1));)
                        b[a] = 'FALSE';
                    return b.join('');
                },
                DBCS: null,
                DOLLAR: null,
                EXACT: function (b, a) {
                    return b === a;
                },
                FIND: function (b, a, c) {
                    return a ? a.indexOf(b, (void 0 === c ? 0 : c) - 1) + 1 : null;
                },
                FIXED: null,
                HTML2TEXT: function (b) {
                    var a = '';
                    b && (b instanceof Array ? b.forEach(function (c) {
                        '' !== a && (a += '\n');
                        a += c.replace(/<(?:.|\n)*?>/gm, '');
                    }) : a = b.replace(/<(?:.|\n)*?>/gm, ''));
                    return a;
                },
                LEFT: function (b, a) {
                    a = e.parseNumber(void 0 === a ? 1 : a);
                    return a instanceof Error || 'string' !== typeof b ? h.value : b ? b.substring(0, a) : null;
                },
                LEN: function (b) {
                    return 0 === arguments.length ? h.error : 'string' === typeof b ? b ? b.length : 0 : b.length ? b.length : h.value;
                },
                LOWER: function (b) {
                    return 'string' !== typeof b ? h.value : b ? b.toLowerCase() : b;
                },
                MID: function (b, a, c) {
                    a = e.parseNumber(a);
                    c = e.parseNumber(c);
                    if (e.anyIsError(a, c) || 'string' !== typeof b)
                        return c;
                    --a;
                    return b.substring(a, a + c);
                },
                NUMBERVALUE: null,
                PRONETIC: null,
                PROPER: function (b) {
                    if (void 0 === b || 0 === b.length)
                        return h.value;
                    !0 === b && (b = 'TRUE');
                    !1 === b && (b = 'FALSE');
                    if (isNaN(b) && 'number' === typeof b)
                        return h.value;
                    'number' === typeof b && (b = '' + b);
                    return b.replace(/\w\S*/g, function (a) {
                        return a.charAt(0).toUpperCase() + a.substr(1).toLowerCase();
                    });
                },
                REGEXEXTRACT: function (b, a) {
                    return (b = b.match(new RegExp(a))) ? b[1 < b.length ? b.length - 1 : 0] : null;
                },
                REGEXMATCH: function (b, a, c) {
                    b = b.match(new RegExp(a));
                    return c ? b : !!b;
                },
                REGEXREPLACE: function (b, a, c) {
                    return b.replace(new RegExp(a), c);
                },
                REPLACE: function (b, a, c, d) {
                    a = e.parseNumber(a);
                    c = e.parseNumber(c);
                    return e.anyIsError(a, c) || 'string' !== typeof b || 'string' !== typeof d ? h.value : b.substr(0, a - 1) + d + b.substr(a - 1 + c);
                },
                REPT: function (b, a) {
                    a = e.parseNumber(a);
                    return a instanceof Error ? a : Array(a + 1).join(b);
                },
                RIGHT: function (b, a) {
                    a = e.parseNumber(void 0 === a ? 1 : a);
                    return a instanceof Error ? a : b ? b.substring(b.length - a) : null;
                },
                SEARCH: function (b, a, c) {
                    if ('string' !== typeof b || 'string' !== typeof a)
                        return h.value;
                    c = void 0 === c ? 0 : c;
                    b = a.toLowerCase().indexOf(b.toLowerCase(), c - 1) + 1;
                    return 0 === b ? h.value : b;
                },
                SPLIT: function (b, a) {
                    return b.split(a);
                },
                SUBSTITUTE: function (b, a, c, d) {
                    if (b && a && c) {
                        if (void 0 === d)
                            return b.replace(new RegExp(a, 'g'), c);
                        for (var f = 0, k = 0; 0 < b.indexOf(a, f);)
                            if (f = b.indexOf(a, f + 1), k++, k === d)
                                return b.substring(0, f) + c + b.substring(f + a.length);
                    } else
                        return b;
                },
                T: function (b) {
                    return 'string' === typeof b ? b : '';
                },
                TEXT: null,
                TRIM: function (b) {
                    return 'string' !== typeof b ? h.value : b.replace(/ +/g, ' ').trim();
                }
            };
            g.UNICHAR = g.CHAR;
            g.UNICODE = g.CODE;
            g.UPPER = function (b) {
                return 'string' !== typeof b ? h.value : b.toUpperCase();
            };
            g.VALUE = null;
            return g;
        }();
        t.stats = function () {
            var g = {
                AVEDEV: null,
                AVERAGE: function () {
                    for (var b = e.numbers(e.flatten(arguments)), a = b.length, c = 0, d = 0, f = 0; f < a; f++)
                        c += b[f], d += 1;
                    return c / d;
                },
                AVERAGEA: function () {
                    for (var b = e.flatten(arguments), a = b.length, c = 0, d = 0, f = 0; f < a; f++) {
                        var k = b[f];
                        'number' === typeof k && (c += k);
                        !0 === k && c++;
                        null !== k && d++;
                    }
                    return c / d;
                },
                AVERAGEIF: function (b, a, c) {
                    c = c || b;
                    b = e.flatten(b);
                    c = e.parseNumberArray(e.flatten(c));
                    if (c instanceof Error)
                        return c;
                    for (var d = 0, f = 0, k = 0; k < b.length; k++)
                        eval(b[k] + a) && (f += c[k], d++);
                    return f / d;
                },
                AVERAGEIFS: null,
                COUNT: function () {
                    return e.numbers(e.flatten(arguments)).length;
                },
                COUNTA: function () {
                    var b = e.flatten(arguments);
                    return b.length - g.COUNTBLANK(b);
                },
                COUNTIN: function (b, a) {
                    for (var c = 0, d = 0; d < b.length; d++)
                        b[d] === a && c++;
                    return c;
                },
                COUNTBLANK: function () {
                    for (var b = e.flatten(arguments), a = 0, c, d = 0; d < b.length; d++)
                        c = b[d], null !== c && '' !== c || a++;
                    return a;
                },
                COUNTIF: function () {
                    var b = e.argsToArray(arguments), a = b.pop();
                    b = e.flatten(b);
                    /[<>=!]/.test(a) || (a = '=="' + a + '"');
                    for (var c = 0, d = 0; d < b.length; d++)
                        'string' !== typeof b[d] ? eval(b[d] + a) && c++ : eval('"' + b[d] + '"' + a) && c++;
                    return c;
                },
                COUNTIFS: function () {
                    for (var b = e.argsToArray(arguments), a = Array(e.flatten(b[0]).length), c = 0; c < a.length; c++)
                        a[c] = !0;
                    for (c = 0; c < b.length; c += 2) {
                        var d = e.flatten(b[c]), f = b[c + 1];
                        /[<>=!]/.test(f) || (f = '=="' + f + '"');
                        for (var k = 0; k < d.length; k++)
                            a[k] = 'string' !== typeof d[k] ? a[k] && eval(d[k] + f) : a[k] && eval('"' + d[k] + '"' + f);
                    }
                    for (c = b = 0; c < a.length; c++)
                        a[c] && b++;
                    return b;
                },
                COUNTUNIQUE: function () {
                    return UNIQUE.apply(null, e.flatten(arguments)).length;
                },
                FISHER: function (b) {
                    b = e.parseNumber(b);
                    return b instanceof Error ? b : Math.log((1 + b) / (1 - b)) / 2;
                },
                FISHERINV: function (b) {
                    b = e.parseNumber(b);
                    if (b instanceof Error)
                        return b;
                    b = Math.exp(2 * b);
                    return (b - 1) / (b + 1);
                },
                FREQUENCY: function (b, a) {
                    b = e.parseNumberArray(e.flatten(b));
                    a = e.parseNumberArray(e.flatten(a));
                    if (e.anyIsError(b, a))
                        return h.value;
                    for (var c = b.length, d = a.length, f = [], k = 0; k <= d; k++)
                        for (var l = f[k] = 0; l < c; l++)
                            0 === k ? b[l] <= a[0] && (f[0] += 1) : k < d ? b[l] > a[k - 1] && b[l] <= a[k] && (f[k] += 1) : k === d && b[l] > a[d - 1] && (f[d] += 1);
                    return f;
                },
                LARGE: function (b, a) {
                    b = e.parseNumberArray(e.flatten(b));
                    a = e.parseNumber(a);
                    return e.anyIsError(b, a) ? b : b.sort(function (c, d) {
                        return d - c;
                    })[a - 1];
                },
                MAX: function () {
                    var b = e.numbers(e.flatten(arguments));
                    return 0 === b.length ? 0 : Math.max.apply(Math, b);
                },
                MAXA: function () {
                    var b = e.arrayValuesToNumbers(e.flatten(arguments));
                    return 0 === b.length ? 0 : Math.max.apply(Math, b);
                },
                MIN: function () {
                    var b = e.numbers(e.flatten(arguments));
                    return 0 === b.length ? 0 : Math.min.apply(Math, b);
                },
                MINA: function () {
                    var b = e.arrayValuesToNumbers(e.flatten(arguments));
                    return 0 === b.length ? 0 : Math.min.apply(Math, b);
                },
                MODE: {}
            };
            g.MODE.MULT = function () {
                var b = e.parseNumberArray(e.flatten(arguments));
                if (b instanceof Error)
                    return b;
                for (var a = b.length, c = {}, d = [], f = 0, k, l = 0; l < a; l++)
                    k = b[l], c[k] = c[k] ? c[k] + 1 : 1, c[k] > f && (f = c[k], d = []), c[k] === f && (d[d.length] = k);
                return d;
            };
            g.MODE.SNGL = function () {
                var b = e.parseNumberArray(e.flatten(arguments));
                return b instanceof Error ? b : g.MODE.MULT(b).sort(function (a, c) {
                    return a - c;
                })[0];
            };
            g.PERCENTILE = {};
            g.PERCENTILE.EXC = function (b, a) {
                b = e.parseNumberArray(e.flatten(b));
                a = e.parseNumber(a);
                if (e.anyIsError(b, a))
                    return h.value;
                b = b.sort(function (d, f) {
                    return d - f;
                });
                var c = b.length;
                if (a < 1 / (c + 1) || a > 1 - 1 / (c + 1))
                    return h.num;
                a = a * (c + 1) - 1;
                c = Math.floor(a);
                return e.cleanFloat(a === c ? b[a] : b[c] + (a - c) * (b[c + 1] - b[c]));
            };
            g.PERCENTILE.INC = function (b, a) {
                b = e.parseNumberArray(e.flatten(b));
                a = e.parseNumber(a);
                if (e.anyIsError(b, a))
                    return h.value;
                b = b.sort(function (d, f) {
                    return d - f;
                });
                a *= b.length - 1;
                var c = Math.floor(a);
                return e.cleanFloat(a === c ? b[a] : b[c] + (a - c) * (b[c + 1] - b[c]));
            };
            g.PERCENTRANK = {};
            g.PERCENTRANK.EXC = function (b, a, c) {
                c = void 0 === c ? 3 : c;
                b = e.parseNumberArray(e.flatten(b));
                a = e.parseNumber(a);
                c = e.parseNumber(c);
                if (e.anyIsError(b, a, c))
                    return h.value;
                b = b.sort(function (r, u) {
                    return r - u;
                });
                var d = UNIQUE.apply(null, b), f = b.length, k = d.length;
                c = Math.pow(10, c);
                for (var l = 0, m = !1, n = 0; !m && n < k;)
                    a === d[n] ? (l = (b.indexOf(d[n]) + 1) / (f + 1), m = !0) : a >= d[n] && (a < d[n + 1] || n === k - 1) && (l = (b.indexOf(d[n]) + 1 + (a - d[n]) / (d[n + 1] - d[n])) / (f + 1), m = !0), n++;
                return Math.floor(l * c) / c;
            };
            g.PERCENTRANK.INC = function (b, a, c) {
                c = void 0 === c ? 3 : c;
                b = e.parseNumberArray(e.flatten(b));
                a = e.parseNumber(a);
                c = e.parseNumber(c);
                if (e.anyIsError(b, a, c))
                    return h.value;
                b = b.sort(function (r, u) {
                    return r - u;
                });
                var d = UNIQUE.apply(null, b), f = b.length, k = d.length;
                c = Math.pow(10, c);
                for (var l = 0, m = !1, n = 0; !m && n < k;)
                    a === d[n] ? (l = b.indexOf(d[n]) / (f - 1), m = !0) : a >= d[n] && (a < d[n + 1] || n === k - 1) && (l = (b.indexOf(d[n]) + (a - d[n]) / (d[n + 1] - d[n])) / (f - 1), m = !0), n++;
                return Math.floor(l * c) / c;
            };
            g.PERMUT = function (b, a) {
                b = e.parseNumber(b);
                a = e.parseNumber(a);
                return e.anyIsError(b, a) ? h.value : FACT(b) / FACT(b - a);
            };
            g.PERMUTATIONA = function (b, a) {
                b = e.parseNumber(b);
                a = e.parseNumber(a);
                return e.anyIsError(b, a) ? h.value : Math.pow(b, a);
            };
            g.PHI = function (b) {
                b = e.parseNumber(b);
                return b instanceof Error ? h.value : Math.exp(-0.5 * b * b) / 2.5066282746310002;
            };
            g.PROB = function (b, a, c, d) {
                if (void 0 === c)
                    return 0;
                d = void 0 === d ? c : d;
                b = e.parseNumberArray(e.flatten(b));
                a = e.parseNumberArray(e.flatten(a));
                c = e.parseNumber(c);
                d = e.parseNumber(d);
                if (e.anyIsError(b, a, c, d))
                    return h.value;
                if (c === d)
                    return 0 <= b.indexOf(c) ? a[b.indexOf(c)] : 0;
                for (var f = b.sort(function (n, r) {
                            return n - r;
                        }), k = f.length, l = 0, m = 0; m < k; m++)
                    f[m] >= c && f[m] <= d && (l += a[b.indexOf(f[m])]);
                return l;
            };
            g.QUARTILE = {};
            g.QUARTILE.EXC = function (b, a) {
                b = e.parseNumberArray(e.flatten(b));
                a = e.parseNumber(a);
                if (e.anyIsError(b, a))
                    return h.value;
                switch (a) {
                case 1:
                    return g.PERCENTILE.EXC(b, 0.25);
                case 2:
                    return g.PERCENTILE.EXC(b, 0.5);
                case 3:
                    return g.PERCENTILE.EXC(b, 0.75);
                default:
                    return h.num;
                }
            };
            g.QUARTILE.INC = function (b, a) {
                b = e.parseNumberArray(e.flatten(b));
                a = e.parseNumber(a);
                if (e.anyIsError(b, a))
                    return h.value;
                switch (a) {
                case 1:
                    return g.PERCENTILE.INC(b, 0.25);
                case 2:
                    return g.PERCENTILE.INC(b, 0.5);
                case 3:
                    return g.PERCENTILE.INC(b, 0.75);
                default:
                    return h.num;
                }
            };
            g.RANK = {};
            g.RANK.AVG = function (b, a, c) {
                b = e.parseNumber(b);
                a = e.parseNumberArray(e.flatten(a));
                if (e.anyIsError(b, a))
                    return h.value;
                a = e.flatten(a);
                a = a.sort(c ? function (k, l) {
                    return k - l;
                } : function (k, l) {
                    return l - k;
                });
                c = a.length;
                for (var d = 0, f = 0; f < c; f++)
                    a[f] === b && d++;
                return 1 < d ? (2 * a.indexOf(b) + d + 1) / 2 : a.indexOf(b) + 1;
            };
            g.RANK.EQ = function (b, a, c) {
                b = e.parseNumber(b);
                a = e.parseNumberArray(e.flatten(a));
                if (e.anyIsError(b, a))
                    return h.value;
                a = a.sort(c ? function (d, f) {
                    return d - f;
                } : function (d, f) {
                    return f - d;
                });
                return a.indexOf(b) + 1;
            };
            g.RSQ = function (b, a) {
                b = e.parseNumberArray(e.flatten(b));
                a = e.parseNumberArray(e.flatten(a));
                return e.anyIsError(b, a) ? h.value : Math.pow(g.PEARSON(b, a), 2);
            };
            g.SMALL = function (b, a) {
                b = e.parseNumberArray(e.flatten(b));
                a = e.parseNumber(a);
                return e.anyIsError(b, a) ? b : b.sort(function (c, d) {
                    return c - d;
                })[a - 1];
            };
            g.STANDARDIZE = function (b, a, c) {
                b = e.parseNumber(b);
                a = e.parseNumber(a);
                c = e.parseNumber(c);
                return e.anyIsError(b, a, c) ? h.value : (b - a) / c;
            };
            g.STDEV = {};
            g.STDEV.P = function () {
                var b = g.VAR.P.apply(this, arguments);
                return Math.sqrt(b);
            };
            g.STDEV.S = function () {
                var b = g.VAR.S.apply(this, arguments);
                return Math.sqrt(b);
            };
            g.STDEVA = function () {
                var b = g.VARA.apply(this, arguments);
                return Math.sqrt(b);
            };
            g.STDEVPA = function () {
                var b = g.VARPA.apply(this, arguments);
                return Math.sqrt(b);
            };
            g.VAR = {};
            g.VAR.P = function () {
                for (var b = e.numbers(e.flatten(arguments)), a = b.length, c = 0, d = g.AVERAGE(b), f = 0; f < a; f++)
                    c += Math.pow(b[f] - d, 2);
                return c / a;
            };
            g.VAR.S = function () {
                for (var b = e.numbers(e.flatten(arguments)), a = b.length, c = 0, d = g.AVERAGE(b), f = 0; f < a; f++)
                    c += Math.pow(b[f] - d, 2);
                return c / (a - 1);
            };
            g.VARA = function () {
                for (var b = e.flatten(arguments), a = b.length, c = 0, d = 0, f = g.AVERAGEA(b), k = 0; k < a; k++) {
                    var l = b[k];
                    c = 'number' === typeof l ? c + Math.pow(l - f, 2) : !0 === l ? c + Math.pow(1 - f, 2) : c + Math.pow(0 - f, 2);
                    null !== l && d++;
                }
                return c / (d - 1);
            };
            g.VARPA = function () {
                for (var b = e.flatten(arguments), a = b.length, c = 0, d = 0, f = g.AVERAGEA(b), k = 0; k < a; k++) {
                    var l = b[k];
                    c = 'number' === typeof l ? c + Math.pow(l - f, 2) : !0 === l ? c + Math.pow(1 - f, 2) : c + Math.pow(0 - f, 2);
                    null !== l && d++;
                }
                return c / d;
            };
            g.WEIBULL = {};
            g.WEIBULL.DIST = function (b, a, c, d) {
                b = e.parseNumber(b);
                a = e.parseNumber(a);
                c = e.parseNumber(c);
                return e.anyIsError(b, a, c) ? h.value : d ? 1 - Math.exp(-Math.pow(b / c, a)) : Math.pow(b, a - 1) * Math.exp(-Math.pow(b / c, a)) * a / Math.pow(c, a);
            };
            g.Z = {};
            g.Z.TEST = function (b, a, c) {
                b = e.parseNumberArray(e.flatten(b));
                a = e.parseNumber(a);
                if (e.anyIsError(b, a))
                    return h.value;
                c = c || g.STDEV.S(b);
                var d = b.length;
                return 1 - g.NORM.S.DIST((g.AVERAGE(b) - a) / (c / Math.sqrt(d)), !0);
            };
            return g;
        }();
        t.utils = function () {
            return {
                PROGRESS: function (g, b) {
                    return '<div style="width:' + (g ? g : '0') + '%;height:4px;background-color:' + (b ? b : 'red') + ';margin-top:1px;"></div>';
                },
                RATING: function (g) {
                    for (var b = '<div class="jrating">', a = 0; 5 > a; a++)
                        b = a < g ? b + '<div class="jrating-selected"></div>' : b + '<div></div>';
                    return b + '</div>';
                }
            };
        }();
        for (var z = 0; z < Object.keys(t).length; z++)
            for (var C = t[Object.keys(t)[z]], B = Object.keys(C), A = 0; A < B.length; A++)
                if (C[B[A]])
                    if ('function' == typeof C[B[A]] || 'object' == typeof C[B[A]]) {
                        if (q[B[A]] = C[B[A]], q[B[A]].toString = function () {
                                return '#ERROR';
                            }, 'object' == typeof C[B[A]])
                            for (var J = Object.keys(C[B[A]]), H = 0; H < J.length; H++)
                                q[B[A]][J[H]].toString = function () {
                                    return '#ERROR';
                                };
                    } else
                        q[B[A]] = function () {
                            return B[A] + 'Not implemented';
                        };
                else
                    q[B[A]] = function () {
                        return B[A] + 'Not implemented';
                    };
        var I = null, F = null, G = null;
        q.TABLE = function () {
            return G;
        };
        q.COLUMN = q.COL = function () {
            return parseInt(I) + 1;
        };
        q.ROW = function () {
            return parseInt(F) + 1;
        };
        q.CELL = function () {
            return D.getColumnNameFromCoords(I, F);
        };
        q.VALUE = function (g, b, a) {
            return G.getValueFromCoords(parseInt(g) - 1, parseInt(b) - 1, a);
        };
        q.THISROWCELL = function (g) {
            return G.getValueFromCoords(parseInt(g) - 1, parseInt(F));
        };
        var K = function (g, b) {
                for (var a = 0; a < g.length; a++) {
                    var c = D.getTokensFromRange(g[a]);
                    b = b.replace(g[a], '[' + c.join(',') + ']');
                }
                return b;
            }, D = function (g, b, a, c, d) {
                G = d;
                I = a;
                F = c;
                c = '';
                d = Object.keys(b);
                if (d.length) {
                    var f = {};
                    for (a = 0; a < d.length; a++)
                        if (k = d[a].replace(/!/g, '.'), 0 < k.indexOf('.')) {
                            var k = k.split('.');
                            f[k[0]] = {};
                        }
                    k = Object.keys(f);
                    for (a = 0; a < k.length; a++)
                        c += 'var ' + k[a] + ' = {};';
                    for (a = 0; a < d.length; a++)
                        k = d[a].replace(/!/g, '.'), f = b[d[a]], (isNaN(f) || null === f || '' === f) && (f = b[d[a]].match(/(('.*?'!)|(\w*!))?(\$?[A-Z]+\$?[0-9]*):(\$?[A-Z]+\$?[0-9]*)?/g)) && f.length && (b[d[a]] = K(f, b[d[a]])), c = 0 < k.indexOf('.') ? c + (k + ' = ' + b[d[a]] + ';\n') : c + ('var ' + k + ' = ' + b[d[a]] + ';\n');
                }
                g = g.replace(/\$/g, '');
                g = g.replace(/!/g, '.');
                b = '';
                a = 0;
                d = [
                    '=',
                    '!',
                    '>',
                    '<'
                ];
                for (k = 0; k < g.length; k++)
                    '"' == g[k] && (a = 0 == a ? 1 : 0), 1 == a ? b += g[k] : (b += g[k].toUpperCase(), 0 < k && '=' == g[k] && -1 == d.indexOf(g[k - 1]) && -1 == d.indexOf(g[k + 1]) && (b += '='));
                b = b.replace(/\^/g, '**');
                b = b.replace(/<>/g, '!=');
                b = b.replace(/&/g, '+');
                g = b = b.replace(/\$/g, '');
                (f = g.match(/(('.*?'!)|(\w*!))?(\$?[A-Z]+\$?[0-9]*):(\$?[A-Z]+\$?[0-9]*)?/g)) && f.length && (g = K(f, g));
                return new Function(c + '; return ' + g)();
            };
        D.getColumnNameFromCoords = function (g, b) {
            g = parseInt(g);
            var a = '';
            701 < g ? (a += String.fromCharCode(64 + parseInt(g / 676)), a += String.fromCharCode(64 + parseInt(g % 676 / 26))) : 25 < g && (a += String.fromCharCode(64 + parseInt(g / 26)));
            a += String.fromCharCode(65 + g % 26);
            return a + (parseInt(b) + 1);
        };
        D.getCoordsFromColumnName = function (g) {
            var b = /^[a-zA-Z]+/.exec(g);
            if (b) {
                for (var a = 0, c = 0; c < b[0].length; c++)
                    a += parseInt(b[0].charCodeAt(c) - 64) * Math.pow(26, b[0].length - 1 - c);
                a--;
                0 > a && (a = 0);
                g = parseInt(/[0-9]+$/.exec(g)) || null;
                0 < g && g--;
                return [
                    a,
                    g
                ];
            }
        };
        D.getRangeFromTokens = function (g) {
            g = g.filter(function (d) {
                return '#REF!' != d;
            });
            for (var b = '', a = '', c = 0; c < g.length; c++)
                0 <= g[c].indexOf('.') ? b = '.' : 0 <= g[c].indexOf('!') && (b = '!'), b && (a = g[c].split(b), g[c] = a[1], a = a[0] + b);
            g.sort(function (d, f) {
                d = Helpers.getCoordsFromColumnName(d);
                f = Helpers.getCoordsFromColumnName(f);
                return d[1] > f[1] ? 1 : d[1] < f[1] ? -1 : d[0] > f[0] ? 1 : d[0] < f[0] ? -1 : 0;
            });
            return g.length ? a + (g[0] + ':' + g[g.length - 1]) : '#REF!';
        };
        D.getTokensFromRange = function (g) {
            if (0 < g.indexOf('.')) {
                var b = g.split('.');
                g = b[1];
                b = b[0] + '.';
            } else
                0 < g.indexOf('!') ? (b = g.split('!'), g = b[1], b = b[0] + '!') : b = '';
            g = g.split(':');
            var a = D.getCoordsFromColumnName(g[0]), c = D.getCoordsFromColumnName(g[1]);
            if (a[0] <= c[0]) {
                g = a[0];
                var d = c[0];
            } else
                g = c[0], d = a[0];
            if (null === a[1] && null == c[1])
                for (var f = null, k = null, l = Object.keys(vars), m = 0; m < l.length; m++) {
                    var n = D.getCoordsFromColumnName(l[m]);
                    n[0] === a[0] && (null === f || n[1] < f) && (f = n[1]);
                    n[0] === c[0] && (null === k || n[1] > k) && (k = n[1]);
                }
            else
                a[1] <= c[1] ? (f = a[1], k = c[1]) : (f = c[1], k = a[1]);
            for (a = []; f <= k; f++) {
                c = [];
                for (m = g; m <= d; m++)
                    c.push(b + D.getColumnNameFromCoords(m, f));
                a.push(c);
            }
            return a;
        };
        D.setFormula = function (g) {
            for (var b = Object.keys(g), a = 0; a < b.length; a++)
                'function' == typeof g[b[a]] && (q[b[a]] = g[b[a]]);
        };
        return D;
    };
    return 'undefined' !== typeof window ? p(window) : null;
}));
if (!jSuites && typeof require === 'function') {
    var jSuites = require('jsuites');
}
;
(function (E, M) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = M() : typeof define === 'function' && define.amd ? define(M) : E.jspreadsheet = E.jexcel = M();
}(this, function () {
    'use strict';
    var E = function (h, c) {
            h = jSuites.translate(h);
            if (c && c.length)
                for (var a = 0; a < c.length; a++)
                    h = h.replace('{' + a + '}', c[a]);
            return h;
        }, M = function (h, c) {
            Array.isArray(h) && (h = h[0]);
            h = h.replace(new RegExp(/'/g), '').toUpperCase();
            if (void 0 === c)
                return window[h] ? window[h] : null;
            window[h] = c;
        }, ha = function () {
            var h = {
                version: '8.0.58',
                edition: 'Base',
                host: 'https://jspreadsheet.com',
                license: 'Unlicensed',
                print: function () {
                    return ['Jspreadsheet Pro\r\n' + this.edition + ' edition ' + this.version + '\r\n' + this.host + '\r\n' + this.license];
                }
            };
            return function () {
                return h;
            };
        }(), ta = function (h) {
            var c = parseInt(h.y);
            if (h.id)
                var a = parseInt(h.id);
            else
                h.value && (a = parseInt(h.value));
            0 < a && (this.rows[c].id = a, pa.set.call(this, a));
        }, ea = function (h) {
            return ('' + h).substr(0, 1) === '=';
        }, qa = function (h) {
            var c = this.options.columns;
            return c[h] && c[h].name ? c[h].name : h;
        }, I = function (h, c, a) {
            var b;
            if (b = this.options.data[c]) {
                var d = 0 <= h ? qa.call(this, h) : h;
                if (typeof a === 'undefined')
                    a = typeof d === 'number' ? b[h] : jSuites.path.call(b, '' + d);
                else {
                    if (typeof d === 'number')
                        b[h] = a;
                    else
                        jSuites.path.call(b, '' + d, a);
                    !ea(a) && this.records[c][h] && (this.records[c][h].v = a);
                }
            } else
                a = null;
            return a;
        }, J = function (h) {
            return 0 == this.config.editable || h && 0 == h.options.editable ? !1 : (h = Fa.call(this)) ? 7 <= h ? !0 : !1 : !0;
        }, Ga = function (h) {
            var c = 'fullscreen';
            null === h && (h = !b.classList.contains(c));
            if (this.parent)
                var a = this.parent.config, b = this.parent.element, d = this;
            else
                a = this.config, b = this.element, d = t.current ? t.current : null;
            h ? (b.classList.add(c), a.fullscreen = !0) : (b.classList.remove(c), a.fullscreen = !1);
            d && (this.tbody.innerHTML = '', B.call(d), N.refresh.call(d), ba.update.call(d.parent, d));
        }, Ha = function (h) {
            var c = this.loading;
            null === h && (h = c.style.display == 'block' ? !0 : !1);
            c.style.display = h ? 'block' : '';
            setTimeout(function () {
                c.style.display = '';
            }, 1000);
        }, Ca = function (h, c) {
            if (typeof h === 'string') {
                var a = z.getCoordsFromColumnName(h);
                a = this.records[a[1]][a[0]];
                if (a.element)
                    h = a.element;
                else
                    return typeof c === 'undefined' ? a.readonly : a.readonly = c ? !0 : !1;
            }
            a = 'readonly';
            h = h.classList;
            if (typeof c === 'undefined')
                return h.contains(a) ? !0 : !1;
            if (c)
                h.add(a);
            else
                h.remove(a);
        }, Ia = function (h) {
            var c = 'jss_hidden_index', a = this.table.classList;
            typeof h == 'undefined' && (h = !a.contains(c));
            if (h)
                a.remove(c);
            else
                a.add(c);
            this.refreshBorders();
        }, Fa = function (h) {
            if (void 0 === h)
                return this.status;
            var c = document.createElement('div');
            c.style.textAlign = 'right';
            c.style.fontSize = '10px';
            c.style.cursor = 'pointer';
            c.onclick = function () {
                window.location.href = ha().host + '/v8';
            };
            var a = null, b = [
                    74,
                    50,
                    48,
                    50,
                    48,
                    33
                ].join('');
            (function (e) {
                a = 1;
                try {
                    if (e) {
                        var f = window.atob(e);
                        f = f.split(',');
                        if (f[1]) {
                            f[1] = window.atob(f[1]);
                            var g = f[0];
                            e = b;
                            var k = f[1], n = jSuites.sha512, m = '', p = '';
                            128 < e.length && (e = n(e));
                            for (var q = 0; 128 > q; q++) {
                                var r = e[q] ? e[q].charCodeAt(0) : 0;
                                m += String.fromCharCode(54 ^ r);
                                p += String.fromCharCode(92 ^ r);
                            }
                            var u = n(p + n(m + k));
                            if (g != u)
                                a = 3;
                            else if (f[1] = JSON.parse(f[1]), f[1].date) {
                                var l = window.location.hostname || 'localhost', w = l.split('.');
                                l = l.split('.');
                                if (2 < l.length && !jSuites.isNumeric(l[l.length - 1]))
                                    w.shift();
                                w = w.join('.');
                                l = l.join('.');
                                if (-1 == f[1].domain.indexOf(w) && -1 == f[1].domain.indexOf(l))
                                    a = 4;
                                else if (f[1].scope && 0 <= f[1].scope.indexOf('v8')) {
                                    l = new Date();
                                    w = parseInt(l.getTime() / 1000);
                                    var v = ha();
                                    f[1].date < w ? (a = f[1].date + 2592000 < w && !f[1].plan || f[1].date + 15552000 < w ? 6 : 7, v.license = f[1].name + ' (Expired)') : (a = 8, v.license = 'Licensed to: ' + f[1].name, v.edition = 3 == f[1].plan || 6 == f[1].plan ? 'Premium' : 'Base');
                                } else
                                    a = 5;
                            } else
                                a = 4;
                        } else
                            a = 2;
                    }
                } catch (x) {
                }
            }(h));
            h = '';
            if (1 == a)
                h = 'License required';
            else if (2 == a || 3 == a || 4 == a)
                h = 'A valid license is required';
            else if (5 == a)
                h = 'This version is not included on the scope of this license';
            else if (6 == a || 7 == a)
                h = 'Your license is expired';
            c.appendChild(document.createTextNode(h));
            if (8 > a)
                try {
                    if (typeof sessionStorage !== 'undefined' && !sessionStorage.getItem('jspreadsheet')) {
                        sessionStorage.setItem('jspreadsheet', !0);
                        var d = document.createElement('img');
                        d.src = ha().host + '/jspreadsheet/' + 'logo.png';
                        d.style.display = 'none';
                        c.appendChild(d);
                    }
                } catch (e) {
                }
            Object.defineProperty(this, 'status', {
                value: a,
                writable: !1,
                configurable: !1,
                enumerable: !1,
                extensible: !1
            });
            ha().edition === 'Premium' && (this.edition = 1);
            return c;
        }, N = function () {
            var h = function () {
                    if (this.edition) {
                        var d = this.edition.getAttribute('data-x'), e = this.edition.getAttribute('data-y');
                        Z.position.call(this, d, e);
                    }
                }, c = function () {
                    if (this.scrollX.scrollWidth < this.scrollX.scrollLeft + this.scrollX.offsetWidth + 25) {
                        if (this.content.scrollLeft = this.content.scrollWidth, 0 < this.options.freezeColumns)
                            ca.refresh.call(this);
                    } else
                        this.content.scrollLeft = 0;
                    h.call(this);
                }, a = function () {
                    var d = this.scrollY.scrollTop + this.scrollY.offsetHeight + 13, e = this.tbody.lastChild.getAttribute('data-y'), f = this.results ? this.rows[this.results[this.results.length - 1]].y : this.rows[this.rows.length - 1].y;
                    this.content.scrollTop = this.scrollY.scrollHeight < d && e == f ? this.content.scrollHeight : 0;
                    h.call(this);
                }, b = function () {
                    if (B.limited.call(this)) {
                        var d = ja.getWidth.call(this), e = this.content.offsetWidth, f = this.content.offsetHeight;
                        this.width = b.width.call(this) + (d ? d : 1);
                        this.height = b.height.call(this);
                        this.tfoot.offsetHeight && (this.height += this.tfoot.offsetHeight + 26);
                        this.scrollX.firstChild.style.width = this.width + 'px';
                        this.scrollY.firstChild.style.height = this.height + 'px';
                        this.scrollX.style.width = e + 'px';
                        this.scrollY.style.height = f + 'px';
                        this.scrollX.style.display = this.width > e ? '' : 'none';
                        this.scrollY.style.display = this.height > f ? '' : 'none';
                    } else
                        this.scrollX.style.display = 'none', this.scrollY.style.display = 'none';
                };
            b.refresh = function () {
                this.scrollY.scrollTop = 0;
                this.scrollX.scrollLeft = 0;
                b.call(this);
            };
            b.updateX = function () {
                if (b.event)
                    return !1;
                var d = parseInt(this.thead.lastChild.children[(this.options.freezeColumns || 0) + 1].getAttribute('data-x'));
                b.setX.call(this, b.width.call(this, d));
                c.call(this);
            };
            b.updateY = function () {
                if (b.event)
                    return !1;
                if (this.tbody.firstChild) {
                    var d = parseInt(this.tbody.firstChild.getAttribute('data-y'));
                    b.setY.call(this, b.height.call(this, d));
                    a.call(this);
                }
            };
            b.setX = function (d) {
                b.ignore = !0;
                this.scrollX.scrollLeft = d;
            };
            b.setY = function (d) {
                b.ignore = !0;
                this.scrollY.scrollTop = d;
            };
            b.update = function (d, e) {
                e == 'X' ? (d = b.width.call(this, null, d.target.scrollLeft / (d.target.scrollWidth - this.content.offsetWidth) * this.width), B.reset.call(this), B.goto.call(this, null, d), c.call(this)) : (d = b.height.call(this, null, d.target.scrollTop / (d.target.scrollHeight - this.content.offsetHeight) * (this.height - (this.tbody.offsetHeight - 5))), this.tbody.textContent = '', B.goto.call(this, d), a.call(this));
            };
            b.build = function (d) {
                var e = this, f = document.createElement('div'), g = document.createElement('div');
                f.className = 'jss_scroll' + d;
                g.className = 'jss_control' + d;
                f.appendChild(g);
                d == 'X' ? f.style.height = '10px' : f.style.width = '10px';
                f.onscroll = function (k) {
                    if (b.ignore)
                        return b.ignore = !1;
                    b.event = !0;
                    b.update.call(e, k, d);
                    b.event = !1;
                };
                return f;
            };
            b.width = function (d, e) {
                for (var f = this.options.columns, g = 0, k = this.options.freezeColumns || 0; k < this.options.columns.length; k++) {
                    if (d === k)
                        return g;
                    !1 !== f[k].visible && f[k].type !== 'hidden' && (g += parseInt(f[k].width));
                    if (g >= e)
                        return k;
                }
                return e ? k : g;
            };
            b.height = function (d, e) {
                var f = 0, g = 0;
                this.options.defaultRowHeight || (this.options.defaultRowHeight = 26);
                for (var k = this.results ? this.results : this.rows, n = 0; n < k.length; n++) {
                    g = n;
                    this.results && (g = k[n]);
                    if (d === g)
                        return f;
                    this.rows[g] && !1 !== this.rows[g].visible && (f = this.rows[g].height ? f + parseInt(this.rows[g].height) : f + parseInt(this.options.defaultRowHeight));
                    if (f >= e)
                        return g;
                }
                return e ? g : f;
            };
            return b;
        }(), B = function () {
            var h = function () {
                h.reset.call(this, !0);
                h.renderX.call(this, 0);
                h.renderY.call(this, 0);
                ja.headers.call(this);
                if (0 < this.options.pagination)
                    ra.update.call(this);
                T.update.call(this);
                this.refreshBorders();
                N.call(this);
            };
            h.limited = function () {
                return 1 == this.options.tableOverflow || 1 == this.parent.config.fullscreen;
            };
            h.refresh = function () {
                if (!this.tbody.lastChild)
                    return !1;
                var c = parseInt(this.thead.lastChild.lastChild.getAttribute('data-x')) + 1, a = parseInt(this.tbody.lastChild.getAttribute('data-y'));
                this.results ? (a = this.results.indexOf(a), a < this.results.length - 1 && a++, a = this.results[a]) : a++;
                h.renderX.call(this, c);
                h.renderY.call(this, a);
                h.adjustX.call(this, !1);
                h.adjustY.call(this, !1);
                N.call(this);
            };
            h.renderX = function (c, a, b) {
                var d = this.options.columns, e = 0, f = [], g = (this.options.freezeColumns || 0) + 1;
                1 == this.parent.config.fullscreen ? e = this.content.offsetWidth : 1 == this.options.tableOverflow && (e = parseInt(this.options.tableWidth));
                var k = this.headerContainer.offsetWidth || 0;
                for (b ||= 0; d[c] && (!e || k < e || 0 < b);) {
                    !1 !== d[c].visible && d[c].type !== 'hidden' && (k += parseInt(d[c].width));
                    0 < b && b--;
                    var n = X.getWidth.call(this, c, f);
                    n > b && (b = n);
                    a ? (h.renderColumn.call(this, c, g), c--) : (h.renderColumn.call(this, c), c++);
                }
                X.batch.call(this, f);
            };
            h.renderY = function (c, a, b) {
                var d = 0, e = [];
                1 == this.parent.config.fullscreen ? d = this.content.offsetHeight : 1 == this.options.tableOverflow && (d = parseInt(this.options.tableHeight));
                d && (d -= this.thead.offsetHeight + 4, this.tfoot.offsetHeight && (d -= this.tfoot.offsetHeight + 14));
                var f = this.tbody.offsetHeight;
                var g = parseInt(this.headerContainer.children[(this.options.freezeColumns || 0) + 1].getAttribute('data-x')), k = parseInt(this.headerContainer.lastChild.getAttribute('data-x')), n = this.results ? this.results.indexOf(c) : c, m = parseInt(this.options.pagination) || 0, p = this.tbody.children.length || 0, q = !1;
                for (b ||= 0; this.options.data && this.options.data[c] && (!m || p < m || 0 < b) && (!d || f <= d || 0 < b);) {
                    var r = h.renderRow.call(this, c, g, k);
                    a ? (this.tbody.insertBefore(r, this.tbody.firstChild), n--) : (this.tbody.appendChild(r), n++);
                    this.rows[c].height ? (r.offsetHeight !== this.rows[c].height && (this.rows[c].height = r.offsetHeight, q = !0), f += this.rows[c].height) : (f += this.rows[c].height = r.offsetHeight, q = !0);
                    0 < b && b--;
                    c = X.getHeight.call(this, c, e);
                    c > b && (b = c);
                    c = this.results ? this.results[n] : n;
                    p++;
                }
                X.batch.call(this, e);
                if (q)
                    N.call(this);
            };
            h.renderColumn = function (c, a, b) {
                if (!this.headers[c])
                    ya.create.call(this, c);
                if (this.options.nestedHeaders)
                    for (b = 0; b < this.options.nestedHeaders.length; b++) {
                        var d = ka.getColumns.call(this, b);
                        if (void 0 !== d[c])
                            ka.renderCell.call(this, d[c], b, a);
                    }
                if (this.options.footers)
                    for (b = 0; b < this.options.footers.length; b++)
                        if (d = W.create.call(this, c, b), null === a)
                            this.tfoot.children[b].appendChild(d);
                        else
                            this.tfoot.children[b].insertBefore(d, this.tfoot.children[b].children[a]);
                null === a ? (this.headerContainer.appendChild(this.headers[c]), this.colgroupContainer.appendChild(this.colgroup[c])) : (this.headerContainer.insertBefore(this.headers[c], this.headerContainer.children[a]), this.colgroupContainer.insertBefore(this.colgroup[c], this.colgroupContainer.children[a]));
                if (this.tbody.children.length)
                    for (b = 0; b < this.tbody.children.length; b++)
                        if (d = parseInt(this.tbody.children[b].getAttribute('data-y')), d = H.get.call(this, c, d))
                            if (null === a)
                                this.tbody.children[b].appendChild(d);
                            else
                                this.tbody.children[b].insertBefore(d, this.tbody.children[b].children[a]);
            };
            h.renderRow = function (c, a, b, d) {
                var e = this.options.freezeColumns || 0;
                null == a && (a = parseInt(this.headerContainer.children[e + 1].getAttribute('data-x')));
                null == b && (b = parseInt(this.headerContainer.lastChild.getAttribute('data-x')));
                var f = va.create.call(this, c, d);
                if (f.children.length)
                    for (; f.children[e + 1];)
                        f.removeChild(f.lastChild);
                if (0 < e) {
                    for (var g = 0; g < e; g++)
                        f.appendChild(H.get.call(this, g, c));
                    ja.update.call(this, c);
                }
                for (g = a; g <= b; g++)
                    a = H.get.call(this, g, c, d), f.appendChild(a);
                return f;
            };
            h.resetY = function () {
                if (this.options.pagination) {
                    this.pageNumber || (this.pageNumber = 0);
                    var c = this.options.pagination * this.pageNumber;
                } else
                    c = 0;
                var a = 0;
                if (this.merged.rows[c]) {
                    for (a = this.options.pagination; this.merged.rows[c] && 0 <= c;)
                        c--;
                    c++;
                }
                this.tbody.textContent = '';
                this.results && this.results.length && (c = this.results[c]);
                if (!this.results || 0 < this.results.length)
                    B.renderY.call(this, c, 0, a);
                if (0 < this.options.pagination)
                    ra.update.call(this);
                N.call(this);
                this.refreshBorders();
            };
            h.goto = function (c, a) {
                if (null !== c && 0 <= c)
                    if (0 < this.options.pagination)
                        this.page(this.whichPage(c));
                    else if (this.rows[c] || (c = this.options.data.length - 1), !va.attached.call(this, c)) {
                        if (this.merged.rows[c]) {
                            for (; this.merged.rows[c] && 0 <= c;)
                                c--;
                            c++;
                        }
                        this.tbody.textContent = '';
                        h.renderY.call(this, c);
                        if (0 < c)
                            h.renderY.call(this, c - 1, !0);
                        N.updateY.call(this);
                    }
                if (null !== a && 0 <= a && (this.options.columns[a] || (a = this.options.columns.length - 1), c ||= h.getY.call(this), !H.attached.call(this, a, c))) {
                    if (this.merged.cols[a]) {
                        for (var b = c = 0; b < this.rows.length; b++)
                            this.records[b][a].merged && (c = this.records[b][a].merged[0]);
                        a -= c;
                    }
                    h.reset.call(this);
                    h.renderX.call(this, a);
                    if (0 < a)
                        h.renderX.call(this, a - 1, !0);
                    N.updateX.call(this);
                }
                this.refreshBorders();
            };
            h.pageUp = function (c, a, b) {
                var d = parseInt(this.tbody.firstChild.getAttribute('data-y'));
                if (a) {
                    c = null;
                    var e = this.results ? this.results[0] : 0;
                } else
                    this.results ? (e = this.results.indexOf(d), 0 < e && e--, e = this.results[e]) : (e = d, 0 < e && e--);
                if (e < d) {
                    if (null == c)
                        this.tbody.textContent = '';
                    else {
                        d = c;
                        if (this.options.mergeCells) {
                            var f = parseInt(this.tbody.lastChild.getAttribute('data-y'));
                            d += X.getHeight.call(this, f);
                        }
                        for (f = 0; f < d; f++)
                            this.tbody.removeChild(this.tbody.lastChild);
                    }
                    h.renderY.call(this, e, !a, c);
                    h.adjustY.call(this, !1);
                    if (b)
                        b.preventDefault();
                    N.updateY.call(this);
                }
                this.refreshBorders();
            };
            h.pageDown = function (c, a, b) {
                var d = parseInt(this.tbody.lastChild.getAttribute('data-y'));
                if (a) {
                    c = null;
                    var e = this.results ? this.results[this.results.length - 1] : this.rows.length - 1;
                } else
                    this.results ? (e = this.results.indexOf(d), e < this.results.length - 1 && e++, e = this.results[e]) : (e = d, d < this.options.data.length - 1 && e++);
                if (e > d) {
                    if (null == c)
                        this.tbody.textContent = '';
                    else {
                        d = c;
                        if (this.options.mergeCells) {
                            var f = parseInt(this.tbody.firstChild.getAttribute('data-y'));
                            d += X.getHeight.call(this, f);
                        }
                        for (f = 0; f < d; f++)
                            this.tbody.removeChild(this.tbody.firstChild);
                    }
                    h.renderY.call(this, e, a, c);
                    h.adjustY.call(this, !0);
                    if (b)
                        b.preventDefault();
                    N.updateY.call(this);
                }
                this.refreshBorders();
            };
            h.removeColumns = function (c, a) {
                var b = null === a ? this.headerContainer.lastChild : this.headerContainer.children[a];
                if (b)
                    b = parseInt(b.getAttribute('data-x'));
                else
                    return !1;
                if (this.options.mergeCells) {
                    for (var d = 0, e = b, f = 0; f < c; f++) {
                        var g = X.getWidth.call(this, e);
                        g > d && (d = g);
                        null === a ? e-- : e++;
                    }
                    c += d;
                }
                c >= this.headerContainer.children.length && (c = this.headerContainer.children.length - 1);
                if ((d = this.options.nestedHeaders) && d.length)
                    for (e = 0; e < d.length; e++)
                        for (g = ka.getColumns.call(this, e), f = 0; f < c; f++)
                            if (void 0 !== g[b + f] && this.nested.content[e][g[b + f]]) {
                                var k = this.nested.content[e][g[b + f]].element, n = k.getAttribute('colspan');
                                0 < n && n--;
                                if (0 < n)
                                    k.setAttribute('colspan', n);
                                else if (k.parentNode)
                                    this.thead.children[e].removeChild(k);
                            }
                for (f = 0; f < c; f++)
                    null === a ? (this.headerContainer.removeChild(this.headerContainer.lastChild), this.colgroupContainer.removeChild(this.colgroupContainer.lastChild)) : this.headerContainer.children[a] && (this.headerContainer.removeChild(this.headerContainer.children[a]), this.colgroupContainer.removeChild(this.colgroupContainer.children[a]));
                for (e = 0; e < this.tbody.children.length; e++)
                    for (f = 0; f < c; f++)
                        if (null === a)
                            this.tbody.children[e].removeChild(this.tbody.children[e].lastChild);
                        else if (this.tbody.children[e].children[a])
                            this.tbody.children[e].removeChild(this.tbody.children[e].children[a]);
                for (e = 0; e < this.tfoot.children.length; e++)
                    for (f = 0; f < c; f++)
                        if (null === a)
                            this.tfoot.children[e].removeChild(this.tfoot.children[e].lastChild);
                        else
                            this.tfoot.children[e].removeChild(this.tfoot.children[e].children[a]);
            };
            h.pageLeft = function (c, a) {
                var b = this.options.freezeColumns || 0;
                if (a) {
                    c = null;
                    var d = b;
                } else
                    d = parseInt(this.thead.lastChild.children[b + 1].getAttribute('data-x')) - 1;
                if (d >= b) {
                    if (null == c)
                        h.reset.call(this);
                    else
                        h.removeColumns.call(this, c, null);
                    h.renderX.call(this, d, !a, c);
                    h.adjustX.call(this, !1);
                    N.updateX.call(this);
                }
                this.refreshBorders();
            };
            h.pageRight = function (c, a) {
                var b = this.options.freezeColumns || 0;
                if (a) {
                    c = null;
                    var d = this.options.columns.length - 1;
                } else
                    d = parseInt(this.thead.lastChild.lastChild.getAttribute('data-x')) + 1;
                if (d < this.options.columns.length) {
                    if (null == c)
                        h.reset.call(this);
                    else
                        h.removeColumns.call(this, c, b + 1);
                    h.renderX.call(this, d, a, c);
                    h.adjustX.call(this, !0);
                    N.updateX.call(this);
                }
                this.refreshBorders();
            };
            h.reset = function (c) {
                1 < this.headerContainer.children.length && (c = c ? 0 : this.options.freezeColumns || 0, h.removeColumns.call(this, this.headerContainer.children.length - (c + 1), c + 1));
            };
            h.getX = function () {
                if (this.thead.lastChild)
                    return parseInt(this.thead.lastChild.children[1].getAttribute('data-x'));
            };
            h.getY = function () {
                if (this.tbody.firstChild)
                    return parseInt(this.tbody.firstChild.getAttribute('data-y'));
            };
            h.adjustX = function (c, a) {
                var b = this.options.freezeColumns || 0;
                if (c) {
                    a = this.options.columns.length - 1;
                    var d = parseInt(this.tbody.firstChild.lastChild.getAttribute('data-x'));
                    b = parseInt(this.tbody.firstChild.children[b + 1].getAttribute('data-x'));
                } else
                    a = b, d = parseInt(this.tbody.firstChild.children[b + 1].getAttribute('data-x')), b = parseInt(this.tbody.firstChild.lastChild.getAttribute('data-x'));
                d === a && (c ? b-- : b++, h.renderX.call(this, b, c));
            };
            h.adjustY = function (c, a) {
                if (c) {
                    a = this.rows.length - 1;
                    var b = parseInt(this.tbody.lastChild.getAttribute('data-y')), d = parseInt(this.tbody.firstChild.getAttribute('data-y'));
                } else
                    a = 0, b = parseInt(this.tbody.firstChild.getAttribute('data-y')), d = parseInt(this.tbody.lastChild.getAttribute('data-y'));
                b == a && (this.results ? (a = this.results.indexOf(d), d = c ? this.results[a - 1] : this.results[a + 1]) : c ? d-- : d++, h.renderY.call(this, d, c));
            };
            h.isVisible = function (c, a) {
                var b = this.thead.clientHeight;
                a ||= 1;
                var d = !1, e = !1, f = c.getAttribute('data-x'), g = c.getAttribute('data-y');
                var k = this.records[g][f];
                k.merged && (f -= k.merged[0], g -= k.merged[1], c = this.records[g][f].element);
                g = this.content.getBoundingClientRect();
                k = c.getBoundingClientRect();
                var n = ja.getWidth.call(this), m = g.left + n, p = g.left + g.width;
                f = g.top + b;
                var q = g.top + g.height;
                var r = 0;
                g = k.top;
                g >= f && g <= q || (r++, d = !0);
                g = k.top + k.height;
                g >= f && g <= q || r++;
                if (r >= a)
                    return 2 > a && (a = this.content.scrollTop, 0 == d ? q - f > k.height && (this.content.scrollTop += g - q + 3, N.ignore = !0, this.scrollY.scrollTop += g - q + 3) : (this.content.scrollTop = c.offsetTop - b, N.ignore = !0, this.scrollY.scrollTop -= a - this.content.scrollTop)), !1;
                if (!n || !c.classList.contains('jss_freezed'))
                    if (r = 0, f = k.left, f >= m && f <= p || (r++, e = !0), f = k.left + k.width, f >= m && f < p || r++, r >= a)
                        return 2 > a && (a = this.content.scrollLeft, 0 == e ? p - m > k.width && (this.content.scrollLeft += f - p + 3, N.ignore = !0, this.scrollX.scrollLeft += f - p + 3) : (this.content.scrollLeft = c.offsetLeft - m - 50, N.ignore = !0, this.scrollX.scrollLeft -= a - this.content.scrollLeft)), !1;
                return !0;
            };
            return h;
        }(), Pa = function (h, c, a, b) {
            var d = c, e = null;
            if (this.results && (c = this.results.indexOf(c), -1 == c))
                return d;
            for (; 0 < c;) {
                c--;
                var f = this.results ? this.results[c] : c;
                if (!1 !== this.rows[f].visible) {
                    var g = this.records[f][h].v === '' ? !1 : !0;
                    null === e && (e = g);
                    if (this.records[f][h].element && this.records[f][h].element.style.display == 'none') {
                        if (this.records[f][h].merged) {
                            d = f - this.records[f][h].merged[1];
                            if (!a)
                                break;
                            g = !0;
                        }
                    } else {
                        if (a && g !== e && !b)
                            break;
                        if (a)
                            d = this.records[f][h].merged ? f - this.records[f][h].merged[1] : f;
                        else
                            return f;
                    }
                    e = g;
                }
            }
            return d;
        }, Qa = function (h, c, a, b) {
            var d = c, e = null;
            if (this.results) {
                c = this.results.indexOf(c);
                if (-1 == c)
                    return d;
                var f = this.results.length - 1;
            } else
                f = this.rows.length - 1;
            for (; c < f;) {
                c++;
                var g = this.results ? this.results[c] : c;
                if (!1 !== this.rows[g].visible) {
                    var k = this.records[g][h].v === '' ? !1 : !0;
                    null === e && (e = k);
                    if (this.records[g][h].element && this.records[g][h].element.style.display == 'none') {
                        if (this.records[g][h].merged) {
                            if (!this.records[g][h].merged[1] && (d = g, !a))
                                break;
                            k = !0;
                        }
                    } else {
                        if (a && k !== e && !b)
                            break;
                        if (a)
                            d = g;
                        else
                            return g;
                    }
                    e = k;
                }
            }
            return d;
        }, Ja = function (h, c, a, b) {
            for (var d = this.options.columns, e = h, f, g = null; h < d.length - 1;)
                if (h++, !1 !== d[h].visible && d[h].type !== 'hidden') {
                    f = this.records[c] && this.records[c][h].v === '' ? !1 : !0;
                    null === g && (g = f);
                    if (this.records[c] && this.records[c][h].element && this.records[c][h].element.style.display == 'none') {
                        if (this.records[c][h].merged) {
                            if (h == h + this.records[c][h].merged[0] && (e = h, !a))
                                break;
                            f = !1;
                        }
                    } else {
                        if (a && f !== g && !b)
                            break;
                        if (a)
                            e = h;
                        else
                            return h;
                    }
                    g = f;
                }
            return e;
        }, Ka = function (h, c, a, b) {
            for (var d = this.options.columns, e = h, f, g = null; 0 < h;)
                if (h--, !1 !== d[h].visible && d[h].type !== 'hidden') {
                    f = this.records[c] && this.records[c][h].v === '' ? !1 : !0;
                    null === g && (g = f);
                    if (this.records[c] && this.records[c][h].element && this.records[c][h].element.style.display == 'none') {
                        if (this.records[c][h].merged) {
                            e = h - this.records[c][h].merged[0];
                            if (!a)
                                break;
                            f = !0;
                        }
                    } else {
                        if (a && f !== g && !b)
                            break;
                        if (a)
                            e = h;
                        else
                            return h;
                    }
                    g = f;
                }
            return e;
        }, Ra = function () {
            var h = function (a, b, d, e) {
                    if (1 == a || 3 == a) {
                        if (!va.attached.call(this, d))
                            if (0 < this.options.pagination)
                                this.page(this.whichPage(d));
                            else {
                                if (1 == a)
                                    B.pageUp.call(this, 1, e);
                                else
                                    B.pageDown.call(this, 1, e);
                                if (!va.attached.call(this, d))
                                    B.goto.call(this, d);
                            }
                    } else if (!H.attached.call(this, b, d)) {
                        if (0 == a)
                            B.pageLeft.call(this, 1, e);
                        else
                            B.pageRight.call(this, 1, e);
                        if (!H.attached.call(this, b, d))
                            B.goto.call(this, d, b);
                    }
                }, c = function (a) {
                    a.up = c.up;
                    a.down = c.down;
                    a.right = c.right;
                    a.left = c.left;
                    a.last = c.last;
                    a.first = c.first;
                };
            c.up = function (a, b, d) {
                if (a)
                    var e = parseInt(this.selectedCell[2]), f = parseInt(this.selectedCell[3]);
                else
                    e = parseInt(this.selectedCell[0]), f = parseInt(this.selectedCell[1]);
                d = Pa.call(this, e, f, b, d);
                d != f && (f = d, a ? (a = this.selectedCell[0], d = this.selectedCell[1]) : (a = e, d = f, e = a, f = d), h.call(this, 1, e, f, b), this.updateSelectionFromCoords(a, d, e, f));
            };
            c.down = function (a, b, d) {
                if (a)
                    var e = parseInt(this.selectedCell[2]), f = parseInt(this.selectedCell[3]);
                else
                    e = parseInt(this.selectedCell[0]), f = parseInt(this.selectedCell[1]);
                d = Qa.call(this, e, f, b, d);
                d != f && (f = d, a ? (a = this.selectedCell[0], d = this.selectedCell[1]) : (a = e, d = f, e = a, f = d), h.call(this, 3, e, f, b), this.updateSelectionFromCoords(a, d, e, f));
            };
            c.right = function (a, b, d) {
                if (a)
                    var e = parseInt(this.selectedCell[2]), f = parseInt(this.selectedCell[3]);
                else
                    e = parseInt(this.selectedCell[0]), f = parseInt(this.selectedCell[1]);
                d = Ja.call(this, e, f, b, d);
                d != e && (e = d, a ? (a = this.selectedCell[0], d = this.selectedCell[1]) : (a = e, d = f, e = a, f = d), h.call(this, 2, e, f, b), this.updateSelectionFromCoords(a, d, e, f));
            };
            c.left = function (a, b, d) {
                if (a)
                    var e = parseInt(this.selectedCell[2]), f = parseInt(this.selectedCell[3]);
                else
                    e = parseInt(this.selectedCell[0]), f = parseInt(this.selectedCell[1]);
                d = Ka.call(this, e, f, b, d);
                d != e && (e = d, a ? (a = this.selectedCell[0], d = this.selectedCell[1]) : (a = e, d = f, e = a, f = d), h.call(this, 0, e, f, b), this.updateSelectionFromCoords(a, d, e, f));
            };
            c.first = function (a, b) {
                if (b)
                    c.up.call(this, a, !0, !0);
                else
                    c.left.call(this, a, !0, !0);
            };
            c.last = function (a, b) {
                if (b)
                    c.down.call(this, a, !0, !0);
                else
                    c.right.call(this, a, !0, !0);
            };
            return c;
        }(), Sa = function () {
            return function (h) {
                h.save = La;
                h.fullscreen = Ga;
                h.setReadOnly = Ca;
                h.getReadOnly = Ca;
                h.isReadOnly = Ca;
                h.setPlugins = function (c) {
                    la.call(this.parent, c);
                };
                h.showIndex = function () {
                    Ia.call(this, !0);
                };
                h.hideIndex = function () {
                    Ia.call(this, !1);
                };
                h.goto = B.goto;
                h.undo = function () {
                    O.undo.call(h.parent);
                };
                h.redo = function () {
                    O.redo.call(h.parent);
                };
                h.isEditable = function () {
                    return J.call(h.parent, h);
                };
                h.dispatch = function () {
                    return A.apply(this.parent, arguments);
                };
                h.setViewport = function (c, a) {
                    this.options.tableOverflow = !0;
                    c = parseInt(c);
                    a = parseInt(a);
                    100 < c && (this.options.tableWidth = c + 'px', this.content.style.maxWidth = this.options.tableWidth);
                    100 < a && (this.options.tableHeight = parseInt(a) + 'px', this.content.style.maxHeight = this.options.tableHeight);
                    this.tbody.innerHTML = '';
                    B.call(this);
                    N.refresh.call(this);
                    ba.update.call(this.parent, this);
                };
            };
        }(), za = function () {
            var h = {
                    logo: null,
                    url: null,
                    persistence: !1,
                    sequence: !0,
                    data: null,
                    json: null,
                    rows: [],
                    columns: [],
                    cells: {},
                    role: null,
                    nestedHeaders: null,
                    defaultColWidth: 100,
                    defaultRowHeight: 0,
                    defaultColAlign: 'center',
                    minSpareRows: 0,
                    minSpareCols: 0,
                    minDimensions: [
                        0,
                        0
                    ],
                    csv: null,
                    csvFileName: 'jspreadsheet',
                    csvHeaders: !0,
                    csvDelimiter: ',',
                    columnSorting: !0,
                    columnDrag: !0,
                    columnResize: !0,
                    rowResize: !0,
                    rowDrag: !0,
                    editable: !0,
                    allowInsertRow: !0,
                    allowManualInsertRow: !0,
                    allowInsertColumn: !0,
                    allowManualInsertColumn: !0,
                    allowDeleteRow: !0,
                    allowDeletingAllRows: !1,
                    allowDeleteColumn: !0,
                    allowRenameColumn: !0,
                    allowComments: !0,
                    selectionCopy: !0,
                    mergeCells: {},
                    search: !1,
                    pagination: !1,
                    paginationOptions: null,
                    textOverflow: !1,
                    tableOverflow: !1,
                    tableHeight: '300px',
                    tableWidth: null,
                    comments: null,
                    meta: null,
                    style: {},
                    freezeColumns: 0,
                    orderBy: null,
                    worksheetId: '',
                    worksheetName: null,
                    worksheetState: null,
                    filters: !1,
                    footers: null,
                    validations: null,
                    formify: null,
                    applyMaskOnFooters: !1,
                    pluginOptions: null,
                    locked: !1,
                    selectUnLockedCells: !0,
                    selectLockedCells: !0
                }, c = {
                    application: 'Jspreadsheet Pro',
                    cloud: null,
                    root: null,
                    definedNames: {},
                    sorting: null,
                    server: null,
                    toolbar: null,
                    editable: !0,
                    allowExport: !0,
                    includeHeadersOnDownload: !1,
                    forceUpdateOnPaste: !1,
                    loadingSpin: !1,
                    fullscreen: !1,
                    secureFormulas: !0,
                    parseFormulas: !0,
                    debugFormulas: !1,
                    editorFormulas: !0,
                    autoIncrement: !0,
                    autoCasting: !0,
                    stripHTML: !1,
                    tabs: !1,
                    allowDeleteWorksheet: !0,
                    allowRenameWorksheet: !0,
                    allowMoveWorksheet: !0,
                    onevent: null,
                    onclick: null,
                    onload: null,
                    onundo: null,
                    onredo: null,
                    onbeforesave: null,
                    onsave: null,
                    onbeforechange: null,
                    onchange: null,
                    onafterchanges: null,
                    oncopy: null,
                    onbeforepaste: null,
                    onpaste: null,
                    onbeforeinsertrow: null,
                    oninsertrow: null,
                    onbeforedeleterow: null,
                    ondeleterow: null,
                    onbeforeinsertcolumn: null,
                    oninsertcolumn: null,
                    onbeforedeletecolumn: null,
                    ondeletecolumn: null,
                    onmoverow: null,
                    onmovecolumn: null,
                    onresizerow: null,
                    onresizecolumn: null,
                    onselection: null,
                    onbeforecomments: null,
                    oncomments: null,
                    onbeforesort: null,
                    onsort: null,
                    onfocus: null,
                    onblur: null,
                    onmerge: null,
                    onchangeheader: null,
                    onchangefooter: null,
                    onchangefootervalue: null,
                    onchangenested: null,
                    onchangenestedcell: null,
                    oncreateeditor: null,
                    oneditionstart: null,
                    oneditionend: null,
                    onchangestyle: null,
                    onchangemeta: null,
                    onbeforechangepage: null,
                    onchangepage: null,
                    onbeforecreateworksheet: null,
                    oncreateworksheet: null,
                    onrenameworksheet: null,
                    ondeleteworksheet: null,
                    onmoveworksheet: null,
                    onopenworksheet: null,
                    onchangerowid: null,
                    onbeforesearch: null,
                    onsearch: null,
                    onbeforefilter: null,
                    onfilter: null,
                    oncreatecell: null,
                    oncreaterow: null,
                    updateTable: null,
                    contextMenu: null,
                    parseTableFirstRowAsHeader: !1,
                    parseTableAutoCellType: !1,
                    plugins: null,
                    wordWrap: !0,
                    about: !0,
                    license: null,
                    worksheets: null
                }, a = function (e, f) {
                    f = JSON.parse(JSON.stringify(f));
                    var g = {}, k;
                    for (k in f)
                        e && e.hasOwnProperty(k) ? g[k] = e[k] : g[k] = f[k];
                    return g;
                }, b = function (e) {
                    e && (typeof e == 'string' && (e = JSON.parse(e)), this.options.data = e);
                    this.options.json && (this.options.data = this.options.json);
                    this.options.data || (this.options.data = []);
                    e = this.options.columns.length;
                    if (this.options.data && typeof this.options.data[0] !== 'undefined') {
                        var f = this.options.data[0].data && 0 < Object.keys(this.options.data[0].data).length ? Object.keys(this.options.data[0].data) : Object.keys(this.options.data[0]);
                        f.length > e && (e = f.length);
                    }
                    this.options.minDimensions[0] > e && (e = this.options.minDimensions[0]);
                    e ||= 8;
                    for (var g = 0; g < e; g++)
                        if (this.options.columns[g] ? this.options.columns[g].type || (this.options.columns[g].type = 'text') : this.options.columns[g] = { type: 'text' }, this.options.columns[g].type == 'autocomplete' && (this.options.columns[g].type = 'dropdown', this.options.columns[g].autocomplete = !0), !this.options.columns[g].name && f && f[g] && Number(f[g]) != f[g] && (this.options.columns[g].name = f[g]), this.options.columns[g].width || (this.options.columns[g].width = this.options.defaultColWidth), this.options.columns[g].type == 'dropdown' && (this.options.columns[g].source || (this.options.columns[g].source = [])), this.options.columns[g].type == 'dropdown' && this.options.columns[g].url)
                            jSuites.ajax({
                                url: this.options.columns[g].url,
                                index: g,
                                method: 'GET',
                                dataType: 'json',
                                worksheet: this,
                                group: this.parent.name,
                                success: function (k) {
                                    this.worksheet.options.columns[this.index].source = k;
                                }
                            });
                }, d = function (e) {
                    e.getConfig = d.get;
                    e.setConfig = d.set;
                };
            d.spreadsheet = function (e) {
                this.config = a(e, c);
                if (1 != this.config.secureFormulas)
                    console.log('Jspreadsheet Alert: secureFormulas is set to false.');
            };
            d.worksheet = function (e) {
                var f = this;
                f.options = a(e, h);
                if (f.options.csv)
                    jSuites.ajax({
                        url: f.options.csv,
                        method: 'GET',
                        dataType: 'text',
                        group: f.parent.name,
                        success: function (g) {
                            g = z.parseCSV(g, f.options.csvDelimiter);
                            if (1 == f.options.csvHeaders && 0 < g.length)
                                for (var k = g.shift(), n = 0; n < k.length; n++)
                                    f.options.columns[n] || (f.options.columns[n] = {
                                        type: 'text',
                                        align: f.options.defaultColAlign,
                                        width: f.options.defaultColWidth
                                    }), typeof f.options.columns[n].title === 'undefined' && (f.options.columns[n].title = k[n]);
                            b.call(f, g);
                        }
                    });
                else if (f.options.url)
                    jSuites.ajax({
                        url: f.options.url,
                        method: 'GET',
                        dataType: 'json',
                        group: f.parent.name,
                        success: function (g) {
                            b.call(f, g);
                        }
                    });
                else
                    b.call(f);
            };
            d.get = function () {
                return this.options;
            };
            d.set = function (e) {
                typeof e == 'string' && (e = JSON.parse(e));
                if (this.parent) {
                    f = Object.keys(e);
                    for (g = 0; g < f.length; g++)
                        typeof h[f[g]] !== 'undefined' && (this.options[f[g]] = e[f[g]]);
                    if (!0 === e.filters)
                        Y.show.call(this);
                    else if (!1 === e.filters)
                        Y.hide.call(this);
                    if (!0 === e.search)
                        ma.show.call(this);
                    else if (!1 === e.search)
                        ma.hide.call(this);
                    if (!0 === e.toolbar)
                        ba.show.call(this.parent);
                    else if (!1 === e.toolbar)
                        ba.hide.call(this.parent);
                    if (e.minDimensions && e.minDimensions[0]) {
                        f = parseInt(e.minDimensions[0]) - obj.headers.length;
                        if (0 < f)
                            this.insertColumn(f);
                        f = parseInt(e.minDimensions[1]) - obj.rows.length;
                        if (0 < f)
                            this.insertRow(f);
                    }
                    F.call(this, 'setConfig', { data: JSON.stringify(e) });
                } else
                    for (var f = Object.keys(e), g = 0; g < f.length; g++)
                        typeof c[f[g]] !== 'undefined' && (this.config[f[g]] = e[f[g]]);
            };
            return d;
        }(), O = function (h) {
            h = function (c) {
                if (1 != this.ignoreHistory) {
                    var a = ++this.historyIndex;
                    this.history = this.history = this.history.slice(0, a + 1);
                    this.history[a] = c;
                }
            };
            h.undo = function () {
                if (0 <= this.historyIndex)
                    var c = this.history[this.historyIndex--];
                if (c) {
                    this.ignoreHistory = !0;
                    var a = c.worksheet;
                    a.openWorksheet();
                    var b = [];
                    if (c.action == 'insertRow')
                        a.deleteRow(c.insertBefore ? c.rowNumber : c.rowNumber + 1, c.numOfRows);
                    else if (c.action == 'deleteRow')
                        a.insertRow(c.numOfRows, c.rowNumber, 1, c.data), H.setAttributes.call(a, c.attributes);
                    else if (c.action == 'insertColumn')
                        a.deleteColumn(c.insertBefore ? c.columnNumber : c.columnNumber + 1, c.numOfColumns);
                    else if (c.action == 'deleteColumn')
                        a.insertColumn(c.numOfColumns, c.columnNumber, 1, c.properties, c.data, c.extra), H.setAttributes.call(a, c.attributes);
                    else if (c.action == 'moveRow')
                        a.moveRow(c.newValue, c.oldValue);
                    else if (c.action == 'moveColumn')
                        a.moveColumn(c.newValue, c.oldValue);
                    else if (c.action == 'setMerge')
                        a.removeMerge(c.newValue, !0), a.setMerge(c.oldValue);
                    else if (c.action == 'removeMerge')
                        a.setMerge(c.oldValue);
                    else if (c.action == 'setStyle')
                        a.setStyle(c.oldValue, null, null, 1);
                    else if (c.action == 'resetStyle')
                        a.setStyle(c.oldValue);
                    else if (c.action == 'setWidth')
                        a.setWidth(c.column, c.oldValue);
                    else if (c.action == 'setHeight')
                        a.setHeight(c.row, c.oldValue);
                    else if (c.action == 'setHeader')
                        a.setHeader(c.column, c.oldValue);
                    else if (c.action == 'setComments')
                        a.setComments(c.oldValue);
                    else if (c.action == 'setProperty')
                        a.setProperty(c.column, c.oldValue);
                    else if (c.action == 'orderBy')
                        a.orderBy(c.column, c.direction ? 0 : 1, c.oldValue);
                    else if (c.action == 'setValue') {
                        for (var d = 0; d < c.records.length; d++) {
                            var e = {
                                x: c.records[d].x,
                                y: c.records[d].y,
                                value: c.records[d].oldValue
                            };
                            c.records[d].oldStyle && (e.style = c.records[d].oldStyle);
                            b.push(e);
                        }
                        a.setValue(b);
                    } else if (c.action == 'renameWorksheet')
                        a.renameWorksheet(c.index, c.oldValue);
                    else if (c.action == 'moveWorksheet')
                        a.moveWorksheet(c.t, c.f);
                    if (c.selection)
                        a.updateSelectionFromCoords(c.selection);
                    this.ignoreHistory = !1;
                    A.call(this, 'onundo', a, c);
                }
            };
            h.redo = function () {
                if (this.historyIndex < this.history.length - 1)
                    var c = this.history[++this.historyIndex];
                if (c) {
                    this.ignoreHistory = !0;
                    var a = c.worksheet;
                    a.openWorksheet();
                    if (c.action == 'insertRow')
                        a.insertRow(c.numOfRows, c.rowNumber, c.insertBefore, c.data);
                    else if (c.action == 'deleteRow')
                        a.deleteRow(c.rowNumber, c.numOfRows);
                    else if (c.action == 'insertColumn')
                        a.insertColumn(c.numOfColumns, c.columnNumber, c.insertBefore, c.properties, c.data);
                    else if (c.action == 'deleteColumn')
                        a.deleteColumn(c.columnNumber, c.numOfColumns);
                    else if (c.action == 'moveRow')
                        a.moveRow(c.oldValue, c.newValue);
                    else if (c.action == 'moveColumn')
                        a.moveColumn(c.oldValue, c.newValue);
                    else if (c.action == 'setMerge')
                        a.setMerge(c.newValue);
                    else if (c.action == 'removeMerge')
                        a.removeMerge(c.newValue);
                    else if (c.action == 'setStyle')
                        a.setStyle(c.newValue, null, null, 1);
                    else if (c.action == 'resetStyle')
                        a.resetStyle(c.cells);
                    else if (c.action == 'setWidth')
                        a.setWidth(c.column, c.newValue);
                    else if (c.action == 'setHeight')
                        a.setHeight(c.row, c.newValue);
                    else if (c.action == 'setHeader')
                        a.setHeader(c.column, c.newValue);
                    else if (c.action == 'setComments')
                        a.setComments(c.newValue);
                    else if (c.action == 'setProperty')
                        a.setProperty(c.column, c.newValue);
                    else if (c.action == 'orderBy')
                        a.orderBy(c.column, c.direction, c.newValue);
                    else if (c.action == 'setValue')
                        a.setValue(c.records);
                    else if (c.action == 'renameWorksheet')
                        a.renameWorksheet(c.index, c.newValue);
                    else if (c.action == 'moveWorksheet')
                        a.moveWorksheet(c.f, c.t);
                    if (c.selection)
                        a.updateSelectionFromCoords(c.selection);
                    this.ignoreHistory = !1;
                    A.call(this, 'onredo', a, c);
                }
            };
            return h;
        }(), la = function () {
            var h = function (c) {
                var a = null;
                if (Array.isArray(c))
                    a = c;
                else if (typeof c == 'object') {
                    a = [];
                    var b = Object.keys(c);
                    for (var d = 0; d < b.length; d++)
                        a.push({
                            name: b[d],
                            plugin: c[b[d]],
                            options: {}
                        });
                }
                if (a && a.length)
                    for (d = 0; d < a.length; d++) {
                        if (a[d].name && a[d].plugin) {
                            var e = a[d].name;
                            var f = a[d].plugin;
                            var g = a[d].options;
                        }
                        if (typeof f === 'function' && (this.plugins[e] = f.call(t, this, g, this.config), typeof f.license == 'function' && t.license))
                            f.license(t.license);
                    }
            };
            h.execute = function (c, a) {
                if (this.plugins) {
                    var b = Object.keys(this.plugins);
                    if (b.length)
                        for (var d = 0; d < b.length; d++)
                            if (typeof this.plugins[b[d]][c] == 'function') {
                                var e = this.plugins[b[d]][c].apply(this.plugins[b[d]], a);
                                e && (c == 'contextMenu' && (a[4] = e), c == 'toolbar' && (a[0] = e));
                            }
                    return a;
                }
            };
            return h;
        }(), Z = function () {
            var h = function (c) {
                c.getEditor = h.get;
                c.openEditor = h.open;
                c.closeEditor = h.close;
            };
            h.get = function (c, a) {
                c = Da.getOptions.call(this, c, a);
                return [
                    c.type && typeof c.type == 'object' ? c.type : t.editors[c.type],
                    c
                ];
            };
            h.open = function (c, a, b) {
                if (!J.call(this.parent, this))
                    return !1;
                if (1 != c.classList.contains('readonly')) {
                    var d = parseInt(c.getAttribute('data-x')), e = parseInt(c.getAttribute('data-y'));
                    if (!0 === this.options.locked) {
                        var f = z.getColumnNameFromCoords(d, e);
                        if (!this.options.cells || !this.options.cells[f] || !1 !== this.options.cells[f].locked)
                            return !1;
                    }
                    if (f = this.records[e][d].merged)
                        d -= f[0], e -= f[1], c = this.records[e][d].element;
                    if (!H.attached.call(this, d, e)) {
                        if (this.results && 0 < this.results.length)
                            return console.error('Jspreadsheet: cursor not in the viewport'), !1;
                        B.goto.call(this, e, d);
                    }
                    h.position.call(this, d, e);
                    f = this.parent.input;
                    f.innerText = '';
                    A.call(this.parent, 'oneditionstart', this, c, d, e);
                    a = 1 == a ? '' : I.call(this, d, e);
                    var g = h.get.call(this, d, e), k = !0;
                    if (typeof g[0].openEditor == 'function')
                        if (!1 === g[0].openEditor(c, a, d, e, this, g[1], b))
                            k = !1;
                        else
                            A.call(this.parent, 'oncreateeditor', this, c, d, e, f, g[1]);
                    k && (1 == this.options.textOverflow && (this.records[e][d].element.style.overflow = 'hidden', 0 < d && (this.records[e][d - 1].element.style.overflow = 'hidden')), this.edition = c, f.classList.add('jss_focus'), 1 == this.parent.config.editorFormulas && ea(a) && (f.classList.add('jss_formula'), U.parse.call(this, f), c = document.createTextNode(''), f.appendChild(c), jSuites.focus(f)));
                }
            };
            h.close = function (c, a) {
                null === c && (c = this.edition);
                if (this.parent.input.classList.contains('jss_formula'))
                    U.close.call(this, this.parent.input);
                var b, d = parseInt(c.getAttribute('data-x')), e = parseInt(c.getAttribute('data-y'));
                1 == this.options.textOverflow && (b = this.records[e][d + 1]) && b.element && b.element.innerText == '' && (this.records[e][d].element.style.overflow = '');
                b = h.get.call(this, d, e);
                if (1 == a) {
                    var f = null;
                    if (typeof b[0].closeEditor == 'function') {
                        var g = b[0].closeEditor(c, !0, d, e, this, b[1]);
                        void 0 !== g && (f = g);
                    }
                    if (null !== f && I.call(this, d, e) != f)
                        this.setValue(c, f);
                } else
                    b[0].closeEditor(c, !1, d, e, this, b[1]);
                A.call(this.parent, 'oneditionend', this, c, d, e, f, a);
                if (b[1] && typeof b[1].render == 'function')
                    b[1].render.call(this, c, this.records[e][d].v, d, e, this, b[1]);
                b = this.parent.input;
                b.onblur && (b.onblur = null);
                b.children[0] && b.children[0].onblur && (b.children[0].onblur = null);
                b.update && (b.update = null);
                Z.build(this.parent);
                b.removeAttribute('data-mask');
                b.removeAttribute('data-value');
                b.removeAttribute('inputmode');
                b.mask = null;
                this.edition = null;
                this.refreshBorders();
            };
            h.position = function (c, a) {
                var b = null;
                if (b = this.records[a][c].element) {
                    var d = this.parent.element.getBoundingClientRect();
                    b = b.getBoundingClientRect();
                    var e = this.parent.input;
                    e.x = c;
                    e.y = a;
                    0 == b.width && 0 == b.height ? e.style.opacity = '0' : (e.setAttribute('style', ''), c = b.top - d.top + 1, a = b.left - d.left + 1, e.style.top = c + 'px', e.style.left = a + 'px', e.style.minWidth = b.width - 1 + 'px', e.style.minHeight = b.height - 1 + 'px', setTimeout(function () {
                        e.focus();
                    }, 0));
                }
            };
            h.build = function (c) {
                c.input || (c.input = document.createElement('div'));
                c.input.className = 'jss_input';
                c.input.setAttribute('contentEditable', !0);
                c.input.innerText = '';
                c.input.oninput = function (a) {
                    t.current.parent.config.editorFormulas = !0;
                    if (ea(a.target.innerText))
                        a.target.classList.add('jss_formula');
                    else if (a.target.classList.contains('jss_formula'))
                        U.close.call(t.current, this);
                };
                return c.input;
            };
            return h;
        }(), A = function (h) {
            if (!this.ignoreEvents) {
                if (typeof this.config.onevent == 'function')
                    var c = this.config.onevent.apply(this, arguments);
                typeof this.config[h] == 'function' && (c = this.config[h].apply(this, Array.prototype.slice.call(arguments, 1)));
                la.execute.call(this, 'onevent', arguments);
            }
            return c;
        }, pa = function () {
            var h = function (c) {
                c.sequence = 0;
                c.getNextSequence = h.next;
                c.getRowId = h.getId;
                c.setRowId = h.setId;
                c.getRowById = h.getRowById;
            };
            h.get = function () {
                return this.sequence;
            };
            h.set = function (c, a) {
                if (c > this.sequence || a)
                    this.sequence = c;
            };
            h.next = function () {
                return 1 == this.options.sequence ? ++this.sequence : null;
            };
            h.reset = function () {
                this.sequence = 0;
            };
            h.getId = function (c) {
                if (this.rows[c] && this.rows[c].id)
                    return this.rows[c].id;
                var a = this.getPrimaryKey();
                if (!1 !== a)
                    return I.call(this, a, c);
            };
            h.setId = function (c, a) {
                if (void 0 !== a && 0 <= parseInt(c)) {
                    var b = {};
                    b[c] = a;
                } else
                    b = c;
                c = Object.keys(b);
                if (c.length) {
                    for (var d = 0; d < c.length; d++)
                        a = b[c[d]], this.rows[c[d]].id = a, h.set.call(this, a);
                    F.call(this, 'setRowId', [b]);
                    A.call(this.parent, 'onchangerowid', this, b);
                }
            };
            h.getRowById = function (c, a) {
                for (var b = 0; b < this.rows.length; b++)
                    if (h.getId.call(this, b) == c)
                        return !0 === a ? this.rows[b] : this.options.data[b];
                return !1;
            };
            return h;
        }(), La = function () {
            var h = function (a) {
                    for (var b = [], d = {}, e = 0; e < a.length; e++) {
                        var f = a[e].x, g = a[e].y, k = pa.getId.call(this, g);
                        if (!k)
                            if (d[g])
                                k = d[g];
                            else if (k = pa.next.call(this))
                                d[g] = k;
                        b[g] || (b[g] = {
                            id: k,
                            row: g,
                            data: {}
                        });
                        f = qa.call(this, f);
                        b[g].data[f] = a[e].value;
                    }
                    pa.setId.call(this, d);
                    return b.filter(function (n) {
                        return null != n;
                    });
                }, c = function (a) {
                    var b = a[0];
                    if (0 <= [
                            'setBorder',
                            'resetBorders',
                            'setRowId',
                            'updateCells'
                        ].indexOf(b))
                        return !1;
                    var d = {};
                    b == 'setValue' || b == 'setFormula' ? (b = 'updateData', d[b] = h.call(this, a[1].data)) : Array.isArray(a[1]) && 1 == a[1].length ? d[b] = a[1][0] : d[b] = a[1];
                    return d;
                };
            return function (a, b, d, e) {
                var f = this.parent, g = this;
                d = null;
                var k = c.call(this, b);
                if (k)
                    b = k;
                else if (!1 === k)
                    return !1;
                if (k = A.call(f, 'onbeforesave', f, g, b))
                    b = k;
                else if (!1 === k)
                    return !1;
                Ha.call(f, !0);
                jSuites.ajax({
                    url: a,
                    method: 'POST',
                    dataType: 'json',
                    data: { data: JSON.stringify(b) },
                    queue: !0,
                    beforeSend: function (n) {
                        if (d)
                            n.setRequestHeader('Authorization', 'Bearer ' + d);
                    },
                    success: function (n) {
                        if (f.element.classList.contains('disconected'))
                            f.element.classList.remove('disconected');
                        if (n) {
                            if (n.message)
                                if (n.name = f.config.application, jSuites.notification.isVisible())
                                    console.log(n.name + ': ' + n.message);
                                else
                                    jSuites.notification(n);
                            if (n.success)
                                if (typeof e === 'function')
                                    e(n);
                                else {
                                    if (n.data && Array.isArray(n.data))
                                        H.updateAll.call(g, n.data);
                                }
                            else
                                n.error && (alert('Sorry, something went wrong, refreshing your spreadsheet...'), window.open(window.location.href, '_top'));
                        }
                        A.call(f, 'onsave', f, g, b, n);
                    },
                    error: function () {
                        f.element.classList.add('disconected');
                    }
                });
            };
        }(), F = function () {
            return function () {
                la.execute.call(this.parent, 'persistence', [
                    this,
                    arguments[0],
                    arguments[1]
                ]);
                if (!this.parent.ignorePersistence) {
                    var h = null;
                    if (this.parent.config.server) {
                        var c = this.parent.worksheets.indexOf(this);
                        h = this.parent.config.server;
                        h = -1 == h.indexOf('?') ? h + ('?worksheet=' + c) : h + ('&worksheet=' + c);
                    } else
                        this.options.persistence && (h = typeof this.options.persistence == 'string' ? this.options.persistence : this.options.url);
                    if (h)
                        La.call(this, h, arguments);
                }
            };
        }(), Aa = function (h) {
            if (this.selectedCell) {
                var c = this.selectedCell[0], a = this.selectedCell[1];
                this.records && this.records[a] && this.records[a][c] && this.records[a][c].element || (this.selectedCell = this.getHighlighted(), c = this.selectedCell[0], a = this.selectedCell[1]);
                var b = this.getHighlighted(), d = b[0], e = b[1], f = b[2];
                b = b[3];
                h = h ? 'add' : 'remove';
                if (this.records[a] && this.records[a][c] && this.records[a][c].element)
                    this.records[a][c].element.classList[h]('jss_cursor');
                for (c = d; c <= f; c++)
                    if (this.headers[c])
                        this.headers[c].classList[h]('selected');
                for (; e <= b; e++)
                    if (this.rows[e] && this.rows[e].element)
                        this.rows[e].element.classList[h]('selected');
            }
        }, ua = function () {
            var h = function (c) {
                c.resetSelection = h.reset;
                c.updateSelection = h.fromElements;
                c.updateSelectionFromCoords = h.set;
                c.selectAll = h.all;
                c.isSelected = h.isSelected;
                c.getHighlighted = h.getHighlighted;
                c.getRange = h.getRange;
            };
            h.getHighlighted = function () {
                var c = this.borders;
                return (c = c.main) ? [
                    c.x1,
                    c.y1,
                    c.x2,
                    c.y2
                ] : null;
            };
            h.isSelected = function (c, a, b) {
                if (!b && (b = this.getHighlighted(), !b))
                    return !1;
                var d = b[0], e = b[1], f = b[2];
                b = b[3];
                f ||= d;
                b ||= e;
                return null == c ? a >= e && a <= b : null == a ? c >= d && c <= f : c >= d && c <= f && a >= e && a <= b;
            };
            h.reset = function () {
                if (this.selectedCell) {
                    c = 1;
                    if (this.edition)
                        Z.close.call(this, this.edition, !0);
                    this.resetBorders('main', !0);
                    this.resetBorders('copying', !0);
                    this.selectedCell = null;
                    if (1 == c)
                        A.call(this.parent, 'onblur', this);
                } else
                    var c = 0;
                return c;
            };
            h.refresh = function () {
                if (this.selectedCell)
                    h.set.call(this, this.selectedCell);
            };
            h.isValid = function (c, a, b, d) {
                return !(c >= this.options.columns.length || a >= this.rows.length || b >= this.options.columns.length || d >= this.rows.length);
            };
            h.set = function (c, a, b, d, e, f, g) {
                f ||= 'main';
                Array.isArray(c) && (d = c[3], b = c[2], a = c[1], c = c[0]);
                null == b && (b = c);
                null == d && (d = a);
                if (!h.isValid.call(this, c, a, b, d))
                    return !1;
                if (null != c) {
                    if (parseInt(c) < parseInt(b))
                        var k = parseInt(c), n = parseInt(b);
                    else
                        k = parseInt(b), n = parseInt(c);
                    if (parseInt(a) < parseInt(d))
                        var m = parseInt(a), p = parseInt(d);
                    else
                        m = parseInt(d), p = parseInt(a);
                    var q;
                    var r = {};
                    if (this.options.mergeCells) {
                        for (var u = m; u <= p; u++)
                            for (var l = k; l <= n; l++)
                                if (q = this.records[u][l].merged)
                                    q = z.getColumnNameFromCoords(l - q[0], u - q[1]), r[q] = !0;
                        u = Object.keys(r);
                        if (u.length)
                            for (l = 0; l < u.length; l++)
                                q = z.getCoordsFromColumnName(u[l]), r = this.options.mergeCells[u[l]], q[0] < k && (k = q[0]), q[0] + r[0] - 1 > n && (n = q[0] + r[0] - 1), q[1] < m && (m = q[1]), q[1] + r[1] - 1 > p && (p = q[1] + r[1] - 1);
                    }
                }
                if (f == 'main') {
                    this.selectedCell ? (Aa.call(this, !1), q = 1) : q = 0;
                    this.selectedCell = [
                        c,
                        a,
                        b,
                        d
                    ];
                    if (this.records[d][b].element)
                        B.isVisible.call(this, this.records[d][b].element);
                    Z.position.call(this, c, a);
                    if (0 == q)
                        A.call(this.parent, 'onfocus', this);
                    ba.update.call(this.parent, t.current, this.selectedCell);
                }
                ca.set.call(this, k, m, n, p, f, g);
                f == 'main' && (la.execute.call(this.parent, 'selection', [
                    this,
                    k,
                    m,
                    n,
                    p,
                    e
                ]), A.call(this.parent, 'onselection', this, k, m, n, p, e));
            };
            h.fromElements = function (c, a, b) {
                var d = c.getAttribute('data-x');
                c = c.getAttribute('data-y');
                if (a) {
                    var e = a.getAttribute('data-x');
                    a = a.getAttribute('data-y');
                } else
                    e = d, a = c;
                this.updateSelectionFromCoords(d, c, e, a, b);
            };
            h.all = function () {
                h.set.call(this, 0, 0, this.options.columns.length - 1, this.records.length - 1);
            };
            h.getRange = function () {
                var c = this.selectedCell;
                if (!c)
                    return '';
                var a = z.getColumnNameFromCoords(c[0], c[1]);
                c = z.getColumnNameFromCoords(c[2], c[3]);
                var b = this.options.worksheetName;
                b = -1 != b.indexOf(' ') ? '\'' + b + '\'!' : b + '!';
                return a == c ? b + a : b + a + ':' + c;
            };
            return h;
        }(), ca = function () {
            var h = function (b) {
                b.borders = [];
                b.setBorder = h.set;
                b.getBorder = h.get;
                b.resetBorders = h.reset;
                b.refreshBorders = h.refresh;
            };
            h.get = function (b) {
                return this.borders[b];
            };
            var c = function (b, d, e, f, g, k) {
                    g ||= 0;
                    if (!ua.isValid.call(this, b, d, e, f))
                        return !1;
                    if (this.borders[g])
                        n = this.borders[g];
                    else {
                        var n = {};
                        n.element = document.createElement('div');
                        n.element.classList.add('jss_border');
                        if (g == 'copying' || g == 'cloning' || g == 'main')
                            n.element.classList.add('jss_border_' + g);
                        else
                            k = k ? k : jSuites.randomColor(!0), n.color = k, n.element.style.backgroundColor = k + '15', n.element.style.borderColor = k;
                        this.content.appendChild(n.element);
                    }
                    n.x1 = b;
                    n.y1 = d;
                    n.x2 = e;
                    n.y2 = f;
                    k = this.headers[b] ? this.headers[b].offsetLeft : 0;
                    var m = this.headers[e] ? this.headers[e].offsetLeft : 0, p = this.rows[d].element ? this.rows[d].element.offsetTop : 0, q = this.rows[f].element ? this.rows[f].element.offsetTop : 0;
                    n.element.style.top = '-2000px';
                    n.element.style.left = '-2000px';
                    n.active = 0;
                    var r = this.options.freezeColumns || 0, u = !1, l = null, w = null, v = null, x = null;
                    this.tbody.firstChild && (w = parseInt(this.tbody.firstChild.getAttribute('data-y')), x = parseInt(this.tbody.lastChild.getAttribute('data-y')));
                    this.thead.lastChild && (l = parseInt(this.thead.lastChild.children[r + 1].getAttribute('data-x')), v = parseInt(this.thead.lastChild.lastChild.getAttribute('data-x')), this.thead.lastChild.children[1].style.display == 'none' && (l = Ja.call(this, l, w)), this.thead.lastChild.lastChild.style.display == 'none' && (v = Ka.call(this, v, x)));
                    null == l || e < l && b >= r || b > v || f < w || d > x || (k ? n.element.style.borderLeftColor = n.color ? n.color : '' : (k = this.thead.lastChild.children[r + 1].offsetLeft, n.element.style.borderLeftColor = g == 'copying' ? '#ccc' : 'transparent'), m ? (m += this.headers[e].offsetWidth, n.element.style.borderRightColor = n.color ? n.color : '') : (e > v ? (m = this.headers[v].offsetLeft + this.headers[v].offsetWidth, u = !0) : m = this.thead.lastChild.children[r].offsetLeft + this.thead.lastChild.children[r].offsetWidth, n.element.style.borderRightColor = g == 'copying' ? '#ccc' : 'transparent'), m = m - k - 1, p ? n.element.style.borderTopColor = n.color ? n.color : '' : (p = this.tbody.firstChild.offsetTop, n.element.style.borderTopColor = g == 'copying' ? '#ccc' : 'transparent'), q ? (q += this.rows[f].element.offsetHeight, n.element.style.borderBottomColor = n.color ? n.color : '') : (q = this.rows[x].element.offsetTop + this.rows[x].element.offsetHeight, n.element.style.borderBottomColor = g == 'copying' ? '#ccc' : 'transparent', u = !0), q = q - p - 1, this.options.freezeColumns && (n.element.style.borderLeftWidth = '', n.element.style.borderRightWidth = '', d = 0 < this.content.scrollLeft ? ja.getWidth.call(this) : 0) && (b = b < this.options.freezeColumns, e = e < this.options.freezeColumns, b && e || !b && e || (b && !e ? (e = d + this.content.scrollLeft, e > k + m && (n.element.style.borderRightWidth = '0px', m += e - (k + m))) : (e = d + this.content.scrollLeft, e > k && (e -= k, e > m ? k = p = -2000 : (k = k + e + 1, m -= e, n.element.style.borderLeftWidth = '0px'))))), n.element.style.top = p + 'px', n.element.style.left = k + 'px', n.element.style.width = m + 'px', n.element.style.height = q + 'px', n.t = p, n.l = k, n.w = m, n.h = q, n.active = 1);
                    g == 'main' && (n.active && 1 != u ? (this.corner.style.top = p + q - 2 + 'px', this.corner.style.left = k + m - 2 + 'px') : (this.corner.style.top = '-2000px', this.corner.style.left = '-2000px'));
                    this.borders[g] = n;
                }, a = function (b, d) {
                    b.element.style.top = '-2000px';
                    b.element.style.left = '-2000px';
                    b.active = 0;
                    d && (b.x1 = null, b.y1 = null, b.x2 = null, b.y2 = null);
                };
            h.set = function (b, d, e, f, g, k) {
                c.call(this, b, d, e, f, g, k);
                g == 'main' && (Aa.call(this, !0), F.call(this, 'setBorder', {
                    x1: b,
                    y1: d,
                    x2: e,
                    y2: f
                }));
            };
            h.reset = function (b, d) {
                b && b != 'main' || (this.corner.style.top = '-2000px', this.corner.style.left = '-2000px', Aa.call(this, !1));
                if (b)
                    this.borders[b] && a(this.borders[b], d);
                else {
                    d = Object.keys(this.borders);
                    for (var e = 0; e < d.length; e++)
                        a(this.borders[d[e]]);
                }
                if (!b || b == 'main')
                    F.call(this, 'resetBorders');
            };
            h.refresh = function (b) {
                var d = this.borders;
                if (!b) {
                    b = Object.keys(d);
                    for (var e = 0; e < b.length; e++)
                        if (d[b[e]] && null != d[b[e]].x1)
                            c.call(this, d[b[e]].x1, d[b[e]].y1, d[b[e]].x2, d[b[e]].y2, b[e]);
                } else if (d[b] && null != d[b].x1)
                    c.call(this, d[b].x1, d[b].y1, d[b].x2, d[b].y2, b);
                this.edition && (d = this.parent.input, Z.position.call(this, d.x, d.y));
            };
            h.destroy = function (b) {
                var d;
                if (d = this.borders[b])
                    d.element.remove(), delete this.borders[b];
            };
            return h;
        }(), Ta = function () {
            var h = function (c) {
                c.setGroup = h.set;
                c.unsetGroup = h.unset;
            };
            h.set = function (c, a, b) {
                0 == c && (b = document.createElement('tr'), b.classList.add('jss_group_container'), this.thead.insertBefore(b, this.thead.firstChild), c = document.createElement('td'), c.innerHTML = '&nbsp;', b.appendChild(c), c = document.createElement('td'), b.appendChild(c), a = this.headers[a]) && (a = a.querySelector('.jss_group'), a || (a = document.createElement('div'), a.classList.add('jss_group'), a.innerText = '+', c.appendChild(a)));
            };
            h.unset = function (c, a) {
            };
            return h;
        }(), sa = function () {
            var h = {};
            h.start = function (c) {
                if (!J.call(this.parent, this))
                    return !1;
                if (null !== c.target.getAttribute('data-y')) {
                    var a = c.target.getAttribute('data-y');
                    h.event = {
                        y: parseInt(a),
                        h: c.target.offsetHeight,
                        p: c.pageY
                    };
                } else
                    null !== c.target.getAttribute('data-x') && (a = c.target.getAttribute('data-x'), h.event = {
                        x: parseInt(a),
                        w: c.target.offsetWidth,
                        p: c.pageX
                    });
            };
            h.end = function (c) {
                var a = [];
                if (null != h.event.y) {
                    var b = parseInt(this.rows[h.event.y].element.offsetHeight);
                    var d = this.getSelectedRows(!0);
                    c = d.indexOf(parseInt(h.event.y));
                    if (d.length && -1 < c)
                        for (var e = 0; e < d.length; e++)
                            a.push(parseInt(this.rows[d[e]].element.offsetHeight));
                    else
                        d = [];
                    -1 == c ? (d.push(h.event.y), a.push(h.event.h)) : a[c] = h.event.h;
                    this.setHeight(d, b, a);
                } else if (null != h.event.x) {
                    b = parseInt(this.colgroup[h.event.x].getAttribute('width'));
                    d = this.getSelectedColumns();
                    c = d.indexOf(parseInt(h.event.x));
                    if (d.length && -1 < c)
                        for (e = 0; e < d.length; e++)
                            a.push(parseInt(this.options.columns[d[e]].width));
                    else
                        d = [];
                    -1 == c ? (d.push(h.event.x), a.push(h.event.w)) : a[c] = h.event.w;
                    this.setWidth(d, b, a);
                }
                h.event = null;
            };
            h.update = function (c) {
                if (null != h.event.y)
                    c = c.pageY - h.event.p, 0 < h.event.h + c && (this.rows[h.event.y].element.style.height = h.event.h + c + 'px', this.refreshBorders());
                else if (null != h.event.x && (c = c.pageX - h.event.p, 0 < h.event.w + c)) {
                    this.colgroup[h.event.x].setAttribute('width', h.event.w + c);
                    if (0 < this.options.freezeColumns)
                        ja.set.call(this);
                    this.refreshBorders();
                }
            };
            h.cancel = function () {
                h.end.call(this);
            };
            return h;
        }(), Ma = function () {
            var h = {};
            h.start = function (c) {
                var a = this.parent.helper;
                c = parseInt(c.target.getAttribute('data-x'));
                if (this.merged.cols[c])
                    console.error('Jspreadsheet: This column is part of a merged cell.');
                else {
                    h.event = {
                        x: c,
                        d: c
                    };
                    this.headers[c].classList.add('jss_dragging');
                    for (var b = 0; b < this.tbody.children.length; b++) {
                        var d = this.tbody.children[b].getAttribute('data-y');
                        this.records[d][c].element.classList.add('jss_dragging');
                    }
                    b = this.parent.element.getBoundingClientRect();
                    c = this.headers[c].getBoundingClientRect();
                    d = this.content.getBoundingClientRect();
                    a.style.display = 'block';
                    a.style.top = d.top - b.top + 'px';
                    a.style.left = c.left - d.left + 'px';
                    a.style.width = '1px';
                    a.style.height = d.height + 'px';
                    a.classList.add('jss_helper_col');
                }
            };
            h.end = function () {
                this.headers[h.event.x].classList.remove('jss_dragging');
                for (var c = 0; c < this.tbody.children.length; c++) {
                    var a = this.tbody.children[c].getAttribute('data-y');
                    this.records[a][h.event.x].element.classList.remove('jss_dragging');
                }
                null != h.event.d && h.event.x != h.event.d && (this.moveColumn(h.event.x, h.event.d), this.refreshBorders());
                this.parent.helper.classList.remove('jss_helper_col');
                this.parent.helper.style.display = '';
                h.event = null;
            };
            h.cancel = function () {
                h.event.d = null;
                h.end.call(this);
            };
            h.update = function (c) {
                var a = c.target.getAttribute('data-x');
                if (null != a)
                    if (a = parseInt(a), this.merged.cols[a])
                        console.error('Jspreadsheet: This column is part of a merged cell.');
                    else {
                        c = c.target.clientWidth / 2 > c.offsetX;
                        h.event.d = c ? h.event.x < a ? parseInt(a) - 1 : parseInt(a) : h.event.x > a ? parseInt(a) + 1 : parseInt(a);
                        a = this.headers[a].getBoundingClientRect();
                        var b = this.content.getBoundingClientRect();
                        this.parent.helper.style.left = (c ? a.left : a.right) - b.left + 'px';
                    }
            };
            return h;
        }(), na = function () {
            var h = {};
            h.start = function (c) {
                if (J.call(this.parent, this)) {
                    this.resetSelection();
                    var a = this.parent.helper;
                    if (null !== c.target.getAttribute('data-y')) {
                        var b = parseInt(c.target.getAttribute('data-y'));
                        if (this.merged.rows[b])
                            console.error('Jspreadsheet: This row is part of a merged cell');
                        else if (this.results)
                            console.error('Jspreadsheet: Please clear your search before perform this action');
                        else
                            h.event = {
                                y: b,
                                d: b
                            }, this.rows[b].element.classList.add('jss_dragging'), c = this.parent.element.getBoundingClientRect(), b = this.rows[b].element.getBoundingClientRect(), a.style.display = 'block', a.style.top = b.top - c.top + 'px', a.style.left = '51px', a.style.width = this.content.offsetWidth - 50 + 'px', a.style.height = '1px', a.classList.add('jss_helper_row');
                    } else if (null !== c.target.getAttribute('data-x'))
                        if (b = parseInt(c.target.getAttribute('data-x')), this.merged.cols[b])
                            console.error('Jspreadsheet: This column is part of a merged cell.');
                        else {
                            h.event = {
                                x: b,
                                d: b
                            };
                            this.headers[b].classList.add('jss_dragging');
                            for (c = 0; c < this.tbody.children.length; c++) {
                                var d = this.tbody.children[c].getAttribute('data-y');
                                this.records[d][b].element.classList.add('jss_dragging');
                            }
                            c = this.parent.element.getBoundingClientRect();
                            b = this.headers[b].getBoundingClientRect();
                            d = this.content.getBoundingClientRect();
                            a.style.display = 'block';
                            a.style.top = d.top - c.top + 'px';
                            a.style.left = b.left - d.left + 'px';
                            a.style.width = '1px';
                            a.style.height = d.height + 'px';
                            a.classList.add('jss_helper_col');
                        }
                } else
                    return !1;
            };
            h.end = function () {
                if (null != h.event.y)
                    this.rows[h.event.y].element.classList.remove('jss_dragging'), null != h.event.d && h.event.y != h.event.d && (this.moveRow(h.event.y, h.event.d), this.updateSelectionFromCoords(0, h.event.d, this.options.columns.length - 1, h.event.d)), this.parent.helper.classList.remove('jss_helper_row');
                else if (null != h.event.x) {
                    this.headers[h.event.x].classList.remove('jss_dragging');
                    for (var c = 0; c < this.tbody.children.length; c++) {
                        var a = this.tbody.children[c].getAttribute('data-y');
                        this.records[a][h.event.x].element.classList.remove('jss_dragging');
                    }
                    null != h.event.d && h.event.x != h.event.d && (this.moveColumn(h.event.x, h.event.d), this.refreshBorders());
                    this.parent.helper.classList.remove('jss_helper_col');
                }
                this.parent.helper.style.display = '';
                h.event = null;
            };
            h.cancel = function () {
                h.event.d = null;
                h.end.call(this);
            };
            h.update = function (c) {
                if (null != h.event.y) {
                    var a = c.target.getAttribute('data-y');
                    if (null != a) {
                        var b = a = parseInt(a), d = c.target.clientHeight / 2 > c.offsetY;
                        d ? h.event.y < a && (b = a - 1) : h.event.y > a && (b = a + 1);
                        c = !1;
                        this.merged.rows[b] && (h.event.y > b ? this.merged.rows[b - 1] && (c = !0) : this.merged.rows[b + 1] && (c = !0));
                        c || (h.event.d = b, b = this.parent.element.getBoundingClientRect(), a = this.rows[a].element.getBoundingClientRect(), this.parent.helper.style.top = (d ? a.top : a.bottom) - b.top + 'px');
                    }
                } else
                    d = c.target.getAttribute('data-x'), null != d && (b = d = parseInt(d), (a = c.target.clientWidth / 2 > c.offsetX) ? h.event.x < d && (b = d - 1) : h.event.x > d && (b = d + 1), c = !1, this.merged.cols[b] && (h.event.x > b ? this.merged.cols[b - 1] && (c = !0) : this.merged.cols[b + 1] && (c = !0)), c || (h.event.d = b, b = this.headers[d].getBoundingClientRect(), d = this.content.getBoundingClientRect(), this.parent.helper.style.left = (a ? b.left : b.right) - d.left + 'px'));
            };
            return h;
        }(), X = function () {
            var h = function () {
                    var a = this.getHighlighted();
                    if (a)
                        return [
                            z.getColumnNameFromCoords(a[0], a[1]),
                            a[2] - a[0] + 1,
                            a[3] - a[1] + 1
                        ];
                    jSuites.notification({ message: E('No cell selected') });
                    return !1;
                }, c = function (a) {
                    a.getMerge = c.get;
                    a.setMerge = c.set;
                    a.updateMerge = c.update;
                    a.removeMerge = c.remove;
                    a.destroyMerged = a.destroyMerge = c.destroy;
                };
            c.getHeight = function (a, b) {
                var d, e = 1;
                if (this.merged.rows[a])
                    for (var f = 0; f < this.options.columns.length; f++) {
                        var g = z.getColumnNameFromCoords(f, a);
                        if (g = this.merged.cells[g])
                            if (d = this.options.mergeCells[g])
                                b && void 0 !== b[g] || (d[1] > e && (e = d[1]), b && (b[g] = this.records[a][f].element && !this.records[a][f].merged ? !0 : !1));
                    }
                return e - 1;
            };
            c.getWidth = function (a, b) {
                var d, e = 1;
                if (this.merged.cols[a])
                    for (var f = 0; f < this.options.data.length; f++) {
                        var g = z.getColumnNameFromCoords(a, f);
                        if (g = this.merged.cells[g])
                            if (d = this.options.mergeCells[g])
                                b && void 0 !== b[g] || (d[0] > e && (e = d[0]), b && (b[g] = this.records[f][a].element && !this.records[f][a].merged ? !0 : !1));
                    }
                return e - 1;
            };
            c.get = function (a) {
                return a ? this.options.mergeCells[a] : this.options.mergeCells;
            };
            c.set = function (a, b, d) {
                if (!J.call(this.parent, this))
                    return !1;
                this.options.mergeCells || (this.options.mergeCells = {});
                var e = null, f = null, g = null, k = {}, n = {}, m = {}, p = !1;
                if (typeof a == 'string')
                    m[a] = [
                        b,
                        d
                    ];
                else if (typeof a == 'object')
                    m = a;
                else if (f = h.call(this))
                    m[f[0]] = [
                        f[1],
                        f[2]
                    ];
                a = function (q, r, u) {
                    r = parseInt(r);
                    u = parseInt(u);
                    if ((!r || 2 > r) && (!u || 2 > u))
                        console.log(E('Invalid merged properties') + ':' + q);
                    else if (this.options.mergeCells[q])
                        n[q] = [
                            r,
                            u
                        ], k[q] = this.options.mergeCells[q], c.update.call(this, q, r, u);
                    else {
                        f = z.getCoordsFromColumnName(q);
                        for (var l = f[1]; l < f[1] + u; l++)
                            for (var w = f[0]; w < f[0] + r; w++)
                                g = z.getColumnNameFromCoords(w, l), (e = this.merged.cells[g]) && this.options.mergeCells[e] && (k[e] = this.options.mergeCells[e], c.applyDestroy.call(this, e));
                        n[q] = this.options.mergeCells[q] = [
                            r,
                            u
                        ];
                        c.applyCreate.call(this, q);
                        H.attached.call(this, f[0], f[1]) || (p = f);
                    }
                };
                b = Object.keys(m);
                if (b.length) {
                    for (d = 0; d < b.length; d++)
                        a.call(this, b[d], m[b[d]][0], m[b[d]][1]);
                    if (Object.keys(n).length) {
                        if (p)
                            B.goto.call(this, f[1], f[0]);
                        O.call(this.parent, {
                            worksheet: this,
                            action: 'setMerge',
                            newValue: n,
                            oldValue: k
                        });
                        F.call(this, 'setMerge', [n]);
                        c.build.call(this);
                        ua.refresh.call(this);
                        ca.refresh.call(this);
                        A.call(this.parent, 'onmerge', this, n, k);
                    }
                }
            };
            c.update = function (a, b, d) {
                var e = this.options.mergeCells;
                if (e[a]) {
                    var f = e[a][1];
                    if (b !== e[a][0] || f !== d)
                        c.applyDestroy.call(this, a), b && d && (e[a] = [
                            b,
                            d
                        ], c.applyCreate.call(this, a));
                }
            };
            c.remove = function (a, b) {
                if (!J.call(this.parent, this))
                    return !1;
                b = {};
                var d = {}, e = {};
                typeof a == 'string' ? e[a] = !0 : typeof a == 'object' && (e = a);
                a = Object.keys(e);
                for (e = 0; e < a.length; e++)
                    this.options.mergeCells[a[e]] && (b[a[e]] = this.options.mergeCells[a[e]], d[a[e]] = !0, c.applyDestroy.call(this, a[e], !0));
                O.call(this.parent, {
                    worksheet: this,
                    action: 'removeMerge',
                    newValue: d,
                    oldValue: b
                });
                F.call(this, 'removeMerge', { data: d });
            };
            c.destroy = function () {
                c.remove.call(this, this.options.mergeCells, !0);
            };
            c.applyCreate = function (a, b) {
                var d = this.options.mergeCells;
                if (d[a]) {
                    var e = d[a][0] || 1, f = d[a][1] || 1;
                    a = z.getCoordsFromColumnName(a);
                    if (!this.records[a[1]][a[0]].merged || 1 == b)
                        if (d = H.get.call(this, a[0], a[1])) {
                            d.style.display = '';
                            if (1 < e)
                                d.setAttribute('colspan', e);
                            else
                                d.removeAttribute('colspan');
                            if (1 < f)
                                d.setAttribute('rowspan', f);
                            else
                                d.removeAttribute('rowspan');
                            1 == this.options.textOverflow && (d.style.overflow = 'hidden');
                            for (var g = 0; g < f; g++)
                                for (var k = 0; k < e; k++) {
                                    b = a[0] + k;
                                    var n = a[1] + g;
                                    if (d = this.records[n][b])
                                        if (d.merged = [
                                                k,
                                                g,
                                                d.v,
                                                d.v
                                            ], 0 != k || 0 != g) {
                                            if (!d.element)
                                                H.get.call(this, b, n);
                                            d.element.style.display = 'none';
                                            d.merged[3] = d.element.innerText;
                                            d.element.innerText = '';
                                            I.call(this, b, n, '');
                                        }
                                }
                        }
                }
            };
            c.applyDestroy = function (a, b) {
                var d = this.options.mergeCells;
                if (d[a]) {
                    var e = z.getCoordsFromColumnName(a), f = e[0];
                    e = e[1];
                    var g = d[a][0], k = d[a][1];
                    delete this.options.mergeCells[a];
                    for (a = 0; a < k; a++)
                        for (var n = 0; n < g; n++)
                            if (d = this.records[e + a][f + n])
                                d.element && (0 == n && 0 == a ? (d.element.removeAttribute('colspan'), d.element.removeAttribute('rowspan')) : (d.element.style.display = '', 1 == b && (I.call(this, f + n, e + a, d.merged[2]), d.element.innerHTML = d.merged[3]))), d.merged && delete d.merged;
                }
            };
            c.updateConfig = function (a, b, d, e) {
                if (1 == b)
                    var f = [d];
                else {
                    f = [];
                    for (var g = d; g < d + e; g++)
                        f.push(g);
                }
                var k = this.options.mergeCells, n = Object.keys(k), m = {};
                for (g = 0; g < n.length; g++) {
                    d = z.getCoordsFromColumnName(n[g]);
                    for (var p = d[a]; p < d[a] + k[n[g]][a]; p++)
                        -1 !== f.indexOf(p) && (m[n[g]] || (m[n[g]] = [
                            k[n[g]][0],
                            k[n[g]][1]
                        ], 1 == b && (m[n[g]][a] += e)), 0 == b && m[n[g]][a]--);
                }
                n = Object.keys(m);
                for (g = 0; g < n.length; g++)
                    c.update.call(this, n[g], m[n[g]][0], m[n[g]][1]);
                c.build.call(this);
            };
            c.build = function () {
                var a = this.options.mergeCells;
                this.merged = {
                    cols: [],
                    rows: [],
                    cells: []
                };
                if (a)
                    for (var b = Object.keys(a), d = 0; d < b.length; d++) {
                        for (var e = z.getCoordsFromColumnName(b[d]), f = parseInt(a[b[d]][0]), g = parseInt(a[b[d]][1]), k = 0; k < f; k++)
                            this.merged.cols[e[0] + k] = !0;
                        for (var n = 0; n < g; n++)
                            this.merged.rows[e[1] + n] = !0;
                        for (n = 0; n < g; n++)
                            for (k = 0; k < f; k++) {
                                var m = z.getColumnNameFromCoords(e[0] + k, e[1] + n);
                                this.merged.cells[m] = b[d];
                            }
                    }
            };
            c.batch = function (a) {
                var b = Object.keys(a);
                if (b.length)
                    for (var d = 0; d < b.length; d++)
                        if (!1 === a[b[d]])
                            c.applyCreate.call(this, b[d]);
            };
            return c;
        }(), ya = function () {
            var h = function (c) {
                c.getHeader = h.get;
                c.setHeader = h.set;
                c.getHeaders = h.all;
            };
            h.get = function (c) {
                var a;
                if (a = this.options.columns)
                    return a[c].title || z.getColumnName(c);
            };
            h.all = function (c) {
                for (var a = [], b = 0; b < this.options.columns.length; b++)
                    a.push(h.get.call(this, b));
                return c ? a : a.join(this.options.csvDelimiter);
            };
            h.set = function (c, a) {
                if (!J.call(this.parent, this))
                    return !1;
                var b;
                if (b = this.options.columns[c]) {
                    if (!a && (a = prompt(E('Column name'), d), !a))
                        return !1;
                    var d = h.get.call(this, c);
                    b.title = a;
                    if (b = this.headers[c])
                        b.innerHTML = a, b.setAttribute('data-title', a);
                    O.call(this.parent, {
                        worksheet: this,
                        action: 'setHeader',
                        column: c,
                        oldValue: d,
                        newValue: a
                    });
                    F.call(this, 'setHeader', {
                        column: c,
                        title: a
                    });
                    A.call(this.parent, 'onchangeheader', this, c, a, d);
                }
            };
            h.create = function (c) {
                var a = this.options.columns[c], b = a.width || this.options.defaultColWidth, d = a.align || 'center', e = a.title || z.getColumnName(c), f = document.createElement('td');
                this.parent.config.stripHTML ? f.innerText = e : f.innerHTML = e;
                f.setAttribute('data-x', c);
                f.style.textAlign = d;
                if (a.title)
                    f.setAttribute('data-title', f.innerText);
                a.tooltip && (f.title = a.tooltip);
                d = this.options.filters;
                !0 === a.filter && (d = !0);
                !1 === a.filter && (d = !1);
                if (!0 === d)
                    f.classList.add('jss_filters_icon');
                !1 === a.visible && (b = '0');
                d = document.createElement('col');
                d.setAttribute('width', b);
                a.type == 'hidden' && (f.style.display = 'none', d.style.display = 'none');
                this.headers[c] = f;
                this.colgroup[c] = d;
            };
            return h;
        }(), W = function () {
            var h = function (a, b, d) {
                    var e = this.footers.content, f;
                    e && e[b] && e[b][a] && (f = e[b][a].element) && (ea(d) && 1 == this.parent.config.parseFormulas ? d = R.execute.call(this, d, a, null, !1) : d || (e = this.options.footers, d = e[b] && e[b][a] ? e[b][a] : ''), this.options.applyMaskOnFooters && (e = Z.get.call(this, a), d = t.editors.general.parseValue(a, b, d, this, e[1], f)), d instanceof Element || d instanceof HTMLDocument ? (f.innerHTML = '', f.appendChild(d)) : 1 == this.parent.config.stripHTML ? f.innerText = d : f.innerHTML = d);
                }, c = function (a) {
                    a.getFooter = c.get;
                    a.setFooter = c.set;
                    a.resetFooter = c.reset;
                    a.refreshFooter = c.refresh;
                    a.getFooterValue = c.value;
                    a.setFooterValue = c.value;
                };
            c.get = function () {
                return this.options.footers;
            };
            c.set = function (a) {
                if (a) {
                    var b = this.options.footers;
                    this.options.footers = a;
                }
                if (this.options.footers != b) {
                    W.build.call(this);
                    if (B.limited.call(this))
                        B.refresh.call(this);
                    else
                        c.render.call(this);
                    F.call(this, 'setFooter', { data: this.options.footers });
                    A.call(this.parent, 'onchangefooter', this, this.options.footers, b);
                }
            };
            c.refresh = function () {
                var a = this.options.footers;
                if (a && a.length)
                    for (var b = 0; b < a.length; b++)
                        for (var d = 0; d < a[b].length; d++)
                            h.call(this, d, b, a[b][d]);
            };
            c.value = function (a, b, d) {
                if (void 0 === d)
                    return this.options.footers[b][a];
                h.call(this, a, b, d);
                F.call(this, 'setFooterValue', {
                    x: a,
                    y: b,
                    value: d
                });
                A.call(this.parent, 'onchangefootervalue', this, a, b, d);
            };
            c.reset = function () {
                var a = this.options.footers;
                this.options.footers = null;
                this.footers.content = null;
                this.tfoot.innerHTML = '';
                F.call(this, 'resetFooter', {});
                A.call(this.parent, 'onchangefooter', this, null, a);
            };
            c.create = function (a, b) {
                var d = this.footers.content[b][a];
                if (d && d.element)
                    return d.element;
                d = this.footers.content[b][a] = {};
                var e = this.options.columns[a].align ? this.options.columns[a].align : 'center';
                d.element = document.createElement('td');
                d.element.style.textAlign = e;
                d.element.setAttribute('data-x', a);
                d.element.setAttribute('data-y', b);
                h.call(this, a, b, null);
                this.options.columns[a].type == 'hidden' && (d.element.style.display = 'none');
                return d.element;
            };
            c.build = function () {
                this.footers = {
                    element: this.tfoot,
                    content: []
                };
                if (this.options.footers)
                    for (var a = 0; a < this.options.footers.length; a++) {
                        if (!this.footers.content[a]) {
                            this.footers.content[a] = [];
                            var b = document.createElement('tr'), d = document.createElement('td');
                            d.innerHTML = '&nbsp;';
                            b.appendChild(d);
                            this.footers.element.appendChild(b);
                        }
                        for (b = 0; b < this.options.columns.length; b++)
                            this.options.footers[a][b] || (this.options.footers[a][b] = ''), this.footers.content[a][b] || (this.footers.content[a][b] = {});
                    }
            };
            c.render = function () {
                for (var a = this.options.footers, b = 0; b < a.length; b++)
                    for (var d = 0; d < a[b].length; d++) {
                        var e = W.create.call(this, d, b);
                        this.tfoot.children[b].appendChild(e);
                    }
            };
            c.adjust = function (a, b, d) {
                var e = [], f = this.options.footers, g = this.footers.content;
                if (f)
                    if (1 == d) {
                        if (this.headers[a] && this.headers[a].parentNode)
                            var k = this.headers[a] == this.thead.lastChild.lastChild ? !0 : !1, n = !0;
                        for (d = 0; d < f.length; d++) {
                            for (var m = f[d].splice(a), p = a; p < a + b; p++)
                                f[d][p] = '';
                            f[d] = f[d].concat(m);
                            m = g[d].splice(a);
                            for (p = a; p < a + b; p++)
                                if (g[d][p] = { element: c.create.call(this, p, d) }, n)
                                    if (1 == k)
                                        this.tfoot.children[d].appendChild(g[d][p].element);
                                    else
                                        this.tfoot.children[d].insertBefore(g[d][p].element, this.tfoot.children[d].children[a].nextSibling);
                            g[d] = g[d].concat(m);
                        }
                    } else
                        for (d = 0; d < f.length; d++) {
                            for (p = a; p < a + b; p++)
                                if ((k = this.footers.content[d][p].element) && k.parentNode)
                                    k.parentNode.removeChild(k);
                            g[d].splice(a, b);
                            e[d] = f[d].splice(a, b);
                        }
                return e;
            };
            return c;
        }(), ka = function () {
            var h = function (c) {
                c.setNestedCell = h.cell;
                c.getNestedCell = h.cell;
                c.setNestedHeaders = h.set;
                c.getNestedHeaders = h.get;
                c.resetNestedHeaders = h.reset;
            };
            h.get = function () {
                return this.options.nestedHeaders;
            };
            h.set = function (c) {
                h.reset.call(this);
                this.options.nestedHeaders = c;
                h.build.call(this);
                h.render.call(this);
                ca.refresh.call(this);
                N.call(this);
                F.call(this, 'setNestedHeaders', { data: c });
                A.call(this.parent, 'onchangenested', this, c);
            };
            h.reset = function () {
                var c = [], a = this.thead.children;
                this.options.nestedHeaders = null;
                for (var b = 0; b < a.length; b++)
                    if (a[b].classList.contains('jss_nested'))
                        c.push(a[b]);
                if (c.length)
                    for (; a = c.shift();)
                        a.remove();
                this.nested = null;
                ca.refresh.call(this);
                N.call(this);
                F.call(this, 'resetNestedHeaders');
                A.call(this.parent, 'onchangenested', this, []);
            };
            h.cell = function (c, a, b) {
                if (b) {
                    if (!J.call(this.parent, this))
                        return !1;
                    var d = this.options.nestedHeaders[a][c], e = this.nested.content[a][c].element;
                    void 0 !== b.title && (e.innerText = b.title);
                    void 0 !== b.tooltip && (e.title = b.tooltip);
                    void 0 !== b.colspan && (d.colspan = b.colspan, e.setAttribute('colspan', b.colspan), e.style.display = 0 == d.colspan ? 'none' : '');
                    F.call(this, 'setNestedCell', {
                        x: c,
                        y: a,
                        properties: b
                    });
                    A.call(this.parent, 'onchangenestedcell', this, c, a, b);
                } else
                    return this.nested.content[a][c].element;
            };
            h.range = function (c) {
                c = this.options.nestedHeaders[c];
                for (var a = [], b = 0, d = 0; d < c.length; d++) {
                    var e = parseInt(c[d].colspan);
                    a[d] = [
                        b,
                        b + e - 1
                    ];
                    b += e;
                }
                return a;
            };
            h.getColumns = function (c) {
                c = this.options.nestedHeaders[c];
                for (var a = [], b = 0; b < c.length; b++)
                    for (var d = c[b].colspan, e = 0; e < d; e++)
                        a.push(b);
                return a;
            };
            h.create = function (c, a) {
                if (this.nested.content[a][c])
                    return this.nested.content[a][c].element;
                var b = this.options.nestedHeaders[a][c] || {}, d = this.nested.content[a][c] = {};
                b.colspan || (b.colspan = 1);
                b.align || (b.align = 'center');
                b.title || (b.title = '');
                var e = document.createElement('td');
                e.setAttribute('data-nested-x', c);
                e.setAttribute('data-nested-y', a);
                e.setAttribute('colspan', b.colspan);
                e.setAttribute('align', b.align);
                e.innerHTML = b.title;
                b.tooltip && (e.title = b.tooltip);
                return d.element = e;
            };
            h.build = function () {
                this.nested || (this.nested = { content: [] });
                if (this.options.nestedHeaders)
                    for (var c = 0; c < this.options.nestedHeaders.length; c++) {
                        this.nested.content[c] = [];
                        var a = document.createElement('td');
                        a.innerHTML = '&nbsp;';
                        var b = document.createElement('tr');
                        b.classList.add('jss_nested');
                        b.appendChild(a);
                        this.thead.insertBefore(b, this.thead.lastChild);
                    }
            };
            h.render = function () {
                for (var c, a = this.options.nestedHeaders, b = 0; b < a.length; b++)
                    for (var d = 0; d < this.thead.lastChild.children.length; d++) {
                        c = this.thead.lastChild.children[d].getAttribute('data-x');
                        var e = h.getColumns.call(this, b);
                        if (void 0 !== e[c])
                            h.renderCell.call(this, e[c], b);
                    }
            };
            h.renderCell = function (c, a, b) {
                var d = ka.create.call(this, c, a);
                if (d.parentNode)
                    c = d.getAttribute('colspan'), c++, d.setAttribute('colspan', c);
                else {
                    d.setAttribute('colspan', 1);
                    if (b)
                        this.thead.children[a].insertBefore(d, this.thead.children[a].children[b]);
                    else
                        this.thead.children[a].appendChild(d);
                    0 == c && 0 < this.options.freezeColumns && (d.classList.add('jss_freezed'), d.style.left = '51px');
                }
            };
            h.adjust = function (c, a, b, d) {
                var e = this.options.nestedHeaders;
                if (e)
                    if (1 == b)
                        if (d && d.nested)
                            for (b = 0; b < e.length; b++)
                                for (var f = 0; f < e[b].length; f++)
                                    h.cell.call(this, f, b, { colspan: d.nested[b][f] });
                        else
                            for (b = 0; b < e.length; b++) {
                                if (f = h.getColumns.call(this, b)) {
                                    f = f[c];
                                    var g = parseInt(e[b][f].colspan) + a;
                                    h.cell.call(this, f, b, { colspan: g });
                                }
                            }
                    else {
                        d = [];
                        for (b = 0; b < e.length; b++)
                            if (g = h.getColumns.call(this, b)) {
                                d[b] = [];
                                for (f = 0; f < a; f++) {
                                    var k = g[c + f];
                                    typeof d[b][k] == 'undefined' && (d[b][k] = e[b][k].colspan);
                                    e[b][k].colspan--;
                                }
                                g = Object.keys(d[b]);
                                for (f = 0; f < g.length; f++)
                                    h.cell.call(this, g[f], b, { colspan: e[b][g[f]].colspan });
                            }
                        return d;
                    }
            };
            return h;
        }(), fa = function () {
            var h = function (c, a) {
                var b = function (p) {
                        var q;
                        (q = this.results) ? p = q.indexOf(p) : q = this.rows;
                        p--;
                        for (var r = p; 0 <= r; r--)
                            if (p = this.results ? q[r] : r, this.rows[p] && this.rows[p].element)
                                return p;
                        return 0;
                    }, d = function (p) {
                        var q;
                        (q = this.results) ? p = q.indexOf(p) : q = this.rows;
                        p++;
                        for (var r = p; r < q.length; r++)
                            if (p = this.results ? q[r] : r, this.rows[p] && this.rows[p].element)
                                return p;
                        return q[q.length - 1];
                    }, e = function (p, q) {
                        for (; 0 <= p; p--)
                            if (this.records[q][p].element && this.records[q][p].element.style.display != 'none')
                                return p;
                        return 0;
                    }, f = function (p, q) {
                        for (; p < this.options.columns.length; p++)
                            if (this.records[q][p].element && this.records[q][p].element.style.display != 'none')
                                return p;
                        return this.options.columns - 1;
                    }, g = this.getHighlighted(), k = g[0], n = g[1], m = g[2];
                g = g[3];
                c = parseInt(c);
                a = parseInt(a);
                null != c && null != a && (0 < c - m ? (f = f.call(this, parseInt(m) + 1, a), c = parseInt(c)) : (f = parseInt(c), c = e.call(this, parseInt(k) - 1, a)), 0 < a - g ? (d = d.call(this, parseInt(g)), a = parseInt(a)) : (d = parseInt(a), a = b.call(this, parseInt(n))), c - f <= a - d ? (f = parseInt(k), c = parseInt(m)) : (d = parseInt(n), a = parseInt(g)), this.setBorder(f, d, c, a, 'cloning'));
            };
            h.execute = function (c) {
                if (!J.call(this.parent, this))
                    return !1;
                var a = this.borders.cloning;
                if (c)
                    if (a && a.active) {
                        c = a.x1;
                        var b = a.y1, d = a.x2, e = a.y2;
                    } else
                        return !1;
                else if (d = this.getSelected(), d.length)
                    c = d[0].x, b = parseInt(d[d.length - 1].y) + 1, d = d[d.length - 1].x, e = this.options.data.length - 1;
                else
                    return !1;
                var f, g = 0, k = [], n = [], m = !1, p = this.getHighlighted(), q = Ba.get.call(this, p, !1, !1), r = this.getSelected();
                if (f = this.getStyle(r, !0)) {
                    var u = Object.keys(f);
                    if (u.length)
                        for (var l = 0; l < u.length; l++)
                            k.push(f[u[l]]);
                }
                if (p[0] == c)
                    var w = b < p[1] ? b - p[1] : 1, v = 0;
                else
                    v = c < p[0] ? c - p[0] : 1, w = 0;
                u = 0;
                c = parseInt(c);
                d = parseInt(d);
                b = parseInt(b);
                e = parseInt(e);
                for (var x = b; x <= e; x++)
                    if (!this.results || -1 != this.results.indexOf(x)) {
                        void 0 == q[g] && (g = 0);
                        f = 0;
                        p[0] != c && (v = c < p[0] ? c - p[0] : 1);
                        for (l = c; l <= d; l++) {
                            if (!(0 != m || this.records[x][l].element && this.records[x][l].element.classList.contains('readonly'))) {
                                if ((!a || 1 != a.active) && I.call(this, l, x)) {
                                    m = !0;
                                    continue;
                                }
                                void 0 == q[g] ? f = 0 : void 0 == q[g][f] && (f = 0);
                                var y = q[g][f];
                                y && !q[1] && 1 == this.parent.config.autoIncrement && (this.options.columns[l].type == 'text' || this.options.columns[l].type == 'number' ? ea(y) ? y = R.shiftFormula(y, v, x - p[1]) : y == Number(y) && (y = Number(y) + w) : this.options.columns[l].type == 'calendar' && (y = new Date(y), y.setDate(y.getDate() + w), y = y.getFullYear() + '-' + jSuites.two(parseInt(y.getMonth() + 1)) + '-' + jSuites.two(y.getDate()) + ' ' + '00:00:00'));
                                y = {
                                    x: l,
                                    y: x,
                                    value: y
                                };
                                k && null != k[u] && (y.style = k[u], u++, u >= k.length && (u = 0));
                                n.push(y);
                            }
                            f++;
                            p[0] != c && v++;
                        }
                        g++;
                        w++;
                    }
                n.length && (r[0].x < c && (c = r[0].x), r[0].y < b && (b = r[0].y), r[r.length - 1].x > d && (d = r[r.length - 1].x), r[r.length - 1].y > e && (e = r[r.length - 1].y), this.setValue(n), this.resetBorders('cloning', !0), this.updateSelectionFromCoords(c, b, d, e));
            };
            h.end = function (c) {
                fa.event = !1;
                fa.execute.call(this, !0);
            };
            h.cancel = function (c) {
                fa.event = !1;
                this.resetBorders('cloning', !0);
            };
            return h;
        }(), Ba = function () {
            var h = function (c) {
                c.getData = h.get;
                c.getJson = h.get;
                c.setData = h.set;
                c.loadData = h.load;
                c.getRowData = h.getRowData;
                c.setRowData = h.setRowData;
                c.getColumnData = h.getColumnData;
                c.setColumnData = h.setColumnData;
                c.updateData = h.update;
                c.refresh = h.refresh;
                c.data = h.get;
                c.download = h.download;
                c.copy = h.copy;
                c.paste = h.paste;
                c.cut = function () {
                    return c.copy(!0);
                };
            };
            h.get = function (c, a, b) {
                !0 === c && (c = this.getHighlighted());
                for (var d = c ? !0 : !1, e, f = [], g = this.options.columns.length, k = this.options.data.length, n, m = this.dataType && typeof b == 'undefined' ? 1 : 0, p = 0; p < k; p++) {
                    n = null;
                    e = m ? {} : [];
                    for (var q = 0; q < g; q++) {
                        var r;
                        if (!(r = !d)) {
                            r = c[1];
                            var u = c[2], l = c[3];
                            r = q >= c[0] && q <= u && p >= r && p <= l ? !0 : !1;
                        }
                        if (r && (!d || !this.results || -1 != this.results.indexOf(p))) {
                            r = I.call(this, q, p);
                            if (a) {
                                if (d && !1 === this.rows[p].visible)
                                    continue;
                                n = aa.processed.call(this, q, p);
                                void 0 !== n && (r = n);
                            }
                            b && r.match && (r.match(b) || r.match(/\n/) || r.match(/"/)) && (r = r.replace(new RegExp('"', 'g'), '""'), r = '"' + r + '"');
                            if (m)
                                jSuites.path.call(e, '' + qa.call(this, q), r);
                            else
                                e.push(r);
                            n = !0;
                        }
                    }
                    if (n)
                        if (b)
                            f.push(e.join(b));
                        else
                            f.push(e);
                }
                return b ? f.join('\r\n') + '\r\n' : f;
            };
            h.parse = function () {
                for (var c, a = {}, b = 0, d, e = [], f = this.options.data, g = 0; g < f.length; g++)
                    c = null, d = g, f[g].data && (Array.isArray(f[g].data) || typeof f[g].data == 'object') && (typeof f[g].id == 'number' && (c = parseInt(f[g].id)), typeof f[g].row == 'number' && (d = f[g].row), e[d] = f[g].data, f[g] = []), d > b && (b = d), c && (a[d] = c);
                if (Object.keys(e).length)
                    for (g = 0; g <= b; g++)
                        e[g] && (f[g] = e[g]);
                b = this.getPrimaryKey();
                if (!1 !== b)
                    for (b = qa.call(this, b), g = 0; g < f.length; g++)
                        a[g] || !1 === b || (c = parseInt(f[g][b]), 0 < c && (a[g] = c));
                return a;
            };
            h.type = function () {
                for (var c = this.dataType = 0; c < this.options.columns.length; c++)
                    typeof this.options.columns[c].name !== 'undefined' && (this.dataType = 1);
            };
            h.set = function (c) {
                c = h.standardize(c);
                var a = {}, b = [], d = {};
                var e = Object.keys(c[0]).length - this.options.columns.length;
                if (0 < e)
                    this.insertRow(e);
                var f = c.length - this.options.data.length;
                if (0 < f)
                    this.insertRow(f);
                for (var g = 0; g < this.options.data.length; g++) {
                    void 0 === c[g] && (c[g] = {
                        row: g,
                        data: []
                    });
                    for (var k = 0; k < this.options.columns.length; k++)
                        c[g].data[k] || (c[g].data[k] = '');
                }
                for (k = 0; k < this.options.columns.length; k++) {
                    var n = qa.call(this, k);
                    d[n] = k;
                }
                for (g = 0; g < c.length; g++) {
                    f = c[g].row;
                    n = Object.keys(c[g].data);
                    for (k = 0; k < n.length; k++)
                        if (e = null, void 0 !== d[n[k]] ? e = d[n[k]] : -1 < n[k] && (e = parseInt(n[k])), null !== e)
                            b.push({
                                x: e,
                                y: f,
                                value: c[g].data[n[k]]
                            });
                    c[g].id && (a[f] = c[g].id);
                }
                pa.setId.call(this, a);
                aa.set.call(this, b, null, !0);
            };
            h.build = function () {
                this.results = null;
                this.rows = [];
                this.records = [];
                this.sequence = 0;
                if (this.options.data) {
                    var c = h.parse.call(this), a = this.options.data.length;
                    this.options.minDimensions[1] > a && (a = this.options.minDimensions[1]);
                    for (var b = 0; b < a; b++) {
                        var d = c[b] ? c[b] : null;
                        ia.row.call(this, b, d);
                    }
                }
                h.type.call(this);
            };
            h.load = function (c) {
                this.resetBorders();
                this.resetSelection();
                this.tbody.innerText = '';
                this.options.data = c;
                h.build.call(this);
                B.call(this);
            };
            h.refresh = function (c) {
                if (typeof c !== 'undefined')
                    for (var a = 0; a < this.options.columns.length; a++) {
                        var b = this.records[c] && this.records[c][a].element ? this.records[c][a].element : null, d = Z.get.call(this, a, c);
                        if (typeof d[0].updateCell == 'function')
                            d[0].updateCell(b, I.call(this, a, c), a, c, this, d[1]);
                        if (b)
                            H.applyOverflow.call(this, b, a, c);
                    }
                else if (this.options.url) {
                    var e = this;
                    if (1 == this.parent.config.loadingSpin)
                        jSuites.loading.show();
                    jSuites.ajax({
                        url: this.options.url,
                        method: 'GET',
                        dataType: 'json',
                        success: function (f) {
                            e.setData(f);
                            jSuites.loading.hide();
                        }
                    });
                }
            };
            h.getRowData = function (c, a) {
                if (typeof this.options.data[c] === 'undefined')
                    return !1;
                if (a) {
                    if (this.dataType) {
                        a = {};
                        for (var b = 0; b < this.options.columns.length; b++) {
                            var d = '' + qa.call(this, b), e = '' + aa.processed.call(this, b, c, !0);
                            jSuites.path.call(a, d, e);
                        }
                    } else
                        for (a = [], b = 0; b < this.options.columns.length; b++)
                            a.push(aa.processed.call(this, b, c, !0));
                    return a;
                }
                return JSON.parse(JSON.stringify(this.options.data[c]));
            };
            h.setRowData = function (c, a, b) {
                for (var d = [], e = 0; e < this.options.columns.length; e++)
                    typeof a[e] === 'undefined' && (a[e] = ''), d.push({
                        x: e,
                        y: c,
                        value: a[e]
                    });
                if (d.length)
                    this.setValue(d, null, b);
            };
            h.getColumnData = function (c, a) {
                if (typeof this.options.columns[c] === 'undefined')
                    return !1;
                for (var b = [], d = 0; d < this.options.data.length; d++) {
                    var e = a ? aa.processed.call(this, c, d, !0) : I.call(this, c, d);
                    b.push(e);
                }
                return b;
            };
            h.setColumnData = function (c, a, b) {
                for (var d = [], e = 0; e < this.rows.length; e++)
                    typeof a[e] === 'undefined' && (a[e] = ''), d.push({
                        x: c,
                        y: e,
                        value: a[e]
                    });
                if (d.length)
                    this.setValue(d, null, b);
            };
            h.copy = function (c) {
                var a = this, b = this.getHighlighted(), d = function () {
                        a.setBorder(b[0], b[1], b[2], b[3], 'copying');
                        a.borders.copying.clear = 1 == c ? !0 : !1;
                    }, e = h.get.call(this, b, !0, '\t'), f = A.call(this.parent, 'oncopy', this, b, e);
                if (f)
                    e = f;
                else if (!1 === f)
                    return !1;
                if (navigator.clipboard)
                    navigator.clipboard.writeText(e).then(d);
                else
                    this.parent.textarea.value = e, this.parent.textarea.select(), document.execCommand('copy'), d();
                return e;
            };
            h.paste = function (c, a, b) {
                if (!J.call(this.parent, this))
                    return !1;
                var d = this, e = function () {
                        d.borders.copying && (d.resetBorders('copying', !0), d.borders.copying.clear = !1);
                    }, f = b, g = null, k = this.options.style, n = null, m = null, p = [];
                if (this.borders.copying) {
                    var q = [
                        this.borders.copying.x1,
                        this.borders.copying.y1,
                        this.borders.copying.x2,
                        this.borders.copying.y2
                    ];
                    n = q[0];
                    m = q[1];
                    var r = jSuites.hash(b), u = jSuites.hash(h.get.call(this, q, !0, '\t'));
                    if (r != u)
                        e();
                    else {
                        var l = 0, w = 0;
                        b = h.get.call(this, q, !1, !1);
                        for (r = q[1]; r <= q[3]; r++)
                            if (!this.results || -1 != this.results.indexOf(r)) {
                                p[w] = [];
                                l = 0;
                                for (u = q[0]; u <= q[2]; u++)
                                    g = z.getColumnNameFromCoords(u, r), p[w][l] = k && k[g] ? k[g] : 'color: initial', l++;
                                w++;
                            }
                    }
                }
                c = parseInt(c);
                a = parseInt(a);
                if (100 < f.length && !this.options.pagination && !B.limited.call(this))
                    console.log('JSS: For better results, please allow pagination or tableOverflow.');
                if (r = A.call(this.parent, 'onbeforepaste', this, b, c, a, p, f))
                    b = r;
                else if (!1 === r)
                    return !1;
                if (b) {
                    Array.isArray(b) || (b = z.parseCSV(b, '\t'));
                    if (f = this.getHighlighted()) {
                        g = [];
                        l = [];
                        w = [];
                        k = [];
                        var v = 0, x = 0;
                        for (r = f[1]; r <= f[3]; r++)
                            if (!this.results || -1 != this.results.indexOf(r)) {
                                g = [];
                                l = [];
                                for (u = f[0]; u <= f[2]; u++) {
                                    g.push(b[x][v]);
                                    if (p && p[x] && p[x][v])
                                        l.push(p[x][v]);
                                    else
                                        l.push('');
                                    v++;
                                    v >= b[0].length && (v = 0);
                                }
                                w.push(g);
                                k.push(l);
                                x++;
                                x >= b.length && (x = 0);
                            }
                        0 == w.length % b.length && 0 == w[0].length % b[0].length && (b = w, p = k);
                    }
                    k = null;
                    f = [];
                    if (this.borders.copying && !0 === this.borders.copying.clear) {
                        for (r = q[1]; r <= q[3]; r++)
                            for (u = q[0]; u <= q[2]; u++)
                                if (!this.results || this.results && 0 <= this.results.indexOf(r))
                                    f.push({
                                        x: u,
                                        y: r,
                                        value: '',
                                        style: ''
                                    });
                        e();
                    }
                    r = c + b[0].length - this.options.columns.length;
                    if (0 < r)
                        this.insertColumn(r);
                    r = a + b.length - this.rows.length;
                    if (0 < r)
                        this.insertRow(r);
                    l = g = c;
                    v = w = a;
                    x = null;
                    this.results && (k = this.results.indexOf(a));
                    for (r = 0; r < b.length; r++)
                        for (u = 0; u < b[r].length; u++) {
                            null !== n && null !== m && b[r][u][0] == '=' && (b[r][u] = R.shiftFormula(b[r][u], c - n, a - m));
                            l = c + u;
                            v = a + r;
                            this.results && (v = this.results[k + r]);
                            var y = {
                                x: l,
                                y: v,
                                value: b[r][u]
                            };
                            p && p[r] && p[r][u] && (y.style = p[r][u]);
                            f.push(y);
                            null === x && ua.isSelected.call(this, l, v, q) && (x = !0);
                        }
                    x && e();
                    f.length && (aa.set.call(this, f, null, this.parent.config.forceUpdateOnPaste ? !0 : !1), A.call(this.parent, 'onpaste', this, f), this.updateSelectionFromCoords(g, w, l, v));
                }
            };
            h.download = function (c, a) {
                if (this.parent.config.allowExport) {
                    void 0 === a && (a = !0);
                    var b = '';
                    if (1 == c || 1 == this.parent.config.includeHeadersOnDownload)
                        b += this.getHeaders().replace(/\s+/gm, ' ') + '\r\n';
                    b += h.get.call(this, null, a, this.options.csvDelimiter);
                    a = new Blob(['\uFEFF' + b], { type: 'text/csv;charset=utf-8;' });
                    if (window.navigator && window.navigator.msSaveOrOpenBlob)
                        window.navigator.msSaveOrOpenBlob(a, this.options.csvFileName + '.csv');
                    else
                        c = document.createElement('a'), a = URL.createObjectURL(a), c.href = a, c.setAttribute('download', this.options.csvFileName + '.csv'), document.body.appendChild(c), c.click(), c.parentNode.removeChild(c);
                } else
                    console.error('Export not allowed');
            };
            h.standardize = function (c) {
                c ||= [];
                Array.isArray(c) || (c = [c]);
                void 0 == c[0] || Array.isArray(c[0]) || typeof c[0] == 'object' || (c = [c]);
                for (var a = 0; a < c.length; a++) {
                    var b = {};
                    Array.isArray(c[a]) || void 0 == c[a].data ? b.data = c[a] : b = c[a];
                    b.row = void 0 == c[a].row ? a : c[a].row;
                    c[a] = b;
                }
                return c;
            };
            return h;
        }(), Ua = function () {
            var h = function (c) {
                c.getLabel = h.get;
                c.getLabelFromCoords = h.get;
            };
            h.get = function (c, a, b) {
                typeof c == 'string' && null === a && (z.getCoordsFromColumnName(c), c = cell[0], a = cell[1]);
                return this.getProcessed(c, a, b);
            };
            return h;
        }(), Ea = function () {
            var h = function (c) {
                c.getDefinedNames = h.get;
                c.setDefinedNames = h.set;
            };
            h.set = function (c) {
                var a = Object.keys(c);
                if (a.length) {
                    for (var b = 0; b < a.length; b++)
                        this.parent.config.definedNames[a[b]] = c[a[b]];
                    F.call(this, 'setDefinedNames', [c]);
                }
            };
            h.get = function (c) {
                var a = this.parent.config.definedNames;
                return c ? a[c] : a;
            };
            h.updateAll = function (c, a) {
                var b, d = {};
                if (b = this.parent.config.definedNames) {
                    var e = Object.keys(b);
                    if (e.length) {
                        for (var f = this.getWorksheetName(), g = 0; g < e.length; g++) {
                            var k = R.update.call(this, b[e[g]], c, a, f);
                            k !== b[e[g]] && (d[e[g]] = k);
                        }
                        h.set.call(this, d);
                    }
                }
            };
            h.updateWorksheetName = function (c, a) {
                var b, d = {};
                if (b = this.parent.config.definedNames) {
                    var e = Object.keys(b);
                    if (e.length) {
                        for (var f = 0; f < e.length; f++) {
                            var g = R.updateWorksheetName(b[e[f]], c, a);
                            g !== b[e[f]] && (d[e[f]] = g);
                        }
                        h.set.call(this, d);
                    }
                }
            };
            return h;
        }(), U = function () {
            var h = [
                    '#1a237e',
                    '#b71c1c',
                    '#880e4f',
                    '#1b5e20',
                    '#ff6f00'
                ], c = [
                    '-',
                    '+',
                    '/',
                    '*',
                    '^',
                    '(',
                    '{',
                    '[',
                    ',',
                    '|',
                    '=',
                    '<',
                    '>'
                ], a = [], b = function () {
                    if (0 < a.length) {
                        for (var f = 0; f < a.length; f++)
                            ca.destroy.call(this, a[f]);
                        a = [];
                    }
                }, d = function (f) {
                    b.call(this);
                    for (var g = 0, k = [], n, m = 0; m < f.children.length; m++)
                        if (n = f.children[m].getAttribute('data-token')) {
                            k[n] || (k[n] = h[g++], 4 < g && (g = 0));
                            f.children[m].style.color = k[n];
                            if (-1 === n.indexOf('!')) {
                                if (0 <= n.indexOf(':')) {
                                    var p = n.split(':'), q = z.getCoordsFromColumnName(p[0]);
                                    p = z.getCoordsFromColumnName(p[1]);
                                } else
                                    p = q = z.getCoordsFromColumnName(n);
                                ua.set.call(this, q[0], q[1], p[0], p[1], null, n, k[n]);
                            }
                            a.push(n);
                        }
                }, e = function (f, g) {
                    f.classList.add('jss_formula');
                    f.classList.add('jss_picker');
                    f.classList.add('jss_object');
                    f.classList.add('input');
                    f.setAttribute('contenteditable', !0);
                    f.addEventListener('click', function (k) {
                        k = k.changedTouches && k.changedTouches[0] ? k.changedTouches[0].clientX : k.clientX;
                        var n = this.getBoundingClientRect();
                        24 > n.width - (k - n.left) && (e.current = f, f.classList.add('active'));
                    });
                    typeof g == 'function' && (f.onchange = g);
                };
            e.current = null;
            e.parse = function (f) {
                for (var g = '', k = '', n = window.getSelection(), m = document.createRange(), p = z.getCaretIndex.call(this.parent, f), q = R.tokenize(f.innerText.replace(/(\r\n|\n|\r)/gm, '')), r = 0; r < q.length; r++)
                    q[r] && R.tokenIdentifier.test(q[r].trim()) ? (r == q.length - 1 && (k = 'last'), g += '<b class="' + k + '" data-token="' + q[r].trim().replace(/\$/g, '') + '">' + q[r] + '</b>') : g += q[r];
                f.innerHTML = g;
                g = null;
                for (r = 0; r < f.childNodes.length && !(g = f.childNodes[r], k = g.tagName ? g.innerText.length : g.length, 0 >= p - k); r++)
                    p -= k;
                if (g) {
                    if (g.tagName)
                        m.setStart(g.firstChild, p);
                    else
                        m.setStart(g, p);
                    n.removeAllRanges();
                    n.addRange(m);
                }
                d.call(this, f);
            };
            e.close = function (f) {
                b.call(this);
                if (f)
                    f.classList.remove('jss_formula');
                else {
                    if (typeof U.current.onchange == 'function')
                        U.current.onchange.call(U.current);
                    U.current.classList.remove('active');
                    U.current = null;
                }
            };
            e.getName = function (f, g, k, n, m) {
                f = z.getColumnNameFromCoords(f, g);
                k = z.getColumnNameFromCoords(k, n);
                m.ctrlKey && (f = k);
                return f !== k ? (m = f + ':' + k, m = R.getTokensFromRange.call(this, m), R.getRangeFromTokens.call(this, m)) : f;
            };
            e.range = function (f, g, k, n, m) {
                f = e.getName.call(this, f, g, k, n, m);
                g = document.createElement('b');
                g.innerText = f;
                g.setAttribute('data-token', f);
                e.current.innerText = '';
                e.current.appendChild(g);
                d.call(this, e.current);
                jSuites.focus(g);
                m.preventDefault();
            };
            e.update = function (f, g, k, n, m) {
                var p = this, q = jSuites.getNode();
                if (q) {
                    var r = e.getName.call(this, f, g, k, n, m);
                    f = function (u) {
                        var l = document.createElement('b');
                        l.innerText = r;
                        l.setAttribute('data-token', r);
                        if (q.parentNode === p.parent.input && !1 === u)
                            q.parentNode.insertBefore(l, ref.nextSibling);
                        else
                            p.parent.input.appendChild(l);
                        q = l;
                    };
                    if (q.getAttribute('data-token'))
                        m.ctrlKey ? (p.parent.input.appendChild(document.createTextNode(',')), f(!0)) : (q.innerText = r, q.setAttribute('data-token', r));
                    else {
                        if (q.innerText !== '' && -1 == c.indexOf(q.innerText.slice(-1)) || q.nextElementSibling && q.nextElementSibling.getAttribute('data-token'))
                            return !1;
                        f(!1);
                    }
                    jSuites.focus(q);
                    d.call(p, p.parent.input);
                    m.preventDefault();
                    return !0;
                }
                return !1;
            };
            e.onkeydown = function (f) {
                if (f.target && f.target.classList.contains('jss_formula'))
                    if (f.ctrlKey) {
                        if (67 == f.which || 88 == f.which)
                            if (f = window.getSelection().toString().replace(/(\r\n|\n|\r)/gm, ''), navigator.clipboard)
                                navigator.clipboard.writeText(f);
                            else
                                this.parent.textarea.value = f, this.parent.textarea.select(), document.execCommand('copy');
                    } else if (36 == f.which) {
                        var g = window.getSelection(), k = document.createRange();
                        k.setStart(f.target, 0);
                        g.removeAllRanges();
                        g.addRange(k);
                    } else if (35 == f.which)
                        jSuites.focus(f.target);
                    else if (187 == f.which && !f.target.innerText.replace(/(\r\n|\n|\r)/gm, '') && f.target.getAttribute('data-mask'))
                        f.target.removeAttribute('data-mask');
            };
            return e;
        }(), R = function () {
            var h = new RegExp(/^(('.*?'!)|(\w*!))?(\$?[A-Z]+\$?[0-9]+)(:\$?[A-Z]+\$?[0-9]+)?$/i), c = function (m) {
                    m = a(m);
                    for (var p = [
                                '-',
                                '+',
                                '/',
                                '*',
                                '^',
                                '&'
                            ], q = [
                                '(',
                                ')',
                                '{',
                                '}',
                                '[',
                                ']',
                                ',',
                                '|',
                                '=',
                                '<',
                                '>'
                            ], r = '', u = [], l = 0, w = 0; w < m.length; w++) {
                        if (m[w] == '"' || m[w] == '\'')
                            l = 0 == l ? 1 : 0;
                        0 == l && (-1 < p.indexOf(m[w]) || -1 < q.indexOf(m[w])) ? (r && (u.push(r), r = ''), u.push(m[w])) : r += m[w];
                    }
                    if (r)
                        u.push(r);
                    for (w = 0; w < u.length; w++)
                        -1 == u[w].indexOf('"') && -1 == u[w].indexOf('\'') && (u[w] = u[w].replace(/\s/g, ''));
                    return u;
                }, a = function (m, p) {
                    for (var q = '', r = 0, u = [
                                '=',
                                '!',
                                '>',
                                '<'
                            ], l = 0; l < m.length; l++)
                        m[l] == '"' && (r = 0 == r ? 1 : 0), 1 == r ? q += m[l] : (q += m[l].toUpperCase(), 1 == p && 0 < l && m[l] == '=' && -1 == u.indexOf(m[l - 1]) && -1 == u.indexOf(m[l + 1]) && (q += '='));
                    return q;
                }, b = function (m) {
                    m.setFormula = b.set;
                    m.executeFormula = b.execute;
                    m.formula = [];
                };
            b.run = function (m, p) {
                var q = '', r = Object.keys(p);
                if (r.length) {
                    for (var u = {}, l = 0; l < r.length; l++)
                        if (w = r[l].replace(/!/g, '.'), 0 < w.indexOf('.')) {
                            var w = w.split('.');
                            u[w[0]] = {};
                        }
                    w = Object.keys(u);
                    for (l = 0; l < w.length; l++)
                        q += 'var ' + w[l] + ' = {};';
                    for (l = 0; l < r.length; l++)
                        w = r[l].replace(/!/g, '.'), jSuites.isNumeric(p[r[l]]) || (u = p[r[l]].match(/(('.*?'!)|(\w*!))?(\$?[A-Z]+\$?[0-9]*):(\$?[A-Z]+\$?[0-9]*)?/g)) && u.length && (p[r[l]] = e(u, p[r[l]])), q = 0 < w.indexOf('.') ? q + (w + ' = ' + p[r[l]] + ';\n') : q + ('var ' + w + ' = ' + p[r[l]] + ';\n');
                }
                m = m.replace(/\$/g, '');
                m = m.replace(/!/g, '.');
                (u = m.match(/(('.*?'!)|(\w*!))?(\$?[A-Z]+\$?[0-9]*):(\$?[A-Z]+\$?[0-9]*)?/g)) && u.length && (m = e(u, m));
                return new Function(q + '; return ' + m)();
            };
            b.set = function () {
            };
            var d = function (m) {
                    m = a(m, !0);
                    return m.replace(/\$/g, '');
                }, e = function (m, p) {
                    for (var q = 0; q < m.length; q++) {
                        var r = b.getTokensFromRange.call(this, m[q]);
                        p = p.replace(m[q], '[' + r.join(',') + ']');
                    }
                    return p;
                }, f = function (m, p, q) {
                    for (var r = this.config.definedNames, u = 0; u < m.length; u++)
                        m[u] && r && r[m[u]] && (p = p.replace(m[u], r[m[u]]), q && (q[m[u]] = r[m[u]]));
                    return d(p);
                }, g = function (m, p) {
                    var q;
                    if (q = this.records[p][m].a)
                        for (var r = 0; r < q.length; r++)
                            for (var u = 0; u < q[r].length; u++)
                                q[r][u] && (q[r][u].innerText = '', this.records[p + r][m + u].v = '');
                    this.records[p][m].a = [];
                };
            b.execute = function (m, p, q, r, u) {
                if (1 == this.parent.processing) {
                    if (null !== p && null !== q)
                        this.parent.queue.push([
                            this,
                            p,
                            q
                        ]);
                    return '';
                }
                var l = [], w = function (D, K, L, S) {
                        if (void 0 != K && void 0 != L) {
                            var wa = z.getColumnNameFromCoords(K, L);
                            L = S.getWorksheetName() + '.' + wa;
                            l[L] || (l[L] = 0);
                            l[L]++;
                            if (3 < l[L])
                                throw {
                                    error: '#LOOP',
                                    message: 'Reference loop detected',
                                    reference: L
                                };
                        } else
                            wa = null;
                        u || (D = d(D));
                        var Q = D, V = Q.match(/[A-Z_]+[A-Z0-9_\.]*/g);
                        V && V.length && (Q = f.call(S.parent, V, Q, v));
                        (V = Q.match(/(('.*?'!)|(\w*!))?(\$?[A-Z]+\$?[0-9]*):(\$?[A-Z]+\$?[0-9]*)?/g)) && V.length && (Q = e.call(S, V, Q));
                        V = [];
                        Q = c(Q);
                        for (var P = 0; P < Q.length; P++)
                            if (Q[P] && h.test(Q[P]))
                                V.push(Q[P]);
                        if (V) {
                            if (-1 < V.indexOf(wa))
                                throw {
                                    error: '#SELF',
                                    message: 'Self Reference detected'
                                };
                            for (Q = 0; Q < V.length; Q++) {
                                P = V[Q].split('!');
                                P[1] ? (K = P[1], P = M(P[0]), L = S.getWorksheetName() + '.' + wa) : (K = P[0], P = S, L = wa);
                                if (typeof P == 'undefined' || typeof P.formula == 'undefined')
                                    throw {
                                        error: '#ERROR',
                                        message: 'Table does not exist or is not loaded yet'
                                    };
                                if (L && (P.formula[K] || (P.formula[K] = []), 0 > P.formula[K].indexOf(L)))
                                    P.formula[K].push(L);
                                if (!v[V[Q]]) {
                                    L = z.getCoordsFromColumnName(K);
                                    K = L[0];
                                    L = L[1];
                                    var oa = void 0 !== P.records[L][K].v ? P.records[L][K].v : I.call(P, K, L);
                                    v[V[Q]] || (('' + oa).substr(0, 1) == '=' ? v[V[Q]] = w(oa, K, L, P) : (oa ? oa != Number(oa) && (oa = '"' + oa + '"') : oa = 0, v[V[Q]] = oa));
                                }
                            }
                        }
                        return D.substr(1);
                    }, v = {};
                try {
                    if (m = w(m, p, q, this)) {
                        var x = u ? b.run(m, v) : t.formula(m, v, p, q, this);
                        if (!1 !== r && void 0 != p && void 0 != q)
                            if (x instanceof Date)
                                this.records[q][p].v = jSuites.calendar.dateToNum(x);
                            else if (Array.isArray(x)) {
                                g.call(this, p, q);
                                r = [];
                                for (var y = null, C = 0; C < x.length; C++)
                                    for (var G = 0; G < x[C].length; G++)
                                        null === y && (0 < C && C > G && this.options.data[q + C][p + G] ? y = '#SPILL!' : (this.records[q + C][p + G].v = x[C][G], this.records[q + C][p + G].element && (r[C] || (r[C] = []), r[C][G] = this.records[q + C][p + G].element, this.records[q + C][p + G].element.innerText = x[C][G])));
                                if (null === y)
                                    y = x[0][0], this.records[q][p].a = r;
                                else
                                    g.call(this, p, q);
                                x = this.records[q][p].v = y;
                            } else
                                this.records[q][p].v = x;
                        return x;
                    }
                } catch (D) {
                    if (1 == this.parent.config.debugFormulas)
                        console.log(m, v, D);
                    return D && D.error ? D.error : '#ERROR';
                }
            };
            b.update = function (m, p, q, r) {
                var u = null, l = null, w = function (y) {
                        q && q[y] && (y = '#REF!');
                        p[y] && (y = p[y]);
                        return y;
                    };
                m = a(m, !0);
                m = c(m);
                for (var v = 0; v < m.length; v++)
                    if (m[v] && h.test(m[v])) {
                        if (-1 == m[v].indexOf('!')) {
                            if (l = m[v], u = '', r)
                                continue;
                        } else if (l = m[v].split('!'), u = l[0], l = l[1], r != u)
                            continue;
                        if (0 <= l.indexOf(':')) {
                            l = b.getTokensFromRange.call(this, l);
                            for (var x = 0; x < l.length; x++)
                                l[x] = w(l[x]);
                            l = b.getRangeFromTokens.call(this, l);
                        } else
                            -1 == l.indexOf('$') ? l = w(l) : (l = w(l.replace(/\$/g, '')), l = '$' + l.match(/[A-Z]+/g) + '$' + l.match(/[0-9]+/g));
                        u && (l = u + '!' + l);
                        m[v] = l;
                    }
                return m.join('');
            };
            var k = function (m, p) {
                this.splice(p, 0, this.splice(m, 1)[0]);
            };
            b.getChain = function (m) {
                if (void 0 === m)
                    return [];
                var p = [], q = [], r = [], u = function (v) {
                        if (0 <= v.indexOf('.')) {
                            var x = v.split('.'), y = x[0], C = x[1];
                            x = M(x[0]);
                        } else
                            x = this, y = x.getWorksheetName(), C = v;
                        if (x.formula[C] && !r[v]) {
                            var G = !1;
                            r[v] = !0;
                            for (v = 0; v < x.formula[C].length; v++) {
                                var D = x.formula[C][v];
                                -1 == D.indexOf('.') && (D = y + '.' + D);
                                if (!q[D]) {
                                    var K = x.getValue(D);
                                    if (ea(K))
                                        p.push([
                                            D,
                                            K,
                                            b.getTokens.call(x, K, y)
                                        ]);
                                    else
                                        G = !0, x.formula[C][v] = null;
                                    u.call(x, D);
                                    q[D] = !0;
                                }
                            }
                            1 == G && (x.formula[C] = x.formula[C].filter(function (L) {
                                return null != L;
                            }));
                        }
                    }, l = Object.keys(m);
                for (m = 0; m < l.length; m++)
                    u.call(this, l[m]);
                l = 0;
                for (m = p.length - 1; 0 <= m; m--) {
                    for (var w = 0; w < m; w++)
                        if (0 <= p[w][2].indexOf(p[m][0])) {
                            k.call(p, m, w);
                            m = p.length;
                            break;
                        }
                    l++;
                    if (1000000 < l) {
                        console.error('Something went wrong');
                        break;
                    }
                }
                q = [];
                for (m = 0; m < p.length; m++)
                    q[p[m][0]] = p[m][1];
                return q;
            };
            var n = function (m, p) {
                for (var q = Object.keys(this.formula), r, u, l, w = [], v = [], x = 0; x < q.length; x++)
                    if (u = q[x], l = this.formula[u], p && p[u])
                        for (var y = 0; y < l.length; y++)
                            m[l[y]] && (l[y] = m[l[y]]), v[l[y]] = !0;
                    else {
                        r = [];
                        for (y = 0; y < l.length; y++)
                            p && p[l[y]] || (m[l[y]] && (l[y] = m[l[y]]), v[l[y]] = !0, r.push(l[y]));
                        r.length && (m[u] && (u = m[u]), w[u] = r);
                    }
                this.formula = w;
                r = this.getWorksheetName();
                for (var C = 0; C < t.spreadsheet.length; C++)
                    for (var G = t.spreadsheet[C].worksheets, D = 0; D < G.length; D++)
                        if (G[D].getWorksheetName() !== r)
                            for (q = Object.keys(G[D].formula), x = 0; x < q.length; x++) {
                                w = [];
                                l = G[D].formula[q[x]];
                                for (y = 0; y < l.length; y++)
                                    if (u = l[y].split('.'), u[0] == r && u[1])
                                        p && p[u[1]] || (m[u[1]] && (u[1] = m[u[1]]), w.push(u[0] + '.' + u[1]));
                                    else
                                        w.push(l[y]);
                                G[D].formula[q[x]] = w;
                            }
                return v;
            };
            b.updateAll = function (m, p) {
                var q;
                Ea.updateAll.call(this, m, p);
                for (var r = n.call(this, m, p), u = [], l = Object.keys(r), w = 0; w < l.length; w++) {
                    if (0 <= l[w].indexOf('.')) {
                        var v = l[w].split('.');
                        var x = M(v[0]);
                        var y = v[1];
                        var C = this.getWorksheetName();
                        v = v[0];
                    } else
                        x = this, y = l[w], C = null, v = this.getWorksheetName();
                    (q = x.getValue(y)) && ea(q) && (x = b.update.call(x, q, m, p, C), x != q && (r[l[w]] = x, y = z.getCoordsFromColumnName(y), u[v] || (u[v] = []), u[v].push({
                        x: y[0],
                        y: y[1],
                        value: x,
                        force: !0
                    })));
                }
                l = Object.keys(u);
                for (m = 0; m < l.length; m++)
                    x = M(l[m]), u[l[m]] = aa.applyValues.call(x, u[l[m]]), aa.setValueChained.call(x, u[l[m]]), F.call(x, 'setFormula', { data: u[l[m]] });
            };
            b.updateWorksheetName = function (m, p, q) {
                for (var r = c(m), u = 0; u < r.length; u++)
                    m = r[u].split('!'), m[1] && (m[0] = m[0].replace(new RegExp('\'', 'g'), ''), m[0].toUpperCase() == p.toUpperCase() && (m[0] = q, 0 <= m[0].indexOf(' ') && (m[0] = '\'' + m[0] + '\''), r[u] = m.join('!')));
                return r.join('');
            };
            b.updateWorksheetNames = function (m, p) {
                for (var q, r, u = 0; u < t.spreadsheet.length; u++)
                    for (var l = [], w = t.spreadsheet[u].worksheets, v = 0; v < w.length; v++) {
                        for (var x = 0; x < w[v].options.data.length; x++)
                            for (var y = 0; y < w[v].options.data[x].length; y++)
                                if ((q = w[v].options.data[x][y]) && ea(q) && (r = b.updateWorksheetName(q, m, p), r != q))
                                    l.push({
                                        x: y,
                                        y: x,
                                        value: r,
                                        force: !0
                                    });
                        l = aa.applyValues.call(w[v], l);
                        F.call(w[v], 'setFormula', { data: l });
                    }
            };
            b.shiftFormula = function (m, p, q) {
                var r = c(m, !0);
                m = function (v) {
                    if (-1 == v.indexOf('!')) {
                        v = z.getCoordsFromColumnName(v);
                        var x = '';
                    } else
                        x = r[u].split('!'), v = z.getCoordsFromColumnName(x[1]), x = x[0] + '!';
                    var y = v[0] + p;
                    v = v[1] + q;
                    return v = 0 > y || 0 > v ? '#REF!' : x + z.getColumnNameFromCoords(y, v);
                };
                for (var u = 0; u < r.length; u++)
                    if (h.test(r[u]) && -1 == r[u].indexOf('$')) {
                        var l = -1 == r[u].indexOf('!') ? [
                            '',
                            r[u]
                        ] : r[u].split('!');
                        if (-1 == l[1].indexOf(':'))
                            l[1] = m(l[1]);
                        else {
                            var w = l[1].split(':');
                            l[1] = m(w[0]) + ':' + m(w[1]);
                        }
                        r[u] = l[0] ? l.join('!') : l[1];
                    }
                return r.join('');
            };
            b.getTokensFromRange = function (m) {
                var p = this, q = '', r = '';
                0 <= m.indexOf('.') ? r = '.' : 0 <= m.indexOf('!') && (r = '!');
                m = m.replace(/\$/g, '');
                r && (q = m.split(r), p = M(q[0]), m = q[1], q = q[0] + r);
                r = [];
                m = m.split(':');
                var u = z.getCoordsFromColumnName(m[0]), l = z.getCoordsFromColumnName(m[1]);
                if (u[0] <= l[0]) {
                    m = u[0];
                    var w = l[0];
                } else
                    m = l[0], w = u[0];
                if (null === u[1] && null == l[1]) {
                    var v = 0;
                    u = 0;
                    p.options && p.options.data && (u = p.options.data.length - 1);
                } else
                    u[1] <= l[1] ? (v = u[1], u = l[1]) : (v = l[1], u = u[1]);
                for (p = v; p <= u; p++)
                    for (v = m; v <= w; v++)
                        r.push(q + z.getColumnNameFromCoords(v, p));
                return r;
            };
            b.getRangeFromTokens = function (m) {
                m = m.filter(function (r) {
                    return r != '#REF!';
                });
                for (var p = '', q = 0; q < m.length; q++)
                    0 <= m[q].indexOf('.') && (p = m[q].split('.'), m[q] = p[1], p = p[0]);
                p && (p += '.');
                m.sort(function (r, u) {
                    r = z.getCoordsFromColumnName(r);
                    u = z.getCoordsFromColumnName(u);
                    return r[1] > u[1] ? 1 : r[1] < u[1] ? -1 : r[0] > u[0] ? 1 : r[0] < u[0] ? -1 : 0;
                });
                return m.length ? p + (m[0] + ':' + m[m.length - 1]) : '#REF!';
            };
            b.getTokens = function (m, p) {
                var q = d(m);
                m.replace(/!/g, '.');
                (m = q.match(/[A-Z_]+[A-Z0-9_\.]*/g)) && m.length && (q = f.call(this.parent, m, q));
                (m = q.match(/('.*?'?|\w*\.)?(\$?[A-Z]+\$?[0-9]*):(\$?[A-Z]+\$?[0-9]*)?/g)) && m.length && (q = e.call(this, m, q));
                m = q.match(/('.*?'?|\w*\.)?(\$?[A-Z]+\$?[0-9]+)(:\$?[A-Z]+\$?[0-9]+)?/g);
                for (q = 0; q < m.length; q++)
                    -1 == m[q].indexOf('.') && p && (m[q] = p + '.' + m[q]);
                return m;
            };
            b.tokenIdentifier = h;
            b.tokenize = c;
            return b;
        }(), aa = function () {
            var h = function (c) {
                c.name = qa;
                c.value = I;
                c.getValue = h.get;
                c.getValueFromCoords = h.getFromCoords;
                c.setValue = h.set;
                c.setValueFromCoords = h.setFromCoords;
                c.setCheckRadioValue = h.setCheckRadio;
                c.getProcessed = h.processed;
            };
            h.get = function (c, a) {
                var b = this;
                if (typeof c == 'object') {
                    var d = c.x;
                    c = c.y;
                } else
                    0 <= c.indexOf('.') && (b = c.split('.'), c = b[1], b = M(b[0])), c = z.getCoordsFromColumnName(c), d = c[0], c = c[1];
                return h.getFromCoords.call(b, d, c, a);
            };
            h.getFromCoords = function (c, a, b) {
                var d = null;
                null != c && null != a && (d = b ? h.processed.call(this, c, a) : I.call(this, c, a));
                return d;
            };
            h.set = function (c, a, b) {
                if (!J.call(this.parent, this))
                    return !1;
                var d, e, f = null, g = [];
                b = b ? !0 : !1;
                var k = function (p, q) {
                    var r = null;
                    typeof p == 'string' ? (f = z.getCoordsFromColumnName(p), d = f[0], e = f[1]) : p.tagName ? (d = p.getAttribute('data-x'), e = p.getAttribute('data-y')) : p.element && p.element.tagName ? (d = p.element.getAttribute('data-x'), e = p.element.getAttribute('data-y')) : (d = p.x, e = p.y, void 0 !== p.value && (q = p.value), void 0 !== p.style && (r = p.style));
                    p = {
                        x: d,
                        y: e,
                        value: q,
                        force: b
                    };
                    null !== r && (p.style = r);
                    g.push(p);
                };
                if (c && Array.isArray(c))
                    for (var n = 0; n < c.length; n++)
                        k(c[n], a);
                else if (typeof c == 'object' && void 0 == c.x && void 0 == c.tagName)
                    for (a = Object.keys(c), n = 0; n < a.length; n++)
                        k(a[n], c[a[n]]);
                else
                    k(c, a);
                if (g.length) {
                    g = h.applyValues.call(this, g);
                    if (this.parent.config.parseFormulas)
                        h.setValueChained.call(this, g);
                    T.update.call(this, !0);
                    this.refreshBorders();
                    var m = this;
                    setTimeout(function () {
                        ca.refresh.call(m);
                    }, 250);
                    if (g.length) {
                        O.call(this.parent, {
                            worksheet: m,
                            action: 'setValue',
                            records: g,
                            selection: this.selectedCell
                        });
                        c = this.getPrimaryKey();
                        if (!1 !== c)
                            for (n = 0; n < g.length; n++)
                                if (g[n].x === c && g[n].value)
                                    ta.call(this, g[n]);
                        F.call(this, 'setValue', { data: g });
                        A.call(this.parent, 'onafterchanges', this, g);
                    }
                }
            };
            h.setFromCoords = function (c, a, b, d) {
                var e = [];
                e.push({
                    x: c,
                    y: a,
                    value: b
                });
                h.set.call(this, e, null, d);
            };
            h.setCheckRadio = function () {
                for (var c = [], a = this.getSelected(), b = 0; b < a.length; b++) {
                    var d = a[b].x, e = a[b].y;
                    if (!this.options.columns[d].readOnly && this.options.columns[d].type == 'checkbox') {
                        var f = I.call(this, d, e) ? !1 : !0;
                        c.push({
                            x: d,
                            y: e,
                            value: f
                        });
                    }
                }
                if (c.length)
                    h.set.call(this, c);
            };
            h.applyValues = function (c) {
                for (var a, b, d = this.options.style || {}, e = [], f = {}, g = 0; g < c.length; g++)
                    if (a = c[g], b = this.updateCell(a.x, a.y, a.value, a.force), void 0 !== b.value) {
                        if (void 0 !== a.style) {
                            var k = z.getColumnNameFromCoords(a.x, a.y);
                            b.style = f[k] = a.style;
                            b.oldStyle = d && d[k] ? d[k] : 'color: initial';
                        }
                        e.push(b);
                    }
                if (0 < Object.keys(f).length)
                    Na.update.call(this, f);
                return e;
            };
            h.processed = function (c, a, b) {
                var d = I.call(this, c, a);
                if (null === d)
                    return null;
                var e = Z.get.call(this, c, a), f = e[1];
                f.type != 'hidden' && f.type != 'autonumber' && f.type != 'radio' && f.type != 'email' && f.type != 'url' && 0 != f.process && (!0 === b || f.type != 'color' && f.type != 'progressbar' && f.type != 'rating') && (f.type == 'checkbox' ? d = e[0].get(f, d, b) : this.records[a][c].element ? d = 1 == this.parent.config.stripHTML ? this.records[a][c].element.innerText : this.records[a][c].element.innerHTML : (('' + d).substr(0, 1) == '=' && (d = this.executeFormula(d, c, a, !1)), e[0] && typeof e[0].get == 'function' && (d = e[0].get(f, d, b))));
                return d;
            };
            h.setValueChained = function (c) {
                for (var a, b = [], d, e = 0; e < c.length; e++)
                    a = c[e], d = z.getColumnNameFromCoords(a.x, a.y), b[d] = a.value;
                b = R.getChain.call(this, b);
                c = Object.keys(b);
                for (e = 0; e < c.length; e++)
                    0 <= c[e].indexOf('.') ? (a = c[e].split('.'), d = a[1], a = M(a[0])) : (d = c[e], a = this), d = z.getCoordsFromColumnName(d), H.update.call(a, d[0], d[1], b[c[e]], !0);
            };
            return h;
        }(), H = function () {
            var h = function (c) {
                c.getCell = h.get;
                c.getCellFromCoords = h.get;
                c.updateCell = h.update;
                c.updateCells = h.updateAll;
                c.getSelected = h.selected;
                c.getCells = h.getCells;
                c.setCells = h.setCells;
                c.isAttached = h.attached;
            };
            h.attached = function (c, a) {
                return this.records[a] && this.records[a][c] && this.records[a][c].element && this.records[a][c].element.parentNode && this.records[a][c].element.parentNode.parentNode ? !0 : !1;
            };
            h.get = function (c, a, b) {
                typeof c == 'string' && (a = z.getCoordsFromColumnName(c), c = a[0], a = a[1]);
                c = parseInt(c);
                a = parseInt(a);
                if (this.records[a] && this.records[a][c] && this.records[a][c].element)
                    return this.records[a][c].element;
                var d = I.call(this, c, a);
                null === d && (d = '');
                return H.create.call(this, c, a, d, b);
            };
            h.getFromCoords = function (c, a, b) {
                if (!c)
                    return null;
                var d = [], e = c[0], f = c[1], g = c[2];
                c = c[3];
                for (b &&= this.results ? z.invert(this.results) : null; f <= c; f++)
                    for (var k = e; k <= g; k++)
                        if (!b || b[f])
                            if (a)
                                d.push(z.getColumnNameFromCoords(k, f));
                            else
                                d.push(this.records[f][k]);
                return d;
            };
            h.selected = function (c, a) {
                return h.getFromCoords.call(this, this.getHighlighted(), c, a);
            };
            h.getSelectedColumns = function () {
                var c = [], a = this.getHighlighted();
                if (a)
                    for (var b = a[0]; b <= a[2]; b++)
                        c.push(b);
                return c;
            };
            h.updateAll = function (c) {
                for (var a = this.getPrimaryKey(), b = [], d = 0; d < c.length; d++)
                    if (void 0 !== c[d].id) {
                        if (ta.call(this, c[d]), b.push({
                                id: c[d].id,
                                y: c[d].y
                            }), !1 !== a)
                            h.update.call(this, a, c[d].y, c[d].id, !0);
                    } else
                        b.push(h.update.call(this, c[d].x, c[d].y, c[d].value, c[d].force));
                F.call(this, 'updateCells', [b]);
            };
            h.update = function (c, a, b, d) {
                var e = this.records[a];
                if (e = e && e[c] ? e[c] : null)
                    if (e = e.element, !d && e && 1 == e.classList.contains('readonly'))
                        d = {
                            x: c,
                            y: a
                        };
                    else {
                        d = A.call(this.parent, 'onbeforechange', this, e, c, a, b);
                        void 0 !== d && (b = d);
                        d = Z.get.call(this, c, a);
                        typeof d[0].updateCell == 'function' && (d = d[0].updateCell(e, b, c, a, this, d[1]), void 0 !== d && (b = d));
                        d = {
                            x: c,
                            y: a
                        };
                        var f = I.call(this, c, a);
                        if (f !== b) {
                            b = I.call(this, c, a, b);
                            d.oldValue = f;
                            d.value = b;
                            if (e)
                                h.applyOverflow.call(this, e, c, a);
                            A.call(this.parent, 'onchange', this, e, c, a, d.value, d.oldValue);
                        }
                    }
                else
                    return !1;
                return d;
            };
            h.create = function (c, a, b, d) {
                var e = document.createElement('td');
                e.setAttribute('data-x', c);
                e.setAttribute('data-y', a);
                var f = Z.get.call(this, c, a);
                f[0] && typeof f[0].createCell == 'function' && (f = f[0].createCell(e, b, c, a, this, f[1]), void 0 !== f && (b = f));
                I.call(this, c, a, b);
                if (!this.records[a][c])
                    ia.cell.call(this, c, a, b);
                this.records[a][c].element = e;
                !b && this.records[a][c].v && (e.innerText = this.records[a][c].v);
                h.applyProperties.call(this, e, c, a, d);
                h.applyOverflow.call(this, e, c, a);
                A.call(this.parent, 'oncreatecell', this, e, c, a, b);
                return e;
            };
            h.getAttributes = function (c, a, b) {
                b[c] || (b[c] = {});
                c == 'values' ? b[c][a] = this.getValue(a) : c == 'mergeCells' ? this.merged.cells && (a = this.merged.cells[a]) && (b[c][a] = this.options.mergeCells[a]) : this.options[c] && this.options[c][a] && (b[c][a] = this.options[c][a]);
            };
            h.setAttributes = function (c) {
                if (c && c.style)
                    this.setStyle(c.style);
                if (c && c.comments)
                    this.setComments(c.comments);
                if (c && c.meta)
                    this.setMeta(c.meta);
                if (c && c.cells)
                    this.setCells(c.cells);
                if (c && c.mergeCells)
                    this.setMerge(c.mergeCells);
                if (c && c.values)
                    h.batch.call(this, c.values);
                if (c && c.formulas)
                    h.batch.call(this, c.formulas, !0);
            };
            h.applyProperties = function (c, a, b, d) {
                if (!d) {
                    d = z.getColumnNameFromCoords(a, b);
                    var e = this.options.style, f = this.options.comments, g = this.options.cells, k = this.options.rows;
                    if (e && e[d]) {
                        var n = (n = c.getAttribute('style')) ? n + (';' + e[d]) : e[d];
                        c.setAttribute('style', n);
                    }
                    if (f && f[d])
                        c.setAttribute('title', f[d]);
                    if (g && g[d]) {
                        if (1 == g[d].readOnly)
                            c.classList.add('readonly');
                        if (!1 === g[d].locked && !0 === this.options.selectUnLockedCells)
                            c.classList.add('jss_unlocked');
                    }
                    if (k && k[b] && 1 == k[b].readOnly)
                        c.classList.add('readonly');
                }
                f = this.options.columns[a];
                c.style.textAlign || (c.style.textAlign = f.align ? f.align : this.options.defaultColAlign);
                if (!1 !== this.records[b][a].readonly && (1 == this.records[b][a].readonly || 1 == f.readOnly || 1 == f.readonly))
                    c.classList.add('readonly');
            };
            h.applyOverflow = function (c, a, b) {
                1 == this.options.textOverflow && 0 < a && (a == this.options.columns.length - 1 && (c.style.overflow = 'hidden'), this.records[b][a - 1] && this.records[b][a - 1].element && (this.records[b][a - 1].element.style.overflow = !c.innerText && this.headers[a - 1] && this.headers[a - 1].offsetWidth ? '' : 'hidden'));
            };
            h.batch = function (c, a) {
                var b = [], d = Object.keys(c);
                if (d.length)
                    for (var e = 0; e < d.length; e++) {
                        if (0 <= d[e].indexOf('.')) {
                            var f = d[e].split('.');
                            var g = M(f[0]);
                            var k = f[1];
                            f = f[0];
                        } else
                            g = this, k = d[e], f = this.getWorksheetName();
                        k = z.getCoordsFromColumnName(k);
                        k = g.updateCell(k[0], k[1], c[d[e]], !0);
                        b[f] || (b[f] = []);
                        b[f].push(k);
                    }
                if (1 == a && (d = Object.keys(b), d.length))
                    for (e = 0; e < d.length; e++)
                        g = M(d[i]), F.call(g, 'setFormula', b[d[e]]);
            };
            h.getCells = function (c) {
                return c ? this.options.cells[c] : this.options.cells;
            };
            h.setCells = function (c, a) {
                if (!J.call(this.parent, this))
                    return !1;
                if (typeof c == 'string')
                    this.options.cells[c] = a;
                else {
                    a = Object.keys(c);
                    for (var b = 0; b < a.length; b++)
                        this.options.cells[a[b]] = c[a[b]];
                }
            };
            return h;
        }(), va = function () {
            var h = function (a, b) {
                    Array.isArray(b) || (b = [b]);
                    for (var d, e = a ? '' : 'none', f = Object.keys(b), g = 0; g < f.length; g++)
                        if (d = this.rows[b[f[g]]])
                            d.element && (d.element.style.display = e), d.visible = a;
                    this.resetBorders();
                    B.refresh.call(this);
                }, c = function (a) {
                    a.getRow = c.get;
                    a.moveRow = c.move;
                    a.insertRow = c.add;
                    a.deleteRow = c.del;
                    a.getSelectedRows = c.selected;
                    a.showRow = h.bind(a, !0);
                    a.hideRow = h.bind(a, !1);
                };
            c.get = function (a) {
                return this.rows[a];
            };
            c.attached = function (a) {
                return this.rows[a] && this.rows[a].element && this.rows[a].element.parentNode ? !0 : !1;
            };
            c.selected = function (a) {
                var b = [], d = this.getHighlighted();
                if (d)
                    for (var e = d[1]; e <= d[3]; e++)
                        if (a)
                            b.push(e);
                        else
                            b.push(this.rows[e].element);
                return b;
            };
            c.create = function (a, b) {
                if (this.rows[a] && this.rows[a].element)
                    return this.rows[a].element;
                if (!this.rows[a])
                    ia.row.call(this, a);
                var d = document.createElement('tr');
                d.setAttribute('data-y', a);
                this.rows[a].element = d;
                var e = null;
                if (this.options.rows[a] && !b) {
                    if (this.options.rows[a].style)
                        d.setAttribute('style', this.options.rows[a].style);
                    this.options.rows[a].height && (d.style.height = parseInt(this.options.rows[a].height) + 'px');
                    this.options.rows[a].title && (e = this.options.rows[a].title);
                    0 == this.options.rows[a].visible && (this.rows[a].visible = !1);
                    this.options.rows[a].id && (this.rows[a].id = this.options.rows[a].id);
                }
                A.call(this.parent, 'oncreaterow', this, a, d);
                0 == this.rows[a].visible && (d.style.display = 'none');
                e ||= parseInt(a + 1);
                b = document.createElement('td');
                b.innerHTML = e;
                b.setAttribute('data-y', a);
                b.className = 'jss_row';
                d.appendChild(b);
                return d;
            };
            c.move = function (a, b) {
                if (!J.call(this.parent, this))
                    return !1;
                a = parseInt(a);
                b = parseInt(b);
                if (!this.rows[b] || !this.rows[a])
                    return console.error('Jspreadsheet: Invalid origin or destination'), !1;
                if (0 < Object.keys(this.getMerge()).length) {
                    var d = null;
                    this.merged.rows[a] ? d = !0 : this.merged.rows[b] && (a > b ? this.merged.rows[b - 1] && (d = !0) : this.merged.rows[b + 1] && (d = !0));
                    if (d)
                        this.destroyMerged();
                }
                this.resetBorders();
                if (0 <= Array.prototype.indexOf.call(this.tbody.children, this.rows[b].element))
                    if (d = B.renderRow.call(this, a), a > b)
                        this.tbody.insertBefore(d, this.rows[b].element);
                    else
                        this.tbody.insertBefore(d, this.rows[b].element.nextSibling);
                else
                    this.rows[a].element && (this.tbody.removeChild(this.rows[a].element), B.refresh.call(this));
                this.rows.splice(b, 0, this.rows.splice(a, 1)[0]);
                this.records.splice(b, 0, this.records.splice(a, 1)[0]);
                this.options.data.splice(b, 0, this.options.data.splice(a, 1)[0]);
                if (0 < this.options.pagination && this.tbody.children.length != this.options.pagination)
                    this.page(this.pageNumber);
                F.call(this, 'moveRow', {
                    f: a,
                    t: b
                });
                T.references.call(this);
                T.update.call(this);
                O.call(this.parent, {
                    worksheet: this,
                    action: 'moveRow',
                    oldValue: a,
                    newValue: b
                });
                A.call(this.parent, 'onmoverow', this, a, b);
            };
            c.add = function (a, b, d, e) {
                if (!J.call(this.parent, this))
                    return !1;
                if (!this.options.allowInsertRow)
                    return console.error('Jspreadsheet: Insert row is not enabled in the table configuration'), !1;
                var f = [];
                if (0 < a)
                    var g = parseInt(a);
                else
                    g = 1, Array.isArray(a) && !e && (Array.isArray(a[0]) ? e = a : (e = [], e.push(a)));
                e = Ba.standardize(e);
                d = d ? !0 : !1;
                var k = this.options.data ? this.options.data.length - 1 : 0;
                if (void 0 == b || b > k || 0 > b)
                    b = k, d = !1;
                g ||= 1;
                if (!1 === A.call(this.parent, 'onbeforeinsertrow', this, b, g, d))
                    return console.log('onbeforeinsertrow returned false'), !1;
                this.resetBorders();
                a = d ? b : b + 1;
                for (var n = null, m = [], p = 0, q = [], r = [], u = this.rows.splice(a), l = this.options.data ? this.options.data.splice(a) : [], w = this.records.splice(a), v = a; v < g + a; v++) {
                    var x = e[p] && e[p].id ? e[p].id : pa.next.call(this);
                    ia.row.call(this, v, x);
                    m = this.dataType ? {} : [];
                    for (var y = 0; y < this.options.columns.length; y++)
                        n = qa.call(this, y), m[n] = '', e && e[p] && e[p].data && (typeof e[p].data[n] !== 'undefined' ? m[n] = e[p].data[n] : typeof e[p].data[y] !== 'undefined' && (m[n] = e[p].data[y])), f.push({
                            x: y,
                            y: v,
                            value: m[n],
                            force: !0
                        });
                    r.push({
                        id: x,
                        data: m
                    });
                    p++;
                }
                this.rows = this.rows.concat(u);
                this.records = this.records.concat(w);
                this.options.data = this.options.data.concat(l);
                this.results && 0 < this.results.length && (k = this.results[this.results.length - 1]);
                var C = !1;
                e = function (G, D) {
                    G = B.renderRow.call(this, G, null, null, !0);
                    if (D)
                        this.tbody.insertBefore(G, D);
                    else
                        this.tbody.appendChild(G);
                    0 < this.options.pagination ? Array.prototype.indexOf.call(this.tbody.children, G) >= this.options.pagination && (C = !1) : B.limited.call(this) && (B.isVisible.call(this, G.children[1]) || (C = !1));
                };
                u[0] ? 0 <= Array.prototype.indexOf.call(this.tbody.children, u[0].element) && (C = !0) : this.rows[k] ? this.rows[k].element && 0 <= Array.prototype.indexOf.call(this.tbody.children, this.rows[k].element) && (C = !0) : C = !0;
                for (v = a; v < g + a; v++) {
                    if (this.results)
                        this.results.push(v);
                    if (1 == C)
                        e.call(this, v, u[0] ? u[0].element : null);
                    q.push(this.records[v]);
                }
                if (0 < this.options.pagination)
                    ra.set.call(this, this.pageNumber);
                else
                    B.limited.call(this) && (e = this.tbody.firstChild.getAttribute('data-y'), this.tbody.innerText = '', B.goto.call(this, e));
                if (this.merged.rows[a])
                    X.updateConfig.call(this, 1, 1, a - 1, g);
                F.call(this, 'insertRow', {
                    numOfRows: g,
                    rowNumber: b,
                    insertBefore: d ? 1 : 0,
                    data: r
                });
                T.references.call(this);
                if (f.length)
                    aa.applyValues.call(this, f);
                T.update.call(this);
                N.call(this);
                ca.refresh.call(this);
                O.call(this.parent, {
                    worksheet: this,
                    action: 'insertRow',
                    rowNumber: b,
                    numOfRows: g,
                    insertBefore: d,
                    data: r
                });
                A.call(this.parent, 'oninsertrow', this, b, g, q, d);
            };
            c.del = function (a, b) {
                if (!J.call(this.parent, this))
                    return !1;
                if (!this.options.allowDeleteRow)
                    return console.error('Jspreadsheet: Delete row is not enabled in the table configuration'), !1;
                var d = null, e = {}, f = [], g = 0;
                void 0 == a && (b = this.getSelectedRows(), b[0] ? (a = parseInt(b[0].getAttribute('data-y')), b = b.length) : (a = this.options.data.length - 1, b = 1));
                d = this.options.data.length - 1;
                if (void 0 == a || a > d || 0 > a)
                    a = d;
                b ||= 1;
                a + b >= this.options.data.length && (b = this.options.data.length - a, b >= this.options.data.length && (b = this.options.data.length, this.resetSelection()));
                if (!1 === A.call(this.parent, 'onbeforedeleterow', this, a, b))
                    return console.log('onbeforedeleterow returned false'), !1;
                if (-1 < parseInt(a) && 0 < parseInt(b)) {
                    this.resetBorders();
                    for (var k = a; k < a + b; k++)
                        for (var n = 0; n < this.options.columns.length; n++)
                            d = z.getColumnNameFromCoords(n, k), H.getAttributes.call(this, 'meta', d, e), H.getAttributes.call(this, 'style', d, e), H.getAttributes.call(this, 'cells', d, e), H.getAttributes.call(this, 'comments', d, e), H.getAttributes.call(this, 'mergeCells', d, e), H.getAttributes.call(this, 'values', d, e), f[d] = !0;
                    (d = R.getChain.call(this, e.values)) && (e.formulas = d);
                    for (k = a; k < a + b; k++)
                        0 <= Array.prototype.indexOf.call(this.tbody.children, this.rows[k].element) && (this.rows[k].element.parentNode.removeChild(this.rows[k].element), g++);
                    d = [];
                    for (k = a; k < a + b; k++)
                        d.push({
                            id: this.getRowId(k),
                            row: k,
                            data: this.getRowData(k)
                        });
                    this.rows.splice(a, b);
                    k = this.records.splice(a, b);
                    this.options.data.splice(a, b);
                    X.updateConfig.call(this, 1, 0, a, b);
                    F.call(this, 'deleteRow', {
                        rowNumber: a,
                        numOfRows: b,
                        data: d
                    });
                    T.references.call(this, f);
                    if (0 < this.options.pagination)
                        this.page(this.pageNumber, function () {
                            if (0 == this.tbody.children.length) {
                                var m = this.whichPage(this.options.data.length - 1);
                                this.page(m);
                            }
                        });
                    else if (B.limited.call(this) && 0 < g)
                        if (0 == this.tbody.children.length)
                            this.goto(a);
                        else
                            B.refresh.call(this);
                    T.update.call(this, !0);
                    this.refreshBorders();
                    O.call(this.parent, {
                        worksheet: this,
                        action: 'deleteRow',
                        rowNumber: a,
                        numOfRows: b,
                        insertBefore: 1,
                        data: d,
                        attributes: e
                    });
                    A.call(this.parent, 'ondeleterow', this, a, b, k, d, e);
                }
            };
            return c;
        }(), Da = function () {
            var h = function (a, b) {
                    Array.isArray(b) || (b = [b]);
                    for (var d, e, f = Object.keys(b), g = 0; g < f.length; g++)
                        if (d = b[f[g]], e = this.options.columns[d])
                            this.colgroup[d] && (this.colgroup[d].style.width = a ? parseInt(e.width || this.options.defaultColWidth) + 'px' : '0px'), e.visible = a;
                    this.resetBorders();
                    B.refresh.call(this);
                }, c = function (a) {
                    a.getColumn = c.get;
                    a.getColumnIdByName = c.getByName;
                    a.getPrimaryKey = c.getPrimaryKey;
                    a.getSelectedColumns = c.selected;
                    a.getOptions = c.getOptions;
                    a.getColumnOptions = c.getOptions;
                    a.moveColumn = c.move;
                    a.insertColumn = c.add;
                    a.deleteColumn = c.del;
                    a.getProperties = c.properties;
                    a.setProperties = c.properties;
                    a.getProperty = c.properties;
                    a.setProperty = c.properties;
                    a.showColumn = h.bind(a, !0);
                    a.hideColumn = h.bind(a, !1);
                };
            c.get = function (a) {
                return this.options.columns[a] || !1;
            };
            c.getByName = function (a) {
                for (var b = this.options.columns, d = 0; d < b.length; d++)
                    if (b[d].name == a)
                        return d;
                return !1;
            };
            c.getPrimaryKey = function () {
                for (var a = 0; a < this.options.columns.length; a++)
                    if (1 == this.options.columns[a].primaryKey)
                        return a;
                return !1;
            };
            c.getOptions = function (a, b) {
                var d = this.options.columns[a];
                Object.keys(this.options.cells).length && void 0 !== b && (a = z.getColumnNameFromCoords(a, b), this.options.cells[a] && (d = this.options.cells[a]));
                if (!d)
                    d = { type: 'text' };
                else if (!d.type || typeof d.type == 'string' && !t.editors[d.type])
                    d.type = 'text';
                return d;
            };
            c.selected = function (a) {
                a = [];
                var b = this.getHighlighted();
                if (b)
                    for (var d = b[0]; d <= b[2]; d++)
                        a.push(d);
                return a;
            };
            c.move = function (a, b) {
                if (!J.call(this.parent, this))
                    return !1;
                a = parseInt(a);
                b = parseInt(b);
                if (!this.options.columns[a])
                    return console.error('Jspreadsheet: Invalid origin'), !1;
                if (!this.options.columns[b])
                    return console.error('Jspreadsheet: Invalid destination'), !1;
                if (0 < Object.keys(this.getMerge()).length) {
                    var d = null;
                    this.merged.cols[a] ? d = !0 : this.merged.cols[b] && (a > b ? this.merged.cols[b - 1] && (d = !0) : this.merged.cols[b + 1] && (d = !0));
                    if (d)
                        this.destroyMerged();
                }
                this.resetBorders();
                d = this.options.freezeColumns;
                if (0 < d && (a < d || b < d))
                    ja.reset.call(this);
                else
                    d = null;
                if (this.headers[b] && this.headers[b].parentNode) {
                    if (!this.headers[a])
                        ya.create.call(this, a);
                    var e = (a > b ? this.headers[b] : this.headers[b].nextSibling) || null;
                    this.headerContainer.insertBefore(this.headers[a], e);
                    e = (a > b ? this.colgroup[b] : this.colgroup[b].nextSibling) || null;
                    this.colgroupContainer.insertBefore(this.colgroup[a], e);
                    for (var f = 0; f < this.tbody.children.length; f++) {
                        var g = this.tbody.children[f].getAttribute('data-y');
                        e = (a > b ? this.records[g][b].element : this.records[g][b].element.nextSibling) || null;
                        this.tbody.children[f].insertBefore(H.get.call(this, a, g), e);
                    }
                    if (this.options.footers)
                        for (f = 0; f < this.tfoot.children.length; f++)
                            e = (a > b ? this.footers.content[f][b].element : this.footers.content[f][b].element.nextSibling) || null, this.tfoot.children[f].insertBefore(W.create.call(this, a, f), e);
                } else if (this.headers[a] && this.headers[a].parentNode) {
                    this.headerContainer.removeChild(this.headers[a]);
                    this.colgroupContainer.removeChild(this.colgroup[a]);
                    for (f = 0; f < this.tbody.children.length; f++)
                        g = parseInt(this.tbody.children[f].getAttribute('data-y')), this.tbody.children[f].removeChild(this.records[g][a].element);
                    if (this.options.footers)
                        for (f = 0; f < this.tfoot.children.length; f++)
                            this.tfoot.children[f].removeChild(this.footers.content[f][a].element);
                }
                this.options.columns.splice(b, 0, this.options.columns.splice(a, 1)[0]);
                this.headers.splice(b, 0, this.headers.splice(a, 1)[0]);
                this.colgroup.splice(b, 0, this.colgroup.splice(a, 1)[0]);
                for (f = 0; f < this.rows.length; f++) {
                    if (!this.dataType)
                        this.options.data[f].splice(b, 0, this.options.data[f].splice(a, 1)[0]);
                    this.records[f].splice(b, 0, this.records[f].splice(a, 1)[0]);
                }
                if (this.options.footers)
                    for (f = 0; f < this.options.footers.length; f++)
                        this.options.footers[f].splice(b, 0, this.options.footers[f].splice(a, 1)[0]), this.footers.content[f].splice(b, 0, this.footers.content[f].splice(a, 1)[0]);
                F.call(this, 'moveColumn', {
                    f: a,
                    t: b
                });
                T.references.call(this);
                T.update.call(this);
                if (0 < d && (a <= d || d <= d))
                    ja.set.call(this, d);
                O.call(this.parent, {
                    worksheet: this,
                    action: 'moveColumn',
                    oldValue: a,
                    newValue: b
                });
                A.call(this.parent, 'onmovecolumn', this, a, b);
            };
            c.add = function (a, b, d, e, f, g) {
                if (!J.call(this.parent, this))
                    return !1;
                if (!this.options.allowInsertColumn)
                    return console.error('Jspreadsheet: Insert column is not enabled in the table configuration'), !1;
                var k = [];
                if (0 < a)
                    var n = parseInt(a);
                else if (n = 1, Array.isArray(a) && !f)
                    if (Array.isArray(a[0]))
                        f = a;
                    else {
                        f = [];
                        for (var m = 0; m < a.length; m++)
                            f[m] = [a[m]];
                    }
                f ||= [];
                d = d ? !0 : !1;
                a = this.options.columns.length - 1;
                if (void 0 == b || b > a || 0 > b)
                    b = a, d = !1;
                n ||= 1;
                if (!1 === A.call(this.parent, 'onbeforeinsertcolumn', this, b, n, d))
                    return console.log('onbeforeinsertcolumn returned false'), !1;
                ca.reset.call(this);
                if (1 == this.dataType)
                    var p = parseInt(('' + Date.now()).substr(-8));
                e ||= [];
                for (m = 0; m < n; m++)
                    e[m] || (e[m] = {
                        type: 'text',
                        source: [],
                        options: [],
                        width: this.options.defaultColWidth,
                        align: this.options.defaultColAlign
                    }), 1 == this.dataType && typeof e[m].name == 'undefined' && (e[m].name = 'col_' + (p + m));
                var q = d ? b : b + 1;
                this.options.columns = z.injectArray(this.options.columns, q, e);
                p = function (v, x) {
                    for (var y = q; y < n + q; y++)
                        ya.create.call(this, y), v ? (this.headerContainer.insertBefore(this.headers[y], v), this.colgroupContainer.insertBefore(this.colgroup[y], x)) : (this.headerContainer.appendChild(this.headers[y]), this.colgroupContainer.appendChild(this.colgroup[y]));
                };
                m = function (v, x) {
                    if (x)
                        for (var y = q; y < n + q; y++)
                            this.rows[v].element.insertBefore(H.get.call(this, y, v), x);
                    else
                        for (y = q; y < n + q; y++)
                            this.rows[v].element.appendChild(H.get.call(this, y, v));
                };
                var r = this.headers.splice(q), u = this.colgroup.splice(q);
                if (!r[0]) {
                    if (this.headers[a] && 0 <= Array.prototype.indexOf.call(this.headerContainer.children, this.headers[a]))
                        p.call(this);
                } else if (0 <= Array.prototype.indexOf.call(this.headerContainer.children, r[0]))
                    p.call(this, r[0], u[0]);
                this.headers = this.headers.concat(r);
                this.colgroup = this.colgroup.concat(u);
                W.adjust.call(this, q, n, 1);
                ka.adjust.call(this, b, n, 1, g);
                g = 0;
                u = r = p = null;
                for (var l = 0; l < this.options.data.length; l++) {
                    this.dataType || (r = this.options.data[l].splice(q));
                    u = this.records[l].splice(q);
                    g = 0;
                    for (var w = q; w < n + q; w++)
                        p = f[l] && f[l][g] ? f[l][g] : '', I.call(this, w, l, p), k.push({
                            x: w,
                            y: l,
                            value: p
                        }), ia.cell.call(this, w, l), g++;
                    if (this.rows[l].element && this.rows[l].element.parentNode)
                        if (!u[0]) {
                            if (this.records[l][a].element && 0 <= Array.prototype.indexOf.call(this.rows[l].element.children, this.records[l][a].element))
                                m.call(this, l);
                        } else if (0 <= Array.prototype.indexOf.call(this.rows[l].element.children, u[0].element))
                            m.call(this, l, u[0].element);
                    this.dataType || (this.options.data[l] = this.options.data[l].concat(r));
                    this.records[l] = this.records[l].concat(u);
                }
                if (this.merged.cols[q])
                    X.updateConfig.call(this, 0, 1, q - 1, n);
                F.call(this, 'insertColumn', {
                    numOfColumns: n,
                    columnNumber: b,
                    insertBefore: d ? 1 : 0,
                    properties: e,
                    data: f
                });
                T.references.call(this);
                if (k.length)
                    aa.applyValues.call(this, k);
                T.update.call(this);
                this.refreshBorders();
                O.call(this.parent, {
                    worksheet: this,
                    action: 'insertColumn',
                    columnNumber: b,
                    numOfColumns: n,
                    insertBefore: d,
                    properties: e,
                    data: f
                });
                A.call(this.parent, 'oninsertcolumn', this, b, n, [], d);
            };
            c.del = function (a, b) {
                if (!J.call(this.parent, this))
                    return !1;
                if (!this.options.allowDeleteColumn)
                    return console.error('Jspreadsheet: Delete column is not enabled in the table configuration'), !1;
                var d = {}, e = [], f = 0;
                if (1 < this.options.columns.length) {
                    void 0 == a && (b = this.getSelectedColumns(!0), b.length ? (a = parseInt(b[0]), b = parseInt(b.length)) : (a = this.options.columns.length - 1, b = 1));
                    var g = this.options.columns.length - 1;
                    if (void 0 == a || a > g || 0 > a)
                        a = g;
                    b ||= 1;
                    a + b >= this.options.columns.length && (b = this.options.columns.length - a, b >= this.options.columns.length && (b--, console.error('Jspreadsheet: it is not possible to delete the last column')));
                    if (!1 === A.call(this.parent, 'onbeforedeletecolumn', this, a, b))
                        return console.log('onbeforedeletecolumn returned false'), !1;
                    if (-1 < parseInt(a) && 0 < parseInt(b)) {
                        this.resetBorders();
                        g = null;
                        var k = [], n = [], m = [];
                        var p = 0;
                        for (var q = a; q < a + b; q++)
                            0 <= Array.prototype.indexOf.call(this.headerContainer.children, this.headers[q]) && (this.colgroup[q].parentNode.removeChild(this.colgroup[q]), this.headers[q].parentNode.removeChild(this.headers[q]), f++), m[p] = this.options.columns[q], p++;
                        for (var r = 0; r < this.options.data.length; r++)
                            for (q = a; q < a + b; q++)
                                if (p = z.getColumnNameFromCoords(q, r), H.getAttributes.call(this, 'meta', p, d), H.getAttributes.call(this, 'style', p, d), H.getAttributes.call(this, 'cells', p, d), H.getAttributes.call(this, 'comments', p, d), H.getAttributes.call(this, 'mergeCells', p, d), H.getAttributes.call(this, 'values', p, d), e[p] = !0, this.records[r][q].element && 0 <= Array.prototype.indexOf.call(this.rows[r].element.children, this.records[r][q].element))
                                    this.records[r][q].element.parentNode.removeChild(this.records[r][q].element);
                        (q = R.getChain.call(this, d.values)) && (d.formulas = q);
                        this.options.columns.splice(a, b);
                        this.headers.splice(a, b);
                        this.colgroup.splice(a, b);
                        for (r = 0; r < this.options.data.length; r++)
                            this.dataType || (n[r] = this.options.data[r].splice(a, b)), k[r] = this.records[r].splice(a, b);
                        W.adjust.call(this, a, b, 0);
                        (q = ka.adjust.call(this, a, b, 0)) && (g = { nested: q });
                        X.updateConfig.call(this, 0, 0, a, b);
                        F.call(this, 'deleteColumn', {
                            columnNumber: a,
                            numOfColumns: b
                        });
                        T.references.call(this, e);
                        if (0 < f)
                            if (1 == this.thead.children.length)
                                B.goto.call(this, null, a);
                            else
                                B.refresh.call(this);
                        T.update.call(this, !0);
                        this.refreshBorders();
                        O.call(this.parent, {
                            worksheet: this,
                            action: 'deleteColumn',
                            columnNumber: a,
                            numOfColumns: b,
                            insertBefore: 1,
                            data: n,
                            properties: m,
                            attributes: d,
                            extra: g
                        });
                        A.call(this.parent, 'ondeletecolumn', this, a, b, k, m, d);
                    }
                }
            };
            c.properties = function (a, b) {
                if (this.options.columns[a]) {
                    if (b) {
                        if (!J.call(this.parent, this))
                            return !1;
                        b = typeof b == 'string' ? { type: b } : b;
                        b.type && t.editors[b.type] || (b.type = 'text');
                        parseInt(b.width) || (b.width = this.options.defaultColWidth || 100);
                        if (this.edition)
                            this.closeEditor(this.edition, !1);
                        var d = this.options.columns[a], e = t.editors[d.type], f = t.editors[b.type];
                        if (e && typeof e.destroyCell == 'function')
                            for (var g = 0; g < this.records.length; g++)
                                if (this.records[g][a].element)
                                    e.destroyCell(this.records[g][a].element);
                        this.options.columns[a] = b;
                        if (f && typeof f.createCell == 'function')
                            for (g = 0; g < this.records.length; g++)
                                this.records[g] && this.records[g][a] && this.records[g][a].element && (H.applyProperties.call(this, this.records[g][a].element, a, g), f.createCell(this.records[g][a].element, I.call(this, a, g), a, g, this, b));
                        if (b.width && this.colgroup[a])
                            this.colgroup[a].setAttribute('width', parseInt(b.width));
                        b.title && (this.headers[a] && (this.headers[a].innerText = b.title, this.headers[a].setAttribute('data-title', b.title)), this.options.columns[a].title = b.title);
                        b.tooltip && (this.headers[a] && (this.headers[a].title = b.tooltip), this.options.columns[a].tooltip = b.tooltip);
                        this.refreshBorders();
                        O.call(this.parent, {
                            worksheet: this,
                            action: 'setProperty',
                            column: a,
                            newValue: b,
                            oldValue: d
                        });
                        F.call(this, 'setProperty', {
                            column: a,
                            options: b
                        });
                        return !0;
                    }
                    return this.options.columns[a];
                }
                console.error('Jspreadsheet: Column does not exists.');
            };
            return c;
        }(), Na = function () {
            var h = {}, c = {}, a = function (d) {
                    if (typeof d == 'string') {
                        var e = d;
                        d = z.getCoordsFromColumnName(d);
                        var f = d[0];
                        d = d[1];
                    } else
                        f = d.x, d = d.y, e = z.getColumnNameFromCoords(f, d);
                    if (this.records[d] && this.records[d][f] && this.records[d][f].element) {
                        c[e] = this.options.style[e];
                        this.records[d][f].element.setAttribute('style', '');
                        var g = this.options.columns[f].align ? this.options.columns[f].align : this.options.defaultColAlign;
                        g && (this.records[d][f].element.style.textAlign = g);
                    }
                    this.options.style && this.options.style[e] && delete this.options.style[e];
                }, b = function (d) {
                    d.getStyle = b.get;
                    d.setStyle = b.set;
                    d.resetStyle = b.reset;
                };
            b.get = function (d) {
                var e = this.options.style;
                if (!e)
                    return !1;
                if (d) {
                    if (typeof d == 'string')
                        return e[d];
                    var f = [], g = Object.keys(d);
                    if (0 < g.length)
                        for (var k = 0; k < g.length; k++) {
                            if (typeof d[k] == 'string')
                                var n = e && e[d[k]] ? e[d[k]] : '';
                            else
                                n = z.getColumnNameFromCoords(d[k].x, d[k].y), n = e && e[n] ? e[n] : '';
                            f.push(n);
                        }
                    return f;
                }
                return this.options.style;
            };
            b.set = function (d, e, f, g) {
                if (!J.call(this.parent, this))
                    return !1;
                this.options.style || (this.options.style = {});
                var k = this.options.style, n = null, m = [], p = [], q = {};
                p = function (l, w, v) {
                    if (!q[l] && (k[l] ? m = k[l].split(';') : (k[l] = '', m = []), q[l] = {}, m.length))
                        for (var x = 0; x < m.length; x++)
                            m[x] && m[x].trim() && (n = m[x].split(':'), q[l][n[0].trim()] = n[1].trim());
                    c[l] || (c[l] = []);
                    h[l] || (h[l] = []);
                    q[l][w] || (q[l][w] = '');
                    c[l].push([w + ':' + q[l][w]]);
                    q[l][w] = q[l][w] && q[l][w] == v && !g ? '' : v;
                    h[l].push([w + ':' + q[l][w]]);
                    v = z.getCoordsFromColumnName(l);
                    this.records[v[1]] && this.records[v[1]][v[0]] && this.records[v[1]][v[0]].element && (this.records[v[1]][v[0]].element.style[w] = q[l][w]);
                    q[l][w] || delete q[l][w];
                };
                h = {};
                c = {};
                if (e)
                    if (typeof d == 'string')
                        p.call(this, d, e, f);
                    else {
                        if (d && d.length)
                            for (var r = 0; r < d.length; r++) {
                                var u = z.getColumnNameFromCoords(d[r].x, d[r].y);
                                p.call(this, u, e, f);
                            }
                    }
                else
                    for (f = Object.keys(d), r = 0; r < f.length; r++)
                        if (u = d[f[r]])
                            for (typeof u == 'string' && (u = u.split(';')), e = 0; e < u.length; e++)
                                if (u[e] && (typeof u[e] == 'string' && (u[e] = u[e].split(':')), u[e][0].trim()))
                                    p.call(this, f[r], u[e][0].trim(), u[e][1].trim());
                m = {};
                p = Object.keys(q);
                if (p.length) {
                    for (r = 0; r < p.length; r++) {
                        m[p[r]] || (m[p[r]] = []);
                        d = Object.keys(q[p[r]]);
                        for (e = 0; e < d.length; e++)
                            m[p[r]].push(d[e] + ': ' + q[p[r]][d[e]]);
                        this.options.style[p[r]] = m[p[r]].join('; ');
                    }
                    p = Object.keys(h);
                    for (r = 0; r < p.length; r++)
                        h[p[r]] = h[p[r]].join(';');
                    p = Object.keys(c);
                    for (r = 0; r < p.length; r++)
                        c[p[r]] = c[p[r]].join(';');
                    this.refreshBorders();
                    O.call(this.parent, {
                        worksheet: this,
                        action: 'setStyle',
                        oldValue: c,
                        newValue: h
                    });
                    F.call(this, 'setStyle', [h]);
                    A.call(this.parent, 'onchangestyle', this, h, c);
                }
            };
            b.reset = function (d) {
                if (!J.call(this.parent, this))
                    return !1;
                if (d) {
                    c = {};
                    if (Array.isArray(d))
                        for (var e = 0; e < d.length; e++)
                            a.call(this, d[e]);
                    else
                        a.call(this, d);
                    this.refreshBorders();
                    O.call(this.parent, {
                        worksheet: this,
                        action: 'resetStyle',
                        cells: d,
                        oldValue: c
                    });
                    F.call(this, 'resetStyle', [d]);
                    A.call(this.parent, 'onresetstyle', this, d);
                } else
                    console.error('No cell provided');
            };
            b.update = function (d) {
                h = {};
                c = {};
                for (var e = Object.keys(d), f = 0; f < e.length; f++) {
                    c[e[f]] = this.options.style[e[f]] || '';
                    h[e[f]] = this.options.style[e[f]] = d[e[f]];
                    var g = z.getCoordsFromColumnName(e[f]), k = g[0];
                    g = g[1];
                    this.records[g] && this.records[g][k] && this.records[g][k].element && (this.records[g][k].element.setAttribute('style', d[e[f]]), this.records[g][k].element.style.textAlign || (this.records[g][k].element.style.textAlign = this.options.columns[k].align || this.options.defaultColAlign || 'center'));
                }
                F.call(this, 'resetStyle', [e]);
                F.call(this, 'setStyle', [h]);
                A.call(this.parent, 'onchangestyle', this, h, c);
            };
            return b;
        }(), Va = function () {
            var h = function (c) {
                c.getComments = h.get;
                c.setComments = h.set;
            };
            h.get = function (c) {
                return c && typeof c == 'string' ? this.options.comments && this.options.comments[c] ? this.options.comments[c] : !1 : this.options.comments;
            };
            h.set = function (c, a) {
                if (!J.call(this.parent, this))
                    return !1;
                if (typeof c == 'string') {
                    var b = {};
                    b[c] = a;
                } else
                    b = c;
                if (a = A.call(this.parent, 'onbeforecomments', this, b))
                    b = a;
                else if (!1 === a)
                    return !1;
                this.options.comments || (this.options.comments = {});
                c = {};
                var d = Object.keys(b);
                if (d.length) {
                    for (var e = 0; e < d.length; e++) {
                        var f = z.getCoordsFromColumnName(d[e]);
                        if (this.records[f[1]] && this.records[f[1]][f[0]] && (c[d[e]] = this.options.comments[d[e]] || '', (a = b[d[e]]) ? this.options.comments[d[e]] = a : delete this.options.comments[d[e]], this.records[f[1]][f[0]].element))
                            if (a)
                                this.records[f[1]][f[0]].element.setAttribute('title', a);
                            else
                                this.records[f[1]][f[0]].element.removeAttribute('title');
                    }
                    O.call(this.parent, {
                        worksheet: this,
                        action: 'setComments',
                        newValue: b,
                        oldValue: c
                    });
                    F.call(this, 'setComments', [b]);
                    A.call(this.parent, 'oncomments', this, b, c);
                }
            };
            return h;
        }(), Wa = function () {
            var h = function (c) {
                c.getMeta = h.get;
                c.setMeta = h.set;
                c.resetMeta = h.reset;
            };
            h.get = function (c, a) {
                if (c) {
                    if (this.options.meta[c])
                        return a ? this.options.meta[c][a] : this.options.meta[c];
                } else
                    return this.options.meta;
            };
            h.set = function (c, a, b) {
                if (!J.call(this.parent, this))
                    return !1;
                this.options.meta || (this.options.meta = {});
                if (typeof c == 'string' && a) {
                    b ||= '';
                    var d = {};
                    d[c] = {};
                    d[c][a] = b;
                    c = d;
                }
                a = Object.keys(c);
                if (a.length) {
                    b = {};
                    for (d = 0; d < a.length; d++) {
                        this.options.meta[a[d]] || (this.options.meta[a[d]] = {});
                        b[a[d]] || (b[a[d]] = {});
                        for (var e = Object.keys(c[a[d]]), f = 0; f < e.length; f++)
                            this.options.meta[a[d]][e[f]] = c[a[d]][e[f]], b[a[d]][e[f]] = c[a[d]][e[f]];
                    }
                    Object.keys(b).length && (F.call(this, 'setMeta', [b]), A.call(this.parent, 'onchangemeta', this, b));
                }
            };
            h.reset = function () {
                this.options.meta = {};
                F.call(this, 'resetMeta', {});
                A.call(this.parent, 'onresetmeta', this, {});
            };
            return h;
        }(), Xa = function () {
            var h = function (c) {
                c.orderBy = h.execute;
            };
            h.handler = function (c, a) {
                return function (b, d) {
                    b = b[1];
                    d = d[1];
                    return c ? b === '' && d !== '' ? 1 : b !== '' && d === '' ? -1 : b > d ? -1 : b < d ? 1 : 0 : b === '' && d !== '' ? 1 : b !== '' && d === '' ? -1 : b > d ? 1 : b < d ? -1 : 0;
                };
            };
            h.execute = function (c, a, b) {
                if (0 <= c) {
                    a = null == a ? this.headers[c].classList.contains('arrow-down') ? 1 : 0 : a ? 1 : 0;
                    for (var d, e, f = [], g = 0; g < this.options.data.length; g++)
                        d = Da.getOptions.call(this, c, g), e = this.records[g][c].v, e = d.type == 'autonumber' || d.type == 'progressbar' || d.type == 'rating' || d.type == 'percent' || d.type == 'number' || d.type == 'numeric' ? Number(e) : jSuites.isNumeric(e) ? Number(e) : e.toLowerCase(), f[g] = [
                            g,
                            e
                        ];
                    g = typeof this.parent.config.sorting === 'function' ? this.parent.config.sorting(a, c) : h.handler(a, c);
                    f.sort(g);
                    d = b ? !0 : !1;
                    if (!b)
                        for (b = [], g = 0; g < f.length; g++)
                            b[g] = f[g][0];
                    if (g = A.call(this.parent, 'onbeforesort', this, c, a, b))
                        b = g;
                    else if (!1 === g)
                        return !1;
                    if (d)
                        this.destroyMerged();
                    else if (0 < Object.keys(this.getMerge()).length)
                        if (confirm(E('This action will destroy any existing merged cells. Are you sure?')))
                            this.destroyMerged();
                        else
                            return !1;
                    if (b.length < f.length)
                        for (g = 0; g < f.length; g++)
                            if (-1 == b.indexOf(f[g][0]))
                                b.push(f[g][0]);
                    f = [];
                    for (g = 0; g < b.length; g++)
                        f[b[g]] = g;
                    Aa.call(this, !1);
                    ca.reset.call(this);
                    F.call(this, 'orderBy', {
                        column: c,
                        direction: a,
                        order: b
                    });
                    h.update.call(this, b);
                    h.arrow.call(this, c, a);
                    ca.refresh.call(this);
                    O.call(this.parent, {
                        worksheet: this,
                        action: 'orderBy',
                        column: c,
                        newValue: b,
                        oldValue: f,
                        direction: a
                    });
                    A.call(this.parent, 'onsort', this, c, a, b);
                    return !0;
                }
            };
            h.update = function (c) {
                for (var a = [], b = 0; b < c.length; b++)
                    a[b] = this.options.data[c[b]];
                for (b = 0; b < c.length; b++)
                    this.options.data[b] = a[b];
                a = [];
                for (b = 0; b < c.length; b++)
                    a[b] = this.records[c[b]];
                this.records = a;
                a = [];
                for (b = 0; b < c.length; b++)
                    a[b] = this.rows[c[b]];
                this.rows = a;
                T.references.call(this);
                if (this.searchInput && this.searchInput.value)
                    ma.update.call(this, null);
                else
                    Y.update.call(this);
            };
            h.arrow = function (c, a) {
                for (var b = 0; b < this.headers.length; b++)
                    this.headers[b].classList.remove('arrow-up'), this.headers[b].classList.remove('arrow-down');
                if (a)
                    this.headers[c].classList.add('arrow-up');
                else
                    this.headers[c].classList.add('arrow-down');
            };
            return h;
        }(), ra = function () {
            var h = function (c) {
                c.whichPage = h.whichPage;
                c.quantityOfPages = h.quantityOfPages;
                c.page = h.set;
                c.updatePagination = h.update;
            };
            h.build = function () {
                this.pageNumber = 0;
                var c = document.createElement('div'), a = document.createElement('div');
                this.pagination = document.createElement('div');
                this.pagination.classList.add('jss_pagination');
                this.pagination.appendChild(c);
                this.pagination.appendChild(a);
                this.options.pagination || (this.pagination.style.display = 'none');
                this.element.appendChild(this.pagination);
            };
            h.pageUp = function () {
                0 < this.pageNumber && (this.pageNumber--, h.set.call(this, this.pageNumber));
            };
            h.pageDown = function () {
                this.pageNumber < h.quantityOfPages.call(this) - 1 && (this.pageNumber++, h.set.call(this, this.pageNumber));
            };
            h.whichPage = function (c) {
                if (0 < this.options.pagination)
                    return this.rows[c] ? (this.results && (c = this.results.indexOf(parseInt(c))), Math.ceil((parseInt(c) + 1) / parseInt(this.options.pagination)) - 1) : null;
                console.log('Jspreadsheet: No pagination defined');
                return !1;
            };
            h.quantityOfPages = function () {
                if (0 < this.options.pagination)
                    return Math.ceil((this.results ? this.results.length : this.rows.length) / parseInt(this.options.pagination));
                console.log('Jspreadsheet: No pagination defined');
                return !1;
            };
            h.set = function (c, a) {
                var b = this.pageNumber, d = parseInt(this.options.pagination);
                if (d) {
                    if (null == c || -1 == c)
                        c = Math.ceil((this.results ? this.results : this.rows).length / d) - 1;
                    if (!1 === A.call(this.parent, 'onbeforechangepage', this, c, b, d))
                        return !1;
                    this.pageNumber = c;
                    B.resetY.call(this);
                    W.refresh.call(this);
                    if (typeof a == 'function')
                        a.call(this);
                    A.call(this.parent, 'onchangepage', this, c, b, d);
                } else
                    console.error('Jspreadsheet: pagination not defined');
            };
            h.update = function () {
                this.pagination.children[0].innerHTML = '';
                this.pagination.children[1].innerHTML = '';
                if (this.options.pagination) {
                    var c = this.results ? this.results.length : this.rows.length;
                    if (c) {
                        c = Math.ceil(c / this.options.pagination);
                        if (6 > this.pageNumber)
                            var a = 1, b = 10 > c ? c : 10;
                        else
                            5 > c - this.pageNumber ? (a = c - 9, b = c, 1 > a && (a = 1)) : (a = this.pageNumber - 4, b = this.pageNumber + 5);
                        if (1 < a) {
                            var d = document.createElement('div');
                            d.className = 'jss_page';
                            d.innerHTML = '<';
                            d.title = 1;
                            this.pagination.children[1].appendChild(d);
                        }
                        for (; a <= b; a++)
                            if (d = document.createElement('div'), d.className = 'jss_page', d.innerHTML = a, this.pagination.children[1].appendChild(d), this.pageNumber == a - 1)
                                d.classList.add('jss_page_selected');
                        b < c && (d = document.createElement('div'), d.className = 'jss_page', d.innerHTML = '>', d.title = c, this.pagination.children[1].appendChild(d));
                        this.pagination.children[0].innerHTML = E('Showing page {0} of {1} entries', [
                            this.pageNumber + 1,
                            c
                        ]);
                    } else
                        this.pagination.children[0].innerHTML = E('No records found');
                }
            };
            return h;
        }(), ja = function () {
            var h = function (c) {
                c.setFreezeColumns = h.set;
                c.resetFreezeColumns = h.reset;
            };
            h.update = function (c) {
                var a, b;
                if (b = this.options.freezeColumns) {
                    var d = 50;
                    if (this.rows[c].element)
                        for (var e = 0; e < b; e++) {
                            if (a = this.records[c][e].element)
                                a.classList.add('jss_freezed'), a.style.left = d + 1 + 'px';
                            d += this.options.columns[e].width;
                        }
                }
            };
            h.headers = function () {
                var c = 50, a;
                if (a = this.options.freezeColumns)
                    for (var b = 0; b < a; b++) {
                        this.headers[b].classList.add('jss_freezed');
                        this.headers[b].style.left = c + 1 + 'px';
                        if (this.options.footers)
                            for (var d = 0; d < this.options.footers.length; d++)
                                this.footers.content[d][b].element.classList.add('jss_freezed'), this.footers.content[d][b].element.style.left = c + 1 + 'px';
                        c += this.options.columns[b].width;
                    }
                else
                    h.reset.call(this);
            };
            h.set = function (c) {
                c && (this.options.freezeColumns = c, B.reset.call(this, !0), B.goto.call(this, null, 0));
                if (this.options.freezeColumns)
                    for (h.headers.call(this), c = 0; c < this.rows.length; c++)
                        if (this.rows[c].element)
                            h.update.call(this, c);
            };
            h.reset = function () {
                for (var c, a = 1; a <= this.options.freezeColumns; a++) {
                    if (c = this.thead.lastChild)
                        c.children[a].classList.remove('jss_freezed'), c.children[a].style.left = '';
                    for (var b = 0; b < this.rows.length; b++)
                        if (c = this.rows[b].element)
                            c.children[a].classList.remove('jss_freezed'), c.children[a].style.left = '';
                    if (this.options.footers)
                        for (b = 0; b < this.options.footers.length; b++)
                            this.tfoot.children[b].children[a].classList.remove('jss_freezed'), this.tfoot.children[b].children[a].style.left = '';
                }
                this.options.freezeColumns = 0;
            };
            h.getWidth = function () {
                var c = 0;
                if (0 < this.options.freezeColumns)
                    for (var a = 0; a <= this.options.freezeColumns; a++)
                        c += this.thead.lastChild.children[a].offsetWidth;
                return c;
            };
            return h;
        }(), T = function () {
            var h = function (b, d) {
                    if (this.options[b]) {
                        for (var e = {}, f = Object.keys(this.options[b]), g = 0; g < f.length; g++)
                            e[d && void 0 != d[f[g]] ? d[f[g]] : f[g]] = this.options[b][f[g]];
                        this.options[b] = e;
                    }
                }, c = function () {
                    if (0 < this.options.minSpareRows) {
                        for (var b = 0, d = this.rows.length - 1; 0 <= d; d--) {
                            for (var e = !1, f = 0; f < this.options.columns.length; f++)
                                I.call(this, f, d) && (e = !0);
                            if (e)
                                break;
                            else
                                b++;
                        }
                        if (0 < this.options.minSpareRows - b)
                            this.insertRow(this.options.minSpareRows - b);
                    }
                    if (0 < this.options.minSpareCols) {
                        b = 0;
                        for (f = this.options.columns.length - 1; 0 <= f; f--) {
                            e = !1;
                            for (d = 0; d < this.rows.length; d++)
                                I.call(this, f, d) && (e = !0);
                            if (e)
                                break;
                            else
                                b++;
                        }
                        if (0 < this.options.minSpareCols - b)
                            this.insertColumn(this.options.minSpareCols - b);
                    }
                }, a = function () {
                };
            a.build = function () {
                var b = this;
                this.content = document.createElement('div');
                this.content.classList.add('jss_content');
                this.content.addEventListener('wheel', function (f) {
                    if (B.limited.call(b) && !b.options.pagination) {
                        var g = Math.abs(f.deltaX), k = Math.abs(f.deltaY);
                        if (f.shiftKey || g > k)
                            if (0 > f.deltaX || 0 > f.deltaY)
                                B.pageLeft.call(b, 1, null, f);
                            else
                                B.pageRight.call(b, 1, null, f);
                        else if (0 > f.deltaY)
                            B.pageUp.call(b, 1, null, f);
                        else
                            B.pageDown.call(b, 1, null, f);
                    }
                });
                this.content.addEventListener('selectstart', function (f) {
                    if (!b.edition)
                        return f.preventDefault(), !1;
                });
                this.table = document.createElement('table');
                this.thead = document.createElement('thead');
                this.tbody = document.createElement('tbody');
                this.tfoot = document.createElement('tfoot');
                this.headers = [];
                this.colgroup = [];
                this.colgroupContainer = document.createElement('colgroup');
                var d = document.createElement('col');
                d.setAttribute('width', '50');
                this.colgroupContainer.appendChild(d);
                this.headerContainer = document.createElement('tr');
                d = document.createElement('td');
                d.classList.add('jss_selectall');
                this.headerContainer.appendChild(d);
                this.thead.appendChild(this.headerContainer);
                this.table.classList.add('jss');
                this.table.setAttribute('cellpadding', '0');
                this.table.setAttribute('cellspacing', '0');
                this.table.setAttribute('unselectable', 'yes');
                this.table.appendChild(this.colgroupContainer);
                this.table.appendChild(this.thead);
                this.table.appendChild(this.tbody);
                this.table.appendChild(this.tfoot);
                if (this.parent.config.wordWrap)
                    this.table.classList.add('jss_wrap');
                if (!this.options.textOverflow)
                    this.table.classList.add('jss_overflow');
                if (!1 === this.options.selectLockedCells)
                    this.table.classList.add('jss_locked');
                this.corner = document.createElement('div');
                this.corner.className = 'jss_corner';
                this.corner.setAttribute('unselectable', 'on');
                this.corner.setAttribute('onselectstart', 'return false');
                0 == this.options.selectionCopy && (this.corner.style.display = 'none');
                this.scrollX = N.build.call(b, 'X');
                this.scrollY = N.build.call(b, 'Y');
                d = document.createElement('div');
                d.appendChild(this.content);
                d.appendChild(this.scrollY);
                d.classList.add('jss_table');
                var e = document.createElement('div');
                e.appendChild(d);
                e.appendChild(this.scrollX);
                e.classList.add('jss_table_container');
                this.content.appendChild(this.table);
                this.content.appendChild(this.corner);
                this.element.appendChild(e);
                1 == this.options.tableOverflow && (this.options.tableHeight || (this.options.tableHeight = 300), this.options.tableWidth || (this.options.tableWidth = document.body.offsetWidth - 8), this.content.style.maxHeight = parseInt(this.options.tableHeight) + 'px', this.content.style.maxWidth = parseInt(this.options.tableWidth) + 'px', 1 == this.options.tableOverflowResizable && (this.content.style.resize = 'both'));
                ma.build.call(this);
                ka.build.call(this);
                ra.build.call(this);
                Ba.build.call(this);
                X.build.call(this);
                W.build.call(this);
                B.call(this);
                Y.onload.call(this);
                c.call(this);
            };
            a.references = function (b) {
                var d = [], e = [], f = null, g = null, k = null, n = null;
                for (f = 0; f < this.options.columns.length; f++)
                    if (g = this.headers[f])
                        k = g.getAttribute('data-x'), k != f && (g.setAttribute('data-x', f), g.getAttribute('data-title') || (g.innerHTML = z.getColumnName(f)));
                for (var m = 0; m < this.rows.length; m++)
                    g = this.rows[m], n = g.y, n != m && (g.y = m, d[n] = m, g.element && (g.element.setAttribute('data-y', m), g.element.children[0].setAttribute('data-y', m), f = this.options.rows && this.options.rows[n] && this.options.rows[n].title ? this.options.rows[n].title : m + 1, g.element.children[0].innerHTML = f));
                var p = function (r, u) {
                    g = this.records[u][r];
                    k = g.x;
                    n = g.y;
                    if (k != r && (g.x = r, g.element))
                        g.element.setAttribute('data-x', r);
                    if (n != u && (g.y = u, g.element))
                        g.element.setAttribute('data-y', u);
                    if (k != r || n != u) {
                        var l = z.getColumnNameFromCoords(k, n);
                        r = z.getColumnNameFromCoords(r, u);
                        e[l] = r;
                    }
                };
                if (b) {
                    m = function (r, u) {
                        r && r[u] && delete r[u];
                    };
                    var q = Object.keys(b);
                    for (f = 0; f < q.length; f++)
                        m(this, q[f]), m(this.options.meta, q[f]), m(this.options.cells, q[f]), m(this.options.style, q[f]), m(this.options.comments, q[f]);
                }
                for (m = 0; m < this.rows.length; m++)
                    for (f = 0; f < this.options.columns.length; f++)
                        p.call(this, f, m);
                h.call(this, 'rows', d);
                h.call(this, 'meta', e);
                h.call(this, 'cells', e);
                h.call(this, 'style', e);
                h.call(this, 'comments', e);
                h.call(this, 'mergeCells', e);
                if (this.options.mergeCells)
                    X.build.call(this);
                R.updateAll.call(this, e, b);
                return e;
            };
            a.update = function (b) {
                if (b)
                    c.call(this);
                if (typeof this.parent.config.updateTable == 'function')
                    for (var d = 0; d < this.rows.length; d++)
                        for (var e = 0; e < this.options.columns.length; e++)
                            b = this.records[d][e], this.parent.config.updateTable.call(this, this, b.element, e, d, I.call(this, e, d), b.r ? b.r : b.v);
                N.call(this);
                W.refresh.call(this);
            };
            return a;
        }(), ia = function () {
            var h = {};
            h.spreadsheet = function (c, a) {
                var b = {
                    name: null,
                    config: {},
                    el: c,
                    element: c,
                    plugins: [],
                    worksheets: [],
                    history: [],
                    historyIndex: -1,
                    queue: [],
                    ignoreEvents: !1,
                    ignoreHistory: !1,
                    ignorePersistence: !1
                };
                za.spreadsheet.call(b, a);
                b.config.license && (t.license = b.config.license);
                c.spreadsheet = b;
                c.jspreadsheet = c.jexcel = b.worksheets;
                t.spreadsheet.push(b);
                b.name || (b.name = jSuites.guid());
                h.bind(b.config.root ? b.config.root : document);
                var d = b.config.tabs;
                typeof d !== 'object' && (d = {
                    allowCreate: d ? !0 : !1,
                    hideHeaders: d ? !1 : !0,
                    allowChangePosition: b.config.allowMoveWorksheet ? !0 : !1
                });
                d.maxWidth || (d.maxWidth = c.offsetWidth - 50 + 'px');
                d.animation = void 0 == d.animation ? !0 : d.animation;
                d.onbeforecreate = function () {
                    b.createWorksheet();
                    return !1;
                };
                d.onclick = function (f, g, k, n, m) {
                    if (0 <= k)
                        b.openWorksheet(k);
                };
                d.onchangeposition = function (f, g, k) {
                    b.updateWorksheet(g, k);
                };
                jSuites.tabs(c, d);
                c.classList.add('jss_container');
                if (1 == a.fullscreen)
                    c.classList.add('fullscreen');
                var e = document.createElement('div');
                b.toolbar = document.createElement('div');
                b.toolbar.className = 'jss_toolbar';
                e.appendChild(b.toolbar);
                b.filter = Y.build.call(b);
                e.appendChild(b.filter);
                b.helper = document.createElement('div');
                b.helper.className = 'jss_helper';
                e.appendChild(b.helper);
                b.loading = document.createElement('div');
                b.loading.classList.add('jss_loading');
                e.appendChild(b.loading);
                e.appendChild(Z.build(b));
                e.appendChild(Oa(b));
                b.textarea = document.createElement('textarea');
                b.textarea.className = 'jss_textarea';
                b.textarea.tabIndex = '-1';
                e.appendChild(b.textarea);
                if (d.position === 'bottom')
                    c.insertBefore(e, c.children[0]);
                else
                    c.insertBefore(e, c.children[1]);
                c.appendChild(Fa.call(b, t.license));
                b.createWorksheet = da.createWorksheet;
                b.deleteWorksheet = da.deleteWorksheet;
                b.renameWorksheet = da.renameWorksheet;
                b.updateWorksheet = da.updateWorksheet;
                b.openWorksheet = da.openWorksheet;
                b.moveWorksheet = da.moveWorksheet;
                b.getWorksheet = da.getWorksheet;
                b.getWorksheetActive = da.getWorksheetActive;
                b.getWorksheetInstance = da.getWorksheetInstance;
                b.getConfig = function () {
                    var f = b.config;
                    f.worksheets = [];
                    for (var g = 0; g < b.worksheets.length; g++)
                        f.worksheets.push(b.worksheets[g].getConfig());
                    return f;
                };
                b.fullscreen = Ga;
                b.progress = Ha;
                b.undo = O.undo;
                b.redo = O.redo;
                b.setToolbar = ba.set;
                b.getToolbar = ba.get;
                b.showToolbar = ba.show;
                b.hideToolbar = ba.hide;
                b.tools = e;
                1 !== b.edition && (c = Object.keys(b.config.definedNames)) && c.length && (b.config.definedNames = {}, console.log('Defined names are only available on the Premium edition.'));
                if (a.plugins)
                    la.call(b, a.plugins);
                b.setPlugins = function (f) {
                    la.call(b, f);
                };
                c = Object.keys(t.extensions);
                if (c.length)
                    for (d = 0; d < c.length; d++)
                        if (typeof t.extensions[c[d]].oninit == 'function')
                            t.extensions[c[d]].oninit(b, a);
                return b;
            };
            h.worksheet = function (c, a) {
                var b = {};
                c.worksheets.push(b);
                b.parent = c;
                za(b);
                Ra(b);
                ua(b);
                ca(b);
                Z(b);
                Ba(b);
                Ta(b);
                X(b);
                Na(b);
                Ua(b);
                aa(b);
                R(b);
                H(b);
                va(b);
                Da(b);
                Wa(b);
                Va(b);
                ya(b);
                W(b);
                ka(b);
                ma(b);
                Y(b);
                ba(b);
                pa(b);
                Ya(b);
                Za(b);
                ra(b);
                da(b);
                ja(b);
                Sa(b);
                Xa(b);
                Ea(b);
                za.worksheet.call(b, a);
                !t.license && b.options.license && (t.license = b.options.license);
                c.element.jexcel = c.worksheets ? c.worksheets : b;
                b.onload = function () {
                    this.options.worksheetName || (this.options.worksheetName = 'Sheet' + da.nextName());
                    var d = this.options.worksheetName;
                    if (M(d))
                        console.log('Worksheet clash name: ' + d + '. It is highly recommended to define a unique worksheetName on the initialization.');
                    M(d, b);
                    this.element = c.element.tabs.appendElement(this.options.worksheetName, function (e, f) {
                        b.options.worksheetState === 'hidden' && (f.style.display = 'none');
                    });
                    this.element.classList.add('jss_worksheet');
                    this.element.jexcel = this;
                    T.build.call(this);
                    la.execute.call(this.parent, 'init', [this]);
                    if (this.options.data && 500 < this.options.data.length && !B.limited.call(this) && !this.options.pagination)
                        console.error('To improve the performance, use tableOverflow or pagination.');
                };
                return b;
            };
            h.row = function (c, a) {
                this.rows[c] || (this.rows[c] = {
                    element: null,
                    y: c
                });
                a && (this.rows[c].id = a, pa.set.call(this, a));
                this.options.rows && this.options.rows[c] && this.options.rows[c].height && (this.rows[c].height = this.options.rows[c].height);
                this.records[c] || (this.records[c] = []);
                this.options.data[c] || (this.options.data[c] = this.dataType ? {} : []);
                for (a = 0; a < this.options.columns.length; a++)
                    h.cell.call(this, a, c);
            };
            h.cell = function (c, a, b) {
                typeof b == 'undefined' && (b = I.call(this, c, a), null === b || void 0 === b) && (b = '', I.call(this, c, a, b));
                this.records[a][c] || (this.records[a][c] = {
                    element: null,
                    x: c,
                    y: a,
                    v: b
                });
            };
            h.bind = function (c) {
                for (var a = Object.keys(xa), b = 0; b < a.length; b++)
                    (a[b] == 'resize' ? window : c).addEventListener(a[b], xa[a[b]], a[b] == 'touchstart' || a[b] == 'touchmove' || a[b] == 'touchend' ? { passive: !1 } : {});
            };
            h.unbind = function (c) {
                for (var a = Object.keys(xa), b = 0; b < a.length; b++)
                    (a[b] == 'resize' ? window : c).removeEventListener(a[b], xa[a[b]]);
            };
            return h;
        }(), Ya = function () {
            var h = function (c) {
                c.getWidth = h.get;
                c.setWidth = h.set;
            };
            h.get = function (c) {
                var a = this.options.columns;
                if (typeof c === 'undefined') {
                    c = [];
                    for (var b = 0; b < a.length; b++)
                        c.push(a[b].width);
                } else
                    c = a[c].width;
                return c;
            };
            h.set = function (c, a, b) {
                if (!J.call(this.parent, this))
                    return !1;
                if (a) {
                    if (Array.isArray(c)) {
                        b ||= [];
                        for (var d = 0; d < c.length; d++) {
                            b[d] || (b[d] = this.colgroup[c[d]].getAttribute('width'));
                            var e = Array.isArray(a) && a[d] ? a[d] : a;
                            this.colgroup[c[d]].setAttribute('width', e);
                            this.options.columns[c[d]].width = e;
                        }
                    } else
                        b ||= this.colgroup[c].getAttribute('width'), this.colgroup[c].setAttribute('width', a), this.options.columns[c].width = a;
                    this.refreshBorders();
                    O.call(this.parent, {
                        worksheet: this,
                        action: 'setWidth',
                        column: c,
                        oldValue: b,
                        newValue: a
                    });
                    F.call(this, 'setWidth', {
                        column: c,
                        width: a,
                        oldWidth: b
                    });
                    A.call(this.parent, 'onresizecolumn', this, c, a, b);
                }
                B.refresh.call(this);
            };
            return h;
        }(), Za = function () {
            var h = function (a) {
                a.getHeight = h.get;
                a.setHeight = h.set;
            };
            h.get = function (a) {
                if (a)
                    a = this.rows[a].element.style.height;
                else {
                    a = [];
                    for (var b = 0; b < obj.rows.length; b++) {
                        var d = obj.rows[b].element.style.height;
                        d && (a[b] = d);
                    }
                }
                return a;
            };
            var c = function (a, b) {
                b = parseInt(b);
                var d = this.rows[a].height ? this.rows[a].height : this.rows[a].element.offsetHeight || this.options.defaultRowHeight;
                this.rows[a].element.style.height = b + 'px';
                this.options.rows[a] || (this.options.rows[a] = {});
                this.options.rows[a].height = b + 'px';
                this.rows[a].height = b;
                return d;
            };
            h.set = function (a, b, d) {
                if (!J.call(this.parent, this))
                    return !1;
                var e, f = typeof d == 'undefined' ? !0 : !1;
                if (b) {
                    if (Array.isArray(a))
                        for (!0 === f && (d = []), e = 0; e < a.length; e++) {
                            var g = Array.isArray(b) && b[e] ? b[e] : b;
                            c.call(this, a[e], g);
                            if (1 == f)
                                d.push(f);
                        }
                    else
                        e = c.call(this, a, b), 1 == f && (d = e);
                    this.refreshBorders();
                    O.call(this.parent, {
                        worksheet: this,
                        action: 'setHeight',
                        row: a,
                        oldValue: d,
                        newValue: b
                    });
                    F.call(this, 'setHeight', {
                        row: a,
                        height: b,
                        oldHeight: d
                    });
                    A.call(this.parent, 'onresizerow', this, a, b, d);
                }
                B.refresh.call(this);
            };
            return h;
        }(), Y = function () {
            var h = function (g) {
                    var k = this.appendChild, n = e[g];
                    g = b[e[g]];
                    if (!g.element) {
                        g.element = document.createElement('label');
                        g.element.innerHTML = g.value;
                        var m = document.createElement('input');
                        m.type = 'checkbox';
                        m.value = n;
                        m.o = g;
                        g.element.insertBefore(m, g.element.firstChild);
                    }
                    g.element.firstChild.checked = g.selected;
                    k.call(this, g.element);
                }, c = null, a = null, b = [], d = 0, e = null, f = function (g) {
                    g.setFilter = f.set;
                    g.getFilter = f.get;
                    g.openFilter = f.open;
                    g.closeFilter = f.close;
                    g.resetFilters = f.reset;
                    g.showFilter = f.show;
                    g.hideFilter = f.hide;
                };
            f.isVisible = function () {
                return a;
            };
            f.set = function (g, k) {
                var n = this.headers[g];
                g = this.options.columns[g];
                if (Array.isArray(k) && 0 < k.length) {
                    if (n)
                        n.classList.add('jss_filters_active');
                    g.filters = k;
                } else {
                    if (n)
                        n.classList.remove('jss_filters_active');
                    g.filters = null;
                }
                f.update.call(this);
            };
            f.get = function (g) {
                var k = function (m) {
                    return this.options.columns[m].filters || null;
                };
                if (g)
                    return k.call(this, g);
                g = {};
                for (var n = 0; n < this.options.columns.length; n++)
                    g[n] = k.call(this, n);
                return g;
            };
            f.open = function (g) {
                c = parseInt(g);
                if (this.headers[c].classList.contains('jss_filters_icon')) {
                    a = !0;
                    var k = this.parent.element.getBoundingClientRect(), n = this.headers[c].getBoundingClientRect();
                    g = n.left - k.left;
                    n = n.top - k.top + n.height;
                    k = this.parent.filter;
                    k.style.display = 'block';
                    k.style.top = n + 'px';
                    k.style.left = g + 'px';
                    k.children[0].focus();
                    g = k.children[1].selectAll;
                    k.children[1].textContent = '';
                    k.children[1].appendChild(g);
                    this.options.columns[c].filters || (g.children[0].checked = !0);
                    g = ma.execute.call(this, null, c);
                    g = z.invert(g);
                    k = [];
                    for (n = 0; n < this.rows.length; n++)
                        if (g[n]) {
                            var m = '' + I.call(this, c, n), p = '' + aa.processed.call(this, c, n, !0);
                            m.substr(0, 1) == '=' && (m = p);
                            k.push([
                                m,
                                p
                            ]);
                        }
                    k.sort(function (q, r) {
                        return q[0] > r[0] ? 1 : q[0] < r[0] ? -1 : 0;
                    });
                    b = [];
                    for (n = 0; n < k.length; n++)
                        b[k[n][0]] = {
                            value: k[n][1],
                            element: null
                        };
                    void 0 !== b[''] && (delete b[''], b[''] = {
                        value: '(' + E('Blanks') + ')',
                        element: null
                    });
                    f.search.call(this, '');
                } else
                    console.log('Jspreadsheet: the filter is not enabled.');
            };
            f.close = function (g) {
                if (g) {
                    g = this.parent.filter.children[1];
                    if (1 == g.selectAll.firstChild.checked && e.length == Object.keys(b).length)
                        g = null;
                    else {
                        g = 1 == g.currentSelection.firstChild.checked ? this.options.columns[c].filters || [] : [];
                        for (var k = 0; k < e.length; k++)
                            if (b[e[k]].selected)
                                g.push(e[k]);
                    }
                    f.set.call(this, c, g);
                }
                this.parent.filter.style.display = '';
                this.parent.filter.children[0].value = '';
                c = null;
                a = !1;
                b = null;
                d = 0;
                e = null;
            };
            f.reset = function (g) {
                f.updateDOM.call(this, g, !1);
                this.results = null;
                f.update.call(this);
            };
            f.execute = function (g) {
                for (var k = this.options.columns, n = [], m = 0; m < this.options.data.length; m++) {
                    for (var p = !0, q = 0; q < k.length; q++)
                        if (k[q].filters && g !== q) {
                            var r = '' + I.call(this, q, m), u = '' + this.getLabelFromCoords(q, m, !0);
                            -1 == k[q].filters.indexOf(r) && -1 == k[q].filters.indexOf(u) && (p = !1);
                        }
                    if (p)
                        n.push(m);
                }
                return n;
            };
            f.update = function () {
                this.resetSelection();
                this.resetBorders();
                var g = ma.execute.call(this, null);
                if (typeof this.parent.config.onbeforefilter == 'function') {
                    var k = f.get.call(this), n = A.call(this.parent, 'onbeforefilter', this, k, g);
                    if (n)
                        g = n;
                    else if (!1 === n)
                        return !1;
                }
                this.pageNumber = 0;
                this.results = g && g.length < this.rows.length ? g : null;
                B.resetY.call(this);
                W.refresh.call(this);
                A.call(this.parent, 'onfilter', this, k, g);
            };
            f.show = function (g) {
                f.updateDOM.call(this, g, !0);
            };
            f.hide = function (g) {
                f.updateDOM.call(this, g, !1, !0);
                f.update.call(this);
            };
            f.search = function (g) {
                for (var k = this.parent.filter.children[1]; k.children[1];)
                    k.removeChild(k.lastChild);
                k.currentSelection.firstChild.checked = !1;
                if (g) {
                    e = [];
                    g = new RegExp(g, 'gi');
                    for (var n = Object.keys(b), m = 0; m < n.length; m++)
                        ('' + n[m]).match(g) || ('' + b[n[m]]).match(g) ? (e.push(n[m]), b[n[m]].selected = !0) : b[n[m]].selected = !1;
                    k.firstChild.checked = !0;
                    if (this.options.columns[c].filters)
                        k.appendChild(k.currentSelection);
                } else {
                    e = Object.keys(b);
                    if (g = this.options.columns[c].filters)
                        for (m = 0; m < e.length; m++)
                            b[e[m]].selected = !1, 0 <= g.indexOf(e[m]) && (b[e[m]].selected = !0);
                    else
                        for (m = 0; m < e.length; m++)
                            b[e[m]].selected = !0;
                    k.firstChild.checked = g ? !1 : !0;
                }
                for (m = d = 0; m < e.length; m++)
                    if (200 > m)
                        h.call(k, d++);
            };
            f.build = function () {
                var g = document.createElement('div');
                g.className = 'jss_filters_options';
                g.onclick = function (p) {
                    p.target.tagName == 'INPUT' && p.target.o && (p.target.o.selected = p.target.checked);
                    p = !0;
                    for (var q = 1; q < this.children.length; q++)
                        this.children[q].children[0].checked || (p = !1);
                    this.children[0].children[0].checked = p;
                };
                var k = document.createElement('input');
                k.type = 'text';
                k.placeholder = E('Search');
                k.className = 'jss_filters_search';
                var n = document.createElement('input');
                n.type = 'button';
                n.value = 'Ok';
                n.className = 'jss_filters_apply';
                var m = document.createElement('div');
                m.className = 'jss_filters';
                m.appendChild(k);
                m.appendChild(g);
                m.appendChild(n);
                g.currentSelection = document.createElement('label');
                g.currentSelection.innerHTML = '<input type="checkbox"> ' + E('Add current selection to filter');
                g.selectAll = document.createElement('label');
                g.selectAll.innerHTML = '<input type="checkbox"> (' + E('Select all') + ')';
                g.selectAll.onclick = function () {
                    for (var p = this.children[0].checked, q = 1; q < this.parentNode.children.length; q++)
                        this.parentNode.children[q].children[0].checked = p;
                    if (1 == p)
                        for (q = 0; q < e.length; q++)
                            b[e[q]].selected = !0;
                    else
                        for (p = Object.keys(b), q = 0; q < p.length; q++)
                            b[p[q]].selected = !1;
                };
                jSuites.lazyLoading(g, {
                    loadDown: function (p) {
                        for (p = 0; d < e.length - 1 && 10 > p;)
                            h.call(g, d++), p++;
                    }
                });
                return m;
            };
            f.updateDOM = function (g, k, n) {
                var m = this.headers, p = function (q) {
                        if (1 == k)
                            m[q].classList.add('jss_filters_icon');
                        else if (this.options.columns[q].filters = null, m[q].classList.remove('jss_filters_active'), 1 == n)
                            m[q].classList.remove('jss_filters_icon');
                    };
                if (g)
                    p.call(this, g);
                else
                    for (g = 0; g < m.length; g++)
                        p.call(this, g);
            };
            f.onload = function () {
                var g, k = !1;
                if (g = this.options.columns)
                    for (var n = 0; n < g.length; n++)
                        Array.isArray(g[n].filters) && 0 < g[n].filters.length && this.headers[n] && (this.headers[n].classList.add('jss_filters_active'), k = !0);
                if (1 == k)
                    f.update.call(this);
            };
            return f;
        }(), ma = function () {
            var h = function (b) {
                    var d = document.createElement('div');
                    if (0 < b.options.pagination && b.options.paginationOptions && 0 < b.options.paginationOptions.length) {
                        b.paginationDropdown = document.createElement('select');
                        b.paginationDropdown.classList.add('jss_pagination_dropdown');
                        b.paginationDropdown.onchange = function () {
                            b.options.pagination = parseInt(this.value);
                            b.page(0);
                        };
                        for (var e = 0; e < b.options.paginationOptions.length; e++) {
                            var f = document.createElement('option');
                            f.value = b.options.paginationOptions[e];
                            f.innerHTML = b.options.paginationOptions[e];
                            b.paginationDropdown.appendChild(f);
                        }
                        b.paginationDropdown.value = b.options.pagination;
                        d.appendChild(document.createTextNode(E('Show')));
                        d.appendChild(b.paginationDropdown);
                        d.appendChild(document.createTextNode(E('entries')));
                    }
                    return d;
                }, c = function (b, d) {
                    var e = this.merged.rows;
                    if (e[d]) {
                        for (; 0 < d && e[d - 1];)
                            d--;
                        for (; e[d];)
                            b.push(d++);
                    } else
                        b.push(d);
                }, a = function (b) {
                    b.search = a.update;
                    b.resetSearch = a.reset;
                    b.updateSearch = a.refresh;
                    b.showSearch = a.show;
                    b.hideSearch = a.hide;
                };
            a.execute = function (b, d) {
                null === b ? b = this.searchInput.value || '' : b !== this.searchInput.value && (this.searchInput.value = b);
                this.pageNumber = 0;
                var e = [], f = null;
                d = Y.execute.call(this, d);
                if (b)
                    try {
                        b = new RegExp(b, 'gi');
                        for (var g = 0; g < this.rows.length; g++) {
                            f = !1;
                            if (!d || 0 <= d.indexOf(g))
                                for (var k = 0; k < this.options.columns.length; k++) {
                                    var n = '' + I.call(this, k, g), m = '' + this.getLabelFromCoords(k, g);
                                    if (n.match(b) || m.match(b))
                                        f = !0;
                                }
                            if (1 == f)
                                c.call(this, e, g);
                        }
                    } catch (p) {
                    }
                else
                    e = d;
                return e;
            };
            a.update = function (b) {
                this.resetSelection();
                this.resetBorders();
                var d = a.execute.call(this, b);
                if (typeof this.parent.config.onbeforesearch == 'function') {
                    var e = A.call(this.parent, 'onbeforesearch', this, b, d);
                    if (e)
                        d = e;
                    else if (!1 === e)
                        return !1;
                }
                this.pageNumber = 0;
                this.results = d && d.length < this.rows.length ? d : null;
                B.resetY.call(this);
                W.refresh.call(this);
                A.call(this.parent, 'onsearch', this, b, d);
            };
            a.refresh = function () {
                B.resetY.call(this);
                W.refresh.call(this);
            };
            a.reset = function () {
                this.searchInput.value = '';
                this.results = null;
                B.resetY.call(this);
                W.refresh.call(this);
            };
            a.show = function () {
                this.options.search = !0;
                this.searchContainer.style.display = '';
            };
            a.hide = function () {
                this.options.search = !1;
                this.searchContainer.style.display = 'none';
            };
            a.build = function () {
                this.searchContainer = document.createElement('div');
                this.searchContainer.classList.add('jss_search_container');
                this.searchContainer.appendChild(h(this));
                var b = this.searchContainer, d = b.appendChild, e = document.createElement('div');
                e.innerHTML = E('Search') + ': ';
                this.searchInput = document.createElement('input');
                this.searchInput.classList.add('jss_search');
                e.appendChild(this.searchInput);
                d.call(b, e);
                0 == this.options.search && (this.searchContainer.style.display = 'none');
                this.element.insertBefore(this.searchContainer, this.element.firstChild);
            };
            return a;
        }(), Oa = function () {
            var h = function (c) {
                c.contextmenu = document.createElement('div');
                c.contextmenu.className = 'jss_contextmenu';
                jSuites.contextmenu(c.contextmenu, {
                    onclick: function (a, b, d) {
                        a.close();
                    }
                });
                return c.contextmenu;
            };
            h.open = function (c, a) {
                var b = c.target.getAttribute('data-x'), d = c.target.getAttribute('data-y'), e = h.get(this, b, d, c, a[0], a[1], a[2]);
                if (typeof this.parent.config.contextMenu == 'function') {
                    var f = this.parent.config.contextMenu(this, b, d, c, e, a[0], a[1], a[2]);
                    if (f)
                        e = f;
                    else if (!1 === f)
                        return !1;
                }
                c.preventDefault();
                f = la.execute.call(this.parent, 'contextMenu', [
                    this,
                    b,
                    d,
                    c,
                    e,
                    a[0],
                    a[1],
                    a[2]
                ]);
                e = f[4];
                this.parent.contextmenu.contextmenu.open(c, e);
            };
            h.get = function (c, a, b, d, e, f, g) {
                var k = [], n = c.parent.config, m = -1 != navigator.userAgent.indexOf('Mac') ? '&#8984;' : 'Ctrl';
                if (e == 'tabs') {
                    if (1 == n.allowRenameWorksheet)
                        k.push({
                            title: E('Rename this worksheet'),
                            onclick: function () {
                                var q = prompt(E('Rename this worksheet'), d.target.innerText);
                                if (q)
                                    c.parent.renameWorksheet(f, q);
                            }
                        });
                    if (1 == n.allowDeleteWorksheet)
                        k.push({
                            title: E('Delete this worksheet'),
                            onclick: function () {
                                if (confirm(E('Are you sure?'), d.target.innerText))
                                    c.parent.deleteWorksheet(f);
                            }
                        });
                    k.push({ type: 'line' });
                }
                e == 'nested' && (k.push({
                    title: E('Rename this cell'),
                    onclick: function () {
                        var q = prompt(E('Rename this cell'), d.target.innerText);
                        c.setNestedCell(f, g, { title: q });
                    }
                }), k.push({ type: 'line' }));
                if (e == 'header' || e == 'row' || e == 'cell' || e == 'nested') {
                    k.push({
                        title: E('Cut'),
                        icon: 'content_cut',
                        shortcut: m + ' + X',
                        onclick: function () {
                            c.cut();
                        }
                    });
                    k.push({
                        title: E('Copy'),
                        icon: 'content_copy',
                        shortcut: m + ' + C',
                        onclick: function () {
                            c.copy();
                        }
                    });
                    if (navigator && navigator.clipboard && navigator.clipboard.readText)
                        k.push({
                            title: E('Paste'),
                            icon: 'content_paste',
                            shortcut: m + ' + V',
                            onclick: function () {
                                if (c.selectedCell)
                                    navigator.clipboard.readText().then(function (q) {
                                        if (q)
                                            c.paste(c.selectedCell[0], c.selectedCell[1], q);
                                    });
                            }
                        });
                    k.push({ type: 'line' });
                }
                if (e == 'header') {
                    if (1 == c.options.allowInsertColumn)
                        k.push({
                            title: E('Insert a new column before'),
                            onclick: function () {
                                c.insertColumn(1, parseInt(f), 1);
                            }
                        });
                    if (1 == c.options.allowInsertColumn)
                        k.push({
                            title: E('Insert a new column after'),
                            onclick: function () {
                                c.insertColumn(1, parseInt(f), 0);
                            }
                        });
                    if (1 == c.options.allowDeleteColumn)
                        k.push({
                            title: E('Delete selected columns'),
                            onclick: function () {
                                c.deleteColumn(c.getSelectedColumns().length ? void 0 : parseInt(a));
                            }
                        });
                    if (1 == c.options.allowRenameColumn)
                        k.push({
                            title: E('Rename this column'),
                            onclick: function () {
                                c.setHeader(f);
                            }
                        });
                    c.options.data.length || (k.push({ type: 'line' }), k.push({
                        title: E('Create a new row'),
                        onclick: function () {
                            c.insertRow(0);
                        }
                    }));
                    1 == c.options.columnSorting && (k.push({ type: 'line' }), k.push({
                        title: E('Order ascending'),
                        onclick: function () {
                            c.orderBy(f, 0);
                        }
                    }), k.push({
                        title: E('Order descending'),
                        onclick: function () {
                            c.orderBy(f, 1);
                        }
                    }), k.push({ type: 'line' }));
                }
                if (e == 'cell' || e == 'row') {
                    1 == c.options.allowInsertRow && (k.push({
                        title: E('Insert a new row before'),
                        onclick: function () {
                            c.insertRow(1, parseInt(b), 1);
                        }
                    }), k.push({
                        title: E('Insert a new row after'),
                        onclick: function () {
                            c.insertRow(1, parseInt(b));
                        }
                    }));
                    if (1 == c.options.allowDeleteRow)
                        k.push({
                            title: E('Delete selected rows'),
                            onclick: function () {
                                c.deleteRow(c.getSelectedRows().length ? void 0 : parseInt(b));
                            }
                        });
                    k.push({ type: 'line' });
                }
                if (e == 'cell' && 1 == c.options.allowComments) {
                    var p = c.records[g][f].element.getAttribute('title') || '';
                    k.push({
                        title: p ? E('Edit comments') : E('Add comments'),
                        icon: 'notes',
                        onclick: function () {
                            var q = z.getColumnNameFromCoords(f, g), r = prompt(E('Comments'), p);
                            if (r)
                                c.setComments(q, r);
                        }
                    });
                    if (p)
                        k.push({
                            title: E('Clear comments'),
                            onclick: function () {
                                var q = z.getColumnNameFromCoords(f, g);
                                c.setComments(q, '');
                            }
                        });
                    k.push({ type: 'line' });
                }
                if (n.allowExport)
                    k.push({
                        title: E('Save as'),
                        icon: 'save',
                        shortcut: m + ' + S',
                        onclick: function () {
                            c.download();
                        }
                    });
                if (n.about)
                    k.push({
                        title: E('About'),
                        icon: 'info',
                        onclick: function () {
                            !0 === n.about ? alert(ha().print()) : alert(n.about);
                        }
                    });
                return k;
            };
            return h;
        }(), ba = function () {
            var h = function (c) {
                c.showToolbar = function () {
                    h.show.call(c.parent);
                };
                c.hideToolbar = function () {
                    h.hide.call(c.parent);
                };
                c.refreshToolbar = function () {
                    h.update.call(c.parent, c);
                };
            };
            h.set = function (c) {
                this.toolbar.innerHTML = '';
                this.config.toolbar = h.get.call(this, c);
                h.show.call(this);
            };
            h.get = function (c) {
                c ||= this.config.toolbar;
                c ? Array.isArray(c) ? c = { items: c } : typeof c === 'function' && (c = c({ items: h.getDefault() })) : c = {};
                typeof c !== 'object' && (c = {});
                c.items || (c.items = h.getDefault());
                typeof c.responsive == 'undefined' && (c.responsive = !0, c.bottom = !1, c.maxWidth = this.element.offsetWidth);
                return c;
            };
            h.show = function () {
                if (!this.toolbar.innerHTML)
                    h.build.call(this);
                this.toolbar.style.display = '';
                this.element.classList.add('with-toolbar');
            };
            h.hide = function () {
                this.toolbar.style.display = 'none';
                this.element.classList.remove('with-toolbar');
            };
            h.update = function (c, a) {
                if (a = this.toolbarInstance)
                    if (a.update(c), a.options.responsive) {
                        var b = parseInt(c.content.style.maxWidth);
                        if (!b || this.config.fullscreen)
                            b = c.element.offsetWidth;
                        a.options.maxWidth = b;
                        a.refresh();
                    }
            };
            h.build = function () {
                for (var c = h.get.call(this), a = 0; a < c.items.length; a++)
                    if (c.items[a].type == 'select') {
                        if (!c.items[a].options && c.items[a].v) {
                            c.items[a].options = [];
                            for (var b = 0; b < c.items[a].v.length; b++)
                                c.items[a].options.push(c.items[a].v[b]);
                            c.items[a].k && (c.items[a].onchange = function (d, e, f, g) {
                                t.current.setStyle(t.current.getSelected(), f.k, g);
                            });
                        }
                    } else
                        c.items[a].type == 'color' ? (c.items[a].type = 'i', c.items[a].onclick = function (d, e, f) {
                            if (!f.color)
                                jSuites.color(f, {
                                    onchange: function (g, k) {
                                        t.current.setStyle(t.current.getSelected(), f.k, k);
                                    }
                                }).open();
                        }) : !c.items[a].onclick && c.items[a].k && (c.items[a].onclick = function () {
                            t.current.setStyle(t.current.getSelected(), this.k, this.v);
                        });
                (a = la.execute.call(this, 'toolbar', [c])) && (c = a[0]);
                this.toolbarInstance = jSuites.toolbar(this.toolbar, c);
                this.toolbarInstance.application = this;
                c = this.element.tabs.getActive();
                this.toolbarInstance.update(this.worksheets[c]);
            };
            h.getDefault = function () {
                return [
                    {
                        content: 'undo',
                        onclick: function () {
                            if (t.current)
                                t.current.undo();
                        }
                    },
                    {
                        content: 'redo',
                        onclick: function () {
                            if (t.current)
                                t.current.redo();
                        }
                    },
                    {
                        content: 'save',
                        onclick: function () {
                            if (t.current)
                                t.current.download();
                        }
                    },
                    { type: 'divisor' },
                    {
                        type: 'select',
                        width: '160px',
                        options: [
                            'Verdana',
                            'Arial',
                            'Courier New'
                        ],
                        render: function (c) {
                            return '<span style="font-family:' + c + '">' + c + '</span>';
                        },
                        onchange: function (c, a, b, d) {
                            if (t.current)
                                t.current.setStyle(t.current.getSelected(), 'font-family', d);
                        }
                    },
                    {
                        type: 'select',
                        width: '48px',
                        content: 'format_size',
                        options: [
                            'x-small',
                            'small',
                            'medium',
                            'large',
                            'x-large'
                        ],
                        render: function (c) {
                            return '<span style="font-size:' + c + '">' + c + '</span>';
                        },
                        onchange: function (c, a, b, d) {
                            if (t.current)
                                t.current.setStyle(t.current.getSelected(), 'font-size', d);
                        }
                    },
                    {
                        type: 'select',
                        columns: 4,
                        options: [
                            'format_align_left',
                            'format_align_center',
                            'format_align_right',
                            'format_align_justify'
                        ],
                        render: function (c) {
                            return '<i class="material-icons">' + c + '</i>';
                        },
                        onchange: function (c, a, b, d) {
                            if (t.current)
                                t.current.setStyle(t.current.getSelected(), 'text-align', d.split('_')[2]);
                        }
                    },
                    {
                        type: 'i',
                        content: 'format_bold',
                        k: 'font-weight',
                        v: 'bold'
                    },
                    {
                        type: 'color',
                        content: 'format_color_text',
                        k: 'color'
                    },
                    {
                        type: 'color',
                        content: 'format_color_fill',
                        k: 'background-color'
                    },
                    {
                        type: 'select',
                        content: 'height',
                        width: '50px',
                        options: [
                            'Normal',
                            'Medium',
                            'Large',
                            'Extra'
                        ],
                        onchange: function (c, a, b, d, e) {
                            c = t.current.table;
                            c.classList.remove('jss_row_medium');
                            c.classList.remove('jss_row_large');
                            c.classList.remove('jss_row_extra');
                            if (1 == e)
                                c.classList.add('jss_row_medium');
                            else if (2 == e)
                                c.classList.add('jss_row_large');
                            else if (3 == e)
                                c.classList.add('jss_row_extra');
                            t.current.refreshBorders();
                        }
                    },
                    {
                        content: 'fullscreen',
                        onclick: function (c, a, b) {
                            b.children[0].innerText == 'fullscreen' ? (t.current.fullscreen(!0), b.children[0].innerText = 'fullscreen_exit') : (t.current.fullscreen(!1), b.children[0].innerText = 'fullscreen');
                        },
                        tooltip: 'Toggle Fullscreen',
                        updateState: function (c, a, b, d) {
                            b.children[0].innerText = 1 == d.parent.config.fullscreen ? 'fullscreen_exit' : 'fullscreen';
                        }
                    },
                    {
                        type: 'select',
                        data: [
                            'border_all',
                            'border_outer',
                            'border_inner',
                            'border_horizontal',
                            'border_vertical',
                            'border_left',
                            'border_top',
                            'border_right',
                            'border_bottom',
                            'border_clear'
                        ],
                        columns: 5,
                        render: function (c) {
                            return '<i class="material-icons">' + c + '</i>';
                        },
                        right: !0,
                        onchange: function (c, a, b, d, e) {
                            if (c = t.current.getHighlighted()) {
                                b = a.thickness || 1;
                                a = a.color || 'black';
                                e = {};
                                for (var f = c[0], g = c[1], k = c[2], n = c[3], m = c[1]; m <= c[3]; m++)
                                    for (var p = c[0]; p <= c[2]; p++) {
                                        var q = z.getColumnNameFromCoords(p, m);
                                        e[q] || (e[q] = '');
                                        e[q] = d != 'border_left' && d != 'border_outer' || p != f ? (d == 'border_inner' || d == 'border_vertical') && p > f ? e[q] + ('border-left: ' + b + 'px solid ' + a + '; ') : d == 'border_all' ? e[q] + ('border-left: ' + b + 'px solid ' + a + '; ') : e[q] + 'border-left: ; ' : e[q] + ('border-left: ' + b + 'px solid ' + a + '; ');
                                        e[q] = d != 'border_all' && d != 'border_right' && d != 'border_outer' || p != k ? e[q] + 'border-right: ; ' : e[q] + ('border-right: ' + b + 'px solid ' + a + '; ');
                                        e[q] = d != 'border_top' && d != 'border_outer' || m != g ? (d == 'border_inner' || d == 'border_horizontal') && m > g ? e[q] + ('border-top: ' + b + 'px solid ' + a + '; ') : d == 'border_all' ? e[q] + ('border-top: ' + b + 'px solid ' + a + '; ') : e[q] + 'border-top: ; ' : e[q] + ('border-top: ' + b + 'px solid ' + a + '; ');
                                        e[q] = d != 'border_all' && d != 'border_bottom' && d != 'border_outer' || m != n ? e[q] + 'border-bottom: ; ' : e[q] + ('border-bottom: ' + b + 'px solid ' + a + '; ');
                                    }
                                if (Object.keys(e))
                                    t.current.setStyle(e, null, null, !0);
                            }
                        },
                        onload: function (c, a) {
                            var b = document.createElement('div'), d = document.createElement('div');
                            b.appendChild(d);
                            var e = jSuites.color(d, {
                                closeOnChange: !1,
                                onchange: function (f, g) {
                                    f.parentNode.children[1].style.color = g;
                                    a.color = g;
                                }
                            });
                            d = document.createElement('i');
                            d.classList.add('material-icons');
                            d.innerHTML = 'color_lens';
                            d.onclick = function () {
                                e.open();
                            };
                            b.appendChild(d);
                            c.children[1].appendChild(b);
                            d = document.createElement('div');
                            jSuites.picker(d, {
                                type: 'select',
                                data: [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5
                                ],
                                render: function (f) {
                                    return '<div style="height: ' + f + 'px; width: 50px; background-color: black;"></div>';
                                },
                                onchange: function (f, g, k, n) {
                                    a.thickness = n;
                                },
                                width: '80px'
                            });
                            c.children[1].appendChild(d);
                            d = document.createElement('div');
                            d.style.flex = '1';
                            c.children[1].appendChild(d);
                        }
                    },
                    {
                        content: 'search',
                        onclick: function (c, a, b) {
                            b.children[0].innerText == 'search' ? (ma.show.call(t.current), b.children[0].innerText = 'search_off') : (ma.hide.call(t.current), b.children[0].innerText = 'search');
                        },
                        tooltip: 'Toggle Search',
                        updateState: function (c, a, b, d) {
                            b.children[0].innerText = 1 == d.options.search ? 'search_off' : 'search';
                        }
                    }
                ];
            };
            return h;
        }(), da = function () {
            var h = function (c) {
                c.createWorksheet = function (a) {
                    return c.parent.createWorksheet(a);
                };
                c.deleteWorksheet = function (a) {
                    return c.parent.deleteWorksheet(a);
                };
                c.renameWorksheet = function (a, b) {
                    return c.parent.renameWorksheet(a, b);
                };
                c.moveWorksheet = function (a, b) {
                    return c.parent.moveWorksheet(a, b);
                };
                c.openWorksheet = function () {
                    return c.parent.openWorksheet(c.parent.getWorksheet(c));
                };
                c.getWorksheet = function (a) {
                    return c.parent.getWorksheet(a);
                };
                c.getWorksheetActive = function () {
                    return c.parent.getWorksheetActive();
                };
                c.getWorksheetName = function () {
                    return c.options.worksheetName.toUpperCase();
                };
            };
            h.nextName = function () {
                var c = 1, a, b = t.spreadsheet;
                if (b.length)
                    for (var d = 0; d < b.length; d++) {
                        var e = b[d].worksheets;
                        if (e.length)
                            for (var f = 0; f < e.length; f++)
                                e[f].options.worksheetName && (a = e[f].options.worksheetName.match(/(\d+)/)) && (a = parseInt(a[0]) + 1, a > c && (c = a));
                    }
                return c;
            };
            h.createWorksheet = function (c) {
                if (!J.call(this))
                    return !1;
                c ||= {};
                var a = this.worksheets.length, b = A.call(this, 'onbeforecreateworksheet', c, a);
                if (typeof b === 'object')
                    c = b;
                else if (!1 === b)
                    return !1;
                c.data || c.minDimensions || (c.minDimensions = [
                    8,
                    8
                ]);
                c.worksheetId || (c.worksheetId = jSuites.guid().substring(0, 8));
                c.worksheetName || (c.worksheetName = 'Sheet' + h.nextName());
                if (M(c.worksheetName))
                    jSuites.notification({
                        error: '1',
                        message: 'There is one existing worksheet with the same name.'
                    });
                else
                    b = ia.worksheet(this, c), b.onload(), F.call(b, 'createWorksheet', [c]), A.call(this, 'oncreateworksheet', b, c, a);
            };
            h.deleteWorksheet = function (c) {
                var a = this.worksheets[c];
                if (!J.call(this, a))
                    return !1;
                M(a.options.worksheetName, null);
                this.element.tabs.deleteElement(c);
                this.worksheets.splice(c, 1);
                F.call(a, 'deleteWorksheet', [c]);
                A.call(this, 'ondeleteworksheet', a, c);
            };
            h.renameWorksheet = function (c, a) {
                var b = this.worksheets[c];
                if (!J.call(this, b))
                    return !1;
                var d = b.options.worksheetName;
                if (d.toLowerCase() == a.toLowerCase())
                    return !1;
                a = a.replace(/[^0-9A-Za-z_\s^]+/gi, '');
                Number(a) == a && (a = 'Sheet' + Number(a));
                M(a) ? alert('It was not possible to rename worksheet due conflict name') : (M(d, null), this.element.tabs.rename(c, a), b.options.worksheetName = a, M(a, b), O.call(this, {
                    worksheet: b,
                    action: 'renameWorksheet',
                    index: c,
                    oldValue: d,
                    newValue: a
                }), F.call(b, 'renameWorksheet', {
                    worksheet: c,
                    newValue: a
                }), Ea.updateWorksheetName.call(b, d, a), R.updateWorksheetNames.call(b, d, a), A.call(this, 'onrenameworksheet', b, c, a, d));
            };
            h.updateWorksheet = function (c, a) {
                var b = this.worksheets;
                if (!J.call(this))
                    return !1;
                this.worksheets.splice(a, 0, b.splice(c, 1)[0]);
                O.call(this, {
                    worksheet: b[a],
                    action: 'moveWorksheet',
                    f: c,
                    t: a
                });
                F.call(b[a], 'moveWorksheet', {
                    f: c,
                    t: a
                });
                A.call(this, 'onmoveworksheet', b[a], c, a);
            };
            h.moveWorksheet = function (c, a) {
                this.element.tabs.move(c, a);
            };
            h.openWorksheet = function (c) {
                var a = this.worksheets[c];
                if (a && (!t.current || t.current != a)) {
                    if (this.element.tabs.getActive() != c)
                        this.element.tabs.open(c);
                    else
                        this.element.tabs.setBorder(c);
                    if (t.current)
                        t.current.resetSelection();
                    t.current = a;
                    t.current.refreshBorders();
                    N.call(t.current);
                    h.state.call(this, c);
                    ba.update.call(this, t.current);
                    A.call(this, 'onopenworksheet', a, c);
                }
            };
            h.getWorksheet = function (c) {
                if (c && typeof c == 'object') {
                    if (c = this.worksheets.indexOf(c), 0 <= c)
                        return c;
                } else
                    for (var a = 0; a < this.worksheets.length; a++)
                        if (c === this.worksheets[a].options.worksheetId)
                            return a;
                return !1;
            };
            h.getWorksheetActive = function () {
                return this.element.tabs.getActive();
            };
            h.getWorksheetInstance = function (c) {
                return c === '' || typeof c == 'string' ? (c = h.getWorksheet.call(this, c), !1 === c ? !1 : this.worksheets[c]) : this.worksheets[c];
            };
            h.state = function (c) {
                try {
                    if (typeof localStorage !== 'undefined') {
                        var a = this.config.cloud ? this.config.cloud : this.element.id;
                        if (a)
                            if (typeof c !== 'undefined')
                                localStorage.setItem('jss_' + a, c);
                            else {
                                var b = parseInt(localStorage.getItem('jss_' + a));
                                h.openWorksheet.call(this, b);
                            }
                    }
                } catch (d) {
                }
            };
            return h;
        }(), z = function () {
            var h = {};
            h.getCaretIndex = function (c) {
                var a = 0, b = (this.config.root ? this.config.root : window).getSelection();
                b && 0 !== b.rangeCount && (a = b.getRangeAt(0), b = a.cloneRange(), b.selectNodeContents(c), b.setEnd(a.endContainer, a.endOffset), a = b.toString().length);
                return a;
            };
            h.invert = function (c) {
                for (var a = [], b = Object.keys(c), d = 0; d < b.length; d++)
                    a[c[b[d]]] = b[d];
                return a;
            };
            h.getColumnName = function (c) {
                var a = '';
                701 < c ? (a += String.fromCharCode(64 + parseInt(c / 676)), a += String.fromCharCode(64 + parseInt(c % 676 / 26))) : 25 < c && (a += String.fromCharCode(64 + parseInt(c / 26)));
                return a += String.fromCharCode(65 + c % 26);
            };
            h.getColumnNameFromCoords = function (c, a) {
                return h.getColumnName(parseInt(c)) + (parseInt(a) + 1);
            };
            h.getCoordsFromColumnName = function (c) {
                var a = /^[a-zA-Z]+/.exec(c);
                if (a) {
                    for (var b = 0, d = 0; d < a[0].length; d++)
                        b += parseInt(a[0].charCodeAt(d) - 64) * Math.pow(26, a[0].length - 1 - d);
                    b--;
                    0 > b && (b = 0);
                    c = parseInt(/[0-9]+$/.exec(c)) || null;
                    0 < c && c--;
                    return [
                        b,
                        c
                    ];
                }
            };
            h.shiftFormula = R.shiftFormula;
            h.createFromTable = function (c, a) {
                if (c.tagName != 'TABLE')
                    console.log('Element is not a table');
                else {
                    a ||= {};
                    a.columns = [];
                    a.data = [];
                    var b = c.querySelectorAll('colgroup > col');
                    if (b.length)
                        for (var d = 0; d < b.length; d++) {
                            var e = b[d].style.width;
                            e ||= b[d].getAttribute('width');
                            e && (a.columns[d] || (a.columns[d] = {}), a.columns[d].width = e);
                        }
                    e = function (v) {
                        var x = v.getBoundingClientRect();
                        x = 50 < x.width ? x.width : 50;
                        a.columns[d] || (a.columns[d] = {});
                        v.getAttribute('data-celltype') ? a.columns[d].type = v.getAttribute('data-celltype') : a.columns[d].type = 'text';
                        a.columns[d].width = x + 'px';
                        a.columns[d].title = v.innerHTML;
                        a.columns[d].align = v.style.textAlign || (a.defaultColAlign ? a.defaultColAlign : 'center');
                        v.classList.contains('readOnly') && (a.columns[d].readOnly = !0);
                        if (x = v.getAttribute('name'))
                            a.columns[d].name = x;
                        if (x = v.getAttribute('id'))
                            a.columns[d].id = x;
                    };
                    var f = [], g = c.querySelectorAll(':scope > thead > tr');
                    if (g.length) {
                        for (b = 0; b < g.length - 1; b++) {
                            var k = [];
                            for (d = 0; d < g[b].children.length; d++) {
                                var n = {
                                    title: g[b].children[d].innerText,
                                    colspan: g[b].children[d].getAttribute('colspan') || 1
                                };
                                k.push(n);
                            }
                            f.push(k);
                        }
                        g = g[g.length - 1].children;
                        for (d = 0; d < g.length; d++)
                            e(g[d]);
                    }
                    n = 0;
                    var m = {}, p = {}, q = {}, r = {};
                    k = c.querySelectorAll(':scope > tr, :scope > tbody > tr');
                    for (b = 0; b < k.length; b++)
                        if (a.data[n] = [], 1 != a.parseTableFirstRowAsHeader || g.length || 0 != b) {
                            for (d = 0; d < k[b].children.length; d++) {
                                var u = k[b].children[d].getAttribute('data-formula');
                                u ? u.substr(0, 1) != '=' && (u = '=' + u) : u = k[b].children[d].innerHTML;
                                a.data[n].push(u);
                                u = z.getColumnNameFromCoords(d, b);
                                var l = k[b].children[d].getAttribute('class');
                                l && (r[u] = l);
                                l = parseInt(k[b].children[d].getAttribute('colspan')) || 0;
                                var w = parseInt(k[b].children[d].getAttribute('rowspan')) || 0;
                                if (l || w)
                                    m[u] = [
                                        l || 1,
                                        w || 1
                                    ];
                                if (l = k[b].children[d].style && k[b].children[d].style.display == 'none')
                                    k[b].children[d].style.display = '';
                                (l = k[b].children[d].getAttribute('style')) && (q[u] = l);
                                k[b].children[d].classList.contains('styleBold') && (q[u] = q[u] ? q[u] + '; font-weight:bold;' : 'font-weight:bold;');
                            }
                            k[b].style && k[b].style.height && (p[b] = { height: k[b].style.height });
                            n++;
                        } else
                            for (d = 0; d < k[b].children.length; d++)
                                e(k[b].children[d]);
                    0 < Object.keys(f).length && (a.nestedHeaders = f);
                    0 < Object.keys(q).length && (a.style = q);
                    0 < Object.keys(m).length && (a.mergeCells = m);
                    0 < Object.keys(p).length && (a.rows = p);
                    0 < Object.keys(r).length && (a.classes = r);
                    k = c.querySelectorAll('tfoot tr');
                    if (k.length) {
                        c = [];
                        for (b = 0; b < k.length; b++) {
                            e = [];
                            for (d = 0; d < k[b].children.length; d++)
                                e.push(k[b].children[d].innerText);
                            c.push(e);
                        }
                        0 < Object.keys(c).length && (a.footers = c);
                    }
                    if (1 == a.parseTableAutoCellType)
                        for (c = [], d = 0; d < a.columns.length; d++) {
                            f = e = !0;
                            c[d] = [];
                            for (b = 0; b < a.data.length; b++)
                                if (u = a.data[b][d], c[d][u] || (c[d][u] = 0), c[d][u]++, 25 < u.length && (e = !1), 10 == u.length) {
                                    if (u.substr(4, 1) != '-' || u.substr(7, 1) != '-')
                                        f = !1;
                                } else
                                    f = !1;
                            b = Object.keys(c[d]).length;
                            f ? a.columns[d].type = 'calendar' : 1 == e && 1 < b && b <= parseInt(0.1 * a.data.length) && (a.columns[d].type = 'dropdown', a.columns[d].source = Object.keys(c[d]));
                        }
                    return a;
                }
            };
            h.injectArray = function (c, a, b) {
                return c.slice(0, a).concat(b).concat(c.slice(a));
            };
            h.parseCSV = function (c, a) {
                a = a || ',';
                for (var b = 0, d = 0, e = [[]], f = 0, g = null, k = !1, n = !1, m = 0; m < c.length; m++)
                    if (e[d] || (e[d] = []), e[d][b] || (e[d][b] = ''), c[m] != '\r')
                        if (c[m] != '\n' && c[m] != a || 0 != k && 1 != n && g) {
                            c[m] == '"' && (k = !k);
                            if (null === g) {
                                if (g = k, 1 == g)
                                    continue;
                            } else if (!0 === g && !n && c[m] == '"') {
                                c[m + 1] == '"' ? (k = !0, e[d][b] += c[m], m++) : n = !0;
                                continue;
                            }
                            e[d][b] += c[m];
                        } else {
                            g = null;
                            n = k = !1;
                            if (e[d][b][0] == '"') {
                                var p = e[d][b].trim();
                                p[p.length - 1] == '"' && (e[d][b] = p.substr(1, p.length - 2));
                            }
                            c[m] == '\n' ? (b = 0, d++) : (b++, b > f && (f = b));
                        }
                for (c = 0; c < e.length; c++)
                    for (m = 0; m <= f; m++)
                        void 0 === e[c][m] && (e[c][m] = '');
                return e;
            };
            h.getTokensFromRange = R.getTokensFromRange;
            h.getRangeFromTokens = R.getRangeFromTokens;
            return h;
        }(), xa = function () {
            var h = {}, c = null, a = null, b = null, d = !1, e = null, f = null, g = null, k = function (l) {
                    function w(S) {
                        S.className && (S.classList.contains('jss_container') && (y = S), S.classList.contains('jss_worksheet') && (C = S), S.classList.contains('jss_ignore') && (G = S));
                        S.tagName == 'THEAD' ? v = 1 : S.tagName == 'TBODY' ? v = 2 : S.tagName == 'TFOOT' && (v = 3);
                        S.parentNode && !y && w(S.parentNode);
                    }
                    var v = null, x = null, y = null, C = null, G = null, D = null, K = null, L = null;
                    w(l.target);
                    if (null !== G)
                        return !1;
                    if (y)
                        if (l.target.classList.contains('jss_selectall'))
                            x = 'selectall';
                        else if (l.target.classList.contains('jss_corner'))
                            x = 'cloning';
                        else if (l.target.classList.contains('jss_row'))
                            x = 'row', D = parseInt(l.target.getAttribute('data-y'));
                        else if (l.target.parentNode && l.target.parentNode.classList.contains('jss_nested'))
                            D = l.target.getAttribute('data-nested-x'), K = l.target.getAttribute('data-nested-y'), null === D ? x = 'selectall' : (x = 'nested', D = parseInt(D), K = parseInt(K));
                        else if (l.target.parentNode && l.target.parentNode.classList.contains('jss_group_container'))
                            x = 'header-group';
                        else if (l.target.classList.contains('jss_group'))
                            x = 'header-group';
                        else if (l.target.parentNode && l.target.parentNode.classList.contains('jtabs-headers'))
                            x = 'tabs', D = Array.prototype.indexOf.call(l.target.parentNode.children, l.target);
                        else if (1 == v)
                            x = 'header', D = l.target.clientWidth - l.offsetX, l.target.classList.contains('jss_filters_icon') && 3 < D && 20 > D && (x = 'filters'), D = l.target.getAttribute('data-x');
                        else if (2 == v) {
                            if (l = n(l, y))
                                x = 'cell', D = l[0], K = l[1], L = l[2];
                        } else if (3 == v) {
                            if (D = l.target.getAttribute('data-x'), K = l.target.getAttribute('data-y'), D || K)
                                x = 'footer';
                        } else
                            v || jSuites.findElement(l.target, 'jtoolbar') && (x = 'toolbar');
                    return [
                        y,
                        C,
                        v,
                        x,
                        D,
                        K,
                        L
                    ];
                }, n = function (l, w) {
                    if (l.changedTouches && l.changedTouches[0]) {
                        var v = l.changedTouches[0].clientX;
                        l = l.changedTouches[0].clientY;
                    } else
                        v = l.clientX, l = l.clientY;
                    w = (w.spreadsheet.config.root ? w.spreadsheet.config.root : document).elementsFromPoint(v, l);
                    for (var x = 0; x < w.length; x++)
                        if (v = w[x].getAttribute('data-x'), l = w[x].getAttribute('data-y'), null != v && null != l)
                            return v = parseInt(v), l = parseInt(l), [
                                v,
                                l,
                                w[x]
                            ];
                    return !1;
                }, m = function (l) {
                    var w = k(l);
                    if (!1 === w)
                        return !1;
                    if (w[0])
                        if (w[1]) {
                            if (t.current != w[1].jexcel) {
                                if (t.current)
                                    t.current.resetSelection();
                                t.current = w[1].jexcel;
                            }
                        } else
                            l = w[0].tabs.getActive(), 0 <= l && (t.current = w[0].spreadsheet.worksheets[l]);
                    else
                        t.current && !jSuites.findElement(l.target, 'jss_object') && (t.current.resetSelection(!0), t.current = null);
                    return w;
                };
            h.input = function (l) {
                if (l.target.tagName == 'DIV' && l.target.classList.contains('jss_formula')) {
                    var w = null;
                    t.current ? w = t.current : l.target.getAttribute('data-current') && (w = M(l.target.getAttribute('data-current')));
                    if (w)
                        U.parse.call(w, l.target);
                }
            };
            h.keydown = function (l) {
                if (t.current) {
                    if (l.target.tagName == 'DIV' && l.target.classList.contains('jss_formula'))
                        U.onkeydown.call(t.current, l);
                    if (27 == l.which) {
                        if (t.current.edition)
                            return t.current.closeEditor(t.current.edition, !1), l.preventDefault(), !1;
                        if (na.event)
                            return na.cancel.call(t.current, l), l.preventDefault(), !1;
                        if (fa.event)
                            return fa.cancel.call(t.current, l), !1;
                        if (1 == Y.isVisible())
                            return Y.close.call(t.current, !1), l.preventDefault(), !1;
                    }
                    if (!l.target.classList.contains('jss_object'))
                        if (l.target.classList.contains('jss_filters_search')) {
                            var w = l.target;
                            e && clearTimeout(e);
                            e = setTimeout(function () {
                                Y.search.call(t.current, w.value);
                                e = null;
                            }, 500);
                        } else if (l.target.classList.contains('jss_search'))
                            w = l.target, e && clearTimeout(e), e = setTimeout(function () {
                                t.current.search(w.value);
                                e = null;
                            }, 400);
                        else if (t.current.edition) {
                            var v = t.current.edition.getAttribute('data-x');
                            if (13 == l.which)
                                if (t.current.options.columns[v].type == 'calendar')
                                    t.current.closeEditor(t.current.edition, !0);
                                else {
                                    if (t.current.options.columns[v].type != 'dropdown' && t.current.options.columns[v].type != 'html' && t.current.options.columns[v].type != 'notes')
                                        if (l.altKey) {
                                            if (!t.current.parent.input.classList.contains('jss_nowrap'))
                                                document.execCommand('insertHTML', !1, '<br/>\n');
                                        } else
                                            t.current.closeEditor(t.current.edition, !0), t.current.down(), l.preventDefault();
                                }
                            else
                                9 == l.which && (t.current.closeEditor(t.current.edition, !0), t.current.right(), l.preventDefault());
                        } else if (t.current.selectedCell)
                            if (33 == l.which)
                                if (0 < t.current.options.pagination)
                                    ra.pageUp.call(t.current);
                                else
                                    B.pageUp.call(t.current);
                            else if (34 == l.which)
                                if (0 < t.current.options.pagination)
                                    ra.pageDown.call(t.current);
                                else
                                    B.pageDown.call(t.current);
                            else if (37 == l.which)
                                t.current.left(l.shiftKey, l.ctrlKey), l.preventDefault();
                            else if (39 == l.which)
                                t.current.right(l.shiftKey, l.ctrlKey), l.preventDefault();
                            else if (38 == l.which)
                                t.current.up(l.shiftKey, l.ctrlKey), l.preventDefault();
                            else if (40 == l.which)
                                t.current.down(l.shiftKey, l.ctrlKey), l.preventDefault();
                            else if (36 == l.which)
                                t.current.first(l.shiftKey, l.ctrlKey), l.preventDefault();
                            else if (35 == l.which)
                                t.current.last(l.shiftKey, l.ctrlKey), l.preventDefault();
                            else if (32 == l.which)
                                t.current.setCheckRadioValue(), l.preventDefault();
                            else if (46 == l.which || 8 == l.which) {
                                if (t.current.isEditable())
                                    t.current.setValue(t.current.getSelected(!1, !0), '');
                            } else if (13 == l.which) {
                                if (l.shiftKey)
                                    t.current.up();
                                else {
                                    if (1 == t.current.options.allowManualInsertRow && t.current.selectedCell[1] == (t.current.results ? t.current.results[t.current.results.length - 1] : t.current.rows.length - 1))
                                        t.current.insertRow();
                                    if (t.current.selectedCell)
                                        t.current.down();
                                }
                                l.preventDefault();
                            } else if (9 == l.which) {
                                if (l.shiftKey)
                                    t.current.left();
                                else
                                    v = t.current.selectedCell[0], t.current.right(), 1 == t.current.options.allowInsertColumn && 1 == t.current.options.allowManualInsertColumn && t.current.selectedCell[0] == v && (t.current.insertColumn(), t.current.right());
                                l.preventDefault();
                            } else if ((l.ctrlKey || l.metaKey) && !l.shiftKey)
                                if (65 == l.which)
                                    t.current.selectAll(), l.preventDefault();
                                else if (83 == l.which)
                                    t.current.download(), l.preventDefault();
                                else if (89 == l.which)
                                    t.current.parent.redo(), l.preventDefault();
                                else if (90 == l.which)
                                    t.current.parent.undo(), l.preventDefault();
                                else if (67 == l.which)
                                    t.current.copy(), l.preventDefault();
                                else if (88 == l.which)
                                    t.current.cut(), l.preventDefault();
                                else if (86 == l.which)
                                    h.paste(l);
                                else
                                    189 == l.which && (1 == t.current.options.allowDeleteRow && b == 'row' ? (t.current.deleteRow(), l.preventDefault()) : 1 == t.current.options.allowDeleteColumn && b == 'header' && (t.current.deleteColumn(), l.preventDefault()));
                            else if (t.current.selectedCell && t.current.isEditable()) {
                                v = t.current.selectedCell[1];
                                var x = t.current.selectedCell[0];
                                if (t.current.options.columns[x].type != 'readonly')
                                    if (32 == l.keyCode)
                                        if (t.current.options.columns[x].type == 'checkbox' || t.current.options.columns[x].type == 'radio')
                                            l.preventDefault();
                                        else
                                            t.current.openEditor(t.current.records[v][x].element, !0, l);
                                    else if (113 == l.keyCode)
                                        t.current.openEditor(t.current.records[v][x].element, !1, l);
                                    else if (!(1 != l.key.length && l.key != 'Process' || l.altKey || l.ctrlKey) && t.current.records[v])
                                        t.current.openEditor(t.current.records[v][x].element, !0, l);
                            }
                }
            };
            var p = function (l, w, v, x, y, C) {
                if (1 == t.current.parent.input.classList.contains('jss_formula') && U.update.call(t.current, l, w, v, x, y))
                    return !1;
                if (t.current.edition)
                    t.current.closeEditor(t.current.edition, !0);
                else if (b && b !== C)
                    return !1;
                if (U.current)
                    U.range.call(t.current, l, w, v, x, y);
                else
                    ua.set.call(t.current, l, w, v, x, y);
            };
            h.mousedown = function (l) {
                l = l || window.event;
                var w = l.buttons ? l.buttons : l.button ? l.button : l.which;
                if (t.current) {
                    if (1 == Y.isVisible() && !jSuites.findElement(l.target, 'jss_filters'))
                        Y.close.call(t.current, !1);
                    if (t.current.edition) {
                        if (jSuites.findElement(l.target, 'jss_input'))
                            return !1;
                    } else if (jSuites.findElement(l.target, 'jss_object'))
                        return !1;
                }
                var v = m(l);
                if (!1 === v)
                    return !1;
                g = v;
                if (1 < w)
                    if (v[3] == 'header') {
                        if (t.current.isSelected(v[4], null))
                            return !1;
                    } else if (v[3] == 'row') {
                        if (t.current.isSelected(null, v[4]))
                            return !1;
                    } else if (v[3] == 'cell' && t.current.isSelected(v[4], v[5]))
                        return !1;
                if (t.current) {
                    if (v[3] == 'cloning')
                        t.current.isEditable() && (fa.event = !0);
                    else if (v[3] == 'filters')
                        Y.open.call(t.current, v[4]);
                    else {
                        if (1 == v[2])
                            if (1 == t.current.options.columnDrag && 6 > l.target.offsetHeight - l.offsetY)
                                na.start.call(t.current, l);
                            else if (1 == t.current.options.columnResize && 6 > l.target.offsetWidth - l.offsetX)
                                sa.start.call(t.current, l);
                            else {
                                w = t.current.options.columns.length - 1;
                                var x = t.current.options.data.length - 1;
                                if (v[3] == 'selectall')
                                    p(0, 0, w, x, l, v[3]), a = c = 0;
                                else if (v[3] == 'nested') {
                                    var y = ka.range.call(t.current, v[5])[v[4]];
                                    y[1] > w && (y[1] = w);
                                    p(y[0], 0, y[1], x, l, v[3]);
                                    c = y[0];
                                    a = 0;
                                } else
                                    (l.shiftKey || l.ctrlKey) && null != c && null != a ? p(c, 0, v[4], x, l, v[3]) : (v[3] == 'header' && c == v[4] && 1 == t.current.options.allowRenameColumn && (f = setTimeout(function () {
                                        t.current.setHeader(v[4]);
                                    }, 800)), p(v[4], 0, v[4], x, l, v[3]), c = v[4], a = 0);
                            }
                        if (2 == v[2])
                            if (v[3] == 'row')
                                if (1 == t.current.options.rowDrag && 6 > l.target.offsetWidth - l.offsetX)
                                    na.start.call(t.current, l);
                                else if (1 == t.current.options.rowResize && 6 > l.target.offsetHeight - l.offsetY)
                                    sa.start.call(t.current, l);
                                else
                                    w = t.current.options.columns.length - 1, x = parseInt(v[4]), (l.shiftKey || l.ctrlKey) && null != c && null != a ? p(0, a, w, x, l, v[3]) : (p(0, x, w, x, l, v[3]), c = 0, a = x);
                            else if (v[3] == 'cell') {
                                w = parseInt(v[4]);
                                x = parseInt(v[5]);
                                if (!t.current.edition && (y = t.current.options.columns[v[4]].type, l.target.tagName == 'A' && (y == 'email' || y == 'url') && l.target.parentNode.classList.contains('jss_cursor'))) {
                                    var C = position[2].innerText;
                                    y == 'email' && (C = 'mailto:' + C);
                                    window.open(C, '_blank');
                                }
                                (l.shiftKey || l.ctrlKey) && null != c && null != a ? p(c, a, w, x, l, v[3]) : (p(w, x, w, x, l, v[3]), c = w, a = x);
                            }
                    }
                    b = v[3];
                    if (typeof v[3] !== 'undefined')
                        A.call(t.current.parent, 'onclick', t.current, v[3], v[4], v[5]);
                    d = !0;
                } else
                    d = !1;
            };
            h.mouseup = function (l) {
                if (t.current)
                    if (na.event)
                        na.end.call(t.current, l);
                    else if (sa.event)
                        sa.end.call(t.current, l);
                    else if (fa.event)
                        fa.end.call(t.current, l);
                    else if (l.target.classList.contains('jss_filters_apply'))
                        Y.close.call(t.current, !0);
                    else if (t.current.edition && l.target.classList.contains('jclose') && 50 > l.target.clientWidth - l.offsetX && 50 > l.offsetY)
                        Z.close.call(t.current, null, !0);
                    else
                        l.target.classList.contains('jss_page') && (l = l.target.innerText == '<' ? 0 : l.target.innerText == '>' ? l.target.getAttribute('title') - 1 : l.target.innerText - 1, ra.set.call(t.current, parseInt(l)));
                f && (clearTimeout(f), f = null);
                d = b = !1;
                if (U.current)
                    U.close.call(t.current);
            };
            h.mousemove = function (l) {
                l = l || window.event;
                if (t.current) {
                    var w = l.target.getAttribute('data-x'), v = l.target.getAttribute('data-y');
                    if (1 == d)
                        if (na.event)
                            na.update.call(t.current, l);
                        else if (sa.event)
                            sa.update.call(t.current, l);
                        else {
                            if (Ma.event)
                                Ma.update.call(t.current, l);
                        }
                    else {
                        var x = l.target.getBoundingClientRect();
                        t.current.cursor && (t.current.cursor.style.cursor = '', t.current.cursor = null);
                        1 == t.current.options.editable && (w || v) && (1 == t.current.options.rowResize && l.target && w && !v && 5 > x.width - (l.clientX - x.left) ? (t.current.cursor = l.target, t.current.cursor.style.cursor = 'col-resize') : 1 == t.current.options.columnResize && l.target && !w && v && 5 > x.height - (l.clientY - x.top) ? (t.current.cursor = l.target, t.current.cursor.style.cursor = 'row-resize') : 1 == t.current.options.rowDrag && l.target && !w && v && 5 > x.width - (l.clientX - x.left) ? (t.current.cursor = l.target, t.current.cursor.style.cursor = 'move') : 1 == t.current.options.columnDrag && l.target && w && !v && 5 > x.height - (l.clientY - x.top) && (t.current.cursor = l.target, t.current.cursor.style.cursor = 'move'));
                    }
                }
            };
            h.mouseover = function (l) {
                l = l || window.event;
                var w = !1;
                if (t.current && 1 == d) {
                    var v = k(l);
                    if (v[0]) {
                        if (v[1] && t.current != v[1].jexcel && t.current)
                            return !1;
                        if (!na.event && !sa.event)
                            if (fa.event) {
                                var x = l.target.getAttribute('data-x'), y = l.target.getAttribute('data-y');
                                t.current.isSelected(x, y) || null === x || null === y || (fa.call(t.current, x, y), w = !0);
                            } else
                                1 == v[2] && (x = c, v[3] == 'header' && (x = l.target.getAttribute('data-x')), y = t.current.options.data.length - 1, p(c, 0, x, y, l, v[3])), 2 == v[2] && (v[3] == 'row' ? (x = t.current.options.columns.length - 1, y = parseInt(l.target.getAttribute('data-y')), p(0, a, x, y, l, v[3])) : v[3] == 'cell' && (x = l.target.getAttribute('data-x'), y = l.target.getAttribute('data-y'), x && y && (p(c, a, x, y, l, v[3]), w = !0)));
                    }
                }
                1 == w && !f && B.limited.call(t.current) ? f = setTimeout(function () {
                    var C = t.current.content.getBoundingClientRect();
                    if (l.changedTouches && l.changedTouches[0])
                        var G = l.changedTouches[0].clientX, D = l.changedTouches[0].clientY;
                    else
                        G = l.clientX, D = l.clientY;
                    if (50 > C.height - (D - C.top))
                        B.pageDown.call(t.current, 1, null, l);
                    else if (80 > D - C.top)
                        B.pageUp.call(t.current, 1, null, l);
                    if (50 > C.width - (G - C.left))
                        B.pageRight.call(t.current, 1, null, l);
                    else if (80 > G - C.left)
                        B.pageLeft.call(t.current, 1, null, l);
                    f = null;
                }, 100) : f && (clearTimeout(f), f = null);
            };
            h.dblclick = function (l) {
                if (t.current)
                    if (l.target.classList.contains('jss_corner'))
                        fa.execute.call(t.current, !1);
                    else {
                        var w = k(l);
                        if (1 == w[2]) {
                            if (1 == t.current.options.columnSorting && (l = l.target.getAttribute('data-x')))
                                t.current.orderBy(l);
                        } else if (2 == w[2] && t.current.isEditable() && !t.current.edition && w[6])
                            t.current.openEditor(w[6]);
                    }
            };
            h.paste = function (l) {
                if (t.current && t.current.selectedCell && !t.current.edition) {
                    var w = l.clipboardData || window.clipboardData;
                    if (w && (t.current.paste(t.current.selectedCell[0], t.current.selectedCell[1], w.getData('text')), l))
                        l.preventDefault();
                }
            };
            h.contextmenu = function (l) {
                var w = m(l);
                !1 !== w && (w[1] || (w = g), t.current && !t.current.edition && (w = Array.prototype.slice.call(w, 3), Oa.open.call(t.current, l, w)));
            };
            var q = null, r = null, u = null;
            h.touchstart = function (l) {
                var w = k(l);
                if (w[0]) {
                    if (w[1] && t.current != w[1].jexcel) {
                        if (t.current)
                            t.current.resetSelection();
                        t.current = w[1].jexcel;
                    }
                } else
                    t.current && (t.current.resetSelection(), t.current = null);
                if (t.current && !t.current.edition) {
                    var v = w[4];
                    w = w[5];
                    r = l.touches[0];
                    q = l.touches.length;
                    u = [
                        v,
                        w
                    ];
                    if (null !== v && null !== w) {
                        t.current.updateSelectionFromCoords(v, w, v, w);
                        var x = l.target;
                        f = setTimeout(function () {
                            t.current.openEditor(x, !1, l);
                            f = null;
                        }, 250);
                    }
                }
            };
            h.touchmove = function (l) {
                f && (clearTimeout(f), f = null);
                if (t.current) {
                    l = l.changedTouches[0];
                    if (r)
                        if (1 < q) {
                            var w = document.elementFromPoint(l.pageX, l.pageY), v = w.getAttribute('data-x');
                            w = w.getAttribute('data-y');
                            if (null !== v && null !== w)
                                t.current.updateSelectionFromCoords(u[0], u[1], v, w);
                        } else
                            t.current.scrollY.scrollTop += -1 * (l.clientY - r.clientY), t.current.scrollX.scrollLeft += -1 * (l.clientX - r.clientX);
                    r = l;
                }
            };
            h.touchend = function (l) {
                f && (clearTimeout(f), f = null);
                u = r = q = null;
            };
            h.resize = function () {
                if (t.current && 1 == t.current.parent.config.fullscreen)
                    B.refresh.call(t.current);
            };
            return h;
        }(), $a = function () {
            if (Array.isArray(this.queue) && 0 < this.queue.length)
                for (var h; h = this.queue.shift();)
                    h[0].updateCell(h[1], h[2], I.call(h[0], h[1], h[2]), !0);
        }, t = function (h, c, a) {
            c ||= {};
            if (c.cloud && !a)
                if (typeof c.plugins.cloud == 'function')
                    c.plugins.cloud.load(c, function (f) {
                        jspreadsheet(h, f, !0);
                    });
                else
                    console.error('Cloud plugin not loaded.');
            else {
                if (h.spreadsheet)
                    b = h.spreadsheet, za.set.call(b, c);
                else
                    var b = ia.spreadsheet(h, c);
                b.processing = !0;
                if (1 == b.config.loadingSpin)
                    jSuites.loading.show();
                jSuites.ajax.oncomplete[b.name] = function () {
                    for (var f = 0; f < b.worksheets.length; f++)
                        b.worksheets[f].onload();
                    b.processing = !1;
                    $a.call(b);
                    if (b.config.toolbar)
                        ba.show.call(b);
                    for (f = 0; f < b.worksheets.length; f++)
                        W.refresh.call(b.worksheets[f]);
                    if (typeof b.config.onload == 'function')
                        b.config.onload(b);
                    da.state.call(b);
                    jSuites.loading.hide();
                };
                Array.isArray(c.worksheets) && (c = c.worksheets);
                if (Array.isArray(c)) {
                    a = null;
                    for (var d = [], e = 0; e < c.length; e++)
                        a = ia.worksheet(b, c[e]), d.push(a);
                } else
                    d = ia.worksheet(b, c);
                jSuites.ajax.pending(b.name) || (jSuites.ajax.oncomplete[b.name](), jSuites.ajax.oncomplete[b.name] = null);
                return d;
            }
        };
    t.license = null;
    t.setLicense = function (h) {
        t.license = h;
    };
    t.spreadsheet = [];
    t.picker = U;
    t.setDictionary = function (h) {
        jSuites.setDictionary(h);
    };
    t.extensions = {};
    t.setExtensions = function (h) {
        for (var c = Object.keys(h), a = 0; a < c.length; a++)
            if (typeof h[c[a]] === 'function' && (t[c[a]] = h[c[a]], t.extensions[c[a]] = h[c[a]], t.license && typeof t[c[a]].license == 'function'))
                t[c[a]].license.call(t, t.license);
    };
    t.destroy = function (h, c) {
        if (h.spreadsheet) {
            if (c)
                ia.unbind(h);
            c = t.spreadsheet.indexOf(h.spreadsheet);
            t.spreadsheet.splice(c, 1);
            h.spreadsheet = null;
            h.jexcel = null;
            h.innerHTML = '';
            h.classList.remove('jtabs');
            h.classList.remove('jss_container');
        }
    };
    t.version = ha;
    t.helpers = z;
    t.events = xa;
    typeof formula !== 'undefined' && (t.formula = formula);
    t.editors = function () {
        var h = {}, c = function (a, b) {
                return 1 == a[b] || a.options && 1 == a.options[b] ? !0 : a[b] == 'true' || a.options && a.options[b] == 'true' ? !0 : !1;
            };
        h.createEditor = function (a, b, d, e) {
            e.parent.input.setAttribute('contentEditable', !1);
            a == 'input' ? (a = document.createElement('input'), a.type = 'text', a.value = d) : a = document.createElement('div');
            a.style.width = b.offsetWidth - 2 + 'px';
            a.style.height = b.offsetHeight - 1 + 'px';
            e.parent.input.appendChild(a);
            return a;
        };
        h.createDialog = function (a, b, d, e, f, g) {
            a = h.createEditor('div', a, b, f);
            a.classList.add('jss_dialog');
            a.classList.add('jclose');
            800 > window.innerWidth ? (f.parent.input.style.top = '0px', f.parent.input.style.left = '0px') : (b = f.parent.input.getBoundingClientRect(), window.innerHeight < b.bottom && (f.parent.input.style.marginTop = -f.parent.input.offsetHeight));
            return a;
        };
        h.general = function () {
            var a = {}, b = function (e) {
                    e = ('' + e)[0];
                    return e == '=' || e == '#' ? !0 : !1;
                }, d = function (e) {
                    if (e.format || e.mask || e.locale) {
                        var f = {};
                        e.mask ? f.mask = e.mask : e.format ? f.mask = e.format : (f.locale = e.locale, f.options = e.options);
                        e.decimal && (f.options || (f.options = {}), f.options = { decimal: e.decimal });
                        return f;
                    }
                    return null;
                };
            a.updateCell = function (e, f, g, k, n, m) {
                g = parseInt(g);
                k = parseInt(k);
                if (e) {
                    var p = d(m), q = null;
                    f === '' || b(f) || typeof f === 'number' || (p ? (p = jSuites.mask.extract(f, p, !0)) && p.value !== '' && (q = p.value) : 1 == (!1 === n.options.autoCasting || !1 === m.autoCasting ? !1 : !0) && (m.type == 'number' || m.type == 'numeric' || m.type == 'percent' ? (p = jSuites.mask.extract(f, m, !0)) && p.value !== '' && (q = p.value) : jSuites.isNumeric(Number(f)) && (q = Number(f))));
                    null !== q && (f = q);
                    f = a.parseValue(g, k, f, n, m, e);
                    f instanceof Element || f instanceof HTMLDocument ? (e.innerHTML = '', e.appendChild(f)) : 1 == n.parent.config.stripHTML ? e.innerText = f : e.innerHTML = f;
                    if (null !== q)
                        return q;
                }
            };
            a.createCell = a.updateCell;
            a.openEditor = function (e, f, g, k, n, m) {
                var p = n.parent.input;
                p.onblur = function () {
                    if (!p.classList.contains('jss_formula'))
                        n.closeEditor(e, !0);
                };
                if (m.type == 'number' || m.type == 'numeric' || m.type == 'percent')
                    p.classList.add('jss_nowrap'), b(f) || m.inputmode || (m.inputmode = 'decimal');
                g = null;
                if (!b(f)) {
                    if (m.inputmode)
                        p.setAttribute('inputmode', m.inputmode);
                    if (g = d(m)) {
                        if (!m.disabledMaskOnEdition)
                            if (m.mask)
                                m = m.mask.split(';'), p.setAttribute('data-mask', m[0]);
                            else if (m.locale)
                                p.setAttribute('data-locale', m.locale);
                        g.input = n.parent.input;
                        n.parent.input.mask = g;
                        jSuites.mask.render(f, g, !1);
                    } else
                        f && m.type == 'percent' && (f *= 100);
                }
                g || (p.innerText = f, jSuites.focus(n.parent.input));
            };
            a.closeEditor = function (e, f, g, k, n, m) {
                e = n.parent.input;
                f = f ? e.innerText : '';
                b(f) ? f = f.replace(/(\r\n|\n|\r)/gm, '') : m.type == 'percent' && (f += '%', e.classList.remove('jss_percent'));
                return f;
            };
            a.parseValue = function (e, f, g, k, n, m) {
                b(g) && 1 == k.parent.config.parseFormulas && (g = k.executeFormula(g, e, f));
                if (!(g instanceof Element || g instanceof HTMLDocument) && n && !b(g) && (f = d(n))) {
                    e = jSuites.mask.render(g, f, !0);
                    if (m && f.mask && (f = f.mask.split(';'), f[1])) {
                        if (f[1].match(new RegExp('\\[Red\\]', 'gi')))
                            if (0 > g)
                                m.classList.add('red');
                            else
                                m.classList.remove('red');
                        f[1].match(new RegExp('\\(', 'gi')) && 0 > g && (e = '(' + e + ')');
                    }
                    e && (g = e);
                }
                return g;
            };
            a.get = function (e, f) {
                var g;
                return (g = d(e)) ? jSuites.mask.render(f, g, !0) : e.type == 'percent' ? 100 * parseFloat(value) : f;
            };
            return a;
        }();
        h.text = h.general;
        h.number = h.general;
        h.numeric = h.general;
        h.percent = h.general;
        h.notes = function () {
            var a = {}, b = null;
            a.updateCell = function (d, e, f, g, k, n) {
                d && (f = document.createElement('div'), f.classList.add('jss_notes'), 1 == k.parent.config.stripHTML ? f.innerText = e : f.innerHTML = e, d.innerHTML = '', d.appendChild(f));
            };
            a.createCell = a.updateCell;
            a.openEditor = function (d, e, f, g, k, n) {
                var m = n && n.options ? n.options : {};
                m.focus = !0;
                m.value = e;
                m.border = !1;
                m.height = '145px';
                m.toolbar = !1;
                b = h.createDialog(d, e, f, g, k, n);
                b = jSuites.editor(b, m);
            };
            a.closeEditor = function (d, e, f, g, k, n) {
                return e ? b.getData() : '';
            };
            return a;
        }();
        h.dropdown = function () {
            var a = {};
            a.createCell = function (b, d, e, f, g, k) {
                if (k.render == 'tag')
                    b.classList.add('jss_dropdown_tags');
                else
                    b.classList.add('jss_dropdown');
                if (b = a.updateCell(b, d, e, f, g, k))
                    return b;
            };
            a.destroyCell = function (b) {
                b.classList.remove('jss_dropdown');
            };
            a.updateCell = function (b, d, e, f, g, k) {
                if (b) {
                    var n = a.getItem(b, d, e, f, g, k);
                    n ? b.innerHTML = n : d ? (d = a.fromLabel(b, d, e, f, g, k), d.length ? (n = a.getItem(b, d, e, f, g, k), b.innerHTML = n) : b.innerHTML = '') : b.innerHTML = '';
                    return d;
                }
            };
            a.openEditor = function (b, d, e, f, g, k) {
                var n = h.createEditor('div', b, d, g), m = k.delimiter || ';';
                k = Object.create(k);
                k.options || (k.options = {});
                typeof k.filter == 'function' && (k.source = k.filter(g.el, b, e, f, k.source));
                typeof k.filterOptions == 'function' && (k = k.filterOptions(g, b, e, f, d, k));
                e = k.options;
                k.source && (e.data = JSON.parse(JSON.stringify(k.source)));
                c(k, 'multiple') && (e.multiple = !0);
                c(k, 'autocomplete') && (e.autocomplete = !0);
                e.format = !0;
                e.opened = !0;
                e.width = b.offsetWidth - 2;
                e.onclose = function () {
                    g.closeEditor(b, !0);
                };
                c(k, 'multiple') ? d && (e.value = ('' + d).split(m)) : e.value = d;
                jSuites.dropdown(n, e);
            };
            a.closeEditor = function (b, d, e, f, g, k) {
                for (var n = g.parent.input.children[0], m = k.delimiter || ';', p = n.dropdown.getText(!0), q = n.dropdown.getValue(!0), r = 0; r < q.length; r++)
                    if (!1 === a.getItem(b, q[r], e, f, g, k))
                        k.source.push({
                            id: q[r],
                            name: p[r]
                        });
                n.dropdown.close(!0);
                if (d)
                    return q.join(m);
            };
            a.fromLabel = function (b, d, e, f, g, k) {
                b = k.delimiter || ';';
                e = [];
                f = [];
                Array.isArray(d) || (d = ('' + d).split(b));
                for (g = 0; g < d.length; g++)
                    f[d[g].trim()] = !0;
                d = Object.keys(f);
                !c(k, 'multiple') && 1 < Object.keys(d).length && (f = [], f[d[0]] = !0);
                for (d = 0; d < k.source.length; d++)
                    if (f[k.source[d].name])
                        e.push(k.source[d].id);
                return e.join(b);
            };
            a.getItem = function (b, d, e, f, g, k) {
                f = k.delimiter || ';';
                b = [];
                e = [];
                Array.isArray(d) || (d = ('' + d).split(f));
                for (f = 0; f < d.length; f++)
                    e[d[f].trim()] = !0;
                f = Object.keys(e);
                !c(k, 'multiple') && 1 < Object.keys(f).length && (d = [], d[f[0]] = !0, e = d);
                if (k.source && typeof k.source[0] !== 'object')
                    for (d = 0; d < k.source.length; d++)
                        f = k.source[d], k.source[d] = {
                            id: f,
                            name: f
                        };
                for (d = 0; d < k.source.length; d++)
                    if (typeof e[k.source[d].id] !== 'undefined')
                        b.push(k.render == 'color' ? k.source[d].color : k.render == 'image' ? k.source[d].image : k.source[d].name);
                if (b.length) {
                    if (typeof k.render !== 'undefined') {
                        for (d = 0; d < b.length; d++)
                            e = d, f = b[d], f = k.render == 'color' ? '<div class=\'jss_dropdown_icon\' style=\'background-color: ' + f + '\'></div>' : k.render == 'image' ? '<div class=\'jss_dropdown_icon\' style=\'background-color: ' + f + '\'></div>' : k.render == 'tag' ? '<div class=\'jss_dropdown_tag\' style=\'background-color: ' + (k.source[d].color || 'orange') + '\'>' + f + '</div>' : void 0, b[e] = f;
                        return b.join('');
                    }
                    for (d = 0; d < b.length; d++)
                        b[d] = ('' + b[d]).replace('<', '&lt;');
                    return b.join('; ');
                }
                return !1;
            };
            a.get = function (b, d) {
                for (var e = 0; e < b.source.length; e++)
                    if (b.source[e].id == d)
                        return b.render == 'color' ? b.source[e].color : b.render == 'image' ? b.source[e].image : b.source[e].name;
            };
            return a;
        }();
        h.autocomplete = h.dropdown;
        h.calendar = function () {
            var a = {}, b = null;
            a.updateCell = function (d, e, f, g, k, n) {
                if (d) {
                    f = e;
                    n = a.getFormat(n);
                    0 < e && Number(e) == e && (f = jSuites.calendar.numToDate(e));
                    g = '' + e;
                    g.substr(4, 1) == '-' && g.substr(7, 1) == '-' ? g = !0 : (g = g.split('-'), g = 4 == g[0].length && g[0] == Number(g[0]) && 2 == g[1].length && g[1] == Number(g[1]) ? !0 : !1);
                    g || (g = jSuites.calendar.extractDateFromString(e, n)) && (f = g);
                    if (f = jSuites.calendar.getDateString(f, n))
                        return d.innerText = f, e;
                    d.innerText = '';
                    return '';
                }
            };
            a.createCell = a.updateCell;
            a.openEditor = function (d, e, f, g, k, n) {
                n = Object.create(n);
                typeof n.filterOptions == 'function' && (n = n.filterOptions(k, d, f, g, e, n));
                f = n.options || {};
                f.opened = !0;
                f.onclose = function (m, p) {
                    k.closeEditor(d, !0);
                };
                typeof n.timepicker !== 'undefined' && (f.time = c(n, 'timepicker') ? !0 : !1);
                typeof f.readonly !== 'undefined' && (f.readonly = f.readonly);
                f.value = e || null;
                f.placeholder = f.format;
                b = h.createEditor('input', d, e, k);
                jSuites.calendar(b, f);
                if (!1 === b.calendar.options.readonly)
                    b.focus();
            };
            a.closeEditor = function (d, e, f, g, k) {
                d = b.calendar.close(!0, b.value ? !0 : !1);
                d = b.value ? d : '';
                if (e)
                    return d;
            };
            a.getFormat = function (d) {
                return d && d.format ? d.format : d && d.options && d.options.format ? d.options.format : 'YYYY-MM-DD';
            };
            a.get = function (d, e) {
                d = a.getFormat(d);
                return jSuites.calendar.getDateString(e, d);
            };
            return a;
        }();
        h.color = function () {
            var a = {}, b = null;
            a.updateCell = function (d, e, f, g, k, n) {
                d && (n.render == 'square' ? (f = document.createElement('div'), f.className = 'color', f.style.backgroundColor = e, d.innerText = '', d.appendChild(f)) : (d.style.color = e, d.innerText = e));
            };
            a.createCell = a.updateCell;
            a.openEditor = function (d, e, f, g, k, n) {
                n = Object.create(n);
                typeof n.filterOptions == 'function' && (n = n.filterOptions(k, d, f, g, e, n));
                n.value = e;
                n.onclose = function (m, p) {
                    k.closeEditor(d, !0);
                };
                b = h.createEditor('input', d, e, k);
                b = jSuites.color(b, n);
                b.open();
            };
            a.closeEditor = function (d, e, f, g, k, n) {
                d = b.close(!0);
                if (e)
                    return d;
            };
            a.get = function (d, e) {
                d = document.createElement('div');
                d.style.width = '100px';
                d.style.height = '10px';
                d.style.backgroundColor = e;
                return d.outerHTML;
            };
            return a;
        }();
        h.checkbox = function () {
            var a = {};
            a.createCell = function (b, d, e, f, g, k) {
                d = d && d != 'false' && d != 'FALSE' ? !0 : !1;
                e = document.createElement('input');
                e.type = 'checkbox';
                e.checked = d;
                e.onclick = function () {
                    g.setValue(b, this.checked);
                };
                if (k && 1 == k.readOnly || !g.isEditable())
                    e.setAttribute('disabled', 'disabled');
                b.innerHTML = '';
                b.appendChild(e);
                return d;
            };
            a.updateCell = function (b, d) {
                d = d && d != 'false' && d != 'FALSE' ? !0 : !1;
                b && (b.children[0].checked = d);
                return d;
            };
            a.openEditor = function (b, d, e, f, g) {
                d = b.children[0].checked ? !1 : !0;
                g.setValue(b, d);
                return !1;
            };
            a.closeEditor = function (b, d) {
                return !1;
            };
            a.get = function (b, d) {
                return 1 == d || 1 == d || d == 'true' ? jSuites.translate('true') : jSuites.translate('false');
            };
            return a;
        }();
        h.radio = function () {
            var a = {};
            a.createCell = function (b, d, e, f, g, k) {
                b.getAttribute('data-x');
                e = document.createElement('input');
                e.type = 'radio';
                e.checked = 1 == d || 1 == d || d == 'true' ? !0 : !1;
                e.onclick = function () {
                    g.setValue(b, !0);
                };
                if (k && 1 == k.readOnly || !g.isEditable())
                    e.setAttribute('disabled', 'disabled');
                b.innerHTML = '';
                b.appendChild(e);
            };
            a.updateCell = function (b, d, e, f, g) {
                d = 1 == d || 1 == d || d == 'true' || d == 'TRUE' ? !0 : !1;
                b && (b.children[0].checked = d);
                if (1 == d) {
                    b = [];
                    for (var k = 0; k < g.options.data.length; k++)
                        if (f != k && g.options.data[k][e])
                            b.push({
                                x: e,
                                y: k,
                                value: 0
                            });
                    if (b.length)
                        g.setValue(b);
                }
                return d;
            };
            a.openEditor = function (b, d, e, f, g) {
                return !1;
            };
            a.closeEditor = function (b, d) {
                return !1;
            };
            a.get = function (b, d) {
                return 1 == d || 1 == d || d == 'true' ? 'true' : 'false';
            };
            return a;
        }();
        h.autonumber = function () {
            var a = {}, b = null;
            a.createCell = function (d, e, f, g, k, n) {
                (e = parseInt(e)) || 0 < parseInt(d.innerText) && (e = parseInt(d.innerText));
                n.sequence || (n.sequence = 0);
                e ? a.isValid(e, f, g, k) || (e = '#ERROR') : e = n.sequence + 1;
                e > n.sequence && (n.sequence = e);
                return d.innerText = e;
            };
            a.updateCell = a.createCell;
            a.openEditor = function (d, e, f, g, k, n) {
                b = h.createEditor('input', d, e, k);
                b.onblur = function () {
                    k.closeEditor(d, !0);
                };
                b.focus();
                b.value = e;
            };
            a.closeEditor = function (d, e, f, g, k) {
                return e ? b.value : '';
            };
            a.isValid = function (d, e, f, g) {
                for (var k, n = 0; n < g.options.data.length; n++)
                    if (k = g.value(e, n), k == d && n != f)
                        return !1;
                return !0;
            };
            return a;
        }();
        h.progressbar = function () {
            var a = {}, b = null;
            a.createCell = function (d, e) {
                e = parseInt(e);
                if (100 < e)
                    e = 100;
                else if (!e || 0 > e)
                    e = 0;
                if (d.children[0] && d.children[0].tagName == 'DIV')
                    var f = d.children[0];
                else
                    f = document.createElement('div'), f.classList.add('progressbar'), d.innerText = '', d.classList.add('jss_progressbar'), d.appendChild(f);
                f.style.width = parseInt(e) + '%';
                f.setAttribute('title', parseInt(e) + '%');
            };
            a.destroyCell = function (d) {
                d.classList.remove('jss_progressbar');
            };
            a.updateCell = a.createCell;
            a.openEditor = function (d, e, f, g, k, n) {
                b = h.createEditor('input', d, e, k);
                b.type = 'number';
                b.setAttribute('min', 0);
                b.setAttribute('max', 100);
                b.onblur = function () {
                    k.closeEditor(d, !0);
                };
                b.focus();
                b.value = e;
            };
            a.closeEditor = function (d, e, f, g, k) {
                return e ? b.value : '';
            };
            return a;
        }();
        h.rating = function () {
            var a = {}, b = null;
            a.createCell = function (d, e, f, g, k, n) {
                return a.setCell(d, e, n);
            };
            a.destroyCell = function (d) {
                d.classList.remove('jss_rating');
            };
            a.updateCell = a.createCell;
            a.openEditor = function (d, e, f, g, k, n) {
                b = h.createEditor('input', d, e, k);
                b.type = 'number';
                b.setAttribute('min', 0);
                b.setAttribute('max', 5);
                b.onblur = function () {
                    k.closeEditor(d, !0);
                };
                b.focus();
                b.value = e;
            };
            a.closeEditor = function (d, e, f, g, k, n) {
                return e ? b.value : '';
            };
            a.setCell = function (d, e, f) {
                e = parseInt(e);
                if (5 < e)
                    e = 5;
                else if (!e || 0 > e)
                    e = 0;
                if (d) {
                    f = f && f.color ? f.color : 'red';
                    var g = document.createElement('div');
                    g.setAttribute('title', parseInt(e) + ' stars');
                    g.classList.add('rating');
                    for (var k = 0; k < e; k++) {
                        var n = document.createElement('i');
                        n.className = 'material-icons';
                        n.style.color = f;
                        n.innerHTML = 'star';
                        g.appendChild(n);
                    }
                    d.innerHTML = '';
                    d.className = 'jss_rating';
                    d.appendChild(g);
                }
                return e;
            };
            return a;
        }();
        h.email = function () {
            var a = {};
            a.createCell = function (b, d, e, f, g, k) {
                if (b) {
                    if (b.children && b.children[0] && b.children[0].tagName == 'A')
                        e = b.children[0];
                    else if (e = document.createElement('a'), b.innerText = '', b.appendChild(e), k.options && k.options.url)
                        e.setAttribute('href', k.options.url);
                    e.innerText = d;
                }
            };
            a.updateCell = a.createCell;
            a.openEditor = function (b, d, e, f, g, k) {
                g.parent.input.classList.add('jss_nowrap');
                g.parent.input.onblur = function () {
                    g.closeEditor(b, !0);
                };
                g.parent.input.innerText = d;
                jSuites.focus(g.parent.input);
            };
            a.closeEditor = function (b, d, e, f, g) {
                g.parent.input.classList.remove('jss_nowrap');
                return d ? g.parent.input.innerText.replace(new RegExp(/\n/, 'g'), '') : '';
            };
            return a;
        }();
        h.url = h.email;
        h.image = function () {
            var a = {}, b = null;
            a.createCell = function (d, e, f, g, k, n) {
                if (d)
                    if (e)
                        if (d.children && d.children[0] && d.children[0].tagName == 'IMG')
                            d.children[0].src = e;
                        else {
                            f = document.createElement('img');
                            if (n.render == 'round')
                                f.classList.add('round');
                            n.options && (f.style.maxWidth = '100%', n.options.absolute && (f.style.position = 'absolute'), n.options.width && (f.style.maxWidth = parseInt(n.options.width) + 'px'), n.options.height && (f.style.maxHeight = parseInt(n.options.height) + 'px', f.style.marginTop = -1 * parseInt(n.options.height) / 2 + 'px'));
                            f.src = e;
                            d.innerHTML = '';
                            d.appendChild(f);
                        }
                    else
                        d.innerHTML = '';
            };
            a.updateCell = a.createCell;
            a.openEditor = function (d, e, f, g, k, n) {
                (n && n.options ? n.options : {}).value = e;
                b = h.createDialog(d, e, f, g, k, n);
                e && (d = document.createElement('img'), d.src = e, d.classList.add('jfile'), d.style.width = '100%', b.appendChild(d));
                jSuites.image(b, n);
            };
            a.closeEditor = function (d, e, f, g, k, n) {
                if (e && (d = b.children[0]))
                    return d.tagName == 'IMG' ? d.src : '';
            };
            a.get = function (d, e) {
                return '<img src="' + e + '" alt="">';
            };
            return a;
        }();
        h.html = function () {
            var a = {}, b = null;
            a.createCell = function (d, e) {
                d.classList.add('jss_richtext');
                var f = document.createElement('div');
                f.innerHTML = e;
                d.appendChild(f);
            };
            a.updateCell = function (d, e) {
                d && (d.firstChild.innerHTML = e);
            };
            a.destroyCell = function (d) {
                d.classList.remove('jss_richtext');
            };
            a.openEditor = function (d, e, f, g, k, n) {
                var m = n && n.options ? n.options : {};
                m.focus = !0;
                m.value = e;
                m.border = !1;
                m.height = '145px';
                e = h.createDialog(d, e, f, g, k, n);
                b = jSuites.editor(e, m);
                b.close = function () {
                    k.closeEditor(d, !0);
                };
                jSuites.tracking(b, !0);
            };
            a.closeEditor = function (d, e, f, g, k, n) {
                jSuites.tracking(b, !1);
                d = b.getData();
                if (e)
                    return d;
            };
            return a;
        }();
        h.hidden = function () {
            var a = {};
            a.createCell = function (b, d, e, f, g) {
                b.style.display = 'none';
                b.innerText = d;
            };
            a.updateCell = function (b, d, e, f, g) {
                b && (b.innerText = d);
            };
            a.openEditor = function (b, d, e, f, g) {
                return !1;
            };
            a.closeEditor = function (b, d) {
                return !1;
            };
            return a;
        }();
        h.tags = function () {
            var a = {}, b = null;
            a.createCell = function (d, e) {
                d.classList.add('jss_tags');
                a.updateCell(d, e);
            };
            a.updateCell = function (d, e) {
                d && (d.innerHTML = e);
            };
            a.destroyCell = function (d) {
                d.classList.remove('jss_tags');
            };
            a.openEditor = function (d, e, f, g, k, n) {
                var m = n && n.options ? n.options : {};
                m.value = e;
                b = h.createDialog(d, e, f, g, k, n);
                d = document.createElement('div');
                d.style.margin = '10px';
                d.style.marginRight = '40px';
                b.appendChild(d);
                b = jSuites.tags(d, m);
                d.focus();
                jSuites.focus(d);
            };
            a.closeEditor = function (d, e, f, g, k, n) {
                d = b.getValue();
                if (e)
                    return d;
            };
            return a;
        }();
        h.record = function () {
            var a = {}, b = null;
            a.createCell = function (e, f, g, k, n, m) {
                e.classList.add('jss_dropdown');
                var p;
                if (p = n.parent.getWorksheetInstance(m.worksheetId))
                    if (p.rows)
                        a.updateCell(e, f, g, k, n, m);
                    else
                        e.innerText = '#ERROR', n.parent.queue.push([
                            n,
                            g,
                            k
                        ]);
                else
                    e.innerText = '#ERROR', n.parent.queue.push([
                        n,
                        g,
                        k
                    ]);
            };
            a.destroyCell = function (e) {
                e.classList.remove('jss_dropdown');
            };
            a.updateCell = function (e, f, g, k, n, m) {
                e && (typeof m.worksheetId == 'undefined' ? e.innerText = '#ERROR' : e.innerHTML = a.getValue(e, f, g, k, n, m));
            };
            a.openEditor = function (e, f, g, k, n, m) {
                var p = m.delimiter || ';';
                m = Object.create(m);
                m.options || (m.options = {});
                typeof m.filter == 'function' && (m.source = m.filter(n.el, e, g, k, m.source));
                typeof m.filterOptions == 'function' && (m = m.filterOptions(n, e, g, k, f, m));
                g = m.options;
                g.data = a.getSource(n, m);
                c(m, 'multiple') && (g.multiple = !0);
                c(m, 'autocomplete') && (g.autocomplete = !0);
                g.opened = !0;
                g.width = e.offsetWidth - 2;
                g.onclose = function () {
                    n.closeEditor(e, !0);
                };
                c(m, 'multiple') ? f && (g.value = ('' + f).split(p)) : g.value = f;
                b = h.createEditor('div', e, f, n);
                b = jSuites.dropdown(b, g);
            };
            a.closeEditor = function (e, f, g, k, n, m) {
                e = m.delimiter || ';';
                g = b.getValue(!0);
                b.close(!0);
                if (f)
                    return g.join(e);
            };
            var d = function (e, f) {
                e = this.getRowById(e);
                return !1 === e ? '#NOTFOUND' : e[f];
            };
            a.getValue = function (e, f, g, k, n, m) {
                e = [];
                if (typeof m.worksheetId == 'string' && (g = n.parent.getWorksheetInstance(m.worksheetId))) {
                    k = m.worksheetColumn ? m.worksheetColumn : 0;
                    0 <= m.worksheetImage && (k = m.worksheetImage);
                    if (f == '' || 0 == f || null == f || void 0 == f)
                        return '';
                    f = ('' + f).split(';');
                    for (var p = 0; p < f.length; p++)
                        n = d.call(g, f[p].trim(), g.name(k)), 0 <= m.worksheetImage && (n = '<img src=\'' + n + '\' class=\'round small\' />'), e.push(n);
                    return 0 <= m.worksheetImage ? e.join('') : e.join('; ');
                }
                return '#ERROR';
            };
            a.getSource = function (e, f) {
                var g = f.worksheetColumn ? f.worksheetColumn : 0, k = null;
                typeof f.worksheetId == 'string' && (k = e.parent.getWorksheetInstance(f.worksheetId));
                if (k) {
                    var n, m = [];
                    for (e = 0; e < k.rows.length; e++)
                        if (n = k.value(g, e))
                            n = {
                                id: k.getRowId(e),
                                name: n
                            }, void 0 != f.worksheetImage && (n.image = k.value(f.worksheetImage, e)), m.push(n);
                } else
                    console.error('Jspreadsheet: worksheet not found ' + f.worksheetId);
                return m;
            };
            a.get = function (e, f) {
                for (var g = 0; g < e.source.length; g++)
                    if (e.source[g].id == f)
                        return e.render == 'color' ? e.source[g].color : e.render == 'image' ? e.source[g].image : e.source[g].name;
            };
            return a;
        }();
        return h;
    }();
    return t;
}));
typeof jQuery != 'undefined' && function (E) {
    E.fn.jspreadsheet = E.fn.jexcel = function (M) {
        var ha = E(this).get(0);
        if (ha.jspreadsheet) {
            if (typeof arguments[0] == 'number')
                var ta = arguments[0], ea = 2;
            else
                ta = 0, ea = 1;
            return ha.jspreadsheet[ta][M].apply(ha.jspreadsheet[ta], Array.prototype.slice.call(arguments, ea));
        }
        return jspreadsheet(E(this).get(0), arguments[0]);
    };
}(jQuery);