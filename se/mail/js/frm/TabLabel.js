/**
 * 顶部主菜单管理类
 */
function TabLabel(){
    this.win = window;
    this.doc = this.win.document;
    this.id = gConst.divTab;
    this.bodyId = gConst.divMain;
    this.main = null;
    this.tabbody = null;
    
    this.curid = 0;
    this.tabs = [];
    this.group = [];
    this.count = 0;
    this.width = 0;
    this.max = 100;
	this.pw = 41;
    this.min = 10;
    this.fixLeftWidth = 199; //左侧固定宽度
    this.closeAllWidth = 22; //关闭所有图标占用宽度
    this.rightSpace = 20; //右侧剩余空间
    this.history = [];
    this.call = [];
    
    this.init = function(){
        jQuery('#divTabls').css('overflow','hidden')
        try {
            var me = this;
            this.main = this.doc.getElementById(this.id);
            this.tabbody = this.doc.getElementById(this.bodyId);
            if(top.Browser.isIE){
            	this.closeAllWidth = 24; // ie 有2像素误差
            }
            this.width = CC.docWidth() - this.fixLeftWidth - this.closeAllWidth - this.rightSpace;
            jQuery(window).resize(function () {
//                重新计算每个标签页的宽度
                GE.tab.size()
                me.updateCloseAllPosition(GE.tab.count>=6);
            });
        } catch (e) {
            ch("Tab Init Error", e);
        }
    };
    this.init();
}

/**
 *  初始化多标签
 */
