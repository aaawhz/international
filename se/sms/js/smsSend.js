var $ = function(id) {
    return document.getElementById(id);
};
var smsLang = Lang.Sms;
/***
 * @description 发短信
 */

var SMS = {
    rib: null,  
    smsReceiverID: 'sms_receiver', //接收用户DIV ID
    smsReceiver: $('sms_receiver'), //接收用户DIV对象
    smsReceiverInput: null, //接收用户文本框对象
    smsReceiverTips: smsLang.smsReceiverTips, //接收用户提示信息
    smsReceiverMax: 50, //分批接收用户数量
    smsReceiverMaxError: smsLang.smsReceiverMaxError, //接收用户超过最大数提示信息
    smsReceiveEmptyTips: smsLang.smsReceiveEmptyTips, //接收用户为空提示信息
    smsReceiveErrorTips: smsLang.smsReceiveErrorTips, //接收用户输入错误提示信息
    smsContent: $('sms_content'), //短信内容文本框对象
    smsContentRemain: $('remain_num'), //短信剩余内容DIV对象
    smsContentMax: 350, //短信内容最大数
    timeSendYears: 1, //定时短信年份增量
    timeEarlyTips: smsLang.timeEarlyTips, //定时短信时间早于当前时间报错提示
    timeFlag: false, //定时短信标志 true 定时;false 非定时
    currSvrTime: 0, //当前服务器时间
    sendMsgUrl: '/sms/sms.do', //发送短信url
    sendMsgFunc: 'sms:send', //发短信命令
    getSerTimeFunc: 'sms:svrTime', //获取服务器时间命令
    getMsgFunc: 'sms:getSendRecord', //获取短信内容命令
    smsSendIndexUrl: parent.gMain.webPath + "/se/sms/smsindex.do?sid=" + parent.gMain.sid, //短信发送页
    smsSendSuccUrl: parent.gMain.webPath + "/se/sms/smssendsucceed.do?sid=" + parent.gMain.sid, //短信发送成功页
    searchkeyValue: smsLang.searchkeyValue, //搜索联系人关键字
    closeSMSTips: smsLang.closeSMSTips, //关闭发短信标签提示
    codeTips: '请点击获取验证码',
    /**
     * 初始化发短信
     */
    sendMsgInit: function() {



        this.bindInputControl();
        this.bindTextControl();
        this.checkcode();
        this.timeSendHandle();
        this.editMsgFill(); //填充编辑短信相关内容

        var _this = this;

        //ajax body data
        var dataParam = {
            receiverNumber: '',
            sendMsg: '',
            sendFlag: 0,
            startSendTime: '',
            serialId: '',
            imgCode: ''
        };

         var ydReg = new RegExp(smsConfig.mobileChinamobile); //中国移动
        var ltReg = new RegExp(smsConfig.mobileChinatelcom); //中国电信
        var dxReg = new RegExp(smsConfig.mobileChinaunion); //中国联通
        
        //如果是联通, 电信, 不能使用该功能, 或者企业 个人都没有给出短信
        if( ltReg.test(smsConfig.bindMobile) || dxReg.test(smsConfig.bindMobile)  || ( smsConfig.userPackSmsCount <= 0 && smsConfig.corpSmsCount <= 0)){
            parent.CC.alert('尊敬的用户，你暂时无法使用本功能，如需使用完整功能，请使用中国移动手机开通139企业邮箱。');
            
        }

        /**
         * 发信
         */
        jQuery('#btnSend').die().live('click', function(event) {
            parent.EV.stopPropagation(event);
            var mobilereg=/\d{11}/g;
            if(!mobilereg.test(smsConfig.bindMobile)||!parent.CC.isMobileBind(parent.gMain.flags)){
                parent.CC.alert('您还没有绑定手机号码，请进入设置-账号与安全中绑定您的手机号码。',function(){
                    top.location.href=parent.gMain.webPath+'/se/account/accountindex.do?sid='+parent.gMain.sid+'&mode=Mobile';
                });
                jQuery('#divDialogClosealertbtn_0 span span',window.parent.document).eq(0).html('立即绑定');
                return;
            }
            //校验接收用户
            var receiverNum = 0;
            var allMobileText = '';
            var receiverNumberStr = '';
            if (_this.rib.getItems().length == 0) {
                _this.showTips('receive_empty', _this.smsReceiveEmptyTips, _this.smsReceiverInput, _this.smsReceiverID);
                return;
            } else if (_this.rib.getItems().length > (smsConfig.dailySendMaxNum - smsConfig.dailyAmount)) {
                _this.showTips('msgnum_limit', '您今天只剩下' + (smsConfig.dailySendMaxNum - smsConfig.dailyAmount) + '条短信可以发送！', _this.smsReceiverInput, _this.smsReceiverID);
                return;
            } else if (_this.rib.getItems().length > (smsConfig.monthlySendMaxNum - smsConfig.monthlyAmount)) {
                _this.showTips('msgnum_limit', '您本月只剩下' + (smsConfig.monthlySendMaxNum - smsConfig.monthlyAmount) + '条短信可以发送！', _this.smsReceiverInput, _this.smsReceiverID);
                return;
            } else if (_this.rib.getErrorText()) {
                _this.showTips('receive_err', _this.smsReceiveErrorTips, _this.smsReceiverInput, _this.smsReceiverID);
                return;
            } else {
                var mobile = '';
                var mobileParam = '';
                for (var item in _this.rib.items) {
                    var mobileText = _this.rib.items[item].allText;
                    var mobileParamItem = mobileText;
                    allMobileText += mobileText + ',';
                    if (mobileText.indexOf('<') != -1) {
                        mobileText = mobileText.substring(mobileText.indexOf('<') + 1, mobileText.indexOf('>'));
                        mobileParamItem = mobileParamItem.substring(mobileParamItem.indexOf('<') + 1, mobileParamItem.indexOf('>')) + jQuery.trim(mobileParamItem.substring(0, mobileParamItem.indexOf('<')));
                    }
                    mobile += mobileText + ',';
                    mobileParam += mobileParamItem + ',';
                    receiverNum += 1;
                }
                receiverNumberStr = mobile.replace(/,$/g, '');
                dataParam.receiverNumber = mobileParam.replace(/,$/g, '');
            }

            //校验短信内容
            if (jQuery.trim(jQuery(_this.smsContent).val()) == '') {
                RichInputBox.Tool.blinkBox(jQuery("#msg_textarea_wrap"), 'blinkColor');
                return;
            } else {
                var content = jQuery.trim(jQuery('#sms_content').val()).encodeHTML();
                dataParam.sendMsg = content;
            }

            //校验验证码
            if (smsConfig.checkcode) {
                var code = jQuery.trim(jQuery('#codeInput').val());
                var codeerr = jQuery('#codeerr');
                if (code == '请点击获取验证码' || code == '') {
                    codeerr.show();
                    return;
                } else {
                    codeerr.hide();
                    dataParam.imgCode = code;
                }
            }

            //校验定时发信
            if (jQuery('#time_send').attr('checked') == 'checked') {
                var y = jQuery('#selYear').val(),
                    m = jQuery('#selMonth').val(),
                    d = jQuery('#selDay').val(),
                    h = jQuery('#selHour').val(),
                    mt = jQuery('#selMinute').val();
                var timeStr = y + '/' + m + '/' + d + ' ' + h + ':' + mt;
                if (new Date(timeStr).getTime() <= new Date(SMS.currSvrTime).getTime()) {
                    _this.showTips('time_early', _this.timeEarlyTips, _this.smsReceiverInput, _this.smsReceiverID);
                    return;
                } else {
                    var timeSendStr = y + '-' + m + '-' + d + ' ' + h + ':' + mt + ':00';
                    dataParam.sendFlag = 1;
                    dataParam.startSendTime = timeSendStr;
                }
            } else {
                dataParam.sendFlag = 0;
                dataParam.startSendTime = '';
            }


            //编辑短信记录id
            if (jQuery('#serialId').val() != '') {
                dataParam.serialId = jQuery('#serialId').val();
            }

            //发送短信的ajax操作
            function send() {
                _this.Ajax(_this.sendMsgUrl, _this.sendMsgFunc, dataParam, function(data) {
                    try {
                        if (data.code == "S_OK") {
                            var form = document.createElement('form');
                            var receiverNumber = document.createElement('input');
                            receiverNumber.type = 'hidden';
                            receiverNumber.name = 'receiverNumber';
                            receiverNumber.value = receiverNumberStr;

                            form.method = 'post';
                            form.action = _this.smsSendSuccUrl + '&timeflag=' + SMS.timeFlag;
                            form.appendChild(receiverNumber);
                            document.body.appendChild(form);
                            form.submit();
                        } else {
                            parent.CC.alert(data.summary);
                        }
                    } catch (e) {
                        parent.ch("sms send callback error." + e);
                    }
                }, function(d) {
                    // parent.CC.alert(d.summary); .substring(7)
                    parent.CC.showMsg(d.summary,true,false,"error");
                    SMS.getAuthCode();
                });
            }
            
            /**
                                当月个人免费条数剩余数 UserPackSmsRemain
                                 当月个人免费条数总数    UserPackSmsCount 
                                 当月企业限制条数 corpSmsCount
                                 当月个人使用企业短信条数 corpSmsUsedCnt 
                                彩信只有 UserPackMmsCount  和  UserPackMmsRemain
  
                
                2.4个人免费彩信使用完时出现提示：“您本月免费赠送的彩信已用完，
                继续使用将以0.3元/条计费扣您个人费用。”    
                          
             */
            var ydReg = new RegExp(smsConfig.mobileChinamobile); //中国移动
            var ltReg = new RegExp(smsConfig.mobileChinatelcom); //中国电信
            var dxReg = new RegExp(smsConfig.mobileChinaunion); //中国联通
            
            //如果是联通, 电信, 不能使用该功能, 或者企业 个人都没有给出短信
            if( ltReg.test(smsConfig.bindMobile) || dxReg.test(smsConfig.bindMobile)  || ( smsConfig.userPackSmsCount <= 0 && smsConfig.corpSmsCount <= 0)){
                parent.CC.alert('尊敬的用户，你暂时无法使用本功能，如需使用完整功能，请使用中国移动手机开通139企业邮箱。');
                return;
            }
            
            if (smsConfig.receiverMaxNum != 0 || smsConfig.receiverMaxNum == 0 && receiverNum <= _this.smsReceiverMax) { //直接发送全部用户
                
            

                if(  ydReg.test(smsConfig.bindMobile) && smsConfig.userPackSmsRemain <= 0  ){
                    //个人免费短信使用完，且企业绑定手机号码时出现提示：“您本月免费赠送的短信已用完，继续使用将以0.1元/条计费扣企业费用。”
                   if( smsConfig.corpSmsCount > 0){
                       
                       if(  smsConfig.corpSmsUsedCnt >= smsConfig.corpSmsCount ){
                       
                            parent.CC.confirm("您本月所用企业短信已达上限，若继续使用将以0.1元/条计费扣您个人费用。", send, "系统提示", function() {
                                    return;
                            });
                            return;

                        } else{
                            
                           parent.CC.confirm("您本月免费赠送的短信已用完，继续使用将以0.1元/条计费扣企业费用。", send, "系统提示", function() {
                                    return;
                            });
                            
                            return; 
                        }
                        
                    } 
                    
                    //个人免费短信使用完，但企业未绑定手机号码时出现提示：“您本月免费赠送的短信已用完，
                    //若继续使用将以0.1元/条计费扣您个人费用。”
                    
                     if( smsConfig.corpSmsCount <= 0){
                       
                        parent.CC.confirm("您本月免费赠送的短信已用完，若继续使用将以0.1元/条计费扣您个人费用。", send, "系统提示", function() {
                                return;
                        });
                        return;
                    } 
                    
                    
                    //企业绑定手机且企业短信已达上限时出现提示：“您本月所用企业短信已达上限，
                   // 继续使用将以0.1元/条计费扣您个人费用。
                    
                     
                }

                
 
                //<------------before
                //当没有绑定企业短信，个人免费条数用完，联通电信用户 不能再发短信( 即使是收费 )
               /* if((ltReg.test(smsConfig.bindMobile) || dxReg.test(smsConfig.bindMobile)) && smsConfig.corpSmsCount <= 0 && smsConfig.userPackSmsRemain <= 0){
                   
                    parent.CC.alert("对不起，您本月赠送的短信已用完，暂不能使用此功能，下月1号可正常使用",function(){return;},"发送失败");
                    return;
                    
                }*/
                
                // 个人免费的短信用完, 企业绑定的也已经用完, 再使用, 就扣个人的费用
             
                // if (smsConfig.corpSmsCount > 0 && smsConfig.userPackSmsRemain == 0 && smsConfig.corpSmsUsedCnt >= smsConfig.corpSmsCount) {
                   
                //     if(ydReg.test(smsConfig.bindMobile)){
                //         parent.CC.confirm("您本月已发短信条数已超出企业限制，再次发送要以0.1元/条计费扣个人费用。是否要确定发送", send, "系统提示", function() {
                //             return;
                //         });
                //         return;
                //     }
                    
                //     /*if(ltReg.test(smsConfig.bindMobile) || dxReg.test(smsConfig.bindMobile)){
                //        parent.CC.alert("对不起，您本月赠送的短信已用完，暂不能使用此功能，下月1号可正常使用",function(){return;},"发送失败");
                //         return;
                //     }*/

                // } else {
                //     send();
                // }
                
                send();

            } else if (smsConfig.receiverMaxNum == 0 && receiverNum > _this.smsReceiverMax) { //分批发送短信
                var form = document.createElement('form');
                var receiverText = document.createElement('input');
                receiverText.type = 'hidden';
                receiverText.name = 'receiverText';
                receiverText.value = allMobileText.replace(/,$/g, '');

                var sendMsg = document.createElement('input');
                sendMsg.type = 'hidden';
                sendMsg.name = 'sendMsg';
                sendMsg.value = dataParam.sendMsg;

                var startSendTime = document.createElement('input');
                startSendTime.type = 'hidden';
                startSendTime.name = 'startSendTime';
                startSendTime.value = dataParam.startSendTime;

                var serialId = document.createElement('input');
                serialId.type = 'hidden';
                serialId.name = 'serialId';
                serialId.value = dataParam.serialId;

                form.method = 'post';
                form.action = _this.smsSendSuccUrl + '&timeflag=' + SMS.timeFlag;
                form.appendChild(receiverText);
                form.appendChild(sendMsg);
                form.appendChild(startSendTime);
                document.body.appendChild(form);
                form.submit();
            }
        });

        /**
         * 加载默认值
         */
        (function($, win, g) {
            var to = g.getUrlParamValue(win.location.href, 'to');
            if (to) {
                to = to.split(/,，/);
                for (var i = 0; i < to.length; i++) {
                    _this.rib.insertItem(to[i]);
                }
            }
        })(jQuery, window, GC);
    },
    /**
     * 编辑短信
     */
    editMsgFill: function() {
        var _this = this;
        var serialId = parent.GC.getUrlParamValue(location.href, 'smsid');
        var editflag = parent.GC.getUrlParamValue(location.href, 'editflag');
        var sendflag = parent.GC.getUrlParamValue(location.href, 'sendflag');
        if (serialId != '' && serialId != null) {
            var data = {
                'serialId': serialId,
                'sendflag': sendflag
            };
            _this.Ajax(_this.sendMsgUrl, _this.getMsgFunc, data, function(data) {
                try {
                    if (data.code == "S_OK") {
                        var multiReceivers = data["var"].multiReceivers;
                        var sendmsg = data["var"].sendmsg;
                        var sendflag = data["var"].sendflag;
                        var sendtime = data["var"].sendtime;

                        if (editflag == '') {
                            for (var i = 0; i < multiReceivers.length; i++) {
                                if (multiReceivers[i][1] != '') {
                                    SMS.SmsSetCall('', multiReceivers[i][1] + " <" + multiReceivers[i][0] + ">");
                                } else {
                                    SMS.SmsSetCall(multiReceivers[i][0], '');
                                }
                            }

                            jQuery(_this.smsContent).val(sendmsg.decodeHTML().decodeHTML()).focus().blur();

                            //定时时间
                            if (sendflag == 1) {
                                SMS.timeFlag = true;
                                jQuery('#time_send').attr('checked', 'checked');
                                jQuery('#spanDefiniteTime').show();
                                SMS.timeSendInit(sendtime.replace(/-/g, '/'));
                            }
                        } else if (editflag == 'mobile') {
                            for (var i = 0; i < multiReceivers.length; i++) {
                                if (multiReceivers[i][1] != '') {
                                    SMS.SmsSetCall('', multiReceivers[i][1] + " <" + multiReceivers[i][0] + ">");
                                } else {
                                    SMS.SmsSetCall(multiReceivers[i][0], '');
                                }
                            }
                        } else if (editflag == 'content') {
                            jQuery(_this.smsContent).val(sendmsg.decodeHTML().decodeHTML()).focus().blur();
                        }

                        jQuery('#serialId').val(serialId);
                    } else {
                        parent.CC.alert(data.summary);
                    }
                } catch (e) {
                    parent.ch("sms get callback error." + e);
                }
            })
        }
    },
    /**
     * 接收用户绑定input控件
     */
    bindInputControl: function() {
        var _this = this;
        var param;
        if (smsConfig.receiverMaxNum != 0) {
            param = {
                type: 'mobile',
                maxHeight: 60,
                maxMailNum: smsConfig.receiverMaxNum,
                skinAble: true,
                mailNumError: function() {
                    _this.showTips('SmsNumErr', _this.smsReceiverMaxError.replace(/{\d}/g, smsConfig.receiverMaxNum), _this.smsReceiverInput, _this.smsReceiverID, true);
                },
                container: this.smsReceiver,
                mobilelimit: smsConfig.mobileAll
            }
        } else {
            param = {
                type: 'mobile',
                maxHeight: 60,
                //maxMailNum:_this.smsReceiverMax,
                skinAble: true,
                mailNumError: function() {
                    //_this.showTips('SmsNumErr',_this.smsReceiverMaxError.replace(/{\d}/g,_this.smsReceiverMax),_this.smsReceiverInput);
                },
                container: this.smsReceiver
            }
        }

        var smsReceiver = new RichInputBox(param);
        if (parent.CorpType == '2') {
            smsReceiver.setTipText(this.smsReceiverTips);
        } else {
            smsReceiver.setTipText(this.smsReceiverTips);
        }

        this.rib = smsReceiver;
        this.smsReceiverInput = $('rib_input_1');
        parent.LMD.fillMobile('rib_input_1', window, {
            setCall: _this.SmsSetCall,
            fromType: 'autoComplete',
            showTemplate: "<span class=\"autoComplete_name\">&quot;$NAME$&quot;</span> &lt;$VALUE$&gt;",
            fixWidth: 500
        });
    },
    /**
     * 自动填充手机号
     * @param m
     * @param tm
     * @constructor
     */
    SmsSetCall: function(m, tm) {
        SMS.rib.clearTipText();
        var _this = this;
        var val = tm || m;
        var txt = SMS.smsReceiverInput;
        var t = txt.value || "";
        t = t.replace(/[,]+/gi, ";");
        t = t.replace(/^;/, "");
        var lastSep = t.lastIndexOf(";");
        var rib = _this.rib;
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

        if (SMS.rib instanceof RichInputBox) {
            SMS.rib.createItemFromTextBox();
        }
    },
    /**
     * 短信内容绑定LimitMaxInput
     */
    bindTextControl: function() {
        var p = this;
        parent.Vd.limitMaxInput(this.smsContent, this.smsContentMax, this.smsContentRemain, false);
        jQuery(this.smsContent).keyup(function() {
            var len = p.smsContent.value.length;
            //如果还有免费的, 则0条
            if(smsConfig.userPackSmsRemain > 0 ){
                jQuery('#messageNum').html('0');
                return;
            }

            if (len > 0 && len <= 70) {
                jQuery('#messageNum').html('1');
            } else {
                jQuery('#messageNum').html(Math.ceil(len / 67));
            }
        })

    },
    checkcode: function() {
        var self = this;
        var codewrap = jQuery('#checkcode');
        var codeInput = jQuery('#codeInput');
        var codeImg = jQuery('#codeImg');

        if (smsConfig.checkcode) {
            self.getAuthCode();
            codewrap.show();
            codeInput.val(self.codeTips);

            codeInput.click(function(e) {
                e.stopPropagation();
            });

            codeImg.click(function(e) {
                e.stopPropagation();
            });

            codeInput[0].onfocus = function() {
                if (jQuery.trim(jQuery(this).val()) == self.codeTips) {
                    jQuery(this).val('').css('color', '#333');
                }
                codeImg.show();

                jQuery('body').die().live('click', function() {
                    codeImg.hide();
                })
            };

            codeInput[0].onblur = function() {
                if (jQuery.trim(jQuery(this).val()) == '') {
                    jQuery(this).val(self.codeTips).css('color', '#999');
                }
            }
        } else {
            codewrap.hide();
        }
    },
    /**
     * 获取验证码
     */
    getAuthCode: function() {
        jQuery('#authcode').attr('src', smsConfig.authcodeurl + '?t=' + new Date().getTime());
    },
    /**
     * 定时发送初始化
     */
    timeSendHandle: function() {
        var _this = this;
        getSerTime();

        var DefiniteTime = jQuery('#spanDefiniteTime');
        var timeSendBtn = jQuery('#time_send');
        timeSendBtn.die().live('click', function() {
            var _this = jQuery(this);
            if (_this.attr('checked') == 'checked') {
                SMS.timeFlag = true;
                DefiniteTime.show();
                timeSendInit();
            } else {
                SMS.timeFlag = false;
                DefiniteTime.hide();
            }
        })

        jQuery('#close_btn_definiteTime').die().live('click', function() {
            DefiniteTime.hide();
            timeSendBtn.removeAttr('checked');
        })

        var curr = {
                year: '',
                month: '',
                day: '',
                hour: '',
                minute: ''
            },
            selYear = jQuery('#selYear'),
            selMonth = jQuery('#selMonth'),
            selDay = jQuery('#selDay'),
            selHour = jQuery('#selHour'),
            selMinute = jQuery('#selMinute'),
            timeWrap = jQuery('#time_define_container'),
            timeTip = jQuery('#definite_time_diff_tip'),
            timeerr = jQuery('#time_define_err'),
            dayObj = {
                '01': 31,
                '02': 28,
                '03': 31,
                '04': 30,
                '05': 31,
                '06': 30,
                '07': 31,
                '08': 31,
                '09': 30,
                '10': 31,
                '11': 30,
                '12': 31
            };

        timeSendInit();
        jQuery('#selYear,#selMonth').change(function() {
            setDay(selYear.val(), selMonth.val());
        })

        jQuery('#selYear,#selMonth,#selDay,#selHour,#selMinute').change(function() {
            var timeStr = selYear.val() + '/' + selMonth.val() + '/' + selDay.val() + ' ' + selHour.val() + ':' + selMinute.val();
            if (new Date(timeStr).getTime() <= new Date(SMS.currSvrTime).getTime()) {
                timeerr.show();
                timeWrap.hide();
            } else {
                timeWrap.show();
                timeerr.hide();
                showSendTime(selYear, selMonth, selDay, selHour, selMinute);
            }
        })

        /**
         * 定时初始化
         */
        function timeSendInit(time) {
            var now;
            if (!time) {
                if (SMS.currSvrTime == 0) {
                    now = new Date();
                } else {
                    now = new Date(SMS.currSvrTime);
                }
            } else {
                now = new Date(time);
            }

            curr.year = now.getFullYear();
            curr.month = parseInt(now.getMonth()) + 1;
            curr.day = now.getDate();
            curr.hour = now.getHours();
            curr.minute = now.getMinutes();
            setYear(curr.year);
            setDay(selYear.val(), selMonth.val());
            setTimeValue(0, 23, selHour, false);
            setTimeValue(0, 59, selMinute, true);

            if (!time) {
                setCurrentTime(curr, true);
            } else {
                setCurrentTime(curr, false);
            }
            showSendTime(selYear, selMonth, selDay, selHour, selMinute);
        }
        SMS.timeSendInit = timeSendInit;

        /**
         * 设置年份
         */
        function setYear(currYear) {
            selYear.html('');
            var endYear = parseInt(currYear) + _this.timeSendYears;
            for (var i = currYear; i <= endYear; i++) {
                selYear.append('<option value="' + i + '">' + i + '</option>');
            }
        }

        /**
         * 显示某月的天数
         * @param y
         * @param m
         */
        function setDay(y, m) {
            if ((y % 4 == 0 && y % 100 != 0) || (y % 100 == 0 && y % 400 == 0)) {
                dayObj['02'] = 29;
            } else {
                dayObj['02'] = 28;
            }
            selDay.html('');
            for (var i = 1; i <= dayObj[m]; i++) {
                var j = i < 10 ? '0' + i : i;
                var selected = (i == curr.day) ? 'selected' : '';
                selDay.append('<option value="' + j + '">' + i + '</option>')
            }
        }

        /**
         * 时间html赋值
         */
        function setTimeValue(start, end, obj, flag) {
            obj.html('');
            for (var i = start; i <= end; i++) {
                var t = i < 10 ? '0' + i : i;
                var text = flag ? t : i;
                obj.append('<option value="' + t + '">' + text + '</option>');
            }
        }

        /**
         * 设置当前时间
         */
        function setCurrentTime(curr, delay) {
            selMonth.val(curr.month < 10 ? '0' + curr.month : curr.month);
            selDay.val(curr.day < 10 ? '0' + curr.day : curr.day);
            if (delay) {
                selHour.val((curr.hour + 1) < 10 ? '0' + (curr.hour + 1) : (curr.hour + 1));
            } else {
                selHour.val(curr.hour < 10 ? '0' + curr.hour : curr.hour);
            }
            selMinute.val(curr.minute < 10 ? '0' + curr.minute : curr.minute);
        }

        /**
         * 显示定时发送时间
         */
        function showSendTime(selYear, selMonth, selDay, selHour, selMinute) {
            timeTip.html(selYear.val() + '-' + selMonth.val() + '-' + selDay.val() + ' ' + selHour.val() + ':' + selMinute.val());
        }

        /**
         * 获取服务器时间
         */
        function getSerTime() {
            _this.Ajax(_this.sendMsgUrl, _this.getSerTimeFunc, null, function(data) {
                try {
                    if (data.code == "S_OK") {
                        var svrTime = data["var"].svrTime.replace('&nbsp;', ' ');
                        SMS.currSvrTime = new Date(svrTime).getTime();
                        var svrTime = function() {
                            SMS.currSvrTime += 60000;
                            setTimeout(arguments.callee, 60000)
                        }
                        setTimeout(svrTime, 60000);
                    } else {
                        parent.CC.alert(data.summary);
                    }
                } catch (e) {
                    parent.ch("sms get serverTime callback error." + e);
                }
            })
        }
    },
    /**
     * 初始化通讯录
     */
    initAddrList: function() {
        var showType = ["5", "0", "2"];
        var config = {
            type: 4,
            isShowValue: false
        }
        parent.Object.extend(contact, config);

        if (parent.CC.isRmAddr()) { //调用云通讯录，联系人同步获取
            contact.isAsyn = false;
        }
        contact.setValue = function(name, mobile) {
            SMS.SmsSetCall(mobile, name + " <" + mobile + ">");
        };
        contact.showLinkMan(showType, "addrList", parent.Lang);

        //右侧通讯录搜索
        var searchBtn = $('searchDelete')
        var searchInput = $('searchKey');
        var keyValue = this.searchkeyValue;
        searchInput.value = keyValue;
        parent.EV.observe(searchInput, 'focus', function() {
            if (jQuery(searchInput).val() == keyValue) {
                jQuery(searchInput).val('');
                jQuery(searchInput).css('color', 'black');
            }
        });
        parent.EV.observe(searchInput, 'blur', function() {
            if (jQuery(searchInput).val().trim() == '') {
                jQuery(searchInput).val(keyValue);
                jQuery(searchInput).css('color', '');
            }
        });

        var ap = {
            div: "tab_search_div",
            setCall: SMS.SmsSetCall,
            line: 20,
            text: "searchKey",
            autocomplete: true,
            noHideDiv: true,
            statsCall: function(v) {
                v = v || 0;
                if (v == 0) { //0为没有搜关键字
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
        parent.LMD.fillMobile("searchKey", window, ap);

        parent.EV.observe($("searchDelete"), "click", function() {
            $("searchKey").value = keyValue;
            $("searchKey").style.color = '';
            ap.statsCall(0);
        });
    },
    /**
     * 显示tips
     * @param id
     * @param text
     * @param obj
     * @param containerId
     */
    showTips: function(id, text, obj, containerId, nobodyclose) {
        var tip = new ToolTips({
            id: id,
            direction: ToolTips.direction.Top
        });
        tip.show(obj, text);
        if (containerId) {
            RichInputBox.Tool.blinkBox(jQuery("#" + containerId + " div:first"), 'blinkColor');
        }
        jQuery('body').die().live('click', function() {
            if (!nobodyclose) {
                tip.close();
            }
        })
    },
    Ajax: function(url, func, data, callback, failcallback) {
        failcallback = failcallback || function(d) {
            parent.CC.alert(d.summary);
        };
        parent.MM.doService({
            url: url,
            func: func,
            data: data,
            failCall: failcallback,
            call: function(d) {
                callback(d)
            },
            param: ""
        });
    },
    setAdderHeight: function() {
        var _this = this;
        var iframeH = jQuery('#ifrm_outLink_sms', window.parent.document).outerHeight();
        var smstabH = jQuery('#set_head').outerHeight();
        jQuery('#addrList,#tab_search_div').css('height', (iframeH - smstabH - 110) + 'px');
    },
    setSmsContent: function() {
        var _this = this;
        //加密邮件发送完成页面增加短信发送密码
        var composeId = parent.GC.getUrlParamValue(window.location.href, 'composeId');
        if (composeId) {
            //收信人，抄送人，密送人
            var recipients = parent.GE["recipients_" + composeId];
            var smsPwd = parent.GE["smsPwd_" + composeId];
            if (!smsPwd) {
                smsPwd = "空";
            }
            var tempsUserStr = "";
            var templength = recipients.length;
            for (var i = 0; i < templength; i++) {
                var tempsArray = recipients[i].split(" ");
                var tempUser = tempsArray[1];
                tempUser = tempUser.substring(1, tempUser.length - 1)
                if (tempUser.length > 1) {
                    if (i < templength - 1) {
                        tempsUserStr += tempUser + ",";
                    } else {
                        tempsUserStr += tempUser;
                    }

                }

            }
            var getMobileUrl = "/mail/conf.do";
            var getMobileFun = "mail:GetUserMobileList";
            var data = {
                userIds: tempsUserStr
            };
            _this.Ajax(getMobileUrl, getMobileFun, data, function(data) {
                try {
                    if (data.code == "S_OK") {
                        if (data["var"]) {
                            var tempArray = data["var"];
                            for (var i = 0; i < tempArray.length; i++) {
                                var tempItem = tempArray[i];
                                if (tempItem.trueName && tempItem.mobilePhone) {
                                    contact.setValue(tempItem.trueName, tempItem.mobilePhone);
                                }
                                //_this.rib.insertItem(tempArray[i]);
                            }
                        }
                        jQuery('#sms_content').val(smsConfig.smsContents.format(smsPwd, parent.gMain.trueName));

                    } else {
                        parent.CC.alert(data.summary);
                    }
                } catch (e) {
                    parent.ch("sms get callback error." + e);
                }
            })

        }
    },
    Init: function() {
        var _this = this;

        // var mobilereg=/\d{11}/g
        // if(!mobilereg.test(smsConfig.bindMobile)||!parent.CC.isMobileBind(parent.gMain.flags)){
        //     jQuery('.sms-layout').hide()
        //     jQuery('#container').append('<div id="mobile_empty" style="padding: 40px 0px 0px 40px;">  <p class="color_333333 fz_16">您还没有绑定手机。<a href="'+parent.gMain.webPath+'/se/account/accountindex.do?sid='+parent.gMain.sid+'&amp;mode=Mobile" target="_top">现在绑定</a></p>  <p class="pt_10 col999">绑定手机号码后，可享受自写短信/彩信和邮件到达短信通知等特色服务。电信，联通用户暂不支持绑定。</p></div>')
        //     jQuery('.nav-hd a').click(function(){
        //         return false
        //     })
        //     return;
        // }
        // jQuery('.sms-layout').show()

        //是否绑定手机
        var mobilereg = /\d{11}/g;
        if (!mobilereg.test(smsConfig.bindMobile) || !parent.CC.isMobileBind(parent.gMain.flags)) {
            jQuery('#mobile_empty').show();
            jQuery('#sendSMS_wrap').hide();
            return;
        } else {
            jQuery('#mobile_empty').hide();
            jQuery('#sendSMS_wrap').show();
        }

        _this.initAddrList();
        _this.sendMsgInit();
        _this.setAdderHeight();
        _this.setSmsContent();

        //重写关闭标签
        var labId = parent.CC.getCurLabId();
        top.document.getElementById('tab_h_' + labId).getElementsByTagName('a')[0].onclick = function() {
            if ((jQuery('.addrItem').text() + jQuery.trim(jQuery('#sms_content').val())) != '') {
                parent.CC.confirm('现在离开已编辑的短信内容将会丢失，是否确认关闭？', function() {
                    parent.GE.tab.del(labId);
                });
            } else {
                parent.GE.tab.del(labId);
            }
            return false;
        }
    }
}