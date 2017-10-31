/**
 * js基础核心扩展 
 */



/**
 * 类操作通用方法
 * @private
 * @ignore
 */
function Class() {
	/**
	 * 空函数
	 * @private
 	 * @ignore
	 */
	this.emptyFunction = function() {
		return function() {};
	};
	/**
	 * 返回一个类，并执行类的构造方法initialize(如果有)
	 * @private
 	 * @ignore
	 */
	this.createClass = function() {
		return function() {
			if (this.initialize) {
				this.initialize.apply(this, arguments);
			}
		};
	};
	this.event = {
		"var" : {},
		method : [],
		target : []
	};
	/**
	 * @private
	 * @ignore
	 */
	this.initMethod = function(cls, arrMethod) {
		for (var i = 0, l = arrMethod.length; i < l; i++) {
			var m = arrMethod[i];
			if (typeof(cls.prototype[m]) != "undefined") {
				cls.prototype['_' + m] = function(methodName) {
					return function() {
						cmail.event.target.push(this.name);
						cmail.event.method.push(methodName);
						var k = this.name + "__" + methodName;
						cmail.event["var"][k] = {};
						if (this["onbefore" + methodName]) {
							try {
								this["onbefore" + methodName].apply(this, arguments);
							} catch (exp) {
								ch(k + ":onbefore(" + arguments[0] + ")", exp);
							}
						}
						//var an = cmail.getReturn(k);
						//if (typeof(an) != "undefined") {
						//	return an;
						//}
						try {
							var r1 = this[methodName].apply(this, arguments);
						} catch (exp) {
							ch(k + "(" + arguments[0] + ")", exp);
						}
						if (this["onafter" + methodName]) {
							try {
								var r2 = this["onafter" + methodName].apply(this,arguments);
							} catch (exp) {
								ch(k + ":onafter(" + arguments[0] + ")", exp);
							}
						}
						cmail.event["var"][k] = null;
						cmail.event.target.pop();
						cmail.event.method.pop();
						return r1 || r2;
					};
				}(m);
			}
		}
	};
	/**
	 * @private
	 * @ignore
	 */
	this.Delegate = function(func) {
		this.hash = new Hashtable([]);
		this.add = function(func) {
			this.hash.add(func);
		};
		this.remove = function(func) {
			this.hash.removeByObj(func);
		};
		this.run = function() {
			var args = arguments;
			this.hash.each(function(i, func) {
				func.apply(this, args);
			});
		};
		if (func) {
			this.add(func);
		}
	};
	/**
	 * @private
	 * @ignore
	 */
	this.getVar = function(Agv) {
		try {
			var target = this.event.target[this.event.target.length - 1];
			var method = this.event.method[this.event.method.length - 1];
			return this.event["var"][target + "__" + method][Agv];
		} catch (exp) {
			ch("fGetVar", exp);
			return undefined;
		}
	};
	this.setVar = function(Agv, bb) {
		var target = this.event.target[this.event.target.length - 1];
		var method = this.event.method[this.event.method.length - 1];
		var k = target + "__" + method;
		if (!this.event["var"][k]) {
			this.event["var"][k] = {};
		}
		this.event["var"][k][Agv] = bb;
	};
	this.setReturn = function(retValue) {
		var target = this.event.target[this.event.target.length - 1];
		var method = this.event.method[this.event.method.length - 1];
		var k = target + "__" + method;
		if (!this.event["var"][k]) {
			this.event["var"][k] = {};
		}
		this.event["var"][k]["return"] = retValue;
	};
	this.getReturn = function(k) {
		if (cmail.event["var"][k]) {
			var an = cmail.event["var"][k]["return"];
			if (typeof(an) != "undefined") {
				cmail.event["var"][k] = null;
				return an;
			}
		}
	};
}


/**
 * 命名空间 cmail
 * @namespace window.cmail
 */
var cmail = new Class();

/**
 * dom操作类
 * @class
 */
var El = cmail.createClass();

/**
 * 事件操作类
 * @class
 */
var EV = cmail.createClass();

/**
 * 邮件地址操作类
 * @class 邮件地址操作类
 */
var Email = cmail.createClass();

/**
 * Hashtable类
 * @class Hashtable类
 */
var Hashtable = cmail.createClass();
var $continue = {};
var $break = {};



