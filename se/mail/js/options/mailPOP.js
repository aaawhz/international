var mailPOP = new OptionBase();

mailPOP.getUrl = function(func){
    return gConst.apiPostPath+"?func={0}&sid={1}".format(func,gMain.sid);
};

mailPOP.attrs = {
    id: 'mailPOP',
    authority: 'MAIL_MANAGER_MAILPOP',
    divId: 'pageCreateFilter',
    tableClass: "", 
    ajaxType:2,
    dropselect:null,
    failCounts:0,//服务器验证代收设置的次数
    list: { type: "url", func: gConst.func.getPOP,data:{}}, //获取数据/列表时指令，数据
    save: {func:gConst.func.setPOP},                     //删除数据时func指令，报文格式      
    data: {
        id:{
            display:false,
            type:'int',
            attribute:{
                value:0,
                defaultValue:0
            }
        },
        username: {
        text: Lang.Mail.ConfigJs.pop_mailaddress,
            type: 'text',
            className: '',
            attribute: {
                value: '',
                defaultValue: '',
                className: '',                
                maxLength:255,
                ext:' onchange="mailPOP.autoSetPOPServer(this);"'
            },
            format: 'string',
            check: { type: 'email', tips: Lang.Mail.ConfigJs.pop_failed_email }
        },
        password: {
        text: Lang.Mail.ConfigJs.pop_password,
            type: 'password',
            className: '',
            attribute: {
                value: '',
                defaultValue: '',
                className: ''
            },
            format: 'string',
            check:{type:'empty'}
        },
        fid: {
        text: Lang.Mail.ConfigJs.pop_folder,
            type: 'select',
            className: '',
            attribute: {
                value: '1',
                defaultValue: '1',
                className: ''
            },
            format: 'int',
            items:{}
        },
        server: {
        text: Lang.Mail.ConfigJs.pop_servername,
            type: 'text',
            className: '',
            attribute: {
                value: '',
                defaultValue: '',
                className: ''
            },
            format: 'string',
            check: { type: 'domain', tips: Lang.Mail.ConfigJs.mailpop_rlPop }
        },
        port: {
            id:"port",
            text: Lang.Mail.ConfigJs.pop_port,
            type: 'text',
            className: '',
            attribute: {
                value: '',
                defaultValue: 110,
                className: '',
                maxLength:5
            },
            format: 'int',
            ext:' id="option_mailPOP_portId" style="display:none"',
            check: { type: 'port', tips: Lang.Mail.ConfigJs.mailpop_porterr}
        },
        timeout: {
            id:"timeout",
            text: Lang.Mail.ConfigJs.pop_timeout,
            type: 'text',
            className: '',
            attribute: {
                value: '',
                defaultValue: 90,
                className: '',
                maxLength:4
            },
            format: 'string',
            ext:' id="option_mailPOP_timeoutId" style="display:none"',
            check: { type: 'reg', tips: Lang.Mail.ConfigJs.pop_serverat_end,reg:/[0-9]{1,4}/}
        },
        leaveOnServer: {
        text: Lang.Mail.ConfigJs.pop_checkOptions,
            type: 'checkbox',
            className: '',
            attribute: {
                value: '',
                defaultValue: '1',
                className: ''
            },
            items: { '1': Lang.Mail.ConfigJs.pop_holddesc },
            format: 'int'
        },
        showDetial: {
        text: '<a href="javascript:fGoto();" onclick="mailPOP.showDetail(this,\'portId\',\'timeoutId\');"><span >' + Lang.Mail.ConfigJs.pop_showSeniorOpt + '&gt;&gt;</span><span style="display:none">&lt;&lt;' + Lang.Mail.ConfigJs.pop_hideSeniorOpt + '</span></a>',
            type:'label'
        }
    },
    buttons:[{
        text: Lang.Mail.Ok,
        clickEvent: 'mailPOP.add'
    }, {
    text: Lang.Mail.Cancel,
        clickEvent: 'mailPOP.returnList'
    }]
};

mailPOP.dataList = [];

mailPOP.init = function(id,pm) {
    if (pm) {
        mailPOP.initDom();
    } else {this.attrs.url = this.getUrl(gConst.func.getPOP);
        this.attrs.data.fid.items =CC.getFolders();// filter.getFolders([GE.folder.sys,GE.folder.user]);
        this.request(this.attrs,mailPOP.getHtml,null,true);
    }
};

mailPOP.initDom = function () {
    var html = [];
    var id = this.attrs.id;
    html.push("<div class=\"bodySet\" id=\"pageSetReceiveOther\">");
    html.push("<div id=\"container\">");
    html.push(this.getTopHtml());
    html.push(this.getLeftHtml());
    html.push("<div class=\"setWrapper\" id='pmailPOPWrapper'>");
    html.push("</div>");
    MM[gConst.setting].update(id,html.join(""));
};

mailPOP.initAuto = function () {
    this.attrs.url = this.getUrl(gConst.func.getPOP);
    if (this.attrs.free || GC.check(this.attrs.authority)) {
        this.request(this.attrs,mailPOP.autoSync,null,true);
    }
    
};

// 自动代收
mailPOP.autoSync = function (attrs, data) {
    var i;


//  clearInterval(this.autoTimer);
    if (typeof data !== "undefined" && data !== null && Object.prototype.toString.call(data) === "[object Array]" && data.length > 0) {
//      this.autoTimer = setInterval(function () {
            mailPOP.dataList = data;
            for (i = data.length; i--;) {
                if (+(data[i].isAutoPOP) === 1) {
                    mailPOP.syncPOP(data[i].id, false, false, undefined, true);
                }
            }
//      }, 1000 * 300);
    }
};

mailPOP.getHtml = function(attrs,ad){
    var html = [];
    mailPOP.dataList = ad;
    var p = this;
    var opAttrs = this.opAttrs;
    var id = this.attrs.id;
    var mpid = "option_mailPOP_";
    html.push("<div class=\"bodySet\" id=\"pageSetReceiveOther\">");
    html.push("<div id=\"container\">");
    
    // mailPOP.autoSync(attrs,ad);
    LM.loadFolderMain();
    //更新popList
    p.modPOPList(ad);
    
    //得到本页面,不包括其他任何公用页面、左边、上边的页面
    var getAddHtml = function(){
        var html = [];
        html.push("<div class=\"setWrapper\" id='pmailPOPWrapper'>");
        html.push("<div id=\"rm_main\">");
        html.push("<div class=\"write_adr_wrap\">");
        html.push("<a class=\"n_btn_on font-bold\" onclick='mailPOP.showAdd(0)'><span>");
        html.push("<span>"+Lang.Mail.ConfigJs.addPOPmailbox+"</span></span></a>");
        html.push("</div>");
        html.push("<div class=\"set_rule_box\">");
        html.push("<h3>"+Lang.Mail.ConfigJs.POPmailbox+"&nbsp;&nbsp; ");
        html.push("<a href=\"javascript:void(0);\" onclick=\"mailPOP.syncPOP(0,\'isAll\');mailPOP.init();\">"+Lang.Mail.ConfigJs.pop_syncAll +"</a>");
        html.push("&nbsp;&nbsp;<a href=\"javascript:;\" onclick=\"CC.goLogLink(\'" + Lang.Mail.ConfigJs.LogQuery + "\', \'agent\');\">" + Lang.Mail.ConfigJs.viewColltectionRecord + "</a>");
        html.push("</h3>");
        html.push("<h4>"+parent.corpMailCollINMsg+"</h4>");
    
        
        //判断有无代收邮件
        var list = "";
        if(ad.length>0){
            list = p.getList(ad,mpid, id);
            
        }else{
            list = p.noList();
        }
        html.push(list);
        html.push("</div><!--set_rule_box-->");
        html.push("</div></div><!--set_content-->");
        
        return html.join("");
    };
    var addDiv = getAddHtml();
    html.push(this.getTopHtml());
    html.push(this.getLeftHtml());
    html.push(addDiv);
    MM[gConst.setting].update(id,html.join(""));
    this.updatePosition("pmailPOPWrapper");
    p.correctWidthInIE6("pmailPOPWrapper",1);

    jQuery("#addNow").bind("click",function(){
        p.showAdd(0);
    });

    jQuery(".set_rule_box > table").on("mouseenter", ".editControls", function () {
        if (jQuery(this).find("input").length < 1) {
            jQuery(this).addClass("hoverFakeIpt");
        }
    });
    jQuery(".set_rule_box > table").on("mouseleave", ".editControls", function () {
        jQuery(this).removeClass("hoverFakeIpt");
    });
    jQuery(".set_rule_box > table").on("dblclick", ".editControls", function () {
        var val = jQuery(this).html().encodeHTML();

        jQuery(this).removeClass("hoverFakeIpt");

        if (jQuery(this).find("input").length > 0) {
            return false;
        }
        jQuery(this).html("<input maxlength='32' style='height: 18px; line-height: 18px; width: 180px;' oldVal = \"" + val + "\" class=\"inputImmediateEdit\" type=\"text\" value=\"" + val + "\" >");
        jQuery(this).find("input").eq(0)[0].focus();
    }).on("blur", "input.inputImmediateEdit", function () {
        htmlToInput(jQuery(this));
    }).on("keypress", "input.inputImmediateEdit", function (e) {
        if (e.keyCode === 13) {
            jQuery(this)[0].blur();
        }
    });

    function htmlToInput (el) {
        var name = el.val().trimAll(),
            oldName = el.attr("oldVal"),
            username = el.parent().parent().parent().find("td").eq(0).html(),
            isCanSubmit = true,
            folders = CM.folderMain[gConst.dataName],
            len = folders.length;

        for (; len--; ) {
            if (folders[len].popMailId === +(el.parent().attr("popid")) && folders[len].folderPassFlag === 1) {
                CC.showMsg(Lang.Mail.ConfigJs.folderEncrypted, true, false, "error");
                isCanSubmit = false;
                break;
            }
        }
        if (isCanSubmit && (name === oldName || name.length === 0)) {
            isCanSubmit = false;
        }
        if (isCanSubmit && name !== oldName && mailPOP.checkFolderName(oldName, name)) {
            CC.showMsg(Lang.Mail.ConfigJs.folderNameNotWithOther, true, false, "error");
            isCanSubmit = false;
        }
        if (!isCanSubmit) {
            el.parent().html(oldName);
        } else {
            mailPOP.ImmediateMod(username, name, el.parent(), oldName);
        }
    }
};

