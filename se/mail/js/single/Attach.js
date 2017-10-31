//常量定义
var AttachConst = {
    ScreeSnapId:"ScreenSnapshot"
};

function SWFObject(swf, id, w, h, ver, c){
    this.params = {};
    this.variables = {};
    this.attributes = {};
    this.setAttribute("id",id);
    this.setAttribute("name",id);
    this.setAttribute("width",w);
    this.setAttribute("height",h);
    this.setAttribute("swf",swf);
    this.setAttribute("classid","clsid:D27CDB6E-AE6D-11cf-96B8-444553540000");
    if (ver) {
        this.setAttribute("version", ver);
    }
    if (c) {
        this.addParam("bgcolor", c);
    }
}
SWFObject.prototype.addParam = function(key,value){
    this.params[key] = value;
};
SWFObject.prototype.getParam = function(key){
    return this.params[key];
};
SWFObject.prototype.addVariable = function(key,value){
    this.variables[key] = value;
};
SWFObject.prototype.getVariable = function(key){
    return this.variables[key];
};
SWFObject.prototype.setAttribute = function(key,value){
    this.attributes[key] = value;
};
SWFObject.prototype.getAttribute = function(key){
    return this.attributes[key];
};
SWFObject.prototype.getVariablePairs = function(){
    var variablePairs = [];
    for(key in this.variables){
        variablePairs.push(key +"="+ this.variables[key]);
    }
    return variablePairs;
};
SWFObject.prototype.getHTML = function(){
    var con = '',pairs ='',key='';
    if (navigator.plugins && navigator.mimeTypes && navigator.mimeTypes.length) {
        var protocol = location.protocol;
        protocol == 'https:' ? protocol : 'http:';
        con += '<embed style="z-index: 99;" class="flash" type="application/x-shockwave-flash"  pluginspage="'+protocol+'//www.macromedia.com/go/getflashplayer" src="'+ this.getAttribute('swf') +'" width="'+ this.getAttribute('width') +'" height="'+ this.getAttribute('height') +'"';
        con += ' id="'+ this.getAttribute('id') +'" name="'+ this.getAttribute('id') +'" ';
        for(key in this.params){
            con += [key] +'="'+ this.params[key] +'" ';
        }
        pairs = this.getVariablePairs().join("&");
        if (pairs.length > 0){
            con += 'flashvars="'+ pairs +'"';
        }
        con += '/>';
    }else{
        con = '<object style="z-index: 99;" class="flash" id="'+ this.getAttribute('id') +'" classid="'+ this.getAttribute('classid') +'"  codebase='+window.location.protocol+'"://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version='+this.setAttribute("version")+',0,0,0" width="'+ this.getAttribute('width') +'" height="'+ this.getAttribute('height') +'">';
        con += '<param name="movie" value="'+ this.getAttribute('swf') +'" />';
        for(key in this.params) {
            con += '<param name="'+ key +'" value="'+ this.params[key] +'" />';
        }
        pairs = this.getVariablePairs().join("&");
        if(pairs.length > 0) {con += '<param name="flashvars" value="'+ pairs +'" />';}
        con += "</object>";
    }
    return con;
};
SWFObject.prototype.write = function(elementId){
    var html = this.getHTML();
    if(typeof elementId == 'undefined'){
        document.write(html);
    }else{
        var n = (typeof elementId == 'string') ? document.getElementById(elementId) : elementId;
        n && (n.innerHTML =html );
    }
};

