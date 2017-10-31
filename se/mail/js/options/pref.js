var pref = new OptionBase();


pref.attrs = {
	id: 'pref',
	authority: 'MAIL_CONFIG_COMMON',
	divId: 'pageSetBasic',
	list: {
		type: "url",
		func: gConst.func.getAttrs
	}, //获取数据/列表时指令，数据 
	save: {
		func: gConst.func.setAttrs
	} //更新数据时func指令,及数据
};
/**
 * 得到窗口的html
 * @param {Object} attr 服务器返回的各属性值
 * @param {Object} values 服务器返回的页面设置单选框的值
 */
pref.getHtml = function(attr,values) {
    var p = pref;

	//得到本页面,不包括其他任何公用页面、左边、上边的页面
    var getAddHtml = function() {
       var html = [];
	   
	   //每页显示邮件数
	   html.push("<div class=\"parameter-wrap\"><ul class=\"parameter-ul pt_10\">");
	   html.push(" <li class=\"m_clearfix\">");
	   html.push("<span class=\"parameter-til\">"+Lang.Mail.ConfigJs.index_maxlist_text +"</span>");
	   //10封
	   html.push("<div class=\"parameter-conBox\">");
	   html.push("<input type=\"radio\" name='manyLetter' id='letter_10' class=\"rm_cb\" value='10'>");
	   html.push("<label for='letter_10'> 10"+Lang.Mail.ConfigJs.email+"</label></div></li>");
	   //20封
       html.push("<li class=\"pl_155 next-li\">");
	   html.push("<input type=\"radio\" class=\"rm_cb\" name='manyLetter' id='letter_20' value='20'>");
	   html.push("<label  for='letter_20'>  20"+Lang.Mail.ConfigJs.email+"</label>");
	   html.push("<em class=\"red-commend\">（"+Lang.Mail.ConfigJs.index_recommend+"）</em></li>");
	   //50封
       html.push("<li class=\"pl_155 next-li\" >");
	   html.push("<input type=\"radio\" name='manyLetter' id='letter_50' class=\"rm_cb\" value='50'>");
	   html.push("<label  for='letter_50'>  50"+Lang.Mail.ConfigJs.email+"</label></li>");
	   //100封
	   html.push("<li class=\"pl_155 next-li\" >");
	   html.push("<input type=\"radio\" class=\"rm_cb\"name='manyLetter' id='letter_100' value='100'>");
	   html.push("<label  for='letter_100'>  100"+Lang.Mail.ConfigJs.email+"</label></li></ul>");
	   
	   if (GC.check("MAIL_CONFIG_FONTSIZE")) {
	   	   //字号设置 [大字号/标准字号]
		   html.push("<ul class=\"parameter-ul pt_10\">");
		   html.push(" <li class=\"m_clearfix\">");
		   html.push("<span class=\"parameter-til\">"+Lang.Mail.ConfigJs.setFontSize+"：" +"</span>");
		   //大字号
		   html.push("<div class=\"parameter-conBox\">");
		   html.push("<input type=\"radio\" name='set_fontSize' id='big_fontSize' class=\"rm_cb\" value='bigfont'>");
		   html.push("<label for='big_fontSize'> "+Lang.Mail.ConfigJs.bigFontSize+"</label></div></li>");
		   //标准字号
	       html.push("<li class=\"pl_155 next-li\">");
		   html.push("<input type=\"radio\" class=\"rm_cb\" name='set_fontSize' id='st_fontSize' value='normalfont'>");
		   html.push("<label  for='st_fontSize'>  "+Lang.Mail.ConfigJs.stFontSize+"</label>");
		   html.push("<em class=\"red-commend\">（"+Lang.Mail.ConfigJs.index_recommend+"）</em></li>");
		   html.push("</ul>");
		   
	   }
	   
		//是否显示正文摘要
		html.push("<ul class=\"parameter-ul pt_10\">");
		//显示
		html.push("<li class=\"m_clearfix\">");
		html.push("<span class=\"parameter-til\">"+Lang.Mail.ConfigJs.messageAbstract+"</span>");
		html.push("<div class=\"parameter-conBox\">");
		html.push("<input type=\"radio\" class=\"rm_cb\" name='showSummary' id='showSummary1' value='1'>");
		html.push("<label for='showSummary1'>  "+Lang.Mail.ConfigJs.showtip+"</label>");
		html.push("</div></li>");
		//不显示
		html.push("<li class=\"pl_155 next-li\" >");
		html.push("<input type=\"radio\" class=\"rm_cb\" name='showSummary' id='showSummary2' value='0'>");
		html.push("<label for='showSummary2'>  "+Lang.Mail.ConfigJs.NotDisplay+"</label></li></ul>");
	 
	   //控制 邮件查看模式	
		if(GC.check("MAIL_CONFIG_READMODE")){		
		   //邮件查看模式
		   html.push("<ul class=\"parameter-ul pt_10\" id='mailReadMode'>");
		   html.push("<li class=\"m_clearfix\">");
		   html.push("<span class=\"parameter-til\">"+Lang.Mail.ConfigJs.index_newwindowtoreadletter_text+"</span>"); 
	       //标签阅读
		   html.push("<input type=\"radio\" class=\"rm_cb\" name='readMode' id='readMode1' value='0'>");
		   html.push("<label for='readMode1'><i class=\"i-read-mark\"></i>  ");
		   html.push(""+Lang.Mail.ConfigJs.index_newwindowtoreadletter_v_0+"</label></li>");
		   //分栏阅读
	       html.push("<li class=\"pl_155 next-li\" >");
		   html.push("<input type=\"radio\" class=\"rm_cb\" name='readMode' id='readMode2' value='1'>");
		   html.push("<label for='readMode2'><i class=\"i-read-column\"></i>  ");
		   html.push(""+Lang.Mail.ConfigJs.index_newwindowtoreadletter_v_1 +"</label></li></ul>");
		}   
		
	   html.push("</div>")
	   
	  
	   html.push("<div class=\"parameter-wrap\">"); 
        
	
		
	   //回复邮件时：是否加入原信
	   //加入原信（推荐）
	   html.push("<ul class=\"parameter-ul pt_10\"><li class=\"m_clearfix\">");
	   html.push("<span class=\"parameter-til\">  "+Lang.Mail.ConfigJs.replayMail+"：</span>");
       html.push("<div class=\"parameter-conBox\">");
	   html.push("<input type=\"radio\" name='joinLetter' id='joinLetter1' class=\"rm_cb\" value='1'>");
	   html.push("<label for='joinLetter1'>  "+Lang.Mail.ConfigJs.joinOriginalLetter+"</label>");
	   html.push("<em class=\"red-commend\">（"+Lang.Mail.ConfigJs.index_recommend+"）</em></div></li>");
	   //不加入原信
	   html.push("<li class=\"pl_155 next-li\" >");
       html.push("<input type=\"radio\" name='joinLetter' id='joinLetter2' class=\"rm_cb\" value='2'>");
	   html.push("<label for='joinLetter2'>  "+Lang.Mail.ConfigJs.noJoinOriginalLetter+"</label>");
	   html.push("</li></ul>");
	   
	   //回复/转发时，主题显示
	   //英文   
	   html.push("<ul class=\"parameter-ul pt_10\">");
	   html.push("<li class=\"m_clearfix\">");
	   html.push("<span class=\"parameter-til\">"+Lang.Mail.ConfigJs.thematicDisplay+"："+"</span>");
       html.push(" <div class=\"parameter-conBox\">");
	   html.push("<input type=\"radio\" name='reply' id='reply1' class=\"rm_cb\" value='1'>");
	   html.push("<label for='reply1'>  "+Lang.Mail.ConfigJs.useEnglish+" <font class='tips-default-color'>(Re：/Fw：)</font></label>");
	   html.push("<em class=\"red-commend\">（" + Lang.Mail.ConfigJs.index_recommend + "）</em></div></li>");
	   //中文
	   html.push(" <li class=\"pl_155 next-li\">");
	   html.push("<input type=\"radio\" name='reply' id='reply2' class=\"rm_cb\" value='4'>");
	   html.push("<label for='reply2'>  "+Lang.Mail.ConfigJs.useChinese+" <font class='tips-default-color'>("+Lang.Mail.ConfigJs.reply+"：/"+Lang.Mail.ConfigJs.forward1+"：)</font> </label></li></ul>");
       
	    //是否开通web发信保存
	   html.push("<ul class=\"parameter-ul pt_10\"><li class=\"m_clearfix\">");
	   html.push("<span class=\"parameter-til\">  "+Lang.Mail.ConfigJs.webMailSave+"：</span>");
       html.push("<div class=\"parameter-conBox\">");
	   //是
	   html.push("<input type=\"radio\" name='webMailSave' id='webMailSave1' class=\"rm_cb\" value='1'>");
	   html.push("<label for='webMailSave1'>  "+Lang.Mail.ConfigJs.enable+"</label>");
	   html.push("</div></li>");
	   //否
	   html.push("<li class=\"pl_155 next-li\" >");
       html.push("<input type=\"radio\" name='webMailSave' id='webMailSave0' class=\"rm_cb\" value='0'>");
	   html.push("<label for='webMailSave0'>  "+Lang.Mail.ConfigJs.noEnable+"</label>");
	   html.push("</li></ul>");	 
	          

       
	   html.push("</div><div class=\"parameter-wrap\">"); 
	     
	  
	   
        //从客服端发邮件时：是否保存到已发送
		if (window.LoginType != gConst.loginType.pm && window.LoginType != gConst.loginType.mm) {
		   //保存到已发送
		   html.push("<ul class=\"parameter-ul pt_10\"><li class=\"m_clearfix\">");
		   html.push("<span class=\"parameter-til\">" + Lang.Mail.ConfigJs.senddingMail + "：</span>");
		   html.push("<div class=\"parameter-conBox\">");
		   html.push("<input type=\"radio\" name='autoSave' id='autoSave1' class=\"rm_cb\" value='1'>");
		   html.push("<label for='autoSave1'>  " + Lang.Mail.ConfigJs.autoSaved + "</label>");
		   html.push("</div></li>");
		   //不保存
		   html.push("<li class=\"pl_155 next-li\" >");
		   html.push("<input type=\"radio\" name='autoSave' id='autoSave2' class=\"rm_cb\" value='0'>");
		   html.push("<label for='autoSave2'>  " + Lang.Mail.ConfigJs.index_save_sent_v_0 + "</label>")
		   html.push("</li></ul>");
		}
		
	   //从客户端收信，进行设置：是否改为已读状态、是否禁止客户端删除收信、收信全部邮件还是最近100天
	   //注意 要去掉true//
	   if (true || window.gMain && GC.check("MAIL_CONFIG_CLIENTSET")) {
	   	   //从客户端收邮件时：
		   //未读邮件自动标为已读
		   html.push("<ul class=\"parameter-ul pt_10\"><li class=\"m_clearfix\">");
		   html.push("<span class=\"parameter-til\" style=\"position:relative;\">  "+Lang.Mail.ConfigJs.khkRec+"：");
		   html.push("<span class=\"tips-default-color\" style=\"position:absolute;left:35px;top:17px;\">");
		   html.push("("+Lang.Mail.ConfigJs.popvd+")</span></span>");
	       html.push("<div class=\"parameter-conBox\">");
		   html.push("<input type=\"radio\" name='markReaded' id='statusChange' class=\"rm_cb\" value='0'>");
		   html.push("<label for='statusChange'>  "+Lang.Mail.ConfigJs.zdReaded+"</label>");
		   html.push("</div></li>");
		   //未读邮件状态不变（推荐）
		   html.push("<li class=\"pl_155 next-li\" >");
	       html.push("<input type=\"radio\" name='markReaded' id='statusNoChange' class=\"rm_cb\" value='1'>");
		   html.push("<label for='statusNoChange'>  "+Lang.Mail.ConfigJs.wdNochange+"</label>");
		   html.push("<em class=\"red-commend\">（"+Lang.Mail.ConfigJs.index_recommend+"）</em></li></ul>");
		   
		   //客户端删除邮件：
		   //禁止（推荐）
		   html.push("<ul class=\"parameter-ul pt_10\"><li class=\"m_clearfix\">");
		   html.push("<span class=\"parameter-til\">  "+Lang.Mail.ConfigJs.khddeleteMail+"：</span>");
	       html.push("<div class=\"parameter-conBox\">");
		   html.push("<input type=\"radio\" name='forbidDel' id='forbid' class=\"rm_cb\" value='1'>");
		   html.push("<label for='forbid'>  "+Lang.Mail.ConfigJs.forbid+"</label>");
		   html.push("<em class=\"red-commend\">（"+Lang.Mail.ConfigJs.index_recommend+"）</em></div></li>");
		   //不禁止
		   html.push("<li class=\"pl_155 next-li\" >");
	       html.push("<input type=\"radio\" name='forbidDel' id='no_forbid' class=\"rm_cb\" value='0'>");
		   html.push("<label for='no_forbid'>  "+Lang.Mail.ConfigJs.bforbid+"</label>");
		   html.push("</li></ul>");
		   
		   //客户端收取选项

		   html.push("<ul class=\"parameter-ul pt_10\">");
		    //最近100天| 全部
		   html.push("<li class=\"m_clearfix\">");
		   html.push("<span class=\"parameter-til\">  "+Lang.Mail.ConfigJs.khdrec+"：</span>");
	       html.push("<div class=\"parameter-conBox\">");
		   //下拉框
		   html.push("<span style='width:95px;' id=\"dropMailDate\">");
		   html.push("<span style=\"display:inline-block;\" > "); 
		   html.push("</span>");
		   html.push("</span>");
		   html.push("<label>  "+Lang.Mail.ConfigJs.demail+"</label>");
		   html.push("</div></li>");
		   //选择文件夹
		   //收件箱
		   html.push("<li class=\"pl_155 next-li\" id=\"popFolderList\">");
	       html.push("<input type=\"checkbox\" name='folderList' checked='checked' disabled='disabled' id='folderList_inbox' class=\"rm_cb\" value='2'>");
		   html.push("<label for='folderList_inbox'>"+Lang.Mail.ConfigJs.sjx+"</label></li>");
		   //垃圾邮件
		   html.push("<li class=\"pl_155 next-li\"><input type=\"checkbox\" name='folderList'   id='folderList_spam' class=\"rm_cb\" value='2'>");
		   html.push("<label for='folderList_spam'>"+Lang.Mail.ConfigJs.ljMail+"</label></li>");
		   //我的邮件夹
		   html.push("<li class=\"pl_155 next-li\"><input type=\"checkbox\" name='folderList'  id='folderList_myFolder' class=\"rm_cb\" value='2'>");
		   html.push("<label for='folderList_myFolder'>"+ Lang.Mail.ConfigJs.wodeyj +"</label><br>");
		   html.push("</li>");
		   html.push("</ul>");	
			
	   }
	   
		  html.push("</div>");
		
	 /*
  //控制全文检索
		if(GC.check("MAIL_CONFIG_FTR")){
		   //是否邮件全文检索
		   html.push("<ul class=\"parameter-ul pt_10\" id='retrieval'>");
		   //开通
		   html.push("<li class=\"m_clearfix\">");
		   html.push("<span class=\"parameter-til\">"+Lang.Mail.ConfigJs.messageRetrieval+"</span>");
		   html.push("<div class=\"parameter-conBox\">");
		   html.push("<input type=\"radio\" class=\"rm_cb\" name='openRetrieval' id='openRetrieval1' value='1'>");
		   html.push("<label for='openRetrieval1'>  "+Lang.Mail.ConfigJs.open+"</label></div></li>");
		   //不开通
		   html.push("<li class=\"pl_155 next-li\" >");
		   html.push("<input type=\"radio\" class=\"rm_cb\" name='openRetrieval' id='openRetrieval2' value='0'>");
		   html.push("<label for='openRetrieval2'> "+Lang.Mail.ConfigJs.notOpen+"</label></li></ul>");     
		}
*/
	  
	   //控制 会话/标准模式
	   if(GC.check("MAIL_MANAGER_SESSIONMODE")){
	   	   html.push("<div class=\"parameter-wrap\" style=\"border-bottom:none\">"); 
		   //会话模式
	       html.push("<ul class=\"parameter-ul pt_10\" id='modeChoise'>");
		   //标准模式
		   html.push("<li class=\"m_clearfix\">");
		   html.push("<span class=\"parameter-til\">"+Lang.Mail.ConfigJs.listView+"</span>");
		   html.push("<div class=\"parameter-conBox\">");
		   html.push("<input type=\"radio\" class=\"rm_cb\" name='twoMode' id='twoMode1' value='0'>");
		   html.push("<label for='twoMode1'>  "+Lang.Mail.ConfigJs.standartMode+"</label></div></li>");
		   //会话模式
		   html.push("<li class=\"pl_155 next-li\" >");
		   html.push("<input type=\"radio\" class=\"rm_cb\" name='twoMode' id='twoMode2' value='1'>");
		   html.push("<label for='twoMode2'>  "+Lang.Mail.ConfigJs.conversationMode+"</label>");
		   html.push("</li> </ul>"); 
		   html.push("</div>");	   
		}
	  
	
	   return html.join("");
    };

    var html = [];
    var addDiv = getAddHtml();
    //html.push(p.getNavMenu(ad.id));
    html.push("<div class=\"bodySet bodyBwList\" style='align:text;'>");
    html.push("<div id=\"container\">"); 
    html.push(this.getTopHtml()); 
    html.push(this.getLeftHtml());
    html.push("<div class=\"setWrapper\" id='prefWrapper'>");
	//加载窗口
    html.push(addDiv);
    html.push("</div>");
	html.push("<div class=\"btm_pager pl_10 percent100\" id='btm_page'>");
	html.push("<a class=\"n_btn_on mt_5\" href=\"javascript:void(0);\" onclick=\"pref.saveChanges(); return false;\">");
	html.push("<span><span>"+Lang.Mail.ConfigJs.save  +"</span></span></a>");
	html.push("<a class=\"n_btn mt_5\" onclick=\"CC.exit();\">");
	html.push("<span><span>"+Lang.Mail.ConfigJs.cancelTip+"</span></span></a>");
	html.push("<a class=\"n_btn mt_5\"  onclick=\"pref.restoreDefaults(); return false;\">");
	html.push("<span><span>"+Lang.Mail.ConfigJs.restoreDefaults+"</span></span></a></div>");
	html.push("</div></div>");
    MM[gConst.setting].update(p.attrs.id, html.join(""));
	
	//页面加载完后初始化事件
	p.initEvent(values);
};
pref.init = function(){
    this.request(this.attrs);
	
};
pref.initEvent = function(values){
	var p = this;
	pref.updatePosition("prefWrapper",79);
	p.correctWidthInIE6("prefWrapper",1);
	//根据返回数据给窗口赋值
	pref.initPreference(values);
	//如果有选择收取邮件日期的选择下拉框，则初始这个下拉框
	if (document.getElementById("dropMailDate")) {
		p.initDrop();
	}
	
	p.initCustomParam();
	
	if(CC.isBigFont()){
		p.initStyle();
	}
};

