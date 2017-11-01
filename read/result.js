myFolder = [];
/**
 * 菜单操作类
 */
 var LM = {
    //afjla"哈哈"
    /*
     aaa"哈哈哈
    */
    FIDS: ["search", "inbox", "drafts", "sent", "del", "spam", "virus"],
    folders: [],
    selectFolderId: (GC.check("MAIL_WELCOME") ? -10 : 0),
    loadService: function () {
        try {
            try {
                GE.oLinks = leftMenu_data;
                LM.serviceCallback();
            } catch (exp) {
                ch("LM.loadService.callback", exp);
            }
        } catch (e) {
            ch("LM.loadService", e);
        }
    },
    serviceCallback: function () {
        loadLink(GE.oLinks.order["other"], $(gConst.menuC.service));
        var ht_sms = GE.oLinks.order["sms"];
        if (ht_sms.length > 0 && !GC.checkModule(GC.module.sms)) {
            loadLink(ht_sms, $(gConst.menuC.sms));
        } else {
            $(gConst.menuT.sms).style.display = "none";
        }

        var ht_mms = GE.oLinks.order["mms"];
        if (ht_mms.length > 0 && !GC.checkModule(GC.module.mms)) {
            loadLink(ht_mms, $(gConst.menuC.mms));
        } else {
            $(gConst.menuT.mms).style.display = "none";
        }

        var ht_fax = GE.oLinks.order["fax"];
        if (ht_fax.length > 0 && !GC.checkModule(GC.module.fax)) {
            loadLink(ht_fax, $(gConst.menuC.fax));
        } else {
            $(gConst.menuT.fax).style.display = "hahhahahha";
        }

        function loadLink(ol, us) {
            El.removeChildNodes(us);
            ol.each(function (i, bb) {
                var of = GE.oLinks.service[bb];
                if (of) {
                    var d = GC.userNumber.substring(GC.userNumber.indexOf("@") + 1);
                    var flag = (us.id == "ulService" && bb != "otheraddr");
                    if (!flag) {
                        addLink(of, us);
                    }
                }
            });
        }

        function addLink(cm, us) {
            //var p = LM.addLink(cm.id, cm.text, cm.icon, cm.url, cm.isoutlink, cm.isnewwin, cm.isred, cm.isbold, cm.isSubmenu, (cm.submenu.length > 0), cm.attr, cm.attrclick, us);
            var p = LM.addLink({
                id: cm.id,
                text: cm.text,
                url: cm.url,
                isoutlink: cm.isoutlink,
                isnewwin: cm.isnewwin,
                isbold: cm.isbold,
                isred: cm.isred,
                hasSub: (cm.submenu.length > 0) ? true : false,
                parentNode: us,
                attr: {
                    text: cm.attr,
                    call: cm.attrclick
                }
            }, {
                li: cm.icon
            }, us);
            for (var i = 0, l = cm.submenu.length; i < l; i++) {
                var sb = cm.submenu[i];
                if (i + 1 == l) {
                    sb.icon = "last";
                } else {
                    sb.icon = "";
                }
                LM.addLink({
                    id: sb.id,
                    text: sb.text,
                    url: sb.url,
                    isoutlink: sb.isoutlink,
                    isnewwin: sb.isnewwin,
                    isred: sb.isred,
                    isbold: sb.isbold,
                    hasSub: (cm.submenu.length > 0),
                    attr: {
                        text: sb.attr,
                        attrclick: sb.atrclick
                    }
                }, {
                    li: sb.icon
                }, p);
            }
        }

    },
    /**
     * 让ie重新渲染页面
     */
     reRender: function () {
        document.body.style.zoom = 1.1;
        document.body.style.zoom = '';
    },
    // cm.id,cm.text,cm.icon,cm.url,cm.isoutlink,cm.isnewwin,cm.isred,cm.isbold,cm.submenu,cm.attr, cm.attrclick
    //id, text, icon, url, isoutlink, isnewwin, isred, isbold, hasSub


    /**
     *加载侧边栏的html 
     *包括自定义的一些标签
     */
     addLink: function (node, icon, isEnd, index) {
        var id = node.id, text = node.text, url = node.url, isoutlink = node.isoutlink;
        var isnewwin = node.isnewwin, isred = node.isred, isbold = node.isbold, hasSub = node.hasSub;
        var action = node.action, actionClick = node.actionClick, pn = node.parentNode, attr = node.attr;
        var liIcon = icon.li, iIcon = icon.i, aIcon = icon.a;
        var pos = node.pos || 'after';
        var evts = node.evts;
        var actionClass = attr.actionClass || '';
        var passFlag = node.passFlag;      //是否存在加锁邮件夹
        var subUl = null, objLi_a = null, objLi_icon = null, objLi_color = null;
        var objLi = El.createElement("li");

        var p1 = this;
        objLi.id = id;
        if (!hasSub && liIcon) {
            objLi.className = liIcon;
        } else if (isEnd) {
            objLi.className = "last";
        } else if (id < 0) {
            //objLi.className = "folderOn";
            if (id < -1000) {
                objLi.className = "line";
            }
        } else if (hasSub) {
            objLi.className = "folderSub";
        }
        if (id == 0 || node.type < 3) {
            objLi.onmouseout = function () {
                El.removeClass(this, "mailFolderListColor");
            }
            objLi.onmouseover = function () {
                if (this.className.indexOf("selectFolder_li") == -1) {
                    El.addClass(this, "mailFolderListColor");
                }
            }
            objLi.onclick = function () {
                LM.selectFolderId = this.id;
            }
            if (id == LM.selectFolderId) {
                objLi.className = objLi.className + " selectFolder_li";
            }
        }

        var isCreateIcon = ((id < 0 && id > -1000) || hasSub);
        if (isCreateIcon) {
            objLi_icon = El.createElement("i");
            objLi_icon.title = Lang.Mail.Hide;
            objLi_icon.className = (id < 0 ? "i-folderOff" : "i-folderOn");
            objLi_icon.style.left = (18 + (12 * index)) + "px";
            objLi_icon.onmouseover = function () {
                if (jQuery(this).next()[0].className.indexOf("selectFolder_li") == -1) {
                    jQuery(this).next().addClass("mailFolderListColor");
                }
            }
            objLi.appendChild(objLi_icon);
        }

        if (node.type == 3 || node.type == 5 || node.type === 6 || id == -1 || id == -2 || id === -6) {
            index = index || 0;
            objLi_a = El.createElement("span");
            objLi_a.className = "mailFolder-span tf";
            if (LM.selectFolderId == id) {
                objLi_a.className = "mailFolder-span tf selectFolder_li";
            }
            if (id == -1 || id == -2 || id === -6)
                objLi_a.style.paddingLeft = "22px";
            else {
                if (node.type == 5) {
                    objLi_a.style.paddingLeft = "22px";
                } else {
                    objLi_a.style.paddingLeft = (33 + (14 * index)) + "px";
                }
            }

            objLi_a.onmouseout = function () {
                El.removeClass(this, "mailFolderListColor");
            }
            objLi_a.onmouseover = function () {
                if (this.className.indexOf("selectFolder_li") == -1) {
                    El.addClass(this, "mailFolderListColor");
                }
            }

        }
        else {
            objLi_a = El.createElement("span");
        }
        objLi_a.title = text.decodeHTML();
        objLi_a.href = "javascript:fGoto();";
        objLi_a.id = "span_" + id;

        var iconHtml = "";
        switch (node.id) {
            case 9999997 : // 敏感邮件icon图标
            iconHtml = "<i class='m20 mr_5'></i>";
            break;
            case 9999996 : // 星标邮件标签icon图标
            iconHtml = "<i class='qm_ico_Lstar mr_5'></i>";
            break;
            default:
            iconHtml = (node.type == 5 ? "<i class='i-colorsquare mr_5 " + gConst.labelColor[node.folderColor] + "'></i>" : "");
            break;
        }
        objLi_a.innerHTML = iconHtml + "<span class='tf' style=\"display: inline-block;" + ((node.type === 6 && /msie 6/i.test(navigator.userAgent) && CC.countStrlength(text) > 80) ? "width: 80px;" : "") + "vertical-align: middle;max-width: 80px;\">" + text.encodeHTML() + "</span>";
        //我的邮件夹和我的标签右键菜单注册
        if (id == "-1" || id == "-2") {
            EV.observe(objLi_a, "contextmenu", function (e) {
                LM.selectFolderId = jQuery(objLi_a).parent()[0].id;
                initContexMenu(e, id);
            }, false);
        }

        if (typeof(gMain.hasPassFlag) == "undefined") {
            if (passFlag) {
                gMain.hasPassFlag = true;  //给附件管理页面判断是否加锁
            }
        }

        if (typeof(gMain.lock_close) == "undefined") {
            gMain.lock_close = true;           //开始锁没有开通,默认关闭
        }

        //如果当前邮件夹是加锁邮件夹， 里面又有未读邮件，则做一个标示
        if (node.status && node.status.unreadMessageCount) {
            if (passFlag && parseInt(node.status.unreadMessageCount) > 0) {
                gMain.hasLock_unReadMail = true;
            }
        }

        //通过 getAllFolders接口，得到所有文件夹信息，如果某个文件夹的passFlag为一，说明这个文件夹是加锁的
        if (passFlag && gMain.lock_close) {
            var lock_img = El.createElement("a")
            lock_img.className = "add lockico";
            objLi.appendChild(lock_img);

            gMain.first_locked_id = id;
            //gMain.hasPassFlag = true;          //给附件管理页面判断是否加锁
            //gMain.lock_close = true;           //开始锁没有开通
        }
        if (hasSub && aIcon) {
            objLi_a.className = aIcon + " mailFolder-span";
        }
        else {
            objLi_a.className = objLi_a.className + " leftFolder-FolderName";
        }
        //objLi_a.innerHTML = text;
        if (text == Lang.Mail.folder_MyFolder || text == Lang.Mail.label_MyLabel || text === Lang.Mail.ConfigJs.popMailFolder) {
            objLi_icon.title = Lang.Mail.Show;
            objLi_icon.style.left = "7px";
            var folders = CM.folderMain[gConst.dataName];
            var unreadMessageCount = 0;
            var allMessageCount = 0;
            var hasChild = false;
            for (var z = 0; z < folders.length; z++) {
                var cur = folders[z];
                if (cur.fid > 9 && ((text == Lang.Mail.folder_MyFolder && cur.type == 3) || (text == Lang.Mail.label_MyLabel && cur.type == 5) || (text == Lang.Mail.ConfigJs.popMailFolder && cur.type === 6))) {
                    hasChild = true;
                    unreadMessageCount += cur.stats.unreadMessageCount;
                    allMessageCount += cur.stats.messageCount;
                }
            }
            if (!hasChild)
                objLi_icon.style.display = "none";
            if (unreadMessageCount > 0)
                objLi_a.innerHTML = "<span class=\"tag_txt\">" + text + "</span><span class=\"count\" style=\"display: inline-block;vertical-align : middle;\" id='myMailFoderCount_span'><a title=\"" + Lang.Mail.unreadmailCount_AllCount.format(unreadMessageCount, allMessageCount) + "\"  style=\"display:inline-block;vertical-align:middle;padding-left:5px;font-weight:bold\">(<em id='myMailFoderCount'>" + unreadMessageCount + "</em>)</a></span>";
            //unreadMessageCount+"/"+allMessageCount
            objLi_a.onclick = function () {
                LM.showOrHiddenMyLabel(subUl, objLi_icon, objLi);
                /*
                 var isshow = (subUl.style.display == "none");
                 objLi_icon.title = isshow ? Lang.Mail.Hide : Lang.Mail.Show;
                 objLi_icon.className =( isshow ? "i-folderOn" : "i-folderOff");
                 subUl.style.display = ( isshow ? "" : "none");
                 if(isshow)
                 {
                 myFolder[objLi.id]="show";
                 }
                 else
                 {
                 myFolder[objLi.id]="enable";
                 }
                 //让ie重新渲染页面
                 p1.reRender();
                 EV.stopEvent();
                 */
             };
         }
         else if (typeof (url) == "function") {
            //objLi_a.onclick = url;
            objLi_a.onclick = function () {
                if (passFlag && gMain.lock_close) {
                    var o = {};
                    o.obj = jQuery("#" + LM.selectFolderId);
                    o.p = this;
                    o.id = id;
                    o.url = url;
                    folderlock.unlocked(0, "leftLock", o);          //跳到安全锁页面 lock.js 解锁

                } else {
                    jQuery("#" + LM.selectFolderId).removeClass("selectFolder_li");
                    LM.selectFolderId = jQuery(this).parent()[0].id;
                    if (id == 0) {
                        LM.selectFolderId = 0;
                        jQuery("#0").attr("class", "selectFolder_li");
                    }
                    url();
                }

                //MM.goTo("sys0", "refresh", 0);
            }

            EV.observe(objLi_a, "contextmenu", function (e) {
                LM.selectFolderId = objLi_a.parentNode.getAttribute("id");
                var parentId = objLi_a.parentNode.parentNode.getAttribute("id");
                var allFolders = CM.folderMain[gConst.dataName];
                if (allFolders && allFolders.length > 0) {
                    for (var i = 0; i < allFolders.length; i++) {
                        if (LM.selectFolderId == allFolders[i].fid) {
                            if (parentId != "leftFolderContainer_-6") {
                                initContexMenu(e, parentId);
                            }
                        }
                    }
                }
            }, false);

        } else if (url.trim() != "") {
            if (isoutlink) {
                objLi_a.onclick = function () {
                    MM.goOutLink(replaceurl(url.trim()), id, text);
                    return false;
                };
            } else {
                objLi_a.onclick = function () {
                    eval(url.trim());
                    GE.currentFolder = id;
                };
            }
        }
        if (isnewwin) {
            objLi_a.target = "id";
            objLi_a.onclick = function () {
                EV.stopPropagation();
            };
            objLi_a.href = replaceurl(url.trim());
        }

        if (isred) {
            El.setStyle(objLi_a, {
                color: "red"
            });
        }
        if (isbold) {
            El.setStyle(objLi_a, {
                fontWeight: "bold"
            });
        }


        if (id > -1000) {
            objLi.appendChild(objLi_a);
        }
        addAttr(objLi_a, attr);
        if (!((id === 4 || id === 5) && !GC.check("MAIL_INBOX_DELETE"))) {
            addAction(objLi, action, actionClick, actionClass, url, id);
        }
        addEvents(objLi, evts);

        if (hasSub) {
            if (myFolder[objLi.id] && myFolder[objLi.id] == "show") {
                objLi_icon.className = "i-folderOn";
            }
            else {
                objLi_icon.className = "i-folderOff";
            }


            subUl = El.createElement("ul");
            subUl.style.display = "none";

            var subId = objLi.id
            if (subId == -1 || subId == -2 || subId == -6)
                subId = 0;
            var folders = CM.folderMain[gConst.dataName];
            for (var z = 0; z < folders.length; z++) {
                if (folders[z].fid > 9) {

                    if (folders[z].parentId == subId) {
                        if (myFolder[objLi.id] && myFolder[objLi.id] == "show") {
                            subUl.style.display = "";
                        }
                        else {
                            subUl.style.display = "none";
                        }
                        break;
                    }
                }
            }


            objLi.appendChild(subUl);
            apendToParent(objLi, pn, pos);
            if (id < 0) {
                subUl.id = "leftFolderContainer_" + id;
                //区分我的邮件夹和我的标签
                subUl.setAttribute("rel", id);
                subUl.className = "left_folder_container";
                objLi_icon.onclick = function () {
                    LM.showOrHiddenMyLabel(subUl, objLi_icon, objLi);
                    /*
                     var isshow = (subUl.style.display == "none");
                     objLi_icon.title = isshow ? Lang.Mail.Hide : Lang.Mail.Show;
                     objLi_icon.className = ( isshow ? "i-folderOn" : "i-folderOff");
                     subUl.style.display = ( isshow ? "" : "none");
                     if(isshow)
                     {
                     myFolder[objLi.id]="show";
                     }
                     else
                     {
                     myFolder[objLi.id]="enable";
                     }
                     //让ie重新渲染页面
                     p1.reRender();
                     EV.stopEvent();
                     */
                 };
             } else {
                subUl.className = (isEnd) ? "fList2" : "fList1";
                objLi_icon.onclick = function () {
                    LM.showOrHiddenMyLabel(subUl, objLi_icon, objLi);
                    /*
                     var isshow = (subUl.style.display == "none");
                     objLi_icon.title = isshow ? Lang.Mail.Hide : Lang.Mail.Show;
                     objLi_icon.className = ( isshow ? "i-folderOn" : "i-folderOff");
                     subUl.style.display = ( isshow ? "" : "none");
                     if(isshow)
                     {
                     myFolder[objLi.id]="show";
                     }
                     else
                     {
                     myFolder[objLi.id]="enable";
                     }
                     //让ie重新渲染页面
                     p1.reRender();
                     EV.stopEvent();
                     */
                 };
             }
             return subUl;
         }

         apendToParent(objLi, pn, pos);

         return objLi;
         function initContexMenu(e, id) {
            var currentMenuName = "span_" + LM.selectFolderId;
            if (id == "-1" || id == "-2" || id == "ulMailFunc") { //我的邮件夹、我的标签

            } else if (id == "leftFolderContainer_-2") { //我的标签子菜单
                currentMenuName = "span_-4";
            } else { //if (id == "leftFolderContainer_-1" ) { //我的邮件夹子菜单
                currentMenuName = "span_-3";
            }
            if (jQuery("#" + currentMenuName)) {
                //移除上次的右键菜单
                var ContexMenuContainer = document.getElementById("ContexMenuContainer");
                if (ContexMenuContainer) {
                    El.remove(ContexMenuContainer);
                }
                if (typeof GE.evts == 'undefined') {
                    GE.evts = {};
                }
                GE.evts.contexMenu = null;
                //初始化右键菜单
                var contexMenu = new ContexMenu({
                    currentMenuName: currentMenuName,
                    e: e,
                    passFlag: passFlag
                });
                contexMenu.show(e);
                GE.evts.contexMenu = contexMenu;
                registerDocEvents();
            }
            EV.stopEvent(e);
        }

        function registerDocEvents() {
            if (documentEventManager) {
                //注册全局事件隐藏右键菜单
                documentEventManager.register('hideContextMenu', function () {
                    if (typeof GE.evts != 'undefined') {
                        if (GE.evts && GE.evts.contexMenu) {
                            if (GE.evts.contexMenu) {
                                GE.evts.contexMenu.hide();
                            }
                            delete GE.evts.contexMenu;
                        }
                    }
                });
                documentEventManager.addEvent('click', 'hideContextMenu');
                documentEventManager.addDoc(document);
            }
        }


        function apendToParent(objLi, pn, pos) {
            if (pos == 'after') {
                pn.appendChild(objLi);
            }
            else if (pos == 'before') {
                if (pn.childNodes.length > 0) {
                    pn.insertBefore(objLi, pn.childNodes[0])
                }
                else {
                    pn.appendChild(objLi);
                }
            }
        }

        function addAttr(c, obj) {
            if (!obj || !obj.id || obj.text == "") {
                return;
            }
            var call = obj.call;
            var span = El.createElement("span", obj.id, "count");
            span.href = "javascript:fGoto();";
            span.innerHTML = obj.text;
            if (call) {
                if (typeof (call) == "function") {
                    span.onclick = function (event) {
                        //passFlag表示这个邮件夹是否加锁了
                        if (passFlag && gMain.lock_close) {
                            //不执行，让他冒泡到Li执行
                        } else {
                            call();
                            EV.stopEvent(event);
                            return false;
                        }
                    };
                } else {
                    span.onclick = function () {
                        eval(call);
                        return false;
                    };
                }

                //EV.observe(span,"contextmenu", function (e) {
                //initContexMenu(e);
                //EV.stopEvent(event);
                //}, true);
            }
            c.appendChild(span);
        }

        function addEvents(o, evts) {
            /*
             if(evts && (evts instanceof Object)){
             for(var k in evts){
             if(typeof evts[k] == 'function'){
             var f = (function(k){
             return function(){
             evts[k](o);
             }
             })(k);
             EV.observe(o, k, f, false);
             }
             }
         }*/

     }

     function addAction(c, html, call, actionClass, url, flag) {
        if (!html) {
            return;
        }
            //if (html == "del" && !GC.check("MAIL_FOLDER_EMPTY")) {
            //return;
            //}
            var a = El.createElement("a");
            var cls = "action";

            if (actionClass != "") {
                cls += ' ' + actionClass;
            }
            a.className = cls;
            if (actionClass == "add") {
                var icoTitle=Lang.Mail.folder_NewFolder;
                switch(flag){
                 case -2 :
                 icoTitle = Lang.Mail.label_NewLabel;
                 break;
                 case -6 :
                 icoTitle ="hahhahahha";
                 break;	
             }
             a.title = icoTitle;
             a.style.right = "22px";
         }
         if (actionClass == "") {
            a.title = Lang.Mail.folder_Empty;
        }
        a.href = "javascript:fGoto();";
        a.innerHTML = html;
        if (call) {
            if (typeof (call) == "function") {
                a.onclick = function () {
                    call();
                    return false;
                };
            } else {
                a.onclick = function () {
                    eval(call);
                    return false;
                };
            }
        }
            //if(actionClass == "add")
            c.appendChild(a);
            if (actionClass != "" && GC.check("MAIL_CONFIG_FOLDER")) {
                a = El.createElement("a");
                var cls = "manage";
                if (actionClass != "") {
                    cls += ' ' + actionClass;
                }
                a.className = cls;
                a.title = (flag==-6?"hahhahahha":Lang.Mail.folder_AdminFolder);
                a.href = "javascript:fGoto();";
                a.innerHTML = html;
                if (url) {
                    if (typeof(url) == "function") {
                        a.onclick = function () {
                            url();
                            return false;
                        };
                    }
                    else {
                        a.onclick = function () {
                            eval(call);
                            return false;
                        };
                    }
                }
                c.appendChild(a);
            }
        }

        function replaceurl(url) {
            while (true) {
                var m = geturlvar(url, '$'), c;
                if (m != "") {
                    c = GC.getCookie(m);
                    url = url.replace('$' + m + '$', c);
                } else {
                    return url;
                    //break;
                }
            }
        }

        function geturlvar(url, v) {
            if (url.indexOf(v) > -1) {
                var s, e, m;
                s = url.indexOf(v);
                e = url.indexOf(v, s + 1);
                if (e < 0) {
                    throw ("menu format error!");
                }
                m = url.substring(s + 1, e);
                return m;
            }
            return "";
        }
    },
    /**
     * 初始化文件夹管理模块
     * @param {Boolean} isInitModule 是否初始化文件夹模块信息
     * 首次加载文件夹，增加删除文件夹都必须重新初始化文件夹数据，此时，值为true
     */
     loadFolderInfo: function (isInitModule) {
        try {
            var p = this;
            if (isInitModule) {
                var fm = CM.folderMain[gConst.dataName];
                if (!fm || Util.getVarType(fm) != "array") {
                    return;
                }
                fm.each(function (i, v) {
                    initFolderMain(v);
                });
                var searchStats = MM[GE.folderObj.search] ? MM[GE.folderObj.search].stats : {};
                initFolderMain({
                    fid: "0",
                    type: 1,
                    name: Lang.Mail.search_Result,
                    stats: searchStats
                });

                if (CC.power.offRestoreDeleted()) {
                    initFolderMain({
                        fid: 7,
                        type: 1,
                        name: "hahhahahha",
                        stats: {
                            attachmentNum: 0,
                            messageCount: 0,
                            messageSize: 0,
                            unreadMessageCount: 0,
                            unreadMessageSize: 0
                        }
                    });
                }
            }

            //没有加载完可以去预下载一些数据
            if (!LM.isLoaded) {
                MM.goTo("folderMain", "refreshBody", 0)
                //p.showMail();
                p.loadDefaultData();

                LM.loadModule();
                //Warning();
            } else {
                //refreshBody会去刷新邮件夹
                MM.goTo("folderMain", "refreshBody", 0);
            }
        } catch (exp) {
            ch("LM.loadFolderInfo", exp);
        }

        /***
         * 初始化左侧菜单
         * @param {Object} aw
         */
         function initFolderMain(aw) {
            MM.initModule(gConst.folder);
            var ab = [];
            var fid = aw.fid || 0;
            var parentId = aw.parentId || 0;
            var type = CC.getFolderTypeName(aw.type);
            var o = type + fid;
            var icons = LM.FIDS;
            var icon = "";
            if (fid < GE.maxFolder) {
                icon = icons[fid] || "";
            } else {
                icon = "";
            }
            var text = aw.name;
            if (!MM[o]) {
                var fm = MM[gConst.folder];
                MM[o] = {};
                Object.extend(MM[o], fm);
            }
            var cd = MM[o];
            var func = (fid > 0) ? gConst.func.listMail : gConst.func.searchMail;
            var ps = CC.getPageSize();
            cd.fid = fid;
            cd.parentId = parentId;
            cd.type = type;
            cd.text = text;
            cd.name = o;
            cd.icon = icon;
            cd.isFolder = true;
            cd.inited = true;
            cd.isLoaded = false;
            cd.stats = aw.stats || {};
            cd.func = func;
            cd.order = GE.list.order;
            cd.desc = 1;

            //cd.data = [{func: gConst.func.listFolder,'var': {stats: 1}},
            //           {func: func,'var':{start:0,order:GE.list.order,desc:1,fid:fid,total:CC.getPageSize()}}];
            //cd.call = [function(ao){LM.loadFolder(ao,true);},
            //           function(ao){MM.loadModuleData(o,ao);}];
            cd.data = {
                start: 1,
                order: GE.list.order,
                desc: 1,
                fid: fid,
                "norefreshSid": window.nsid !== void 1 ? window.nsid : 0,
                total: CC.getPageSize(),
                sessionEnable: function () {
                    if (fid == 1) {
                        return gMain.sessionMode
                    } else {
                        return "0";
                    }

                }()
            };
            cd.call = function (ao) {
                MM.loadModuleData(o, ao);
            };
            cd.limit = CC.getPageSize();

        }

        function Warning() {
            var p = MM.folderMain.folderInfo.userdPercentNum;
            var unlimit = MM.folderMain.folderInfo.totalSize;
            if (unlimit == "200G") {
                p = 1;
            }
            if (p <= 0) {
                return;
            }
            //（0-85是邮箱使用正常，85-95是邮箱空间预警，超过95邮箱空间不足，立即清理（页面跳转至垃圾箱）
            var s = "";
            var t = "";
            var tip = false;
            if (p >= 85 && p < 95) {
                t = Lang.Mail.sys_SpaceWarn;
                s = Lang.Mail.sys_SpaceWarnMsg;
                tip = true;
            } else if (p >= 95) {
                t = Lang.Mail.sys_NoSpace;
                s = Lang.Mail.sys_NoSpaceMsg;
                tip = true;
            }

            if (tip) {
                var rb = s + "<br><br>" + Lang.Mail.Please + ' <a href="javascript:fGoto()" onclick=\'MM.getModule("' + GE.folderObj.junk + '");$("divDialogClosealertbtn_0").click();\'>[' + Lang.Mail.sys_Clear + ']</a> ' + Lang.Mail.sys_ClearSpace;
                CC.alert(rb, null, t);
            }
        }

    },
    /**
     * 向服务器请求文件夹数据，并刷新文件夹信息
     * @param {Boolean} isInitModule 是否初始化模块信息
     * @param {Function} cb 回调函数
     * @param {String} pwd 文件夹密码
     */
     loadFolderMain: function (isInitModule, cb, pwd) {
        var getAllFolderCall = function (ao) {
            var extendCallBack = function (resp) {
                LM.folders.length = 0;
                if (GC.check("MAIL_VAS_MEETING")) { // 会议邀请添加的固定标签
                    CC.addFolderItem(ao["var"], {
                        "fid": 9999999,
                        "location": 31800,
                        "name": "hahhahahha",
                        "type": 5,
                        "flag": {"meeting": 1}
                    });
                    ao["var"][ao["var"].length - 1].stats.messageCount = resp["var"][0].stats.messageCount;
                    ao["var"][ao["var"].length - 1].stats.unreadMessageCount = resp["var"][0].stats.unreadMessageCount;
                }
                TaskMail.addMenuItem(ao);

                // 获取邮件代收文件夹，重新对用户文件夹进行区分
                if (CC.checkConfig("mailPOP")) {
                    // 如果是代收文件夹，把type改为6，同时添加属性popMailId
                    for (var i = 0; i < ao["var"].length; i++) {
                        for (var j = 0; j < resp["var"][1]["var"].length; j++) {
                            if (ao["var"][i].folderColor === 0 && ao["var"][i].name === resp["var"][1]["var"][j].folderName && ao["var"][i].type !== 1) {
                                ao["var"][i].type = 6;
                                ao["var"][i].popMailId = resp["var"][1]["var"][j].id;
                                ao['var'][i].userName = resp["var"][1]["var"][j].username;
                            }
                        }
                    }
                }
                if (CC.power.offSensMail()) { // 敏感邮件添加的固定标签
                    CC.addFolderItem(ao["var"], {
                        "fid": 9999997,
                        "location": 31800,
                        "name": "hahhahahha",
                        "type": 5,
                        "flag": {"signed": 1}
                    });
                    ao["var"][ao["var"].length - 1].stats.messageCount = resp["var"][2].stats.messageCount;
                    ao["var"][ao["var"].length - 1].stats.unreadMessageCount = resp["var"][2].stats.unreadMessageCount;
                }

                // 添加星标邮件夹标签
                if (CC.power.offStarMail()) {
                    CC.addFolderItem(ao["var"], {
                        "fid": 9999996,
                        "location": 31800,
                        "name": "hahhahahha",
                        "type": 5,
                        "flag": {"starFlag": 1}
                    });
                    ao["var"][ao["var"].length - 1].stats.messageCount = ao.totalStarCount;
                    ao["var"][ao["var"].length - 1].stats.unreadMessageCount = resp["var"][3].stats.unreadMessageCount;
                }

                callBack();
                CC.removeFolderItem(MM[gConst.folderMain].Folders.label);
                CC.removeFolderItem(MM[gConst.folderMain].Folders.sys);
                CC.removeFolderItem(CM[gConst.folderMain]['var']);
            };

            function callBack() {
                CM[gConst.folderMain] = ao;
                var ids = LM.FIDS;
                var CorpFolders = window["CorpFolders"] || {};
                var folders = CM[gConst.folderMain]['var'];
                //多语言处理,企业自定义文件夹名称处理
                //企业如果自定义了文件夹名称，则显示企业自定义，否则使用标准的国际化显示
                for (var i = 0; i < folders.length; i++) {
                    var o = folders[i];
                    //个别企业自定义的邮件夹名称
                    var cn = CorpFolders[ids[o.fid]];
                    //默认邮件夹名称
                    var ln = Lang.Mail['folder_' + o.fid];
                    if (ln) {
                        o.name = cn || ln;
                    }
                }

                LM.loadFolderInfo(isInitModule);
                if (typeof (cb) == "function") {
                    cb(); //loaded = true
                }
            }

            var data = {
                "func": "global:sequential",
                "data": {"items": [
                {
                    "func": "mbox:searchMessages",
                    "var": {
                        "fid": 0,
                        "order": "receiveDate",
                        "desc": 1,
                        "recursive": 0,
                        "condictions": [],
                        "flags": {"meetingFlag": 1},
                        "total": 20,
                        "start": 1,
                        "ignoreCase": 0,
                        "isSearch": 1,
                        "isFullSearch": 2,
                        "exceptFids": [2, 4, 5, 8, 10]
                    }
                },
                {
                    "func": "user:getPOPAccounts",
                    "var": {}
                },
                {
                    "func": "mbox:searchMessages",
                    "var": {
                        "fid": 0,
                        "order": "receiveDate",
                        "desc": 1,
                        "recursive": 0,
                        "condictions": [],
                        "flags": {"signed": 1},
                        "total": 20,
                        "start": 1,
                        "ignoreCase": 0,
                        "isSearch": 1,
                        "isFullSearch": 2,
                        "exceptFids": [2, 3, 4, 5, 8]
                    }
                },
                {
                    "func": "mbox:searchMessages",
                    "var": {
                        "fid": 0,
                        "order": "receiveDate",
                        "desc": 1,
                        "recursive": 0,
                        "condictions": [],
                        "flags": {"starFlag": 1},
                        "total": 20,
                        "start": 1,
                        "ignoreCase": 0,
                        "isSearch": 1,
                        "isFullSearch": 2,
                        "exceptFids": [4]
                    }
                }
                ]},
                "call": extendCallBack,
                "failCall": callBack,
                "param": "&from=webapp"
            };
            MM.mailRequestApi(data);
        };
        var data = {
            stats: 1,
            type: 0
        };
        if (pwd) {
            data.password = pwd;
        }
        var obj = {
            func: gConst.func.listFolder,
            data: data,
            call: getAllFolderCall,
            param: "&norefreshSid=" + ( window.nsid !== void 1 ? window.nsid : 0) + "&sessionEnable=" + gMain.sessionMode
        };
        MM.mailRequest(obj);
    },
    freshFolderMain: function (cb, isInit, fp) {
        isInit = isInit || false;
        LM.loadFolderMain(isInit, cb, fp);
    },
    /***
     * 首次获取文件夹信息
     */
     getAllFolders: function (fp) {
        //GE.LeftMenuLoaded = false;
        //fp = fp || "";
        LM.loadFolderMain(true, function () {
            LM.isLoaded = true;
        }, fp);
        /*var setEncryptFolders = function(ao){
         if (MM.beforeResp(ao)){
         var pm = ao["var"]["def_sec_folder"];
         if(!pm){
         return;
         }
         var strFolders = GC.getUrlParamValue(pm,"target");
         var disabled = GC.getUrlParamValue(pm,"disabled");
         var data = {},
         data = {},
         data.disabled = disabled;
         data.isLogin = false;
         if(strFolders.length>0){
         var arr = strFolders.split(",");
         data.secretFolder = arr;
         for(var i=0;i<arr.length;i++){
         data[arr[i]] = 1;
         }
         }
         CM[gConst.folderMainSec] = data;
         }
     },*/
        // var obj = {},arr = [];
        //if (!isEncrypt) {

        //}else{
        //    arr.push({func:gConst.func.getUser,'var':{'attrIds':'def_sec_folder'}});
        //    arr.push({func:gConst.func.listFolder,'var':{'stats':true}});
        //    MM.seqRequestCB(arr,[setEncryptFolders,getAllFolderCall]);
        //}
    },
    changeDiv: function (menuId) {
        var mt = gConst.menuT;
        var mc = gConst.menuC;
        var ot = null;
        var oc = null;
        for (var it in mt) {
            ot = $(mt[it]);
            oc = $(mc[it]);
            if (it == menuId) {
                ot.className = "on";
                oc.style.display = "";
            } else {
                ot.className = "";
                oc.style.display = "none";
            }
        }
    },
    //打开指定的模块
    /**
     * inbox
     composee
     address
     sms
     mms
     fax
     calendar//日程提醒
     disk    //个人文件柜
     epdisk  //企业文件柜
     默认打开的模块名。
     */
     loadModule: function () {
        var m = GC.getUrlParamValue(location.href + "&rnd", "module");
        var func = {
            inbox: CC.goInbox,
            compose: CC.compose,
            address: CC.goAddress
            //sms : CC.goSms,
            //mms : CC.goMms,
            //fax : CC.goFax,
            //calendar : function() {
            //	MM.goOutLink(GC.getCookie("MMSServer") + "/CMailCal/WebMailCalendar/SSO.aspx?id=1&sid=" + GC.sid, "outLink_Calendar");
            //},
            //disk : function() {
            //	MM.goOutLink(GC.getCookie("DiskServer") + "/sso.aspx?id=1&sid=" + GC.sid, "outLink_Disk");
            //},
            //epdisk : function() {
            //	MM.goOutLink(GC.getCookie("DiskServer") + "/sso.aspx?id=2&sid=" + GC.sid, "outLink_EpDisk");
            //}
        };
        var ma = [];
        if (m) {
            m = m.toLowerCase();
            ma = m.split(",");
            ma.each(function (i, v) {
                if (typeof (func[v]) == "function") {
                    try {
                        func[v]();
                    } catch (e) {
                    }
                }
            });
        }
        CC.zoomTip(jQuery, document);
        jQuery("#ifrm_home").load(function () {
            CC.zoomTip(jQuery, jQuery(this)[0].contentWindow.document);
        });
        window.setTimeout(function () {
            try {
                if ((!lastLoginTime || lastLoginTime == "") && (GC.getCookie(gMain.sid + "isFirstLogin") != "false") && CC.IsEnableNoviceWizard() && gMain.firstloginGuide == "true") {
                    //新手指引向导
                    var NovWizard = new NoviceWizard();
                    GC.setCookie(gMain.sid + "isFirstLogin", "false", "/", "", 0);
                }
            } catch (e) {
            }
        }, 10);
    },
    freshNewMail: function () {
        var t = gMain.freshFolderTime || 5;
        t = t * 60000;
        var update = function () {
            if (typeof extralData == 'undefined') {
                window.extralData = {};
            }
            var messageInfo = CC.getMailInfo();
            extralData.unreadMessageCount = messageInfo.unreadMessageCount || 0;
        };
        var listener = function () {
            var mi = CC.getMailInfo();
            var unReadMessageCount = mi.unreadMessageCount - 0;
            var newMailCount = unReadMessageCount - extralData.unreadMessageCount;
            var mt;
            if (newMailCount > 0) {
                if (typeof GE.evts == 'undefined') {
                    GE.evts = {};
                }
                if (!GE.evts.mt) {
                    mt = new MarqueeTitle('hahhahahha'.format(newMailCount));
                    mt.speed = 500;
                    mt.run();
                    GE.evts.mt = mt;
                }
            }
            // MM.folderMain.folderCallback();
        };

        window.setInterval(function () {
            window.nsid = 1;
            update();
            LM.freshFolderMain(listener, true);
            if (MM[GE.folderObj.inbox] && MM[GE.folderObj.inbox].inited) {
                MM[GE.folderObj.inbox].refresh(false);
            }
        }, t);
    },
    /**
     * 主体内容开始加载：gMain.welcomePage-->[1首页（俗称欢迎页） 2：收件箱 3：未读邮件夹]
     * 先根据 url 传入的参数进入哪个页面
     * 根据gMain.welcomePage来判断出现哪个页面
     * 先判断有米有这个参数
     */
     loadDefaultData: function () {
        this.showMail(function () {
            try {

                var opType = GC.getUrlParamValue(window.location.href, 'opType');

                if (opType == "goUnRead") {
                    MM.createModule("home");
                    CC.searchNewMail(0, true);
                }
                else if (window.gMain && gMain.welcomePage) {
                    switch (parseInt(gMain.welcomePage)) {
                        case 1:
                            //加载首页
                            MM.createModule("home");
                            MM.laterRequestModule = gConst.home;
                            break;
                            case 2:
                            //加载收件箱(自定义) (注意：第二个参数一般传true,表示要显示未读邮件)
                            CC.goFolder(1, 'sys1');
                            break;
                            case 3:
                            //加载未读邮件夹(注意：第二个参数一般传true,表示要显示未读邮件)
                            CC.searchNewMail(0, true);
                            break;
                            default:
                            if (window.IsOA == 1) {
                                CC.searchNewMail(0, true);
                            }
                            else {
                                CC.goFolder(1, 'sys1');
                            }


                        }
                    } else {
                        if (window.IsShowWelcome) {
                        //加载首页
                        MM.createModule("home");
                        MM.laterRequestModule = gConst.home;
                        //var oh = MM[gConst.home];
                        //oh.getHtmlInfo(userData);
                    } else {
                        //加载未读邮件夹(注意：第二个参数一般传true,表示要显示未读邮件)
                        if (window.IsOA == 1)
                            CC.searchNewMail(0, true);
                        else
                            CC.goFolder(1, 'sys1');
                    }
                }

            } catch (e) {
                ch("LM.loadDefaultDataCallBack", e);
            }
        });
    },
    /**
     * 显示邮箱界面，隐藏加载进度条
     */
     showMail: function (cb) {
        $("pageLoading").style.display = "none";
        $("container").style.display = "";
        $("accountbar").style.display = "";
        MM.mainResize();
        if (typeof cb == "function") {
            cb();
        }
    },
    init_simple: function () {
        try {
            //当页面加载完成，外部资源还没加载，先初始化页面
            El.ready(function () {
                try {
                    LM.checkLock();
                    
                } catch (e) {
                    LM.initMethodes();
                }
            });
        } catch (exp) {
            ch("LM.init_simple", exp);
        }
    },
    initMethodes: function () {
        LM.getAllFolders();
        //LM.loadDefaultData();
        LM.freshNewMail();              //刷新左侧邮件夹列表
        LM.initBindPhone();            //多方会议功能， 每7天提示手机号码绑定
        //LM.initPWDtip();                //修改密码弹出框提示入口
        Main.initMailMoveStatus();        //邮件搬家入口
        LM.registerDocEvents();
    },

    checkLock: function () {
        var p = this,
        $ = jQuery,
        data = {type: "check"},
        fnSuc = null,
        fnFail = null;

        fnSuc = function () {
            gMain.lock_close = false;
            LM.initMethodes();

            LM.getOATip();

            loopOa();
        }

        fnFail = function () {
            LM.initMethodes();
            LM.getOATip();
            loopOa();
        }

        function loopOa(){
            //隔断5分钟刷新一次oa消息
            if(LM.oaInterval){
                clearInterval(LM.oaInterval);

            }
            LM.oaInterval = window.setInterval( LM.getOATip, 5000*60);
        }


        var option = new OptionBase();


        option.ajaxRequest(gConst.func.checkFolder, data, fnSuc, fnFail, mailPOP.getUrl(gConst.func.checkFolder));

    },

    getOATip: function (argument) {
        var p = this,
        $ = jQuery,
        data = {messageType: 2},
        fnSuc = null,
        func = 'workflow:getBizMessageCount',
        oaUrl = '/webmail/workflow.do?func=workflow:getBizMessageCount&sid='+gMain.sid,
        fnFail = null;

        fnSuc = function () {

        }

        fnFail = function () {

        }

        
        MM.doService({
            url: '/workflow.do',
            func: func,
            data: data,
            failCall: function () {
            },
            call: function (json) {
                var jsonVar = json['var'];
                if (json && json['code'] == 'S_OK') {
                         // home.completed = jsonVar['completed'];      //已完成
                         // home.processing = jsonVar['processing'];    //进行中
                         // home.reject = jsonVar['reject'];            //被驳回
                         // home.totals = jsonVar['totals'];            //我的发起-总共
                         // home.waitCheck = jsonVar['waitCheck'];      //待审批
                         var num = parseInt(jsonVar['totals']) + parseInt(jsonVar['waitCheck']);

                         gMain.oaTotals = parseInt(jsonVar['totals']);
                         gMain.waitCheck = parseInt(jsonVar['waitCheck']);

                         $("#oaNumTip").html(num);
                     }
                 },
                 param: ""
             });


    },
     /***
     *   binding_reminder为1 ：  
     */
     initBindPhone: function(){
        if( parseInt( window.binding_reminder, 10 ) !== 1 ){
            return;
        }

        // CC.alert(Lang.Mail.ConfigJs.notify_nomobile);
        this.showBinPhone();
        return;           


    },
    showBinPhone: function(){
        var url = ""
            aTag = "",
            wo = null;
        if(window.gMain && gMain.webPath && gMain.sid){
            url = gMain.webPath+"/se/account/accountindex.do?sid="+gMain.sid+"&mode=Mobile";
        }
        if(url){
            wo = function(){
                window.location.href = url;
            }
        }

        var htmlcontent = '<p style="padding-bottom:5px; font-size:14px;">想要收到新邮件通知，及时查阅回复邮件吗？</p>'+
                          '<p style="padding-bottom:5px; font-size:14px;">想要免费发起多人电话会议吗？</p>' +
                          '<p style="padding-bottom:5px; font-size:14px;">赶紧进绑定手机号码吧~</p>'
 
        CC.alert(htmlcontent,wo );//Lang.Mail.ConfigJs.phoneBindTip"您还没有绑定手机号码，请进入设置-账号与安全中绑定您的手机号码。"
        if(url){
            jQuery("#divDialogClosealertbtn_0").find("span").find("span").html("hahhahahha");
        }
    },
    /***
     * 首次登陆 或者 密码剩余时间不多的时候弹出 ： 是否修改密码的输入框
     *  如果修改跳到设置页面的修改密码页面，如果选择不再提醒， 通知后台
     */
     initPWDtip: function () {

        if (window.LoginType == gConst.loginType.pm || window.LoginType == gConst.loginType.mm) {
            return;
        }

        var jq = jQuery;
        var text = "";
        var title = "";
        //var isFirstLogin = 1;  isPwdModified
        //var pwdExpiredDate = 1;
        var wo = function () {
            CC.setConfig('password')
        };
        var bCheck = false;
        var fnCancel = function () {
            if (bCheck) {
                //ajax请求
                MM.doService({
                    url: "/mail/conf",
                    func: "mail:setPwdModifyTime",
                    data: "",
                    failCall: function () {
                    },
                    call: function () {
                    },
                    param: ""
                });
            }
        };


        if ( typeof(isPwdModified) != "undefined" && !isPwdModified) {
            //这是您首次登录公司邮箱，建议您修改密码。  您的密码已很长时间没有修改，建议您修改密码
            //欢迎登录邮箱
            title = Lang.Mail.Write.welLogMail;
            // 您还未修改过邮箱登录密码，建议您立即修改密码。
            text = "<p style='font-size:13px;color: #333333; padding:5px 0 5px'>" + Lang.Mail.Write.sugModPwd + "<p>";
            //欢迎登录邮箱
            CC.alert(text, wo, Lang.Mail.Write.welLogMail);
            //修改背景 及 按钮样式
            jq(".topborder").css("text-align", "center");
            // 马上修改
            jq("#divDialogClosealertbtn_0  span span").text(Lang.Mail.Write.modImmediatly);
            jq("#divDialogClosealertbtn_0").removeClass("mt_8");
            jq(".boxIframeBtn").css("background", "#ffffff");
            jq(".topborder").css("borderTop", "none");
        } else if (pwdExpiredDate != -1) {

            wo = function () {
                CC.setConfig('password');
                fnCancel;
            };

            title = Lang.Mail.Write.niceTip;
            //text = "<p>您的密码还有"+pwd_expired_date+"天过期</p>";
            text = "<p style='font-size:13px;color: #333333; padding:5px 0 5px'>  " + Lang.Mail.Write.pwdlongTimeNoMod + "</p>";

            CC.confirm(text, wo, title, fnCancel);

            jq("#divDialogCloseconfirmbtn_0>span>span").text(Lang.Mail.Write.modYourpwd);
            jq("#divDialogCloseconfirmbtn_1>span>span").text(Lang.Mail.Write.prv_lbt_close);
            //待定  ”不在提醒“
            //jq("#divDialogCloseconfirmbtn_0")
            //.before("<span style=\"float: left; margin: 10px;\"><input id=\"noRemind\" type=\"checkbox\"><label for='noRemind'>  不再提醒</label></span>")

            jq("#noRemind").click(function () {
                if (jq(this).attr("checked") == "checked") {
                    bCheck = true;
                } else {
                    bCheck = false;
                }
            });

            jq("#divDialogCloseconfirmbtn_0").bind("click", fnCancel);

            /*
             jq("#divDialogCloseconfirm,#divDialogCloseconfirmbtn_1").bind("click",function(){
             if(bCheck){
             //ajax请求
             }
             })
             */
         }

     },
     init: function () {
        try {
            window.onload = function () {
                LM.getAllFolders();
                //LM.loadDefaultData();
                LM.freshNewMail();
                LM.registerDocEvents();
                LM.getOATip();
            };
        } catch (exp) {
            ch("LM.init", exp);
        }
    },
    registerDocEvents: function () {
        if (documentEventManager) {
            documentEventManager.register('stopMarqueeTitle', function () {
                if (typeof GE.evts != 'undefined') {
                    if (GE.evts && GE.evts.mt) {
                        GE.evts.mt.stop();
                        delete GE.evts.mt;
                    }
                }
            });
            documentEventManager.addEvent('click', 'stopMarqueeTitle');

            documentEventManager.addDoc(document);
        }
    },
    //显示或者隐藏我的标签子文件夹
    showOrHiddenMyLabel: function (subUl, objLi_icon, objLi) {
        var isshow = (subUl.style.display == "none");
        objLi_icon.title = isshow ? Lang.Mail.Hide : Lang.Mail.Show;
        objLi_icon.className = ( isshow ? "i-folderOn" : "i-folderOff");
        subUl.style.display = ( isshow ? "" : "none");

        if (isshow) {
            myFolder[objLi.id] = "show";
        } else {
            myFolder[objLi.id] = "enable";
        }
        //让ie重新渲染页面
        this.reRender();
        EV.stopEvent();
    }
};