var attach = {
    id:"",
    ulId:"attachContainer",
    ajax:parent.MM,
    uploadUrl:"",
    uploadType:0,
    isSupportFlash:false,
    frmPath:parent.gMain.frmPath,
    attachList:[],
    composeAttachs:[],
    ul:null,
    frm:null,
    form:null,
    liUpload:null,
    composeId:"",
    data:[],
	maxSize: 50, //邮件&附件最大限制 单位为M
	maxNameLen:60,//文件名最大长度
	sid:parent.gMain.sid,
	delegateFun: {},
    sizeCount:0,    //已经上传附件的大小
    needUploadCount: 0, // 需要上传的附件个数
    uploadedCount: 0, // 上传完成的附件个数
    fileCheckMode: 0, // 文件格式校验模式【0：不校验，1：白名单（允许）校验，2：黑名单（不允许）校验】
    $:function(id){
        return document.getElementById(id);
    },
    regMatchFile: /(var\s+return_obj=[\s\S]+)<\/script>/i,
    init:function(id){
        this.uploadUrl = this.getUploadUrl(id);
        this.ul = this.$(this.ulId);
        this.liUpload = this.$("liUpload");
        this.frm = this.$("frmAttach");
        this.form = this.$("formAttach");
        this.composeId = Meeting.id;
        this.needUpdatePosition = false;
        //创建上传组件
        upload_module.createUploadManager();
    },
    /**
     * 根据环境加载对应的上传控件并绑定上传方法
     */
    initUI: function(){
        //初始化上传组件
        upload_module.init(this);
    },
    // 渲染附件附件列表
    render : function(dataSet){
        if (dataSet && dataSet.attachments) {
            this.composeAttachs = dataSet.attachments.concat();
        }
        uploadManager.refresh();
    },
    /**
     * @param str {string} 要设置的有效附件格式
     */
    setFormat: function(str){
        this.format = str;
    },
    /**
     * 委托函数，后委托的函数会覆盖之前的同名委托
     * @param name {string} 事件名称
     * @param fun  {function} 事件函数
     */
    delegate: function(name, fun){
        if(name && (typeof fun == 'function')){
            this.delegateFun[name] = fun;
        }
    },
    /**
     *校验附件格式
     * @param filename {string} 文件名
     */
    checkFormat: function(filename, format){
        var fileExt = filename.lastIndexOf('.')>-1 ? filename.substr(filename.lastIndexOf('.')) : '';
        if(format.substr(0,1) != ','){
            format = ',' + format;
        }
        if(format.substr(format.length-1) != ','){
            format += ',';
        }
        format = format.toLowerCase();
        fileExt = ','+fileExt.toLowerCase()+',';
        if(format.indexOf(fileExt) > -1){
            return true;
        }
        return false;
    },
    /**
     * 校验附件合法性
     * @param file {object} 文件对象，自行封装的对象
     */
    checkAttach: function(file){
        var name = file.fileName || '';
        var p = this;

        function allow(){
            if(p.format && p.format.toString().trim()!=""){
                if(!p.checkFormat(name, p.format)){
                    if(p.delegateFun['onFormatError'] && (typeof p.delegateFun['onFormatError'] == 'function')){
                        p.delegateFun['onFormatError'](name, p.format);
                        return false;
                    }
                }
            }
            return true;
        }

        //  按扩展名过滤
        function forbidden(){
            if(p.format && p.format.toString().trim()!=''){
                if(p.checkFormat(name, p.format)){
                    if(p.delegateFun['onFormatError'] && (typeof p.delegateFun['onFormatError'] == 'function')){
                        p.delegateFun['onFormatError'](name, p.format);
                        return false;
                    }
                }
            }
            return true;
        }

        switch(this.fileCheckMode){
            case '1':
                return allow();
                break;
            case '2':
                return forbidden();
                break;
            default:
                return true;
        }
    },
    /**
     * 得到上传附件的url地址
     * @param {String} composeId
     * @param {Number} urlType 附件上传类型 1:内嵌图片上传，
     * @param {Boolean} isControl 是否为flash,activeX控件上传，为解决SSL VPN跳转到邮箱改写报文bug<br>
     * SSL VPN判断url参数中from=control,不对报文进行改写;普通上传进行报文改写，解决跨域问题<br>
     * 请注意from=control必须跟在url 的?后面<br>
     * @return {String} 上传的url地址
     */
    getUploadUrl:function(cid,urlType,isControl){
        var composeId = cid || Meeting.id;
        var url = "{0}?func={1}&sid={2}&composeId={3}&rnd={4}";
        if(isControl){
            url = "{0}?from=control&func={1}&sid={2}&composeId={3}&rnd={4}";
        }
        if(urlType==1){
            url += "&type=internal";
        }else if(urlType == 3){
            url += "&type=attach";
        }
        var uploadUrl = parent.gConst.uploadUrl;
        if(parent.gMain.rmSvr=="")
            uploadUrl = window.location.protocol + "//"+window.location.host+uploadUrl;
        return url.format(uploadUrl,parent.gConst.func.upload,this.sid,composeId,GC.gRnd());
    },
    /**
     * 获取删除附件的url地址
     * @param {Object} fileId 要删除文件的id
     */
    getDeleteUrl:function(fileId){
        var url = "{0}?func={1}&sid={2}&fileId={3}";
        return url.format(parent.gConst.uploadUrl,parent.gConst.func.deleteAttach,this.sid,fileId);
    },
    /**
     * 得到显示上传后图片的url
     * @param {Object} fileId
     * @param {Object} fileNmae
     */
    getShowAttachUrl:function(fileId,fileName){
        var url = "{0}?func={1}&sid={2}&fileId={3}&fileName={4}";
        return url.format(parent.gConst.downloadUrl,parent.gConst.func.getAttach,this.sid,fileId||"",fileName||"");
    },
    //添加附件的伪按钮
    btnAddAttach: function(){
        if (PageState == PageStateTypes.Uploading){
            CC.alert(Lang.Mail.Write.fileUploading);
            return false;
        }
    },
    btnAddAttachFromDisk:function(){
        var p = this;
        var composeid = Meeting.composeId;
        var obj = {
            type: 1,
            checkbox: true, //是否显示复选框
            callback: function(obj){
                if (!parent.GE.diskFiles[composeid]) {
                    parent.GE.diskFiles[composeid] = [];
                }
                attach.addDiskFiles(obj,true);
                p.setSize();
            }
        };
        parent.FS.show(obj);
    },
    tempDiskCall:function(obj){
        var p = this;
        var composeid = Meeting.composeId;
        if (!parent.GE.diskFiles[composeid]) {
            parent.GE.diskFiles[composeid] = [];
        }
        attach.addDiskFiles(obj, true);
        p.setSize();
    },
    btnAddAttachFromTempDisk:function(){
        var ao = {
            id: "attachFromTempDisk",
            title: parent.Lang.Mail.tips060,
            url: parent.gMain.webPath+"/se/disk/commontempdisk.do?sid=" + parent.gMain.sid,
            width: "493",
            height: "430",
            scoll: "no",
            zindex: 1800

        };
        parent.CC.showHtml(ao);
    },
    /**
     * 上传文件
     * @param {Object} input
     */
    fileOnChange:function(input){
        var p = this;
        var ifm = document.getElementById('frmAttach');
        var fn = parent.Util.getFileNameByPath(input.value);
        var form = this.$("formAttach");
        var files = input.files;
        var size = files ? files[0].size : 0;

        form.action = p.getUploadUrl();

        // ifrm onload event
        // attach.taskId = fn;

        if (PageState == PageStateTypes.Uploading){
            CC.alert(Lang.Mail.Write.fileUploading);
            return;
        }

        if(attach.checkFileExist(fn)){
            CC.alert(Lang.Mail.Write.sameFile);
            return false;
        }

        if(!attach.checkAttach({fileName:fn})){
            return false;
        }

        try {
            form.submit();
        }catch(e){
        }

        var f = {};
        f.uploadType = 'form';
        f.fileId = fn;
        f.fileName = fn;
        input.value = "";
        //p.addAttachContainer(f);
        p.tempFileObject = f;
        //p.setAttachHeight();
        //p.showProgress("form",fn,0);
        //p.setSize();

    },
    frmAttachOnLoad:function(obj){
        var url = obj.src;
        var win = obj.contentWindow;
        var ready = false;
        var form = this.$("formAttach");
        var file = attach.tempFileObject;
        var taskId;
        form.reset();
        $("uploadInput").value = "";
        try {
            if(win&&win.return_obj){
                var data = win.return_obj;
                var d = data['var'] || {};
                if(data.code=="S_OK"){
                    if(jQuery.isArray(d)){
                        for(var i = 0,l= d.length;i<l;i++){
                            var f = d[i];
                            if(file.fileId == f.fileName) {
                                taskId = f.fileId;
                                d = f;
                                break;
                            }
                        }
                    }  else {
                        taskId = d.fileId;
                    }
                    this.uploadOk("form",taskId,d);
                    upload_module_common.showUploading(d.fileName);
                }else{
                    ready = false;
                    this.uploadFail(data.code);
                    return;
                }
            }
        } catch (e) {
            ready = false;
            this.uploadFail("FS_UNKNOWN");
            return;
        }
    },
    /***
     * 上传成功后处理
     * @param {Object} data 格式：{fileId:'',fileName:'',fileSize:''}
     */
    uploadOk:function(type,taskId,data){
        if (type == "form") {
        }else{
            var attachType = data.type || "upload";
            this.data.push({type:attachType,taskId:taskId,fileId:data.fileId,fileSize:data.fileSize,fileName:data.fileName});
        }
        attach.uploadedCount++;
        if(!uploadManager.isUploading()){
            PageState = PageStateTypes.Common;
            Meeting.status = WriteState.none;
        }
    },
    uploadFail:function(code,taskId,data){
        data = data || {};
        var errorMsg = data.errorMsg || "";
        if(this.$("liUpload")){
            this.$("liUpload").style.display = "none";
        }
        this.setAttachHeight();
        var s = (parent.isDeug)?errorMsg:"";
        PageState = PageStateTypes.Common;
        var msg = Lang.Mail.Write.uploadFailed;
        if(code=="FA_ATTACH_SIZE_EXCEED"){
            msg = Lang.Mail.Write.attachmentSize;
        }
        parent.CC.alert(msg+s);
        this.setSize();

        parent.Util.writeLogError(parent.gConst.logFunc.js, "attachUpload", "uid="+parent.gMain.userNumber+" | sid="+this.sid+"| msg="+errorMsg+"|stack="+parent.Util.getStack());
    },
    checkFileExist : function(fileName){
        var ul = $("attachContainer");
        if (ul.childNodes) {
            ul = top.El.cleanWhitespace(ul);
            for (var i = 0; i < ul.childNodes.length; i++) {
                var li = ul.childNodes[i];
                if (li.id != "liUpload") {
                    if (li.title == fileName) {
                        return true;
                    }
                }
            }
        }
        return false;
    },
    /**
     * flash 文件大小判断
     * @param {int} size 当前上传文件大小，flash控件会将此参数传递过来，以M为单位
     */
    checkFileSize:function(size){
        var limited = parent.Util.getSizeByByte(this.maxSize,"M");
        return limited > (size + this.sizeCount);
    },
    setSize: function () {
        try {
            Meeting.setSize();
        } catch (e) {

        }
    },
    /**
     * 显示上传进度信息
     * @param {String} type 上传类型
     * @param {Number} taskId 上传的任务id
     * @param {Number} percent 上传的百分比
     * @param {Number} speed 上传的速度,单位为 字节/秒
     */
    showProgress: function(type,taskId,percent,speed){
        var p = this;
        PageState = PageStateTypes.Uploading;
        var attachFrm = $("frmAttach");
        attachFrm.style.display = "none";
        var Domain_Lighttp = GC.frmPath;
        var ul = this.$(this.ulId);
        var li = "";
        if (taskId && !isNaN(percent)) {
            var html = "";
            if (type == "form") {
                // li = $("liUpload");
                // parent.El.remove(li);
                // li = document.createElement("li");
                // li.id = "liUpload";
                // li.style.display = "";
                // html = "<i class='local'></i>" + this.getFileShortName(taskId) + "&nbsp;&nbsp;" +Lang.Mail.Write.Uploading + " <img src=\"" + parent.gMain.resourceRoot + "/images/uploading.gif\"/><a href=\"javascript:fGoto();\" onclick=\"attach.cancelUpload()\">" + Lang.Mail.Write.Delete + "</a>";
                // li.innerHTML = html;
                // ul.appendChild(li);
            } else {
                li = $("upload_processing_" + taskId);
                //html = Lang.Mail.Write.Uploading + ",&nbsp;"+Lang.Mail.Write.UploadPercent +percent+"% ";
                //if(speed>0){
                //    html += " " + this.formatSize(speed) + "/s &nbsp;&nbsp;";
                //}
                li.style.width = percent + '%';
            }
        }else {
            //$("flashplayer").className = "flashDisp";
            p.setSize();
        }
        // if(isNaN(percent) || percent >= 100){
        // if($('upload_processing_' + taskId)){
        // $('upload_processing_' + taskId).className = 'processed';
        // }
        // attach.uploadedCount++;
        // if(attach.uploadedCount == attach.needUploadCount){
        // PageState = PageStateTypes.Common;
        // }
        // Meeting.status = WriteState.none;
        // }
    },
    /***
     * 取消上传（上过程中取消上传）
     */
    cancelUpload:function(){
        PageState = PageStateTypes.Common;
        this.deleteTasks();
        var li = this.$("liUpload");
        li.style.display = "none";
        $("uploadInput").value= "";
        $("formAttach").reset();
        this.refreshAttach();
        this.setSize();
    },
    /***
     * 上传完成后刷新（给Flash控件调用）
     */
    refreshAttach: function(){
        //if (Meeting.composeId) {
        this.frm.src = "about:blank"; //parent.gMain.reqPath + "/upload2.jsp?composeId=" + window.composeId + "&sid=" + parent.gMain.sid + "&rnd=" + Math.random();
        //}
    },
    removeFile:function(id,size){
        size = size || 0;
        if(typeof(id)=="string"){
            parent.El.remove(this.$("li_"+id));
            this.sizeCount -= size;
            for(var j = 0; j<this.attachList.length;j++){
                if(this.attachList[j].fileId == id || this.attachList[j].taskId == id){
                    this.attachList.splice(j,1);
                }
            }
        }else if(typeof id=="object" && id instanceof Array){
            for(var i=0;i<id.length;i++){
                parent.El.remove(this.$("li_"+id[i]));
                this.sizeCount -= size;
                for(var j = 0;j<this.attachList.length;j++){
                    if(this.attachList[j].fileId == id || this.attachList[j].taskId == id){
                        this.attachList.splice(j,1);
                    }
                }
            }
        }
        this.sizeCount = Math.max(0,this.sizeCount);
        PageState = PageStateTypes.Common;
        attach.needUploadCount--;
        attach.setAttachHeight();
    },
    removeData:function(id){
        for(var i =0;i<this.data.length;i++){
            if(this.data[i].taskId==id){
                this.data.splice(i,1);
                return;
            }
        }
    },
    /**
     * 删除附件
     * @param {Object} type 附件上传的类型
     * @param {Object} id 附件的taskId/fileId
     */
    deleteAttach:function(type,id,size){
        //var file = this.data[index];
        if(type=="flash"){
            FlashUpload.deleteAttach(id,size);
        }else if(type=="activex"){
            UploadActivex.deleteAttach(id,size);
        }else if(type=="formInternal"){
            this.deleteTasks(id,function(){
                attach.deleteImage(id);
                attach.removeFile(id,size);
            });
        }else{
            this.deleteTasks(id,function(){
                attach.removeFile(id,size);
            });
        }
    },
    /**
     * 从服务器删除已经上传的附件
     * @param {Object} obj
     */
    deleteTasks:function(fids,funcDel){
        //var data = [];
        //data.push({func: parent.gConst.func.deleteAttach,'var': {composeId:Meeting.id,items:fids}});
        //data.push({func: parent.gConst.func.refreshAttach,'var':{id:Meeting.id}});

        if(typeof fids == "string"){
            fids = [fids];
        }
        var attachCall = function(resp){
            try {
                if (resp.code == "S_OK") {
                    //Meeting.showAttachContainer(resp["var"]);
                    if(typeof funcDel == "function"){
                        funcDel(fids);
                        attach.uploadedCount--;
                    }
                }else{
                    failCall(resp);
                }
            }catch(e){
                parent.ch("delete attach error." + e);
            }
        };
        var failCall = function(resp){
            var msg = resp["var"] || "";
            parent.CC.alert(parent.Lang.Mail.Write.deleteAttachError + "<br>" + msg);
        };
        var obj = {
            func: parent.gConst.func.deleteAttach,
            data: {
                composeId: Meeting.id,
                items: fids
            },
            call: attachCall,
            msg: parent.Lang.Mail.Write.deletingAttach
        };
        parent.MM.mailRequestApi(obj);
    },
    /**
     * 从服务器删除已经上传的附件
     * @param {Object} obj
     */
    getAttachList:function(fids,funcDel){
        var attachCall = function(resp){
            try {
                if (resp.code == "S_OK") {
                    Meeting.showAttachContainer(resp["var"]);
                }
            }catch(e){
                parent.ch("delete attach error." + e);
            }
        };
        var obj = {
            func: parent.gConst.func.refreshAttach,
            data: {
                id: Meeting.id
            },
            call: attachCall,
            msg: ""
        };
        parent.MM.mailRequestApi(obj);
    },
    addAttachContainer: function(obj){
        var isLoad = false;
        if (PageState == PageStateTypes.Initializing) {
            isLoad = true;
        }
        var ul = this.$(this.ulId);
        var uploadType = obj.uploadType || "form";    //上传类型
        var type = obj.type || "upload";			  //附件类型
        var fileId = obj.fileId;
        var taskId = obj.taskId || fileId;
        var fn = subject = obj.fileName;
        var fen = fn.substr(fn.lastIndexOf('.') + 1);
        fn = fn.substr(0, fn.length - fen.length - 1);
        var offset = obj.fileOffSet || 0;
        var fs = obj.fileSize || 0;
        var rfs = obj.fileRealSize || fs;
        var sfn = this.getFileShortName(fn);
        var sfs = this.formatSize(rfs,2);
        var html = [];
        var li = document.createElement("div");

        taskId = taskId.toString().encodeHTML().replace(/&nbsp;/g, ' ');
        attach.needUploadCount++;
        li.title = fn;
        li.id = "li_"+taskId;
        li.className = 'upLoad shadow';
        html.push("<div class=\"upLoadBg\">");
        html.push("<div id=\"upload_processing_"+ taskId +"\" class=\"process\" style=\"width:0%;\">&nbsp;</div>");
        html.push("</div>");
        html.push("<div class=\"upLoadText\">");
        html.push("<span class=\"fileName\"><i class=\"i_video " + parent.Util.getFileClasssName(obj.fileName) + "\"></i><span class=\"uploadFile_name\">" + sfn.encodeHTML() + "." + fen + "</span>");
        html.push("<span id=\"" + taskId + "_size\" class=\"gray\">");
        if(uploadType != "form"){
            html.push(sfs);
        }
        html.push("</span>");
        html.push("</span>");
        html.push("<a href=\"javascript:fGoto();\" onclick=\"attach.deleteAttach('" + uploadType + "', '" + taskId + "', '" + rfs + "');return false;\"><i class=\"i_u_close\" onmouseover=\"this.className='i_u_close_hover'\" onmouseout=\"this.className='i_u_close'\"></i></a>");
        html.push("</div>");

        //html.push('<i class="local"></i>' + sfn + '(' + sfs + ')&nbsp;&nbsp;');
        //html.push('<span id="liUpload_' + taskId + '">');
        //if(uploadType=="flash"){
        //    html.push(Lang.Mail.Write.waiting+"&nbsp;&nbsp;");
        //}
        //html.push('</span>');
        //html.push('<a href="javascript:fGoto();" onclick="attach.deleteAttach(\''+uploadType+'\',\''+taskId+'\','+rfs+');return false;" class="del">' + Lang.Mail.Write.Delete + '</a>');
        li.innerHTML = html.join("");
        this.sizeCount += rfs;
        ul.appendChild(li);
        this.attachList.push(obj);

        Meeting.setSubjectTxt(subject, true);
    },
    getFileType:function(filename){
        filename = filename.toLowerCase();
        var ico = "other";
        var icoClass = ["other", "tif", "txt", "psd", "rar", "zip", "xml", "html", "java", "fon", "jpg", "gif", "png", "bmp", "tiff", "mpeg", "avi", "wmv", "mov", "mpg", "vob", "rmvb", "mp3", "wma", "wav", "asf", "mp4", "sis", "sisx", "cab", "doc", "docx", "pdf", "xls", "xlsx", "ppt", "pptx", "swf", "fla", "share", "folder", "mp3-hover", "upload", "i-hand", "flv", "folder-m", "folder-p", "exe", "css", "rm", "midi", "chm", "iso", "vsd", "no-load"];
        for (var i = 0; i < icoClass.length; i++) {
            if (filename.indexOf(icoClass[i]) >= 0) {
                ico = icoClass[i];
                break;
            }
        }
        return ico;
    },
    addDiskFiles: function(obj,isAdd){
        var fileDiv = $(this.ulId);
        var df = parent.GE.diskFiles[Meeting.composeId];
        var beforeIndex = 0;
        if(isAdd){
            beforeIndex = df.length;
            parent.GE.diskFiles[Meeting.composeId] = parent.GE.diskFiles[Meeting.composeId].concat(obj);
        }
        if (obj) {
            for (var i = 0; i < obj.length; i++) {
                var file = obj[i];
                var id = file.id;
                var fn = subject = file.name;
                var fen = fn.substr(fn.lastIndexOf('.') + 1);
                fn = fn.substr(0, fn.length - fen.length - 1);
                var sfn = this.getFileShortName(fn);
                var size = file.fileSize || file.size;
                size = parent.Util.str2Num(size);
                //size = size * 1024;
                size = this.formatSize(size, 2);
                var html = [];
                var div = document.createElement("div");
                div.title = fn;
                div.id = "FromDiskFiles_" + id + "_" + (beforeIndex+i);
                div.className = 'upLoad shadow';
                html.push("<div class=\"upLoadBg\">");
                html.push("<div id=\"upload_processing_disk_"+ id +"\" style=\"width:100%\" class=\"processed\">&nbsp;</div>");
                html.push("</div>");
                html.push("<div class=\"upLoadText\">");
                html.push("<span class=\"fileName\"><i class=\"i_video " + parent.Util.getFileClasssName(file.name) + "\"></i><span class=\"uploadFile_name\">" + sfn + "." + fen + "</span><span class=\"gray\">" + size + "</span></span>");
                html.push("<a href=\"javascript:fGoto();\" onclick=\"attach.deleteDiskFiles('" + id + "','" + (beforeIndex+i) + "');return false;\"><i class=\"i_u_close\" onmouseover=\"this.className='i_u_close_hover'\" onmouseout=\"this.className='i_u_close'\"></i></a>");
                html.push("</div>");

                //var str = '<li title="{0}" id="FromDiskFiles_{3}_{4}"><i class="web"></i>{1}({2})&nbsp;<a href="javascript:fGoto();" class="del" onclick=\'attach.deleteDiskFiles(\"{3}\",\"{4}\");return false;\'>' + Lang.Mail.Write.Delete + '</a></li>';
                //html[html.length] = str.format(fn,sfn.encodeHTML(),size, id, beforeIndex+i);

                div.innerHTML = html.join("");
                fileDiv.appendChild(div);
                attach.setAttachHeight();
                Meeting.setSubjectTxt(subject, true);
            }
            this.setAttachHeight();
        }
    },
    deleteDiskFiles: function(id, index){
        var fileDiv = $(this.ulId);
        var lDiv = $("FromDiskFiles_" + id+"_" + index);
        fileDiv.removeChild(lDiv);
        if (document.all) {
            lDiv.removeNode();
        }
        var df = parent.GE.diskFiles[Meeting.composeId];
        for(var i=0;i<df.length;i++){
            if(df[i].id==id){
                df.splice(i,1);
            }
        }
        this.setAttachHeight();
        this.setSize();
    },
    showAttachContainer:function(files,id){
        var isLoad = false;
        //id = id || "upload";
        files = files || "";
        //var container = this.$();
        //parent.El.removeChildNodes(container);
        try {
            for (i = 0; i < files.length; i++) {
                var file = files[i];
                this.addAttachContainer(files[i]);
            }
        }catch (e) {
        }
        this.setAttachHeight();
    },
    setProcessing: function(percent){
        jQuery('.upLoadBg div').each(function(i, v){
            jQuery(this).css({
                width: percent + '%'
            }).removeClass('process').addClass('processed');
        });
    },
    singleComplete:function(fileName){
        var container = $(attach.ulId);
        var li = document.createElement("li");
        li.innerHTML = "<i></i>" + fileName + "[" + Lang.Mail.Write.Uploaded + "]";
        container.appendChild(li);
    },
    setAttachHeight: function(){
        var ul = this.$(this.ulId);
        var lis = ul.getElementsByTagName('div');
        if (lis.length>0) {
            parent.El.removeClass(ul, 'hide');//ul.className = "addDoc docAutoScroll";
        }else {
            parent.El.addClass(ul, 'hide');//ul.className = "addDoc";
        }
        Meeting.needAutoSave = true;
        this.setSize();
    },
    /**
     * 从http输出流中解析出文件对象，返回文件对象的数组
     * @param {Object} resp 文件上传后的输出流
     */
    getFilesByString : function(resp){
        if(!resp){
            return null;
        }
        var match = resp.match(attach.regMatchFile);
        if(match){
            eval(match[1]);
            if (return_obj && return_obj["var"]) {
                var vo = return_obj["var"];
                var resultObj = {
                    code:return_obj.code,
                    taskId: vo.fileId,
                    fileId: vo.fileId,
                    fileName: vo.fileName,
                    fileSize: vo.fileSize
                };
                return resultObj;
            }else{
                return null;
            }
        }else{
            return null;
        }
    },
    getFileShortName:function(fn){
        return parent.Util.getFileShortName(fn,attach.maxNameLen);
    },
    formatSize:function(size,num){
        num = num || 2;
        return parent.Util.formatSize(size,null,num);
    },
    /**
     * 将截屏后的图片插入到写信编辑区域
     * @param {String} id 文件上传时的任务id号
     * @param {Object} resultObj 上传的文件对象
     */
    insertImageToEditor: function(type,id,resultObj){
        if (resultObj) {
            var url = this.getShowAttachUrl(resultObj.fileId,encodeURIComponent(resultObj.fileName));
            Editor.doMenu("InsertImage", url);//插图
            //Editor.editorFocus(Editor.getEditorValue().length);
            PageState = PageStateTypes.Common;
            resultObj.uploadType = "formInternal";
            resultObj.type = "internal";
            //attach.uploadOk(type,id,resultObj);
        }
    },
    deleteImage:function(id){
        var reg = new RegExp('<img src="'+parent.gConst.downloadUrl+'\\?func='+parent.gConst.func.getAttach+'[^<]*'+id+'[^>]*">',"i");
        var val = Editor.getEditorValue();
        var result = val.replace(reg, "");
        Editor.setEditorValue(result);
    }
};
//
//var HTML5AJAXUpload = {
//    upload: function(fileInfo) {
//        var file = fileInfo.fileObj;
//        var This = this;
//        this.currentFile = fileInfo;
//        var xhr = this.getFileUploadXHR();
//        xhr.upload.onprogress = xhr.upload.onloadstart = xhr.upload.onload = function(oEvent) {
//            if (oEvent.lengthComputable) {
//                var f = This.currentFile; //ff下xhr事件指针有bug，所以不能直接用fileInfo
//                f.sendedSize = oEvent.loaded;
//                f.progress = parseInt(f.sendedSize / f.fileSize * 100,10);
//                f.state = "uploading";
//                f.updateUI();
//            }
//        };
//        var url = attach.uploadUrl;
//        xhr.open("POST", url, true);
//        var time = new Date().getTime();
//        var boundaryLine = "boundary=------richinfo" + time;
//        xhr.setRequestHeader("Content-Type", "multipart/form-data; " + boundaryLine);
//        var sCrlf = "\r\n";
//        var requestBody = [],fileName='';
//        if (supportGoogleGears) {
//            fileName = file.fileName;
//        } else {
//            fileName = encodeURIComponent(file.fileName);
//            fileName = fileName.replace(new RegExp("%(\\w{2})", "ig"), function(_, sHex) {
//                return String.fromCharCode(parseInt(sHex, 16));
//            });
//        }
//        requestBody.push('--------richinfo' + time);
//        requestBody.push(sCrlf);
//        requestBody.push('Content-Disposition: form-data; name="uploadInput"; filename="' + fileName + '"');
//        requestBody.push(sCrlf);
//        requestBody.push('Content-Type: application/octet-stream');
//        requestBody.push(sCrlf);
//        requestBody.push(sCrlf);
//        if (supportGoogleGears) {
//            requestBody.push(file.blob);
//        } else {
//            requestBody.push(file.getAsBinary());
//        }
//        requestBody.push(sCrlf);
//        requestBody.push("--------richinfo" + time + "--");
//        xhr.onreadystatechange = function() {
//            //abort也会触发，但是xhr.responseText为空
//            if (xhr.readyState == 4  && xhr.responseText) {
//                var f = This.currentFile;
//                var uploadResult = utool.checkUploadResultWithResponseText({
//                    responseText: xhr.responseText,
//                    fileName: f.fileName
//                });
//                if (uploadResult.success) {
//                    f.fileId = uploadResult.fileId;
//                    f.state = "complete";
//                    f.updateUI();
//                }else {
//                    f.state = "uploading";
//                    f.updateUI();
//                }
//                uploadManager.autoUpload();
//            }
//        };
//        if (supportGoogleGears) {
//            var blobBuilder = getGear().create("beta.blobbuilder");
//            blobBuilder.append(requestBody);
//            xhr.send(blobBuilder.getAsBlob());
//        } else {
//            xhr.sendAsBinary(requestBody.join(""));
//        }
//        fileInfo.state = "uploading";
//        fileInfo.updateUI();
//    },
//    stop: function() {
//        this.getFileUploadXHR().abort();
//    },
//    getFileUploadXHR: function() {
//        if (!window.fileUploadXHR) {
//            if (supportGoogleGears) {
//                fileUploadXHR = this.getGear().create("beta.httprequest");
//            } else {
//                fileUploadXHR = new XMLHttpRequest();
//            }
//        }
//        return fileUploadXHR;
//    },
//    getGear:function(){
//        var gear=document.getElementById("gear12345");
//        if(!gear){
//            if(typeof navigator.mimeTypes!="undefined"&&navigator.mimeTypes["application/x-googlegears"]){
//                gear=document.createElement("object");
//                gear.id="gear12345";
//                gear.style.display="none";
//                gear.width=0;
//                gear.height=0;
//                gear.type="application/x-googlegears";
//                document.body.appendChild(gear);
//            }
//        }else{}
//        return gear;
//    }
//};

