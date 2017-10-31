window.UploadModel={
    defaults: {
        currentFile: {
            clientTaskno: "",
            name: "",
            size: "",
            fileMd5: "",
            state: "",
            sendSize: "",
            totalSize: "",
            speed: "",
            surplusTime: "",
            responseText: "",
            isContinueUpload: "",
            process:''
        },
        curConditionType: "disk",
        isStop: false
    },
    userDiskUrl:'/disk/userdisk.do',
    monitorIntervalId: null,
    name: "",
    randomNumbers: {},
    fileListEle: {},//上传列表dom引用
    fileUploadSuc: [],//上传成功文件
    hasUploadTask:[], //已经上传过的任务
    maxUploadSize: 50 * 1024 * 1024,
    installToolUrl: top.gMain.resourceServer+'/se/mail/activex/MailThinkmail_Tool.exe',
    params: {
        DISPERSED_SERVER_CODE: {
            "SUC_UPLOAD": "0"//上传分布式成功
        },
        MIDDLE_SERVER_CODE: {
            "S_OK"  : "上传文件成功！",
            "S_ERR" : "上传失败！"
        }
    },

    msg: {
        NOUPLOAD:"unable to compute",
        UPLOADFAIL:"There was an error attempting to upload the file!",
        UPLOADCANCEL:"The upload has been canceled by ther user or ther browser dropped the connection."
    },

    installActivexTemplete: ['<div class="tips delmailTips netpictips" id="setupToolContainer" style="width:304px;">',
        '<a hidefocus="1" class="delmailTipsClose" href="javascript:void(0)" id="closeSetupTool"><i class="i_u_close"></i></a>',
        '<div class="tips-text">',
        '<div class="imgInfo">',
        '<a hidefocus="1" class="imgLink imgAttch" href="javascript:void(0)" title="图片"><img src="../../images/module/FileExtract/attrch.png"></a>',
        '<dl class="attrchUp"> ',
        '<dt><strong>支持极速上传，大文件上传更加稳定！</strong></dt>',
        '<dd><span class="mr_10"><i class="i_done mr_5"></i>高速秒传</span> <span><i class="i_done mr_5"></i>上传<span id="maxUploadSize">超</span>大文件</span></dd>',
        '<dd><span class="mr_10"><i class="i_done mr_5"></i>断点续传</span> <span><i class="i_done mr_5"></i>显示上传进度</span></dd>',
        '<dd class="mb_15"><a hidefocus="1" href="/m2012/controlupdate/MailThinkmail_Tool.exe" target="_blank" class="btnSetG"><span>安装139邮箱小工具</span></a></dd>',
        '</dl>',
        '</div>',
        '</div>',
        '<div class="tipsTop diamond"></div>',
        '</div>'].join(""),

    /**
     *上传模型公共代码
     *@constructs M2012.Compose.Model.StorageCabinet
     *@param {Object} options 初始化参数集
     *@example
     */
    initialize : function (options) {
    	this.maxUploadSize=options.perSize;
    	this.controler=options.controler;
        this.setConditionType(options.type);
        this.dataSource = {};// 接口返回的原始数据
    },
    //自定义事件
    on: function (eventType, callback) {
        this[eventType] = callback;
    },
    //执行自定义事件
    trigger: function (command, options) {
        this[command].call(this, options);
    },
    setConditionType: function (type) {
    	this.defaults.curConditionType=type ? type : "disk";
    },

    getUploadInterface: function(){
        return this.defaults.curConditionType + ":upload";
    },

    getResumeInterface: function(){
        return this.defaults.curConditionType + ":upload";
    },

    getUploadKey: function (file, callback) {
        var self = this;
        var curConditionType = self.defaults.curConditionType;

        var data = {
        	appFileId:'',
        	comeFrom : 1,
        	upType   : 2,
        	parentId : -1,
        	fileSize : file.size,
        	objectName : file.name,
        	fileMd5  : file.fileMd5
        };

        var result = {};
        var uploadInterfaceName = this.getUploadInterface();
        self.postJson(uploadInterfaceName, data, function (data) {
            var response = data;
            
            if(response.code=='DFS_118'){
            	var data=response["var"];
            	self.trigger("setDBtnAppFileid",data.appFileId);
            	var fileinfo={
        			appfileld:data.appFileId,
        			shareUrl:data.shareUrl,
        			clientTaskNo:self.defaults.currentFile.clientTaskno,
        			name:file.name,
        			size:file.size,
        			validateTime:data.validateTime
            	}
            	if(!self.hasFileUploadSuc(fileinfo.name)){
            		self.fileUploadSuc.push(jQuery.extend(true, {}, fileinfo));
            	}
            	self.trigger("complete",{fileSize: file.size});
            	self.controler.uploadNext();
            	return;
            }

            result.success = false;
            result.message = response.summary;
            if (response && response.code == "S_OK") {
                try {
                    var val = response["var"];
                    result.success = true;
                    result.status = response.code;
                    result.summary = response.summary;
                    result.urlUpload = val.fastUploadUrl;
                    result.businessId = val.fileId;
                    result.appFileId=val.appFileId;
                    result.fileMd5=file.fileMd5;

                    var fileInfo = {
                    	appFileId:val.appFileId,
                    	fileName:file.name,
                    	fileSize:file.size,
                    	fid:val.fileId,
                    	state:response.code,
                        summary:response.summary
                    }
                    result[curConditionType + "Info"] = fileInfo;  //将上传文件的相关信息存储起来
                    result.name = fileInfo.fileName || file.name;  //上传重复文件，需要取服务端的新文件名
                    
                    var postparam={
                    	cmd:val.cmd,
                    	type:val.type,
                    	version:val.version,
                    	comefrom:val.comeFrom,
                    	taskno:val.taskNo,
                    	fileid:val.fileId,
                    	middleurl:val.middleUrl,
                    	filesize:file.size,
                    	timestamp:val.timestamp,
                    	ssoid:val.ssoid,
                    	flowtype:val.flowType,
                    	userlevel:val.userLevel,
                    	usernumber:val.userNumber,
                    	filemd5:file.fileMd5,
                    	filename:file.name,
                    	fingerprint:val.fingerPrint
                    }

                    result.dataUpload =postparam;
                    result.dataUpload.ranges = "";//已经上传的文件片段，第一次上传rang为空
                } catch (ex) {
                    result.success = false;
                }
            } else {
                result.success = false;
            }

            callback && callback(result);
        }, function (d) {
            result.success = false;
            if(d && d.summary){
                result.message = d.summary;
            }
            if(d && d.code){
                result.code = d.code;
            }
            callback && callback(result);
        });
    },

    //获取断点上传地址和断点位置
    getBreakpointKey: function (appFileId,fileSize,fileName,fileMd5,callback) {
        var self = this;
        var data = {
        	appFileId: appFileId,
        	comeFrom : 1,
        	upType   : 3,
        	parentId : -1,
        	fileSize : fileSize,
        	objectName : fileName,
        	fileMd5  : fileMd5
        };
        var curConditionType = self.defaults.curConditionType;
        var resumeInterfaceName = this.getResumeInterface();
        this.postJson(resumeInterfaceName, data, function (data) {
            var response = data;
            if(response.code=='DFS_118'){
            	var data=response["var"];
            	self.trigger("setDBtnAppFileid",data.appFileId);
            	var fileinfo={
        			appfileld:data.appFileId,
        			shareUrl:data.shareUrl,
        			clientTaskNo:self.defaults.currentFile.clientTaskno,
        			name:file.name,
        			size:file.size,
        			validateTime:data.validateTime
            	}
            	if(!self.hasFileUploadSuc(fileinfo.name)){
            		self.fileUploadSuc.push(jQuery.extend(true, {}, fileinfo));
                }
            	
            	self.trigger("complete",{fileSize: fileSize});
            	self.controler.uploadNext();
            	return;
            }
            var result = {};
            
            result.success = false;
            result.message = response.summary;
            if (response && response.code == "S_OK") {
                try {
                    var val = response["var"];
                    result.success = true;
                    result.status = response.code;
                    result.summary = response.summary;
                    result.urlUpload = val.fastUploadUrl;
                    result.businessId = val.fileId;
                    result.appFileId=val.appFileId;
                    result.fileMd5=val.fileMd5;
                    
                    var fileInfo = {
                    	appFileId:val.appFileId,
                    	fileName:fileName,
                    	fileSize:fileSize,
                    	fid:val.fileId,
                    	state:response.code,
                        summary:response.summary
                    }
                    result[curConditionType + "Info"] = fileInfo;  //将上传文件的相关信息存储起来
                    result.name = fileInfo.fileName || file.name;  //上传重复文件，需要取服务端的新文件名
                    
                    var postparam={
                    	cmd:val.cmd,
                    	type:val.type,
                    	version:val.version,
                    	comefrom:val.comeFrom,
                    	taskno:val.taskNo,
                    	fileid:val.fileId,
                    	middleurl:val.middleUrl,
                    	filesize:fileSize,
                    	timestamp:val.timestamp,
                    	ssoid:val.ssoid,
                    	flowtype:val.flowType,
                    	userlevel:val.userLevel,
                    	usernumber:val.userNumber,
                    	filemd5:val.fileMd5,
                    	filename:fileName,
                    	fingerprint:val.fingerPrint
                    }

                    result.dataUpload =postparam;
                    result.dataUpload.ranges = val.range;

                    if (self.monitorIntervalId) {//网络断开又恢复正常了
                        clearInterval(self.monitorIntervalId);
                        self.monitorIntervalId = null;
                    }
                } catch (ex) {
                    result.success = false;
                }
            } else {
                result.success = false;
            }

            callback && callback(result);
        }, function (d) {
            try{
                callback(d);
            }catch(e){}
        });
    },

    //组装上传需要的post数据
    packageData: function (file) {
        var dataUpload = file.dataUpload;

        dataUpload.urlUpload = file.urlUpload;
        dataUpload.businessId = file.businessId;

        return dataUpload;
    },

    //上传完成触发
    completeHandle: function (clientTaskno, responseText, sucHandle, errHandle, uploadApp) {
        if (responseText === true) {//上传文件存在单副本，不用再上传了
        	if(!this.hasFileUploadSuc(this.defaults.currentFile.name)){
        		this.fileUploadSuc.push(jQuery.extend(true, {}, this.defaults.currentFile));
        	}
            sucHandle();
            return;
        }
        
        var responseData =jQuery.xml2json(responseText);
        var errMsg = this.params.MIDDLE_SERVER_CODE["S_ERR"];

        if (!responseData) {
            errHandle(errMsg);
            return;
        }

        if (responseData.retcode != this.params.DISPERSED_SERVER_CODE.SUC_UPLOAD) {//上传分布式失败
            errHandle(errMsg);
            return;
        }

        //上传分布式成功
        //继续判断middleret 为中间件返回的json 来判断是否入库中间件服务器
        var middleret = responseData.middleret;

        if (!middleret) {
            errHandle(errMsg);
            return;
        }

        var sucMsg = this.params.MIDDLE_SERVER_CODE["S_OK"];
        try {
        	var middleText=decodeURIComponent(decodeURIComponent(middleret));
            var middleretJson = eval("(" + middleText + ")");
        } catch (ex) {
            errHandle(errMsg);
            return;
        }

        if (middleretJson && middleretJson.code == "S_OK") {
        	if(!this.hasFileUploadSuc(this.defaults.currentFile.appFileid)){
        		var shareUrl=eval("(" + middleretJson["var"] + ")").shareUrl;
        		var validateTime=eval("(" + middleretJson["var"] + ")").validateTime;
        		this.defaults.currentFile.shareUrl=shareUrl;
        		this.defaults.currentFile.validateTime=validateTime;
        		this.fileUploadSuc.push(jQuery.extend(true, {}, this.defaults.currentFile));
        	}
            
            sucHandle(middleretJson["var"].url);
        } else {
            errHandle(errMsg);
        }
    },
    postJson:function (fun, data, successCallback, errorCallback) {
        this.Ajax(fun, data, function (e) {
            successCallback && successCallback(e);
        }, function(e){
        	errorCallback && errorCallback(e);
        })
    },
    /*删除文件*/
    delFile:function(appFileid,call){
    	var fun='disk:delete';
    	var data={"fileId":[Number(appFileid)],"diskType":3};
    	this.Ajax(fun, data, function (e) {
    		if(call)call();
        }, function(e){
        	
        })
    },
    /**
     * AJAX请求通用方法
     * @param {Object} func
     * @param {Object} data
     * @param {Object} callback
     */
    Ajax: function(func, data, callback,failCall){
    	var self=this;
		var fail=failCall;
		var failcall=function(d){
			if(d.code=='DFS_118'){
				callback(d);
			}else{
				if(fail){
					fail(d);
				}else{
					if(d && d.summary){
						  top.CC.alert(d.summary);
					}
				}
			}
		};
        top.MM.doService({
            url: self.userDiskUrl,
            func: func,
            data: data,
            failCall: failcall,
            call: function(d){
                callback(d);
            },
            param: ""
        });
    },
    /*
     * 根据筛选规则，将符合规则的文件state设置为1，不符合的设为0,供上传组件使用
     * 添加字段error具体描述不能上传的原因，渲染界面的时候使用
     * @param {Object} fileList 用户选择的文件列表
     */
    filterFile: function (fileList) {
        for (var i = 0, len = fileList.length; i < len; i++) {
            var file = fileList[i];

            //是否超过套餐上传单文件大小限制
            if (file.size == 0) {
                file.state = 0;
                file.error = "emptyUploadSize";
            } else if (file.size < this.maxUploadSize) {
                file.state = 1;
            } else {
                file.state = 0;
                file.error = "limitUploadSize";
            }

            if (file.clientTaskno == undefined || (file.clientTaskno == 0)) {//没有值，由脚本生产clientTaskno
                file.clientTaskno = this.getClientTaskno();
            }
        }

        return fileList;
    },

    //获取文件随机标示
    getClientTaskno: function() {
        var rnd = parseInt(Math.random() * 100000000);
        var randomNumbers = this.randomNumbers;

        if (randomNumbers[rnd]) {
            return arguments.callee();
        } else {
            randomNumbers[rnd] = true;
            return rnd;
        }
    },
    
    hasFileUploadSuc: function (name) {
        var fileUploadSuc = this.fileUploadSuc;
        for (var i = 0, len = fileUploadSuc.length; i < len; i++) {
            var file = fileUploadSuc[i];
            if (file.name == name){
            	return true;
            }
        }
        return false;
    },

    delFileUploadSuc: function (clientTaskno) {
        for (var i = 0; i < this.fileUploadSuc.length; i++) {
            var file = this.fileUploadSuc[i];
            if (file.clientTaskno == clientTaskno) {
            	this.fileUploadSuc.splice(i, 1);
            	break;
            }
        }
    },

    getTimestamp:function (timeStr) {
        return this.parseDate(timeStr).getTime() / 1000;
    },

    //将时间字符串转换为时间
    parseDate:function (str) {
        str = str.trim();
        var result = null;
        var reg = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/;
        var m = str.match(reg);
        if (m) {
            result = new Date(m[1], (m[2] - 1), m[3], m[4], m[5], m[6]);
        }
        return result;
    },

    getFullName: function (fileNameOrigin) {// 不带拓展名
        var point = fileNameOrigin.lastIndexOf(".");
        if(point == -1){
            return fileNameOrigin;
        }else{
            return fileNameOrigin.substring(0, point);
        }
    },

    getExtendName: function (fileNameOrigin) {// 仅返回拓展名
        var length = fileNameOrigin.split(".").length;
        return fileNameOrigin.split(".")[length-1].toLowerCase();
    },

    //替换模板中的{**}，如果没有指定被替换，就保持不便，主要用在模板之前的组装合并
    format: function (str, arr) {
        var reg;
        if (jQuery.isArray(arr)) {
            reg = /\{([\d]+)\}/g;
        } else {
            reg = /\{([\w]+)\}/g;
        }
        return str.replace(reg,function($0,$1){
            var value = arr[$1];
            if(value !== undefined){
                return value;
            }else{
                return $0;
            }
        });
    },

    getShortName : function(name, max){// 不带拓展名
        var point = name.lastIndexOf(".");
        if(point != -1){
            name = name.substring(0, point);
        }
        if(name.length > max){
            return name.substring(0, max) + "…";
        }else{
            return name;
        }
    },

    showInstallActivex: function ($btn) {
        /*var elem = $("#setupToolContainer");

        if (elem.length > 0) {
            elem.show();
        } else {
			elem = $(this.installActivexTemplete).appendTo("body");
			elem.find("#closeSetupTool").click(function(){
				elem.hide();
			});

            var btnOffset = $btn.offset();
            elem.css({
                left: btnOffset.left,
                top: btnOffset.top + 25
            });
        }*/
    }
};