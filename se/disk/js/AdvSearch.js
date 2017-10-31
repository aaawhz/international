/***
 * @description 文件柜高级搜索
 * @auth tangl
 */

var AdvSearch = {   
    PostURL: "/disk/userdisk.do",//AJAX请求URL
    postData: null, //post JSON数据
    fileTreeSelect : null,
	upLoadDateSelect : null,
	fileSizeSelect : null,
	fileTypeSelect : null,
    /**
     * 页面加载
     */
    init : function(data){
		var arry = [];
		arry.push(data["var"]);
		AdvSearch.fileTreeSelect.data = arry;
		$("#divFileTree").html(AdvSearch.fileTreeSelect.getHTML());
		AdvSearch.fileTreeSelect.loadEvent();
	},
	LoadEvent : function(){
		AdvSearch.fileTreeSelect = new DropSelect({
			id:"fileTreeSelect",
			data: [],
			type:"fileTree",
			//selectedValue:"0",
			width:283
		});
		
		AdvSearch.upLoadDateSelect = new DropSelect({
			id:"upLoadDateSelect",
			data:upLoadDateData,			
			selectedValue:"0",
			width:283,
            itemClick: function(value, text, obj){
                AdvSearch.ItemOnClick(value, text, obj);
            }
		});
		$("#divUpLoadDate").html(AdvSearch.upLoadDateSelect.getHTML());
		AdvSearch.upLoadDateSelect.loadEvent();
		
		AdvSearch.fileSizeSelect = new DropSelect({
				id:"fileSizeSelect",
				data:fileSizeData,				
				selectedValue:"0",
				width:283,
				itemClick : function(value,text,obj){
					AdvSearch.ItemOnClick(value,text,obj);
				} 
		});
		$("#divFileSize").html(AdvSearch.fileSizeSelect.getHTML());
		AdvSearch.fileSizeSelect.loadEvent();
		
		AdvSearch.fileTypeSelect = new DropSelect({
				id:"fileTypeSelect",
				data:fileTypeData,				
				selectedValue:"0",
				width:283,
				itemClick : function(value,text,obj){
					AdvSearch.ItemOnClick(value,text,obj);
				} 
		});
		$("#divFileType").html(AdvSearch.fileTypeSelect.getHTML());
		AdvSearch.fileTypeSelect.loadEvent();
	},
	LoadDate: function(){
		var sYear = $("#sYear");
		var sMonth = $("#sMonth");
		var sDay = $("#sDay");
		
		var eYear = $("#eYear");
		var eMonth = $("#eMonth");
		var eDay = $("#eDay");
		var getDayCount = function(y,m){
			return new Date(y,m,0).getDate();
		};		
		var sonchange = function(){
			var sy = sYear.val() - 0;
			var sm = sMonth.val() - 0;
			var dc = getDayCount(sy,sm);
			sDay.empty();			
			for(var i = 1;i <= dc;i++){
				sDay.append("<option value='{0}'>{0}</option>".format(i));				
			}		
		};
		var eonchange = function(){
			var sy = eYear.val() - 0;
			var sm = eMonth.val() - 0;
			var dc = getDayCount(sy,sm);
			eDay.empty();			
			for(var i = 1;i <= dc;i++){
				eDay.append("<option value='{0}'>{0}</option>".format(i));				
			}		
		};
		var sdate = 1900;
		var t = new Date();
		var cyear = t.getFullYear();
		var cmonth = t.getMonth();
		var cday = t.getDate();
		
		for (var i = cyear; i >= sdate; i--) {
			sYear.append("<option value='{0}'>{0}</option>".format(i));
			eYear.append("<option value='{0}'>{0}</option>".format(i));
		}
		sYear.val(cyear);
		eYear.val(cyear);
		
		for(var i =1;i<13;i++){
			sMonth.append("<option value='{0}'>{0}</option>".format(i));
			eMonth.append("<option value='{0}'>{0}</option>".format(i));
		}
		sMonth.val(cmonth+1);
		eMonth.val(cmonth+1);		
		
		var dayCount = getDayCount(cyear,cmonth);
		for(var i = 1;i <= dayCount;i++){
			sDay.append("<option value='{0}'>{0}</option>".format(i));
			eDay.append("<option value='{0}'>{0}</option>".format(i));
		}		
		sDay.val(cday);
		eDay.val(cday);
		
		sYear.change(function(){sonchange();});
		sMonth.change(function(){sonchange();});
		
		eYear.change(function(){eonchange();});
		eMonth.change(function(){eonchange();});
		
	},
    /**
     * 加载文件夹类别
     * @param {int} disktype 文件柜类别
     */
    LoadFolderTree: function(disktype){
		//判断是否有企业文件柜权限
		if (parent.GC.check("DISK_EP") == false) 
            $("#enterpriseDisk").hide();
        //判断是否共享文件柜权限
        if (parent.GC.check("DISK_SHARE") == false) 
            $("#shareDisk").hide();
		this.LoadDate();	
		this.LoadEvent();
        this.postData = {
            "diskType": disktype,
            "parentId": 0,
            "isSubDir": 1,
            "isSubFile": 0
        };
        callback = function(au){
            if (au.code == "S_OK") {
                var data = au["var"];
				AdvSearch.init(data);
            }
        }
        
        this.Ajax("disk:listFolder", this.postData,this.init);
    },
	ItemOnClick: function(value,text,obj){
		var name = $(obj).attr("name");
		if(name == "upLoadDateSelect"){
			if (value == "-1") {
				AdvSearch.upLoadDateSelect.setWidth(130);
				$("#div_Date").show();	
			}
			else{
				AdvSearch.upLoadDateSelect.setWidth(283);
				$("#div_Date").hide();
			}
		}else if(name == "fileSizeSelect"){
			if (value == ">=" || value == "<=") {
				AdvSearch.fileSizeSelect.setWidth(130);
				$("#div_FileSize").show();	
			}
			else{
				AdvSearch.fileSizeSelect.setWidth(283);
				$("#div_FileSize").hide();
			}
		}else if(name == "fileTypeSelect"){
			if (value == "-1") {
				AdvSearch.fileTypeSelect.setWidth(130);
				$("#div_FileType").show();	
			}
			else{
				AdvSearch.fileTypeSelect.setWidth(283);
				$("#div_FileType").hide();
			}	
		}		
	},
    SearchOnClick: function(){
        var key = "";
        var isUpperCase = "1";
        var diskType = "";
        var isSubDir = "1";
        var upTimeType = "0";
        var startUploadTime = "";
        var endUploadTime = "";
        var sizeOperator = "";
        var fileSize = "";
        var fileType = "[0]";
        var curPage = "1";
        var pageSize = "20";
        
        if ($("#txt_key").val()) {
            var reg = /\'/g;
            key = $("#txt_key").val();
            key = key.replace(reg, "\\'");
            if (key.indexOf("\"") != -1) {
                parent.CC.alert(AdvLang.keyErr);
                return;
            }
        }
        if ($("#cb_isUpperCase").attr("checked") == true) {
            isUpperCase = 0;
        }
        else {
            isUpperCase = 1;
        }
        
        diskType = AdvSearch.fileTreeSelect.getValue();
        //isSubDir = $("#cb_isSubDir").attr("checked") == true ? 0 : 1;
        isSubDir =  document.getElementById("cb_isSubDir").checked == true ? 0 : 1;
        upTimeType = AdvSearch.upLoadDateSelect.getValue();
        if (upTimeType == "-1") {
			upTimeType = 4;
            startUploadTime = $("#sYear").val() + "-" + $("#sMonth").val() + "-" + $("#sDay").val();
            endUploadTime = $("#eYear").val() + "-" + $("#eMonth").val() + "-" + $("#eDay").val();
            //var intstartUploadTime = parseInt($$("sYear").value + $$("sMonth").value + $$("sDay").value);
            //var intendUploadTime = parseInt($$("eYear").value + $$("eMonth").value + $$("eDay").value);
            var sd = parent.Util.parseDate(startUploadTime.replace(/-/g, "/"));
			var ed = parent.Util.parseDate(endUploadTime.replace(/-/g, "/"));
			var mCount = parent.Util.DateDiffMore(sd,ed,"d");
			
            if (mCount < 0) {
                parent.CC.alert(AdvLang.dateErr);
                return;
            }
			startUploadTime = sd.format("yyyy-mm-dd");
			endUploadTime = ed.format("yyyy-mm-dd");
        }
        
        
		var tempSizeOperator = AdvSearch.fileSizeSelect.getValue();
        if (tempSizeOperator != "0") {
			sizeOperator = tempSizeOperator;
            if (sizeOperator == "<=" || sizeOperator == ">=") {
                var size = $("#txt_size").val();
                if (!size) {
                    parent.CC.alert(AdvLang.sizeNull);                    
                    return;
                }
                if (/[^\d]/.test(size)) {
                    parent.CC.alert(AdvLang.sizeErr);                    
                    return;
                }
                //sizeOperator = $$("sizeWhere").value;
                fileSize = parseInt(size) * 1024;
            }
            else {
                var f = sizeOperator.substring(0, 1);
                var size = sizeOperator.substring(1);
                sizeOperator = f;
                fileSize = size;
            }
        }
        
        var tempFileType = AdvSearch.fileTypeSelect.getValue();
        if (tempFileType == "-1") {	
			var tempstr = "";	   
           $("input[name='c_filetype']:checked").each(function(){
		   		tempstr += this.value + ","; 
		   }); 
		   if(tempstr){
		   		tempstr = tempstr.substr(0,tempstr.length -1);
				fileType = "["+tempstr+"]";
		   }		   
        }
		else{
			fileType = "["+tempFileType+"]";
		}
		
        var html = [];
        html.push("{");
        html.push("'key':'" + escape(key) + "',");
        html.push("'isUpperCase':" + isUpperCase + ",");
        html.push("'diskType':0,");
        html.push("'searchRange':" + diskType + ",");
        html.push("'isSubDir':" + isSubDir + ",");
        html.push("'isViewFolder':1,");
        html.push("'uploadTimeType':" + upTimeType + ",");
        html.push("'startUploadTime':'" + startUploadTime + "',");
        html.push("'endUploadTime':'" + endUploadTime + "',");
        html.push("'sizeOperator':'" + sizeOperator + "',");
        html.push("'fileSize':'" + fileSize + "',");
        html.push("'fileType':" + fileType + ",");
        html.push("'curPage':1,");
        html.push("'pageSize':20");
        //html.push("'orderField':'id',");
        //html.push("'orderBy':'desc'");
        html.push("}");
        
        window.location.href = "indexdisk.do?sid="+parent.gMain.sid+"&data=" + html.join("");
    },
	/**
     * Ajax请求
     * @param {Object} func
     * @param {Object} data
     * @param {Object} callback
     */
    Ajax: function(func, data, callback,fcall){
		var failCall = function(d){
                if (d.summary) 
                    parent.CC.alert(d.summary);
        };
        parent.MM.doService({
            url: AdvSearch.PostURL,
            func: func,
            data: data,
			//async : false,
            failCall: fcall || failCall,
            call: function(d){
                callback(d);
            },
            param: ""
        });
    }	
}

