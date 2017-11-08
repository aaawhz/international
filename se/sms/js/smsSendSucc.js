var $ = function(id) {
    return document.getElementById(id);
};
var smsLang=Lang.Sms;
/***
 * @description 发短信成功
 */
var SmsSucc = {
    smsSaveErr:smsLang.smsSaveErr,                         //联系人保存失败
    smsSendIndexUrl:parent.gMain.webPath + "/se/sms/smsindex.do?sid="+parent.gMain.sid,       //短信发送页
    sendStatusWrap:jQuery('#send_status_wrap'),
    smsReceiverMax:50,                                     //分批接收用户数量
    smsReceiveEmptyTips:smsLang.smsReceiveEmptyTips,       //接收用户为空提示信息
    smsReceiveErrorTips:smsLang.smsReceiveErrorTips,       //接收用户输入错误提示信息
    smsReceiverMaxError:smsLang.smsReceiverMaxError,       //接收用户超过最大数提示信息
    smsReceiverID:'sms_receiver',                          //接收用户DIV ID
    sendMsgUrl:'/sms/sms.do',                              //发送短信url
    sendMsgFunc:'sms:send',                                //发短信命令
    isTime:0,                                              //即时短信0，定时短信1
    sendedFenpiIndex:[],                                   //已发分批短信index
    sendCompleted:false,                                   //是否发送完成
    getSmsConfigFunc:'sms:getSmsConfig',                 //获取短信设置命令
    updateSmsConfigFunc:'sms:updateSmsConfig',           //修改短信设置命令
    /**
     * 短信发送状态
     */
    sendSatus:function(){
        var timeflag = parent.GC.getUrlParamValue(location.href, 'timeflag');
        if(timeflag=='true'){
            this.isTime=1;
        }else{
            this.isTime=0;
        }
        if(this.mobiles.length>0){
            if(this.isTime==1){
                this.showTimeSendSucc(smsLang.timeSendSucc,false);
            }else{
                this.showSendSucc(smsLang.sendMsgSucc,false);
            }
        }else{ //分批
            this.showSendConfirm();
        }


    },
    showSended:function(isFenpi,statusid){
        var link=jQuery('#'+statusid+' a');
        var url=link.attr('href');
        link.die().live('click',function(){
            if(isFenpi){
                parent.CC.confirm(top.Lang.Mail.Write.nhywfsdlxrqdylkdqyPfSzBzGO,function(){//你还有未发送的联系人，确定要离开当前页?
                    window.location.href=url;
                });
                return false;
            }
        })
    },
    /**
     * 显示发送短信成功
     * @param tips
     * @param isFenpi
     */
    showSendSucc:function(tips,isFenpi){
        var p=this;
        if(!isFenpi){
            p.sendStatusWrap.removeClass('show-confirm').removeClass('show-fenpi-succ');
        }else{
            p.sendStatusWrap.removeClass('show-confirm').addClass('show-fenpi-succ');
            p.fenpiSendConfig();
        }
        jQuery('#send_succ').show().find('h2').eq(0).html(tips);
        p.getRecordSet(function(pagesizeset,autosaveset){
            if(autosaveset=='1'){
                jQuery('#send_succ').show().find('p').eq(0).html(''+top.Lang.Mail.Write.cdxfscgbybcddxjlzSagpFuFb+'<a href="'+parent.gMain.webPath+'/se/sms/smsrecord.do?sid='+parent.gMain.sid+'&reflag=all">'+top.Lang.Mail.Write.lijichakan+'</a>');//此短信发送成功，并已保存到“短信记录”中 <a href="  ||  &reflag=all">立即查看&gt;&gt;</a>
            }else{
                jQuery('#send_succ').show().find('p').eq(0).html('<span class="save-status">'+top.Lang.Mail.Write.gaiduanxinjilushangweibaocun+'</span> <a href="javascript:void(0);" onclick="SmsSucc.openSave('+pagesizeset+',\'send_succ\');">'+top.Lang.Mail.Write.lijikaiqizidongbaocun+'</a>');//<span class="save-status">该短信记录尚未保存。</span> <a href="javascript:void(0);" onclick="SmsSucc.openSave(  ||  ,\'send_succ\');">立即开启自动保存&gt;&gt;</a>
            }
        });
        p.showSended(isFenpi,'send_succ');
    },
    /**
     * 显示发送定时短信成功
     * @param tips
     * @param isFenpi
     */
    showTimeSendSucc:function(tips,isFenpi){
        var p=this;
        if(!isFenpi){
            p.sendStatusWrap.removeClass('show-confirm').removeClass('show-fenpi-succ');
        }else{
            p.sendStatusWrap.removeClass('show-confirm').addClass('show-fenpi-succ');
            p.fenpiSendConfig();
        }
        jQuery('#time_send_succ').show().find('h2').eq(0).html(tips);
        p.getRecordSet(function(pagesizeset,autosaveset){
            if(autosaveset=='1'){
                jQuery('#time_send_succ').show().find('p').eq(0).html(''+top.Lang.Mail.Write.cdxzsbczdswGYxWFJvjznzddsjfc+'<a href="'+parent.gMain.webPath+'/se/sms/smsrecord.do?sid='+parent.gMain.sid+'&reflag=time">'+top.Lang.Mail.Write.lijichakan+'</a>');//此短信暂时保存在“定时短信”中，它将在您指定的时间发出。 <a href="  ||  &reflag=time">立即查看&gt;&gt;</a>
            }else{
                jQuery('#time_send_succ').show().find('p').eq(0).html('<span class="save-status">'+top.Lang.Mail.Write.gaiduanxinjilushangweibaocun+'</span> <a href="javascript:void(0);" onclick="SmsSucc.openSave('+pagesizeset+',\'time_send_succ\');">'+top.Lang.Mail.Write.lijikaiqizidongbaocun+'</a>');//<span class="save-status">该短信记录尚未保存。</span> <a href="javascript:void(0);" onclick="SmsSucc.openSave(  ||  ,\'time_send_succ\');">立即开启自动保存&gt;&gt;</a>
            }
        });
        p.showSended(isFenpi,'time_send_succ');
    },
    /**
     * 显示分批发送短信确认页面
     */
    showSendConfirm:function(){
        this.sendStatusWrap.removeClass('show-fenpi-succ').addClass('show-confirm');
        var fenpiLength=Math.ceil(this.receiverText.length/this.smsReceiverMax);
        jQuery('#fenpiLength').html(fenpiLength);
        this.fenpiLength=fenpiLength;
        this.fenpiSendConfig();
    },
    /**
     * 分批发送配置
     */
    fenpiSendConfig:function(){
        var _this=this;
        var fenpiSelect=jQuery('#fenpiSelect');
        fenpiSelect.html('');
        for(var i=0;i<this.fenpiLength;i++){
            if(!isExitsIndex(i+1)){
                fenpiSelect.append('<option value="'+(i+1)+'">'+smsLang.receiverIndex.replace(/{\d}/g,(i+1))+'</option>');
            }
        }
        var fenpiIndex=fenpiSelect.val();
        if(!_this.rib){
            this.bindInputControl();
        }
        //填充index批次手机用户
        var receiverText=this.receiverText;
        var receiverMaxNum=receiverText.length;
        var smsReceiverMax=_this.smsReceiverMax;
        getReceiver(fenpiIndex,receiverMaxNum);

        //切换分批
        fenpiSelect.change(function(){
            getReceiver(fenpiSelect.val(),receiverMaxNum);
        })

        //发送分批短信
        jQuery('#fenpi_send').die().live('click',function(){
            if(_this.rib.getItems().length==0){
                _this.showTips('receive_empty',_this.smsReceiveEmptyTips,_this.smsReceiverInput,_this.smsReceiverID);
                return;
            }else if(SmsSucc.rib.getErrorText()){
                _this.showTips('receive_err',_this.smsReceiveErrorTips,_this.smsReceiverInput,_this.smsReceiverID);
                return;
            }else{
                var dataParam={
                    receiverNumber:'',
                    sendMsg:_this.sendMsg,
                    sendFlag:_this.isTime,
                    startSendTime:_this.startSendTime,
                    serialId:_this.serialId
                }

                var mobile='';
                var mobileNumer='';
                for(var item in _this.rib.items){
                    var allText=_this.rib.items[item].allText;
                    var mobileText=allText;
                    var mobileNum=allText;
                    if(allText.indexOf('<')!=-1){
                        mobileText=allText.substring(allText.indexOf('<')+1,allText.indexOf('>'))+jQuery.trim(allText.substring(0,allText.indexOf('<')));
                        mobileNum=allText.substring(allText.indexOf('<')+1,allText.indexOf('>'));
                    }
                    mobile+=mobileText+',';
                    mobileNumer+=mobileNum+',';
                }
                dataParam.receiverNumber=mobile.replace(/,$/g,'');

                _this.Ajax(_this.sendMsgUrl,_this.sendMsgFunc,dataParam,function(data){
                    try{
                        if(data.code == "S_OK"){
                            var fenpiIndex=fenpiSelect.val();
                            _this.sendedFenpiIndex.push(fenpiIndex);
                            if(_this.isTime==1){
                                if(_this.fenpiLength!=_this.sendedFenpiIndex.length){
                                    _this.showTimeSendSucc(smsLang.receiverIndex.replace(/{\d}/g,fenpiIndex)+smsLang.timeSendSucc,true);
                                    _this.sendCompleted=false;
                                }else{
                                    _this.showTimeSendSucc(smsLang.timeSendSucc,false);
                                    _this.sendCompleted=true;
                                }
                            }else{
                                if(_this.fenpiLength!=_this.sendedFenpiIndex.length){
                                    _this.showSendSucc(smsLang.receiverIndex.replace(/{\d}/g,fenpiIndex)+smsLang.sendMsgSucc,true)
                                    _this.sendCompleted=false;
                                }else{
                                    _this.showSendSucc(smsLang.sendMsgSucc,false);
                                    _this.sendCompleted=true;
                                }
                            }
                            _this.mobiles=mobileNumer.replace(/,$/g,'').split(',');
                            _this.initLinkMan();
                        }else{
                            parent.CC.alert(data.summary);
                        }
                    }catch(e){
                        parent.ch("sms send callback error." + e);
                    }
                })
            }
        })

        //返回
        jQuery('#fenpi_back').die().live('click',function(){
           var url=parent.gMain.webPath+'/se/sms/smsindex.do?sid='+parent.gMain.sid;
           if(!_this.sendCompleted){
                parent.CC.confirm(top.Lang.Mail.Write.nhywfsdlxrqdylkdqyLiGIBQto,function(){//你还有未发送的联系人，确定要离开当前页?
                    window.location.href=url;
                });
            }else{
                window.location.href=url;
            }
        })

        //获取当前index的接收用户
        function getReceiver(fenpiIndex,receiverMaxNum){
            SmsSucc.rib.clear();
            SmsSucc.rib.hashMap=[];
            var receiverMax=smsReceiverMax*fenpiIndex>receiverMaxNum?receiverMaxNum:smsReceiverMax*fenpiIndex;
            for(var j=smsReceiverMax*fenpiIndex-smsReceiverMax;j<receiverMax;j++){
                var receiver=receiverText[j];
                if(receiver.indexOf('<')!=-1){
                    SmsSucc.SmsSetCall('',receiver);
                }else{
                    SmsSucc.SmsSetCall(receiver,'');
                }
            }
        }

        //是否存在某index
        function isExitsIndex(index){
            var indexArr=_this.sendedFenpiIndex;
            for(var i=0;i<indexArr.length;i++){
                if(index==indexArr[i]){
                    return true;
                    break;
                }
            }
            return false;
        }
    },
    /**
     * 接收用户绑定input控件
     */
    bindInputControl:function(){
        var _this=this;
        var param={
            type:'mobile',
            autoHeight:true,
            maxMailNum:_this.smsReceiverMax,
            skinAble: true,
            mailNumError:function(){
                SmsSucc.showTips('SmsNumErr',SmsSucc.smsReceiverMaxError.replace(/{\d}/g,SmsSucc.smsReceiverMax),SmsSucc.smsReceiverInput);
            },
            container:$('sms_receiver')
        }
        var smsReceiver=new RichInputBox(param);
        _this.rib=smsReceiver;
        _this.smsReceiverInput=$('rib_input_1');
        parent.LMD.fillMobile($('sms_receiver'), window, {
            setCall : _this.SmsSetCall,
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
    SmsSetCall:function(m,tm){
        SmsSucc.rib.clearTipText();
        var _this=this;
        var val=tm||m;
        var txt = SmsSucc.smsReceiverInput;
        var t = txt.value || "";
        t = t.replace(/[,]+/gi, ";");
        t = t.replace(/^;/, "");
        var lastSep = t.lastIndexOf(";");
        var rib = _this.rib;
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

        if(SmsSucc.rib instanceof RichInputBox){
            SmsSucc.rib.createItemFromTextBox();
        }
    },
    /**
     * 初始化联系人
     */
    initLinkMan:function(){
        var mobiles=this.mobiles;
        var bodyData={};
        var mobileArr=[];
        if(mobiles.length>0){
            for(var i=0;i<mobiles.length;i++){
                var mobile=mobiles[i];
                var mobileObj={
                    name:mobile.toString(),
                    mobile:mobile.toString(),  //云通讯录需修改
                    email:''
                }
                mobileArr.push(mobileObj);
            }
        }
        bodyData.from='';
        bodyData.list=mobileArr;
        bodyData.composeType='SENDSMS';
        //if(parent.GC.check('ADDR_ADD_USER')){
            this.saveLinkMan(bodyData);
        //}
    },
    /**
     * 保存联系人
     * @param data
     */
    saveLinkMan:function(data){
        var url=parent.gConst.addrApiUrl,
            func="addr:save",
            data=data;
        this.Ajax(url,func,data,this.saveCallBack);
    },
    /**
     * 保存联系人回调函数
     * @param data
     */
    saveCallBack:function(data){
        if(data.code=="S_OK"){
            var listData = data['var'];

            if(listData && listData.length > 0){
                var list=[];
                for(var i= 0,l=listData.length;i<l;i++){
                    var addItem={};
                    if(!parent.CC.isRmAddr()){
                        addItem={
                            index:listData[i].addrId,
                            mobile:listData[i].mobilePhone,
                            email:listData[i].email,
                            name:listData[i].addrFirstName,
                            createTime:listData[i].createTime
                        }
                    }else{ //云通讯录
                        addItem={
                            index:listData[i][1],
                            mobile:listData[i][3],                 //云通讯录需修改
                            email:listData[i][2],
                            name:listData[i][0],
                            createTime:'2013-1-1'
                        }
                    }

                    list.push(addItem);

                    //联系人
                    if(parent.LMD.group_contactListMap_phone["2_-1"])
                    {
                        parent.LMD.group_contactListMap_phone["2_-1"].push([2, addItem.index, addItem.name, addItem.email, addItem.mobile, "", "" ,"" ,0]);
                    }
                    else
                    {
                        parent.LMD.group_contactListMap_phone["2_-1"]=[];
                        parent.LMD.group_contactListMap_phone["2_-1"].push([2, addItem.index, addItem.name, addItem.email, addItem.mobile, "", "" ,"" ,0]);
                    }
                    if(parent.LMD.RecentContactsMap["5"]){
                        parent.LMD.RecentContactsMap["5"].unshift([5, addItem.index, addItem.name, addItem.email, addItem.mobile, "", "" ,"" ,0]);
                    }
                    else{
                        parent.LMD.RecentContactsMap["5"] = [];
                        parent.LMD.RecentContactsMap["5"].push([5, addItem.index, addItem.name, addItem.email, addItem.mobile, "", "" ,"" ,0]);
                    }
                    parent.AutoFill.datas["mobile"].push({
                        id: addItem.index,
                        name: addItem.name,
                        value: addItem.mobile,
                        word: '',
                        fullword: ''
                    });
                }
                SmsSucc.createSavedItem(list);
            }
        }else{
            parent.CC.alert(this.smsSaveErr);
        }
    },
    /**
     * 显示已保存
     */
    createSavedItem:function(list){
        if(list.length>0){
            jQuery('#save_wrap').show();
            var html = [];
            for(var i=0;i<list.length;i++){
                html.push('<p id="item_' + list[i].index + '" mobile="'+list[i].mobile+'" time="'+list[i].createTime+'"><strong>' + list[i].mobile + '&lt; '+smsLang.savedas+'&nbsp;<span>' + list[i].name + '</span> &gt; </strong>');
                //if(parent.GC.check('ADDR_UPDATEUSER')){
                    html.push('<a href="javascript:fGoto();" onclick="SmsSucc.editLinkMan(\'' + list[i].index + '\');" class="mr_5">'+smsLang.modifyLinkMan+'</a>');
                //}
                //if(parent.GC.check('ADDR_DELETEUSER')){
                    html.push('<a href="javascript:fGoto();" onclick="SmsSucc.delLinkMan(\'' + list[i].index + '\')" >'+smsLang.delLinkMan+'</a> </p>');
                //}
            }
            jQuery('#savedList').html(html.join(''));
        }
    },
    /**
     * 编辑联系人
     * @param index
     */
    editLinkMan:function(index){
        var item=jQuery("#item_"+index);
        var name = item.find("span").text();
        var mobile=item.attr('mobile');
        var mail = '';
        var createTime = item.attr('time');
        if (mobile) {
            var w = 600;
            var h = 363;
            var id = "adddetail";
            name = encodeURI(name);
            createTime = encodeURI(createTime);
            var u = parent.gMain.webPath + "/webtransit.do?sid=" + GC.sid + "&name=" + name +"&mobile="+mobile+"&mail=" +mail+"&op=editContact&editId="+index+"&createTime="+createTime+"&func=addr:quickAdd&flag=mobile";
            var ao = {
                id: id,
                title: smsLang.editLinkMan,
                type: 'div',
                url: u,
                width: w,
                height: h
            };
            parent.CC.showHtml(ao);
        }
    },
    /**
     * 删除联系人
     * @param index
     */
    delLinkMan:function(index){
        //if(parent.GC.check('ADDR_DELETEUSER')){
            parent.CC.confirm(smsLang.delLinkManTips, function(){
                var ids = [];
                ids.push(parseInt(index));
                var callback = function(data){
                    if (data.code == "S_OK") {
                        jQuery("#savedList p").remove("#item_"+index);
                        if(jQuery("#save_wrap:has(p)").length==0) {
                            jQuery("#save_wrap").hide();
                        }
                        parent.CC.showMsg(smsLang.delLinkManSucc, true, false, "option");
                    }
                }
                var url=parent.gConst.addrApiUrl,
                    func="addr:deleteUser",
                    data={id:ids,del:1};
                SmsSucc.Ajax(url,func,data,callback);
            }, smsLang.sysTips, null, 'delUsers');
        //}
    },
    /**
     * 显示记录设置
     */
    getRecordSet:function(call){
        var p=this;
        var url=p.sendMsgUrl,
            func=p.getSmsConfigFunc,
            data={'sendusernumber':parent.gMain.loginName};
        p.Ajax(url,func,data, function(d){
                if(d.code='S_OK'){
                    var pagesizeset=d["var"].pagesize;
                    var autosaveset=d["var"].autosave;
                    if(call){
                        call(pagesizeset,autosaveset);
                    }
                }
        });
    },
    openSave:function(pagesize,wrapid){
        var p=this;
        var url=p.sendMsgUrl,
            func=p.updateSmsConfigFunc,
            data={
                'sendusernumber':parent.gMain.loginName,
                'pagesize':pagesize.toString(),
                'autosave':'1'
            },
            callback=saveCallBack;
        p.Ajax(url,func,data, callback);

        function saveCallBack(data){
            if(data.code='S_OK'){
                parent.CC.showMsg(top.Lang.Mail.Write.zdbcdxjlszcgDLjnnygo, true, false, "option");//自动保存短信记录设置成功
                jQuery('#'+wrapid).find('p').eq(0).html(top.Lang.Mail.Write.nyszzdbcdxjlUijucnIc);//您已设置自动保存短信记录。
            }else{
                parent.CC.showMsg(top.Lang.Mail.Write.zdbcdxjlszcgfkNUUnCU, true, false, "error");//自动保存短信记录设置成功
            }
        }
    },
    /**
     * 显示tips
     * @param id
     * @param text
     * @param obj
     * @param containerId
     */
    showTips:function(id,text,obj,containerId){
        var tip = new ToolTips({
            id: id,
            direction: ToolTips.direction.Top
        });
        tip.show(obj, text);
        if(containerId){
            RichInputBox.Tool.blinkBox(jQuery("#"+containerId+" div:first"), 'blinkColor');
        }
        /*jQuery('body').die().live('click',function(){
            tip.close();
        })*/
    },
    Ajax: function(url,func,data, callback,failcallback){
        failcallback = failcallback || function(d){
            parent.CC.alert(d.summary);
        };
        parent.MM.doService({
            url:url,
            func: func,
            data: data,
            failCall: failcallback,
            call: function(d){
                