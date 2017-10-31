/**
 * 系统全局变量定义
 * @class
 */
var gConst = {
    /** 默认模块的名称 */
    home: "home",
    address: "address",
    sms: "sms",
    mms: "mms",
    fax: "fax",

    searchMail: "searchMail",
    setting: "setting",
    readMail: "readMail",
    weather: "weather",
    folderMain: "folderMain",
    folder: "folder",
    compose: "compose",
    attachList: "attachList",
    deliver: "deliver",

    sysFolderList: ["收件箱", "草稿箱", "已发送", "已删除", "垃圾邮件", "病毒文件夹"],

    /** 无限容量标识ID */
    unlimitedId: "UNLIMITED",
    /** 自定义邮件夹级数限制*/
    folderLimit: 5,
    /** 拖动邮件HTML遍历级数限制*/
    dragLimit: 20,

    /** cookie lang key */
    langKey: "lang",

    /** 遮罩层div id*/
    divOpactity: "opactity",
    //divOpactity: "shareLayer",

    /** 透明层 **/
    shareLayer: "shareLayer",

    /** 操作加载msg div id*/
    divMsg: "tipsLoading",

    /** 主框架内容div id*/
    divContainer: "container",

    /** 主框架内容head id*/
    divTopTab: "accountbar",

    /** 主框架内容head id*/
    divTop: "header",

    /** 主框架内容sidebar id*/
    divLeft: "sidebar",

    /** 主框架内容leftContainer id**/
    divBox: "leftContainer",

    /** 主框架内容main id*/
    divMain: "content",

    /** 主框架页面上多标签 id */
    divTab: "divTabls",

    /** 主框架工具条id前缀 */
    divToolbar: "divToolbar_",

    /** 主框架ifrm id前缀 */
    ifrm: "ifrm_",

    /** SSO 加载iframe id*/
    ifrmSSOLoad: "ifrmSSOLoad",

    /** 动态提交表单数据iframe id */
    ifrmForSubmit: "ifrmForSubmit",

    /** 保存访问历史记录iframe id*/
    ifrmHistory: "ifrmHistory",

    /** 资源服务器blank iframe id*/
    ifrmRes: "ifrmRes",

    sysFrames: "ifrmHistory,ifrmSSOLoad,freshWeb,ifrmApi,ifrmWebApi,freshRM,ifrmRmSvr",

    /**Rm Server代理blank */
    ifrmRmSvr: "ifrmRmSvr",

    /** Search txt*/
    txtSearch: "txtSearch",
    txtAdvSearch: "txtAdvSearch",
    searchBrightKeyLeft: /&amp;&lt;{/g,
    searchBrightKeyRight: /}&gt;&amp;/g,

    /** 主内容区域的工具条和内容显示id前缀*/
    mainToolbar: "main_Toolbar_",
    mainBody: "main_Body_",
    /** 设置区域的div id*/
    mainSetting: "main_Setting",
    /** 阅读邮件区域的div id */
    mainReadmail: "main_Readmail",
    /** 读信内容iframe id **/
    ifrmReadmail: "ifrmReadmail_Content_",

    /** 深发展菜单id */
    sfzmenu: "sfzMenu",

    menuT: {
        mail: "lm_mail",
        sms: "lm_sms",
        mms: "lm_mms",
        fax: "lm_fax"
    },
    //addrApiUrl:(gMain.urlYaddr!=""?gMain.urlYaddr+'/admin':'/addr/user'),	
    addrApiUrl: (gMain.rmSvrAppPath != "" ? gMain.rmSvrAppPath : '/s'),
    menuC: {
        mail: "ulMailFunc",
        sms: "ulSmsFunc",
        mms: "ulMmsFunc",
        fax: "ulFaxFunc",
        service: "ulService"
    },
    /** 工具条位置 **/
    toolBarPosition: {
        fixTop: 0,
        afterTitle: 1
    },
    /** 子菜单宽高 **/
    menuSize: {
        minWidth: 80,
        maxHeight: 322
    },
    treeLength: 2,

    /** 操作状态 */
    statusOk: "S_OK",
    statusNo: "S_NO",
    logoff: "S_logoff",

    /** 邮件列表对象id定义*/
    checkBoxName: "checkBox_mid",
    listMailId: "listMain_",
    listLeftId: "mailListLeft_",
    listHeaderId: "listHeader_",
    listTitleId: "listTitle_",
    listBodyId: "listBody_",
    listTopPageId: "topPage_",
    listFootPageId: "footPage_",
    listCheckBoxId: "checkbox_",
    listReadMailId: "listReadMail_",
    listMailSortIcon: "listMailSortIcon_",

    /** 邮件夹列表对象id定义*/
    listFolderMainId: "listFolderMainId",
    listFolderMainTableId: "listForderMainTable_",
    listFolderMainTrId: "listFolderMainTrId_",

    mailSubjectLength: 60,
    mailSubjectTipLength: 60,
    topNum: 5,
    signLen: 1000, //1000字符
    autoRepaly_max: 2000, //2000字符
    folderLength: 7,
    webLogLength: 2048,
    ulServiceMinHeight: 10,

    tab_ShowCloseAll: 5,
    tab_CloseAllId: "closeAllTabs",
    loadAddr_Timeout: 1000,

    /*  */
    encode_utf8: "utf-8",
    encode_gbk: "GBK",
    encode_gb2312: "gb2312",

    dataName: "var",
    composeFile: 'compose.do',//写信页面文件路径
    composeUrl: gMain.webPath + "/se/mail/compose.do?sid=" + gMain.sid,    //写信页面Url
    composeOkUrl: gMain.webPath + "/se/mail/composeok.do?sid=" + gMain.sid,//写信成功页面url
    composeSetupUrl: gMain.webPath + "/se/mail/setup.do?sid=" + gMain.sid,	//写信控件安装页面url
    composeReviewUrl: gMain.webPath + "/se/mail/composeview.do?sid=" + gMain.sid,//写信预览页面url
    composeUploadImgUrl: gMain.webPath + "/se/mail/uploadimg.do?sid=" + gMain.sid,    //邮箱内首页Url
    mailHomeUrl: gMain.webPath + "/se/mail/home.do?sid=" + gMain.sid,    //邮箱内首页Url
    logoutUrl: gMain.webPath + "/login/logout.do?sid=" + gMain.sid,//退出页面url gMain.returnUrl,//退出页面url
    sessionoutUrl: gMain.returnUrl + "?from=iframe",//超时页面
    mainUrl: gMain.webPath + "/main.do?sid=" + gMain.sid,//邮箱主框架页面
    historyUrl: gMain.webPath + "/static/se/mail/history.htm",			//标签历史记录页面
    readMailUrl: gMain.webPath + "/static/se/mail/viewmail.htm",		//阅读邮件
    readMailSessionUrl: gMain.webPath + "/se/mail/viewmail.do",		//阅读邮件
    mailPrintUrl: gMain.webPath + "/se/mail/mailprint.do?sid=" + gMain.sid,	//邮件打印
    portraitUrl: gMain.webPath + "/se/mail/face.do?sid=" + gMain.sid,	//表情选择
    //通讯录
    personalAddrUrl: gMain.webPath + "/se/addr/index.do?sid=" + gMain.sid, //个人通讯录URL
    corpAddrUrl: gMain.webPath + "/se/addr/corpaddr.do?sid=" + gMain.sid,//组织通讯录url

    searchMailMax: 1000,

    reqPath: gMain.rmSvr || "/",
    reqUrl: gMain.rmSvr + gMain.rmSvrAppPath,    //app接口请求路径
    appPostPath: gMain.rmSvr + gMain.rmSvrAppPath,
    apiGetPath: gMain.rmSvr + gMain.rmSvrWebAppViewPath,
    apiPostPath: gMain.rmSvr + gMain.rmSvrWebAppMailPath,
    uploadUrl: gMain.rmSvr + gMain.rmSvrWebAppMailPath,
    downloadUrl: gMain.rmSvr + gMain.rmSvrWebAppViewPath,
    packDownUrl: gMain.rmSvr + gMain.rmSvrWebAppMailPath,

    mailUlr_us: "/mail/data.do",		//设置页面 内部接口 url

    //云网盘
    netDiskUrl_fileSearch: "/service/disk/search.do",
    netDiskUrl_addFile: "/service/common/file.do",

    subjectColor: [
        {name: "黑色", value: "#333333", val: 0},
        {name: "红色", value: "#ff0000", val: 5},
        {name: "橙色", value: "#FF9a00", val: 1},
        {name: "绿色", value: "#008000", val: 2},
        {name: "蓝色", value: "#2757ec", val: 3},
        {name: "紫色", value: "#7e1a86", val: 4}
    ],

    func: {
        //全局func
        seq: "global:sequential",
        ver: "global:version",
        execTemp: "global:execTemp",

        //文件夹指令
        emptyFolder: "mbox:emptyFolder",       //清空文件夹
        listFolder: "mbox:getAllFolders",      //文件夹列表
        createFolder: "mbox:createUserFolder", //新建 文件夹
        updateFolder: "mbox:updateFolders",    //修改文件夹
        delFolder: "mbox:deleteFolders",       //删除文件夹
        updateFolderPass: "mbox:updateFolderPass", //修改文件夹密码
        setFolderPass: "mbox:setFolderPass",       //设置文件夹密码
        checkFolder: "mbox:checkFolder",         //检查邮件夹是否解锁

        //邮件类指令
        listMail: "mbox:listMessages", //根据文件夹列出邮件列表
        getMail: "mbox:getMessageInfos",
        delMail: "mbox:deleteMessages",
        updateMsg: "mbox:updateMsgAttrs",
        searchMail: "mbox:searchMessages",
        deliverStatus: "mbox:getDeliverStatus",
        moveMessages: "mbox:moveMessages",
        markLabel: "mbox:updateMessagesLabel",
        updateMail: "mbox:updateMessagesStatus",
        updateMailAll: "mbox:updateMessagesAll",
        downloadMail: "mbox:downloadMessages",
        readMail: "mbox:readMessage",
        readSessionMail: "mbox:readSessionMessage",
        autopack: "mbox:autoPack",    //打包下载邮件中的所有附件\
        deleteSessionMail: "mbox:deleteSessionMessages",
        forwardAttachs: "mbox:forwardAttachs",//附件转发
        mailFile: "mbox:mailFile",//邮件归档
        //附件指令
        attachList: "attach:listAttachments",
        upload: "attach:upload",
        deleteAttach: "upload:deleteTasks",
        pack: "attach:pack",
        refreshAttach: "attach:refresh",
        queryPack: "attach:queryPack",
        downloadPack: "attach:downloadPack",
        download: "attach:download",
        getAttach: "attach:getAttach",


        //参数配置
        alias: "user:alias",               //别名信息
        setAttrs: "user:setAttrs",        //基本参数设置
        getAttrs: "user:getAttrs",        //查询基本参数
        setUserInfo: "user:setUserInfo",   //设置用户基本信息
        getUserInfo: "user:getUserInfo",   //查询用户基本信息
        getSign: "user:getSignatures",     //获取签名
        setSign: "user:signatures",        //设置签名
        getWBList: "user:getWhiteBlackList",//获取黑白名单
        setWBList: "user:setWhiteBlackList",//设置黑白名单
        setFilter: "user:setFilter_New",        //设置过滤器
        getFilter: "user:getFilter_New",        //添加过滤器
        setPOP: "user:setPOPAccount",       //设置代收
        syncPOP: "user:syncPOPAccount",     //收取pop
        syncPOPALL: "user:syncPOPAccountAll",//收取所有pop
        getPOP: "user:getPOPAccounts",      //获得代收

        updatePwd: "user:updatePassword",   //修改密码
        session: "user:updateSession",      //session同步
        getLoginNotify: "mail:getLoginNotify", //获取登录提醒
        setLoginNotify: "mail:setLoginNotify", //保存登录提醒
        getDefaultEmail: "mail:getLoginDefault", //获取默认邮件数据
        setDefaultEmail: "mail:setLoginDefault", //设置默认邮件数据

        getSSOList: "mail:getGrantList", //获取授权登陆的列表
        cancelSSO: "mail:cancelGrant",  //取消授权
        //读写邮件操作
        getComposeId: "mbox:getComposeId",  //获取写信会话ID
        compose: "mbox:compose",           //写邮件
        forward: "mbox:forwardMessages",  //转发邮件
        reply: "mbox:replyMessage",        //回复邮件
        replyAll: "mbox:replyAll",         //回复所有邮件
        restore: "mbox:restoreDraft",      //恢复草稿
        viewSource: "mbox:getMessageData", //查看邮件原文
        sendMDN: "mbox:sendMDN",

        //设置页面 内部接口
        setAttrs_us: "mail:setAttrs",		//设置参数


        //通讯录
        getCommonAddr: "addr:getCommon",  //获取公共通讯录数据

        //换肤
        getSkinList: "mail:getSkinList",
        setUserSkin: "mail:setUserSkin",

        //设置用户姓名
        setWebUserInfo: "mail:setUserInfo",
        test: "",

        //云网盘
        diskSearch: "disk:search",
        netDisk_attachUpload: "common:attachUpload",
        //拼写检查
        spellCheck: "mail:SetSpellCheck"
    },
    logFunc: {
        req: "RQ",
        resp: "RS",
        js: "JS"
    },

    logLevel: {
        debug: "DEBUG",
        info: "INFO",
        error: "ERROR"
    },
    labelColor: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10', 'c11', 'c12', 'c13', 'c14', 'c15', 'c16', 'c17', 'c18', 'c19', 'c20', 'c21', 'c22', 'c23', 'c24', 'c25', 'c26', 'c27', 'c28', 'c29', 'c30', 'c31', 'c32', 'c33', 'c34', 'c35'],

    menu: {
        mail: "MAIL",
        addr: "ADDR",
        write: "WRITE",
        inbox: "INBOX",
        config: "CONFIG",
        readmail: "READ",
        compose: "WRITE"
    },

    /* 指定系统 菜单 */
    sysMenus: {
        1: 1,
        2: 1,
        3: 1,
        4: 1,
        5: 1,
        12: 1,
        13: 1,
        14: 1
    },
    //总裁邮箱，公共邮箱志用功能模块id, 1表示不显示，cc.checkConfig取反了
    extMailMenus: {
        "MAIL_CONFIG_DEFAULTACCOUNT": 1,
        "MAIL_CONFIG_LOGINNOTIFY": gMain.loginNotifyType,
        "MAIL_CONFIG_MEMMANAGER": 1
    },
    loginType: {
        web: "WEB",
        pm: "PM",
        mm: "MM"
    },

    /*
     * 文件夹枚举
     */
    folderEnum: {
        unreadmail: 0,
        inbox: 1,
        draft: 2,
        sent: 3,
        del: 4,
        junk: 5,
        monitor: 13,     //监控文件夹
        audit: 14		 //审核文件夹
    }
};


