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
                // html = "<i class='local'></i>" + this.getFileShortName(taskId) + "&nbsp;&nbsp;" +Lang.Mail.Write.Uploading + " <img src=\"" + parent.gMain.resourceRoot + "/images/uploading.gif\"/><a