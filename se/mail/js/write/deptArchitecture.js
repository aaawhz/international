

var contact=
{
	type:3,//显示类型（email:3;手机号:4）
	isShowValue:true,//是否显示<手机号或者EMail>
	setValue:null,
	isAsyn:true,
	size:100,
	clearonclick:null,
	addAsGroup: true,
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
			html.push("<div class='deptList_div'>");
			var deptLi = "<li id='li_{3}_{0}'><span class='fw_b pl_27 departList_span'   onclick=\"contact.{1}('{0}',{3},1)\">"
						+'<div class="p_relative"><a href="###" class="departList_a"  title ="{2}" style="width:135px"><i class="i-sadd mr_5" id="i_{3}_{0}"></i>{2}</a>'
						+"{4}</div>"
						+"</span></li>";
			var addAllContactHtml_temp ="<i  class='addgroup' title='添加全部' deptId='{0}' type='{1}'     style='position: absolute; right: 2px; top: 1px; display: none;'></i>";
            for (var k = 0; k < showType.length; k++) {
                html.push("<ul >");
                html.push("<li><a href=\"javascript:void(0)\" style='width:188px' onclick=\"contact."+(showType[k]=="0"?"showChildLinkMan_Asyn":"showChildLinkMan")+"('" + (showType[k]=="2"?"-2":"0") + "',"+showType[k]+")\" class=\"fw_b pl_15 contactType_a\" onmouseover=\"this.className='fw_b pl_15 contactType_a overColor'\" onmouseout=\"this.className='fw_b pl_15 contactType_a'\"><i id='i_"+showType[k]+"_"+(showType[k]=="2"?"-2":"0")+"' class=\"mr_5 "+(showType[k]=="5"?"i-hminus":"i-sadd")+"\"  ></i>"+ContactMap[showType[k]]+"</a>");
				html.push("<ul  id='ul_"+showType[k]+"_"+(showType[k]=="2"?"-2":"0")+"'"+(showType[k]!="5"?" style='display:none'":"")+">");
                 var addAllContactHtml ="";
                if (showType[k] == "2") {
					if(group_contactListMap["2_-1"] && group_contactListMap["2_-1"].length>0){
							if(contact.addAsGroup){
								addAllContactHtml = addAllContactHtml_temp.format(-1,2);
							}
							else{
								addAllContactHtml="";
							}
					}else{addAllContactHtml="";}
					html.push(deptLi.format("-1","showChildLinkMan",Lang.Mail.noGroupPerson,2,addAllContactHtml));
					if (groupMap["2_0"]) {
						for (var i = 0; i < groupMap["2_0"].length; i++) {
							var cId=groupMap["2_0"][i][1];
							if(group_contactListMap["2_" + cId] && group_contactListMap["2_" + cId].length>0){
								if(contact.addAsGroup){
									addAllContactHtml = addAllContactHtml_temp.format(cId,2);
								}
								else{
									addAllContactHtml="";
								}
							}else{addAllContactHtml="";}
							html.push(deptLi.format(cId,"showChildLinkMan",groupMap["2_0"][i][2],2,addAllContactHtml));
						}
					}
				}
				else 
					if (showType[k] == "3" && RecentContactsMap["3"]) {
						for (var i = 0; i < RecentContactsMap["3"].length; i++) {
							html.push("<li style='overflow:hidden' onmouseover=\"this.className='overColor'\" onmouseout=\"this.className=''\" ><a href=\"javascript:void(0);\" class='pl_28 contactList_span' title='" + RecentContactsMap["3"][i][2] + "<" + RecentContactsMap["3"][i][3] + ">" + "' onclick=contact.setValue('" + RecentContactsMap["3"][i][2] + "','" + RecentContactsMap["3"][i][3] + "')>" + RecentContactsMap["3"][i][2] + "</a></li>");
						}
					}
					else 
						if (showType[k] == "5" && RecentContactsMap["5"]) {
									for (var j = 0; j < RecentContactsMap["5"].length; j++) {
										/**
	 * modified by chenyuling 最近联系人
	 */
										if (contact.type == 3 && RecentContactsMap["5"][j][3] != '') { //邮件
											html.push("<li style='overflow:hidden' onmouseover=\"this.className='overColor'\" onmouseout=\"this.className=''\" ><a href=\"javascript:void(0);\" class='pl_28 contactList_span' title='" + RecentContactsMap["5"][j][2] + "<" + RecentContactsMap["5"][j][3] + ">" + "' onclick=contact.setValue('" + RecentContactsMap["5"][j][2] + "','" + RecentContactsMap["5"][j][3] + "')>" + RecentContactsMap["5"][j][2] + "</a></li>");
										}
										
									}
						}
						else {
							contact.showChildLinkMan_Asyn(0, 0, 0,true);
						}
                html.push("</ul></li></ul>");
            }
			html.push("</div>");
            jQuery("#" + divContentId).html(html.join(""));
            contact.bindEvent();
			contact.bindAddGroup();
		}},300);
	},
	/**
	 * 显示子目录
	 * @param {Object} id
	 * @param {Object} obj
	 */
	showChildLinkMan:function(id,type,index)
	{
		clearTimeout(this.clearonclick); 
		var p = this;
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
		var a_width="width:"+170-(35+(index*16))+"px";
		var deptLi = "<li id='li_"+type+"_{0}' style='overflow:hidden' >"
				+"<span style='" + a_style + ";display:block;'  class='fw_b departList_span'  onclick=\"contact.showChildLinkMan('{0}'," + type + ",{1})\" >"
				+'<div class="p_relative" ><a href="###" title="{2}" class="departList_a" style="'+a_width+'" ><i class="i-sadd mr_5" id="i_' + type + '_{0}"></i>{2}</a>'
				+"{3}</div>"
				+'</span></li>';
				
		//groupMap[type+"_"+id] 一个部门的数据的容器
		if (groupMap[type+"_"+id] && type=="0") {//得到该节点下的子部门
			//循环每一个部门
			for (var i = 0; i < groupMap[type+"_"+id].length; i++) {
				var cId = groupMap[type+"_"+id][i][1];
				var addAllContactHtml="";
				if(group_contactList[type + "_" + cId] && group_contactList[type + "_" + cId].length>0)
				{
					addAllContactHtml ="<i  class='addgroup' title='添加全部' deptId='"+cId+"' type='"+type+"'     style='position:absolute;right:2px;top:1px;display:none'></i>";
				}
	            html.push(deptLi.format(cId,(index + 1),groupMap[type+"_"+id][i][2],addAllContactHtml));
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
    showChildLinkMan_Asyn: function(id, type, index,isFirstLoad){
		clearTimeout(this.clearonclick); 
		var p = this;
		var deptList_temp=["<li id='li_{1}_{0}' style='overflow:hidden' >"
				,"<span style='{2};display:block;'  class='fw_b departList_span'  onclick=\"{6}('{0}',{1},{3})\" >"
				,'<div class="p_relative"><a href="###" class="departList_a" title="{4}" ><i class="i-sadd mr_5" id="i_{1}_{0}"></i>{4}</a>'
				,"{5}</div>"
				,'</span></li>'].join("")
		this.clearonclick = setTimeout(function(){	
			var selId=type+"_"+id;
			
			if (!isFirstLoad) {//初始化的时候问题.
				//当前节点是隐藏
				if (jQuery("#i_" + selId).hasClass("i-sadd")) {
					jQuery("#i_" + selId).removeClass("i-sadd").addClass("i-hminus");
					if (jQuery("#ul_" + selId).length > 0) {
						jQuery("#ul_" + selId).show();
						return;
					}
				}
				else {
					jQuery("#i_" + selId).removeClass("i-hminus").addClass("i-sadd");
					if (jQuery("#ul_" + selId).length > 0) {
						jQuery("#ul_" + selId).hide();
						return;
					}
				}
			}
			var data ={};
			
	        var html = [];
			var groupMap = parent.LMD.groupMap;;
	        var a_style ="padding-left:"+(27+(index*16))+"px";
			var addAllContactHtml ="<i  class='addgroup' title='添加整组' deptId='{0}' type='0'  style='position: absolute; right: 2px; top: 1px; display:none'></i>";
			
			var orgList = groupMap[type+"_"+id] || [];
			//得到该节点下的子部门
	        for (var i = 0; i < orgList.length; i++) {
				var cId = orgList[i][1];
	           html.push(deptList_temp.format(
					cId,//id
					"0",//类型,是个人通讯录还是组织通讯录
					a_style,//向前预留多少像素,用于做层级关系
					(index + 1),//第几级
					orgList[i][2],//部门名称
					addAllContactHtml.format(cId),//添加全部按钮
					"contact.showChildLinkMan_Asyn"
				));
	        }
			var containerId = "#ul_0_" + id 
			if(jQuery(containerId).length>0){
				jQuery(containerId).append(html.join(""));
			}else{
				jQuery("#li_" + selId).append("<ul id='ul_0_" + id + "'>" + html.join("") + "</ul>");
			}		
			p.go(null,id,0,a_style);

		},300);
    },
   
 go : function(obj,id,index,a_style)
{
	var p = this;
		var data ={
			"total":contact.size,
			"recursive_flag":0,
			"search_flag":1
		};
		if(a_style){
			data.start = (index)*contact.size+1;
			data.deptId = id;
		}else{
			index = parseInt(jQuery(obj.target).attr("index"));
			id = jQuery(obj.target).attr("id")
			
			data.start = index*contact.size+1;
			data.deptId = id;
			a_style = jQuery(obj.target).attr("a_style");
		}
		index>0?jQuery(obj.target).parents("li:eq(0)").remove():"";
		var html = [];
		function callBack1(data)
		{
			var selId="0_"+id;
			if (data.code == "S_OK") {
					var userList = data["var"] || [];
					var user_temp = "<li style='overflow:hidden'><span class='contactList_span' onmouseover=\"this.className='overColor contactList_span'\" onmouseout=\"this.className='contactList_span'\"  style='display:block;{0}' title='{1}' onclick=contact.setValue('{2}','{1}','{3}')><a href='javascript:;' >{2}</a></span></li>";
					for (var i = 0; i < userList.length; i++) {
							html.push(user_temp.format(
							a_style,
							userList[i].email,
							userList[i].firstName.encodeHTML(),
							userList[i].id
							));
					}
					var containerId = "#ul_0_" + id 
					var nextHtml ="<li class='ta_c' style='overflow:hidden; padding-bottom:5px;'><a href='javascript:;' style='padding-right:0; color:#003be2;' id='"+id+"' index='"+(index+1)+"' a_style='"+a_style+"' class='nextPage' >点击加载更多>>  </a></li>";
					if(jQuery(containerId).length>0){
						jQuery(containerId).append(html.join("")+(userList.length==contact.size?nextHtml:""));
					}else{
						jQuery("#li_" + selId).append("<ul id='ul_0_" + id + "'>" + html.join("") + "</ul>"+(userList.length==contact.size?nextHtml:""));
					}					
			}
		}
		parent.MM.mailRequest( {
            func: "addr:searchUsers",
            data:data,
            call:callBack1
        })
},
 
bindEvent :function(){
	var p = this;
	function _bindOverDeptSpan(){
		jQuery(this).addClass("overColor");
		jQuery(this).find(".addgroup").show();
	}
	jQuery(".departList_span").live("mouseover",_bindOverDeptSpan);
	jQuery(".departList_span").live("mouseout",_bindOutDeptSpan);
	function _bindOutDeptSpan(){
		jQuery(this).removeClass("overColor");
		jQuery(this).find(".addgroup").hide();
	}
	jQuery(".deptList_div").find(".nextPage").live("click",this.go);

	
},
bindAddGroup:function(){
	var p = this;
	jQuery(".write_contact").click(function(e){
		var target = e.target;
		if (target.nodeName == "I" && jQuery(target).attr("class") == "addgroup") {
			p.addAllContact(target.getAttribute("deptId"), target.getAttribute("type"));
		}
		//e.preventDefault();
		//e.stopPropagation();
		//window.event.cancelBubble = true;
		//return false;
	});
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
        if (type == "2") {
            add(group_contactListMap[type+"_"+id]);
        }else if(type == "0") {
			var deptInfo = parent.LMD.deptObj[id];
			if(deptInfo){
				contact.setValue(deptInfo[2],deptInfo[4],deptInfo[1])
			}
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
