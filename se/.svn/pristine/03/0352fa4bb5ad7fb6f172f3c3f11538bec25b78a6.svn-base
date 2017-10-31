var folderlock = new OptionBase();
folderlock.attrs = {
    id : 'folderlock',
    authority: 'MAIL_CONFIG_LOCK',
    divId:'pageFolderlock',
	noReq: true
};
folderlock.init = function(){
    this.request(this.attrs);
};
folderlock.getHtml = function(attrs, values){

    var html = [];
    var p = this;
	var addHtml = p.getAddHtml();
	
    html.push("<div class=\"bodySet\" style='align:text;' id=\"pageUserAlias\">");

    html.push("<div id=\"container\">"); 
    html.push(this.getTopHtml());           //加载顶部的菜单栏
    html.push(this.getLeftHtml());          //加载左侧的菜单栏
    // html.push(this.getNavMenu(p.attrs.id));
    html.push("<div class=\"setWrapper\" id='setWrapp'>");
	html.push(addHtml);                     //加载具体内容页面

    html.push('</div>');
    html.push('</div>');
    html.push('</div>');
    
    MM[gConst.setting].update(p.attrs.id, html.join(''));
	pref.updatePosition("setWrapp");
	p.correctWidthInIE6("setWrapp",1);
	p.initEvent();
};

folderlock.initEvent = function(isModify){
	var p = this;
	var newPassword = jQuery("#newPassword");
	var confirmPassword = jQuery("#confirmPassword");
	var isCapsLock = -1;    //[-1:状态未知, 0:大写未开启, 1:大写已开启]
	var op = jQuery("#oldPassword");
	var np = jQuery("#newPassword");
	var cp = jQuery("#confirmPassword");
	var tip = new parent.ToolTips({
			id: '',
			win: window,
			left: 428,
			top: -50,
			direction: parent.ToolTips.direction.Right
		});
				
	var capsLockTip = new parent.ToolTips({
			id: '',
			win: window,
			left: 155,
			top: -82,
			direction: parent.ToolTips.direction.Up
		});	
			
	p.show_CapsLock_tip(capsLockTip,np[0]);
	p.show_CapsLock_tip(capsLockTip,cp[0]);
	if(isModify){
		p.show_CapsLock_tip(capsLockTip,op[0]);
	}
	
	var obj = {
		"pwdId": "newPassword",
		"wrapClassName":"pl155",
		"pwdMinLen" : 6,
		"pwdMaxLen" : 30
	};
	
    p.vdpwd = new VdPassWord(obj);
	
	//np[0].onkeyup = p.securityTips;
	np[0].onblur = function(){
		p.showErrTip();
	}
	jQuery("#confirmPassword").keyup(function(ev){
		var keycode = EV.getCharCode(ev);
		if(keycode == 13){
			p.save();
			ev.stopPropagation();
			return false;
		}
	});
	
	if(isModify){
		jQuery("#li_lockRange").hide();
		op.focus();
		return;
	} else{
		np.focus();   //开始先获取焦点
	}
	
	this.showFoldersHtml();
};

folderlock.show_CapsLock_tip = function(tip,o){
	
	function  detectCapsLock(event){
		var e = event||window.event;
		var o = e.target||e.srcElement;
		var oTip = o.nextSibling;
		var keyCode  =  e.keyCode||e.which; // 获取按键的keyCode
		var isShift  =  e.shiftKey ||(keyCode  ==   16 ) || false ;
		// 判断shift键是否按住
		if (((keyCode >=   65   &&  keyCode  <=   90 )  &&   !isShift)
			// Caps Lock 打开，且没有按住shift键
		|| ((keyCode >=   97   &&  keyCode  <=   122 )  &&  isShift)
			// Caps Lock 打开，且按住shift键
		){
			tip.close();
			tip.show(o,Lang.Mail.ConfigJs.capsLocked);
		}
		else{
			tip.close();
		}
	}
	
	o.onkeypress = detectCapsLock;
};

/**
 * 全选功能
 */
folderlock.checkAll = function(){
	jQuery("#range h2 input:checkbox").click(function(){
		var check = jQuery(this).attr("checked")=="checked" ? true : false;
		jQuery(this).parent().parent().parent().next().find("input:checkbox").each(function(){
			jQuery(this).attr("checked",check);
		});
	});
};

/**
 * 判断是否存在自定义文件夹密码，存在则显示已经加锁的文件，不存在则列出所有自定义文件
 */
