var dropMailType = null;
function FolderMain() {
    this.name = gConst.folderMain;
    this.isDel = false;
    this.listFolderMainDiv = null;
    this.listLabelTable = null;
    this.isOk = false;
    this.folderPwd = "";
}

FolderMain.prototype = {
    initialize: function () {
        var aw = MM[gConst.folderMain];
        aw.func = gConst.func.listFolder;
        aw.data = {'stats': true};
        aw.msg = Lang.Mail.folder_LoadingFolder;
        aw.needRequest = true;
        aw.Folders = [];
        aw.Folders[GE.folder.sys] = [];
        aw.Folders[GE.folder.user] = [];
        aw.Folders[GE.folder.admin] = [];
        aw.Folders[GE.folder.label] = [];
        aw.Folders[GE.folder.pop] = [];
        aw.allFolders = [];
        aw.unUsedColors = [];//未使用的颜色代码
        var i, t;
        for (i in this) {
            t = this[i];
            if (typeof(t) == "function") {
                aw[i] = t;
            }
        }
    },
    init: function () {
        //this.refreshFolders();
        //this.refreshFolderInfo();
        this.resize();
        this.listFolderMainDiv = $(gConst.listFolderMainId);
        $(gConst.listFolderMainId).style.paddingRight = "5px";
        if (this.listFolderMainDiv) {
            this.initDragEvent();
        }
        EV.observe(window.document, "click", function () {
            var objs = document.getElementsByName("labelColor");
            for (var i = 0; i < objs.length; i++) {
                var o = objs[i];
                if (o.style.display != 'none')
                    objs[i].style.display = "none";
            }
        });
    },
    resize: function () {
        var o = this.name;
        setHeight();
        function setHeight() {
            var mh = El.docHeight() - GE.pos()[1];
            try {
                var h = mh - El.height($("listHeader_" + o)) - 1;
                El.height($(gConst.listFolderMainId), h);
            } catch (e1) {
            }
        }
    },

    /***
     * 获取邮件夹HTML
     */
    getHtml: function () {
        var p1 = this;
        //var folders = CM.folderMain[gConst.dataName];
        var fm = MM.folderMain.folderInfo;
        var name = this.name;
        var passFlag = CM.folderMain.passFlag;
        var n = 0;
        var ops = {//操作
            empty: {name: Lang.Mail.folder_Empty, id: "MAIL_FOLDER_EMPTY", authority: "MAIL_INBOX_DELETE"},
            del: {name: Lang.Mail.folder_Del, id: "MAIL_FOLDER_DEL"},
            rename: {name: Lang.Mail.folder_ReName, id: "MAIL_FOLDER_UPDATE"},
            filter: {name: Lang.Mail.folder_AddFilter, id: "MAIL_CONFIG_FILTER"},
            label: {name: top.Lang.Mail.Write.gzdyjtbqQybHL, id: "MAIL_CONFIG_FILTER", authority:"MAIL_MANAGER_FILTER"},//给指定邮件贴标签
            edit: {nam: Lang.Mail.folder_Edit, id: "MAIL_FOLDER_UPDATE"},
            pop: {name: Lang.Mail.folder_Pop, id: "MAIL_FOLDER_POP"},
            encrypt: {name: Lang.Mail.Write.encryption, id: "MAIL_FOLDER_ENCRYPT"},  //加密
            sort: {up: "↑", down: "↓"}
        };

        function getData(op, type) {
            data = p1.Folders[type];

            CC.removeFolderItem(data);

            if (type == 'sys') {
                var adminData = p1.Folders['admin'];
                for (var i = 0; i < adminData.length; i++)
                    data.push(adminData[i]);
            }
            var html = [];
            html[html.length] = '<div style="+zoom:1;"><table class="addr_table_head" width="100%" id="' + gConst.listFolderMainTableId + type + '">';
            html[html.length] = '<tbody>';
            html[html.length] = '<tr id="' + gConst.listFolderMainTrId + type + '_0">';
            //html[html.length] = '<td width="30%">'+((type==GE.folder.label||!passFlag)?'':'<input type="checkbox" name="folderMain_cbAll" onclick="MM.folderMain.checkAll(\''+type+'\',this.checked);">&nbsp;&nbsp;') + Lang.Mail.folder_FolderName + '</td>';

            if (type == GE.folder.label) {
                html[html.length] = '<td width="20%">' + Lang.Mail.label_MyLabel + '</td>';
            } else {
                html[html.length] = '<td width="20%">' + Lang.Mail.folder_FolderName + '</td>';
//                html[html.length] = '<td width="12%">' + Lang.Mail.folder_NewMail + '</td>';
//                html[html.length] = '<td width="12%">' + Lang.Mail.folder_CountMail + '</td>';
//                html[html.length] = '<td width="12%">' + Lang.Mail.folder_Mailsize + '</td>';
//                html[html.length] = '<td class="td5"  width="34%">' + Lang.Mail.label_Action + '</td>';
            }
            html[html.length] = '<td>' + Lang.Mail.label_Status + '</td>';
            html[html.length] = '<td width="40%">' + Lang.Mail.label_Action + '</td>';
            html[html.length] = '</tr>';
            html[html.length] = '</tbody>';
            html[html.length] = '</table></div>';

            html[html.length] = '<div style="+zoom:1;"><table width="100%" class="addr_table_body">';
            var o = "";
            var recursion = function (of, pIcon, count) {
                var aw = null, hassub = false, text = "", isCurEnd = false;
                var icon = "", icon1 = "", icon2 = "";
                for (var i = 0, l = of.length; i < l; i++) {
                    aw = of[i];
                    o = CC.getFolderTypeName(aw.type) + aw.fid;
                    hassub = (aw.nodes && aw.nodes.length > 0);
                    isCurEnd = (i == of.length - 1);
                    icon1 = pIcon || "";
                    icon2 = (aw.parentId == 0) ? "" : ((isCurEnd) ? "└ " : "├ ");
                    icon = icon1 + icon2;
                    icon = word2image(icon);
                    if (aw.type == 5) {
                        icon = '<a  data-fid="' + aw.fid + '" class="col_sld mr_5 ' + gConst.labelColor[aw.folderColor] + '" href="javascript:void(0);"><i class="i-dw"></i></a>';
                    }
                    html.push(getTr(icon, aw, o, op, (!aw.nodes ? 0 : aw.nodes.length), i, count));
                    if (hassub) {
                        icon1 += (isCurEnd || aw.parentId == 0) ? "　" : "│ ";
                        recursion(aw.nodes, icon1, (!aw.nodes ? 0 : aw.nodes.length));
                    }
                }
            };
            recursion(data, "", data.length);
            html[html.length] = '</table></div>';
            return html.join("");
        }

        function getTr(icon, aw, o, op, nodes, index, parentNodeCount) {
            var su = aw.stats;
            var fid = aw.fid;
            var flg = aw.flags || {};
            var type = CC.getFolderTypeName(aw.type);
            var html = [];
            var size = Util.formatSize(su.messageSize, null, 1);
            var isLock = false;

            html.push('<tr id="' + gConst.listFolderMainTrId + type + '_' + aw.fid + '" onMouseOver="MM[\'folderMain\'].mouseOver(this,\'tr\');" onMouseOut="MM[\'folderMain\'].mouseOut(this,\'tr\');">');

            if (aw.type == 5) {
                html[html.length] = '<td width="20%">' + icon + '<a class="vertical_a" href="javascript:void(0)" onclick="CC.goFolder(\'' + fid + '\',\'' + o + '\');"  title="' + aw.name.encodeHTML() + '">' + aw.name + '</a></td>';
            } else {
                //给个加锁的标签
                var style = "display:inline-block; *display:inline; margin:0;padding:0;width:11px;background-image:url('../images/edit.png');background-repeat:no-repeat;  height:11px;color:#989898; overflow:hidden; text-indent:-9999px;background-position:-220px -73px;";
                var a_lock = '';

                //如果安全锁锁定，邮件夹有锁，自定义邮件夹
                if (gMain.lock_close && aw.folderPassFlag && (aw.type == 3 || aw.type ==6)) {
                    a_lock = '<a  href="javascript:void(0);" style = ' + style + ' class="add lockico lockFolder_pos"></a>';
                    html.push('<td width="20%">' + icon + a_lock + '<a href="javascript:void(0)" onclick="folderlock.unlocked(\'' + fid + '\',\'myfolder\',\'' + o + '\');"  title="' + aw.name.encodeHTML() + '">' + aw.name + '</a></td>');
                    isLock = true;
                } else {
                    //不变
                    html.push('<td width="20%">' + icon + '<a href="javascript:void(0)" onclick="CC.goFolder(\'' + fid + '\',\'' + o + '\');" >' + aw.name.encodeHTML() + '</a></td>');
                }
//
//                html.push('<td width="12%">' + su.unreadMessageCount + '</td>');
//                html.push('<td width="12%">' + su.messageCount + '</td>');
//                html.push('<td width="12%">' + size + '</td>');
//                html.push('<td width="34%"><a>' + getOpteration(type, fid, op, nodes, index, parentNodeCount, isLock) + '</a></td>');
            }
            html[html.length] = '<td>'+top.Lang.Mail.Write.youjian+'<span class="c_ff6600">' + su.unreadMessageCount + '</span>/' + su.messageCount + top.Lang.Mail.Write.zhanyong + size + '</td>';//<td>邮件:<span class="c_ff6600">  ||   占用:
            html[html.length] = '<td width="40%">' + getOpteration(type, fid, op, nodes, index, parentNodeCount, isLock) + '</td>';
            html.push('</tr>');
            return html.join("");
        }

        function getOpteration(type, fid, op, nodes, indexs, parentNodeCount, isLock) {
            var html = [], sn = "";
            op.each(function (i, v) {
                var aut = ops[v]["authority"] || "";
                if(aut != "" && !GC.check(aut)){
                    return;
                }
                if (v != "sort") {
                    sn = ops[v];
                    var name = sn.name;
                    var id = sn.id;
                    var o = {
                        v: v,
                        fid: fid,
                        type: type
                    };
                    //删除 清空 重命名
                    //if (GC.check(id)) {
                    if (isLock && v != "rename") {
                        html.push('<a href="javascript:fGoto();" ' + (i != 0 ? 'class="pl_10"' : '') + ' onclick="folderlock.unlocked(\'\',\'myfolder_op\',\'' + o + '\')">' + name + '</a>');
                    } else {
                        html.push('<a href="javascript:fGoto();" ' + (i != 0 ? 'class="pl_10"' : '') + ' onclick="MM.folderMain.opt(\'' + v + '\',' + fid + ',\'' + type + '\');return false;">' + name + '</a>');
                    }

                    //}
                }
                else {
                    sn = ops[v];
                    //if (GC.check("MAIL_FOLDER_SORT")) {
                    if (parentNodeCount > 1 && indexs != 0) {
                        html.push('<a class="move-up pl_10"  href="javascript:fGoto();" onclick="MM.folderMain.opt(\'' + v + '\',' + fid + ',\'' + type + '\',\'up\');return false;"><i></i></a>');
                    }
                    if (parentNodeCount > 1 && indexs != parentNodeCount - 1) {
                        html.push('<a class="move-down pl_10"  href="javascript:fGoto();" onclick="MM.folderMain.opt(\'' + v + '\',' + fid + ',\'' + type + '\',\'down\');return false;"><i></i></a>');
                    }
                    //}
                    /*
                     if (GC.check("MAIL_FOLDER_SORT")) {
                     Util.eachObj(sn, function(index, o){
                     if ((p1.Folders[type][0].fid != fid && index == 'up' ) || (p1.Folders[type][p1.Folders[type].length - 1].fid != fid && index == 'down')) {

                     html.push('<a class="move-'+index+' pl_10"  title="'+(index=='up'?Lang.Mail.ConfigJs.newFilter_MoveUp:Lang.Mail.ConfigJs.newFilter_MoveDown)+'" href="javascript:fGoto();" onclick="MM.folderMain.opt(\'' + v + '\',' + fid + ',\'' + type + '\',\'' + index + '\');return false;"><i></i></a>');
                     }
                     });
                     } */
                }
            });
            return html.join("");
        }

        function word2image(word) {
            var str = [];
            var icons = {
                L0: 'L0.png', //┏
                L1: 'L1.png', //┣
                L2: 'L2.png', //┗
                L3: 'L3.png', //━
                L4: 'L4.png', //┃
                PM0: 'P0.png', //＋┏
                PM1: 'P1.png', //＋┣
                PM2: 'P2.png', //＋┗
                PM3: 'P3.png', //＋━
                empty: 'L5.png', //空白图
                root: 'root.png', //缺省的根节点图标
                folder: 'folder.png', //缺省的文件夹图标
                file: 'file.png', //缺省的文件图标
                exit: 'exit.png'
            };
            for (var i = 0; i < word.length; i++) {
                var img = "";
                switch (word.charAt(i)) {
                    case "│":
                        img = "L4";
                        //str.push('<span class="tree-one"></span>');
                        break;
                    case "└":
                        img = "L2";
                        //str.push('<span class="tree-end"></span>');
                        break;
                    case "　":
                        img = "empty";
                        //str.push('<span class="tree-one pr_26"></span>');
                        break;
                    case "├":
                        img = "L1";
                        //str.push('<span class="tree-head"></span>');
                        break;
                    case "─":
                        img = "L3";
                        break;
                    case "┌":
                        img = "L0";
                        break;
                }
                /* 隐藏树型图标*/
                if (img != "") {
                    str.push("<img align='absMiddle' src='" + gMain.resourceRoot + "/images/tree/" + icons[img] + "' height='30' width='20'>");
                }
            }
            return str.join("");
        }

        var showTotal = fm.totalSize;
        showTotal = showTotal.replace(" ", "");
        if (showTotal == "200G" || showTotal == "0" || showTotal == "UNLIMITED") {
            fm.usedPercent = "1.0%";
            showTotal = Lang.Mail.Unlimited;
        }
        var html = [];
        //html[html.length] = '<div id="pageFolder">';
        html[html.length] = '<div id="' + gConst.listFolderMainId + '" style="OVERFLOW:auto">';
        html[html.length] = '<div class="volume-til">';
        html[html.length] = '<span>' + Lang.Mail.Write.totalAmount + '<var class="full-volume">' + showTotal + '</var></span>';
        html[html.length] = '<span>' + Lang.Mail.Write.used + '<var class="already-use">' + fm.usedSize + '</var></span>';
        if (showTotal != Lang.Mail.Unlimited) {
            html[html.length] = '<span>' + Lang.Mail.Write.theRest + (fm.userdPercentNum == 0 ? "<var class=\"new-mail\">  " + Lang.Mail.Write.fullCapacity + "</var>" : '<var class="left-volume">' + (fm.userdPercentNum) + '%</var>') + '</span>';
        }
        html[html.length] = '<span>' + Lang.Mail.Write.together + '<var class="all-mail">' + fm.messageCount + '</var>' + Lang.Mail.Write.letters + '，<var class="new-mail">' + fm.unreadMessageCount + '</var>' + Lang.Mail.Write.newMails + '</span>'
        html[html.length] = '</div>';


        /*系统文件夹*/
        html[html.length] = '<div >';
        // html[html.length] = '<div>';
        html[html.length] = '<h3 class="ban-til">' + Lang.Mail.folder_SysFolder + '</h3>';

        var opterationList_sys = [];
        //if (GC.check("MAIL_FOLDER_EMPTY"))
        opterationList_sys.push("empty");
        html[html.length] = getData(opterationList_sys, GE.folder.sys);
        html[html.length] = '</div>';

        /* 用户自定义文件夹*/
        html[html.length] = '<div class="pt_30">';
        html[html.length] = '<h3 class="ban-til">' + Lang.Mail.folder_MyFolder;
        if (GC.check("MAIL_CONFIG_FOLDER")) {
        html[html.length] = ' <a class="pl_15" href="javascript:fGoto();" onClick="MM.folderMain.opt(\'addUser\');return false;">' + Lang.Mail.folder_NewFolder + '</a>';
        }
        html[html.length] = '<a class="pl_15"  href="javascript:fGoto();" onClick="MM.folderMain.refresh();return false;">' + Lang.Mail.folder_Fresh + '</a></h3>'

        var opterationList_user = [];
        if (GC.check("MAIL_CONFIG_FOLDER")){
            opterationList_user.push("empty");
             opterationList_user.push("del");
             opterationList_user.push("rename");
             opterationList_user.push("sort");
        }        
        html[html.length] = getData(opterationList_user, GE.folder.user);
        html[html.length] = '</div>';

        if (GC.check("MAIL_MANAGER_FILTER")) {
        html[html.length] = '<div class="mail-tips "><strong>' + Lang.Mail.FolderManageTips + '：</strong>';
        html[html.length] = ' <p>'+top.Lang.Mail.Write.chuangjian+'<a href="javascript:void(0)" onclick=MM.folderMain.opt("filter",1,"sys");return false;>'+top.Lang.Mail.Write.youjianfenjian+'</a>'+top.Lang.Mail.Write.gzafjTPhAWclgfb+'</p></div>';// <p>创建<a href="javascript:void(0)" onclick=MM.folderMain.opt("filter",1,"sys");return false;>邮件分拣</a>规则，按发件人自动投到指定邮件夹，邮件处理更方便。</p></div>
        }

        if (CC.checkConfig("mailPOP")) {
            /*代收邮件夹 */
            var opterationList_pop = [];
            if (GC.check("MAIL_CONFIG_FOLDER")){
                opterationList_pop.push("empty");
            } 
            html[html.length] = '<div class="pt_30">';
            html[html.length] = '<h3  class="ban-til">' + Lang.Mail.ConfigJs.popMailFolder;
            html[html.length] = '<a class="pl_15" href="javascript:fGoto();" onClick="MM[\'folderMain\'].refresh();return false;">' + Lang.Mail.folder_Fresh + '</a></h3>';
            html[html.length] = getData(opterationList_pop,GE.folder.pop);
            html[html.length] = '</div>';
        }


        /*标签邮件*/
        if (CC.isLabelMail()) {
//            html[html.length] = '<a class="pl_15"  href="javascript:fGoto();" onClick="MM.folderMain.refresh();return false;">' + Lang.Mail.folder_Fresh + '</a></h3>'
//            html[html.length] = '<div class="pt_30">';
//            html[html.length] = '    <a id="openAddtag" bh="set_foldermanagers_tag_create" class="btnSet btnsetTag" href="javascript:fGoto();" onClick="MM[\'folderMain\'].opt(\'addLabel\');return false;"><span>' + Lang.Mail.label_NewLabel + '</span></a>';
//            html[html.length] = '</div>';
            html[html.length] = '<div class="pt_30">';
            html[html.length] = '<h3 class="ban-til ">' + Lang.Mail.label_MyLabel;
            html[html.length] = '   <a class="pl_15" href="javascript:fGoto();" onClick="MM[\'folderMain\'].opt(\'addLabel\');return false;">' + Lang.Mail.label_NewLabel + '</a>';
            html[html.length] = '   <a class="pl_15"  href="javascript:fGoto();" onClick="MM.folderMain.refresh();return false;">' + Lang.Mail.folder_Fresh + '</a></h3>'
            html[html.length] = '<div>';
            html[html.length] = getData(["rename", "del", "label"], GE.folder.label);
            html[html.length] = '</div>';
            html[html.length] = '</div>';
        }
        return html.join("");
    },
    /**
     * 计算文件夹的个数
     * @return
     */
    getFLength: function (fs) {
        var i = 0;
        var calculation = function (fs) {
            for (var j = 0, l = fs.length; j < l; j++) {
                i++;
                if (fs[j].nodes && fs[j].nodes.length > 0) {
                    calculation(fs[j].nodes);
                }
            }
        };
        calculation(fs);
        return i;
    },
    /***
     * 新建文件夹操作
     * @param {Object} type 文件夹类型 3:用户文件夹 5：标签文件夹
     * @param {Object} of 重命名文件夹对象
     * @param {Boolean} isEdit  是否修改文件夹
     * @param {Object} para  菜单操作参数
     */
    add: function (type, of, isEdit, para) {
        var p1 = this;
        var html = "";
        var fl = gConst.folderLength * 2;
        var fm = CM.folderMain[gConst.dataName];
        var aw = null;
        var fid = 0, parentId = 0, name = "", pop3Flag;
        var popHtml = "";
        var colorBox = null;
        var isLabel = (type == GE.folderType.label),
            isMu = !(para && (para.mid.length == 1));

        if (isEdit) {
            fid = of.fid;
            parentId = of.parentId;
            name = of.name.encodeHTML();
            pop3Flag = of.pop3Flag;
        } else {
            if (type == GE.folderType.user && p1.getFLength(p1.Folders[GE.folder.user]) >= GE.folder.limit) {
                CC.alert(Lang.Mail.FolderLimitMsg.format(GE.folder.limit));
                return;
            } else if (p1.getFLength(p1.Folders[GE.folder.label]) >= GE.folder.labelLimit) {
                CC.alert(Lang.Mail.FolderLimitMsg.format(GE.folder.labelLimit));
                return;
            }
        }

        var folder = p1.Folders[GE.folder.sys].concat(p1.Folders[GE.folder.user]);
        var count = (type == GE.folderType.user) ? p1.Folders[GE.folder.user].length : p1.Folders[GE.folder.label].length;
        var prompt = Lang.Mail.folder_InputName;
        if (isLabel) {
            prompt = Lang.Mail.label_LabelName + "：";
            html += '<li class="j_formLine clearfix">';
            html += [
                '<label class="j_label">', prompt, '</label>',
                '<div class="j_element">',
                '   <div class="setTag" id="setTag">',
                '       <input type="text" id="txtNewFolderName" maxlength="' + fl + '" class="iText" value="' + name + '"/>',
                '       <input type="hidden" id="colorValue"/>',
                isEdit ? '' : '<div class="mailThemeBg" id="btn_colorselect"><i class="i-colorsquare c1 fl" id="colorView"></i><i class="i_triangle_d"></i></div>',
                '   </div>'
            ].join("");
            if (!isEdit) {
                html += [
                    '<div class="mb_5" id="div_filterContact">',
                    '   <input type="checkbox" id="chk_filter" value="" class="mr_5">',
                    '   <label for="chk_filter">' + (isMu ? Lang.Mail.tips072 : Lang.Mail.tips073) + '</label>',
                    isMu ? '<div id="contact-box" style="display: none;position: relative;"><input type="text" name="setContact" style="width:212px"  id="setContact" class="text" /><div id="contact-body"></div></div>' : '',
                    '</div>'
                ].join("");
            }
            html += '</div></li>';
        } else {
            !isEdit && (html += "<li class=\"j_formLine clearfix\">" + p1.getSelectFolders(folder, "newfolder", parentId) + "</li>");
            /*新功能暂时屏蔽*/
            //popHtml = "<br/>是否可以pop3收取：<input type='checkbox' id='cbPop3Flag' name='cbPop3Flag' value='1' '"+(pop3Flag?"checked='checked'":"")+"'/>";
            html += [
                '<li class="j_formLine clearfix">',
                '   <label class="j_label">', prompt, '</label>',
                '   <div class="j_element"><input type="text" style="width:150px" id="txtNewFolderName"  maxlength="' + fl + '" class="iText" value="' + name + '"/></div>',
                '</li>'
//                ,'<li class="j_formLine clearfix">',
//                '   <p id="spnEroMsg" class="msgSet">只能输入14个英文或7个中文,请不要输入 ＂, % \' " \/ ;| &.*＂</p>',
//                '</li>'
            ].join("");
        }
        html += popHtml;
        var title = ((isEdit) ? Lang.Mail.folder_ReName : Lang.Mail.folder_New) + Lang.Mail.folder_Folder;
        if (isLabel) {
            title = ((isEdit) ? Lang.Mail.folder_ReName : Lang.Mail.folder_New) + Lang.Mail.label_Label;
        }

        /**
         * 返回排序的location
         * @param fs
         * @param pid
         * @returns {*|DOMLocator}
         */
        var getLocation = function (fs, pid) {
            var p1 = this;
            if (pid == 0) {
                return fs[fs.length - 1].location;
            }
            var nodesList = null;

            function getNodes(nodes) {
                var finded = false;

                for (var i = 0; i < nodes.length; i++) {
                    if (nodes[i].fid == pid) {
                        nodesList = nodes[i];
                        finded = true;
                        //return nodes[i];
                    }
                    else {
                        if (nodes[i].nodes.length > 0 && finded == false)
                            getNodes(nodes[i].nodes);
                    }
                }
                if (finded) {
                    return;
                }
            }

            getNodes(fs)
            //var nodesList = getNodes(fs);
            if (nodesList)
                return (nodesList.nodes && nodesList.nodes.length > 0) ? nodesList.nodes[nodesList.nodes.length - 1].location : null;
            else
                return fs[fs.length - 1].location;

        };
        /***
         * 新建文件夹回调函数
         */
        var callback = function () {
            var tip = new ToolTips({
                id: 'txtNewFolderName_error',
                direction: ToolTips.direction.Bottom
            });

            var chk = $("chk_filter"),
                email = $("setContact");

            if (isEdit) {
                tip.containerTop = 78;
            }
            var fn = $("txtNewFolderName").value.trim();
            var parentId = 0;
            var level = 1;
            if (dropMailType != null) {
                parentId = dropMailType.getValue();
                level = dropMailType.getAttrValue("level");
            }
            //var parentId = $("selParentFolder_newfolder") || 0;
            var isPop = 0;
            var location = (type == 3) ? GE.userLocation : GE.labelLocation;
            if (type == GE.folderType.user) {
                //if(parentId){
                //parentId = parseInt(parentId.value,10) || 0;
                //}
                if ($("cbPop3Flag"))
                    isPop = ($("cbPop3Flag").checked) ? 1 : 0;
            }
            fn = fn.trim();
            if (fn == "") {//判断文件夹名称是否为空
                var errMsg = Lang.Mail.folder_NameIsNull;
                if (isLabel) {
                    errMsg = Lang.Mail.tips074;
                }
                tip.show($("txtNewFolderName"), errMsg);
                $("txtNewFolderName").focus();
                return true;
            }
            if (fn == Lang.Mail.folder_MyFolder || fn === top.Lang.Mail.Write.daishouyoujianjia || fn === top.Lang.Mail.Write.wodebiaoqian) {//代收邮件夹  ||  我的标签
                tip.show($("txtNewFolderName"), Lang.Mail.folder_NameExist);
                $("txtNewFolderName").focus();
                return true;
            }

            //判断文件夹名称是否存在特殊字符
            if ((!fn.checkSpecialChar()) || (new RegExp("[\~\！\#\￥\%\……\&\*\（\）\=\+\{\}\；\‘\：\“\，\？\/\<\>\;]", "ig")).test(fn)) {
                //tip.show($("txtNewFolderName"), Lang.Mail.folder_NotInputChar);
                tip.show($("txtNewFolderName"), Lang.Mail.Write.cannotInputTips);
                $("txtNewFolderName").focus();
                return true;
            }
            //coremail限制字符数为14   判断文件夹名长度
            if (fn.len() > fl) {
                tip.show($("txtNewFolderName"), Lang.Mail.folder_FolderLength.format(fl, gConst.folderLength));
                $("txtNewFolderName").focus();
                return true;
            }
            if (level >= 5) {
                tip.show($("txtNewFolderName"), Lang.Mail.createFolderLevel);
                return true;
            }
            //判断重名
            var flag = false;
            if (!isLabel) {
                for (var i = 0; i < p1.Folders.sys.length; i++) {
                    if (p1.Folders.sys[i].name == fn && p1.Folders.sys[i].fid != fid) {
                        flag = true;
                    }
                }
                if (flag == false) {
                    for (var i = 0; i < fm.length; i++) {
                        if (fm[i].type != 5 && fm[i].name == fn && fm[i].fid != fid) {
                            flag = true;
                        }
                    }
                    var sysFolderList = gConst.sysFolderList;
                    for (var i = 0; i < sysFolderList.length; i++) {
                        if (sysFolderList[i] == fn) {
                            tip.show($("txtNewFolderName"), Lang.Mail.sameSysFolder);
                            $("txtNewFolderName").focus();
                            return true;
                        }
                    }
                }
            }

            if (isLabel) {
                for (var i = 0; i < fm.length; i++) {
                    if (fm[i].type == 5 && fm[i].name == fn && fm[i].fid != fid) {
                        flag = true;
                    }
                }
                if (chk && chk.checked && email) {
                    if (email.value == "") {
                        tip.show(email, top.Lang.Mail.Write.qxzysqdlxrtmcjq);//请选择要收取的联系人
                        email.focus();
                        return true;
                    }

                    if (email.value.replace(/[,;，；]/g, ';').split(";").length > 1) {
                        tip.show(email, top.Lang.Mail.Write.znsryvFtjklxrdz);//只能输入一个联系人地址
                        email.focus();
                        return true;
                    }

                    if (!Email.match(email.value)) {
                        tip.show(email, top.Lang.Mail.Write.qsrzqyHqmSlxrdz);//请输入正确的联系人地址
                        email.focus();
                        return true;
                    }

                }
            }

            //分配location排序号
            if (type == GE.folderType.user) {
                if (p1.Folders[GE.folder.user].length > 0) {
                    var l = getLocation(p1.Folders[GE.folder.user], parentId);
                    location = l || location;
                }
            } else {
                if (p1.Folders[GE.folder.label].length > 0) {
                    location = p1.Folders[GE.folder.label][p1.Folders[GE.folder.label].length - 1].location;
                }
            }
            location += GE.locationAdd;

            if (flag) {
                tip.show($("txtNewFolderName"), isLabel ? top.Lang.Mail.Write.tmbqyjczvJFKG : Lang.Mail.folder_NameExist);//同名标签已经存在
                $("txtNewFolderName").focus();
                return true;
            }
            var arr = [];
            var isOk = false;
            if (!isEdit) {//新建文件夹/标签
                isOk = true;
                if (isLabel) {//新建标签
                    var colorVal = $("colorValue").value;//p1.unUsedColors[0]||0;//分配颜色代码
                    arr.push({
                        func: gConst.func.createFolder,
                        'var': {
                            'parentId': parentId,
                            type: type,
                            location: location,
                            'name': fn,
                            folderColor: colorVal,
                            pop3Flag: isPop
                        }
                    });
                } else {//新建文件夹
                    arr.push({
                        func: gConst.func.createFolder,
                        'var': {
                            'parentId': parentId,
                            type: type,
                            location: location,
                            'name': fn,
                            pop3Flag: isPop
                        }
                    });
                }
            } else {//修改文件夹/标签
                if (of.name != fn) {
                    arr.push({//修改文件夹名称
                        func: gConst.func.updateFolder,
                        'var': {
                            fid: fid,
                            type: 1,
                            name: fn
                        }
                    });
                    isOk = true;
                }
                /*if(type==3){//修改文件夹父接点
                 if (of.parentId != parentId) {
                 arr.push({
                 func: gConst.func.updateFolder,
                 'var': {
                 fid: fid,
                 type: 3,
                 parentId: parentId
                 }
                 });
                 isOk = true;
                 }
                 if (of.pop3Flag != isPop) {
                 arr.push({//修改文件夹POP设置
                 func: gConst.func.updateFolder,
                 'var': {
                 fid: fid,
                 type: 4,
                 pop3Flag: isPop
                 }
                 });
                 isOk = true;
                 }
                 }*/
            }

            if (isOk) {
                MM.seqRequest(arr,
                    function (au, fid) {
                        fid = fid || au["var"];
//                        MM.mailRequest({
//                            func: gConst.func.listFolder,
//                            data: {
//                                'stats': 1,
//                                type: 0
//                            },
//                            call: function () {}
//                        });
                        //创建标签
                        if (isLabel && chk && chk.checked) {
                            var postData = {
                                func: gConst.func.setFilter,
                                data: {
                                    "conditionsRelation": 1,
                                    "dealHistoryMail": 0,
                                    "fromType": 2,
                                    "from": email ? email.value : para.from,
                                    "attachLabel": fid,
                                    "forwardBakup": 1,
                                    "opType": "add",
                                    "dealType": "5",
                                    name: 'm123456',
                                    ignoreCase: 1
                                },
                                call: function () {
                                }
                            };
                            MM.mailRequest(postData);
                        }
                        if (!isEdit) {
                            CC.showMsg(isLabel ? top.Lang.Mail.Write.cjbqcgqNClA : Lang.Mail.mailFolderCreateSuccess, true, false, "option");//创建标签成功
                        }
                        else {
                            CC.showMsg(isLabel ? top.Lang.Mail.Write.xgbqcgAeBeo : Lang.Mail.mailFolderUpdateSuccess, true, false, "option");//修改标签成功
                        }
                        p1.callback(au, fid);

                        if (para) {
                            MM[para.o].marklabel("add", para.mid, fid, function () {
                                para.call && para.call(fid);
                            });
                        }
                    }
                    , function (d) {
                        if (!isEdit) {
                            CC.showMsg(isLabel ? top.Lang.Mail.Write.cjbqsbZefUP : Lang.Mail.CreateFolderFail, true, false, "error");//创建标签失败
                        }
                        else {
                            CC.showMsg(isLabel ? top.Lang.Mail.Write.xgbqsbRzjln : Lang.Mail.EditFolderFail, true, false, "error");//修改标签失败
                        }
                    });//顺序调用
                var func = null;
                var logdata = [];
                /*
                if (!isEdit) {
                    func = "log:addFolder";
                    logdata = {folderList: [
                        {fid: "", folderName: fn}
                    ]};
                }
                else {
                    func = "log:updateFolder";
                    logdata = {folderList: [
                        {fid: fid, folderName: fn, oldFolderName: of.name}
                    ]};
                }
                MM.doService({
                    url: "/log/log",
                    data: logdata,
                    func: func,
                    failCall: function (d) {
                    },
                    call: function (d) {
                    },
                    param: ""
                });*/
            }
        };
        html = "<div class=\"pop-wrap\" style=\"padding:0\"><ul class=\"form\">" + html + "</ul></div>";
        CC.showDiv(html, callback, title, function () {
            colorBox && colorBox.hide(); //IE BUG 关闭色块组件
        }, "label", isLabel && "385");

        /**
         * 新建标签，事件绑定
         */
        function bindEvent() {
            var labelMain = $("labelMain"),
                box = $("contact-box"),
                body = $("contact-body"),
                on = $("chk_filter"),
                set = $("setContact"),
                btn = $("btn_colorselect");

            var showType = ["0", "2"];

            var offset = function () {
                var win = $("divDialogconfirmlabel");
                var width = win.offsetWidth;
                var height = win.offsetHeight;
                var x = (CC.docWidth() - width) / 2;
                var y = (CC.docHeight() - height) / 2;
                win.style.left = x + "px";
                win.style.top = y + "px";
            };
            //呼出色块选择
            if (btn) {
                colorBox = new ColorBox(btn, {
                    target: "#colorValue",
                    callback: function (val, color) {
                        $("colorView").className = "i-colorsquare fl " + color;
                    }
                });
                colorBox.setValue(p1.unUsedColors[0]);
            }
            if (on && box) {
                on.onclick = function () {
                    if (this.checked) {
                        contact = contact || new parent.Contact("contact");
                        contact.groupMap = LMD.groupMap;
                        contact.group_contactListMap = LMD.group_contactListMap_mail;
                        contact.addContact = function (name, email, id) {
                            set.value = email;
                        }
                        contact.createBody(showType, function () {
                            body.innerHTML = contact.getHTML(true);
                        })
                        box.style.display = "";
                    } else {
                        box.style.display = "none";
                    }
                    offset();
                }
            }
        }

        if (isLabel) bindEvent();
        if (dropMailType != null) {
            dropMailType.loadEvent();
        }
        window.setTimeout('$("txtNewFolderName").focus();', 100);
    },
    empty: function (oFolder) {
        var p1 = this;
        var text = oFolder.name;
        var id = oFolder.fid;
        var o = oFolder.name;
        var rb = Lang.Mail.folder_ConfirmEmpty.format(text);
        if (id == GE.folder.del) {
            rb = Lang.Mail.folder_EmptyNoRecover;
        }
        p1.opFolder = CC.getFolderTypeName(oFolder.type) + id;
        var obj = {};
        obj['func'] = gConst.func.updateMailAll;
        //标签执行清空操作
        if (id == GE.folder.del) {
            obj['var'] = {'fid': id, type: 'delete'};
        } else if (oFolder.type == GE.folderType.label) {
            obj['var'] = {'fid': id, type: 'empty'};
        } else {//文件夹执行移动操作
            obj['var'] = {'fid': id, type: 'move', newFid: GE.folder.del};
        }
        obj.call = p1.callback;
        if (oFolder.stats.messageCount > 0) {
            return CC.confirm(rb, function () {
                p1.isDel = true;
                //ajax请求数据保存 清空文件夹 将邮件移至已删除邮件箱
                var objListFolder = {};
                var arr = [];
                objListFolder['func'] = gConst.func.listFolder;
                objListFolder['var'] = {'stats': 1};
                arr[arr.length] = obj;
                arr[arr.length] = objListFolder;
                //MM.seqRequest(arr,p1.callback);
                MM.seqRequest(arr, function (au) {
                    p1.callback(au, id);
                    CC.showMsg(Lang.Mail.mailClearSuccess, true, false, "option");
                });
            });
        } else {
            CC.alert(Lang.Mail.folder_NoMailEmpty);
        }
    },

    del: function (oFolder) {
        var p1 = this;
        var obj = {};
        obj['func'] = gConst.func.delFolder;
        obj['var'] = {
            fid: oFolder.fid,
            type: oFolder.type
        };
        obj.call = p1.callback;
        //p1.isDel = true;
        if (oFolder.type == 5 || (oFolder.type == 3 && oFolder.stats.messageCount == 0)) {
            var confirmMsg = Lang.Mail.folder_ConfirmDel;
            var confirmTitle = Lang.Mail.folder_ConfirmDelTitle;
            if (oFolder.type == GE.folderType.label) {
                confirmMsg = Lang.Mail.label_ConfirmDel;
                confirmTitle = Lang.Mail.label_ConfirmDelTitle;
            }
         
            CC.confirm(confirmMsg, function () {
                //ajax请求数据保存 删除文件夹
                var objListFolder = {};
                var arr = [];
                objListFolder['func'] = gConst.func.listFolder;
                objListFolder['var'] = {'stats': 1, type: 0};
                arr.push(obj);
                arr.push(objListFolder);

                //如果存在邮件夹加锁,且删除的为最后一个加锁文件夹,则清楚加锁密码
                if (CM.folderMain.passFlag == 1) {
                    var folderList = CM.folderMain["var"];
                    var lockFid = "";
                    var lockFolderCount = 0;
                    for (var i = 0; i < folderList.length; i++) {
                        if (folderList[i].folderPassFlag == 1) {
                            lockFid = folderList[i].fid;
                            lockFolderCount++;
                        }
                    }
                    if (lockFolderCount == 1 && lockFid == oFolder.fid) {

                        MM.mailRequest({
                            "func": "mbox:setFolderPass",
                            "data": { "oldPass": folderlock.lock_pass ,"type":3},
                            "call": function () { }
                        });
                    }
                }

                MM.seqRequest(arr, function (au) {
//                    MM.doService({
//                        url: "/log/log",
//                        func: "log:deleteFolder",
//                        data: {folderList: [
//                            {fid: oFolder.fid, folderName: oFolder.name}
//                        ]}, param: ""});
                    p1.callback(au);
                    CC.showMsg(oFolder.type == 5 ? top.Lang.Mail.Write.bqsccgBxCLd : Lang.Mail.mailFolderDelSuccess, true, false, "option");//标签删除成功
                }, p1.failCallBack);

            });
        } else {
            CC.alert(Lang.Mail.folder_BeforeEmpty);
        }
    },
    /**
     * 删除邮件夹失败时的回调方法
     */
    failCallBack: function (data) {
        if (data && data.errorCode == 2323007) {
            CC.alert(Lang.Mail.folder_below_are_a_folder);
        } else {
            MM.failCallBack(data);
        }
    },
    /**
     * 文件夹拖动处理方法
     * @param {Object} from 源对象
     * @param {Object} to 目的对象
     * @param {Object} mode 拖动的方向 0:放到目标节点前面,1:放到目标节点后面
     */
    move: function (from, to, mode) {
        var p1 = this;
        var arr = [];
        var fid = 0, location = 0, parentId = 0;
        var data = {};
        if (from && to) {
            fid = from.fid;
            if (from.parentId == to.parentId) {
                location = getLocation(to, mode);
                data = {func: gConst.func.updateFolder, 'var': {fid: fid, type: 2, location: location}};
            } else {
                parentId = to.fid;
                data = {func: gConst.func.updateFolder, 'var': {fid: fid, type: 3, parentId: parentId}};
            }
            arr.push(data);
            arr.push({func: gConst.func.listFolder, 'var': {'stats': 1, type: 0}});
            MM.seqRequest(arr, p1.callback);
        }

        function getLocation(f, mode) {
            var prevL = 0, nextL = 0, location = 0;
            var endType = {
                sys: GE.adminLocation,
                admin: GE.userLocation,
                user: GE.labelLocation,
                lable: GE.allLocation
            };
            var objType = {
                "1": "sys",
                "2": "admin",
                "3": "user",
                "5": "label"
            };
            var strType = objType[f.type];
            //放到目标节点后面
            if (mode == 1) {
                prevL = f.location;
                nextL = (f.next) ? f.next.location : (prevL + GE.locationAdd);
            } else {
                //放到目标节点前面
                nextL = f.location;
                prevL = (f.prev) ? f.prev.location : (nextL - GE.locationAdd);
            }
            /*if((nextL-prevL)<2){
             if(mode==1){
             location = nextL + 1;
             }else{
             location = prevL - 1;
             }
             }*/
            prevL = Math.max(GE[strType + "Location"], prevL);
            nextL = Math.min(endType[strType] - GE.locationAdd - 1, nextL);
            location = Math.floor((prevL + nextL) / 2);
            return location;
        }
    },
    rename: function (oFolder) {
        MM.folderMain.add(oFolder.type, oFolder, true);
    },
    encrypt: function (type) {
        var passFlag = CM.folderMain.passFlag;
        var div = $("folderMain_pass");
        var modpass = $("folderPass_modpwd_span");
        var folderpass = $("folderPass_folderpwd_span");
        $("folderPass_type").value = type;
        var obj = {};
        if (this.isOk && type >= 5 && this.folderPwd != "") {
            this.encryptSave(type, this.folderPwd);
        } else {
            if (type == 4) {
                El.hide(modpass);
                El.hide(folderpass);
                El.hide(div);
            } else if (type == 1 || (type >= 5)) {
                El.show(div);
                El.show(folderpass);
                El.hide(modpass);
            } else if (type == 2) {
                El.show(div);
                El.show(modpass);
                El.hide(folderpass);
            } else if (type == 3) {
                El.show(div);
                El.show(folderpass);
                El.hide(modpass);
            }
        }
    },
    encryptSave: function (t, pwd) {
        var p1 = this;
        var passFlag = CM.folderMain.passFlag;
        var type = $("folderPass_type").value;
        var oldpwd = $("folderPass_pwd");
        var newpwd = $("folderPass_newpwd");
        var folderPass = $("folderPass_folderpwd");
        var obj = {func: gConst.func.setFolderPass, type: type, ids: []};
        var fp = folderPass.value || "";
        if (t) {
            type = t;
            fp = pwd;
        }
        var ids = [];
        if (type == 1) {
            p1.getSelectedValue(ids);
            obj.ids = ids;
            obj.newPass = fp;
        } else if (type == 2) {
            obj.oldPass = oldpwd.value;
            obj.newPass = newpwd.value;
        } else if (type == 3) {
            obj.oldPass = fp;
        } else if (type == 5) {
            p1.getSelectedValue(ids);
            obj = {func: gConst.func.updateFolderPass, type: 1, folderPass: fp, ids: ids};
        } else if (type == 6) {
            p1.getSelectedValue(ids);
            obj = {func: gConst.func.updateFolderPass, type: 2, folderPass: fp, ids: ids};
        } else if (type == 7) {
            LM.getAllFolders(fp);
            return;
        }
        var arr = [];
        arr.push(obj);
        arr.push({func: gConst.func.listFolder, folderPass: fp, 'var': {'stats': 1, type: 0}});
        MM.seqRequest(arr, function (au) {
            if (au.code == gConst.statusOk) {
                //CC.alert("操作成功！");
                if (au.result[0] === 0) {
                    MM.folderMain.isOk = true;
                    MM.folderMain.folderPwd = fp;
                    CM.folderMain = au;
                    LM.loadFolderInfo(au, true);
                    //MM.folderMain.refreshBody();
                } else if (au.result[0] === 6) {
                    CC.alert(Lang.Mail.Write.oldpwdw);
                } else {
                    CC.alert(Lang.Mail.Write.opFail);
                }
            }
        }, function () {
            CC.alert(Lang.Mail.Write.opFail);
        });
    },
    encryptFolder: function () {

    },
    /***
     * 操作
     * @param {Object} name 命令
     * @param {Object} fid 文件夹id
     * @param {Object} type 类型（文件夹/标签）
     * @param {Object} val 值（排序指令或标签颜色值）
     */
    opt: function (name, fid, type, val) {
        var p1 = this;
        var oFolder = MM.getFolderObject(fid);
        switch (name) {
            case "del":
                MM.folderMain.del(oFolder);
                break;
            case "addUser":
                MM.folderMain.add(GE.folderType.user);
                break;
            case "addLabel":
                MM.folderMain.add(GE.folderType.label, null, null, val);
                break;
            case "rename":
                MM.folderMain.rename(oFolder);
                break;
            case "empty":
                MM.folderMain.empty(oFolder);
                break;
            case "filter":
            case "label":
                var ao = {
                    name: oFolder.name.encodeHTML(),
                    folderId: oFolder.fid
                };

                if (name == "label") {
                    ao.callback = function () {
                        this.showAdd();
                        $("option_check_dealType5").checked = true;
                        this.attrs.dropLabel.setValue(oFolder.fid);
                    }
                }
                CC.setConfig('filter', ao);
                break;
            case "edit":
                CC.setConfig('4', "op=edit&fid=" + fid);
                break;
            case "pop":
                p1.pop(fid);
                break;
            case "popadd":
                CC.setConfig('341', "edit=add");
                break;
            case "popall":
                p1.pop();
                break;
            case "sort":
                p1.saveSort(fid, type, val);
                break;
            case "labelColor":
                p1.setLabelColor(oFolder, val);
                break;
        }
    },

    callback: function (au, fid) {
        var name = gConst.folderMain;
        var isJunk = false;
        var p1 = this;
        var curid = GE.tab.curid;
        var call = function () {
            //标签邮件 新增
            CC.isLabelMail();
            if(p1.folderCallback){
                p1.folderCallback(fid);
            }
        };
        var on = MM[name].opFolder;
        if (au.code == gConst.statusOk) {//&& au['var'][1].code == gConst.statusOk
            CM[name] = au;
            LM.loadFolderMain(true, call);
            if (MM[name].isDel) {
                if (GE.tab.exist(on)) {
                    MM[on].refresh(call);
                    //isJunk = true;
                }
                MM[name].isDel = false;
                /*
                 MM.doService({
                 url: "/log/log",
                 func: "log:deleteFolder",
                 data: {folderList:[{fid:fid,folderName:oFolder.name}]},
                 failCall: function(d){
                 },
                 call: function(d){
                 },
                 param: ""});
                 */
            }
        } else {
            CC.alert(Lang.Mail.sys_UnKnowErrorMsg, null, Lang.Mail.sys_UnKnowError);
        }
    },

    /***
     * 左侧文件夹
     * 刷新左侧文件夹
     */
    refreshFolders: function () {
        try {
            var folders = CM.folderMain[gConst.dataName];
            var newMailCount = 0, p1 = this;
            var fh = $(gConst.menuC.mail);

            var sc = $(gConst.menuC.service);
            El.removeChildNodes(fh);
            /*
             var unreadMessageCount = 0;
             for (var z = 0; z < folders.length; z++) {
             if (folders[z].type != 5 && folders[z].fid != 2 && folders[z].fid != 3 && folders[z].fid != 4 && folders[z].fid != 5)
             unreadMessageCount += folders[z].stats.unreadMessageCount;
             }
             var unreadFolder =
             {
             "fid": 0,
             "name": Lang.Mail.ConfigJs.unreadMail,
             "stats": {
             "attachmentNum": 0,
             "messageCount": 0,
             "messageSize": 0,
             "unreadMessageCount": unreadMessageCount,
             "unreadMessageSize": 0
             }
             }*/
            //this.createLink("sys0", unreadFolder, "", fh, false);
            //this.createFolderTree(s,fh,0);
            this.createFolderTree(p1.Folders[GE.folder.sys], fh, 0);
            this.createFolderTree(p1.Folders[GE.folder.admin], fh, 0);

            //this.createFolderTree(p1.Folders[GE.folder.admin],fh);
            //var pInner = this.createLink("", {fid:-4, name:"内部文件夹"}, "", fh, true);
            //var pAdmin = this.createLink("", {fid:-3, name:"管理文件夹"}, "", fh, true);

            this.createLink('', {fid: -1001, name: '', type: ''}, '', fh, false, 0);
            if (sc && sc.childNodes) {
                for (var i = 0; i < sc.childNodes.length; i++) {
                    var nid = sc.childNodes[i].id;
                    if (nid && (nid == '-1' || nid == '-2' || nid == '-6')) {
                        //El.removeChildNodes(sc.childNodes[i]);
                        El.remove(sc.childNodes[i]);
                        i = -1;
                    }
                }
            }

            // 用于检测不能与代收邮件夹重复
            LM.folders.push({"name": top.Lang.Mail.Write.daibanrenwu},{"name": Lang.Mail.folder_13},{"name": Lang.Mail.folder_14},{"name": Lang.Mail.Write.accoutMail});//待办任务

            // 新功能暂时屏蔽
            if (CC.isLabelMail()) {
                LM.folders.push({"name": Lang.Mail.label_MyLabel});
                var pLabel = this.createLink("", {fid: -2, name: Lang.Mail.label_MyLabel }, "", sc, true, false, 'before', 0);
                if (p1.Folders[GE.folder.label].length > 0) {
                    this.createFolderTree(p1.Folders[GE.folder.label], pLabel, 'before', "", 0);
                }
            }

            if (CC.checkConfig("mailPOP")) {
                LM.folders.push({"name": Lang.Mail.ConfigJs.popMailFolder});
                var pPop = this.createLink("",  {fid:-6, name: Lang.Mail.ConfigJs.popMailFolder,type:GE.folderType.pop}, "", sc, true, false, 'before', 0);
                if (p1.Folders[GE.folder.pop].length > 0) {
                    this.createFolderTree(p1.Folders[GE.folder.pop],pPop, 'before', "", 0);
                }
            }

            LM.folders.push({"name": Lang.Mail.folder_MyFolder});
            var pUser = this.createLink("", {fid: -1, name: Lang.Mail.folder_MyFolder, type: GE.folderType.user}, "", sc, true, false, 'before', 0);
            if (p1.Folders[GE.folder.user].length > 0) {
                this.createFolderTree(p1.Folders[GE.folder.user], pUser, 'before', "", 0);
            }


//            if(p1.Folders[GE.folder.inner].length>0){
//                this.createFolderTree(p1.Folders[GE.folder.inner],pInner);
//            }
//            if(p1.Folders[GE.folder.admin].length>0){
//                this.createFolderTree(p1.Folders[GE.folder.admin],pAdmin);
//            }

            /*if(p1.Folders[GE.folder.label].length>0){
             this.createFolderTree(p1.Folders[GE.folder.label],pLabel);
             } */

            //注册我的邮件夹节点事件            
            /*
             jQuery(pUser).bind('mouseover', function(e){
             jQuery(this).slideDown('normal');
             EV.stopPropagation(e);
             }).bind('mouseout', function(e){
             jQuery(this).slideUp('normal');
             EV.stopPropagation(e);
             }); */

            //  El.hide(pUser);

            this.createMyOffice();


        } catch (exp) {
            ch("fFMRefreshFolders", exp);
        }
    },
    initTaskRoles:function(){
        //查询当前用户的工单权限
        if(CorpType==2||CorpType=='2'){   //139企业邮箱环境
            // var config = {
            //     func: "workflow:getWorkFlowPower",
            //     data: {},
            //     call: function (resp) {
            //         if(resp["var"].workFlow==1){
            //             jQuery('#oatask').show()
            //             switch (resp["var"].workFlowType){
            //                 case 1:
            //                     gMain.taskRoles=[1,0,0]
            //                     break;
            //                 case 2:
            //                     gMain.taskRoles=[0,1,0]
            //                     break;
            //                 case 4:
            //                     gMain.taskRoles=[0,0,1]
            //                     break;
            //                 case 3:
            //                     gMain.taskRoles=[1,1,0]
            //                     break;
            //                 case 6:
            //                     gMain.taskRoles=[0,1,1]
            //                     break;
            //                 case 5:
            //                     gMain.taskRoles=[1,0,1]
            //                     break;
            //                 case 7:
            //                     gMain.taskRoles=[1,1,1]
            //                     break;
            //             }
            //         }
            //     },
            //     failCall: function(){
            //     },
            //     params: {
            //     },
            //     isNotAddUrl: true,
            //     url: '../../workflow.do',
            //     msg: ''
            // };
            // parent.MM.doService(config);
            gMain.taskRoles=[1,1,0];
        }
    },

    createMyOffice: function () {
        var $ = jQuery,
            html = "";
        //我的办公 二级菜单
        this.bindWkEv();
        this.initTaskRoles()


    },
    /*
    *
    */
    bindWkEv: function () {
        var $ = jQuery;
        $(function(){
            $("#boxWorkOrder").find("span").first().off('click').click(function () {
                var i = $(this).siblings("i");

                if (i.hasClass("i-folderOff")) {
                    i.removeClass("i-folderOff").addClass("i-folderOn");
                } else {
                    i.removeClass("i-folderOn").addClass("i-folderOff");
                }
                $(this).siblings("ul").toggle();
            });
            $("#boxWorkOrder").find("i").first().off('click').click(function () {
                var i = $(this);

                if (i.hasClass("i-folderOff")) {
                    i.removeClass("i-folderOff").addClass("i-folderOn");
                } else {
                    i.removeClass("i-folderOn").addClass("i-folderOff");
                }
                $(this).siblings("ul").toggle();
            });

            $("#boxWorkOrder").off('click','a').on("click", "a", function (e) {
                $(".navWrapper").find(".selectFolder_li").removeClass("selectFolder_li");
                $(this).parent().addClass("selectFolder_li");
            }).off("mouseenter", "a").on("mouseenter", "a", function () {
                if (!$(this).parent().hasClass("selectFolder_li")) {
                    $(this).addClass("mailFolderListColor");
                }
            }).off('mouseleave','a').on("mouseleave", "a", function () {
                $(this).removeClass("mailFolderListColor");
            });
        })


    },
    refresh: function (cb) {
        var p1 = this;
        var o = p1.name;
        /*MM.getModuleByAjax(o, function(){
         p1.refreshBody();
         if(typeof(cb)=="function"){
         cb();
         }
         }, null, true);*/
        LM.loadFolderMain(false, function(){p1.folderCallback();});
    },

    //更新body;
    refreshBody: function (cb) {
        var p1 = this;
        var o = p1.name;

        p1.refreshFolderInfo();
        p1.refreshFolders();
        if (typeof cb == "function") {
            cb();
        }
        if (GE.tab.exist(gConst.folderMain)) {
            if (!MM[o].isLoaded) {
                return;
            }
            MM[o].isLoaded = false;
            MM.updateBody(o);
        }
    },
    refreshModule: function () {
        this.refreshBody();
    },
    /***
     * 构建目录树
     * @param {Object} objFolders 文件夹数据源
     * @param {Object} root 根节点/默认：{fid:0}
     * @return 返回构建好的目录树结构的对象
     */
    buildFolders: function (objFolders, root) {
        var newFolders = [];

        function recursion(of, node) {
            var temp = [], temp1 = [];
            if (!node.nodes) {
                node.nodes = [];
            }
            for (var i = 0; i < of.length; i++) {
                var o = of[i], pId = o.parentId;
                if (node.fid == 0) {
                    o.index = i;
                }
                if (pId == node.fid) {
                    o.next = (i < of.length - 1) ? of[i + 1] : null;
                    o.prev = (i > 0) ? of[i - 1] : null;
                    if (pId == 0) {
                        newFolders.push(o);
                    } else {
                        node.nodes.push(o);
                    }
                    temp.push(o.index);
                } else {
                    temp1.push(o);
                }
            }
            for (var j = 0; j < temp.length; j++) {
                recursion(temp1, objFolders[temp[j]]);
            }

        }

        if (!root)
            root = {fid: 0};
        recursion(objFolders, root);
        return newFolders;
    },
    /***
     * 邮件夹/标签排序
     * @param {Object} objFolders
     */
    sortFolders: function (objFolders) {
        if (objFolders) {
            return objFolders.sort(function (a, b) {
                return a.location - b.location;
            });
        }
    },
    /***
     * 刷新文件夹数据
     */
    refreshFolderInfo: function () {
        var p1 = this, aw = null;
        var folders = CM.folderMain[gConst.dataName];
        var ms = 0, mc = 0, umc = 0, pc = '0%', pcn = 0;
        p1.Folders = {};
        p1.Folders[GE.folder.sys] = [];
        p1.Folders[GE.folder.admin] = [];
        p1.Folders[GE.folder.user] = [];
        p1.Folders[GE.folder.label] = [];
        p1.Folders[GE.folder.inner] = [];
        p1.Folders[GE.folder.pop] = [];
        folders = p1.sortFolders(folders);

        for (var i = 0; i < folders.length; i++) {
            aw = folders[i];
            aw.stats.messageSize = aw.stats.messageSize * 1024;//将KB转换成Byte
            switch (aw.type) {
                case 1:
                    //if(gConst.sysMenus.hasOwnProperty(aw.fid)){
                    //if (GE.folderMap && GE.folderMap[aw.fid]) {
                    if (aw.fid != 7) {
                        p1.Folders[GE.folder.sys].push(aw);
                    }
                    //}
                    //if (aw.fid != 13 && aw.fid != 14) {
                    //p1.Folders[GE.folder.sys].push(aw);
                    //}
                    // }
                    break;
                case 2:
                    if (GE.folderMap && GE.folderMap[aw.fid]) {
                        p1.Folders[GE.folder.admin].push(aw);
                    }
                    //if(aw.fid==8)
                    //p1.Folders[GE.folder.admin].push(aw);
                    break;
                case 3:
                    p1.Folders[GE.folder.user].push(aw);
                    break;
                case 5:
                    p1.Folders[GE.folder.label].push(aw);
                    break;
                case 6:
                    p1.Folders[GE.folder.pop].push(aw);
                    break;
                case 9:
                    p1.Folders[GE.folder.inner].push(aw);
                    break;
            }
            if (aw.type != 5 && !aw.virtualFolder) {
                ms += folders[i].stats.messageSize;
                mc += folders[i].stats.messageCount;
                //if(!(aw.type==1 && aw.fid>=2 && aw.fid<=4))
                umc += folders[i].stats.unreadMessageCount;
            }
        }
        // 对系统文件夹进行排序，干扰默认排序
        for (var i = 0, l = p1.Folders[GE.folder.sys].length; i < l; i++) {
            if (p1.Folders[GE.folder.sys][i].fid == 12) {
                gMain.hasDiskFolder = true;
                p1.Folders[GE.folder.sys][i]['order'] = 45;
            } else if (p1.Folders[GE.folder.sys][i].fid === 9999998) { // 对待办文件夹特殊处理

            } else {
                p1.Folders[GE.folder.sys][i]['order'] = parseInt(p1.Folders[GE.folder.sys][i].fid) * 10 - 0;
            }
        }
        p1.Folders[GE.folder.sys].sort(
            function (a, b) {
                if (a.order < b.order) return -1;
                if (a.order > b.order) return 1;
                return 0;
            }
        );

        /*p1.Folders[GE.folder.sys].sort(function(a,b){
         return a.order > b.order;
         });*/

        //p1.Folders[GE.folder.sys] = p1.buildFolders(p1.Folders[GE.folder.sys]);
        p1.Folders[GE.folder.user] = p1.buildFolders(p1.Folders[GE.folder.user]);
        p1.Folders[GE.folder.admin] = p1.buildFolders(p1.Folders[GE.folder.admin]);
        var fm = {
            messageSize: ms,
            messageCount: mc,
            unreadMessageCount: umc //未读邮件统计
            /*usedPercent:pc,
             userdPercentNum:pcn,
             totalSize:Util.formatSize(lms),
             usedSize:Util.formatSize(ms,null,2)*/
        };
        MM.folderMain.folderInfo = CC.getMailInfo(fm);
        p1.refreshUnUsedColors();
    },
    /***
     * 取得未使用的标签颜色列表
     */
    refreshUnUsedColors: function () {
        var delColor = function (colorValue, unColors) {
            for (var j = 0; j < unColors.length; j++) {
                if (colorValue == unColors[j]) {
                    unColors.splice(j, 1);
                    break;
                }
            }
            return unColors;
        };
        var p1 = this;
        var colors = [];
        for (var i = 0; i < gConst.labelColor.length; i++) {
            colors.push(i);
        }
        for (var i = 0; i < p1.Folders[GE.folder.label].length; i++) {
            var folderColor = p1.Folders[GE.folder.label][i].folderColor
            colors = delColor(folderColor, colors);
        }
        p1.unUsedColors = colors;
    },
    mouseOver: function (o, type) {
        if (o && type) {
            switch (type) {
                case 'tr':
                    //o.style.backgroundColor = "#FFFDD7";
                    o.className = "overColor";
                    break;
                case 'div':
                    o.getElementsByTagName("i")[0].style.display = "block";
                    break;
            }
        }
    },
    mouseOut: function (o, type) {
        if (o && type) {
            switch (type) {
                case 'tr':
                    //o.style.backgroundColor = "";
                    o.className = "";
                    break;
                case 'div':
                    o.getElementsByTagName("i")[0].style.display = "none";
                    //o.getElementsByTagName("ul")[0].style.display = "none";
                    break;
                case 'ul':
                    o.style.display = "none";
                    break;
            }
        }
    },
    onClick: function (o, type, color) {
        if (o && type) {
            switch (type) {
                case 'div':
                    o.getElementsByTagName("ul")[0].style.display = "block";
                    break;
                case 'labelColor':
                    o.parentNode.style.display = "none";
                    //alert("你选择的颜色代码是{0}".format(color));
                    break;
            }
        }
        EV.stopEvent();
    },
    getSelectFolders: function (folders, id, fid) {
        var p1 = this, html = [], icon = "";
        if (id) {

            html.push('<label class="j_label">' + Lang.Mail.parent_folder + '：</label>');
            // html.push(Lang.Mail.parent_folder + '：<select name="selParentFolder_'+id+'" id="selParentFolder_'+id+'">');
            //html.push("<option value='0'>" + Lang.Mail.my_folder + "</option>");
            //html.push("<div id=\"dropMail_Div\" onclick=\"Main.AdvDropOnClick(this,'obj')\">");
            //html.push('<div href="javascript:void(0)" class="dropDownA"><i class="i_triangle_d"></i></div>');
            //html.push('<div class="dropDownText" id="dropMail_Text" name="mailFolder0">' + Lang.Mail.my_folder +'</div></div>')
        }
        var data = [];
        dropMailType = new DropSelect({
            id: "folderName_foderManage",
            data: data,
            type: "fileTree",
            selectedValue: "",
            width: 160,
            height: 200,
            folderList: [
                {"text": Lang.Mail.folder_MyFolder, "value": ""}
            ]
        });
        for (var i = 0, l = folders.length; i < l; i++) {
            aw = folders[i];
            //if(aw.type == 1 && aw.fid <= 6) {
            if (aw.type == 1) {
                continue;
            }
            data.push(aw);
        }
        var recursion = function (of, icon, limit) {
            var aw = null, hassub = false, text = "", isCurEnd = false, limit = ++limit || 0;
            var selected = "", icon1 = "", icon2 = "";
            for (var i = 0, l = of.length; i < l; i++) {
                aw = of[i];

                // 只有我的邮件夹才可以新建目录
                if (aw.type == 1) {
                    //if(aw.type == 1 && aw.fid <= 6) {
                    continue;
                }
                hassub = (aw.nodes && aw.nodes.length > 0);
                isCurEnd = (i == of.length - 1);
                icon1 = icon || "";
                icon2 = (aw.parentId == 0) ? "" : ((isCurEnd) ? "└ " : "├ ");
                text = icon1 + icon2 + aw.name;// + " id:" + aw.fid +", pid:"+aw.parentId;
                selected = (aw.fid == fid) ? " selected" : "";
                //html.push("<option value='" + aw.fid + " '"+selected+">" + text + "</option>");
                //data.push({text:text,value:aw.fid});
                // limit 级数控制
                if (hassub && (limit + 1) < gConst.folderLimit) {
                    icon1 += (isCurEnd || aw.parentId == 0) ? "&nbsp;" : "│ ";
                    recursion(aw.nodes, icon1, limit);
                }
            }
        };
        recursion(folders);
        dropMailType.data = data;
        //html.push('<span class="dropDown w120">')
        html.push('<div class="j_element p_relative">' + dropMailType.getHTML() + '</div>');

        //html.push('</span>');
        return html.join("");
    },
    createFolderTree: function (of, pn, isEnd, pos, index) {
        var aw = null, icon = "", hassub = false, p1 = this;
        var cn = null, isCurEnd = false;//,isEnd = false;
        pos = pos || 'after';
        if (!pn) {
            return false;
        }

        for (var i = 0, l = of.length; i < l; i++) {
            aw = of[i];
            hassub = (aw.nodes && aw.nodes.length > 0);
            isCurEnd = (i == l - 1) ? true : false;
            //isEnd = (aw.next?false:true);
            icon = (isCurEnd && aw.type > 1) ? "last" : "";
            icon = (hassub) ? "folderSub" : icon;
            cn = p1.createFolderLink(aw, pn, hassub, icon, isCurEnd, pos, index);
            if (hassub) {
                p1.createFolderTree(aw.nodes, cn, isCurEnd, pos, index + 1);
            }
        }
    },
    /***
     * 创建文件夹
     * @param {Object} aw 文件夹对象
     * @param {Object} fp 父节点对象
     * @param {Boolean} hassub 是否拥有子节点
     * @param {String} cn 树形节点图标
     * @param {String} pos 插入父节点的位置 after:结尾处，before：开始处
     */
    createFolderLink: function (aw, fp, hassub, icon, isEnd, pos, index) {

        var o = CC.getFolderTypeName(aw.type) + aw.fid;
        if (!icon && MM[o]) {
            icon = MM[o].icon;
        }
        icon = icon || "mid";
        return this.createLink(o, aw, icon, fp, hassub, isEnd, pos, index);
    },
    /***
     * 创建左侧文件夹链接
     * @param {Object} name 文件夹模块名
     * @param {Object} id   id
     * @param {Object} text 文件夹名称
     * @param {Object} icon 图标
     * @param {Object} un   未读邮件数
     * @param {Object} ms   邮件总数
     * @param {Object} fp   父节点id
     * @param {Object} hassub 是否拥有子字节
     * @param {String} pos 插入父节点的位置 after:结尾处，before：开始处
     */
    createLink: function (name, aw, icon, fp, hassub, isEnd, pos, index) {
        var p1 = this;
        var o = name;
        var id = aw.fid;
        var text = aw.name;
        var evts = {};
        if (!aw.stats) {
            aw.stats = {};
        }
        LM.folders.push(aw);
        aw.stats.messageCount = Math.max(aw.stats.messageCount, 0);
        aw.stats.unreadMessageCount = Math.max(aw.stats.unreadMessageCount, 0);
        var un = aw.stats.unreadMessageCount;
        var ms = aw.stats.messageCount;

        var type = (aw.type == GE.folderType.user) ? "User" : ((aw.type == GE.folderType.pop) ? "Pop" : "Label");
        var fcl = function () {
            if (id == 0 || aw.flag) {
                CC.receiveMail(aw.flag);
                //CC.searchMailByParm("",0);
                //CC.searchNewMail(0,true);
                // CC.goFolder(0, "sys0");
            }
            else {
                CC.goFolder(id, o);
            }
        };
        if (id < 0) {
            fcl = function () {
                CC.goFolderMain(function (o) {
                    //标签邮件 新增
                    CC.isLabelMail() && p1.folderCallback(id);
                });
            };
        }

        var action = "";
        var actionClick = function () {
        };
        var attr = {};

        function getAttr(un, ms) {
            if (un) {
                return '<a style="display:inline;padding-left:5px;font-weight:bold" class="leftFolder-mailNum" title=' + (ms > 0 ? Lang.Mail.unreadmailCount_AllCount.format(un, ms) : Lang.Mail.unreadmailCount.format(un)) + '>(' + un + ')</a>';
            } else {
                return "";
            }

        }

        function getAction(text) {
            return '[' + text + ']';
        }

        //我的邮件夹（新建）
        //if (aw.type != GE.folderType.pop) {
            attr.text = getAttr(un, aw.type != GE.folderType.label ? ms : 0);
            attr.id = 'leftMenu_newMailCount_' + o;
            if (o != "sys0") {
                attr.call = function () {
                    if (aw.flag && aw.flag.taskFlag) {
                        return false; // 任务邮件后面的数字点击不让跳转
                    }
                    CC.searchNewMail((aw.type == GE.folderType.label ? 0 : id), true, (aw.type == GE.folderType.label ? [id] : null), aw.flag);
                };
            }
        //}
        if ((id == GE.folder.virus || id == GE.folder.junk || id == GE.folder.del) && ms > 0) {
            //if (GC.check("MAIL_FOLDER_EMPTY")) {
            actionClick = function () {
                MM["folderMain"].opt("empty", id);
            };
            action = Lang.Mail.folder_Empty
            /*getAction('');Lang.Mail.folder_Empty*/
            //}
        }

        //我的邮件夹；
        if (name == "" && (id == -1 || id == -2)) {
            var checkKey = id ==-1?"MAIL_CONFIG_FOLDER":"MAIL_MANAGER_LABELMAIL";
            if (GC.check(checkKey)) {
                attr.actionClass = 'add';
                actionClick = function (e) {
                    MM["folderMain"].opt("add" + type);
                    var ev = EV.getEvent(e);
                    ev.cancelBubble = true;
                };
                action = getAction(Lang.Mail.folder_New);
            }
        }

        // 代收文件夹“添加图标”的单击事件
        if (id === -6) {
            attr.actionClass = 'add';
            actionClick = function (e) {
                var ev = EV.getEvent(e);
                
                CC.setConfig('mailPOP', true);
                mailPOP.showAdd(0);
                mailPOP.setHeight();
                mailPOP.updatePosition("pmailPOPWrapper");
                mailPOP.correctWidthInIE6("pmailPOPWrapper",1);
                ev.cancelBubble = true;
            }
            action = getAction(Lang.Mail.folder_New);
        }
        pos = pos || 'after';
        var pm = {
            id: id,
            text: text,
            folderColor: aw.folderColor,
            url: fcl,
            isoutlink: false,
            isnewwin: false,
            isbold: false,
            isred: false,
            hasSub: hassub,
            action: action,
            actionClick: actionClick,
            parentNode: fp,
            attr: attr,
            evts: evts,
            pos: pos,
            passFlag: aw.folderPassFlag,
            type: aw.type,
            status: aw.stats
        };
        return LM.addLink(pm, {li: icon}, isEnd, index);
    },
    /***
     * Pop获取邮件
     * @param {Object} fid
     */
    pop: function (fid) {
        CC.showMsg(Lang.Mail.folder_NowPop, true);
        var url = "pref/popStats.jsp?sid=" + GC.coreSid + "&rcvall=true";
        if (fid) {
            url += "";
        }
        window.setTimeout(function () {
            //var opt = {
            //  async:true
            //};
            Ajax.get(url, null);
            CC.alert(Lang.Mail.folder_PopSuccess);
        }, 1000);
    },
    /***
     * 设置邮件夹/标签排序
     * @param {Object} fid 邮件夹/标签id
     * @param {Object} type 类别
     * @param {Object} cmd 移动'up'/'down'
     */
    saveSort: function (fid, type, cmd) {
        var p1 = this;
        var data = p1.Folders[type];
        var obj;
        var sortObj;
        var isFound = false;

        var opt = function (data) {
            data.each(function (i, o) {
                if (isFound) return;

                if (o.fid == fid) {
                    obj = o;
                    if (cmd == 'up') {
                        sortObj = data[i - 1];
                    } else {
                        sortObj = data[i + 1];
                    }
                    isFound = true;
                } else if (o.nodes.length > 0) {
                    opt(o.nodes);
                }
            });
        };

        opt(data);

        if (typeof(sortObj) == 'undefined' || typeof(sortObj) == null) {
            return;
        }
        var aw = {
            item: [
                {
                    func: gConst.func.updateFolder,
                    'var': {
                        fid: obj.fid,
                        type: 2,
                        parentId: obj.parentId,
                        name: obj.name,
                        folderPass: '',
                        location: sortObj.location,
                        pop3Flag: obj.pop3Flag
                    }
                },
                {
                    func: gConst.func.updateFolder,
                    'var': {
                        fid: sortObj.fid,
                        type: 2,
                        parentId: sortObj.parentId,
                        name: sortObj.name,
                        folderPass: '',
                        location: obj.location,
                        pop3Flag: sortObj.pop3Flag
                    }
                },
                {
                    func: gConst.func.listFolder,
                    'var': {
                        stats: 0,
                        type: 0
                    }
                }
            ]
        };
        var fcb = function () {
            CC.alert(Lang.Mail.fail);
        };
        MM.mailRequest({
            func: gConst.func.seq,
            data: aw,
            call: p1.callback,
            failCall: fcb
        });
    },
    /***
     * 设置标签颜色
     * @param {Object} oFolder
     * @param {Object} val
     */
    setLabelColor: function (oFolder, val) {
        var p1 = this;
        var aw = {
            item: [
                {
                    func: gConst.func.updateFolder,
                    'var': {
                        fid: oFolder.fid,
                        type: 5,
                        parentId: oFolder.parentId,
                        name: oFolder.name,
                        folderPass: '',
                        folderColor: val
                    }
                },
                {
                    func: gConst.func.listFolder,
                    'var': {
                        stats: 0,
                        type: 0
                    }
                }
            ]
        };
        var fcb = function () {
            CC.alert(Lang.Mail.fail);//'修改标签颜色失败'
        };
        MM.mailRequest({
            func: gConst.func.seq,
            data: aw,
            call: p1.callback,
            failCall: fcb
        });
    },
    initDragEvent: function () {
        var p1 = this;
        var o = p1.name;
        var table = p1.listFolderMainDiv;
        EV.observe(table, "mousedown", MM.folderMain.mouseDown, false);
    },
    mouseDown: function () {
        try {
            var ev = EV.getEvent();
            var target = EV.getTarget(ev, true);
            var targetName = El.getNodeType(target);
            var up = El.getParentNodeIsTag(target, "tr");
            if (!up && targetName != "a") {
                return;
            }
            var type = up.id.split("_")[1];
            if (type == GE.folder.sys) {
                return;
            }
            var p1 = MM.folderMain;
            var strDrag = up.childNodes[0].getElementsByTagName("a")[0];
            if (!strDrag) {
                return;
            }
            var strDragTip = strDrag.innerHTML;
            up.mouseDownY = EV.pointerY(ev);
            up.mouseDownX = EV.pointerX(ev);
            var oDrag = new Drag("folderMain", up);
            var oDragItem = oDrag.getDragItem(strDragTip);
            /*MM.folderMain.drag = oDrag;
             oDrag.doDragOver = MM.folderMain.handleDrag;
             oDrag.doDragUp = MM.folderMain.moveByDrag;
             oDrag.init();*/
        } catch (exp) {
        }
        return false;
    }, /*拖拽
     handleDrag: function(){
     if (GE.Drag.moveType == "folderMain") {
     var ev = EV.getEvent();
     var target = EV.getTarget(ev, true);
     var targetName = El.getNodeType(target);
     var targetParent = El.getParentNodeIsTag(target, "tr");
     var oDrag = MM.folderMain.drag;
     var temp,type,fid,isOk = false;
     if (targetParent) {
     var id = targetParent.id;
     var fromId = oDrag.div.id;
     var fromType = fromId.split("_")[1];
     temp = id.split("_");
     type = temp[1];
     fid = temp[2];
     isOk = (targetName.inStr("tr,td,a,th")) && (id != fromId);
     if (isOk && checkIsFolder(target,fromType)) {
     oDrag.folderMainMoveTo = {type:type,fid:fid,y:EV.pointerY(ev)};
     oDrag.isOn = true;
     } else {
     oDrag.folderMainMoveTo = null;
     oDrag.isOn = false;
     }
     }else{
     oDrag.folderMainMoveTo = null;
     oDrag.isOn = false;
     }
     }

     function checkIsFolder(target,type){
     var af = target;
     var i = 0;
     while (af && af != af.parentNode && i < 5) {
     if (af.id == gConst.listFolderMainTableId+type) {
     return true;
     }
     af = af.parentNode;
     i++;
     }
     return false;
     }
     },*/
    /**
     * 移动处理方法
     * @param {Object} moveTo 移动的目的对象数据
     * @param {Object} moveDiv 移动的dom对象

     moveByDrag: function(moveTo,moveDiv){
        if (moveTo&&moveDiv.id) {
            var p1 = MM.folderMain;
            var temp = moveDiv.id.split("_");
            var fromType = temp[1];
            var fromFid = temp[2];
            var from = MM.getFolderObjectFromTree(fromType,fromFid);
            var toType = moveTo.type;
            var toFid = moveTo.fid;
            var fromY = moveTo.y;
            var ev = EV.getEvent();
            var toY = EV.pointerY(ev);
            var mode = (fromY-toY>0)?0:1;
            var to = MM.getFolderObjectFromTree(toType,toFid);
            if(!to&&toFid=="0"){
                to = {fid:0,parentId:0,type:from.type};
            }
            p1.move(from,to,mode);
        }
        EV.stopEvent(ev);
    },*/
    /**
     * 设置checkbox状态
     * @param {Boolean} check true||false
     */
    checkAll: function (type, check) {
        var ak = document.getElementsByName("folderMain_cb_" + type);
        for (var i = 0, m = ak.length; i < m; i++) {
            if (ak[i].checked == check) {
                continue;
            }
            ak[i].checked = check;
            if (typeof(wo) == "function") {
                wo(ak[i], bx);
            }
        }
    },
    getColorHTML: function () {
        var html = [];
        for (var i = 0, l = gConst.labelColor.length; i < l; i++) {
            html.push('<li index="{0}"><a href="javascript:;"><i class="i-colorsquare mr_5 {1}"></i></a></li>'.format(i, gConst.labelColor[i]));
        }
        return '<ul>' + html.join("") + '</ul>';
    },
    checkAllType: function (check) {
        this.checkAll(GE.folder.sys, check);
        this.checkAll(GE.folder.user, check);
        this.checkAll(GE.folder.label, check);
    },
    getSelectedValue: function (ids) {
        var p1 = this;
        var div = $(gConst.listFolderMainId);
        var strCbName = "folderMain_cb_";
        try {
            var ak = div.getElementsByTagName("input");
            for (var i = 0, m = ak.length; i < m; i++) {
                var item = ak[i];
                if (item.type == "checkbox" && item.name.indexOf(strCbName) >= 0 && item.checked) {
                    ids.push(item.value - 0);
                }
            }
            return ids;
        } catch (e) {
            return ids;
        }
    },
    /**
     * 文件夹回调函数
     * @param id
     * @param callback
     */
    folderCallback: function (id, callback) {
        var p1 = this;
        var $ = jQuery;
        var m = $(MM['folderMain'].listFolderMainDiv),
            l = $("#listForderMainTable_" + (id == -1 ? "user" : "label")),
            ts = l.offset();

        try{
            $(MM['folderMain'].listFolderMainDiv).scrollTop((ts.top + m.scrollTop()) - (id == -1 ? 120 : 140));

            //给列标签列表初始化，色块控件
            $(".col_sld").colorbox({
            direction: "Right",
            callback: function (val, color) {
                var target = this.element,
                    fid = target.data("fid");

                var oFolder = MM.getFolderObject(fid);
                if (oFolder) {
                    MM.seqRequest([
                        {
                            //修改文件夹
                            func: gConst.func.updateFolder,
                            'var': {
                                fid: fid,
                                type: 5,
                                folderColor: val
                            }
                        }
                    ], function () {
                        target[0].className = "col_sld mr_5 " + color;
                        LM.loadFolderMain(false, function () {
                            p1.folderCallback();
                        });
                        CC.showMsg(top.Lang.Mail.Write.bqxgcgghlRf, true, false, "option");//标签修改成功
                    }, function () {
                    });
                }
            }
        });
        }
        catch(e){

        }
        callback && callback.call(this, id);
    }
};


