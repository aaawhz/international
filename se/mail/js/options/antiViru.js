/**
 * @author Administrator
 */
;
(function($){
	var antiViru = new OptionBase();
	
	antiViru.attrs = {
	    id : 'antiViru',
	    authority: 'MAIL_CONFIG_ANTIVIRU',
	    divId:'pageAntiViru',
		//noReq: true,
		list: {
			type: "url",
			func: gConst.func.getAttrs
		}, //获取数据/列表时指令，数据 
		save: {
			func: gConst.func.setAttrs
		}
	};
	antiViru.init = function(){
	    this.request(this.attrs);
	};
	antiViru.getHtml = function(attrs, values){
	
	    var html = [];
	    var p = this;
		var addHtml = p.getInitHtml();
		
	    html.push("<div class=\"bodySet\" style='align:text;' id=\"pageantiViru\">");
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
	
	antiViru.initEvent = function(values){
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
		$(":radio[name=virus_status]").click(function(){
			p.toggleOption();
		});
	};
	
	/**
	 * 显示|隐藏 选项
	 */
	antiViru.toggleOption = function(){
		if($("#virus_status0").is(":checked")){
			$("#virus_notify_me,#virus_notify_send")
			.attr("disabled","disabled");
			
			$(":radio[name=virus_sucess],:radio[name=virus_fail],:radio[name=virus_doubt]")
			.attr("disabled","disabled");
			
			$("#scanDiv").css({"border-bottom":"none"});
			$("#option_virus").hide();
		}else{
			$("#virus_notify_me,#virus_notify_send")
			.attr("disabled",false);
			
			$(":radio[name=virus_sucess],:radio[name=virus_fail],:radio[name=virus_doubt]")
			.attr("disabled",false);
			
			$("#scanDiv").css({"border-bottom":"1px dashed #E4E4E4"});
			$("#option_virus").show();
		}
		
		
		
		
	};
	
	/**
	 * 根据后台返回值 重置
	 * @param {Object} values
	 */
	antiViru.initOptions = function(values){
		var p  = this;
		
		if(!values){return;}
		
		/*
		"virus_status": $(":radio[name=virus_status][checked]").val(),
		"virus_sucess": $(":radio[name=virus_sucess][checked]").val(),
		"virus_fail": $(":radio[name=virus_fail][checked]").val(),
		"virus_doubt": $(":radio[name=virus_doubt][checked]").val(),
		"virus_notify_me": ($("#irus_notify_me").is(":checked")? 1 : 0),
		"virus_notify_send": ($("#virus_notify_send").is(":checked")? 1 : 0)
		*/
		
		if(typeof values.virus_status != undefined){
			$("#virus_status"+values.virus_status).attr("checked","checked");
			
			if(values.virus_status == 0){
				p.toggleOption();
			}
		}
		
		if(typeof values.virus_sucess != undefined){
			$("#virus_sucess"+values.virus_sucess).attr("checked","checked");
		}
		
		if(typeof values.virus_fail != undefined){
			$("#virus_fail"+values.virus_fail).attr("checked","checked");
		}
		
		if(typeof values.virus_doubt != undefined){
			$("#virus_doubt"+values.virus_doubt).attr("checked","checked");
		}
		
		if(typeof values.virus_notify_me != undefined){
			if(values.virus_notify_me == 1){
				$("#virus_notify_me").attr("checked","checked");
			}
		}
		
		if(typeof values.virus_notify_send != undefined){
			if(values.virus_notify_send == 1){
				$("#virus_notify_send").attr("checked","checked");
			}
		}
		
	
	};
	
	antiViru.save = function(){
		
		var p = this;
		
		var postData = {
			"attrs":{
				"virus_status": $(":radio[name=virus_status][checked]").val(),
				"virus_sucess": $(":radio[name=virus_sucess][checked]").val(),
				"virus_fail": $(":radio[name=virus_fail][checked]").val(),
				"virus_doubt": $(":radio[name=virus_doubt][checked]").val(),
				"virus_notify_me": ($("#virus_notify_me").is(":checked")? 1 : 0),
				"virus_notify_send": ($("#virus_notify_send").is(":checked")? 1 : 0)
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
	
	antiViru.getInitHtml = function(){
		var html = []
		
        html.push("<div class=\"bwSet\" >"); 
        html.push("<h2 class=\"set_til\">");
        html.push(Lang.Mail.ConfigJs.virusMail );
        html.push("</h2>");
		
		 //扫描来信病毒
		html.push("<div class=\"parameter-wrap\" id=\"scanDiv\"><ul class=\"parameter-ul pt_10\">");
		html.push(" <li class=\"m_clearfix\">");
		html.push("<span class=\"parameter-til\">"+Lang.Mail.ConfigJs.scanVirus  +"</span>");
		
		//关闭
		html.push("<div class=\"parameter-conBox\">");
		html.push("<input type=\"radio\" name='virus_status' id='virus_status0' class=\"rm_cb\" value='0'>");
		html.push("<label for='virus_status0'> "+Lang.Mail.ConfigJs.set_sessionMode_off+"</label>");
		html.push("</div></li>");
		
	
		//开启
		html.push("<li class=\"pl_155 next-li\">");
		html.push("<input type=\"radio\" class=\"rm_cb\" name='virus_status' id='virus_status1' value='1'>");
		html.push("<label  for='virus_status1'>  "+Lang.Mail.ConfigJs.set_sessionMode_on+"</label>");
		html.push("</li>");
	
		html.push("</ul>");
		
        html.push("</div>");
		
		//关闭，开启  来显示或者隐藏
		html.push("<div id=\"option_virus\">");
		 //杀毒成功时
		html.push("<div class=\"parameter-wrap\"><ul class=\"parameter-ul pt_10\">");
		html.push(" <li class=\"m_clearfix\">");
		html.push("<span class=\"parameter-til\">"+Lang.Mail.ConfigJs.shaduSuc +"</span>");
		
		//删除邮件
		html.push("<div class=\"parameter-conBox\">");
		html.push("<input type=\"radio\" name='virus_sucess' id='virus_sucess3' class=\"rm_cb\" value='3'>");
		html.push("<label for='virus_sucess3'> "+Lang.Mail.ConfigJs.deletem +"</label>");
		html.push("</div></li>");
		
		
		
		//清除病毒
		html.push("<li class=\"pl_155 next-li\">");
		html.push("<input type=\"radio\" class=\"rm_cb\" name='virus_sucess' id='virus_sucess1' value='1'>");
		html.push("<label  for='virus_sucess1'>  "+Lang.Mail.ConfigJs.deletev +"</label>");
		html.push("</li>");
		
	
		//不处理
		html.push("<li class=\"pl_155 next-li\" >");
		html.push("<input type=\"radio\" name='virus_sucess' id='virus_sucess2' class=\"rm_cb\" value='2'>");
		html.push("<label  for='virus_sucess2'>  "+Lang.Mail.ConfigJs.nodo +"</label>");
		html.push("</li>");
	
		html.push("</ul>");
		
        html.push("</div>");
		
		 //杀毒失败时
		html.push("<div class=\"parameter-wrap\"><ul class=\"parameter-ul pt_10\">");
		html.push(" <li class=\"m_clearfix\">");
		html.push("<span class=\"parameter-til\">"+Lang.Mail.ConfigJs.shaduFail  +"</span>");
		
		//作为EML附件接收
		html.push("<div class=\"parameter-conBox\">");
		html.push("<input type=\"radio\" name='virus_fail' id='virus_fail1' class=\"rm_cb\" value='1'>");
		html.push("<label for='virus_fail1'> "+Lang.Mail.ConfigJs.emlAttach +"</label>");
		html.push("</div></li>");
		
		
		
		//删除邮件
		html.push("<li class=\"pl_155 next-li\">");
		html.push("<input type=\"radio\" class=\"rm_cb\" name='virus_fail' id='virus_fail3' value='3'>");
		html.push("<label  for='virus_fail3'>  "+Lang.Mail.ConfigJs.deletem +"</label>");
		html.push("</li>");
		
	
		//不处理
		html.push("<li class=\"pl_155 next-li\" >");
		html.push("<input type=\"radio\" name='virus_fail' id='virus_fail2' class=\"rm_cb\" value='2'>");
		html.push("<label  for='virus_fail2'>  "+Lang.Mail.ConfigJs.nodo +"</label>");
		html.push("</li>");
	
		html.push("</ul>");
		
        html.push("</div>");
		
		 //无法判断时
		html.push("<div class=\"parameter-wrap\"><ul class=\"parameter-ul pt_10\">");
		html.push(" <li class=\"m_clearfix\">");
		html.push("<span class=\"parameter-til\">"+Lang.Mail.ConfigJs.doubt  +"</span>");
		
		//作为EML附件接收
		html.push("<div class=\"parameter-conBox\">");
		html.push("<input type=\"radio\" name='virus_doubt' id='virus_doubt1' class=\"rm_cb\" value='1'>");
		html.push("<label for='virus_doubt1'> "+Lang.Mail.ConfigJs.emlAttach +"</label>");
		html.push("</div></li>");
		
		
		
		//删除邮件
		html.push("<li class=\"pl_155 next-li\">");
		html.push("<input type=\"radio\" class=\"rm_cb\" name='virus_doubt' id='virus_doubt3' value='3'>");
		html.push("<label  for='virus_doubt3'>  "+Lang.Mail.ConfigJs.deletem +"</label>");
		html.push("</li>");
		
	
		//不处理
		html.push("<li class=\"pl_155 next-li\" >");
		html.push("<input type=\"radio\" name='virus_doubt' id='virus_doubt2' class=\"rm_cb\" value='2'>");
		html.push("<label  for='virus_doubt2'>  "+Lang.Mail.ConfigJs.nodo +"</label>");
		html.push("</li>");
	
		html.push("</ul>");
		
        html.push("</div>");
		
		
		//处理结果
		html.push("<div class=\"parameter-wrap\" style=\"border-bottom:none;\"><ul class=\"parameter-ul pt_10\">");
		html.push(" <li class=\"m_clearfix\">");
		html.push("<span class=\"parameter-til\">"+Lang.Mail.ConfigJs.chulijg  +"</span>");
		
		//通知我处理结果
		html.push("<div class=\"parameter-conBox\">");
		html.push("<input type=\"checkbox\" name='virus_notify_me' id='virus_notify_me' class=\"rm_cb\">");
		html.push("<label for='virus_notify_me'> "+Lang.Mail.ConfigJs.noMe +"</label>");
		html.push("</div></li>");
		
		
		//通知发件人处理结果
		html.push("<li class=\"pl_155 next-li\">");
		html.push("<input type=\"checkbox\" class=\"rm_cb\" name='virus_notify_send' id='virus_notify_send'>");
		html.push("<label  for='virus_notify_send'>  "+Lang.Mail.ConfigJs.nosender +"</label>");
		html.push("</li>");
		
		html.push("</ul>");
		
        html.push("</div>");
		
		html.push("</div>");
		//显示，隐藏 div  end
		
        return html.join("");
	};
	
	
	window.antiViru = antiViru;
})(jQuery)