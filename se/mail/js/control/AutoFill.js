/**
 * 通讯录数据通用匹配类
 *
 */
function MatchAddr(ao){
    this.matchIsCase = ao.matchIsCase || false; //是否区分大小写
    this.matchIsStr = ao.matchIsStr || true;    //是否字符模式匹配
    this.matchIsStart =ao.matchIsStart||false;  //是否只匹配字符串开始位置
    this.regexp = null;
    this.template = null;
}


MatchAddr.prototype.init = function(s,template){
    try {
        this.regexp = this.getRegExp(s);
        this.template = template;
        return true;
    }catch(e){
        return false;
    }
};

MatchAddr.prototype.getRegExp = function(str){
    var p = this;
    var m = "i";
    var regStr = "";
    str = str || "";
    if(p.matchIsCase){
        m = "";
    }
    if(p.matchIsStr){
        str = str.replace(/([.\\[\]()\^$]|\\\\)/,"\\$1");
    }
    if(p.matchIsStart){
        regStr = "^";
    }
    regStr +=  str + "";
    var reg = null;
    try {
        reg = new RegExp(regStr,m);
    } catch (e) {   }
    return reg;
};

MatchAddr.prototype.isMatch = function(str){
    var ret = false;
    var oReg = this.regexp;
    if (oReg) {
        ret = oReg.test(str);
    }
    return ret;
};

MatchAddr.prototype.getMatch = function(ao){
    var text = "";
    var template = this.template;
    var oReg = this.regexp;
    ao = ao ||{};
    var list = ["value","name","word","fullword"];
    var ret = {
        word: ao.word,
        value: ao.value,
        name: ao.name,
        fullword:ao.fullword,
        isOk: false
    };
    if (oReg) {
        if (typeof(ret) == "object") {
            for (var i=0;i<list.length;i++) {
                var n = list[i];
                var v = ret[n];
                var m = oReg.exec(v);
                if (m&&v) {
                    text = v.replace(m[0],template.replace("$KEY$",m[0]));
                    ret[n] = text;
                    ret.isOK = true;
                    break;
                }
            }
        }
    }
    return ret;
};



/**
 * 自动完成类
 * @param {string} id 文本框的id
 * @param {object} win window对象
 * @param {object} ao json对象格式。定义格式为： var ao = {
 *  line:10,            //显示的行数,默认为15行
 *  startNum:2,         //输入几个字符开始匹配,默认为1个
 *  matchIsCase:true,   //是否区分大小写，默认为false
 *  matchIsStr:true,    //是否字符串匹配模式，默认为true
 *  matchIsStart：true, //是否只匹配字符串开始位置，默认为true
 *  call:function(){}   //回调函数
 * }
 * @example
 * <code>
 * var fill = new AutoFill("text",document);
 * //数据类型为一个数组 数组格式为
 * var data = [{
 * name:"name1",
 * value:"15800000000"
 * }]
 * fill.data = data;
 * fill.init();
 *
 * //系统已经为邮箱，手机号码，传真号码建立对象。用以下方式调用：
 * LMD.fillMobile(id,win,ao);   //手机号码自动完成
 * LMD.fillEmail(id,win,ao);    //邮件地址自动完成
 * LMD.fillFax(id,win,ao);      //传真号码自动完成
 * </code>
 * @class
 */
