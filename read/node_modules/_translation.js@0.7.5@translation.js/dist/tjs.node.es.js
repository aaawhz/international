import { request } from 'http';
import { request as request$1 } from 'https';
import { parse } from 'url';
import { stringify } from 'querystring';
import { __awaiter, __generator } from 'tslib';
import { createHash } from 'crypto';

/** 反转对象 */
function invert (obj) {
    var result = {};
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            result[obj[key]] = key;
        }
    }
    return result;
}

var root = 'https://fanyi.baidu.com';
// 写死一个 Cookie 供 Node.js 端使用；浏览器端自带这个 Cookie 所以无需处理
var Cookie = 'BAIDUID=0F8E1A72A51EE47B7CA0A81711749C00:FG=1;';
/**
 * 百度支持的语种到百度自定义的语种名的映射，去掉了文言文。
 * @see http://api.fanyi.baidu.com/api/trans/product/apidoc#languageList
 */
var standard2custom = {
    en: 'en',
    th: 'th',
    ru: 'ru',
    pt: 'pt',
    el: 'el',
    nl: 'nl',
    pl: 'pl',
    bg: 'bul',
    et: 'est',
    da: 'dan',
    fi: 'fin',
    cs: 'cs',
    ro: 'rom',
    sl: 'slo',
    sv: 'swe',
    hu: 'hu',
    de: 'de',
    it: 'it',
    'zh-CN': 'zh',
    'zh-TW': 'cht',
    // 'zh-HK': 'yue',
    ja: 'jp',
    ko: 'kor',
    es: 'spa',
    fr: 'fra',
    ar: 'ara'
};
/** 百度自定义的语种名到标准语种名的映射 */
var custom2standard = invert(standard2custom);

/**
 * 安全的获取一个变量上指定路径的值。
 * TODO: 使用 noshjs 代替
 */
function getValue (obj, pathArray, defaultValue) {
    if (obj == null)
        return defaultValue;
    if (typeof pathArray === 'string') {
        pathArray = [pathArray];
    }
    var value = obj;
    for (var i = 0; i < pathArray.length; i += 1) {
        var key = pathArray[i];
        value = value[key];
        if (value == null) {
            return defaultValue;
        }
    }
    return value;
}

function getError (code, msg) {
    var e = new Error(msg);
    e.code = code;
    return e;
}

function request$2 (options) {
    var _a = options.method, method = _a === void 0 ? 'get' : _a;
    var urlObj = parse(options.url, true);
    var qs = stringify(Object.assign(urlObj.query, options.query));
    var headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
    };
    var body;
    if (method === 'post') {
        switch (options.type) {
            case 'form':
                headers['Content-Type'] =
                    'application/x-www-form-urlencoded; charset=UTF-8';
                body = stringify(options.body);
                break;
            case 'json':
            default:
                headers['Content-Type'] = 'application/json; charset=UTF-8';
                body = JSON.stringify(options.body);
                break;
        }
        headers['Content-Length'] = String(Buffer.byteLength(body));
    }
    Object.assign(headers, options.headers);
    var httpOptions = {
        hostname: urlObj.hostname,
        method: method,
        path: urlObj.pathname + '?' + qs,
        headers: headers,
        auth: urlObj.auth
    };
    var responseType = options.responseType || 'json';
    return new Promise(function (resolve, reject) {
        var req = (urlObj.protocol === 'https:' ? request$1 : request)(httpOptions, function (res) {
            // 内置的翻译接口都以 200 作为响应码，所以不是 200 的一律视为错误
            if (res.statusCode !== 200) {
                reject(getError("API_SERVER_ERROR" /* API_SERVER_ERROR */));
                return;
            }
            res.setEncoding('utf8');
            var rawData = '';
            res.on('data', function (chunk) {
                rawData += chunk;
            });
            res.on('end', function () {
                // Node.js 端只支持 json，其余都作为 text 处理
                if (responseType === 'json') {
                    try {
                        resolve(JSON.parse(rawData));
                    }
                    catch (e) {
                        // 与浏览器端保持一致，在无法解析成 json 时报错
                        reject(getError("API_SERVER_ERROR" /* API_SERVER_ERROR */));
                    }
                }
                else {
                    resolve(rawData);
                }
            });
        });
        req.on('error', function (e) {
            reject(getError("NETWORK_ERROR" /* NETWORK_ERROR */, e.message));
        });
        req.end(body);
    });
}

// tslint:disable
var C = null;
/**
 * 从百度网页翻译中复制过来的计算签名的代码
 * @param text 要查询的文本
 * @param seed 从 ./seed.ts 获取到的 seed
 */
