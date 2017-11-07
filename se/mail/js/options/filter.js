var filter = new OptionBase();
filter.opAttrs = {
    //    '0': '不设置',CMail.Mail.ConfigJs.filter_op_text_excludes
    //    '1': '包括',
    //    '2': '不包括',
    //    '3': '是',
    //    '4': '不是',
    //    '5': '以..开始',
    //    '6': '以..结束'
    '0': Lang.Mail.ConfigJs.filter_op_text_Noset,
    '1': Lang.Mail.ConfigJs.filter_op_text_contains,
    '2': Lang.Mail.ConfigJs.filter_op_text_excludes,
    '3': Lang.Mail.ConfigJs.reply_lbl_yes,
    '4': Lang.Mail.ConfigJs.filter_op_text_No,
    '5': Lang.Mail.ConfigJs.filter_op_text_startsWith,
    '6': Lang.Mail.ConfigJs.filter_op_text_endsWith
};

filter.attrs = {
    id          : 'filter',
    authority   : 'MAIL_MANAGER_FILTER',
    free        : false,
    divId       : 'pageCreateFilter',
    tableClass  : "",
    dropFolder  : null,
    dropMailType: null,
    textBox     : null,
    maxSize     : 100, //最大保存数
    list        : { type: "url", func: gConst.func.getFilter, data: {}}, //获取数据/列表时指令，数据
    save        : {func: gConst.func.setFilter},                                  //删除数据时func指令，报文格式
    del         : {},                               //删除数据时func指令，报文格式，无删除操作留空
    data        : {
        /*
         name: {
         text: Lang.Mail.ConfigJs.filter_filter_name,
         type: 'text',
         className: '',
         attribute: {
         defaultValue: ''
         },
         check: { type: "empty", tips: Lang.Mail.ConfigJs.InputRuleName }
         },
         */
        from              : {
            text     : '',
            type     : 'text',
            attribute: {
                value       : '',
                defaultValue: ''
            }
        },
        to                : {
            text     : '',
            type     : 'text',
            attribute: {
                value       : '',
                defaultValue: ''
            }
        },
        subject           : {
            text     : '',
            type     : 'text',
            attribute: {
                value       : '',
                defaultValue: ''
            }
        },
        dealHistoryMail   : {
            text     : '',
            type     : 'checkbox',
            attribute: {
                value       : '',
                defaultValue: '1'
            },
            items    : { '2': Lang.Mail.ConfigJs.hisMail },
            format   : 'int'
        },
        mailSizeType      : {
            text     : Lang.Mail.ConfigJs.mailSize,
            type     : 'select',
            attribute: {
                value       : '',
                defaultValue: '0'
            },
            items    : {
                0: Lang.Mail.ConfigJs.filter_op_text_Noset,
                1: Lang.Mail.ConfigJs.GreaterOrEqual,
                2: Lang.Mail.ConfigJs.Lessthan
            },
            format   : 'int'
        },
        mailSize          : {
            text     : '',
            type     : 'text',
            attribute: {
                value       : '',
                defaultValue: ''
            }
        },
        conditionsRelation: {
            text     : '',
            type     : 'radio',
            attribute: {
                value       : '',
                defaultValue: '1'
            },
            items    : {"1": Lang.Mail.ConfigJs.allConditions, "2": Lang.Mail.ConfigJs.oneConditions},
            format   : 'int'
        },
        dealType          : {
            text     : Lang.Mail.ConfigJs.filter_all_the_rules,
            type     : 'radio',
            attribute: {
                value       : '',
                defaultValue: '0'
            },
            format   : 'int',
            items    : {'0': Lang.Mail.ConfigJs.deleteMail, '1': Lang.Mail.ConfigJs.filter_ReeReject, '2': Lang.Mail.ConfigJs.filter_Move, '3': Lang.Mail.ConfigJs.pref_forward, '4': Lang.Mail.ConfigJs.pref_autoresp, '5': Lang.Mail.ConfigJs.filter_tag, '6': Lang.Mail.ConfigJs.mark, '7': Lang.Mail.ConfigJs.setHaveRead }
        },
        forwardAddr       : {
            text     : Lang.Mail.ConfigJs.filter_ForwardAddr,
            type     : 'text',
            attribute: {
                value       : '',
                defaultValue: ''
            },
            format   : 'string'
        },
        forwardBakup      : {
            text     : '',
            type     : 'checkbox',
            attribute: {
                value       : '',
                defaultValue: '1'
            },
            items    : { '1': Lang.Mail.ConfigJs.filter_backup },
            format   : 'int'
        },
        replayContent     : {
            text     : Lang.Mail.ConfigJs.filter_ReContent,
            type     : 'textarea',
            className: 'replayContent',
            format   : 'text'

        },
        ignoreCase        : {
            text     : '',
            type     : 'checkbox',
            attribute: {
                value       : '1',
                defaultValue: '1'
            },
            items    : { '1': Lang.Mail.ConfigJs.filter_ignorecase },
            format   : 'int'
        },
        folderId          : {
            text     : "",
            type     : 'select',
            attribute: {
                value       : '',
                defaultValue: '1'
            },
            items    : {},
            format   : 'int',
            noset    : true
        },
        labelId           : {
            text     : "",
            type     : 'select',
            attribute: {
                value       : '',
                defaultValue: '1'
            },
            items    : {},
            format   : 'int',
            noset    : true
        },
        moveToFolder      : {
            text     : "",
            type     : 'text',
            attribute: {
                value       : '',
                defaultValue: '1'
            },
            items    : {},
            format   : 'int',
            noset    : true
        },
        attachLabel       : {
            text     : "",
            type     : 'text',
            attribute: {
                value       : '',
                defaultValue: '1'
            },
            items    : {},
            format   : 'int',
            noset    : true
        }
    }

};

filter.init = function (id, pm) {
    this.attrs.data.folderId.items = CC.getFolders();
    this.attrs.dropFolder = new DropSelect({
        id           : "opFolder",
        data         : this.attrs.data.folderId.items,
        type         : "fileTree",
        selectedValue: "1",
        width        : 200,
        height       : 200
    });
    if (CC.isLabelMail()) {
        this.attrs.data.labelId.items = this.getFolders([GE.folder.label]);
        this.attrs.dropLabel = new DropSelect({
            id           : "opLabel",
            data         : this.attrs.data.labelId.items,
            type         : "fileTree",
            selectedValue: "1",
            width        : 200,
            height       : 200
        });
    }
    this.attrs.dropMailType = new DropSelect({
        id           : "opMailType",
        data         : [
            {text: Lang.Mail.ConfigJs.GreaterOrEqual, value: "1"},
            {text: Lang.Mail.ConfigJs.Lessthan, value: "2"}
        ],
        type         : "",
        selectedValue: "1",
        width        : 117
    });
    /*this.toolTip_Filter =new ToolTips({
     id:"toolTip_Filter",
     direction:ToolTips.direction.Right,
     //closeTime : 10000,
     //left: 511,
     //top: -44
     });*/
    this.request(this.attrs, function (attrs, ad) {
        this.getHtml(attrs, ad, pm);
    });

};
filter.initFolderTree = function () {
    var items = this.attrs.data.folderId.items;
    var drop_ul = jQuery("#dropMailUL");
    var drop_li = drop_ul.children();
    var temphtml = [];
    temphtml.push(drop_li[0].outerHTML);
    drop_ul.empty();
    var getFolderTree = function (nodes, icon) {
        var aw = null, icon1 = "", icon2 = "", text = "", isCurEnd = false;
        for (var i = 0; i < nodes.length; i++) {
            aw = nodes[i];
            isCurEnd = (i == nodes.length - 1);
            icon1 = icon || "";
            icon2 = (aw.parentId == 0) ? "" : ((isCurEnd) ? "└ " : "├ ");
            text = icon1 + icon2 + aw.name;

            temphtml.push('<li><a href="#" id="dropMail_A{0}"  onclick="Main.AdvDropOnClick(this)" >'.format(aw.fid));
            temphtml.push('<span class="text">{0}</span></a>'.format(text));
            temphtml.push('</li>');
            if (aw.nodes && aw.nodes.length > 0) {
                icon1 += (isCurEnd || aw.parentId == 0) ? "&nbsp;" : "│ ";
                getFolderTree(aw.nodes, icon1);
            }
        }
    };
    getFolderTree(items);
    drop_ul.html(temphtml.join(""));
};
/***
 * 获取过滤器页面HTML结构
 * @param {Object} attrs
 * @param {Object} ad
 */