function AutoFill(id,win,ao){
    ao = ao || {};
    this.loadCount = 10;
    this.loadTime  = 0;
    this.id = (typeof(id)=="object"?id.id:id) || "";
    var hideDiv = ao.hideDiv || "";
    ao.div = ao.div || "";
    ao.text = ao.text || "";
    this.win = win || window;
    this.doc = this.win.document || document;
    this.objText = typeof(id)=="object"?id:this.doc.getElementById(id);
    this.text = (ao.text)?(typeof(ao.text)=="object"?ao.text:this.doc.getElementById(ao.text)):null;
    this.line = ao.line || 15;
    this.startNum = ao.startNum || 1;
    this.cacheKey = ao.cacheKey || "email";
    this.matchIsCase = ao.matchIsCase || false;     //是否区分大小写
    this.matchIsStr = ao.matchIsStr || true;        //是否字符模式匹配
    this.matchIsStart =ao.matchIsStart||false;      //是否只匹配字符串开始位置
    this.hasName = ao.hasName || false;             //赋值时，是否包含用户名
    this.noHideDiv = ao.noHideDiv || false;         //赋值后是否不隐藏div，默认不传将会隐藏div
    this.autocomplete=true;
    if(ao.autocomplete==false)
        this.autocomplete =false;  //是否开启自动完成

    /**回调函数*/
    this.call = ao.call||Util.emptyFunction;        //默认赋值后的回调函数
    this.setCall = ao.setCall;                      //赋值函数
    this.statsCall = ao.statsCall;                  //状态改变时回调函数，用于侧边搜索状态的改变。参数：v int 0表示非搜索状态，1为搜索状态
    this.resultCall = ao.resultCall;                //本次搜索完成时的回调函数，参数num:搜索到的记录数,value:当前搜索的值
    this.matchCall = ao.matchCall;                  //匹配数据后，执行的回调函数，该函数将覆盖系统默认的处理函数。参数data:匹配成功的数据项
    this.changeCall = ao.changeCall;                //字符改变时，回调函数

    this.data = [];                                 //数据源
    this.list = [];                                 //匹配的节点数据
    this.div = typeof(ao.div)=="object"?ao.div:this.doc.getElementById(ao.div); //显示匹配数据的div
    this.index = -1;                                //当前选中行的索引
    this.isOk = true;
    this.isSearch = !!this.div;
    //this.template = ao.template?ao.template:(this.isSearch? "<b>$KEY$</b>":"<strong>$KEY$</strong>");
    this.matchIndexs = [];                          //缓存匹配索引数据
    this.beforeMatchValue = "";
    this.matchValue = "";
    this.isAutoSize = ao.isAutoSize || false;       //是否自动设置文本框的高度高度
    //数据显示模板配置 $NAME$:名字,$VALUE$:值,$WORD$:字母
    this.showTemplate = ao.showTemplate?ao.showTemplate:"&quot;$NAME$&quot; &lt;$VALUE$&gt;";
    //赋值模板配置 $NAME$:名字,$VALUE$:值,$WORD$:字母
    this.setTemplate = ao.setTemplate?ao.setTemplate:"$NAME$ &lt;$VALUE$&gt;";
    //关键字高亮模板 $KEY$: 匹配到的关键字
    this.keyTemplate = ao.keyTemplate?ao.keyTemplate:"<strong>$KEY$</strong>";
    this.fixWidth = ao.fixWidth || 0;
    this.offsetFun = ao.offsetFun || function(){return [0,0];};
    this.fromType = ao.fromType || 'default';
    if(this.isSearch){
        this.showTemplate = '<span class="name">$VALUE$</span><span>$NAME$</span>';
        this.keyTemplate = '<b>$KEY$</b>';
    }
    this.single = false || ao.single;
	this.cancelSearch=true;//异步加载时,防止输入速度过快的问题.
}

AutoFill.cache = {};

AutoFill.prototype.init = function(dataType){
    var p = this;
    p.text = p.text || p.objText;
    p.dataType = dataType;
    var div = null;
    //去掉源数据中的重复数据
    var data = p.data;
    if(LMD.isComplete&&typeof(data)=="object"){
        /*p.data = data.unique(function(v){
            return v.value;
        });*/
    }else{
        return;
    }
    if(!p.isSearch){
        div = p.doc.getElementById("autoFill_Div_"+p.id);
        if(!div){
            div = El.createElement("div","autoFill_Div_"+p.id,"autoComplete",p.doc);
            p.doc.body.appendChild(div);
            div.className = "autoComplete";
            div.oncontextmenu = function(){
                return false;
            };
            El.hide(div);
        }
        p.div = div;
    }

    function doKeyUp() {
        var ev = EV.getEvent() || p.win.event;
        var keyCode = EV.getCharCode(ev);
        //enter在keydown实现
        if (keyCode == KEYCODES.ENTER) {
            return;
        }
        p.showList(p);
    }

    p.objText.ondbclick = doKeyUp;
    if (p.autocomplete) {
         EV.addEvent(p.objText,"keydown",function(){
             var ev = EV.getEvent() || p.win.event;
             var keyCode =  EV.getCharCode(ev);
             if (keyCode == KEYCODES.ENTER) {
                 //enter选值在keydown实现
                 p.setValue(p.index);
                 parent.EV.stopEvent(ev);
                 return false;
             }
         });
         EV.observe(p.objText, "keyup", doKeyUp);
    }
    p.objText.autocomplete = "off";

    if(p.isAutoSize){
        p.ats = new AutoTextSize(p.objText,p.win,{max:3});
    }

    if(typeof(p.win.fGoto)!="function"){
        p.win.fGoto = Util.emptyFunction;
    }
    if(!p.noHideDiv)
        p.initHideEvent(p.doc);
    if(!AutoFill.cache[p.cacheKey]){
        AutoFill.cache[p.cacheKey] = {};
    }
};

