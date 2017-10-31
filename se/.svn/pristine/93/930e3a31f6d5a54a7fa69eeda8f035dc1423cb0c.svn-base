/**
 * 公共组件类
 * 主要包含了显示隐藏提示信息，公共弹出Div调用等功能。
 * @class
 */
var CC = function () {
};
CC.isSetTimeOut = false;
/**
 * 显示加载提示信息
 * @param {string} rb 提示信息
 * @param {boolean} willHide 是否自动隐藏
 * @param {boolean} isOpactity 是否显示遮罩层
 * *@param {string} type 哪个模块的提示框
 */
CC.showMsg = function (rb, willHide, isOpactity, type) {
    //var objMsg = $(gConst.divMsg);
    objMsg = $("tipsfinish");
    if (type == "option") {
        //objMsg = $("tipsfinish");
        rb = "<div class=\"tips-box tips-green\">" + rb + "</div>";
    }
    else if (type == "error") {
        //objMsg = $("tipsfinish");
        rb = "<div class=\"tips-box tips-red\">" + rb + "</div>";
    }
    else if (type == "caution") {
        rb = "<div class=\"tips-box tips-yellow\">" + rb + "</div>";
    }
    else {
        rb = (rb || Lang.Mail.sys_LoadingData) + Lang.Mail.sys_Waiting;
        rb = "<div class=\"tips-box tips-green\"><img id='loading_ajax' src='" + gMain.resourceRoot + "/images/loading16x16.gif' border=0 />" + rb + "</div>";
    }
    if (objMsg) {
        if (isOpactity) {
            CC.showOpactity();
        }
        objMsg.innerHTML = rb;
        El.show(objMsg);
        if (willHide) {
            window.setTimeout(function () {
                CC.isSetTimeOut = false;
                if (!CC.isSetTimeOut) {
                    objMsg.innerHTML = "";

                }

            }, 5000);
            CC.isSetTimeOut = true;
        }
    }
};
/**
 * 隐藏加载提示信息
 */
CC.hideMsg = function (isOpactity) {
    //if(isOpactity){
    //	CC.hideOpactity();
    //}
    if ($("loading_ajax")) {
        //El.hide("tipsfinish");
        $("tipsfinish").innerHTML = "";
    }
};
CC.alertTips = function (rb, wo, title) {
    var ao = {
        id: 'alertTips',
        title: title,
        type: 'div',
        text: rb,
        zindex: 9999,
        buttons: [
            {text: Lang.Mail.Ok, clickEvent: wo}
        ],
        dragStyle: 1
    };
    CC.msgBox(ao);
};


/**
 * 错误监控
 * @param id
 * @param title
 * @param msg
 */
CC.error = function (id, title, callback) {
    window.top.ERROR = true;
    CC.showMsg("加载失败", true, false, "error");
    CC.goOutLink("/error.html", id, title);
    //监控元素创建
    var timer = setInterval(function () {
        var ifr = jQuery("#ifrm_outLink_" + id), doc, btn, wif;
        if ((wif = ifr[0])) {
            ifr.ready(function () {
                var t = (+new Date);
                if ((doc = wif.contentDocument || wif.contentWindow) && (btn = jQuery("a.b-btn", doc))[0]) {
                    //绑定事件处理函数
                    btn.attr("data-timer", t).click(function (event) {
                        CC.showMsg();
                        callback && callback();
                        doc = null;
                        btn = null;
                        wif = null;
                        ifr = null;
                        delete window.top.ERROR;
                        return false;
                    });
                }
            });
            clearInterval(timer);
            timer = null;
        }
    }, 300);
};

/**
 * 显示遮罩层
 * @param {Object} zindex 遮罩层的z-index值
 */
CC.showOpactity = function (zindex, time) {
    var obj = $(gConst.divOpactity);
    obj.style.zIndex = zindex || 999;
    El.show(obj);
    if (time) {
        setTimeout(function () {
            CC.hideOpactity();
        }, time * 1000);
    }
};
/**
 * 隐藏遮罩层
 */
CC.hideOpactity = function () {
    var obj = $(gConst.divOpactity);
    El.hide(obj);
};

CC.showTransparent = function (zindex, time) {
    var obj = $(gConst.shareLayer);
    if (!obj) {
        return;
    }
    El.show(obj);
    if (time) {
        setTimeout(function () {
            CC.hideTransparent();
        }, time * 1000);
    }
};

