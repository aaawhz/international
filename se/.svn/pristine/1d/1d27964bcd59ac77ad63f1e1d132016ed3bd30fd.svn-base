/**
 * Ajax通用操作类
 * @author cmail
 * @class
 */

var Ajax = {
    /**
     * 得到xmlHttpRequst 异步请求对象
     */	
    _objPool: [],
    _createObject: function(){
        var objXMLHttp = null;
    
        if( window.ActiveXObject ){
            var MSXML = ['MSXML2.XMLHttp.6.0','MSXML2.XMLHTTP.5.0', 'MSXML2.XMLHTTP.4.0', 'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP'];
            for(var n = 0; n < MSXML.length; n ++){
                try{
                    objXMLHttp = new ActiveXObject(MSXML[n]);
                    break;
                }
                catch(e){}
            }
        }else{
            objXMLHttp = new XMLHttpRequest();
        }
                 
        //if (objXMLHttp.readyState == null){
            //objXMLHttp.readyState = 0;
            //objXMLHttp.addEventListener("load", function (){
                    //objXMLHttp.readyState = 4;
                    //if (typeof objXMLHttp.onreadystatechange == "function"){
                        //objXMLHttp.onreadystatechange();
                    //}
              //  },  false);        
        //}
        return objXMLHttp;
    },
    getXMLHttp: function(){
      /*for (var i = 0; i < this._objPool.length; i ++){
            var op = this._objPool[i];
            if ((op.readyState == 0 || op.readyState == 4) && op.onreadystatechange===null){
                //this._objPool[i].onreadystatechange = null;
                //this._objPool[i].abort();
                return this._objPool[i];
            }
        }
        this._objPool[this._objPool.length] = this._createObject();
        return this._objPool[this._objPool.length-1];*/
       
        // if(!navigator.onLine){
        //     CC.showMsg("网络断开，请检查网络连接.", false, false, 'caution');
        // }
        return this._createObject();
    },
    /**
     * 通用返回方法
     * @private
     * @ignore
     * @param {Object} dt xmlhttp对的
     * @param {Object} resType 返回的内容格式
     * @param {Object} encode 编码
     */
    response: function(dt, resType, encode,url){
        var ct = dt.getResponseHeader("Content-Type");
        if (!resType) {
            if (ct.indexOf("text/html") > -1 || ct.indexOf("application/html") > -1) {
                resType = "html";
            } else if (ct.indexOf("text/xml") > -1 || ct.indexOf("application/xml") > -1) {
                resType = "xml";
            } else if (ct && ct.trim().match(/^(text|application)\/(x-)?(java|ecma)script(;.*)?$/i)) {
                resType = "script";
            } else {
                resType = "none";
            }
        }
        var data;
        if (resType == "xml") {
            data = dt.responseXML;
        } else {
            data = dt.responseText;
        }
        try {
            switch (resType) {
                case "script":
                    data = eval(data);
                    break;
                case "mailjson":
                    data = eval("ajaxResponseJsonData=" + data);
                    break;
                case "json":
                    data = JSON.parse(data);
                    break;
            }
        }catch(e){
        	Ajax.error(url, "Ajax.response",e);
        }
        return data;
    },
    /**
     * coremail专用返回方法
     * @param {Object} cq xml对象
     */
    mailResponse: function(resp){
        var v = {
            code: null
        };
        resp = resp.trimAll();
        var data = eval("ajaxResponseJsonData=" + resp);  
        return data;
    },
    
    /**
     * Ajax请求
     * @param {Object} am json对象格式，定义如下：<br>
     * 	url:"请求的url",<br>
     * 	data:"post内容",<br>
     * 	async:"是否异步(true|false)",<br>
     *  text:"(true|false)",<br>
     *  callback:"回调函数",<br>
     *  method:"(get|post)",<br>
     *  resType:"返回的文件类型(html|json|xml|text)",<br>
     *  param:"参数",<br>
     *  noSetCT: true|false ,默认为false，是否不设置请求的Content-Type
     *  xmlHttp:    object   xmlhttprequest对象，不传默认使用主页创建的对象 
     *  encode:"编码"
     */
     request: function(am){
        CC.checkNetwork(true);
        var i, l;
        var async = (typeof(am.async)=="boolean")?am.async:true;
        var fCallBack = am.callback || Util.emptyFunction;
		var failCallBack = am.failCall || null;
        var url = am.url || "";
        var method = (am.method || "get").toLowerCase();
        var resType = (am.resType || "").toLowerCase();
        var param = am.param || "";
        var data = (am.data || param).replace(/[\x00-\x08\x0b\x0e-\x1f]/g, "");
        var head = am.head || [];
        var encode = am.encode || "utf-8";
        var noSetCT = am.noSetCT || false;
        var au = null;
        //var events = ['Uninitialized', 'Loading', 'Loaded', 'Interactive', 'Complete'];
        // 0 (未初始化) 对象已建立，但是尚未初始化（尚未调用open方法） 
        // 1 (初始化) 对象已建立，尚未调用send方法 
        // 2 (发送数据) send方法已调用，但是当前的状态及http头未知 
        // 3 (数据传送中) 已接收部分数据，因为响应及http头不全，这时通过responseBody和responseText获取部分数据会出现错误， 
        // 4 (完成) 数据接收完毕,此时可以通过通过responseBody和responseText获取完整的回应数据 
        
        //得到xmlHTTPRequest对象
        if (!url) {
            return;
        } else {
            url = getUrl(url);
            if (method == 'get' && param.length > 0) {
                url += (url.match(/\?/) ? '&' : '?') + param;
            }
            url = GC.rfUrl(url);
        }
        
        var objXmlHttp = am.xmlHttp || this.getXMLHttp();
        
        //处理xmlhttp请求头
        var accepts = {
            xml: "application/xml, text/xml",
            html: "text/html",
            script: "text/javascript, application/javascript",
            json: "text/javascript",
            mailjson: "text/javascript",
            _default: "*/*"
        };
        var _head = [];
        if (!noSetCT) {
            _head[_head.length] = "Content-Type";
            _head[_head.length] = "application/x-www-form-urlencoded; charset=" + encode;
        }
       	_head[_head.length] = "Cache-Control";
	   	_head[_head.length] = "no-cache";
		_head[_head.length] = "Accept";
        _head[_head.length] = accepts[resType] ? accepts[resType] : accepts._default;
        if (method == "post") {
            // _head[_head.length] = "Content-Length";
            _head[_head.length] = data.length;
            if (objXmlHttp.overrideMimeType) {
                // _head[_head.length] = "Connection";
                _head[_head.length] = "close";
            }
        }
        _head = _head.concat(head);
     
        objXmlHttp.open(method, url, async);
        for (i = 0, l = _head.length; i < l; i += 2) {
            try{
                objXmlHttp.setRequestHeader(_head[i], _head[i + 1]);
            }catch(error){
                if(window.console){
                    console.error(error)
                }
            }
            
        }
        if (async) {
            objXmlHttp.onreadystatechange = function(){
                if (objXmlHttp.readyState == 4) {
                    try{
                        if (typeof(ajaxResponseCallBack) == "function") {
                            ajaxResponseCallBack();
                            objXmlHttp = null;
                        }
                     } catch (exp) {
                        objXmlHttp = null;
                        Ajax.error(url,"Ajax.requst.ajaxResponseCallBack",exp);
                     }
                }
            };
        }
        var seq = new Date().getTime();
       
 try {
           Ajax.log(gConst.logFunc.req, url,(IsWriteLog==2)?data:"");
            objXmlHttp.send(method == "post" ? data : null);
        } catch (e1) {
			
            Ajax.error(url, "Ajax.send",e1);
        }

        if (!async) {
        	callBack();
        }
        
        
        function ajaxResponseCallBack(){
            var t = objXmlHttp.status;
            if ((t >= 200 && t < 300) || t == 304) {
    			fCallBack(Ajax.response(objXmlHttp, resType, encode,url),url);
            }else{
                if(typeof(failCallBack)=="function"){
                    failCallBack({
                        code:gConst.statusNo,
                        "var":"http response error t="+t
                    },url);
                }
                Ajax.error(url,"Ajax.requst.ajaxResponseCallBack","http response error t="+t);
                CC.hideMsg(true); 
    		}
            var logmsg = (IsWriteLog==2)?objXmlHttp.responseText:t;
            Ajax.log(gConst.logFunc.resp,url,"resp=" + logmsg);
        }
        
        function getUrl(url){
            //处理url
            //判断url的类型
            var ret = "";
            if (url.lefts(4) == "http" || url.lefts(1) == "/") {
                //绝对路径
                ret = url;
            } else {
                //相对路径
                ret = location.href.lefts(location.href.lastIndexOf("/") + 1) + url;
            }
            return url;
        }
        return objXmlHttp;
    },
    /**
     * CoreMail 专用Ajax请求
     * @param {Object} am 请参数的json对象,与Ajax.request方法相同
     */
    mailRequest: function(am){
        var mailCall = am.mailCall;
        var mailRequestCall = function(data,ru){
            try {
                var type = Util.getVarType(data);
                if(type=="string"){
                    data = Ajax.mailResponse(data);
                    type =  Util.getVarType(data);
                }
                if(type=="object"){
                    mailCall(data);
                }else{
                    return Ajax.error(ru,"Ajax.mailRequest.mailRequestCall","Data type error.");
                }
            } catch (exp) {
                return Ajax.error(ru,"Ajax.mailRequest.mailRequestCall"+ exp);
            }   
        };
        var _head = [];
        var data = am.data;
        _head.push("Content-Type");
        if(data){
            _head.push("application/xml; charset=utf-8");
        }else{
            _head.push("application/x-www-form-urlencoded; charset=utf-8");
        }
        am.callback = mailRequestCall;
        am.resType = "mailjson";	//基础邮箱通讯使用，非严格标准的json
        am.encode = "utf-8";
        am.head = _head;
        am.method = am.method || "post";
        am.noSetCT = true;
        Ajax.request(am);
    },
	/**
	 * Ajax Post方法
	 * @param {Object} url post请求的URL
	 * @param {Object} data POST的数据
	 * @param {Object} callback 回调函数
	 * @param {Object} options json对象格式参数，定义如下：
	 *  async:"是否异步(true|false)",<br>
     *  resType:"返回的文件类型(html|json|xml|text)",<br>
     *  encode:"编码"
	 */
	post: function(url,data,cb,options){
		options = options || {};
		var ao = {
			url:url,
			method:"post",
			callback:cb,
			data:data,
			async:options.async,
			resType:options.resType,
			encode:options.encode
		};
		Ajax.request(ao);
	},
	/**
	 * Ajax Get 方法
	 * @param {Object} url post请求的URL
	 * @param {Object} data POST的数据
	 * @param {Object} callback 回调函数
	 * @param {Object} options json对象格式参数，定义如下：
	 *  param: "参数值，也可以直接跟在URL里面",<br>
	 *  async:"是否异步(true|false)",<br>
     *  resType:"返回的文件类型(html|json|xml|text)",<br>
     *  encode:"编码"
     *  xmlHttp:xmlHttp对象，用于从其它页面发起ajax请求
	 */
	get: function(url,cb,options){
		options = options || {};
		var ao = {
			url:url,
			method:"get",
			callback:cb,
			param:options.param,
			async:options.async,
			resType:options.resType,
			encode:options.encode
		};
        if(typeof(options.xmlHttp)=="object"){
            ao.xmlHttp = options.xmlHttp;
        }
		Ajax.request(ao);
	},
	
    /**
     * 通用数据求方法，支持get,post(ajax方式和表单方式两种)
     * @param {string} html post的html,form表单结构或url地址
     * @param {object} am json对象格式，定义如下：
     * var am = {
     *   method:"post", 		//get|post
     *   url:"url",				//请求的url地址’
     *   call:function(){},		//回调函数
     *   resType:"xml"			//资源返回类型
     * };
     * @param {boolean} isform 是否用表单提交数据，为false用Ajax提交。
     */
    submit: function(html, am, isform){
        am = am ||{};
        var callback = am.call;
        var url = am.url;
        var method = am.method;
        var rt = (am.resType && am.resType != "") ? am.resType.toLowerCase() : "";
        var req = (am.resType == "maildata") ? Ajax.mailRequest : Ajax.request;
        
        function wo(){
            var objfrm = window.frames[gConst.ifrmForSubmit];
            try {
                callback(objfrm);
            } catch (e) {}
        }
        function pd(){
            try {
                var ifrm = document.getElementById(gConst.ifrmForSubmit);
                var objdoc = ifrm.contentWindow.document;
                objdoc.body.innerHTML = html;
                var objForm = objdoc.forms[0];
                objForm.method = "post";
                if (url) {
                    objForm.action = url;
                }
                objForm.submit();
                if (typeof(callback) == "function") {
                    GC.fireDocReady(wo, ifrm);
                }
            } catch (e) {
            }
        }
        
        if (isform) {
            var ifrm = document.getElementById(gConst.ifrmForSubmit);
            if (method == "get") {
                url = url || html;
                ifrm.src = GC.rfUrl(url);
                if (typeof(callback) == "function") {
                    GC.fireDocReady(wo, ifrm);
                }
            } else {
                ifrm.src = GC.rfUrl("/cmail2009/blank.htm");
                GC.fireDocReady(pd, ifrm);
            }
        } else {
            if (method == "get") {
                url = url || html;
                am.url = GC.rfUrl(url);
                req(am);
            } else {
                var divfrm = document.getElementById(gConst.divForSubmit);
                divfrm.innerHTML = html;
                var of = divfrm.getElementsByTagName("form")[0];
                am.data = getbody(of);
                of.innerHTML = "";
                am.method = "post";
                am.url = am.url || of.action;
                req(am);
            }
        }
        
        function getbody(oForm){
            var aParams = [];
            for (var i = 0; i < oForm.elements.length; i++) {
                var sParam = oForm.elements[i].name;
                var sPValue = "";
                if (oForm.elements[i].type == "checkbox" || oForm.elements[i].type == "radio") {
                    if (oForm.elements[i].checked) {
                        sParam += "=";
                        sPValue = oForm.elements[i].value;
                    } else {
                        sParam = "";
                        sPValue = "";
                    }
                } else {
                    sParam += "=";
                    sPValue = oForm.elements[i].value;
                }
                if (sParam != "") {
                    sParam += sPValue;
                    aParams.push(sParam);
                }
            }
            return aParams.join("&");
        }
    },
    /**
     * Ajax请求错误处理函数
     */
    error: function(url,m, au){
        var logmsg = "method=" + m + " | summary="+au;
		if (IsDebug) {
            CC.alert(Lang.Mail.fail + "," + logmsg);
            //console.error(Util.getStack())
		}
        Util.writeLogError(gConst.logFunc.js,url, logmsg +" | stack="+Util.getStack());
        CC.hideMsg();
		return false;
    },
    logError:function(url,msg){
        try {
            if (IsWriteLog) {
                var func = GC.getUrlParamValue(url, "func");
                var logFunc = gMain.webLogFunc;
                if (func.inStr(logFunc)) {
                    Util.writeLogError(gConst.logFunc.js, url, msg);
                }
            }
        }catch(e){
            
        }
    },
    log:function(type,url,msg){
        try {
            if (IsWriteLog) {
                var func = GC.getUrlParamValue(url, "func");
                var logFunc = gMain.webLogFunc;
                if (func.inStr(logFunc)) {
                    Util.writeLog(type, url, msg);
                }
            }
        }catch(e){
            
        }
    }
};


