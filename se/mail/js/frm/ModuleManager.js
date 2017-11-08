
/**
 * 管理各个模块, 缓存模块的数据, 模板, 方法等
 * 模块的初始化, 更新
 * 模块跳转
 * 监控模块从创建到销毁的各种状态变化, 和事件绑定
 * 创建顶部工具菜单入口 
 * 对AJAX数据格式的封装
 * 控制框架上中下个模块的高度 (mainResize)
 */
var ModuleManager = cmail.emptyFunction();

ModuleManager.prototype.showMsg = CC.showMsg;
ModuleManager.prototype.hideMsg = CC.hideMsg;

ModuleManager.prototype.get = function (o, isShow, sid) {
    try {
        var call = function () {
        };
        if (typeof(isShow) == "function") {
            call = isShow;
            isShow = null;
        }
        isShow = isShow || false;
        sid = sid || o;
        if (!this.initModule(o)) {
            if (isShow) {
                window.setTimeout("MM.getModule('" + o + "', true,'" + sid + "');", 1500);
            } else {
                window.setTimeout("MM.getModule('" + o + "', false,'" + sid + "');", 1500);
            }
            return;
        }
        var id = GE.tab.curid;
        //新增id!="attachList"  如果是从会话邮件跳出去的， 不判断， 有可能去某一个会话的详情页
        if ((sid == id || GE.tab.exist(sid)) && id != "attachList" && !GE.tab.isSession) {
            GE.tab.active(sid);
            call();
            if (id.length > 10 && sid.length > 10) {
                GE.tab.close(id);
            }
            return true;
        }

        if (isShow) {
            MM[o].hidden = true;
        } else {
            this.laterRequestModule = sid;
        }
//      //新增id!="attachList"
//        if (GE.tab.exist(sid) && id!="attachList"){
//            GE.tab.active(sid);
//            call.call(MM[o],sid);
//            return;
//        }

        if (this[o].needRequest) {
            this._request(o, call, this[o].msg);
            this.showWait(o);
        } else {
            this._create(o, sid);
        }
        return false;
    }
    catch (exp) {
        ch("fModuleManagerGet", exp);
        return false;
    }
};

ModuleManager.prototype.getAjaxXml = function (data) {
    //var xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    var xml = Util.jsonToXml(data) + '\n\n';
    return xml;
};

ModuleManager.prototype.getAjaxJson = function (data) {
    //var xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    //两边加单引号，(把unicode编码转化为中文)，"\u9020\u29291"--> '"分组1"', eval后-->'分组1'
    //解决这个问在IE8下调用json2.js里面的JSON.stringify() 而不使用IE8自带的
    //var json = eval("'"+JSON.stringify(data)+"'");;
    //var json;
    //try {
     //   json = eval("'"+JSON.stringify(data)+"'");
    //} catch(e) {
     //   json =JSON.stringify(data);
    //}
    return JSON.stringify(data);
};


/**
 * 创建新标签模块 [比如点击左侧“收件箱”，创建出右侧的列表]
 * @param {string} o 模块名称
 * @param {string} sid 模块id
 * @param {boolean} isNotActive 不激活标签，默认创建模块后会激活模块对应标签
 * @param {string} target 是否打开新tab
 */