/**
 * 得到dom对象
 * @param {string|object} id或者dom对象
 * @return {object} 返回dom对象
 */
function $() {
    var xo = [];
    for (var i = 0, l = arguments.length; i < l; i++) {
        var aa = arguments[i];
        if (typeof(aa) == 'string') {
            aa = document.getElementById(aa);
        }
        if (l == 1) {
            return aa;
        }
        xo.push(aa);
    }
    return xo;
}


function $G(Ail, gy) {
    var args = [];
    args.push("");
    var i, l;
    for (i = 2, l = arguments.length; i < l; i++) {
        args.push(arguments[i]);
    }
    for (i = 0, l = Ail.length; i < l; i++) {
        var aa = $(Ail[i]);
        if (aa) {
            //aa[gy].apply(aa, args);
            args[0] = aa;
            El[gy].apply(aa, args);
        }
    }
}

function $A(ao) {
    var al = [];

    function ng(ao) {
        return (ao && (ao.length || ao.length == 0) && typeof(ao) != "string" && !ao.tagName && !ao.alert);
    }

    if (ng(ao)) {
        for (var i = 0, l = ao.length; i < l; i++) {
            al[i] = ao[i];
        }
    }
    return al;
}

function fGoto() {
}

function ch(func, error) {
    if (error instanceof SyntaxError) {
        handleErrors("Syntax Error: " + func + "<br>ErrorName:" + error.name + "<br>ErrorMessage:" + error.message);
    } else if (error instanceof Error) {
        handleErrors("" + func + "<br>ErrorName:" + error.name + "<br>ErrorMessage:" + error.message);
    } else {
        handleErrors(func);
    }
}

