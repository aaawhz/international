/**
* @author Jiangwb
*  
*/

//翻译时请从语言包中查找类似的多语言Key，我这儿填写的不一定是正确的中文提示语。

var black = new OptionBase();

black.attrs = {
    id: 'black',
    authority: 'MAIL_CONFIG_ANTIVIRU',
    divid: 'pageWhiteList',
    type: 0, //0黑名单 1白名单	
    opType: { add: 'add', del: 'delete' },
    list: { type: 'xml', func: gConst.func.getWBList, data: { type: 0} },
    save: { type: 'xml', func: gConst.func.setWBList, data: { opType: 'add', type: 0, member: ''} },
	op : "",
	bSave : true,
	initValue : Lang.Mail.ConfigJs.semicolon
};

black.init = function(id,mail) {
    this.mail = mail;
	if (id) {
        this.attrs.id = id;
        var type = 0;
        if (id == 'black') {
            type = 0;
            //this.attrs.authority = 'MAIL_CONFIG_BLACK';
        }else {
            //this.attrs.authority = 'MAIL_CONFIG_WHITE';
            type = 1;
        }
        this.attrs.type = type;
        this.attrs.list.data.type = type;
        this.attrs.save.data.type = type;
    }
    this.request(this.attrs);
};
/**
 * 清空名单
 */
black.emptyMails = function(){
	var emails="";
	var objs = document.getElementsByName('checkMail');
	for (var i = 0, len=objs.length; i < len; i++) {
		emails += objs[i].parentNode.nextSibling.innerHTML+",";
	}
	var s = emails;
	emails = s.substring(0,s.length-1);
	black.save(emails,'empty');
};


/**
 * 删除名单
 */
black.deleteBlackList = function(){
	var emails="";
	var isCheck = false;
	var objs = document.getElementsByName('checkMail');
	for (var i = 0, len=objs.length; i < len; i++) {
		if(objs[i].checked){
			emails += objs[i].parentNode.nextSibling.innerHTML+",";
			isCheck = true;
		}
	}
	var s = emails;
	emails = s.substring(0,s.length-1);
	if(!isCheck){
		parent.CC.alert(Lang.Mail.ConfigJs.choiseMailTip);
	}
	else{
		black.save(emails,'delete');
	}
	
};
/**
 * 得到黑白名单html
 * @param {Object} ad
 * @param {Object} emails
 */