/**
 * 得到所有的邮件夹，包括子邮件夹
 */
mailPOP.getAllFolders = function(folders,aFolders){
    
    var p = this;   
    var aFolder = [];
    var len = folders.length;
    
    if(len>0){
        for(var i=0; i<len; i++){
            aFolder = [];
            aFolder.push(folders[i].name);
            aFolder.push(folders[i].fid);
            aFolders.push(aFolder);
            if(folders[i].nodes.length > 0){
                p.getAllFolders(folders[i].nodes,aFolders);
            }
        }
    }
};

/**
 * 得到一个下拉框控件
 * @param {Object} id 需要增加下拉框的父标签ID
 */
mailPOP.getDropSelect = function(id){
    var p = this;
    var dropselectdata = [];
    var folders = CC.getFolders(); 
    var aFolders = [];
    //p.getAllFolders(folders,aFolders);  
    var fm = CM.folderMain[gConst.dataName];
    
    //得到所有文件夹 ,[type 1:系统邮件夹 3：自定义邮件夹  5：重要邮件夹]
    var data = this.getFolders([GE.folder.sys,GE.folder.user]);
    for(var j=0; j<fm.length; j++){
        //[6:病毒邮件夹 10:归档邮件夹]
        if(fm[j].fid != 6 && fm[j].fid != 10){
            dropselectdata.push({text:fm[j].name,value:fm[j].fid}); 
        }                   
    } 
    p.attrs.dropselect = new DropSelect({
        id:"input_contact_drop_select",
        data:data,
        type:"fileTree",
        selectedValue:"-1",
        width:289,
        height:200
    });
    
    //把下拉框的html 放到td下 
    jQuery("#"+id).append(p.attrs.dropselect.getHTML());
    p.attrs.dropselect.loadEvent();
};


/**
 * 无邮件代收的html
 */
mailPOP.noList = function(){
    var html = [];
    
    html.push("<p class=\"set_rule_box_tips\">"+Lang.Mail.ConfigJs.notPOPmailbox+"，&nbsp;&nbsp;");
    html.push("<a id='addNow' href='javascript:void(0);' class=\"fw_n\"> "+Lang.Mail.ConfigJs.settingNow+">> </a></p>");
    
    return html.join("");
};

/**
 * 存在邮件代收返回的html列表
 * @param {Object} ad 代收地址等返回数据
 * @param {Object} mpid
 * @param {Object} i
 * @param {Object} id
 */
mailPOP.getList = function(ad,mpid, id){
    var html = [];

    html.push("<table class=\"addr_table_head rm_table_head mt_10\" width=\"100%\">");
    html.push("<tr>");
    html.push("<td width=\"30%\">"+Lang.Mail.ConfigJs.mailAccount+"</td>");
    html.push("<td width=\"30%\" class=\"td2\">"+Lang.Mail.ConfigJs.mailFolderName+"</td>");
    html.push("<td width=\"110\">"+Lang.Mail.ConfigJs.unreadMail+"</td>");
    html.push("<td width=\"95\">"+Lang.Mail.ConfigJs.allMails+"</td>");
    html.push("<td width=\"160\" class=\"td5\">"+Lang.Mail.ConfigJs.operation+"</td>");
    html.push("</tr>");
    html.push("</table>");
    html.push("<table class=\"addr_table_body td-color\" width=\"100%\">");
        try {
            for (var i = 0; i < ad.length; i++) {
                var item = ad[i];
                var oname = MM.getFolderObject(item.fid)||MM.getFolderObject(1);
                var obj = {};
                var totalCount = 0;
                var unReadCount = 0; 
                var folders = CM.folderMain[gConst.dataName];

                for(var j=0; j<folders.length; j++){
                    if(item.fid == folders[j].fid){
                        totalCount = folders[j].stats.messageCount;
                        unReadCount = folders[j].stats.unreadMessageCount;
                    }
                }
            
                html.push("<tr>");
                //代收的邮件地址
                html.push("<td width=\"30%\">"+item.username+"</td>");
                //代收所在文件夹名称
                html.push("<td width=\"30%\"><span popid=\"" + item.id + "\" title=\"" + Lang.Mail.ConfigJs.dbClickModFolderName + "\" style=\"cursor: pointer;\" class=\"editControls\">" + item.folderName.encodeHTML() + "</span></td>");
                //未读邮件数量
                html.push("<td width=\"110\">", "<a href=\"javascript:;\" onclick=\"mailPOP.gotoFolder(" + item.fid + ", true)\">" + unReadCount + "</a></td>");
                //总邮件数量
                html.push("<td width=\"95\">", "<a href=\"javascript:;\" onclick=\"mailPOP.gotoFolder(" + item.fid + ")\">", totalCount, "</a>", "</td>");
                //收信
                html.push("<td width=\"160\"><a href=\"javascript:void(0);\" class=\"mr_15\" ");
                html.push("onclick=\"mailPOP.syncPOP(\'"+ item.id+"\');mailPOP.init();return false;\">"+Lang.Mail.ConfigJs.receive+"</a>");
                //修改设置
                html.push("<a href=\"javascript:void(0);\" class=\"mr_15\" ");
                html.push("onclick=\"mailPOP.update("+ item.id +");return false;\" >"+Lang.Mail.ConfigJs.modifySettings+"</a>");
                //删除此代收
                html.push("<a href=\"javascript:void(0);\" class=\"mr_15\"");
                html.push("onclick=\"mailPOP.del(\'"+ item.id+"\',\'"+item.username+"\');return false;\">"+Lang.Mail.ConfigJs.Delete +"</a>");
                
                html.push("</td></tr>");
            
            }
            html.join("");
        } catch (e1) {

        }
        html.push("</table>");
        return html.join("");
};

