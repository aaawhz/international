//框架提供的公共方法类
CC.getMailInfo = function (obj) {
    var msgInfo = obj || messageInfo;
    var lms = messageInfo.limitMessageSize, pc = '0%', pcn = 0, ts = "";
    var ms = msgInfo.messageSize;
    var mc = msgInfo.messageCount;
    var fInfo = MM.folderMain.folderInfo;
    umc = msgInfo.unreadMessageCount;


    try {
        if (lms == gConst.unlimitedId || lms >= (1024 * 1024 * 1024 * 200) ) {
            pc = "1.0%";
            pcn = 1;
            // ts = gConst.unlimitedId;
            ts = Util.formatSize(lms, null, 2);
        } else {
            //pc = Number(ms).div(lms).mul(140);
            pc = Number(lms - ms).div(lms);
            pc = Util.str2Num(String(pc), 4, "str");
            if ((pc == "0" || pc < 0.0001) && mc > 0) {
                pc = "0";
            }
            pcn = pc * 100;
            if (pcn == 100 && parseInt(mc) > 0) {
                pcn = 99.99;
            }
            pcn = Util.str2Num(String(pcn), 2, "str");
            pc += "%";
            ts = Util.formatSize(lms, null, 2);
        }
    } catch (e) {
        pc = '0%';
        pcn = 100;
    }
    var fm = {
        limitMessageSize: lms,
        limitMessageCount: messageInfo.limitMessageCount,
        messageSize: ms,
        messageCount: mc,
        unreadMessageCount: umc,//未读邮件统计
        usedPercentBegin: pc,
        userdPercentNum: pcn,
        totalSize: ts,
        usedSize: Util.formatSize(ms, null, 2)
    };

    if (fInfo) {
        // 处理使用百分比
        var usedPercent = fInfo['userdPercentNum'];
        usedPercent = 100 - usedPercent;
        usedPercent = Util.str2Num(usedPercent, 2) + '%';
        fm.usedPercent = usedPercent;
        if (!obj) {
            fm.usedSize = fInfo.usedSize;
            fm.unreadMessageCount = CC.getUnReadMailCount();
        }
    }
    return fm;
    //return MM.folderMain.folderInfo;
};

/**
 * 获取未读邮件数
 */
CC.getUnReadMailCount = function () {
    var folders = CM.folderMain[gConst.dataName];

    var unreadMessageCount = 0;
    for (var z = 0; z < folders.length; z++) {
        if (!folders[z].virtualFolder && folders[z].type != 5 && folders[z].type != 2 && folders[z].fid != 2 && folders[z].fid != 3 && folders[z].fid != 4 && folders[z].fid != 5 && folders[z].fid != 6 && folders[z].fid != 10 && folders[z].fid != 11) {
            unreadMessageCount += folders[z].stats.unreadMessageCount;
        }
    }
    return unreadMessageCount;
};

/**
 * 跳转至设置页面
 * @param {Object} m 模块名
 * @param {Object} par 参数
 */
CC.setConfig = function (m, param) {
    //CC.goSSO(m, "setting", par);
    jQuery("#" + LM.selectFolderId).removeClass("selectFolder_li");
    jQuery("#span_" + LM.selectFolderId).removeClass("selectFolder_li");
    m = m || "index";
    MM.getModule(gConst.setting);

    //通过MM去调用setting的 optSetting方法，来显示相应的页面
    MM[gConst.setting].optSetting(m, param);
    return false;
};

/**打开搜索页面*/
CC.goSearch = function () {
    //if(!GC.check("MAIL_CONFIG_MAILSEARCH")){
    //    CC.forbidden();
    //    return;
    //}
    CC.setConfig("mailSearch");
};

// 通讯录调用方法 m 类型：
CC.goAddress = function (m, par, isFresh) {
    if (!GC.check("CONTACTS")) {
        CC.forbidden();
        return;
    }
    jQuery("#" + LM.selectFolderId).removeClass("selectFolder_li");
    jQuery("#span_" + LM.selectFolderId).removeClass("selectFolder_li");
    LM.selectFolderId = "addr";
    jQuery("#addr").attr("class", "selectFolder_li");
    CC.goSSO(m, "address", par, "", true);
    return false;
};

//发短信
CC.goSms = function (id, mobile, text) {
    id = id || "601";
    CC.goSSO(id, 'sms', mobile, text);
};

//发彩信
CC.goMms = function (id, mobile, text) {
    id = id || "701";
    CC.goSSO(id, 'mms', mobile, text);
};

//发传真
CC.goFax = function (id, mobile, text) {
    id = id || "sendfax";
    CC.goSSO(id, 'fax');
};
CC.goDisk = function () {
    CC.goOutLink(gMain.webPath + "/se/disk/indexdisk.do?sid=" + gMain.sid, "disk", Lang.Mail.Write.folderTransferStation);
};

CC.goSSO = function (p, m, par, text, isFresh) {
    par = par || "";
    text = text || "";
    isFresh = isFresh || false;
    text = escape(text);
    var un = MM.goTo(m, "getUrl", 0, p);
    var s = gMain.webPath + "/se" + un.url;
    s = GC.appendUrl(s, "sid", gMain.sid);
    if (m == "sms" || m == "mms" || m == "fax") {
        if (par) {
            s += "&mobile=" + par;
        }
        if (text) {
            s += "&msg=" + text;
        }
    }
    if (m == "setting" && par) {
        s += '&' + par;
    }
    MM.goTo(m, "setUrl", 0, s, isFresh);
    MM.goTo(m, "url", 2, s);
    MM.goTo(m, "text", 2, un.name);
    MM.getModule(m);
    CC.updateTitleNew(un.name, s);
};

/**
 * 打开收件箱功能
 * @param {Boolean} isFreshFolder 是否刷新文件夹
 */
CC.goInbox = function (isFreshFolder) {
    if (!GC.check("MAIL_INBOX")) {
        CC.forbidden();
        return;
    }
    //设置选择的列为收件箱；
    if (LM.selectFolderId != 1) {
        jQuery("#" + LM.selectFolderId).removeClass("selectFolder_li");
        LM.selectFolderId = 1;
    }

    MM[GE.folderObj.inbox].isFilter = "";
    //正在收取邮件
    CC.showMsg(Lang.Mail.Write.receiving, false, false, "loading");
    MM.getModule(GE.folderObj.inbox);
    var id = GE.tab.curid;
    if (id == GE.folderObj.inbox) {
        MM.goTo(GE.folderObj.inbox, "refresh", 0);
        return;
    }
    GE.currentFolder = GE.folder.inbox;
    GE.currentFolderModule = GE.folderObj.inbox;
    if (isFreshFolder) {
        LM.freshFolderMain(null, false);
    }
    CC.hideMsg();
};

// flag 搜索的标识
CC.receiveMail = function (flag) {
    CC.searchNewMail(0, true, undefined, flag);
    LM.freshFolderMain(null, true);
    if (flag) {
        jQuery("#" + LM.selectFolderId).removeClass("selectFolder_li");
        jQuery("#span_" + LM.selectFolderId).removeClass("selectFolder_li");
    }
    if (flag && flag.meeting) {
        LM.selectFolderId = 9999999;
        jQuery("#9999999").addClass("selectFolder_li");
    }
    if (flag && flag.task) {
        Folder.taskType = flag.task;
        LM.selectFolderId = 9999998;
        jQuery("#9999998").addClass("selectFolder_li");
    }
    if (flag && flag.signed) {
        LM.selectFolderId = 9999997;
        jQuery("#9999997").addClass("selectFolder_li");
    }
    if (flag && flag.starFlag) {
        LM.selectFolderId = 9999996;
        jQuery("#9999996").addClass("selectFolder_li");
    }
}
//打开指定的文件夹
CC.goFolder = function (fid, o, isauth, target) {
    var obj = o;
    if (!GC.check("MAIL_INBOX")) {
        CC.forbidden();
        return;
    }
    jQuery("#" + LM.selectFolderId).removeClass("selectFolder_li");
    jQuery("#span_" + LM.selectFolderId).removeClass("selectFolder_li");
    LM.selectFolderId = fid;
    var func = function () {
        if (!obj) {
            obj = MM.getModuleByFid(fid);
        }
        if (MM[obj]) {
            MM[obj].isFilter = "";
        }
        GE.currentFolder = fid;
        GE.currentFolderModule = obj;
        if (MM.getModule(obj, undefined, undefined, target)) {
            MM.goTo(obj, "refresh", 0);
        } else {
            LM.freshFolderMain(null, true);
        }
        //LM.freshFolderMain(null, true);
        //LM.freshFolderMain(null,false);
    };
    func();


    /* 不再做判断登录与否
     if((!CM[gConst.folderMainSec]["isLogin"]&&CM[gConst.folderMainSec][fid])||isauth){
     //if(isauth){
     MM[gConst.folderMain].authenticate2(function(){
     CM[gConst.folderMainSec]["isLogin"] = true;
     func();
     });
     }else{
     func();
     }
     */
    //return false;
};

CC.goFolderMain = function (callback) {
    MM.getModule(gConst.folderMain, callback);
    return false;
};

//打开附件管理标签
CC.goAttachList = function () {
    if (gMain.IsAttachSearch == "") {
        delete MM[gConst.attachList].data.filter;
        MM[gConst.attachList].filter = {};
    }
    //gConst.attachList得到附件管理的页面
    MM.getModule(gConst.attachList);

    jQuery("head").append("<link rel=\"stylesheet\" href=\"" + CC.getResourceAbsoluteURL() + "/css/preview/module/attrview.css\" type=\"text/css\" />");
    jQuery("#" + LM.selectFolderId).removeClass("selectFolder_li");
    jQuery("#span_" + LM.selectFolderId).removeClass("selectFolder_li");
    LM.selectFolderId = "attach";
    jQuery("#attach").attr("class", "selectFolder_li");
};
CC.previewImg = function (fileName, link) {
    var attachWindow = document.getElementById('ifrmAttach').contentWindow;
    attachWindow.showImg(fileName, link);
};
//打开邮件投递状态查询
CC.goDeliver = function () {
    MM.getModule(gConst.deliver);
};

CC.getComposeUrl = function (pm) {
    pm = pm || "";
    var url = gConst.composeUrl + "{0}&rnd={1}".format(pm, GC.gRnd());
    if (IsDebug) {
        url += "&debug=true"
    }
    return url;
};

CC.getMeetingUrl = function (pm) {
    var url = gMain.webPath + "/webtransit.do?sid=" + top.gMain.sid + "&func=mail:meeting" + "{0}&rnd={1}".format(pm, GC.gRnd());

    pm = pm || "";
    if (IsDebug) {
        url += "&debug=true"
    }
    return url;
};

/***
 * 写信
 * @param {Object} to
 * @param {Object} text
 * @param {Object} obj
 */
CC.compose = function (to, text, obj, tid,senderUser) {
    CC.checkNetwork();
    //设置没有任何列被选中
    jQuery("#" + LM.selectFolderId).removeClass("selectFolder_li");
    LM.selectFolderId = 0;

    var pm = "";
    if (to) {
        pm += "&to=" + to;
    }
    if (tid) {
        pm += "&tid=" + tid;
    }
    if (text) {
        pm += "&msg=" + encodeURIComponent(text);
    }
    if(senderUser){
        pm +='&senderUser='+senderUser;
    }
    var url = CC.getComposeUrl(pm);
    var name = Lang.Mail.tab_Compose;
    var sid = -1;
    var cTabs = GE.tab.composeTabs;
    var isChange = false;
    for (var n in cTabs) {
        var win = CC.isCompose(n);
        if (win) {
            isChange = false;
            try {
                GE.tab.active(n);
                isChange = win.oWrite.checkChange();
            } catch (e) {
            }
            if (!isChange) {
                sid = n;
                break;
            }
        }
    }

    if (sid == -1) {
        sid = 'compose_' + GE.maxComposeId;
        GE.maxComposeId++;
    }
    url += "&composeid=" + sid;
    GE.diskFiles[sid] = obj;
    if (tid) {
        GE.diskFiles[sid + "_attr"] = "attr";
    }
    CC.goCompose(url, sid, name);
};

CC.quickSendMail = function (mailInfo, cb, fcb) {
    var p = this;
    var xmlObj = {
        attrs: mailInfo,
        returnInfo: 1,
        action: "reply"
    };
    var failCb = function (resp) {
        if (typeof(fcb) == "function") {
            fcb(resp);
        } else {
            CC.alert(Lang.Mail.Write.sendFail);
        }
    };

    var obj = {
        func: "mbox:compose",
        data: xmlObj,
        call: function (resp) {
            if (resp.code == "S_OK") {
                if (typeof(cb) == "function") {
                    cb(resp);
                } else {
                    //邮件发送成功!
                    CC.alert(Lang.Mail.Write.sendedSuc);
                }
            } else {
                failCb(resp);
            }
        },
        failCall: failCb
    };
    MM.mailRequestApi(obj);
};

CC.sendMail = function (to, text, obj, tid) {
    CC.compose(to, text, obj, tid);
};

//日程提醒调用，添加邮件到日程
CC.addCalendar = function (mailInfo) {
    var CalAPIServer = GC.getCookie("MMSServer") + '/CMailCal/EventService2.ashx';
    var mid = mailInfo.mid;
    var timesetDate = Util.parseDate(mailInfo.scheduleDate, 'yyyy.mm.dd HH:nn');
    var date = Util.formatDate(timesetDate, 'yyyy-mm-dd');
    var time = parseInt(Util.formatDate(timesetDate, 'HH'), 10) * 60 + parseInt(Util.formatDate(timesetDate, 'nn'), 10);
    var CalData = '<form><input name="Sid" value="' + GC.sid + '" />' +
        '<input name="modId" value="1" /> <input name="SeqNo" value="' +
        mid +
        '" /> <input name="Operate" value="1" />' +
        '<input name="Receiver" value="' +
        mailInfo.to +
        '" /><input name="calContent" value="' +
        mailInfo.subject.replace(/&nbsp;/g, ' ') +
        '" />' +
        '<input name="beginDate" value="' +
        date +
        '" /><input name="endDate" value="' +
        date +
        '" />' +
        '<input name="beginTime" value="' +
        time +
        '" /><input name="endTime" value="' +
        time +
        '" /></form>';
    var am = {
        method: "post", //get|post
        url: CalAPIServer, //请求的url地址’
        call: function () {
        }, //回调函数
        resType: "html", //资源返回类型
        encode: gMain.charset
    };
    Ajax.submit(CalData, am, true);
};

