


var password = new OptionBase();

password.attrs = {
    id: 'password',
    authority: 'MAIL_CONFIG_PASSWORD',
    free: true,
    divId:"pagePassword",
    noReq: true,
    url:gMain.webPath+
	'/se/mail/config/password.do?func={0}&sid={1}'.format(gConst.func.updatePwd,gMain.sid)			
};

password.init = function(id){
	var p = this;
    this.request(this.attrs,this.getHtml,null,true);
	//实例化安全等级提示控件
	this.newSecGradeTip();
	
	jQuery("#newPassword").blur(function(){
		password.showNewPwdErr();
		
	});

	jQuery("#oldPassword").focus();
	
	jQuery("#confirmPassword").unbind().bind("keydown",function(ev){
		if(EV.getCharCode(ev) == 13){
			p.save();
		}
	});
};

password.newSecGradeTip = function(){
	if(document.getElementById("secGrade")){
		return;
	}
	var p = this;
	var NotContains = {
		Account: gMain.userNumber,
		Mobile: '',
		Alias: ''
	};
	var obj = {
		"pwdId": "newPassword",
		"NotContains": NotContains,
		"sLevel":parseInt(gMain.pwdCheckType)
	};
	p.vdpwd = new VdPassWord(obj);
	
};
password.getHtml = function(){
	var p = this;
	var getAddHtml = function(){
		var html = [];
	

		html.push("<div>");
		html.push("<h2 class=\"set_til\"> "+Lang.Mail.ConfigJs.ModifyPassword+"<span>");
		html.push("( "+Lang.Mail.ConfigJs.forgetPassword+" )</span></h2>");
		html.push("<div class=\"codeSet-wrap\" id='codeSet'>");
		html.push("<ul class=\"setCode-name\">");
		//旧密码
		html.push("<li><span class=\"left\">"+Lang.Mail.ConfigJs.oldPwd+"：</span>");
		html.push("<input type=\"password\" class=\"set-txt-b w260\" id='oldPassword'/>");
		html.push(password.getFalseTip("oldTip","oldTip1",Lang.Mail.ConfigJs.currentPwd));
		html.push("</li><li class=\"pl113 pb_15\"></li>");
		html.push("<li  class=\"pl155 pb_15\" >");
		//新密码
		html.push("<li><span class=\"left\">"+Lang.Mail.ConfigJs.enterNewPassword+"：</span>");
		html.push("<input type=\"password\" class=\"set-txt-b w260\" id='newPassword'/>");
		html.push(password.getFalseTip("newTip","newTip1",Lang.Mail.ConfigJs.correctPassword));
		html.push("</li><li class=\"pl155 pb_15\" id='newSec'>");
		html.push("<span class=\"setCode-name-tips\">"+gMain.pwdMinLen+"-"+gMain.pwdMaxLen+Lang.Mail.ConfigJs.notSpecialInLock +"</span></li>");
	    //密码安全度显示
		html.push("<li class=\"pl155 pb_15\">");
		html.push("<div class=\"pw-security\">");
		html.push("<p style='display:none' id='securityTip'>"+Lang.Mail.ConfigJs.PasswordSecurity);
		html.push("：<em id='emText'>"+Lang.Mail.ConfigJs.ordinary+"</em></p>");
		html.push("<p class='security-line' id='securityTip1' style='display:none' >");
		html.push("<span id='password_sp1' class=\"orange-bg\">1</span>");
		html.push("<span class=\"orange-bg\" id='password_sp2'>2</span>");
		html.push("<span class=\"grey-bg\" id='password_sp3'>3</span></p>");
		html.push("</div></li><!--pw-security-->");
		//密码确认
		html.push("<li><span class=\"left\">"+Lang.Mail.ConfigJs.ConfirmNewPassword);
		html.push("：</span><input type=\"password\" class=\"set-txt-b w260\" id='confirmPassword'/>");
		html.push(password.getFalseTip("confirmTip","confirmTip1",Lang.Mail.ConfigJs.correctPassword));
		html.push("</li></ul>");
		
		html.push("</div><!--codeSet-wrap-->");
		html.push("<div class=\"btm_pager fl\" style='width:100%'>");
		html.push("<a onclick='password.save()' class=\"n_btn_on mt_5 ml_10\"><span>");
		html.push("<span>"+Lang.Mail.ConfigJs.save +"</span></span></a>");
		html.push("<a onclick='password.goBack()' class=\"n_btn mt_5\"><span>");
		html.push("<span>"+Lang.Mail.ConfigJs.cancelTip +"</span></span></a>");
		html.push("</div>");
		/*
        html.push("<div id='oldTip' class=\"tips write-tips\" ");
		html.push("style=\"display:none; position:absolute;padding-top: 3px;padding-bottom:3px; top: 2px; left:521px; z-index:7;\">");
		html.push("<div class=\"tips-text\" id='oldTip1'>");
		html.push(Lang.Mail.ConfigJs.currentPwd);
		html.push("</div>");
		html.push("<div class=\"tipsLeft diamond\"></div>");

		html.push("</div>");
		html.push("<div id='newTip' class=\"tips write-tips\" style=\"display:none; position:absolute; padding-top: 3px;padding-bottom:3px; top: 85px; *top:99px;  left:611px; z-index:7;\">");
		html.push("<div class=\"tips-text\" id='newTip1'>");
		html.push(Lang.Mail.ConfigJs.correctPassword);
		html.push("</div>");
		html.push("<div class=\"tipsLeft diamond\"></div>");
		html.push("</div>");

		html.push("<div  id='confirmTip' class=\"tips write-tips\" style=\"display:none; position:absolute; padding-top: 3px;padding-bottom:3px; top: 168px; *top:183px; left:611px; z-index:7;\">");
		html.push("<div class=\"tips-text\" id='confirmTip1'>");
		html.push(Lang.Mail.ConfigJs.correctPassword);
		html.push("</div>");
		html.push("<div class=\"tipsLeft diamond\"></div>");
		html.push("</div>");*/
		html.push("</div>");
		return html.join("");
	}
	var html = [];
    var addDiv = getAddHtml();
    html.push("<div class=\"bodySet bodyBwList\" style='align:text;'");
    html.push("><div id=\"container\">");
    html.push(this.getTopHtml());
    html.push(this.getLeftHtml());
    html.push("<div class=\"setWrapper\" id=\"setWrapp\">");
    html.push(addDiv);
    html.push("<div id='sign_list'></div>");
    html.push("</div></div></div>");
    MM[gConst.setting].update(password.attrs.id, html.join(""));
	password.updatePosition();
   
};

