/**
 * 创建工具条类
 * @param {string} o 工具条标识id 
 * @param {function} gettb 得到工具条菜单数据函数
 * @param {function} getsubmenu 得到工具条子菜单数据函数
 * @param {Object,string} con 要插入菜单对象或id
 * @class 
 */
function Toolbar(o,gettb,getsubmenu,con,mid){
    this.name = o;
    this.mn = (o.indexOf('_') > -1)?o.substr(0,o.indexOf('_')):o;
    this.getTbData = gettb;
    this.getTbSubMenuData = getsubmenu;
    this.menuId = mid || "";
    this.div = $(con);
}

Toolbar.prototype = {
	/**
	 * 工具条初始化
	 */
	init : function(isSelf){
	    /** 初始化菜单隐藏事件*/
	    var p1 = this;
	    var wintop = window;
	    initHideSubMenuEvent(wintop);
	    function initHideSubMenuEvent(wtop){
	        for (var i = 0, l = wtop.frames.length; i < l; i++) {
	            try {
					var frm = wtop.frames[i] || {};
                    var id = frm.id || frm.name || "";
					if(!id.inStr(gConst.sysFrames)){
						EV.observe(frm.document, "click", p1.doHideSubMenu);
	                	initHideSubMenuEvent(frm.window);
					}
	            } catch (e) {
	            }
	        }
	        EV.observe(wtop.document, "click", p1.doHideSubMenu);
			//p1.getDatePick();
	    }
	},
	/**
	 * 隐藏菜单方法
	 */
	doHideSubMenu: function(){
	    if (GE.cToolbar) {
	        //El.hide(GE.cToolbar);
            El.remove(GE.cToolbar);
	        GE.cToolbar = null;
	    }
	},
	/**
	 * 得到事件处理的方法
	 */
	getMenuFunc:function(url){
		if(!url){
			return false;
		}
		if(typeof url == "function"){
			return url;
		}
		var func = window;
		var funcs = url.split(".");
		var i=0;
		for(i=0;i<funcs.length;i++){
			if(func){
				func = func[funcs[i]];
			}else{
				break;
			}
		}
		if(typeof(func)=="function"){
			return func;
		}
	},
	
	/**
	 * 得到工具条
	 */
	getToolbar: function(){
	    var p1 = this;
		//创建一个标签[标签名, id, className]
	    var objTb = El.createElement("div", gConst.divToolbar + p1.name, "toolbar");
	    var objTbMain = El.createElement("ul", "", "toolBut");
	    objTb.appendChild(objTbMain);
	    
	    var arrTbData = p1.getTbData() || [];
	    
	    if (arrTbData.length == 0) {
	        return;
	    }
	    
	    arrTbData.each(function(i, ao){
	    	if(ao && ao.isShow){
		        if (ao.isNode) {
		            objTb.appendChild(ao);
		        } else if(ao && typeof ao == "object"){
		            objTbMain.appendChild(createToolbarItem(ao));
		        }
	        }
	    });	    
	    El.insertElement(p1.div, objTb, "afterBegin");
		
		//增加分页按钮
	    if( typeof MM[p1.mn].getToolbarRightPart == 'function' ){
	    	El.insertElement(objTb, MM[p1.mn].getToolbarRightPart(), "beforeEnd");
			if(p1.picker){
				p1.picker.onSelectBack();
			}
	    }
	    
	    function createToolbarItem(ao){
	        var om = p1.getMenuItem(ao);
	        var clickEvent = om.clickEvent;
	        var objTbBtn = El.createElement("li", "", "");
	        var objTbM = El.createElement("a", "", (om.hasMenu?"n_btn_slide mr_5":"n_btn mr_5"));
	        El.setAttr( objTbM, {href: 'javascript:fGoto();'});
	        var objTbM_btn = El.createElement("span", "", om.className);
			var objSpan = El.createElement("span", "","");
			
			//如何是监控审核邮件， 这里多一个日期控件，需要判断，加一个padding-right,而且要考虑没有分页和有分页的情况
			//if((CC.isAudit() || CC.isMonitor()) && (p1.name == 'sys14' || p1.name == 'sys13') && ao.name == 'MAIL_INBOX_DATEPICKER'){
					/*
					var oA = El.createElement('li','','');
									var oSpan = El.createElement('span','','');
									
									if(oA.style.styleFloat){
										objTbBtn.style.styleFloat = 'right';
									}else{
										objTbBtn.style.cssFloat = 'right';
									}
									
									objTbBtn.style.marginRight = '200px';
					*/
				//oA.innerHTML = '日期';
				
				//return oA;
			//}
			
			objSpan.innerHTML = om.text;
			 if (om.hasMenu) {
	            var objTbM_Icon = El.createElement("i", "", "");
	            objSpan.appendChild(objTbM_Icon);
	            //objTbM_Icon.onclick = doShowSubMenu;
				objTbBtn.onclick = doShowSubMenu;
	        }
			objTbM_btn.appendChild(objSpan);
			objTbM.appendChild(objTbM_btn);
	       
	        if (!om.hasMenu) {
				objTbBtn.onclick = function(e){
					var ev = EV.getEvent(e);
					var target = EV.getTarget();
					p1.doHideSubMenu();
					p1.init();
					if (clickEvent) {
						if (typeof clickEvent == "function") {
							clickEvent(p1.name, om.mid, ao);
						}
						else 
							if (clickEvent == "menu") {
								MM[p1.mn].doMenu(p1.name, om.mid, ao);
							}
						EV.stopEvent(ev);
					}
					else 
						if (om.hasMenu) {
							var tom = target.parentNode;
							if (tom && om.hasMenu && tom.className == "button") {
								doShowSubMenu(e);
							}
						}
				};
			}        	        
	        objTbBtn.appendChild(objTbM);	       
	        
	        function doShowSubMenu(e){
	            var ev = EV.getEvent(e);
	            var target = EV.getTarget(ev);
	            p1.doHideSubMenu();				
                var submenu = [];
                if(om.getsub){
                    submenu = p1.getTbSubMenuData(om.mid,ao.children);
                }else{
                    submenu = ao.children;
                }
				//得到二级菜单 [参数submenu 最初是从Folder.js 的menuData 传过来]
				var objTbM_subMenuUl = p1.getToolbarSubMenu(submenu);
				objTbM.appendChild(objTbM_subMenuUl);
	            El.show(objTbM_subMenuUl);
	            var h = origialh = El.height( objTbM_subMenuUl ), w = El.width( objTbM_subMenuUl );
	            var overHeight = false;
	            if(h > gConst.menuSize.maxHeight + 2){
	            	h = gConst.menuSize.maxHeight;
	            	overHeight = true;
	            }
	            else{
	            	overHeight = false;
	            }
	            w = w < gConst.menuSize.minWidth ? gConst.menuSize.minWidth : w;
				
				//审核邮件的筛选下拉框因为有三级菜单，不能出现滚动条，所有不用加上30个像素的滚动条宽度
				if(p1.name != 'sys'+gConst.folderEnum.audit && (submenu[0].name.search(/MAIL_INBOX_FILTER/)== -1)){
					if(overHeight){
	            		w = w + 30; //附加滚动条的宽度
	           	    }
				}
                else {
                    if(overHeight){
                        h = origialh;
                    }
                }
	            
	            // El.height( objTbM_subMenuUl, h );
	            El.width( objTbM_subMenuUl, w);
				p1.init(true);
	            GE.cToolbar = objTbM_subMenuUl;
	            EV.stopEvent(ev);
	        }
      
            return objTbBtn;
	    }
	},
	getDatePick: function(){
		var p = this;
		var name = this.name;
		var folder = new Folder();
		folder.getDatePick(name);
	},
	/**
	 * 得到功能按钮菜单下拉框的子菜单
	 * @param {Object} menuData 菜单数组对象
	 */
	getToolbarSubMenu: function(menuData,doc){
	    var p1 = this;
	    var css = '';
		var ulWidth = 0; //二级菜单ul的宽
		if(!doc)
			doc = document;
	    menuData = menuData || [];

        //是否有三级菜单,需要改变样式。
        var setStyle = (function(){
            for(var i= 0,l=menuData.length;i<l;i++){
                var cNodes = menuData[i].children;
                if(cNodes && cNodes.length)  return true;
            }
            return false;
        })();
	    if(menuData.notNeedCss){
	    	css = '';
	    }else{
            css = 'toolBut_drop shadow';
		}
	    var objSubMenu = El.createElement("ul", "", css,doc);
		
		/*
		if(objSubMenu.currentStyle)
				{
					ulWidth = objSubMenu.currentStyle['width'];
				}
				else
				{
					ulWidth = getComputedStyle(objSubMenu, false)['width'];
				}
		*/

		
		
		if(setStyle){
			/*
			objSubMenu.style.background = 'none repeat scroll 0 0 white';
						objSubMenu.style.border = '1px solid #6B6B6B';
						objSubMenu.style.left = 0;
						objSubMenu.style.padding = '1px 0';
						objSubMenu.style.position = 'absolute';
						objSubMenu.style.top = '26px';
						objSubMenu.style.zIndex = '999';
			*/
			objSubMenu.style.overflow = 'visible';
		}
		
	    if(menuData.length == 0){
	        return objSubMenu;
	    }
	    objSubMenu.onmousedown = function(){
	    	return false;
	    };
	    menuData.each(function(i, ao){
            if (ao && typeof ao == "object") {
                var om = p1.getMenuItem(ao);
                var attrs = om.attrs;
				//传入的url
                var clickEvent = om.clickEvent;
                var width = GC.getUrlParamValue(attrs, "width");
                var isBold = GC.getUrlParamValue(attrs, "isBold") ? true : false;
                var checked = GC.getUrlParamValue(attrs, "checked");
                var param = GC.getUrlParamValue(attrs, "param");
                var sep = GC.getUrlParamValue(attrs, "sep");
                var clsName = GC.getUrlParamValue(attrs, "clsName") || '';                
                var objLi = El.createElement("li", '', clsName,doc);
                var objLiSep = "";
                var cn = decodeURI(om.className || "");
                var text = om.text;
                var html = "";
                var menuCss = "";
				var children = om.children;
				var attr = om.attrs;

				//得到子菜单的下级菜单
				var cbFunc = "";
				
                if (checked) {
                    if (checked == "true") {
                        html += "<em>√&nbsp;</em>";
                    } else {
                        html += "<em>&nbsp;&nbsp;&nbsp;</em>";
                    }
                }

                if( cn){
                    html += "<i "+(/c\d+$/.test(cn) ? "style=\"left:3px\" class=\"i-colorsquare mr_5 " : "")+ cn +"\"></i>";
                    menuCss = " class='layoutmenu'";
                }
                else{
                	menuCss = '';
                }
				
                if (width) {
                    objSubMenu.style.width = (width) + "px";
                }
				
                if (isBold) {
                    objLi.style.fontWeight = "bold";
                }
                html = '<a href="javascript:fGoto();"' + menuCss + '>' + html + text + '</a>';
                
				//加载li
			    objLi.innerHTML = html;

                if(setStyle && ao.id == '-201'){
			   		objLi.style.overflow = 'visible';
					//objLi.style.marginRight = '-4px';
			    }
				
                objLi.onmouseover = function(){
                    El.addClass(this, "hover");
                };
				
                objLi.onmouseout = function(){
                    El.removeClass(this, "hover");
                };
				
                //回调函数
                if (clickEvent) {
                    objLi.onclick = function(e){
                        var ev = EV.getEvent(e);
                        var isNoHide = false;
						
                        if (typeof clickEvent == "function") {
                            isNoHide = clickEvent(p1.name, om.mid, ao);
                        } else if (clickEvent == "menu") {
                            isNoHide = MM[p1.mn].doMenu(p1.name,om.mid,ao);
                        }
						
                        if (!isNoHide) {
                            p1.doHideSubMenu();
                        }
						
	                    EV.stopEvent(ev);
                    };
                }
				
				if ((typeof(children) == "object" && children instanceof Array && children.length>0)) {
	                 //子菜单
					 
	                 //objLi.innerHTML = '<div style=" color: #333333;display: block;height: 24px; padding: 0 5px;white-space: nowrap;">'+text + '<i class="jon_more"></i></div>';
	                // objLi.title = text;
					 var oldLi = null;
					
					 /*
						if(!oldLi){
											 	oldLi = objLi.cloneNode(true);
											 }
						*/
											 
					 var objDiv = El.createElement("div", '','three_level_li');
					 
					 objDiv.innerHTML = text + '<i class="i-trangle-hw"></i>';
					 objLi.innerHTML = "";
					 objLi.appendChild(objDiv);
					 
					 var iWidth = objLi.offsetWidth;
	                 var subUl = p1.getToolbarSubMenu(children);
	                 
					 subUl.style.left = "100%";
					 subUl.style.top = 0 + "px";
					 subUl.style.display = 'none';
	                 objLi.appendChild(subUl);
                     if(jQuery(subUl).find("li").length > 8){
                         subUl.style.height = '200px';
                         subUl.style.overflowY = 'auto';
                     }


					 //attr&&attr.width
	               
	                 /*
					objLi.onmouseover = function(){
							                 El.addClass(this, "hover");
							                 El.show(subUl);
						                 };
					*/
	               /*
					  objLi.onmouseout = function(){
							                 El.removeClass(this, "hover");
							                 El.hide(subUl);
					                 	};
					*/
					var oMouseTimer = null;
					
					objDiv.onmouseover = subUl.onmouseover = function(){
						//El.addClass(this, "hover");
						//El.show(subUl);
						subUl.style.display = 'block';
						clearTimeout(oMouseTimer);
					
					}
					
					objDiv.onmouseout = subUl.onmouseout = function(){
						//var _this = this;
						oMouseTimer = setTimeout(function(){
							//El.removeClass(_this, "hover");
			               // El.hide(subUl);
						   subUl.style.display = 'none';
						},100);
					}
										
					/*
					jQuery(objLi).bind('mouseleave',function(){
											 El.removeClass(this, "hover");
							                 El.hide(subUl);
										});
					*/
				}
				
              /*
				 if ((typeof(children) == "object" && children instanceof Array)) {
					                 //子菜单
					                 objLi.innerHTML = text + '<i class="more"></i>';
					                 objLi.title = text;
					                 var subUl = p1.getToolbarSubMenu(cbFunc);
					                 objLi.appendChild(subUl);
					                 if(attr&&attr.width){
					                 	subUl.style.left = (attr.width-10) + "px";
					                 }
					                 objLi.onmouseover = function(){
						                 El.addClass(this, "hover");
						                 El.show(subUl);
					                 };
					                 objLi.onmouseout = function(){
						                 El.removeClass(this, "hover");
						                 El.hide(subUl);
				                 };
								}
				*/
								
				//追加Li到菜单
				objSubMenu.appendChild(objLi);
				if (sep == "true") {
					objLiSep = El.createElement("li","","",doc);
					objLiSep.className = "line";
					objSubMenu.appendChild(objLiSep);
				}
			}
	    });
	    return objSubMenu;
	},
	//得到具体的每一个子菜单
	getMenuItem:function(ao){
		var p1 = this;
		var ut = ao.urlType || 2;
		var url = ao.url || "";
		var attrs = (ao.attrs || "").decodeHTML();
        var className = GC.getUrlParamValue(attrs,"className");
        var name = ao.name;
        var mid = name.substring(name.lastIndexOf("_")+1,name.length);
        var getsub = GC.getUrlParamValue(attrs,"getsub");
		var children = ao.children;
		
        if(getsub){
        	url = '';
        }
        var om = {
        	text:ao.text || "",
        	nmae:ao.name,
        	mid:mid,
        	hasMenu:(ao.children && ao.children.length>0) || getsub,
        	clickEvent:url,
        	attrs:attrs,
            getsub:getsub,
        	className:className,
			children:children
        };
        return om;
	}
};