//截屏控件
var UploadActivex = {
    isCaptureing:false,  //是否正在截屏中
    captureCount:0,      //截屏计数
    captureTaskId:0,     //截屏任务号
    data:{},             //保存任务号与fileId的对应关系
    /**
     * 检测是否支持截屏控件
     */
    isSetup: function(){
        var setup = false;
        if (!top.Browser.isIE) {
            CC.alert(Lang.Mail.Write.browseError);
            return false;
        }

        if (top.AttachControl.isSetup != undefined) {
            setup = top.AttachControl.isSetup;
            return setup;
        }
        try {
            var obj = new ActiveXObject("RIMailToolAutoUpdateCtrl.AutoUpdate.1");
            if (obj == null) {
                return false;
            }
            var version = obj.GetActiveXVersion("Cxdndctrl.Upload.1");
            return true;
            /* var obj = new ActiveXObject("RICorporationMailHelpCtrl.AutoUpdate.1");
             if (obj && obj.GetActiveXVersion("CorporationScreenSnapshotCtrl.ScreenSnapshot.1") == captureVersion) {
             setup = true;
             }
             obj = new ActiveXObject("ScreenSnapshotCtrl.ScreenSnapshot.1");
             if (obj && obj.GetVersion() == captureVersion) {
             setup = true;
             }*/
        } catch (e) {
        }
        if (!setup) {
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
            return false;
        }
        delete window.obj;
        top.AttachControl.isSetup = setup;
        return setup;
    },
    /***
     * 在页面上输出控件
     */
    writeScreenControl: function(){
        top.AttachControl = {
            isSetup:undefined       //是否安装了控件
        };
        if (top.Browser.isIE) {
            var html = "<OBJECT ID=\"ScreenSnapshotctrlID\" name=\"ScreenSnapshotctrl\" CLASSID=\"CLSID:49C9C3AD-42B5-45e0-ACC3-093AD3F1369D\"></OBJECT>\r\n";
            html += "<script language=\"JavaScript\" for=\"ScreenSnapshotctrl\" ";
            html += "event=\"ScreenSnapshotCtrlOnProgress(id, nProgress, nTotalSize, nUsedTime)\">";
            html += "ScreenSnapProgress(id,nProgress, nTotalSize, nUsedTime);";
            html += "</script>\r\n<script language=\"JavaScript\" for=\"ScreenSnapshotctrl\" ";
            html += "event=\"ScreenSnapshotCtrlOnStop(id, nResult, strResponse)\">";
            html += "ScreenSnapComplete(id, nResult, strResponse);";
            html += "</script>\r\n<script language=\"JavaScript\" for=\"ScreenSnapshotctrl\" ";
            html += "event=\"SSCUploadClipboardFileOnStart(id, nFileCount, iFileIndex, strFileName)\">";
            html += "ClipboardFileOnStart(id, nFileCount, iFileIndex, strFileName);";
            html += "</script><script language=\"JavaScript\" for=\"ScreenSnapshotctrl\" ";
            html += "event=\"SSCUploadClipboardFileOnProgress(id, nFileCount, iFileIndex, strFileName,nProgress,nTotalSize, nTime)\">";
            html += "ClipboardFileOnProgress(id, nFileCount, iFileIndex, strFileName,nProgress,nTotalSize, nTime);";
            html += "</script><script language=\"JavaScript\" for=\"ScreenSnapshotctrl\" ";
            html += "event=\"SSCUploadClipboardFileOnStop(id, nFileCount,iFileIndex,strFileName, nResult, strResponse)\">";
            html += "ClipboardFileComplete(id, nFileCount,iFileIndex,strFileName, nResult, strResponse);";
            html += "</script>";
            $('ScreenControl').innerHTML = html;
        }
    },
    /**
     * 截屏方法
     */
    captureScreen: function(){
        try {
            var install = this.isSetup();
            if (install) {
                var uploadUrl = attach.getUploadUrl("",1,true);
                var t =this.captureTaskId
                ScreenSnapshotctrl.GetScreenSnapshotImg(t, uploadUrl, "");
                this.captureTaskId++;
            }
        } catch (ex) {
        }
    },
    //删除截屏控件上传的附件
    deleteAttach:function(taskId,size){
        var fileId = this.data[taskId];
        if(fileId){
            attach.deleteTasks(fileId,function(){
                attach.deleteImage(fileId);
                attach.removeFile(taskId,size);
            });
        }
    }
};

var activeXAttach = {
    taskId: 1,
    init: function(){
        var files = MultiThreadUpload.showDialog();
//        return false;
        var uploadUrl = attach.getUploadUrl("",3,true);
        this.uploadUrl = uploadUrl;

        for(var i=0,l=files.length;i<l;i++){
            var f = files[i];
            var fname = f.fileName.indexOf('\\') ? f.fileName.substr(f.fileName.lastIndexOf('\\')+1) : f.fileName;

            files[i].fileName = fname;
            files[i].uploaded = false;
            files[i].uploadType = 'multiThread';
            files[i].taskId = this.taskId++;
            files[i].fileId = files[i].taskId;
        }
        this.files = files;
        uploadManager.uploadFile(files);
//		this.currentIndex = 0;
//
//		//attach.showAttachContainer(files);
//		if(this.files.length){
//			for(var i=0;i<this.files.length;i++){
//				this.currentIndex = i;
//				if(attach.checkAttach(this.files[i])){
//					if(attach.checkFileSize(this.files[i].fileSize)){
//						this.upload();
//					}
//					else{
//						CC.alert(Lang.Mail.Write.attachmentSize);
//					}
//				}
//			}
//		}
    },
    upload: function(){
        var p = this;
        var file = this.files[this.currentIndex];

        attach.addAttachContainer(file);
        attach.setAttachHeight();
        var success = MultiThreadUpload.commandUpload(file);
        if(success){
            // p.timer = setInterval(function(){
            // p.getStatus(file.taskId);
            // }, 1000);
        }
    },
    getStatus : function(taskId){
        var timer = this.timer;
        var file_status = MultiThreadUpload.getStatus();
        var clear = false;
        if(file_status && file_status.length){
            var cFile = null;
            for(var i=0;i<file_status.length;i++){
                if(file_status[i].taskId == taskId){
                    cFile = file_status[i];
                    break;
                }
            }
            if(cFile){
                var percent = (cFile.completedSize / cFile.totalSize) * 100;
                attach.showProgress('ActiveX', taskId, percent);
                if( percent >= 100){
                    clear = true;
                }
            }
            else{
                clear = true;
            }
        }
        else{
            clear = true;
        }
        if(clear){
            clearInterval(timer);
        }
    }
};

/*
 function ClipboardFileOnStart(id, nFileCount, iFileIndex, strFileName){
 isClipbardUploading = true;
 }*/
/***
 * 显示上传进度
 * @param {Object} id
 * @param {Object} nFileCount
 * @param {Object} iFileIndex
 * @param {Object} strFileName
 * @param {Object} nProgress
 * @param {Object} nTotalSize
 * @param {Object} nTime
 */
/*function ClipboardFileOnProgress(id, nFileCount, iFileIndex, strFileName,nProgress,nTotalSize, nTime){
 attach.showProgress("activex",strFileName, Math.round((nProgress/nTotalSize)*100));


 function ClipboardFileComplete(id, nFileCount,iFileIndex,strFileName, nResult, strResponse){
 if(nResult==3){
 CC.alert(Lang.Mail.Write.attachmentSize);
 isClipbardUploading = false;
 return;
 }else if(nResult==4){
 CC.alert(Lang.Mail.Write.occupiedFile);
 isClipbardUploading = false;
 return;
 }
 if(iFileIndex==nFileCount-1){
 isClipbardUploading = false;
 if(strFileName.indexOf(".jpg")>=0){
 attach.insertImageToEditor(strResponse);//插入剪贴板图片
 }//else{
 //refreshAttach();
 //}
 }else{
 //singleComplete(strFileName);
 }
 }*/

// ************** 控件截屏方法注册 begin *****************
/***
 * 截屏上传进度
 * @param {String} id 任务id
 * @param {Number} nProgress 文件总共已上传的大小。单位为字节。
 * @param {Number} nTotalSize 总大小。单位为字节。
 * @param {Number} nUsedTime 文件上传开始到现在共用了多长时间。单位为秒。
 */
function ScreenSnapProgress(id, nProgress, nTotalSize, nUsedTime){
    var taskId = AttachConst.ScreeSnapId + id;
    if(!UploadActivex.isCaptureing){
        var obj = {
            taskId:taskId,
            uploadType:'activex',
            fileName:taskId +'.jpg',
            fileSize:nTotalSize
        };
        attach.addAttachContainer(obj);
        UploadActivex.isCaptureing = true;
        UploadActivex.data[taskId] = "";
    }else{
        var prog = ((nProgress/nTotalSize)*100).toString();
        var speed = 0;
        if (nUsedTime > 0) {
            speed = nProgress / nUsedTime;
        }
        attach.showProgress('activex',taskId, prog, speed);
    }
}

/***
 * 截屏图片上传完成回调
 * @param {Object} id
 * @param {Object} nResult nResult：上传结果。0表示上传成功，1表示人为停止，2表示意外停止，比如网络断了。
 * @param {Object} strResponse 上传后服务器返回的http报文
 */
function ScreenSnapComplete(id, nResult, strResponse){
    var taskId = AttachConst.ScreeSnapId + id;
    UploadActivex.captureCount++;
    UploadActivex.isCaptureing = false;
    if (nResult == 0) {
        var resultObj = attach.getFilesByString(strResponse);
        if (resultObj) {
            attach.insertImageToEditor("activex", AttachConst.ScreeSnapId + id, resultObj);
            UploadActivex.data[taskId] = resultObj.fileId;
        }else{

        }
    }
}

// ************** 控件截屏方法注册 end *****************