mailPOP.getAddHtml = function(id) {
   /*
 try {
        var html = [];
        var p = this;
        var id = attrs.id;
        isEdit = isEdit || 0;        
        var title = (isEdit) ? Lang.Mail.ConfigJs.edit_pop : Lang.Mail.ConfigJs.add_pop;
        
        //html.push("<h1>{0}</h1>".format(title));
        html.push("<div class=\"formArea\">");
        html.push("<input type=\"hidden\" value=\"{0}\" id=\"option_isEdit\" name=\"option_isEdit\">".format(isEdit));
        html.push("<input type=\"hidden\" value=\"{0}\" id=\"option_id\" name=\"option_id\">".format(attrs.data.id.attribute.value||0));
        html.push(this.getTable(this.attrs));
        html.push("</div>");
        //html.push("</div>");//</div>");
        return html.join("");
    } catch (e) {
        return "";
    }
*/
    var html = [];
    var p = this;
        
    html.push("<div id=\"rm_main\">");
    //返回
    html.push("<h2 class=\"set_til\"><label id=\"addMod\"> "+Lang.Mail.ConfigJs.addPOPmailbox);
    html.push("</label><a id='back' class=\"fn bord-spa\" href=\"javascript:void(0);\">  &#8249;&#8249;"+Lang.Mail.ConfigJs.filter_return +"</a></h2>");
    html.push("<div class=\"rm_top_wrap\">");
    html.push("<p class=\"\"style=\"color:#A2A2A2; padding-left:25px; margin-bottom:10px; font-size:15px;\">"+top.Lang.Mail.Write.zuiduoketianjiagedaishouyouxiang+"</p>");//<p class=\"\"style=\"color:#A2A2A2; padding-left:25px; margin-bottom:10px; font-size:15px;\">最多可添加5个代收邮箱</p>
    html.push("<table width='100%' class=\"rm_box_layout\">");
    //代收邮箱账号
    html.push("<tr>");
    html.push("<td class=\"ta_r mailPOP_tdWidth\"  >"+Lang.Mail.ConfigJs.POPmailboxAccount+"</td>");
    html.push("<td><div class=\"p_relative\">");
    html.push("<input id='username' maxlength='200' class=\"rm_txt w284\" type=\"text\" value=\"\"/>");
    //账号错误提示
    html.push(p.getFalseTip("usernameTip","usernameTipText"));
    html.push("</div></td>");
    html.push("</tr>");
    //邮箱密码
    html.push("<tr>");
    html.push("<td class=\"ta_r\">"+Lang.Mail.ConfigJs.pop_password+"</td>");
    html.push("<td><input id='password' maxlength='30' class=\"rm_txt w284\" type=\"password\"/>");
    html.push(p.getFalseTip("pwdTip","pwdTipText"));
    html.push("</td></tr>");
    //代收文件夹 Lang.Mail.ConfigJs.receiveFile
    html.push("<tr>");
    html.push("<td class=\"ta_r\" id='folderName'>"+Lang.Mail.ConfigJs.receivedMailFolder+"</td>");
    //html.push("<td id='selectFile'></td>");
    html.push("<td><input type=\"hidden\" id=\"textFid\" ><input type=\"text\" maxlength='32' id=\"textFolderName\" class=\"rm_txt w284\">");
    html.push(p.getFalseTip("folderNameTip","folderNameTipText"));
    //html.push("<span>&nbsp&nbsp&nbsp&nbsp（默认以邮箱地址作为文件夹名）<span>");
    html.push("</td>");
    html.push("</tr>");
    html.push("</table>");
    html.push("</div><!--rm_top_wrap-->");
    //高级设置
    html.push("<div class=\"senior_box\">");
    html.push("<h3 id='showPopDetail' style='cursor:pointer;border-bottom:none'>");
    html.push("<i id='triangle' class=\"i_senior_sli_on\">");
    html.push("</i><label id=\"wzbh\" style=\"cursor:pointer;margin-left:5px\">"+Lang.Mail.ConfigJs.advancedSettings);
    html.push("<span  style=\"margin-right:5px;cursor:pointer;\">("+Lang.Mail.ConfigJs.rulesSettings+")</span></label></h3>");
    html.push("<div id='popDetail' class=\"rm_top_wrap\">");
    html.push("<table  class=\"rm_box_layout\">");
    //邮件接收服务器POP
    html.push("<tr>");
    html.push("<td class=\"ta_r mailPOP_tdWidth\"  >"+Lang.Mail.ConfigJs.mailSeverPOP+"</td>");
    html.push("<td><input class=\"rm_txt w284\" maxlength='40' id='server' type=\"text\" value=\"\"/>");
    html.push(p.getFalseTip("serverTip","serverTipText"));
    html.push("</td></tr>");
    //服务器超时秒数
    html.push("<tr>");
    html.push("<td class=\"ta_r\"  width=\"120\">"+Lang.Mail.ConfigJs.severTimeoutSeconds+"</td>");
    html.push("<td><input class=\"rm_txt w284\" maxlength='4' id='timeout' type=\"text\" value=\"\"/>");
    html.push(p.getFalseTip("timeoutTip","timeoutTipText"));
    html.push("</td></tr>");
    //端口
    html.push("<tr>");
    html.push("<td class=\"ta_r\" width=\"120\">"+Lang.Mail.ConfigJs.port+"</td>");
    html.push("<td><input  id='port' maxlength='5' class=\"rm_txt w284\" type=\"text\" value=\"\"/>");
    html.push("<span>&nbsp&nbsp&nbsp&nbsp（"+Lang.Mail.ConfigJs.pop_defaultport +"）<span>");
    html.push(p.getFalseTip("portTip","portTipText"));
    html.push("</td></tr>");
    
    //是否自动代收
    
    html.push("<tr>");
    html.push("<td width=\"120\" class=\"ta_r\">" + Lang.Mail.ConfigJs.popSet + "</td>");
    html.push("<td><input class=\"rm_cb\" type=\"checkbox\" checked=\"checked\" id=\"isAutoPOP\"> <label for=\"isAutoPOP\">"+top.Lang.Mail.Write.zidongshouqu+"</label></td>");//<td><input class=\"rm_cb\" type=\"checkbox\" checked=\"checked\" id=\"isAutoPOP\"> <label for=\"isAutoPOP\">自动收取</label></td>
    html.push("</tr>");


   
    //在原邮箱中保留邮件备份
    html.push("<tr>");
    html.push("<td>&nbsp;</td>");
    html.push("<td><input class=\"rm_cb\" checked='checked' type=\"checkbox\" id=\"leaveOnServer\">");
    html.push("<label for=\"leaveOnServer\">"+Lang.Mail.ConfigJs.tetentionMailBackup+"</label></td>");
    html.push("</tr>");
    //此服务器要求加密链接
    html.push("<tr>");
    html.push("<td>&nbsp;</td>");
    html.push("<td><input class=\"rm_cb\" type=\"checkbox\" id=\"isSSL\"> ");
    html.push("<label for=\"isSSL\">"+Lang.Mail.ConfigJs.encrytionLink+"</label></td>");
    html.push("</tr>");
    html.push("<tr>");
    html.push("<td class=\"ta_r\">" + Lang.Mail.ConfigJs.receiveMails + "</td>");
    html.push("<td>");

    html.push("<label for=\"rm_all\"><input name='recent' checked='checked' value='0' id=\"rm_all\" class=\"rm_radio\" type=\"radio\"/>");
    html.push(Lang.Mail.ConfigJs.all+"</label>");

    html.push("<label style=\"margin-left: 15px;\" for=\"rm_month\"><input name='recent'  value='2' id=\"rm_month\" class=\"rm_radio\" type=\"radio\"/>");
    html.push(Lang.Mail.ConfigJs.last30days+"</label>");

    html.push("<label style=\"margin-left: 15px;\" for=\"rm_week\"><input name='recent' id=\"rm_week\" value='1' class=\"rm_radio\" type=\"radio\"/>");
    html.push(Lang.Mail.ConfigJs.last7days+"</label>");

    html.push("</td>");
    html.push("</tr>");
    html.push("</table>");
    html.push("</div>");
    html.push("</div><!--senior_box-->");
    html.push("<div class=\"btm_pager pl_10\">");
    //确定按钮
    html.push("<a id='save' onclick='mailPOP.add("+id+")' class=\"n_btn_on mt_5\"><span><span>"+Lang.Mail.ConfigJs.pref_confirm +"</span></span></a>");
    //取消按钮
    html.push("<a id='cancel' class=\"n_btn mt_5\"><span><span>"+Lang.Mail.ConfigJs.pref_cancel +"</span></span></a>");
    html.push("</div>");
    html.push("</div><!--rm_main-->");
    
    return html.join("");
};

/**
 *  跳转到添加、编辑的代收邮箱的页面
 * @param {Object} b
 */
