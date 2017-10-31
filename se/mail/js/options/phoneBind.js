
var phoneBind = new OptionBase();
//MAIL_CONFIG_PHONEBIND
phoneBind.attrs = {
    id : 'phoneBind',
    authority: 'MAIL_CONFIG_PHONEBIND',
    free: true,
    divId:'pagePhoneBind',
	noReq: true
};

phoneBind.init = function(){
	var p = this;
	
    p.request(p.attrs);
	p.timer = null;
	
};
/**
 * 得到框架页面
 * @param {Object} attrs
 * @param {Object} values
 */
phoneBind.getHtml = function(attrs, values){

    var html 		= [],
		p 			= this,
		initHtml 	= p.getInitHtml();
	
    html.push("<div class=\"bodySet\" style='align:text;' id=\"pageUserAlias\">");
    html.push("<div id=\"container\">"); 
    html.push(this.getTopHtml());           //加载顶部的菜单栏
    html.push(this.getLeftHtml());          //加载左侧的菜单栏
    // html.push(this.getNavMenu(p.attrs.id));
    html.push("<div class=\"setWrapper\" id='setWrapp'>");
	html.push(initHtml);                    //加载具体内容页面
    html.push('</div>');
    html.push('</div>');
    html.push('</div>');
    
    MM[gConst.setting].update(p.attrs.id, html.join(''));
	p.updatePosition("setWrapp");
	p.correctWidthInIE6("setWrapp",1);
	p.initEvent();
};
/**
 * 得到手机绑定的首页
 */
phoneBind.getInitHtml = function(){
	var html = []
		p	 = this;
		
	html.push("<div id=\"phoneBind_container\">");
	html.push("<div class=\"msg-set\">");
	html.push("<h2 class=\"set_til\">"+Lang.Mail.ConfigJs.bPhone+"</h2>");
	html.push(p.getInitContentHtml());
	html.push("<div class=\"btm_pager mt_20\">");
	html.push("<a id=\"saveBind\" href=\"javascript:fGoto();\"  class=\"n_btn_on mt_5 ml_10\" tabindex=\"23\" ><span><span>"+Lang.Mail.ConfigJs.save +"</span></span></a>");
	html.push("<a id=\"cancelBind\" href=\"javascript:fGoto();\"  class=\"n_btn mt_5 ml_10\" tabindex=\"24\" ><span><span>"+Lang.Mail.ConfigJs.cancelTip+"</span></span></a>");
	html.push("</div>");
	html.push("</div>");
	html.push("</div>");
	
	return html.join("");
};
phoneBind.hideTip = function(){
	var p = this;
	
	p.phoneErrorTip.close();
	p.codeErrorTip.close();
};
/**
 * 得到初始内容页面 （后续兼容）
 */
phoneBind.getInitContentHtml = function(){
	var p			= this,
	    html		= [],
		hasPhone	= "";		
	
	//gMain.hasPhone在setting.js已经判断给赋值了
	if(window.gMain && gMain.hasPhone)	{
		p.phone = hasPhone = gMain.hasPhone;
	}
	
	if (hasPhone == "fail") {
		CC.showMsg(Lang.Mail.ConfigJs.getPhoneFail);
		return;
	}
	
	if(hasPhone){
		//已绑定手机号码
		html.push("<div class=\"setphonewrap\" id=\"setphonewrap\">");
		html.push("<ul class=\"setCode-name\">");
		html.push("<li>");
		html.push("<span class=\"left\">"+Lang.Mail.ConfigJs.binded+"</span>");
		html.push("<span id=\"bindedPhone\">"+p.phone+"</span>");
		html.push("<a id=\"changePhone\" href=\"javascript:void(0);\" class=\"ml_5\">"+Lang.Mail.ConfigJs.hh+"</a>");
		html.push("</li>");
		html.push("<li class=\"mt_10\">");
		html.push("<span class=\"left\">&nbsp;</span>");
		html.push("<p style=\" color:#999;\">"+Lang.Mail.ConfigJs.tsfw);
		html.push("</p>");
		html.push("</li>");
		html.push("</ul>");
		html.push("</div>");

	}else{
		//您还没有手机号码帐号，请绑定您的手机号码作为手机号码邮箱账号。
		html.push("<div id=\"j_setPhoneContent\" class=\"setphonewrap\">");
		html.push("<div class=\"bd_div\">");
		html.push("<p>"+Lang.Mail.ConfigJs.noBinded);
		html.push("<a id=\"bindNow\" href=\"javascript:void(0);\">"+Lang.Mail.ConfigJs.bindNow+"</a>");
		html.push("</p>");
		html.push("<span id=\"bingTopTip\">"+Lang.Mail.ConfigJs.tsfw );
		html.push("</span>");
		html.push("</div>");
		html.push("</div>");
	}
	
	
	return html.join("");
};
/**
 * 初始化事件
 */