folderlock.showFoldersHtml = function(){
	var data = {};
	var p = this;
	data.type = 3;
/*
 MM.doService({
	            url: "/mail/conf",
	            func: "mbox:setFolderPass",
	            data: {"type":3},
	            failCall: function(){},
	            call: function(ao){},
	            param: ""
        		});	
	 return;
*/

	this.ajaxRequest("mbox:getAllFolders", {"type":3}, function(ao) {
			var fm = ao;
			var ul_start = true;        //是否是加载第一 个class为  jsBox-cbox的div
			var html = "";
			var isLocked = false;
			var lockedIds = [];
			var hasLi = true;
			var i = 0;
			var j = 0;
			var len = fm.length;
			var folders = CM.folderMain[gConst.dataName];

			for (; i < len; i++) {
				if (fm[i].folderPassFlag === 1) {
					lockedIds.push(parseInt(fm[i].fid));
					isLocked = true;
				}

				// 区分标识用户文件夹和代收邮件夹
				for (j = 0; j < folders.length; j ++) {
					if (folders[j].type ===6 && fm[i].name === folders[j].name) {
						fm[i].type = 6;
					}
				}
			}
			html = p.getAllLockListHtml(fm);
			if(isLocked){
				jQuery("#range").html(html);
				p.initModifyEvent(lockedIds)
			}else{
				var userHtml = p.getAllListHtml();
				jQuery("#range").html(userHtml);
				//jQuery("#div_wrap>div:last-child").css("marginBottom",0);
			}
			p.checkAll();
			
        }, function(ao) {

        }
    );
};


/**
* 返回所有加锁文件夹列表的html
*/
folderlock.getAllLockListHtml = function (data) {
	var html = [];

	//html.push("<div id='range' style=\"width:auto;margin-right:50px;_width:750px;float: left;\">");
	html.push(this.getLockListHtml(Lang.Mail.ConfigJs.wowjj ,data, 3));
	if (CC.checkConfig("mailPOP")) {
		html.push(this.getLockListHtml(Lang.Mail.ConfigJs.popMailFolder, data, 6));
	}
	//html.push("</div>");
	return html.join("");
}

/**
* 返回加锁文件夹列表html 
*/
folderlock.getLockListHtml = function (title, data, type) {
	var ul_start = true, //是否是加载第一 个class为  jsBox-cbox的div
		html = [],
		hasLi = true,
		j,
		fm;

	fm = this.sortFolders(data, type);
	
	html.push("<div class=\"jsBox\" style=\"margin: 0 0 15px 0;\">");
	html.push("<h2><p class=\"ml_15 allclick\"><label for=\"forall\">" + title + "</label></p></h2>");
	html.push("<div class=\"jsBox-body\" id='div_wrap' style='padding-bottom:0'>");

	for(j = 0; j < fm.length; j++){
		//是否已加锁文件夹，没加锁就不加载它了
		if (fm[j].folderPassFlag !== 1) {
			continue;
		}
		//如果上一个的 ul 加载了 li,才闭合ul,加载下一个ul
		if (hasLi) {
			if(fm[j].parentId === 0 && ul_start){
				html.push("<div class=\"jsBox-cbox\">");
				html.push("<ul class=\"jsBox-cbox-ul m_clearfix\">");
				ul_start = false;
			
			}else if(fm[j].parentId === 0){
				html.push("</ul></div>")
				html.push("<div class=\"jsBox-cbox\">");
				html.push("<ul class=\"jsBox-cbox-ul m_clearfix\">");
			}
			hasLi = false;
		}
		hasLi = true;
		html.push("<li style=\"overflow: hidden;\">");
		html.push("<label for=" + fm[j].fid + ">" + fm[j].name + "</label></li>");              
	} 
	if (fm.length !== 0) {
		html.push("</ul></div>");
	}
	html.push("</div></div>");
	return html.join("");
}

/**
 * 按级数从上到下排列文件夹数组
 * @param {Object} fm
 */
folderlock.sortFolders = function(fm, type){
	var len = fm.length;
	var newArr = [];
	
	//递归函数，返回从上到下排列的数组
	function sortArray(pId){
		for(var i = 0; i<len; i++){
		    //type-->[3:自定义文件夹 ]
			if(fm[i].type == type){
				if(fm[i].parentId == pId) {
					newArr.push(fm[i]);
					sortArray(fm[i].fid);
				} 
			}
		}
	}
	sortArray(0);
	
	return newArr;
};

/**
* 获取所有文件夹列表html
*/
folderlock.getAllListHtml = function () {
	var html = [];

	html.push(this.getListHtml(Lang.Mail.ConfigJs.wowjj, 3));
	if (CC.checkConfig("mailPOP")) {
		html.push(this.getListHtml(Lang.Mail.ConfigJs.popMailFolder , 6));
	}
	return html.join("");
}

/**
 * 得到文件夹列表的html
 * 
 */