filter.getHtml = function (attrs, ad, pm) {
    var html = [];
    this.dataList = ad.sort(function (a, b) {
        return a.sortId - b.sortId;
    });
    var opAttrs = this.opAttrs;
    var id = attrs.id;
    html.push("<div class=\"bodySet\" style='display:none;' id=\"pageCreateFilter\">");
    //html.push(this.getAddHtml(attrs));
    html.push("</div>");
    html.push("<div class=\"bodySet\" id=\"pageFilter\">");
    html.push("<div id=\"container\">");

    html.push(this.getTopHtml());
    html.push(this.getLeftHtml());


    html.push(this.getNavMenu(id));

    html.push('<div class="setWrapper" id="filterList">');
    html.push(' <div class="write_adr_wrap">');
    html.push('   <a href="javascript:fGoto();" class="n_btn_on font-bold" onclick="filter.showAdd();"><span><span>{0}</span></span></a>'.format(Lang.Mail.ConfigJs.newFilter_add));
    html.push(' </div>');
    html.push(' <div class="set_rule_box">');
    var htmlStr = Lang.Mail.ConfigJs.newFilter_Count.format(this.attrs.maxSize, ad.length);
    html.push('   <h3>' + Lang.Mail.ConfigJs.newFilter_ListTitle + '<span> ' + htmlStr + '</span></h3>');
    html.push('   <h4>' + Lang.Mail.ConfigJs.newFilter_Explain + '</h4>');


    try {
        if (ad.length == 0) {
            html.push('<p class="set_rule_box_tips">' + Lang.Mail.ConfigJs.newFilter_NotData + '</p>');
        }
        else {

            html.push("<div class=\"set_mail_table pt_10\">");
            html.push("<table class=\"addr_table_head\" width=\"100%\">");
            html.push("<tr>");
            html.push("<td width=\"85\" class=\"td1\">" + Lang.Mail.ConfigJs.newFilter_Sequence + "</td>");
            html.push("<td class=\"td2\">" + Lang.Mail.ConfigJs.newFilter_Rules + "</td>");
            html.push("<td width=\"210\" class=\"td3\">" + Lang.Mail.ConfigJs.newFilter_Operate + "</td>");
            html.push("</tr>");
            html.push("</table>");
            html.push("<table class=\"addr_table_body td-color\" width=\"100%\">");
            for (var i = 0; i < ad.length; i++) {
                var item = ad[i];
                html.push("<tr>");
                html.push("<td width=\"85\" class=\"td1\">" + (i + 1) + "</td>");
                //html.push(this.getContent(item));
                html.push("<td class=\"td2\">{0}</td>".format(this.getContent(item)));
                html.push("<td width=\"210\" class=\"td3\">");
                html.push("<a href=\"javascript:fGoto();\" class=\"mr_15\" onclick=\"{0}.update({1},{2});return false;\">{3}</a>".format(id, i, item.filterId, Lang.Mail.ConfigJs.newFilter_Update))
                html.push("<a href=\"javascript:fGoto();\" onclick=\"{0}.del({1});return false;\"  class=\"mr_15\">{2}</a>".format(id, item.filterId, Lang.Mail.ConfigJs.newFilter_Delete))
                if (ad.length > 1) {
                    if (i == 0) {
                        html.push("<a href=\"javascript:fGoto();\" class=\"move-down\" onclick=\"{0}.listSort({1},'down');return false;\">{2}<i title='{3}'></i></a>".format(id, i, "", Lang.Mail.ConfigJs.newFilter_MoveDown))
                    }
                    else if (i + 1 == ad.length) {
                        html.push("<a class=\"move-up mr_15\" href=\"javascript:fGoto();\" onclick=\"{0}.listSort({1},'up');return false;\">{2}<i title='{3}'></i></a>".format(id, i, "", Lang.Mail.ConfigJs.newFilter_MoveUp));
                    }
                    else {
                        html.push("<a href=\"javascript:fGoto();\" class=\"move-down\" onclick=\"{0}.listSort({1},'down');return false;\">{2}<i title='{3}'></i></a>".format(id, i, "", Lang.Mail.ConfigJs.newFilter_MoveDown))
                        html.push("<a class=\"move-up mr_15\" href=\"javascript:fGoto();\" onclick=\"{0}.listSort({1},'up');return false;\">{2}<i title='{3}'></i></a>".format(id, i, "", Lang.Mail.ConfigJs.newFilter_MoveUp));
                    }
                }

                html.push("</td>");
                html.push("</tr>");
            }
            html.push("</table>");
            html.push("</div>");
        }
        html.join("");

    } catch (e1) {

    }

    html.push(' </div><!--set_rule_box-->');
    html.push('</div><!--set_content-->');
    html.push('</div>');
    /*
     html.push("<div class=\"setWrapper\">");
     //html.push("<h1>" + Lang.Mail.ConfigJs.filter_filterlist + "</h1>");
     html.push("<p class=\"action\">");
     html.push("<a class=\"btn\" href=\"javascript:fGoto();\" onclick=\"{0}.showAdd();\"><b class=\"r1\"></b><span class=\"rContent\"><span>{1}</span></span><b class=\"r1\"></b></a>".format(id, Lang.Mail.ConfigJs.filter_newfilter));
     html.push("</p>");
     html.push("<p class=\"explanation\">");
     html.push(Lang.Mail.ConfigJs.filter_prompt_filter);
     html.push("</p>");
     html.push('<table>');
     html.push('<tr clas="head">');
     //html.push('<td class="order">' + Lang.Mail.ConfigJs.filter_order + '</td>');
     html.push('<td class="name">' + Lang.Mail.ConfigJs.filter_filter_name + '</td><td class="content">' + Lang.Mail.ConfigJs.filter_filter_rule + '</td><td class="action">' + Lang.Mail.ConfigJs.filter_filter_manage + '</td></tr>');
     try {
     for (var i = 0; i < ad.length; i++) {
     var item = ad[i];
     html.push('<tr>');
     html.push('<td class="name">{0}</td>'.format(item.name.decodeHTML()));
     html.push('<td class="content">');
     html.push(this.getContent(item));
     html.push('</td>');
     html.push('<td class="action"><a href="javascript:fGoto();" onclick="{0}.update({1},{2})">{3}</a><a href="javascript:fGoto();" onclick="{0}.del({2});return false">{4}</a></td>'.format(id, i, item.filterId, Lang.Mail.ConfigJs.sign_btn_update, Lang.Mail.ConfigJs.filter_deletefilter));
     html.push('</tr>');
     }
     html.join("");
     } catch (e1) {

     }
     html.push('</table>');
     html.push("</div></div>");
     */


    MM[gConst.setting].update(id, html.join(""));
    pref.updatePosition("filterList");

    (CC.isLabelMail() && pm && pm.callback) && pm.callback.call(this, null);
    /*
     if (pm) {
     this.showAdd();
     //this.getEl("fromType").selectedIndex = 1;
     //        document.getElementById("option_fromType").selectedIndex = 1;
     for (var o in pm) {
     if (this.attrs.data[o].type == 'text') {
     this.getEl(o).value = pm[o];
     }
     else
     if (this.attrs.data[o].type == 'select') {
     var objs = this.getEl(o);
     for (var i = 0; i < objs.length; i++) {
     if (objs[i].value == pm[o]) {
     objs[i].selected = true;
     break;
     }
     }
     }
     }
     }
     */

};

