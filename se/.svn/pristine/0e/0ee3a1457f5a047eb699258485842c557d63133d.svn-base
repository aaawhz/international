var face = new OptionBase();

face.attrs = {
	id : 'face',
	authority: 'MAIL_CONFIG_FACE',
    free: true,
    divId:"pageFaceset",
    list:{type:"url",func:gConst.func.getAttrs},//获取数据/列表时指令，数据  gConst.func.getAttrs
    // save:{func:gConst.func.setAttrs},
    tableClass:"faceWidth"			
};

face.init = function(id){
	var p   = this;
	
    p.request(p.attrs);
   // p.beforeLang = p.getFormatValue("language");
	p.initEvent();
};

face.getHtml = function(attr, values){
	var p = this;
	var getAddHtml = function(){
		var html = [];
	
		html.push("<div>");
		html.push("<h2 class=\"set_til\"> "+Lang.Mail.ConfigJs.faceset+"<span>");
		html.push("( "+Lang.Mail.ConfigJs.choiseFavoriteFace+"："+" )</span></h2>");
		html.push("<div class=\"codeSet-wrap\" id='codeSet'>");
		html.push("<ul class=\"parameter-ul pt_10\">");
		//简体中文
		html.push("<li class=\"pl113\">")
		html.push("<input id=\"simpleChinese\" class=\"rm_cb\" type=\"radio\" ");
		html.push("value=\"zh_CN\" name=\"faceSet\">");
		html.push("<label for=\"simpleChinese\"> "+Lang.Mail.ConfigJs.simpleC+"</label></li>");
		html.push("<li class=\"pl113 pb_15\"></li>");
	
		//繁体中文
		html.push("<li class=\"pl113\">")
		html.push("<input id=\"traditionalChinese\" class=\"rm_cb\" type=\"radio\" ");
		html.push("value=\"zh_TW\" name=\"faceSet\">");
		html.push("<label for=\"traditionalChinese\">  "+Lang.Mail.ConfigJs.ft+"</label></li>");
	    html.push("<li  class=\"pl155 pb_15\" ></li>");
		//英文
		html.push("<li class=\"pl113\">")
		html.push("<input id=\"english\" class=\"rm_cb\" type=\"radio\" ");
		html.push("value=\"en_US\" name=\"faceSet\">");
		html.push("<label for=\"english\"> "+Lang.Mail.ConfigJs.en+"</label></li></ul>");
		
		html.push("</div><!--codeSet-wrap-->");
		html.push("<div class=\"btm_pager fl\" style='width:100%'>");
		html.push("<a id='save' class=\"n_btn_on mt_5 ml_10\"><span>");
		html.push("<span>"+Lang.Mail.ConfigJs.save +"</span></span></a>");
		html.push("<a id='cancel' class=\"n_btn mt_5\"><span>");
		html.push("<span>"+Lang.Mail.ConfigJs.cancelTip +"</span></span></a>");
		html.push("</div>");

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
    html.push("</div></div></div>");
    MM[gConst.setting].update(password.attrs.id, html.join(""));
	password.updatePosition();
	
	p.initEvent();
}
face.initEvent = function(){
	var p		= this,
		$		= jQuery;
	
	$("#save").click(function(){
		p.ajax_faceSave();
	});	
	
	$("#cancel").click(function(){
		p.goBack();
	});
	
	if(window.gMain && gMain.lang){
		$(":radio[name='faceSet'][value='"+gMain.lang+"']").attr("checked",true);	
		p.beforeLang = gMain.lang;
	}
	
	p.updatePosition();

};

face.ajax_faceSave = function(){
	var p		= this,
		$		= jQuery,
		val		= "",
		func	= gConst.func.setAttrs_us,
		data	= "",
		url		= gConst.mailUlr_us,
		fnSuc	= null,
		fnFail  = null;
	
	val = $(":radio[name=faceSet][checked]").val();
	data = {language:val};
		
	fnSuc = function(){

		CC.showMsg(Lang.Mail.ConfigJs.facesetSave, true, false, "option"); //"您的界面设置已保存"
		p.lang = val;
		p.saveAfter();
	};	
	
	fnFail = function(){
		CC.showMsg(Lang.Mail.ConfigJs.facefailsave,true,false,"error");//"界面保存失败"
	};
						
	pref.doService(func,data,fnSuc,fnFail,url);	
};

face.saveAfter = function(resp){
    try {
        var p = this;
       // var lang = this.getFormatValue("language");
        //gMain.lang = lang;
		//如果
        if(p.lang != p.beforeLang){
			if(window.gMain){
				gMain.lang = p.lang;
				GC.setCookie("lang"+gMain.sid,p.lang,"/",gMain.mainDomain);
        		top.location.reload(); 
			}	
		}
 
    }catch(e){}
};


