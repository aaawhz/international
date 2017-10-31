function Fax(){
    this.name = gConst.fax;
    this.config = {
        sendfax: {
            text: Lang.Mail.tb_FaxSend,
            url: "/MFaxSend.aspx"
        },
        faxinbox: {
            text: Lang.Mail.tb_FaxReceive,
            url: "/MFaxReceive.aspx"
        },
        faxsent: {
            text: Lang.Mail.tb_FaxSendlist,
            url: "/MFaxSendList.aspx"
        },
        faxjunk: {
            text: Lang.Mail.tb_FaxReclist,
            url: "/MFaxRemoveList.aspx"
        }
    };
}
Fax.prototype = { 
	initialize:function() {
		GMC.initialize(this.name, this);
	},
	getHtml:function() {
		return '<div id="' + gConst.mainToolbar + this.name + '"></div>' + GMC.getHtml(this.name, this.url);
	},
	init:function() {
		var p1 = this;
		p1.setDivHeight();
	},
	getToolbar:function() {
		var p1 = this;
		var o = p1.name;
		var conf = p1.config;
		var ak = [];
		ak[ak.length] = {
			name : "sendfax",
			text : conf["sendfax"].text,
			clickEvent : function(obj) {
				p1.optFax(obj.name);
				GC.ossHit(9001);
			},
			className : "faxCompose",
			hasDrop : false
		};
		ak[ak.length] = {
			name : "faxinbox",
			text : conf["faxinbox"].text,
			clickEvent : function(obj) {
				p1.optFax(obj.name);
				GC.ossHit(9002);
			},
			className : "faxInbox",
			hasDrop : false
		};
		ak[ak.length] = {
			name : "faxsent",
			text : conf["faxsent"].text,
			clickEvent : function(obj) {
				p1.optFax(obj.name);
				GC.ossHit(9003);
			},
			className : "faxSent",
			hasDrop : false
		};
		ak[ak.length] = {
			name : "faxjunk",
			text : conf["faxjunk"].text,
			clickEvent : function(obj) {
				p1.optFax(obj.name);
				GC.ossHit(9004);
			},
			className : "faxSpam",
			hasDrop : false
		};
		
		var ag = El.createElement("div","faxSearch","search");
		var html = [];
		html[html.length] = '<input class="text" maxlength="50" type="text" value="'+Lang.Mail.fax_InputFaxNumber+'" id="faxSearchInput" onfocus="MM[\''+ o+ '\'].optSearch(this,\'focus\')" onblur="MM[\''+ o+ '\'].optSearch(this,\'blur\')" onkeydown="MM[\''+ o+ '\'].optSearch(this,\'onkeydown\')" onkeyup="MM[\''+ o+ '\'].optSearch(this,\'onkeyup\')"/>';
		html[html.length] = '<a class="btn" href="javascript:fGoto();" onclick="MM[\''+ o+ '\'].optSearch(this,\'search\');"><b class="r1"></b><span class="rContent"><span>'+Lang.Mail.fax_Search+'</span></span><b class="r1"></b></a>';
		ag.innerHTML = html.join("");
		ag.isNode = true;
		ak[ak.length] = ag;
		return ak;
	},
	getToolbarMenu:function(af) {
		return [];
	},
	resize:function() {
		this.setDivHeight();
	
	},
	exit:function() {
        GMC.gcMem(this.name);
		return true;
	},
	setDivHeight:function() {
		GMC.setDivHeight(this.name);
		var win = GMC.getFrameWin(this.name);
		var h = El.docHeight(win);
		//var w = El.docWidth(win);
		//var lw = w - 190;
		//var obj = win.document.getElementById("writeWrapper");
		//var obj1 = win.document.getElementById("writeSidebar");
		//if(obj){
		//	obj.style.width = lw+"px;"
		//	obj1.style.left = lw+"px";
		//}
		//try {
		//	win.document.body.style.height = h + "px";
		//} catch (e) {}
	},
	getUrl:function(m) {
		var p1 = this;
		var conf = p1.config;
		var url = conf[m].url || "/MFaxSend.aspx";
		var name = conf[m].text;
		url = GC.getCookie("FaxServer") + url + "?sid=" + GC.getSid();
		return {
			url : url,
			name : name
		};
	},
	setUrl:function(url) {
		return GMC.setUrl(this.name, url);
	},
	optFax:function(o) {
		var un = this.getUrl(o);
		CC.updateTitleNew(un.name, un.url);
		this.setUrl(un.url);
		// 更新地址；
	},
	// 搜索处理
	optSearch:function(o, e) {
		var p1 = this;
		function doSearch() {
			var v = document.getElementById("faxSearchInput").value;
			if (v == "" || v == Lang.Mail.fax_InputFaxNumber) {
				CC.alert(Lang.Mail.Please+Lang.Mail.fax_InputFaxNumber, function() {
				}, Lang.Mail.sys_SystemInfo);
				return;
			}
			var url = GC.getCookie("FaxServer") + "/MFaxQueryList.aspx?key=" + v;
			CC.updateTitleNew(Lang.Mail.fax_SearchList, url);
			p1.setUrl(url);
		}
		switch (e) {
			case "blur" :
				if (o.value == ""){
					o.value = Lang.Mail.fax_InputFaxNumber;
				}
				break;
			case "focus" :
				if (o.value == Lang.Mail.fax_InputFaxNumber){
					o.value = "";
				}	
				break;
			case "click" :
				if (o.value == Lang.Mail.fax_InputFaxNumber){
					o.value = "";
				}
				break;
			case "onkeyup" :
				var ev = EV.getEvent();
				if (ev.keyCode == 13) {
					doSearch();
					GC.fireEvent(o, "blur");
				}
				break;
			case "search" :
				doSearch();
				break;
			default :
				break;
		}
	}
};
