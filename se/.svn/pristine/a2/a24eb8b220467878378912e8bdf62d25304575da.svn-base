/*
 * 控件上传控制器
 */

var UploadControler = function (options) {
    this.config = {
        activexVersion              : 65794, //控件版本号
        activexUpdateResourceUrl    : "",
        activexDirectUrl            : ""
    };

    //储存各种事件及相应处理器
    this.events = {
        select: function(options){
        	var self=this;
    	    var fileList = options.fileList;
    	    fileList=this.model.filterFile(fileList);
    	    this.model.trigger("renderList", {fileList: fileList});
    	    setTimeout(function(){
    	    	self.setFileList(fileList);
                //self.setCurrentFile(fileList[0].clientTaskno);
    	    	//解决上一文件暂停后，再次选择不执行
        	    if(self.model.defaults.currentFile.state=='stop'||self.model.defaults.currentFile.state==1){
        	    	self.uploadNext();
        	    }
    	    },10) 
        },
        prepareupload: function(){
    	    this.uploadNext();
        },
        loadstart: function(){
        	this.model.trigger("loadstart");
        },
        progress: function(){
        	this.model.trigger("progress");
        },
        complete: function(){
    	    var self = this;
    	    var UploadModel = self.model;
    	    var currentFile = UploadModel.defaults.currentFile;
    	    var clientTaskno = currentFile.clientTaskno;
    	    var responseText = currentFile.responseText;

    	    UploadModel.completeHandle(clientTaskno, responseText, function () {//上传成功
    	        UploadModel.trigger("complete");
    	        self.uploadNext();
    	    }, function(summary){//上传失败
    	        self.model.trigger("error",{summary:summary,isAgain:1});
    	        self.uploadNext();
    	    }, self);
        },
        error: function(){
    	    var self = this;
    	    var currentFile = self.model.defaults.currentFile;
    	    var clientTaskno = currentFile.clientTaskno;
    	    var state = currentFile.isContinueUpload;
            var stopReasonCollection = currentFile.stopReasonCollection || null;

    	    this.model.trigger("error",{isAgain:1, stopReasonCollection: stopReasonCollection});
    	    this.uploadNext();
        }
    };

    window.InstanceUpload = this.instanceUpload = {};
    this.init(options);
};

/*
 * UploadControler原型扩展函数
 */
UploadControler.include = function (o) {
    var included = o.included;
    for (var i in o) this.prototype[i] = o[i];
    included && included();
};

/*
 * UploadControler扩展静态方法
 */
UploadControler.extend = function (o) {
    var included = o.included;
    for (var i in o) this[i] = o[i];
    included && included();
};

UploadControler.extend({
    //是否安装控件
    isUploadControlSetup: function(){
        var setup = false;
        if (window.ActiveXObject) {//ie
            try {
                new ActiveXObject("ydExCxdndCtrl.ExUpload") && (setup = true);
            } catch (ex) {}
        } else if (navigator.plugins) {//firefox chrome
            var mimetype = navigator.mimeTypes["application/x-richinfo-cxdnd3"];

            setup = (mimetype && mimetype.enabledPlugin) ? true : false;
        }
        return setup;
    },

    //返回Flash Player的版本号,如果不支持，则返回0
    getFlashVersion: function () {
        var isIE = $.browser.msie;
        function getVersionInIE() {
            var v = 0;
            for (var i = 11; i >= 6; i--) {
                try {
                    var obj = new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + i);
                    if (obj) {
                        v = i;
                        break;
                    }
                } catch (e) { }
            }
            return v;
        }
        function getVersionInOthers() {
            var v = 0;
            if (navigator.plugins && navigator.plugins.length > 0 && navigator.plugins["Shockwave Flash"]) {
                var plugins = navigator.plugins["Shockwave Flash"];
                for (var i = 0; i < plugins.length; i++) {
                    var swf = plugins[i];
                    if (swf.enabledPlugin && (swf.suffixes.indexOf("swf") != -1) && navigator.mimeTypes["application/x-shockwave-flash"]) {
                        var match = plugins.description.match(/ (\d+(?:\.\d+)?)/);
                        if (match) {
                            var v = parseInt(match[1]);
                            break;
                        }
                    }
                }
            }
            return v;
        }
        var result = 0;
        if (isIE) {
            result = getVersionInIE();
        } else {
            result = getVersionInOthers();
        }
        /**@inner*/
        getVersionInIE = function () {
            return result;//保存返回值
        };
        getVersionInOthers = getVersionInIE;
        return result;
    },

    //是否安装flash插件
    isUploadFlashSetup: function(){
        return this.getFlashVersion() > 0 ? true : false;
    }
});

/*
 * 扩展UploadControler的原型方法
 */
