window.UploadView={
    itemTemplete:['<li clientTaskno="{clientTaskno}">',
		          '  <div class="clearfix zz_comb">',
		          '    <i class="big_{expandClassName} fl" style="height:32px;"></i>',
		          '    <div class="sk_lt">',
		          '      <div class="clearfix sk_cont">',
		          '        <p class="fl" style="width:auto;">{fileName}.{expandName}</p>',
		          '        <input type="hidden" fname="{fileName}" exname="{expandName}" value="{fileName}"/>',
		          '		   {delbtnTemplete}<span class="btnwrap" style="margin-left:15px;">{handleBtnTemplete}</span>',
		          '      </div>',
		          '      <div class="clearfix">',
                  '        {uploadStatusTemplete}',
                  '        {uploadSizeTemplete}',
	              '      </div>',
		          '    </div>',   
		          '  </div>',
		          '</li>'].join(""),
    delTemplete:'<a href="javascript:void(0);" class="fr ml_15 delbtn" appfileid="" clientTaskNo="{clientTaskno}">删除</a>',
    pauseTemplete:'<a href="javascript:void(0);" class="fr pauseContinuebtn" clientTaskNo="{clientTaskno}">暂停</a>',
    againTemplete:'<a href="javascript:void(0);" class="fr againbtn" clientTaskNo="{clientTaskno}">重传</a>', 
    waitTemplete:'<div class="statuswrap fl"><span class="gray">等待上传</span></div>',
    limitUploadSizeTemplete:'<div class="statuswrap fl"><i class="i-warm mr_5"></i><span class="inbm col_red">文件超过 {maxuploadsizeText}，无法上传</span></div>',
    emptyUploadSizeTemplete:'<div class="statuswrap fl"><i class="i-warm mr_5"></i><span class="inbm col_red">不允许上传空文件，请重新选择。</span></div>',
    md5LoadingTemplete:'<div class="statuswrap fl"><span class="gray">正在扫描本地文件</span></div>',
    progressBarTemplete:['<div class="prisdr-progress-bar fl" style="*zoom:1;width:188px;overflow:hidden;">',
		                 '  <div class="prisdr-progress"></div>',
		                 '  <div class="prisdr-progress-cur" style="width:{processWidthText};"></div>',
		                 '</div>',
		                 '<var class="color_blue fl ml_10 processText">{processText}</var>',
		                 '<span class="color_blue fl ml_15 speedText">{speedText}</span>'].join(""),
    errUploadTemplete:'<div class="statuswrap fl"><i class="i-warm mr_5"></i><span class="inbm col_red">{errmsg}</span></div>',
    completeTemplete:'<div class="statuswrap fl"><i class="i-gsuss mr_5"></i><span class="inbm col_green">上传成功</span></div>',
    fileSizeTemplete:'<span class="fr fileSizeText">{fileSizeText}</span>',
    pauseStatusTemplete:'<div class="statuswrap fl"><span class="inbm col_orange">已暂停，剩余{remainText}</span></div>',

    containerTag: 'li',
    initialize: function (options) {
        this.controler         = options.controler;
        this.model             = options.model;
        this.listContainerid   = options.listContainerid;
        this.originalParams = options;
        this.render();
    },

    render: function (options) {
        this.initEvents();
    },

    initEvents: function(){
        var self = this;
        
        //监听model层数据变化
        this.model.on("renderList", function (options) {
            self.renderList(options);
        });
        this.model.on("getFileMd5", function (options) {
            self.getFileMd5(options);
        });
        this.model.on("loadstart", function (options) {
            self.loadstart(options);
        });
        this.model.on("progress", function (options) {
            self.progress(options);
        });
        this.model.on("complete", function (options) {
            self.complete(options);
        });
        this.model.on("cancel", function (options) {
            self.cancel(options);
        });
        this.model.on("error", function (options) {
            self.error(options);
        });
        this.model.on("setDBtnAppFileid", function (options) {
            self.setDBtnAppFileid(options);
        });
    },
    //获取当前模式下的容器
    getContainer: function(){
    	return jQuery('#'+this.listContainerid);
    },

    //删除空容器
    deleteEmptyContainer: function(){
    	this.getContainer().html("");
    },

    renderList: function (options) {
        var self = this;

        //等待视图模板
        var defaultTemplete = self.model.format(this.itemTemplete, {
        	delbtnTemplete:self.delTemplete,
        	handleBtnTemplete:'',
        	uploadStatusTemplete:self.waitTemplete,
        	uploadSizeTemplete:self.fileSizeTemplete
        });

        //单文件上传超过套餐上限视图模板
        var limitUploadSizeTemplete = self.model.format(this.itemTemplete, {
        	delbtnTemplete:self.delTemplete,
        	handleBtnTemplete:'',
        	uploadStatusTemplete:self.limitUploadSizeTemplete,
        	uploadSizeTemplete:self.fileSizeTemplete
        });

        //上传文件字节为0提示视图模板
        var emptyUploadSizeTemplete = self.model.format(this.itemTemplete, {
        	delbtnTemplete:self.delTemplete,
            handleBtnTemplete:'',
        	uploadStatusTemplete:self.emptyUploadSizeTemplete,
        	uploadSizeTemplete:self.fileSizeTemplete
        });

        this.createList({
            fileList: options.fileList,
            fileNameLen: 20,
            defaultTemplete: defaultTemplete,
            limitUploadSizeTemplete: limitUploadSizeTemplete,
            emptyUploadSizeTemplete: emptyUploadSizeTemplete
        });
    },

    //创建上传列表
    createList: function (options) {
        var self = this;
        var fileList = options.fileList;
        var fileListNum = this.model.uploadFileNum = fileList.length;
        var templete = "";
        var listHtml = jQuery('<div></div>');
        var listItem='';
        var delCallback = function(){};
        var params = self.originalParams || {};
        if(params && params.deleteCall){
            delCallback = params.deleteCall;
        }

        for (var i = 0; i < fileListNum; i++) {
            var file = fileList[i];
            var data = {
                fileName: self.model.getShortName(file.name, options.fileNameLen),
                fileSizeText:top.Util.formatSize(file.size, null, 2),
                expandName: self.model.getExtendName(file.name),
                clientTaskno: file.clientTaskno,
                expandClassName:self.getExtendClass(self.model.getExtendName(file.name))
            };

            if (file.error == "emptyUploadSize") {
                templete = options.emptyUploadSizeTemplete;
            }else if (file.error == "limitUploadSize") {
            	data.maxuploadsizeText=top.Util.formatSize(self.model.maxUploadSize, null, 2);
            	templete = options.limitUploadSizeTemplete;
            } else {
                templete = options.defaultTemplete;
            }
            listItem=jQuery(self.model.format(templete,data));
            listHtml.append(listItem);
            self.model.fileListEle[file.clientTaskno] = listItem;
            
            /*删除操作*/
            listItem.find('.delbtn').eq(0).click(function(){
            	var clientTaskno=jQuery(this).attr('clientTaskNo');
            	self.controler.onabort(clientTaskno);
            	jQuery(this).parents(self.containerTag).eq(0).remove();
            	
            	var appFileId=jQuery(this).attr('appFileId');
            	if(appFileId){
            		self.model.delFile(appFileId,function(){
            			self.model.delFileUploadSuc(file.clientTaskno);
            		});
            	}
                delCallback();
            	self.controler.uploadNext();
            });
        }
        jQuery('#uploadtip').hide();
        self.insertEle(listHtml.children());
    },

    insertEle: function (elem) {
        var container = this.getContainer();
        container.prepend(elem);
    },
    getExtendClass:function(extendname){
    	var styleClass=["png","exe","tif","txt","psd","rar","zip","xml","java","fon","jpg","jpeg","gif","bmp","tiff","mpeg","avi","wmv","mov","mpg","vob","rmvb","mp3","wma","wav","asf","mp4","sis","sisx","cab","doc","docx","pdf","xls","xlsx","ppt","pptx","swf","fla","share","folder","folder-m","folder-p","mp3-hover","upload","flv","css","rm","midi","chm","iso","vsd","not","html"];
    	if(styleClass.has(extendname)){
    		return extendname;
    	}
    	return "other";
    },
    getFileMd5: function(){
        var self = this;
        var currentFile = this.model.defaults.currentFile;
        var clientTaskno = currentFile.clientTaskno;
        var currentItem = this.model.fileListEle[clientTaskno];
        currentItem.find(".statuswrap").eq(0).html(self.md5LoadingTemplete);
    },
    setDBtnAppFileid:function(appfileid){
    	var currentFile = this.model.defaults.currentFile;
        var clientTaskno = currentFile.clientTaskno;
        var currentItem = this.model.fileListEle[clientTaskno];
        currentItem.find(".delbtn").eq(0).attr('appfileid',appfileid);
    },
    loadstart: function(){
        var self = this;
        var currentFile = this.model.defaults.currentFile;
        var clientTaskno = currentFile.clientTaskno;
        var currentItem = this.model.fileListEle[clientTaskno];

        var progressBarHtml = self.model.format(self.progressBarTemplete, {
        	processWidthText:self.model.defaults.currentFile.process+'%',
        	processText:self.model.defaults.currentFile.process+'%',
        	speedText:''
        });
        currentItem.find(".statuswrap").eq(0).html(progressBarHtml);
        var pauseHtml=self.model.format(self.pauseTemplete, {
        	clientTaskno:clientTaskno
        });
        currentItem.find(".btnwrap").eq(0).html(pauseHtml);
        currentItem.find(".delbtn").eq(0).attr('appfileid',this.model.defaults.currentFile.appFileid);
        
        //暂停续传
        var pauseContinueBtn=currentItem.find('.pauseContinuebtn').eq(0);
        pauseContinueBtn.toggle(function(){
        	var btn=jQuery(this);
        	btn.html('续传');
        	var clientTaskNo=btn.attr('clientTaskNo');
        	self.model.defaults.isStop=true;
            self.controler.onabort(clientTaskNo);
            var pauseStatusHtml = self.model.format(self.pauseStatusTemplete, {
            	remainText:(100-parseInt(self.model.defaults.currentFile.process,10))+'%'
            });
            currentItem.find(".statuswrap").eq(0).html(pauseStatusHtml);
            self.controler.uploadNext();
        },function(){
        	var btn=jQuery(this);
        	btn.html('暂停');
        	var clientTaskNo=btn.attr('clientTaskNo');
        	self.model.defaults.isStop=false;
        	var progressBarHtml = self.model.format(self.progressBarTemplete, {
            	processWidthText:self.model.defaults.currentFile.process+'%',
            	processText:self.model.defaults.currentFile.process+'%',
            	speedText:''
            });
        	currentItem.find(".statuswrap").eq(0).html(progressBarHtml);
        	self.controler.uploadNext(clientTaskNo);
        })
    },
    progress: function(){
        var currentFile = this.model.defaults.currentFile;
        var processText = Math.round(currentFile.sendSize / currentFile.totalSize * 100) + "%";
        this.model.defaults.currentFile.process=Math.round(currentFile.sendSize / currentFile.totalSize * 100);
        var speedText   = currentFile.speed;
        var currentItem = this.model.fileListEle[currentFile.clientTaskno];

        currentItem.find(".prisdr-progress-cur").css({width: processText});
        currentItem.find(".processText").html(processText);
        currentItem.find(".speedText").html(speedText+'/S');

        if(top.Util){
            currentItem.find(".fileSizeText").html(top.Util.formatSize(currentFile.sendSize,null,2)+'/'+top.Util.formatSize(currentFile.totalSize,null,2));
        }else{
        	currentItem.find(".fileSizeText").html(currentFile.sendSize+'/'+currentFile.totalSize);
        }
    },
    complete: function(options){
        var self = this;
        var currentFile = this.model.defaults.currentFile;
        var clientTaskno = currentFile.clientTaskno;
        var currentItem = this.model.fileListEle[clientTaskno];
        
        currentItem.find(".statuswrap").eq(0).html(self.completeTemplete);
        currentItem.find(".btnwrap").eq(0).html('');
        
        if(options&&options.fileSize){
        	currentItem.find(".fileSizeText").html(top.Util.formatSize(options.fileSize,null,2)+'/'+top.Util.formatSize(options.fileSize,null,2));
        }else{
        	currentItem.find(".fileSizeText").html(top.Util.formatSize(currentFile.size,null,2)+'/'+top.Util.formatSize(currentFile.size,null,2));
        }
    },

    cancel: function (options) {
    	
    },

    error: function(options){
        var self = this;
        var currentFile  = this.model.defaults.currentFile;
        var clientTaskno = currentFile.clientTaskno;
        var controler = this.controler;
        var currentItem = this.model.fileListEle[clientTaskno];
        var stopReasonCollection = options.stopReasonCollection;
        var errMsg = options.summary;
        var errCode = options.code || '';

        if(!errMsg){
            if(stopReasonCollection){
                errMsg = InfoHelper.getErrSummary(stopReasonCollection.result);
            }
            else{
                errMsg = '上传失败';
            }
        }

        if(errCode == 'RECORD_COUNT_LIMITED'){
            errMsg = '文件中转站已满';
        }

        var errUploadHtml=self.model.format(self.errUploadTemplete, {
        	errmsg:errMsg
        });
        
        currentItem.find(".statuswrap").eq(0).html(errUploadHtml);
        
        var isAgain=options.isAgain||0;
        if(isAgain && errCode != 'RECORD_COUNT_LIMITED'){
        	var againHtml=self.model.format(self.againTemplete, {
            	clientTaskno:clientTaskno
            });
            currentItem.find(".btnwrap").eq(0).html(againHtml);
            currentItem.find(".againbtn").eq(0).click(function(){//重传
            	var clientTaskNo=jQuery(this).attr('clientTaskNo');
                if(errCode == 'RECORD_COUNT_LIMITED'){
                    clientTaskNo = null;
                }
                self.controler.uploadNext(clientTaskNo);
            });
        }
    }
};