function sign (text, seed) {
    var o = text.length;
    o > 30 &&
        (text =
            '' +
                text.substr(0, 10) +
                text.substr(Math.floor(o / 2) - 5, 10) +
                text.substr(-10, 10));
    var t = null !== C ? C : (C = seed || '') || '';
    for (var e = t.split('.'), h = Number(e[0]) || 0, i = Number(e[1]) || 0, d = [], f = 0, g = 0; g < text.length; g++) {
        var m = text.charCodeAt(g);
        128 > m
            ? (d[f++] = m)
            : (2048 > m
                ? (d[f++] = (m >> 6) | 192)
                : (55296 === (64512 & m) &&
                    g + 1 < text.length &&
                    56320 === (64512 & text.charCodeAt(g + 1))
                    ? (m =
                        65536 + ((1023 & m) << 10) + (1023 & text.charCodeAt(++g)), d[f++] = (m >> 18) | 240, d[f++] = ((m >> 12) & 63) | 128)
                    : (d[f++] = (m >> 12) | 224), d[f++] = ((m >> 6) & 63) | 128), d[f++] = (63 & m) | 128);
    }
    for (var S = h, u = '+-a^+6', l = '+-3^+b+-f', s = 0; s < d.length; s++)
        S += d[s], S = a(S, u);
    return (S = a(S, l), S ^= i, 0 > S && (S = (2147483647 & S) + 2147483648), S %= 1e6, S.toString() + '.' + (S ^ h));
}
function a(r, o) {
    for (var t = 0; t < o.length - 2; t += 3) {
        var a = o.charAt(t + 2);
        a = a >= 'a' ? a.charCodeAt(0) - 87 : Number(a), a = '+' === o.charAt(t + 1) ? r >>> a : r << a, r = '+' === o.charAt(t) ? (r + a) & 4294967295 : r ^ a;
    }
    return r;
}

var seedReg = /window\.gtk\s=\s'([^']+)';/;
var tokenReg = /token:\s'([^']+)'/;
var headers = {
        // 鸡贼的百度，需要带上 BAIDUUID 才会返回正确的 token；请求接口时也需要带上相同的 Cookie。
        // 在浏览器端应该不需要做额外设置，因为浏览器会自动保存 cookie，然后请求接口时自动带上。
        // 换了一个 IP 地址后也能用相同的 Cookie 请求，不过不清楚过期了是否还能继续用。
        Cookie: Cookie
    };
function getSeed () {
    return __awaiter(this, void 0, void 0, function () {
        var html, seed, token;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, request$2({
                        url: 'https://fanyi.baidu.com',
                        headers: headers,
                        responseType: 'text'
                    })];
                case 1:
                    html = _a.sent();
                    seed = html.match(seedReg);
                    if (seed) {
                        token = html.match(tokenReg);
                        if (token) {
                            return [2 /*return*/, {
                                    seed: seed[1],
                                    token: token[1]
                                }];
                        }
                    }
                    // 如果不能正确解析出 seed 和 token，则视为服务器错误
                    throw getError("API_SERVER_ERROR" /* API_SERVER_ERROR */);
            }
        });
    });
}

/**
 * 获取查询百度网页翻译接口所需的 token 和 sign
 * @param text 要查询的文本
 */
function sign$1 (text) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, seed, token;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getSeed()];
                case 1:
                    _a = _b.sent(), seed = _a.seed, token = _a.token;
                    return [2 /*return*/, {
                            token: token,
                            sign: sign(text, seed)
                        }];
            }
        });
    });
}

function detect (options) {
    return __awaiter(this, void 0, void 0, function () {
        var query, body, iso689lang;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    query = (typeof options === 'string' ? options : options.text).slice(0, 73);
                    return [4 /*yield*/, request$2({
                            method: 'post',
                            url: root + '/langdetect',
                            body: {
                                query: query
                            },
                            type: 'form'
                        })];
                case 1:
                    body = _a.sent();
                    if (body.error === 0) {
                        iso689lang = custom2standard[body.lan];
                        if (iso689lang)
                            return [2 /*return*/, iso689lang];
                    }
                    throw getError("UNSUPPORTED_LANG" /* UNSUPPORTED_LANG */);
            }
        });
    });
}

/**
 * 生成百度语音地址
 * @param text 要朗读的文本
 * @param lang 文本的语种，使用百度自定义的语种名称
 */
function getAudioURI(text, lang) {
    return (root +
        ("/gettts?lan=" + lang + "&text=" + encodeURIComponent(text) + "&spd=3&source=web"));
}
/**
 * 获取指定文本的网络语音地址
 */