/***
 * 显示新建过滤器界面
 * @param {Object} b 是否隐藏新建过滤器并返回到过滤器列表
 */
filter.showAdd = function (b, id, item) {
    var oAdd = $("pageCreateFilter");
    var sortid = (item && item.sortId) ? item.sortId : 0;
    oAdd.innerHTML = this.getAddHtml(this.attrs, id, sortid);

    this.attrs.dropMailType.loadEvent();
    this.attrs.dropFolder.loadEvent();
    CC.isLabelMail() && this.attrs.dropLabel.loadEvent();
    pref.updatePosition("filterWrapper");
    //setTimeout(function(){
    //  RTB_items.init();
    //  if(item && item.replayContent)
    //      RTB_items["option_filter_replay_content"].setEditorValue(item.replayContent);
    //  },200);
    var olist = $("pageFilter");
    if (b) {
        El.show(olist);
        El.hide(oAdd);
    } else {
        this.initDataField();
        if (id) {
            this.bindUpdateData(item);
        }
        El.show(oAdd);
        El.hide(olist);
    }
    var obj_from = document.getElementById("option_from");
    var obj_to = document.getElementById("option_to");
    var obj_subject = document.getElementById("option_subject");
    var obj_mailSize = document.getElementById("option_mailSize");

    //obj_from.maxLength=100;
    obj_to.maxLength = 100;
    obj_subject.maxLength = 100;
    obj_mailSize.maxLength = 7;

    var txtOnclick = function (obj) {
        var txtid = obj.id;
        var checkid = obj.id.replace("_", "_check_");
        if (obj.value == top.Lang.Mail.Write.liru)//例如：@qq.com;test@abc.com;
        {
            obj.value = "";
            if (obj.createTextRange) {
                var r = obj.createTextRange();
                r.moveStart('character', obj.value.length);
                r.collapse();
                r.select();
            }
        } else if (obj.value == Lang.Mail.ConfigJs.filter_InputDoMain) {//"例：*@example.com"){
            obj.value = "";
            if (obj.createTextRange) {
                var r = obj.createTextRange();
                r.moveStart('character', obj.value.length);
                r.collapse();
                r.select();
            }
        }
        else if (obj.value == Lang.Mail.ConfigJs.filter_SubValue) {//可输入多个主题，以分号（;）隔开 ;){
            obj.value = "";
            if (obj.createTextRange) {
                var r = obj.createTextRange();
                r.moveStart('character', obj.value.length);
                r.collapse();
                r.select();
            }
        }

        jQuery(obj).attr("style", "color: black;");
        if ($(checkid))$(checkid).checked = true;

        if (checkid == "option_check_dealType3" || checkid == "option_check_dealType4") {
            var disabled = jQuery("#" + checkid).attr("disabled");
            if (disabled == "disabled") {
                if ($(checkid))$(checkid).checked = false;
            }
            else {
                $('option_check_dealHistoryMail').checked = false;
            }
        }

    };
    var txtOnblur = function (obj) {
        if (obj.value.trim() == '') {
            jQuery(obj).removeAttr("style");
            if (obj.id == "option_from" || obj.id == "option_to") {
                obj.value = top.Lang.Mail.Write.liru;//例如：@qq.com;test@abc.com;
            }
            else if (obj.id == "option_fromDomain") {
                obj.value = Lang.Mail.ConfigJs.filter_InputDoMain;// "例：*@example.com";
            } else if (obj.id == "option_subject") {
                obj.value = Lang.Mail.ConfigJs.filter_SubValue;// 可输入多个主题，以分号（;）隔开 ;
            }
            var checkid = obj.id.replace("_", "_check_");
            if ($(checkid))$(checkid).checked = false;
        }
    };
    var txts = jQuery("#pageCreateFilter").find("input[type='text']"); //加载事件
    for (var i = 0; i < txts.length; i++) {
        txts[i].onclick = function () {
            txtOnclick(this);
        };
        txts[i].onblur = function () {
            txtOnblur(this);
        };
        txts[i].onfocus = function () {
            txtOnclick(this);
        };
    }
    var checks = jQuery("input[name='checkDealType']");
    $("option_check_dealType0").onclick = function () {
        if (this.checked) {
            checks.each(function () {
                this.checked = false;
                jQuery(this).attr("disabled", "disabled");

            });
        }
        else {
            checks.each(function () {
                jQuery(this).removeAttr("disabled");

            });
        }
    };
    if ($("option_check_dealType0").checked) {
        checks.each(function () {
            jQuery(this).attr("disabled", "disabled");
        });
    }

    var p = this;
    jQuery("#filter_AddContact").mouseover(function () {
        jQuery(this).attr("class", "i-rush-pe-on");
    }).mouseout(function () {
            jQuery(this).attr("class", "i-rush-pe");
        });

    jQuery("#filter_AddContact").click(function () {
        var type = ["0", "2"];
        p.showContactDialog(type, p.contactCall);
    });

};
filter.contactCall = function (data) {
    var txtValue = jQuery("#option_from").val();
    if (txtValue == top.Lang.Mail.Write.liru) txtValue = "";//例如：@qq.com;test@abc.com;
    var emailList = txtValue.split(";");
    for (var i = 0; i < emailList.length; i++) {
        var email = Email.getValue(emailList[i]);
        if (email) emailList[i] = email;
    }
    for (var i = 0; i < data.length; i++) {
        var email = Email.getValue(data[i].value);
        if (email) emailList.push(email);
    }
    if (emailList && emailList.length > 0) {
        $("option_from").focus();
        jQuery("#option_from").val(emailList.unique().join(";"));
        jQuery("#option_from").attr("style", "color:black;");
        jQuery("#option_check_from").attr("checked", true);
    }
};
filter.showContactDialog = function (type, callback, cancelcallback, attrs) {
    contact = new parent.Contact("contact");
    contact.groupMap = LMD.groupMap;
    contact.group_contactListMap = LMD.group_contactListMap_mail;
    contact.inItContanct(black.attrs.id + "_ContactDialog", type, callback, null);
};
filter.bindUpdateData = function (item) {
    var data = item;
    if (data.from) {
        $("option_from").value = data.from.decodeHTML();
        jQuery("#option_from").attr("style", 'color:black;');
        $("option_check_from").checked = true;
    }
    if (data.to) {
        $("option_to").value = data.to.decodeHTML();
        jQuery("#option_to").attr("style", 'color:black;');
        $("option_check_to").checked = true;
        $("option_to_all").checked = data.toType - 0 == 1;
    }
    if (data.subject) {
        $("option_subject").value = data.subject.decodeHTML();
        jQuery("#option_subject").attr("style", 'color:black;');
        $("option_check_subject").checked = true;
        $("option_subject_all").checked = data.subjectType - 0 == 1;
    }
    if (data.mailSize) {
        this.attrs.dropMailType.setValue(data.mailSizeType);
        $("option_mailSize").value = data.mailSize;
        jQuery("#option_mailSize").attr("style", 'color:black;');
        $("option_check_mailSize").checked = true;
    }
    $("option_conditionsRelation2").checked = data.conditionsRelation == 2;
    var dtList = data.dealType.split(",");
    var tempstr = "";
    for (var i = 0; i < dtList.length; i++) {
        var type = dtList[i];
        var chkObj = document.getElementById("option_check_dealType" + type);
        if (chkObj)chkObj.checked = true;
        if (type == 2) {
            this.attrs.dropFolder.setValue(data.moveToFolder);
        }
        else if (type == 3 && $("option_dealType3")) {
            $("option_dealType3").value = data.forwardAddr;
            jQuery("#option_dealType3").attr("style", 'color:black;');
        }
        else if (type == 4) {
            $("option_dealType4").innerHTML = data.replayContent.decodeHTML();
            //RTB_items["option_filter_replay_content"].isHtml = true;
            //RTB_items["option_filter_replay_content"].setEditorValue(data.replayContent.decodeHTML());
        }
        else if (CC.isLabelMail() && type == 5) {
            this.attrs.dropLabel.setValue(data.attachLabel);
        }
    }

    if (typeof(data.forwardBakup) != "undefined" && $("option_check_dealType3_save"))
        $("option_check_dealType3_save").checked = data.forwardBakup - 0 == 1;
};
filter.hisMailSel = function (id) {
    if (id == 2)
        document.getElementById("option_dealHistoryMail2").disabled = false;
    else {
        document.getElementById("option_dealHistoryMail2").disabled = true;
        document.getElementById("option_dealHistoryMail2").checked = false;
    }
    /*
     if (document.getElementById("option_dealHistoryMail2").checked) {
     document.getElementById("trforwardAddr").style.display = "none";
     document.getElementById("trreplayContent").style.display = "none";
     document.getElementById("trreplayContent1").style.display = "none";
     document.getElementById("trreplayContent2").style.display = "none";
     document.getElementById("option_dealType0").checked=true;
     }
     else
     {
     document.getElementById("trforwardAddr").style.display = "";
     document.getElementById("trreplayContent1").style.display = "";
     document.getElementById("trreplayContent").style.display = "";
     document.getElementById("trreplayContent2").style.display = "";
     }*/
};
/***
 * 获取新建过滤在器HTML结构
 * @param {Object} attrs
 * @param {Object} filterId
 */
