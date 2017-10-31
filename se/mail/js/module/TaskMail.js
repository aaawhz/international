;(function ($, undefined) {
    var TaskMail = {
        isOpen: true,
        /**
        * 添加待办任务菜单项
        * @param {Object} ao 所有文件夹的数据
        */
        addMenuItem: function (ao) {
            var unTask = ao.todoTaskCount,
                task = ao.totalTaskCount;

            if (this.isOpen && task >= 0) {
                GE.taskMailNum = unTask;
                GE.taskedMailNum = task - unTask;
                ao["var"].splice(1, 0,
                    {
                        fid: 9999998,
                        folderColor: 0,
                        location: 2,
                        folderPassFlag: 0,
                        hideFlag: 0,
                        keepPeriod: 0,
                        order: 15,
                        name: "待办邮件",
                        parentId: 0,
                        pop3Flag: 0,
                        reserve: 0,
                        stats: {
                            attachmentNum: 0,
                            messageCount: task,
                            messageSize: 0,
                            unreadMessageCount: unTask,
                            unreadMessageSize: 0
                        },
                        flag : {
                            taskFlag: 1
                        },
                        type: 1,
                        vipFlag: 0,
                        virtualFolder: true  // 是否为虚拟文件夹
                    }
                );
            }
        },

        /**
        * 去掉待办任务菜单项
        */
        removeMenuItem: function () {
            var i;

            if (this.isOpen) {
                for (i = 0, len = MM[gConst.folderMain].Folders.sys.length; i < len; i++) {
                    if (MM[gConst.folderMain].Folders.sys[i].fid === 9999998) {
                        MM[gConst.folderMain].Folders.sys.splice(i, 1);
                        break;
                    }
                }
                for (i = 0, len = CM[gConst.folderMain]['var'].length; i < len; i++) {
                    if (CM[gConst.folderMain]['var'][i].fid === 9999998) {
                        CM[gConst.folderMain]['var'].splice(i, 1);
                        break;
                    }
                }
            }
        },

        /**
        * 获取列表页头部th HTML
        * return {string}
        */
        getListThHtml: function () {
            var html = "";

            if (this.isOpen) {
                html = "<th width=\"40\"></th>";
            }
            return html;
        },

        /**
        * 获取列表页图标HTML
        * @param {Object} ao 邮件信息
        * return {string}
        */
        getListIconHtml: function(data) {
            var html = "";

            if (this.isOpen) {
                html += '<td style="width:40px;" class="ceilTask">';
                html += '<div class="p_relative">';
                html += this.getIconHtml(data, "listMail");
                html += '</div>';
                html += '</td>';
                html += '<!--[if lt ie 8]><td style=" width:15px;"></td><![endif]-->';
            }
            return html;
        },

        /**
        * 获取列表页图标HTML
        * @param {Object} ao 邮件信息
        * @param {boolean} mode 模式，标准模式或者会话模式，用于读信页是否显示"待办任务"
        * return {string}
        */
        getReadIconHtml: function (data, mode) {
            var html = "";

            if (this.isOpen) {
                html += '<div class="read-undoMission ceilTask"><div class="p_relative">';
                html += this.getIconHtml(data, "readMail", mode);
                html += '</div></div>';
            }
            return html
        },

        /**
        * 获取图标HTML
        * @param {Object} ao 邮件信息
        * @param {string} type 类型，"listMail"(列表页)，"readMail"(读信页)
        * @param {boolean} mode 模式，标准模式或者会话模式，用于读信页是否显示"待办任务"
        * return {string}
        */
        getIconHtml : function (ao, type, mode) {
            var me = this,
                html = [],
                clsArr = {
                    "listMail": ["i-rw", "i-rwing", "i-rwed"],
                    "readMail": ["i-brw", "i-brwing", "i-brwed"]
                },
                fieldFlag,
                topStyle,
                timeStr;

            if (type === "listMail") {
                fieldFlag = "flags";
                topStyle = "-4px"
            } else {
                fieldFlag = "flag";
                ao.mid = ao.omid;
                topStyle = "10px";
                ao.taskDate = ao.headers.taskDate;
            }

            if (!ao.emailName) {
                if (ao.account === undefined) {
                    ao.emailName = ao.from.decodeHTML();
                } else {
                    ao.emailName = Email.getName(ao.account.decodeHTML());
                }
            }

            html.push('<a title="待办邮件" data-action="showTaskMenu" href="javascript:;" data-taskDate = "' + ao.taskDate + '" data-mail="' + ao.emailName.encodeHTML() + '" data-mid="' + ao.mid + '" data-time="' + ao.sendDate + '" data-subject="' + ao.subject.encodeHTML() + '"');
            if (ao[fieldFlag].taskFlag === 1) {
                html.push(' data-taskStatus="' + 1 + '" class="'+ clsArr[type][1] +'">');
            } else if (ao[fieldFlag].taskFlag === 2) {
                html.push(' data-taskStatus="' + 2 + '" class="'+ clsArr[type][2] +'">');
            } else {
                html.push(' data-taskStatus="' + 0 + '" class="'+ clsArr[type][0] +'">');
            }
            html.push('</a>');
            if (type === "readMail" && !mode) {
                html.push('<p class="pt_5">待办邮件</p>');
            }
            if (+(ao.taskDate) > 0) {
                timeStr = me.getTimeStr(+(ao.taskDate))
            }
            html.push('<div class="y_tips" style="position:absolute;top: ' + topStyle + '; font-weight: normal; line-height: 22px; left:-210px;width:195px;display: none;">处理时间：<span class="textTaskDate col_orange">' + timeStr + '</span></div>');

            return html.join("");
        },

        /*
        * 绑定任务事件函数
        * @param {document} doc 窗口文档
        */
        bindTaskEvent: function (doc) {
            var me = this;

            if (!me.isOpen) {return true;}
            if ($("#menuTaskMail", doc).length < 1) {
                me.createTaskMenu(doc);
                menu = $("#menuTaskMail", doc)
                menu.find(".module_pop > .btnTaskStatus").click(function (e) {
                    var mid = $(this).parent().parent().attr("data-mid"),
                        type = $(this).attr("type");
                    
                    me.modTaskStatus(mid, 0, +(type), $(this));
                });

                menu.find(".module_pop > .btnAddRemind").click(function () {
                    me.msgRemind($(this), "add", doc);
                });

                menu.find(".module_pop > .btnModRemind").click(function () {
                    me.msgRemind($(this), "mod", doc);
                });

                menu.find(".module_pop > .btnDelRemind").click(function () {
                    var mid = $(this).parent().parent().attr("data-mid");

                    me.delMailCalendar(mid, $(this));
                });
            }
            me.bindIconEvent("content", doc);  // 列表页给A绑定事件
            me.bindIconEvent("readMail_inner", doc);  // 读信页给A绑定事件
            me.bindIconEvent("readmail_body", doc);  // 会话模式个给A绑定事件

            $(doc.body, doc).click(function () {
                jQuery(".pop_wrapper", doc).hide();
            });

        },

        /**
        * 给Icon图标绑定事件
        * @param {string} wrapId   dom wrap ID
        * @param {document} doc 窗口文档
        */
        bindIconEvent: function (wrapId, doc) {
            var me  = this;

            if ($("#" + wrapId, doc).data("binded") !== "true") {
                $("#" + wrapId, doc).data("binded", "true");

                $("#" + wrapId, doc).on("click", ".ceilTask > .p_relative > a", function (e) {
                    var offset, x, y, mid, mail, tatime, subject, status, taskDate;

                    offset = $(this).offset();
                    x = offset.left - 130;
                    y = offset.top;
                    mid = $(this).attr("data-mid");
                    mail = $(this).attr("data-mail");
                    subject = $(this).attr("data-subject");
                    time = $(this).attr("data-time");
                    taskDate = ~~$(this).attr("data-taskDate");
                    status = ~~$(this).attr("data-taskStatus");

                    me.toggleMenu(status, taskDate, doc);
                    $("#menuTaskMail", doc).attr({
                        "data-mid": mid,
                        "data-mail": mail,
                        "data-subject": subject,
                        "data-time": time
                    }).css({
                        "left": x + "px",
                        "top": y + "px"
                    }).toggle();
                    e.stopPropagation();
                }).on("mouseenter", ".ceilTask > .p_relative > a", function () {
                    var date = +($(this).attr("data-taskDate"));
                    
                    if (date > 0) {
                        $(this).siblings(".y_tips").fadeIn();
                    }
                }).on("mouseleave", ".ceilTask > .p_relative > a", function () {
                    $(this).siblings(".y_tips").fadeOut();
                });
            }
        },

        /**
        * 切换菜单项显示隐藏
        * @param {number} 任务状态
        * @param {number} date 提醒时间
        * @param {document} doc 窗口文档
        */
        toggleMenu: function (status, date, doc) {
            var menu = $("#menuTaskMail", doc);
            
            if (status === 0) {
                menu.find("li[type=0]").hide();
                menu.find("li[type=1]").show();
                menu.find("li[type=2]").hide();
            } else if (status === 1) {
                menu.find("li[type=0]").show();
                menu.find("li[type=1]").hide();
                menu.find("li[type=2]").show();
            } else if (status === 2) {
                menu.find("li[type=0]").show();
                menu.find("li[type=1]").show();
                menu.find("li[type=2]").hide();
            }
            if (date > 0) {
                menu.find(".btnAddRemind").hide();
                menu.find(".btnDelRemind").show();
                menu.find(".btnModRemind").show();
            } else {
                menu.find(".btnAddRemind").show();
                menu.find(".btnDelRemind").hide();
                menu.find(".btnModRemind").hide();
            }
        },

        /** 
        * 创建任务邮件右键菜单
        * @param {document} doc 窗口文档
        */
        createTaskMenu: function (doc) {
            var html = [],
                clsType;

            if (top.window === window) {
                clsType = "listMail";
            } else {
                clsType = "readMail";
            }
            html.push('<div id="menuTaskMail" class="pop_wrapper w120" style="position:absolute; overflow: hidden; z-index: 10000; display: none;">');
            html.push('<ul class="module_pop">');
            html.push('<li clsType="' + clsType + '" class="btnTaskStatus" type="2"><a href="javascript:;">标记完成</a></li>');
            html.push('<li clsType="' + clsType + '" class="btnAddRemind"><a href="javascript:;">添加提醒</a></li>');
            html.push('<li clsType="' + clsType + '" class="btnTaskStatus" type="1"><a href="javascript:;">标记任务</a></li>');
            html.push('<li clsType="' + clsType + '" class="btnModRemind"><a href="javascript:;">修改提醒</a></li>');
            html.push('<li clsType="' + clsType + '" class="btnDelRemind"><a href="javascript:;">取消提醒</a></li>');
            html.push('<li clsType="' + clsType + '" class="btnTaskStatus" type="0"><a href="javascript:;">取消任务</a></li>');
            html.push('</ul>');
            html.push('</div>');
            $(doc.body, doc).append(html.join(""));
        },

        /** 
        * 绑定输入框的keypress事件
        */
        bindTextEvent: function () {
            $("#textCalCont").on("input propertychange", function (e) {
                var str = $(this).val(),
                    len = str.length;

                if (len > 100) {
                    $(this).val(str.substr(0,100));
                    $("#numCanInput").html(0);
                } else {
                    $("#numCanInput").html(100 - len);
                }
            });
        },

        /**
         * 获取提醒框中弹出的绑定手机弹出框的html--------2015.08.26
         */
        getBindPhoneHtml: function () {
            var html = [];
            var url = gMain.webPath+"/se/account/accountindex.do?sid="+gMain.sid+"&mode=Mobile";
            html.push(CC.getIframe('bindPhoneFrm',url,'no','width:700px;height:464px;margin-left:-194px;margin-top:-120px;'));
            return html.join('');
        },

        /**
         * 选择短信提醒时判断是否已绑定手机--------2015.08.25
         */
        checkAlert: function(){
           var me  = this;
            jQuery('#checkSmsNotify').on('click',function(event) {

                if(!$('#checkSmsNotify').is(':checked')){
                    return;
                } 
                    
                    // //如果绑定了(页面加载时是绑定的)
                    // if(window.gMain && gMain.flags && parent.gMain.mobileNumber!=""){
                    //     if(CC.isMobileBind(gMain.flags)){
                    //         return;
                    //     }
                    // }

                    //如果有权限
                    if(GC.check("CENTER_BIND")){
                        me.checkBindPhone();
                    }else{
                    //如果没有权限
                        $('#checkSmsNotify').attr('checked', false);
                        CC.alert("您没有绑定手机的权限，无法使用该功能!",function(){
                            $('#shareLayer').css({'z-index':'2100'}); 
                            setTimeout(function(){
                                $(".shareLayer").css('display', 'block');
                            },100);                            
                        });
                        //调节z-index来控制遮盖层的显示
                        if($("#shareLayer") && $("#divDialogalert")){
                            $('#divDialogalert').css({'z-index':'2301'});
                            $('#shareLayer').css('z-index', '2300');
                        }
                    }
                });
            },

        /**
         * 两个多选框的绑定事件
         * @return 至少选择一种提醒方式
         */
        checkTips: function(){
            var me  = this;
            var $checkMail = $("#checkMailNotify");
            var $checkSms = $("#checkSmsNotify");
            var $tips = $("#checkKeepOne");

            $checkMail.on("click", function(event) {
                if (!$checkMail.is(":checked") && !$checkSms.is(":checked")) {
                    //显示提示
                    $tips.css("display", "inline");
                    $checkMail.attr("checked","checked");
                    setTimeout(function(){
                        $tips.css("display","none");
                    },3000);
                };
            });

             $checkSms.on("click", function(event) {
                if (!$checkMail.is(":checked") && !$checkSms.is(":checked")) {
                    //显示提示
                    $tips.css("display", "inline");
                    $checkMail.attr("checked","checked");
                    setTimeout(function(){
                        $tips.css("display","none");
                    },3000);
                };
            });           
        },

        /**
         * 点击"短信提醒"，未绑定手机的对应操作(弹出绑定手机的框)--------------2015.08.26
         */
         showBindPage: function(){
            var me = this;
            var ao={};
            var html = me.getBindPhoneHtml();
            
            setInterval(function(){
                jQuery("#unbindmobile_btn",jQuery("#divDialogremindNotify").contents().find('iframe').contents()).hide();
                jQuery("#changemobile_btn",jQuery("#divDialogremindNotify").contents().find('iframe').contents()).hide();
            },500);

            ao = {
                 "id":"remindNotify",
                 "title":"系统提示",
                 "text":html,
                 "type":"div",
                 "width": 507,
                 "zindex": 20211,
                 "dragStyle": 1,
                 "buttonType": "confirm",
                 "buttons":[{
                        "text":Lang.Mail.main_bt_back,   //“返回”
                        "clickEvent":function(){
                                        if($("#shareLayer")){
                                            $('#shareLayer').css({'z-index':'2100'}); 
                                            $('#checkSmsNotify').attr('checked', false);
                                            setTimeout(function(){
                                                 $(".shareLayer").css('display', 'block');
                                            },100);  
                                        }            
                                    },
                        "isCancelBtn": true
                 }]
            };

            CC.msgBox(ao); //弹出绑定手机的页面

            //调节z-index来控制遮盖层的显示
            if($("#shareLayer") && $("#divDialogremindNotify")){
                $('#divDialogremindNotify').css({'z-index':'2301','overflow':'hidden'});
                $('#shareLayer').css('z-index', '2300');
            };

         },

        /**
         * 判断是否已绑定手机并对应操作------------2015.08.25
         */
        checkBindPhone: function(){
            var me  = this;
            var data    = {},
                fnSuc   = null,
                fnFail  = null,
                sucMsg  = "",
                failMsg = "";
            
            fnSuc = function(ao){
                if(ao && ao["var"] && ao["var"].flags!=0 && ao["var"].mobilePhone){
                    //赋初始值----------->gMain.hasPhone
                    if(window.gMain){
                        gMain.hasPhone = ao["var"].mobilePhone;
                        top.gMain.flags = 1;
                         return true;
                    }
                }else{
                    //未绑定手机
                    me.showBindPage();
                    if(window.gMain){
                        gMain.hasPhone = "";
                    }
                    top.gMain.flags = 0;
                    return false;
                }
            };  
            
            fnFail = function(ao){
                if(window.gMain){
                    gMain.hasPhone = "fail";
                }
                top.gMain.flags = 0;
                return false;
            };
            phoneBind.doService("mail:getUserInfo",data,fnSuc,fnFail);
        },

        /**
         * 判断是否已绑定手机，弹出提醒框之前使用------------2015.09.07
         */
        checkBindLast: function(){
            var me  = this;
            var data    = {},
                fnSuc   = null,
                fnFail  = null,
                sucMsg  = "",
                failMsg = "";
            
            fnSuc = function(ao){
                if(ao && ao["var"] && ao["var"].flags!=0 && ao["var"].mobilePhone){
                    //赋初始值----------->gMain.hasPhone
                    if(window.gMain){
                        top.gMain.flags = 1;
                    }
                }else{
                    //未绑定手机
                    top.gMain.flags = 0;
                }
            };  
            
            fnFail = function(ao){
                top.gMain.flags = 0;
            };
            phoneBind.doService("mail:getUserInfo",data,fnSuc,fnFail);          
        },        

        /**
        * 提醒弹出框
        * @param {JQ DOM object} el 点击的element JQ对象
        * @param {string} type 操作类型，增加或者修改
        * @param {document} doc 窗口文档
        */
        msgRemind: function (el, type, doc) {
            var me = this,
                html = me.getConfirmHtml(),
                ao = {},
                formVal = {},
                hourData = [],
                minuteData = [],
                title,
                actionType,
                addId,
                i,
                dataObj = el.parent().parent(),
                mid = dataObj.attr("data-mid"),
                mail = dataObj.attr("data-mail"),
                t,
                mailDate,
                mailDateStr,
                subject = dataObj.attr("data-subject");

            if (type === "add") {
                actionType = "add";
                title = "添加提醒";
                formVal.time = (new Date()).getTime() + 1000 * 60 * 60 * 24;
                t = new Date((~~dataObj.attr("data-time")) * 1000);
                mailDateStr = (t.getMonth() + 1) + "月" + t.getDate() + "日" + " " + t.getHours() + ":" + t.getMonth();
                formVal.cont = "请处理" + mailDateStr + "来自" + mail + "的邮件：" + subject;
            } else {
                actionType = "mod";
                title = "修改提醒";
            }

            ao = {
                "id" : "confirm" + (addId || ""),
                "title": title,
                "type": "text",
                "width": 460,
                "text" : html,
                "zindex": 20011,
                "dragStyle": 1,
                "buttonType": "confirm",
                "buttons" : [{
                    "text": Lang.Mail.Ok,
                    "clickEvent": function (e) {
                        //检测日期填写，选择短信提醒，检测绑定手机
                        if(me.checkCalInput() && $("#checkSmsNotify").is(":checked") && top.gMain.flags){
                            me.setMailCalendar(mid, actionType, el);                            
                        }//检测日期填写，不选择短信提醒
                        else if(me.checkCalInput() && !$("#checkSmsNotify").is(":checked")){
                            me.setMailCalendar(mid, actionType, el);
                        }
                    }
                },{
                    "text": Lang.Mail.Cancel,
                    "clickEvent": function () {},
                    "isCancelBtn": true
                }]        
            };

            me.checkBindLast();      

            CC.msgBox(ao);
            me.bindTextEvent();
            for (i = 0; i < 24; i++) {
                hourData.push({"text": i, "value": i});
            }
            me.loadDrop("calHourDrop","spanCalHour","selectCalHour", hourData);
            for (i = 0; i < 60; i++) {
                minuteData.push({"text": i, "value": i});
            }
            me.loadDrop("calMinuteDrop","spanCalMinute","selectCalMinute", minuteData);
            if (type === "add") {
                me.setCalendarValue(formVal);
            } else {
                me.getMailCalendar(mid);
            }
            new CCalendar(jQuery("#textCalDate"),{
                onSelectBack:function(){
                    return true;
                },
                expired: true
            });

            me.checkAlert();
            me.checkTips();

        },

        /**
        * 载入控件
        * @param {string} objName 控件name
        * @param {string} spanId 控件span ID
        * @param {string} id 加载控件的DOM ID
        * @param {array} data 控件的数据
        */
        loadDrop: function (objName, spanId, id, data) {
            this[objName] = new DropSelect({
                "id": spanId,
                "data": data,
                "type": "opMailType",
                "selectedValue": "-1",
                "width": 75,
                "height": 200
            });
            $("#"+id).html(this[objName].getHTML());
            this[objName].loadEvent();
        },

        /* 
        * 获取弹出窗html
        */
        getConfirmHtml: function () {
            var html = [];

            html.push('<div class="box-cont">');
            html.push('<p class="p-remind mb_10">在以下时间提醒我：<span class="col_orange fw_b" id="textCalTime"></span></p>');
            html.push('<div class="in-form mb_10">');
            html.push('<div class="input-cont clearfix">');
            html.push('<input type="text" name="" id="textCalDate" readonly="readonly" class="in-t" />');
            html.push('<i class="i-keyboard"></i></div>');
            html.push(' <span id="selectCalHour"></span>');
            html.push(' <span class="hour">时</span>');
            html.push(' <span id="selectCalMinute"></span>');
            html.push(' <span class="minute">分</span>');
            html.push('</div>');
            html.push('<dl class="box-cont-dl">');
            html.push('<dt class="title">提醒内容：</dt>');
            html.push('<dd>');
            html.push('<textarea class="box-texar" id="textCalCont"></textarea>');
            html.push('</dd>');
            html.push('<dd>您还可以输入<span class="col_orange" id="numCanInput"></span>字，最多<span class="col_orange">100</span>字</dd>');
            
            //增加邮件提醒和短信提醒多选框 --2015.08.25

            html.push('<dd class="mt_8">');
            html.push('<input type="checkbox" checked="checked" id="checkMailNotify" /> 邮件提醒   <input type="checkbox" id="checkSmsNotify" class="ml_20"  /> 短信提醒  <span style="display:none" class="col_orange ml_20" id="checkKeepOne">请至少选择一种提醒方式</span>');
            html.push('</dd>');

            html.push('</dl>');
            html.push('</div>');

            return html.join("");
        },

        /*
        * 检查日程输入框输入值是否合法
        * return {boolean}
        */
        checkCalInput: function () {
            var timeStr = jQuery("#textCalDate").val().replace(/\-/g, "/") + " " + this.calHourDrop.getValue() +
                    ":" + this.calMinuteDrop.getValue() + ":00",
                nowTime = (new Date()).getTime(),
                time = new Date(timeStr).getTime(),
                me = this;

            if ($("#textCalCont").val().trimAll().length < 1) {
                CC.alert("提醒内容不能为空", function(){}, "系统提示");
                return false;
            }

            if ($("#textCalCont").val().trimAll().length > 100) {
                CC.alert("提醒内容不能超过100字", function(){}, "系统提示");
                return false;
            }

            if (time < nowTime) {
                CC.alert("下发提醒的时间不能早于当前时间，请重新选择提醒时间", function(){}, "系统提示");
                return false;
            }

            return true;
        },

        /*
        * 修改邮件任务状态
        * @param {string} mid 邮件的mid
        * @param {string} taskTime 提醒时间
        * @param {type} type 任务状态类型
        * @param {JQ DOM object} el 点击的element JQ对象
        * @param onMsg {boolean} noMsg 不要在头部显示信息
        */
        modTaskStatus: function (mid, taskTime, type, el, noMsg) {
            var me = this,
                reqData = {
                    "func": "mbox:setTaskMessages",
                    "data": {
                        "type": "taskFlag",
                        "value": type,
                        "time": taskTime,
                        "ids": [mid]
                    },
                    "call": callback,
                    "failCall": failcall,
                    "msg": ""
                },
                clsArr = [
                    ["i-rw", "i-rwing", "i-rwed"],
                    ["i-brw", "i-brwing", "i-brwed"]
                ],
                clsType = el.attr("clsType");     

            MM.mailRequestApi(reqData);

            function callback () {
                var cls, status, oldStaus, t, timeStr, msgStr, objData, mailIframe;

                objData = $(".ceilTask > .p_relative > a[data-mid=" + mid + "]");
                oldStaus = ~~objData.attr("data-taskstatus");
                mailIframe = window.frames["ifrmReadmail_Content_readMail" + mid];

                LM.loadFolderMain();
                if (type === 2) {
                    status = 2;
                    msgStr = "待办任务已标识为已完成";
                    GE.taskedMailNum++;
                    GE.taskMailNum--;
                    me.delMailCalendar(mid, undefined, true);
                    if($("#tab_b_sys0").length!=0 && $("#tab_b_sys0").css("display")!="none" && typeof $("#tab_b_sys0").css("display")!="undefined"){
                        CC.receiveMail({taskFlag: 1});
                    }
                } else if (type === 1) {
                    status = 1;
                    msgStr = "添加待办任务成功";
                    if (oldStaus === 0) {
                        GE.taskMailNum++;
                    } else if (oldStaus === 2) {
                        GE.taskedMailNum--;
                        GE.taskMailNum++;
                    }
                } else {
                    status = 0;
                    msgStr = "取消待办任务成功";
                    me.delMailCalendar(mid, undefined, true);
                    if (oldStaus === 1) {
                        GE.taskMailNum--;
                    } else if (oldStaus === 2) {
                        GE.taskedMailNum--;
                    }
                }
                if (!noMsg) {
                    CC.showMsg(msgStr, true, false, "option");
                }
                if (mailIframe) {
                    $(".ceilTask > .p_relative > a", mailIframe.document).attr({"class": clsArr[1][type], "data-taskStatus": status, "data-taskDate": taskTime});
                }
                objData.attr({"class": clsArr[0][type], "data-taskStatus": status, "data-taskDate": taskTime});
                if (taskTime > 0) {
                    t = new Date(taskTime * 1000);
                    timeStr = t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate() + " " + t.getHours() + ":" + t.getMinutes();
                    objData.siblings(".y_tips").find(".textTaskDate").html(timeStr);
                    if (mailIframe) {
                        $(".ceilTask > .p_relative > a", mailIframe.document).siblings(".y_tips").find(".textTaskDate").html(timeStr);
                    }
                }
            }
            function failcall () {
                LM.loadFolderMain();
            }
        },

        /*
        * 设置日程提醒
        * @param {string} mid 邮件的mid
        * @param {string} type 操作类型，添加或者修改
        * @parram {JQ DOM object} el 点击的element JQ对象
        * @parram onMsg {boolean} noMsg 不要在头部显示信息
        */
        setMailCalendar: function (mid, type, el, noMsg) {

            var reqData,
                me = this,
                date = jQuery("#textCalDate").val(),
                hour = ~~me.calHourDrop.getValue(),
                minute = ~~me.calMinuteDrop.getValue(),
                time = (hour < 10 ? "0" + hour : hour).toString() + (minute < 10 ? "0" + minute : minute).toString(),
                cont = jQuery("#textCalCont").val(),
                timeStr = new Date(date.replace(/\-/g, "/") + " " + hour + ":" + minute + ":00").getTime() / 1000,
                func,
                recMail = 0,
                recSms = 0;

            if (type === "add") {
                func = "calendar:addMailCalendar";
            } else {
                func = "calendar:updateMailCalendar";
            }

            if($("#checkMailNotify").is(":checked")){
                recMail = 1;
            }else{
                recMail = 0;
            }

            if($("#checkSmsNotify").is(":checked")){
                recSms = 1;
            }else{
                recSms = 0;
            }

            reqData = {
                "url": me.getWebsiteUrl() + "/calendar/s",
                "func": func,
                "data": {
                    "comeFrom": 0,
                    "recMyEmail": recMail, //是否是邮件提醒
                    "recMySms": recSms, // 是否是短信提醒
                    "startTime": time, // 开始时间
                    "endTime": time, // 结束时间
                    "content": cont, // 日历提醒内容
                    "title": cont, // 标题
                    "dateFlag": date, // 开始日期
                    "endDateFlag": date, // 结束日期
                    "enable": 1,
                    "dateDesc": date,
                    "mid": mid
                },
                "call": function (data) {
                    if (!noMsg) {
                        if (type === "add") {
                            CC.showMsg("添加待办提醒成功", true, false, "option");
                        } else {
                            CC.showMsg("修改待办提醒成功", true, false, "option");

                            var $ifrmReadmail = $('#'+'ifrmReadmail_Content_readMail'+mid).contents();
                            var $divTips = $(".divTips",$ifrmReadmail);
                            var newTime = hour.toString() + ":" + minute.toString();
                            if($divTips.length>0){
                                $("span",$divTips).html("已设为待办邮件，"+date+" "+newTime+"提醒。");
                            }
                        }
                    }
                    me.modTaskStatus(mid, timeStr, 1, el, true);
                },
                "failCall": function () {},
                "msg": ""
            };
            MM.mailRequestApi(reqData);
        },

        /** 
        * 删除日程提醒
        * @param {string} mid 邮件的mid
        * @param {JQ DOM object} el 点击的element JQ对象
        * @parram onMsg {boolean} noMsg 不要在头部显示信息
        */
        delMailCalendar: function (mid, el, noMsg) {
            var me = this,
                reqData = {
                    "url": me.getWebsiteUrl() + "/calendar/s",
                    "func": "calendar:delMailCalendar",
                    "data": {
                        "mid": mid,
                        "comeFrom": 0,
                        "actionType": 0
                    },
                    "call": function () {
                        if (!noMsg) {
                            CC.showMsg("取消待办提醒成功", true, false, "option");
                        }
                        if (el) {
                            me.modTaskStatus(mid, 0, 1, el, true);
                        }
                    },
                    "failCall": function () {
                        if (!noMsg) {
                            CC.showMsg("取消待办提醒失败", true, false, "option");
                        }
                    },
                    "msg": ""
                };
            MM.mailRequestApi(reqData);
        },

        /** 
        * 设置提醒输入框的值
        * @param {object} obj 表单的数据
        */
        setCalendarValue: function (obj) {
            var cont = obj.cont || "",
                t = new Date(obj.time),
                tDateStr = t.getFullYear() + "-" + ((t.getMonth() + 1) < 10 ? ("0" + (t.getMonth() + 1)) : (t.getMonth() + 1)) + "-" + (t.getDate() < 10 ? "0" + t.getDate() : t.getDate());
                tStr = tDateStr + " " + 
                    t.getHours() + ":" + t.getMinutes();

            $("#textCalDate").val(tDateStr);
            $("#textCalTime").html(tStr);
            this.calHourDrop.setValue(t.getHours());
            this.calMinuteDrop.setValue(t.getMinutes());
            $("#textCalCont").val(cont);
            $("#numCanInput").html(100 - cont.length);
        },

        /**
        * 获取日程信息
        * @param mid {string} 邮件的mid
        */
        getMailCalendar: function (mid) {
            var me = this,
                $checkMail = $("#checkMailNotify"),
                $checkSms = $("#checkSmsNotify"), 
                reqData = {
                    "url": me.getWebsiteUrl() + "/calendar/s",
                    "func": "calendar:getMailCalendar",
                    "data": {
                        "mid": mid,
                        "comeFrom": 0
                    },
                    "call": function (data) {
                        var obj = data["var"],
                            timeStr = obj.dateFlag.replace(/\-/g, "/") + " ";
                        
                        if (obj.startTime.length <= 2) {
                            timeStr += "00:" + obj.startTime;
                        } else if (obj.startTime.length === 3) {
                            timeStr += obj.startTime.slice(0,1);
                            timeStr += ":" + obj.startTime.slice(1);
                        } else {
                            timeStr += obj.startTime.slice(0,2);
                            timeStr += ":" + obj.startTime.slice(2);
                        }
                        timeStr += ":00";
                        me.setCalendarValue({"cont": data["var"].content, "time": new Date(timeStr).getTime()});
                     
                        if(obj.recMyEmail && obj.recMyEmail == 1){
                            $checkMail.attr("checked","checked");
                        }else{
                            $checkMail.attr("checked",false);                            
                        }

                        if(obj.recMySms && obj.recMySms == 1 && top.gMain && top.gMain.flags){
                            $checkSms.attr("checked","checked");                                
                        }else{
                             $checkSms.attr("checked",false);                           
                        }                        

                    },
                    "failCall": function () {},
                    "msg": ""
                };
            MM.mailRequestApi(reqData);
        },

        /**
        * 获取绝对URL
        * return {string}
        */
        getWebsiteUrl: function () {
            return location.protocol + '//' + location.host;
        },

        /**
        * 获取时间字符串
        * @param {number} num 时间秒数
        * return {string}
        */
        getTimeStr: function (num) {
            var t = new Date(num * 1000);
            
            return t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate() + " " + t.getHours() + ":" + t.getMinutes();
        }
    };
    window["TaskMail"] = TaskMail;
})(jQuery);