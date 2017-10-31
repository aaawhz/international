
function addNewGroup(){
    $("#addNewGroupHlink").hide();
    $("#addNewGroupDiv").show();
    $("#addNewGroupText").focus();
}

function addNewGroupCancel(){
    $("#addNewGroupHlink").show();
    $("#addNewGroupDiv").hide();
}

//非通讯录页面    调用     通讯录接口   要兼容云通讯录，作为标准版
/*
function Ajax(func, data, callback, failcallback){
        parent.MM.doService({
            url: parent.gConst.addrApiUrl, 
            func: func,
            data: data,
            failCall: failcallback,
            call: callback,
            param: ""
        });
    }
*/
    

// [1-->"01"] [12-->"12"] 
function toDouble(n){
    return (n >= 0 && n < 10) ? "0" + n : "" + n;
}

$(document).ready(function(){

    //读信页传来的操作类型
    var op = parent.GC.getUrlParamValue(window.location.href, "op");
	//区别收件人 还是 抄送人
	var ccTo = parent.GC.getUrlParamValue(window.location.href, "ccTo");
    //读到收件人 或者 抄送人 的地址，是一个数组
    var addressMails = parent.gMain.addressMails;
    //得到该数组长度
	if(addressMails){
		var addr_len = addressMails.length;
	}
    
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var createTime = year + "-" + toDouble(month) + "-" + toDouble(day);
    var index = 0;
    var list_date = [];
	var mid = parent.GC.getUrlParamValue(window.location.href,"mid");
    
    //如果批量添加，增加提示的内容
    if (op == "batchContacts") {
        for (var i = 0; i < addr_len; i++) {
            var ad = addressMails[i];
            var name = ad.substring(0, ad.indexOf('<')).trim();
            var email = ad.substring(ad.indexOf('<') + 1, ad.indexOf('>'));
            var per_date = {
                "createTime": createTime,
                "index": "" + index++,
                "name": name,
                "email": email
            }
            list_date.push(per_date);
        }
        
        $("#copy-wrap").before("<span> "+Lang.jjAdd + addr_len + Lang.cfNoSave+"</span>").css("height", "130px").css("marginTop", "10px");
        
    }
    else {
        var curGroup = parent.GMC.getFrameWin("outLink_addr").Addr.curGroup;
        var userId = parent.GMC.getFrameWin("outLink_addr").Addr.getUserId().split(",");
        var type = parent.GMC.getFrameWin("outLink_addr").Addr.getType();
        var selGroupId = parent.GMC.getFrameWin("outLink_addr").Addr.groupId;
        type = parseInt(type);
    }
    
    //目标组		  
    var groupId = [];
    //新组名
    var newGroup = "";
    //“添加分组"			 
    var label = Lang.group_NewAdd;
    var lData = {
        groupFlag: 0
    };
    
    
    //增加一个错误提示
    $("#addNewGroupDiv").append(Addr.getFalseTip("copyTip", Lang.newGroup_fail, "copyTipText"));
    //支持回车新建组
    $("#addNewGroupText").bind("keydown", function(ev){
        if (parent.EV.getCharCode(ev) == 13) {
            $("#addNewGroupSave")[0].click();
        }
    });
    
    
    //得到分组列表
    function callBackList(data){
        $("#checkList").empty();
        
        var liList = [];
        if (op == "batchContacts") {
            liList.push("<div class='pb_5'><span style='color:#bfbfbf; padding-left:4px;'>"+Lang.morenGroup+"</span></div>");
        }
        
        for (var i = 0, len = data["var"].length; i < len; i++) {
            var tId = data["var"][i][0];
            tId = parseInt(tId);
            var tName = data["var"][i][1];
            
            if (tId != selGroupId && tId != 0 && tId != -1) {
                liList.push("<li> <input type='checkbox'  name='checkbox'  id='" + tId + "'><label for='" + tId + "'  class='newName'>" + tName + "</label></li>");
            }
            
        }
        
        $("#checkList")[0].innerHTML = liList.join("");
        /*$("#checkList input").click(function(){				  
        
         $("#newGroupCheck").attr("checked",false);
        
         $('#newGroupInput').css('color','gray').val(label)
        
         });*/
        
    }
	
	
	var getGroupList_Url = "",
		getGroupList_func = "addr:getGroupList";
	
	/*
	 * 得到通讯录联系人分组的兼容处理
	 * [addContactInFrom	  读信页 在收件人添加一个联系人 addContactToCc	   读信页 在发件人 抄送人添加一个联系人
     * editContactInSend            写信完成页 修改联系人       batchContacts                 读信页批量添加]	
	 */
	if(op == "batchContacts" )	{
		getGroupList_Url = parent.gConst.addrApiUrl;
		lData = {};
	}else{
		getGroupList_Url = "/addr/user";
	}
	
    Addr.Ajax(getGroupList_func, lData, callBackList,"",getGroupList_Url);

    
    $('#newGroupInput').css('color', 'gray').val(label).focus(function(){
        if ($(this).val() == label) {
            $(this).val('').css('color', 'black');
            $("#newGroupCheck").attr("checked", true);
            
        }
    }).blur(function(){
        if ($(this).val().trim() == '' && $("#newGroupCheck").attr("checked") == false) {
            $(this).val(label).css('color', 'gray');
        }
    });
    
    $("#newGroupCheck").click(function(){
    
    
        if ($(this).attr("checked") == "checked") {
        
            $("#newGroupInput").val("").focus();
            
        }
        else {
            $('#newGroupInput').css('color', 'gray').val(label)
            
        }
        
    });
    
    
    
    //复制组事件	
    $("#subCopy").click(function(event){
    
        event.stopPropagation();
        
        var bSend = true;
        
        
        groupId = [];
        newGroup = "";
        
        $("input:checkbox[name=checkbox]:checked").each(function(){
            if(type == 0 || type == 1){
				groupId.push(parseInt($(this).attr("id")));
			}else{
				groupId.push($(this).attr("id").toString());
			}
           
            
        })
        
        if ($("#newGroupCheck").attr("checked") == "checked") {
        
        
            if ($("#newGroupInput").val().trim() == "") {
            
                $("#msgSpan").css("display", "inline");
                bSend = false;
            }
            
            
            else {
            
                newGroup = $("#newGroupInput").val();
                if (newGroup.trim() == Lang.ungrouped_contacts || newGroup.trim() == Lang.ungroup) {
                
                    bSend = false;
                    $("#msgSpan").css("display", "inline").html(Lang.exist_ungroup);
                }
                else 
                    if (newGroup.search(/["']/) != -1) {
                        bSend = false;
                        $("#msgSpan").css("display", "inline").html(Lang.quotationMarks);
                        
                    }
                    else 
                        if (newGroup.trim() == Lang.all_contacts) {
                            bSend = false;
                            $("#msgSpan").css("display", "inline").html(Lang.groupName_repeat);
                        }
                        
                        else {
                            bSend = true;
                        }
            }
            
        }
        
        else {
        
            if (groupId.length == 0 && (type == 0 || type == 1)) {
                parent.CC.alert(Lang.index_selectTargetGroup);
                bSend = false;
            }
        }
        
        
        if (bSend && (type == 0 || type == 2)) {
            // 通讯录     [复制联系人 ] 接口 
            function callBack(){
				if(type == 0){
					parent.GMC.getFrameWin("outLink_addr").Addr.count = -1;
	                parent.GMC.getFrameWin("outLink_addr").Addr.pageNo = 0;
	                parent.GMC.getFrameWin("outLink_addr").Addr.op = "copyTo";
	                parent.GMC.getFrameWin("outLink_addr").Addr.curGroup = curGroup;
	                parent.GMC.getFrameWin("outLink_addr").Addr.getUserLinkManGroup("linkmanGroup");
	                parent.GMC.getFrameWin("outLink_addr").Addr.loadList(0);
				}
                
                top.CC.showMsg(Lang.copySuc, true, false, "option");
                parent.CC.closeMsgBox('copyTo');
            }
            newGroup = Addr.emptySpecial(newGroup);
            var data = {
                from: type,
                groupIds: groupId,
                groupName: newGroup.trim(),
                id: userId
            };
            
            Addr.Ajax("addr:copy", data, callBack, function(data){
                if (data.code == "NAME_REPEAT") {
                    $("#msgSpan").css("display", "inline").html(Lang.groupName_repeat);
                    $("#groupNameInput").focus();
                    newGroup = "";
                }
                else {
                    parent.CC.alert(Lang.index_copyContactFailure);
                }
                
            });
            
        }
        else 
            if (bSend && op == "batchContacts") {
                //  [批量添加联系人并复制到组]  的 接口			
                var data = {
                    "groupIds": groupId,
                    "from": "",
                    "list": list_date
                };
                var callBack1 = function(ao){
					var len = 0,
					 	arr = [],
						groupIdLen = groupId.length;
					 	cache = parent.LMD.addContact_Cache;
					
					if(ao && ao["var"]){
						arr = ao["var"];
						len = arr.length;
					}
					
					if(ccTo == "cc"){
						parent.document.getElementById("ifrmReadmail_Content_readMail"+mid).contentWindow
				    	.document.getElementById("addCC").style.display='none';				 
					}else{
						parent.document.getElementById("ifrmReadmail_Content_readMail"+mid).contentWindow
					    .document.getElementById("to_"+mid).style.display='none';
					}
					
					//把新增到通讯录的联系人放到缓存中 [暂时不加，没返回新增联系人的id以及联系人在哪个组]
					//cache("2","-1",addrId, addrFirstName, email);  -1是联系人的组ID
					if(typeof cache == "function" && groupIdLen){
						for(var i=0; i<len; i++){
							for(var j=0; j<groupIdLen; j++){
								parent.LMD.addContact_Cache("2",groupId[j],arr[i][1], arr[i][0], arr[i][2]);
							}
							
						}
					}

                    top.CC.showMsg(Lang.cgSave + addr_len + Lang.geCant,true,false, "option");
					parent.CC.closeMsgBox('copyTo');
					
                };
			
                //可能调用RM接口 或者 addr/user/接口
                Addr.Ajax("addr:save", data, callBack1, function(data){
                    parent.CC.alert(data.summary);
                },parent.gConst.addrApiUrl);
                
            }
    });
    
    //添加新组事件
    jQuery("#addNewGroupSave").click(function(){
        //获取输入的新组名
        var newGroupText = jQuery("#addNewGroupText").val().trim();
        
        $("#copyTip").css("display", "none");
        //如果新组名为空，提示“请输入新组名”
        if (newGroupText == "") {
            $("#copyTip").css("display", "inline");
            $("#copyTipText").html(Lang.inputGroupNameTip);
            //parent.CC.alert(Lang.inputGroupNameTip);//组名为空，提示“请输入组名”
            return;
        }
        //如果新组名为“所有联系人”，提示该组名已存在 
        if (newGroupText == Lang.all_contacts || newGroupText == Lang.ungrouped_contacts || newGroupText == Lang.ungroup) {
            $("#copyTip").css("display", "inline");
            $("#copyTipText").html(Lang.groupName_repeat + "!");
            //parent.CC.alert(Lang.groupName_repeat + "!");
        
        }
        else 
            if (newGroupText.search(/["'“‘\\\/\^\<\>]/) != -1) {
                //提示不能包括引号
                //parent.CC.alert(Lang.quotationMarks);
                $("#copyTip").css("display", "inline");
                $("#copyTipText").html(Lang.quotationMarks);
            }
            else {
                //清空特殊字符
                newGroupText = Addr.emptySpecial(newGroupText);
                //增加新组的提交数据
                data = {
                    op: "add",
                    groupId: 0,
                    groupName: newGroupText
                };
                
                //新建组成功的回调函数
				
                function callBack(data){
                    if (data.code == "S_OK") {
                        //alert(data.var);
                        //复制成功人数，复制重复的人数	
                        // var reapetNum = data["var"].repeat;
                        //var sucNum= data["var"].success;
                        
                        top.CC.showMsg(Lang.NewGropSucTip, true, false, "option");
                        jQuery("#addNewGroupHlink").show();
                        jQuery("#addNewGroupText").val("");
                        jQuery("#addNewGroupDiv").hide();
                        //Addr.Ajax("addr:getGroupList", lData, callBackList);
                        //增加新组成功后把它插入到组列表中，并选中
                        jQuery("#checkList").append("<li> <input type='checkbox'  name='checkbox' checked='checked' id='" + data["var"] + "'><label style='margin-left:4px;' for='" + data["var"] + "'>" + newGroupText + "</label></li>");
                    }
                    
                }
                
				var batchCopy_url = "";
				
				//如果批量添加中新增组，增加提示的内容
			    if (op == "batchContacts") {
					//可能调用RM接口   这个路径是通过 gConst.addrApiUrl(这个常量) 来判断
				    batchCopy_url = parent.gConst.addrApiUrl;
				}else{
					//在通讯录新增组，一定是调用内部的接口
					batchCopy_url = "/addr/user";
				}
                
				//新增组的接口
                Addr.Ajax("addr:addGroup", data, callBack, function(data){
                    if (data.code == "NAME_REPEAT" || data.summary == "record_repeat") {
                        //提示组名重复
                        //parent.CC.alert(Lang.groupName_repeat + "!");
                        $("#copyTip").css("display", "inline");
                        $("#copyTipText").html(Lang.groupName_repeat + "!");
                        jQuery("#addNewGroupText").focus();
                    }
                    else {
                        //新建组失败的提示
                        //parent.CC.alert(Lang.newGroup_fail);
                        $("#copyTip").css("display", "inline");
                        $("#copyTipText").html(Lang.newGroup_fail);
                    }
                },batchCopy_url);
                
                
            }
        
    });
    
});