CC.hideTransparent = function () {
    var obj = $(gConst.shareLayer);
    El.hide(obj);
};

/**
 *  得到iframe
 * @param {string} id iframe id
 * @param {sting} url url地址
 * @param {string} sc 是否有滚动条(no,yes,auto)
 * @param {string} styles 额外style样式
 */
CC.getIframe = function (id, url, sc, styles) {
    url = url || "about:blank";
    sc = sc || "no";
    styles = styles || '';
    var html = '<iframe id="' + gConst.ifrm + id + '" name="' + gConst.ifrm + id + '" style="width:100%;height:100%;' + styles + '" frameborder="0" scrolling="' + sc + '"';
    if (url) {
        html += ' src="' + url + '"';
    }
    html += '></iframe>';
    return html;
};

CC.getFlash = function (id, url, opt) {
    var str_swf = "<object class=\"{0}\" classid=\"clsid:d27cdb6e-ae6d-11cf-96b8-444553540000\" "
        + "codebase=" + window.location.protocol + "\"://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0\" "
        + " width=\"{1}\" height=\"{2}\" id=\"{3}\" align=\"middle\">"
        + "<param name=\"allowScriptAccess\" value=\"sameDomain\" />"
        + "<param name=\"movie\" value=\"{4}\" />"
        + (obj.transparent ? "<param name=\"wmode\" value=\"transparent\" />" : "")
        + "<param name=\"quality\" value=\"high\" />"
        + "<param name=\"FlashVars\" value=\"{5}\" />"
        + "<embed "
        + (obj.transparent ? " wmode=\"transparent\" " : "")
        + "width='{1}' height='{2}' name='{3}'  "
        + "src='{4}' FlashVars='{5}' "
        + "quality='high' bgcolor='#F4FBFF' "
        + "align=\"middle\" allowScriptAccess=\"sameDomain\" "
        + "type=\"application/x-shockwave-flash\" pluginspage=" + window.location.protocol + "\"://www.macromedia.com/go/getflashplayer\" />"
        + "</object>";
    return str_swf.format(
            obj.className || "",
            obj.width || "",
            obj.height || "",
            obj.id || "",
            obj.url || "",
            obj.flashVar || ""
    );
};

CC.createOpactity = function (id, index) {
    var div = El.createElement("div");
    div.innerHTML = '<img alt="" src="' + gMain.resourceRoot + '/images/place.gif"  width="100%" height="100%"/>';
    div.id = "shareLayer_" + (id || "");
    div.style.zIndex = index || 999;
    div.className = "shareLayer";
    document.body.appendChild(div);
    El.hide(div);
    return div;
};

/**
 * 返回窗口高度
 * @return {number} 高度
 * @example
 * var h = CC.docHeight();
 */
CC.docHeight = function () {
    return El.docHeight();
};
/**
 * 返回窗口高度
 * @return {number} 高度
 * @example
 * var h = CC.DocHeight();
 */
CC.DocHeight = function () {
    return CC.docHeight();
};

/**
 * 返回窗口宽度
 * @return {number} 宽度
 */
CC.docWidth = function () {
    var w = El.docWidth();
    return((w < 600) ? 600 : w);
};
/**
 * 返回窗口宽度
 * @return {number} 宽度
 */
CC.DocWidth = function () {
    return CC.docWidth();
};

/**
 * 显示一个提示信息。alert形式
 * @param {string} rb 提示的内容
 * @param {function} wo 确定按钮的回调函数
 * @param {string} text 标题
 */
CC.alert = function (rb, wo, title) {
//wo=function(){var my =$("divDialog"+'confirm' + (addId || "")); my.parentNode.removeChild(my);$("#shareLayer").style.display="none";};
    var ao = {
        id: 'alert',
        title: title,
        type: 'text',
        text: rb,
        zindex: 9999,
        buttons: [
            {text: Lang.Mail.Ok, clickEvent: wo}
        ],
        dragStyle: 1
    };
    CC.msgBox(ao);
};

/**
 * 显示一个提示信息。alert形式，没有关闭按钮
 * @param {string} rb 提示的内容
 * @param {function} wo 确定按钮的回调函数
 * @param {string} text 标题
 */
