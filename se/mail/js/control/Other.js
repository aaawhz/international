/**
 * @author Dream
 */
/**
 * 文本框高度自动设置类
 * 
 */
function AutoTextSize(id,win,ao){
	ao = ao || {};
    var p = this;
	this.win = win || window;
	this.doc = this.win.document || document;
    this.id = id;
	this.text = this.doc.getElementById(id);
	this.maxH = ao.max || 54;	         //textarea的最大高度
    this.addHeight = 18;                 //每一行的增加值
    this.lastHeight = 0;	             //上一次的值
    this.resizeCall = ao.resizeCall;     //高度改变时的回调函数
	this.init();
}

AutoTextSize.create = function(id,win,ao){
    ao = ao || {};
	return new AutoTextSize(id,win,ao);
};

AutoTextSize.prototype = {
    init:function(){
        var p = this;
        var obj = this.text;
        this.lastHeight = 0;
        var h = obj.style.height.toInt();
        this.origHeight = h;
        var lineH = this.addHeight;
        El.setStyle(obj,{
            'resize':'none',
            'overflowY':'auto',
            'overflowX':'hidden',
            'wordBreak':'break-all',
            'lineHeight':lineH+"px"
        });
        this.clone = this.clone(obj);
        El.width(this.clone,El.width(obj));
    	if(Browser.isIE){
    		EV.addEvent(p.text,"propertychange",function(){
                    p.doSize();
                },true);
    	}else{
    		EV.addEvent(p.text,"input",function(){
                    p.doSize();
                });
    	}
    	//EV.addEvent(p.text,"change",dosize,true);
    },
    clone:function(ot){
        var otext = ot.cloneNode(true);
        var props = ['height','lineHeight','textDecoration','letterSpacing'],propOb = {};
        El.removeAttr(otext,["id",'name']);
        props.each(function(i,v){
            propOb[v] =  ot.style[v];
        });
        El.setStyle(otext, {
            position: 'absolute',
            top: '0px',
            'left': '-9999px'
        });
        El.setStyle(otext,propOb);
        El.setAttr('tabIndex','-1');
        El.insertElement(ot, otext, 'beforeBegin');
        return otext;
    },
    doSize:function(){
        var obj = this.text;
        var clone = this.clone;
        var cloneH  = El.height(obj);
        El.setSize(clone,{
                width:El.width(obj)
            }
        );
        clone.value = obj.value;
        clone.scrollTop = 10000;
        var scrollTop = clone.scrollTop;//Math.max(, this.origHeight);
        //scrollTop -= this.fixScroll;
        var ch = El.height(obj);
        var textH = Math.max(clone.scrollTop,this.origHeight);
        // Don't do anything if scrollTip hasen't changed:
        if((scrollTop + this.addHeight) > this.maxH){
            textH = this.maxH;
            //El.setStyle(obj,{'overflow-y':''});
        }else if(scrollTop>0){
            textH = textH + this.addHeight;
        }else{
            textH = this.origHeight;
        }
        if (this.lastHeight != textH) { 
            El.height(obj,textH);
            this.lastHeight = textH;
            El.setCursorPos(obj);
            if(typeof(this.resizeCall)=="function"){
                this.resizeCall.call();
            }
        }
    }
};