pref.initStyle = function(){
	var p		= this,
		$		= jQuery;
		
	$(".parameter-til").css("width","205px");
	$(".next-li").css("paddingLeft","216px");	
	
};

/**
 * 初始化客户端收邮件的参数设置
 */
pref.initCustomParam = function(){
	var p		= this,
		$		= jQuery,
		func	= "user:getInitData",
		len		= 0,
		i		= 0,
		limit	= 0,
		hasMy	= false,     //我的邮件夹（自定义邮件夹）是否在客户端设置中
		alDel	= 0,		 //是否容许删除
		alC		= 0,		 //是否容许改变未读为已读
		fList	= "",
		data	= {},
		fnSuc	= null,
		fnFail	= null;
			
	fnSuc	= function(cbData){
		if(cbData){
			if(cbData.folderList && cbData.folderList.length){
				
				fList = cbData.folderList;
				len   = fList.length;
				for(i=len; i--;){
					//如果有 自定义邮件夹，说明自定义邮件夹已经在客户端设置，则选中我的邮件夹
					if(fList[i].type == 3 && !hasMy){
						if(fList[i].pop3Flag == 1){
							$("#folderList_myFolder").attr("checked","checked");
						}else{
							$("#folderList_myFolder").attr("checked",false);
						}
					}
					
					//如果返回的有垃圾邮件夹，则选中垃圾邮件夹
					if(fList[i].fid == 5){
						if(fList[i].pop3Flag == 1){
							$("#folderList_spam").attr("checked","checked");
						}else{
							$("#folderList_spam").attr("checked",false);
						}
						
					}
				}
			}
			
			//全部| 最近100天
			if(cbData.userAttrs && cbData.userAttrs.popLimit){
				limit	= cbData.userAttrs.popLimit;
				p.dropAllContact.setValue(limit);
			}
			//是否容许客户端删除  注意这里要用typeof 判断
			if(cbData.userAttrs && typeof cbData.userAttrs.unallow_pop3_delete_mail != "undefined"){
				alDel	= cbData.userAttrs.unallow_pop3_delete_mail;
				$(":radio[name='forbidDel'][value="+alDel+"]").attr("checked","checked");
			}
			//是否容许客户端标记为已读   注意这里要用typeof 判断
			if(cbData.userAttrs && typeof cbData.userAttrs.unallow_pop3_change_mail_state != "undefined"){
				alC	= cbData.userAttrs.unallow_pop3_change_mail_state;
				$(":radio[name='markReaded'][value="+alC+"]").attr("checked","checked");
			}
		}
	}
	
	fnFail = function(){
		CC.showMsg(Lang.Mail.ConfigJs.getParamFail);
	}	
	
	p.ajaxRequest(func,data,fnSuc,fnFail);
};
pref.initDrop = function(){
	//实例化下拉框控件  
	//dropAllContact.getValue() 得到选中的值
	var p = pref;
	
	var dropAllContact = new DropSelect({
		id:"dropMailDate",           
		data:[{text:Lang.Mail.ConfigJs.all ,value:"0"},
		      {text: Lang.Mail.ConfigJs.zj100day,value:"1"}],
		type:"",
		selectedValue:"0",
		width:95
     });
	
	p.dropAllContact = dropAllContact;
	
	//加载下拉选项 
	jQuery("#dropMailDate").append(dropAllContact.getHTML());
	dropAllContact.loadEvent(document.getElementById("drop_select_dropMailDate"));
};
/**
 * 还原默认值
 */
