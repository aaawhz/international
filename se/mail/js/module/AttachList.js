/***
 * 附件管理
 */
function AttachList(){

}
function goReadMail(mid,name,fid,sendDate,from,subject)
	{
		 var mi ={mid:mid,fid:fid,flags:{},from:from,subject:subject,sendDate:sendDate};
		 var parm ={fid:fid,markRead:1,encode:1,isAttach:1};
		CC.goReadMail(mid,name,parm,mi);
}
 function enableDownload(id,obj,checkid)
 {
	//document.getElementById("divDownload"+id).style.display="none"; 
	if(!$(checkid).checked)
		obj.className = "";
}
function showDownload(id,obj,checkid)
{
	//document.getElementById("divDownload"+id).style.display="block";
	if(!$(checkid).checked)
        obj.className = "overColor";
}
/***
 * 附件查看管理类
 */
AttachList.prototype = {
    initialize: function(){
        var od		    = MM[gConst.attachList],
			lock_pass	= "";
			
        od.needRequest = true;        
        od.start = 0;
        od.bOrder = "receiveDate";//上次排序
        od.order = "receiveDate";//排序
        od.orderField = ["receiveDate", "attachSize", "subject", "name", "attachSuffix"];
        od.attachTypeName = {
            "1": Lang.Mail.ConfigJs.iamge,
            "2": Lang.Mail.ConfigJs.media,
            "3": Lang.Mail.ConfigJs.doc,
            "0": Lang.Mail.ConfigJs.other
        };
        od.attachDateType = {
            date1: Lang.Mail.ConfigJs.Oneweek,
            date2: Lang.Mail.ConfigJs.OneMonth,
            date3: Lang.Mail.ConfigJs.threeMonth,
            date4: Lang.Mail.ConfigJs.halfayear
        };
        od.isSearch = 1;
        od.desc = 1;
        od.total = 30;
        od.filter = {};        
        od.pageCurrent = 0;
        od.pageCount = 0;
		od.fid = 0;
        od.showRowCount = 6; //默认行数
        od.call = function(){
        };
		od.seachDate='date1';
		od.data = {
            start: od.start,
            total: od.total,
            order: od.order,
            isSearch: od.isSearch,
            stat: 1,
			fid: od.fid,
            desc: od.desc
        };//MM默认初始化数据使用

		lock_pass	= folderlock.lock_pass;
		
		//如果有安全锁密码，则上传安全锁密码
		if(lock_pass){
			od.data.folderPass = lock_pass;
			//gMain.lock_close = false; 	
		}
        
		if(gMain.IsAttachSearch){
			od.data.filter = {"attachName":gMain.IsAttachSearch};	
				
		}
		
		od.func = gConst.func.attachList;		
        od.name = gConst.attachList;//标识
        GMC.initialize(od.name, this);	
    },
    
    /***
     * 构造附件管理页面
     */
    getHtml: function(){
		
        var html = [];
        var p1 = this;		
        var o = p1.name;
        var om = CM[o];        
        p1.count = om.total;
        var orderField = p1.orderField;
		p1.filter.attachName  = p1.filter.attachName || gMain.IsAttachSearch;
        var sortArr = [];
        var sortIcon = (p1.desc ? "desc" : "asc");
        // 0:接收日期，1:附件大小，2:邮件主题，3:附件名称，4:附件后缀名
        for (var ic = 0; ic < orderField.length; ic++) {
            if (p1.order == GE.list.orderField[ic]) {
                sortArr[ic] = '<i id="' + gConst.listAttachSortIcon + orderField[ic] + '" class="' + sortIcon + '"></i>';
            }
            else {
                sortArr[ic] = '<i id="' + gConst.listAttachSortIcon + orderField[ic] + '"></i>';
            }
        }        
        //外层Div
        html.push("<div id='{0}' style='overflow-y:scroll;overflow-x:hidden;'><div id=\"adjManage\">".format(gConst.listMailId + o));
        //列表Div
        html.push("<div id='attachlist_wrapper' class=\"wrapper\">");
		
		
        html.push("<div id='attachlist_container' class=\"container\">");
		
        //分页Div
		
		
		var keyStr = this.filter.attachName;
		var titleStr = "";
		if(keyStr) titleStr = "&nbsp;&gt;&gt;&nbsp;"+Lang.Mail.SearchKeyAndCount+keyStr;		
		html.push("<div class='' style=' height:30px; line-height:30px;'><h5 class='pl_10'><strong onclick='CC.goAttachList();return false;' class='hoverUnderline'  style='cursor:pointer;'>"+Lang.Mail.ConfigJs.allAttach+"</strong><span id='attachList_title'>"+titleStr+"</span><span> ("+Lang.Mail.ConfigJs.total.format("<em id='attachList_AllCount' style='color:#D30009;'>"+CM[o].total+"</em>")+")</span></h5></div>");
	    html.push("<div class='top_compose m_clearfix' style=''><ul class='pt_5 pl_5 fl'><li><a class=\"n_btn mr_5\" href=\"javascript:fGoto();\"  onclick=\"MM['"+o+"'].sendMail();\"><span><span>"+Lang.Mail.ConfigJs.fwmail+"</span></span></a></li></ul><div style='float:right; margin:7px 10px 0 0;' class=\"pager\" id='"+gConst.listTopPageId + o+"' >");
        html.push(p1.getPagerHtml());
        html.push("</div>");
        html.push("</div>");
        //列表开始
        html.push("<div class=\"list \" id=\"{0}\">".format(gConst.listBodyId + o));
        html.push(p1.getListData());
        html.push("</div>");
        //分页
        html.push("<div class='btm_pager' {1}><div class=\"fr attr_pager pt_7\"id=\"{0}\">".format(gConst.listFootPageId + o,p1.count >0 ? "" : "style='display:none;'"));
        html.push(p1.getPagerHtml());
        html.push("</div>");
        html.push("</div>");
        html.push("</div>");
        html.push("</div>");
        //列表Div结束		
        
        //左分类Div
        html.push("<div class=\"sider\" id=\"sider\">");
		html.push("<div class=\"j_search j_search_margin\"><i class=\"j_search_d\"></i>");
		html.push("<input style='width:165px;' value=\""+Lang.Mail.ConfigJs.AttachList_SeachKey+"\" type=\"txt\" id='searchKey' onclick=\"MM['{0}'].searchTextOnClick(this)\" onblur=\"MM['{0}'].searchTextOnblur(this)\" onkeyup=\"MM['{0}'].searchTextOnKeyUp()\" class=\"j_search_txt fl\" />".format(o));
		html.push("<input type=\"button\" id=\"btnSearch\" onclick=\"MM['{0}'].getFilter('attachName');\" class=\"j_search_btn fr\"  style=\"width:27px;\" /> </div>".format(o));
  
        //html.push("<div class=\"search\"><INPUT  style=\"COLOR: #666\" value=''><A href=\"javascript:fGoto();\"  class=\"btnSubmit\" ></A><I></I></div>".format(o));
        html.push("<dl id=\"searchType\" class=\"classly_search mt5\">");
		html.push(p1.getAttachTypeHtml());
        html.push("</dl>");
        html.push("</div>");
        html.push("</div></div>");
        return html.join("");
    },
	/***
	 * 获取左侧分类查找
	 * @param {Object} type
	 */
	getAttachTypeHtml:function(type){
		var p1 = this;
		var o = this.name;
        var om = CM[o]; 
		var statData = om["stat"];
		var html = [];	
		p1.typeDataList = {"attachType":[],"from":[],"fid":[],"recvTime":[]};//行数据HTML
        html.push("<dt style='font-size:15px;' id='searchTitle'>"+Lang.Mail.ConfigJs.typeSeach +"(<em id='attachList_ClassCount'>"+CM[o].total+"</em>)</dt>");
        html.push('<DD><ul id="filtersResult"></ul></DD>');
        html.push("<dt id='filter_attachType' class='colE0E4F6'>"+Lang.Mail.ConfigJs.fileTypeSeach +"</dt>");
        html.push("<dd id='filter__content_attachType'>");
        html.push("<ul>");
        for (var n in p1.attachTypeName) {        	
            p1.typeDataList["attachType"].push('<li><a href="javascript:fGoto();" onclick="MM[\'{0}\'].getFilter(\'attachType\',\'{1}\',\'{2}\');">{2}<span>({3})</span></a></li>'.format(o, n, p1.attachTypeName[n], statData.attachType[n]));
        }
        html.push(p1.getDefultRowHTML("attachType"));
        html.push("</ul>");
        html.push("</dd>");
        html.push("<dt id='filter_from' class='colE0E4F6'>"+Lang.Mail.ConfigJs.sender+"</dt>");
        html.push("<dd id='filter__content_from'>");
        html.push("<ul>");
        var fromCount = 0;
        for (var f in statData.from) {
            //if (fromCount < 5) {
				try {
					if (statData.from[f] == 0) 
						continue;
				}catch(e){}
                var emailName = (Email.getName(f) || f).left(20, true);
                var emailVaue = (Email.getValue(f) || f).replace(/['"]/g, "");
               	var temp = '<li><a title="{1}" onclick="MM[\'{0}\'].getFilter(\'from\',\'{1}\',\'{2}\');" href="javascript:fGoto();">{2}<span>({3})</span></a></li>'.format(o, emailVaue, emailName, statData.from[f]);
               	p1.typeDataList["from"].push(temp);
                //html.push(temp);
            //}
            //fromCount++;
        }
        html.push(p1.getDefultRowHTML("from"));
		/*
if(fromCount>=5){
			html.push("<li><A onclick=MM['{0}'].showMoreFrom() href=\"javascript:fGoto();\" >{1}</A></li>".format(gConst.attachList,Lang.Mail.ConfigJs.Lookmore));
		}
*/
        html.push("</ul>");
        html.push("</dd>");
        
        html.push("<dt id='filter_fid' class='colE0E4F6'>"+Lang.Mail.ConfigJs.folderSeach+"</dt>");
        html.push("<dd id='filter__content_fid'>");
        html.push("<ul>");
		
		var tempFids = [];
		for (var j in statData.fid){
			tempFids.push(j-0);
		}
		tempFids = tempFids.sort(function(a,b){return a-b;});
        for (var i=0; i < tempFids.length;i++) {
			var j = tempFids[i]+"";
            var fo = MM.getModuleByFid(j);
            if (fo) {
                p1.typeDataList["fid"].push('<li><a onclick="MM[\'{0}\'].getFilter(\'fid\',\'{1}\',\'{2}\')" href="javascript:fGoto();" >{2}<span>({3})</span></a></li>'.format(o, j, MM[fo].text, statData.fid[j]));
            }
        }
        html.push(p1.getDefultRowHTML("fid"));
        html.push("</ul>");
        html.push("</dd>");
        html.push("<dt id='filter_recvTime' class='colE0E4F6'>"+Lang.Mail.ConfigJs.dateRange+"</dt>");
        html.push("<dd id='filter__content_recvTime'>");
        html.push("<ul>");
        for (var d in p1.attachDateType) {
            p1.typeDataList["recvTime"].push('<li><a onclick="MM[\'{0}\'].getFilter(\'recvTime\',\'{1}\',\'{2}\')" href="javascript:fGoto();" >{2}<span>({3})</span></a></li>'.format(o, d, p1.attachDateType[d], statData.receiveDate[d]));
        }
        html.push(p1.getDefultRowHTML("recvTime"));
        html.push("</ul>");
        html.push("</dd>");
        html.push("<dt id='filter_read' class='colE0E4F6'>"+Lang.Mail.ConfigJs.readORnoread+"</dt>");
        html.push("<dd id='filter__content_read'>");
        html.push("<ul>");
        html.push('<li><A onclick="MM[\'{0}\'].getFilter(\'read\',1,\'{2}\')" href="javascript:fGoto();" >{2} <span>({1})</span></a></li>'.format(o, statData.read[1],Lang.Mail.ConfigJs.notReadMail));
        html.push('<li><A onclick="MM[\'{0}\'].getFilter(\'read\',0,\'{2}\')" href="javascript:fGoto();" >{2} <span>({1})</span></a></li>'.format(o, statData.read[0],Lang.Mail.ConfigJs.readMail));
        html.push("</ul>");
        html.push("</dd>");
        
		return html.join("");		
	},
	getDefultRowHTML:function(type){
		var p = this;
		var list = p.typeDataList[type];
		if(!list && list.length == 0) return "";
		
		var rel=[];
		if(list.length > p.showRowCount)
		{
			for (var i=0; i < p.showRowCount; i++) {
			  rel.push(list[i]);
			};
			rel.push("<li><strong onclick=MM['{0}'].showMore('{2}') style='color:5A759E;cursor:pointer;' class='attachList_moreType' href=\"javascript:fGoto();\" >{1}</strong></li>".format(gConst.attachList,Lang.Mail.ConfigJs.Lookmore,type));
			return rel.join("");
		}
		else{
			return list.join("");
		}
	},
	/**
	 * 得到网盘文件列表
	 */
	showNDFSelector : function(mid,attachOffset,attachSize,index){
		var str = "",
			dd  = "";
		
		if(CM[top.gConst.readMail + mid]){
		    dd = CM[top.gConst.readMail + mid]['var'], attachName = '';
			if(dd && dd.attachments && dd.attachments.length){
				attachName = dd.attachments[index].fileName;
			}
		
		}else{
			if( CM["attachList"] &&  CM["attachList"]["var"] && CM["attachList"]["var"][index]){
				attachName = CM["attachList"]["var"][index].attachName;
			}
			
		}
		
		if(window.gMain && gMain.rmSvr){
						
		}else{
			str = window.location.href;
			str = str.split(':')[0] + '://' + str.split('/')[2];
		}
		
		var attachUrl= str+ CC.getDownloadLink(mid, attachOffset, attachSize, attachName,'attach',1,"1");
		var o = {
			attachUrl:attachUrl.encodeHTML(),
			fileSize: attachSize,
			attachName:attachName.encodeHTML()
		};
		
		var fSelector = new NDFileSelector(o);
		
	
		
	},
	showDefult:function(type){
		var p=this;
		var html = [];
		html.push("<ul>");
		html.push(p.getDefultRowHTML(type));
		html.push("</ul>");
		$("filter__content_"+type).innerHTML = html.join("");
	},
	/***
	 * 显示更多列表信息
	 */
	showMore:function(type){
		var p1 = this;
		var o = this.name;
        //var om = CM[o]; 
		//var statData = om["stat"];
		var html = [];
		var list = p1.typeDataList[type];
		html.push("<ul>");
		for (var i=0; i < list.length; i++) {
		  	html.push(list[i]);		  
		};
		//mcount = mcount||statData.from.length;
       // var fromCount = 0;
        //for (var f in statData.from) {			
		//	if(mcount && fromCount>=mcount){
		//		break;
		//	}
       //     var emailName = (Email.getName(f) || f).left(20, true);
        //    var emailVaue = (Email.getValue(f) || f).replace(/['"]/g, "");
        //    html.push('<li><a title="{1}" onclick="MM[\'{0}\'].getFilter(\'from\',\'{1}\',\'{2}\');" href="javascript:fGoto();">{2}</a><span>({3})</span></li>'.format(o, emailVaue, emailName, statData.from[f]));          
        //    fromCount++;
        //}
		//if(fromCount<=5){
		//	html.push("<li><A onclick=MM['{0}'].showMoreFrom() href=\"javascript:fGoto();\" >{1}</A></li>".format(gConst.attachList,Lang.Mail.ConfigJs.Lookmore));
		//}else{
		//	html.push("<li><A onclick=MM['{0}'].showMoreFrom(5) href=\"javascript:fGoto();\" >{1}</A></li>".format(gConst.attachList,Lang.Mail.ConfigJs.showpart));
		//}
		html.push("<li><strong onclick=MM['{0}'].showDefult('{2}') style='color:5A759E;cursor:pointer;' class='attachList_moreType' href=\"javascript:fGoto();\" >{1}</strong></li>".format(gConst.attachList,Lang.Mail.ConfigJs.showpart,type));
        html.push("</ul>");
		
		$("filter__content_"+type).innerHTML = html.join("");
	},
    /***
     * 获取附件管理列表数据组装HTML
     */
    getListData: function(){		
        /***
         * 获取文件的图标
         * @param {Object} filename 文件名
         */
        /*
var attachIco = function(filename){
            filename = filename.toLowerCase();
            var ico = "other";
            var icoClass = ["other", "tif", "txt", "psd", "rar", "zip", "xml", "html", "java", "fon", "jpg", "gif", "png", "bmp", "tiff", "mpeg", "avi", "wmv", "mov", "mpg", "vob", "rmvb", "mp3", "wma", "wav", "asf", "mp4", "sis", "sisx", "cab", "doc", "docx", "pdf", "xls", "xlsx", "ppt", "pptx", "swf", "fla", "share", "folder", "mp3-hover", "upload", "i-hand", "flv", "folder-m", "folder-p", "exe", "css", "rm", "midi", "chm", "iso", "vsd", "no-load"];
            for (var i = 0; i < icoClass.length; i++) {
                if (filename.indexOf(icoClass[i]) >= 0) {
                    ico = icoClass[i];
                    break;
                }
            }
            return ico;
        };
*/
		var p = this;
        var html = [];
        var o = this.name;
        var om = CM[o];
        var listData = om["var"];
        this.count = om.total;	
			
      
        html.push("<table class='enclosure_table'>");
        html.push("<thead><tr>");
		var sortIcon = (this.desc ? "desc" : "asc");    
		
        html.push("<th class=\"jnotice_border_r\" style='width:25px;text-align:center'><input type='checkbox' id='{0}_AllChecked' class='fl'  onclick=\"MM['{1}'].checkedBoxAll(this);\"/></th>".format(gConst.checkBoxName,o));
        html.push("<th class=\"jnotice_border_r\" colspan='2' ><a title='"+Lang.Mail.ConfigJs.Click_to_sort+"' href=\"#\" onclick=\"MM['"+gConst.attachList+"'].sortList('name')\"><em style='display: inline-block; width: 14px;'></em>"+Lang.Mail.ConfigJs.fileName+"</a><i id='listMailSortIcon_name' class='"+(this.order=="name"?sortIcon:"")+"'></i></th>");
        html.push("<th class=\"time\" style='width:253px'><a title='"+Lang.Mail.ConfigJs.Click_to_sort+"' href=\"#\" onclick=\"MM['"+gConst.attachList+"'].sortList('receiveDate')\">"+Lang.Mail.ConfigJs.date+"</a><i id='listMailSortIcon_receiveDate' class='"+(this.order=="receiveDate"?sortIcon:"")+"'></i></th>");
        html.push("<th class=\"size\" style='width:170px;border-right:medium none;'><a title='"+Lang.Mail.ConfigJs.Click_to_sort+"' href=\"#\" onclick=\"MM['"+gConst.attachList+"'].sortList('attachSize')\">"+Lang.Mail.ConfigJs.size+"</a><i id='listMailSortIcon_attachSize' class='"+(this.order=="attachSize"?sortIcon:"")+"'></i></th>");
        html.push("</tr></thead></table> <table class='filezz_con'>");
        //列表内容
        if (listData.length > 0) {
            for (var i = 0; i < listData.length; i++) {
                var item = listData[i];
                var tos = item.tos;
                var strDate = Util.formatDate( new Date(item.receiveDate*1000));
				//html.push("<tr id='"+o+"_Tr_"+i+"' >");
				html.push("<tr onmouseover=showDownload('"+i+"',this,'"+gConst.checkBoxName+"_"+o+"_"+i+"')  onMouseOut=enableDownload('"+i+"',this,'"+gConst.checkBoxName+"_"+o+"_"+i+"') id='"+o+"_Tr_"+i+"' >");
                html.push("<td style='width:25px;'>");
				html.push("<input type='checkbox'  name='{0}_{1}' class='fl' value='{2}' id='{0}_{1}_{2}' onclick=\"MM['{1}'].checkOneClick(this);\"/></td>".format(gConst.checkBoxName,o,i));
				html.push("<td><div><i class=\"big_{0} fl\"></i><div>".format(Util.getFileExtensionCss(item.attachName)));//类型  <i class=\"txt\"></i>
				var attachName  =  item.attachName.encodeHTML();
				var key = this.filter.attachName;
				if (key) 
				{
					var regKey = key.replace(".","\\.");
					attachName =attachName.replace(new RegExp(regKey,"gmi"),"<span style='background-color:Gold;padding-left:2px;padding-right:2px;'>"+key+"</span>");
				}            
				html.push("<p title='"+item.attachName.encodeHTML()+"'>"+attachName+"</p>"+"");	
				html.push("<p id='divDownload"+i+"'>");
				if (GC.check('CENTER_PREVIEW') && parseInt(parent.gMain.attachPreivewMaxSize) >= item.attachRealSize) {
					var oAttacheType = CC.getAttachType(item.attachName, item.attachSize) ||
					{
						isView: false,
						type: ''
					};
					if (oAttacheType.isView) {
						//附件预览
						var link = CC.getDownloadLink(item.mid, item.attachOffset, item.attachSize, item.attachName, 'attach', 1);
						if (link.indexOf("http") != 0) {
							link = location.protocol + "//" + location.host + link;
						}
						var vLink = CC.getViewLink(gMain.webPath || 'http://view.se139.com', 'cmail', gMain.sid, link, gMain.userNumber, item.attachName, item.attachRealSize, gMain.mailId, item.mid+item.attachOffset, 0)+"&attachManage=1";
						if (oAttacheType.type == "image") {
							viewLink = '<a href="javascript:void(0)" class="mr_15" onclick=CC.previewImg("'+encodeURIComponent(item.attachName)+'","'+encodeURIComponent(link)+'") >' +  Lang.Mail.readMail_lb_viewAttach + '</a>';
							html.push(viewLink);
						}
						else {
							viewLink = "<a target=\"_blank\" class=\"mr_15\" title='"+(oAttacheType.type == 'zip' ? Lang.Mail.open : Lang.Mail.readMail_lb_viewAttach)+"' href=\"" + vLink + "\" {0} >" + (oAttacheType.type == 'zip' ? Lang.Mail.open : Lang.Mail.readMail_lb_viewAttach) + "</a>";
							html.push(viewLink);
						}
						//下载
						html.push("<a href='javascript:fGoto();' target='_blank' class='mr_15' title='"+Lang.Mail.ConfigJs.download+"' onclick=\"javascript:MM['"+o+"'].download("+i+");return false;\">"+Lang.Mail.ConfigJs.download+"</a>");
					} else {
						//下载
						html.push("<a href='javascript:fGoto();' target='_blank' class='mr_15' title='"+Lang.Mail.ConfigJs.download+"' onclick=\"javascript:MM['"+o+"'].download("+i+");return false;\">"+Lang.Mail.ConfigJs.download+"</a>");					
					}
				}
				
				//转发
				html.push("<a href=\"javascript:fGoto();\" class='mr_15' title='{7}'  onclick='MM[\"{0}\"].singSendMail({1},\"{2}\",\"{3}\",\"{4}\",\"{5}\",\"{6}\");'>{7}</a>".format(o,item.fid,item.mid,item.attachName.encodeHTML(),item.attachSize,item.attachRealSize,item.attachOffset,Lang.Mail.ConfigJs.fwmail));
				//查看邮件
				html.push("<a href='javascript:fGoto();' class='mr_15' title='{0}' onclick=\"goReadMail('{2}','{1}','{3}','{4}','{5}','{1}');\">{0}</a>".format((Lang.Mail.ConfigJs.open_mail),item.subject.encodeHTML(),item.mid,item.fid,item.sendDate,item.from.encodeHTML()));
				
				//保存到网盘
				if (GC.check('DISK')) {
					html.push("<a href='javascript:fGoto();' class='mr_15' ");
					html.push("title='"+Lang.Mail.saveDisk+"'"); //'保存到网盘'
					html.push("onclick=\"javascript:MM['" + o + "'].showNDFSelector('" + item.mid + "', '" + item.attachOffset + "', '" + item.attachSize + "', '" + i + "');return false;\">");
					html.push(Lang.Mail.saveDisk+"</a>"); //保存到网盘
				}
				html.push("</p></div></div></td>");//文件名               
                //html.push(("<td><div class=\"info\"><a href=\"javascript:fGoto();\" onclick=\"goReadMail('{2}','{1}','{3}','{4}','{5}','{1}')\">{0}</a></div><div class=\"info\"><a href=\"javascript:fGoto();\" onclick=\"goReadMail('{2}','{1}','{3}','{4}','{5}','{1}')\">{1}</a></div></td>").format(item.from.encodeHTML(), item.subject.encodeHTML(),item.mid,item.fid,item.sendDate,item.from.encodeHTML()));//所属邮件				
                html.push('<td class="time" style="width:253px">' + strDate + '</td>'); //时间
                html.push('<td class="size" style="width:170px;">' + Util.formatSize(item.attachRealSize, null, 2) + '</td>'); //大小                
                html.push('</tr>');
            }
        }
        else {
			html.push('<tr><td colspan="5"><p class="set_rule_box_tips" style="display:block;margin-bottom: 12px;">');
			if (this.filter.attachName) {
				 html.push(Lang.Mail.NotSearchData);
			}
			else {
				html.push(Lang.Mail.ConfigJs.notAttach);				
			}
			html.push('</p></td></tr>');
        }
        html.push("</table>");
		
		gMain.IsAttachSearch='';
        return html.join("");
    },
	checkedBoxAll : function(all){
		var o = this.name;
		//$()
		var checkList = document.getElementsByName('{0}_{1}'.format(gConst.checkBoxName,o));
		for(var i =0;i <checkList.length;i++){
			checkList[i].checked = all.checked;
			if(checkList[i].checked){
				$(o+"_Tr_"+checkList[i].value).className = "overColor";
			}
			else{
				$(o+"_Tr_"+checkList[i].value).className = "";
			}
		}
	},
    checkOneClick : function(obj){
		var o = this.name;
		var checkList = document.getElementsByName('{0}_{1}'.format(gConst.checkBoxName,o));
		var checkedCount = 0;
		for (var i = 0; i < checkList.length; i++) {
			if(checkList[i].checked){
				checkedCount++;	
			}
		}
		var allChecked = $("{0}_AllChecked".format(gConst.checkBoxName));
		if(checkedCount != 0 && checkedCount == checkList.length){
			allChecked.checked = true;
		}else{
			allChecked.checked = false;
		}
		
		var tempTr = $(o+"_Tr_"+obj.value);
		if(obj.checked){
			tempTr.className = "overColor";
		}
		
	},
    /***
     * 获取分页HTML
     */
    getPagerHtml: function(){
        var p1 = this;
        var o = p1.name;
        var count = p1.count;
        var newMailCount = 0;
        p1.pageCount = Math.ceil(count / p1.total);
        p1.pageCurrent = (p1.start / p1.total) || 0;
        
        var html = [];
        var iPageCount = p1.pageCount;
        var iPage = Math.max(p1.pageCurrent, 0);
		if(iPageCount<2)
		{
			return "";
		}
        //if (iPageCount > 1) {
        //var pageSizeObj = [10, 20, 50, 100];
        //html.push(Lang.Mail.ConfigJs.show);
        //html.push('<SELECT style="display:none" id=select_page_size onchange="var nValue=this.value;MM[\'' + o + '\'].setPageSize(nValue);">');
        //for (var i = 0; i < pageSizeObj.length; i++) {
        //    if (p1.total == pageSizeObj[i]) {
        //        html.push("<option value={0} selected>{0}</option>".format(pageSizeObj[i]));
        //    }
        //    else {
        //        html.push("<option value={0}>{0}</option>".format(pageSizeObj[i]));
        //    }
        //}
        //html.push('</SELECT>');
        if (iPage > 0) {
            html.push('<a href="javascript:fGoto();" onClick="MM[\'' + o + '\'].goPage(0);return false;">' + Lang.Mail.list_FirstPage + '</a>');
            html.push(' <a href="javascript:fGoto();" onClick="MM[\'' + o + '\'].goPage(' + (iPage - 1) + ');return false;">' + Lang.Mail.list_PrevPage + '</a>');
        }
        if (iPage > 0 && iPageCount > iPage + 1) {
            html[html.length] = ' ';
        }
        if (iPageCount > iPage + 1) {
            html.push('<a href="javascript:fGoto();" onClick="MM[\'' + o + '\'].goPage(' + (iPage + 1) + ');return false;">' + Lang.Mail.list_NextPage + '</a>');
            html.push(' <a href="javascript:fGoto();" onClick="MM[\'' + o + '\'].goPage(' + (iPageCount - 1) + ');return false;">' + Lang.Mail.list_LastPage + '</a>');
        }
        html.push(' <select id="select_page_' + o + '" name="select_page_' + o + '" onchange="var nValue=this.selectedIndex;MM[\'' + o + '\'].goPage(nValue);">');
        for (var i = 0; i < iPageCount; i++) {
            var sSelected = (iPage == i) ? " selected" : "";
            html.push('<option value="' + (i) + '"' + sSelected + '>' + (i + 1) + ' / ' + iPageCount + '</option>');
        }
        if (iPageCount == 0) {
            html.push('<option value="1">1 / 1</option>');
        }
        html.push('</select>');
        //}
        return html.join("");
    },    
    /***
     * 获取请求数据
     * @param {Object} isinit
     */
    getListRequest: function(isinit,isGotoPage){
        var p1 = this;
        var name = p1.name;
        var data = {};
        var limit = p1.limit;
        if (isinit) {
            data = {
                start: 0,
                total: 20,
                order: "receiveDate",
                isSearch: 0,
                stat: 1,
                desc: 1,
				fid:p1.filter["fid"]
            };
        }
        else {
            data = {
               start: (p1.start==0?p1.start:p1.start+1),
                total: p1.total,
                order: p1.order,
                isSearch: isGotoPage == true ? 0 : 1,
                stat: 1,//返回统计信息
                desc: p1.desc,
				fid:p1.filter["fid"],
                filter: p1.filter
            };
        }
		//同步初始化的数据data
		p1.data.isSearch = data.isSearch;
        return data;
    }, 
	searchTextOnClick : function(obj){
		var msg = Lang.Mail.ConfigJs.AttachList_SeachKey; //"请输入搜索关键字";
		if(obj.value == msg){
			obj.value="";
		}
		jQuery(obj).attr("style","color: black;width:165px;");
		
	},
	searchTextOnblur : function(obj){
		var msg = Lang.Mail.ConfigJs.AttachList_SeachKey;
		if(obj.value  == "")
        {
            jQuery(obj).removeAttr("style","color: black;");
            obj.value = msg;
        }
	},
	searchTextOnKeyUp : function(e){
		var btn = document.getElementById("btnSearch");
        var ev = EV.getEvent(e);
        if (EV.getCharCode() == 13) {
            btn.onclick();
        }
	},	
    /***
     * 加载附件列表
     * 直接请求加载，用于分页，排序，分类检索
     * @param {Object} obj
     */
    loadAttachList: function(obj){
        var p1 = this;
        var o = p1.name;
        var func = p1.func;
        var cb = obj.call;
        if (!obj) {
            return;
        }
        var callBack = function(au){
            p1.freshData(au);
            if (typeof(cb) == "function") {
                cb();
            } 
        };
        var data = {
            func: func,
            data: obj.data,
            call: callBack,
            msg: obj.msg
        };
        MM.mailRequest(data);
    },
    /**
     * 刷新列表数据
     * @param {Object} data Ajax返回的数据
     */
    freshData: function(data){
        var p1 = this;
        var o = p1.name;
        var au = data || {};
		this.count =data.total;
		document.getElementById("attachList_AllCount").innerHTML=data.total;
        if (au.code == gConst.statusOk) {
            CM[o] = au;
			var listBody = 	$(gConst.listBodyId + o);//附件列表Dom对象
			var listTopPager = $(gConst.listTopPageId+o);//头部分页Dom对象
			var listFootPager = $(gConst.listFootPageId+o);//底部分页Dom对象
			var leftTypeList = $("searchType");//左边分类Dom对象
			var html_pager = p1.getPagerHtml();//分页
            if (listBody) {//附件列表
                listBody.innerHTML = p1.getListData();
            }            
            if (listTopPager) {
                listTopPager.innerHTML = html_pager;
            }
            if (listFootPager) {
                listFootPager.innerHTML = html_pager;
            }
			if(leftTypeList){
				leftTypeList.innerHTML = p1.getAttachTypeHtml();
			}
			//alert(2)
			
			var o = p1.name;			        
			for(var n in p1.filter){
				var v = p1.filter[n];
				var t = '';
				switch(n){
					case "attachType":
						t = p1.attachTypeName[v];
						break;
					case "from":
						t = (Email.getName(v) || v).left(20, true);
						break;
					case "fid":
						t = MM[MM.getModuleByFid(v)].text;
						break;
					//case "receiveDate":
					case "recvTime":
						t = p1.attachDateType[p1.seachDate];
						break;
					case "read":
                    	t = v == 1 ? Lang.Mail.ConfigJs.notReadMail : Lang.Mail.ConfigJs.readMail;
						break;
				}
				if (t) {
					try {
						var fr = $("filtersResult");
						var a = El.createElement("div", "filtersSelected_" + n);
						a.innerHTML = '<span class="filtersResult"><span class="afTypeName">{0}</span> <a onclick="MM[\'{1}\'].getFilter(\'{2}\',\'\',null,true)" class="enclosure-cancle" href="javascript:fGoto();">{3}</a> </span>  '.format(t, o, n, Lang.Mail.ConfigJs.cancel);
						fr.appendChild(a);
						$("filter_" + n).style.display = "none";
						$("filter__content_" + n).style.display = "none";
					}catch(e){}
				}
			}
        }
    },
    /**
     * 附件过滤条件
     * @param {Object} n 过滤类型
     * @param {Object} v 过滤值
     * @param {Object} t 显示名称
     <object name="filter">
     <string name="attachType">doc</string>
     <string name="attachName">test</string>
     <object name="recvTime">
     <int name="startTime"></int>
     <int name="endTime"></int>
     </object>
     </object>
     */
    getFilter: function(n, v, t, isDel){
        var p = this;
        var o = p.name;
        t = t || "";	
        var fr = $("filtersResult");
       
        if (isDel) {
            delete p.filter[n];
            /*
			El.remove($("filtersSelected_" + n));
            $("filter_" + n).style.display = "";
            $("filter__content_" + n).style.display = "";
            */
        }
        else {
            if (n == 'attachName' && !v) {
                v = $("searchKey").value.trim() == Lang.Mail.ConfigJs.AttachList_SeachKey ? "" : $("searchKey").value.trim();
                p.filter[n] = v;
            }
            else {
                if (n == "recvTime") {
                    p.filter["recvTime"] = p.getFilterTime(v);
					p.seachDate=v;
                }
                else 
                    if (n == "attachSize") {
                    //p.filter
                    }
                    else {
                        p.filter[n] = v;
                    }
				/*
                var a = El.createElement("div", "filtersSelected_" + n);
                a.innerHTML = '<span>{0}</span>  <a onclick="MM[\'{1}\'].getFilter(\'{2}\',\'\',null,true)" href="javascript:fGoto();">取消</a>'.format(t, o, n);
                fr.appendChild(a);
                $("filter_" + n).style.display = "none";
                $("filter__content_" + n).style.display = "none";
                */
            }
        }
		
		 
		//if(n == 'attachName'  && v){
			var val = $("searchKey").value.trim() == Lang.Mail.ConfigJs.AttachList_SeachKey ? "" : $("searchKey").value.trim();;
			if (n == 'attachName' && v) val=v; 
			if(val){
				var html ="&nbsp;&gt;&gt;&nbsp;"+Lang.Mail.SearchKeyAndCount;		
				$("attachList_title").innerHTML = html + val.encodeHTML();
			}
			else{
				$("attachList_title").innerHTML = "";
			}		
		//}
        var obj = {
            msg: Lang.Mail.list_LoadMailList,
            data: p.getListRequest(),
            func: p.func
        };
		this.start=0;
		obj.data.start=0;
        p.loadAttachList(obj);
    },
    /***
     * 时间过滤
     * @param {Object} v
     */
    getFilterTime: function(v){
        var one = 3600 * 24 * 1000;
        var nowDate = new Date();
        var y = nowDate.getFullYear();
        var m = nowDate.getMonth();
        var d = nowDate.getDate();
		var s =nowDate.getHours();
		var minutes = nowDate.getMinutes();
		var sec = nowDate.getSeconds();
        var endTime = new Date(y, m, d, s, minutes, sec);
        endTime = endTime.getTime();
        var recvTime = {
            startTime: 0,
            endTime: 0
        };
        switch (v) {
            case "date1":
                startTime = endTime - (one * 7);
                break;
            case "date2":
                startTime = endTime - (one * 30);
                break;
            case "date3":
                startTime = endTime - (one * 180);
                break;
            case "date4":
                startTime = endTime - (one * 365);
                break;
        }
        startTime = new Date(startTime);
        var obj = {
            startTime: startTime / 1000,
            endTime: endTime / 1000
        };
        return obj;
    },
    exit: function(){
		this.filter = {};
		this.start=0;		
		MM[gConst.attachList].data.start=0;
        return true;
    },
    /***
     * 查看投递状态
     */
    getDeliverStatus: function(){
        var p1 = this;
        var call = function(ao){
            try {
                CM["deliver"] = ao;
                var html = p1.getDeliverStatusHtml();
                $(gConst.mainBody + GE.folderObj.sent).innerHTML = html;
                p1.setDivHeight();
            } 
            catch (e) {
            
            }
        };
        MM.mailRequest({
            func: gConst.func.deliverStatus,
            data: {
                sort: this.sort,
                start: 0,
                total: 200
            },
            call: call,
            msg: Lang.Menu.Web.kanStatus
        });
    },
    /**
     * 得到当前选中附件的信息
     * @param {Object}
     */
    getSelectAttach: function(){		
        var p = this;
        var o = p.name;
        var listData = CM[o]["var"];
        var data = [];
        try {
            var ak = $(gConst.listBodyId + o).getElementsByTagName("input");
            for (var i = 0, m = ak.length; i < m; i++) {
                var item = ak[i];//name="'+gConst.checkBoxName+'_'+o+'" id="checkbox_' + o + '_' + i+'"
                if (item.type == "checkbox" && item.name == gConst.checkBoxName + '_' + o && item.checked) {
                    var ad = listData[item.value - 0];
                    data.push({
                        mid: ad.mid,
                        offset: ad.attachOffset,
                        size: ad.attachSize,
                        name: ad.attachName,
						fid : ad.fid,
						realSize : ad.attachRealSize						
                    });
                }
            }
            return data;
        } 
        catch (e) {
            return data;
        }
    },
    click: function(aj, bx){
        var p1 = this;
        var o = p1.name;
        var oCb = $('checkbox_' + o + '_all');
        if (aj == "all") {
            p1.setCheckBox($('mailList_' + o), bx, callBackFunc);
            if (!(aj == "all" && bx)) {
                oCb.checked = false;
            }
        }
        function callBackFunc(v, Afd){
            p1.setTrClass(v, Afd);
        }
    },
    singleClick: function(Ady){
        var p1 = this;
        p1.setTrClass(Ady, Ady.checked);
        $('checkbox_' + p1.name + '_all').checked = false;
        //p1.handleShift();
    },
	/**
     * 翻页方法 跳转到指定页
     * @param {Object} n 页码
     */
    goPage: function(n){
        var p1 = this;
        var o = p1.name;
        var pCount = p1.pageCount;
        var pCurrent = p1.pageCurrent;
        
        if (pCurrent != n) {
            n = Math.min(n, pCount - 1);
            n = Math.max(n, 0);
            p1.start = p1.total * n;
            p1.pageCurrent = n;
            //同步初始化的数据data
			p1.data.start = p1.start;
            CC.scrollTop();
            var obj = {
                msg: Lang.Mail.list_LoadMailList,
                data: p1.getListRequest(),
                func: p1.func
            };
            p1.loadAttachList(obj);
        }
        else {
            return false;
        }
    },
    /***
     * 设置每页显示数量
     * @param {Object} size
     */
    setPageSize: function(size){
        var p1 = this;
        p1.total = size;
		//同步初始化的数据data
		p1.data.total = p1.total;
        var obj = {
            msg: Lang.Mail.list_LoadMailList,
            data: p1.getListRequest(),
            func: p1.func
        };
        p1.loadAttachList(obj);
    },
    /***
     * 排序
     * @param {Object} st
     */
    sortList: function(st){
        var p1 = this;
        var o = p1.name;
        
        if (p1.order == st) {
            p1.desc = (1 - p1.desc);
        }
        else {
            p1.order = st;
            p1.desc = (p1.order == GE.list.order) ? 1 : 0;
        }
        p1.start = 0;
        //if (!p1.isSearch) {
        var obj = {
            msg: Lang.Mail.ConfigJs.loadAttachList,
            isUpdate: false,
            data: p1.getListRequest()
        };
        p1.loadAttachList(obj);
        /*}else{
         var sp = MM[gConst.searchMail].data;
         sp.desc = p1.desc;
         sp.order = p1.order;
         CC.searchMail(sp);
         }*/
        //var sortIcon = (p1.desc ? "desc" : "asc");
      //  El.setClass($("listMailSortIcon_" + p1.bOrder), "");
       // El.setClass($("listMailSortIcon_" + p1.order), sortIcon);
        p1.bOrder = p1.order;
    },
    /**
     * 设置checkbox状态
     * @param {Object} v 包含checkbox的div
     * @param {Object} bx true||false
     * @param {Object} wo 回调函数
     */
    setCheckBox: function(v, bx, wo){
        var ak = v.getElementsByTagName("input");
        for (var i = 0, m = ak.length; i < m; i++) {
            if (ak[i].type != "checkbox") {
                continue;
            }
            if (ak[i].checked == bx) {
                continue;
            }
            ak[i].checked = bx;
            if (wo) {
                wo(ak[i], bx);
            }
        }
    },
    setTrClass: function(cb, isOn){
        var p1 = this;
        var up = $(cb.id.replace("checkbox", "tr"));
        if (isOn) {
            El.addClass(up, "on");
        }
        else {
            El.removeClass(up, "on");
        }
    },	
    /***
     * 设置Div高度
     */
    setDivHeight: function(){
        var p1 = this;
        var o = p1.name;
        //得到邮件列表页面总高度(不带工具条)     
        var mh = CC.docHeight() - GE.pos()[1]; //$(gConst.divToolbar + o).offsetHeight;
        //得到邮件列表显示区域高度(不带标题和状态栏)
        var bodyH = $(gConst.listMailId + o).offsetHeight;
        if (mh > bodyH) {
            bodyH = mh;
        }
		/*
var oadj = $("adjManage");
		if(oadj.scrollHeight>oadj.clientHeight ){
			$('attachlist_wrapper').style.marginLeft = '-258px';
			$('attachlist_container').style.marginLeft = '258px';
		}else{
			$('attachlist_wrapper').style.marginLeft = '-240px';
			$('attachlist_container').style.marginLeft = '240px';			
		}		
*/
        /*
         var hh = $(gConst.listHeaderId + o).offsetHeight;
         var rh = $(gConst.listLeftId + o).offsetHeight;
         bodyH = Math.max(mh, bodyH);
         var rhTemp = bodyH - hh;
         rh = Math.max(rh, bodyH);*/
        try {
            El.setStyle($(gConst.listMailId + o), {
                "height": mh + "px"
            });
            /*El.setStyle($("mailListRight_" + o), {
             "height": rh + "px"
             });*/
        } 
        catch (e1) {
        }
    },
    /***
     * 调整Div大小
     */
    resize: function(){
        var p1 = this;
        var o = p1.name;
        var objMailList = $(gConst.listMailId + o);
        //var objMailListRight = $("mailListRight_" + o);
        var mw = CC.docWidth() - GE.pos()[0]; //$(gConst.divToolbar + o).offsetHeight;
        //var rw = objMailListRight.offsetWidth;
        objMailList.style.width ="100%"; //mw + "px";
        p1.setDivHeight();
    },
    /***
     * 下载指定附件
     * @param {Object} i
     */
    download: function(i){
        var p = this;
        var o = p.name;
        var ad = CM[o]["var"][i];
        if (ad) {
            //CC.download(ad.mid, ad.attachOffset, ad.attachSize, ad.attachName);
            //if (jQuery.browser.msie && (jQuery.browser.version == "6.0") && !jQuery.support.style) 
            //	window.open(CC.getDownloadLink(ad.mid, ad.attachOffset, ad.attachSize, ad.attachName,'attach',1));
			//else	
			//window.open(CC.getDownloadLink(ad.mid, ad.attachOffset, ad.attachSize, ad.attachName,'attach',1,"1"));
			location.href= CC.getDownloadLink(ad.mid, ad.attachOffset, ad.attachSize, ad.attachName,'attach',1,"1");
        }        
    },
    /***
     * 打包下载
     */
    downloads: function(){
        var data = this.getSelectAttach();
        CC.downloads(data, Lang.Mail.ConfigJs.zipAttach);
    },
	singSendMail : function(fid,mid,attachName,attachSize,attachRealSize,attachOffset){		 
        //item.fid,item.mid,item.attachName.encodeHTML(),item.attachSize,item.attachRealSize,item.attachOffset
		
		var attachmentInfo = {
			"fileId": mid + "_" + fid,
			"type": "attach",
			"fileName": attachName,
			"fileSize": attachSize,
			"fileOffSet": attachOffset,
			"fileRealSize": attachRealSize,
			"isAttachForward":1
		};		
		var objData = {
			"attachments" : []
		};
		objData.attachments.push(attachmentInfo);
        var arr = [];
        var call = function(ao) {
			try {
				if (window.IsOA == 1) {
					arr.push({
						name: attachName,
						url: "",
						size: attachSize,
						id: fid,
						fileId: fid,
						fileName: attachName,
						fileOffSet: attachOffset,
						fileSize: attachRealSize,
						isAttachForward: 1
					})
				}
				else {
					if (!ao["var"].attachments || ao["var"].attachments.length == 0) {
						CC.alert(Lang.Mail.forbidForward);//"该封邮件禁止转发"
						return;
					}
					arr.push({
						name: attachName,
						url: "",
						size: attachSize,
						id: fid,
						fileId: fid,
						fileName: attachName,
						fileOffSet: attachOffset,
						fileSize: attachRealSize,
						isAttachForward: 1
					})
				}
				window.parent.parent.CC.sendMail('', '', arr, ao["var"].id);
			} catch (e) {
			
			}
		};
		
		MM.mailRequestApi({
			func : gConst.func.forwardAttachs,
			data : objData,
			call : call
		});
		//this.sendMail(data);
	},
	/***
	 * 附件群发
	 */
	sendMail : function(adList) {
		var p = this;
		// var o = p.name;
		var objData = {
			"attachments" : []
		};
		if (!adList) {
			adList = this.getSelectAttach();
		}
		
		if(!adList || adList.length == 0){
			window.parent.parent.CC.alert(Lang.Mail.ConfigJs.AttachList_SeleteAttr);
			return;
		}
		// var attList = [];
		var att=[];
		for ( var i = 0; i < adList.length; i++) {
			var ad = adList[i];
			var attachmentInfo = {
				"fileId" : ad.mid + "_" + ad.fid,
				"type" : "attach",
				"fileName" : ad.name,
				"fileSize" : ad.size,
				"fileOffSet" : ad.offset,
				"fileRealSize" : ad.realSize
			};
			objData.attachments.push(attachmentInfo);
		}

		var call = function(ao) {
			try {
				var adList = MM[gConst.attachList].getSelectAttach();
				var arr = [];
				if (window.IsOA == 0) {
					var attachList = ao["var"].attachments;
					if (!attachList || attachList.length == 0) {
						CC.alert(Lang.Mail.cforbidForward); //"选中邮件禁止转发"
						return;
					}
					for (var i = 0; i < attachList.length; i++) {
						arr.push({
							name: attachList[i].fileName,
							url: "",
							size: attachList[i].fileSize,
							id: attachList[i].fileId,
							fileId: attachList[i].fileId,
							fileName: attachList[i].fileName,
							fileOffSet: "",
							fileSize: attachList[i].fileSize,
							isAttachForward: 1
						})
					}
				}
				else {
					for (var i = 0; i < adList.length; i++) {
						var ad = adList[i];
						arr.push({
							name: ad.name,
							url: "",
							size: ad.size,
							id: ad.fid,
							fileId: ad.fid,
							fileName: ad.name,
							fileOffSet: ad.offset,
							fileSize: ad.realSize,
							isAttachForward: 1
						})
					}
				}
				window.parent.parent.CC.sendMail('', '', arr, ao["var"].id);
			} catch (e) {

			}
		};
		
		MM.mailRequestApi({
			func : gConst.func.forwardAttachs,
			data : objData,
			call : call			
		});

	}
};
