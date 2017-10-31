


   function ValidateSpecialCharacter() { 
   var code; 
	   if (document.all) { 
		code = window.event.keyCode; 
	   } else { 
		code = arguments.callee.caller.arguments[0].which; 
	   } 
	   var character = String.fromCharCode(code); 
	   var txt=new RegExp("[\\~,\\$,\\%,\\^,\\+,\\*,\\\\,\\/,\\?,\\|,\\<,\\>,\\{,\\},\\(,\\),\\'',\"]");   
	  
	   if (txt.test(character)) { 
		if (document.all) { 
		 window.event.returnValue = false; 
		} else { 
		 arguments.callee.caller.arguments[0].preventDefault(); 
		} 
	   } 
} 


 function isOverCount(){
	 //新建联系人不能超过5000人
	 if(Addr.allContactsCount>=5000){
		 parent.CC.alert(Lang.maxConTip); 
		 return false;
	 
		 }else{
			 return true;
		 }
		 
		
	 }

var searchKey = function(){
		var op = Addr.getUrlVal("op");
		var keyVal = Addr.getUrlVal("keyVal");
		op = decodeURI(op);
		keyVal = decodeURI(keyVal);
	
		if(op == "key"){
			   
				Addr.searchList(keyVal,0,op);
				$("#showPersonListDetail").html(Addr.key );
				
			}
	}
	

var authorityValidate = function(){
         
	if(!parent.GC.check("ADDR_LIST_PERSON")){
			$("$personPage").css("display","none");
            window.location.href = "../addr/corpaddr.do?sid=" + Addr.getQueryString("sid")
		} 

		
		
	if (parent.IsOA == 1)
		{
			$("#importExportBox").removeClass().addClass("importBox");
			$("#showPersonListDetail").css({"background-color":"window","display":"block"});
		}
		else if(parent.GC.check("ADDR_LIST_EP"))
		{
		
			$("#corperationPage").css("visibility", "visible").show();
			$("#importExportBox").css("top","-10px");
		}

   
	
		if (parent.GC.check("ADDR_ADD_USER"))
		{
			$("#createNewPerson").css("visibility", "visible").css("display","inline-block");
		}
		
		if (parent.GC.check("ADDR_DELETEUSER"))
		{
			$("#deleteContactList").css("visibility", "visible").css("display","inline-block");
		}

		if (parent.GC.check("ADDR_COPY"))
		{
			$("#copyTo").css("visibility", "visible").css("display","inline-block");
		
		}
	
		if (parent.GC.check("ADDR_MOVE"))
		{
			$("#moveTo").css("visibility", "visible").css("display","inline-block");
		}
	
		if (parent.GC.check("ADDR_IMPORT"))
		{
			$("#personImport").css({"display":"inline","visibility":"visible"}).show();
	
		}
		
		if (parent.GC.check("ADDR_EXPORT"))
		{
			$("#personExport").css({"display":"inline","visibility": "visible"}).show();
			
		}
		
		
		if(!parent.GC.check("ADDR_IMPORT") && !parent.GC.check("ADDR_EXPORT"))
		{
			$("#importExportBox").hide();
		}
		
	
		if (parent.GC.check("ADDR_ADD_GROUP"))
		{
			$("#createGroup").show().css({"display":"inline","visibility": "visible"}).show();
		
		}
	
	
	}

jQuery(document).ready(function(){
	
	   $("#keyword").focus(function(){
				$(this).css("color","black");					
		});
	   	  
	   
	//权限控制，先隐藏
    $("#corperationPage,#createNewPerson,#deleteContactList,#copyTo,#moveTo,#personImport,#personExport,#createGroup").hide();
	
	//兼容ie下页面布局的偏移	  
    $(window.parent.document).find("#content").addClass("mt_5");
	
	//判断权限，后显示
	authorityValidate();

    //判断是否从“邮件全文检索” 跳转到通讯录
	searchKey();
	
	var fontW = "";
	
	//如果没有组织通讯录，标题“所有联系人”用粗体显示，否则用正常的字体显示
	if (parent.GC.check("ADDR_LIST_EP"))
	{
		fontW = "normal";
	}else{		
		fontW = "bold";
	}
    
	//如果不是“全文检索”，加载联系人列表
    if ( Addr.getUrlVal("op") != "key") {
		Addr.loadList(0);
	}
	
	//加载个人通讯录  树结构
	Addr.getUserLinkManGroup("linkmanGroup");

	var resHTML=[];
   
    $("#ALL").addClass("current");
     
	$("#showPersonListDetail").show().html(Lang.all_contacts+"<span class=\"\"> <font color='#666666' style=\"font-size: 12px;font-weight:"+fontW+";\">(   "+Lang.person+")</font></span>");
 
    Addr.pageShowHide();
	
    
})
