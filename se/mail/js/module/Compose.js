
function Compose(){
	this.name = gConst.compose;
	this.win = null;
	this.menuId = "MAIL";
	var p = this;
}
Compose.menuData = {
	/*'MAIL_WRITE_SEND':{sort:1},
	'MAIL_WRITE_SAVE':{sort:2},
	'MAIL_WRITE_CANCEL':{sort:3}*/
};
Compose.prototype = {
    initialize: function(){
        var p1 = this;
        GMC.initialize(this.name,this);
        Compose.fMenus ={};
		var menus = CC.getMailMenu(gConst.menu.compose);
		if(menus){
			for(var k in menus){
				Compose.fMenus[menus[k].name] = menus[k];
			}
		}
		menus = null;
    },
    getHtml: function(){
        return '<div class="compose_shadow" id="' + gConst.mainToolbar + this.name + '"></div>' + GMC.getHtml(this.name, this.url, 'overflow-x:hidden;overflow-y:auto;');
        //return '<div id="' + gConst.mainToolbar + this.name + '"></div><div id="note_'+ this.name +'" style="overflow-x:hidden;overflow-y:auto;">' + GMC.getHtml(this.name, this.url, 'overflow-x:hidden;') + '</div>';
    },
    init: function(){
        var p1 = this; 
        p1.win = p1.getWin();
        p1.setDivHeight();
    }, 
    getToolbar: function(o){
        var p1 = this;
        var menu = [];
        var html = [];
        for(var k in Compose.menuData){
        	if(Compose.fMenus[k]){
        		menu.push(Compose.fMenus[k]);
        	}
        }
        
        //给compose 添加固定工具条
        html.push("<div id=\"" + CC.getCurLabId() + "_compose_top_action\" class=\"top_compose mt_5\">");
        if(GC.check('MAIL_INBOX_WRITE')){
			html.push("<a id='btnSend' href=\"javascript:fGoto();\" onclick=\"GMC.getFrameWin(CC.getCurLabId()).oWrite.doSend(this);\" class=\"n_btn_on mt_5\" title=\"发送\">");
			html.push("<span><span>发&nbsp;送</span></span>");
			html.push("</a>");
		}
		if(GC.check('MAIL_INBOX')){
			html.push("<a id='btnSave' href=\"javascript:fGoto();\" onclick=\"GMC.getFrameWin(CC.getCurLabId()).oWrite.doSave(this);\" class=\"n_btn mt_5\" title=\"存草稿\">");
			html.push("<span><span>存草稿</span></span></a>");
		}
		if(GC.check('MAIL_INBOX')){
			html.push("<a id='btnCancel' href=\"javascript:fGoto();\" onclick=\"parent.CC.exit();\" class=\"n_btn mt_5\" title=\"取消\">");
			html.push("<span><span>取&nbsp;消</span></span>");
			html.push("</a>");
		}
		html.push("</div>");
        
        $(gConst.mainToolbar + p1.name).innerHTML = html.join('');
        //if(menu && menu.length>0){
		//	return menu;
		//}
        //menu = CC.getMailMenu(gConst.menu.compose);
        p1.menu = menu;
        return menu;
    },
    getToolbarMenu: function(af){
		return [];
    },
    resize: function(){
        this.setDivHeight();
    },
    exit: function(id){
        id = id || CC.getCurLabId();
        var p1 = this;
        try {
            var isChange = false;
            var win = CC.isCompose(id);
            if(win){
                // 销毁资源
                win.oWrite.dispose();
                try {
                    isChange = win.oWrite.checkChange();
                } catch (ex) {
                } 
                if (isChange) {
                    parent.CC.confirm('关闭写信页，未保存的内容将会丢失，是否关闭？', function(){
                        //top.jQuery('#btnSave').click()
                        //GMC.getFrameWin(CC.getCurLabId()).oWrite.doSave(this);
                        GE.tab.del(id)
                        GE.maxComposeId--;
                        if (GE.diskFiles[id]) {
                            delete GE.diskFiles[id];
                        }
                    });
					return false;
                }
            }
        } catch (e) {
            GE.maxComposeId--;
            return true;
        }
        return true;
    },
    setDivHeight: function(){
        var id = CC.getCurLabId();
        var win = GMC.getFrameWin(id);
        //GMC.setDivHeight(this.name);        
        
        var h = CC.docHeight() - GE.pos()[1];
		var w = CC.DocWidth() - GE.pos()[0];
        if ($(gConst.mainToolbar + this.name)) {
			h -= $(gConst.mainToolbar + this.name).offsetHeight;
		} 
		var mh = Math.max(h,0)+"px";
		var mw = Math.max(w,0)+"px";
        var ifrm = GMC.getFrameObj(this.name);
        //var ifrmContainer = jQuery('#note_' + id);
		var win = GMC.getFrameWin(this.name);
		try{
			if(ifrm){
				ifrm.style.height = mh;
				//ifrmContainer.css('height', mh);
				// var styStr = ifrm.getAttribute('style');
				// ifrm.removeAttribute('style');
				// ifrm.setAttribute('style', styStr + ' overflow-x: hidden; overflow-y: auto;');
				// win.document.body.style.width = mw;
				// win.document.body.style.height = mh;
			}
		}catch(e){}
		
        //修复ie下通讯录丢失的bug。
        if (Browser.isIE && win) {
            try {
                win.oWrite.setSize();
            } catch (e) {
            }
        }
    },
     /**
     * @param {String} o 模块名称
     * @param {String} mid 菜单id(去掉父模块后的值 )
     * @param {Object} om 菜单节点对象
     */
    doMenu: function(o,mid,om){
    	var p = MM["compose"];
    	//mid = mid.replace("WRITE_","");
    	var win = p.getWin();
 		if(!win || !win.oWrite){
 			return;
 		}
        var m = "";
        switch (mid) {
            case "SEND":
                m = 'Send';
                win.oWrite.doSend();
                break;
            case "SAVE":
                win.oWrite.doSave();
                break;
            case "PRINT":
                win.oWrite.doPreview();
                break;
            case "CANCEL":
                CC.exit();
                break;
            default:
                break;
        }
    },
    getWin:function(){
    	//if(this.win){
    	//	return this.win;
    	//}
    	var id = CC.getCurLabId();
        try {
	        var win = CC.isCompose(id);
	        if (win) {
				return win;	        	
	        }
	        return null;
	    } catch (e1) {
        	ch(e1);
        }
    }
};