;;;(function($){
    //上传控制器
    var upload_module = {
        //须在文档未关闭前调用
        init: function (model) {
            this.model = model;
            var $ =  jQuery;
            var t = supportUploadType = this.getSupportUpload();
            //ie678 多线程=》flash=》普通
            //ff3.6+ chrome 多线程=》普通
            //其它 普通
            //如果支持flash 创建flash上传并且 屏蔽普通上传
            //如果支持多线程上传 屏蔽普通上传和
            //如果支持截屏上传
            var isSupportCommonUpload = true;

            if (t.isSupportMultiThreadUpload) {
                upload_module_multiThread.init();
            }

            if (t.isSupportFlashUpload) {
                upload_module_flash.init();
                isSupportCommonUpload = false;
            }

            if (t.isSupportAJAXUpload) {
                upload_module_ajax.init();
                isSupportCommonUpload = false;
            }

            if (isSupportCommonUpload) {
                upload_module_common.init();
            }
            PageState = PageStateTypes.Common;

            if (isSupportCommonUpload || t.isSupportAJAXUpload) {
                bindAttachFrameOnload();
                var p = $("#formUpload");
                p.css({
                    zIndex:98,
                    top:0
                });
                $("#formAttach").show();
            }
        },
        createUploadManager: function () {
            uploadManager = new UploadManager({
                container: document.getElementById("attachContainer")
            });
            this.commonMouseEvent();
        },
        getSupportUpload: function () {
            var obj = {};
            obj.isSupportMultiThreadUpload = upload_module_multiThread.isSupport();
            obj.isSupportFlashUpload = upload_module_flash.isSupport();
            obj.isSupportOldFlashUpload = false;
            obj.isSupportAJAXUpload = upload_module_ajax.isSupport();
            obj.isSupportScreenShotUpload = obj.isSupportMultiThreadUpload;
            return obj;
        },
        //此函数只用来删除普通附件
        deleteFile: function (param) {
            var file = param.file;
            var fileId = file.fileId;
            var fileName = file.filePath;
            if (file.uploadType == "multiThread") {
                fileName = file.fileName;
            }
            if (isCurrentUploadAttach(fileName, fileId)) {
                var obj = {
                    func: parent.gConst.func.deleteAttach,
                    data: {
                        composeId: upload_module.model.composeId,
                        items: [fileId]
                    },
                    call: function(resp){
                        try {
                            if (resp.code == "S_OK") {
                                //removeImageFile(fileId);
                                uploadManager.removeFile(file);
                                refreshAttach(true);//刷新附件列表，保证准确性
                            }
                        }catch(e){
                            parent.ch("delete attach error." + e);
                        }
                    },
                    msg: parent.Lang.Mail.Write.deletingAttach
                };
                parent.MM.mailRequestApi(obj);
            }
            function removeImageFile(attachId) {
                if (/\.(?:jpg|jpeg|gif|png|bmp)$/i.test(fileName)) {
                    //var images = window.frames["HtmlEditor"].document.images;
                    var images = htmlEditorView.editorView.editor.editorWindow.document.images;
                    for (var i = 0; i < images.length; i++) {
                        var img = images[i];
                        if (isAttachImage(img.src, fileId)) {
                            $(img).remove();
                            i--;
                        }
                    }
                }
            }
            function isAttachImage(url, fileId) {
                if (url.indexOf(location.host) == -1 && url.indexOf("/") != 0) return false;
                var reg = new RegExp("fileId=" + fileId + "\\b");
                if (reg.test(url)) {
                    return true;
                }
                return false;
            }
            //判断是否本次上传的附件
            function isCurrentUploadAttach(fileName, fileId) {
                if (fileName.indexOf("\\") != -1) {
                    return true;
                }
                var dataSet = attach;
                if (dataSet.composeAttachs) {
                    for (var i = 0; i < dataSet.composeAttachs.length; i++) {
                        if (fileId == dataSet.composeAttachs[i].id) return false;
                    }
                }
                return true;
            }
        },
        deletePreuploadFile: function (fileName) {
            var requestXml = {
                composeId: upload_module.model.composeId,
                items: [fileName]
            };
            RequestBuilder.call("upload:deleteTasks", requestXml, function (result) {
                if (result["code"] == "S_OK") {
                    top.Debug.write("删除本次上传的附件:" + fileName);
                    upload_module.asynDeletedFile = "";
                }
            });
        },
        // 上传附件鼠标悬浮事件
        commonMouseEvent : function(){
            var self = this;
            if (!supportUploadType.isSupportFlashUpload) { // #uploadInput
                $("#aattach,#formUpload").mouseover(function() {
                    var options = {host: $(this), text: utool.getUploadTipMessage()};
                    self.showUploadTip(options);
                }).mouseout(function() {
                    $(document).unbind("mousemove").bind("mousemove", $.proxy(self.hideUploadTip,self));
                }).mousemove(function(e) {
                    top.EV.stopEvent(e);
                });
            }
        },
        /*
         *显示上传附件鼠标悬浮提示语
         * @param options {host : document.getElementById("realUploadButton"), text : '添加小于50M的附件，可使用 Ctrl+V 粘贴附件和图片'}
         *
         */
        showUploadTip : function(options){
            if(!options){
                options = {host: $("#aattach"), text: utool.getUploadTipMessage()};
            }
            var self = this;
            self.appendUploadTipDom();
            var uploadTip = $("#divUploadTip");
            uploadTip.html(options.text);
            dockElement(options.host,uploadTip);
            uploadTip.unbind('mouseover').unbind('mouseout').show();
            uploadTip.bind('mouseover', function(e){
                parent.EV.stopEvent(e);
                upload_module.listining_tips_shown = true;
                if(upload_module.t1){
                    clearTimeout(upload_module.t1);
                }
                if(upload_module.t2){
                    clearTimeout(upload_module.t2);
                }
            });
            uploadTip.bind('mouseout', function(e){
                parent.EV.stopEvent(e);
                upload_module.listining_tips_shown = false;
                upload_module.t2 = setTimeout(function(){
                    self.hideUploadTip();
                }, 20);
                //console.log('tips out --> ');
            });
            function dockElement(targetElement, dockElement){
                var offset = targetElement.offset();
                dockElement.css({"display":"block","left":offset.left,"top":offset.top+targetElement.height()+1,position:"",zIndex:99});
            };
        },
        hideUploadTip : function(){
            $("#divUploadTip").hide();
        },
        // 向body插入提示dom
        appendUploadTipDom : function(){
            var uploadTip = $("#divUploadTip");
            if(uploadTip.length == 0){
                var htmlCode = '<div id="divUploadTip" class="tips write-tips"></div>';
                uploadTip = $(htmlCode).appendTo(document.body);
                uploadTip.mousemove(function(e) {
                    top.EV.stopEvent(e);
                });
                uploadTip.css("z-index", 128);
            }
        }
    };
    window["upload_module"] = upload_module;
})(jQuery);
//
//var FlashUpload = {
//    data:[],
//    curIndex:0,
//    init: function() {
//        //if (GC.check("MAIL_WRITE_FLASH")) {
//        var isSupportFlashUpload = this.checkSupportFlash();
//        var url = parent.gMain.rmSvr + "/RmWeb/upload.swf";
//        var so = new SWFObject(url, "flashplayer", "80", "22");
//        so.addParam("wmode", "transparent");
//        so.addParam('allowscriptaccess', 'always');
//        so.addParam('title', Lang.Mail.Write.lbt_addattach);
//        so.addParam('alt', Lang.Mail.Write.lbt_addattach);
//        //创建flash，透明的，浮动在HTML按钮上
//        if (isSupportFlashUpload) {
//            so.write();
//            $("formUpload").style.display = 'none';
//        }
//        //}
//    },
//    upload: function(taskId) {
//        try{
//            FlashForJS.upload(taskId);
//            var file = this.getFileObj(taskId);
//            file.state = "uploading";
//        }catch(e){
//            alert(e);
//        }
//    },
//    uploadList:function(size,files){
//        //this.data.splice(0,this.data.length);
//        //this.curIndex = 0;
//        var strList = [];
//        if(attach.checkFileSize(size)){
//            var firstFile = files[0];
//            for(var i=0;i<files.length;i++){
//                this.data.push(files[i]);
//                attach.addAttachContainer(files[i]);
//            }
//            this.upload(firstFile.taskId);
//        }else{
//            CC.alert(Lang.Mail.Write.attachmentSize);
//        }
//        attach.setAttachHeight();
//    },
//    getFileObj:function(taskId){
//        for(var i=0;i<this.data.length;i++){
//            if(this.data[i].taskId==taskId){
//                this.data[i].index = i;
//                return this.data[i];
//            }
//        }
//    },
//    updateFileObj:function(taskId,fileId){
//        for(var i=0;i<this.data.length;i++){
//            if(this.data[i].taskId==taskId){
//                this.data[i].fileId = fileId;
//                return this.data[i];
//            }
//        }
//    },
//    getNextFile:function(taskId){
//        //this.curIndex++;
//        for(var i=0;i<this.data.length;i++){
//            if(this.data[i].taskId==taskId){
//                if(i<this.data.length-1){
//                    return this.data[i+1];
//                }else{
//                    return null;
//                }
//            }
//        }
//    },
//    nextUpload:function(taskId){
//        var file =  this.getNextFile(taskId);
//        if(file){
//            this.upload(file.taskId);
//        }else{
//            PageState = PageStateTypes.Common;
//        }
//    },
//    deleteAttach:function(taskId,size){
//        var file = this.getFileObj(taskId) || {};
//        size = size || file.fileSize || 0;
//        var state = file.state || "init";
//        var index = file.index;
//        //如果 flash附件正在上传，则调用flash取消任务的方法，并移除附件
//        if(state=="uploading" || state=="error"){
//            this.cancel(taskId);
//            attach.removeFile(taskId,size);
//            this.curIndex--;
//            this.nextUpload(taskId);
//            this.data.splice(index,1);
//        }else if(state=="init"){
//            attach.removeFile(taskId,size);
//            this.data.splice(index,1);
//        }else if(state=="ok"){
//            //fileId存在，表示附件该附件上传完成，调用服务器端删除附件，并移除附件
//            //服务器删除附件使用文件本身的fileId
//            if (file.fileId) {
//                attach.deleteTasks(file.fileId, function(){
//                    //移除附件节点使用taskId
//                    FlashUpload.data.splice(index,1);
//                    attach.removeFile(taskId, size);
//                });
//            }
//        }
//    },
//    cancel: function(taskId) {
//        FlashForJS.cancel(taskId);
//    },
//    /***
//     * 检查浏览器是否支持Flash控件
//     */
//    checkSupportFlash:function(){
//        var isFlash = false;
//        if (parent.Browser.isIE || window.ActiveXObject) {
//            try {
//                var flash = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.10");
//            } catch (e) {
//                try {
//                    var flash = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.9");
//                } catch (e) { }
//            }
//            isFlash = !!flash;
//        }
//        else {//非IE
//            var swf = navigator.plugins["Shockwave Flash"];
//            if (swf) {
//                isFlash = true;
//            }
//            else{
//                isFlash = false;
//            }
//        }
//        //isFlash = isFlash && (parent.Browser.value != "chrome");
//        return isFlash;
//    }
//};


//JS公开给Flash调用的接口
JSForFlashUpload = {
    /**
     * 获取上传url的回调方法
     * @return {String} 上传文件的完整地址信息
     */
    getUploadUrl: function() {
        //这里返回上传cgi的URL
        return attach.getUploadUrl("","",true);
    },
    /**
     * 用户选择文件的回调方法
     * @param {String} xmlFileList 用户选择的文件列表(用xml格式字符串表示，可解析xml获取文件列表)
     */
    onselect: function(xmlFileList) {
        //当用户点击flash，弹出文件选择框，选完文件后调用JS，其中xmlFileList是xml格式的文件信息
        //除了文件信息以外还会生成一个taskId，这个以后要上传次文件，就把这个taskId传给flash就行了
        xmlFileList = xmlFileList.replace(/[\t\s]+/g,"");
        var doc = parent.Util.str2Dom(xmlFileList);//返回一个xml文档对象
        var list = doc.firstChild.childNodes;
        var filelist = [];
        for(var i=0;i<list.length;i++){
            var node=list[i];
            var size = parseInt(parent.Util.getXMLValue(node.childNodes[2]),10);
            var filename = parent.Util.getXMLValue(node.childNodes[1]);
            var obj = {
                taskId: parent.Util.getXMLValue(node.childNodes[0]),
                fileName: filename,
                fileSize: size,
                uploadType: "flash"
            };
            filelist.push(obj);
        }
        if (filelist.length > 0) {
            return uploadManager.uploadFile(filelist);
        }
    },
    /**
     * 上传进度的回调方法
     * @param {String} taskId 任务id
     * @param {Number} sendedSize 已上传字节
     * @param {Number} uploadSpeed 上传速度，单位为 字节/秒
     */
    onprogress: function(taskId, sendedSize, uploadSpeed) {
        var file = utool.getFileById(taskId);
        if (!file) return;
        window.currentFileId = file.fileId;
        file.state = "uploading";
        file.sendedSize = sendedSize;
        file.uploadSpeed = uploadSpeed;
        file.progress = parseInt(sendedSize / file.fileSize * 100,10);
        file.updateUI();
    },
    /**
     * 上传成功后的回调方法
     * @param {String} taskId 任务id
     * @param {String} responseText 服务器响应的报文
     */
    oncomplete: function(taskId, responseText) {
        window.currentFileId = null;
        window.currentSip = null;
        var file = utool.getFileById(taskId);
        var result = utool.checkUploadResultWithResponseText({ fileName: file.filePath, responseText: responseText });
        if (result.success) {
            file.state = "complete";
            file.fileId = result.fileId;
            file.updateUI();
            attach.uploadOk("flash", taskId, result);
        } else {
            file.state = "error";
            file.updateUI();
            CC.alert('文件上传失败，请删除后重试！');
        }
        uploadManager.autoUpload();
    },
    /**
     * 上传出错回调方法
     * @param {String} taskId
     * @param {String} errorCode
     * @param {String} errorMsg
     */
    onerror: function(taskId, errorCode, errorMsg) {
        var file = utool.getFileById(taskId);

        if (file) {
            file.state = "blockerror";
            file.updateUI();
        }
    },
    //鼠标经过flash的时候
    onmouseover: function() {
        upload_module.showUploadTip();
        if(upload_module.t2){
            clearTimeout(upload_module.t2);
        }
        //console.log('flash over --> ' + upload_module.listining_tips_shown);
    },
    //鼠标移除flash的时候
    onmouseout: function() {
        var f = function(){
            if(upload_module.listining_tips_shown){

            }
            else{
                upload_module.hideUploadTip();
            }
        };
        upload_module.t1 = setTimeout(f, 20);
    },
    //鼠标点击flash的时候
    onclick: function() {
        if (PageState == PageStateTypes.Uploading){
            CC.alert(Lang.Mail.Write.fileUploading);
            return false;
        }else{
            return true;
        }
    }
};

////Flash里公开给js调用的接口
//FlashForJS = {
//    upload: function(taskId) {
//        var flash = document.getElementById("flashplayer");
//        flash.upload(taskId);
//    },
//    cancel: function(taskId) {
//        var flash = document.getElementById("flashplayer");
//        flash.cancel(taskId);
//    }
//};

