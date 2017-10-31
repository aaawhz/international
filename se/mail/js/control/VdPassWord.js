/**
 * VdPassWord 密码验证控件
 * 传入密码input的ID, 通过ID获取输入框的文本，在onkeyup事件中得到密码的安全强度，
 * 并在这个输入框的下面创建一个DIV显示出来；当密码输入框失去焦点时，隐藏div
 * 
 * if(new VdPassWord().NotifyCode == 0) 验证通过 else 显示提示信息
 * 
 * Param    				{Object}   {pwdId,NotContains}
 * 
 * 接收参数
 * pwdId  			（必选）		密码输入框的ID 				
 * NotContains 		（可选）		密码限制的信息 					
 * pwdMinLen		（可选）		最小密码长度	  				
 * pwdMaxLen		（可选）		最大密码长度  			    
 * hideTip			（可选）		开始是否显示“安全强度”提示，默认开始隐藏    
 * sLevel			（可选）		必须达到的安全强度 [1:弱 2:普通 3:安全]
 * position			（可选）     安全强度默认在输入框的下面 
 
 * 输出参数
 * VdPassWord.SafeLevel         得到安全等级
 * VdPassWord.NotifyCode        得到提示代码  (只有等于0，密码才验证通过)
 * VdPassWord.msg				得到文本信息
 * 
 * NotifyCode
 * [	0	:					表示校验通过，可以用被检验字符串做密码]
 * [	1	:	---				密码不能为空]
 * [	2	:					密码太简单]
 * [	3	:	---				密码不能为手机帐号或别名帐号]
 * [	4	:					密码不能为手机帐号或别名帐号加上字符串联]
 * [	5	:	---				密码不能为纯数字] 现在是可以纯数字
 * [	6	:					密码不支持“_~@#$”以外的特殊符号]
 * [	7	:	---				密码不能有太多字符串联]
 * [	8	:					密码不能为字符串联块]
 * [	9	:	---				密码必须为6-20位 (可变)]
 * 
 * 
 * useing jQuery JavaScript frame v1.6.1+
 */
var VdPassWord = function(obj){
	var $ 				= jQuery,
	    userNumber 		= "",		//登陆邮箱
		userName		= "",		//登陆邮箱（不包含域名）
		trueName		= "";		//登陆名称
		
	
	if(typeof gMain != "undefined"){
		if(typeof gMain.userNumber != "undefined"){
			userNumber = gMain.userNumber;
			userName   = userNumber.substring(0,userNumber.indexOf("@"));
		}
		
		if(typeof gMain.trueName != "undefined"){
			trueName	= gMain.trueName;
		}
		
	}else{
		gMain = "";
	}
	this.pwd			= $("#"+obj.pwdId);
	this.NotContains 	= obj.NotContains || {
								Account: userNumber,
								Mobile: userName,
								Alias: trueName
						  };	
	//可以传入密码长度限制，默认去gMain的值，如果gMain没有输出，默认是   6 - 20					  
	this.pwdMinLen  	= obj.pwdMinLen || ((gMain && gMain.pwdMinLen) ? gMain.pwdMinLen : 6);
	this.pwdMaxLen      = obj.pwdMaxLen || ((gMain && gMain.pwdMaxLen) ? gMain.pwdMaxLen : 20);
	this.showSec		= obj.showSec;	
	this.sLevel			= (obj.sLevel>3 ? 3 : obj.sLevel) || 0;	
	this.position		= obj.position || "Bottom";			  				  
	this.init();

};

VdPassWord.pos = {
	Right:"Right",
	Bottom:"Bottom"
};
VdPassWord.prototype.init = function(){
	var p = this;
	//输出
	p.NotifyCode = 1;
	p.msg = Lang.Mail.Config.PwdNew01;
	p.SafeLevel = 0;
	p.createTipDiv();
	p.evKeyUp();
	p.evBlur();
};

VdPassWord.prototype.evBlur = function(){
	var p = this;
	var pwd = this.pwd;
	
	pwd.blur(function(){
		//如果不要求一开始显示，在输入框失去焦点的时候隐藏安全提示
		if(!p.showSec){
			//p.tipDiv.hide();
		}
	});
};

