function department(){}
function showDept(id,obj)
{
	if(jQuery(obj).attr("class")=="mr_5 i-hminus")
		jQuery(obj).attr("class","mr_5 i-sadd");
	else
		jQuery(obj).attr("class","mr_5 i-hminus");
	if(!document.getElementById("ul"+id))
		return;
	if(document.getElementById("ul"+id).style.display=="none")
    {
        document.getElementById("ul"+id).style.display="";
    }
    else
    {
       document.getElementById("ul"+id).style.display="none";
    }
}
department.prototype = 
{
	
	/**
	 * 得到公共通讯录的部门的组织架构
	 * @param {Object} data
	 */
	 getDepartHTML:function(data)
	{
		var html =[];
		html.push("<ul class=\"pr_15\"><li class=\"pl_15\"><span class=\"departList_span\"> <a href=\"javascript:void(0)\"><i class=\"mr_5 i-hminus\"  onclick=showDept("+data[0].id+",this)></i></a><a style=\"color:#333333\" href='javascript:;' id='allDepList' onclick=\"Addr.searchDepartment('"+data[0].id+"','"+data[0].name+"')\">"+data[0].name+"</a></span>");
		deptList(data[0].id);
		
		$("#totalCount").html("<span style=\"font-weight:bold;font-size:14px;\">"+ data[0].name + "</span> <font>(" + data[0].count + Lang.person + ")</font>");
		function deptList(id)
		{
		    var have=false;
		    for(var i =1;i<data.length;i++)
		    {
		        if(id == data[i].pid)
		        {
		            if(!have)
		            {
		                html.push("<ul class=\"pl_20\" id='ul"+id+"'>");
		                have=true;
		            }
		            html.push("<li><span class=\"departList_span\"><a href=\"javascript:void(0)\"><i class=\"mr_5 i-hminus\" onclick=showDept("+data[i].id+",this)></i></a>");
		            html.push("<a style=\"color:#333333\" href='javascript:;'  onclick=\"Addr.searchDepartment('"+data[i].id+"','"+data[i].name+"')\">"+data[i].name.encodeHTML()+"</a></span>");
		            deptList(data[i].id);
		            html.push("</li>");
		        }
		    }
		    if(have)
		        html.push("</ul>")
		}
		html.push("</li></ul>");
		return html.join("");
	},
	/*
getDepartHTML:function(data)
	{
		var html =[];
		html.push("<ul><li class=\"pl_15\"><a href='javascript:;' id='allDepList' onclick=\"Addr.searchDepartment('"+data[0].id+"','"+data[0].name+"')\"><i class=\"mr_5 i-hminus\"  onclick=showDept("+data[0].id+",this)></i>"+data[0].name+"("+data[0].count+")</a>");
		deptList(data[0].id);
		
		$("#totalCount").html("<strong style='font-size:14px'>"+data[0].name + "</strong><font> (" + data[0].count + Lang.person + ")</font>");
		function deptList(id)
		{
		    var have=false;
		    for(var i =1;i<data.length;i++)
		    {
		        if(id == data[i].pid)
		        {
		            if(!have)
		            {
		                html.push("<ul  id='ul"+id+"'>");
		                have=true;
		            }
		            html.push("<li>");
		            html.push("<a href='javascript:;'  onclick=\"Addr.searchDepartment('"+data[i].id+"','"+data[i].name+"')\"><i class=\"mr_5 i-hminus\" onclick=showDept("+data[i].id+",this)></i>"+data[i].name+"("+data[i].count+")</a>");
		            deptList(data[i].id);
		            html.push("</li>")
		        }
		    }
		    if(have)
		        html.push("</ul>")
		}
		html.push("</li></ul>");
		return html.join("");
	},
*/
	//循环得到指定ID的所有父部门对象
	getParentDeptList:function(data,id)
	{
		var result =[];
		id=parseInt(id);
		getParentDept(id);
		function getParentDept(id){
			for (var i = 0; i < data.length; i++) {
				if (data[i].id == id) {
					result.push(data[i]);
					if(data[i].pid!=-1)
						getParentDept(data[i].pid)
					break;
				}
			}
		}
		return result;
	},
	/**
	 * 得到个人通讯录分组列表
	 * @param {Object} data
	 */
	getUserLinkMan:function(data)
	{
		var html=[];
		html.push("<ul><li id=\""+data[0].groupId +"\" onmouseover=\"Addr.umouseover(this)\" onmouseout=\"Addr.umouseout(this);\"><a href=\"javascript:void(0)\" id=\"allPersonContacts\" onclick=\"Addr.searchGroup(" + data[0].groupId + ",'" + data[0].groupName + "'," + data[0].count + ")\">"+Lang.all_contacts+"</a>");
		//html.push("<ul class=\"pl_31\" id='ul"+data[0].id+"'>");
		var count=data[0].count;
		Addr.allContactsCount=count;
		var allLinkMan=[];
		var Nogroup=[];
		html.push("<li id=\""+data[1].groupId +"\" onmouseover=\"Addr.umouseover(this)\" onmouseout=\"Addr.umouseout(this);\"><a href=\"javascript:void(0);\" onclick=\"Addr.searchGroup(" + data[1].groupId + ",'" + data[1].groupName + "'," + data[1].count + ",this)\" >"+Lang.ungrouped_contacts+"</a></li>");
		for(var i =2;i<data.length;i++)
		{
			if (data[i].groupFlag == 2) {
				html.push("<li id=\""+data[i].groupId +"\" onmouseover=\"Addr.umouseover(this)\"  onmouseout=\"Addr.umouseout(this)\"><span id='span"+data[i].groupId +"' class=\"fr\" style=\"display:none\" >");
				if (top.GC.check("ADDR_UPDATEGROUP"))
				{
					html.push("<a class=\"i-contact-edit\" title='"+Lang.index_editor+"' href=\"javascript:void(0)\" onclick=\"Addr.editGroup(" + data[i].groupId + ",'" + data[i].groupName.encodeHTML() + "')\"></a>");
				}
				 if (top.GC.check("ADDR_DELETEGROUP"))
				{
					html.push("<a  class=\"i-contact-close ml_9\" title='"+Lang.group_del+"' href=\"javascript:void(0)\" onclick=Addr.deleteGroup('" + data[i].groupId + "')></a>");
				}
				html.push("</span><a href=\"javascript:void(0);\" class=\"overflow_ellipsis w100\" onclick=\"Addr.searchGroup(" + data[i].groupId + ",'" + data[i].groupName.encodeHTML() + "'," + data[i].count + ",this)\">" + data[i].groupName+"</a></li>");
			}
			
		}
		
		//html.push("</ul>");
	    
		/*
if( Addr.op!="moveTo" && Addr.op!="copyTo" && Addr.curGroup!=Lang.all_contacts && Addr.op!="updateGroup" && Addr.op!="addGroup" )
		{ 
		  
			$("#showPersonListDetail").html(decodeURI(Lang.all_contacts)+" <font style=\"font-size: 12px;font-weight:lighter;\">("+count+Lang.person+")</font>");
		}
*/
		
		return html.join("");
		
	}
};

