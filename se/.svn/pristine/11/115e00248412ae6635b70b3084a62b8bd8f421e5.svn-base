



(function (jQuery, _, M139) {
    
    var $=jQuery;
var superClass = M139.View.ViewBase;
    //todo newclass clone
    M139.namespace('M2012.Service.OnlinePreview.Xls.View', superClass.extend({

        /**
        *@lends M2012.ReadMail.View.prototype
        */
        initialize: function () {
            this.initEvents();
            this.mainView = new M2012.Service.OnlinePreview.View();
            this.model = new M2012.Service.OnlinePreview.Model();
            this.unzippath = $T.Url.queryString("unzippath");
            return superClass.prototype.initialize.apply(this, arguments);
        },
        render: function (obj) {
            var self = this;
            console.log("xls")
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
            console.log(options)
            if (this.unzippath) {//是否从压缩包里的附件打开，压缩包里的附件打开要传一个额外的压缩包路径unzippath
                options.unzippath = this.unzippath;
            }
            this.mainView.appendHeaderHtml(obj);
            this.getData(options, obj);
        },
        initEvents: function () {
            var self = this;
            this.resize();
        },
        setHeight: function () {
            var self = this;
            var height = $(window).height();
            var hasTips = $(".tipBox").length > 0 ? true : false;
            height = hasTips ? height - 109 : height - 78;
            $(".contentHeight").height(height);
        },
        createiframe: function (result) {
            var iframe = document.createElement("iframe");
            iframe.id = "attrIframe";
            iframe.className = "contentHeight";
            iframe.width = "100%";
            iframe.frameBorder = "no";
            var obj = domainList[1];
            iframe.src =obj.rebuildDomain + "/opes/" + result.chgurl;
            return iframe;
        },
        frameOnload: function (result, obj) {
            var iframe = this.createiframe(result);
            $(iframe).load(function () {
                $("#loadingStatus").remove();
            });
            return iframe
        },
        resize: function () {//改变窗口大小
            var self = this;
            $(window).resize(function () {
                self.setHeight();
            });
        },
        getData: function (options, obj) {
            var self = this;
            this.model.getData(options, function (result) {
                self.model.set({ initData: obj, dataSource: result })
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
                    var iframe = self.frameOnload(result, obj);
                    $("#attrIframe").append(iframe)
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
            var tableArr = [{}];
            var str = $("#xlsTemplate").val();
            var rp = new Repeater(str);
            var html = rp.DataBind(tableArr); //数据源绑定后即直接生成dom
            $("#previewContent").html(html);
        }
    }));

})(jQuery, _, M139);