function getChangedFrames(){
    var aChangedFrame=[]
    jQuery('[tabid^="compose"]').each(function(){

        var tabid=jQuery(this).attr('tabid')
        var win=jQuery('#ifrm_'+tabid)[0].contentWindow
        var isChange = false;
        if(win&&win.oWrite&&jQuery.type(win.oWrite.dispose)=='function'){
            // 销毁资源
            win.oWrite.dispose();
            try {
                isChange = win.oWrite.checkChange();
            } catch (ex) {
            }
            if (isChange) {
                var changedFrame={
                    type:'mail',
                    window:win
                }
                aChangedFrame.push(changedFrame)
            }
        }

    })
    jQuery('[tabid^="outLink_meeting"]').each(function() {

        var tabid=jQuery(this).attr('tabid')
        var win=jQuery('#ifrm_'+tabid)[0].contentWindow
        //var value=jQuery('#mms_text',win.document).val()
        if(win.Meeting.isChanged()){
            var changedFrame={
                type:'meeting',
                window:win
            }
            aChangedFrame.push(changedFrame)
        }
    })
    jQuery('[tabid^="outLink_sms"]').each(function() {
        var tabid=jQuery(this).attr('tabid')
        var win=jQuery('#ifrm_'+tabid)[0].contentWindow
        var value=jQuery('#RichInputBoxID',win.document).text()+jQuery('#sms_content',win.document).val()
        if(value!=''){
            var changedFrame={
                type:'sms',
                window:win
            }
            aChangedFrame.push(changedFrame)
        }
    })
    jQuery('[tabid^="outLink_mms"]').each(function() {
        var tabid=jQuery(this).attr('tabid')
        var win=jQuery('#ifrm_'+tabid)[0].contentWindow
        var value=jQuery('#mms_text',win.document).val()
        if(win.MMS.isChanged()){
            var changedFrame={
                type:'mms',
                window:win
            }
            aChangedFrame.push(changedFrame)
        }
    })
    return aChangedFrame;
}
function closeAllConfirm(callback){
    var aChangedFrame=getChangedFrames();
    if(aChangedFrame.length==0){//没有未保存的直接跳转
        callback()
    }else if(aChangedFrame.length>1){
        parent.CC.confirm('hahhahahha', callback);
    }else if(aChangedFrame.length==1){
        switch(aChangedFrame[0].type){
            case 'mail':
            parent.CC.confirm('hahhahahha', callback);
                    //aChangedFrame[0].window.oWrite.doMailInfo(true,callback)

                    break;
                    case 'meeting':
                    parent.CC.confirm('hahhahahha', callback);
                    break;
                    case 'sms':
                    parent.CC.confirm('hahhahahha', callback);
                    break;
                    case 'mms':
                    parent.CC.confirm('hahhahahha', callback);
                    break;
                }
            }

        }
//修复IE 6 7 8 9 10下 a标签click冒泡到beforeunload
jQuery(document).on('click','a',function(event,skip_close_cofirm){
    var self = this;
    var target=event.target
    //if(/msie/.test(navigator.userAgent.toLowerCase())){
    //if IE
    if(window.VBArray){
        if(/^\s*javascript/g.test(jQuery(this).attr('href'))){
            return false
        }
    }

    if (this.href.substring(0, 4) == 'http' && jQuery(this).attr('href').substring(0, 1) != '#') {
        if(!skip_close_cofirm){
            var aChangedFrame=getChangedFrames();
            if(aChangedFrame.length!=0){//有未保存的
                event.preventDefault()
                closeAllConfirm(function () {
                    beforeunloadConfirm = false
                    location.href = self.href
                    //jQuery(target).trigger('click', [true])
                })
            }
        }


    }
})
jQuery(function () {
    //避免多次弹窗
    beforeunloadConfirm=true
    jQuery(window).bind('beforeunload', function (e) {
        var aChangedFrame = getChangedFrames();
        if (beforeunloadConfirm && (aChangedFrame.length > 0)) {
            return "--------------------------------------------------\n提示：未保存的内容将会丢失。\n--------------------------------------------------";
        }
    });
})