VdPassWord.prototype.evKeyUp = function(){
	var p = this;
	var pwd = this.pwd;
	
	pwd.keyup(function(ev){
		var keycode = EV.getCharCode(ev);
		if(keycode == 13){
			return;
		}
		//验证安全强度
   		p.securityTips();
	});
};

//在onkeydown的事件调用这个方法，在这个方法确认当前密码的安全等级，以及相应的提示
	
 VdPassWord.prototype.PwdCheck = function(spwd, NotContains) {
 	var p = this;
	var NotContains = p.NotContains;
	//获取密码的值
	var spwd = p.pwd.val();
    var dic = [
       "lovely",
       "tigger",
       "123456",
       "12345",
       "123456789",
       "password",
       "iloveyou",
       "princess",
       "rockyou",
       "1234567",
       "12345678",
       "abc123",
       "nicole",
       "daniel",
       "babygirl",
       "monkey",
       "jessica",
       "levely",
       "michael",
       "ashley",
       "654321",
       "qwerty",
       "iloveu",
       "michelle",
       "111111",
       "0",
       "tigger",
       "password1",
       "sunshine",
       "chocolate",
       "anthony",
       "angel",
       "FRIENDS",
       "soccer"
    ];
    String.prototype.LTrim = function() {
        return this.replace(/(^\s*)/g, "");
    }
    String.prototype.RTrim = function() {
        return this.replace(/(\s*$)/g, "");
    }
    String.prototype.Trim = function() {
        return this.replace(/(^\s*)|(\s*$)/g, "");
    }
    String.prototype.replaceAll = function(s1, s2) {
        return this.replace(new RegExp(s1, "gm"), s2);
    }
    function getReturnValue(sLevel, sNcode) {
        if (sLevel != 0) {
            sLevel = getStrongLevel(spwd);
        }
        var ret = {
            SafeLevel: sLevel,
            NotifyCode: sNcode
        };
		p.SafeLevel = sLevel;
		p.NotifyCode = sNcode;
		setMsg(sNcode,sLevel);
        return ;
    }
	
	function setMsg(sNcode,sLevel){
	
		switch (sNcode) {
			
			case 1:{
				//          msg1='密码不能为空';
				p.msg = Lang.Mail.Config.PwdNew01;
				break;
			}
			case 2:{
				//          msg1='密码太简单';
				p.msg = Lang.Mail.ConfigJs.simpleTip;
				break;
			}
			case 3:{
				//          p.msg='密码不能为手机帐号或别名帐号';
				p.msg = Lang.Mail.Config.PwdNew03;
				break;
			}
			case 4:{
				//          p.msg='密码不能为手机帐号或别名帐号加上字符串联';
				p.msg = Lang.Mail.ConfigJs.simpleTip;
				break;
			}
			case 5:{
				//          p.msg='密码不能为纯数字';
				p.msg = Lang.Mail.Config.PwdNew05;
				break;
			}
			case 6:{
				//          p.msg='密码不支持“_~@#$”以外的特殊符号';
				p.msg = Lang.Mail.Config.PwdNew06;
				break;
			}
			case 7:{
				//          p.msg='密码不能有太多字符串联';
				p.msg = Lang.Mail.ConfigJs.simpleTip;
				break;
			}
			case 8:{
				//          p.msg='密码不能为字符串联块';
				p.msg = Lang.Mail.ConfigJs.simpleTip;
				break;
			}
			case 9:{
				//          p.msg='密码必须为6-16位';
				p.msg = Lang.Mail.ConfigJs.pwdLimit.format(p.pwdMinLen, p.pwdMaxLen);
				break;
			}

		}
		
		//如果没有错误，但安全强度没有达到要求，则NotifyCode为10，msg为：密码安全强度必须为[弱，普通，安全]
		if(sNcode == 0 && sLevel < p.sLevel){
				var levelTip = "",
					mustLevel = p.sLevel;
					
				switch(mustLevel){
					case 1: 
						levelTip = Lang.Mail.ConfigJs.week;
						p.msg = "密码不安全";
						break;
					case 2:	
						levelTip = Lang.Mail.ConfigJs.ordinary ;
						p.msg = "密码强度不能为弱";
						break;
					case 3:
						levelTip = Lang.Mail.ConfigJs.safety;
						p.msg = Lang.Mail.ConfigJs.qdMust+levelTip;
						break;	
				}
				p.NotifyCode = 10;
		}else if(sNcode == 0){
			p.NotifyCode = 0;
			p.msg = Lang.Mail.ConfigJs.vdPass;
		}
			
	}		
		
	
    function IsTheSame(s) { /*是否相同串 ，如aaaaa */
	    //类似 ^ s.charAt(0)+ $
		if(!s) return;
        var reg = new RegExp("^" + s.charAt(0).replace(/([^a-zA-Z0-9])/, "\\$1") + "+$");
        return reg.test(s);
    };
    function IsContainContinuous(s) { /*是否包含连续串*/
        var s1 = "abcdefghijklmnopqrstuvwxyz";
        var s2 = s1.toUpperCase();
        var s3 = "0123456789";
        var s4 = "9876543210";
        var s5 = "zyxwvutsrqponmlkjihgfedcba";
        var s6 = s5.toUpperCase();
        var list = [s1, s2, s3, s4, s5, s6];
        for (var i = 0; i < list.length; i++) {
            if (list[i].indexOf(s) >= 0) return true;
        }
        return false;
    };
    function isSimpleString(s) {
        if (IsTheSame(s)) return true;
        if (IsContainContinuous(s)) return true;
        return false;
    };

    function isChuanLian(pwd) {
        for (var i = 1; i < pwd.length; i++) {
            var strBegin = pwd.substring(0, i);
            if (isSimpleString(strBegin)) {
                var strEnd = pwd.substring(i, pwd.length);
                if (/[a1]/.test(strBegin) || /[a1]/.test(strEnd)) {
					//strEnd.indexOf("a") >= 0 || strEnd.indexOf("1") >= 0
                    if (isSimpleString(strEnd)) {
                        return true;
                    }
                }
            }
        }
        return false;
    };
    //判断是否有太多的串联
    function isTooManyChuanLian(pwd) {
		//如 a123456 ,123456a 为串联    a12345b 则通过
        return isSimpleString(pwd.substring(1)) || isSimpleString(pwd.substring(0, pwd.length - 1));
    };

    function getPwdProperty(pwd) {
        var hasNum = false;
        var hasLetter = false;
        var hasSymbol = false;
        var s = pwd.toLowerCase();
        var numStrs = "0123456789";
        var letterStrs = "abcdefghijklmnopqrstuvwxyz";
        var symbolStrs = "~!@#$%^&*()_+{}[]:\"|<>?,./;'\\";
        var ch = "";
		//判断是否有数字
        for (var i = 0; i < s.length; i++) {
            ch = s.substr(i, 1);
            if (numStrs.indexOf(ch) != -1) {
                hasNum = true;
                break;
            }
        }
		//判断是否有字母
        for (var i = 0; i < s.length; i++) {
            ch = s.substr(i, 1);
            if (letterStrs.indexOf(ch) != -1) {
                hasLetter = true;
                break;
            }
        }
		//判断是否有特殊符号
        for (var i = 0; i < s.length; i++) {
            ch = s.substr(i, 1);
            if (symbolStrs.indexOf(ch) != -1) {
                hasSymbol = true;
                break;
            }
        }
        var ret = {
            HasNum: hasNum,
            HasLetter: hasLetter,
            HasSymbol: hasSymbol
        };
        return ret;
    };

    function getStrongLevel(pwd) {
        var pro = getPwdProperty(pwd);
        var hasNum = pro.HasNum;
        var hasLetter = pro.HasLetter;
        var hasSymbol = pro.HasSymbol;

        if (pwd.length < parseInt(p.pwdMinLen)) {
            return 0;
        }
		//没有数字，没有特殊字符，
        if ((!hasNum) && (!hasSymbol) ) {
            return 1;
        }
		//没有数字，没有字母
        if ((!hasNum) && (!hasLetter) ) {
            return 1;
        }
		//有数字，有字母，没特殊字符
        if ((hasNum) && (hasLetter) && (!hasSymbol) ) {
            return 2;
        }
		//有数字，没有字母，有特殊字符
        if ((hasNum) && (!hasLetter) && (hasSymbol) ) {
            return 2;
        }
		//没有数字，有字母，有特殊字符
        if ((!hasNum) && (hasLetter) && (hasSymbol)) {
            return 2;
        }
		if(hasNum && hasLetter && hasSymbol)
		{
			return 3;
		}
        return 3;
    };
    
	/* 函数 开始执行 */
    var level;                   //密码的安全度                                    [ 弱  普通 安全 ]
    var ncode;                   //密码不合法相应的提示代码      [ 0 - 9 ]
   
	/* 1.输入为空，直接返回安全度 为 [ 0 ] */
    if (spwd == "") {
        level = 0;
        ncode = 1;
        return getReturnValue(level, ncode);
    }
	/* 2.如果小于6或者大于30，密码长度不对，返回安全度为[ 0 ] */
    if (spwd.length < parseInt(p.pwdMinLen) || spwd.length > parseInt(p.pwdMaxLen)) {
        if (spwd.length < parseInt(p.pwdMinLen)) {
            level = 0;
        }
        level = 0;
        ncode = 9;
        return getReturnValue(level, ncode);
    }

    var smppwd = spwd;
    var dicpwd;
    for (var i = 0; i < dic.length; i++) {
        smppwd = spwd;
        dicpwd = dic[i];
		// 2.如果密码为常用的简单密码， 返回安全度为[ 0 ]
        if (smppwd == dicpwd) {
            level = 0;
            ncode = 2;
            return getReturnValue(level, ncode);
        }
    }
    
	/* [ NotContains : 密码不能等于这个对象的属性 ] */
    if (NotContains) {
        if (NotContains.Account) {
            if (spwd == NotContains.Account) {
                level = 0;
                ncode = 3;
                return getReturnValue(level, ncode);
            }
        }
        if (NotContains.Mobile) {
            if (spwd == NotContains.Mobile) {
                level = 0;
                ncode = 3;
                return getReturnValue(level, ncode);
            }
        }
        if (NotContains.Alias) {
            if (spwd == NotContains.Alias) {
                level = 0;
                ncode = 3;
                return getReturnValue(level, ncode);
            }
        }
    }

    var spwd2;
    var isc = false;             //输入的密码是否包含有 [ 账号、手机号、别名 ]
    if (NotContains && NotContains.Account && (!isc)) {
        spwd2 = spwd;
        if (spwd2.indexOf(NotContains.Account) != -1) {
            isc = true;
        }
		//过滤掉含有账号的密码 [ 如：abcadmin@se.com --> abc ]
        spwd2 = spwd2.replaceAll(NotContains.Account, "");
    }
    if (NotContains && NotContains.Mobile && (!isc)) {
        spwd2 = spwd;
        if (spwd2.indexOf(NotContains.Mobile) != -1) {
            isc = true;
        }
		//过滤掉含有手机号的密码 [ 如：abc13380378708 --> abc ]
        spwd2 = spwd2.replaceAll(NotContains.Mobile, "");
    }
    if (NotContains && NotContains.Alias && (!isc)) {
        spwd2 = spwd;
        if (spwd2.indexOf(NotContains.Alias) != -1) {
            isc = true;
        }
		//过滤掉含有账号的密码 [ 如：abczhangsan --> abc ]
        spwd2 = spwd2.replaceAll(NotContains.Alias, "");
    }
    if (spwd2 && isc) {

		// 4.如果密码长度在3个以内 + 账号/手机号/别名  则提示  [ 4 : 密码不能为手机帐号或别名帐号加上字符串联]
        if (spwd2.length <= 3) {
            level = 0;
            ncode = 4;  
            return getReturnValue(level, ncode);
        }
        
        /*
        if (isChuanLian(spwd2)) {
        level = 0;
        ncode = 4;
        return getReturnValue(level, ncode);
        }
        */
    }


    if (!/\D/.test(spwd)) { //5.密码为纯数字
        level = 0;
        //ncode = 5;
		ncode = 0;
        return getReturnValue(level, ncode);
    }


    if (/.*[\u4e00-\u9fa5]+.*$/.test(spwd)) {//6.包含了中文
        level = 0;
        ncode = 6;
        return getReturnValue(level, ncode);
    }

    //if (/[^A-Za-z0-9_~@#$\^]/.test(spwd)) {//包含[ _~@#$ ]之外的特殊字符
       // level = 0;
       // ncode = 6;
       // return getReturnValue(level, ncode);
   // }

    if (isTooManyChuanLian(spwd)) { //7.太多字符串串联 n-1
        level = 0;
        ncode = 7;
        return getReturnValue(level, ncode);
    }

    if (isChuanLian(spwd)) {
        level = 0;
        ncode = 8;
        return getReturnValue(level, ncode);
    }

    return getReturnValue(level, 0);
}; 