ModuleManager.prototype.create = function (o, sid, isNotActive, oldsid, target) {
    try {
        sid = sid || o;
        var fCreateModule_sub = function () {
            MM.createModule(o, sid, isNotActive);
        };
        if (!this.initModule(o)) {
            window.setTimeout("fCreateModule_sub()", 1500);
            MM.showMsg(gConst.msgLoadData, true);
            return;
        }
        var html = "";
        try {
            html = this[o]._getHtml();
        } catch (e) {

        }
        if (!html) {
            window.setTimeout("fCreateModule_sub()", 1500);
            return;
        }
        html = '<div id="' + gConst.mainBody + sid + '">' + html + '</div>';
        //if( MM[o].toolbarPosition && MM[o].toolbarPosition == gConst.toolBarPosition.afterTitle ){
        //}
        //else {
        //  html = '<div id="' + gConst.mainToolbar + sid + '"></div>' + html;
        //}
        //if(o == GE.folderObj.inbox)
        //{
        //  MM[o].group = 99;
        //}
        var t = {
            name: (oldsid || sid),
            text: MM[o].text,
            group: MM[o].group,
            isLink: false,
            url: null,
            html: html,
            srep: true,
            exitcall: function (p) {
                if (p == "after") {
                    MM[o].isExit = false;
                } else {
                    return MM[o].exit(sid);
                }
            }
        };
        if (o == "welcome") {
            t.close = true;
        }
        this[o].isLoaded = true;
        if (!MM[o].noTab) {
            GE.tab.add(t, isNotActive, target);

            //调用Toolbar.js 的 Toolbar类
            var toolbar = new Toolbar(sid, function () {
                //folder.js 的getToolbar
                return MM[o].getToolbar(sid);
            }, function (n, cm) {
                //folder.js 的 getToolbarMenu
                return MM[o].getToolbarMenu(n, cm);
            }, $(gConst.mainToolbar + sid), MM[o].menuId);

            toolbar.init();
            toolbar.getToolbar(); //得到读信列表的工具条
            toolbar.getDatePick();
        }
        this[o]._init(o);
        /*
         if(MM[o] && MM[o].isLoadNoReadMail && MM[o].isSearch)
         {
         MM[o].isLoadNoReadMail=false;
         }
         */
        GE.currentModule = o;
        MM.hideMsg();

    } catch (e) {
        //CC.alert("操作失败！");
    }
};

/***
 * 更标签模块内容
 * @param {Object} o 模块名称
 * @param {Object} sid 模块id
 */
ModuleManager.prototype.updateBody = function (o, sid) {
    sid = sid || o;
    if (o.indexOf('_') > -1) {
        sid = o;
        o = o.substring(0, o.indexOf('_'));
    }
    MM.laterRequestModule = o;
    if (MM[o].isLoaded) {
        return;
    }
    var fUpdateBody_sub = function () {
        MM.updateBody(o, sid);
    };
    if (!MM.initModule(o)) {
        window.setTimeout("fUpdateBody_sub()", 150);
        MM.showMsg(gConst.msgLoadData, true);
        return;
    }
    var html = MM[o]._getHtml();
    if (!html) {
        window.setTimeout("fUpdateBody_sub()", 150);
        return;
    }
    var b = $(gConst.mainBody + sid);
    //g(b);    
    b.innerHTML = html;
    MM[o]._init(o);
    MM[o].isLoaded = true;
    GE.currentModule = o;
    MM[o]._resize(o);
};

ModuleManager.prototype.showWait = function (o) {
    return;
};

/**
 * 构造方法，初始化
 * @constructor
 */
ModuleManager.prototype.initialize = function () {
    //var fg = ["getContainer", "get",  "create", "request"];
    //依次调用下面三个方法，
    var fg = [ "get", "create", "request"];
    cmail.initMethod(cmail.ModuleManager, fg);
    fg.each(function (ao, value) {
        //这样组装，调用getModule方法，其实是调用了get方法
        cmail.ModuleManager.prototype[value + 'Module'] = function (gy) {
            return function () {
                //为什么加一个下划线？
                return this['_' + gy].apply(this, arguments);
            };
        }(value);
    });
    this.hash = new Hashtable();
};

ModuleManager.prototype.observe = function (v, sEvent, func) {
    if (typeof(v) == "string" && MM[v]) {
        v = MM[v];
    }
    var _event = "_" + sEvent;
    if (!v[_event]) {
        v[_event] = new cmail.Delegate();
    }
    v[_event].add(func);
    v[sEvent] = function () {
        v[_event].run.apply(v[_event], arguments);
    };
};

ModuleManager.prototype.stopObserve = function (v, sEvent, func) {
    if (typeof(v) == "string" && MM[v]) {
        v = MM[v];
    }
    var _event = "_" + sEvent;
    if (!v[_event]) {
        v[_event] = new cmail.Delegate();
    }
    v[_event].hash.removeByObj(func);
    v[sEvent] = function () {
        v[_event].run.apply(v[_event], arguments);
    };
};
ModuleManager.prototype.stopAllObserve = function (v, sEvent) {
    if (typeof(v) == "string" && MM[v]) {
        v = MM[v];
    }
    var _event = "_" + sEvent;
    if (v[_event]) {
        v[_event] = new cmail.Delegate();
    }
};

/**
 * 执行表单数据提交
 * @param {string} html 表单html代码
 * @param {string} method 数据提交方式(post|get)
 * @param {function} callback 回调函数
 * @param {String} resType 是否xml格式
 * @param {String} msg 提示信息
 */
