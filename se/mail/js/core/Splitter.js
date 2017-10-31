/**
 * 通用拖动类
 * @author cmail
 */


/**
 * 通用拖动类<br>
 * 实现div拖动、横纵向分隔条拖动
 * @param {Object} mi 要拖动的div对象
 * @param {function} wo 回调函数,参数为：[downX,downY,upX,upY]
 * @param {string} aj 拖动类型。v:垂直分隔条，h:水平分隔条,其它为div
 * @param {Object} mo 激活事件的对象
 * @class
 * @example
 * <code>
 * var sp = new Splitter(mi,wo,aj,mo);
 * </code>
 */
var Splitter = cmail.createClass();

(function(){
    Splitter.prototype = {
        onMouseDown: function (e){
            var ev = EV.getEvent(e);
            this.downX = EV.pointerX(ev);
            this.downY = EV.pointerY(ev);
			this.createSub();
			this.showMask();
			this.pos = El.pos(this.splitter);
            this.start = true;
			EV.observe(document, "mousemove", this.mouseMove,true);
            EV.observe(document, "mouseup", this.mouseUp,true);
			if(this.dragSytle==0){
				EV.stopSelect(true);	
			}
			EV.preventDefault(ev);
			EV.stopEvent(ev);
        },
        onMouseMoveV: function (e){
            if (!this.start){
				return;
			}    
			var ev = EV.getEvent(e);
            var x = EV.pointerX(ev);
			if(this.dragSytle==0){
				this.subSplitter.style.left = x + "px";
			}else{
				this.splitter.style.left = this.pos[0] + (x-this.downX) + "px";
			}    
        },
		onMouseMoveH: function (e){
            if (!this.start){
				return;
			}    
			var ev = EV.getEvent(e);
            var y = EV.pointerY(ev);
			if(this.dragSytle==0){
				this.subSplitter.style.top = y + "px";
			}else{
				 this.splitter.style.top = this.pos[1] + (y-this.downY) + "px";
			}	       
        },
		onMouseMove: function (e){
            if (!this.start){
				return;
			}    
			var ev = EV.getEvent(e);
            var x = EV.pointerX(ev);
            var y = EV.pointerY(ev);   
			if(this.dragSytle==0){
				this.subSplitter.style.left = this.subDownX + (x-this.downX) + "px";
            	this.subSplitter.style.top = this.subDownY + (y-this.downY) + "px";    
			}else{
				this.splitter.style.left = this.pos[0] + (x-this.downX) + "px";
            	this.splitter.style.top = this.pos[1] + (y-this.downY) + "px";      
			} 
        },
        onMouseUp: function (e){
            if (!this.start){
				return;
			}    
            var ev = EV.getEvent(e);
            this.upX = EV.pointerX(ev);
            this.upY = EV.pointerY(ev);
			this.hideMask();
            if (this.callback){
				this.callback([this.downX, this.downY, this.upX, this.upY]);
			}
			EV.stopObserving(document, "mousemove", this.mouseMove,true);
            EV.stopObserving(document, "mouseup", this.mouseUp,true);
            this.start = false;
			if(this.dragSytle==0){
				EV.stopSelect(false);
			}
        },
        createSub: function (){
			if(this.dragSytle==1){
				return;
			}
            this.subSplitter = El.createElement("div");
            var pos = El.pos(this.splitter);
            var dim = El.getSize(this.splitter);
			var zindex = this.zindex;
            var w,h,fz;
            if (this.type == "v") {
				w = "5px";
                h = dim.height+"px";
                fz = "1px";
                this.subSplitter.style.backgroundColor = "#ccc";
            }else if (this.type == "h") {
                w = dim.width + "px";
                h = "5px";
                fz = "1px";
                this.subSplitter.style.backgroundColor = "#ccc";
            }else{
                w = dim.width + "px";
                h = dim.height+"px";
                fz = "12px";
                El.setStyle(this.subSplitter,{border:"4px solid #ccc"});
            }           
            El.setStyle(this.subSplitter,{
                position: "absolute",
                zIndex: zindex+2,
                left: pos[0] + "px",
                top: pos[1] + "px",
                width: w,
                height: h,
                fontSize: fz
            });
            this.subDownX = pos[0];
            this.subDownY = pos[1]; 
            document.body.appendChild(this.subSplitter);
        },
        showMask: function (){ 
			var zindex = this.zindex;
			if(this.dragSytle==1){
				this.showOpactity(zindex-1);
			}else{
				this.showOpactity(zindex+1);
			}
        },
		hideMask: function (){ 
			var zindex = this.zindex;		
			if(this.dragSytle==1){
				this.showOpactity(zindex-1);
			}else{
				this.hideOpactity(zindex-1);
				if(this.subSplitter){
					El.remove(this.subSplitter);
				}
			}
        },
		showOpactity:function(zindex){
			if(this.isOpactity){
				CC.showTransparent(zindex);
			}else{
				this.opactity.style.zIndex = zindex;
				El.show(this.opactity);
			}
		},
		hideOpactity:function(zindex){
			if (zindex && zindex > 0) {
				if (this.isOpactity) {
					CC.showTransparent(zindex);
				} else {
					this.opactity.style.zIndex = zindex;
					El.hide(this.opactity);
				}
			}else{
				CC.hideTransparent();
			}
		},
		/**
		 * 
		 * @param {Object} div 要拖动对象
		 * @param {Object} callBack 拖动后的回调函数
		 * @param {Object} dragType 拖动类型 h:垂直,v:水平,wh:普通模式
		 * @param {Object} dragDiv 激活手动事件对象
		 * @param {Object} dragStyle 拖动层的类型 1:实体拖动,0:虚拟框拖动
		 */
        initialize: function (div, callBack, dragType, dragDiv, dragStyle){
            this.splitter = $(div);
			this.zindex = this.splitter.style.zIndex - 0;
            this.subSplitter = null;
            this.mask = null;
            this.callback = callBack;
            this.type = dragType;
            this.downX = 0;
            this.downY = 0;
            this.upX = 0;
            this.upY = 0;
            this.dragSytle = dragStyle || 0;	//1:拖动实际层，0:拖动虚拟层
            this.start = false;
            this.dragType = dragType;
			this.isOpactity = (dragType=="wh")?true:false;
            dragDiv = $(dragDiv);
			dragDiv.style.cursor = "default";
			if(this.dragType!="wh"){
				this.opactity = CC.createOpactity(this.dragType,this.zindex);
			}
			var p = this;
			this.mouseDown = function(e){
				p.onMouseDown(e);
			};
            this.mouseUp = function(e){
				p.onMouseUp(e);
			};
			if(this.type=="h"){
				this.splitter.style.cursor = "n-resize";
				this.mouseMove =  function(e){
					p.onMouseMoveH(e);
				};
			}else if(this.type=="v"){
				this.splitter.style.cursor = "e-resize";
				this.mouseMove = function(e){
					p.onMouseMoveV(e);
				};
			}else{
				this.mouseMove = function(e){
					p.onMouseMove(e);
				};
			}
            EV.observe(dragDiv, "mousedown", this.mouseDown,true);
        }
    };
})();















