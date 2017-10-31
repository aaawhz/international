//空函数
function fGoto(){}

(function() {
    if (window.GC) {
        return;
    }
    /**
     * 全局公共对象
     */
    window.GC = {};
    GC.getUrlParamValue = function(url, param) {
        var reg = new RegExp("(^|&|\\?|\\s)"+param+"\\s*=\\s*([^&]*?)(\\s|&|$)","i");  
        var match = reg.exec(url); 
        if (match) {
            return match[2].replace(/[\x0f]/g, ";");
        }
        return "";  
    };
   
    GC.writeCookie = function(name,value,domain,path,exp){
        var allcookies = document.cookie;
        domain = domain || GC.domain;
        path = path || "/";
        if(name && value){
            var cv = name + "=" + value + ";";
            if(domain){
                cv += "domain="+domain+";";
            }
            if(path){
                cv += "path="+path+";";
            }
            if(exp){
                cv += "expires=" + exp.toGMTString()+";";
            }
            document.cookie = cv;
        }
    };
    GC.readCookie = function(name){
        var allcookies = document.cookie;
        var reg = new RegExp("(^|;)\\s*"+name+"=([^;]*)\\s*(;|$)");
        var match = reg.exec(allcookies);
        var ret = "";
        if (match != null) {
            var value = match[2];
            ret = decodeURIComponent(value);
        } 
        return ret;
    };
    
    GC.ossHit = function(){
        
    };
    
    /**
     * 设置Cookie，如果不存在则添加，存在则修改
     * @param {string} domain Cookie 的域
     * @param {string} name 要设置的Cookie键
     * @param {string} value 要设置的Cookie值
     * @param {string} path 要设置的Cookie路径
     * @param {string} expires 要设置的Cookie过期时间
     */
    GC.setCookie = function(name, value, path, domain, expires) {
        document.cookie = name + "=" + escape(value) +
            ( path ? ";path=" + path : "" ) +
            ( expires ? ";expires=" + expires.toGMTString() : "" ) +
            ( ";domain=" + (domain ?  domain : window.location.host) );
    };
    
    /**
     * 获得Cookie
     * @param {string} name Cookie名称
     * @return {string} Cookie值
     */
    GC.getCookie = function(name) {
         var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
         if(arr != null) {
             return unescape(arr[2]);
         }   
         
         return null;
    };
    
    /**
     * 删除Cookie
     * @param {string} name Cookie名称
     * @return void
     */
    GC.delCookie = function (name, path, domain){
        domain = domain || window.location.host;
        var date = new Date();
        date.setTime(date.getTime() - 10000);
        
        if ( GC.getCookie(name) ) {
                document.cookie = name + "=" +
                    ( path ? ";path=" + path : "") +
                    ( domain ? ";domain=" + domain : "" ) +
                    ";expires=" + date.toGMTString()
        }
    };
    
    GC.gRnd = function() {
        var now = new Date();
        var rnd = Math.random() + "," + now.getMilliseconds();
        return rnd;
    };
    GC.rfUrl = function(src) {
        var rnd = GC.gRnd();
        if (src.indexOf("&rnd=") > 0) {
            src = src.substr(0, src.indexOf("&rnd="));
        } else if (src.indexOf("?rnd=") > 0) {
            src = src.substr(0, src.indexOf("?rnd="));
        }
        if (src.indexOf("?") > 0) {
            src += "&rnd=" + rnd;
        } else {
            src += "?rnd=" + rnd;
        }
        return src;
    };
    GC.appendUrl = function(url,name,val){
        if(name&&val){
            val = encodeURI(val);
            if (url.indexOf("?") > 0) {
                url += "&"+name+"="+val;
            }else{
                url += "?"+name+"="+val;
            }
        }
        return url;
    };
    GC.appendParam = function(url,param,isrand){
        var sp = [];
        var join = "?";
        if (url.indexOf("?") > 0) {
            join = "&";
        }
        if(param){
            for(var n in param){
                if(param[n]){
                    sp.push(n + "=" + encodeURI(param[n]));
                }
            }   
        }
        if(sp.length>0){
            url += join + sp.join("&");
        }
        if(isrand){
            url = GC.rfUrl(url);
        }
        return url;
    };
    /**
     * 用Script方式得到跨域的js文件
     * @param {string} id 标识符
     * @param {string} url 文件地址
     * @param {function} callback 回调函数
     */
    GC.getScript = function(id, url, callback, opt) {
        var dataScript = document.getElementById(id);
        if (!opt) {
            opt = {};
        }
        var isrnd = opt.isrnd || false;
        var isdefer = opt.isdefer || false;
        var charset = opt.charset || "gb2312";
        if (isrnd) {
            url = GC.rfUrl(url);
        }
        var head = document.getElementsByTagName("head")[0];
        if (dataScript != null) {
            head.removeChild(dataScript);
            dataScript = null;
        }
        dataScript = document.createElement("script");
        if (typeof callback == "function") {
            if (document.all) {
                dataScript.onreadystatechange = function(){
                    if (dataScript.readyState == "loaded" || dataScript.readyState == "complete") {
                        callback();
                    }
                };
            } else {
                dataScript.onload = function(){
                    callback();
                };
            }
        }
        charset = charset || "gb2312";
        dataScript.setAttribute("id",id);
        dataScript.setAttribute("charset",charset);
        dataScript.setAttribute("src",url);
        if (isdefer) {
            dataScript.setAttribute("defer", false);
        }
        dataScript.setAttribute("type","text/javascript");
        head.appendChild(dataScript);
    };
    GC.loadScript = function(id,url,charset){
        if (!url) {
            return;
        }
        if(url.substring(0,4)!="http"){
            url = GC.frmPath + "/js/" + url;
        }
        var dataScript = document.getElementById(id);
        var head = document.getElementsByTagName("head")[0];
        var callback = function() {};
        if (dataScript != null) {
            head.removeChild(dataScript);
            dataScript = null;
        }
        dataScript = document.createElement("script");
        charset = charset || "gb2312";
        dataScript.setAttribute("id",id);
        dataScript.setAttribute("charset",charset);
        dataScript.setAttribute("src",url);
        dataScript.setAttribute("type","text/javascript");
        head.appendChild(dataScript);
    };
    GC.loadCss = function(id, url, charset){
        if (!url) {
            return;
        }
        if(url.substring(0,4)!="http"){
            url = GC.top.gMain.frmPath + "/css/" + url;
        }
        var dataCss = document.getElementById(id);
        var head = document.getElementsByTagName("head")[0];
        if (dataCss != null) {
            head.removeChild(dataCss);
            dataCss = null;
        }
        dataCss = document.createElement("link");
        dataCss.setAttribute("id",id);
        dataCss.setAttribute("rel", "stylesheet"); 
        dataCss.setAttribute("type", "text/css"); 
        dataCss.setAttribute("href", url); 
        if(charset){
            dataCss.setAttribute("charset", charset);   
        }
        head.appendChild(dataCss);  
    };
    GC.logoff = function() {
        //window.location.replace("/logoff.htm?func="+gConst.func.execTemp+"&sid="+gMain.sid);
        window.location.replace(GC.returnUrl);
        return false;
    };
    
    /**
     * 文档加载完成以后执行指定的函数
     * @param {function} fdr 回调函数
     * @param {object} 文档对象
     */
    GC.fireDocReady = function(fdr, ifr) {
        var doc = ifr || document;
        var win = (ifr ||window);
        var f = win.onload;
        var callback = function(){  
            if(typeof(f)=="function"){
                if (f.toString() != callback.toString()) {
                    f();
                }
            }
            if (typeof(fdr) == "function") {
                fdr();
            }
        };
        if (document.all) { 
            function fdReady(){
                var rs = doc.readyState;
                if(rs == "complete") {                                    
                    callback();
                 }else{
                    setTimeout(fdReady,10);
                 }
            }                   
            setTimeout(fdReady,10);
        }
        win.onload = callback;
    };
    /**
     * 触发对象的事件
     * @param {object} obj dom对象
     * @param {string} evtName 事件名称，不带on
     */
    GC.fireEvent = function(obj, evtName) {
        /*
         * if(document.all){ objo.fireEvent("on"+evtName); }else{ var evt =
         * document.createEvent("MouseEvents");
         * evt.initEvent(evtName,true,true); obj.dispatchEvent(evt); }
         */
        if(!obj){return;}
        if (document.all) {
            obj["on" + evtName]();
        }else{
            var ev = document.createEvent('Events');
            ev.initEvent(evtName, false, true);
            obj.dispatchEvent(ev);
        }
    };
    GC.textChange = function(obj){
        if(!obj){return;}
        if(document.all){
            obj.fireEvent('onchange');
        }else{
            var ev = document.createEvent('Events');
            ev.initEvent("change", false, true);
            if (typeof(obj.dispatchEvent)=="function") {
                obj.dispatchEvent(ev);
            }
        }
    };
    
    /**
     * 判断当前模块值是否存在于模块定义中<br>
     * 返回true 该模块不显示；返回false 显示模块<br>
     * @param {number} m 当前模块值
     * @return {boolean} 存在于模块定义中返回true,否则返回false
     */
    GC.checkModule = function(m){
        return false;
    };
    /**
     * 模块权限判断 
     * @param {Object} mid 模块id值 
     */
    GC.check = function(mid){
        return GC.power[mid] || false;
    };
    /**
     * 当前页面继承父页面的相关属性方法<br>
     */
    GC.initExtend = function(){
        setExtend();
        function setExtend(){
            try{
                if(GC.mainFrm&&GC.mainFrm.Object.extend){
                    GC.mainFrm.Object.extend(Number.prototype, GC.mainFrm.Number.prototype);
                    GC.mainFrm.Object.extend(String.prototype, GC.mainFrm.String.prototype);
                    GC.mainFrm.Object.extend(Array.prototype, GC.mainFrm.Array.prototype);
                    GC.mainFrm.Object.extend(Date.prototype, GC.mainFrm.Date.prototype);
                    GC.mainFrm.Object.extend(Function.prototype, GC.mainFrm.Function.prototype);
                }
            }catch(e){}
            
        }
    };
    GC.initText = function(doc){
        if (document.all) {
            var tag = GC.top.El.getNodeType(doc,true);
            if(tag=="text"||tag=="textarea"){
                add(doc);
            }else{
                var objT = doc.getElementsByTagName("input");
                for (var i = 0; i < objT.length; i++) {
                    var ao = objT[i];
                    tag = GC.top.El.getNodeType(ao,true);
                    if(tag=="text"||tag=="textarea"){
                        add(ao);
                    }
                }
            }
        }
        function add(t){
            if(!t){
                return;
            }
            t.className = "text";
            GC.top.EV.observe(t, "focus", function(){
                GC.top.El.addClass(t, "focus");
            }, false);
            GC.top.EV.observe(t, "blur", function(){
                GC.top.El.removeClass(t, "focus");
            }, false);
        }
    };
    

    function checkUrl(url){
        var reg = new RegExp("(login\.do|m\.do|/history\.html?|/blank\.html?)","i");
        var match = reg.exec(url);
        return (match)?false:true;
    }
    
   try {
        var appdomain = GC.getCookie("maindomain");
        if (appdomain && appdomain != location.host) {
            GC.olddm = document.domain;
            document.domain = appdomain; //set AppDomain
            GC.domain = appdomain;
        }else{
            GC.domain = appdomain;
        }
    } catch (e) {
        
    }
    GC.top = (function(){
        var top = window;
        var sid = GC.getUrlParamValue(location.href,"sid");
        var gm = top.gMain; 
        var count = 0;
        while(!(gm && gm.sid==sid) && count<3){
            top = top.parent;
            gm = top.gMain;
            count ++;
        }
        return top;
    })();
    GC.mainFrm = GC.top;
    if (window != GC.top&&checkUrl(window.location)) {
        GC.sid = GC.top.gMain.sid;
        //GC.domain = GC.top.gMain.mainDomain;
        GC.power = GC.top.gPower;
//        for(var i= 0,l=GC.top.gPower.length;i<l;i++){
//            GC.power[GC.top.gPower[i].mid] = 1;
//        }
        GC.isInit = true;
    }else{
        if (window.gMain) {
            GC.sid = gMain.sid;
            //GC.domain = gMain.domain;
            GC.power = GC.top.gPower;
//            for(var i= 0,l=GC.top.gPower.length;i<l;i++){
//                GC.power[GC.top.gPower[i].mid] = 1;
//            }
            GC.isInit = false;
        }
    }
})();
if(GC.isInit){
    GC.initExtend();
}


/**
 * 完全清除对象，防止内存漏洞
 * @param {Object} d 要清除的html对象
 */
function g(d){
    return;
}