folderlock.getListHtml = function(title, type){
	var fm = CM.folderMain[gConst.dataName],
		ul_start = true, // 是否是加载第一 个class为  jsBox-cbox的div
		html = [],
		j;
	
	fm = this.sortFolders(fm, type);

	html.push("<div class=\"jsBox\" style=\"margin: 0 0 15px 0;\">");
	html.push("<h2><p class=\"ml_15 allclick\"><label ><input class=\"checkbox-com\" type=\"checkbox\" class=\"mr_10 ml_15\"/>"+ title +"</label></p></h2>");
	html.push("<div class=\"jsBox-body\" id='div_wrap' style='padding-bottom:0'>");

	for (j = 0; j < fm.length; j++) {
		if(fm[j].parentId === 0 && ul_start){
			html.push("<div class=\"jsBox-cbox\">");
			html.push("<ul class=\"jsBox-cbox-ul m_clearfix\">");
			ul_start = false;
		}else if (fm[j].parentId === 0) {
			html.push("</ul></div>")
			html.push("<div class=\"jsBox-cbox\">");
			html.push("<ul class=\"jsBox-cbox-ul m_clearfix\">");
		}
		//三个邮件夹站一行 class=\"checkbox-com\"
		html.push("<li style=\"overflow: hidden;\"><label for=" + fm[j].fid + "><input id=" + fm[j].fid + " type=\"checkbox\" />");
		html.push("<span class=\"tf\" style=\"display: inline-block;vertical-align:top;width: 170px;\">" + fm[j].name.encodeHTML() + "</span></label></li>");
	}
	if (fm.length !== 0) {
		html.push("</ul></div>")
	}
	html.push("</div></div>");
	return html.join("");
};

/**
 * 初始化[ 已加锁列表页面 ] 
 */
folderlock.initModifyEvent = function(lockedIds){
	var p = this;
	var ids = lockedIds;         //已经加锁的文件
	
	jQuery("#confirmPassword").val("1234567890").attr("disabled","disabled");
	jQuery("#li_setPass, #li_security,#newSec").hide();
	jQuery("#span_confirmPassword").text(Lang.Mail.ConfigJs.securityLockPwd+"：");
	jQuery("#confirmPassword").val();
	jQuery("#span_lockRange").text(Lang.Mail.ConfigJs.lockedRange+"：");
	jQuery("#li_confirmPassword").append("<li style='padding-left:156px; padding-top:10px' class=\"pl113 pb_15\">[<a href='javascript:void(0);' id='modifyPassword'>"+Lang.Mail.ConfigJs.updatePwd+"</a>]</li>");
	jQuery("#li_lockRange").after("<li style='padding-left:156px; padding-top:10px; clear: both;' class=\"pl113 pb_15\">[<a href='javascript:void(0);' id='modifyLockRange'>"+Lang.Mail.ConfigJs.updateLockRange+"</a>]</li>");
	jQuery("#btn_cancel").after("<a class=\"n_btn_on mt_5 ml_10\" id=\"closeLock\" href='javascript:void(0);'><span><span>"+Lang.Mail.ConfigJs.closeSecurityLock+"</span></span></a>");
	
	//点击 [ 修改密码 ]
	jQuery("#modifyPassword").click(function(){
		p.initModPass();
	});
	//点击 [ 修改加锁范围 ]
	jQuery("#modifyLockRange").click(function(){
		var data = {
			sessionEnable: 0,
			"fid": 2,
			"start": 1,
			"total": 20
		}
		var pass = p.lock_pass;
		
		//因为修改安全锁范围需要安全锁密码，所以利用pass判断，没用gMain.lock_close判断
		if(pass == null || pass == ""){
			p.unlocked(ids);
		}else{
			p.modifyLockRange(ids,{"pass":pass,"unlocked":true});
		}

	});
	
	//点击 [ 关闭安全锁 ]
	jQuery("#closeLock").click(function(){
		p.closeLock();
	});
};

folderlock.setCookie = function(name,value,Days)//两个参数，一个是cookie的名子，一个是值
{
    //var Days = 30; //此 cookie 将被保存 30 天
    var exp = new Date();    //new Date("December 31, 9998");
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
	if(Days == "" || Days == null){
		 document.cookie = name + "=" + escape(value);
	}else{
		 document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
	}
   
};
folderlock.getCookie = function(name)//取cookies函数       
{
     var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
     if(arr != null) return unescape(arr[2]); 
	 return null;
};

