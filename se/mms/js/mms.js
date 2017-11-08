
var $ = function(id) {
    return document.getElementById(id);
};
var smsLang=Lang.Sms;

/***
 * @description 发彩信
 */

var MMS={
    rib:null,
    mmsReceiverID:'mms_receiver',                         //接收用户DIV ID
    mmsReceiver:$('mms_receiver'),                        //接收用户DIV对象
    mmsReceiverInput:null,                                //接收用户文本框对象
    mmsReceiverTips:smsLang.smsReceiverTips,              //接收用户提示信息
    mmsReceiverMax:mmsConfig.receiverMaxNum,              //接收用户数量
    mmsReceiverMaxError:smsLang.smsReceiverMaxError,      //接收用户超过最大数提示信息
    mmsReceiveEmptyTips:smsLang.smsReceiveEmptyTips,      //接收用户为空提示信息
    mmsReceiveErrorTips:smsLang.smsReceiveErrorTips,      //接收用户输入错误提示信息
    mmsTitle:jQuery('#mms_title'),
    mmsIconPath:'',                                       //短信图片路径
    mmsIconName:'',                                       //短信图片名称
    mmsIconWidth:0,
    mmsIconHeight:0,
    searchkeyValue:smsLang.searchkeyValue,                //搜索联系人关键字
    mmstextTips:top.Lang.Mail.Write.zhelikeyishuruwenzi,//这里可以输入文字
    processbar:jQuery('#process_wrap .prisdr-progress-cur').eq(0),
    processtext:jQuery('#process_wrap .ta_c'),
    sendMMSUrl:parent.gMain.webPath+'/service/webmms.do',
    changeImgSizeFunc:'upload:imageIOpeartion',
    sendMMSFunc:'mms:sendMmsFunc',
    getMMSRecordFunc:'mms:inquiryMmsInfoFunc',
    delMMSRecordFunc:'mms:delMmsInfoFunc',
    codeTips:top.Lang.Mail.Write.qingdianjihuoquyanzhengma,//请点击获取验证码
    isChanged: function () {
        var mmstext=jQuery.trim(jQuery('#mms_text').val());
        var mmsTitle=jQuery.trim(jQuery('#mms_title').val());
        if( mmstext != '' && mmstext != MMS.mmstextTips ){
            return true
        }
        if(MMS.mmsIconName != ''){
            return true
        }
        if(mmsTitle!=''&&mmsTitle!=MMS.mmsTitleTip){
            return true
        }

        if(jQuery('#RichInputBoxID').text()!=''){
            return true
        }

        return false;

    },
    init:function(){
        var self=this;

        //是否绑定手机
        var mobilereg=/\d{11}/g;
        if(!mobilereg.test(mmsConfig.bindMobile)||!parent.CC.isMobileBind(parent.gMain.flags)){
            jQuery('#mobile_empty').show();
            jQuery('#sendMMS_wrap').hide();
            return;
        }else{
            jQuery('#mobile_empty').hide();
            jQuery('#sendMMS_wrap').show();
        }

        this.initNav();
        this.bindInputControl();
        this.defaultTitle();
        this.bindUploadControl();
        this.initAddrList();
        this.mmsText();
        this.changeImgSize();
        this.checkcode();


        var ydReg = new RegExp(mmsConfig.mobileChinamobile); //中国移动
        var ltReg = new RegExp(mmsConfig.mobileChinatelcom); //中国电信
        var dxReg = new RegExp(mmsConfig.mobileChinaunion); //中国联通
        
        //如果是联通, 电信, 不能使用该功能
        if( ltReg.test(mmsConfig.bindMobile) || dxReg.test(mmsConfig.bindMobile) ||  mmsConfig.UserPackMmsCount <= 0){
            parent.CC.alert(top.Lang.Mail.Write.zjdyhnzswfrmAaQgjoydsjktqyyx);//尊敬的用户，你暂时无法使用本功能，如需使用完整功能，请使用中国移动手机开通139企业邮箱。
            
        }
        

        //转发彩信
        var mmsid=parent.GC.getUrlParamValue(location.href,'mmsid');
        var width=parent.GC.getUrlParamValue(location.href,'width');
        var height=parent.GC.getUrlParamValue(location.href,'height');
        if(mmsid){
            this.rewardMMS(mmsid,width,height);
        }

        //发彩信
        jQuery('#btnSend')[0].onclick=function(){

            var data={
                receiverNumer:'',
                subject:encodeURIComponent(jQuery('#mms_title').val().encodeHTML()),
                mmsText:'',
                mmsIconPath:'',
                fileName:'',
                isSave:0,
                code:'',
                isForward:mmsid?1:0
            };
            
            // UserPackMmsCount  和 UserPackMmsRemain
            //个人免费彩信使用完时出现提示：“您本月免费赠送的彩信已用完，继续使用将以0.3元/条计费扣您个人费用。”
            
            var ydReg = new RegExp(mmsConfig.mobileChinamobile); //中国移动
            var ltReg = new RegExp(mmsConfig.mobileChinatelcom); //中国电信
            var dxReg = new RegExp(mmsConfig.mobileChinaunion); //中国联通
            
            //如果是联通, 电信, 不能使用该功能
            if( ltReg.test(mmsConfig.bindMobile) || dxReg.test(mmsConfig.bindMobile) ||  mmsConfig.UserPackMmsCount <= 0){
                parent.CC.alert(top.Lang.Mail.Write.zjdyhnzswfJHwGRWdSydsjktqyyx);//尊敬的用户，你暂时无法使用本功能，如需使用完整功能，请使用中国移动手机开通139企业邮箱。
                return;
            }
            
            
             

            //校验接收用户
            if(self.rib.getItems().length==0){
                self.showTips('receive_empty',self.mmsReceiveEmptyTips,self.mmsReceiverInput,self.mmsReceiverID,true);
                return;
            /*}else if(self.rib.getItems().length>mmsConfig.dailyAmount){
                self.showTips('msgnum_limit','您今天只剩下'+mmsConfig.dailyAmount+'条彩信可以发送！',self.mmsReceiverInput,self.mmsReceiverID,true);
                return;*/
            }else if(self.rib.getErrorText()){
                self.showTips('receive_err',self.mmsReceiveErrorTips,self.mmsReceiverInput,self.mmsReceiverID,true);
                return;
            }else{
                var mobile='';
                for(var item in self.rib.items){
                    var mobileText=self.rib.items[item].allText;
                    if(mobileText.indexOf('<')!=-1){
                        mobile+=mobileText.substring(mobileText.indexOf('<')+1,mobileText.indexOf('>'))+',';
                    }else{
                        mobile+=mobileText+',';
                    }
                }
                data.receiverNumer=mobile.replace(/,$/g,'');
            }

            //校验彩信内容
            var mmstext=jQuery.trim(jQuery('#mms_text').val());
            var mmsIconName=self.mmsIconName;
            if(mmstext!=self.mmstextTips||mmsIconName!=''){
                if(mmstext!=self.mmstextTips){
                    data.mmsText=encodeURIComponent(mmstext.encodeHTML());
                }

                if(mmsIconName!=''){
                    data.mmsIconPath=self.mmsIconPath;
                    data.fileName=self.mmsIconName; 
                    data.width=self.mmsIconWidth;
                    data.height=self.mmsIconHeight;
                }
            }else{
                parent.CC.alert(top.Lang.Mail.Write.caixinnarongbunenweikong);//彩信内容不能为空！
                return;
            }

            //是否保存记录
            if(jQuery('#isSave').attr('checked')=='checked'){
                data.isSave=0;
            }else{
                data.isSave=1;
            }

            //验证码
            if(mmsConfig.checkcode){
                var codeVal=jQuery.trim(jQuery('#codeInput').val());
                if(codeVal==self.codeTips){
                    parent.CC.alert(top.Lang.Mail.Write.qingshuruyanzhengma);//请输入验证码
                    return;
                }
                data.code= codeVal;
            }
            
            
            if(  ydReg.test(mmsConfig.bindMobile) && mmsConfig.UserPackMmsCount > 0 && mmsConfig.UserPackMmsRemain <= 0){
                   
                parent.CC.confirm(top.Lang.Mail.Write.nbymfzsdcxUiCVZPClytjfkngrfy, send, top.Lang.Mail.Write.xitongtishi, function() {//您本月免费赠送的彩信已用完，继续使用将以0.3元/条计费扣您个人费用。  ||  系统提示
                        return;
                });
                
            } else{
                send();
            }
            
            function send(){
                //发送
                self.Ajax(self.sendMMSUrl,self.sendMMSFunc,data,function(d){
                    if(d.code == "S_OK"){
                        self.sendMMSSucc(data.isSave,data.receiverNumer);
                    }
                },function(data){
                    self.getAuthCode();
                    parent.CC.alert(data.summary);
                });
            }   
            
            return false;
        };

        //重写关闭标签
        var labId=parent.CC.getCurLabId();
        top.document.getElementById('tab_h_'+labId).getElementsByTagName('a')[0].onclick=function(){
            if(MMS.isChanged()){
                parent.CC.confirm(top.Lang.Mail.Write.xzlkybjdcxVnSjkgcQjhdssfqrgb, function(){//现在离开已编辑的彩信内容将会丢失，是否确认关闭？
                    parent.GE.tab.del(labId);
                });
            }else{
                parent.GE.tab.del(labId);
            }
            return false;
        };
    },
    rewardMMS:function(mmsid,width,height){
        var self=this;
        var data={id:mmsid};
        this.Ajax(this.sendMMSUrl,'mms:forwardMmsFunc',data,function(data){
            if(data.code == "S_OK"){
                var imgdata=data["var"][0];
                var mmsinfo={
                    title:imgdata.subject,
                    mmstext:imgdata.mmsText,
                    mmsIconPath:imgdata.mmsIconPath,
                    fileName:imgdata.fileName
                };

                jQuery('#mms_title').val(mmsinfo.title.decodeHTML().decodeHTML());
                
                if(imgdata.mmsText!=''){
                    jQuery('#mms_text').css('color','#333').val(mmsinfo.mmstext.decodeHTML().decodeHTML());
                }
                
                if(imgdata.fileName!=''){
                    var imgurl=self.sendMMSUrl+'?func=upload:getFile&sid='+parent.gMain.sid+'&fileName='+imgdata.fileName+'&id='+imgdata.id+'&flag=1';
                    jQuery('#showimg').show().attr('src',imgurl).css({width:width,height:height});
                }

                self.mmsIconPath=mmsinfo.mmsIconPath;
                self.mmsIconName=mmsinfo.fileName;
                self.mmsIconWidth=width;
                self.mmsIconHeight=height;
                self.bindImgEvent();
            }
        });
    },
    /**
     * 发彩信成功
     */
    sendMMSSucc:function(isSave,mobiles){
        var self=this;
        jQuery('#sendMMS_wrap').hide();
        jQuery('#sendMMS_succ').show();
        if(isSave==0){
            jQuery('#record_tips').show();
        }else{
            jQuery('#record_tips').hide();
        }
        
        self.mmsIconPath="";
        self.mmsIconName="";
        self.mmsIconWidth=0;
        self.mmsIconHeight=0;
        jQuery('#mms_text').val("");

        //保存最近联系人
        var mobiles=mobiles.split(',');
        this.initLinkMan(mobiles);
    },
    initNav:function(){
        var self=this;
        jQuery('#nav_ul li').click(function(){
            var _this=jQuery(this);
            var index=jQuery('#nav_ul li').index(_this);
            if(!_this.hasClass('currentd')){
                jQuery('#nav_ul li').removeClass('currentd');
                _this.addClass('currentd');
                if(index==0){
                    self.showSendMMS();
                }else if(index==1){
                    self.showMMSRecord();
                }
            }
        })
    },
    showSendMMS:function(param){
        var param=param||'';
        window.location.href=parent.gMain.webPath+'/se/mms/mmsindex.do?sid='+parent.gMain.sid+param;
    },
    showMMSRecord:function(){
        jQuery('#nav_ul li').removeClass('currentd').eq(1).addClass('currentd');
        jQuery('#mms_record').show();
        jQuery('#sendMMS_wrap').hide();
        jQuery('#sendMMS_succ').hide();
        this.MMSRecordInit();
    },
    /**
     * 接收用户绑定input控件
     */
    bindInputControl:function(){
        var self=this;
        var param={
            type:'mobile',
            maxMailNum:self.mmsReceiverMax,
            skinAble: true,
            change: function(){
                var items=self.rib.getItems();
                var resetNum=self.mmsReceiverMax-items.length;
                self.rib.maxMailNum=resetNum; 
            },
            mailNumError:function(){
                self.showTips('MmsNumErr',self.mmsReceiverMaxError.replace(/{\d}/g,mmsConfig.receiverMaxNum),self.mmsReceiverInput,self.mmsReceiverID,true);
            },
            container:this.mmsReceiver,
            mobilelimit:mmsConfig.mobileChinamobile
        };

        var mmsReceiver=new RichInputBox(param);
        mmsReceiver.setTipText(self.mmsReceiverTips+top.Lang.Mail.Write.bzcxltdxyhfsomtyegYf);//，不支持向联通、电信用户发送

        self.rib=mmsReceiver;
        self.mmsReceiverInput=$('rib_input_1');
        parent.LMD.fillMobile('rib_input_1', window, {
            setCall : self.MmsSetCall,
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
    MmsSetCall:function(m,tm){
        MMS.rib.clearTipText();
        var _this=this;
        var val=tm||m;
        var txt = MMS.mmsReceiverInput;
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

        if(MMS.rib instanceof RichInputBox){
            MMS.rib.createItemFromTextBox();
        }
    },
    defaultTitle:function(){
        var defaultTitle=parent.gMain.mainName+top.Lang.Mail.Write.weininzhizuodecaixin;//为您制作的彩信
        this.mmsTitle.val(defaultTitle);
        this.mmsTitleTip=defaultTitle;
        this.mmsTitle.blur(function(){
            if(jQuery.trim(jQuery(this).val())==''){
                jQuery(this).val(defaultTitle);
            }
        })
    },
    bindUploadControl:function(){
        var config={
            sid            : parent.gMain.sid,
            uploadurl      : this.sendMMSUrl+"?func=upload:uploadTemplate"   //上传接口
        };
        var swfVersionStr = "10";
        var xiSwfUrlStr = parent.gMain.webPath+"/static/se/mms/flash/playerProductInstall.swf";
        var flashvars =config;
        var params = {};
        params.quality = "high";
        params.bgcolor = "#FFFFFF";
        params.allowscriptaccess = "sameDomain";
        params.allowfullscreen = "true";
        params.wmode="transparent";
        var attributes = {};
        attributes.id = "MMSImgUpload";
        attributes.name = "MMSImgUpload";
        attributes.align = "middle";
        swfobject.embedSWF(
            parent.gMain.webPath+"/static/se/mms/flash/MMSImgUpload.swf?t=20130830c", "flashContent",
            "70", "25",
            swfVersionStr, xiSwfUrlStr,
            flashvars, params, attributes);
    },
    thisMovie:function(movieName) {
        if (navigator.appName.indexOf("Microsoft") != -1) {
            return window[movieName];
        } else {
            return document[movieName];
        }
    },
    getImgSize:function(){
        var currImgSize=jQuery('#changesize').val().split(',');
        return {
            width:currImgSize[0],
            height:currImgSize[1]
        }
    },
    flashUploaded:function(){},
    imgUploadFail:function(option){
        jQuery('#uploadfail').html(option.msg);
        jQuery('#process_wrap').hide();
    },
    imgUploadProgress:function(option){
        jQuery('#showimg').attr('src','');
        jQuery('#uploadfail').html('');
        jQuery('#process_wrap').show();
        this.processtext.html(parent.Util.formatSize(option.loaded, null, 2)+'/'+parent.Util.formatSize(option.total, null, 2));
        this.processbar.css('width',(loaded/total)+'%');
    },
    imgUploadSucc:function(option){
        var self=this;
        var code=option.msg;
        if(code=='S_OK'){
            jQuery('#uploadfail').html('');
            
            var w=option.width;
            var h=option.height;
            self.mmsIconPath=option.filePath;
            self.mmsIconName=option.name;
            self.mmsIconWidth=option.width;
            self.mmsIconHeight=option.height;
            
            var imgurl=self.sendMMSUrl+'?func=upload:getFile&sid='+parent.gMain.sid+'&fileName='+option.name+'&flag=1';
            jQuery('#showimg').show().attr('src',imgurl).css({width:w,height:h});
           
            self.processtext.html(parent.Util.formatSize(option.total, null, 2)+'/'+parent.Util.formatSize(option.total, null, 2));
            self.processbar.css('width','100%');

            setTimeout(function(){
                jQuery('#process_wrap').hide();
            },100);

            self.bindImgEvent();
        }
    },
    bindImgEvent:function(){
        var self=this;
        jQuery('.cm_imgdiy').hover(function(){
            if(jQuery('#showimg').attr('src')!=''){
                jQuery('#delimg').show().click(function(){
                    jQuery('#delimg').hide();
                    jQuery('#showimg').hide().attr('src','');
                    self.mmsIconPath='';
                    self.mmsIconName='';
                    self.mmsIconWidth=0;
                    self.mmsIconHeight=0;
                    return false;
                })
            }
        },function(){
            jQuery('#delimg').hide();
        })
    },
    changeImgSize:function(){
        var self=this;
        var showimg=jQuery('#showimg');     
        jQuery('#changesize').change(function(){
            if(showimg.attr('src')!=''){
                var filename=self.mmsIconName;
                var selectSize=jQuery(this).val().split(',');
                var mmsid=parent.GC.getUrlParamValue(location.href,'mmsid')||'';
                //等比缩放
                var param='&fileName='+filename+'&width='+selectSize[0]+'&height='+selectSize[1]+'&id='+mmsid;
                self.Ajax(self.sendMMSUrl,self.changeImgSizeFunc,null,function(data){
                    if(data.code=='S_OK'){
                        self.mmsIconWidth=data["var"].width;
                        self.mmsIconHeight=data["var"].height;
                        var imgurl=self.sendMMSUrl+'?func=upload:getFile&sid='+parent.gMain.sid+'&fileName='+filename+'&flag=1&id='+mmsid;
                        showimg.css({width:data["var"].width,height:data["var"].height}).attr('src',imgurl);
                    }
                },null,'GET',param);    
            }
        })
    },
    mmsText:function(){
        var self=this;
        var mmstext=jQuery('#mms_text');
        mmstext.focus(function(){
            var $this=jQuery(this);
            if(jQuery.trim($this.val())==self.mmstextTips){
                $this.css('color','#333').val('');
            }
        });

        mmstext.blur(function(){
            var $this=jQuery(this);
            if(jQuery.trim($this.val())==''){
                $this.css('color','#999').val(self.mmstextTips);
            }
        })
    },
    /**
     * 初始化通讯录
     */
    initAddrList:function(){
        var showType=["5","0","2"];
        var config={
            type:4,
            isShowValue:false
        };
        parent.Object.extend(contact,config);

        if(parent.CC.isRmAddr()){ //调用云通讯录，联系人同步获取
            contact.isAsyn=false;
        }
        contact.setValue = function(name, mobile) {
            MMS.MmsSetCall(mobile, name + " <" + mobile + ">");
        };
        contact.showLinkMan(showType, "addrList",parent.Lang);

        //右侧通讯录搜索
        var searchBtn = $('searchDelete');
        var searchInput = $('searchKey');
        var keyValue =this.searchkeyValue;
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
            setCall :MMS.MmsSetCall,
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
        parent.LMD.fillMobile("searchKey", window, ap);

        parent.EV.observe($("searchDelete"), "click", function(){
            $("searchKey").value = keyValue;
            $("searchKey").style.color = '';
            ap.statsCall(0);
        });
    },
    checkcode:function(){
        var self=this;
        var codewrap=jQuery('#checkcode');
        var codeInput=jQuery('#codeInput');
        var codeImg=jQuery('#codeImg');

        if(mmsConfig.checkcode){
            self.getAuthCode();
            codewrap.show();
            codeInput.val(self.codeTips);

            codeInput.click(function(e){
                e.stopPropagation();
            });

            codeImg.click(function(e){
                e.stopPropagation();
            });

            codeInput[0].onfocus=function(){
                if(jQuery.trim(jQuery(this).val())==self.codeTips){
                    jQuery(this).val('').css('color','#333');
                }
                codeImg.show();

                jQuery('body').die().live('click',function(){
                    codeImg.hide();
                })
            };

            codeInput[0].onblur=function(){
                if(jQuery.trim(jQuery(this).val())==''){
                    jQuery(this).val(self.codeTips).css('color','#999');
                }
            }
        }else{
            codewrap.hide();
        }
    },
    /**
     * 获取验证码
     */
    getAuthCode:function(){
        jQuery('#authcode').attr('src',mmsConfig.authcodeurl+'?t='+new Date().getTime());
    },
    /**
     * 初始化联系人
     */
    initLinkMan:function(mobiles){
        var mobiles=mobiles;
        var bodyData={};
        var mobileArr=[];
        if(mobiles.length>0){
            for(var i=0;i<mobiles.length;i++){
                var mobile=mobiles[i];
                var mobileObj={
                    name:mobile.toString(),
                    mobile:mobile.toString(),  //云通讯录需修改
                    email:''
                };
                mobileArr.push(mobileObj);
            }
        }
        bodyData.from='';
        bodyData.list=mobileArr;
        bodyData.composeType='SENDSMS';
        
        this.saveLinkMan(bodyData);
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
                MMS.createSavedItem(list);
            }
        }else{
            parent.CC.alert(top.Lang.Mail.Write.lianxirenbaocunshibai);//联系人保存失败
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
                html.push('<a href="javascript:fGoto();" onclick="MMS.editLinkMan(\'' + list[i].index + '\');" class="mr_5">'+smsLang.modifyLinkMan+'</a>');
                html.push('<a href="javascript:fGoto();" onclick="MMS.delLinkMan(\'' + list[i].index + '\')" >'+smsLang.delLinkMan+'</a> </p>');
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
            var u = parent.gMain.webPath + "/webtransit.do?sid=" + GC.sid + "&name=" + name +"&mobile="+mobile+"&mail=" +
                mail+"&op=editContact&editId="+index+"&createTime="+createTime+"&func=addr:quickAdd&flag=mobile"
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
            };
            var url=parent.gConst.addrApiUrl,
                func="addr:deleteUser",
                data={id:ids,del:1};
            MMS.Ajax(url,func,data,callback);
        }, smsLang.sysTips, null, 'delUsers');
    },
    MMSRecordInit:function(){
        var self=this;
        //全选
        jQuery('#checkBox_AllChecked').click(function(){
           var checkboxs=jQuery('#mmsrecord_list .checkbox');
           if(jQuery(this).attr('checked')=='checked'){
               checkboxs.attr('checked','checked');
           }else{
               checkboxs.removeAttr('checked');
           }
        });

        //删除
        jQuery('#del_btn').click(function(){
            var selCheckbox=self.getSelectedItem();
            if(selCheckbox.size()==0){
                parent.CC.alert(top.Lang.Mail.Write.qingxuanzeyaoshanchudecaixin);//请选择要删除的彩信！
            }else{
                var mmsids=[];
                for(var i=0;i<selCheckbox.size();i++){
                    mmsids.push(selCheckbox.eq(i).attr('mmsid'));
                }
                mmsidsstr=mmsids.join(',');
                self.delRecord(mmsidsstr);
            }
        });

        this.getRecordList();
    },
    getSelectedItem:function(){
        return jQuery('#mmsrecord_list .checkbox:checked');
    },
    getRecordList:function(page){
        var self=this;
        jQuery('#checkBox_AllChecked').removeAttr('checked');
        var page=page||1;
        var data={pageNo:page};
        self.Ajax(self.sendMMSUrl,self.getMMSRecordFunc,data,function(data){
         if(data.code == "S_OK"){
             var totalrecords=data["var"].totalRecords;
             jQuery('#mmsnum').html(totalrecords);
             
             var currpage=data["var"].currentPage;
             var pagesize=data["var"].pageSize;
             var totalpages=Math.ceil(totalrecords/pagesize)

             var recordlist=data["var"].mmsInquiryList;
            if(recordlist.length>0){
                self.createPager(currpage,totalpages);
                self.showRecordList(recordlist);
            }else{
                jQuery('#mmsrecord_list').html('');
            }
          }
         });
    },
    showRecordList:function(list){
        var self=this;
        var listwrap=jQuery('#mmsrecord_list');
        listwrap.html('');
        for(var i= 0,l=list.length;i<l;i++){
            var mmsHtml='<div class="cm_record" style="width:335px;">'
                       +'   <p><input type="checkbox" class="checkbox" id="'+list[i].mmsId+'" mmsid="'+list[i].mmsId+'"/><label for="'+list[i].mmsId+'"><span class="ml_5 cm_til tf">'+list[i].mmsTitle.decodeHTML()+'</span></label></p>'
                       +'   <div class="clearfix pt_10">'
                       +'       <div class="fl" style="width:240px;">';
            if(list[i].mmsImg!=''){
                var imgurl=parent.gMain.webPath+'/'+list[i].mmsImg;
                mmsHtml+='<div class="cm-uploadimg" style="width:240px;height:160px;overflow:hidden;text-align:center;">'
                        +'  <img class="mmsimg" src="" width="'+list[i].width+'" height="'+list[i].height+'" alt="" style="vertical-align:middle;"/>'
                        +'</div>';
            }else{
                mmsHtml+='<div class="cm-uploadimg font-board" style="width:240px;word-wrap: break-word;word-break: break-all;">'+list[i].mmsText.decodeHTML()+'</div>';
            }

            mmsHtml+='         <p class="pt_5"><a href="javascript:void(0);" class="rewardmms" mmsid="'+list[i].mmsId+'" mmswidth="'+list[i].width+'" mmsheight="'+list[i].height+'">'+top.Lang.Mail.Write.zhuanfa+'</a><a href="javascript:void(0);" class="ml_10 delmms" mmsid="'+list[i].mmsId+'">'+top.Lang.Mail.Write.shanchu+'</a></p>'
                    +'         <p class="col999">'+list[i].createTime+'</p>'
                    +'       </div>'
                    +'       <div class="fl pl10">'
                    +'           <p>'+top.Lang.Mail.Write.shoujianren+'</p>'
                    +'           <ul>';//">转发</a><a href="javascript:void(0);" class="ml_10 delmms" mmsid="  ||  ">删除</a></p>  ||             <p>收件人：</p>
            var receivers=list[i].receiver;
            var rhtml='';
            for(var j= 0,len=receivers.length;j<len;j++){
               rhtml+='<li><span class="cm-receive" title="'+receivers[j].name+'"><em>'+receivers[j].name+'</em><i class="'+(receivers[j].status==0?"i-gsuccess":"i-oarm")+' ml_5"></i></span></li>';
            }
            mmsHtml+=rhtml;
            mmsHtml+='</ul></div></div></div>';
            var mmsItem=jQuery(mmsHtml);
            listwrap.append(mmsItem);
            
            //显示图片
            if(list[i].mmsImg!=''){
                var imgurl=self.sendMMSUrl+'?func=upload:getFile&sid='+parent.gMain.sid+'&fileName='+list[i].mmsImg+'&id='+list[i].mmsId+'&flag=1';
                //等比缩放
                var width=list[i].width;
                var height=list[i].height;

                if(height>160){
                    width=width*160/height;
                    height=160;
                }
                
                if(width>240){
                    height=height*240/width;
                    width=240;
                }
                
                mmsItem.find('.mmsimg').eq(0).attr('src',imgurl).attr('width',width).attr('height',height);
            }
            
            
            //转发
            mmsItem.find('.rewardmms').eq(0).click(function(){
                var mmsid=jQuery(this).attr('mmsid');
                var mmswidth=jQuery(this).attr('mmswidth');
                var mmsheight=jQuery(this).attr('mmsheight');
                self.showSendMMS('&mmsid='+mmsid+'&width='+mmswidth+'&height='+mmsheight);
                return false;
            });

            //删除
            mmsItem.find('.delmms').eq(0).click(function(){
                var mmsid=jQuery(this).attr('mmsid');
                self.delRecord(mmsid);
                return false;
            });
        }
    },
    /**
     * 生成页码
     */
    createPager:function(currPage,totalPage){
        var pager=jQuery('#topPage_sys2');
        if(totalPage>1){
            pager.show();
            var pageHtml='';
            if(currPage>1){
                pageHtml+='<a href="javascript:fGoto();" onclick="MMS.getRecordList(1);">'+smsLang.first+'</a> <span class="separate-line">|</span> ';
            }
            if(currPage>1){
                var display=(currPage==totalPage)?'none':'inline-block';
                pageHtml+='<a href="javascript:fGoto();" onclick="MMS.getRecordList('+(currPage-1)+');">'+smsLang.prev+'</a> <span class="separate-line" style="display:'+display+'">|</span> ';
            }

            if(currPage<totalPage){
                pageHtml+='<a href="javascript:fGoto();" onclick="MMS.getRecordList('+(currPage+1)+');">'+smsLang.next+'</a> <span class="separate-line">|</span> ';
            }

            if(currPage<totalPage){
                pageHtml+='<a href="javascript:fGoto();" onclick="MMS.getRecordList('+totalPage+');">'+smsLang.end+'</a> ';
            }
            pageHtml+='<select id="select_page_sys2" name="select_page_sys2"></select>';
            pager.html(pageHtml);

            var select=jQuery('#select_page_sys2');
            for(var i=1;i<=totalPage;i++){
                if(i==currPage){
                    select.append('<option value="'+i+'" selected="selected">'+i+'/'+totalPage+'</option>');
                }else{
                    select.append('<option value="'+i+'">'+i+'/'+totalPage+'</option>');
                }
            }
            select[0].onchange=function(){
                MMS.getRecordList(select[0].options[select[0].selectedIndex].value);
            }
        }else{
            pager.hide().html('');
        }
    },
    delRecord:function(mmsid){
        var self=this;
        parent.CC.confirm(top.Lang.Mail.Write.querenyaoshanchuxuanzhongcaixin,function(){//确认要删除选中彩信？
            var data={
                id: mmsid
            };
            self.Ajax(self.sendMMSUrl,self.delMMSRecordFunc,data,function(data){
                if(data.code == "S_OK"){
                    self.getRecordList();
                }
            });
        },top.Lang.Mail.Write.xitongtishi,null,'delmms');//系统提示
    },
    showTips:function(id,text,obj,containerId,nobodyclose){
        var tip = new ToolTips({
            id: id,
            direction: ToolTips.direction.Top
        });
        tip.show(obj, text);
        if(containerId){
            RichInputBox.Tool.blinkBox(jQuery("#"+containerId+" div:first"), 'blinkColor');
        }
        jQuery('body').die().live('click',function(){
            if(!nobodyclose){
                tip.close();
            }
        })
    },
    Ajax: function(url,func,data, callback,failcallback,method,param){
        failcallback = failcallback || function(d){
            parent.CC.alert(d.summary);
        };
        parent.MM.doService({
            absUrl:url,
            func: func,
            data: data,
            method:method||'POST',
            failCall: failcallback,
            call: function(d){
                callback(d)
            },
            param:param||''
        });
    }
};