//删除日程提醒-Gaom
CC.deleteCalendar = function (mids) {
    var CalAPIServer = GC.getCookie("MMSServer") + '/CMailCal/EventService.ashx';
    var CalData = '<form><input name="Sid" value="' + GC.sid + '" />' +
        '<input name="modId" value="1" /> <input name="SeqNo" value="' +
        mids +
        '" /> <input name="Operate" value="0" />' +
        '<input name="Receiver" value="' +
        '" /><input name="calContent" value="' +
        '" />' +
        '<input name="beginDate" value="' +
        '" /><input name="endDate" value="' +
        '" />' +
        '<input name="beginTime" value="' +
        '" /><input name="endTime" value="' +
        '" /></form>';
    var am = {
        method: "post", //get|post
        url: CalAPIServer, //请求的url地址’
        call: function () {
        }, //回调函数
        resType: "html", //资源返回类型
        encode: gMain.charset
    };
    Ajax.submit(CalData, am, true);
};

//日程提醒调用，编辑定时邮件
CC.editMail = function (mid, subject) {
    if (!subject) {
        subject = Lang.Mail.tb_EditMail;
    }
    var url = '/coremail/cmail/compose.jsp?funcid=draft&sid=' + GC.coreSid + '&mid=' + mid;

    Ajax.get(url, function () {
        mid = 'compose_' + mid;
        CC.goCompose(url, mid, subject);
    }, null);


};
//日程提醒调用，删除定时邮件
CC.deleteMail = function (mid) {
    var url = '/coremail/s?func=global:sequential&sid=' + GC.coreSid + "&rnd=" + Math.random();
    var am = {
        method: "get", //get|post
        url: url, //请求的url地址’
        call: function () {
        }, //回调函数
        resType: "html" //资源返回类型
    };
    Ajax.submit('', am, true);
    LM.getAllFolders();
};


CC.refreshFolder = function (isNotActive) {
    var fo = GE.lastFolder;
    if (GE.tab.exist(fo)) {
        MM[fo].refresh(isNotActive);
    }
};
CC.exit = function (id) {
    if (!id) {
        id = CC.getCurLabId();
        GE.tab.close(id);
        return;
    }
    else {
        GE.tab.close(id);
        return;
    }
};
/* 只对当前标签有效 */
CC.updateTitleNew = function (text, url) {
    var id = CC.getCurLabId();
    GE.tab.title(id, text);
};
CC.updateTitle = function (text, url) {
    var id = CC.getCurLabId();
    GE.tab.title(id, text);
};
CC.updateTitleAndId = function (text, mid) {
    var id = CC.getCurLabId();
    GE.tab.title(id, text, mid);
};
CC.goLink = function (url, id, name, type) {
    // 需要对bf（url）进行特殊处理  
    var g = id;
    if (GE.tab.exist(id)) {
        GE.tab.title(id, name);
        GE.tab.active(id);
        GMC.setUrl(id, url, true);
        return;
    }
    MM.goTo(type, "url", 2, url);
    MM.goTo(type, "text", 2, name);
    MM.goTo(type, "name", 2, id);
    MM.goTo(type, "group", 2, g);
    //MM.goTo(type,"init",0);
    MM.getModule(type, false, id);
};
CC.goCompose = function (url, id, name) {
    CC.goLink(url, id, name, "compose");
};

CC.isSessionMode = function () {
    if (!GC.check("MAIL_MANAGER_SESSIONMODE")) {
        return false;
    }
    return gMain.sessionMode == "1";
};

/**
 * 判断需要使用会话阅读邮件文件夹
 */
CC.isSessionModeReadMail = function (fid) {
    return CC.isSessionMode() && (fid == GE.folder.inbox || fid > GE.folder.virus);
};

/***
 * 读邮件
 * @param {String} mid 邮件ID
 * @param {String} name 主题
 * @param {Object} parm
 *  fid: 1
    isSession: false
    markRead: 1
    rcptFlag: 5
    sessionId: 2529
 * @param {Object} mi 邮件标志
 */
CC.goReadMail = function (mid, name, parm, mi, closeTab) {
    
    //如果开启了安全邮箱
    if(CC.isSecurityMail()){

        /**gMain里定义
         *firstuseibc=0或者无此参数，表示用户目前为止未曾使用过ibc功能，
          firstuseibc=1表示用户已经修改过ibc密码. 
          
          modifyibcpwd=0,表示用户每次必须输出ibc密码(需要弹出密码框),
          modifyibcpwd=1,表示用户不需输入ibc密码(即不需要弹出ibc密码框, 用户已经勾选了自动验证)
          如果用户再修改秘密, 这个又变成0,  
         */

        //获取安全邮件自动验证加密串：smailNoVerify
        function smailNoVerifyCall(d){
            if(d['var']){
                var smailNoVerify = d['var'].smailNoVerify;
                goRead(mid,name,parm,mi,closeTab,undefined,smailNoVerify);
            }
        }
        
        //如果是加密邮件, 先取到是否修改过密码, 是否需要验证密码参数
        
        var autopass = false;
        if( typeof top.gMain !== "undefined" && typeof top.gMain.userAttrs !== "undefined" ){
            //已经修改过密码
            var bMod = top.gMain.userAttrs.firstuseibc == "1" ? true : false; 
            //已经解开密码,并以后自动验证,以后不需要再输入
            autopass = top.gMain.userAttrs.modifyibcpwd == "1" ? true : false;
        }

        //如果是新开用户，阅读签名或加密邮件则弹出修改密码提示框，修改成功后才能阅读邮件
        if(parm.isEncrypt || parm.isSign){

            if(!bMod && typeof bMod !== "undefined"){
                
                CC.showModIBCdiv(function(ibcPwd){
                    var webpath = ( parent.gMain ? (parent.gMain.webPath || "") : "" );
                    parent.MM.doService({
                        func:  "mail:SoapVerifyIbcPwd",
                        absUrl:  webpath +  '/service/mail/ibcsoap',
                        data: {
                            oldpwd:  ibcPwd,
                            autodec: 0
                        },
                        call: function(d){
                            if(d.code == 'S_OK'){  
                                //验证成功跳转到读信正文页面
                                goRead(mid,name,parm,mi,closeTab,ibcPwd,undefined);
                            }
                        },
                        failCall: function(d){

                        }
                    });
                });
                return;
            }
        }

        //已读, 或者自动验证或签名邮件, 则获取自动验证参数
        if(!parm.unread || autopass || parm.isSign){
            CC.getSmailNoVerify(mid,smailNoVerifyCall);
            return;
        }

        //如果是加密且未读的邮件
        if(parm.isEncrypt && parm.unread){
            var ibcTip = new parent.ToolTips({
                id: '',
                win: window,
                left: 85,
                top: 132,
                direction: parent.ToolTips.direction.Bottom
            }); 
            
            function suc(data){
                if(data){
                    if(data["var"].result == 1){
                        CC.showMsg(top.Lang.Mail.Write.jiemichenggong,true,false,"option");//解密成功
                        
                        var autopass = jQuery("#autopass", parent.document)[0].checked ? 1 : 0;
                        
                        //说明已经自动解密
                        if( autopass && typeof gMain != "undefined" && typeof gMain.userAttrs != "undefined" ){
                            gMain.userAttrs.modifyibcpwd = "1";
                        }
                        
                        try{
                             //未读邮件数量减少一
                            MM['sys1'].stats.unreadMessageCount--;
                            
                            var folder = new Folder();
                            
                            folder.refreshMenu('sys1');
                            
                        }catch(e){}   
                        
                        var ibcpass = jQuery("#ibcPwd", parent.document).val().trim();
                        
                        jQuery("#divDialogCloseconfirm", parent.document).click();

                        //验证成功跳转到读信正文页面
                        goRead(mid,name,parm,mi,closeTab,ibcpass,undefined);
     
                    } else if(data["var"].result == 0){
                        ibcTip.show( jQuery("#ibcPwd", parent.document)[0], top.Lang.Mail.Write.mmcwqzxsrjhkgL );//密码错误,请重新输入
                        return;
                    }else{
                        CC.showMsg(top.Lang.Mail.Write.mmcwcbHuecfzhzs,true,false,"error");//密码错误次数达到限制，请10分钟后重试
                        return;
                    }
                    
                }
            }
            
            CC.showUndoIBCdiv( suc, "", ibcTip );
        }else if(parm.isAttach == 1){ //附件管理文件夹，加密邮件验证
            var attachCall =  function(d){
                if(d.code == 'S_OK' && d["var"][0].flags){
                    var flags = d["var"][0].flags;
                    var read = flags.read;
                    var secureEncrypt = flags.secureEncrypt;
                    if(read == 1 && secureEncrypt == 1){
                        parent.CC.showMsg(top.Lang.Mail.Write.qdsxxpivqSzhzck, true, false, 'caution');//请到收信箱解密此封邮件之后再查看
                    }else if(read == 0){
                        CC.getSmailNoVerify(mid,smailNoVerifyCall);
                    }
                }
            };
            CC.getAttachRead(mid,attachCall);
        }
    }else{
        goRead(mid,name,parm,mi,closeTab);
    }
    
    //goRead(mid,name,parm,mi,closeTab);
    
    function goRead(mid,name,parm,mi,closeTab,ibcpass,smailNoVerify){
        //param.goto, 忽视缓存， 继续
        if(GE.tab.curid=="readMail"+mid && !parm.ignoreCache){return;}
        
        var type = gConst.readMail;
            
            
            parm = parm || {};
            isSession = parm.isSession || false;
            
            if(!MM.inited){
            MM.initModule(type);
        }
            
        var co = "";
        var o = type + mid;
        var fid = parm.fid;
        var data = {
            mode: "both",
            filterStylesheets: 0,
            filterImages: 0,
            filterLinks: 0,
            supportTNEF: 0,
            fileterScripts: 1,
            filterFrames: 1,
            markRead: parm.markRead || 0,
            encoding: parm.encode || gConst.encode_utf8,
            mid: mid,
            fid: fid
              
        };
        
        //需要给读信页验证
        if(typeof ibcpass != "undefined"){
            data.smailPass = ibcpass;
        }
        
        //smailNoVerify, 安全邮件自动解密串
        if( typeof smailNoVerify !== 'undefined' ){
            data.smailNoVerify = smailNoVerify;
        }
        
        if( typeof gMain != "undefined" ){
            if( gMain.ifibc == "1" ){
                data.returnHeaders = parm.returnHeaders || [];
            }
        }
        
        var func = gConst.func.readMail;
        if (CC.isSessionModeReadMail(fid) && isSession) {
            data.sessionId = parm.sessionId;
            data.readFlag = 0;
            data.start = parm.start || 0;
            data.total = 200;
            func = gConst.func.readSessionMail;
        }
        if (!MM[o] || parm.ignoreCache ) {
                //得到该模块的方法
            var rm = MM[type];
                
            MM[o] = {};
                
            Object.extend(MM[o], rm);
                
                //这封邮件继承这些方法
            var cd = MM[o];
                
            cd.name = o;
            cd.data = data;
            cd.inited = true;
            cd.isLoaded = false;
            cd.mi = mi;
            cd.func = func;
            cd.sessionId = data.sessionId;
            cd.rcptFlag = parm.rcptFlag || 5;
                
            MM[o].closeTab = closeTab;
            MM.goTo(o, 'fid', 2, parm.fid);
            MM.goTo(o, "omid", 2, mid);
            MM.goTo(o, "text", 2, name.replace(gConst.searchBrightKeyLeft, "").replace(gConst.searchBrightKeyRight, ""));
            MM.goTo(o, "name", 2, o);
            MM.goTo(o, "group", 2, o);
            MM.goTo(o, "data", 2, data);
        } else {
            MM[o].name = o;
            MM[o].mi = mi;
            MM[o].data = data;
            MM[o].text = name.replace(gConst.searchBrightKeyLeft, "").replace(gConst.searchBrightKeyRight, "");
            MM[o].func = func;
            MM[o].fid = parm.fid;
            MM[o].sessionId = data.sessionId;
            MM[o].closeTab = closeTab;
            MM[o].rcptFlag = parm.rcptFlag || 5;
        }

        //if(!cmid){
        MM.getModule(o);
        if (!MM[o]) {
            CC.updateTitle(name);
        }
        if (parm.callback) {
            setTimeout(function () {
                parm.callback.apply(parm.scope);
            }, 300);
        }
    //}else{
    //    co = type+cmid;
    ////   MM.getModuleByAjax(o, null, "", false, co);
    //    CC.updateTitle(name);
    //}
    }   
    
    
};
CC.getCurLabId = function () {
    return GE.tab.curid;
};

/**

 type: "login": 登陆日志; "send": 发信日志; "recv": 收信日志; "del": 删除日志; "agent": 代收邮件日志
 */

CC.goLogLink = function (name, type) {
    var url = "";
    if (typeof type === "string") {
        url = gMain.webPath + "/webtransit.do?sid=" + gMain.sid + "&func=log:userMain&type=" + type;
    }
    CC.goOutLink(url, "log", name);
};

CC.goOutLink = function (url, id, name) {
    CC.checkNetwork();
    jQuery("#" + LM.selectFolderId).removeClass("selectFolder_li");
    jQuery("#span_" + LM.selectFolderId).removeClass("selectFolder_li");
    LM.selectFolderId = id;
    jQuery("#" + id).attr("class", "selectFolder_li");
    url = GC.rfUrl(url);

    //弹出绑定手机号提示
    var setting = new Setting();
    if (setting) {
        setting.phoneBindTip(id);
    }
    CC.goLink(url, "outLink_" + id, name, "outLink");


};

CC.goBillmanager = function (o) {
    if (jQuery("#ifrm_outLink_billmanager").length == 0) {
        CC.goOutLink(gMain.webPath + '/webtransit.do?sid=' + gMain.sid + '&func=mail:billmanager', "billmanager", top.Lang.Mail.Write.zhangdanmingxi);//账单明细
        return false;
    } else {
        GE.tab.active("outLink_billmanager");
    }
};
CC.goBillmanagerFolder = function () {
    GE.tab.del("outLink_billmanager");
    CC.goFolder("8", "user8");
};
CC.showHideMenu = function (id, sh) {
    if (!id) {
        id = CC.getCurLabId();
    }
    var obj = $(gConst.divToolbar + id);
    if (obj) {
        obj.style.display = sh;
        GMC.setDivHeight(id);
    }
};
CC.hideMenu = function (id) {
    CC.showHideMenu(id, 'none');
};
CC.showMenu = function (id) {
    CC.showHideMenu(id, '');
};

