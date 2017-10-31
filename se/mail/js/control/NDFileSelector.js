/***
 * @description 文件与文件夹选择目录树
 * @auth tangl
 */
;
(function ($) {
    var NDFileSelector = function (obj) {
        var p = this;
        //var window = window;
        //
        if (window.gMain && gMain.urlCloudp) {

            if (gMain.urlCloudp.charAt(0) != "/") {
                gMain.urlCloudp = "/" + gMain.urlCloudp;
            }
        }

        /**初始化参数**/
        p.id = obj.id || "NDFileSelector_common";
        p.title = obj.title || Lang.Mail.ConfigJs.cmulu;
        p.type = obj.type || NDFileSelector.type.folder;
        p.data = obj.data || [];
        p.notFidList = obj.notFidList;
        p.diskType = obj.diskType || 0;
        p.loadType = obj.loadType || NDFileSelector.loadType.one;
        //p.okCall = obj.okCall;
        p.cancelCall = obj.cancelCall;
        p.width = obj.width || 0;
        p.attachUrl = obj.attachUrl;
        p.fileSize = obj.fileSize;
        p.attachName = obj.attachName || "";

        //p.defaultD

        /***常量***/
        p.dircss = {de: "tree-folder", on: "tree-folder-on"};//目录样式
        p.diricocss = {de: "i-nav-off", on: "i-nav-on", kong: "i-nav-kong"};


        /***变量(动态属性也定义)***/
        p.selectedFid = "-1";

        //ajax请求参数

        p.postData = obj.postData || {
            select: {
                url: gMain.urlCloudp + gConst.netDiskUrl_fileSearch,//gConst.ajaxPostUrl.list,
                func: gConst.func.diskSearch,
                data: {
                    diskType: 1,
                    status: 1,
                    fileType: "1",
                    parentId: "-1"
                }
            },
            add: {
                url: gMain.urlCloudp + gConst.netDiskUrl_addFile,
                data: {
                    parentId: "-1",
                    fileName: "",
                    diskType: 1,
                    comeFrom: 0
                }
            }
        };
        p.childData = [];
        p.varData = [];

        p.init();
    };
    NDFileSelector.loadType = {
        all: "all",
        one: "one"
    };
    NDFileSelector.type = {
        file: "file",
        folder: "folder"
    };
    NDFileSelector.prototype = {
        init: function () {
            var p = this;

            //通过属性判断是否有数据（是否请求过数据）
            if (p.data.length == 0) {
                var callback = function () {
                    p.show();
                }
                p.initData(callback);
            }
        },
        initData: function (callback) {
            var p = this;
            var func = p.postData.select.func;
            var data = p.postData.select.data;
            var url = p.postData.select.url;
            var call = function (d) {
                if (d.code == "S_OK") {
                    if (p.loadType == NDFileSelector.loadType.one) {
                        if (d["var"] && d["var"].resultList) {
                            p.childData = d["var"].resultList;

                            //默认第一个文件夹选中
                            if (d["var"].resultList[0] && d["var"].resultList[0].appFileId) {
                                p.selectedFid = d["var"].resultList[0].appFileId;
                            }

                            if (d["var"].resultList[0] && d["var"].resultList[0].fileName) {
                                p.selectedName = d["var"].resultList[0].fileName;
                            }
                        }

                    }
                    else
                        p.data = d["var"].resultList;
                    p.varData = d["var"];  //把得到的总数据保存下来
                    callback();
                } else {
                    p.childData = [];
                    p.data = [];
                }
            };
            var failcallback = function () {
            };

            //请求网盘文件夹的数据
            p.ajax(url, func, data, call, failcallback);
        },
        ajax: function (url, func, data, callback, failcallback) {
            /*jQuery.ajax({
             data:data,
             url:url+"?func="+func+"&sid="+gMain.sid,
             type:"post",
             dataType:"JSON",
             //contentType: "application/json; charset=utf-8",
             beforeSend: function(x) {
             x.setRequestHeader("Content-Type", "application/json; charset=utf-8");
             },

             success:function(data)
             {
             callback(data);
             }
             })*/
            parent.MM.doService({
                absUrl: url,
                func: func,
                data: data,
                failCall: failcallback,
                call: callback,
                param: ""
            });
        },
        /**
         * 得到树形结构的入口，根据[异步|同步]再调用不同的方法
         */
        getTreeHTML: function () {
            var p = this;
            if (p.loadType == NDFileSelector.loadType.one)
                return p.getOneLoad();
            else
                return p.getAllLoad();
        },
        getRowLiHTML: function (data, isSelected) {
            var html = [];
            var p = this;
            if (!p.notFidList || p.notFidList.length == 0 || !p.notFidList.has(data.appFileId)) {
                var formatStr = data.fileName;
                formatStr = formatStr.length > 15 ? formatStr.substr(0, 14) + "..." : formatStr;
                var dircss = data.haveSub == "1" ? p.diricocss.de : p.diricocss.kong;
                html.push("<li id='ff_li_" + data.appFileId + "'><div id='ff_div_" + data.appFileId + "'>");
                html.push("<a href=\"javascript:fGoto();\"><i class=\"" + dircss + "\"></i></a>");
                html.push("<i class=\"i-tx-sfile mr_5\"></i>");
                html.push("<span class=\"" + (isSelected ? p.dircss.on : p.dircss.de) + "\" title='" + data.fileName + "'>" + formatStr + "</span>");
                html.push("</div><ul></ul></li>");
                if (isSelected) p.selectedFid = data.appFileId;
            }
            return html.join("");
        },
        getOneLoad: function (flag, fid) {
            var p = this;
            var html = [];
            //if(p.childData && p.childData.length > 0){
            html.push("<div class=\"select-tx\" id=\"" + p.id + "\" style='height:300px;overflow-y:auto;'>");
            html.push("<ul class=\"select-tx-ul\">");
            //返回的数据用 p.varData保存起来了，所有在其他的方法都可以调用
            if (p.diskType == 2) {
                var fData = {
                    appFileId: p.varData.groupId,
                    fileName: p.varData.groupName,
                    haveSub: p.varData.resultList.length > 0 ? "1" : ""
                }
                html.push(p.getRowLiHTML(fData, true));
            }
            else {
                var lihtml = [];
                for (var i = 0; i < p.childData.length; i++) {
                    var data = p.childData[i], li, isSelect = false;
                    //异步不用递归，只有加载这一级的每一个li
                    if (flag && data.appFileId === fid) isSelect = true;
                    li = p.getRowLiHTML(data, true);
                    html.push(li);
                    lihtml.push(li);
                }
                if (flag) return lihtml.join("");
            }
            html.push("</ul>");
            html.push("</div>");
            //}
            return html.join("");
        },
        getAllLoad: function () {

        },
        okCall: function () {
            var p = this;
            var data = {
                "parentId": p.selectedFid, 		 //网盘文件的id
                "fileName": p.attachName,    	 //附件名
                "diskType": 1,					 //都传一
                "fileUrl": p.attachUrl,					 //要找到这个附近的下载地址  后台获取这个路径在去下载这个附件到网盘中
                "userId": gMain.mailId,			     //登陆名 如：admin
                "fileSize": p.fileSize   			 //附近的大小
            };

            var func = gConst.func.netDisk_attachUpload;
            var url = gMain.urlCloudp + gConst.netDiskUrl_addFile;
            var call = function () {
                CC.showMsg(Lang.Mail.ConfigJs.savedToDisk, true, false, "option");
            };
            var failcallback = function () {
                CC.showMsg(Lang.Mail.ConfigJs.saveToDiskFail, true, false, "error");
            };

            CC.showMsg("附件正在存网盘，", true, false, "loadding");

            //保存到网盘
            p.ajax(url, func, data, call, failcallback);
        },
        show: function () {
            var p = this;
            var title = p.title;
            var html = p.getTreeHTML();

            var bottomList = [
                {
                    text: Lang.Mail.ConfigJs.newFolder, //"新建文件夹",
                    "class": "n_btn  mt_5 ml_10 fl",
                    clickEvent: function () {
                        p.createFolder();
                        return true;
                    }
                }
            ];

            //一个树弹出来很简单，只有把树形的html作为第一个参数传入到CC.showDiv方法中
            CC.showDiv(html, function () {
                p.okCall(p.selectedFid);
            }, title, p.cancelCall, "", p.width, bottomList);

            //show以后再绑定事件（异步的每次都要绑定一次）
            p.addEvent();
        },

        /**
         * 新建一个网盘文件，（邮箱中，暂没有这个功能）
         */
        createFolder: function () {
            var p = this;
            $("#" + p.id + "_cf").remove();
            var html = [];
            html.push("<li id='" + p.id + "_cf'>");
            html.push("<div>");
            html.push("<i class=\"i-nav-kong\"></i>");
            html.push("<i class=\"i-tx-sfile mr_5\"></i>");
            html.push("<input id='" + p.id + "_cf_txt' type=\"text\" class=\"select-tx-txt w75\" maxlength=\"50\">");
            html.push("<a id='" + p.id + "_cf_ok' class=\"ml_5\" href=\"javascript:fGoto();\"><i class=\"i-tx-yes\"></i></a>");
            html.push("<a id='" + p.id + "_cf_no' class=\"ml_5\" href=\"javascript:fGoto();\"><i class=\"i-tx-no\"></i></a>");
            html.push("</div>");
            html.push("</li>");

            //标签名+class找元素
            $("span[class='" + p.dircss.on + "']").parent().next().removeClass('hide').append(html.join(""));
            $("#" + p.id + "_cf_txt").focus().select();
            $("#" + p.id + "_cf_ok").click(function () {
                var txt = $("#" + p.id + "_cf_txt").val();
                if (!txt) {
                    CC.alert(Lang.Mail.ConfigJs.folderEmpty);//"文件夹名称不能为空"
                    return;
                }

                //判断特殊字符
                if (!txt.checkSpecialChar()) {
                    CC.alert("文件夹名称不能包含特殊字符");
                    return;
                }


                var func = "common:createFolder";
                var parentli = $(this).parent().parent().parent().parent();
                var parentul = $(this).parent().parent().parent();
                var pFid = parentli.attr("id");
                pFid = pFid.substr(pFid.lastIndexOf("_") + 1);

                p.postData.add.data.parentId = pFid;
                p.postData.add.data.fileName = txt;
                var data = p.postData.add.data;
                var url = p.postData.add.url;
                var call = function (data) {
                    if (data.code = "S_OK") {
                        CC.showMsg("新建文件夹成功", true, false, "option");
                        p.initData(function () {
                            parentul.html(p.getFolderChildHTML());
                            p.addEvent();
                        });
                        //
//                        var htmlstr = p.getRowLiHTML({appFileId: data["var"], fileName: txt});
//                        parentul.append(htmlstr);
//                        p.addEvent();
                        //gMain.refreshList();
                    }
                }
                var failcallback = function () {
                };

                p.ajax(url, func, data, call, failcallback);
            });
            $("#" + p.id + "_cf_no").click(function () {
                $("#" + p.id + "_cf").remove();
            });
        },
        getFolderChildHTML: function () {
            var p = this;
            var html = [];
            if (p.childData && p.childData.length > 0) {
                for (var i = 0; i < p.childData.length; i++) {
                    var data = p.childData[i];
                    html.push(p.getRowLiHTML(data));
                }
            }
            return html.join("");
        },
        getSelectedFid: function () {
            return p.selectedFid;
        },
        getSelectedItem: function () {
            var p = this;
            var relItem = {};
            if (p.loadType == NDFileSelector.loadType.one) {
                for (var i = 0; i < p.childData.length; i++) {
                    var item = p.childData[i];
                    if (item.appFileId == p.selectedFid) {
                        relItem = item;
                        break;
                    }
                }
            }
            return relItem;
        },
        /**
         * 初始化事件
         */
        addEvent: function () {
            var p = this;
            //p.id 整个树的id
            $("#" + p.id).find("div[id]").each(function () {
                var obj = this;
                obj.onclick = function () {
                    //把以前背景不选中
                    $("#" + p.id).find("span[class='" + p.dircss.on + "']").attr("class", "tree-folder");

                    //把现在的点击的div的最后一个span背景选中
                    $(obj).children().last().attr("class", p.dircss.on);
                    var childUl = $(obj).next();

                    //如何当前div下有ul，根据ul当前的class,来显示隐藏，同时改变 小图标
                    if (childUl.children().length > 0) {
                        //如果有类名
                        if (childUl.attr("class")) {
                            childUl.removeClass("hide");
                            $(obj).find("a i").attr("class", p.diricocss.on);
                        }
                        else {
                            childUl.addClass("hide");
                            $(obj).find("a i").attr("class", p.diricocss.de);
                        }
                    }

                    //这个事件是 去请求children的数据，然后把它放到这个div后面，而且 绑定事件
                    p.onClickLi(obj);
                };
            });
        },
        onClickLi: function (obj) {
            var p = this;
            //fid: ff_div_1234567 要截取1234567 (也可能是123_45_67)
            var fid = obj.id.substr(7);
            p.selectedFid = fid;
            p.selectedName = $(obj).find("span").text();
            if (p.loadType == NDFileSelector.loadType.one) {
                p.postData.select.data.parentId = fid;

                //如果这个Li没有子节点，而且不是最后一个节点，才去请求
                if ($(obj).parent().find("li").length == 0 && $(obj).find("." + p.diricocss.kong).length == 0) {
                    p.initData(function () {
                        $(obj).next().html("");
                        var html = p.getFolderChildHTML();
                        if (html) {
                            //把它放到这个div后面，而且 绑定事件
                            $(obj).find("a i").attr("class", p.diricocss.on);
                            $(obj).next().append(html);
                            p.addEvent();
                        }
                    });
                }

            }
        }

    }
    window.NDFileSelector = NDFileSelector;
})(jQuery);