ModuleManager.prototype.execSubmit = function (html, method, callback, resType, msg) {
    MM.showMsg(msg);
    var cb = callback;
    var rt = resType || "";
    var am = {
        method: method,
        call: function (au) {
            MM.hideMsg(true);
            if (cb) {
                cb(au);
            }
        },
        resType: rt,
        encode: gMain.charset || "gb2312"
    };
    Ajax.submit(html, am);
};

/**
 * 需要异步请求数据
 * @param {string} o 模块名称
 * @param {function} cb 回调函数
 * @param {String} msg 提示信息
 * @param {boolean} isNotActive 是否不激活模块
 */
ModuleManager.prototype.getModuleByAjax = function (o, cb, msg, isNotActive, oldsid) {
    var data = MM[o].data, _this = this, arg = arguments;
    var target;
    if (data.fid === 7) {
        data.order = "modifyDate";
        target = "blank";
    }
    if (o.indexOf("sys") == 0 || o.indexOf("user") == 0) {
        data.total = CC.getPageSize();
    }
    var fid = MM[o].fid;
    var failcb = function (ao) {
        if (ao.code == "FA_NEED_AUTH2" || ao.failCode == "FA_NEED_AUTH2") {
            MM[gConst.folderMain].authenticate2(function () {
                CC.goFolder(fid, o, true);
            });
        }
    };
    MM.initModule(o);
    if (data instanceof Array) {
        MM.seqRequestCB(data, MM[o].call, null, MM[o].msg);
    } else {
        var reqData = {
            func: MM[o].func,
            data: data,
            call: function (ao) {
                MM.loadModuleData(o, ao, isNotActive, cb, oldsid, target);
            },
            failCall: function () {
                CC.error(o, MM[o].text, function () {
                    _this.getModuleByAjax.apply(_this, arg);
                });
            },
            param: "&norefreshSid=" + ( window.nsid !== void 1 ? window.nsid : 0),
            msg: msg
        };
        if(typeof(MM[o].failCall) == 'function'){
            reqData.failCall = MM[o].failCall;
        }
        if (MM[o].reqtype == "api") {
            MM.mailRequestApi(reqData);
        } else {
            MM.mailRequest(reqData);
        }
    }
};

ModuleManager.prototype.loadModuleData = function (o, ao, isNotActive, cb, oldsid, target) {
    CM[o] = ao;
    MM.createModule(o, null, isNotActive, oldsid, target);
    if (typeof(cb) == "function") {
        cb();
    }
};

/**
 * Ajax请求
 * WebApp服务器/写信
 * @param {Object} obj json对象格式，定义如下：<br>
 *  func:请求的funcid
 *    data:post内容
 *  call:回调函数
 *  failCall:失败回调函数
 *  msg:显示的提示加载信息
 *  url:地址
 */
ModuleManager.prototype.mailRequestApi = function (obj) {
    var xmlHttp = MM.getRmXMLRequest();
    obj.url = obj.url || gConst.apiPostPath;
    obj.xmlHttp = xmlHttp;
    obj.param = "&norefreshSid=" + ( window.nsid !== void 1 ? window.nsid : 0) + "&from=webapp";
    this.mailRequest(obj);
};

/**
 * Ajax请求
 * @param {Object} obj json对象格式，定义如下：<br>
 *  func:请求的funcid
 *    data:post内容
 *  call:回调函数
 *  failCall:失败回调函数
 *  msg:显示的提示加载信息
 */
ModuleManager.prototype.mailRequestWebApi = function (obj) {
    var p = this;
    var xmlHttp = Ajax.getXMLHttp();
    obj.url = obj.url;
    obj.xmlHttp = xmlHttp;
    this.mailRequest(obj);
};

ModuleManager.prototype.getRmXMLRequest = function () {
    var apiFrm, xmlHttp;
    if (!IsSimple) {
        apiFrm = $(gConst.ifrmRmSvr).contentWindow;
        xmlHttp = apiFrm.getXMLHttp();
    } else {
        xmlHttp = Ajax.getXMLHttp();
    }
    return xmlHttp;
}

/**
 * Ajax请求
 * @param {Object} obj json对象格式，定义如下：<br>
 *  func:请求的funcid
 *    data:post内容
 *  call:回调函数
 *  failCall:失败回调函数
 *  msg:显示的提示加载信息
 *  xmlHttp: ajax请求对象
 *  url: 请求的url，不传默认请求AppServer
 */