(function() {
	
	/**
	 * 扩展Number类<br>
	 * 框架页面数字直接使用<br>
	 * 子页面使用:只要包含通用common.js文件就可以直接使用。<br>
	 * @class
	 */
	var NUMBER = cmail.createClass();
	
	/**
	 * 扩展String类<br>
	 * 框架页面数组直接使用<br>
	 * 子页面使用:只要包含通用common.js文件就可以直接使用。<br>
	 * @class
	 */
	var STRING = cmail.createClass();
	
	
	/**
	 * 扩展Array类<br>
	 * 框架页面数组直接使用<br>
	 * 子页面使用:只要包含通用common.js文件就可以直接使用。<br>
	 * @class
	 */
	var ARRAY = cmail.createClass();
	
	/**
	 * 扩展Date类<br>
	 * 框架页面日期对象直接使用<br>
	 * 子页面使用:只要包含通用common.js文件就可以直接使用。<br>
	 * @class 
	 */
	var DATE = cmail.createClass();
	
	
	/**
	 * 函数扩充类
	 * @class 
	 */
	var FUNCTION = cmail.createClass();
	
	
	/**
	 * 对源对象的属性和方法复制到目的对象
	 * @param {Object} destination 目的对象
	 * @param {Object} source 源对象
	 */
	Object.extend = function(destination, source) {
		for (var property in source) {
			destination[property] = source[property];
		}
		return destination;
	};

	/***
	 * 对象拷贝
	 * @param {Object} source
	 */
	Object.clone = function(source)
	{
	    var objClone;
	    if (source.constructor == Object) {
            objClone = new source.constructor();
        } else {
            objClone = new source.constructor(source.valueOf());
        }
	    for ( var key in source )
	    {
	        if ( objClone[key] != source[key] )
	        { 
	            if ( typeof(source[key]) == 'object' )
	            { 
	                objClone[key] = Object.clone(source[key]);//source[key].Clone();
	            }
	            else
	            {
	                objClone[key] = source[key];
	            }
	        }
	    }
	    //objClone.toString = source.toString;
	    //objClone.valueOf = source.valueOf;
	    return objClone; 
	};
	
	NUMBER.prototype = {
		/**
		 * 精确浮点加法<br>
		 * js浮点加法有bug，导致某些计算结果不准确<br>
		 * @param {Object} num 被加数
		 * @return {number} 两数相加以后的和
		 * @example 
		 * <code>
		 * var n = 6.145;
		 * var s = n.add(3.12);
		 * </code>
		 */
		add: function(num){
			var m=0,r1=0,r2=0;
			var num1 = this;
			var s1 = num.toString(),s2 = num1.toString();
			try{
				if (s1.indexOf(".") > -1) {
					r1 = s1.split(".")[1].length;
				}
			}catch(e){r1=0;}
			try{
				if (s2.indexOf(".") > -1) {
					r2 = s2.split(".")[1].length;
				}
			}catch(e){r2=0;}
			m=Math.pow(10,Math.max(r1,r2));
			return (num*m+num1*m)/m;
		},
		/**
		 * 精确浮点乘法<br>
		 * js浮点乘法有bug,导致某些计算结果不准确<br>
		 * @param {Object} num 被数
		 * @return {number} 两数相乘以后积
		 * @example 
		 * <code>
		 * var n = 6.145;
		 * var s = n.mul(3.12);
		 * </code>
		 */
		mul: function(num){
			var m=0,s1=num.toString(),s2=this.toString();
			try{
				if (s1.indexOf(".") > -1) {
					m += s1.split(".")[1].length;
				}
			}catch(e1){}
			try{
				if (s2.indexOf(".") > -1) {
					m += s2.split(".")[1].length;
				}
			}catch(e2){}
			return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);
		},
		/**
		 * 精确浮点除法<br>
		 * js浮点除法有bug，导致某些计算结果不准确<br>
		 * @param {Object} num 被数
		 * @return {number} 两数相乘以后积
		 * @example 
		 * <code>
		 * var n = 6.145;
		 * var s = n.div(3.12); // s=n/s
		 * </code>
		 */
		div: function(num){
			var t1 = 0, t2 = 0, r1, r2, s1 = this.toString(), s2 = num.toString();
			try {
				if (s1.indexOf(".") > -1) {
					t1 = s1.split(".")[1].length;
				}
			} 
			catch (e1) {}
			try {
				if (s2.indexOf(".") > -1){
					t2 = s2.split(".")[1].length;
				}
			} 
			catch (e2) {}
			r1 = Number(s1.replace(".", ""));
			r2 = Number(s2.replace(".", ""));
			return (r1 / r2) * Math.pow(10, t2 - t1);
		}
	};
	Object.extend(Number.prototype, new NUMBER());
	//Number.prototype = new NUMBER();
	
	STRING.prototype = {
		/**
		 * 去掉字符串中html标签
		 * @return {string} 去掉html标签以后的字符串
		 */
		stripTags: function() {
			return this.replace(/<\/?[^>]+>/gi, '');
		},
		/**
		 * 转成html格式
		 * @return {string} 转成html格式以后的字符串
		 */
		escapeHTML: function() {
			var div = document.createElement('div');
			var text = document.createTextNode(this);
			div.appendChild(text);
			return div.innerHTML;
		},
		/**
		 * 去除html格式
		 * @return {string} 去除html格式以后的字符串
		 */
		unescapeHTML: function() {
			var ag = document.createElement('div');
			var v = this.stripTags();
			if (v) {
				ag.innerHTML = v;
				return ag.childNodes[0].nodeValue;
			}else{
				return v;
			}
		},
		/**
		 * html解码<br>
		 * "&lt;" -> "<" <br>
		 * "&gt;" -> ">" <br>
		 * @return {string} html解码以后的字符串
		 */
		decodeHTML: function() {
			var s = this;
			s = s.replace(/&lt;/gi, "<");
			s = s.replace(/&gt;/gi, ">");
			s = s.replace(/&quot;/gi, "\"");			
			s = s.replace(/&nbsp;/gi, " ");
            s = s.replace(/&apos;/gi,"'");
            s = s.replace(/&#39;/gi,"'");
			s = s.replace(/&amp;/gi, "&");
			return s;
		},
		/**
		 * html编码<br>
		 * "<" -> &lt; <br>
		 * ">" -> &gt; <br>
		 * @return {string} html编码以后的字符串
		 */
		encodeHTML : function() {
			var s = this;
			s = s.replace(/&/g, "&amp;");
			s = s.replace(/</g, "&lt;");
			s = s.replace(/>/g, "&gt;");
			s = s.replace(/\"/g, "&quot;");
			s = s.replace(/ /g, "&nbsp;");
            s = s.replace(/\'/g, "&#39;");
			return s;
		},
		encodeXML : function() {
		    var s = this;
            return s.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&apos;");
        },
        decodeXML : function(){
            var s = this;
            return s.replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, "\"")
            .replace(/&apos;/g, "'")
            .replace(/&amp;/g, "&");
        },
		toCData : function(){
			var s = this;
			return "<![CDATA[ "+s+" ]]>";
		},
		toDate:function(){
				return  new Date(this.replace(/-/g,"/"));
		},
		/**
		 * 将字符串转成整型数字
		 * @return {number} 转换以后的数字，整型
		 */
		toInt : function() {
			var n = parseInt(this, 10);
			return (isNaN(n))?0:n;
		},
		/**
		 * 去掉字符串前后的空格
		 * @return {string} 去掉空格以后的字符串
		 */
		trim : function() {
			return this.replace(/(^\s*)|(\s*$)/g, "");
		},
		/**
		 * 去掉字符串所有与换行的空格
		 * @return {string} 去掉空格以后的字符串
		 */
		trimAll : function() {
			return this.replace(/[\s\t]*/g, "");
		},
		/**
		 * 检查字符串中是否含有特殊字符<br>
		 * 特殊字符包括：[,%'"/\;|<>^]<br>
		 * @return {boolean} 不含有特殊字符返回true,否则返回false
		 */
		checkSpecialChar : function() {
			var reg = /[,%\'\"\/\\;|\<\>\^]/;
			if (this.search(reg) != -1) {
				/*
				 * if (flag) { CC.alert("请不要输入 ＂, % \' \" \\ \/ ；|<>^＂等特殊字符。",
				 * function(){ try { func() } catch (exp) { } }); }
				 */
				return false;
			}
			return true;
		},
		/**
		 * 返回字符串的字节数，中文2个字节，其它1个字节
		 * @return {number} 字符串的字节数
		 */
		len : function() {
			var len = 0;
			for (var i = 0, l = this.length; i < l; i++) {
				if (this.charCodeAt(i) > 255) {
					len += 2;
				} else {
					len++;
				}
			}
			return len;
		},
		/**
		 * 从字符串左边开始截取指定的字符数
		 * @param {number} len 要截取的字符数
		 * @return {string} 截取以后的字符串
		 */
		lefts : function(len,isAddDot){
			var str = this;
			if(this.length>len){
				str = this.substring(0, len);
				if(isAddDot){
					str += "...";
				}
			}
			return str;	
		},
		/**
		 * 从字符串右边开始截取指定的字符数
		 * @param {number} len 要截取的字符数
		 * @return {string} 截取以后的字符串
		 */
		rights : function(len){
			return this.substring(this.length-len,this.length);	
		},
		/**
		 * 从字符串左边开始截取指定的字节数<br>
		 * 一个中文字符算两个字节，英文字符算一个字节<br>
		 * 如果截取的字节数不足最后一个中文字符，最后一个字符被截断。
		 * @param {number} len 要截取的字节数
		 * @return {string} 截取以后的字节串
		 * @example
		 * <code>
		 * var str = "ab中c国";
		 * var s1 = str.left(2); //return ab
		 * var s2 = str.left(6); //return ab中c
		 * var s3 = str.left(4); //return ab中
		 * var s4 = str.left(3); //return ab
		 * </code>
		 */
		left : function(len,isAddDot) {
			var i = 0;
			var j = 0;
			var ret = this;
			if (this.len() <= len) {
				return ret;
			}
			while (j < len) {
				if (this.charCodeAt(i) > 255) {
					j += 2;
				} else {
					j++;
				}
				i++;
			}
			ret = this.substring(0, i);
			if(ret.len()>len){
				ret = ret.substring(0,ret.length-1);
			}
			if(isAddDot){
				ret += "...";
			}
			return ret;
		},
		/**
		 * 从字符串右边开始截取指定的字节数<br>
		 * 一个中文字符算两个字节，英文字符算一个字节<br>
		 * 如果截取的字节数不足最后一个中文字符，最后一个字符被截断。
		 * @param {number} len 要截取的字节数
		 * @return {string} 截取以后的字节串
		 * @example
		 * <code>
		 * var str = "ab中c国";
		 * var s = str.right(2); //return 国
		 * var s = str.right(6); //return b中c国
		 * var s = str.right(4); //return c国
		 * </code>
		 */
		right : function(len) {
			var l = this.len();
			var i = 0;
			var j = 0;
			if (l <= len) {
				return this;
			}
			while (j < len) {
				if (this.charCodeAt(l-1-i) > 255) {
					j += 2;
				} else {
					j++;
				}
				i++;
			}
			var lg = this.length;
			var ret = this.substring(lg-i,lg);
			if(ret.len()>len){
				ret = ret.substring(1,ret.length);
			}
			return ret;
		},
		/**
		 * 判断字符串是否为数字
		 * @return {boolean} 是数字返回true,否则返回false
		 */
		isNumber : function() {
			return (this.search(/^\d+$/g) == 0);
		},
		/**
		 * 返回一个以bi为分隔符的字符串指定num个分隔符的位置
		 * @param {string} bi 分隔符
		 * @param {number} num 指定第几个分隔符
		 * @return {number} 
		 * @example
		 * <code>
		 * var posstr = "abc,def,ghi,ijklm";
		 * var n1 = posstr.posIndexOf(",",3); //n=11;
		 * var n2 = posstr.posIndexOf(",",2); //n=7;
		 * </code>
		 */
		posIndexOf : function(bi, num) {
			var ab = this.split(bi);
			if (ab.length - 1 < num) {
				return -1;
			} else {
				var len = 0;
				for (var i = 0, l = bi.length; i < num; i++) {
					len += ab[i].length;
					len += l;
				}
				return len - bi.length;
			}
		},
		/**
		 * 字符串转换成Json对象<br>
		 */
		parseJson : function() {
			/* from json1.js
			 try {
				return !(/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(this.replace(/'(\\.|[^"\\])*'/g, '')))&&eval('(' + this + ')');
			} catch (e) {
				ch("fStringParseJson", e);
				return false;
			}*/
			//from json2.js
			try {
				var text = this;
				var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
				cx.lastIndex = 0;
	            if (cx.test(text)) {
	                text = text.replace(cx, function (a) {
	                    return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
	                });
	            }
				if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))){
					return eval('(' + text + ')');
				}
			}catch (e) {
				ch("fStringParseJson", e);
				return false;
			}
		},
		stripScripts: function() {
			return this.replace(new RegExp( '<script[^>]*>([\u0001-\uFFFF]*?)</script>', 'img'), '');
		},
		/**
		 * 字符串是否存在于另外一个字符串中
		 * @param {Object} str 另一个字符串
		 * @param {Object} isCase 是否区分大小写,默认为false
		 */
		inStr:function(str,isCase){
			var v = this;
			var m = (isCase)?"":"i";
			var reg = new RegExp("\\b"+v+"\\b",m);
			return reg.test(str);
		},
		format:function(){
			//解决只能到8位的问题
			if (arguments.length>0) { 
				var result = this; 
				if (arguments.length == 1 && typeof (args) == "object") { 
				for (var key in args) { 
				var reg=new RegExp ("({"+key+"})","g"); 
				result = result.replace(reg, args[key]); 
				} 
				} 
				else { 
				for (var i = 0; i < arguments.length; i++) { 
				if(arguments[i]==undefined) 
				{ 
				return ""; 
				} 
				else 
				{ 
				var reg=new RegExp ("({["+i+"]})","g"); 
				result = result.replace(reg, arguments[i]); 
				} 
				} 
				} 
				return result; 
				} 
				else { 
				return this; 
			}
			/*var args = arguments;
			var str = this;
			var pattern = new RegExp('{([0-' + args.length + '])}', 'g');
			return String(str).replace(pattern, function(match, index) {
				return args[index];
			});*/
		}
	};
	Object.extend(String.prototype, new STRING());
	
	
	ARRAY.prototype = {
		/**
		 * 交换级数中n1和n2两个元素的位置
		 * @param {number} n1 要交换的第一元素
		 * @param {number} n2 要交换的第二个元素
		 */
		exchange : function(n1, n2) {
			if (Math.max(0, n1, n2) < 0|| Math.min(this.length - 1, n1, n2) > this.length- 1) {
				return;
			}
			var am = this[n1];
			this[n1] = this[n2];
			this[n2] = am;
		},
        /**
         * 删除数据组中指定索引的值
         * @param {Array} arr 要删除的索引数组，需要按照索引顺序排列
         * @param {Number} pos 相对偏移量，默认为0，传入大于0的数字将删除偏移量加索引
         */
        remove:function(arr,pos){
            pos = pos || 0;
            pos = Math.max(pos,0);
            for(var i=arr.length-1;i>=0;i--){
                this.splice(arr[i]+pos,1);
            }
        },
		/**
		 * 去掉数组中的空元素
		 */
		escapeNull : function() {
			var ge = [];
			for (var i = 0, len = this.length; i < len; i++) {
				if (this[i]) {
					ge[ge.length] = this[i];
				}
			}
			return ge;
		},
		/**
		 * 克隆数组
		 * @return {Array} 返回克隆的数组
		 */
		clone : function(isDeep){
			var temp = [];
			if(!isDeep){
				var ge = this.slice(0); 
				return ge;
			}else{
				for(var i=0;i<this.length;i++){
					temp.push(Object.clone(this[i]));
				}
				return temp;
			}
			
		},
		/**
		 * 删除数组中指定的元素
		 * @param {String} 要删除数组元素的值
		 * @return {Array} 删除指定元素以后的数组
		 */
		subtract: function(Alq){
			var ge = [];
			for(var i=0;i<this.length;i++) {
				var  s=this[i];
				if (s != Alq) {
					ge[ge.length] = s;
				}
			}
			return ge;
		},
		/**
		 * 用正则替换数组元素中的值
		 * @param {string} 正则表达式常量或字符串
		 * @return {Array} 替换以后的数组
		 */
		filter : function(reg) {
			for (var i = 0,s = this[i];i<this.length;i++){
				this[i] = s.replace(reg, "");
			}
		},
		/**
		 * 遍历数组
		 * @param {function} 遍历数组处理的函数
		 * @example
		 * <code>
		 * var a = ['a','b','c','d'];
		 * a.each(function(i,v){
		 * 	var index = i; //索引
		 *  var val = v;   //值
		 * });
		 * </code>
		 */
		each : function(func) {
			for (var i = 0, m = this.length; i < m; i++) {
				try {
					func(i, this[i]);
				} catch (exp) {
					if (exp == $break) {
						break;
					} else if (exp == $continue) {
						continue;
					} else {
						throw exp;
					}
				}
			}
		},
		/**
		 * 判断一个值是否存在于数组中
		 * @param {Object} value
		 * @return {boolean} 存在返回true,否则返回false
		 */
		has : function(value) {
			var r = false;
			this.each(function(i, ao) {
				if (ao == value) {
					r = true;
					//throw $break;
				}
			});
			return r;
		},
		/**
		 * 将数组转换成字符串,此方法重写在ie无效，原因暂且不明<br>
		 * 将数组转化成字符串请使用Array.join()
		 * @param {string} 连接符，默认为 ""
		 */
		toString : function(sep) {
			sep = sep || "";
			return this.join(sep);
		},
		/**
		 * 去除数组中重复项，返回值唯一的数组(去掉空值)
		 * @param {function} 取值函数
		 * <code>
		 *  var arr = [9,1,3,8,7,7,6,6,5,7,8,8,7,4,3,1];
		 *	var newarr = arr.unique();
		 *	//也可以对过滤对象数组
		 *  var arr = [
		 *  	{ name : "test1", value : "value1" },<br>
		 *      { name : "test1", value : "value1" },<br>
		 *      { name : "test2", value : "value2" } <br>
		 *  ];
		 *  //过滤value相同的元素
		 *  var newarr = arr.unique(funmction(v){
		 *  	return v.value;
		 *  });
		 * </code>
		 */
		unique : function(func){
            //高效算法
            var a = {};
            if(typeof(func)=="function"){
                this.each(function(i,v){
                    var t = func(v);
                    if (typeof(a[t])=='undefined'&&t!=""){
                        a[t] = v;
                    }
                });
                this.length=0; 
                for(var i in a){
                    this[this.length] = a[i];
                }
            }else{
                this.each(function(i,v){
                    if (typeof(a[v])=='undefined'&&(typeof(v)=="number" || v!="")){
                        a[v] = typeof(v)=="number"?1:2;
                    }
                }); 
                this.length=0; 
                for(var j in a){
                    this[this.length] = a[j]==1?parseInt(j,10):j;
                }
            }
            return this;
        },
		/**
		 * 去除数组中重复项，返回被去除值组成的数组
		 */
	    strip : function(){
	        if (this.length < 2){
				return [];
			}  
	        var arr = [];
	        var del = [];
	        for (var i = 0; i < this.length; i++) {
	            arr.push(this.splice(i--, 1).toString());
	            for (var j = 0; j < this.length; j++) {
	                if (this[j] == arr[arr.length - 1]) {
	                    del.push(this.splice(j--, 1).toString());
	                }
	            }
	        }
	        return del;
	    }
		
	};
	Object.extend(Array.prototype, new ARRAY());
	
	
	DATE.prototype = {
		/**
		 * 将日期加上指定的天数
		 * @param {numer} n
		 * @return {Date} 加上n天以后的日期对象
		 */
		dateAdd : function(n) {
			return new Date(this.valueOf() + n * 3600 * 24 * 1000);
		},
		addMonth:function(n){
			this.setMonth(this.getMonth() + n);
			return this;

		},
		/**
		 * 为日期增加指定的毫秒
		 */
		addMilliseconds : function(n){
			return new Date(this.valueOf() + n);
		},
		/**
		 * 格式化日期对象成字符串输出<br>
		 * n的格式参考 Util.formatDate 方法
		 * @param {Object} n
		 * @return {string} 格式化以后的日期
		 */
		format : function(n) {
			return Util.formatDate(this,n);
		},
		/**
		 * 日期对象转换成字符串,与format功能相同<br>
		 * n的格式参考 Util.formatDate 方法
		 * @param {Object} n
		 * @return {string} 转换成字符串以后的日期
		 * ie8下有bug，该方法去掉，暂时不用
		 */
		//toString : function(n){
		//	return Util.formatDate(this,n);
		//}
		/*
		 * 计算两日期的差值
		 * @param {string} | {date} d
		 * @return {int} 两日期的毫秒差
		 */
		dateDiff : function(d){
			try{
				var d = d instanceof Date ? d : new Date(d);				
				return this.getTime() - d.getTime();
			}
			catch(e){
				return 0;
			}
		}
	};
	Object.extend(Date.prototype, new DATE());
	
	FUNCTION.prototype = {
		apply: function(v, argu){
			var s;
			if (v) {
				v._caller = this;
				s = " obj._caller ";
			} else {
				s = " this ";
			}
			var a = [];
			for (var i = 0, l = argu.length; i < l; i++) {
				a[i] = " argu[ " + i + " ] ";
			}
			return eval(s + " ( " + a.join(" , ") + " ); ");
		},
		call: function(v){
			var a = [];
			for (var i = 1, l = arguments.length; i < l; i++) {
				a[i - 1] = arguments[i];
			}
			return this.apply(v, a);
		},
		bind: function(){
			var p1 = this, args = new Hashtable(arguments).toArray(), object = args.shift();
			return function(){
				return p1.apply(object, args.concat(new Hashtable(arguments).toArray()));
			};
		}
	};
	if (typeof Function.prototype.apply != "function") {
		Object.extend(Function.prototype, new FUNCTION());
	}
	/**
	 * @ignore
	 */
	Function.prototype.bind = function() {
		var p1 = this, args = new Hashtable(arguments).toArray(), object = args.shift();
		return function() {
			return p1.apply(object, args.concat(new Hashtable(arguments).toArray()));
		};
	};
	
	
	/**
	 * Hashtable类
	 */
	Hashtable.prototype = {
		/**
		 * HashTable类的构造方法
		 */
		initialize : function() {
			this.ks = {};
			this.type = "object";
			this.isHash = true;
			if (arguments.length > 0) {
				var arg = arguments[0];
				if (typeof arg == "object") {
					if (this.isArray(arg)) {
						this.type = "array";
						this.ks = [];
						for (var i = 0, l = arg.length; i < l; i++) {
							this.add(i, arg[i]);
						}
					} else {
						for (var ao in arg) {
							this.add(ao, arg[ao]);
						}
					}
				}
			}
		},
		/**
		 * 添加一个键值
		 * @param {Object} key key值
		 * @param {Object} value value值
		 */
		add : function(key, value) {
			if (value && value.nodeType && value.nodeType == 1) {
				value = $(value);
			}
			if (key && key.nodeType && key.nodeType == 1) {
				key = $(key);
			}
			if (this.type == "object") {
				if (typeof(key) != "undefined") {
					if (this.contains(key) == false) {
						this.ks[key] = typeof(value) == "undefined"?null:value;
						return true;
					} else {
						return false;
					}
				} else {
					return false;
				}
			} else {
				if (typeof(value) != "undefined" && typeof(key) != "undefined") {
					this.ks[key] = value;
					return true;
				} else if (typeof(key) != "undefined") {
					this.ks[this.ks.length] = key;
					return true;
				} else {
					return false;
				}
			}
		},
		/**
		 * 删除一个键值　
		 * @param {Object} key key值
		 */
		remove : function(key) {
			delete this.ks[key];
		},
		/**
		 * 以值删除一个键值
		 * @param {Object} v 要删除的value
		 */
		removeByObj : function(v) {
			for (var k in this.ks) {
				if (this.ks[k] == v) {
					if (this.Asf == "array") {
						this.ks = this.ks.splice(k);
					} else {
						delete this.ks[k];
					}
				}
			}
		},
		/**
		 * 返回总数
		 */
		count : function() {
			if (this.type == "array") {
				return this.ks.length;
			}
			var i = 0;
			for (var k in this.ks) {
				i++;
			}
			return i;
		},
		/**
		 * 元素集合
		 * @param {Object} key key值
		 */
		items : function(key){
			return this.ks[key];
		},
		/**
		 * 是否包含指定的key值
		 * @param {Object} key
		 */
		contains : function(key) {
			return typeof(this.ks[key]) != "undefined";
		},
		/**
		 * 是否包含指定的value值
		 * @param {Object} s
		 */
		has : function(s) {
			for (var k in this.ks) {
				if (this.ks[k] == s) {
					return true;
				}
			}
			return false;
		},
		/**
		 * 清空对象
		 */
		clear : function() {
			for (var k in this.ks) {
				delete this.ks[k];
			}
		},
		/**
		 * 连成一个字符串
		 * @param {Object} Ajg 连接符
		 */
		join : function(Ajg) {
			var ab = [];
			for (var k in this.ks) {
				ab[ab.length] = (this.ks[k] + "");
			}
			return ab.join(Ajg);
		},
		/**
		 * 遍历对象
		 * @param {Object} func 遍历执行的函数　
		 */
		each : function(func) {
			try {
				if (this.type == "object") {
					for (var k in this.ks) {
						try {
							func(k, this.ks[k]);
						} catch (e) {
							if (e != $continue){
								throw e;
							}	
						}
					}
				} else {
					for (var l = 0; l < this.ks.length; l++) {
						try {
							func(l, this.ks[l]);
						} catch (e) {
							if (e != $continue){throw e;}	
						}
					}
				}
			} catch (e) {
				if (e != $break){throw e;}		
			}
		},
		/**
		 * 转换成数组
		 */
		toArray : function() {
			var ab = [];
			this.each(function(ao, value) {
				ab[ab.length] = value;
			});
			return ab;
		},
		/**
		 * @private
		 * @ignore
		 */
		isArray : function(ao) {
			return (ao && ao instanceof Array);
		}
	};
	
	/**
	 * 邮件地址对象 形如："name" <mail@126.com>
	 * @param {String} n 姓名
	 * @param {String} a email地址
	 */
	Email.Value = cmail.createClass();
	Email.Value.prototype = {
		/** 姓名 */
		name : "",
		/** 邮件地址*/
		value: "",
        /** "名字" <邮箱地址>格式 */
        email:"",
		/** 
		 * toString方法 
		 * @param {Object} isNoName 是否包含姓名
		 */
		toString : function(isNoName) {
			var s;
			if (isNoName) {
				s = this.value;
			} else {
				s = '"' + this.name + '" <' + this.value + '>';
			}
			return s;
		},
		/**
		 * 构造函数
		 */
		initialize : function(n, a) {
			this.name = n;
			this.value = a;
            this.email = '"' + n + '" <' + a + '>';
		}
	};
	/**
	 * 匹配Email地址
	 * @param {String} t Email字符串
	 */
	Email.match = function(t){
		var name = "";
		var value = "";
        t = t || "";
		var mail = t.trim();
		mail = mail.replace(/\r\n|\n|\t/g,"");
        var regAll = [];
		regAll[regAll.length] = /^(([A-Z0-9._%-]{1,255})@[A-Z0-9._%-]+\.[A-Z0-9]{1,10})$/i;
		regAll[regAll.length] = /^["'](.*?)["']\s*<([A-Z0-9._%-]{1,255}@[A-Z0-9._%-]+\.[A-Z0-9]{1,10})>$/i;
        regAll[regAll.length] = /^["'](.*?)\s*<([A-Z0-9._%-]{1,255}@[A-Z0-9._%-]+\.[A-Z0-9]{1,10})>["']$/i;
		regAll[regAll.length] = /^(.*?)\s*<([A-Z0-9._%-]{1,255}@[A-Z0-9._%-]+\.[A-Z0-9]{1,10})>$/i;
        if(!mail){
			return false;
		}
        var match = null;
		try {
            for (var ireg = 0; ireg < regAll.length; ireg++) {
                var reg = regAll[ireg];
                match = reg.exec(mail);
                if (match != null) {
                    if(ireg==0){
                        value = match[1];
                        name = match[2];
                    }else{
                        value = match[2];
                        name = match[1];
                    }
                    return new Email.Value(name.trim(), value.trim());
                }
            }
            return false;
        }catch(e){
            return false;
        }
	};
	
	/**
	 * 得到email地址，返回正确与错误的email地址 {success:[email obj],fail:[email string]}
	 * @param {String|Array} v 邮件地址 
	 * @param {Boolean} 是否去除重复
	 */
	Email.get = function(v,isunique) {
		var s = new Email(), f = [];
		if (typeof(v) == "string" && v.trim() != "") {
			var ml = v.replace(/\r\n|\n/g,"");
			ml = ml.replace(/[,;，；]+/g, ",");
			ml = ml.replace(/^,|,$/g,"");
			var ma = ml.split(",");
			ma.each(function(i, value) {
				var r = Email.match(value);
				if (r) {
					s.add(r);
				} else {
					f.push(value.encodeHTML());
				}
			});
		} else if (typeof v == "object" && v instanceof Array) {
			v.each(function(i, value) {
				var r = Email.match(value);
				if (r) {
					s.add(r);
				} else {
					f.push(value.encodeHTML());
				}
			});
		}
		if(isunique){
			s.unique();
			f = f.unique();
		}
		return {
			success : s,
			fail : f
		};
	};
	Email.getEmailString = function(str,isnoname,sep){
		return Email.get(str,true).success.toString(sep,isnoname);
	};
	/**
	 * 取得email地址中的名字
	 * @param {Object} v
	 */
	Email.getName = function(v) {
		var r = Email.match(v);
		if (r) {
            if(r.name.trim() == '' && v.indexOf('>')){
                var sr = Email.match(v.substr(v.indexOf('<')+1, v.indexOf('>') - v.indexOf('<')-1));
                if(sr){
                    return sr.name;
                }
            }
			return r.name;
		}
		return v;
	};
	/**
	 * 取得email地址中的邮件地址
	 * @param {Object} v
	 */
	Email.getValue = function(v) {
		var r = Email.match(v);
		if (r) {
			return r.value;
		}
		return r;
	};
	Email.format = function(s) {
		try {
			var t = s + "";
			return t.replace(/(\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*)/g,'<a href="mailto:$1">$1</a>');
		} catch (exp) {
			ch("Email.Format", exp);
			return s;
		}
	};
	Email.prototype = {
		add : function(v) {
			if (typeof v == "string") {
				var r = Email.match(v);
				if (r) {
					this.list.push(r);
				}
				return r;
			} else if (v instanceof Object) {
				this.list.push(v);
				return v;
			}
			return null;
		},
		unique:function(){
			this.list = this.list.unique(function(v,i){
				return v.value;
			});
		},
		remove : function(s) {
			this.each(function(i, v) {
				if (v.value == s) {
					this.list.splice(i,1);
				}
			});
		},
		has : function(s) {
			var r = false;
			this.each(function(i, v) {
				if (v.value == s) {
					r = true;
				}
			});
			return r;
		},
		each : function(f) {
			for(var i=0;i<this.list.length;i++){
				f(i, this.list[i]);
			}
		},
		toString : function(s, isNoName) {
			var s1 = s || ";";
			var r = this.toArray(isNoName);
			return r.join(s1);
		},
		toArray : function(isNoName) {
			var r = [];
			this.each(function(i, m) {
				r.push(m.toString(isNoName));
			});
			return r;
		},
		/**
		 * 构造函数
		 */
		initialize : function() {
			this.list = [];
		}
	};
	
	
	/**
	 * 判断一个DOM Node对象是否处于显示状态
	 * @param {object} element DOM Node对象
	 * @return {boolean}
	 */
	El.visible = function(element) {
	    if (arguments.length == 0){
	        throw ("请使用El.visible，并且需要参数");	        
	    }
		//var ret = true;	
		//var tag = El.getNodeType(element);
		//while(tag!="body"){
			//tag = El.getNodeType(element);
			//if(element.style.display=="none"){
				//ret = false;
				//break;
			//}
		//}
		return (element == undefined || element.style.display=="none")?false:true;
	};
	/**
	 * 切换DOM Node对象显示状态。多个对象用,分隔
	 * @param {object} dom对象
	 */
	El.toggle = function() {
		if (arguments.length == 0) {
		    return;			
		} else {
			for (var i = 0; i < arguments.length; i++) {
				var aa = $(arguments[i]);
				if (aa) {
					if(El.visible($(aa))){
						 El.hide(aa);
					}else{
						El.show(aa);
					}
				}
			}
		}
	};
	/**
	 * 隐藏DOM Node对象。 多个对象用,分隔
	 * @param {object} DOM Node对象
	 */
	El.hide = function() {
		if (arguments.length == 0) {
		    return;
		} else {
			for (var i = 0; i < arguments.length; i++) {
				var aa = $(arguments[i]);
				if (aa) {
					aa.style.display = 'none';
				}
			}
		}
	};
	/**
	 * 显示DOM Node对象。 多个对象用,分隔
	 * @param {object} DOM Node对象
	 */
	El.show = function() {
		if (arguments.length == 0) {
		    return;			
		} else {
			for (var i = 0; i < arguments.length; i++) {
				var aa = $(arguments[i]);
				if (aa) {
					aa.style.display = 'block';
				}
			}
		}
	};
	/**
	 * 移除DOM Node对象。 多个对象用,分隔
	 * @param {object||string} DOM Node对象||对象id
	 */
	El.remove = function() {
		if (arguments.length == 0) {
		    return;		    
		} else {
			var an;
			for (var i = 0; i < arguments.length; i++) {
				an = $(arguments[i]);
				if(an){
					an.innerHTML = "";
					if(an.parentNode)
						an.parentNode.removeChild(an);
					if (Browser.isIE){
					    an.removeNode(); 
					}
				}
				
			}			
		}
	};
	/**
	 * 移除一个元素下面所有的字节点
	 * @param {Object} aa
	 */
	El.removeChildNodes = function(aa){
		if(aa){
			var o = aa.childNodes;
			if(o){
				for(var i=o.length-1;i>-1;i--){
					aa.removeChild(o[i]);
				}
			}
			
		}
	};			
	/**
	 * 插入一个dom元素。<br>
	 * @param {node} aa 插入的参考对象
	 * @param {node} v 要插入的对象
	 * @param {string} nj 插入对象的方式nj为插入节点的方式，取值为以下四种：   <br>
	   beforeBegin: 将 v 插到 aa 的开始标签之前。 
	   afterBegin : 将 v 插到 aa 的开始标签之后，但是在 aa 的所有原有内容之前。<br> 
 	   beforeEnd  : 将 v 插到 aa 的结束标签之前，但是在 aa 的所有原有内容之后。<br>
	   afterEnd   : 将 v 插到 aa 的结束标签之后。 <br>
	 */
	El.insertElement = function(aa, v, nj) {
		try {
			if (arguments.length == 2) {
			    return;
			}
			var da = aa.parentNode;
			if(!da){
				return;
			}
			var Aog = da.childNodes.length;
			var All = -1;
			for (var i = 0; i < Aog; i++) {
				if (da.childNodes[i] == aa) {
					All = i;
				}
			}
			if (nj == "beforeEnd") {
				aa.appendChild(v);
			} else if (nj == "afterEnd") {
				if (All == Aog - 1) {
					da.appendChild(v);
				} else {
					da.insertBefore(v, da.childNodes[All + 1]);
				}
			} else if (nj == "beforeBegin") {
				da.insertBefore(v, aa);
			} else if (nj == "afterBegin") {
				if (aa.childNodes.length == 0) {
					aa.appendChild(v);
				} else {
					aa.insertBefore(v, aa.childNodes[0]);
				}
			}
		} catch (exp) {
			ch("fInsertElement", exp.description);
		}
	};
	/**
	 * 得到指定节点对象的上一个节点对象
	 * @param {Object} aa
	 * @return {Node} 上一个节点对象
	 */
	El.prev = function(aa) {
		try {
			if (!aa) {
			    return;				
			}
			var da = aa.parentNode;
			El.cleanWhitespace(da);
			var fa = da.childNodes;
			for (var i = 0, l = fa.length; i < l; i++){
				if (fa[i] == aa) {
					if (i == 0) {
						return null;
					} else {
						return fa[i - 1];
					}
				}
			}
		} catch (exp) {
			ch("El.prev()", exp.description);
		}
	};
	El.next = function (aa){
		try {
			if (!aa) {
			    return;				
			}
			var da = aa.parentNode;
			El.cleanWhitespace(da);
			var fa = da.childNodes;
			for (var i = 0, l = fa.length; i < l; i++){
				if (fa[i] == aa) {
					if (i == l-1) {
						return null;
					} else {
						return fa[i + 1];
					}
				}
			}
		} catch (exp) {
			ch("El.next()", exp.description);
		}
	};
	/**
	 * 创建对象，并指定对象id<br>
	 * 注意在使用完毕后将返回的对象 手工回收g(a);
	 * @param {string} Arb html标签
	 * @param {string} sId id
	 * @param {string} class className 
	 * @param {object} doc 创建该元素的document对象。(ie Bug,a页面创建的元素，不能添加到b页面)
	 * @param {object} po 其它属性值
	 * @return {HtmlElement} HtmlElement对象 
	 */
	El.createElement = function(Arb, sId, className,doc,po) {
		doc = doc || document;
		if(sId){
			var ao = doc.getElementById(sId);
			if (ao) {
				El.remove(ao);
			}
		}
		po = po || {};
		try {
			var aa = doc.createElement(Arb);
			if (sId) {
				aa.id = sId;
			}
			if(className){
				aa.className = className;
			}
			for(var n in po){
				aa.setAttribute(n,po[n]);
			}
			return aa;
		} catch (e) {
			return null;
		}
	};
	/**
	 * 给对象设置属性
	 * @param {object} aa 要设置属性的对象
	 * @param {object} rl json对象格式
	 * @example 
	 * <code>
	 * //设置obj对象min和max属性的值
	 * El.setAttr(obj,{
	 * 	min:1,
	 * 	max:5			
	 * });
	 * </code> 
	 */
	El.setAttr = function(aa, rl) {
		if (arguments.length == 1) {
		    return;
		}
		for (var ao in rl) {
			aa[ao] = rl[ao];
		}
	};
	
	El.setAttribute = function(aa, rl) {
        if (arguments.length == 1) {
            return;
        }
        for (var ao in rl) {
            aa.setAttribute(ao,rl[ao]);
        }
    };
    /**
     * 移除属性
     * @param {Object} obj
     * @param {Object} names
     */
    El.removeAttr = function(obj,names){
        for(var i=0;i<names.length;i++){
            obj.removeAttribute(names[i]);
        }
    };
	/**
	 * 设置CSS样式
	 * @param {object} aa 要设置CSS样式的元素
	 * @param {object} ni CSS样式对象 
	 * @example 
	 * <code>
	 * //给div对象设置CSS样式
	 * El.setStyle(div,{
        display: "block",
        position: "absolute",
        zIndex: "9",
        width: w + "px",
        height: h + "px"
    });
	 * </code>
	 */
	El.setStyle = function(aa, ni) {
		if (arguments.length >= 2) {
		   for (var ao in ni) {
				aa.style[ao] = ni[ao];
			} 
		}
	};
	/**
	 * 给对象dom元素添加class
	 * @param {Object} aa dom node对象
	 * @param {Object} bn 要添加class名称
	 */
	El.addClass = function(aa, bn) {
		if (arguments.length >= 2) {
		  var c = aa.className.trim();
			if(!c){
				aa.className = bn;
				return;
			}
			var Alj = " " + c + " ";
			var ew = " " + bn + " ";
			if (Alj.indexOf(ew) == -1) {
				aa.className = c + " " + bn;
			}  
		}
	};
	/**
	 * 给对象dom元素移除class
	 * @param {Object} aa dom node对象
	 * @param {String} bn 要移除class名称
	 */
	El.removeClass = function(aa, bn) {
		if (arguments.length >= 2) {
		  if(!bn){
				aa.className = "";
				return;
			}
			var Acf = aa.className.split(" ");
			var ab = [];
			var co = false;
			for (var i = 0; i < Acf.length; i++) {
				if (Acf[i].trim() != bn) {
					ab[ab.length] = Acf[i];
				} else {
					co = true;
				}
			}
			if (co) {
				var c = ab.join(" ").trim();
				if(c){
					aa.className = ab.join(" ").trim();
				}else{
					aa.className = "";
				}	
			}  
		}
	};
	/**
	 * 设置dom元素的class
	 * @param {Object} aa dom node对象
	 * @param {Object} bn class名称
	 */
	El.setClass = function(aa, bn) {
		if (arguments.length == 2) {
		   	if(aa){
				aa.className = bn;
			}
		}
		
	};
	/**
	 * 删除dom元素的class
	 * @param {Object} aa DOM Node对象
	 * @param {Object} bn class名称
	 */
	El.delClass = function(aa, bn) {
		if (arguments.length >= 2) {
		    aa.className = aa.className.replace(bn, "");
			//aa.className = aa.className.replace(bn, "");
		}
	};
	/**
	 * 得到dom元素离窗口左边的距离（像素）
	 * @param {Object} aa
	 * @return {number} 
	 */
	El.getX = function(aa) {
		if (aa) {
		  	var l = aa.offsetLeft;
			var bb = aa.offsetParent;
			while (bb) {
				l += bb.offsetLeft;
				bb = bb.offsetParent;
			}
			return l;  
		}
		
	};
	/**
	 * 得到dom元素离窗口上边的距离y（像素）
	 * @param {Object} aa dom node对象
	 * @return {number} 
	 */
	El.getY = function(aa) {
		if (aa) {
		   var t = aa.offsetTop;
			var bb = aa.offsetParent;
			while (bb) {
				t += bb.offsetTop;
				bb = bb.offsetParent;
			}
			return t; 
		}
	};
	El.getParentNodeIsTag = function(el,tag){
		 tag = tag.toLowerCase();
		 el = $(el);
		 var iMax = 20;
		 var i=0;
		 var ret = null;
		 while (el&&i<iMax) {
            var t = El.getNodeType(el);
			if (t==tag) {
                ret = el;
                break;
				
            }else if(t=="body"){
               break;
            }else{
				el = el.parentNode;
				i++;
			}
        }
		return ret;
	};
	El.getParentNodeIsId = function(el,Id){
		 id = id.toLowerCase();
		 el = $(el);
		 var iMax = 20;
		 var i=0;
		 var ret = null;
		 while (el&&i<iMax) {
            var t = El.getNodeType(el);
			if(t==tag){
                ret = el;
                break;
            }else if(t=="body"){
               break;
            }else{
				el = el.parentNode;
				i++;
			}
        }
		return ret;
	};
	/**
	 * 得到或设置dom元素离的位置 [x,y]（像素）
	 * @param {Object} aa dom node对象
	 * @param {ojbect} lt 位置{left:300,top:200}
	 * @return {object} [x,y] 
	 */
	El.pos = function(aa,lt) {
		if (!aa) {
		    return;
		}
		if (!lt) {
			var valueT = 0, valueL = 0;
			do {
				valueT += aa.offsetTop || 0;
				valueL += aa.offsetLeft || 0;
				aa = aa.offsetParent;
			} while (aa);
			return [valueL, valueT];
		}else{
			if (typeof(lt.left) != "undefined") {
				var left = (lt.left>0)?lt.left:0;
				aa.style.left = left + "px";
			}
			if (typeof(lt.top) != "undefined") {
				var top = (lt.top>0)?lt.top:0;
				aa.style.top = top + "px";
			}
		}
	};
	El.replace = function(element, html) {
		if (html) {
		    element = $(element);
			if (element.outerHTML) {
				element.outerHTML = html;
			} else {
				var range = element.ownerDocument.createRange();
				range.selectNodeContents(element);
				element.parentNode.replaceChild(range.createContextualFragment(html), element);
			}
			return element;
		}
		
	};
	/**
	 * 得到dom元素的实际宽高[width:w,height:h]（像素）
	 * @param {Object} element dom node对象
	 * @return {object}{
	 * 	width:200,
	 * 	height:100
	 * } 
	 */
	El.getSize = function(element){
		if (!element || !$(element).style) {
		    return {
				width: 0,
				height: 0
			};
		}
		element = $(element);
		var display = $(element).style.display;
		if (display != 'none' && display != null) {
			return {
				width: element.offsetWidth,
				height: element.offsetHeight
			};
		}
		var els = element.style;
		var originalVisibility = els.visibility;
		var originalPosition = els.position;
		var originalDisplay = els.display;
		els.visibility = 'hidden';
		els.position = 'absolute';
		els.display = 'block';
		var originalWidth = element.clientWidth;
		var originalHeight = element.clientHeight;
		els.display = originalDisplay;
		els.position = originalPosition;
		els.visibility = originalVisibility;
		return {
			width : originalWidth,
			height : originalHeight
		};
	};
	El.getDimensions = function(element){
		return El.getSize(element);
	};
	/**
	 * 获取或设置dom元素的高度
	 * @param {Object} el dom对象
	 * @param {number} h 高度
	 * @return {null||Number} 高度值 
	 */
	El.height = function(el,h){
		if(h){
			El.setSize(el,{height:h});
		}else{
			return El.getSize(el).height;
		}
	};
	/**
	 * 获取或设置dom元素的宽度
	 * @param {Object} el dom对象
	 * @param {number} h 高度
	 * @return {null||Number} 宽度值 
	 */
	El.width = function(el,w){
		if(w){
			El.setSize(el,{width:w});
		}else{
			return El.getSize(el).width;
		}
	};
	/**
	 * 去掉element对象中的空白节点
	 * @param {Object} element element对象
	 */
	El.cleanWhitespace = function(element) {
		if (!element) {
		    return;
		}
		element = $(element);
		var childs = element.childNodes;
		for (var i = childs.length - 1; i > -1; i--) {
			var node = childs[i];
			if (node.nodeType == 3 && !(/\S/.test(node.nodeValue))){
				element.removeChild(node);
			}	
		}
		return element;
	};
	El.descendantOf = function(v, ancestor) {
		if (!ancestor) {
		    return;
		} 
		var element = $(v); 
		ancestor = $(ancestor);
		while (element) {
			if (element == ancestor) {
				return true;
			}
			element = element.parentNode;
		}
		return false;
	};
	/**
	 * 设置dom元素的宽高
	 * @param {Object} obj dom 对象
	 * @param {Object} wh json对象{
	 * width:400,
	 * height:200
	 * }
	 */
	El.setSize = function(obj,wh){
		if (arguments.length == 1) {
		    return;
		}
		if(obj){
			if (typeof(wh.width) != "undefined") {
				var w = (wh.width>0)?wh.width:0;
				obj.style.width = w + "px";
			}
			if (typeof(wh.height) != "undefined") {
				var h = (wh.height>0)?wh.height:0;
				obj.style.height = h + "px";
			}
		}
		
	};
	/**
	 * 获得窗口的高度
	 * @param {Object} win windows对象,默认为当前窗口
	 * @param {Boolean} isFrame 是否iframe窗口
	 */
    El.docHeight = function (win,isFrame){
        try {
            var doc = window.document;
            var objWin = window;
            if (win) {
                objWin = win;
                doc = win.document;
            }
            if(isFrame){
                return objWin.innerHeight || doc.body.offsetHeight;
            }else{
               if (Browser.isIE) {
                    return objWin.innerHeight || doc.documentElement.clientHeight;
                } else {
                    return objWin.innerHeight;
                } 
            }
            
        } catch (e) {}
    };
	/**
	 * 获得窗口的宽度
	 * @param {Object} win windows对象,默认为当前窗口
	 */
    El.docWidth = function (win){
        try {
            var doc = document;
            var objWin = self;
            if (win) {
                objWin = win;
                doc = win.document;
            }
            if (Browser.isIE) {
                return doc.documentElement.offsetWidth || doc.body.offsetWidth;
            } else {
                return objWin.innerWidth;
            }
        } catch (e) {}
    };
	/**
	 * 得到一个dom对象的类型
	 * div,span,a,img等是返回tagName<br>
	 * inpu返回type<br>
	 * @param {Object} node dom对象
	 * @param {Boolean} 是否返回input对象的类型
	 * @return {string} 类型 
	 */
	El.getNodeType = function (node,isInputType){
        var tag = node.tagName;
		if (tag) {
			tag = tag.toLowerCase();
			var t = (tag == "input" && isInputType) ? node.type : tag;
			return t.toLowerCase();
		}
	};
    El.getCursorPos = function(obj){
        var pos = 0;	        
        // IE Support
    	if (document.selection) {
            obj.focus();
            var Sel = document.selection.createRange();
            Sel.moveStart('character', -obj.value.length);
            pos = Sel.text.length;
        } //Firefox support
        else if (obj.selectionStart || obj.selectionStart == '0') {
            CaretPos = obj.selectionStart;
        }
    	return (CaretPos);  
    };
    /**
     * 移动光标位置
     */
    El.setCursorPos = function(obj,l){
        if(obj){
            var len = l;
            var type = this.getNodeType(obj);
            if(type=="text" || type=="textarea"){
                len = obj.value.length;
            }else{
                len = obj.innerHTML.length;
            }
            if(l && l>0){
                len = l;
            }
            if(obj.setSelectionRange){
        		obj.focus();
        		obj.setSelectionRange(len,len);
        	}else if (obj.createTextRange) {
        		var range = obj.createTextRange();
        		range.collapse(true);
        		range.moveEnd('character', len);
        		range.moveStart('character', len);
        		range.select();
        	}
        }
    };
	/**
	 * 文档加载完成的方法
	 * @param {Object} fn 执行的函数
	 * @param {Object} ifr window对象
	 */
	/*El.ready = function(fn,ifr){
		var doc = ifr || document;
		var win = (ifr ||window);
		var f = win.onload;
		var callback = function(){	
			if(typeof(f)=="function"){
				f();
			}
			fn();
		};
		// Mozilla, Opera (see further below for it) and webkit nightlies currently support this event
		if (doc.addEventListener && Browser.value!="opera") {
			// Use the handy event callback
			doc.addEventListener("DOMContentLoaded",callback, false);
		}
		// If IE is used and is not in a frame
		// Continually check to see if the document is ready
		if (Browser.value=="ie" && window == top){
			(function(){
				try {
					// If IE is used, use the trick by Diego Perini
					// http://javascript.nwbox.com/IEContentLoaded/
					doc.documentElement.doScroll("left");
				} catch(error){
					setTimeout(arguments.callee,0);
					return;
				}
				// and execute any waiting functions
				callback();
			})();
		}
	
		if (Browser.value == "opera") {
			doc.addEventListener("DOMContentLoaded", function(){
				//if (jQuery.isReady) return;
				for (var i = 0; i < document.styleSheets.length; i++){
					if (doc.styleSheets[i].disabled) {
						setTimeout(arguments.callee, 0);
						return;
					}
				} 
				//and execute any waiting functions
				callback();
			}, false);
		}
		if (Browser.value=="safari") {
			var numStyles;
			(function(){
				//if (jQuery.isReady) return;
				if (doc.readyState != "loaded" && doc.readyState != "complete" ) {
					setTimeout(arguments.callee, 0 );
					return;
				}
				//if (numStyles === undefined )
				//	numStyles = jQuery("style, link[rel=stylesheet]").length;
				//if (doc.styleSheets.length != numStyles ) {
				//	setTimeout(arguments.callee, 0 );
				//	return;
				//}
				//and execute any waiting functions
				callback();
			})();
		}
		// A fallback to window.onload, that will always work
		win.onload = callback;
	};*/
   El.ready = function(onready,config){
        config = config || {};
        //浏览器检测相关对象，在此为节省代码未实现，实际使用时需要实现。
        //var Browser = {};
        //设置是否在FF下使用DOMContentLoaded（在FF2下的特定场景有Bug）
        this.conf = {
            enableMozDOMReady: true
        };
        if (config) {
            for (var p in config) {
                this.conf[p] = config[p];
            }
        }
        
        var isReady = false;
        function doReady(){
            if (isReady) return;
            //确保onready只执行一次
            isReady = true;
            onready();
        }
        /*IE*/
        if (Browser.isIE) {
            (function(){
                if (isReady) return;
                try {
                    document.documentElement.doScroll("left");
                } catch (error) {
                    setTimeout(arguments.callee, 0);
                    return;
                }
                doReady();
            })();
            window.attachEvent('onload', doReady);
        }    /*Webkit*/
        else if (Browser.value == "webkit" && Browser.version < 525) {
            (function(){
                if (isReady) return;
                if (/loaded|complete/.test(document.readyState)) doReady();
                else setTimeout(arguments.callee, 0);
            })();
            window.addEventListener('load', doReady, false);
        }    /*FF Opera 高版webkit 其他*/
        else {
            if (!Browser.value == "firefox" || Browser.version != 2 || this.conf.enableMozDOMReady) document.addEventListener("DOMContentLoaded", function(){
                document.removeEventListener("DOMContentLoaded", arguments.callee, false);
                doReady();
            }, false);
            window.addEventListener('load', doReady, false);
        }
    };
   
	El.getParentWin = function(cWin,sWin){
		var str = "";
		if(cWin&&sWin){
			var win = cWin;
			while(win!=sWin){
				win = cWin.parent;
				str += "parent.";
			}
		}
		return str;
	};	
    El.getSelect = function(win){
        var r="";
        win = win || window;
        if(win.document.selection){
            r=win.document.selection.createRange().text;
        }else if(window.getSelection()){
            r=window.getSelection();
        }else{
            r="";
        }

    };
    El.gc = function(d){
        if(!d){
            return;
        }
        try {
            var eventList = ['onmouseover', 'onmouseout', 'onmousedown', 'onmouseup','onmousemove', 'ondblclick', 'onclick', 'onselectstart', 'oncontextmenu', 'onkeyup', 'onkeydown', 'onkeypress','onload'];
            for (var i = 0; i < eventList.length; i++) {
                d[eventList[i]] = null;
            }
            if (d.childNodes) {
                for (i = 0, l = d.childNodes.length; i < l; i++) {
                    El.gc(d.childNodes[i]);
                }
            }
        }catch(e){}
        //if (Browser.isIE) {
        //    CollectGarbage();
        //}
    };
	/**
	 * 得到触发事件事件的对象
	 * @param {event} ev 事件源
	 * @param {boolean} resolveTextNode 是否解析文本对象
	 * @return {object} 触发事件的对象
	 */
	EV.getTarget = function(ev, resolveTextNode) {
		if (!ev){
			ev = this.getEvent();
		}	
		var t = ev.target || ev.srcElement;
		if (resolveTextNode && t && "#text" == t.nodeName) {
			return t.parentNode;
		} else {
			return t;
		}
	};
	/**
	 * 得到事件对象
	 * @param {event|null} e 事件对象(非ie浏览器事件对象)
	 * @return {event} Event事件对象  
	 */
	EV.getEvent = function(e) {
		var ev = window.event || e;
		if (!ev&&!Browser.isIE) {
			var aCaller = [];
			var c = this.getEvent.caller;
			while (c) {
				ev = c.arguments[0];
				if (ev && (ev.constructor==Event||ev.constructor==MouseEvent)){
					break;
				}
				var b = false;
				for (var i = 0; i < aCaller.length; i++) {
					if (c == aCaller[i]) {
						b = true;
						break;
					}
				}
				if (b) {
					break;
				} else {
					aCaller.push(c);
				}
				c = c.caller;
			}
		}
		return ev;
	};
	/**
	 * 返回按钮码
	 * @param {event|null} ev 事件对象
	 */
	EV.getCharCode = function(ev) {
		if (!ev){
			ev = this.getEvent();
		}	
		return ev.charCode ||  ev.keyCode ;
	};
	/**
	 * 阻止事件进一步传播并取消事件默认动作
	 * @param {event} ev 事件对象
	 */
	EV.stopEvent = function(ev) {
		if (!ev){
			ev = this.getEvent();
		}
		this.stopPropagation(ev);
		this.preventDefault(ev);
	};
	/**
	 * 阻止事件进一步传播
	 * @param {event} ev 事件对象
	 */
	EV.stopPropagation = function(ev) {
		if (!ev) {
			ev = this.getEvent();
		}
		if(ev){
			if (ev.stopPropagation) {
				ev.stopPropagation();
			} else {
				ev.cancelBubble = true;
			}
		}
	};
	/**
	 * 取消事件默认动作
	 * @param {event} ev 事件对象
	 */
	EV.preventDefault = function(ev) {
		if (!ev) {
			ev = this.getEvent();
		}
		if(ev){
			if (ev.preventDefault) {
				ev.preventDefault();
			} else {
				ev.returnValue = false;
			}
		}   
	};
	/**
	 * 得到鼠标点击的x位置
	 * @param {event} event
	 */
	EV.pointerX = function(event) {
		if (!event){
			event = this.getEvent();	
		}	
		var doc = document;
		return event.pageX||(event.clientX + (doc.documentElement.scrollLeft || doc.body.scrollLeft));
	};
	/**
	 * 得到鼠标点击的y位置
	 * @param {event} event
	 */
	EV.pointerY = function(event) {
		if (!event){
			event = this.getEvent();
		}	
		var doc = document;
		return event.pageY||(event.clientY + (doc.documentElement.scrollTop || doc.body.scrollTop));
	};
	EV.observers = false;
	/**
	 * 注册事件
	 * @param {object} aa 要注册事件的dom元素
	 * @param {string} name 事件名称,不带on
	 * @param {function} observer 事件处理函数
	 * @param {boolean} useCapture 是否捕获事件
	 */
	EV.observeAndCache = function(aa, name, observer, useCapture) {
		if (!this.observers) {
			this.observers = [];
		}
		if (aa.addEventListener) {
			this.observers.push([aa, name, observer, useCapture]);
			aa.addEventListener(name, observer, useCapture);
		} else if (aa.attachEvent) {
			this.observers.push([aa, name, observer, useCapture]);
			aa.attachEvent('on' + name, observer);
		}
	};
	/**
	 * 清空注册事件的缓存
	 */
	EV.unloadCache = function() {
		if (!this.observers){
			return;
		}	
		for (var i = 0; i < this.observers.length; i++) {
			this.stopObserving(this.observers[i][0], this.observers[i][1],this.observers[i][2], this.observers[i][3]);
			this.observers[i][0] = null;
		}
		this.observers = false;
	};
	/**
	 * 移除事件注册
	 * @param {object} aa 要注册事件的dom元素
	 * @param {string} name 事件名称,不带on
	 * @param {function} observer 事件处理函数
	 * @param {boolean} useCapture 是否捕获事件
	 */
	EV.stopObserving = function(aa, name, observer, useCapture) {
		useCapture = useCapture || false;
		if (name == 'keypress'&& (navigator.appVersion.match(/Konqueror|Safari|KHTML/) || aa.detachEvent)){
			name = 'keydown';
		}
		if (aa.removeEventListener){
			aa.removeEventListener(name, observer, useCapture);
		} else if (aa.detachEvent) {
			aa.detachEvent('on' + name, observer);
		}
	};
	/**
	 * 注册事件
	 * @param {object} aa 要注册事件的dom元素
	 * @param {string} name 事件名称,不带on
	 * @param {function} observer 事件处理函数
	 * @param {boolean} useCapture 是否捕获事件
	 */
	EV.observe = function(aa, name, observer, useCapture) {
		useCapture = useCapture || false;
		if (name == 'keypress'&& (navigator.appVersion.match(/Konqueror|Safari|KHTML/) || aa.attachEvent)){
			name = 'keydown';
		}	
		this.observeAndCache(aa, name, observer, useCapture);
	};
	/**
	 * 注册事件
	 * @param {object} aa 要注册事件的dom元素
	 * @param {string} name 事件名称,不带on
	 * @param {function} observer 事件处理函数
	 * @param {boolean} useCapture 是否捕获事件
	 */
	EV.addEvent = function(aa, name, observer, useCapture){
		EV.observe(aa, name, observer, useCapture);
	};
	EV.stopSelect = function(isStop){
		if (window.Browser.value!="ie") {
			window.onmousedown = function(){
		    	return !isStop;
			};
		}else{
			if (isStop) {
				//EV.addEvent(document, "selectstart",stopSelect, false);
                document.attachEvent("onselectstart",EV.stopSelectEvent);
			}else{
                EV.stopObserving(document, "selectstart", EV.stopSelectEvent);
                //document.attachEvent("onselectstart",function(){
                //    return true;
                //});
				//EV.observe(document, "selectstart", function(){
                //    return true;
                //}, false);
			}
		}
	};
    EV.stopSelectEvent = function(){
        return false;
    };
})();




