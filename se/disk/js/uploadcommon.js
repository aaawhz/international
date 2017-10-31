var upcom = {};
upcom.emid = "";
upcom.sid = "";
upcom.userNumber = "";
upcom.flashGetUploadUrl = "";
upcom.uploadSize = 0;
upcom.prjtype = 2;
upcom.isUploaded = false; //为ture表示用户至少上传成功过一个文件
upcom.swf = null; //swf上传对象
upcom.State = null;
/**
* 上传类型 0=控件上传 1=falsh上传 2=普通上传
*/
upcom.uptype = 1;
/**
*初始化上传信息
*/
upcom.init = function(id) {
	var diskType = diskList.getQueryString("diskType") || "0";
    //初始化全局参数
    upcom.emid = id || "divFlashLayer";
    upcom.sid = diskList.getQueryString("sid");
    upcom.userNumber = "";
    upcom.flashGetUploadUrl = $("#dfsUploadUrl").val() + "?diskType=" +diskType+ "&sid=" + upcom.sid ; //DiskTool.resolveUrl("getFlashUploadUrl", true);
    upcom.flashCallbackUrl = $("#dfsUploadUrl").val() + "?diskType=" +diskType+ "&sid="; //DiskTool.resolveUrl("flashPreUpload", true);
    upcom.uploadSize = $("#maxFileSize").val();
    upcom.uptype = upcom.checkinfo();
    //1: 文件快递 2:手机网盘
    upcom.prjtype =diskList.getQueryString("diskType") == "3"? 1 : 2;	   
    switch (upcom.uptype) {
        case 0:
            break;
        case 1:
        	if(upcom.flashChecker().f){
        		jQuery('#flashupload_area').show();
        		jQuery('#noflashcontrol').hide();
        		upcom.init_flash();
        	}else{
        		jQuery('#flashupload_area').hide();
        		jQuery('#noflashcontrol').show();
        	}
            break;
        case 2:
            break;
        default:
            break;
    }
}
/**
* 检查上传环境 0=控件上传 1=falsh上传 2=普通上传
*/
upcom.checkinfo = function() {
    return 1;
}
/**
* flash上传初始化
*/
upcom.init_flash = function() {
    var url = "../../static/se/disk/richinfo_upload.swf?rnd=" + Math.random();
   
    //初始化flash
    var swf = new SWFObject(url, "flashUpload", 490, 300);
    swf.addParam("quality", "high");
    swf.addParam("swLiveConnect", "true");
    swf.addParam("menu", "false");
    swf.addParam("allowScriptAccess", "always");
    swf.addParam("wmode", "transparent");
    swf.write(upcom.emid);
    upcom.swf = document.getElementById("flashUpload");

}
/**
* 上传需要的参数集合
*/
upcom.getParameter = function() {
    var args = {};
    switch (upcom.uptype) {
        case 0:
            break;
        case 1: /*flash上传所需要的参数*/
            //设置
            args.threads = 2;      //线程数
            args.sid = upcom.sid;         //sid
            args.phoneNumber = upcom.userNumber; //userNumber
            args.getUploadUrl = upcom.flashGetUploadUrl; /*请求上传地址URL*/
            args.uploadCallbackUrl = upcom.flashCallbackUrl; /*上传成功后更新本地数据库url*/
            args.type = upcom.prjtype;         /*类型 1:文件快递 2.网盘上传*/
            args.singleFileSizeLimit = upcom.uploadSize; //单文件上传大小限制单位字节
            args.tipTxtBlock = ""; /*提示文字块，默认值为"",文件快递要有值*/
            args.isShowMinImg = true; //是否显示小图(缩略图)
            args.showMinImgSizeLimit = 5 * 1024 * 1024; //显示小图(缩略图)大小限制
            args.maxSelectFile = $("#maxFileCount").val(); //最大选择文件个数
            args.fileNameLength = $("#maxFileNameLength").val(); //文件名长度限制	
            if (upcom.prjtype == 1) {
            	args.tipTxtBlock = "* 支持同时上传多个文件，每个文件最大为"+ top.Util.formatSize(upcom.uploadSize, null, 2)+"；\n\n* 上传的文件，自动保存到文件中转站；\n\n* 中转站内的文件可存放"+$("#maxValidateDay").val()+"天，您可以随时续期；\n\n* 如果您删除了文件或文件已过期，收件人将无法下载；";
            }
            //标题提示语
            args.tipTxt = flashLang.flash_prompt;//提示
            args.moreTxt = flashLang.flash_info;//信息
            args.singleFileTxt = "";//flashLang.flash_max_file;//(单文件最大|0|)
            
            args.success=flashLang.flash_Success;//成功
            args.cancel=flashLang.flash_Cancel;//取消
            args.tryAgain=flashLang.flash_try_again; //重试
            args.inDetail=flashLang.flash_detail;//详细
            
            args.file = flashLang.flash_file;//文件
            args.uploadFailed = flashLang.flash_upload_fail_tip;//上传失败
            args.addFile = flashLang.flash_add_file;//添加文件

            //选择文件错误提示语
            args.getDirTypeError = flashLang.flash_get_file_fail;//获取上传文件目录与限制上传文件类型数据失败！
            args.maxSelectFileError = flashLang.flash_upload_more_files;//对不起，一次最多只能上传|0|个文件，请重新选择！
            args.sizeMinError = flashLang.flash_upload_file_size_zero;//您添加的文件\"|0|\"大小为0, 不能上传！
            args.sizeMaxError = flashLang.flash_upload_file_size_more;//您添加的文件\"|0|\"大于|1|, 不能上传！
            args.nameLongError = flashLang.flash_file_name_length;//您添加的文件\"|0|\"文件名过长, 不能上传！
            args.typeError = flashLang.flash_file_type_error;//您添加的文件\"|0|\"类型不对, 不能上传！

            //上传错误提示语
            args.userCancelError = flashLang.flash_upload_fail;//上传失败，用户取消上传！
            args.getUploadUrlError = flashLang.flash_upload_url_null;//请求上传地址URL为空错误！

            args.getUploadUrlLoaderSecurityError = flashLang.flash_upload_url_fail;//请求上传地址失败，crossdomain错误！
            args.getUploadUrlLoaderIoError = flashLang.flash_upload_url_fail_io;//请求上传地址失败，IO错误！
            args.getUploadUrlLoaderLoadError =flashLang.flash_upload_url_fail_load;//请求上传地址失败，LOAD错误！
            args.getUploadUrlLoaderReturnError = flashLang.flash_upload_url_fail_value;//请求上传地址错误，返回值错误|0|！
		
            args.uploadUrlSecurityError = flashLang.flash_upload_dfs_fail;//上传分布式失败，crossdomain错误！
            args.uploadUrlIoError = flashLang.flash_upload_dfs_fail_io;//上传分布式失败，IO错误！
            args.uploadUrlUpLoadError = flashLang.flash_upload_dfs_fail_up;//上传分布式失败，UPLOAD错误！
            args.uploadUrlReturnError = flashLang.flash_upload_dfs_fail_value;//上传分布式错误，返回值错误|0|！

            args.updateDatabaseUrlLoaderSecurityError = flashLang.flash_upload_db_fail;//更新数据库失败，crossdomain错误！
            args.updateDatabaseUrlLoaderIoError = flashLang.flash_upload_db_fail_io;//更新数据库失败，IO错误！
            args.updateDatabaseUrlLoaderLoadError = flashLang.flash_upload_db_fail_load;//更新数据库失败，LOAD错误！
            args.updateDatabaseUrlLoaderReturnError = flashLang.flash_upload_db_fail_value;//更新数据库错误，返回值错误|0|！
            break;
        case 2:
            break;
    }
    return args;
}
/**
* flash回调有上传成功的文件
* @param {Object} val
*/
upcom.Uploaded = function(val) {
    upcom.isUploaded = val;
}
/**
*flash回调的上传状态
*/
upcom.setUploadState = function(obj) {
    upcom.State = obj;
	if(upcom.State &&  !upcom.State.isUploading){
		if(diskList.getQueryString("diskType") == "3"){
			parent.GMC.getFrameWin('outLink_diskTemp').diskList.getFolderList();
		}else {
			parent.GMC.getFrameWin('outLink_diskMine').diskList.getFolderList(); 
		}
		   	
		$("#aUploadCloseBtn").val(flashLang.flash_finish);
    }
}
/**
*取得flash上传成功的文件列表
*/
upcom.getUploadSuccessList = function() {
    if (upcom.swf == null) return [];
    return upcom.swf.getUploadSuccessList();
}

upcom.flashChecker=function(){
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
}



