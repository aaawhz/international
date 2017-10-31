/*
initialize


    this.model = new Backbone.Model();
    


  initEvents:function(){
      var self = this
      this.model.on("change:currentImage",function(){
            //大图赋值
      })
      this.model.on("change:currentImage",function(){
            //缩略图高亮边框
            this.focusThumb();
      })
      this.model.on("change:currentImage",function(){
            //缩略图容器 偏移量计算
      })
      
      this.model.on("change:currentImage",function(){
            //上一张 下一张 按钮隐藏
      })
  }
*/



(function (jQuery, _, M139) {
    
    var $=jQuery;
var superClass = M139.View.ViewBase;



    M139.namespace('M2012.OnlinePreview.FocusImages.View', superClass.extend({

        /**
        *@lends M2012.ReadMail.View.prototype
        */
        initialize: function (data) {
            this.picWidth = null;
            this.autoPlayStatus = false;
            this.isRotate = false; //默认为非旋转状态 用于计算图片宽高时的判断todo水平垂直
            this.picHeight = null;
            this.bigImg = null;
            this.imageSize = 0; //图片缩放，默认为原始大小
            this.fullScreen = false; //是否全屏状态
            this.moveStatus = false;
            this.rotateNum = 0;
            this.rotateNumIE = 0;
            this.rotateDeg = 0;
            this.smallImgDisplay = false;
            this.model = new M2012.OnlinePreview.FocusImages.Model();
            return superClass.prototype.initialize.apply(this, arguments);
        },
        render: function (obj,denyForward) {
           
            $("#jonMark img",top.document).remove();
            $("#pagerSelect",top.document).hide();
            this.model.set({ currentImg: obj.num });
            var self = this;
            this.images = obj["data"];
            var len = this.images.length;


            this.imgLen = len;

            var imgList = {};
            var num = obj.num;
            try {
                this.bigImg = this.images[num].downLoad;
                this.bigName = this.images[num].fileName;
            } catch (e) { };
            self.insertHtml(len, num, obj,denyForward); //插入弹出层
            self.imageLoadedSuccess(); //判断大图是否加载
            self.resize();
            self.setCurrentSmallImg(len, num); //获取当前显示的缩略图，放在第三张的位置
            self.imageRotate(); //图片旋转
            self.closeImagesEvents(); //关闭幻灯片的事件
            self.initEvents(obj);
            self.eventKeyCode(obj);
          


        },
        smallImageLoadError: function () {
            $("#smallPicLlist img,.full-screen-img",top.document).error(function () {
																				  var res ="";
if(parent.gMain)
			{
				res = parent.gMain.resourceRoot;
			}
			else
				res = domainList[1].resource+"/se";
                $(this,top.document).attr("src", res+"/images/global/nopic.jpg");
            })
        },
        getSmallImage: function (len, num, data) {
            var images = this.images;
            var self = this;
            var display = "";
            var hideClass = "";
            var li = "";
            for (var i = 0; i < len; i++) {
                var className = "";
                if (i == num) {
                    className = "on"
                }
                li += '<li class="' + className + '"><a href="javascript:;"><img width="72" height="72" src="' + images[i].imgUrl + '" alt=""/></a></li>';
                if (images[i].imgUrl == "") {
                    display = "none";
                    this.smallImgDisplay = true;
                } else {
                    this.smallImgDisplay = false;
                    display = "";
                }
            }
            if (len == 1) {
                hideClass = "hide";
            }
            var obj = {
                li: li,
                display: display,
                hideClass: hideClass
            }
            return obj;
        },
        insertHtml: function (len, num, data,denyForward) {//获取数据构建弹出层html 
            var self = this;
            var images = this.images;
            var obj = this.getSmallImage(len, num, data);
            var li = obj.li;
            var display = obj.display;
            var html = $T.Utils.format(this.template(denyForward), {
                imgList: li,
                bigImage: self.bigImg,
                fileName: images[num].fileName,
                currentImg: this.model.get("currentImg") + 1,
                imgNum: this.imgLen,
                smallImgDisplay: display,
                hideClass: obj.hideClass
            });
            $("body",top.document).append(html);
            //$("#focusImages",top.document).focus();
            this.smallImageLoadError();
            self.fullScreenView(data); //全屏状态
        },
        normalScreenView: function (data) {//切换到普通状态
            var self = this;
            $("#normalScreen",top.document).click(function () {
                var id = $("#focusImages",top.document);
                self.fullScreen = false;
                $("#fullScreenMode",top.document).addClass("hide");
                $("#focusImages",top.document).removeClass("hide");
            });
        },
        fullScreenView: function (data) {//切换到全屏状态
            var self = this;
            $("#fullScreen",top.document).click(function () {
                self.imageSize = 0;
                var currentImg = self.model.get("currentImg");
                var id = $("#fullScreenMode",top.document);
                self.fullScreen = true;
                $("#jonMark img",top.document).remove();
                $("#focusImages",top.document).addClass("hide");
                $("#fullScreenMode",top.document).removeClass("hide").find("img").attr("src", self.images[currentImg].downLoad);
                self.smallImageLoadError();
                $("#fullScreenMode",top.document).find("h3").html(self.images[currentImg].fileName);
                $("#fullScreenMode",top.document).find("img").css({ width: self.picWidth, height: self.picHeight, marginLeft: -self.picWidth / 2, marginTop: -self.picHeight / 2 });


                self.normalScreenView(data);
                self.imgDrag(); //鼠标拖动
            });
        },
        setImageWH: function (img, html, images) {//设置大图的宽高
            var self = this;
            $("#picShow img",top.document).remove();
            $("#picShow",top.document).append(images);
            $("#picName",top.document).html(self.bigName);
            self.picWidth = img.width;
            self.picHeight = img.height;
            self.getBigImageWH(self.picWidth, self.picHeight, 0, function (w, h) {
                $("#bigImage",top.document).css({ width: w, height: h })
            });
        },
        imgLoad: function (url, callback) {//判断图片是否加载完成
            var self = this;
			var res ="";
			if(parent.gMain)
			{
				res = parent.gMain.resourceRoot;
			}
			else
				res = domainList[1].resource+"/se";
            var html = '<img class="photo" src="'+res+'/images/module/attr/loading.gif"/>'; //loading状态
            var img = new Image();
            img.src = url;
            var images = '<img class="photo" id="bigImage" src="' + img.src + '"/>';
            $(images,top.document).error(function () {
                img.width = 58;
                img.height = 58;
				
                images = '<img class="photo" src="'+res+'/images/global/nopic.jpg"/>';
                self.setImageWH(img, html, images);
            })
            if (img.complete) {
                callback(img.width, img.height);
            } else {
                img.onload = function () {
                    callback(img.width, img.height);
                    img.onload = null;
                };
            };
        },
        imageLoadedSuccess: function () {//图片加载成功后的操作
            var self = this;
			var res ="";
			if(parent.gMain)
			{
				res = parent.gMain.resourceRoot;
			}
			else
				res = domainList[1].resource+"/se";
            var html = '<img class="photo" src="'+res+'/images/module/attr/loading.gif"/>'; //loading状态
            this.isRotate = true;
            self.rotateNum = 0;
            self.rotateNumIE = 0;
            $("#picShow img",top.document).remove();
            $("#picShow",top.document).append(html);
            self.setCssStyle();
            self.imgLoad(self.bigImg, function (width, height) {
                var images = '<img class="photo" id="bigImage" src="' + self.bigImg + '"/>';
                var obj = {
                    width: width,
                    height: height
                }
                $("#imgDownload",top.document).attr("href", self.bigImg);
                self.setImageWH(obj, html, images);
            });
        },
        setCurrentSmallImg: function (len, num) {//设置当前缩略图的位置
            var max = this.model.get("imgNum");
            var num1 = parseInt(max / 2);
            var num2 = Math.ceil(max / 2);
            var boxW = this.model.get("imgOffsetWidth");
            var smallPicLlist = $("#smallPicLlist",top.document);
            var left = "0";
            if (num == 0) {
                $("#focusImages .scrollLeft i",top.document).addClass("unable");
            }
            if (num == len - 1) {
                $("#focusImages .scrollRight i",top.document).addClass("unable");
            }
            if (len > max) {//图片数量大于5个时
                if (num > num1) {
                    if (num < len - num1) {
                        left = -(num - num1) * boxW;
                    } else {
                        left = -(num - num1 - (num2 - (len - num))) * boxW;
                    }
                }
            }
            this.marginLeft = left; //设置初始的margin-left
            smallPicLlist.animate({ marginLeft: left + "px" }, { queue: false, duration: 500 })

        },
        getBigImageWH: function (picWidth, picHeight, num, callback) {
            var picShowHeight = self.picShowHeight; //大图的实际高度
            var picShowWidth = self.picShowWidth; //大图的实际宽度
            var imgWidth = "auto";
            var imgHeight = "auto";
            var imgObj = $("#bigImage",top.document);
            if (picWidth >= picShowWidth && picHeight <= picShowHeight) {//图片宽度大于外层容器时  图片宽度=外层容器
                imgWidth = picShowWidth + "px";
            }
            if (picWidth <= picShowWidth && picHeight >= picShowHeight) {//图片高度大于外层容器时  图片高度=外高容器
                imgHeight = picShowHeight + "px";
            }
            if (picWidth >= picShowWidth && picHeight >= picShowHeight) {
                if (picWidth > picHeight) {
                    imgWidth = picShowWidth + "px";
                } else {
                    imgHeight = picShowHeight + "px";
                }
            }
            var w = imgWidth;
            var h = imgHeight;
            if (num % 2 != 0) {
                w = imgHeight;
                h = imgWidth;
            }
            if (!this.isRotate) {//非旋转状态下，计算图片宽高
                if (w = h = "auto") {//不满足以上判断，设置图片的大小为原始大小
                    w = picWidth + "px";
                };
            };
            if (callback) { callback(w, h) }
        },
        setCssStyle: function () {
            var picConsoleWrap = $("#picConsoleWrap",top.document); //缩略图
            var smallPicBoxWrap = $("#smallPicBoxWrap",top.document); //工具条
            var focusImages = $("#focusImages",top.document);
            var picBox = $("#picBox",top.document); //大图+文字显示的区域
            var picShow = $("#picShow",top.document); //大图显示的区域
            var picConsoleHeight = picConsoleWrap.height(); //缩略图的高度
			if(picConsoleHeight==0){
				picConsoleHeight=38;
			}
            if (this.smallImgDisplay == true) {
                picConsoleHeight = 0;
                picConsoleWrap.css({ bottom: "55px" })
            }
            var smallPicHeight = smallPicBoxWrap.height(); //工具条的高度
			if(smallPicHeight==0){
				smallPicHeight=88
			}
            var bodyHeight = $("body",top.document).height(); //body的高度
            var bodyWidth = $("body",top.document).width(); //body的宽度
            var picShowHeight = 372; //大图的实际高度
            var picShowWidth = 350; //大图的实际宽度
            var showBigPicHeight = bodyHeight - picConsoleHeight - smallPicHeight - 40; //大图可显示的最大高度
            if (showBigPicHeight < 420 && showBigPicHeight >= 210) {//图片+文字的高度小于UI定的固定高度时，减小图片外层DIV的高度适应屏幕大小
                picShowWidth = 350;
                picShowHeight = showBigPicHeight - 65;
            }
            if (showBigPicHeight < 210) {//图片+文字的高度小于210时，不在减小DIV的高度 210的高度可以容纳关闭按钮+左右方向键
                picShowWidth = 350;
                picShowHeight = 160;
            }
            if (showBigPicHeight >= 420) {
                picShowHeight = showBigPicHeight - 65;
                picShowWidth = picShowHeight;
            }
            self.picShowWidth = picShowWidth;
            self.picShowHeight = picShowHeight;
            picShow.css({ height: picShowHeight + "px", width: picShowWidth + "px" })
            $("#picName",top.document).css({ width: picShowWidth + "px" });
            var picBoxHeight = picShowHeight + 40; //大图+文字显示的区域的实际高度
            var picBoxWidth = picShowWidth; //大图+文字显示的区域的实际宽度
            var pictop = (showBigPicHeight - picBoxHeight) / 2;
            var picleft = (bodyWidth - picBoxWidth) / 2;
            pictop = pictop < 0 ? 0 : pictop; //图片距离屏幕的高度为负值时，默认设为0
            picBox.css({ top: pictop + "px", left: picleft + "px" })
        },
        imageRotate: function () {//图片旋转
            var rotate = 0;
            var self = this;
            $("#bigImage",top.document).attr("style", "-webkit-transform:rotate(0deg);-o-transform:rotate(0deg);-moz-transform:rotate(0deg);")
            $("#rotateRight",top.document).click(function () {//顺时针旋转
                self.rotateCommonFn("right");
            });
            $("#rotateLeft",top.document).click(function () {//逆时针旋转
                self.rotateCommonFn("left");
            });
        },
        rotateCommonFn: function (status) {//旋转的共用方法
            var self = this;
            var width = self.picWidth;
            var height = self.picHeight;
            self.isRotate = true; //标记为旋转状态
            if (status == "right") {
                self.rotateNumIE = self.rotateNumIE == 4 ? 0 : self.rotateNumIE; //转完一圈回到初始状态
                self.rotateNum++;
                self.rotateNumIE++;
            } else {
                self.rotateNumIE = self.rotateNumIE == 0 ? 4 : self.rotateNumIE; //转完一圈回到初始状态
                self.rotateNum--;
                self.rotateNumIE--;
            }
            if (self.rotateNumIE % 2 != 0) {
                width = self.picHeight;
                height = self.picWidth;
            }
            self.rotateDeg = self.rotateNum * 90;
            var rotateDeg = "rotate(" + self.rotateDeg + "deg)";
            console.log(rotateDeg)
            $("#bigImage",top.document).attr("style", "-webkit-transform:" + rotateDeg + ";-o-transform:" + rotateDeg + ";-moz-transform:" + rotateDeg + ";filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=" + self.rotateNumIE + ")")
            self.setCssStyle();
            self.getBigImageWH(width, height, self.rotateNumIE, function (w, h) {
                if (w == "auto" && h == "auto") {
                    w = self.picWidth;
                    h = self.picHeight;
                    var percent = parseInt(h) / self.picHeight;
                }
                if (w == "auto" && h != "auto") {
                    var percent = parseInt(h) / self.picHeight;
                    w = self.picWidth * percent;
                }
                if (w != "auto" && h == "auto") {
                    var percent = parseInt(w) / self.picWidth;
                    h = self.picHeight * percent;
                }
                var marginLeft = -parseInt(w) / 2;
                var marginTop = -(self.picHeight * percent) / 2;
                if ($B.is.ie) {
                    if (self.rotateNumIE % 2 != 0) {
                        marginTop = -parseInt(w) / 2;
                        marginLeft = -(self.picHeight * percent) / 2;
                    }
                }
                w = Math.ceil(w);
                self.picHeight = Math.ceil(self.picHeight);
                $("#bigImage",top.document).css({ width: w, height: self.picHeight * percent, top: "50%", left: "50%", position: "absolute", marginTop: marginTop + "px", marginLeft: marginLeft + "px" })
            });

        },
        resize: function () {//不同分辨率下的图片宽高设置
            var self = this;
            $(window,top.document).resize(function () {
                this.isRotate = false;
                self.setCssStyle();
                var width = self.picHeight;
                var height = self.picWidth;
                if (self.rotateNumIE % 2 == 0) {
                    width = self.picWidth;
                    height = self.picHeight;
                }
                self.getBigImageWH(width, height, self.rotateNumIE, function (w, h) {
                    $("#bigImage",top.document).css({ width: w, height: h})
                });
            });
        },
        initEvents: function (data) {//初始化事件
            var self = this;
            this.mousemoveout();
            $("#jonMark",top.document).die().live("click", function () {
                self.close();
            })
            this.imageScroll(data);
            this.autoPlay(data);
            this.closeTips();
            this.mouseWheel(); //鼠标滚轮事件
            this.model.on("change:currentImg", function () {//附件夹入口过来的图片幻灯片 分段加载图片  一次加载50张
                self.appendSmallImg();
            })
            $("#focusImages,#fullScreenMode",top.document).click(function (e) {
                var target = e.target;
                var id = target.id;
                var obj = [
                    { key: "picBox" },
                    { key: "smallPicBoxWrap" },
                    { key: "picConsoleWrap" },
                    { key: "fullScreenImage" },
                    { key: "fullScreenConsole" }
                ]
                var arr = [];
                for (var i = 0; i < obj.length; i++) {
                    var parent = $(target,top.document).parents("#" + obj[i].key);
                    if (parent.length > 0 || id==obj[i].key) {
                        arr.push(i)
                    }
                }
                if (arr.length > 0) {
                } else {
                    self.close();
                }
            });
        },
        appendSmallImg: function () {//分段加载图片 追加缩略图到页面中
            var self = this;
            var currentImg = self.model.get("currentImg");
            var index = self.model.get("loadImageStatus");
            if (self.attachLen) {//是否从附件夹入口进来
                if (currentImg > (50 * index) + 25) {
                    self.model.getImageAttach(function (result) {
                        self.model.set({ loadImageStatus: index + 1 });
                        var len = result.length;
                        var previewImg = [];
                        for (var i = 0; i < len; i++) {
                            var json = result[i];
                            var imgUrl = top.wmsvrPath2 + String.format("/mail?func=mbox:getThumbnail&sid={sid}&mid={mid}&size={size}&offset={offset}&name={name}&type={type}&encoding=1", {
                                sid: top.sid,
                                mid: json.mid,
                                size: json.attachRealSize,
                                offset: json.attachOffset,
                                name: json.attachName,
                                type: json.attachType

                            })
                            var temp = "/view.do?func=attach:download&mid={0}&offset={1}&size={2}&name={3}&encoding={6}&sid={4}&type={5}";
                            temp = top.wmsvrPath2 + temp.format(json.mid, json.attachOffset, json.attachRealSize, encodeURIComponent(json.attachName), top.sid, json.attachType, json.encode);
                            previewImg.push({
                                imgUrl: imgUrl,
                                fileName: json.attachName,
                                downLoad: temp
                            })
                        }
                        var datasource = {
                            data: previewImg
                        }
                        self.images = self.images.concat(previewImg);
                        var obj = self.getSmallImage(len, currentImg, datasource);
                        $("#smallPicLlist",top.document).append(obj.li)
                    })
                }
            }
        },
        mousemoveout: function () {//大图上的鼠标移动事件，移到大图的左侧和右侧，出现对应的上一张和下一张按钮
            var self = this;
            $("#picShow",top.document).mousemove(function (e) {//class todo name
                var currentImg = self.model.get("currentImg");
                var This = $(this,top.document);
                var width = This.width();
                var _x = e.clientX;
                var left = This.offset().left;
                if (_x > left && _x < left + width / 2) {
                    var title = currentImg == 0 ? "已是第一张" : "上一张";
                    $(this,top.document).attr("title", title);
                } else {
                    var title = currentImg == self.imgLen - 1 ? "已是最后一张" : "下一张";
                    $(this,top.document).attr("title", title);
                }
            })
        },
        scrollToLeft: function (obj, data, This) {//向左滚动
            var self = this;
            var currentImg = self.model.get("currentImg");
            var status = $(".scrollLeft i",top.document).hasClass("unable");
            var left = self.marginLeft;
            if (currentImg > 0) {
                if (currentImg < obj.len - obj.num1) {//从倒数第三张缩略图开始移动
                    if (currentImg > obj.num1) {
                        left += obj.imgwidth;
                        $("#smallPicLlist",top.document).animate({ marginLeft: left + "px" }, { queue: false, duration: 500 })
                    }
                }
                if (currentImg < obj.len) {
                    $(".scrollRight i",top.document).removeClass("unable");
                }
                if (currentImg == 1) {
                    $(".scrollLeft i",top.document).addClass("unable");

                }
                $("#currentImgNum",top.document).text(currentImg)
                $("#smallPicLlist li",top.document).removeClass("on");
                $("#smallPicLlist li",top.document).eq(currentImg - 1).addClass("on");
                self.bigImg = this.images[currentImg - 1].downLoad;
                self.bigName = this.images[currentImg - 1].fileName;
                self.imageLoadedSuccess();
                self.marginLeft = left;
                currentImg--;
                self.model.set({ currentImg: currentImg });
            }
        },
        scrollToRight: function (obj, data) {//向右滚动
            var self = this;
            var currentImg = self.model.get("currentImg");
            var status = $(".scrollRight i",top.document).hasClass("unable");
            var left = self.marginLeft;
            if (currentImg < this.imgLen - 1) {

                if (currentImg > obj.num1 - 1) {//从第三张缩略图开始移动
                    if (currentImg < obj.len - obj.num2) {
                        left -= obj.imgwidth;
                        $("#smallPicLlist",top.document).animate({ marginLeft: left + "px" }, { queue: false, duration: 500 })
                    }
                }
                if (currentImg >= 0) {
                    $(".scrollLeft i",top.document).removeClass("unable");
                }
                if (currentImg == obj.len - 2) {
                    $(".scrollRight i",top.document).addClass("unable");
                }
                $("#currentImgNum",top.document).text(currentImg + 2)
                $("#smallPicLlist li",top.document).removeClass("on");
                $("#smallPicLlist li",top.document).eq(currentImg + 1).addClass("on");
                self.bigImg = this.images[currentImg + 1].downLoad;
                self.bigName = this.images[currentImg + 1].fileName;
                self.imageLoadedSuccess();
                self.marginLeft = left;
                currentImg++;
                self.model.set({ currentImg: currentImg });
            }
        },
        imageScroll: function (data) {//图片滚动事件 包括向左滚、向右滚、点击缩略图滚动
            var self = this;
            var max = this.model.get("imgNum");
            var obj = {
                imgwidth: this.model.get("imgOffsetWidth"),
                num1: parseInt(max / 2),
                num2: Math.ceil(max / 2),
                len: this.imgLen
            }
            $(".scrollLeft",top.document).die().live("click", function () {//左边的图片滚动按钮
                self.scrollToLeft(obj, data);


            })
            $(".scrollRight",top.document).die().live("click", function () {//右边的图片滚动按钮
                self.scrollToRight(obj, data);
            })
            $("#smallPicLlist li",top.document).die().live("click", function () {//点击缩略图展现对应的大图
                var currentImg = self.model.get("currentImg");
                var This = $(this,top.document);
                var index = This.index();
                if (currentImg == index) {
                    return
                }
                var left = self.clickSmallImage(index, obj, max);
                self.marginLeft = left;
                self.bigImg = self.images[index].downLoad;
                self.bigName = self.images[index].fileName;
                $("#currentImgNum",top.document).text(index + 1)
                self.imageLoadedSuccess();
                self.model.set({ currentImg: index });
                $("#smallPicLlist li",top.document).removeClass("on");
                $("#smallPicLlist li",top.document).eq(index).addClass("on");
                if (obj.len > 5) {
                    $("#smallPicLlist",top.document).animate({ marginLeft: left + "px" }, { queue: false, duration: 500 })
                }
            })

        },
        clickSmallImage: function (index, obj, max) {
            var self = this;
            var currentImg = self.model.get("currentImg");
            if (index > 0) {//大于第一个
                $(".scrollLeft i",top.document).removeClass("unable");
            }
            if (index < obj.len - 1) {//小于最后一个
                $(".scrollRight i",top.document).removeClass("unable");
            }
            if (index == obj.len - 1) {//最后一个
                $(".scrollRight i",top.document).addClass("unable");
            }
            if (index == 0) {//第一个
                $(".scrollLeft i",top.document).addClass("unable");
            }
            if (index < 3) {
                var left = 0;
                return left
            }
            if (index > obj.len - obj.num2) {
                var left = -(obj.len - obj.num2 - 2) * obj.imgwidth;
                return left
            }
            if (currentImg < index) {//选中的缩略图在当前缩略图右侧
                var left = (index - currentImg) * obj.imgwidth;
                if (index < max) {//最前五个
                    left = self.marginLeft
                    if (index > obj.num1) {
                        left = self.marginLeft + (index - obj.num1) * obj.imgwidth;
                    }
                }
                if (currentImg > obj.len - max) {//最后五个
                    left = self.marginLeft - (obj.len - currentImg - obj.num2) * obj.imgwidth;
                    if (currentImg > obj.len - obj.num2) {
                        left = self.marginLeft
                    }
                } else {
                    left = self.marginLeft - left;
                }
                return left;
            }
            if (currentImg > index) {//选中的缩略图在当前缩略图左侧
                var left = (currentImg - index) * obj.imgwidth;
                if (index > obj.len - max - 1) {//最后五个
                    left = self.marginLeft
                    if (index < obj.len - obj.num2) {
                        left = self.marginLeft + (obj.len - index - obj.num2) * obj.imgwidth;
                        if (currentImg == obj.len - obj.num2 - 1) {
                            left = self.marginLeft + obj.imgwidth;
                        }
                    }
                    return left;
                }
                if (currentImg < max - 1) {//最前五个
                    left = self.marginLeft + (currentImg - obj.num1) * obj.imgwidth;
                    if (currentImg < obj.num1) {
                        left = self.marginLeft
                    }
                } else {
                    left = left + self.marginLeft;
                }
                return left;
            }
        },
        autoPlay: function (data) {//自动播放点击事件
            var self = this;
            $("#autoPlay",top.document).die().live("click", function () {//
                var This = $(this,top.document);
                if (self.autoPlayStatus == false) {
                    self.autoPlayStatus = true;
                    This.removeClass("b-play");
                    This.addClass("b-pause");
                    This.attr("title", "暂停播放");
                    self.autoTime(data, This);
                    return
                } else {
                    self.autoPlayStatus = false;
                    This.removeClass("b-pause");
                    This.addClass("b-play");
                    This.attr("title", "自动播放");
                    clearInterval(self.scrollTime);
                }
            })
        },
        autoTime: function (data, This) {//自动播放计时器
            var self = this;
            var smallPic = $("#smallPicLlist",top.document);
            var smallPicLi = smallPic.find("li");
            var len = this.imgLen;
            self.scrollTime = setInterval(function () {
                var currentImg = self.model.get("currentImg");
                if (currentImg == len - 1) {//播放到最后一个，清除计时器
                    $(".scrollRight i",top.document).addClass("unable");
                    clearInterval(self.scrollTime);
                    This.removeClass("b-pause");
                    This.addClass("b-play");
                    self.autoPlayStatus = false;
                    return
                }
                currentImg++;
                self.model.set({ currentImg: currentImg });
                smallPicLi.removeClass("on");
                smallPicLi.eq(currentImg).addClass("on");
                /*if (self.currentImg > len - 2) {
                $(",top.document.scrollRight i").addClass("unable");
                This.removeClass("b-pause");
                This.addClass("b-play");
                }*/
                self.bigImg = self.images[currentImg].downLoad;
                self.bigName = self.images[currentImg].fileName;
                $("#currentImgNum",top.document).text(currentImg + 1)
                self.imageLoadedSuccess();
                if (currentImg > len - 3 || currentImg < 3) {//最后三张时缩略图不再移动
                    return
                }
                var imgwidth = self.model.get("imgOffsetWidth");
                var marginLeft = self.marginLeft;
                var left = marginLeft - imgwidth;
                self.marginLeft = left;
                smallPic.animate({ marginLeft: left + "px" }, { queue: false, duration: 500 })
            }, 5000);
        },
        closeTips: function () {//关闭tips
            $("#picBoxTips i",top.document).click(function () {
                $("#picBoxTips",top.document).hide();
            });
        },
        bindAutoHide: function (options) {
            return $D.bindAutoHide(options);
        },

        unBindAutoHide: function (options) {
            return $D.unBindAutoHide(options);
        },
        imageZoomin: function () {//鼠标滚轮放大图片
            if (this.imageSize < 20) {
                this.imageSize++;
                width = this.picWidth * (1 + this.imageSize / 10);
                height = this.picHeight * (1 + this.imageSize / 10);
                $("#fullScreenMode img",top.document).css({ width: width, height: height, marginLeft: -width / 2, marginTop: -height / 2 });
            }
        },
        imageZoomout: function () {//鼠标滚轮缩小图片
            if (this.imageSize > -9) {
                this.imageSize--;
                width = this.picWidth * (1 + this.imageSize / 10);
                height = this.picHeight * (1 + this.imageSize / 10);
                $("#fullScreenMode img",top.document).css({ width: width, height: height, marginLeft: -width / 2, marginTop: -height / 2 });
            }
        },
        mouseWheel: function () {//鼠标滚轮事件  放大缩小图片 10%-300%
            var self = this;
            $("#fullScreenImage",top.document).die().live("mousewheel", function (event, delta) {

                if (delta > 0) {

                    self.imageZoomin();
                }
                if (delta < 0) {
                    self.imageZoomout();
                }
            });
        },
        onKeyUp: function (event) {
            var self = event.data.self;
            var obj = event.data.obj;
            var data = event.data.data;
            var keycode = event.which || event.KeyCode;
            if (keycode == 27) {//ESC键  退出幻灯片

                if ($("#focusImages",top.document).hasClass("hide")) {
                    var id = $("#fullScreenMode",top.document);
                } else {
                    var id = $("#focusImages",top.document);
                };
                self.close();
            }
            if (keycode == 38) {//up   放大
                if (self.fullScreen) {
                    self.imageZoomin();
                } else {
                    self.scrollToLeft(obj, data);
                }
            }
            if (keycode == 40) {//down  缩小
                if (self.fullScreen) {
                    self.imageZoomout();
                } else {
                    self.scrollToRight(obj, data);
                }
            }
            if (keycode == 37 || keycode == 33) {// left PageUp  向左滚动
                $("#fullScreenMode img",top.document).css({ width: "auto", height: "auto" });
                self.imageSize = 0;
                self.fullScreenKeyLR();
                self.scrollToLeft(obj, data);
            }
            if (keycode == 39 || keycode == 34) {// right pageDown 向右滚动
                $("#fullScreenMode img",top.document).css({ width: "auto", height: "auto" });
                self.imageSize = 0;
                self.fullScreenKeyLR();
                self.scrollToRight(obj, data);
            }
            event.preventDefault();
        },
        eventKeyCode: function (data) {//键盘事件
            var smallPic = $("#smallPicLlist",top.document);
            var self = this;
            var max = this.model.get("imgNum");
            var obj = {
                smallPic: smallPic,
                smallPicLi: smallPic.find("li"),
                imgwidth: this.model.get("imgOffsetWidth"),
                num1: parseInt(max / 2),
                num2: Math.ceil(max / 2),
                len: this.imgLen
            }
			if (focusImagesView) {
				$(document,top.document).bind("keyup", { self: self, obj: obj, data: data }, focusImagesView.onKeyUp);
			}
        },
        onMouseDown: function (dragEvent) {//图片拖动效果 按下鼠标
            var self = this;
            self.mouseX = dragEvent.clientX;
            self.mouseY = dragEvent.clientY;
            var imgLeft = $("#fullScreenImage",top.document).css("marginLeft");
            var imgTop = $("#fullScreenImage",top.document).css("marginTop");
            self.imgLeft = parseInt(imgLeft.replace("px", ""));
            self.imgTop = parseInt(imgTop.replace("px", ""));
            self.moveStatus = true;
            $(document,top.document).bind("mousemove", { self: self }, focusImagesView.onMouseMove);
            $(document,top.document).bind("mouseup", { self: self }, focusImagesView.onMouseUp);
            dragEvent.preventDefault();
        },
        onMouseMove: function (dragEvent) {//图片拖动效果 鼠标移动
            var self = dragEvent.data.self;
            var _x = dragEvent.clientX;
            var _y = dragEvent.clientY;
            var left = _x - self.mouseX;
            var top = _y - self.mouseY;
            left = self.imgLeft + left;
            top = self.imgTop + top;
            if (self.moveStatus == true) {
                $("#fullScreenImage",top.document).css({ marginLeft: left, marginTop: top });
                dragEvent.preventDefault();

            }
        },
        onMouseUp: function (dragEvent) {//图片拖动效果 松开鼠标
            var self = dragEvent.data.self;
            $("#fullScreenMode",top.document).unbind("mousemove", focusImagesView.onMouseMove);
            $("#fullScreenMode",top.document).unbind("mouseup", focusImagesView.onMouseUp);
            self.moveStatus = false;
        },
        imgDrag: function () {
            var self = this;
            $("#fullScreenImage",top.document).bind("mousedown", focusImagesView.onMouseDown)


        },
        fullScreenKeyLR: function () {//  全屏状态下使用左右方向键
            var self = this;
            if (self.fullScreen == true) {
                var fullid = $("#fullScreenMode",top.document);
                var normalid = $("#focusImages",top.document);
                self.fullScreen = false;
                $("#fullScreenMode",top.document).addClass("hide");
                $("#focusImages",top.document).removeClass("hide");
            }

        },
        close: function () {
            this.autoPlayStatus = false;
            clearInterval(this.scrollTime);
            $("#jonMark",top.document).remove();
            $("#focusImages",top.document).remove();
            $("#fullScreenMode",top.document).remove();
			if (focusImagesView) {
				$(document,top.document).unbind("keyup", focusImagesView.onKeyUp);
			}
            
            this.remove();
            $("#pagerSelect",top.document).show();
        },
        closeImagesEvents: function () {//关闭幻灯片
            var self = this;
            $("#closeImages",top.document).click(function () {
                self.close();
            });
        },
        template: function (denyForward) {
			if(parent.gMain)
			{
				res = parent.gMain.resourceRoot;
			}
			else
				res = domainList[1].resource+"/se";
			var showDownload="";
			if(denyForward && denyForward=="1")
			{
				showDownload="none";
			}
			else if(!denyForward)
			{
				var objURL = $Url.getQueryObj();
				if(objURL.denyForward && objURL.denyForward=="1")
				{
					showDownload="none";
				}
			}
            var html = [
            '<div class="previewer" id="focusImages" tabindex="0" style="z-index:99999">',
            '<em class="outter-close"><i class="i-outter-close" id="closeImages"></i></em>',
            '<div class="wrap-box">',
            '<div class="pic-box" id="picBox">',
            '<div class="pic-show" id="picShow">',
            '<span class="jon"></span>',
			'<em style=\'cursor:url("'+res+'/images/module/attr/bg11.cur"),auto;\' class=" cursor scrollLeft" id="picForward"></em>',
            '<em style=\'cursor:url("'+res+'/images/module/attr/bg12.cur"),auto;right:0;\' class="cursor scrollRight" id="picNext"></em>',
            //'<a href="javascript:;" class="next-page scrollRight hide"><em><i></i></em></a>',
            '<span class="page-num"><span id="currentImgNum">{currentImg}</span>/{imgNum}</span>',
            '<img class="photo" id="bigImage" src="'+res+'/images/module/attr/loading.gif"/>',
            //'<p class="pic-box-tips" id="picBoxTips"><span id="tipsFocusImage">支持键盘方向键切换图片</span><em><i class="i-close"></i></em></p>',
            '</div>',
            '<h3 class="pic-name" id="picName">{fileName}</h3>',
            '</div>',
            '</div>',
            '<div class="pic-console-wrap" id="picConsoleWrap">',
            '<div class="pic-console">',
            '<a href="javascript:;" class="b-forward scrollLeft {hideClass}" title="上一张"><em><i></i></em></a>',
            '<a href="javascript:;" class="b-next scrollRight {hideClass}" title="下一张"><em><i></i></em></a>',
            '<span class="spa-line {hideClass}"></span>',
            '<a href="javascript:;" class="b-oneone hide" title="1:1"><em><i></i></em></a>',
            '<a href="javascript:;" class="b-fullScreen" id="fullScreen" title="全屏"><em><i></i></em></a>',
            '<span class="spa-line"></span>',
            '<a href="javascript:;" class="b-rotate-r" id="rotateRight" title="右旋转"><em><i></i></em></a>',
            '<a href="javascript:;" class="b-rotate-l" id="rotateLeft" title="左旋转"><em><i></i></em></a>',
            '<span class="spa-line"></span>',
            '<a href="{bigImage}" style="display:'+showDownload+'" class="b-downLoad" id="imgDownload" title="下载"><em><i></i></em></a>',
            '<a href="javascript:;" class="b-pause hide" title="幻灯片播放"><em><i></i></em></a>',
            '<a href="javascript:;" class="b-play {hideClass}" id="autoPlay" title="自动播放"><em><i></i></em></a>',
            '</div>',
            '</div>',
            '<div class="smallPic-box-wrap" id="smallPicBoxWrap" style="display:{smallImgDisplay}">',
            '<a href="javascript:;" class="scrollLeft smallPic-forward" title="上一张"><em><i></i></em></a>',
            '<a href="javascript:;" class="scrollRight smallPic-next" title="下一张"><em><i></i></em></a>',
            '<div class="smallPic-box">',
            '<ul class="smallPic-list" id="smallPicLlist">',
            '{imgList}',
            '</ul>',
            '</div>',
            '</div>',
            '</div>',
            '<div class="full-screen-mode hide" id="fullScreenMode" style="z-index:99999">',
            '<img class="full-screen-img" src="" id="fullScreenImage" alt=""/>',
            '<div class="full-screen-console clearfix" id="fullScreenConsole">',
            '<h3>{fileName}</h3>',
            '<a href="javascript:;" class="backtoMode"><em><i id="normalScreen"></i></em></a>',
            '</div>',
            '</div>'].join("");
            return html;
        }
    }));



})(jQuery, _, M139);