$(document).ready(function(){

    $("#groupNameInput").focus();
    
    parent.GMC.getFrameWin("outLink_addr").Addr.op = "addGroup";
    

	 var editInput = $("#groupNameInput")[0];
	
    var tip = new parent.ToolTips({
	    id: '',
		win: window,
		left: 93,
		top: 57,
	    direction: parent.ToolTips.direction.Bottom
	});
	
	$("#groupNameInput").bind("keydown",function(ev){
		if(parent.EV.getCharCode(ev) == 13){
			 $("#btnSave")[0].click();
		}
	})

    $("#btnSave").click(function(){
    
        var newGroup = $("#groupNameInput").val().trim();
        
        if (newGroup.replace(/\s/g, "") == "") {
            //$("#msgSpan").css("display", "block");
			tip.close();
			tip.show(editInput,Lang.quickadd_nameNotEmpty);
            
        }
        else 
            if (newGroup.search(/["'“‘\\\/\^\<\>]/) != -1) {
                bSend = false;
               // $("#msgSpan").css("display", "block").html(Lang.quotationMarks);
			   tip.close();
			   tip.show(editInput,Lang.quotationMarks);
                
            }
            else 
                if (newGroup.trim() == Lang.all_contacts) {
                    bSend = false;
                    //$("#msgSpan").css("display", "block").html(Lang.groupName_repeat);
					tip.close();
					tip.show(editInput,Lang.groupName_repeat);
                }
                else 
                    if (newGroup.trim() == Lang.ungrouped_contacts || newGroup.trim() == Lang.ungroup) {
                    
                        bSend = false;
                        //$("#msgSpan").css("display", "block").html(Lang.exist_ungroup);
						tip.close();
						tip.show(editInput,Lang.exist_ungroup);
                    }
                    
                    else {
                    
                        newGroup = Addr.emptySpecial(newGroup);
                        data = {
                            op: "add",
                            groupId: 0,
                            groupName: newGroup
                        };
                        
                        function callBack(data){
                            if (data.code == "S_OK") {
                            
                                parent.GMC.getFrameWin("outLink_addr").Addr.getUserLinkManGroup("linkmanGroup");
                                top.CC.showMsg(Lang.NewGropSucTip, true, false, "option");
                                
                                
                            }
                            parent.CC.closeMsgBox('createGroup')
                            
                        }
                        
                        
                        Addr.Ajax("addr:addGroup", data, callBack, function(data){
                            if (data.code == "NAME_REPEAT") {
                  
								tip.show(editInput,Lang.groupName_repeat);
                                $("#groupNameInput").focus();
                            }
                            else {
								parent.CC.alert(Lang.newGroup_fail);
                                parent.CC.closeMsgBox('createGroup')
                                
                            }
                        });
                        
                        
                    }
        
    });
    
});

// JavaScript Document