folderlock.closeLock = function(){
	var p = this;
	var txt = "<div style='padding:30px'>"; 
	txt += "<label>"+Lang.Mail.ConfigJs.securityLockPwd +"：</label><input type='password' class='set-txt-b w235' maxlength='30' id='txt_pwd'/>";
	txt += "</div>";
	var title = Lang.Mail.ConfigJs.closeSecurityLock;
	var val = "";
	var pwdInput = null;
	var isOk = true;
	var tip = new parent.ToolTips({
	    id: '',
		win: window,
		left: 108,
		top: 97,
	    direction: parent.ToolTips.direction.Bottom
	});
	//tip.type = 4;
	var wo = function(){
		isOk = true;
		pwdInput = jQuery("#txt_pwd");
		val = pwdInput.val();
		if (val.trim() == "") {
			tip.close();
			tip.show(pwdInput[0],Lang.Mail.ConfigJs.secPwdCanntEmpty);
			isOk = false;
		}
		if(isOk){
			p.ajaxRequest("mbox:setFolderPass",{"oldPass":val,"type":3},function(){
				CC.showMsg(Lang.Mail.ConfigJs.secPwdClosed,true,false,"option");
				LM.getAllFolders();
				jQuery("#divDialogCloseconfirmbtn_1")[0].click();
				p.attrs.op = "";
				p.init();
			},function(){
				tip.close();
				tip.show(pwdInput[0],Lang.Mail.ConfigJs.secPwdWrong);
			});
		}
		
		return true;
	};
	CC.showDiv(txt,wo,title,"","");
	jQuery("#txt_pwd").focus();
	jQuery("#txt_pwd").keydown(function(ev){
		if(EV.getCharCode() == 13){
			wo();
			ev.stopPropagation();
			return false;
		}	
	});
};
/**
 * 返回[ 修改安全锁范围的页面 ] 
 */
folderlock.getRangeHtml = function(){
	var p = this;
	var html = [];
	var userHtml = p.getAllListHtml();  //注意把已经锁定文件的勾选
	
	html.push("<div>");
	html.push("<h2 class=\"set_til\" id='h2_setPass'>");
	html.push("<label id=\"addMod\"> "+Lang.Mail.ConfigJs.modLockedRange+"</label>");
	html.push("<a id=\"back\" class=\"fn bord-spa\" href=\"javascript:void(0);\">  ‹‹"+Lang.Mail.ConfigJs.sign_btn_return +"</a>");
	html.push("</h2>");
    html.push("<div style='padding:45px 0 45px 0px'>");
    html.push("<table width=\"100%\"><tr>");
	html.push("<td  style=\"width: 155px;vertical-align: top; text-align: right;\"><span class=\"left\" style='padding-right:10px;display:inline-block'>"+Lang.Mail.ConfigJs.choiseLockRange+"： </span>");
	html.push("<td><div id='range' style='border: 1px solid #ffffff;'>", userHtml, "</div></td>");
	html.push("</div>");
	html.push("</tr></table>");
	html.push("<div class=\"btm_pager fl\" style='width:100%'>");
	html.push("<a id='btn_save' class=\"n_btn_on mt_5 ml_10\"><span>");
	html.push("<span>"+Lang.Mail.ConfigJs.save +"</span></span></a>");
	html.push("<a id='btn_cancel' class=\"n_btn mt_5\"><span>");
	html.push("<span>"+Lang.Mail.ConfigJs.cancelTip +"</span></span></a>");
	html.push("</div>");
		
	return html.join("");
};
/**
 * 修改安全锁范围功能
 */
folderlock.modifyLockRange = function(ids,re){
	var p 			= this,
	    len 		= ids.length,
		rangeHmtl	= "",
	    newIds	 	= [];
	
	//如果还没有解锁
	if(!re.unlocked) return;
	
	if(jQuery("#divDialogCloseconfirmbtn_1")[0]){
		jQuery("#divDialogCloseconfirmbtn_1")[0].click();
	}
	
	//更换成修改安全锁范围的页面
	rangeHmtl = p.getRangeHtml();
	jQuery("#setWrapp").html(rangeHmtl);
  
    //选中已加锁的邮件夹
	for(var i=0; i<len; i++){
		if (ids[i] != "myFolder") {
			jQuery("#"+ids[i]).attr("checked",true);
		}
	}
	
	//全选功能
	p.checkAll();
	
	//点击取消按钮
	jQuery("#back,#btn_cancel").click(function(){
		p.init();
	});
	
	//点击保存按钮
	jQuery("#btn_save").click(function(){
		var data = {};
		
		data.type = 1;
		data.ids = newIds;
		if(re && re.pass){
			//首次修改安全锁范围，也要解锁，一旦解锁成功，其他地方都会解锁
			p.lock_pass = re.pass;
			//因为修改安全锁范围，要先取消密码，在同时设置安全锁密码和加锁邮件夹
			data.newPass = re.pass;
		}
		
		jQuery("#range > .jsBox > .jsBox-body input:checkbox:checked").each(function(){
			var id = jQuery(this).attr("id");
				
			newIds.push(parseInt(id));
		});
		
		//提示：请选择加锁范围
	    if(newIds.length == 0){
			CC.alert(Lang.Mail.ConfigJs.pleaseChoiseLockRange);
			return;
		}
		
		//修改安全锁文件范围，需要先取消原来的密码，设置新密码，新的文件夹
		p.ajaxRequest("mbox:setFolderPass",{"type":3,"oldPass":re.pass},function(){
			p.ajaxRequest("mbox:setFolderPass",data,function(){
				CC.showMsg(Lang.Mail.ConfigJs.modSecLockSuc,true,false,"option");
				p.init();
				gMain.lock_close = true;
				LM.getAllFolders();
			},function(){
				CC.alert(Lang.Mail.ConfigJs.modSecLockFail);
			})
		},function(){
			CC.alert(Lang.Mail.ConfigJs.modSecLockFail);
		});
		
	});	
};