phoneBind.initEvent = function(){
	var $ = jQuery,
		p = this;
	
	p.newErrorTip();	
	
	$("#cancelBind").unbind().bind("click",function(){
		p.goBack();	
		p.hideTip();
	});	
	
	$("#bindNow").unbind().bind("click",function(){
		p.bindNewPhone();
	});
	
	$("#saveBind").unbind().bind("click",function(){
		
	});
	
	$("#changePhone").unbind().bind("click",function(){
		p.modPhone();
	});
	
	
};

phoneBind.newErrorTip = function(){
	var p		= this;
	
	p.phoneErrorTip = new parent.ToolTips({
		id : "phoneTip",
	    direction: parent.ToolTips.direction.Right,
		type:1,
		inputId:"phoneCode",
		afterInput:true
		
	}); 
	
	p.codeErrorTip = new parent.ToolTips({
		id : "codeTip",
	    direction: parent.ToolTips.direction.Right,
		inputId:"vdCode",
		afterInput:true,
		type:1

	}); 
	
};

/**
 * 点击 [换号]
 */
phoneBind.modPhone = function(){
	var $			= jQuery,
		p 			= this,
		getHtml 	= p.modPhoneHtml();
	    contentDiv 	= $("#setphonewrap");
	
	contentDiv[0].innerHTML = getHtml;
	p.initModPhoneEvent(p.phone);
	
};

phoneBind.initModPhoneEvent = function(){
	var p			= this,
		$			= jQuery;
		
	p.hideTip();	
	p.codeClick();
	p.blurCheck();
	p.phoneFocus();
	
	$("#saveBind").unbind().bind("click",function(){
		p.modSave();
	});	
	
	$("#cancelBind").unbind().bind("click",function(){
		p.init();
		p.codeClick();
		p.hideTip();
	});	
};

phoneBind.phoneFocus = function(){
	jQuery("#phoneCode").focus();
};
/**
 * 验证手机号码 和 短信号码
 */
phoneBind.check = function(){
	var html 		= [],
		$			= jQuery,
		p		    = this;
		
	 if(p.checkPhone() && p.checkMsg()){
	 	return true;
	 }
	 return false;
		
};
/**
 * 验证手机
 */
phoneBind.checkPhone = function(bBlur){
	var html 		= [],
		$			= jQuery,
		p		    = this,
		$phoneCode	= $("#phoneCode"),
		phone		= $phoneCode.val().trim();

		
	//手机号不能为空	
	if (!bBlur && phone == "") {
		p.phoneErrorTip.show($phoneCode,Lang.Mail.ConfigJs.phoneEmpty);
		return false;
	}	
	
	//请输入正确的手机格式
	if( phone && !Vd.checkData("mobile",phone)){
		p.phoneErrorTip.show($phoneCode,Lang.Mail.ConfigJs.rightPhoneTip);
		return false;
	}
	
	//只能绑定移动手机号
	if (phone && !Vd.checkMobile(phone)) {
		var mobileType = gMain.mobileType || "1";
		var showMoboleErr;
		if (mobileType =="0") {
			showMoboleErr=Lang.Mail.ConfigJs.rightPhoneTip;
		} else if (mobileType =="1") {
			showMoboleErr=Lang.Mail.ConfigJs.onlyMobile;
		} else if (mobileType =="2") {	
			showMoboleErr=Lang.Mail.ConfigJs.chinaTelcom;
		} else if (mobileType =="4") {
			showMoboleErr=Lang.Mail.ConfigJs.chinaUnion;
		} else {
			showMoboleErr=Lang.Mail.ConfigJs.onlyMobile;
		}
		p.phoneErrorTip.show($phoneCode,showMoboleErr);
		return false;
	}
	
	return true;
	
};
/**
 * 验证短信
 */