black.getHtml = function(ad, emails) {
    var p = black;
    p.attrs.emails = emails;
    var getListObj = function() {
    var title = "";
        var ao = { title: title, items: [] };
		//<input type='checkbox' onclick='black.selectAll(this)'/>
        ao.head = { title: ["", Lang.Mail.ConfigJs.filter_emailaddress, Lang.Mail.ConfigJs.filter_operate], className: ['td1', 'td2', 'td3'] };

	    if (typeof (emails) == 'object' && emails.length > 0) {
            for (var i = 0; i < emails.length; i++) {
				if(emails[i] != ""){
					var mail = emails[i].encodeHTML();
					try{
					 ao.items[i] = [];
                     ao.items[i][0] = "<input type='checkbox' name='checkMail'/>";
                     ao.items[i][1] = mail;
                     ao.items[i][2] = ('<a onclick="black.save(\'{0}\',\'delete\'); return false;"  href="javascript:void(0)">'+Lang.Mail.ConfigJs.filter_delete+'</a>').format(mail);
                    }catch(e){}
                }	
     
            }
        } else {
        	ao.items = p.attrs.type == 0 ? Lang.Mail.ConfigJs.NoCreateBlackList : Lang.Mail.ConfigJs.NoCreateWhiteList;
        }
		
        return ao;
    };
	
	var getNoList = function(){
		var listHtml = [];
		var wbTip = black.attrs.type == 0 ? Lang.Mail.ConfigJs.NoCreateBlackList  : Lang.Mail.ConfigJs.NoCreateWhiteList;
		listHtml.push("<p class=\"set_rule_box_tips\">"+wbTip+"</p>");
	    return listHtml.join("");
	}

    var getAddHtml = function() {
        var html = []
        html.push("<div class=\"bwSet\" >"); 
        html.push("<h2 class=\"set_til\">");
        html.push(p.attrs.type == 0 ? Lang.Mail.ConfigJs.setBlackList : Lang.Mail.ConfigJs.setWhiteList);
		html.push("<span class=\"\">({0})</span>".format(p.attrs.type == 0 ? Lang.Mail.ConfigJs.Rejection : Lang.Mail.ConfigJs.sureReceive ));
        html.push("</h2>");
		html.push("<fieldset class=\"formSet\">");
        html.push("<div class=\"write_adr_wrap\">");
       // html.push("<div style='position:relative;width:500px;height:32px;'><table  cellpadding=\"0\">");
        html.push("<table  cellpadding=\"0\"><tbody><tr><td width='455' >");
               
        html.push("<div class=\"set-txt-wrap4\">");
		
        html.push("<input id=\"option_wblist\" style='width:415px;height:30px;color:#BFBFBF;border:none;height:28px; line-height:28px;' ");
        html.push(" class=\"clearfix\" value='" + Lang.Mail.ConfigJs.semicolon + "'");
        html.push(" type=\"text\" maxLength='146'><i title='"+Lang.Mail.ConfigJs.chooseFromMailList+"' " +
            "class=\" i-rush\" id='addContact'></i></div></td><td width=\"75\">");
        html.push("<a href=\"javascript:void(0);\" id=\"AAdd\" onclick=\"black.save(); return false;\" class=\"add_Link\" " +
            "style='display:inline-block;zoom:1;margin-top:0px;vertical-align:middle'>");
        html.push("<i class=\"i_addMail\"></i>" + Lang.Mail.ConfigJs.filter_add + "</a></td>");
        html.push("</tr>");
        html.push("</tbody></table>");
        html.push("</div>");
        html.push("</fieldset>");
        html.push("</div>");
		
        return html.join("");
    };

    var html = [];
    var addDiv = getAddHtml();
    var tabList = p.getTableList(getListObj());
    //html.push(p.getNavMenu(ad.id));
    html.push("<div class=\"bodySet bodyBwList\" style='align:text;position:relative'");
    if (ad.divId) {
        html.push(" id=\"{0}\"".format(ad.divId));
    }
    html.push("><div id=\"container\" style=\"position:relative\">");

    html.push(this.getTopHtml());
    html.push(this.getLeftHtml());
    html.push("<div class=\"setWrapper\" id='blackWrapper' style=\"position:relative\">");
    html.push(addDiv);
    if( black.attrs.emails.length>0){

        html.push(tabList);
        html.push("<p class=\"set_table_btm\" id='blackTabel'> ");
        html.push("<a class=\"n_btn mt_5\" onclick='black.deleteBlackList(); return false;'>");
        html.push("<span><span>"+Lang.Mail.ConfigJs.deleteTip+"</span>");
        html.push("</span></a> <a class=\"n_btn mt_5\" href=\"javascript:void(0);\" style='margin-left:25px'>");
        html.push("<span onclick='black.emptyMails(); return false;' >");
        html.push("<span>"+Lang.Mail.ConfigJs.empty+"</span></span></a></p>");
    }
    else{
        html.push(getNoList());
    }


    html.push("</div></div></div>");
    MM[gConst.setting].update(p.attrs.id, html.join(""));
	p.updatePosition("blackWrapper");
	p.initEvent();
	      
};

