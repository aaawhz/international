
var ChangeSkin = {
    //defaultSkin: "skin_bluesky", //默认的皮肤样式，从服务器返回的全局变量
    init: function () {//初始化
        this.initEvent();
    },
    initEvent: function () {
        var self = this;
        jQuery("#skinPage li").click(function () {//换肤点击事件
            var rel = jQuery(this).attr("rel"); //设置页每个换肤按钮对应的皮肤样式名
            //var rel = "skin_bluesky";
            self.changeLink("topLinks", rel);
            self.changeLink("iframeLinks", rel);
        })
    },
    changeLink: function (type, rel) {
    	
        var links = type == "topLinks" ? top.jQuery("html link") : top.jQuery("iframe");
        var linksLen = links.length;
        for (var i = 0; i < linksLen; i++) {
            var href = "";
            if (type == "topLinks") {//在top里的links
                href = links[i].href;
                this.checkLink(links, href, rel, i);
            } else {//在iframe里的links
            	//if(links[i].contentWindow.length == 0) return;
            	try{
	                var iframe = jQuery(links[i].contentWindow.document);  
	                var iframeLink = iframe.find("link");               
	                var len = iframeLink.length;
	                for (var o = 0; o < len; o++) {
	                    href = iframeLink[o].href;
	                    this.checkLink(iframeLink, href, rel, o);
	                }
                } catch(e){}               
            }
        }
    },
	changeFont:function(type)
	{
		fontCss = type=="normalfont"?"bigfont":"normalfont";
		var links = top.jQuery("html link");
		for (var i = 0; i < links.length; i++) {
			var href = links[i].href;
			if (href.indexOf(fontCss) > 0) {
				links[i].href = href.replace(fontCss, type);
				break;
			}
		}
		
		links = top.jQuery("iframe");
		for (var i = 0; i < links.length; i++) {
			try{
                var iframe = jQuery(links[i].contentWindow.document);  
                var iframeLink = iframe.find("link");               
                var len = iframeLink.length;
                for (var o = 0; o < len; o++) {
                    href = iframeLink[o].href;
                    if (href.indexOf(fontCss) > 0) {
						iframeLink[o].href = href.replace(fontCss, type);
						break;
					}
                }
            	} catch(e){}   
		}
	},
    checkLink: function (link, href, rel, i) {//判断link标签的href是否含有skin_字符串
        if (href.indexOf("skin_") > -1) {
            href = href.replace(/skin_[\w]*_zh_CN/, rel + "_zh_CN");
            link[i].href = href;
        }
    }
}
ChangeSkin.init();