phoneBind.checkMsg = function(bBlur){
	var html 		= [],
		$			= jQuery,
		p		    = this,
		$vdCode		= $("#vdCode"),
		vdCode		= $vdCode.val().trim();
		
	//短信验证码不能为空	
	if (!bBlur && vdCode == "") {
		p.codeErrorTip.show($vdCode,Lang.Mail.ConfigJs.smsEmpty);
		return false;
	}	
	
	/*
	 * 现在后台验证
//验证码错误，请重新输入
	if(vdCode && vdCode != p.msgCode){
		p.codeErrorTip.show($vdCode,"验证码错误，请重新输入");
		return false;
	}
*/
	
	return true;
};

phoneBind.clearTimer = function(){
	clearInterval(p.timer);
	p.timer = null;
	jQuery("#getVdCode").html(p.codeHtml);
};
phoneBind.modSave = function(){
	var html 		= [],
		$			= jQuery,
		p		    = this,
		$phoneCode	= jQuery("#phoneCode"),
		phone		= $phoneCode.val().trim(),
		vdCode		= $("#vdCode").val().trim(),
		fnSuc		= null,
		fnFail		= null;
		
	p.vdCode	= "";
	if(!p.checkMsg()){
		return;	
	}
	
	p.msgCode	=	vdCode;
	
	p.hideTip();	
	p.setMobileAjax("mod");	
};

phoneBind.modPhoneHtml = function(){
	var html = [],
		p	 = this;
	html.push("<ul class=\"setCode-name\" style=\"padding-top:8px;\">");
	/*
html.push("<li style=\"position:relative\" class=\"clearfix mt_15\">");
	html.push("<span class=\"left\">原手机号码：</span>");
	html.push("<span>"+p.phone+"</span>");
	html.push("</li>");
*/
	html.push("<li class=\"mt_15 clearfix\" style=\"position:relative\">");
	html.push("<span  class=\"left\">"+Lang.Mail.ConfigJs.newNum+"</span>");
	html.push("<input type=\"text\" id=\"phoneCode\" style=\"position:relative\" class=\"set-txt-b w260\">");
	html.push("</li>");
	html.push("<li class=\"mt5\">");
	html.push("<span class=\"left\">&nbsp;</span>");
	html.push("<a href=\"javascript:void(0);\" class=\"n_btn\">");
	html.push("<span id=\"getVdCode\"><span>"+Lang.Mail.ConfigJs.getSms+"</span></span></a>");
	html.push("</li>");
	html.push("<li style=\"position:relative\" class=\"mt_15 clearfix\">");
	html.push("<span class=\"left\">"+Lang.Mail.ConfigJs.smsVd+"</span><div class=\"p_relative\">");
	html.push("<input style=\"position:relative\" id=\"vdCode\" type=\"text\" class=\"set-txt-b w260\">");
	html.push("</li>");
	html.push("<li class=\"mt5\">");
	html.push("<span class=\"left\">&nbsp;</span>");
	html.push("<span class=\"setCode-name-tips\">"+Lang.Mail.ConfigJs.vdDo+"</span>");
	html.push("</li>");
	html.push("</ul>");
	html.push("</div>");
	html.push("<div class=\"changNum\">");
	html.push("<h2>"+Lang.Mail.ConfigJs.hhtip+"</h2>");
	html.push("<ol class=\"changNum_ol\">");
	html.push("<li>"+Lang.Mail.ConfigJs.hhtip1+"</li>");
	html.push("<li>"+Lang.Mail.ConfigJs.hhtip2+"</li>");
	html.push("</ol>");

	
	return html.join("");

};

/**
 * 点击 [现在绑定]
 */
phoneBind.bindNewPhone = function(){
	var $			= jQuery,
		p 			= this,
		getHtml 	= p.bindNewPhoneHtml();
	    contentDiv 	= $("#j_setPhoneContent");
	//加载初始的内容页面
	contentDiv[0].innerHTML = getHtml;
	p.initBindNewPhoneEvent();
	
};
/**
 * 点击 [现在绑定] 初始化页面
 */