//机械化操作
utool = {
    getMaxUploadSize: function () {
        return attach.maxSize;
    },
    checkFileExist: function (fileName) {
        fileName = utool.getFileNameByPath(fileName);
        var list = uploadManager.fileList;
        for (var i = 0; i < list.length; i++) {
            var file = list[i];
            if (file.fileName == fileName) return true;
        }
        return false;
    },
    getUploadTipMessage: function () {
        var tip = Utils.format("添加小于{0}M的附件", [utool.getMaxUploadSize()]);
        if (supportUploadType.isSupportScreenShotUpload) {
            //tip += "，可使用 Ctrl+V 粘贴附件和图片";
            if(jQuery('#aattach').html().indexOf('(') > 0){
                tip = '添加最大1G的附件';
            }
        }else{
            //tip += "<br/>安装<a hideFocus='1' style='color:blue' href='javascript:void(0);' onclick='return upload_module_multiThread.isSetup();'>邮箱小工具</a>，即可Ctrl+V粘贴上传附件"
        }
        /*
         if (supportUploadType.isSupportFlashUpload) {
         tip += "<br/>当前正在使用Flash上传组件，如果上传异常，您可以选择<a style='font-weight:bolder;color:blue;text-decoration: underline;' href='javascript:;' onclick='utool.showDisableFlashMsg();return false;'>普通上传</a>";
         }*/
        return tip;
    },
    //弹出禁用flash上传的对话框
    showDisableFlashMsg: function () {
        if (confirm("您是否要禁用Flash上传组件?")) {
            var d = new Date();
            d.setFullYear(2099);
            $Cookie.set({name : 'flashUploadDisabled',value : '1',expries : d});
            alert("Flash上传组件已经禁用，您下次打开写信页将使用原始但是稳定的上传方式。");
        }
    },
    //检测加上文件大小是否超标
    checkSizeSafe: function (size) {
        return this.getRemainSize() > size;
    },
    //获得目前已使用的控件
    getSizeNow: function () {
        var sizeNow = 0;
        var list = uploadManager.fileList;
        for (var i = 0; i < list.length; i++) {
            var file = list[i];
            if (file.fileSize) sizeNow += file.fileSize;
        }
        return sizeNow;
    },
    //获得剩余的可上传文件大小
    getRemainSize: function () {
        return this.getMaxUploadSize() * 1024 * 1024 - this.getSizeNow();
    },
    //截取文件名
    shortName: function (fileName) {
        if (fileName.length <= 30) return fileName;
        var point = fileName.lastIndexOf(".");
        if (point == -1 || fileName.length - point > 5) return fileName.substring(0, 28) + "…";
        return fileName.replace(/^(.{26}).*(\.[^.]+)$/, "$1…$2");
    },
    getFileNameByPath: function (filePath) {
        return filePath.replace(/^.+?\\([^\\]+)$/, "$1");
    },
    getFileById: function (fid) {
        var list = uploadManager.fileList;
        for (var i = 0; i < list.length; i++) {
            var f = list[i];
            if (f.fileId == fid || f.taskId == fid) {
                return f;
            }
        }
        return null;
    },
    getAttachFiles: function () {
        var result = upload_module.model.composeAttachs;

        //干掉没有文件名的附件2010-12-16 by lifl
        try {
            for (var i = 0; i < result.length; i++) {
                var __file = result[i];
                if (!__file.fileName && !__file.name) {
                    result.splice(i, 1);
                    i--;
                }
            }
        } catch (e) { }
        //替换fileRealSize属性
        for(var i=0;i<result.length;i++){
            var aItem = result[i];
            if(aItem.fileRealSize){
                aItem.base64Size = aItem.fileSize;
                aItem.fileSize = aItem.fileRealSize;
            }
        }

        return result;
    },
    getControlUploadUrl: function (isInlineImg) {
        var type = isInlineImg ? 1 : 3;
        return attach.getUploadUrl("", type);
    },
    getBlockUploadUrl:function(){
        var url = "http://" + window.location.host + "/RmWeb/mail?func=attach:upload2&sid=" + upload_module.model.sid + "&composeId=" + upload_module.model.composeId;
        return url;
    },
    /*
     insertImageToEditor: function(strResponse) {
     var reg_more = /fileId:(\d+),fileName:"([^"]+)"/g;
     var reg_single = /fileId:(\d+),fileName:"([^"]+)"/;
     var match = strResponse.match(reg_more);
     if (match) {
     match = match[match.length - 1].match(reg_single);
     var fileId = match[1];
     var fileName = match[2];
     var url = getAttachImageUrl(fileId);
     editorAgent.insertImage(url);
     }
     },
     */
    checkUploadResultWithResponseText: function (param) {
        var text = param.responseText;
        var result = {};
        var reg = /'var':([\s\S]+?)\};<\/script>/;
        if (text.indexOf("'code':'S_OK'") > 0) {
            var m = text.match(reg);
            result = eval("(" + m[1] + ")");
            result.success = true;
            addCompleteAttach(result);
        } else {
            result.success = false;
        }
        return result;
    },
    isScreenShotUploading: function () {
        return Boolean(window.upload_module_screenShot && upload_module_screenShot.isUploading);
    },
    //鼠标经过上传按钮显示一段提示文本
    showUploadTip: function () {
        return;
        var j = $("#divUploadTip");
        if (j.length == 0) {
            j = $("<div id='divUploadTip' style='position:absolute;display:none'>安装小工具</div>").appendTo(document.body);
        }
        var offset = $("#realUploadButton").offset();
        j.css({
            left: offset.left,
            top: offset.top - document.body.scrollTop + 20,
            display: ""
        });
    },
    hideUploadTip: function () {
        $("#divUploadTip").hide();
    },
    isImageFile: function (fileName) {
        return /\.(?:jpg|jpeg|gif|png|bmp)$/i.test(fileName);
    },
    //如果邮件没有主题，则把文件名加上
    fillSubject: function (fileName) {
        var txtSubject = document.getElementById("txtSubject");
        if (txtSubject.value == "") {
            txtSubject.value = fileName;
            // add by tkh
            upload_module.model.autoSaveTimer['subMailInfo']['subject'] = fileName;
        }
    },
    logUpload: function(code, info) {
//        var part= top.$User.getPartid();
//        var domainList = {
//            0:"http://disk0.mail.10086.cn",
//            11:"http://disk1.mail.10086.cn",
//            1:"http://disk3.mail.10086.cn",
//            12:"http://disk2.mail.10086.cn"
//        }
//        // update by tkh
//        if(!domainList[part]){
//            //console.log('没找到分区号对应的URL。part：'+part);
//            return;
//        }
//
//        var url = domainList[part] + "/Ajax/DiskUploadState.ashx?sid=" + top.$App.getSid() + "&rnd=" + Math.random();
//        url += "&code=" + code;
//        if (info) url += "&info=" + encodeURIComponent(info);
//        var img = new Image();
//        img.src = url;
//        img.style.display = "none";
//        document.body.appendChild(img);
    }
}
UploadLogs = {
    CommonStart: 5001,
    CommonCancel: 5002,
    CommonSuccess: 5003,
    CommonFail: 5004,
    CommonFailInfo: 5005,
    AjaxStart: 5051,
    AjaxCancel: 5052,
    AjaxSuccess: 5053,
    AjaxFail: 5054,
    AjaxFailInfo: 5055,
    FlashStart: 6001,
    FlashCancel: 6002,
    FlashSuccess: 6003,
    FlashFail: 6004,
    FlashFailInfo: 6005,
    MultiStart: 7001,
    MultiStop: 7002,
    MultiContinue: 7003,
    MultiCancel: 7004,
    MultiSuccess: 7005,
    MultiFail1: 7006,
    MultiFail2: 7007
};
//向下兼容，插入图片那个页面会调用
function getFileIdByName(fileName){
    var list = uploadManager.fileList;
    for(var i=0;i<list.length;i++){
        var f = list[0];
        if(f.filePath==fileName || f.fileName == fileName){
            return f.fileId;
        }
    }
    return null;
};;;

var UploadManager = function() {
    this.init.apply(this, arguments);
}

var TaskID = 10000;
UploadManager.prototype = {
    //同一时刻只会有一种上传方式正在上传
    init: function (c) {
        var This = this;
        var $ = jQuery;
        this.currentUploadType = "none"; // "common|flash|screenshot|html5|mutil",
        this.fileList = [];
        this.container = c.container;
        this.jContainer = $(c.container);
        this.jContainer.click(function (e) {
            var target = e.target;
            if ((target.tagName == "I" || target.tagName == "A") && target.getAttribute("command")) {
                var taskId = target.getAttribute("taskid");
                var fileId = target.getAttribute("fileid");
                var file = utool.getFileById(taskId || fileId);
                This.doCommand({
                    command: target.getAttribute("command"),
                    file: file
                });
                upload_module.model.autoSendMail = false;
            }
        });
    },
    doCommand: function (param) {
        //DeleteFile|CancelUpload|RemoveWaiting
        switch (param.command) {
            case "RemoveFile":
                this.removeFile(param.file);
                // add by tkh 添加break
                break;
            case "DeleteFile":
                upload_module.deleteFile(param);
                break;
            case "CancelUpload":
                param.file.cancelUpload();
                uploadManager.autoUpload();
                PageState = PageStateTypes.Common;
                break;
            case "ResumeUpload"://续传-flash
                UploadFacade.uploadResume();//todo 耦合了，通过uploadManager中转调用
                break;
        }
    },
    isUploadAble: function () {
        //当前是否可以使用上传
        return !this.isUploading();
    },
    //添加上传任务
    uploadFile: function (param) {
        var $ = top.jQuery;
        if (!$.isArray(param)) param = [param];
        var totalSize = 0;
        for (var i = 0; i < param.length; i++) {
            var item = param[i];
            //截屏控件上传，无法预先判断文件是否重复
            if (item.uploadType != "screenShot" && utool.checkFileExist(item.fileName)) {
                if (!item.replaceImage) {
                    var fileNameExist = ComposeMessages.FileNameExist,
                        fileName = Utils.htmlEncode(utool.getFileNameByPath(item.fileName));
                    var errorMsg = Utils.format(fileNameExist, [fileName]);
                    CC.alert(errorMsg);
                    return;
                }
            }
            if (item.uploadType == "multiThread" && item.fileSize == 0) {
                if (!item.replaceImage) {
                    var noFileSize = ComposeMessages.NoFileSize,
                        fileName = Utils.htmlEncode(utool.getFileNameByPath(item.fileName));
                    var errorMsg = Utils.format(noFileSize, [fileName]);

                    CC.alert(errorMsg);
                    return false;
                }
            }
            if (item.fileSize) {
                totalSize += item.fileSize;
            }
        }

        if (!utool.checkSizeSafe(totalSize)) {
            CC.alert(parent.Lang.Mail.Write.attachmentSize);
            return false;
        }

        for (var i = 0; i < param.length; i++) {
            var item = param[i];
            var fileInfo = {};
            fileInfo.uploadType = item.uploadType; // "common|flash|screenshot|html5|mutil",
            fileInfo.fileName = item.fileName; //ie6 会把文件路径带过来
            fileInfo.fileSize = item.fileSize || 0; //普通上传可能不知道文件大小
            fileInfo.taskId = item.taskId || TaskID++; //普通上传就不用这个东西了
            fileInfo.fileObj = item.fileObj; //ajax
            fileInfo.insertImage = item.insertImage;
            fileInfo.replaceImage = item.replaceImage;
            if (fileInfo.uploadType == "common") {
                fileInfo.state = "uploading";
            } else {
                fileInfo.state = item.state;
            }
            var file = new UploadFileItem(fileInfo);
            this.fileList.push(file);
        }

        this.render({ type: "add" });
        var This = this;
        Meeting.getComposeId(function () {
            This.autoUpload();
        });
    },
    removeFile: function (file) {
        var list = this.fileList;
        for (var i = 0; i < list.length; i++) {
            var f = list[i];
            if (f.taskId == file.taskId) {
                list.splice(i, 1);
                f.remove();
                removeFromAttach(f.fileId);
                break;
            }
        }
        this.render({ type: "remove" });
    },
    //上传文件，每次只上传一个
    autoUpload: function () {
        //top.addBehavior("写信页-点击上传附件",11);
        var list = this.fileList;
        var isUploading = this.isUploading();
        if (!isUploading) {
            for (var i = 0; i < list.length; i++) {
                var file = list[i];
                if (file.state == "waiting") {
                    file.upload();
                    return true;
                }
            }
            if (upload_module.model.autoSendMail) {//自动发送
                setTimeout(function () {
                    if (upload_module.model.autoSendMail) {
                        // btnSendOnClick();
                        $("#topSend").click();
                    }
                }, 2000);
            }
        }
        return false;
    },
    isUploading: function () {
        var list = this.fileList;
        for (var i = 0; i < list.length; i++) {
            var file = list[i];
            if (file.state == "uploading") return true;
        }
        return false;
    },
    //界面更新
    render: function (param) {
        var container = jQuery(this.container);
        if (param && param.type == "refresh") container.html("");
        //根据文件项的状态更新他们的ui
        var list = this.fileList;
        for (var i = 0; i < list.length; i++) {
            var f = list[i];
            if (f.insertImage || f.replaceImage) { //如果插入的是内联图片，则不生成附件列表
                f.updateUI();
            } else if (f.hasUI()) {
                f.updateUI();
            } else {
                container.append(f.createUI());
            }
        }

        container[container.html() != "" ? "show" : "hide"]();
        container[container.html() != "" ? "removeClass" : "addClass"]("hide");
    },
    //重新刷新所有附件状态
    refresh: function () {
        var newList = this.fileList = [];
        var list;
        //添加大附件
        /*list = Arr_DiskAttach;
         for (var i = 0; i < list.length; i++) {
         var fileInfo = list[i];
         var file = new UploadFileItem({
         type: "LargeAttach",
         fileName: fileInfo.fileName,
         fileId: fileInfo.fileId,
         fileSize: fileInfo.fileSize,
         isComplete: true //是已经上传完的文件
         });
         newList.push(file);
         }*/
        //添加普通附件
        list = utool.getAttachFiles();
        for (var i = 0; i < list.length; i++) {
            var fileInfo = list[i];
            var file = new UploadFileItem({
                type: "Common",
                fileName: fileInfo.fileName || fileInfo.name,
                fileId: fileInfo.id || fileInfo.fileId,
                fileSize: fileInfo.fileSize || fileInfo.size || 0,
                insertImage: fileInfo.insertImage,
                replaceImage: fileInfo.replaceImage,
                isComplete: true
            });
            newList.push(file);
        }
        //刷界面
        this.render({ type: "refresh" });
    },
    onUploadError: function (msg) {
        CC.alert(msg);
    },
    cancelUploading: function () {
        for (var i = 0; i < this.fileList.length; i++) {
            var item = this.fileList[i];
            if ( item.state == "uploading") {
                item.cancelUpload();
            }
        }
    }
};;;

