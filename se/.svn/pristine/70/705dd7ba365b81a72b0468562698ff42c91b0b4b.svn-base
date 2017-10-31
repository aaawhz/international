// JavaScript Document

/************************
 * 通讯录列表类
 ************************/
var AL = {
	lenName : 10, //姓名长度
	lenMail : 36, //邮箱地址长度
	lenMobile : 26, //手机长度
	lenCompany : 10, //公司长度
	lenJobs : 5, //职务长度
	/* 
	 * 通讯录类型 默认展开的通讯录
	 0 企业员工组（企业通讯录）
	1企业客户组（客户通讯录）
	2 个人通讯录组
		*/
	addrType : 0,
	groupId : 0, //当前组id
	intCount : -1, //总数
	pageCount : 0, //总页数
	pageSize : 20, //每页显示记录的条数
	curPage : 1, //当前页数
	groupData : null, //组数据(保存个人通讯录所有组，待优化)
	letter : "", //姓名拼音首字母
	key : "", //搜索关键字
	isSearch : false, //全局变量，是否搜索状态
	isFresh : false, //全局变量，是否刷新状态
	groupCount : [0, 0, 0], //每个通讯录有多少个组
	groupIndex : [0, 0, 0], //当前组的索引
	groupBeforeIndex : [0, 0, 0], //保存上次查看组的索引
	beforeAddrType : 0, //保存上次查看通讯录的类别
	userType : '1', //用户类型  2不显示企业、客户通讯录 1正常显示
	userGroupid : "-1", //组id
	serverUrl:"/addr/user",
	
	/***************************
	 * 初始化通讯录
	 ***************************/
	init : function() {
		AL.showMsg();
		this.loadMenu(true, 'first');
		this.setHeight();
		this.setWidth();

	},
	showMsg:function() {
		parent.CC.showMsg(Lang.Addr.index_loadingData, true);
	},
	hideMsg:function() {
		//msg.style.display = "none";
		parent.CC.AL.hideMsg();
	},
	
	freshData:function(type){
	    AL.isFresh = true;
	    if(type=="dobuleclick")
	    {
	        AL.loadMenu(false);
	    }
	    else{
	        AL.loadMenu(false);
	        AL.loadList();
	    }
	},

	
	/********************************
	 * 加载通讯录左侧导航菜单
	 ********************************/
	loadMenu : function(blnClick, init, parmid) {

		var p = this;
				
		if( typeof (parmid) != "undefined") {
			this.addrType = parmid;
		}
		//获取组数据
		
		var objDiv = document.getElementById("addr_leftDiv");
		
		if(objDiv==null)
		{
			return;
		}
		
		var am = [];
		
		
		//根据权限展开
		if(init=='first')
		{	
			if(!GC.check("ADDR_LIST_EP")){
				p.addrType=1;
				document.getElementById("addr_left_Menu0").style.display = 'none';
			}
			
			if(!GC.check("ADDR_LIST_CS")){
				p.addrType=0;
				document.getElementById("addr_left_Menu1").style.display = 'none';
			}
			
			if(!GC.check("ADDR_LIST_PERSON")){
				p.addrType=2;
				document.getElementById("addr_left_Menu2").style.display = 'none';
			}
			
			
			if(GC.check("ADDR_LIST_PERSON")&&!GC.check("ADDR_LIST_EP")&&!GC.check("ADDR_LIST_CS"))
			{
				p.addrType=2;
			}
		}
		AddrCom.Ajxa(AL.serverUrl,"addr:listGroup",{},callBack);
		
		function callBack(addrdata) {
									
				p.groupData = addrdata;
				var html1 = [], html2=[], html3=[]; 
				var index1 = 0,index2 = 0, index3 = 0; 
				var tCount = [0,0,0];
				$.each(addrdata['var'].group, function(j, group) {
					var id = group.groupId;
					var itype = ( typeof (group.groupFlag) == "undefined") ? 0 : group.groupFlag;
					var icount = group.count;
					var sname = group.groupName;
			
					var name = AddrCom.getLeftStr(sname,10);
					
					switch(itype){
						case 0:
							html1.push("<div id=\"group" + index1 + id + j+"\" class=\"addr_left_group\" onmouseout=\"AL.groupMouseOut(this,"+index1+")\" onmouseover=\"AL.groupMouseOver(this,"+index1+")\"  onclick=\"AL.groupClick(this," + itype + "," + index1 + "," + id + "," + icount + ");\" onmouseup=\"AL.groupMouseUp(this);\"><div class=\"text\"><a hideFocus href=\"javascript:fGoto();\" title=\"" + sname + "\">" + name + "</a><span class=\"count\">[" + icount + "]</span></div>");
							html1.push("</div>");
							index1++;
					    	break;
						case 1:
					    	html2.push("<div id=\"group" + index2 + id +j+ "\" class=\"addr_left_group\" onmouseout=\"AL.groupMouseOut(this,"+index2+")\" onmouseover=\"AL.groupMouseOver(this,"+index2+")\" onclick=\"AL.groupClick(this," + itype + "," + index2  + "," + id + "," + icount + ");\" onmouseup=\"AL.groupMouseUp(this);\"><div class=\"text\"><a hideFocus href=\"javascript:fGoto();\" title=\"" + sname + "\">" + name + "</a><span class=\"count\">[" + icount + "]</span></div>");
					    	html2.push("</div>");
					    	index2++;
					    	break;
					    case 2:
					    	html3.push("<div id=\"group" + index3 + id + j+"\" class=\"addr_left_group\" onmouseout=\"AL.groupMouseOut(this,"+index3+")\" onmouseover=\"AL.groupMouseOver(this,"+index3+")\" onclick=\"AL.groupClick(this," + itype+ "," + index3  + "," + id + "," + icount + ");\" onmouseup=\"AL.groupMouseUp(this);\"><div class=\"text\"><a hideFocus href=\"javascript:fGoto();\" title=\"" + sname + "\">" + name + "</a><span class=\"count\">[" + icount + "]</span></div>");					    	
					    	if(id>0){
					    		//html3.push('<div class=button><a hideFocus href="javascript:fGoto();" aid="'+id+'" aname=sname onclick=AL.opt("gedit",' + id + ',"' + sname + '");><span class=addr_left_edit></span></a><a hideFocus href=javascript:fGoto(); onclick=AL.opt("gDel",' + id + ')><span class=addr_left_del></span></a></div>');
					    		html3.push('<div class=button><a class="cli" hideFocus href="javascript:fGoto();" aid="'+id+'" aname='+sname+' ><span class=addr_left_edit></span></a><a hideFocus href=javascript:fGoto(); onclick=AL.opt("gDel",' + id + ')><span class=addr_left_del></span></a></div>');
					    	}	
					    	html3.push("</div>");
					    	index3++;
					    	break;
					}
				});
				
				$("#addr_left_block0").html(html1.join(""));	
				$("#addr_left_block1").html(html2.join(""));
				$("#addr_left_block2").html(html3.join(""));
				
				$("#addr_left_block2 .button .cli").each(function(i){
					var aid=$(this).attr("aid");
					var aname=$(this).attr("aname");
					
					$(this).click(function(){
						AL.opt("gedit",aid,aname);
					});
				});
						

			//搜索
			
			if(AL.isSearch) {
				document.getElementById("addr_left_bg" + p.addrType).className = "addr_left_bg2";
				var tObj = document.getElementById("addr_left_block" + p.addrType);
				tObj.style.display = "none";
				p.loadSearch(1, -1, p.key);
			} else {
				//触发事件，默认展开企业通讯录
				if(blnClick) {
					if(p.userGroupid != "" && p.userGroupid != null && p.userGroupid != "-1") {
						//展开组
						var obj = document.getElementById(p.userGroupid);
						GC.fireEvent(obj, "click");
					    AL.groupClick(this,"+i+","+j+","+id+","+icount+");
					}
					//展开菜单
					$("#addr_left_bg" + p.addrType).click();
				} else {
					document.getElementById("addr_left_bg" + p.addrType).className = "addr_left_bg";
					var tObj = document.getElementById("addr_left_block" + p.addrType);
					tObj.style.display = "block";
					AL.setGroupStyle(tObj.childNodes[0], 0, true);
				}
			}
								
			AL.isFresh = false;			
			AL.loadMoveGroup();
			
		}

	},
	/********************************
	 * 加载通讯录分页列表
	 * 参数：
	 *     addtype: int, 通讯录类型(0:个人通讯录,2:企业通讯录,1:客户通讯录)
	 *     groupid: int,通讯录组ID(为0默认显示所有联系人)
	 *     intpage: int,当前页数
	 ********************************/
	loadList : function(intpage, count, addrtype, groupid) {
		var objDiv = document.getElementById("listpageDiv");
		
		if(objDiv==null)
		{
			return ;
		}
		
		var at = [];
		var p = this;
				
		
		var a = intpage || p.curPage, b = groupid || p.groupId, c = addrtype || p.addrType, icount = count || p.intCount;
	
		//异步请求回调函数,解析Json数据
		function callBack(addrlistdata) {
			p.intCount = addrlistdata["var"].page.intCount;
			p.pageCount = addrlistdata["var"].page.pageCount;
			p.pageSize = addrlistdata["var"].page.pageSize;
			p.curPage = addrlistdata["var"].page.curPage;
			if(p.intCount > 0) {
				at[at.length] = "<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" class=\"addr_table\" id=\"listTable\">";
				$.each(addrlistdata["var"].list, function(i, list) {
					var tId = list.id;
					var tMail = (list.email != "") ? list.email : Lang.Addr.index_noEmail;
					var tMobile = (list.mobile != "") ? list.mobile : Lang.Addr.index_noPhone;
					var mobile = list.mobile;
					var mail = list.email;
					var tName = list.userName;
					//var wite = list.whiteliststatus;
					var company = list.company;
					var jobs = list.jobs;
					
					at[at.length] = "<tr onmouseover=\"AL.trMouseOver(this)\" onmouseout=\"AL.trMouseOut(this);\" onmouseDown=\"AL.trMouseDown(this);\" onclick=\"AL.trClick(this);\" name=\"listTr\">";
					//姓名列
					if(p.addrType == 2) {
						at[at.length] = "<td width=\"18%\" align=\"left\"><input type=\"checkbox\" name=\"addrcheckbox\" value=\"" + tId + "," + mail + "," + mobile + "," + c +  "\" onclick=\"AL.cbClick(this);\">&nbsp;<a hideFocus href=\"javascript:fGoto();\" title=\"" + Lang.Addr.ViewDetailedInfrormation.format(tName) + "\" onclick=\"AL.opt('edit'," + tId + ");\">" + AddrCom.getLeftStr(tName,p.lenName-2) + "</a></td>";
					} else {
						at[at.length] = "<td width=\"18%\" align=\"left\"><input type=\"checkbox\" name=\"addrcheckbox\" value=\"" + tId + "," + mail + "," + mobile + "," + c +  "\" onclick=\"AL.cbClick(this);\">&nbsp;<a hideFocus href=\"javascript:fGoto();\" title=\"" + Lang.Addr.ViewDetailedInfrormation.format(tName) + "\" onclick=\"AL.opt('view'," + tId + "," + p.addrType + ");\">" + AddrCom.getLeftStr(tName,p.lenName-2) + "</a></td>";
					}
					//邮件地址列
 					if(mail){
						at[at.length] = "<td width=\"35%\" align=\"left\">&nbsp;<a hideFocus href=\"javascript:fGoto();\" title=\"" + tMail + "\" onclick=\"AL.send('mail','" + mail + "');\">" + AddrCom.getLeftStr(tMail,p.lenMail-2) + "</a></td>";
					}else{
						at[at.length] = "<td width=\"35%\" align=\"left\">&nbsp;<a hideFocus >" + AddrCom.getLeftStr(tMail,p.lenMail-2) + "</a></td>";
					}
					//手机号码列
					at[at.length] = "<td width=\"17%\" align=\"center\">&nbsp;<a hideFocus href=\"javascript:fGoto();\" title=\"" + tMobile + "\">" + AddrCom.getLeftStr(tMobile,p.lenMobile-2) + "</a></td>";				
			
					//操作列
					at[at.length] = "<td width=\"16%\" align=\"center\">&nbsp;<a hideFocus href=\"javascript:fGoto();\" title=\"" + company + "\">" + AddrCom.getLeftStr(company,p.lenCompany-2)+ "</a></td>";
					
					at[at.length] = "<td width=\"13%\" align=\"center\">&nbsp;<a hideFocus href=\"javascript:fGoto();\" title=\"" + jobs + "\">" + AddrCom.getLeftStr(jobs,p.lenJobs-2)+ "</a>";
										
					at[at.length] = "</td></tr>";
				});
				at[at.length] = "</table>";
			    
				objDiv.innerHTML = at.join("");
				
				
				
			} else {
				doError();
			}
			p.changeCount(p.intCount);
			
			p.setHeight(1);
			p.loadPage();
			p.loadMoveGroup();
									
		}

		function doError() {
			objDiv.innerHTML = "<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" class=\"addr_table\" id=\"listTable\"><tr><td align=\"center\" class=\"empty\"><span id=\"addr_error\">" + Lang.Addr.index_noContact + "</span></td></tr></table>";
			if(p.addrType == 2 && GC.check("ADDR_ADD_USER")) {
				document.getElementById("addr_error").innerHTML = Lang.Addr.index_noContactAdd + "<a hideFocus href=\"javascript:fGoto();\" title=\"" + Lang.Addr.index_clickAddContact + "\" onclick=\"AddrCom.opAddr('addUser')\">" + Lang.Addr.index_clickAddContact + "</a>";
			}
		}		
		
		var key="";
		if(p.isSearch){
			key=p.key;
		}
		
		var data={"type":c,"groupId":b,"pageNo":a,"pageSize":p.pageSize,"count":-1,"letter":p.letter,"key":key};
		
		AddrCom.Ajxa(AL.serverUrl,"addr:listUser",data,callBack);
		    
		
	},
	/********************************
	 * 通讯录搜索列表
	 * 参数：
	 *     addtype: int, 通讯录类型(0:个人通讯录,2:企业通讯录,1:客户通讯录)
	 *     groupid: int,通讯录组ID(为0默认显示所有联系人)
	 *     intpage: int,当前页数
	 ********************************/
	loadSearch : function(intpage, count, key) {
		var objDiv = document.getElementById("listpageDiv");
		
		var at = [];
		var p = this;
		p.isSearch = true;

		if(key != "" && key != null)
			p.key = key;
		
		var a = intpage || p.curPage, icount = count || p.intCount;
	

		AL.resetCssL();		
		
		var data={"pageNo":a,"pageSize":p.pageSize,"count":icount,"letter":p.letter,"key":p.key};
		
		AddrCom.Ajxa(AL.serverUrl,"addr:listUser",data,callBack);		
		
		function callBack(addrlistdata) {
			p.intCount = addrlistdata["var"].page.intCount;
			p.pageCount = addrlistdata["var"].page.pageCount;
			p.pageSize = addrlistdata["var"].page.pageSize;
			p.curPage = addrlistdata["var"].page.curPage;
			
			var addressType = [Lang.Addr.exportNew_EnAddr,Lang.Addr.exportNew_guestAddr,Lang.Addr.exportNew_perAddr];
			
			if(p.intCount > 0) {
				at[at.length] = "<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" class=\"addr_table\" id=\"listTable\">";
				$.each(addrlistdata["var"].list, function(i, list) {
					var tId = list.id;
					var tMail = (list.email != "") ? list.email : Lang.Addr.index_noEmail;
					var tMobile = (list.mobile != "") ? list.mobile : Lang.Addr.index_noPhone;
					var mobile = list.mobile;
					var mail = list.email;
					var tName = list.userName;
					//var wite = list.whiteliststatus;
					var company = list.company;
					var jobs = list.jobs;
					var userType=0;
										
					at[at.length] = "<tr onmouseover=\"AL.trMouseOver(this)\" onmouseout=\"AL.trMouseOut(this);\" onmouseDown=\"AL.trMouseDown(this);\" onclick=\"AL.trClick(this);\" name=\"listTr\">";
					//姓名列
					if(list.addrFlag == 2) {
						at[at.length] = "<td width=\"18%\" align=\"left\"><input type=\"checkbox\" name=\"addrcheckbox\" value=\""+tId+","+mail+","+mobile+","+list.addrFlag+"\" onclick=\"AL.cbClick(this);\" style=\"float:left;margin-top:5px;#margin-top:0px;\"><div class=\"addr_left_text"+(list.addrFlag+1)+"\" style=\"float:left; margin-left:0; padding-left:0\" title=\""+addressType[list.addrFlag]+"\"><span class=\"searchNametd\"><a hideFocus href=\"javascript:fGoto();\" title=\""+Lang.Addr.ViewDetailedInfrormation.format(tName)+"\" onclick=\"AL.opt('edit',"+tId+",'"+tName+"');\">"+AddrCom.getLeftStr(tName,p.lenName-2)+"</a></span></div></td>";
					} else {
						at[at.length] = "<td width=\"18%\" align=\"left\"><input type=\"checkbox\" name=\"addrcheckbox\" value=\""+tId+","+mail+","+mobile+","+list.addrFlag+"\" onclick=\"AL.cbClick(this);\" style=\"float:left;margin-top:5px;#margin-top:0px;\"><div class=\"addr_left_text"+(list.addrFlag+1)+"\" style=\"float:left; margin-left:0; padding-left:0\" title=\""+addressType[list.addrFlag]+"\"><span class=\"searchNametd\"><a hideFocus href=\"javascript:fGoto();\" title=\""+Lang.Addr.ViewDetailedInfrormation.format(tName)+"\" onclick=\"AL.opt('view',"+tId+",'"+tName+"',"+list.addrFlag+");\">"+AddrCom.getLeftStr(tName,p.lenName-2)+"</a></span></div></td>";
					}
					//邮件地址列
					at[at.length] = "<td width=\"35%\" align=\"left\">&nbsp;<a hideFocus href=\"javascript:fGoto();\" title=\"" + tMail + "\" onclick=\"AL.send('mail','" + mail + "');\">" + AddrCom.getLeftStr(tMail,p.lenMail-2) + "</a></td>";
					//手机号码列
	
					at[at.length] = "<td width=\"17%\" align=\"center\">&nbsp;<a hideFocus href=\"javascript:fGoto();\" title=\"" + tMobile + "\">" + AddrCom.getLeftStr(tMobile,p.lenMobile-2) + "</a></td>";				
			
					//操作列
					at[at.length] = "<td width=\"16%\" align=\"center\">&nbsp;<a hideFocus href=\"javascript:fGoto();\" title=\"" + company + "\">" + AddrCom.getLeftStr(company,p.lenCompany-2)+ "</a></td>";
					
					at[at.length] = "<td width=\"13%\" align=\"center\">&nbsp;<a hideFocus href=\"javascript:fGoto();\" title=\"" + jobs + "\">" + AddrCom.getLeftStr(jobs,p.lenJobs-2)+ "</a>";
					
					
					at[at.length] = "</td></tr>";
				});
				at[at.length] = "</table>";
				objDiv.innerHTML = at.join("");
			} else {
				doError();
			}
			p.setTitle();
			p.setHeight(1);
			p.loadMoveGroup();
			p.loadPage();
		}

		function doError() {
			objDiv.innerHTML = "<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" class=\"addr_table\" id=\"listTable\"><tr><td align=\"center\" class=\"empty\">" + Lang.Addr.index_notSearchContacts + "</td></tr></table>";
		}

	},
	/********************************
	 * 通讯录左侧导航菜单事件处理
	 ********************************/
	switchMenu : function(obj, addrtype) {
		var p = this;
		p.addrType = addrtype;
		p.beforeAddrType = addrtype;
		var o = $(obj);
		var id = $(obj).parent().attr("id");
		$(".addr_left_Menu").each(function() {
			var thisMenu = $(this).children();
			var o1 = thisMenu.eq(0);
			var o2 = thisMenu.eq(1);
			if($(this).attr("id") == id) {
				if(p.isFresh == false)
					changeMenu(o1, o2);
					
				//alert($(o2.children().eq(p.groupIndex[addrtype])).attr("id"));	
				$(o2.children().eq(p.groupIndex[addrtype])).click();
				p.loadMoveGroup();
			} else {
				if(p.isFresh == false)
					changeMenu(o1, o2, true);
			}
		});
		function changeMenu(o1, o2, hidden) {
			if(hidden || (o1.attr("class") == "addr_left_bg")) {
				o1.removeClass("addr_left_bg");
				o1.addClass("addr_left_bg2");
				o2.css("display", "none");
			} else {
				o1.removeClass("addr_left_bg2");
				o1.addClass("addr_left_bg");
				o2.css({
					"display" : "block"
				});
				//			o2.css({"display":"block","float":"left"});
			}
		}

	},
	//加载移动/复制组信息
	loadMoveGroup : function() {
		var am = [];
		var p = this;
		var a=false;		
		am[am.length] = "";
		if((p.addrType == 2 || p.isSearch == true)&&GC.check("ADDR_DELETEUSER"))
			am[am.length] = "<span id=\"btnDelSel\"><span  class=\"btnDelete\" onClick=\"AL.optContact(this,'delsel');\">" + Lang.Addr.index_del + "</span></span>&nbsp;&nbsp;";
		if(p.addrType == 2 && p.isSearch == false) {
			if(GC.check("ADDR_MOVE"))
			{
				a=true;
				am[am.length] = Lang.Addr.inex_moveTo + "：<select name=\"moveGroup\" id=\"moveGroup\" onchange=\"AL.optContact(this,'move')\">";
				am[am.length] = "<option value=\"\">" + Lang.Addr.index_selectTargetGroup + "</option>";
			}
		} else {
			if(GC.check("ADDR_COPY"))
			{
				a=true;
				am[am.length] = "&nbsp;" + Lang.Addr.index_copyTo + "：<select name=\"moveGroup\" id=\"moveGroup\" onchange=\"AL.optContact(this,'copy')\">";
				am[am.length] = "<option value=\"\">" + Lang.Addr.index_selectTargetGroup + "</option>";
			}
		}
		if( typeof (p.groupData) == "object" && p.groupData != null) {
			var o = p.groupData["var"].group;
			
			$.each(o, function(i, group) {
				if((i > 0 && group.groupFlag==2 && group.groupId!=0)&&a )
					am[am.length] = "<option value='" + group.groupId + "'>" + group.groupName + "</option>"
			});
		}
		am[am.length] = "</select>";
		$("#addr_page_delDiv").html(am.join(""));
	},
	//设置通讯录列表中的标题信息
	setTitle : function(id, o) {
		if(this.isSearch == false && typeof (id) == "number" && typeof (o) == "object") {
			//	    document.getElementById("rightletterDiv").style.display = "block";
			//搜索框，不在放在父窗口
			//	    var objSearchInput =  parent.document.getElementById("addressSearchInput");
			var objSearchInput = document.getElementById("addressSearchInput");
			if(objSearchInput.value == "")
				objSearchInput.value = Lang.Addr.index_quickSearchContact;
			var t = $("#addr" + id).text();
			var g = $(o).find("a").text();
			var c = $(o).find("span").text();
			
			var s = "<strong>" + t + "</strong>" + Lang.Addr.index_TotalPeopleForGroup.format(g.encodeHTML(), c);
		} else {
			var s = Lang.Addr.index_searchResult.format(this.intCount);
			//	    document.getElementById("rightletterDiv").style.display = "none";
		}
		$("input[name='addrcheckboxall']").attr("checked", false);
		document.getElementById("addr_title_leftDiv").innerHTML = s;
	},
	//加载分页按钮
	loadPage : function() {
		    var objDiv1 = document.getElementById("addr_pageDiv");
		    var objDiv2 = document.getElementById("addr_bottomDiv")
			var ap = [];
			var pc = this.pageCount;
			var ps = this.pageSize;
			var cp = (this.curPage>pc)?this.pageCount:this.curPage;
			cp = (cp<1)?1:cp;
			if(pc>1){
				if(cp>1){
					ap[ap.length] = "<div class=\"btnFirst\" id=\"btnFirst\" onClick=\"AL.goPage(1);\"></div>";
					ap[ap.length] = "<div class=\"btnPre\" id=\"btnPre\" onClick=\"AL.goPage("+(cp-1)+");\"></div>";
				}
				if(cp<pc){
				    ap[ap.length] = "<div class=\"btnNext\" id=\"btnNext\" onClick=\"AL.goPage("+(cp+1)+");\"></div>";
				    ap[ap.length] = "<div class=\"btnLast\" id=\"btnLast\"  onClick=\"AL.goPage("+(pc)+");\"></div>";
				}
				ap[ap.length] = "<div class=\"bt_01\">"+Lang.Addr.index_pages+":</div>";
				ap[ap.length] = "<div class=\"bt_01\">";
				ap[ap.length] = "<select name=\"menu1\" id=\"pagemenu\" onChange=\"AL.goPage(this.options[this.selectedIndex].value);\">";
				for(var i=1;i<=pc;i++){
				    var sel = (i==cp)?" selected":"";
					ap[ap.length] = "<option value=\""+i+"\""+sel+">"+i+"/"+pc+"</option>";
				}
				ap[ap.length] = "</select>";
				objDiv1.innerHTML = ap.join("");
			}else{
			    objDiv1.innerHTML = "";
			}
			objDiv2.style.display = (pc==0)?"none":"block";
	},
	/********************************
	 * 通讯录左侧导航菜单事件处理
	 * fALLoadList(intpage,count,addrtype,groupid)
	 ********************************/
	loadGroup : function(o, addrtype, groupindex, groupid, count) {
		var p = this;
		document.getElementById("AllCount").value = count;
		//改变首字母查询样式
		var let = p.letter || "all";
		let = let.toLowerCase();
		p.letter = "";

		p.isSearch = false;
		p.addrType = addrtype;
		p.beforeAddrType = addrtype;
		p.groupId = groupid;
		p.groupIndex[addrtype] = groupindex;
		p.intCount = count;
		p.setTitle(addrtype, o);
		var curpage = (p.isFresh == true) ? p.curPage : 1;
		p.loadList(curpage, count, addrtype, groupid);

	},
	/********************************
	 * 通讯录设置每页显示页数
	 * 参数：ps 每页显示的页数
	 ********************************/
	changePageSize : function(ps) {
		AL.resetCssCPS();
		
		var p = this;

	    document.getElementById(ps).className = "addLetterSearch";
		
		p.pageSize = ps;
		if(p.isSearch == false) {
			p.loadList(1);
		} else {
			p.loadSearch(1);
		}

	},
	/********************************
	 * 通讯录按姓名拼音首字母查询
	 * 参数：c 姓名拼音首字母
	 ********************************/
	searchLetter : function(c) {
		AL.resetCssL();
		document.getElementById(c).className = "addLetterSearch";
		var p = this;
		if(c == "ALL") {
			var count = document.getElementById("AllCount").value;
			p.letter = "";
			p.loadList(1, count);
		} else {
			p.letter = c;
			p.loadList(1);
		}
		//document.getElementById("letterSpan").innerHTML = c;
		//document.getElementById("letterDiv").style.display = "none";
	},
	/********************************
	 * 翻页
	 ********************************/
	goPage : function(cp) {
		var p = this;
		if(p.isSearch == true) {
			p.loadSearch(cp, p.intCount, p.key);
		} else {
			p.loadList(cp);
		}
		$("input[name='addrcheckboxall']").attr("checked", false);
	},
	/********************************
	 * 加载拼音首字母选择div
	 ********************************/
	loadLetter : function() {
		var al = [];
		al[al.length] = "<a hideFocus href=\"javascript:fGoto();\" onclick=\"AL.searchLetter('ALL');\">All</a><br/>";
		for(var j = 1, i = 65; i <= 90; i++, j++) {
			var c = String.fromCharCode(i);
			al[al.length] = "<a hideFocus href=\"javascript:fGoto();\" onclick=\"AL.searchLetter('" + c + "');\">" + c + "</a>&nbsp;&nbsp;";
			if(j % 7 == 0)
				al[al.length] = "<br/>";
		}
		document.getElementById("letterDiv").innerHTML = al.join("");
	},
	//首次进入设置页面函数
	setlistHeight : function() {
		var gh = parent.CC.docHeight() - parent.GE.pos()[1] - 38;
		var lh = $("tr").length * $("tr:first").height();
		var h1 = gh - ($("#addr_titleDiv").height() + $("#addr_headDiv").height() + $("#addr_bottomDiv").height() + $("#addressContent").height());
		//addressWrapper
		if(lh > 0) {
			if(lh > h1) {
				
				$("#listpageDiv").height(h1);
				
			} else {
				$("#listpageDiv").css({
					"border-bottom" : "none",
					"height" : "auto"
				});
			}
		}
	},
	//设置页面高度
	setHeight : function(t) {
		var gh = parent.CC.docHeight() - parent.GE.pos()[1] -38 ;
		var h1 = gh - ($("#addr_titleDiv").height() + $("#addr_headDiv").height() + $("#addr_bottomDiv").height() + $("#addressContent").height());
		if( typeof (t) == "undefined" || t == 0 || t == 2) {
			setMenuHeight();
		}
		if(t > 0) {
			setListHeight();
		}
		function setMenuHeight() {
			var mh = $(".addr_left_Menu:visible").length * 28;
			if(mh > 0) {
				$("#addr_contantDiv").height(gh);
				$(".addr_left_block").height(gh - mh);
			} else {
				setTimeout(setMenuHeight, 50);
			}
		}

		function setListHeight() {
			var lh = $("tr").length * $("tr:first").height();
			if(lh > 0) {
				if(lh > h1) {
					
					$("#listpageDiv").height(h1);

				} else {
					$("#listpageDiv").css({
						"border-bottom" : "none",
						"height" : "auto"
					});
				}
			} else {
				setTimeout(setListHeight, 50);
			}
		}

	},
	//设置页面宽度
	setWidth : function() {
		var gw = parent.CC.docWidth() - parent.GE.pos()[0];
		var lw = $("#addr_leftDiv").width()
		setWidth();
		setDiv();
		function setWidth() {
			$("#addr_contantDiv").width(gw);
			$("#addr_rightDiv").width(gw - lw - 2);

		}

		//去掉拼音首字查询和分页
		function setDiv() {
			var x1 = gw - 100;
			y1 = 32;
			var x2 = gw - 200;
			y2 = 32;
			$("#pageSizeDiv").css({
				"left" : x1 + "px",
				"top" : y1 + "px"
			});
			$("#letterDiv").css({
				"left" : x2 + "px",
				"top" : y2 + "px"
			});
		}

	},
	//初始化拼音字母和每页显示页数div事件
	initEvent : function() {
		var a = [];
		a[a.length] = document.getElementById("pageSizeDiv");
		a[a.length] = document.getElementById("letterDiv");
		a[a.length] = document.getElementById("pageSizeBtn");
		a[a.length] = document.getElementById("letterBtn");

		$.each(a, function(i, o) {
			var obj = $(o);
			obj.hover(function() {
			}, function(ev) {
				if(i < 2) {
					obj.css("display", "none");
				} else {
					var objTemp = $(a[i - 2]);
					var evn = ev || window.event;
					var x = evn.clientX, y = evn.clientY;
					var x1 = objTemp.offset().left, y1 = $(a[i - 2]).offset().top;
					var w = objTemp.width() + 32;
					h = objTemp.height() + 32;
					if(objTemp.css("display") == "block") {
						if(x >= x1 && x <= x1 + w && y >= y1 - 4 && y <= y1 + h) {
						} else {
							objTemp.css("display", "none");
						}
					}
				}
			});
			if(i > 1) {
				obj.bind("click", function() {
					$(a[i - 2]).css("display", "block");
				});
			}
		});
	},
	//全选
	checkAll : function(b) {
		var objAll = $("input[name^='addrcheckbox']");
		var objTr = $("tr[name='listTr']");
		objAll.attr("checked", b);
		if(b) {
			AL.setTrStyle(objTr, true);
		} else {
			AL.setTrStyle(objTr, false);
		}
	},
	//改变单元格行的样式
	trClick : function(tr) {
		var cb = tr.childNodes[0].childNodes[0];
		cb.click();
		//cb.attr("checked",true);
		//AL.setTrStyle(tr,true);
	},
	trMouseOver : function(tr) {
		var cb = tr.childNodes[0].childNodes[0];
		if(!cb.checked)
			AL.setTrStyle(tr, true);
	},
	trMouseOut : function(tr) {
		var cb = tr.childNodes[0].childNodes[0];
		if(!cb.checked)
			AL.setTrStyle(tr, false);

	},
	trMouseDown : function(tr) {
		/*var cb = tr.childNodes[0].childNodes[0];
		 cb.click();
		 var obj=event.srcElement;
		 obj.setCapture();
		 AL.isDrag = true;*/
	},
	//单击组
	groupClick : function(obj, i, j, id, icount) {
		AL.groupBeforeIndex[i] = AL.groupIndex[i];
		AL.loadGroup(obj, i, j, id, icount)
		AL.setGroupStyle(obj, j, true);
		
		AL.resetCssL();
		
		//AL.freshData();
	},
	groupMouseOver : function(obj, index) {
		AL.setGroupStyle(obj, index, true);
	},
	groupMouseOut : function(obj, index) {
		AL.setGroupStyle(obj, index, false);
	},
	groupMouseUp : function(obj) {
		//var obj=event.srcElement;
		//obj.releaseCapture();
	},
	cbClick : function(obj) {
		obj.click();
		var objTr = obj.parentNode.parentNode;
		var objCb = $("input[name='addrcheckboxall']");
		if(obj.checked) {
			AL.setTrStyle(objTr, true);
		} else {
			AL.setTrStyle(objTr, false);
			objCb.attr("checked", false);
		}
	},
	setGroupStyle : function(obj, index, isOver) {
		var o = $(obj);
		var bi = AL.groupBeforeIndex[AL.beforeAddrType];
		if(index == AL.groupIndex[AL.addrType]) {
			setGroupStyleOver(obj);
			if(AL.groupIndex[AL.addrType] != bi) {
				var bObj = document.getElementById("addr_left_block"+AL.beforeAddrType).childNodes[bi];
				setGroupStyleOut(bObj);
			}
		} else {
			if(isOver) {
				setGroupStyleOver(obj);
			} else {
				setGroupStyleOut(obj);
			}
		}

		function setGroupStyleOver(obj) {
			if(obj){
				obj.style.backgroundColor = "#FFFFD6";
				obj.style.borderColor = "#DEDEDE";
			}
		}

		function setGroupStyleOut(obj) {
		    if(obj){
				obj.style.backgroundColor = "#FFFFFF";
				obj.style.borderColor = "#FFFFFF";
			}
		}

	},
	setTrStyle : function(obj, isOver) {
		if(isOver) {
			$(obj).css("background-color", "#FFFDD7");
		} else {
			$(obj).css("background-color", "#FFFFFF");
		}
	},
	send : function(s, pm) {
		s = s.toLowerCase();
		if( typeof (pm) == "undefined")
			pm = "";
		if(pm == null)
			pm = "";
		switch(s) {
			case "sms":
				//            parent.CC.goSSO('601','sms','发送短信',pm);
				parent.CC.goSms('', pm);
				break;
			case "mms":
				//            parent.CC.goSSO('701','mms','发送彩信',pm);
				parent.CC.goMms('', pm);
				break;
			case "mail":
				parent.CC.compose(pm);
				break;
			default:
				break;
		}
	},
	opt : function(s, id, text, usertype) {
		s = s.toLowerCase();
		switch(s) {
			case "view":
				AddrCom.opAddr('viewUser',id);
				break;
			case "edit":
				AddrCom.opAddr('editUser',id);
				break;
			case "gdel":
				optGDel(id);	
				break;
			case "gedit":
				AddrCom.opFunc.editGroup(id,text);
				break;				
			default:
				break;
		}
		
		function optGDel(id) {

			AddrCom.confirm(Lang.Addr.index_delGroup, Lang.Addr.index_sureDelGroup, callBack, '');
			
			function callBack() {				
				var data={"groupId":id};
				
				
				AddrCom.Ajxa(AL.serverUrl,"addr:deleteGroup",data,function(d){
						if(d.code=="S_OK"){
							if(AL.groupIndex[AL.addrType] == (AL.groupCount[AL.addrType] - 1))
								AL.groupIndex[AL.addrType]--;
							AL.loadMenu(false);
							AL.freshData();
							AL.resetIndex();
							CC.synData(null, "common_addr");
						}
						else{
							CC.alert(Lang.Addr.index_delGroupFailure);
						}
				});
						
										
			}
		}
		
		
	},
	optContact : function(obj, s) {
		s = s.toLowerCase();
		var url = "addr_contact_do.aspx";
		var id = "";
		if(obj.name == "moveGroup") {
			id = obj.options[obj.selectedIndex].value;
			if(id == "")
				return;
		}		
		id=parseInt(id);
		switch(s) {
			case "copy":
				optCopy(id);
				break;
			case "move":
				optMove(id);
				break;
			case "delsel":
				optDelSel();
				break;
			default:
				break;
		}

		function optMove(id) {
						
			var v = AddrCom.getCheckedValue(0);
			
			if(v.length>0 && v != null) {
				callBack();
			} else {
				CC.alert(Lang.Addr.index_selectMovContact);
				
				resetSelect();
			}
			
			function callBack(){
				var data={groupId:id,id:v} ; 
				
				AddrCom.Ajxa(AL.serverUrl,"addr:move",data,function(d){
							if(d.code=="S_OK"){
						   		CC.alert(Lang.Addr.index_movContactSuccess);
						   		
								AL.freshData();								
								AL.resetIndex(); 
								CC.synData(null, "common_addr");
							}
							else{
								CC.alert(Lang.Addr.index_movContactFailure);
							}
				});

		   }
            
			function resetSelect() {
				obj.options[0].selected = "true";
			}
			
		}

		function optCopy(id) {
						
			var v = AddrCom.getCheckedValue(0);
			
			if(v.length>0 && v != null) {
				callBack();
			} else {
				CC.alert(Lang.Addr.index_selectCopyContact);
				resetSelect();
			}
			
			function callBack(){
				
				 if(AddrCom.isCheckedOK(1))
				 {
				
					var data={groupId:id,id:v} ; 
					
					AddrCom.Ajxa(AL.serverUrl,"addr:copy",data,function(d){
								if(d.code=="S_OK"){
							   		CC.alert(Lang.Addr.index_contactCopyToGroup);
									AL.freshData();									
									AL.resetIndex(); 
													
									CC.synData(null, "common_addr");
								}
								else{
									CC.alert(Lang.Addr.index_movContactFailure);
									resetSelect();
								}
					});
					
				
			   	}
			   	else
			   	{
			   		CC.alert(Lang.Addr.cannotCopyContacts);
			   	}
		   }
			
		}

		function optDelSel() {
			function callBack() {
				if(AddrCom.isCheckedOK(0)) {
					
					var v = AddrCom.getCheckedValue(0);
                    var data={id:v} ; 
					
					AddrCom.Ajxa(AL.serverUrl,"addr:deleteUser",data,function(d){
						    if(d.code=="S_OK"){						   		
						   		AL.intCount=-1;						   		
								AL.freshData();
								//AL.loadList();
								AL.resetIndex();
								CC.synData(null, "common_addr");
							}
							else{
								CC.alert(Lang.Addr.index_contactDelFailure);
							}
					});
					
				}
				else
				{
						CC.alert(Lang.Addr.index_onlyDelPersonalAddr);	
				}						
			}

			var v = AddrCom.getCheckedValue(0);

			if(v.length > 0 && v != null) {
				CC.confirm(Lang.Addr.sureDelContact,callBack, Lang.Addr.index_delContact, null, 'delUsers');
			} else {
				CC.alert(Lang.Addr.index_selectContacts, Lang.Addr.index_selectContacts);
			}
		}

		function resetSelect() {
			obj.options[0].selected = "true";
		}

	},
	resetIndex:function(){
		AL.groupCount=[0, 0, 0]; 
		AL.groupIndex =[0, 0, 0]; 
		AL.groupBeforeIndex = [0, 0, 0]; 
		AL.beforeAddrType = 0;
		
			
		$("input[name='addrcheckboxall']").attr("checked",false);
			
	},
	resetCssL:function(){
		$("#addressContent em a").each(function(i){
				$(this).removeClass("addLetterSearch");
		});
	},
	setGroupStyle:function(obj,index,isOver){
			var o = $(obj);
		    var bi = AL.groupBeforeIndex[AL.beforeAddrType];
		    if(index==AL.groupIndex[AL.addrType])
		    {
		        setGroupStyleOver(obj);
		        if(AL.groupIndex[AL.addrType]!=bi)
		        {
		            var bObj = document.getElementById("addr_left_block"+AL.beforeAddrType).childNodes[bi];
		            setGroupStyleOut(bObj);
		        }    
		    }
		    else
		    {    
		        if(isOver){
		            setGroupStyleOver(obj);
		        }else{
		            setGroupStyleOut(obj);
		        }
		    }
		    
		    function setGroupStyleOver(obj){
		    	if(obj){
			        obj.style.backgroundColor = "#FFFFD6";
			        obj.style.borderColor= "#DEDEDE";
		        } 
		    }
		    function setGroupStyleOut(obj){
		    	if(obj){
			        obj.style.backgroundColor = "#FFFFFF";
			        obj.style.borderColor= "#FFFFFF";
		       }
		    }
	},
	setTrStyle:function(obj,isOver){
		if(isOver){
        	$(obj).css("background-color","#FFFDD7");
	    }else{
	        $(obj).css("background-color","#FFFFFF");
	    }  
	},
	resetCssCPS:function(){
		document.getElementById("20").className = "";
		document.getElementById("50").className = "";
		document.getElementById("100").className = "";
	},
	changeCount:function(num){
		
		var t=$("#addr_title_leftDiv strong").last().html();
		var c="["+num+"]";
		if(c!=t)
		{
			$("#addr_title_leftDiv strong").last().html(c);
		}
	}
}

$(window).bind("resize", function() {
	AL.setHeight(2);
	AL.setWidth();
});


function ReFresh_P(){
	AL.intCount=-1;
	AL.freshData();	
} 

