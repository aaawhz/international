/**
 * 新邮件提示框
 * @author Dream
 * @example 调用方法：
 * <code>
 * var tip = new Tips({
 *			id:"eMeng",             //id标识，不可相同
 *			title:"新邮件提示",     	//标题
 *			text:"你有一封新邮件",  	//提示内容
 *			dir:dir                 //弹出方向，默认是向上弹出
 *		}, {
 *          w:200,
 *          h:140                   //默认 {w:180 , h :120}
 *      } 
 *	);
 *	var msg = "你有 3 封新邮件";
 *	tip.setMsg(msg);                //设置提示信息的内容 or tip.setMsg(msg,title)
 *	tip.startMove();                //显示提示信息
 *
 *  tip.close();                  	//关闭提示信息
 *  </code>
 * @class
 */
var Tips = cmail.createClass();

(function(){	
    Tips.prototype = {
		/**
		 * 构造方法
		 */
        initialize: function(o, sz){
            try {
                this.W = 180;
                this.H = 120;
				this.dir = "up";
				this.id = "";
                this.tipDiv = this.getDiv(o, sz);
                this.time = 10;		//向上移动的时间间隔，单位ms
                this.pix = 1;		//每次向上移动的像素,单位px
                this.docW = document.body.scrollLeft + document.body.clientWidth - 1;
                this.docH = document.body.scrollTop + document.body.clientHeight - 1;
                this.X = this.docW - this.W;
                this.Y = this.docH;
            } 
            catch (e1) {
            }
        },
        getDiv: function(o, sz){
            var p1 = this;
            if (typeof(o) != "object") {
                o = {};
            }
            if (typeof(sz) != "object") {
                sz = {};
            }
            var id = o.id || "divTips";
            var title = o.title || Lang.Mail.sys_SystemInfo;
            var text = o.text || "";
			var dir = o.dir || p1.dir;
			var w = sz.w || p1.W;
			var h = sz.h || p1.H;
			p1.id = id;
            p1.W = w;
            p1.H = h;
			p1.dir = dir;
            var divTipsId = id;
            var br = $(divTipsId);
            if (!br) {
                br = El.createElement("DIV", divTipsId);
                document.body.appendChild(br);
            }
            else {
                br.style.display = "";
            }
            var html = '<div id="' + divTipsId + 'divTipsTitle" class="select_letter" style="position:absolute;z-index:999;width:' + w + 'px;height:' + h + 'px" id="' + divTipsId + 'divTipsMsg"><div class="window_toptitle" style="margin:0px;padding:0px;height:29px"><div class="left"></div>';
			html += '<div class="mid"><strong id="' + divTipsId + 'spanTipsMsgTitle">' + title + '</strong></div><div class="right"></div><div class="floatright"><a href="javascript:fGoto();" title="'+Lang.Mail.Close+'" class="window_close" id="' + divTipsId + 'btnTipsClose"></a></div></div>';
            html += '<div id="' + divTipsId + 'divTipsContent" class="content" style="margin:0px;padding:0px;height:' + (h - 29) + 'px"><div id="' + divTipsId + 'divTipsText" style="margin:0px;text-align:center;padding-top:10px">' + text + '</div></div></div>';
            br.innerHTML = html;
            br.setStyle({
                position: "absolute",
                overflow: "hidden",
                zIndex: 999,
                margin: "0px",
                padding: "0px",
                display: ""
            });
			if(dir=="up"||dir=="down"){
				br.setStyle({
	                width: this.W+"px",
	                height: "0px"
	            });
			}else{
				br.setStyle({
	                width: "0px",
	                height: (this.H+1)+"px"
	            });
			}
            var btnCancel = $(divTipsId + "btnTipsClose");
            btnCancel.onclick = function(){
                p1.close();
            };
            return $(divTipsId);
        },
        init: function(dis){
			this.tipDiv.setStyle({
                right: "1px",
                bottom: "1px",
                display: "" + dis + ""
	        });  
        },
		setMsg:function(msg,title){
			var ot = $(this.id + "spanTipsMsgTitle");
			var omsg = $(this.id + "divTipsText");
			if (title && title != "") {
				ot.innerHTML = title;
			}
			if (msg && msg != "") {
				omsg.innerHTML = msg;
			}
		},
        startMove: function(sdir){
            var p = this;
			this.init.call(p,"");
			var dir = sdir || p.dir;
			var objTips = p.tipDiv;
            try {
                function moveUD(){
                    var h = parseInt(objTips.style.height,10);
                    if ((dir=="up"&&h<=p.H)||(dir=="down"&&h>0)) {
                        switch (dir) {
                            case "up":
                                objTips.style.height = h + p.pix + "px";
                                break;
                            case "down":
                                objTips.style.height = h - p.pix + "px";
                                break;
                        }
                        window.setTimeout(moveUD, p.time);
                    }
                }
				function moveLR(){
                    var w = parseInt(objTips.style.width,10);
                    if ((dir=="left"&&w<=p.W)||(dir=="right"&&w>0)) {
                        switch (dir) {
                            case "left":
                                objTips.style.width = w + p.pix + "px";
                                break;
                            case "right":
                                objTips.style.width = w - p.pix + "px";
                                break;
                        }
                        window.setTimeout(moveLR, p.time);
                    }
                }
                if(dir=="up"||dir=="down"){
					moveUD();
				}else{
					moveLR();
				}
            } 
            catch (e) {
            }
        },
        close: function(){
			var closeDir = "down";
			if (this.dir == "left") {
				closeDir = "right";
			}
            this.startMove(closeDir);
            //this.tipDiv.style.display = "none";
        }
    };
})();

