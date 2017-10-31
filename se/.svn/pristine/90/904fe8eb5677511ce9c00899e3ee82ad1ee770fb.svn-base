/**
 * 通用数据验证类
 * @class
 * @author Dream
 */
var Vd = function(){};


/**
 * 限制文本框输入字符数
 * @param {string} id 文本框的id
 * @param {number} maxLen 输入的最大字符数
 * @param {string} tipId 余下字符数显示div的id
 * @param {boolean} isByte 是否按字节计算，默认按字符计算
 * @example
 * <code>
 * Vd.limitMaxInput("txtContent",20,"fontInputed",false);
 * </code>
 */
Vd.limitMaxInput = function(obj,maxLen,objTip,isByte,callBackFun){
	if(!obj||typeof(obj)!="object"){
		return;
	}
	var isCancelEnter = false;
	doLimit();
	if(window.Browser.value=="ie"&&window.Browser.version!=9){
		EV.observe(obj,"propertychange",doLimit);
	}else{
		EV.observe(obj,"input",doLimit);
		//EV.observe(obj,"change",doLimit);
		EV.observe(obj,"blur",doLimit); //发短信启用此绑定 by yulingchen
		//EV.observe(obj,"focus",doLimit);
	}
	EV.observe(obj,"keypress",cancelEnter);
	var objForm = El.getParentNodeIsTag(obj,"form");
    if (objForm) {
        EV.observe(objForm, "reset", function(){
            window.setTimeout(doLimit, 100);
        });
    }
	
	function doLimit(){
		var val = obj.value;
		var L =  (!isByte)?val.length:val.len();
		var L1 = 0;
		if(Browser.value=="firefox"){
			var v = val.replace(/\n/gi,"**");
			L = (!isByte)?v.length:v.len();
		}
		//if (window.Browser.value =="ie") {
			if (L == maxLen - 1) {
				isCancelEnter = true;
			}
			else {
				isCancelEnter = false;
			}
		//}
        if (L>maxLen){
			var strcontent = "";
			var ml = maxLen;
			if(Browser.value=="firefox"){
				var m = val.match(/\n[^$]/g);
				if(m){
					ml = maxLen - m.length;	
				}
			}
			if (isByte) {
				strcontent = val.left(ml);
			}else{
				strcontent = val.lefts(ml);
			}
            obj.value = strcontent;
			L1 = 0;
            //obj.blur();
        }else{
			L1 = maxLen - L;
			if (L1<0)
			{
				L1 = 0;
			}
		}
		if (objTip&&typeof(objTip) == "object") {
			objTip.innerHTML = L1;
			if (typeof(callBackFun) == "function")
		    {
		        callBackFun();
		    }
		}else if(typeof(objTip)=="function"){
			objTip(L1);
			return;
		}
	}
	
	function cancelEnter(e){
		if(isCancelEnter){
			if (EV.getCharCode(e) == 13){
				EV.stopEvent(e);
		    }
		}
	    return true;
	}
};

/***
 * 检查邮件地址是否正确
 * @param {Object} obj
 * @param {Object} isShowAlert
 * @param {Object} isReplace
 * @param {Object} callback
 */
Vd.CheckEmail = function(obj, isShowAlert, isReplace, callback){
    if (!obj || typeof(obj) != "object") {
        return;
    }
    var inputMail = obj.value.trim();
	
    var arrRight = [];
    var arrError = [];
    var arrRedundancy = [];    
    var objFocus = function(){
        obj.focus();  
    };
    
	//去除空白字符（回车,tab等）
	var reg1 = /[\r\n\t]/gi;
	inputMail = inputMail.replace(reg1,'');	
	//去除连续的分隔符
	var reg2 = /[,;，；]{2,}/gi;
	inputMail = inputMail.replace(reg2,',');	
    //去除末尾的;
    if (inputMail.substr(inputMail.length - 1) == ',') {
        inputMail = inputMail.substr(0, inputMail.length - 1);
    }
	if(!inputMail||inputMail==''){
		obj.value = inputMail;	
		return true;
	}
 
    var arrMail = inputMail.split(/[,;，；]/);
    //Email正则匹配
    var regEmail = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})$/i;
    for (var i = 0; i < arrMail.length; i++) {
        if (arrMail[i].trim().match(regEmail) === null) {
            arrError.push(arrMail[i]);
        }else {
            arrRight.push(arrMail[i]);
        }
    }
    if (arrError.length === 0) {
        //判断重复
        arrRedundancy = arrMail.strip().unique();
        if (arrRedundancy.length > 0) {
            if (isShowAlert) {
                msg = Lang.Mail.other_InputMailRepeat+"<br>" + arrRedundancy.join(',').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/,/g,'<br>');
                CC.alert(msg, null, Lang.Mail.sys_SystemInfo,objFocus);
            }
            if (isReplace) {
                obj.value = arrRight.unique().join(',');
            }
			if(callback && typeof(callback) != "function"){
				callback();
			}
            return false;
        }
        
    }else{
        if (isShowAlert) {
            msg = Lang.Mail.other_InputMailError+"<br>" + arrError.join(',').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/,/g,'<br>');
            CC.alert(msg, null, Lang.Mail.sys_SystemInfo,objFocus);
        }
        if (isReplace) {
            obj.value = arrRight.unique().join(',');
        }
		
		if(callback && typeof(callback) != "function"){
			callback();
		}
        return false;
    }
    return true;
    
};

