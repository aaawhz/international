$(document).ready(function(){

    var id = parent.GMC.getFrameWin("outLink_addr").Addr.userId;
    
    var groupName = parent.GMC.getFrameWin("outLink_addr").Addr.getGroupName().decodeHTML();
    
    
    var label = groupName;
    $('#editGroupNameInput').val(label).focus(function(){
        if ($(this).val() == label) {
            $(this).css('color', 'black');
        }
    }).blur(function(){
        if ($(this).val() == '') {
            $(this).val(label);
        }
    })
    
    

    var editInput = $("#editGroupNameInput")[0];
	
    var tip = new parent.ToolTips({
	    id: '',
		win: window,
		left: 93,
		top: 57,
	    direction: parent.ToolTips.direction.Bottom
	});
	
	$("#editGroupNameInput").bind("keydown",function(ev){
			if(parent.EV.getCharCode(ev) == 13){
				 $("#btnSaveEdit")[0].click();
			}
		})
	
    $("#btnSaveEdit").click(function(){
    
    
    
    
    
        groupName = $("#editGroupNameInput").val();
        
        
        
        if (groupName.replace(/\s/g, "") == "") {
        
           // $("#msgSpan1").css("display", "block");
		   tip.close();
			tip.show(editInput,Lang.quickadd_nameNotEmpty);
            
            
        }
        else 
            if (groupName.search(/["'“‘\\\/\^\<\>]/) != -1) {
                bSend = false;
                //$("#msgSpan1").css("display", "block").html(Lang.quotationMarks);
				tip.close();
				tip.show(editInput,Lang.quotationMarks);
                
            }
            else 
                if (groupName.trim() == Lang.ungrouped_contacts || groupName.trim() == Lang.ungroup) {
                
                    bSend = false;
                    //$("#msgSpan1").css("display", "block").html(Lang.exist_ungroup);
					tip.close();
					tip.show(editInput,Lang.exist_ungroup);
                }
                else 
                    if (groupName.trim() == Lang.all_contacts) {
                        bSend = false;
                       // $("#msgSpan1").css("display", "block").html(Lang.groupName_repeat);
					   tip.close();
					   tip.show(editInput,Lang.groupName_repeat);
                    }
                    else 
                        if (groupName.trim() == label) {
                            parent.CC.showMsg(Lang.eGroupSuc, true, false, "option");//1
                            parent.CC.closeMsgBox('editGroup');//2
                        }
                        
                        else {
                            groupName = Addr.emptySpecial(groupName);
                            var data = {
                                groupId: id,
                                groupName: groupName.trim()
                            };
                            
                            function callBack(data){
                                if (data.code == "S_OK") {
                                    parent.GMC.getFrameWin("outLink_addr").Addr.op = "updateGroup";
                                    parent.GMC.getFrameWin("outLink_addr").Addr.getUserLinkManGroup("linkmanGroup");
                                    top.CC.showMsg(Lang.eGroupSuc, true, false, "option");
									var o = parent.GMC.getFrameWin("outLink_addr").document.getElementById("tip_groupName");
                                   if(o){
								      o.innerHTML = groupName.trim();
								   }
								    
									parent.CC.closeMsgBox('editGroup')
                                    
                                }
                                
                            }
                            Addr.Ajax("addr:updateGroup", data, callBack, function(data){
                                if (data.code == "NAME_REPEAT") {
                                    //$("#msgSpan1").css("display", "block").html(Lang.groupName_repeat);
									tip.close();
									tip.show(editInput,Lang.groupName_repeat);
                                    $("#groupNameInput").focus();
                                }
                                
                            });
                            
                        }
        
    });
    
});


// JavaScript Document
