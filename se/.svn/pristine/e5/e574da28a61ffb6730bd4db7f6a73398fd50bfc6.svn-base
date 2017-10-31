;
(function($){
	var antiGarbage = new OptionBase();
	
	antiGarbage.attrs = {
	    id : 'antiGarbage',
	    authority: 'MAIL_CONFIG_ANTIVIRU',
	    divId:'pageAntiGarbage',
		//noReq: true,
		list: {
			type: "url",
			func: gConst.func.getAttrs
		}, //获取数据/列表时指令，数据 
		save: {
			func: gConst.func.setAttrs
		}
	};
	antiGarbage.init = function(){
	    this.request(this.attrs);
	};
	antiGarbage.getHtml = function(attrs, values){
	
	    var html = [];
	    var p = this;
		var addHtml = p.getInitHtml();
		
	    html.push("<div class=\"bodySet\" style='align:text;' id=\"pageAntiGarbage\">");
	    html.push("<div id=\"container\">"); 
	    html.push(this.getTopHtml());           //加载顶部的菜单栏
	    html.push(this.getLeftHtml());          //加载左侧的菜单栏
	    // html.push(this.getNavMenu(p.attrs.id));
	    html.push("<div class=\"setWrapper\" id='setWrapp'>");
		html.push(addHtml);                     //加载具体内容页面
		
		//加载底部 按钮
	    html.push("<div class=\"btm_pager pl_10 percent100\" id=''>");
		html.push("<a id=\"g_save\" class=\"n_btn_on mt_5\" href=\"javascript:void(0);\">");
		html.push("<span><span>"+Lang.Mail.ConfigJs.save  +"</span></span></a>");
		html.push("<a class=\"n_btn mt_5\" id=\"g_cancel\">");
		html.push("<span><span>"+Lang.Mail.ConfigJs.cancelTip+"</span></span></a>");
		html.push("</div></div></div>");
	    
	    MM[gConst.setting].update(p.attrs.id, html.join(''));
		pref.updatePosition("setWrapp");
		p.correctWidthInIE6("setWrapp",1);
		p.initEvent(values);
	};
	
	antiGarbage.initEvent = function(values){
		var p = this;
		
		//初始化选项
		p.initOptions(values);
		
		//绑定方法
		$("#g_save").click(function(){
			p.save();
		});
		
		$("#g_cancel").click(function(){
			p.goBack();
		});
		
		//变灰
		$(":radio[name=spam_level]").click(function(){
			p.setGray();
		});
	};
	
	antiGarbage.setGray = function(){
		if($("#spam_level1").is(":checked")){
			$(":radio[name=spam_deal]").attr("disabled","disabled");
		}else{
			$(":radio[name=spam_deal]").attr("disabled",false);
		}
	};
	
	/**
	 * 根据后台返回值 重置
	 * @param {Object} values
	 */
	antiGarbage.initOptions = function(values){
		var p  = this;
		
		if(!values){return;}
		
		if(typeof values.spam_level != undefined){
			$("#spam_level"+values.spam_level).attr("checked","checked");
			
			if(values.spam_level == 1){
				p.setGray();
			}
		}
		
		if(typeof values.spam_deal != undefined){
			$("#spam_deal"+values.spam_deal).attr("checked","checked");
		}
	};
	
	antiGarbage.save = function(){
		
		var p = this;
		
		var postData = {
			"attrs":{
				"spam_level": $(":radio[name=spam_level][checked]").val(),
				"spam_deal": $(":radio[name=spam_deal][checked]").val()
			}
		};
		
		var fnCb = function(){
			CC.showMsg(Lang.Mail.ConfigJs.settingSuc, true, false, "option");
			p.init();
		};
		
		var fnFail = function(){
			pref.fail(Lang.Mail.ConfigJs.setParaFail);
		};
		
		p.ajaxRequest(p.attrs.save.func,postData,fnCb,fnFail);
		
	};
	
	antiGarbage.getInitHtml = function(){
		var html = []
		
        html.push("<div class=\"bwSet\" >"); 
        html.push("<h2 class=\"set_til\">");
        html.push(Lang.Mail.ConfigJs.fanlaji);
        html.push("</h2>");
		
		 //反垃圾判断的方法
		html.push("<div class=\"parameter-wrap\"><ul class=\"parameter-ul pt_10\">");
		html.push(" <li class=\"m_clearfix\">");
		html.push("<span class=\"parameter-til\">"+Lang.Mail.ConfigJs.panway +"</span>");
		
		//宽松--使用默认的反垃圾设置
		html.push("<div class=\"parameter-conBox\">");
		html.push("<input type=\"radio\" name='spam_level' id='spam_level1' class=\"rm_cb\" value='1'>");
		html.push("<label for='spam_level1'> "+Lang.Mail.ConfigJs.loose +"</label>");
		html.push("<font class='tips-default-color pl10'>"+Lang.Mail.ConfigJs.spamSet +"</font>");
		html.push("<em class=\"red-commend\">（" + Lang.Mail.ConfigJs.index_recommend + "）</em>");
		html.push("</div></li>");
		
		//留间隙
		html.push("<li class='pb_15'></li>");
		html.push("<li class='pb_15'></li>");
		
		//一般--我不在“收件人”或“抄送”里，且“发件人”不在我的白名单里，就判断为垃圾邮件
		html.push("<li class=\"pl_155 next-li\">");
		html.push("<input type=\"radio\" class=\"rm_cb\" name='spam_level' id='spam_level2' value='2'>");
		html.push("<label  for='spam_level2'>  "+Lang.Mail.ConfigJs.soso +"</label>");
		html.push("<font class='tips-default-color pl10'>"+Lang.Mail.ConfigJs.soso_spamTip +"</font>");
		html.push("</li>");
		
		//留间隙
		html.push("<li class='pb_15'></li>");
		html.push("<li class='pb_15'></li>");
		
		//严格---发件人”不在我的白名单里，就判断为垃圾邮件
		html.push("<li class=\"pl_155 next-li\" >");
		html.push("<input type=\"radio\" name='spam_level' id='spam_level3' class=\"rm_cb\" value='3'>");
		html.push("<label  for='spam_level3'>  "+Lang.Mail.ConfigJs.strict +"</label>");
		html.push("<font class='tips-default-color pl10'> "+Lang.Mail.ConfigJs.strict_spamTip  +"</font>");
		html.push("</li>");
	
		html.push("</ul>");
		
        html.push("</div>");
		
		//处理方式
		html.push("<div class=\"parameter-wrap\" style=\"border-bottom:none;\"><ul class=\"parameter-ul pt_10\">");
		html.push(" <li class=\"m_clearfix\">");
		html.push("<span class=\"parameter-til\">"+Lang.Mail.ConfigJs.cliWay  +"</span>");
		
		//宽松--使用默认的反垃圾设置
		html.push("<div class=\"parameter-conBox\">");
		html.push("<input type=\"radio\" name='spam_deal' id='spam_deal1' class=\"rm_cb\" value='1'>");
		html.push("<label for='spam_deal1'> "+Lang.Mail.ConfigJs.jieshou +"</label>");
		html.push("<font class='tips-default-color pl10'>"+Lang.Mail.ConfigJs.jieshou_tip +"</font>");
		html.push("</div></li>");
		
		//留间隙
		html.push("<li class='pb_15'></li>");
		html.push("<li class='pb_15'></li>");
		
		//一般--我不在“收件人”或“抄送”里，且“发件人”不在我的白名单里，就判断为垃圾邮件
		html.push("<li class=\"pl_155 next-li\">");
		html.push("<input type=\"radio\" class=\"rm_cb\" name='spam_deal' id='spam_deal2' value='2'>");
		html.push("<label  for='spam_deal2'>  "+Lang.Mail.ConfigJs.jushou +"</label>");
		html.push("</li>");
		
		//留间隙
		html.push("<li class='pb_15'></li>");
		html.push("<li class='pb_15'></li>");
	
		html.push("</ul>");
		
		
        html.push("</div>");
		
        return html.join("");
	};
	
	
	window.antiGarbage = antiGarbage;
})(jQuery);