mailPOP.showAdd = function(id) {
    var p = this;
    var oAdd = $("pmailPOPWrapper");
    if(id == 0){
        p.opType = "add";
    } else {
        p.opType = "mod";
    };
    
    //更新为添加、编辑页面
    oAdd.innerHTML = this.getAddHtml(id); 
    //加载下拉框控件
    //this.getDropSelect("selectFile");
    //初始化事件
    this.initEvent(id);
};
/**
 * 隐藏显示POP高级选项
 */
mailPOP.showHidePOPDetail = function(c){
    if (c) {
        jQuery("#triangle").attr("class","i_senior_sli");
        jQuery("#popDetail").show();
        jQuery("#showPopDetail").css("border-bottom","");
        jQuery("#wzbh").css("margin-left","0px");
    } else {
        jQuery("#triangle").attr("class","i_senior_sli_on");
        jQuery("#popDetail").hide();
        jQuery("#showPopDetail").css("border-bottom","none");
        jQuery("#wzbh").css("margin-left","4px");
    };
};

/**
 * 增加、保存代收地址页面的初始事件
 */
mailPOP.initEvent = function(id){
    var p = this,
        folders = CM.folderMain[gConst.dataName],
        len = folders.length;

    jQuery("#showPopDetail").css("border-bottom","none");
    jQuery("#wzbh").css("margin-left","4px");
    
    
    //1、给个输入框赋默认值，先要执行这个赋值操作
    p.setInputDefaultValue("username", "("+Lang.Mail.ConfigJs.as+"：zhangsan@example.com)",1);
    p.setInputDefaultValue("textFolderName", Lang.Mail.ConfigJs.defaultFolderName, 1);
    p.setInputDefaultValue("server", "("+Lang.Mail.ConfigJs.as+"：pop.example.com)",1);
    p.setInputDefaultValue("port", "110",0);
    p.setInputDefaultValue("timeout", "90",0);

            
    for (; len--; ) {
        if (folders[len].popMailId === +(id) && folders[len].folderPassFlag === 1) {
            jQuery("#textFolderName").prop("disabled", true);
            break;
        }
    }
    
    //2、光标离开输入框验证内容格式是否正确，再执行这个操作
    jQuery("#username, #textFolderName, #server,#timeout,#port").bind("blur", function(){
        p.vdFormat(1);
    });
    
    //勾选SSL改变端口的值
    jQuery("#isSSL").click(function(){
        if(jQuery(this).attr("checked")=="checked"){
            jQuery("#port").val(995);
        }else{
            jQuery("#port").val(110);
        }
    });
    
    jQuery("#username").bind("blur", function(){
        //根据邮件地址设置  邮件接收服务器POP
        p.autoSetPOPServer();
    });
  
    //如果操作是编辑，则根据 此id在服务器得到数据，初始化各个值
    if(p.opType == "mod"){
        p.initEditHtml(id);
    }
   
    //点击返回、取消则跳到列表页面
    jQuery("#back,#cancel").bind("click",function(){
        p.init();
    });
    
    //光标在密码输入框按下回车 触发保存事件
    jQuery("#password").bind("keydown",function(ev){
        if(ev.keyCode == 13){
            jQuery("#save")[0].click();
        }
    });

    // 接受文件夹自动填充为代收邮箱账号
    jQuery("#username").blur(function () {
        var folderName = jQuery("#textFolderName");

        if (folderName.val() === Lang.Mail.ConfigJs.defaultFolderName && jQuery(this).val() !== "("+Lang.Mail.ConfigJs.as+"：zhangsan@example.com)") {
            folderName.val(jQuery(this).val());
            folderName.css("color", "#000000");
        }
    });

    jQuery("#showPopDetail").click(function () {
        if (jQuery("#popDetail").is(":hidden")) {
            mailPOP.showHidePOPDetail(1);
        } else {
            mailPOP.showHidePOPDetail(0);
        }
    });
};

/**
 * 初始化"修改代收设置"页面，根据ID赋值，展开高级选项，邮箱地址栏不能修改
 */
mailPOP.initEditHtml = function(id){
    //根据ID赋值
    this.setEditValue(id);
    
    jQuery("#addMod").html(Lang.Mail.ConfigJs.updatePOPMail);
    
    //展开高级选项
    jQuery("#triangle").attr("class","i_senior_sli");
    jQuery("#popDetail").show();
    jQuery("#wzbh").css("margin-left","0");
    jQuery("#showPopDetail").css("border-bottom","");
    
    //邮箱地址栏不能改
    jQuery("#username").attr("disabled","disabled");
};

/**
 * 给页面赋值
 * @param {Object} id
 */
mailPOP.setEditValue = function(id){
    var p = this;
    var url = this.getUrl(gConst.func.getPOP);
    var data ={
        id : id,
        status : 0
    };
    
    //获得数据的AJAX请求
    p.ajaxRequest("user:getPOPAccounts",data,function(ao){
        var c1 = ao[0].leaveOnServer==1 ? true : false;
        var c2 = ao[0].isSSL==1 ? true : false;
        var c3 = ao[0].isAutoPOP == 1? true : false;
        
        jQuery("#username").val(ao[0].username);
        jQuery("#password").val(ao[0].password);
        jQuery("#server").val(ao[0].server);
        jQuery("#timeout").val(ao[0].timeout);
        jQuery("#port").val(ao[0].port);
        jQuery("#leaveOnServer").attr("checked",c1);
        jQuery("#isSSL").attr("checked",c2);
        jQuery("#username,#server,#textFolderName").css("color","black");
        jQuery("#textFolderName").val(ao[0].folderName.decodeHTML());
        jQuery("#textFolderName").attr("oldName", ao[0].folderName); // 用于文件夹重复检查
        jQuery("#textFid").val(ao[0].fid);
        jQuery("#isAutoPOP").attr("checked",c3);
        jQuery("input:radio[name=recent]").each(function (index, item) {
            if (jQuery(item).val() == ao[0].flag) {
                jQuery(item).prop("checked", true);
            }
        });

        //p.attrs.dropselect.setValue(ao[0].fid);
    },function(ao){
        
    },url,p.attrs.ajaxType);    
};

/**
 * 输入框光标移入移出时，文字颜色，内容的变化
 * @param {Object} id 输入框的ID
 * @param {Object} initValue 输入框默认值
 */
mailPOP.setInputDefaultValue = function(id, initValue,bf){
    if(bf){
        jQuery("#"+id).val(initValue).css("color","#BFBFBF");
    }else{
        jQuery("#"+id).val(initValue);
    }
    
    jQuery("#"+id).focus(function(){
        var inputValue = jQuery("#"+id)[0].value.trim();
        if (initValue == "") {
            initValue = jQuery("#"+id).val();
        }
        if (inputValue == initValue) {
            jQuery("#"+id).val("");
            jQuery("#"+id).css("color", "black");
        }
    }).blur(function(){
        var inputValue = jQuery("#"+id)[0].value.trim();
        if (inputValue == '' || inputValue == null) {
            jQuery("#"+id).val(initValue);
            if(bf){
                jQuery("#"+id).css("color", "#BFBFBF");
            }
            
        }
    });
};
mailPOP.returnList = function() {
    //    this.initDataField();
    this.showAdd(true);
};


mailPOP.showDetail = function(obj,id) {
    if(obj&&obj.childNodes){
        var objShow = obj.childNodes[0];
        var objHide = obj.childNodes[1];
        var style = (objShow.style.display == "none") ? "none":"";
        for(var i = 1,l=arguments.length; i < l; i++){
            var aa = arguments[i];
            if (typeof(aa) == 'string') {
                aa = $("option_mailPOP_"+aa);
                aa.style.display = style;
            }
        }
        if(objShow.style.display=="none"){
            objShow.style.display = ""; 
            objHide.style.display = "none";
        }else{
            objShow.style.display = "none"; 
            objHide.style.display = "";
        }
    }
};

/**
* 检查代收邮件夹名字
*/
mailPOP.checkFolderName = function (oldName, newName) {
    var isRepeat = false,
        len = LM.folders.length;

    if (oldName !== newName) {
        for (; len--; ) {
            if (newName === LM.folders[len].name) {
                isRepeat = true;
                break;
            }
        }
    }
    return isRepeat;
};

/**
 * 根据输入的邮件地址 自动设置pop
 */