var contact=
{
	type:3,//显示类型（email:3;手机号:4）
	isShowValue:true,//是否显示<手机号或者EMail>
	setValue:null,
	isAsyn:true,
	clearonclick:null,
	/**
	 * 显示通讯录列表
	 * @param {Object} showType 显示的通讯录种类array [0,1,2]
	 */
	showLinkMan:function(showType,divContentId,lang)
	{
        if(lang!=null){Lang=lang}
		var s = setInterval(function(){
		if(parent.LMD.loadStatus==1)
		{
			clearInterval(s);
			var groupMap =parent.LMD.groupMap;
			var group_contactListMap = contact.type==3?parent.LMD.group_contactListMap_mail:parent.LMD.group_contactListMap_phone;
			var RecentContactsMap =  parent.LMD.RecentContactsMap;
			var ContactMap =[];
			
			var contactTypeLangList = parent.LMD.addrGroup;
			ContactMap["2"]=contactTypeLangList[2];
			ContactMap["0"]=parent.langconf?parent.langconf.crop_addr || '':contactTypeLangList[0];
			ContactMap["5"]=contactTypeLangList[5];
			ContactMap["3"]=contactTypeLangList[3];
			var html=[];
			html.push("<div class='write_contact'>");
			var selType =[];
			for(var k =0;k<showType.length;k++)
			{
				html.push("<ul >");
		        html.push("<li><a href=\"javascript:void(0)\"  onclick=\"contact.showChildLiknMan('" + (showType[k]=="2"?"-2":"-1") + "',"+showType[k]+")\" class=\"fw_b pl_15 contactType_a\" onmouseover=\"this.className='fw_b pl_15 contactType_a overColor'\" onmouseout=\"this.className='fw_b pl_15 contactType_a'\"><i id='i_"+showType[k]+"_"+(showType[k]=="2"?"-2":"-1")+"' class=\"mr_5 "+(showType[k]=="5"?"i-hminus":"i-sadd")+"\" ></i>"+ContactMap[showType[k]]+"</a>");
				html.push("<ul  id='ul_"+showType[k]+"_"+(showType[k]=="2"?"-2":"-1")+"'"+(showType[k]!="5"?" style='display:none'":"")+">");
					if (showType[k] == "2") {
						html.push("<li id='li_2_-1' ><span class='fw_b pl_27 departList_span' onmouseover=\"this.className='fw_b pl_27 departList_span overColor'\" onmouseout=\"this.className='fw_b pl_27 departList_span'\"><a href=\"javascript:void(0);\" class='departList_a' onclick=\"contact.showChildLiknMan('-1',2,2)\"><i class=\"mr_5 i-sadd\" id='i_2_-1'></i>"+Lang.Mail.ungrouped_contacts+"</a></span></li>");
						if (groupMap["2_0"]) {
							for (var i = 0; i < groupMap["2_0"].length; i++) {
								html.push("<li style='overflow:hidden' id='li_2_" + groupMap["2_0"][i][1] + "' ><span class='fw_b pl_27 departList_span'  onmouseover=\"this.className='fw_b pl_27 departList_span overColor'\" onmouseout=\"this.className='fw_b pl_27 departList_span'\" ondblclick=\"contact.addAllContact('" + groupMap["2_0"][i][1] + "',2)\"  onclick=\"contact.showChildLiknMan('" + groupMap["2_0"][i][1] + "',2,2)\"><a href=\"javascript:;\" class='departList_a'><i class=\"mr_5 i-sadd\" id='i_2_" + groupMap["2_0"][i][1] + "'></i>" + groupMap["2_0"][i][2] + "</a></span></li>");
							}
						}
					}
					else if(showType[k] == "3" && RecentContactsMap["3"])
					{
						for (var i = 0; i < RecentContactsMap["3"].length; i++) {
							//var personCount = emailGroupCount[emailGroupMap[i][1]];
							html.push("<li style='overflow:hidden' onmouseover=\"this.className='overColor'\" onmouseout=\"this.className=''\" ><a href=\"javascript:void(0);\" class='pl_28 contactList_span' title='" + RecentContactsMap["3"][i][2] + "<" + RecentContactsMap["3"][i][3] + ">" + "' onclick=contact.setValue('" + RecentContactsMap["3"][i][2] + "','" + RecentContactsMap["3"][i][3] + "')>" + RecentContactsMap["3"][i][2] + "</a></li>");
							//html.push("<li style='overflow:hidden' id='li_3_" + emailGroupMap[i][1] + "' ><span class='fw_b pl_27' ><a href=\"javascript:void(0);\"><i class=\"mr_5 i-sadd\" onclick=\"contact.showChildLiknMan('" + emailGroupMap[i][1] + "',this,2,2)\"></i>" + emailGroupMap[i][2] + "</a></span></li>");
						}
					}
					else if (showType[k] == "5" && RecentContactsMap["5"]) {
						for (var j = 0; j < RecentContactsMap["5"].length; j++) {
                            /**
                             * modified by chenyuling 最近联系人
                             */
                            if(contact.type==3&&RecentContactsMap["5"][j][3]!=''){ //邮件
							    html.push("<li style='overflow:hidden' onmouseover=\"this.className='overColor'\" onmouseout=\"this.className=''\" ><a href=\"javascript:void(0);\" class='pl_28 contactList_span' title='" + RecentContactsMap["5"][j][2] + "<" + RecentContactsMap["5"][j][3] + ">" + "' onclick=contact.setValue('" + RecentContactsMap["5"][j][2] + "','" + RecentContactsMap["5"][j][3]+ "')>" + RecentContactsMap["5"][j][2] + "</a></li>");
                            }else if(contact.type==4&&RecentContactsMap["5"][j][4]!=''){ //短信
                                html.push("<li style='overflow:hidden' onmouseover=\"this.className='overColor'\" onmouseout=\"this.className=''\" ><a href=\"javascript:void(0);\" class='pl_28 contactList_span' title='" + RecentContactsMap["5"][j][2] + "<" + RecentContactsMap["5"][j][4] + ">" + "' onclick=contact.setValue('" + RecentContactsMap["5"][j][2] + "','" + RecentContactsMap["5"][j][4]+ "')>" + RecentContactsMap["5"][j][2] + "</a></li>");
                            }
                        }
					}
					else {
							var parentId = -1 ;
							if(parent.CC.isRmAddr())
							{
								parentId = 0;
							}
							if ((showType[k] == "0") && groupMap["0_"+parentId]) {
								for (var i = 0; i < groupMap["0_"+parentId].length; i++) {
									if (contact.isAsyn) 
										html.push("<li id='li_0_" + groupMap["0_"+parentId][i][1] + "'><span class='fw_b pl_27 departList_span'  onmouseover=\"this.className='fw_b pl_27 departList_span overColor'\" onmouseout=\"this.className='fw_b pl_27 departList_span'\" onclick=\"contact.showChildLiknMan_Asyn('" + groupMap["0_"+parentId][i][1] + "',0,1)\"><a href=\"javascript:void(0);\" class='departList_a'><i class=\"i-sadd mr_5\" id='i_0_" + groupMap["0_"+parentId][i][1] + "' ></i>" + groupMap["0_"+parentId][i][2] + "</a></span></li>");
									else 
										html.push("<li id='li_0_" + groupMap["0_"+parentId][i][1] + "'><span class='fw_b pl_27 departList_span'  onmouseover=\"this.className='fw_b pl_27 departList_span overColor'\" onmouseout=\"this.className='fw_b pl_27 departList_span'\" ondblclick=\"contact.addAllContact('" + groupMap["0_"+ parentId][i][1] + "',0)\"  onclick=\"contact.showChildLiknMan('" + groupMap["0_"+parentId][i][1] + "',0,1)\" class='departList_a'><a href=\"javascript:void(0);\"><i class=\"i-sadd mr_5\" id='i_0_" + groupMap["0_"+parentId][i][1] + "' ></i>" + groupMap["0_"+parentId][i][2] + "</a></span></li>");
								}
							}
							if((showType[k] == "0") && group_contactListMap["0_"+parentId])
							{
								for (var i = 0; i < group_contactListMap["0_" + parentId].length; i++) {
									html.push("<li style='overflow:hidden' onmouseover=\"this.className='overColor'\" onmouseout=\"this.className=''\" ><a href=\"javascript:void(0);\" class='pl_28 contactList_span' title='" + group_contactListMap["0_" + parentId][i][2] + "<" + group_contactListMap["0_" + parentId][i][3] + ">" + "' onclick=contact.setValue('" + group_contactListMap["0_" + parentId][i][2] + "','" + group_contactListMap["0_" + parentId][i][3] + "')>" +group_contactListMap["0_" + parentId][i][2] + "</a></li>");
								}
							}
						}
				html.push("</ul></li></ul>");
			}
			html.push("</div>");
			jQuery("#"+divContentId).html(html.join(""));
			
		}},300);
	},
	/**
	 * 显示子目录
	 * @param {Object} id
	 * @param {Object} obj
	 */
	showChildLiknMan:function(id,type,index)
	{
		clearTimeout(contact.clearonclick); 
		
		//防止用户连续点击，造成多次ajax请求，这里执行用户最后一次点击事件，延时100毫秒用户体验更好
		this.clearonclick = setTimeout(function(){
		//隐藏  i-hminus 箭头向下
		if (jQuery("#i_"+type+"_"+id).attr("class") == "mr_5 i-hminus") {
			//改变箭头向左
			jQuery("#i_"+type+"_"+id).attr("class", "mr_5 i-sadd");
			if (jQuery("#ul_"+type+"_" + id).length > 0) {
				jQuery("#ul_"+type+"_" + id).attr("style","display:none");
				return;
			}
		}
		else {//展开 
		    //如果ul里面有东西，说明不用去创造了，直接拿出来看看
			jQuery("#i_"+type+"_"+id).attr("class", "mr_5 i-hminus");
			if (jQuery("#ul_"+type+"_" + id).length > 0) {
				jQuery("#ul_"+type+"_" + id).attr("style","display:''");
				return;
			}
		}
		
		//开始创造
		var groupMap = parent.LMD.groupMap;
		var group_contactList =  contact.type==3?parent.LMD.group_contactListMap_mail:parent.LMD.group_contactListMap_phone;
		var html=[];
		//html.push("<ul class=\"pl_27\" id='ul_"+type+"_"+id+"'>");
		//有层次感
		var a_style ="padding-left:"+(27+(index*16))+"px";
		
		//groupMap[type+"_"+id] 一个部门的数据的容器
		if (groupMap[type+"_"+id] && type=="0") {//得到该节点下的子部门
			//循环每一个部门
			for (var i = 0; i < groupMap[type+"_"+id].length; i++) {
				//groupMap[type+"_"+id][i][1] 就是这个部门的ID  [0(type),3(id),"邮件系统开发部",-1(pId)]
				html.push("<li id='li_"+type+"_"+groupMap[type+"_"+id][i][1]);
				html.push("' style='overflow:hidden' >");
				html.push("<span style='"+a_style+";display:block;' class='fw_b departList_span' ");
				html.push("onmouseover=\"this.className='fw_b departList_span overColor'\" ");
				html.push("onmouseout=\"this.className='fw_b departList_span'\" ");
				html.push("ondblclick=\"contact.addAllContact('");
				html.push(groupMap[type+"_"+id][i][1] + "'," + type + ")\" ");
				html.push("onclick=\"contact.showChildLiknMan('");
				html.push(groupMap[type+"_"+id][i][1]+"',"+type+","+(index+1)+")\">");
				html.push("<a href='javascript:;' class='departList_a'>");
				html.push("<i class=\"mr_5 i-sadd\"  id='i_"+type+"_"+groupMap[type+"_"+id][i][1]+"' ></i>");
				html.push(groupMap[type+"_"+id][i][2]  +"</a></span></li>");
			}
		}
		//得到该节点下的人；
		if (group_contactList[type+"_"+id]) {
			for (var z = 0; z < group_contactList[type+"_"+id].length; z++) {
				if (group_contactList[type+"_"+id][z][contact.type] != "" && group_contactList[type+"_"+id][z][0] ==type) {
						var title1=group_contactList[type+"_"+id][z][2] +"&lt;" + group_contactList[type+"_"+id][z][contact.type] + "&gt;";
						html.push("<li style='overflow:hidden'><span class='contactList_span' onmouseover=\"this.className='overColor contactList_span'\" onmouseout=\"this.className='contactList_span'\" style='display:block;"+a_style+"'><a  href='javascript:;' title='"+title1+"' onclick=contact.setValue('" + group_contactList[type+"_"+id][z][2].encodeHTML() + "','" +  group_contactList[type+"_"+id][z][contact.type] + "','"+group_contactList[type+"_"+id][z][1]+"')>" +(contact.isShowValue==true?title1:group_contactList[type+"_"+id][z][2])  + "</a></span></li>");
				}
			}
		}
		//html.push("</ul>");
		var deptListHtml="";
		if(html.join("")!="")
		{
			deptListHtml = "<ul id='ul_"+type+"_"+id+"'>"+html.join("")+"</ul>";
		}
		jQuery("#li_"+type+"_"+id).append(deptListHtml);
		},300);
		
	},

	    /**
     * 得到指定部门的下的所有人（直接从服务器请求）
     * @param {Object} id
     * @param {Object} type
     * @param {Object} index
     */
    showChildLiknMan_Asyn: function(id, type, index){
		
		 if (jQuery("#i_" + type + "_" + id).attr("class") == "mr_5 i-hminus") {
            jQuery("#i_" + type + "_" + id).attr("class", "mr_5 i-sadd");
            if (jQuery("#ul_" + type + "_" + id).length > 0) {
                jQuery("#ul_" + type + "_" + id).attr("style", "display:none");
                return;
            }
        }
        else {//展开
            jQuery("#i_" + type + "_" + id).attr("class", "mr_5 i-hminus");
            if (jQuery("#ul_" + type + "_" + id).length > 0) {
                jQuery("#ul_" + type + "_" + id).attr("style", "display:''");
                return;
            }
        }
        var data = {
            depId: id,
			type:"2",
            paging: 1,
			pageNo:0,
			pageSize:20,
			count:-1,
			letter:"",
			key:"",
			groupId:0
        }
		var groupMap =parent.LMD.groupMap;
        var group_contactList = contact.type == 3 ? parent.LMD.group_contactListMap_mail : parent.LMD.group_contactListMap_phone;
        var html = [];
		var p = this;
        var a_style ="padding-left:"+(27+(index*16))+"px";
/*
        if (groupMap[type+"_"+id] && type == "0") {//得到该节点下的子部门
            for (var i = 0; i < groupMap[type+"_"+id].length; i++) {
               if(contact.isAsyn)
                	html.push("<li id='li_" + type + "_" + groupMap[type+"_"+id][i][1] + "' ><span style='" + a_style + "' class='fw_b departList_span'  onmouseover=\"this.className='fw_b departList_span overColor'\" onmouseout=\"this.className='fw_b departList_span'\" onclick=\"contact.showChildLiknMan_Asyn('" + groupMap[type+"_"+id][i][1] + "'," + type + "," + (index + 1) + ")\"><a href='javascript:;' class='contactList departList_a'><i class=\"mr_5 i-sadd\"  id='i_" + type + "_" + groupMap[type+"_"+id][i][1] + "' ></i>" + groupMap[type+"_"+id][i][2] + "</a></span></li>");
				else
					html.push("<li id='li_" + type + "_" + groupMap[type+"_"+id][i][1] + "' ><span style='" + a_style + "' class='fw_b departList_span'  onmouseover=\"this.className='fw_b departList_span overColor'\" onmouseout=\"this.className='fw_b departList_span'\" onclick=\"contact.showChildLiknMan('" + groupMap[type+"_"+id][i][1] + "'," + type + "," + (index + 1) + ")\"><a href='javascript:;' class='departList_a'><i class=\"mr_5 i-sadd\"  id='i_" + type + "_" + groupMap[type+"_"+id][i][1] + "' ></i>" + groupMap[type+"_"+id][i][2] + "</a></span></li>");
            }
        }
*/
		function callBack1(data)
		{
			if (data.code == "S_OK") {
				if (jQuery("#ul_" + type + "_" + id).length > 0)
					return;
				if(data["var"]=="" || data["var"]==null)
					return;
				if (parent.window.IsOA == 1) {
					var userDeptList = data["var"][0];
					var userList = data["var"][1];
					for (var i = 0; i < userList.length; i++) {
                        if(contact.type==3){
                            var title = userList[i][1] + "&lt;" + userList[i][3] + "&gt;";
                            if (userList[i][3] == "") {
                                title == userList[i][1] + "&lt;无数据&gt;";
                                html.push("<li ><span class='contactList_span' onmouseover=\"this.className='overColor contactList_span'\" onmouseout=\"this.className='contactList_span'\" style='display:block;white-space:nowrap;" + a_style + "'><span style='width:19px;display:inline-block;white-space:nowrap;height:10px;'>&nbsp;</span><a href='javascript:;' title='" + title + "' >" + (contact.isShowValue == true ? title : userList[i][1]) + "</a></span></li>");
                            }
                            else{
                                html.push("<li ><span class='contactList_span' onmouseover=\"this.className='overColor contactList_span'\" onmouseout=\"this.className='contactList_span'\" style='display:block;white-space:nowrap;" + a_style + "'><span style='width:19px;display:inline-block;white-space:nowrap;height:10px;'>&nbsp;</span><a href='javascript:;' title='" + title + "' onclick=contact.setValue('" + userList[i][1] + "','" + userList[i][4] + "')>" + (contact.isShowValue == true ? title : userList[i][1]) + "</a></span></li>");
                            }
                        }else{
                            var title = userList[i][1] + "&lt;" + userList[i][4] + "&gt;";
                            if (userList[i][4] != "") {
                                html.push("<li ><span class='contactList_span' onmouseover=\"this.className='overColor contactList_span'\" onmouseout=\"this.className='contactList_span'\" style='display:block;white-space:nowrap;" + a_style + "'><span style='width:19px;display:inline-block;white-space:nowrap;height:10px;'>&nbsp;</span><a href='javascript:;' title='" + title + "' onclick=contact.setValue('" + userList[i][1] + "','" + userList[i][4] + "')>" + (contact.isShowValue == true ? title : userList[i][1]) + "</a></span></li>");
                            }
                        }
					}
					for (var i = 0; i < userDeptList.length; i++) {
						html.push("<li id='li_" + type + "_" + userDeptList[i][1] + "' ><span style='" + a_style + "' class='fw_b departList_span'  onmouseover=\"this.className='fw_b departList_span overColor'\" onmouseout=\"this.className='fw_b departList_span'\" onclick=\"contact.showChildLiknMan_Asyn('" + userDeptList[i][1] + "'," + type + "," + (index + 1) + ")\"><a href='javascript:;' class='contactList departList_a' title='" + userDeptList[i][2] + "'><i class=\"mr_5 i-sadd\"  id='i_" + type + "_" + userDeptList[i][1] + "' ></i>" + userDeptList[i][2] + "</a></span></li>");
					}
				}
				else
				{
					userList = data["var"].list;
						for (var i = 0; i < userList.length; i++) {
                            /**
                             * modified by chenyuling
                             */
							var title = userList[i].userName+ "&lt;" +(contact.type==3?userList[i].email:userList[i].mobile) + "&gt;";
                            var emptytitle = userList[i].userName + "&lt;无数据&gt;";
                            if(contact.type==3){
                                if (userList[i].email == "") {
                                    html.push("<li style='overflow:hidden'><span class='contactList_span' onmouseover=\"this.className='overColor contactList_span'\" onmouseout=\"this.className='contactList_span'\"  style='display:block;" + a_style + "' title='" + emptytitle + "' ><a href='javascript:;' >" + (p.isShowValue == true ? emptytitle : userList[i].userName) + "</a></span></li>");
                                }else {
                                    html.push("<li style='overflow:hidden'><span class='contactList_span' onmouseover=\"this.className='overColor contactList_span'\" onmouseout=\"this.className='contactList_span'\"  style='display:block;" + a_style + "' title='" + title + "' onclick=\"contact.setValue('" + userList[i].userName.encodeHTML() + "','" + userList[i].email + "')\"><a href='javascript:;' >" + (p.isShowValue == true ? title : userList[i].userName) + "</a></span></li>");
                                }
                            }else{
                                if (userList[i].mobile != "") {
                                    html.push("<li style='overflow:hidden'><span class='contactList_span' onmouseover=\"this.className='overColor contactList_span'\" onmouseout=\"this.className='contactList_span'\"  style='display:block;" + a_style + "' title='" + title + "' onclick=\"contact.setValue('" + userList[i].userName + "','" + userList[i].mobile + "')\"><a href='javascript:;' >" + (p.isShowValue == true ? title : userList[i].userName) + "</a></span></li>");
                                }
                            }
						}
						if (groupMap[type+"_"+id] && type == "0") {//得到该节点下的子部门
			            for (var i = 0; i < groupMap[type+"_"+id].length; i++) {
			               if(contact.isAsyn)
			                	html.push("<li id='li_" + type + "_" + groupMap[type+"_"+id][i][1] + "' ><span style='" + a_style + "' class='fw_b departList_span'  onmouseover=\"this.className='fw_b departList_span overColor'\" onmouseout=\"this.className='fw_b departList_span'\" onclick=\"contact.showChildLiknMan_Asyn('" + groupMap[type+"_"+id][i][1] + "'," + type + "," + (index + 1) + ")\"><a href='javascript:;' class='contactList departList_a'><i class=\"mr_5 i-sadd\"  id='i_" + type + "_" + groupMap[type+"_"+id][i][1] + "' ></i>" + groupMap[type+"_"+id][i][2] + "</a></span></li>");
							else
								html.push("<li id='li_" + type + "_" + groupMap[type+"_"+id][i][1] + "' ><span style='" + a_style + "' class='fw_b departList_span'  onmouseover=\"this.className='fw_b departList_span overColor'\" onmouseout=\"this.className='fw_b departList_span'\" onclick=\"contact.showChildLiknMan('" + groupMap[type+"_"+id][i][1] + "'," + type + "," + (index + 1) + ")\"><a href='javascript:;' class='departList_a'><i class=\"mr_5 i-sadd\"  id='i_" + type + "_" + groupMap[type+"_"+id][i][1] + "' ></i>" + groupMap[type+"_"+id][i][2] + "</a></span></li>");
			            }
			        }
				}
				var deptListHtml = "";
				if (html.join("") != "") {
					deptListHtml = "<ul id='ul_" + type + "_" + id + "'>" + html.join("") + "</ul>";
				}
				jQuery("#li_" + type + "_" + id).append(deptListHtml);
			}
		}
		var func="addr:ListSmapUser";
		if (top.CC.isRmAddr()) 
			func = "addr:ListUser";
		else 
			if (top.window.IsOA == 1) {
				func = "addr:ListSmapUser";
			}
			else
			{
				func = "addr:ListUser";
			}
        contact.Ajax(top.gConst.addrApiUrl, func, data, callBack1)
    },
    seachDeptUser_asyn: function(key){
    	  var data = {
            key: key,
			depId: 0,
			type:"2",
            paging: 1,
			pageNo:0,
			pageSize:20,
			count:-1,
			letter:"",
			groupId:0
        }
        var t1 =parent.AutoFill.datas["email"];
        contact.Ajax("/addr/user", "addr:listUser", data, function(data1){
            var userList = data1["var"].list;
				for (var i = 0; i < userList.length; i++) {
					t1.push({
						id: userList[i].id,
						name: userList[i].userName,
						value: userList[i].email,
						word: userList[i].fullNameFullWord,
						fullword: userList[i].fullNameWord
					});
				}
				 parent.AutoFill.datas["email"] = t1;
				 var ss = contact.loadseachList();
				 ss.showList(ss);
				 //AutoFill.showList();
        })
    },
    
 Ajax: function(url, func, data, callback){
        parent.MM.doService({
            url: url,
            func: func,
            data: data,
            failCall: function(d){
                parent.CC.alert(d.summary);
            },
            call: function(d){
                callback(d);
            },
            param: ""
        });
    },
addAllContact : function(id, type)
	 {
	 	clearTimeout(contact.clearonclick); 
        function add(data){
			if (data) {
				for (var i = 0; i < data.length; i++) {
					//contact.addContact(data[i][2], data[i][p.type], data[i][1]);
					contact.setValue(data[i][2],data[i][contact.type],data[i][1]);
				}
			}
        }
        var group_contactListMap = parent.LMD.group_contactListMap_mail;
        if (type == "2" || type == "0") {
            add(group_contactListMap[type+"_"+id]);
        }
        else {
            //var groupMap = parent.LMD.groupMap;
            //addDeptPerson(id);
            
        }
        function addDeptPerson(id){
            if (groupMap[id]) {
                var data = groupMap[id];
                for (var i = 0; i < data.length; i++) {
                    addDeptPerson(data[i][1]);
                }
            }
            if (group_contactListMap[id]) {
                add(group_contactListMap[id]);
            }
        }
        
        
    } 

	
}
