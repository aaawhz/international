/**
 *
 * @param c
 * @param config.maxCount 最多选多少人
 * config.showList  只显示这个列表里面的人
 * @constructor
 */
function Contact(c,config)
{
	this.contact=c;
	this.addAsGroup = false;
	this.config=config||{}
}
Contact.prototype.type=3;//显示类型（email:3;手机号:4）
Contact.prototype.isFilter=true;//是否过滤选择值为空
Contact.prototype.isShowValue=false;//是否显示<手机号或者EMail>
Contact.prototype.getSelectValue =null;
Contact.prototype.isAsyn=true;//是否支持组织通讯录异步加载；
Contact.prototype.isShowTitle =true; //是否显示title
Contact.prototype.titleValue=3;//title显示的值的索引；
Contact.prototype.groupMap = null;//所有的组织架构的对象；
Contact.prototype.group_contactListMap =null; //存储所有对应关系人的数据；
Contact.prototype.RecentContactsMap = null;//最近联系人，邮件组；
Contact.prototype.filterList = null;//需要过滤的人；
Contact.prototype.filterList_hash =[];
Contact.prototype.size=100;
Contact.prototype.clearonclick=null;
Contact.prototype.ogrList = [];//存储组织通讯录下的联系人
Contact.prototype.deptList_temp=["<li id='li_{1}_{0}' style='overflow:hidden' >"
	,"<span style='{2};display:block;'  class='fw_b departList_span'  onclick=\"{6}('{0}',{1},{3})\" >"
	,'<div ><a href="###" style="width:{7}px;" class="departList_a" title="{4}" ><i class="i-sadd mr_5" id="i_{1}_{0}"></i>{4}</a>'
	,"{5}</div>"
	,'</span></li>'].join("");
Contact.prototype.showLinkMan = function(showType, divContentId)
{
	var p = this;
	var s = setInterval(function(){
		if (parent.LMD.loadStatus == 1) {
			clearInterval(s);
			var groupMap = LMD.groupMap;//p.groupMap;
			p.titleValue = p.type;
			var group_contactListMap =LMD.group_contactListMap_mail; //p.group_contactListMap;
			this.group_contactListMap = group_contactListMap;
			this.groupMap = groupMap;
			var RecentContactsMap = p.RecentContactsMap;
			var ContactMap = [];
			var contactTypeLangList = LMD.addrGroup;
			ContactMap["2"] = contactTypeLangList[2];
			ContactMap["0"]=parent.langconf?parent.langconf.crop_addr || '':contactTypeLangList[0];
			ContactMap["5"] = contactTypeLangList[5];
			var html = [];
			var selType = [];
			html.push("<div class='deptList_div'>");
			var deptLi = "<li id='li_{3}_{0}'><span class='fw_b pl_27 departList_span'   onclick=\"" + p.contact + ".{1}('{0}',{3},1)\">"
				+'<div><a href="###" class="departList_a" title="{2}"><i class="i-sadd mr_5" id="i_{3}_{0}"></i>{2}</a>'
				+"{4}</div>"
				+"</span></li>";
			var addAllContactHtml_temp ="<i  class='addgroup' title='添加全部' deptId='{0}' type='{1}'     style='margin-right: 5px;float: right;margin-top: -18px;display:none'></i>";
			for (var k = 0; k < showType.length; k++) {
				html.push("<ul >");
				html.push("<li><a href=\"javascript:void(0)\"  onclick=\""+p.contact+"."+(showType[k]=="0"?"showChildLinkMan_Asyn":"showChildLinkMan")+"('" + (showType[k]=="2"?"-2":"0") + "',"+showType[k]+")\" class=\"fw_b pl_15 contactType_a\" onmouseover=\"this.className='fw_b pl_15 contactType_a overColor'\" onmouseout=\"this.className='fw_b pl_15 contactType_a'\"><i id='i_"+showType[k]+"_"+(showType[k]=="2"?"-2":"0")+"' class=\"i-hminus\" ></i>"+ContactMap[showType[k]]+"</a>");
				html.push("<ul  id='ul_"+showType[k]+"_"+(showType[k]=="2"?"-2":"0")+"'>");
				var addAllContactHtml ="";
				if (showType[k] == "2") {
					if(group_contactListMap["2_-1"] && group_contactListMap["2_-1"].length>0){
						if(p.addAsGroup){
							addAllContactHtml = addAllContactHtml_temp.format(-1,2);
						}
						else{
							addAllContactHtml = "";
						}
					}else{addAllContactHtml="";}
					html.push(deptLi.format("-1","showChildLinkMan",Lang.Mail.noGroupPerson,2,addAllContactHtml));
					if (groupMap["2_0"]) {
						for (var i = 0; i < groupMap["2_0"].length; i++) {
							var cId=groupMap["2_0"][i][1];
							if(group_contactListMap["2_" + cId] && group_contactListMap["2_" + cId].length>0){
								if(p.addAsGroup){
									addAllContactHtml = addAllContactHtml_temp.format(cId,2);
								}
								else{
									addAllContactHtml = "";
								}
							}else{addAllContactHtml="";}
							html.push(deptLi.format(cId,"showChildLinkMan",groupMap["2_0"][i][2],2,addAllContactHtml));
						}
					}
				}
				else{
					var parentId = 0 ;
					p.showChildLinkMan_Asyn(0, 0, 0,true);
				}
				html.push("</ul></li></ul>");
			}
			html.push("</div>");
			jQuery("#" + divContentId).html(html.join(""));
			p.bindEvent();
			p.bindAddGroup();
		}
	}, 300);
}
/**
 * 通讯录的公共组件入口
 * @param id
 * @param showType
 * @param callback
 * @param cancelBack
 */