filter.getAddHtml = function (attrs, filterId, sortId) {
    try {
        var html = [];
        var p = this;
        var id = attrs.id;
        filterId = filterId || 0;
        sortId = sortId || 0;
        var moveToFolder = attrs.data["moveToFolder"].attribute.value;
        var attachLabel = attrs.data["attachLabel"].attribute.value;
        var dealType = attrs.data["dealType"].attribute.value;
        if (dealType == 2) {
            attrs.data["folderId"].attribute.value = moveToFolder;
        } else if (dealType == 5) {
            attrs.data["labelId"].attribute.value = attachLabel;
        }
        html.push("<div id=\"container\">");
        html.push(this.getTopHtml());
        html.push(this.getLeftHtml());

        html.push(this.getNavMenu(attrs.id));

        html.push('<div id="filterWrapper" class="setWrapper"><div>');
        html.push("<input type=\"hidden\" value=\"{0}\" id=\"option_filterId\" name=\"option_filterId\">".format(filterId));
        html.push("<input type=\"hidden\" value=\"{0}\" id=\"option_filterSortId\" name=\"option_filterSortId\">".format(sortId));
        var ftitle = filterId == 0 ? Lang.Mail.ConfigJs.filter_AddRule : Lang.Mail.ConfigJs.filter_UpdateRule;
        html.push('<h2 class="set_til"> ' + ftitle + '<a onclick="filter.showAdd(true);return false;" href="javascript:fGoto();" class="fn bord-spa" >  &#8249;&#8249;' + Lang.Mail.ConfigJs.filter_return + '</a></h2>');

        html.push('<table class="filter-frame">');
        html.push('<tr><td class="mailPOP_tdWidth" style="vertical-align:top;text-align:right;">' + Lang.Mail.ConfigJs.filter_MailArrived + '：</td>');
        html.push('<td><div>');
        html.push('<table width="600" class="set-layout-table" id="set_table_lab1">');
        html.push('<tr>');
        html.push('<td width="80"><input id="option_check_from" class="checkbox-com" type="checkbox"/><label for="option_check_from">' + Lang.Mail.ConfigJs.filter_From + '</label></td>');
        html.push('<td width="300"><span class="set-txt-wrap3 w284">');
        html.push('<input id="option_from" class="sendMail-txt w270" type="text" value="'+top.Lang.Mail.Write.liru+'"/>');//<input id="option_from" class="sendMail-txt w270" type="text" value="例如：@qq.com;test@abc.com;"/>
        //html.push('<i class="i-people"></i>');
        html.push("<i title='" + Lang.Mail.ConfigJs.chooseFromMailList + "' style='' class=\"i-rush-pe\" id='filter_AddContact'></i>");
        html.push('</span></td>');
        html.push('</tr>');

        html.push('<tr style="display:none;">');
        html.push('<td><input class="checkbox-com" id="option_check_fromDomain"  type="checkbox"/><label for="option_check_fromDomain">' + Lang.Mail.ConfigJs.filter_FromDomain + '</label></td>');
        html.push('<td>');
        html.push('<span class="set-txt-wrap">');
        html.push('<input id="option_fromDomain" class="set-mand-txt w284" type="text" value="' + Lang.Mail.ConfigJs.filter_InputDoMain + '"/>');
        html.push('</span>');
        html.push('</td>');
        html.push('</tr>');

        html.push('<tr>');
        html.push('<td><input class="checkbox-com" id="option_check_to" type="checkbox"/><label for="option_check_to">' + Lang.Mail.ConfigJs.filter_ToContain + '</label></td>');
        html.push('<td ><span class="set-txt-wrap">');
        html.push('<input id="option_to" class="set-mand-txt w284" type="text" value="'+top.Lang.Mail.Write.liru+'"/>');//<input id="option_to" class="set-mand-txt w284" type="text" value="例如：@qq.com;test@abc.com;"/>
        html.push('</span><span class="ml_10">');
        html.push('<input class="checkbox-com" id="option_to_all" type="checkbox"/><label for="option_to_all">' + Lang.Mail.ConfigJs.filter_ContainAll + '</label>');
        html.push('</span>');
        html.push('</td>');
        //html.push('<td width="100">');

        //html.push('</td>');
        html.push('</tr>');

        html.push('<tr>');
        html.push('<td><input class="checkbox-com" id="option_check_subject" type="checkbox"/><label for="option_check_subject">' + Lang.Mail.ConfigJs.filter_SubjectContain + '</label></td>');
        html.push('<td>');
        html.push('<span class="set-txt-wrap">');
        html.push('<input id="option_subject" class="set-mand-txt w284" type="text" value="' + Lang.Mail.ConfigJs.filter_SubValue + '"/>');
        html.push('</span><span class="ml_10">');
        html.push('<input class="checkbox-com" id="option_subject_all" type="checkbox"/><label for="option_subject_all">' + Lang.Mail.ConfigJs.filter_ContainAll + '</label>');
        //html.push('<input class="checkbox-com" id="option_subject_s" type="checkbox"/><label for="b1">主题</label>&nbsp;&nbsp;');
        //html.push('<input class="checkbox-com" id="option_subject_c" type="checkbox"/><label for="b2">正文</label>');

        //html.push('<span class="line-spa"></span>');
        html.push('</span></td>');
        //html.push('<td>');

        //html.push('</td>');
        html.push('</tr>');

        html.push('<tr class="btm-line">');
        html.push('<td><input class="checkbox-com" id="option_check_mailSize" type="checkbox"/><label for="option_check_mailSize">' + Lang.Mail.ConfigJs.filter_MailSize + '</label></td>');
        html.push('<td>');

        html.push("<div class=\"fl pr_10\">");
        //this.attrs.textBox = new RichTextBox({id: "option_filter_replay_content"});
        html.push(this.attrs.dropMailType.getHTML());
        html.push('</div>');
        //html.push('<span class="fake-select">');
        //html.push('<span id="option_drop_mailSize" class="fake-select-option w98">大于等于</span>');
        //html.push('<em><i></i></em>');
        //html.push('</span>');

        html.push('<span class="set-txt-wrap ie-set-txt">');
        html.push('<input type="text" id="option_mailSize" class="set-mand-txt w155">');
        html.push('</span>&nbsp;&nbsp;<span id="option_mailSize_type" class="col999">M</span>');

        html.push('</td>');
        html.push('</tr>');

        html.push('<tr>');
        html.push('<td colspan="2" class="pt_10"><input class="radio-com" id="option_conditionsRelation1" name="option_conditionsRelation" checked="checked" type="radio"/><label for="option_conditionsRelation1">' + Lang.Mail.ConfigJs.filter_MeetAllAbove + '</label>');
        html.push('&nbsp;&nbsp;&nbsp;&nbsp;');
        html.push('<input class="radio-com" id="option_conditionsRelation2" name="option_conditionsRelation" type="radio"/><label for="option_conditionsRelation2">' + Lang.Mail.ConfigJs.filter_MeetAnyAbove + '</label>');
        html.push('</td>');
        html.push('</tr>');
        html.push('</table></div>');
        html.push('</td></tr>');
        html.push('</table><!--mail-arrived-->');


        html.push('<table class="filter-condition">');
        html.push('<tr><td style="vertical-align:top;text-align:right;" class="mailPOP_tdWidth">' + Lang.Mail.ConfigJs.filter_MeetTheAbove + '：</td>');
        html.push('<td><div>');
        html.push('<table id="set_table_lab2" class="condition-table" width="591">');
        html.push('<tr>');
        html.push(' <td width="80"><input class="checkbox-com" id="option_check_dealType0" type="checkbox"/><label for="option_check_dealType0">' + Lang.Mail.ConfigJs.deleteMail + '</label></td><td width="300">');
        html.push(' </td></tr>');

        html.push(' <tr>');
        html.push(' <td><input class="checkbox-com" id="option_check_dealType2" name="checkDealType" type="checkbox"/><label for="option_check_dealType2">' + Lang.Mail.ConfigJs.filter_InFolder + '</label></td>');
        html.push(' <td>');
        html.push(this.attrs.dropFolder.getHTML());
        html.push(' </td>');
        html.push(' </tr>');

        //标签邮件
        if (CC.isLabelMail() && this.attrs.data.labelId.items.length) {
            html.push(' <tr>');
            html.push(' <td><input class="checkbox-com" id="option_check_dealType5" name="checkDealType" type="checkbox"/><label for="option_check_dealType5">' + Lang.Mail.label_MarkLabel + '</label></td>');
            html.push(' <td>');
            html.push(this.attrs.dropLabel.getHTML());
            html.push(' </td>');
            html.push(' </tr>');
        }
        if ("1" != parent.gMain.hideAutoForward) {
            html.push(' <tr>');
            html.push('    <td><input class="checkbox-com" id="option_check_dealType3" name="checkDealType" type="checkbox" onclick="javascript:if(this.checked) $(\'option_check_dealHistoryMail\').checked = false;"/><label for="option_check_dealType3">' + Lang.Mail.ConfigJs.filter_auto_forward + '</label></td>');
            html.push('    <td><span class="set-txt-wrap">');
            html.push('      <input type="text" id="option_dealType3" class="set-mand-txt w196">');
            html.push('    </span>');
            html.push('     <span><input type="checkbox" checked="checked" id="option_check_dealType3_save" class="checkbox-com">');
            html.push('<label for="option_check_dealType3_save">' + Lang.Mail.ConfigJs.filter_SaveMail + '</label></span>');
            html.push('</td>');
            html.push('  </tr>');
        }
        //html.push('<tr> <td colspan="2"><input class="checkbox-com" id="option_check_dealType6" name="checkDealType" type="checkbox"/><label for="option_check_dealType6">标为星标</label></td></tr>');
        //html.push('<tr> <td colspan="2"><input class="checkbox-com" id="option_check_dealType7" name="checkDealType" type="checkbox"/><label for="option_check_dealType7">标为已读</label></td></tr>');
        html.push('  <tr>');
        html.push('    <td style="vertical-align:top;"><input class="checkbox-com" id="option_check_dealType4" onclick="javascript:if(this.checked) $(\'option_check_dealHistoryMail\').checked = false;" name="checkDealType" type="checkbox"/><label for="option_check_dealType4">' + Lang.Mail.ConfigJs.pref_autoresp + '</label></td>');
        //html.push('  </tr>');

        //html.push(' <tr>');
        html.push('   <td><div>');
        html.push('<textarea class="w346" cols="50" rows="7"  id="option_dealType4" type="text"></textarea>');
        //html.push(this.attrs.textBox.getHtml());
        html.push(' </div></td>');
        html.push('       </tr>');
        html.push('     </table></div>');
        html.push('  </td></tr>');
        html.push('</table>');


        html.push('<div class="set-tips">');
        html.push(' <input type="checkbox"  class="checkbox-com" style="margin-left:10px;"  id="option_check_dealHistoryMail" onclick="javascript:if(this.checked){ $(\'option_check_dealType3\').checked = false;$(\'option_check_dealType4\').checked = false;}"/>' + Lang.Mail.ConfigJs.filter_HisMail); // <var>1312</var> 封');
        html.push('</div>');

        html.push('<div style="" class="btm_pager">');
        html.push('<a onclick="filter.save();return false;" href="javascript:fGoto();" class="n_btn_on mt_5 ml_10" ><span><span>{0}</span></span></a>'.format(Lang.Mail.ConfigJs.save));
        html.push('<a onclick="filter.showAdd(true);return false;" href="javascript:fGoto();" class="n_btn mt_5"><span><span>{0}</span></span></a>'.format(Lang.Mail.ConfigJs.pref_cancel));
        html.push('</div>');
        html.push('</div>');
        html.push('</div>');

        return html.join("");
    } catch (e) {
        return "";
    }
};