ModuleManager.prototype.mailRequest = function (obj) {
    var p = this;
    var xmlHttp;
    try {
        xmlHttp = MM.getRmXMLRequest();
        var f1 = obj.call, f2 = obj.failCall || MM.failCallBack;
        var funcid = obj.func;
        var param = obj.param || "";
        var url = obj.url || gConst.reqUrl;
        if (obj.params) {
            for (var k in obj.params) {
                if (k && obj.params[k]) {
                    param += '&' + k + '=' + obj.params[k].toString().encodeHTML();
                }
            }
        }
        if (funcid) {
            url += "?func=" + funcid + "&sid=" + gMain.sid + param;
        }
        if (!funcid && !url) {
            return;
        }
        if (obj.msg) {
            MM.showMsg(obj.msg);
        }
        var ao = {
            url: url,
            mailCall: function (data, ru) {
                if (MM.beforeResp(data)) {
                    if (typeof(f1) == "function") {
                        f1(data);
                    }
                } else {
                    if (typeof(f2) == "function") {
                        f2(data, ru);
                    }
                }
                MM.hideMsg();
            },
            failCall: function (data, ru) {
                if (typeof(f2) == "function") {
                    f2(data, ru);
                }
                MM.hideMsg();
            },
            async: obj.async,
            xmlHttp: xmlHttp
        };
        if (obj.xmlHttp) {
            ao.xmlHttp = obj.xmlHttp;
        }
        if (obj.data) {
            ao.data = this.getAjaxXml(obj.data);
        }
        Ajax.mailRequest(ao);
    } catch (exp) {
        ch("ModuleManager.mailRequest", exp);
        MM.hideMsg();
    }
};

/**
 * Ajax请求
 * @param {Object} obj json对象格式，定义如下：<br>
 *  func:请求的funcid
 *    data:post内容
 *  call:回调函数
 *  failCall:失败回调函数
 *  msg:显示的提示加载信息
 *  xmlHttp: ajax请求对象
 *  url: 请求的
 */
ModuleManager.prototype.doService = function (obj) {
    var p = this;
    var apiFrm, xmlHttp;
    try {
        var url = gMain.urlService;
        var absUrl = obj.absUrl || "";
        var f1 = obj.call, f2 = obj.failCall || MM.failCallBack;
        var funcid = obj.func;
        var param = obj.param || "";
        if (obj.params) {
            for (var k in obj.params) {
                if (k && obj.params[k]) {
                    param += '&' + k + '=' + encodeURIComponent(obj.params[k]);
                }
            }
        }

        if (absUrl) {
            obj.url = obj.url || "";
        }

        //如果是云通讯录接口(obj.url == /s)，不需要gMain.urlService  (webmail/service)
        if (obj.isNotAddUrl) {//判断是否需要在URL前加webmail
            url = obj.url;
        }
        else {
            if (obj.url == gMain.rmSvrAppPath) {
                url = obj.url;
            }
            else {
                if (Vd.checkUrl(obj.url)) {
                    url = obj.url;
                }
                else if (absUrl) {
                    url = absUrl;
                }
                else {
                    url += obj.url;
                }
            }
        }
        if (funcid) {
            url += "?func=" + funcid + "&sid=" + gMain.sid + param;
        }
        if (!funcid && !url) {
            return;
        }
        if (obj.msg) {
            MM.showMsg(obj.msg);
        }
        var ao = {
            url: url,
            callback: function (data, ru) {
                if (MM.beforeResp(data)) {
                    if (typeof(f1) == "function") {
                        f1(data);
                    }
                } else {
                    if (typeof(f2) == "function") {
                        f2(data, ru);
                    }
                }
                MM.hideMsg();
            },
            failCall: function (data, ru) {
                if (typeof(f2) == "function") {
                    f2(data, ru);
                }
                MM.hideMsg();
            },
            async: obj.async,
            method: obj.method || "POST",
            head: ["Content-Type", "text/javascript; charset=utf-8"],
            noSetCT: true,
            resType: "json"
        };
        if (obj.data) {
            ao.data = this[obj.dataType == 'xml' ? 'getAjaxXml' : 'getAjaxJson'](obj.data);
        }
        Ajax.request(ao);
    } catch (exp) {
        ch("MM.doService", exp);
        MM.hideMsg();
    }
};