pref.restoreDefaults = function(){
	var p		= this,
		$		= jQuery;
		
	 parent.CC.confirm(Lang.Mail.ConfigJs.defaultState, function(){         
        $("input[name=autoSave]:eq(1),input[name=readMode]:eq(0),input[name=joinLetter]:eq(0),"
		+"input[name=reply]:eq(0),input[name=webMailSave]:eq(1),input[name=twoMode]:eq(0),input[name=manyLetter]:eq(1),"
		+"input[name=showSummary]:eq(1)").attr("checked",'checked');
	    
		if (GC.check("MAIL_CONFIG_FONTSIZE")) {
			$("input[name=set_fontSize]:eq(1)").attr("checked",'checked');
		}
		
	    pref.saveChanges();
        }, Lang.Mail.ConfigJs.mailpop_sysPrompt, null, 'restoreDefaults');
		
	if (true || GC.check("MAIL_CONFIG_CLIENTSET")) {
		
		$(":radio[name=markReaded][value=1],:radio[name=forbidDel][value=1]").attr("checked","checked");
		if(p.dropAllContact){
			p.dropAllContact.setValue(1);
		}
	}		
};
/**
 * 初始化基本参数选项
 * @param {Object} values
 */
pref.initPreference = function(values){
	var p=pref;
	
    //根据RM的接口返回的values初始化个单选框的值
 	var v1=values.smtpsavesend;             	//客户端自动保存
	var v2=values.preference_reply;				//是否加入原信
	var v3=values.preference_reply_title;		//回复主题前缀
	var v4=values.preference_letters;			//显示多少封
	var v5=values.mailcontentdisplay;   		//是否显示正文摘要
	var v6=values.readmailmode;					//查看邮件模式
	var v7=values.fts_flag;						//全文检索
	var v9 = values._custom_sendsave;			//web发信保存
	
	//设置大小号字体
	var v10 = gMain.defaultFontSize;
	
	if (typeof(v9) == "undefined" || v9 == "") {
		v9 = CC.getSentSaveDefault();
	}
	
	//防止后台有漏洞，没有输出大小字号的值，前端给个默认值
	/*
if(typeof(v10) == "undefined" || v10 == ""){
		//v10 = gMain.defaultFontSize;
		v10 = "normalfont";
	}
*/
	
	//保存初始的字号
	//p.old_fontSize = v10;
	
	//当前设置的字体（直接从gmain里面取值）
	p.old_fontSize = gMain.defaultFontSize;
	
	//根据gMain上的sessionMode得到当前会话模式的值
	var v8=parseInt(gMain.sessionMode); 
	
	//给页面赋值
    jQuery("input[name=autoSave][value="+v1+"]").attr("checked",true);
	jQuery("input[name=joinLetter][value="+v2+"]").attr("checked",true);
	jQuery("input[name=reply][value="+v3+"]").attr("checked",true);
	jQuery("input[name=manyLetter][value="+v4+"]").attr("checked",true);
	jQuery("input[name=showSummary][value="+v5+"]").attr("checked",true);
	jQuery("input[name=readMode][value="+v6+"]").attr("checked",true);
	//jQuery("input[name=openRetrieval][value="+v7+"]").attr("checked",true);
	jQuery("input[name=twoMode][value="+v8+"]").attr("checked",true);
    jQuery("input[name=webMailSave][value="+v9+"]").attr("checked",true);

	if (GC.check("MAIL_CONFIG_FONTSIZE")) {
		jQuery("input[name=set_fontSize][value="+v10+"]").attr("checked",true);
	}
	
};