VdPassWord.prototype.showTip = function(){
	var p = this;
	

	switch(p.position){
		case VdPassWord.pos.Bottom:
			p.tipDiv.show();
			break;
			//如果是在输入框的右边显示，改样式，关键在display:inline , position:absolute
		case VdPassWord.pos.Right:
		    p.tipDiv.css({"display":"inline","zoom":1,"position":"absolute","marginLeft":"8px","paddingLeft":0});
			break;		
	}
	
};

//创建提示框
VdPassWord.prototype.createTipDiv = function(){
	var p = this,
		$ = jQuery,
		html = [];
		
	html.push("<li id=\"secGrade\" class=\"pl155 pb_15\">");
	html.push("<div class=\"pw-security\">");
	html.push("<p  id='securityTip'>"+Lang.Mail.ConfigJs.PasswordSecurity);
	html.push("：<em id='emText'>"+Lang.Mail.ConfigJs.ordinary+"</em></p>");
	html.push("<p class='security-line' id='securityTip1'  >");
	html.push("<span id='password_sp1' class=\"orange-bg\">1</span>");
	html.push("<span class=\"orange-bg\" id='password_sp2'>2</span>");
	html.push("<span class=\"grey-bg\" id='password_sp3'>3</span></p>");
	html.push("</div></li><!--pw-security-->");	
	
	var oTipDiv = p.tipDiv = $(html.join(""));
	

	switch(p.position){
		case "Bottom":
			p.pwd.parent().after(oTipDiv);
			break;
		case "Right":
			p.pwd.after(oTipDiv);
			break;	
	}
	
	//一开始是否显示安全强度提示
	if(p.showSec){
	}else{
		$("#secGrade").hide();
	}
	
	
};

VdPassWord.prototype.securityTips = function(){
	var p = this;
	var $ = jQuery;
	var safeLevel = "";
	
	p.PwdCheck();
	
	safeLevel =  p.SafeLevel;

	//创建提示的div

	p.showTip();

	switch (safeLevel) {
		case 0:
		case 1:{
			$("#emText").html(Lang.Mail.ConfigJs.week);
			$("#password_sp1").removeClass().addClass("orange-bg");
			$("#password_sp2").removeClass().addClass("grey-bg");
			$("#password_sp3").removeClass().addClass("grey-bg");
			
			break;
		}
		case 2:{
			$("#emText").html(Lang.Mail.ConfigJs.ordinary);
			$("#password_sp1").removeClass().addClass("orange-bg");
			$("#password_sp2").removeClass().addClass("orange-bg");
			$("#password_sp3").removeClass().addClass("grey-bg");
			
			break;
		}
		case 3:{
			$("#emText").html(Lang.Mail.ConfigJs.safety);
			$("#password_sp1").removeClass().addClass("orange-bg");
			$("#password_sp2").removeClass().addClass("orange-bg");
			$("#password_sp3").removeClass().addClass("orange-bg");
			break;
		}
	}
	
}