black.initEvent = function(){
	var p = black;
	
	var IWidth = window.document.documentElement.clientWidth || window.document.body.clientWidth;
    var a_width = IWidth - 36;
	
	
    p.correctWidthInIE6("blackWrapper",1);
	
	jQuery("#addContact").mouseover(function(){
		jQuery(this).attr("class","i-rush-on");										 
	}).mouseout(function(){
		jQuery(this).attr("class","i-rush");		
	});
	
	jQuery("#addContact").click(function(){
		p.addWhiteDialog();									 
	});
	
	var ele = jQuery('#option_wblist');
        ele.keydown(function(evt){
			if (EV.getCharCode(evt) == 13) {
	            	black.save();
	            }
			evt.stopPropagation();	
		});
		
    jQuery("#option_wblist").focus(function(){
		
	  if (p.attrs.initValue == "") {
           p.attrs.initValue = jQuery("#option_wblist").val();
        }
		
	
        if (jQuery("#option_wblist")[0].value == p.attrs.initValue) {
            jQuery("#option_wblist").val("");
            jQuery("#option_wblist").css("color", "black");
        }
	  }).blur(function(){
		 if (jQuery("#option_wblist")[0].value == '' || jQuery("#option_wblist")[0].value == null) {
            jQuery("#option_wblist").val(p.attrs.initValue);
            jQuery("#option_wblist").css("color", "#BFBFBF");

        }
   
	});	
};
/**
 * 删除黑白名单
 * @param {Object} type 黑白名单的类型
 */

black.deleteList = function(type,deleteEmails){
	var p = this;

	p.ajaxRequest("user:setWhiteBlackList",  {
		opType : "delete",
		type : type,
		member : deleteEmails.join(",")
	}, function(ao) {
		if (window.LoginType == gConst.loginType.pm || window.LoginType == gConst.loginType.mm) {
			p.addExtLog("delete",deleteEmails);
		}
	});
	
};
/***
* 新增黑白名单
* @param {Object} email邮件地址(可选)
* @param {Object} op 删除或清空操作类型
*/
black.save = function(email,op) {
    var p = black;
    var data = black.attrs.save.data;
    var emails = p.attrs.emails.join(",");
	if (op != null || op != "") {
	    p.attrs.op = op;
	}
    if (email) {//如果email传过来了，说明是删除或清空的操作
    		
        data.opType = p.attrs.opType.del;
        data.member = email.trim();
        
        
        var delBlack=function(){   		 		
    		data.opType = p.attrs.opType.del;
			
        	data.member = email;
        	
    		p.ajaxRequest(p.attrs.save.func, data, function(ao) {
				if (window.LoginType == gConst.loginType.pm || window.LoginType == gConst.loginType.mm) {
					p.addExtLog("delete",email);
				}
				
				if(p.attrs.op == "delete"){
					if(p.attrs.type == 0){
					  CC.showMsg(Lang.Mail.ConfigJs.blackDeleteSuc,true,false,"option");
					}else{
					  CC.showMsg(Lang.Mail.ConfigJs.whiteDeleteSuc,true,false,"option");
					}
				}else{
					if(p.attrs.type == 0){
					  CC.showMsg(Lang.Mail.ConfigJs.blackEmpty,true,false,"option");
					}else{
					  CC.showMsg(Lang.Mail.ConfigJs.whiteEmpty,true,false,"option");
					}
				}
				
		        p.init(p.attrs.id);
		    }, function(ao) {
		         p.fail(Lang.Mail.ConfigJs.filter_saveFail);
		      
		    });	    	    
    	}
		//清空的提示
		if (black.attrs.op == "empty") {
			var oTips =(black.attrs.type == 0) ? Lang.Mail.ConfigJs.emptyBlackTip : Lang.Mail.ConfigJs.emptyWhiteTip;
    	    CC.confirm(oTips, delBlack,Lang.Mail.ConfigJs.mailpop_sysPrompt , function(){});	
		}else{
			delBlack();
		}
			
        
    }
    else {
		//如果email没传过来，这是新增黑白名单，值直接在输入框取
        data.opType = p.attrs.opType.add;
        var email = $('option_wblist').value.replace(/[;；，]/g, ',');
		var sDomain = gMain.domain.trim();
		var reDomain = eval("/"+sDomain+"$/gi");
		var arrEmail = email.split(',');
		email = email.trim();
		
        if (email == "") {
			
         CC.alert(Lang.Mail.ConfigJs.InputMail);
            return;
        }
		
		//如果用户最后输入了 分号; 则把最后一个分号去掉 
		if(email.substr(email.length-1,1) == ','){
			email = email.substring(0,email.length-1);
		}
		
		for(var i=0,len=arrEmail.length; i<len; i++){
			if(sDomain && p.attrs.type==0 &&
			   arrEmail[i].substr(arrEmail[i].indexOf("@")+1) == sDomain){
				//不能把本域的人加入黑名单
			    //CC.alert(Lang.Mail.ConfigJs.InputMail);
				setTimeout(function(){
					top.CC.alert(Lang.Mail.ConfigJs.forbidAddBlackTo);
				},100)
				
				return;
			}
		}
		
		//去重
		email = email.split(",");
		email = email.unique();
		email = email.join(",");
		//判断输入的地址是否在另个一个名单中
		p.existBlack(email);
		
		
   }
             /*
if (!Vd.checkData('email', email) && !Vd.checkData('blackDomain',email)) {
                  CC.alert(Lang.Mail.ConfigJs.filter_emailErr);
                  return;
              }
*/
    
	
};

	  