CC.synData = function (obj, mn) {
    try {
        mn = mn || gConst.home;
        switch (mn) {
            case gConst.home:
                var home = MM[gConst.home];
                if (home.synData) {
                    home.synData(obj);
                }
                break;
            case 'common_addr':
                //刷新主框架通讯录数据
                LMD.freshData(synAddr);
                //刷新写信，传真页面侧边通讯录数据
                //synCompose();
                //刷新传真页面侧边通讯录数据
                //synFax();
                break;
            case 'inbox':
                var fid = GE.lastFolder || 'inbox';
                if (obj.refresh) {
                    MM[fid].isLoaded = false;
                }
                break;
        }
    }
    catch (e1) {
    }

    function synAddr() {
        try {
            var cTabs = GE.tab.composeTabs;
            for (var n in cTabs) {
                var win = CC.isCompose(n);
                if (win) {
                    win.oWrite.refreshAddr();
                }
            }
        }
        catch (e) {

        }


    }

    function synFax() {
        try {
            var owin = GMC.getFrameWin("fax");
            if (owin && owin.location.href.indexOf("MFaxSend.aspx") > -1) {
                owin.syncFaxAddr();
            }
        }
        catch (e) {
        }
    }

};
//首页左边搜索事件处理
CC.searchMailByMain = function () {
    var tKey = $(gConst.txtSearch);
    GE.folderObj.user = "";
    CC.searchMailByTop(tKey);
};
//按关键字从主题，收发件人快速搜索邮件的方法
CC.searchMailByTop = function (ot, parm) {
    parm = parm || [];
    var key = ot.value.trim();
    if (key == "") {
        CC.alert(Lang.Mail.search_InputKey, function () {
            ot.focus();
        });
        return;
    }
    //else 
    //    if ((!key.checkSpecialChar())) {
    //        CC.alert(Lang.Mail.search_NotInputThisChar, function(){
    //            ot.focus();
    //        });
    //        ot.focus();
    //        return;
    //    }
    var cond = [
        {field: "subject", operator: "contains", value: key},
        {field: "from", operator: "contains", value: key},
        {field: "to", operator: "contains", value: key}
    ];
    GE.searchKey = key;
    GE.folderObj.user = "";
    CC.searchMailByParm(key, 0, cond);
    ot.value = Lang.Mail.search_SearchMail;
};

CC.advSearchMailByTop = function (ot, searchList, flags, isFullSearch) {
    var key = ot.value.trim();
    if (key == "") {
        CC.alert(Lang.Mail.search_InputKey, function () {
            ot.focus();
        });
        return;
    }
    //else 
    //    if ((!key.checkSpecialChar())) {
    //        CC.alert(Lang.Mail.search_NotInputThisChar, function(){
    //            ot.focus();
    //        });
    //        ot.focus();
    //        return;
    //    }
    var cond = searchList;
    GE.folderObj.user = "";
    GE.searchKey = key;
    CC.searchMailByParm(key, 0, cond, flags, {}, isFullSearch);
    //ot.value = Lang.Mail.search_SearchMail;  
};
CC.advSearchMail = function (fid, searchList, flags, isFullSearch, label) {
    GE.folderObj.user = "";
    CC.searchMailByParm("", fid, searchList, flags, {}, isFullSearch, null, null, label);
};
CC.filterMail = function (fid, searchList, flags, isFullSearch, o, sentDate) {
    GE.folderObj.user = o;
    var isLoadNoReadMail = false;
    if (o == "sys0")
        isLoadNoReadMail = true;
    CC.searchMailByParm("", fid, searchList, flags, {}, isFullSearch, isLoadNoReadMail, sentDate);
};
CC.searchMailByFlag = function (fid, flags) {
    GE.folderObj.user = "";
    CC.searchMailByParm("", fid, [], flags);
};

/**
 * 搜索邮件夹的邮件夹
 * @param {Object} fid               邮件夹的id
 * @param {Object} isLoadNoReadMail  是否拿展示未读邮件
 * @param {boolean} flag 标识
 *
 *
 * fid
 *  0---    未读邮件
 *    1---    收件箱
 *    2---    草稿箱
 *    3---    已发送
 *    4---    已删除
 *    5---    垃圾邮件
 *    12---    网盘邮件夹
 *    13---    监控邮件
 *    14---    审核邮件
 */
CC.searchNewMail = function (fid, isLoadNoReadMail, label, flag) {
    var flags = {};

    fid = fid || 0;

    if (typeof label === "number") {
        label = [label];
    }

    // 如果是会议邀请传入的标识符
    if (flag && (flag.meeting === 1 || flag.meetingFlag === 1)) {
        flags = {
            meetingFlag: 1
        };
    } else if (flag && flag.taskFlag) { // 任务邮件
        flags = flag;
        Folder.taskType = flag.taskFlag;
    } else if (flag && flag.signed === 1) { // 敏感邮件
        flags = flag;
    } else if (flag && flag.starFlag === 1) {
        flags = flag;
    } else {
        flags = {read: 1};
    }
    if (flag && label) {
        label = undefined;
        flags.read = 1;
    }
    if (label && !flag) {
        fid = 0;
    }
    GE.folderObj.user = "";
    CC.searchMailByParm("", fid, null, flags, null, 2, isLoadNoReadMail, null, label);

    //如果有未读邮件夹（未读邮件可以移动到其他邮件夹） 左侧列表显示会改变 -->如：自定义(81/169),81表示未读邮件
    //如果没有未读，左侧列表显示-->如：自定义
    if (isLoadNoReadMail) {
        jQuery("#" + LM.selectFolderId).removeClass("selectFolder_li");
        jQuery("#span_" + LM.selectFolderId).removeClass("selectFolder_li");
        LM.selectFolderId = 0;
        jQuery("#0").attr("class", "selectFolder_li");
    }
};

/**
 * 搜索写死的邮件夹的未读邮件，比如会议邀请、敏感邮件、任务邮件
 * @param {Number} fid 文件夹id
 */
CC.searchFolderNoRead = function (fid) {
    var flags = GE.searchFlag;
    flags.read = 1;
    CC.searchMailByParm("", fid, null, flags, null, 2, false);
};

/**
 * 实现按指定条件搜索
 * @param {String} key 搜索关键字
 * @param {Object} fid 邮件夹id
 * @param {Array} cond 搜索条件的数组对象
 * @param {Object} opt 搜索选项
 */
CC.searchMailByParm = function (key, fid, cond, flags, opt, isFullSearch, isLoadNoReadMail, sentDate, label) {
    var ps = CC.getPageSize();
    opt = opt || {};
    fid = fid || 0;
    cond = cond || [];
    flags = flags || {};
    GE.currentFid = fid;
    GE.searchFlag = flags;
    isFullSearch = typeof(isFullSearch) == "undefined" ? 2 : isFullSearch;
    var order = GE.list.order;
    var desc = 1;
    var recursive = opt.recursive || 0;
    var ignoreCase = opt.ignoreCase || 0;
    var total = CC.getPageSize();
    var searchParam = {
        fid: fid,
        order: order,
        desc: desc,
        recursive: recursive,
        condictions: cond,
        flags: flags,
        total: total,
        start: 1,
        ignoreCase: ignoreCase,
        isSearch: 1,
        statType: 1,
        isFullSearch: isFullSearch
    };

    if (sentDate) {
        searchParam.sentDate = sentDate;
    }

    if (label) {
        searchParam.label = label;
    }
    if (isLoadNoReadMail && !fid) {
        //searchParam.exceptFids=[{"exceptFid":2},{"exceptFid":3},{"exceptFid":4},{"exceptFid":5}];
        searchParam.exceptFids = [2, 3, 4, 5, 6, 8, 10];
    }

    if (flags.meetingFlag) {
        searchParam.exceptFids = [2, 4, 5, 8, 10]; // 会议邀请需要排除的文件夹
    } else if (flags.taskFlag) {
        searchParam.exceptFids = []; // 任务邮件需要排除的文件夹
    } else if (flags.signed) {
        searchParam.exceptFids = [2, 3, 4, 5, 8];
    } else if (flags.starFlag) {
        searchParam.exceptFids = [4];
    }

    if (key) {
        GE.searchKey = key;
    } else {
        GE.searchKey = "";
    }
    GE.searchData = searchParam;
    CC.searchMail(searchParam, isLoadNoReadMail);
};

/**
 * 逼近式搜索
 */
CC.approachSearch = function (type) {
    var searchParam = GE.searchData,
        type = type || 0;

    searchParam.isSearch = type;
    searchParam.start = 1;
    searchParam.approachSearch = GE.approachSearchData;
    GE.searchData = searchParam;
    CC.searchMail(searchParam, false);
};
/**
 * 通用搜索函数，接收一个搜索参数对象
 * @param {Object} searchParam 搜索参数对象
 */
CC.searchMail = function (searchParam, isLoadNoReadMail) {
    /*
     if(!GC.check("MAIL_CONFIG_MAILSEARCH")){
     CC.forbidden();
     return;
     }
     */
    var data = {
        func: gConst.func.searchMail,
        data: searchParam,
        call: mcb,
        msg: Lang.Mail.search_NowSearch
    }
    var ss = searchParam;
    //if(GE.folderObj.user)
    // MM.mailRequest(data);
    //else
    MM.mailRequestApi(data);
    function mcb(au) {
        var name = GE.folderObj.user || GE.folderObj.search;
        GE.currentFolderModule = name;
        //GE.folderObj.user = "";
        if (au.code == gConst.statusOk) {
            var d = au["var"];
            var ps = CC.getPageSize();
            //if (d.length > 0) {
            CM[name] = au;
            MM[name].stats = au.stats;
            MM.laterRequestModule = name;
            if (isLoadNoReadMail) {
                MM[name].isLoadNoReadMail = true;
                MM[name].text = Lang.Mail.Write.unRead_mail;
                //MM[name].text=Lang.Mail.Write.searchResult;
            } else if (MM[name].isSearch) {
                MM[name].isLoadNoReadMail = false;
                //"搜索结果"
                MM[name].text = Lang.Mail.Write.searchResult;
            } else {
                MM[name].isLoadNoReadMail = false;
            }

            //邮件夹名称赋值 
            if(au && au.stats && au.stats.folders && au.stats.folders[0]){
                MM[name].text = au.stats.folders[0].folderName;
            }

            // 如果是会议邀请
            if (ss.flags && ss.flags.meetingFlag) {
                MM[name].text = top.Lang.Mail.Write.huiyiyaoqing;//会议邀请
            }
            if (ss.flags && ss.flags.taskFlag) {
                MM[name].text = top.Lang.Mail.Write.daibanyoujian;//待办邮件
            }
            if (ss.flags && ss.flags.signed) {
                MM[name].text = top.Lang.Mail.Write.minganyoujian;//敏感邮件
            }
            if (ss.flags && ss.flags.starFlag) {
                MM[name].text = top.Lang.Mail.Write.xingbiaoyoujian;//星标邮件
            }
            MM.createModule(name);
            if (CC.power.offSensMail() && !CC.getUserAttributeFromLocal("tipsSensOpen")) {
                SensitiveMail.openTips();
            }
            /*
             if (isLoadNoReadMail) {
             MM[name].isLoadNoReadMail = false;
             }
             */
            //}else{
            //    CM[name] = {};
            //    MM[name].stats = {};
            //    CC.alert(Lang.Mail.search_Null);
            //}
        }
    }
};

/**
 * 获取往来邮件，利用搜索接口
 * @param sd
 */
CC.getContactMail = function (sd) {
    var cb = sd.callback || function () {
    };
    var searchParam = sd.searchParam;
    var data = {
        func: gConst.func.searchMail,
        data: searchParam,
        call: cb,
        msg: Lang.Mail.search_NowSearch
    };
    MM.mailRequestApi(data);
};

CC.getSubConfig = function () {
    var func = function () {
        var objMenu = {
            id: "setMenu",
            name: "setConfig",
            div: $("divSetMenu")
        };
        var objSubMenu = [];
        objSubMenu.notNeedCss = true;
        //if (GC.check("MAIL_CONFIG_PASSWORD")) {
        objSubMenu.push({
            isShow: 1,
            name: "MAIL_CONFIG_INDEX",
            text: Lang.Mail.tb_MailSetting,
            url: function () {
                CC.setConfig();
            },
            attrs: "sep=true"
        });
        //}
        //if (GC.check("MAIL_CONFIG_PASSWORD")) {
        objSubMenu.push({
            isShow: 1,
            name: "MAIL_CONFIG_PASSWORD",
            text: Lang.Mail.tb_ModPwd,
            url: function () {
                CC.setConfig("password");
            },
            attrs: "sep=true"
        });
        //}
        //if (GC.check("MAIL_CONFIG_MAILPOP")) {
        objSubMenu.push({
            isShow: 1,
            name: "MAIL_CONFIG_MAILPOP",
            text: Lang.Mail.tb_MailPOP,
            url: function () {
                CC.setConfig("mailPOP");
            }
        });
        //}
        if (GC.check("MAIL_MANAGER_FILTER")) {
            objSubMenu.push({
                isShow: 1,
                name: "MAIL_CONFIG_FILTER",
                text: Lang.Mail.tb_MailFilter,
                url: function () {
                    CC.setConfig("filter");
                }
            });
        }
        CC.getMenu(objMenu, objSubMenu);
    };
    CC.getSubConfig = func;
    CC.getSubConfig();
    /*objSubMenu[objSubMenu.length] = [Lang.Mail.tb_MailSetting, function(){
     CC.setConfig();
     }, true];
     objSubMenu[objSubMenu.length] = [];
     objSubMenu[objSubMenu.length] = [Lang.Mail.tb_MailNotify, function(){
     CC.setConfig('notify');
     }];
     objSubMenu[objSubMenu.length] = [Lang.Mail.tb_ModPwd, function(){
     CC.setConfig('password');
     }];
     objSubMenu[objSubMenu.length] = [Lang.Mail.tb_MailPOP, function(){
     CC.setConfig('mailPOP');
     }];
     objSubMenu[objSubMenu.length] = [];
     objSubMenu[objSubMenu.length] = [Lang.Mail.tb_MailFilter, function(){
     CC.setConfig('filter');
     }];*/

};

CC.getSearchMenu = function () {
    var objMenu = {
        id: "hSearchMenu",
        name: "hSearch",
        div: $("divSearch")
    };
    var objSubMenu = [];
    objSubMenu.notNeedCss = true;
    //if (GC.check("MAIL_CONFIG_MAILSEARCH")) {
    objSubMenu.push({
        isShow: true,
        name: "MAIL_INBOX_SEARCH",
        text: Lang.Mail.search_SearchMail,
        attrs: "isBold=true&clsName=fixHeight",
        url: function () {
            CC.searchMailByTop($(gConst.txtSearch));
        },
        children: []
    });

    objSubMenu.push({
        isShow: true,
        name: "MAIL_INBOX_HIGHSEARCH",
        text: Lang.Mail.search_HighSearch,
        attrs: "clsName=fixHeight",
        url: function () {
            CC.goSearch();
        },
        children: []
    });
    /***
     * 附件管理
     */
    objSubMenu.push({
        isShow: true,
        name: "MAIL_ATTACH_LIST",
        text: Lang.Mail.ConfigJs.attachManage,
        attrs: "clsName=fixHeight",
        url: function () {
            CC.goAttachList();
        },
        children: []
    });
    //}
    /*objSubMenu[objSubMenu.length] = [Lang.Mail.search_SearchMail, function(){
     CC.searchMailByTop($(gConst.txtSearch));
     }, true];
     objSubMenu[objSubMenu.length] = [Lang.Mail.search_HighSearch, function(){
     CC.goSearch();
     }];*/
    CC.getMenu(objMenu, objSubMenu);
};

