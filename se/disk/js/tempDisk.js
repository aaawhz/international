/***
 * @description 暂存柜
 * @auth tangl
 */
var tempDisk = {
    diskType: 3,//0、我的网盘，3、暂存柜
    url: "/disk/userdisk.do", //AJAX请求URL
    seachData: {},
    orderby: "desc",
    orderField: "share_time",
    key: "",
    searchStr: "请输入搜索关键字",
    listData: [],
    //diskImplType: $("#diskImplType").val(),
    loadHTML: function(){
        var p = this;
        var keyval = jQuery("#seachKey").val() == p.searchStr ? "" : jQuery("#seachKey").val();
        p.seachData = {
            diskType: p.diskType,
            isSubDir: 1,
            isSubFile: 1,
            orderby: p.orderby,
            orderField: p.orderField,
            key: keyval
        };
        p.Ajax("disk:listFileByEml", p.seachData, function(d){
            if (d.code == "S_OK") {
                var data = d["var"].datalist[0];
                p.listData = data.files;
                var html = [];
                /*html.push("<table width=\"100%\" class=\"enclosure_table storage-table\">");
                 html.push("<thead>");
                 html.push("<tr>");
                 html.push("<th style=\"width:28px;padding-left:0;\" class=\"jnotice_border_r\"><input type=\"checkbox\" onclick=\"MM['attachList'].checkedBoxAll(this);\" style=\"margin-left:3px;*margin-left:-3px\" id=\"checkBox_mid_AllChecked\"></th>");
                 html.push("<th class=\"jnotice_border_r\"><a onclick=\"tempDisk.sortList('object_name',this)\" href=\"#\" title=\"点击可按此排序\"><em style=\"display: inline-block; width: 14px;\"></em>文件名</a><i class=\""+p.getSotrCss("object_name")+"\" id=\"listMailSortIcon_name\"></i></th>");
                 html.push("<th style=\"width:70px\" class=\"size\"><a onclick=\"tempDisk.sortList('object_size',this)\" href=\"#\" title=\"点击可按此排序\">大小</a><i class=\""+p.getSotrCss("object_size")+"\" id=\"listMailSortIcon_size\"></i></th>");
                 html.push("<th style=\"width:136px;border-right:medium none;\" class=\"time\"><a onclick=\"tempDisk.sortList('share_time',this)\" href=\"#\" title=\"点击可按此排序\">有效时间</a><i class=\""+p.getSotrCss("share_time")+"\" id=\"listMailSortIcon_shareTime\"></i></th>");
                 html.push("</tr>");
                 html.push("</thead>");
                 html.push("<tbody>");*/
                if (data.files && data.files.length > 0) {
					jQuery("#temp_notData").hide();
					jQuery("#temp_table_list").show();
                    for (var i = 0; i < data.files.length; i++) {
                        var item = data.files[i];
                        var curtime = serverTime ? parent.Util.parseDate(serverTime) : new Date();
                        ;
                        var timeStr = "";
                        var d = parent.Util.DateDiffMore(curtime, item.shareTime, "d");
                        var h = 0;
                        if (d > 0) {
                            h = parent.Util.DateDiffMore(parent.Util.DateAdd("d", d, curtime), item.shareTime, "h");
                            timeStr = d + "天" + h + "小时";
                        }
                        else {
                            h = parent.Util.DateDiffMore(curtime, item.shareTime, "h");
                            if (h > 0) 
                                timeStr = h + "小时";
                            else {
                                var n = parent.Util.DateDiffMore(curtime, item.shareTime, "n");
                                if (n > 0) 
                                    timeStr = n + "分钟";
                                else 
                                    timeStr = "不足1分钟"
                            }
                        }
                        var extension = item.fname.substr(item.fname.lastIndexOf(".") + 1);
                        html.push("<tr>");
                        html.push("<td width=\"28\"><input type=\"checkbox\" id=\"\" name=\"checkBox_mid\" dir=\"1\" value=\"" + item.seqno + "\" class=\"fl\" style=\"margin:0 0 0 8px;_margin:0;\"></td>");
                        html.push("<td><i style='margin:0 4px 0 0;' onclick=\"\" class=\"" + parent.Util.getFileExtensionCss(extension) + "\"></i>");
                        html.push("<a title=\"" + item.fname + "\" class=\"filename_css\" href=\"#\">" + (item.fname.length > 20 ? item.fname.substr(0, 20) + "..." : item.fname) + "</a>");
                        html.push("</td>");
                        html.push("<td width=\"70\"><span class=\"pl_10\">" + parent.Util.formatSize(item.size, null, 2) + " </span></td>");
                        html.push("<td width=\"136\"><span class=\"pl_10\">" + timeStr + "</span></td>");
                        html.push("</tr>");
                    }
					jQuery("#tempDisk_data_list").html(html.join(""));					
                }
                else {
                	/*
					html.push('<div class="rebackwrap">');
          			html.push('<p>暂无文件，你可以从电脑选择文件添加上传</p>');
         			html.push('<p class="pt_5"><a id="temp_ReturnUp" class="n_btn" href="javascript:fGoto();"><span><span>返回上传</span></span></a></p>');
       				html.push('</div>');
					jQuery("#temp_Storage_List").html(html.join(""));
					*/
					//jQuery("#temp_Storage_List").height(350);
					jQuery("#temp_notData").show();
					jQuery("#temp_table_list").hide()
					var returnUp = document.getElementById("temp_ReturnUp");
					if (returnUp) {
						document.getElementById("temp_ReturnUp").onclick = function(){
							p.showUp();
						};
					}
                }
                /*html.push("</tbody>");
                 html.push("</table>");*/
            }
        });
    },
    loadEvent: function(){
        var p = this;
        document.getElementById("tempDisk_li_list").onclick = function(){
            p.showList();
        };
        document.getElementById("tempDisk_li_up").onclick = function(){
            p.showUp();
        };
        document.getElementById("checkBox_mid_AllChecked").onclick = function(){
            p.checkedAll();
        };
		
        var txt = document.getElementById("seachKey");
        txt.maxLength = 30;
        
        var sk = p.searchStr;
        txt.value = sk;
        
        var btn = document.getElementById("btnSearch");
        txt.onclick = function(){
            if (this.value == sk) {
                this.value = "";
            }
            jQuery(this).attr("style", "color: black;");
        };
        txt.onblur = function(){
            if (this.value == "") {
                jQuery(this).removeAttr("style");
                this.value = sk;
            }
        };
        $(txt).keyup(function(e){
            //var ev = parent.EV.getEvent(e);			
            if (e.keyCode == 13) {
                btn.onclick();
            }
        });
        
		var isFlash = p.flashChecker().f;	
		var isControl=p.check();
		var isHtml5=p.checkHtm5();
		if(window.ActiveXObject&&isControl){ //control
			jQuery('#ifrmHistory').attr('src',parent.gMain.webPath+'/se/disk/celerityupload.do?sid='+parent.gMain.sid+'&diskType=3&from=mail');
		}else if(isHtml5){ //html5
			jQuery('#ifrmHistory').attr('src',parent.gMain.webPath+'/se/disk/celerityupload.do?sid='+parent.gMain.sid+'&diskType=3&from=mail&type=html5');
		}else{
			if(!isFlash){
				var html = [];
				html.push('<div class="ta_c intall_t" style="height:200px;padding-top:93px;background-color:#fff;">');
	         	html.push('<p>上传本地文件请先安装邮箱小工具</p>');
	        	html.push('<a href="'+parent.gMain.resourceServer+'/se/mail/activex/MailThinkmail_Tool.exe" class="n_btn"><span><span>立即安装</span></span></a></div>');
				jQuery("#tempDisk_div_up").html(html.join(""));
			}else{
				jQuery('#ifrmHistory').attr('src',parent.gMain.webPath+'/se/disk/flashupload.do?sid='+parent.gMain.sid+'&diskType=3&up=1&from=mail');
			}
		}
		
    },
    seachFile: function(){
        var p = this;
        var keyval = jQuery("#seachKey").val();
        p.key = keyval;
        p.loadHTML();
    },
    showList: function(){
        jQuery("#tempDisk_li_list").addClass("r current");
        jQuery("#tempDisk_li_up").removeClass("r current");
        jQuery("#tempDisk_div_up").hide();
        jQuery("#tempDisk_div_list").show();
        this.loadHTML();
    },
    showUp: function(){
        jQuery("#tempDisk_li_up").addClass("r current");
        jQuery("#tempDisk_li_list").removeClass("r current");
        jQuery("#tempDisk_div_list").hide();
        jQuery("#tempDisk_div_up").show();
    },
    getSotrCss: function(cname){
        var p = this;
        if (p.orderField == cname) {
            return p.orderby;
        }
        return "";
    },
    sortList: function(cName, obj){
        var p = this;
        var className = "asc";
        if (p.orderby == "asc") {
            p.orderby = "desc";
            className = "desc";
        }
        else {
            p.orderby = "asc";
        }
        jQuery("#listMailSortIcon_size").removeClass("asc");
        jQuery("#listMailSortIcon_size").removeClass("desc");
        jQuery("#listMailSortIcon_name").removeClass("asc");
        jQuery("#listMailSortIcon_name").removeClass("desc");
        jQuery("#listMailSortIcon_shareTime").removeClass("asc");
        jQuery("#listMailSortIcon_shareTime").removeClass("desc");
        jQuery("#" + obj).addClass(className);
        p.orderField = cName;
        p.loadHTML();
        
    },
    checkedAll: function(){
        var checked = document.getElementById("checkBox_mid_AllChecked").checked;
        jQuery("[name='checkBox_mid']").attr("checked", checked);
        if (checked) {
        
        }
        else {
        
        }
    },
    getSelectedList: function(){
        var selectList = [];
        var p = this;
        jQuery("[name='checkBox_mid']").each(function(){
            //if ($(this).attr("checked") == true) {
            if (this.checked == true) {
                var reItem = p.findSelectedItem(parseInt($(this).val()));
                selectList.push({
                    id: reItem.seqno,
                    name: reItem.fname.decodeHTML(),
                    size: reItem.size,
                    url: reItem.url,
                    shareTime: reItem.shareTime
                });
            }
        });
        return selectList;
    },
    findSelectedItem: function(seqno){
        var p = this;
        var returnVal = [];
        for (var i = 0; i < p.listData.length; i++) {
            if (seqno == p.listData[i].seqno) {
                returnVal = p.listData[i];
                break;
            }
        }
        return returnVal;
    },
    selectedOk: function(){
        var p = this;
        var curSelected = jQuery("#tempDisk_li_up").attr("class");
        var obj = [];
        if ("r current" == curSelected) {
        	if(window.frames["ifrmHistory"].upcom){ //flash
        		var okList = window.frames["ifrmHistory"].upcom.getUploadSuccessList();
                for (var i = 0; i < okList.length; i++) {
                    var item = okList[i];
    				var json = eval("(" + item.fileId + ")");
                    obj.push({
                        id: "",
                        name: item.fileName,
                        size: item.fileSize,
                        url: json.shareUrl,
    					shareTime : json.validateTime
                    });
                }
        	}else if(window.frames["ifrmHistory"].UploadApp){ //控件
        		var okList = window.frames["ifrmHistory"].UploadApp.getUploadSuccessList();
                for (var i = 0; i < okList.length; i++) {
                    var item = okList[i];
                    obj.push({
                        id: "",
                        name: item.name,
                        size: item.size,
                        url: item.shareUrl,
    					shareTime : item.validateTime
                    });
                }
        	}else if(window.frames["ifrmHistory"].html5Upload){ //html5
        		var okList = window.frames["ifrmHistory"].html5Upload.getUploadSuccessList();
                for (var i = 0; i < okList.length; i++) {
                    var item = okList[i];
                    obj.push({
                        id: "",
                        name: item.name,
                        size: item.size,
                        url: item.shareUrl,
    					shareTime : item.validateTime
                    });
                }
        	}
        }
        else {
            obj = p.getSelectedList();
        }
        try {
            if(window.frames["ifrmHistory"].UploadApp){ //控件
            	if(window.frames["ifrmHistory"].UploadApp.checkUploading()){
        			if(window.confirm('还有文件正在上传，确认要关闭吗？')){
        				attachFill(obj);
                        window.frames["ifrmHistory"].UploadApp.closeUpload();
                        parent.CC.closeMsgBox('attachFromTempDisk');
        			}
        		}else{
        			attachFill(obj);
                    window.frames["ifrmHistory"].UploadApp.closeUpload();
                    parent.CC.closeMsgBox('attachFromTempDisk');
        		}
            }else if(window.frames["ifrmHistory"].html5Upload){ //html5
            	if(window.frames["ifrmHistory"].html5Upload.checkUploading()){
        			if(window.confirm('还有文件正在上传，确认要关闭吗？')){
        				attachFill(obj);
                        window.frames["ifrmHistory"].html5Upload.close();
                        parent.CC.closeMsgBox('attachFromTempDisk');
        			}
        		}else{
        			attachFill(obj);
                    window.frames["ifrmHistory"].html5Upload.close();
                    parent.CC.closeMsgBox('attachFromTempDisk');
        		}	
            }else{
            	attachFill(obj);
                parent.CC.closeMsgBox('attachFromTempDisk');
            }
            
            
        } 
        catch (ex) {}
        
        //填充上传的附件
        function attachFill(obj){
        	var attach = parent.window.frames[parent.gConst.ifrm + parent.GE.tab.curid].window.attach;
            attach.tempDiskCall(obj);
        }
    },
    cancel: function(){
    	if(window.frames["ifrmHistory"].UploadApp){ //控件
    		if(window.frames["ifrmHistory"].UploadApp.checkUploading()){
    			if(window.confirm('还有文件正在上传，确认要关闭吗？')){
    				window.frames["ifrmHistory"].UploadApp.closeUpload();
    				parent.CC.closeMsgBox('attachFromTempDisk');
    			}
    		}else{
    			window.frames["ifrmHistory"].UploadApp.closeUpload();
    			parent.CC.closeMsgBox('attachFromTempDisk');
    		}
    	}else if(window.frames["ifrmHistory"].html5Upload){ //html5
    		if(window.frames["ifrmHistory"].html5Upload.checkUploading()){
    			if(window.confirm('还有文件正在上传，确认要关闭吗？')){
    				window.frames["ifrmHistory"].html5Upload.close();
    				parent.CC.closeMsgBox('attachFromTempDisk');
    			}
    		}else{
    			window.frames["ifrmHistory"].html5Upload.close();
    			parent.CC.closeMsgBox('attachFromTempDisk');
    		}	
    	}else{
    		parent.CC.closeMsgBox('attachFromTempDisk');
    	}
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
    /**
     * AJAX请求通用方法
     * @param {Object} func
     * @param {Object} data
     * @param {Object} callback
     */
    Ajax: function(func, data, callback, failCall){
        var p = this;
        failCall = failCall ||
        function(d){
            parent.CC.alert(d.summary);
        };
        parent.MM.doService({
            url: p.url,
            func: func,
            data: data,
            failCall: failCall,
            call: function(d){
                callback(d);
            },
            param: "",
            msg: "加载数据中."
        });
    }
};