mailPOP.autoSetPOPServer = function(){
    var username = jQuery("#username").val().trim();
    if (username != ""&&Vd.checkData("email",username)) {
            var at = username.indexOf('@');
            var strServer = "";
            if(/yahoo.com.cn$/.test(username)){
                strServer = "pop.mail." + username.substr(at+1);
            }else{
                strServer = "pop." + username.substr(at+1);
            }
            jQuery("#server").val(strServer).css("color","black");
        }
};

/**
 * 修改代收设置
 * @param {Object} index
 */
mailPOP.update = function(index){
    var p = this;
    p.opType = 'mod';
    //$("pmailPOPWrapper").innerHTML = p.getAddHtml(attrs, 1);

    p.showAdd(index);
};

/**
 * 检查邮箱地址是否正确及提示,是否在容许的范围中
 * @param {Object} mail
 * @param {Object} type 判断的类型  [autoForward:自动转发]
 * @param {Boolean} noFomat 不验证是否邮箱合法 (有些是不用验证域名的)
 */
mailPOP.checkMail = function(mail,type,noFomat){
    //test
    /*gMain.collectioncorpConfigType = "2";//邮件代收类型    0不限制 1只允许 2禁止
    gMain.collectioncorpConfig ="aa@afsd.com,*@se.com,";
    
    gMain.forwardcorpConfigType = "1";//邮件代收类型    0不限制 1只允许 2禁止
    gMain.forwardcorpConfig ="aa@afsd.com,*@se.com,";
    */
    //test end
    
    var nameTip = jQuery("#nameTip");
    var p = this;
    var allowType = "";
    var checkEmails = "";
    var arrCheckEmails = [];
    var allowTip = "";
    var forbidTip = "";
    var len = 0;
    var bInAllow = false;               //用户输入的代收邮件是否在允许的邮件地址中
    var bInForbid = false;              //用户输入的代收邮件是否在禁止的邮件地址中
    var type = type || "mailPOP";
    
    //判断邮件地址是否合法
    if(!Vd.checkData("email",mail) && !noFomat){
            jQuery("#usernameTip").css("display","inline");
            jQuery("#usernameTipText").html(Lang.Mail.ConfigJs.errorMailFormat);
            return 0;
    }
    
    if (type == "mailPOP") {
        allowType = gMain.collectioncorpConfigType;
        checkEmails = gMain.collectioncorpConfig.trim();
        
        allowTip = Lang.Mail.ConfigJs.onlySupportPop+"“"+checkEmails+"”"+Lang.Mail.ConfigJs.is_Mail;
        forbidTip = Lang.Mail.ConfigJs.forbit_pop+"“"+checkEmails+"”"+Lang.Mail.ConfigJs.is_Mail;
        
    }else if(type == "autoForward"){
        allowType = gMain.forwardcorpConfigType;
        checkEmails = gMain.forwardcorpConfig.trim();
        //allowTip = "仅支持转发到 "+checkEmails;
        //forbidTip = "禁止转发到 "+checkEmails;
    }
    
    if(checkEmails != "" && checkEmails != "undefined"){
            arrCheckEmails = checkEmails.split(/[;,]/); 
    }

    len = arrCheckEmails.length;
    
    jQuery("#usernameTip").hide();
    
    if (allowType === "" || typeof allowType == "undefined") {
        return 1;
    }
    
    if(allowType == 0){
        return 1;
    } 
    
    if(len < 1){
        return 1;
    }
    
    //邮件代收类型    [0:不限制  1:允许 2:禁止]
    for(var i=0; i<len; i++){
        var  checkEmail = arrCheckEmails[i];
        
        /* 判断 是否在允许的邮件中，如：user@example.com  *@example.com
         * 先判断是否是限制了域名 *@example.com
         * 在判断是否是限制了具体的一个邮件地址
         * 可以输入多个邮件地址或邮件域的限制条件
         */
        if(checkEmail.substr(0,1)=="*"){
            if(mail.search(eval("/"+checkEmail.substring(1)+"$/i")) != -1 ){
                if(allowType == 1){
                    bInAllow = true;
                }else if(allowType == 2){
                    bInForbid = true;
                }
                
            }
        }else if(mail == checkEmail){
            if(allowType == 1){
                bInAllow = true;
            }else if(allowType == 2){
                bInForbid = true;
            }
        }
    
    }
    
    //如果用户输入的代收邮件不在允许的邮件地址中
    //提示：仅支持代收“*@139.com;*@chinamobile.com”的邮件
    if(!bInAllow && allowType == 1){
        if (type == "mailPOP"){
            jQuery("#usernameTip").css("display","inline");
            jQuery("#usernameTipText").html(allowTip);
        }
        
        return 0;
    }

    
    //如果用户输入的代收邮件在禁止的邮件地址中
    //提示：禁止代收“*@139.com;*@chinamobile.com”的邮件
    if(bInForbid && allowType == 2){
        if (type == "mailPOP") {
            jQuery("#usernameTip").css("display","inline");
            jQuery("#usernameTipText").html(forbidTip);
        }
        return 0;
    }
    
    return 1;
};

mailPOP.checkPwd = function(pwd){
    var pwdTip = jQuery("#pwdTip");
    pwdTip.hide();
    
    if(pwd == "" || pwd == null){
        pwdTip.css("display","inline");
            jQuery("#pwdTipText").html(Lang.Mail.ConfigJs.pswNotEmpty);
            return 0;
    }else{
        return 1;
    }
};
/**
 * 验证各个输入框是否为空
 */
mailPOP.vdEmpty = function(){
    var p = this;
    var result = 1; //返回值，如果有一个输入框值没通过验证，则返回0
    var isShowDetail = false;
    var username = jQuery("#username").val().trim();
    jQuery("#usernameTip,#pwdTip, #folderNameTip, #serverTip,#timeoutTip,#portTip").hide();
    
    //当光标离开输入框时，或者点确定按钮（即使输入框有默认提示）时，提示代收邮箱不能为空
    if(!Vd.checkData("empty",username) || 
    (username == "("+Lang.Mail.ConfigJs.as+"：zhangsan@example.com)")  ){
        jQuery("#usernameTip").css("display","inline");
        jQuery("#usernameTipText").html(Lang.Mail.ConfigJs.POPMailnotEmpty);
        result = 0;
    }

    if(!Vd.checkData("empty",jQuery("#password").val().trim())){
        jQuery("#pwdTip").css("display","inline");
        jQuery("#pwdTipText").html(Lang.Mail.ConfigJs.pswNotEmpty);
        result = 0;
    }

    if (jQuery("#textFolderName").val().trimAll().encodeHTML().length === 0 || jQuery("#textFolderName").val() === Lang.Mail.ConfigJs.defaultFolderName) {
        jQuery("#folderNameTip").css("display","inline");
        jQuery("#folderNameTipText").html(Lang.Mail.ConfigJs.folderNameNotEmpty);
        result = 0;
    }
    
    if(!Vd.checkData("empty",jQuery("#server").val().trim())){
        jQuery("#serverTip").css("display","inline");
        jQuery("#serverTipText").html(Lang.Mail.ConfigJs.POPnotEmpty);
        isShowDetail = true;
        result = 0;
    }
    
    if(!Vd.checkData("empty",jQuery("#timeout").val().trim())){
        jQuery("#timeoutTip").css("display","inline");
        jQuery("#timeoutTipText").html(Lang.Mail.ConfigJs.timeoutNotEmpty);
        isShowDetail = true;
        result = 0;
    }
    
    if(!Vd.checkData("empty",jQuery("#port").val().trim())){
        jQuery("#portTip").css("display","inline");
        jQuery("#portTipText").html(Lang.Mail.ConfigJs.portInteger);
        isShowDetail = true;
        result = 0;
    }
    
    if(isShowDetail){
        jQuery("#popDetail").show();
        jQuery("#wzbh").css("margin-left","0");
        jQuery("#showPopDetail").css("border-bottom","");
    }
    return result;
};
/**
 * 验证各个输入框是否合法
 */