/**
 * 通用刷新方法
 * 通讯录刷新：id:"addr" ,m : "g"|"p"
 * @param {string} id
 * @param {string} m 模块
 */
CC.refreshModule = function (id, m) {
    id = id || "";
    m = m || "";
    var objIfrm = GMC.getFrameWin(id);
    if (id == "address" && objIfrm) {
        if (m == "g") {
            if (objIfrm.ReFresh_G) {
                objIfrm.ReFresh_G();
            }
        }
        else {
            if (objIfrm.ReFresh_P) {
                objIfrm.ReFresh_P();
            }
        }
    }
};
CC.closeAllTabs = function () {

    var aChangedFrame=getChangedFrames();
    if(aChangedFrame.length==0){//没有未保存的直接跳转
        GE.tab.closeAll();
    }else if(aChangedFrame.length>0){
        parent.CC.confirm(top.Lang.Mail.Write.nhywwsAUkxzsfgb, function(){//您还有未完成编辑操作，是否关闭？
            GE.tab.closeAllForce();
        });
    }
    return false;
};

CC.getFolderTypeName = function (type) {
    var tn = GE.folder.user;
    if (type === 1) {
        tn = GE.folder.sys;
    } else if (type === 3) {
        tn = GE.folder.user;
    } else if (type == 5) {
        tn = GE.folder.label;
    }
    return tn;
};

CC.getPageSize = function () {
    var ps = gMain.pageSize - 0;
    ps = ps > 0 ? ps : GE.list.pageSize;
    return ps;
};

CC.getTimezone = function () {
    var tz = GC.getCookie("Timezone");
    tz = tz || gMain.Timezone || "8";
    return tz;
};

CC.getReadMode = function () {
    var rm = gMain.readMailMode || "0";
    return rm;
};

/***
 * 返回附件下载的Url
 * @param {Object} mid
 * @param {Object} offset
 * @param {Object} size
 * @param {Object} name
 * @param {Object} type 类型
 * @param {Object} encoding
 */
CC.getDownloadLink = function (mid, offset, size, name, type, encoding, denyForward) {
    var url = "{0}?func={1}&sid={2}&mid={3}&offset={4}&size={5}&name={6}&type={7}&encoding={8}";
    name = encodeURIComponent(name);
    url = url.format(gConst.downloadUrl, gConst.func.download, gMain.sid, mid, offset, size, name, type, encoding);
    if (denyForward) {
        url = url + "&df=1";
    }
    return url;
};

/***
 * 返回附件打包下载的Url
 * @param {Object} mid
 * @param {Object} offset
 * @param {Object} size
 * @param {Object} name
 * @param {Object} type 类型
 * @param {Object} encoding
 */
CC.getDownloadsLink = function (mid, format) {
    var url = "{0}?func={1}&sid={2}&mid={3}&format={4}";
    format = format || "zip";
    url = url.format(gConst.uploadUrl, gConst.func.autopack, gMain.sid, mid, format);
    return url;
};

/***
 * 打包下载调用
 * @param {Object} attachments
 * @param {Object} name
 * @param {Object} mid
 */
CC.downloads = function (attachments, name, mid) {
    var data = [];
    for (var i = 0; i < attachments.length; i++) {
        data.push({
            mid: mid || attachments[i].mid,
            offset: attachments[i].fileOffSet || attachments[i].attachOffset,
            size: attachments[i].fileSize || attachments[i].attachSize || 0,
            name: encodeURIComponent(attachments[i].fileName || attachments[i].attachName),
            encoding: attachments[i].encoding || attachments[i].encode
        });
    }
    var xmlData = {
        version: '1.0',
        fileName: encodeURIComponent(name),
        format: 'zip',
        compress: 0,
        items: data
    };
    var obj = {
        url: gConst.packDownUrl + "?func={0}&sid={1}".format(gConst.func.pack, gMain.sid),
        data: xmlData,
        /***
         * 附件打包请求 完成
         * @param {Object} resp
         */
        call: function (resp) {
            var retCode = resp["var"].retCode;
            var taskno = resp["var"].taskno;
            if (resp.code == "S_OK") {
                if (retCode == 0) {
                    window.setTimeout(
                        function () {
                            CC.queryPack(taskno);
                        }, 100);
                }
            } else {
                CC.confirm(Lang.Mail.dabaoWrongRetry, function () {
                    CC.downloads(data.name);
                });
            }
        },
        msg: Lang.Mail.dabaoing
    };
    MM.mailRequestApi(obj);
};

/***
 * 附件打包查询
 * @param {Object} taskno
 */
CC.queryPack = function (taskno) {
    var obj = {
        url: gConst.packDownUrl + "?func={0}&sid={1}&taskno={2}".format(gConst.func.queryPack, gMain.sid, taskno),
        /***
         * 附件打包 完成
         * @param {Object} resp
         */
        call: function (resp) {
            var id = "downloads";
            var retCode = resp["var"].retCode;
            var tn = resp["var"].taskno;
            var status = resp["var"].status; //fileName,fileSize
            if (status == 2) {
                var url = gConst.packDownUrl + "/?func={0}&sid={1}&taskno={2}".format(gConst.func.downloadPack, gMain.sid, tn);
                var html = [];
                html.push('<p class="msgDialog">' + Lang.Mail.dbComplete + '</p>');
                html.push('<p class="action dialogAction">');
                html.push('<a class="btn" href="{0}"  onclick="CC.closeMsgBox(\'{2}\')" id="{1}" style="width:5.5em"><b class="r1"></b><span class="rContent"><span>' + Lang.Mail.loadAt + '</span></span><b class="r1"></b></a>'.format(url, "attachPack0", id));
                html.push('<a class="btn" href="javascript:fGoto();" id="{0}" onclick="CC.closeMsgBox(\'{1}\')" style="width:5.5em"><b class="r1"></b><span class="rContent"><span>' + Lang.Mail.cancelLoad + '</span></span><b class="r1"></b></a>'.format("attachPack1", id));
                html.push("</p>");
                var ao = {
                    id: id,
                    title: Lang.Mail.pkComplete,
                    text: html.join("")
                };
                CC.msgBox(ao);
            } else if (status < 2) {
                window.setTimeout(function () {
                    CC.queryPack(tn);
                }, 100);
            } else {
                fc(resp);
            }
        },
        failCall: function (resp) {
            fc(resp);
        }
    };
    var fc = function (resp) {
        CC.alert(Lang.Mail.pkFail + resp["var"].status);
    };
    MM.mailRequestApi(obj);
};


/***
 * 返回文件夹信息/type为空，默认返回系统文件夹和用户文件夹
 * @param {Object} type 文件夹类别[GE.folder.sys,GE.folder.user]
 * @return {Object} [{fid:1,name:'收件箱'},...]
 */
CC.getFolders = function (type) {
    if (!type) {
        type = [GE.folder.sys, GE.folder.admin, GE.folder.user, GE.folder.pop];
        //type = [GE.folder.sys, GE.folder.user];
    }

    var items = [];
    if (typeof(type) == 'object') {
        for (var i = 0; i < type.length; i++) {
            var o = MM[gConst.folderMain].Folders[type[i]];
            if (o) {
                items = items.concat(o);
            }
        }
    } else {
        items = MM[gConst.folderMain].Folders[type];
    }
    return items;
};

/***
 * 返回签名列表对象
 * @param {Object} call 回调函数
 */
CC.getSignList = function (call) {
    var sign = 'Option_Sign';
    if (CM[sign] && typeof(call) == 'function') {
        call(CM[sign]);
    }
    else {
        var callback = function (values) {
            CM[sign] = values['var'];
            if (typeof(call) == 'function')
                call(CM[sign]);
        };
        var obj = {
            func: gConst.func.getSign,
            data: {},
            call: callback,
            failCall: ''
        };
        MM.mailRequest(obj);
    }
};

/**
 * 判断标签是否为写信页面
 * @param {String} tableId 标签id
 */
CC.isCompose = function (tableId) {
    try {
        if (tableId && tableId.indexOf("compose_") >= 0) {
            var ifrm = $(gConst.ifrm + tableId);
            var win = ifrm ? ifrm.contentWindow : null;
            if (win && win.location.href.indexOf(gConst.composeFile) > -1) {
                return win;
            }
        }
    } catch (e) {
        return false;
    }
    return false;
};

CC.getMailText = function (str, dv, ext) {
    var text = str || "";
    text = text.trim();
    text = text || dv || "";
    text = text.encodeHTML();
    return text;
};

CC.getMailContent = function (data) {
    var dt = data.text || {};
    var md = (data.isHtml) ? data.html : dt;
    var mailContent = "";
    var isFix = false;
    if (typeof(md) == "object") {
        mailContent = md.content || "";
        if (data.isHtml && mailContent == "" && dt.content) {
            mailContent = dt.content;
            isFix = true;
        }
        if (!data.isHtml || isFix == true) {
            mailContent = mailContent.encodeHTML();
            mailContent = mailContent.replace(/\n/g, "<br>");
        }
    }
    return mailContent;
};

