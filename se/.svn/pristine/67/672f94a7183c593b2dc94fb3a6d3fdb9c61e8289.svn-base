
/**
 * 侧边通讯录公共类
 * @param {Object|String} div 显示通讯录的div或ID
 * @param {window||String} win window 对象
 * @param {Object} ao json对象格式，定义如下：
 * var ao = {
 *  callback:null,	//回调函数<br>
 *  list:[],//一个数组 表示要显示的通讯录类型。<br>
 *          //["个人通讯录","客户通讯录","企业通讯录","邮件组列表","邮件组成员","最近联系人"]<br>
 *          //{"EP":0,"CS":1,"PERSON":2,"MAILGROUP":3,"GROUPMEMBER":4,"RECENT":5};
 *          以上值依次为：1,2,3,4,5,6 如果需要显示：企业通讯录 客户通讯录 个人通讯录,则
 *          data = ["EP","CS","PERSON"];<br>
 *      	//默认值为[1,2,3] <br>
 *  value:"EP",//默认展开数组中第一个通讯录<br>
 *  type:"email",	//联系人类型 (email: 邮件地址, mobile: 手机号码, fax: 传真号码 )<br>
 *  text:"l1" //赋值的文本框对象或ID<br>
 * }
 * @example
 * <code>
 *  var ao = {[1,2,3],value:0,type:0};
 *  var ld = new LeftAddr(div,window,ao);
 *	ld.init();
 *  //系统已经建立一个全局对象来调用
 *  LMD.loadList(div,win,ao);	
 * </code>
 * @class
 */
function AddrList(id,win,ao){
	ao = ao || {};
	var type = ao.type || 0;
    this.groupLen = 12;
    this.userLen = 12;
	var text = ao.text || "";
    this.srcWin = win;
	this.win = win || window;
	this.doc = win.document;
    this.id = id;
	this.div = this.doc.getElementById(id);
    this.textId = text;
	this.objText = this.doc.getElementById(text);
	this.value = ao.value || 0;
	this.list = ao.list || ["EP","CS","PERSON"];
    this.type = type || "email";        //数据显示类型
	this.addrType = LMD.listIndex[type] || LMD.listIndex["email"];//数据显示索引
    this.setCall = ao.setCall || "";            //自定义的赋值方法，不执行系统默认赋值方法
	//this.callback = ao.callback || Util.emptyFunction; //赋值之后的回调函数
    this.loadCall = ao.loadCall;
	//赋值模板配置 $NAME$:名字,$VALUE$:值,$WORD$:字母
	this.setTemplate = ao.setTemplate?ao.setTemplate:"$NAME$ <$VALUE$>";
	
	this.addrGroup = LMD.addrGroup;
	this.listObj = [];
	//this.listData = LMD.listDataTree;
	//this.groupData = window.groupData;
	//this.groupListData = window.groupListData;
	this.addrDataPower = LMD.addrDataPower;
    this.isIframe = ao.isIframe || false;  //是否在iframe页面访问通讯录框架
}

/***
 * 初始化
 */
AddrList.prototype.init = function(isFresh){
	var p = this;
    p.eventName = (p.isIframe)?"parent.AddrList.":"AddrList.";
    p.htmlData = {};
	var ah = [];
    if(isFresh){
       GE.addrList[p.id] = ""; 
    }
    if (!GE.addrList[p.id]) {
        if (this.div.innerHTML=="") {
            p.div.innerHTML = "<h1>{0}</h1>".format(parent.Lang.Mail.sys_LoadingData + Lang.Mail.sys_Waiting) ;
        }
        if (LMD.isComplete) {
            p.loadData();
        }else if(LMD.isLoad){
            window.setTimeout(function(){
               p.init(); 
            },200);
        }else{
            LMD.loadData(function(t){
                p.loadData(t);
            });
        }
    }else{
        this.div.innerHTML = GE.addrList[p.id];
    }
};

/***
 * 加载通讯录数据
 */
AddrList.prototype.loadData = function(t1){
	var p = this;
    var st = new Date().getTime();
	var id = "dl_load_AddrDate";
    var data = LMD.listDataTree;
    var html = "";
    if (typeof(p.srcWin) == "object") {
         try {
             if (LMD.isComplete && LMD.listDataTree) {
                 html = p.getHtmlData(data);
                 GE.addrList[p.id] = html;
                 var et = new Date().getTime();
                 if (IsDebug) {
                     html = '<h1>time1: {0} ms time2:{1} ms</h1>'.format(et - st,t1||0) + html;
                 }
                 this.div.innerHTML = html; 
             }
         } catch (e) {
             ch("AddrList.loadData",e);
         }
    }
};

