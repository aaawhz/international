 
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

  
var searchKey = function(){
		var op = Addr.getUrlVal("op");
		var keyVal = Addr.getUrlVal("keyVal");
		op = decodeURI(op);
		keyVal = decodeURI(keyVal);
		if(op == "key"){		    				
				Addr.searchList(keyVal,2,op);		
			}
	}

   $(document).ready(function(){
		
		//权限控制，先  复制到、导出 先隐藏
		$("#corExport,#copyTo").hide();
		
		var tId = 0;
		
		/*如果是OA邮箱，加载组织通讯录的部门结构列表,开始加载第一级，[IsOA 表示 oa邮箱]
		 *会同时返回总部的联系人列表的数据，根据这个列表来更新页面联系人列表
		 *否则加载同步结构树
		 */
		if(parent.IsOA == 1){
			
			Addr.loadDepList(tId,0);
			
			//异步的组织通讯录不分页，隐藏分页项
			$("#showPageDetail1,#showPageDetail").hide();
			
		}else{
			//加载联系人列表
			Addr.loadList(2);
			//加载组织架构树
			Addr.getDeptList();
			//分页显示控制
			Addr.pageShowHide();
		}	
						  
		$("#keyword").focus(function(){
				$(this).css("color","black");					
		});	
		
		//兼容ie下布局位置偏移的问题				  		  
		$(window.parent.document).find("#content").addClass("mt_5");
		
		//判断是否从“邮件全文检索” 跳转到通讯录
		searchKey();
						
		$("#ALL").addClass("current");
	
		if (!parent.GC.check("ADDR_LIST_PERSON")){
		  //如果没有个人通讯录的权限，则隐藏“个人通讯录”链接按钮	
		  $("#personPage").css("display","none");  
		}
	
		if (parent.GC.check("ADDR_COPY")){
		   //组织通讯录中控制权限控制---->复制到功能
		   $("#copyTo").css("visibility", "visible").css("display","inline-block");
		}	
		
	
})