/**
 * 解锁，返回 result 数组，解锁之后在用户退出之前，所有加锁文件都开通了。
 * 用 folderlock.lockPass  控制
 */
folderlock.unlocked = function(ids,type,o, flag){
	var p = this;
	var ids = ids;
	var title = Lang.Mail.ConfigJs.secLockPwdVd;
	var txt = "<p style='padding:20px 0 10px 30px'> "+Lang.Mail.ConfigJs.rangeLockedTip+"</p>";
	txt += "<p style='padding:10px 0 30px 30px; position:relative;' >"+Lang.Mail.ConfigJs.securityLockPwd +"：<input type='password' class='set-txt-b w235' maxlength = '30' id='txt_passValidate'/></p>";
	var val = "";
	var data = {};
	var result = {};
	var validateInput = null;
	var tip = new parent.ToolTips({
	    id: '',
		win: window,
		left: 108,
		top: 41,
	    direction: parent.ToolTips.direction.Bottom
	});
	//tip.type = 4;
	
	
	//确定触发的事件
	var wo = function(){
		var isOk = true;
		var o = o;
		var func = "mbox:listMessages"; 
		val = validateInput.val();
		var fnSuc = function(){
			CC.showMsg(Lang.Mail.ConfigJs.secUnlockedSuc,true,false,"option");
			
			gMain.lock_close = false;
			folderlock.lock_pass = val;	            //出于安全考虑，不用gMain保存
			//[attach:从附件管理解锁  leftLock:从左侧栏解锁]
			gMain.openFolderLock = true;
			//p.setCookie("lock_pass",val); 
			// 暂不用cookie，因为cookie默认是浏览器关闭才失效，现在要刷新页面就失效（安全锁就锁住）
			switch(type){
				case "attach":
					gMain.lock_close = false;               //安全锁已打开
					CC.goAttachList();   					//刷新附件列表
					break;
				case "leftLock":
					gMain.lock_close = false;               //安全锁已打开
					break;
				case "unRead":
					gMain.lock_close = false;
					CC.receiveMail();
					break;
				case "search":
					gMain.lock_close = false;
					if (jQuery.isEmptyObject(GE.searchFlag)) {
						CC.searchMailByTop(jQuery("#txtAdvSearch")[0]);
					} else {
						CC.receiveMail(GE.searchFlag);
					}
					break;	
				case "myfolder_name":
					gMain.lock_close = false;
					CC.goFolder(ids,o);	
					break;
				case "myfolder_op":
					gMain.lock_close = false;
					//MM.folderMain.opt(o.v ,o.fid ,o.type);
					break;	
				default:
					result.unlocked = true;
					result.pass = val;
					p.modifyLockRange(ids,result);
					LM.getAllFolders(); 
					return false;					
			}
			
			 //刷新左侧菜单栏
			 LM.getAllFolders(); 
			
			if(jQuery("#divDialogCloseconfirmbtn_1")[0]){
				jQuery("#divDialogCloseconfirmbtn_1")[0].click();
			}
			
		};
		var fnFail = function(ao){
			tip.show(validateInput[0],Lang.Mail.ConfigJs.secLockPwdWrong);
			result.unlocked = false;

		};
		
		
		if (val.trim() == "") {
			tip.close();
			tip.show(validateInput[0],Lang.Mail.ConfigJs.secPwdCanntEmpty );
			isOk = false;
		}
		
		data.folderPass = val;
		data.start = 1;
		data.total = 20;
		data.sessionEnable = 1;
		
		// xf id[0] ----> ids[0]
		if (ids[0]) {
			data.fid = ids[0];  
		}
		
		if(o && o.id){
			data.fid = o.id;
		}
		if(gMain.first_locked_id){
			data.fid = gMain.first_locked_id;
		}
		/*
		else if (newGroup.search(/["'“‘\\\/\^\<\>]/) != -1) {
		               bSend = false;
					   tip.close();
					   tip.show(validateInput[0],"不能包括 \ / < > ^ 引号等特殊字符");        
		        }
		*/
		
		if(isOk){
			p.ajaxRequest(func,data,fnSuc,fnFail);
		}
		return true;            //返回真 , 则点击确认按钮[弹出框]不会关闭
	}
	
	parent.CC.showDiv(txt,wo,title,"","",380);
	validateInput = jQuery("#txt_passValidate");
	
	validateInput.focus();
    jQuery("#txt_passValidate").keydown(function(ev){
		var keycode = EV.getCharCode(ev);
		if(keycode == 13){
			wo();
			ev.stopPropagation();
			return false;
		}
	});

};



