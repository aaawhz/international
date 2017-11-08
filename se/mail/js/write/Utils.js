;;;(function($,window){
    /*
     * 从个邮抽取辅助工具
     */
    var Utils = {
        focusTextBox : function(objTextBox) {
            try {
                if(document.all) {
                    var r = objTextBox.createTextRange();
                    r.moveStart("character", objTextBox.value.length);
                    r.collapse(true);
                    r.select();
                } else {
                    objTextBox.setSelectionRange(objTextBox.value.length, objTextBox.value.length);
                    objTextBox.focus();
                }
            } catch(e) {
            }
        },
        /***
         *获得描述性的文件大小文本，如：传入1124，返回1.1KB
         *@param {Number} fileSize 必选参数，文件大小
         *@param {String} options.byteChar 可选参数,可以把"B"替换为"字节"
         *@param {String} options.maxUnit 可选参数,最大单位,目前支持：B|K|M,默认为G
         *@param {String} options.comma 可选参数,是否用逗号分开每千单位
         *@returns {String}
         *@example
         //返回1G
         $T.Utils.getFileSizeText(1024 * 1024 * 1024);
         //返回10字节
         $T.Utils.getFileSizeText(10,{
        byteChar:"字节"
        });
         //返回102400B
         $T.Utils.getFileSizeText(102400,{
        maxUnit:"B"
        });
         //返回5,000KB
         $T.Utils.getFileSizeText(1024 * 5000,{
        maxUnit:"K",
        comma:true
        });
         */
        getFileSizeText: function (fileSize, options) {
            var unit = "B";
            if (!options) { options = {};}
            if (options.byteChar) {
                unit = options.byteChar; //用"字节"或者"Bytes"替代z最小单位"B"
                if (options.maxUnit == "B") options.maxUnit = unit;
            }
            var maxUnit = options.maxUnit || "G";
            if (unit != maxUnit && fileSize >= 1024) {
                unit = "K";
                fileSize = fileSize / 1024;
                if (unit != maxUnit && fileSize >= 1024) {
                    unit = "M";
                    fileSize = fileSize / 1024;
                    //debugger
                    if (unit != maxUnit && fileSize >= 1024) {
                        unit = "G";
                        fileSize = fileSize / 1024;
                    }
                }
                fileSize = Math.ceil(fileSize * 100) / 100;
            }
            if (options.comma) {
                var reg = /(\d)(\d{3})($|\.)/;
                fileSize = fileSize.toString();
                while (reg.test(fileSize)) {
                    fileSize = fileSize.replace(reg, "$1,$2$3");
                }
            }
            return fileSize + unit;
        },
        /**
         *截断字符串，并显示省略号
         * @param {String} text 必选参数，要截断的字符串。
         * @param {Number} maxLength 必选参数，文字长度。
         * @param {Boolean} showReplacer 可选参数，截断后是否显示...，默认为true。
         *@returns {String}
         */
        getTextOverFlow: function (text, maxLength, showReplacer) {
            if (text.length <= maxLength) {
                return text;
            } else {
                return text.substring(0, maxLength) + (showReplacer ? "..." : "");
            }
        },
        getTextOverFlow2: function (text, maxLength, showReplacer) {
            var charArr = text.split("");
            var byteLen = 0;
            var reg=new RegExp("[\x41-\x5A]|[^\x00-\xff]", "g")
            for (var i = 0; i < charArr.length; i++) {
                var cArr = charArr[i].match(reg);
                byteLen += (cArr == null ? 1 : 2)

                if (byteLen > maxLength) {
                    return text.substring(0, i) + (showReplacer ? "..." : "");
                }
            }
            return text;

        },
        /***
         *格式化字符串，提供数组和object两种方式
         *@example
         *$T.Utils.format("hello,{name}",{name:"kitty"})
         *$T.Utils.format("hello,{0}",["kitty"])
         *@returns {String}
         */
        format: function (str, arr) {
            var reg;
            if ($.isArray(arr)) {
                reg = /\{([\d]+)\}/g;
            } else {
                reg = /\{([\w]+)\}/g;
            }
            return str.replace(reg,function($0,$1){
                var value = arr[$1];
                if(value !== undefined){
                    return value;
                }else{
                    return "";
                }
            });
        },
        /**
         * 得到字符串长度
         * <pre>示例：<br>
         * <br>alert("123".getBytes());
         * </pre>
         * @return {字符长度]
        */
        getBytes: function (str) {
            var cArr = str.match(/[^\x00-\xff]/ig);
            return str.length + (cArr == null ? 0 : cArr.length);
        },
        /**
         * 得到xml对象
         * <pre>示例：<br>
         * <br>Utils.getXmlDoc(xmlStr);
         * </pre>
         * @param {Object} xml 必选参数，xml字符串。
         * @return {xml对象}
         */
        getXmlDoc : function(xml) {
            if (document.all) {
                var ax = this.createIEXMLObject();
                ax.loadXML(xml);
                return ax;
            }
            var parser = new DOMParser();
            return parser.parseFromString(xml, "text/xml");
        },
        createIEXMLObject : function() {
            var XMLDOC = ["Microsoft.XMLDOM","MSXML2.DOMDocument.6.0", "MSXML2.DOMDocument.5.0", "MSXML2.DOMDocument.4.0", "MSXML2.DOMDocument.3.0", "MSXML.DOMDocument"];
            if (window.enabledXMLObjectVersion) return new ActiveXObject(enabledXMLObjectVersion);
            for (var i = 0; i < XMLDOC.length; i++) {
                try {
                    var version = XMLDOC[i];
                    var obj = new ActiveXObject(version);
                    if (obj) {
                        enabledXMLObjectVersion = version;
                        return obj;
                    }
                } catch (e) { }
            }
            return null;
        },
        /**
         * 编码html标签字符
         * <pre>示例：<br>
         * <br>Utils.htmlEncode("&lt;div&gt;内容&lt;div/&gt;");
         * </pre>
         * @param {string} str 必选参数，要编码的html标签字符串
         * @return {编码后的字符串}
         */
        htmlEncode: function(str){
            if (typeof str == "undefined") return "";
            str = str.replace(/&/g, "&amp;");
            str = str.replace(/</g, "&lt;");
            str = str.replace(/>/g, "&gt;");
            str = str.replace(/\"/g, "&quot;");
            //str = str.replace(/\'/g, "&apos;"); //IE不支持apos
            str = str.replace(/ /g, "&nbsp;");
            str = str.replace(/&amp;#([^\;]+);/ig, "&#$1;"); //将&#20117;转成相应的汉字“井”
            return str;
        },
        /**
         * 转换签名邮箱成对象。
         * <pre>示例：<br>
         * <br>Utils.parseSingleEmail('"签名"<帐号@139.com>');
         * </pre>
         * @param {Object} text 必选参数，邮箱地址。如："签名"<帐号@139.com> 或 帐号@139.com
         * @return {Object 如result.addr,result.name,result.all}
         */
        parseSingleEmail : function(text) {
            text = $.trim(text);
            var result = {};
            var reg = /^([\s\S]*?)<([^>]+)>$/;
            if (text.indexOf("<") == -1) {
                result.addr = text;
                result.name = text.split("@")[0];
                result.all = text;
            } else {
                var match = text.match(reg);
                if (match) {
                    result.name = $.trim(match[1]).replace(/^"|"$/g, "");
                    result.addr = match[2];
                    //姓名特殊处理,某些客户端发信,姓名会多带一些引号或斜杠
                    result.name = result.name.replace(/\\["']/g, "").replace(/^["']+|["']+$/g, "");
                    result.all = "\"" + result.name.replace(/"/g, "") + "\"<" + result.addr + ">";
                } else {
                    result.addr = text;
                    result.name = text;
                    result.all = text;
                }
            }
            if(result.name){
                result.name = this.htmlEncode(result.name);
            }
            return result;
        },
        /**
         * 获取文件格式图标
         * size = 1 大图标 size = 0 小图标
         */
        getFileIcoClass: function(size,fileName){
            var reg = /\.(?:doc|docx|xls|xlsx|ppt|pptx|pdf|txt|html|htm|jpg|jpeg|jpe|jfif|gif|png|bmp|tif|tiff|ico|rar|zip|7z|exe|apk|ipa|mp3|wav|iso|avi|rmvb|wmv|flv|bt|fla|swf|dvd|cd|fon)$/i;
            var length = fileName.split(".").length;
            var fileFormat = fileName.split(".")[length-1].toLowerCase();
            if(reg.test(fileName)){
                return size == 1 ? "i_file i_f_" + fileFormat : "i_file_16 i_m_" + fileFormat;
            }else{
                return size == 1 ? "i_file i_f_139" : "i_file_16 i_m_139";
            }
        },

        /**
         * 文本编辑框文字聚焦到最后
         * <pre>示例：<br>
         * <br>$T.Utils.textFocusEnd(document.getElementById('text'));
         * </pre>
         * @param {Object} textObj 必选参数，文本框DOM对象
         */
        textFocusEnd: function(textObj){
            if(textObj){
                textObj.focus();
                var len = textObj.value.length;
                if (document.selection) { //IE
                    var sel = textObj.createTextRange();
                    sel.moveStart('character', len);
                    sel.collapse();
                    sel.select();
                } else if (typeof textObj.selectionStart == 'number' && typeof textObj.selectionEnd == 'number') {
                    textObj.selectionStart = textObj.selectionEnd = len; //非IE
                }
            }
        }
    };

//
// /**
    // * 自动完成菜单类
    // * <pre>示例：<br>
    // * <br>AutoCompleteMenu(document.getElementById("inputText"),inputCallback(),itemClickHandler());
    // * </pre>
    // * @param {Object} host 必选参数，宿主对象，如：文本框。
    // * @param {Object} inputCallback 必选参数，输入框改变回调函数。
    // * @param {Object} itemClickHandler 必选参数，搜索出的下拉列表点击回调函数。
    // * @return {无返回值}
    // */
// function AutoCompleteMenu(host,inputCallback,itemClickHandler)
// {
    // var This = this;
    // var key = {
    // up: 38,
    // down: 40,
    // enter: 13,
    // space: 32,
    // tab: 9,
    // left: 37,
    // right: 39
    // };
    // var isIE9 = top.$.browser.msie && top.$.browser.version > 8;
    // var isShow = false;
    // var doc = host.ownerDocument;
    // var itemFocusColor = "#3399FE";
    // var menuCSSText = "position:absolute;z-index:101;display:none;border:1px solid #99ba9f;height:200px;overflow:auto;overflow-x:hidden;background:white";
    // var itemCSSText = "width:100%;line-height:20px;text-indent:3px;cursor:pointer;display:block;";
    // var bgIframe = doc.createElement("iframe");
    // with (bgIframe.style) {
    // position = "absolute";
    // zIndex = 100;
    // display = "none";
    // }
    // var items = [];
    // var container = doc.createElement("div");
    // container.onclick = function(e) {
    // Utils.stopEvent(e);
    // }
    // container.onmousedown = function(e) {
    // Utils.stopEvent(e);
    // }
    // if (document.all) {
    // $(document).click(hide);
    // }
    // function clear() {
    // items.length = 0;
    // container.innerHTML = "";
    // }
    // this.addItem = function(value, title) {
    // if (typeof value == "object") {
    // var span = value;
    // } else {
    // var span = doc.createElement("span");
    // span.value = value;
    // span.innerHTML = title;
    // }
    // if (document.all) {
    // span.style.cssText = itemCSSText;
    // } else {
    // span.setAttribute("style", itemCSSText);
    // }
//
    // span.onmousedown = function() {
    // itemClickHandler(this);
    // hide();
    // var key = host.getAttribute("setvaluehandler");
    // if (key && window[key]) {
    // window[key]();
    // }
    // }
    // span.onmouseover = function() { selectItem(this); }
    // span.menu = this;
    // span.selected = false;
    // items.push(span);
    // container.appendChild(span);
    // }
    // function getSelectedItem() {
    // var index = getSelectedIndex();
    // if (index >= 0) return items[index];
    // return null;
    // }
    // function getSelectedIndex() {
    // for (var i = 0; i < items.length; i++) {
    // if (items[i].selected) return i;
    // }
    // return -1;
    // }
    // //设置选中行
    // function selectItem(item) {
    // var last = getSelectedItem();
    // if (last != null) blurItem(last);
    // item.selected = true;
    // item.style.backgroundColor = itemFocusColor;
    // item.style.color = "white";
    // menuScroll(item, container); //如果选中的项被遮挡的话则滚动滚动条
    // function menuScroll(element, container) {
    // var elementView = {
    // //top:      element.offsetTop,这样写ff居然跟ie的值不一样
    // top: getSelectedIndex() * element.offsetHeight,
    // bottom: element.offsetTop + element.offsetHeight
    // };
    // var containerView = {
    // top: container.scrollTop,
    // bottom: container.scrollTop + container.offsetHeight
    // };
    // if (containerView.top > elementView.top) {
    // container.scrollTop -= containerView.top - elementView.top;
//
    // } else if (containerView.bottom < elementView.bottom) {
    // container.scrollTop += elementView.bottom - containerView.bottom;
    // }
    // }
    // }
    // //子项失去焦点
    // function blurItem(item) {
    // item.selected = false;
    // item.style.backgroundColor = "";
    // item.style.color = "";
    // }
    // function show() {
    // if (isShow) return;
    // if (container.parentNode != doc.body) {
    // doc.body.appendChild(container);
    // doc.body.appendChild(bgIframe);
    // }
    // with (container.style) {
    // Utils.offsetHost(host, container);
    // display = "block";
    // width = Math.max(host.offsetWidth,400) + "px";
    // if (items.length < 7) {
    // height = items[0].offsetHeight * items.length + 10 + "px";
    // } else {
    // height = items[0].offsetHeight * 7 + "px";
    // }
    // }
    // var showBGIframe = false;
    // if(document.all && !isIE9)showBGIframe = true;
    // if(navigator.userAgent.indexOf("Chrome")>0){
    // showBGIframe = true;
    // }
    // with (bgIframe.style) {
    // left = container.style.left;
    // top = container.style.top;
    // width = Math.max(0, container.offsetWidth - 3) + "px";
    // height = Math.max(0,container.offsetHeight - 3) + "px";
    // if (showBGIframe) display = "";
    // }
    // selectItem(items[0]); //显示的时候选中第一项
    // isShow = true;
    // }
    // function hide() {
    // if (!isShow) return;
    // container.style.display = "none";
    // bgIframe.style.display = "none";
    // clear();
    // isShow = false;
    // }
    // if (document.all) {
    // container.style.cssText = menuCSSText;
    // host.attachEvent("onkeyup", host_onkeyup);
    // host.attachEvent("onblur", host_onblur);
    // host.attachEvent("onkeydown", host_onkeydown);
    // } else {
    // container.setAttribute("style", menuCSSText);
    // host.addEventListener("keyup", host_onkeyup, true);
    // host.addEventListener("blur", host_onblur, true);
    // host.addEventListener("keydown", host_onkeydown, true);
    // }
    // //优化使用输入法无法捕获输入事件时，用计时器监听
    // var listenTextChangeTimer = setInterval(function(){
    // try{
    // if(host.value && host.getAttribute("last_handler_value") != host.value){
    // host_onkeyup({});
    // }
    // }catch(e){
    // clearInterval(listenTextChangeTimer);
    // }
    // },1000);
//
    // function host_onkeyup(evt) {
    // switch ((evt || event).keyCode) {
    // case key.enter:
    // case key.up:
    // case key.down:
    // case key.left:
    // case key.right: return;
    // }
    // hide();
//
    // host.setAttribute("last_handler_value",host.value);
//
    // inputCallback(This, evt || event);
    // if (items.length > 0) show();
    // }
    // function host_onblur() {
    // if (!document.all) hide();
    // }
    // function host_onkeydown(evt) {
    // evt = evt || event;
    // switch (evt.keyCode) {
    // case key.space:
    // case key.tab:
    // case key.enter: doEnter(); break;
    // case key.up: doUp(); break;
    // case key.down: doDown(); break;
    // case key.right:
    // case key.left: hide(); break;
    // default: return;
    // }
    // function doEnter() {
    // var item = getSelectedItem();
    // if (item != null) item.onmousedown();
    // if (evt.keyCode == key.enter) {
    // Utils.stopEvent(evt);
    // }
    // }
    // function doUp() {
    // var index = getSelectedIndex();
    // if (index >= 0) {
    // index--;
    // index = index < 0 ? index + items.length : index;
    // selectItem(items[index]);
    // }
    // }
    // function doDown() {
    // var index = getSelectedIndex();
    // if (index >= 0) {
    // index = (index + 1) % items.length;
    // selectItem(items[index]);
    // }
    // }
    // }
// }
//
// //预先处理 合并最近联系人紧密联系人与常用联系人，排除重复
// function preLinkManListData(LinkManList,LastLinkList,CloseLinkList){
    // if (window.allLinkMan) return window.allLinkMan;
//
    // fixAttr(LinkManList);
    // if (LastLinkList) fixAttr(LastLinkList);
    // if (CloseLinkList) fixAttr(CloseLinkList);
//
    // allLinkMan = [];
    // if (LastLinkList) allLinkMan = allLinkMan.concat(LastLinkList);
    // if (CloseLinkList) allLinkMan = allLinkMan.concat(allLinkMan);
    // allLinkMan = allLinkMan.concat(LinkManList);
    // removeReqeat(allLinkMan);
//
    // function fixAttr(arr){
    // for(var i=0;i<arr.length;i++){
    // var o=arr[i];
    // o.lowerAddr=o.addr.toLowerCase();
    // o.lowerName=o.name.toLowerCase();
    // o.jianpin = o.jianpin || "";
    // o.quanpin = o.quanpin || "";
    // }
    // }
    // //排除重复，并且用后面的名字替代前面的名字
    // function removeReqeat(listAll){
    // var map = {};
    // for(var i=0;i<listAll.length;i++){
    // var item=listAll[i];
    // if (!item.lowerAddr) continue;
    // if(!map[item.lowerAddr+"_"+item.name]){
    // map[item.lowerAddr+"_"+item.name] = i + 1;
    // }else{
    // listAll[map[item.lowerAddr+"_"+item.name] - 1] = item;
    // listAll.splice(i, 1);
    // i--;
    // }
    // }
    // }
    // return allLinkMan;
// }
// function __getAuto__(LinkManList, LastLinkList, CloseLinkList,text,host){
    // var contacts = preLinkManListData(LinkManList, LastLinkList, CloseLinkList);
    // var len=contacts.length;
    // var matches=[];
    // var matchTable = {};
    // var attrToNumber={
    // "addr":"01",
    // "name":"02",
    // "quanpin":"03",
    // "jianpin":"04"
    // }
    // var numberToAttr={
    // "01":"addr",
    // "02":"name",
    // "03":"quanpin",
    // "04":"jianpin"
    // }
//
//
//
    // var SPLIT_CHAR = "0._.0";//匹配键的分隔符
    // //高性能哈希，匹配下标+匹配属性=key，value为匹配结果集合
    // function pushMatch(attrName,index,arrIndex){
    // var matchKey = index + SPLIT_CHAR + attrName;
    // if (index < 10) matchKey = "0" + matchKey;
    // var arr = matchTable[matchKey];
    // if (!arr) matchTable[matchKey] = arr = [];
    // arr.push(arrIndex);
    // }
    // for(var i=0;i<len;i++){
    // var item=contacts[i];
    // if (host.value.indexOf("<" + item.addr + ">") > 0) continue;
    // var minIndex=10000;
    // var minIndexAttr = null;
    // var index = item.lowerAddr.indexOf(text);
    // if(index !=-1 && index <minIndex){
    // minIndex = index;
    // minIndexAttr = attrToNumber.addr;
    // }
    // if (index == 0) {
    // pushMatch(minIndexAttr,minIndex,i);
    // continue;
    // }
    // index = item.lowerName.indexOf(text);
    // if(index !=-1 && index <minIndex){
    // minIndex = index;
    // minIndexAttr = attrToNumber.name;
    // }
    // if (minIndex == 0) {
    // pushMatch(minIndexAttr,minIndex,i);
    // continue;
    // }
//
    // if (!/[^a-zA-Z]/.test(text)){
    // index = item.quanpin.indexOf(text);
    // if(index !=-1 && index <minIndex){
    // minIndex = index;
    // minIndexAttr = attrToNumber.quanpin;
    // }
    // if (minIndex == 0) {
    // pushMatch(minIndexAttr,minIndex,i);
    // continue;
    // }
    // index = item.jianpin.indexOf(text);
    // if(index !=-1 && index <minIndex){
    // minIndex = index;
    // minIndexAttr = attrToNumber.jianpin;
    // }
    // }
    // if (minIndexAttr) {
    // pushMatch(minIndexAttr,minIndex,i);
    // continue;
    // }
    // }
//
    // var allMatchKeys=[];
    // for(var p in matchTable){
    // allMatchKeys.push(p);
    // }
    // allMatchKeys.sort(function(a,b){
    // return a.localeCompare(b);
    // });
//
    // var MAX_COUNT = 30;
    // for(var i=0;i<allMatchKeys.length;i++){
    // if (matches.length >= MAX_COUNT) break;
    // var k = allMatchKeys[i];
    // var arr = matchTable[k];
    // //从key中获取matchAttr和matchIndex，后面用于着色加粗
    // var matchAttr=getAttrNameFromKey(k);
    // var matchIndex = getMatchIndexFromKey(k);
    // for(var j=0;j<arr.length;j++){
    // var arrIndex = arr[j];
    // matches.push({
    // info: contacts[arrIndex],
    // matchAttr: matchAttr,
    // matchIndex: matchIndex
    // });
    // }
    // }
    // //var matchKey = index + SPLIT_CHAR + attrName;
    // function getAttrNameFromKey(key){
    // return numberToAttr[key.split(SPLIT_CHAR)[1]];
    // }
    // function getMatchIndexFromKey(key){
    // return parseInt(key.split(SPLIT_CHAR)[0],10);
    // }
    // return matches;
// }
//
// AutoCompleteMenu.createAddrMenu_compose = function(host, userAllEmailText) {}
// AutoCompleteMenu.createAddrMenu = function(host, userAllEmailText, dataSource, splitLetter) {
    // if (typeof userAllEmailText == "undefined") {
    // userAllEmailText = true;
    // }
    // splitLetter = splitLetter || ";";
    // var getMailReg = /^([^@]+)@(.+)$/
    // var getInput = /(?:[;,；，]|^)\s*([^;,；，\s]+)$/;
    // var allLinkMan = [];
    // if (!top.LinkManList) return;
    // if (!dataSource) {
    // var GroupList = top.GroupList;
    // var LinkManList = top.LinkManList;
    // var LastLinkList = top.LastLinkList;
    // var CloseLinkList = top.CloseLinkList;
    // } else {
    // var GroupList = dataSource.GroupList;
    // var LinkManList = dataSource.LinkManList;
    // var LastLinkList = dataSource.LastLinkList;
    // var CloseLinkList = dataSource.CloseLinkList;
    // }
//
//
    // function autoLinkMan(menu) {
    // var match = host.value.match(getInput);
    // if (!match) return false;
    // var txt = match[1].trim().toLowerCase();
    // if (txt == "") return false;
    // try {
    // if (Utils.isChinaMobileNumber(txt) && txt.length == 11) {
    // host.value = host.value.replace(/([;,；，]|^)\s*([^;,；，\s]+)$/, "$1" + txt + "@139.com;");
    // return;
    // }
    // } catch (e) { }
    // var items = __getAuto__(LinkManList,LastLinkList,CloseLinkList,txt,host);
    // var inputLength = txt.length;
    // for (var i = 0; i < items.length; i++) {
    // var matchInfo = items[i];
    // var obj = matchInfo.info;
    // var value = userAllEmailText ? "\"" + obj.name.replace(/\"/g, "") + "\"<" + obj.addr + ">" : obj.addr;
    // var addrText = "";
    // if (matchInfo.matchAttr == "addr") {
    // matchText = obj.addr.substring(matchInfo.matchIndex, matchInfo.matchIndex + inputLength);
    // addrText = obj.addr.replace(matchText, "[b]" + matchText + "[/b]");
    // addrText = "\"" + obj.name.replace(/\"/g, "") + "\"<" + addrText + ">";
    // addrText = addrText.encode().replace("[b]", "<span style='font-weight:bold'>").replace("[/b]", "</span>");
    // } else if (matchInfo.matchAttr == "name") {
    // matchText = obj.name.substring(matchInfo.matchIndex, matchInfo.matchIndex + inputLength);
    // addrText = obj.name.replace(matchText, "[b]" + matchText + "[/b]");
    // addrText = "\"" + addrText.replace(/\"/g, "") + "\"<" + obj.addr + ">";
    // addrText = addrText.encode().replace("[b]", "<span style='font-weight:bold'>").replace("[/b]", "</span>");
    // } else {
    // addrText = "\"" + obj.name.replace(/\"/g, "") + "\"<" + obj.addr + ">";
    // addrText = addrText.encode();
    // }
    // menu.addItem(value, addrText);
    // }
    // }
    // if(!host.getAttribute("backspacedeleteoff")){
    // $(host).keydown(function(e) {
    // if (e.keyCode == 8 && !e.ctrlKey && !e.shiftKey) {
    // var p = getTextBoxPos(this);
    // if (!p || p.start != p.end || p.start == 0 || p.start < this.value.length) return;
    // var lastValue = this.value;
    // var deleteChar = lastValue.charAt(p.start - 1);
    // if (/[;,；，>]/.test(deleteChar)) {
    // var leftText = lastValue.substring(0, p.start);
    // var rightText = lastValue.substring(p.start, lastValue.length);
    // var cutLeft = leftText.replace(/(^|[;,；，])[^;,；，]+[;,；，>]$/, "$1$1");
    // this.value = cutLeft + rightText;
    // }
    // }
    // });
    // }
    // function isRepeat(arr, item) {
    // for (var i = arr.length - 1; i >= 0; i--) {
    // if (item.id && item.id == arr[i].id) return true;
    // }
    // return false;
    // }
    // function linkManItemClickHandler(item) {
    // host.value = host.value.replace(/；/g, ";").replace(/，/g, ",");
    // host.value = host.value.replace(/([;,]|^)\s*([^;,\s]+)$/, "$1" + item.value + splitLetter);
    // }
    // init();
    // function init() {
    // if (LinkManList) {
    // new AutoCompleteMenu(host, autoLinkMan, linkManItemClickHandler);
    // }
    // }
// };
//
// function getTextBoxPos(textBox) {
    // var start = 0;
    // var end = 0;
    // if (typeof (textBox.selectionStart) == "number") {
    // start = textBox.selectionStart;
    // end = textBox.selectionEnd;
    // }
    // else if (document.selection) {
    // textBox.focus();
    // var workRange = document.selection.createRange();
    // var selectLen = workRange.text.length;
    // if (selectLen > 0) return null;
    // textBox.select();
    // var allRange = document.selection.createRange();
    // workRange.setEndPoint("StartToStart", allRange);
    // var len = workRange.text.length;
    // workRange.collapse(false);
    // workRange.select();
    // start = len;
    // end = start + selectLen;
    // }
    // return { start: start, end: end };
// };
//
// /**
    // * 创建产生后后缀的工菜单
    // * <pre>示例：<br>
    // * <br>AutoCompleteMenu.createPostfix(document.getElementById("inputText"));
    // * </pre>
    // * @param {Object} host 必选参数，文本框。
    // * @return{无返回值}
    // */
//
// AutoCompleteMenu.createPostfix = function(host) {
    // new AutoCompleteMenu(
    // host,
    // function(menu) {
    // var arr = ["@sina.com", "@sohu.com", "@21cn.com", "@tom.com", "@yahoo.com.cn", "@yahoo.cn"];
    // var txt = host.value;
    // if ($.trim(txt) == "") return;
    // var match = txt.match(/\w+(@[\w.]*)/);
    // for (var i = 0; i < arr.length; i++) {
    // if (match) {
    // if (arr[i].indexOf(match[1]) == 0 && arr[i] != match[1]) {
    // var value = txt.match(/^([^@]*)@/)[1];
    // menu.addItem(value + arr[i], value + arr[i]);
    // }
    // } else {
    // menu.addItem(txt + arr[i], txt + arr[i]);
    // }
    // }
    // },
    // function(item) {
    // host.value = item.value;
    // }
    // )
// };
//
// /**
    // * 包装自动完成菜单实例,从集合中找出联系人然后显示手机菜单
    // * <pre>示例：<br>
    // * <br>AutoCompleteMenu.createPhoneNumberMenuFromLinkManList(document.getElementById("inputText"),top.Lang.Mail.Write.zhangsan,[top.Lang.Mail.Write.zhangsan,top.Lang.Mail.Write.lisi])//张三  ||  张三  ||  李四
    // * @param {Object} host 必选参数，文本框。
    // * @param {string} withAddrName 必选参数，联系人。
    // * @param {Object} data 必选参数，联系人集合。
    // * @return {自动完成菜单实例}
    // */
//
// AutoCompleteMenu.createPhoneNumberMenuFromLinkManList = function (host, withAddrName, data) {
    // var regMatchPhoneNumber = /(?:^|[;,])\s*([^;,]+)$/;
    // var randomName = "randomName" + Math.random();//生成一个用于缓存数据的随机变量名
    // function textChanged(menu) {
    // var match = host.value.match(regMatchPhoneNumber);
    // var inputNumber = "";
    // if (match) {
    // inputNumber = match[1].toLowerCase();
    // } else {
    // return false;
    // }
    // var matchedCount = 0;
    // var LinkManList = window.LinkManList || [];
    // var LastLinkList = window.LastLinkList || [];
    // var CloseLinkList = window.CloseLinkList || [];
    // if (data) {
    // LinkManList = data.LinkManList || data;
    // LastLinkList = data.LastLinkList || [];
    // CloseLinkList = data.CloseLinkList || [];
    // }
    // var allLinkList = window[randomName] || (LinkManList.concat(LastLinkList).concat(CloseLinkList));
    // window[randomName] = allLinkList;
    // var mapForRep = {}; //用来排除重复的哈希表
    // for (var i = 0, j = allLinkList.length; i < j; i++) {
    // var theinfo = allLinkList[i];
    // if (!theinfo.addr) continue;
    // var num = theinfo.addr.replace(/\D/g, "");
    // var pname = theinfo.name.replace(/[<>"']/g, "");
    // var nameIndex;
    // if (host.value.indexOf(num) >= 0) continue;
    // if (num.indexOf(inputNumber) >= 0) {
    // var str = num.replace(inputNumber, "<span style='color:Red'>" + inputNumber + "</span>")
    // if (pname) str = "\"" + pname + "\"<" + str + ">";
    // if (withAddrName) {
    // addMenuItem("\"" + pname + "\"<" + num + ">", str, num);
    // } else {
    // addMenuItem(num, str, num);
    // }
    // } else if ((nameIndex = pname.toLowerCase().indexOf(inputNumber)) >= 0) {
    // var _inputNumber = pname.substring(nameIndex, nameIndex + inputNumber.length);
    // var str = pname.replace(_inputNumber, "<span style='color:Red'>" + _inputNumber + "</span>")
    // if (pname) str = "\"" + str + "\"<" + num + ">";
    // if (withAddrName) {
    // addMenuItem("\"" + pname + "\"<" + num + ">", str, num);
    // } else {
    // addMenuItem(num, str, num);
    // }
    // } else if ((theinfo.quanpin && theinfo.quanpin.indexOf(inputNumber) >= 0) || (theinfo.jianpin && theinfo.jianpin.indexOf(inputNumber) >= 0)) {
    // var str = "\"" + pname + "\"<" + num + ">";
    // if (withAddrName) {
    // addMenuItem(str, str, num);
    // } else {
    // addMenuItem(num, str, num);
    // }
    // }
    // if (matchedCount >= 50) break;
    // }
    // function addMenuItem(value, text, number) {
    // if (!mapForRep[number]) {
    // menu.addItem(value, text);
    // matchedCount++;
    // mapForRep[number] = true;
    // }
    // }
    // return !(matchedCount == 0);
    // }
    // function itemClick(item) {
    // host.value = host.value.replace(/([;,]|^)\s*([^;,\s]+)$/, "$1" + item.value + ",");
    // }
    // window.top.Contacts.ready(function () {
    // if (!window.LinkManList) {
    // top.Contacts.init("mobile", window);
    // }
    // new AutoCompleteMenu(host, textChanged, itemClick, withAddrName);
    // });
// };
//
// /**
    // * 包装自动完成菜单实例,根据输入手机号码显示搜索菜单
    // * <pre>示例：<br>
    // * <br>AutoCompleteMenu.createPhoneNumberMenuForSearchByMobile(document.getElementById("inputText"));
    // * </pre>
    // * @param {Object} host 必选参数，文本框。
    // * @return{自动完成菜单实例}
    // */
//
// AutoCompleteMenu.createPhoneNumberMenuForSearchByMobile = function(host) {
    // var regMatchPhoneNumber = /(?:^|[;,])\s*(\d+)$/;
    // function textChanged(menu) {
    // var match = host.value.match(regMatchPhoneNumber);
    // var inputNumber = "";
    // if (match) {
    // inputNumber = match[1];
    // } else {
    // return false;
    // }
    // var matchedCount = 0;
    // for (var i = 0, j = LinkManList.length; i < j; i++) {
    // if (!LinkManList[i].addr) continue;
    // var num = LinkManList[i].addr.toString();
    // var pname = LinkManList[i].name;
    // if (host.value.indexOf(num) >= 0) continue;
    // if (num.indexOf(inputNumber) == 0) {
    // var str = num.replace(inputNumber, "<span style='color:Red'>" + inputNumber + "</span>")
    // if (pname) str = "(" + pname + ")" + str;
    // menu.addItem(num, str);
    // matchedCount++;
    // }
    // if (matchedCount >= 50) break;
    // }
    // return !(matchedCount == 0);
    // }
    // function itemClick(item) {
    // host.value = host.value.replace(/([;,]|^)\s*([^;,\s]+)$/, "$1" + item.value);
    // }
    // new AutoCompleteMenu(host, textChanged, itemClick);
// };
//
// /**
    // * 包装自动完成菜单实例,根据输入提示手机号码集合显示搜索菜单
    // * <pre>示例：<br>
    // * <br>AutoCompleteMenu.createPhoneNumberMenu(document.getElementById("inputText"),手机1,手机2,手机3);
    // * </pre>
    // * @param {Object} host 必选参数，文本框。
    // * @param {array} numbers 必选参数，手机号码数组。
    // * @return {自动完成菜单实例}
    // */
//
// AutoCompleteMenu.createPhoneNumberMenu = function(host,numbers) {
    // var regMatchPhoneNumber = /(?:^|[;,])\s*(\d+)$/;
    // function textChanged(menu) {
    // var match = host.value.match(regMatchPhoneNumber);
    // var inputNumber = "";
    // if (match) {
    // inputNumber = match[1];
    // } else {
    // return false;
    // }
    // var matchedCount = 0;
    // for (var i = 0, j = numbers.length; i < j; i++) {
    // if (!numbers[i].number) continue;
    // var num = numbers[i].number.toString();
    // if (host.value.indexOf(num) >= 0) continue;
    // if (num.indexOf(inputNumber) == 0) {
    // var str = num.replace(inputNumber, "<span style='color:Red'>" + inputNumber + "</span>")
    // if (numbers[i].name) str = "(" + numbers[i].name + ")" + str;
    // menu.addItem(num, str);
    // matchedCount++;
    // }
    // if (matchedCount >= 50) break;
    // }
    // return !(matchedCount == 0);
    // }
    // function itemClick(item) {
    // host.value = host.value.replace(/([;,]|^)\s*([^;,\s]+)$/, "$1" + item.value + ",");
    // }
    // new AutoCompleteMenu(host, textChanged, itemClick);
// };
    window["Utils"] = Utils;
})(jQuery,window);
/*
 * 邮箱工具 - 抽取自个邮库
 */
var MailTool = {
    /**
     * 得到邮箱地址
     * <pre>示例：<br>
     * MailTool.getAddr('"人名"&lt;account@139.com&gt;');<br>
     * rusult is "account@139.com";
     * </pre>
     * @param {string} email 邮箱地址，如："人名"&lt;account@139.com&gt;。
     * @return {邮箱地址字符串}
     */
    getAddr: function (email) {
        if (MailTool.checkEmailText(email)) {
            return MailTool.getAccount(email) + "@" + MailTool.getDomain(email);
        }
        return "";
    },
    /**
     * 验证邮箱地址是否合法(另一种形式)
     * <pre>示例：<br>
     * MailTool.checkEmailText('"人名"&lt;account@139.com&gt;');
     * </pre>
     * @param {string} text 验证的邮箱地址字符串，如："人名"&lt;account@139.com&gt;
     * @return {Boolean}
     */
    checkEmailText: function (text) {//单个
        if (typeof text != "string") return false;
        text = jQuery.trim(text);
        //无签名邮件地址
        if (this.checkEmail(text)) {
            return true;
        }
        //完整格式
        var r1 = new RegExp('^(?:"[^"]*"\\s?|[^<>;,，；"]*)<([^<>\\s]+)>$');
        var match = text.match(r1);
        if (match) {
            if (this.checkEmail(match[1])) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    },
    /**
     * 验证邮箱地址是否合法
     * <pre>示例：<br>
     * MailTool.checkEmail('account@139.com');
     * </pre>
     * @param {string} text 验证的邮箱地址字符串
     * @return {Boolean}
     */
    checkEmail: function (text) {
        if (typeof text != "string") return false;
        text = jQuery.trim(text);
        //RFC 2822
        var reg = new RegExp("^[a-z0-9\.!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$", "i");
        var result = reg.test(text);
        return result;
    },
    /**
     * 得到邮箱地址字符中的域名部分。
     * <pre>示例：<br>
     * MailTool.getDomain('account@domain.com');<br>rusult is "domain.com"
     * </pre>
     * @param {string} email 邮件地址字符串
     * @return {域字符串}
     */
    getDomain: function (email) {
        if (typeof email != "string") return "";
        email = jQuery.trim(email);
        if (this.checkEmail(email)) {
            return email.split("@")[1].toLowerCase();
        } else if (this.checkEmailText(email)) {
            return email.match(/@([^@]+)>$/)[1].toLowerCase();
        } else {
            return "";
        }
    },
    /**
     * 返回邮箱地址的前缀部分。
     * <pre>示例：<br>
     * MailTool.getAccount('account@domain.com');<br>rusult is "account"
     * </pre>
     * @param {string} email 邮箱地址字符串
     * @return {邮箱前缀字符串}
     */
    getAccount: function (email) {
        if (typeof email != "string") return "";
        email = jQuery.trim(email);
        if (this.checkEmail(email)) {
            return email.split("@")[0];
        } else if (this.checkEmailText(email)) {
            return email.match(/<([^@<>]+)@[^@<>]+>$/)[1];
        } else {
            return "";
        }
    },
    /**
     * 得到人名+邮箱中的人名部分。
     * <pre>示例1：<br>
     * <br>MailTool.getName('"人名"&lt;account@domain.com&gt;');<br>
     * rusult is "人名"<br>
     * <br>示例2：<br>
     * <br>MailTool.getName('account@domain.com');<br>
     * rusult is "account"
     * </pre>
     * @param {string} email 复合邮箱地址。
     * @return {人名部分字符串}
     */
    getName: function (email) {
        if (typeof email != "string") return "";
        email = jQuery.trim(email);
        if (this.checkEmail(email)) {
            return email.split("@")[0];
        } else if (this.checkEmailText(email)) {
            var name = email.replace(/<[^@<>]+@[^@<>]+>$/, "");
            name = jQuery.trim(name.replace(/"/g, ""));
            if (name == "") return MailTool.getAccount(email);
            return name;
        } else {
            return "";
        }
    }
};

/**
 * 号码工具类
 */
NumberTool = {
    /**
     * 加86前缀
     * <pre>示例：<br>
     * NumberTool.add86(手机号码);
     * </pre>
     * @param {Object} number 号码字符串或数字。
     * @return {加86前缀的号码}
     */
    add86: function(number) {
        if (typeof number != "string") number = number.toString();
        return number.trim().replace(/^(?:86)?(?=\d{11}$)/, "86");
    },
    /**
     * 去86前缀
     * <pre>示例：<br>
     * NumberTool.add86(86手机号码);
     * </pre>
     * @param {Object} number 号码字符串或数字。
     * @return {去86前缀的号码}
     */
    remove86: function(number) {
        if (typeof number != "string") number = number.toString();
        return number.trim().replace(/^86(?=\d{11}$)/, "");
    },
    isChinaMobileNumber: function(num) {
        num = num.toString();
        if (num.length != 13 && num.length != 11) return false;
        if (num.length == 11) {
            num = "86" + num;
        }
        //var reg = new RegExp(top.UserData.regex);
        var reg=new RegExp('^86(134|135|136|137|138|139|147|150|151|152|157|158|159|182|183|184|187|188|130|131|132|145|155|156|185|186|133|153|180|181|189)\\d{8}$');
        return reg.test(num);
    },
    //移动手机号码的正则
    checkMobile:function(str,regstr){
        var regex;
        if(regstr){
            regex=new RegExp(regstr);
        }else{
            regex = /^(86)?((13[4-9]{1})|(15[0-2 7-9]{1})|(18[2-4 7-8]{1}))+\d{8}$/;
        }
        return regex.test(str);
    },
    checkMobileText:function(text,regstr){
        var regstr=regstr||'';
        if (/^\d+$/.test(text)) {
            return this.checkMobile(text,regstr);
        }
        var reg = /^(?:"[^"]*"|[^"<>;,；，]*)\s*<(\d+)>$/;
        var match = text.match(reg);
        if (match) {
            var number = match[1];
            return this.checkMobile(number,regstr);
        } else {
            return false;
        }
    },
    isChinaMobileNumberText: function(text) {
        if (/^\d+$/.test(text)) {
            return this.isChinaMobileNumber(text);
        }
        var reg = /^(?:"[^"]*"|[^"<>;,；，]*)\s*<(\d+)>$/;
        var match = text.match(reg);
        if (match) {
            var number = match[1];
            return this.isChinaMobileNumber(number);
        } else {
            return false;
        }
    },
    getName: function(numberText) {
        if (this.isChinaMobileNumberText(numberText)) {
            if (numberText.indexOf("<") == -1) {
                return "";
            } else {
                return numberText.replace(/<\d+>$/, "").replace(/^["']|["']$/g, "");
            }
        }
        return "";
    },
    getNumber: function(numberText) {
        if (this.isChinaMobileNumberText(numberText)) {
            if (numberText.indexOf("<") == -1) {
                return numberText;
            } else {
                var reg = /<(\d+)>$/;
                var match = numberText.match(reg);
                if (match) {
                    return match[1];
                } else {
                    return "";
                }
            }
        }
        return "";
    },
    compareNumber: function(m1, m2) {
        if ( typeof(m1) === "undefined" || typeof(m2) === "undefined" ) {
            return false
        }

        m1 = m1.toString();
        m2 = m2.toString();
        m1 = this.remove86(this.getNumber(m1));
        m2 = this.remove86(this.getNumber(m2));
        if (m1 && m1 == m2) return true;
        return false;
    },
    parse: function(inputText) {
        var result = {};
        result.error = "";
        if (typeof inputText != "string") {
            result.error = top.Lang.Mail.Write.canshubuhefa;//参数不合法
            return result;
        }
        /*
         简单方式处理,不覆盖签名里包含分隔符的情况
         */
        var lines = inputText.split(/[;,，；]/);
        var resultList = result.numbers = [];
        for (var i = 0; i < lines.length; i++) {
            var text = $.trim(lines[i]);
            if (text == "") continue;
            if (this.isChinaMobileNumberText(text)) {
                resultList.push(text);
            } else {
                result.error = top.Lang.Mail.Write.ghmbszqdsjhmVkiNsdfv + text + "”";//该号码不是正确的手机号码：“
            }
        }
        if (!result.error) {
            result.success = true;
        } else {
            result.success = false;
        }
        return result;
    },
    getSendText: function (name, number) {
        if (!Utils.isString(name) || !Utils.isString(number)) return "";
        return "\"" + name.replace(/[\s;,；，<>"]/g, " ") + "\"<" + number.replace(/\D/g,"") + ">";
    }
};