ModuleManager.prototype.failCallBack = function (ao, url) {
    /*{
     'code':'FA_SECURITY',
     'messages':[{
     'severity':'ERROR',
     'summary':'Cookie not matched!'}]}
     */
    ao = ao || {};
    if (typeof(ao) == "object") {
        var code = ao.code;
        if (code == "FA_INVALID_SESSION" || code == "FA_SECURITY" || ao.errorCode == 2012 || ao.errorCode == 2053) {
            WLogin.show();
            //CC.alertNoSysClose(Lang.Mail.FA_INVALID_SESSION, Main.doSessionOut, Lang.Mail.sys_LoginOT);
        }
        else {
            var msg = ao.summary || "";
            var errorCode = ao.errorCode || code;
            var s = Lang.Mail.fail;
            if (IsDebug) {
                s += top.Lang.Mail.Write.cuowudaima + errorCode + "<br>" + msg;//<br>错误代码：
            }
            //if (msg&&errorCode) {
            //CC.alert(s, null, Lang.Mail.sys_SystemInfo);
            //} else if(code) {
            //CC.alert(Lang.Mail.sys_UnKnowErrorMsg, null, Lang.Mail.sys_UnKnowError);
            //}
        }
        Util.writeLogError(gConst.logFunc.js, url, "method=MM.failCallBack | code=" + (ao.code || code) + " | summary=" + (ao.summary || ""));
    } else {
        Util.writeLogError(gConst.logFunc.js, url, "method=MM.failCallBack | summary=response is not object. | resp=" + ao);
    }
};

/**
 * 串行调用
 * @param {object} arr 串行调用参数
 * 按以下格式调用：
 * [
 {
     func: "",
     "var": {}
 }
 ]
 * @param {function} cb 回调函数
 * @param {function} fcb 失败回调函数
 * @param {string} msg 提示信息
 */
ModuleManager.prototype.seqRequest = function (arr, cb, fcb, msg, params) {
    var obj = {
        func: gConst.func.seq,
        data: {
            items: arr
        },
        call: cb,
        failCall: fcb,
        msg: msg,
        params: params
    };
    MM.mailRequest(obj);
};
ModuleManager.prototype.seqRequestCB = function (data, cb, fcb, msg, params) {
    data = data || [];
    cb = cb || [];
    var isOk = false;
    cb = (typeof(cb) == "function") ? cb : Util.emptyFunction;
    fcb = (typeof(fcb) == "function") ? fcb : Util.emptyFunction;
    if (data && data.length) {
        var seqCallBack = function (au) {
            if (au.code == gConst.statusOk) {
                var td = au.result;
                if (td && td.length >= data.length) {
                    for (var i = 0; i < data.length; i++) {
                        isOk = (td[i] == 0) ? true : false;
                        if (!isOk) {
                            fcb(td[i]);
                            return;
                        }
                    }
                    if (isOk) {
                        cb(au);
                    } else {
                        fcb(au);
                    }
                }
            }
        };
        MM.seqRequest(data, seqCallBack, fcb, msg, params);
    }
};

/**
 * 用于异步获取模块数据
 * @param {string} funic 请求的s模块id
 * @param {string} 参数或post数据
 * @param {function} wo 回调函数
 * @param {string} msg 加载提示信息
 */
ModuleManager.prototype.ajaxRequest = function (funcid, data, wo, msg) {
    var ao = {
        func: funcid,
        data: data,
        call: wo,
        msg: msg
    };
    this.mailRequest(ao);
};


ModuleManager.prototype.request = function (o, cb, msg, isNotActive) {
    this.getModuleByAjax(o, cb, msg, isNotActive);
};

/**
 * 初始始化模块
 * @param {string} o 模块id
 */