/**
 * 初始化[ 修改安全锁密码页面 ] 
 */
folderlock.initModPass = function(){
	var p = this;
	var modifyHtml = p.modifyLockHtml();
	var html = [];
	p.attrs.op = "modifyLock";
	
	html.push("<li style='position:relative'><span class=\"left\">"+Lang.Mail.ConfigJs.pop_oldPwsd+"：</span>");
	html.push("<input type=\"password\" maxlength='30' class=\"set-txt-b w260\" id='oldPassword'/>");
	html.push(p.getFalseTip("oldTip","oldTip1",Lang.Mail.ConfigJs.currentPwd));
	html.push("<li id=\"newSec\" class=\"pl155 pb_15\"><span class=\"setCode-name-tips\">"+Lang.Mail.ConfigJs.contactAdminIfForgetPwd+"</span></li>")
	html.push("</li><li class=\"pl113 pb_15\"></li>");
	html.push("<li class=\"pl113 pb_15\"></li>");

	jQuery("#setWrapp").html(modifyHtml);
	jQuery("#li_setPass").before(html.join(""));
	jQuery("#span_setPass").text(Lang.Mail.ConfigJs.setNewPopPwd+"：");
	jQuery("#span_confirmPassword").text(Lang.Mail.ConfigJs.comfirm_popNewPwd+"：");
	jQuery("#h2_setPass").html("<label id=\"addMod\"> "+Lang.Mail.ConfigJs.modSecLock_pwd+"</label><a id=\"back\" class=\"fn bord-spa\" href=\"javascript:void(0);\">  ‹‹"+Lang.Mail.ConfigJs.pop_return +"</a>")
	p.initEvent(true);
	jQuery("#oldPassword").focus();
	
	jQuery("#confirmPassword").keydown(function(ev){
		var keycode = EV.getCharCode(ev);
		if(keycode == 13){
			p.save();
			ev.stopPropagation();
			return false;
		}
	});
	
	jQuery("#back,#btn_cancel").click(function(){
		p.init();
	});
};

//返回修改安全锁密码的页面
folderlock.modifyLockHtml = function(){
	var html = [];
		var p = this;
		html.push("<div>");
		html.push("<h2 class=\"set_til\" id='h2_setPass'> "+Lang.Mail.ConfigJs.setSecLock+"<span>");
		html.push("( "+Lang.Mail.ConfigJs.moreSafeInLock+" )</span></h2>");
		html.push("<div class=\"codeSet-wrap\" id='codeSet' style='padding-top:30px'>");
		html.push("<ul class=\"setCode-name\">");
		//设置安全密码
		html.push("<li style='position:relative' id='li_setPass'><span class=\"left\" id='span_setPass'>"+Lang.Mail.ConfigJs.setSecPwdInLock+"：</span>");
		html.push("<input type=\"password\" class=\"set-txt-b w260\" maxlength='30' id='newPassword'/>");
		html.push(p.getFalseTip("newTip","newTip1",Lang.Mail.ConfigJs.correctPassword));
		html.push("</li><li class=\"pl155 pb_15\" id='newSec'><span class=\"setCode-name-tips\">"+6+"-"+30+Lang.Mail.ConfigJs.notSpecialInLock+"</span></li>");

		
		//留出提示的空间
		html.push("<li class=\"pl113 pb_15\"></li>")
		//确认密码
		html.push("<li  style='position:relative' id='li_confirmPassword'><span id='span_confirmPassword' class=\"left\">"+Lang.Mail.ConfigJs.confirmPwdInLock+"：</span>");
		html.push("<input type=\"password\" maxlength='30' class=\"set-txt-b w260\" id='confirmPassword'/>");
		html.push(password.getFalseTip("confirmTip","confirmTip1",Lang.Mail.ConfigJs.correctPassword));
		html.push("</li>");
	
	   
		//加锁范围
		html.push("<li class=\"pl113 pb_15\" ></li><li class=\"pl113 pb_15\" ></li>");
		html.push("<li id='li_lockRange'>");
		html.push("<table width=\"100%\"><tr>");
		html.push("<td style=\"width: 155px;vertical-align: top;\"><span id='span_lockRange' class=\"left\">"+Lang.Mail.ConfigJs.LockedRange+"：</span></td>");
		html.push("<td><div id='range' style='border: 1px solid #ffffff;margin-top: 0px;'></div></td>");
		html.push("</tr></table>");
		html.push("</li></ul>");
		
		html.push("</div><!--codeSet-wrap-->");
		html.push("<div class=\"btm_pager fl\" style='width:100%'>");
		html.push("<a onclick='folderlock.save()' href='javascript:void(0);' class=\"n_btn_on mt_5 ml_10\"><span>");
		html.push("<span>"+Lang.Mail.ConfigJs.save +"</span></span></a>");
		html.push("<a id='btn_cancel'  href='javascript:void(0);' class=\"n_btn mt_5\"><span>");
		html.push("<span>"+Lang.Mail.ConfigJs.cancelTip +"</span></span></a>");
		html.push("</div>");
		
		html.push("</div>");
		return html.join("");
};