AutoFill.prototype.showList = function(p1){
	
    var plist = p1;
    var pthis = this;
    if (!plist) {
        return;
    }
    var ev = EV.getEvent() || this.win.event;
    var kc = EV.getCharCode(ev);
    var isOk = plist.doKeyCode(kc);
    if (isOk) {
        plist.list.length = 0;
        var objText =(pthis.autocomplete==false?plist.text: EV.getTarget(ev));
        var textValue = objText.value;
        textValue = textValue.replace(/[\s]+/gi, "");
        var lastSep;
        if (plist.dataType == "email") {
            textValue = textValue.replace(",", ";");
            lastSep = textValue.lastIndexOf(";");
        }else{
            textValue = textValue.replace(";", ",");
            lastSep = textValue.lastIndexOf(",");
        }
        var lastValue = textValue.substr(lastSep + 1);
        if(plist.single){
            lastValue = objText.value;
        }
        if (lastValue == "" || ",;".indexOf(lastValue)>-1) {
            if(typeof(plist.statsCall)=="function"){
                plist.statsCall(0);
            }else{
                El.hide(plist.div);
            }
            plist.matchValue = "";          //
            plist.beforeMatchValue = "";    //
            plist.isOk = false;
        } else {
            plist.isOk = (lastValue.length >= plist.startNum) ? true : false;
        }

    }
    plist.isOk = plist.isOk && isOk;
    //window.setTimeout(function(){p.isOk=true;},2000);
    if (plist.isOk) {
        //if (ischeck){return;}
        //ischeck = true;
        //setTimeout(function(){ischeck=false;},300)
        //lastFocusSpanEamilIndex = -1;
        if(typeof(plist.changeCall)=="function"){
            plist.changeCall(lastValue,plist.beforeMatchValue);
        }
        if(typeof(plist.statsCall)=="function"){
            plist.statsCall(1);
        }
        plist.index = -1;
        var len = plist.line;
        var html = "";
        var hrefNode = plist.doc.createElement("a");
        hrefNode.href = "javascript:fGoto();";
        var ld = plist.data;
		function rendResult(userArray){
			if(userArray){
				ld=userArray;
			}
			var ma = new MatchAddr({
				matchIsCase: plist.matchIsCase,
				matchIsStr: plist.matchIsStr,
				matchIsStart: plist.matchIsStart
			});
			var regOk = ma.init(lastValue, plist.keyTemplate);
			if (!regOk) {
				return;
			}
			El.removeChildNodes(plist.div);
			if (plist.isSearch) {
				var findDiv = El.createElement("div", "autoFind_Div_" + plist.id, "action", plist.doc);
				findDiv.innerHTML = Lang.Mail.addr_FindStr;
				plist.div.appendChild(findDiv);
			}
			var num = 0;
			var matchIndex = [];
			var startIndex = 0;
			var CD = AutoFill.cache[plist.cacheKey];
			var bcacheKey = "";
			var matchData = {};
			if (lastValue.length > 1) {
				bcacheKey = lastValue.substring(0, lastValue.length - 1);
			}
			//与上一次匹配的字符进行比较
			plist.matchValue = lastValue;
			matchIndex = matchIndex || [];
			matchIndex = matchIndex.unique();
			/*if(matchIndex.length>0){
	 startIndex = parseInt(matchIndex[matchIndex.length-1],10) + 1;
	 }*/
			plist.beforeMatchValue = plist.matchValue;
			var makeFuc = function(n){
				var ldata = ld[n];
				var value = ldata.value;
				var name = ldata.name;
				var v = pthis.text.value ? pthis.text.value.replace(/\s/g, '') : pthis.text.value;
				if (value.inStr(v) && value != v) {
					return false;
				}
				var match = ma.getMatch(ldata);
				if (match.isOK && !matchData[value]) {
					//CDV[num] = parseInt(n, 10); //缓存数据
					matchData[value] = 1;
					if (typeof(plist.matchCall) == "function") {
						plist.matchCall(ldata);
					}
					else {
						var listNode = hrefNode.cloneNode(true);
						if (plist.isSearch) {
							listNode.id = num + "_autoSearch";
						}
						else {
							listNode.id = num + "_autoComplete";
						}
						html = plist.getReplaceValue(plist.showTemplate, match);
						listNode.innerHTML = html;
						listNode.onmouseover = function(){
							plist.doMouseOver(this.id);
						};
						//click to mousedown
						listNode.onmousedown = function(){
							plist.doClick(this.id);
						};
						plist.list[num] = {
							name: name,
							value: value,
							node: listNode
						};
						if (num == 0) {
							listNode.className = 'hover';
						}
						plist.div.appendChild(listNode);
					}
					num++;
				}
			};
			//计时，统计效率 start
			var st = new Date().getTime();
			var cache = 0;
			if (matchIndex.length >= len || matchIndex.length == 0) {
				for (var j = startIndex, ldlen = ld.length; j < ldlen && num < len; j++) {
					makeFuc(j);
				}
			}
			//计时，统计效率 end
			var et = new Date().getTime();
			if (typeof(plist.resultCall) == "function") {
				plist.resultCall(num, plist.matchValue);
			}
			else {
				if (!plist.isSearch) {
					if (num > 0) {
						if (pthis.fixWidth) {
							plist.div.style.width = pthis.fixWidth + 'px';
						}
						else {
							plist.div.style.width = Math.max(El.width(plist.objText) - 2, 0) + "px";
						}
						var offsetX = 0;
						var offsetY = 0;
						if (typeof plist.offsetFun == 'function') {
							var offsetSize = plist.offsetFun();
							offsetX = offsetSize[0];
							offsetY = offsetSize[1];
						}
						plist.div.style.left = (El.getX(plist.objText) + offsetX) + "px";
						plist.div.style.top = El.getY(plist.objText) + El.height(plist.objText) + offsetY + "px";
						El.show(plist.div);
					//用于计时测试性能
					//listNode = hrefNode.cloneNode(true);
					//listNode.innerHTML = "count:"+plist.data.length+" time:"+(et-st)+"ms start:"+startIndex+" cache:"+cache;
					//plist.div.appendChild(listNode);
					}
					else {
						//没有匹配到任何数据，删除缓存的key
						delete plist.matchIndexs[plist.matchValue];
						El.hide(plist.div);
					}
				}
				else {
					plist.doc.getElementById("autoFind_Div_" + plist.id).innerHTML = Lang.Mail.addr_FindStr;//+plist.data.length+" T:"+(et-st)+"ms start:"+startIndex+" cache:"+cache;;
					if (num == 0) {
						plist.doc.getElementById("autoFind_Div_" + plist.id).innerHTML = Lang.Mail.addr_FindNoLinkMan;// time:"+(et-st)+"ms";
					}
				}
			}
			plist.doKeyCode(40);
		}
		if (parent.gMain.synMode && parent.gMain.synMode == "1") {
			var s = this.queryResult(textValue, function(list){
														 	rendResult(list);
														 });
			pthis.cancelSearch = setTimeout(s, 500);
		}else{
			rendResult();

		}
		
    }
};


