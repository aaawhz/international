(function(exports,$,Backbone){
    /**
     * 上传控件class
     */
    var ActiveXUpload=(function(){
        var _activexId = 'cxdndctrl'; //控件Id
        var _version   = 65794;      //控件版本号
        return {
            getActiveX:function(){
                if(this.registerActiveX()){
                    return document.getElementById(_activexId);
                }
            },
            getVersion:function(){
                return _version;
            },
            registerActiveX:function(){
                var htmlCode ='<script language="javascript" type="text/javascript" for="'+_activexId+'" event="onselect(fileList)">'
                    +'  ActiveXUpload.onselect(fileList);'
                    +'</script>'
                    +'<script language="javascript" type="text/javascript" for="'+_activexId+'" event="onprepareupload()">'
                    +'  ActiveXUpload.onprepareupload();'
                    +'</script>'
                    +'<script language="javascript" type="text/javascript" for="'+_activexId+'" event="onstart(clientTaskno)">'
                    +'  ActiveXUpload.onloadstart(clientTaskno);'
                    +'</script>'
                    +'<script language="javascript" type="text/javascript" for="'+_activexId+'" event="onprogress(clientTaskno, progress, uploadsize, times)">'
                    +'  ActiveXUpload.onprogress(clientTaskno, progress, uploadsize, times);'
                    +'</script>'
                    +'<script language="javascript" type="text/javascript" for="'+_activexId+'" event="oncomplete(clientTaskno, responseTxt)">'
                    +'  ActiveXUpload.oncomplete(clientTaskno, responseTxt);'
                    +'</script>'
                    +'<script language="javascript" type="text/javascript" for="'+_activexId+'" event="onstop(clientTaskno, result, fileIdOfServer)">'
                    +'  ActiveXUpload.onstop(clientTaskno, result, fileIdOfServer);'
                    +'</script>'
                    +'<script language="javascript" type="text/javascript" for="'+_activexId+'" event="onlog(logText)">'
                    +'  ActiveXUpload.onlog(logText);'
                    +'</script>';
                if (document.all) {
                    htmlCode += '<object id="'+_activexId+'" classid="CLSID:2A39FFD7-8E69-440F-9AAB-AD97CFA7FE86"></object>';
                } else {
                    htmlCode += '<embed id="'+_activexId+'" type="application/x-yd-cxdnd3" height="1" width="1"></embed>';
                    setTimeout(function(){
                        onselect = function(fileList){
                            ActiveXUpload.onselect(fileList);
                        };
                        onprepareupload = function(){
                            ActiveXUpload.onprepareupload();
                        };
                        onstart = function (clientTaskno) {
                            ActiveXUpload.onloadstart(clientTaskno);
                        };
                        onprogress = function (clientTaskno, progress, uploadsize, times) {
                            ActiveXUpload.onprogress(clientTaskno, progress, uploadsize, times);
                        };
                        oncomplete = function (clientTaskno, responseTxt) {
                            ActiveXUpload.oncomplete(clientTaskno, responseTxt);
                        };
                        onstop = function (clientTaskno, result, fileIdOfServer) {
                            ActiveXUpload.onstop(clientTaskno, result, fileIdOfServer);
                        };
                        onlog = function (logText) {
                            ActiveXUpload.onlog(logText);
                        };
                    }, 500);
                }

                var div = document.createElement("div");
                div.style.cssText = "width:1px;height:0px;";
                div.innerHTML = htmlCode;
                document.body.appendChild(div);

                return true;
            },
            onselect:function(fileList){
                var filelistData=jQuery.xml2json(fileList);
                if (!filelistData) return;

                var files=filelistData.object;
                !files.length && (files = [files]);
                controlUpload.app.selectCall(files);
            },
            onprepareupload:function(){
                controlUpload.app.prepareupload();
            },
            onloadstart:function(clientTaskno){
                controlUpload.app.loadstart(clientTaskno);
            },
            onprogress:function(clientTaskno, progress, uploadsize, times){
                controlUpload.app.progress(clientTaskno, progress, uploadsize, times);
            },
            oncomplete:function(clientTaskno, responseTxt){
                controlUpload.app.complete(clientTaskno, responseTxt);
            },
            onstop:function(clientTaskno, result, fileIdOfServer){
                controlUpload.app.stop(clientTaskno,result,fileIdOfServer);
            },
            onlog:function(logText){
                //console&&console.log(logText);
            }
        }
    })();

    exports.ActiveXUpload=ActiveXUpload;

    /**
     * 文件模型
     */
    var File=Backbone.Model.extend({
        defaults:{
            id:0,    //任务号
            size:0,
            name:'',
            fileName:'',
            expandName:'',
            expandClassName:'',
            uploading:false,
            appFileId:'',
            filemd5:''
        }
    });

    /**
     * 文件视图
     */
    var FileItem=Backbone.View.extend({
        tagName: 'li',
        render:function(){
            var self=this;
            var model=this.model.toJSON();
            //this.tagName = controlUpload.itemTag || 'li';
            model.size=top.Util.formatSize(this.model.get('size'), null, 2);
            this.$el.append($('#fileTemplate').tmpl(model));

            //bind events
            this.$el.find('.clsBtn').eq(0).click(function(){
                self.deleteFile();
            });

            /*this.$el.find('.pause-btn').eq(0).click(function(){
                self.pauseUploadFile();
            });

            this.$el.find('.again-btn').eq(0).click(function(){
                self.againUploadFile();
            });*/

            this.$el.find('.reupload-btn').eq(0).click(function(){
                self.reUploadFile();
            });

            return this;
        },
        fileMd5Loading:function(){
            this.$el.find('.processwrap').eq(0).hide();
            this.$el.find('.reupload-btn,.again-btn,.pause-btn').eq(0).hide();
            this.$el.find('.statuswrap').eq(0).html('<span class="gray">正在扫描文件</span>').show();
        },
        uploadLimit:function(err){
            this.$el.find('.processwrap').eq(0).hide();
            this.$el.find('.reupload-btn,.again-btn,.pause-btn').eq(0).hide();
            this.$el.find('.statuswrap').eq(0).html('<i class="i-warm mr_5"></i><span class="inbm col_red">'+err+'</span>').show();
        },
        uploading:function(process,loaded){
            this.$el.find('.statuswrap').eq(0).hide().html('');
            this.$el.find('.prisdr-progress-cur').eq(0).css('width',process);
            this.$el.find('.speedText').eq(0).html(process);
            this.$el.find('.processwrap').eq(0).show();

            this.$el.find('.reupload-btn,.again-btn').eq(0).hide();
            this.$el.find('.pause-btn').eq(0).show();
            this.$el.find('.loaded').eq(0).html(loaded+'/');
        },
        uploadpause:function(){
            //this.$el.find('.processwrap').eq(0).hide();
            this.$el.find('.reupload-btn,.pause-btn').eq(0).hide();
            this.$el.find('.again-btn').eq(0).show();
            //this.$el.find('.statuswrap').eq(0).html('<span class="gray">已暂停</span>').show();
        },
        uploadagain:function(){
            this.$el.find('.reupload-btn,.again-btn').eq(0).hide();
            this.$el.find('.pause-btn').eq(0).show();
            this.$el.find('.statuswrap').eq(0).html('<span class="gray"></span>').show();
        },
        uploadsucc:function(loaded){
            this.$el.find('.processwrap').eq(0).hide();
            this.$el.find('.reupload-btn,.pause-btn,.again-btn').eq(0).hide();
            this.$el.find('.statuswrap').eq(0).html('<i class="i-gsuss mr_5"></i><span class="inbm col_green">上传成功</span>').show();
            this.$el.find('.loaded').eq(0).html(loaded+'/');
        },
        uploadFail:function(err,isReupload){
            this.$el.find('.processwrap').eq(0).hide();
            this.$el.find('.reupload-btn').eq(0).show();

            var reuploadBtn=this.$el.find('.reupload-btn').eq(0);
            reuploadBtn.show();
            if(isReupload){
                reuploadBtn.attr('isReupload','true');
            }else{
                reuploadBtn.attr('isReupload','false');
            }
            this.$el.find('.pause-btn,.again-btn').eq(0).hide();
            this.$el.find('.statuswrap').eq(0).html('<i class="i-warm mr_5"></i><span class="inbm col_red">'+(err || '上传失败')+'</span>').show();
        },
        deleteFile:function(){
            this.$el.hide().remove();
            var id=this.model.get('id');
            controlUpload.removeUploadSucc(id);
            if(id!=-1){
                this.trigger('pause',this.model.get('id'));
            }
            controlUpload.triggerCallback('afterDelete', id);
        },
        pauseUploadFile:function(flag){
            this.uploadpause();
            this.trigger('pause',this.model.get('id'),flag);
        },
        againUploadFile:function(){
            this.uploadagain();
            this.trigger('again',this.model.get('id'));
        },
        reUploadFile:function(){
            var isReupload=this.$el.find('.reupload-btn').eq(0).attr('isReupload');
            this.trigger('reupload',{
                clientTaskNo: this.model.get('id'),
                isReupload:isReupload
            });
        }
    });

    /**
     * 文件列表集合
     */
    var FileList=Backbone.Collection.extend({
        model:File
    });

    /**
     * 应用视图
     */
    var AppView=Backbone.View.extend({
        el:$('body'),
        events:{
            'click #uploadfile_btn':'openFiles'
        },
        initialize:function(){
            var containerId = controlUpload.containerId || 'filelist';
            this.uploadControl= ActiveXUpload.getActiveX();
            this.filelist=controlUpload.filelist;
            this.filelistWrap=$('#'+containerId);

            this.listenTo(this.filelist,'add',this.addFile);
        },
        openFiles:function(){
            controlUpload.app.uploadControl.getopenfilename("*.*", '选择文件'); //选择文件
            return false;
        },
        selectCall:function(files){
            var self=this;
            var filesArr=files;
            for(var i= 0,l=filesArr.length;i<l;i++){
                var file=filesArr[i];
                var fastMaxFileSzie=controlUpload.fastMaxFileSzie;
                var filelength=controlUpload.filelength;

                var size=file.size;
                var fileName=self.getShortName(file.name,20);
                var expandName=self.getExtendName(file.name);
                var expandClassName=self.getExtendClass(expandName);

                //文件大小计算错误
                if(file.size<0){
                    self.fileLimit(fileName,expandName,size,expandClassName,'文件大小计算错误'); //文件大小计算错误
                    file.state=0;
                    file.err='errUploadSize';
                    continue;
                }

                //超过大小限制
                if(file.size>fastMaxFileSzie){
                    self.fileLimit(fileName,expandName,size,expandClassName,'文件超过'+top.Util.formatSize(fastMaxFileSzie, null, 2)+'，不能上传'); //文件超过xx不能上传
                    file.state=0;
                    file.err='limitUploadSize';
                    continue;
                }

                //文件长度0字节
                if(file.size==0){
                    self.fileLimit(fileName,expandName,size,expandClassName,'空文件不能上传');
                    file.state=0;
                    file.err='emptyUploadSize';
                    continue;
                }

                //超过文件长度
                if(file.name.length>filelength){
                    self.fileLimit(fileName,expandName,size,expandClassName,'文件名超过'+filelength+'个字符，不能上传');
                    file.state=0;
                    file.err='limitUploadLength';
                    continue;
                }

                //文件名不合法
                if( /[\\\/\"\'\<\>:\|\*\\?]/g.test(file.name) ){
                    self.fileLimit(fileName,expandName,size,expandClassName,'文件名不能包含:\\\/*\?\"\'\<\>等特殊字符');
                    file.state=0;
                    file.err='limitUploadLength';
                    continue;
                }

                file.state=1;
                if (file.clientTaskno == undefined || (file.clientTaskno == 0)) {//没有值，由脚本生产clientTaskno
                    file.clientTaskno = controlUpload.getClientTaskno();
                }
                var fileModel={
                    id:file.clientTaskno,
                    size:size,
                    name:file.name,
                    fileName:fileName,
                    expandName:expandName,
                    expandClassName:expandClassName
                };
                this.filelist.add(fileModel);
            }
            self.setFileList(filesArr);
        },
        setFileList:function(fileList){
            var fileListXml = ["<array>"];
            for (var i = 0, len = fileList.length; i < len; i++) {
                fileListXml.push("<object>" + json2xml(fileList[i]) + "</object>");
            }
            fileListXml.push("</array>");
            fileListXml = fileListXml.join("");
            controlUpload.app.uploadControl.setfilelist(fileListXml);
        },
        getFileInfo:function(){
            var fileinfo=controlUpload.app.uploadControl.getfileinfo();
            if(fileinfo&&fileinfo.length!=1){
                return jQuery.xml2json(fileinfo);
            }
        },
        getFileMD5:function(){
            return controlUpload.app.uploadControl.getfilemd5();
        },
        prepareupload:function(){
            this.controlCenter();
        },
        /**
         * 上传控制中心
         */
        controlCenter:function(clientTaskNo){
            var newClientTaskNo=true;
            if(clientTaskNo){
                newClientTaskNo=this.saveUploadedFile(clientTaskNo);
            }
            var waitUploadfiles=this.filelist;
            var uploadedFiles= controlUpload.uploadedFiles;
            var waitLen=waitUploadfiles.length;
            var uploadedLen=uploadedFiles.length;

            if(uploadedLen<waitLen){
                if(!newClientTaskNo)return;
                if(!controlUpload.run) controlUpload.run=true;
                if(controlUpload.checkFileUploading()){
                    return ;
                }
                this.uploadFile();
            }else if(uploadedLen==waitLen){
                controlUpload.run=false;
            }
        },
        saveUploadedFile:function(clientTaskNo){
            var files= controlUpload.uploadedFiles;
            for(var i= 0,l=files.length;i<l;i++){
                if(clientTaskNo==files[i]){
                    return false;
                }
            }
            controlUpload.uploadedFiles.push(clientTaskNo);
            return true;
        },
        getShortName : function(name, max){
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
        getExtendName: function (fileNameOrigin) {
            var length = fileNameOrigin.split(".").length;
            return fileNameOrigin.split(".")[length-1].toLowerCase();
        },
        getExtendClass:function(extendname){
            var styleClass=["png","exe","tif","txt","psd","rar","zip","xml","java","fon","jpg","jpeg","gif","bmp","tiff","mpeg","avi","wmv","mov","mpg","vob","rmvb","mp3","wma","wav","asf","mp4","sis","sisx","cab","doc","docx","pdf","xls","xlsx","ppt","pptx","swf","fla","share","folder","folder-m","folder-p","mp3-hover","upload","flv","css","rm","midi","chm","iso","vsd","not","html"];
            if(styleClass.has(extendname)){
                return extendname;
            }
            return "other";
        },
        /**
         * 上传文件
         */
        uploadFile:function(clientTaskno,isReupload){
            var self=this;
            var currFileClientTaskno='';
            var uploadType=2;

            if(clientTaskno&&isReupload){ //重传
                controlUpload.app.uploadControl.setcurrentfile(clientTaskno.toString());
            }else if(clientTaskno&&!isReupload){ //续传
                var fileitem=controlUpload.fileItems[controlUpload.runClientTaskno];
                if(fileitem.model.get('uploading')){
                    controlUpload.fileItems[controlUpload.runClientTaskno].pauseUploadFile(true);
                }
                controlUpload.app.uploadControl.setcurrentfile(clientTaskno.toString());
                uploadType=3;
            }

            var currfile=this.getFileInfo();
            if(!currfile) return;
            currFileClientTaskno=currfile.clientTaskno;
            controlUpload.runClientTaskno=currFileClientTaskno;
            var fileModel=this.filelist.get(currFileClientTaskno);
            fileModel.set('uploading',true);

            //计算md5
            var filemd5=fileModel.get('filemd5');
            var fileitem=controlUpload.fileItems[currFileClientTaskno];
            if(filemd5==''){
                fileitem.fileMd5Loading();
                filemd5=this.getFileMD5();
                if(!filemd5||filemd5.length==1){
                    fileitem.uploadLimit('获取文件md5失败');
                    //交由控制中心
                    self.controlCenter(currFileClientTaskno);
                    return;
                }
            }

            var config={
                data:{
                    appFileId:(uploadType==2)?'':fileModel.get('appFileId'),
                    fileSize:fileModel.get('size'),
                    fileName:fileModel.get('name'),
                    fileMd5:filemd5,
                    uploadType:uploadType
                },
                call:function(data){
                    var code=data.code;
                    var vardata=data["var"];
                    if(code=='S_OK'){
                        var dataUpload={
                            cmd:vardata.cmd,
                            type:vardata.type,
                            version:vardata.version,
                            comefrom:vardata.comeFrom,
                            taskno:vardata.taskNo,
                            fileid:vardata.fileId,
                            middleurl:vardata.middleUrl,
                            filesize:fileModel.get('size'),
                            timestamp:vardata.timestamp,
                            ssoid:vardata.ssoid,
                            flowtype:vardata.flowType,
                            userlevel:vardata.userLevel,
                            usernumber:vardata.userNumber,
                            filemd5:vardata.fileMd5,
                            filename:fileModel.get('name'),
                            fingerprint:vardata.fingerPrint,
                            ranges:vardata.range,
                            fastuploadurl:vardata.fastUploadUrl
                        };

                        dataUpload.resumetransmit = 0;
                        dataUpload.ranges && (dataUpload.resumetransmit = 1);
                        dataUpload.ver = 2;
                        dataUpload.browsertype = controlUpload.getBrowserType();

                        //设置文件appFileId属性
                        if(fileModel.get('appFileId')==''){
                            fileModel.set('appFileId',vardata.appFileId);
                            fileModel.set('filemd5',vardata.fileMd5);
                        }

                        var data = "<parameters>" + json2xml(dataUpload) + "</parameters>";
                        self.uploadControl.uploadex(data);
                    }
                },
                failCall:function(data){
                    var code=data.code;
                    var summary=data.summary;
                    if(code=='DFS_118'){
                        fileitem.uploadsucc(top.Util.formatSize(currfile.size, null, 2));

                        //保存上传成功的文件信息
                        var vardata=data["var"];
                        controlUpload.fileUploadSuc.push({
                            clientTaskno:fileModel.get('id'),
                            name:fileModel.get('name'),
                            size:fileModel.get('size'),
                            shareUrl:vardata.shareUrl,
                            validateTime:vardata.validateTime
                        });
                    }else{
                        fileitem.uploadFail(summary,true);
                    }
                    fileModel.set('uploading',false);
                    //交由控制中心
                    self.controlCenter(currFileClientTaskno);
                    controlUpload.triggerCallback('afterComplete');
                }
            };
            self.getUploadUrl(config.data,config.call,config.failCall);
        },
        /**
         * 获取分布式上传url
         */
        getUploadUrl:function(params,call,failcall){
            var failcall=failcall||function(d){
                top.CC.alert(d.summary);
            };

            top.MM.doService({
                url: '/disk/userdisk.do',
                func: 'disk:upload',
                data: {
                    appFileId:params.appFileId,
                    comeFrom : 1,
                    upType   : params.uploadType||2,
                    parentId : -1,
                    fileSize : params.fileSize,
                    objectName : params.fileName,
                    fileMd5  : params.fileMd5
                },
                failCall: failcall,
                call: function(d){
                    call(d);
                },
                param: ""
            });
        },
        /**
         * 分布式报错信息
         */
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
        },
        loadstart:function(clientTaskno){

        },
        progress:function(clientTaskno, progress, uploadsize, times){
            var file=controlUpload.filelist.get(clientTaskno);
            if(file.get('uploading')==true){
                var fileitem=controlUpload.fileItems[clientTaskno];
                var process=Math.round(100* progress/ file.get('size'))+'%';
                if(process=='100%'){
                    process='99%';
                }
                if(top.Util){
                    fileitem.uploading(process,top.Util.formatSize(progress, null, 2));
                }
            }
        },
        complete:function(clientTaskno, responseTxt){
            var file=controlUpload.filelist.get(clientTaskno);
            var fileitem=controlUpload.fileItems[clientTaskno];

            var data=responseTxt;
            var xmldom=top.Util.str2Dom(data);
            var retcode=xmldom.getElementsByTagName("retcode")[0].childNodes[0].nodeValue;

            if(retcode=='0'){
                try{
                    var middleret=xmldom.getElementsByTagName("middleret")[0].childNodes[0].nodeValue;
                    var middleretJson=JSON.parse(decodeURIComponent(middleret));
                    var middleretcode=middleretJson.code;
                    var middleretsummary=middleretJson.summary;
                    var middleretVar=middleretJson["var"].replace(/'/g,"\"");

                    var shareUrl=JSON.parse(middleretVar).shareUrl;
                    var validateTime=JSON.parse(middleretVar).validateTime;

                    if(middleretcode=='S_OK'){
                        fileitem.uploadsucc(top.Util.formatSize(file.get('size'), null, 2));

                        //保存上传成功的文件信息
                        controlUpload.fileUploadSuc.push({
                            clientTaskno:file.get('id'),
                            name:file.get('name'),
                            size:file.get('size'),
                            shareUrl:shareUrl,
                            validateTime:validateTime
                        });
                    }else{
                        var errmsg=middleretsummary;
                        fileitem.uploadFail(errmsg);
                    }
                }catch(e){
                    fileitem.uploadFail('分布式返回数据异常');
                }
            }else{
                var errmsg=this.getErrSummary(retcode);
                fileitem.uploadFail(errmsg);
            }
            file.set('uploading',false);

            //交由控制中心
            this.controlCenter(clientTaskno);
            controlUpload.triggerCallback('afterComplete');
        },
        stop:function(clientTaskno,result,fileIdOfServer){
            var self=this;
            var file=controlUpload.filelist.get(clientTaskno);
            var fileitem=controlUpload.fileItems[clientTaskno];
            if(result==0||result==1) return; //暂停或停止

            //上传失败处理
            switch(result){
                case 2:
                    fileitem.uploadFail('上传失败',true);
                    break;
                case 3:
                    fileitem.uploadFail('文件有病毒',true);
                    break;
                default:
                    fileitem.uploadFail(self.getErrSummary(result),true);
            }

            file.set('uploading',false);
            //交由控制中心
            this.controlCenter(clientTaskno);
        },
        stopUpload:function(clientTaskno){
            controlUpload.app.uploadControl.stop(clientTaskno.toString());
        },
        pauseUpload:function(clientTaskno, ctrl){
            var file=controlUpload.filelist.get(clientTaskno);
            if(file.get('uploading')){
                file.set('uploading',false);
                this.stopUpload(clientTaskno);
            }
            if(!ctrl){
                //交由控制中心
                this.controlCenter(clientTaskno);
            }
        },
        againUpload:function(clientTaskno){
            var file=controlUpload.filelist.get(clientTaskno);
            file.set('uploading',true);
            controlUpload.run=true;
            this.uploadFile(clientTaskno);
        },
        reUpload:function(option){
            controlUpload.run=true;
            if(option.isReupload=='true'){
                this.uploadFile(option.clientTaskNo,option.isReupload);
            }else{
                this.uploadFile(option.clientTaskNo);
            }
        },
        fileLimit:function(fileName,expandName,size,expandClassName,limitTips){
            var fileModel=new File({
                id:-1,
                size:size,
                fileName:fileName,
                expandName:expandName,
                expandClassName:expandClassName
            });
            var fileitem=this.addFile(fileModel);
            fileitem.uploadLimit(limitTips);
        },
        addFile:function(file){
            this.$('#uploadtip').hide();
            var fileitem=new FileItem({model:file, tagName: controlUpload.itemTag || 'li', className: controlUpload.containerClass || ''});
            this.filelistWrap.show().append(fileitem.render().el);
            if(file.get('id')!=-1){
                controlUpload.fileItems[file.id]=fileitem;

                /*监听事件*/
                this.listenTo(fileitem,'pause',this.pauseUpload);
//                this.listenTo(fileitem,'again',this.againUpload);
                this.listenTo(fileitem,'reupload',this.reUpload);
            }
            controlUpload.triggerCallback('afterRender');
            return fileitem;
        }
    });

    /**
     * 初始化控件上传
     */
    var controlUpload={
        app:{},
        filelist:{},  //FileList文件集合
        selectFiles:[],
        fastMaxFileSzie:524288000,
        filelength:80,
        randomNumbers:{},
        fileItems:{}, //文件视图
        runClientTaskno:'',
        run:false,        //是否在执行上传
        uploadedFiles:[], //上传过的文件（包含失败的）
        init:function(option){
            $('#drag_tips').hide();
            this.fastMaxFileSzie=option.fastMaxFileSzie;
            this.filelength=option.filelength;
            this.filelist=new FileList();
            this.fileUploadSuc=[];
            this.containerId = option.containerId;
            this.containerClass = option.containerClass;
            this.itemTag = option.itemTag;
            this.app=new AppView();
            this.callbackFuncs = {};
            return this;
        },
        on: function(name, func){
            if(this.callbackFuncs && name && typeof func == 'function'){
                this.callbackFuncs[name] = func;
            }
        },
        triggerCallback: function(name, option){
            if(typeof this.callbackFuncs[name] == 'function'){
                this.callbackFuncs[name].call(this, option);
            }
        },
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
        getBrowserType: function(){
            var mybrowsetype = 200;
            if ($.browser.msie) {
                mybrowsetype = 0;
            } else if (window.navigator.userAgent.indexOf("Firefox") >= 0) {
                mybrowsetype = 151;

                if (/Firefox\/(?:[4-9]|3\.[0-3])/.test(navigator.userAgent)) {//3.6.3及以前
                    mybrowsetype = 150;
                }
            }
            return mybrowsetype;
        },
        getUploadSuccessList:function(){
            return this.fileUploadSuc;
        },
        removeUploadSucc:function(clientTaskno){
            for(var i=0;i<this.fileUploadSuc.length;i++){
                if(this.fileUploadSuc[i].clientTaskno==clientTaskno){
                    this.fileUploadSuc.splice(i,1);
                    break;
                }
            }
        },
        checkUploading:function(){
            return this.run;
        },
        close:function(){
            var self=this;
            if(self.run){
                if(confirm('还有未完成上传的文件，确定要关闭吗？')){
                    self.app.stopUpload(this.runClientTaskno);
                    self.run=false;
                    self.fileItems=null;
                }
            }else{
                self.fileItems=null;
            }
        },
        checkFileUploading: function(){
            var models = this.filelist.models;
            if(models.length){
                for(var i=0;i<models.length;i++){
                    var uploading = models[i].get('uploading');
                    if(uploading){
                        return true;
                    }
                }
            }
            return false;
        }
    };

    exports.controlUpload=controlUpload;
})(window,jQuery,Backbone);