function audio (options) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, text, _b, from, lang;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = typeof options === 'string' ? { text: options } : options, text = _a.text, _b = _a.from, from = _b === void 0 ? undefined : _b;
                    if (!!from) return [3 /*break*/, 2];
                    return [4 /*yield*/, detect(text)];
                case 1:
                    from = _c.sent();
                    _c.label = 2;
                case 2:
                    if (from === 'en-GB') {
                        lang = 'uk';
                    }
                    else {
                        lang = standard2custom[from];
                        if (!lang)
                            throw getError("UNSUPPORTED_LANG" /* UNSUPPORTED_LANG */);
                    }
                    return [2 /*return*/, getAudioURI(text, lang)];
            }
        });
    });
}

var headers$1 = {
        'X-Requested-With': 'XMLHttpRequest',
        Cookie: Cookie
    };
function translate (options) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, from, _c, to, text, customFromLang, customToLang, _d, _e, _f, _g, _h, _j, _k;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    _a = typeof options === 'string' ? { text: options } : options, _b = _a.from, from = _b === void 0 ? undefined : _b, _c = _a.to, to = _c === void 0 ? undefined : _c, text = _a.text;
                    if (!!from) return [3 /*break*/, 2];
                    return [4 /*yield*/, detect(text)];
                case 1:
                    from = _l.sent();
                    _l.label = 2;
                case 2:
                    if (!to) {
                        to = from.startsWith('zh') ? 'en' : 'zh-CN';
                    }
                    customFromLang = standard2custom[from];
                    customToLang = standard2custom[to];
                    if (!customFromLang || !customToLang) {
                        throw getError("UNSUPPORTED_LANG" /* UNSUPPORTED_LANG */);
                    }
                    _d = transformRaw;
                    _e = [text];
                    _f = request$2;
                    _g = {
                        url: root + '/v2transapi',
                        type: 'form',
                        method: 'post'
                    };
                    _j = (_h = Object).assign;
                    _k = [{
                            from: customFromLang,
                            to: customToLang,
                            query: text,
                            transtype: 'translang',
                            simple_means_flag: 3
                        }];
                    return [4 /*yield*/, sign$1(text)];
                case 3: return [4 /*yield*/, _f.apply(void 0, [(_g.body = _j.apply(_h, _k.concat([_l.sent()])), _g.headers = headers$1, _g)])];
                case 4: return [2 /*return*/, _d.apply(void 0, _e.concat([_l.sent()]))];
            }
        });
    });
}
function transformRaw(text, body) {
    var transResult = body.trans_result;
    var customFrom = getValue(transResult, 'from');
    var customTo = getValue(transResult, 'to');
    var result = {
        text: text,
        raw: body,
        link: root + ("/#" + customFrom + "/" + customTo + "/" + encodeURIComponent(text)),
        from: custom2standard[customFrom],
        to: custom2standard[customTo]
    };
    var symbols = getValue(body, [
        'dict_result',
        'simple_means',
        'symbols',
        '0'
    ]);
    if (symbols) {
        // 解析音标
        var phonetic = [];
        var ph_am = symbols.ph_am, ph_en = symbols.ph_en;
        if (ph_am) {
            phonetic.push({
                name: '美',
                ttsURI: getAudioURI(text, 'en'),
                value: ph_am
            });
        }
        if (ph_en) {
            phonetic.push({
                name: '英',
                ttsURI: getAudioURI(text, 'en-GB'),
                value: ph_en
            });
        }
        if (phonetic.length) {
            result.phonetic = phonetic;
        }
        // 解析词典数据
        try {
            result.dict = symbols.parts.map(function (part) {
                return part.part + ' ' + part.means.join('；');
            });
        }
        catch (e) { }
    }
    // 解析普通的翻译结果
    try {
        result.result = transResult.data.map(function (d) { return d.dst; });
    }
    catch (e) { }
    if (!result.dict && !result.result) {
        throw getError("API_SERVER_ERROR" /* API_SERVER_ERROR */);
    }
    return result;
}



var index = /*#__PURE__*/Object.freeze({
  translate: translate,
  detect: detect,
  audio: audio
});

// 谷歌翻译支持 104 中语言，有一部分不是 IOS-639-1 标准。
function getRoot(com) {
    return 'https://translate.google.c' + (com ? 'om' : 'n');
}