Contact.prototype.inItContanct = function(id, showType, callback, cancelBack){
	var p =this;
	p.createBody(showType,function(){
		parent.CC.showDiv(p.getHTML(), function(){
			var selectIDlist = p.getSelectContact();
			callback(selectIDlist);
		}, Lang.Mail.tab_addr, cancelBack, id,"565");
	});

}
Contact.prototype.bindEvent =function(){
	var p = this;
	function _bindOverDeptSpan(){
		jQuery(this).addClass("overColor");
		jQuery(this).find(".addgroup").show();
	}
	jQuery(".departList_span").live("mouseover",_bindOverDeptSpan);
	jQuery(".departList_span").live("mouseout",_bindOutDeptSpan);
	jQuery(".deptList_div").on("click", ".nextPage",function () {
			p.go(this, null, null, null, p);
		}
	);
	function _bindOutDeptSpan(){
		jQuery(this).removeClass("overColor");
		jQuery(this).find(".addgroup").hide();
	}
}
/**
 * 创建主体
 * @param showType
 * @param callback 初始化完成回调
 * @param action  点击回调
 */
Contact.prototype.createBody = function( showType , callback , action)
{
	var seleTypeList =[];
	for(var k=0;k<showType.length;k++)
	{
		if(showType[k]=="0")
		{
			if(GC.check("CONTACTS_ENT")) {
				seleTypeList.push("0");
			}
		}else if(showType[k]=="2")
		{
			if(GC.check("CONTACTS_PER")) {
				seleTypeList.push("2");
			}
		}
	}
	if(seleTypeList.length==0)
	{
		CC.alert("您没有权限使用该功能");
		return;
	}
	this.getSelectValue = action || this.addContact;
	var p =this;
	//
	callback && callback.call(this,null);
	//过滤指定的邮箱帐号
	var filterListMail = this.filterList || [];
	if (filterListMail.length>0) {
		for (var i = 0; i < filterListMail.length; i++) {
			if (filterListMail[i] != "")
				this.filterList_hash[filterListMail[i]] = "y";
		}
	}

	var t = LMD.orgContactList_autoFile;

	function isInShowList(email){
		for(var i=0;i< p.config.showList.length;i++){
			if(p.config.showList[i].email==email){
				return true
			}
		}
		return false
	}
	if(this.config.showList){
		var temp=[]
		for (var i = 0; i < t.length; i++) {
			if(isInShowList(t[i].id)){//只显示showList里面的
				temp.push(t[i])
			}
		}
		t=temp
	}



	var temp=[];
	if(filterListMail.length>0)
	{
		for(var i = 0 ;i<t.length;i++)
		{
			if(t[i].type==0 && !this.filterList_hash[t[i].value])
			{
				temp.push(t[i]);
			}
		}
	}
	else
		temp = t;
	AutoFill.datas["email"] =temp;
	// if(!this.isAsyn)
	//{
	this.loadseachList();
	//}

	setTimeout(function(){
		p.showLinkMan(seleTypeList, "deptList");
	}, 200);
}
Contact.prototype.getHTML = function(flag){
	var html = [];
	html.push("<div id=\"divDialogalert\" >");
	html.push("<div class=\"dContent\" style=\"text-align:left; border: 0px;\">");
	html.push("<ul style=\"padding:10px 10px 10px "+(flag?"0":"16")+"px;overflow:hidden;_zoom:1;height:"+(this.config&&this.config.maxCount?'410':'391')+"px\">");
	html.push("<li style=\"width:"+(flag?"213":"238")+"px;\" class=\"fl\">");
	html.push("<p style=\"color:#333;\" class='selectContact_title' >" + Lang.Mail.selectPerson + "</p>");

	html.push("<div class=\"j_search\">");
	html.push("<input type=\"txt\" value='" + Lang.Mail.addr_QuickSearchLink + "' style=\"width: 160px;\" class=\"j_search_txt fl\" id=\"searchKey\" name=\"searchKey\" onclick="+this.contact+".seachkey_onclick(this) onblur="+this.contact+".seachkey_onblur(this);>");
	html.push("<input type=\"button\"  style=\"width:27px;\" class=\"j_search_btn fr\" id=\"searchDelete\">");
	html.push("</div>");
	html.push("<div class=\"branchListWrap\"   style='overflow-y: auto; height: 330px;min-height:330px;'>");
	html.push("<div class=\"li0 scrollStyle deptList-a\" id=\"deptList\" >");
	html.push(Lang.Mail.main_msg_loading);
	html.push("</div>");
	html.push("<div id=\"divResult\" style=\"display:none\">");
	html.push("<ul class=\"searchContent\" id=\"ulResult\" style=\"width:auto;\">");
	html.push("<li class=\"searchResult\" style=\"height: 433px;\" id=\"tab_search_div\"></li>");
	var countLimitTips=''
	if(this.config&& this.config.maxCount){
		countLimitTips='<div class="tipsTxt" style="color: #fc0000;display:none;"  id="maxLimit">只限于选择'+ this.config.maxCount+'个用户</div>'
	}
	html.push("</ul></div></div>"+countLimitTips+"</li>");

	if(!flag){
		html.push("<li style=\"width:55px;padding-top:183px;height:240px;vertical-align:middle;text-align:center;\" class=\"fl\"><i class=\"i-contact-rfx\" id=\"btnSel\"></i></li>");
		html.push("<li style=\"width:238px;\" class=\"fl\">");
		html.push("<p class=\"mb_5\">" + Lang.Mail.select + "（<span id=\"selCount\">0</span>" + Lang.Mail.person + " <span  id=\"clearData\" onclick="+this.contact+".empty()><a href=\"javascript:;\" class=\"clear-a\">" + Lang.Mail.folder_Empty + "</a></span>）</p>");
		html.push("<div class=\"branchListWrap\" style=\"margin-top:1px;height:358px;min-height:330px;\">");
		html.push("<div class=\"deptList\" style=\"height:358px;\">");
		html.push("<ul  id=\"sel_contactList\" name=\"sel_contactList\">");
		html.push("</ul></div></div></li>");
	}

	html.push("</ul></div></div>");
	return html.join("");
}
Contact.prototype.loadseachList = function()
{
	var p = this;
	var ap = {
		div: "tab_search_div",
		line: 20,
		noHideDiv: true,
		autocomplete: true,
		text:"searchKey",
		statsCall: function(v){
			v = v || 0;
			if (v == 0) { //0为没有搜关键字
				jQuery("#deptList").attr("style", "display:block");
				jQuery("#tab_search_div").attr("style", "display:none");
				jQuery("#searchDelete").attr("class", "j_search_btn fr");
				jQuery("#ulResult").show();
				jQuery("#divResult").show();
			}
			else {
				jQuery("#searchDelete").attr("class", "j_search_btn fr searchDelete");
				jQuery("#deptList").attr("style", "display:none");
				jQuery("#tab_search_div").attr("style", "display:block");
				jQuery("#ulResult").show();
				jQuery("#divResult").show();
			}
		},
		setCall: function(email, b){
			var name = b.substring(0, b.indexOf("<"));
			p.addContact(name, email , email);
		}
	};
	EV.observe($("searchDelete"), "click", function(){
		$("searchKey").value = Lang.Mail.addr_QuickSearchLink;
		$("searchKey").style.color = '';
		ap.statsCall(0);
	});
	EV.observe($("searchKey"), 'click', function(){
		jQuery("#searchKey").css('color', 'black');
	});
	LMD.fillEmail("searchKey", window, ap);
}