phoneBind.initBindNewPhoneEvent = function(){
	var p   		= this,
		$			= jQuery,
		$getvdCode	= $("#getVdCode");
		
	p.hideTip();
	
	//获取验证码事件
	p.codeClick();	
	p.blurCheck();
	p.phoneFocus();
	
	$("#cancelBind").unbind().bind("click",function(){
		p.init();
		p.hideTip();
	});
	
	$("#saveBind").unbind().bind("click",function(){
		p.createSave();
	});
	
	
};

phoneBind.blurCheck = function(){
	var p = this,
		$ = jQuery;
	
	$("#phoneCode").blur(function(){
		p.checkPhone(true);
	});
	
	/*
$("#vdCode").blur(function(){
		p.checkMsg(true);
	});
*/
};

phoneBind.codeClick = function(){
	var p = this;
	
	jQuery("#getVdCode").unbind().bind("click",function(ev){
			p.getCode();
			return false;
			ev.stopPropagation();
	});	
};
//当传了手机号，按“获取验证”，后台返回了验证码，输入验证码，按“确定”保存成功后，绑定手机号码就改变了
phoneBind.getCodeAjax = function(fnSuc,fnFail){
	var p   		= this,
		$			= jQuery,
		phoceCode	= $("#phoneCode").val(),
		data		= {mobilePhone:phoceCode},
		fnSuc		= null,
		fnFail	 	= null,
		$getvdCode	= $("#getVdCode");
		
	
		
	fnSuc = function(data){
		//获取验证码成功后，更改当前的手机号
		p.curPhone = phoceCode;
		//p.phone   = phoceCode;		
		p.msgCode = "";
		//59秒后重获验证码
	   	$getvdCode.html(p.codeHtml);
		p.setBackground(true);
	};
	fnFail = function(){
		getCodeFail();
	};		
	
	function getCodeFail(){
		CC.showMsg(Lang.Mail.ConfigJs.getSmsFail,true,false,"error");
		p.clearTimer();
	}
		
	p.doService("mail:getValidateCode",data,fnSuc,fnFail)
};
/**
 * 获取验证码
 */
phoneBind.getCode = function(){
	var p   		= this,
		$			= jQuery,
		$getvdCode	= $("#getVdCode");
		
		//59秒后可重新获取
		p.codeHtml = "<span><var id=\"codeSec\">59</var>"+Lang.Mail.ConfigJs.getSmsAgain+"</span>",
		i		 = 59;
	
	if(!p.checkPhone())	{
		return;
	}
	
	p.getCodeAjax();	
		
	//p.ajaxRequest("getCode",data,fnSuc,fnFail)
	
	
	p.timer = setInterval(function(){
			
		if(i){
			//$getvdCode.find("span")[0].style.cssText = "background:#666;";
			
			$("#codeSec").html(i--);
	
			$getvdCode.unbind("click").bind("click",function(ev){
				ev.stopPropagation();
				return false;
			});
		}else{
			var anewSpan = "";
			
			//$getvdCode[0].style.cssText = "";
			//重新获取验证码
			anewSpan = "<span id=\"\">"+Lang.Mail.ConfigJs.getSmsAgain+"</span>"
			p.setBackground(false);
			p.codeClick();
			$getvdCode.html(anewSpan);
			
			clearInterval(p.timer);
			p.timer = null;
		}
	},1000);
	
	
};
phoneBind.setBackground = function(set){
	var p 			= this,
		$			= jQuery,
		$getvdCode	= $("#getVdCode"),
		color		= "#ccc";
		
	if(set){
		$getvdCode[0].style.cssText = "background:"+color;
		$getvdCode.find("span")[0].style.cssText = "background:"+color;
		$getvdCode.parent()[0].style.cssText = "background:"+color;
	}else{
		$getvdCode[0].style.cssText = "";
		$getvdCode.find("span")[0].style.cssText = "";
		$getvdCode.parent()[0].style.cssText = "";
	}
};
/**
 * 得到创建手机号内容页面
 */
