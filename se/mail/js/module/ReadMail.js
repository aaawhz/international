function ReadMail() {
    this.mid = "";
    this.omid = "";
    this.fid = 0;
    this.menuId = "MAIL";
    this.mailContent = "";
}
ReadMail.fMenus = {};

//新建按钮需要在域管理 增加个权限
ReadMail.menuData = {
    'MAIL_INBOX_PASSAUDIT': {
        sort: -1
    },
    'MAIL_INBOX_NOTPASSAUDIT': {
        sort: 0
    },
    "MAIL_READ_REPLY": {sort: 1},
    "REPLY": {
        "MAIL_READ_REPLYATTACH": {sort: 1},
        "MAIL_READ_REPLYNOATTACH": {sort: 2}
    },
    "MAIL_READ_REPLYALL": {sort: 2},
    "REPLYALL": {
        "MAIL_READ_REPLYALLATTACH": {sort: 1},
        "MAIL_READ_REPLYALLNOATTACH": {sort: 2}
    },
    "MAIL_WRITE_RESEND": {sort: 3},
    "MAIL_INBOX_FORWARD": {sort: 4},
    "MAIL_INBOX_DELETE": {sort: 5},
    "MAIL_INBOX_REALDELETE": {sort: 6},
    'MAIL_INBOX_MARK': {
        'MAIL_INBOX_MARK_URGENT': {
            sort: 3
        },
        'MAIL_INBOX_MARK_COMMON': {
            sort: 4
        },
        'MAIL_INBOX_MARK_TOP': {
            sort: 5
        },
        'MAIL_INBOX_MARK_NOTOP': {
            sort: 6
        }
    },
    "MAIL_INBOX_MOVE": {sort: 8},
    "MAIL_INBOX_INFORM": {sort: 9},
    "MORE": {
        "MAIL_READ_PRINT": {sort: 1},
        "MAIL_READ_VIEW": {sort: 2},
        "MAIL_READ_DOWNLOAD": {sort: 3}
    }
};
ReadMail.prototype = {
    initialize: function () {
        //GMC.initialize(gConst.readMail, this);
        var aw = MM[gConst.readMail];
        aw.func = gConst.func.readMail;
        aw.url = gConst.apiPostPath;
        aw.reqtype = "api";
        aw.msg = "";
        aw.needRequest = true;
        aw.from = '';
        aw.menuId = this.menuId;
        aw.stateFlagArr = Lang.Mail.list_MailType.split(",");
        aw.sessionMail = [];
        aw.attachImgList = [];
        var i, t;
        for (i in this) {
            t = this[i];
            if (typeof(t) == "function") {
                aw[i] = t;
            }
        }

        //初始化读邮件所需要使用到的有权限的菜单
        var menus = CC.getMailMenu(gConst.menu.readmail);
//        if (menus) {
//            for (var k in menus) {
//                ReadMail.fMenus[menus[k].name] = menus[k];
//            }
//        }
//
//        this.getMenuHash(menus, ReadMail.fMenus);
//        menus = CC.getMailMenu(gConst.menu.inbox);
//        if (menus) {
//            for (var k in menus) {
//                ReadMail.fMenus[menus[k].name] = menus[k];
//            }
//        }
//        this.getMenuHash(menus, ReadMail.fMenus);
//        menus = CC.getMailMenu(gConst.menu.compose);
//        if (menus) {
//            for (var k in menus) {
//                ReadMail.fMenus[menus[k].name] = menus[k];
//            }
//        }
        this.getMenuHash(menus, ReadMail.fMenus);

        menus = null;
    },
    /*
     * 将树型目录转换为平行hash
     */
    getMenuHash: function (data, hash) {
        var l = data.length;
        for (var i = 0; i < l; i++) {
//            if (data[i].children.length > 0) {
//                this.getMenuHash(data[i].children, hash);
//            }
            hash[data[i].name] = data[i];
        }
    },
    /***
     * 显示联系人
     * @param {Object} mid
     * @param {Object} type cc抄送 to收件人
     * @param {Object} showAll -1返回string 0隐藏联系人 1显示联系人
     */
    showMore: function (mid, type, showAll, doc) {
        var o = this.name;
        var showNum = 6;
        var objs = "";
        var to = this.to;
        var cc = this.cc;
        if (mid.omid) {
            mid = mid.omid;
            to = this.sessionMail[mid].to;
            cc = this.sessionMail[mid].cc;
        }
        switch (type) {
            case 'to':
                objs = to;
                break;
            case "cc":
                objs = cc;
                break;
            case "bcc":
                objs = this.bcc;
                break;
        }
        function getEmail(mail) {
            if (mail.length > 120) {
                mail = mail.substring(0, 120) + "...";
            }
            return mail;
        }


        var emails = objs.split(',');
        var html = '';
        var t = [];
        if (emails.length > showNum) {
            if (showAll && showAll > 0) {
                for (var i = 0; i < emails.length; i++) {
                    t.push("<span style=\"display:inline-block\">" + getEmail(emails[i]) + "</span>");
                }
                html = t.join(',') + '<a href="javascript:;" onclick="parent.MM[\'{0}\'].showMore(\'{1}\',\'{2}\',\'{3}\',document);">[↑\'{4}\']</a>'.format(o, mid, type, 0, Lang.Mail.hideMsg);
            } else {
                var t = [];
                for (var i = 0; i < showNum; i++) {

                    t.push("<span style=\"display:inline-block\">" + getEmail(emails[i]) + "</span>");
                }
                html = t.join(',') + '<a href="javascript:;" onclick="parent.MM[\'{0}\'].showMore(\'{1}\',\'{2}\',\'{3}\',document);">[↓{5}{4}{6}]</a>'.format(o, mid, type, 1, emails.length - showNum, Lang.Mail.hy, Lang.Mail.gContact);
            }
        } else {
            for (var j = 0; j < emails.length; j++) {
                t.push("<span style=\"display:inline-block\" title='" + emails[j] + "'>" + getEmail(emails[j]) + "</span>");
            }
            html = t.join(',');
        }
        if (showAll < 0) {
            return html.replace(/&apos;/g, '&#39');
        } else {
            doc.getElementById(mid + type).innerHTML = html.replace(/&apos;/g, '&#39');
        }
    },
    /***
     * HTML标签构造
     */
    getHtml: function (data) {
        var p = this;
        var o = p.name;
        data = data || CM[o]["var"];
        var mid = data.omid;
        var sessionMails = data.sessionMails || [p.mi];
        var date = Util.formatDate(new Date(data.sendDate * 1000));
        var from = CC.getMailText(data.account);
        p.data = data;
        p.mid = mid;
        p.from = from;
        p.sessionMails = sessionMails;
        p.date = date;
        if (data.flag.memoFlag) {
            p.remark = data.flag.memoFlag;
        }

        if (CC.isSessionModeReadMail(p.fid) && sessionMails.length > 1) {
            //if(true){
            return '<div id="' + gConst.mainToolbar + o + '" class="mt_5"></div>' + "<iframe id=\"{0}\" name=\"{0}\" frameborder=\"0\" src=\"{1}?sid={2}&mid={3}&type=2&rnd={4}\" style=\"width:100%;height:100%;\" scrolling=\"auto\"></iframe>".format(gConst.ifrmReadmail + o, gConst.readMailSessionUrl, gMain.sid, mid, GC.gRnd());
        } else {
            //return p.getReadMailHtml(data);
            return '<div id="' + gConst.mainToolbar + o + '"  class="mt_5"></div>' + "<iframe id=\"{0}\" name=\"{0}\" frameborder=\"0\" src=\"{1}?sid={2}&mid={3}&type=1&rnd={4}\" style=\"width:100%;height:100%;\" scrolling=\"auto\"></iframe>".format(gConst.ifrmReadmail + o, gMain.webPath + '/static/se/mail/readmail.htm', gMain.sid, mid, GC.gRnd());
        }
    },
    init: function () {
        var p = this;
        var o = this.name;
        var data = CM[this.name]["var"];
        var next = data.next;
        var prev = data.prev;
        this.updatePrevNextStatus(prev, next);
        //this.initEmailContact();
        this.initSMS();
        if (typeof(MM[this.name].closeTab) == "function")
            MM[this.name].closeTab();
        //可能是别名发信，把收信人传给回执方法
        CC.sendMDN(data.requestReadReceipt, data.readReceipt, data.to);

        //标签邮件
        CC.isLabelMail() && (function ($) {
            $("#ifrmReadmail_Content_" + GE.tab.curid).load(function (win) {
                CC.labelBind(win.target.contentDocument || win.target.contentWindow.document);
            });
        })(jQuery);


        //等iframe加载完成，绑定事件
        var oFrame = document.getElementById("ifrmReadmail_Content_readMail"+p.mid);

        if (oFrame.attachEvent) {
            oFrame.attachEvent("onload", function(){

                //如果是[已发送]邮件夹，获取可召回数据
                if (p.fid == 3 && parent.GC.check('MAIL_MANAGER_BACK')) {
                    //得到可召回的数据
                    p.getRecallData();
                }
                p.initPreviewEvent();
            });
        }
        else {
            oFrame.onload = function(){

                //如果是[已发送]邮件夹，获取可召回数据
                if (p.fid == 3 && parent.GC.check('MAIL_MANAGER_BACK')) {
                    //得到可召回的数据
                    p.getRecallData();
                }

                p.initPreviewEvent();
            }
        }

    },
    initPreviewEvent: function(){
        var $ = jQuery,
            p = this;

        //读信页的元素，嵌套在iframe里面
        var oFrame = document.getElementById(parent.gConst.ifrmReadmail+"readMail" + p.mid).contentWindow.document;

        $(".li_preview", oFrame).mouseover(function(){
            $(this).find("div").attr("class","imgInfo_Bank imgInfo m_clearfix");
        }).mouseout(function(){
            $(this).find("div").removeClass("imgInfo_Bank");
        });
    },

    //得到按钮，在这里写功能
    getToolbar: function (o) {
        var p1 = this;
        var menu = [];//p1.menu;
        var name = p1.name;
        var headers = p1.data.headers || {};
        //var fid = p1.fid;
        var fid = p1.mi.fid;
        var denyForward = p1.data.denyForward || 0;
        var securityLevel = headers.securityLevel || 0;
        var sendWay = p1.data.sendWay || 0;
        var auditStatus = 0;
        var pData = p1.data;
        var auditS = 0;

        if (typeof pData != "undefined") {
            auditS = pData.auditStatus;

            if (!auditS && pData.headers) {
                auditS = pData.headers["auditStatus"];
            }
        }

        //如果是会话邮件， 不需要工具条
        if(pData.sessionMails && pData.sessionMails.length>0){
            return [];
        }

        if (p1.mi && p1.mi.auditStatus) {
            auditStatus = p1.mi.auditStatus;
        }

        if (!fid)
            fid = p1.fid;
        /*var menus = {};*/
        //ie下缓存菜单中dom节点有bug，暂时屏蔽
        if (menu && menu.length > 0) {
            return menu;
        }

        for (var k in ReadMail.menuData) {
            if (ReadMail.fMenus[k]) {
                //如果不是已发送发出的邮件阅读指令，则移除再次发送按钮
                if(!menu2AuthorityMap || (menu2AuthorityMap && !menu2AuthorityMap[k]) || (menu2AuthorityMap && menu2AuthorityMap[k] && GC.check(menu2AuthorityMap[k]))) {
                    if (fid != 3 && k == 'MAIL_WRITE_RESEND') {
                    }
                    else if ((fid == 4 || auditS == 3 || auditS == 4 || gMain.sessionMode == "1") && k == 'MAIL_INBOX_DELETE') {
                        //如果是已删除 、待审核[auditS:3 \ 4] 则不出现 删除 按钮
                    }
                    else if (denyForward == 1 && (k == 'MAIL_INBOX_FORWARD' || k == 'MAIL_INBOX_MOVE' || k == 'MAIL_INBOX_INFORM')) {
                        // 如果是禁止转发，则移除转发按钮
                    }
                    else if (k == "MAIL_READ_REPLY") {
                        if(denyForward){
                            menu.push(ReadMail.fMenus[k]);
                        }
                        else{
                            if (p1.data.attachments.length > 0) {
                                //continue;
                            }
                            else {
                                menu.push(ReadMail.fMenus[k]);
                            }
                        }
                    }
                    else if (k == "MAIL_READ_REPLYALL") {
                        if(denyForward){
                            menu.push(ReadMail.fMenus[k]);
                        }else{
                            if (p1.data.attachments.length > 0) {
                                //continue;
                            }
                            else {
                                menu.push(ReadMail.fMenus[k]);
                            }
                        }
                    }
                    else if( gMain.sessionMode == "1" && k == "MAIL_INBOX_REALDELETE"){

                    }
                    else if (( (auditS == 3 || auditS == 4) || gMain.sessionMode == "1" ) && k == 'MAIL_INBOX_MOVE') {
                        //如果是待审核，或者是会话模式下， 则不出现移动到
                    }
                    else {
                        if (1 < fid && fid < 6 && k == 'MAIL_INBOX_INFORM') {
                        }
                        else if (fid != 4 && k == "MAIL_INBOX_REALDELETE") {

                        }
                        else {
                            menu.push(ReadMail.fMenus[k]);
                        }
                    }
                }

            }
            //如果不是转发， 不是加密邮件， 不是会话模式， 才有“更多”
            else if (k == 'MORE' && denyForward != 1 && sendWay == 0 && securityLevel == 0 && !CC.isSessionMode()) {
                //if (GC.check('MAIL_READ_VIEW') || GC.check('MAIL_READ_PRINT')) {
                var virualNode = {};
                virualNode.id = '-5';
                virualNode.attrs = 'getsub=true';
                virualNode.name = 'MAIL_READ_MORE';
                virualNode.text = Lang.Mail.more;
                virualNode.url = '';
                virualNode.isShow = true;
                virualNode.urlType = 2;
                virualNode.sort = 8;
                virualNode.children = [];
                menu.push(virualNode);
                //}
            }
            else if (k == 'REPLY' && p1.data.attachments.length > 0 && !denyForward) {
                //if (GC.check('MAIL_READ_REPLYATTACH') || GC.check('MAIL_READ_REPLYNOATTACH')) {
                var virualNode = {};
                virualNode.id = '-6';
                virualNode.attrs = 'getsub=true';
                virualNode.name = 'MAIL_READ_REPLY';
                virualNode.text = Lang.Mail.tb_Reply;
                virualNode.url = '';
                virualNode.isShow = true;
                virualNode.urlType = 2;
                virualNode.sort = 1;
                virualNode.children = [];
                menu.push(virualNode);
                //}
            }
            else if (k == 'REPLYALL' && p1.data.attachments.length > 0 && !denyForward) {
                //if (GC.check('MAIL_READ_REPLYALLNOATTACH') || GC.check('MAIL_READ_REPLYALLATTACH')) {
                var virualNode = {};
                virualNode.id = '-6';
                virualNode.attrs = 'getsub=true';
                virualNode.name = 'MAIL_READ_REPLYALL';
                virualNode.text = Lang.Mail.tb_ReplyAll;
                virualNode.url = '';
                virualNode.isShow = true;
                virualNode.urlType = 2;
                virualNode.sort = 1;
                virualNode.children = [];
                menu.push(virualNode);
                //}
            }
            //读信子页面 只有待审核才增加“审核通过”和“审核不通过按钮”
            else if (k == 'MAIL_INBOX_PASSAUDIT' && (auditS == 3 || auditS == 4)) {
                if (CC.isAudit() && fid == '14') {
                    var virualNode = {};
                    virualNode.id = '-7';
                    //virualNode.attrs = 'getsub=true';
                    virualNode.name = 'MAIL_INBOX_PASSAUDIT';
                    virualNode.text = Lang.Mail.Write.auditPass;
                    virualNode.url = 'menu';
                    virualNode.isShow = true;
                    virualNode.urlType = 2;
                    virualNode.sort = 1;
                    virualNode.children = [];
                    menu.push(virualNode);
                }
            }
            else if (k == 'MAIL_INBOX_NOTPASSAUDIT' && (auditS == 3 || auditS == 4)) {
                if (CC.isAudit() && fid == '14') {
                    var virualNode = {};
                    virualNode.id = '-8';
                    //virualNode.attrs = 'getsub=false';
                    virualNode.name = 'MAIL_INBOX_NOTPASSAUDIT';
                    virualNode.text = Lang.Mail.Write.auditNotPass;
                    virualNode.url = 'menu';
                    virualNode.isShow = true;
                    virualNode.urlType = 2;
                    virualNode.sort = 2;
                    virualNode.children = [];
                    menu.push(virualNode);
                }
            }
        }


        var mid = p1.mid;
        var divPage = El.createElement("div", "div_pages_" + mid, "pager");
        var data = CM[name]["var"];

        divPage.isNode = true;
        divPage.isShow = true;
        menu.push(divPage);
        p1.menu = menu;
        return menu;
    },
    getToolbarMenu: function (af, cm) {
        var p1 = this;
        var ak = [];
        cm = cm || [];
        var i = 0;
        var folders = "";
        switch (af) {
            case "MOVE":
                folders = CC.getFolders();
                p1.getAllFolder(ak, folders);
                break;
            case "MARK": //得到二级菜单对象
                ak = p1.getAllChildren('MAIL_INBOX_MARK');

                //gMain.sessionMode == "1" && this.fid == 1
                if ( CC.isSessionMode() ) {
                    for (var i = 0; i < ak.length; i++) {
                        if (ak[i].name == "MAIL_INBOX_MARK_NOTOP" || ak[i].name == "MAIL_INBOX_MARK_TOP") {
                            ak.splice(i, 2);
                        }
                    }
                }
                break;
            case "REPLY":
            case "REPLYALL":
            case 'MORE' :
                var menus = ReadMail.menuData[af];
                for (var k in menus) {
                    //if (GC.check(k)) {
                    if (ReadMail.fMenus[k]) {
                        ak.push(ReadMail.fMenus[k]);
                    }
                    //}
                }
                break;
        }
        return ak;
    },
    getAllChildren: function (key) {
        var ak = [], p1 = this;
        //通过 Folder.menuData 的mark 得到 它下面的子菜单
        var children = ReadMail.menuData[key];
        var name = p1.name;
        if (children) {
            for (var k in children) {
                if (ReadMail.fMenus[k]) {
                    //p1.fMenus[k] 从域管理平台设置项取得值
                    var mmenu = Object.extend({}, ReadMail.fMenus[k]);
                    if ((CC.isLabelMail() && key == "MARK" && k == "MAIL_INBOX_MARK_NOTOP") || ((name == 'sys' + gConst.folderEnum.monitor || name == 'sys' + gConst.folderEnum.audit) && key == 'FILTER' && k == 'MAIL_INBOX_FILTER_NOATTACHMENT')) {
                        mmenu.attrs = "sep=true";
                    }
                    ak.push(mmenu);
                }
            }
        }
        var comNodeAttr = {
            id: 0,
            url: 'menu',
            attrs: '',
            text: '',
            isShow: true,
            name: '',
            children: []
        };
        if (CC.isLabelMail() && key == 'MAIL_INBOX_MARK') {
            comNodeAttr.id = -201;
            comNodeAttr.text = Lang.Mail.label_MyLabel;
            comNodeAttr.name = 'MAIL_INBOX_MARK_LABEL';
            comNodeAttr.url = '';
            comNodeAttr.children = this.getVnode();
            var vNode3 = this.createVisualNode(comNodeAttr);
            ak.push(vNode3)
        }
        return ak;
    },
    /**
     * 创建虚拟节点
     * @param {Object} ao
     */
    createVisualNode: function (ao) {
        var newNode = new Object();
        for (var k in ao) {
            newNode[k] = ao[k];
        }
        return newNode;
    },
    //根据节点名，得到相应的节点并返回
    getVnode: function (nodeName) {
        var comNodeAttr = {
            id: 0,
            url: 'menu',
            attrs: '',
            text: '',
            isShow: true,
            name: '',
            children: []
        };

        var p1 = this;
        switch (nodeName) {
            default:
                var folders = CM.folderMain[gConst.dataName];
                var nodes = [];
                for (var i = 0, l = folders.length; i < l; i++) {
                    var fm = folders[i];
                    if (fm.type == 5) {
                        comNodeAttr.id = fm.fid;
                        comNodeAttr.text = fm.name;
                        comNodeAttr.name = 'MAIL_INBOX_MARK_LABEL';
                        comNodeAttr.pm = fm.fid;
                        comNodeAttr.attrs = ((i + 1 == l) ? "sep=true&" : "") + "className=" + gConst.labelColor[fm.folderColor];
                        comNodeAttr.children = [];
                        nodes.push(this.createVisualNode(comNodeAttr));
                    }
                }
                nodes.push(this.createVisualNode({
                    id: 0,
                    url: 'menu',
                    attrs: '',
                    text: Lang.Mail.label_NewLabel,
                    isShow: true,
                    name: 'MAIL_INBOX_MARK_ADD',
                    children: []
                }));
                nodes.push(this.createVisualNode({
                    id: 0,
                    url: function (o, mid, ao) {
                        CC.goFolderMain(function () {
                            MM["folderMain"].folderCallback();
                        });
                    },
                    attrs: '',
                    text: Lang.Mail.ManageLabel,
                    isShow: true,
                    name: 'MAIL_INBOX_MARK_MANAGER',
                    children: []
                }));
                return nodes;
        }
        var vNode = this.createVisualNode(comNodeAttr);
        return vNode;
    },
    /**
     * 增加邮件夹
     * @return
     */
    getAllFolder: function (ak, of, icon) {
        var p1 = this;
        var aw = null, hassub = false, text = "", isCurEnd = false;
        var icon1 = "", icon2 = "";
        for (var i = 0, l = of.length; i < l; i++) {
            aw = of[i];
            hassub = (aw.nodes && aw.nodes.length > 0);
            isCurEnd = (i == of.length - 1);
            icon1 = icon || "";
            icon2 = (aw.parentId == 0) ? "" : ((isCurEnd) ? "└ " : "├ ");
            text = icon1 + icon2 + aw.name;
            var n = aw.fid;
            if (n != p1.fid  && !(n === 2)) {
                ak.push({
                    name: "MAIL_INBOX_MOVE" + n,
                    text: text,
                    value: aw.name,
                    url: (function (m) {
                        return function (o, mid, ao) {
                            ao.pm = m;
                            ao.op = Lang.Mail.tb_Move;
                            p1.doMenu(o, "MOVE", ao);
                        };
                    })(n)
                });
            }

            if (hassub) {
                icon1 += (isCurEnd || aw.parentId == 0) ? "　" : "│ ";
                p1.getAllFolder(ak, aw.nodes, icon1);
            }
        }
    },

    resize: function () {
        this.setDivHeight();
    },
    exit: function () {
        try {
            var o = $(gConst.ifrmReadmail + this.name);
            if (o) {
                var win = o.contentWindow;
                if (win) {
                    El.gc(win.document);
                }
            }
            return true;
        }
        catch (e) {
            return true;
        }
    },
    setDivHeight: function () {
        var o = this.name;
        var gh = GMC.getMainHeight(o);
        var oHead = $("readHeader_" + o);
        if (oHead) {
            gh = gh - oHead.off;
        }
        El.height($(gConst.ifrmReadmail + o), gh);
    },
    checkStatus: function () {
        var p1 = this;
        var isAudited = false;
        var oFrame = document.getElementById("ifrmReadmail_Content_readMail" + p1.mid);
        var text = oFrame.contentWindow.document.getElementById("readMail_status").innerHTML;
        if (text == Lang.Mail.Write.hasPassed + "：") {
            isAudited = true;
            parent.CC.showMsg(Lang.Mail.Write.auditedStatus, true, false, "caution");
        }

        return isAudited;
    },

    /**
     * 邮件标记方法
     * @param {Array} mids 要标记的邮件mid
     * @param {String} type 属性值
     * @param {Number} value 设置的值
     */
    mark: function (mids, type, value, text) {
        var p1 = this;
        value = value - 0;
        var mdata = {
            func: gConst.func.updateMail,
            'data': {
                ids: mids,
                type: type,
                value: value
            }
        };
        mdata.msg = Lang.Mail.list_MarkMail;
        MM.mailRequest(mdata);
    },

    /***
     * 操作
     * @param {Object} cmd
     * @param {Object} m
     */
    doMenu: function (o, menuId, ao, mid) {
        var p1 = this;
        var id = CC.getCurLabId();
        ao = ao || {};
        mid = mid || p1.mid;
        o = o || gConst.readMail + mid;
        var fname = "";
        var from = p1.from;
        var thisDomain = parent.gMain.domain;
        var reDomain = eval("/" + thisDomain + "$/i");
        from = from.decodeHTML();
        var from_mail = parent.Email.getValue(from);
        var pm = ao.pm || 0;
        var data = "";
        if (menuId == "REPLYALLNOATTACH")
            menuId = "REPLYALL";
        else if (menuId == "REPLYNOATTACH")
            menuId = "REPLY";

        if (menuId == "INFORM") {
            if (from_mail.substr(from_mail.indexOf("@")+1).trim() == thisDomain) {
                //本域用户不允许加入黑名单
                parent.CC.showMsg(Lang.Mail.domainNoBlack, true, false, "caution");
                return;
            }
        }
        var lid = pm;
        var labels = CM[o][gConst.dataName].label;
        function markLabel(lid){
            var label = MM.getFolderObject(lid);
            if(label){
                var html = '<a href="javascript:void(0);" data-lid="' + label.fid + '" data-mid="' + data.mid + '" class="' + gConst.labelColor[label.folderColor] + ' tag_squ ml_5"><span>'+label.name+'</span><i></i></a>';
            }
            var iframe = jQuery("#ifrmReadmail_Content_" + GE.tab.curid)[0];
            var tag_div = jQuery(".tag_div",iframe.contentDocument || iframe.contentWindow.document);
            tag_div.append(html);
            labels.push(lid);
        }
        switch (menuId) {
            case "URGENT":
                p1.mark([mid], "priority", GE.priority.hight);
                break;
            case "COMMON":
                p1.mark([mid], "priority", GE.priority.common);
                break;
            case "TOP":
                if (([mid].length + GE.topNum) <= gConst.topNum) {
                    p1.mark([mid], "top", 1);
                }
                else {
                    CC.showMsg(Lang.Mail.folder_topNum_over.format(gConst.topNum), true, false, "option");
                }
                break;
            case "NOTOP":
                GE.topNum = 0;
                p1.mark([mid], "top", 0);
                break;
            case "LABEL":
                var flag = p1.isExists(labels,lid);
                !flag && MM[MM.getModuleByFid((p1.fid==0?1:p1.fid))].marklabel("add", [mid], lid,function(ao){
                    markLabel(lid);
                });
                break;
            case "ADD":
                MM['folderMain'].opt('addLabel',null,null,{from:p1.data.account.replace(/([\s\S]+<)([\s\S]+)>/, '$2'),mid:mid,o:MM.getModuleByFid((p1.fid==0?1:p1.fid)),call:function(lid){
                    markLabel(lid);
                }});
                break;
            case "REPLY":
            case "ONE":
                goCompose(gConst.func.reply, mid, Lang.Mail.tb_ReplyMail);
                break;
            case "REPLYALL":
                goCompose(gConst.func.replyAll, mid, Lang.Mail.tb_ReplyAll);
                break;
            case "REPLYATTACH":
                goCompose(gConst.func.reply, mid, Lang.Mail.tb_ReplyMail, 1);
                break;
            case "REPLYALLATTACH":
                goCompose(gConst.func.replyAll, mid, Lang.Mail.tb_ReplyAll, 1);
                break;
            case "FORWARD":
                goCompose(gConst.func.forward, mid, Lang.Mail.list_FwdMail);
                break;
            case "REFUSE":
            case "BLACKLIST":
                CC.setConfig('black', Email.getValue(from.decodeHTML()));
                break;
            case "FILTER":
                from = Email.getValue(from.decodeHTML());
                CC.setConfig('filter', {
                    name: from,
                    from: from
                });
                break;
            case "VIEW": //查看邮件原文
                p1.viewMailSource(mid);
                break;
            case "DELETE":
            case "DEL":
                p1.del();
                break;
            case 'PASSAUDIT':

                var isAudited = p1.checkStatus();
                if (!isAudited) {
                    p1.auditPass("", 1, Lang.Mail.Write.mailHasPass, true, true, p1.mid);
                }

                break;
            case 'NOTPASSAUDIT':
                var isAudited = p1.checkStatus();
                if (!isAudited) {
                    p1.auditPass("", 0, Lang.Mail.Write.mailHasNotPass, true, true, p1.mid)
                }
                break;
            case "DOWNLOAD"://下载原文
                p1.downloadsEmail(mid, this.sessionId);
                break;
            case "REALDELETE":
                p1.realDelete();
                break;
            case "RESEND":
                goCompose("mbox:editMessage", mid, Lang.Mail.list_EditMail);

                break;
            case "PRINT":
                p1.printMail(mid);
                break;
            case "MOVE":
                if (pm == 0 || pm == p1.fid) {
                    CC.alert(Lang.Mail.list_MailExistFolder, function () {
                        return false;
                    });
                }
                p1.move(pm, Lang.Mail.list_NowMoveMail, ao.value);
                break;
            case "INFORM":
                var d, sta, end;
                var m = {
                    mails: [
                        {}
                    ],
                    sessionMails: []
                };
                if (from) {
                    sta = from.indexOf('<');
                    end = from.indexOf('>');
                    if (sta > 0 && end > 0) {
                        m.mails[0].userName = from.substr(0, sta);
                        m.mails[0].email = from.substr(sta + 1, end - sta - 1);
                    }
                    else {
                        m.mails[0].userName = '';
                        m.mails[0].email = from;
                    }
                }
                m.mails[0].mid = p1.mid;
                m.callback = function () {
                    CC.exit();
                };
                m.moduleId = GE.currentFolderModule;
                /*
                 if(p1.sessionMails && p1.sessionMails.length>0){
                 for(var i=0, l=p1.sessionMails.length;i<l;i++){
                 d = {};
                 d.mid = p1.sessionMails[i].mid;
                 from = p1.sessionMails[i].from.decodeHTML();
                 if(from){
                 sta = from.indexOf('<');
                 end = from.indexOf('>');
                 if(sta>0 && end>0){
                 d.userName = from.substr(0, sta);
                 d.email = from.substr(sta+1, end-sta-1);
                 }
                 else{
                 d.userName = '';
                 d.email = from;
                 }
                 m.sessionMails.push(d);
                 }
                 }
                 }
                 if(this.sessionId)
                 m.sessionId=this.sessionId;
                 */
                CC.inform(m);
                break;
            default:
                break;
        }

        function goCompose(m, mailid, fname, isAttch) {
            var fd = [];
            var url = CC.getComposeUrl('&funcid=' + m + '&mid=' + mailid);
            if (isAttch)
                url = url + "&withAttachments=1";
            CC.goCompose(url, 'compose_' + mailid, fname);
        }

    },
    goCompose: function (m, mailid, fname, isAttch) {
        var fd = [];
        var url = CC.getComposeUrl('&funcid=' + m + '&mid=' + mailid);
        if (isAttch)
            url = url + "&withAttachments=1";
        CC.goCompose(url, 'compose_' + mailid, fname);
    },
    //在本阅读窗口打开指定的邮件
    openReadMail: function (type, mid, fid) {
        var p = this;
        var obj = {
            func: "mbox:getMessageInfo",
            data: {
                ids: [mid]
            },
            call: function (resp) {
                var mi = {
                    mid: mid
                };
                var oTemp = gConst.readMail + mid;
                var o = p.name;
                var readParam = {
                    "markRead": 1,
                    isSession: false,
                    fid: fid
                };
                //MM[o]=null;
                if (resp.code == "S_OK") {
                    var resData = resp["var"][0];
                    mi.subject = resp["var"][0].subject.encodeHTML();
                    mi.color = resp["var"][0].color;
                    mi.fid = resp["var"][0].fid;
                    mi.read = resp["var"][0].read;

                    readParam.sessionId = resp["var"][0].mailSession;
                    readParam.rcptFlag = resp["var"][0].flags;

                    if( typeof resData.secureEncrypt != 'undefined' && resData.secureEncrypt == 1 ){
                        readParam.isEncrypt = true;
                    }else if( resData.flags && resData.flags.safemail_crypt == 1.){
                        readParam.isEncrypt = true;
                    }else{
                        readParam.isEncrypt = false;
                    }


                    if( typeof mi.read != 'undefined' ){
                        readParam.unread = (mi.read == "1") ? true: false;
                    }else if( resData.flags && resData.flags.read == 1){
                        readParam.unread = true;
                    }else{
                        readParam.unread = false;
                    }


                    CC.goReadMail(mid, mi.subject, readParam, mi, function closeTitle() {
                        GE.tab.del(o);
                        LM.getAllFolders();
                    });
                }

            }
        };
        MM.mailRequestApi(obj);


    },
    getLang: function (sFromConfig, sChn) {
        if ((sFromConfig) && (typeof(sFromConfig) == "string")) {
            return sFromConfig;
        }
        return sChn;
    },
    /***
     * 打包下载
     */
    downloads: function () {
        var oTemp = gConst.readMail + this.mid;
        var data = CM[oTemp]["var"];
        var attachData = data.attachments;
        var attachName = (data.subject || Lang.Mail.list_noSubject);
        if (attachData) {
            CC.downloads(attachData, attachName, this.mid);
        }
    },
    /**
     * 下载邮件原文
     */
    downloadsEmail: function (mid, sessionId) {
        var downloadObj =
        {
            "formName": "downloadEamil",
            "url": gMain.rmSvr + "/RmWeb/mail?func=mbox:downloadMessages&sid=" + gMain.sid,
            "inputName": "downloadDate",
            "data": "<object><array name=\"ids\"><string>" + mid + "</string></array></object>",
            "iframeName": "downloadEmailIframe"
        };
        if (sessionId && gMain.sessionMode && gMain.sessionMode == 1) {
            downloadObj.data = "<object><array name=\"sessionIds\"><int>" + sessionId + "</int></array></object>"
        }
        this.ajaxForm(downloadObj);
    },
    /**
     * 使用form进行post请求，解决ajax无法处理二进制流的问题
     * @param {Object} 必填 包含以下参数
     *        @param {String} 可填 formName 表单名称
     *        @param {String} 必填 url
     *        @param {String} 必填 inputName
     *        @param {String} 必填 data 传送数据，为xml格式字符串
     *        @param {String} 必填 iframeName
     */
    ajaxForm: function (o) {
        var doc = document,
            body = doc.body,
            form = doc.createElement("form"),
            input = createInput(o.inputName, o.data);

        form.name = o.formName;
        form.method = "post";
        form.action = o.url;
        if (form.encoding) {
            form.setAttribute("encoding", "multipart/form-data");
        }
        form.setAttribute("enctype", "multipart/form-data");
        if (!document.getElementById(o.iframeName)) {
            body.appendChild(createIframe(o.iframeName));
        }
        form.target = o.iframeName;
        form.appendChild(input);
        body.appendChild(form);
        form.submit();
        body.removeChild(form);

        function createInput(name, value) {
            var input = document.createElement("input");
            input.value = value;
            input.name = name;
            input.type = "hidden";
            return input;
        }

        function createIframe(name) {
            var iframe;
            try {
                iframe = document.createElement('<iframe name="' + name + '"></iframe>');
            } catch (ex) {
                iframe = document.createElement("iframe");
                iframe.name = name;
            }
            iframe.id = name;
            iframe.style.display = "none";
            return iframe;
        }
    },
    move: function (m, msg, folderName) {
        var mid = this.mid;
        var o = GE.currentFolderModule;
        MM[o].move([mid], m, msg || Lang.Mail.list_NowMoveMail, [this.sessionId], Lang.Mail.movemail_success.format('"' + folderName + '"'));
        CC.exit();
    },
    auditPass: function (mid, type, msg, noConfirm, refrese, ReadMailmid) {
        var sessionId = null;
        if (!mid) {
            mid = mid || this.mid;
            sessionId = [this.sessionId];
        }
        mid = [mid];
        var o = GE.currentFolderModule;
        MM[o].auditPass(mid, type, msg, noConfirm, refrese, ReadMailmid);

    },
    del: function (mid) {
        var sessionId = null;
        if (!mid) {
            mid = this.mid;
            sessionId = [this.sessionId];
        }
        CC.confirm(Lang.Mail.rm_ConfirmDelMail, function () {
            var o = GE.currentFolderModule;
            MM[o].move([mid], GE.folder.del, Lang.Mail.list_NowDelMail, sessionId, Lang.Mail.movemail_success.format('"' + Lang.Mail.folder_4 + '"'));
            CC.exit();
        });
    },
    realDelete: function () {
        var p = this;
        var mid = this.mid;
        CC.confirm(Lang.Mail.rm_ConfirmRealDelMail, function () {
            var o = GE.currentFolderModule;
            MM[o].del([mid], '', true);
            CC.exit();
        });
    },
    /***
     * 打印邮件
     */
    printMail: function (mid) {
        mid = mid || this.mid;
        var otype = gConst.readMail + mid;
        var url = gConst.mailPrintUrl + "&mid=" + otype + "&t=print&" + Math.random();
        window.open(url);
    },
    viewMailSource: function (mid) {
        var url = "{0}?func={1}&sid={2}&mid={3}&part=0&mode=text".format(gConst.apiPostPath, gConst.func.viewSource, gMain.sid, mid);
        window.open(url, "MailSource", "width=500,height=400,top=100,left=100,location=no,resizable=yes,toolbar=no,menubar=no,scrollbars=yes");
    },
    /***
     * 打开新窗体
     */
    newOpen: function (mid) {
        mid = mid || this.mid;
        var otype = gConst.readMail + mid;
        var url = gConst.mailPrintUrl + "&mid=" + otype + "&t=open&" + Math.random();
        window.open(url);
    },
    //判断发件人是否在通讯录中
    initEmailContact: function (showFunc) {
        var p = this;
        var o = p.name;
        var mid = p.mid;
        var mail = p.sendUser;
        try {
            if (mail && mail.length > 1) {
                if (LMD.isComplete) {
                    if (!CC.isInAddr(mail)) {
                        showFunc();
                        return;
                    }
                }
                else {
                    CC.inAddr(mail, function (b) {
                        if (!b) {
                            showFunc();
                        }
                    });
                }
            }
        }
        catch (e) {

        }
    },
    //判断发件人是否在到达通知黑名单里面
    initSMS: function () {
        /*var p = this;
         var o = p.name;
         var mid = p.mid;
         var email = p.sendUser;
         var obj =  $("closesms_"+mid);
         //OpType=2,判断当前联系人是否已在用户黑名单中
         var surl = gMain.webApiServer + "/WebService/SmsNotifyService.aspx?OpType=2&Email=" + email;
         GC.getScript("saveContactScript" + Math.random(), surl, function(){
         if (ReturnInfos) {
         //retValue:  -1:参数错误,0:不在黑名单中,1:已经在黑名单中
         var retValue = ReturnInfos.retValue;
         if (retValue == "1") {
         El.hide(obj);
         } else {
         obj.style.display = "";
         }
         }
         }); */
    },
    //添加发件人到通讯录中
    addEmailContact: function (index, isSession) {
        var p1 = this;
        index = index || 0;
        var data = p1.sessionMails[index];
        var from = data.from;
        var name = Email.getName(from);
        var mail = Email.getValue(from);
        var mid = data.mid;
        if (mail) {
            var w = 600;
            var h = 362;
            var id = "adddetail";
            name = encodeURI(name);
            var u = "../addr/quickadd.do?op=addContactInFrom&sid=" + GC.sid + "&name=" + name + "&mail=" + mail + "&mid=" + mid;
            if (isSession) {
                u += "&index=" + index;
            }

            var ao = {
                id: id,
                title: Lang.Mail.Write.addContacter,
                type: 'div',
                url: u,
                width: w,
                height: h
            };
            CC.showHtml(ao);
        }
    },

    //批量添加（收件人或抄送人）到通讯录;自己不添加到通讯录,
    // emails 的格式如hai&nbsp;&lt;hai@se.com&gt;,adf&nbsp;&lt;adf@sa.com&gt;
    //可以同时将联系人复制到组;也可以新建分组，默认把新建的分组勾选
    addEmailContacts: function (emails, type) {
        var p = this;
        var addressMails = emails.decodeHTML().split(",");
        var data = p.sessionMails[0];
        var mid = data.mid;
        var len = addressMails.length;
        var u = "";
        var w = 380;
        var h = 244;
        var ao = null;
        if(!parent.GE._AddrCheckData){parent.GE._AddrCheckData={};}
        //单个联系人添加 （ 这里Name 和 email 是通过url传过去的）
        if (type == "ccType" || type == "toType" || type =="fromType") {

            var e = emails,
                name = "",
                mail = "",
                arrMail = addressMails,
                len = arrMail.length,
                cMail = "";

            for (var i = 0; i < len; i++) {
                var itemMail = arrMail[i];
                cMail = itemMail.substring(itemMail.indexOf("<") + 1, itemMail.indexOf(">"));

                //邮件不在通讯录中
                if (!LMD.userContancts[cMail]) {
                    name = itemMail.substring(0, itemMail.indexOf("<")).trim();
                    name=name.replace(/["']/g,"");
                    mail = cMail;
                    //parent.GE._AddrCheckData[itemMail] = true;
                }
            }

            u = gMain.webPath+"/webtransit.do?func=addr:quickAdd&op=addContactToCc&sid=" + GC.sid + "&name=" + encodeURI(name) + "&mail=" + mail + "&mid=" + mid + "&CCOrTo=" + type;

            ao = {
                id: "adddetail",
                title: Lang.Mail.Write.addContacter,
                type: 'div',
                url: u,
                width: 600,
                height: 362
            };

        } else {

            //批量添加batchContacts
            u = gMain.webPath+"/webtransit.do?func=addr:copyToGroup&op=batchContacts&ccTo=" + type + "&sid=" + GC.sid + "&mid=" + mid;

            ao = {
                id: "copyTo",
                title: Lang.Mail.addContact,
                type: 'div',
                url: u,
                height: h
            };

            //可以再通讯录里面获取地址栏的值
            gMain.addressMails = [];

            for (var i = 0; i < len; i++) {
                var item_mail = addressMails[i];
                cMail = item_mail.substring(item_mail.indexOf("<") + 1, item_mail.indexOf(">"));

                if (!(LMD.userContancts[cMail] || parent.GE._AddrCheckData[item_mail])) {
                    gMain.addressMails.push(item_mail);
                    parent.GE._AddrCheckData[item_mail] = true;
                }
            }
        }

        //链接到通讯录
        CC.showHtml(ao);
    },

    //判断收件人是否存在通讯录中,只要有收件人不再通讯录中，返回false,
    //to 格式如 hai&nbsp;&lt;hai@se.com&gt;,adf&nbsp;&lt;adf@sa.com&gt;
    ToExistInAddressList: function (to) {
        if(!parent.GE._AddrCheckData){parent.GE._AddrCheckData = {};}
        var addressee = to.decodeHTML().split(",");
        var len = addressee.length;
        var result = {};

        result.notInAddrCount = 0;
        result.isAllInAddr = true;

        if (len < 1) {
            return result;
        }

        //如果收件人只有一人，说明收件人就是本人。则不添加到通讯录。[gMain.userNumber -->  当前用户]

        if (len == 1) {
            var mail = addressee[0];
            mail = mail.substring(mail.indexOf('<') + 1, mail.indexOf('>'));
            if (mail == gMain.userNumber) {
                return result;
            }
        }


        for (var i = 0; i < len; i++) {
            var address = addressee[i];
            address = address.substring(address.indexOf('<') + 1, address.indexOf('>'));
            if (!(LMD.userContancts[address] || parent.GE._AddrCheckData[address])) {
                result.isAllInAddr = false;
                result.notInAddrCount++;
            }
        }
        return result;

    },
    //判断抄送人是否存在通讯录中,只要有收件人不再通讯录中，返回true,
    ////cc 格式如 hai&nbsp;&lt;hai@se.com&gt;,adf&nbsp;&lt;adf@sa.com&gt;
    CCExistInAddressList: function (cc) {
        if(!parent.GE._AddrCheckData){parent.GE._AddrCheckData = {};}
        var emails = cc.decodeHTML().split(",");
        var len = emails.length;
        var result = {};
        result.notInAddrCount = 0;
        result.isAllInAddr = true;
        for (var i = 0; i < len; i++) {
            var mail = emails[i];
            mail = mail.substring(mail.indexOf('<') + 1, mail.indexOf('>'));
            if (!(LMD.userContancts[mail] || parent.GE._AddrCheckData[mail])) {
                result.isAllInAddr = false;
                result.notInAddrCount++;
            }
        }
        return result;
    },
    closeSMS: function () {
        var p = this;
        var o = p.name;
        var mail = p.sendUser;
        var mid = p.mid;
        var obj = $("closesms_" + mid);
        //OpType=1,获取用户使用的是黑名单还是白名单
        var url = gMain.webApiServer + "/WebService/SmsNotifyService.aspx";
        var surl = url + "?OpType=1";
        GC.getScript("saveContactScript" + Math.random(), surl, function () {
            if (ReturnInfos) {
                var retValue = ReturnInfos.retValue;
                JoinBlackList(retValue);
            }
        });
        /*CC.requestWebApi(surl,function(){
         if (ReturnInfos) {
         var retValue = ReturnInfos.retValue;
         JoinBlackList(retValue);
         }
         });*/
        function JoinBlackList(retValue) {
            //retValue: 1:当前使用白名单，1:当前使用黑名单;
            var msg = "";
            //您目前启用的是邮件到达通知白名单过滤，您确认启用黑名单来过滤邮件达到通知？
            if (retValue == 1) {
                msg = Lang.Mail.readMail_alert_msg2;
            }
            else {
                //您确认屏蔽该联系人发送邮件的到达通知？屏蔽后该联系人发送的邮件将不再通知到您的手机。
                msg = Lang.Mail.readMail_alert_msg1;
            }
            CC.confirm(msg, function () {
                //OpType=3,添加发件人到黑名单中
                var curl = url + "?OpType=3&EMail=" + mail;
                GC.getScript("saveContactScript" + Math.random(), curl, function () {
                    if (ReturnInfos) {
                        //retValue: -2:已在黑名单中,0:加入黑名单失败，1:加入黑名单成功;
                        var retValue = ReturnInfos.retValue;
                        if (retValue == "1") {
                            El.hide(obj);
                            CC.alert(ReturnInfos.retMsg);
                        }
                        else {
                            CC.alert(ReturnInfos.retMsg);
                        }
                    }
                });
            });
        }
    },
    loadData: function (mid, subject, parm) {
        var p1 = this;
        var o = p1.name;
        var func = gConst.func.readMail;
        var callBack = function (au) {
            var oTemp = gConst.readMail + mid;
            CM[oTemp] = au;
            MM[oTemp] = p1;

            data = au["var"];
            var mi = {
                subject: data.subject,
                sendDate: data.sendDate,
                from: data.account,
                flags: data.flag,
                to: data.to,
                mid: data.omid,
                fid: data.fid,
                size: data.size

            };
            MM[oTemp].mi = mi;
            MM[oTemp].name = oTemp;
            var next = data.next;
            var prev = data.prev;

            var html = p1.getHtml(data);
            //$(gConst.mainBody + o).innerHTML = "";
            $(gConst.mainBody + o).innerHTML = html;
            $(gConst.mainBody + o).id = gConst.mainBody + oTemp;
            //更新工具条
            var toolbar = new Toolbar(oTemp, function () {
                return MM[oTemp].getToolbar(oTemp);
            }, function (n, cm) {
                return MM[oTemp].getToolbarMenu(n, cm);
            }, $(gConst.mainToolbar + oTemp), MM[oTemp].menuId);

            toolbar.init();
            toolbar.getToolbar();
            p1.updatePrevNextStatus(prev, next);
            CC.updateTitle(subject);
            //CC.updateTitleAndId(subject,mid);requestReadReceipt
            CC.sendMDN(data.requestReadReceipt, data.readReceipt, data.to);
            p1.setDivHeight();
            //MM["sys1"].refresh();
            p1.name = oTemp;
            MM[o] = null
            //CC.goReadMail(mid,"aaaaaaa",null,mi);

            if( jQuery('.toolbar')[0] ){
                jQuery('.toolbar').hide();
            }
        };
        var data = {
            func: func,
            data: {
                mode: "both",
                filterStylesheets: 0,
                filterImages: 0,
                filterLinks: 0,
                supportTNEF: 0,
                fileterScripts: 1,
                filterFrames: 1,
                markRead: 1,
                encoding: parm.encode || gConst.encode_utf8,
                mid: mid,
                fid: parm.fid
            },
            call: callBack,
            failCall: function (code) {
                if (code.errorCode == 2306906)
                    CC.alert(Lang.Mail.maiNoFound);
            }
        };
        MM.mailRequestApi(data);
    },
    updatePrevNextStatus: function (prev, next) {
        //var mid = this.omid;
        var mid = this.mid;
        var name = this.name;
        //var btnPre = $("btn_prev" + mid);
        //var btnNext = $("btn_next" + mid);
        //var btnSep = $("btn_sep" + mid);
        if (CC.isSessionMode()) {
            return;
        }
        var divPage = $("div_pages_" + mid);
        var html = "";
        if (prev) {
            html += '<a href="javascript:fGoto()" onclick="MM[\'' + "readMail" + mid + '\'].openReadMail(\'next\',\'' + prev.mid + '\',' + this.fid + ');" title="' + Lang.Mail.tb_Prev + '" id="btn_next' + mid + '">' + Lang.Mail.tb_Prev + '</a>';
        }
        if (next && prev) {
            html += '<span id="btn_sep' + mid + '">|</span>';
        }
        if (next) {
            html += '<a href="javascript:fGoto()" onclick="MM[\'' + "readMail" + mid + '\'].openReadMail(\'prev\',\'' + next.mid + '\',' + this.fid + ');" title="' + Lang.Mail.tb_Next + '" id="btn_prev' + mid + '">' + Lang.Mail.tb_Next + '</a>';
        }
        divPage.innerHTML = html;


        /*
         if (btnPre) {
         if (prev) {
         btnPre.style.display = "";
         btnPre.title = Lang.Mail.tb_Prev + ":" + prev.subject;
         }
         else {
         btnPre.style.display = "none";
         }
         }
         if (btnNext) {
         if (next) {
         btnNext.style.display = "";
         btnNext.title = Lang.Mail.tb_Next + ":" + next.subject;
         }
         else {
         btnNext.style.display = "none";
         }
         }
         if (btnSep) {
         if (prev && next) {
         btnSep.style.display = "";
         }
         else {
         btnSep.style.display = "none";
         }
         }*/
    },
    deleteSessionMail: function (mid, cb) {
        var p = this;
        var sessionId = p.sessionId;
        if (!CC.isSessionMode()) {
            p.del(mid);
            return;
        }

        var callback = function () {
            if (!mid) {
                CC.exit();
            }
            else {
                if (typeof(cb) == "function") {
                    cb();
                }
            }
        };
        var objReq = {
            func: "mbox:deleteSessionMessages",
            data: {
                sessionId: sessionId,
                flag: 0
            },
            call: callback
        };

        if (mid) {
            var mids = [mid];
            objReq.data.requestType = 1;
            objReq.data.ids = mids;
        }
        else {
            objReq.data.requestType = 0;
        }
        MM.mailRequest(objReq);
    },
    bindMeetingEvent: function (data, scope) {
        var me = this,
            doc = scope || document;

        jQuery("#btnMeetingAccepted", doc).click(function () {
            me.replyMeeting(1, data, doc, function () {
                jQuery("#boxMeetingBtns", doc).hide();
                jQuery("#boxMeetingReason", doc).hide();
                jQuery("#boxsettingResult", doc).html(me.getSetMeetingHtml(top.Lang.Mail.Write.jieshou, data.account));//接受
            });
        });
        jQuery("#btnMeetingTentative", doc).click(function () {
            me.replyMeeting(3, data, doc, function () {
                jQuery("#boxMeetingBtns", doc).hide();
                jQuery("#boxMeetingReason", doc).hide();
                jQuery("#boxsettingResult", doc).html(me.getSetMeetingHtml(top.Lang.Mail.Write.zanshijieshou, data.account));//暂时接受
            });
        });
        jQuery("#btnMeetingRefuse", doc).click(function () {
            jQuery("#boxMeetingReason", doc).show();
        });
        jQuery("#btnMeetingRefuseSubmit", doc).click(function () {
            me.replyMeeting(2, data, doc, function () {
                jQuery("#boxMeetingBtns", doc).hide();
                jQuery("#boxMeetingReason", doc).hide();
                jQuery("#boxsettingResult", doc).html(me.getSetMeetingHtml(top.Lang.Mail.Write.xiejue, data.account));//谢绝
            });
        });
        jQuery("#btnMeetingRefuseCancel", doc).click(function () {
            jQuery("#boxMeetingReason", doc).hide();
        });
    },
    replyMeeting: function (type, data, doc, callback) {
        var reason = "";

        if (type === 2) {
            reason = jQuery("#textMeetingReason", doc).val();
        }

        var mailData = {
            attrs: {
                "account": top.gMain.userNumber,
                "mid": GC.getUrlParamValue(location.href, "mid"),
                "to": data.account.match(/<(.*?)>/)[1],
                "subject": data.subject,
                "id" : data.id,
                "sendWay": 5,
                "content": reason,
                "meetingAttr": {
                    "location": data["meetingInfo"]["location"],
                    "meetingStart": data["meetingInfo"]["meetingStart"],
                    "meetingEnd": data["meetingInfo"]["meetingEnd"],
                    "uid": data["meetingInfo"]["uid"],
                    "partStat": type
                }
            },
            "action": "deliver",
            "returnInfo": 1
        };

        var sendData = {
            func : "mbox:compose",
            data : mailData,
            call : function () {
                callback && callback();
                CC.showMsg(top.Lang.Mail.Write.shezhichenggong, true, false, 'option');//设置成功
            },
            failCall : function () {
                CC.showMsg(top.Lang.Mail.Write.fashengcuowu, true, false, 'error');//发生错误
            },
            params: {
                "comefrom": 5,
                "categoryId": "103000000"
            },
            msg : ''
        };

        top.MM.mailRequestApi(sendData);
    },
    getSetMeetingHtml: function (type, account) {
        return top.Lang.Mail.Write.ninyijing + type + top.Lang.Mail.Write.liao + account + top.Lang.Mail.Write.faqidehuiyiyaoqing;//您已经  ||  了  ||  发起的会议邀请。
    },
    getMeetingHtml: function (data, mailContent) {
        var html = [],
            subject = CC.getMailText(data.subject, Lang.Mail.list_noSubject),
            timeStart = new Date(parseInt(data["meetingInfo"]["meetingStart"]) * 1000),
            timeEnd = new Date(parseInt(data["meetingInfo"]["meetingEnd"]) * 1000),
            to = data.to.split(","),
            parterStatusArr = [[], [], [], []],
            parts = data["meetingInfo"]["parts"],
            status = 0,
            i,
            len;

        for (i = 0, len = parts.length; i < len; i++) {
            if (parts[i].partStat === 1) {
                parterStatusArr[0].push(parts[i]);
            } else if (parts[i].partStat === 2) {
                parterStatusArr[1].push(parts[i]);
            } else if (parts[i].partStat === 3) {
                parterStatusArr[2].push(parts[i]);
            } else if (parts[i].partStat === 0) {
                parterStatusArr[3].push(parts[i]);
            }
            if (top.gMain.userNumber === parts[i]["parter"]) {
                status = +(parts[i]["partStat"]);
            }
        }

        if (parseInt(data["meetingInfo"]["meetingStart"]) < (new Date()).getTime() / 1000 ) {
            html.push("<div class=\"col_red meet-tip mt_15 radround\">");
            html.push("<i class=\"i-tx mr_5 ml_20\"></i>");
            html.push(top.Lang.Mail.Write.huiyiyiguoqi);//会议已过期
            html.push("</div>");
        } else if (top.gMain.userNumber === data.account.match(/<(.*?)>/)[1]) {
            html.push("<p class=\"meet_til\">"+top.Lang.Mail.Write.nindehuiyiyaoqingyiyou);//<p class=\"meet_til\">您的会议邀请：已有
            html.push("<var class=\"col_green\"> ", parterStatusArr[0].length, "</var> "+top.Lang.Mail.Write.renjieshou);//</var> 人接受；
            html.push("<var class=\"color_blue\"> ", parterStatusArr[2].length, "</var> "+top.Lang.Mail.Write.renzanshijieshou);//</var> 人暂时接受；
            html.push("<var class=\"col_red\"> ", parterStatusArr[1].length, "</var> "+top.Lang.Mail.Write.renxiejue);//</var> 人谢绝；
            html.push("<var class=\"col_orange\"> ", parterStatusArr[3].length, "</var> "+top.Lang.Mail.Write.renweizhi);//</var> 人未知。
            html.push("</p>");

            html.push("<div class=\"meet-tip clearfix mt_15 radtop\">");
            html.push("<i class=\"i-cret mt5 mr_5 ml_20 fl\"></i>");
            html.push("<div class=\"noflow\">");
            html.push("<div class=\"clearfix pl_5 pr_10\" style=\"line-height:22px;\">");
            for (i = 0; i < parterStatusArr[0].length; i++) {
                html.push("<span class=\"meet_cn\">", parterStatusArr[0][i].parter.encodeHTML(), "</span>");
            }
            html.push("</div></div></div>");

            html.push("<div class=\"meet-tip clearfix\" style=\"margin-top:1px;\">");
            html.push("<i class=\"i-tx mt5 mr_5 ml_20 fl\"></i>");
            html.push("<div class=\"noflow\">");
            html.push("<div class=\"clearfix pl_5 pr_10\" style=\"line-height:22px;\">");
            for (i = 0; i < parterStatusArr[2].length; i++) {
                html.push("<span class=\"meet_cn\">", parterStatusArr[2][i].parter.encodeHTML(), "</span>");
            }
            html.push("</div></div></div>");

            html.push("<div class=\"meet-tip clearfix radbtm\" style=\"margin-top:1px;\">");
            html.push("<i class=\"i-error mt5 mr_5 ml_20 fl\"></i>");
            html.push("<div class=\"noflow\">");
            html.push("<div class=\"clearfix pl_5 pr_10\" style=\"line-height:22px;\">");
            for (i = 0; i < parterStatusArr[1].length; i++) {
                html.push("<span class=\"meet_cn\">", parterStatusArr[1][i].parter.encodeHTML(), "</span>");
            }
            html.push("</div></div></div>");

            html.push("<div class=\"meet-tip clearfix radbtm\" style=\"margin-top:1px;\">");
            html.push("<i class=\"i-unknow mt5 mr_5 ml_20 fl\"></i>");
            html.push("<div class=\"noflow\">");
            html.push("<div class=\"clearfix pl_5 pr_10\" style=\"line-height:22px;\">");
            for (i = 0; i < parterStatusArr[3].length; i++) {
                html.push("<span class=\"meet_cn\">", parterStatusArr[3][i].parter.encodeHTML(), "</span>");
            }
            html.push("</div></div></div>");
        } else {

            switch (status) {
                case 0:
                    html.push("<p id=\"boxsettingResult\" class=\"meet_til\">");
                    html.push("<strong class=\"col_green mr_10\">", data.account.encodeHTML(), "</strong>");
                    html.push(top.Lang.Mail.Write.yqncyukNNbhyfqz);//邀请您参与会议，请回应会议发起者：
                    html.push("</p>");
                    html.push("<p id=\"boxMeetingBtns\" class=\"pt_10\">");
                    html.push("<a id=\"btnMeetingAccepted\" href=\"javascript:;\" class=\"n_btn_on\"><span><span>"+top.Lang.Mail.Write.jieshou+"</span></span></a>");//<a id=\"btnMeetingAccepted\" href=\"javascript:;\" class=\"n_btn_on\"><span><span>接受</span></span></a>
                    html.push("<a id=\"btnMeetingTentative\" href=\"javascript:;\" class=\"n_btn ml_5\"><span><span>"+top.Lang.Mail.Write.zanding+"</span></span></a>");//<a id=\"btnMeetingTentative\" href=\"javascript:;\" class=\"n_btn ml_5\"><span><span>暂定</span></span></a>
                    html.push("<a id=\"btnMeetingRefuse\" href=\"javascript:;\" class=\"n_btn ml_5\"><span><span>"+top.Lang.Mail.Write.xiejue+"</span></span></a>");//<a id=\"btnMeetingRefuse\" href=\"javascript:;\" class=\"n_btn ml_5\"><span><span>谢绝</span></span></a>
                    html.push("</p>");
                    break;
                case 1:
                    html.push("<p class=\"meet_til\">");
                    html.push(top.Lang.Mail.Write.ninyijingjieshouliao, data.account.encodeHTML(), top.Lang.Mail.Write.faqidehuiyiyaoqing);//您已经接受了  ||  发起的会议邀请。
                    html.push("</p>");
                    break;
                case 2:
                    html.push("<p class=\"meet_til\">");
                    html.push(top.Lang.Mail.Write.ninyijingxiejueliao, data.account.encodeHTML(), top.Lang.Mail.Write.faqidehuiyiyaoqing);//您已经谢绝了  ||  发起的会议邀请。
                    html.push("</p>");
                    break;
                case 3:
                    html.push("<p class=\"meet_til\">");
                    html.push(top.Lang.Mail.Write.ninzanshijieshouliao, data.account.encodeHTML(), top.Lang.Mail.Write.faqidehuiyiyaoqing);//您暂时接受了  ||  发起的会议邀请。
                    html.push("</p>");
                    break;
            }
        }

        html.push("<div id=\"boxMeetingReason\" class=\"reject_box\" style=\"display: none;\">");
        html.push("<div class=\"reject mt_10\">");
        html.push("<textarea class=\"reject_font\" id=\"textMeetingReason\"></textarea>");
        html.push("</div>");
        html.push("<p class=\"ta_r pt_10\">");
        html.push("<a id=\"btnMeetingRefuseSubmit\" href=\"javascript:;\" class=\"n_btn_on\"><span><span>"+top.Lang.Mail.Write.queding+"</span></span></a>");//<a id=\"btnMeetingRefuseSubmit\" href=\"javascript:;\" class=\"n_btn_on\"><span><span>确定</span></span></a>
        html.push("<a id=\"btnMeetingRefuseCancel\" href=\"javascript:;\" class=\"n_btn ml_5\"><span><span>"+top.Lang.Mail.Write.quxiao+"</span></span></a>");//<a id=\"btnMeetingRefuseCancel\" href=\"javascript:;\" class=\"n_btn ml_5\"><span><span>取消</span></span></a>
        html.push("</p>");
        html.push("</div>");

        html.push("<div class=\"meet-mode mt_20\">");
        html.push("<ul>");
        html.push("<li>");
        html.push("<h2 class=\"ml_15 fw_b fz_14\">", subject, "</h2>");
        html.push("</li>");

        html.push("<li>");
        html.push("<div class=\"clearfix\">", "<i class=\"i-address ml_20 fl mt_5\"></i>");
        html.push("<div class=\"noflow\">");
        html.push("<p class=\"meet-adr\">", data["meetingInfo"]["location"].encodeHTML(), "</p>");
        html.push("</div>", "</div>" ,"</li>");

        html.push("<li>");
        html.push("<div class=\"clearfix\">");
        html.push("<i class=\"fl i-meetime ml_20\"></i>");
        html.push("<p class=\"pl_10 noflow\">");
        html.push("<span>", timeStart.toLocaleDateString(), "</span>");
        html.push("<span class=\"pl_10\">", timeStart.getHours() + ":" + (timeStart.getMinutes() < 10 ? "0" + timeStart.getMinutes() : timeStart.getMinutes()), "</span>");
        html.push("<span class=\"pl_10\">"+top.Lang.Mail.Write.zhi+"</span>");//<span class=\"pl_10\">至</span>
        html.push("<span class=\"pl_10\">", timeEnd.toLocaleDateString(), "</span>");
        html.push("<span class=\"pl_10\">", timeEnd.getHours() + ":" + (timeEnd.getMinutes() < 10 ? "0" + timeEnd.getMinutes() : timeEnd.getMinutes()), "</span>");
        html.push("</p>", "</div>", "</li>");

        html.push("<li>");
        html.push("<div class=\"clearfix\">");
        html.push("<i class=\"fl i-meetren ml_20 mt5\"></i>");
        html.push("<div class=\"noflow\">");
        html.push("<div class=\"clearfix pl_10 pr_10\">");
        for (i = 0, len = to.length; i < len; i++) {
            html.push("<span>", to[i].encodeHTML(), "</span>");
        }
        html.push("</div>", "</div>", "</div>");
        html.push("</li>");
        html.push("</ul></div>");

        return html.join("") + mailContent;
    },
    getReadMailHtml: function (data) {
        var p = this;
        var o = p.name;
        data = data || CM[o]["var"];
        var mData = MM[o];
        var mid = data.omid;
        var subject = CC.getMailText(data.subject, Lang.Mail.list_noSubject);
        p.requestReadReceipt = data.requestReadReceipt;
        p.readReceipt = data.readReceipt;
        var from = p.from ;// from 不是真实发件人;
        var date = p.date;
        var to = CC.getMailText(data.to);
        var ccAll = data.cc;
        var toAll = data.to;
        var cc = CC.getMailText(data.cc);
        var bcc = CC.getMailText(data.bcc);
        var attach = data.attachments || [];
        var sendUser = Email.getValue(from.decodeHTML());
        var mailContent = CC.getMailContent(data);
        var allUser = sendUser;
        var denyForward = data.denyForward || 0;
        var sendWay = data.sendWay || 0;
        var t;
        var timeStr;
       //读写mbox:readMessages 接口返回的属性headers:{"auditStatus":0} 0表示已审核？，如何有这个属性，
        //邮件主题前面要标记“待审核”，“已审核”
        var auditS = data.auditStatus;

        if (sendWay === 4 && data["meetingInfo"]) {
            mailContent = p.getMeetingHtml(data, mailContent);
        }

        if (!auditS && data.headers) {
            auditS = data.headers["auditStatus"];
        }

        var msg_audit = "";

        if (auditS == "3" || auditS == "4") {
            msg_audit = "<span id='readMail_status'>" + Lang.Mail.Write.unAddit + "：</span>";
        } else if (auditS == "5" || auditS == "6") {
            msg_audit = "<span id='readMail_status'>" + Lang.Mail.Write.audited + "：</span>";
        }

        subject = msg_audit + subject;

        if (to) {
            allUser += "," + to;
        }
        if (cc) {
            allUser += "," + cc;
        }
        if (bcc) {
            allUser += "," + bcc;
        }
        var sL = allUser.split(",");
        var allArray = [];
        var s = "";
        for (var i = 0; i < sL.length; i++) {
            allArray.push(parent.Email.getValue(sL[i].decodeHTML()));
        }
        allArray = parent.Util.unique(allArray);
        p.sendName = Email.getName(from.decodeHTML());
        p.to = to;//收件人地址  以逗号分隔的字符串
        p.cc = cc;//抄送人地址  以逗号分隔的字符串
        p.bcc = bcc;
        p.subject = subject;
        p.sendUser = sendUser;
        p.maildata = mailContent;
        p.allUser = allArray.join(",");
        var strEvent = "oSM";//"MM[\'"+o+"\']";
        var showContactMail = true;
        var fromMailAddr = parent.Email.getValue(p.from.decodeHTML());
        var toMailAddr   = parent.Email.getValue(p.to.decodeHTML());

        this.fromMailAddr = fromMailAddr;
        this.toMailAddr = toMailAddr;

        //if(!GC.check('CONTACTS_PER') || (fromMailAddr && p.to.decodeHTML().indexOf(fromMailAddr) > -1) || p.fid == 3){
        if(!GC.check('MAIL_INBOX_CONTACTS') ||  p.fid == 3 || (gMain.userNumber === p.fromMailAddr)){
            showContactMail = false;
        }

        //showContactMail = false; // 硬编码写死权限

        var html = [];
        html.push("<div id='readMail_all'>");

        html.push("<div id='readMail_mail_content_container' class='wl-mail'>");
        html.push("<div id='readMail_inner' class='wl-mail-inner p_relative' style='margin-right:0;'>");
        if(showContactMail){
            html.push('<a id="contact_mail_switch" href="#" class="tx-tr"><i></i></a>');
        }
        html.push("<div class=\"readMail\" id='mailhead' >");
        html.push("<div class=\"hTitle\">");
        html.push("<h2>");

        if (this.mi.color) {
            try {
                if(this.mi.color > gConst.subjectColor.length){
                    this.mi.color = gConst.subjectColor.length;
                }
                var subjectColor = CC.getSubjectColorObject(this.mi.color).value;
                html.push("<font color='" + subjectColor + "'>" + subject + "</font>");
            }
            catch (e) {
                html.push(subject);
            }
        }
        else {
            if(subject.length > 70){
                html.push(subject.substring(0,70) + "<br/>" + subject.substring(70, subject.length));
            }else{
                html.push(subject);
            }
            
        }
        if (p.fid == 5 || p.mi.fid == 5) {
            html.push("<span style=\"padding-left:10px;font-weight:normal;\"><a href=\"javascript:;\" id='notJunk' onclick=\"MR.notJunk();\" >[" + Lang.Mail.noSpam + "]</a></span>");
        }

        html.push(p.showMDSHtml(data, "MR"));

        if (window.LoginType == gConst.loginType.mm) {
            html.push("<span style=\"padding-left:10px;font-weight:normal;display:none\" id='isETLink'><a id='isETLink_a' target='_blank' href='#'>[" + Lang.Mail.etLink + "]</a></span>");
        }
        //标签邮件
        if (CC.isLabelMail()) {
            html[html.length] = '<div class="tag_div">';
            for (var k = 0,l=data.label.length; k < l; k++) {
                var label = MM.getFolderObject(data.label[k]);
                if(label){
                    html[html.length] = '<a href="javascript:void(0);" data-lid="' + label.fid + '" data-mid="' + mid + '" class="' + gConst.labelColor[label.folderColor] + ' tag_squ ml_5"><span>';
                    html[html.length] = label.name;
                    html[html.length] = '</span><i></i></a>';
                }
            }
            html[html.length] = '</div>';
        }
        html.push("</h2>");
        html.push("</div>");

        //待办邮件-start
        if(data && data.flag && data.flag["taskFlag"] && data.flag["taskFlag"]=="1"){
            if(data.headers && data.headers["taskDate"] && data.headers["taskDate"] > 0){
                t = new Date(data.headers["taskDate"] * 1000);
                timeStr = t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate() + " " + t.getHours() + ":" + t.getMinutes();
                html.push("<div class=\"divTips\"><span>"+top.Lang.Mail.Write.yisheweidaibanyoujian+timeStr+""+top.Lang.Mail.Write.tixing+"</span><li id=\"btnModRemind_2\"><a href=\"javascript:;\" >"+top.Lang.Mail.Write.xiugai+"</a></li><li id=\"btnTaskStatus_2\"><a href=\"javascript:;\" >"+top.Lang.Mail.Write.sheweiwancheng+"</a></li></div>");                   //<div class=\"divTips\"><span>已设为待办邮件，  ||  提醒。</span><li id=\"btnModRemind_2\"><a href=\"javascript:;\" >修改</a></li><li id=\"btnTaskStatus_2\"><a href=\"javascript:;\" >设为完成</a></li></div>
            }else if(data.headers && data.headers["taskDate"] && data.headers["taskDate"] == 0){
                t = new Date(data.headers["taskDate"] * 1000);
                timeStr = t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate() + " " + t.getHours() + ":" + t.getMinutes();
                html.push("<div class=\"divTips\"><span>"+top.Lang.Mail.Write.yisheweidaibanyoujian+"</span><li id=\"btnTaskStatus_2\"><a href=\"javascript:;\" >"+top.Lang.Mail.Write.sheweiwancheng+"</a></li></div>");   //<div class=\"divTips\"><span>已设为待办邮件。</span><li id=\"btnTaskStatus_2\"><a href=\"javascript:;\" >设为完成</a></li></div>
            }
        }
        //待办邮件-end

        html.push("<div class=\"readMailInfo\" id='readMailInfo'>");

        html.push("<div class=\"rMList\">");
        html.push("<span class=\"rMl\">" + p.getLang(Lang.Mail.list_Send, Lang.Mail.sender) + "：</span>");
        html.push("<div class=\"rMr\">");
        html.push("<div class=\"gAddr\">");
        var trueName =from.substr(0, from.lastIndexOf("&lt;"));
        if (trueName.length > 200) {
            trueName = trueName.substring(0, 200) + "...";
            html.push("<strong class=\"gAddrN\" tilele='" + from + "' >" + trueName + "</strong>");
        }
        else{
            html.push("<strong class=\"gAddrN\">" + trueName + "</strong>");
        }
        html.push("<em class=\"gAddrE\">&lt;" + sendUser + "&gt;</em>");
        

        
        if (gMain.userNumber != fromMailAddr && GC.check("CONTACTS_PER") && !LMD.userContancts[fromMailAddr]) {
            html.push('<span class="gAddrE"><a id="addToContact1_'+mid+'"  class="addToContact" href="javascript:fGoto();" onclick="'+strEvent+'.addEmailContacts(\'' + p.from.replace(/'|"/ig, '') + '\',\'fromType\');return false;">'+Lang.Mail.readMail_lb_addtocontacts+'</a></span>');
        }


        html.push("</div></div></div>");
        var email =sendUser;// from.substring(from.lastIndexOf("&lt;") + 4, from.lastIndexOf("&gt;"));
        if(data.sender!="" && Email.getValue(data.sender) !=Email.getValue(p.from.decodeHTML())){
            html.push('<div class="rMList"><span class="rMl" style="visibility: hidden;">'+top.Lang.Mail.Write.fajianren+'</span><div class="rMr"><div class="gAddr"><span style="margin-left: -17px;">');//<div class="rMList"><span class="rMl" style="visibility: hidden;">发件人：</span><div class="rMr"><div class="gAddr"><span style="margin-left: -17px;">
            html.push('('+top.Lang.Mail.Write.you+p.from+''+top.Lang.Mail.Write.daifa+')</span></div></div></div>');//（由  ||  代发）</span></div></div></div>
        }
        html.push("<div class=\"rMList\">");
        html.push("<span class=\"rMl\">" + p.getLang(Lang.Mail.readMail_lb_to, Lang.Mail.recerver) + "</span>");
        html.push("<div class=\"rMr\" ><span id=\"" + o + "to\">" + p.showMore(o, 'to', -1) + "</span>");
        if (GC.check('CONTACTS_PER')) {
            if (!(p.ToExistInAddressList(p.to).isAllInAddr)) {
                if (p.ToExistInAddressList(p.to).notInAddrCount < 2) {
                    html.push('<span id="addTo" style="padding-left:5px"><a id="to_' + mid + '"');
                    html.push(' onclick="' + strEvent + '.addEmailContacts(\'' + toAll.replace(/'|"/ig, '') + '\',\'toType\');return false; "');
                    html.push('class="addToContact" href="javascript:fGoto();" >' + Lang.Mail.addToAddr + '</a></span>');
                } else {
                    html.push('<span id="addTo" style="padding-left:5px"><a id="to_' + mid + '"');
                    html.push(' onclick="' + strEvent + '.addEmailContacts(\'' + p.to.replace(/'|"/ig, '') + '\',\'to\');return false; "');
                    html.push('class="addToContact" href="javascript:fGoto();" >' + Lang.Mail.pltj + '</a></span>');
                }
            }
        }
        html.push("</div></div>");

        html.push("<div class=\"rMList\">");
        html.push("<span class=\"rMl\">" + Lang.Mail.readMail_lb_time + "</span>");
        html.push(" <div class=\"rMr\">" + date + "</div> </div>");

        // 如果是密级邮件,则显示密级
        if(GC.check('MAIL_INBOX_SECURITY')){
            if (data.headers && data.headers.securityLevel) {
                html.push("<div class='rMList'>");
                html.push("<span class='rMl'>" + Lang.Mail.securityLevel + "</span>");
                html.push("<div class='rMr'>" + parent.CC.getSecurityMailName(data.headers.securityLevel) + "</div></div>");
            }
        }

        if (cc != "") {
            html.push("<div class=\"rMList\" id='cc_" + mid + "'>");
            html.push("<span class=\"rMl\">" + p.getLang(Lang.Mail.readMail_lb_cc, Lang.Mail.copto) + "</span>");
            html.push("<div class=\"rMr\"><span id=\"" + o + "cc\">" + p.showMore(o, 'cc', -1) + "</span>");

            var maiEvent = '.addEmailContacts(\'' + p.cc.replace(/'|"/ig, '') + '\',\'cc\');';
            if (p.CCExistInAddressList(p.cc).notInAddrCount == 1) {
                maiEvent = '.addEmailContacts(\'' + ccAll.replace(/'|"/ig, '') + '\',\'ccType\');';
            }
            var addToHMTL = '<span id="addCC" style="padding-left:5px"><a id="cc_{0}"' +
                ' onclick="' + strEvent + maiEvent + 'return false; "' +
                'class="addToContact" href="javascript:fGoto();" >{1}</a></span>';

            if (GC.check('CONTACTS_IMPORT')) {
                if (GC.check("CONTACTS") && GC.check("CONTACTS_OPER") && p.CCExistInAddressList(p.cc).notInAddrCount == 1) {

                    html.push(addToHMTL.format(mid, Lang.Mail.addToAddr));

                } else if (GC.check("CONTACTS") && GC.check("CONTACTS_OPER") && (p.CCExistInAddressList(p.cc).notInAddrCount > 1) && !p.CCExistInAddressList(p.cc).isAllInAddr) {
                    html.push(addToHMTL.format(mid, Lang.Mail.pltj));
                }

            }

            html.push("</div></div>");
        }
        if (bcc != "" && p.fid == 3) {
            html.push("<div class=\"rMList\" id='bcc_" + mid + "'>");
            html.push("<span class=\"rMl\">" + p.getLang(Lang.Mail.prv_lbt_bcc, Lang.Mail.msTo) + "</span>");
            html.push("<div class=\"rMr\" id=\"" + o + "bcc\">" + p.showMore(o, 'bcc', -1));
            html.push("</div></div>");
        }

        html.push(p.getAttachHtml(mid, attach, {denyForward: denyForward}));
        //邮件备注；
        html.push(p.getRemarkHtml(strEvent, mid, mid, data.flag));

        //发信状态查询
        if (p.fid == 3 && p.rcptFlag != 5) {
            html.push("<div class=\"send-state-bg\" >");
            html.push(p.showDSHtml("oSM"));
            html.push("</div>");
        }

        //安全邮箱 签名 加密标示
        if(CC.isSecurityMail()){
            html.push(p.getSecurityMailHtml(data));
        }

        /**
         * 已验签名 签名验证未通过  数字加密邮件
         //加密
         <i class="i-ykey"></i>

         //签名+加密
         <i class="i-redmedal"></i>

         //签名邮件 (已经通过)
         <i class="i-graymedal"></i>

         //签名不通过邮件
         <i class="i-mixmedal"></i>

         */


        html.push("</div>"); // end readMailInfo
        

        html.push("<span class=\"readmialTool\">");

        if( gMain.sessionMode && gMain.sessionMode != "1"  ){
            html.push("<a href='javascript:;'  title='" + (data.flag.starFlag == 1 ? Lang.Mail.haveStar : Lang.Mail.noStar) + "'><i onclick=" + strEvent + ".starFlag(this,'" + mid + "')  flagval=" + (data.flag.starFlag ? data.flag.starFlag : 0) + " id='StarFlag" + mid + "' class=\"" + (data.flag.starFlag == 1 ? "i_starFlag_on" : "i_starFlag_off") + "\"></i></a>  | ")
        }
        
       

        if (sendWay == 0) {
            html.push("<a href='javascript:;' onclick=" + strEvent + ".newOpen('" + mid + "') title='" + Lang.Mail.readMail_lb_newwindow + "'  ><i class=\"i_2win\"></i></a> | ");
        }
        html.push("<a href='javascript:;' onclick=" + strEvent + ".showRemark('" + mid + "',this); flagval='" + (data.flag.memoFlag ? data.flag.memoFlag : 0) + "'  ck=\"toggle\" title='" + (data.flag.memoFlag == 1 ? Lang.Mail.haveRemark : Lang.Mail.noRemark) + "' id='remarkon_" + mid + "'><i id='memoFlag_" + mid + "' class='" + (data.flag.memoFlag == 1 ? 'i_note_on' : 'i_note_off') + "' ></i></a> | ");
        if (sendWay == 0) {
            html.push("<a href='javascript:;' onclick=MR.printMail('" + mid + "') title='" + Lang.Mail.tb_Print + "' ><i class=\"i_alarm\"></i></a> | ");
        }
        html.push("<a href='javascript:;'  title='" + Lang.Mail.contraction + "'><i id='head_" + mid + "' onclick=" + strEvent + ".showHead(this,'" + mid + "') class=\"i_2trid_up\"></i></a> </span>");
        html.push(TaskMail.getReadIconHtml(data));
        html.push("</div>");

        // 如果邮件是自销毁的邮件给出提示语，并输出脚本禁用
        // 提醒：这是一封“自销毁”的邮件，回复这封邮件时会隐藏原邮件正文和附件。
        if (data.flag && data.flag.selfdestruct) {
            if (data.flag.selfdestruct === 2) {
                html.push('<div class="yellowTips">'+top.Lang.Mail.Write.txzsyElenhhycyw+'</div>');//<div class="yellowTips">提醒：这是一封自销毁邮件，发信人设置了该邮件被阅读后自动销毁，回复这封邮件时会隐藏原文。</div>
            } else if (data.flag.selfdestruct === 1) {
                html.push('<div class="yellowTips">'+top.Lang.Mail.Write.txzsyyYsMrhycyw+'</div>');//<div class="yellowTips">提醒：这是一封自销毁邮件，发信人设置了邮件阅读过期时间，过期后将自动销毁，回复这封邮件时会隐藏原文。</div>
            }

        } else if (denyForward) {
            // 如果邮件是禁止转发的邮件给出提示语，并输出脚本禁用
            // 提醒：这是一封“禁止转发”的邮件，回复这封邮件时会隐藏原邮件正文和附件。
            html.push('<div class="yellowTips">' + Lang.Mail.forbidMaillTip + '</div>');
        }



        // 如果是加密邮件，且是收件箱的信，且发件人是本人，提供密码查看功能
        if ((sendWay == 2 || sendWay == 3) && parent.Email.getValue(data.account) == parent.gMain.userNumber && mData.fid == 3) {
            var mail_password = mData.data.headers.mailPass || '';
            html.push('<div id="pwd_tips" class="yellowTips"><i class="i-mail-lock mr_10"></i>' + Lang.Mail.setedPwd + '<span id="pwd_txt" style="display:none;">' + Lang.Mail.pwd + mail_password + '</span><a id="pwd_btn_look" href="javascript:fGoto()" onclick="return false;" class="ml_10">' + Lang.Mail.lookpwd + '</a></div>');
        }

        if (CC.power.offSensMail()) {
            html.push(SensitiveMail.getReadTips(data));
        }

        //读信页正文 html
        html.push("<div class=\"mialContent\" style=\"position:relative;\">");

        this.mailContent = mailContent;

        //如果是安全邮箱, 如果解密 或者 签名验证不通过, 则不显示内容
        //因无法保证发件人的真实性，或邮件内容可能被篡改，考虑到安全性，该邮件已被屏蔽。
        if( CC.isSecurityMail() ){
            var sm_errorTip = top.Lang.Mail.Write.ywfbzGgnDKjybpb;//因无法保证发件人的真实性，或邮件内容可能被篡改，考虑到安全性，该邮件已被屏蔽。
            if( data.flag && ( data.flag.safemail_sign == -1 || data.flag.secureSigned == -1 )){
                html.push("<div style='height:110px; font-size:14px; padding:40px;'>"+sm_errorTip+"</div>");
            }else if(data.flag && ( data.flag.safemail_crypt == -1 || data.flag.secureEncrypt == -1 )){
                html.push("<div style='height:110px; font-size:14px; padding:40px;'>"+ sm_errorTip +"</div>");
            }else{
                html.push("<iframe frameborder=\"0\" scrolling=\"no\" id='mailContent' name='mailContent' onload='oSM.contentOnload(\"" + mid + "\")' style=\"width: 100%;\" src='" + gMain.webPath + "/static/se/mail/blank.htm'></iframe>");
            }
        }else{
            html.push("<iframe frameborder=\"0\" scrolling=\"no\" id='mailContent' name='mailContent' onload='oSM.contentOnload(\"" + mid + "\")' style=\"width: 100%;\" src='" + gMain.webPath + "/static/se/mail/blank.htm'></iframe>");
        }



        //html.push("<div class=\"mailText\" id=\"mailContent\">"+mailContent+"</div>");
        html.push("</div>");
        //读信页正文 html---end


        //得到附件图片略缩图
        html.push(p.getThumbNailImage(mid, attach, {denyForward: denyForward}));

        //附件列表\

        //html.push(p.getAttachListHtml(mid,attach));

        html.push("<div " + (attach.length > 0 ? "" : "class='attrBody'") + "  id='diskList_html' style='display:none;'></div>");

        if(GC.check("MAIL_INBOX_WRITE")){
            html.push('<div class="readMail_reply" id="readMail_reply">');
            html.push(p.getQuickReplyHtml(strEvent, mid, mid));
            html.push('</div>');
        }
        html.push('</div>'); // end wl-mail-inner
        html.push("</div>"); // end readMail_mail_content_container

        if(showContactMail){
            html.push("<div id='readMail_sidebar' class='wl-mail-side' style='display:none;'>");
            html.push(p.getContactMailUI());
            html.push("</div>"); // end readMail_sidebar
        }

        html.push("</div>"); //整体邮件内容结构结束
        // 如果是禁止转发的邮件，读信是加入禁止复制和右键功能
        if (denyForward) {
            html.push('<' + 'script>');
            html.push('document.oncontextmenu = function(e){return false;};');
            html.push('document.onselectstart = function(e){return false;};');
            html.push('</' + 'script>');
            html.push('<noscript><iframe src="*.htm"></iframe></noscript>');

            // 向顶层页面加入禁止另存为脚本（仅IE有效）
            var noscript = document.createElement('noscript');
            var iframe = document.createElement('iframe');
            iframe.src = '*.htm';

            try {
                top.document.body.appendChild(noscript);
                noscript.appendChild(iframe);
            } catch (e) {

            }
        }
        p.showContactMail = showContactMail || false;

        return html.join("");
    },
    mailContentLoaded: function(){
        if(this.showContactMail){
            this.initContactMail();
        }
    },
    mailInfoloaded: function(obj){
        // ----信件信息装载完成
        var p = this;
        var doc = obj || document;
        var sensitive = jQuery("p:contains('Sensitive')", doc);

        if(sensitive && sensitive.length){
            var solution = sensitive.parent().parent().next().find('p');
            sensitive.parent().html(top.Lang.Mail.Write.nfsdynbGzAbhmgc);//您发送的邮件可能触发了安全策略或包含敏感词
            if(solution){
                solution.html(""+top.Lang.Mail.Write.rnxjxpGmHqyjqxz+"<a href='#' id='encryptMail' onclick='return false;'>"+top.Lang.Mail.Write.jixufasong+"</a>");//若您想继续投递该邮件，请选择<a href='#' id='encryptMail' onclick='return false;'>继续发送</a>
                jQuery('#encryptMail', doc).bind('click', function(){
                    var text = top.Lang.Mail.Write.nxzlyksCTPrjmmm;//您选择了以加密的方式继续发送该邮件，请输入加密密码
                    text+= parent.Lang.Mail.tips033 + '：<input type="password" id="security_password" class="" /><br/>';
                    text+= parent.Lang.Mail.tips034 + '：<input type="password" id="security_repassword" class="" />';
                    parent.CC.alert(text, function(){
                        var pwd = jQuery('#security_password', parent.document).val();
                        var repwd = jQuery('#security_repassword', parent.document).val();
                        if(pwd.trim() == ''){
                            alert(parent.Lang.Mail.tips017);
                            return true;
                        }
                        else if(pwd != repwd){
                            alert(parent.Lang.Mail.tips031);
                            return true;
                        }
                        else{
                            p.encryptCode = pwd;
                            p.makeMailtoZip();
                        }
                    });
                });
            }
        }
    },
    /**
     * 压缩邮件
     */
    makeMailtoZip: function(){
        var func = "mbox:emlEncZipCompose";
        var d = CM[gConst.readMail + this.data.mid]['var'] || this.data; //fix the reference object will missing issue.
        var dd = {
            mid: d.omid,
            encryptCode: this.encryptCode,
            attachments: d.attachments
        };
        var call = function(){parent.CC.showMsg(top.Lang.Mail.Write.gaiyoujianyijiamifasongchenggong, true, false, 'option');};//该邮件已加密发送成功
        var fCall = function(){parent.CC.showMsg(top.Lang.Mail.Write.gaiyoujianjiamifasongshibai, true, false, 'error');};//该邮件加密发送失败
        var q = {
            func: func,
            data: dd,
            call: call,
            failCall: fCall,
            params: {comefrom: 5, categoryId: '103000000', module: 'web', guid: d.omid}
        };

        parent.MM.mailRequestApi(q);
    },
    /**
     * 初始化往来邮件信息
     */
    initContactMail: function(){
        if(typeof ContactMailItemType == 'undefined'){
            var cmit = {
                ME: 0,
                OTHER: 1
            };
            window['ContactMailItemType'] = cmit;
        }
        var doc = document;
        if(doc == parent.document){
            doc = window.frames[gConst.ifrmReadmail + this.name];
            doc = doc ? doc.window.document : document;
        }
        this.doc = doc;

        var from = this.from.decodeHTML();
        var to = parent.gMain.userNumber;
        from = parent.Email.getValue(from) ? parent.Email.getValue(from) : from;

        this.loadContactMail(from, to);
        this.loadContactAttach(from, to);
        this.getAddressInfoFromServer(from);
    },
    /**
     * 获取用户写短信按钮UI
     */
    getUserPhoneUI: function(){
        return '<a id="contact_mail_writeMessage" href="#" class="n_btn ml_5" onclick="return false;"><span><span>'+top.Lang.Mail.Write.xieduanxin+'</span></span></a>';//<a id="contact_mail_writeMessage" href="#" class="n_btn ml_5" onclick="return false;"><span><span>写短信</span></span></a>
    },
    /**
     * 获取往来邮件UI结构
     */
    getContactMailUI: function(){
        var html = [];
        var from = this.from.decodeHTML();
        var localUserInfo = parent.CC.getUserInfoFromLocalAddress({email:from});
        var phone, name;
        from = parent.Email.getValue(from) == false ? from : parent.Email.getValue(from);
        if(localUserInfo){
            phone = localUserInfo.phone;
        }
        if(parent.GE.testContactMailPhone){
            phone = parent.GE.testContactMailPhone;
        }

        html.push('<div class="p_relative">');

        html.push('<div class="fro" style="+zoom:1;">');

        html.push('<div class="fro-top clearfix">');
        html.push('<a id="contact_mail_face_link" href="#" class="fl fro-img" onclick="return false;"><img src="' + parent.CC.getResourceAbsoluteURL() + '/images/foimg.jpg" width="50" height="50"/></a>');
        html.push('<div class="fro-top-rt">');
        if(typeof this.fromUserName != 'undefined'){
            name = this.fromUserName;
        }
        else{
            name = '';
        }
        html.push('<h3 id="contact_mail_address_name">' + name + '</h3>');
        html.push('<p id="contact_mail_address_email" class="tf">' + from + '</p>');
        html.push('</div>');
        html.push('</div>');

        html.push('<div class="wl-btner">');
        html.push('<a id="contact_mail_writeMail" href="#" class="n_btn ml_10" onclick="return false;"><span><span>'+top.Lang.Mail.Write.xiexin+'</span></span></a>');//<a id="contact_mail_writeMail" href="#" class="n_btn ml_10" onclick="return false;"><span><span>写信</span></span></a>
        if(phone && GC.check("MAIL_VAS_SMS")){
            html.push(this.getUserPhoneUI());
            this.userPhone = phone;
        }
        html.push('</div>');

        html.push('<div class="wl-tab">');

        html.push('<div class="wl-tab-hd">');
        html.push('<ul class="wl-tab-til clearfix">');
        html.push('<li class="wl-mail-lt on"><a id="contact_mail_mail_tab" href="#" onclick="return false;"><i class="i-readMail-file"></i><span>'+top.Lang.Mail.Write.wanglaiyoujian+'</span></a></li>');//<li class="wl-mail-lt on"><a id="contact_mail_mail_tab" href="#" onclick="return false;"><i class="i-readMail-file"></i><span>往来邮件</span></a></li>
        html.push('<li class=""><a id="contact_mail_attach_tab" href="#" onclick="return false;"><i class="i-fj mr_5"></i><span>'+top.Lang.Mail.Write.wanglaifujian+'</span></a></li>');//<li class=""><a id="contact_mail_attach_tab" href="#" onclick="return false;"><i class="i-fj mr_5"></i><span>往来附件</span></a></li>
        html.push('</ul>');
        html.push('</div>');

        html.push('<div id="mailContact_mailListContainer" class="wl-tab-con"></div>');
        html.push('<div id="mailContact_attachListContainer" class="wl-tab-con" style="display:none;"></div>');

        html.push('</div>'); // end wl-tab

        html.push('</div>'); // end fro
        html.push('</div>'); // end p_relative

        return html.join('');
    },
    /**
     * 获取通讯录信息并渲染面板
     */
    getAddressInfoFromServer: function(account){
        var p = this;
        var userId = account.indexOf('@') ? account.split('@')[0] : account;
        var success = function(data){
            if(data.code == 'S_OK'){
                var d = data['var'];
                if(!p.contactMailCls || (p.contactMailCls && !p.contactMailCls.controls)){
                    p.gotCotactControls();
                }
                if(d){
                    if(p.userPhone){
                        if(d.mobileNumber){
                            p.userPhone = d.mobileNumber;
                        }
                    }
                    else{
                        if(d.mobileNumber){
                            p.userPhone = d.mobileNumber;
                            p.contactMailCls.controls.goMailBtn.after(p.getUserPhoneUI());
                            p.gotCotactControls();
                        }
                    }
                    // 更新用户名称
                    if(d.firstName || d.secondName){
                        p.fromUserName = (d.firstName + d.secondName + '').encodeHTML();
                        p.contactMailCls.controls.namePanel.html(p.fromUserName);
                    }
                    else{
                        p.fromUserName = userId.encodeHTML();
                        p.contactMailCls.controls.namePanel.html(p.fromUserName);
                    }
                    if(d.imagePath){
                        p.contactMailCls.controls.faceLink.find('img').attr('src', d.imagePath);
                    }
                }
            }
        };
        var fail = function(){
            if(!p.contactMailCls || (p.contactMailCls && !p.contactMailCls.controls)){
                p.gotCotactControls();
            }
            if(p.contactMailCls.controls.namePanel){
                p.fromUserName = userId.encodeHTML();
                p.contactMailCls.controls.namePanel.html(p.fromUserName);
            }
        };

        var data = {
            func: 'addr:userQuery',
            data: {rm_userid: userId},
            call: success,
            failCall: fail,
            msg: ''
        };

        parent.MM.mailRequest(data);
    },
    /**
     * 获取往来邮件数据项UI
     * @param config
     * @param data
     * @return {*}
     */
    getContactMailItem: function(config, data){
        var conf = config || {};
        var d = data || {};
        var html = [];
        var cls1 = '', cls2 = '';
        var type = conf.type || 'mail';
        var attachLink = '';

        if(!ContactMailItemType){
            return '';
        }
        if(typeof conf.mode != 'undefined'){
            if(conf.mode == ContactMailItemType.ME){
                cls1 = 'log-l';
                cls2 = 'dia-lt';
            }
            else if(conf.mode == ContactMailItemType.OTHER){
                cls1 = 'log-w';
                cls2 = '';
            }
        }

        html.push('<div class="wl-dialog ' + cls1 + ' mb_5">');
        html.push('<em class="diamond ' + cls2 + '"></em>');
        html.push('<div class="wl-dialog-con">');

        if(type == 'mail'){
            html.push('<div class="dialogcon-til tf"><a class="contact_mail_link" data-mid="' + data.mid + '" href="javascript:void(0)" onclick="return false;">' + (d.subject || '').encodeHTML() + '</a></div>');
            html.push('<div class="dialog-digest">');
            html.push((d.summary || '').encodeHTML());
            html.push('</div>');
        }
        else if(type == 'attach'){
            for(var i=0;i< d.length;i++){
                attachLink = parent.CC.getDownloadLink(d[i].mid, d[i].attachOffset, d[i].attachSize, d[i].attachName, d[i].attachType, d[i].encode);
                if(attachLink.indexOf('http')<0){
                    attachLink = location.protocol + '//' + location.host + attachLink;
                }
                html.push('<div class="dialogcon-til tf"><i class="i-fj mr_5"></i><a href="'+ attachLink +'">' + d[i].attachName.encodeHTML() + '</a></div>');
            }
        }

        html.push('</div>');
        html.push('</div>');

        return html.join('');
    },
    /**
     * 加载往来邮件数据
     */
    loadContactMail: function(from, to){
        if(!from || !to){
            return;
        }
        var p = this;
        var param = {
            order: 'date',
            desc: 1,
            isSearch:1,
            recursive:0,
            start: 1,
            total: 200,
            isFullSearch:0,
            operator: 'and'
        };
        var cond = [];
        cond.push({
            field: 'from',
            operator: 'eq',
            value: from + ';' + to
        });
        cond.push({
            field: 'to',
            operator: 'eq',
            value: to + ';' + from
        });

        param.condictions = cond;
        param.exceptFids = [2,4];
        CC.getContactMail({
            searchParam: param,
            callback: function(d){
                if(d.code == 'S_OK'){
                    p.renderContactMail(p.filterContactMailData(d['var']));
                    p.registerContactMailEvents();
                }
            }
        });
    },
    /**
     * 过滤往来邮件数据
     * @param data
     * @return {Array}
     */
    filterContactMailData: function(data){
        var result = [];
        var len = data.length || 0;
        var d, f, t, c = 1;
        for(var i=0;i<len;i++){
            d = data[i];
            f = parent.Email.getValue(d.from.decodeHTML());
            t = parent.Email.getValue(d.to.decodeHTML());
            if(d.to.decodeHTML().indexOf(f.toString()) == -1 && c < 15)
            {
                result.push(d);
                c++;
            }
        }
        return result;
    },
    /**
     * 加载往来附件
     * @param from
     * @param to
     */
    loadContactAttach: function(from, to){
        if(!from){
            return ;
        }
        var p = this;
        var params = {
            start: 0,
            total: 15,
            order: 'receiveDate',
            isSearch: 1,
            stat: 1,
            fid: 0,
            desc: 1,
            filter: {
                from: from,
                to: to
            }
        };
        var callBack = function(data){
            if(data.code == 'S_OK'){
                var datas = data['var'];
                p.renderContactAttach(datas);
            }
        };

        var data = {
            func: parent.gConst.func.attachList,
            data: params,
            call: callBack,
            msg: ''
        };
        parent.MM.mailRequestApi(data);
    },
    /**
     * 渲染往来邮件
     * @param d
     */
    renderContactMail: function(d){
        var len = d.length;
        var di, cfg, from, to;
        var listHtml = [];
        var doc = this.doc || document;
        if(!this.contactMailCls){
            this.contactMailCls = {};
        }
        this.contactMailCls.datas = d;
        if(!this.contactMailCls.attrs){
            this.contactMailCls.attrs = {};
        }

        if(len){
            for(var i=0;i<len;i++){
                di = d[i];
                cfg = {};
                if(di){
                    from = di.from;
                    to   = di.to;
                    if(from){
                        from = parent.Email.getValue(from);
                    }
                    if(to){
                        to   = parent.Email.getValue(to);
                    }
                    if(from == gMain.userNumber){
                        cfg.mode = ContactMailItemType.ME;
                    }
                    else{
                        cfg.mode = ContactMailItemType.OTHER;
                    }
                    listHtml.push(this.getContactMailItem(cfg, di));
                }
            }
            listHtml.unshift("<div class='wl-area'>");
            listHtml.push("</div>");
            listHtml.push("<div class='ta_c wl-spa'><img align=\"top\" src=\"" + parent.CC.getResourceAbsoluteURL() + "/images/wl-spa.jpg\" width=\"252\" height=\"6\"></div>");
            listHtml.push('<p class="ta_c"><a id="mailContact_view_more" href="#" onclick="return false;">'+top.Lang.Mail.Write.chakangengduo+'</a></p>');//<p class="ta_c"><a id="mailContact_view_more" href="#" onclick="return false;">查看更多</a></p>
        }
        else{
            listHtml.push('<div style="text-align:center;">'+top.Lang.Mail.Write.zanwuwanglaiyoujian+'</div>');//<div style="text-align:center;">暂无往来邮件</div>
        }
        jQuery('#mailContact_mailListContainer', doc).html(listHtml.join(''));
        this.gotCotactControls();
    },
    /**
     * 渲染往来附件
     * @param d
     */
    renderContactAttach: function(d){
        var html = [];
        var group = {};
        var doc = this.doc || document;
        var from, type;
        if(!this.contactMailCls){
            this.contactMailCls = {};
        }
        this.contactMailCls.attachDatas = d;
        if(d && d.length){
            for(var i= 0,l= d.length;i<l;i++){
                if(!group[d[i].mid]){
                    from = d[i].from.decodeHTML();
                    from = parent.Email.getValue(from);
                    if(!from){
                        type = ContactMailItemType.ME;
                    }
                    else{
                        if(from == parent.gMain.userNumber){
                            type = ContactMailItemType.ME;
                        }
                        else{
                            type = ContactMailItemType.OTHER;
                        }
                    }
                    group[d[i].mid] = {
                        len: 0,
                        type: type,
                        data: []
                    };
                }
                group[d[i].mid].len++;
                group[d[i].mid].data.push(d[i]);
            }
            this.contactMailCls.attachGroups = group;
            for(var k in group){
                html.push(this.getContactMailItem({
                    mode: group[k].type,
                    type: 'attach'
                }, group[k].data));
            }
            html.unshift('<div class="wl-area">');
            html.push('</div>');
        }
        else{
            html.push('<div style="text-align:center;">'+top.Lang.Mail.Write.zanwuwanglaifujian+'</div>');//<div style="text-align:center;">暂无往来附件</div>
        }
        jQuery('#mailContact_attachListContainer', doc).html(html.join(''));
    },
    /**
     * 获取往来邮件元素控件
     */
    gotCotactControls: function(){
        if(!this.contactMailCls){
            this.contactMailCls = {};
        }
        var doc = this.doc || document;
        this.contactMailCls.controls = {
            innerPanel: jQuery('#readMail_inner', doc),
            sidePanel: jQuery('#readMail_sidebar', doc),
            mailTab: jQuery('#contact_mail_mail_tab', doc),
            attachTab: jQuery('#contact_mail_attach_tab', doc),
            mailListContainer: jQuery('#mailContact_mailListContainer', doc),
            attachListContainer: jQuery('#mailContact_attachListContainer', doc),
            switchCard: jQuery('#contact_mail_switch', doc),
            faceLink: jQuery('#contact_mail_face_link', doc),
            namePanel: jQuery('#contact_mail_address_name', doc),
            goMailBtn: jQuery('#contact_mail_writeMail', doc),
            goMessageBtn: jQuery('#contact_mail_writeMessage', doc),
            viewMoreLink: jQuery('#mailContact_view_more', doc)
        };
    },
    /**
     * 注册往来邮件事件
     */
    registerContactMailEvents: function(){
        if(!this.contactMailCls){
            return;
        }
        if(!this.contactMailCls.controls){
            return;
        }
        if(!this.contactMailCls.Evts){
            this.contactMailCls.Evts = {};
        }

        var p = this;

        Object.extend(this.contactMailCls.Evts, {
            showPanel: function(){
                p.contactMailCls.controls.sidePanel.show();
                p.contactMailCls.controls.innerPanel.css({
                    'margin-right': '255px'
                });
                p.contactMailCls.controls.switchCard.removeClass('tx-tl').addClass('tx-tr');
                if(jQuery.browser.version == '6.0'){
                    p.contactMailCls.controls.switchCard.css('right','255px');
                }
            },
            hidePanel: function(load){
                p.contactMailCls.controls.innerPanel.css({
                    'margin-right': '0'
                });
                if(load){
                    p.contactMailCls.controls.sidePanel.hide();
                }
                else{
                    p.contactMailCls.controls.sidePanel.hide('normal');
                }
                p.contactMailCls.controls.switchCard.removeClass('tx-tr').addClass('tx-tl');
                if(jQuery.browser.version == '6.0'){
                    p.contactMailCls.controls.switchCard.css('right','0px');
                }
            },
            adjustHeight: function(){
                var calc = function(){
                    var memory = p.contactMailCls.attrs.memory || {};
                    var originalBodyHeight;
                    if(!memory.bodyHeight){
                        return;
                    }
                    else{
                        originalBodyHeight = memory.bodyHeight;
                        clearInterval(listen);
                    }
                    var contentBody = jQuery(p.doc).find('#mailContent');
                    var mailHead = jQuery('#mailhead', p.doc);
                    var reply = jQuery('#readMail_reply', p.doc);
                    var attachThumb = jQuery('#attach_thumb_container', p.doc);
                    p.contactMailCls.controls.sidePanel.css('height', 'inherit');
                    var sideHeight = p.contactMailCls.controls.sidePanel.height();
                    var bodyHeight = originalBodyHeight;
                    var mailHeadHeight = mailHead.height() || 0;
                    var replyHeight = reply.height() || 0;
                    var attachThumbHeight = attachThumb.height() || 0;
                    var mp = [], mpsum = 0;

                    var standardHeight, innerHeight;

                    mp.push(parseInt(mailHead.css('margin-top') || 0));
                    mp.push(parseInt(mailHead.css('margin-bottom') || 0));
                    mp.push(parseInt(mailHead.css('padding-top') || 0));
                    mp.push(parseInt(mailHead.css('padding-bottom') || 0));
                    mp.push(parseInt(reply.css('margin-top') || 0));
                    mp.push(parseInt(reply.css('margin-bottom') || 0));
                    mp.push(parseInt(reply.css('padding-top') || 0));
                    mp.push(parseInt(reply.css('padding-bottom') || 0));

                    for(var i=0;i<mp.length;i++){
                        if(mp[i]){
                            mpsum += mp[i];
                        }
                    }

                    innerHeight = bodyHeight + mpsum + mailHeadHeight + replyHeight + attachThumbHeight;
                    standardHeight = Math.max(sideHeight, innerHeight, 500);

                    p.contactMailCls.controls.sidePanel.height(standardHeight);
                    contentBody.height(standardHeight - mailHeadHeight - replyHeight - attachThumbHeight - mpsum);
                }

                var listen = setInterval(calc, 100);
            },
            slideSwitch: function(e){
                var event = parent.EV.getEvent(e);
                var doc = event.target.documentElement || p.doc;
                var scrollTop = doc.scrollTop || 0;

                p.contactMailCls.controls.switchCard.css({
                    top: (scrollTop + 30) + 'px'
                });
            },
            swrapCard: function(index){
                index = index || 0;
                if(index == 0){
                    p.contactMailCls.controls.attachTab.parent().removeClass('on');
                    p.contactMailCls.controls.mailTab.parent().addClass('on');
                    p.contactMailCls.controls.attachListContainer.hide();
                    p.contactMailCls.controls.mailListContainer.show();
                }
                else{
                    p.contactMailCls.controls.attachTab.parent().addClass('on');
                    p.contactMailCls.controls.mailTab.parent().removeClass('on');
                    p.contactMailCls.controls.attachListContainer.show();
                    p.contactMailCls.controls.mailListContainer.hide();
                }
                p.contactMailCls.Evts.adjustHeight();
            },
            storeUserHabit: function(o){
                parent.CC.writeUserAttributesToServer({contactMailHabit: o});
            },
            readMail: function(mid){
                var mi, param = {}, datas = p.contactMailCls.datas;
                for(var i= 0,l=datas.length;i<l;i++){
                    if(datas[i].mid == mid){
                        mi = datas[i];
                    }
                }
                param.markRead = 0;
                param.isSession = false;
                param.fid = mi.fid;
                param.sessionId = mi.mailSession;
                param.isEncrypt = (mi.secureEncrypt == "1") ? true : false;
                parent.CC.goReadMail(mid, mi.subject, param, mi);
            },
            readMoreMail: function(){
                var conditions = [];
                conditions.push({
                    field : "from",
                    operator : "contains",
                    value : p.fromMailAddr + ';' + p.toMailAddr
                });
                conditions.push({
                    field : "to",
                    operator : "contains",
                    value : p.toMailAddr + ';' + p.fromMailAddr
                });

                parent.CC.advSearchMail(0, conditions, '', 0, null);
            }
        });

        this.contactMailCls.controls.switchCard.unbind('click').bind('click', function(e){
            if(jQuery(this).hasClass('tx-tr')){
                p.contactMailCls.Evts.hidePanel();
                p.contactMailCls.Evts.storeUserHabit('hide');
            }
            else{
                p.contactMailCls.Evts.showPanel();
                p.contactMailCls.Evts.storeUserHabit('show');
            }
            return false;
        });
        this.contactMailCls.controls.mailTab.unbind('click').bind('click', function(e){
            p.contactMailCls.Evts.swrapCard(0);
        });
        this.contactMailCls.controls.attachTab.unbind('click').bind('click', function(e){
            p.contactMailCls.Evts.swrapCard(1);
        });
        this.contactMailCls.controls.sidePanel.find('.contact_mail_link').each(function(i,v){
            jQuery(v).unbind('click').bind('click', function(e){
                p.contactMailCls.Evts.readMail(jQuery(this).attr('data-mid'));
                return false;
            });
        });
        this.contactMailCls.controls.goMailBtn.unbind('click').bind('click', function(e){
            parent.CC.compose(p.from);
            return false;
        });
        this.contactMailCls.controls.viewMoreLink.unbind('click').bind('click', function(e){
            p.contactMailCls.Evts.readMoreMail();
            return false;
        });
        if(p.userPhone){
            this.contactMailCls.controls.goMessageBtn.unbind('click').bind('click', function(e){
                parent.CC.gotoSMS(p.userPhone);
                return false;
            });
        }

        parent.EV.observe(this.doc, 'scroll', this.contactMailCls.Evts.slideSwitch);
        var habit = parent.CC.getUserAttributeFromLocal('contactMailHabit');
        if(habit != ''){
            if(habit == 'hide'){
                p.contactMailCls.Evts.hidePanel(true);
            }
            else if(habit == 'show'){
                p.contactMailCls.Evts.showPanel();
            }
        }
        this.contactMailCls.Evts.adjustHeight();

        if(typeof parent.documentEventManager != 'undefined'){
            parent.documentEventManager.addDoc(this.doc);
        }
    },
    /**
     * 得到附件图片略缩图
     */
    getThumbNailImage : function(mid, attach,denyForward){
        var p = this,
            $ = jQuery,
            len = attach.length;
        imgLen = 0,
            str = "",
            attachUrl = "",
            src = "",
            fileSize = '',
            imgHTML = [];
        html = [];

        //用imgHTML 是为了循环完后得到图片的数量，在format显示
        html.push("<div id=\"attach_thumb_container\" class=\"\"><div class=\"attrAll\">");
        html.push("<span style=\"display:none\" id=\"select_attach\" class=\"fr attrall-title\"></span>");

        //附件图片预览  (共多少个)
        html.push("<span><strong>"+top.Lang.Mail.Write.fujiantupianyulan+"</strong>("+top.Lang.Mail.Write.gong+"<var>{0}</var>"+top.Lang.Mail.Write.ge+")</span></div>");//<span><strong>附件图片预览</strong>(共<var>{0}</var>个)</span></div>

        html.push("<ul class=\"attrList clearfix\">");

        //循环，得到略缩图，并初始化[下载、在线预览、存网盘] 等按钮事件
        for(var i=0; i<len; i++){
            //类型必须是图片
            if (parent.CC.getAttachType(attach[i].fileName, attach[i].fileSize).type == "image") {
                str = location.protocol + '//' + location.host;
                attachUrl= parent.CC.getDownloadLink(mid, attach[i].fileOffSet, attach[i].fileSize, attach[i].fileName,'attach',1,"1");
                attachUrl = attachUrl.indexOf('http') > -1 ? attachUrl : str + attachUrl;
                fileSize = parent.Util.formatSize(attach[i].fileSize, null, 2);

                imgHTML.push("<li class=\"li_preview\">");
                imgHTML.push("<div class=\"imgInfo m_clearfix\">");
                imgHTML.push("<a class=\"imgBox\" href=\"javascript:void(0);\">");

                //图片
                imgHTML.push("<img width=\"58\" height=\"58\" rel=\"\" ");
                if(parent.GC.check('CENTER_PREVIEW')){
                    imgHTML.push("onclick=\'showImg(\"" + p.denyForward + "\",\"" + mid + "\","+i+")\'");
                }
                imgHTML.push(" title=\""+attach[i].fileName+"\" src=\""+attachUrl+"\" class=\"imgLink\" index=\"0\">");

                imgHTML.push("</a><dl class=\"dl_wrapper\"><dt><span title=\"" + attach[i].fileName + "(" + fileSize + ")\" class=\"attrlist-title\">"+attach[i].fileName.toString().left(10, true)+"</span>");
                imgHTML.push("("+fileSize+")</dt><dd>");

                //下载
                imgHTML.push(p.getDownLoadHTML(attachUrl));



                //预览
                //imgHTML.push("<a bh=\"readmail_previewattach1\" target=\"_self\" href=\"javascript:;\" index=\"0\">预览</a>");
                imgHTML.push(p.getOnLineReaderHTML(attach[i], attachUrl, denyForward, mid,i));

                //存网盘
                //imgHTML.push("<a bh=\"readmail_savedisk\" data-id=\"2304207563653ceb00000001_0\" href=\"javascript:;\">存网盘</a>");
                if(p.denyForward != 1 && CC.isDisk()){
                    imgHTML.push(p.getSaveInDiskHTML(mid, attach[i].fileOffSet,attach[i].fileSize,i));
                }
                imgHTML.push("</dd></dl></div></li>");

                //图片数量加1
                imgLen++;
            }
        }

        html.push(imgHTML.join(""));
        html.push("</ul></div>");

        //只有缩略图的数量大于一，才返回缩略图的html
        if(imgLen > 0){
            return html.join("").format(imgLen);
        }

        return "";
    },
    /**
     * 得到邮件状态对应的样式
     * @param {Object} flag 邮件状态对象
     * @param {Object} type 类型 1. 邮件是否有附件，2.邮件优先级，3. 其它属性
     */
    getStatus: function (flag) {
        var listMailType = this.stateFlagArr;
        //普通，定时邮件，已回复已转发，已回复，已转发，新邮件，普通
        flag = flag || {};
        var t = "";
        if (flag.top) {
            t = "<i class='" + ((flag.read) ? "status8" : "status9") + "' title='" + listMailType[7] + "'></i>";
        }
        else if (flag.fixedtime) {
            t = "<i class='status1' title='" + listMailType[1] + "'></i>";
        }
        else if (flag.read) {
            t = "<i class='status5' title='" + listMailType[5] + "'></i>";
        }
        else if (flag["replied"] && flag["forwarded"]) {
            t = "<i class='status2' title='" + listMailType[2] + "'></i>";
        }
        else if (flag.replied) {
            t = "<i class='status3' title='" + listMailType[3] + "'></i>";
        }
        else if (flag.forwarded) {
            t = "<i class='status4' title='" + listMailType[4] + "'></i>";

        }else if( flag.safemail_sign == "1" && flag.safemail_crypt == "1" ){
            t = "<i class='i-redmedal' title='" + top.Lang.Mail.Write.qianmingjiamiyoujian + "'></i>";//签名加密邮件
        }else if( flag.safemail_sign == "1" ){

            t = "<i class='i-graymedal' title='" + top.Lang.Mail.Write.qianmingyoujian + "'></i>";//签名邮件
        }else if( flag.safemail_crypt == "1" ){

            t = "<i class='i-ykey' title='" + top.Lang.Mail.Write.jiamiyoujian + "'></i>";//加密邮件
        }
        else {

            t = "<i class='status6' title='" + listMailType[0] + "'></i>";
        }
        return t;
        /*
         *  (ao.flags.attached?  : '') + '</td>';
         *  (ao.priority < 1 ? '<i class="status7"></i>' : '') + '</td>';
         *  read               Seen        已读
         Recent      未读 (没有read标记)
         scheduleDelivery                标记为定时发送的信
         attached                        有附件
         signed                          有数字签名
         encrypted                       已加密
         replied             Answered    已被回复
         * squotaWarning                 deprecated 容量超过Soft Quota的警告信
         * hquotaWarning                 deprecated 容量超过Hard Quota的警告信
         forwarded                       已被转发
         draft               Draft       草稿
         voice                           语音邮件
         fax                             Fax邮件
         flagged             Flagged     标记
         deleted             Deleted     标记为删除 (以后可通过purge指令真正删除)
         system                          系统邮件
         top                             置顶邮件

         //解锁
         <i class="i-ykey"></i>

         //签名+解锁
         <i class="i-redmedal"></i>

         //签名通过邮件
         <i class="i-graymedal"></i>

         //签名不通过邮件
         <i class="i-mixmedal"></i>


         *
         */
    },
    sessionMailArr: [],

    ckMail: function(index){
        var p = this;
        var datas = p.sessionMails;
        var bz = datas[index];
       
        var fid = bz.fid;
        var mid = bz.mid;
        var sessionId = bz.mailSession;
        var auditStatus = bz.auditStatus;
        var markRead = bz.flags.read ? 1 : 0;
        var unread = (bz.flags && bz.flags.read == "1" ) ? true : false;
        var type = MM.getFolderObject(fid).type;
        var text = CC.getMailText(bz.subject, Lang.Mail.list_ReadingMail);
        //是否是加密邮件
        var isEncrypt = false;     
        //是否是签名邮件
        var isSign = false;
        
        if ( bz.secureEncrypt == "1" || (bz.flags && bz.flags.secureEncrypt == "1") ){
            isEncrypt = true;
        }
        
        if( bz.secureSigned == "1" || (bz.flags && bz.flags.secureSigned == "1") ){
            isSign = true;
        }
 

        var readParam = {
            "markRead": markRead,
            fid: fid,
            "sessionId": sessionId,
            rcptFlag: bz.rcptFlag,
            isSession:   false,
            isEncrypt: isEncrypt,
            unread: unread,
            ignoreCache: true,
            returnHeaders: [ "X-IBC-SecMail"]
        };

        CC.goReadMail(mid, text, readParam, bz);
    },
    getSessionMailHtml: function () {
        var p = this;

        GE.tab.isSession = true;
   


        //sessions 邮件数据
        var ld = p.sessionMails || [];
        var tmpHtml = [];
        var o = gConst.readMail + p.mid;
        var ao = ld[0] || {};
        var date = Util.formatDate(new Date(ao.sendDate * 1000), "yyyy-mm-dd HH:nn:ss");
        var getHtml = function (index, ao, md) {

           

            var html = [];
            var subject = CC.getMailText(ao.subject, Lang.Mail.list_noSubject);
            var summary = CC.getMailText(ao.summary);
            var tipSub = subject;
            
            var strTime = Util.formatDate(new Date(ao.sendDate * 1000), "mm-dd HH:nn");
            var size = ao.size;
            size = Util.formatSize(size, null, 1);
            var flags = ao.flags || {};
            var fid = ao.fid;
            var sessionId = ao.mailSession;
            p.sessionId = sessionId;
            var from = CC.getMailText(ao.from, Lang.Mail.list_nosender);
            var to = CC.getMailText(ao.to, Lang.Mail.list_nosender);
            var mo = MM.getModuleByFid(fid);
            var sendName = Email.getName(ao.from);
            sendName = CC.getMailText(sendName, Lang.Mail.list_nosender);
            var sendUser = Email.getValue(ao.from);
            var isShow = md ? true : false;
            var mid = data.omid;
            var mail = (Email.getValue(ao.from) || '').toLowerCase();
            
            //从页面取得数据
            var alias = (typeof(aliasList) == "undefined" ) ? [] : aliasList; //别名            
            var alilasdomains = (typeof( domains ) == 'undefined' )? [] : domains; //域别名
            var loginDomain = gMain.domain || ''; 
            var mailId = ( gMain.loginId || gMain.mailId || gMain.uid || '').toLowerCase(); 

            //组装的结果集
            var mailIdList = [mailId];
            var allDomains = [loginDomain];
            var allMatchMailList = [];

            //是否是自己
            var isSelf = false;
 
            // 提取登录的mailId 并且 提取别名的mailId ==> mailIdList         
            // 提取登录的域 和 域别名 ==> allDomains
            // 把 mailIdList 和 allDoMains 组装成邮件数组 allMatchMailList， 并小写
            // 最后判断 mail 是否在 allMatchMailList 中， 如果在， isSelf 成立

            if( alias.length){
                for (var i = 0; i < alias.length; i++) {
                    var mailvalue = (  (alias[i].value || '').split("@")[0] ).toLowerCase();
                    
                    mailIdList.push( mailvalue );
                }

            } 

            if( alilasdomains.length ){
                for (var i = 0; i < alilasdomains.length; i++) {
                    var item = alilasdomains[i];
                    allDomains.push(item);
                }
            }

            for (var i = 0; i < mailIdList.length; i++) {
               var mailid = jQuery.trim( mailIdList[i] );

               for (var k = 0; k < allDomains.length; k++) {
                   var dm = jQuery.trim(allDomains[k] || '');
                   var mmail = mailid + "@" + dm;

                   allMatchMailList.push( mmail);
               }
            }

            for (var i = 0; i < allMatchMailList.length; i++) {
                var ai = allMatchMailList[i];

                if( ai == mail ){
                    isSelf = true;
                    break;
                }
            }


 
            html.push('<div class="receive-time">');
                 html.push('    <span>'+strTime+'</span>');
                 html.push('</div>');

             if( !isSelf ){
                html.push('<div class="session-mode-left">');
                <!-- 头像 -->
                 html.push('   <div class="session-mode-photo photo-left">');
                 html.push('       <div class="left-bg">');
                 html.push(             (sendName || '').charAt(0) );
                 html.push('       </div>');
                  html.push('  </div>');
                    <!-- 会话内容 -->
                 html.push('   <div class="session-mode-main">');
                 html.push('      <p class="session-mode-name">');
                // html.push(           '"'+sendName+'"' + ' &lt;'+mail+'\&gt;' );
                 html.push(sendName);
                 html.push('       </p>');
                 html.push('       <div class="session-mode-txt-box">');
                 html.push('           <div class="session-mode-txt">'+summary+'<a href="javascript:;" onclick=MR.ckMail(\''+index +'\')>【'+top.Lang.Mail.Write.chakanyoujianxiangqing+'</a></div>');//\')>【查看邮件详情】</a></div>
                 html.push('           <i class="i-l-arr"></i>');
                 html.push('       </div>');
                 html.push('   </div>');
                 html.push('</div> ');
             }
             else{
         


                 html.push('<div class="session-mode-right">');
                    <!-- 头像 -->
                 html.push('   <div class="session-mode-photo photo-right">');
                 html.push('       <div class="right-bg">');
                 //html.push(            '我' );
                 html.push(             (sendName || '').charAt(0) );
                 html.push('       </div>');
                  html.push('  </div>');
                    <!-- 会话内容 -->
                 html.push('   <div class="session-mode-main">');
                 html.push('      <p class="session-mode-name">');
                 //html.push(           '"'+sendName+'"' + ' &lt;'+mail+'\&gt;' );
                 html.push(sendName);
                 html.push('       </p>');
                 html.push('       <div class="session-mode-txt-box">');
                 html.push('           <div class="session-mode-txt">'+summary+'<a href="javascript:;" onclick=MR.ckMail(\''+index +'\')>【'+top.Lang.Mail.Write.chakanyoujianxiangqing+'</a></div>');//\')>【查看邮件详情】</a></div>
                 html.push('           <i class="i-r-arr"></i>');
                 html.push('       </div>');
                 html.push('   </div>');
                 html.push('</div> ');

                 
             }

             

             

         

            /*html.push('<div class="mailSectionList {0}" style="position: relative; z-index:{1};">'.format(((mail == parent.gMain.userNumber ? "mailSectionListOn" : " ")), (999 - index), index, ao.mid));
            html.push('<div class="mailSectionListTitle clearfix"><h3 class="fl fz_14 talker">' + sendName + '</h3><h3 class="fl fz_14">&lt;' + mail + '&gt;</h3><span class="fr time">' + strTime + '</span></div>');
            html.push('<div class="tips">');

            //折叠起来是显示的标题
            html.push('<div class="tips-text" id="ms_head_{0}" style="{2}" onclick=oSM.showHideSessionMail({0},"{1}");>'.format(index, ao.mid, (isShow ? 'display:none;' : '')));
            html.push('<table class="readMail-simpleTable mailList" width="100%"><tr>');
           
            html.push('<td style="width:50px;" class="from">');
            html.push('<em><span class="readMail-simple-l status">' + p.getStatus(flags) + '</span></em>');
            
            // if (flags.read) {
            // html.push('<i class="i-readMail-file"></i>');
            // } else {
            // html.push('<i class="i-readMail-file"></i>');
            // }

            if (flags.attached) {
                html.push('<em class="icon"><span class="readMail-simple-l status"><i class="status10"></i></span></em>');
            }

            html.push('</td>');
            html.push('<td>' + summary + '</td>');

            //html.push('<td width="60" class="ta_c">'+(flags.starFlag?'<i class="i_starFlag_on" id="FlagTitle_'+index+'" flagval="1" ></i>':'<i id="FlagTitle_'+index+'" class="i_starFlag_off" flagval="0" ></i>')+'</td>');
            html.push('<td width="20" class="ta_c">' + (flags.starFlag ? '<i title="' + Lang.Mail.haveStar + '" class="i_starFlag_on" id="FlagTitle_' + index + '" flagval="1"  onclick=oSM.starFlag(this,"' + ao.mid + '","' + index + '",event)></i>' : '<i id="FlagTitle_' + index + '" title="' + Lang.Mail.noStar + '" class="i_starFlag_off" flagval="0"  onclick=oSM.starFlag(this,"' + ao.mid + '","' + index + '",event)></i>') + '</td>');
            //html.push('<td width="60" class="ta_c">'+(flags.starFlag?'<i class="i-star"></i>':'')+'</td>');
           
            html.push('</tr></table></div>');*/


            //展开式显示的内容
            //会话内容div
            html.push('<div class="tips-text" id="ms_body_{0}" style="{2}" ondblclick="oSM.showHideSessionMail({0},\'{1}\');">'.format(index, mid, (isShow ? '' : 'display:none;"')));
            if (md) {
                html.push(p.getSessionMailContentHtml(index, md));
            }
            html.push('</div>');


            html.push('<div class="-tipsTop -diamond"></div>');

            html.push('</div>');
            html.push('</div>');


            if (index == ld.length - 1) {
                html.push("<br><br>");
            }
            return html.join("");
        };

        //读写mbox:readMessages 接口返回的属性headers:{"auditStatus":0} 0表示已审核？，如何有这个属性，
        //邮件主题前面要标记“待审核”，“已审核”
        if (p.data && p.data.headers) {
            var auditS = p.data.headers["auditStatus"];
        }

        var msg_audit = "";
        //如果移动到普通邮件夹，要变标签的话，再加一个判断，p.fid==13 || p.fid==14
        if (auditS == "3" || auditS == "4") {
            msg_audit = Lang.Mail.Write.audited + "：";
        } else if (auditS == "5" || auditS == "6") {
            msg_audit = Lang.Mail.Write.audited + "：";
        }

        var data = data || CM[o]["var"];
        var fmi = ld[0] || p.mi;
        var subject = CC.getMailText(fmi.subject, Lang.Mail.list_noSubject);

        subject = msg_audit + subject;

        tmpHtml.push('<div class="session-mode-head" style="margin-bottom:24px;">');
        tmpHtml.push('    <div class="session-mode-title">');
        tmpHtml.push(           subject);
        tmpHtml.push('    </div>');
        tmpHtml.push('    <div class="session-mode-state">');
        tmpHtml.push('        <p class="session-mode-time"><label for="">'+top.Lang.Mail.Write.shijian+'</label><span>'+date+'</span></p>');//        <p class="session-mode-time"><label for="">时&nbsp;&nbsp;&nbsp;&nbsp;间：</label><span>
        tmpHtml.push('        <span class="count-mail">'+top.Lang.Mail.Write.gong+ld.length+''+top.Lang.Mail.Write.feng+'</span>');//        <span class="count-mail">共  ||  封</span>
      

       /* tmpHtml.push('<div class="readMail_wrap">');
        tmpHtml.push('<div class="readMail_til"><div class="hTitle"><h2>' + subject + '');*/
       
        //标签邮件 暂时屏蔽
        if (CC.isLabelMail() && false) {
            var html = [];
            html[html.length] = '<div class="tag_div">';
            for (var k = data.label.length; k > 0; k--) {
                var label = MM.getFolderObject(data.label[k - 1]);
                if(label){
                    html[html.length] = '<a href="javascript:void(0);" data-lid="' + label.fid + '" data-mid="' + data.mid + '" class="' + gConst.labelColor[label.folderColor] + ' tag_squ ml_5"><span>';
                    html[html.length] = label.name;
                    html[html.length] = '</span><i></i></a>';
                }
            }
            html[html.length] = '</div>';
            tmpHtml.push(html.join(""));
        }

        tmpHtml.push('</h2></div></div>');
        tmpHtml.push('<div class="mailSection">');
        
       // tmpHtml.push(getHtml(0, fmi, data));

        //显示会话信息
        for (var j = 0; j < ld.length; j++) {
            tmpHtml.push(getHtml(j, ld[j]));
        }
        tmpHtml.push('</div>');
        tmpHtml.push('</div>');
        return tmpHtml.join("");
    },
    getSessionMailContentHtml: function (index, data, isAddTop) {
        var p = this;
        var subject = CC.getMailText(data.subject, Lang.Mail.list_noSubject);
        var from = CC.getMailText(data.account);
        var date = Util.formatDate(new Date(data.sendDate * 1000), "yyyy-mm-dd HH:nn:ss");
        //var strTime = p.getDate(date);
        var strTime = date;
        //Util.formatDate(date, "WW,MM dd,yyyy hh:nn")
        var to = CC.getMailText(data.to);
        var toName = Email.getName(data.to);
        var cc = CC.getMailText(data.cc);
        var bc = CC.getMailText(data.bcc);
        var attach = data.attachments || [];
        var sendUser = Email.getValue(data.account) || "";
        var sendName = Email.getName(data.account) || data.account;
        sendName = CC.getMailText(sendName, Lang.Mail.list_nosender);
        var mailContent = CC.getMailContent(data);
        var mid = data.omid;
        var html = [];
        var flags = data.flag;
        var strEvent = "oSM";
        var denyForward = data.denyForward || 0;
        var sendWay = data.sendWay || 0;
        p.sendName = sendName;

        this.to = to;
        this.cc = cc;
        this.sessionMail[mid] = {};
        this.sessionMail[mid] = data;

        if (sendWay === 4 && data["meetingInfo"]) {
            mailContent = p.getMeetingHtml(data, mailContent);
        }

        //邮箱抬头
        html.push('<div class="mailSectionTitle p_relative" id="ms_head_{0}" >'.format(index));
        html.push('<div class="rMList"><span class="rMl">{0}</span><div class="rMr"><span >{1}</span></div></div>'.format(Lang.Mail.readMail_lb_subject, subject));
        html.push('<div class="rMList"><span class="rMl">{0}</span><div class="rMr"><span id="{2}to">{1}</span></div></div>'.format(Lang.Mail.readMail_lb_to, p.showMore(mid, 'to', -1), mid))
        if (cc) {
            html.push('<div class="rMList" id="ms_head_disp_cc_{0}"><span class="rMl">{1}</span><div class="rMr"><span class="fl">{2}</span></div></div>'.format(index, Lang.Mail.readMail_lb_cc, p.showMore(mid, 'cc', -1)))
        }
        //html.push(p.getAttachHtml(index,attach));
        html.push(p.getAttachHtml(mid, attach, {denyForward: denyForward}));
        html.push(p.getRemarkHtml(strEvent, mid, index, flags));
        html.push(p.getActionHtml(strEvent, index, data, false));
        //安全邮箱 签名 加密标示
        if(CC.isSecurityMail()){
            html.push(p.getSecurityMailHtml(data));
        }

        html.push('</div>');

        //内容
        html.push('<div class="mailText p_relative">');
        html.push('<div class="pl_5 pr_5 c_666">');
        this.mailContent = mailContent;
        //html.push(mailContent);

        html.push("<iframe frameborder=\"0\" allowtransparency=\"true\" style=\"background-color=transparent\"  scrolling=\"no\" id='mailContent_" + mid + "' name='mailContent_" + mid + "' onload='oSM.contentOnload(\"" + mid + "\", \"" + denyForward + "\")' width='100%' src='" + gMain.webPath + "/static/se/mail/blank.htm'></iframe>");
        html.push('</div>');
        html.push("</div>");

        html.push('<div class="read_mail_reply">');
        html.push('<p class="mailSectionOperate">');

        // 判断是否自己是发件人 by Zengyi
        var isUser = parent.gMain.loginName && parent.gMain.loginName === sendUser;
        if (!isUser) {
            //如果有附件，又有带附件回复权限
            if (attach.length > 0 ) {
                //html.push('<a class="fl" href="javascript:void(0)"   onclick="MR.showAttachReMenu(this,' + index + ',\'' + mid + '\',event,0,document);">' + Lang.Mail.tb_Reply + '<i class="i_triangle_d" ></i></a><span class="line fl">|</span>');
                html.push('<span style="position:static;' + (isAddTop ? "_margin-top:10px;" : "") + '" class="sessionMailTool_span fl"><a class="sessionMailTool" href="javascript:fGoto();" onclick="MR.showAttachReMenu(this,' + index + ',\'' + mid + '\',event,0,document);" ><span><span>' + Lang.Mail.tb_Reply + '<i></i></span></span></a></span><span class="line fl">|</span>');
            }
            else {
                html.push('<a class="fl" href="javascript:void(0)" onclick=MR.doMenu(null,\'REPLY\',null,"' + mid + '")>' + Lang.Mail.tb_Reply + '</a><span class="line fl">|</span>');
            }
            //有附件，有带附件回复所有权限
            if (attach.length > 0) {
                //html.push('<a class="fl" href="javascript:void(0)"  onclick="MR.showAttachReMenu(this,' + index + ',\'' + mid + '\',event,1,document);">'+Lang.Mail.tb_ReplyAll+'<i class="i_triangle_d" ></i></a><span class="line fl">|</span>');
                html.push('<span style="position:static;' + (isAddTop ? "_margin-top:10px;" : "") + '" class="sessionMailTool_span fl"><a class="sessionMailTool" href="javascript:fGoto();" onclick="MR.showAttachReMenu(this,' + index + ',\'' + mid + '\',event,1,document);" ><span><span>' + Lang.Mail.tb_ReplyAll + '<i></i></span></span></a></span><span class="line fl">|</span>');
            }
            else {
                html.push('<a class="fl" href="javascript:void(0)" onclick=MR.doMenu(null,\'REPLYALL\',null,"' + mid + '")>' + Lang.Mail.tb_ReplyAll + '</a><span class="line fl ">|</span>');
            }
        }
        if ((!denyForward)) {
            html.push('<a class="fl" href="javascript:void(0)" onclick=MR.doMenu(null,\'FORWARD\',null,"' + mid + '")>' + Lang.Mail.tb_Forward + '</a><span class="line fl">|</span>');
        }
        if (GC.check("MAIL_INBOX_DELETE")) {
            html.push('<a class="fl" href="javascript:void(0)" onclick=MR.del("' + mid + '") >' + Lang.Mail.tb_Delete + '</a>');
        }
        if (sendWay != 2 && sendWay != 3 || !CC.isSessionMode()) {
            html.push('<span class="line fl">|</span><span  style="position:static;' + (isAddTop ? "_margin-top:10px;" : "") + '" class="sessionMailTool_span fl"><a class="sessionMailTool" href="javascript:fGoto();" onclick="MR.showMoreMenu(this,' + index + ',\'' + mid + '\',event,document);"><span><span>' + Lang.Mail.tb_more + '<i></i></span></span></a></span>');
        }
        //html.push('<span><a href="javascript:void(0)"  onclick="MR.showMoreMenu(this,'+index+',\''+mid+'\',event,document);">'+Lang.Mail.tb_more+'<i class="i_triangle_d" ></i></a></span>');
        html.push('</p>');
        html.push('</div>');
        return html.join("");
    },
    getFileType: function (filename) {
        filename = filename.toLowerCase();
        var ico = "other";
        var icoClass = ["other", "tif", "txt", "psd", "rar", "zip", "xml", "html", "java", "fon", "jpg", "gif", "png", "bmp", "tiff", "mpeg", "avi", "wmv", "mov", "mpg", "vob", "rmvb", "mp3", "wma", "wav", "asf", "mp4", "sis", "sisx", "cab", "doc", "docx", "pdf", "xls", "xlsx", "ppt", "pptx", "swf", "fla", "share", "folder", "mp3-hover", "upload", "i-hand", "flv", "folder-m", "folder-p", "exe", "css", "rm", "midi", "chm", "iso", "vsd", "no-load"];
        for (var i = 0; i < icoClass.length; i++) {
            if (filename.indexOf(icoClass[i]) >= 0) {
                ico = icoClass[i];
                break;
            }
        }
        return ico;
    },
    getDate: function (date) {
        if (gMain.lang == "en_US") {
            return Util.formatDate(date, top.Lang.Mail.Write.nianyuerizhou);//2012年2月13日(周四) 16：00 ,不支持多语言//yyyy年mm月dd日(周ww) hh:nn
        } else {
            return Util.formatDate(date, "WW,MM dd,yyyy hh:nn");
        }
    },
    /**
     * 获取安全邮件标识头
     * @param {Object} data 邮件数据对象
     */
    getSecurityMailHtml : function(data){

        /**
         * 已验签名 签名验证未通过  数字加密邮件
         //加密
         <i class="i-ykey"></i>

         //签名+加密
         <i class="i-redmedal"></i>

         //签名邮件 (已经通过)
         <i class="i-graymedal"></i>

         //签名不通过邮件
         <i class="i-mixmedal"></i>

         */
        var html = [];
        if( typeof data.flag == "object" &&( data.flag.safemail_sign == "1"
            || data.flag.safemail_crypt == "1" || data.flag.safemail_sign == -1
            || data.flag.safemail_crypt == -1
            ||  data.flag.secureSigned == -1
            || data.flag.secureEncrypt == -1
            || data.flag.secureSigned == 1
            ||data.flag.secureEncrypt == 1 )){
            html.push('<div class="rMList">');
            html.push('<span class="rMl">'+top.Lang.Mail.Write.anquan+'</span>');//<span class="rMl">安&nbsp;&nbsp; 全：</span>

            var spanstart = '<strong class="mb_ept">',
                spanend = '</strong>';

            var isSign = false, isCrypt = false;

            //先放小图片
            //<strong class="mb_ept"><i class="i-graymedal mr_5"></i><span>导出</span>
            if( data.flag.safemail_sign == 1 || data.flag.secureSigned == 1 ){
                //签名通过
                html.push( spanstart );
                html.push('<i class="i-graymedal mr_5"></i>');
                html.push('<span class="col_green">'+top.Lang.Mail.Write.yanzhengqianmingtongguo+'</span>');//<span class="col_green">验证签名通过</span>
                html.push(spanend);
                isSign = true;
            }

            if( data.flag.safemail_sign == -1 || data.flag.secureSigned == -1 ){
                //签名不通过
                html.push( spanstart );
                html.push('<i class="i-mixmedal mr_5"></i>');
                html.push('<span class="col_red">'+top.Lang.Mail.Write.qianmingyanzhengweitongguo+'</span>');//<span class="col_red">签名验证未通过</span>
                html.push(spanend);

                isSign = -1;
            }

            if( data.flag.safemail_crypt == 1 || data.flag.secureEncrypt == 1 ){
                //解密通过
                html.push( spanstart );
                html.push('<i class="i-ykey mr_5"></i>');
                html.push('<span class="col_green">'+top.Lang.Mail.Write.shuzijiamiyoujian+'</span>');//<span class="col_green">数字加密邮件</span>
                html.push(spanend);

                isCrypt = true;
            }

            if( data.flag.safemail_crypt == -1 ||  data.flag.secureEncrypt == -1 ){
                //解密不通过
                html.push( spanstart );
                html.push('<i class="i-notPassed mr_5"></i>');
                html.push('<span class="col_red">'+top.Lang.Mail.Write.jiemishibai+'</span>');//<span class="col_red">解密失败</span>
                html.push(spanend);

                isCrypt = -1;
            }
            html.push('</strong>');
            html.push('</div>');
        }
        return html.join('');
    },
    /**
     * 获取附件头信息
     * @param {Object} index 会话邮箱伯索引，或普通邮件的mid
     * @param {Object} attach
     * @param {Object} attrs 额外信息
     */
    getAttachHtml: function (index, attach, attrs) {
        var p = this;
        var html = [];
        var denyForward = attrs.denyForward || 0;
        p.denyForward = denyForward;
        if (attach.length <= 0)
            return;
        if (!this.attachImgList[index]){
            this.attachImgList[index] = [];
        }
        html.push("<div class=\"rMList\" id='attach_{0}'>".format(index));
        html.push("<span class=\"rMl\" " + (attach.length == 1 ? "style=padding-top:3px" : "") + ">" + p.getLang(Lang.Mail.readMail_lb_attach, top.Lang.Mail.Write.fujian) + "</span>")//附　件：
        html.push("<div class=\"rMr\">");
        var ft = null, link = null;

        //附件数量大于一个
        if (attach.length > 1) {
            if (!denyForward) {
                html.push(attach.length + top.Lang.Mail.Write.ge +"&nbsp;&nbsp;&nbsp;<a  href=\""+ CC.getDownloadsLink(index) + "\"  class='download_link' style='padding-left:5px'>" + Lang.Mail.readmail_attach_downloadall + "</a>");//个&nbsp;&nbsp;&nbsp;<a  href=\"
            }
            html.push("</div>");
            html.push('<div class="download-wrap">');
            for (var i = 0; i < attach.length; i++) {
                ft = Util.getFileClasssName(attach[i].fileName);
                link = CC.getDownloadLink(index, attach[i].fileOffSet, attach[i].fileSize, attach[i].fileName, attach[i].type, attach[i].encoding);
                if (CC.getAttachType(attach[i].fileName, attach[i].fileSize).type == "image") {
                    this.attachImgList[index].push({"imgUrl": "",
                        "fileName": attach[i].fileName,
                        "downLoad": link});
                }
                else{
                    this.attachImgList[index].push({});
                }

                html.push('<div class="download-div">');
                html.push('<i class="' + ft + '"></i>');
                html.push('<span class="download-fileName">' + attach[i].fileName.encodeHTML() + '&nbsp;&nbsp;'+Util.formatSize(attach[i].fileRealSize, null, 2)+'</span>');
                if (!denyForward) {
                    html.push('<a href="' + link + '"  class="readmail_download" style="padding-right:5px">' + Lang.Mail.readMail_download + '</a>');
                }
                html.push(p.getOnLineReaderHTML(attach[i], link, denyForward, index,i));
                //如果不是oa邮箱，出现增加到网盘， 后续要判断是否有网盘
                if (!CC.isOA() && CC.isDisk() && denyForward != 1) {
                    html.push("<a href=\"javascript:void(0);\"  class=\"readmail_download\" onclick=\"oSM.saveInDisk('" + p.mid + "','" + attach[i].fileOffSet + "','" + attach[i].fileSize + "','" + i + "')\">"+top.Lang.Mail.Write.cunwangpan+"</a>");//')\">存网盘</a>
                }
                html.push('</div>');
            }
        }
        else {
            ft = Util.getFileClasssName(attach[0].fileName);


            link = CC.getDownloadLink(index, attach[0].fileOffSet, attach[0].fileSize, attach[0].fileName, attach[0].type, attach[0].encoding);
            html.push('<div class="download-div">');
            html.push('<i class="' + ft + '"></i>')
            html.push('<span class="download-fileName">' + attach[0].fileName.encodeHTML() + '&nbsp;&nbsp;'+Util.formatSize(attach[0].fileRealSize, null, 2)+ '</span>');
            if (!denyForward) {
                //[下载]
                html.push(p.getDownLoadHTML(link));
            }

            //如果附件是图片，用一个数组保存这些图片的信息， 图片名称，下载地址
            if (CC.getAttachType(attach[0].fileName, attach[0].fileSize).type == "image") {
                this.attachImgList[index].push({"imgUrl": "",
                    "fileName": attach[0].fileName,
                    "downLoad": link});
            }
            else{
                this.attachImgList[index].push({});
            }
            //[在线预览]
            html.push(p.getOnLineReaderHTML(attach[0], link, denyForward, index,0));

            //如果不是oa邮箱，而且有云网盘，出现                [存网盘]
            if(!CC.isOA() && CC.isDisk() && denyForward != 1){
                html.push(p.getSaveInDiskHTML(p.mid, attach[0].fileOffSet, attach[0].fileSize, 0));
            }
            html.push('</div>');
        }

        html.push('</div>');
        html.push('</div>');
        return html.join("");
    },
    saveInDisk : function(mid,attachOffset,attachSize,index){
        if(MM["attachList"].showNDFSelector){
            MM["attachList"].showNDFSelector(mid,attachOffset,attachSize,index);
        }else{
            var attach = new AttachList();
            attach.showNDFSelector(mid,attachOffset,attachSize,index);
        }
    },


    /**
     * 得到[下载] 按钮的html
     * @param {Object} link
     */
    getDownLoadHTML : function(link){
        var p = this,
            html = [];

        html.push('<a href="' + link + '" class="readmail_download" style="padding-right:5px">' + Lang.Mail.readMail_download + '</a>');

        return html.join("");
    },

    /**
     * 得到[存网盘] 按钮的html
     * @param {Object} mid
     * @param {Object} fileOffSet
     * @param {Object} fileSize
     * @param {Object} fileName
     */
    getSaveInDiskHTML : function(mid, fileOffSet,fileSize,fileName){
        var p = this,
            html = [];

        html.push("<a href=\"javascript:void(0);\" class=\"readmail_download\" style=\"padding-left:5px\"   onclick=\"oSM.saveInDisk('"+mid+"','"+fileOffSet+"','"+fileSize+"','"+fileName+"')\">"+top.Lang.Mail.Write.cunwangpan+"</a>");//')\">存网盘</a>

        return html.join("");
    },
    /**
     * 得到[在线预览] 按钮的html
     * @param {Object} attachObj
     * @param {Object} link             链接地址
     * @param {Object} denyForward      禁止转发
     * @param {Object} index
     */
    getOnLineReaderHTML: function (attachObj, link, denyForward, index,attachIndex) {
        //有预览的权限，而且该附件大小必须<最大的预览大小
        if (!GC.check('CENTER_PREVIEW') || parseInt(parent.gMain.attachPreivewMaxSize) < attachObj.fileRealSize) return "";
        var p = this;
        if (link.indexOf("http") != 0) {
            link = location.protocol + "//" + location.host + link;
        }
        var oAttacheType = CC.getAttachType(attachObj.fileName, attachObj.fileSize) ||
        {
            isView: false,
            type: ''
        };//附件类型（是否可预览，附件扩展名对应的样式名称）
        var viewLink = '';
        if (oAttacheType.isView) {
            //附件预览
            var vLink = CC.getViewLink(gMain.webPath || 'http://view.se139.com', 'cmail', gMain.sid, link, gMain.loginName, attachObj.fileName, attachObj.fileRealSize, gMain.mailId, attachObj.fileId, denyForward);
            if (oAttacheType.type == "image")
                viewLink = "<a href='javascript:void(0)' class=\"download-fileName\" onclick='showImg(\"" + denyForward + "\",\"" + index + "\","+attachIndex+")' >" + p.getLang(Lang.Mail.readMail_lb_viewAttach, Lang.Mail.onlineLook) + "</a>";
            //viewLink = "<a  class=\"download-fileName\" onclick='alert(1)' >" +  p.getLang(Lang.Mail.readMail_lb_viewAttach, "在线预览") + "</a>";
            else
                viewLink = "<a target=\"_blank\" class=\"download-fileName\" href=\"" + vLink + "\" {0} >" + (oAttacheType.type == 'zip' ? p.getLang(Lang.Mail.readMail_lb_OpenZip, Lang.Mail.open) : p.getLang(Lang.Mail.readMail_lb_viewAttach, Lang.Mail.onlineLook)) + "</a>";

        }
        return viewLink;
    },
    /**
     * 获取附件列表html
     * @param {String} index 会话邮箱伯索引，或普通邮件的mid
     * @param {Object} attach 附件列表对象
     */
    getAttachListHtml: function (index, attach) {
        var mid = this.mid;
        attach = attach || [];
        var html = [];
        var an = "", size = 0, link = "", at = "", html = [], temp = "";
        /*if (attach.length > 1) {
         html.push('<p><a href="{0}" id="packDownload_{1}" style="cursor:pointer;" target="_blank">[{2}]</a></p>'.format(CC.getDownloadsLink(mid),mid,Lang.Mail.readMail_lb_bt_PackMail));
         }*/
        if (attach && attach.length > 0) {
            var countAttach = Lang.Mail.readmail_attach_listcount.format(attach.length)
            html.push("<div class=\"attrBody\" id=\"ordinaryAttchList\">");
            html.push("<div class=\"attrAll\" name='attachList'><span><strong>" + Lang.Mail.readmail_attach_common + "</strong>" + countAttach + "</span>");
            if (attach.length > 1) {
                html.push("<a  href=\"" + CC.getDownloadsLink(mid) + "\"  class='download_link' >" + Lang.Mail.readmail_attach_downloadall + "</a>");
            }
            html.push("</div>");
            html.push("<ul  class=\"attrList m_clearfix\">");
            for (var j = 0; j < attach.length; j++) {
                link = CC.getDownloadLink(mid, attach[j].fileOffSet, attach[j].fileSize, attach[j].fileName, attach[j].type, attach[j].encoding);
                html.push("<li><div class=\"imgInfo imgInfo_noBank m_clearfix\" onMouseOut='oSM.showAttchBoder(this,\"out\")' onMouseOver='oSM.showAttchBoder(this,\"over\")'>");
                html.push("<a class='imgBox'><i class='big_" + Util.getFileClasssName(attach[j].fileName) + "'></i></a>");
                html.push("<dl class=\"dl_wrapper\">");
                var fileSize = Util.formatSize(attach[j].fileRealSize, null, 2);
                html.push("<dt title='" + attach[j].fileName + "(" + fileSize + ")'>" + attach[j].fileName + "<span class=\"col666\">(" + fileSize + ")</span></dt>");
                html.push("<dd><a href=\"" + link + "\" class='download_link' >" + Lang.Mail.readMail_download + "</a></dd>");
                html.push("</dl></div></li>")
            }
            html.push("</ul>");
            html.push("</div>");
        }
        html.push("<a id=\"attchList_{0}\" >".format(index) + "</a>");
        return html.join("");
        /* for (var ia = 0;ia < attach.length; ia++) {
         var aa = attach[ia];
         size = aa.fileRealSize;
         size = Util.formatSize(size,null,2);
         an = aa.fileName || "";
         an = an.encodeHTML();

         at = CC.getAttachType(aa.fileName, aa.fileSize) || {isView: false,type: '',className:""};
         temp = '<a href="{0}" {1} ><i class="{5}"></i>{2}(<span title="{3} Byte">{3}</span>)</a><a href="{0}" {1} >{4}</a>';
         temp = temp.format(link,"", an,size,Lang.Mail.readMail_download,at.className);
         html.push('<p>');
         html.push(temp);
         //附件类型（是否可预览，附件扩展名对应的样式名称）
         if (at.isView) {
         //附件预览
         var vLink = CC.getViewLink(gMain.viewServer || '', 'cmail', gMain.sid, aLink, gMain.userNumber, aa.fileName, aa.fileRealSize, p.mid);
         viewLink = "<a target=\"_blank\" href=\"" + vLink + "\" {0} >" + (oAttacheType.type == 'zip' ? p.getLang(Lang.Mail.readMail_lb_OpenZip, "打开") : p.getLang(Lang.Mail.readMail_lb_viewAttach, "在线预览")) + "</a>";
         }
         html.push('</p>');
         }*/
        return html.join("");
    },
    getRemarkHtml: function (strEvent, mid, index, flags) {
        var html = [];
        var isMark = (flags.memoFlag == 1);

        html.push('<div  id="ms_remark_{0}" {1}>'.format(index, isMark ? '' : 'style="display:none"'));
        html.push('<div class="readMail_line"></div>')
        html.push('<div class="rMList">');
        html.push('<span class="rMl">{0}</span>'.format(Lang.Mail.remark));
        html.push('<div class="rMr">');

        html.push('<div class="remarkTips shadow remark_bg"  id="remarkread_{0}" style="display:none;">'.format(index));
        html.push('<p onclick=\"{0}.editRemark(\'{1}\',\'{2}\')\" id="remarkContent_{2}"></p>'.format(strEvent, mid, index));
        html.push('<div class="remarkTips-title clearfix pt_5"><span><a href="javascript:;" onclick="{0}.editRemark(\'{1}\',\'{2}\')">{3}</a> '.format(strEvent, mid, index, Lang.Mail.remarkEdit));
        html.push('<a href="javascript:;" onclick="{0}.delRemark(\'{1}\',\'{2}\')">{3}</a></span></div>'.format(strEvent, mid, index, Lang.Mail.deleteRemark));
        html.push('</div>');

        //填写备注框
        html.push('<div class="remarkModify"  id="remarkwrite_{0}" style="display:none">'.format(index));
        html.push('<div class="w495 textarea_wrapper">');
        html.push('<textarea max id="remarktext_' + index + '" onblur=oSM.clearRemarkBlank(this,\"' + mid + '\") onkeyup=oSM.getRemarkWriteNum(this,\"' + mid + '\")  class="remark_textarea"></textarea>');
        html.push('</div>');
        html.push('<div style="margin-left:4px;margin-top:5px;">');
        html.push("<a class='n_btn_on mr_10' ck=\"save\" onclick=\"" + strEvent + ".saveRemark('" + mid + "','" + index + "');\"><span><span>" + Lang.Mail.saveRemark + "</span></span></a><a class=\"n_btn\" ck=\"cancel\" id=\"remarkdel_" + index + "\" style=\"cursor:pointer\" onclick=" + strEvent + ".hideRemark('" + mid + "','" + index + "');><span><span>" + Lang.Mail.cancelRemark + "</span></span></a>")
        html.push("<span class=\"write_num\">" + Lang.Mail.hkinput + "<var id='remarkWriteNum_" + mid + "'>50</var>" + Lang.Mail.font + "</span>");
        html.push('</div>');
        html.push('</div>');

        html.push('</div>');
        html.push('</div>');

        html.push('</div>');


        return html.join("");
    },
    //获取操作按钮的html方法
    getActionHtml: function (strEvent, index, data, isShow) {
        var html = [];
        var mid = data.omid;
        var flags = data.flag;
        var sendWay = data.sendWay || 0;
        isShow = isShow || false;
        html.push("<span class=\"readmialTool\">");
        html.push("<a href='javascript:;' flagval=" + (flags.starFlag ? flags.starFlag : 0) + "  title='" + (flags.starFlag == 1 ? Lang.Mail.haveStar : Lang.Mail.noStar) + "'><i onclick=" + strEvent + ".starFlag(this,'" + mid + "','" + index + "') id='StarFlag" + index + "' flagval=" + (flags.starFlag ? flags.starFlag : 0) + "  class=\"" + (flags.starFlag == 1 ? "i_starFlag_on" : "i_starFlag_off") + "\"></i></a>  | ");
        if (sendWay != 2 && sendWay != 3) {
            html.push("<a href='javascript:;' onclick=" + strEvent + ".newOpen('" + mid + "') title='" + Lang.Mail.readMail_lb_newwindow + "'  ><i class=\"i_2win\"></i></a> | ");
        }
        html.push("<a href='javascript:;' onclick=" + strEvent + ".showRemark('" + index + "'); flagval='" + (flags.memoFlag ? flags.memoFlag : 0) + "' id='remarkon_" + index + "'  ck=\"toggle\" title='" + (flags.memoFlag == 1 ? Lang.Mail.haveRemark : Lang.Mail.noRemark) + "'><i id='memoFlag_" + index + "'  flagval='" + (flags.memoFlag ? flags.memoFlag : 0) + "'  class='" + (flags.memoFlag == 1 ? 'i_note_on' : 'i_note_off') + "' ></i></a>");
        if (sendWay != 2 && sendWay != 3) {
            html.push(" | <a href='javascript:;' onclick=MR.printMail('" + mid + "') title='" + Lang.Mail.tb_Print + "'><i class=\"i_alarm\"></i></a> ");
        }
        //html.push("<a href='javascript:;' onclick=\""+strEvent+".showHideTitle('"+index+"')\" title='"+Lang.Mail.readMail_showDetail+"' id=\"ms_action_sh_"+index+"\"><i class=\""+(isShow?"i_2trid_down":"i_2trid_up")+"\"></i></a>);
        html.push("</span>");
        html.push(TaskMail.getReadIconHtml(data, true));
        return html.join("");

    },
    /**获取快速回复html代码 */
    getQuickReplyHtml: function (strEvent, index, mid) {
        var html = [];
        //if (parent.GC.check("MAIL_READ_REPLY")) {
        html.push("<div class=\"mlr10\" id='replyId_{0}' >".format(index));
        html.push("<div class='textarea_wrapper' style='padding:0 5px;'><input onclick=\"{0}.focusQuickReply('{1}','{2}')\" class=\"readMail_reply_txt\" type=\"text\" value=\"{3}\"/></div>".format(strEvent, index, mid, Lang.Mail.readMail_textarea_text));
        html.push("</div>");
        //}
        return html.join("");
    },
    /**获取聚焦后的html代码 */
    getFocusQuickReply: function (index, mid) {
        var html = [];
        var tid = 'textContent_' + index;
        html.push("<p><a href='javascript:;' onclick=\"MR.goCompose('" + gConst.func.replyAll + "','" + mid + "' , '" + Lang.Mail.tb_ReplyAll + "');\">" + Lang.Mail.readmail_Switchmode + "</a></p>");
        html.push("<div class=\"textarea_wrapper height_remark\" style='position:relative;'><textarea style='height:80px' class=\"readMail_reply_textarea\" id='" + tid + "'></textarea></div>");
        html.push("<div><a class=\"n_btn_on mt_5 mb_15\" href=\"javascript:void(0)\"><span><span onclick=\"sendReply(document.getElementById('{0}'),'{2}');\" >{1}</span></span></a></div>".format(tid, Lang.Mail.readMail_lb_bt_send, mid));

        return html.join("");
    },
    showSessionMailContent: function (index, cb) {
        var p = this;
        var objHead = $("ms_head" + index);
        var objBody = $("ms_body_" + index);

        var func = gConst.func.readMail;
        var param = p.sessionMails[index];
        var markRead = param.flags.read ? 1 : 0;
        var mid = param.mid;
        var callBack = function (au) {
            var data = au["var"];
            CM["readMail" + mid] = au;
            //为了解决IE6下更多按钮的位置不正确加参数判断
            var html = p.getSessionMailContentHtml(index, data, true);
            cb(html, mid);
        };


        var data = {
            func: func,
            data: {
                mode: "both",
                filterStylesheets: 0,
                filterImages: 0,
                filterLinks: 0,
                supportTNEF: 0,
                fileterScripts: 1,
                filterFrames: 1,
                markRead: markRead,
                encoding: parent.gConst.encode_utf8,
                mid: mid,
                fid: param.fid
            },
            call: callBack
        };
        MM.mailRequestApi(data);
    },
    /**
     * 检查邮件撤回收件人，密送人，抄送人域名是否本域
     * @param {Array} v 收件人，密送人，抄送人数组
     */
    checkDomain: function (v) {
        var isDisplayRecallMail = false;
        for (var i = 0; i < v.length; i++) {
            var tItem = v[i].split(",");
            for (var j = 0; j < tItem.length; j++) {
                var domaintemp = Email.getValue(tItem[j]);
                if (domaintemp) {
                    domaintemp = domaintemp.substr(domaintemp.indexOf("@") + 1);
                    if (gMain.domain == domaintemp) {
                        isDisplayRecallMail = true;
                        return isDisplayRecallMail;
                        break;
                    }
                }
            }
        }
        return isDisplayRecallMail;
    },
    showMDSHtml: function (data, strEvent) { //显示邮件撤回HTML
        var p = this;
        var html = [];


        var toList = [];
        if (data.to)
            toList.push(data.to);
        if (data.cc)
            toList.push(data.cc);
        if (data.bcc)
            toList.push(data.bcc);


        //如果收件人中存在本域名的帐号 并且 FID 等于3 投递状态 不等于5和4的情况
        if (p.fid == 3 && (p.rcptFlag != 5 && p.rcptFlag != 4)) {
            p.recallok=data.flag.recallok ;
            if (data.flag.recallok == 1 || data.flag.recallok ==2) //已撤回或者部分撤回
            {
                html.push("<span id=\"recallMsg{0}\" style=\"padding-left:10px;font-weight:normal;\">".format(p.mid));
                html.push("<span style=\"color:#BFBFBF;font-size:12px;\">[" + p.getLang(Lang.Mail.recalled, Lang.Mail.RecallMessage_RecallOK) + "]</span>");
                html.push("</span>");
            }
            else if(Util.DateDiff(new Date(), p.date) < (gMain.recallTime || 24) && data.flag.recall == 1)
            { //如果是发件箱与没有超过24小时的邮件才能使用回撤功能
                html.push("<span id=\"recallMsg{0}\" style=\"padding-left:10px;font-weight:normal;\">".format(p.mid));
                html.push("<a id=\"aRecallMail\" style=\"display:none\" onclick=\"MR.showRecallMessageFrm()\" href=\"javascript:;\">[" + p.getLang(Lang.Mail.recallMail, Lang.Mail.RecallMessage_RecallMail) + "]</a>");
                html.push("</span>");
            }
            else{
                html.push("<span id=\"recallMsg{0}\" style=\"padding-left:10px;font-weight:normal;\">".format(p.mid));
                html.push("</span>");
            }

        }

        return html.join("");
    },
    showDSHtml: function (strEvent) {
        var p = this;
        var mid = p.mid;
        var html = [];

        if (p.fid == 3 && p.rcptFlag != 5) {
            html.push("<div class='rMList'>")
            html.push("<span class='rMl'>" + Lang.Mail.fxzt + "</span>");
            if (Util.DateDiff(new Date(), p.date) < (gMain.deliverStatusTime || 24)) {
                html.push("<div class='rMr' id='viewStatus" + p.mid + "'><a href=\"javascript:;\" class='check-detail' id=\"aStatus" + mid + "\" onclick=\"" + strEvent + ".displayMailDeliverStatusHTML('" + mid + "')\">" + p.getLang(Lang.Mail.DeliverStatus_ViewDetail, Lang.Mail.ckdetail) + "</a></div>")


            }
            else {
                html.push("<div class='rMr' id='failMsg" + p.mid + "'>" + p.getLang(Lang.Mail.DeliverStatus_OutModed, Lang.Mail.noSDetail) + "</div>");
            }
            html.push("</div>");
            html.push("<div id='trContent" + p.mid + "' style='display:none'></div>");
        }
        return html.join("");
    },
    mailDeliverStatus: function (mid, cb) { //邮件投递状态
        var p = this;
        var html = [];
        var objdata = {
            sort: 1,
            start: 0,
            total: 5,
            mid: mid
        };
        var obj = {
            data: objdata,
            func: "mbox:getDeliverStatus",
            msg: ""
        };

        var callBack = function (au) {
            if (!mid) {
                CC.exit();
            } else {
                if (typeof(cb) != "function") {
                    CC.exit();
                }
            }
            cb(au);
        };
        var failCallBack = function () {
            if (!mid) {
                CC.exit();
            } else {
                if (typeof(cb) != "function") {
                    CC.exit();
                }
            }
            top.CC.showMsg(top.Lang.Mail.Write.xitongfanmangqingshaohouzaishi,true,null,'error')//系统繁忙，请稍后再试
        };
        var data = {
            func: obj.func,
            data: obj.data,
            call: callBack,
            failCall: failCallBack,
            msg: obj.msg
        };
        //MM.mailRequest(data);
        MM.mailRequestApi(data);
        /*
         }
         else {
         aStatus.innerHTML = this.getLang(Lang.Mail.DeliverStatus_ViewDetail, "查看详情  ")
         divDetailStatus.style.display = "none";
         }
         */
    },

    getRecallData: function () {
        var p = this;
        var $ = jQuery;
        var mid = this.mid;
        var callBack = function(ao){
            if(ao){
                //供点击“召回”按钮的时候取数据
                p.recallData = ao;

                //如果有召回的地址、邮件，显示召回按钮
                if(ao && ao["var"] && ao["var"].recallUsers && ao["var"].recallUsers.length){
                    var oFrame = jQuery("#ifrmReadmail_Content_readMail"+mid).contents().find("#recallMsg"+mid);
                    if(oFrame.length>0){
                        oFrame.html('<a href="javascript:;" onclick="MR.beforeShowRecell()" style="display: inline;" id="aRecallMail">['+p.getLang(Lang.Mail.recallMail, Lang.Mail.RecallMessage_RecallMail)+']</a>')
                    }
                }
            }

        };
        this.queryRecallData(callBack);
        //var failCall = function(){};
    },
    queryRecallData:function(callBack){
        var p = this;
        var $ = jQuery;
        var mid = this.mid;
        var ojbdata = {
            mid: mid
        };
        var data = {
            func: "mbox:queryCanRecallReceivers",
            data: ojbdata,
            call: callBack,
            failCall:null,
            msg: ""
        };
        MM.mailRequestApi(data);
    },
    showRecallMessageFrm: function () { //显示撤回邮件选择窗口
        var p = this;

        var html = [];
        html.push("<div style=\"border-top: 0 none;clear: both;height: auto;overflow: hidden;padding: 20px 0;width: 100%;\">");
        html.push("<div style=\"padding: 0 20px;\">");
        html.push("<div style=\"padding: 0 20px;\">");
        html.push("<h1 style=\"text-align:left\">" + p.getLang((Lang.Mail.zcrecall + "({0})" + Lang.Mail.demail + " ").format(gMain.domain), Lang.Mail.RecallMessage_SupportDomian.format(gMain.domain)) + "</h1>");
        html.push("<ul id=\"ulRecallMail" + p.mid + "\" style=\"border: 1px solid #CCCCCC;text-align:left;height: 120px;margin: 0 0 12px;overflow: auto;padding: 0 3px;\">");

        var htmltemp = "<li style=\"float:none;width:auto;\">";
        htmltemp += "<input type=\"checkbox\" checked=\"checked\" name=\"chkRecallMail" + p.mid + "\" id=\"chkRecallMail{0}\">";
        htmltemp += "<label title=\"{1}\" style=\"display:inline-block;width:250px;margin-bottom:-4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis\"";
        htmltemp += ">{2}</label>";
        htmltemp += "</li>";

        var id = "RecallMessageFrm" + p.mid;
        this.queryRecallData(function(data){
            var repts = data["var"].recallUsers;
            for (var i = 0; i < repts.length; i++) {
                html.push(htmltemp.format(repts[i], repts[i], repts[i]));
            }
            html.push("</ul>");
            html.push("<div style='display:none'><input type='checkbox' id='isSendBack' >" + Lang.Mail.sendMailconfirm + "</div>");
            html.push("</div></div></div>");
            html.push('<div class="boxIframeBtn">');
            html.push('<div class="topborder">');
            html.push(' <a href="javascript:;"  onclick="MM[\'' + p.name + '\'].recalMessage()" class="n_btn_on mt_8"><span><span>' + p.getLang(Lang.Mail.cehui, Lang.Mail.RecallMessage_Recall) + '</span></span></a>');
            html.push(' </div>');
            html.push(' </div>')
            var ao = {
                id: id,
                title: p.getLang(Lang.Mail.choiseCehui, Lang.Mail.RecallMessage_CheckRecallMail),
                text: html.join(""),
                width: "400",
                zindex: 1001
            };
            CC.msgBox(ao);
        })

        if (window.gMain && typeof gMain.recallFlag !== "undefined") {
            if(parseInt(gMain.recallFlag,10) === 2){
                if(document.getElementById("isSendBack")){
                    document.getElementById("isSendBack").style.display = "inline";
                }
            }
        }

    },

    beforeShowRecell: function () {
        var p = this;
        var id = "BeforeRecallResultFrm" + p.mid;
        var html = [];                                                                      
        html.push("<div style=\"padding:25px; \"><ul class=\"clearfix\"><li style=\"background:no-repeat url('"+ parent.CC.getResourceAbsoluteURL() +"/images/u17.png ');width: 54px;height: 44px;float: left;\"></li><li>"+top.Lang.Mail.Write.quedingyaochehuiciyoujianme+"<br/>"+top.Lang.Mail.Write.rgchcfDpCGchdyj+"</li></ul><ul style=\" margin-top: 20px; font-size: 13px;   color: rgb(141, 141, 141);\"><li>"+top.Lang.Mail.Write.yjfswLoonLczcch+"</li></ul></div>");///images/u17.png ');width: 54px;height: 44px;float: left;\"></li><li>确定要撤回此邮件么？<br/>如果撤回成功，对方将收到提示邮件已被撤回的邮件。</li></ul><ul style=\" margin-top: 20px; font-size: 13px;   color: rgb(141, 141, 141);\"><li>邮件发送未超过15天，在对方未读或显示未读状态，未被对方从邮件客户端收取过，才支持撤回。</li></ul></div>
        var ao = {
            id: id,
            title: p.getLang(Lang.Mail.recallMail, Lang.Mail.RecallMessage_RecallMail),
            text: html.join(""),
            width: "350",
            zindex: 1002,
            buttons: [
                {
                    "text": Lang.Mail.AdvSearch_OK,
                    "clickEvent": function(){
                        p.showRecallMessageFrm();                       
                    } 
                }
            ]
        };
        CC.msgBox(ao);
    },

    showRecallResultFrm: function (au,isCheckAll) { //显示邮件回撤的结果窗口
        var html = [];
        var p = this;
        var id = "RecallResultFrm" + p.mid;
        html.push("<div style=\"border-top: 0 none;clear: both;height: auto;overflow: hidden;padding: 20px 0;width: 100%;\">");
        html.push("<div style=\"padding: 0 20px;\">");
        html.push("<div style=\"padding: 0 20px;\">");
        html.push("<ul id=\"ulRecallResultFrm" + p.mid + "\" style=\"border: 1px solid #CCCCCC;text-align:left;height: 180px;margin: 0 0 12px;overflow: auto;padding: 0 3px;\">");

        var htmltemp = "<li style=\"float:none;width:auto;\">";
        htmltemp += "<label style=\"display:inline-block;width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis\"";
        htmltemp += " title=\"{0}\">{0}</label>";
        htmltemp += "<span style=\"display:inline-block;color:{2}\">{1}</span>";
        htmltemp += "</li>";

        var resultVar = au['var'];
        var msg;

        var getMsg = function (v) {
            return Lang.Mail["RecallMessage_Result_" + v] || Lang.Mail.RecallMessage_Result_99.format(v);
        };
        Util.eachObj(resultVar, function (n, v) {
            html.push(htmltemp.format(n, getMsg(v), v == 2 ? "green" : "red"));
        });

        html.push("</ul>");
        html.push("</div></div></div>");
        if (isCheckAll) {
            this.showretract(p.mid);
        }
        var ao = {
            id: id,
            title: p.getLang(Lang.Mail.cehuijieguo, Lang.Mail.RecallMessage_Result),
            text: html.join(""),
            width: "500",
            zindex: 1001,
            buttons: [
                {
                    text: Lang.Mail.AdvSearch_OK,
                    isCancelBtn: true
                }
            ]
        };
        CC.msgBox(ao);
    },
    recalMessage: function () { //邮件回撤
        var mid = this.mid;
        //var ulRecal = $("ulRecallMail"+mid);
        var chks = document.getElementsByName("chkRecallMail" + mid);
        var users = new Array();
        var p = this;
        var j = 0;
        var replyFlag = 0;

        /*
         * 邮件撤回通知 是否发给收件人（收件人已经收到这封邮件，撤回的时候，这封邮件在收件人那里就看不见了）
         * 默认为不通知，[replyFlag  0:不通知 ， 1:通知]
         *
         * 可配置项 [gMain.recallFlag  0:不通知（复选框隐藏） 1：通知（复选框隐藏）2:用户可选是否通知
         */
        if(window.gMain && typeof gMain.recallFlag !== "undefined"){
            var recallFlag = gMain.recallFlag;

            if(parseInt(recallFlag,10) === 0){
                replyFlag = 0;
            }

            if(parseInt(recallFlag,10) === 1){
                replyFlag = 1;
            }

        }
        if (document.getElementById("isSendBack").checked) {
            replyFlag = 1;
        }
        var isCheckAll=true;
        for (var i = 0; i < chks.length; i++) {
            if (chks[i].checked) {
                users[j] = chks[i].id.replace("chkRecallMail", "");
                j++;
            }else{
                isCheckAll =false;
            }
        }
        if (users.length == 0) {
            alert(p.getLang(Lang.Mail.RecallMessage_CheckMail, Lang.Mail.choiseR));
            return;
        }


        CC.closeMsgBox("RecallMessageFrm" + mid);
        var ojbdata = {
            mid: mid,
            rcpts: users,
            replyFlag: replyFlag
        };
        var callBack = function (au) {
            p.showRecallResultFrm(au,isCheckAll);
        };
        var data = {
            func: "mbox:recallMessage",
            data: ojbdata,
            call: callBack,
            msg: ""
        };
        if(CC.isExtMail()){
            data.data.opUser=gMain.mailId+"@"+gMain.domain;
        }
        //MM.mailRequest(data);
        MM.mailRequestApi(data);
    },
    starFlag: function (obj, mid) {
        var p = this;
        var val = obj.getAttribute("flagval");
        val = 1 - val;
        var callBack = function (data) {
            if (data.code == gConst.statusOk) {
                if (val == 1) {
                    El.setClass(obj, "i_starFlag_on");
                    El.setAttribute(obj, {title: Lang.Mail.haveStar, flagval: "1"});
                } else {
                    El.setClass(obj, "i_starFlag_off");
                    El.setAttribute(obj, {title: Lang.Mail.noStar, flagval: "0"});
                }
            }
        };
        var data = {
            func: "mbox:updateMessagesStatus",
            data: {
                type: "starFlag",
                value: val,
                ids: [mid]
            },
            call: callBack
        };
        MM.mailRequest(data);
    },
    getRemarkDom: function (mid) {
        return {
            btn: $("remarkon_" + mid),
            read: $("remarkread_" + mid),
            write: $("remarkwrite_" + mid),
            div: $("remark_" + mid),
            readVal: $("remarkContent_" + mid),
            writeVal: $("remarktext_" + mid)
        }
    },
    getRemark: function (mid) {
        var dom = this.getRemarkDom(mid);
        this.doGetRemark(mid, dom);
    },
    showRemark: function (mid) {
        this.doRemarkStatus(this.getRemarkDom(mid));
    },
    hideRemark: function (mid) {
        this.doRemarkStatus(this.getRemarkDom(mid), true);
    },
    saveRemark: function (mid, txt) {
        var p = this;
        var dom = this.getRemarkDom(mid);

        this.doSaveRemark(mid, dom, function () {
            if (data.code == gConst.S_OK) {
                $("remarkwrite_" + mid).value = txt.value;
                p.showRemark(mid);
                p.remark = 1;
            }
        });
    },
    editRemark: function (mid) {
        var dom = this.getRemarkDom(mid);
        this.doEditRemark(dom);
    },
    doRemarkStatus: function (dom, isHide) {
        var isRemark = dom.btn.getAttribute("flagval");
        if (isHide) {
            if (isRemark == 1 && this.hasRemark) {
                //$("remarkread_"+index).style.display="block";
                //$("remarkwrite_"+index).style.display="none";
                El.show(dom.read);
                El.hide(dom.write);
            } else {
                //var om = $("ms_remark_"+index);
                //om.style.display = "none";
                //$("remarktext_"+index).value="";
                El.hide(dom.div);
                //dom.
            }
        } else {
//            if (isRemark == 1) {
//                El.show(dom.read);
//                El.hide(dom.write);
//            } else {
            El.hide(dom.read);
            El.show(dom.write);
//            }
            dom.div.style.display = "";
        }
    },
    doRequestRemark: function (data, cb) {
        var data = {
            func: "mbox:mailMemo",
            data: data,
            call: cb
        };
        MM.mailRequestApi(data);
    },
    doSaveRemark: function (mid, dom, cb) {
        var p = this;
        var txt = dom.writeVal;
        var val = txt.value.trim();
        if (val == "") {
            CC.alert(Lang.Mail.remarkContent);
            return false;
        }
        if (val.length > 50) {
            CC.alert(Lang.Mail.remarkLength);
            return false;
        }
        var callBack = function (data) {
            if (data.code == gConst.statusOk) {
                dom.readVal.innerHTML = val.encodeHTML();
                El.hide(dom.write);
                El.show(dom.read);
                El.setClass(dom.btn, "i_note_on");
                El.setAttribute(dom.btn, {"flagval": 1});
                dom.memoFlag.className = "i_note_on";
                dom.btn.title = Lang.Mail.haveRemark;
                //$("remarkon_"+mid).title=Lang.Mail.haveRemark;
                p.hasRemark = true;
                if (typeof(cb) == "function") {
                    cb(data);
                }
            } else {
                CC.alert(Lang.Mail.addRemarkFail);
            }
        };
        var data = {
            opType: "add",
            mid: mid,
            memo: val
        };
        this.doRequestRemark(data, callBack);
    },
    doDeleteRemark: function (mid, dom, cb) {
        var p = this;
        var callBack = function (data) {
            if (data.code == gConst.statusOk) {
                /*var om = $("ms_remark_"+index);
                 om.style.display = "none";
                 document.getElementById("remarktext_"+index).value="";
                 viewRemark[index]=0;
                 parent.El.setClass(document.getElementById("remarkon_"+index),"richinfo_ico_remarkoff");
                 parent.CC.alert(Lang.Mail.noteDelSuc);*/
                El.hide(dom.div);
                dom.writeVal.value = "";
                El.setClass(dom.memoFlag, "i_note_off");
                El.setAttribute(dom.memoFlag, {"flagval": 0});
                p.hasRemark = false;
                if (typeof(cb) == "function") {
                    cb(data);
                }
                //CC.alert(Lang.Mail.noteDelSuc);
            } else {
                CC.alert(Lang.Mail.remarkDelFail);
            }
        };
        var data = {
            opType: "delete",
            mid: mid,
            memo: ""
        };
        CC.confirm(Lang.Mail.confirmDelRemark, function () {
            p.doRequestRemark(data, callBack);
        });
    },
    doGetRemark: function (mid, dom, cb) {
        var callBack = function (data) {
            if (data.code == gConst.statusOk) {
                var rem = data["var"].memo;
                /*document.getElementById("remarktext_"+index).value=decodeHTML(rem);
                 var remarkread= document.getElementById("remarkContent_"+index);
                 remarkread.innerHTML=rem;
                 $("remarkread_"+index).style.display="block";
                 $("remarkwrite_"+index).style.display="none";
                 var om = $("ms_remark_"+index);
                 om.style.display = "block";
                 viewRemark[index]=1;*/
                dom.writeVal.value = rem;
                dom.readVal.innerHTML = rem.encodeHTML();
                El.show(dom.read);
                El.hide(dom.write);
                dom.div.style.display = "";
                if (typeof(cb) == "function") {
                    cb(data);
                }
                ;
            }
        };
        var isRemark = dom.btn.getAttribute("flagval");
        var data = {
            opType: "get",
            mid: mid,
            memo: ""
        };
        if (isRemark == 1) {
            this.doRequestRemark(data, callBack);
        }
    },
    doEditRemark: function (dom) {
        El.hide(dom.read);
        El.show(dom.write);
    },
    /*
     displayMailDeliverStatus: function(mid,obj){ //邮件投递状态
     this.mailDeliverStatus(mid,function(html){
     var txtContent = $("trContent"+mid);
     if(txtContent){
     txtContent.innerHTML = html;
     }
     });
     },
     */
    showMoreMenu: function (obj, index, mid, ev, doc) {

        ev.cancelBubble = true;
        var p1 = this;
        var o = p1.name;
        var ak = [];
        //if (GC.check("MAIL_READ_PRINT")) {
        ak.push({
            isShow: true,
            name: "MAIL_READ_PRINT",
            text: Lang.Mail.tb_Print,
            attrs: "",
            url: function () {
                p1.printMail(mid);
            },
            children: []
        });
        //}
        //if (GC.check("MAIL_READ_DOWNLOAD")) {
        ak.push({
            isShow: true,
            name: "MAIL_READ_DOWNLOAD",
            text: Lang.Mail.readMail_tb_downloademl,
            attrs: "",
            url: function () {
                p1.downloadsEmail(mid);
            },
            children: []
        });
        ak.push({
            isShow: true,
            name: "MAIL_READ_VIEW",
            text: Lang.Mail.tb_ViewSource,
            attrs: "",
            url: function () {
                p1.viewMailSource(mid);
            },
            children: []
        });
        //}

        //var ev = EV.getEvent();
        //var objTarget = EV.getTarget(ev);
        //var obj = objTarget.parentNode;
        var pObjM = GE.cToolbar;
        //var mid = p1.mid;
        //修复ie下的菜单隐藏的bug。
        if (pObjM) {
            El.hide(pObjM);
        }
        var objMenu = {
            id: "sm_more_" + index,
            name: "sm_more_" + index
        };
        CC.getMenu(objMenu, ak, null, null, obj, doc);
        obj.lastChild.style.width = "130px";
        obj.lastChild.style.height = "80px";
    },
    /*
     * 得到回复下面的菜单；
     */
    showAttachReMenu: function (obj, index, mid, ev, type, doc) {

        ev.cancelBubble = true;

        var AttachKey = [];
        var menuId = [];
        if (type == 0) {
            AttachKey.push("MAIL_READ_REPLYATTACH");
            AttachKey.push("MAIL_READ_REPLYNOATTACH");
            menuId.push("REPLYATTACH", "REPLYNOATTACH");
        }
        else {
            AttachKey.push("MAIL_READ_REPLYALLATTACH");
            AttachKey.push("MAIL_READ_REPLYALLNOATTACH");
            menuId.push("REPLYALLATTACH", "REPLYALLNOATTACH");
        }
        var p1 = this;
        var o = p1.name;
        var ak = [];
        //if (GC.check(AttachKey[0])) {
        ReadMail.fMenus[AttachKey[0]].url = function () {
            p1.doMenu(null, menuId[0], null, mid);
        }
        ak.push(ReadMail.fMenus[AttachKey[0]]);
        //}
        //if (GC.check(AttachKey[1])) {
        ReadMail.fMenus[AttachKey[1]].url = function () {
            p1.doMenu(null, menuId[1], null, mid);
        }
        ak.push(ReadMail.fMenus[AttachKey[1]]);

        //}
        var pObjM = GE.cToolbar;
        //var mid = p1.mid;
        //修复ie下的菜单隐藏的bug。
        if (pObjM) {
            El.hide(pObjM);
        }
        var objMenu = {
            id: "sm_moreAttrch_" + type + index,
            name: "sm_more_Attrch" + type + index
        };
        CC.getMenu(objMenu, ak, null, null, obj, doc);
        obj.lastChild.style.width = "110px";
        obj.lastChild.style.height = "55px";
    },
    sendQuickReply: function (objContent) {
        var p = this;
        var o = p.name;
        var subject = "Re:" + MR.subject;
        var from = MR.sendUser;
        if (objContent && objContent.value.replace(/ /gi, "") == "") {
            parent.CC.alert(Lang.Mail.readMail_alert_onblur);
            objContent.focus();
            return;
        }
        if (objContent && objContent.value == Lang.Mail.readMail_textarea_text) {
            parent.CC.alert(Lang.Mail.readMail_alert_onblur);
            objContent.focus();
            return;
        }
        var mailInfo = {
            account: top.gMain.userNumber,
            to: from,
            cc: "",
            bcc: "",
            showOneRcpt: 0,
            isHtml: 0,
            subject: subject,
            content: objContent.value,
            priority: 3,
            requestReadReceipt: 0,
            saveSentCopy: 0,
            inlineResources: 0,
            scheduleDate: 0,
            normalizeRfc822: 0,
            attachments: []
        };
        var call = function () {
            parent.CC.alert(Lang.Mail.Write.RepliesSuccessfully, function () {
                objContent.value = Lang.Mail.replyTo + MR.sendName;
            });
        };
        parent.CC.quickSendMail(mailInfo, call, function () {
            parent.CC.alert(Lang.Mail.Write.MailsendFail);
        });
    },
    notJunk: function ()//这不是垃圾邮件
    {
        this.move(1, Lang.Mail.list_NowMoveMail, Lang.Mail.folder_1);
        //CC.showMsg(Lang.Mail.notJunk_backInbox,true,false,"option")
        parent.CC.exit();
    },
    getMailContent: function (content) {
        return content.decodeHTML();
    },
    setMailContent: function (content) {
        return content.encodeHTML();
    },
    trim: function (content) {
        return content.trim();
    },
    isExists:function(arr,item){
        for(var i= 0,l=arr.length;i<l;i++){
            if(arr[i] == item){
                return true;
            }
        }
        return false;
    },
    showretract:function(mid){
        jQuery("#ifrmReadmail_Content_readMail"+mid).contents().find("#recallMsg"+mid).html('<span style="color:#BFBFBF;font-size:12px;">['+Lang.Mail.recalled+']</span>');
    }
};