ModuleManager.prototype.initModule = function (o) {
    //是否要重新初始化数据
    var bReInint = false;

    /*
     * 如果是点击附件管理，而且邮件夹有安全锁，安全锁刚被开通，则要重新初始化化数据
     * gMain.hasPassFlag 判断是否有加锁邮件夹
     * gMain.lock_close 判断安全锁是否锁定[true:已经被锁住 ; false:已经解锁了]
     * gMain.hasSearchAttachList_lockOpen 表示已经在解锁后搜索过一次，这次点击就不用重新初始化了
     */
    if (MM[o].name == "attachList" && window.gMain && gMain.hasPassFlag && !gMain.lock_close && !gMain.hasSearchAttachList_lockOpen && MM[o].inited) {
        bReInint = true;
        gMain.hasSearchAttachList_lockOpen = true;
    }

    if (!MM[o].inited || bReInint) {
        try {
            var bn = o.substring(0, 1).toUpperCase() + o.substr(1);
            var c = cmail.createClass();
            Object.extend(c.prototype, new window[bn]());
            var ao = new c();
            ao = c = null;
            MM[o].inited = true;
            this.hash.add(o, MM[o]);
        }
        catch (exp) {
            ch("fMMInitModule", exp);
            return false;
        }
    }
    return true;
};
/***
 * 执行指定模块的方法
 * @param {Object} o
 * @param {Object} ei
 * @param {Object} aj
 */
ModuleManager.prototype.goTo = function (o, ei, aj) {
    var args = [];
    var argOs = arguments;
    for (var i = 3; i < argOs.length; i++) {
        args.push(argOs[i]);
    }
    if (this.initModule(o)) {
        if (aj == "0") {
            //A模块调用A自己的ei方法  ： MM.goTo("folderMain", "refreshBody", 0);
            return MM[o][ei].apply(MM[o], args);
        }
        else if (aj == "1") {
            return MM[o][ei];
        }
        else if (aj == "2") {
            MM[o][ei] = argOs[3];
        }
    }
    else {
        var ao = {
            description: "module not loaded!"
        };
        throw ao;
    }
};


ModuleManager.prototype.onAfterInit = function (o) {

};

ModuleManager.prototype.mainResize = function () {
    var objDivTopTab = $(gConst.divTopTab),
        objDivTop = $(gConst.divTop),
        objDivMain = $(gConst.divMain),
        objDivLeft = $(gConst.divLeft),
        leftContainer = $(gConst.divBox);

    var objUl = $(gConst.menuC.mail);

    setH();
    function setH() {
        try {
            var pos = El.pos($(gConst.menuC.mail));
            var sh = 0;
            var dh = CC.docHeight();
            var thTab = El.height(objDivTopTab) || 0;
            var th = El.height(objDivTop);
            //var mh = dh - thTab - th - 8;
            var mh = dh - th;//干掉上边黑色条占得距离
            var ch = 150;
            var size = jQuery(objUl).find('li').size() + 1;
            var singleHeight = 26;

//        sh = mh - size * singleHeight - 20;
            sh = mh - jQuery(objUl).outerHeight() - 20 - 32;
//      sh = mh - ch - 53-26;
//      if(document.getElementById("12"))
//          sh = sh-26;
            if (El.visible($(gConst.menuC.service))) {
                El.height($(gConst.menuC.service), sh);
            }

            if (mh > 0 && sh > 0 && pos[1] > 0) {
                El.height(objDivLeft, mh);
                El.height(leftContainer, mh);
                El.height(objDivMain, mh);
            } else {
                window.setTimeout(setH, 1000);
            }
        } catch (e) {
        }
    }
};

ModuleManager.prototype.onAfterExit = function (o) {
    MM[o].isExit = true;
    window.setTimeout("MM['" + o + "'].isExit=false", 1);
};


ModuleManager.prototype.onBeforeGet = function (o) {
};

ModuleManager.prototype.onAfterGet = function (o) {
};

ModuleManager.prototype.onBeforeCreate = function (o) {
};

ModuleManager.prototype.onAfterCreate = function (o) {
    MM.initModule(o);
    MM[o]._resize(o);
    $(gConst.divMain).scrollTop = 0;
};


ModuleManager.prototype.getModuleByFid = function (id) {
    var obj = MM.getFolderObject(id);
    if (obj) {
        return CC.getFolderTypeName(obj.type) + id;
    }
};

ModuleManager.prototype.getFidByModule = function (o) {
    return MM[o].fid;
};

ModuleManager.prototype.getFolderObject = function (id) {
    var ao = null;
    var fm = CM[gConst.folderMain]["var"];
    Util.each(fm, function (i, value) {
        if (id == value.fid) {
            ao = value;
        }
    });
    return ao;
};