CC.alertNoSysClose = function (rb, wo, title) {
    var ao = {
        id: 'alertNoSystemClose',
        title: title,
        type: 'text',
        text: rb,
        zindex: 9999,
        buttons: [
            {text: Lang.Mail.Ok, clickEvent: wo}
        ],
        noSysClose: true,
        dragStyle: 1
    };
    CC.msgBox(ao);
};

/**
 * 显示一个确认窗口。Confirm形式.
 * @param {string} rb 提示的内容.
 * @param {function} wo 确定按钮的回调函数.
 * @param {string} text 标题
 * @param {function} cancelCallbak 取消按钮回调函数
 */
CC.confirm = function (rb, wo, title, cancelCallbak, addId) {
    /*
     if (rb.length < 20) {
     rb = "<strong>" + rb + "</strong>";
     }
     */
    //cancelCallbak = function(){var my =$("divDialog"+'confirm' + (addId || "")); my.parentNode.removeChild(my);$("#shareLayer").style.display="none";}
    //wo=function(){wo;cancelCallbak; }
    var ao = {
        id: 'confirm' + (addId || ""),
        width:360,
        title: title,
        type: 'text',
        text: rb,
        zindex: 1090,
        dragStyle: 1,
        buttonType: 'confirm',
        buttons: [
            {text: Lang.Mail.Ok, clickEvent: wo},
            {text: Lang.Mail.Cancel, clickEvent: cancelCallbak, isCancelBtn: true}
        ]
    };
    CC.msgBox(ao);
};
CC.showDiv = function (rb, wo, title, cancelCallbak, addId, width, buttons) {
    var ao = {
        id: 'confirm' + (addId || ""),
        title: title,
        type: 'div',
        text: rb,
        changeStyle: false,
        dragStyle: 1,
        width: width,
        buttons: [
            {text: Lang.Mail.Ok, clickEvent: wo},
            {text: Lang.Mail.Cancel, clickEvent: cancelCallbak, isCancelBtn: true}
        ].concat(buttons || [])
    };
    CC.msgBox(ao);
};
/**
 * 显示一个带文本框的输入窗口。Prompt形式
 * @param {object} 提示内容信息对象
 * @param {function} wo 确定按钮的回调函数
 * @param {string} text 标题
 * @param {function} cancelCallbak 取消按钮回调函数
 * @example
 * <pre>
 *  CC.prompt({
 	id:"test1",  //文本框id
 	html:"请输入联系人组:$TEXT$",  文本框要显示的内容 $TEXT$ 是模板变量，将会替换成文本框对象
 	maxlength:20,  			//文本框最大长度
 	okText:"",     			//确定按钮是显示的文字
 	cancelText:"",			//取消按钮要显示的文字
 	attr:"",   				//
 	value: "test",			//文本框初始化的值 
 	},function(objText,cb){
 		if(!objText.value){cb("不能为空");}
 	},"标题",cancelCallback)
 */
CC.prompt = function (oinput, wo, title, cancelCallback) {
    oinput = oinput || {};
    var id = 'prompt_' + (oinput.id || "defaultText");
    var textId = id + '_input';
    var msgId = id + '_msgError';
    var ml = oinput.maxlength || 20;
    var size = oinput.seize || 20;
    var html = oinput.html || "$TEXT$";
    var okText = oinput.okText || Lang.Mail.Ok;
    var cancelText = oinput.cancelText || Lang.Mail.Cancel;
    var val = oinput.value || "";
    var attr = oinput.attr || "";
    html = html.replace('$TEXT$', ':&nbsp;<input type="text" id="' + textId + '" maxlength="' + ml + '" size="' + size + '" value="' + val + '" ' + attr + '/><br><p id="' + msgId + '" class="msgSet"></p>');
    function ok() {
        var r = false;
        if (typeof(wo) == 'function') {
            r = wo($(textId), function (str) {
                if (str) {
                    $(msgId).innerHTML = str;
                }
            });
        }
        return r;
    }

    function cancel() {
        var r = false;
        if (typeof(cancelCallbak) == 'function') {

            r = cancelCallback($(textId));
        }
        return r;
    }

    var ao = {
        id: id,
        title: title,
        type: 'text',
        text: html,
        zindex: 1090,
        dragStyle: 1,
        buttons: [
            {text: okText, clickEvent: ok},
            {text: cancelText, clickEvent: cancel, isCancelBtn: true}
        ]
    };
    CC.msgBox(ao);
    window.setTimeout(function () {
        var obj = $(textId);
        obj.focus();
        El.setCursorPos(obj);
    }, 100);
};