phoneBind.bindNewPhoneHtml = function(){
	var html = [],
		p	 = this;
		
	html.push("<div class=\"setphonewrap\" id=\"setphonewrap\">");
	html.push("<ul class=\"setCode-name\">");
	html.push("<li style=\"position:relative\">");
	html.push("<span class=\"left\">"+Lang.Mail.ConfigJs.bindPhone+"</span>");
	html.push("<input style=\"position:relative\" id=\"phoneCode\" type=\"text\" class=\"set-txt-b w260\">");
	html.push("</li>");
	html.push("<li  class=\"mt5\">");
	html.push("<span class=\"left\">&nbsp;</span><a href=\"\" class=\"n_btn\">");
	html.push("<span id=\"getVdCode\"><span>"+Lang.Mail.ConfigJs.getSms +"</span></span></a>");
	html.push("</li>");
	html.push("<li style=\"position:relative\" class=\"mt_15\">");
	html.push("<span class=\"left\">"+Lang.Mail.ConfigJs.smsVd +"</span><div class=\"p_relative\">");
	html.push("<input style=\"position:relative\" id=\"vdCode\" type=\"text\" class=\"set-txt-b w260\">");
	html.push("</li>");
	html.push("<li class=\"mt5\">");
	html.push("<span class=\"left\">&nbsp;</span>");
	html.push("<span id=\"vdTip\" class=\"setCode-name-tips\">"+Lang.Mail.ConfigJs.vdDo+"</span>");
	html.push("</li>");
	html.push("</ul>");
	html.push("</div>");
	
	return html.join("");
	
};

phoneBind.createSave = function(){
	var html 		= [],
		$			= jQuery,
		p		    = this,
		$phoneCode	= jQuery("#phoneCode"),
		phone		= $phoneCode.val().trim(),
		vdCode		= $("#vdCode").val().trim(),
		fnSuc		= null,
		fnFail		= null;
		
	p.msgCode	=	"";
	if(!p.checkMsg()){
		return;	
	}
	p.msgCode	=	vdCode;
	p.hideTip();
		
	p.setMobileAjax();
		
};
phoneBind.checkHasPhone = function(){
			var	data 	= {},
				p		= this,
				fnSuc	= null,
				fnFail	= null,
				sucMsg	= "",
				failMsg	= "";
			
			fnSuc = function(ao){
				if(ao && ao["var"] && ao["var"].mobilePhone){
					//赋初始值----------->gMain.hasPhone
					if(window.gMain){
						p.phone = gMain.hasPhone = ao["var"].mobilePhone;
					}
				}else{
					//showMsg();
					if(window.gMain){
						gMain.hasPhone = "";
					}
				}
				
				p.init();
			};	
			
			fnFail = function(ao){
				if(window.gMain){
					gMain.hasPhone = "fail";
				}
				p.init();
			};
			phoneBind.doService("mail:getUserInfo",data,fnSuc,fnFail);
}
/**
 * 设置手机绑定的ajax请求 (设置和修改都是一样的请求)
 * @param {Object} type
 * @param {Object} fnSuc
 * @param {Object} fnFail
 */
phoneBind.setMobileAjax = function(type){
	var p    	= this,
		data 	= {"validateCode":p.msgCode},
		fnSuc	= null,
		fnFail	= null,
		sucMsg	= "",
		failMsg	= "";
	
	if(type && type == "mod"){
		sucMsg =Lang.Mail.ConfigJs.hhSuc;
	}else{
		sucMsg = Lang.Mail.ConfigJs.bindPhoneSuc;
	}	
	
	fnSuc = function(ao){
		//手机绑定成功后，在gMain里改变
		if(window.gMain && gMain.mobileNumber){
			gMain.mobileNumber = p.curPhone;
		}
		p.clearTimer();	
		CC.showMsg(sucMsg,true,false,"option");
		
		//检查是否有手机号，后初始页面
		p.checkHasPhone();
	};	
	
	fnFail = function(ao){
		if(ao &&  ao["code"]){
			var errorCode  = ao["code"],
				errorMsg   = "",
				$vdCode	   = jQuery("#vdCode");
				
			if(errorCode == "validateCodeisExpired"){
				errorMsg	= Lang.Mail.ConfigJs.vdExpired;
			}else if(errorCode == "validateCodeisInvalid"){
				errorMsg	= Lang.Mail.ConfigJs.noVdNum;
			}	
			
			p.codeErrorTip.show($vdCode,errorMsg);
		}
	};
	
	
	p.doService("mail:setUserMobileInfo",data,fnSuc,fnFail);
}











