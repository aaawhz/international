/**
 * 邮件拖动类
 * @param {String} type 拖动的类型
 * @param {Object} div 拖动的对象
 * @class
 */
var Drag = cmail.createClass();

Drag.prototype = {
	/**
	 * 构造函数
	 */
	initialize: function(type, div){
	    this.type = type;		//拖动的类型
	    this.div = div;			//拖动的div
		this.dragItem = null;	//拖动时显示提示信息的div对象
		this.isOn = false;		//拖动的对象位于合法目的对象
		this.isDrag = false;	//是否处于拖动状态	
		this.folderMoveTo = "";	//目的对象的id
		this.doDragOver = function(){};//拖动进入目的对象事件处理函数
		this.doDragUp = function(){};//拖动事件业务处理函数
	},
	/**
	 * 初始化拖动类
	 */
	init: function(){
		var oDrag = this;
		EV.stopSelect(true);
		EV.observe(document, "mousemove", oDrag.mouseMove, false);
		EV.observe(document, "mouseup", oDrag.mouseUp, false);
		EV.observe(document, "mouseover", oDrag.doDragOver, false);
		oDrag.isDrag = true;
	    GE.Drag.moveType = oDrag.type;
	},
	/**
	 * 鼠标移动事件
	 */
	mouseMove: function(){
	    var ev = EV.getEvent();
	    try {
	        if (!GE.Drag.moveType) {
	            return;
	        }
	        var oDrag = MM[GE.Drag.moveType].drag;
	        var div = oDrag.div;						
	        var type = oDrag.type;						
			var x1 = EV.pointerX(ev) - div.mouseDownX;
	        var y1 = EV.pointerY(ev) - div.mouseDownY;
	        var x2 = EV.pointerX(ev);
	        var y2 = EV.pointerY(ev);
	        var oDragItem = oDrag.dragItem || $(type + "DragItem");//dk
			var p1;
	        if (Math.abs(y1) > 10 || Math.abs(x1) > 10) {
	            if (oDragItem.style.display == "none") {
	                El.show(oDragItem);
	                if(type == "folder") {
                        var oInput = div.getElementsByTagName("INPUT")[0];
	                    oInput.checked = true;
	                    var o = div.id.split("_")[1];
	                    p1 = MM[o];
                        p1.setTrClass(oInput, true);
	                    //p1.showMsg();
	                }else {
	                    p1 = MM[type];
	                }
	               
	            }
				oDragItem.style.left = x2 + 6 + "px";
	            oDragItem.style.top = y2 + 16 + "px"; 
				if(oDrag.isOn){
					El.addClass(oDragItem,"mailDragOn");
				}else{
					El.removeClass(oDragItem,"mailDragOn");
				}   
	        }  
	    }catch (exp){}
	},
	/**
	 * 鼠标松开事件
	 */
	mouseUp: function(){
	    if (!GE.Drag.moveType) {
	        return;
	    }
		var oDrag = MM[GE.Drag.moveType].drag;		
		var div = oDrag.div;						
		var type = oDrag.type;								
	    //var o = div.id.split("_")[1];
		var np;
	    EV.stopSelect(false);
		EV.stopObserving(document, "mousemove", oDrag.mouseMove, false);
	    EV.stopObserving(document, "mouseup", oDrag.mouseUp, false);
	    EV.stopObserving(document, "mouseover",oDrag.doDragOver, false);
	    oDrag.isDrag = false;
	    GE.Drag.moveType = null;
	    var oDragItem = oDrag.dragItem||$(type + "DragItem");
	    El.hide(oDragItem);
	    if (oDrag[type + "MoveTo"]) {
	        oDrag.doDragUp(oDrag[type+"MoveTo"],oDrag.div);
			oDrag[type + "MoveTo"] = null;
	    }
	},	
	/**
	 * 返回拖动提示层
	 * @param {String} str 提示的内容
	 */
	getDragItem: function(str){
	    var type = this.type;
	    var oDragItem = $(type + "DragItem");
	    if (oDragItem) {     
			oDragItem.childNodes[1].innerHTML = str;
	    }else{
			oDragItem = El.createElement("div", type + "DragItem","mailDrag");
			oDragItem.style.zIndex=99999;
	    	oDragItem.innerHTML = '<i></i><p>'+str+'</p>';
	    	document.body.appendChild(oDragItem);
		}
		El.hide(oDragItem);
	    this.dragItem = oDragItem;
	    return oDragItem;
	}
};

