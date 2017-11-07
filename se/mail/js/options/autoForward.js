var autoForward = new OptionBase();
var ToolTips = parent.ToolTips;
//邮件转发功能
autoForward.attrs = {
    id : 'autoForward',
    authority: 'MAIL_CONFIG_AUTOFORWARD',
    divId : 'pageAutoforward',
    dropMailType: null,
    list:{type:"url",func:gConst.func.getAttrs},//获取数据/列表时指令，数据
    //save:{type:"url",func:gConst.func.setAttrs},         //更新数据时func指令,及数据
    save:{type:"url",url: '', func: 'mail:setAutoForward'},         //新接口
    tips: Lang.Mail.ConfigJs.pref_forward_tips,
    data: {
        auto_forward_status: {
            text: Lang.Mail.ConfigJs.forward_lbl_IsOpen,
            type: 'radio',
            attribute: {
                value: '',
                defaultValue: '0'
            },
            items: { '1': Lang.Mail.ConfigJs.reply_lbl_yes, '0': Lang.Mail.ConfigJs.reply_lbl_no},
            format: 'int'
        },
        auto_forward_addr: {
            text: Lang.Mail.ConfigJs.forward_lbl_forwardrecuser,
            type: 'text',
            attribute: {
                value: '',
                defaultValue: '',
                maxLength  : 240
            },
            after: '<span class="">'+Lang.Mail.ConfigJs.forward_lbl_onlyone+'</span>',
            format: 'string'
        },
        auto_forward_bakup: {
            text: Lang.Mail.ConfigJs.forward_lbl_savetolocal,
            type: 'text',
            className: '',
            attribute: {
                value: '',
                defaultValue: '1'
            },
            format: 'int'
        },
        validateCode: {
            type: 'text',
            attribute: {
                value: '',
                maxLength: 8
            },
            format: 'string'
        }
    }
};

autoForward.init = function(id){
    this.attrs.dropMailType = new DropSelect({
        id:"dropMail_Div",
        data:[{text: Lang.Mail.ConfigJs.forward_localsavemail,value:"1"},{text: Lang.Mail.ConfigJs.forward_localdeletemail,value:"0"}],
        type:"",
        selectedValue:"1",
        width:290
     });
    this.toolTip_Forward =new ToolTips({
        id:"toolTip_Forward",
        direction:ToolTips.direction.Right,
        // closeTime : 10000,
        left: 450,
        top: 72
    }); 

    //验证码标签位置
    this.toolTip_Forward_ImgCode =new ToolTips({
        id:"toolTip_Forward_ImgCode",
        direction:ToolTips.direction.Right,
        // closeTime : 10000,
        left: 310,
        top: 160
    }); 

    this.request(this.attrs);
    //this.attrs.dropMailType.setValue(document.getElementById("option_auto_forward_bakup").value);
   
};

autoForward.check = function(){
    document.getElementById("option_auto_forward_bakup").value = this.attrs.dropMailType.getValue();
    //alert(document.getElementById("option_auto_forward_bakup").value);
    var isOpen = this.getFormatValue("auto_forward_status");
    var txt = this.getEl("auto_forward_addr");
    var radioStatus =$("auto_forward_status1");
    var validateCodeInput =$("autoForwardCaptcha");

    var p = this;
    //var uid = gMain.userNumber;
    var txtFocus = function(){
        txt.focus();  
    };
    //if(isOpen && isOpen == 1){
   




    if (radioStatus.checked) {
         if (txt.value.trim() == '') {
            CC.alert(Lang.Mail.ConfigJs.EmailCannotNull, null, Lang.Mail.ConfigJs.Error, txtFocus);
            return false;
        }
        
        if (!Vd.checkData('email', txt.value.trim())) {
            //CC.alert(Lang.Mail.ConfigJs.Forward_VdEmail,txtFocus);
            p.toolTip_Forward.show(txt,Lang.Mail.ConfigJs.Forward_VdEmail+gMain.domain);
            return false;
        }


        
        //检查是否在允许 或 禁止的转发地址中   [0:不限制  1:允许 2:禁止]
        if(!mailPOP.checkMail(txt.value.trim(),"autoForward")){
            if(gMain.forwardcorpConfigType == "1"){
                p.toolTip_Forward.show(txt,Lang.Mail.ConfigJs.onlyForwardTo+gMain.forwardcorpConfig);
            }else if(gMain.forwardcorpConfigType == "2"){
                p.toolTip_Forward.show(txt,Lang.Mail.ConfigJs.forbidForwaordTo+gMain.forwardcorpConfig);
            }
            return false;
        }
    }
    //if (txt.value.trim() == uid) {
    if(p.checkUserNumber(txt.value.trim())){
        //CC.alert(Lang.Mail.ConfigJs.CannotSendSelf,txtFocus);
        p.toolTip_Forward.show(txt,Lang.Mail.ConfigJs.CannotSendSelf);
        return false;
    }


    //校验验证码
    var code = jQuery.trim(jQuery("#option_validateCode").val());
    var codeerr = jQuery('#autoForwardCaptcha .tips');
    if (code == top.Lang.Mail.Write.qingdianjihuoquyanzhengma || code == '') {//请点击获取验证码
        // codeerr.show();
        p.toolTip_Forward_ImgCode.show(validateCodeInput,Lang.Mail.Config.vdImageEmpty);
        return false;
    } else {
        codeerr.hide();
        p.attrs.data.validateCode.attribute.value = code;
    }

        //}
    return true;  
    };

