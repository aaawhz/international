function Folder() {
    //对象
    this.listBodyDiv = null;
    this.listReadMailDiv = null;
    this.menuId = "MAIL";
}

/** 各文件夹不显示的菜单 */
Folder.menu = {
    "sys0": {
        "MAIL_INBOX_EDIT": 1,
        "MAIL_INBOX_DELETE": 1,
        "MAIL_INBOX_EMPTY": 1
    },
    "sys1": {
        "MAIL_INBOX_EDIT": 1,
        "MAIL_INBOX_REALDELETE": 1,
        "MAIL_INBOX_EMPTY": 1
    },
    "sys2": {
        "MAIL_INBOX_FORWARD": 1,
        "MAIL_INBOX_REALDELETE": 1,
        "MAIL_INBOX_EMPTY": 1,
        "MAIL_INBOX_REFUSE": 1,
        "MAIL_INBOX_LAYOUT": 1
    },
    "sys4": {
        "MAIL_INBOX_EDIT": 1,
        "MAIL_INBOX_DELETE": 1
    },
    "sys5": {
        "MAIL_INBOX_EDIT": 1,
        "MAIL_INBOX_DELETE": 1
    }
};

/**各个文件夹顶部显示的按钮 ,sys0中的数字0代表文件夹的ID [sys0:未读邮件夹  sys1:收件箱  sys2:草稿箱   sys3:已发送   sys4:已删除    ]
 * sort: 1 表示按钮显示在第一位，其他依次类推
 */
