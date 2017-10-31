

var account = new OptionBase();

account.getUrl = function(func){
    return gMain.webPath+'/se/mail/config/alias.do?func={0}&sid={1}'.format(func,gMain.sid);
};

account.attrs = {
    id : 'account',	
    authority: 'MAIL_CONFIG_NAME',
    divId:'pageUserAlias',
    tableClass:"tblFormSet",
	defaultVal : "",
	isSucc: true,//是否请求成功   
    list:{type:"url",func:gConst.func.alias,data:{opType:"list"}},	//获取数据/列表时指令，数据	
    update:{func:gConst.func.alias},//更新数据时func指令,及数据                          
	data: {}		
};

account.init = function(id){
    this.attrs.url = this.getUrl(this.attrs.list.func);
    this.request(this.attrs,this.getHtml,null,true);
};
/**
 * 得到窗口的html 及 初始值
 * @param {Object} attrs
 * @param {Object} values
 */
account.getHtml = function(attrs, values) {
	var p = account;
	var inputDisplay = "";
	var labelDisplay = "";
	var inputDisplaySender = "";
	var labelDisplaySender = "";
	var len = values.length;      //1
	var lastValue = values[len-1];//2 上一次别名的值,即最新的值
	var v = "";
	if(lastValue !="" && lastValue != "undefined" && lastValue != null){//v保持空值
		p.attrs.defaultVal = lastValue;
		v = lastValue;		
	}
	
	if(gMain.trueName == ""){
		//新用户开始默认的发件人姓名为登陆名
		gMain.trueName = gMain.loginId;
		
		account.addSender(gMain.loginId);
	}
    var initHTML = function(p){
	
		p.attrs.emaildomain = "@" + gMain.domain;
		p.Allaccount = values;	
	    inputDisplay = v == "" ? "inline" : "none";
	    labelDisplay = v== "" ? "none" : "inline";
		inputDisplaySender = gMain.trueName == "" ? "inline" : "none";
		labelDisplaySender = gMain.trueName == "" ? "none" : "inline";
		
	};
	initHTML(account);
	
	var getAddHtml = function() {
	var html = [];
	html.push("<div>");
	html.push("<h2 class=\"set_til\">"+Lang.Mail.ConfigJs.accountSettings+"<span>");
	html.push("( "+Lang.Mail.ConfigJs.aliasNameTip+" )</span></h2>");
	html.push("<div class=\"codeSet-wrap\" id='codeSetWrap'>");
	html.push("<ul class=\"setCode-name\">");
	html.push("<li class=''><span class=\"til\">"+Lang.Mail.ConfigJs.mailAccount+"：</span>");
	html.push("<label id='loginAccount' ></label></li>");
	
	//只有oa邮箱，有别名设置功能
	if(CC.isOA()){
		html.push("<li class=\"pt_20\" id='ptAlias'><span class=\"left\">");
		html.push(""+Lang.Mail.ConfigJs.mailAlias+"</span>");
		//别名操作
		html.push("<input type=\"text\" maxlength='20' style='display:"+inputDisplay+";'");
		html.push(" class=\"set-txt-b w260\" id='aliasText'  value='"+v+"'/>");	
		html.push(password.getFalseTip("aliasTip","aliasTip1",""));
		html.push("<label id='showAlias'  style='display:"+labelDisplay+";'>");
		html.push("<span id='aliasName' style='margin-right:10px'>");
		//加载后赋值
		html.push(v+"</span>");
		html.push("<a  href=\"javascript:void(0);\" style='margin-right:5px' ");
		html.push("onclick='account.editAlias();'>"+Lang.Mail.ConfigJs.modify +"</a>");
		html.push("<a href=\"javascript:void(0);\" onclick='account.deleteAlias();'>"+Lang.Mail.ConfigJs.deleteO+"</a></label>");	
		html.push("</li>");
	}
	
	
	/*
html.push("<li class=\"pl155\" id='send1'>");
	html.push("<span class=\"color_blue setCode-name-tips \" ");
	html.push("style='color:#B3B3B3'>"+Lang.Mail.ConfigJs.exZhangsan+"&lt;");
	html.push("zhangsan@139.com&gt;,zhangsan "+Lang.Mail.ConfigJs.isAlias+"</span></li>");
*/
	//发件人姓名
	html.push("<li id='sender' style=\"margin-top:20px;\">");
	html.push("<span class=\"left\">"+Lang.Mail.ConfigJs.person_sendername+"</span>");
	html.push("<input id='senderText' maxlength='20' style=\"display:"+inputDisplaySender+";\"");
	html.push("type=\"text\" class=\"set-txt-b w260\" />");
	html.push(password.getFalseTip("senderTip","senderTip1",""));
	html.push("<label id='showSender'  style='display:"+labelDisplaySender+"; '>");
	html.push("<span id='senderName' style='margin-right:10px'>");
	html.push(gMain.trueName+"</span><a href=\"javascript:void(0);\" style='margin-right:5px'");
	html.push(" onclick='account.editSender();'>"+Lang.Mail.ConfigJs.modify +"</a>");
	//html.push("<a href=\"javascript:void(0);\" onclick='account.deleteSender();'>"+Lang.Mail.ConfigJs.deleteO+"</a>");
    html.push("</label>");
	html.push("</li>");	
	html.push("<li id='snederNote'  style=\"margin:3px 43px 20px\" class=\"pl113\">");
	html.push("<span class=\"setCode-name-tips\">");
	html.push(""+Lang.Mail.ConfigJs.exZhangsan +"&lt;");
	html.push("zhangsan@"+ gMain.domain +"&gt;,"+Lang.Mail.ConfigJs.senderNameZS+"</span></li>");	
	html.push("</ul>");
	html.push("</div><!--codeSet-wrap-->");
	/*
	html.push("<div  style='color:#B3B3B3' class=\"code-note\" id='aliasCodeNote'>");
	html.push("<h3 style=\"font-weight:normal\">"+Lang.Mail.ConfigJs.explain+"：</h3>");
	html.push("<ol>");
	html.push("<li>1、"+Lang.Mail.ConfigJs.aliasLength+"");
	html.push("</li>");
	html.push("<li>2、"+Lang.Mail.ConfigJs.startWithTip+"</li>");
	html.push("<li>3、"+Lang.Mail.ConfigJs.setAliasTip+"</li>");
	html.push("</ol>");
	html.push("</div>");
	*/      
	html.push("<div class=\"btm_pager fl\" style='width:100%'>");
	html.push("<a id='save' class=\"n_btn_on mt_5 ml_10\"><span>");
	html.push("<span>"+Lang.Mail.ConfigJs.save+"</span></span></a>");
	html.push("<a id='cancel' class=\"n_btn mt_5\"  onclick='account.goBack();'>");
	html.push("<span><span>"+Lang.Mail.ConfigJs.cancelTip +"</span></span></a>");
	html.push("</div>");
	html.push("</div>");
	
	return html.join("");
    };

    var html = [];
    var addDiv = getAddHtml();
    html.push("<div class=\"bodySet bodyBwList\" style='align:text;'");
    html.push("><div id=\"container\">");
    html.push(this.getTopHtml());
    html.push(this.getLeftHtml());
    html.push("<div class=\"setWrapper\" id=\"setWrapp\">");
    html.push(addDiv);
    html.push("<div id='sign_list'></div>");
    html.push("</div></div></div>");
	//更新窗口页面
    MM[gConst.setting].update(account.attrs.id, html.join(""));
	account.updatePosition("setWrapp");
	//account.saveChanges();	
	jQuery("#loginAccount").html(gMain.userNumber);
	//给保存按钮绑定事件
	jQuery("#save").unbind('click').bind('click', function(){
		account.saveChanges();
	});
};
/**
 * 保存成功后页面的变化
 */