/**
 * 显示提示信息。<br>
 * 方法已过期，建议不要使用。可以用
 * CC.alert(),
 * CC.confirm(),
 * CC.prompt(),
 * CC.msgBox()
 * 四个方法代替<br>
 * @param {string} rb 内容
 * @param {function} wo 确定按钮回调函数
 * @param {string} text 标题
 * @param {boolean} hasCancel 是否有取消按钮
 * @param {function} cancelCallbak 取消按钮回调函数
 * @param {boolean} isPrompt 是否为prompt模式
 * @param {boolean} isNotOk 是否有确定按钮
 * @deprecated
 */
CC.showSysMsg = function (rb, wo, title, hasCancel, cancelCallbak, isPrompt, isNotOk) {
    if (typeof rb == "object") {
        rb = rb.html;
    }
    var btns = [];
    if (isNotOk) {
    } else if (hasCancel) {
        btns = [
            {text: Lang.Mail.Ok, clickEvent: wo},
            {text: Lang.Mail.Cancel, clickEvent: cancelCallbak, isCancelBtn: true}
        ];
    } else {
        btns = [
            {text: Lang.Mail.Ok, clickEvent: wo}
        ];
    }
    var ao = {
        id: '',
        title: title,
        text: rb,
        buttons: btns
    };
    CC.msgBox(ao);
};

/**
 * 显示一个html页面的Div <br>
 * Json 数据格式定义如下：<br>
 * <code>
 * var ao = {     			
 *   id:"example", 			
 *   title:"exampleTitle", 	
 *   url:"test.html", 		
 *   width:700, 			
 *   height:400, 
 *   scoll:"auto",			
 *   buttons:[{				
 *  			text:"确定",
 *   			clickEven:functin(){},
 *   			isCancelBtn:false
 *   		}],
 *   sysCloseEvent:false
 * };</code>
 * @param {object} ao json数据格式
 */
CC.showHtml = function (ao) {
    var id = ao.id || "";
    var title = ao.title;
    var url = ao.url;
    var w = ao.width;
    var h = ao.height ? ao.height + "px" : "100%";
    var scoll = ao.scoll || "no";
    var btn = ao.buttons || [];
    var zindex = ao.zindex || 1080;
    var noSysClose = ao.noSysClose || false;
    //var html = '<div id="divDialogHtml_'+id+'" style="width:'+(w-4)+'px;height:'+h+'">';
    var html = '<div id="divDialogHtml_' + id + '" style="height:' + h + '">';
    html += CC.getIframe("DialogHtml_" + id, url, scoll) + '</div>';
    var obj = {
        id: id,
        width: w,
        title: title,
        type: 'div',
        text: html,
        buttons: btn,
        zindex: zindex,
        noSysClose: noSysClose,
        sysCloseEvent: ao.sysCloseEvent
    };
    CC.msgBox(obj);
};


/**
 * 显示一个弹出Div
 * Json 数据格式定义如下：
 * var ao = {
 * 	id:"example",
 *  title:"exampleTitle",
 *  text:"测试",
 *  buttons:[{
 *				text:"确定,"
 *  		  	clickEven:functin(){},
 *  		  	isCancelBtn:false
 * 			}],
 * sysCloseEvent:false
 * };
 * @param {object} ao json数据格式
 */