/**
 * 检查黑名单添加的联系人是否在白名单
 */
black.existBlack = function(emails){
	var p = this;
	p.attrs.bSave = true;
	var inputEmails = emails.split(","); //获取输入框的邮件地址
	var len = inputEmails.length;
	var exitEmails = []; //已经存在的地址
	var i = 0;
	var isExit = false; //另一个名单是否存在当前地址
	var oldEmails = [];//  另一个名单已经存在的地址
	var type = p.attrs.type;
	var tip = type == 0 ? Lang.Mail.ConfigJs.whiteRecordClear : Lang.Mail.ConfigJs.blackRecordClear;
	var type1 = type==0? 1 : 0;
	//如果当前为黑名单，则请求白名单列表的数据,并与输入的邮箱地址对比，如白存在则提示
	//反之亦然

		p.ajaxRequest("user:getWhiteBlackList", {type:type1}, function(ao) {
 
		   oldEmails = ao;
		   for(i=0; i<len; i++){
				//如果存在则把当前地址放到需要重复的地址中
				if(oldEmails.has(inputEmails[i])){
					isExit = true;
					exitEmails.push(inputEmails[i]);
				}
			}
			
			if(isExit == true){
				p.attrs.bSave = false;
				//提示另一个名单有该地址记录，是否清除
				parent.CC.confirm(tip, function(){
			            //先在另一个名单删除这些地址
						p.deleteList(type1,exitEmails);					
						p.addMails(emails);//检查邮件地址合法后保存这些地址
					}, Lang.delete_confirm, null, 'delEmails');
			}else{
				p.addMails(emails);//检查邮件地址合法后保存这些地址
			}
    	}, function() {            
    	});
		
}

/**
 * 检查email地址是否存在黑名单中，存在则执行successCallback, 否则执行failCallback
 */
black.checkMailExist = function(emails, successCallback, failCallback){
	var func = 'user:getWhiteBlackList';
	var mails = [], mailObjs = {}, existMails = [];
	var sFun = successCallback || function(){};
	var fFun = failCallback || function(){};
	var isExit = false;
	var p = this, type = 1;//type =>  [1： 白名单， 0：黑名单]
	
	if(emails){
		mails = emails.split(',');
		for(var i=0, l=mails.length;i<l;i++){
			mailObjs[mails[i]] = true;
		}
		p.ajaxRequest(func, {type:type}, function(ao) {
			if(ao && ao.length){
				for(var i=0, l=ao.length;i<l;i++){
					if(ao[i] && mailObjs.hasOwnProperty(ao[i])){
						isExit = true;
						existMails.push(ao[i]);
					}
				}
				if(isExit){
					sFun(emails, existMails);
				}
				else{
					fFun(emails);
				}
			}
			else{
				fFun(emails);
			}
		}, function(){
			
		});
	}
};