account.afterSave = function(){
	var v = jQuery("#aliasText").val();
    v = v ? v.trim() : "";
	account.attrs.defaultVal = v;
	if(v != ""){//别名不为空才隐藏别名输入框
		//var v1 = v+"@"+gMain.domain;
		var v1 = v;
		jQuery("#aliasText").hide();//隐藏输入框
	    jQuery("#showAlias").show();//显示label
	    jQuery("#aliasName").html(v1);		
	}
	CC.showMsg(Lang.Mail.ConfigJs.aliasSetSuc,true,false,"option");

    var sVal = 	jQuery("#senderText").val();
    if(window.gMain){
        if(gMain.trueName){
            //改变gMain的trueName 及时更新页面的发件人姓名
            gMain.trueName = sVal;
        }

//        if(gMain.userNumber){
//            //及时更新页面的发件人姓名
//            jQuery("#divUserInfo>span").html(sVal+"("+gMain.userNumber+")");
//        }else if(gMain.loginName){
//            //没有gMain.userNumber就用gMain.loginName
//            jQuery("#divUserInfo>span").html(sVal+"("+gMain.loginName+")");
//        }
        var userName = jQuery('#app_username');
        var trueName = jQuery('#app_usertruename');
        var loginName = jQuery('#account_info .top_name');

        if(userName){
            userName.html(sVal);
        }
        if(trueName){
            trueName.html(sVal);
        }
        if(loginName){
            loginName.find('span').html(sVal);
        }
    }
    this.mode = '';
};