function detect$1 (options) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, text, _b, com, src;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = typeof options === 'string' ? { text: options } : options, text = _a.text, _b = _a.com, com = _b === void 0 ? false : _b;
                    return [4 /*yield*/, request$2({
                            url: getRoot(com) + '/translate_a/single',
                            query: {
                                client: 'gtx',
                                sl: 'auto',
                                dj: '1',
                                ie: 'UTF-8',
                                oe: 'UTF-8',
                                q: text
                            }
                        })];
                case 1:
                    src = (_c.sent()).src;
                    if (src)
                        return [2 /*return*/, src];
                    throw getError("UNSUPPORTED_LANG" /* UNSUPPORTED_LANG */);
            }
        });
    });
}

function audio$1 (options) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, text, _b, from, _c, com;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = typeof options === 'string' ? { text: options } : options, text = _a.text, _b = _a.from, from = _b === void 0 ? '' : _b, _c = _a.com, com = _c === void 0 ? false : _c;
                    if (!!from) return [3 /*break*/, 2];
                    return [4 /*yield*/, detect$1(text)];
                case 1:
                    from = _d.sent();
                    _d.label = 2;
                case 2: return [2 /*return*/, getRoot(com) + "/translate_tts?ie=UTF-8&client=gtx&tl=" + from + "&q=" + encodeURIComponent(text)];
            }
        });
    });
}

function translate$1 (options) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, text, _b, com, _c, from, _d, to, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _a = typeof options === 'string' ? { text: options } : options, text = _a.text, _b = _a.com, com = _b === void 0 ? false : _b, _c = _a.from, from = _c === void 0 ? '' : _c, _d = _a.to, to = _d === void 0 ? '' : _d;
                    if (!!from) return [3 /*break*/, 2];
                    return [4 /*yield*/, detect$1(options)];
                case 1:
                    from = _f.sent();
                    _f.label = 2;
                case 2:
                    if (!to) {
                        to = from.startsWith('zh') ? 'en' : 'zh-CN';
                    }
                    _e = transformRaw$1;
                    return [4 /*yield*/, request$2({
                            url: getRoot(com) + '/translate_a/single',
                            headers: {
                                // TODO: 保证目标语种不受操作系统或浏览器的设置影响，直接设置成 zh-CN 仍然有问题，需要看一下 0.6.x 的代码
                                'Accept-Language': 'zh-CN,zh;q=0.9,en-GB;q=0.8,en;q=0.7'
                            },
                            query: {
                                client: 'gtx',
                                sl: from,
                                tl: to,
                                dj: '1',
                                ie: 'UTF-8',
                                oe: 'UTF-8',
                                /*
                                 t: sentences
                                 rm: sentences[1]
                                 bd: dict
                                 at: alternative_translations
                                 ss: synsets
                                 rw: related_words
                                 ex: examples
                                 ld: ld_result
                                */
                                dt: ['at', 'bd', 'ex', 'md', 'qca', 'rw', 'rm', 'ss', 't'],
                                q: text
                            }
                        })];
                case 3: return [2 /*return*/, _e.apply(void 0, [_f.sent(),
                        {
                            from: from,
                            to: to,
                            com: com,
                            text: text
                        }])];
            }
        });
    });
}
function transformRaw$1(rawRes, queryObj) {
    var text = queryObj.text, to = queryObj.to;
    var realFrom = rawRes.src || queryObj.from;
    var obj = {
        text: text,
        from: realFrom,
        to: to,
        raw: rawRes,
        link: getRoot(queryObj.com) + "/#" + realFrom + "/" + to + "/" + encodeURIComponent(text)
    };
    try {
        // 尝试获取详细释义
        obj.dict = rawRes.dict.map(function (v) {
            return v.pos + '：' + (v.terms.slice(0, 3) || []).join(',');
        });
    }
    catch (e) { }
    try {
        // 尝试取得翻译结果
        var sentences = rawRes.sentences;
        // 去掉最后一项
        sentences.pop();
        obj.result = sentences.map(function (_a) {
            var trans = _a.trans;
            return trans.trim();
        });
    }
    catch (e) { }
    if (!obj.dict && !obj.result) {
        throw getError("API_SERVER_ERROR" /* API_SERVER_ERROR */);
    }
    return obj;
}



var index$1 = /*#__PURE__*/Object.freeze({
  detect: detect$1,
  audio: audio$1,
  translate: translate$1
});

function md5 (text) {
    return createHash('md5')
        .update(text)
        .digest('hex');
}

var client = 'fanyideskweb';
var sk = "rY0D^0'nM0}g5Mm1z%1G4";
/**
 * 有道翻译接口的签名算法
 * @param {string} text
 * @return {{client: string, salt: number, sign: string}}
 */
