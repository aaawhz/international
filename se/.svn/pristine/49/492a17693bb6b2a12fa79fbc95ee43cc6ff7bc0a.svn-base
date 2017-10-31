



(function (jQuery, _, M139) {
    
    var $=jQuery;
var superClass = M139.View.ViewBase;
    //todo newclass clone
    M139.namespace('M2012.Service.OnlinePreview.Rar.View', superClass.extend({

        /**
        *@lends M2012.ReadMail.View.prototype
        */
        initialize: function () {
            this.mainView = new M2012.Service.OnlinePreview.View();
            this.model = new M2012.Service.OnlinePreview.Model();
            this.unzippath = $T.Url.queryString("unzippath");
            return superClass.prototype.initialize.apply(this, arguments);
        },
        render: function (obj, dataSource, file) {
            $("#loadingStatus").show();
      
            if (!file) {
                file = {
                    arr: [decodeURIComponent(obj.fi)]
                }
            }
            var self = this;
            self.model.set({ initData: obj })
            var ssoSid = this.model.get("sid");
            var mobile = this.model.get("mobile");
            var url = "/opes/unzip.do?sid=" + ssoSid;
            var dl = encodeURIComponent(obj.dl);
            var options = {
                account: mobile,
                fileid: obj.id,
                browsetype: 1,
                filedownurl: dl,
                filename: obj.fi,
                comefrom: obj.src,
                sid: ssoSid,
                url: url
            };
            if (file && file.fileType == "directory") {
                options.url = "/opes/open.do?sid=" + ssoSid;
                options.unzippath = file.unzippath;
                options.filename = file.fileName;
            }
            if (file && file.fileType == "unzip") {
                options.unzippath = file.unzippath;
                options.filename = file.fileName;
            }
            if (this.unzippath) {//是否从压缩包里的附件打开，压缩包里的附件打开要传一个额外的压缩包路径unzippath
                options.unzippath = this.unzippath;
            }
            if ($(document.body).attr("loaded") != "true") {//打开文件夹时不刷新头部
                this.mainView.appendHeaderHtml(obj);
            }
            this.getData(options, obj, file);
            $(document.body).attr("loaded", "true")
        },
        getMenuHtml: function (file) {
            var self = this;
            var a = '<a key="alink" title="{title}" unzippath="{unzippath}" href="javascript:;" name="menu">{text}</a><b> &gt; </b>';
            var span = '<span title="{title}" name="menu">{text}</span>';
            var arr = file.arr;
            var nav = self.model.get("nav");
            var len = arr.length;
            var html = "";
            var arrA = [];
            if (len < 2) {
                html = $T.Utils.format(span, {title:arr[0], text: M139.Text.Utils.getTextOverFlow(arr[0], 25,true) })
            } else {
                for (var i = 0; i < len - 1; i++) {
                    var unzippath = file.unzippath;
                    var text = $T.Utils.format(a, { title: arr[i], text: M139.Text.Utils.getTextOverFlow(arr[i], 25, true), unzippath: nav[i - 1] });
                    arrA.push(text)
                }
                span = $T.Utils.format(span, { title: arr[len - 1], text: M139.Text.Utils.getTextOverFlow(arr[len - 1], 25, true) });
                html = arrA.join("") + span;
            }
            return html;
        },
        initEvents: function () {
            var self = this;
            this.resize();
            $(".rar-items a[target=_self]").die().live("click", function () {
                var status = $("#jonMark").length;
                if (status > 0) {
                    return
                }
                if ($(this).attr("isImg")=="true") {
                    top.$("body").append('<div class="jon-mark" id="jonMark" style="z-index:9999"><img style="position:absolute;top:50%;left:50%" src="/se/images/module/attr/loading.gif" /></div>')
                }
                var text = $("#breadCrumbs *[name=menu]");
                var This = $(this);
                var thisText = This.attr("title");
                var unzippath = This.attr("unzippath");
                var num = This.attr("index");
                var israr = This.attr("israr");
                var download = This.attr("downloadurl");
                var isimg = This.attr("isimg");
                var len = text.length;
                var textArr = [];
                for (var i = 0; i < len; i++) {
                    textArr.push(text.eq(i).attr("title"))
                }
                var initData = self.model.get("initData")
                var dataSource = self.model.get("dataSource")
                textArr.push(thisText)
                var file = {
                    fileType: "directory",
                    fileName: thisText,
                    arr: textArr,
                    unzippath: unzippath,
                    israr: israr
                }
                if (israr == "true") {
                    file.fileType = "unzip";
                }
                if (isimg == "true") {
                    var ssoSid = self.model.get("sid");
                    var url = "/opes/thumbnails.do?sid=" + ssoSid;
                    var mobile = self.model.get("mobile");
                    var obj = self.model.get("initData")
                    //var part = getCookie("cookiepartid");
                    var obj1 = domainList[1];
                    var options = {
                        account: mobile,
                        fileid: obj.id,
                        browsetype: 1,
                        filedownurl:  obj1.rebuildDomain + "/opes/" + encodeURIComponent(download),
                        filename: thisText,
                        comefrom: obj.src,
                        sid: ssoSid,
                        url: url,
                        unzippath: unzippath
                    };
                    self.isLoad = false;
                    self.model.getData(options, function (result) {
                        if (result.code == "1" && !self.isLoad) {
                            var previewImg = [];
                            var thumbnails = result.thumbnails;
                            var len = thumbnails.length;
                            for (var i = 0; i < len; i++) {
                                var obj = {
                                    imgUrl: obj1.rebuildDomain + "/opes/" + thumbnails[i].thumbnailUrl,
                                    fileName: M139.Text.Html.encode(thumbnails[i].name),
                                    downLoad: obj1.rebuildDomain + "/opes/" + thumbnails[i].downloadUrl
                                }
                                previewImg.push(obj);
                            }
                                    top.focusImagesView = new top.M2012.OnlinePreview.FocusImages.View();
                                    top.focusImagesView.render({ data: previewImg, num: parseInt(num) });
                        }
                        else {
                        }
                        self.isLoad = true
                    });
                    return
                }
                self.render(initData, dataSource, file);
            });
            self.jumpToFolder();
        },
        openScrollImg: function () {

        },
        jumpToFolder: function () {//跳转到相应的文件夹
            var self = this;
            $("#breadCrumbs *[key=alink]").die().live("click", function () {
                var text = $("#breadCrumbs *[name=menu]");
                var This = $(this);
                var index = text.index(this);
                var thisText = This.attr("title");
                var unzippath = This.attr("unzippath");
                var israr = /(?:\.rar|\.zip|\.7z)$/i.test(This.attr("title")); //如果是 rar zip 7z文件
                var len = text.length;
                var textArr = [];
                for (var i = 0; i < index + 1; i++) {
                    textArr.push(text.eq(i).attr("title"))
                }
                var initData = self.model.get("initData")
                var dataSource = self.model.get("dataSource")
                var file = {
                    fileType: "directory",
                    fileName: thisText,
                    arr: textArr,
                    unzippath: unzippath
                }
                if (index == 0 || israr) {
                    file.fileType = "unzip";
                }
                self.render(initData, dataSource, file);
            });
        },
        resize: function () {//改变窗口大小
            var self = this;
            $(window).resize(function () {
                self.setHeight();
            });
        },
        setHeight: function () {
            var self = this;
            var height = $(window).height();
            var hasTips = $(".tipBox").length > 0 ? true : false;
            height = hasTips ? height - 117 : height - 86;
            $("#contentHeight").height(height);
        },
        getData: function (options, obj, file) {
            var self = this;
            this.isLoad = false;
            this.model.getData(options, function (result) {
                if (!self.isLoad) {
                    self.model.set({ dataSource: result })
                    if (result.code != "1") {
                        if (result.code == "FS_NOT_LOGIN") {
                            obj.display = "none";
                            obj.text = self.model.message.relogin;
                        }
                        var html = self.mainView.loadingErrorHtml(obj);
                        $("#loadingStatus").html(html);
                        return
                    }
                    else {
                        self.template(obj, result, file)
                        self.setHeight();
                        $("#loadingStatus").hide();
                        if (self.unzippath) {
                            $(".attr-select").remove();
                        }
                        self.initEvents();
                    }
                }
                self.isLoad = true;

            }, function (result1) {
                console.log(result1)
                $("#previewContent").html('<div class="contentHeight"></div>');
                $("#loadingStatus").html(result1);
                var height = $(window).height();
                $(".contentHeight").height(height - 73);
                top.BH("preview_load_error");
            });
        },
        getListData: function (result, options, datasource) {
            this.imgNum = 0;
            //console.log(result)
            var self = this;
            var len = result.length;
            var tableArr1 = [];
            var obj = {};
            var previewImg = [];
            //var part = getCookie("cookiepartid");
            var obj1 = domainList[1];
            var unzippath = datasource.unzippath;
			var objURL = $Url.getQueryObj();
            for (var i = 0; i < len; i++) {
                var downloadurl = obj1.rebuildDomain + "/opes/" + result[i].downloadurl;
                var urlObj = {
                    fileName: M139.Text.Html.encode(result[i].name),
                    fileSize: result[i].size,
                    downloadUrl:downloadurl,
                    type: options.src,
                    contextId: options.id

                };
                var openurl = self.model.getUrl(urlObj);
                openurl = openurl + "&unzippath=" + encodeURIComponent(unzippath);
                var filename = result[i].name;
                var filetype = result[i].type;
                var file = "";
                var type = self.model.checkFile(filename); //附件是否可预览    1 可预览   2压缩包  -1不可预览
                var israr = /(?:\.rar|\.zip|\.7z)$/i.test(filename); //如果是 rar zip 7z文件
                var isimg = /(?:\.jpg|\.gif|\.png|\.ico|\.jfif|\.tiff|\.tif|\.bmp|\.jpeg|\.jpe)$/i.test(filename);
                var index = "";
                var text = type == 1 ? "预览" : "打开";
                var previewDisplay = type == -1 ? "none" : "";
                var target = "_blank";
                var cursor = "pointer";
				var downloadDisplay="";
                if (filetype == "directory") {
                    var display = "none";
                    target = "_self";
                    openurl = "javascript:;";
                    file = "folder";
                } else {
                    var num1 = filename.lastIndexOf(".");
                    var num2 = filename.length;
                    file = filename.substring(num1 + 1, num2); //后缀名  
                    var display = "";
                    if(objURL.denyForward && objURL.denyForward!="0")
                    {
						downloadDisplay = "none";
					}
                    if (israr || isimg) {
                        target = "_self";
                        openurl = "javascript:;";
                    } else {
                    }
                    if (type == -1) {
                        openurl = "javascript:;"
                        cursor = "default";
                        target = "";
                    }

                }
                if (isimg) {
                    var imgUrl = "";
                    var urltemp = "&sid={sid}&mid={mid}&size={size}&offset={offset}&name={name}&type={type}&width={width}&height={height}&quality={quality}&encoding=1";
                    imgUrl = window.location.protocol+'://' + location.host + "/RmWeb/mail?func=mbox:getThumbnail" + $T.Utils.format(urltemp, {
                        sid: this.model.get("sid"),
                        mid: this.model.get("mid"),
                        size: result[i].size,
                        offset: 0,
                        name: M139.Text.Html.encode(filename),
                        type: "attach",
                        width: 72,
                        height: 72,
                        quality: 80
                    });
                    this.imgNum++;
                    index = this.imgNum - 1;
                    previewImg.push({
                        imgUrl: imgUrl,
                        fileName:  M139.Text.Html.encode(filename),
                        downLoad: downloadurl
                    });
                };
                obj = {
                    filename:  M139.Text.Html.encode(filename),
                    filetype: file,
                    downloadurl: downloadurl,
                    display: display,
					downloadDisplay:downloadDisplay,
                    openurl: openurl,
                    target: target,
                    unzippath: unzippath,
                    israr: israr,
                    isimg: isimg,
                    num: index,
                    cursor: cursor,
                    text: text,
                    previewDisplay: previewDisplay
                }
                tableArr1.push(obj);
            }
            self.previewImg = previewImg;
            return tableArr1
        },
        template: function (options, datasource, file) {
            var self = this;
            var nav = self.model.get("nav");
            nav.push(datasource.unzippath);
            self.model.set({ nav: nav })

            var result = datasource.files;
            var menu = [];
            var tableArr = [{
                filename: decodeURIComponent(options.fi)
            }];
            var str = $("#rarTemplate").val();
            var rp = new Repeater(str);
            rp.Functions = {
                getMenu: function () {
                    var html = self.getMenuHtml(file);
                    return html;
                }
            }
            var html = rp.DataBind(tableArr); //数据源绑定后即直接生成dom
            $("#previewContent").html(html);

            var str1 = $("#rarListTemplate").val();
            var rp1 = new Repeater(str1);
            var tableArr1 = this.getListData(result, options, datasource);
            var html1 = rp1.DataBind(tableArr1); //数据源绑定后即直接生成dom
            $("#rarWrapInner").html(html1)
        }
    }));

})(jQuery, _, M139);