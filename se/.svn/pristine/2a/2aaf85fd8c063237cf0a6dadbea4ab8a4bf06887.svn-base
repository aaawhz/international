/**
 * address,mms,sms,setting 公用部分
 */
(function(){
    if (!window.GMC){
        window.GMC = {};
        GMC.initialize = function(name,o){                 
            var aw=MM[name];
	        var i, t;
            for (i in o) {
                t = o[i];
                if (typeof(t) == "function" || typeof(t)=="object") {
					//把o对象的所有原型的方法保存在aw的一个对象中，方便调用 
                    aw[i] = t;
                }else if(t){
                	aw[i] = t;
                }
            }
        };
        GMC.getHtml = function(id,url,styles){  
            return CC.getIframe(id,url,"auto", styles);
        };
        GMC.setDivHeight = function (name){
            var h = CC.docHeight() - GE.pos()[1];
			var w = CC.DocWidth() - GE.pos()[0];
            if ($(gConst.divToolbar + name)) {
				h -= $(gConst.divToolbar + name).offsetHeight;
			} 
			var mh = Math.max(h,0) +"px";
			var mw = Math.max(w,0)+"px";
            var ifrm = this.getFrameObj(name);
			var win = this.getFrameWin(name);
			//var dw = El.docWidth(win);
			//var dh = El.docHeight(win);
			//dw = Math.max(dw,0);
			//dh = Math.max(dh,0);
			//ifrm.style.width = mw;
			try{
				if(ifrm){
					ifrm.style.height = mh;
					//win.document.body.style.width = mw;
					//win.document.body.style.height = mh;

                    if(documentEventManager){
                        documentEventManager.addDoc(win.document);
                    }
				}
			}catch(e){}
			
        };
        GMC.getMainHeight = function (name){
            var h = CC.docHeight() - GE.pos()[1];
            if ($(gConst.divToolbar + name)) {
				h -= $(gConst.divToolbar + name).offsetHeight;
			} 
			var mh = Math.max(h,0);
            return mh;
        };
        GMC.setUrl = function (name,url,isrefresh){
            var ifrm = this.getFrameObj(name);
            if (ifrm){
                var src = ifrm.src;
				 ifrm.src = url;
                //try{
                //    src = this.getFrameWin(name).document.location.href;                    
                //}catch(e1){}
                /*if (isrefresh){
                    ifrm.src = url;
                    return;
                }
                if (src != url && src.indexOf(url) == -1){
                    ifrm.src = url;
                }else if (Browser.value=="ie" && Browser.version<=6){
                    ifrm.src = url;
                }*/
            }
        };
        GMC.getMMObj = function(name,type){
            if (!MM[name]) {                
                MM[name] = {};
                Object.extend(MM[name], MM[type]);
                MM[name].name = name;
                MM[name].type = type;
//                var bn = type.substring(0, 1).toUpperCase() + type.substr(1);  
//                var bn1 = name.substring(0, 1).toUpperCase() + name.substr(1); 
//                window[bn1] = window[bn];   
//                window[bn1].name = name;   
//                window[bn1].type = "userfunc";            
            }
            return MM[name];
        };
        GMC.getFrame = function(id){
            var ifrm = window.frames[gConst.ifrm+id];
            return ifrm;
        };
		GMC.getFrameObj = function(id){
			return $(gConst.ifrm+id);
		};
		GMC.getFrameWin = function(id){
	        var o =  this.getFrameObj(id);
			if (o) {
				return o.contentWindow;
			}
		};
        GMC.gcMem = function(id){
            try {
                var win = GMC.getFrameWin(id);
                if (win) {
                    El.gc(win.document);
                }
            }catch(e){
                
            }
        };
    }
})();