Contact.prototype.showChildLinkMan = function(id, type, index)
{
	var p =this;
	clearTimeout(this.clearonclick);
	this.clearonclick = setTimeout(function(){
		//隐藏
		var click_ico = jQuery("#i_" + type + "_" + id);

		if (click_ico.hasClass("i-hminus")) {
			click_ico.removeClass("i-hminus").addClass("i-sadd");
			if (jQuery("#ul_" + type + "_" + id).length > 0) {
				jQuery("#ul_" + type + "_" + id).hide();
				return;
			}
		}
		else {//展开
			click_ico.removeClass("i-hminus").removeClass("i-sadd").addClass("i-hminus");
			if (jQuery("#ul_" + type + "_" + id).length > 0) {
				jQuery("#ul_" + type + "_" + id).show();
				return;
			}
		}

		var groupMap = LMD.groupMap;;
		var group_contactList = LMD.group_contactListMap_mail;
		var html = [];
		var a_style ="padding-left:"+(27+(index*16))+"px";
		var deptLi = "<li id='li_{1}_{0}' style='overflow:hidden' >"
			+"<span style='{2};display:block;'  class='fw_b departList_span'  onclick=\"{6}('{0}',{1},{3})\" >"
			+'<div ><a href="###" class="departList_a" title="{4}" ><i class="i-sadd mr_5" id="i_{1}_{0}"></i>{4}</a>'
			+"{5}</div>"
			+'</span></li>';
		if (groupMap[type+"_"+id] && type == "0") {//得到该节点下的子部门
			for (var i = 0; i < groupMap[type+"_"+id].length; i++) {
				var cId = groupMap[type+"_"+id][i][1];
				var addAllContactHtml="";
				if(group_contactList[type + "_" + cId] && group_contactList[type + "_" + cId].length>0)
				{
					if(p.addAsGroup){
						addAllContactHtml ="<i  class='addgroup' title='添加全部' deptId='"+cId+"' type='"+type+"'     style='margin-right: 5px;float: right;margin-top: -18px;display:none'></i>";
					}
					else{
						addAllContactHtml = "";
					}
				}
				html.push(p.deptList_temp.format(
					cId,//id
					type,//类型,是个人通讯录还是组织通讯录
					a_style,//向前预留多少像素,用于做层级关系
					(index + 1),//第几级
					groupMap[type+"_"+id][i][2],//部门名称
					addAllContactHtml,//添加全部按钮
					p.contact+".showChildLinkMan",
					"164"
				));
			}
		}
		//得到该节点下的人；
		function isInShowList(email){
			for(var i=0;i< p.config.showList.length;i++){
				if(p.config.showList[i].email==email){
					return true
				}
			}
			return false
		}

		function put(z){
			if (!p.isFilter) {
				html.push("<li style='overflow:hidden'><span class='contactList_span' onmouseover=\"this.className='overColor contactList_span'\" onmouseout=\"this.className='contactList_span'\"  style='display:block;" + a_style + "' " +(p.isShowTitle?"title=" + group_contactList[type + "_" + id][z][p.titleValue]:"") + " onclick=" + p.contact + ".getSelectValue('" + group_contactList[type + "_" + id][z][2].encodeHTML() + "','0','" + group_contactList[type + "_" + id][z][1] + "')><a href='javascript:;' >" + group_contactList[type + "_" + id][z][2] + "</a></span></li>");
			}
			else {
				if (group_contactList[type + "_" + id][z][p.type] != "" && group_contactList[type + "_" + id][z][0] == type) {
					html.push("<li style='overflow:hidden'><span class='contactList_span' onmouseover=\"this.className='overColor contactList_span'\" onmouseout=\"this.className='contactList_span'\"  style='display:block;" + a_style + "' "+(p.isShowTitle?"title=" + group_contactList[type + "_" + id][z][p.titleValue]:"")+" onclick=" + p.contact + ".getSelectValue('" + group_contactList[type + "_" + id][z][2].encodeHTML() + "','" + group_contactList[type + "_" + id][z][p.type] + "','" + group_contactList[type + "_" + id][z][1] + "')><a href='javascript:;' >" +  group_contactList[type + "_" + id][z][2] + "</a></span></li>");
				}
			}
		}
		if (group_contactList[type + "_" + id]) {
			for (var z = 0; z < group_contactList[type + "_" + id].length; z++) {
				if(p.config.showList){//只显示列表里面的人
					if(isInShowList(group_contactList[type + "_" + id][z][3])){
						put(z)
					}
				}else{
					put(z)
				}
			}
		}

		var deptListHtml = "";
		if (html.join("") != "") {
			deptListHtml = "<ul id='ul_" + type + "_" + id + "'>" + html.join("") + "</ul>";
		}
		jQuery("#li_" + type + "_" + id).append(deptListHtml);
	},300);
}
Contact.prototype.showChildLinkMan_Asyn=function(id, type, index,isFirstLoad)
{

	clearTimeout(this.clearonclick);
	var p = this;
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

		//if(id!="-1")
		//data.deptId=id;
		var html = [];
		var groupMap = LMD.groupMap;;
		var a_style ="padding-left:"+(27+(index*16))+"px";
		var orgList = groupMap[type+"_"+id] || [];
		//得到该节点下的子部门
		for (var i = 0; i < orgList.length; i++) {
			var cId = orgList[i][1];
			var addAllContactHtml ="<i  class='addgroup' title='添加整组' deptId='"+cId+"' type='0'  style='margin-right: 5px;float: right;margin-top: -18px;display:none'></i>";
			if(!p.addAsGroup){
				addAllContactHtml = "";
			}
			html.push(p.deptList_temp.format(
				cId,//id
				type,//类型,是个人通讯录还是组织通讯录
				a_style,//向前预留多少像素,用于做层级关系
				(index + 1),//第几级
				orgList[i][2],//部门名称
				addAllContactHtml,//添加全部按钮
				p.contact+".showChildLinkMan_Asyn",
				"164"
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
}
Contact.prototype.go = function(obj,id,index,a_style,conObj)
{
	var p = this;
	if(conObj){
		p = conObj;
	}
	var data ={
		"total":100,
		"recursive_flag":0,
		"search_flag":1
	};
	if(a_style){
		data.start = (index)*100+1;
		data.deptId = id;
	}else{
		index =  parseInt(jQuery(obj).attr("index"));
		//index =s
		id = jQuery(obj).attr("id")

		data.start = index*100+1;
		data.deptId = id;
		a_style = jQuery(obj).attr("a_style");
	}
	index>0?jQuery(obj).parents("li:eq(0)").remove():"";
	var html = [];
	function callBack1(data){
		function isInShowList(email){
			for(var i=0;i< p.config.showList.length;i++){
				if(p.config.showList[i].email==email){
					return true
				}
			}
			return false
		}
		var selId="0_"+id;
		if (data.code == "S_OK") {
			var userList = data["var"] || [];
			var getMore = userList.length == 100;
			if(p.config.showList){
				var temp=[]
				for (var i = 0; i < userList.length; i++) {
					if(isInShowList(userList[i].email)){//只显示showList里面的
						temp.push(userList[i])
					}
				}
				userList=temp
			}

			var user_temp = "<li style='overflow:hidden'><span class='contactList_span' onmouseover=\"this.className='overColor contactList_span'\" onmouseout=\"this.className='contactList_span'\"  style='display:block;{0}' title='{1}' onclick=" + p.contact + ".getSelectValue('{2}','{1}','{3}')><a href='javascript:;' >{2}</a></span></li>";
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
				jQuery(containerId).append(html.join("")+(getMore?nextHtml:""));
			}else{
				jQuery("#li_" + selId).append("<ul id='ul_0_" + id + "'>" + html.join("") + "</ul>"+(getMore?nextHtml:""));
			}
		}
	}
	MM.mailRequest( {
		func: "addr:searchUsers",
		data:data,
		call:callBack1
	})
}
Contact.prototype.addContact = function(name, email, id)
{
	var s = jQuery("a[name=selContact]")
	//超出限数不添加
	if (this.config && this.config.maxCount) {
		if (s.length >= this.config.maxCount) {
			jQuery('#maxLimit').show()
			return
		}
	}
	for (var i = 0; i < s.length; i++) {
		if (s.eq(i).attr("id") == email) {
			return;
		}
	}
	jQuery("#sel_contactList").append("<li  id='li" + id + "' onmouseover=\"this.className='overColor'\" onmouseout=\"this.className=''\"><span class=\"pl_5 ml_10 selContact_span\"><a href=\"javascript:void(0)\" class=\"i-contact-close fr mt_3 mr_15\" onclick="+this.contact+".removeContact('" + id + "')></a><a class='selectedContact' id='" + email + "' "+(this.isFilter?"title='" + name+ "&lt;" + email + "&gt;":"title='" + name+"'")+"' name=\"selContact\">" + name +(this.isShowValue ? "&lt;" + email + "&gt;":"") + "</a></span></li>");
	jQuery("#selCount").html(s.length + 1);
}
Contact.prototype.addOrgContact_Dept =function(deptId)
{
	var group_contactList = this.group_contactListMap["0_"+deptId];
	if (!group_contactList) {
		for (var j = 0; j < group_contactList.length; j++) {
			var id = group_contactList[j].id
			var email = group_contactList[j].email;
			var name = group_contactList[j].userName;
			var s = jQuery("a[name=selContact]")
			for (var i = 0; i < s.length; i++) {
				if (s.eq(i).attr("id") == email) {
					return;
				}
			}
			jQuery("#sel_contactList").append("<li  id='li" + id + "' onmouseover=\"this.className='overColor'\" onmouseout=\"this.className=''\"><span class=\"pl_5 ml_10 selContact_span\"><a href=\"javascript:void(0)\" class=\"i-contact-close fr mt_3 mr_15\" onclick=" + this.contact + ".removeContact('" + id + "')></a><a class='selectedContact' id='" + email + "' " + (this.isFilter ? "title='" + name + "&lt;" + email + "&gt;" : "title='" + name + "'") + "' name=\"selContact\">" + name + (this.isShowValue ? "&lt;" + email + "&gt;" : "") + "</a></span></li>");
		}
		jQuery("#selCount").html(s.length + group_contactList.length);
	}

}
Contact.prototype.getSelectContact = function(){
	var s = jQuery("a[name=selContact]");
	var result = [];
	s.each(function(i, v){
		result.push({
			id:v.id,
			value: v.title,
			name: jQuery(v).text()
		});
	});
	return result;
}

Contact.prototype.addAllContact= function(id, type)
{
	clearTimeout(this.clearonclick);
	var p = this;
	function add(data){
		if (data) {
			for (var i = 0; i < data.length; i++) {
				p.addContact(data[i][2], data[i][p.type], data[i][1]);
			}
		}
	}
	var group_contactListMap = LMD.group_contactListMap_mail;
	if (type == "2") {
		add(group_contactListMap[type+"_"+id]);
	}
	else if(type == "0") {
		var deptInfo = LMD.deptObj[id];
		if(deptInfo){
			p.addContact(deptInfo[2],deptInfo[4],deptInfo[1])
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
Contact.prototype.removeContact= function(id)
{
	var s = document.getElementById("li" + id);
	jQuery(s).remove();
	var count = parseInt(jQuery("#selCount").html()) - 1
	jQuery("#selCount").html(count.toString());
}

Contact.prototype.empty= function(){
	jQuery("#sel_contactList").empty();
	jQuery("#selCount").html("0");
}
/**
 * 当输入框没有改变时
 * @param {Object} obj
 */
Contact.prototype.seachkey_onblur=function(obj){
	var searchMail = Lang.Mail.addr_QuickSearchLink;
	if (obj.value.trim() == '') {
		obj.value = searchMail;
		$("searchKey").style.color = '';
	}
}
Contact.prototype.seachkey_onclick= function(obj){
	var searchMail = Lang.Mail.addr_QuickSearchLink;
	if (obj.value == searchMail) {
		obj.value = '';
		$("searchKey").style.color = 'black';
	}
}
Contact.prototype.closeSeach= function(obj){
	if (jQuery(obj).attr('class') == "close_t") {
		jQuery(obj).attr('class', 'btn');
		jQuery("#deptList").attr("style", "display:block");
		jQuery("#tab_search_div").attr("style", "display:none");
		jQuery("#ulResult").hide();
		jQuery("#divResult").hide();
		jQuery("#searchKey").val(Lang.Mail.addr_QuickSearchLink);

	}
	else {
		contact.seachDeptUser_asyn(jQuery("#searchKey").val());
		//jQuery("#ulResult").hide();
		//jQuery("#divResult").hide();
	}
}
Contact.prototype.bindAddGroup=function(){
	var p = this;
	jQuery(".deptList_div").click(function(e){
		var target = e.target;
		if (target.nodeName == "I" && jQuery(target).attr("class") == "addgroup") {
			p.addAllContact(target.getAttribute("deptId"), target.getAttribute("type"));
		}
	});
}
Contact.prototype.Ajax= function(url, func, data, callback){
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
}