/**
 * 得到我的邮件下面所有邮件夹的id，分别构建成对象，然后通过一个数组返回
 * 
 * [{
			"func": "mbox:updateFolders",
			"var": {
				fid: 23,
				type: 6
			}
	},
	{
			"func": "mbox:updateFolders",
			"var": {
				fid: 24,
				type: 6
			}
	}	
	] 
 * 
 *setPop  是否可pop
 */
pref.getMyFolderData= function(arr,data,setPoP){
	var p 		= this,
		i		= 0,
		fid 	= "",
	   len		= data.length,
	   pop3Flag = 0;
	   
	if(setPoP){
		pop3Flag = 1;
	}   
						
	for(i = len; i--;){
		(function(i){
			var oData 	= {
						"func": "mbox:updateFolders",
						"var": {
							fid: "",
							type: 4,
							pop3Flag:pop3Flag
						}
					  };
			//[type:3  ---> 自定义邮件夹]
			if(data[i].type == 3){
				//如果有自节点，递归一下，把子对象Push进去，注意arr是引用类型
				if(data[i].nodes && data[i].nodes){
					p.getMyFolderData(arr,data[i].nodes,setPoP);
				}
				fid				 = data[i].fid;
				oData["var"].fid = fid;
				arr.push(oData);
			}
		})(i);
	}   	 
	return arr;   
	
};
/**
 * 保存参数修改
 */