/**
 * 获取通讯录数据html
 */
AddrList.prototype.getHtmlData = function(data){
    var p = this;
    var html = [];
    var j = 0;
    var list = p.list;
    var vt = LMD.dataTypeValue;
	for(var i=0;i<list.length;i++){
        var v = LMD.typeIndex[list[i]];
        var itemType = data[v];
        if (itemType) {
            var text = p.addrGroup[v];    //通讯录分类名称
            html[j] = '<h1 id="h1_{0}">{1}</h1><dl id="dl_{0}" class="wsWrapper">{2}</dl>'.format(v,text, p.getGroupHtml(itemType));
            j++;
        }
	} 
    return html.join("");
};

/**
 * 获取通讯录组组html
 * @param {Object} gd 联系人组对象
 */
AddrList.prototype.getGroupHtml = function(gd){
    var p = this;
    var gi = LMD.groupIndex;
    var iTid = gi["tid"];
    var iGid = gi["id"];
    var iGName = gi["name"];
    var iItem = gi["items"];
    var html = [];
    var htmlEnd = [];
    var iRecentTid = LMD.typeIndex["RECENT"];
    var i=0,j=0;
    var glen = p.groupLen;
    var clickString = "{0}setValue('{1}','$VALUE$',window);".format(p.eventName, p.textId);
    if (p.setCall && typeof(p.setCall) == "string") {
        clickString = p.setCall;
    }
    for(var n in gd){
        var go = gd[n];
        var tid = go[iTid];
        var gid = go[iGid];
        var items = go[iItem] || [];
        var listHtml = p.getListHtml(items,tid);
        var gn = go[iGName];
	    var gname = gn.lefts(glen,true);
        var title = gn.replace('"','\"');
        var s = '';
        if (tid == iRecentTid) {
            s += '<dd id="dd_{0}_{1}" style="display:block;" eventAttr="{2}" addrType="{3}">'.format(tid,gid,clickString,p.addrType);
        }else{
            s += '<dt id="dt_{0}_{1}" onclick="{5}showGroup(this,window,{0},\'{1}\');" title="{2}">{3}({4})</dt>'.format(tid, gid, title,gname, listHtml.length, p.eventName);
            s += '<dd id="dd_{0}_{1}" style="display:none;" eventAttr="{2}" addrType="{3}">'.format(tid,gid,clickString,p.addrType);
        }
        s += listHtml.join("");
        s += '</dd>';
        if(gid=="-1"){
            htmlEnd[i] = s;
            i++;
        }else{
            html[j] = s;
            j++;
        } 
    }
    html = html.concat(htmlEnd);
    return html.join(""); 
};


/**
 * 获得联系人信息html
 * @param {Array} ld 联系人信息数组
 */
AddrList.prototype.getListHtml = function(ld,tid){
    var p = this;
    var type = p.type;
    var di = LMD.listIndex;
    var iId = di["id"];
    var iTid = di["tid"];
    var iName = di["name"];
    var iEmail = di["email"];
    var iMobile = di["mobile"];
    var iFax = di["fax"];
    var iWord = di["word"];
    var iSpell = di["spell"];
    var html = [];
    var len = ld.length;
    var ulen = p.userLen;
    var j = 0;
    var iRecentTid = LMD.typeIndex["RECENT"];
    var addrType = p.addrType;
    var clickString = "{0}setValue('{1}','$VALUE$',window);".format(p.eventName, p.textId);
    if (p.setCall && typeof(p.setCall) == "string") {
        clickString = p.setCall;
    }
       /*
     if(tid==iRecentTid){
            ld = ld.sort(function(a,b){
                return b[iId] - a[iId];
            });
        }
    */
	for (var i = 0;i<len; i++) {
        var item = ld[i];
        var n = item[iName];
        var t = item[iName].lefts(ulen,true);
		var m = item[addrType];
        if (Vd.checkData(type, m)) {
            var ao = {
                name: n,
                value: m
            };
            var title = (n + " <" + m + ">").encodeHTML();
            html[j] = '<a href="javascript:{0};" title="{1}">{2}</a>'.format(AddrList.getReplaceValue(clickString, ao), title,t);
            j++;
        }
    }
    return html;
};



