     function addNewGroup() {
			$("#addNewGroupHlink").hide();			
			$("#addNewGroupDiv").show();
			$("#addNewGroupText").focus();
		}
	
		function addNewGroupCancel() {
			$("#addNewGroupHlink").show();
			$("#addNewGroupDiv").hide();
		}
		
  
  $(document).ready(function(){
	     	
		var userId=parent.GMC.getFrameWin("outLink_addr").Addr.getUserId().split(",");
		var type=0;
		var groupId="";	
		var newGroup="";
		var curGroup=parent.GMC.getFrameWin("outLink_addr").Addr.curGroup;
	    var curId = parent.GMC.getFrameWin("outLink_addr").Addr.groupId;
		var label = Lang.group_NewAdd;
		
		var lData={groupFlag:0}; 
        
		$("#addNewGroupDiv").append(Addr.getFalseTip("copyTip",Lang.newGroup_fail,"copyTipText"));
		
		$("#addNewGroupText").bind("keydown",function(ev){
			if(parent.EV.getCharCode(ev) == 13){
				$(this).blur();
				$("#addNewGroupSave")[0].click();
			}
		});	
		
		  
	
		function callBackList(data){
		$("#checkList").empty();
		    
			var liList = [];
			for(var i =0,len=data["var"].length; i<len; i++)
			{
			  	 var tId = data["var"][i][0];
					 tId = parseInt(tId);
					 var tName = data["var"][i][1];
					 
				/*var tId = data["var"].group[i].groupId;
				var tName = data["var"].group[i].groupName;*/
				if(tName!=curGroup && tId != 0 && tId != -1)
				{
			  liList.push( "<li> <input type='radio'  name='radiobox'  id='"+tId+"'><label for='"+tId+"' class='newName'>"+tName+"</label></li>" );
				}
			  // groupId.push(tId);
			}
			
		     $("#checkList")[0].innerHTML=liList.join("");
			 
			$("#checkList input").click(function(){
				  newGroup="";
			 $("#newGroupCheck").attr("checked",false);
			  $('#newGroupInput').css('color','gray').val(label)
			});
		}	
		
	  	Addr.Ajax("addr:getGroupList", lData, callBackList);	
		

			 
                $('#newGroupInput').css('color','gray').val(label)
                .focus(function(){
                    if($(this).val() == label){
                        $(this).val('').css('color','black');
						$("#newGroupCheck").attr("checked",true);
						
			         $("input[name='radiobox']").each(function(){
                     $(this).attr("checked",false);
                    });
                    }
                })
                .blur(function(){
                    if($(this).val().trim() == ''&& $("#newGroupCheck").attr("checked")==false){
                        $(this).val(label).css('color','gray');
                    }
                })
				
				
				
			
					
				$("#newGroupCheck").click(function(){
				   
				    
					 if($(this).attr("checked")=="checked") {

			         $("input[name='radiobox']").each(function(){
                     $(this).attr("checked",false);
		            }	);
					
					$("#newGroupInput").val("").focus();
					
			 
			     }else{
				   $('#newGroupInput').css('color','gray').val(label)
				 
				 }
				
				});
		
				
	  //用户点击移动组事件	
	  $("#subCopy").click(function(){
  
	     groupId="";
		 newGroup="";
	     var bSend=true; 
		 $("#copyTip").css("display","none");
		 //取出用户选中复选框的ID
	     $("input:radio[name=radiobox]:checked").each(function(){  
			groupId=(parseInt($(this).attr("id"))); 
		 })
		   
		if($("#newGroupCheck").attr("checked")=="checked") {
		
            
		     if($("#newGroupInput").val().trim()==""){
			 
			 $("#msgSpan").css("display","inline").html(Lang.quickadd_nameNotEmpty);
			 bSend=false;
			 }
		   
		   
		     else{
			    //获取用户输入的新组名
			    newGroup=$("#newGroupInput").val();
				
				 //如果新组名为空，提示“请输入新组名”
				if(newGroupText == ""){
					//parent.CC.alert(Lang.inputGroupNameTip);//组名为空，提示“请输入组名”
					$("#copyTip").css("display","inline");
					$("#copyTipText").html(Lang.inputGroupNameTip);
					return;
				} 
			   	 
				if(newGroup.trim()==Lang.ungrouped_contacts || newGroup.trim()==Lang.ungroup)
				{
				   bSend=false; 
				   //提示未分组已存在
			      // $("#msgSpan").css("display","inline").html(Lang.exist_ungroup);
				   $("#copyTip").css("display","inline");
				   $("#copyTipText").html(Lang.exist_ungroup);
				   return;
				 }
				else if(newGroup.search(/["'“‘\\\/\^\<\>]/)!=-1)
				{
					//提示组名不能包含引号
			
					bSend=false;
					

					$("#copyTip").css("display","inline");
				   $("#copyTipText").html(Lang.quotationMarks);	
					return;	   
				}
			    else if(newGroup.trim()==Lang.all_contacts)
				{
					bSend=false;
					//提示“所有联系人”已存在
		
					$("#copyTip").css("display","inline");
				   $("#copyTipText").html(Lang.groupName_repeat);
					return;
				}
			    else
				{
			   		bSend=true;	
			    }  
			 }
		
		} 
		
		else{
		    //如果用户未选择要移动的分组，提示请选择
			if(groupId=="")
			{
			  parent.CC.alert(Lang.index_selectTargetGroup);
			  bSend=false;
			  return;
			}
		} 
		
		//如果可以提交	
		if(bSend)
		{
			    //移动组成功的回调函数
				function callBack(data){ 
					 if(data.code="S_OK" )
					 { 
					    top.CC.showMsg(Lang.moveSuc,true,false,"option");
					    parent.GMC.getFrameWin("outLink_addr").Addr.count=-1;
						parent.GMC.getFrameWin("outLink_addr").Addr.pageNo=0;
						parent.GMC.getFrameWin("outLink_addr").Addr.op="moveTo";
						parent.GMC.getFrameWin("outLink_addr").Addr.curGroup=curGroup;
   						parent.GMC.getFrameWin("outLink_addr").Addr.loadList(0);
					    parent.GMC.getFrameWin("outLink_addr").Addr.getUserLinkManGroup("linkmanGroup");
					    parent.CC.closeMsgBox('moveTo');
					 }
				 }
				
				//清除特殊字符
			    newGroup=Addr.emptySpecial(newGroup);
				
				//移动组提交的数据
				var data={
					curId : curId,
					groupId:groupId,
					groupName:newGroup.trim(),
					id:userId
					};
				
				//移动组的AJAX请求
				Addr.Ajax("addr:move", data,callBack,function(data)
				 {
					if(data.code=="NAME_REPEAT")
					{   
					    //提示组名重复
						$("#msgSpan").css("display","inline").html(Lang.groupName_repeat);;
						$("#groupNameInput").focus();
						newGroup="";
					}
					else
					{   //移动失败的提示
						parent.CC.alert(Lang.index_movContactFailure);
					}
					
				});	
	          
			}
	  
	  
	  });
	  	
		
	  //点击添加组名的事件	
	  jQuery("#addNewGroupSave").click(function(){
		    $("#copyTip").css("display","none");
			//获取新组名	
			var newGroupText = jQuery("#addNewGroupText").val().trim();
            
			if(newGroupText == ""){
					//parent.CC.alert(Lang.inputGroupNameTip);//组名为空，提示“请输入组名”
					$("#copyTip").css("display","inline");
				   $("#copyTipText").html(Lang.inputGroupNameTip);	
					return;
			} 
			//提示“所有联系人”存在
			if (newGroupText.trim() == Lang.all_contacts || newGroupText.trim()==Lang.ungrouped_contacts || newGroupText.trim()==Lang.ungroup) {
				//parent.CC.alert(Lang.groupName_repeat + "!");
				$("#copyTip").css("display","inline");
				   $("#copyTipText").html(Lang.groupName_repeat + "!");

			} else if (newGroupText.search(/["'“‘\\\/\^]/) != -1) {
				//提示新组名不能包含引号
				//parent.CC.alert(Lang.quotationMarks);
				$("#copyTip").css("display","inline");
				   $("#copyTipText").html(Lang.quotationMarks);	
			}
			else {
				newGroupText=Addr.emptySpecial(newGroupText);
				//newGroup=Addr.emptySpecial(newGroup);
			    data={op:"add",groupId:0,groupName:newGroupText};
				 
				 //新增组名成功的回调函数
				 function callBack(data)
				 {
					 if(data.code=="S_OK")
					 {
					  
					   top.CC.showMsg(Lang.NewGropSucTip,true,false,"option");
					   jQuery("#addNewGroupHlink").show();
					   jQuery("#addNewGroupText").val("");
					   jQuery("#addNewGroupDiv").hide();
					   //Addr.Ajax("addr:getGroupList", lData, callBackList);
					   jQuery("#checkList").append( "<li> <input type='radio'  name='radiobox'  id='"+data["var"]+"'><label for='"+data["var"]+"' class='newName'>"+newGroupText+"</label></li>" );
					   
					   var checkedVal = $("input[name=radiobox]:checked").val();
				       
					   if(checkedVal == null){
					   		$("input[type=radio][id="+data["var"]+"]").attr("checked",true);
					   };
					  	 	
					  	
					    	
					   //jQuery("#checkList").append("<li> <input type='checkbox'  name='checkbox'  id='"+data.var+"'><label style='margin-left:4px;' for='"+data.var+"'>"+newGroupText+"</label></li>");
					
					 }
					
				  }
				 
		 
				 Addr.Ajax("addr:addGroup",data,callBack,function(data)
				 {
					if(data.code=="NAME_REPEAT")
					{
						//parent.CC.alert(Lang.groupName_repeat + "!");
						$("#copyTip").css("display","inline");
				   $("#copyTipText").html(Lang.groupName_repeat + "!");
						jQuery("#addNewGroupText").focus();
					}
					else 
					{
						//parent.CC.closeMsgBox('createGroup')
						$("#copyTip").css("display","inline");
				 	  $("#copyTipText").html(Lang.newGroup_fail);	
						//parent.CC.alert(Lang.newGroup_fail);
					}
				}
				);
					
				
			}

		});  
     
	
				
	  });
	  
	// JavaScript Document