/**
 * 检查邮件地址合法后保存
 */
black.addMails = function(email){
       
        
        var p = black;
		var emails =  p.attrs.emails.join(",");//当前名单已存在的邮箱地址
		//给上传数据赋值
		var data = black.attrs.save.data;
		var aNoRepeateMails = [];
		//用户输入的邮箱地址
		data.member = email;
		//设置成功黑白名单提示
	    var tip = p.attrs.type == 0 ? Lang.Mail.ConfigJs.setBlackSuc : Lang.Mail.ConfigJs.setWhiteSuc; 
        //支持同时添加多个黑名单功能
        var memberArr = data.member.split(',');
		var leng = memberArr.length;
        for (var i = 0; i < leng; i++)
         {
		 	  var isRepeate = false;
			
		 	    //判断是否有非法的地址
	            if (!Vd.checkData('email', memberArr[i]) && !Vd.checkData('blackDomain', memberArr[i])) {
	                 //CC.alert(Lang.Mail.ConfigJs.filter_emailErr);
					 
	                 CC.alert(Lang.Mail.ConfigJs.rightMailAdressTip+gMain.domain); 
					 return;
	            }
				//判断邮箱地址有没有重复
	            if (memberArr[i] != "") {
		            
					for(var j=0,len=emails.split(',').length; j<len; j++) {
						if (emails.split(',')[j].toLowerCase() == memberArr[i].toLowerCase().trim()){
						
						     isRepeate = true;
							//如果用户值输入一个地址而且重复，就提示重复，否则增加没有重复的地址
							if(leng == 1){
								CC.alert(memberArr[i] + Lang.Mail.ConfigJs.MailExist); 
		                   	    return;
							}
							
						}
						
		             }
	        	 }
				 if(!isRepeate){
				 	aNoRepeateMails.push(memberArr[i]);
				 }
				 
	    }
		//得到非重复地址的数组，作为提交地址
		
		var noRepLen = aNoRepeateMails.length;
		if(noRepLen > 1){
			data.member =aNoRepeateMails.join(",");
		}else if(noRepLen == 1){
			data.member = aNoRepeateMails.join("");
		}else{
			CC.alert(Lang.Mail.ConfigJs.mailDomainExists);
			return;
		}
		
	  
        p.ajaxRequest(p.attrs.save.func, data, function(ao) {
			//如果是公共邮箱，增加后保存到日志
			if(window.LoginType == gConst.loginType.pm || window.LoginType == gConst.loginType.mm){
				p.addExtLog("add",email);
			}
           CC.showMsg(tip,true,false,"option");
           p.init(p.attrs.id);
    	}, function(ao) {
       	  p.fail(Lang.Mail.ConfigJs.filter_saveFail);
      
    	});
        
    
};
/**
 * 增加或删除黑名单，在公共邮箱增加操作日志
 * @param {Object} opType 操作类型
 * @param {Object} mails 操作的邮箱
 */
black.addExtLog = function(opType,mails){
	var p = this;
	var data = {
		opType:opType,
		type : p.attrs.type,
		member : mails
	}
	//p.ajaxRequest("log:setBlackWhiteList",data);
   MM.doService({
        url: "/log/log",
        func: "log:setBlackWhiteList",
        data: data,
        failCall: function(d){
        },
        call: function(ao){
			
        },
        param: ""});
			
};