AddrList.prototype.fillGroupList = function(data){
    var p = this;
    var list = p.list;
    var vt = LMD.dataTypeValue;
    var clickString = "{0}setValue('{1}','{2}',window);".format(p.eventName, p.textId, m);
    if (p.setCall && typeof(p.setCall) == "string") {
        clickString = AddrList.getReplaceValue(p.setCall, ao);
    }
};



/**
 * 全局方法，显示隐藏联系组
 * @param {Object} obj 事件源对象
 * @param {Object} win 发生的窗体对象
 */
AddrList.showGroup = function(obj,win,tid,gid){
    win = win || window;
    var dt = obj,j=0;
    var ddId = dt.id.replace("dt","dd");
    var dd = win.document.getElementById(ddId);
    //var clickString = dd .getAttribute("eventAttr");
    //var addrType = dd.getAttribute("addrType");
    //var data = LMD.listDataTree[tid][gid].items;
    //var a = win.document.createElement('a');
    //var od = dd.cloneNode(false);
    var html = [];
    //var st = new Date().getTime();
    /*if(dd.innerHTML==""){
       //dd.innerHTML = AddrList
        for (var i = 0;i<data.length; i++) {
            var item = data[i];
            var t = item.name;
        	var m = item[addrType];
            //var id = item.Tid + "_" + item.Gid + "_" + item.id;
            if (Vd.checkData(addrType, m)) {
                var ao = {
                    name: t,
                    value: m
                };
                clickString = AddrList.getReplaceValue(clickString,ao);
                var title = t + " <" + m + ">".encodeHTML();
                html[j] = '<a href="javascript:'+clickString+'; title="'+title+'">'+t+'</a>';
                j++;
                //var clone = a.cloneNode(false);
                //clone.setAttribute("title",title);
                //clone.setAttribute("href","javascript:"+clickString);
                //clone.innerHTML = t;
                //dd.appendChild(clone);
            }
        }
        //od.style.display = "none";
        //dd.parentNode.replaceChild(od, dd);
        //dd = od;
        dd.innerHTML = html.join("");
        var et = new Date().getTime();
        dt.innerHTML += "time:"+(et-st) + " ms";
        //return html.join("");
    }*/
    if(dd.style.display=="none"){
        El.addClass(dt,"on");
        dd.style.display = "block";
    }else{
        El.removeClass(dt,"on");
        dd.style.display = "none";
    }
    
   
};

/**
 * 点击联系人给文本框赋值方法
 * @param {Object} id 文本框id
 * @param {Object} v 值
 * @param {Object} win 窗体对象
 */
AddrList.setValue = function(id,v,win){
    var ot = win.document.getElementById(id);
	if (ot && v) {
        var textValue = win.document.getElementById(id).value;
        var s = AddrList.getSetValue(textValue,v);
        if (s) {
            ot.value = s;
            ot.focus();
        }
    }	
};

/**
 * 通用取赋值文本方法
 * @param {String} tv 文本框中的原值
 * @param {String} v 新值
 * @param {String} template 模板
 * @param {String} sep 分隔符
 */
AddrList.getSetValue = function(tv,v,template,sep){
    var ret = "";
    if(v){
    	tv = tv || "";
        template =  template || v;
        sep = sep || ",";    //分隔符，默认以,号分隔
    	tv = tv.replace(/[,;，；]+/gi, sep);
    	tv = tv.replace(/^[,;，；]|[,;，；]$|\s+/gi, "");
    	var lastSep = tv.lastIndexOf(sep);
    	if (!v.inStr(tv)) {  
            if (lastSep > 0) {
                ret = tv.lefts(lastSep + 1) + template + sep;
            } else {
                ret = template + sep;
            }
    	} 
    }
    return ret;
};


AddrList.getReplaceValue = function(temp,v){
	var ret = "";
	if(temp&&v){
		ret = temp.replace("$NAME$",v.name||"");
		ret = ret.replace("$VALUE$",v.value||"");
		ret = ret.replace("$WORD$",v.word||"");
	}
	return ret;
};



AddrList.replaceHtml = function(oldEl, html) { 
     var newEl = oldEl.cloneNode(false); 
     //newEl.innerHTML = html; 
     oldEl.parentNode.replaceChild(newEl, oldEl); 
     return newEl; 
}; 