AutoFill.prototype.initHideEvent = function(doc){
    var p1 = this;
    doc = doc || window.document;
    if (!p1.win.isInitHideEvent) {
        EV.observe(doc || window.document, "click", hideDiv);
        p1.win.isInitHideEvent = true;
    }

    function hideDiv(){
        try {
            //if (p1.div.style.display != "none") {
                El.hide(p1.div);
            //}
        } catch (e) {}
    }
};

/**
 * 按键处理
 * left 37,top 38,right 39,bottom:40
 * Esc 27,Enter 13
 * @param {Object} e
 */
AutoFill.prototype.doKeyCode = function(kc){
    var p = this;
    if (kc == 13 || (kc >= 37 && kc <= 40)) {
        switch (kc) {
            case 13:
                p.setValue(p.index);
                break;
            case 37:
            case 38:
                setFocus(p.index - 1);
                break;
            case 39:
            case 40:
                setFocus(p.index + 1);
                break;
        }
        return false;
    }else{
        return true;
    }

    function setFocus(index){
        var len = p.list.length;
        if(index<0){
            index = len-1;
        }
        if(index>=len){
            index = 0;
        }
        var o1 = p.list[p.index];
        if(o1){
            El.removeClass(o1.node,"hover");
        }
        var o2 = p.list[index];
        if(o2){
            p.index = index;
            El.addClass(o2.node,"hover");
        }
    }
};