autoForward.getHtml = function(ad){
    //alert(123);
     
    var p = this;
    var html = [];
    var title = MM[gConst.setting].menuItem[ad.id].name;
    var after = ad.tableAfter || "";
    var before = ad.tableBefore || "";
    //html.push(this.getNavMenu(ad.id));
    html.push("<div class=\"bodySet\" style='align:text;'");
    if(ad.divId) {
        html.push(" id=\"{0}\"".format(ad.divId));
    }


    var type = MM[gConst.setting].menuItem[p.attrs.id].type;
    
    html.push("><div id=\"container\">");
    html.push(this.getTopHtml());
    if(p.attrs.id!="mailSearch")
    {
        
        html.push(this.getLeftHtml());
    }
    
    html.push("<div id=\"autoForwardWrapper\" class=\"setWrapper\">");
    html.push("<div id=\"default_id_container\" class=\"tips write-tips\" style=\"top: 79px; left:556px; position:absolute; display: none;\"><div class=\"tips-text\"><div id=\"default_id_content\">"+Lang.Mail.ConfigJs.forward_input_right_mail+"</div></div><div class=\"tipsLeft diamond\"></div></div>");
    html.push("<div>");
    html.push("<h2 class=\"set_til\"> "+Lang.Mail.ConfigJs.filter_auto_forward+"<span>"+Lang.Mail.ConfigJs.pref_forward_tips+"</span></h2>");
    html.push(" <ul class=\"auto-reply-layout\">");
    html.push("<li class=\"pb_5\"><span class=\"left\">"+Lang.Mail.ConfigJs.forward_lbl_IsOpen +"</span><input name=\"option_auto_forward_status\" class=\"set-radio\" id=\"auto_forward_status1\" "+((ad.data.auto_forward_status.attribute.value || ad.data.auto_forward_status.attribute.defaultValue)==1?"checked=\"true\"":"")+"\" type=\"radio\" value=\"1\"/><label for=\"auto-transmit-on\">"+Lang.Mail.ConfigJs.set_sessionMode_on+"</label> </li>");
    html.push("<li class=\"pl155 pb_20\"><input name=\"option_auto_forward_status\" class=\"set-radio\" id=\"auto_forward_status0\" "+((ad.data.auto_forward_status.attribute.value || ad.data.auto_forward_status.attribute.defaultValue)!=1?"checked=\"true\"":"")+"\" type=\"radio\" value=\"0\"/><label for=\"auto-transmit-off\">"+Lang.Mail.ConfigJs.set_sessionMode_off+"</label></li>");
    html.push("<li class=\"pb_20\"><span class=\"left\">"+Lang.Mail.ConfigJs.forward_lbl_forwardrecuser+"</span><input id=\"option_auto_forward_addr\" maxlength=\"40\" class=\"set-txt w285\" onclick=\"\" type=\"text\" value=\""+Lang.Mail.ConfigJs.forward_lbl_onlyone+"\"/> </li>");
    html.push(" <li class=\"pb_20\"><span class=\"left fl\">"+Lang.Mail.ConfigJs.forward_lbl_savetolocal+"</span>");
    //html.push("<div class=\"\">");
    html.push("<span onclick=\"\" style=\"display:inline-block;\" id=\"dropMail_Div\">");
    html.push(this.attrs.dropMailType.getHTML());

    html.push(" </span></li>");
    html.push('<li id="autoForwardCaptcha" class="clearfix p_relative">\
        <span class="left fl">'+top.Lang.Mail.Write.tupianyanzhengma+'</span>\
    <div class="p_relative" style=" margin-left:155px;">\
        <input id="option_validateCode" name="validateCode" class="captcha_input com-txt w210" type="text" maxlength="8">\
        <div style="position: absolute; display:none; top: -54px; left: 163px; z-index: 9999;" class="tips write-tips">\
        <div class="tips-text">'+top.Lang.Mail.Write.tupianyanzhengmabunenweikong+'</div>\
        <div class="tipsLeft diamond"></div>\
        </div>\
        <p class="mt_10"><img class="captcha_img" id="unbind_imgShow" src="" /></p>\
        <a style="width:90px" href="javascript:void(0);" class="captcha_changeBtn">'+top.Lang.Mail.Write.kanbuqinghuanyizhang+'</a>\
    </p>\
    </p>\
    </div>\
    </li>');//
    html.push("</ul></div>");
    html.push("<div style=\"width:100%\" class=\"btm_pager fl\"><a href=\"javascript:fGoto();\" onclick= \"autoForward.save()\" class=\"n_btn_on mt_5 ml_10\"><span><span>"+Lang.Mail.ConfigJs.save+"</span></span></a><a href=\"javascript:fGoto();\" onclick=\"autoForward.goBack()\" class=\"n_btn mt_5\"><span><span>"+Lang.Mail.ConfigJs.pref_cancel+"</span></span></a></div>");
    html.push("</div>");
    
    //html.push("<div class=\"tips write-tips\" style=\"position:absolute; top:138px; left:536px; z-index:7;\"><div class=\"tips-text\">请输入正确的邮件地址</div><div class=\"tipsLeft diamond\"></div></div>"); 
    //html.push("</div>");
    html.push("<input id=\"option_auto_forward_bakup\" style=\"display:none\" type=\"text\" value=\"\"/>");
    html.push("</div>");
    
    
    
    MM[gConst.setting].update(ad.id, html.join(""));
    pref.updatePosition("autoForwardWrapper");
    this.attrs.dropMailType.loadEvent();
    this.attrs.dropMailType.setValue(ad.data.auto_forward_bakup.attribute.value);
    if(ad.data.auto_forward_addr.attribute.value != null && ad.data.auto_forward_addr.attribute.value != ""){
        document.getElementById("option_auto_forward_addr").value = ad.data.auto_forward_addr.attribute.value;
    }
    p.loadEvent();
};
autoForward.loadEvent = function(){
    var status0 = $("auto_forward_status0");
    var status1 = $("auto_forward_status1");
    var txtForward =$("option_auto_forward_addr");
    var captcha = jQuery('#autoForwardCaptcha');
    var unbind_imgShow= jQuery("#unbind_imgShow");   //取得图片验证码，下面调用其Click事件来刷新验证码
    var statusFunc = function(){
        if (status1.checked) {
            jQuery(txtForward).removeAttr("disabled");
            if(txtForward.value != Lang.Mail.ConfigJs.forward_lbl_onlyone){
                jQuery(txtForward).attr("style","color: black;");
            }else{
                jQuery(txtForward).removeAttr("style");
            }
        }
        else if(status0.checked) {
            jQuery(txtForward).attr("disabled", "disabled");
            //jQuery(txtForward).attr("style","color: black;");
        }
    };
    statusFunc();
    status0.onclick=function(){statusFunc();};
    status1.onclick=function(){statusFunc();};
    captcha.captcha();
    txtForward.onclick = function(){        
        if (this.value == Lang.Mail.ConfigJs.forward_lbl_onlyone) {
            this.value = '';
            if (this.createTextRange) {
                var r = this.createTextRange();
                r.moveStart('character', this.value.length);
                r.collapse();
                r.select();
            }
        }
        jQuery(this).attr("style","color: black;");
    };
    txtForward.onblur = function(){        
        if (this.value.trim() == '') {
            this.value = Lang.Mail.ConfigJs.forward_lbl_onlyone;
            jQuery(this).removeAttr("style");
        }
    };
};
autoForward.save = function(){
    var p= this;
    if(p.check()){
        var data = p.getSaveData(p.attrs.data);
        p.doServiceInXml(p.attrs.save.func, data, function(ao){
            unbind_imgShow.click();
            p.ok(Lang.Mail.ConfigJs.autoForwardSuc)
        }, function(ao){
            unbind_imgShow.click();
            p.fail(Lang.Mail.ConfigJs.filter_saveFail,ao);
        });
        //p.ajaxRequest(p.attrs.save.func, data, function(ao){
        //  p.ok(Lang.Mail.ConfigJs.autoForwardSuc)
        //}, function(ao){
        //  p.fail(Lang.Mail.ConfigJs.filter_saveFail,d);
        //}, url);
    }
    
};

autoForward.checkUserNumber = function(mail){
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

//autoForward.showTips = function(obj){
//  var tip = new ToolTips({
//         id: 'default_id'
//         //closeTime: 5
//   });
//   tip.show(obj, Lang.Mail.ConfigJs.forward_input_right_mail);
//};