password.showNewPwdErr = function(){
	var p = this;
	var code = p.vdpwd.NotifyCode;

	if(code != 0){
		
        //jQuery("#newPassword").focus();
        jQuery("#newTip").css("display","inline");
        jQuery("#newTip1").html(p.vdpwd.msg);
        return true;
	}
	return false;
};
password.save = function() {
	//获得 各密码输入框的值
	var p = this;
    var pass = jQuery("#oldPassword").val();
    var newpass1 = jQuery("#newPassword").val();
    var newpass2 = jQuery("#confirmPassword").val();
	//提示框先隐藏
	jQuery("#oldTip,#newTip,#confirmTip").hide();
	jQuery("#security,#security1").hide();
	password.securityTips();
    var p = this;
    var isOk = true;
    
    var pv = pass.trim() || "";
    var npv1 = newpass1;
    var npv2 = newpass2;
	
	if(p.showNewPwdErr()){
		return;
	}
	
    if (pv == "") {
        
        jQuery("#oldPassword").focus();
		jQuery("#oldTip").css("display","inline");
        jQuery("#oldTip1").html(Lang.Mail.ConfigJs.currentPwd );
        return;
    }
    if (npv1 == "") {
       
        jQuery("#newPassword").focus();
        jQuery("#newTip").css("display","inline");
        jQuery("#newTip1").html(Lang.Mail.ConfigJs.inputNewPwd);
        return;
    }
	
	if (npv2 == "") {
	   
        jQuery("#confirmPassword").val("").focus();
        jQuery("#confirmTip").css("display","inline");
        jQuery("#confirmTip1").html(Lang.Mail.ConfigJs.inputConfirmPwd);
        return;
	}
    if (npv1 != npv2) {
      
        jQuery("#confirmPassword").focus();
        jQuery("#confirmTip").css("display","inline");
        jQuery("#confirmTip1").html(Lang.Mail.ConfigJs.towPwdMatch);
        return;
    }
  
  

    if (isOk) {
        var data = {
            authType: 0,
            password: pv,
            newPassword: npv1
        };
		
        this.ajaxRequest(gConst.func.updatePwd, data, function(ao) {
			CC.showMsg(Lang.Mail.ConfigJs.pwdChangeSuc,true,false,"option");
			p.init(p.attrs.id);
        }, function(ao) {
			if(ao.code.toLowerCase() == "invalid_pwd_new"){
				jQuery("#newPassword").focus();
				jQuery("#newTip").css("display","inline");
        		jQuery("#newTip1").html(ao.msg);
			}
        	else if(ao.code!="UNKNOW_EXCEPTION"){
        		//p.fail(ao.msg);
				jQuery("#oldPassword").focus();
				jQuery("#oldTip").css("display","inline");
        		jQuery("#oldTip1").html(ao.msg);
          	}else{
				jQuery("#oldPassword").focus();
				jQuery("#oldTip").css("display","inline");
        		jQuery("#oldTip1").html(Lang.Mail.ConfigJs.ModifyPwdErr );
          		//p.fail(Lang.Mail.Config.ModifyPwdErr);
          	}
        }, this.attrs.url);
    }
};
/**
 * 检查密码 安全提示
 */
