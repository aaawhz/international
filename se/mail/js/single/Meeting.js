var PageStateTypes = {
    Initializing: 1,      //正在初始化
    Uploading: 2,         //正在上传附件
    Sending: 3,           //正在发送邮件
    Saving: 4,            //正在保存附件
    Common: 5            //普通状态
};

var WriteState = {
    none: 0,
    send: 1,
    save: 2
};
var PageState = PageStateTypes.Common;

;
(function ($, undefined) {
    var fBlank = null;
    var isIE = document.all;
    var El = parent.El;
    var CC = parent.CC;
    var writeInputHeight = 60;

    $(function () {
        var editor;


        var Meeting = {
            id: "", //写信事务id
            status: WriteState.none,     //发信状态信息 0：未发信或发信已经成功， 1：正在发信,2:正在保存草稿
            tabId: "",
            mid: GC.getUrlParamValue(location.href, "mid"),
            omid: "",

            focusId: "rib_input_1",
            tid: GC.getUrlParamValue(location.href, "tid"),
            funcid: GC.getUrlParamValue(location.href, "funcid") || "mbox:compose",
            composeId: GC.getUrlParamValue(location.href, "composeid"),
            to: GC.getUrlParamValue(location.href, "to"),
            toMaxNum: 50,
            receiveBegin: 5,  // 收件人开始提示数量
            draftId: 0,
            isDraft: false,
            autoFillObjects: [],
            RichInputBox: null,
            autoDuration: parseInt(top.gMain.autoSaveTime) * 60000,
            autoTimer: null,
            ribs: [],
            addressee: "",
            oldData: {},
            getEditor: function () {
                return editor
            },

            isSchedule: GC.getUrlParamValue(location.href, 'isSchedule'),
            /**
             * 设置高度限定输入控件高度
             */
            setHeight: function (obj) {
                return;
                var nowHeight = parent.El.height(obj);
                if (nowHeight >= 60) {
                    obj.parentNode.style.maxHeight = 60 + 'px';
                }
            },
            doTextFocus: function (v) {
                var obj = $("#" + v)[0];
                var ev = parent.EV.getEvent() || window.event;
                if (ev && ev.type == "focus") {
                    var t = parent.El.getNodeType(obj, true);
                    if (obj && (t == "text" || t == "textarea")) {
                        this.focusId = obj.id;
                    }
                    if (isIE) {
                        parent.El.addClass(obj, "focus");
                    }
                }
            },
            selectMail: function (m, tm) {
                var val = tm || m;
                var type = this.fromType || 'default';
                var txt = $("#" + Meeting.focusId)[0];
                var t = txt.value || "";
                t = t.replace(/[,]+/gi, ";");
                t = t.replace(/^;/, "");
                var lastSep = t.lastIndexOf(";");
                var rib = Meeting.richInputBox;
                if (t == "") {
                    txt.value = val;
                } else {
                    if (t.indexOf(val) < 0) {
                        t = t.replace(/[;]{2,}/, ";");
                        if (lastSep > 0) {
                            txt.value = t.substring(0, lastSep + 1) + val;
                        } else {
                            txt.value = val;
                        }
                    }
                }
                if (rib instanceof RichInputBox) {
                    rib.createItemFromTextBox();
                }
            },
            getCurrMeetingData: function () {
                var meeting = {}
                meeting.textMeetingSubject = $("#textMeetingSubject").val()
                meeting.textMeetingAddr = $("#textMeetingAddr").val()
                meeting.inputMeetingDate = $("#inputMeetingDate").val()
                meeting.inputMeetingHour = $("#inputMeetingHour").val()
                meeting.inputMeetingMinute = $("#inputMeetingMinute").val()
                meeting.inputMeetingDuration = $("#inputMeetingDuration").val()
                meeting.content = editor.getEditorValue();
                meeting.tos=jQuery('.RichInputBox').eq(0).text()

                return meeting;


            },
            isChanged: function () {
                var old = Meeting.oldData;
                var curr = Meeting.getCurrMeetingData();
                for (var attr in curr) {
                    if (old[attr] != curr[attr]) {
                        return true
                    }
                }
                return false
            },
            init: function () {
                var me = this;

                this.initTime();
                this.initPlug();
                this.bindEvent();

                if (this.mid) {
                    this.tabId = "outLink_meeting_" + this.mid;
                    this.composeId = "compose_" + this.mid;
                } else {
                    this.tabId = "outLink_meeting";
                }
                if (this.funcid === "mbox:restoreDraft") {
                    this.isNew = false;
                    this.loadDraft();
                } else {
                    this.getComposeId(function (id) {
                        Meeting.id = id;
                        attach.init(id);
                    });
                }

                this.initContact();
                $("#recipient_container input")[0].focus();
                $("#inputMeetingHour").val(new Date().getHours());
                this.autoTimer = setInterval(function () {
                    if (me.tabId === top.CC.getCurLabId()) {
                        me.sendInvite(true);
                    }
                }, me.autoDuration);

                if (GC.check("CONTACTS")) {
                    $("#tabSwitch").click(function (o) {
                        me.doSepClick();
                    });
                } else {
                    me.doSepClick(false);
                    $("#tabSwitch").css("display", "none");
                }

                me.initHeight();
            },
            initHeight: function () {
                var bh = $(document, document).height();

                var searchTop = $(".searchArea").offset().top;
                var editTop = $("#htmlEditoreditor").offset().top;

                $(".searchArea").outerHeight(bh - searchTop - 1);
                $("#htmlEditoreditor").outerHeight(bh - editTop - 3);
                $("#addrList").outerHeight(bh - searchTop - 50);
            },
            loadDraft: function () {
                var me = this,
                    data = {
                        "mid": me.mid
                    },
                    reqData = {};

                this.draftId = this.mid;
                this.isDraft = true;

                reqData = {
                    "func": me.funcid,
                    "data": data,
                    "call": function (resp) {
                        me.oldData = resp["var"]
                        var timeStart = resp["var"]["meetingAttr"]["meetingStart"],
                            timeEnd = resp["var"]["meetingAttr"]["meetingEnd"],
                            timeDuration,
                            time;

                        if (resp.code === "S_OK") {

                            me.id = resp["var"].id;
                            attach.init(resp["var"].id);
                            me.ribs[0].insertItem(resp["var"]["to"]);
                            $("#textMeetingSubject").val(resp["var"]["subject"]);
                            $("#textMeetingAddr").val(resp["var"]["meetingAttr"]["location"]);
                            attach.render(resp["var"]);
                            if (timeStart) {
                                time = new Date(parseInt(timeStart * 1000));
                                $("#inputMeetingDate").val(time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate());
                                $("#inputMeetingHour").val(time.getHours());
                                $("#inputMeetingMinute").val(time.getMinutes());
                            }
                            if (timeStart && timeEnd) {
                                timeDuration = (parseInt(timeEnd) - parseInt(timeStart)) / 60;
                                $("#inputMeetingDuration").val(timeDuration);
                            }
                            if (me.isEditorLoaded) {
                                editor.setEditorValue(resp["var"]["content"]);
                            } else {
                                me.editorLoadedTimer = setInterval(function () {
                                    if (me.isEditorLoaded) {
                                        editor.setEditorValue(resp["var"]["content"]);
                                        clearInterval(me.editorLoadedTimer);
                                        //缓存数据
                                        Meeting.oldData = Meeting.getCurrMeetingData();
                                    }
                                }, 100);
                            }
                            //缓存数据
                            Meeting.oldData = Meeting.getCurrMeetingData();
                        }
                    },
                    "failCall": function () {
                        //parent.ch("loadMeetingMailInfo error." + e);
                    },
                    "msg": ""
                };
                parent.MM.mailRequestApi(reqData);

            },
            initTime: function () {
                var t = new Date();

                $("#inputMeetingDate").val(t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate());
                new CCalendar($("#inputMeetingDate"), {
                    onSelectBack: function () {
                        return true;
                    }
                });

                $("#inputMeetingDuration").change(function () {
                    var num = $(this).val().replace(/\D/g, "");

                    $(this).val(num);
                });
            },
            initContact: function () {
                var sendSelf = jQuery('#send_to_self'),
                    me = this,
                    myEmail,
                    nameEmail;

                if (GC.check("CONTACTS")) {
                    if (sendSelf) {
                        myEmail = parent.gMain.loginName || '';
                        nameEmail = (parent.gMain.trueName || '') + '<' + (myEmail) + '>';
                        sendSelf.find('a').unbind('click').bind('click', function () {
                            me.selectMail(myEmail, nameEmail);
                        });
                    }
                    this.loadAddrList();
                }
            },
            initPlug: function () {
                var me = this,
                    tipsTemplate = "<div class=\"richinputbox_tips\" style=\"border:solid 1px #ccc; background:#eee; line-height:24px; padding-left:12px;\">"+top.Lang.Mail.Write.huaikeyishuru+"<span class='red-commend'>{0}</span>"+top.Lang.Mail.Write.ge+"</div>",//<div class=\"richinputbox_tips\" style=\"border:solid 1px #ccc; background:#eee; line-height:24px; padding-left:12px;\">还可以输入<span class='red-commend'>{0}</span>个</div>
                    overflowTips1 = '<div class=\"richinputbox_tips\" style=\"border:solid 1px #ccc; background:#eee; line-height:24px; padding-left:12px;\">'+top.Lang.Mail.Write.shoujianrenshuyichaoguoshangxian+'<span class="red-commend">{0}</span>'+top.Lang.Mail.Write.renbunenjixutianjia+'</div>',//<div class=\"richinputbox_tips\" style=\"border:solid 1px #ccc; background:#eee; line-height:24px; padding-left:12px;\">收件人数已超过上限<span class="red-commend">{0}</span>人，不能继续添加！</div>
                    overflowTips2 = '<div class=\"richinputbox_tips\" style=\"border:solid 1px #ccc; background:#eee; line-height:24px; padding-left:12px;\"><span class="red-commend">{1}</span>'+top.Lang.Mail.Write.renweitianjiazuiduotianjia+'<span class="red-commend">{0}</span>'+top.Lang.Mail.Write.ren+'</div>',//<div class=\"richinputbox_tips\" style=\"border:solid 1px #ccc; background:#eee; line-height:24px; padding-left:12px;\"><span class="red-commend">{1}</span>人未添加，最多添加<span class="red-commend">{0}</span>人</div>
                    clearRIBTips = function () {
                        if (me.ribs[0].interval) {
                            clearTimeout(me.ribs[0].interval);
                            $(me.ribs[0].container).parent().parent().parent().find('.richinputbox_tips').remove();
                        }
                    },
                    showRIBTips = function (tip, host) {
                        $(host.container).parent().parent().parent().append(tip);
                    },
                    showAndAutoHideRIBTips = function (tip, host) {
                        showRIBTips(tip, host);
                        host.interval = setTimeout(function () {
                            clearRIBTips();
                        }, 3 * 1000);
                    };

                var show_dialog = function () {
                    var callback = function (d) {
                        for (var i = 0, l = d.length; i < l; i++) {
                            var val = d[i].value;
                            Meeting.selectMail('', val);
                        }
                    };
                    var s = [];
                    if (GC.check("CONTACTS_ENT")) {
                        s.push("0");
                    }
                    if (GC.check("CONTACTS_PER")) {
                        s.push("2");
                    }
                    ;
                    Meeting.contact = new parent.Contact("window.frames['" + parent.gConst.ifrm + parent.GE.tab.curid + "'].Meeting.contact");
                    Meeting.contact.groupMap = parent.LMD.groupMap;
                    Meeting.contact.group_contactListMap = parent.LMD.group_contactListMap_mail;
                    Meeting.contact.inItContanct("publicPerson_ContactDialog", s, callback, null);
                };

                var recipient_dialog = function () {
                    var id = jQuery('#recipient_container input')[0].id;
                    me.focusId = id;
                    me.richInputBox = me.ribs[0];
                    show_dialog();
                };

                $('#recipient_person').bind('click', recipient_dialog);

                var param = {
                    type: 'email',
                    autoHeight: true,
                    maxHeight: 100,
                    maxMailNum: 50,
                    skinAble: true,
                    change: function () {
                        var leftCount = 0;
                        me.setHeight(this.container);

                        // 重新设置关联组件的最大人数
                        (function (ribs) {
                            var allItemCount = 0;
                            var chkObj = {};
                            var ribItems = ribs[0].getItems();
                            for (var i = 0; i < ribItems.length; i++) {
                                if (!chkObj.hasOwnProperty(ribItems[i].allText)) {
                                    allItemCount++;
                                    chkObj[ribItems[i].allText] = 1;
                                }
                            }
                            leftCount = me.toMaxNum - allItemCount;
                            ribs[0].maxMailNum = leftCount;
                        })(me.ribs);
                    },
                    itemCreated: function (stats) {
                        var num = this.maxMailNum;
                        var