var ComposeMessages = {
    PleaseUploadSoon: "附件上传中，请稍后再添加新的附件",
    FileSizeOverFlow: '<div class="pop-wrap"><div class="j_tool_w"><p style="padding:0 10px"><strong>您添加的文件大小超过{0}M</strong></p><p class="j_tool_note"><font style="color:#333;">不用担心 您可以使用超大附件来发送。</font><br/>超大附件保存在文件中转站中，更环保，对方也可以高速下载.</p></div></div>',//"对不起，文件大小超出附件容量限制。"
    FileNameExist: '"{0}"相同的文件名已经存在,请重命名后再上传',
    FileUploadError: "文件\"{0}'上传失败",
    FileIsUsing: "对不起，文件正在被其它应用程序占用，请关闭文件后再试。",
    BrowserDonotSuppertScreenShot: "您的浏览器暂不支持截屏功能",
    GetLargeAttachFail: "获取大附件失败，请稍后再试",
    ExistFileName: "已上传附件中存在相同文件名，请重命名后再试。",
    NoFileSize: '"{0}"文件大小为 0 字节，无法上传'
};

upload_module_common = {
    init: function (model) {
        var btnAttach = document.getElementById("uploadInput");
        btnAttach.onchange = function () {
            var $ = jQuery;
            var input = this;
            var fileName = input.value;
            if(!fileName)return;
            var form = document.forms["formAttach"];
            if (utool.checkFileExist(fileName)) {
                CC.alert(ComposeMessages.ExistFileName);
                form.reset();
                return;
            }

            //兼容老版上传
            attach.tempFileObject = {
                uploadType:"form",
                fileId: fileName,
                fileName:fileName
            };

            Meeting.getComposeId(function () {
                post();
            });
            function post() {
                form.action = utool.getControlUploadUrl();
                try {
                    form.submit();
                } catch (e) {
                    $("#frmAttach").attr("src", "/blank.htm").load(function () {
                        $(this).unbind("load", arguments.callee);
                        form.submit();
                    });
                }
            }
        };
        btnAttach.onclick = function () {
            Meeting.getComposeId();
            if (uploadManager.isUploading()) {
                CC.alert(ComposeMessages.PleaseUploadSoon);
                return false;
            }
        };
    },
    //不知道进度
    showUploading: function (fileName) {
        uploadManager.uploadFile({
            fileName: fileName,
            uploadType: "common"
        });
    }
};

var upload_module_flash = {
    init: function() {
        var url = parent.gMain.resourceServer + "/se/mail/activex/muti_upload.swf";
        if(supportUploadType.isSupportOldFlashUpload){
            url = parent.gMain.rmSvr + "/RmWeb/upload.swf";
        }
        var attachLink = jQuery('#aattach');
        var flashWidth = 50; //attachLink ? attachLink.width() + 2 :
        var tmpNode;
        if(attachLink.html()!=''){
            tmpNode = jQuery('<span>' + attachLink.html() + '</span>').appendTo(document.body);
            flashWidth = tmpNode.width() + 2;
            tmpNode.hide().remove();
        }
        var so = new SWFObject(url, "flashplayer", flashWidth, "20");
        so.addParam("wmode","transparent");
        so.addParam('allowscriptaccess', 'sameDomain');
        so.write();

        //增加检测flash是否正常运作的机制
        //3秒后如果flash不能正常运行，则弄成普通上传
        !supportUploadType.isSupportOldFlashUpload && setTimeout(function () {
            if (!upload_module_flash.isRealOK) {
                var reset = false;
                try {
                    if (!document.getElementById("flashplayer").upload) {
                        reset = true;
                    }
                    UploadFacade.init();
                } catch (e) {
                    reset = true;
                }
                if (reset) resetCommonUpload();
            }
        }, 3000) ;
        function resetCommonUpload() {
            upload_module_common.init();
            jQuery("#formAttach").show();
            supportUploadType.isSupportFlashUpload = false;
            GC.setCookie("flashUploadDisabled", "1");
            document.getElementById("flashplayer").style.display = "none";
        }
    },
    upload: function(taskId) {
        UploadFacade.upload(taskId);
        var file = utool.getFileById(taskId);
        file.state = "uploading";
        file.updateUI();
    },
//    cancel: function(file) {
//        UploadFacade.cancel(file.taskId);
//        uploadManager.removeFile(file);
//        uploadManager.autoUpload();
//    },

    cancel: function (file) {
        var fileId= window.currentFileId

        window.currentFileId = null;
        window.currentSip = null;

        UploadFacade.cancel(file.taskId);
        var obj = {
            func: parent.gConst.func.deleteAttach,
            data: {
                composeId: upload_module.model.composeId,
                items: [fileId]
            },
            call: function(resp){
                try {
                    if (resp.code == "S_OK") {
                        uploadManager.removeFile(file);
                        uploadManager.autoUpload();
                    }
                }catch(e){
                    parent.ch("delete attach error." + e);
                }
            },
            msg: parent.Lang.Mail.Write.deletingAttach
        };
        parent.MM.mailRequestApi(obj);
    },
    isSupport: function() {
        //由于其它浏览器不发送Coremail Cookie 所以flash上传暂时只支持ie
        if (document.all && window.ActiveXObject) {
            //用户曾经手动触发禁用flash上传
            /*
             if (Utils.getCookie("flashUploadDisabled") == "1") {
             return false;
             }
             */
            try {
                var flash = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.10");
            } catch (e) {
                try {
                    var flash = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.9");
                } catch (e) { }
            }
            if (flash) return true;
        }else {//非IE
            flash = navigator.plugins["Shockwave Flash"];
            if (flash) return true;
        }
        return false;
    }
}
UploadFacade = {
    getFlashObj:function(){
        return document.getElementById("flashplayer");
    },
    init: function () {
        var uploadUrl = utool.getBlockUploadUrl(true),
            obj = this.getFlashObj();

        obj.setUploadUrl(uploadUrl);
        obj.setOptions({});
    },
    getUploadUrl: function () {
        var result = utool.getBlockUploadUrl(true);
        return result;
    },
    onclick: function() {
        //upload_module.model.requestComposeId();
        if (!upload_module.model.composeId) {
            upload_module.model.composeId = Math.random();
        }
        return true;
    },
    _blockInfo:{},
    getBlockInfo:function(){},
    onrequest:function(args){

        result = {
            type: 1,
            //fileid: null,
            filesize: args.fileSize,
            timestamp: new Date().toDateString(),
            range: args.offset + "-" + (Number(args.offset) + Number(args.length)).toString()
            //sip:null
        }
        if (window.currentFileId) {
            result.fileid = window.currentFileId;
            result.sip = window.currentSip;
        }
        //console.log(result);
        return result;
    },
    onprogress:function(args){
        var fileId = args.data.match(/'fileId':'(.+?)'/)[1];
        var sip = args.data.match(/'sip':'(.+?)'/)[1];

        window.currentFileId = fileId;
        window.currentSip = sip;
        //alert(args.percent);
        if (window.currentSip) {
            var urlNew = utool.getBlockUploadUrl(true) + "&sip=" + window.currentSip;
            this.getFlashObj().setUploadUrl(urlNew);
        }

        var taskId = args.taskId;
        var file = utool.getFileById(taskId);
        if (!file) return;
        file.state = "uploading";
        file.sendedSize = args.bytesLoaded;
        file.uploadSpeed = args.speed;
        file.progress = args.percent;
        file.updateUI();

    },
    oncomplete: function (args) {
        window.currentFileId = null;
        window.currentSip = null;

        var file = utool.getFileById(args.taskId);
        var result = utool.checkUploadResultWithResponseText({ fileName: file.filePath, responseText: args.data });
        if (result.success) {
            file.state = "complete";
            file.fileId = result.fileId;
            file.updateUI();
            attach.uploadOk("flash", args.taskId, result);
            //utool.logUpload(UploadLogs.FlashSuccess);
        } else {
            file.state = "error";
            file.updateUI();
            //FF.alert("文件上传失败，请删除后重试！");
            CC.alert('文件上传失败，请删除后重试！');
            //utool.logUpload(UploadLogs.FlashFailInfo);
        }
        uploadManager.autoUpload();
    },
    onselect: function (args) {
        var list = [];
        for(var i=0;i<args.length;i++){
            var item=args[i];
            var obj = {
                taskId: item.taskId,
                fileName: decodeURIComponent(item.fileName),
                fileSize: item.fileSize,
                uploadType: "flash"
            };
            list.push(obj);
        }
        if (list.length > 0) {
            if(!uploadManager.uploadFile(list)){
                //取消上传
            }
        }
    },
    onerror: function (args) {
        var file = utool.getFileById(args.taskId);

        if (file) {
            file.state = "blockerror";
            file.updateUI();
        }
    },
    uploadResume:function(){
        this.getFlashObj().uploadResume();
    },
    upload: function (taskId) {
        if(supportUploadType.isSupportOldFlashUpload){
            try{
                UploadFacade.getFlashObj() && UploadFacade.getFlashObj().upload(taskId);
            }catch(error){
                CC.alert(error);
            }
        }
    },
    cancel: function (taskId) {
        UploadFacade.getFlashObj().cancel(taskId);
    },
    onmouseover: function(){
        upload_module.showUploadTip();
        if(upload_module.t2){
            clearTimeout(upload_module.t2);
        }
    },
    onmouseout: function(){
        var f = function(){
            if(upload_module.listining_tips_shown){

            }
            else{
                upload_module.hideUploadTip();
            }
        };
        upload_module.t1 = setTimeout(f, 20);
    }
};
//为了降低系统复杂性，旧的上传控件不再使用
upload_module_screenShot = {
    isSupport: function () {
        //抛弃旧的截屏控件，降低复杂性
        return false;
    }
};

var upload_module_ajax = {
    init: function() {
        this.registerDocEvent(document);
        //如果支持控件上传，点击附件按钮不使用ajax上传，只在拖放时应用
        //if (supportUploadType.isSupportMultiThreadUpload) return;

        var uploadInput = document.getElementById("uploadInput");
        uploadInput.onmouseover = function() {
            Meeting.getComposeId();
            uploadInput.onmouseover = null;
        }
        uploadInput.setAttribute("multiple", true);
        uploadInput.onchange = function() {
            var files = this.files;
            Meeting.getComposeId(function(){
                _uploadFiles(files);
            });
            this.value = "";
        }
        uploadInput.onclick = function() {
            if (upload_module_screenShot.isUploading) {
                CC.alert(ComposeMessages.PleaseUploadSoon);
                return false;
            }
        };
    },
    registerDocEvent: function(doc){
        doc.body.addEventListener("dragenter", _dragenter, false);
        doc.body.addEventListener("dragover", _dragover, false);
        doc.body.addEventListener("drop", _drop, false);
    },
    upload: function(file) {
        if (!file || !file.fileObj) return;
        HTML5AJAXUpload.upload(file);
    },
    cancel: function() {
        HTML5AJAXUpload.stop();
        if (HTML5AJAXUpload.currentFile) uploadManager.removeFile(HTML5AJAXUpload.currentFile);
        uploadManager.autoUpload();
    },
    isSupport: function() {
        //火狐3.6以上,Chrome,IE10+ 支持XMLHttpRequest上传文件
        if (window.FormData && /Chrome|Firefox|MSIE 1\d/i.test(navigator.userAgent)) {
            return true;
        } else {
            return false;
        }
    }
};

var HTML5AJAXUpload = {
    upload: function(fileInfo) {
        var file = fileInfo.fileObj;
        var This = this;
        this.currentFile = fileInfo;
        var xhr = this.getFileUploadXHR();
        xhr.upload.onprogress = xhr.upload.onloadstart = xhr.upload.onload = function(oEvent) {
            if (oEvent.lengthComputable) {
                var f = This.currentFile; //ff下xhr事件指针有bug，所以不能直接用fileInfo
                f.sendedSize = oEvent.loaded;
                f.progress = parseInt(f.sendedSize / f.fileSize * 100);
                f.state = "uploading";
                f.updateUI();
            }
        };
        var url = utool.getControlUploadUrl();
        xhr.open("POST", url, true);


        xhr.onreadystatechange = function() {
            //abort也会触发，但是xhr.responseText为空
            if (xhr.readyState == 4 && xhr.responseText) {
                var f = This.currentFile;
                var uploadResult = utool.checkUploadResultWithResponseText({
                    responseText: xhr.responseText,
                    fileName: f.fileName
                });
                if (uploadResult.success) {
                    f.fileId = uploadResult.fileId;
                    f.state = "complete";
                    f.updateUI();
                    utool.logUpload(UploadLogs.AjaxSuccess);
                } else {
                    f.state = "uploading";
                    f.updateUI();
                    utool.logUpload(UploadLogs.AjaxFail);

                    var response = xhr.responseText;
                    if(response.indexOf('FA_ATTACH_SIZE_EXCEED') > 0){
                        // 附件大小超过服务端允许的大小 add by tkh
                        //e.log('附件大小超过服务端允许的大小!responseText:'+response);
                        CC.alert(Utils.format(ComposeMessages.FileSizeOverFlow, [utool.getMaxUploadSize()]));
                    }else if(response.indexOf('FS_UNKNOWN') > 0){
                        //console.log('上传文件未知错误!responseText:'+response);
                        CC.alert('对不起，上传附件失败，请删除后重试！');
                    }
                }
                uploadManager.autoUpload();
            }
        }

        var fd = new FormData();
        fd.append("Filedata", file);
        xhr.send(fd);

        fileInfo.state = "uploading";
        fileInfo.updateUI();
        utool.logUpload(UploadLogs.AjaxStart);
    },
    stop: function() {
        this.getFileUploadXHR().abort();
        utool.logUpload(UploadLogs.AjaxCancel);
    },
    getFileUploadXHR: function() {
        if (!window.fileUploadXHR) {
            fileUploadXHR = new XMLHttpRequest();
        }
        return fileUploadXHR;
    }
}
function _dragenter(e){
    Meeting.getComposeId()
    e.stopPropagation();
    e.preventDefault();
}
function _dragover(e){
    e.stopPropagation();
    e.preventDefault();
}
function _drop(e){
    e.stopPropagation();
    e.preventDefault();
    if(!upload_module.model.composeId || !e.dataTransfer.files || e.dataTransfer.files.length==0){
        return;
    }
    var files = e.dataTransfer.files;
    for (var i = 0; i < files.length; i++) {
        if(files[i].fileSize==0){
            var errorMsg = '不能拖放文件夹，以及大小为零的文件';
            CC.alert(errorMsg);
            return;
        }
    }
    _uploadFiles(e.dataTransfer.files);
}
function _uploadFiles(files){
    if (!files || files.length == 0) return;
    var list = [];
    for(var i=0;i<files.length;i++){
        var f=files[i];
        var obj = {
            fileName: f.fileName || f.name,
            fileSize: f.fileSize || f.size,
            fileObj: f,
            uploadType:"ajax"
        };
        list.push(obj);
    }
    uploadManager.uploadFile(list);
}
;