filter.getContent = function (of) {
    var html = [];
    var opAttrs = this.opAttrs;
    var andStr = "";
    var emBStr = '<em class=\"f-bolder\" title=\"{0}\">';
    var emEStr = '</em>';
    //html.push("<ul>");
    html.push(Lang.Mail.ConfigJs.filter_condtion_if + "：");
    var conditionsList = [of.from, of.to, of.subject, of.mailSize];
    var result = new Array();
    for (var j = 0; j < conditionsList.length; j++) {
        var conditionsList_from = conditionsList[j];//.split(";");
        /*
         var conditions_from = "";
         for (var i = 0; i < conditionsList_from.length; i++) {
         if (conditionsList_from[i] != "") {
         conditions_from += conditionsList_from[i] + Lang.Mail.ConfigJs.or;
         }
         }
         conditions_from = conditions_from.substr(0, conditions_from.length - Lang.Mail.ConfigJs.or.length);
         */
        result[j] = conditionsList_from;
    }
    /*
     if(of.==1)
     andStr = Lang.Mail.ConfigJs.filter_cond_and+"&nbsp;";
     else
     andStr = Lang.Mail.ConfigJs.or+"&nbsp;";
     */
    var tempstr = result.escapeNull().length > 1 ? Lang.Mail.ConfigJs.etc : "";
    if (of.fromType > 0) {
        var strtemp = result[0];
        if (strtemp.length >= 30) strtemp = strtemp.substr(0, 30) + "...";
        html.push(Lang.Mail.ConfigJs.filter_sender + '{0}{1}'.format(Lang.Mail.ConfigJs.filter_op_text_contains, emBStr.format(result[0]) + strtemp + tempstr + emEStr));
    }
    else if (of.toType > 0) {
        var strtemp = result[1];
        if (strtemp.length >= 30) strtemp = strtemp.substr(0, 30) + "...";
        html.push(Lang.Mail.ConfigJs.filter_ToAddr + '{0}{1}'.format(Lang.Mail.ConfigJs.filter_op_text_contains, emBStr.format(result[1]) + strtemp + tempstr + emEStr));
    }
    else if (of.subjectType > 0) {
        var strtemp = result[2].decodeHTML();
        if (strtemp.length >= 30) strtemp = strtemp.substr(0, 30) + "...";
        strtemp = strtemp.encodeHTML();
        html.push(Lang.Mail.ConfigJs.filter_Subject + '{0}{1}'.format(Lang.Mail.ConfigJs.filter_op_text_contains, emBStr.format(result[2]) + strtemp + tempstr + emEStr));
    }
    else if (of.mailSizeType > 0) {
        html.push(Lang.Mail.ConfigJs.mailSize + '{0}{1}M'.format((
            of.mailSizeType == 1 ? Lang.Mail.ConfigJs.GreaterOrEqual :
            Lang.Mail.ConfigJs.Lessthan), emBStr.format(of.mailSize) + of.mailSize + tempstr + emEStr));
    }

    //html.push("</ul><ul><li>" + Lang.Mail.ConfigJs.filter_all_the_rules + "<br></li><li>");
    html.push(Lang.Mail.ConfigJs.filter_all_the_rules);
    var dealType = of.dealType;
    var oname = MM.getFolderObject(dealType == 5 ? of.attachLabel : of.moveToFolder);
    var fname = oname ? oname.name : "";
    var typeList = dealType.split(",");
    var tempstr = "", temptype = dealType;
    if (typeList.length > 1) {
        tempstr = top.Lang.Mail.Write.deng;//等
        temptype = typeList[0];
    }
    switch (temptype) {
    case "0":
        html.push(emBStr.format(Lang.Mail.ConfigJs.deleteMail) + Lang.Mail.ConfigJs.deleteMail + tempstr + emEStr);
        break;
    case "1":
        html.push(emBStr.format(Lang.Mail.ConfigJs.filter_ac_reject) + Lang.Mail.ConfigJs.filter_ac_reject + tempstr + emEStr);
        break;
    case "2":
        html.push(emBStr.format(Lang.Mail.ConfigJs.filter_ac_move + ":&nbsp;" + fname) + Lang.Mail.ConfigJs.filter_ac_move + ":&nbsp;" + fname + tempstr + emEStr);
        break;
    case "3":
        html.push(emBStr.format(Lang.Mail.ConfigJs.filter_autoForward + ":&nbsp;" + of.forwardAddr) + Lang.Mail.ConfigJs.filter_autoForward + ":&nbsp;" + of.forwardAddr + tempstr + emEStr);
        break;
    case "4":
        html.push(emBStr.format(Lang.Mail.ConfigJs.filter_autoRe) + Lang.Mail.ConfigJs.filter_autoRe + tempstr + emEStr);
        break;
    case "5":
        html.push(emBStr.format(Lang.Mail.ConfigJs.filter_labe + ":&nbsp; " + fname) + Lang.Mail.ConfigJs.filter_labe + ":&nbsp; " + fname + tempstr + emEStr);
        break;
    case "6":
        html.push(emBStr.format(Lang.Mail.ConfigJs.mark) + Lang.Mail.ConfigJs.mark + tempstr + emEStr);
        break;
    case "7":
        html.push(emBStr.format(Lang.Mail.ConfigJs.setHaveRead) + Lang.Mail.ConfigJs.setHaveRead + tempstr + emEStr);
        break;
    }
    //html.push("</li></ul>");
    return html.join("");
};

