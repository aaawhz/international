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
    codeTips: top.Lang.Mail.Write.qingdianjihuoquyanzhengma,//请点击获取验证码
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
            parent.CC.alert(top.Lang.Mail.Write.zjdyhnzswffeHkzMMrydsjktqyyx);//尊敬的用户，你暂时无法使用本功能，如需使用完整功能，请使用中国移动手机开通139企业邮箱。
            
        }

        /**
         * 发信
         */
        jQuery('#btnSend').die().live('click', function(event) {
            parent.EV.stopPropagation(event);
            var mobilereg=/\d{11}/g;
            if(!mobilereg.test(smsConfig.bindMobile)||!parent.CC.isMobileBind(parent.gMain.flags)){
                parent.CC.alert(top.Lang.Mail.Write.nhmybdsjhmNPzgsaNwqzbdndsjhm,function(){//您还没有绑定手机号码，请进入设置-账号与安全中绑定您的手机号码。
                    top.location.href=parent.gMain.webPath+'/se/account/accountindex.do?sid='+parent.gMain.sid+'&mode=Mobile';
                });
                jQuery('#divDialogClosealertbtn_0 span span',window.parent.document).eq(0).html(top.Lang.Mail.Write.lijibangding);//立即绑定
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
                _this.showTips('msgnum_limit', top.Lang.Mail.Write.ninjintianzhishengxia + (smsConfig.dailySendMaxNum - smsConfig.dailyAmount) + top.Lang.Mail.Write.tiaoduanxinkeyifasong, _this.smsReceiverInput, _this.smsReceiverID);//您今天只剩下  ||  条短信可以发送！
                return;
            } else if (_this.rib.getItems().length > (smsConfig.monthlySendMaxNum - smsConfig.monthlyAmount)) {
                _this.showTips('msgnum_limit', top.Lang.Mail.Write.ninbenyuezhishengxia + (smsConfig.monthlySendMaxNum - smsConfig.monthlyAmount) + top.Lang.Mail.Write.tiaoduanxinkeyifasong, _this.smsReceiverInput, _this.smsReceiverID);//您本月只剩下  ||  条短信可以发送！
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
                if (code == top.Lang.Mail.Write.qingdianjihuoquyanzhengma || code == '') {//请点击获取验证码
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
                parent.CC.alert(top.Lang.Mail.Write.zjdyhnzswfOgOkONBQydsjktqyyx);//尊敬的用户，你暂时无法使用本功能，如需使用完整功能，请使用中国移动手机开通139企业邮箱。
                return;
            }
            
            if (smsConfig.receiverMaxNum != 0 || smsConfig.receiverMaxNum == 0 && receiverNum <= _this.smsReceiverMax) { //直接发送全部用户
                
            

                if(  ydReg.test(smsConfig.bindMobile) && smsConfig.userPackSmsRemain <= 0  ){
                    //个人免费短信使用完，且企业绑定手机号码时出现提示：“您本月免费赠送的短信已用完，继续使用将以0.1元/条计费扣企业费用。”
                   if( smsConfig.corpSmsCount > 0){
                       
                       if(  smsConfig.corpSmsUsedCnt >= smsConfig.corpSmsCount ){
                       
                            parent.CC.confirm(top.Lang.Mail.Write.nbysyqydxyRmfCLuLfytjfkngrfy, send, top.Lang.Mail.Write.xitongtishi, function() {//您本月所用企业短信已达上限，若继续使用将以0.1元/条计费扣您个人费用。  ||  系统提示
                                    return;
                            });
                            return;

                        } else{
                            
                           parent.CC.confirm(top.Lang.Mail.Write.nbymfzsddxenYCpSYLyytjfkqyfy, send, top.Lang.Mail.Write.xitongtishi, function() {//您本月免费赠送的短信已用完，继续使用将以0.1元/条计费扣企业费用。  ||  系统提示
                                    return;
                            });
                            
                            return; 
                        }
                        
                    } 
                    
                    //个人免费短信使用完，但企业未绑定手机号码时出现提示：“您本月免费赠送的短信已用完，
                    //若继续使用将以0.1元/条计费扣您个人费用。”
                    
                     if( smsConfig.corpSmsCount <= 0){
                       
                        parent.CC.confirm(top.Lang.Mail.Write.nbymfzsddxNFRPYHFxytjfkngrfy, send, top.Lang.Mail.Write.xitongtishi, function() {//您本月免费赠送的短信已用完，若继续使用将以0.1元/条计费扣您个人费用。  ||  系统提示
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
                //        parent.CC.alert(top.Lang.Mail.Write.dbqnbyzsddDrtZrhIFgnxyhkzcsy,function(){return;},top.Lang.Mail.Write.fasongshibai);//对不起，您本月赠送的短信已用完，暂不能使用此功能，下月1号可正常使用  ||  发送失败
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