UploadFileItem = function() {
    this.init.apply(this, arguments);
}
getPreviewScrollImg = [];
UploadFileItem.prototype = {
    init: function (f) {
        this.uploadType = f.uploadType; //"common|flash|screenshot|html5|mutil"
        this.fileType = f.fileType || "common"; //disk|common
        this.filePath = f.fileName;
        this.fileName = decodeURIComponent(utool.getFileNameByPath(f.fileName));
        this.fileSize = parseInt(f.fileSize);
        this.taskId = f.taskId || Math.random(); //未传完的附件的任务号
        this.fileId = f.fileId; //附件的id
        this.fileObj = f.fileObj; //ajax文件对象
        this.insertImage = f.insertImage;
        this.replaceImage = f.replaceImage;
        this.isComplete = Boolean(f.isComplete);
        if (this.isComplete) {
            this.state = "complete";
        } else {
            this.state = f.state || "waiting";
        }

        this.lastUIState = "none";
        this.showProgress = this.uploadType != "common"; //是否显示上传进度条
        this.knownFileSize = f.uploadType != "common";
    },
    hasUI: function () {
        return Boolean(this.container);
    },
    createUI: function (previewImg) {
        var element = document.createElement("div");
        element.className = '';
        this.container = element;
        this.updateUI(previewImg);
        return element;
    },
    remove: function () {
        if (this.hasUI()) {
            try {
                this.container.parentNode.removeChild(this.container);
            } catch (e) { }
        }
    },
    //更新UI
    updateUI: function (previewImg) {
        var $ = jQuery;
        var isUpdateProgress = this.state == "uploading" && this.showProgress && this.lastUIState == "uploading";
        if (this.insertImage || this.replaceImage) {
            this.updateInsertImageLoading();
            return;
        }
        if (isUpdateProgress) {
            //只更新进度条
            this.updateProgress();
        } else {
            //更新html
            var htmlCode = "";
            switch (this.state) {
                case "waiting":
                    htmlCode = this.getWaitingHTML();
                    break;
                case "complete":
                    htmlCode = this.getCompleteHTML();
                    PageState = PageStateTypes.Common;
                    //Meeting.setSubjectTxt(this.fileName, true);
                    break;
                case "uploading":
                    htmlCode = this.showProgress ? this.getProgressUploadingHTML() : this.getCommonUploadingHTML();
                    break;
                case "blockerror": //上传中断
                    htmlCode = this.getProgressUploadingHTML({ resume: true })
                    break;
                case "error":
                    htmlCode = "";
                    break;
            }
            this.container.className = "upLoad shadow";
            this.container.innerHTML = htmlCode;
            $(this.container).show();
        }
        this.lastUIState = this.state;
    },
    //添加内联图片上传loading效果
    updateInsertImageLoading: function () {
        switch (this.state) {
            case "waiting":
            case "uploading":
                CC.showMsg('图片加载中...');
                break;
            case "complete":
                CC.hideMsg();
                break;
            case "error":
                break;
        }
        this.lastUIState = this.state;
    },
    isUploading: false,
    //等待上传的html
    getWaitingHTML: function () {
        var htmlCode = '<div class="upLoadBg"><div class="process" style="width:0%;">&nbsp;</div></div>\
                        <div class="upLoadText">\
                            <span class="fileName">\
                                <i class="i_video {fileIconClass}"></i>\
                                <span class="uploadFile_name">{prefix}.{suffix}</span>\
                                <span id="{taskId}_size" class="gray">{fileSizeText}</span>\
                            </span>\
                            <a hideFocus="1" href="javascript:void(0)" class="ml_5">\
                                <i class="i_u_close" \
                                    onmouseover="this.className=\'i_u_close_hover\'" \
                                    onmouseout="this.className=\'i_u_close\'"  \
                                    taskid="{taskId}" fileid="{fileId}" \
                                    uploadtype="{uploadType}" \
                                    filetype="{fileType}" \
                                    command="RemoveFile"></i>\
                            </a>\
                        </div>';
        var shortName = utool.shortName(this.fileName),
            prefix = shortName.substring(0, shortName.lastIndexOf('.') + 1),
            suffix = shortName.substring(shortName.lastIndexOf('.') + 1, shortName.length);
        var fileIconClass = parent.Util.getFileClasssName(this.fileName);
        var data = {
            fileIconClass: fileIconClass,
            prefix: prefix,
            suffix: suffix,
            fileId: this.taskId,
            fileSizeText: "",
            fileType: this.fileType,
            uploadType: this.uploadType,
            taskId: this.taskId
        };
        //如果是普通上传，就不知道文件大小了
        if (this.knownFileSize) {
            data.fileSizeText = (this.fileType == "largeAttach" ? this.fileSize : Utils.getFileSizeText(this.fileSize, { maxUnit: "K", comma: true }));
        }
        htmlCode = Utils.format(htmlCode, data);
        return htmlCode;
    },
    //上传完成的html
    getCompleteHTML: function () {
        var htmlCode = '<div class="upLoadBg"><div class="processed" style="width:100%;">&nbsp;</div></div>\
                        <div class="upLoadText">\
                            <span class="fileName">\
                                <i class="i_video {fileIconClass}"></i>\
                                <span class="uploadFile_name">{prefix}.{suffix}</span>\
                                <span id="{taskId}_size" class="gray">{fileSizeText}</span>\
                            </span>\
                            <a hideFocus="1" href="javascript:void(0)" class="ml_5">\
                                <i class="i_u_close" \
                                onmouseover="this.className=\'i_u_close_hover\'" \
                                onmouseout="this.className=\'i_u_close\'"  \
                                fileid="{fileId}" \
                                uploadtype="{uploadType}" \
                                filetype="{fileType}" \
                                command="DeleteFile"></i>\
                            </a>\
                        </div>';

        var shortName = utool.shortName(this.fileName),
            prefix = shortName.substring(0, shortName.lastIndexOf('.') + 1),
            suffix = shortName.substring(shortName.lastIndexOf('.') + 1, shortName.length);
        var fileIconClass = parent.Util.getFileClasssName(this.fileName);
        var data = {
            fileIconClass: fileIconClass,
            prefix: prefix,
            suffix: suffix,
            fileSizeText: this.fileType == "largeAttach" ? this.fileSize : Utils.getFileSizeText(this.fileSize, { maxUnit: "M", comma: true }),
            fileId: this.fileId,
            fileType: this.fileType
        };
        htmlCode = Utils.format(htmlCode, data);
        return htmlCode;
    },
    //普通上传中,没有进度条,取消上传不用传什么参数
    getCommonUploadingHTML: function () {
        var htmlCode = '<div class="upLoadBg"><div class="process" style="width:0;">&nbsp;</div></div>\
                        <div class="upLoadText">\
                            <span class="fileName">\
                                <i class="i_video {fileIconClass}"></i>\
                                <span class="uploadFile_name">{prefix}.{suffix}</span>\
                                <span id="{taskId}_size" class="gray">{fileSizeText}</span>\
                            </span>\
                            <a hideFocus="1" href="javascript:void(0)" class="ml_5">\
                                <i class="i_u_close" \
                                onmouseover="this.className=\'i_u_close_hover\'" \
                                onmouseout="this.className=\'i_u_close\'"  \
                                taskid="{taskId}" fileid="{fileId}" \
                                uploadtype="{uploadType}" \
                                filetype="{fileType}" \
                                command="CancelUpload"></i>\
                            </a>\
                        </div>';
        var shortName = utool.shortName(this.fileName),
            prefix = shortName.substring(0, shortName.lastIndexOf('.') + 1),
            suffix = shortName.substring(shortName.lastIndexOf('.') + 1, shortName.length);
        var fileIconClass = parent.Util.getFileClasssName(this.fileName);
        var data = {
            fileIconClass: fileIconClass,
            prefix: prefix,
            suffix: suffix,
            uploadType: "common",
            taskId: this.taskId
        };
        htmlCode = Utils.format(htmlCode, data);
        return htmlCode;
    },
    //显示进度条的上传中
    getProgressUploadingHTML: function (args) {
        var htmlCode = '<div class="upLoadBg"><div class="process" style="width:{progress}%;">&nbsp;</div></div>\
                        <div class="upLoadText">\
                            <span class="fileName">\
                                <i class="i_video {fileIconClass}"></i>\
                                <span class="uploadFile_name">{prefix}.{suffix}</span>\
                                {uploadTipText}\
                            </span>';
        var shortName = utool.shortName(this.fileName),
            prefix = shortName.substring(0, shortName.lastIndexOf('.') + 1),
            suffix = shortName.substring(shortName.lastIndexOf('.') + 1, shortName.length);
        var fileIconClass = parent.Util.getFileClasssName(this.fileName);
        var uploadTipText = "上传中";
        if (args && args.resume) {
            uploadTipText = '<span style="float:none;" class="colorff0101">上传失败</span>';
            htmlCode += "&nbsp;|&nbsp;<a href=\"javascript:void(0)\" command=\"ResumeUpload\" taskid=\"{taskId}\">续传</a>"
        }
        htmlCode += '<a hideFocus="1" href="javascript:void(0)" class="ml_5">\
                        <i class="i_u_close" \
                        onmouseover="this.className=\'i_u_close_hover\'" \
                        onmouseout="this.className=\'i_u_close\'"  \
                        taskid="{taskId}"\
                        uploadtype="{uploadType}" \
                        filetype="{fileType}" \
                        command="CancelUpload"></i>\
                    </a>\
                    </div>';
        var data = {
            fileIconClass: fileIconClass,
            prefix: prefix,
            suffix: suffix,
            uploadTipText:uploadTipText,
            progress: Math.min(this.progress || 0, 99),
            uploadType: this.uploadType,
            taskId: this.taskId
        };

        htmlCode = Utils.format(htmlCode, data);
        return htmlCode;
    },
    //更新进度条
    updateProgress: function () {
        var $ = jQuery;
        //不刷新删除按钮
        var li = document.createElement("li");
        li.innerHTML = this.getProgressUploadingHTML();
        var new1 = $(li).children()[0];
        var old1 = $(this.container).children()[0];
        old1.innerHTML = new1.innerHTML;
    },
    upload: function () {
        PageState = PageStateTypes.Uploading;
        if (this.uploadType == "flash") {
            upload_module_flash.upload(this.taskId);
        } else if (this.uploadType == "multiThread") {
            upload_module_multiThread.upload(this);
        } else if (this.uploadType == "ajax") {
            upload_module_ajax.upload(this);
        }
    },
    //取消正在上传的任务
    cancelUpload: function () {
        if (this.uploadType == "common") {
            refreshAttach();
            //utool.logUpload(UploadLogs.CommonCancel);
        } else if (this.uploadType == "flash") {
            return upload_module_flash.cancel(this);
        } else if (this.uploadType == "multiThread") {
            upload_module_multiThread.cancel(this);
        } else if (this.uploadType == "ajax") {
            upload_module_ajax.cancel(this);
        }
        refreshAttach(true); //刷新附件列表，保证准确性
        PageState = PageStateTypes.Common;
//        uploadManager.removeFile(this);
//        upload_module.model.autoSendMail = false;
    }
};
//var asynDeletedFile = "";

//var compose_attachs = [];

function addCompleteAttach(obj){
    //console.dir(obj);
    //给obj添加insertImage,replaceImage属性，不然刷新的时候会添加内联图片附件列表
    var fileList = uploadManager.fileList;
    for(var j=0;j<fileList.length;j++){
        var file = fileList[j];
        if(file.fileName == obj.fileName){
            obj.insertImage = file.insertImage;
            obj.replaceImage = file.replaceImage;
            break;
        }
    }
    for(var i=0;i<upload_module.model.composeAttachs.length;i++){
        if(upload_module.model.composeAttachs[i].fileId == obj.fileId) return;
    }
    upload_module.model.composeAttachs.push({
        fileId:obj.fileId,
        fileName:obj.fileName,
        fileSize:obj.fileSize,
        insertImage: obj.insertImage,
        replaceImage: obj.replaceImage
    });
}
function removeFromAttach(fid){
    for(var i=0;i<upload_module.model.composeAttachs.length;i++){
        if(upload_module.model.composeAttachs[i].fileId==fid){
            upload_module.model.composeAttachs.splice(i,1);
            return;
        }
    }
}
/**
 初始化控件：upload_module_multiThread.init(true);
 截屏：window.captureClipboard();
 */
var upload_module_multiThread = {
    //如果是页面已经加载完，这里初始化的时候要 upload_module_multiThread.init(true); 一些非IE浏览器需要在页面加载过程中初始化，
    init: function (isDocumentClosed) {
        upload_module_multiThread.isSupport() && MultiThreadUpload.create(isDocumentClosed);
        var realUploadButton = document.getElementById("aattach");
        realUploadButton.onclick = function () {
            if(!upload_module_multiThread.isSetup()) return false;
            Meeting.getComposeId();
            var files = MultiThreadUpload.showDialog();
            addUploadType(files);
            uploadManager.uploadFile(files);
            return false;
        };

        //TODO 关注这里是暴露给外面的函数：截屏
        window.captureScreen = function () {
            if(!upload_module_multiThread.isSetup()) return;
            MultiThreadUpload.screenShot();
        }
        //TODO 关注这里是暴露给外面的函数：使用ctrl+v方式粘贴附件的时候调用这里，如果只是截屏可暂时不关注
        window.captureClipboard = function () {
            if(!upload_module_multiThread.isSetup()) return true;
            if(window.loadCaptureTime && new Date()-window.loadCaptureTime<1000){
                return false;
            }
            window.loadCaptureTime=new Date();
            return checkAndUploadClipboardData();
        };

        //新的控件，截屏完成后要实现触发上传
        MultiThreadUpload.onScreenShot = function (file) {
            file.insertImage = true;
            file.uploadType = "multiThread";
            // alert(JSON.stringify(file));
            //upload_module_multiThread.upload(file);//TODO 这里是截屏触发上传了

            uploadManager.uploadFile(file);

            //top.addBehavior("成功插入截屏");
        };
        MultiThreadUpload.checkUploadResultWithResponseText = function (response) {
            var r = /"fileId\":\"([^\"]+)"/i;
            var s = response.responseText.match(r);
            var fileId = s[1];
            var url = attach.getShowAttachUrl(fileId,encodeURIComponent(response.fileName));
            Editor.doMenu("InsertImage", url);//插图
        }
        function checkAndUploadClipboardData() {
            var data = MultiThreadUpload.getClipboardData();
            //截屏后默认使用多线程上传
            var files = [];
            var isInlineImg = false;
            //有时候会存在截屏以后，剪贴板之前复制的文件还留着，所以只取一样
            if (data.copyFiles.length > 0) {   //复制文件 .jpg格式的也不作内联图片处理
                files = data.copyFiles;
            } else if (data.imageFiles.length > 0) {  //复制图片（从word，qq对话框等复制的图片）
                files = data.imageFiles;
                isInlineImg = true;
            } else if (data.htmlFiles.length > 0) {
                files = data.imageFiles;
            }
            if (files.length > 0) {
                if (uploadManager.isUploading()) {
                    CC.alert(ComposeMessages.PleaseUploadSoon);
                    return false;
                }
            }else{
                return true;
            }
            var replaceImage = data.html ? true : false;
            addUploadType(files);
            //如果是内联图片
            if(isInlineImg){
                addInsertImageFlag(files,replaceImage);
            }
            uploadManager.uploadFile(files);

            if (files.length > 0){
                if(data.html){
                    upload_module_multiThread.html=data.html;
                }
                return false; //取消默认得粘贴动作
            }
        }
        function addUploadType(arr) {
            jQuery(arr).each(function () { this.uploadType = "multiThread" });
        }
        function addInsertImageFlag(files,replaceImage) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                if (utool.isImageFile(file.fileName)) {
                    if(replaceImage){
                        file.replaceImage = true;
                    }else{
                        file.insertImage = true;
                    }
                }
            }
        }
    },
    taskId:0,
    upload: function (file) {
        var isMultiThreadUpload = false;
        if (isMultiThreadUpload) {
            MultiThreadUpload.upload(file);
        } else {
            //普通上传 兼容性较好
            MultiThreadUpload.commandUpload(file);
        }
    },
    cancel: function (file) {
        MultiThreadUpload.cancel(file);
    },
    isSetup: function(){
        if (!this.isSupport()) {
            if (top.Browser.isIE) {
                document.getElementById("ifrmCAB").src = top.gConst.composeSetupUrl;
            }
            else
            {
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
            }
            return false;
        }
        return true;
    },
    isSupport: function () {
        if (navigator.userAgent.indexOf("Opera") > -1) {
            return false;
        }
        if (window.ActiveXObject) {
            try {
                var obj = new ActiveXObject("RIMail139ActiveX.InterfaceClass");
                var version = obj.Command("<param><command>common_getversion</command></param>");
                return true;
            } catch (e) {
                return false;
            }
        } else {
            var mimetype = navigator.mimeTypes && navigator.mimeTypes["application/x-richinfo-mail139activex"];
            if (mimetype && mimetype.enabledPlugin) {
                return true;
            }
        }
        return false;
    }
}