/**
 * 新增发件人姓名
 */
account.addSender = function(v){
	account.ajaxRequest("user:setUserInfo", {
			true_name: v},
			 function(){
			 }, function(err){		
		})
}
/**
 * 点击保存事件
 */
account.saveChanges = function(){
    if(!this.mode || !this.mode == 'editing'){
        return;
    }
	var p = account;
	var url = account.getUrl(account.attrs.update.func);
    var bStop = false; //程序是否终止
	var objS= jQuery("#senderText"); //获取发件人输入框对象
	
	
	if (CC.isOA()) {
		var obj = jQuery("#aliasText"); //获取别名输入框对象
		var v = obj.val().trim();
	}
	jQuery("#aliasTip,#senderTip").hide();

	var checkAlias = function(){

		if(v == ""){//如果别名为空，直接删除
		   
			p.deleteAlias("set");
		}else if (account.check(v)) {//检查别名格式后提交
			var type = account.attrs.op == 'update' ? "update" : "add";
			var data = {};
			
			//新建、修改 别名，上传的数据不同
			if (type == "add") {
				data = {
					opType: "add",
					aliasName: v
				};
			}
			else {
				data = {
					opType: "update",
					aliasName: v,
					oldAliasName: account.attrs.defaultVal//修改别名必须上传旧别名
				};
			}
			
			//修改别名的AJAX请求			
			account.ajaxRequest(gConst.func.alias, data, function(){
				//保存成功后页面的变化
				account.afterSave();
			}, function(err){
				    account.attrs.isSucc = false;
					if (err.msg) {
						jQuery("#aliasTip").css("display","inline");
						if(err.msg == "null"){
						jQuery("#aliasTip1").html(Lang.Mail.ConfigJs.alias_exist );	
	
							}else{
								jQuery("#aliasTip1").html(err.msg);
								
							}
						
						
					}
			}, url);	
		}
	};
	//检查发件人姓名格式后提交
	var checkSender = function(){
			
		var trueName = jQuery("#senderText").val().trim();
				
		//取得发件人姓名输入框的值,如果输入的发件人姓名格式检测错误，函数终止
		if ((!trueName.checkSpecialChar()) || (/[&\.\*]/.test(trueName))) {
			jQuery("#senderTip").css("display","inline");
			jQuery("#senderTip1").html(Lang.Mail.ConfigJs.senderFormatError);
			jQuery("#senderText").focus();
			bStop = true;
			return;
		}
		

		//发件人姓名的AJAX请求
		//account.ajaxRequest("user:setUserInfo", {
        account.doService(gConst.func.setWebUserInfo, {
			trueName: trueName
		}, function(){
	
			//请求成功后、发件人姓名不为空，则隐藏输入框
			if(trueName.replace(/\s/g,"") != ""){
				jQuery("#showSender").show();
				jQuery("#senderName").html(jQuery("#senderText").val());
				jQuery("#senderText").hide();
                account.afterSave();
			}else{
				jQuery("#senderText").val("");//修改为空后输入框依然显示
				CC.showMsg(Lang.Mail.ConfigJs.aliasSetSuc,true,false,"option");
			}
		}, function(err){
			account.attrs.isSucc = false;
		});
		
	};
	
	var cb = function(e){
		
		//如果两个输入框状态有一个不为隐藏
		if(jQuery("#aliasText").css("display") != "none" ||
		   jQuery("#senderText").css("display") != "none"){
		    
			if (CC.isOA()) {
				v=v.replace(/\s/g,"");
		   
				jQuery("#aliasTip").hide();
			
			}
			
			//如果别名为默认值 而且 发件人输入框状态隐藏，直接提示成功
			if (((v &&v == account.attrs.defaultVal) || !v)
			 && jQuery("#senderText").css("display") == "none") {
				account.afterSave();
				return;
			}
			else {
/*
//别名输入框的值为空,函数终止
if (v == "") {
    jQuery("#aliasTip").css("display","inline");
	jQuery("#aliasTip1").html(Lang.Mail.ConfigJs.aliasCannotEmpty);
	return;
}
*/
	        	//如果发件人姓名输入框显示状态，则检查合法后做AJAX请求
				if(jQuery("#senderText").css("display") != "none"){
					checkSender();
				}
				
				//如果前面程序就要终止，这里就也要终止
				if(bStop){
					return;
				}
				
				//非oa邮箱不需要
				if(!CC.isOA()){
					return;
				}
						
				//如果输入框中别名值还是默认值，没有进行过修改或者别名输入框处于隐藏状态
				//就不进行AJIAX请求直接提示成功			
				if (v == p.attrs.defaultVal || jQuery("#aliasText").css("display") == "none") {
					//保存成功
					account.afterSave();
					return;
				}else{
					checkAlias();
				}	
				
			}
		}else{
			//如果两个输入框状态都是隐藏，说明不可能进行过修改，则直接提示保存成功
			CC.showMsg(Lang.Mail.ConfigJs.aliasSetSuc,true,false,"option");
		}
		//阻止冒泡事件
		parent.EV.stopEvent(e);
	 	return false;
	}//cb END
	cb();
		
};