pref.saveChanges = function(){
	var p = pref;
	var $ = jQuery;
	//得到当前 会话模式 选中的值
	var iMode = parseInt($(":radio[name=twoMode][checked]").val());
	
	//上传基本参数选中值的数据，不包括会话模式，因为用了不同的接口，要另一个AJAX请求
	var data = {
		smtpsavesend			: parseInt($(":radio[name=autoSave][checked]").val()),
		preference_reply		: parseInt($(":radio[name=joinLetter][checked]").val()),
		preference_reply_title	: parseInt($(":radio[name=reply][checked]").val()),
		preference_letters		: parseInt($(":radio[name=manyLetter][checked]").val()),
		mailcontentdisplay		: parseInt($(":radio[name=showSummary][checked]").val()),
		_custom_sendsave		: parseInt($(":radio[name=webMailSave][checked]").val())
	};
	var arr 		= [];
	var dataFolders = p.getFolders([GE.folder.sys,GE.folder.user]);
	
	var dataMardReaded = {
		type: 2,
		value: $(":radio[name=markReaded][checked]").val()
	}, dataForbidDel = {
		type: 1,
		value: $(":radio[name=forbidDel][checked]").val()
	}, dataSelectDate = "",
	 dataInbox = {
		fid: 1,
		type: 4,
		pop3Flag:1
	}, dataSpam = null,
	 oMyFolder = null;
	 
	if (true ||GC.check("MAIL_CONFIG_CLIENTSET")) {
		dataSelectDate = {
			type: 0,
			value: p.dropAllContact.getValue()
		}
	} 
	
	if($("#folderList_spam").attr("checked") == "checked"){
		//可POP
		dataSpam = {
			fid: 5,
			type: 4,
			pop3Flag:1
		};
	}else{
		//不可POP
		dataSpam = {
			fid: 5,
			type: 4,
			pop3Flag:0
		};
		
	}
	
	if($("#folderList_myFolder").attr("checked") == "checked"){
		//获取提交数据--自定义邮件夹
		oMyFolder = p.getMyFolderData(arr,dataFolders,1);
	}else{
		oMyFolder = p.getMyFolderData(arr,dataFolders);
	}
	
	//控制全文检索
	/*
	 if (GC.check("MAIL_CONFIG_FTR")) {
	 data.fts_flag = parseInt($(":radio[name=openRetrieval][checked]").val());
	 }
	 */
	//控制 邮件查看模式	
	if (GC.check("MAIL_CONFIG_READMODE")) {
		data.readmailmode = parseInt($(":radio[name=readMode][checked]").val());
	}
	
	//会话模式上传的数据
	var  sessionDate = {
				flag: parseInt($(":radio[name=twoMode][checked]").val())
			};
		
		/*** (start) 减少http请求，按队列一次性提交 ***/
		
		var postArr = [], oSetAttrs = {
			"func": "user:setAttrs",
			"var": {
				"attrs": data
			}
		}, oSession = {
			"func": "mbox:setSessionMode",
			"var": sessionDate
		}, oMarkReaded = {
			"func": "mbox:setUserFlag",
			"var": dataMardReaded
		}, oForbidDel = {
			"func": "mbox:setUserFlag",
			"var": dataForbidDel
		}, oSlectDate = {
			"func": "mbox:setUserFlag",
			"var": dataSelectDate
		}, oInbox = {
			"func": "mbox:updateFolders",
			"var": dataInbox
		}, oSpam = {
			"func": "mbox:updateFolders",
			"var": dataSpam
		}; 
		
		//载入基本参数提交数据
		postArr.push(oSetAttrs);
		
		//通过权限判断是否提交： 会话模式	
		
		 /*if (GC.check("MAIL_CONFIG_SESSIONMODE")){
			 postArr.push(oSession);
		 }*/

		//通过权限判断是否提交： 客户端设置
		if (true ||GC.check("MAIL_CONFIG_CLIENTSET")) {
			if(dataInbox){
				postArr.push(oInbox);
			}
			
			if(dataSpam){
				postArr.push(oSpam);
			}
			
			if(oMyFolder){
				postArr = postArr.concat(oMyFolder);
			}

			
			postArr.push(oMarkReaded);
			postArr.push(oForbidDel);
			postArr.push(oSlectDate);
		}
		
		postArr = {
			items: postArr
		};
		
		//先设置基本参数----->成功后设置会话模式------>成功后设置大小字号
		p.ajaxRequest("global:sequential", postArr, function(cdData){
			//cdData cdData["var"]
			if (false && cdData && cdData.result) {
				var result = cdData.result;
				
				//基本参数是否设置成功  [0--->表示成功]
				if (typeof result[0] != "undefined" && result[0] == 0) {
					//并且改变页面参数的值
					p.changeSet(data, iMode);
				}else{
					p.fail(Lang.Mail.ConfigJs.setParaFail);
					return;
				}							
			}
			
			//并且改变页面参数的值
			p.changeSet(data, iMode);
			
			//控制 会话/标准模式
			if (GC.check("MAIL_MANAGER_SESSIONMODE")) {
				p.ajaxSession();
			}//再改变大小字号，这个接口是调用内部的，所有不能走队列
			else if (GC.check("MAIL_CONFIG_FONTSIZE")) {
				p.ajaxFontSize();
			}else{
				
				CC.showMsg(Lang.Mail.ConfigJs.settingSuc, true, false, "option");
				p.init(p.attrs.id);
			}			
		}, function(){
			p.fail(Lang.Mail.ConfigJs.setParaFail);
		})
		/***  (end) 减少http请求，按队列一次性提交 ***/
	
	};
	
	pref.ajaxSession = function(){
		
		var p 		= this,
			$		= jQuery,
			iMode	=  parseInt($(":radio[name=twoMode][checked]").val()),
			sessionDate = {
				flag:iMode
			};

		//改变会话模式的AJAX请求
		p.ajaxRequest("mbox:setSessionMode", sessionDate, function(){
			gMain.sessionMode = iMode;//改变gMain的模式 使得页面及时更新保存的数据
			
			//再改变大小字号，这个接口是调用内部的，所有不能走队列
			if (GC.check("MAIL_CONFIG_FONTSIZE")) {
				p.ajaxFontSize();
			}else{
				CC.showMsg(Lang.Mail.ConfigJs.settingSuc, true, false, "option");
				p.init(p.attrs.id);
			}
			
		}, function(){
			p.fail(Lang.Mail.ConfigJs.setSessionFail)
		});
	};
	
	pref.ajaxFontSize = function (){
		
		var p = this,
			$ = jQuery;
			
		//控制字号 设置大小字号  现在必须先调用应用层 配置过的接口，不能直接调用RM接口
		//所以要单独请求，和其他设置分开请求
		
		
		//设置大小字号上传的数据  [defaultFontSize  后台接收的字段]  以前RM用这个 _custom_fontSize
		var data_fontSize = p.data_fontSize = {
			defaultFontSize: $(":radio[name=set_fontSize][checked]").val()
		};
		
		//[new_fontSize  当前选择的字号    old_fontSize 当前设置的字号]
		var new_fontSize = data_fontSize.defaultFontSize;
		
		if (GC.check("MAIL_CONFIG_FONTSIZE")) {
			//如果设置字号已经改变，则执行
			if (p.old_fontSize != new_fontSize) {
				//改变字号
				ChangeSkin.changeFont(new_fontSize);
				
			}
		}
		
		//AJAX请求 ---设置大小字号，因为请求地址不同，使用Ajax通用方法比较好修改不同的地址
		//mail/data.do?func=mail:setAttrs

		
		p.Ajax("mail:setAttrs", data_fontSize, function(){
			//成功后提示：参数保存成功
			CC.showMsg(Lang.Mail.ConfigJs.settingSuc, true, false, "option");
			//改变gMain的模式 使得页面及时更新保存的数据
			gMain.defaultFontSize = data_fontSize.defaultFontSize.toString();
			CC.showMsg(Lang.Mail.ConfigJs.settingSuc, true, false, "option");
			
			//改变全文搜索框
			Main.initAllSearchDivWidth();
			p.init(p.attrs.id);
		}, function(){
			p.fail(Lang.Mail.ConfigJs.setFontSizeFail);
		}, "/mail/data.do");
	
	};
	
	pref.fail = function(tip){
		CC.showMsg(tip,true,false,"error");
	};
	
	/**
	 * AJAX请求通用方法,可供其他设置页面方法调用
	 * @param {Object} func
	 * @param {Object} data
	 * @param {Object} callback
	 */
	pref.Ajax = function(func, data, callback, failcallback, url){
		var url = url || "/addr/user";
		parent.MM.doService({
			url: url,
			func: func,
			data: data,
			failCall: failcallback,
			call: callback,
			param: ""
		});
	};
	
	
	/**
	 * 改变页面gMain的默认值
	 * @param {Object} data
	 * @param {Object} n 会话模式或标准模式
	 */
	pref.changeSet = function(data, n){
		var $	= jQuery;
		
		if (typeof data.preference_letters != "undefined" && data.preference_letters !== "") {
			gMain.pageSize = data.preference_letters.toString();
		}
		if (n !== "") {
			gMain.sessionMode = n.toString();
		}
		if (typeof data.mailcontentdisplay != "undefined" && data.mailcontentdisplay !== "") {
			gMain.showSummary = data.mailcontentdisplay.toString();
		}
		if (typeof data._custom_sendsave != "undefined" && data._custom_sendsave !== "") {
			gMain.sendSave = data._custom_sendsave.toString();
		}
		//gMain.ftsFlag = data.fts_flag+"";
		
		/*
		 if (GC.check("MAIL_CONFIG_FONTSIZE")) {
		 if(typeof data._custom_fontSize != "undefined" && data._custom_fontSize !== ""){
		 gMain.defaultFontSize = data._custom_fontSize.toString();
		 }
		 }
		 */
		/*
		 if (gMain.ftsFlag && gMain.ftsFlag == "1") {
		 Main.searchKeyStr = Lang.Mail.advSearch_SearchMail;
		 $("txtAdvSearch").value = Main.searchKeyStr;
		 $("#txtAdvSearch").removeAttr("style");
		 }
		 else{
		 Main.searchKeyStr = Lang.Mail.search_SearchMail;
		 $("txtAdvSearch").value = Main.searchKeyStr;
		 $("#txtAdvSearch").removeAttr("style");
		 }
		 */
		if (typeof data.readmailmode != "undefined" && data.readmailmode !== "") {
			gMain.readMailMode = data.readmailmode.toString();
		}
		if (typeof data.preference_reply_title != "undefined" && data.preference_reply_title !== "") {
			gMain.replyPrefix = data.preference_reply_title.toString();
		}
		if (typeof data.preference_reply != "undefined" && data.preference_reply !== "") {
			gMain.addo = data.preference_reply.toString();
		}
		
	}




