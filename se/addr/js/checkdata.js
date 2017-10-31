function PwdCheck(spwd, NotContains) {
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
        return ret;
    }
    function IsTheSame(s) { /*是否相同串*/
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
                if (/[a1]/.test(strBegin) || /[a1]/.test(strEnd)) {//strEnd.indexOf("a") >= 0 || strEnd.indexOf("1") >= 0
                    if (isSimpleString(strEnd)) {
                        return true;
                    }
                }
            }
        }
        return false;
    };

    function isTooManyChuanLian(pwd) {
        return isSimpleString(pwd.substring(1)) || isSimpleString(pwd.substring(0, pwd.length - 1));
    };

    function getPwdProperty(pwd) {
        var hasNum = false;
        var hasLetter = false;
        var hasSymbol = false;
        var s = pwd.toLowerCase();
        var numStrs = "0123456789";
        var letterStrs = "abcdefghijklmnopqrstuvwxyz";
        var symbolStrs = "_~@#$";
        var ch = "";
        for (var i = 0; i < s.length; i++) {
            ch = s.substr(i, 1);
            if (numStrs.indexOf(ch) != -1) {
                hasNum = true;
                break;
            }
        }
        for (var i = 0; i < s.length; i++) {
            ch = s.substr(i, 1);
            if (letterStrs.indexOf(ch) != -1) {
                hasLetter = true;
                break;
            }
        }
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

        if (pwd.length < 6) {
            return 0;
        }

        if ((!hasNum) && (!hasSymbol) && (pwd.length <= 8)) {
            return 1;
        }
        if ((!hasNum) && (!hasLetter) && (pwd.length <= 8)) {
            return 1;
        }

        if ((!hasNum) && (!hasSymbol) && (pwd.length >= 9)) {
            return 2;
        }
        if ((!hasNum) && (!hasLetter) && (pwd.length >= 9)) {
            return 2;
        }
        if ((hasNum) && (hasLetter) && (!hasSymbol) && (pwd.length <= 8)) {
            return 2;
        }
        if ((hasNum) && (!hasLetter) && (hasSymbol) && (pwd.length <= 8)) {
            return 2;
        }
        if ((!hasNum) && (hasLetter) && (hasSymbol) && (pwd.length <= 8)) {
            return 2;
        }
        return 3;
    };

    var level;
    var ncode;
    /* spwd = spwd.Trim(); */
    if (spwd == "") {
        level = 0;
        ncode = 1;
        return getReturnValue(level, ncode);
    }

    if (spwd.length < 6 || spwd.length > 20) {
        if (spwd.length < 6) {
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
        if (smppwd == dicpwd) {
            level = 0;
            ncode = 2;
            return getReturnValue(level, ncode);
        }
    }

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
    var isc = false;
    if (NotContains && NotContains.Account && (!isc)) {
        spwd2 = spwd;
        if (spwd2.indexOf(NotContains.Account) != -1) {
            isc = true;
        }
        spwd2 = spwd2.replaceAll(NotContains.Account, "");
    }
    if (NotContains && NotContains.Mobile && (!isc)) {
        spwd2 = spwd;
        if (spwd2.indexOf(NotContains.Mobile) != -1) {
            isc = true;
        }
        spwd2 = spwd2.replaceAll(NotContains.Mobile, "");
    }
    if (NotContains && NotContains.Alias && (!isc)) {
        spwd2 = spwd;
        if (spwd2.indexOf(NotContains.Alias) != -1) {
            isc = true;
        }
        spwd2 = spwd2.replaceAll(NotContains.Alias, "");
    }
    if (spwd2 && isc) {
        if (spwd2.length <= 3) {
            level = 0;
            ncode = 4;
            return getReturnValue(level, ncode);
        }
        //1.帐号/别名/手机号码 + 3位以内（包括3位）字符 返回不安全        提示"密码不能为手机帐号或别名帐号加上字符串联" 
        /*
        if (isChuanLian(spwd2)) {
        level = 0;
        ncode = 4;
        return getReturnValue(level, ncode);
        }
        */
    }

    if (!/\D/.test(spwd)) { //密码为纯数字
        level = 0;
        ncode = 5;
        return getReturnValue(level, ncode);
    }

    if (/.*[\u4e00-\u9fa5]+.*$/.test(spwd)) {
        level = 0;
        ncode = 6;
        return getReturnValue(level, ncode);
    }

    if (/[^A-Za-z0-9_~@#$\^]/.test(spwd)) {//包含特殊字符
        level = 0;
        ncode = 6;
        return getReturnValue(level, ncode);
    }

    if (isTooManyChuanLian(spwd)) { //太多字符串串联 n-1
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
 
/**
 * 密码校验组件，初始化方法
 * @param {String} id 密码框的id
 * @param {Object} obj  {noContains,message}
 *  noContains: js对象，可无限扩展，暂定义为：
 *	{
 *    Account : 'liyb',                  ----帐号不带@和域名 
 *    Mobile :  '13528745118',      		----不带86，可为空
 *    Alias : '别名'                      -----帐号不带@和域名  可为空
 *	}
 *  mesage: js对象，语言包提示信息对象 
 *  
 * @param 
 */
PwdCheck.init = function(id,obj){
	jQuery("#"+id).bind("propertychange", function(){
		PwdCheck.check(id,obj);
	}); 
	jQuery("#"+id).bind("input", function(){
		PwdCheck.check(id,obj);
	});
};

/**
 * 密码检测方法
 */
PwdCheck.check = function(id,obj) {
	var jq = jQuery;
    var op = jQuery("#"+id);
    var noContains = obj.noContains || {};
    var message = obj.message || {};
    var cb = obj.cb;
    var ret = PwdCheck(op.val(),noContains);
    var safeLevel = ret.SafeLevel;
    switch (safeLevel) {
	    case 0:
	        {
	            jq("#password_sp4").addClass("pwdOn");
	            jq("#password_sp1").removeClass("pwdOn");
	            jq("#password_sp2").removeClass("pwdOn");
	            jq("#password_sp3").removeClass("pwdOn");
	            break;
	        }
	    case 1:
	        {
	            jq("#password_sp4").removeClass("pwdOn");
	            jq("#password_sp1").addClass("pwdOn");
	            jq("#password_sp2").removeClass("pwdOn");
	            jq("#password_sp3").removeClass("pwdOn");
	            break;
	        }
	    case 2:
	        {
	            jq("#password_sp4").removeClass("pwdOn");
	            jq("#password_sp1").removeClass("pwdOn");
	            jq("#password_sp2").addClass("pwdOn");
	            jq("#password_sp3").removeClass("pwdOn");
	            break;
	        }
	    case 3:
	        {
	            jq("#password_sp4").removeClass("pwdOn");
	            jq("#password_sp1").removeClass("pwdOn");
	            jq("#password_sp2").removeClass("pwdOn");
	            jq("#password_sp3").addClass("pwdOn");
	            break;
	        }
	}

    var code = ret.NotifyCode;
    var msg = message[code];
    /*if (code == 0) {
        jq('#ErrorTip').hide();
    }else {
    	if(msg){
	    	jq('#ErrorTip').html(msg);
	    	jq('#ErrorTip').show();
    	}
    }*/
    if(typeof cb=="function"){
    	cb(code);
    }
    return code;
}; 
 
 
