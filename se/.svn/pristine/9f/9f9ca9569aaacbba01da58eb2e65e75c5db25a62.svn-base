function Sms(){
    this.name = gConst.sms;
	this.config = {
        sendsms: {
            text: Lang.Mail.tb_SendSMS,
            url: "/CMail/WebSMS/Send/SendSms.aspx"
        },
        smsrecord: {
            text: Lang.Mail.tb_SMSRecord,
            url: "/CMail/WebSMS/Record/SendedList.aspx"
        },
        smssign: {
            text: Lang.Mail.tb_SMSSign,
            url: "/CMail/WebSMS/SMSSign/SignList.aspx"
        },
        smstime: {
            text: Lang.Mail.tb_SMSTime,
            url: "/CMail/WebSMS/Record/SetTimeList.aspx"
        }
    };
	this.configSSO = {
		"600": "sendsms",
        "601": "sendsms",
        "602": "smsrecord",
        "603": "smssign",
        "604": "smstime"
	};
}
Sms.prototype = {
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
            name: "sendsms",
            text: conf["sendsms"].text,
            clickEvent: function(obj){
                p1.optSms(obj);
                GC.ossHit(7001);
            },
            className: "SMSCompose",
            hasMenu: false
        };
        ak[ak.length] = {
            name: "smssign",
            text: conf["smssign"].text,
            clickEvent: function(obj){
                p1.optSms(obj);
                GC.ossHit(7002);
            },
            className: "SMSSignature",
            hasMenu: false
        };
        ak[ak.length] = {
            name: "smstime",
            text: conf["smstime"].text,
            clickEvent: function(o){
                p1.optSms(o);
                GC.ossHit(7003);
            },
            className: "SMSSetTime",
            hasMenu: false
        };
        ak[ak.length] = {
            name: "smsrecord",
            text: conf["smsrecord"].text,
            clickEvent: function(o){
                p1.optSms(o);
                GC.ossHit(7004);
            },
            className: "SMSSent",
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
        m = m || "sendsms";
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
        url = url || "/CMail/WebSMS/Send/SendSms.aspx";
        url = GC.getCookie("SMSServer") + "/" + url + "?sid=" + GC.getSid();
        return {
            url: url,
            name: name
        };
    },
    setUrl: function(url){
        return GMC.setUrl(this.name, url);
    },
    optSms: function(o){
        var un = this.getUrl(o.name);
        CC.updateTitleNew(un.name, un.url);
        this.setUrl(un.url);
    }
};