CC.msgBox = function (ao) {
    ao = ao || {};
    var id = ao.id || "";
    var divDialogId = "divDialog" + id;
    var divDialogCloseId = "divDialogClose" + id;
    var title = (ao.title || Lang.Mail.sys_SystemInfo).encodeHTML();
    var text = ao.text;
    var btns = ao.buttons;

    var type = ao.type || 'div';
    var noSysClose = ao.noSysClose || false;
    var dragStyle = ao.dragStyle || 0;
    var changeStyle = ao.changeStyle || false;
    var objDivDialog = $(divDialogId);
    if (!objDivDialog) {
        objDivDialog = El.createElement("div", divDialogId, "dialog");
        document.body.appendChild(objDivDialog);
    } else {
        El.hide(objDivDialog);
    }
    var html = [];
    html[html.length] = '<div class="boxIframeTitle">';
    html[html.length] = '<h2><span>' + title + '</span></h2>';
    html[html.length] = '<a class="i_t_close" href="javascript:fGoto();" id="' + divDialogCloseId + '" ' + (noSysClose ? 'style="display:none;"' : '') + '>&nbsp;&nbsp;&nbsp;&nbsp;</a>';
    html[html.length] = '</div>';

    html[html.length] = '<div class="boxIframeMain">';
    html[html.length] = '<div class="boxIframeText">';

    if (type == "text") {
        html[html.length] = '<div class="pop-wrap">';
        html[html.length] = '<p class="msgDialog">' + text + '</p>';
        html[html.length] = '</div>';
    } else {
        html[html.length] = text;
    }

    if (btns && btns.length > 0) {
        html[html.length] = '<div class="boxIframeBtn">';
        html[html.length] = '<div class="topborder">';
        for (var i = 0; i < btns.length; i++) {
            var btnText = btns[i].text;
            var cls = '';
            if (btns[i]['class']) {
                cls = btns[i]['class'];
            }
            else {
                cls = (i == 1 ? "n_btn mt_8" : "n_btn_on mt_8");
            }
            html[html.length] = ' <a href="#" id="' + divDialogCloseId + 'btn_' + i + '"  class="' + cls + '"><span><span>' + btnText + '</span></span></a>';
        }
        html[html.length] = '</div>';
        html[html.length] = '</div></div>';
    }
    html[html.length] = '</div>';
    objDivDialog.innerHTML = html.join("");
    var objDivDialogDrag = objDivDialog.firstChild.firstChild;
    //CC.showOpactity(zindex-1);
    CC.showTransparent();
    El.show(objDivDialog);
    var h = objDivDialog.offsetHeight;
    var width = ao.width || (CC.isBigFont() ? 450 : 352);
    var height = h;
    var scrollTop = document.body.scrollTop;
    var x = (CC.docWidth() - width) / 2;
    var y = (CC.docHeight() - height) / 2;
    El.width(objDivDialog, width);
    //El.height(objDivDialog.firstChild,height);
    //El.width(objDivDialog.firstChild,width);
    //objDivDialog.style.width = width + "px";
    objDivDialog.style.left = x + "px";
    objDivDialog.style.top = y + "px";

    var sp = new Splitter(objDivDialog, function (dx) {
        if (dragStyle == 0) {
            objDivDialog.style.left = parseInt(objDivDialog.style.left, 10) + (dx[2] - dx[0]) + "px";
            objDivDialog.style.top = parseInt(objDivDialog.style.top, 10) + (dx[3] - dx[1]) + "px";
        }
    }, "wh", objDivDialogDrag, dragStyle);

    if (btns && btns.length > 0) {
        $(divDialogCloseId + "btn_0").focus();
    }
    if (Browser.isIE) {
        if (changeStyle) {
            var oc = objDivDialog.childNodes[1];
            new Hashtable(oc.getElementsByTagName("input")).each(function (i, ao) {
                if (ao.type == "text" || ao.type == "password") {
                    ao.className = "text";
                    doTextFocus(ao);
                }
            });
        }

        if (gMain.skinControlTypeId == 1 && Browser.version < 9) {
            jQuery("#shareLayer").attr("class", "");
        }
    }


    function btnClick() {
        var id = this.id;
        var i = $(id)["btnIndex"];
        var wo;
        if (i && btns && btns.length > 0) {
            wo = btns[i - 1].clickEvent;
        }
        var r = null;
        if (typeof(wo) == "function") {
            r = wo();
            //var my =$(divDialogId); my.parentNode.removeChild(my);CC.hideTransparent();
        }
        /*
         //系统关闭按钮（右上角的X）回调函数
         if (typeof(closeCallBack) == "function") {
         var flag = closeCallBack();//liuxingmi 增加了弹出框关闭按键钮回调事件响应.
         if(!flag){
         return flag;
         }
         }
         */
        if (!r) {
            var my = $(divDialogId);
            my.parentNode.removeChild(my);
            //El.hide(objDivDialog);
            //CC.hideOpactity();
            CC.hideTransparent();
            return false;
        }
    }

    var btnCancel = $(divDialogCloseId);
    var closeCallBack = function () {
        var flag = ao.sysCloseEvent()
        if (!flag)
            return flag;
        else {
            var my = $(divDialogId);
            my.parentNode.removeChild(my);
            CC.hideTransparent();
            //btnClick();
        }
    }
    if (btnCancel) {
        if (typeof(ao.sysCloseEvent) == "function") {

            btnCancel.onclick = closeCallBack;
            btnCancel.onmousedown = closeCallBack;
        }
        else {
            btnCancel.onclick = btnClick;
            btnCancel.onmousedown = btnClick;
        }
    }

    if (btns && btns.length > 0) {
        if (btns.length == 1 || ao.buttonType) {
            EV.observe(document, "keypress", doKeyPress);
        }
        for (var j = btns.length - 1; j >= 0; j--) {
            var btnObj = $(divDialogCloseId + 'btn_' + j);
            El.setAttr(btnObj, {btnIndex: j + 1});
            btnObj.onclick = btnClick;
            /*btnObj.onclick = function(){
             btnClick;
             //var my =$(divDialogId); my.parentNode.removeChild(my);$("shareLayer").style.display="none";
             };*/
            if (btns[j].isCancelBtn) {
                El.setAttr(btnCancel, {btnIndex: j + 1});
            }
        }
    }


    function doKeyPress(e) {
        var ev = EV.getEvent(e);
        var target = EV.getTarget(ev);
        var kc = (EV.getCharCode(ev) + "");
        if (kc == 13) {
            var btnObj = $(divDialogCloseId + 'btn_0');
            if (btnObj) {
                btnObj.onclick();
                return;
            }
        }
        if (kc == 27) {
            $(divDialogCloseId).onclick();
            return;
        }
        return true;
    }

    function doTextFocus(v) {
        EV.observe(v, "focus", function () {
            El.addClass(v, "focus");
        }, false);
        EV.observe(v, "blur", function () {
            El.removeClass(v, "focus");
        }, false);
    }
};

