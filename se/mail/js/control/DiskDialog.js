function DiskDialog(showType){
	this.singDiskHtml = '<li name={6} >'
          	+'<div  style="padding-left:{3}px;width:540px" class="tf">'
            +'<a class="{7} mr_5" id="{4}" index={5} title="{2}" href="###"></a><input type="checkbox" style="{0}" class="mr_5" version="{8}"  id="{4}"    ><i class="{1} mr_5" ></i>{2}'
          	+'</div>'
        	+'</li>';
	this.showType=showType || 0;
}
DiskDialog.prototype ={

	create:function(callback,showType){
		var p = this;
		this.showType = showType || 0;
		var html = '<div class="pop-wrap" style="padding:0;height:300px;overflow-y:auto">';
			html +='<div class="storage">';
			html +='<div id="disk_control_div" class="img_pop" style=" background:#fff; width:auto; padding:10px 0 0 0;">';
			html +=p._getheadHtml();
			html +=p.getDiskHtml();
			if (p.showType == 1) {
				p.getTempDiskHtml();
			}
			html +='</div>';
			html +=p._getNoFileHtml();
			html +='</div></div>';
		parent.CC.showDiv(html, function(){
			 p.getSelectResult(callback);
        }, "选择文件",null,"diskListContrOl","565");    //,"350"
		p.bindEvent();
	},
	_getheadHtml:function(){
		var temp = '<div class="img_tabTop"><ul style="height:28px;" class="ml_10 fl"><li id="tempDisk_li_up" type="disk" class="diskControlMenu r '+(this.showType==0?"current":"")+'">网盘文件</li>';
			temp +='<li id="tempDisk_li_list" type="tempDisk" class="diskControlMenu '+(this.showType==1?"current":"")+'">文件中转站</li></ul></div>';
		return temp;		
	},
	/***
	 * 没有文件HTML
	 */
	_getNoFileHtml:function(){
		var html =[];
		  html.push('<div class="LoadTip" id="noFileHtml" style="padding-top: 10px;display:none">');
		  html.push(' <div id="temp_Storage_List" style="height:330px;overflow-y:auto;" class="storage-con list">');
		  html.push('<div style="" id="temp_notData" class="rebackwrap"><p>暂无文件，你可以从电脑选择文件添加上传</p><p class="pt_5"></p></div>');
		  html.push('</div></div>')
		  return html.join("");
	},
	/***
	 * 网盘文件夹的HTML
	 */
	getDiskHtml:function(){
          var html = [];
		  html.push('<div style="display:'+(this.showType==1?"none":"block")+'" id="diskList_div">');
		  html.push(' <div style="padding:15px 0;">');
		  html.push('<ul id="diskList" class="select-tx" style="border:0px">');
		  html.push('</ul></div></div>');
		  if (this.showType == 0) {
		  	this.getChildNodeHtml(-2, 0, "diskList");
		  }
		  return html.join("");
	},
	/***
	 * 绑定所有事件
	 */
	bindEvent:function(){
		var p = this;
		//绑定文件柜与文件中转站菜单
		jQuery(".diskControlMenu").click(function(){
			var type = jQuery(this).attr("type");
			jQuery(".diskControlMenu").removeClass("current");
			jQuery(this).addClass("current");
			if(type=="disk"){
				jQuery("#diskList_div").show();//显示网盘文件夹div
				jQuery("#tempDisk_div_list").hide();//隐藏中转站DIV
				if (jQuery("#diskList").find("li").length == 0) {
					p.getChildNodeHtml(-2, 0, "diskList");
				}else{
					jQuery("#noFileHtml").hide();
				}
				
			}else{
				jQuery("#diskList_div").hide();
				if (jQuery("#tempDisk_div_list").length>0 && jQuery("#tempDisk_div_list").html().length > 0) {
					jQuery("#tempDisk_div_list").show();
					jQuery("#noFileHtml").hide();
				}
				else {
					p.getTempDiskHtml();
				}
			}
		})
		//点击下一级文件夹
		jQuery("#diskList").click(function(event){
			 var target = jQuery(event.target);
			
			 if(event.target.nodeName=="A"){
			 	var pid = target.attr("id");
			 	var pList = jQuery("#diskList").find("[name='"+pid+"']");
			 	if(target.hasClass("i-hminus")){
					target.removeClass("i-hminus").addClass("i-sadd");
					pList.hide();
				}
				else{
					if(pList.length==0){
						p.getChildNodeHtml(pid, parseInt(target.attr("index")),target.parents("li:eq(0)"));
					}else{
						pList.show();
					}
					target.removeClass("i-sadd").addClass("i-hminus");
				}
			 }
		})
	},
	/**
	 * 得到文件中转站HTML
	 * @param {Object} data
	 */
	getTempDiskHtml:function(data){
		var p =this;
		this.queryTempDiskList(function(data){
			var dataList = data["var"].datalist;
			var html =[];
			html.push('<div class="LoadTip" id="tempDisk_div_list" style="padding-top: 10px;">');
			dataList=dataList[0].files;
			if(dataList.length==0){
				jQuery("#noFileHtml").show();
				return ;
			}else{
				jQuery("#noFileHtml").hide();
				html.push('<table width="100%" id="temp_table_list" class="enclosure_table storage-table">');
				html.push('<thead><tr>');
				html.push('<th style="width:28px;padding-left:20px;" class="jnotice_border_r">');
				html.push('<input type="checkbox" style="margin-left:8px;*margin-left:-1px" id="chkDisk_AllChecked"></th>');
				html.push('<th class="jnotice_border_r">');
				html.push('<a><em style="display: inline-block; width: 14px;"></em>文件名</a></th>');
				html.push('<th style="width:70px" class="size"><a>大小</a></th>');
				html.push('<th style="width:136px;border-right:medium none;" class="time"><a>剩余时间</a>');
				html.push('</th></tr></thead>');
				html.push('<tbody id="tempDisk_data_list">');
				for(var i = 0 ;i<dataList.length;i++){
					html.push('<tr>');
					html.push('<td width="28" style="padding-left:20px;"><input type="checkbox" style="margin:0 0 0 8px;_margin:0;" class="fl"  fileSize="'+dataList[i].size+'" shareTime="'+dataList[i].shareTime+'" fileName="'+dataList[i].fname+'" url="'+dataList[i].url+'" name="chkTempDisk" id="'+dataList[i].seqno+'"></td>');
					html.push('<td class="tf"><i class="'+Util.getFileClasssName(dataList[i].fname)+'" onclick="" style="margin:0 4px 0 0;"></i><span  class="filename_css" title="'+dataList[i].fname+'">'+dataList[i].fname.encodeHTML()+'</span></td>');
					html.push('<td width="70"><span class="pl_10">'+Util.formatSize(dataList[i].size,null,2)+'</span></td>');
					html.push('<td width="136"><span class="pl_10">'+p._getSurplusTime(dataList[i].shareTime)+'</span></td>');
					html.push('</tr>');
				}
				html.push('</tbody>');
				html.push('</table>')
			}
			html.push('</div>')
			jQuery("#disk_control_div").append(html.join(""));	
			
		jQuery("#chkDisk_AllChecked").click(function(){
			if(jQuery(this).is(":checked")){
				jQuery("#temp_table_list").find("input[name='chkTempDisk']").attr("checked","true");
			}else{
				jQuery("#temp_table_list").find("input[name='chkTempDisk']").removeAttr("checked");
			}
		})
		})		
	},
	/***
	 * 得到中转站的文件有效期
	 * @param {Object} shareTime
	 */
	_getSurplusTime:function(shareTime){
		var serverTime ="";
		var curtime = serverTime ? parent.Util.parseDate(serverTime) : new Date();
        var timeStr = "";
        var d = parent.Util.DateDiffMore(curtime, shareTime, "d");
        var h = 0;
        if (d > 0) {
            h = parent.Util.DateDiffMore(parent.Util.DateAdd("d", d, curtime), shareTime, "h");
            timeStr = d + "天" + h + "小时";
        }
        else {
            h = parent.Util.DateDiffMore(curtime,shareTime, "h");
            if (h > 0) 
                timeStr = h + "小时";
            else {
                var n = parent.Util.DateDiffMore(curtime, shareTime, "n");
                if (n > 0) 
                    timeStr = n + "分钟";
                else 
                    timeStr = "不足1分钟"
            }
        }
		return timeStr;
	},
	/***
	 * 得到当前文件夹下的子文件
	 * @param {Object} fileId
	 * @param {Object} index
	 * @param {Object} bindId
	 */
	getChildNodeHtml:function(fileId,index,bindId){
		var data={
			"diskType":1,
			"status":1,
			"parentId":fileId
		}
		var html =[];
		var p =this;
		this.queryDiskList(data,function(data){
			var diskList = data["var"].resultList;
			 for(var i = 0;i<diskList.length;i++){
			 	var fileType_ico ="i-sadd";
				if(diskList[i].fileType==2 || diskList[i].fileCount == 0){
					fileType_ico +=" v-hidden ";
				}
				html.push(p.singDiskHtml.format(diskList[i].fileType==1?"display:none":""
				,diskList[i].fileType==1?"folder":Util.getFileClasssName(diskList[i].fileName)
				,diskList[i].fileName
				,index==0?5:index*23
				,diskList[i].appFileId
				,index+1
				,fileId
				,fileType_ico
				,diskList[i].version
				));
			}
			jQuery("#noFileHtml").hide();
			if(diskList.length==0 && index==0){
				jQuery("#noFileHtml").show();
				jQuery("#tempDisk_div_up").hide();
				jQuery("#diskList_div").hide();
				return ;
			}
			if(typeof(bindId)=="string"){
				bindId = jQuery("#"+bindId);
				bindId.append(html.join(""));
			}else{
				bindId.after(html.join(""));
			}
			jQuery("#diskList_div").show();
		jQuery("#diskList").find("div").mouseover(function(){
			jQuery(this).addClass("on");
		})
		jQuery("#diskList").find("div").mouseout(function(){
			jQuery(this).removeClass("on");
		})
		})
	},
	/**
	 * 得到选中的结果
	 */
	getSelectResult:function(callback){
		var selDisk = [];
		//中转站文件
		jQuery("#temp_table_list").find("input[type='checkbox']").each(function(){
			var filename = jQuery(this).attr("filename");
			if (filename) {
				var url = jQuery(this).attr("url");
				var sharetime = jQuery(this).attr("sharetime");
				var filesize = jQuery(this).attr("filesize");
				var id = jQuery(this).attr("id");
				if (jQuery(this).is(":checked")) {
					selDisk.push({
						name: filename,
						size: filesize,
						url: url,
						id: id,
						shareTime: sharetime
					})
				}
			}
		})
		//网盘
		var reqDiskList = [];
		jQuery("#diskList").find("input[type='checkbox']").each(function(){
			var id = jQuery(this).attr("id");
			var version = jQuery(this).attr("version");
			if(jQuery(this).is(":checked")){
				reqDiskList.push({
					appFileId:id,
					fileVersion:version
				})
			}
		})
		if (reqDiskList.length > 0) {
			this.queryDiskLink({
				"diskType": 1,
				"comeFrom": 10,
				"extCodeFlag": 0,
				"fileIdList": reqDiskList
			}, function(data){
				var list = data["var"].chailInfos;
				for (var j = 0; j < list.length; j++) {
					selDisk.push({
						name: list[j].fileName,
						size: list[j].fileSize,
						url: list[j].chainUrl,
						id: Math.ceil(Math.random()*10000000)
					//shareTime:list[j].fileName,
					})
				}
				//jQuery("#divDialogconfirmdiskListContrOl").remove();
				//CC.closeMsgBox("confirmdiskListContrOl");
				callback(selDisk);
				
			})
		}else{
			//jQuery("#divDialogconfirmdiskListContrOl").remove();
			//CC.closeMsgBox("confirmdiskListContrOl");
			callback(selDisk)
			
		}
		
	},
	queryDiskList:function(data,callback){
		var obj={
			"url":gMain.urlCloudp+'/service/disk/search.do',
			"func":'disk:search',
			"isNotAddUrl":true,
			"data":data,
			call:callback
		}
		MM.doService(obj)
	},
	queryTempDiskList:function(callback){
		var obj={
			"url":gMain.webPath+'/service/disk//userdisk.do',
			"func":'disk:listFileByEml',
			"isNotAddUrl":true,
			"data":{
				"diskType":3,
				"isSubFile":1,
				"isSubDir":1,
				"orderField":"share_time"
			},
			call:callback
		}
		MM.doService(obj)
	},
	/***
	 * 得到网盘的下载连接地址
	 * @param {Object} data
	 * @param {Object} callback
	 */
	queryDiskLink:function(data,callback){
		var obj={
			"url":gMain.urlCloudp+'/service/share/fileshare.do',
			"func":'share:addChain',
			"isNotAddUrl":true,
			"data":data,
			call:callback
		}
		MM.doService(obj)
	}
}
