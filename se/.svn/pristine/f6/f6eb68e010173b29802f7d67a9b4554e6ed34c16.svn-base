



(function (jQuery, _, M139) {
    
    var $=jQuery;
var superClass = M139.View.ViewBase;
    //todo newclass clone
    M139.namespace('M2012.Service.OnlinePreview.Ppt.View', superClass.extend({

        /**
        *@lends M2012.ReadMail.View.prototype
        */
        initialize: function () {
            this.mainView = new M2012.Service.OnlinePreview.View();
            this.model = new M2012.Service.OnlinePreview.Model();
            this.initEvents();
            this.unzippath = $T.Url.queryString("unzippath");
            return superClass.prototype.initialize.apply(this, arguments);
        },
        render: function (obj) {
            var self = this;
            console.log("ppt")
            this.type = this.model.checkFileType(obj.fi); //是否是pdf文档   true 是  false 否
            self.model.set({ initData: obj });
            var ssoSid = this.model.get("sid");
            var mobile = this.model.get("mobile");
            var url = "/opes/preview.do?sid=" + ssoSid;
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
            if (this.unzippath) {//是否从压缩包里的附件打开，压缩包里的附件打开要传一个额外的压缩包路径unzippath
                options.unzippath = this.unzippath;
            }
            this.mainView.appendHeaderHtml(obj);
            this.getData(options, obj);
        },
        initEvents: function () {
            var self = this;
            this.resize();
            $("#closeTips").live("click", function () {//关闭可以用方向键进行操作的提示
                $(this).parents("#tipBox").css({ "visibility": "hidden" });
                self.setHeight();
            });
            this.model.on("change:currentPage", function () {//content 内容变换
                var dataSource = self.model.get("dataSource");
                var index = self.model.get("currentPage");
                //var part = getCookie("cookiepartid");
                var obj = domainList[1];
                var url =  obj.rebuildDomain+"/opes/" + dataSource["navList"][index - 1]["detailPage"];
                if (self.type=="pdf") {//pdf文档
                    $("#attrIframe img").attr("src", url);
                } else {//ppt
                    $("#docIframe").attr("src", url);
                }
            })
            this.model.on("change:currentPage", function () {//缩略图当前选中状态
                var index = self.model.get("currentPage");
                $("#pagerSelect option").eq(index - 1).attr("selected", true);
                var li = $("#pdfSiderInner li");
                li.removeClass("on");
                li.eq(index - 1).addClass("on");
            })
            this.model.on("change:currentPage", function () {//缩略图的滚动条位置
                var index = self.model.get("currentPage");
                var height = $("#pdfSiderInner li").height();
                height = height + 18;
                $("#pdfSider").scrollTop((index - 2) * height)
            })
            this.model.on("change:currentPage", function () {//缩略图上下翻页按钮的状态显示
                var currentPage = self.model.get("currentPage");
                var len = self.model.get("pptLen");
                $("#scrollDown").removeClass("unable");
                $("#scrollUp").removeClass("unable");
                if (currentPage == 1) {
                    $("#scrollUp").addClass("unable");
                }
                if (currentPage == len) {
                    $("#scrollDown").addClass("unable")
                }
            })
            this.scrollPpt();
        },
        scrollPpt: function () {
            var self = this;
            $("#pagerSelect").live("change", function () {
                var index = $(this).find("option:selected").index();
                self.model.set({ currentPage: index + 1 })
            })
            $("#pdfSiderInner li").live("click", function () {
                var li = $("#pdfSiderInner li");
                var index = li.index(this);
                self.model.set({ currentPage: index + 1 })
            })
            $("#scrollUp").live("click", function () {
                self.scrollUp();
                return false;
            })
            $("#scrollDown").live("click", function () {
                self.scrollDown();
                return false;
            })
            $(document).keydown(function (event) {
                var keycode = event.which || event.KeyCode;
                console.log(keycode)
                if (keycode == 38 || keycode == 37) {//up   
                    self.scrollUp();
                }
                if (keycode == 40 || keycode == 39) {//down  
                    self.scrollDown();
                }
            });
        },
        scrollUp: function () {
            var self = this;
            var currentPage = self.model.get("currentPage");
            $("#scrollDown").removeClass("unable");
            if (currentPage == 2) {
                $("#scrollUp").addClass("unable");
            }
            if (currentPage == 1) {
                return;
            }
            $("#pdfSider").scrollTop((currentPage - 2) * 172)
            self.model.set({ currentPage: currentPage - 1 })

        },
        scrollDown: function () {
            var self = this;
            var len = self.model.get("pptLen");
            var currentPage = self.model.get("currentPage");
            $("#scrollUp").removeClass("unable");
            if (currentPage == len - 1) {
                $("#scrollDown").addClass("unable")
            }
            if (currentPage == len) {
                return
            }
            $("#pdfSider").scrollTop(currentPage * 172)
            self.model.set({ currentPage: currentPage + 1 })

        },
        createiframe: function (result) {
            var index = this.model.get("currentPage");
            var url = result["navList"][index - 1]["detailPage"];
            var iframe = document.createElement("iframe");
            iframe.id = "docIframe";
            iframe.width = "100%";
            iframe.frameBorder = "no";
            //var part = getCookie("cookiepartid");
            var obj = domainList[1];
            iframe.src = obj.rebuildDomain + "/opes/" + url;
            return iframe;
        },
        getPdfImage: function (result) {//pdf转换成的图片
            var self = this;
            var index = this.model.get("currentPage");
            var image = result["navList"][index - 1]["detailPage"];
            //var part = getCookie("cookiepartid");
            var obj = domainList[1];
            image = '<img style="width:780px" src="' + obj.rebuildDomain + "/opes/" + image + '" />';
            $(image).load(function () {
                $("#loadingStatus").remove();
                var contents = $("#attrIframe img");
                var width = contents.width();
                var height = contents.height();
                _width = -width / 2;
                _height = -height / 2;
                self.setImageLocation(contents, height);
            });
            return image
        },
        setImageLocation: function (obj, height) {
            var w = obj.width();
            var h = obj.height();
            _width = -w / 2;
            _height = -h / 2;
            var iframeW = $("#attrIframe").width();
            var iframeH = $("#attrIframe").height();
            if (iframeW > 780) {
                obj.css({ overflow: "hidden", top: "50%", position: "absolute", left: "50%", marginTop: _height + "px", marginLeft: _width + "px" });
            } else {
                obj.css({ position: "static", marginTop: 0, marginLeft: 0 });
            }
            console.log(height)
            console.log(iframeH)
            console.log(iframeW)
            if (iframeH > height) {
                obj.css({ top: "50%" });
            } else {
                obj.css({ top: 0, marginTop: 0 });
            }
        },
        frameOnload: function (result, obj) {
            var self = this;
            var iframe = this.createiframe(result);
            $(iframe).load(function () {
                $("#loadingStatus").remove();
                var contents = $("#attrIframe iframe").contents();
                contents.find("body").css({ backgroundColor: "#ffffff", cssText: "width:auto!important;height:auto!important" })
                var slideObj = contents.find("#SlideObj");
                var width = slideObj.width();
                var height = slideObj.height();
                _width = -width / 2;
                _height = -height / 2;
                self.setImageLocation(slideObj, height);
                var contents = $("#attrIframe iframe").contents().find("body");
                console.log(contents.text())
                contents.keydown(function (event) {
                    var keycode = event.which || event.KeyCode;
                    console.log(keycode)
                    if (keycode == 38 || keycode == 37) {//up   
                        self.scrollUp();
                    }
                    if (keycode == 40 || keycode == 39) {//down  
                        self.scrollDown();
                    }
                })
            });
            return iframe
        },
        resize: function () {//改变窗口大小
            var self = this;
            $(window).resize(function () {
                var contents = $("#attrIframe iframe").contents();
                var obj1 = contents.find("#SlideObj");
                var obj2 = $("#attrIframe img");
                self.setImageLocation(obj1);
                self.setImageLocation(obj2);
                self.setHeight();
            });
        },
        setHeight: function () {
            var self = this;
            var height = $(window).height();
            var width = $(window).width();
            var hasTips = $(".tipBox").length > 0 ? true : false;
            height = hasTips ? height - 73 : height - 62;
            $(".contentHeight").height(height);
            $("#docIframe,#attrIframe").height(height - 50);
        },
        getData: function (options, obj) {
            var self = this;
            this.model.getData(options, function (result) {
                self.model.set({ dataSource: result })
                if (result.code != "2") {
                    if (result.code == "FS_NOT_LOGIN") {
                        obj.display = "none";
                        obj.text = self.model.message.relogin;
                    }
                    var html = self.mainView.loadingErrorHtml(obj);
                    $("#loadingStatus").html(html);
                    top.BH("preview_load_error");
                    return
                }
                else {
                    self.template(result)
                    if (self.type=="pdf") {//pdf文档
                        var image = self.getPdfImage(result);
                        $("#attrIframe").append(image)
                        $("#attrIframe").css({ overflowY: "auto", position: "relative" })
                    } else {//ppt
                        var iframe = self.frameOnload(result, obj);
                        $("#attrIframe").append(iframe)
                    }
                    self.setHeight();
                    $("#loadingStatus").remove();
                    if (self.unzippath) {
                        $(".attr-select").remove();
                    }
                }

            }, function (result1) {
                $("#previewContent").html('<div class="contentHeight"></div>');
                $("#loadingStatus").html(result1);
                var height = $(window).height();
                $(".contentHeight").height(height - 73);
                top.BH("preview_load_error");
            });
        },
        template: function (result) {
            var imgurl = result["navList"];
            var arrImg = [];
            var len = imgurl.length;
            this.model.set({ pptLen: len });
            //var part = getCookie("cookiepartid");
            var obj1 = domainList[1];
            for (var i = 0; i < len; i++) {
                var current = i == 0 ? "on" : "";
                var obj = { image: obj1.rebuildDomain +"/opes/" + imgurl[i]["thumbnail"], current: current };
                arrImg.push(obj);
            }
            var tableArr = [{}]
            var str = $("#pptTemplate").val();
            var rp = new Repeater(str);
            var html = rp.DataBind(tableArr); //数据源绑定后即直接生成dom
            $("#previewContent").html(html);
            this.getPage(imgurl);
            var str1 = $("#pptImageTemplate").val();
            var rp1 = new Repeater(str1);
            var html1 = rp1.DataBind(arrImg); //数据源绑定后即直接生成dom
            $("#pdfSiderInner").html(html1)
        },
        getPage: function (imgurl) {
            var len = imgurl.length;
            var arrPage = [];
            var str = $("#pptPageSelect").val();
            var rp = new Repeater(str);
            for (var i = 0; i < len; i++) {
                var obj = { totalPage: len, currentPage: imgurl[i]["index"] };
                arrPage.push(obj);
            }
            var currentPage = this.model.get("currentPage");
            var html = rp.DataBind(arrPage); //数据源绑定后即直接生成dom
            $("#pagerSelect").html(html)
        }
    }));

})(jQuery, _, M139);