UploadControler.include({
    init: function (options) {
        options.controler = this;
        this.model = options.model;
        this.model.initialize(options);

        this.view  = options.view;
        this.view.initialize(options);
        
        this.createInstance(options);
    },

    //定义自定义事件监听，一种事件暂时只有单一处理器
    on: function (eventType, callback) {
        this.events[eventType] = callback;
    },

    //执行自定义事件
    trigger: function (command, options) {
        this.events[command].call(this, options);
    },

    update: function(){
        var currentFile = this.model.defaults.currentFile;
        var state = currentFile.state;

        this.trigger(state);
    },
    uploadNext:function(clientTaskno){
    	var self=this;
    	var clientTaskno=clientTaskno||'';
    	self.uploadHandle(function(options){
    		self.model.trigger("error",options);
    		self.uploadNext();
        }, function(){
        	self.model.trigger("getFileMd5");
        },clientTaskno);
    },
    //获取上传地址
    uploadHandle: function (errCallback, md5LoadingCallback, clientTaskno) {
        var self = this;
        clientTaskno && this.setCurrentFile(clientTaskno);//续传时根据clientTaskno重新设置上传队列中的当前上传文件

        var currentFile = this.getFileInfo();
        if (!currentFile) return;
        
        if(!clientTaskno&&this.model.hasUploadTask.has(currentFile.clientTaskno)){
        	return;
        }
        this.model.hasUploadTask.push(currentFile.clientTaskno);
        this.model.defaults.currentFile=jQuery.extend(true,this.model.defaults.currentFile, currentFile);
        if (!clientTaskno) {//新上传文件
            md5LoadingCallback && md5LoadingCallback(currentFile.clientTaskno);
            setTimeout(function(){
            	if(parseInt(currentFile.size,10)<0){
                	errCallback({
                    	summary:'文件大小计算异常',
                    	isAgain:0
                    });
                	return;
                }
            	self.getFileMd5(function (fileMd5) {
                    if(fileMd5!=''){
                    	currentFile.fileMd5 = fileMd5;
                    	self.model.getUploadKey(currentFile, function (result) {
                        	self.model.defaults.currentFile.appFileid=result.appFileId;
                            getUploadUrlHandle(result);
                        });
                    }else{
                    	errCallback({
                        	summary:'获取文件md5失败',
                        	isAgain:0
                        });
                    }
                });
            },10);
        } else {//断点上传文件
            var appFileId = self.getCurrentFileParam("appFileId", currentFile);
            var fileSize  = currentFile.size;
            var fileName  = currentFile.name;
            var fileMd5   = self.getCurrentFileParam("fileMd5", currentFile);
            self.model.getBreakpointKey(appFileId,fileSize,fileName,fileMd5,function (result) {
            	self.model.defaults.currentFile.appFileid=result.appFileId;
                getUploadUrlHandle(result, true);
            });
        }

        function getUploadUrlHandle (result, isBreakpoint) {
            if (!result.success) { //获取上传地址失败
                self.instanceUpload.uploading = false;
                errCallback({
                	clientTaskno: currentFile.clientTaskno,
                	summary:result.message || result.summary,
                    code: result.code || '',
                	isAgain:1
                });
                self.uploadNext();
                return;
            }

            delete currentFile.name;//为下文重新给文件命名(重复上传相同文件，需要取服务端文件名字)
            for (var i in result) currentFile[i] = result[i];
            self.setExtData({
            	businessId: result.businessId,
            	appFileId:result.appFileId,
            	fileMd5:result.fileMd5
            });

            if (result.status == 1) {//上传文件存在单副本，已上传过
                self.instanceUpload.uploading = false;
                this.model.defaults.currentFile.state = "complete";
                this.model.defaults.currentFile.responseText = true;
                self.update();
                return;
            }

            var dataUpload = self.model.packageData(currentFile);
            self.upload(dataUpload);
        }
    },
    //对外提供上传接口
    upload: function (param) {
        this.instanceUpload.upload(param);
    },
    monitorToResume: function(){
        var self = this;
        var clientTaskno = this.model.defaults.currentFile.clientTaskno;

        if (!this.model.monitorIntervalId) { //避免上传接口异常时多次执行
            this.model.monitorIntervalId = setInterval(function () { //每隔5秒检测网络
                self.uploadHandle(function(options){
                    self.model.trigger("error",options);
                }, function(){
                    self.model.trigger("getFileMd5");
                }, clientTaskno);
            }, 5000);
        }
    }, 
    checkUploading:function(){
    	var runarr=['prepareupload','loadstart','progress'];
    	if(runarr.has(this.model.defaults.currentFile.state)){
    		return true;
    	}else{
    		return false;
    	}
    },
    closeUpload:function(){
    	var curclientTaskno=this.model.defaults.currentFile.clientTaskno;
    	if(curclientTaskno){
    		this.onabort(curclientTaskno);
    	}
    },
    getUploadSuccessList:function(){
    	return this.model.fileUploadSuc;
    },

    //设置当前上传文件
    setCurrentFile: function (clientTaskno) {
        this.instanceUpload.setCurrentFile(clientTaskno);
    },

    //返回筛选后的文件列表
    setFileList: function (fileList) {
        this.instanceUpload.setFileList(fileList);
    },

    //转换文件的md5值
    getFileMd5: function (file) {
        this.instanceUpload.getFileMd5(file);
    },

    //获取上传队列中当前上传的文件信息
    getFileInfo: function(){
        return this.instanceUpload.getFileInfo();
    },

    //设置当前上传文件的扩展信息，包含了businessId
    setExtData: function (param) {
        this.instanceUpload.setExtData(param);
    },

    //获取当前上传文件的参数
    getCurrentFileParam: function (key, currentFile) {
        return this.instanceUpload.getCurrentFileParam(key, currentFile);
    },

    onabort: function (clientTaskno) {
    	var self=this;
        this.instanceUpload.onabort(clientTaskno);
    },
    
    createInstance: function (options) {
        window.InstanceUpload = this.instanceUpload = new ActivexUpload(options);      
    }
});
