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
                    tipsTemplate = "<div class=\"richinputbox_tips\" style=\"border:solid 1px #ccc; background:#eee; line-height:24px; padding-left:12px;\">还可以输入<span class='red-commend'>{0}</span>个</div>",
                    overflowTips1 = '<div class=\"richinputbox_tips\" style=\"border:solid 1px #ccc; background:#eee; line-height:24px; padding-left:12px;\">收件人数已超过上限<span class="red-commend">{0}</span>人，不能继续添加！</div>',
                    overflowTips2 = '<div class=\"richinputbox_tips\" style=\"border:solid 1px #ccc; background:#eee; line-height:24px; padding-left:12px;\"><span class="red-commend">{1}</span>人未添加，最多添加<span class="red-commend">{0}</span>人</div>',
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
                        var tips = '', overTips = '';
                        var ss = stats || {};
                        var mode = ss.mode || '';

                        if (mode == 'paste' && ss.fail > 0) {
                            overTips = overflowTips2.format(Meeting.toMaxNum, ss.fail);
                        }
                        else {
                            overTips = overflowTips1.format(Meeting.toMaxNum);
                        }
                        clearRIBTips();
                        if (num <= Meeting.receiveBegin) {
                            tips = tipsTemplate.format(num);
                            if (num <= 0) {
                                tips = overTips;
                            }
                            showAndAutoHideRIBTips(tips, this);
                        }
                    },
                    itemDeleted: function () {
                        var num = this.maxMailNum;
                        clearRIBTips();
                        if (num <= Meeting.receiveBegin) {
                            showAndAutoHideRIBTips(tipsTemplate.format(num), this);
                        }
                    },
                    mailNumError: function (obj) {
                        var tips = '';
                        var state = obj.statusInfo || {};
                        clearRIBTips();
                        if (obj.createMode == 'paste') {
                            tips = overflowTips2.format(Meeting.toMaxNum, state.fail || '所有粘贴的');
                        }
                        else {
                            tips = overflowTips1.format(Meeting.toMaxNum);
                        }
                        showAndAutoHideRIBTips(tips, obj);
                    }
                };

                param.container = $("#recipient_container")[0];
                var rp_c = new RichInputBox(param);
                rp_c.autoDataSource = parent.AutoFill.datas['email'];
                me.ribs.push(rp_c);
                var autoFillIds = [];

                var clearTips = function () {
                    if (me.personErrTips && me.personErrTips instanceof ToolTips) {
                        me.personErrTips.close();
                        me.personErrTips = null;
                    }
                    if (me.titleErrTips && me.titleErrTips instanceof ToolTips) {
                        me.titleErrTips.close();
                        me.titleErrTips = null;
                    }
                }
                $('.RichInputBoxLayout').each(function (i, v) {
                    $(this).unbind('click', clearTips).bind('click', clearTips);
                });

                $('.RichInputBoxLayout input').each(function (i, v) {
                    var id = jQuery(this).attr('id');
                    $(this).unbind('focus').bind('focus', function () {
                        me.doTextFocus(id);
                        me.focusId = id;
                        me.richInputBox = me.ribs[i];
                    });
                    parent.LMD.fillEmail(jQuery(this)[0], window, {
                        setCall: me.selectMail,
                        fromType: 'autoComplete',
                        showTemplate: "<span class=\"autoComplete_name\">&quot;$NAME$&quot;</span> &lt;$VALUE$&gt;",
                        offsetFun: function () {
                            var left = parent.El.getX(this.objText) || 0;
                            var docWidth = parent.El.docWidth();
                            var leftSideWidth = parent.El.width(top.window.document.getElementById(top.gConst.divLeft));
                            var offset = docWidth - leftSideWidth - left - 430;
                            if (offset > 0) {
                                offset = 0;
                            }
                            return [
                                offset,
                                -(jQuery('.RichInputBoxLayout').eq(i)[0].scrollTop || 0)
                            ];
                        },
                        fixWidth: 400
                    });
                    autoFillIds.push({id: id, loaded: false});
                });

                var limitFindTimes = 0;

                function findAutoFillObj() {
                    var needToLoad = false;
                    if (autoFillIds && autoFillIds.length) {
                        for (var i = 0; i < autoFillIds.length; i++) {
                            if (parent.LMD.autoFillInstances[autoFillIds[i].id] instanceof parent.AutoFill) {
                                if (!autoFillIds[i].loaded) {
                                    me.autoFillObjects.push(parent.LMD.autoFillInstances[autoFillIds[i].id]);
                                    autoFillIds[i].loaded = true;
                                }
                            }
                            else {
                                needToLoad = true;
                            }
                        }
                        if (needToLoad && (limitFindTimes <= 30)) {
                            limitFindTimes++;
                            setTimeout(findAutoFillObj, 100);
                        }
                    }
                }

                findAutoFillObj();


                /* 编辑器开始 */
                editor = new RichTextBox({
                    id: "editor"
                });

                $("#meeting_texteditor").html(editor.getHtml());
                $("#htmlEditor" + editor.id).bind('load', function () {
                    RTB_items.init();
                    me.isEditorLoaded = true;
                });
                /* 编辑器结束 */

                placeholder($("#textMeetingSubject"), "会议主题");
                placeholder($("#textMeetingAddr"), "地点");

                function placeholder(el, str) {
                    el.focus(function () {
                        el.css("color", "#000000");
                        if ($(this).val() === str) {
                            $(this).val("");
                        }
                    }).blur(function () {
                        if ($(this).val() === "") {
                            $(this).val(str);
                            el.css("color", "#999999");
                        }
                    });
                }
            },
            bindEvent: function () {
                var me = this;

                $(".btnMeetingToolbarSave").click(function () {
                    clearInterval(me.autoTimer);
                    me.sendInvite();
                });

                $(".btnMeetingToolbarDraft").click(function () {
                    me.sendInvite(true);
                });

                // 工具条按钮取消事件
                $(".btnMeetingToolbarCancel").click(function () {
                    parent.CC.exit();
                });

                // 状态框切换
                $("#btnMeetingStatus").click(function () {
                    var str = $(this).html();

                    if (str === "查看发送状态") {
                        $("#boxMeetingStatus").show();
                        str = "隐藏发送状态";
                        parent.CC.showMsg("状态已刷新", true, false, "option");
                        me.getMailStatus(me.renderStatusData, me.renderFailStatusData);
                    } else {
                        $("#boxMeetingStatus").hide();
                        str = "查看发送状态";
                    }
                    $(this).html(str);
                });

                // 刷新按钮
                $("#btnMeetingRefreshStatus").click(function () {
                    parent.CC.showMsg("状态已刷新", true, false, "option");
                    me.getMailStatus(me.renderStatusData, me.renderFailStatusData);
                });

                // 再写一封按钮事件
                $("#btnGotoWrite").click(function () {
                    me.initData(function () {
                        $("#btnMeetingStatus").html("查看发送状态");
                        $("#boxMeetingStatus").hide();
                        $("#boxSendResult").hide();
                        $("#boxSent").show();
                        me.autoTimer = setInterval(function () {
                            if (Meeting.tabId === top.CC.getCurLabId) {
                                Meeting.sendInvite(true);
                            }
                        }, Meeting.autoDuration);

                    });
                });

                // 去收信箱按钮
                $("#btnGotoRec").click(function () {
                    parent.CC.goInbox(true);
                });

                // 去发信箱
                $("#btnGotoOutbox").click(function () {
                    var folderId = 3;
                    if (me.isSchedule === "true") {
                        folderId = 2;
                    }
                    parent.CC.goFolder(folderId);
                });
            },
            sendInvite: function (isDraft) {
                var me = this,
                    isHtml = editor.getEditorMode() ? 1 : 0,
                    title = ($("#textMeetingSubject").val() === "会议主题") ? "" : $("#textMeetingSubject").val(),
                    addr = ($("#textMeetingAddr").val() === "地点") ? "" : $("#textMeetingAddr").val(),
                    content = editor.getEditorValue() || "",
                    time = $("#inputMeetingDate").val().replace(/\-/g, "/") + " " + $("#inputMeetingHour").val() + ":" + $("#inputMeetingMinute").val() + ":00",
                    duration = $("#inputMeetingDuration").val(),
                    meetingStart = new Date(time).getTime() / 1000,
                    meetingEnd = new Date(time).getTime() / 1000 + parseInt(duration) * 60,
                    mailData = {},
                    sendData = {},
                    isOk = true,
                    tmpAllTxt,
                    tip,
                    k,
                    to = "";

                if (this.ribs[0]) {
                    for (k in this.ribs[0].items) {
                        tmpAllTxt = this.ribs[0].items[k].allText;
                        to += tmpAllTxt + ';';
                    }
                }
                me.addressee = to;

                if (!isDraft) {
                    if (to.indexOf(";") === -1) {
                        tip = new ToolTips({
                            id: 'recepitent_tips',
                            direction: ToolTips.direction.Bottom
                        });
                        tip.show($("#rib_input_1")[0], parent.Lang.Mail.Write.receiperAddr);
                        RichInputBox.Tool.blinkBox($("#recipient_container div:first"), 'blinkColor');
                        parent.CC.hideMsg();
                        me.personErrTips = tip;
                        isOk = false;
                        return false;
                    }

                    if (this.ribs[0].getErrorText()) {
                        tip = new ToolTips({
                            id: 'recepitent_tips',
                            direction: ToolTips.direction.Bottom
                        });
                        tip.show($("#rib_input_1")[0], parent.Lang.Mail.tips021);
                        parent.CC.hideMsg();
                        isOk = false;
                        this.personErrTips = tip;
                        return false;
                    }

                    if (title === "" || title === "会议主题") {
                        tip = new ToolTips({
                            id: 'subject_tips',
                            direction: ToolTips.direction.Bottom
                        });
                        tip.show($("#textMeetingSubject")[0], "请输入会议主题");
                        parent.CC.hideMsg();
                        isOk = false;
                        this.personErrTips = tip;
                        return false;
                    }

                    if (addr === "" || addr === "地点") {
                        tip = new ToolTips({
                            id: 'addr_tips',
                            direction: ToolTips.direction.Bottom
                        });
                        tip.show($("#textMeetingAddr")[0], "请输入会议地点");
                        isOk = false;
                        this.personErrTips = tip;
                        return false;
                    }

                    if ((new Date(time)).getTime() <= (new Date()).getTime()) {
                        tip = new ToolTips({
                            id: 'duration_tips',
                            direction: ToolTips.direction.Right
                        });
                        tip.show($("#inputMeetingDate")[0], "会议时间不能早于当前时间");
                        isOk = false;
                        this.personErrTips = tip;
                        return false;
                    }
                }

                mailData = {
                    attrs: {
                        "account": parent.gMain.userNumber,
                        "denyForward": 0,
                        "securityLevel": 0,
                        //"omid": me.omid,
                        "mid": me.mid,
                        "to": to,
                        "cc": "",
                        "bcc": "",
                        "replyTo": "",
                        "subject": title,
                        "content": content,
                        "isHtml": isHtml,
                        "priority": 0,
                        "saveSentCopy": 1,
                        "requestReadReceipt": 0,
                        "inlineResources": 0,
                        "scheduleDate": 0,
                        "normalizeRfc822": 0,
                        "id": Meeting.id || "",
                        "sendWay": 4,
                        "meetingAttr": {
                            "location": addr,
                            "meetingStart": meetingStart,
                            "meetingEnd": meetingEnd
                        }
                    },
                    returnInfo: 1
                };


                if (!me.draftId && isDraft && me.funcid !== "mbox:restoreDraft") {
                    mailData.action = "firstsave";
                } else {
                    if (isDraft) {
                        mailData.action = "save";
                    } else {
                        mailData.action = "deliver";
                    }
                }

                sendData = {
                    func: "mbox:compose",
                    data: mailData,
                    call: composeCallback,
                    failCall: composeFailCallback,
                    params: {
                        "comefrom": 5,
                        "categoryId": "103000000"
                    },
                    msg: ''
                };
                if (me.doStatusMessage() && PageState === PageStateTypes.Uploading) {
                    parent.CC.alert(parent.Lang.Mail.Write.notSendMail + "!");
                    return false;
                }

                if (isDraft) {
                    CC.showMsg("会议邀请正在保存到草稿箱", true, false, 'option');
                    me.status = WriteState.save;
                } else {
                    CC.showMsg("正在发送会议邮件", true, false, 'option');
                    me.status = WriteState.send;
                }

                parent.MM.mailRequestApi(sendData);

                function composeCallback(resp) {
                    Meeting.status = WriteState.none;
                    PageState = PageStateTypes.Common;

                    Meeting.oldData = Meeting.getCurrMeetingData();

                    if (!isDraft) {
                        $("#boxSent").hide();
                        $("#boxSendResult").show();
                        me.id = resp["var"]["tid"];
                    } else {
                        me.mid = resp["var"];
                        //me.oldData=mailData;
                        CC.showMsg("邮件已于" + (new Date()).toLocaleTimeString() + "保存到草稿箱", true, false, 'option');
                        //刷新草稿箱
                        var o = parent.GE.folderObj.draft;
                        if (parent.GE.tab.exist(o)) {
                            parent.MM[o].refresh(true);
                        }
                    }
                };

                function composeFailCallback(resp, url, isDraft) {
                    var me = this,
                        errorMsg = "",
                        isDraft = isDraft || 0,
                        code = resp.code;

                    Meeting.status = WriteState.none;
                    PageState = PageStateTypes.Common;

                    switch (code) {
                        case "FA_ATTACH_EXCEED_LIMIT":
                            errorMsg = "," + top.Lang.Mail.Write.attachmentSize;
                            break;
                        case "FA_RECEIVER_EXCEED_LIMIT":
                            errorMsg = "," + top.Lang.Mail.Write.ReceiverLimit;
                            break;
                        case "FA_ID_NOT_FOUND":
                            errorMsg = "," + top.Lang.Mail.Write.composeid;
                            break;
                        case "FA_FORBIDDEN":
                            errorMsg = "," + top.Lang.Mail.Write.forbidden;
                            break;
                        case "FA_OVERFLOW":
                            errorMsg = "," + top.Lang.Mail.Write.Overflow;
                            break;
                        case "FA_NO_RECEIPT":
                            errorMsg = "," + top.Lang.Mail.Write.NoReceipt;
                            break;
                        case "FA_WRONG_RECEIPT":
                            errorMsg = "," + top.Lang.Mail.Write.WrongReceipt;
                            break;
                        case "FA_INVALID_DATE":
                            errorMsg = "," + top.Lang.Mail.Write.noTime;
                            break;
                        case "FA_NEED_VERIFY_CODE":
                            errorMsg = "," + top.Lang.Mail.Write.needCode;
                            break;
                        case "FA_INVALID_VERIFY_CODE":
                            errorMsg = "," + top.Lang.Mail.Write.codeErr;
                            break;
                        case "FA_INVALID_ACCOUNT":
                            errorMsg = "," + top.Lang.Mail.Write.accountErr;
                            break;
                        case "FA_IS_SPAM":
                            errorMsg = "," + top.Lang.Mail.Write.MailAsSpan;
                            break
                        case "FA_INVALID_PARAMETER":
                            errorMsg = "," + top.Lang.Mail.Write.ParamErr;
                            break;
                        case "FA_FORBIDDEN_FORWARD_OUT_USER":
                            errorMsg = "," + top.Lang.Mail.tips041;
                            break;
                        case "FS_UNKNOWN":
                            errorMsg = "," + top.Lang.Mail.sysW;
                            break;
                    }
                    ;

                    if (top.IsDebug) {
                        errorMsg += " code:" + (code || "") + " msg:" + (resp["var"] || resp["summary"] || "");
                    }
                    if (isDraft) {
                        errorMsg = (me.isAutoSave ? top.Lang.Mail.Write.autoSaveFail : top.Lang.Mail.Write.draftSaveFail) + errorMsg;
                    } else {
                        errorMsg = errorMsg.replace(/\n/g, '<br />');
                    }
                    CC.showMsg(errorMsg, true, false, 'error');
                    top.Util.writeLogError(top.gConst.logFunc.js, url || "", "method=Meeting.composeFailCallback.composeFailCallback | code=" + code + " | summary=" + errorMsg + (resp["var"] || ""));
                }
            },
            getComposeId: function (callback) {
                var self = Meeting,
                    reqData = {};

                if (self.id) {
                    if (typeof callback == "function") {
                        callback.call(self, self.id);
                    }
                } else {
                    reqData = {
                        func: parent.gConst.func.getComposeId,
                        data: null,
                        method: "get",
                        call: function (resp) {
                            try {
                                if (resp.code === "S_OK") {
                                    if (!self.id) {
                                        self.id = resp["var"];
                                    }
                                    if (typeof callback === "function") {
                                        callback.call(self, self.id);
                                    }
                                }
                            } catch (e) {
                                parent.ch("Meeting.getComposeId", e);
                            }
                        },
                        failCall: function () {
                        },
                        msg: ""
                    };
                    parent.MM.mailRequestApi(reqData);
                }
            },
            doStatusMessage: function () {
                if (Meeting.status == 1) {
                    CC.alert(top.Lang.Mail.Write.sendingMailWait);
                } else if (Meeting.status == 2) {
                    CC.alert(top.Lang.Mail.Write.saveingDraftWait);
                } else {
                    return true;
                }
            },
            initData: function (callback) {
                var me = this,
                    t = new Date();

                me.id = "";
                this.getComposeId(function (id) {
                    me.id = id;
                    attach.init(id);
                    $("#attachContainer").empty();
                });
                editor.setEditorValue("");
                this.ribs[0].clear();

                Meeting.textMeetingSubject = "会议主题"
                Meeting.textMeetingAddr = "地点"
                Meeting.inputMeetingDate = t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate()
                Meeting.inputMeetingHour = t.getHours()
                Meeting.inputMeetingMinute = "00"
                Meeting.inputMeetingDuration = "30"


                $("#textMeetingSubject").val("会议主题");
                $("#textMeetingAddr").val("地点");
                $("#textMeetingSubject, #textMeetingAddr").css("color", "#999999");
                $("#inputMeetingDate").val(t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate());
                $("#inputMeetingHour").val(t.getHours());
                $("#inputMeetingMinute").val("00");
                $("#inputMeetingDuration").val("30");

                if (typeof callback === "function") {
                    callback()
                }
            },
            getMailStatus: function (callback, failcall) {
                var me = this,
                    reqData = {};

                reqData = {
                    "func": "mbox:getDeliverStatus",
                    "data": {
                        "sort": 1,
                        "start": 0,
                        "total": 5,
                        "tid": me.id
                    },
                    "call": callback,
                    "failCall": failcall,
                    "msg": ""
                };
                top.MM.mailRequest(reqData);
            },
            renderStatusData: function (data) {
                var grid = $(".state_table").eq(0),
                    html = [],
                    i = 0,
                    t = (new Date()).toLocaleString(),
                    len,
                    statusInfo,
                    statusStr = {},
                    tmpData;

                data = (typeof data === "string") ? top.JSON.parse(data) : data;
                statusStr = {
                    "0": "进入队列",
                    "60": "已投递到对方邮箱",
                    "61": "已投递到对方邮箱，但被对方认定为病毒邮件",
                    "70": "本域投递失败，已退信，反病毒，有病毒",
                    "71": "本域投递失败，已退信，MD返回，用户不存在",
                    "72": "本域投递失败，已退信，MD返回，用户已冻结或注销",
                    "73": "本域投递失败，已退信，通信，内部服务器通信错误",
                    "74": "本域投递失败，已退信，组过滤，收件人在黑名单中",
                    "75": "本域投递失败，已退信，组过滤，发件人与收件人不是同一企业用户",
                    "76": "本域投递失败，已退信，组过滤，发件人不在白名单中",
                    "77": "本域投递失败，已退信，企业入站黑名单，收件人在企业出站黑名单中",
                    "78": "本域投递失败，已退信，企业入站黑名单，发件人在企业入站黑名单中",
                    "79": "本域投递失败，已退信，用户黑名单，收件人在用户黑名单中",
                    "80": "本域投递失败，已退信，分拣规则，用户分拣规则拒收",
                    "81": "本域投递失败，退信失败，通信，内部服务器通信错误",
                    "99": "进入外域投递队列",
                    "100": "外域已转发到对方服务器",
                    "101": "外域尝试重发",
                    "119": "外域转发失败",
                    "250": "该邮件已超出有效期，无法查询发信状态"
                }

                if (data["code"] === "S_OK") {
                    statusInfo = data["var"][0]["tos"]
                    for (len = statusInfo.length; i < len; i++) {
                        tmpData = statusInfo[i];
                        html.push("<tr>");
                        html.push("<td>", tmpData["mail"], "</td>");
                        html.push("<td>", statusStr[tmpData["state"]], "</td>");
                        html.push("<td>", t, "</td>");
                        html.push("</tr>");
                    }
                }

                grid.find("tbody").empty().append(html.join(""));
            },
            renderFailStatusData: function () {
                var grid = $(".state_table").eq(0),
                    html = [],
                    i = 0,
                    composeDatas = Meeting.addressee.split(";");

                var htmltxt = "<tr><td style=\"text-overflow:ellipsis; white-space:nowrap; overflow:hidden;\">{0}</td>";
                htmltxt += "<td>{1}</td>";
                htmltxt += "<td>{2}</td></tr>";

                for (; i < composeDatas.length - 1; i++) {
                    var mail = composeDatas[i].encodeHTML();
                    var status = '投递中';
                    var time = top.Util.formatDate(new Date());
                    html.push(htmltxt.format(mail, status, time));
                }
                grid.find("tbody").empty().html(html.join(""));
            },
            setSize: function () {
            },
            /***
             * 初始化通讯录列表
             */
            loadAddrList: function () {
                var p = Meeting;
                var s = [];

                contact.isShowValue = false;
                if (parent.CC.isRmAddr()) {
                    contact.isAsyn = false;
                }
                contact.setValue = function (name, email) {
                    p.selectMail(email, name + " <" + email + ">");
                };

                contact.showLinkMan(s, "contact_addr_container");
                var listAll = ["MAILGROUP", "EP", "CS", "PERSON", "RECENT"];
                var list = [];
                if (GC.check("CONTACTS_PER")) {
                    s.push("5");
                }
                if (GC.check("CONTACTS_ENT") && parent.window.IsOA == 0) {
                    s.push("0");
                }
                if (GC.check("CONTACTS_PER")) {
                    s.push("2");
                }
                if (GC.check("CONTACTS_PER")) {
                    if (parent.window.IsOA != 1) {
                        s.push("3");
                    }
                }
                //右侧通讯录搜索
                var searchBtn = $("#searchDelete")[0];
                var searchInput = $("#searchKey")[0];
                var keyValue = parent.Lang.Mail.tips019;
                searchInput.value = keyValue;
                parent.EV.observe(searchInput, 'focus', function () {
                    if (jQuery(searchInput).val() == keyValue) {
                        jQuery(searchInput).val('');
                        jQuery(searchInput).css('color', 'black');
                    }
                });
                parent.EV.observe(searchInput, 'blur', function () {
                    if (jQuery(searchInput).val().trim() == '') {
                        jQuery(searchInput).val(keyValue);
                        jQuery(searchInput).css('color', '');
                    }
                });

                var ap = {
                    "div": "tab_search_div",
                    "setCall": p.selectMail,
                    "line": 20,
                    "text": "searchKey",
                    "autocomplete": true,
                    "noHideDiv": true,
                    "statsCall": function (v) {
                        v = v || 0;
                        if (v == 0) { //0为没有搜关键字
                            jQuery("#searchDelete").removeClass('searchDelete');
                            $("#tab_list_div")[0].style.display = "";
                            $("#tab_search_div")[0].style.display = "none";
                        } else {
                            jQuery("#searchDelete").addClass("searchDelete");
                            $("#tab_list_div")[0].style.display = "none";
                            $("#tab_search_div")[0].style.display = "";
                        }
                    }
                };
                parent.LMD.fillEmail("searchKey", window, ap);

                parent.EV.observe($("#searchDelete")[0], "click", function () {
                    $("#searchKey")[0].value = keyValue;
                    $("#searchKey")[0].style.color = '';
                    ap.statsCall(0);
                });
            },
            doSepClick: function (isShow) {
                var tabArea = $("#writeSidebar")[0];
                var sep = $("#switchDiv")[0];
                var obj = $("#tabSwitch")[0];
                var iconW = parent.El.width(sep);
                var sbW = parent.El.width(tabArea);
                var totalW = iconW + sbW;
                var writeContent = $(".maininfo_box")[0];
                var dis = typeof isShow == "undefined" ? !(parent.El.visible(tabArea)) : null;
                var writeWrapper = $("#writeWrapper")[0];
                var switchDiv = $("#switchDiv")[0];
                var writeWrapW = 0, offset = 5;
                if (!isIE && (isShow && isShow.type == "click")) {
                    isShow = undefined;
                }
                if (isShow || dis) {
                    writeWrapW = 212;
                    var W = 0;
                    parent.El.show(tabArea);
                    parent.El.setStyle(writeContent, {
                        "marginRight": (totalW + offset) + "px"
                    });
                    parent.El.setStyle(sep, {
                        "marginLeft": -totalW + "px"
                    });
                    parent.El.setStyle(writeWrapper, {
                        "marginRight": -writeWrapW + "px"
                    });
                    parent.El.setStyle(switchDiv, {
                        "marginLeft": W + "px"
                    });
                    parent.El.removeClass(obj, "on");
                } else {
                    if (top.Browser.isIE && top.Browser.ie < 7) {
                        writeWrapW = -2;
                    }
                    else {
                        writeWrapW = 0;
                    }
                    parent.El.hide(tabArea);
                    parent.El.setStyle(writeContent, {
                        "marginRight": (iconW + offset) + "px"
                    });
                    parent.El.setStyle(sep, {
                        "marginLeft": -iconW + "px"
                    });
                    parent.El.setStyle(writeWrapper, {
                        "marginRight": writeWrapW + "px"
                    });
                    parent.El.addClass(obj, "on");
                }
            }
        };

        window.Meeting = Meeting;
        Meeting.init();
        Meeting.oldData = Meeting.getCurrMeetingData();
    });
})(jQuery);