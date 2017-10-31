/**
 * Tool Tips 提示框
 * 
 * 第一步：实例化此提示控件
 * var tip = new parent.ToolTips({
				id: '',          //必传
				win: window,     //
				left: 428,       //相对window的左边距
				top: -50,		 //相对window的右边距
				direction: parent.ToolTips.direction.Right
			});
 * 如果要提示框直接跟在输入框的后面，则传入输入框id 和 afterInput (true)
 *
 * 第二步: 调用控件显示
 * 
 *  tip.show(oInput,msg);
 *		
 */

function ToolTips(){
	//用init方法 初始化控件的基本属性
	this.init.apply(this,arguments);
}
//定义枚举
ToolTips.type = {
	Default: 1, 	//默认提示，自动关闭
	Confirm: 2, 	//需要确认的提示
	Drag: 3, 		//可拖动的提示
	Close: 4 		//需要手动关闭的提示
};
//定义常量
ToolTips.direction = {
	Top: 'Top',			//提示框在输入框的上边
	Right: 'Right',		// 				   右边 
	Bottom: 'Bottom',	// 				   下边
	Left: 'Left'		// 				   左边
};
ToolTips.prototype = {
	init: function(config){
		this.id = config.id || 'tips';									 //提示框的ID 必传
		this.inputId = config.inputId || '';                             //输入框的ID
		this.win = config.win || window;
		this.type = config.type || ToolTips.type.Default;				 //默认自动在几秒后关闭提示	
		this.direction = config.direction || ToolTips.direction.Top;     //默认提示控件在输入框上面
		this.closeTime = config.closeTime || 5;							 //默认自动关闭事件是  5 秒后
		this.containerId = this.id + '_container';
		this.headerId = this.id + '_header';
		this.contentId = this.id + '_content';
		this.buttonsId = this.id + '_buttons';
		this.okId = this.buttonsId + '_ok';
		this.cancelId = this.buttonsId + '_cancel';
		this.containerLeft = config.left;
		this.containerTop = config.top;
		this.okHandler = config.ok || function(){};						 //按下“确定”按钮的回调函数
		this.cancelHandler = config.cancel || function(){};				 //按下“取消”按钮的回调函数
	    this.afterInput	   = config.afterInput || false;                      //是否提示框直接更在Input输入框的后面
	},
	initEvents: function(){
		var p = this;
		
		//如果为type为1，n秒后自动关闭提示框
		if(this.type == ToolTips.type.Default){
			setTimeout(function(){
				p.close();
			}, p.closeTime * 1000);
		}
		
		//执行--确定或者取消的回调函数
		if(this.type == ToolTips.type.Confirm){
			parent.EV.observe(jQuery("#" + this.okId)[0], 'click', function(){
				p.okHandler();
				p.close();
			}, false);
			parent.EV.observe(jQuery("#" + this.cancelId)[0], 'click', function(){
				p.cancelHandler();
				p.close();
			}, false);
		}
	},
	/**
	 * @param {Object} msg  提示信息
	 * 得到提示框的结构
	 */
	getHtml: function(msg){
		var html = [];
		
		html.push("<div class=\"tips-text\">");
		
		//如果需要type为4，加载 [关闭] 按钮
		if(this.type == ToolTips.type.Close){
			html.push("<div id=\"" + this.headerId + "\"></div>");
		}
		html.push("<div id=\"" + this.contentId + "\">" + msg + "</div>");
		
		//如果需要type为2，加载 [确定|取消] 按钮
		if(this.type == ToolTips.type.Confirm){
			html.push("<p id=\"" + this.buttonsId + "\" style=\"text-align:center; padding-bottom: 5px;\">");
			html.push("<a id=\"" + this.okId + "\" href=\"javascript:fGoto()\" class=\"btnNormal vm mt_5\"><span>" + Lang.Mail.Ok + "</span></a>");
			html.push("<a id=\"" + this.cancelId + "\" href=\"javascript:fGoto()\" class=\"btnNormal vm mt_5 ml_5\"><span>" + Lang.Mail.Cancel + "</span></a>");
			html.push("</p>");
		}
		html.push("</div>");
		html.push("<div class=\"tips" + this.getDirectionClass(this.direction) + " diamond\"></div>");
		
		return html.join('');
	},
	/**
	 * 根据Tips 位置获取对应的样式
	 */
	getDirectionClass: function(d){
		switch(d){
			case ToolTips.direction.Top:
				return 'Bottom';
			break;
			case ToolTips.direction.Right:
				return 'Left';
			break;
			case ToolTips.direction.Bottom:
				return 'Top';
			break;
			case ToolTips.direction.Left:
				return 'Right';
			break;
			default:
			
		}
		return d;
	},
	/**
	 * 显示Tips框
	 * @param {obj} html对象
	 * @param {ms} 需要提示的文本
	 */
	show: function(obj, msg){
		var p = this;
		//获取控件具体结构
		var html = p.getHtml(msg);
		var arrWidth = 4;
		
		if(!obj){
			return;
		}		
		
		var container = jQuery("#" + p.containerId)[0];
		if(!container){
			var doc = p.win.document;
			container = parent.El.createElement('div', p.containerId, 'tips write-tips', doc);
			//如果是直接跟在输入框后，不通过绝对定位，需要调整样式
			if(p.afterInput){
				jQuery(container).css({"display":"inline","marginLeft":"8px","marginTop":"0",position:""});
				jQuery("#"+p.inputId).after(container);

			}else{
				doc.body.appendChild(container);
			}
			
		}
		container.innerHTML = html;		
		parent.El.insertElement(obj, container, 'afterEnd');
		if(p.afterInput){
			p.initEvents();
			return;
		}
		
		var size = parent.El.getSize(container);
		var referenceSize = parent.El.getSize(obj);
		var t, l;
		switch(p.direction){
			case ToolTips.direction.Top:
				if(this.containerLeft){
					l = this.containerLeft + 'px';
				}
				else{
					l = '0px';
				}
				if(this.containerTop){
					t = this.containerTop + 'px';
				}
				else{
					t = -(size.height + arrWidth) + 'px';
				}
				parent.El.setStyle(container, {
					top: t,
					left: l
				});				
			break;
			case ToolTips.direction.Bottom:
				if(this.containerLeft){
					l = this.containerLeft + 'px';
				}
				else{
					l = '0px';
				}
				if(this.containerTop){
					t = this.containerTop + 'px';
				}
				else{
					t = (referenceSize.height + arrWidth) + 'px';
				}
				parent.El.setStyle(container, {
					top: t,
					left: l
				});
			break;
			case ToolTips.direction.Left:
				if(this.containerLeft){
					l = this.containerLeft + 'px';
				}
				else{
					l = -(referenceSize.width + arrWidth) + 'px';
				}
				if(this.containerTop){
					t = this.containerTop + 'px';
				}
				else{
					t = -( (size.height - referenceSize.height) / 2) + 'px';
				}
				parent.El.setStyle(container, {
					top: t,
					left: l
				});				
			break;
			case ToolTips.direction.Right:
				if(this.containerLeft){
					l = this.containerLeft + 'px';
				}
				else{
					l = (referenceSize.width + arrWidth) + 'px';
				}
				if(this.containerTop){
					t = this.containerTop + 'px';
				}
				else{
					t = -( (size.height - referenceSize.height) / 2) + 'px';
				}
				parent.El.setStyle(container, {
					top: t,
					left: l
				});				
			break;
			default:
			
		}
		
		parent.El.show(container);
		this.initEvents();
		try{
			obj.focus();
		}
		catch(e){
			
		}
	},
	/**
	 * 关闭提示框功能
	 */
	close: function(){
		var container = jQuery('#' + this.containerId, this.win.document);
		if(container && container[0]){
			container.hide;
			container.remove();
		}
	}
};
