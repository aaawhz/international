function Mms(){
	this.name = gConst.mms;
    this.config = {
        sendMms: {
            text: Lang.Mail.tb_MMSSend,
            url: "/CMail/WebMMS/SendMMS/Send.aspx"
        },
        Mmsfolder: {
            text: Lang.Mail.tb_MMSFolder,
            url: "/CMail/WebMMS/MMSStore/FolderList.aspx"
        },
        Mmssign: {
            text: Lang.Mail.tb_MMSSign,
            url: "/CMail/WebMMS/MMSSign/SignList.aspx"
        },
        Mmstitle: {
            text: Lang.Mail.tb_MMSTitle,
            url: "/CMail/WebMMS/MMSTitle/TitleList.aspx"
        },
        Mmsrecord: {
            text: Lang.Mail.tb_MMSRecord,
            url: "/CMail/WebMMS/MMSHistory/HistoryList.aspx"
        }
    };
	this.configSSO = {
		"700": "sendMms",
        "701": "sendMms",
        "702": "Mmsfolder",
        "703": "Mmssign",
        "704": "Mmstitle",
        "705": "Mmsrecord"
	};
}
Mms.prototype = {
    initialize: function(){
        GMC.initialize(this.name, this);
    },
    getHtml: function(){
        return '<div id="' + gConst.mainToolbar + this.name + '"></div>' + GMC.getHtml(this.name, this.url);
    },
    init: function(){
        var p1 = this;
        //p1.setDivHeight();
    },
    getToolbar: function(o){
        var p1 = this;
        var conf = p1.config;
        var ak = [];
        ak[ak.length] = {
            name: "sendMms",
            text: conf["sendMms"].text,
            clickEvent: function(obj){
                p1.optMms(obj);
                GC.ossHit(8001);
            },
            className: "MMSCompose",
            hasMenu: false
        };
        ak[ak.length] = {
            name: "Mmsfolder",
            text: conf["Mmsfolder"].text,
            clickEvent: function(obj){
                p1.optMms(obj);
                GC.ossHit(8002);
            },
            className: "MMSFolder",
            hasMenu: false
        };
        ak[ak.length] = {
            name: "Mmssign",
            text: conf["Mmssign"].text,
            clickEvent: function(obj){
                p1.optMms(obj);
                GC.ossHit(8003);
            },
            className: "MMSSignature",
            hasMenu: false
        };
        ak[ak.length] = {
            name: "Mmstitle",
            text: conf["Mmstitle"].text,
            clickEvent: function(obj){
                p1.optMms(obj);
                GC.ossHit(8004);
            },
            className: "MMSTitle",
            hasMenu: false
        };
        ak[ak.length] = {
            name: "Mmsrecord",
            text: conf["Mmsrecord"].text,
            clickEvent: function(obj){
                p1.optMms(obj);
                GC.ossHit(8005);
            },
            className: "MMSSent",
            hasMenu: false
        };
        return ak;
    },
    getToolbarMenu: function(af){
        var ak = [];
        return ak;
    },
    resize: function(){
        this.setDivHeight();
    },
    exit: function(){
        GMC.gcMem(this.name);
        return true;
    },
    setDivHeight: function(){
        GMC.setDivHeight(this.name);
    },
    getUrl: function(m){
        m = m || "sendMms";
        var p1 = this;
        var conf = p1.config;
        var confSSO = p1.configSSO;
        var url = "";
        var name = "";
        var n = confSSO[m];
        if (n) {
            url = conf[n].url;
            name = conf[n].text;
        } else {
            url = conf[m].url;
            name = conf[m].text;
        }
        url = url || "/CMail/WebMMS/SendMMS/Send.aspx";
        url = GC.getCookie("MMSServer") + "/" + url + "?sid=" + GC.getSid();
        return {
            url: url,
            name: name
        };
    },
    setUrl: function(url){
        return GMC.setUrl(this.name, url);
    },
    optMms: function(o){
        var un = this.getUrl(o.name);
        CC.updateTitleNew(un.name, un.url);
        this.setUrl(un.url);
    }
};