filter.getItem = function (n) {
    //if(n=="dealHistoryMail")
    //return '<label><input type="checkbox" class="" onclick="filter.hisMailSel()" value="2" id="option_dealHistoryMail2" name="option_dealHistoryMail">'+Lang.Mail.ConfigJs.hisMail+'</label>';
    var attr = this.attrs.data[n];
    var type = attr.type;
    var func = this.getFun[type];
    var text = attr.text || "";
    return func(n, attr.attribute || {}, attr.items || text);
};

filter.getOneRadio = function (val) {
    var name = "dealType";
    var dt = this.attrs.data[name];
    var items = dt.items;
    var id = name + val;
    var dv = dt.attribute.value || dt.attribute.defaultValue;
    return '<input type="radio" onclick="filter.hisMailSel(' + val + ')"  name="option_{0}" id="option_{1}" value="{2}" {3}/> {4}'.format(name, id, val,
        (dv == val) ? ' checked="true"' : '', items[val]);
};
filter.getRuleRelation = function (val) {
    var name = "conditionsRelation";
    var dt = this.attrs.data[name];
    var items = dt.items;
    var id = name + val;
    var dv = dt.attribute.value || dt.attribute.defaultValue;
    return '<input type="radio" name="option_{0}" id="option_{1}" value="{2}" {3}/ > {4}'.format(name, id, val,
        (dv == val) ? ' checked="true"' : '', items[val]);
};
/**
 * 保存过滤器
 */
