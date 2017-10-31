function fGoto() {
}

var CC = parent.CC;
var AddrCom = {
	/**
	 * 全选
	 */
	selAll : function(obj, name) {
		var bool = $(obj).attr("checked");
		$(":checkbox[name='" + checkName + "']:enabled").attr("checked", bool);
	},
	/* 删除判断 */
	checkDel : function(obj, AlertMsg) {
		var objs = document.getElementsByName(SelObjsID);
		if(IsNull(objs)) {
			AddrCom.alert(Lang.Addr.public_pleaseSelectItem);
			return false;
		}
		var iCount = 0;
		for(var i = 0; i < objs.length; i++) {
			if(objs[i].checked == true) {
				iCount = iCount + 1;
			}
		}
		if(iCount == 0) {
			AddrCom.alert(Lang.Addr.public_pleaseSelectItem);
			return false;
		}
		return confirm(AlertMsg);
	},
	//通用提示信息
	alert : function(title, Content, callBack) {
		if(typeof (callBack) != "function"){
			callBack = '';
		}
		CC.alert(Content, callBack, title);
	},
	confirm : function(title, Content, callBack, CancelCallBack) {
		CC.confirm(Content, callBack, title, CancelCallBack);

	},
	showHtml : function(strUrl, strTitle, strId, width, height) {
		if(!strTitle){
			strTitle = Lang.Addr.public_title;
		}
		if(!strId){
			strId = "example1";
		}
		var ao = {
			id : strId,
			title : strTitle,
			url : strUrl,
			width : width,
			height : height,
			buttons : null,
			sysCloseEvent : false
		};
		CC.showHtml(ao);
	},
	showMsgBox : function(strContent, strTitle, strId) {
		if(!strTitle){
			strTitle = Lang.Addr.public_title;
		}
		if(!strId)
		{
			strId = "example1";
		}
		var ao = {
			id : strId,
			title : strTitle,
			text : strContent,
			buttons : [{
				text : Lang.Addr.detailAdd_Ok,
				clickEven : function() {
				},
				isCancelBtn : false
			}],
			sysCloseEvent : false
		};
		CC.msgBox(ao);
	},
	closeMsgBox : function(id) {
		CC.closeMsgBox(id);
	},
	getDimensions : function(o) {
		CC.getDimensions(o);
	},
	getCheckedValue : function(id) {
		var o = $("input[name='addrcheckbox']:checked");
		var v = "";
		$(o).each(function(i) {
			var temp = $(this).val().split(",");
			var tv = temp[id];
			if(tv != "") {
				v += tv + ",";
			}
		});
		return v.substr(0, v.length - 1);
	},
	isCheckedOK : function(id) {
		var o = $("input[name='addrcheckbox']:checked");
		var ret = true;
		$(o).each(function(i) {
			var temp = $(this).val().split(",");
			var tv = temp[3];
			if(id == 0) {
				if(tv != 0) {
					ret = false;
				}
			} else {
				if(tv == 0) {
					ret = false;
				}
			}
		});
		return ret;
	},
	optSend : function(id) {
		switch(id) {
			case "sms":
				sendSms();
				break;
			case "mms":
				sendMms();
				break;
			case "mail":
				sendMail();
				break;
			default:
				break;
		}

		function sendSms() {
			var pm = AddrCom.getCheckedValue(2);
			//parent.CC.goSSO('601','sms','发送短信',pm);
			CC.goSms('', pm);
		}

		function sendMms() {
			var pm = AddrCom.getCheckedValue(2);
			//parent.CC.goSSO('701','mms','发送彩信',pm);
			CC.goMms('', pm);
		}

		function sendMail() {
			var pm = AddrCom.getCheckedValue(1);
			CC.compose(pm);
		}

	},
	opAddr:function(id,attrs) {
		var func = AddrCom.opFunc[id];
		if(typeof func=="function"){
			func(attrs);
		}
	},
	opFunc : {
		addGroup : function() {
			
			if(!GC.check("ADDR_ADD")){
   				CC.forbidden();
   				return false;  				
			}
			
			var id = "addrGroupId";
			var og = $("#" + id);
			var groupNamMaxLen = 20;
			//var html = Lang.Addr.quickadd_contactGroupName+'<input type="text" id="addrGroupId" maxlength="' + groupNamMaxLen + '" class="text" value="' + val + '"/><span id="spnEroMsg" class="msgSet"></span>';
	
			var callback = function(obj,showMsg) {

				var fn =$(obj).val();
				fn = fn.trim();
				
				if(fn.indexOf("\"")!=-1 || fn.indexOf("'")!=-1) {//判断组名是否为空
					var errMsg = Lang.Addr.Quotes;
					showMsg(errMsg);
					$(obj).focus();
					return true;
				}
				
				if(fn =="") {//判断组名是否为空
					var errMsg = Lang.Addr.quickadd_nameNotEmpty;
					showMsg(errMsg);
					$(obj).focus();
					return true;
				}
				
					
				
				//限制字符数为12   判断组名长度
				if(fn.len() > groupNamMaxLen) {
					showMsg(Lang.Addr.groupName_length_limit);
					$(obj).focus();
					return true;
				}
				
				
				//判断重名
				var flag = false;				
				$("#addr_left_Menu2 .text a").each(function(){
					if($(this).text()==fn){
						flag=true;
					}					
				});
					

				if(flag) {
					showMsg(Lang.Addr.quickadd_checkFailure);
					$(obj).focus();
					return true;
				}
				
			    
			    var data={"op":"add","groupId":0,"groupName":fn};
			    
			    AddrCom.Ajxa(AL.serverUrl,"addr:addGroup",data,function(d){
			    		if(d.code=="S_OK"){
							AL.loadMenu(false);	
							CC.synData(null, "common_addr");						
						}
						else{
							CC.alert(d.summary);
						}
			    });
			    
			    
			}
			
			CC.prompt({
					 	id:"addrGroupId",  //文本框id
					 	html:Lang.Addr.quickadd_contactGroupName+"$TEXT$",
					 	maxlength:20,  //文本框最大长度
					 	okText:"",//确定按钮是显示的文字
					 	cancelText:"",
					 	attr:"",   //取消按钮要显示的文字
					 	value: ""			//文本框初始化的值 
 					},callback,Lang.Addr.group_NewAdd)
			
			
		},
		editGroup : function(groupId,groupName) {
			
			if(!GC.check("ADDR_ADD")){
   				CC.forbidden();
   				return false  				
			}
			
			var id = "addrGroupId";
			var og = $("#" + id);
			var val = groupName || "";
			var groupNamMaxLen = 20;
	
			var callback = function(obj,showMsg) {

				var fn =$(obj).val();
				fn = fn.trim();
				
				if(fn == "") {//判断组名是否为空
					var errMsg = Lang.Addr.quickadd_nameNotEmpty;
					showMsg(errMsg);
					$(obj).focus();
					return true;
				}
				
				//判断重名
				var flag = false;				
				$(".addr_left_Menu .text a").each(function(){
					if($(this).text()==fn){
						flag=true;
					}
					
				})					

				if(flag) {
					showMsg(Lang.Addr.quickadd_checkFailure);
					$(obj).focus();
					return true;
				}
				
			    
			    var data={"op":"update","groupId":$(obj).attr("groupId"),"groupName":fn};
			    
			    AddrCom.Ajxa(AL.serverUrl,"addr:updateGroup",data,function(d){
			    		if(d.code=="S_OK"){
							AL.loadMenu(false);	
							CC.synData(null, "common_addr");
						}
						else{
							CC.alert(d.summary);
						}
			    });
			     
			 
			}

			CC.prompt({
					 	id:"addrGroupId",  //文本框id
					 	html:Lang.Addr.quickadd_contactGroupName+"$TEXT$",
					 	maxlength:20,  //文本框最大长度
					 	okText:"",     //确定按钮是显示的文字
					 	cancelText:"", //取消按钮要显示的文字
					 	attr:'groupId="'+groupId+'"',   
					 	value: groupName			//文本框初始化的值 
					 	
 					},callback,Lang.Addr.group_Update)
			
			
		},
		addUser:function(){
			
			var ao = {     			
		  		id:"adduser", 			
		 		title:Lang.Addr.index_addContact, 	
		  		url:"../addr/opaddruser.do?sid="+GC.top.gMain.sid, 		
		   		width:402, 			
		  		height:440, 
		  		scoll:"auto",		
		    	sysCloseEvent:false
		  	};
			CC.showHtml(ao);
			
			var adduserCallback=function(){

				var iframeDom= parent.frames["ifrm_DialogHtml_adduser"];
				
				
				
				if(!iframeDom.AddrEdit.addrSave()){
					event.stopPropagation();
				}
				
				
			}
		},
		
		editUser:function(id,userName){
			
			if(!GC.check("ADDR_UPDATEUSER")){
   				CC.forbidden();
   				return false  				
			}
			
			
			var ao = {     			
		  		id:"adduser", 			
		 		title:Lang.Addr.detailEdit_editContact, 	
		  		url:"../addr/opaddruser.do?sid="+GC.top.gMain.sid+"&uid="+id, 		
		   		width:402, 			
		  		height:440, 
		  		scoll:"auto",		
		    	sysCloseEvent:false
		  	};
			CC.showHtml(ao);
		},
		viewUser:function(id,userName){
			var ao = {     			
		  		id:"viewUser", 			
		 		title:Lang.Addr.group_viewAddr, 	
		  		url:"../addr/viewuser.do?sid="+GC.top.gMain.sid+"&uid="+id, 		
		   		width:402, 			
		  		height:440, 
		  		scoll:"auto",		
		    	sysCloseEvent:false
		  	};
			CC.showHtml(ao);
		},
		myAddr:function(){			
			if(!document.getElementById("addr_left_bg2")){
				CC.goAddress();
				AL.switchMenu(document.getElementById("addr_left_bg2"),2);
			}else
			{	
				AL.switchMenu(document.getElementById("addr_left_bg2"),2);
			} 					
		},
		epAddr:function(){
			if(!document.getElementById("addr_left_bg2")){
				AL.switchMenu(document.getElementById("addr_left_bg0"),0);
				CC.goAddress();
			}else
			{ 
				AL.switchMenu(document.getElementById("addr_left_bg0"),0);
			}
		},
		csAddr:function(){
			if(!document.getElementById("addr_left_bg2")){
				CC.goAddress();
				AL.switchMenu(document.getElementById("addr_left_bg1"),1);
			}else
			{ 
				AL.switchMenu(document.getElementById("addr_left_bg1"),1);
			}
		},
		sendMail:function(){
			var es=AddrCom.getCheckedValue1(1);
			AL.send('mail',es);
		}		
	},
	getLeftStr:function(s,len){
		var i = 0;
	    var j = 0;
	    if (AddrCom.getLenStr(s)<=len) {
	        return s;
	    }
	    while (j < len) {
	        if (s.charCodeAt(i) > 255) {
	            j += 2;
	        }else {
	            j++;
	        }
	        i++;
	    }
	    return s.substring(0, i) + "...";	
	},
	getLenStr:function(s){
		var len = 0;
	    for (var i = 0,l = s.length; i < l; i++) {
	        if (s.charCodeAt(i) > 255) {
	            len += 2;
	        }else {
	            len++;
	        }
	    }
	    return len;
	},
	getCheckedValue:function(id){
		
		    var o = $("input[name='addrcheckbox']:checked");
    
			var arr=new Array();
		    var v = "";
		    $(o).each(function(i){
		        var temp = $(this).val().split(",");
		        var tv   = temp[id];
		        if(tv!=""){
		            arr.push(parseInt(tv));
		        }
		    });
		    
		    return arr;
	},
	getCheckedValue1:function(id){
		var o = $("input[name='addrcheckbox']:checked");
	    var v = "";
	    $(o).each(function(i){
	        var temp = $(this).val().split(",");
	        var tv   = temp[id];
	        if(tv!=""){
	            v += tv + ",";
	        }
	    });
	    return v.substr(0,v.length-1);
	},
	isCheckedOK:function(id)
	{
	    var o = $("input[name='addrcheckbox']:checked");
	    var ret = true;
	    $(o).each(function(i){
	        var temp = $(this).val().split(",");
	        var tv   = temp[3];
	        if(id==0)
	        {
	            if(tv!=2)
	            {
	               ret = false;
	            }
	        }
	        else
	        {
	            if(tv==2)
	            {
	               ret = false;
	            } 
	        }
	    });
	    return ret;
	},
	Ajxa:function(url,func,data,callback){
		parent.MM.doService({
				   url:url,
				   func:func,
				   data:data,
				   failCall:function(d){
				   	  if(d.summary)
				   		CC.alert(d.summary);			   	
				   },
				   call:callback,
				   param:""		   
				});
	}
	
	

}