folderlock.setSecPWD = function(){
	var p = this;
	var data = {};
	var fnFaild = null;
	var fnSucc = null;
	
	data.type = 1;
	data.newPass= "";
	data.ids = [];
	
	p.ajaxRequest("mbox: setFolderPass", data, cb, fcb);
};

/**
 * 设置文件夹加密的HTML
 */
folderlock.getAddHtml = function(){
		var html = [];
		var p = this;
		html.push("<div>");
		html.push("<h2 class=\"set_til\"> "+Lang.Mail.ConfigJs.setSecLock+"<span>");
		html.push("( "+Lang.Mail.ConfigJs.moreSafeInLock+" )</span></h2>");
		html.push("<div class=\"codeSet-wrap\" id='codeSet' style='padding-top:30px'>");
		html.push("<ul class=\"setCode-name\">");
		//设置安全密码
		html.push("<li style='position:relative' id='li_setPass'><span class=\"left\" id='span_setPass'>"+Lang.Mail.ConfigJs.setSecPwdInLock +"：</span>");
		html.push("<input type=\"password\"  maxlength='30' class=\"set-txt-b w260\" id='newPassword'/>");
		html.push(p.getFalseTip("newTip","newTip1",Lang.Mail.ConfigJs.correctPassword));
		html.push("</li><li class=\"pl155 pb_15\" id='newSec'>");
		html.push("<span class=\"setCode-name-tips\">"+6+"-"+30+Lang.Mail.ConfigJs.notSpecialInLock +"</span></li>");
		
		//留出提示的空间
		html.push("<li class=\"pl113 pb_15\"></li>")
		//确认密码
		html.push("<li  style='position:relative' id='li_confirmPassword'><span id='span_confirmPassword' class=\"left\">"+Lang.Mail.ConfigJs.confirmPwdInLock +"：</span>");
		html.push("<input type=\"password\"  maxlength='30' class=\"set-txt-b w260\" id='confirmPassword'/>");
		html.push(password.getFalseTip("confirmTip","confirmTip1",Lang.Mail.ConfigJs.correctPassword));
		html.push("</li>");
		
	   
		//加锁范围
		html.push("<li class=\"pl113 pb_15\" ></li><li class=\"pl113 pb_15\" ></li>");
		html.push("<li id='li_lockRange'>");
		html.push("<table width=\"100%\"><tr>");
		html.push("<td style=\"width: 155px;vertical-align: top;\"><span id='span_lockRange' class=\"left\">"+Lang.Mail.ConfigJs.LockedRange+"：</span></td>");
		html.push("<td><div id='range' style='border: 1px solid #ffffff;margin-top: 0px;'></div></td>");
		html.push("</tr></table>");
		html.push("</li></ul>");
		
		html.push("</div><!--codeSet-wrap-->");
		html.push("<div class=\"btm_pager fl\" style='width:100%'>");
		html.push("<a onclick='folderlock.save(); return false;' href='javascript:void(0);' class=\"n_btn_on mt_5 ml_10\"><span>");
		html.push("<span>"+Lang.Mail.ConfigJs.save +"</span></span></a>");
		html.push("<a id='btn_cancel' class=\"n_btn mt_5\" onclick='folderlock.goBack()'><span>");
		html.push("<span>"+Lang.Mail.ConfigJs.cancelTip +"</span></span></a>");
		html.push("</div>");
		
		html.push("</div>");
		return html.join("");
};