filter.save = function () {
    var p = this;
    if (p.dataList.length >= p.attrs.maxSize) {
        CC.alert(Lang.Mail.ConfigJs.allow_add_count.format(p.attrs.maxSize));
        return;
    }
    var func = p.attrs.save.func;
    var filterId = $("option_filterId").value - 0;
    var filterSortId = $("option_filterSortId").value - 0;

    //var data = this.getSaveData(p.attrs.data, p.check);
    var data = {};
    //if (data) {

    data.conditionsRelation = $("option_conditionsRelation1").checked ? 1 : 2;

    if (jQuery("#option_check_dealHistoryMail")[0].checked) {
        data.dealHistoryMail = 0;
    } else {
        data.dealHistoryMail = 0;
    }

    data.sortId = filterSortId;
    data.folderId = 1;
    //data.name = "12234";
    var select4 = 0; //document.getElementById("option_mailSizeType").value;
    var text1 = $("option_from").value.trim();
    var text2 = $("option_to").value.trim();
    var text3 = $("option_subject").value.trim();
    var text4 = $("option_mailSize").value.trim();
    var text5 = $("option_fromDomain").value.trim();
    text1 = text1 == top.Lang.Mail.Write.liru ? "" : text1;//例如：@qq.com;test@abc.com;
    text5 = text5 == Lang.Mail.ConfigJs.filter_InputDoMain ? "" : text5;
    text3 = text3 == Lang.Mail.ConfigJs.filter_SubValue ? "" : text3;
    if (text3 != "" && $("option_check_subject").checked) {
        /*
         var reg = /[,%\s\'\"\/\\|\<\>\^]/;
         if(text3.search(reg) != -1)
         {
         CC.alert(Lang.Mail.ConfigJs.filter_StrErr, function(){$("option_subject").focus();$("option_subject").value=$("option_subject").value;});
         return;
         }
         */
        var listSubject = text3.replace(/；/g, ";").split(";").unique();
        if (listSubject.length < 1) {

            CC.alert(Lang.Mail.ConfigJs.setFilter, function () {
                $("option_subject").focus();
                $("option_subject").value = "";
            });
            return false;
        }


        if ($("option_subject_all").checked) {
            data.subjectType = 1;
        }
        else {
            data.subjectType = 2;
        }

        data.subject = listSubject.join(";");
        data.subject = data.subject.replace(/\\/g, "\\\\");
    }
    if (text1 != "" && $("option_check_from").checked) {
        /*
         if (p.checkUserNumber(text1)) {
         CC.alert(Lang.Mail.ConfigJs.filter_FromUserNotEqual);
         return false;
         }
         */
        var listFrom = text1.replace(/；/g, ";").split(";").unique();
        jQuery.each(listFrom, function (index, item) {
            if (/^\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(item)) {
                listFrom[index] = "*" + item;
            }
        });
        if (listFrom.length < 1) {
            CC.alert(Lang.Mail.ConfigJs.setFilter, function () {
                $("option_from").focus();
                $("option_from").value = $("option_from").value;
            });
            return false;
        }

        data.fromType = 2;
        var str = p.getEmailList(listFrom, "from");
        if (str == false) return false;
        data.from = str.replace(/\*/g, "");
    }
    if (text2 != "" && $("option_check_to").checked) {

        var listTo = text2.replace(/；/g, ";").split(";").unique();
        jQuery.each(listTo, function (index, item) {
            if (/^\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(item)) {
                listTo[index] = "*" + item;
            }
        });
        if (listTo.length < 1) {
            CC.alert(Lang.Mail.ConfigJs.setFilter, function () {
                $("option_to").focus();
                $("option_to").value = $("option_to").value;
            });
            return false;
        }

        if ($("option_to_all").checked) {
            data.toType = 1;
        }
        else {
            data.toType = 2;
        }
        var str = p.getEmailList(listTo, "to");
        if (str == false) return false;
        data.to = str.replace(/\*/g, "");
    }
    if (text5 != "" && $("option_check_fromDomain").checked) {
        data.fromType = 2;
        data.from += ";" + text5;
    }

    //if (text1.replace(new RegExp(";", "gm"), "") == "" && text2.replace(new RegExp(";", "gm"), "") == "" && text3.replace(new RegExp(";", "gm"), "") == "" && text4.replace(new RegExp(";", "gm"), "") == "") {

    if (document.getElementById("option_check_mailSize").checked) {
        select4 = this.attrs.dropMailType.getValue();
        if (text4 == '0' || text4 == '' || !RegExp("^\\d+$").test(text4)) {
            CC.alert(Lang.Mail.ConfigJs.maiSize_num);
            return;
        }
        //if (select4 == '0') {
        //    data.mailSize = "";
        //}
        //else{
        data.mailSize = text4 - 0;
        data.mailSizeType = select4;
        //}
    }

    if (!data.from && !data.to && !data.subject && !data.mailSize) {
        CC.alert(Lang.Mail.ConfigJs.filter_WhereIsNull, function () {$("option_from").focus();});
        return;
    }

    var dealType = "";//this.getFormatValue("dealType");
    var txt = document.getElementById("option_dealType3");
    var txtFocus = function () {
        txt.focus();
    };

    if (document.getElementById("option_check_dealType0").checked) {
        dealType = "0";
    }
    else {

        if (document.getElementById("option_check_dealType2").checked) {
            dealType += "2,";
            data.moveToFolder = this.attrs.dropFolder.getValue();
        }

        if (CC.isLabelMail() && document.getElementById("option_check_dealType5") && document.getElementById("option_check_dealType5").checked) {
            dealType += "5,";
            data.attachLabel = this.attrs.dropLabel.getValue();
        }

        if (document.getElementById("option_check_dealType3") && document.getElementById("option_check_dealType3").checked) { //自动转发
            var forwardMail = document.getElementById("option_dealType3").value.trim();
            if (forwardMail == '') {
                CC.alert(Lang.Mail.ConfigJs.filter_ForwardIsNull, txtFocus);
                return false;
            }
            if (!Vd.checkData('email', forwardMail)) {
                CC.alert(Lang.Mail.ConfigJs.Forward_VdEmail, txtFocus);
                return false;
            }
            if (p.checkUserNumber(forwardMail)) {
                CC.alert(Lang.Mail.ConfigJs.filter_ForwardUserNotEqual, txtFocus);
                return false;
            }

            //检查是否在允许 或 禁止的转发地址中   [0:不限制  1:允许 2:禁止]
            if (!mailPOP.checkMail(forwardMail, "autoForward")) {
                if (gMain.forwardcorpConfigType == "1") {
                    CC.alert(top.Lang.Mail.Write.jinzhichizhuanfadao + gMain.forwardcorpConfig, txtFocus);//仅支持转发到 
                } else if (gMain.forwardcorpConfigType == "2") {
                    CC.alert(top.Lang.Mail.Write.jinzhizhuanfadao + gMain.forwardcorpConfig, txtFocus);//禁止转发到 
                }
                return false;
            }

            data.forwardAddr = forwardMail;
            dealType += "3,";
        }

        if ($("option_check_dealType3_save") && $("option_check_dealType3_save").checked) {
            data.forwardBakup = 1;
        }
        else {
            data.forwardBakup = 0;
        }

        if (document.getElementById("option_check_dealType4").checked) { //自动回复
            var objReplyContent = document.getElementById("option_dealType4");
            var replayValue = objReplyContent.value.trim();//RTB_items["option_filter_replay_content"].getEditorValue();
            var rval = replayValue.replace(/^[ \t\n\r]+/g, "").replace(/[ \t\n\r]+$/g, "");
            if (rval.trim() == '') {
                CC.alert(Lang.Mail.ConfigJs.InputReplayContent);
                return false;
            }
            if (replayValue.len() > gConst.autoRepaly_max) {
                CC.alert(Lang.Mail.ConfigJs.reply_length_limit);
                return false;
            }
            //data.replayContent = replayValue.toCData();
            data.replayContent = replayValue;
            dealType += "4,";
        }
        /*if (document.getElementById("option_check_dealType6").checked) {
         dealType += "6,";
         }
         if (document.getElementById("option_check_dealType7").checked) {
         dealType += "7,";
         }*/

    }
    if (!dealType) {
        CC.alert(Lang.Mail.ConfigJs.filter_RuleIsNull);
        return false;
    }

    data.opType = "add";
    var opStr = Lang.Mail.ConfigJs.sign_btn_add;
    if (dealType.indexOf(",") != -1) {
        dealType = dealType.substr(0, dealType.length - 1);
    }
    data.dealType = dealType;

    if (filterId && filterId != "0") {
        data.opType = "mod";
        data.filterId = filterId;
        opStr = Lang.Mail.ConfigJs.sign_btn_update;
    } else {
        if (p.dataList && p.dataList.length > 0)
            data.sortId = p.dataList[p.dataList.length - 1].sortId + 1;
        else
            data.sortId = 1;
    }

    data.name = 'm123456';
    data.ignoreCase = 1;
    var postData = {
        func    : func,
        data    : data,
        call    : function () {
            CC.showMsg(Lang.Mail.ConfigJs.mailSortingSetSuc, true, false, "option");
            if ($("option_check_dealHistoryMail").checked) {
                if (data.dealType == "0") {
                    data.dealType = "2";
                    data.moveToFolder = "4";
                }

                if (data.dealType == "5") {
                    data.attachLabel = p.attrs.dropLabel.getValue();
                    data.moveToFolder = p.attrs.dropFolder.getValue();
                }

                if (data.mailSize) {
                    data.mailSize = data.mailSize * 1024;
                }
                var pData = {
                    func    : "user:filterHistoryMail",
                    data    : data,
                    call    : function (ao) {
                        var count = ao["var"] || "0";
                        if (count == "0")
                            CC.showMsg(Lang.Mail.ConfigJs.filter_NotSearchMail, true, false, "option");
                        else
                            CC.showMsg("{0}{1}".format(count, Lang.Mail.ConfigJs.filter_Success), true, false, "option");
                        //p.init();
                    },
                    fallCall: function (ao) {
                        p.fail(Lang.Mail.ConfigJs.filter_Fail, ao);
                    },
                    msg     : Lang.Mail.ConfigJs.filter_Filtering
                };
                MM.mailRequestApi(pData);
            }
            p.init();
        },
        fallCall: function (ao) {
            p.fail(opStr + Lang.Mail.ConfigJs.filter_filterFail, ao);
        }
    };
    MM.mailRequest(postData);


};