password.securityTips = function(){
	var p = this;
	var newPassword = jQuery("#newPassword").val();
	//jQuery("#securityTip,#securityTip1").show();


		
	//[ 验证密码不合法 ] 的提示
	var code = p.vdpwd.NotifyCode;
	var msg1 = '';
	switch (code) {
		case 0:{
			//          msg1='表示校验通过，可以用被检验字符串做密码';
			break;
		}
		case 1:{
			//          msg1='密码不能为空';
			msg1 = Lang.Mail.Config.PwdNew01;
			break;
		}
		case 2:{
			//          msg1='密码太简单';
			msg1 = Lang.Mail.ConfigJs.simpleTip;
			break;
		}
		case 3:{
			//          msg1='密码不能为手机帐号或别名帐号';
			msg1 = Lang.Mail.Config.PwdNew03;
			break;
		}
		case 4:{
			//          msg1='密码不能为手机帐号或别名帐号加上字符串联';
			msg1 = Lang.Mail.ConfigJs.simpleTip;
			break;
		}
		case 5:{
			//          msg1='密码不能为纯数字';
			msg1 = Lang.Mail.Config.PwdNew05;
			break;
		}
		case 6:{
			//          msg1='密码不支持“_~@#$”以外的特殊符号';
			msg1 = Lang.Mail.Config.PwdNew06;
			break;
		}
		case 7:{
			//          msg1='密码不能有太多字符串联';
			msg1 = Lang.Mail.ConfigJs.simpleTip;
			break;
		}
		case 8:{
			//          msg1='密码不能为字符串联块';
			msg1 = Lang.Mail.ConfigJs.simpleTip;
			break;
		}
		case 9:{
			//          msg1='密码必须为6-16位';
			msg1 = Lang.Mail.ConfigJs.pwdLimit.format(gMain.pwdMinLen,gMain.pwdMaxLen);
			break;
		}
	}
	
	jQuery("#newTip").hide();
	if(code != 0){

		jQuery("#newPassword").focus();
		
	    jQuery("#newTip").css("display","inline");
	    jQuery("#newTip1").html(msg1);
	}
	

};