folderlock.save = function() {
	//获得 各密码输入框的值
    var oldPass = jQuery("#oldPassword").val();
    var newpass1 = jQuery("#newPassword").val();
    var newpass2 = jQuery("#confirmPassword").val();

	//提示框先隐藏
	jQuery("#oldTip,#newTip,#confirmTip").hide();
	jQuery("#security,#security1").hide();
	
    var p = this;
    var isOk = true;
    
    var pv = "";
	if(oldPass){
		pv = oldPass;
	}
    var npv1 = newpass1;
    var npv2 = newpass2;
	var ids = [];
	var isModify = (p.attrs.op == "modifyLock")? 1 : 0;
	
	if(p.vdpwd.NotifyCode != 0){
		isOk = false;
        jQuery("#newPassword").focus();
        jQuery("#newTip").css("display","inline");
        jQuery("#newTip1").html(p.vdpwd.msg);
        return;
	}
	
    if (pv == "" && isModify) {
        isOk = false;
        jQuery("#oldfolderlock").focus();
		jQuery("#oldTip").css("display","inline");
        jQuery("#oldTip1").html(Lang.Mail.ConfigJs.currentPwd );
        return;
    }
    if (npv1 == "") {
        isOk = false;
        jQuery("#newPassword").focus();
        jQuery("#newTip").css("display","inline");
        jQuery("#newTip1").html(Lang.Mail.ConfigJs.inputNewPwd);
        return;
    }
	if (npv2 == "") {
	    isOk = false;
        jQuery("#confirmfolderlock").val("").focus();
        jQuery("#confirmTip").css("display","inline");
        jQuery("#confirmTip1").html(Lang.Mail.ConfigJs.inputConfirmPwd);
        return;
	}
    if (npv1 != npv2) {
        isOk = false;
        jQuery("#confirmfolderlock").focus();
        jQuery("#confirmTip").css("display","inline");
        jQuery("#confirmTip1").html(Lang.Mail.ConfigJs.towPwdMatch);
        return;
    }
  
/*
    if (safeLevel < parseInt(gMain.pwdCheckType)) {
        isOk = false;
		jQuery("#newTip").css("display","inline");
	    jQuery("#newTip1").html("密码安全度必须为强");
        return;
    }
   
*/  
	//点击保存  判断 [ 新增 || 修改 ] 安全锁密码
	if(!isModify){
		
		jQuery("#range > .jsBox > .jsBox-body input:checkbox:checked").each(function(){
			var id = parseInt(jQuery(this).attr("id"));
			if(!isNaN(id)){
				ids.push(id);
			}
		});
		
	    if(ids.length == 0){
			CC.alert(Lang.Mail.ConfigJs.pleaseChoiseLockRange);
			return;
		}
		
		var data = {
	            type: 1,
	            newPass: npv1,
	    		ids : ids
	        };
	
	    if (isOk) {
	        p.setOrModRequest("mbox:setFolderPass",data);
	    }
	}else{
		var data = {
			type: 2,
			oldPass: pv,
			newPass: npv1
		};
		if (isOk) {
	        p.setOrModRequest("mbox:setFolderPass",data,true);
	    }
	}	
};

/**
 * [ 新增||修改 ]安全锁的请求及结果提示
 * @param {Object} func 地址
 * @param {Object} data 数据
 * @param {Object} isMod 是否修改
 */
folderlock.setOrModRequest = function(func,data,isMod){
	var p = this;		
	this.ajaxRequest(func, data, function(ao) {
		var msg = Lang.Mail.ConfigJs.secLockPwdSuc;
		if(isMod){
			msg = Lang.Mail.ConfigJs.secLockPwdModSuc;
			
		}	
		CC.showMsg(msg,true,false,"option");
		p.init();
		gMain.lock_close = true; // 标记当前是加锁状态
		LM.getAllFolders();
	}, function(ao) {
		if(!isMod){
			jQuery("#newPassword").focus();
			jQuery("#newTip").css("display","inline");
			jQuery("#newTip1").html(Lang.Mail.ConfigJs.setSucLockFail);
			
		}else{
			var msg = "";
			if (ao.code=="VALUE_NOT_NULL") {
				msg = Lang.Mail.ConfigJs.pwdNotNull;
				jQuery("#oldPassword").focus();
				jQuery("#oldTip").css("display","inline");
				jQuery("#oldTip1").html(msg);
			} else if (ao.code=="WEAK_PWD") {
				msg = Lang.Mail.ConfigJs.weakPwd;
				jQuery("#oldPassword").focus();
				jQuery("#oldTip").css("display","inline");
				jQuery("#oldTip1").html(msg);
			} else if(ao.code!="UNKNOW_EXCEPTION"){
				msg = Lang.Mail.ConfigJs.lockPwdInCorrect;
				jQuery("#oldPassword").focus();
				jQuery("#oldTip").css("display","inline");
				jQuery("#oldTip1").html(msg);
		  	}else{
				jQuery("#newPassword").focus();
				jQuery("#newTip").css("display","inline");
				jQuery("#newTip1").html(Lang.Mail.ConfigJs.ModifyPwdErr );
		  	}
		}
		
	}, gMain.webPath+"/service/mail/conf.do?func=mail:SetFolderPass&sid="+gMain.sid);
};

/**
 * 检查密码格式
 * @param {boolean} validateEmpty 是否验证密码为空
 */
folderlock.showErrTip = function(validateEmpty){
	var newPassword = jQuery("#newPassword").val();
	var p  =  this;

	//验证密码 内容的提示
	var code = p.vdpwd.NotifyCode;
	var msg1 = p.vdpwd.msg;
	
	jQuery("#newTip").hide();
	if(msg1.trim() != ""  && code != 0 ){
		if(code == 1 && !validateEmpty){
			return;
		}
		//jQuery("#newfolderlock").val("").focus();
	    jQuery("#newTip").css("display","inline");
	    jQuery("#newTip1").html(msg1);
	}
};