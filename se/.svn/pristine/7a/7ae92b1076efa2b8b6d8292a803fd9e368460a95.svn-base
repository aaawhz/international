/**   
* @fileOverview 普通模式读信
*/
(function (jQuery, _, M139) {

    var $=jQuery;
    $User = {
        getUid: function () {
            var mo = $T.Url.queryString("mo");
            mo = M139.Text.Mobile.add86(mo)
            return mo;
        }
    }
    /**
    *@namespace 
    *普通模式读信
    */

    M139.namespace("M2012.Service.OnlinePreview.Model", Backbone.Model.extend({

        defaults: {
            initData: null,
            isLoad: false, //是否已加载，resize时不再加载
            hasTips: true,
            dataSource: null,
            sid: $T.Url.queryString("sid"),
            mobile: $T.Url.queryString("mo"),
            loginName: $T.Url.queryString("loginName"),
            mid: $T.Url.queryString("mid"),
            nav: [],
            currentPage: 1,
            pptLen: 0,
            opes: $T.Url.getAbsoluteUrl("/mw2/opes/"),
            unzippath: $T.Url.queryString("unzippath"),
            comefrom: "",
            timeout: false//附件加载超时
        },
        message: {
            relogin: "您已经退出邮箱，请重新<a href='http://mail.10086.cn' target='_blank'>登录</a>"
        },
        windowOpener: function (preventName) {
            var obj = window.opener;
            var res = {};
            top["preventName"] = obj[preventName];
        },
        callApi: M139.RichMail.API.call,
        timeOut: function (filedownurl) {
            var self = this;
            var num = 0;
            var t = setInterval(function () {
                num++;
                if (self.get("timeout")) {
                    clearInterval(t);
                }
                if (num > 60) {
                    var obj = {
                        dl: filedownurl
                    }
                    var mainView = new M2012.Service.OnlinePreview.View();
                    var html = mainView.loadingErrorHtml(obj);
                    $("#loadingStatus").html(html);
                    clearInterval(t);
                }
            }, 1000)
        },
        getData: function (options, callback, callback1) {
            var self = this;
            var src = options.url; //"/mw/opes/preview.do?";
            var filedownurl = decodeURIComponent(options.filedownurl);
			if(location.protocol=="https:"){
				filedownurl = decodeURIComponent(filedownurl);
				filedownurl = filedownurl.replace("https:","http:");
				filedownurl = encodeURIComponent(filedownurl)
			}
            var data = {
                account: options.account,
                fileid: options.fileid,
                browsetype: options.browsetype,
                filedownurl: filedownurl,
                filename: options.filename,
                unzipPath: options.unzippath,
                comefrom: options.comefrom,
                sid: options.sid,
                longHTTP: "true"
            }
			
            self.timeOut(filedownurl);
            this.callApi(src, data, function (result) {
                self.set({ timeout: true })
                callback(result.responseData)
            }, {
                error: function () {
                    if (callback1) {
                        var obj = {
                            dl: filedownurl
                        }
                        var mainView = new M2012.Service.OnlinePreview.View();
                        var html = mainView.loadingErrorHtml(obj);
                        callback1(html);
                    }
                }
            })
        },


        /**
        * 附件格式验证
        */
        checkFile: function (fileName) {
            var reg = /\.(?:doc|docx|xls|xlsx|ppt|pptx|pdf|txt|jpg|jpeg|jpe|jfif|gif|png|bmp|tif|tiff|ico|)$/i;
            var reg2 = /\.(?:rar|zip|7z)$/i;
            if (reg.test(fileName)) {
                return 1;
            } else if (reg2.test(fileName)) {
                return 2;
            } else {
                return -1;
            }
        },
        checkFileType: function (filename) {//验证返回具体的后缀名
            var num1 = filename.lastIndexOf(".");
            var num2 = filename.length;
            var file = filename.substring(num1 + 1, num2).toLowerCase(); //后缀名  
            switch (file) {
                case "ppt":
                case "pptx":
                    return "ppt";
                case "txt":
                case "html":
                case "htm":
                    return "html";
                case "rar":
                case "zip":
                case "7z":
                    return "rar";
                case "xls":
                case "xlsx":
                    return "xls";
                case "doc":
                case "docx":
                    return "doc";
                case "pdf":
                    return "pdf";
            }
            return ""
        },/*
        checkFile1: function (fileName) {
            var type = /(?:\.ppt|\.pptx)$/i.test(fileName); //如果是ppt pptx pdf文件
            return type
        },
        checkFile2: function (fileName) {
            var type = /(?:\.txt|.html|.htm)$/i.test(fileName); //如果是 txt 文件
            return type
        },
        checkFile3: function (fileName) {
            var type = /(?:\.rar|\.zip|\.7z)$/i.test(fileName); //如果是 rar zip 7z文件
            return type
        },
        checkFile4: function (fileName) {
            var type = /(?:\.xls|\.xlsx)$/i.test(fileName); //如果是xls文件
            return type
        },
        checkFile5: function (fileName) {
            var type = /(?:\.doc|\.docx)$/i.test(fileName); //如果是 doc文件
            return type
        },
        checkFile6: function (fileName) {
            var type = /(?:\.pdf)$/i.test(fileName); //如果是ppt pptx pdf文件
            return type
        },*/
        getPreViewUrl: function (file, initData) {//附件的下载地址
            var ssoSid = this.get("sid");
            var url = window.location.protocol + '://' + location.host + "/RmWeb/view.do";
            return M139.Text.Url.makeUrl(url, {
                func: 'attach:download',
                mid: initData.id,
                offset: file.fileOffSet,
                size: file.fileSize,
                sid: ssoSid,
                type: file.attachType || file.type,
                encoding: file.encode || file.encoding
            }) + '&name=' + encodeURIComponent(file.fileName);

        },
        //http://rm.mail.10086ts.cn/RmWeb/view.do?func=attach:getAttach&amp;sid=MTM1OTQyMTQzMDAwMTk1Mjk3OTk0OQAA000001&amp;fileId=01377621135112qhd4qr560s&amp;fileName=Windows8应用商店应用_-_企业开发者账号申请流程.doc
        getPreViewUrlForCompose: function (file) {//附件的下载地址
            var ssoSid = this.get("sid");
            var url = window.location.protocol+'://' + location.host + "/RmWeb/view.do";
            return M139.Text.Url.makeUrl(url, {
                func: 'attach:getAttach',
                fileName: file.fileName,
                fileId: file.fileId,
                sid: ssoSid
            });

        },
        /**
        * 获取其他附件url
        * @param {object} p 附件属性
        */
        getUrl: function (p) {
            var ucDomain = domainList[1].webmail;
            var uid = this.get("mobile");
            var loginName = this.get("loginName");
            var ssoSid = this.get("sid");
            var skinPath = "skin_green";
            var rmResourcePath = location.host + "/se";
            var diskInterface = domainList.global.diskInterface;
            var disk = domainList.global.disk;
            var previewUrl = ucDomain+"/se/mail/preview.do?fi={fileName}&mo={uid}&dl={downloadUrl}&sid={sid}&id={contextId}&rnd={rnd}&src={type}&loginName={loginName}&comefrom={comefrom}&composeId={composeId}";
            previewUrl += "&skin={skin}";
            previewUrl += "&resourcePath={resourcePath}";
            previewUrl += "&diskservice={diskService}";
            previewUrl += "&filesize={fileSize}";
            previewUrl += "&disk={disk}";
            previewUrl = $T.Utils.format(previewUrl, {
                uid: uid,
                sid: ssoSid,
                rnd: Math.random(),
                skin: skinPath,
                resourcePath: encodeURIComponent(rmResourcePath),
                diskService: encodeURIComponent(diskInterface),
                type: p.type || "attach",
                fileName: encodeURIComponent(p.fileName),
                downloadUrl: encodeURIComponent(p.downloadUrl),
                contextId: p.contextId || "",
                fileSize: p.fileSize || "",
                encoding: 1,
                disk: disk,
                comefrom: p.comefrom || "readmail",
                loginName: loginName,
                composeId: p.composeId || ""
            });
            return previewUrl;
        },
        getAttach: function (callback) {//读信页获取所有附件列表
            var self = this;
            var initData = this.get('initData');
            var data = {
                fid: initData.fid,
                mid: initData.id,
                autoName: 1, //有些附件会没有文件名，此属性自动命名附件
                markRead: 1,
                returnHeaders: { Sender: "", "X-RICHINFO": "" }, //为订阅平台增加参数
                filterStylesheets: 0,
                filterImages: 0,
                filterLinks: 0,
                keepWellFormed: 0,
                header: 1,
                supportTNEF: 1,
                returnAntispamInfo: 1
            };
            $RM.readMail(data, function (result) {
                if (result && result.code && result.code == 'S_OK') {
                    callback && callback(result["var"]);
                }
            });
        },
        getAttachForCompose: function (callback) { //写信页获取所有附件列表
            var self = this;
            var initData = this.get('initData');
            var data = {
                id: initData.composeId
            };
            this.callApi("attach:refresh", data, function (result) {
                result = result.responseData;
                if (result.code && result.code == 'S_OK') {
                    callback && callback(result["var"]);
                }
            })
        }



    }));

})(jQuery, _, M139);
