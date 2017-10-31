/**
 * @author Dream
 * 主要是对 全文搜索的封装
 */
var Main = {	
	dropSelectFolder : null,
	dropSelectTime : null,
	dropSelectReadStatus : null,
	curSelectedLi : 0,
	liList : null,
	searchKeyStr : "",
    init: function checkEpLogo(){
        Main.initLoad();		
    },
    initLoad: function(){
        Main.initSearch();
        control_Init();	
		Main.initAdvSearchHTML();	
		Main.initHideAdvSearch();	
		Main.initControl();
		Main.initAdvSearch();
		Main.initAdvEvent();
    },	
	/***
	 * 加载邮件搬家状态
	 */
	initMailMoveStatus : function(){
		if (GC.check("MAIL_VAS_MOVE") == 1 && gMain.mailMoveEnable == "1") {
			var data = {};
			var postData = {
				func: "user:queryMoveStatus",
				data: data,
				call: function(d){
					if (d["var"] && d["var"].length > 0) {
						if (d["var"][0].status == 0 && d["var"][0].fromUser == "") {
							Main.showMailMoveDiv();
						}
					}
					else {
						Main.showMailMoveDiv();
					}
				},
				failCall: function(){
				//CC.showMsg(Lang.Mail.advSearch_OnNo,true,false,"option");
				}
			}
			MM.mailRequestApi(postData);
		}
	},	
	/***
	 * 加载邮件搜索单击事件
	 */
	initHideAdvSearch : function(){
		EV.observe(window.document, "click", Main.doHideAdvSearch);
	},
	/***
	 * 隐藏邮件搜索DIV
	 */
	doHideAdvSearch: function(){   
		
		var $ = jQuery;     
        if (!Main.IsShowAdvSearch) {
            //jQuery("#divAdvSearch").hide();
            Main.HideAdvDiv();
        }
		if(Main.IsShowAutoSearch) Main.HideAdvAutoDiv();
			//jQuery("#divSearchAutoComplete").attr("class","menuPop shadow mailSearchboolBar hide");
		//Main.OpSelect();
        Main.IsShowAdvSearch = false;
		Main.IsShowAutoSearch = true;
	
	},

	/***
	 * 弹出邮件搬家DIV
	 * @param {Object} callfunc 邮件搬家页面的回调函数
	 */
	showMailMoveDiv:function(callfunc){
		var p = this;
		var html = [];
		var mailTipTop = 90;
		var pwdTipTop = 133;
		var title =Lang.Mail.ConfigJs.MailMove_Title; //'邮件搬家';
		html.push('<div style="padding:20px 0 30px 40px">');
        html.push('    {0};<br />'.format(Lang.Mail.ConfigJs.MailMove_StratMove));
		/*
		 * 助您导入{0}的邮件
		 *  var langconf={
	        	crop_addr:"企业通讯录",
	        	notice:"企业公告",
	        	driver:"企业盘",
	        	pre_crop_mail:"原企业邮箱"
    		};
		 */
		
		if(typeof langconf != 'undefined'){
			html.push((Lang.Mail.ConfigJs.MailMove_importMail+'<br />').format(langconf.pre_crop_mail));
		}
		
		html.push('	{0}:<br />'.format(Lang.Mail.ConfigJs.MailMove_inputUser));
		if (window.gMain && gMain.domain && gMain.popAccountType && parseInt(gMain.popAccountType, 10)) {
			//Lang.Mail.ConfigJs.cannotDomain.format
			//html.push('(注：账号不能带"@{0}")</br></br>'.format(gMain.domain));
		}else{
			html.push("</br>");
			mailTipTop = 110;
			pwdTipTop = 145;
		}
       	html.push('    {0}：<input type="text" id="txtOldMail" style="width:150px" maxlength="50" class="text" value=""/><br /><br />'.format(Lang.Mail.ConfigJs.MailMove_oldMail));
            
        html.push('    {0}：<input type="password" id="txtOldMailPwd" style="width:150px" maxlength="50" class="text" value=""/>'.format(Lang.Mail.ConfigJs.MailMove_oldPwd));
        
	   
	    html.push('</div>');
		
		/**
		 *点击 [确定] 回调函数 
		 */
		var callback = function(){
			var user = $("txtOldMail").value.trim();
			var pwd = $("txtOldMailPwd").value.trim();
			var uerId = "";
			var userName = "";
			
            p.toolTip_MailMoveUser = new ToolTips({
                id: "toolTip_MailMoveUser",
                direction: ToolTips.direction.Top,
                top: mailTipTop,
                left: 112
                //closeTime : 10000,
                //left: 511,
                //top: -44
            });
            p.toolTip_MailMovePwd = new ToolTips({
                id: "toolTip_MailMovePwd",
                direction: ToolTips.direction.Top,
                top: pwdTipTop,
                left: 112
                //closeTime : 10000,
                //left: 511,
                //top: -44
            });
			
			//如果没有填写要搬家的邮箱	
			if(!user){				
				p.toolTip_MailMoveUser.show($("txtOldMail"),Lang.Mail.Write.pleaseInputAddr);
				return true;
			}

		    /*
		     * 这是标准版的, 无需兼容OA邮箱, 所有的搬家暂定, 只能搬名字和当前用户一种的旧邮箱
		     * 比如当前是 admin@se.com; 需要搬 @rich.com 这个域的邮箱, 
		     * 只能搬 admin@rich.com , 不能搬 aaw@rich.com, cc@rich.com 等
		     * 邮箱名必须是 admin,   gMain.uid 是用户输入的
		     */
		     userId = top.gMain ? top.gMain.uid : "";
		     
		     if(userId.indexOf("@") > -1){
		     	userId = userId.substring(0, userId.indexOf("@"));
		     }
		     
		     //如果输入的搬家邮箱账号, 不是当前登录的邮箱账号 (名字必须一种, 域名不一致)
		     //admin@se.com   |   admin@rich.com
		     
		     userName = user.substring(0, user.indexOf("@"));
		     
		     if(gMain.openMailMove != '1'){
		     	if(userName !== userId){
			     	// "请输入本邮箱账号,如:"
			     	p.toolTip_MailMoveUser.show($("txtOldMail"),Lang.Mail.Write.pleaseInputAccount + userId +"@xxx.com");
			     	return true;
			     }
		     }
		     // if(userName !== userId){
		     // 	// "请输入本邮箱账号,如:"
		     // 	p.toolTip_MailMoveUser.show($("txtOldMail"),Lang.Mail.Write.pleaseInputAccount + userId +"@xxx.com");
		     // 	return true;
		     // }
			
			//如果popAccountType 为1，说明不用检查邮箱格式（不用域名）
			if(window.gMain && gMain.popAccountType && parseInt(gMain.popAccountType,10)){
				
			}else{
				if(!Vd.checkData("email",user)){
					p.toolTip_MailMoveUser.show($("txtOldMail"),Lang.Mail.Write.pleaseInputCorrentAddr);
					return true;
				}
			}
			
			/**
			 * 根据错误码,得到错误提示文字
			 */
			 
			function getStartErrStr(code){
				var p = this;
				var str="";
				if(code == "FA_BAD_PASSWORD")
					// "密码或账号错误,请重新输入"
					str = Lang.Mail.Write.pwdWrong;
				else if(code == "FA_XXXX_EXISTS")
					
					// "该用户已启动了邮箱搬家"
					str = Lang.Mail.Write.hasMoved;
				
				return str;
			}
			
			//如果没有填写密码
			if(!pwd){			
				p.toolTip_MailMovePwd.show($("txtOldMailPwd"),Lang.Mail.Write.pInputPwd);
				return true;
			}
			
			//启动搬家的请求数据
			var data = {
				type : "start",
				corpId : gMain.corpid-0,
				fromUser : user.toLowerCase(),
				toUser : gMain.userNumber,
				fromPwd : pwd
			};
			//启动搬家全部配置
			var postData = {
				func : "user:startMove",
				data : data,
				
				//成功回调函数
				call : function(d){
					
					jQuery("#divDialogCloseconfirmbtn_1").click();
					if(callfunc){
						callfunc(d,user);
					}
					else{
						var url =  "{0}/se/mail/move/mailmove.do?sid={1}".format(gMain.webPath,gMain.sid);
						CC.goOutLink(url,"move",Lang.Mail.ConfigJs.MailMove_Title);
					}		
				},
				//失败回调函数
				failCall:function(d){	
					//如果搬家启动不成功,如果是密码 账号问题,在弹出框给出提示
					var code = d.code;
					var tip  = getStartErrStr(code);
					if(code != "S_OK"){
						if(code == "FA_BAD_PASSWORD"){
							p.toolTip_MailMovePwd.show($("txtOldMailPwd"),tip);
							return true;
						}else if(code == "FA_XXXX_EXISTS"){
							p.toolTip_MailMoveUser.show($("txtOldMail"),tip);
							return true;
						}
										
					}
					jQuery("#divDialogCloseconfirmbtn_1").click();		
					if(callfunc){
						callfunc(d,user);
					}
					else{
						var url =  "{0}/se/mail/move/mailmove.do?sid={1}&code={2}&user={3}".format(gMain.webPath,gMain.sid,d.code,user);
						CC.goOutLink(url,"move",Lang.Mail.ConfigJs.MailMove_Title);
					}
				}
			}
			//请求 --->启动搬家接口		
			MM.mailRequestApi(postData);
			return true;	
		};
		CC.showDiv(html.join(""), callback, title);
		jQuery("#txtOldMail").focus();
	},
	/***
	 * 加载邮件搜索HMTL代码
	 */
	initAdvSearchHTML:function(){
		var html = [];
		var advHTML = [];
		//gMain.ftsFlag = false;
		html.push("<div id=\"seacrchContent\" class=\"searchContent searchContentOn\">");
		html.push("<input type=\"text\" class=\"searchInput\" id=\"txtAdvSearch\">");
		html.push("<span class=\"searchLeft\">");
		html.push("</span>");
		html.push("<span class=\"searchRight \" id=\"btnAdvSearch\">");
		html.push("</span>");
		html.push("</div>");
		
		//创建全文检索下拉框
		html.push("<div class=\"menuPop mailSearchboolBar hide\" id=\"divSearchAutoComplete\">");
		html.push("<ul>");
		
		
		
		//（主题 或 发件人）包含”关键字“的的邮件    1.
		html.push("<li id=\"searchMail\" name=\"mail\"><a href=\"javascript:fGoto();\"><i class=\"i_s_mail\"></i><span>");
		//<fmt:message key=\"mail.AdvSearch_AutoFill_Contain\"/>");
		html.push(Lang.Mail.AdvSearch_AutoFill_Contain);
		html.push("<strong id=\"strMail\" class=\"strOpt\"></strong>");
		//<fmt:message key=\"mail.AdvSearch_AutoFill_Mail\"/>
		html.push("的邮件");
		//html.push(Lang.Mail.AdvSearch_AutoFill_Mail);
		html.push("</span></a></li>");

		// 发件人包含”关键字“的的邮件    1.
		html.push("<li id=\"searchMailSend\" name=\"mailSend\"><a href=\"javascript:fGoto();\" style=\"padding-left: 33px;\"><span class=\"col999\">");
		//<fmt:message key=\"mail.AdvSearch_AutoFill_Contain\"/>");
		html.push("发件人：");
		html.push("<strong class=\"strOpt\"></strong>");
		html.push("</span></a></li>");

		// 收件人包含”关键字“的的邮件    1.
		html.push("<li id=\"searchMailRev\" name=\"mailRev\"><a href=\"javascript:fGoto();\" style=\"padding-left: 33px;\"><span class=\"col999\">");
		//<fmt:message key=\"mail.AdvSearch_AutoFill_Contain\"/>");
		html.push("收件人：");
		html.push("<strong class=\"strOpt\"></strong>");
		html.push("</span></a></li>");

		// 主题包含”关键字“的的邮件    1.
		html.push("<li id=\"searchMailSubject\" name=\"mailSubject\"><a href=\"javascript:fGoto();\" style=\"padding-left: 33px;\"><span class=\"col999\">");
		//<fmt:message key=\"mail.AdvSearch_AutoFill_Contain\"/>");
		html.push("主题：");
		html.push("<strong class=\"strOpt\"></strong>");
		html.push("</span></a></li>");
		
		
		//包含”关键字“的全文检索（包含邮件主题、发件人、内容） 2.
		if(gMain.ftsFlag && GC.check("MAIL_MANAGER_FTR")){
			html.push("<li id=\"searchAll\" name=\"all\"><a href=\"javascript:fGoto();\" style=\"padding-left: 33px;\"><span class=\"col999\">");
			html.push("全文检索：");
			//<fmt:message key=\"mail.AdvSearch_AutoFill_Contain\"/>");
			html.push("<strong id=\"strAll\" class=\"strOpt\"></strong>");
			//<fmt:message key=\"mail.AdvSearch_AutoFill_All\"/>
			html.push("</span></a></li>");
		}
		
		
		//包含”关键字“的附件
		html.push("<li id=\"searchAttr\" name=\"attr\" {0}>".format("style=\"display:none\""));//MAIL_MANAGER_FTR
		html.push("<a href=\"javascript:fGoto();\"><i class=\"i_s_arr\"></i><span>");
		//<fmt:message key=\"mail.AdvSearch_AutoFill_Contain\"/>");
		html.push(Lang.Mail.AdvSearch_AutoFill_Contain);
		html.push("<strong id=\"strAttr\" class=\"strOpt\"></strong>");
		//<fmt:message key=\"mail.AdvSearch_AutoFill_Attr\"/>
		html.push(Lang.Mail.AdvSearch_AutoFill_Attr);
		html.push("</span></a></li>");  

		html.push("<li class=\"line\"></li>");
		html.push("<li id=\"btn_AdvSearch\"><a href=\"javascript:fGoto();\"><span >");
		//<fmt:message key=\"mail.AdvSearch\"/>
		html.push(Lang.Mail.AdvSearch);
		html.push("</span></a></li>");
		html.push("</ul>");
		html.push("</div>");
		
		
		advHTML.push("<div class=\"advSearchpop hide\" id=\"divAdvSearch\">");
		advHTML.push("<a class=\"i_u_close\" href=\"#\"></a>");
		advHTML.push("<fieldset>");
		advHTML.push("<legend class=\"hide\">{0}</legend>".format(Lang.Mail.AdvSearch));
		advHTML.push("<ul class=\"form\">");
		advHTML.push("<li class=\"formLine\">");
		advHTML.push("<label class=\"label\">{0}：</label>".format(Lang.Mail.AdvSearch_InTheFolder));
		advHTML.push("<div class=\"element\"  id=\"div_dropSelect_Folder\">");
		advHTML.push("</div>");
		advHTML.push("</li>");
		advHTML.push("<li class=\"formLine\">");
		advHTML.push("<label class=\"label\">{0}：</label>".format(Lang.Mail.AdvSearch_Subject));
		advHTML.push("<div class=\"element\">");
		advHTML.push("<input type=\"text\" value=\"\" id=\"advtxtSubject\" class=\"iText\">");
		advHTML.push("</div>");
		advHTML.push("</li>");
		advHTML.push("<li class=\"formLine\">");
		advHTML.push("<label class=\"label\">{0}：</label>".format(Lang.Mail.AdvSearch_From));
		advHTML.push("<div class=\"element\">");
		advHTML.push("<input type=\"text\" value=\"\" id=\"advtxtFrom\" class=\"iText\">");
		advHTML.push("</div>");
		advHTML.push("</li>");
		advHTML.push("<li class=\"formLine\">");
		advHTML.push("<label class=\"label\">{0}：</label>".format(Lang.Mail.AdvSearch_To));
		advHTML.push("<div class=\"element\">");
		advHTML.push("<input type=\"text\" value=\"\" id=\"advtxtTo\" class=\"iText\">");
		advHTML.push("</div>");
		advHTML.push("</li>");
		advHTML.push("<li class=\"formLine\" id=\"litxtContent\">");
		advHTML.push("<label class=\"label\">{0}：</label>".format(Lang.Mail.AdvSearch_Content));
		advHTML.push("<div class=\"element\">");
		advHTML.push("<input type=\"text\" value=\"\" id=\"advtxtContent\" class=\"iText\">");
		advHTML.push("</div>");
		advHTML.push("</li>");
        advHTML.push("<li class=\"formLine\" id=\"litxtAttr\">");
        advHTML.push("<label class=\"label\">{0}：</label>".format(Lang.Mail.AdvSearch_Attr));
        advHTML.push("<div class=\"element\">");
        advHTML.push("<input type=\"text\" value=\"\" id=\"advtxtAttr\" class=\"iText\">");
        advHTML.push("</div>");
        advHTML.push("</li>");
		advHTML.push("<li class=\"formLine\">");
		advHTML.push("<label class=\"label\">{0}：</label>".format(Lang.Mail.AdvSearch_TimeRange));
		advHTML.push("<div class=\"element\" id=\"div_dropSelect_Time\">");
		advHTML.push("</div>");
		advHTML.push("</li>");
		advHTML.push("<li class=\"formLine\">");
		advHTML.push("<label class=\"label\">{0}：</label>".format(Lang.Mail.AdvSearch_ReadOrUnread));
		advHTML.push("<div class=\"element\" id=\"div_dropSelect_ReadStatus\">");
		advHTML.push("</div>");
		advHTML.push("</li>");

        //标签邮件
        if(CC.isLabelMail()){
            advHTML.push("<li class=\"formLine\" id=\"litxtLabel\">");
            advHTML.push("<ul class=\"form\" style=\"padding:0\">");
            advHTML.push("<li class=\"formLine\">");
            advHTML.push("<label class=\"label\">{0}：</label>".format(Lang.Mail.AdvSearch_MailLabel));
            advHTML.push("<div class=\"element\"  id=\"div_dropSelect_Label\">");
            advHTML.push("</div>");
            advHTML.push("</li>");
        }

		advHTML.push("<li class=\"formLine\">");
		advHTML.push("<label class=\"label\">&nbsp;</label>");
		advHTML.push("<div class=\"element\">");
		advHTML.push("<label><input type=\"checkbox\" id=\"advCheckedAttr\" class=\"mr5\"> {0}</label>".format(Lang.Mail.AdvSearch_Attached));
		advHTML.push("</div>");
		advHTML.push("</li>");
		
/*
		advHTML.push("<li id=\"li_advSearchOn\" style=\"display:none;\" class=\"formLine\">");
		advHTML.push("<label class=\"label\">&nbsp;</label>");
		advHTML.push("<div style=\"text-align: center;color: #BFBFBF;\">"+Lang.Mail.advSearch_OnMsg);
		advHTML.push("<a style=\"padding-left: 5px;\" id=\"btnOnAdvSearch\" onclick=\"Main.OnAdvSearch()\" href=\"javascript:fGoto();\">");
		advHTML.push(Lang.Mail.advSearch_OnClickOpen+"    </a></div>");
		advHTML.push("</li>");
		*/
		advHTML.push("<li class=\"formLine\">");
		advHTML.push("<label class=\"label\">&nbsp;</label>");
		advHTML.push("<div class=\"element\">");
		advHTML.push("<a class=\"n_btn_on\" id=\"btnAdvSearchOk\" href=\"javascript:fGoto();\"><span><span>{0}</span></span></a>".format(Lang.Mail.AdvSearch_OK));
		advHTML.push("<a class=\"n_btn ml_5\" id=\"btnAdvSearchCancel\" href=\"javascript:fGoto();\"><span><span>{0}</span></span></a></div>".format(Lang.Mail.AdvSearch_Cancel));
		advHTML.push("</li>");
		
		advHTML.push("</ul>");
		advHTML.push("</fieldset>");
		advHTML.push("</div>");
		jQuery("#advSeacrch_HTMLDiv").html(html.join(""));
		jQuery(document.body).append(advHTML.join(""));
	},
	/***
	 * 点击开启邮件全文检索
	 */
	OnAdvSearch: function(){
		var data = {fts_flag:1};
		var postData = {
			func : "user:setAttrs",
			data : data,
			call : function(){
				gMain.ftsFlag = 1;
				Main.searchKeyStr = "邮件搜索";
				$("txtAdvSearch").value = Main.searchKeyStr;
				jQuery("#txtAdvSearch").removeAttr("style");
				jQuery("#li_advSearchOn").hide();
				jQuery("#litxtAttr").show();
				jQuery("#litxtContent").show();	
				if($("openRetrieval1"))
					$("openRetrieval1").checked = true;
				CC.showMsg(Lang.Mail.advSearch_OnOk,true,false,"option");				
			},
			failCall : function(){
				CC.showMsg(Lang.Mail.advSearch_OnNo,true,false,"option");
			}
		}
		MM.mailRequest(postData);
	},
	/***
	 * 加载全文检索控件
	 */
	initControl: function(){
		var p = this;		
		p.dropSelectTime =	new DropSelect({
			id:"indexDropTime",
			data:[
				{text: Lang.Mail.AdvSearch_Unlimited,value:'0'},
				{text: Lang.Mail.AdvSearch_InOneDays,value:'1d'},
				{text: Lang.Mail.AdvSearch_InThreeDays,value:'3d'},
				{text: Lang.Mail.AdvSearch_InOneWeek,value:'1w'},
				{text: Lang.Mail.AdvSearch_InTwoWeek,value:'2w'},
				{text: Lang.Mail.AdvSearch_InOneMonth,value:'1m'},
				{text: Lang.Mail.AdvSearch_InTwoMonth,value:'2m'},
				{text: Lang.Mail.AdvSearch_InSixMonth,value:'6m'},
				{text: Lang.Mail.AdvSearch_InOneYear,value:'1y'},
				{text: Lang.Mail.Write.customDefined, value:'customTime'}
			],
			type:"", 
			itemClick:function(obj)
			{
				if(obj=="customTime")
				{
					p.initItemClick("customTime");
					jQuery("#customtimesetting").show();
					
				}else{
					p.initItemClick("other");
				}
			},
			selectedValue:"0",
			
			width:262			 
		}); 
		jQuery("#div_dropSelect_Time").html(p.dropSelectTime.getHTML());
		p.dropSelectTime.loadEvent();
		p.selectType = "";
		
		p.dropSelectReadStatus = new DropSelect({
			id:"indexDropReadStatus",
			data:[
				{text: Lang.Mail.AdvSearch_Unlimited,value:'2'},
				{text: Lang.Mail.AdvSearch_Read,value:'0'},
				{text: Lang.Mail.AdvSearch_Unread,value:'1'}
			],
			type:"", 
			selectedValue:"2",
			width:262			 
		}); 
		jQuery("#div_dropSelect_ReadStatus").html(p.dropSelectReadStatus.getHTML());
		p.dropSelectReadStatus.loadEvent();
	},	
	//初始下拉框选择事件
	initItemClick: function(type){
		var p = this;
		
		if(type == 'customTime'){	
			p.initItemClick_custom();
		}else if(type == 'other'){
			p.initItemClick_other();
		}
		
	},
	initItemClick_other: function(){
		var p = this;
		
		jQuery("#drop_select_indexDropTime").css("width","262px");
		p.selectType = "selectOther";
		
		//当点击其他下拉框，移除自定义时间段节点
		if(document.getElementById('customtimesetting')){
			jQuery("#customtimesetting").remove();
			jQuery(".ui-date").remove();
		}
	},
	initItemClick_custom: function(){
		var p = this;
		
		jQuery("#drop_select_indexDropTime").css("width","65px");
		
		var html = [],
		    date = new Date(),
		    yyyy = date.getFullYear(),
		    mm   = date.getMonth()+1,
		    dd	 = date.getDate(),
	        endDate = yyyy + Lang.Mail.Write.lb_timesend_year  + mm + Lang.Mail.Write.lb_timesend_month  +dd+ Lang.Mail.Write.lb_timesend_day ;
		
		//默认开始日期，是最近一个月
		date.setDate(date.getDate() - 30);
		
		var startDate = date.getFullYear() + Lang.Mail.Write.lb_timesend_year + (date.getMonth()+1) + Lang.Mail.Write.lb_timesend_month + date.getDate() + Lang.Mail.Write.lb_timesend_day ;
		
		html.push('<span id="customtimesetting" style="">');
		html.push('<span id="starttime" style="display:inline-block; width:86px;margin-left: 5px;">');
		html.push('<input class="txt" id="starttimeinput" readonly type="text" value="'+startDate+'" ');
		html.push('style="width:84px;" readonly="readonly"  ');
		html.push(' year="2013" month="4" day="23">');
		html.push('</span><span style="padding:0 4px">'+Lang.Mail.Write.to+'</span><span id="endtime" style="display:inline-block; width:86px">');
		html.push('<input class="txt" id="endtimeinput" type="text" value="'+endDate+'" ');
		html.push('style="width:84px;" readonly="readonly" ');
		html.push(' year="2013" month="4" day="10">');
		html.push('</span></span>')
		
		//如果已经有了设置时间段的div，就不用再次出现，但要把默认时间再次初始化一次，因为日期控件会保留上次选中的值
		if(!document.getElementById('customtimesetting')){
			jQuery("#drop_select_indexDropTime").after(html.join(""));
		}else{
			jQuery("#starttimeinput").val(startDate);
			jQuery("#endtimeinput").val(endDate);	
		}
		
		//保存初始化时间，用来判断用户选择的时间是否大于结束时间
		//注意"date"是默认开始时间，yyyy,mm,dd是默认结束时间（今天）
		//getTime()/1000 有可能是出现小数
		p.startDate = parseInt(date.getTime()/1000);  //最近一个月
		p.endDate   = parseInt(new Date(yyyy,mm-1,dd).getTime()/1000);
		p.textStart = startDate;
		p.textEnd   = endDate;
		p.selectType = "selectCustomTime";
		
		
		p.initDatePicker();
		
	},
	
	//初始化日期控件
	initDatePicker : function(){
		var p = this;
		p.initedPicker = true;
		//endtime
		p.pickerStart = new CCalendar("#starttimeinput",{
							onSelect: function(oDate){
								var yyyy = parseInt(oDate["yyyy"],10);
								var mm = parseInt(oDate["mm"],10);
								var dd = parseInt(oDate["dd"],10);
		                        
								dateStart = new Date(yyyy,mm-1,dd).getTime() / 1000;
								
								//保存当前输入框的值
								p.textStart = jQuery("#starttimeinput").val();
								//dateEnd   = dateStart + 24*60*60;
								//date = oDate.time / 1000,0;
								//给输入框赋值准备，默认格式是 2012-2-3，需要格式是 2012年2月3日
								p.selectDate = yyyy + Lang.Mail.Write.lb_timesend_year  + mm + Lang.Mail.Write.lb_timesend_month  +dd+ Lang.Mail.Write.lb_timesend_day ;
								
								//返还true 表示执行其他点击事件，比如改变输入框的文本值
								return true
							},
							onSelectBack: function(oDate){
								
								cbStart();
								return true;
								
							}
						});
		
		
		p.pickerEnd = new CCalendar("#endtimeinput",{
							onSelect: function(oDate){
								//onmousedown事件
								var yyyy = parseInt(oDate["yyyy"],10);
								var mm = parseInt(oDate["mm"],10);
								var dd = parseInt(oDate["dd"],10);
		
								dateEnd = new Date(yyyy,mm-1,dd).getTime() / 1000;
								
								//保存当前输入框的值
								p.textEnd = jQuery("#endtimeinput").val();
								//dateEnd   = dateStart + 24*60*60;
								//date = oDate.time / 1000,0;
								//给输入框赋值准备，默认格式是 2012-2-3，需要格式是 2012年2月3日
								p.selectDate = yyyy + Lang.Mail.Write.lb_timesend_year  + mm + Lang.Mail.Write.lb_timesend_month  +dd+ Lang.Mail.Write.lb_timesend_day ;
								
								return true;
							},
						    onSelectBack: function(oDate){
								
								cbEnd();
								return true;
								
							}
						});
		
		jQuery(".ui-date").css("zIndex","2000");
		
		//开始时间输入框点击后给Input，赋 年 月 日的值，方便直接取上传数据
	
		function cbStart(yyyy,mm,dd){
			jQuery("#starttimeinput").val(p.selectDate).attr({"year":yyyy,"month":mm-1,"ddate":dd});
		
		}

		//结束时间输入框点击后给Input，赋 年 月 日的值，方便直接取上传数据
	
		function cbEnd(yyyy,mm,dd){
			jQuery("#endtimeinput").val(p.selectDate).attr({"year":yyyy,"month":mm-1,"ddate":dd});
			
		}

		
		
	},
	
    goUrl: function(url){
    	if(Vd.checkUrl(url)){
        	window.open(url);
       	}
    },
    //初始化搜索框
    initSearch: function(){
        var searchMail = Lang.Mail.search_SearchMail;
        var ots = $(gConst.txtSearch);
        var obs = $("btnSearch");
        ots.value = searchMail;
        GC.initText(ots);
		
		//全文检索框 输入后，显示待搜索的列表
        ots.onkeyup = function(e){
            var ev = EV.getEvent(e);
            if (EV.getCharCode() == 13) {
                CC.searchMailByTop(ots);
            }
        };
        ots.onblur = function(){
            if (this.value.trim() == '') {
                this.value = searchMail;
            }
        };
        ots.onclick = function(){
            if (this.value == searchMail) {
                this.value = '';
                if (this.createTextRange) {
                    var r = this.createTextRange();
                    r.moveStart('character', this.value.length);
                    r.collapse();
                    r.select();
                }
            }
        }; 
    }, 
    /**
     * 获取WAP地址
     */
    getWap: function(){
        var url = GC.getCookie("SMSServer");
        url += "/Lang/WebSMS/SendWapPush.aspx?sid=" + GC.sid;
        CC.showMsg(Lang.Mail.other_getingWapUrl);
        GC.getScript("getWapPush", url, function(){
            if (typeof(sReturnValue) == "object") {
                CC.alert(sReturnValue.returnMsg);
            } else {
                CC.alert(Lang.Mail.other_getWapUrlError);
            }
            CC.hideMsg();
        });
    },
    logout: function(){
        CC.confirm(Lang.Mail.sys_ConfirmLogoff,Main.doLogout);
    },
    doLogout:function(){
		//保证管理平台也退出
		if(window.gMain && gMain.urlAdmin){
			try{
				jQuery.ajax(
				{
					type: "GET",
					url: gMain.urlAdmin+"/login/logout.do?sid="+gMain.sid,
					data:  {},
					success: function(){
						GC.top.location.href = gConst.logoutUrl;
					},
					error: function(){
						GC.top.location.href = gConst.logoutUrl;
					},
					dataType: 'json'
				});
			}catch(e){
				GC.top.location.href = gConst.logoutUrl;
			}
		}else{
			GC.top.location.href = gConst.logoutUrl;
		}
			
    },
	doSessionOut:function()
	{
		GC.top.location.href = gConst.sessionoutUrl;
	},
	/***
	 * 更新搜索自动选择框选中项的CSS
	 * @param {Object} obj
	 * @param {Object} t
	 */
	UpdateSelectedClass:function(obj,t){
		if(t == "on")
		{
			jQuery(obj).addClass("on");
			var i_icon = jQuery(obj).find("i");
			i_icon.attr("class",i_icon.attr("class")+"_on");
		}
		else{
			jQuery(obj).removeClass("on");
			var i_icon = jQuery(obj).find("i");
			if(i_icon.length > 0)
				i_icon.attr("class",i_icon.attr("class").replace("_on",""));
		}
	},
	/**
	 * 不同的字号，改变搜索框的宽度
	 */
	initAllSearchDivWidth:function(){
		var p		= this,
			$		= jQuery;
			
		//如果是oa邮箱，如果是大字号，给全文搜索输入框加长
		if(CC.isOA()){
			if(CC.isBigFont()){
				//right:10px;top:10px; z-index:20000;
				$("#advSeacrch_HTMLDiv").css({width:348});
				$("#advSeacrch_HTMLDiv div").css({width:270});
				$("#divSearchAutoComplete").css({width:310,left:18});
			}else{
				
				$("#advSeacrch_HTMLDiv").css({width:256});
				$("#advSeacrch_HTMLDiv div").css({width:206});
				$("#divSearchAutoComplete").css({width:248,left:3});
			}
		}
		
		$("#divSearchAutoComplete").css({
			width:340,
			left:-1
		});
		//则全文搜索往下移
		$("#advSeacrch_HTMLDiv").css({top:40});
		$("#divAdvSearch").css({
				"top": "68px",
				"right": "10px"
		});
	},
	initAdvSearch:function(){
	    //gMain.ftsFlag = "1";
		if (gMain.ftsFlag == "0" || !GC.check('MAIL_MANAGER_FTR')) {
			Main.searchKeyStr = Lang.Mail.search_SearchMail;
		}
		else{
			Main.searchKeyStr = "邮件搜索";
		}
        var ots = $(gConst.txtAdvSearch); //输入关键字文本框
        var obs = $("btnAdvSearch"); //搜索按钮
		var obc = $("btnAdvSearchCancel"); //高级搜索取消按钮
		var obsearch = $("btnAdvSearchOk"); //高级搜索确定按钮
		var obss=$("btn_AdvSearch"); //高级搜索按钮
		var divAdv = $("divAdvSearch"); //高级搜索窗体
		var divAuto = $("divSearchAutoComplete");//自动完成DIV
		var p = this;		
        ots.value = Main.searchKeyStr;
        //GC.initText(ots);
		
		this.initAllSearchDivWidth();

		Main.ShowAdvSearchDom();
		
		//var classstr = "class";
		//if(document.all) classstr="className";
		//var curSelectedLi = 0;
		//var liList;
		var liIndex = 0;
		var oldFlag = gMain.ftsFlag;
		var onLoadLiEvent = function(){
			if (p.liList) {
				Main.UpdateSelectedClass(p.liList[p.curSelectedLi], "");
			}
			liIndex = 0;			
			p.liList = jQuery(divAuto).children().find("li[id]");
			p.liList.each(function(){
				if (liIndex == 0) {
					//p.liList.each(function(){
					//	Main.UpdateSelectedClass(this, "");
					//});
					Main.UpdateSelectedClass(this, "on");
					p.curSelectedLi = 0;					
				}
				jQuery(this).attr("index", liIndex);
				liIndex++;
				this.onmouseover = function(){
					/*
p.liList.each(function(){
						Main.UpdateSelectedClass(this, "");
					});*/
					Main.UpdateSelectedClass(p.liList[p.curSelectedLi], "");
					Main.UpdateSelectedClass(this, "on");
					p.curSelectedLi = jQuery(this).attr("index").toInt();
				};
				if (this.id != "btn_AdvSearch") {
					this.onclick = function(){
						var liname = jQuery(this).attr("name");
						if (liname) 
							obs.onclick(liname);
					};
				}
			});
		};
		onLoadLiEvent();
		
		//全文检索框 输入后，显示待搜索的列表
        ots.onkeyup = function(e){					
			if(!this.value || this.value == Main.searchKeyStr){
				jQuery(this).removeAttr("style");
				jQuery(obs).attr("class","searchRight"); //obs.setAttribute(classstr,"searchRight")		
				//jQuery(divAuto).attr("class","menuPop shadow mailSearchboolBar hide");//divAuto.setAttribute(classstr,"menuPop shadow mailSearchboolBar hide");
				Main.HideAdvAutoDiv();
			}else{
				jQuery(this).attr("style","color: black;");			
				Main.ShowAdvSearchDom();				
				if(oldFlag != gMain.ftsFlag){
					oldFlag = gMain.ftsFlag;
					onLoadLiEvent();					
				}	
				jQuery(obs).attr("class","searchEnter");//obs.setAttribute(classstr,"searchRight searchEnter")				
				//jQuery(divAuto).attr("class","menuPop shadow mailSearchboolBar");//divAuto.setAttribute(classstr,"menuPop shadow mailSearchboolBar");
				Main.ShowAdvAutoDiv();
				var str1 = $("strMail");
				var str2 = $("strAttr");
	
				//var str4 = $("strMailContent");

				var str0 =  $("strAll");
				if(str0){
					str0.innerHTML = ots.value.encodeHTML();
				}
				jQuery("#divSearchAutoComplete .strOpt").html(ots.value.encodeHTML());
				// str1.innerHTML=str2.innerHTML=ots.value.encodeHTML();
				//divAdv.style.display = "none";
				Main.HideAdvDiv();
			}
			
			//temp
			jQuery("#divSearchAutoComplete").css("left","1");
			
            var ev = EV.getEvent(e);
            if (EV.getCharCode() == 13) {
				var curLi =	p.liList[p.curSelectedLi];
				if(curLi){
					var liname = jQuery(curLi).attr("name");
					if(liname)
						obs.onclick(liname);
					else
						obss.onclick();
				}else
               		obs.onclick("quick");
			   Main.IsShowAdvSearch = false;			   
            }
			else if (EV.getCharCode() == 40) { //下
				Main.UpdateSelectedClass(p.liList[p.curSelectedLi], "");	
				if(p.curSelectedLi == p.liList.length-1) p.curSelectedLi=-1;
				p.curSelectedLi++;
				var nextLi =p.liList[p.curSelectedLi];
				if(nextLi){
					Main.UpdateSelectedClass(nextLi,"on");					
				}
			}
			else if (EV.getCharCode() == 38) { //上
				Main.UpdateSelectedClass(p.liList[p.curSelectedLi], "");
				if(p.curSelectedLi == 0) p.curSelectedLi = p.liList.length;				
				p.curSelectedLi--;
				var topLi = p.liList[p.curSelectedLi];
				if(topLi){
					//jQuery(topLi).addClass("on");
					Main.UpdateSelectedClass(topLi,"on");	
				}
			}
        };
		ots.onfocus = function(){
			jQuery('#advSeacrch_HTMLDiv').addClass("focusCol");
		};
        ots.onblur = function(){
			jQuery('#advSeacrch_HTMLDiv').removeClass("focusCol");
            if (this.value.trim() == '') {
                this.value = Main.searchKeyStr;
				jQuery(this).removeAttr("style");
            }else
			{	
				jQuery(this).attr("style","color: black;");
			}			
        };
        ots.onclick = function(){
			
            if (this.value == Main.searchKeyStr) {
                this.value = '';
                if (this.createTextRange) {
                    var r = this.createTextRange();
                    r.moveStart('character', this.value.length);
                    r.collapse();
                    r.select();
                }
            }
			else{
				if (this.value) {
					Main.ShowAdvSearchDom();					
					//jQuery(divAuto).attr("class", "menuPop shadow mailSearchboolBar");
					Main.ShowAdvAutoDiv();
				}
			}
			jQuery(this).attr("style","color: black;");
			Main.IsShowAutoSearch = false;
        }; 
		
		/**
		 *t: [all 全文搜索   mail 主题搜索 ]
		 */		
		obs.onclick = function(t){ //快速搜索
			if (!ots.value || ots.value == Main.searchKeyStr) {						
				Main.LoadDropHTML();
				Main.ShowAdvSearchDom();
				//divAdv.style.display = "block";
				Main.ShowAdvDiv();
				Main.IsShowAdvSearch = true;
				Main.initAdvEvent();
			}
			else {
				var searchList = [];
				var key = ots.value.trim();
				var flags = {};
				var isFullSearch = 2;
				GE.isFullSearch=2;
				if (t == "mail") {
					searchList.push({
						field: "subject",
						operator: "contains",
						value: key
					});
					searchList.push({
                        field: "from",
                        operator: "contains",
                        value: key
                    });
                    searchList.push({
                        field: "to",
                        operator: "contains",
                        value: key
                    });
				} else if (t === "mailSubject") {
					searchList.push({
						field: "subject",
						operator: "contains",
						value: key
					});
				} else if (t === "mailSend") {
					searchList.push({
                        field: "from",
                        operator: "contains",
                        value: key
                    });
				} else if (t === "mailRev") {
					searchList.push({
                        field: "to",
                        operator: "contains",
                        value: key
                    });
				}else if (t == "attr") {					
					gMain.IsAttachSearch = key.encodeHTML();
					var dom = document.getElementById("attachList_AllCount");
					if (dom) {
						//CC.goAttachList();
						GE.tab.active(gConst.attachList,true);
						MM[gConst.attachList].getFilter("attachName",key);
					}else{
						if(MM[gConst.attachList].data)
							MM[gConst.attachList].data.filter = {"attachName":key};									
						CC.goAttachList();
					}
					//obs.setAttribute(classstr, "searchRight");
					//jQuery(divAuto).attr("class","menuPop shadow mailSearchboolBar hide");	//divAuto.setAttribute(classstr, "menuPop shadow mailSearchboolBar hide");
					//ots.value = Lang.Mail.search_SearchMail;
					Main.HideAdvAutoDiv();
					return;
				}
				else if (t == "addr") {
					CC.goOutLink(gConst.personalAddrUrl +"&keyVal={0}&op=key".format(encodeURI(key.encodeHTML())),"addr",Lang.Mail.Write.addrList);
					//jQuery(divAuto).attr("class","menuPop shadow mailSearchboolBar hide");//divAuto.setAttribute(classstr, "menuPop shadow mailSearchboolBar hide");
					Main.HideAdvAutoDiv();
					return;
				}
				else if(t == "disk"){
                    var html = [];
                    html.push("{");
                    html.push("'key':'" + key + "',");
                    //html.push("'isUpperCase':1,");
                    html.push("'diskType':0,");
                    //html.push("'searchRange':'',");
                    html.push("'isSubDir':0,");
                    html.push("'isViewFolder':1,");
                    //html.push("'uploadTimeType':0,");
                    //html.push("'startUploadTime':'',");
                    //html.push("'endUploadTime':'',");
                   	//html.push("'sizeOperator':'',");
                    //html.push("'fileSize':'',");
                    //html.push("'fileType':[0],");
                    html.push("'curPage':1,");
                    html.push("'pageSize':20");
                    html.push("}");
					var sid = gMain.sid;
					var data = escape(html.join(""));
					
					CC.goOutLink(gMain.webPath + "/se/disk/indexdisk.do?sid={0}&data={1}".format(sid,data),"disk",Lang.Mail.Write.cabinet);
					//obs.setAttribute(classstr, "searchRight");
					//divAuto.setAttribute(classstr, "menuPop shadow mailSearchboolBar hide");
					//jQuery(divAuto).attr("class","menuPop shadow mailSearchboolBar hide");
					Main.HideAdvAutoDiv();
					
					//ots.value = Lang.Mail.search_SearchMail;
					return;
				}
				else if (t == "content") {
                    searchList.push({
                        field: "content",
                        operator: "contains",
                        value: key
                    });
                    isFullSearch = 1;
					GE.isFullSearch=1;
				}else if(t == "all"){
					searchList.push({
                        field: "subject",
                        operator: "contains",
                        value: key
                    });
                    searchList.push({
                        field: "from",
                        operator: "contains",
                        value: key
                    });
                    searchList.push({
                        field: "to",
                        operator: "contains",
                        value: key
                    });
                    searchList.push({
                        field: "attachContent",
                        operator: "contains",
                        value: key
                    });
                    //searchList.push({field:"memo",operator:"contains",value:key});
                    
                    
                    
					if (gMain.ftsFlag == "1") {
						searchList.push({
							field: "content",
							operator: "contains",
							value: key
						});						
						searchList.push({
							field: "attachName",
							operator: "contains",
							value: key
						});
						isFullSearch = 1;
						GE.isFullSearch=1;
					}
				}
				else {
                    searchList.push({
                        field: "subject",
                        operator: "contains",
                        value: key
                    });
                    searchList.push({
                        field: "from",
                        operator: "contains",
                        value: key
                    });
                    searchList.push({
                        field: "to",
                        operator: "contains",
                        value: key
                    });
                    //searchList.push({field:"memo",operator:"contains",value:key});
                    
                    
                    //zs 新版默认不搜全文搜索,而是主题加收发件人关键字搜索
                    
					if (gMain.ftsFlag == "1" && false) {
						searchList.push({
							field: "content",
							operator: "contains",
							value: key
						});						
						searchList.push({
							field: "attachName",
							operator: "contains",
							value: key
						});
						isFullSearch = 1;
						GE.isFullSearch=1;
					}
				}
				if (gMain.ftsFlag == "0") {
					isFullSearch = 2;
					GE.isFullSearch=2;
				}
				//obs.setAttribute(classstr, "searchRight")
				//divAuto.setAttribute(classstr, "menuPop shadow mailSearchboolBar hide");
				//jQuery(divAuto).attr("class","menuPop shadow mailSearchboolBar hide");
				Main.HideAdvAutoDiv();
				GE.approachSearchData = {};
				CC.advSearchMailByTop(ots, searchList, flags, isFullSearch);
				//divAdv.style.display = "none";
				Main.HideAdvDiv();
			}
		};
		
		//高级搜索确认事件
		obsearch.onclick=function(){
			Main.AdvSearchOnClick();
		};
		
		obc.onclick=function(){ //高级搜索的取消事件
			//divAdv.style.display = "none";
			Main.HideAdvDiv();
			p.clearData();
		};
		obss.onclick=function(){ //自动完成下的高级搜索按钮
			Main.LoadDropHTML();
			Main.ShowAdvSearchDom();
			//divAdv.style.display = "block";
			Main.ShowAdvDiv();
			Main.IsShowAdvSearch = true;
			Main.initAdvEvent();
		}		
		
		
		divAdv.onclick=function(){
			Main.IsShowAdvSearch = true;		
		};
		divAuto.onclick=function(){
			Main.IsShowAutoSearch = false;
		};

	},
	/**
	 *初始化高级搜索 
	 */
	initAdvEvent: function(){
		var p = this,
			$ = jQuery,
			$check = $("#advCheckedAttr");
		
		$("#advtxtAttr").keyup(function(){
			if($(this).val().trim().length !== 0){
				$check.attr("checked",true);
			}else{
				$check.attr("checked",false);
			}
		});	
	},
	AdvSearchOnClick: function(){	
		var p = this;	
		var fid = Util.str2Num(this.dropSelectFolder.getValue());
		var sendDate = this.dropSelectTime.getValue();
		var read = Util.str2Num(this.dropSelectReadStatus.getValue());
        var label = CC.isLabelMail() && Util.str2Num(this.dropSelectLabel.getValue());
		
		var subject = jQuery("#advtxtSubject").val();
		var from = jQuery("#advtxtFrom").val();
		var to = jQuery("#advtxtTo").val();
		var content = jQuery("#advtxtContent").val();
		var attr = jQuery("#advtxtAttr").val();		
		var isAttr = $("advCheckedAttr").checked;
		
		var beginDate = "";
		var currDate = new Date();
		var gettime = function(t,currDate){
			var date = currDate;
			var returnVal;
			if(t=="1d"){
				returnVal = Util.DateAdd("d",-1,date).getTime() / 1000;
			}else if(t == "3d"){
				returnVal = Util.DateAdd("d",-3,date).getTime() / 1000;
			}
			else if(t == "1w"){
				returnVal = Util.DateAdd("w",-1,date).getTime() / 1000;
			}
			else if(t == "2w"){
				returnVal = Util.DateAdd("w",-2,date).getTime() / 1000;
			}else if(t == "1m"){
				returnVal = Util.DateAdd("m",-1,date).getTime() / 1000;				
			}else if(t == "2m"){
				returnVal = Util.DateAdd("m",-2,date).getTime() / 1000;		
			}else if(t == "6m"){
				returnVal = Util.DateAdd("m",-6,date).getTime() / 1000;		
			}else if(t == "1y"){
				returnVal = Util.DateAdd("y",-1,date).getTime() / 1000;		
			}
			return Util.str2Num(returnVal,0);
		};
		if(p.selectType == "selectCustomTime"){
			(function(){
				/*
				 * 输入框v的值形如"2012年2月2日,2013年22月23日"，
				 * 这里利用基本的字符串截取，分别取到年，月，日，直接从输入框的文本取值
				 * 注意这里的月份要减一，才能上传
				 */
				//yyyy + Lang.Mail.Write.lb_timesend_year  + mm + Lang.Mail.Write.lb_timesend_month  +dd+ Lang.Mail.Write.lb_timesend_day ;
				var startInput = jQuery("#starttimeinput"),
					v          = startInput.val().trim(),
				    yyyy	   = v.substring(0,v.indexOf(Lang.Mail.Write.lb_timesend_year )),
					mm         = v.substring(v.indexOf(Lang.Mail.Write.lb_timesend_year) +1,v.indexOf(Lang.Mail.Write.lb_timesend_month)),
					dd         = v.substring(v.indexOf(Lang.Mail.Write.lb_timesend_month) +1,v.indexOf(Lang.Mail.Write.lb_timesend_day));
					
				mm = parseInt(mm,10) - 1;
					
				var	date 	   = new Date(parseInt(yyyy),parseInt(mm),parseInt(dd));
				
				//上传的时间是以秒为单位,getTime()获取的是毫秒	
				beginDate = date.getTime() / 1000;
				
			})();
		}else{
			beginDate = gettime(sendDate,currDate);
		}
		
		var searchList = [];	
		var flags = {};	
		var isFullSearch = 0;
		GE.isFullSearch = 0;
		if(subject){
			searchList.push({field:"subject",operator:"contains",value:subject});
		}
        if(from){
            searchList.push({field:"from",operator:"contains",value:from});
        }
		if(to){
			searchList.push({field:"to",operator:"contains",value:to});
		}
		if(content){
			searchList.push({field:"content",operator:"contains",value:content});
			GE.isFullSearch=1;
		}
		if(attr){
			searchList.push({field:"attachName",operator:"contains",value:attr});
		}
		if(beginDate){	
			var endDate = "";
			
			if(p.selectType == "selectCustomTime"){
			(function(){
			
				/*
				 * 输入框v的值形如"2012年2月2日,2013年22月23日"，
				 * 这里利用基本的字符串截取，分别取到年，月，日，直接从输入框的文本取值
				 * 注意这里的月份要减一，才能上传
				 * 但这里： 现在 16号 是 指16号的凌晨 00:00
				 * 如果选 16号到16号 显示16号的邮件，则 endDay  要 + 1
				 * 所以日期要加一
				 */
				
				var endInput   = jQuery("#endtimeinput"),
					v          = endInput.val().trim(),
				    yyyy	   = v.substring(0,v.indexOf(Lang.Mail.Write.lb_timesend_year)),
					mm         = v.substring(v.indexOf(Lang.Mail.Write.lb_timesend_year) +1,v.indexOf(Lang.Mail.Write.lb_timesend_month)),
					dd         = v.substring(v.indexOf(Lang.Mail.Write.lb_timesend_month) +1,v.indexOf(Lang.Mail.Write.lb_timesend_day));
					
			    mm = parseInt(mm,10) - 1;
				dd = parseInt(dd,10) + 1;
					
				var	date 	   = new Date(parseInt(yyyy),parseInt(mm),parseInt(dd));
				
				//上传的时间是以秒为单位,getTime()获取的是毫秒	
				endDate = date.getTime() / 1000;
				})();
				
				//如果输入框的开始时间大于结束时间，提示：请输入正确的结束时间
				if(beginDate > endDate){
					parent.CC.showMsg(Lang.Mail.Write.pleaseInputRightEndTime,true,false,"caution");
					return;
				}
			}else{
				endDate = Util.str2Num(currDate.getTime() / 1000,0);
			}	
			searchList.push({field:"sendDate",operator:">",value:beginDate});
			searchList.push({field:"sendDate",operator:"<",value:endDate});
		}
		
		if(isAttr){
			flags.attached = 1;
		}
		if(read != 2){
			flags.read =read;
		}

		//if (gMain.ftsFlag == "1" && content!="") {
			//isFullSearch = 0;
			//GE.isFullSearch=0;
		//}

		//jQuery("#divAdvSearch").hide();
		Main.HideAdvDiv();
		Main.clearData();
		
		CC.advSearchMail(fid,searchList,flags,isFullSearch,label?[label]:null);
	},
	clearData : function(){
		jQuery("#advtxtSubject").val("");
		jQuery("#advtxtFrom").val("");
		jQuery("#advtxtTo").val("");
		jQuery("#advtxtContent").val("");
		jQuery("#advtxtAttr").val("");
		jQuery("#advCheckedAttr").attr("checked",false);
		this.dropSelectFolder.setValue("0");
		this.dropSelectTime.setValue("0");
		this.dropSelectReadStatus.setValue("2");		
	},
	ShowAdvSearchDom: function(){
	    //gMain.ftsFlag = "1"; RM控制的权限
		//GC.check("MAIL_CONFIG_FTR");  管理平台全文检索控制的权限
		//没有权限要隐藏，
		if(gMain.ftsFlag == "0" || !GC.check("MAIL_MANAGER_FTR")){
			jQuery("#searchAll").hide();		
			jQuery("#litxtAttr").hide();
			jQuery("#litxtContent").hide();				
		}else{			
			jQuery("#searchAll").removeAttr("style");			
			jQuery("#litxtAttr").show();
			jQuery("#litxtContent").show();				
		}

		if(GC.check("MAIL_VAS_ATT")){
			jQuery("#searchAttr").show();
		}
		else{
			jQuery("#searchAttr").hide();
		}

		//if(gMain.ftsFlag == "0"){
		if(GC.check('MAIL_MANAGER_FTR') && gMain.ftsFlag == "0"){
			jQuery("#li_advSearchOn").show();	
		}else{
			jQuery("#li_advSearchOn").hide();
		}
	},
	ShowAdvAutoDiv:function(){
		
		jQuery("#divSearchAutoComplete").attr("class","menuPop mailSearchboolBar");
		Main.OpSelect();
	},
	HideAdvAutoDiv:function(){
		//Main.OpSelect("show");
		Main.UpdateSelectedClass(Main.liList[Main.curSelectedLi], "");
		Main.curSelectedLi = 0;
		Main.UpdateSelectedClass(Main.liList[Main.curSelectedLi], "on");
		jQuery("#divSearchAutoComplete").attr("class","menuPop mailSearchboolBar hide");
		Main.OpSelect();
	},
	ShowAdvDiv:function(){
		//Main.OpSelect("hide");
		//jQuery("#divAdvSearch").show();	
		
		jQuery("#divAdvSearch").attr("class","advSearchpop");
		this.initAdvDropt();
		
		Main.OpSelect();	
	},
	HideAdvDiv:function(){
		//Main.OpSelect("show");
		//jQuery("#divAdvSearch").hide();	
		
		jQuery("#divAdvSearch").attr("class","advSearchpop hide");
		Main.OpSelect();	
	},
	initAdvDropt:function(){
		var p 		= this,
			$		= jQuery;
			
		//默认是“不限”，让第一个选项点击一次
		$("#li_indexDropFolder_0")[0].click();
		$("#li_indexDropTime_0")[0].click();
		$("#li_indexDropReadStatus_2")[0].click();
		$("#advCheckedAttr").attr("checked",false);
		$("#advtxtSubject").val("");
		$("#advtxtFrom").val("");
		$("#advtxtTo").val("");
		$("#advtxtContent").val("");
		$("#advtxtAttr").val("");
		$("#advtxtFrom").val("");
	},
	LoadDropHTML: function(){
        var folders = CC.getFolders([GE.folder.sys, GE.folder.user, GE.folder.pop]);
        Main.dropSelectFolder = new DropSelect({
            id: "indexDropFolder",
            data: folders,
            type: "fileTree",
            selectedValue: "0",
            width: 262,
            height: 300,
            folderList: [{
                text: Lang.Mail.AdvSearch_AllMail,
                value: "0"
            }]
        });

        jQuery("#div_dropSelect_Folder").html(Main.dropSelectFolder.getHTML());
		
		function removeTimeRange(){
			if(document.getElementById('customtimesetting')){
				jQuery("#customtimesetting").hide();
			}
			
			jQuery("#drop_select_indexDropTime").css("width","262px");
		}
		
		removeTimeRange();
        Main.dropSelectFolder.loadEvent();

        //标签邮件
        if(CC.isLabelMail()){
            var labels = CC.getFolders([GE.folder.label]);
            Main.dropSelectLabel = new DropSelect({
                id: "indexDropLabel",
                data: labels,
                type: "fileTree",
                selectedValue: "0",
                width: 262,
                height: 300,
                folderList: [{
                    text: Lang.Mail.label_AllLabel,
                    value: "0"
                }]
            });
            jQuery("#div_dropSelect_Label").html(Main.dropSelectLabel.getHTML());
            Main.dropSelectLabel.loadEvent();
        }
	},
	OpSelect:function(op){		
		var adv = jQuery("#divAdvSearch").attr("class").indexOf("hide") == -1;	
		var auto = jQuery("#divSearchAutoComplete").attr("class").indexOf("hide") == -1;	
		if (jQuery.browser.msie && (jQuery.browser.version == "6.0") && !jQuery.support.style)//
		{			
			var selectList = jQuery("select");
			var cs = function(){
				for (var i=0; i < selectList.length; i++) {
					 if(adv || auto)//if(op == "hide")
				  		jQuery(selectList[i]).hide();
				  	else
				  		jQuery(selectList[i]).show();
				};
			}
			cs();
		}
	}    
};

function Main_Init(simple){
    try {
        Frm_Init(); //初始化框架类库
        if(simple){
			LM.init_simple();
		}else{
			LM.init();
		}
        Main.init();
        mailPOP.initAuto();
    } catch (e) {
    }
}