AutoFill.prototype.doMouseOver = function(id){
    var p = this;
    id = id || "";
    var index = id.split("_")[0] || 0;
    var o = p.list[index];

    if(o){
        El.addClass(o.node,"hover");
    }
    if(index!=p.index){
        var o1 = p.list[p.index];
        if(o1){
            El.removeClass(o1.node,"hover");
        }
        p.index = index;
    }
};


AutoFill.prototype.doClick = function(id){
    var p = this;
    id = id || "";
    var index = id.split("_")[0] || 0;
    p.setValue(index);
    setTimeout(function () {
        p.objText.focus();
    }, 0);
};


AutoFill.prototype.getReplaceValue = function(temp,v){
    var ret = "";
    if(temp&&v){
        ret = temp.replace("$NAME$",v.name||"");
        ret = ret.replace("$VALUE$",v.value||"");
        ret = ret.replace("$WORD$",v.word||"");
    }
    return ret;
};

AutoFill.prototype.setValue = function(index){
    var p = this;
    p.matchIndexs = [];
    var connectors;
    if (p.dataType == "email") {
        connectors = ";";
    }else{
        connectors = ",";
    }
    index = Math.max(index,0);
    index = Math.min(index,p.list.length);
    var v = p.list[index];
    var ot = p.text;
    if (v){
        var val = v.value;
        var template = AddrList.getReplaceValue(p.setTemplate,v);
        if (p.setCall) {
            p.setCall(val,template.decodeHTML());
        }else{
            var textValue = ot.value;
            var s = AddrList.getSetValue(textValue,v.value,template,connectors);
            if (s) {
                ot.value = s;
                ot.focus();
            }
            El.setCursorPos(p.objText);
        }
        if (!p.noHideDiv) {
            El.hide(p.div);
        }
        if(p.isAutoSize){
            p.ats.doSize();
        }
        if(typeof(p.call)=="function"){
            p.call(ot);
        }
    }else{
        EV.preventDefault();
    }
};

//自动完成类全局数据对象
AutoFill.datas = [];

AutoFill.prototype.queryResult=function(key,callback1){
	var p = this;
	clearTimeout(this.cancelSearch);
	return function(){
		MM.mailRequest({
			func: "suite:mix_search",
			data: {
				"total": p.line,
				"content": key
			},
			call: function(data){
				var userList = data["var"];
				var userArray = [];
				for (var i = 0; i < userList.length; i++) {
					userArray.push({
						fullword: key,
						id: userList[i].email,
						name: userList[i].first_name,
						value: userList[i].email,
						word: key
					})
				}
				callback1(userArray);
			},
			failCall:function(){
			}
		})
	}
};


var KEYCODES = {//浏览器版本不一样 keyCode会不一样
    A: 65,
    C: 67,
    X: 88,
    V: 86,
    UP: 38,
    DOWN: 40,
    ENTER: 13,
    SPACE: 32,
    TAB: 9,
    LEFT: 37,
    RIGHT: 39,
    DELETE: 46,
    BACKSPACE: 8,
    //分号
    SEMICOLON: (jQuery.browser.mozilla || jQuery.browser.opera) ? 59 : 186,
    //逗号
    COMMA: 188,
    getKeyCode: function (e) {
        return e.keyCode;
    }
};