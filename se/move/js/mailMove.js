/***
 * @description 邮件搬家
 * @auth tangl
 */
var mailMove = {
	func: "user:queryMoveStatus",    
    retData: null, //JSON数据   
    formUser : "",
    msgList:{},
     /**
     * 开始加载邮箱搬家页面, 点击[刷新]查看, 都触发此函数
     * 启动搬家成功后   的回调函数 (要获取搬家后的状态)
     * Ajax请求
     * @param {Object} func
     * @param {Object} calldata  启动邮箱搬家后接口返回的数据,成功,以及失败的错误码
     * @param {Object} user      被搬家的邮箱账号
     */
	initMoveStatus : function(calldata,user){		
		var p = this;
		p.msgList = {
			"0": parent.Lang.Mail.ConfigJs.MailMove_Status0,//"您还没有启动“邮箱搬家”，可以点击【重新搬家】开启。",
			"1": parent.Lang.Mail.ConfigJs.MailMove_Status1,//"您的“邮箱搬家”已经启动，请稍候 <a href=\"javascript:fGoto();\" onclick=\"javascript:window.location.reload();\" class=\"move-fresh\">刷新</a> 页面查看搬家详情。 ",
			"2": parent.Lang.Mail.ConfigJs.MailMove_Status2,//很遗憾，搬家出错，原因是旧账号登录失败。
			"3": parent.Lang.Mail.ConfigJs.MailMove_Status3,//"您已经完成“邮箱搬家”，总共需要从原企业邮箱中收取 <var class=\"h_mail_num\">{0}</var>封 历史邮件，成功收取 <var class=\"s_mail_num\">{1}</var>封，失败 <var class=\"f_mail_num\">{2}</var>封。"
			"4": parent.Lang.Mail.ConfigJs.MailMove_Status1,//"原邮箱系统服务器ip或端口错误，请联系管理员",
			"5": parent.Lang.Mail.ConfigJs.noMailCanMove //"{0}已被其他帐号搬完啦，无法再次搬家"
		};
		
		var data = {
			toUser: top.gMain.loginName || to.gMain.userName,
			fromUser: top.gMain.mailMove_fromUer || "" 	 //给点击刷新的时候有用					
		};
		var code = GC.getUrlParamValue(location.href,"code");	
		
		//如果是刚启动的搬家,是有被搬家的邮箱账号的,这时根据账号去找到搬家的状态(搬了多少封)
		if(user){
			data.fromUser = user;
			top.gMain.mailMove_fromUer = user; //保存
		}else if(!user && !code){
			//如果没有,而且没有code,(暂时不知道code作用),则不用去查询了   [去掉红色样式 fail_red]
			jQuery("#moveMsgDiv").html('<div class="move-common ">'+p.msgList[0]+'</div>');	
			//return;
		}
				
		if(calldata){
			p.formUser = user;
			//p.retData = calldata;
			if(calldata.code != "S_OK"){
				//回调函数显示相关信息
				jQuery("#moveMsgDiv").html(p.getStartErrStr(calldata.code))			
				return;
			}
		}else if(code){	
			p.formUser = GC.getUrlParamValue(location.href,"user");		
			jQuery("#moveMsgDiv").html(p.getStartErrStr(code))
			return;
		}
		
		// 点击邮箱搬家, 开始请求搬家状态, (后台根据 sid 来得到状态数据)
		p.Ajax(p.func,data,function(d){						
			jQuery("#moveMsgDiv").html(p.getMoveMsgStr(d["var"]));
		});
	},
	getMoveMsgStr:function(data){
		var html = [];	
		var p  = this;
		var code = "0";
		
		if(data && data.length > 0){		
			code = data[0].status+"";
			if(data[0].status == 0 && data[0].fromUser != "")
				code = "1";
		}
		
		var showMsg = p.msgList[code];
		
		if (code =="2" || code == "3") {
			code="3";
			showMsg = p.msgList[code];
			showMsg = showMsg.format(data[0]["report"].messageCount || 0, data[0]["report"].receivedMessageCount || 0, data[0]["report"].errorMessageCount || 0);
			//parent.CC.refreshFolder(false);
			parent.LM.freshFolderMain(function(){}, true);
		}
		return p.getCodeStr(code,showMsg);
	},
	getCodeStr:function(code,showMsg){
		var html = [];
		html.push('<div class="move-common {0}">'.format(code == "99" ? "fail_red":""));
		html.push(showMsg);
		html.push("</div>");
		return html.join("");
	},
	
	/**
	 * 根据错误码,得到错误提示文字
	 */
	 
	getStartErrStr:function(code){
		var p = this;
		var str="";
		if(code == "FA_BAD_PASSWORD")
			str = p.getCodeStr("99",p.msgList["2"]);
		else if(code == "FA_BAD_SERVER")
			str = p.getCodeStr("99",p.msgList["4"]);
		else if(code == "FA_XXXX_EXISTS")
			str = p.getCodeStr("99",p.msgList["5"].format(p.formUser));
		else 
			str = p.getCodeStr("0",p.msgList["0"]);
		return str;
	},
	onMailMove:function(){
		var p = this;
		var call = function(d,user){			
			p.initMoveStatus(d,user);
		};
		parent.Main.showMailMoveDiv(call);
	},
    Ajax: function(func,data, callback,failcallback){
		failcallback = failcallback || function(d){
        	if (d.summary) 
            	parent.CC.alert(d.summary);
        };
        parent.MM.mailRequestApi({            
            func: func,
            data: data,
            failCall: failcallback,
            call: function(d){
                callback(d)
            },
            param: ""
        });
    }
}