/**
 * 浏览器对象类：
 * var Browser = {value,version}
 * @class
 */
var Browser = {};

function WindowInit() {
    try {
        var ua = window.navigator.userAgent.toUpperCase();
        var br = "";
        var ver = 0;
        var isIe = false;

        switch (true) {
            case (/MSIE/.test(ua) && !(/OPERA/.test(ua))):
                br = "ie";
                ver = ua.match(/MSIE\s([0-9]+\.?[0-9]*)/)[1] - "0";
                Browser.ie = ver;
                isIe = true;
                break;
            case (/FIREFOX/.test(ua)):
                br = "firefox";
                ver = ua.match(/FIREFOX\/([0-9]+\.?[0-9]*)/)[1] - "0";
                Browser.firefox = ver;
                break;
            case (/OPERA/.test(ua) && !(/MSIE/.test(ua))):
                br = "opera";
                ver = ua.match(/VERSION\/([0-9]+\.?[0-9]*)/)[1];
                Browser.opera = ver;
                break;
            case (/SAFARI/.test(ua) && !(/CHROME/.test(ua))):
                br = "safari";
                ver = ua.match(/VERSION|SAFARI\/([0-9]+\.?[0-9]*)/)[1];
                Browser.safari = ver;
                break;
            case (/CHROME/.test(ua)):
                br = "chrome";
                ver = ua.match(/CHROME\/([0-9]+\.?[0-9]*)/)[1];
                Browser.chrome = ver;
                break;
            case (/WEBKIT/.test(ua)):
                br = "webkit";
                ver = ua.match(/WEBKIT\/([0-9]{1,}\.[0-9]{1,})/)[1];
                Browser.webkit = ver;
                break;
            case (/MOZILLA/.test(ua) && !(/(COMPATIBLE|WEBKIT)/.test(ua))):
                br = "mozilla";
                ver = ua.match(/MOZILLA\/([0-9]+)/)[1];
                Browser.mozilla = ver;
                break;
            case (/NETSCAPE/.test(ua)):
                br = "netscape";
                ver = ua.match(/NETSCAPE[0-9]*\/([0-9]+)/)[1];
                Browser.netscape = ver;
                break;
        }

        /**
         * 浏览器类型：Browser.value 取得<br>
         * msie: 微软ie浏览器或基于ie的第三方浏览器<br>
         * firefox: firefox火狐浏览器<br>
         * netscape: netscape浏览器<br>
         * opera: opera浏览器<br>
         * safari: apple safari浏览器<br>
         * chrome: google 浏览器<br>
         * webkit:所有基于webkit的浏览器<br>
         * mozilla: 其它基于 mozilla 的浏览器<br>
         */
        Browser.value = br;
        /**
         * 浏览器版本，用Browser.version取得<br>
         * 一位数字表示的主版本号(ie5.5例外)
         */
        Browser.version = parseFloat(ver, 10);
        /**
         * 标识是否为IE浏览器
         */
        Browser.isIE = isIe;
        /**
         * 是否为ie5.0浏览器
         */
        Browser.isIE5 = false;
        if (br == "ie" && ver >= 5 && ver < 5.5) {
            Browser.isIE5 = true;
        }
    } catch (e) {

    }


    if (window.attachEvent) {
        window.attachEvent("onunload", function () {
                var el;
                window.GC = null;
            }
        );
    }

    if (Browser.isIE && Browser.version < 7) {
        //缓存图片
        try {
            document.execCommand("BackgroundImageCache", false, true);
        } catch (e) {
        }
        //修复ie6下遮罩层问题
        if ($(gConst.divOpactity)) {
            $(gConst.divOpactity).innerHTML = CC.getIframe("Opactity", "about:blank");
        }
        if ($(gConst.shareLayer)) {
            var html = '<div class="shareLayer" style="position:absolute; width:100%; height:100%; z-index:1;"></div>';
            html += CC.getIframe("shareLayer", "about:blank");
            $(gConst.shareLayer).innerHTML = html;
        }
    }
}

/**
 * 错误回调
 * @param {string} sMag
 * @param {string} sUrl
 * @param {string} sLine
 * @param {string} sFunc
 * @returns {boolean}
 */
function handleErrors(sMag, sUrl, sLine, sFunc) {
    if (IsWriteLog) {
        var sLog = (!sUrl) ? sMag : ('Error:' + sMag + '<br>Line:' + sLine + '<br>Url:' + sUrl);
        Util.writeLogError(gConst.logFunc.js, "Common.handleErrors", sLog + " | stack=" + Util.getStack());
    }
    if (IsDebug) {
        sMag = (!sUrl) ? sMag : ('Error:' + sMag + '<br>Line:' + sLine + '<br>Url:' + sUrl);
        //sMag += '<br>Report:<a target="frmQQ" href="http://wpa.qq.com/msgrd?V=1&Uin=122142023&Site=cmail139&Menu=yes"><img border="0" SRC="http://wpa.qq.com/pa?p=1:122142023:16" alt="点击这里发消息" /></a>';
        CC.alert(sMag, sFunc, "Sytstem Error");
    }
    return true;
}
if (!IsDebug) {
    window.onerror = handleErrors;
}

WindowInit();