//控件基础接口封装
MultiThreadUpload = {
    create: function (isDocumentClosed) {
        var elemenetID = "mtUploader" + Math.random();
        if (jQuery.browser.msie) {
            var htmlCode = '<OBJECT style="display:none" width="0" height="0" id="' + elemenetID + '" CLASSID="CLSID:63A691E7-E028-4254-8BD5-BDFDB8EF6E66"></OBJECT>';
        } else {
            var htmlCode = '<embed id="' + elemenetID + '" type="application/x-richinfo-mail139activex" height="1" width="1" hidden="true"></embed>';
        }
        var isFirefox = navigator.userAgent.indexOf("Firefox") > -1;
        if (isFirefox) {
            jQuery(htmlCode).appendTo(top.document.body);
        } else if (isDocumentClosed) {
            jQuery(htmlCode).appendTo(document.body);
        } else {
            document.write(htmlCode);
        }
        if (isFirefox) {
            var obj = top.document.getElementById(elemenetID);
        } else {
            var obj = document.getElementById(elemenetID);
        }
        this.control = obj;
    },
    //TODO 返回一个上传附件的地址
    getUploadUrl:function(isInlineImg){
        var type = isInlineImg ? 1 : 3;
        return attach.getUploadUrl("", type);
    },
    doCommand: function (commandName, commandData) {
        var returnXml = this.control.Command(commandData);
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
                html:"",
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
        function _getstatus() {
            if (returnXml != "<return />") {
                //top.Debug.write(returnXml);
                // todo M139.Logger.debug(returnXml);
            }
            //TODO 实现以下
            var doc = getXmlDoc(returnXml);
            var jDoc = jQuery(doc);
            var files = [];
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
                    var result = utool.checkUploadResultWithResponseText(p);
                    if (result.success) {
                        obj.attachId = result.fileId;
                    }

                }
                files.push(obj);
            });
            return files;
        }
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
        var command = "<param><command>localfile_getopenfilename</command><title>"+parent.Lang.Mail.tips061+"</title><filter>*.*</filter></param>";
        var files = this.doCommand("getopenfilename", command);
        return files;
    },
    uploadFileCount: 0,
    //多线程上传(特殊协议)
    upload: function (file) {
        //coremail支持 richmail不支持
        var isInlineImg = false;
        if(file.insertImage || file.replaceImage) { isInlineImg = true; }
        var command = "<param>\
            <command>attachupload_upload</command>\
            <taskId>{taskId}</taskId>\
            <svrUrl>{svrUrl}</svrUrl>\
            <sid>{sid}</sid>\
            <composeId>{composeId}</composeId>\
            <referer></referer>\
            <cookie>{cookie}</cookie>\
            <filePathName>{fileName}</filePathName>	\
            <size>{fileSize}</size>\
            </param>";
        var param = {
            //svrUrl: "http://" + location.host + "/coremail/s",
            svrUrl: encodeXML(this.getUploadUrl(isInlineImg)),
            sid: upload_module.model.sid,
            composeId: upload_module.model.composeId,
            fileName: encodeXML(file.filePath),
            fileSize: file.fileSize,
            taskId: file.taskId,
            cookie: ""
        };
        command = Utils.format(command, param);
        var success = this.doCommand("upload", command);
        if (success) {
            file.state = "uploading";
            file.updateUI();
            this.startWatching();
            this.uploadFileCount++;

            utool.logUpload(UploadLogs.MultiStart);
        } else {
            file.state = "error";
            uploadManager.removeFile(file);
        }
    },
    commandUpload: function (file) {
        var isInlineImg = false;
        if(file.insertImage || file.replaceImage) { isInlineImg = true; }
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
            file.state = "uploading";
            file.updateUI();
            this.startWatching(file);
            this.uploadFileCount++;
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
            //item.uploadFlag = MultiThreadUpload.UploadFlags.Uploading;
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
                    if (This.onScreenShot) This.onScreenShot(result.file);
                }
            }
        }, 1000);
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
                //item.uploadFlag = MultiThreadUpload.UploadFlags.Stop;
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
        try{
            var result = this.doCommand("getscreensnapshot", "<param><command>screensnapshot_getscreensnapshot</command></param>");
            if (result) this.startCheckClipBoard();
            return result;
        }catch(e){}
    },
    //得到最后一次截屏操作的时间
    getLastScreenShotAction: function () {
        var result = this.doCommand("getlastscreensnapshot", "<param><command>screensnapshot_getlastscreensnapshot</command></param>");
        return result;
    },
    startWatching: function (file) {
        //alert('startWatching startWatching!!');
        var This = this;
        if (!this.watchTimer) {
            this.watchTimer = setInterval(function () {
                try {
                    This.test(file);
                } catch (e) { }
            }, 300);
        }
    },
    stopWatching: function () {
        clearInterval(this.watchTimer);
        this.watchTimer = 0;
        //top.Debug.write("stopWatching");
    },
    test: function () {////////////////////////////////代码走到这里
        var This = this;
        var files = This.getStatus();
        //console.log("getStatus:" + files.length);
        if (this.uploadFileCount == 0) {
            this.stopWatching();
        }
        for (var i = 0; i < files.length; i++) {
            var obj = files[i];
            //alert('taskId :::::'+obj.taskId);
            if (obj && obj.taskId) {
                var file = utool.getFileById(obj.taskId);
                if (!file) {
                    //top.Debug.write("已经移除的taskId：" + obj.taskId);
                    return;
                }
                if (obj.status < 4) {
                    file.sendedSize = obj.completedSize;
                    file.uploadSpeed = obj.transSpeed;
                    file.needTime = obj.needTime;
                    file.progress = parseInt(((file.sendedSize / file.fileSize) || 0) * 100);
                    file.state = "uploading";
                    file.fileId = obj.attachId;
                    file.updateUI();
                } else {
                    if (obj.status == 4) {
                        if (obj.stopReason == 1) {
                            if (obj.isCommonUpload) {
                                if (obj.attachId) {
                                    file.state = "complete";
                                    file.fileId = obj.attachId;
                                    file.updateUI();
                                    if (file.insertImage || file.replaceImage) {
                                        MultiThreadUpload.checkUploadResultWithResponseText({
                                            responseText: obj.responseText,
                                            fileName: obj.fileName
                                        });
                                    }else if(file.replaceImage){
                                        //解决Word内容
                                        //replaceAttachImage(obj.attachId, obj.fileName);
                                    }
                                }
                            }
                            // 完成上传了
                            attach.uploadOk('ActiveX', obj.taskId, {});
                            //utool.logUpload(UploadLogs.MultiSuccess);
                        } else if (obj.stopReason == 2) {
                            //fileInfo.uploadFlag = MultiThreadUpload.UploadFlags.Stop;
                            //fileInfo.render();
                        } else if (obj.stopReason == 3) {
                            //fileInfo.remove();
                        } else if (obj.stopReason == 0) {
                            //假停止
                            this.uploadFileCount++;
                        } else if (obj.stopReason == 4) {
                            if (obj.errorCode && /^(5|6|17|24)$/.test(obj.errorCode)) {
                                //utool.logUpload(UploadLogs.MultiFail2, "errorCode=" + obj.errorCode);
                            } else {
                                //utool.logUpload(UploadLogs.MultiFail1, "errorCode=" + obj.errorCode);
                            }
                        }
                    }
                    if (this.uploadFileCount > 0) this.uploadFileCount--;
                    if (obj.status == 4) uploadManager.autoUpload();

                    if (obj.stopReason > 2) {
                        var errorLog = "multiThread upload fail,stopReason:{stopReason},fileName:{fileName},fileSize:{fileSize},sendedSize:{sendedSize}";
                        try {
                            errorLog = Utils.format(errorLog, {
                                stopReason: obj.stopReason,
                                fileName: file.fileName,
                                fileSize: file.fileSize,
                                sendedSize: file.sendedSize
                            });
                            //console && console.log(errorLog);
                            errorLog = '截屏失败，请重试'; //errorLog.stopReason;
                            uploadManager.onUploadError(errorLog);
                        } catch (e) { }
                    }
                }
            }
        }
    }
}

function bindAttachFrameOnload(){
    var $ = jQuery;
    $("#frmAttach").load(onload);
    function onload() {
        var frmAttach = window.frames["frmAttach"];
        commonAttachFrameOnLoad(frmAttach);
    }
}
function commonAttachFrameOnLoad(frmAttach,isInserImage){
    if(!window.uploadManager || !uploadManager.isUploading()){
        if(!isInserImage){//弹出框插入图片那里
            return;
        }
    }
    var form = document.forms["formAttach"];
    try{
        if(frmAttach.location.href.indexOf("blank.htm")>0){
            return;
        }
        var obj = frmAttach.return_obj;
        if(obj && obj.code == "S_OK"){
            var attachInfo = obj["var"];
            attachInfo.insertImage = isInserImage;
            upload_module.model.composeAttachs.push(attachInfo);
            uploadManager.refresh();
            //if(upload_module.model.autoSendMail)btnSendOnClick();
            if(upload_module.model.autoSendMail) Meeting.sendInvite();
//            if(isInserImage){
//                editorAgent.insertImage(getAttachImageUrl(attachInfo.fileId,attachInfo.fileName));
//            }
            form.reset();
            return true;
        }else if(obj && obj.code == "FA_ATTACH_SIZE_EXCEED"){
            // 附件大小超过服务端允许的大小 add by tkh
            CC.alert(Utils.format(ComposeMessages.FileSizeOverFlow, [utool.getMaxUploadSize()]));
        }else{
            CC.confirm(
                "附件上传失败，请重试。",
                function(){
                    form.submit();
                },
                "上传附件",
                function(){
                    form.reset();
                    uploadManager.cancelUploading();
                }
            );
        }
        form.reset();
    }catch(e){
        CC.confirm(
            "附件上传失败，请重试。",
            function(){
                form.submit();
            },
            "上传附件",
            function(){
                form.reset();
                uploadManager.cancelUploading();
            }
        );
    }
    return false;
}

//刷新附件iframe,可以取消普通上传
function refreshAttach(onlyRefreshAttach) {
    if (upload_module.model.autoSendMail) {//自动发送,需要测试
        PageState = PageStateTypes.Common;
        upload_module.model.autoSendMail = false;
    } else {
        if(!onlyRefreshAttach){
            var frmAttach = document.getElementById("frmAttach");
            frmAttach.src = "blank.htm";
        }
    }
    if(upload_module.model.composeId){
        var obj = {
            func: parent.gConst.func.refreshAttach,
            data: {
                id: upload_module.model.composeId
            },
            call: function(resp){
                try {
                    if (resp.code == "S_OK") {
                        var files = resp["var"];
                        upload_module.model.composeAttachs = files;
                        var fileList = uploadManager.fileList;
                        for(var i=0;i<fileList.length;i++){
                            var file = fileList[i];
                            for(var j=0;j<upload_module.model.composeAttachs.length;j++){
                                if(upload_module.model.composeAttachs[j].fileId == file.fileId){
                                    upload_module.model.composeAttachs[j].insertImage = file.insertImage;
                                    upload_module.model.composeAttachs[j].replaceImage = file.replaceImage;  //后台返回的附件数据没有replaceImage值，在这里加上，不然会显示内联附件列表
                                }
                            }
                        }
                        uploadManager.refresh();
                    }
                }catch(e){
                    parent.ch("refresh attach error." + e);
                }
            },
            msg: "刷新附件失败"
        };
        parent.MM.mailRequestApi(obj);
    }
}

function createIEXMLObject() {
    var XMLDOC = ["Microsoft.XMLDOM","MSXML2.DOMDocument.6.0", "MSXML2.DOMDocument.5.0", "MSXML2.DOMDocument.4.0", "MSXML2.DOMDocument.3.0", "MSXML.DOMDocument"];
    if (window.enabledXMLObjectVersion) return new ActiveXObject(enabledXMLObjectVersion);
    for (var i = 0; i < XMLDOC.length; i++) {
        try {
            var version = XMLDOC[i];
            var obj = new ActiveXObject(version);
            if (obj) {
                enabledXMLObjectVersion = version;
                return obj;
            }
        } catch (e) { }
    }
    return null;
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
function encodeXML($) {
    return $.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

//从word复制内容粘贴兼容性处理 如果只是截屏 可不使用
function replaceAttachImage(fileId, fileName) {
    if (upload_module_multiThread.html) { //图文混排
        //TODO 替换office冗余图片对象
        //htmlEditorView.editorView.editor.insertHTML(upload_module_multiThread.html.replace(/\<\!\[if \!vml\]\>/ig, "").replace(/\<\!\[endif\]\>/ig, ""));
        upload_module_multiThread.html = "";//清空
    }
    //TODO
    //var url = upload_module.model.getAttachImageUrl(fileId, fileName, true);
    //htmlEditorView.editorView.replaceImage(fileName, url);
}

/*  开启固定的黑名单校验  */
attach.fileCheckMode = parent.gMain.attachUploadType;
if(attach.fileCheckMode != '0'){
    attach.setFormat(parent.gMain.attachUploadList);
    attach.delegate('onFormatError', function(name, format){
        if (attach.fileCheckMode == 1) {
            parent.CC.alert(parent.Lang.Mail.tips063.format(format));
        }
        else {
            parent.CC.alert(parent.Lang.Mail.tips064.format(format));
        }
    });
}