/**
 * 关闭弹出的Div
 * @param {string} ids 打开div的对象id
 */
CC.closeMsgBox = function (ids) {
    var id = ids || "";
    $("divDialogClose" + id).onclick();
};


/**
 * 用时间做随机数
 */
CC.getRnd = function () {
    return new Date().valueOf();
};

/**
 * 将页面滚动条滚动页面底部
 */
CC.scrollBottom = function () {
    document.body.scrollTop = CC.docHeight();
};

/**
 * 将页面滚动条滚动页面顶部
 */
CC.scrollTop = function () {
    document.body.scrollTop = 0;
};


/**
 * 将对象转换成json字符串
 * @param {Object} ao 要转换的对象
 * @param {Object} aj 对象格式，array:数组;object:对象
 */
CC.toJsonString = function (ao, aj) {
    var oChar = {
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"': '\\' + '"',
        '\\': '\\' + '\\'
    }, oStr = {
        'array': _a,
        'boolean': _b,
        'null': _n,
        'number': _num,
        'object': _o,
        'string': _s
    };

    function _a(a) {
        var aStr = ['['], bFlag, func, i, l = a.length;
        for (i = 0; i < l; i += 1) {
            o = a[i];
            func = oStr[typeof o];
            if (func) {
                o = func(o);
                if (typeof o == 'string') {
                    if (bFlag) {
                        aStr[aStr.length] = ',';
                    }
                    aStr[aStr.length] = o;
                    bFlag = true;
                }
            }
        }
        aStr[aStr.length] = ']';
        return aStr.join('');
    }

    function _b(s) {
        return String(s);
    }

    function _n(s) {
        return "null";
    }

    function _num(s) {
        return isFinite(s) ? String(s) : 'null';
    }

    function _o(o) {
        if (o) {
            if (o instanceof Array) {
                return oStr.array(o);
            }
            var aStr = ['{'], bFlag, func, i;
            for (i in o) {
                oTmp = o[i];
                func = oStr[typeof oTmp];
                if (func) {
                    oTmp = func(oTmp);
                    if (typeof oTmp == 'string') {
                        if (bFlag) {
                            aStr[aStr.length] = ',';
                        }
                        aStr.push(oStr.string(i), ':', oTmp);
                        bFlag = true;
                    }
                }
            }
            aStr[aStr.length] = '}';
            return aStr.join('');
        }
        return 'null';
    }

    function _s(s) {
        if (/["\\\x00-\x1f]/.test(s)) {
            s = s.replace(/([\x00-\x1f\\"])/g, function (ds, de) {
                var sChar = oChar[de];
                if (sChar) {
                    return sChar;
                }
                sChar = de.charCodeAt();
                return '\\u00' + Math.floor(sChar / 16).toString(16) + (sChar % 16).toString(16);
            });
        }
        return '"' + s + '"';
    }

    if (aj == "object") {
        return oStr.object(ao);
    }
    else if (aj == "array") {
        return oStr.array(ao);
    }
    else {
        return "";
    }
};

/**
 * 得到一级式的菜单
 * @param {Object} objMenu json数组格式
 * @param {Object} objSubMenu json对象
 * @example
 * <code>
 *  //objSubMenu 定义：一个数组 <br>
 *    var objSubMenu = [];<br>
 *    objSubMenu[0] = ["回复发件人", function(){},true];<br>
 *    objSubMenu[1] = ["回复所有人", function(){}];<br>
 *  objSubMenu[2] = ["",null];    //显示分隔条
 *
 *    //objMenu定义：<br>
 *    var objMenu = {
 *		id:"setMenu",               //菜单ID<br>
 *		name:"config",              //菜单项名称，可以为空。<br>
 *		div: $("config"),   		//菜单显示的对象，默认为触发事件的父对象<br>
 *	};<br>
 * //objClass定义：<br>
 * var objClass = {
 * 		overClass:"overclass",
 * 		clickClass:"clickclass"
 * }
 *  CC.getMenu(objMenu,objSubMenu);
 *  </code>
 */
CC.getMenu = function (objMenu, objSubMenu, objClass, e, dom, doc) {
    if (!doc)
        doc = document;
    var obj;
    if (dom) {
        obj = dom;
    } else {
        var ev = EV.getEvent(e);
        var objTarget = EV.getTarget(ev);
        obj = objTarget.parentNode;
    }
    objMenu = objMenu || {};
    objClass = objClass || {};
    var id = "SubMenu_" + (objMenu.id || "default");
    var name = "SubMenu_" + (objMenu.name || "defaultName");
    var div = objMenu.div || obj;
    var toolbar = new Toolbar(id);
    toolbar.init();
    var objTempMenu = $(id);
    if (objTempMenu) {
        El.show(objTempMenu);
        GE.cToolbar = objTempMenu;
        EV.stopEvent(ev);
        return;
    } else {
        objTempMenu = El.createElement("div", id, "menu");
    }


    //事件处理，切换菜单
    div.mouseEvent = {
        onmouseover: function () {
            if (objClass.overClass) {
                El.addClass(this, objClass.overClass);
            }
        },
        onmouseout: function () {
            if (objClass.overClass) {
                El.removeClass(this, objClass.overClass);
            }
        },
        onmousedown: function () {
            if (objClass.clickClass) {
                El.addClass(this, objClass.clickClass);
            }
        },
        onmouseup: function () {
            if (objClass.clickClass) {
                El.removeClass(this, objClass.clickClass);
            }
        }
    };
    new Hashtable(div.mouseEvent).each(function (sEvent, func) {
        div[sEvent] = func;
    });
    var objMenuItem = toolbar.getToolbarSubMenu(objSubMenu, doc);
    //window.objMenuItem=objMenuItem;
    if (objMenuItem) {
        //objTempMenu.appendChild(objMenuItem);
        //El.show(objTempMenu);
        //var doc = window.frames["ifrmReadmail_Content_readMail00810000071065bd00000100"].window.document;
        //var div1 = doc.createElement('div');
        div.appendChild(objMenuItem);
        //jQuery(div).append(objMenuItem.outerHTML);
        //jQuery(div).append(jQuery(objMenuItem,parent));
        //div.appendChild(objMenuItem);
        EV.stopEvent(ev);
        GE.cToolbar = objMenuItem;
    }
};

CC.changeCss = function (style) {
    $("cssStyle").href = CC.getCssByStyle(style);
    top.gCurrentCss = CC.getCssByStyle(style);
};
//是否开启右键菜单
CC.IsEnableContexMenu = function () {
    if (GC.check("MAIL_MANAGER_RIGHT") == true) {
        return true;
    }
    return false;
};
//是否开启新手向导
CC.IsEnableNoviceWizard = function () {
    return true;
};