function sign$2 (text) {
    var salt = Date.now() + parseInt(String(10 * Math.random()), 10);
    return {
        client: client,
        salt: salt,
        sign: md5(client + text + salt + sk)
    };
}

var standard2custom$1 = {
    en: 'en',
    ru: 'ru',
    pt: 'pt',
    es: 'es',
    'zh-CN': 'zh-CHS',
    ja: 'ja',
    ko: 'ko',
    fr: 'fr'
};
var custom2standard$1 = invert(standard2custom$1);
var link = 'http://fanyi.youdao.com';
var translateAPI = link + '/translate_o?smartresult=dict&smartresult=rule';
// 有道跟百度一样，通过添加一个 Cookie 鉴别请求是否来自网页
var headers$2 = { Referer: link, Cookie: 'OUTFOX_SEARCH_USER_ID=1327810919@10.168.8.64' };
function webAPI (options) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, text, _b, from, _c, to, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _a = typeof options === 'string' ? { text: options } : options, text = _a.text, _b = _a.from, from = _b === void 0 ? '' : _b, _c = _a.to, to = _c === void 0 ? '' : _c;
                    text = text.slice(0, 5000);
                    if (from) {
                        from = standard2custom$1[from];
                    }
                    else {
                        from = 'AUTO';
                    }
                    if (to) {
                        to = standard2custom$1[to];
                    }
                    else {
                        to = 'AUTO';
                    }
                    // 有道网页翻译的接口的语种与目标语种中必须有一个是中文，或者两个都是 AUTO
                    if (!((from === 'AUTO' && to === 'AUTO') ||
                        (from === 'zh-CHS' || to === 'zh-CHS'))) {
                        throw getError("UNSUPPORTED_LANG" /* UNSUPPORTED_LANG */);
                    }
                    _d = transformRaw$2;
                    return [4 /*yield*/, request$2({
                            method: 'post',
                            url: translateAPI,
                            type: 'form',
                            body: Object.assign({
                                i: text,
                                from: from,
                                to: to,
                                smartresult: 'dict',
                                doctype: 'json',
                                version: '2.1',
                                keyfrom: 'fanyi.web',
                                action: 'FY_BY_REALTIME',
                                typoResult: 'false'
                            }, sign$2(text)),
                            headers: headers$2
                        })];
                case 1: return [2 /*return*/, _d.apply(void 0, [_e.sent(),
                        text])];
            }
        });
    });
}
function transformRaw$2(body, text) {
    if (body.errorCode !== 0) {
        throw getError("API_SERVER_ERROR" /* API_SERVER_ERROR */);
    }
    var _a = body.type.split('2'), from = _a[0], to = _a[1];
    from = custom2standard$1[from];
    to = custom2standard$1[to];
    var smartResult = body.smartResult;
    var result = {
        raw: body,
        text: text,
        from: from,
        to: to,
        link: smartResult
            ? "https://dict.youdao.com/search?q=" + encodeURIComponent(text) + "&keyfrom=fanyi.smartResult"
            : "http://fanyi.youdao.com/translate?i=" + encodeURIComponent(text)
    };
    if (smartResult) {
        try {
            result.dict = smartResult.entries.filter(function (s) { return s; }).map(function (s) { return s.trim(); });
        }
        catch (e) { }
    }
    try {
        result.result = body.translateResult[0].map(function (o) { return o.tgt.trim(); });
    }
    catch (e) { }
    return result;
}

function detect$2 (options) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, webAPI(typeof options === 'string' ? options : options.text)];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result.from];
            }
        });
    });
}

var standard2custom$2 = {
    en: 'eng',
    ja: 'jap',
    ko: 'ko',
    fr: 'fr'
};
function audio$2 (options) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, text, _b, from, voiceLang;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = typeof options === 'string' ? { text: options } : options, text = _a.text, _b = _a.from, from = _b === void 0 ? '' : _b;
                    if (!!from) return [3 /*break*/, 2];
                    return [4 /*yield*/, detect$2(text)];
                case 1:
                    from = _c.sent();
                    _c.label = 2;
                case 2:
                    voiceLang = standard2custom$2[from];
                    if (!voiceLang)
                        throw getError("UNSUPPORTED_LANG" /* UNSUPPORTED_LANG */);
                    return [2 /*return*/, "http://tts.youdao.com/fanyivoice?word=" + encodeURIComponent(text) + "&le=" + voiceLang + "&keyfrom=speaker-target"];
            }
        });
    });
}



var index$2 = /*#__PURE__*/Object.freeze({
  detect: detect$2,
  audio: audio$2,
  translate: webAPI
});

export { index as baidu, index$1 as google, index$2 as youdao };