ModuleManager.prototype.getFolderObjectFromTree = function (type, fid) {
    var ao = null, ret = null;
    var fm = MM[gConst.folderMain][type + "Folders"];
    var func = function (folders) {
        var f = null;
        folders = folders || [];
        for (var i = 0; i < folders.length; i++) {
            f = folders[i];
            if (fid == f.fid) {
                ret = f;
                return;
            }
            func(f.nodes);
        }
    };
    func(fm);
    return ret;
};

/**
 * 通过Ajax请求方法
 * @param {Object} obj json对象格式，定义如下：<br>
 *  url:请求的url
 *    data:post内容
 *  call:成功回调函数
 *  failCall:失败回调函数
 *  msg:显示的提示加载信息
 *  resType:请求资源类型，html
 *  method:get|post,默认post
 *  encode: 编码，默认utf-8
 *  xmlHttp: ajax请求对象
 */
ModuleManager.prototype.req = function (obj) {
    var p = this;
    var msg = obj.msg;
    try {
        if (msg) {
            p.showMsg(msg);
        }
        obj.resType = obj.resType || "html";
        obj.method = obj.method || "post";
        var fc = obj.failCall;
        var func = obj.call;
        var failCall = function (data) {
            p.hideMsg();
            if (typeof(fc) == "function") {
                fc(data);
            }
        };
        var call = function (data) {
            p.hideMsg();
            if (typeof(func) == "function") {
                func(data);
            }
        };
        obj.failCall = failCall;
        obj.callback = call;
        Ajax.request(obj);
    } catch (exp) {
        ch("ModuleManager.req", exp);
        p.hideMsg();
    }
};


ModuleManager.prototype.post = function (url, data, cb, msg) {
    MM.req({url: url, data: data, method: "post", cal: cb, msg: msg});
};

ModuleManager.prototype.ajaxGet = function (url, cb, msg) {
    MM.req({url: url, data: null, method: "get", cal: cb, msg: msg});
};

/**
 * 跳转到指定标签
 * @param {Object} url 链接的url
 * @param {Object} id id
 * @param {Object} name 标签名称
 * @param {Object} g 组id
 * @param {Object} mt 模块类型
 */
ModuleManager.prototype.goOutLink = function (url, id, name, g, mt) {
    g = g || id;
    mt = mt || 'outLink';
    var mod = MM.goTo("outLink", "exist", 0, id);
    if (mod) {
        var oldurl = mod.url;
        mod.url = url;
        mod.text = name;
        mod.moduleType = mt;
        if (GE.tab.exist(id)) {
            GE.tab.title(id, name);
            if (url != oldurl) {
                $(gConst.ifrm + id).src = url;
            }
            GE.tab.active(id);
        }
        //MM.getModule(mod.name);
    }
    else {
        MM.goTo("outLink", "oldurl", 2, url);
        MM.goTo("outLink", "MulTab", 2, true);
        MM.goTo("outLink", "url", 2, url);
        MM.goTo("outLink", "text", 2, name);
        MM.goTo("outLink", "name", 2, id);
        MM.goTo("outLink", "group", 2, g);
        MM.goTo("outLink", "moduleType", 2, mt);
        MM.getModule("outLink", false, id);
    }
};

ModuleManager.prototype.beforeResp = function (au) {
    if (au && au.code == gConst.statusOk) {
        return true;
    } else {
        var code = au.code;
        if (code == "FA_INVALID_SESSION" || code == "FA_SECURITY" || au.errorCode == 2012 || au.errorCode == 2053) {
            WLogin.show();
            //CC.alertNoSysClose(Lang.Mail.FA_INVALID_SESSION, Main.doSessionOut, Lang.Mail.sys_LoginOT);
        }
        return false;
    }
};

function fGEOnBeforeInit() {
    //EV.observe(document, "click", fGEDocClick);    
    EV.observe(window, "resize", fGEDocResize);
    EV.observe(document, "keypress", fGEKeyPress);
}

function fGEOnAfterInit() {
}

function fGEDocClick() {
    var aa = EV.getTarget();
    if (aa && aa.tagName && aa.tagName.toUpperCase() == "A" && aa.href.indexOf("javascript:fGoto()") > -1) {
        aa.blur();
        EV.stopEvent();
    }
}
function fGEDocResize() {
    if (GE.tab.curid) {
        var id = GE.tab.curid;
        var lrm = (id.indexOf('_') > -1) ? id.substr(0, id.indexOf('_')) : id;// module=id(inbox,sent,addr,fax,mms,sms)  module+"_"+(1)-->id()
        MM[lrm]._resize();
    } else {
        MM.mainResize();
    }
}

