function imageCode(){
	this.setAttribute.apply(this,arguments);
}
imageCode.guid = +new Date().getTime();
imageCode.prototype ={
	options :{
		imgWidth         : 170,
		imgHeight        : 53,
		//input和文本间的排版方式 ;topbottom  onecolumn  leftright
		layoutType       : 'topbottom',
		inputWidth       : 50,
		serverURL        : 'http://imgcode.kf139.com:10080/getimage',
		//input的id        
		txtVerifyCodeID  : '',
		//是否input获取焦点的时候 显示出验证码 true表示 是  false  不是
		focusShow		 : false,
		//显示在input里面的默认提示信息  不设置就不显示
		placeHold        : '',
		clientID         : 1,
		//容器的id 如果没有input 自动会生成一个input
		containerID      : ''
	},
	setAttribute : function(options){
		//设置默认配置 和 新给的配置 到this.options
		var ops = {},
			self = this;
			 		
		for(var name in this.options)
			ops[name] = this.options[name];		
		
		for(var name in options)
			ops[name] = options[name];	
		
		this.options = 	ops;
		
		//对input做一些设置
		var input = document.getElementById(ops.txtVerifyCodeID);
		//如果不存在input 创建一个新的input
		if(input === null){
			input = document.createElement('input');
			input.type = 'text';
			var parent = document.getElementById(ops.containerID);
			//如果创建的新的input 且找不到父元素  返回
			if(parent===null){
				return;
			}else{
				parent.appendChild(input);
			}
		}
		this.input = input;
		input.setAttribute('maxLength',1);
		input.style.width = ops.inputWidth +'px';
		input.style.imeMode = 'disabled';
		
		//输入框内默认引导文字 不是空的
		var placeHold = ops.placeHold.replace(/^\s+|\s+$/g,'');		
		if(placeHold!==''){
			input.value = placeHold;
			input.style.color = '#CCC';
			input.onfocus = function(){
				if(this.value === placeHold){
					this.value=''
					input.style.color = '';
				}
				ops.focusShow
					&&self.show(); 					
			}
			input.onblur = function(){
				if(this.value.replace(/^\s+|\s+$/g,'')===''){
					input.style.color = '#CCC';
					this.value = placeHold;
				}			
			}
		}

		this.img = document	.createElement('img');
		this.img.src= ops.serverURL + '?clientid=' + ops.clientID+'&'+(++imageCode.guid);
		this.img.width  = ops.imgWidth;
		this.img.height = ops.imgHeight;
		this.img.style.cursor = "pointer";
		
		var parent = this.input.parentNode,
			c = document.createElement('div'),
			p = document.createElement('p');
		this.p=p;	
		p.innerHTML = '图中显示的图案是什么?将你认为正确答案前的 <font style="color:#ff6600">字母或数字</font> 填入框中(不区分大小写)<br><a href="javascript:;">看不清 换一张</a>';	
		parent.replaceChild(c,input);
		
		//如果设置了input获取焦点的时候先  先隐藏掉图片和文字
		if(ops.focusShow){
			this.img.style.display = this.p.style.display = 'none';
		}
		
		//每种形式可能不一样 所以结构也不一样
		if(ops.layoutType==='onecolumn'){
			this.img.style.marginTop = '5px';
			this.img.style.marginBottom = '0px';
			p.style.marginTop = '5px';
			c.appendChild(input);	
			c.style.width = Math.max(input.offsetWidth,~~ops.imgWidth)+'px';		
			c.appendChild(this.img);
			c.appendChild(p);							
		}else if(ops.layoutType==='topbottom'){
			this.input.style.marginBottom = '0px';
			c.appendChild(input);	
			var xc  = document.createElement('div');
			xc.style.marginTop = '5px';
			c.appendChild(xc);			
			this.img.style.marginRight ='12px';
			this.img.style[document.all?'styleFloat':'cssFloat']="left";
			p.style.margin = 0;
			p.style.marginLeft = this.input.offsetWidth+10+"px";
			xc.appendChild(this.img);
			xc.appendChild(p);
		}else if(ops.layoutType==='leftright'){
			this.input.style.marginRight = '5px';
			var xc  = document.createElement('div');
            c.appendChild(xc);
            input.style["float"] = "left";
            xc.appendChild(input);
			this.img.style["flost"] = "left";
			this.img.setAttribute("align","top");
			xc.appendChild(this.img);
			c.appendChild(p);	
		}
		this.p.getElementsByTagName('a')[0].onclick = this.img.onclick = function(){self.refresh();};				
	},
	show : function(){
		this.img.style.display = this.p.style.display = '';
	},
	'refresh' : function(){
		var ops = this.options;
		//ie6直接修改src图片可能会显示不出来 所以创建一个img对象 当onload 的时候在修改this.img的src
		if(/msie 6/i.test(navigator.userAgent)){
			var img = new Image(),self =this;
			img.src = ops.serverURL + '?clientid=' + ops.clientID+'&'+(++imageCode.guid);
			img.onload = function(){
				self.img.src = img.src;
			}			
		}else{
			this.img.src = ops.serverURL + '?clientid=' + ops.clientID+'&'+(++imageCode.guid);
		}
	},
	getValue : function(){
		return this.input.value;
	},
	getErrorMsg : function(){
		return '输入格式不符合要求';
	},
	isValid : function(){
		return /^[0-9a-z]$/i.exec(this.input.value)?true:false; 
	}	
}