Folder.menuData = {
    'default': {
        'MAIL_INBOX_DELETE': {
            sort: 1
        },
        'MAIL_INBOX_REALDELETE': {
            sort: 2
        },
        'MAIL_INBOX_FORWARD': {
            sort: 3
        },
        'MAIL_INBOX_MARK': {
            sort: 4
        },
        'MAIL_INBOX_MOVE': {
            sort: 5
        },
        'MAIL_INBOX_FILTER': {
            sort: 6
        },
        'MAIL_INBOX_INFORM': {
            sort: 7
        },
        'MAIL_INBOX_MORE': {
            sort: 8
        }
    },
    'sys0': {
        'MAIL_INBOX_DELETE': {
            sort: 1
        },
        'MAIL_INBOX_REALDELETE': {
            sort: 2
        },
        'MAIL_INBOX_FORWARD': {
            sort: 3
        },
        'MAIL_INBOX_MARK': {
            sort: 4
        },
        'MAIL_INBOX_MOVE': {
            sort: 5
        },
        'MAIL_INBOX_INFORM': {
            sort: 6
        }
    },
    'sys1': {
        'MAIL_INBOX_DELETE': {
            sort: 1
        },
        'MAIL_INBOX_REALDELETE': {
            sort: 2
        },
        'MAIL_INBOX_FORWARD': {
            sort: 3
        },
        'MAIL_INBOX_MARK': {
            sort: 4
        },
        'MAIL_INBOX_MOVE': {
            sort: 5
        },
        'MAIL_INBOX_FILTER': {
            sort: 6
        },
        'MAIL_INBOX_INFORM': {
            sort: 7
        },
        'MAIL_INBOX_MORE': {
            sort: 8
        }
    },
    'sys2': {
        'MAIL_INBOX_DELETE': {
            sort: 1
        },
        'MAIL_INBOX_REALDELETE': {
            sort: 2
        },
        'MAIL_INBOX_MARK': {
            sort: 3
        },
        'MAIL_INBOX_MOVE': {
            sort: 4
        },
        'MAIL_INBOX_MORE': {
            sort: 8
        }
    },
    'sys3': {
        'MAIL_INBOX_DELETE': {
            sort: 1
        },
        'MAIL_INBOX_REALDELETE': {
            sort: 2
        },
        'MAIL_INBOX_FORWARD': {
            sort: 3
        },
        'MAIL_INBOX_MARK': {
            sort: 4
        },
        'MAIL_INBOX_MOVE': {
            sort: 5
        },
        'MAIL_INBOX_FILTER': {
            sort: 6
        },
        'MAIL_INBOX_MORE': {
            sort: 8
        }
    },
    'sys4': {
        'MAIL_INBOX_REALDELETE': {
            sort: 1
        },

        'MAIL_INBOX_FORWARD': {
            sort: 2
        },
        'MAIL_INBOX_MARK': {
            sort: 3
        },
        'MAIL_INBOX_MOVE': {
            sort: 4
        },
        'MAIL_INBOX_FILTER': {
            sort: 5
        },
        'MAIL_INBOX_MORE': {
            sort: 8
        }
    },
    'sys5': {
        'MAIL_INBOX_DELETE': {
            sort: 1
        },
        'MAIL_INBOX_REALDELETE': {
            sort: 2
        },
        'MAIL_INBOX_FORWARD': {
            sort: 3
        },
        'MAIL_INBOX_NOTJUNK': {
            sort: 4
        },
        'MAIL_INBOX_MARK': {
            sort: 5
        },
        'MAIL_INBOX_MOVE': {
            sort: 6
        },
        'MAIL_INBOX_MORE': {
            sort: 8
        }
    },
    'sys6': {
        'MAIL_INBOX_DELETE': {
            sort: 1
        },
        'MAIL_INBOX_FORWARD': {
            sort: 2
        },
        'MAIL_INBOX_NOTJUNK': {
            sort: 3
        },
        'MAIL_INBOX_MARK': {
            sort: 4
        },
        'MAIL_INBOX_MOVE': {
            sort: 5
        },
        'MAIL_INBOX_MORE': {
            sort: 8
        }
    },
    'sys7': {
        'MAIL_INBOX_MOVE': {
            sort: 5
        }
    },
    'sys10': {
        'MAIL_INBOX_DELETE': {
            sort: 1
        },
        'MAIL_INBOX_FORWARD': {
            sort: 2
        },
        'MAIL_INBOX_MARK': {
            sort: 3
        },
        'MAIL_INBOX_MOVE': {
            sort: 4
        },
        'MAIL_INBOX_FILTER': {
            sort: 5
        },
        'MAIL_INBOX_REFUSE': {
            sort: 6
        },
        'MAIL_INBOX_MORE': {
            sort: 8
        }
    },
    'user': {
        'MAIL_INBOX_DELETE': {
            sort: 1
        },
        'MAIL_INBOX_REALDELETE': {
            sort: 2
        },
        'MAIL_INBOX_FORWARD': {
            sort: 3
        },
        'MAIL_INBOX_MARK': {
            sort: 4
        },
        'MAIL_INBOX_MOVE': {
            sort: 5
        },
        'MAIL_INBOX_FILTER': {
            sort: 6
        },
        'MAIL_INBOX_INFORM': {
            sort: 7
        },
        'MAIL_INBOX_MORE': {
            sort: 8
        }
    },
    'label': {
        'MAIL_INBOX_DELETE': {
            sort: 1
        },
        'MAIL_INBOX_REALDELETE': {
            sort: 2
        },
        'MAIL_INBOX_FORWARD': {
            sort: 3
        },
        'MAIL_INBOX_MARK': {
            sort: 4
        },
        'MAIL_INBOX_MOVE': {
            sort: 5
        },
        'MAIL_INBOX_FILTER': {
            sort: 6
        },
        'MAIL_INBOX_INFORM': {
            sort: 7
        },
        'MAIL_INBOX_MORE': {
            sort: 8
        }
    },
    'MARK': {
        'MAIL_INBOX_MARK_READ': {
            sort: 1
        },
        'MAIL_INBOX_MARK_UNREAD': {
            sort: 2
        },
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
    'FILTER': {
        'MAIL_INBOX_FILTER_ALL': {
            sort: 1
        },
        'MAIL_INBOX_FILTER_NOREAD': {
            sort: 2
        },
        'MAIL_INBOX_FILTER_READ': {
            sort: 3
        },
        'MAIL_INBOX_FILTER_URGENT': {
            sort: 4
        },
        'MAIL_INBOX_FILTER_COMMENTS': {
            sort: 5
        },
        'MAIL_INBOX_FILTER_FORWARD': {
            sort: 6
        },
        'MAIL_INBOX_FILTER_STARRED': {
            sort: 7
        },
        'MAIL_INBOX_FILTER_UNSTARRED': {
            sort: 8
        },
        'MAIL_INBOX_FILTER_ATTACHMENT': {
            sort: 9
        },
        'MAIL_INBOX_FILTER_NOATTACHMENT': {
            sort: 10
        }
    },
    "MORE": {
        "MAIL_INBOX_MORE_MAILEXPORT": {sort: 1},
        "MAIL_INBOX_MORE_MAILIMPORT": {sort: 2}
    },
    'sys12': {
        'MAIL_INBOX_DELETE': {
            sort: 1
        },
        'MAIL_INBOX_REALDELETE': {
            sort: 2
        },
        'MAIL_INBOX_FORWARD': {
            sort: 3
        },
        'MAIL_INBOX_MARK': {
            sort: 4
        },
        'MAIL_INBOX_MOVE': {
            sort: 5
        },
        'MAIL_INBOX_FILTER': {
            sort: 6
        },
        'MAIL_INBOX_INFORM': {
            sort: 7
        },
        'MAIL_INBOX_MORE': {
            sort: 8
        }
    },
    'sys13': {
        'MAIL_INBOX_DELETE': {
            sort: 1
        },
        'MAIL_INBOX_REALDELETE': {
            sort: 2
        },
        'MAIL_INBOX_FORWARD': {
            sort: 3
        },
        'MAIL_INBOX_MARK': {
            sort: 4
        },
        'MAIL_INBOX_MOVE': {
            sort: 5
        },
        'MAIL_INBOX_FILTER': {
            sort: 6
        },
        'MAIL_INBOX_INFORM': {
            sort: 7
        },
        'MAIL_INBOX_MORE': {
            sort: 8
        }
    },
    'sys14': {
        'MAIL_INBOX_PASSAUDIT': {
            sort: 1
        },
        'MAIL_INBOX_NOTPASSAUDIT': {
            sort: 2
        },
        'MAIL_INBOX_DELETE': {
            sort: 3
        },
        'MAIL_INBOX_REALDELETE': {
            sort: 4
        },
        'MAIL_INBOX_FORWARD': {
            sort: 5
        },
        'MAIL_INBOX_MARK': {
            sort: 6
        },
        'MAIL_INBOX_MOVE': {
            sort: 7
        },
        'MAIL_INBOX_FILTER': {
            sort: 8
        },
        'MAIL_INBOX_INFORM': {
            sort: 9
        },
        'MAIL_INBOX_MORE': {
            sort: 10
        }
    }

};

/**定义不需要id的节点，比如二级菜单**/
Folder.notNeedIds = {
    'EMPTY': 1,
    'newLabel': 1,
    'FILTERALL': 1,
    'FILTERNOREAD': 1,
    'FILTERREAD': 1,
    'FILTERURGENT': 1,
    'FILTERCOMMENTS': 1,
    'FILTERFORWARD': 1,
    'FILTERSTARRED': 1,
    'FILTERUNSTARRED': 1,
    'FILTERATTACHMENT': 1,
    'FILTERNOATTACHMENT': 1,
    'FILTERMONITORRECEIVE': 1,
    'FILTERMONITORSEND': 1,
    'FILTERPASSAUDIT': 1,
    'FILTERNOTPASSAUDIT': 1,
    'FILTERUNAUDIT': 1,
    'FILTERALLAUDIT': 1,
    'FILTERRECEIVEAUDIT': 1,
    'FILTERSENDAUDIT': 1,
    'MAILIMPORT': 1
};

Folder.prototype = {
    initialize: function () {
        var aw = MM[gConst.folder];
        aw.needRequest = true;
        aw.bOrder = GE.list.order;
        aw.order = GE.list.order;
        aw.desc = 0;
        aw.isLoadNoReadMail = true;
        aw.start = 1;
        aw.pageCurrent = 0;
        aw.fid = 1;
        aw.stats = {};
        aw.isSearch = false;
        aw.isFilter = "";
        aw.isSecondSearch = false;
        aw.pageCount = 0;
        aw.fromSearch = 0;
        aw.stateFlagArr = Lang.Mail.list_MailType.split(",");
        aw.stateFlag = 0;
        aw.period = [];
        aw.week = Lang.Mail.date_Weeks.split(",");
        aw.isRefreshFolders = false;
        aw.currentPeriod = -1;
        aw.drag = null;
        aw.checkBoxAll = null;
        aw.checkBox = null;
        aw.flag = null;
        aw.msg = Lang.Mail.LoadMailList;
        aw.isAll = false;
        aw.topNum = 0;
        aw.topMids = [];
        aw.toolbarPosition = gConst.toolBarPosition.afterTitle;
        aw.fMenus = {};
        aw.sessionCount = 0;
        var i, t, l, allMenus;
        var allMenus = CC.getMailMenu(gConst.menu.inbox);
        l = allMenus.length;
        for (i in this) {
            t = this[i];
            if (typeof(t) == "function") {
                aw[i] = t;
            }
        }
        this.getMenuHash(allMenus, aw.fMenus);
        this.initEvents();

        if (!GC.check("MAIL_MANAGER_SESSIONMODE")) {
             gMain.sessionMode = "0";
        }
    },
    /*
     * 将树型目录转换为平行hash
     */
    getMenuHash: function (data, hash) {
        var l = data.length;
        for (var i = 0; i < l; i++) {
            hash[data[i].name] = data[i];
//            if (data[i].children.length > 0) {
//                this.getMenuHash(data[i].children, hash);
//            }
        }
    },
    /**
     * 初始化读信页各个事件
     */
    initEvents: function () {
        var p = this,
            fl = folderlock,
            $ = jQuery,
            $obj = $("#unlock_inUnRead"),
            $obj1 = $("#unlock_inSearch");

        if ($obj[0]) {
            $("#unlock_inUnRead").click(function () {
                unLock_inUnRead("unRead");
            });
        }

        if ($obj1[0]) {
            $obj1.click(function () {
                unLock_inUnRead("search");
            });
        }

        function unLock_inUnRead(type, flag) {
            //(id type cb)
            fl.unlocked("", type, undefined, flag);
        }

        p.changeStatus_read();
		 
		
        TaskMail.bindTaskEvent(document);
        p.bindCloseInBarEvent($);
        //翻页 得点击移入效果 委托给页面无需重复加载的父元素

        jQuery("#wrapper .toolbar").on("mouseenter", ".pageNum", function(event) {
            var list = jQuery("#wrapper .toolbar .pageitem");
            list.show();
            if (/msie 6/i.test(navigator.userAgent) && list.height() > 200) {
                list.css(
                    "height", "200px");
            }
        });
        jQuery("#wrapper .toolbar").on("mouseenter", ".pageitem", function(event) {

            jQuery("#wrapper .toolbar .pageitem").show();
        });
        jQuery("#wrapper .toolbar").on("mouseleave", ".pageNum", function(event) {
            jQuery("#wrapper .toolbar .pageitem").hide();
        });
        jQuery("#wrapper .toolbar").on("mouseleave click", ".pageitem", function(event) {
            jQuery(this).hide();
        });


        jQuery("#footpage").on("mouseenter", ".pageNum", function(event) {
            var list = jQuery("#footpage .pageitem");
            list.show();
            if (/msie 6/i.test(navigator.userAgent) && list.height() > 200) {
                list.css("height", "200px");
            }
        });
        jQuery("#footpage").on("mouseenter", ".pageitem", function(event) {
            jQuery("#footpage .pageitem").show();
        });
        jQuery("#footpage").on("mouseleave", ".pageNum", function(event) {
            jQuery("#footpage .pageitem").hide();
        });
        jQuery("#footpage").on("mouseleave click", ".pageitem", function(event) {
            jQuery(this).hide();
        });
    },
 
    /**
     * 点击未读图标 变成 已读图标
     */
    changeStatus_read: function () {

        var $ = jQuery,
            p = this;

        //点击未读图标 变成 已读图标
		$(".folderList_status").bind("click",function(ev){
            if ($(this).find("i").attr("class") == "status5") {
                $(this).find("i").attr("class", "status6");
                var mid = $(this).parent().parent().find("input[type=checkbox]").val();
                var mids = [];

                mids.push(mid);
                p.mark(mids, "read", 0);

                ev.stopPropagation();
            } else if ($(this).find("i").attr("class") == "status6") {
                $(this).find("i").attr("class", "status5");
                var mid = $(this).parent().parent().find("input[type=checkbox]").val();
                var mids = [];

                mids.push(mid);
                p.mark(mids, "read", 1);

                ev.stopPropagation();
            }
        });
    },
    getLockTip: function (p, search) {
        var html = [], id = "";


        id = "unlock_inSearch";

        //如果是未读邮件夹 或者是搜索邮件夹
        if (p.offUnreadFolder() && p.isLoadNoReadMail && p.isSearch) {
            /*
             * 如果是加锁状态，并且加锁邮件夹有未读邮件，
             * （只有其他邮件夹有未读邮件aa，那么未读邮件就会有邮件aa
             * 所以，在未读邮件夹需要提示用户：“部分邮件已加锁”，需解锁后重新搜索
             */
            if (gMain.hasLock_unReadMail == true && gMain.lock_close == true) {
                html.push("<div class=\"cy-yellowtips\" id='unReadMail_lockTip'>");
                html.push(Lang.Mail.ConfigJs.someLockedTip);
                html.push("<a href=\"javascript:void(0);\" id=\"" + id + "\">");
                html.push(Lang.Mail.Write.unlockAndsearch + "</a></div>");
            }
        }
        if (p.text === Lang.Mail.fax.sensitivemail ) {
            html.push(SensitiveMail.addTips());
        }

        return html.join("");
    },
    offUnreadFolder: function () {
        var isShow = true,
            i = 0;
        if (GE.currentFid && GE.currentFid != 0) {
            isShow = false;
            return isShow;
        }
        for (var item in GE.searchFlag) {
            if (GE.searchFlag.hasOwnProperty(item)) {
                i++;
            }
        }
        if (i === 1 && GE.searchFlag && !GE.searchFlag.read) {
            isShow = false;
            return isShow;
        }
        return isShow;
    },
    /***
     * 判断任务邮件tip是否显示
     */
    getTaskTipShow: function () {
        var me = this,
            tempNum;

        if (Folder.taskType === 2) {
            tempNum = GE.taskedMailNum;
        } else {
            tempNum = GE.taskMailNum;
        }
        //待办邮件
        return (me.text === Lang.Mail.fax.unhandlemail && tempNum !== me.stats.messageCount);
    },
    /***
     * 得到邮件列表HTML
     */
    getHtml: function () {
        var html = [];
        var p1 = this;
        var o = p1.name;
        var om = CM[o]["var"] || [];
        var fid = p1.fid;
        var label;
        GE.topNum = 0;
        GE.topMids.splice(0);
        p1.start = 1;
        p1.limit = CC.getPageSize();
        if (this.fid == 1 && gMain.sessionMode == "1") {
            p1.sessionCount = CM[o].sessionCount;
        }
        p1.isSearch = (p1.name == GE.folderObj.search) ? true : false;
        if (p1.isSearch) {
            p1.fid = 0;
        }
        var mailCount = 0;
        var newMailCount = 0;

        mailCount = p1.stats.messageCount;
        newMailCount = p1.stats.unreadMessageCount;

        var sortArr = [];
        var sortIcon = (p1.desc ? "desc" : "asc");
        // 0:日期，1:发件人，2:收件人，3:大小，4:主题
        for (var ic = 0; ic < GE.list.orderCount; ic++) {
            if (p1.order == GE.list.orderField[ic]) {
                if (p1.order == GE.list.orderField[1])
                    sortArr[ic] = '<i id="' + gConst.listMailSortIcon + GE.list.orderField[ic] + '"  class="' + sortIcon + '"></i>';
                else
                    sortArr[ic] = '<i id="' + gConst.listMailSortIcon + GE.list.orderField[ic] + '" class="' + sortIcon + '"></i>';
            }
            else {
                if (ic == 1)
                    sortArr[ic] = '<i id="' + gConst.listMailSortIcon + GE.list.orderField[ic] + '" ></i>';
                else
                    sortArr[ic] = '<i id="' + gConst.listMailSortIcon + GE.list.orderField[ic] + '"></i>';
            }
        }

        var from = {
            title: Lang.Mail.list_Send,
            sort: 1
        };
        if (fid == GE.folder.draft || fid == GE.folder.sent) {
            from = {
                title: Lang.Mail.list_Recipients,
                sort: 2
            };
        }
        if (p1.type === "label") {
            label = fid;
        }
        var text = p1.text.lefts(30).encodeHTML();
        var readAllBtn = /^(sys|user)[1-9]\d*$/.test(o) ? '  <a href="#" onclick="CC.setAllRead(\'' + o + '\')">'+Lang.Mail.fax.alltipread+'</a>':""; //全部标记为已读
        var strTitle = '<h1 id="' + gConst.listMailId + "h1_" + o + '">' + text + '</h1><p id="' + gConst.listMailId + 'mailCount_' + o + '">(<span>' + Lang.Mail.maicountTitle.format(mailCount) + '，<a href="#" onclick="CC.searchNewMail(' + fid + ',true, ' + label + ')">' + Lang.Mail.unreadMailTitle + '</a>' + Lang.Mail.countTitle.format(newMailCount) + '</span>' + readAllBtn;
        var mailFileCount = (gMain.mailFileCount ? parseInt(gMain.mailFileCount) : 10000);
        if (mailCount >= mailFileCount && fid == 1) {
            strTitle += '，';
            strTitle += Lang.Mail.mailFileTitle.format("&nbsp;<a onclick=\"MM['sys1'].loadMailFileHtml()\" href='#'>" + Lang.Mail.mailFile + "</a>&nbsp;");
            //strTitle +=")";
        }
        strTitle += ')</p>'
        //if(GE.folderObj.sent==o){
        //    strTitle += '<p style="margin-left:100px"><a href="javascript:fGoto();"  onClick="MM.getModule(\'deliver\');">查询发信投递状态 </a></p>';
        //}
        // 判断是否是代收文件夹列表
        strTitle += this.isPopFolder(fid);

        var searchKey = GE.searchKey || "";

        // <a href="#" onclick="CC.setAllRead(\''+o+'\')">全部标记为已读</a>
        if (p1.isFilter) {
            if (GE.folderMap && GE.folderMap[gConst.folderEnum.audit] && p1.fid == gConst.folderEnum.audit && (p1.isFilter == Lang.Mail.Write.FilterAll ) || p1.isFilter == Lang.Mail.Write.reMailAudit || p1.isFilter == Lang.Mail.Write.sendMailAudit) {
                //(全部)
                if (p1.isFilter == Lang.Mail.Write.FilterAll) {
                    //待审核
                    strTitle = '<h1 id="' + gConst.listMailId + "h1_" + o + '">' + Lang.Mail.Write.unAudit + '</h1>';
                    strTitle += '<p id="' + gConst.listMailId + 'mailCount_' + o + '">(' + Lang.Mail.list_FilterMailCount.format(mailCount) + '';
                }
                else if (p1.isFilter == Lang.Mail.Write.reMailAudit || p1.isFilter == Lang.Mail.Write.sendMailAudit) {
                    //待审核>>接收审核邮件（10封）
                    strTitle = '<h1 id="' + gConst.listMailId + "h1_" + o + '">' + Lang.Mail.Write.unAudit + '</h1>';
                    strTitle += '<span id="' + gConst.listMailId + "span_" + o + '">&nbsp;&gt;&gt;&nbsp;</span>';
                    strTitle += '<h1 id="' + gConst.listMailId + "h2_" + o + '">' + p1.isFilter + '</h1>';
                    strTitle += '<p id="' + gConst.listMailId + 'mailCount_' + o + '">(' + Lang.Mail.list_FilterMailCount.format(mailCount) + readAllBtn + ')</p>';
                }

            } else if ((GE.folderMap && ( GE.folderMap[gConst.folderEnum.audit] || GE.folderMap[gConst.folderEnum.monitor])) && (p1.fid == gConst.folderEnum.audit || p1.fid == gConst.folderEnum.monitor) && (p1.isFilter == Lang.Mail.Write.dateFilter)) {
                //待审核>>接收审核邮件（10封） 日期筛选
                strTitle = '<h1 id="' + gConst.listMailId + "h1_" + o + '">' + text + '</h1>';
                strTitle += '<span id="' + gConst.listMailId + "span_" + o + '">&nbsp;&gt;&gt;&nbsp;</span>';
                strTitle += '<h1 id="' + gConst.listMailId + "h2_" + o + '">' + p1.selectDate + '</h1>';
                strTitle += '<p id="' + gConst.listMailId + 'mailCount_' + o + '">(' + Lang.Mail.list_FilterMailCount.format(mailCount) + readAllBtn + ')</p>';
            }
            else {
                //p1.func = gConst.func.searchMail;
                strTitle = '<h1 id="' + gConst.listMailId + "h1_" + o + '">' + text + '</h1>';
                strTitle += '<span id="' + gConst.listMailId + "span_" + o + '">&nbsp;&gt;&gt;&nbsp;</span>';
                strTitle += '<h1 id="' + gConst.listMailId + "h2_" + o + '">' + p1.isFilter + '</h1>';
                strTitle += '<p id="' + gConst.listMailId + 'mailCount_' + o + '">(' + Lang.Mail.list_FilterMailCount.format(mailCount) + readAllBtn + ')</p>';
                //p1.isFilter = "";
            }

        }

        if (p1.isSearch) {
            if (searchKey) {
                var searchKeyTip = searchKey.trim();
                searchKey = searchKey.trim().lefts(30);
                searchKey = searchKey.encodeHTML();
                //strTitle = '<h1 id="' + gConst.listMailId + "h1_" + o + '">' + Lang.Mail.list_SearchKeyIs + '</h1><p class="keyword" title="' + searchKeyTip + '">' + searchKey + '</p><p id="' + gConst.listMailId + 'mailCount_' + o + '">(' + Lang.Mail.list_searchMailNumber.format(mailCount) + ')</p>';
                strTitle = '<h1 id="' + gConst.listMailId + "h1_" + o + '">' + Lang.Mail.Write.searchResult + '</h1>';
                strTitle += '<p style="color:#333333;" title="' + searchKeyTip.encodeHTML() + '">&nbsp;&gt;&gt;&nbsp;' + Lang.Mail.SearchKeyAndCount + searchKey + '</p>';
                //strTitle += '<p class="keyword">' + text + '</p>';
                strTitle += '<p id="' + gConst.listMailId + 'mailCount_' + o + '">(' + Lang.Mail.list_searchMailNumber.format(mailCount) + readAllBtn + ')</p>';
            }
            else { //else if (MM[gConst.searchMail].stateflag) {
                strTitle = '<h1 id="' + gConst.listMailId + "h1_" + o + '">' + text + '</h1><p id="' + gConst.listMailId + 'mailCount_' + o + '">(' + Lang.Mail.maicountTitle.format(mailCount) + '，';
                if (p1.checkObjLen(GE.searchFlag) === 1 && GE.searchFlag.read === 1) {
                    strTitle += Lang.Mail.unreadMailTitle;
                } else {
                    strTitle += '<a href="javascript:;" onclick="CC.searchFolderNoRead(' + fid + ');">';
                    strTitle += Lang.Mail.unreadMailTitle + '</a> ';
                }
                strTitle += Lang.Mail.countTitle.format(newMailCount) + readAllBtn + ')</p>';
            }
        }

        html[html.length] = '<div class="main" id="' + gConst.listMailId + o + '">';

        html[html.length] = this.getLockTip(this);
        if (p1.text === Lang.Mail.fax.unhandlemail) {//"待办邮件"
            html[html.length] = '<div class="header" id="' + gConst.listHeaderId + o + '">';
            html[html.length] = '<div style="overflow:hidden;">';
            html[html.length] = '<ul class="nav-hd"><li ' + (Folder.taskType !== 2 ? 'class="currentd"' : '') + '><a onclick="CC.receiveMail({taskFlag: 1});return false;" href="javascript:fGoto();">'+Lang.Mail.fax.unhandlemail+'</a></li><li ' + (Folder.taskType === 2 ? 'class="currentd"' : '') + '><a onclick="CC.receiveMail({taskFlag: 2}); return false;" href="javascript:fGoto();">'+Lang.Mail.fax.hasdone+'</a></li></ul>';//已完成
            html[html.length] = '</div></div>';
        }
        if (this.fid == 8) {
            html[html.length] = '<div class="header" id="' + gConst.listHeaderId + o + '">';
            html[html.length] = '<div style="overflow:hidden;">';
            html[html.length] = '<ul class="nav-hd"><li class="currentd"><a onclick="return false;" href="javascript:fGoto();">' + Lang.Mail.Write.accoutMail + '</a></li><li><a onclick=CC.goBillmanager("' + o + '");return false;" href="javascript:fGoto();">' + Lang.Mail.Write.accoutDetail + '</a></li></ul>';
            html[html.length] = '</div>';
        } else {
            html[html.length] = '<div class="listHeader" id="' + gConst.listHeaderId + o + '">';
            html[html.length] = strTitle;
        }
        html[html.length] = '</div>'; //end listHeader
        //if( MM[o].toolbarPosition && MM[o].toolbarPosition == gConst.toolBarPosition.afterTitle ){
        html[html.length] = '<div id="' + gConst.mainToolbar + o + '">';
        html[html.length] = '</div>';//end tool bar
        //}
        html[html.length] = '<div class="mailList list">';

        html[html.length] = '<table cellpadding="0" id="' + gConst.listTitleId + o + '"><thead><tr>';

        html[html.length] = '<th class="check" id="secondSearchMenu_' + o + '"><input id="' + gConst.listCheckBoxId + o + '_all"  name="checkbox_' + o + '_all" onClick="MM[\'' + o + '\'].click(\'all\',this.checked)" type="checkbox" value=""/>';
        //if(!(p1.isSearch&&GE.isSecondSearch==false)){
        //    html[html.length] = '<i onclick="MM[\'' + o + '\'].getSecondSearch();"></i>';
        //}
        html[html.length] = '</th>';
        html[html.length] = '<th class="icons">&nbsp;</th>';
        html[html.length] = '<th class="from" onClick="MM[\'' + o + '\'].rankList(\'' + GE.list.orderField[from.sort] + '\')" ><a href="javascript:fGoto();" title="' + Lang.Mail.list_ClickSort + '" ><em style=" width:27px; display:inline-block;"></em>' + from.title + '</a>' + sortArr[from.sort] + '</th>';
        html[html.length] = '<th class="subject"  onClick="MM[\'' + o + '\'].rankList(\'subject\')"><a href="javascript:fGoto();" title="' + Lang.Mail.list_ClickSort + '" ><em style=" width:15px; display:inline-block;"></em>' + Lang.Mail.list_Subject + '</a>' + sortArr[4] + '</th>';
        //html[html.length] = '<th class="mailAttch">&nbsp;</th>';
        html[html.length] = '<th class="date"  onClick="MM[\'' + o + '\'].rankList(\'' + GE.list.order + '\')"><a href="javascript:fGoto();" title="' + Lang.Mail.list_ClickSort + '"><em style=" width:15px; display:inline-block;"></em>';
        if (p1.fid !== 7) {
            html[html.length] = Lang.Mail.list_Date;
        } else {
            html[html.length] = Lang.Mail.fax.ddate; //"删除日期";
        }
        html[html.length] = '</a>' + sortArr[0] + '</th>';
        html[html.length] = '<th class="size" onClick="MM[\'' + o + '\'].rankList(\'size\')"><a href="javascript:fGoto();" title="' + Lang.Mail.list_ClickSort + '" ><em style=" width:15px; display:inline-block;"></em>' + Lang.Mail.list_Size + '</a>' + sortArr[3] + '</th>';
        html[html.length] = TaskMail.getListThHtml();
        html[html.length] = '<th class="scroll"></th>';
        html[html.length] = '</tr></thead></table>';

        if (CC.power.offRestoreDeleted() && p1.fid === 7) {
            html.push("<div style=\"margin: 0px;text-indent: 5px;\" class=\"set-tips\">"+Lang.Mail.fax.remailTip+"</div>"); //只可以恢复最近3天彻底删除的邮件
        }

        html[html.length] = '<div class="listBody p_relative" id="' + gConst.listBodyId + o + '">';
        html[html.length] = p1.getListData();
        //html[html.length] = '<div class="listFooter">';
        //html[html.length] = '<div class="pager" id="'+gConst.listFootPageId+o+'">'+p1.getPage()+'</div>';
        //html[html.length] = '</div>';	//end listFooter
        html[html.length] = '</div>'; //end listBody
        html[html.length] = '<div id="footpage" style="height:40px; position:relative; border-top:1px solid #e2e2e2;">'+p1.getfooterPage()+'</div>';
        
        
        html[html.length] = '</div>'; //end mailList
        html[html.length] = '</div>'; //end main
        html[html.length] = p1.getReadMailHtml();
        GE.isFullSearch = 0;//还原默认值。用来判断当前的结果是否是全文检索的
        return html.join("");
    },
    checkObjLen: function (obj) {
        var i = 0;
        for (var item in GE.searchFlag) {
            if (obj.hasOwnProperty(item)) {
                i++;
            }
        }
        return i;
    },

    /**
     * 判断是否是代收邮件夹
     */
    isPopFolder: function (fid) {
        var folders = CM.folderMain[gConst.dataName],
            len = folders.length,
            i = 0,
            str = "";

        for (; i < len; i++) {
            if (folders[i].fid === fid && folders[i].type === 6) {
                str = this.getPopBtnHtml(folders[i].popMailId, fid);
                break;
            }
        }
        return str;
    },

    /**
     * 获取POP三个按钮的HTML
     */
    getPopBtnHtml: function (id, fid) {
	 
        return '<p style="margin-left: 30px"><a href="javascript:;" onclick=CC.compose("","","","","'+this.text.encodeHTML()+'")>写信</a> | <a href="javascript:;" onclick="mailPOP.syncPOP(' + id + ', false, true, ' + fid + ');">' + Lang.Mail.ConfigJs.receiveMail + '</a> | <a href=\"javascript:;\" onclick="CC.setConfig(\'mailPOP\', true);mailPOP.showAdd(' + id + ');mailPOP.setHeight();">' + Lang.Mail.ConfigJs.modSetting + '</a> | <a href=\"javascript:;\" onclick=\"CC.goLogLink(\'' + Lang.Mail.ConfigJs.LogQuery + '\', \'agent\');\">' + Lang.Mail.ConfigJs.viewColltectionRecord + '</a></p><p style="float:right;margin-right: 30px"><a href="javascript:;" onclick=javascript:jQuery("#-6").find(".action").click()>添加</a> |<a href="javascript:;" onclick=javascript:jQuery("#-6").find(".manage").click()>管理代收邮箱</a> </p>'
    },

    /*
     *获取工具条右侧部分
     */
    getToolbarRightPart: function () {
        var p1 = this;
        var o = p1.name;
        var domNode = El.createElement('div', gConst.listTopPageId + o, 'pager');
        var datePicker = p1.getDatePicker();
        var html = "";

        if ((GE.folderMap && ( GE.folderMap[gConst.folderEnum.audit] || GE.folderMap[gConst.folderEnum.monitor])) && (o == 'sys' + gConst.folderEnum.monitor || o == 'sys' + gConst.folderEnum.audit)) {
            html += datePicker + p1.getPage();
        } else {
            html += p1.getPage();
        }
        domNode.innerHTML = html;
        return domNode;
    },
    /***
     * 得到邮件内容HTML
     */
    getReadMailHtml: function () {
        var p1 = this;
        var o = p1.name;
        var html = [];
        var id = gConst.listReadMailId;
        var dragId = id + 'Drag_' + o;
        var defaultId = id + 'Default_' + o;
        var tbId = id + 'Toolbar_' + o;
        var frmId = id + 'Ifrm_' + o;
        var iconId = id + 'Icon_' + o;
        var titleId = id + 'Title_' + o;
        var contentId = id + 'Content_' + o;

        html.push('<div class="readInbox" id="' + id + o + '" style="bottom:0px;right:0px">');
        html.push('<div class="border" style="Z-Index:1000;" id="' + dragId + '" title="' + Lang.Mail.list_DragSize + '"><i></i></div>');
        html.push('<div class="selectResult" id="' + defaultId + '"><h2>' + Lang.Mail.list_NoSelectMail + '</h2><p>' + Lang.Mail.list_ClickReadMail + '</p></div>');
        html.push('<div class="riWrapper" id="' + contentId + '"><div class="riHeader" id="' + tbId + '"><h1><i id="' + iconId + '" class="off" onclick="MM[\'' + o + '\'].optReadMail(\'setTitle\',this);"></i><p id="' + titleId + '"></p></h1>');
        html.push('<div class="btnRIWrapper">');
        if (GC.check("MAIL_READ_REPLY")) {
            html.push('<div class="btnReadInbox"><p onclick="MM[\'' + o + '\'].optReadMailMenu(\'rm_rpl\');">' + Lang.Mail.tb_Reply + '</p><i class="menuSwitch" onclick="MM[\'' + o + '\'].optReadMailMenu(\'replymenu\');"></i></div>');
        }
        if (GC.check("MAIL_INBOX_FORWARD")) {
            html.push('<div class="btnReadInbox"><p onclick="MM[\'' + o + '\'].optReadMailMenu(\'rm_fwd\');">' + Lang.Mail.tb_Forward + '</p></div>');
        }
        if (GC.check("MAIL_INBOX_REFUSE")) {
            html.push('<div class="btnReadInbox"><p onclick="MM[\'' + o + '\'].optReadMailMenu(\'rm_blacklist\');">' + Lang.Mail.tb_Refuse + '</p><i class="menuSwitch" onclick="MM[\'' + o + '\'].optReadMailMenu(\'refusemenu\');"></i></div>');
        }
        html.push('</div><a class="action" href="javascript:fGoto();" title="' + Lang.Mail.list_ClickOpenLable + '" id="' + id + 'newLabel_' + o + '">' + Lang.Mail.list_NewLable + '</a></div>');

        //邮件头显示区
        html.push("<div id=\"pageReadMail" + o + "\"></div>");
        html.push('</div>');
        return html.join("");
    },
    getReadMailToolbarMenu: function (af) {
        var p1 = this;
        var ak = [];
        /*
         *
         * var menuFilter = {
         isShow:1,
         name:"MAIL_INBOX_MAILFILTER",
         text:Lang.Mail.tb_MailFilter,
         attrs:"className=setFiltration",
         url: function(){
         CC.setConfig("filter");
         },
         children:[menus["MAIL_CONFIG_FILTER"],menus["MAIL_CONFIG_BLACK"],menus["MAIL_CONFIG_WHITE"]]
         };
         */
        switch (af) {
            case "reply":
                //if (GC.check("MAIL_READ_REPLY_ONE")) {
                ak.push({
                    isShow: true,
                    name: "MAIL_READ_REPLY_ONE",
                    text: Lang.Mail.tb_ReplySend,
                    attrs: "isBold=true",
                    url: function () {
                        p1.optReadMailMenu("rm_rpl");
                    },
                    children: []
                });
                //}
                //if (GC.check("MAIL_READ_REPLY_ALL")) {
                ak.push({
                    isShow: true,
                    name: "MAIL_READ_REPLY_ALL",
                    text: Lang.Mail.tb_ReplyAll,
                    attrs: "",
                    url: function () {
                        p1.optReadMailMenu("rm_rpl");
                    },
                    children: []
                });
                //}
                ///ak[ak.length] = [Lang.Mail.tb_ReplySend, function(){
                //	p1.optReadMailMenu("rm_rpl");
                //},true];
                //ak[ak.length] = [Lang.Mail.tb_ReplyAll, function(){
                //	p1.optReadMailMenu("rm_rpla");
                //}];
                break;
            case "refuse":
                //if (GC.check("MAIL_INBOX_REFUSE_BLACKLIST")) {
                ak.push({
                    isShow: true,
                    name: "MAIL_INBOX_REFUSE_BLACKLIST",
                    text: Lang.Mail.tb_RefuseSend,
                    attrs: "isBold=true",
                    url: function () {
                        p1.optReadMailMenu("rm_blacklist");
                    },
                    children: []
                });
                //}
                //定义“筛选” 的属性，是否有子菜单
                //if (GC.check("MAIL_INBOX_REFUSE_FILTER")) {
                ak.push({
                    isShow: true,
                    name: "MAIL_INBOX_REFUSE_FILTER",
                    text: Lang.Mail.tb_AddFilter,
                    attrs: "",
                    url: function () {
                        p1.optReadMailMenu("rm_filter");
                    },
                    children: []
                });
                //}
                /*
                 ak[ak.length] = [Lang.Mail.tb_RefuseSend, function(){
                 p1.optReadMailMenu("rm_blacklist");
                 },true];
                 ak[ak.length] = [Lang.Mail.tb_AddFilter, function(){
                 p1.optReadMailMenu("rm_filter");
                 }];*/
                break;
            default:
                break;
        }
        return ak;
    },
    init: function () {
        var p1 = this;
        var o = p1.name;

        p1.listBodyDiv = $(gConst.listBodyId + o);
        p1.listReadMailDiv = $(gConst.listReadMailId + o);
        p1.checkBoxAll = $('checkbox_' + o + '_all');
        //if(GC.check("MAIL_INBOX_MOVE"))
        //{
        p1.initDragEvent();
        //}

        //初始化邮件分栏阅读参数
        var tNewLableReadMail = CC.getReadMode();
        if (tNewLableReadMail == "" || tNewLableReadMail == null) {
            tNewLableReadMail = 0;
        }
        p1.readMailType = tNewLableReadMail;
        p1.setReadMailStyle(p1.readMailType, true);
        //处理拖动事件
        /* var rmsplitter = $(gConst.listReadMailId + "Drag_" + o);
         var sp = new Splitter(rmsplitter, function(dx){
         var h = dx[3] - (GE.pos()[1] + 2);
         p1.setDivHeight(h);
         }, "h", rmsplitter, 0); */
        //p1.refreshMenu(o);

        //标签邮件
        CC.isLabelMail() && CC.labelBind(p1.listBodyDiv);

        EV.addEvent(document, "click", function () {
            if (document.getElementById("divRemark")) {
                var divRemark = document.getElementById("divRemark");
                divRemark.parentNode.removeChild(divRemark);
            }
        }, false);

        p1.initEvents();
    },
    setDivHeight: function (h) {
        var p1 = this;
        var o = p1.name;
        var mailCount = 0;
        var newMailCount = 0;
        mailCount = p1.stats.messageCount;
        if (gMain.sessionMode == "1" && this.fid == 1) {
            mailCount = p1.sessionCount;
        }
        //mailCount =p1.stats.messageCount;
        newMailCount = p1.stats.unreadMessageCount;
        p1.pageCount = Math.ceil(mailCount / p1.limit);
        
        var iPageCount = p1.pageCount;
        setHeight(h,iPageCount);

        function setHeight(h,iPageCount) {
            try {
                //得到邮件列表页面总高度(不带工具条)
                var gh = GMC.getMainHeight(o);
                if (typeof(h) == "number" && $(gConst.divToolbar + o)) {
                    h -= $(gConst.divToolbar + o).offsetHeight;
                }
                if (gh < 120) {
                    gh = 120;
                }
                var mh = gh;
                var rh = 0;
                var readmailHead = 0;
                if (p1.readMailType == 1) {
                    if (typeof(h) == "number") {
                        mh = h;
                        rh = gh - mh;
                    }
                    else {
                        mh = gh * 0.5;
                        rh = gh * 0.5;
                    }
                    if (rh < 120) {
                        rh = 120;
                        mh = gh - rh;
                    }
                    if (mh < 120) {
                        mh = 120;
                        rh = gh - mh;
                    }
                    var rhb = rh - $(gConst.listReadMailId + "Toolbar_" + o).offsetHeight - $(gConst.listReadMailId + "Drag_" + o).offsetHeight;
                    var readmailHeadObj = $("readHeader_" + o);
                    readmailHead = readmailHeadObj ? readmailHeadObj.offsetHeight : 0;
                }
                var readIframHead = rhb - readmailHead;
                var bodyH = mh - $(gConst.listHeaderId + o).offsetHeight - $(gConst.listTitleId + o).offsetHeight;

                El.setStyle($(gConst.listMailId + o), {
                    "height": mh + "px"
                });
                if (p1.listBodyDiv) {
                    if(iPageCount > 1){
                        if(bodyH<122){bodyH=122;}
                        El.setStyle(p1.listBodyDiv, {
                            "height": bodyH-40 + "px"
                        });
                    }else{
                        El.setStyle(p1.listBodyDiv, {
                            "height": bodyH + "px"
                        });
                    };
                }
                if (p1.readMailType == 1) {
                    El.setStyle(p1.listReadMailDiv, {
                        "height": rh + "px"
                    });
                    El.height($(gConst.ifrmReadmail + o), readIframHead);
                }
                else {
                    p1.listReadMailDiv.style.display = "none";
                }
            }
            catch (e1) {
            }
        }
    },

    initPeriod: function () {
        var p1 = this;
        var gx = p1.period;
        var Apo = p1.week;
        var kb = new Date();
        var bz = new Date(kb.getFullYear(), kb.getMonth(), kb.getDate() + 1);
        var af = "";
        var iw, oEnd;
        gx["-1"] = {
            name: Lang.Mail.tb_Top,
            start: null,
            end: null
        };
        for (var i = 0, m = kb.getDay(); i <= m; i++) {
            if (i == 0) {
                af = Lang.Mail.date_Today;
            }
            else if (i == 1) {
                af = Lang.Mail.date_Yesterday;
            }
            else {
                af = Lang.Mail.date_Week + Apo[m - i];
            }
            gx[gx.length] = {
                name: af,
                start: bz.dateAdd(-(i + 1)),
                end: bz.dateAdd(-i)
            };
            //bz = bz.dateAdd(-1);
            //if (i > 0) {
            //    break;
            //}
        }
        iw = new Date(-10000, 0, 1);
        //oEnd = (new Date(bz));
        gx[gx.length] = {
            name: Lang.Mail.date_LongAgo,
            start: iw,
            end: bz
        };
        if (gx[0].name == Lang.Mail.date_Today) {
            gx[0].end = new Date(10000, 0, 1);
        }
    },
    getPeriodIndex: function (dt, index) {
        var p1 = this;
        //var dt = Util.parseDate(bk, "yyyy.mm.dd HH:nn");
        var gx = p1.period;
        if (!index) {
            for (var i = 0, m = gx.length; i < m; i++) {
                var v = gx[i];
                if (dt >= v.start && dt <= v.end) {
                    return i;
                }
            }
        }
        else {
            return index;
        }
        return -99;
    },

    /***
     * 得到邮件列表数据
     */
    getListData: function () {
        var p1 = this;
        var o = p1.name;
        var listData = CM[o]["var"] || [];
        var table = null;
        var tableType = -99;
        var nTmp = -99;
        var htmlData = [];
        var tEnd = "";
        GE.topNum = 0;
        if ((p1.order == GE.list.order) && p1.period.length == 0) {
            p1.initPeriod();
        }
        var page = p1.getPage();
        var footpage = p1.getfooterPage();
        var datePicker = p1.getDatePicker();
        var oTopPage = $(gConst.listTopPageId + o);
        var oFootPage = jQuery("#footpage")[0];
        var oCheckAll = $(gConst.listCheckBoxId + o + '_all');

        //加载日期图标 和 分页按钮
        if (oTopPage) {

            if ((GE.folderMap && ( GE.folderMap[gConst.folderEnum.audit] || GE.folderMap[gConst.folderEnum.monitor])) && (p1.name == 'sys' + gConst.folderEnum.monitor || p1.name == 'sys' + gConst.folderEnum.audit)) {
                oTopPage.innerHTML = datePicker + page;
            } else {
                oTopPage.innerHTML = page;
                oFootPage.innerHTML = footpage;
            }
        }
        /*
         else{
         if(true || (CC.isAudit() || CC.isMonitor())&&(p1.name == 'sys13' || p1.name == 'sys14')){
         oTopPage.innerHTML = datePicker + page;
         }
         }
         */
        p1.getDatePick();
        if (oCheckAll) {
            oCheckAll.checked = false;
        }
        if (!listData || listData.length == 0) {

            /*
             if (p1.start > 1) {
             p1.start = ((p1.pageCurrent - 1) * p1.limit) + 1;
             var searchData = {
             func: p1.isFilter ? gConst.func.searchMail : p1.func,
             data: p1.getListRequest(),
             call: function(ao){
             p1.freshData(ao, false);
             },
             msg: Lang.Mail.search_NowSearch
             };
             if (p1.isFilter)
             MM.mailRequest(searchData);
             else
             MM.mailRequestApi(searchData);

             return "";
             }
             */
            var retStr, taskTypeStr, imageUrl;
            if (p1.text === "待办邮件") {
                imageUrl = CC.getResourceAbsoluteURL() + "/images/undomission_default.jpg";
                if (Folder.taskType === 1) {
                    taskTypeStr = "待办邮件";
                } else {
                    taskTypeStr = "已完成";
                }
                retStr = '<div class="undo_default">';
                retStr += '<h2>您暂时没有"' + taskTypeStr + '"邮件</h2>';
                retStr += '<p>您可以将您的待办任务邮件设为' + taskTypeStr + '。</p>';
                retStr += '<img src="' + imageUrl + '">';
                retStr += '</div>';
                return retStr;
            } else if (p1.isFilter === "已加星标") {
                imageUrl = CC.getResourceAbsoluteURL() + "/images/StarIntro.gif";
                retStr = '<div class="undo_default">';
                retStr += '<h2>您暂时没有"星标"邮件</h2>';
                retStr += '<p>您可以在邮件列表中将邮件设为星标，方便查找重要邮件。</p>';
                retStr += '<img src="' + imageUrl + '">';
                retStr += '</div>';
                return retStr;
            }
            retStr = '<p class="set_rule_box_tips" style="display:block">' + Lang.Mail.list_NoMail + '</p>';
            if (p1.isSearch && !p1.isLoadNoReadMail)
                retStr = '<p class="set_rule_box_tips" style="display:block">' + Lang.Mail.NotSearchData + '</p>';
            return retStr;
        }

        try {
            if (p1.isSearch && GE.searchKey) {
                htmlData.push(p1.getCloseInBarHtml(p1.stats));
            }
            for (var i = 0, m = listData.length; i < m; i++) {
                var om = listData[i];
                var flags = om.flags || {};
                var date = om[GE.list.order];
                date = new Date(date * 1000);
                var index = (flags.top) ? "-1" : null;
                if (p1.order == GE.list.order) {
                    if (table && (nTmp != tableType)) {
                        htmlData[htmlData.length] = p1.getTable(tableType, true);
                    }
                    tableType = p1.getPeriodIndex(date, index);
                    if (nTmp != tableType) {
                        table = p1.getTable(tableType);
                        nTmp = tableType;
                        htmlData[htmlData.length] = table;
                    }
                }
                else {
                    if (!table) {
                        table = p1.getTable();
                        htmlData[htmlData.length] = table;
                    }
                }
                htmlData[htmlData.length] = p1.getSingleHtml(listData[i], i, tableType);
                //if(p1.isSearch){
                //    searchMids.push(listData[i].id);
                //}
                if (listData[i].flags.top) {

                    GE.topNum++;

                    GE.topMids.push(listData[i].mid);
                }
            }
            if (p1.order == GE.list.order) {
                htmlData[htmlData.length] = p1.getTable(tableType, true);
            }
            else {
                htmlData[htmlData.length] = p1.getTable("", true);
            }
            //htmlData[htmlData.length] = '<div class="listFooter">';
            // htmlData[htmlData.length] = '<div class="pager" id="' + gConst.listFootPageId + o + '">' + page + '</div>';
            // htmlData[htmlData.length] = '</div>'; //end listFooter
        }
        catch (exp) {
        }
        return htmlData.join("");
    },

    /***
     * 设置查询页码(如果当前最后一页，邮件被全部移除则返回上一页的start)
     * @param {Object} delCount 被删除个数
     */
    setPageStart: function (delCount) {
        var p1 = this;
        var data = CM[p1.name]["var"];
        if (p1.pageCurrent == (p1.pageCount - 1) && p1.pageCurrent > 0)
            if (data && data.length > 0)
                if (data.length - delCount == 0)
                    p1.start = ((p1.pageCurrent - 1) * p1.limit) + 1;
    },

    getTable: function (gw, isEnd) {
        var p1 = this;
        var o = p1.name;
        var isOrderdt = (p1.order == GE.list.order);
        var tableId = "";
        var ret = '';
        if (!isEnd) {
            if (isOrderdt) {
                tableId = 'period_table_' + o + gw;
                ret = '<table cellpadding="0" id="' + tableId + '"><caption onclick="MM[\'' + o + '\'].controlPeriod(this)" ><i></i>' + p1.period[gw].name + '</caption><tbody>';
                p1.currentPeriod = gw;
            }
            else {
                tableId = p1.order + '_table_' + o;
                ret = '<table cellpadding="0" id="' + tableId + '"><tbody>';
            }
        }
        else {
            ret = '</tbody><tfoot><tr><td colspan="6"></td></tr></tfoot></table>';
        }
        return ret;
    },
    getSecondSearch: function () {
        var p1 = this;
        var prefObj = GE.secondSearch;
        var o = (p1.isSearch) ? prefObj.name : p1.name;
        var fid = (p1.isSearch) ? prefObj.fid : p1.fid;
        var objMenu = {
            id: "folderSecondSearch" + o,
            name: "folderSecondSearch" + o,
            div: $('secondSearchMenu_' + o)
        };
        var objSubMenu = [];
        var menu = [
            {
                name: Lang.Mail.Write.FilterAll,
                val: ""
            },
            {
                name: Lang.Menu.Web.mail_inbox_mark_unread,
                val: {
                    read: 1
                }
            },
            {
                name: Lang.Mail.Write.hasAttach,
                val: {
                    attached: 1
                }
            },
            {
                name: Lang.Mail.Write.replyed,
                val: {
                    replied: 1
                }
            },
            {
                name: Lang.Mail.Write.forworded,
                val: {
                    forwarded: 1
                }
            }
        ];
        for (var i = 0; i < menu.length; i++) {
            var m = menu[i];
            if (m.val) {
                objSubMenu.push([m.name, function () {
                    prefObj.fid = fid;
                    prefObj.name = o;
                    GE.isSecondSearch = true;
                    CC.searchMailByFlag(fid, m.val);
                }
                ]);
            }
            else {
                objSubMenu.push([m.name, function () {
                    GE.isSecondSearch = false;
                    CC.goFolder(fid, o);
                }
                ]);
            }
        }
        CC.getMenu(objMenu, objSubMenu);
    },

    //得到读邮件列表每一行的html(tr);
    getSingleHtml: function (ao, i, gw) {
        var p1 = this;
        var o = p1.name;
        var html = [];
        var fid = ao.fid;
        var from = ao.from;
        if (fid == GE.folder.draft || fid == GE.folder.sent) {
            from = ao.from.trim();
            if (from.right(1) == ';') {
                from = from.left(from.length - 1);
            }
        }
        //var tipSub = CC.getMailTip(ao.subject);
        var subject = CC.getMailText(ao.subject, Lang.Mail.list_noSubject);
        var tipSub = subject;


        var date = new Date(ao.receiveDate * 1000);
        //var strDate = date.format("yyyy-mm-dd");
        var size = ao.size;
        size = Util.formatSize(size, null, 1);
        var flags = ao.flags || {};
        var mid = ao.mid;
        var mailSession = ao.mailSession;
        var mailNum = ao.mailNum || 0;
        var to = ao.to;
        var isMeeting = ao.meetingFlag || false;
        if (to.length > 0 && to.substr(to.length - 1) == ";") {
            to = to.substring(0, to.length - 1);
        }
        to = CC.getMailText(to, Lang.Mail.list_nosender);
        from = CC.getMailText(from, Lang.Mail.list_nosender);
        var strMailNum = "";
        var isSession = false;
        //if (CC.isSessionModeReadMail(p1.fid) && mailNum > 1) {
        if (gMain.sessionMode == "1" && p1.fid == 1 && mailNum > 1) {
            strMailNum = "<span class='mailList_sessionCount'>" + mailNum + "</span>";
            isSession = true;
        }


        html[html.length] = '<tr data-mid="' + ao.mid + '" id="tr_' + o + '_' + i + '" onmouseover="MM[\'' + o + '\'].trMouseOver(this);" onmouseout="MM[\'' + o + '\'].trMouseOut(this);"  style="cursor:pointer"';
        if (flags.read) {
            html[html.length] = ' class="new"';
        }
        html[html.length] = '>';
        html[html.length] = '<td class="check">';
        html[html.length] = '<input title="' + Lang.Mail.list_SelectOrNo + '" type="checkbox" onclick=MM[\'' + o + '\'].selectMail(this,"tr_' + o + '_' + i + '"); ';
        html[html.length] = ' value="' + mid;
        html[html.length] = '" name="' + gConst.checkBoxName + '" id="checkbox_' + o + '_' + i + '"';
        html[html.length] = ' sessionId="' + mailSession + '"  />';
        html[html.length] = '</td>';
        html[html.length] = '<td class="icons">';
        html[html.length] = p1.getIcons(ao);
        html[html.length] = '</td>';
        html[html.length] = '<td class="from">';
        if (p1.fid == GE.folder.sent) {
            html[html.length] = '<span class="sendStatus">' + p1.getSendStatus(ao.rcptFlag, ao) + '</span>';
        }
        else {
            html[html.length] = '<span class="status folderList_status">' + p1.getStatus(flags, ao) + '</span>';
        }
        var sender = from;
        if (this.fid == 2 || this.fid == 3) {
            sender = to;
        }
        var sender_name = Email.getName ? Email.getName(sender.decodeHTML()) : sender;
        sender_name = sender_name ? sender_name.encodeHTML() : Lang.Mail.list_nosender;
        html[html.length] = '<a href="javascript:fGoto();return false;" class="mailList_sender" onclick="MM[\'' + o + '\'].gotoRead(' + i + ',' + isSession + ', ' + isMeeting + ');return false;" title="' + sender + '">' + sender_name + '</a></td>';
        html[html.length] = '<td class="subject"><div class="tagWp" style="position:relative">';

        //<!-- 邮件标签 -- >
        if (CC.isLabelMail()) {
            html[html.length] = '<div class="tag_div">';
            for (var k = 0, l = ao.label.length; k < l; k++) {
                var label = MM.getFolderObject(ao.label[k]);
                if (label) {
                    html[html.length] = '<a href="javascript:void(0);" data-lid="' + label.fid + '" data-mid="' + mid + '" class="' + gConst.labelColor[label.folderColor] + ' tag_squ ml_5"><span>';
                    html[html.length] = label.name;
                    html[html.length] = '</span><i></i></a>';
                }
            }
            html[html.length] = '</div>';
        }
        //<!-- 邮件标签 end -- >

        html[html.length] = '<div class="tagCon"  onclick="MM[\'' + o + '\'].gotoRead(' + i + ',' + isSession + ', ' + isMeeting + ');return false;">';
        var mail_summary = ao.summary.encodeHTML();

        if (p1.isSearch) {
            var fName = MM.getFolderObject(fid).name;
            var tSubject = CC.getMailText(ao.subject, Lang.Mail.list_noSubject);
            tipSub = tSubject.replace(gConst.searchBrightKeyLeft, "").replace(gConst.searchBrightKeyRight, "");
            subject = subject.replace(gConst.searchBrightKeyLeft, "<span style='background-color:Gold;padding-left:2px;padding-right:2px;'>").replace(gConst.searchBrightKeyRight, "</span>");
            if (!p1.isLoadNoReadMail)
                subject = "<span style='color:#999999;'>[" + fName + "]</span>" + subject;
            if (mail_summary)
                mail_summary = mail_summary.replace(gConst.searchBrightKeyLeft, "<span style='background-color:Gold;padding-left:2px;padding-right:2px;'>").replace(gConst.searchBrightKeyRight, "</span>");
        }
        html[html.length] = '<div class="tagText" id="tagText_' + mid + '">';


        if (flags.memoFlag) {
            html[html.length] = '<span class="qm_ico_remarkon" onmouseover="MM[\'' + o + '\'].showRemark(\'' + mid + '\',this)"></span>';
        }
        if (GC.check('MAIL_INBOX_SECURITY') && ao.securityLevel) {
            html[html.length] = '【' + parent.CC.getSecurityMailName(ao.securityLevel) + '】';
        }
        html[html.length] = '<a id="listsubject_' + o + '_' + i + '" href="javascript:fGoto();return false;"  title="' + tipSub + '"';
        if (ao.color) {
            try {
                if (gConst.subjectColor.length <= ao.color) {
                    ao.color = gConst.subjectColor.length - 1;
                }
                var subjectColor = CC.getSubjectColorObject(ao.color).value;
                html[html.length] = "style='color: " + subjectColor + ";'";
            } catch (e) {
            }
        }


        if(subject.length > 35 && !p1.isSearch ){
            html[html.length] = ">" + subject.substring(0,35) + '...';
        }else{
            html[html.length] = ">" + subject;
        }
        

        html.push(p1.getAutoDestroyHtml(ao)); // 添加自销毁邮件提示字符

        html.push(strMailNum);
        if (p1.isSearch && GE.isFullSearch && GE.isFullSearch == 1) {
            html[html.length] = "<span class='mailSummary_style' >  [" + Lang.Mail.Write.mailSummary + "] " + mail_summary + "</span>";
        }
        else {
            if (gMain.showSummary == "1" && mail_summary != "")
                html[html.length] = "<span class='mailSummary_style' >  [" + Lang.Mail.Write.mailSummary + "] " + mail_summary + "</span>";
        }
        html[html.length] = '</a></div></div></div></td>';

        var dateCount = Util.DateDiffMore(date, new Date(), "s");
        var changeDate = null;
        if (dateCount > 0 && dateCount < 60)
            changeDate = dateCount + Lang.Mail.Write.secbefore;
        else if (dateCount > 60 && dateCount < 3600)
            changeDate = parseInt(dateCount / 60) + Lang.Mail.Write.minuiteBefore;
        else if (dateCount > 3600 && dateCount < 3600 * 2)
            changeDate = Lang.Mail.Write.oneHourBefore;
        else {
            var date_year = date.getYear();
            var date_month = date.getMonth();
            var date_day = date.getDate();
            var newDate = new Date();
            if (newDate.getYear() == date_year && newDate.getMonth() == date_month && newDate.getDate() == date_day) {
                changeDate = Lang.Mail.Write.todyaMail + Util.formatDate(date, "HH:nn");
            }
            else if (newDate.getYear() == date_year) {
                changeDate = Util.formatDate(date, "mm-dd HH:nn");
            }
            else {
                changeDate = date.format("yyyy-mm-dd");
            }
        }

        html[html.length] = '<td class="date">' + changeDate + '</td>';
        html[html.length] = '<td class="size"><div style="float:left;">' + size + "</div>";


        html[html.length] = '</td>';
        ao.emailName = Email.getName(sender.decodeHTML());
        html.push(TaskMail.getListIconHtml(ao));
        html[html.length] = '</tr>';
        return html.join("");
    },
    /**
     * 获取自销毁html
     * @param {object} ao
     */
    getAutoDestroyHtml: function (ao) {
        var html = "",
            s,
            t;

        if (ao.flags.selfdestruct) {
            html += "<span style=\"color: red;\">";
            if (ao.keepDay === 0) {
                html += "【读完自销毁】";
            } else if (ao.keepDay > 0) {
                s = (ao.keepDay * 24 * 3600) + ao.receiveDate;
                t = new Date(s * 1000);
                html += "【" + t.getFullYear() + "年" + (t.getMonth() + 1) + "月" + t.getDate() + "号过期】";
            }
            html += "</span>";
        }

        return html;
    },
    /*
     *获取邮件所有标识
     * @param {object} ao
     */
    getIcons: function (ao) {
        var p1 = this;
        var html = [];
        var o = p1.name;
        var flags = ao.flags || {};
        var mid = ao.mid;

        html[html.length] = '<span class="priority">' + p1.getPriority(ao.priority) + '</span>';
        if (flags.starFlag) {
            html[html.length] = '<span><input type="button" id="aStarFlag_' + mid + '"  class="qm_ico_flagon" onclick="MM[\'' + o + '\'].fStarFlag(\'' + mid + '\',0);" title=\"' + Lang.Mail.haveStar + '\"></span>';
        }
        else {
            html[html.length] = '<span ><input type="button" id="aStarFlag_' + mid + '"  class="qm_ico_flagoff" onclick="MM[\'' + o + '\'].fStarFlag(\'' + mid + '\',1);" title=\"' + Lang.Mail.noStar + '\"></span>';
        }

 

        var attrhtml = p1.getAttach(ao.flags);
        if (attrhtml != "") {
            html[html.length] = '<span class="attach">' + attrhtml + '</span>';
        }

        return html.join('');
    },
    /***
     * 工具条 (根据menuData得到顶部工具按钮), 最终把这个排好序的menu返回给
     * toolbar.js中的Toolbar类 [这个类的形参 gettb ]
     * Toolbar类是在ModuleManager.js中被实例化的
     * @param {Object} o
     */
    getToolbar: function (o) {
        var ak = [];
        var name = this.name;
        var p1 = MM[o];
        var menu = [];//p1.menu;
        if (o.substr(0, 4) == 'user') {
            o = 'user';
        } else if (o.substr(0, 5) == 'label') {
            o = 'label';
        }
        var menuData = Folder.menuData[o] || Folder.menuData['default'];
        //if(!p1.isLoadNoReadMail && p1.isSearch)
        //delete menuData.MAIL_INBOX_DELETE;
        var vItem;
        //var visitMenu = CC.getMailMenu(gConst.menu.inbox);
        var folders = CC.getFolders();
        var mid = "", vItem = null;
        //var nm = Folder.menu[name] || Folder.menu[GE.folderObj.inbox];
        //var len = visitMenu.length-1;
        for (var k in menuData) {
            //iif(!p1.isLoadNoReadMail )
            //判断此按钮在域管理平台设置的权限是否已经开通
            if (!menu2AuthorityMap || (menu2AuthorityMap && !menu2AuthorityMap[k]) || (menu2AuthorityMap && menu2AuthorityMap[k] && GC.check(menu2AuthorityMap[k]))) {
                if (p1.fMenus[k]) {
                    p1.fMenus[k].sort = menuData[k].sort;
                    p1.fMenus[k].isShow = true;
                    menu.push(p1.fMenus[k]);
                }
                else if ((GE.folderMap && GE.folderMap[gConst.folderEnum.audit] && o == 'sys' + gConst.folderEnum.audit) || (GE.folderMap && GE.folderMap[gConst.folderEnum.monitor] && o == 'sys' + gConst.folderEnum.monitor)) {
                    //如果是审核邮件夹 或者 监控邮件夹，创建虚拟的节点
                    vItem = getVisualNode(k);
                    if (vItem) {
                        vItem.isShow = true;
                        vItem.sort = menuData[k].sort;

                        //把虚拟节点 vItem 增加到功能菜单menu，这样就可以在菜单栏显示出来了
                        menu.push(vItem);
                    }
                }
                else {
                    vItem = getVisualNode(k);
                    if (vItem) {
                        vItem.isShow = true;
                        vItem.sort = menuData[k].sort;
                        menu.push(vItem);
                    }
                }
            }
        }
        //
        function getVisualNode(nodeName) {
            var newNode = new Object();
            newNode.name = nodeName;
            newNode.children = [];
            switch (nodeName) {
                case 'MAIL_INBOX_FILTER':
                    newNode.id = '-1';
                    newNode.url = '';
                    newNode.text = Lang.Mail.ConfigJs.filter;
                    newNode.attrs = 'getsub=true';
                    break;
                case 'MAIL_INBOX_INFORM':
                    newNode.id = '-2';
                    newNode.url = 'menu';
                    newNode.text = Lang.Mail.ConfigJs.inform;
                    break;
                case 'MAIL_INBOX_NOTJUNK':
                    newNode.id = '-3';
                    newNode.url = '';
                    newNode.text = Lang.Mail.ConfigJs.notJunk;
                    break;
                case 'MAIL_INBOX_NOTVIRUS':
                    newNode.id = '-4';
                    newNode.url = "";
                    newNode.text = Lang.Mail.ConfigJs.notVirus;
                    break;
                case 'MAIL_INBOX_PASSAUDIT':
                    newNode.id = '-5';
                    newNode.url = 'menu';
                    newNode.text = Lang.Mail.Write.auditPass;
                    break;
                case 'MAIL_INBOX_NOTPASSAUDIT':
                    newNode.id = '-6';
                    newNode.url = 'menu';
                    newNode.text = Lang.Mail.Write.auditNotPass;
                    break;
                case 'MAIL_INBOX_DATEPICKER':
                    newNode.id = '-7';
                    newNode.url = 'menu';
                    newNode.text = Lang.Mail.Write.dateFilter;
                    break;
                default:
                    newNode = null;
                    break;
            }
            return newNode;
        }

        /*for(var im=len;im>=0;im--){
         mid = menu[im].name;
         menu[im].isShow = true;
         if(nm[mid]){
         menu[im].isShow = false;
         }else{
         menu[im].isShow = true;
         }
         switch(mid){
         case "MAIL_INBOX_SEARCH":
         menu[im].url = function(o,mid,ao){
         GE.lastFolder = o;
         GE.currentFolder = GE.folder.search;
         CC.goSearch();
         };
         break;
         case "MAIL_INBOX_REFRESH":
         menu[im].url = function(){
         p1.refresh();
         };
         break;
         case "MAIL_INBOX_LAYOUT":
         menu[im].url = function(){
         p1.setReadMailStyle(0);
         };
         break;
         }
         if(mid=="MAIL_INBOX_DELETE"){
         if(p1.isSearch){
         var tempMenu1 = menu[im].children[1];
         menu[im] = tempMenu1;
         }else{
         //menu.splice(im,1);
         }
         }
         }*/
        //p1.menu = menu.clone(true);
        return menu.sort(function (a, b) {
            return a.sort > b.sort
        });
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
    //ak作为一个结果返回给MM[0].getToolbarMenu,然后执行Toobar.js
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
            case 'MARK':
                //得到二级菜单对象
                ak = p1.getAllChildren('MARK');
                if (gMain.sessionMode == "1" && this.fid == 1) {
                    for (var i = 0; i < ak.length; i++) {
                        if (ak[i].name == "MAIL_INBOX_MARK_NOTOP" || ak[i].name == "MAIL_INBOX_MARK_TOP") {
                            ak.splice(i, 2);
                        }
                    }
                }
                break;
            case 'FILTER':
                ak = p1.getAllChildren('FILTER');
                break;
            case "LAYOUT":
                for (i = 0; i < cm.length; i++) {
                    cm[i].url = (function (type) {
                        return function () {
                            p1.setReadMailStyle(type);
                        };
                    })(i);
                    if (p1.readMailType == i) {
                        cm[i].attrs = Util.setAttrsValue(cm[i].attrs, "checked", "true");
                    }
                    else {
                        cm[i].attrs = Util.setAttrsValue(cm[i].attrs, "checked", "false");
                    }
                    ak.push(cm[i]);
                }
                break;
            case 'MORE' :
                ak = p1.getAllChildren('MORE');
                /*var menus = Folder.menuData[af];
                 for(var k in menus){
                 if(GC.check(k)){
                 if(Folder.fMenus[k]){
                 ak.push(Folder.fMenus[k]);
                 }
                 }
                 }*/
                break;
        }

        return ak;
    },

    getAllChildren: function (key) {
        var ak = [], p1 = this;
        //通过 Folder.menuData 的mark 得到 它下面的子菜单
        var children = Folder.menuData[key];
        var name = p1.name;

        if (children) {
            for (var k in children) {
                if (p1.fMenus[k]) {
                    //p1.fMenus[k] 从域管理平台设置项取得值
                    var mmenu = Object.extend({}, p1.fMenus[k]);
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
        //如果当前邮件夹是系统邮件夹，并且它的id为13，说明的是系统的监控邮件夹
        //筛选中添加“收信监控” 和 “发信监控” 的选项
        if (name == 'sys' + gConst.folderEnum.monitor && key == 'FILTER') {
            comNodeAttr.id = -101;
            comNodeAttr.text = Lang.Mail.Write.receiveMonitor;
            comNodeAttr.name = 'MAIL_INBOX_FILTER_MONITORRECEIVE';
            var vNode1 = this.createVisualNode(comNodeAttr);
            comNodeAttr.id = -102;
            comNodeAttr.text = Lang.Mail.Write.sendMonitor;
            comNodeAttr.name = 'MAIL_INBOX_FILTER_MONITORSEND';
            var vNode2 = this.createVisualNode(comNodeAttr);
            ak.push(vNode1);
            ak.push(vNode2);
        }

        //如果当前邮件夹是系统邮件夹，并且它的id为14，说明的是系统的审核邮件夹
        //筛选中添加“审核通过” 和 “审核未通过” 的选项
        if (name == 'sys' + gConst.folderEnum.audit && key == 'FILTER') {
            //筛选一级菜单：未审核
            comNodeAttr.id = -201;
            comNodeAttr.text = Lang.Mail.Write.unAudit;
            comNodeAttr.name = 'MAIL_INBOX_FILTER_UNAUDIT';
            comNodeAttr.url = '';
            comNodeAttr.children = [this.getVnode("all_audit"), this.getVnode("receive_audit"), this.getVnode("send_audit")];
            //comNodeAttr.attrs = 'sep = true';
            var vNode3 = this.createVisualNode(comNodeAttr);
            //筛选一级菜单：审核通过
            comNodeAttr.id = -202;
            comNodeAttr.text = Lang.Mail.Write.auditPass;
            comNodeAttr.name = 'MAIL_INBOX_FILTER_PASSAUDIT';
            comNodeAttr.children = [];
            comNodeAttr.url = 'menu';
            //comNodeAttr.attrs = '';
            var vNode4 = this.createVisualNode(comNodeAttr);
            //筛选一级菜单：审核不通过
            comNodeAttr.id = -203;
            comNodeAttr.text = Lang.Mail.Write.auditnoPass;
            comNodeAttr.name = 'MAIL_INBOX_FILTER_NOTPASSAUDIT';
            comNodeAttr.children = [];
            comNodeAttr.url = 'menu';
            //comNodeAttr.attrs = '';
            var vNode5 = this.createVisualNode(comNodeAttr);
            //加载到虚拟节点中
            ak.push(vNode3);
            ak.push(vNode4);
            ak.push(vNode5)
        }

        if (CC.isLabelMail() && key == 'MARK') {
            comNodeAttr.id = -201;
            comNodeAttr.text = Lang.Mail.label_MyLabel;
            comNodeAttr.name = 'MAIL_INBOX_MARK_LABEL';
            comNodeAttr.url = '';
            comNodeAttr.children = this.getVnode();
            var vNode3 = this.createVisualNode(comNodeAttr);
            ak.push(vNode3)
        }
        //最终传给 Toolbar.js 的 getsubmenu 属性
        return ak;
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
            case "all_audit":
                comNodeAttr.id = -301;
                comNodeAttr.text = Lang.Mail.Write.FilterAll;
                comNodeAttr.name = 'MAIL_INBOX_FILTER_ALLAUDIT';
                comNodeAttr.children = [];
                break;
            case "receive_audit":
                comNodeAttr.id = -302;
                comNodeAttr.text = Lang.Mail.Write.reMailAudit;
                comNodeAttr.name = 'MAIL_INBOX_FILTER_RECEIVEAUDIT';
                comNodeAttr.children = [];
                break;
            case "send_audit":
                comNodeAttr.id = -303;
                comNodeAttr.text = Lang.Mail.Write.sendMailAudit;
                comNodeAttr.name = 'MAIL_INBOX_FILTER_SENDAUDIT';
                comNodeAttr.children = [];
                break;
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
                    url: function (o, mid, ao) {
                        var mids = [];
                        p1.getSelectValue(mids, []);
                        MM['folderMain'].opt('addLabel', null, null, (mids.length > 0 ? {from: CC.getMailFromByID(o, mids[0]), mid: mids, o: o} : null));
                    },
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
            if (n != p1.fid && !(n === 2)) {
                if (!GC.check("MAIL_INBOX_DELETE") && n == 4) {

                }
                else {
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
            }

            if (hassub) {
                icon1 += (isCurEnd || aw.parentId == 0) ? "　" : "│ ";
                p1.getAllFolder(ak, aw.nodes, icon1);
            }
        }
    },

   

    /***
     * 读信，从邮件列表调到读信正文页入口
     * @param {Object} n
     * @param {Object} gw
     */
    gotoRead: function (n, isSession, isMeeting) {
        if (!GC.check("MAIL_INBOX_READ")) {
            CC.forbidden();
            return;
        }

        //
        GE.tab.isSession = false;

        var p1 = this;
        var o = p1.name;
        var iIndex = p1.getTrIndex(n);
        var oTr = $(gConst.listBodyId + o).getElementsByTagName("tr")[iIndex];
        try {
            p1.click("all", false);
        }
        catch (exp) {
        }

        var bz = CM[o][gConst.dataName][n];
        if (!bz) {
            return;
        }
        GE.lastFolder = o;
        var fid = bz.fid;
        var mid = bz.mid;

        var sessionId = bz.mailSession;
        var auditStatus = bz.auditStatus;
        p1.mid = mid;
        var markRead = bz.flags.read ? 1 : 0;
        var isTop = bz.flags.top ? 1 : 0;

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
        
        //是否未读
        var unread = (bz.flags && bz.flags.read == "1" ) ? true : false;
        var type = MM.getFolderObject(fid).type;

        var text = CC.getMailText(bz.subject, Lang.Mail.list_ReadingMail);
        var oIcon = oTr.childNodes[1].firstChild.firstChild;
        if (fid != GE.folder.draft) {
            if (markRead) {//是否新邮件
                
                if(!isEncrypt){
                El.removeClass(oTr, "new");
                }
                
                
                try {
				    //如果不是已发送 | 审核 | 加密 | 签名
					if(fid!=3 && auditStatus!=5 && auditStatus!=6 && !isEncrypt && !isSign && (bz.flags && !bz.flags.selfdestruct))
                        oTr.childNodes[2].firstChild.firstChild.className = (isTop ? "status9" : "status6");
                } catch (e) {
                }
				
               // bz.flags.read = 0;//置为已读
                
                // 刷新未读邮件数
                if (MM["folderMain"].folderInfo.unreadMessageCount > 0) {
                   
                    MM["folderMain"].folderInfo.unreadMessageCount--;
                    
                    // 更新messageInfo未读邮件数
                    if (messageInfo) {
                        var unReadCount = parseInt(messageInfo.unreadMessageCount) || 0;
                        unReadCount--;
                        //messageInfo.unreadMessageCount = unReadCount.toString();
                    }
                }

                /*if (p1.isSearch) {
                 //o = CC.getFolderTypeName(type) + fid;
                 if (MM[o].mailCount > 0) {
                 MM[o].mailCount--;
                 }
                 if(n==0)
                 {
                 if(MM[o].mailCount>0)
                 document.getElementById("leftMenu_newMailCount_sys0").innerHTML="<a title=\""+MM[o].mailCount+"封未读邮件\" class=\"leftFolder-mailNum\" style=\"display:inline;padding-left:5px;font-weight:bold\">("+MM[o].mailCount+")</a>";
                 else
                 document.getElementById("leftMenu_newMailCount_sys0").innerHTML="";

                 }
                 }
                 if(fid !=2 && fid !=3 && fid !=4 && fid !=5 )
                 {
                 try {
                 var count = document.getElementById("leftMenu_newMailCount_sys0").childNodes[0].innerHTML;
                 count = parseInt(count.substring(count.indexOf("(") + 1, count.indexOf(")"))) - 1;
                 if (count > 0)
                 document.getElementById("leftMenu_newMailCount_sys0").innerHTML = "<a title=\"" +Lang.Mail.unreadmailCount.format(count) + "\" class=\"leftFolder-mailNum\" style=\"display:inline;padding-left:5px;font-weight:bold\">(" + count + ")</a>";
                 else
                 document.getElementById("leftMenu_newMailCount_sys0").innerHTML = "";
                 }catch(e){}
                 }*/

                //if (o != "sys0" || p1.isLoadNoReadMail) {
                o = CC.getFolderTypeName(type) + fid;
                if (MM[o].stats.unreadMessageCount > 0) {
					     //如果不是加密邮件, 更新未读邮件数量
                        if(!isEncrypt){
                    MM[o].stats.unreadMessageCount--;
                }
                	}

                if (MM[o].mailCount > 0) {
                    MM[o].mailCount--;
                }

                if (CC.isLabelMail() && /^label/.test(p1.name)) {
                    MM["folderMain"].refreshFolders();
                }
                    
                    
                p1.refreshMenu(o);
                    
                   
                CC.syncMailData();
                CC.updateHome();
                //}

                // 刷新左侧邮件夹、代收邮件夹数量
                if(type==3){
                    var myMailFoderCount=jQuery("#-1 em").eq(0).html();
                    jQuery("#-1 em").eq(0).html(myMailFoderCount-1)

                }else if(type==6){
                    var myMailFoderCount=jQuery("#-6 em").eq(0).html();
                    jQuery("#-6 em").eq(0).html(myMailFoderCount-1);
                }
                if(bz.label[0]){
                    var myMailFoderCount=jQuery("#-2  em").eq(0).html();
                    jQuery("#-2 em").eq(0).html(myMailFoderCount-1);
                }
                
            }

            
            
            var orderInfo = {
                isSearch: p1.isSearch == true ? 1 : 0,
                fid: p1.fid,
                order: p1.order,
                desc: p1.desc,
                start: p1.start,
                total: p1.limit,
                offset: n
            };
            var readParam = {
                "markRead": markRead,
                fid: p1.isSearch ? 0 : p1.fid,
                //fid: p1.isSearch ? bz.fid : p1.fid,
                "sessionId": sessionId,
                rcptFlag: bz.rcptFlag,
                isSession: isSession || false,
                isEncrypt: isEncrypt,
                unread: unread,
                ignoreCache: true,
                returnHeaders: [ "X-IBC-SecMail"]
            };
            //如果是签名邮件
            if(isSign){
                readParam.isSign = isSign;
            }
            if (bz.flags && bz.flags.selfdestruct) {
                readParam.scope = p1;
                readParam.callback = p1.refresh;
            }
            if (this.isFilter != "") {
                readParam.fid = 0;
            }
            if (p1.readMailType == 1) {
                p1.optReadMail("readMail", null, mid, text, readParam, bz);
            }
            else {
                CC.goReadMail(mid, text, readParam, bz);
            }
        } else if (!isMeeting) {//写信页打开邮件(草稿)
            url = CC.getComposeUrl("&mid=" + mid + "&funcid=" + gConst.func.restore);
            text = (Lang.Mail.list_EditMail + text) || Lang.Mail.list_EditMail;
            CC.goCompose(url, "compose_" + mid, text);
        } else {
            url = CC.getMeetingUrl("&mid=" + mid + "&funcid=" + gConst.func.restore);
            text = (Lang.Mail.list_EditMail + text) || Lang.Mail.list_EditMail;
            CC.goOutLink(url, "meeting_" + mid, text);
        }
        return false;
    },

    getTrIndex: function (sId) {
        var p1 = this;
        var o = p1.name;
        try {
            var he = $(gConst.listBodyId + o).getElementsByTagName("tr");
            for (var i = 0; i < he.length; i++) {
                if (he[i].id == "tr_" + o + "_" + sId) {
                    return i;
                }
            }
            return -1;
        }
        catch (exp) {
            return sId - 0;
        }
    },
    getAttach: function (flag) {
        return (flag.attached) ? '<i class="status10" title="' + Lang.Mail.list_AttachMail + '"></i>' : '';
    },
    getPriority: function (priority) {
        return (priority == GE.priority.hight) ? '<i class="status7" style="width:12px" title="' + Lang.Mail.search_msg_hight + '"></i>' : '<i class="" style="width:12px"></i>'; //紧急
    },
    getSendStatus: function (flags, ao) {
        //alert(flags);
        var t = '';
        var flag = ao.flags || {};
        switch (flags) {
            case 0:
                t = "<i class='status1_3'  title='" + Lang.Mail.Write.Queue + "'></i>";
                break;
            case 1:
                t = "<i class='status1_1'  title='" + Lang.Mail.Write.sendSuccess + "'></i>";
                break;
            case 2:
                t = "<i class='status1_1' title='" + Lang.Mail.Write.sendSuccess + "'></i>";
                break;
            case 3:
                t = "<i class='status1_4'  title='" + Lang.Mail.Write.Partiallysuccessful + "'></i>";
                break;
            case 4:
                t = "<i class='status1_2'  title='" + Lang.Mail.Write.Failure + "'></i>";
                break;
        }

        if (flag.recall) {
            if (flag.hasOwnProperty('recallok')) {
                switch (flag.recallok.toString()) {
                    case "1":
                        t = "<i class='m18' title='召回成功'></i>"; // 召回成功
                        break;
                    case "2":
                        t = "<i class='m17' title='部分召回成功'></i>"; // 部分召回成功
                        break;
                    case "3":
                        t = "<i class='m16' title='召回失败'></i>"; //召回失败
                        break;
                }
            }
        }
        if (ao.flags.signed) {
            t = "<i class=\"m19\" title='敏感邮件'></i>";
        }
        return t;
    },
    /**
     * 得到邮件状态对应的样式, 显示为每一行中相应状态的图标[ 已读、已通过审核、已转发等 ]
     * @param {Object} flag 邮件状态对象
     * @param {Object} type 类型 1. 邮件是否有附件，2.邮件优先级，3. 其它属性
     */
    getStatus: function (flag, ao) {
        var listMailType = this.stateFlagArr;
        var as = ao.auditStatus;
        //普通，定时邮件，已回复已转发，已回复，已转发，新邮件，普通
        flag = flag || {};
        var t = "";
        if (+(ao.meetingFlag) === 1) {
            t = "<i class='i-meetiv' title='会议邀请'></i>";
        } else if (flag.signed === 1) {
            t = "<i class=\"m19\" title='敏感邮件'></i>";
        } else if (flag.selfdestruct) {
            t = "<i class='m21' title='自销毁邮件'></i>";
        } else if (flag.top) {
            t = "<i class='" + ((flag.read) ? "status8" : "status9") + "' title='" + listMailType[7] + "'></i>";
        }
        else if (flag.fixedtime) {
            t = "<i class='status1' title='" + listMailType[1] + "'></i>";
        }
        else if (flag.read && as != 5 && as != 6) {
            //新邮件
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
        }
        else {
			 
            t = "<i class='status6' title='" + listMailType[0] + "'></i>";
        }


        /**
         * 判断是否是安全邮箱, 是否是加密,签名邮件, 如果是则替换icon
         * ao.secureEncrypt 或者 ao.flags.secureEncrypt 为1 表示加密邮件
         * ao.secureSigned 或者 ao.flags.secureSigned   为1 表示签名邮件
         * 
         */
        
        
        if( CC.isSecurityMail() ){
            
            var iscrypt = ( typeof ao.secureEncrypt != 'undefined' ? ao.secureEncrypt : false) || ( ao.flags && ao.flags.safemail_crypt ) || ( ao.flags && ao.flags.secureEncrypt );
            var issign  = ( typeof ao.secureSigned != 'undefined' ? ao.secureSigned : false ) ||( ao.flags && ao.flags.safemail_sign ) || ( ao.flags && ao.flags.secureSigned );
            
            if( typeof ao !== "undefined" && iscrypt == "1" && issign == "1" ){
                 t = "<i class='i-redmedal' title='" + "加密签名邮件" + "'></i>";
            }else if( typeof ao !== "undefined" && iscrypt == "1"){
                 t = "<i class='i-ykey' title='" + "加密邮件" + "'></i>";
            }else if(typeof ao !== "undefined"  && issign == "1" ){
                 t = "<i class='i-graymedal' title='" + "签名邮件" + "'></i>";
            }else if(typeof ao !== "undefined"  && issign == -1 ){
                //签名不通过
                t = "<i class='i-mixmedal' title='" + "签名不通过邮件" + "'></i>";
            }else if( typeof ao !== "undefined"  && iscrypt == -1 ){
                //加密不通过
                t = "<i class='i-notPassed' title='" + "加密不通过邮件" + "'></i>";
            }
        }
        
        /**
         * //加密
		 <i class="i-ykey"></i>
		
		//签名+加密
		      <i class="i-redmedal"></i>
		
		//签名邮件 (已经通过)
		      <i class="i-graymedal"></i>
		
		//签名不通过邮件
		      <i class="i-mixmedal"></i>
		 
         */

		
		//如果是审核邮件, 修改成审核的图标
        if (GE.folderMap && GE.folderMap[gConst.folderEnum.audit]) {
			
            if (as == 5) {  //审核已通过加图标
                t = "<em class='i-examined' title='" + Lang.Mail.Write.hasaudited + "'></em>";
            }
            else if (as == 6) {  //审核未通过加图标
                t = "<em class='i-unexamine' title='" + Lang.Mail.Write.hasNotaudited + "'></em>";
            } else if (as == 3 || as == 4) {   //未审核的标志为"未读邮件" [ flag.read:1表示未读 ]
                if (flag.read) {
                    t = "<i class='status5' title='" + Lang.Mail.Write.unAudit + "'></i>";
                } else {
                    t = "<i class='status6' title='" + Lang.Mail.Write.unAudit + "'></i>";
                }

            }
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
         *
         */
    },
    getLabels: function (label, mid) {
        var aLabel = [];
        label = label || [];
        var html = [];
        var o = this.name;
        var fm = CM.folderMain[gConst.dataName];
        Util.each(fm, function (i, value) {
            if (label.has(value.fid)) {
                var color = value.folderColor;
                if (color > 0 || color > 34) {
                    color = 0;
                }
                var cc = gConst.labelColor[color];
                html.push('<div class="tagList" onmouseover="MM[\'' + o + '\'].labelMouseOver(this);" onmouseout="MM[\'' + o + '\'].labelMouseOut(this);">');
                html.push('<div class="tu c1"><div class="ru {3}"><span>{0}</span><a href="javascript:fGoto();" onclick="MM[\'{4}\'].marklabel(\'delete\',[\'{1}\'],{2});">X</a></div></div></div>'.format(value.name, mid, value.fid, cc, o));
            }
        });
        return html.join("");
    },
    refreshMenu: function (o) {
        try {
            var p1 = this;
            var fid = p1.fid;
            var so = o || p1.type + fid;
            var ot = $(gConst.listMailId + 'mailCount_' + so);
            var objLCount = $('leftMenu_newMailCount_' + so);
            var label;
            if (p1.isFilter && p1.filterStats)
                    p1.stats = p1.filterStats;
            var nm = MM[so].stats.unreadMessageCount;
            var m = MM[so].stats.messageCount;
            var html = "";
            var readAllBtn = /^(sys|user)[1-9]\d*$/.test(so) ? '  <a href="#" onclick="CC.setAllRead(\'' + so + '\')">全部标记为已读</a>' :"";
            if (p1.isSearch && GE.searchFlag && p1.checkObjLen(GE.searchFlag) === 1 && GE.searchFlag.read === 1) {
                html = Lang.Mail.list_searchMailNumber.format(Math.max(m, 0));
            }
            else {
                if (p1.type === "label") {
                    label = fid;
                }
                // html = '<span title="' + Lang.Mail.unreadmailCount_AllCount.format(nm,m) + '">'+nm+'/'+m+'</span>'
                html = Lang.Mail.maicountTitle.format(m) + '，<a href="#" onclick="CC.searchNewMail(' + fid + ',false, ' + label + ')">' + Lang.Mail.unreadMailTitle + '</a>' + Lang.Mail.countTitle.format(nm) + readAllBtn;
                var mailFileCount = (gMain.mailFileCount ? parseInt(gMain.mailFileCount) : 10000)
                if (fid == 1 && m >= mailFileCount) {
                    html += '，';
                    html += Lang.Mail.mailFileTitle.format("&nbsp;<a onclick=\"MM['sys1'].loadMailFileHtml()\" href='#'>" + Lang.Mail.mailFile + "</a>&nbsp;")
                }
            }

            var h1 = $(gConst.listMailId + "h1_" + so);
            if (h1 && p1.isSearch && p1.isLoadNoReadMail && GE.searchFlag && p1.checkObjLen(GE.searchFlag) === 1 && GE.searchFlag.read === 1) {
                h1.innerHTML = Lang.Mail.Write.unRead_mail;
            }
            /*
             else if (h1 && !p1.isFilter)
             {
             h1.innerHTML = p1.text.lefts(30);
             }
             */
            var h2 = $(gConst.listMailId + "span_" + so);
            if (h2 && !p1.isFilter) {
                h2.innerHTML = "";
            }
            var h3 = $(gConst.listMailId + "h2_" + so);
            if (h3 && !p1.isFilter) {
                h3.innerHTML = "";
            }

            if (ot) {
                if (p1.isFilter)
                    ot.innerHTML = '(' + Lang.Mail.list_FilterMailCount.format(Math.max(p1.filterStats.messageCount, 0)) + ')';
                else
                    ot.innerHTML = '(' + html + ')';
            }
            if (objLCount && o) {
                if (nm > 0) {
                    objLCount.innerHTML = '<a style="display:inline;padding-left:5px;font-weight:bold" class="leftFolder-mailNum" title=' + Lang.Mail.unreadmailCount_AllCount.format(nm, m) + '>(' + nm + ')</a>';
                }
                else {
                    objLCount.innerHTML = '';
                }
            }
            var nCount = MM["folderMain"].folderInfo.unreadMessageCount;
            CC.synData({
                newMailCount: nCount
            });
        }
        catch (e) {
            //ch("folder.refreshMenu", e);
        }
    },


    trMouseOver: function (up) {
        if (!checkIsOnMouseOver(up)) {
            return;
        }
        if (GE.Drag.moveType != "folder") {
            var sId = up.id;
            var Ady = $(sId.replace("tr", "checkbox"));
            if (!Ady.checked) {
                //El.addClass(up, "on");
                if (up.className != "checkColor" && up.className != "new checkColor") {
                    El.addClass(up, "overColor");
                }
            }
        }

        function checkIsOnMouseOver(ao, e) {
            try {
                e = e || EV.getEvent();
                var to = e.toElement || e.target;
                var from = e.fromElement || e.relatedTarget;
                if (El.descendantOf(to, ao) && !El.descendantOf(from, ao)) {
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (exp) {
                return true;
            }
        }

    },

    trMouseOut: function (up) {
        if (!checkIsOnMouseOut(up)) {
            return;
        }
        if (GE.Drag.moveType != "folder") {
            var sId = up.id;
            var objCb = $(sId.replace("tr", "checkbox"));
            if (!objCb.checked) {
                //El.removeClass(up, "on");
                El.removeClass(up, "overColor");
            }
            else {

            }
        }

        function checkIsOnMouseOut(ao, e) {
            try {
                e = e || EV.getEvent();
                var to = e.toElement || e.relatedTarget;
                var from = e.fromElement || e.target;
                if (!El.descendantOf(to, ao) && El.descendantOf(from, ao)) {
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (exp) {
                return true;
            }
        }
    },
    labelMouseOver: function (obj) {
        try {
            //if (obj && obj.className == "tagList") {
            var a = obj.childNodes[0].childNodes[0].childNodes[1];
            a.style.display = "INLINE";
            //}
        }
        catch (e) {

        }
    },
    labelMouseOut: function (obj) {
        try {
            //if (obj && obj.className == "tagList hover") {
            var a = obj.childNodes[0].childNodes[0].childNodes[1];
            a.style.display = "none";
            //obj.className = "tagList";
            //}
        }
        catch (e) {

        }
    },
    setTrClass: function (cb, isOn, isSelAll) {
        var p1 = this;
        var up = $(cb.id.replace("checkbox", "tr"));
        //El.removeClass(up, "on");
        El.removeClass(up, "overColor");
        if (isOn) {
            El.addClass(up, "checkColor");
        }
        else {
            El.removeClass(up, "checkColor");
            if (!isSelAll)
                El.addClass(up, "overColor");
        }
    },

    /**
     * 得到日期选择小图标的html
     */
    getDatePicker: function () {
        var p1 = this;
        var mailCount = 0;
        var newMailCount = 0;
        var iPageCount = p1.pageCount;
        var html = [];
        var o = p1.name;

        mailCount = p1.stats.messageCount;
        iPageCount = Math.ceil(mailCount / p1.limit);

        //如果有分页情况，要设置一个margin-right:200px
        /*
         if (iPageCount > 1) {
         html.push("<a style='margin-right:200px' onClick=\"p1.showDatePicker();return false;\">日期</a>");
         }else{
         html.push("<a style='margin-right:10px' onClick=\"p1.showDatePicker();return false;\">日期</a>");
         }
         */
        //onClick=\"MM[\'" + o + "\'].showDatePicker();return false;\"

        html.push("<span style='margin-right:10px;' id='datePicker' class='date'><input type=\"hidden\"/><a style=\"float:left;\" class=\"add-on date_picker\"></a></span>");

        return html.join("");

    },

    //翻页上面连接

    getPage: function () {
        var p1 = this;
        var o = p1.name;
        //var om = CM[o] || [];
        var mailCount = 0;
        var newMailCount = 0;
        mailCount = p1.stats.messageCount;
        if (gMain.sessionMode == "1" && this.fid == 1) {
            mailCount = p1.sessionCount;
        }
        //mailCount =p1.stats.messageCount;
        newMailCount = p1.stats.unreadMessageCount;
        p1.pageCount = Math.ceil(mailCount / p1.limit);
        p1.pageCurrent = parseInt(((p1.start - 1) / p1.limit), 10) || 0;

        var html = [];
        var iPageCount = p1.pageCount;
        var iPage = Math.max(p1.pageCurrent, 0);
        if (CC.power.offRestoreDeleted() && p1.fid === 4) {
            html.push("<a href=\"javascript:;\" onclick=\"CC.goFolder(7,'sys7')\" class=\"del_reback\" title=\"恢复彻底删除的邮件\"></a>");
        }
        if (iPageCount > 1) {
            html.push("<div class=\"pagediv\" id=\"toppagediv\">");
            html.push("<span class=\"pageNum pageNum-on\"><var>" + (iPage + 1) + "/" + iPageCount + "</var><i class=\"ptg\"></i></span>");
            if (iPage > 0) {
                html[html.length] = '<a class=\"page_forword\" href="javascript:;" onClick="MM[\'' + o + '\'].goPage(' + (iPage - 1) + ');return false;">' + Lang.Mail.list_PrevPage + '</a>';
            } else {
                html[html.length] = '<a class=\"page_forword disable\" href="javascript:;">' + Lang.Mail.list_PrevPage + '</a>';
            }
            if (iPageCount > iPage + 1) {
                html[html.length] = '<a class=\"page_next\" href="javascript:;" onClick="MM[\'' + o + '\'].goPage(' + (iPage + 1) + ');return false;">' + Lang.Mail.list_LastPage + '</a>';
            } else {
                html[html.length] = '<a class=\"page_next disable\" href="javascript:;">' + Lang.Mail.list_LastPage + '</a>';
            }
            html.push("<ul class=\"pageitem\" style=\"display: none;\">");
            for (var i = 0; i < iPageCount; i++) {
                html.push("<li><a href=\"javascript:;\" onclick=\"MM[\'" + o + "\'].goPage(" + i + ");return false;\">" + (i + 1) + ' / ' + iPageCount + "</a></li>");
            }
            html.push("</ul>");
            html.push("</div>");
        }
        return html.join("");
    },

    //翻页下面连接


    getfooterPage: function () {
        var p1 = this;
        var o = p1.name;
        //var om = CM[o] || [];
        var mailCount = 0;
        var newMailCount = 0;
        mailCount = p1.stats.messageCount;
        if (gMain.sessionMode == "1" && this.fid == 1) {
            mailCount = p1.sessionCount;
        }
        //mailCount =p1.stats.messageCount;
        newMailCount = p1.stats.unreadMessageCount;
        p1.pageCount = Math.ceil(mailCount / p1.limit);
        p1.pageCurrent = parseInt(((p1.start - 1) / p1.limit), 10) || 0;

        var html = [];
        var iPageCount = p1.pageCount;
        var iPage = Math.max(p1.pageCurrent, 0);
        if (CC.power.offRestoreDeleted() && p1.fid === 4) {
            html.push("<a href=\"javascript:;\" onclick=\"CC.goFolder(7,'sys7')\" class=\"del_reback\" title=\"恢复彻底删除的邮件\"></a>");
        }
        if (iPageCount > 1) {
            html.push("<div class=\"pagediv\" style=\"position:absolute; top:10px; right:15px;\">");
            html.push("<span class=\"pageNum pageNum-on\"><var>" + (iPage + 1) + "/" + iPageCount + "</var><i class=\"ptg\"></i></span>");
            if (iPage > 0) {
                html[html.length] = '<a class=\"page_forword\" href="javascript:;" onClick="MM[\'' + o + '\'].goPage(' + (iPage - 1) + ');return false;">' + Lang.Mail.list_PrevPage + '</a>';
            } else {
                html[html.length] = '<a class=\"page_forword disable\" href="javascript:;">' + Lang.Mail.list_PrevPage + '</a>';
            }
            if (iPageCount > iPage + 1) {
                html[html.length] = '<a class=\"page_next\" href="javascript:;" onClick="MM[\'' + o + '\'].goPage(' + (iPage + 1) + ');return false;">' + Lang.Mail.list_LastPage + '</a>';
            } else {
                html[html.length] = '<a class=\"page_next disable\" href="javascript:;">' + Lang.Mail.list_LastPage + '</a>';
            }
            html.push("<ul class=\"pageitem\" style=\"top:auto; bottom:23px;display: none;\">");
            for (var i = 0; i < iPageCount; i++) {
                html.push("<li><a href=\"javascript:;\" onclick=\"MM[\'" + o + "\'].goPage(" + i + ");return false;\">" + (i + 1) + ' / ' + iPageCount + "</a></li>");
            }
            html.push("</ul>");
            html.push("</div>");
        }
        return html.join("");
    },

    selectMail: function (obj, trid) {
        this.setTrClass($(trid), obj.checked);
    },
    handleShift: function () {
        var ev = EV.getEvent();
        var at = EV.getTarget();
        var up = null;
        if (ev.shiftKey) {
            try {
                if (El.getNodeType(at) != "input") {
                    up = El.getParentNodeIsTag(at, "tr");
                    if (!up) {
                        return;
                    }
                    at = up.getElementsByTagName("input")[0];
                }
            }
            catch (exp) {
            }

            if (!at) {
                return;
            }
            var o = at.id.split("_")[1];
            var p1 = MM[o];
            var oCb = document.getElementsByName("checkbox_" + o);
            doHandleShift(p1, oCb, at);
        }

        function doHandleShift(p1, arrCb, at) {
            var cb = p1.checkBox;
            if (cb && at.id != cb.id) {
                var bIsClicking = false;
                for (var i = 0, m = arrCb.length; i < m; i++) {
                    if (bIsClicking) {
                        if (sr(arrCb[i], cb, at)) {
                            if (!arrCb[i].checked) {
                                arrCb[i].checked = true;
                                p1.setTrClass(arrCb[i], true);
                            }
                        }
                        else {
                            break;
                        }
                    }
                    else {
                        if (!sr(arrCb[i], cb, at)) {
                            bIsClicking = true;
                        }
                    }
                }
            }
            if (at.checked) {
                p1.checkBox = at;
            }
            else {
                p1.checkBox = null;
            }
            function sr(a, b, c) {
                if (a.id != b.id && a.id != c.id && b.id != c.id) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
    },

    click: function (aj, bx) {
        var p1 = this;
        var o = p1.name;
        var oCb = p1.checkBoxAll;
        p1.checkBox = null;
        if (aj == "all") {
            p1.setCheckBox(p1.listBodyDiv, bx, callBackFunc, (bx ? null : true));
            p1.optReadMail("select");
            if (!(aj == "all" && bx)) {
                oCb.checked = false;
            }
        }
        function callBackFunc(v, Afd) {
            p1.setTrClass(v, Afd, (bx ? false : true));
        }
    },

    /**
     * 设置checkbox状态
     * @param {Object} v 包含checkbox的div
     * @param {Object} bx true||false
     * @param {Object} wo 回调函数
     */
    setCheckBox: function (v, bx, wo) {
        var ak = v.getElementsByTagName("input");
        for (var i = 0, m = ak.length; i < m; i++) {
            if (ak[i].type != "checkbox") {
                continue;
            }
            if (ak[i].checked == bx) {
                continue;
            }
            ak[i].checked = bx;
            if (wo) {
                wo(ak[i], bx);
            }
        }
    },
    singleClick: function (Ady) {
        var p1 = this;
        p1.setTrClass(Ady, Ady.checked);
        p1.checkBoxAll.checked = false;
        p1.optReadMail("select");
        p1.handleShift();
    },
    controlPeriod: function (o) {
        var oIcon = o.childNodes[0];
        var oTb = o.nextSibling;
        if (oIcon.className.trim() == "off") {
            El.removeClass(oIcon, "off");
            oTb.style.display = "";
            o.title = Lang.Mail.Hide;
        }
        else {
            El.addClass(oIcon, "off");
            oTb.style.display = "none";
            o.title = Lang.Mail.Show;
        }
    },
    /**
     * 串行调用时刷新左侧邮件
     * @param {Object} ao Ajax返回的邮件夹列表数据
     */
    loadFolder: function (cb, isInit) {
        isInit = isInit || false;
        LM.freshFolderMain(cb, isInit);
    },
    /**
     * 邮件移动方法
     * @param {Array} mids 邮件id数组
     * @param {Number} fid 移动到的文件夹id
     * @param {String} msg 操作的提示信息
     */
    move: function (mids, fid, msg, sessionId, successMsg) {
        var p1 = this;
        fid = fid - 0;
        //var data = [];
        var mdata = {
            newFid: fid
        };
        if (CC.isSessionModeReadMail(p1.fid) && sessionId) {
            mdata.sessionIds = sessionId;
        }
        else {
            mdata.ids = mids;
        }
        /*
         data.push({
         func: gConst.func.moveMessages,
         'var': ao
         });
         */
        p1.setPageStart(mids.length);//如果最后一页没有数据，则设置查询起始数据为上一页第一个
        var searchData = {
            func: p1.isFilter ? gConst.func.searchMail : p1.func,
            data: p1.getListRequest(),
            call: function (ao) {
                p1.freshData(ao, true);
                CC.showMsg(successMsg, true, false, "option");
            },
            msg: Lang.Mail.search_NowSearch
        };

        var moveData = {
            func: gConst.func.moveMessages,
            data: mdata,
            call: function (ao) {
                if (ao.code == gConst.statusOk) {
                    if (p1.isFilter)
                        MM.mailRequest(searchData);
                    else
                        MM.mailRequestApi(searchData);
                }
            },
            msg: msg
        }
        MM.mailRequest(moveData)
        /*
         data.push({
         func: p1.func,
         'var': p1.getListRequest()
         });


         p1.seqLoadMailList({
         data: data,
         seqCall: function(ao){
         p1.freshData(ao, true);
         CC.showMsg(successMsg,true,false,"option");
         },
         msg: msg
         });*/
    },
    /**
     * 邮件移动方法
     * @param {String} type 操作类型 add:1 增加标签, delete:2 删除标签,empty:3 清空所有标签
     * @param {Array} mids 邮件id数组
     * @param {Number} labelId 标签id
     * @param {String} msg 操作的提示信息
     */
    marklabel: function (type, mids, labelId, callback) {
        var p1 = this;
        labelId = labelId || p1.fid;
        mids = mids instanceof Array ? mids : [mids];
        var data = [];
        data.push({
            func: gConst.func.markLabel,
            'var': {
                ids: mids,
                type: type,
                labelId: labelId
            }
        });
        data.push({
            func: p1.func,
            'var': p1.getListRequest()
        });
        p1.seqLoadMailList({
            data: data,
            seqCall: function (ao) {
                // p1.freshData(ao, true);
                p1.refresh();
                typeof callback == "function" && callback.call(p1, ao);
            },
            msg: Lang.Mail.Write.nowdo + (type == "delete" ? Lang.Mail.Write.Delete : Lang.Mail.Write.addMail) + Lang.Mail.Write.labelMail
        });
    },

    /**
     * 邮件审核通过的方法
     * @param {Array} mids 要审核通过邮件的mid
     * @param {int} type   审核是否通过 [ 0-->通过 1-->不通过 ]
     * @param {String} msg 操作结果的提示信息
     * @param {Boolean} noConfirm 是否不提示直接审核通过
     * @param {Booleam} refrese 审核后是否刷新列表
     */
    auditPass: function (mids, type, msg, noConfirm, refrese, mid) {
        var p = this;
        msg = msg || Lang.Mail.Write.mailHasPass;
        //[ result:1-->审核通过; result:0-->审核不通过 ]
        var data = {
            result: parseInt(type),
            ids: mids
        };

        //确定审核通过的回调函数
        var cb = function () {
            var verifyData = {
                func: "mbox:auditFeedback",
                data: data,
                url: "/RmWeb/mail",
                call: function (ao) {
                    if (ao.code == gConst.statusOk) {
                        var oFrame = document.getElementById("ifrmReadmail_Content_readMail" + mid);
                        if (oFrame) {
                            var eleStatus = oFrame.contentWindow.document.getElementById("readMail_status");
                        }

                        if (eleStatus) {
                            eleStatus.innerHTML = Lang.Mail.Write.hasPassed + "：";
                        }


                        //列表中点击“审核通过”要刷新列表， 读具体邮件时候点击“审核通过”则不用
                        if (refrese) {
                            MM.mailRequest(searchData);
                        } else {
                            if (parseInt(type) == 1) {
                                CC.showMsg(msg, true, false, "option");
                            } else {
                                CC.showMsg(msg, true, false, "caution");
                            }
                        }
                    }
                },
                failCall: function () {

                    CC.alert(Lang.Mail.Write.opFail);
                }
            }

            var searchData = {
                func: p.isFilter ? gConst.func.searchMail : p.func,
                data: p.getListRequest(),
                call: function (ao) {
                    //p.saveDeleteLog(mids, p.fid);
                    p.freshData(ao, true);
                    if (parseInt(type) == 1) {
                        CC.showMsg(msg, true, false, "option");
                    } else {
                        CC.showMsg(msg, true, false, "caution");
                    }

                }
            };

            MM.mailRequest(verifyData);          //审核功能请求后台处理
        }

        if (noConfirm) {
            cb();
        }
        else {
            CC.confirm(Lang.Mail.Write.makeSureAuditPass, function () {
                cb();
            });
        }
    },
    /**
     * 邮件删除方法
     * @param {Array} mids 要删除邮件的mid
     * @param {String} msg 操作提示信息
     * @param {Boolean} noConfirm 是否不提示直接删除
     */
    del: function (mids, msg, noConfirm, sessionIds) {
        var p1 = this;
        msg = msg || Lang.Mail.list_NowDelMail;

        var confirmText = Lang.Mail.list_ConfirmDeleteMail;

        //如果有会话邮件长度， 说明这是会话模式， 需要特别提示
        if(sessionIds.length){
            confirmText = '将彻底删除所选会话邮件下包含的所有邮件，删除后不能恢复，如需单独删除本主题某封邮件请去设置-常规-邮件视图中修改';
        }

        //如果最后一页没有数据，则设置查询起始数据为上一页第一个；
        p1.setPageStart(mids.length);

        //确认删除的回调函数
        var cb = function () {
            var searchData = {
                func: p1.isFilter ? gConst.func.searchMail : p1.func,
                data: p1.getListRequest(),
                call: function (ao) {
                    //p1.saveDeleteLog(mids, p1.fid);
                    p1.freshData(ao, true);
                    CC.showMsg(Lang.Mail.delMailSuccess, true, false, "option");
                },
                msg: Lang.Mail.search_NowSearch
            };
            var dData = {ids: mids};

            /**
             * Update Ryan
             * Date: 2013-3-28 10:12:20
             */
            if (p1.fid == 1 && gMain.sessionMode == "1" && sessionIds && sessionIds.length > 0) {
                dData.sessionIds = sessionIds;
            }
            var delData = {
                func: gConst.func.delMail,
                data: dData,
                call: function (ao) {
                    if (ao.code == gConst.statusOk) {
                        if (p1.isFilter)
                            MM.mailRequest(searchData);  //后根据条件查找重新刷新列表
                        else
                            MM.mailRequestApi(searchData);
                    }
                },
                msg: msg
            }
            if (CC.isExtMail()) {
                delData.data.opUser = gMain.mailId + "@" + gMain.domain;
            }
            MM.mailRequestApi(delData)    //先删除
            /*
             p1.seqLoadMailList({
             data: [{
             func: gConst.func.delMail,
             'var': {
             ids: mids
             }
             }, {
             func: p1.func,
             'var': p1.getListRequest()
             }],
             seqCall: function(ao){
             p1.saveDeleteLog(mids, p1.fid);
             p1.freshData(ao, true);
             //if(!noConfirm)
             CC.showMsg(Lang.Mail.delMailSuccess,true,false,"option");
             },
             msg: msg,
             params: {comefrom: 5}
             });
             */
            //删除日程提醒-gaom
            //CC.deleteCalendar(mids);
        };
        if (noConfirm) {
            cb();
        }
        else {
            CC.confirm(confirmText, function () {
                cb();
            });
        }
    },
    /**
     * 记录彻底删除邮件的日志
     * @param {Array} mids 删除掉的日志邮件mail id array
     */
    saveDeleteLog: function (mids, pid) {
        var logList = [];
        var obj = {};
        var mailData = {};
        var mds = CM[this.name]['var'];

        for (var i = 0, l = mds.length; i < l; i++) {
            mailData[mds[i].mid] = mds[i];
        }

        for (var i = 0, l = mids.length; i < l; i++) {
            obj = {};
            obj.mid = mids[i];
            obj.sender = mailData[obj.mid].from;
            obj.subject = mailData[obj.mid].subject;
            logList.push(obj);
        }

        var reqData = {
            func: 'log:deleteMail',
            data: {'mailList': logList},
            call: function (d) {
                var x = d;
            },
            failCall: function (a, e) {

            },
            url: '/log/log.do'
        };
        MM.doService(reqData);
    },
    /**
     * 邮件标记方法
     * @param {Array} mids 要标记的邮件mid
     * @param {String} type 属性值
     * @param {Number} value 设置的值
     */
    mark: function (mids, type, value, text) {
        var p1 = this;
        var mdata = {};
        value = value - 0;


        if (p1.isAll) {
            mdata = {
                func: gConst.func.updateMailAll,
                'data': {
                    type: type,
                    fid: p1.fid,
                    value: value
                }
            };
        }
        else {
            mdata = {
                func: gConst.func.updateMail,
                'data': {
                    ids: mids,
                    type: type,
                    value: value
                }
            };
        }
        //var topStr = ["read",""];

        if (p1.isFilter && type == "read") {
            if (text && text != p1.isFilter)
                p1.setPageStart(mids.length);//如果最后一页没有数据，则设置查询起始数据为上一页第一个
        }

        var isFresh = (type == "read") ? true : false;
        var searchData = {
            func: p1.isFilter ? gConst.func.searchMail : p1.func,
            data: p1.getListRequest(),
            call: function (ao) {
                p1.freshData(ao, isFresh);
            }
        };

        var call = function (ao) {
            if (ao.code == gConst.statusOk) {

                //标记成功提示
                MM.showMsg(p1.isAll ? "所有邮件标记成功" : "标记成功", true, false, "option");

                if (!p1.isFilter && p1.fid !=7 && !p1.isSearch)
                    MM.mailRequest(searchData);
                else
                    MM.mailRequestApi(searchData);
            }
        };
        mdata.msg = Lang.Mail.list_MarkMail;
        mdata.call = call;
        /*
         data.push({
         func: p1.func,
         'var': p1.getListRequest()
         });
         var call = function(ao){
         p1.freshData(ao, isFresh);
         };
         p1.seqLoadMailList({
         data: data,
         seqCall: call,
         msg: Lang.Mail.list_MarkMail
         });
         */
        if(CC.isSecurityMail()){
            MM.mailRequestApi(mdata);
        }else{
            MM.mailRequest(mdata);
        }     


    },
    /**
     * 邮件列表排序
     * @param {String} st 排序字段
     */
    rankList: function (st) {
        var p1 = this;
        var o = p1.name;
        p1.clearCache();

        if (p1.order == st) {
            p1.desc = (1 - p1.desc);
        }
        else {
            p1.order = st;
            p1.desc = (p1.order == GE.list.order) ? 1 : 0;
        }
        p1.start = 1;
        if (!p1.isSearch && !p1.isFilter) {
            var obj = {
                msg: Lang.Mail.list_LoadMailList,
                isFresh: false,
                data: p1.getListRequest()
            };
            p1.loadMailList(obj);
        }
        else {
            var sp = GE.searchData;
            sp.desc = p1.desc;
            sp.order = p1.order;
            sp.start = p1.start;
            CC.searchMail(sp, p1.isLoadNoReadMail);
        }
        var sortIcon = (p1.desc ? "desc" : "asc");
        El.setClass($(gConst.listMailSortIcon + p1.bOrder), "");
        El.setClass($(gConst.listMailSortIcon + p1.order), sortIcon);
        p1.bOrder = p1.order;
    },

    /**
     * 翻页方法
     * @param {Object} n 页码
     */
    goPage: function (n) {
        var p1 = this;
        var o = p1.name;
        var pCount = p1.pageCount;
        var pCurrent = p1.pageCurrent;

        //p1.getDatePick();
        if (pCurrent != n) {
            n = Math.min(n, pCount - 1);
            n = Math.max(n, 0);
            p1.clearCache();
            p1.start = (p1.limit * n) + 1;
            p1.pageCurrent = n;


            
            

            //p1.checkBox = null;
            //try {
            //	p1.click("all", false);
            //} catch (exp) {
            //}

            CC.scrollTop();
            var obj = {
                msg: Lang.Mail.list_LoadMailList,
                data: p1.getListRequest(),
                func: p1.isFilter ? gConst.func.searchMail : p1.func
            };
            jQuery("#listBody_" + p1.name).scrollTop(0);
            p1.loadMailList(obj); 
        }
        else {
            return false;
        }
    },

    /**
     * 得到当前选中邮件的mid
     * @param {Object} mids
     */
    getSelectValue: function (mids, sessionIds) {
        var p1 = this;
        var o = p1.name;
        //item 中没有auditStatus这个状态，所以从CM[o]["var"]中取  p1.checkedStatus
        var listData = CM[o]["var"] || [];
        var listLen = listData.length;
        var ids = [];
        var thisDomain = parent.gMain.domain;
        var reDomain = eval("/" + thisDomain + ">?$/i");

        p1.checkedStatus = "";
        p1.checked_secureEncrpt = false;
        p1.checked_secureSigned = false;

        try {
            var ak = p1.listBodyDiv.getElementsByTagName("input");
            for (var i = 0, m = ak.length; i < m; i++) {
                var item = ak[i];
                if (item.type == "checkbox" && item.name == gConst.checkBoxName && item.checked) {

					//1.如果是‘审核’功能操作，则push待审核的id
                    if (GE.folderMap && GE.folderMap[gConst.folderEnum.audit]
                        && p1.fid == gConst.folderEnum.audit &&
                        (p1.menuId == "PASSAUDIT" || p1.menuId == "NOTPASSAUDIT" || p1.menuId == "DELETE"
                            || p1.menuId == "REALDELETE" || p1.menuId == "MOVE" || typeof p1.menuId == "undefined")) {
                        //如果item的value等于listData的mid,就可以得到这个item的auditStatus
                        for (var j = 0; j < listLen; j++) {
                            if (item.defaultValue == listData[j]["mid"]) {
                                //只提交待审核的邮件id
                                if (listData[j]["auditStatus"] == 3 || listData[j]["auditStatus"] == 4) {
                                    //mids.push(item.value);
                                    //sessionIds.push(parseInt(item.getAttribute("sessionId")));
                                    ids.push(item.id.replace('checkbox_' + o + '_', '') - 0);
                                    //如果有“待审核”邮件，则状态为“bUnAudited"
                                    p1.checkedStatus = "bUnAudited";
                                } else if (listData[j]["auditStatus"] == 5 || listData[j]["auditStatus"] == 6) {
                                    //如果状态不是“待审核”，则改为"bAudited"，说明只有“已经审核邮件，或者普通邮件
                                    if (p1.checkedStatus != "bUnAudited") {
                                        p1.checkedStatus = "bAudited";
                                    }
                                }
                                else if (typeof listData[j]["auditStatus"] != "undefined") {
                                    //如果状态没有值，则这是一个普通邮件
                                    if (!p1.checkedStatus) {
                                        p1.checkedStatus = "bCommon";
                                    }
                                }
                            }
                        }
                    }

					//2.如果是安全邮箱, 是签名或者加密, 并且是未读, 则禁止在读信列表页转发,
					// 禁止变成已读, 在读信内容页面(正文)是可以转发的
					if (CC.isSecurityMail() && (p1.menuId == "FORWARD" || p1.menuId == "READ") ) {
                        for (var n = 0; n <listLen; n++){
                            if (item.defaultValue == listData[n]["mid"]) {
                                var temp =  listData[n];
                                
                                if( temp.flags && temp.flags.read == "1" ){
                                    if( temp.secureEncrypt == "1" || temp.flags.secureEncrypt == "1" ){
                                        p1.checked_secureEncrpt = true;
                                    }
                                    
                                    if( temp.secureSigned == "1" ||  temp.flags.secureSigned == "1" ){
                                        p1.checked_secureSigned = true;
                                    }
                                }
                                
                            }
                        }
                    }

					//3.如果是加入黑名单，本域用户不允许加入黑名单
                    if (p1.menuId == "INFORM") {
                        var oA = item.parentNode.parentNode.children[2].children[1];
                        var from = jQuery(oA).attr('title') || '';

                        if (typeof from == "undefined") {
                            break;
                        }
                        if (from.search(reDomain) != -1) {
                            p1.hasDomain = true;
                            break;
                        }
                    }

                    mids.push(item.value);
                    sessionIds.push(parseInt(item.getAttribute("sessionId")));
                    ids.push(item.id.replace('checkbox_' + o + '_', '') - 0);

                }


            }


            return ids;
        }
        catch (e) {
            return ids;
        }
    },
    /**
     * 获取禁止转发的邮件对象
     */
    getDenyForwardObject: function () {
        var d = CM[this.type + this.fid][gConst.dataName];
        var r = {};
        try {
            if (d && d.length) {
                for (var i = 0; i < d.length; i++) {
                    if (d[i].denyForward && d[i].denyForward == 1) {
                        r[d[i].mid] = 1;
                    }
                }
            }
        } catch (e) {
        }
        return r;
    },
    /**
     * 获取满足条件的邮件列表对象
     * @param cond {function}
     * @return {{}}
     */
    getConditionListObject: function (cond) {
        var d = CM[this.type + this.fid][gConst.dataName];
        var r = {};
        try {
            if (d && d.length) {
                for (var i = 0; i < d.length; i++) {
                    if (typeof cond == 'function') {
                        if (cond(d[i])) {
                            r[d[i].mid] = 1;
                        }
                    }
                }
            }
        } catch (e) {
        }
        return r;
    },
    /**
     * 未读邮件/收件箱/监控/审核/草稿箱/已发送/已删除/垃圾邮件 文件列表的功能按钮操作
     * [ 如审核通过、审核不通过、删除、转发、标记、移动到、筛选、加入黑名单、更多 ]
     * 从这里开始
     * @param {Object} o
     * @param {Object} menuId
     * @param {Object} ao
     */
    doMenu: function (o, menuId, ao) {
        var p1 = MM[o];
        var name = ao.text;
        var fid = p1.fid;
        var fname = "";
        var func = "";
        var attrs = {};
        var mid = "";
        var mids = [];
        var pm = ao.pm || 0;
        var strName = Lang.Mail.list_Operate;
        p1.menuId = menuId;
        strName = strName.toLowerCase();
        //每次操作前先，假设选择的邮件不包括本域
        p1.hasDomain = false;
        var sessionIds = [];
        var html = [];
        var ids = p1.getSelectValue(mids, sessionIds);
        var checkedStatus = p1.checkedStatus;
		var isSecureEncrypt = p1.checked_secureEncrpt;
		var isSecureSigned = p1.checked_secureSigned;

        try {
            var menuName = ao.name;
            menuName = menuName.substr(0, menuName.lastIndexOf('_'));
            menuName = menuName.substr(menuName.lastIndexOf('_') + 1);

            switch (menuName) {
                case 'MARK':
                    menuId = 'MARK' + menuId;
                    break;
                case 'FILTER':
                    menuId = 'FILTER' + menuId;
                    break;
                default:
            }
        } catch (e) {
        }

        if (!Folder.notNeedIds.hasOwnProperty(menuId)) {
            //如果选择的邮件不包含”待审核“邮件
            if (menuId == "PASSAUDIT" || menuId == "NOTPASSAUDIT") {
                if (checkedStatus == "bAudited") {
                    //"邮件为已审核状态"
                    CC.showMsg(Lang.Mail.Write.auditedStatus, true, false, "caution");
                    return false;
                } else if (checkedStatus == "bCommon") {
                    //"该邮件不是审核邮件"
                    CC.showMsg(Lang.Mail.Write.thisIsNotAuditMail, true, false, "caution");
                    return false;
                }
            } else if (menuId == "DELETE" && checkedStatus == "bUnAudited") {
                //"待审核邮件不允许删除"
                CC.showMsg(Lang.Mail.Write.connotDeleteUnaudit, true, false, "caution");
                return false;
            } else if (menuId == "REALDELETE" && checkedStatus == "bUnAudited") {
                //"待审核邮件不允许彻底删除"
                CC.showMsg(Lang.Mail.Write.connotRealDeleteUnaudit, true, false, "caution");
                return false;
            } else if (menuId == "MOVE" && checkedStatus == "bUnAudited") {
                //"待审核邮件不允许移动到其他邮件夹"
                CC.showMsg(Lang.Mail.Write.connotMoveUnaudit, true, false, "caution");
                return false;
            } else if (menuId == "INFORM" && p1.hasDomain) {
                //本域用户不允许加入黑名单
                parent.CC.showMsg(Lang.Mail.Write.connotJoinBlackUnaudit, true, false, "caution");
                return;
			}else if(menuId == "FORWARD" && (isSecureEncrypt || isSecureSigned)){
			    //您选择了加密或签名邮件，请解密或验签后再转发
			    parent.CC.showMsg("您选择了加密或签名邮件，请解密或验签后再转发",true,false,"caution");
			    return;
			}else if(menuId == "MARKREAD" && (isSecureEncrypt)){
                //您选择了加密或签名邮件，请解密或验签后再转发
                parent.CC.showMsg("您选择了加密邮件，请解密后再标记为已读",true,false,"caution");
                return;
            }

            //如果没有选择邮件，提示：请选择要操作的邮件。
            if (mids.length < 1) {
                CC.alert(Lang.Mail.list_SelectDoMail.format(strName));
                return false;
            }
            else {
                mid = encodeURIComponent(mids[0]);
            }
        }

        //根据操作类型执行相应的函数
        switch (menuId) {
            case "PASSAUDIT":
                p1.auditPass(mids, 1, Lang.Mail.Write.mailHasPass, true, true);
                break;
            case "NOTPASSAUDIT":
                p1.auditPass(mids, 0, Lang.Mail.Write.mailHasNotPass, true, true);
                break;
            case "FILTER":
                if (mids.length > 1) {
                    CC.showMsg(Lang.Mail.list_OnlySelectOne, true, false, "option");
                    // CC.alert(Lang.Mail.list_OnlySelectOne);

                }
                else {
                    var sender = getSender();
                    var tobj = {
                        name: sender,
                        from: sender
                    };
                    CC.setConfig('filter', tobj);
                }
                break;
            //筛选开始
            case "FILTERALL": //全部		
                p1.isFilter = "";
                CC.filterMail(fid, [], flags, 2, o);
                break;
            case "FILTERREAD": //已读
                //alert("已读")
                var flags = {
                    read: 0
                };
                p1.isFilter = name;
                CC.filterMail(fid, [], flags, 2, o);
                break;
            case "FILTERNOREAD": //未读
                //alert("未读")
                var flags = {
                    read: 1
                };
                p1.isFilter = name;
                CC.filterMail(fid, [], flags, 2, o);
                break;
            case "FILTERURGENT": //紧急
                var condictions = [];
                var flags = {};
                condictions.push({
                    "field": "priority",
                    "value": 1
                });
                p1.isFilter = name;
                CC.filterMail(fid, condictions, flags, 2, o);
                break;
            case "FILTERCOMMENTS": //已回复
                //alert("已回复")
                var flags = {
                    replied: 1
                };
                p1.isFilter = name;
                CC.filterMail(fid, [], flags, 2, o);
                break;
            case "FILTERFORWARD": //已转发
                //alert("已转发")
                var flags = {
                    forwarded: 1
                };
                p1.isFilter = name;
                CC.filterMail(fid, [], flags, 2, o);
                break;
            case "FILTERSTARRED": //已星标
                //alert("已星标")
                var flags = {
                    starFlag: 1
                };
                p1.isFilter = name;
                CC.filterMail(fid, [], flags, 2, o);
                break;
            case "FILTERUNSTARRED": //未星标
                //alert("未星标")
                var flags = {
                    starFlag: 0
                };
                p1.isFilter = name;
                CC.filterMail(fid, [], flags, 2, o);
                break;
            case "FILTERATTACHMENT": //含附件
                //alert("含附件")
                var flags = {
                    attached: 1
                };
                p1.isFilter = name;
                CC.filterMail(fid, [], flags, 2, o);
                break;
            case "FILTERNOATTACHMENT": //无附件
                //alert("无附件")
                var flags = {
                    attached: 0
                };
                p1.isFilter = name;
                CC.filterMail(fid, [], flags, 2, o);
                break;
            case "FILTERMONITORRECEIVE": //收信监控
                var flags = {
                    auditStatus: 2
                };
                p1.isFilter = name;
                CC.filterMail(fid, [], flags, 2, o);
                break;
            case "FILTERMONITORSEND": //发信监控
                var flags = {
                    auditStatus: 1
                };
                p1.isFilter = name;
                CC.filterMail(fid, [], flags, 2, o);
                break;
            case 'FILTERPASSAUDIT': //审核通过
                var flags = {
                    auditStatus: 5
                };
                p1.isFilter = name;
                CC.filterMail(fid, [], flags, 2, o);
                break;
            case 'FILTERNOTPASSAUDIT': //审核通过
                var flags = {
                    auditStatus: 6
                };
                p1.isFilter = name;
                CC.filterMail(fid, [], flags, 2, o);
                break;

            case 'FILTERALLAUDIT': //待审核：全部
                var flags = {
                    auditStatus: 16
                };
                p1.isFilter = name;
                CC.filterMail(fid, [], flags, 2, o);
                break;
            case 'FILTERRECEIVEAUDIT': //待审核：接收邮件
                var flags = {
                    auditStatus: 4
                };
                p1.isFilter = name;
                CC.filterMail(fid, [], flags, 2, o);
                break;
            case 'FILTERSENDAUDIT': //待审核：发送邮件
                var flags = {
                    auditStatus: 3
                };
                p1.isFilter = name;
                CC.filterMail(fid, [], flags, 2, o);
                break;
            case "REFUSE":
            case "BLACKLIST":
                if (mids.length > 1) {
                    // CC.alert(Lang.Mail.list_OnlySelectOne);
                    CC.showMsg(Lang.Mail.list_OnlySelectOne, true, false, "option");
                }
                else {
                    CC.setConfig('black', getSender());
                }
                break;
            case "EDIT":
                goCompose(gConst.func.restore, mid, Lang.Mail.list_EditMail);
                break;
            case "FORWARD":
                var smObj = p1.getConditionListObject(function (d) {
                    if (d.securityLevel && d.securityLevel > 0) {
                        return true;
                    }
                    return false;
                });
                var hasSM = false;
                fname = Lang.Mail.list_FwdMail;

                if (mids.length > 1) {
                    for (var i = 0, l = mids.length; i < l; i++) {
                        if (!hasSM) {
                            for (var k in smObj) {
                                if (smObj && smObj.hasOwnProperty(mids[i])) {
                                    hasSM = true;
                                }
                            }
                        }
                    }
                    if (hasSM) {
                        parent.CC.alert(Lang.Mail.multiplyMailNotAllowForward);
                    }
                    else {
                        goCompose("forwardMore", mid, fname);
                    }
                }
                else {
                    goCompose(gConst.func.forward, mid, fname);
                }
                break;
            case "DELETE":
            case "DEL":
                /*if (CC.isSessionModeReadMail(fid) && mids.length > 1) {

                 CC.showMsg(Lang.Mail.list_OnlyDeleteOneSession.format(Lang.Mail.tb_Delete),true,false,"option");
                 //CC.alert();
                 return;
                 }*/

                if (p1.fid == GE.folder.del) {
                    p1.del(mids);
                }
                else {
                    p1.move(mids, GE.folder.del, Lang.Mail.list_NowDelMail, sessionIds || [], Lang.Mail.movemail_success.format('"' + Lang.Mail.folder_4 + '"'));
                    //p1.showTipsSuccess(Lang.Mail.movemail_success.format('"'+Lang.Mail.folder_4)+'"');
                }
                break;
            case 'NOTJUNK':
            {
                p1.move(mids, 1, Lang.Mail.list_NowMoveMail, sessionIds || [], Lang.Mail.movemail_success.format('"' + Lang.Mail.folder_1 + '"'));
                break;
            }
            case "REALDELETE":
            case "DELETEREALDEL":
            case "REALDEL":
                if (!CC.isSessionMode()) {
                    sessionIds = [];
                }
                p1.del(mids, null, null, sessionIds || []);
                break;
            case "EMPTY":
                MM.folderMain.opt("empty", fid);
                break;
            case "MARKREAD":
                p1.mark(mids, "read", 0, name);
                break;
            case "MARKUNREAD":
                p1.mark(mids, "read", 1, name);
                break;
            case "MARKURGENT":
                p1.mark(mids, "priority", GE.priority.hight);
                break;
            case "MARKCOMMON":
                p1.mark(mids, "priority", GE.priority.common);
                break;
            case "MARKTOP":
                if ((mids.length + GE.topNum) <= gConst.topNum) {
                    p1.mark(mids, "top", 1);
                }
                else {
                    CC.showMsg(Lang.Mail.folder_topNum_over.format(gConst.topNum), true, false, "option");
                    //CC.alert(Lang.Mail.folder_topNum_over.format(gConst.topNum));
                }
                break;
            case "MARKNOTOP":
                GE.topNum = 0;
                p1.mark(mids, "top", 0);
                break;
            //邮件标签功能
            case "MARKLABEL":
                p1.marklabel("add", mids, pm);
                break;
            case "MOVE":
                if (pm == 0 || pm == fid) {
                    CC.showMsg(Lang.Mail.list_MailExistFolder, true, false, "alert");
                    return false;
                }
                p1.move(mids, pm, Lang.Mail.list_NowMoveMail, sessionIds || [], Lang.Mail.movemail_success.format('"' + ao.value + '"'));
                break;
            case "MAILEXPORT":
                // 判断用户选中的邮件是否全部是禁止转发邮件或包含禁止转发邮件，并给出提示
                var dmObj = p1.getDenyForwardObject();
                var all = true, part = false;
                var smObj = p1.getConditionListObject(function (d) {
                    if (d.securityLevel && d.securityLevel > 0) {
                        return true;
                    }
                    return false;
                });
                var hasSM = false;
                for (var i = 0; i < mids.length; i++) {
                    if (dmObj.hasOwnProperty(mids[i])) {
                        part = true;
                    }
                    else {
                        all = false;
                    }
                    if (!hasSM) {
                        for (var k in smObj) {
                            if (smObj && smObj.hasOwnProperty(mids[i])) {
                                hasSM = true;
                            }
                        }
                    }
                }
                if (all) {
                    //全部都是禁止转发邮件
                    parent.CC.alert(Lang.Mail.Write.forbitForwardInMailExportTip);
                }
                else if (part) {
                    parent.CC.alert(Lang.Mail.Write.hai_mailAutoFilter, function () {
                        p1.downloadEmail(mids, sessionIds);
                    });
                }
                else if (hasSM) {
                    parent.CC.alert(Lang.Mail.export_sm_tips);
                } else {
                    p1.downloadEmail(mids, sessionIds);
                }
                break;
            case "MAILIMPORT":
                CC.importMail();
                break;
            case "INFORM": //举报
                var data = CM[o]['var'];
                var ds = {};
                var pd, pm, pe, pn, sta, end;
                for (var i = 0, l = data.length; i < l; i++) {
                    pd = data[i];
                    if (pd.mid) {
                        pe = pd.from.decodeHTML();
                        sta = pe.indexOf('<');
                        end = pe.indexOf('>');
                        if (sta > 0 && end > 0) {
                            pn = pe.substr(0, sta);
                            pe = pe.substr(sta + 1, end - sta - 1);
                        }
                        else {
                            pn = '';
                        }
                        pm = pd.mid;
                        ds[pm] = {
                            mid: pm,
                            email: pe,
                            userName: pn
                        };
                    }
                }
                var m = {
                    mails: [],
                    sessionMails: [],
                    moduleId: o
                };
                for (var i = 0; i < mids.length; i++) {
                    if (ds[mids[i]]) {
                        m.mails.push(ds[mids[i]]);
                    }
                }
                CC.inform(m);
                break;
            /*case "newLabel":
             MM[gConst.folderMain].add(5);
             break;
             case "addLabel":
             p1.marklabel("add",mids,pm);
             break;
             case "delLabel":
             p1.marklabel("delete",mids,pm);
             break;
             case "emptyLabel":
             p1.marklabel("empty",mids,pm);
             break;  */
            default:
                break;
        }

        function goCompose(m, mailid, fname) {
            var fd = [];
            var ld = CM[o]["var"];
            var item = {};
            var url = CC.getComposeUrl("&mid=" + mailid + "&funcid=" + m);
            if (mids.length > 1 && m == "forwardMore") {
                for (var i = 0; i < ids.length; i++) {
                    item = ld[ids[i]];
                    //fd.push({fileId:item.mid,fileName:item.subject+".eml",fileSize:item.size,type:"email"});
                    fd.push(item.mid);
                }
                MM["folder"].data = fd;
                CC.goCompose(url, 'compose_' + mailid, fname);
                return false;
            }
            else if (mids.length > 1) {
                // CC.alert(Lang.Mail.list_OnlySelectOne);
                CC.showMsg(Lang.Mail.list_OnlySelectOne, true, false, "alert");
                return false;
            }
            CC.goCompose(url, 'compose_' + mailid, fname);
        }

        /***
         * 获取发件人
         */
        function getSender() {
            var se = [];
            var d = CM[o]["var"];
            d.each(function (i, value) {
                for (var j = 0, l = mids.length; j < l; j++) {
                    if (mids[j] == value.mid) {
                        se[se.length] = Email.getValue(value.from.decodeHTML());
                        break;
                    }
                }
            });
            return se.unique().join(",");
        }
    },
    hasTopMail: function (mids) {
        if (mids) {
            for (var i = 0, l = mids.length; i < l; i++) {
                if (this.topMids.has(mids[i])) {
                    return true;
                }
            }
        }
        return false;
    },
    /**
     * 刷新邮件列表
     * @param {Object} isNotActive 是否不激活标签，默认为false，激活标签
     */
    refresh: function (isNotActive) {
        var p1 = this;
        var o = p1.name;
        p1.isRefreshFolders = true;
        if (!p1.isSearch) {
            p1.loadMailList({
                data: p1.getListRequest(),
                msg: Lang.Mail.LoadMailList,
                isFresh: true
            });
        }
        else {
            //重新执行搜索函数，实现刷新功能
            CC.searchMail(GE.searchData);
            p1.loadFolder(function () {
            }, true);
        }
    },
    clearCache: function () {
        var p1 = this;
        p1.start = 1;
        p1.limit 
        p1.limit = gMain.pageSize;
        p1readMailType = gMain.readMailMode;
    },
    initDragEvent: function () {
        var p1 = this;
        var o = p1.name;
        var table = p1.listBodyDiv;
        if (table)
            EV.observe(table, "mousedown", MM.folder.mouseDown, false);
    },
    mouseDown: function () {

        try {
            var ev = EV.getEvent();
            var target = EV.getTarget(ev, true);
            var targetName = El.getNodeType(target);
            var ischecked = false;
            var emTag = "";
            var emClass = "";

            // 任务邮件屏蔽事件
            if (target.getAttribute("data-action") === "showTaskMenu") {
                return false;
            }
            if (targetName == "input") {
                ischecked = true;
            }

            //待审核不能拖动
            if (target.previousSibling && target.previousSibling.children[0]) {
                emTag = target.previousSibling.children[0];
            }

            if (emTag && emTag.className) {
                emClass = emTag.className;
            }

            var up = El.getParentNodeIsTag(target, "tr");
            var strDragTip = "";
            if (!up || emClass == "status3" || emClass == "status4") {
                return;
            }
            var oCheckBox = up.getElementsByTagName("input")[0];
            var cd = up.id.split("_");
            var o = cd[1];
            var i = cd[2];
            var p1 = MM[o];
            oCheckBox.checked = !oCheckBox.checked;


            //p1.singleClick(oCheckBox);

            if (ischecked) {
                oCheckBox.checked = !oCheckBox.checked;
            }
			p1.setTrClass(up,oCheckBox.checked);
            var mids = [];
            var sessionIds = [];
            p1.getSelectValue(mids, sessionIds);
            var num = mids.length + (!oCheckBox.checked ? 1 : 0);
            if (num > 1) {
                strDragTip = Lang.Mail.list_SelectNumberMail.format(num);
            }
            else {
                strDragTip = $("listsubject_" + o + "_" + i).innerHTML;//up.childNodes[5].getElementsByTagName("a")[0].innerHTML;
            }
            up.mouseDownY = EV.pointerY(ev);
            up.mouseDownX = EV.pointerX(ev);
            var oDrag = new Drag("folder", up);
            var oDragItem = oDrag.getDragItem(strDragTip);

            MM.folder.drag = oDrag;
            oDrag.doDragOver = MM.folder.handleDrag;
            oDrag.doDragUp = MM.folder.moveByDrag;
            oDrag.init();
        }
        catch (exp) {
        }
        return false;
    },

    handleDrag: function () {
        var p1 = this;

        function findUntil(obj, tagName) {
            var tn;
            if (obj.tagName && (tn = El.getNodeType(obj))) {
                if (tn == tagName) {
                    return obj;
                }
                else if (obj.parentNode) {
                    return findUntil(obj.parentNode, tagName);
                }
                else {
                    return null;
                }
            }
        }

        if (GE.Drag.moveType == "folder") {
            var ev = EV.getEvent();
            var target = EV.getTarget(ev, true);
            var targetParent = target.parentNode;
            var targetName = El.getNodeType(target);
            var oDrag = MM.folder.drag;
            var exceptNode;
            if (Folder.checkedStatus) {
                alert(Folder.checkedStatus)
            }

            var id = target.id;
            if (targetName != "li") {
                //id = targetParent.id; 直接获取parent id 有可能不能获取到正确的文件夹id。所有正确的文件夹id 都位于li节点上
                // 所以使用findUntil方法获取目标以上直到有li为止的目标，才是我们期望的目标
                exceptNode = findUntil(target, 'li');
                if (exceptNode && exceptNode.id) {
                    id = exceptNode.id;
                }
            }
            //window.status = "id:"+id;
            var isOk = (targetName == "li" || targetName == "a" || targetName == "span") && (id != "-1" && id != "-2" && id != GE.currentFolder);

            if (isOk && checkIsFolder(target)) {
                /*if (targetName == "a") {
                 var pid = target.parentNode.id;
                 if (pid.length < 24) {
                 oDrag.folderMoveTo = null;
                 oDrag.isOn = false;
                 return;
                 }
                 pid = pid.substr(pid.length - 1, pid.length);
                 if(pid =="0")
                 {
                 oDrag.folderMoveTo = null;
                 oDrag.isOn = false;
                 return;
                 }
                 if (pid == GE.currentFolder) {
                 oDrag.folderMoveTo = null;
                 oDrag.isOn = false;
                 return;
                 }
                 }
                 if(targetName =="span")
                 {
                 if(target.id && target.id.length>5)
                 {
                 var id = target.id.substr(5);
                 if(id =="0")
                 {
                 oDrag.folderMoveTo = null;
                 oDrag.isOn = false;
                 return;
                 }
                 }
                 }*/
                var toId = target.id;
                var fromId = oDrag.div.id;
                oDrag.folderMoveTo = id;
                oDrag.isOn = true;

            }
            else {
                oDrag.folderMoveTo = null;
                oDrag.isOn = false;
            }
        }

        function checkIsFolder(at) {
            var af = at.parentNode;
            var bf = af;
            var i = 0;
            while (af && af != af.parentNode && i < gConst.dragLimit) {
                if (af.id == "ulMailFunc" || af.id == "leftFolderContainer_-1") {
                    return bf.id;
                }
                bf = af;
                af = af.parentNode;
                i++;
            }
            return false;
        }
    },

    moveByDrag: function (lf, ag) {
        if (lf && ag.id) {
            var o = ag.id.split("_")[1];
            var p1 = MM[o];
            var fid = p1.fid;
            if (lf == name) {
                CC.alert(Lang.Mail.list_SelectSameFolder);
                return;
            }
            var of = MM.getFolderObject(lf);
            if (!of)
                return;
            if (of.type == GE.folderType.label) {
                p1.doMenu("addLabel", Lang.Mail.Write.isusingLabel + "...", lf);
            }
            else {
                p1.doMenu(o, "MOVE", {
                    text: Lang.Mail.tb_Move,
                    value: of.name,
                    pm: lf
                });
            }
        }
    },

    resize: function () {
        var p1 = this;
        //var o = p1.name;
        //var divo = $("div" + o);
        //if (typeof(divo) == "undefined" || divo == null) {
        //} else {
        //	$("div" + o).style.width = "";
        //}
        p1.setDivHeight();
    },

    exit: function () {
        this.start = 1;
        return true;
    },
    getListRequest: function (isinit) {
        var p1 = this;
        var name = p1.name;
        var data = {};
        var limit = p1.limit;
        if (p1.isSearch || p1.isFilter) {
            if (isinit) {
                p1.start = 1;
                data = GE.searchData;
            }
            else {
                data = GE.searchData;
                data.start = p1.start;
            }
        }
        else {
            if (isinit) {
                p1.start = 1;
                data = {
                    fid: p1.fid,
                    order: GE.list.order,
                    desc: 0,
                    total: limit,
                    param: "&norefreshSid=" + ( window.nsid !== void 1 ? window.nsid : 0),
                    sessionEnable: gMain.sessionMode
                };

            }
            else {
                data = {
                    fid: p1.fid,
                    order: p1.order,
                    desc: p1.desc,
                    start: p1.start,
                    total: limit,
                    param: "&norefreshSid=" + ( window.nsid !== void 1 ? window.nsid : 0),
                    sessionEnable: gMain.sessionMode
                };
            }
            if (p1.fid == 1) {
                data.sessionEnable = gMain.sessionMode;
            }
            else {
                data.sessionEnable = "0";
            }
            if (p1.fid === 7) {
                data.order = "modifyDate";
            }
        }
        return data;
    },
    getDatePick: function (name) {

        //实例化选择日期控件
        var o = name || this.name;
        var p1 = MM[o];
        var dateStart = null;
        var dateEnd = null;


        if ((GE.folderMap && GE.folderMap[gConst.folderEnum.audit] || GE.folderMap && GE.folderMap[gConst.folderEnum.monitor]) && (o == 'sys' + gConst.folderEnum.audit || o == 'sys' + gConst.folderEnum.monitor)) {

            p1.picker = new CCalendar("#datePicker", {
                onSelectBack: function (oDate) {
                    var yyyy = parseInt(oDate["yyyy"], 10);
                    var mm = parseInt(oDate["mm"], 10);
                    var dd = parseInt(oDate["dd"], 10);

                    p1.isFilter = Lang.Mail.Write.dateFilter;
                    dateStart = new Date(yyyy, mm - 1, dd).getTime() / 1000;
                    dateEnd = dateStart + 24 * 60 * 60;
                    //date = oDate.time / 1000,0;
                    p1.selectDate = yyyy + Lang.Mail.Write.lb_timesend_year + mm + Lang.Mail.Write.lb_timesend_month + dd + Lang.Mail.Write.lb_timesend_day;

                    cb();
                    return true;
                }
            });

            function cb() {
                p1.isFilter = Lang.Mail.Write.dateFilter;
                if (p1.fid == gConst.folderEnum.monitor) {
                    p1.text = Lang.Mail.Write.monitorMail;
                } else {
                    p1.text = Lang.Mail.Write.audit_mail;
                }
                //fid,searchList,flags,isFullSearch,o,sentDate
                //CC.advSearchMail(fid,searchList,flags,isFullSearch);
                var searchList = [];
                if (dateStart) {
                    searchList.push({field: "sentDate", operator: "GE", value: dateStart});
                    searchList.push({field: "sentDate", operator: "LT", value: dateEnd});
                }
                CC.filterMail(p1.fid, searchList, "", 2, o);
            }
        }
    },
    //加载邮件列表，直接请求加载，用于分页，初次加载使用
    loadMailList: function (obj) {
        var p1 = this;
        var o = p1.name;
        var func = (obj.func || p1.func);
        var cb = obj.call;
        if (!obj) {
            return;
        }
        var callBack = function (au) {
            p1.freshData(au, obj.isFresh);
            //p1.getDatePick();
            if (typeof(cb) == "function") {
                cb();
            }
        };

        var arg = arguments;
        var failCall = function (au) {
            CC.error(p1.name, p1.text, function () {
                p1.loadMailList.apply(p1, arg);
            });
        };

        var data = {
            func: func,
            data: obj.data,
            call: callBack,
            failCall: failCall,
            msg: obj.msg,
            param: "&norefreshSid=" + ( window.nsid !== void 1 ? window.nsid : 0),
            sessionEnable: gMain.sessionMode
        };
        if (this.fid != 1) {
            data.sessionEnable = 0;
        }
        //修改所有得到邮件列表的都走webapp接口，筛选也走webapp接口
        if (p1.isSearch || p1.isFilter) {
            MM.mailRequestApi(data);
        } else {
            MM.mailRequest(data);
        }

    },
    /**
     * 加载邮件列表，串行请求加载
     * 用于删除，移动的串行请求
     * @param {Object} obj {data,call,msg}
     */
    seqLoadMailList: function (obj) {
        var p1 = this;
        var o = p1.name;
        var data = obj.data || [];
        var params = obj.params || {};
        var cb = obj.seqCall || Util.emptyFunction;
        var fcb = obj.failCall ||
            function (au) {
                var msg = "Error Code:";
                if (typeof(au) == "object") {
                    msg += au.code;
                }
                else {
                    msg += au;
                }
                CC.alert(Lang.Mail.fail + msg);
            };
        if (!obj) {
            return;
        }
        MM.seqRequestCB(data, cb, fcb, obj.msg, params);
    },
    /**
     * 刷新列表数据
     * @param {Object} data Ajax返回的数据
     * @param {Object} isFresh 是否更新邮件数信息
     */
    freshData: function (data, isFresh) {
        var p1 = this;
        var o = p1.name;
        var au = data || {};
        if (au.code == gConst.statusOk) {
            CM[o] = au;
            if (p1.isSearch) {
                p1.stats = au.stats;
            }
            if (p1.isFilter) {
                p1.filterStats = au.stats;
            }
            if (isFresh) {
                //刷新邮件列表邮件计数
                p1.loadFolder(function () {
                    p1.refreshMenu();
                    CC.updateHome();
                    if (p1.listBodyDiv)
                        p1.listBodyDiv.innerHTML = p1.getListData();
                    p1.changeStatus_read();
                }, true);
            }
            if (p1.listBodyDiv) {
                p1.listBodyDiv.innerHTML = p1.getListData();
                p1.changeStatus_read();
            }
            if (p1.isSearch && GE.searchKey) {
                p1.bindCloseInBarEvent(jQuery);
            }

        }
    },
    /***
     * 设置读信方式 分栏读信/新标签读信
     * @param {Object} id
     * @param {Object} isFirst
     */
    setReadMailStyle: function (id, isFirst) {
        var p1 = this;
        var o = p1.name;

        switch (id) {
            case 0:
            case '0':
                setStyle(0);
                break;
            case 1:
            case '1':
                setStyle(1);
                break;
            default:
                setStyle(0);
                break;
        }

        function setStyle(id) {
            var obj = $(gConst.listReadMailId + o);
            if (id == 0) {
                El.hide(obj);
                //$(gConst.listReadMailId + "Ifrm_" + o).src = "about:blank";
            }
            else {
                El.show(obj);
                El.show($(gConst.listReadMailId + "Default_" + o));
                El.hide($(gConst.listReadMailId + "Content_" + o));
                //$(gConst.listReadMailId + "Ifrm_" + o).src = "about:blank";
            }
            if (!isFirst && p1.readMailType != id) {
                p1.readMailType = id;
                var data = {
                    func: gConst.func.setAttrs,
                    data: {
                        readmailmode: id
                    },
                    call: function () {
                        gMain.readMailMode = id;
                    }
                };
                MM.mailRequest(data);
                p1.setDivHeight();
            }
        }
    },
    /***
     * 操作邮件
     * @param {Object} id
     * @param {Object} obj
     * @param {Object} url
     * @param {Object} sid
     * @param {Object} text
     */
    optReadMail: function (id, obj, mid, text, param, mi) {
        var p1 = this;
        var o = p1.name;
        switch (id) {
            case "readMail":
                readMail(mid, text, param, mi);
                break;
            case "setTitle":
                setReadMailTitleStyle(obj);
                break;
            case "select":
                setSelectedInfo();
                break;
            default:
                break;
        }
        /***
         * 读信
         * @param {Object} url
         * @param {Object} sid
         * @param {Object} text
         */
        function readMail(mid, text, param, mi) {
            El.hide($(gConst.listReadMailId + "Default_" + o));
            El.show($(gConst.listReadMailId + "Content_" + o));
            var readmailId = "pageReadMail" + o;
            var readmailObj = $(readmailId);

            var callBack = function (au) {
                try {
                    var oTemp = gConst.readMail + mid;
                    CM[oTemp] = au;
                    var data = au["var"];
                    var fid = data.fid;
                    var oTitle = $(gConst.listReadMailId + "Title_" + o);
                    var html = p1.getReadMailData(mid, data);
                    readmailObj.innerHTML = html;
                    oTitle.innerHTML = text.left(gConst.mailSubjectLength, true);
                    $(gConst.listReadMailId + "newLabel_" + o).onclick = function (e) {
                        var text = data.subject;
                        text = text || Lang.Mail.list_ReadingMail;
                        text = text.encodeHTML();
                        CC.goReadMail(mid, text, param, mi);
                        return false;

                    };
                    CC.sendMDN(data.requestReadReceipt, data.readReceipt);
                }
                catch (e) {
                }
                p1.setDivHeight();
            };
            var data = {
                func: gConst.func.readMail,
                data: {
                    mode: "both",
                    filterStylesheets: 0,
                    filterImages: 0,
                    filterLinks: 0,
                    supportTNEF: 0,
                    fileterScripts: 1,
                    filterFrames: 1,
                    markRead: param.markRead,
                    encoding: param.encode || gConst.encode_utf8,
                    mid: mid,
                    fid: param.fid
                },
                call: callBack
            };
            MM.mailRequestApi(data);
        }

        function setSelectedInfo() {
            var et = [];
            var sis = [];
            p1.getSelectValue(et, sis);
            var count = et.length;
            var objIfrm = $(gConst.listReadMailId + "Content_" + o);
            var objDiv = $(gConst.listReadMailId + "Default_" + o);
            El.show(objDiv);
            El.hide(objIfrm);
            if (count == 0) {
                objDiv.innerHTML = "<h2>" + Lang.Mail.list_NoSelectMail + "</h2><p>" + Lang.Mail.list_ClickReadMail + "</p>";
            }
            else {
                objDiv.innerHTML = "<h2>" + Lang.Mail.list_SelectNumberMail.format(count) + "</h2><p>" + Lang.Mail.list_ClickReadMail + "</p>";
            }
        }

        function setReadMailTitleStyle(icon) {
            var mid = p1.mid;
            var id = 'readHeader_table_' + p1.mid;
            var icon1 = $(gConst.listReadMailId + 'Icon_' + o);
            var icon2 = $("icon_" + mid);
            var obj = $(id);
            if (El.visible(obj)) {
                obj.style.display = "none";
                icon1.className = "off";
                icon2.className = "action off";
            }
            else {
                obj.style.display = "";
                icon1.className = "on";
                icon2.className = "action on";
            }
            p1.setDivHeight();
        }
    },
    getReadMailData: function (mid, data) {
        var p1 = this;
        var o = p1.name;
        var html = [];
        var subject = CC.getMailText(data.subject, Lang.Mail.list_noSubject);
        p1.mid = mid;
        var from = (data.account || "").encodeHTML();
        var date = Util.formatDate(new Date(data.sendDate * 1000));
        var to = CC.getMailText(data.to);
        var cc = CC.getMailText(data.cc);
        var attach = data.attachments || [];
        var attachSize = 0, attachName = "";
        var sendUser = Email.getValue(from.decodeHTML());
        var mailContent = CC.getMailContent(data);
        p1.maildata = mailContent;

        html.push("<div id=\"container\">");
        html.push("<div class=\"rmHeader\" id=\"readHeader_{0}\" {1}>".format(o, Browser.isIE ? "style='z-index:-1;'" : ""));
        html.push("<a class=\"action\" id='openwindow_" + mid + "' href=\"javascript:fGoto();\" onclick=\"MM['" + o + "'].openNewFrom();\">" + Lang.Mail.readMail_lb_newwindow + "</a>");
        html.push("<i id=\"icon_" + mid + "\"class=\"action off\" onclick=\"MM['" + o + "\'].optReadMail('setTitle',this);\"></i>");
        html.push("<table cellpadding=\"0\" style=\"height:26px;line-height:26px;\">");
        html.push("<tr>");
        html.push("<th>" + Lang.Mail.readMail_lb_subject + "</th>");
        html.push("<td id=\"tdsubject\" align=\"left\"><h1>" + subject + "</h1></td>");
        html.push("<td class=\"placeHolder\"></td>");
        html.push("</tr>");
        //预留标签显示区域
        // ......
        html.push("</table>");
        html.push("<table id='readHeader_table_" + mid + "' style='display:none;'>");
        html.push("<tr>");
        html.push("<th>" + Lang.Mail.list_Send + "：</th>");
        html.push("<td id='FromUserTr' align=\"left\">" + from + "</td>");
        //html.push("<a id=\"addToContact_"+mid+"\" class=\"addToContact\" href=\"javascript:fGoto();\" onclick=\"MM[\'"+o+"\'].addEmailContact();\">" + Lang.Mail.readMail_lb_addtocontacts + "</a>");
        //html.push("<a href=\"javascript:fGoto();\" onclick=\"MM[\'"+o+"\'].closeSMS();\" class=\"addToScreen\" id=\"closesms_"+mid+"\">" + Lang.Mail.readMail_lb_bt_DiableNotice + "</a>");
        html.push("</td>");
        html.push("<td class=\"placeHolder\"></td>");
        html.push("</tr>");
        html.push("<tr>");
        html.push("<th>" + Lang.Mail.readMail_lb_time + "</th>");
        html.push("<td align=\"left\">" + date + "</td>");
        html.push("<td class=\"placeHolder\"></td>");
        html.push("</tr>");
        html.push("<tr>");
        html.push("<th>" + Lang.Mail.readMail_lb_to + "</th>");
        html.push("<td id='{0}to' align=\"left\" style=\"word-wrap:break-word;\">".format(o) + to + "</td>");
        html.push("<td class=\"placeHolder\"></td>");
        html.push("</tr>");
        if (cc != "") {
            html.push("<tr>");
            html.push("<th>" + Lang.Mail.readMail_lb_cc + "</th>");
            html.push("<td id='{0}cc' align=\"left\">".format(o) + cc + "</td>");
            html.push("<td class=\"placeHolder\"></td>");
            html.push("</tr>");
        }
        html.push("</table>");
        if (attach && attach.length > 0) {
            html.push("<table>");
            html.push("<tr class=\"attach\">");
            html.push("<th>" + Lang.Mail.readMail_lb_attach + "</th>");
            html.push("<td align=\"left\">");
            for (var ia = 0; ia < attach.length; ia++) {
                var aa = attach[ia];
                attachSize = aa.fileRealSize;
                attachSize = Util.formatSize(attachSize, null, 2);
                attachName = aa.fileName || "";
                attachName = attachName.encodeHTML();
                html.push(("<a href=\"" + CC.getDownloadLink(mid, aa.fileOffSet, aa.fileSize, aa.fileName, aa.type, aa.encoding) + "\" {0}><i></i>{1}(<span title=\"{2}\">{2}</span>)</a>").format("", attachName, attachSize));
            }
            if (attach.length > 1) {
                html.push("<a href=\"" + CC.getDownloadsLink(mid) + "\"  style=\"cursor:pointer;\" target=\"_blank\">[" + Lang.Mail.readMail_lb_bt_PackMail + "]</a>".format(o));
            }
            html.push("</td>");
            html.push("<td class=\"placeHolder\"></td>");
            html.push("</tr>");
            html.push("</table>");
        }
        html.push("</table>");
        html.push("</div>");
        p1.readMailHTML = "<div id=\"pageReadMail\">" + html.join("") + "</div>";
        html.push("<div id=\"mailContent\">");
        html.push("<iframe id=\"{0}\" name=\"{0}\" frameborder=\"0\" src=\"{1}?mid={2}&type=1&rnd={3}\" style=\"width:100%;height:100%;\" scrolling=\"auto\"></iframe>".format(gConst.ifrmReadmail + o, gConst.readMailUrl, mid, GC.gRnd()));
        html.push("</div>");
        html.push("</div>");
        return html.join("");
    },
    downloads: function (mid) {
        var oTemp = gConst.readMail + this.mid;
        var data = CM[oTemp]["var"];
        var attachData = data.attachments;
        var attachName = (data.subject || Lang.Mail.list_noSubject);
        if (attachData) {
            CC.downloads(attachData, attachName, this.mid);
        }
    },
    optReadMailMenu: function (id) {
        var p1 = this;
        var o = p1.name;
        var ev = EV.getEvent();
        var objTarget = EV.getTarget(ev);
        var obj = objTarget.parentNode;
        var pObjM = GE.cToolbar;
        var mid = p1.mid;
        //修复ie下的菜单隐藏的bug。
        if (pObjM) {
            El.hide(pObjM);
        }
        switch (id) {
            case "rm_rpl":
                goCompose(gConst.func.reply, mid, Lang.Mail.tb_ReplyMail);
                break;
            case "rm_rpla":
                goCompose(gConst.func.replyAll, mid, Lang.Mail.tb_ReplyAll);
                break;
            case "rm_fwd":
                p1.doMenu(o, "FORWARD", {
                    text: Lang.Mail.tb_Forward
                });
                break;
            case "rm_blacklist":
                p1.doMenu(o, "BLACKLIST", {
                    text: Lang.Mail.tb_RefuseSend
                });
                break;
            case "rm_filter":
                p1.doMenu(o, "FILTER", {
                    text: Lang.Mail.tb_filter
                });
                break;
            case "replymenu":
                createReadMailMenu("reply");
                break;
            case "refusemenu":
                createReadMailMenu("refuse");
                break;
            default:
                break;
        }

        function createReadMailMenu(n) {
            var objMenu = {
                id: "readMail_" + id,
                name: "readMail" + id
            };
            var objSubMenu = p1.getReadMailToolbarMenu(n);
            CC.getMenu(objMenu, objSubMenu, null, ev);
        }

        function goCompose(m, mailid, fname) {
            var url = CC.getComposeUrl('&funcid=' + m + '&mid=' + mailid);
            CC.goCompose(url, 'compose_' + mailid, fname);
        }
    },
    openNewFrom: function () {
        var mid = this.mid;
        var otype = gConst.readMail + mid;
        var url = gConst.mailPrintUrl + "&mid=" + otype + "&t=open&" + Math.random();
        window.open(url);
    },
    showRemark: function (mid, obj) {
        var o = this.name;
        var left = El.getX(obj) - 210;
        var top = El.getY(obj) - 160;
        var html = [];

        //html.push('<div  id="fremark"   class="tips write-tips" style="width:300px;margin-left:-20px;" >');
        html.push('<div  id="fremark"   class="tips write-tips" style="width:300px;" >');
        html.push('<div class="tips-text"><div id="recepitent_tips_content">');
        html.push(' <div class="mail_mark_wrap"><i></i><h4>' + Lang.Mail.readMail_addnote + '</h4>');
        html.push('<p id="remarkContent" style="font-weight: normal;"></p>')
        html.push('</div></div></div><div class="tipsTop diamond"></div></div>');

        if (!document.getElementById("fremark")) {
            jQuery(obj).parents('.subject').append(html.join(""));
            //jQuery(obj.parentNode).append(html.join(""));
            //jQuery(obj).parents('.subject').css("overflow","auto");
            //jQuery("td .subject").css("overflow","auto")
            jQuery("#fremark").bind('mouseleave', function () {
                MM[o].hideRemark(document.getElementById("fremark", null));
            });

            jQuery("#tagText_" + mid).bind('mouseleave', function (e) {
                MM[o].hideRemark(document.getElementById("fremark", null));
            });


            var callBack = function (data) {
                if (data.code == "S_OK") {
                    var fremark = document.getElementById("remarkContent");
                    var rem = data["var"].memo;

                    if (fremark) {
                        fremark.innerHTML = rem.encodeHTML();

                    }
                }
            }
            var data = {
                func: "mbox:mailMemo",
                data: {
                    opType: "get",
                    mid: mid,
                    memo: ""
                },
                call: callBack
            };
            MM.mailRequestApi(data);
        }
        /* html.push('<div id=\"fremark\"  onmouseout=\"MM[\'' + o + '\'].hideRemark(this,event)\"  class=\"pop_tips\">');
         html.push("<div class=\"pop_box\"></div>");
         html.push("<table height=\"60\" border=\"0\">");
         html.push("<tbody><tr>");
         html.push("<td width=\"30\" style=\"text-align:center;vertical-align:middle;\"><i class=\"i_doc\"></i></td>");
         html.push("<td valign=\"top\" style=\"padding-left:5px;line-height:16px;\">");
         html.push("<div style=\"FONT-SIZE: 12px\"></br>");
         html.push("<h2 style=\"text-align:left; font-weight:bold;\">" + Lang.Mail.readMail_addnote + "</h2>");
         html.push("<p style=\"text-align:left;word-break:break-all;overflow:hidden;width:320px\" id=\"remarkContent\"></p></div>");
         html.push("<span style=\"float: right;\">");
         html.push("</span>");
         html.push("</td></tr></tbody></table></div>");

         var body = document.getElementsByTagName("body")[0];
         var div = document.createElement("div");
         div.setAttribute("id", "divRemark");
         div.setAttribute("style","border:1px solid #C9CDD8");
         body.appendChild(div);
         document.getElementById("divRemark").innerHTML = html.join("");

         var divContiner = document.getElementById("divRemark");
         divContiner.style.left = left + "px";
         divContiner.style.top = top + "px";

         El.setStyle(div, {
         position: "absolute"
         });*/


    },

    hideRemark: function (obj, e) {

        var ev = EV.getEvent();
        var target = EV.getTarget(ev, true);
        var up = El.getParentNodeIsTag(target, "tr");
        if (!up)
            return;
        if (up.className == "overColor") {
            up.className = "";
        }
        var divRemark = document.getElementById("fremark");
        if (divRemark) {

            jQuery(divRemark).parents('.subject').css("overflow", "hidden");
            divRemark.parentNode.removeChild(divRemark);
            //alert(jQuery("td .subject").html());
            //jQuery("td .subject").css("overflow","hidden");
        }
    },
    delRemark: function (mid) {
        var callBack = function () {
            if (data.code == "S_OK") {
                this.hideRemark();
            }
        }
        var data = {
            func: "mbox:mailMemo",
            data: {
                opType: "delete",
                mid: mid,
                memo: ""
            },
            call: callBack
        };
        MM.mailRequestApi(data);
    },
    fStarFlag: function (mid, ty) {
        var o = this.name;
        var me = this;

        var callBack = function (data) {
            if (data.code == "S_OK") {
                var astatFlag = document.getElementById("aStarFlag_" + mid);
                if (ty == 1) {
                    El.setClass(astatFlag, "qm_ico_flagon");
                    El.setAttr(astatFlag, {
                        title: Lang.Mail.haveStar
                    });
                    astatFlag.onclick = function () {
                        MM[o].fStarFlag(mid, 0);
                    };
                }
                else {
                    El.setClass(astatFlag, "qm_ico_flagoff");
                    El.setAttr(astatFlag, {
                        title: Lang.Mail.noStar
                    });
                    astatFlag.onclick = function () {
                        MM[o].fStarFlag(mid, 1);
                    };
                }
                me.refresh();
            }
        };
        var data = {
            func: "mbox:updateMessagesStatus",
            data: {
                type: "starFlag",
                value: ty,
                ids: [mid]
            },
            call: callBack
        };
        MM.mailRequest(data);
        //EV.stopEvent();
    },

    showTipsSuccess: function (msg) {
        var t = setInterval(function () {
            if (jQuery("#tipsfinish").html() == "" || !$("loading_ajax")) {
                CC.showMsg(msg, true, false, "option");
                clearInterval(t);
            }
        }, 50);
    },
    downloadEmail: function (midList, sessionIds) {
        var selMid = "";
        for (var i = 0; i < midList.length; i++) {
            selMid += "<string>" + midList[i] + "</string>";
        }
        var downloadObj =
        {
            "formName": "downloadEamil",
            "url": gMain.rmSvr + "/RmWeb/mail?func=mbox:downloadMessages&sid=" + gMain.sid,
            "inputName": "downloadDate",
            "data": "<object><array name=\"ids\">" + selMid + "</array></object>",
            "iframeName": "downloadEmailIframe"
        };
        if (sessionIds && this.fid == 1 && gMain.sessionMode && gMain.sessionMode == 1) {
            var sessionIdList = "";
            for (var j = 0; j < sessionIds.length; j++) {
                sessionIdList += "<int>" + sessionIds[j] + "</int>";
            }
            downloadObj.data = "<object><array name=\"sessionIds\">" + sessionIdList + "</array></object>";
        }
        Util.ajaxForm(downloadObj);
    },
    loadMailFileHtml: function () {
        var p = this;
        this.dropFileType_Time = new DropSelect({
            id: "dropFileType_Time",
            data: [
                {text: Lang.Mail.mailFileTime_month.format("1"), value: '1'},
                {text: Lang.Mail.mailFileTime_month.format("2"), value: '2'},
                {text: Lang.Mail.mailFileTime_month.format("3"), value: '3'},
                {text: Lang.Mail.mailFileTime_month.format("6"), value: '6'},
                {text: Lang.Mail.mailFileTime_year.format("1"), value: '12'},
                {text: Lang.Mail.mailFileTime_year.format("2"), value: '24'}
            ],
            width: 130,
            height: 200
        });
        this.dropFileType_count = new DropSelect({
            id: "dropFileType_count",
            data: [
                {text: Lang.Mail.mailFileOldCount.format("10000"), value: '10000'},
                {text: Lang.Mail.mailFileOldCount.format("5000"), value: '5000'},
                {text: Lang.Mail.mailFileOldCount.format("1000"), value: '1000'},
                {text: Lang.Mail.mailFileOldCount.format("500"), value: '500'}
            ],
            width: 130,
            height: 200
        });
        var tempHtml = '<div class="place-fliewrap"><div class="place-flie"><div class="place-flie-lt">' + Lang.Mail.selectMailFileType + '</div>'
            + '<div class="place-flie-rt"><div class="pb_5">'
            + '<input type="radio" checked id="rdiFileTime" name="chkmaiFileType" class="set-radio">' + Lang.Mail.MailFileTimeTitle
            + '<span class="ml_5" style="display:inline-block;">'
            + this.dropFileType_Time.getHTML()
            + '</span></div>'
            + '<div class="pb_5">'
            + '<input type="radio" name="chkmaiFileType" class="set-radio">' + Lang.Mail.MailFileCountTitle
            + '<span class="ml_5" style="display:inline-block;">'
            + this.dropFileType_count.getHTML()
            + '</span></div></div></div>'
            + '<div class="place-flie">'
            + '<div class="place-flie-lt">' + Lang.Mail.mailFileSavePath + '</div>'
            + ' <div class="place-flie-rt">'
            + '<input style="width:215px;color:#000" type="text" maxlength="14" value="存档[' + new Date().format("yyyy.mm") + ']" id="mailFileName" class="set-mand-txt"></div></div></div>';
        CC.showDiv(tempHtml, this.startMailFile, Lang.Mail.mailFile, null, null, 388);
        this.dropFileType_Time.loadEvent();
        this.dropFileType_count.loadEvent();
    },
    startMailFile: function () {
        var p = this;
        var mailFileName = jQuery("#mailFileName").val().trim();
        var tip = new ToolTips({
            id: 'txtNewFolderName_error',
            direction: ToolTips.direction.Bottom,
            left: "150px",
            top: "70px"
        });
        if ((!mailFileName.checkSpecialChar()) || (new RegExp("[\~\！\#\￥\%\……\&\*\（\）\=\+\{\}\；\‘\：\“\，\？\/\<\>\;]", "ig")).test(mailFileName)) {
            //tip.show($("txtNewFolderName"), Lang.Mail.folder_NotInputChar);
            tip.show($("mailFileName"), Lang.Mail.Write.cannotInputTips);
            $("mailFileName").focus();
            return true;
        }
        if (mailFileName == Lang.Mail.folder_MyFolder || mailFileName === Lang.Mail.fax.dsyjj ) {
            tip.show($("mailFileName"), Lang.Mail.folder_NameExist);
            $("mailFileName").focus();
            return true;
        }
        var fl = gConst.folderLength * 2;
        if (mailFileName.len() > fl) {
            tip.show($("mailFileName"), Lang.Mail.folder_FolderLength.format(fl, gConst.folderLength));
            $("mailFileName").focus();
            return true;
        }
        CC.showMsg(Lang.Mail.mailFileLoading + ",", false);
        var olderNum = parseInt(MM["sys1"].dropFileType_count.getValue());
        var oldEndDate = parseInt(MM["sys1"].dropFileType_Time.getValue());
        var isSelectTime = jQuery("#rdiFileTime").is(":checked");
        //jQuery("#divDialogCloseconfirm").click();
        var folders = CM.folderMain[gConst.dataName];
        var newFid = "";
        for (var i = 0; i < folders.length; i++) {
            if (folders[i].name == mailFileName) {
                newFid = folders[i].fid;
                break;
            }
        }
        if (newFid) {
            mailFile(folders[i].fid)
        }
        else {
            //创建归档邮件夹,得到归档邮件夹ID
            var location = 10000;
            if (MM.folderMain.Folders.user.length > 0) {
                location = MM.folderMain.Folders.user[MM.folderMain.Folders.user.length - 1].location + 1;
            }
            var postData = {
                func: gConst.func.createFolder,
                data: {
                    'parentId': 0,
                    'type': 3,
                    'location': location,
                    'name': mailFileName,
                    pop3Flag: 0
                },
                call: function (data) {
                    mailFile(data["var"]);
                    MM.folderMain.refresh();
                }
            }
            MM.mailRequest(postData);
        }
        //开始归档
        function mailFile(fid) {
            var archiveType = 0;
            var endDate = new Date().getTime();
            if (!isSelectTime) {
                archiveType = 1;
            } else {
                endDate = new Date().addMonth(-oldEndDate).getTime();
                endDate = parseInt(endDate / 1000);
            }
            var reqData = {
                func: gConst.func.mailFile,
                data: {
                    "type": 2,
                    "archiveType": archiveType,
                    "olderNum": olderNum,
                    "srcFolderId": 1,
                    "desFolderId": fid,
                    "startDate": 0,
                    "endDate": endDate,
                    "keepNum": 0
                },
                call: function (data) {
                    CC.hideMsg();
                    var tips = '<div class="place-fliewrap"><div class="file-reback-suceess"><h3>' + Lang.Mail.mailFileSuccess + '</h3><p class="">' + Lang.Mail.mailFileSaveTitle.format(data["var"].totalNum, '<strong class="fw_b">' + mailFileName + '</strong>') + '</p></div></div>';
                    CC.alertTips(tips);
                    jQuery("#span_1").click();
                }
            }
            MM.mailRequestApi(reqData);
        }
    },
    getCloseInBarHtml: function (stats) {
        var html = "",
            len = 0,
            i = 0;
        names = [],
            folders = [],
            during = [];

        html += "<div id=\"boxCloseInBar\" style=\"background-color: #ffffff; right: 0px; top:-1px;\" class=\"close-search pb_10\">";
        html += "<a id=\"btnCloseInBar\" title=\""+Lang.Mail.fax.hideS +"\" href=\"javascript:;\" class=\"tx-tr\" style=\"right:206px; top:39px;\"><i></i></a>";
        html += "<div class=\"close-search-hd p_relative\">";
        html += ""+Lang.Mail.fax.flcz +"（<em>" + stats.messageCount + "</em>）";
        html += "<i class=\"triangle-bg\"></i>";
        html += "</div>";
        html += "<div class=\"close-search-bd\">";

        if (!jQuery.isEmptyObject(GE.approachSearchData)) {
            html += "<dl id=\"boxCheckedList\">";
            html += "<dd>";
            html += "<ul>";
            if (GE.approachSearchData.from !== undefined) {
                html += "<li data=\"from\" class=\"p_relative\">";
                html += "<a href=\"#\"><span class=\"max-ft\" style=\"_width:140px;\">" + GE.approachSearchData.from + "</span>";
                html += "</a>";
                html += "<i style=\"right:4px; top:7px;\" class=\"i-fakeTxt-close\"></i>";
                html += "</li>";
                len++;
            }
            if (GE.approachSearchData.fid !== undefined) {
                html += "<li data=\"fid\" class=\"p_relative\">";
                html += "<a href=\"#\"><span class=\"max-ft\" style=\"_width:140px;\">" + GE.approachSearchTempFolderName + "</span>";
                html += "</a>";
                html += "<i style=\"right:4px; top:7px;\" class=\"i-fakeTxt-close\"></i>";
                html += "</li>";
                len++;
            }
            if (GE.approachSearchData.during !== undefined) {
                html += "<li data=\"during\" class=\"p_relative\">";
                html += "<a href=\"#\"><span class=\"max-ft\" style=\"_width:140px;\">" + GE.approachSearchTempDuring + "</span>";
                html += "</a>";
                html += "<i style=\"right:4px; top:7px;\" class=\"i-fakeTxt-close\"></i>";
                html += "</li>";
                len++;
            }
            if (GE.approachSearchData.attached !== undefined) {
                html += "<li data=\"attached\" class=\"p_relative\">";
                html += "<a href=\"#\"><span class=\"max-ft\" style=\"_width:140px;\">" + GE.approachSearchTempAttach + "</span>";
                html += "</a>";
                html += "<i style=\"right:4px; top:7px;\" class=\"i-fakeTxt-close\"></i>";
                html += "</li>";
                len++;
            }
            html += "</ul>";
            if (len > 1) {
                html += "<div class=\"see-all-cont\"><a href=\"#\" class=\"see-all btn-see-cancel\"><span>全部取消</span></a></div>";
            }
            html += "</dd>";
            html += "</dl>";
        }

        if (GE.approachSearchData.from === undefined) {
            names = stats.fromStats;
            len = names.length;

            html += "<dl id=\"boxSenderList\">";
            html += "<dt>"+Lang.Mail.fax.afjr +"</dt>";
            html += "<dd>";
            html += "<ul>";
            for (i = 0; i < len; i++) {
                html += "<li data=\"" + names[i].from + "\"";
                if (i > 3) {
                    html += " style=\"display: none;\"";
                }
                html += "><a href=\"#\"><span class=\"max-ft\" style=\"_width:140px;\">" + names[i].from + "</span><span>(" + names[i].count + ")</span></a></li>";
            }

            html += "</ul>";
            if (len > 4) {
                html += "<div class=\"see-all-cont\"><span class=\"see-all btn-see-more\"><span>"+Lang.Mail.fax.showall +"</span><i class=\"i-c i_2trid_down ml_5\" style=\"margin-top:-2px;\"></i></span></div>";
            }
            html += "</dd>";
            html += "</dl>";
        }

        if (GE.approachSearchData.fid === undefined) {
            folders = stats.folders;
            len = folders.length;

            html += "<dl id=\"boxFolderList\">";
            html += "<dt>"+Lang.Mail.fax.aszwjj +"</dt>";
            html += "<dd>";
            html += "<ul>";
            for (i = 0; i < len; i++) {
                html += "<li data=\"" + folders[i].fid + "\"";
                if (i > 3) {
                    html += " style=\"display: none;\"";
                }
                html += "><a href=\"#\" title=\"" + folders[i].folderName + "\"><span class=\"max-ft\">" + folders[i].folderName + "</span><span>(" + folders[i].count + ")</span></a></li>";
            }
            html += "</ul>";
            if (len > 4) {
                html += "<div class=\"see-all-cont\"><span class=\"see-all btn-see-more\"><span>"+Lang.Mail.fax.showall +"</span><i class=\"i-c i_2trid_down ml_5\" style=\"margin-top:-2px;\"></i></span></div>";
            }
            html += "</dd>";
            html += "</dl>";
        }

        if (GE.approachSearchData.during === undefined) {
            during = stats.during;
            len = during.length;
            html += "<dl id=\"boxDuringList\">";
            html += "<dt>"+Lang.Mail.fax.asjfw +"</dt>";
            html += "<dd>";
            html += "<ul>";
            for (i = 0; i < len; i++) {
                html += "<li data=\"" + during[i].during + "\"";
                if (i > 3) {
                    html += " style=\"display: none;\"";
                }
                html += "><a href=\"#\" title=\"" + during[i].name + "\"><span class=\"max-ft\">" + during[i].name + "</span><span>(" + during[i].count + ")</span></a></li>";
            }
            html += "</ul>";
            if (len > 4) {
                html += "<div class=\"see-all-cont\"><span class=\"see-all btn-see-more\"><span>"+Lang.Mail.fax.showall +"</span><i class=\"i-c i_2trid_down ml_5\" style=\"margin-top:-2px;\"></i></span></div>";
            }
            html += "</dd>";
            html += "</dl>";
        }

        if (GE.approachSearchData.attached === undefined) {
            html += "<dl id=\"boxAttachList\">";
            html += "<dt>"+Lang.Mail.fax.afjlx +"</dt>";
            html += "<dd>";
            html += "<ul>";
            if (stats.attachMessageCount > 0) {
                html += "<li data=\"1\"><a href=\"#\" title=\""+Lang.Mail.fax.dfj +"\"><span class=\"max-ft\">"+Lang.Mail.fax.dfj +"</span><span>(" + stats.attachMessageCount + ")</span></a></li>";
            }
            if ((stats.messageCount - stats.attachMessageCount) > 0) {
                html += "<li data=\"0\"><a href=\"#\" title=\""+Lang.Mail.fax.bdfj +"\"><span class=\"max-ft\">"+Lang.Mail.fax.bdfj +"</span><span>(" + (stats.messageCount - stats.attachMessageCount) + ")</span></a></li>";
            }
            html += "</ul>";
            html += "</dd>";
            html += "</dl>";
        }

        html += "</div>";
        html += "</div>"

        return html;
    },
    bindCloseInBarEvent: function ($) {
        $("#btnCloseInBar").on("click", function () {
            var cls = $(this).hasClass("tx-tr");

            if (cls) {
                $("#boxCloseInBar").animate({"right": "-191px"});
                $(this).removeClass("tx-tr").addClass("tx-tl").attr("title", Lang.Mail.fax.showS ); //"展开分类搜索"
            } else {
                $("#boxCloseInBar").animate({"right": "0px"});
                $(this).removeClass("tx-tl").addClass("tx-tr").attr("title",Lang.Mail.fax.hideS ); //"隐藏分类搜索"
            }
        });

        $("#boxCheckedList .i-fakeTxt-close").click(function () {
            var item = $(this).parent().attr("data");

            delete GE.approachSearchData[item];
            CC.approachSearch(1);
        });

        $("#boxCheckedList .btn-see-cancel").click(function () {
            GE.approachSearchData = {};
            CC.approachSearch(1);
        });


        $("#boxSenderList li").click(function () {
            var data = $(this).attr("data");

            GE.approachSearchData.from = data;
            CC.approachSearch();
        });

        $("#boxFolderList li").click(function () {
            var data = $(this).attr("data");

            GE.approachSearchData.fid = ~~data;
            GE.approachSearchTempFolderName = $(this).find("a").attr("title");
            CC.approachSearch();
        });

        $("#boxDuringList li").click(function () {
            var data = $(this).attr("data");

            GE.approachSearchData.during = ~~data;
            GE.approachSearchTempDuring = $(this).find("a").attr("title");
            CC.approachSearch();
        });

        $("#boxAttachList li").click(function () {
            var data = $(this).attr("data");

            GE.approachSearchData.attached = ~~data;
            GE.approachSearchTempAttach = $(this).find("a").attr("title");
            CC.approachSearch();
        });

        $("#boxCloseInBar .btn-see-more").click(function () {
            var unfold = $(this).attr("unfold");

            if (unfold === "true") {
                $(this).children("span").html(Lang.Mail.fax.showall ); //显示全部
                $(this).parent().siblings("ul").find("li:gt(3)").hide();
                $(this).removeAttr("unfold").children("i").addClass("i_2trid_down").removeClass("i_2trid_up");
            } else {
                $(this).children("span").html(Lang.Mail.fax.showpart); ///"只显示部分项"
                $(this).parent().siblings("ul").children().show();
                $(this).attr("unfold", "true").children("i").addClass("i_2trid_up").removeClass("i_2trid_down");
                ;
            }
        });
    }
};