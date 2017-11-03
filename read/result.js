//var st = new Date().getTime();

var PageStateTypes = {
    Initializing : 1,      //正在初始化
    Uploading : 2,         //正在上传附件
    Sending : 3,           //正在发送邮件
    Saving : 4,            //正在保存附件
    Common : 5            //普通状态
};

var WriteState = {
    none : 0,
    send : 1,
    save : 2,
    test: '<input title="'+Lang.Mail.Write.haha+'">'
};

var TimeUnit = {
    Second:    1000,
    Minutes:   1000 * 60,
    Hour:      1000 * 60 * 60,
    Day:       1000 * 60 * 60 * 24,
    Week:      1000 * 60 * 60 * 24 * 7,
    TwoWeek:   1000 * 60 * 60 * 24 * 14,
    HalfMonth: 1000 * 60 * 60 * 24 * 15,
    Month:     1000 * 60 * 60 * 24 * 30,
    HalfYear:  1000 * 60 * 60 * 24 * 30 * 6,
    Year:      1000 * 60 * 60 * 24 * 365
};

var PageState = PageStateTypes.Common;

var $ = function(id) {
    return document.getElementById(id);
    //获取指定id的dom对象
};
var fBlank = null;
var isIE = document.all;
var El = parent.El;
//dom元素操作类
var CC = parent.CC;
var writeInputHeight = 60;

/**
 * 写信业务处理类
 */
var oWrite = {
    id : "",        //写信事务id
    status : WriteState.none,     //发信状态信息 0：未发信或发信已经成功， 1：正在发信,2:正在保存草稿
    objectName : "oWrite",
    textArea : ["recipient", "ccopy", "bccopy"],
    textSizeEvent : {},
    subIndex : 0,
    focusId : "rib_input_1",
    times : 0,
    minutes : parent.gMain.autoSaveTime || 5,
    sendMaxLen : 10,
    toMaxNum : parseInt(parent.gMain.recipientMaxNum) || 200,
    denyForwardMaxAttachSize : 20, // 禁止转发时最大附件大小，单位M
    denyForwardAttachTypes: 'doc|docx|xls|xlsx|ppt|pptx|pdf|txt|html|htm|jpg|jpeg|jpe|gif|png|rar|zip', // 禁止转发时附件格式限制
    sysSubjectNum : 12,
    isReply : false,
    isForward : false,
    isDrag : false,
    isReplyAll : false,
    isForwardAll : false,
    btnSendId : "btnSend",
    btnSaveId : "btnSave",
    btnCancelId: 'btnCancel',
    //dataUrl : parent.gMain.webApiServer + "/WebService/SaveContact.aspx?contact=",
    PageState : PageStateTypes.Initializing,
    frmAttachReady : false,
    isAutoSave : false,
    interval : 0,
    href : location.href,
    funcid : GC.getUrlParamValue(location.href, "funcid") || "mbox:compose",
    func : GC.getUrlParamValue(location.href, "func"),
    fromError : GC.getUrlParamValue(location.href, "fromsomeerror"),
    composeId : GC.getUrlParamValue(location.href, "composeid"),
    mid : GC.getUrlParamValue(location.href, "mid"),
    tid : GC.getUrlParamValue(location.href, "tid"),
    to : GC.getUrlParamValue(location.href, "to"),
    msg : GC.getUrlParamValue(location.href, "msg"),
    senderUser:GC.getUrlParamValue(location.href, "senderUser"),
    withAttachments: GC.getUrlParamValue(location.href, "withAttachments"),
    userNumber : parent.gMain.userNumber,
    sendList : [],
    signList : parent.signList || [],
    corpSignList : parent.corpSignList || [],
    defaultSign : "",
    sysSubject : [],
    pageOnLoaded : false,
    editOnLoaded : false,
    initData : {},
    dragId : 0,
    omid : "",
    isSchedule : false,
    isCC : true,
    isSCC : false,
    isLookAllAsSingle : false,
    richInputBox: null,
    ribs: [],
    autoFillObjects: [],
    originalRecipient: [],
    denyForward: '0',
    initilized: false,
    highLightKeys: [], // 高亮显示关键字
    scanThread: 0, // 定时扫描关键字线程，
    highLightResult: {}, // 关键词命中结果集
    filterKeywords: parent.GC.check('MAIL_INBOX_SEN'), // 是否开启关键词过滤（与加密邮件不能同时开启）
    encryptMail: parent.GC.check('MAIL_INBOX_ENCRYPTION'), // 加密邮件（139企邮）（与敏感词过滤不能同时开启）
    recipientTipsTimeout: 3, // 单位 秒(s)
    unlockTime : 15,  //超时时间设置，超过这个时间服务器不响应解锁写信按钮
    receiveBegin: 5, // 收件人开始提示数量
    //用来做是否邮件是否编辑校验
    oldData:{
        subject:'',
        content:''
    },
    subjectPrefix : {
        '1' : 'Re:',
        '2' : '>',
        '3' : 'Reply:'
    },
    quickSubject: [Lang.Mail.Write.jinji, Lang.Mail.Write.huiyiyaoqing, Lang.Mail.Write.huiyijiyao, Lang.Mail.Write.huiyicailiao],  // 快捷主题项
    isAutoDestroy: false,
    isShowBigAttachTips: false,
    clearSubjectTimer: null,


    /**
     * 初始化方法
     */
    init : function() {
        if(this.initilized == true){
            return;
        }
        var p = this;
        p.firstLoad = true;
        if(this.mid) {
            this.composeId = "compose_" + this.mid;
        }
        this.defaultSign = this.getDefaultSign();
        this.sendList = aliasList;
        this.needAutoSave = false;
        this.changed = false;
        //显示写信菜单
        try {
            var index = window.name.indexOf("compose");
            var id = window.name.substr(index);
            parent.CC.showMenu(id);
        } catch (e) {
        }
        p.pageLoaded = true;
        // 处理企业签名


        parent.AutoFill.datas["email"] = parent.LMD.allContactList_autoFile;
        p.initControl();
        p.loadSendList();
        p.loadSubjectList();
        p.loadMailInfo();
        oWrite.oldData=oWrite.getCurrData()
        p.initEvent();
        p.loadPlugins();
        //p.bindEventStyle();
        if (CC.power.offQuickSubject()) {
            p.initQuickSubject();
        }
        
        parent.El.show(parent.GE.tab.doc.getElementById(parent.gConst.mainToolbar + parent.GE.tab.curid));
        if(GC.check("CONTACTS")) {
            try{
                var sendSelf = jQuery('#send_to_self');
                if(sendSelf){
                    var myEmail = parent.gMain.loginName || '';
                    var nameEmail = (parent.gMain.trueName || '') + '<' +(myEmail)+'>';
                    sendSelf.find('a').unbind('click').bind('click', function(){
                        p.selectMail(myEmail, nameEmail);
                    });
                }
                p.loadAddrList();
            }
            catch(e){

            }
            $('tab_li0').click();
        } else { //if(GC.check("MAIL_WRITE_LP"))
            oWrite.doTabClick("tab_li1");
            $('tab_li1').click();
        }
        p.initilized = true;
        if(parent.documentEventManager){
            parent.documentEventManager.addDoc(document);
        }
    },
    /**
     * 销毁系统垃圾
     */
    dispose: function(){
        if(oWrite.interval){
            clearInterval(oWrite.interval);
        }
        if(oWrite.scanThread){
            clearInterval(oWrite.scanThread);
        }
    },
    /**
     * Ajax请求封装
     * @param {object} obj ajax请求hash map
     */
    ajaxRequest: function(obj){
        var callback = obj.callback || function(){};
        var failback = obj.failback || function(){};
        var func = obj.func || '';
        var url = obj.url || '';
        var data = obj.data || [];

        var reqObj = {
            func: func,
            data: data,
            call: callback,
            failCall: failback
        };
        if(url != ''){
            reqObj.url = url;
            parent.MM.mailRequestWebApi(reqObj);
        }
        else{
            parent.MM.mailRequest(reqObj);
        }
    },
    /**
     * 添加插件
     * @param name
     */
    addPlugins: function(name){
        if(!this.plugins){
            this.plugins = [];
        }
        var arg = [];
        for(var i=1;i<arguments.length;i++)arg.push(arguments[i]);
        this.plugins.push({name:name, args:arg});
    },
    /**
     * 初始化插件
     */
    loadPlugins: function(){
        if(this.plugins){
            for(var i = 0;i<this.plugins.length;i++){
               // new Plugins({authority:this.plugins[i], free:true}).run();
                new Plugins(this.plugins[i].name, this.plugins[i].args).run();
            }
        }
    },
    /**
     * 获取焦点和失去焦点，写信页框颜色根据皮肤变化
     */
    bindEventStyle: function() {
        
        this.bindFocusBlur("rib_input_1","recipient_container");
        this.bindFocusBlur("rib_input_2","cc_container");
        this.bindFocusBlur("txtsubject","dvSubContainer");
        if(document.all){   
            document.getElementById("htmlEditor").attachEvent("onblur",removedClass);   
            document.getElementById("htmlEditor").attachEvent("onfocus",addedClass);
        } else{   
            document.getElementById("htmlEditor").contentWindow.addEventListener("blur",removedClass,false);   
            document.getElementById("htmlEditor").contentWindow.addEventListener("focus",addedClass,false);
        }   
        function removedClass(){  
            jQuery("#editor_body").removeClass("focusCol");
        }   
        function addedClass(){  
            jQuery("#editor_body").addClass("focusCol");
        }
    },
    bindFocusBlur: function(triggerId,containerId) {
        jQuery('#'+triggerId+'').bind('focus', function(){
            jQuery('#'+containerId+'').addClass("focusCol");
        });

        jQuery('#'+triggerId+'').bind('blur', function(){
            jQuery('#'+containerId+'').removeClass("focusCol");
        });


    },
    /**
     * 初始化控件
     */
    initControl: function(){
        var p = this;
        var tipsTemplate = "<div class=\"richinputbox_tips\" style=\"border:solid 1px #ccc; background:#eee; line-height:24px; padding-left:12px;\">"+Lang.Mail.Write.hkysr+"<span class='red-commend'>{0}</span>"+Lang.Mail.Write.ge+"</div>";
        var overflowTips1 = '<div class=\"richinputbox_tips\" style=\"border:solid 1px #ccc; background:#eee; line-height:24px; padding-left:12px;\">'+Lang.Mail.Write.sjrsycgsx+'<span class="red-commend">{0}</span>'+Lang.Mail.Write.rbnjxtj+'</div>';
        var overflowTips2 = '<div class=\"richinputbox_tips\" style=\"border:solid 1px #ccc; background:#eee; line-height:24px; padding-left:12px;\"><span class="red-commend">{1}</span>'+Lang.Mail.Write.rwtjzdtj+'<span class="red-commend">{0}</span>'+Lang.Mail.Write.ren+'</div>';
        var clearRIBTips = function(){
            for(var i=0;i<3;i++){
                if(p.ribs[i].interval){
                    clearTimeout(p.ribs[i].interval);
                    jQuery(p.ribs[i].container).parent().parent().parent().find('.richinputbox_tips').remove();
                }
            }
        };
        var showRIBTips = function(tip, host){
            jQuery(host.container).parent().parent().parent().append(tip);
        };
        var showAndAutoHideRIBTips = function(tip, host){
            showRIBTips(tip, host);
            host.interval = setTimeout(function(){
                clearRIBTips();
            }, oWrite.recipientTipsTimeout*1000);
        };

        //绑定自动完成控件
        var param = {
            type: 'email',
            autoHeight: true,
            maxHeight: writeInputHeight,
            maxMailNum: p.toMaxNum,
            skinAble: true,
            change: function(){
                var This = this;
                var leftCount = 0;
                p.needAutoSave = true;
                p.changed = true;
                p.setHeight(this.container);

                // 重新设置关联组件的最大人数
                (function(ribs){
                    var allItemCount = 0;
                    var chkObj = {};
                    var ribItems = ribs[0].getItems().concat(ribs[1].getItems()).concat(ribs[2].getItems());
                    for(var i=0;i<ribItems.length;i++){
                        if(!chkObj.hasOwnProperty(ribItems[i].allText)){
                            allItemCount++;
                            chkObj[ribItems[i].allText] = 1;
                        }
                    }
                    leftCount = p.toMaxNum - allItemCount;
                    // 重置每个控件的最大数量
                    for(var r=0;r<ribs.length;r++){
                        ribs[r].maxMailNum = leftCount;
                    }
                })(p.ribs);
            },
            itemCreated: function(stats){
                var num = this.maxMailNum;
                var tips = '', overTips = '';
                var ss = stats || {};
                var mode = ss.mode || '';

                if(mode == 'paste' && ss.fail>0){
                    overTips = overflowTips2.format(oWrite.toMaxNum, ss.fail);
                }
                else{
                    overTips = overflowTips1.format(oWrite.toMaxNum);
                }
                clearRIBTips();
                if(num <= oWrite.receiveBegin){
                    tips = tipsTemplate.format(num);
                    if(num <= 0){
                        tips = overTips;
                    }
                    showAndAutoHideRIBTips(tips, this);
                }
            },
            itemDeleted: function(){
                var num = this.maxMailNum;
                clearRIBTips();
                if(num <= oWrite.receiveBegin){
                    showAndAutoHideRIBTips(tipsTemplate.format(num), this);
                }
            },
            mailNumError: function(obj){
                //p.mailNumError(obj);
                var tips = '';
                var state = obj.statusInfo || {};
                clearRIBTips();
                if(obj.createMode == 'paste'){
                    tips = overflowTips2.format(oWrite.toMaxNum, state.fail || Lang.Mail.Write.syztd);
                }
                else{
                    tips = overflowTips1.format(oWrite.toMaxNum);
                }
                showAndAutoHideRIBTips(tips, obj);
            }
        };
        param.container = $('recipient_container');
        var ribs = [];
        var rp_c = new RichInputBox(param);
        param.container = $('cc_container');
        var cc_c = new RichInputBox(param);
        param.container = $('bcc_container');
        var bc_c = new RichInputBox(param);

        rp_c.autoDataSource = parent.AutoFill.datas['email'];
        cc_c.autoDataSource = parent.AutoFill.datas['email'];
        bc_c.autoDataSource = parent.AutoFill.datas['email'];
        ribs.push(rp_c);
        ribs.push(cc_c);
        ribs.push(bc_c);
        this.ribs = ribs;
        var autoFillIds = [];


        var clearTips = function(){
            if(p.personErrTips && p.personErrTips instanceof ToolTips){
                p.personErrTips.close();
                p.personErrTips = null;
            }
            if(p.titleErrTips && p.titleErrTips instanceof ToolTips){
                p.titleErrTips.close();
                p.titleErrTips = null;
            }
        }
        jQuery('.RichInputBoxLayout').each(function(i,v){
            jQuery(this).unbind('click', clearTips).bind('click', clearTips);
        });

        jQuery('.RichInputBoxLayout input').each(function(i, v){
            var id = jQuery(this).attr('id');
            jQuery(this).unbind('focus').bind('focus', function(){
                p.doTextFocus(id);
                p.focusId = id;
                p.richInputBox = ribs[i];
            });
            parent.LMD.fillEmail(jQuery(this)[0], window, {
                setCall : p.selectMail,
                fromType: 'autoComplete',
                showTemplate: "<span class=\"autoComplete_name\">&quot;$NAME$&quot;</span> &lt;$VALUE$&gt;",
                offsetFun: function(){
                    var left = parent.El.getX(this.objText) || 0;
                    var docWidth = parent.El.docWidth();
                    var leftSideWidth = parent.El.width( top.window.document.getElementById(top.gConst.divLeft) );
                    var offset = docWidth - leftSideWidth - left - 430;
                    if(offset > 0){
                        offset = 0;
                    }
                    return [
                            offset,
                            -(jQuery('.RichInputBoxLayout').eq(i)[0].scrollTop || 0)
                            ];
                },
                fixWidth: 400
            });
            autoFillIds.push({id:id, loaded:false});
        });

        var limitFindTimes = 0;
        function findAutoFillObj(){
            var needToLoad = false;
            if(autoFillIds && autoFillIds.length){
                for(var i=0;i<autoFillIds.length;i++){
                    if( parent.LMD.autoFillInstances[autoFillIds[i].id] instanceof parent.AutoFill){
                        if(!autoFillIds[i].loaded){
                            p.autoFillObjects.push(parent.LMD.autoFillInstances[autoFillIds[i].id]);
                            autoFillIds[i].loaded = true;
                        }
                    }
                    else{
                        needToLoad = true;
                    }
                }
                if(needToLoad && (limitFindTimes <= 30)){
                    limitFindTimes++;
                    setTimeout(findAutoFillObj, 100);
                }
            }
        }
        findAutoFillObj();

        // 初始化禁止转发提示框位置
        if(GC.check('MAIL_INBOX_FORWARD')){
            
        }

        // 如果开启了加密邮件，则初始化加密邮件UI
        if(p.encryptMail){
            var fun_bar = jQuery('#writer_func_container', document);
            var tips_container = jQuery('.edi_container', document);
            var fun_ui = jQuery('<div id="setPasswordContainer" style="display:inline; position:relative;"><input id="chkSetPassword" type="checkbox" title="' + parent.Lang.Mail.tips001 + '" tabindex="21" /><label style="margin:0;" for="chkSetPassword" title="'+ parent.Lang.Mail.tips001 +'">'+  parent.Lang.Mail.tips001+'</label></div>');
            if (jQuery.browser.msie && ~~jQuery.browser.version <= 6) {
                fun_ui.css("float", "left");
            }
            var tips_ui = jQuery('<div id="encryptMailTips" class="yellowTips" style="display:none;"><i class="i-mail-lock mr_10"></i>'+parent.Lang.Mail.tips002+'。<span id="encryptMailPwd" style="display:none;"></span> <a id="encryptMailLookPassword" href="javascript:fGoto()" onclick="return false;" class="ml_10">'+parent.Lang.Mail.tips003+'</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a id="encryptMailClearPassword" href="javascript:fGoto()" onclick="return false;">'+parent.Lang.Mail.tips004+'</a></div>');
            var password_html = [];
            password_html.push('<div id="encryptMailPanel" class="tipBox" style="position:absolute; top:-141px; left:-121px; width:400px; padding:0; display: none;">');
            password_html.push('<div class="tipBox-con">');
            password_html.push('<ul class="encript">');
            password_html.push('<li><span class="left">&nbsp;</span>'+parent.Lang.Mail.tips005+'</li>');
            password_html.push('<li style="height: 19px;"><div><span class="left" style="float:left;display:inline;">'+parent.Lang.Mail.tips006+'：</span><input id="encryptMail_pwd" type="password" class="encript_txt"><span id="encryptMail_pwd_error" class="error"></span></div></li>');
            password_html.push('<li style="height: 19px;"><div><span class="left" style="float:left;display:inline;">'+parent.Lang.Mail.tips007+'：</span><input id="encryptMail_repwd" type="password" class="encript_txt"><span id="encryptMail_repwd_error" class="error"></span></div></li>');
            password_html.push('</ul>');
            password_html.push('<div class="forbiden-bline ta_r">');
            password_html.push('<a id="encryptMail_ok" href="javascript:fGoto()" class="xxs-greyBtn" onclick="return false;">'+parent.Lang.Mail.tips006+'</a>');
            password_html.push('<a id="encryptMail_cancel" href="javascript:fGoto()" class="xxs-greyBtn ml_5" onclick="return false;">'+parent.Lang.Mail.tips008+'</a>');
            password_html.push('</div>');
            password_html.push('</div>');
            password_html.push('<i class="tipBox-direc-b"></i>');
            password_html.push('</div>');
            var password_ui = jQuery(password_html.join(''));

            // 渲染选择框至功能栏
            fun_bar.append(fun_ui);
            // 渲染加密提示tips至编辑器顶部
            tips_container.prepend(tips_ui);
            // 渲染设置密码交互界面至功能栏下面
            var setPwd = jQuery('#setPasswordContainer', document);
            setPwd.append(password_ui);
        }// 结束加密邮件控件初始化

        // 如果有大附件上传，初始化tips提示
        var bigFileUpload = jQuery('#attachTempDisk');
        if(bigFileUpload){
            function dockElement(targetElement, dockElement){
                var offset = targetElement.offset();
                dockElement.css({"display":"block","left":offset.left,"top":offset.top+targetElement.height()+1,position:"",zIndex:10086});
            };
            if(upload_module){
                var bigAttachSize = parent.gMain.tempUploadMaxFileSize || 0;
                if(bigAttachSize){
                    bigAttachSize = parent.Util.formatSize(parent.Util.str2Num(bigAttachSize), null, 2);
                }
                else{
                    bigAttachSize = '1G';
                }
                var text = Lang.Mail.Write.tjzddzzzwj.format(bigAttachSize);
                var but = jQuery('<div id="bigFileUploadTips" class="tips write-tips" style="display:none;"></div>').append(text).appendTo(jQuery(document.body)).css('z-index', 128);

                bigFileUpload.attr('title', '');
                //but.hide();
                bigFileUpload.unbind('mouseover').unbind('mouseout').unbind('mousemove').bind('mouseover', function(){
                    dockElement(bigFileUpload, but);
                    but.show();
                }).bind('mouseout', function(){
                        jQuery(document).unbind('mousemove').bind('mousemove', function(){
                            but.hide();
                        });
                    }).bind('mousemove', function(e){
                        parent.EV.stopEvent(e);
                    });
            }
        }

        // 判断自销毁邮件权限
        if (parent.CC.power.offAutoDestroy()) {
            p.addAutoDesLabelHtml(jQuery("#writer_func_container"));
            p.addAutoDesTipsHtml(jQuery("#writer_func_container"));
            p.addAutoDesMsgHtml();
        }
    },
    /**
    * 添加自销毁checkbox html
    */
    addAutoDesLabelHtml: function (cont) {
        var html = "";

        html += " <input id=\"chkAutoDestroy\" tabindex=\"21\" type=\"checkbox\" title=\"邮件阅读后自销毁或邮件超过限制天数后自销毁\"><label for=\"chkAutoDestroy\" title=\"邮件阅读后自销毁或邮件超过限制天数后自销毁\">";
        html += Lang.Mail.Write.zxhyj;
        html += "</label>";

        cont.append(html);
    },
    /**
    * 添加自销毁提示html
    */
    addAutoDesMsgHtml: function () {
        var html = "";

        html += "<div id=\"autoDestroyMailTips\" class=\"yellowTips\" style=\"display: none;\"></div>";
        
        jQuery(html).insertBefore(jQuery(".edi_container>.writeTable"));
    },
    /**
    * 添加自销毁tips html
    */
    addAutoDesTipsHtml: function (cont) {
        var html = '';

        html += '<div id="tipsAutoDestroy" class="tipBox" style="position: absolute; display: none; width: 430px; top: -155px; padding: 0px; background: #ffffff;">';
        html += '<div class="tipBox-con">';
        html += '<ul class="pop_destroy_txt">';
        html += '<li class="pb_5">';
        html += '<label>';
        html += '<input id="ckbAutoDestroy" type="checkbox" class="rm_cb">'+Lang.Mail.Write.ydwczdxh+';
        html += '</label>';
        html += '</li>';
        html += '<li class="pb_5" style="height:27px;">';
        html += '<label>';
        html += '<input id="ckbDaysDestroy" type="checkbox" class="rm_cb">'+Lang.Mail.Write.xzyjydts+';
        html += '</label> <input id="inputReadDays" type="text" value="1" maxlength="30" class="set-txt-b ml_5 mr_5" style="width: 25px;">'+Lang.Mail.Write.tian+'<span id="textReadDays" class="gray ml_20">'+Lang.Mail.Write.qsrzjdsz+'</span></li>';
        html += '<li><p class="gray">'+Lang.Mail.Write.zzdlstdqty+'</br>'+Lang.Mail.Write.zxhyjxtjfj+'</p></li>';
        html += '</ul>';
        html += '<div class="forbiden-bline ta_r">';
        html += '<a id="btnAutoDestroyOk" href="javascript:;" class="xxs-greyBtn">'+Lang.Mail.Write.queding+'</a>';
        html += '<a id="btnAutoDestroyCancel" href="javascript:;" class="xxs-greyBtn ml_5">'+Lang.Mail.Write.quxiao+'</a>';
        html += '</div>';
        html += '</div>';
        html += '<i class="tipBox-direc-b"></i>';
        html += '</div>';

        cont.append(html);
    },
    /**
     * 初始化写信页面事件信息
     */
    initEvent : function() {
        var p = this;
        if(GC.check("CONTACTS") && GC.check("CONTACTS_OPER")) {
            //右侧通讯录搜索
            var ap = {
                div : "tab_search_div",
                setCall : p.selectMail,
                line : 20,
                statsCall : function(v) {
                    v = v || 0;
                    if(v == 0) { //0为没有搜关键字
                        jQuery("#searchDelete").removeClass('searchDelete');
                        $("tab_list_div").style.display = "";
                        $("tab_search_div").style.display = "none";
                    } else {
                        jQuery("#searchDelete").addClass("searchDelete");
                        $("tab_list_div").style.display = "none";
                        $("tab_search_div").style.display = "";
                    }
                }
            };
            parent.EV.observe($("searchDelete"), "click", function() {
                // $("searchKey").value = "";
                // ap.statsCall(0);
            });
        }
        parent.EV.addEvent(window, "resize", p.setSize);
        parent.EV.addEvent(parent.GE.tab.doc.body, 'click', function(e){
            if(Editor && Editor.menu){
                Editor.hideMenu();
            }
            if(RichInputBox){
                RichInputBox.dispose();
            }
            hideAutoFillMenu();
        });
        parent.EV.addEvent(window, "unload", function() {
            parent.El.gc(document);
        });
        var ifr_win = parent.GE.tab.doc.getElementById(parent.gConst.ifrm + parent.GE.tab.curid).contentWindow;
        if(ifr_win){
            parent.EV.addEvent(ifr_win.document.body, 'click', function(e){
                if(!parent.El.descendantOf(e.target || e.srcElement, ifr_win.document.getElementById('editor_body'))){
                    Editor.hideMenu();
                }
                if(RichInputBox){
                    RichInputBox.dispose();
                }
                hideAutoFillMenu();
            });
        }

        if(Editor && Editor.body){
            parent.EV.addEvent(Editor.body, 'click', function(e){
                hideAutoFillMenu();
                if(RichInputBox){
                    RichInputBox.dispose();
                }
            });
        }

        function hideAutoFillMenu(){
            if( p.autoFillObjects && p.autoFillObjects.length){
                try{
                    for(var i=0;i<p.autoFillObjects.length;i++){
                        if(p.autoFillObjects[i].div){
                            parent.El.hide(p.autoFillObjects[i].div);
                        }
                    }
                }
                catch(e){

                }
            }
        }

        //自动保存草稿
        //if(GC.check('MAIL_WRITE_SAVE')){
            p.interval = setInterval(function() {
                if(!Editor.checkValueChange()){
                    p.needAutoSave = true;
                }
                if(p.needAutoSave){
                    parent.CC.showMsg(Lang.Mail.Write.savingToDraft, false, false, "loading");
                    p.autoSave();
                }
            }, 60000 * p.minutes);
        //}
        if(GC.check("CONTACTS")) {
            $("tabSwitch").onclick = function(o) {
                p.doSepClick();
                //右边地址栏显示切换
            };
        } else {
            oWrite.doSepClick(false);
            $("tabSwitch").style.display = "none";
        }
        if(GC.check("CONTACTS")) {
            $("tab_li0").onclick = function() {
                oWrite.doTabClick("tab_li0");
                jQuery('#tab_li1').unbind('mouseover').bind('mouseover', function(){
                    jQuery(this).removeClass('li1').addClass('li1_on');
                }).unbind('mouseout').bind('mouseout', function(){
                    jQuery(this).removeClass('li1_on').addClass('li1');
                });
                jQuery('#tab_li0').unbind('mouseover').unbind('mouseout').removeClass('li0_on').addClass('li0');
            };
            //通讯录
        } else {
            $("tab_li0").innerHTML = "";
        }
        //if(GC.check("MAIL_WRITE_LP")) {
            $("tab_li1").onclick = function() {
                oWrite.doTabClick("tab_li1");
                jQuery('#tab_li0').unbind('mouseover').bind('mouseover', function(){
                    jQuery(this).removeClass('li0').addClass('li0_on');
                }).unbind('mouseout').bind('mouseout', function(){
                    jQuery(this).removeClass('li0_on').addClass('li0');
                });
                jQuery('#tab_li1').unbind('mouseover').unbind('mouseout').removeClass('li1_on').addClass('li1');
            };
            //信纸
        //} else {
        //  $("tab_li1").innerHTML = "";
        //}
        if(!GC.check("CONTACTS")) {// && !GC.check("MAIL_WRITE_LP")
            p.doSepClick(false);
        }

        //action button events
        jQuery('#chkSaveToSentBox, #chkUrgent, #chkReceipt').bind('click', function(){
            p.needAutoSave = true;
            p.changed = true;
        });

        

        var show_dialog = function(){
            var callback = function(d){
                for(var i=0,l=d.length;i<l;i++){
                    var val = d[i].value;
                    oWrite.selectMail('', val);
                }
            };
            var s = [];
             if(GC.check("CONTACTS_ENT")) {
                 s.push("0");
             }
            if(GC.check("CONTACTS_PER")) {
                s.push("2");
            };
            oWrite.contact = new parent.Contact("window.frames['" + parent.gConst.ifrm + parent.GE.tab.curid + "'].oWrite.contact");
            oWrite.contact.groupMap = parent.LMD.groupMap;
            oWrite.contact.addAsGroup = true;
            oWrite.contact.group_contactListMap = parent.LMD.group_contactListMap_mail;
            oWrite.contact.inItContanct("publicPerson_ContactDialog",s,callback,null);
        };

        var recipient_dialog = function(){
            var id = jQuery('#recipient_container input')[0].id;
            p.focusId = id;
            p.richInputBox = p.ribs[0];
            show_dialog();
        };

        var cc_dialog = function(){
            var id = jQuery(compose_CC).find('input')[0].id;
            p.focusId = id;
            p.richInputBox = p.ribs[1];
            show_dialog();
        };

        var scc_dialog = function(){
            var id = jQuery(compose_SCC).find('input')[0].id;
            p.focusId = id;
            p.richInputBox = p.ribs[2];
            show_dialog();
        };

        /*
         * 注册抄送，密送，群发单显事件
         */
        var recipient_person = $('recipient_person');
        var compose_CC = $('compose_CC');
        var compose_SCC = $('compose_SCC');
        var cc_and_scc = $('cc_and_scc');
        var lookAllAsSingleLink = $('lookAllAsSingleLink');
        var recipientTxt = parent.Lang.Mail.Write.Receiper;
        var addCCTxt = parent.Lang.Mail.Write.addCC;
        var delCCTxt = parent.Lang.Mail.Write.delCC;
        var addSCCTxt = parent.Lang.Mail.Write.addSCC;
        var delSCCTxt = parent.Lang.Mail.Write.delSCC;
        var cancelLaasTxt = parent.Lang.Mail.Write.lbt_unsinglesend;
        var laasTxt = parent.Lang.Mail.Write.lbt_singlesend;
        var cancelCCAndSCCTxt = parent.Lang.Mail.Write.justSeeSelfMessage;

        jQuery('#recipient_person').unbind('click').bind('click',recipient_dialog);
        jQuery('#cc_person').unbind('click').bind('click',cc_dialog);
        var ccAndSccEvents = (function() {
            return function() {
                var ccLink = $('ccLink');
                var sccLink = $('sccLink');
                ccLink.onclick = function() {
                    var input_cc = jQuery(compose_CC).find('input')[0];
                    if(ccLink.innerHTML.trim() == addCCTxt) {
                        ccLink.innerHTML = delCCTxt;
                        compose_CC.style.display = '';
                        input_cc.focus();
                        p.focusId = input_cc.id;
                        p.richInputBox = p.ribs[1];
                        p.isCC = true;
                        jQuery('#cc_person').unbind('click').bind('click',cc_dialog);
                    } else {
                        ccLink.innerHTML = addCCTxt;
                        compose_CC.style.display = 'none';
                        p.isCC = false;
                    }
                    p.needAutoSave = true;
                    p.setSize();
                };
                sccLink.onclick = function() {
                    var input_scc = jQuery(compose_SCC).find('input')[0];
                    if(sccLink.innerHTML.trim() == addSCCTxt) {
                        sccLink.innerHTML = delSCCTxt;
                        compose_SCC.style.display = '';
                        input_scc.focus()
                        p.focusId = input_scc.id;
                        p.richInputBox = p.ribs[2];
                        p.isSCC = true;
                        jQuery('#scc_person').unbind('click').bind('click',scc_dialog);
                    } else {
                        sccLink.innerHTML = addSCCTxt;
                        compose_SCC.style.display = 'none';
                        p.isSCC = false;
                    }
                    p.needAutoSave = true;
                    p.setSize();
                };
            };
        })();

        
        /**
         * 数字签名， 数字加密事件
         * 
         * （当勾选其中一个复选框的时候， 要弹出密码验证框)
         * 
         * 数字签名自动验签 和 数字解密自动解密是分开的, 互不影响
         */
        
        ;(function($){
            //如果不是安全邮箱, 则返回
            if( !CC.isSecurityMail ) return;
           
            var t1,bMod =false;
    
            /**gMain里定义
             *firstuseibc=0或者无此参数，表示用户目前为止未曾使用过ibc功能，
              firstuseibc=1表示用户已经修改过ibc密码. 
 
             */
            
            //如果没有修改过IBC密码, 需要提示用户修改
             
            if( typeof top.gMain != "undefined" && typeof top.gMain.userAttrs != "undefined" ){
                //已经修改过密码
                bMod = top.gMain.userAttrs.firstuseibc == "1" ? true : false; 
 
            }   

            function outfn(){
                clearTimeout( t1 );
                t1 = setTimeout( function(){
                    $("#modIBCTip").hide();
                } ,100 );
            }
            
            function overfn(){
                clearTimeout( t1 );
                $("#modIBCTip").show();
            }
            
            $("#numberSign, #numberSign_label, #numberEncrypt, #numberEncrypt_label")
            .bind("mouseover",overfn);
            
            $("#numberSign, #numberSign_label, #numberEncrypt, #numberEncrypt_label")
            .bind("mouseout", outfn);
            
            $("#modIBCTip").bind("mouseover", overfn);
            
            $("#modIBCTip").bind("mouseout", outfn);
            
            //改变文字提示
            $("#numberEncrypt, #numberEncrypt_label").bind("mouseover", function(){
                $("#txtDes").text(Lang.Mail.Write.gyjjxjnrxl);
            });
            
            //改变文字提示
            $("#numberSign, #numberSign_label").bind("mouseover", function(){
                $("#txtDes").text(Lang.Mail.Write.gyjjxcndsf);
            });
            

            $("#modIBCPwd").bind("click", function(){
                CC.showModIBCdiv();
            });
            
            //如没有修改过密码, 需要用户修改密码, 绑定点击数字加密
            if( !bMod ){
              
                $("#numberEncrypt").unbind().bind("click", function(){
                    var firstuseibc = top.gMain.userAttrs.firstuseibc,
                        isFirstuseibc = ( firstuseibc == "0" ) || ( typeof firstuseibc == "undefined" ) ? true : false; 
                    if( this.checked && isFirstuseibc ){
                        this.checked = false;
                        oWrite.numberEncryptCheck = true;
                        CC.showModIBCdiv();
                    }
                });
                 
            }
            
            //绑定点击数字签名( 签名是用自己的私钥, 验签是用公钥, 跟解密相反)
            $("#numberSign").unbind().bind("click", function(){
                var firstuseibc = top.gMain.userAttrs.firstuseibc,
                    isFirstuseibc = ( firstuseibc == "0" ) || ( typeof firstuseibc == "undefined" ) ? true : false; 
                if( this.checked){
                    
                    //如果首次修改密码, 弹出修改框, 否则绑定是否需要解密的事件
                    if( isFirstuseibc ){
                        this.checked = false;
                        oWrite.numberSignCheck  = true;
                        CC.showModIBCdiv();
                    }else{
                        showCheckSign();
                    }
                    
                }
            });
              
            //如果已经修改过密码, 绑定是否需要私钥的点击事件 
            function bind_undoSign(){
 
               $("#numberSign").unbind().bind("click", function(){
                   showCheckSign();
               });
          
            }    
            
            function showCheckSign(){
                
                if( typeof top.gMain !== "undefined" && 
                   typeof top.gMain.userAttrs !== "undefined" ){
                
                   //是否自动验签,并以后自动验证,以后不需要再输入
                   //top.gMain.userAttrs.autosign不存在或者为"0" 都说明要验证, 弹出验证框
                    var autopass = top.gMain.userAttrs.autosign == "1" ? true : false;
                    
                    // TODO 如果不是自动解密才显示框
                    if(!autopass){
                        $("#numberSign").attr("checked", false);
                        $("#checksign_tip").show();
                        $("#ibcpass").focus();
                        undoSign();
                    }

                }
            }
            
            //私钥签名, 需要先输入私钥验证
           function undoSign(){
               
                var $ = jQuery;
                var autopass = 0;
                var call = function(data){
                        
                        if(typeof data === 'undefined'){
                            return;
                        }
                        
                        //data.var 0为错误, 1为正确
                        var pass = parseInt(data["var"].result, 10);
                        
                        //TODO 验证成功
                        if(pass === 1){
                            
                            $("#divDialogCloseconfirm", parent.document).click();
                            CC.showMsg(Lang.Mail.Write.yanzhengtongguo,true, false, "option");
                            
                            autopass = $("#autopass").attr("checked") ? 1 : 0;
                            
                            
                            
                            //说明已经自动解密
                            if( autopass && typeof top.gMain != "undefined" && typeof top.gMain.userAttrs != "undefined" ){
                                top.gMain.userAttrs.autosign = "1";
                            }
                        
                             $("#numberSign").attr("checked", true);
                            
                             hideCheckTip();
                             
                        }else if(pass === 0){
                            // CC.showMsg( data.summary,true, false, "error"); //提示后台返回
                            CC.showMsg( Lang.Mail.Write.symmcw,true, false, "error");
                        }else if(pass === 2){
                            CC.showMsg( Lang.Mail.Write.mmcwcfzhzs,true, false, "error");
                        }
                        
                        
                    },
                    fnfail = fnfail || function(){
                        CC.showMsg(Lang.Mail.Write.jiemishibai, true, false, "error");
                    };

                $("#ibcpass", parent.document ).focus();
         
                $("#checksign_ok").bind("click", checkInput);
                
                $("#checksign_cancel").bind("click",hideCheckTip);
                
                $("#ibcpass").unbind().bind("keyup", function(e){
                    if( e.keyCode == 13){
                        checkInput();
                    }
                });
                
                function hideCheckTip(){
                     $("#ibcpass").val("");
                     $("#ibcpass_error").val("");
                     $("#checksign_tip").hide();
                }
                
                function checkInput(){
                        $("#ibcpass_error").text("");
                        
                        if( $("#ibcpass").val().trim() === "" ){
                            $("#ibcpass_error").text( Lang.Mail.Write.mmbnwk );
                            return true;
                        }else if($("#ibcpass" ).val().trim().length < 6 || $("#ibcpass" ).val().trim().length > 30){
                           
                            $("#ibcpass_error").text( Lang.Mail.Write.mmcdxw );
                            return true;
                        }else{
                            autopass = $("#autopass" )[0].checked ? 1 : 0;
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
                            oldpwd:  $("#ibcpass" ).val().trim(),
                            autosign: autopass
                        },
                
                        call: call,
                        failCall: fnfail
                    });
            
                }
           }
            
            
            function suc(data){
                if( data ){
                    oWrite.hasPassIbc = true;
                    numberChecked();

                    var code = data.errorCode;
                    
                    CC.showMsg(Lang.Mail.Write.xgmmcg, true, false, "option");
                    
                    $("#divDialogCloseconfirm", parent.document).click();
                    
                    if( oWrite.numberEncryptCheck ){
                        $("#numberEncrypt").attr("checked", true);
                    }
                    if( oWrite.numberSignCheck ){
                        $("#numberSignCheck").attr("checked", true );
                    }
                }
                
            }
            
            function fnfail(){
                CC.showMsg(Lang.Mail.Write.xgmmsb, true, false, "error");
            }
            
            function numberChecked(){
                if(oWrite.numberSignCheck){
                    $("#numberSign").attr("checked", true);
                }
                
                if(oWrite.numberEncryptCheck){
                    $("#numberEncrypt").attr("checked", true);
                }
           }
           
           
           

        })(jQuery);

        /**
         * 主题颜色
         */
        var fnSubjectColor = function($){
            var selectColorDiv = $("#subjectColor");
            var bOver = false;
            var t1 = "";
            var input_subject = $("#txtsubject");
            var aColor = [];
            var tips = [];
            var len = 0;
            var i = 0;
            var curColor = "#333333";
            var ui = [];
            var iColor = parent.Util.str2Num(parent.gMain.curColor);
            var defaultColor;
            
            if (parent.gConst.subjectColor && parent.gConst.subjectColor.length) {
                if(parent.gConst.subjectColor[0].hasOwnProperty('sort')){
                    parent.gConst.subjectColor.sort(function(a,b){return a.sort > b.sort;});
                }
                for (var i = 0; i < parent.gConst.subjectColor.length; i++) {
                    aColor.push(parent.gConst.subjectColor[i]);
                    tips.push(parent.gConst.subjectColor[i].name + parent.Lang.Mail.tips009);
                    ui.push(createListItem({
                        name: parent.gConst.subjectColor[i].name,
                        value: parent.gConst.subjectColor[i].value
                    }));
                    if(iColor && iColor == parent.gConst.subjectColor[i].val){
                        defaultColor = parent.gConst.subjectColor[i].value;
                    }
                }
                len = aColor.length;
            }

            $('#subjectColor .dataUl').html(ui.join(''));

            //从gMain得到主题颜色的下标，设置默认颜色
            if (defaultColor) {
                input_subject.css("color", defaultColor);
            }

            selectColorDiv.mouseover(function(){
                if (t1) {
                    clearTimeout(t1);

                }
                bOver = true;
            });

            selectColorDiv.mouseout(function(){
                t1 = setTimeout(function(){
                    if (bOver) {
                        selectColorDiv.hide();
                        bOver = false;
                    }
                }, 500);
            });

            $("#spanColorPicker").click(function(){
                selectColorDiv.hide();
                clearTimeout(showDiv);
                var showDiv = setTimeout(function(){
                    selectColorDiv.show();
                }, 100);

                return false;
            });
            $(document).click(function(){
                selectColorDiv.hide();
            });

            $("#subjectColor ul li").each(function(){
                $(this).mouseover(function(){
                    var cls = 'mouseon_color';
                    if ($(this).find('b').hasClass('curr')) {
                        cls = 'mouseon_color_on';
                    }
                    else {
                        cls = 'mouseon_color';
                    }
                    $(this).find("a").attr('class', cls);
                }).mouseout(function(){
                    var cls = 'mouseon_color';
                    if ($(this).find('b').hasClass('curr')) {
                        cls = 'mouseon_color_on';
                    }
                    else {
                        cls = 'mouseon_color';
                    }
                    $(this).find("a").removeClass(cls);
                });
            });

            input_subject.focus(function(){
                clearTimeout(p.clearSubjectTimer);
                if (isDefaultSubject(input_subject.val().trim().encodeHTML())) {
                    input_subject.val("");
                    oWrite.isDefaultSubject = false;
                }
            });

            for (i = 0; i < len; i++) {
                (function(index){
                    $("#subjectColor ul li")[index].onclick = function(){
                        //改变输入框的颜色
                        input_subject.css("color", aColor[index].value);
                        parent.gMain.curColor = aColor[index].val;//aColor[index];
                        $(".mouseon_color_on").removeClass("mouseon_color_on");
                        $(".curr").removeClass("curr");
                        $(this).find("a").attr('class', "mouseon_color_on");
                        $(this).find("b").addClass("curr");

                        //输入框为默认提示，改变颜色主题
                        if (isDefaultSubject(input_subject.val().trim().encodeHTML())) {
                            input_subject.val(parent.Lang.Mail.tips010);//tips[index]
                        }
                        //输入框为空，改变颜色主题
                        if (input_subject.val().trim() == "") {
                            input_subject.val(parent.Lang.Mail.tips010);//tips[index]
                        }
                        saveColorIndex(index);
                        clearTimeout(p.clearSubjectTimer);
                        //输入框为默认提示，改变颜色主题
                        if (isDefaultSubject(input_subject.val().trim().encodeHTML())) {
                            input_subject.val(parent.Lang.Mail.tips010);//tips[index]
                            p.clearSubjectTimer = setTimeout(function(){
                                input_subject.val("");
                                oWrite.isDefaultSubject = false;
                            }, 5000);
                        }

                    };
                })(i);
            };

            function saveColorIndex(id){

                var data = {
                    colorThemId: id
                };

                parent.MM.doService({
                    url: "/mail/conf",
                    func: "mail:setColorTheme",
                    data: data,
                    failCall: function(){
                    },
                    call: function(){

                    },
                    param: ""
                });

            }

            function createListItem(o){
                return '<li><a href="javascript:void(0);"><b style="background:' + o.value + '"></b>' + o.name + '</a></li>';
            }

            function isDefaultSubject(text){
                var result = false;
                text = text.trim().decodeHTML();
                if(text == parent.Lang.Mail.tips010){
                    result = true;
                }
                if(result){
                    oWrite.isDefaultSubject = true;
                }
                return result;
            }
        };

        fnSubjectColor(jQuery);

        lookAllAsSingleLink.onclick = function() {
            if(lookAllAsSingleLink.innerHTML.trim() == laasTxt) {
                var input_recipient = jQuery('#recipient_container input')[0];
                lookAllAsSingleLink.innerHTML = cancelLaasTxt;
                recipient_person.innerHTML = laasTxt;
                cc_and_scc.innerHTML = cancelCCAndSCCTxt;
                compose_CC.style.display = 'none';
                compose_SCC.style.display = 'none';
                recipient_person.parentNode.style.padding = '0';
                input_recipient.focus();
                p.focusId = input_recipient.id;
                p.richInputBox = p.ribs[0];
                p.isLookAllAsSingle = true;
                jQuery('#recipient_person').unbind('click').bind('click',recipient_dialog);
                //存储收件人原始值。
                var originalVal = p.ribs[0].getItems();
                p.originalRecipient = originalVal;
                p.originalCC = p.ribs[1].getItems();
                p.originalSCC = p.ribs[2].getItems();

                //合并抄送，密送人至群发单显。
                if(p.isCC){
                    var sItems = p.ribs[1].getItems();
                    if(sItems && sItems.length){
                        for(var i=0,l=sItems.length;i<l;i++){
                            sItems[i].remove();
                            p.ribs[0].insertItem(sItems[i].allText);
                        }
                    }
                }
                if(p.isSCC){
                    var scItems = p.ribs[2].getItems();
                    if(scItems && scItems.length){
                        for(var i=0,l=scItems.length;i<l;i++){
                            scItems[i].remove();
                            p.ribs[0].insertItem(scItems[i].allText);
                        }
                    }
                }
            } else {
                var html = [];
                var a = addCCTxt, b = addSCCTxt;
                if(p.isCC) {
                    a = delCCTxt;
                    compose_CC.style.display = '';
                }
                if(p.isSCC) {
                    b = delSCCTxt;
                    compose_SCC.style.display = '';
                }

                html.push('<a id="ccLink" href="javascript:fGoto();" title="'+parent.Lang.Mail.tips011+'" class="ws-font">' + a + '</a>');
                html.push('&nbsp;&nbsp; - &nbsp;&nbsp;');
                html.push('<a id="sccLink" href="javascript:fGoto();" title="'+parent.Lang.Mail.tips012+'" class="ws-font">' + b + '</a>');

                lookAllAsSingleLink.innerHTML = laasTxt;
                recipient_person.innerHTML = recipientTxt;
                recipient_person.parentNode.style.padding = '0 10px 0 3px';
                cc_and_scc.innerHTML = html.join('');
                ccAndSccEvents();
                p.isLookAllAsSingle = false;

                //恢复收件人
                var nowItems = p.ribs[0].getItems();
                var ccItems = p.originalCC;
                var sccItems = p.originalSCC;
                var staticOriginalItems = p.originalRecipient.concat(ccItems).concat(sccItems);
                var hChk = {}, addedOn = [];

                if(staticOriginalItems && staticOriginalItems.length){
                    for(var i=0,l=staticOriginalItems.length;i<l;i++){
                        hChk[staticOriginalItems[i].allText] = 1;
                    }
                }

                if(nowItems && nowItems.length){
                    for(var i=0,l=nowItems.length;i<l;i++){
                        if(!hChk.hasOwnProperty(nowItems[i].allText)){
                            addedOn.push(nowItems[i]);
                        }
                        nowItems[i].remove();
                    }
                }

                if(p.originalRecipient){
                    for(var i=0,l=p.originalRecipient.length;i<l;i++){
                        p.ribs[0].insertItem(p.originalRecipient[i].allText);
                    }
                }
                if(addedOn && addedOn.length){
                    for(var i=0,l=addedOn.length;i<l;i++){
                        p.ribs[0].insertItem(addedOn[i].allText);
                    }
                }
                if(ccItems){
                    for(var i= 0,l=ccItems.length;i<l;i++){
                        p.ribs[1].insertItem(ccItems[i].allText);
                    }
                }
                if(sccItems){
                    for(var i= 0,l=sccItems.length;i<l;i++){
                        p.ribs[2].insertItem(sccItems[i].allText);
                    }
                }
            }
            p.needAutoSave = true;
            p.setSize();
        };

        ccAndSccEvents();

        // 注册收件人按键事件
        if(this.ribs[0] && this.ribs[0] instanceof RichInputBox){
            this.ribs[0].textbox.onkeyup = function(){
                if(p.personErrTips && p.personErrTips instanceof ToolTips){
                    p.personErrTips.close();
                    p.personErrTips = null;
                }
            }
        }

        // 注册主题按键事件
        $('txtsubject').onkeydown = function(e){
            if(p.titleErrTips && p.titleErrTips instanceof ToolTips){
                p.titleErrTips.close();
                p.titleErrTips = null;
            }
            p.needAutoSave = true;
            p.changed = true;
            e = parent.EV.getEvent(e);
            if(e && parent.EV.getCharCode(e) == 9 && !e.shiftKey){
                parent.EV.stopEvent(e);
                Editor.body.focus();
            }
        }

        $('txtsubject').onclick = function(){
            if(p.titleErrTips && p.titleErrTips instanceof ToolTips){
                p.titleErrTips.close();
                p.titleErrTips = null;
            }
        }


        /**
         * 判断是否有附件上传功能
         */
        //if(GC.check("MAIL_WRITE_ATTACH") || GC.check("MAIL_WRITE_FLASH") ) {
            $("trAttach").style.display = "";
            //if(!GC.check("MAIL_WRITE_ATTACH") || GC.check("MAIL_WRITE_FLASH")) {
                if($("aattach"))$("aattach").style.display = "";
                if($('flashplayer'))$('flashplayer').style.display = '';
            //}