/***
 * 检查数据
 * @param {Object} dt 数据类型
 * @param {Object} str 数据
 * @param {Object} regStr 字符串
 */
Vd.checkData = function(dt,str,regStr){
	str = str.trim();
	var reg = "";
	switch(dt) {
		case "email":
			reg = /^([A-Z0-9._%-]{1,255})@[A-Z0-9._%-]+\.[A-Z0-9]{1,4}$/i;
			break;
		case "mobile":
			reg = /^(0?86)?1[\d]{10}$/i;
			break;
		case "phone":
			reg = /^0[\d]{2,3}[\d]{7,8}$/i;
			break;
        case "empty":
            reg = /^.+/i;
			break;
        case "number":
		case "int":
            reg = /^[0-9]+$/i;
            break;
        case "domain":
            reg = /^[A-Z0-9._%-]+\.[A-Z0-9]{1,4}$/i;
            break;
		case "blackDomain":
			reg = /^(\*@)[A-Z0-9._%-]+\.[A-Z0-9]{1,4}$/i;
			break;		
		case "*@domain":
			reg = /^(\*@)[A-Z0-9._%-]+\.[A-Z0-9]{1,4}$/i;
			break;
		case "@domain":
			reg = /^(@)[A-Z0-9._%-]+\.[A-Z0-9]{1,4}$/i;
			break;
        case "port":
        	if(str>0 && str<65535){
        		return true;
        	}else{
        		return false;
        	}
        	break;
        case "reg":
            reg = regStr;
            break;
        case "custom":
            reg = new RegExp(regStr,"gi");
            break;
	}
    try{
    	if (reg) {
    		return reg.test(str);
    	}else{
    		return false;
    	}
    }catch(e){
        return false;
    }
};

/**
 * 替换邮箱地址或手机号码中的分隔符
 * @param {Object} str
 */
Vd.replaceEmail = function(str){
	if(!str){
		return "";
	}
	var ma = [];
	var m = str.replace(/\r\n|\n|\s/g,"");
	//替换 "wsp" <fanwsp@126.com> 这类邮件地址为：fanwsp@126.com
    m = m.replace(/".*?"|[<>]/gi,"");
	//将;替换成,  并将连续1个以上的,替换成一个,将中文分隔替换成英文 
	m = m.replace(/[;,]{2,}]|[；，]/g, ",");
	//将最前面，和最后的,替换成""
	m = m.replace(/^,|,$/g,"");
	var temp = m.split(",");
	temp = temp.unique();
	temp.each(function(i,v){
		if(Vd.checkData("email",v)){
			ma[i] = v;
		}
	});
    return ma.join(",");    
};



Vd.getMailList = function(str){
	var ma = [];
	if(!str){
		return ma;
	}
	m = Vd.replaceEmail(str);
	var temp = m.split(",");
	temp = temp.unique();
	temp.each(function(i,v){
		if(Vd.checkData("email",v)){
			ma[i] = v;
		}
	});
    return ma;    
};
//移动手机号码的正则
Vd.checkMobile = function(str){
	var mobileType= gMain.mobileTypec || "1";
	var reg;
	//0:所有手机号码  1:移动 2:电信 4:联通
	if (mobileType=="0") {			//0:所有手机号码
		reg = /^(86)?((13[0-9])|(15[0-9])|(18[0-9])|(14[0-9]))+\d{8}$/;
	} else if (mobileType=="1") {
		reg = /^(86)?((13[4-9]{1})|(15[0-2 7-9]{1})|(18[2 7-8]{1}))+\d{8}$/;
	} else if (mobileType=="2") {
		reg = /^(86)?((13[3]{1})|(15[3]{1})|(18[9]{1}))+\d{8}$/;
	} else if (mobileType=="4") {
		reg = /^(86)?((13[0-2]{1})|(15[5-6]{1})|(18[6]{1}))+\d{8}$/;
	} else {
		reg = /^(86)?((13[4-9]{1})|(15[0-2 7-9]{1})|(18[2 7-8]{1}))+\d{8}$/;
	}
    return reg.test(str);
};

Vd.getMobileList = function(){
	
};

/***
 * 检查Url正确性
 * @param {Object} url
 */
Vd.checkUrl = function(url){
	url = url||'';
    var reg = /^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]':+!]*([^<>\"\"])*$/;
    if (reg.test(url)) {       
        return true;
    }
    else {        
        return false;        
    }
};
/***
 * 返回RM接口参数域名,如：*@richinfo.cn
 * @param {Object} str
 */
Vd.getRmDomain = function(str){
	if(this.checkData("*@domain",str)){
		return str;
	}	
	if(this.checkData("@domain",str))
	{
		return "*"+str;
	}	
	if(this.checkData("domain",str)){
		return "*@"+str;
	}
	
	return str;
	
};



















