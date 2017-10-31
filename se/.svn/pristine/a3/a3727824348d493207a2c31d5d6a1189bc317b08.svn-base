UE.registerUI('screenShot',function(editor,uiName){

    return false;
    
    //注册按钮执行时的command命令，使用命令默认就会带有回退操作
    editor.registerCommand(uiName,{
        execCommand:function(){
            alert('execCommand:' + uiName)
        }
    });
	
	var p = this;
    //创建一个button
    var btn = new UE.ui.Button({
        //按钮的名字
        name:uiName,
        //提示
        title:"截屏",
        //需要添加的额外样式，指定icon图标，这里默认使用一个重复的icon
        cssRules :'background-position: -581px -40px;',
        //点击时执行的命令
        onclick:function () {
            //这里可以不用执行命令,做你自己的操作也可
		 	
			MultiThreadUpload1.captureScreen();
			 
        }
    });

function createIEXMLObject() {
    var XMLDOC = ["Microsoft.XMLDOM", "MSXML2.DOMDocument.6.0", "MSXML2.DOMDocument.5.0", "MSXML2.DOMDocument.4.0", "MSXML2.DOMDocument.3.0", "MSXML.DOMDocument"];
    if (window.enabledXMLObjectVersion) return new ActiveXObject(enabledXMLObjectVersion);
    for (var i = 0; i < XMLDOC.length; i++) {
        try {
            var version = XMLDOC[i];
            var obj = new ActiveXObject(version);
            if (obj) {
                enabledXMLObjectVersion = version;
                return obj;
            }
        } catch (e) {
        }
    }
    return null;
}

 function encodeXML($) {
        return $.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
    }
// ************** 控件截屏方法注册 begin *****************

  //控件基础接口封装
window.MultiThreadUpload1 = {
	isSetup:function(){
		if (!this.isSupport()) {
            var download_url = parent.gMain.webPath + '/se/mail/activex/MailThinkmail_Tool.exe';
//            if (top.Browser.isIE) {
//                document.getElementById("ifrmCAB").src = top.gConst.composeSetupUrl;
//            }
//            else
//            {
            var ao = {
                id: "Setup",
                title: Lang.Mail.Write.softwareSetup,
                url: top.gConst.composeSetupUrl,
                width: "348",
                height: "160",
                scoll: "no",
                buttons: []
            };
            parent.CC.showHtml(ao);
            //}
            return false;
        }
        return true;
	},
	isSupport:function(){
		 if (navigator.userAgent.indexOf("Opera") > -1) {
            return false;
        }
        if (window.ActiveXObject || /rv:11.0/.test(navigator.userAgent)) {
            try {
                var obj = new ActiveXObject("ydRIMail139ActiveX.InterfaceClass");
                var version = obj.Command("<param><command>common_getversion</command></param>");
                return true;
            } catch (e) {
                return false;
            }
        } else {
            var mimetype = navigator.mimeTypes && navigator.mimeTypes["application/x-yd-mail139activex"];
            if (mimetype && mimetype.enabledPlugin) {
                return true;
            }
        }
        return false;
	},
	captureScreen:function(){
		try {
            var install =this.isSetup();
            if (install) {
				MultiThreadUpload1.screenShot();
            }
        } catch (ex) {
			//alert(ex);
        }
	},
    //TODO 返回一个上传附件的地址
    getUploadUrl: function (isInlineImg) {
        var type = isInlineImg ? 1 : 3;
		var composeId =oWrite.id;
         url = "{0}?from=control&func={1}&sid={2}&composeId={3}&rnd={4}&type=internal";
        var uploadUrl = parent.gConst.uploadUrl;
        if (parent.gMain.rmSvr == "") {
			uploadUrl = window.location.protocol + "//" + window.location.host + uploadUrl;
		}
        return url.format(uploadUrl, parent.gConst.func.upload, top.gMain.sid, composeId, GC.gRnd());
       // return attach.getUploadUrl("", type,true);
    },
    // 调用小工具的命令
    doCommand: function (commandName, commandData) {
        var returnXml = oWrite.control.Command(commandData);
        switch (commandName) {
            case "getopenfilename":
            {
                return _getopenfilename();
            }
            case "getscreensnapshot":
            {
                return _getscreensnapshot();
            }
            case "getlastscreensnapshot":
            {
                //获得最后一次截屏的时间
                return _getlastscreensnapshot();
            }
            case "getclipboardfiles":
            {
                return _getclipboardfiles();
            }
            case "getversion":
            {
                return _getversion();
            }
            case "upload":
            {
                return _upload();
            }
            case "suspend":
            {
                return _suspend();
            }
            case "continue":
            {
                return _continue();
            }
            case "cancel":
            {
                return _cancel();
            }
            case "getstatus":
            {
                return _getstatus();
            }
            case "setbreakpointstorepoint":
            {
                return _setbreakpointstorepoint();
            }
            case "commonupload":
            {
                return _commonupload();
            }
        }
        function _commonupload() {
            return returnXml.indexOf("<result>0</result>") > 0;
        }

        function _getopenfilename() {
            var doc = getXmlDoc(returnXml);
            var jDoc = jQuery(doc);
            var files = [];
            jDoc.find("file").each(function () {
                var jObj = jQuery(this);
                var item = {
                    filePath: jObj.find("name").text(),
                    fileSize: parseInt(jObj.find("size").text())
                };
                item.fileName = item.filePath;
                files.push(item);
            });
            return files;
        }

        function _getclipboardfiles() {
            var doc = getXmlDoc(returnXml);
            var jDoc = jQuery(doc);
            var result = {
                text: "",
                html: "",
                htmlFiles: "",
                imageFiles: [],
                copyFiles: [],
                otherFiles: []
            };
            result.text = jDoc.find("CF_TEXT").text();
            result.html = jDoc.find("CF_HTML Fragment").text()//.decode();
            jDoc.find("CF_HTML file").each(function () {
                var jObj = jQuery(this);
                var item = {
                    filePath: jObj.find("name").text(),
                    fileSize: parseInt(jObj.find("size").text())
                };
                item.fileName = item.filePath;
                result.imageFiles.push(item);
            });
            jDoc.find("CF_BITMAP file").each(function () {
                var jObj = jQuery(this);
                var item = {
                    filePath: jObj.find("name").text(),
                    fileSize: parseInt(jObj.find("size").text())
                };
                item.fileName = item.filePath;
                result.imageFiles.push(item);
            });
            jDoc.find("CF_HDROP file").each(function () {
                var jObj = jQuery(this);
                var item = {
                    filePath: jObj.find("name").text(),
                    fileSize: parseInt(jObj.find("size").text())
                };
                item.fileName = item.filePath;
                result.copyFiles.push(item);
            });
            jDoc.find("CF_OTHERS file").each(function () {
                var jObj = jQuery(this);
                var item = {
                    filePath: jObj.find("name").text(),
                    fileSize: parseInt(jObj.find("size").text())
                };
                item.fileName = item.filePath;
                result.otherFiles.push(item);
            });
            return result;
        }

        function _getlastscreensnapshot() {
            var doc = getXmlDoc(returnXml);
            var jDoc = jQuery(doc);
            var time = new Date(parseInt(jDoc.find("time").text()));
            var oprResult = parseInt(jDoc.find("oprResult").text());
            if (oprResult == 0) {
                var file = {
                    filePath: jDoc.find("name:eq(0)").text(),
                    fileSize: parseInt(jDoc.find("size:eq(0)").text())
                };
                file.fileName = file.filePath;
            }
            return {
                time: time,
                oprResult: oprResult,
                file: file
            };
        }

        function _getscreensnapshot() {
            return returnXml.indexOf("<result>0</result>") > 0;
        }

        function _getversion() {
            return parseInt(returnXml.replace(/\D+/g, ""));
        }

        function _upload() {
            return returnXml.indexOf("<result>0</result>") > 0;
        }

        function _suspend() {
            return returnXml.indexOf("<result>0</result>") > 0;
        }

        function _continue() {
            return returnXml.indexOf("<result>0</result>") > 0;
        }

        function _cancel() {
            return returnXml.indexOf("<result>0</result>") > 0;
        }

        function _setbreakpointstorepoint() {
            return returnXml.indexOf("<result>0</result>") > 0;
        }
		function getXmlDoc(xml) {
            if (document.all) {
                var ax = createIEXMLObject();
                ax.loadXML(xml);
                return ax;
            }
            var parser = new DOMParser();
            return parser.parseFromString(xml, "text/xml");
        }
        function _getstatus() {
            if (returnXml != "<return />") {
                //top.Debug.write(returnXml);
                // todo M139.Logger.debug(returnXml);
            }
            //TODO 实现以下
            var doc = getXmlDoc(returnXml);
            var jDoc = jQuery(doc);
            var files = [];
			var This = this;
            jDoc.find("file").each(function () {
                var file = jQuery(this);
                var obj = {
                    taskId: file.find("taskId").text(),
                    fileName: file.find("fileName").text(),
                    status: file.find("status").text(),
                    attachId: file.find("attachId").text(),
                    totalSize: parseInt(file.find("totalSize").text()),
                    completedSize: parseInt(file.find("completedSize").text()),
                    transSpeed: parseInt(file.find("transSpeed").text()),
                    needTime: parseInt(file.find("needTime").text()),
                    stopReason: file.find("stopReason").text(),
                    errorCode: file.find("errorCode").text()
                };
                //普通上传
                if (returnXml.indexOf("<httpSvrPostResp>") != -1) {
                    obj.isCommonUpload = true;
                    var responseText = file.find("httpSvrPostResp").text();
                    obj.responseText = responseText;
                    var p = { responseText: responseText, fileName: obj.fileName };
                    var result =  MultiThreadUpload1.getFilesByString(responseText) ;//utool.checkUploadResultWithResponseText(p);
					if (result.code == "S_OK") {
						obj.attachId = result.fileId;
					
						//addCompleteAttach(result);
					} 
                }
                files.push(obj);
            });
            return files;
        }
    },
	  getFilesByString: function (resp) {
        if (!resp) {
            return null;
        }
        var match = resp.match(/(var\s+return_obj=[\s\S]+)<\/script>/i);
        if (match) {
            eval(match[1]);
            if (return_obj && return_obj["var"]) {
                var vo = return_obj["var"];
                var resultObj = {
                    code: return_obj.code,
                    taskId: vo.fileId,
                    fileId: vo.fileId,
                    fileName: vo.fileName,
                    fileSize: vo.fileSize
                };
                return resultObj;
            } else {
                return null;
            }
        } else {
            return null;
        }
    },
	onScreenShot : function (file) {
            file.insertImage = true;
            file.uploadType = "multiThread";
			file.taskId =1001;
			this.commandUpload(file);

            //top.addBehavior("成功插入截屏");
        },
    getClipboardData: function () {
        var command = "<param><command>localfile_getclipboardfiles</command></param>";
        var data = this.doCommand("getclipboardfiles", command);
        return data;
    },
    getVersion: function () {
        var command = "<param><command>getversion</command></param>";
        var version = this.doCommand("getversion", command);
        return version;
    },
    showDialog: function () {
        var command = "<param><command>localfile_getopenfilename</command><title>" + parent.Lang.Mail.tips061 + "</title><filter>*.*</filter></param>";
        var files = this.doCommand("getopenfilename", command);
        return files;
    },
    uploadFileCount: 0,
    //多线程上传(特殊协议)
    
    commandUpload: function (file) {
        var isInlineImg = false;
        if (file.insertImage || file.replaceImage) {
            isInlineImg = true;
        }
        var command = "<param>\
            <command>attachupload_commonupload</command>\
            <taskId>{taskId}</taskId>\
            <svrUrl>{svrUrl}</svrUrl>\
            <cookie>{cookie}</cookie>\
            <filePathName>{fileName}</filePathName>\
            <size>{fileSize}</size>\
            </param>";
        var param = {
            svrUrl: encodeXML(this.getUploadUrl(isInlineImg)),
            fileName: encodeXML(file.filePath),
            fileSize: file.fileSize,
            taskId: file.taskId,
            cookie: ""
        };
        command = Utils.format(command, param);
        //top.Debug.write(command);
        var success = this.doCommand("commonupload", command);

        if (success) {
			var p = this;
			 /*var files = p.getStatus();
				 var obj = files[0];
				 if (obj.status == 4) {
				 	MultiThreadUpload1.checkUploadResultWithResponseText({
				 		responseText: obj.responseText,
				 		fileName: obj.fileName
				 	});
					//clearInterval(t);
				 }*/
		
			var t = setInterval(function(){
				var files = p.getStatus();
				var obj = files[0];
				 if (obj.status == 4) {
				 	MultiThreadUpload1.checkUploadResultWithResponseText({
				 		responseText: obj.responseText,
				 		fileName: obj.fileName
				 	});
					clearInterval(t);
				 }
			},500)
			
            //file.updateUI();
            //this.startWatching(file);
            //this.uploadFileCount++;
        } else {
            parent.CC.alert(parent.Lang.Mail.tips062);
            file.state = "error";
            uploadManager.removeFile(file);
        }
    },
    "continue": function (item) {
        var command = "<param><command>attachupload_continue</command><taskId>" + item.taskId + "</taskId></param>";
        var success = this.doCommand("continue", command);
        if (success) {
            //item.uploadFlag = MultiThreadUpload1.UploadFlags.Uploading;
            //item.render();
            this.startWatching();
        }
        return success;
    },
    //截屏后要主动轮训是否有截屏操作
    startCheckClipBoard: function () {
        var This = this;
        var lastAction = This.getLastScreenShotAction();
        clearInterval(This.checkClipBoardTimer);
        This.checkClipBoardTimer = setInterval(function () {
            var result = This.getLastScreenShotAction();
            if (result.time.getTime() != lastAction.time.getTime()) {
                clearInterval(This.checkClipBoardTimer);
                if (result.oprResult == 0) {//0表示有截屏，否则表示用户取消
                    if (MultiThreadUpload1.onScreenShot) MultiThreadUpload1.onScreenShot(result.file);
                }
            }
        }, 1000);
    },
	checkUploadResultWithResponseText : function (response) {
            var r = /"fileId\":\"([^\"]+)"/i;
            var s = response.responseText.match(r);
            var fileId = s[1];
            var url = this.getShowAttachUrl(fileId, encodeURIComponent(response.fileName));
			editor.execCommand('insertimage',{src:url,_src:url})
            //editor.doMenu("InsertImage", url);//插图
    },
	getShowAttachUrl: function (fileId, fileName) {
        var url = "{0}?func={1}&sid={2}&fileId={3}&fileName={4}";
        return url.format(top.gConst.downloadUrl, top.gConst.func.getAttach, top.gMain.sid, fileId || "", fileName || "");
	},
    getStatus: function () {
        var result = this.doCommand("getstatus", "<param><command>attachupload_getstatus</command></param>");
        return result;
    },
    stop: function (item) {
        if (item) {
            var command = "<param><command>attachupload_suspend</command><taskId>" + item.taskId + "</taskId></param>";
            var success = this.doCommand("suspend", command);
            if (success) {
                //item.uploadFlag = MultiThreadUpload1.UploadFlags.Stop;
                //item.render();
            }
            return success;
        }
    },
    //取消上传 如果只是截屏可以不关注
    cancel: function (item) {
        if (item) {
            var command = "<param><command>attachupload_cancel</command><taskId>" + item.taskId + "</taskId></param>";
            var success = this.doCommand("cancel", command);
            //TODO var file = utool.getFileById(item.taskId);
            if (success && file) {
                if (this.uploadFileCount > 0) this.uploadFileCount--;
                //TODO uploadManager.removeFile(file);
            }
        }
    },
    //截屏
    screenShot: function () {
        try {
            var result = this.doCommand("getscreensnapshot", "<param><command>screensnapshot_getscreensnapshot</command></param>");
            if (result) this.startCheckClipBoard();
            return result;
        } catch (e) {
			//alert(e);
        }
    },
    //得到最后一次截屏操作的时间
    getLastScreenShotAction: function () {
        var result = this.doCommand("getlastscreensnapshot", "<param><command>screensnapshot_getlastscreensnapshot</command></param>");
        return result;
    }
 
}
//MultiThreadUpload.create();
  //因为你是添加button,所以需要返回这个button
    return btn;
}/*index 指定添加到工具栏上的那个位置，默认时追加到最后,editorId 指定这个UI是那个编辑器实例上的，默认是页面上所有的编辑器都会添加这个按钮*/);