/**
 * 校验别名是否合乎规矩
 * @param {Object} num
 */

account.check = function(num){
    var obj = jQuery("#aliasText");
    var p1 = (num.search(/[^a-zA-Z0-9-_.]/) != -1) ? 1 : 0;
    //var p2=/^[a-zA-Z0-9]+\S*[a-z0-9]$/;
    var p2 = /^[a-zA-Z0-9]+\S*[a-zA-Z0-9-_.]$/;
    var p3 = (num.search(/--|_-|-_|__/) != -1 )? 1 : 0;
    if (p3 == 1 || p1 == 1 || !p2.test(num)||num.length < 2 || num.length > 20 ){
        obj.focus();
        obj.select();
        jQuery("#aliasTip").css("display","inline");
        jQuery("#aliasTip1").html(""+Lang.Mail.ConfigJs.aliasFormatError+"");
        return (false);
    }
    if(this.Allaccount.has(num)){
        obj.focus();
        obj.select();
        jQuery("#aliasTip").css("display","inline");
		jQuery("#aliasTip1").html(""+Lang.Mail.ConfigJs.aliasFormatError+"");
        //jQuery("#aliasTip1").html(Lang.Mail.ConfigJs.alias_exist);
        return (false);
    }
    //GC.ossBehavior(103);
    return (true);
};
/**
 * 修改别名
 */
account.editAlias = function(){
    var v = jQuery("#aliasName").text().toString();
	//v = v.substring(0,v.indexOf("@"));
    jQuery("#showAlias").hide();
    jQuery("#aliasText").show().val(v);
    
    account.attrs.op = 'update';
};
/**
 * 删除别名
 */
account.deleteAlias = function(op){
	var v = jQuery("#aliasName").text().trim();	
	var p = this;
    var an = v.replace(this.attrs.emaildomain,'');
    var url = p.getUrl(this.attrs.update.func);
    var data = {
        opType: "delete",
        aliasName:an
    };
	
	if (an == "") {
	    CC.showMsg(Lang.Mail.ConfigJs.aliasSetSuc,true,false,"option");
		return;
    }
	
	//如果点击删除按钮提示：别名删除成功、如果是别名输入框为空进行保存，则提示：账号设置成功
	var tip = op=="set" ? Lang.Mail.ConfigJs.aliasSetSuc : Lang.Mail.ConfigJs.aliasDeleteSuc
    if(an==gMain.loginId){
    	CC.alert(Lang.Mail.Config.aliaslogin_nodelete);
	}else{
		p.ajaxRequest(gConst.func.alias, data, function(){
			p.Allaccount[0]="";
	        jQuery("#showAlias").hide();
	        jQuery("#aliasText").show().val("").focus();
			CC.showMsg(tip,true,false,"option");
	    },function(ret){
	    	if(typeof ret == "object" && ret.msg){
	    		CC.alert(ret.msg);
	    	}else{
	    		CC.alert(Lang.Mail.ConfigJs.filter_failed);
	    	}
	    },url);
	}
};
/**
 * 点击修改发件人姓名
 */
