//admin_common 
//后续管理员平台公共js在写在此文件里面
//请按以下格式书写，并要求写好注释
var AC = {
	page:{
		psKey:"pageSize",
		pnKey:"pageNo",
		preKey:"_pre",
		sufKey:"_suf"
	},
	
	appendParam:function(url,param,isrand){
		var sp = [];
		var join = "?";
		if (url.indexOf("?") > 0) {
			join = "&";
		}
		if(param){
			for(var n in param){
				if(param[n]){
					sp.push(n + "=" + encodeURI(param[n]));
				}
			}	
		}
		if(sp.length>0){
			url += join + sp.join("&");
		}
		if(isrand){
			url = AC.getRandUrl(url);
		}
		return url;
	},
	getRand:function() {
		var now = new Date();
		var rnd = Math.random() + "," + now.getMilliseconds();
		return rnd;
	},
	getRandUrl: function(src) {
		var rnd = AC.getRand();
		if (src.indexOf("&rnd=") > 0) {
			src = src.substr(0, src.indexOf("&rnd="));
			src += "&rnd=" + rnd;
		} else if (src.indexOf("?rnd=") > 0) {
			src = src.substr(0, src.indexOf("?rnd="));
			src += "?rnd=" + rnd;
		}
		return src;
	},
		
	/**
	 * 通用删除方法
	 * @param url 要删除的url
	 * @param msg 删除前提示信息
	 * @param successBack 删除成功回调方法
	 * @param errorBack 删除失败回调方法
	 */
	deleteObj:function(url,msg,successBack,errorBack){
		if(confirm(msg)==true){
			jQuery.ajax({
				type: "get",
				dataType:"json",
				url: url,
				success: successBack,
				error: errorBack
			});
		}
	},
	
	/**
	 * 根据正则表达式校验某个值
	 * @param reg 正则列表，数组
	 * @param val 需要验证数值
	 */
	checkByRegx : function(reg,val){
		var i=0;
		for(i=0;i<reg.length;i++){
			var regex = new RegExp(reg[i]);
			if(regex.test(val)){
				return true;
			}
		}
		return false;
	},
	/**
	 * 
	 * @param 分页标签id
	 * @param 跳转的url地址
	 * @param url附件参数
	 */
	doPage:function(id,url,pn,param){
		var ps=$("#"+id+this.page.preKey).val() || 0;
		pn = (typeof pn == "number")?pn:$("#"+id+this.page.sufKey).val() || 0;
		url = url || location.href;
		var paramObj = {};
		paramObj[this.page.psKey] = ps;
		paramObj[this.page.pnKey] = pn;
		url = this.appendParam(url, paramObj);
		url = this.appendParam(url, param);
		window.location.href = url;
	},
	
	/**
	 * 往目标url后面加上当前页面的参数并跳转
	 * @param desUrl 目标url
	 */
	joinParamForward : function (desUrl) {
		var p = this;
		var param = {};
		param[p.page.psKey] = p.getParamter(p.page.psKey);
		param[p.page.pnKey] = p.getParamter(p.page.pnKey);
		
		desUrl = p.appendParam(desUrl, param);
		window.location.href = desUrl;
		return false;
	},
	
	/**
	 * 返回指定参数名的值
	 * @param param 参数名
	 */
	getParamter : function(param) {
		var url = window.location.href;
		var reg = new RegExp("(^|&|\\?|\\s)"+param+"\\s*=\\s*([^&]*?)(\\s|&|$)","i");  
		var match = reg.exec(url); 
		if (match) {
			return match[2].replace(/[\x0f]/g, ";");
		}
		return "";  
	},
	goUrl:function(url){
		window.location.href = url;
	},
	doSelectJump:function(obj,name){
		var v = $(obj).val();
		var url = location.href;
		var reg = new RegExp("&"+name+"\\s*=\\s*([^&]*?)(\\s|&|$)","i");
		var match = reg.exec(url); 
		var pm = {};
		pm[name] = v;
		if(match){
			url = url.replace(reg, "&" + name +"=" + v);
		}else{
			url = AC.appendParam(url,pm);
		}
		location.href = url;
	}
};