//      }
//      else{
//          if($('aattach'))$('aattach').style.display = 'none';
//          if($('flashplayer'))$('flashplayer').style.display = 'none';
//      }

        // 禁止转发与加密邮件互斥检查
        var conflictCheck = {
            checkForbidden: function(val){
                // 互斥耦合
                if(p.encryptMail && p.encryptMailClass){
                    if(val == '1'){
                        p.encryptMailClass.clearPwd();
                        p.encryptMailClass.hideTips();
                        p.encryptMailClass.control.chkbox.attr('disabled', 'true');
                        p.encryptMailClass.control.chkbox.attr('title', Lang.Mail.Write.nyxzjjszmm);
                    }
                    else{
                        p.encryptMailClass.control.chkbox.removeAttr('disabled');
                        p.encryptMailClass.control.chkbox.attr('title', Lang.Mail.Write.gyjszmm);
                    }
                }
            },
            checkEncrypt: function(val){
                if(val){
                    if(GC.check('MAIL_INBOX_FORWARD')){
                        var chkForbiddenForward = jQuery('#chkForbiddenForward');
                        p.denyForward = '0';
                        chkForbiddenForward[0].checked = false;
                        chkForbiddenForward.attr('disabled', 'true');
                        chkForbiddenForward.attr('title', Lang.Mail.Write.nyxzgzjzzf);
                    }
                }
                else{
                    if(GC.check('MAIL_INBOX_FORWARD')){
                        var chkForbiddenForward = jQuery('#chkForbiddenForward');
                        chkForbiddenForward.removeAttr('disabled');
                        chkForbiddenForward.attr('title', Lang.Mail.Write.szjzzfgyj);
                    }
                }
            }
        };

        

        /**
         * 注册禁止转发事件
         */
        if(GC.check('MAIL_INBOX_FORWARD')){
            var chkForbiddenForward = $('chkForbiddenForward');
            if(chkForbiddenForward){
                chkForbiddenForward.onclick = function(e){

                    jQuery("#writer_func_container").css("zIndex", 3000);

                    var denyForwardTips = $('denyForwardTips');
                    if(denyForwardTips){
                        var h = parent.El.height(denyForwardTips);
                        var l = $("chkForbiddenForward").offsetLeft;

                        if(h){ h = -h + 'px'; }
                        
                        denyForwardTips.style.top = h;
                        jQuery(denyForwardTips).css("left", (l - 215 / 2 + 6) + "px");
                        
                    }
                    
                    var val = this.checked ? '1' : '0';
                    var needTips = top.gMain.denyForwardTips == "" ? true : top.gMain.denyForwardTips == '1' ? true : false;
                    // 校验是否需要提示
                    if(needTips && val == '1'){
                        var func_container = $('writer_func_container');
                        var denyForward_tips = $('denyForwardTips');
                        denyForward_tips.style.display = 'block';
                        p.topTips(jQuery("#denyForwardTips"));

                        // 注册tips按钮事件
                        $('denyForward_close').onclick = function(e){
                            p.denyForwardClose();
                            p.reRender();
                        }
                        p.reRender();
                        p.denyForwardPanelShown = true;
                    }
                    // 更新状态
                    p.denyForward = val;

                    // 互斥耦合
                    conflictCheck.checkForbidden(val);
                }
            }
        }

        // 如果开启了加密邮件，则注册加密邮件相应事件
        if(p.encryptMail){
            var EMC;
            p.encryptMailClass = EMC = {
                init: function(){
                    this.control = {
                        chkbox: jQuery('#chkSetPassword'),
                        panel: jQuery('#encryptMailPanel'),
                        pwd: jQuery('#encryptMail_pwd'),
                        repwd: jQuery('#encryptMail_repwd'),
                        pwdError: jQuery('#encryptMail_pwd_error'),
                        repwdError: jQuery('#encryptMail_repwd_error'),
                        btnOk: jQuery('#encryptMail_ok'),
                        btnCancel: jQuery('#encryptMail_cancel'),
                        tips_container: jQuery('#encryptMailTips'),
                        tips_lookup: jQuery('#encryptMailLookPassword'),
                        tips_cancel: jQuery('#encryptMailClearPassword'),
                        tips_pwd: jQuery('#encryptMailPwd'),
                        funcContainer: jQuery('#writer_func_container')
                    };
                    this.pwd = '';
                    this.initEvent();
                },
                initEvent: function(){
                    var This = this;
                    this.control.chkbox.unbind('click').bind('click', function(){
                        var v = jQuery(this)[0].checked;

                        jQuery("#writer_func_container").css("zIndex", 3000);
                        if(v){
                            This.showPanel();
                        }
                        else{
                            This.hidePanel();
                            EMC.control.chkbox[0].checked = false;
                            EMC.hideTips();
                        }
                        // 互斥耦合
                        conflictCheck.checkEncrypt(v);
                    });
                    this.control.btnCancel.unbind('click').bind('click', function(){
                        This.hidePanel();
                    });
                    this.control.btnOk.unbind('click').bind('click', function(){
                        if(This.checkPassword()){
                            parent.CC.showMsg(parent.Lang.Mail.tips013, true, false, 'option');
                            This.showTips();
                            This.hidePanel();
                            if (parent.GE) {
                                parent.GE["smsPwd_"+oWrite.composeId] = EMC.pwd.encodeHTML();
                            }
                        }
                    });
                    this.control.tips_lookup.unbind('click').bind('click', function(){
                        This.showPassword();
                    });
                    this.control.tips_cancel.unbind('click').bind('click',function(){
                        This.clearPwd();
                        This.hideTips();
                    });
                },
                showPanel: function(){
                    EMC.control.panel.show();
                    p.topTips(EMC.control.panel);
                    p.setSize();
                    p.reRender();
                    p.encryptPanelShown = true;
                },
                hidePanel: function(){
                    EMC.control.panel.hide();
                    p.setSize();
                    p.encryptPanelShown = false;
                },
                showTips: function(){
                    EMC.control.tips_container.show();
                    p.setSize();
                },
                hideTips: function(){
                    EMC.control.tips_container.hide();
                    p.setSize();
                },
                clearPwd: function(){
                    EMC.pwd = '';
                    EMC.control.pwd.val('');
                    EMC.control.repwd.val('');
                    EMC.hidePanel();
                    EMC.clearError();
                    EMC.control.chkbox[0].checked = false;
                    // 互斥耦合
                    conflictCheck.checkEncrypt(false);
                    //取消发送短信告知邮件密码
                    parent.GE["smsPwd_"+oWrite.composeId] = "";
                },
                showPassword: function(){
                    EMC.updatePassword();
                    EMC.control.tips_pwd.show();
                    EMC.control.tips_lookup.html(parent.Lang.Mail.tips014).unbind('click').bind('click', function(){
                        EMC.hidePassword();
                    });
                },
                hidePassword: function(){
                    EMC.control.tips_pwd.hide();
                    EMC.control.tips_lookup.html(parent.Lang.Mail.tips015).unbind('click').bind('click', function(){
                        EMC.showPassword();
                    });
                },
                updatePassword: function(){
                    EMC.control.tips_pwd.html(parent.Lang.Mail.tips016 + '：' + EMC.pwd.encodeHTML());
                },
                clearError: function(){
                    EMC.control.pwdError.html('');
                    EMC.control.repwdError.html('');
                },
                restorePassword: function(pwd){
                    EMC.control.chkbox[0].checked = true;
                    EMC.pwd = pwd;
                    EMC.control.pwd.val(pwd);
                    EMC.control.repwd.val(pwd);
                    EMC.showTips();
                    EMC.showPassword();
                    // 互斥耦合
                    conflictCheck.checkEncrypt(true);
                },
                checkPassword: function(){
                    var pwd = EMC.control.pwd.val().trim();
                    var repwd = EMC.control.repwd.val().trim();
                    EMC.clearError();
                    if(pwd == ''){
                        EMC.control.pwdError.html(parent.Lang.Mail.tips017);
                        EMC.showPanel();
                        EMC.control.pwd.focus();
                        return false;
                    }
                    if(repwd != pwd){
                        EMC.control.repwdError.html(parent.Lang.Mail.tips018);
                        EMC.showPanel();
                        EMC.control.repwd.focus();
                        return false;
                    }
                    EMC.pwd = pwd;
                    EMC.updatePassword();
                    return true;
                }
            };
            EMC.init();
        }// 加密邮件事件注册完毕

        //聚焦至第一个收件人输入框
        try{
            var firstInput = jQuery("#recipient_container input")[0];
            firstInput.focus()
            p.focusId = firstInput.id;
            p.doTextFocus(p.focusId);
            p.richInputBox = ribs[0];
        }
        catch(e){}

        // 请求敏感词词库
        p.getFilterKeyWords();

        oWrite.setSize();

        // 检测附件合并入口并注册事件
        var disk_and_temp = jQuery('#disk_transform_action');
        var in_disk_and_temp = false;
        if(disk_and_temp){
            var thW = parent.El.getSize(jQuery('#trAttach th')[0]);
            if(thW){
                thW = thW.width + 9;
            }
            else{
                thW = 53 + 9;
            }

            disk_and_temp.bind('mouseover', function(e){
                jQuery("#composeBarHai").css("zIndex", 3000);

                var size = parent.El.pos(disk_and_temp[0]);
                in_disk_and_temp = true;
                if(size && size[0]){
                    jQuery('#transform_panel').css('left', (size[0] - thW) + 'px');
                }
                jQuery('#transform_panel').show('normal',function(){
                    jQuery('#transform_disk').unbind('click').bind('click',function(){
                        var disk = new parent.DiskDialog();
                        disk.create(attach.tempDiskCall, 0);
                        jQuery('#transform_panel').hide();
                    });
                    jQuery('#transform_tempDisk').unbind('click').bind('click',function(){
                        var tmp = new parent.DiskDialog();
                        tmp.create(attach.tempDiskCall, 1);
                        jQuery('#transform_panel').hide();
                    });
                });
                parent.EV.stopPropagation(e);
            }).bind('mouseout', function(){
                    in_disk_and_temp = false;
                    jQuery("#composeBarHai").css("zIndex", 3000);
                });
            jQuery('#transform_panel').hover(function(){
                jQuery("#composeBarHai").css("zIndex", "3000")
                in_disk_and_temp = true;
                
            }, function(){
                in_disk_and_temp = false;

              
               jQuery("#composeBarHai").css("zIndex", "3000")
            
                
            }).bind('mousemove', function(e){

                    parent.EV.stopPropagation(e);
                });

            jQuery(document).bind('mousemove', function(){
                if(!in_disk_and_temp){
                    jQuery('#transform_panel').hide();
                }
            });
            jQuery(Editor.doc).bind('mousemove', function(){
                if(!in_disk_and_temp){
                    jQuery('#transform_panel').hide();
                }
            });
        }

        //注册ctrl + v 事件
        void function($){
            //ss var agent=navigator.userAgent.toLowerCase();
            var browser=$.browser,isIE=browser.msie,isOpera=browser.opera;
            if(!isOpera){
                $(isIE?document.body:document).bind(isIE?'beforepaste':'paste',function(e){
                    return window.captureClipboard && window.captureClipboard();
                });
            }else $(document).bind("keydown",function(e){
                if(e.ctrlKey&&e.which===86){
                    return window.captureClipboard && window.captureClipboard();
                }
            });
        }(jQuery);

        // 根据自销毁权限绑定事件
        if (parent.CC.power.offAutoDestroy()) {
            this.bindAutoDestroy(jQuery);
        }
    },

    /**
    * 初始化快捷主题
    */
    initQuickSubject: function () {
        var i = 0
            html = "",
            data = this.quickSubject,
            me = this;

        for (; i < data.length; i++) {
            html += "<li><a href=\"javascript:;\">" + data[i] + "</a></li>"
        }
        
        jQuery("#dropQuickSubject").html(html).on("click", "li > a", function (e) {
            jQuery("#txtsubject").val(jQuery(this).text());
            clearTimeout(me.clearSubjectTimer);
            oWrite.isDefaultSubject = false;
            jQuery("#dropQuickSubject").hide();
            e.stopPropagation();
        });

        jQuery("#btnQuickSubject").click(function (e) {
            if(jQuery("#dropQuickSubject").is(":hidden")){
                jQuery(this).css("zIndex", "4000")
            }else{
                jQuery(this).css("zIndex", "4090")
            }
            jQuery("#dropQuickSubject").toggle();
            e.stopPropagation();
        });

        jQuery("#dropQuickSubject").mouseleave(function(){
            jQuery(this).hide();
            jQuery("#btnQuickSubject").css("zIndex", "4000")
        })

        if (/msie 6/i.test(navigator.userAgent)) {
            jQuery("#btnQuickSubject").mouseover(function () {
                jQuery(this).parent().addClass("toolNew-on");
            }).mouseout(function () {
                jQuery(this).parent().removeClass("toolNew-on");
            });
        }

        jQuery(document.body).click(function (e) {
            jQuery("#dropQuickSubject").hide();
            jQuery("#morewraphai").hide();
            e.stopPropagation();
             
        });
    },

    /**
    * 给自销毁绑定事件
    */
    bindAutoDestroy: function ($) {
        var me = this,
            obj = $("#chkAutoDestroy"),
            tips = $("#tipsAutoDestroy");

        obj.change(function(event) {

            jQuery("#writer_func_container").css("zIndex",3000);
            var x = obj[0].offsetLeft;
            if ($(this).prop("checked")) {
                tips.css("left", x - 216 + 6 + "px").show();
                me.topTips(tips);
            } else {
                me.isAutoDestroy = false;
                $("#autoDestroyMailTips").hide();
                tips.hide();
            }
        });

        $("#btnAutoDestroyCancel").click(function () {
            me.isAutoDestroy = false;
            $("#chkAutoDestroy").prop("checked", false);
            tips.hide();
        });

        $("#btnAutoDestroyOk").click(function (e) {
            var text = "",
                days;

            if ($("#ckbAutoDestroy").prop("checked")) {
                text = Lang.Mail.Write.zsyfzjzdxh;
            } else if ($("#ckbDaysDestroy").prop("checked")) {
                days = ~~$("#inputReadDays").val();
                if (!(days >= 1 && days <= 100)) {
                    $("#textReadDays").css("color", "red");
                    e.preventDefault();
                    return false;
                }
                text = Lang.Mail.Write.zsyfzfsdyj + days + Lang.Mail.Write.thyjjzdxh;
            } else {
                $("#chkAutoDestroy").prop("checked", false);
                me.isAutoDestroy = false;
            }
            if (text.length > 0) {
                me.isAutoDestroy = true;
                $("#autoDestroyMailTips").html(text).show();
            }
            tips.hide();
        });

        $("#ckbAutoDestroy").change(function() {
            if ($(this).prop("checked")) {
                $("#ckbDaysDestroy").prop("checked", false);
            }
        });

        $("#ckbDaysDestroy").change(function() {
            if ($(this).prop("checked")) {
                $("#ckbAutoDestroy").prop("checked", false);
            }
        });
    },

    /**
    * 管理底部tips层的z-index
    * maxtips 最高z-index的tips
    */
    topTips: function (maxtips) {
        jQuery("#writer_func_container").find(".tipBox").css("zIndex", 1);
        maxtips.css("zIndex", 2);
    },
    /**
     * 让dom重新渲染
     */
    reRender: function(){
        document.body.style.zoom = 1.1;
        document.body.style.zoom = '';
    },
    needToChangeZIndex: function(){
        var encryptPanelShow = this.encryptPanelShown || false;
        var denyForwardPanelShow = this.denyForwardPanelShown || false;

        return !(encryptPanelShow || denyForwardPanelShow);
    },
    /**
     * 禁止转发关闭按键事件
     */
    denyForwardClose: function(){
        var chk = $('denyForward_checkbox').checked ? 1 : 0;
        var container = $('writer_func_container');
        var tips = $('denyForwardTips');
        if(chk){
            parent.gMain.denyForwardTips = '0';
            this.ajaxRequest({
                func: 'user:setAttrs',
                data: {
                    _custom_denyForwardTips: '0'
                }
            });
        }
        tips.style.display = 'none';
        this.denyForwardPanelShown = false;
    },
    /**
     * 设置高度限定输入控件高度
     */
    setHeight: function(obj){
        return;
        var nowHeight = parent.El.height(obj);
        if(nowHeight >= writeInputHeight){
            obj.parentNode.style.maxHeight = writeInputHeight + 'px';
        }
    },
    /***
     * 自动存草稿
     */
    autoSave : function() {
        //if(PageState == PageStateTypes.Uploading){
            //parent.CC.alert(Lang.Mail.Write.uploadWaiting + "!");
        //}
        //else{
            if(oWrite.status == 0) {
                this.times++;
                this.isAutoSave = true;
                this.saveDraftType = 'auto';
                this.doMailInfo(true);
            }
        //}
    },
    /**
     * 加载发件人列表
     */
    loadSendList : function() {
        var obj = $("selFrom");
        var caseObj = $('showWriterCase');
        var listPanel = $('writer_panel');
        var listContainer = $('writer_sender_pop');
        var name = parent.gMain.trueName || "";
        var mail = "", len = this.sendMaxLen, text = "", value = "";
        var showName = name;
        var li = [], cls;
        if(name.length > this.sendMaxLen) {
            showName = name.substring(0, len) + "...";
        }

        mail = this.sendList[0].value.encodeHTML();
        value = "" + name + "" + "&lt;" + mail + "&gt;";

        if(this.sendList.length > 1){
            for(var i = 0, l = this.sendList.length; i < l; i++) {
                var oAlias = this.sendList[i];
                mail = oAlias.value;
                if(mail && parent.Email.match(mail)) {
                    if(name) {
                        value = "<strong>" + name + "</strong>" + "&lt;" + mail + "&gt;";
                        text = mail; //"\"" + showName + "\"" + "<" + mail + ">";
                    } else {
                        value = mail;
                        text = mail;
                    }
                    if(oAlias.isLoginName) {
                        cls = ' class="current"><i></i>';
                    }
                    else{
                        cls = '><i></i>';
                    }
                    li.push('<li><a href="javascript:fGoto();" onclick="oWrite.setSender(this);" title="' + value.encodeHTML() + '"' + cls + text.encodeHTML() + '</a></li>')
                }
            }
            li.push('<li class="line"></li>');
            li.push('<li><a href="javascript:fGoto();">' + Lang.Mail.Write.setDefaultSenderAndAlias + '</a></li>');
            listContainer.innerHTML = li.join('');
            //绑定发件人弹窗事件
            jQuery('#showWriterCase').bind('click', function(){
                var div = jQuery(listPanel);
                div.show();
                var size = parent.El.getSize(div[0]);
                div.css({
                    top: -size.height + 'px',
                    left: (size.width - 10) + 'px'
                });
            });
        }
        else{
            jQuery(caseObj).hide();
        }
        return;
    },
    /**
     * 校验禁止转发邮件的附件以及文件格式是否满足要求
     */
    checkDenyForwardAttach: function(){
        var commonAttachTotalSize = 0;
        var typeOk = true, t;
        var allow = parent.Util.getSizeByByte(this.denyForwardMaxAttachSize, 'M');
        var types = this.denyForwardAttachTypes;
        var attachList = [];

        if (upload_module.model.composeAttachs.length > 0) {
            attachList = upload_module.model.composeAttachs;
        } else if (attach.attachList.length > 0) {
            attachList = attach.attachList;
        } else if (attach.data.length > 0){
            attachList = attach.data;
        }

        if(types.substr(0,1) !='|'){
            types = '|' + types;
        }
        if(types.substr(types.length-1) != '|'){
            types += '|';
        }

        for(var i = 0; i<attachList.length;i++){
            commonAttachTotalSize += attachList[i].fileSize;
            t = '|' + this.getFileType(attachList[i].fileName) + '|';
            if(typeOk && types.indexOf(t) <= -1){
                typeOk = false;
            }
        }

        // 校验文件类型
        if(!typeOk){
            return false;
        }
        // 校验附件大小
        if(allow < commonAttachTotalSize){
            return false;
        }
        return true;
    },
    /**
     * 处理数组中正则表达式特殊字符
     * @param keys {Array} 数组
     */
    clearRegString: function(keys){
        var re = /[\\\|\[\]\/\*\.\^\$\?\(\)]/ig;
        for(var i=0, l=keys.length; i<l; i++){
            keys[i] = keys[i].toString().replace(re,function(v){
                return Lang.Mail.Write.yichudui|');
        var r = new RegExp( '(' + k + ')' + '\\s*=\\s*[\'"]?[^\'"]+\2?','gi');
        return html.replace(r, '');
    },
    /**
     * 高亮关键字，并返回高亮后的文本
     * @param text {string} 需要扫描的文本
     * @param rep {string} 替换成的文本，留空这染红
     */
    highLightWords: function(text, rep){
        var result = oWrite.highLightResult || {};
        var hKeys = oWrite.clearRegString(oWrite.highLightKeys).join('|'), re;

        if(!text || hKeys == ''){
            return text;
        }
        text = oWrite.clearHTMLKeyValue(text, ['title', 'alt']);
        hKeys = hKeys.replace(/\|\s*\|/g, '|');
        hKeys = hKeys.replace(/\|+/g, '|');
        hKeys = '(<font color="?red"?>)?(' + hKeys + ')(</font>)?';

        result.keys = result.keys || {};

        re = new RegExp(hKeys, 'g');

        text = text.replace(re, function(v, v1, v2, v3){
            result.keys[v2] = 1;
            if(rep){
                return rep;
            }
            if(v1 && v3 && v1 != '' && v3 != ''){
                return v;
            }
            return '<font color="red">{0}</font>'.format(v);
        });

        oWrite.highLightResult = result;
        return text;
    },
    /**
     * 邮件地址数量溢出处理
     */
    mailNumError: function( rib_instance ){
        var tips = new ToolTips({
            id: 'aaa',
            direction: ToolTips.direction.Bottom
        });
        tips.show(rib_instance.textbox, Lang.Mail.Write.addrCount.format(oWrite.toMaxNum));
    },
    setSender: function(obj){
        var val = obj.title;
        $('selFrom').innerHTML = val;
        jQuery('#writer_sender_pop a').removeClass('current');
        parent.El.addClass(obj, 'current');
        jQuery('#writer_panel').hide();
    },
    /**
     * 加载系统主题列表
     */
    loadSubjectList : function() {
        return;
        var html = [], subject = "";
        for(var i = 1, l = this.sysSubjectNum; i <= l; i++) {
            subject = Lang.Mail.Write["subject" + i];
            this.sysSubject.push(subject);
            html.push('<a href="javascript:fGoto();" onclick="' + this.objectName + '.setSubject(this)">' + subject + '</a>');
        }
        $("dvSubject").innerHTML = html.join("");
    },
    refreshAddr : function() {
        if(oWrite.al) {
            oWrite.al.init(true);
        }
        oWrite.initAutoFill();
    },
    initAutoFill : function() {
        return;
        var p = this;
        var isShowFill = GC.check("CONTACTS") && GC.check("CONTACTS_OPER");
        //初始化收件人、密送、抄送下拉感应,设置ff下textarea效果
        for(var i = 0; i < p.textArea.length; i++) {
            var v = p.textArea[i]; (function() {
                var obj = $(v);
                var id = v;
                p.textSizeEvent[id] = parent.AutoTextSize.create(id, window, {
                    resizeCall : oWrite.setSize
                });
                if(isShowFill) {
                    parent.LMD.fillEmail(obj, window, {
                        setCall : p.selectMail
                    });
                }
                parent.EV.observe(obj, "focus", function() {
                    p.doTextFocus(id);
                });
                parent.EV.observe(obj, "blur", function() {
                    p.doTextBlur(id);
                });
                parent.EV.observe(obj, "keydown", function() {
                    p.doTextKeydown(id);
                });
            })();
        }
    },
    /**
     * 获取敏感词词库
     */
    getFilterKeyWords: function(){
        var p = this;
        if(this.filterKeywords){
            if(parent.GE.highLightKeys){
                this.highLightKeys = parent.GE.highLightKeys;
            }
            else{
                this.ajaxRequest({
                    func: 'spam:querySensitWord',
                    url: '/RmWeb/mail',
                    callback: function(data){
                        if(data && data.code == 'S_OK'){
                            var d = data['var'];
                            if(d.sensitWords && d.sensitWords.length){
                                parent.GE.highLightKeys = p.highLightKeys = d.sensitWords;
                            }
                        }
                    },
                    failback: function(e){
                        var x = e;
                    }
                });
            }
        }
    },
    /***
     * 初始化通讯录列表
     */
    loadAddrList : function() {
        var p = this;
        var s = [];
        contact.isShowValue = false;
        contact.addAsGroup = true;
        if(parent.CC.isRmAddr())
            contact.isAsyn=false;
        //contact.is
        contact.setValue = function(name, email) {
            oWrite.selectMail(email, name + " <" + email + ">");
        };
        contact.showLinkMan(s, "contact_addr_container");
        var listAll = ["MAILGROUP", "EP", "CS", "PERSON", "RECENT"];
        var list = [];
        if(GC.check("CONTACTS_PER")) {
            s.push("5");
        }
         if(GC.check("CONTACTS_ENT") && parent.window.IsOA ==0) {
             s.push("0");
         }
        if(GC.check("CONTACTS_PER")) {
            s.push("2");
        }
        if(parent.gMain.hideMailGroup!="1") {
            s.push("3");
        }
        //右侧通讯录搜索
        var searchBtn = $('searchDelete')
        var searchInput = $('searchKey');
        var keyValue = parent.Lang.Mail.tips019;
        searchInput.value = keyValue;
            parent.EV.observe(searchInput, 'focus', function(){
                if(jQuery(searchInput).val() == keyValue){
                    jQuery(searchInput).val('');
                    jQuery(searchInput).css('color', 'black');
                }
            });
            parent.EV.observe(searchInput, 'blur', function(){
                if(jQuery(searchInput).val().trim() == ''){
                    jQuery(searchInput).val(keyValue);
                    jQuery(searchInput).css('color', '');
                }
        });

        var ap = {
            div : "tab_search_div",
            setCall : p.selectMail,
            line : 20,
            text:"searchKey",
            autocomplete: true,
            noHideDiv : true,
            statsCall : function(v) {
                v = v || 0;
                if(v == 0) { //0为没有搜关键字
                    jQuery("#searchDelete").removeClass('searchDelete');
                    $("tab_list_div").style.display = "";
                    $("tab_search_div").style.display = "none";
                } else {
                    jQuery("#searchDelete").addClass("searchDelete");
                    $("tab_list_div").style.display = "none";
                    $("tab_search_div").style.display = "";
                }
            }
        };
        parent.LMD.fillEmail("searchKey", window, ap);

        parent.EV.observe($("searchDelete"), "click", function(){
            $("searchKey").value = keyValue;
            $("searchKey").style.color = '';
            ap.statsCall(0);
        });

    },
    seachDeptUser_asyn : function(key) {
        var p = this;
        var ap = {
            div : "tab_search_div",
            setCall : p.selectMail,
            line : 20,
            noHideDiv : true,
            autocomplete : false,
            statsCall : function(v) {
                v = v || 0;
                if(v == 0) { //0为没有搜关键字
                    jQuery("#searchDelete").removeClass('searchDelete');
                    $("tab_list_div").style.display = "";
                    $("tab_search_div").style.display = "none";
                } else {
                    jQuery("#searchDelete").addClass("searchDelete");
                    $("tab_list_div").style.display = "none";
                    $("tab_search_div").style.display = "";
                }
            }
        };

        var data = {
            key : key,
            depId : 0,
            type : "2",
            paging : 1,
            pageNo : 0,
            pageSize : 20,
            count : -1,
            letter : "",
            groupId : 0
        }
        var t1 = parent.AutoFill.datas["email"];
        parent.MM.doService({
            url : "/addr/user",
            func : "addr:listUser",
            data : data,
            failCall : function(d) {
                parent.CC.alert(d.summary);
            },
            call : function(data1) {
                var userList = data1["var"].list;
                for(var i = 0; i < userList.length; i++) {
                    t1.push({
                        id : userList[i].id,
                        name : userList[i].userName,
                        value : userList[i].email,
                        word : userList[i].fullNameFullWord,
                        fullword : userList[i].fullNameWord
                    });
                }
                parent.AutoFill.datas["email"] = t1;
                var ss = parent.LMD.fillEmail("searchKey", window, ap);
                ss.showList(ss);
            },
            param : ""
        });
    },
    loadDiskFiles : function() {
        var cid = this.composeId;
        if(cid) {
            var obj = parent.GE.diskFiles[cid];
            attach.addDiskFiles(obj);
        }
    },
    /**
     * 得到默认签名
     */
    getDefaultSign : function() {
        var signList = this.signList;
        for(var i = 0; i < this.signList.length; i++) {
            if(signList[i].isDefault) {
                return signList[i].content;
            }
        }
        return "";
    },
    /**
     *  设置默认签名
     */
    setDefaultSign : function() {
        var signList = this.signList;
        var corpSignList = this.corpSignList;
        for(var i = 0; i < signList.length; i++) {
            if(signList[i].isDefault) {// && top.GC.check('MAIL_CONFIG_SIGN')
                Editor.setDefaultSign(signList[i]);
                return;
            }
        }
        for(var j = 0; j < corpSignList.length; j++) {
            if(corpSignList[j].isDefault) {// && top.GC.check('MAIL_CONFIG_SIGN')
                Editor.setDefaultSign(corpSignList[j]);
                return;
            }
        }
    },
    setSize : function() {
        var paddingAndMargin = -5;
        if(isIE){
            paddingAndMargin = 0;
        }
        var bFlash = upload_module_flash.isSupport();
        var H =  parent.El.docHeight(window) - 45 - paddingAndMargin;
        var W = parent.El.docWidth(window);

        var writeTips = $("encryptMailTips"); //writeTips
        //存草稿信息提示栏
        var textArea = $("sourceEditor");
        //纯文本编辑器textarea对象
        var writeToolbarH = parent.El.height($("editorToolbar"));
        //编辑器工具栏
        var wth = parent.El.height(writeTips);
        //存草稿信息提示栏高度
        if(!parent.El.visible(writeTips)) {
            wth = 0;
        }
        //var wtah = parent.El.height($("writeAction"));
        //写信页发送按钮栏高度
        var th = $("writeTop").offsetHeight + 2;
        //信头高度
        var sh = parent.El.height($("searchButton"));
        //搜索栏高度
        var timeh = parent.El.height($("spanDefiniteTime"));
        //定时发信区高度
        var taH = parent.El.height($('compose_top_action'));
        //头部按钮高度
        var baH = parent.El.height($('compose_bottom_action'));
        //底部按钮高度
        var sider = $('writeSidebar');
        var switchArrow = $('tabSwitch');
        var li1 = $('tab_li0_div');
        var li2 = $('tab_li1_div');
        var lih = H - taH - baH;
        var editorFixHeight = 250;
        var rightFixHeight = editorFixHeight + 130;

        if(!parent.El.visible($("spanDefiniteTime"))) {
            timeh = 0;
        }
        var editH = H - taH - wth - th - writeToolbarH - timeh - baH - 5;
        parent.El.height($("htmlEditor"), editH);
        parent.El.height(textArea, editH);

        // 自适应调整方法
        function setSize1(){
            parent.El.height($("tab_search_div"), H - taH - baH - 59 - sh);
            parent.El.height($("letterPaper"), H - taH - baH - 45);
            parent.El.height($("addrList"), H - taH - baH - sh - 61);
            parent.El.height(li1, lih - wth - 37);
            parent.El.height(li2, lih - wth - 45);
            parent.El.setStyle(switchArrow, {
                'marginTop': parseInt(lih  / 2) + 'px'
            });
        }

        function setSize2(){
            parent.El.height($("htmlEditor"), editorFixHeight);
            parent.El.height($("tab_search_div"), rightFixHeight - 22 - sh);
            parent.El.height($("letterPaper"), rightFixHeight  - 8);
            parent.El.height($("addrList"), rightFixHeight - sh - 23);
            parent.El.height(li1, rightFixHeight - 1);
            parent.El.height(li2, rightFixHeight - 8);
            parent.El.setStyle(switchArrow, {
                'marginTop': parseInt(lih  / 2) + 'px'
            });
        }

        if(editH > editorFixHeight) {
            setSize1();
        }
        else{
            setSize2();
        }
        var fileInput = $("formUpload");
        var btnAttach = $("aattach");
        var flashUpload = $("flashplayer");
        var top =  parent.El.getY(btnAttach) - wth - 48;// - wtah
        parent.El.width(textArea, $("writeContent").offsetWidth - 10 );
    },
    /**
     * 获取写信会话id，上传附件之前必须获得该 id,以便后台维护写信和附件的关系
     * @param {Object} cb
     */
    getComposeId : function(cb) {
        var self = oWrite;
        if(self.id){
            if( typeof cb == "function") {
                cb.call(self,self.id);
            }
        }else{
            var reqData = {
                func : parent.gConst.func.getComposeId,
                data : null,
                method : "get",
                call : function(resp) {
                    try {
                        if(resp.code == "S_OK") {
                            if(!oWrite.id){
                                oWrite.isNewCreate=true;
                                oWrite.setDefaultSign()
                                oWrite.oldData=oWrite.getCurrData()
                                oWrite.id = resp["var"];
                            }
                            if( typeof cb == "function") {
                                cb.call(self,oWrite.id);
                            }
                        }
                    } catch(e) {
                       // parent.ch("oWrite.getComposeId", e);
                    }
                },
                failCall : function() {},
                msg : ""
            };
            parent.MM.mailRequestApi(reqData);
        }
    },
    /***
     * 加载写信页邮件信息
     */
    loadMailInfo : function() {
        var p = this;
        var mid = this.mid;
        var o = "readMail" + mid;
        var data = {};
        var isOk = true;
        var funcid = this.funcid;
        var msg = this.msg;

        var to = decodeURI(this.to);
        var tos = "";
        var tid = this.tid;
        var func = parent.gConst.func;
        var withAttachments = this.withAttachments;

        msg = decodeURIComponent(msg);
        //文件柜带密码过来
        msg = msg.encodeHTML();
        switch (funcid) {
            case func.compose:
                isOk = false;
                p.initData = {
                    to : to,
                    saveSentCopy: parent.CC.getSentSaveDefault(),
                    headers:{color: parent.gMain.curColor || 0},
                    content : msg
                };
                if(tid) {
                    oWrite.id = tid;
                    attach.init(tid);
                } else {
                    p.getComposeId(function(id) {
                        attach.init(id);
                    });
                }

                p.pageLoaded = true;
                p.fillMailData();
                p.firstLoad = false;
                break;
            case func.reply:
                //回复邮件
                data = {
                    mid : mid,
                    toAll : 0
                };
                if(withAttachments){
                    data.withAttachments = withAttachments;
                }
                p.isReply = true;
                isOk = true;
                break;
            case func.replyAll:
                //回复全部
                funcid = func.reply;
                data = {
                    mid : mid,
                    toAll : 1
                };
                if(withAttachments){
                    data.withAttachments = withAttachments;
                }
                p.isReplyAll = true;
                isOk = true;
                break;
            case func.forward:
                //转发邮件
                data = {
                    ids : [mid],
                    mode : "quote"
                };
                p.isForward = true;
                isOk = true;
                //如果是安全邮箱转发
                if( CC.isSecurityMail() ){
                    //获取免验证加密串再转发
                    CC.getSmailNoVerify(mid,function(d){
                        if(d['var']){
                            data.smailNoVerify = d['var'].smailNoVerify;
                            doRequestApi();
                        }
                    });
                    return;
                }
                break;
            case "forwardMore":
                //转发多封邮件
                funcid = func.forward;
                data = {
                    ids : parent.MM["folder"].data,
                    mode : "attach"
                };
                p.isForwardAll = true;
                isOk = true;
                //如果是安全邮箱转发
                if( CC.isSecurityMail() ){
                    //获取免验证加密串再转发
                    CC.getSmailNoVerify(mid,function(d){
                        if(d['var']){
                            data.smailNoVerify = d['var'].smailNoVerify;
                            doRequestApi();
                        }
                    });
                    return;
                }
                break;
            case "mbox:restoreDraft":
                //恢复草稿
                data = {
                    mid : mid
                };
                p.dragId = mid;
                p.isDrag = true;
                isOk = true;
                break;
            case "mbox:editMessage":
                data = {
                    mid : mid
                };
                p.isDrag = true;
                isOk = true;
                break;
            default:
                isOk = false;
                p.firstLoad = false;
                break;
        }

        if(isOk) {
            doRequestApi();
        }

        function doRequestApi(){
            var reqData = {
                func : funcid,
                data : data,
                call : function(resp) {
                    try {
                        if(resp.code == "S_OK") {
                            oWrite.id = resp["var"].id;
                            attach.init(oWrite.id);
                            p.initData = resp["var"];
                            p.pageLoaded = true;
                            p.fillMailData();
                            p.firstLoad = false;
                            oWrite.oldData=oWrite.getCurrData()


                        }
                    } catch(e) {
                        parent.ch("loadMailInfo error." + e);
                    }
                },
                failCall : function() {
                },
                msg : ""
            };
            parent.MM.mailRequestApi(reqData);
        }
    },
    //点击主题，获取系统下一个主题信息
    doSubjectClick : function() {
        $("txtsubject").value = this.sysSubject[this.subIndex];
        this.subIndex++;
        if(this.subIndex >= this.sysSubject.length) {
            this.subIndex = 0;
        }
    },
    //显示系统主题列表
    showSubjectList : function() {
        parent.El.show($("dvSubject"));
        var ev = parent.EV.getEvent() || window.event;
        parent.EV.stopEvent(ev);
    },
    setSubject : function(obj) {
        $("txtsubject").value = obj.innerHTML;
        parent.El.hide($("dvSubject"));
    },
    /**
     * 初始化定时邮件选择框
     * @param {Number} n 定时邮件的时间，一个标准utc时间秒数
     */
    initTimeSend : function(t) {
        var chk = $("chkDefiniteTime");
        var container = $("spanDefiniteTime");
        var html = [];
        var d = new Date(), i, item, defaultD = null;
        var p = this;
        if(t && t > 0) {
            defaultD = new Date(parseInt(t, 10) * 1000);
        }
        var year = d.getFullYear(), month = d.getMonth() + 1, day = d.getDate();
        var dYear = year, dMonth = month, dDay = day;
        var h = m = 0, dh = dm = 0; //d.getHours(), m = d.getMinutes();
        var days = this.getDays(year, month);

        dh = h = d.getHours(); dm = m = d.getMinutes();

        dm = Math.ceil(dm / 10) * 10;
        if(dm > 50){
            dm = 0;
            d = d.addMilliseconds(60*60*1000);
            dYear = d.getFullYear();
            dMonth = d.getMonth() + 1;
            dDay = d.getDate();
            dh = d.getHours();
        }

        if(defaultD){
            dYear = defaultD.getFullYear();
            dMonth = defaultD.getMonth() + 1;
            dDay = defaultD.getDate();
        }

        if(defaultD){
            dh = defaultD.getHours();
            dm = defaultD.getMinutes();
        }

        html.push('<a id="close_btn_definiteTime" href="javascript:fGoto();" class="i_t_close"><i></i></a>');
        html.push('<p class="m_clearfix"><select id="selYear">');
        for( i = year; i < year + 5; i++) {
            html.push('<option value="{0}" {1}>{2}</option>'.format(i, (i == dYear ? ' selected="true"' : ''), i));
        }
        html.push("</select><label for='selYear'>{0}</label>".format(Lang.Mail.Write.lb_timesend_year));
        html.push('<select id="selMonth">');
        for( i = 1; i < 13; i++) {
            html.push('<option value="{0}" {1}>{2}</option>'.format(i, (i == dMonth ? ' selected="true"' : ''), i));
        }
        html.push("</select><label for='selMonth'>{0}</label>".format(Lang.Mail.Write.lb_timesend_month));
        html.push('<select id="selDay">');
        for( i = 1; i <= days; i++) {
            html.push('<option value="{0}" {1}>{2}</option>'.format(i, (i == dDay ? ' selected="true"' : ''), i));
        }
        html.push("</select><label for='selDay'>{0}</label>".format(Lang.Mail.Write.lb_timesend_day));
        html.push('<select id="selHour">');
        for( i = 0; i < 24; i++) {
            html.push('<option value="{0}" {1}>{2}</option>'.format(i, (i == dh ? ' selected="true"' : ''), i));
        }
        html.push("</select><label for='selHour'>{0}</label>".format(Lang.Mail.Write.lb_timesend_hour));
        html.push('<select id="selMinute">');
        var minMinute = 10;
        if (typeof (timeInterval) !="undefined") {
            minMinute = timeInterval;
        }
        for( i = 0; i < 60; i+=minMinute) {
            html.push('<option value="{0}" {1}>{2}</option>'.format(i, (i == dm ? ' selected="true"' : ''), i));
        }
        html.push("</select><label for='selMinute'>{0}</label>".format(Lang.Mail.Write.lb_timesend_minute));
        html.push('</p>');
        html.push('<p id="time_define_container" class="m_clearfix"></p>');
        container.innerHTML = html.join("");
        if(t > 0) {
            chk.checked = true;
            container.style.display = "";
        }
        $('close_btn_definiteTime').onclick = function(e){
            $('chkDefiniteTime').click();
            parent.EV.stopEvent(e);
        };
        jQuery('#selYear, #selMonth, #selDay, #selHour, #selMinute').unbind('change').bind('change', function(e){
            if(jQuery(this).attr('id') == 'selMonth' || jQuery(this).attr('id') == 'selYear'){
                oWrite.changeDays();
            }
            p.setDefineTimeTips();
            p.needAutoSave = true;
            p.changed = true;
        });
        p.setDefineTimeTips();
    },
    /**
     * 设置定时邮件tips
     */
    setDefineTimeTips: function(){
        var p = this;
        var defineTime = p.getDefinenationTime();
        var diff = (new Date()).dateDiff(defineTime.dateTime);

        if(diff > 0){
            $('time_define_container').innerHTML = parent.Lang.Mail.tips020;
        }
        else{
            $('time_define_container').innerHTML = Lang.Mail.Write.timingToSendTip.format('<strong id="definite_time_diff_tip">' + oWrite.getMeaningfulDate(defineTime.year,defineTime.month,defineTime.day,defineTime.hour,defineTime.minute) + '</strong>');
        }
    },
    changeDays: function()
    {
        var objSelect = document.getElementById("selDay");
        objSelect.options.length = 0;
        var d1 = new Date($("selYear").value,$("selMonth").value,0);
         for (i = 1; i <= d1.getDate(); i++) {
            var varItem = new Option(i, i);
                objSelect.options.add(varItem);
        }
    },
    /**
     * 获取定时发送的时间
     */
    getDefinenationTime: function(){
        var y = $('selYear').options[$('selYear').options.selectedIndex].value;
        var m = $('selMonth').options[$('selMonth').options.selectedIndex].value;
        var d = $('selDay').options[$('selDay').options.selectedIndex].value;
        var h = $('selHour').options[$('selHour').options.selectedIndex].value;
        var mm = $('selMinute').options[$('selMinute').options.selectedIndex].value;

        return {
            dateTime: new Date(y + '/' + m + '/' + d + ' ' + h + ':' + mm + ':00'),
            year:   y,
            month:  m,
            day:    d,
            hour:   h,
            minute: mm
        };
    },
    /**
     * @param {int} y 年份
     * @param {int} m 月份
     * @param {int} d 日期
     * @param {int} h 小时
     * @param {int} mm 分钟
     * @return 返回有意义的时间提醒
     */
    getMeaningfulDate: function(y, m, d, h, mm){
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();

        y = parseInt(y);
        m = parseInt(m);
        d = parseInt(d);

        var result = [];

        if(y > year){
            if(m > month){
                result.push( (y - year) + Lang.Mail.Write.lb_timesend_year);
                if(d >= day){
                    result.push( (m - month) + Lang.Mail.Write.timesend_month);
                    if( d > day){
                        if(d - day < 10){
                            result.push(Lang.Mail.Write.Zero);
                        }
                        result.push( (d - day) + Lang.Mail.Write.Day);
                    }
                }
                else if(d < day){
                    if( m - month - 1 > 0 ){
                        result.push( (m - month - 1) + Lang.Mail.Write.timesend_month);
                    }
                    if( d + 30 - day < 10){
                        result.push(Lang.Mail.Write.Zero);
                    }
                    result.push( (d + 30 - day) + Lang.Mail.Write.Day);
                }
            }
            else{
                if(m == month){
                    if(d < day){
                        if( y - year - 1 > 0){
                            result.push( (y - year - 1) + Lang.Mail.Write.lb_timesend_year);
                        }
                        result.push( '11' + Lang.Mail.Write.timesend_month );
                    }
                    else{
                        result.push( (y - year) + Lang.Mail.Write.lb_timesend_year);
                    }
                }
                else{
                    if( y - year - 1 > 0){
                        result.push( (y - year - 1) + Lang.Mail.Write.lb_timesend_year);
                    }
                    if( d < day){
                        if(m + 12 - month - 1 > 0){
                            result.push( (m + 12 - month - 1) + Lang.Mail.Write.timesend_month);
                        }
                    }
                    else{
                        result.push( (m + 12 - month) + Lang.Mail.Write.timesend_month);
                    }
                }
                if(d < day){
                    d = d + 30
                }
                if( d > day){
                    if(d - day < 10){
                        result.push(Lang.Mail.Write.Zero);
                    }
                    result.push( (d - day) + Lang.Mail.Write.Day);
                }
            }
            result.push(Lang.Mail.Write.After);
        }
        else{
            if(y < year){
                return '';
            }
            if( m < month){
                return '';
            }
            else if( m == month ){
                if( d < day ){
                    return '';
                }
                if( d == day ){
                    result.push(Lang.Mail.Write.Today);
                }
                else if( d - day == 1){
                    result.push(Lang.Mail.Write.Tomorrow);
                }
                else if( d - day == 2){
                    result.push(Lang.Mail.Write.afterTomorrow);
                }
                else{
                    result.push( (d - day) + Lang.Mail.Write.Day + Lang.Mail.Write.After);
                }
            }
            else{
                if( d > day ){
                    result.push( m - month + Lang.Mail.Write.timesend_month);
                    if( d - day < 10){
                        result.push(Lang.Mail.Write.Zero);
                    }
                    result.push( (d - day) + Lang.Mail.Write.Day + Lang.Mail.Write.After);
                }
                else if( d == day ){
                    result.push( (m - month) + Lang.Mail.Write.timesend_month + Lang.Mail.Write.After);
                }
                else{
                    if( m - month - 1 > 0){
                        result.push( (m - month - 1) + Lang.Mail.Write.timesend_month);
                        if( d + 30 - day < 10){
                            result.push( Lang.Mail.Write.Zero )
                        }
                        result.push( (d + 30 - day) + Lang.Mail.Write.Day + Lang.Mail.Write.After);
                    }
                    else{
                        if( d + 30 - day == 1){
                            result.push(Lang.Mail.Write.Tomorrow);
                        }
                        else if( d + 30 - day == 2 ){
                            result.push(Lang.Mail.Write.afterTomorrow);
                        }
                        else{
                            result.push( (d + 30 - day) + Lang.Mail.Write.Day + Lang.Mail.Write.After);
                        }
                    }
                }
            }
        }

        result.push(h + ':' + ('0' + mm).right(2));
        return result.join('');
    },
    getDays : function(year, month) {
        var date = new Date();
        date.setFullYear(year);
        date.setDate(1);
        date.setMonth(month);
        date.setDate(0);
        var days = date.getDate();
        return days;
    },
    getDefiniteTime : function() {
        if($("chkDefiniteTime").checked) {
            var d = new Date($("selYear").value, $("selMonth").value - 1, $("selDay").value, $("selHour").value, $("selMinute").value);
            return d.getTime() / 1000;
        } else {
            return 0;
        }
    },
    showDefiniteTime : function() {
        var chk = $("chkDefiniteTime");
        var container = $("spanDefiniteTime");
        if(chk.checked) {
            container.style.display = "";
        } else {
            container.style.display = "none";
        }
        this.needAutoSave = true;
        this.changed = true;
        this.setSize();
    },
    /***
     * 获取写信的对象
     * @param {Object} isDraft boolean 是否存草稿
     */
    doMailInfo : function(isDraft,callback) {
        var p = this;
        var isOk = true;
        var fromObj = $("selFrom");
        var ma = [];
        var oto = $("rib_input_1"), ocs = $("rib_input_2"), oms = $("rib_input_3");
        var to = '', csto = '', msto = '';
        var title = oWrite.isDefaultSubject ? '' : $("txtsubject").value.trim();
        //主题
        var showOneRcpt = p.isLookAllAsSingle ? 1 : 0;
        //是否群发单显
        var priority = $("chkUrgent").checked ? parent.GE.priority.hight : parent.GE.priority.common;
        //是否重要
        var requestReadReceipt = $("chkReceipt").checked ? 1 : 0;
        //是否需要回执
        var saveSentCopy = $("chkSaveToSentBox").checked ? 1 : 0;
        //保存到发件箱
        var content = Editor.getEditorValue().replace(/<span[^<]+class=['"]?errorWord['"]?[^>]+>([^<]*)<\/span\s*>/gi,'$1') || "Lang.Mail.Write.zxhyjcs#ckbAutoDestroy").prop("checked")) {
                keepFlag = 2;
            } else if (jQuery("#ckbDaysDestroy").prop("checked")) {
                keepFlag = 1;
                keepDay = jQuery("#inputReadDaysLang.Mail.Write.fxzxhxtjfj#attachContainer").find(".zz_comb").length > 0) {
                parent.CC.alert("为了保证邮件及附件的安全性，自销毁邮件不允许添加附件，请您删除附件后再发送。", null, "系统提示");
                parent.CC.hideMsg();
                return false;
            }

            if(p.ribs[0].getErrorText()){
                var tip = new ToolTips({
                    id: 'recepitent_tips',
                    direction: ToolTips.direction.Bottom
                });
                tip.show($('rib_input_1'), parent.Lang.Mail.tips021);
                parent.CC.hideMsg();
                isOk = false;
                p.personErrTips = tip;
                return false;
            }
            var bto = p.checkMail(to, oto, Lang.Mail.Write.Receiper);
            if(bto) {
                for(var i=0,l=bto.length;i<l;i++){
                    tmpName = MailTool.getName(bto[i]);
                    if(tmpName.length > 20){
                        bto[i] = bto[i].replace(tmpName, tmpName.substr(0,20));
                    }
                }
                ma = ma.concat(bto);
                to = bto.join(",");
                var bcs = p.checkMail(csto, ocs, Lang.Mail.Write.titleCS);
            } else {
                return;
            }
            if(bcs) {
                for(var i=0,l=bcs.length;i<l;i++){
                    tmpName = MailTool.getName(bcs[i]);
                    if(tmpName.length > 20){
                        bcs[i] = bcs[i].replace(tmpName, tmpName.substr(0,20));
                    }
                }
                ma = ma.concat(bcs);
                csto = bcs.join(",");
                var bms = p.checkMail(msto, oms, Lang.Mail.Write.titleMS);
            } else {
                return;
            }
            if(bms) {
                for(var i=0,l=bms.length;i<l;i++){
                    tmpName = MailTool.getName(bms[i]);
                    if(tmpName.length > 20){
                        bms[i] = bms[i].replace(tmpName, tmpName.substr(0,20));
                    }
                }
                ma = ma.concat(bms);
                msto = bms.join(",");
            } else {
                return;
            }
            if(ma.length == 0 || bto.length == 0) {
                var tip = new ToolTips({
                    id: 'recepitent_tips',
                    direction: ToolTips.direction.Bottom
                });
                tip.show($("rib_input_1"), Lang.Mail.Write.receiperAddr);
                RichInputBox.Tool.blinkBox(jQuery("#recipient_container div:first"), 'blinkColor');
                parent.CC.hideMsg();
                p.personErrTips = tip;
                isOk = false;
                return false;
            }
            if (parent.GE) {
                parent.GE["recipients_"+oWrite.composeId] = ma;
            }
            if(ma.length > this.toMaxNum) {
                var tip = new ToolTips({
                    id: 'recepitent_tips',
                    direction: ToolTips.direction.Bottom
                });
                tip.show($("rib_input_1"), Lang.Mail.Write.addrCount.format(this.toMaxNum));
                parent.CC.hideMsg();
                p.personErrTips = tip;
                if(p.titleErrTips && p.titleErrTips instanceof ToolTips){
                    p.titleErrTips.close();
                    p.titleErrTips = null;
                }
                isOk = false;
                return false;
            }
            if(!checkSchedule()){
                isOk = false;
                return false;
            }

            if(title == "") {
                var tip = new ToolTips({
                    id: 'subject_tips',
                    type: ToolTips.type.Confirm,
                    ok: function(){
                        if(!checkSchedule()){
                            isOk = false;
                            return false;
                        }
                        title = Lang.Mail.Write.comeFrom + ":" + oWrite.userNumber;
                        isOk = true;
                        oWrite.doBtnStatus(true, WriteState.send);
                        send(callback);
                    },
                    cancel: function(){
                        $("txtsubject").focus();
                    }
                });
                tip.show($("txtsubject"), Lang.Mail.Write.confirmTitle);
                RichInputBox.Tool.blinkBox(jQuery("#dvSubject").parent(), 'blinkColor');
                parent.CC.hideMsg();
                p.titleErrTips = tip;
                isOk = false;
                return false;
            }
            if(isOk) {
                return send(callback);
            }
        } else {
            return send(callback);
        }

        function checkSchedule(){
            if(p.isSchedule && (new Date()).dateDiff(p.getDefinenationTime().dateTime) > 0){
                CC.alert(parent.Lang.Mail.tips020);
                parent.CC.hideMsg();
                return false;
            }
            return true;
        }

        function getAllName (mail) {
            var name = parent.gMain.trueName || "";

            return name.encodeHTML() + "&lt;" + mail + "&gt;";
        }
        function getMailInfo(){

        }

        function send(callback) {
            var sm = ma.join(",");
            var obj = $("selFromLang.Mail.Write.zwbsjmybqm#numberSign");
            var nEncrypt = jQuery("#numberEncrypt");
            
            if( nSign.is(":checked") &&  nEncrypt.is(":checked") ){
                smailType = 3;
            }else if(nSign.is(":checked")){
                smailType = 1;
            }else if(nEncrypt.is(":checked")){
                smailType = 2;
            }
            
            parent.CC.writeUserAttributesToServer({"cruAliasName": account});
            account = getAllName(account).decodeHTML().replace(/&#034;/g, "Lang.Mail.Write.xxcssmjmyj",
                headers:{"X-RM-FontColor"+Lang.Mail.Write.tjzxhgldfj+"<oFiles.length;i++){
                        if(!oFiles[i].isAttachForward){
                            objfiles.push(oFiles[i]);
                        }
                    }
                }
                if(objfiles && objfiles.length > 0) {
                    var strTemp = "<li style=\"float:left; margin:5px 45px 5px 0; border: 1px solid #fff; \" file_name=\"{0}\">" +
                                  "<div style=\"position:relative; width:240px; padding:5px; overflow:hidden;\" >" +
                                  "<a href=\"{2}\" target=\"_blank\" style=\"float:left; display:block; padding:6px 4px 4px; margin-right:2px;\"><img src=\"{3}\" alt=\"{0}\" style=\"border:none;\" type=\"extral-img\" /></a>" +
                                  "<dl style=\"margin:2px;overflow:hidden; zoom:1;\">" +
                                  "<dt style=\"font-size:12px;overflow: hidden; color:#333;\" title=\"{0}({4})\"><span style='overflow: hidden;text-overflow: ellipsis;white-space: nowrap;  display:inline-block; vertical-align:middle;'>{5}</span>{6}<span style=\"color:#666;\">({4})</span></dt>" +
                                  "<dd style=\" margin:0;\"><a href=\"{2}\" target=\"_blank\" style=\"color: #014282;text-decoration: none; font-size:12px;\">{1}</a>{7}</dd>" +
                                  "</dl></div></li>";

                                  //{0}&nbsp;<a href=\"{2}\" target=\"_blank\">{1}</a>&nbsp;(URL：<a href=\"{2}\" target=\"_blank\">{2}</a>)</li>";
                    var strDf = "<div class=\"attrBody\" style=\"border:2px solid #e9e9e9; margin-top:12px;\">";
                    strDf += '<h3 style="background:#e9e9e9; height:32px; line-height:32px; padding-left:10px; margin:0; color:#666; font-weight:bold; font-size:13px;">' + parent.gMain.trueName + parent.Lang.Mail.tips022 + '</h3>'
                    strDf += '<div class="attr-ul-wrap" style="padding:15px; background:#fff;">';
                    strDf += "<ul id='disk_attach_file_list_for_readmail' style=\"padding:0; margin:0;list-style:none; overflow:hidden; zoom:1;\">";
                    for(var ifile = 0; ifile < objfiles.length; ifile++) {
                        var ofile = objfiles[ifile];
                        if(ofile) {
                            fileSize = ofile.size || 0;
                            var fileType ="",filename=ofile.name;
                            var shareTime = ofile.shareTime ? ' <span style="font-size:12px;">(' + ofile.shareTime + ' '+ parent.Lang.Mail.tips023+')</span>' : '';
                            if(filename.indexOf(".")>0)
                            {
                                fileType = '.' + p.getFileType(filename);
                                filename = filename.substring(0,filename.lastIndexOf("."));
                            }
                            strDf += strTemp.format(ofile.name, Lang.Mail.Write.download, ofile.url, p.getFileImg(ofile.name), p.formatSize(fileSize),filename.left(10, true),fileType, shareTime);
                        }
                    }
                    strDf += '</ul>';
                    strDf += '</div></div>';
                    var reg = /<DIV\s*id="divsignature">/i;
                    if(reg.test(content)) {
                        content = content.replace(reg, strDf + "<DIV id='divsignature'>");
                    } else {
                        content += strDf;
                    }
                    mailInfo.content = content;
                }
            }

            p.sendMail(mailInfo, isDraft,callback);

            //保存联系人
            function insertEmail(sm) {
                /*
                var url = GC.rfUrl(p.dataUrl + sm);
                parent.CC.requestWebApi(url, function() {
                    CC.synData(null, "common_addr");
                });
                */
            }

            return true;
        }
    },
    /**
     * 格式化文件大小
     */
    formatSize:function(size,num){
        num = num || 2;
        return parent.Util.formatSize(size,null,num);
    },
    //发信之前的判断附件
    doSend : function(obj) {
        var reg = /附件/;
        var subject = jQuery('#txtsubject').val();
        var content = Editor.getEditorValue();
        var  isSend = false; 
        var attachList = jQuery("#attachContainer").find(".uploadFile_name");
        //未添加附件，并且正文或标题中包含"附件"字样
        if ((subject.match(reg) || content.match(reg))&& jQuery("#attachContainer").find(".zz_comb").length == 0) {
            CC.confirm(Lang.Mail.Write.ndyjzfjxfs, function() {  
                oWrite.confirmDoSend(obj);
            });
        } else {
            oWrite.confirmDoSend(obj);
        }
    },
    //确认发信
    confirmDoSend : function(obj) {
        if(oWrite.doStatusMessage()) {
              //是否通过配置关闭密级邮件，关闭后，密级邮件属性不处理
              var offSecurity = window.mailSecurityOff || "false";
              //附件密级是否高于邮件密级
              if (GC.check('MAIL_INBOX_SECURITY')==1 && offSecurity!="true") {
                //邮件密级,公开0, 秘密1, 机密2
                var mailSecLevel = 0;
                if (Plugins.find('securityMail')&&Plugins.find('securityMail').result) {
                    mailSecLevel = Plugins.find('securityMail').result.level || 0;
                }
                if (mailSecLevel < 0)
                {
                    CC.showMsg(Lang.Mail.Write.qxzyjmj, true, false, "error");
                    return false;
                }
                var ArraySecLevel = [Lang.Mail.Write.gongkai,Lang.Mail.Write.mimi,Lang.Mail.Write.jimi];
                var attachFiles = jQuery("#attachContainer").find(".uploadFile_name");
                if (attachFiles && attachFiles.length > 0) {
                    for (var i = 0; i < attachFiles.length; i++){
                        var tempFileName = attachFiles[i].innerHTML;
                        var attachSecLevel = -1;
                        
                        //获取当前附件的密级
                        for (var j = 0; j < ArraySecLevel.length; j++){
                            var matchResult = tempFileName.match(/公开|秘密|机密/g);
                            if (!matchResult || matchResult.length != 1)
                            {
                                CC.showMsg(Lang.Mail.Write.fjmjbmzdyg, true, false, "error");
                                return false;
                            }
                            if (ArraySecLevel[j] == matchResult[0]) {
                                attachSecLevel = j;
                                break;
                            } 
                        }
                        if (attachSecLevel > mailSecLevel || attachSecLevel == -1) {
                            CC.showMsg(Lang.Mail.Write.fjmjbbszfs, true, false, "error");
                            return false;
                        }
                    }
                }
            }
            
            if(PageState == PageStateTypes.Uploading) {
                parent.CC.alert(Lang.Mail.Write.notSendMail + "!");
            } else if(oWrite.denyForward == 1 && (!oWrite.checkDenyForwardAttach())){
                parent.CC.alert(('<div style="text-indent:2em; margin-bottom:12px;">'+parent.Lang.Mail.tips024+'</div><div style="text-indent:2em;">'+parent.Lang.Mail.tips025+'</div>').format(oWrite.denyForwardAttachTypes.replace(/\|/g, '、')));
            } else if (!oWrite.isShowBigAttachTips && oWrite.denyForward == 1 && parent.GE.diskFiles[oWrite.composeId] && parent.GE.diskFiles[oWrite.composeId].length > 0) {
                var ao = {
                    id: 'confirm_denyForward2',
                    title: Lang.Mail.Write.xitongtishi,
                    type: 'div',
                    text: "<div style='padding:15px;'>"+Lang.Mail.Write.ndyjyfjxfs+"</div>",
                    changeStyle: false,
                    zindex: 1090,
                    dragStyle: 1,
                    width: 400,
                    buttons: [{
                        text: Lang.Mail.Ok,
                        clickEvent: function () {
                            oWrite.isShowBigAttachTips = true;
                            oWrite.doSend();
                        }
                    }, {
                        text: Lang.Mail.Cancel,
                        clickEvent: function() {},
                        isCancelBtn: true
                    }]
                };
                CC.msgBox(ao);
            }
//            else if(oWrite.filterKeywords){
//                // 开启了敏感词过滤时，进行敏感词逻辑
//                if(oWrite.highLightResult && !oWrite.checkEmptyObject(oWrite.highLightResult.keys)){
//                    // 给出对话框提示用户选择操作
//                    oWrite.showConfirmDialog();
//                }
//                else{
//                    oWrite.justSendMail();
//                }
//          }
            else if(oWrite.checkEncryptMail()){
                // 开启了加密邮件
                if(oWrite.encryptMailClass.checkPassword()){
                    oWrite.showEncryptConfirmDialog();
                }
            } else {
                oWrite.justSendMail();
            }
        }
    },
    //保存草稿
    doSave : function(obj) {
        if(oWrite.doStatusMessage()) {
            if(PageState == PageStateTypes.Uploading){
                parent.CC.alert(Lang.Mail.Write.uploadWaiting + "!");
            }
            else{
                if(typeof obj == 'object'){
                    this.saveDraftType = 'hand';
                    parent.CC.showMsg(Lang.Mail.Write.savingToDraft, false, false, "loading");
                }
                else{
                    this.saveDraftType = 'auto';
                }
                // 捕获位置异常
                this.doBtnStatus(true, WriteState.save);
                try{
                    if(this.checkEncryptMail()){
                        if(this.encryptMailClass.checkPassword()){
                            this.sendWay = 3;
                            this.encryptCode = this.encryptMailClass.pwd;
                            save(this);
                        }
                    }else{
                        save(this);
                    }
                }
                catch(e){

                }
            }
        }

        function save(obj){
            if(!obj.doMailInfo(true)) {
                obj.doBtnStatus(false, WriteState.none);
            }
        }
    },
    /**
     * 执行插件检查
     */
    justSendMail: function(){
        var hasPlugin = false;
        if(this.plugins){
            for(var i=0;i<this.plugins.length;i++){
                if(Plugins.able(this.plugins[i].name)){
                    hasPlugin = true;
                    Plugins.find(this.plugins[i].name).sendBefore(oWrite);
                }
            }
            if(!hasPlugin){
                oWrite.onlySendMail();
            }
        }
        else{
            oWrite.onlySendMail();
        }
    },
    /**
     * 仅仅执行发送邮件操作
     */
    onlySendMail: function(){
        parent.CC.showMsg(Lang.Mail.Write.emailIsSendingNow, false, false, "loading");
        // 捕获位置异常
        this.doBtnStatus(true, WriteState.send);
        try{
            if(!this.doMailInfo()) {
                this.doBtnStatus(false, WriteState.none);
            }
        }
        catch(e){

        }
    },
    /**
     * 校验是否需要进行机密发送
     */
    checkEncryptMail: function(){
        if(this.encryptMail){
            if(this.encryptMailClass && this.encryptMailClass.control.chkbox[0].checked){
                return true;
            }
            else{
                return false;
            }
        }
        return false;
    },
    /**
     * 发出确认对话框
     */
    showConfirmDialog: function(){
        var p = this;
        var ao = {
            id: 'confirm_filter_keywords',
            title: parent.Lang.Mail.Write.sysPrompt,
            text: wrapText(parent.Lang.Mail.tips026),
            type: 'text',
            zindex: 10001,
            buttons: [{text:parent.Lang.Mail.tips027,clickEvent:deleteKeyWords, 'class':'n_btn mt_8'},
                //{text:parent.Lang.Mail.tips028,clickEvent:goAhead, 'class': 'n_btn mt_8'},
                {text: parent.Lang.Mail.tips029,clickEvent:withPassword, 'class': 'n_btn mt_8'}]
        };

        // 删除涉密信息
        function deleteKeyWords(){
            var subject = jQuery('#txtsubject');
            var content = Editor.getEditorValue();
            Editor.setEditorValue(oWrite.highLightWords(content,'**'));
            subject.val(oWrite.highLightWords(subject.val(), '**'));
            oWrite.highLightResult.keys = {};
        }

        // 继续发送
        function goAhead(){
            parent.CC.alert(wrapText(parent.Lang.Mail.tips030), function(){
                p.sendWay = 1;
                p.justSendMail();
            });
        }

        // 加密发送
        function withPassword(){
            if (p.isAutoDestroy) {
                var ao = {
                    "id" : "confirm-autodestroy",
                    "title": parent.Lang.Mail.Write.sysPrompt,
                    "type": "text",
                    "width": 460,
                    "text" : Lang.Mail.Write.nyjszszzfs,
                    "zindex": 20011,
                    "dragStyle": 1,
                    "buttonType": "confirm",
                    "buttons" : [{
                        "text": Lang.Mail.Cancel,
                        "clickEvent": function () {},
                        "isCancelBtn": true
                    }]        
                };
                parent.CC.msgBox(ao);
            } else {
                parent.CC.alert(wrapText(getPasswordText()), function(){
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
                        p.sendWay = 2;
                        p.encryptCode = pwd;
                        p.justSendMail();
                    }
                });
            }
        }

        // 统一使用标签包裹
        function wrapText(text){
            return '<div style="padding: 0px 12px; line-height:24px;">' + text + '</div>';
        }

        // 获取加密方式发送邮件的文本
        function getPasswordText(){
            var s = parent.Lang.Mail.tips032 + '<br/>';
            s+= parent.Lang.Mail.tips033 + '：<input type="password" id="security_password" class="" /><br/>';
            s+= parent.Lang.Mail.tips034 + '：<input type="password" id="security_repassword" class="" />';

            return s;
        }

        parent.CC.msgBox(ao);
    },
    /**
     * 139企邮加密邮件对话框
     */
    showEncryptConfirmDialog: function(){
        var p = this;
        var text = '<div class="encript_popc"><i class="i-exclam" style=""></i>'+parent.Lang.Mail.tips035+''+parent.Lang.Mail.tips036+'</div>';
        var ao = {
            id: 'confirm_encrypt_mail',
            title: parent.Lang.Mail.Write.sysPrompt,
            text: text,
            type: 'text',
            zindex: 10001,
            buttons: [{text:parent.Lang.Mail.tips037,clickEvent:encryptMail, 'class':'n_btn mt_8'},{text:parent.Lang.Mail.tips038,clickEvent:directSend, 'class': 'n_btn mt_8'}]
        };

        // 加密并发送
        function encryptMail(){
            p.sendWay = 3;
            p.encryptCode = p.encryptMailClass.pwd;
            p.justSendMail();
        }

        // 直接发送不加密
        function directSend(){
            p.justSendMail();
        }

        parent.CC.msgBox(ao);
    },
    doStatusMessage : function() {
        if(oWrite.status == 1) {
            CC.alert(Lang.Mail.Write.sendingMailWait);
        } else if(oWrite.status == 2) {
            CC.alert(Lang.Mail.Write.saveingDraftWait);
        } else {
            return true;
        }
    },
    // 预览窗口；包含签名；
    doPreview : function(i) {
        var url = parent.gConst.composeReviewUrl;
        window.open(url, "Preview", "toolbar=no,menubar=no,location=no,resizable=yes,scrollbars=yes,menubar=no,width=800,height=600,top=30,left=50");
    },
    doBtnStatus : function(disable, status) {
        var btn1 = $(oWrite.btnSendId);
        var btn2 = $(oWrite.btnSaveId);
        var btn3 = $(oWrite.btnCancelId);
        var tbtn1 = parent.$(CC.getCurLabId() + '_' + oWrite.btnSendId);
        var tbtn2 = parent.$(CC.getCurLabId() + '_' + oWrite.btnSaveId);
        var tbtn3 = parent.$(CC.getCurLabId() + '_' + oWrite.btnCancelId);
        if(disable) {
            if(btn1 && btn1.disabled){
                btn1.disabled = true;
            }
            if(tbtn1 && tbtn1.disabled){
                tbtn1.disabled = true;
            }
            if(btn2 && btn2.disabled){
                btn2.disabled = true;
            }
            if(tbtn2 && tbtn2.disabled){
                tbtn2.disabled = true;
            }
            if(btn3 && btn3.disabled){
                btn3.disabled = true;
            }
            if(tbtn3 && tbtn3.disabled){
                tbtn3.disabled = true;
            }
            oWrite.status = status;
            oWrite.sendLock = window.setTimeout(function() {
                if(oWrite.status == WriteState.none) {
                    oWrite.doBtnStatus(false);
                }
            }, oWrite.unlockTime * 1000);
        } else {
            if(btn1 && btn1.disabled){
                btn1.disabled = false;
            }
            if(btn2 && btn2.disabled){
                btn2.disabled = false;
            }
            if(btn3 && btn3.disabled){
                btn3.disabled = false;
            }
            if(tbtn1 && tbtn1.disabled){
                tbtn1.disabled = false;
            }
            if(tbtn2 && tbtn2.disabled){
                tbtn2.disabled = false;
            }
            if(tbtn3 && tbtn3.disabled){
                tbtn3.disabled = false;
            }
            oWrite.status = WriteState.none;
        }
    },
    /**
     * 获取扩展名对应的图片
     */
    getFileImg: function(src){
        var resourceRoot =parent.gMain.resourceRoot;
        if(resourceRoot.length>=4 && resourceRoot.substr(0,4).toLocaleLowerCase()!="http")
        {
            resourceRoot= window.location.protocol + "//" + window.location.host+resourceRoot;
        }
        var imgServer = resourceRoot + '/images/fileExt/';
        var ext = this.getFileType(src);
        var imgName = 'other';
        var maps = {
            "other": 'other', "tif": 'jpg', "txt": 'txt', "psd": 'psd',
            "rar": 'rar',"7z":'rar', "zip": 'rar', "xml": 'xml', "html": 'html',
            "java": 'other', "fon": 'ttf', "jpg": 'jpg', "gif": 'jpg',
            "png": 'jpg', "bmp": 'jpg',"tiff": 'jpg', "mpeg": 'jpg',
            "avi": 'media', "wmv": 'media', "mov": 'media', "mpg": 'media',
            "vob": 'media', "rmvb": 'media', "mp3": 'mp3', "wma": 'mp3',
            "wav": 'mp3', "asf": 'mp3', "mp4": 'mp3', "sis": 'other',
            "sisx": 'other', "cab": 'other', "doc": 'doc', "docx": 'doc',
            "pdf": 'pdf', "xls": 'xls', "xlsx": 'xls', "ppt": 'ppt',
            "pptx": 'ppt', "swf": 'swf', "fla": 'swf', "share": 'other',
            "upload": 'upload', "flv": 'media', "exe": 'exe', "css": 'css',
            "rm": 'media', "midi": 'media', "chm": 'txt', "iso": 'iso',
            "vsd": 'other'
        };

        if(maps.hasOwnProperty(ext)){
            imgName = maps[ext]
        }

        return imgServer + imgName + '.png';
    },
    /**
     * 获取文件的扩展名
     */
    getFileType: function(src){
        var filename = src.toLowerCase();

        if(filename.indexOf('.') > 0){
            return filename.substr(filename.lastIndexOf('.')+1);
        }
        return "";
    },
    /**
     * 判断对象是否为空对象
     * @param obj
     * @return {boolean}
     */
    checkEmptyObject: function(obj){
       for(var k in obj){
           if(k && obj[k]){
               return false;
           }
       }
       return true;
    },
    /**
     *
     * @param s
     * @param obj
     * @param to
     * @return {*}
     */
    checkMail : function(s, obj, to) {
        var ret = parent.Email.get(s, true);
        var noEmail = ret.fail;
        var suc = ret.success.toArray();
        var sizeErrorArr = [];
        var mailName = '';
        for(var i=0,l=suc.length;i<l;i++){
            mailName = MailTool.getAddr(suc[i]);
            if(mailName.length > 59){
                sizeErrorArr.push(suc[i]);
            }
        }
        if(noEmail.length > 0) {
            var text = noEmail.join("<br>");
            parent.CC.hideMsg();
            var tip = new ToolTips({
                id: obj.id,
                direction: ToolTips.direction.Bottom
            });
            tip.show(obj, parent.Lang.Mail.tips039);
            return false;
        } else if(sizeErrorArr.length > 0){
            var text = sizeErrorArr.join('<br>');
            parent.CC.hideMsg();
            var tip = new ToolTips({
                id: obj.id,
                direction: ToolTips.direction.Bottom
            });
            tip.show(obj, parent.Lang.Mail.tips040);
            return false;
        }
        else{
            return suc;
        }
    },
    /**
     * 扫面，记录，处理敏感词
     */
    dealSensitiveMail: function(){
        oWrite.highLightResult = {};
        var subject = jQuery('#txtsubject').val();
        var content = Editor.getEditorValue();
        var newContent = oWrite.highLightWords(content);
        var attachFileNames = [], results = {}, keys = {}, diskFiles = parent.GE.diskFiles ? parent.GE.diskFiles[oWrite.composeId] : [];
        var attachFiles = attach.data;
        if(diskFiles && diskFiles.length){
            for(var i=0;i<diskFiles.length;i++){
                attachFileNames.push(diskFiles[i].name);
            }
        }
        if(attachFiles.length){
            for(var i=0;i<attachFiles.length;i++){
                attachFileNames.push(attachFiles[i].fileName);
            }
        }
        if(!Editor.getEditorMode()){
            newContent = content; // 纯文本模式不支持高亮关键字
        }
        Editor.setEditorValue(newContent);
        // 记录内容中命中的关键字
        if(!oWrite.checkEmptyObject(oWrite.highLightResult)){
            results['content'] = oWrite.highLightResult.keys;
            for(var k in results['content']){
                keys[k] = results['content'][k];
            }
            oWrite.highLightResult = {};
        }

        oWrite.highLightWords(subject);
        // 记录标题中命中的关键字
        if(!oWrite.checkEmptyObject(oWrite.highLightResult)){
            results['title'] = oWrite.highLightResult.keys;
            for(var k in results['title']){
                keys[k] = results['title'][k];
            }
            oWrite.highLightResult = {};
        }

        if(attachFileNames.length){
            oWrite.highLightWords(attachFileNames.join(','));
            if(!oWrite.checkEmptyObject(oWrite.highLightResult)){
                results['attach'] = oWrite.highLightResult.keys;
                for(var k in results['attach']){
                    keys[k] = results['attach'][k];
                }
                oWrite.highLightResult = {};
            }
        }

        oWrite.highLightResult = {
            keys: keys
        };
        oWrite.highLightKeysForLog = results;
    },
    /**
     * 更新编辑器需要的更新
     */
    updateStatus: function(){
        this.needAutoSave = true;
        this.changed = true;
    },
    /**
     * @desc 发送信件失败回调函数
     * @param resp 写信接口返回参数
     * @param url 地址
     * @param isDraft 是否保存到草稿箱
     */
    composeFailCallback: function(resp, url,isDraft) {
        var p = this;
        var errorMsg = "";
        isDraft = isDraft || 0;
        p.doBtnStatus(false, 0);
        PageState = PageStateTypes.Common;
        var code = resp.code;
        if ((typeof isOpenSgcc !== "undefined" && isOpenSgcc === "true") && code === "FA_IS_SPAM_IP_CON_DENY") {
            this.sensConfirm(resp);
            return false;
        }
        switch(code) {
        case "FA_ATTACH_EXCEED_LIMIT":
            errorMsg = Lang.Mail.Write.attachmentSize;
            break;
        case "FA_RECEIVER_EXCEED_LIMIT":
            errorMsg = Lang.Mail.Write.ReceiverLimit;
            break;
        case "FA_ID_NOT_FOUND":
            errorMsg = Lang.Mail.Write.composeid;
            break;
        case "FA_FORBIDDEN":
            errorMsg = Lang.Mail.Write.forbidden;
            break;
        case "FA_OVERFLOW":
            errorMsg = Lang.Mail.Write.Overflow;
            break;
        case "FA_NO_RECEIPT":
            errorMsg = Lang.Mail.Write.NoReceipt;
            break;
        case "FA_WRONG_RECEIPT":
            errorMsg = Lang.Mail.Write.WrongReceipt;
            break;
        case "FA_INVALID_DATE":
            errorMsg = Lang.Mail.Write.noTime;
            break;
        case "FA_NEED_VERIFY_CODE":
            errorMsg = Lang.Mail.Write.needCode;
            break;
        case "FA_INVALID_VERIFY_CODE":
            errorMsg = Lang.Mail.Write.codeErr;
            break;
        case "FA_INVALID_ACCOUNT":
            errorMsg = Lang.Mail.Write.accountErr;
            break;
        case "FA_IS_SPAM":
            errorMsg = Lang.Mail.Write.MailAsSpan;
            CC.alertNoSysClose(Lang.Mail.Write.nknmyjchfs, {}, Lang.Mail.Write.xitongtishi);
            return;
            break
        case "FA_INVALID_PARAMETER":
            errorMsg = Lang.Mail.Write.ParamErr;
            break;
        case "FA_FORBIDDEN_FORWARD_OUT_USER":
            errorMsg = Lang.Mail.tips041;
            break;
        case "FA_IS_SPAM_SENSIT_WORD":
            // 命中敏感词，需要提示用户选择处理方式
            oWrite.dealSensitiveMail();
            oWrite.showConfirmDialog();
            return;
            break;
        default:
            errorMsg = resp.summary || Lang.Mail.sysW;
        }

        if(top.IsDebug) {
            errorMsg += " code:" + (code || "") + " msg:" + (resp["var"] || resp["summary"] || "");
        }
        if(isDraft) {
            errorMsg = (p.isAutoSave ? Lang.Mail.Write.autoSaveFail : Lang.Mail.Write.draftSaveFail) + "," + errorMsg;
        } else {
            errorMsg = errorMsg.replace(/\n/g, '<br />');
        }
        CC.showMsg(errorMsg, true, false, 'error');
        top.Util.writeLogError(top.gConst.logFunc.js, url || "", "method=oWrite.composeFailCallback.composeFailCallback | code=" + code + " | summary=" + errorMsg + (resp["var"] || ""));
    },
    sensConfirm: function (resp) {
        var me = this,
            ao = {
                "id" : "confirmSens",
                "title": Lang.Mail.Write.xitongtishi,
                "type": "text",
                "width": 460,
                "text" : Lang.Mail.Write.nzbgqcynyh,
                "zindex": 20011,
                "dragStyle": 1,
                "buttonType": "confirm",
                "buttons" : [{
                    "text": Lang.Mail.Ok,
                    "clickEvent": function () {
                        me.modInDomainItem(resp);
                    }
                },{
                    "text": Lang.Mail.Cancel,
                    "clickEvent": function () {},
                    "isCancelBtn": true
                }]        
            };

        CC.msgBox(ao);
    },
    modInDomainItem: function (resp) {
        var me = this,
            tmpAllTxt = "",
            to = "",
            csto = "",
            msto = "",
            k;

        if (me.ribs[0]) {
            for (k in me.ribs[0].items) {
                tmpAllTxt = me.ribs[0].items[k].allText;
                if (!me.checkLocal(resp, me.ribs[0].items[k].addr)) {
                    to +=  tmpAllTxt + ';';
                }
            }
            me.ribs[0].clear();
            me.ribs[0].insertItem(to);
        }
        if (me.isCC && me.ribs[1]) {
            for (k in me.ribs[1].items) {
                tmpAllTxt = me.ribs[1].items[k].allText;
                if (!me.checkLocal(resp, me.ribs[1].items[k].addr)) {
                    csto +=  tmpAllTxt + ';';
                }
            }
            me.ribs[1].clear();
            me.ribs[1].insertItem(csto);
        }
        if (me.isSCC && me.ribs[2]) {
            for (k in me.ribs[2].items) {
                tmpAllTxt = me.ribs[2].items[k].allText;
                if (!me.checkLocal(resp, me.ribs[2].items[k].addr)) {
                    msto += tmpAllTxt + ';';
                }
            }
            me.ribs[2].clear();
            me.ribs[2].insertItem(msto);
        }
    },
    checkLocal: function (data, name) {
        var arr = data["var"].local,
            len = arr.length,
            isLocal = false;

        while (len--) {
            if (arr[len] === name) {
                isLocal = true;
            }
        }
        return isLocal;
    },
    sendMail : function(mailInfo, isDraft, cb, fcb) {
        var p = this;
        var tos = mailInfo.to;
        var saveSentCopy = mailInfo.saveSentCopy;
        if(mailInfo.cc) {
            tos += "," + mailInfo.cc;
        }
        if(mailInfo.bcc) {
            tos += "," + mailInfo.bcc;
        }
/*
        var htmlcss=["ol,ul{margin:0;pading:0;width:95%}li{clear:both;}li.list-cn-1-0{background-image:url(http://bs.baidu.com/listicon/list-cn-1-0.gif)}","li.list-cn-1-1{background-image:url(http://bs.baidu.com/listicon/list-cn-1-1.gif)}","li.list-cn-1-2{background-image:url(http://bs.baidu.com/listicon/list-cn-1-2.gif)}","li.list-cn-1-3{background-image:url(http://bs.baidu.com/listicon/list-cn-1-3.gif)}","li.list-cn-1-4{background-image:url(http://bs.baidu.com/listicon/list-cn-1-4.gif)}","li.list-cn-1-5{background-image:url(http://bs.baidu.com/listicon/list-cn-1-5.gif)}","li.list-cn-1-6{background-image:url(http://bs.baidu.com/listicon/list-cn-1-6.gif)}","li.list-cn-1-7{background-image:url(http://bs.baidu.com/listicon/list-cn-1-7.gif)}","li.list-cn-1-8{background-image:url(http://bs.baidu.com/listicon/list-cn-1-8.gif)}","li.list-cn-1-9{background-image:url(http://bs.baidu.com/listicon/list-cn-1-9.gif)}","li.list-cn-1-10{background-image:url(http://bs.baidu.com/listicon/list-cn-1-10.gif)}","li.list-cn-1-11{background-image:url(http://bs.baidu.com/listicon/list-cn-1-11.gif)}","li.list-cn-1-12{background-image:url(http://bs.baidu.com/listicon/list-cn-1-12.gif)}","li.list-cn-1-13{background-image:url(http://bs.baidu.com/listicon/list-cn-1-13.gif)}","li.list-cn-1-14{background-image:url(http://bs.baidu.com/listicon/list-cn-1-14.gif)}","li.list-cn-1-15{background-image:url(http://bs.baidu.com/listicon/list-cn-1-15.gif)}","li.list-cn-1-16{background-image:url(http://bs.baidu.com/listicon/list-cn-1-16.gif)}","li.list-cn-1-17{background-image:url(http://bs.baidu.com/listicon/list-cn-1-17.gif)}","li.list-cn-1-18{background-image:url(http://bs.baidu.com/listicon/list-cn-1-18.gif)}","li.list-cn-1-19{background-image:url(http://bs.baidu.com/listicon/list-cn-1-19.gif)}","li.list-cn-1-20{background-image:url(http://bs.baidu.com/listicon/list-cn-1-20.gif)}","li.list-cn-1-21{background-image:url(http://bs.baidu.com/listicon/list-cn-1-21.gif)}","li.list-cn-1-22{background-image:url(http://bs.baidu.com/listicon/list-cn-1-22.gif)}","li.list-cn-1-23{background-image:url(http://bs.baidu.com/listicon/list-cn-1-23.gif)}","li.list-cn-1-24{background-image:url(http://bs.baidu.com/listicon/list-cn-1-24.gif)}","li.list-cn-1-25{background-image:url(http://bs.baidu.com/listicon/list-cn-1-25.gif)}","li.list-cn-1-26{background-image:url(http://bs.baidu.com/listicon/list-cn-1-26.gif)}","li.list-cn-1-27{background-image:url(http://bs.baidu.com/listicon/list-cn-1-27.gif)}","li.list-cn-1-28{background-image:url(http://bs.baidu.com/listicon/list-cn-1-28.gif)}","li.list-cn-1-29{background-image:url(http://bs.baidu.com/listicon/list-cn-1-29.gif)}","li.list-cn-1-30{background-image:url(http://bs.baidu.com/listicon/list-cn-1-30.gif)}","li.list-cn-1-31{background-image:url(http://bs.baidu.com/listicon/list-cn-1-31.gif)}","li.list-cn-1-32{background-image:url(http://bs.baidu.com/listicon/list-cn-1-32.gif)}","li.list-cn-1-33{background-image:url(http://bs.baidu.com/listicon/list-cn-1-33.gif)}","li.list-cn-1-34{background-image:url(http://bs.baidu.com/listicon/list-cn-1-34.gif)}","li.list-cn-1-35{background-image:url(http://bs.baidu.com/listicon/list-cn-1-35.gif)}","li.list-cn-1-36{background-image:url(http://bs.baidu.com/listicon/list-cn-1-36.gif)}","li.list-cn-1-37{background-image:url(http://bs.baidu.com/listicon/list-cn-1-37.gif)}","li.list-cn-1-38{background-image:url(http://bs.baidu.com/listicon/list-cn-1-38.gif)}","li.list-cn-1-39{background-image:url(http://bs.baidu.com/listicon/list-cn-1-39.gif)}","li.list-cn-1-40{background-image:url(http://bs.baidu.com/listicon/list-cn-1-40.gif)}","li.list-cn-1-41{background-image:url(http://bs.baidu.com/listicon/list-cn-1-41.gif)}","li.list-cn-1-42{background-image:url(http://bs.baidu.com/listicon/list-cn-1-42.gif)}","li.list-cn-1-43{background-image:url(http://bs.baidu.com/listicon/list-cn-1-43.gif)}","li.list-cn-1-44{background-image:url(http://bs.baidu.com/listicon/list-cn-1-44.gif)}","li.list-cn-1-45{background-image:url(http://bs.baidu.com/listicon/list-cn-1-45.gif)}","li.list-cn-1-46{background-image:url(http://bs.baidu.com/listicon/list-cn-1-46.gif)}","li.list-cn-1-47{background-image:url(http://bs.baidu.com/listicon/list-cn-1-47.gif)}","li.list-cn-1-48{background-image:url(http://bs.baidu.com/listicon/list-cn-1-48.gif)}","li.list-cn-1-49{background-image:url(http://bs.baidu.com/listicon/list-cn-1-49.gif)}","li.list-cn-1-50{background-image:url(http://bs.baidu.com/listicon/list-cn-1-50.gif)}","li.list-cn-1-51{background-image:url(http://bs.baidu.com/listicon/list-cn-1-51.gif)}","li.list-cn-1-52{background-image:url(http://bs.baidu.com/listicon/list-cn-1-52.gif)}","li.list-cn-1-53{background-image:url(http://bs.baidu.com/listicon/list-cn-1-53.gif)}","li.list-cn-1-54{background-image:url(http://bs.baidu.com/listicon/list-cn-1-54.gif)}","li.list-cn-1-55{background-image:url(http://bs.baidu.com/listicon/list-cn-1-55.gif)}","li.list-cn-1-56{background-image:url(http://bs.baidu.com/listicon/list-cn-1-56.gif)}","li.list-cn-1-57{background-image:url(http://bs.baidu.com/listicon/list-cn-1-57.gif)}","li.list-cn-1-58{background-image:url(http://bs.baidu.com/listicon/list-cn-1-58.gif)}","li.list-cn-1-59{background-image:url(http://bs.baidu.com/listicon/list-cn-1-59.gif)}","li.list-cn-1-60{background-image:url(http://bs.baidu.com/listicon/list-cn-1-60.gif)}","li.list-cn-1-61{background-image:url(http://bs.baidu.com/listicon/list-cn-1-61.gif)}","li.list-cn-1-62{background-image:url(http://bs.baidu.com/listicon/list-cn-1-62.gif)}","li.list-cn-1-63{background-image:url(http://bs.baidu.com/listicon/list-cn-1-63.gif)}","li.list-cn-1-64{background-image:url(http://bs.baidu.com/listicon/list-cn-1-64.gif)}","li.list-cn-1-65{background-image:url(http://bs.baidu.com/listicon/list-cn-1-65.gif)}","li.list-cn-1-66{background-image:url(http://bs.baidu.com/listicon/list-cn-1-66.gif)}","li.list-cn-1-67{background-image:url(http://bs.baidu.com/listicon/list-cn-1-67.gif)}","li.list-cn-1-68{background-image:url(http://bs.baidu.com/listicon/list-cn-1-68.gif)}","li.list-cn-1-69{background-image:url(http://bs.baidu.com/listicon/list-cn-1-69.gif)}","li.list-cn-1-70{background-image:url(http://bs.baidu.com/listicon/list-cn-1-70.gif)}","li.list-cn-1-71{background-image:url(http://bs.baidu.com/listicon/list-cn-1-71.gif)}","li.list-cn-1-72{background-image:url(http://bs.baidu.com/listicon/list-cn-1-72.gif)}","li.list-cn-1-73{background-image:url(http://bs.baidu.com/listicon/list-cn-1-73.gif)}","li.list-cn-1-74{background-image:url(http://bs.baidu.com/listicon/list-cn-1-74.gif)}","li.list-cn-1-75{background-image:url(http://bs.baidu.com/listicon/list-cn-1-75.gif)}","li.list-cn-1-76{background-image:url(http://bs.baidu.com/listicon/list-cn-1-76.gif)}","li.list-cn-1-77{background-image:url(http://bs.baidu.com/listicon/list-cn-1-77.gif)}","li.list-cn-1-78{background-image:url(http://bs.baidu.com/listicon/list-cn-1-78.gif)}","li.list-cn-1-79{background-image:url(http://bs.baidu.com/listicon/list-cn-1-79.gif)}","li.list-cn-1-80{background-image:url(http://bs.baidu.com/listicon/list-cn-1-80.gif)}","li.list-cn-1-81{background-image:url(http://bs.baidu.com/listicon/list-cn-1-81.gif)}","li.list-cn-1-82{background-image:url(http://bs.baidu.com/listicon/list-cn-1-82.gif)}","li.list-cn-1-83{background-image:url(http://bs.baidu.com/listicon/list-cn-1-83.gif)}","li.list-cn-1-84{background-image:url(http://bs.baidu.com/listicon/list-cn-1-84.gif)}","li.list-cn-1-85{background-image:url(http://bs.baidu.com/listicon/list-cn-1-85.gif)}","li.list-cn-1-86{background-image:url(http://bs.baidu.com/listicon/list-cn-1-86.gif)}","li.list-cn-1-87{background-image:url(http://bs.baidu.com/listicon/list-cn-1-87.gif)}","li.list-cn-1-88{background-image:url(http://bs.baidu.com/listicon/list-cn-1-88.gif)}","li.list-cn-1-89{background-image:url(http://bs.baidu.com/listicon/list-cn-1-89.gif)}","li.list-cn-1-90{background-image:url(http://bs.baidu.com/listicon/list-cn-1-90.gif)}","li.list-cn-1-91{background-image:url(http://bs.baidu.com/listicon/list-cn-1-91.gif)}","li.list-cn-1-92{background-image:url(http://bs.baidu.com/listicon/list-cn-1-92.gif)}","li.list-cn-1-93{background-image:url(http://bs.baidu.com/listicon/list-cn-1-93.gif)}","li.list-cn-1-94{background-image:url(http://bs.baidu.com/listicon/list-cn-1-94.gif)}","li.list-cn-1-95{background-image:url(http://bs.baidu.com/listicon/list-cn-1-95.gif)}","li.list-cn-1-96{background-image:url(http://bs.baidu.com/listicon/list-cn-1-96.gif)}","li.list-cn-1-97{background-image:url(http://bs.baidu.com/listicon/list-cn-1-97.gif)}","li.list-cn-1-98{background-image:url(http://bs.baidu.com/listicon/list-cn-1-98.gif)}","ol.custom_cn{list-style:none;}ol.custom_cn li{background-position:0 3px;background-repeat:no-repeat}","li.list-cn-paddingleft-1{padding-left:25px}","li.list-cn-paddingleft-2{padding-left:40px}","li.list-cn-paddingleft-3{padding-left:55px}","li.list-cn-2-0{background-image:url(http://bs.baidu.com/listicon/list-cn-2-0.gif)}","li.list-cn-2-1{background-image:url(http://bs.baidu.com/listicon/list-cn-2-1.gif)}","li.list-cn-2-2{background-image:url(http://bs.baidu.com/listicon/list-cn-2-2.gif)}","li.list-cn-2-3{background-image:url(http://bs.baidu.com/listicon/list-cn-2-3.gif)}","li.list-cn-2-4{background-image:url(http://bs.baidu.com/listicon/list-cn-2-4.gif)}","li.list-cn-2-5{background-image:url(http://bs.baidu.com/listicon/list-cn-2-5.gif)}","li.list-cn-2-6{background-image:url(http://bs.baidu.com/listicon/list-cn-2-6.gif)}","li.list-cn-2-7{background-image:url(http://bs.baidu.com/listicon/list-cn-2-7.gif)}","li.list-cn-2-8{background-image:url(http://bs.baidu.com/listicon/list-cn-2-8.gif)}","li.list-cn-2-9{background-image:url(http://bs.baidu.com/listicon/list-cn-2-9.gif)}","li.list-cn-2-10{background-image:url(http://bs.baidu.com/listicon/list-cn-2-10.gif)}","li.list-cn-2-11{background-image:url(http://bs.baidu.com/listicon/list-cn-2-11.gif)}","li.list-cn-2-12{background-image:url(http://bs.baidu.com/listicon/list-cn-2-12.gif)}","li.list-cn-2-13{background-image:url(http://bs.baidu.com/listicon/list-cn-2-13.gif)}","li.list-cn-2-14{background-image:url(http://bs.baidu.com/listicon/list-cn-2-14.gif)}","li.list-cn-2-15{background-image:url(http://bs.baidu.com/listicon/list-cn-2-15.gif)}","li.list-cn-2-16{background-image:url(http://bs.baidu.com/listicon/list-cn-2-16.gif)}","li.list-cn-2-17{background-image:url(http://bs.baidu.com/listicon/list-cn-2-17.gif)}","li.list-cn-2-18{background-image:url(http://bs.baidu.com/listicon/list-cn-2-18.gif)}","li.list-cn-2-19{background-image:url(http://bs.baidu.com/listicon/list-cn-2-19.gif)}","li.list-cn-2-20{background-image:url(http://bs.baidu.com/listicon/list-cn-2-20.gif)}","li.list-cn-2-21{background-image:url(http://bs.baidu.com/listicon/list-cn-2-21.gif)}","li.list-cn-2-22{background-image:url(http://bs.baidu.com/listicon/list-cn-2-22.gif)}","li.list-cn-2-23{background-image:url(http://bs.baidu.com/listicon/list-cn-2-23.gif)}","li.list-cn-2-24{background-image:url(http://bs.baidu.com/listicon/list-cn-2-24.gif)}","li.list-cn-2-25{background-image:url(http://bs.baidu.com/listicon/list-cn-2-25.gif)}","li.list-cn-2-26{background-image:url(http://bs.baidu.com/listicon/list-cn-2-26.gif)}","li.list-cn-2-27{background-image:url(http://bs.baidu.com/listicon/list-cn-2-27.gif)}","li.list-cn-2-28{background-image:url(http://bs.baidu.com/listicon/list-cn-2-28.gif)}","li.list-cn-2-29{background-image:url(http://bs.baidu.com/listicon/list-cn-2-29.gif)}","li.list-cn-2-30{background-image:url(http://bs.baidu.com/listicon/list-cn-2-30.gif)}","li.list-cn-2-31{background-image:url(http://bs.baidu.com/listicon/list-cn-2-31.gif)}","li.list-cn-2-32{background-image:url(http://bs.baidu.com/listicon/list-cn-2-32.gif)}","li.list-cn-2-33{background-image:url(http://bs.baidu.com/listicon/list-cn-2-33.gif)}","li.list-cn-2-34{background-image:url(http://bs.baidu.com/listicon/list-cn-2-34.gif)}","li.list-cn-2-35{background-image:url(http://bs.baidu.com/listicon/list-cn-2-35.gif)}","li.list-cn-2-36{background-image:url(http://bs.baidu.com/listicon/list-cn-2-36.gif)}","li.list-cn-2-37{background-image:url(http://bs.baidu.com/listicon/list-cn-2-37.gif)}","li.list-cn-2-38{background-image:url(http://bs.baidu.com/listicon/list-cn-2-38.gif)}","li.list-cn-2-39{background-image:url(http://bs.baidu.com/listicon/list-cn-2-39.gif)}","li.list-cn-2-40{background-image:url(http://bs.baidu.com/listicon/list-cn-2-40.gif)}","li.list-cn-2-41{background-image:url(http://bs.baidu.com/listicon/list-cn-2-41.gif)}","li.list-cn-2-42{background-image:url(http://bs.baidu.com/listicon/list-cn-2-42.gif)}","li.list-cn-2-43{background-image:url(http://bs.baidu.com/listicon/list-cn-2-43.gif)}","li.list-cn-2-44{background-image:url(http://bs.baidu.com/listicon/list-cn-2-44.gif)}","li.list-cn-2-45{background-image:url(http://bs.baidu.com/listicon/list-cn-2-45.gif)}","li.list-cn-2-46{background-image:url(http://bs.baidu.com/listicon/list-cn-2-46.gif)}","li.list-cn-2-47{background-image:url(http://bs.baidu.com/listicon/list-cn-2-47.gif)}","li.list-cn-2-48{background-image:url(http://bs.baidu.com/listicon/list-cn-2-48.gif)}","li.list-cn-2-49{background-image:url(http://bs.baidu.com/listicon/list-cn-2-49.gif)}","li.list-cn-2-50{background-image:url(http://bs.baidu.com/listicon/list-cn-2-50.gif)}","li.list-cn-2-51{background-image:url(http://bs.baidu.com/listicon/list-cn-2-51.gif)}","li.list-cn-2-52{background-image:url(http://bs.baidu.com/listicon/list-cn-2-52.gif)}","li.list-cn-2-53{background-image:url(http://bs.baidu.com/listicon/list-cn-2-53.gif)}","li.list-cn-2-54{background-image:url(http://bs.baidu.com/listicon/list-cn-2-54.gif)}","li.list-cn-2-55{background-image:url(http://bs.baidu.com/listicon/list-cn-2-55.gif)}","li.list-cn-2-56{background-image:url(http://bs.baidu.com/listicon/list-cn-2-56.gif)}","li.list-cn-2-57{background-image:url(http://bs.baidu.com/listicon/list-cn-2-57.gif)}","li.list-cn-2-58{background-image:url(http://bs.baidu.com/listicon/list-cn-2-58.gif)}","li.list-cn-2-59{background-image:url(http://bs.baidu.com/listicon/list-cn-2-59.gif)}","li.list-cn-2-60{background-image:url(http://bs.baidu.com/listicon/list-cn-2-60.gif)}","li.list-cn-2-61{background-image:url(http://bs.baidu.com/listicon/list-cn-2-61.gif)}","li.list-cn-2-62{background-image:url(http://bs.baidu.com/listicon/list-cn-2-62.gif)}","li.list-cn-2-63{background-image:url(http://bs.baidu.com/listicon/list-cn-2-63.gif)}","li.list-cn-2-64{background-image:url(http://bs.baidu.com/listicon/list-cn-2-64.gif)}","li.list-cn-2-65{background-image:url(http://bs.baidu.com/listicon/list-cn-2-65.gif)}","li.list-cn-2-66{background-image:url(http://bs.baidu.com/listicon/list-cn-2-66.gif)}","li.list-cn-2-67{background-image:url(http://bs.baidu.com/listicon/list-cn-2-67.gif)}","li.list-cn-2-68{background-image:url(http://bs.baidu.com/listicon/list-cn-2-68.gif)}","li.list-cn-2-69{background-image:url(http://bs.baidu.com/listicon/list-cn-2-69.gif)}","li.list-cn-2-70{background-image:url(http://bs.baidu.com/listicon/list-cn-2-70.gif)}","li.list-cn-2-71{background-image:url(http://bs.baidu.com/listicon/list-cn-2-71.gif)}","li.list-cn-2-72{background-image:url(http://bs.baidu.com/listicon/list-cn-2-72.gif)}","li.list-cn-2-73{background-image:url(http://bs.baidu.com/listicon/list-cn-2-73.gif)}","li.list-cn-2-74{background-image:url(http://bs.baidu.com/listicon/list-cn-2-74.gif)}","li.list-cn-2-75{background-image:url(http://bs.baidu.com/listicon/list-cn-2-75.gif)}","li.list-cn-2-76{background-image:url(http://bs.baidu.com/listicon/list-cn-2-76.gif)}","li.list-cn-2-77{background-image:url(http://bs.baidu.com/listicon/list-cn-2-77.gif)}","li.list-cn-2-78{background-image:url(http://bs.baidu.com/listicon/list-cn-2-78.gif)}","li.list-cn-2-79{background-image:url(http://bs.baidu.com/listicon/list-cn-2-79.gif)}","li.list-cn-2-80{background-image:url(http://bs.baidu.com/listicon/list-cn-2-80.gif)}","li.list-cn-2-81{background-image:url(http://bs.baidu.com/listicon/list-cn-2-81.gif)}","li.list-cn-2-82{background-image:url(http://bs.baidu.com/listicon/list-cn-2-82.gif)}","li.list-cn-2-83{background-image:url(http://bs.baidu.com/listicon/list-cn-2-83.gif)}","li.list-cn-2-84{background-image:url(http://bs.baidu.com/listicon/list-cn-2-84.gif)}","li.list-cn-2-85{background-image:url(http://bs.baidu.com/listicon/list-cn-2-85.gif)}","li.list-cn-2-86{background-image:url(http://bs.baidu.com/listicon/list-cn-2-86.gif)}","li.list-cn-2-87{background-image:url(http://bs.baidu.com/listicon/list-cn-2-87.gif)}","li.list-cn-2-88{background-image:url(http://bs.baidu.com/listicon/list-cn-2-88.gif)}","li.list-cn-2-89{background-image:url(http://bs.baidu.com/listicon/list-cn-2-89.gif)}","li.list-cn-2-90{background-image:url(http://bs.baidu.com/listicon/list-cn-2-90.gif)}","li.list-cn-2-91{background-image:url(http://bs.baidu.com/listicon/list-cn-2-91.gif)}","li.list-cn-2-92{background-image:url(http://bs.baidu.com/listicon/list-cn-2-92.gif)}","li.list-cn-2-93{background-image:url(http://bs.baidu.com/listicon/list-cn-2-93.gif)}","li.list-cn-2-94{background-image:url(http://bs.baidu.com/listicon/list-cn-2-94.gif)}","li.list-cn-2-95{background-image:url(http://bs.baidu.com/listicon/list-cn-2-95.gif)}","li.list-cn-2-96{background-image:url(http://bs.baidu.com/listicon/list-cn-2-96.gif)}","li.list-cn-2-97{background-image:url(http://bs.baidu.com/listicon/list-cn-2-97.gif)}","li.list-cn-2-98{background-image:url(http://bs.baidu.com/listicon/list-cn-2-98.gif)}","ol.custom_cn1{list-style:none;}ol.custom_cn1 li{background-position:0 3px;background-repeat:no-repeat}","li.list-cn1-paddingleft-1{padding-left:30px}","li.list-cn1-paddingleft-2{padding-left:40px}","li.list-cn1-paddingleft-3{padding-left:55px}","li.list-cn-3-0{background-image:url(http://bs.baidu.com/listicon/list-cn-3-0.gif)}","li.list-cn-3-1{background-image:url(http://bs.baidu.com/listicon/list-cn-3-1.gif)}","li.list-cn-3-2{background-image:url(http://bs.baidu.com/listicon/list-cn-3-2.gif)}","li.list-cn-3-3{background-image:url(http://bs.baidu.com/listicon/list-cn-3-3.gif)}","li.list-cn-3-4{background-image:url(http://bs.baidu.com/listicon/list-cn-3-4.gif)}","li.list-cn-3-5{background-image:url(http://bs.baidu.com/listicon/list-cn-3-5.gif)}","li.list-cn-3-6{background-image:url(http://bs.baidu.com/listicon/list-cn-3-6.gif)}","li.list-cn-3-7{background-image:url(http://bs.baidu.com/listicon/list-cn-3-7.gif)}","li.list-cn-3-8{background-image:url(http://bs.baidu.com/listicon/list-cn-3-8.gif)}","li.list-cn-3-9{background-image:url(http://bs.baidu.com/listicon/list-cn-3-9.gif)}","li.list-cn-3-10{background-image:url(http://bs.baidu.com/listicon/list-cn-3-10.gif)}","li.list-cn-3-11{background-image:url(http://bs.baidu.com/listicon/list-cn-3-11.gif)}","li.list-cn-3-12{background-image:url(http://bs.baidu.com/listicon/list-cn-3-12.gif)}","li.list-cn-3-13{background-image:url(http://bs.baidu.com/listicon/list-cn-3-13.gif)}","li.list-cn-3-14{background-image:url(http://bs.baidu.com/listicon/list-cn-3-14.gif)}","li.list-cn-3-15{background-image:url(http://bs.baidu.com/listicon/list-cn-3-15.gif)}","li.list-cn-3-16{background-image:url(http://bs.baidu.com/listicon/list-cn-3-16.gif)}","li.list-cn-3-17{background-image:url(http://bs.baidu.com/listicon/list-cn-3-17.gif)}","li.list-cn-3-18{background-image:url(http://bs.baidu.com/listicon/list-cn-3-18.gif)}","li.list-cn-3-19{background-image:url(http://bs.baidu.com/listicon/list-cn-3-19.gif)}","li.list-cn-3-20{background-image:url(http://bs.baidu.com/listicon/list-cn-3-20.gif)}","li.list-cn-3-21{background-image:url(http://bs.baidu.com/listicon/list-cn-3-21.gif)}","li.list-cn-3-22{background-image:url(http://bs.baidu.com/listicon/list-cn-3-22.gif)}","li.list-cn-3-23{background-image:url(http://bs.baidu.com/listicon/list-cn-3-23.gif)}","li.list-cn-3-24{background-image:url(http://bs.baidu.com/listicon/list-cn-3-24.gif)}","li.list-cn-3-25{background-image:url(http://bs.baidu.com/listicon/list-cn-3-25.gif)}","li.list-cn-3-26{background-image:url(http://bs.baidu.com/listicon/list-cn-3-26.gif)}","li.list-cn-3-27{background-image:url(http://bs.baidu.com/listicon/list-cn-3-27.gif)}","li.list-cn-3-28{background-image:url(http://bs.baidu.com/listicon/list-cn-3-28.gif)}","li.list-cn-3-29{background-image:url(http://bs.baidu.com/listicon/list-cn-3-29.gif)}","li.list-cn-3-30{background-image:url(http://bs.baidu.com/listicon/list-cn-3-30.gif)}","li.list-cn-3-31{background-image:url(http://bs.baidu.com/listicon/list-cn-3-31.gif)}","li.list-cn-3-32{background-image:url(http://bs.baidu.com/listicon/list-cn-3-32.gif)}","li.list-cn-3-33{background-image:url(http://bs.baidu.com/listicon/list-cn-3-33.gif)}","li.list-cn-3-34{background-image:url(http://bs.baidu.com/listicon/list-cn-3-34.gif)}","li.list-cn-3-35{background-image:url(http://bs.baidu.com/listicon/list-cn-3-35.gif)}","li.list-cn-3-36{background-image:url(http://bs.baidu.com/listicon/list-cn-3-36.gif)}","li.list-cn-3-37{background-image:url(http://bs.baidu.com/listicon/list-cn-3-37.gif)}","li.list-cn-3-38{background-image:url(http://bs.baidu.com/listicon/list-cn-3-38.gif)}","li.list-cn-3-39{background-image:url(http://bs.baidu.com/listicon/list-cn-3-39.gif)}","li.list-cn-3-40{background-image:url(http://bs.baidu.com/listicon/list-cn-3-40.gif)}","li.list-cn-3-41{background-image:url(http://bs.baidu.com/listicon/list-cn-3-41.gif)}","li.list-cn-3-42{background-image:url(http://bs.baidu.com/listicon/list-cn-3-42.gif)}","li.list-cn-3-43{background-image:url(http://bs.baidu.com/listicon/list-cn-3-43.gif)}","li.list-cn-3-44{background-image:url(http://bs.baidu.com/listicon/list-cn-3-44.gif)}","li.list-cn-3-45{background-image:url(http://bs.baidu.com/listicon/list-cn-3-45.gif)}","li.list-cn-3-46{background-image:url(http://bs.baidu.com/listicon/list-cn-3-46.gif)}","li.list-cn-3-47{background-image:url(http://bs.baidu.com/listicon/list-cn-3-47.gif)}","li.list-cn-3-48{background-image:url(http://bs.baidu.com/listicon/list-cn-3-48.gif)}","li.list-cn-3-49{background-image:url(http://bs.baidu.com/listicon/list-cn-3-49.gif)}","li.list-cn-3-50{background-image:url(http://bs.baidu.com/listicon/list-cn-3-50.gif)}","li.list-cn-3-51{background-image:url(http://bs.baidu.com/listicon/list-cn-3-51.gif)}","li.list-cn-3-52{background-image:url(http://bs.baidu.com/listicon/list-cn-3-52.gif)}","li.list-cn-3-53{background-image:url(http://bs.baidu.com/listicon/list-cn-3-53.gif)}","li.list-cn-3-54{background-image:url(http://bs.baidu.com/listicon/list-cn-3-54.gif)}","li.list-cn-3-55{background-image:url(http://bs.baidu.com/listicon/list-cn-3-55.gif)}","li.list-cn-3-56{background-image:url(http://bs.baidu.com/listicon/list-cn-3-56.gif)}","li.list-cn-3-57{background-image:url(http://bs.baidu.com/listicon/list-cn-3-57.gif)}","li.list-cn-3-58{background-image:url(http://bs.baidu.com/listicon/list-cn-3-58.gif)}","li.list-cn-3-59{background-image:url(http://bs.baidu.com/listicon/list-cn-3-59.gif)}","li.list-cn-3-60{background-image:url(http://bs.baidu.com/listicon/list-cn-3-60.gif)}","li.list-cn-3-61{background-image:url(http://bs.baidu.com/listicon/list-cn-3-61.gif)}","li.list-cn-3-62{background-image:url(http://bs.baidu.com/listicon/list-cn-3-62.gif)}","li.list-cn-3-63{background-image:url(http://bs.baidu.com/listicon/list-cn-3-63.gif)}","li.list-cn-3-64{background-image:url(http://bs.baidu.com/listicon/list-cn-3-64.gif)}","li.list-cn-3-65{background-image:url(http://bs.baidu.com/listicon/list-cn-3-65.gif)}","li.list-cn-3-66{background-image:url(http://bs.baidu.com/listicon/list-cn-3-66.gif)}","li.list-cn-3-67{background-image:url(http://bs.baidu.com/listicon/list-cn-3-67.gif)}","li.list-cn-3-68{background-image:url(http://bs.baidu.com/listicon/list-cn-3-68.gif)}","li.list-cn-3-69{background-image:url(http://bs.baidu.com/listicon/list-cn-3-69.gif)}","li.list-cn-3-70{background-image:url(http://bs.baidu.com/listicon/list-cn-3-70.gif)}","li.list-cn-3-71{background-image:url(http://bs.baidu.com/listicon/list-cn-3-71.gif)}","li.list-cn-3-72{background-image:url(http://bs.baidu.com/listicon/list-cn-3-72.gif)}","li.list-cn-3-73{background-image:url(http://bs.baidu.com/listicon/list-cn-3-73.gif)}","li.list-cn-3-74{background-image:url(http://bs.baidu.com/listicon/list-cn-3-74.gif)}","li.list-cn-3-75{background-image:url(http://bs.baidu.com/listicon/list-cn-3-75.gif)}","li.list-cn-3-76{background-image:url(http://bs.baidu.com/listicon/list-cn-3-76.gif)}","li.list-cn-3-77{background-image:url(http://bs.baidu.com/listicon/list-cn-3-77.gif)}","li.list-cn-3-78{background-image:url(http://bs.baidu.com/listicon/list-cn-3-78.gif)}","li.list-cn-3-79{background-image:url(http://bs.baidu.com/listicon/list-cn-3-79.gif)}","li.list-cn-3-80{background-image:url(http://bs.baidu.com/listicon/list-cn-3-80.gif)}","li.list-cn-3-81{background-image:url(http://bs.baidu.com/listicon/list-cn-3-81.gif)}","li.list-cn-3-82{background-image:url(http://bs.baidu.com/listicon/list-cn-3-82.gif)}","li.list-cn-3-83{background-image:url(http://bs.baidu.com/listicon/list-cn-3-83.gif)}","li.list-cn-3-84{background-image:url(http://bs.baidu.com/listicon/list-cn-3-84.gif)}","li.list-cn-3-85{background-image:url(http://bs.baidu.com/listicon/list-cn-3-85.gif)}","li.list-cn-3-86{background-image:url(http://bs.baidu.com/listicon/list-cn-3-86.gif)}","li.list-cn-3-87{background-image:url(http://bs.baidu.com/listicon/list-cn-3-87.gif)}","li.list-cn-3-88{background-image:url(http://bs.baidu.com/listicon/list-cn-3-88.gif)}","li.list-cn-3-89{background-image:url(http://bs.baidu.com/listicon/list-cn-3-89.gif)}","li.list-cn-3-90{background-image:url(http://bs.baidu.com/listicon/list-cn-3-90.gif)}","li.list-cn-3-91{background-image:url(http://bs.baidu.com/listicon/list-cn-3-91.gif)}","li.list-cn-3-92{background-image:url(http://bs.baidu.com/listicon/list-cn-3-92.gif)}","li.list-cn-3-93{background-image:url(http://bs.baidu.com/listicon/list-cn-3-93.gif)}","li.list-cn-3-94{background-image:url(http://bs.baidu.com/listicon/list-cn-3-94.gif)}","li.list-cn-3-95{background-image:url(http://bs.baidu.com/listicon/list-cn-3-95.gif)}","li.list-cn-3-96{background-image:url(http://bs.baidu.com/listicon/list-cn-3-96.gif)}","li.list-cn-3-97{background-image:url(http://bs.baidu.com/listicon/list-cn-3-97.gif)}","li.list-cn-3-98{background-image:url(http://bs.baidu.com/listicon/list-cn-3-98.gif)}","ol.custom_cn2{list-style:none;}ol.custom_cn2 li{background-position:0 3px;background-repeat:no-repeat}","li.list-cn2-paddingleft-1{padding-left:40px}","li.list-cn2-paddingleft-2{padding-left:55px}","li.list-cn2-paddingleft-3{padding-left:68px}","li.list-num-1-0{background-image:url(http://bs.baidu.com/listicon/list-num-1-0.gif)}","li.list-num-1-1{background-image:url(http://bs.baidu.com/listicon/list-num-1-1.gif)}","li.list-num-1-2{background-image:url(http://bs.baidu.com/listicon/list-num-1-2.gif)}","li.list-num-1-3{background-image:url(http://bs.baidu.com/listicon/list-num-1-3.gif)}","li.list-num-1-4{background-image:url(http://bs.baidu.com/listicon/list-num-1-4.gif)}","li.list-num-1-5{background-image:url(http://bs.baidu.com/listicon/list-num-1-5.gif)}","li.list-num-1-6{background-image:url(http://bs.baidu.com/listicon/list-num-1-6.gif)}","li.list-num-1-7{background-image:url(http://bs.baidu.com/listicon/list-num-1-7.gif)}","li.list-num-1-8{background-image:url(http://bs.baidu.com/listicon/list-num-1-8.gif)}","li.list-num-1-9{background-image:url(http://bs.baidu.com/listicon/list-num-1-9.gif)}","li.list-num-1-10{background-image:url(http://bs.baidu.com/listicon/list-num-1-10.gif)}","li.list-num-1-11{background-image:url(http://bs.baidu.com/listicon/list-num-1-11.gif)}","li.list-num-1-12{background-image:url(http://bs.baidu.com/listicon/list-num-1-12.gif)}","li.list-num-1-13{background-image:url(http://bs.baidu.com/listicon/list-num-1-13.gif)}","li.list-num-1-14{background-image:url(http://bs.baidu.com/listicon/list-num-1-14.gif)}","li.list-num-1-15{background-image:url(http://bs.baidu.com/listicon/list-num-1-15.gif)}","li.list-num-1-16{background-image:url(http://bs.baidu.com/listicon/list-num-1-16.gif)}","li.list-num-1-17{background-image:url(http://bs.baidu.com/listicon/list-num-1-17.gif)}","li.list-num-1-18{background-image:url(http://bs.baidu.com/listicon/list-num-1-18.gif)}","li.list-num-1-19{background-image:url(http://bs.baidu.com/listicon/list-num-1-19.gif)}","li.list-num-1-20{background-image:url(http://bs.baidu.com/listicon/list-num-1-20.gif)}","li.list-num-1-21{background-image:url(http://bs.baidu.com/listicon/list-num-1-21.gif)}","li.list-num-1-22{background-image:url(http://bs.baidu.com/listicon/list-num-1-22.gif)}","li.list-num-1-23{background-image:url(http://bs.baidu.com/listicon/list-num-1-23.gif)}","li.list-num-1-24{background-image:url(http://bs.baidu.com/listicon/list-num-1-24.gif)}","li.list-num-1-25{background-image:url(http://bs.baidu.com/listicon/list-num-1-25.gif)}","li.list-num-1-26{background-image:url(http://bs.baidu.com/listicon/list-num-1-26.gif)}","li.list-num-1-27{background-image:url(http://bs.baidu.com/listicon/list-num-1-27.gif)}","li.list-num-1-28{background-image:url(http://bs.baidu.com/listicon/list-num-1-28.gif)}","li.list-num-1-29{background-image:url(http://bs.baidu.com/listicon/list-num-1-29.gif)}","li.list-num-1-30{background-image:url(http://bs.baidu.com/listicon/list-num-1-30.gif)}","li.list-num-1-31{background-image:url(http://bs.baidu.com/listicon/list-num-1-31.gif)}","li.list-num-1-32{background-image:url(http://bs.baidu.com/listicon/list-num-1-32.gif)}","li.list-num-1-33{background-image:url(http://bs.baidu.com/listicon/list-num-1-33.gif)}","li.list-num-1-34{background-image:url(http://bs.baidu.com/listicon/list-num-1-34.gif)}","li.list-num-1-35{background-image:url(http://bs.baidu.com/listicon/list-num-1-35.gif)}","li.list-num-1-36{background-image:url(http://bs.baidu.com/listicon/list-num-1-36.gif)}","li.list-num-1-37{background-image:url(http://bs.baidu.com/listicon/list-num-1-37.gif)}","li.list-num-1-38{background-image:url(http://bs.baidu.com/listicon/list-num-1-38.gif)}","li.list-num-1-39{background-image:url(http://bs.baidu.com/listicon/list-num-1-39.gif)}","li.list-num-1-40{background-image:url(http://bs.baidu.com/listicon/list-num-1-40.gif)}","li.list-num-1-41{background-image:url(http://bs.baidu.com/listicon/list-num-1-41.gif)}","li.list-num-1-42{background-image:url(http://bs.baidu.com/listicon/list-num-1-42.gif)}","li.list-num-1-43{background-image:url(http://bs.baidu.com/listicon/list-num-1-43.gif)}","li.list-num-1-44{background-image:url(http://bs.baidu.com/listicon/list-num-1-44.gif)}","li.list-num-1-45{background-image:url(http://bs.baidu.com/listicon/list-num-1-45.gif)}","li.list-num-1-46{background-image:url(http://bs.baidu.com/listicon/list-num-1-46.gif)}","li.list-num-1-47{background-image:url(http://bs.baidu.com/listicon/list-num-1-47.gif)}","li.list-num-1-48{background-image:url(http://bs.baidu.com/listicon/list-num-1-48.gif)}","li.list-num-1-49{background-image:url(http://bs.baidu.com/listicon/list-num-1-49.gif)}","li.list-num-1-50{background-image:url(http://bs.baidu.com/listicon/list-num-1-50.gif)}","li.list-num-1-51{background-image:url(http://bs.baidu.com/listicon/list-num-1-51.gif)}","li.list-num-1-52{background-image:url(http://bs.baidu.com/listicon/list-num-1-52.gif)}","li.list-num-1-53{background-image:url(http://bs.baidu.com/listicon/list-num-1-53.gif)}","li.list-num-1-54{background-image:url(http://bs.baidu.com/listicon/list-num-1-54.gif)}","li.list-num-1-55{background-image:url(http://bs.baidu.com/listicon/list-num-1-55.gif)}","li.list-num-1-56{background-image:url(http://bs.baidu.com/listicon/list-num-1-56.gif)}","li.list-num-1-57{background-image:url(http://bs.baidu.com/listicon/list-num-1-57.gif)}","li.list-num-1-58{background-image:url(http://bs.baidu.com/listicon/list-num-1-58.gif)}","li.list-num-1-59{background-image:url(http://bs.baidu.com/listicon/list-num-1-59.gif)}","li.list-num-1-60{background-image:url(http://bs.baidu.com/listicon/list-num-1-60.gif)}","li.list-num-1-61{background-image:url(http://bs.baidu.com/listicon/list-num-1-61.gif)}","li.list-num-1-62{background-image:url(http://bs.baidu.com/listicon/list-num-1-62.gif)}","li.list-num-1-63{background-image:url(http://bs.baidu.com/listicon/list-num-1-63.gif)}","li.list-num-1-64{background-image:url(http://bs.baidu.com/listicon/list-num-1-64.gif)}","li.list-num-1-65{background-image:url(http://bs.baidu.com/listicon/list-num-1-65.gif)}","li.list-num-1-66{background-image:url(http://bs.baidu.com/listicon/list-num-1-66.gif)}","li.list-num-1-67{background-image:url(http://bs.baidu.com/listicon/list-num-1-67.gif)}","li.list-num-1-68{background-image:url(http://bs.baidu.com/listicon/list-num-1-68.gif)}","li.list-num-1-69{background-image:url(http://bs.baidu.com/listicon/list-num-1-69.gif)}","li.list-num-1-70{background-image:url(http://bs.baidu.com/listicon/list-num-1-70.gif)}","li.list-num-1-71{background-image:url(http://bs.baidu.com/listicon/list-num-1-71.gif)}","li.list-num-1-72{background-image:url(http://bs.baidu.com/listicon/list-num-1-72.gif)}","li.list-num-1-73{background-image:url(http://bs.baidu.com/listicon/list-num-1-73.gif)}","li.list-num-1-74{background-image:url(http://bs.baidu.com/listicon/list-num-1-74.gif)}","li.list-num-1-75{background-image:url(http://bs.baidu.com/listicon/list-num-1-75.gif)}","li.list-num-1-76{background-image:url(http://bs.baidu.com/listicon/list-num-1-76.gif)}","li.list-num-1-77{background-image:url(http://bs.baidu.com/listicon/list-num-1-77.gif)}","li.list-num-1-78{background-image:url(http://bs.baidu.com/listicon/list-num-1-78.gif)}","li.list-num-1-79{background-image:url(http://bs.baidu.com/listicon/list-num-1-79.gif)}","li.list-num-1-80{background-image:url(http://bs.baidu.com/listicon/list-num-1-80.gif)}","li.list-num-1-81{background-image:url(http://bs.baidu.com/listicon/list-num-1-81.gif)}","li.list-num-1-82{background-image:url(http://bs.baidu.com/listicon/list-num-1-82.gif)}","li.list-num-1-83{background-image:url(http://bs.baidu.com/listicon/list-num-1-83.gif)}","li.list-num-1-84{background-image:url(http://bs.baidu.com/listicon/list-num-1-84.gif)}","li.list-num-1-85{background-image:url(http://bs.baidu.com/listicon/list-num-1-85.gif)}","li.list-num-1-86{background-image:url(http://bs.baidu.com/listicon/list-num-1-86.gif)}","li.list-num-1-87{background-image:url(http://bs.baidu.com/listicon/list-num-1-87.gif)}","li.list-num-1-88{background-image:url(http://bs.baidu.com/listicon/list-num-1-88.gif)}","li.list-num-1-89{background-image:url(http://bs.baidu.com/listicon/list-num-1-89.gif)}","li.list-num-1-90{background-image:url(http://bs.baidu.com/listicon/list-num-1-90.gif)}","li.list-num-1-91{background-image:url(http://bs.baidu.com/listicon/list-num-1-91.gif)}","li.list-num-1-92{background-image:url(http://bs.baidu.com/listicon/list-num-1-92.gif)}","li.list-num-1-93{background-image:url(http://bs.baidu.com/listicon/list-num-1-93.gif)}","li.list-num-1-94{background-image:url(http://bs.baidu.com/listicon/list-num-1-94.gif)}","li.list-num-1-95{background-image:url(http://bs.baidu.com/listicon/list-num-1-95.gif)}","li.list-num-1-96{background-image:url(http://bs.baidu.com/listicon/list-num-1-96.gif)}","li.list-num-1-97{background-image:url(http://bs.baidu.com/listicon/list-num-1-97.gif)}","li.list-num-1-98{background-image:url(http://bs.baidu.com/listicon/list-num-1-98.gif)}","ol.custom_num{list-style:none;}ol.custom_num li{background-position:0 3px;background-repeat:no-repeat}","li.list-num-paddingleft-1{padding-left:25px}","li.list-num-2-0{background-image:url(http://bs.baidu.com/listicon/list-num-2-0.gif)}","li.list-num-2-1{background-image:url(http://bs.baidu.com/listicon/list-num-2-1.gif)}","li.list-num-2-2{background-image:url(http://bs.baidu.com/listicon/list-num-2-2.gif)}","li.list-num-2-3{background-image:url(http://bs.baidu.com/listicon/list-num-2-3.gif)}","li.list-num-2-4{background-image:url(http://bs.baidu.com/listicon/list-num-2-4.gif)}","li.list-num-2-5{background-image:url(http://bs.baidu.com/listicon/list-num-2-5.gif)}","li.list-num-2-6{background-image:url(http://bs.baidu.com/listicon/list-num-2-6.gif)}","li.list-num-2-7{background-image:url(http://bs.baidu.com/listicon/list-num-2-7.gif)}","li.list-num-2-8{background-image:url(http://bs.baidu.com/listicon/list-num-2-8.gif)}","li.list-num-2-9{background-image:url(http://bs.baidu.com/listicon/list-num-2-9.gif)}","li.list-num-2-10{background-image:url(http://bs.baidu.com/listicon/list-num-2-10.gif)}","li.list-num-2-11{background-image:url(http://bs.baidu.com/listicon/list-num-2-11.gif)}","li.list-num-2-12{background-image:url(http://bs.baidu.com/listicon/list-num-2-12.gif)}","li.list-num-2-13{background-image:url(http://bs.baidu.com/listicon/list-num-2-13.gif)}","li.list-num-2-14{background-image:url(http://bs.baidu.com/listicon/list-num-2-14.gif)}","li.list-num-2-15{background-image:url(http://bs.baidu.com/listicon/list-num-2-15.gif)}","li.list-num-2-16{background-image:url(http://bs.baidu.com/listicon/list-num-2-16.gif)}","li.list-num-2-17{background-image:url(http://bs.baidu.com/listicon/list-num-2-17.gif)}","li.list-num-2-18{background-image:url(http://bs.baidu.com/listicon/list-num-2-18.gif)}","li.list-num-2-19{background-image:url(http://bs.baidu.com/listicon/list-num-2-19.gif)}","li.list-num-2-20{background-image:url(http://bs.baidu.com/listicon/list-num-2-20.gif)}","li.list-num-2-21{background-image:url(http://bs.baidu.com/listicon/list-num-2-21.gif)}","li.list-num-2-22{background-image:url(http://bs.baidu.com/listicon/list-num-2-22.gif)}","li.list-num-2-23{background-image:url(http://bs.baidu.com/listicon/list-num-2-23.gif)}","li.list-num-2-24{background-image:url(http://bs.baidu.com/listicon/list-num-2-24.gif)}","li.list-num-2-25{background-image:url(http://bs.baidu.com/listicon/list-num-2-25.gif)}","li.list-num-2-26{background-image:url(http://bs.baidu.com/listicon/list-num-2-26.gif)}","li.list-num-2-27{background-image:url(http://bs.baidu.com/listicon/list-num-2-27.gif)}","li.list-num-2-28{background-image:url(http://bs.baidu.com/listicon/list-num-2-28.gif)}","li.list-num-2-29{background-image:url(http://bs.baidu.com/listicon/list-num-2-29.gif)}","li.list-num-2-30{background-image:url(http://bs.baidu.com/listicon/list-num-2-30.gif)}","li.list-num-2-31{background-image:url(http://bs.baidu.com/listicon/list-num-2-31.gif)}","li.list-num-2-32{background-image:url(http://bs.baidu.com/listicon/list-num-2-32.gif)}","li.list-num-2-33{background-image:url(http://bs.baidu.com/listicon/list-num-2-33.gif)}","li.list-num-2-34{background-image:url(http://bs.baidu.com/listicon/list-num-2-34.gif)}","li.list-num-2-35{background-image:url(http://bs.baidu.com/listicon/list-num-2-35.gif)}","li.list-num-2-36{background-image:url(http://bs.baidu.com/listicon/list-num-2-36.gif)}","li.list-num-2-37{background-image:url(http://bs.baidu.com/listicon/list-num-2-37.gif)}","li.list-num-2-38{background-image:url(http://bs.baidu.com/listicon/list-num-2-38.gif)}","li.list-num-2-39{background-image:url(http://bs.baidu.com/listicon/list-num-2-39.gif)}","li.list-num-2-40{background-image:url(http://bs.baidu.com/listicon/list-num-2-40.gif)}","li.list-num-2-41{background-image:url(http://bs.baidu.com/listicon/list-num-2-41.gif)}","li.list-num-2-42{background-image:url(http://bs.baidu.com/listicon/list-num-2-42.gif)}","li.list-num-2-43{background-image:url(http://bs.baidu.com/listicon/list-num-2-43.gif)}","li.list-num-2-44{background-image:url(http://bs.baidu.com/listicon/list-num-2-44.gif)}","li.list-num-2-45{background-image:url(http://bs.baidu.com/listicon/list-num-2-45.gif)}","li.list-num-2-46{background-image:url(http://bs.baidu.com/listicon/list-num-2-46.gif)}","li.list-num-2-47{background-image:url(http://bs.baidu.com/listicon/list-num-2-47.gif)}","li.list-num-2-48{background-image:url(http://bs.baidu.com/listicon/list-num-2-48.gif)}","li.list-num-2-49{background-image:url(http://bs.baidu.com/listicon/list-num-2-49.gif)}","li.list-num-2-50{background-image:url(http://bs.baidu.com/listicon/list-num-2-50.gif)}","li.list-num-2-51{background-image:url(http://bs.baidu.com/listicon/list-num-2-51.gif)}","li.list-num-2-52{background-image:url(http://bs.baidu.com/listicon/list-num-2-52.gif)}","li.list-num-2-53{background-image:url(http://bs.baidu.com/listicon/list-num-2-53.gif)}","li.list-num-2-54{background-image:url(http://bs.baidu.com/listicon/list-num-2-54.gif)}","li.list-num-2-55{background-image:url(http://bs.baidu.com/listicon/list-num-2-55.gif)}","li.list-num-2-56{background-image:url(http://bs.baidu.com/listicon/list-num-2-56.gif)}","li.list-num-2-57{background-image:url(http://bs.baidu.com/listicon/list-num-2-57.gif)}","li.list-num-2-58{background-image:url(http://bs.baidu.com/listicon/list-num-2-58.gif)}","li.list-num-2-59{background-image:url(http://bs.baidu.com/listicon/list-num-2-59.gif)}","li.list-num-2-60{background-image:url(http://bs.baidu.com/listicon/list-num-2-60.gif)}","li.list-num-2-61{background-image:url(http://bs.baidu.com/listicon/list-num-2-61.gif)}","li.list-num-2-62{background-image:url(http://bs.baidu.com/listicon/list-num-2-62.gif)}","li.list-num-2-63{background-image:url(http://bs.baidu.com/listicon/list-num-2-63.gif)}","li.list-num-2-64{background-image:url(http://bs.baidu.com/listicon/list-num-2-64.gif)}","li.list-num-2-65{background-image:url(http://bs.baidu.com/listicon/list-num-2-65.gif)}","li.list-num-2-66{background-image:url(http://bs.baidu.com/listicon/list-num-2-66.gif)}","li.list-num-2-67{background-image:url(http://bs.baidu.com/listicon/list-num-2-67.gif)}","li.list-num-2-68{background-image:url(http://bs.baidu.com/listicon/list-num-2-68.gif)}","li.list-num-2-69{background-image:url(http://bs.baidu.com/listicon/list-num-2-69.gif)}","li.list-num-2-70{background-image:url(http://bs.baidu.com/listicon/list-num-2-70.gif)}","li.list-num-2-71{background-image:url(http://bs.baidu.com/listicon/list-num-2-71.gif)}","li.list-num-2-72{background-image:url(http://bs.baidu.com/listicon/list-num-2-72.gif)}","li.list-num-2-73{background-image:url(http://bs.baidu.com/listicon/list-num-2-73.gif)}","li.list-num-2-74{background-image:url(http://bs.baidu.com/listicon/list-num-2-74.gif)}","li.list-num-2-75{background-image:url(http://bs.baidu.com/listicon/list-num-2-75.gif)}","li.list-num-2-76{background-image:url(http://bs.baidu.com/listicon/list-num-2-76.gif)}","li.list-num-2-77{background-image:url(http://bs.baidu.com/listicon/list-num-2-77.gif)}","li.list-num-2-78{background-image:url(http://bs.baidu.com/listicon/list-num-2-78.gif)}","li.list-num-2-79{background-image:url(http://bs.baidu.com/listicon/list-num-2-79.gif)}","li.list-num-2-80{background-image:url(http://bs.baidu.com/listicon/list-num-2-80.gif)}","li.list-num-2-81{background-image:url(http://bs.baidu.com/listicon/list-num-2-81.gif)}","li.list-num-2-82{background-image:url(http://bs.baidu.com/listicon/list-num-2-82.gif)}","li.list-num-2-83{background-image:url(http://bs.baidu.com/listicon/list-num-2-83.gif)}","li.list-num-2-84{background-image:url(http://bs.baidu.com/listicon/list-num-2-84.gif)}","li.list-num-2-85{background-image:url(http://bs.baidu.com/listicon/list-num-2-85.gif)}","li.list-num-2-86{background-image:url(http://bs.baidu.com/listicon/list-num-2-86.gif)}","li.list-num-2-87{background-image:url(http://bs.baidu.com/listicon/list-num-2-87.gif)}","li.list-num-2-88{background-image:url(http://bs.baidu.com/listicon/list-num-2-88.gif)}","li.list-num-2-89{background-image:url(http://bs.baidu.com/listicon/list-num-2-89.gif)}","li.list-num-2-90{background-image:url(http://bs.baidu.com/listicon/list-num-2-90.gif)}","li.list-num-2-91{background-image:url(http://bs.baidu.com/listicon/list-num-2-91.gif)}","li.list-num-2-92{background-image:url(http://bs.baidu.com/listicon/list-num-2-92.gif)}","li.list-num-2-93{background-image:url(http://bs.baidu.com/listicon/list-num-2-93.gif)}","li.list-num-2-94{background-image:url(http://bs.baidu.com/listicon/list-num-2-94.gif)}","li.list-num-2-95{background-image:url(http://bs.baidu.com/listicon/list-num-2-95.gif)}","li.list-num-2-96{background-image:url(http://bs.baidu.com/listicon/list-num-2-96.gif)}","li.list-num-2-97{background-image:url(http://bs.baidu.com/listicon/list-num-2-97.gif)}","li.list-num-2-98{background-image:url(http://bs.baidu.com/listicon/list-num-2-98.gif)}","ol.custom_num1{list-style:none;}ol.custom_num1 li{background-position:0 3px;background-repeat:no-repeat}","li.list-num1-paddingleft-1{padding-left:25px}","li.list-num-3-0{background-image:url(http://bs.baidu.com/listicon/list-num-3-0.gif)}","li.list-num-3-1{background-image:url(http://bs.baidu.com/listicon/list-num-3-1.gif)}","li.list-num-3-2{background-image:url(http://bs.baidu.com/listicon/list-num-3-2.gif)}","li.list-num-3-3{background-image:url(http://bs.baidu.com/listicon/list-num-3-3.gif)}","li.list-num-3-4{background-image:url(http://bs.baidu.com/listicon/list-num-3-4.gif)}","li.list-num-3-5{background-image:url(http://bs.baidu.com/listicon/list-num-3-5.gif)}","li.list-num-3-6{background-image:url(http://bs.baidu.com/listicon/list-num-3-6.gif)}","li.list-num-3-7{background-image:url(http://bs.baidu.com/listicon/list-num-3-7.gif)}","li.list-num-3-8{background-image:url(http://bs.baidu.com/listicon/list-num-3-8.gif)}","li.list-num-3-9{background-image:url(http://bs.baidu.com/listicon/list-num-3-9.gif)}","li.list-num-3-10{background-image:url(http://bs.baidu.com/listicon/list-num-3-10.gif)}","li.list-num-3-11{background-image:url(http://bs.baidu.com/listicon/list-num-3-11.gif)}","li.list-num-3-12{background-image:url(http://bs.baidu.com/listicon/list-num-3-12.gif)}","li.list-num-3-13{background-image:url(http://bs.baidu.com/listicon/list-num-3-13.gif)}","li.list-num-3-14{background-image:url(http://bs.baidu.com/listicon/list-num-3-14.gif)}","li.list-num-3-15{background-image:url(http://bs.baidu.com/listicon/list-num-3-15.gif)}","li.list-num-3-16{background-image:url(http://bs.baidu.com/listicon/list-num-3-16.gif)}","li.list-num-3-17{background-image:url(http://bs.baidu.com/listicon/list-num-3-17.gif)}","li.list-num-3-18{background-image:url(http://bs.baidu.com/listicon/list-num-3-18.gif)}","li.list-num-3-19{background-image:url(http://bs.baidu.com/listicon/list-num-3-19.gif)}","li.list-num-3-20{background-image:url(http://bs.baidu.com/listicon/list-num-3-20.gif)}","li.list-num-3-21{background-image:url(http://bs.baidu.com/listicon/list-num-3-21.gif)}","li.list-num-3-22{background-image:url(http://bs.baidu.com/listicon/list-num-3-22.gif)}","li.list-num-3-23{background-image:url(http://bs.baidu.com/listicon/list-num-3-23.gif)}","li.list-num-3-24{background-image:url(http://bs.baidu.com/listicon/list-num-3-24.gif)}","li.list-num-3-25{background-image:url(http://bs.baidu.com/listicon/list-num-3-25.gif)}","li.list-num-3-26{background-image:url(http://bs.baidu.com/listicon/list-num-3-26.gif)}","li.list-num-3-27{background-image:url(http://bs.baidu.com/listicon/list-num-3-27.gif)}","li.list-num-3-28{background-image:url(http://bs.baidu.com/listicon/list-num-3-28.gif)}","li.list-num-3-29{background-image:url(http://bs.baidu.com/listicon/list-num-3-29.gif)}","li.list-num-3-30{background-image:url(http://bs.baidu.com/listicon/list-num-3-30.gif)}","li.list-num-3-31{background-image:url(http://bs.baidu.com/listicon/list-num-3-31.gif)}","li.list-num-3-32{background-image:url(http://bs.baidu.com/listicon/list-num-3-32.gif)}","li.list-num-3-33{background-image:url(http://bs.baidu.com/listicon/list-num-3-33.gif)}","li.list-num-3-34{background-image:url(http://bs.baidu.com/listicon/list-num-3-34.gif)}","li.list-num-3-35{background-image:url(http://bs.baidu.com/listicon/list-num-3-35.gif)}","li.list-num-3-36{background-image:url(http://bs.baidu.com/listicon/list-num-3-36.gif)}","li.list-num-3-37{background-image:url(http://bs.baidu.com/listicon/list-num-3-37.gif)}","li.list-num-3-38{background-image:url(http://bs.baidu.com/listicon/list-num-3-38.gif)}","li.list-num-3-39{background-image:url(http://bs.baidu.com/listicon/list-num-3-39.gif)}","li.list-num-3-40{background-image:url(http://bs.baidu.com/listicon/list-num-3-40.gif)}","li.list-num-3-41{background-image:url(http://bs.baidu.com/listicon/list-num-3-41.gif)}","li.list-num-3-42{background-image:url(http://bs.baidu.com/listicon/list-num-3-42.gif)}","li.list-num-3-43{background-image:url(http://bs.baidu.com/listicon/list-num-3-43.gif)}","li.list-num-3-44{background-image:url(http://bs.baidu.com/listicon/list-num-3-44.gif)}","li.list-num-3-45{background-image:url(http://bs.baidu.com/listicon/list-num-3-45.gif)}","li.list-num-3-46{background-image:url(http://bs.baidu.com/listicon/list-num-3-46.gif)}","li.list-num-3-47{background-image:url(http://bs.baidu.com/listicon/list-num-3-47.gif)}","li.list-num-3-48{background-image:url(http://bs.baidu.com/listicon/list-num-3-48.gif)}","li.list-num-3-49{background-image:url(http://bs.baidu.com/listicon/list-num-3-49.gif)}","li.list-num-3-50{background-image:url(http://bs.baidu.com/listicon/list-num-3-50.gif)}","li.list-num-3-51{background-image:url(http://bs.baidu.com/listicon/list-num-3-51.gif)}","li.list-num-3-52{background-image:url(http://bs.baidu.com/listicon/list-num-3-52.gif)}","li.list-num-3-53{background-image:url(http://bs.baidu.com/listicon/list-num-3-53.gif)}","li.list-num-3-54{background-image:url(http://bs.baidu.com/listicon/list-num-3-54.gif)}","li.list-num-3-55{background-image:url(http://bs.baidu.com/listicon/list-num-3-55.gif)}","li.list-num-3-56{background-image:url(http://bs.baidu.com/listicon/list-num-3-56.gif)}","li.list-num-3-57{background-image:url(http://bs.baidu.com/listicon/list-num-3-57.gif)}","li.list-num-3-58{background-image:url(http://bs.baidu.com/listicon/list-num-3-58.gif)}","li.list-num-3-59{background-image:url(http://bs.baidu.com/listicon/list-num-3-59.gif)}","li.list-num-3-60{background-image:url(http://bs.baidu.com/listicon/list-num-3-60.gif)}","li.list-num-3-61{background-image:url(http://bs.baidu.com/listicon/list-num-3-61.gif)}","li.list-num-3-62{background-image:url(http://bs.baidu.com/listicon/list-num-3-62.gif)}","li.list-num-3-63{background-image:url(http://bs.baidu.com/listicon/list-num-3-63.gif)}","li.list-num-3-64{background-image:url(http://bs.baidu.com/listicon/list-num-3-64.gif)}","li.list-num-3-65{background-image:url(http://bs.baidu.com/listicon/list-num-3-65.gif)}","li.list-num-3-66{background-image:url(http://bs.baidu.com/listicon/list-num-3-66.gif)}","li.list-num-3-67{background-image:url(http://bs.baidu.com/listicon/list-num-3-67.gif)}","li.list-num-3-68{background-image:url(http://bs.baidu.com/listicon/list-num-3-68.gif)}","li.list-num-3-69{background-image:url(http://bs.baidu.com/listicon/list-num-3-69.gif)}","li.list-num-3-70{background-image:url(http://bs.baidu.com/listicon/list-num-3-70.gif)}","li.list-num-3-71{background-image:url(http://bs.baidu.com/listicon/list-num-3-71.gif)}","li.list-num-3-72{background-image:url(http://bs.baidu.com/listicon/list-num-3-72.gif)}","li.list-num-3-73{background-image:url(http://bs.baidu.com/listicon/list-num-3-73.gif)}","li.list-num-3-74{background-image:url(http://bs.baidu.com/listicon/list-num-3-74.gif)}","li.list-num-3-75{background-image:url(http://bs.baidu.com/listicon/list-num-3-75.gif)}","li.list-num-3-76{background-image:url(http://bs.baidu.com/listicon/list-num-3-76.gif)}","li.list-num-3-77{background-image:url(http://bs.baidu.com/listicon/list-num-3-77.gif)}","li.list-num-3-78{background-image:url(http://bs.baidu.com/listicon/list-num-3-78.gif)}","li.list-num-3-79{background-image:url(http://bs.baidu.com/listicon/list-num-3-79.gif)}","li.list-num-3-80{background-image:url(http://bs.baidu.com/listicon/list-num-3-80.gif)}","li.list-num-3-81{background-image:url(http://bs.baidu.com/listicon/list-num-3-81.gif)}","li.list-num-3-82{background-image:url(http://bs.baidu.com/listicon/list-num-3-82.gif)}","li.list-num-3-83{background-image:url(http://bs.baidu.com/listicon/list-num-3-83.gif)}","li.list-num-3-84{background-image:url(http://bs.baidu.com/listicon/list-num-3-84.gif)}","li.list-num-3-85{background-image:url(http://bs.baidu.com/listicon/list-num-3-85.gif)}","li.list-num-3-86{background-image:url(http://bs.baidu.com/listicon/list-num-3-86.gif)}","li.list-num-3-87{background-image:url(http://bs.baidu.com/listicon/list-num-3-87.gif)}","li.list-num-3-88{background-image:url(http://bs.baidu.com/listicon/list-num-3-88.gif)}","li.list-num-3-89{background-image:url(http://bs.baidu.com/listicon/list-num-3-89.gif)}","li.list-num-3-90{background-image:url(http://bs.baidu.com/listicon/list-num-3-90.gif)}","li.list-num-3-91{background-image:url(http://bs.baidu.com/listicon/list-num-3-91.gif)}","li.list-num-3-92{background-image:url(http://bs.baidu.com/listicon/list-num-3-92.gif)}","li.list-num-3-93{background-image:url(http://bs.baidu.com/listicon/list-num-3-93.gif)}","li.list-num-3-94{background-image:url(http://bs.baidu.com/listicon/list-num-3-94.gif)}","li.list-num-3-95{background-image:url(http://bs.baidu.com/listicon/list-num-3-95.gif)}","li.list-num-3-96{background-image:url(http://bs.baidu.com/listicon/list-num-3-96.gif)}","li.list-num-3-97{background-image:url(http://bs.baidu.com/listicon/list-num-3-97.gif)}","li.list-num-3-98{background-image:url(http://bs.baidu.com/listicon/list-num-3-98.gif)}","ol.custom_num2{list-style:none;}ol.custom_num2 li{background-position:0 3px;background-repeat:no-repeat}","li.list-num2-paddingleft-1{padding-left:35px}","li.list-num2-paddingleft-2{padding-left:40px}","li.list-dash{background-image:url(http://bs.baidu.com/listicon/dash.gif)}","ul.custom_dash{list-style:none;}ul.custom_dash li{background-position:0 3px;background-repeat:no-repeat}","li.list-dash-paddingleft{padding-left:35px}","li.list-dot{background-image:url(http://bs.baidu.com/listicon/dot.gif)}","ul.custom_dot{list-style:none;}ul.custom_dot li{background-position:0 3px;background-repeat:no-repeat}","li.list-dot-paddingleft{padding-left:20px}",".list-paddingleft-1{padding-left:0}",".list-paddingleft-2{padding-left:30px}",".list-paddingleft-3{padding-left:60px}"].join("");
*/      
        var htmlcss=["ol,ul{margin:0;pading:0;width:95%}li{clear:both;}","ul.custom_dot{list-style:none;}ul.custom_dot li{background-position:0 3px;background-repeat:no-repeat}","li.list-dot-paddingleft{padding-left:20px}",".list-paddingleft-1{padding-left:0}",".list-paddingleft-2{padding-left:30px}",".list-paddingleft-3{padding-left:60px}"].join("");

        mailInfo.content='<style> p{margin:5px 0;} td p{margin:0;} table{border-collapse: collapse;}td,th{border:1px solid #DDD;padding: 5px 10px;} '+ htmlcss +' </style> '+mailInfo.content;
        // if(jQuery("#list",editor.document).length>0){
             // mailInfo.content= '<style> '+jQuery("#list",oWrite.ue.document).html()+'</style>'+mailInfo.content;
        // }
        var xmlObj = {
            attrs : mailInfo,
            returnInfo : 1
        };
        if(!this.dragId && isDraft && this.funcid != "mbox:restoreDraft") {
            xmlObj.action = "firstsave";
        } else {
            if(isDraft) {
                xmlObj.action = "save";
            } else if(p.isReply || p.isReplyAll) {
                xmlObj.action = "reply";
            } else if(p.isForward) {
                xmlObj.action = "forward";
            } else {
                xmlObj.action = "deliver";
            }
        }
        /***
         * 成功后回调函数
         * @param {Object} resp
         */
        var composeCallback = function(resp, ru) {
            p.doBtnStatus(false, 0);
            try {
                if(resp.code == "S_OK") {
                    if(isDraft) {
                        oWrite.oldData=oWrite.getCurrData()
                        oWrite.changed=false;
                        if(resp["var"]) {
                            //oWrite.mid = resp["var"];
                            p.dragId = resp["var"];
                            //刷新草稿箱
                            var o = parent.GE.folderObj.draft;
                            if(parent.GE.tab.exist(o)) {
                                parent.MM[o].refresh(true);
                            }
                        }
                        if(p.saveDraftType == 'auto'){
                            parent.CC.showMsg(p.getNotice('auto'), true, false, "option");
                        }
                        else if(p.saveDraftType == 'hand'){
                            parent.CC.showMsg(p.getNotice('hand'), true, false, 'option');
                        }
                        p.needAutoSave = false;
                    } else {
                        p.showOk(tos, saveSentCopy, resp);
                    }


                    if( typeof (cb) == "function") {
                        cb();
                    }
                } else {
                    composeFailCallback(resp, ru);
                }
            } catch (e) {
                p.doBtnStatus(false, 0);
            }
            PageState = PageStateTypes.Common;
        };
        if( typeof (cb) == "function") {
            composeCallback();
        }

        var composeFailCallback = function (resp, url) {
            p.composeFailCallback(resp, url, isDraft);
        };
        if( typeof (fcb) == "function") {
            composeFailCallback = function() {
                PageState = PageStateTypes.Common;
                fcb();
            };
        }
        var msg = Lang.Mail.Write.sending;
        if(isDraft) {
            msg = p.isAutoSave ? Lang.Mail.Write.saveingDragt : Lang.Mail.Write.saveingDraft;
        }
        var obj = {
            func : "mbox:compose",
            data : xmlObj,
            call : composeCallback,
            failCall : composeFailCallback,
            params: {comefrom:5, categoryId: '103000000', module: "web"},
            msg : ''//msg
        };
        parent.MM.mailRequestApi(obj);
        if(oWrite.sendLock){
            clearTimeout(oWrite.sendLock);
        }
    },
    /***
     * 显示抄送/密送
     * @param {Object} obj
     * @param {Object} id
     */
    showOtherText : function(obj, id) {
        var tr = $(id);
        var text = Lang.Mail.Write.delCS;
        var objText = $("ccopy");
        var objTr = $("trCS");
        if(id != "trCS") {
            text = Lang.Mail.Write.delMS;
            objText = $("bccopy");
        }
        if(tr.style.display == "none") {
            tr.style.display = "";
            obj.innerHTML = text;
            objText.focus();
            oWrite.focusId = objText.id;
            oWrite.setTextHeight(objText.id);
        } else {
            if(objText.value != "") {
                parent.CC.confirm(Lang.Mail.Write.confirmDel + text + Lang.Mail.Write.confirmAddr + "？", function() {
                    objText.value = "";
                });
            }
            text = Lang.Mail.Write.addCC;
            if(id != "trCS") {
                text = Lang.Mail.Write.addBCC;
            }
            tr.style.display = "none";
            obj.innerHTML = text;
        }
        this.setSize();
    },
    /***
     * 群发单显 启用/取消
     */
    doAllToOneClick : function(isChk) {
        if( typeof (isChk) == 'boolean') {
            $('chkAllToOne').checked = isChk;
        }
        var isEnable = $('chkAllToOne').checked;
        var tto = $("trTO"), tcc = $("trCS"), tbc = $("trMS");
        var oto = $("recipient"), occ = $("ccopy"), obc = $("bccopy");
        var strto = "";
        if(isEnable) {
            this.oldTo = oto.value;
            this.oldCc = occ.value;
            this.oldBc = obc.value;
            this.oldCcShow = parent.El.visible(tcc);
            this.oldBcShow = parent.El.visible(tbc);
            strto = oto.value;

            if(occ.value) {
                strto += ";" + occ.value;
            }
            if(obc.value) {
                strto += ";" + obc.value;
            }
            oto.value = parent.Email.getEmailString(strto);
            $('hrefCS').style.display = "none";
            $('hrefMS').style.display = "none";
            parent.El.hide(tcc);
            parent.El.hide(tbc);
            occ.value = '';
            obc.value = '';
        } else {
            if(this.oldCcShow) {
                tcc.style.display = "";
                occ.value = this.oldCc;
                $('hrefCS').innerHTML = Lang.Mail.Write.delCS;
            } else {
                $('hrefCS').innerHTML = Lang.Mail.Write.addCC;
            }
            if(this.oldBcShow) {
                tbc.style.display = "";
                obc.value = this.oldBc;
                $('hrefMS').innerHTML = Lang.Mail.Write.delMS;
            } else {
                $('hrefMS').innerHTML = Lang.Mail.Write.addBCC;
            }
            if(this.oldTo) {
                oto.value = this.oldTo;
            }
            $('hrefCS').style.display = "";
            $('hrefMS').style.display = "";
        }
        this.doTextBlur('recipient');
        this.setSize();
    },
    doRecipient : function() {
        this.doSepClick("true");
        GC.fireEvent($("tab_li0"), "click");
    },
    doSepClick : function(isShow) {
        var tabArea = $("writeSidebar");
        var sep = $("switchDiv");
        var obj = $("tabSwitch");
        var tcolor = $("subjectColor"); //主题颜色框
        var iconW = parent.El.width(sep);
        var sbW = parent.El.width(tabArea);
        var tcolorW = parent.El.width(tcolor);//主题颜色框的宽度
        var totalW = iconW + sbW;
        var writeContent = $("writeContent");
        var dis = typeof isShow == "undefined" ? !(parent.El.visible(tabArea)) : null;
        var writeWrapper = $("writeWrapper");
        var switchDiv = $("switchDiv");
        var writeWrapW = 0, offset = 5;
        if(!isIE && (isShow && isShow.type == "click")) {
            isShow = undefined;
        }
        if(isShow || dis) {
            writeWrapW = 212;
            var W = 0;
            parent.El.show(tabArea);
            parent.El.setStyle(writeContent, {
                "marginRight" : (totalW + offset) + "px"
            });
            parent.El.setStyle(sep, {
                "marginLeft" : -totalW + "px"
            });
            parent.El.setStyle(writeWrapper, {
                "marginRight" : -writeWrapW + "px"
            });
            parent.El.setStyle(switchDiv, {
                "marginLeft" : W + "px"
            });
            parent.El.setStyle(tcolor,{          //主题颜色框改变margin-right
                "marginRight" : (totalW + offset) + "px"
            });
            parent.El.removeClass(obj, "on");
        } else {
            if(top.Browser.isIE && top.Browser.ie < 7){
                writeWrapW = -2;
            }
            else{
                writeWrapW = 0;
            }
            parent.El.hide(tabArea);
            parent.El.setStyle(writeContent, {
                "marginRight" : (iconW + offset) + "px"
            });
            parent.El.setStyle(sep, {
                "marginLeft" : -iconW + "px"
            });
            parent.El.setStyle(writeWrapper, {
                "marginRight" : writeWrapW + "px"
            });
            parent.El.setStyle(tcolor, {            //主题颜色框改变margin-right
                "marginRight" : (iconW + offset) + "px"
            });
            parent.El.addClass(obj, "on");
        }
        oWrite.setSize();
    },
    getNotice: function(type){
        var t = this.times * this.minutes;
        var myDate = new Date();
        var mytime = myDate.toLocaleTimeString();

        if(type == 'auto'){
            return Lang.Mail.Write.autoSaveToDraft.format(t, mytime);
        }
        else if(type == 'hand'){
            return Lang.Mail.Write.handSaveToDraft.format(t, mytime);
        }
    },
    showWriteTips : function(msg) {
        var t = this.times * this.minutes;
        var myDate = new Date();
        var o = $("writeTips");
        parent.El.show(o);
        var mytime = myDate.toLocaleTimeString();
        var notice;
        if(msg) {
            notice = '<i></i>' + msg + '<a class="close" href="javascript:fGoto();" onclick="oWrite.closeTips()"></a>';
            notice = notice.format(t, mytime);
        } else {
            if(this.isAutoSave) {
                notice = '<i></i>' + Lang.Mail.Write.autoSaveToDraft + '<a class="close" href="javascript:fGoto();" onclick="oWrite.closeTips()"></a>';
                notice = notice.format(t, mytime);
                this.isAutoSave = false;
            } else {
                notice = '<i></i>' + Lang.Mail.Write.mailSaveToDraft + '<a class="close" href="javascript:fGoto();" onclick="oWrite.closeTips()"></a>';
                notice = notice.format(mytime);
            }
        }
        o.innerHTML = notice;
        this.setSize();
    },
    closeTips : function() {
        var o = $("writeTips");
        o.innerHTML = "";
        o.style.display = "none";
        this.setSize();
    },
    showOk : function(tos, saveSentCopy, d) {
        try {
            var cid = oWrite.composeId;
            var ret = parent.Email.get(tos, true);
            var suc = ret.success.toArray();
            var host = parent.location.protocol + "//" + parent.location.host;
            var ml = suc.join(",");
            var ssc = saveSentCopy ? saveSentCopy : 0;
            var tid = '';
            if(typeof d == 'object'){
                tid = d['var'].tid || '';
            }
            var form = document.createElement('form');
            var valArea = document.createElement('input');
            valArea.type = 'hidden';
            valArea.name = 'to';
            valArea.value = ml;
            form.method = 'post';
            form.action = host + parent.gConst.composeOkUrl + "&isSchedule=" + this.isSchedule + "&ssc=" + ssc + "&tid=" + tid + "&composeid=" + cid;
            form.appendChild(valArea);
            document.body.appendChild(form);
            form.submit();
            var curBar = parent.GE.tab.doc.getElementById(parent.gConst.mainToolbar + parent.GE.tab.curid);
            parent.GE.curBar = curBar;
        } catch(e) {
        }
    },
    doTabClick : function(id) {
        //联系人、信纸切换
        id = id || "tab_li0";
        var oid = (id == "tab_li0") ? "tab_li1" : "tab_li0";
        parent.El.addClass($(id), "on");
        parent.El.removeClass($(oid), "on");
        parent.El.show($(id + "_div"));
        parent.El.hide($(oid + "_div"));
        if(id == "tab_li1") {
            //if(GC.check("MAIL_WRITE_LP")) {
                LP.draw();
            //}
        }
        this.setSize();
    },
    setTextHeight : function(v) {
        return;
        if( typeof (v) == "object") {
            v = v.id;
        }
        oWrite.textSizeEvent[v].doSize();
        oWrite.setSize();
    },
    doTextFocus : function(v) {
        var obj = $(v);
        var ev = parent.EV.getEvent() || window.event;
        if(ev && ev.type == "focus") {
            var t = parent.El.getNodeType(obj, true);
            if(obj && (t == "text" || t == "textarea")) {
                this.focusId = obj.id;
            }
            if(isIE) {
                parent.El.addClass(obj, "focus");
            }
        }
    },
    doTextKeydown : function(v) {
        var obj = $(v);
        var ev = parent.EV.getEvent() || window.event;
        var kc = parent.EV.getCharCode(ev);
        obj = parent.EV.getTarget(ev);
        var text = obj.value;
        var lastChar = text.substring(text.length - 1);
        if((lastChar == ',' || lastChar == ';' || lastChar == '') && (kc == 186 || kc == 188)) {
            parent.EV.stopEvent(ev);
        }
        obj.focus();
        if(kc == 13) {
            parent.EV.stopEvent(ev);
        }
    },
    doTextKeyUp : function(v) {
        var obj = $(v);
        var text = obj.value;
        text = text.replace(/[;,\s]+/gi, ";");
        obj.value = text;
    },
    doTextBlur : function(v) {
        var obj = $(v);
        if(isIE) {
            parent.El.removeClass(obj, "focus");
        }
    },
    selectMail : function(m, tm) {
        var val = tm || m;
        var type = this.fromType || 'default';
        var txt = $(oWrite.focusId);
        var t = txt.value || "";
        t = t.replace(/[,]+/gi, ";");
        t = t.replace(/^;/, "");
        var lastSep = t.lastIndexOf(";");
        var rib = oWrite.richInputBox;
        if(t == "") {
            txt.value = val;
        } else {
            if(t.indexOf(val) < 0) {
                t = t.replace(/[;]{2,}/, ";");
                if(lastSep > 0) {
                    txt.value = t.substring(0, lastSep + 1) + val;
                } else {
                    txt.value = val;
                }
            }
        }
        
        if(rib instanceof RichInputBox){
            rib.createItemFromTextBox();
        }
        oWrite.needAutoSave = true;
        oWrite.changed = true;
    },
    /**
     * 获取保存到已发送选项默认值 
     */
    getSentSaveDefault: function(){
        if(parent.gMain.sendSave.toString() == ''){
            if(parent.LoginType == parent.gConst.loginType.pm || parent.LoginType == parent.gConst.loginType.mm){
                return parent.gMain.defaultPrefSavesendPublic;
            }
            if(parent.LoginType == parent.gConst.loginType.web){
                return parent.gMain.defaultPrefSavesend;
            }
        }
        return parent.gMain.sendSave;
    },
    /**
    * 标准化邮件地址
    * @param {Array} mail 邮件数组 
    **/
    changeMail: function (mail) {
        var mailList = mail.split(/[,;]/g);
        for(var i = 0, g = mailList.length; i < g; i++) {
            if(mailList[i] != "" && mailList[i].split('@').length == 1  && i < g-2) {
                mailList[i + 1] = mailList[i] + "." + mailList[i + 1];
                mailList[i] = "";
            }   
        }
        return mailList.join(";");
    },
    /***
     * 当为回复或者转发时,初始化时填充数据
     */
    fillMailData : function() {
        var p = this;
        var b = p.pageLoaded;
        if(!b) {
            return;
        }
        var cs = "", bs = "", i = 0;
        var param = p.initData;
        var sd = 0, tos = "";
        var content = "";
        var ssc = parent.CC.getSentSaveDefault();
        var colorIndex = param.headers.color || parent.gMain.curColor;
        var denyForward = param.denyForward || 0;
        var headers = param.headers;
        
        if(p.isReplyAll || p.isReply || p.isForward || p.isForwardAll){
            param.saveSentCopy = ssc;
        }
        
        if(colorIndex && parent.gConst.subjectColor){
            jQuery('#txtsubject').css('color', parent.gConst.subjectColor[colorIndex].value);
        }
        
        if(param && typeof (param) == "object") {
            if(param.mid) {
                p.mid = param.mid;
            }
            if(param.omid) {
                p.omid = param.omid;
            }
            tos = param.to;
            tos = p.changeMail(tos);
            if(p.ribs.length && p.ribs[0] instanceof RichInputBox){
                p.ribs[0].insertItem(tos);// parent.Email.getEmailString(tos);
            }
            if((p.isDrag || p.isReplyAll) && param.cc) {
                $("compose_CC").style.display = "";
                if(p.ribs.length && p.ribs[1] instanceof RichInputBox){
                    p.ribs[1].insertItem(p.changeMail(param.cc));
                }
            }
            if(p.isDrag && param.bcc) {
                $("compose_SCC").style.display = "";
                p.isSCC = true;
                $('sccLink').innerHTML = parent.Lang.Mail.Write.delSCC;
                if(p.ribs.length && p.ribs[2] instanceof RichInputBox){
                    p.ribs[2].insertItem(p.changeMail(param.bcc));
                }
            }
            var subjectA = param.subject;//.decodeHTML()            
            if(subjectA) {
                var partA, partB, subjectColor;
                if(subjectA.indexOf(':') > 0){
                    partA = subjectA.substr(0, subjectA.indexOf(':'));
                    partB = subjectA.substr(subjectA.indexOf(':'));
                    if(partA == 'Re' || partA == 'Fw'){
                        if(parent.gMain.replyPrefix == 4){//use chinese
                            if(partA == 'Re'){
                                subjectA = parent.Lang.Mail.tips042 + partB;
                            }
                            else if(partA == 'Fw'){
                                subjectA = parent.Lang.Mail.tips043 + partB;
                            }
                        }
                    }
                }
                $("txtsubject").value = subjectA;
            }
            //恢复保存到已发送状态
            if(param.saveSentCopy == '1'){
                $('chkSaveToSentBox').checked = true;
            }
            else{
                $('chkSaveToSentBox').checked = false;
            }
            
            //显示附件信息 && (!p.isReply && !p.isReplyAll)
            if(param.attachments) {
                attach.render(param);
            }
            //紧急否
            if(param.priority) {
                $("chkUrgent").checked = param.priority == parent.GE.priority.hight ? true : false;
            }
            //已读回执
            if(param.requestReadReceipt) {
                $("chkReceipt").checked = param.requestReadReceipt == 1 ? true : false;
            }
            //是否加密签名
            if(param.smailType == 1) {
                $("numberSign").checked = true;
            }else if(param.smailType == 2) {
                $("numberEncrypt").checked = true;
            }else if(param.smailType == 3) {
                $("numberEncrypt").checked = true;
                $("numberSign").checked = true;
            }
            // 自销毁设置
            var text = Lang.Mail.Write.zsyfzjzdxh;
            if (param.keepFlag == 2) {
                jQuery("#ckbAutoDestroy").prop("checked", true);
            } else if (param.keepFlag == 1) {
                p.isAutoDestroy = true;
                jQuery("#ckbDaysDestroy").prop("checked", true);
                jQuery("#inputReadDays").val(param.keepDay);
                text = Lang.Mail.Write.zsyfzfsdyj + param.keepDay + Lang.Mail.Write.thyjjzdxh;
            }
            if (param.keepFlag == 1 || param.keepFlag == 2) {
                p.isAutoDestroy = true;
                jQuery("#chkAutoDestroy").prop("checked", true);
                p.addAutoDesMsgHtml();
                jQuery("#autoDestroyMailTips").html(text).show();
            }
                
            // 恢复禁止转发状态
            if(denyForward && jQuery('#chkForbiddenForward')){
                jQuery('#chkForbiddenForward')[0].checked = denyForward;
            }
            if(denyForward){
                p.denyForward = '1';
            }
            if(param.showOneRcpt) {
                $('lookAllAsSingleLink').click();
            }

            // 如果有加密邮件权限，则还原加密邮件状态
            if(p.encryptMail){
                if(headers && headers.mailPass){
                    p.encryptMailClass.restorePassword(headers.mailPass);
                }
            }

            // 如果支持密级邮件且有邮件密级，则还原密级邮件状态
            if(Plugins.able('securityMail')){
                if(headers && headers.securityLevel){
                    Plugins.find('securityMail').recoverStatus(headers.securityLevel, p);
                }
            }

            //显示文件柜附件
            p.loadDiskFiles();
            //邮件内容
            sd = param.scheduleDate;
        }
        
        if(p.isForward){  //p.isReply || p.isReplyAll || 
            p.showMailContent();
        }
        else{
            p.showMailContent();
            //if (top.GC.check('MAIL_CONFIG_SIGN')) {
            //  p.setDefaultSign();
            //}
        }
        Editor.editorValue = Editor.getEditorValue();
        p.initTimeSend(sd);     
        p.setSize();
    },
    showMailContent : function(content, flag) {
        var data = this.initData;
        var ishtml = ( typeof (data.isHtml) == "undefined") ? 1 : data.isHtml;
        var mc = data.content || "";
        var msg = "";
        if(!ishtml) {
            mc = mc.encodeHTML();
            mc = mc.replace(/\n/g, "<br>");
        }
        if(flag){
            msg = content + "<div><br><br></div>" + mc;
        }
        else{
            if(this.isForward || this.isForwardAll){
                msg = content || mc;
                msg = "<div><br /><br /></div>" + msg;
            }
            else{
                msg = content || mc;//"<div><br><br></div>" + mc;
            }
        }
        var temp = "";
        if(this.isReply || this.isReplyAll || this.isForward) {
            //去掉签名的标签id，因为在回复的时候，会有新的产生，否则id会重复。草稿箱与定时发送除外
            msg = msg.replace(/id=['"]?divsignature['"]?/, "Lang.Mail.Write.qdnlfydqcw]?disk_attach_file_list_for_readmail['+Lang.Mail.Write.qdzbx+'<]+<blockquote [^>]+)border-left:[^;"]+;?("?)/i, '$1$2');
            msg = msg.replace(/([^<]+<blockquote [^>]+)padding-left:[^;"]+;?("?)/i, '$1$2');
            if(top.gMain.addo == "2" && !this.isForward) {
                Editor.setEditorValue("<div><br><br></div>");
                return;
            }
        }
        var flag = 0;
        if(this.funcid != parent.gConst.compose && !ishtml) {
            flag = 1;
        }
        if(this.isReply || this.isReplyAll || this.isForward) {
            if(!this.isForward){
                Editor.setEditorValue('<div>&nbsp;</div><div>&nbsp;</div><div>&nbsp;</div>');
            }
            //if(!this.isForward && top.GC.check('MAIL_CONFIG_SIGN')){
                this.setDefaultSign();
            //}
            msg = Editor.getEditorValue() + msg;
        }
        Editor.setEditorValue(msg + "<div><br><br></div>'+Lang.Mail.Write.zfhhfkscsz+''){
                subject.value = title;
            }
        }
        else{
            subject.value = title;
        }
        if(this.titleErrTips && this.titleErrTips instanceof ToolTips){
            this.titleErrTips.close();
            this.titleErrTips = null;
        }
        oWrite.needAutoSave = true;
        oWrite.changed = true;
    },

    getCurrData:function(){

        var cc=''
        if(jQuery('.RichInputBox').eq(1).is(':hidden')){
            cc=''
        }else{
            cc=jQuery('.RichInputBox').eq(1).text()
        }

        var micc=''
        if(jQuery('.RichInputBox').eq(2).is(':hidden')){
            micc=''
        }else{
            micc=jQuery('.RichInputBox').eq(2).text()
        }

        return {
            content:Editor.getEditorValue(),
            subject:jQuery('#txtsubject').val(),
            tos:jQuery('.RichInputBox').eq(0).text(),
            cc:cc,
            micc:micc,
        isQunFaDanXian:oWrite.isLookAllAsSingle

        }
    },
    checkChange : function() {

        //var old=oWrite.getOldData();
        //var curr=this.getCurrentMailInfo();
        //if(old.subject!=curr.subject){
        //  return true
        //}
        //if(old.content!=curr.content){
        //  return true
        //}

        var old=oWrite.oldData
        var curr=oWrite.getCurrData()
        for (var attr in curr){
            if(old[attr]!=curr[attr]){
                return true
            }
        }



        //if(oWrite.changed){
        //  return true;
        //}
        //if(Editor.initilized){
        //  oWrite.changed = !Editor.checkValueChange()
        //  return oWrite.changed;
        //}
        return false;
    },
    test : "",
    /**
     * 
     * @param {Array} strA: string .
     * @return true/false
     */
    tryInclude: function(strA, strArr){
        if(strA && (strArr instanceof Array)){
            for(var i=0;i<strArr.length;i++){
                if(strA.indexOf(strArr[i]) >'+Lang.Mail.Write.xzldxsl+'http') > -1 ? parent.gMain.resourceRoot : location.protocol + '//' + location.host + parent.gMain.resourceRoot;
        this.staSmall = this.path + "/images/letter/";
        this.staOther = this.path + "/images/letter/";
        this.staBody = this.path + "/images/letter/";

        for( i = 0; i < this.count; i++) {
            this.list[i] = {
                smallImg : this.staSmall + "pic" + (i + 1) + ".gif"
            };
        }
    },
    //信纸列表
    draw : function() {
        var td = $("tdStationery");
        if(td.innerHTML != "") {
            return;
        }
        if(this.list.length == 0) {
            this.init();
        }
        var totalNum = this.count;
        var pageNum = this.pageNum;
        var pageCount = Math.ceil(totalNum / pageNum);
        var curNum = 0;
        var html = [];
        for(var i = 0; i < pageCount; i++) {
            this.pageArr[this.pageArr.length] = "LPPage_" + i;
            html[html.length] = '<div id="LPPage_' + i + '" style="';
            if(i != 0) {
                html[html.length] = 'display:none;';
            }
            html[html.length] = '\">';
            for(var j = 0; j < pageNum && curNum < totalNum; j++) {
                var imgPath = this.list[curNum].smallImg;
                html[html.length] = '<a href="javascript:fGoto();"  onclick="LP.setStationery(' + curNum + ');return false;"><img alt="" src="' + imgPath + '" /></a>';
                curNum++;
            }
            html[html.length] = '</div>';
        }
        $("spanPageNum").innerHTML = "1/" + this.pageArr.length;
        td.innerHTML = html.join("");
    },
    //设置信纸
    setStationery : function(index) {
        index = Math.max(index, 0);
        index = Math.min(index, this.list.length - 1);
        var folderName = this.list[index].smallImg.replace(".gif", "");
        //显示图标的图片名与信纸对应文件夹是同名
        var folderUrl = folderName + "/";
        //文件夹的路径
        Editor.setLetter(folderUrl);
        try{
            oTemplate.setEdit(Editor.win);
        }
        catch(e){
            
        }
    },
    showNextPage : function() {
        this.curPage++;
        if(this.curPage >= this.pageArr.length) {
            this.curPage = 0;
        }
        this.showCurPage();
    },
    showPrevPage : function() {
        this.curPage--;
        if(this.curPage < 0) {
            this.curPage = this.pageArr.length - 1;
        }
        this.showCurPage();
    },
    showCurPage : function() {
        var spanPageNum = $("spanPageNum");
        spanPageNum.innerHTML = (this.curPage + 1) + "/" + this.pageArr.length;
        for(var i = 0; i < this.pageArr.length; i++) {
            if(i == this.curPage) {
                $(this.pageArr[i]).style.display = "";
            } else {
                $(this.pageArr[i]).style.display = "none";
            }
        }
    },
    //清除信纸
    clearStationery : function() {
        Editor.clearLetter();
    }
};

/***
 * 编辑器对象
 */
var b_isIE9 = (top.Browser.isIE && top.Browser.ie == 9);
var b_isIEAndNot9 = (top.Browser.isIE && top.Browser.ie != 9);
var savedBookmark = null;

var Editor = {
    menu : null,
    isHtml : true,
    initilized: false,
    lpImgNum : 8,
    signNameLen : 20, //写信页面签名名称显示最大字节数.......
    /**初始化编辑器*/
    init : function() {
        if(this.initilized == true){
            return;
        }
        try {
            var ifm = $("htmlEditor");
            var f = ifm.contentWindow;
            var doc = f.document;
            var body = doc.body;
            if(ifm.style.display != "none") {
                if(document.addEventListener) {
                    doc.addEventListener("click", function() {
                        Editor.hideMenu();
                    }, true);
                } else if(document.attachEvent) {
                    doc.attachEvent("onclick", function() {
                        Editor.hideMenu();
                    });
                }
                if(!parent.Browser.isIE) {
                    doc.designMode = "on";
                    //文档进入可编辑模式
                    doc.contentEditable = true;
                }
            }
            this.ifmElement = ifm;
            this.win = f;
            this.doc = doc;
            this.body = body;
            this.editorValue = this.getEditorValue() || '';
            this.$ = function(id) {
                return Editor.doc.getElementById(id);
            };
            if(parent.documentEventManager){
                parent.documentEventManager.addDoc(doc);
            }
        } catch (e) {
        }
        
        if(top.Browser.isIE && this.doc && this.ifmElement){
            parent.EV.observe(this.ifmElement, 'beforedeactivate', function(){
                savedBookmark = Editor.getBookMark(Editor.doc);
            });
            parent.EV.observe(this.ifmElement, 'activate', function(){
                if(savedBookmark){
                    Editor.moveToBookMark(Editor.doc, savedBookmark);
                    savedBookmark = null;
                }
            });
        }
        // zengyi ctrl+v
        void function($){
            //ss var agent=navigator.userAgent.toLowerCase();
            var browser=$.browser,isIE=browser.msie,isOpera=browser.opera;
            if(!isOpera){
                $(isIE?body:doc).bind(isIE?'beforepaste':'paste',function(e){
                    return window.captureClipboard && window.captureClipboard();
                });
            }else $(doc).bind("keydown",function(e){
                if(e.ctrlKey&&e.which===86){
                    return window.captureClipboard && window.captureClipboard();
                }
            });
        }(jQuery);
       
       void function($){
            $("#editor_spellcheck").bind("click",Editor.spellCheck);
        }(jQuery);
        this.initilized = true;
    },
    showMenu : function(id) {
        if(!Editor.getEditorMode()) {
            Editor.menu = null;
            return;
        }
        var obj = $(id);
        Editor.hideMenu();
        obj.style.display = "block";
        Editor.menu = obj;
        if(!isIE){
            Editor.win.blur();
        }
        var ev = parent.EV.getEvent();
        if(ev){
            parent.EV.stopEvent(ev);
        }
    },
    /**隐藏菜单*/
    hideMenu : function() {
        var menu = this.menu;
        if(menu) {
            menu.style.display = "none";
        }
    },
    /**
     * 编辑器功能操作
     * @param {Object} type 菜单操作
     * @param {Object} name 操作类型
     */
    doMenu : function(type, name) {
        var support = true;
        
        if(!Editor.getEditorMode()) {
            this.menu = null;
            return;
        }
        
        switch(type.toLowerCase()){
            case 'insertimage':
                if(b_isIEAndNot9){                  
                    Editor.win.focus();
                    var html = "<img crs='{0}' src='{0}' />".format(name);
                    var sel = Editor.getSelection(Editor.win);
                    var range = Editor.getRangeObj(sel);
                    if (sel.type && sel.type.toLowerCase() == 'control') {
                        range.item(0).outerHTML = html;
                    } else {
                        try {
                            range.pasteHTML(html);
                        } catch (e) {
                            Editor.body.innerHTML = html + Editor.body.innerHTML;
                        }
                    }
                    jQuery("img[crs='{0}']".format(name), Editor.doc).each(function(){
                        this.src = name;
                        jQuery(this).removeAttr('crs');
                    });
                    support = false;
                }
                else{
                    support = true;
                }
            break;
            case 'createlink':
                if(Editor.getSelectedText(Editor.win) == ''){
                    CC.alert(parent.Lang.Mail.tips044);
                    return;
                }
                
                CC.prompt({
                    id: 'link_promot',
                    html: parent.Lang.Mail.tips045 + '$TEXT$',
                    seize: 30,
                    maxlength: 500,
                    value: ''
                }, function(obj){
                    name = obj.value;
                    if(name && name.indexOf('://') <=0 ){
                        name = window.location.protocol + '//' + name;
                    }
                    if(name){
                        execCommand();
                    }
                },parent.Lang.Mail.tips046,function(){
                    support = false;
                });
                support = false;
            break;
            default :
                support = true;
        }
        
        if(support){
            execCommand();
        }
        
        function execCommand(){
            Editor.win.focus();
            if(!name) {
                if(isIE) {
                    Editor.doc.execCommand(type);
                } else {
                    Editor.doc.execCommand(type, false, false);
                }
            } else {
                Editor.doc.execCommand(type, false, name);
            }
        }
        
        Editor.hideMenu();
    },
    /**
     * 获取选中区域文本
     */
    getSelectedText: function(win){
        if (win.getSelection) {         
            return win.getSelection().toString();     
        }else if(win.document.getSelection){      
            return win.document.getSelection();     
        }else if (win.document.selection){
            return win.document.selection.createRange().text;
        }
        return "";
    },
    /**
     * 编辑器添加图片
     */
    createImages : function() {
        if(!Editor.getEditorMode()) {
            Editor.menu = null;
            return;
        }
        Editor.hideMenu();
        Editor.menu = $("divImage");
        var div = $("divImage");
        div.style.display = "block";
        if(!isIE){
            Editor.win.blur();
        }
        if(div.innerHTML == "") {
            var url = top.gConst.composeUploadImgUrl;
            div.innerHTML = "<iframe id='frmImg' border=0 marginWidth=0 marginHeight=0 frameBorder=no style='width:350px;height:186px' src='#'></iframe>";
            $("frmImg").src = url + '&rnd=' + (+new Date());
        }
        var ev = parent.EV.getEvent();
        if(ev){
            parent.EV.stopEvent(ev);
        }
    },
    /**
     * 显示表情
     */
    showPortrait : function() {
        if(!Editor.getEditorMode()) {
            Editor.menu = null;
            return;
        }
        Editor.hideMenu();
        Editor.menu = $("divPortrait");
        var div = $("divPortrait");
        div.style.display = "block";
        if(!isIE){
            Editor.win.blur();
        }
        if(div.innerHTML == "") {
            var url = parent.gConst.portraitUrl;
            div.innerHTML = "<iframe id='frmPortrait' border='0' marginWidth=0 marginHeight=0 frameBorder=no style='width:208px;height:202px' src='#'></iframe>";
            $("frmPortrait").src = url + '&rnd=' + (+new Date());
        }
        var ev = parent.EV.getEvent();
        if(ev){
            parent.EV.stopEvent(ev);
        }
    },
    /**
     * 截屏按钮响应事件
     */
    captureScreen : function() {
        //if(GC.check("MAIL_WRITE_CAPTURE")) {
            window.captureScreen();
        //} else {
        //  CC.alert(Lang.Mail.error_FA_FORBIDDEN);
        //}
    },
    /**
     * 信纸按钮链接
     * 显示信纸右选项图表
     */
    addLetters : function() {
        oWrite.showLetterPaper();
    },
    /**
     * 显示签名选项列表
     */
    showSign : function() {
        if(!Editor.getEditorMode()) {
            Editor.menu = null;
            return;
        }
        Editor.hideMenu();
        Editor.menu = $("sign");
        var div = $("sign");
        var content = $('signature');
        div.style.display = "block";
        content.innerHTML = "";
        var nL = Editor.signNameLen;
        var signList = oWrite.signList;
        var corpSignList = oWrite.corpSignList;
        var html = [], tips = "", name = "";
        html.push("<li><a href='jacascript:fGoto();' onclick='Editor.setSignIndex(\"-1\"); return false;' title='"+parent.Lang.Mail.tips047+"' class='notuse'>"+parent.Lang.Mail.tips047+"</a>");
        if(signList.length > 0){
            for(var i = 0; i < signList.length; i++) {
                tips = signList[i].title;
                name = signList[i].title.decodeHTML().left(nL, true).encodeHTML();
                //.left(nL,true);
                html.push("<li><a href=\"javascript:fGoto();\" onclick=\"Editor.setSignIndex('" + i + "')\" title=\"" + tips + "\">" + name + "</a></li>");
            }
            html.push('<li class="line"></li>');
        }
        if(corpSignList.length >0){
            for(var i = 0; i < corpSignList.length; i++) {
                tips = corpSignList[i].title;
                name = corpSignList[i].title.decodeHTML().left(nL, true).encodeHTML();
                html.push("<li><a href=\"javascript:fGoto();\" onclick=\"Editor.setSignIndex('" + i + "', true)\" title=\"" + tips + "\">" + name + "</a></li>");
            }
            html.push('<li class="line"></li>');
        }
        html.push("<li><a href='javascript:fGoto();' onclick=\"Editor.addSign()\"  class=\"set\">" + Lang.Mail.Write.msg_edit_sign + "</a></li>");
        content.innerHTML = html.join('');
        var ev = parent.EV.getEvent();
        if(ev){
            parent.EV.stopEvent(ev);
        }
    },
    /**
     * 选择签名
     * @param {int} index
     */
    setSignIndex : function(index, isCorp) {
        var non = false;
        if(index == '-1'){
            Editor.clearSign();
            return ;
        }
        Editor.hideMenu();
        var htmlMode = Editor.getEditorMode();
        var sign = isCorp ? oWrite.corpSignList[index] : oWrite.signList[index];        
        Editor.setSign(sign);
    },
    setSign : function(sign) {
        if(!sign) {
            return;
        }

        
        var content = sign.content.decodeHTML().decodeHTML();

        if(sign.isAutoDate) {
            content += "<br><br>" + top.Util.formatDate(new Date(), "yyyy-mm-dd");
        }
        var body = Editor.doc.getElementsByTagName("BODY")[0];
        var divSign = Editor.$("divsignature");
        var back = Editor.$("backPic1");
        if(back) {    //有信纸
            var objBack = Editor.$("backPic3");
            if(divSign) {    //已经有签名
                divSign.innerHTML = "---------<br>" + content;// + "<br><br>";
            } else {
                objBack.innerHTML = objBack.innerHTML + "<div>&nbsp;</div><div>&nbsp;</div><div>&nbsp;</div><br><div id='divsignature'>---------<br>" + content + "</div>";
            }
        } else {
            if(divSign) {
                divSign.innerHTML = "---------<br>" + content;// + "<br><br>";
            } else {
                body.innerHTML = body.innerHTML + "<br><div id='divsignature'>---------<br>" + content + "</div>";
            }
        }
        oTemplate.setEdit(Editor.win);
    },
    /**
     * 清除签名
     */
    clearSign: function(){
        var divSign = Editor.$("divsignature");
        if(divSign){
            divSign.innerHTML = '';
        }
        Editor.hideMenu();
    },
    /**
     * 跳转至添加签名页
     */
    addSign : function() {
        Editor.hideMenu();
        parent.CC.setConfig("sign");
    },
    /**
     * 设置默认签名
     */
    setDefaultSign : function(sign) {
        var defaultSign = "",signList = parent.signList.concat(parent.corpSignList) ,isLoadSign=false;
        for(var i = 0,j=signList.length;i<j;i++){
            if(signList[i].isDefault=="1"){
                oWrite.ue.setContent("<br/><br/><span id=\"divsignature\">"+signList[i].content.decodeHTML()+"<br/>"+(signList[i].isAutoDate=="1"?new Date().format("yyyy-mm-dd"):"")+"</span>");
                isLoadSign =true;
                break;
            }
        }
        if(!isLoadSign && signList.length>0){
            oWrite.ue.setContent("<br/><br/><span id=\"divsignature\">"+signList[0].content.decodeHTML()+"<br/>"+(signList[0].isAutoDate=="1"?new Date().format("yyyy-mm-dd"):"")+"</span>");
        }
    },
    pureText : function(obj) {
        var p = this;
        Editor.hideMenu();
        Editor.menu = null;
        var txtEditor = $("sourceEditor");
        var htmlEditor = $("htmlEditor");
        var spanEditor = $("spanEditor");
        var editorToolbarUp = $('editor_tool_bar_up');
        var switchCase = $('editor_menu_switch');
        var body = Editor.doc.getElementsByTagName("BODY")[0];
        if(p.isHtml) {
            parent.CC.confirm(Lang.Mail.Write.htmltool_texteditor_changetips, function() {
                txtEditor.style.display = "";
                htmlEditor.style.display = "none";
                editorToolbarUp.style.display = 'none';
                spanEditor.style.visibility = "hidden";
                txtEditor.value = Editor.getHtmlToTextContent();
                obj.childNodes[0].innerHTML = Lang.Mail.Write.htmltool_htmlEditor;
                switchCase.onclick();
                p.isHtml = false;
            });
        } else {
            txtEditor.style.display = "none";
            htmlEditor.style.display = "";
            editorToolbarUp.style.display = '';
            spanEditor.style.visibility = "visible";
            body.innerHTML = Editor.getTextToHtmlContent();
            obj.childNodes[0].innerHTML = Lang.Mail.Write.htmltool_texteditor;
            switchCase.onclick();
            p.isHtml = true;
        }
    },
    getHtmlToTextContent : function() {
        var body = Editor.doc.getElementsByTagName("BODY")[0];

        var content = "";
        if(isIE) {
            content = body.innerText;
        } else {
            var tmp = body.innerHTML;
            tmp = tmp.replace(/<script(?:.*?)>.*?<\/script>/g, "");
            tmp = tmp.replace(/<style(?:.*?)>.*?<\/style>/g, "");
            if(tmp == "" || tmp == "<br>" || tmp == "<br/>") {
                return "";
            } else {
                tmp = tmp.replace(/<br\s?\/?>/ig, "\n");
                var div = document.createElement("div");
                div.innerHTML = tmp;
                content = div.textContent;
            }
        }
        return content;
    },
    getTextToHtmlContent : function() {
        var content = $("sourceEditor").value;
        var div = document.createElement("div");
        if(isIE) {
            content = content.replace(/\r?\n/g, "<br>");
            content = content.replace(/ /g, "&nbsp;");
            div.innerHTML = content;
            return div.innerHTML;
        } else {
            div.appendChild(document.createTextNode(content));
            return div.innerHTML.replace(/\n/g, "<br>");
        }
    },
    /**
     * 取编辑器模式
     */
    getEditorMode : function() {
        return this.isHtml;
    },
    /**
     * 设置信纸
     * @param {string} folderUrl 信纸路径
     */
    setLetter : function(folderUrl) {
        
        var oldContent = oWrite.ue.getContent();
        var isOk=false; 
        var oriMsgHtmlSeperator = jQuery("#oriMsgHtmlSeperator",oWrite.ue.document);
        
        for(var i = 1; i < 8; i++) {
            obj = jQuery("#backPic" + i,oWrite.ue.document);
            if(obj.length>0) {
                if(i == 6) {
                    obj.attr("src",folderUrl + i + ".gif") ;
                } else {
                    jQuery(obj).css("background-image", 'url(' + folderUrl + i + ".gif" + ')');
                }
                isOk = true;
            }
        }
        if(isOk){
            return;
        }
        var str = "<TABLE id='backPic1' cellSpacing='0' cellPadding='0' width='99.9%' style=\"background:url(" + folderUrl + "1.gif);margin-bottom:0;\" border='0'><TBODY><TR><TD height='100' style='border:0;padding:0' contentEditable=false unselectable=on>&nbsp;</TD></TR></TBODY></TABLE><TABLE cellSpacing='0' id='backPic2' cellPadding='0' width='99.9%' style=\"background:url(" + folderUrl + "2.gif);margin-bottom:0;\"><TBODY><TR><TD style='border:0;padding:0' width='5%' contentEditable=false unselectable='on'></TD><TD  id='backPic3' style='FONT-SIZE: 12px; COLOR: #666666; LINE-HEIGHT: 25px; background:url(" + folderUrl + "3.gif) repeat;border:0;padding:0' vAlign='top' width='90%'><DIV><STATIONERY>"+(oldContent.length>0?"":"<BR><BR>")+ "<DIV id='stContent'>" + oldContent + "</DIV></STATIONERY></DIV></TD><TD width='5%' style='border:0;padding:0' contentEditable=false unselectable='on'></TD></TR></TBODY></TABLE><TABLE id='backPic4' style='background:url(" + folderUrl + "4.gif) repeat-x 50% top;' cellSpacing='0' cellPadding='0' width='99.9%'><TBODY><TR><TD id='backPic5' style='border:0;padding:0;BACKGROUND-POSITION: 0px 100%; BACKGROUND-REPEAT: no-repeat' width='125' ><IMG id='backPic6' contentEditable=false unselectable=on  height='147' src='" + folderUrl + "6.gif' width='320'></TD><TD id='backPic7' contentEditable=false unselectable=on style='border:0;padding:0;background:url(" + folderUrl + "7.gif) no-repeat 100% 100%;'>&nbsp;</TD></TR></TBODY></TABLE>";
        oWrite.ue.setContent(str);
    },
    /**
     * 清除信纸
     */
    clearLetter : function() {
        var body = oWrite.ue.document.getElementsByTagName("BODY")[0];
        var obj1 = oWrite.ue.document.getElementById("backPic1");
        if(obj1 != null && obj1 != undefined) {
            var s = oWrite.ue.document.getElementById("backPic3");
            if(s != null && s != undefined) {
                body.innerHTML = s.innerHTML;
            }
        }
    },
    /**
     * 编辑器焦点定位
     */
    editorFocus : function(len) {
        //var pn = len || parseInt(18, 10);
        //parent.El.setCursorPos(Editor.doc.body);
    },
    /**
     * 编辑器定位 =》模板使用
     */
    setEditorFocus: function(){
        var doc = Editor.doc;
        if(document.all){
            var r = doc.body.createTextRange();
            r.moveStart("character", 0);
            r.moveToElementText(doc.getElementById('stContent').firstChild.firstChild || doc.getElementById('stContent'));
            r.collapse(false);
            r.select();
        }
    },
    /**
     * 得到编辑器文本框值
     */
    getEditorValue : function() {
        return oWrite.ue.getContent();
    },
    /**
     * 设置编辑器文本框值
     */
    setEditorValue : function(content) {
        oWrite.ue.setContent(content);
    },
    /**
     * 检查编辑器内容是否有变化
     */
    checkValueChange: function(){
        var oldValue = this.editorValue || '';
        var curValue = this.getEditorValue();
        var chk = oldValue == curValue;
        this.editorValue = curValue;
        return chk;
    },
    /**
     *
     */
    changeBackPic : function() {
        var htmlMode = Editor.getEditorMode();
        if(htmlMode) {
            var doc = Editor.doc;
            var getEle = Editor.$;
            var len = Editor.lpImgNum;
            var obj = getEle("backPic1"), temp = "";
            if(!obj) {
                return;
            }
            for(var i = 2; i <= len; i++) {
                temp = getEle("backPic" + i);
                temp.id = temp.id + "1";
            }
        }
    },
    blankClick : function() {
        Editor.hideMenu();
    },
    showTableSelect: function(){
        var container = $('tabSelect');
        var row = 10, col = 10;
        var selectedClass = 'on';
        var tabRows = [];
        
        Editor.hideMenu();
        Editor.menu = container;
        for(var i=0; i<row;i++){
            tabRows.push('<tr>')
            for(var j=0;j<col;j++){
                tabRows.push('<td r="' + i + '" c="' + j + '"><div></div></td>');
            }
            tabRows.push('</tr>');
        }
        container.innerHTML = '<p id="tabSelect_tips">' + Lang.Mail.Write.choseTableSize + '</p>' +
                              '<table><tbody>' + tabRows.join('') + '</tbody></table>';
        Editor.menu.style.display = 'block';
        if(!isIE){
            Editor.win.blur();
        }
        jQuery('#tabSelect td').unbind('mouseover').bind('mouseover', function(){
            var r = parseInt(jQuery(this).attr('r'));
            var c = parseInt(jQuery(this).attr('c'));
            jQuery('#tabSelect_tips').html(Lang.Mail.Write.insertTableTips.format(r+1, c+1));
            jQuery('#tabSelect td').each(function(i,v){
                if(jQuery(this).attr('r')<=r && jQuery(this).attr('c')<=c){
                    jQuery(this).addClass(selectedClass);
                }
                else{
                    jQuery(this).removeClass(selectedClass);
                }
            });
        }).unbind('click').bind('click', function(){
            var r = parseInt(jQuery(this).attr('r'));
            var c = parseInt(jQuery(this).attr('c'));
            var body = Editor.doc.getElementsByTagName("BODY")[0];
            var trs = [],html;
            
            for(var i=0;i<=r;i++){
                trs.push('<tr>');
                for(var j=0;j<=c;j++){
                    if(top.Browser.isIE){
                        trs.push('<td style="width:50px;">&nbsp;</td>');
                    }
                    else{
                        trs.push('<td style="min-width:50px;">&nbsp;</td>');
                    }
                }
                trs.push('</tr>');
            }
            
            html = '<table cellspacing="0" cellpadding="0" border="1"><tbody>' + trs.join('') + '</tbody></table>';
            
            Editor.insertHTML(html);
            Editor.hideMenu();
        });
     },
    getRangeObj: function(rang){
        if(rang.createRange){
            return rang.createRange();
        }
        else{
            if(rang.getRangeAt){
                return rang.getRangeAt(0);
            }
            else{
                if(Editor.doc.createRange){
                    var d = Editor.doc.createRange();
                    d.setStart(rang.anchorNode, rang.anchorOffset);
                    d.setEnd(rang.focusNode, rang.focusOffset);
                    return d;
                }
            }
        }
    },
    getSelection: function(win){
        win = win || window;
        var s;
        if(win.getSelection){
            s = win.getSelection();
        }
        else{
            if(win.document.selection){
                s = win.document.selection;
            }
        }
        return s;
    },
    insertHTML: function(html){
        Editor.win.focus();
        var sel = this.getSelection(Editor.win), ran = this.getRangeObj(sel);
        var Browser = Browser || parent.Browser;
        if(!Browser.isIE){
            ran.deleteContents();
            var f = ran.createContextualFragment(html), l = f.lastChild;
            ran.insertNode(f);
            ran.setEndAfter(l);
            ran.collapse(false);
            sel.removeAllRanges();
            sel.addRange(ran);
        }
        else{
            if(Browser.ie >= 9){
                ran.deleteContents();
                var div = Editor.win.document.createElement('div');
                div.innerHTML = html;
                var b = div.firstChild;
                ran.insertNode(b);
                ran.setEndAfter(b);
                ran.collapse(false);
                sel.removeAllRanges();
                sel.addRange(ran);
            }
            else{
                if(sel.type && sel.type.toLowerCase() == "control") {
                    ran.item(0).outerHTML = html;
                } else {
                    try {                       
                        ran.pasteHTML(html);
                    } catch(e) {
                        Editor.body.innerHTML = html + Editor.body.innerHTML;
                    }
                }
            }
        }
    },
    /**
     * 获取书签
     * @param {object} doc : document object
     * @return {object} bookmark
     */
    getBookMark: function(doc){
        var range = doc.selection.createRange();
        var textLength = doc.body.innerHTML.length;
        var result = {};
        if (range.getBookmark) {
            result.bookmark = range.getBookmark();
            result.startOffset = range.moveStart("character", -textLength);
            result.endOffset = range.moveEnd("character", textLength);
        }
        return result;
    },
    /**
     * 移动到书签
     * @param {object} doc: document object.
     * @param {object} mark: bookmark object.
     * move to the correct position.
     */
    moveToBookMark: function(doc, mark){
        if (!mark || !mark.bookmark) return;
        var range = doc.body.createTextRange();
        var textLength = doc.body.innerHTML.length;
        range.moveToBookmark(mark.bookmark);
        var copy = range.duplicate();
        var startOffset = copy.moveStart("character", -textLength);
        var endOffset = copy.moveEnd("character", textLength);
        if (startOffset != mark.startOffset || endOffset != mark.endOffset) {
            range.moveStart("character", startOffset - mark.startOffset);
            range.moveEnd("character", endOffset - mark.endOffset);
        }
        try{
            range.select();
        }catch(e){}
    },
    /**
     * 拼写检查
     * 
     */
    spellCheck:function() {
        //下一次检测的时候需要去掉上一次wrap的错误标示标签
        if(checkSpell.res.length>0){
            var ifmDoc = $("htmlEditor").contentWindow.document;
            checkSpell.ignoreAll(ifmDoc);
        }
        var _str = Editor.getEditorValue();
        var noTagStr = Editor.getHtmlToTextContent() || '';
        jQuery("#editor_spellcheck").html(Lang.Mail.Write.zhongxinjiancha);
        if(checkSpell.checkState==1){//正在检查请稍候重试
            parent.CC.showMsg(Lang.Mail.Write.zhengzaijiancha, true, false, 'caution');
        }
        var checkOrNot = false;
        if (!/[a-zA-z]+/.test(noTagStr)) {
            parent.CC.alert(Lang.Mail.Write.dbqpxzzcyw, null, Lang.Mail.Write.xitongtishi);
            checkOrNot =  false;
        } else {
            if (/[\u4E00-\u9FA5]+/.test(noTagStr)) {
                var customSpellChkMemoray =CC.getUserAttributeFromLocal('_custom_editorSpellChkTip')
                var needTips = customSpellChkMemoray !==""  ? false : true ;
                var ao = {
                    id : 'confirm',
                    title: Lang.Mail.Write.xitongtishi,
                    type : 'text',
                    text : '+Lang.Mail.Write.pxjczyywpx+'<br><br>                         <input id="editorSpellChkTip" type="checkbox"/>'+Lang.Mail.Write.buzaitishi+',
                    zindex:1090,
                    dragStyle:1,
                    buttonType:'confirm',
                    buttons: [{
                        text: Lang.Mail.Write.jiancha,
                        clickEvent: function(){
                            checkSpell.doCheck(_str);
                            var chk = jQuery('#editorSpellChkTip',parent.window.document).prop("checked");
                            if(chk){
                                CC.writeUserAttributesToServer({_custom_editorSpellChkTip: '1'}) 
                            }
                        }
                    }, {
                        text: Lang.Mail.Write.bujiancha,
                        clickEvent: function() {
                            var chk = jQuery('#editorSpellChkTip',parent.window.document).prop("checked");
                            if(chk){
                                CC.writeUserAttributesToServer({_custom_editorSpellChkTip: '1'}) 
                            }
                    },
                        isCancelBtn: true
                    }]
                };
                if(needTips){//需要提示
                    parent.CC.msgBox(ao);
                }else{//保存过用户习惯 不需要提示 
                    checkOrNot = true;
                }
            }else{
                checkOrNot = true;
            }
        }
        var tmpreg = /<(script|style)(?:.*?)>.*?<\/\1>/g;
        checkSpell.toBeAdded = _str.match(tmpreg)||[];
        _str = _str.replace(tmpreg, "");
        if(checkOrNot){checkSpell.doCheck(_str)}
    }
};
var checkSpell = {
    checkState:0,//0检查之前 1正在检查 2检查完成
    res:[],//错误单词结果数组
    tagArr:[],//送检过滤掉的html标签数组
    listNum:5,//错误单词建议提示项数
    toBeAdded:[],//脚本样式不用检测，送检前过滤掉了，回显时需要加上
    doCheck:function(_str){
        var _str =     _str.replace(/\r\n|\r|\n/g, "").replace(/(<(\/div|br\s*\/?)>)/gi,'\n$1'),
            tagReg     = /(?:<.*?>)+/g,             //标签正则
            tagArr     = _str.match(tagReg)||[];    //标签数组

        pureTxtArr = _str.split(tagReg);   //标签分隔后的纯文本数组
        var  pureTxtArr = checkSpell.arrFilter.call(pureTxtArr,function(i){return (i !== undefined && i !== "");}), //过滤掉 split可能产生的undefined项
        pureTxtStr = pureTxtArr.join(""),   //纯文本
        reTxt      = [],                    //返回结果
        pureTxtItemRed = [];                //pureTxtArr 各项pos范围内的错误信息数组
            
        parent.CC.showMsg(Lang.Mail.Write.zhengzaijiancha, true, false, 'option');
        checkSpell.checkState = 1;//正在检查
        var htmlStr = "<div id=\"checkSpellLayout\" style=\"position: absolute; z-index: 1000; height: 100%; width: 100%; top: 0px; left: 0px;\"></div>";
        jQuery(".editorWrap").append(htmlStr);
        pureTxtStr = pureTxtStr.decodeHTML();
        // 请求检查结果
        jQuery.ajax({
            type: "POST",
            url: top.gMain.urlService+"/mail/conf.do?func="+top.gConst.func.spellCheck+"&sid="+top.gMain.sid+"&r="+new Date().getTime(),
            data:pureTxtStr,
            contentType:"application/json",
            dataType: "json",
            success:function(_res){
                //扩展错误单词信息 分配id， containTag这个单词起始字符之间的标签
                var scanPos=0,i=0,k=0;
                if(_res.code=="S_OK"){
                    _res=_res["var"];
                }else{
                    parent.CC.showMsg(Lang.Mail.Write.hbqpxjcccl, true, false, "error");
                    return;
                }
                if(_res==null||_res.length<1){
                    parent.CC.showMsg(Lang.Mail.Write.jianchachenggong, true, false, 'option');
                    checkSpell.checkState = 2;//2检查完成
                    jQuery("#checkSpellLayout").remove();
                    return;
                }
                checkSpell.arrrForEach.call(_res,function(_v,_i){
                    var spanId = new Date();
                    spanId = spanId.getTime() + Math.random() + "";
                    _res[_i].sId  = spanId;
                    _res[_i].containTag = [];
                    _res[_i].pos = parseInt(_res[_i].pos);
                });
                checkSpell.res = _res;
                checkSpell.tagArr = tagArr;
                checkSpell.arrrForEach.call(pureTxtArr,function(_arr,_index){
                    pureTxtArr[_index] = pureTxtArr[_index].decodeHTML();
                });
                for (; i < pureTxtArr.length; i++) {
                    var tmpScanPos = scanPos;
                    scanPos += pureTxtArr[i].length;
                    pureTxtItemRed[i] = [];         //pureTxtArr[i]里的错误
                    for (; k < _res.length;k++ ) {
                        if(_res[k].pos< scanPos && _res[k].pos+_res[k].src.length>scanPos){
                            pureTxtItemRed[i].push({
                                                "src": _res[k].src,
                                                "pos": _res[k].pos-tmpScanPos,
                                                "sId":_res[k].sId
                                            });
                            break;
                        }else if(_res[k].pos< tmpScanPos && _res[k].pos+_res[k].src.length>tmpScanPos){
                            pureTxtItemRed[i].push({
                                                "src": _res[k].src,
                                                "pos": _res[k].pos-tmpScanPos,
                                                "sId":_res[k].sId
                                            });
                            k++;
                            break;
                        }else if(_res[k].pos< scanPos){
                            pureTxtItemRed[i].push({
                                                "src": _res[k].src,
                                                "pos": _res[k].pos-tmpScanPos,
                                                "sId":_res[k].sId
                                            });
                        }else{
                            break;
                        }
                    };
                };
                checkSpell.arrrForEach.call(pureTxtItemRed,function(_arr,_index){ //处理pureTxtArr里每一项所包含的所有错误单词，包裹标签
                    pureTxtArr[_index] = checkSpell.addRedSpan(_arr,pureTxtArr[_index]);

                });
                for (var i = 0; i < Math.max(tagArr.length, pureTxtArr.length); i++) { //拼接源格式中的标签和处理过错误的纯文本
                    if (tagArr[i]) {
                        reTxt.push(tagArr[i]);
                    }
                    if (pureTxtArr[i]) {
                        reTxt.push(pureTxtArr[i].replace(/\n/g, ""));
                    }
                };
                for (var j = 0,len=checkSpell.toBeAdded.length;j < len; j++) {
                    reTxt.push(checkSpell.toBeAdded[j]);
                };
                Editor.setEditorValue(reTxt.join("").replace(/&nbsp;/g, " "));

                var ifmDoc = $("htmlEditor").contentWindow.document;
                jQuery("span.errorWord",ifmDoc).bind("click",function(event){
                    var eTarget = event.currentTarget; 
                        checkSpell.showSuggestPanel.call(eTarget,ifmDoc);
                    event.stopPropagation();
                });
                parent.CC.showMsg(Lang.Mail.Write.jianchachenggong, true, false, 'option');
                checkSpell.checkState = 2;//2检查完成
                jQuery("#checkSpellLayout").remove();
            },
            fail: function () {
                jQuery("#checkSpellLayout").remove();
            }
        });
    },
    //错误单词字符内部有无没闭合的标签 [table Todo]
    hasUnCloseTag:function (_errorId){
        var tagStr = "",ctagArr = [];
        var preSpanReg=/<[^>/]*>$/,lastSpanReg=/^<\/[^>*]>/;
        for (var i = 0; i < checkSpell.res.length; i++) {
            if(checkSpell.res[i].sId == _errorId){
                ctagArr = checkSpell.res[i].containTag;
                for(var j=0;j<ctagArr.length;j++){
                    tagStr += checkSpell.tagArr[ctagArr[j]];
                };
                break;
            }
        };
        return preSpanReg.test(tagStr)||lastSpanReg.test(lastSpanReg);
    },
    //错误单词包裹标签，如果某个错误单词字符内部有未闭合的标签 则不包裹
    addRedSpan:function (_arr,_str){
        var txt = _str,resTxt=[],searchPos = txt.length;
        for (var i = _arr.length - 1; i >= 0; i--) {
            var redWordStartPos = _arr[i].pos,wordLen = _arr[i].src.length;
            if(redWordStartPos>=0){
                if(redWordStartPos+wordLen>searchPos){
                    if(!checkSpell.hasUnCloseTag(_arr[i].sId)){
                        resTxt.unshift("<span class='errorWord' id='"+_arr[i].sId+"'>"+txt.substring(redWordStartPos).encodeHTML());
                    }else{                  //单词字符内部有未闭合的标签
                        resTxt.unshift(txt.substring(redWordStartPos).encodeHTML());
                    }
                }else{
                    resTxt.unshift("<span class='errorWord' id='"+_arr[i].sId+"'>"+txt.substring(redWordStartPos,redWordStartPos+wordLen).encodeHTML()+"</span>"+txt.substring(redWordStartPos+wordLen,searchPos).encodeHTML());
                }
            }else if(redWordStartPos<0){ 
                if(Math.abs(redWordStartPos)+searchPos>=wordLen){
                    if(!checkSpell.hasUnCloseTag(_arr[i].sId)){
                        resTxt.unshift(txt.encodeHTML().substring(0,redWordStartPos+wordLen)+"</span>"+txt.encodeHTML().substring(redWordStartPos+wordLen));
                    }else{                  //单词字符内部有未闭合的标签
                        resTxt.unshift(txt.encodeHTML().substring(0,redWordStartPos+wordLen)+txt.encodeHTML().substring(redWordStartPos+wordLen));
                    }
                }else{
                        resTxt.unshift(txt.encodeHTML());
                }
            }
            searchPos = redWordStartPos;
        };
        resTxt.unshift(txt.substring(0,searchPos).encodeHTML());
        
        return resTxt.join("");
    },
    //错误标识单词点击显示拼写建议面板
    showSuggestPanel:function(doc){
        var panel = jQuery("#suggestPanel"),errorId = this.id;
        if(panel.length<=0){
            panel = document.createElement("div");
            panel.id = "suggestPanel";
            panel.className = "pop_wrapper w135";
            jQuery("#editor_body").append(panel);
            panel.style.textAlign = "center";
            panel.style.zIndex = 1001;
        }else{
            panel.show();
            panel = panel.get(0);
        }
        //错误拼写建议列表
        var panelHtml ='<ul class="module_pop">';
        var errorArr = checkSpell.res||[],len = errorArr.length;
        for (var i = 0; i < len; i++) {
            if(errorArr[i].sId == errorId){
                if(errorArr[i].cases.length>0){
                    for (var j = 0; j < Math.min(checkSpell.listNum,errorArr[i].cases.length); j++) {
                        panelHtml+='<li>'+errorArr[i].cases[j]+'</li>'
                    };
                }else{
                    panelHtml+='<li>'+Lang.Mail.Write.zanwutishi+'</li>';
                }
                break;
            }
        };
        panelHtml+='<li class="line"></li><li>'+Lang.Mail.Write.hulue+'</li><li>'+Lang.Mail.Write.huluequanbu+'</li></ul>';
        panel.innerHTML = panelHtml;
        var $errorWords = jQuery(this);
        var errorCoor = $errorWords.position();
        var stop = doc.documentElement.scrollTop || doc.body.scrollTop;
        var ptop = errorCoor.top-stop > jQuery("#editor_body").outerHeight()/2 ? errorCoor.top-stop+34-panel.offsetHeight: errorCoor.top-stop+34+this.offsetHeight;
        jQuery(panel).css({"left" :errorCoor.left+"px","top":ptop+ "px"});
        jQuery(panel).unbind( "click" ).bind("click",function(event){
            checkSpell.clickSuggestItem.call($errorWords,event,doc);
            jQuery("#suggestPanel").hide();
        }).find("li:not(.line)").hover(
            function(){
                jQuery(this).css("background","#3b5998");
            },function(){
                jQuery(this).css("background","");
            }
        );

        if(parent.documentEventManager){
            //注册全局事件隐藏拼写建议菜单
            parent.documentEventManager.register('hideSpellPanel', function(){
                jQuery("#suggestPanel").hide();

            });
            parent.documentEventManager.addEvent('click', 'hideSpellPanel');
            parent.documentEventManager.addDoc(document);
        }

    },
    //拼写建议项单击
    clickSuggestItem:function(event,doc){
        var target = event.target,$errorWord = this;
        var suggestOpt = target.innerHTML;
        if(jQuery(target).is("li:not(.line)")){
            if (suggestOpt.indexOf(Lang.Mail.Write.quanbu) >= 0) {
                checkSpell.ignoreAll(doc);
            } else {
                if (suggestOpt.indexOf(Lang.Mail.Write.hulue) >= 0) {
                    checkSpell.ignore($errorWord);
                } else {
                    if (suggestOpt && suggestOpt.indexOf(Lang.Mail.Write.zanwutishi) < 0) {
                        checkSpell.wordReplace($errorWord,suggestOpt);
                    }
                }
            }

        }
    },
    //忽略错误
    ignore:function(_errorWord){
        jQuery(_errorWord).replaceWith(jQuery(_errorWord).text());
    },
    //使用选择的建议项替换错误标示的单词
    wordReplace:function(_errorWord,_suggestOpt){
        jQuery(_errorWord).replaceWith(_suggestOpt);
    },
    ignoreAll:function(doc){
        jQuery(".errorWord",doc).each(function(index){
            var thisTxt = jQuery(this).text();
            jQuery(this).replaceWith(thisTxt);
        });
    },
    /**
     * Ajax请求封装
     * @param {object} obj ajax请求hash map
     */
    ajaxRequest: function(obj){
        var callback = obj.callback || function(){};
        var failback = obj.failback || function(){};
        var func = obj.func || '';
        var url = obj.url || '';
        var data = obj.data || [];

        var reqObj = {
            func: func,
            data: data,
            call: callback,
            failCall: failback
        };
        if(url != ''){
            reqObj.url = url;
            parent.MM.mailRequestWebApi(reqObj);
        }
        else{
            parent.MM.mailRequest(reqObj);
        }
    },
    arrrForEach: function(fn, context) {
        for (var k = 0, length = this.length; k < length; k++) {
            if (typeof fn === "function" && Object.prototype.hasOwnProperty.call(this, k)) {
                fn.call(context, this[k], k, this);
            }
        }
    },
    arrFilter: function(fn, context) {
        var arr = [];
        if (typeof fn === "function") {
            for (var k = 0, length = this.length; k < length; k++) {
                fn.call(context, this[k], k, this) && arr.push(this[k]);
            }
        }
        return arr;
    }
};


oWrite.addPlugins('securityMail', {authority: 'MAIL_INBOX_SECURITY'});
/*
function loadWriteScript(){
    Editor.init();
    oWrite.init();
    //upload_module_multiThread.init(true);
};*/
function loadWriteScript(){
    oWrite.ue = UE.getEditor('editor', {
        "elementPathEnabled":false,
        "wordCount":false,
        "autoHeightEnabled":false,
        "sourceEditor":"textarea",
        "initialFrameWidth":"100%"
    });
    oWrite.ue.ready(function(){
        oWrite.init();

        void function($){

            var doc = oWrite.ue.document;
            var body = doc.body;
            var browser = $.browser;

            $(body).bind("click",function(){
                $("#suggestPanel").hide();
            })

            $(doc).bind("paste", function (e) {
                return window.captureClipboard && window.captureClipboard(e, true);
            });

            // IE中无法触发paste事件
            if (window.VBArray) {
                $(doc).bind("keydown", function(e) {
                    if (e.ctrlKey && e.which === 86) {
                        return window.captureClipboard && window.captureClipboard(e, true);
                    }
                });
            }
        }(jQuery);
    })

    create();
};
function create() {
        var elemenetID = "mtUploader" + Math.random();
        if (window.VBArray) {
            var htmlCode = '<OBJECT style="display:none" width="0" height="0" id="'+elemenetID+'" CLASSID="CLSID:354D8141-29AB-41CB-93FA-1908477CAD0C"></OBJECT>';
        } else {
            var htmlCode = '<embed id="' + elemenetID + '" type="application/x-yd-mail139activex" height="1" width="1" hidden="true"></embed>';
        }
        var isFirefox = navigator.userAgent.indexOf("Firefox") > -1;
        if (isFirefox) {
            jQuery(htmlCode).appendTo(top.document.body);
        }  else {
            jQuery(document.body).append(htmlCode);
        }
        if (isFirefox) {
            var obj = top.document.getElementById(elemenetID);
        } else {
            var obj = document.getElementById(elemenetID);
        }
        oWrite.control = obj;
};
/**
 * 插件类状态枚举
 * @type {{unInitiliaze: string, initiliazing: string, initiliazed: string}}
 */
PluginsState = {
    unInitiliaze: '0',
    initiliazing: '1',
    initiliazed:  '2'
};

/**
 * 插件
 * @param name {string} 插件名称
 * @constructor
 */
function Plugins(name){
    var args = [];
    for(var i=1;i<arguments.length;i++){
        args.push(arguments[i]);
    }
    this.name = name; //插件名称
    this.error = {}; //插件错误
    this.info = []; //插件信息
    this.status = PluginsState.unInitiliaze; //插件状态
    this.attrs = {}; //插件对外属性集合
    this.initiliaze.apply(this, args);
};

/**
 * 插件类接口定义
 * @type {Array}
 */
Plugins.methodAPI = ['render', 'init', 'registerEvent', 'run'];
Plugins.items = {};

/**
 * 静态方法
 * 获取插件
 * @param name {string} 插件名称
 */
Plugins.find = function(name){
    if(Plugins.items.hasOwnProperty(name)){
        return Plugins.items[name];
    }
    return false;
};
/**
 * 插件是否可用
 * @param name {string} 插件名称
 */
Plugins.able = function(name){
    var item = Plugins.find(name);
    if(item){
        if(item.status == 'complete'){
            return true;
        }
        else{
            return false;
        }
    }
    return false;
};
/**
 * 添加插件
 * @param item
 */
Plugins.add = function(item){
    if(item && item.name){
        Plugins.items[item.name] = item;
    }
};
/**
 * 删除插件
 * @param name
 */
Plugins.del = function(name){
    if(name && Plugins.items[name]){
        delete Plugins.items[name];
    }
};

/**
 * 插件类原型扩展
 * @type {{initiliaze: Function, clog: Function, log: Function, run: Function}}
 */
Plugins.prototype = {
    initiliaze: function(addons){
        var authority = '', msg = '';

        this.status = PluginsState.initiliazing;
        if(addons && addons[0] && addons[0].authority){
            authority = addons[0].authority.toUpperCase();
        }else{
            authority = this.name.toUpperCase();
        }
        
        if((addons && addons.free === true) || parent.GC.check(authority)){
            this.log('initilazing');
            try{
                this.instance = new window[this.name](addons);
                this.status = PluginsState.initiliazed;
                Plugins.items[this.name] = this.instance;
            }
            catch(e){
                msg = this.name + ' create instance failed.';
                this.log(msg);
                this.error = this.clog(msg);
            }
        }
        else{
            msg = this.name + ' initiliaze failed.';
            this.log(msg);
            this.error = this.clog(msg);
        }
    },
    clog: function(msg){
        return {
            msg: msg,
            time: (new Date()).getTime()
        };
    },
    log: function(msg){
        this.info.push(this.clog(msg));
    },
    run: function(){
        if(this.error && this.error.msg){
            //window.console && window.console.log(this.error.msg);
        }
        else if(this.status = PluginsState.initiliazed && this.instance){
            for(var i= 0, l=Plugins.methodAPI.length;i<l;i++){
                if(typeof this.instance[Plugins.methodAPI[i]] == 'function'){
                    this.instance[Plugins.methodAPI[i]](this.instance);
                }
            }
        }
    }
};

/**
 * 密级邮件
 */
function securityMail(){
    this.initiliaze.apply(this, arguments);
};

securityMail.prototype = {
    initiliaze: function(args){
        this.attrs = args || {};
        this.result = {};
        this.inList = false;
        
        if (jQuery("#security_mail_text")[0]) {
            jQuery("#security_mail_text")[0].innerHTML=Lang.Mail.Write.qingxuanze;
        }
    },
    render: function(){

    },
    init: function(){
        var p = this;
        this.control = {
            listPanel: jQuery('#security_mail_panel'),
            textPanel: jQuery('#security_mail_text'),
            trigger: jQuery('#security_mail_switch')
        };
        this.result.level = -1;
        this.maxLevel = parent.gMain.securityLevel || 0;
        //this.maxLevel = 2;
        this.maxLevel -= 0;
        if (!parent.gMain.secretaryLevelCfg || parent.gMain.secretaryLevelCfg == "") {
            this.sysCorpSecrecy = 2;
        } else {
            this.sysCorpSecrecy = parent.gMain.secretaryLevelCfg;
        }
        this.sysCorpSecrecy  -= 0;
        if (this.maxLevel > this.sysCorpSecrecy ) {
            this.maxLevel = this.sysCorpSecrecy;
        }
        this.control.listPanel.find('li').each(function(i, v){
            if(i>p.maxLevel){
                jQuery(v).hide();
            }
        });
    },
    registerEvent: function(){
        var p = this;
        this.stopEvents();
        this.control.trigger.bind('click', function(){
            p.control.listPanel.show();
        });
        this.control.textPanel.bind('click', function(){
            p.control.listPanel.show();
        });
        this.control.listPanel.bind('mouseout', function(){
            p.inList = false;
            p.interval = setTimeout(function(){
                if(!p.inList){
                    p.control.listPanel.hide();
                }
            } ,100);
        }).bind('mouseover', function(){
            p.inList = true;
            if(p.interval){
                clearTimeout(p.interval);
            }
        });
        this.control.listPanel.find('li').each(function(){
            jQuery(this).bind('click', function(){
                var el = jQuery(this).find('a:eq(0)');
                p.control.textPanel.html(el.html());
                p.control.textPanel.html("&nbsp;&nbsp;&nbsp;&nbsp;"+el.html());
                p.result.level = el.attr('data-val') - 0;
            })
        });
    },
    run: function(){
        // 完成之后必须标记状态
        this.status = 'complete';
    },
    /**
     * 清除所有事件
     */
    stopEvents: function(){
        this.control.trigger.unbind('click');
        this.control.textPanel.unbind('click');
        this.control.listPanel.unbind('mouseout').unbind('mouseover');
        this.control.listPanel.find('li').each(function(){
            jQuery(this).unbind('click');
        });
    },
    /**
     * 转到某等级
     * @param level
     * @return {boolean}
     */
    gotoLevel: function(level){
        if(level > this.maxLevel){
            return false;
        }
        this.control.listPanel.find('li:eq('+level+')').trigger('click');
    },
    /**
     * 固定为某等级
     * @param level
     */
    fixLevel: function(level){
        this.gotoLevel(level);
        this.stopEvents();
    },
    /**
     * 写信页发送前的耦合
     * @param w
     */
    sendBefore: function(w){
        // 校验收件人密级
        var to = [], cc = [], sc = [], all;
        if(w.ribs){
            if(w.ribs[0] && w.ribs[0].items){
                for(var k in w.ribs[0].items){
                    to.push(parent.Email.getValue(w.ribs[0].items[k].allText));
                }
            }
            if(w.ribs[1] && w.ribs[1].items){
                for(var k in w.ribs[1].items){
                    cc.push(parent.Email.getValue(w.ribs[1].items[k].allText));
                }
            }
            if(w.ribs[2] && w.ribs[2].items){
                for(var k in w.ribs[2].items){
                    sc.push(parent.Email.getValue(w.ribs[2].items[k].allText));
                }
            }
        }

        all = to.concat(cc, sc);
        var data = {
            mailSecurity: this.result.level || 0,
            to: all.join(',')
        };
        var callback = function(data){
            if(data.code == 'S_OK'){
                w.onlySendMail();
            }
        };
        var failback = function(data){
            var code = data.code;
            switch(code){
            case "VALIDATE_RECEIVER_ERROR":
                var r = data['var'];
                if(r && r.length){
                    if(r[0] !="" || r[1] !=""){
                        // 提示用户选择处理方式
                        var info = [];
                        if(r[0] !=""){
                            info.push(parent.Lang.Mail.tips075);
                            info.push('<br/>');
                            info.push(r[0]);
                            info.push('<br/>');
                        }
                        if(r[1] !=""){
                            info.push(parent.Lang.Mail.tips076);
                            info.push('<br/>');
                            info.push(r[1]);
                            info.push('<br/>');
                        }
                        info.push(parent.Lang.Mail.tips077);

                        var goAhead = function(){
                            // 去掉不符合条件的收件人
                            if(r[0] != ""){
                                var mails = r[0].split(','), rib;
                                if(mails && mails.length){
                                    for(var i=0;i<mails.length;i++){
                                        for(var j = 0;j<3;j++){
                                            rib = w.ribs[j].getItemByEmail(mails[i]);
                                            rib && rib.remove();
                                        }
                                    }
                                }
                            }
                            w.onlySendMail();
                        };
                        var cancel = function(){

                        };

                        var ao = {
                            id: 'confirm_securitymail',
                            title: parent.Lang.Mail.Write.sysPrompt,
                            text: info.join(''),
                            type: 'text',
                            zindex: 10001,
                            buttons: [{text:parent.Lang.Mail.tips028,clickEvent:goAhead, 'class':'n_btn mt_8'},{text:parent.Lang.Mail.tips008,clickEvent:cancel, 'class': 'n_btn mt_8'}]
                        };
                        parent.CC.msgBox(ao);
                    }
                    else{
                        w.onlySendMail();
                    }
                }
                else{
                    w.onlySendMail();
                }
                break;
            case "VALIDATE_SENDER_ERROR":
                parent.CC.alert(parent.Lang.Mail.tips078);
                break;
            default:
                parent.CC.alert(parent.Lang.Mail.sysW);
            }
        };

        var req = {
            func: 'mail:GetSecurityClassification',
            url: '/mail/data.do',
            data: data,
            call: callback,
            failCall: failback,
            msg: ''
        };

        parent.MM.doService(req);
    },
    /**
     * 恢复密级邮件状态
     * @param level
     * @param w {object} 写信对象
     */
    recoverStatus: function(level, w){
        if(w.isReply || w.isForward || w.isReplyAll){
            this.fixLevel(level);
            jQuery("#security_mail_switch").hide();
        }
        else{
            this.gotoLevel(level);
        }
    }
};

// 别名功能模块
jQuery(function () {
    var $ = jQuery,
        isTrueAliasName = false,
        listHtml = "";
        cruAliasName = parent.CC.getUserAttributeFromLocal("cruAliasName");

    if (typeof aliasList !== "undefined") {
        for (var i = 0; i < aliasList.length; i++) {
            listHtml += "<li";
            if (cruAliasName && !oWrite.senderUser) {
                if (aliasList[i].value === cruAliasName) {
                    listHtml += " class=\"on\"";
                }
            } else {
                if (!oWrite.senderUser &&　aliasList[i].value === parent.gMain.loginName) {
                    listHtml += " class=\"on\"";
                }
            }
            listHtml += "><a href=\"javascript:;\">";
            listHtml += "<i class=\"i-mcok\"></i>";
            listHtml += "<span class=\"pop_wrt_slt\" value=\"" + aliasList[i].value.encodeHTML() + "\">";
            listHtml += getAllName(aliasList[i].value);
            listHtml += "</span>";
            listHtml += "</a></li>";
            if (cruAliasName === aliasList[i].value) {
                isTrueAliasName = true
            }
        }
        var folderList = CC.getFolders(),popFolderHtml=[];
        for(var i = 0,j=folderList.length;i<j;i++){
                if(folderList[i].type==6){
                        popFolderHtml.push("<li "+(folderList[i].name==oWrite.senderUser?"class=\"on\"":"")+"><a href=\"javascript:;\"><i class=\"i-mcok\"></i>");
                        popFolderHtml.push("<span class=\"pop_wrt_slt\" value=\"" + folderList[i].userName.encodeHTML() + "\">");
                        popFolderHtml.push(folderList[i].name.encodeHTML());
                        popFolderHtml.push("</span></a></li>");
                }
        }
        $("#tipsAliasList").find("ul").eq(0).html(listHtml);
        $("#tipsAliasList").find("ul").eq(1).html(popFolderHtml.join(""));
    }

    if (!isTrueAliasName || typeof isSelectAccount === "undefined") {
        cruAliasName = parent.gMain.loginName;
    }
    if(oWrite.senderUser){
        $("#selFrom").html(oWrite.senderUser).attr("value", oWrite.senderUser);
    }else{
    $("#selFrom").html(getAllName(cruAliasName)).attr("value", cruAliasName);
        }

    function getAllName (mail) {
        var name = parent.gMain.trueName || "";

        return name.encodeHTML() + "&lt;" + mail + "&gt;";
    }

    if (typeof isSelectAccount === "undefined") {
        return false;
    }

    $("#btnToggleAlias").click(function () {
        var pos = $(".wrter_tool").offset();

        $("#tipsAliasList").css("zIndex", 3000);

        $("#tipsAliasList").toggle().css({"top": pos.top - $("#tipsAliasList").height(), "left": pos.left});
    });

    $("#tipsAliasList").on("click", ".pop_wrt_slt", function () {
        var mail = $(this).attr("value").encodeHTML();

        $("#tipsAliasList").find(".on").removeClass("on");
        $(this).parent().parent().addClass("on");

        $("#selFrom").attr("value", mail).html(getAllName(mail));
        $("#tipsAliasList").hide();


    });

    $("#btnToggleFuncBar").click(function(event) {
        if ($(this).hasClass("wrter_switch_off")) {
            $("#writer_func_container").hide();
            $(this).removeClass("wrter_switch_off").addClass("wrter_switch_on");
        } else {
            $("#writer_func_container").show();
            $(this).removeClass("wrter_switch_on").addClass("wrter_switch_off");
        }
    });
});