account.editSender = function(){
	var v = jQuery("#senderName").text();
	jQuery("#showSender").hide();
	jQuery("#senderText").show().val(v);
    this.mode = 'editing';
};

account.deleteSender = function(){
	var p = account;
	    data = {true_name : ""}
		p.ajaxRequest("user:setUserInfo", data, function(){	
	        jQuery("#showSender").hide();
	        jQuery("#senderText").show().val("").focus();
			gMain.trueName = "";
			CC.showMsg(Lang.Mail.ConfigJs.delSenderSuc,true,false,"option");
	    });
};

var defaultAccount = new OptionBase();
defaultAccount.attrs = {
    id : 'defaultAccount',
    authority: 'MAIL_CONFIG_DEFAULTACCOUNT',
    free: true,
    divId:'pageUserAlias',
    tableClass:"tblFormSet",
    list: {type:'url', func:gConst.func.getDefaultEmail},
    save: {type:'url', func:gConst.func.setDefaultEmail},
    data: {
        
    }
};

defaultAccount.init = function(){
    this.resultData = {};
    this.initService(this.attrs, this.getHtml);
};

defaultAccount.getHtml = function(attrs, values){
    var html = [];
    var p = this;
    
    //html.push("<div class=\"bodySet\" style='align:text;' id=\"pageUserAlias\">");
    //html.push("<div id=\"container\">");
    
    html.push(this.getTopHtml());
    html.push(this.getLeftHtml());
    
    html.push(this.getNavMenu(attrs.id));
    //html.push("<div class=\"setWrapper\">");
    //html.push('<div class="jacount_wrap">');
    html.push('<p style="float:left; width:145px;padding-top:20px; text-align:right;">' + Lang.Mail.ConfigJs.setDefaultEmail + '：</p>');
    html.push('<div class="jpop_mail_list w444" style="border:none; box-shadow:none; overflow:hidden;zoom:1;">');
    html.push('<ul id="setDefaultEmamil_container">');
    html.push('</ul>');
    html.push('</div>');
    html.push('<div class="btm_pager">');
    html.push('<a class="n_btn_on mt_5 ml_10" href="javascript:fGoto();" id="submit_btn"><span><span>' + Lang.Mail.Ok + '</span></span></a>');
    html.push('<a class="n_btn mt_5" onclick="defaultAccount.goBack();" ><span><span>'+ Lang.Mail.Cancel+'</span></span></a>');
    html.push('</div>');

    //html.push('<p style="padding:8px 0;"><a class="btn" href="javascript:fGoto();" id="submit_btn">');
	//html.push('<b class="r1"></b><span class="rContent"><span>' + Lang.Mail.Ok + '</span></span><b class="r1"></b></a></p>')
    // html.push('</div>');
    
    //html.push('</div>'); //end setWrapper
    //html.push('</div>'); //end container
   // html.push('</div>'); //end bodySet
    MM[gConst.setting].update(attrs.id, html.join(''));
    defaultAccount.updatePosition("setWrapp");
    this.loadDefaultData(values);
    this.bindEvents();
};
defaultAccount.loadDefaultData = function(data){
    this.resultData = data;
   // for(var i=0,l=data.length;i<l;i++){
    //    this.resultData[data[i].mailId + ''] = data[i];
    //}
    this.updateList();
};
defaultAccount.bindEvents = function(){
    var okBtn = this.$('submit_btn');
    var p = this;
    var evt = function(){
        p.save();
    };
    EV.observe(okBtn, 'click', evt, false);
};
defaultAccount.createListItem = function(d, chk){
    chk = chk || "";
    return '<li><input type="radio" id="m_' + d.mailId + '" name="defaultAccount" ' + chk + ' /><label ' + (d.relationType == 0 ? " class='manager'" : "") + ' for="m_' + d.mailId + '">' + d.mailId + '@' + gMain.domain + '（' + d.mailTrueName + '）</label></li>';
};
defaultAccount.updateList = function(){
    var html = [];
    var chk = '';
    var data = this.resultData;
    for(var k =0;k<data.length;k++){
        if(data[k] && data[k].isDefault == 1){
            chk = 'checked="checked"';
        }else{
            chk = '';
        }
        html.push(this.createListItem(data[k], chk));
    }
    this.$('setDefaultEmamil_container').innerHTML = html.join('');
    this.bindListItemEvents();
};
defaultAccount.bindListItemEvents = function(){
    var items = this.$('setDefaultEmamil_container').getElementsByTagName('input');
    var id, evt;
    var p = this;
    if(items && items.length>0){
        for(var i=0,l=items.length;i<l;i++){
            id = items[i].id.substr(2);
            evt = (function(id){
                return function(){
                    p.updateStatus(id);
                };
            })(id);
            EV.observe(items[i], 'click', evt, false);
        }
    }
};
defaultAccount.updateStatus = function(id){
    var d = this.resultData;
    for(var k=0;k<d.length;k++){
        
            if( d[k].mailId == id){
                d[k].isDefault = 1;
            }else{
                d[k].isDefault = 0;
            }
        
    }
};
defaultAccount.save = function(){
    var data = {};
    var p = this;
    var ld = p.resultData;
    for(var k in ld){
        if(ld[k] && ld[k].isDefault == 1){
            data = ld[k];
        }
    }
    
    this.doService(p.attrs.save.func,data,callback,function(d){
          if (d.summary) {
              p.fail(d.summary);
          }else{
              p.fail(Lang.Mail.ConfigJs.defaultEmailFail,d); //设置失败
          }         
     });

    function callback(d){
        if(d.code=="S_OK"){
            p.ok(Lang.Mail.ConfigJs.defaultEmailSuccess);//设置成功
        }else{
            p.fail(Lang.Mail.ConfigJs.defaultEmailFail,d); //设置失败
        }
    }
};