black.showContactDialog = function(type, callback, cancelcallback, attrs){
		contact = new parent.Contact("contact");
		contact.groupMap = LMD.groupMap;
		contact.group_contactListMap = LMD.group_contactListMap_mail;
		contact.inItContanct(black.attrs.id + "_ContactDialog",type,callback,null);
};
black.addWhiteDialog = function(){
	var p = this;
	var type = ["0","2"];
	var callback = function(ao){
		var emails = "";
		var oldValues = jQuery("#option_wblist").val();
		
		for(var i = 0, l=ao.length; i<l; i++){
			var e = ao[i].value;
		
			e = encodeURI(e);
			var email = p.getClearEmail(e);
		
			emails += email + ";";
			
			//p.whiteListData[p.getEmailName(email)] = email;
		}
		
		if(oldValues != p.attrs.initValue){
			if(oldValues != "" && oldValues.substr(oldValues.length-1,1) != ";"){
				oldValues = oldValues + ";";
				
			}
	
			jQuery("#option_wblist").css("color","black").val(oldValues+emails).focus();	
		}else{
			jQuery("#option_wblist").css("color","black").val(emails).focus();
		}
		//p.updateListItem('w');
	}
	black.showContactDialog(type, callback);
};
black.addBlackDialog = function(){
	var p = this;
	var type = ["0","2"];
	var callback = function(ao){
		var email;
		for(var i = 0, l=ao.length; i<l; i++){
			email = p.getClearEmail(ao[i].value);
			//p.blackListData[p.getEmailName(email)] = email;
		}
		//p.updateListItem('b');
	}
	black.showContactDialog(type, callback);
};
black.getClearEmail = function(email){
	email = decodeURI(email);
	
	var start = email.indexOf('<')+1;
	var len = email.lastIndexOf('>') - start;
	return email.substr(start, len);
};
/**
 * 获取黑白名单数据
 * @param int type: 0取黑名单，1取白名单
 */
black.getBlackWhiteList = function(type, successCB, failCB){
	this.ajaxRequest('user:getWhiteBlackList', {type:type}, function(ao){
		successCB(ao);
	}, function(ao){
		failCB(ao);
	});
};

/**
 * 增加黑白名单
 * @param {Object} emails
 */
black.addBlack = function(emails, sCB){
	var p = this;
	var ms;
	emails = emails.replace(/\s*/g, '');
	// email 校验
	ms = emails.split(',');
	for(var i=0;i<ms.length;i++){
		if(!Vd.checkData('email', ms[i]) && !Vd.checkData('blackDomain', ms[i])){
			CC.alert(Lang.Mail.ConfigJs.rightMailAdressTip+gMain.domain);
			return;
		}
	}
	
	sCB = sCB || function(){};
	var successCallback = function(emails, existMails){
		parent.CC.confirm(Lang.Mail.ConfigJs.whiteRecordClear, function(){
			p.deleteList(1, existMails);
			checkBlackAndInsert(emails);
		}, Lang.delete_confirm, null, 'delEmails');
	};
	var failCallback = function(emails){
		checkBlackAndInsert(emails);
	};
	
	function checkBlackAndInsert(emails){
		var sEmails = ',' + emails + ',';
		function ok(mails){
			if(mails && mails.length){
				for(var i=0, l=mails.length;i<l;i++){
					sEmails = sEmails.replace(','+mails[i]+',',',');
				}					
			}
			if(sEmails && sEmails.length > 2){
				sEmails = sEmails.substr(1);
				sEmails = sEmails.substr(0, sEmails.length-1);
				addBlack(sEmails);
			}
			sCB();
		}
		function fail(){
			addBlack(emails);
			sCB();
		}			
		black.getBlackWhiteList(0, ok, fail);
	}
	
	function addBlack(emails){	
		if(emails){
			var data = {
				opType: 'add',
				type: 0,
				member: emails
			};
			p.ajaxRequest(p.attrs.save.func, data, function(d){
				CC.showMsg(Lang.Mail.ConfigJs.addedSenderToBlack,true,false,"option");
			}, function(){
				//CC.alert(Lang.Mail.ConfigJs.filter_saveFail);
			});	
		}
		else{
			CC.alert(Lang.Mail.ConfigJs.filter_saveFail);
		}
	}
	
	if(emails == ""){
		sCB();
	}
	else{
		p.checkMailExist(emails, successCallback, failCallback);
	}
};

var white = black;
