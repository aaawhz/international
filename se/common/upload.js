var UploadState = {
    init:0, 		// 0还未上传
    uploading:1,	// 1正在上传
    completed:3		// 3上传完成
}

var Upload = {
	state:UploadState.init,
	form:null,
	submitable:true,
	fileInput:null,
	doUpload:function(of,fn,cb,cf){
		var oForm = jQuery("#"+fn);
		var oFileInput = jQuery(of);
		var fileName = oFileInput.val();
		Upload.form = oForm;
		Upload.fileInput = oFileInput;
		if (oForm != null) {
			Upload.state = UploadState.uploading;
			if(typeof(cf)=="function"){
				cf();
			}
			if(Upload.submitable){
				if(typeof(cb)=="function"){
					cb();
				}
				oForm.submit();
			}
		}
	},
	onLoaded:function(obj,cb, fcb){
		var url = obj.src;
	    var win = obj.contentWindow;
	    try {
	        if(win && win.return_obj){
	            var data = win.return_obj;
	            if(data.code=="S_OK"){
	            	Upload.state = UploadState.completed;
	            	//重置上传表单
	            	obj.src = url;
	            	var file = win.return_obj["var"];
	            	if(typeof(cb)=="function"){
	    				cb(file);
	    			}
	                
	            }else{
	            	Upload.state = UploadState.completed;
	            	//重置上传表单
	            	obj.src = url;
	            	if(typeof(fcb)=="function"){
	    				fcb(data);
	    			}
	            	
	            }
	        }
	    } catch (e) {
		alert(e);
	    	Upload.state = UploadState.init;
	    }
	},
	getFileType:function(val){
		if(val!=null && val!=""){
			if(val.lastIndexOf(".")!=-1){
				return val.substring(val.lastIndexOf(".")+1);
			}else
				return "";
		}else
			return "";
	}
};

var Upload_onLoaded = Upload.onLoaded;

