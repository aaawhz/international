(function(exports,$,Backbone){
    var html5Upload={
        run:false, //是否上传中
        tail:-1,
        front:-1,
        fileviewCol:{},
        currXHR:null, //请求ajax请求对象
        /**
         * 文件信息模型
         */
        fileModel:Backbone.Model.extend({
            defaults:{
                id:0,
                file:{},
                size:0,
                fileName:'',
                expandName:'',
                expandClassName:'',
                uploading:false,
                flag:1 //0-不可上传 1-可上传
            }
        }),
        /**
         * 文件视图
         */
        fileView:function(file){
            var fileview=Backbone.View.extend({
                tagName:'li',
                template:$('#fileTemplate'),
                events:{
                    'click .clsBtn':'triggerDel',
                    'click .reupload-btn':'triggerReupload'
                },
                render:function(){
                    var modelobj=this.model.toJSON();
                    modelobj.size=top.Util.formatSize(this.model.get('size'), null, 2);
                    this.$el.append(this.template.tmpl(modelobj));
                    return this;
                },
                uploading:function(process,loaded){
                	this.$el.find('.statuswrap').eq(0).hide().html('');
                    this.$el.find('.prisdr-progress-cur').eq(0).css('width',process);
                    this.$el.find('.speedText').eq(0).html(process);
                    this.$el.find('.processwrap').eq(0).show();
                    
                    this.$el.find('.reupload-btn').eq(0).hide();
                    this.$el.find('.loaded').eq(0).html(loaded+'/');
                },
                uploadsucc:function(loaded){
                	this.$el.find('.processwrap').eq(0).hide();
                    this.$el.find('.reupload-btn').eq(0).hide();
                    this.$el.find('.statuswrap').eq(0).html('<i class="i-gsuss mr_5"></i><span class="inbm col_green">上传成功</span>').show();
                    this.$el.find('.loaded').eq(0).html(loaded+'/');
                },
                uploadFail:function(err){
                	this.$el.find('.processwrap').eq(0).hide();
                    this.$el.find('.reupload-btn').eq(0).show();
                    this.$el.find('.statuswrap').eq(0).html('<i class="i-warm mr_5"></i><span class="inbm col_red">'+err+'</span>').show();
                },
                uploadLimit:function(err){
                	this.$el.find('.processwrap').eq(0).hide();
                    this.$el.find('.reupload-btn').eq(0).hide();
                    this.$el.find('.statuswrap').eq(0).html('<i class="i-warm mr_5"></i><span class="inbm col_red">'+err+'</span>').show();
                },
                triggerDel:function(){
                    this.trigger('delete');
                },
                triggerReupload:function(){
                    this.trigger('reupload',this.model.get('id'));
                },
                deleteFile:function(){
                    this.$el.hide().remove();
                }
            });
            return new fileview({model:file});
        },
        fileCollection:function(){
            var self=this;
            var fileCol=Backbone.Collection.extend({
                model:self.fileModel
            });
            return new fileCol;
        },
        AppView:function(){
            var self=this;
            var appView=Backbone.View.extend({
                el:$('body'),
                events:{
                    'change #html5upload_file':'selectFile'
                },
                initialize:function(){
                    this.uploadbtn=$('#html5upload_btn');
                    this.fileList=this.$('#filelist');
                    this.dragTarget=$('#uploadtip')[0]; //拖放目标

                    this.listenTo(self.filesCol,'add',this.addFileItem);

                    //绑定添加文件事件
                    this.uploadbtn.on('click', $.proxy(function(){
                        $('#html5upload_file').trigger('click');
                    },this));

                    //绑定目标拖拽事件
                    this.bindDragEvents(this.dragTarget);
                },
                selectFile:function(){
                    var files=$('#html5upload_file')[0].files;
                    this.addFilesCol(files);
                    this.clearSelectedFile();
                },
                clearSelectedFile:function(){
                    $('#html5upload_file').parent().html('<input type="file" name="file" id="html5upload_file" style="position:absolute;top:0;right:0;opacity:0;z-index:-1;" multiple/>');
                },
                bindDragEvents:function(target){
                    var _this=this;
                    target.ondragenter=function(e){
                        var types= e.dataTransfer.types;
                        if(types&&((types.contains&&types.contains('Files'))||(types.indexOf&&types.indexOf('Files')!==-1))){
                            target.style.border='2px dashed #ccc';
                            return false;
                        }
                    };

                    target.ondragover=function(e){
                        return false;
                    };

                    target.ondragleave=function(e){
                        target.style.border='2px dashed #fff';
                    };

                    target.ondrop=function(e){
                        target.style.border='2px dashed #fff';
                        var files= e.dataTransfer.files;
                        if(files&&files.length){
                            _this.addFilesCol(files);
                            return false;
                        }
                    }
                },
                addFilesCol:function(files){
                    var len=files.length;
                    if(len>0){
                        for(var i=0;i<len;i++){
                        	var fileName=this.getShortName(files[i].name,20);
                        	var expandName=this.getExtendName(files[i].name);
                            var expandClassName=this.getExtendClass(expandName);
                            //超过大小限制
                            if(files[i].size>self.fastMaxFileSzie){
                                var file=new self.fileModel({
                                    id:-1,
                                    size:files[i].size,
                                    fileName:fileName,
                                    expandName:expandName,
                                    expandClassName:expandClassName
                                });
                                var fileview=this.addLimitFile(file);
                                fileview.uploadLimit('文件超过'+top.Util.formatSize(self.fastMaxFileSzie, null, 2)+'，不能上传');
                                continue;
                            }

                            //超过文件长度
                            if(files[i].name.length>self.filelength){
                                var file=new self.fileModel({
                                    id:-1,
                                    size:files[i].size,
                                    fileName:fileName,
                                    expandName:expandName,
                                    expandClassName:expandClassName
                                });
                                var fileview=this.addLimitFile(file);
                                fileview.uploadLimit('文件名超过'+self.filelength+'个字符，不能上传');
                                continue;
                            }


                            //文件名不合法
                            if(/[\\\/\"\'\<\>:\|\*\\?]/g.test(files[i].name) ){
                                var file=new self.fileModel({
                                    id:-1,
                                    size:files[i].size,
                                    fileName:fileName,
                                    expandName:expandName,
                                    expandClassName:expandClassName
                                });
                                var fileview=this.addLimitFile(file);
                                fileview.uploadLimit('文件名不能包含:\\\/*\?\"\'\<\>等特殊字符');
                                continue;
                            }


                            self.filesCol.add({
                                id:++self.tail,
                                file:files[i],
                                size:files[i].size,
                                fileName:fileName,
                                expandName:expandName,
                                expandClassName:expandClassName
                            });
                        }
                    }
                },
                addLimitFile:function(file){
                    this.$('#uploadtip').hide();
                    this.fileList.show();
                    var fileview=self.fileView(file);
                    this.fileList.append(fileview.render().el);
                    this.listenTo(fileview,'delete',function(){
                        fileview.deleteFile();
                    });
                    return fileview;
                },
                addFileItem:function(file){
                    this.$('#uploadtip').hide();
                    this.fileList.show();
                    var fileview=self.fileView(file);
                    this.fileList.append(fileview.render().el);

                    self.fileviewCol[file.id]=fileview;

                    /**
                     * 监听删除事件
                     */
                    this.listenTo(fileview,'delete',function(){
                        fileview.deleteFile();
                        file.set('flag',0);
                        if(file.get('uploading')&&self.currXHR){
                            self.currXHR.abort();
                        }
                    });

                    /**
                     * 监听重传事件
                     */
                    this.listenTo(fileview,'reupload',function(id){
                    	self.run=true;
                        this.uploadFile(id);
                    });

                    if(!self.run){
                        self.run=true;
                        this.uploadFile();
                    }
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
                uploadFile:function(id){
                    var _this=this;
                    if(!self.run)return;
                    var file=(id!=undefined)?self.filesCol.get(id):self.filesCol.get(self.front+1);

                    if(file&&file.get('flag')==1){
                    	if(id==undefined){
                    		++self.front;
                    	}
                       
                        file.set('uploading',true);

                        var fileview=self.fileviewCol[file.id];
                        var params={
                        	name:file.get('fileName')+'.'+file.get('expandName'),
                        	size:file.get('size')
                        }
                        self.getUploadUrl(params,function(data){
                        	var uploadUrl=data["var"];
                            var xhr=self.currXHR=new XMLHttpRequest();
                            xhr.open('POST',uploadUrl,true);

                            var data=new FormData();
                            data.append(params.name,file.get('file'));

                            xhr.upload.onprogress=function(e){
                                if(e.lengthComputable){
                                    var process=Math.round(100* e.loaded/ e.total)+'%';
                                    if(process=='100%'){
                                        process='99%';
                                    }
                                    fileview.uploading(process,top.Util.formatSize(e.loaded, null, 2));
                                }
                            };

                            xhr.onload=function(e){
                                if(xhr.status===200){
                                    var data=xhr.responseText;
                                    var xmldom=top.Util.str2Dom(data);
                                    var retcode=xmldom.getElementsByTagName("retcode")[0].childNodes[0].nodeValue;

                                    if(retcode=='0'){
                                        var middleret=xmldom.getElementsByTagName("middleret")[0].childNodes[0].nodeValue;
                                        var middleretJson=JSON.parse(decodeURIComponent(middleret));
                                        var middleretcode=middleretJson.code;
                                        var middleretsummary=middleretJson.summary;
                                        var middleretVar=middleretJson["var"].replace(/'/g,"\"");
                                        
                                        var shareUrl=JSON.parse(middleretVar).shareUrl;
                                        var validateTime=JSON.parse(middleretVar).validateTime;

                                        if(middleretcode=='S_OK'){
                                            fileview.uploadsucc(top.Util.formatSize(file.get('size'), null, 2));
                                            
                                            //保存上传成功的文件信息
                                            self.fileUploadSuc.push({
                                            	name:params.name,
                                            	size:params.size,
                                            	shareUrl:shareUrl,
                                            	validateTime:validateTime
                                            })
                                        }else{
                                            var errmsg=middleretsummary;
                                            fileview.uploadFail(errmsg);
                                        }
                                    }else{
                                        var errmsg=self.getErrSummary(retcode);
                                        fileview.uploadFail(errmsg);
                                    }

                                    file.set('uploading',false);
                                    _this.uploadFile();
                                }
                            };

                            xhr.onerror=function(e){
                                file.set('uploading',false);
                                fileview.uploadFail('上传出现异常');
                                _this.uploadFile();
                            };

                            xhr.onabort=function(e){
                                file.set('uploading',false);
                                _this.uploadFile();
                            };
                            xhr.send(data);
                        },function(){
                            file.set('uploading',false);
                            fileview.uploadFail('获取上传地址失败');
                            _this.uploadFile();
                        });
                    }else if(file&&file.get('flag')==0){
                        ++self.front;
                        this.uploadFile();
                    }else{
                        self.run=false;
                    }
                }
            });
            return new appView;
        },
        /**
	     * 获取分布式上传url
	     */
	    getUploadUrl:function(params,call,failcall){
	    	var failcall=failcall||function(d){
	    		top.CC.alert(d.summary);
	    	}
			
	        top.MM.doService({
	            url: '/disk/userdisk.do',
	            func: 'disk:upload',
	            data: {
	            	comeFrom : 1,
	            	upType   : 1,
	            	parentId : -1,
	            	fileSize : params.size,
	            	objectName : params.name
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
	    getUploadSuccessList:function(){
	    	return this.fileUploadSuc;
	    },
	    checkUploading:function(){
	    	return this.run;
	    },
        close:function(){
            if(this.run){
            	this.run=false;
            	this.currXHR.abort();
            }
            this.fileviewCol=null;
            this.currXHR=null;
            this.filesCol=null;
        },
        init:function(option){
            this.fastMaxFileSzie=option.fastMaxFileSzie;
            this.filelength=option.filelength;
            this.filesCol=this.fileCollection();
            this.fileUploadSuc=[];
            this.AppView();
            return this;
        }
    };

	exports.html5Upload=html5Upload;
})(window,jQuery,Backbone);