mailPOP.vdFormat = function(isLostFocus){
    var p = this;
    var result = 1;
    var username = jQuery("#username").val().trim();
    var server = jQuery("#server").val().trim();
    var folderName = jQuery("#textFolderName").val().trim().encodeHTML();
    var oldName = jQuery("#textFolderName").attr("oldName");
    var isShowDetail = false;
    var i;
    jQuery("#usernameTip,#serverTip,#timeoutTip,#portTip").hide();
    
    //gMain.popAccountType = "0";

    var checkAlias = function () {
        for (i = 0; i < aliasList.length; i++) {
            if (username === aliasList[i].value) {
                jQuery("#usernameTip").css("display","inline");
                jQuery("#usernameTipText").html(Lang.Mail.ConfigJs.notUseAlias);
                result = 0;
                break;
            }
        }
        return result;
    };
    var checkMail = function(){
        if(!Vd.checkData("email",username)){
            jQuery("#usernameTip").css("display","inline");
            jQuery("#usernameTipText").html(Lang.Mail.ConfigJs.errorMailFormat);
            result = 0;
        }
    };
    var checkPOP = function(){
        if(!Vd.checkData("domain",server)){
            jQuery("#serverTip").css("display","inline");
            jQuery("#serverTipText").html(Lang.Mail.ConfigJs.validPOP);
            result = 0;
        }
    };

    var checkFolderName = function () {
        if (p.checkFolderName(oldName, folderName)) {
            jQuery("#folderNameTip").css("display","inline");
            jQuery("#folderNameTipText").html(Lang.Mail.ConfigJs.folderNameNotWithOther);
            result = 0;
        }
    }
    checkAlias();
    //如果按“确定”
    if(isLostFocus != 1){
        //如果popAccountType 为1，说明不用检查邮箱格式（不用域名）
        //if(window.gMain && gMain.popAccountType && parseInt(gMain.popAccountType,10)){
        //  result = p.checkMail(username,"",true);
        //}else{
            if (result !== 0) {
                result = p.checkMail(username);
            }
        //}
        
        checkPOP();
        checkFolderName();
    }else{
        //如果光标移出输入框,并且输入框不为默认值
        if(username != "("+Lang.Mail.ConfigJs.as+"：zhangsan@example.com)"){
            
            //如果popAccountType 为1，说明不用检查邮箱格式（不用域名）
            //if(window.gMain && parseInt(gMain.popAccountType,10)){
                
            //}else{
            if (result !== 0) {
                result = p.checkMail(username);
            }
        }
        if(server != "("+Lang.Mail.ConfigJs.as+"：pop.example.com)"){
            checkPOP();
        }
    }
    if (/[% '"\/;|&\*]/g.test(folderName)) {
        jQuery("#folderNameTip").css("display", "inline");
        jQuery("#folderNameTipText").html(Lang.Mail.ConfigJs.folderNameRegMsg);
        result = 0;
    }
    if(!/^[0-9]{1,4}$/.test(jQuery("#timeout").val().trim())){
        jQuery("#timeoutTip").css("display","inline");
        jQuery("#timeoutTipText").html(Lang.Mail.ConfigJs.timeoutOnlyDigital);
        result = 0;
        isShowDetail = true;
    }
    
    if(!Vd.checkData("port",jQuery("#port").val().trim())){
        jQuery("#portTip").css("display","inline");
        // jQuery("#portTipText").html(Lang.Mail.ConfigJs.portOnlyDigital);
        jQuery("#portTipText").html(Lang.Mail.ConfigJs.PortIncorrect);
        result = 0;
        isShowDetail = true;
    }
    if(isShowDetail){
        jQuery("#popDetail").show();
        jQuery("#wzbh").css("margin-left","0");
        jQuery("#showPopDetail").css("border-bottom","");
    }
    
    return result;
};
/**
 * 验证各个输入框是否为空，是否合法
 */
mailPOP.validateAll = function(){
    var p = this;
    return p.vdEmpty() && p.vdFormat();
};

/**
 * 保存代收邮箱
 */
mailPOP.add = function(id){
    console.log(mailPOP.dataList.length);
    var p = this;
    //var isEdit = $("option_isEdit").value;

    var isEdit = id == 0 ?  0 : 1;
    var tid = id == 0 ? 0 : id;

    var username = jQuery("#username").val().trim();
    var server = jQuery("#server").val().trim();
    var pwd = jQuery("#password").val().trim();
    var isSSL = jQuery("#isSSL").attr("checked") == "checked" ? 1 : 0;
    var folderName = jQuery("#textFolderName").val().trim();
    var flag = 0;
    var fid;

    flag = jQuery("input:radio[name=recent]:checked").val();

    if (mailPOP.opType === "add") {
        fid = 0;
    } else {
        fid = +(jQuery("#textFid").val().trim());
    }
/*
    if(isSSL){
        jQuery("#port").val(995);
    }else{
        jQuery("#port").val(110);
    }
    
*/
    jQuery("#nameTip").hide();
    jQuery("#pwdTip").hide();
    
    
    //验证数据是否为空，是否合法
    if(!mailPOP.validateAll()){
        jQuery("#popDetail").show();
        return false;
    }
    console.log(mailPOP.dataList.length);
    console.log(isEdit);
    
    //if(mailPOP.dataList.length < 5) {
    if (isEdit || mailPOP.dataList.length < 5) {
        var publicKey = '822b6785d4a32d968617425db2a20392127ec20a9dbfb63217d6d22084cf2bda2627380e3eea6567fd4fddd62146dc2bab2a69c574910ce285e58cce2f2b2dd7b079e80c7fb51bfbe4d7ad02b484c59ecc751811620890ce19ceeda020d1425107b3624a34da10d422ef13e6afdb9f6f9b47b5984554c7bfae0f3805f3fea83b';
        var encryptionExponent = '10001';
        setMaxDigits(131); //设置大
        var key = new RSAKeyPair(encryptionExponent, '', publicKey);
        pwd = encryptedString(key, pwd);

        var data = {
            id : tid,
            username : username,
            password : pwd,
            server : server,
            port : parseInt(jQuery("#port").val().trim()),
            timeout : parseInt(jQuery("#timeout").val().trim()),            
            //fid : parseInt(p.attrs.dropselect.getValue()), //原有下拉选项获取邮件夹名
            fid: fid,
            folderName: folderName,
            opType : mailPOP.opType,
            isSSL : isSSL , 
            isAutoPOP: jQuery("#isAutoPOP").attr("checked")=="checked" ? 1 : 0,
            leaveOnServer : jQuery("#leaveOnServer").attr("checked") == "checked" ? 1 : 0,
            flag: flag
        };  
        

        mailPOP.attrs.url = mailPOP.getUrl(gConst.func.setPOP);
        var url = mailPOP.attrs.url;        
        var popEmail=data.username;
        
        var aliasArr=[];
        
        for(var i=0;i<aliasList.length;i++){
            aliasArr.push(aliasList[i].name);
        }
                                
        if(popEmail.trim()==gMain.userNumber||aliasArr.has(popEmail.trim())||popEmail.trim()==(gMain.mobileNumber+"@"+gMain.domain)){
            CC.alert(Lang.Mail.ConfigJs.popAccountDiff);
            return false;
        }
        
        //提示正在验证
        CC.showMsg(Lang.Mail.ConfigJs.checkingPOP,false,false,"loading");
        
        //保存代收设置的AJAX请求
        p.ajaxRequest("user:setPOPAccount", data, function(ao){
            jQuery("#tipsfinish div").hide().show();
            //请求成功
            if (mailPOP.opType === "add") {
                CC.showMsg(Lang.Mail.ConfigJs.collectionSuc,true,false,"option");
            } else {
                CC.showMsg(Lang.Mail.ConfigJs.POPmodifySuc,true,false,"option");
            }
            if (data.isAutoPOP) {
                mailPOP.syncPOP(+(ao.popId));
            }
            mailPOP.init();
        }, function(ao){
            //请求失败
            mailPOP.requestFail(ao);
        }, url , mailPOP.attrs.ajaxType);

    }else{
        //提示邮件代收不能超过5个
        CC.alert(Lang.Mail.ConfigJs.pop_overflow+top.Lang.Mail.Write.wuge);//5个
    }
};

/**
* 用户双击即时更新
*/
mailPOP.ImmediateMod = function (username, folderName, el, oldName) {
    var me = this,
        data = null,
        tempData = null,
        i = 0,
        len = this.dataList.length,
        url;

    for (; i < len; i++) {
        if (username === this.dataList[i].username) {
            tempData = this.dataList[i];
        }
    }

    if (tempData === null || tempData.folderName === folderName) {return false;}

    data = {
        "id" : tempData.id,
        "username" : username,
        "server" : tempData.server,
        "port" : tempData.port,
        "timeout" : tempData.timeout,
        "fid": tempData.fid,
        "folderName": folderName,
        "opType" : "mod",
        "isAutoPOP": tempData.isAutoPOP,
        "leaveOnServer" : tempData.leaveOnServer,
        "isSSL": tempData.isSSL
    };  

    this.attrs.url = this.getUrl(gConst.func.setPOP);
    url = this.attrs.url;

    //提示正在验证
    CC.showMsg(Lang.Mail.ConfigJs.checkingPOP, false, false, "loadding");
    
    //保存代收设置的AJAX请求
    this.ajaxRequest("user:setPOPAccount", data, function(ao){
        el.html(folderName);
        LM.loadFolderMain();
        jQuery("#tipsfinish div").hide().show();
        CC.showMsg(Lang.Mail.ConfigJs.folderNameModSuc,true,false,"option");
    }, function(ao){
        el.html(oldName);
        if (ao.errorCode === 2327014) {
            CC.showMsg(Lang.Mail.ConfigJs.folderNameLong,true,false,"error");
        } else {
            CC.showMsg(Lang.Mail.ConfigJs.folderNameModFailed,true,false,"error");
        }
    }, url , me.attrs.ajaxType);
};

/**
 * 请求失败后根据服务器返回代码 给出相应的提示
 */
mailPOP.requestFail = function(ao){
    var p = this;
    var $usernameText = jQuery("#usernameTipText");
    var $serverText = jQuery("#serverTipText");
    
    if (ao.code == "FA_BAD_PASSWORD" || ao.code == "FA_BAD_USER") {
        //密码或账号错误
        jQuery("#usernameTip").css("display", "inline");
        $usernameText.html(p.getSubmitFailTipHtml(1));
    }
    else 
        if (ao.code == "FA_XXXX_EXISTS" || ao.code == "FA_ACCOUNT_EXISTS") {
            jQuery("#usernameTip").css("display", "inline");
            $usernameText.html(p.getSubmitFailTipHtml(4));
        }
        else 
            if (ao.code == "FA_BAD_SERVER" || ao.code == "FA_FORBIDDEN") {
                //pop错误或者端口打不开
                jQuery("#popDetail").show();
                jQuery("#wzbh").css("margin-left","0");
                jQuery("#showPopDetail").css("border-bottom","");
                jQuery("#serverTip").css("display", "inline");
                $serverText.html(p.getSubmitFailTipHtml(2));
            }
            else 
                if (ao.code == "FA_FORBIDDEN_1" || ao.code == "FA_FORBIDDEN_2" ) {
                    jQuery("#usernameTip").css("display", "inline");
                    $usernameText.html(p.getSubmitFailTipHtml(5));
                }
                else if(ao.code == "FA_FORBIDDEN_3"){
                    jQuery("#usernameTip").css("display", "inline");
                    $usernameText.html(p.getSubmitFailTipHtml(7));
                }
                else if (ao.errorCode === 2327014 || ao.errorCode === 2322015) {
                    jQuery("#folderNameTip").css("display","inline");
                    jQuery("#folderNameTipText").html(Lang.Mail.ConfigJs.folderNameLong);
                    result = 0;
                } else
                    if (ao.code == "FS_UNKNOWN") {
                        //pop错误或者端口打不开
                        jQuery("#popDetail").show();
                        jQuery("#wzbh").css("margin-left","0");
                        jQuery("#showPopDetail").css("border-bottom","");
                        jQuery("#serverTip").css("display", "inline");
                        $serverText.html(p.getSubmitFailTipHtml(6));
                    }
    else{
        jQuery("#usernameTip").css("display","inline");
        $usernameText.html(p.getSubmitFailTipHtml(3));
    }
};
/*
循环提示,原来的需求
mailPOP.requestFail = function(){
    var p = this;
    //统计失败次数
    var oText = jQuery("#usernameTipText");
    var count = ++p.attrs.failCounts;

    jQuery("#usernameTip").css("display","inline");
    switch (count%3) {
        case 1:
            oText.html(p.getSubmitFailTipHtml(1));
            break;
        case 2:
            oText.html(p.getSubmitFailTipHtml(2));
            break;
        case 0:
            oText.html(p.getSubmitFailTipHtml(3));
            break;
        default:
            oText.html(p.getSubmitFailTipHtml(1));
    }
};
*/
/**
 * 返回提交代收地址失败后的提示内容
 */
mailPOP.getSubmitFailTipHtml = function(n){
    var html = [];

    switch (n){
        case 1:
            html.push("<h3 style='border-bottom:0'>"+Lang.Mail.ConfigJs.autenticationFailed+"</h3>");
            html.push("<p>"+Lang.Mail.ConfigJs.reasonMaybe+"：</p>");
            html.push("<ol>");
            html.push("<li>"+Lang.Mail.ConfigJs.addressNotMatch+"；</li>");
            html.push("<li>"+Lang.Mail.ConfigJs.manuPOP+"。</li>");
            html.push("</ol>");
            break;
        case 2:
            html.push("<h3 style='border-bottom:0'>"+Lang.Mail.ConfigJs.autenticationFailed+"</h3>");
            html.push("<p>"+Lang.Mail.ConfigJs.reasonMaybe+"：</p>");
            html.push("<ol>");
            html.push("<li>"+Lang.Mail.ConfigJs.popFailed+"；</li>");
            html.push("<li>"+Lang.Mail.ConfigJs.manuPOP+"。</li>");
            html.push("</ol>");
            break;
        case 3:
            html.push("<h3 style='border-bottom:0'>"+Lang.Mail.ConfigJs.autenticationFailed+"</h3>");
            html.push(Lang.Mail.ConfigJs.reCommendPOP+"\""+Lang.Mail.ConfigJs.filter_auto_forward +"\"<br/>");
            html.push(Lang.Mail.ConfigJs.forwarMailTo);
            break;
        case 4:
            html.push(Lang.Mail.ConfigJs.pop_repeat);
            break;
        case 5:
            html.push(Lang.Mail.ConfigJs.errorLimitTip);
            break;
        case 6:
            html.push(Lang.Mail.ConfigJs.temporaryConnect);
            break;
        case 7:
            html.push(Lang.Mail.ConfigJs.reachTheTopSoStop);
            break;  
    }
    
    return html.join("");
};

/**
 * 收取邮件
 * @param {Object} id
 * @param {Object} isAll
 * @param {Object} isRefresh
 * @param {Object} fid
 * @param {Object} noErrorMsg 是否弹出错误对话框，用于定时自动代收
 */
mailPOP.syncPOP = function(id, isAll, isRefresh, fid, noErrorMsg){
    var p = this;
    var func = (isAll)?gConst.func.syncPOPALL:gConst.func.syncPOP;
    //var func = gConst.func.syncPOP;
    var url = p.getUrl(func);
    this.opType = "pop";
    var data = {id:id};
    
    //如果没列表没有代收
    if(isAll && this.dataList.length === 0){
        CC.alert(Lang.Mail.ConfigJs.pop_noPop);
        return;
    }
    
    if(isAll){
        data = {id:""};
    }

    CC.showMsg(Lang.Mail.ConfigJs.receivingMail,true,false,"option");
    p.ajaxRequest(func, data, function(ao){
        LM.loadFolderMain();
        if (isRefresh) {
            MM.goTo("user" + fid, "refresh", 0);
        }
    }, function(ao){
        if (!noErrorMsg) {
            p.fail(Lang.Mail.ConfigJs.PopFail, ao);
        }
    }, url , p.attrs.ajaxType);

};

/**
 * 判断是否收取完成
 * @param {Object} popid
 * @param {Object} mail
 */
mailPOP.JudgeIfColCom = function(){
    var p = this;
    var url = this.getUrl(gConst.func.getPOP);
    var data = {}
    
    var fnInterval = setInterval(function(){
        p.ajaxRequest("user:getPOPAccounts", data, function(ao){
        
            var isComplete = true;
            var len = ao.length;
            
            for(var i = 0; i<len; i++){
                if(!ao[i].status){
                    isComplete = false;
                }
            }
            if (isComplete) {
                clearInterval(fnInterval);
                CC.showMsg(Lang.Mail.ConfigJs.reCom, true, false, "option");
            }
            
        }, function(ao){
            clearInterval(fnInterval);
            p.fail(Lang.Mail.ConfigJs.PopFail, ao);
        }, url, p.attrs.ajaxType);
    }, 2500);
    fnInterval();
};

mailPOP.del = function(popid,mail) {
    var p = mailPOP,
        folders = CM.folderMain[gConst.dataName],
        len = folders.length;

    for (; len--; ) {
        if (folders[len].popMailId === +(popid) && folders[len].folderPassFlag === 1) {
            CC.showMsg(Lang.Mail.ConfigJs.folderEncryptedNoDel, true, false, "error");
            return false;
            break;
        }
    }
    var okCallbak = function() {
        var url = p.getUrl(gConst.func.setPOP);
        if (jQuery("#radioNoDelMail").prop("checked") === true) {
            p.opType = "deleteFolder";
        } else {
            p.opType = "delete";
        }
        var data = {
            opType: p.opType,
            id: parseInt(popid)
        };
        p.ajaxRequest(p.attrs.save.func, data, function(ao) {
             //p.saveAfter();
    
            jQuery("#tipsfinish").hide().show();
            CC.showMsg(Lang.Mail.ConfigJs.filter_delSuccess,true,false,"option");
             p.init();
            //刷新列表
            
           
        }, function(ao) {
        CC.alert(Lang.Mail.ConfigJs.mailpop_delFl);
        }, url, p.attrs.ajaxType);
    };
    CC.confirm(Lang.Mail.ConfigJs.ifDelete+"\""+mail+"\""+Lang.Mail.ConfigJs.POPmail + "<p class=\"msgDialog\"><label><input id=\"radioNoDelMail\" checked=\"checked\" name=\"radioDelType\" type= \"radio\"/> "+top.Lang.Mail.Write.jyjjzyjyddsxxzoUgQATdB+"</label><br /><label><input id=\"radioDelMail\" name=\"radioDelType\" type= \"radio\"/> "+top.Lang.Mail.Write.youjianyiqishanchu+"</label></p>", okCallbak, Lang.Mail.ConfigJs.mailpop_sysPrompt);//<p class=\"msgDialog\"><label><input id=\"radioNoDelMail\" checked=\"checked\" name=\"radioDelType\" type= \"radio\"/> 将邮件夹中邮件移动到\“收信箱\”中</label><br /><label><input id=\"radioDelMail\" name=\"radioDelType\" type= \"radio\"/> 邮件一起删除</label></p>
};

/**
 * 修改页面上的数组popList
 * @param {object} ad 服务器传过来的代收帐号信息的数组
 */
mailPOP.modPOPList = function(ad){
    if(popList == undefined){
        return;
    }
    
    var l = ad.length;
    popList = [];
    
    if(l>0){
        for(var i = 0; i<l; i++){
            //{"email":"whzzyz@21cn.com","fid":1,"location":10800,"popId":80}
            var obj ={
                "email":ad[i].username,
                "fid":ad[i].fid,
                "popId":ad[i].id
            };
            popList.push(obj);
        }
    }
};

mailPOP.saveAfter = function(){
    switch(this.opType){
         case "add":
             this.ok(Lang.Mail.ConfigJs.pop_successAdd);
            break;
         case "mod":
             this.ok(Lang.Mail.ConfigJs.pop_successMod);
            break;
        case "deleteWithoutFolder":
//        case "delete":
            jQuery("#tipsfinish div").hide().show();
            CC.showMsg(Lang.Mail.ConfigJs.filter_delSuccess,true,false,"option");
            break;
         case "pop":
             this.ok(Lang.Mail.ConfigJs.pop_laterLook);
             break;
         default:
            //this.init();
            break; 
    }  
};

/*
 * public static final String FA_FAIL = "FA_FAIL";// 操作失败
    public static final String FA_EXTERNAL_RECIPIENT = "FA_EXTERNAL_RECIPIENT";
    public static final String FA_ATTACH_EXCEED_LIMIT = "FA_ATTACH_EXCEED_LIMIT";// 附件大小超过限制
    public static final String FA_ATTACH_EMPTY = "FA_ATTACH_EMPTY";// 上传附件为空

    public static final String S_OK = "S_OK";// 操作成功
    public static final String S_PARTIAL_OK = "S_PARTIAL_OK";// 操作部分成功
    public static final String FS_UNKNOWN = "FS_UNKNOWN";// 未知错误
    public static final String FR_INVALID_REQUEST = "FR_INVALID_REQUEST";// 非法请求，如格式错误，协议错误等
    public static final String FA_INVALID_PARAMETER = "FA_INVALID_PARAMETER";// 参数错误
    public static final String FA_XXXX_NOT_FOUND = "FA_XXXX_NOT_FOUND";// 表示某对象不存在，以至于无法进行后续操作
    public static final String FA_XXXX_EXISTS = "FA_XXXX_EXISTS";// 表示某对象已经存在，以至于无法进行后续操作
    public static final String FA_INVALID_SESSION = "FA_INVALID_SESSION";// Session不合法，通常表示用户超时。
    public static final String FA_SECURITY = "FA_SECURITY";// 提交的session没有通过安全检查，例如IP或cookie不匹配
    public static final String FA_UNAUTHORIZED = "FA_UNAUTHORIZED";// 验证密码失败，用户不存在，缺乏sid参数等。
    public static final String FA_FORBIDDEN = "FA_FORBIDDEN";// 操作不允许通常是由于COS限制,
    public static final String FA_BAD_PASSWORD = "FA_BAD_PASSWORD";
    public static final String FA_BAD_SERVER = "FA_BAD_SERVER";
    public static final String FA_FOLDER_EXISTS = "FA_FOLDER_EXISTS";
    public static final String FA_INVALID_DATE = "FA_INVALID_DATE";// 定时邮件时间不正确
    public static final String FA_ATTACH_SIZE_EXCEED = "FA_ATTACH_SIZE_EXCEED";// 附件太大
    public static final String FA_IS_SPAM = "FA_IS_SPAM";// 垃圾邮件
    public static final String FA_POP_RUNNING = "FA_POP_RUNNING";// 正在代收中

 */
mailPOP.errorMsg = {
    "FA_BAD_PASSWORD":Lang.Mail.ConfigJs.pop_vFail,
    "FA_XXXX_EXISTS":Lang.Mail.ConfigJs.pop_repeat,
    "FA_BAD_SERVER":Lang.Mail.ConfigJs.pop_TEST_FS_UNKNOWN
};

mailPOP.fail = function(s,ao){
    var msg = this.errorMsg[ao.code];
    if(msg){
        CC.alert(msg);
    }else{
        CC.alert(s);
    }
};

mailPOP.ok = function(s){
    var p = this;
    CC.alert(s,function(){
        if(p.opType=="pop"){
            p.returnList();
        }else{
            p.init(); 
        }
    });  
};

// 显示隐藏内容显示区域
mailPOP.showDisplayArea = function(idx) {
    var name = "option_mailPOP_";
    var oEditArea = $(name+"_showDisplayArea"+idx);
    var oI = name + "i_" + idx;
    if (oEditArea) {
        if (oEditArea.style.display == "") {
            oEditArea.style.display = "none";
            $(oI).className = "off";
        }
        else {
            oEditArea.style.display = "";
            $(oI).className = "";
        }
    }
};

// 打开标签页
mailPOP.gotoFolder = function (fid, isNoRead) {
    var o = {},
        folders = CM.folderMain[gConst.dataName],
        len = folders.length,
        folderPassFlag = false;

    for (;len--;) {
        if (folders[len].fid === fid) {
            folderPassFlag = folders[len].folderPassFlag;
            break;
        }
    }
    if (folderPassFlag && gMain.lock_close) {   
        o.obj = jQuery("#" + fid);
        o.p = this;
        o.id = fid;
        o.url = url;
        folderlock.unlocked(0, "leftLock", o);
    } else if (isNoRead) {
        CC.searchNewMail(fid, false);
    } else {
        CC.goFolder(fid, "user" + fid);
    }

    function url () {
        if (id == 0) {
            CC.receiveMail();
        }
        else {
            CC.goFolder(id, o);
        }
    }
};

mailPOP.setHeight = function () {
    var h = jQuery("#leftContainer").css("height");

    jQuery("#leftWrap").css("height",parseInt(h)-54);
};