CC.getMailTip = function (s) {
    var tip = s || "";
    tip = tip.replace(/\"/g, "\\\");
    return tip;
};

/**
 * 发送已读回执
 * @param {Number} req 是否发送回执
 * @param {Object} data 回执信息对象
 */
CC.sendMDN = function(req,data,to){
    try {
        if (req == 1 && typeof(data) == "object") {
            //可能是别名发信这里做处理
            if( to ) {
                data.account = to;
            }
            
            CC.confirm(Lang.Mail.readMail_lb_receiveRecord, function () {
                var obj = {
                    func: gConst.func.sendMDN,
                    data: data,
                    call: function (resp) {

                    },
                    failCall: function () {
                        CC.alert(Lang.Mail.fail);
                    }
                };
                MM.mailRequestApi(obj);
            });
        }
    } catch (e) {

    }
};
/**
 * 向webApi服务器进行Ajax请求
 * @param {Object} url请求的url
 * @param {Object} call 回调函数
 * @param {Object} param 参数
 * {
 *   resType:'response type',
 *   encode:'gb2312',
 *   data:"post data"
 * }
 */
CC.requestWebApi = function (url, cb, param) {
    url = GC.rfUrl(url);
    param = param || {};
    var method = param.method || "get";
    var apiFrm = window.frames[gConst.ifrmWebApi] || Ajax;
    if (apiFrm && typeof(apiFrm.getXMLHttp) == "function") {
        var xmlHttp = apiFrm.getXMLHttp();
        var ao = {
            url: url,
            method: method,
            callback: cb,
            failCall: param.failCall,
            data: param.data || "",
            resType: param.resType || "script",
            encode: param.encode,
            xmlHttp: xmlHttp
        };
        Ajax.request(ao);
    }
};

/**
 * 写信页：添加通讯录成功后隐藏通讯录按钮
 * @param {Object} mid
 */
CC.hideReadMailAddr = function (mid, index) {
    try {
        var o = gConst.ifrmReadmail + gConst.readMail + mid;
        var win = window.frames[o];
        if (win) {
            win.oSM.hideAddAddr(mid, index);
        }
    }
    catch (e) {
    }
};


/**
 * 判断联系人是否存存于通讯录中公共方法
 * @param {string} mail 要判断的邮箱地址/或手机号码
 * @param {string} type 类型 email:邮箱地址,mobile:手机号码
 * @param {Array} addr 指定在哪种类型通讯录中判断，默认只会在个人通讯录判断
 */
CC.isInAddr = function (mail, type, addr) {
    try {

        var groupDatas = LMD.userContancts;
        for (var i = 0; i < groupDatas.length; i++) {
            if (groupDatas[i][3] == mail) {
                return true;
            }
        }
        /*var di = LMD.listIndex;
         var gi = LMD.groupIndex;
         var iItem = gi["items"];
         addr = addr || ["PERSON"];
         type = type || "email";
         var iValue = di[type];

         for(var i=0,il=addr.length;i<il;i++){
         var groupDatas = LMD.userContancts[LMD.typeIndex[addr[i]]];
         for (var gid in groupDatas) {
         var items = groupDatas[gid][iItem] || [];
         for (var k =0,kl=items.length; k < kl; k++) {
         var item = items[k];
         if(item[iValue]==mail){
         return true;
         }
         }
         }
         } */
        return false;
    } catch (e) {
        return false;
    }
};

/**从服务器端判断邮箱地址是否存在于个人通讯录中
 * 如果操作出现异常，将认为在通讯录中不存在
 * @param {Object} mail 要判断的邮箱地址
 * @param {Object} cb 回调函数，参数为boolean，存在为:true,不存在为false
 */
CC.inAddr = function (mail, cb) {
    var data = [];
    var callback = function (data) {
        if (data.code == gConst.statusOk) {
            var ret = data["var"];
            if (typeof(cb) == "function") {
                cb(ret[0]);
            }
        } else {
            cb(false);
        }
    };
    data.push(mail);
    parent.MM.doService({
        url: "/addr/user",
        func: "addr:isExist",
        data: {
            value: data
        },
        failCall: callback,
        call: callback
    });
};

CC.getMainMenu = function (name) {
    for (var i = 0; i < gMenu.length; i++) {
        if (gMenu[i].name == name) {
            return gMenu[i];
        }
    }
}

CC.getMailMenu = function (name) {
    return gMenu;
    var mn = gConst.menu.mail;
    var menu = CC.getMainMenu(mn);
    var mid = mn + "_" + name;
    if (menu) {
        var cm = menu.children || [], len = cm.length;
        for (var i = 0; i < len; i++) {
            var m = cm[i];
            if (m.name == mid) {
                return m.children || [];
            }
        }
    }
    return [];
};

CC.forbidden = function () {
    CC.alert(Lang.Mail.error_FA_FORBIDDEN);
};


/***
 * 获取附件类型
 * @param {Object} filename 附件名
 * @param {Object} filesize 附件大小
 */
CC.getAttachType = function (filename, filesize) {
    var result = {
        isView: false,
        className: '',
        type: ''
    };
    //if (gMain.isView) {
    filename = filename.toLowerCase();
    var ico = "attach_ico ";
    var icoClass = [ico + "a_unknow", ico + "a_doc", ico + "a_xls", ico + "a_ppt", ico + "a_pdf", ico + "a_txt", ico + "a_html", ico + "a_img", ico + "a_zip"];
    var allow_ext = [".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".pdf", ".txt", ".htm", ".html", ".gif", ".jpg", ".jpeg", ".bmp", ".png", ".ico", ".jpe", ".tiff", ".jfif", ".tif", ".rar", ".zip", ".7z"];
    result.className = icoClass[0];
    result.isView = false;
    for (var i = 0; i < allow_ext.length; i++) {
        if (filename.length == (filename.indexOf(allow_ext[i]) + allow_ext[i].length)) {
            result.isView = true;
            switch (allow_ext[i]) {
                case '.doc':
                case '.docx':
                    result.className = icoClass[1];
                    break;
                case '.xls':
                case '.xlsx':
                    result.className = icoClass[2];
                    break;
                case '.ppt':
                case '.pptx':
                    result.className = icoClass[3];
                    break;
                case '.pdf':
                    result.className = icoClass[4];
                    break;
                case '.txt':
                    result.className = icoClass[5];
                    break;
                case '.htm':
                case '.html':
                    result.className = icoClass[6];
                    result.isView = false;
                    break;
                case '.gif':
                case '.jpg':
                case '.jpeg':
                case '.bmp':
                case '.png':
                case '.ico':
                case '.jfif':
                case '.tiff':
                case '.tif':
                case '.jpe':
                    result.className = icoClass[7];
                    result.type = 'image';
                    break;
                case '.zip':
                case '.rar':
                case '.7z':
                    result.className = icoClass[8];
                    result.type = 'zip';
                    break;
                default:
                    result.className = icoClass[0];
                    result.isView = false;
                    break;
            }

            break;
        }
    }
    //}
    if (filename.indexOf(".") == -1)
        result.isView = false;
    return result;
};

CC.isExtMail = function () {
    return window.LoginType == gConst.loginType.pm || window.LoginType == gConst.loginType.mm;
};

CC.doLink = function (link) {
    var wo = function () {
        window.location.href = link;
    };

    CC.confirm(Lang.Mail.ConfigJs.sureLeveMail, wo, Lang.Mail.ConfigJs.mailpop_sysPrompt);
};

CC.showExtMailSelect = function (obj) {
    var div = $("ExtSelectDiv");
    if (!div) {
        div = El.createElement("div", "ExtSelectDiv", "pop_selectmail");
    }
    var list = extmailList;
    var html = [];
    html.push('<h2>');
    if (CC.isExtMail()) {
        html.push(Lang.Mail.selectPublicMail);
    } else {
        html.push(Lang.Mail.selectGrantMail);
    }
    html.push('</h2>');
    html.push('<div class="pop_body">');
    var ts = [];
    var bs = [];
    ts.push('<ul class="manager_ul">');
    bs.push('<ul class="user_ul">');
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var val = item.mailId;
        var name = item.mailId + '@' + gMain.domain + ' (' + item.mailName + ')'
        var type = item.type;
        var link = gMain.webPath + '/login/selectmail.do?sid=' + gMain.sid + '&mailid=' + val + '&relationtype=' + type;
        var isSelect = (gMain.uid == val && gMain.relationType == type);
        var temp = '';
        if (isSelect) {
            temp += '<li><a href="javascript:fGoto();" class="on">'
        } else {
            // temp += '<li><a href="'+link+'">'
            temp += "<li><a href='javascript:void(0);' onclick='CC.doLink(\"" + link + "\")';>";
        }
        if (type === 0) {
            ts.push(temp);
            ts.push('<i class="i_mgr"></i><span title="' + name + '">' + name + '</span></a></li>');
        } else {
            bs.push(temp);
            bs.push(name + '</a></li>');
        }
    }
    ts.push("</ul>")
    bs.push("</ul>")
    html.push(ts.join(""));
    html.push(bs.join(""));
    html.push('</div>');
    if (CC.isExtMail()) {
        html.push('<p class="pop_setBtn"><a href="javascript:fGoto();" onclick="CC.setConfig(\'defaultAccount\');">' + Lang.Mail.setDefaultMailId + '</a></p>');
    }
    div.style.position = "absolute";
    div.style.left = (El.getX(obj) - 150) + "px";
    div.style.top = (El.getY(obj) + El.height(obj) + 10) + "px";
    div.innerHTML = html.join("");
    document.body.appendChild(div);
    El.show(div);
    EV.stopEvent();
    EV.addEvent(document, "click", function () {
        El.hide($("ExtSelectDiv"));
    });

}

/**
 * @param {object} o 包括两个数组，第一部分mails: 包含邮件对象的数据，第二部分sessionMails：包含
 * 会话邮件对象的数据。callback: 举报完成时的回调函数。数据格式统一如下：
 * {
 *    email: 'zhangsan@richinfo.com', //邮件地址
 *    mid: '008521f245224503001', //邮件id
 *    userName: '张三' //邮件发起人姓名/账号
 * }
 */
CC.inform = function (o) {
    var title = Lang.Mail.Write.sysPrompt;
    var html = [];
    var mails = o.mails;
    var sessionMails = o.sessionMails || [];
    var ms = {}, txt = "";
    var successCallback = o.callback || function () {
    };
    this.ms = ms;

    for (var i = 0, l = mails.length; i < l; i++) {
        mails[i].checked = false;
        ms[mails[i].email] = mails[i];
    }
    for (var i = 0, l = sessionMails.length; i < l; i++) {
        sessionMails[i].checked = false;
        ms[sessionMails[i].email] = sessionMails[i];
    }

    var callback = function () {
        var mids = [];
        for (var i = 0, l = mails.length; i < l; i++) {
            mids.push(mails[i].mid);
        }
        try {
            //CC.showMsg('正在举报邮件');
            MM[o.moduleId].move(mids, 5, Lang.Mail.list_NowMoveMail, (o.sessionId ? [o.sessionId] : ""), Lang.Mail.opSuc);
            var sender = getSender();
            if (sender != "") {
                black.addBlack(getSender(), successCallback);
            }
            if (typeof(o.callback) == "function") {
                o.callback();
            }

        }
        catch (e) {

        }
        function getSender() {
            var ids = [];
            for (var k in ms) {
                if (k && ms[k] && ms[k].checked) {
                    ids.push(k);
                }
            }
            return ids.join(',');
        }
    };
    var cancelback = function () {
    };
    if (!mails || mails.length == 0) {
        CC.alert(Lang.Mail.sysW);
        return;
    }

    var lists = [];
    for (var k in ms) {
        if (k && ms[k] && k != gMain.loginName) {
            if (ms[k].userName) {
                txt = ms[k].userName + '({0})';
            }
            else {
                txt = '{0}';
            }
            txt = txt.format(k);

            lists.push('<div class="inform_dialog_item"><input id="chk_box_' + k.encodeHTML() + '" type="checkbox" value="' + k.encodeHTML() + '" onclick="CC.updateMs(\'' + k + '\', this.checked);" /><label for="chk_box_' + k.encodeHTML() + '">&nbsp;' + txt + '</label></div>');
        }
    }

    html.push('<div style="text-align:left; line-height:24px; padding:12px 0 0 24px;">');
    //html.push('<h3 class="dialog_title">' + Lang.Mail.ConfigJs.areYouSureInformThisEmail + '</strong></h3>');
    html.push('<ol class="dialog_ol"><li>' + Lang.Mail.choisedRmove + '"' + $("span_5").title + '"</li>');
    if (lists.length > 0) {
        html.push('<li>' + Lang.Mail.ConfigJs.addEmailSenderIntoBlacklist + '</li>');
    }
    html.push('</ol>');
    html.push('<div id="inform_user_select">');
    html.push(lists.join(''));
    html.push('');
    html.push('</div>'); //end inform_user_select
    html.push('</div>');
    var ao = {
        id: 'confirm_inform',
        title: title,
        type: 'div',
        text: html.join(''),
        changeStyle: false,
        zindex: 1090,
        dragStyle: 1,
        width: 400,
        buttons: [
            {
                text: Lang.Mail.Ok,
                clickEvent: callback
            },
            {
                text: Lang.Mail.Cancel,
                clickEvent: cancelback,
                isCancelBtn: true
            }
        ]
    };
    CC.msgBox(ao);
    var ius = $('inform_user_select');
    if (El.height(ius) > 120) {
        El.height(ius, 120)
    }
};
CC.updateMs = function (m, b) {
    this.ms[m].checked = b || false;
}

CC.checkConfig = function (name) {
    if (name) {
        var isOk = false;//GC.check(name);

        if (name.toLowerCase() == 'index') {
            isOk = GC.check("MAIL_CONFIG_INDEX");
        }
        else {
            if (typeof window[name] != 'undefined') {
                if (window[name].attrs) {
                    if (window[name].attrs.free) {
                        isOk = true;
                    }
                    else if (window[name].attrs.authority) {
                        isOk = GC.check(window[name].attrs.authority);
                    }
                }
            }
        }
        var cType = CorpType;

        if (window.gMain && gMain.urlYaddr &&
            (name.toLowerCase() == 'skin' || name.toLowerCase() == 'password'
                || name.toLowerCase() == 'face' || name.toLowerCase() == 'phonebind' || name.toLowerCase() == 'defaultaccount')) {
            isOk = false;
        }

        if (!CC.isExtMail()) {
            /*如果是个人邮箱
             OA邮箱中是不用登陆提醒的（公共邮箱可以有）
             */
            if (cType == 1 && name == "loginNotify") {
                isOk = false;
            } else {
                isOk = isOk && !parseInt(gConst.extMailMenus[name]);
            }
            if (name.toLowerCase() == 'memmanager') {
                isOk = false;
            }
        }
        else {
            if (name.toLowerCase() == "defaultaccount") {
                isOk = true;
            }
        }
        return isOk;
    } else {
        return false;
    }
};
/***
 * 获取附件预览
 * @param {Object} viewServer 预览服务器域名
 * @param {Object} src 类型 cmail
 * @param {Object} sid
 * @param {Object} download_link 附件下载地址
 * @param {Object} usernumber 用户帐号
 * @param {Object} filename 文件名
 * @param {Object} filesize 文件大小
 * @param {Object} mo 邮件id
 */
CC.getViewLink = function (viewServer, src, sid, download_link, usernumber, filename, filesize, mailid, fileid, denyForward) {
    var url = '{0}/se/mail/preview.do?src={1}&sid={2}&dl={3}&usernumber={4}&fi={5}&filesize={6}&mo={7}&id={8}&denyForward=' + denyForward;
    download_link = encodeURIComponent(download_link);
    filename = encodeURIComponent(filename);
    url = url.format(viewServer, src, sid, encodeURIComponent(download_link), gMain.loginName, encodeURIComponent(filename), filesize, gMain.loginId, fileid);

    return url;
};

/**
 * 校验是否支持Flash
 */
CC.checkSupportFlash = function () {
    var isFlash = false;
    if (Browser.isIE || window.ActiveXObject) {
        try {
            var flash = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.10");
        } catch (e) {
            try {
                var flash = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.9");
            } catch (e) {
            }
        }
        isFlash = !!flash;
    }
    else {//非IE
        var swf = navigator.plugins["Shockwave Flash"];
        if (swf) {
            isFlash = true;
        }
        else {
            isFlash = false;
        }
    }
    return isFlash;
};

/**
 * 邮件导入
 */
CC.importMail = function () {
    var ao = {
        id: 'import_mail',
        title: Lang.Mail.emailImport,//eml邮件导入
        type: 'text',
        text: getUI(),
        zindex: 9999,
        dragStyle: 1
    };

    /*
     * 表单实现
     *
     */

    // CC.msgBox(ao);
    // RegisterEvts();

    /*
     * Flash 实现
     */
    ao.text = getFlashUI();
    CC.msgBox(ao);
    implementInterface();

    function getUI() {
        var html = [];
        html.push('<div><form id="importEml_form" method="post" enctype="multipart/form-data" target="import_mail_frm">');
        html.push(Lang.Mail.choiselala);
        html.push(getFolders());
        html.push(Lang.Mail.choiselulu);
        html.push('<input type="file" id="import_mail_input" name="body" onchange="" />');
        html.push('</form></div>');
        html.push('<div id="import_mail_progress"></div>');
        html.push('<iframe id="import_mail_frm" name="import_mail_frm" src="' + gMain.rmSvr + '/RmWeb/blank.htm" onload="ImportMailLoaded(this)" style="display:none;"></iframe>');

        return html.join('');
    }

    function getFlashUI() {
        var html = [];
        var supportFlash = CC.checkSupportFlash();
        if (supportFlash) {
            var url = gMain.rmSvr + "/RmWeb/upload.swf";
            var swfWidth = CC.isBigFont() ? 55 : 46;
            var spanLeft = CC.isBigFont() ? 180 : 118;
            var so = new SWFObject(url, "flashplayer", swfWidth, "25");
            so.addParam("wmode", "transparent");
            so.addParam('allowscriptaccess', 'sameDomain');
            so.addParam('flashVars','rmkey=1');

            html.push('<div>');
            html.push('<div>' + Lang.Mail.choisemb);
            html.push(getFolders());
            html.push('</div>')
            html.push('<div style="position:relative;" class="mt5">' + Lang.Mail.choiselulu);
            html.push('<a class="n_btn_on"><span><span>' + Lang.Mail.look + '</span></span></a>')
            html.push('<span style="position:absolute; left:' + spanLeft + 'px; top:0;">');
            html.push(so.getHTML());
            html.push('</span>');
            html.push('</div>');
            html.push('</div>');
            html.push('<div id="import_mail_progress" style="position:relative; display:none;">');
            html.push('<div id="processing_container" class="pgressLine">');
            html.push('<div class="bg"></div>');
            html.push('<div id="processing_bar" class="bg_cur" style="swidth:0%;"></div>');
            html.push('<div id="processing_txt" class="num">' + Lang.Mail.oneMail + '</div>');
            html.push('</div>');

            html.push('</div>');
        }
        else {
            html.push('<div>');
            html.push(Lang.Mail.noFlash);
            html.push('</div>')
        }

        return html.join('');
    }

    function getUploadUrl() {
        return parent.gMain.rmSvr + '/RmWeb/mail?func=mbox:importMessages&sid={sid}&fid={fid}';
    }

    function getFolders() {
        var folders = CC.getFolders();
        var ui = [];

        ui.push('<select id="fid" name="fid">')
        if (folders && folders.length) {
            ui.push(getOptions(folders, ''));
        }
        ui.push('</select>');

        return ui.join('');

        function getOptions(fs, pre) {
            var op = [];
            var hasSub = false, isEnd = false, icon, name;
            for (var i = 0; i < fs.length; i++) {
                hasSub = fs[i].nodes && fs[i].nodes.length;
                isEnd = (i == fs.length - 1);
                icon = isEnd ? "└ " : "├ ";
                name = pre + icon + fs[i].name;
                op.push('<option value="' + fs[i].fid + '" data-name="' + fs[i].name + '">' + name + '</option>');
                if (hasSub) {
                    op.push(getOptions(fs[i].nodes, pre + '　'));
                }
            }
            return op.join('');
        }
    }

    function RegisterEvts() {
        document.getElementById('import_mail_input').onchange = function () {
            var form = document.getElementById('importEml_form');
            var sel = document.getElementById('fid');
            var fid = sel.options[sel.selectedIndex].value || 1;
            var sid = parent.gMain.sid;
            var url = getUploadUrl();

            url = url.replace('{fid}', fid).replace('{sid}', sid);
            form.action = url;
            form.submit();
        }
    }

    /**
     * 实现Flash相应接口
     */
    function implementInterface() {
        if (FlashImportMail) {
            FlashImportMail.compoentId = ao.id;
            FlashImportMail.beginBeforeInterface = function (instance, callback) {
                if (instance.typeErrors && instance.typeErrors.length) {
                    var msg = [];
                    //您选择的邮件中有非eml格式的邮件，是否直接忽略此邮件，继续导入eml格式的邮件？
                    msg.push(Lang.Mail.emlFormat);
                    CC.alert(msg.join(''), callback);
                }
                else {
                    callback();
                }
            }
            FlashImportMail.startBeforeInterface = function () {
                var container = document.getElementById('import_mail_progress');
                container.style.display = 'block';
                // 重新绑定关闭按钮事件
                jQuery('#divDialogClose' + ao.id).unbind('click').unbind('mousedown').bind('mousedown', function () {
                    FlashImportMail.onClose();
                });
            }
            FlashImportMail.processInterface = function (instance) {
                flashProcess(instance.current + 1, instance.count);
            }
            FlashImportMail.finishInterface = function (instance) {
                var sel = document.getElementById('fid');
                var fid = sel.options[sel.selectedIndex].value || 1;
                var folderName = sel.options[sel.selectedIndex].getAttribute('data-name') || '';
                var msg = [], hasError = false, fail = false;
                if (instance.typeErrors && instance.typeErrors.length) {
                    hasError = true;
                } else if (instance.fail.length > 0) {
                    hasError = true;
                }
                else {
                    msg.push(Lang.Mail.mailInportSuc + '<br />' + Lang.Mail.gyou + instance.count + Lang.Mail.mailImport + folderName + Lang.Mail.mailFolder);
                }

                if (hasError) {
                    var count = instance.count;
                    var failCount = instance.fail.length;
                    var typeCount = instance.typeErrors.length;

                    if (count <= 0) {
                        msg.unshift(Lang.Mail.importFail);
                        fail = true;
                    }
                    else {
                        msg.unshift((Lang.Mail.imported + '{0}' + Lang.Mail.fenyou + '{1}' + Lang.Mail.fengFail + ' ').format(count - typeCount - failCount + 1, failCount));
                    }
                }

                CC.closeMsgBox(ao.id);
                if (fail) {
                    setTimeout(function () {
                        CC.alert(msg.join(''));
                    }, 10);
                } else {
                    CC.alert(msg.join(''), function () {
                        CC.goFolder(fid);
                    });
                }
            }
            FlashImportMail.closeInterface = function (instance) {
                var msg = Lang.Mail.imported + '{0}' + Lang.Mail.fenyou + '{1}' + Lang.Mail.fengFail;
                var count = instance.count;
                var current = instance.current + 1;
                var failCount = instance.fail.length;
                var typeCount = instance.typeErrors.length;

                msg = msg.format(current, count - current + failCount);
                CC.alert(msg, function () {
                    CC.goFolder(1);
                });
            }
        }
    }

    function flashProcess(current, total) {
        var bar = document.getElementById('processing_bar');
        var txt = document.getElementById('processing_txt');
        var precent = total ? parseInt(current * 100 / total) : 0;
        txt.innerHTML = current + Lang.Mail.feng + '/' + total + Lang.Mail.feng;
        bar.style.width = precent + '%';
    }

    function ImportMailLoaded(obj) {
        var win = obj.contentWindow;
        try {
            if (win && win.return_obj) {

            }
        } catch (e) {

        }
    }

    window.ImportMailLoaded = ImportMailLoaded;
};

CC.getSentSaveDefault = function () {
    if (gMain.sendSave.toString() == '') {
        if (LoginType == gConst.loginType.pm || LoginType == gConst.loginType.mm) {
            return gMain.defaultPrefSavesendPublic;
        }
        if (LoginType == gConst.loginType.web) {
            return gMain.defaultPrefSavesend;
        }
    }
    return gMain.sendSave;
};

/**
 * Flash 组件
 */
function SWFObject(swf, id, w, h, ver, c) {
    this.params = {};
    this.variables = {};
    this.attributes = {};
    this.setAttribute("id", id);
    this.setAttribute("name", id);
    this.setAttribute("width", w);
    this.setAttribute("height", h);
    this.setAttribute("swf", swf);
    this.setAttribute("classid", "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000");
    if (ver) {
        this.setAttribute("version", ver);
    }
    if (c) {
        this.addParam("bgcolor", c);
    }
};
SWFObject.prototype.addParam = function (key, value) {
    this.params[key] = value;
};
SWFObject.prototype.getParam = function (key) {
    return this.params[key];
};
SWFObject.prototype.addVariable = function (key, value) {
    this.variables[key] = value;
};
SWFObject.prototype.getVariable = function (key) {
    return this.variables[key];
};
SWFObject.prototype.setAttribute = function (key, value) {
    this.attributes[key] = value;
};
SWFObject.prototype.getAttribute = function (key) {
    return this.attributes[key];
};
SWFObject.prototype.getVariablePairs = function () {
    var variablePairs = [];
    for (key in this.variables) {
        variablePairs.push(key + "=" + this.variables[key]);
    }
    return variablePairs;
};
SWFObject.prototype.getHTML = function () {
    var con = '', pairs = '', key = '';
    if (navigator.plugins && navigator.mimeTypes && navigator.mimeTypes.length) {
        con += '<embed class="zero-opacity" type="application/x-shockwave-flash"  pluginspage="' + location.protocol + '//www.macromedia.com/go/getflashplayer" src="' + this.getAttribute('swf') + '" width="' + this.getAttribute('width') + '" height="' + this.getAttribute('height') + '"';
        con += ' id="' + this.getAttribute('id') + '" name="' + this.getAttribute('id') + '" ';
        for (key in this.params) {
            con += [key] + '="' + this.params[key] + '" ';
        }
        pairs = this.getVariablePairs().join("&");
        if (pairs.length > 0) {
            con += 'flashvars="' + pairs + '"';
        }
        con += '/>';
    } else {
        con = '<object class="zero-opacity" id="' + this.getAttribute('id') + '" classid="' + this.getAttribute('classid') + '"  codebase="' + location.protocol + '//download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=' + this.setAttribute("version") + ',0,0,0" width="' + this.getAttribute('width') + '" height="' + this.getAttribute('height') + '">';
        con += '<param name="movie" value="' + this.getAttribute('swf') + '" />';
        for (key in this.params) {
            con += '<param name="' + key + '" value="' + this.params[key] + '" />';
        }
        pairs = this.getVariablePairs().join("&");
        if (pairs.length > 0) {
            con += '<param name="flashvars" value="' + pairs + '" />';
        }
        con += "</object>";
    }
    return con;
};
SWFObject.prototype.write = function (elementId) {
    if (typeof elementId == 'undefined') {
        document.write(this.getHTML());
    } else {
        var n = (typeof elementId == 'string') ? document.getElementById(elementId) : elementId;
        n.innerHTML = this.getHTML();
    }
};

JSForFlashUpload = {
    /**
     * 获取上传url的回调方法
     * @return {String} 上传文件的完整地址信息
     */
    getUploadUrl: function () {
        //这里返回上传cgi的URL
        var sel = document.getElementById('fid');
        var fid = sel.options[sel.selectedIndex].value || 1;
        var sid = parent.gMain.sid;
        var url = parent.gMain.rmSvr + '/RmWeb/mail?func=mbox:importMessages&sid={sid}&fid={fid}';

        return url.replace('{fid}', fid).replace('{sid}', sid);
    },
    /**
     * 用户选择文件的回调方法
     * @param {String} xmlFileList 用户选择的文件列表(用xml格式字符串表示，可解析xml获取文件列表)
     */
    onselect: function (xmlFileList) {
        //当用户点击flash，弹出文件选择框，选完文件后调用JS，其中xmlFileList是xml格式的文件信息
        //除了文件信息以外还会生成一个taskId，这个以后要上传次文件，就把这个taskId传给flash就行了
        xmlFileList = xmlFileList.replace(/[\t\s]+/g, "");
        var doc = Util.str2Dom(xmlFileList);//返回一个xml文档对象
        var list = doc.firstChild.childNodes;
        var files = [], efiles = [];
        var sizeTotal = 0;
        var failFiles = [];
        for (var i = 0; i < list.length; i++) {
            var node = list[i];
            var size = parseInt(Util.getXMLValue(node.childNodes[2]), 10);
            var filename = Util.getXMLValue(node.childNodes[1]);

            var obj = {
                fileId: "",
                taskId: Util.getXMLValue(node.childNodes[0]),
                fileName: filename,
                fileSize: size,
                uploadType: "flash",
                status: "init" //init未上传，uploading正在上传 ok上传成功
            };

            if (CC.getFileExt(filename)[1].toLowerCase() == 'eml') {
                files.push(obj);
            }
            else {
                obj.errorType = 1; //格式不正确
                efiles.push(obj);
            }
        }

        FlashImportMail.uploadList(files, efiles);
    },
    /**
     * 上传进度的回调方法
     * @param {String} taskId 任务id
     * @param {Number} sendedSize 已上传字节
     * @param {Number} uploadSpeed 上传速度，单位为 字节/秒
     */
    onprogress: function (taskId, sendedSize, uploadSpeed) {

    },
    /**
     * 上传成功后的回调方法
     * @param {String} taskId 任务id
     * @param {String} responseText 服务器响应的报文
     */
    oncomplete: function (taskId, responseText) {
        try {
            var result = FlashImportMail.getFilesByString(responseText);
            if (result) {
                if (result.code == gConst.statusOk) {
                    FlashImportMail.success.push(taskId);
                } else {
                    FlashImportMail.fail.push(taskId);
                    JSForFlashUpload.onerror(taskId, result.code);
                }
            } else {
                FlashImportMail.fail.push(taskId);
                JSForFlashUpload.onerror(taskId, code, "parse response error");
            }
            FlashImportMail.onProcess();
            FlashImportMail.nextUpload();
        } catch (e) {
            FlashImportMail.fail.push(taskId);
        }
    },
    /**
     * 上传出错回调方法
     * @param {String} taskId
     * @param {String} errorCode
     * @param {String} errorMsg
     */
    onerror: function (taskId, errorCode, errorMsg) {
        CC.closeMsgBox(FlashImportMail.compoentId);
        switch (errorCode) {
            case "3":
                errorMsg = Lang.Mail.importLimit;//'对不起，导入的邮件大小超出限制';
                break;
            default:
                errorMsg = top.Lang.Mail.Write.wjdrsbMdnmg;//文件导入失败
                break;
        }
        CC.alert(errorMsg);
    },
    //鼠标经过flash的时候
    onmouseover: function () {
        //showUploadTip();
    },
    //鼠标移除flash的时候
    onmouseout: function () {
        //$(document).bind("mousemove", hideUploadTip);
    },
    //鼠标点击flash的时候
    onclick: function () {
        return true;
    }
};

//Flash里公开给js调用的接口
FlashForJS = {
    upload: function (taskId) {
        var flash = document.getElementById("flashplayer");
        flash.upload(taskId);
    },
    cancel: function (taskId) {
        var flash = document.getElementById("flashplayer");
        flash.cancel(taskId);
    }
};

/**
 * Flash 批量导入邮件
 */
FlashImportMail = {
    data: [],
    count: 0,
    current: 0,
    success: [], //成功的任务
    fail: [], //失败的任务
    regMatchFile: /(var\s+return_obj=[\s\S]+)<\/script>/i,
    beginBeforeInterface: null, //所有导入活动开始之前的接口
    startBeforeInterface: null, //开始导入前的接口
    processInterface: null, //进度接口
    finishInterface: null, //全部文件导入完成接口
    closeInterface: null, //中止接口
    uploadList: function (files, efiles) {
        this.current = 0;
        this.count = files.length;
        this.data = files;
        this.success = [];
        this.fail = [];
        this.typeErrors = efiles;
        var first = files[0];
        var p = this;
        this.onBeginBefore(function () {
            if (first) {
                p.onStartBefore();
                p.upload(first);
            }
            else {
                p.onFinish();
            }
        });
    },
    upload: function (file) {
        FlashForJS.upload(file.taskId);
    },
    /**
     * 导入下一个文件
     */
    nextUpload: function () {
        this.current++;
        if (this.current < this.count) {
            this.upload(this.data[this.current]);
        }
        else {
            this.onFinish();
        }
    },
    /**
     * 所有导入执行之前
     */
    onBeginBefore: function (cb) {
        if (typeof this.beginBeforeInterface == 'function') {
            this.beginBeforeInterface(this, cb);
        }
    },
    /**
     * 导入开始前事件
     */
    onStartBefore: function () {
        if (typeof this.startBeforeInterface == 'function') {
            this.startBeforeInterface(this);
        }
    },
    /**
     * 调用进度
     */
    onProcess: function () {
        if (typeof this.processInterface == 'function') {
            this.processInterface(this);
        }
    },
    /**
     * 所有文件全部导入完成时事件
     */
    onFinish: function () {
        if (typeof this.finishInterface == 'function') {
            this.finishInterface(this);
        }
    },
    /**
     * 中止事件
     */
    onClose: function () {
        if (typeof this.closeInterface == 'function') {
            this.closeInterface(this);
        }
    },
    /**
     * 从http输出流中解析出文件对象，返回文件对象的数组
     * @param {Object} resp 文件上传后的输出流
     */
    getFilesByString: function (resp) {
        if (!resp) {
            return null;
        }
        var match = resp.match(FlashImportMail.regMatchFile);
        if (match) {
            eval(match[1]);
            if (return_obj && return_obj["var"]) {
                var vo = return_obj["var"];
                var resultObj = {
                    code: return_obj.code,
                    taskId: vo.fileId,
                    fileId: vo.fileId,
                    fileName: vo.fileName,
                    fileSize: vo.fileSize
                };
                return resultObj;
            } else {
                return null;
            }
        } else if (typeof resp == 'string' && resp.indexOf('{') > -1 && resp.indexOf('}') > -1) {
            var ro = null;
            try {
                ro = eval('(' + resp + ')');
            } catch (e) {
            }
            return ro;
        } else {
            return null;
        }
    }
};


/**
 * 同步邮件信息至主框架
 */
CC.syncMailData = function () {
    // 同步未读邮件数
    var folders = CC.getFolders();
    var unreadMessageCount = 0;

    for (var z = 0; z < folders.length; z++) {
        if (folders[z].fid != 2 && folders[z].fid != 3 && folders[z].fid != 4 && folders[z].fid != 5)
            unreadMessageCount += folders[z].stats.unreadMessageCount;
    }

    if (messageInfo) {
        messageInfo.unreadMessageCount = unreadMessageCount.toString();
    }
};

/**
 * 更新首页
 */
CC.updateHome = function () {
    if (gMain.welcomePage && gMain.welcomePage == '1' && MM.home && MM.home.update) {
        CC.syncMailData();
        MM.home.update();
    }
};
/**
 * 得到左侧菜单显示的文件夹
 */
CC.getShowFolderList = function () {
    var folderList = [1, 2, 3, 4, 5, 12];
    var folderMap = [];
    for (var i = 0; i < folderList.length; i++) {
        folderMap[folderList[i]] = "show";
    }
    if (IsOA != 1)
        folderMap[6] = "show";
    if (GC.check("MAIL_INBOX_BILL"))//账单中心
    {
        folderMap[8] = "show";
    }
    /*if(GC.check("MAIL_INBOX_Virus"))//病毒邮件夹
     {
     folderMap[6]="show";
     }
     if(GC.check("MAIL_INBOX_ISAUDIT"))//我的订阅
     {
     folderMap[9]="show";
     }
     if(GC.check("MAIL_INBOX_ISAUDIT"))//归档邮件
     {
     folderMap[10]="show";
     }
     if(GC.check("MAIL_INBOX_ISAUDIT"))//广告邮件夹
     {
     folderMap[11]="show";
     }
     if(GC.check("MAIL_INBOX_ISAUDIT"))//保留1（网盘邮件夹）
     {
     folderMap[12]="y";
     }*/
    if (GC.check("MAIL_MANAGER_MONITOR"))//监控邮件夹
    {
        folderMap[13] = "y";
    }
    if (GC.check("MAIL_MANAGER_AUDIT"))//审核邮件夹
    {
        folderMap[14] = "show";
    }
    GE.folderMap = folderMap;
};
/**
 * 判断是否走审核
 */
CC.isAudit = function () {
    if (GC.check("MAIL_MANAGER_AUDIT")) {
        return true;
    }
    return false;
};

/**
 * 判断是否走监控
 */
CC.isMonitor = function () {
    if (GC.check("MAIL_MANAGER_MONITOR")) {
        return true;
    }
    return false;
};

/**
 * 临时 临时  判断是否走云通讯录RM接口
 */

CC.isRmAddr = function () {
    if (window.gMain && gMain.urlYaddr && gMain.urlYaddr != "")
        return true;
    else
        return false;
};

/**
 * 获取文件扩展名
 * @param fn {string} filename
 */
CC.getFileExt = function (fn) {
    if (fn.indexOf('.') > 0) {
        var filename = fn.substr(0, fn.lastIndexOf('.'));
        var ext = fn.substr(fn.lastIndexOf('.') + 1);
        return [filename, ext];
    }
    else {
        return [fn, ''];
    }
};

/**
 * 给标签绑定事件
 * @param wp  外层容器
 */
CC.labelBind = function (wp) {
    var $ = jQuery;
    $(wp).delegate("[data-lid]", "mouseout mouseover", function (e) {
        var t = $(this);
        setTimeout(function () {
            t.toggleClass("tag_squ");
            t.toggleClass("tag_squ_on");
        }, 200);
    }).delegate("[data-lid]", "click", function (e) {
        var target = $(this).closest("[data-lid]"),
            lid = target.data("lid");
        if (lid) CC.goFolder(lid, "label" + lid);
        return false;
    }).delegate("[data-lid] i", "click", function (e) {
        var target = $(e.target).parent("a"),
            mid = target.data("mid"),
            lid = target.data("lid");
        if (mid && lid) {
            MM["label" + lid].marklabel("delete", [mid], lid);
            target.remove();
            if (/^readMail/.test("" + GE.tab.curid)) {
                var labels = CM[GE.tab.curid][gConst.dataName].label;
                CM[GE.tab.curid][gConst.dataName].label = jQuery.map(labels, function (item) {
                    if (inArray(item, [lid])) {
                        return null;
                    } else {
                        return item;
                    }
                });
            }
        }
        return false;
        function inArray(target, arr) {
            var i, len = arr.length, result = false;
            for (i = 0; i < len; i++) {
                var item = arr[i];
                if (item == target) {
                    result = true;
                }
            }
            return result;
        }
    });
};

/**
 * 控制标签邮件
 * @returns {boolean}
 */
CC.isLabelMail = function () {
    if (GC.check("MAIL_MANAGER_LABELMAIL")) {
        return true;
    }
    return false;
};

/**
 * 是否是大字号
 * @return {boolean}
 */
CC.isBigFont = function () {
    if (gMain.defaultFontSize == 'bigfont') {
        return true;
    }
    return false;
};
/**
 * 判断是否OA邮箱
 */
CC.isOA = function () {
    if (CorpType && CorpType == 1) {
        return true;
    }
    return false;
};
/**
 * 判断是否有云网盘
 */
CC.isDisk = function () {
//  if(window.gMain && gMain.urlCloudp){
//      return true;
//  }
//  return false;
    return GC.check("DISK");
};
/**
 * 判断是否绑定手机
 * @param {Object} flag
 */
CC.isMobileBind = function (flag) {
    var flag = flag.toInt();
    if ((flag & 1) != 0) {
        return true;
    }
    return false;
};
/**
 * 根据mid查找邮件信息
 * @param o
 * @param mid
 * @returns {*}
 */
CC.getMailFromByID = function (o, mid) {
    if (!o) return null;
    var list = CM[o]["var"], data , from;
    for (var i = 0, l = list.length; i < l; i++) {
        var temp = list[i];
        if (temp.mid === mid) {
            data = temp;
            break;
        }
    }
    return data.from.replace(/([\s\S]+<)([\s\S]+)>/, '$2');
};

/**
 * 获取密级邮件密级名称
 * @param level
 */
CC.getSecurityMailName = function (level) {
    var slName = [];
    var slLevel = level - 0;
    slName.push(Lang.Mail.slPublic || '');
    slName.push(Lang.Mail.slSecret || '');
    slName.push(Lang.Mail.slTopSecret || '');
    if (slLevel < 0 || slLevel > 2) {
        slLevel = 0;
    }

    return slName[slLevel];
};

/**
 * 获取资源服务器绝对地址
 */
CC.getResourceAbsoluteURL = function () {
    var root = gMain.resourceRoot;
    if (root.indexOf('http') > -1) {
        return root;
    }
    else {
        return location.protocol + '//' + location.host + root;
    }
};

/**
 * 转到写短信页面并带入默认信息
 */
CC.gotoSMS = function (defaultNumber) {
    var smsUrl = '{0}/se/sms/smsindex.do?sid={1}&to={2}';
    smsUrl = smsUrl.format(gMain.webPath, gMain.sid, defaultNumber);

    CC.goOutLink(smsUrl, 'sms', top.Lang.Mail.Write.duanxin);//短信
};

/**
 * 将用户属性写入服务端
 * @param attrs
 */
CC.writeUserAttributesToServer = function (attrs) {
    var serviceUrl = '/mail/data.do';

    var call = function (data) {
        if (data && data.code == 'S_OK') {
            var d = attrs;
            for (var k in d) {
                CC.updateLocalUserAttribute(k, d[k]);
            }
        }
    };
    var failCall = function (data) {
        //window.console && console.log(data);
    };

    var data = {
        url: serviceUrl,
        func: 'mail:setAttrs',
        data: attrs,
        call: call,
        failCall: failCall,
        msg: ''
    };

    MM.doService(data);
};

/**
 * 读取本地用户属性值
 * @param key
 */
CC.getUserAttributeFromLocal = function (key) {
    if (!gMain.userAttrs) {
        return '';
    }
    return gMain.userAttrs[key] || '';
};

/**
 * 更新本地用户属性值
 * @param key
 * @param val
 */
CC.updateLocalUserAttribute = function (key, val) {
    if (!gMain.userAttrs) {
        gMain.userAttrs = {};
    }
    gMain.userAttrs[key] = val;
};

/**
 * 获取本地通讯录用户信息
 * @param user 用户信息
 */
CC.getUserInfoFromLocalAddress = function (user) {
    var localStore = GE.addressLocalStore || [];
    if (!user) {
        return null;
    }
    if (localStore.length) {
        var datas = localStore[2];
        var mail = user.email || 'not mail number';
        if (mail.indexOf('>') && mail.indexOf('<') > -1) {
            mail = Email.getValue(mail);
        }
        for (var i = 0, l = datas.length; i < l; i++) {
            if (datas[i][3] == mail) {
                return new User(datas[i]);
            }
        }
    }
    else {
        return null;
    }

    function User(d) {
        this.type = d[0];
        this.id = d[1];
        this.name = d[2];
        this.mail = d[3];
        this.phone = d[4];
        this.fax = d[5];
        this.simple = d[6];
        this.full = d[7];
    }
};
CC.countStrlength = function (str) {
    var i = 0,
        arr = [],
        len = 0;
    if (str.length > 0) {
        arr = str.split("");
        for (; i < arr.length; i++) {
            if ((/[\u4e00-\u9fa5]+/).test(arr[i])) {
                len += 12;
            } else {
                len += 6;
            }
        }
    }
    return len;
};

/**
 * 添加定死的folder 数据
 * @param {Object} data 文件夹集合
 * @param {Object} obj 数据
 */
CC.addFolderItem = function (data, obj) {
    data.push(
        {
            "fid": obj.fid,
            "folderColor": 0,
            "folderPassFlag": 0,
            "hideFlag": 0,
            "keepPeriod": 0,
            "location": obj.location,
            "name": obj.name,
            "parentId": 0,
            "pop3Flag": 0,
            "reserve": 0,
            "stats": {
                "attachmentNum": 0,
                "messageCount": 0,
                "messageSize": 0,
                "unreadMessageCount": 0,
                "unreadMessageSize": 0
            },
            "type": obj.type,
            "vipFlag": 0,
            "flag": obj.flag,
            "virtualFolder": true  // 是否为虚拟文件夹
        }
    );
};

/**
 * 删除定死的folder 数据
 * @param {Object} data 文件夹的数据
 */
CC.removeFolderItem = function (data) {
    var fids = {
            "9999996": 1,
            "9999997": 1,
            "9999998": 1,
            "9999999": 1
        },
        len = data.length;

    while (len--) {
        if (fids[data[len].fid.toString()]) {
            data.splice(len, 1);
        }
    }
    return data;
};

CC.power || (CC.power = {});

// 判断敏感邮件权限
CC.power.offSensMail = function () {
    return GC.check('MAIL_INBOX_SEN');
};

// 判断快捷主题权限
CC.power.offQuickSubject = function () {
    return true;
};

//判断是否安全邮箱
CC.isSecurityMail = function(){
    
    if( typeof top.gMain !== "undefined" && top.gMain.ifibc == '1'){
        return true;
    }else{
        return false;
    }
},
/**
 * 根据色值索引获取对应色值对象
 * @param val
 */
CC.getSubjectColorObject = function (val) {
    if (GE && !GE.subjectColorObject) {
        GE.subjectColorObject = {};
        if (gConst.subjectColor && gConst.subjectColor.length) {
            for (var i = 0; i < gConst.subjectColor.length; i++) {
                if (gConst.subjectColor[i].val) {
                    GE.subjectColorObject[gConst.subjectColor[i].val] = gConst.subjectColor[i];
                }
            }
        }
    }
    return GE.subjectColorObject[val.toString()] || {value: '#000000'};
};

// 判断自销毁权限
CC.power.offAutoDestroy = function () {
    return GC.check("MAIL_INBOX_DESTROY");
};

// 判断恢复已删除权限
CC.power.offRestoreDeleted = function () {
    return GC.check("MAIL_MANAGER_DElETED");
};

// 判断星标邮件夹权限
CC.power.offStarMail = function () {
    return true;
}

/**
 * checkNetwork 检测网络状态
 * @param {Boolean} _tipFlag 是否显示网络断开提示
 * @return {Boolean} [true:网络连接 false:网络断开]
 */
CC.checkNetwork = function (_tipFlag) {
    var flag = typeof tipFlag === "undefined" ? true : _tipFlag;
    var online;

    if (navigator.userAgent.indexOf("Firefox") > 0 || jQuery.browser.opera || /msie 6/i.test(navigator.userAgent)) {
        online = CC.checkOtherBrowserNetwork();
    } else {
        if (navigator.onLine == false && CC.checkOtherBrowserNetwork() == false) {
            online = false;
        } else {
            online = true;
        }
    }

    if (!online && flag) {
        CC.showMsg(top.Lang.Mail.Write.wldkqGMttpcwllj, true, false, 'caution');//网络断开，请检查网络连接.
    }
    return online;
};

/**
 * checkOtherBrowserNetwork 检测其他浏览器网络状态
 * @return {Boolean} [true:网络连接 false:网络断开]
 */
CC.checkOtherBrowserNetwork = function () {
    var xhr = new (window.ActiveXObject || XMLHttpRequest)("Microsoft.XMLHTTP"),
        status;

    xhr.open("HEAD", "//" + window.location.hostname + "/?rand=" + Math.floor((1 + Math.random()) * 0x10000)+ "&norefreshSid=" + ( window.nsid !== void 1 ? window.nsid : 0), false);

    try {
        xhr.send();
        return ( xhr.status >= 200 && xhr.status < 300 || xhr.status === 304 );
    } catch (error) {
        return false;
    }
};

// 判断工单功能权限
CC.power.offWorkOrder = function () {
    return true;
};

/**
 * @name CC#setAllRead
 * @desc  全部标记为已读
 * @event
 * @param {String} o 邮件夹名
 */
CC.setAllRead = function (o) {
    var p1 = MM[o];
    p1.isAll = true;
    p1.mark("", "read", 0, top.Lang.Mail.Write.yidu);//已读
    p1.isAll = false;
};

/**
* 检测浏览器的缩放值
* @return {Number} 浏览器的缩放比例
*/
CC.detectZoom = function(){
    var ratio = 0,
        otherRatio = 0, // 个别浏览器某些版本，如搜狗、360
        screen = window.screen,
        ua = navigator.userAgent.toLowerCase();

    if (window.devicePixelRatio !== undefined) {
        ratio = window.devicePixelRatio;
    } else if (~ua.indexOf('msie')) {
        if (screen.deviceXDPI && screen.logicalXDPI) {
            ratio = screen.deviceXDPI / screen.logicalXDPI;
        }
    } else if (window.outerWidth !== undefined && window.innerWidth !== undefined) {
        ratio = window.outerWidth / window.innerWidth;
    }
    if (ratio) {
        ratio = Math.round(ratio * 100);
    }

    if (window.devicePixelRatio && window.devicePixelRatio === 1) {
        otherRatio = Math.round(window.outerWidth / window.innerWidth * 100);
        if (Math.abs(ratio - otherRatio) > 2) {
            ratio = otherRatio;
        }
    }
    return ratio;
};

/**
* 浏览器缩放检测
* @param {object} jQuery对象
* @param {Document} document对象，用于处理框架
*/
CC.zoomTip = function ($, doc) {
    var html = "",
        toggle;

    if (!CC.getUserAttributeFromLocal("offZoomTip")) {
        if ($(".top-navbarTip_yellow").length < 1) {
            html += "<div class=\"top-navbarTip_yellow\">";
            html += "<a id=\"btnZoomTip\"  href=\"javascript:;\" class=\"clsbtn\"></a>";
            html += "<i class=\"i-oarm ml_5 mr_5 vm\"></i>";
            html += "<span>";
            html += top.Lang.Mail.Write.ndllqnDDgNfcszt;//您的浏览器目前处于缩放状态，会导致邮箱显示不正常，您可以键盘按\"ctrl+数字键0\"组合键恢复初始状态。
            html += "</span>";
            html += "<a class=\"dtno\" href=\"javascript:;\" id=\"btnOffZoomTip\" title='"+top.Lang.Mail.Write.buzaitishi+"'>"+top.Lang.Mail.Write.buzaitishi+"</a>";//<a class=\"dtno\" href=\"javascript:;\" id=\"btnOffZoomTip\" title=\"不再提示\">不再提示</a>
            html += "</div>";
            $(html).insertBefore($(".top-navbar"));

            $("#btnZoomTip").click(function () {
                $(this).parent().hide();
            });
            $("#btnOffZoomTip").click(function () {
                CC.writeUserAttributesToServer({"offZoomTip": "true"});
                CC.zoomTip.isNoShow = true;
                $(this).parent().parent().hide();
            });
        }

        // 切换黄色提示条方法
        toggle = function () {
            if (CC.detectZoom() !== 100 && !CC.zoomTip.isNoShow) {
                $(".top-navbarTip_yellow").show();
            } else {
                $(".top-navbarTip_yellow").hide();
            }
        }
        toggle();
        jQuery(window, doc).on("resize", function(e) {
            toggle();
        });
        jQuery("body", doc).keyup(function(e) {
            toggle();
        });
    }
};
/**
 * 弹出修改IBC密码的框
 */
CC.showModIBCdiv = function( suc, fnfail, isfirst ){
    var $ = jQuery;
    var call = function( data ){
            
        if( data ){
            var newPwd = $("#ibcNewPwd", parent.document),
                oldPwd = $("#ibcOldPwd", parent.document),
                confirmPwd = $("#ibcConfirmPwd", parent.document);
        
            if(data.errorCode == '20022'){
                oldTip.show( oldPwd[0], top.Lang.Mail.Write.ymmcwqzxsrBcmTX);//原密码错误, 请重新输入
                 
            }else if(data.errorCode == '20080'){
                newTip.show( oldPwd[0], top.Lang.Mail.Write.xmmgsylwsLqzxsr);//新密码格式错误, 请重新输入
            }else if(data.errorCode == "1"){
                var ibcPwd = confirmPwd.val().trim();
                $("#divDialogCloseconfirm", parent.document).click();
                
                CC.showMsg(top.Lang.Mail.Write.xgmmcgHzcJo,true, false, "option");//修改密码成功
                
                if( typeof gMain != "undefiend"  && typeof gMain.userAttrs != "undefined"){
                    gMain.userAttrs.firstuseibc = "1";
                    
                    //只要修改过密码, 下次还需要解密( 不管以前是否自动解密过 );
                    gMain.userAttrs.modifyibcpwd = "0";
                    gMain.userAttrs.autosign = "0";
                    
                }
                
                suc && suc(ibcPwd);
                
                
            }else if(data.summary != "" ){
                CC.showMsg(data.summary, true, false, "error");
            }else{
                CC.showMsg(top.Lang.Mail.Write.xgmmsbIUorO, true, false, "error");//修改密码失败
            }
            
        }           
    },
    fnfail = fnfail || function(){
        CC.showMsg(top.Lang.Mail.Write.xgmmsbhQiza, true, false, "error");//修改密码失败
    };
 
    
    var newTip = new parent.ToolTips({
                        id: '',
                        win: window,
                        left: 117,
                        top: 86,
                        direction: parent.ToolTips.direction.Up
                    }); 
    
    var oldTip = new parent.ToolTips({
                        id: '',
                        win: window,
                        left: 116,
                        top: 48,
                        direction: parent.ToolTips.direction.Up
                    }); 
                    
    var confirmTip = new parent.ToolTips({
                        id: '',
                        win: window,
                        left: 126,
                        top: 186,
                        direction: parent.ToolTips.direction.Bottom
                    }); 
    
    var txttip = top.Lang.Mail.Write.ndzhdORdwLaqqxg;//你的帐号的私钥密码为初始密码,为保障安全,请修改
    
    if(!isfirst){
        txttip = top.Lang.Mail.Write.wlbzarSzwcgsymm;//为了保障安全，请修改私钥密码
    }
                    
    //修改密码的html
    var modHtml =     "<div style='padding:0 0 35px 25px' id='ibcWrap'>"
                    + "<p style='padding:0px 0 10px 0; color:gray'>"+ txttip +"</p>"
                    + "<ul><li style='padding:5px'><span style='display: inline-block;text-align: right;width: 85px;'>"+top.Lang.Mail.Write.yuanmima+"</span><input class='rm_txt' style='width:180px; height:20px' maxlength='64' type='password' autoComplete='false' id='ibcOldPwd'/></li>"
                    + "<li style='padding:5px'><span style='display: inline-block;text-align: right;width: 85px;'>"+top.Lang.Mail.Write.xinmima+"</span><input class='rm_txt' style='width:180px; height:20px'  maxlength='64' type='password' autoComplete='false' id='ibcNewPwd'/></li>"
                    + "<li style='padding:5px'><span style='display: inline-block;text-align: right;width: 85px;'>"+top.Lang.Mail.Write.querenmima+"</span><input class='rm_txt' style='width:180px; height:20px'  maxlength='64' type='password' autoComplete='false' id='ibcConfirmPwd'/></li>"
                    + "</ul></div>";//<ul><li style='padding:5px'><span style='display: inline-block;text-align: right;width: 85px;'>原密码：</span><input class='rm_txt' style='width:180px; height:20px' maxlength='64' type='password' autoComplete='false' id='ibcOldPwd'/></li>  ||  <li style='padding:5px'><span style='display: inline-block;text-align: right;width: 85px;'>新密码：</span><input class='rm_txt' style='width:180px; height:20px'  maxlength='64' type='password' autoComplete='false' id='ibcNewPwd'/></li>  ||  <li style='padding:5px'><span style='display: inline-block;text-align: right;width: 85px;'>确认密码：</span><input class='rm_txt' style='width:180px; height:20px'  maxlength='64' type='password' autoComplete='false' id='ibcConfirmPwd'/></li>
    
    
    CC.showDiv( modHtml, function(){
                    return true;
            }, top.Lang.Mail.Write.symmxgRVrMc, "", "" );//私钥密码修改
    
    $("#ibcOldPwd", parent.document ).focus();
    
    //绑定确定, 取消事件
    bindEventModIbc();
     
                
 
    //绑定修改ibc事件
    function bindEventModIbc(){
        //newTip oldTip confirmTip ibcNewPwd ibcOldPwd ibcConfirmPwd
        var newPwd = $("#ibcNewPwd", parent.document),
            oldPwd = $("#ibcOldPwd", parent.document),
            confirmPwd = $("#ibcConfirmPwd", parent.document);
        
        
        //绑定确认按钮弹出框
        $("#divDialogCloseconfirmbtn_0", parent.document).unbind().bind("click", function(){
            if( checkModInput() ){
                ajaxModIbcPwd();
            }else{
                return true;
            }
        });
        
        $("#ibcConfirmPwd", parent.document).unbind().bind("keyup", function(e){
            if( e.keyCode == 13){
                if( checkModInput() ){
                    ajaxModIbcPwd();
                }
            }
        });
    
        function checkModInput(){
            if( oldPwd.val().trim() === "" ){
                oldTip.show( oldPwd[0], top.Lang.Mail.Write.jmmbnwkRmfAM);//旧密码不能为空
                return false;
            }else if(oldPwd.val().trim().length < 6 || oldPwd.val().trim().length > 64){
                oldTip.show( oldPwd[0], top.Lang.Mail.Write.mmcdxwrOfxt);//密码长度需6-64位
                return false;
            }
            
            if( newPwd.val().trim() === "" ){
                newTip.show( newPwd[0], top.Lang.Mail.Write.xmmbnwknULBW);//新密码不能为空
                return false;
            }else if( newPwd.val().trim().length < 6 ||  newPwd.val().trim().length > 64 ){
                newTip.show( newPwd[0], top.Lang.Mail.Write.mmcdxwGcQyY);//密码长度需6-64位
                return false;
            }
            
            if( confirmPwd.val().trim() === "" ){
                confirmTip.show( confirmPwd[0], top.Lang.Mail.Write.qrmmbnwkfkzCT);//确认密码不能为空
                return false;
            }else if(confirmPwd.val().trim().length < 6 || confirmPwd.val().trim().length > 64){
                confirmTip.show( confirmPwd[0], top.Lang.Mail.Write.mmcdxwXJnBP);//密码长度需6-64位
                return false;
            }
            

            if( newPwd.val().trim() !== confirmPwd.val().trim() ){
                 
                confirmTip.show( confirmPwd[0], top.Lang.Mail.Write.lcmmbMbHKEqzxsr);//两次密码不一致，请重新输入
                return false;
            
            }
            
            return true;
        }
    }
    
    
    function ajaxModIbcPwd(){
        var webpath = ( parent.gMain ? (parent.gMain.webPath || "") : "" );
        
        parent.MM.doService({
            func:"mail:SoapModifyMemberPwd",
            absUrl: webpath + "/service/mail/ibcsoap",
            data: {
                newpwd: $("#ibcNewPwd", parent.document).val().trim(),
                oldpwd: $("#ibcOldPwd", parent.document).val().trim()
            },
            call: call,
            failCall: fnfail
        });

    }
    
        

};

/**
 * IBC解密输入框 
 */
CC.showUndoIBCdiv = function(suc, fnfail, ibcTip){
    var $ = jQuery;
    var autopass = 0;
    var call = suc || function(){
            $("#divDialogCloseconfirm", parent.document).click();
            CC.showMsg(top.Lang.Mail.Write.jiemichenggong,true, false, "option");//解密成功
            
            //说明已经自动解密
            if( autopass && typeof gMain != "undefined" && typeof gMain.userAttrs != "undefined" ){
                gMain.userAttrs.modifyibcpwd = "1";
            }   
            
            
        },
        fnfail = fnfail || function(){
            CC.showMsg(top.Lang.Mail.Write.jiemishibai, true, false, "error");//解密失败
        };
    
    
    var outoPass = "<p style='margin-top:30px'><span><input type='checkbox' id='autopass'/><label for='autopass' style='color:gray'>"+top.Lang.Mail.Write.yhzdyzUjPDU+"</label></span></p>";//<p style='margin-top:30px'><span><input type='checkbox' id='autopass'/><label for='autopass' style='color:gray'>以后自动验证</label></span></p>
    var modA = "<a id='modIbc' href='###' style='margin-right:143px; padding-left:10px; color:#blue;'>"+top.Lang.Mail.Write.symmxgbYXgm+"</a>";//<a id='modIbc' href='###' style='margin-right:143px; padding-left:10px; color:#blue;'>私钥密码修改</a>
    
    var ibcHtml = "<div style='padding:20px 0 5px 10px' id='ibcWrap'>"
                      +"<p style='color:gray; margin-bottom:15px;'>"+top.Lang.Mail.Write.cyjwsMjSYfxjmyj+"</p>"
                        + "<span style='padding-left:36px'>"+top.Lang.Mail.Write.mima+"</span><input class='rm_txt' style='width:180px; height:20px' type='password'maxlength='64' autoComplete='false' id='ibcPwd'/>"
                        + outoPass//<p style='color:gray; margin-bottom:15px;'>此邮件为数字加密邮件，需要输入你的私钥密码进行解密邮件。</p>  ||  <span style='padding-left:36px'>密 码：</span><input class='rm_txt' style='width:180px; height:20px' type='password'maxlength='64' autoComplete='false' id='ibcPwd'/>
                        + "</div>";
    

    var ibcTip = ibcTip || new parent.ToolTips({
                        id: '',
                        win: window,
                        left: 85,
                        top: 75,
                        direction: parent.ToolTips.direction.Bottom
                    }); 
    
    
    
    CC.showDiv( ibcHtml, function(){
                return true;
        }, top.Lang.Mail.Write.symmyzqJttT, "", "" );//私钥密码验证
    
    $("#ibcPwd", parent.document ).focus();
    
    $("#divDialogCloseconfirmbtn_0").before( modA );

    $("#modIbc").bind("click",function(){
        CC.showModIBCdiv();
    });
    
    $("#divDialogCloseconfirmbtn_0").bind("click", checkInput);
    
    $("#ibcPwd", parent.document).unbind().bind("keyup", function(e){
        if( e.keyCode == 13){
            checkInput();
        }
    });
    
    function checkInput(){
            if( $("#ibcPwd", parent.document).val().trim() === "" ){
                ibcTip.show( $("#ibcPwd", parent.document)[0], top.Lang.Mail.Write.mmbnwkWGrYN );//密码不能为空
                return true;
            }else if($("#ibcPwd", parent.document).val().trim().length < 6 || $("#ibcPwd", parent.document).val().trim().length > 30){
               
                ibcTip.show( $("#ibcPwd", parent.document)[0], top.Lang.Mail.Write.mmcdxweCjTV );//密码长度需6-64位
                return true;
            }else{
                autopass = $("#autopass", parent.document)[0].checked ? 1 : 0;
                ajaxCheck();
                return false;
            }
        }   

    function ajaxCheck(){
        var webpath = ( parent.gMain ? (parent.gMain.webPath || "") : "" );
        
         parent.MM.doService({
            func:  "mail:SoapVerifyIbcPwd",
            absUrl:  webpath +  '/service/mail/ibcsoap',
            data: {
                oldpwd:  $("#ibcPwd", parent.document).val().trim(),
                autodec: autopass
            },
    
            call: call,
            failCall: fnfail
        });

    }

        
};

/**
 * 附件管理文件夹，查看邮件是否为加密邮件
 */
CC.getAttachRead = function(mid, call, failCall){
    
    failCall = failCall || function(data){};

    var data = {
        func:"mbox:getMessageInfo",
        data:{
           ids:[mid],
           filterFields:"flags"
        },
        call:call,
        failCall:failCall
    };
    MM.mailRequestApi(data);
};


/**
 * 安全邮箱，获取加密邮件免校验串
 */
CC.getSmailNoVerify = function(mid,call,failCall){
    var webpath = ( parent.gMain ? (parent.gMain.webPath || "") : "" );
    top.MM.doService({
        func:  "mail:SoapVerifyIbcPwd",
        absUrl:  webpath +  '/service/mail/ibcsoap',
        data: {
            mid: mid
        },
        call: call
    });
};