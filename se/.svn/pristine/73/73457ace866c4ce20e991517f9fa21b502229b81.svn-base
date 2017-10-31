/*
 * 控件上传类
 */
var ActivexUpload = function (options) {
    this.perSize        = ""; //允许上传单文件大小
    this.fileNamePre    = "";
    this.btnUploadEle   = {}; //上传文件按钮
    this.currentFile    = {}; //当前上传的文件
    this.randomNumbers  = {};
    
    this.init(options);
};

ActivexUpload.include = function (o) {
    var included = o.included;
    for (var i in o) this.prototype[i] = o[i];
    included && included();
};

ActivexUpload.include({
    init:function (options) {
        this.initParams(options);
        this.bindEvent();
    },

    initParams:function (options) {
        this.controler = options.controler;
        this.model = options.model;
        this.fileNamePre = options.fileNamePre || "filedata";
        this.perSize = options.perSize || 50 * 1024 * 1024;
        this.btnUploadId = options.btnUploadId;
    },

    bindEvent: function(){
        var self = this;
        this.registerControlEvent();
        this.btnUploadEle = jQuery("#" + this.btnUploadId);
        this.btnUploadEle.click(function(){
            if (uploadControl.getversion() < self.controler.config.activexVersion) {
                self.model.showInstallActivex(self.btnUploadEle);
            } else {
                self.openSelectFileDialog();
            }
        });
    },

    registerControlEvent: function () {
        var div = document.createElement("div");
        div.style.cssText = "width:1px;height:0px;";
        div.innerHTML = this.getUploadControlHtml();
        document.body.appendChild(div);
        window.uploadControl = document.getElementById("cxdndctrl");
        try {
            window.uploadControl.setuserid(top.gMain.sid);
        } catch (ex) {}
    },

    openSelectFileDialog: function () {
        uploadControl.getopenfilename("*.*", "选择文件");
    },
    
    onselect: function (fileList) {
        //console && console.log('select:fileList -> ', fileList);
        var filesObj=jQuery.xml2json(fileList);
        if (!filesObj) return;
        var files=filesObj.object;
        !files.length && (files = [files]);
        this.controler.trigger("select", {fileList: files});
        //console && console.log('select:end');
    },

    getFilesUpload: function(){
        var files = uploadControl.getfilelist();
        return jQuery.xml2json(files);
    },

    setFileList: function (fileList) {
        //console && console.log('setFileList:fileList -> ', fileList);
        var fileListXml = ["<array>"];
        for (var i = 0, len = fileList.length; i < len; i++) {
            fileListXml.push("<object>" + json2xml(fileList[i]) + "</object>");
        }
        fileListXml.push("</array>");
        fileListXml = fileListXml.join("");
        uploadControl.setfilelist(fileListXml);
        //console && console.log('setFileList:end');
    },

    getFileInfo: function(){
        //console && console.log('getFileInfo:start');
    	var fileinfo=uploadControl.getfileinfo();
    	if(fileinfo&&fileinfo.length!=1){
    		this.currentFile = jQuery.xml2json(fileinfo);
    	}else{
    		this.currentFile = null;
    	}
        return this.currentFile;
        //console && console.log('getFileInfo:end');
    },

    getFileMd5: function (callback) {
        //console && console.log('getFileMd5:start ');
        var fileMd5 = uploadControl.getfilemd5();
        callback && callback(fileMd5);
        //console && console.log('getFileMd5:end');
    },

    upload: function (dataUpload) {
        //console && console.log('upload:start dataUpload -> ', dataUpload);
        var newDataUpload = this.getNewDataUplod(dataUpload);
        var data = "<parameters>" + json2xml(newDataUpload) + "</parameters>";
        //console && console.log('upload:data -> ', data);
        uploadControl.uploadex(data);
        //console && console.log('upload:end');
    },

    getNewDataUplod: function (dataUpload) {
        dataUpload.resumetransmit = 0;
        dataUpload.ranges && (dataUpload.resumetransmit = 1);
        dataUpload.ver = 2;
        delete dataUpload.businessId;

        dataUpload.fastuploadurl = dataUpload.urlUpload;
        delete dataUpload.urlUpload;

        dataUpload.browsertype = this.getBrowserType();
        return dataUpload;
    },

    setCurrentFile: function (clientTaskno) {
        //console && console.log('setCurrentFile:start clientTaskno -> ', clientTaskno);
        uploadControl.setcurrentfile(clientTaskno.toString());
        //console && console.log('setCurrentFile:end');
    },

    setExtData: function (param) {
        //console && console.log('setExtData:start param -> ', param);
        uploadControl.setextdata(top.JSON.stringify(param));
        //console && console.log('setExtData:end');
    },

    getCurrentFileParam: function (key, currentFile) {
        var extData = currentFile.extdata;
        var value = "";
        if (extData) {
            try {
                extData = eval("(" + extData + ")");
                value = extData[key] || "";
            } catch (ex) {
                value = "";
            }
        }
        return value;
    },

    onprepareupload: function(){
        //console && console.log('onprepareupload:start');
        this.model.defaults.currentFile.state = "prepareupload";
        this.controler.update();
        //console && console.log('onprepareupload:end');
    },

    onloadstart: function (clientTaskno) {
        //console && console.log('onloadstart:start');
    	this.model.defaults.currentFile.state = "loadstart";
        this.controler.update();
        //console && console.log('onloadstart:end');
    },

    onprogress: function (clientTaskno, progress, uploadSize, times) {
        //console && console.log('onprogress:start');
    	if(!this.currentFile){
    		return;
    	}
        var speed = uploadSize / times;
        var surplusTime = Math.round((this.currentFile.size - progress) / speed); //剩余时间

        this.model.defaults.currentFile.state = "progress";
        this.model.defaults.currentFile.sendSize = progress;
        this.model.defaults.currentFile.totalSize = this.currentFile.size;
        this.model.defaults.currentFile.speed = top.Util?top.Util.formatSize(speed,null,2):speed + "/S";
        this.model.defaults.currentFile.surplusTime = surplusTime + "S";
        this.controler.update();
        //console && console.log('onprogress:end');
    },

    oncomplete: function (clientTaskno, responseTxt) {
        //console && console.log('oncomplete:start');
        this.model.defaults.currentFile.state = "complete";
        this.model.defaults.currentFile.responseText = responseTxt;
        this.controler.update();
        //console && console.log('oncomplete:end');
    },

    onerror: function (clientTaskno, state) {
        //console && console.log('onerror:start');
        var isContinueUpload = state == "unknownerror" ? true : false;
        this.model.defaults.currentFile.state = "error";
        this.model.defaults.currentFile.isContinueUpload = isContinueUpload;
        this.controler.update();
        //console && console.log('onerror:end');
    },

    onabort: function (clientTaskno, result, fileIdOfServer) {
        //console && console.log('onabort:start');
    	this.model.defaults.currentFile.state = "stop";
        uploadControl.stop(clientTaskno.toString());
        //console && console.log('onabort:end');
    },

    onstop: function (clientTaskno, result, fileIdOfServer) {
        //console && console.log('onstop:start');
        var resultState = ["success", "stopped", "unknownerror", "virus"];
        var state = resultState[result] || resultState[2]; //超过3,默认为2

        if (state == "unknownerror" || (state == "virus")) {
            this.onerror(clientTaskno, state);
        }
        else{
            if(state != 'stopped'){
                this.model.defaults.currentFile.state = 'error';
                this.model.defaults.currentFile.isContinueUpload = false;
                this.model.defaults.currentFile.stopReasonCollection = {
                    clientTaskNo: clientTaskno,
                    result: result,
                    fileIdOfServer: fileIdOfServer
                };
                this.controler.update();
            }
        }
        //console && console.log('onstop:end');
    },

    onlog: function (logText) {
        //console.log(logText);
    },

    getRandomFileMark: function () {
        var rnd = parseInt(Math.random() * 100000000);
        var randomNumbers = this.randomNumbers;

        if (randomNumbers[rnd]) {
            return arguments.callee();
        } else {
            randomNumbers[rnd] = true;
            return rnd;
        }
    },

    getUploadControlHtml: function () {
        var htmlCode =
            '<script language="javascript" type="text/javascript" for="cxdndctrl" event="onselect(fileList)">\
                InstanceUpload.onselect(fileList);\
            </script>\
            <script language="javascript" type="text/javascript" for="cxdndctrl" event="onprepareupload()">\
                InstanceUpload.onprepareupload();\
            </script>\
            <script language="javascript" type="text/javascript" for="cxdndctrl" event="onstart(clientTaskno)">\
                InstanceUpload.onloadstart(clientTaskno);\
            </script>\
            <script language="javascript" type="text/javascript" for="cxdndctrl" event="onprogress(clientTaskno, progress, uploadsize, times)">\
                InstanceUpload.onprogress(clientTaskno, progress, uploadsize, times);\
            </script>\
            <script language="javascript" type="text/javascript" for="cxdndctrl" event="oncomplete(clientTaskno, responseTxt)">\
                InstanceUpload.oncomplete(clientTaskno, responseTxt);\
            </script>\
            <script language="javascript" type="text/javascript" for="cxdndctrl" event="onstop(clientTaskno, result, fileIdOfServer)">\
                InstanceUpload.onstop(clientTaskno, result, fileIdOfServer);\
            </script>\
            <script language="javascript" type="text/javascript" for="cxdndctrl" event="onlog(logText)"></script>';

        if (document.all) {
            htmlCode += '<object id="cxdndctrl" classid="CLSID:2A39FFD7-8E69-440F-9AAB-AD97CFA7FE86"></object>';
        } else {
            htmlCode += '<embed id="cxdndctrl" type="application/x-yd-cxdnd3" height="1" width="1"></embed>';
            setTimeout(function(){
                onselect = function(fileList){
                    InstanceUpload.onselect(fileList);
                };
                onprepareupload = function(){
                    InstanceUpload.onprepareupload();
                };
                onstart = function (clientTaskno) {
                    InstanceUpload.onloadstart(clientTaskno);
                };
                onprogress = function (clientTaskno, progress, uploadsize, times) {
                    InstanceUpload.onprogress(clientTaskno, progress, uploadsize, times);
                };
                oncomplete = function (clientTaskno, responseTxt) {
                    InstanceUpload.oncomplete(clientTaskno, responseTxt);
                };
                onstop = function (clientTaskno, result, fileIdOfServer) {
                    InstanceUpload.onstop(clientTaskno, result, fileIdOfServer);
                };
                onlog = function (logText) {
                	//InstanceUpload.onlog(logText);
                };
            }, 500);
        }

        return htmlCode;
    },

    getBrowserType: function(){
        var mybrowsetype = 200;
        if (jQuery.browser.msie) {
            mybrowsetype = 0;
        } else if (window.navigator.userAgent.indexOf("Firefox") >= 0) {
            mybrowsetype = 151;

            if (/Firefox\/(?:[4-9]|3\.[0-3])/.test(navigator.userAgent)) {//3.6.3及以前
                mybrowsetype = 150;
            }
        }
        return mybrowsetype;
    }
});

var InfoHelper = {
    getErrSummary:function(retcode){
        var summary="未知错误";
        switch(retcode){
        case "101":
            summary="消息结构错误";
            break;
        case "102":
            summary="非法source";
            break;
        case "103":
            summary="认证或校验错误";
            break;
        case "104":
            summary="版本错";
            break;
        case "105":
            summary="磁盘空间不足";
            break;
        case "106":
            summary="存储不可用";
            break;
        case "107":
            summary="请求超时";
            break;
        case "108":
            summary="请求中含有非法参数";
            break;
        case "109":
            summary="文件不存在";
            break;
        case "110":
            summary="系统错误";
            break;
        case "111":
            summary="文件超过了限定的大小";
            break;
        case "114":
            summary="文件存在安全威胁";
            break;
        case "115":
            summary="不支持的压缩格式";
            break;
        case "119":
            summary="ssoid校验错误";
            break;
        case "120":
            summary="userlevel不合法";
            break;
        case "130":
            summary="fileMd5验证错误";
            break;
        }
        return summary;
    }
};