var memManager = new OptionBase();
memManager.attrs = {
    id : 'memManager',
    authority: 'MAIL_PUBLIC',
    divId:'pageUserAlias',
    noReq: true
};
memManager.init = function(){
    this.request(this.attrs, this.getHtml, null, true);
};
memManager.getHtml = function(attrs, values){
    var html = [];
    var p = this;
    html.push("<div class=\"bodySet\" style='align:text;' id=\"pageUserAlias\">");
    html.push("<div id=\"container\">");
    
    html.push(this.getTopHtml());
    html.push(this.getLeftHtml());
    html.push(this.getNavMenu(attrs.id));
    html.push("<div class=\"setWrapper\" id='setWrapp' style='padding-top:0'>");
    html.push('<iframe id="ifm_config_memberManage" name="ifm_config_memberManage" src="../ext/extmailuserlist.do?sid=' + gMain.sid + '" frameborder="0" scroll="no" width="100%" ></iframe>')
    html.push('</div>');
    html.push('</div>');
    html.push('</div>');
    
    MM[gConst.setting].update(attrs.id, html.join(''));
	memManager.updatePosition("ifm_config_memberManage");
	
	var oFrame = document.getElementById("ifm_config_memberManage");
	
	if(oFrame.attachEvent){
		oFrame.attachEvent("onload",function(){
			p.setIframeWidth();
			jQuery(window).resize(p.setIframeWidth);
		});
	}else{
		oFrame.onload = function(){
			//p.setIframeWidth();
			//jQuery(window).resize(p.setIframeWidth);
			p.correctWidthInIE6("ifm_config_memberManage");
		}
	}

};

memManager.setIframeWidth = function(){
	 var p = this;
	 var iframe = document.getElementById("ifm_config_memberManage");
			
	  iframe.style.width = memManager.getWidth() + "px";
/*
	
	var p = this;
    setInterval(function(){
        try {
            var iframe = document.getElementById("ifm_config_memberManage");
			
			   iframe.width = p.getWidth() + "px";
        } 
        catch (e) {

        }
    }, 100);
*/
	
	
};



memManager.getWidth = function(){
    var IWidth = window.document.documentElement.clientWidth || window.document.body.clientWidth;
    var a_width = IWidth - 363;

    var browser = navigator.appName
    
    var b_version = navigator.appVersion
    
    var version = b_version.split(";");
    if(version[1]){
		 var trim_Version = version[1].replace(/[ ]/g, "");
    
	    if (browser == "Microsoft Internet Explorer" && trim_Version == "MSIE6.0") {
	    
	        return a_width - 3;
	        
	    }
	    else {
	        return a_width;
	    }
	}else{
		return a_width;
	}
   
};

