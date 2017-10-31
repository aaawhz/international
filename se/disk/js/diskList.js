/***
 * @description 文件柜列表类
 * @auth wanglei
 */
var diskPower=parent.GC.check("MAIL_VAS_HUB")||true;
var diskList = {
    selectFid: "", //选中的文件或文件夹ID
    curPage: 1, //当前页数
    curPageCount: 1, //总页数
    curDataCount: 0, //当前数据条数
    pageSize: 20,
    orderbyField: "create_time", //排序字段名称
    orderby: "desc", //升序或者降序
    url: "/disk/userdisk.do", //AJAX请求URL
    title: "<a href=\"javascript:void(0);\" onclick=\"diskList.redirectFoderList('1','','{0}')\">{0}</a>", //显示的文件层次关系
    titieIndex: 1, //当前文件夹所处层次等级(第几层)
    fid: "", //当前文件夹ID
    folderName: "", //当前文件夹名称
    folderId: "",
    seachData: null, //查询的筛选条件JSON格式
    isSeach: false, //判断当前列表是否是查询结果列表显示
    seachKey : "",
    parentId: 1, //当前文件夹的父ID
    OperationType: "", //当前操作类型
    downUrl:"download.do",//下载url
    diskType:0,//0、我的网盘，3、暂存柜
    //diskImplType: $("#diskImplType").val(),
    loadFolderListHTML: function(data){
    	var diskImplType = $("#diskImplType").val();
        var html = [];
		var key = (diskList.seachData && diskList.seachData.key) ? diskList.seachData.key : "";
        if (data.code == "S_OK") {
            $("#selectAll").attr("checked", false);
            var folderList = data["var"].resultList;
			diskList.curDataCount = folderList.length;
            var reg = /&#39;/g;
			if (folderList.length > 0) {
				for (var i = 0; i < folderList.length; i++) {
					var fileName = folderList[i].fileName.replace(reg, "\\'");
					var strName = folderList[i].fileName;	

					if (key) 
					{						
						strName = parent.Util.keyHighLight(key,strName,true);
						//strName =strName.replace(new RegExp(key,"gmi"),"<span style='background-color:Gold;padding-left:2px;padding-right:2px;'>"+key+"</span>");
					}
					var filePath = folderList[i].filePath.replace(reg, "\\'");
					html.push("<table cellpadding='0' class='filezz_con' id='tr_sys1_" + i + "' onmouseover='diskList.mouseover(this," + i + ")' onmouseout='diskList.mouseout(this," + i + ")' style='cursor:pointer;'><tr>");
					html.push("<td style=\"width:25px;\"><input class=\"fl\" onclick=\"diskList.cbClick(this);diskList.checkClickAll();\" type=\"checkbox\" value=" + folderList[i].fileId + " dir=" + folderList[i].objectType + " name=\"checkBox_mid\" id='checkbox_file_" + i + "'\"></td>");
					//html.push("<td style=\"width:25px;\"><input class=\"fl\" onclick=\"diskList.cbClick(this);diskList.checkClickAll();\" type=\"checkbox\" value=" + folderList[i].fileId + " dir=" + folderList[i].objectType + " name=\"checkBox_mid\" id='checkbox_file_" + i + "></td>");
					if (diskList.diskType == 0) {
						if (folderList[i].objectType == 1) {
							var extension = folderList[i].objectExtension;
							extension = extension.substr(1, extension.length - 1);
							html.push("<td><div><a class=\"fl\" href='");
							if (parent.GC.check("DISK_MINE_DOWNLOAD")) {
								if (diskImplType == 2) {
									html.push("javascript:diskList.downAjax(" + folderList[i].fileId + ");'");
								}
								else {
									html.push("download.do?fileId=" + folderList[i].fileId + "&sid=" + parent.gMain.sid + "'");
								}
								
							}
							else 
								html.push("#'");
							html.push("><i class=\"big_" + parent.Util.getFileExtensionCss(extension) + " mt_5\" style=\"height:32px;\"></i></a>");
							html.push('<div>');
							if (diskImplType == 2) {//分布式
								html.push("<p><a class='filename_css' href='javascript:diskList.downAjax(" + folderList[i].fileId + "); ' title='" + folderList[i].fileName.encodeHTML() + "' >" + strName + "</a></p>");
							}
							else {
								html.push("<p><a class='filename_css' href='download.do?fileId=" + folderList[i].fileId + "&sid=" + parent.gMain.sid + "' title='" + folderList[i].fileName.encodeHTML() + "' >" + strName + "</a></p>");
							}
						}
						else {
							html.push("<td><div><i class='folder fl' onclick=\"diskList.getChildFolderList('" + folderList[i].fileId + "','" + fileName.encodeHTML() + "')\" ></i><div><p><a href='#' class='filename_css' onclick=\"diskList.getChildFolderList('" + folderList[i].fileId + "','" + fileName.encodeHTML() + "')\"  title='" + folderList[i].fileName.encodeHTML() + "'  >" + strName + "</a></p>");
						}
						
						diskList.parentId = folderList[i].parentId;
						//html.push("<span class=\"op\"  >");
						html.push("<p><span  id='span" + i + "' class='skyDrive-control' style='vertical-align:top;'>");
						
						if(folderList[i].uploadFileSize!=folderList[i].fileSize){//续传
							html.push("<i class=\"i-warm\"></i><span class=\"inbm col_red mr_5\">上传失败</span>");
						}else{
							//是否具有下载权限
							if (parent.GC.check("DISK_MINE_DOWNLOAD")) 
							
								if (diskImplType == 2) {//分布式
									html.push("<a   href='javascript:diskList.downAjax(" + folderList[i].fileId + ");' class=\"fcI\">" + lang.download + "</a>");
								}
								else {
									html.push("<a   href='download.do?fileId=" + folderList[i].fileId + "&sid=" + parent.gMain.sid + "' class=\"fcI\">" + lang.download + "</a>");
								}
							
							//移动到权限
							if (diskList.isSeach == false && parent.GC.check("DISK_MINE_MOVE"))//如果是查询结果列表展示，取消列表中的移除按钮
								html.push("<a  href=\"javascript:void(0)\" onclick=\"diskList.moveToDialog('" + folderList[i].fileId + ",')\" class=\"fcI\">" + lang.move + "</a>");
							//重命名权限
							if (parent.GC.check("DISK_MINE_RENAME")) 
								html.push("<a  onclick=\"diskList.openReName('" + folderList[i].fileId + "','" + filePath + "','" + fileName + "','" + folderList[i].objectType + "')\" href=\"#\" class=\"fcI\">" + lang.rename + "</a>");
						}
						//删除权限
						if (parent.GC.check("DISK_MINE_DELETE")) 
							html.push("<a  href=\"javascript:void(0)\" onclick=\"diskList.fileDelete('" + folderList[i].fileId + "')\" class=\"fcI\">" + lang.delete1 + "</a>");
						html.push("</span></p></div></div></td><td class=\"date\" >" + folderList[i].uploadTime + "</td>");
						html.push(" <td class=\"size\" >" + parent.Util.formatSize(folderList[i].fileSize, null, 2) + "</td>");
					}
					else if(diskList.diskType == 3){
                        html.push("<td><div><a class=\"fl\" href='");
                        if (diskPower) {
                            if (diskImplType == 2) {
                                html.push("javascript:diskList.downAjax(" + folderList[i].fileId + ");'");
                            }
                            else {
                                html.push("download.do?fileId=" + folderList[i].fileId + "&sid=" + parent.gMain.sid + "'");
                            }
                            
                        }
                        else 
                            html.push("#'");
						var extension = folderList[i].objectExtension;
                        html.push("><i class=\"big_" + parent.Util.getFileExtensionCss(extension) + " mt_5\" style=\"height:32px;\"></i></a>");
                        html.push("<div>");
                        if (diskImplType == 2) {//分布式
                            html.push("<p><a class='filename_css' href='javascript:diskList.downAjax(" + folderList[i].fileId + "); ' title='" + folderList[i].fileName + "' >" + strName + "</a></p>");
                        }
                        else {
                            html.push("<p><a class='filename_css' href='download.do?fileId=" + folderList[i].fileId + "&sid=" + parent.gMain.sid + "' title='" + folderList[i].fileName + "' >" + strName + "</a></p>");
                        }
						html.push("<p><span  id='span" + i + "' class='skyDrive-control' style='vertical-align:top;'>");
						
						if(folderList[i].uploadFileSize!=folderList[i].fileSize){//续传
							html.push("<i class=\"i-warm\"></i><span class=\"inbm col_red mr_5\">上传失败</span>");
						}else{
							if (diskPower)						
								if (diskImplType == 2) {//分布式
									html.push("<a   href='javascript:diskList.downAjax(" + folderList[i].fileId + ");' class=\"fcI\">" + lang.download + "</a>");
								}
								else {
									html.push("<a   href='download.do?fileId=" + folderList[i].fileId + "&sid=" + parent.gMain.sid + "' class=\"fcI\">" + lang.download + "</a>");
								}
							
							if(diskPower)
								html.push("<a  href=\"javascript:void(0);\" onclick=\"diskList.reneWal("+folderList[i].fileId+");return false;\"  class=\"fcI\">" + "续期"+ "</a>");
							
							//重命名权限
							if (diskPower) 
								html.push("<a  onclick=\"diskList.openReName('" + folderList[i].fileId + "','" + filePath + "','" + fileName + "','" + folderList[i].objectType + "')\"  href=\"#\" class=\"fcI\">" + lang.rename + "</a>");
						}
						//删除权限
						if (diskPower) 
							html.push("<a  href=\"javascript:void(0)\" onclick=\"diskList.fileDelete('" + folderList[i].fileId + "')\" class=\"fcI\">" + lang.delete1 + "</a>");
						
						html.push("</span></p></div></div></td>");
						var curtime = serverTime ?  parent.Util.parseDate(serverTime) : new Date();
						var timeStr = "";
						var d = parent.Util.DateDiffMore(curtime,folderList[i].shareTime,"d");
						var h = 0;
						if(d > 0){							
							 h = parent.Util.DateDiffMore(parent.Util.DateAdd("d",d,curtime),folderList[i].shareTime,"h");
							 timeStr = d+"天"+h+"小时";
						}else{
							 h = parent.Util.DateDiffMore(curtime,folderList[i].shareTime,"h");
							 if (h > 0) 
							 	timeStr = h + "小时";
							 else {
							 	var n = parent.Util.DateDiffMore(curtime, folderList[i].shareTime, "n");
								if(n > 0)
									timeStr = n + "分钟";
								else
									timeStr = "不足1分钟"
							 }
						}				
						html.push("<td style=\"width:125px;\" title=\"到期日期："+folderList[i].shareTime+"\">" + timeStr + "</td>");						
						html.push("<td style=\"width:125px;\">" + folderList[i].fileCount + "</td>");
						html.push("<td style=\"width:68px;\">" + parent.Util.formatSize(folderList[i].fileSize, null, 2) + "</td>");
					}
					//html.push("</tr>");
					html.push("</tr></table>");
				}
			}
			else{
				html.push('<table cellpadding="0" class="filezz_con"><tr><td colspan="{0}"><p class="set_rule_box_tips" style="display:block;margin-bottom: 12px;">'.format(diskList.diskType == 0 ? "4" : "5"));
				if (diskList.isSeach) {
					html.push(lang.notSearchData);
				}
				else {
					html.push(lang.notDiskData);
					$("#diskFootDiv").hide();
				}
				html.push('</p></td></tr></table>');
			}
		
           
            
            if (diskList.isSeach == true) {
                $("#btnRemove").hide();	
				if (key) {
					
					$("#tempDiskMsg").css("cursor","pointer"); 
					$("#tempDiskMsg").click(function(){
						location.href='tempdisk.do?sid='+parent.gMain.sid;
						return false;
					});
					$("#disk_Search_Title").html("&nbsp;&gt;&gt;&nbsp;" + lang.SearchKeyAndCount + diskList.seachData.key + lang.SearchCount.format(folderList.length));
				}		
            }
            else 
                if (parent.GC.check("DISK_MINE_MOVE")) 
                    $("#btnRemove").show();
            
            //分页处理
            var pageCount = parseInt(data["var"].pageCount);
            //总页数
            var curPage = parseInt(data["var"].curPage);
            //当前页数；
            diskList.curPageCount = pageCount;
            var intCount = data["var"].intCount;
            $("#select_page_start").empty();
            $("#select_page_end").empty();
            for (var i = 1; i <= pageCount; i++) {
                $("#select_page_start").append("<option value=" + i + ">" + i + " / " + pageCount + " </option>");
                $("#select_page_end").append("<option value=" + i + ">" + i + " / " + pageCount + " </option>");
            }
            $("#select_page_start").attr("value",data["var"].curPage);
            $("#select_page_end").attr("value",data["var"].curPage);
            //显示本文件夹的数量统计情况
            if (diskList.isSeach == false) 
                $("#fileCount").html(lang.fileCount.format(data["var"].totalFolderCount, data["var"].totalFileCount));
            else {
                $("#fileCount").html(lang.seachFileCount.format(data["var"].intCount));
                $("#divTitle").html("<a href=\"#\" onclick=\"diskList.redirectFoderList('1','','" + lang.mydisk + "')\">" + lang.mydisk + "</a>");
            }
            //隐藏或者显示返回上一级目录
            if (parseInt(diskList.titieIndex) >= 2){ 
				 $("#folderList_new").html("<table cellpadding=\"0\" class=\"filezz_con\"><tr ><td colspan=\"5\"><div class=\"tbl-list-return\"><a title='"+lang.back+"' href=\"javascript:diskList.returnPrcFolder()\"><i class=\"i_back\"></i>"+lang.back+"</a></div></td></tr></table>"+html.join(""));
            }else{             	
                $("#folderList_new").html(html.join(""));
            }
            //得到文件夹层次关系菜单栏
            var folderName = diskList.folderName;
            var folderId = diskList.folderId;
            if (diskList.OperationType == 1) {
                var shortFolderName = diskList.folderName.length <= 6 ? diskList.folderName : folderName.substr(0, 3) + '...' + diskList.folderName.substr(folderName.length - 2, folderName.length);
                diskList.title = diskList.title.format(lang.mydisk) + "&gt;" + "<a onclick=\"diskList.redirectFoderList('" + diskList.titieIndex + "','" + folderId + "','" + escape(folderName) + "')\"   href=\"#\"  title=\""+escape(folderName)+"\"  >" + shortFolderName + "</a>";
                $("#divTitle").html(diskList.title);
            }
            if (pageCount == 1 || pageCount == 0) {
                $("#firstPage").hide();
                $("#prevPage").hide();
                $("#nextPage").hide();
                $("#lastPage").hide();
                $("#select_page").hide();
                
                $("#firstPage_end").hide();
                $("#prevPage_end").hide();
                $("#nextPage_end").hide();
                $("#lastPage_end").hide();
                $("#select_page_end").hide();
                $("#select_page_start").hide();
            }
            else 
                if (pageCount == curPage) {
                    $("#firstPage").show();
                    $("#prevPage").show();
                    $("#select_page").show();
                    $("#lastPage").hide();
                    $("#nextPage").hide();
                    
                    $("#firstPage_end").show();
                    $("#prevPage_end").show();
                    $("#select_page_end").show();
                    $("#select_page_start").show();
                    $("#lastPage_end").hide();
                    $("#nextPage_end").hide();
                }
                else 
                    if (pageCount > curPage && curPage == 1) {
                        $("#firstPage").hide();
                        $("#prevPage").hide();
                        $("#nextPage").show();
                        $("#lastPage").show();
                        $("#select_page_start").show();
                        
                        $("#firstPage_end").hide();
                        $("#prevPage_end").hide();
                        $("#nextPage_end").show();
                        $("#lastPage_end").show();
                        $("#select_page_end").show();
                    }
                    else 
                        if (pageCount > curPage) {
                            $("#firstPage").show();
                            $("#prevPage").show();
                            $("#nextPage").show();
                            $("#lastPage").show();
                            $("#select_page_start").show();
                            
                            $("#firstPage_end").show();
                            $("#prevPage_end").show();
                            $("#nextPage_end").show();
                            $("#lastPage_end").show();
                            $("#select_page_end").show();
                        }
        }
        else {
            parent.CC.alert(data.summary);
        }
		
    },
    /***
     * 获取文件后缀样式
     * @param {Object} extension 后缀名
     * @return 后缀样式
     */
    GetFileExtensionCss: function(extension){
        var tempstr = "not";
        var extensionList = ["tif", "txt", "psd", "rar", "zip", "xml", "html", "java", "fon", "jpg", "gif", "png", "bmp", "tiff", "mpeg", "avi", "wmv", "mov", "mpg", "vob", "rmvb", "mp3", "wma", "wav", "asf", "mp4", "sis", "sisx", "cab", "doc", "docx", "pdf", "xls", "xlsx", "ppt", "pptx", "swf", "fla", "share", "folder", "folder-m", "folder-p", "mp3-hover", "upload", "flv", "exe", "css", "rm", "midi", "chm", "iso", "vsd"];
        for (var i = 0; i < extensionList.length; i++) {
            if (extensionList[i] == extension) {
                tempstr = extension;
                break;
            }
        }
        return tempstr;
    },
	loadEvent: function(){
		var txt = document.getElementById("seachKey");
		txt.maxLength = 30;
		var sk = lang.seachKey;
		var btn = document.getElementById("btnSearch");
		txt.onclick = function(){
			if(this.value == sk){
				this.value="";
			}
			jQuery(this).css("color","black");			
			$("#advancedsearch").hide();
		};
		txt.onblur = function(){
			if(this.value  == "")
			{
				jQuery(this).css("color","");
				this.value = sk;
			}
		};
		$(txt).keyup(function(e){
			//var ev = parent.EV.getEvent(e);			
			if (e.keyCode == 13) {
               btn.onclick();			  
            }
		});
	},
	initTempDiskInfo:function(){
		var dom_sizeTips = $("#tempDiskSizeTips");
		var dom_currentUseSize = $("#temp_currentUseSize");
		var dom_maxSize = $("#temp_maxSize");
		var dom_maxDay = $("#temp_maxDay");
		var dom_astrict = $("#temp_astrict");
		var perc = Math.round(usedVolume / totalVolume * 10000) / 100.00; 
		if(perc >= 90){
			dom_sizeTips.show();
			dom_currentUseSize.addClass("col_red");
		}
		
		dom_maxSize.html(parent.Util.formatSize(totalVolume, null, 2)); 
		dom_currentUseSize.html(parent.Util.formatSize(usedVolume, null, 2));
		dom_astrict.html(parent.Util.formatSize(maxUploadFileSize, null, 2));
		dom_maxDay.html(maxDay+"天");
		var windowHeight = $(window).height(),
			headHeight = $("#tempSearchDiv").height()+5;
		//if($("#tempDiskOption").attr("css"))
		$("#tempDiskInfo").height(windowHeight-headHeight);
		
		
		
		document.getElementById("temp_remind_buttion").onclick = function(){
			var posttype = remindType == "000" || remindType == "" ? "100" : "000"; 
			var data = {remindType:posttype};			
			diskList.Ajax("disk:setRemind", data, function(data){
				remindType = posttype;
				diskList.showRemindHTML();
				$("#temp_remind_buttion").html(remindType == "000" ? "开启" : "关闭");
				parent.CC.showMsg("设置成功",true,false,"option");				
			});
			return false;
		}
		diskList.showRemindHTML();
	},
	showRemindHTML:function(){
		var types = {"000":"未开启","100":"邮件","010":"短信","110":"邮件加短信"};		
		if(remindType && remindType != "000"){
			$("#temp_openStatus").html("已开启");
			$("#temp_remindType").html(types[remindType]);
			$("#temp_remind_buttion").html("关闭");
		} 
		else{
			$("#temp_openStatus").html("未开启");
			$("#temp_remind_buttion").html("开启");
		}
	},
    /**
     * 加载用户的文件柜列表
     */
    diskListInit: function(type){
    
		diskList.diskType = type || 0;

        
		if (diskList.diskType != 3) {
			$("#disk_head").hide();
			//判断是否有个人文件柜权限
			if (parent.GC.check("DISK_MINE")) {
				$("#myDisk").show();			
			}
			
	        //判断是否有企业文件柜权限
	        if (parent.GC.check("DISK_EP")) 
	            $("#enterpriseDisk").show();
	        //判断是否共享文件柜权限
	        if (parent.GC.check("DISK_SHARE")) 
	            $("#shareDisk").show();
		} else {
			//我的暂存柜
			if (diskPower) 
	            $("#tempDisk").show();	
			$("#disk_head").hide();	
		}

			
		if (diskList.diskType == 0) {
			//*****我的网盘权限******
			//判断是否有新建文件夹权限
			if (!parent.GC.check("DISK_MINE_NEWFOLDER")) 
				$("#btnnewFolder").hide();
			//判断是否有上传权限
			if (!parent.GC.check("DISK_MINE_UPLOAD")) 
				$("#btnUpload").hide();
			//判断是否有下载权限
			if (!parent.GC.check("DISK_MINE_DOWNLOAD")) 
				$("#btndownLoad").hide();
			//判断是否有删除权限
			if (!parent.GC.check("DISK_MINE_DELETE")) 
				$("#btnDel").hide();
			//判断是否有发送权限
			if (!parent.GC.check("DISK_MINE_SEND")) 
				$("#btnSend").hide();
			//判断是否有移动到权限
			if (!parent.GC.check("DISK_MINE_MOVE")) 
				$("#btnRemove").hide();
			//判断是否有高级搜索权限
			if (!parent.GC.check("DISK_MINE_ADVSEARCH")) 
				$("#btnAvseach").hide();
		}
		else{
				
			//上传
			if (!diskPower) 
	            $("#btnUpload").hide();			
			//删除
			if (!diskPower) 
	            $("#btnDel").hide();
			//发送
			if (!diskPower) 
	            $("#btnSend").hide();		
			//续期
			if (!diskPower) 
	            $("#btnRenewal").hide();
			$("#btnAvseach").hide();//隐藏高级搜索
			diskList.initTempDiskInfo();
		}
		
        
        //高级搜索
        if (diskList.getQueryString("data") != "") {
            data = unescape(diskList.getQueryString("data"));
            diskList.seachData = eval("(" + data + ")");
            diskList.seachData.pageSize = diskList.pageSize;
            diskList.seachData.isSeach = diskList.isSeach = true;			
            diskList.seachData.titieIndex = diskList.titieIndex;
            diskList.seachData.orderField = diskList.orderbyField;
            diskList.seachData.orderBy = diskList.orderby;
            diskList.Ajax("disk:search", diskList.seachData, diskList.loadFolderListHTML);
        }
        else {
            diskList.isSeach = false;
            diskList.getFolderList();
        }
        //列表排序，默认为倒序上传时间
        $("#listMailSortIcon_receiveDate").addClass("desc");
		diskList.loadEvent();
		
		//是否显示安装邮箱小工具
		if(diskList.diskType == 0&&parent.GC.check("DISK_MINE_UPLOAD")||diskList.diskType != 0&&diskPower){
			var setuptool=jQuery('#setupplugin');
			if(window.ActiveXObject&&!this.check()){
				setuptool.show();
			}else{
				setuptool.hide();
			}
		}
    },
    /**
     * 得到指定文件夹的下一级文件与文件夹
     */
    getChildFolderList: function(folderId, folderName){
        diskList.seachData = {
            "pageSize": diskList.pageSize,
            "curPage": 1,
            "orderField": diskList.orderbyField,
            "orderBy": diskList.orderby,
            "isSubDir": 1,
            "diskType": diskList.diskType,
            "searchRange": folderId
        };
        //diskList.seachData = data;
        diskList.fid = folderId;
        diskList.titieIndex = parseInt(diskList.titieIndex) + 1;
        diskList.curPage = 1;
        diskList.OperationType = 1;
        //表示执行了此方法
        //文件夹名称省略去中间超长部分
        diskList.folderName = folderName;
        diskList.folderId = folderId;
        $("#selectAll").attr("checked", false);
        diskList.Ajax("disk:search", diskList.seachData, diskList.loadFolderListHTML);
        
    },
    /**
     * 点击文件层次关系时跳转到指定层级方法
     * @param {Object} index
     * @param {Object} folderId
     * @param {Object} folderName
     */
    redirectFoderList: function(index, folderId, folderName){
        var s = $("#divTitle").html();
        var titleList = s.split("&gt;");
        var title = "";
        for (var i = 0; i < index; i++) {
            title += titleList[i] + "&gt;";
        }
        diskList.titieIndex = parseInt(index);
        title = title.substr(0, title.length - 4);
        diskList.title = title;
        diskList.fid = folderId;
        diskList.isSeach = false;
        diskList.curPage = 1;
        diskList.OperationType = 2;
        diskList.seachData = {
            "pageSize": diskList.pageSize,
            "curPage": diskList.curPage,
            "orderField": diskList.orderbyField,
            "orderBy": diskList.orderby,
            "isSubDir": 1,
            "diskType": diskList.diskType,
            "searchRange": folderId
        };
        //diskList.seachData = data;
        diskList.Ajax("disk:search", diskList.seachData, diskList.loadFolderListHTML);
        $("#divTitle").html(title);
        $("#selectAll").attr("checked", false);
    },
    /**
     *
     */
    seachFile: function(){
		var txtFocus = function(){
			document.getElementById("seachKey").focus();
		};
        if ($("#seachKey").val().replace(/(^\s*)|(\s*$)/g, "") == "") {
			parent.CC.alert(lang.seachKey,txtFocus);
			$("#seachKey").val("");           	    	
            return;
        }
        if ($("#seachKey").val() == lang.seachKey) {
			parent.CC.alert(lang.seachKey,txtFocus);
			$("#seachKey").val("");            	    	
            return;
        }
		var reg = /^[^\\\/:*?|"<>]+$/;
		if (!reg.test($("#seachKey").val()) || /\.$/.test($("#seachKey").val())) {
			parent.CC.alert(lang.garbage_search_key,txtFocus);
			$("#seachKey").val("");						
			return;
		}
			
        diskList.curPage = 1;
        diskList.titieIndex = 1;
        diskList.OperationType = 3;
        diskList.seachData = {
            "pageSize": diskList.pageSize,
            "curPage": diskList.curPage,
            "orderField": diskList.orderbyField,
            "orderBy": diskList.orderby,
            "isSubDir": 0,
            "diskType": diskList.diskType,
            "isViewFolder": 1,
            "key": $("#seachKey").val()
        };
        //diskList.seachData = data;
        diskList.isSeach = true;
		$("#seachKey").val("");
        diskList.Ajax("disk:search", diskList.seachData, diskList.loadFolderListHTML);
        
    },
    /**
     *全选
     */
    selectAllFolder: function(obj){
        diskList.selectFid = "";
        if (obj.checked == false) {
            $("input[name='checkBox_mid']").each(function(){
                $(this).attr("checked", false);
                diskList.cbClick(this);
            });
        }
        else {
            $("input[name='checkBox_mid']").each(function(){
                $(this).attr("checked", true);
				diskList.cbClick(this);
                diskList.selectFid = diskList.selectFid + $(this).val() + ",";
            });
        }
        
    },
    /**
     * 得到选中的文件列表
     */
    getSelectFileID: function(){
        diskList.selectFid = "";
        $("[name='checkBox_mid']").each(function(){
            //if ($(this).attr("checked") == true) {
			if(this.checked == true){
                diskList.selectFid = diskList.selectFid + $(this).val() + ",";
            }
        });
    },
    /**
     * 第一次打开页面加载用户的文件柜列表
     */
    getFolderList: function(){
        if (!diskList.isSeach) {
            diskList.seachData = {
                "pageSize": diskList.pageSize,
                "curPage": diskList.curPage,
                "orderField": diskList.orderbyField,
                "orderBy": diskList.orderby,
                "isSubDir": 1,
                "diskType": diskList.diskType,
                "searchRange": diskList.fid
            };
        }
        //diskList.seachData = data;
        diskList.Ajax("disk:search", diskList.seachData, diskList.loadFolderListHTML);
    },
    /**
     * 分页跳转；
     */
    Go: function(type){
    
        if (type == "next")//下一页
            diskList.curPage = parseInt(diskList.curPage) + 1;
        else 
            if (type == "start")//首页
                diskList.curPage = 1;
            else 
                if (type == "end")//尾页
                    diskList.curPage = diskList.curPageCount;
                else 
                    if (type == "Pageup")//上一页
                        diskList.curPage = parseInt(diskList.curPage) - 1;
                    else 
                        if (type == "endpage")//直接定向到指定页（列表下方的）
                            diskList.curPage = $("#select_page_end").val();
                        else//直接定向到指定页（列表上方的）
                             diskList.curPage = $("#select_page_start").val();
        diskList.seachData.curPage = diskList.curPage;
        diskList.seachData.pageSize = diskList.pageSize;
        diskList.OperationType = 4;
        $("#select_page_start").attr("value",diskList.curPage);
        $("#select_page_end").attr("value",diskList.curPage);
        $("#selectAll").attr("checked", false);
        diskList.Ajax("disk:search", diskList.seachData, diskList.loadFolderListHTML);
    },
    /**
     * 按字段点击排序
     * @param {Object} orderbyField
     * @param {Object} orderby
     */
    Sort: function(orderbyField, iconId){
        var className = "asc";
        if (diskList.orderby == "asc") {
            diskList.orderby = "desc";
            className = "desc";
        }
        else {
            diskList.orderby = "asc";
        }
        $("#listMailSortIcon_receiveDate").removeClass("asc");
        $("#listMailSortIcon_receiveDate").removeClass("desc");
        $("#listMailSortIcon_size").removeClass("asc");
        $("#listMailSortIcon_size").removeClass("desc");
        $("#listMailSortIcon_from").removeClass("asc");
        $("#listMailSortIcon_from").removeClass("desc");
		$("#listMailSortIcon_shareTime").removeClass("asc");
        $("#listMailSortIcon_shareTime").removeClass("desc");
		$("#listMailSortIcon_fileCount").removeClass("asc");
        $("#listMailSortIcon_fileCount").removeClass("desc");
        diskList.OperationType = 5;
        switch (iconId) {
            case "listMailSortIcon_from":
                $("#listMailSortIcon_from").addClass(className);
                break;
            case "listMailSortIcon_receiveDate":
                $("#listMailSortIcon_receiveDate").addClass(className);
                break;
            case "listMailSortIcon_size":
                $("#listMailSortIcon_size").addClass(className);
                break;
			case "listMailSortIcon_shareTime":
                $("#listMailSortIcon_shareTime").addClass(className);
                break;	
			case "listMailSortIcon_fileCount":
                $("#listMailSortIcon_fileCount").addClass(className);
                break;	
        }
        
        diskList.orderbyField = orderbyField;
        diskList.curPage = 1;
        
        diskList.seachData.orderField = diskList.orderbyField;
        diskList.seachData.orderBy = diskList.orderby;
        diskList.seachData.curPage = diskList.curPage;
        
        diskList.getFolderList();
    },
    /**
     * 单个文件删除
     * @param {Object} fid
     */
    fileDelete: function(fid){
        diskList.selectFid = fid;
        parent.CC.confirm(diskList.diskType == 3 ? "确定删除文件" : lang.isdelete, diskList.delFile, lang.alert1, null, 'delUsers');
    },
    /**
     * 删除多个文件
     */
    fileListDelete: function(){
        diskList.getSelectFileID();
        if (diskList.selectFid == "") {
            parent.CC.alert(diskList.diskType == 3 ? "请选择需要删除的文件" : lang.SelectDelFile);
            return;
        }       
        parent.CC.confirm(diskList.diskType == 3 ? "确定删除文件" :lang.isdelete, diskList.delFile, lang.alert1, null, 'delUsers');
    },
    /**
     *发送AJAX请求（删除操作）
     * @param {Object} data
     */
    delFile: function(){
        var data = new Object();
        var fidList = diskList.selectFid.split(',');
        var daltaList = [];
        for (var i = 0; i < fidList.length; i++) {
            if (fidList[i] != "") 
                daltaList.push(parseInt(fidList[i]));
        }
        data.fileId = daltaList;
		data.diskType=diskList.diskType;
        diskList.OperationType = 6;
        diskList.Ajax("disk:delete", data, function(data){
            if (data.code == "S_OK") {
				 //if ($("#selectAll").attr("checked"))
				 if(diskList.curDataCount - daltaList.length == 0) {
		            if (diskList.curPage > 1) 
		                diskList.curPage--;
		        }
				
                $("#selectAll").attr("checked", false);
                //parent.CC.alert(lang.delteSuccess);
				parent.CC.showMsg(lang.delteSuccess,true,false,"option");
				if (diskList.diskType == 3) {
					parent.GMC.getFrameWin('outLink_diskTemp').diskList.getFolderList();
				} else {
					parent.GMC.getFrameWin('outLink_diskMine').diskList.getFolderList();
				}
                //parent.GMC.getFrameWin("outLink_disk").diskList.getFolderList();
            }
            else 
                parent.CC.alert(data.summary);
        });
    },
    /**
     * 打开重命名页面窗口
     * @param {Object} fileId
     * @param {Object} filepath
     * @param {Object} fileName
     * @param {Object} objectType
     */
    openReName: function(fileId, filepath, fileName, objectType){
        var ao = {
            id: "ReNameHTML",
            title: lang.rename,
            url: "../disk/filerename.do?fileId=" + fileId + "&objectType=" + objectType + "&fileName=" + escape(fileName) + "&filepath=" + escape(filepath) + "&sid=" + parent.gMain.sid+"&diskType="+diskList.diskType,
            width: "450",
            height: "183",
            scoll: "no",
            buttons: [],
            zindex: 1800
        
        };
        diskList.OperationType = 12;
        parent.CC.showHtml(ao);
    },
    /**
     * 对重命名的页面进行初始化
     */
    loadReName: function(){
    
        var filepath = unescape(diskList.getQueryString("filepath"));
        var paths = filepath.split("/");
        var shortFolderName = "";
        for (var i = 0; i < paths.length; i++) {
            var tempstr = paths[i];
            shortFolderName += (tempstr.length <= 6 ? tempstr : tempstr.substr(0, 2) + '..' + tempstr.substr(tempstr.length - 2)) + "/";
        }
        if (shortFolderName != "") {
            shortFolderName = shortFolderName.substr(0, shortFolderName.length - 1);
        }
        
        /*
         if(filepath.length > 18)
         $("#filePath").text(filepath.substr(0, 18) + "...");
         else
         $("#filePath").text(filepath);
         */
       
        var fileName =  unescape(diskList.getQueryString("fileName"));
		
        var objectType = diskList.getQueryString("objectType");
        if (objectType == "2") {
            $("#txtFolderNewName").val(fileName);
            $("#li_oldName").hide();
            $("#li_newFileName").hide();
            $("#li_folderName").show();
			if(shortFolderName.indexOf("/") != -1)
			{
				shortFolderName = shortFolderName.substr(0,shortFolderName.lastIndexOf("/"));
				filepath = filepath.substr(0,filepath.lastIndexOf("/"));
			}
        }
        else {
            var oldFileName = fileName;
            if (oldFileName.length > 20) 
                $("#oldfileName").text(oldFileName.substr(0, 20) + "...");
            else 
                $("#oldfileName").text(oldFileName);
            $("#oldfileName").attr("title", oldFileName);
            var exists = "";
            if (fileName.split('.').length > 1) {
                exists = fileName.substr(fileName.lastIndexOf("."));
                fileName = fileName.substr(0, fileName.lastIndexOf("."));
            }
			$("#fileexists").attr("title",exists);
			exists = exists.length > 5 ? exists.substr(0,5)+"..." : exists;
            $("#txtNewName").val(fileName);
            $("#fileexists").text(exists);
			$("#errrorinfo").hide();            
        } 
		$("#filePath").text(shortFolderName);
        $("#filePath").attr("title", filepath);
    },
    /**
     * 保存文件夹或文件重命名
     * @param {Object} fid
     */
    SaveReName: function(){
        fileType = diskList.getQueryString("objectType");
        var data = {};
        var reg = /^[^\\\/:*?|"<>]+$/;
		var txt = $("#txtNewName");
        if (fileType == "1") {
            if (txt.val().replace(/(^\s*)|(\s*$)/g, "") == "") {
                //parent.CC.alert(lang.renameISnull);
				reFile_ErrTip.show(txt.get(0),lang.renameISnull);
                return;
            }
            if (!reg.test(txt.val())) {
                //parent.CC.alert(lang.garbage_file_name);
				reFile_ErrTip.show(txt.get(0),lang.garbage_file_name);
                return;
            }
            data = {
                "fileId": diskList.getQueryString("fileId"),
                "newName": txt.val() + $("#fileexists").text(),
				"diskType":diskList.diskType
            };
        }
        else {
			txt = $("#txtFolderNewName");
            if (txt.val().replace(/(^\s*)|(\s*$)/g, "") == "") {
                //parent.CC.alert(lang.renameISnull);
				reFile_ErrTip.show(txt.get(0),lang.renameISnull);
                return;
            }
            if (!reg.test(txt.val()) || /\.$/.test($("#txtFolderNewName").val())) {
                //parent.CC.alert(lang.garbage_folder_name);
				reFile_ErrTip.show(txt.get(0),lang.garbage_folder_name);
                $("#errrorinfo").show();
                return;
            }
            data = {
                "fileId": diskList.getQueryString("fileId"),
                "newName": txt.val(),
				"diskType":diskList.diskType
            };
        }
        diskList.Ajax("disk:rename", data, function(data){
            if (data.code == "S_OK") {
                //parent.CC.alert(lang.updateSuccess);
				parent.CC.showMsg(lang.updateSuccess,true,false,"option");
				if (diskList.diskType == 3) {
					parent.GMC.getFrameWin('outLink_diskTemp').diskList.getFolderList();
				} else {
					parent.GMC.getFrameWin('outLink_diskMine').diskList.getFolderList();
				}//parent.GMC.getFrameWin("outLink_disk").diskList.getFolderList();
                parent.CC.closeMsgBox('ReNameHTML');
            }
        },function(data){
			reFile_ErrTip.show(txt.get(0),data.summary);
		});
    },
    /**
     * 打开新建文件夹窗口
     */
    showNewFolder: function(){
    
        var ao = {
            id: "newFolderHTML",
            title: lang.CreateFolder,
            url: "../disk/newfolder.do?fid=" + diskList.fid + "&sid=" + parent.gMain.sid,
            width: "400",
            height: "148",
            scoll: "no",
            buttons: [],
            zindex: 1800
        
        };
        diskList.OperationType = 9;
        parent.CC.showHtml(ao);
    },
    /**
     * 得到文件夹的层次关系
     */
    getListFolder: function(){
        var data = {
            "id": 0,
            "isSubDir": 1,
            "diskType": diskList.diskType
        };
        diskList.Ajax("disk:listFolder", data, diskList.showSelectForder);
    },
    showSelectForder: function(data){    
        diskList.showForderHTML(data["var"], "");
        //$("#folderList").attr("value",diskList.getQueryString("fid"));        
    },
    showForderHTML: function(data, index, last){
        if (index == "") 
            $("#folderList").append("<option value='" + data.folderId + "' title='"+data.folderName+"'>" + data.folderName + "</opion>");
        else {			
            $("#folderList").append("<option value='" + data.folderId + "' "+(diskList.getQueryString("fid") == data.folderId ? "selected='selected'":"")+" title='"+data.folderName+"'>" + index + (last ? "└" : "├") + data.folderName + "</opion>");
        }
        index = "&nbsp;&nbsp;" + index;
        if (data.childFolderList.length > 0) {
            for (var i = 0; i < data.childFolderList.length; i++) {
                diskList.showForderHTML(data.childFolderList[i], index, (i + 1) == data.childFolderList.length);
            }
        }
    },
    /**
     * 发送新建文件夹请求
     */
    newFolder: function(){
		var txt = $("#txtNewFolderName");
        if (txt.val().replace(/(^\s*)|(\s*$)/g, "") == "") {
            //parent.CC.alert(lang.FolderIsNull);
			newFile_ErrTip.show(txt.get(0),lang.FolderIsNull);
            return;
        }
        var reg = /^[^\\\/:*?|"<>]+$/;
        if (!reg.test(txt.val()) || /\.$/.test(txt.val())) {
			newFile_ErrTip.show(txt.get(0),lang.garbage_folder_name);
            //parent.CC.alert(lang.garbage_folder_name);
            //$("#errrorinfo").show();
            return;
        }
        var data = {
            "parentId": $("#folderList").val(),
            "newfolderName": txt.val()
        };
		var failcall = function(data){
			newFile_ErrTip.show(txt.get(0),data.summary);
		}
        diskList.Ajax("disk:newFolder", data, diskList.newFolderResult,failcall);
    },
    newFolderResult: function(data){
        if (data.code == "S_OK") {
            parent.GMC.getFrameWin("outLink_diskMine").diskList.getFolderList();
            //parent.CC.alert(lang.CreateFolderSuccess);
			parent.CC.showMsg(lang.CreateFolderSuccess,true,false,"option");
        }
        else 
			newFile_ErrTip.show($("#txtNewFolderName").get(0),data.summary);
            //parent.CC.alert(data.summary);
        parent.CC.closeMsgBox('newFolderHTML');
    },
    /**
     * 打开文件上传页面
     */
    openFileupLoad: function(){
		var url= "flashupload.do";
		var h = 375;
		var w = 550;
	    var diskImplType = 1;
		var isIE = /msie/i.test(navigator.userAgent) && !window.opera;

	    try{
	    	diskImplType = $("#diskImplType").val();
	    } catch (e) {
	    	diskImplType = 1;
		}
		
		if(diskImplType == 2)
		{		
			if(window.ActiveXObject&&diskList.check()){ //control
				url = "celerityupload.do";
			}else if(diskList.checkHtm5()){ //html5
				url = "celerityupload.do?type=html5";
			}else{ //flash
				url = "flashupload.do";
			}
		} 
		
		var divUrl='';
		if(url.indexOf('?')!=-1){
			divUrl = "../disk/"+url+"&fid=" + diskList.fid + "&sid=" + parent.gMain.sid;
		}else{
			divUrl = "../disk/"+url+"?fid=" + diskList.fid + "&sid=" + parent.gMain.sid;
		}
		
		if(diskList.diskType == 3){
			divUrl +="&diskType=3";				
		}
        var uploadFile = {
            id: "uploadFile",
            title: lang.fileUpload,
            url: divUrl,
            width: w,
            height: h,
            scoll: "no",
            buttons: [],
            zindex: 1800,
            sysCloseEvent:function(){            	
            	try {					
            		var win = parent.document.getElementsByTagName("iframe")["ifrm_DialogHtml_uploadFile"].contentWindow;
            		if(diskImplType == "2"){				
            			if(win.UploadApp){ //control
            				var checkuploading=win.UploadApp.checkUploading();
            				if(checkuploading){
            					if(window.confirm('还有文件正在上传，确认要关闭吗？')){
            						win.UploadApp.closeUpload();
            						if (diskList.diskType == 3) {
                    					parent.GMC.getFrameWin('outLink_diskTemp').diskList.getFolderList();
                    				} else {
                    					parent.GMC.getFrameWin('outLink_diskMine').diskList.getFolderList();
        							}
            						return true;
            					}else{
            						return false;
            					}
            				}else{
            					win.UploadApp.closeUpload();
        						if (diskList.diskType == 3) {
                					parent.GMC.getFrameWin('outLink_diskTemp').diskList.getFolderList();
                				} else {
                					parent.GMC.getFrameWin('outLink_diskMine').diskList.getFolderList();
    							}
        						return true;
            				}
            				
            			}else if(win.html5App){ //html5
            				var checkuploading=win.html5App.checkUploading();
            				if(checkuploading){
            					if(window.confirm('还有文件正在上传，确认要关闭吗？')){
            						win.html5App.close();
            						if (diskList.diskType == 3) {
                    					parent.GMC.getFrameWin('outLink_diskTemp').diskList.getFolderList();
                    				} else {
                    					parent.GMC.getFrameWin('outLink_diskMine').diskList.getFolderList();
        							}
            						return true;
            					}else{
            						return false;
            					}
            				}else{
            					win.html5App.close();
        						if (diskList.diskType == 3) {
                					parent.GMC.getFrameWin('outLink_diskTemp').diskList.getFolderList();
                				} else {
                					parent.GMC.getFrameWin('outLink_diskMine').diskList.getFolderList();
    							}
        						return true;
            				}
            			}
            		} 
            		
            		if (win.isFlashUploading()) {
            			if (window.confirm(win.flashLang.flash_cancal_tip)) {
            				win.document.getElementById("divFlashLayer").innerHTML = "";
            				if (diskList.diskType == 3) {
            					parent.GMC.getFrameWin('outLink_diskTemp').diskList.getFolderList();
            				} else {
            					parent.GMC.getFrameWin('outLink_diskMine').diskList.getFolderList();
							}
            			} else {
            				return false;
            			}
            		} else {
            			win.document.getElementById("divFlashLayer").innerHTML = "";          	        	 
            		}
            		return true;    
            		
				} catch (e) {
					if (diskList.diskType == 3) {
    					parent.GMC.getFrameWin('outLink_diskTemp').diskList.getFolderList();
    				} else {
    					parent.GMC.getFrameWin('outLink_diskMine').diskList.getFolderList();
					}
		            return true;
				}
				
				/*关闭控件*/
				if (diskList.diskType == 3) {
					parent.GMC.getFrameWin('outLink_diskTemp').diskList.getFolderList();
				} else {
					parent.GMC.getFrameWin('outLink_diskMine').diskList.getFolderList();
				};
				return true;      
            }
        };
        diskList.OperationType = 10;
        parent.CC.showHtml(uploadFile);
    },
    /**
     * 弹出移动文件或文件夹窗口
     */
    moveToDialog: function(fid){
    
        diskList.getSelectFileID();
        var fileIdList = diskList.selectFid;
        if (fid != null && fid != "") {
            fileIdList = fid;
        }
        if (fileIdList == "") {
            parent.CC.alert(lang.selectMoveFile);
            return;
        }
        fileIdList = fileIdList.substring(0, fileIdList.length - 1);
        var ao = {
            id: "moveToHTML",
            title: lang.move,
            url: "../disk/moveto.do?parentId=" + diskList.parentId + "&fileIdList=" + fileIdList + "&sid=" + parent.gMain.sid,
            width: "350",
            height: "277",
            scoll: "no",
            buttons: [],
            zindex: 1800
        
        };
        diskList.OperationType = 11;
        parent.CC.showHtml(ao);
        
    },
    /**
     * 打包下载
     */
    downfile: function(){
        diskList.getSelectFileID();
        var fileIdList = diskList.selectFid;
        if (fileIdList == "") {
            parent.CC.alert(lang.selectDownloadFile);
            return;
        }
        var diskImplType = $("#diskImplType").val();
        $("#fileIds").val(fileIdList);
        if(diskImplType == 2){
        	diskList.downAjax(fileIdList);
        } else {
            var from = document.getElementById("fileupform");
            //from.action = "http://mail.se139.com/webmail/se/disk/download.do?sid=MTMzNDczMjg5NTAwMTMxMjk5NDk4NAAA000001";
            //document.getElementById("fileupform").submit();
            from.submit();            
		}

       
    },
    
    downAjax:function(fileIds){
    	var obj = {
        		"sid": parent.gMain.sid,
                "fileIds": fileIds,
				"diskType": diskList.diskType
        };
    	$.post(diskList.downUrl,obj,function(data){        	
    		if(data["code"] == "S_OK"){
    			if(data["var"].downType != "3"){
    				window.location.href = data["var"].packUrl;
    			} else {
					parent.CC.confirm("多文件打包已完成，您确定要下载吗？", function(){window.location.href = data["var"].packUrl;}, "多文件打包下载", null, 'packDown');
				}
    			
    		} else {
				alert(data["summary"]);
			}
    	},"json"); 
    },
    
    downCallBack: function(data){
    	alert(data);
    },
    
    /**
     * 将文件作为邮件附件发送
     */
    sendFile: function(){
        diskList.getSelectFileID();
        if (diskList.selectFid == "") {
            parent.CC.alert(diskList.diskType == 3 ? "请选择需要发送的文件" : lang.sendFile);
            return;
        }
        var data = new Object();
        var fidList = diskList.selectFid.split(',');
        var daltaList = [];
        for (var i = 0; i < fidList.length; i++) {
            if (fidList[i] != "") 
                daltaList.push(parseInt(fidList[i]));
        }
        data.fileIds = daltaList;
		data.diskType = diskList.diskType;
        diskList.Ajax("disk:mailAttach", data, diskList.sendFileResutl);
    },
    /**
     * 返回结果处理
     * @param {Object} data
     */
    sendFileResutl: function(data){
        var arr = [];
        var dList = data["var"];
        for (var i = 0; i < dList.length; i++) {
            var name = dList[i].name || "";
            name = name.decodeHTML();
			var joinData = {
                name: name,
                url: dList[i].url,
                size: dList[i].size,
                id: dList[i].id
            }            
			if(diskList.diskType == 3){
				joinData.shareTime = dList[i].overTime;
			}
			arr.push(joinData);
        }
        window.parent.parent.CC.sendMail('', '', arr);
    },
    /**
     * 返回上一级文件夹
     */
    returnPrcFolder: function(){
        diskList.curPage = 1;
        var s = $("#divTitle").html();
        var titleList = s.split("&gt;");
        var title = "";
        var index = parseInt(diskList.titieIndex) - 1;
        for (var i = 0; i < index; i++) {
        
            title += (titleList[i] + "&gt;");
        }
        var getFoldeId = titleList[index - 1];
        var id = getFoldeId.split('\'')[3];
		
        //if (id.length > 2) {
            //id = id.substr(1, id.length - 2);
        //}
        //else {
          //  id = "";
        //}
        diskList.fid = id;
        diskList.seachData = {
            "pageSize": diskList.pageSize,
            "curPage": diskList.curPage,
            "orderField": diskList.orderbyField,
            "orderBy": diskList.orderby,
            "isSubDir": 1,
            "diskType": diskList.diskType,
            "searchRange": diskList.fid
        };
        diskList.titieIndex = index;
        title = title.substr(0, title.length - 4);
        diskList.title = title;
        diskList.OperationType = 6;
        //diskList.fid = diskList.parentId;
        diskList.isSeach = false;
        diskList.Ajax("disk:search", diskList.seachData, diskList.loadFolderListHTML);
        $("#divTitle").html(title);
        //$("#selectAll").attr("checked", false);
    },
    /**
     * AJAX请求通用方法
     * @param {Object} func
     * @param {Object} data
     * @param {Object} callback
     */
    Ajax: function(func, data, callback,failCall){
		failCall = failCall || function(d){
			if(d && d.summary){
				  parent.CC.alert(d.summary);
				}						
		};
        top.MM.doService({
        	url: diskList.url,
            func: func,
            data: data,
            failCall: failCall,
            call: function(d){
                callback(d);
            },
            param: ""
        });
    },
	/**
	 * 显示高级搜索
	 */
	showSeach:function()
	{
		$("#advancedsearch").toggle();
	},
	mouseover : function(p,id){
		     if (!$(p).hasClass("checkColor")) {
			 	$(p).addClass("overColor");
			 }
			 //$("#span"+id).css("visibility","visible");
	},

  
    /**
	 * 移出改变背景颜色
	 * param {object} p 点击对象
	 */
	mouseout : function(p,id){
    if(!$(p).hasClass("checkColor")){
		
		$(p).removeClass("overColor");
	}
		//$("#span"+id).css('visibility','hidden');
	},
	cbClick : function(obj){
		var objTr = obj.parentNode.parentNode;
		   if(obj.checked)
		   {    
		        $(objTr).removeClass();
				$(objTr).addClass("checkColor");
		   		//objTr.style.background="#F6F0D0";
		   }
		   else{
		   	  $(objTr).removeClass("checkColor");
			  $(objTr).addClass("overColor");
		   }
	},
	
	checkClickAll:function(){
		if($("input[name='checkBox_mid']:checked").size()==$("input[name='checkBox_mid']").size()){
	            $('#selectAll').attr('checked',true);
	       } else {
	        	 $('#selectAll').attr('checked',false);
	     }		
	},
	
    /**
     * 得到url参数
     * @param {Object} name
     */
    getQueryString: function(name){
        // 如果链接没有参数，或者链接中不存在我们要获取的参数，直接返回空
        var source = location.href;
        var reg = new RegExp("(^|&|\\?|\\s)" + name + "\\s*=\\s*([^&]*?)(\\s|&|$)", "i");
        if (reg.test(source)) 
            return RegExp.$2.replace(/[\x0f]/g, ";");
        return "";
        /*if(location.href.indexOf("?") == -1 || location.href.indexOf(name + '=') == -1)
         return '';
         var queryString = location.href.substring(location.href.indexOf("?") + 1);
         var parameters = queryString.split("&");
         var pos, paraName, paraValue;
         for(var i = 0; i < parameters.length; i++) {
         // 获取等号位置
         pos = parameters[i].indexOf('=');
         if(pos == -1) {
         continue;
         }
         // 获取name 和 value
         paraName = parameters[i].substring(0, pos);
         paraValue = parameters[i].substring(pos + 1);
         // 如果查询的name等于当前name，就返回当前值，同时，将链接中的+号还原成空格
         if(paraName == name)
         return unescape(paraValue.replace(/\+/g, " "));
         }
         return '';
         */
    },
    /**
     * 回车触发提交事件
     * @param {Object} txtName  按下回车的控件名
     * @param {Object} enterName 回车事件按钮控件名
     */
    OnEnterEvent: function(txtName, enterName){
        $("#" + txtName).keydown(function(e){
            var curKey = e.which;
            if (curKey == 13) {
                $("#" + enterName).click();
                return false;
            }
        });
    },
	/**
	 * 全角转为半角
	 * @param {Object} obj 文本框控件
	 * 调用方法 onkeyup="diskList.CtoH(this);"
	 */
    CtoH: function(obj){
       // var str = obj.value;
       // var result = "";
	return;
	if(event.keyCode==37 || event.keyCode==39)
		return;
        for (var i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) == 12288) {
                result += String.fromCharCode(str.charCodeAt(i) - 12256);
                continue;
            }
            if (str.charCodeAt(i) > 65280 && str.charCodeAt(i) < 65375) 
                result += String.fromCharCode(str.charCodeAt(i) - 65248);
            else 
                result += String.fromCharCode(str.charCodeAt(i));
        }
        obj.value = result;
    },
	/**
	 * 检测上传控件的版本
	 */
	check: function(){
		var setup = false;
        if (window.ActiveXObject) {//ie
            try {
                new ActiveXObject("ydExCxdndCtrl.ExUpload") && (setup = true);
            } catch (ex) {
                /*console.log(ex);
                console.log('创建ActiveXObject("Cxdndctrl.Upload")对象失败！');*/
            }
        } else if (navigator.plugins) {//firefox chrome
            var mimetype = navigator.mimeTypes["application/x-richinfo-cxdnd3"];
            setup = (mimetype && mimetype.enabledPlugin) ? true : false;
        }
        return setup;
	},
	/**
	 * 检测是否支持html5
	 */
	checkHtm5:function(){
		return window.File && window.FileList && window.FileReader && window.Blob && window.FormData
	},
	flashChecker: function(){
        var hasFlash = 0; //是否安装了flash
        var flashVersion = 0; //flash版本
        var isIE =/*@cc_on!@*/ 0; //是否IE浏览器
        if (isIE) {
            var swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
            if (swf) {
                hasFlash = 1;
                VSwf = swf.GetVariable("$version");
                flashVersion = parseInt(VSwf.split(" ")[1].split(",")[0]);
            }
        }
        else {
            if (navigator.plugins && navigator.plugins.length > 0) {
                var swf = navigator.plugins["Shockwave Flash"];
                if (swf) {
                    hasFlash = 1;
                    var words = swf.description.split(" ");
                    for (var i = 0; i < words.length; ++i) {
                        if (isNaN(parseInt(words[i]))) 
                            continue;
                        flashVersion = parseInt(words[i]);
                    }
                }
            }
        }
        return {
            f: hasFlash,
            v: flashVersion
        };
    },
	reneWal:function(fid){
		var fids = [];
		if(fid){
			fids.push(fid);
			//fids = fids.format(fid);
		}else{
			diskList.getSelectFileID();
	        if (diskList.selectFid == "") {
	            parent.CC.alert("请选择需要续期的文件");
	            return;
	        }
	       fids = diskList.selectFid.substr(0,diskList.selectFid.length-1).split(",");
		}
		var data = {"fileIds":fids};
		diskList.Ajax("disk:renewal", data, function(d){
			if (d.code = "S_OK") {				
				parent.CC.showMsg("续期成功",true,false,"option");
				parent.GMC.getFrameWin("outLink_diskTemp").diskList.getFolderList();
			}
		});
	}

};