/**
 * 修改过滤器
 * @param {Number} index 索引
 * @param {Number} id 过滤器id
 */
filter.update = function (index, id) {
    var p = this;
    var item = p.dataList[index];
    if (typeof (item) == "object") {
        p.initData(item, function (attrs) {
            p.showAdd('', id, item);
        });
    }
};

filter.getEmailList = function (list, t) {
    var obj = {"from": "option_from", "to": "option_to"};
    var tempList = [];

    var txtFocus = function () {
        $(obj[t]).focus();
        $(obj[t]).value = $(obj[t]).value;
    };

    for (var i = 0; i < list.length; i++) {
        var email = Email.getValue(list[i]);
        if (email) {
            if (Vd.checkData('email', email))
                tempList.push(email);
            else {
                CC.alert(top.Lang.Mail.Write.qsrzqdyjdzrlEsSqnGX, txtFocus);//请输入正确的邮件地址<br/>如：@qq.com;test@abc.com
                return false;
            }
        }
        else {
            if (Vd.checkData("*@domain", list[i]))
                tempList.push(list[i]);
            else {
                CC.alert(top.Lang.Mail.Write.qsrzqdyjdzrxTCaSKyM, txtFocus);//请输入正确的邮件地址<br/>如：@qq.com;test@abc.com
                return false;
            }
        }
    }
    if (tempList.length > 0)
        return tempList.unique().join(";");
    else
        return "";

};

/**
 * 删除过滤器
 * @param {Number} id 过滤器id
 */
filter.del = function (id) {
    var p = this;
    var call = function () {
        var data = {};
        var func = p.attrs.save.func;
        data.opType = "delete";
        data.filterId = id;
        p.ajaxRequest(func, data, function (ao) {
            CC.showMsg(Lang.Mail.ConfigJs.mailSortingDelSuc, true, false, "option");
            p.init();
        }, function (ao) {
            p.fail(Lang.Mail.ConfigJs.filter_delFilterFail + "！", ao);
        });
    };

    CC.confirm(Lang.Mail.ConfigJs.filter_delFilterContenNo, call);
};
/**
 * 向上移动过滤去器
 * @param {Object} i
 */
filter.moveUp = function (i) {
    var j = i - 1;
    var data1 = this.dataList[i];
    var data2 = this.dataList[j];
    var sort1 = data1.sortId;
    var sort2 = data2.sortId;
    data1.sortId = sort2;
    data2.sortId = sort1;
};
/**
 * 向下移动过滤去器
 * @param {Object} i
 * @param {Object} type
 */
filter.listSort = function (i, type) {
    var p = this;
    var j = 0;
    if (type == "up") {
        j = i - 1;
    } else {
        j = i + 1;
    }
    var data1 = this.dataList[i];
    var data2 = this.dataList[j];
    var sort1 = data1.sortId;
    var sort2 = data2.sortId;
    data1.sortId = sort2;
    data2.sortId = sort1;
    data1.opType = "mod";
    data2.opType = "mod";

    data1.to = data1.to.decodeHTML();
    data1.from = data1.from.decodeHTML();
    data1.subject = data1.subject.decodeHTML();
    data2.to = data2.to.decodeHTML();
    data2.from = data2.from.decodeHTML();
    data2.subject = data2.subject.decodeHTML();
    data1.name = 'm123456';
    data2.name = 'm123456';

    var d1 = {
        "func": p.attrs.save.func,
        "var" : data1
    };
    var d2 = {
        "func": p.attrs.save.func,
        "var" : data2
    };
    var data = [];
    data.push(d1);
    data.push(d2);
    MM.seqRequestCB(data, function () {
        p.init();
    });
    /*
     MM.seqRequestCB(data, cb, fcb, obj.msg);
     MM.seqLoadMailList({
     data: data,
     seqCall: function(ao){
     p.init();
     },
     msg: ""
     });
     */
};

filter.checkUserNumber = function (mail) {
    //var mobileNumber = gMain.mobileNumber+"@"+domain;
    var retVal = false;
    for (var i = 0; i < aliasList.length; i++) {
        if (aliasList[i].value == mail) {
            retVal = true;
            break;
        }
    }
    return retVal;
};