function fGEKeyPress(e) {
    if (EV.getCharCode(e) == 13) {
        var target = EV.getTarget(e);
        var t = El.getNodeType(target, true);
        if (t != "text" && t != "textarea") {
            EV.stopEvent(e);
        }
    }
    return true;
}


/**
 * 模块管理类 ModuleManager <br>
 *
 */

/**
 * 初始化模块
 */
function MMInit() {
    cmail.ModuleManager = cmail.createClass();
    var omm = cmail.ModuleManager;
    omm.prototype = new ModuleManager();
    omm.prototype.name = "ModuleManager";
    omm.prototype.laterRequestModule = null;
    omm.prototype.hash = null;
    /**
     * 模块配置信息
     */
    omm.moduleConfig = {
        //[needRequest,text,name,url,group]
        outLink: [false, Lang.Mail.tab_Link, "", 0],
        //home : [false, Lang.Mail.tab_Home, "", 0],
        folderMain: [true, Lang.Mail.tab_Folder, "", 0],
        home: [false, Lang.Mail.tab_Home, "", 0],
        folder: [true, "", "", 1],
        compose: [false, Lang.Mail.tab_Compose, "", 2],
        readMail: [true, Lang.Mail.tab_ReadMail, "", 3],
        //searchMail : [false, Lang.Mail.tab_MailSearch, "",4],
        setting: [false, Lang.Mail.tab_Setting, "", 5],
        address: [false, "", "", 6],
        sms: [false, "", "", 7],
        mms: [false, "", "", 8],
        fax: [false, "", "", 9],
        attachList: [false, Lang.Mail.ConfigJs.attachManage, "", 11]
        //deliver:[true,"投递状态","",11]
    };
    omm.prototype.ModuleClass = cmail.createClass();
    omm.prototype.ModuleClass.prototype = {
        isLoaded: false,
        needRequest: true,
        name: null,
        text: "",
        getHtml: null,
        init: cmail.emptyFunction(),
        reset: cmail.emptyFunction(),
        exit: function () {
            return true;
        },
        response: cmail.emptyFunction(),
        resize: cmail.emptyFunction(),
        isModule: true,
        func: "",
        group: 0,
        execSubmit: omm.prototype.execSubmit,
        getToolbar: function () {
            return [];
        },
        getToolbarMenu: function () {
            return [];
        },
        initialize: function (needRequest, text, name, url, group) {
            var methodArr = ["getHtml", "init", "reset", "exit", "response", "resize"];
            cmail.initMethod(omm.prototype.ModuleClass, methodArr);
            this.needRequest = needRequest;
            this.text = text;
            this.name = name;
            this.url = url;
            this.group = group;
        }
    };
    /**
     * 模块管理类
     */
    window.MM = new cmail.ModuleManager();
    /**
     * 通用引擎类
     */
    window.GE = new cmail.GlobeEngine();
    cmail.CoremailManager = cmail.createClass();
    window.CM = new cmail.CoremailManager();

    new Hashtable(omm.moduleConfig).each(function (ao, value) {
        //needRequest,text,name,url,group
        MM[ao] = new cmail.ModuleManager.prototype.ModuleClass(value[0], value[1], ao, value[2], value[3]);
        MM.observe(ao, "onafterinit", MM.onAfterInit);
        MM.observe(ao, "onafterresize", MM.mainResize);
        MM.observe(ao, "onafterexit", MM.onAfterExit);
    });

    MM.observe(GE, "onbeforeinit", fGEOnBeforeInit);
    MM.observe(GE, "onafterinit", fGEOnAfterInit);
    MM.observe(MM, "onbeforeget", MM.onBeforeGet);
    MM.observe(MM, "onafterget", MM.onAfterGet);
    MM.observe(MM, "onbeforecreate", MM.onBeforeCreate);
    MM.observe(MM, "onaftercreate", MM.onAfterCreate);
}

function Frm_Init() {

    //创建MM,CM,HM,GE;
    GEInit();
    MMInit();

    GE.tab = new TabLabel();
    //GE.tab.call[0] = MM.updateBody;
    GE.tab.call.push(function () {
        CC.updateHome();
    });
    GE.tab.composeTabs = {};
    GE.Drag = {}; //保存拖动事件处理中的全局变量
    GE._init();
    CC.getShowFolderList();
}