TabLabel.prototype = {
    /**
     * 增加一个标签<br>
     * json对象定义样例：<br.
     * var ao = {
     * 		name:'name', //标签名   <br>
     * 		text:'text', //标签显示文本<br>
     * 		group:groupid, //组id<br>
     * 		url:'test.htm', //标签打开的url地址<br>
     * 		html:html,//显示的内容<br>
     *		isLink:true,    //是否连接到一个url(同url使用)<br>
     *		exitcall:p(before,after)//退出的回调函数<br>
     * };
     * @param {object} ao json对象数据
     * @param {boolean} isHide 是否不激活标签，默认激活标签
     * @param {string} target 是否打开新tab
     */
    add: function(ao, isNotActive, target){
        var v = this;
        var id = ao.name;
        id = this.getSafeTableId(id);
        var text = ao.text || "";
        var func = ao.exitcall ||
        function(){
            return true;
        };
        
        ao.isLink = ao.isLink || false;
        ao.close = ao.close || false;
        var t = v.exist(id);
        // 同名存在
        var isreplace = false;
        var group = 0, oldtab;
        var isShowWelcome = IsShowWelcome || false;
        if (t) {
            // 直接更新body；
            if (!isNotActive) {
                v.active(id);
            }
            if (ao.srep) {
                t.b.innerHTML = ao.html;
            }
			if(ao.name=="sys0")
			{
				this.title(ao.name,ao.text);
				//t.t.title=ao.text;
				//t.t.textContent=ao.text;
				//document.getElementById
			}
            return;
        } else if (target === "blank") {
            isreplace = false;
        } else if (ao.group) {
            group = v.group[ao.group];
            if (group && group != id) {
                oldtab = v.exist(group);
                if (oldtab) {
                    isreplace = true;
                    v.group[ao.group] = id;
                }
            }
            v.group[ao.group] = id;
        }
        var win = v.win, a;
        
        /**
         * 创建标签
         */
        var tab = El.createElement('li', "tab_h_" + id);
        tab.setAttribute("tabid", id);
        tab.className = "";
        tab.onclick = doTabClick;
		tab.title = text.encodeHTML();
       // tab.title = text.stripTags();
        tab.onmouseover=function()
		{	
			if (this.className != "on") {
				this.className = "hover";
			}
		}
		tab.onmouseout = function()
		{
			if (this.className != "on") {
				this.className = "";
			}
		}
        //创建tab左边元素
        var tabL = El.createElement('i', "", "l");
        //创建tab右边元素
        var tabR = El.createElement('i', "", "r");
        //创建tab中间元素
        var tabM = El.createElement('div', "", "m");
        if (id == gConst.home) {
            tab.className = " on";
            tabM.innerHTML = "<p>" + Lang.Mail.tab_Home + "</p>";
        } 
		else if((id.indexOf("sys") != -1 || id.indexOf("user") != -1) && !isShowWelcome ){
			tab.className = " on";
            tabM.innerHTML = "<p>" +  ao.text.encodeHTML() + "</p>";
		}
		else {
            tabM.innerHTML = "<p>" + ao.text.encodeHTML() + "</p>";
            var tabClose = El.createElement('a');
            tabClose.title = Lang.Mail.Close;
            tabClose.className = "close";
            tabClose.href = "javascript:fGoto()";
            tabClose.onclick = doTabClose;
            tabM.appendChild(tabClose);
        }
        
        tab.appendChild(tabL);
        tab.appendChild(tabM);
        tab.appendChild(tabR);
        tab.ondblclick = function(){
            if (tabClose) {
                tabClose.onclick();
            }
        };
        
        if (isreplace) {
            this.main.insertBefore(tab, oldtab.t);
        } else {
            this.main.appendChild(tab);
        }
        
        /**
         * 创建标签的主体内容
         */
        var tabBody = El.createElement("div", "tab_b_" + id,'tab_outlink');
        var html;
        
        if (ao.isLink) {
            html = CC.getIframe(id, url, "auto");
        } else {
            html = ao.html;
        }
        tabBody.innerHTML = html;
        /*parent.El.setStyle(tabBody, {
        	'overflow-x': 'hidden'
        });*/
        this.tabbody.appendChild(tabBody);
        this.tabs[id] = id;
        if (id.indexOf("compose") >= 0) {
            GE.tab.composeTabs[id] = id.substr(id.indexOf('_') + 1);
        }
        v.active(id);
        v.count++;
        v.size();
        if (v.count > gConst.tab_ShowCloseAll) {
        	this.updateCloseAllPosition(true);
            //$(gConst.tab_CloseAllId).style.display = "";
        }
        
        if (isreplace) {
            v.replace(group, id);
        }
        
        /**
         * 标签单击事件处理
         */
        function doTabClick(){
            var id = this.getAttribute("tabid");
            if (id == v.curid) {
                return;
            }
            v.active(id);
            var o = id;
            if (id.indexOf('_') > -1) {
                o = id.substring(0, o.indexOf('_'));
            }
            MM[o]._resize();
        }
        
        /**
         * 标签关闭事件处理
         */
        function doTabClose(e){
            var id = this.parentNode.parentNode.getAttribute("tabid");
            if (func('before')) {
                v.del(id);
            }
            if (e != "close") {
                EV.stopEvent(e || win.event);
            }
            func('after');
            return false;
        }
    },
    /**
     * 判断一个标签是否存在
     * @param {string} id 标签id
     * @return {boolean} 返回存在的标签对象
     */
    exist: function(id){
        id = this.getSafeTableId(id);
        var v = this.tabs[id];
        var tab;
        if (v && v == id) {
            tab = {
                t: $("tab_h_" + id),
                b: $("tab_b_" + id)
            };
        } else {
            tab = null;
        }
        return tab;
    },
    /*
     * 更新全部关闭按钮位置
     * @param {boolean} open 是否显示
     */
    updateCloseAllPosition: function(open){

    	var o = $(gConst.tab_CloseAllId);
    	var docWidth = jQuery("#" + gConst.divTop).width();

    	var boxTabWidth = 0;
//        jQuery('#divTabls li').each(function(){
//            boxTabWidth=jQuery(this).outerWidth(true)+boxTabWidth
//        })
        var boxTabWidth=jQuery("#" + gConst.divTab).width()

        var left = jQuery("#" + gConst.divTab).offset().left-jQuery('#header').offset().left;
    	var r = 0;
    	var ow = El.width(o);
    	r = docWidth- left - boxTabWidth  - ow -15;
    	
    	El.setStyle(o, {
    		right: r + 'px'
    	});
    	if(open){
    		El.show(o);
    	}
    	else{
    		El.hide(o);
    	}
    },
    /**
     * 删除一个标签
     * @param {string} id 标签id
     */
    del: function(id){
        id = this.getSafeTableId(id);
        var tab = this.exist(id);
        if (!tab) {
            //ch("Tab Del Error", null);
            return;
        }
        
        if (this.curid == id) {
            this.curid = 0;
        }
        
        El.gc(tab.t);
        El.gc(tab.b);
        El.remove(tab.t);
        El.remove(tab.b);
        
        tab = null;
        delete this.tabs[id];
        delete GE.tab.composeTabs[id];
        this.count--;
        this.size();
        
        this.update(id, false);
        if (!this.curid && this.history.length) {
            var nid = this.history[this.history.length - 1];
            this.history.length--;
            this.active(nid);
        }
		this.updateCloseAllPosition(true);
		if (this.count <= gConst.tab_ShowCloseAll) {
            this.updateCloseAllPosition(false);
            //El.hide($(gConst.tab_CloseAllId));
        }
		
    },
    /**
     * 激活一个标签
     * @param {string} id 标签id
     * @param {string} isRefresh 是否刷新，一般省略
     */
    active: function(id, isRefresh){
        try {
            id = this.getSafeTableId(id);
            if(!id){
                return;
            }
            var tab = this.exist(id);
            var p1 = this;
            if (!tab) {
                //ch("Tab Active Error", null);
                return;
            }
            if (p1.curid) {
                setActive(p1.curid, false);
            }
            
            p1.curid = id;
            setActive(id, true);
            if (this.call[0]) {
                this.call[0](id);
            }
            p1.update(id, true);
            if (!isRefresh) {
                //处理浏览器后退按钮，
                p1.setHistory(id);
            }
        } catch (exp) {
            ch("fTabLabelActive", exp);
        }
        function setActive(tid, act){
            var tab = p1.exist(tid);
            var tabH = tab.t;
            var tabB = tab.b;
            var id = tabH.getAttribute("tabid");
            if (act) {
                if (id == gConst.home) {
                    tabH.className = "on";
                } else {
                    tabH.className = "on";
                }
                tabB.style.display = "block";
            } else {
                if (id == gConst.home) {
                    tabH.className = "";
                } else {
                    tabH.className = "";
                }
                tabB.style.display = "none";
            }
        }
    },
    title: function(id, title,mid){
        var tab = this.exist(id);
        if (!tab) {
            //ch("Tab Title Error", null);
            return;
        }
		var newmid = id.substr(8);
		//var tabId = tab.b.id.substr(14);
		/*
if (newmid != mid) {
		$("tab_b_" + id).setAttribute("id","tab_b_readMail"+mid);
		$("tab_h_" + id).setAttribute("id","tab_h_readMail"+mid);
		$("tab_h_" + id).setAttribute("tabid","readMail"+mid);
		}
*/
        var txt = tab.t.childNodes[1].childNodes[0];
        if (title) {
            txt.innerHTML = title.encodeHTML();
            //tab.t.title = title.stripTags();
			tab.t.title = title.decodeHTML();
        } else {
            return txt.innerHTML.stripTags();
        }
    },
    /**
     * 关闭一个标签
     * @param {string} id 标签id
     */
    close: function(id){
        var tab = this.exist(id);
        if (tab) {
            var a = tab.t.getElementsByTagName('a');
            if (a.length) {
                a[0].onclick("close");
            }
        }
    },
	/**
     * 关闭所有标签
     */
    closeAll: function(){
		var p = this;
        var tabs = this.tabs;
        if (tabs) {
            Util.eachObj(tabs,function(k, v){
                if(k!=gConst.home){
					p.close(k);
				}
            });
        } else {
            ch("closeAll Error", null);
        }
    },
    closeAllForce: function(){
        var p = this;
        var tabs = this.tabs;
        if (tabs) {
            Util.eachObj(tabs,function(k, v){
                if(k!=gConst.home){
                    GE.tab.del(k)
                }
            });
        } else {
            ch("closeAll Error", null);
        }
    },
    /**
     * 替换一个标签
     * @param {string} oldid 旧标签id
     * @param {string} newid 新标签id
     */
    replace: function(oldId, newId){
        var tab = this.exist(oldId) && this.exist(newId);
        if (!tab) {
            ch("Tab Replace Error", null);
            return;
        }
        this.del(oldId);
        this.active(newId);
    },
    //        重新计算每个标签页的宽度
    size: function(){
        var maxLiWidth=126;
        var minLiWidth=0;
        var minLiContent=50;
        var liPadding=44;
        var maxUlWidth=jQuery('#header').width()-214;
        if(jQuery('#divTabls li div').first().find('a').length==0){
            jQuery('#divTabls li div').first().append('<a title="关闭" class="close" style="visibility: hidden;" href="javascript:fGoto()"></a>')
            jQuery('#divTabls li p').first().css('text-align','center');
        }

        jQuery('#divTabls').width(maxUlWidth)
        var liWidth=Math.floor(maxUlWidth/(GE.tab.count)) - 1;
        if(liWidth>maxLiWidth){
            liWidth=maxLiWidth;
        }

        jQuery('#divTabls li p').width(liWidth-liPadding)
        var totalLiWidth = 0;
        jQuery('#divTabls li').each(function(){
            totalLiWidth=jQuery(this).outerWidth(true)+totalLiWidth
        })
        jQuery('#divTabls').width(totalLiWidth>maxUlWidth?maxUlWidth:totalLiWidth)
    },
    update: function(id, flag){
        var i, l = this.history.length;
        var t, a = [];
        for (i = 0; i < l; i++) {
            t = this.history[i];
            if (t != id) {
                a[a.length] = t;
            }
        }
        if (flag) {
            a[a.length] = id;
        }
        this.history = a;
    },
    //浏览器后退按钮处理方法 date:2008-07-24
    setHistory: function(id){
        $("ifrmHistory").src = gConst.historyUrl +"?" + id;
    },
    getHistory: function(id){
        id = this.getSafeTableId(id);
        if (id == this.curid) {
            return;
        }
        if (this.history.length > 1) {
            id = this.history[this.history.length - 2];
        } else {
            id = gConst.home;
        }
        var o = id;
        if (id.indexOf('_') > -1) {
            o = id.substring(0, o.indexOf('_'));
        }
        if (id) {
            this.active(id, true);
        }
    },
    getSafeTableId:function(id){
        if(typeof(id) == "string"){
            return id.trim();
        }else{
            return "";
        }
    },
    clearDomEvent:function(){
          var clearElementProps = [
              'data',
              'onmouseover',
              'onmouseout',
              'onmousedown',
              'onmouseup',
              'ondblclick',
              'onclick',
              'onselectstart',
              'oncontextmenu'
          ];

          window.attachEvent("onunload", function() {
              var el;
              for(var d = document.all.length;d--;){
                  el = document.all[d];
                  for(var c = clearElementProps.length;c--;){
                      el[clearElementProps[c]] = null;
                  }
              }
          });		
    }
};
