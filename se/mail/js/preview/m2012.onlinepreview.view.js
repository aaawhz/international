



(function (jQuery, _, M139) {
    
    var $=jQuery;
var superClass = M139.View.ViewBase;
    //todo newclass clone
    M139.namespace('M2012.Service.OnlinePreview.View', superClass.extend({

        /**
        *@lends M2012.ReadMail.View.prototype
        */
        initialize: function () {
            this.initData = null;
            this.model = new M2012.Service.OnlinePreview.Model();
            return superClass.prototype.initialize.apply(this, arguments);
        },
        render: function () {
            $("body").focus();
            var self = this;
            var obj = $Url.getQueryObj();
            self.model.set({ initData: obj })//保存地址栏的参数到model
            self.checkFileTypeToRender(obj);
            this.initEvents();
            if (obj.comefrom && obj.comefrom == "compose") {//从标准的写信页入口进来
                self.model.set({ comefrom: obj.comefrom });
                self.getAllAttachForCompose(obj);
                return
            }
            if (obj.comefrom && obj.comefrom == "draftresend") {//回复 全部回复  草稿箱 再次发送 入口进来
                $(".attr-select").remove();
            }
            if (obj.src == "email") {//网盘和附件夹的入口进来没有其它附件
                self.getAllAttach(obj);
            }
        },
        doPrint: function () {//打印iframe里面的内容
            $("#print").click(function () {
                var type = $(this).attr("filetype");
                if (type == "doc" || type == "ppt") {
                    $("#attrIframe iframe")[0].contentWindow.print();
                }
                else {
                    window.print();
                }
            })
        },
        appendHeaderHtml: function (obj) {//进入页面初始状态下的页面展现，只展现头部 
            var str = $("#topTemplate").val();
            var rp = new Repeater(str);
            var filename = obj.fi;
            var num1 = filename.lastIndexOf(".");
            var num2 = filename.length;
            var file = filename.substring(num1 + 1, num2); //后缀名  
            var filetype = this.model.checkFileType(filename); //是否是压缩包文档   true 是  false 否
            rp.Functions = {
                getPrint: function () {
                    var html ='';
					if(filetype!="rar" && (!obj.denyForward || obj.denyForward == "0"))
					{
						html='|  <a filetype="' + filetype + '" id="print" href="javascript:;">打印</a>';
					}
					 //filetype == "rar" ? '' : '|  <a filetype="' + filetype + '" id="print" href="javascript:;">打印</a>  ';
                    return html;
                }
            }
            var attrDisplay = obj.src == "disk" || obj.comefrom == "attach" ? "none" : "";
            var dl = decodeURIComponent(obj.dl);
			//var filename="";
			try{
			filename = decodeURIComponent(filename);
			}catch(e){}
			
            var tableArr = [
                {
                    filename:  M139.Text.Html.encode(filename),
                    filesize: M139.Text.Utils.getFileSizeText(obj.filesize),
                    href: dl,
                    display: "none",
                    attrDisplay: attrDisplay,
                    filetype: file
                }
            ]
			if(obj.attachManage)
				tableArr[0].href=dl+"&df=1";
            var html = rp.DataBind(tableArr); //数据源绑定后即直接生成dom
            $("#previewHead").html(html)
			if (obj.denyForward == "1") {
				$("#downloadId").hide();
			}
			else{
				$("#downloadId").show();
			}
        },
        checkFileTypeToRender: function (obj, comefrom) {//根据文件类型的不同，展现不同的UI 
            var type = this.model.checkFileType(obj.fi);
            switch (type) {
                case "ppt":
                case "pdf":
                    var pptView = new M2012.Service.OnlinePreview.Ppt.View();
                    pptView.render(obj);
                    break
                case "html":
                case "doc":
                    var docView = new M2012.Service.OnlinePreview.Doc.View();
                    docView.render(obj);
                    break
                case "rar":
                    var rarView = new M2012.Service.OnlinePreview.Rar.View();
                    rarView.render(obj);
                    break
                case "xls":
                    var xlsView = new M2012.Service.OnlinePreview.Xls.View();
                    xlsView.render(obj);
                    break
            }

        },
        /** 
        *附件存网盘
        */
        saveToDiskRequest: function (url, fileName, packSave) {
			
			var fSelector = new NDFileSelector({
				attachUrl:url,
				fileSize: 111,
				attachName:fileName
			});
            /*var saveToDiskview = new M2012.UI.Dialog.SaveToDisk({
                fileName: fileName,
                downloadUrl: url
            });
            saveToDiskview.render().on("success", function () {
                //存网盘成功记日志
                if (packSave) {
                    BH("readmail_savediskall");
                } else {
                    BH("readmail_savedisk");
                }
            });*/
        },
        getAttachList: function (result, initData) {//拼装其他附件列表，并输出html
            var self = this;
            var len = result.length;
            var ul = '<ul class="list">{list}</ul>';
            var list = '';
            var num = 0;
            var arr = [];
            var previewImg = [];
            var li = '<li index="{index}"><a target="{target}" href="{url}"><i class=" i_file_16 i_m_{filetype}"></i><span class="pop-fileName">{filename}</span></a></li>';
            for (var i = 0; i < len; i++) {
                var f = result[i];
                var filename = f.fileName;
                var num1 = filename.lastIndexOf(".");
                var num2 = filename.length;
                var filetype = filename.substring(num1 + 1, num2); //后缀名  
                filetype = filetype.toLocaleLowerCase();
                var data = self.getAttrImages(f, initData)
                if (data["index"] != "null") {
                    previewImg.push({
                        imgUrl: data.imgUrl,
                        fileName: filename,
                        downLoad: data.downloadUrl
                    });
                }
                var type = self.model.checkFile(filename);
                if (type != -1) {
                    num++;
                    list = $T.Utils.format(li, { url: data.previewUrl, target: data.target, filetype: filetype, filename: filename, index: data.index });
                    arr.push(list);
                }
            }
            if (arr.length < 2) {
                $(".attr-select").remove();
            }
            if (arr.length > 10) {
                $("#attachList").css({ height: "330px", overflowY: "scroll" });
            }
            $("#attrNum").html(num);
            self.previewImg = previewImg;
            list = arr.join("");
            ul = $T.Utils.format(ul, { list: list });
            $("#attachList").html(ul);
        },
        getAllAttachForCompose: function (initData) {//得到邮件里所有附件的列表   写信页的入口
            var self = this;
            this.imgNum = 0;
            this.model.getAttachForCompose(function (dataSource) {
                var len = dataSource.length;
                var arr = [];
                for (var i = 0; i < len; i++) {
                    if (dataSource[i].fileRealSize < 1024 * 1024 * 20) {
                        arr.push(dataSource[i]);
                    }
                }
                self.getAttachList(arr, initData);
            })
        },
        getAllAttach: function (initData) {//得到邮件里所有附件的列表
            var self = this;
            this.imgNum = 0;
            this.model.getAttach(function (dataSource) {
                var result = dataSource["attachments"];
                var len = result.length;
                var arr = [];
                for (var i = 0; i < len; i++) {
                    if (result[i].fileRealSize < 1024 * 1024 * 20) {
                        arr.push(result[i]);
                    }
                }
                self.getAttachList(arr, initData);
            })
        },
        getAttrImages: function (f, initData) {//从所有附件中筛选出图片附件
            var self = this;
            var comefrom = this.model.get("comefrom");
            var composeUrl = self.model.getPreViewUrlForCompose(f);
            var readmailUrl = self.model.getPreViewUrl(f, initData);
            var downloadUrl = comefrom == "compose" ? composeUrl : readmailUrl;
            var obj = {
                fileName: encodeURIComponent(f.fileName),
                fileSize: f.fileSize,
                downloadUrl: encodeURIComponent(downloadUrl),
                type: initData.src,
                contextId: initData.id,
                comefrom: comefrom,
                composeId: initData.composeId

            }
            var previewUrl = self.model.getUrl(obj);
            var target = "_blank";
            var index = "null";
            var isImg = /(?:\.jpg|\.gif|\.png|\.ico|\.jfif|\.tiff|\.tif|\.bmp|\.jpeg|\.jpe)$/i.test(f.fileName);
            if (isImg) {
                var imgUrl = "";
                var urltemp = "&sid={sid}&mid={mid}&size={size}&offset={offset}&name={name}&type={type}&width={width}&height={height}&quality={quality}&encoding=1";
                imgUrl = window.location.protocol+'://' + location.host + "/RmWeb/mail?func=mbox:getThumbnail" + $T.Utils.format(urltemp, {
                    sid: this.model.get("sid"),
                    mid: initData.id,
                    size: f.fileSize,
                    offset: f.fileOffSet,
                    name: f.fileName,
                    type: f.type,
                    width: 72,
                    height: 72,
                    quality: 80
                });
                this.imgNum++;
                index = this.imgNum - 1;
                previewUrl = "javascript:;";
                target = "_self";
                imgUrl = comefrom == "compose" ? "" : imgUrl;
            };
            var dataSource = {
                previewUrl: previewUrl,
                target: target,
                index: index,
                imgUrl: imgUrl,
                downloadUrl: downloadUrl
            };
            return dataSource;
        },
        bindAutoHide: function (options) {
            return $D.bindAutoHide(options);
        },

        unBindAutoHide: function (options) {
            return $D.unBindAutoHide(options);
        },
        initEvents: function () {//初始化事件
            var self = this;
            this.doPrint();
            $("#saveNet").die().live("click", function () {//存网盘
                var dl = $(this).attr("dl");
                var fi = $(this).attr("fi");
                self.saveToDiskRequest(dl, fi, true);
            });
            $("#allAttr").live("click", function () {//其他附件列表的入口，点击异步加载
                $("#pagerSelect").hide();
                var objParent = $(".attr-select-pop");
                objParent.show();
                var options = {
                    action: "click",
                    element: objParent[0],
                    stopEvent: true,
                    callback: function () {
                        objParent.attr("bindAutoHide", "0");
                        objParent.hide();
                        if (!$("#focusImages")) {
                            $("#pagerSelect").show();
                        }
                    }
                }
                self.bindAutoHide(options);
            });
            $("#attachList li").live("click", function () {//点击其他附件列表新窗口打开该附件
                var num = $(this).attr("index");
                if (num != "" && num != "null") {
                    var status = $("#jonMark").length;
                    if (status > 0) {
                        return
                    }
                    top.$("body").append('<div class="jon-mark" id="jonMark" style="z-index:9999"><img style="position:absolute;top:50%;left:50%" src="/se/images/module/attr/loading.gif" /></div>')
                    top.focusImagesView = new M2012.OnlinePreview.FocusImages.View();
                    top.focusImagesView.render({ data: self.previewImg, num: parseInt(num) });

                }
            });
            $("#attachList li").live("mouseover", function () {//其他附件列表mouseover mouseout
                $(this).addClass("on");
            });
            $("#attachList li").live("mouseout", function () {
                $(this).removeClass("on");
            });
            $("#refreshPage").live("click", function () {//加载失败时重试
                var href = location.href;
                location.href = href;
            })
        },
        loadingErrorHtml: function (obj) {//加载失败的提示
            var url = decodeURIComponent(obj.dl);
			var obj = $Url.getQueryObj();
			
            var text = obj.text ? obj.text : "您可以重试，或者下载到本地查看。";
			
			var html =[];
			html.push('<div class="bg-cover"></div><!--bg-cover--><div class="load-fail-pop"><em><i class="i-fail-ico"></i></em>');
			html.push('<h4>加载失败</h4><p>');
			if (obj.denyForward == 1) {
				html.push('您可以选择重试');
			}
			else {
				html.push(text);
			}
			html.push('</p><div style="display:' + obj.display + '"><a id="refreshPage" href="javascript:;" class="nor-btn mr_10">重试</a>');
			if(obj.denyForward == 0)
			{
				html.push('<a href="' + url + '" class="nor-btn">下载</a>');
			}
			html.push('</div></div>');
            return html.join("");
        }
    }));
    var onlinePreviewView = new M2012.Service.OnlinePreview.View();
    onlinePreviewView.render();

})(jQuery, _, M139);