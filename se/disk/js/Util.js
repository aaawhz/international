/**
 * 常用工具操作类
 * @author cmail
 * @class
 */
var Util = new Object();

(function() {
	/**
	 * 执行n个函数，返回执行成功的函数值
	 * @param {function} 要执行的函数，1个或多个
	 * @return {object} 执行成功函数的值
	 */
	Util.tryThese = function() {
		var i, t, r;
		for (i = 0; i < arguments.length; i++) {
			t = arguments[i];
			try {
				r = t();
				break;
			} catch(e){}
		}
		return r;
	};
	/**
	 * 得到xmlDom 对象
	 */
	Util.getXMLDom = function() {
		return Util.tryThese(function(){
			return new ActiveXObject('MSXML.DOMDocument');
		}, function(){
			return new ActiveXObject('Msxml2.DOMDocument');
		}, function(){
			return new ActiveXObject('Msxml2.DOMDocument.4.0');
		}, function(){
			return new ActiveXObject('Msxml2.DOMDocument.5.0');
		}, function(){
			return document.implementation.createDocument("", "", null);
		}, function(){
			return new ActiveXObject('Msxml2.DOMDocument.3.0');
		}, function(){
			return new ActiveXObject('Msxml2.DOMDocument.6.0');
		}, function(){
			return new ActiveXObject('Microsoft.XMLDOM');
		}) ||false;
	};
	/**
	 * 得到XML节点的值
	 * @param {Object} cq
	 */
	Util.getXMLValue = function(cq) {
		var r = "";
		if (cq && cq.firstChild) {
			if (document.all) {
				r = cq.firstChild.nodeValue;
			} else {
				try {
					r = cq.textContent;
					if (!r) {
						throw "XML node content is null";
					}
				} catch (e) {
					r = cq.firstChild.nodeValue;
				}
			}
		}
		if(r){
			r = r.trim();
			r = r.replace(/^&nbsp;|&?nbsp;$/gi,"");
		}
		return r;
	};
	/**
	 * 字符串转换为数字
	 * @param {string} str 转换的字符串
	 * @param {null|number} digit 转换的小数位数(null--不限制小数位数,0--转换为整型,>0按小数位数转换)
	 * @param {null|string} type 转换后返回的类型(null,"num"--转换为数字类型,"str"--转换为字符串)
	 * @return {number|string} 转换以后的结果
	 * @example 示例：<br>
	 * <code>
	 * Util.str2Num("10.2124568795");//返回float类型10.2124568795<br>
	 * Util.str2Num("10.6",0);//返回Int类型11(使用四舍五入的方法)<br>
	 * Util.str2Num("10.2",2);//返回float类型10.1<br>
	 * Util.str2Num("10.2",2,"str");//返回String类型"10.20"(按小数位数格式化字符串)<br>
	 * Util.str2Num("10.216",2);//返回float类型10.22<br>
	 * Util.str2Num("10.216",2,"str");//返回String类型"10.22"<br>
	 * </code>
	 */
	Util.str2Num = function(str,digit,type){
		var fdb_tmp = 0;
		var fi_digit = 0;
		var fs_digit = "1";
		var fs_str = "" + str;
		var fs_tmp1 = "";
		var fs_tmp2 = "";
		var fi_pos = 0;
		var fi_len = 0;
		fdb_tmp = parseFloat(isNaN(parseFloat(str))?0:str);
		
		switch (true)
		{
		  case (digit==null):       //不改变值,只转换为数字
			 fdb_tmp = fdb_tmp;
			 break;
		  case (digit==0):          //取得整数
			 fdb_tmp = Math.round(fdb_tmp);
			 break;
		  case (digit>0):            //按照传入的小数点位数四舍五入取值
			 for (var i = 0; i < digit; i++) {
			 	fs_digit += "0";
			 }
			 fi_digit = parseInt(fs_digit,10);
			 fdb_tmp = Math.round(fdb_tmp * fi_digit) / fi_digit;
			 if (type=="str")
			 {
				fs_tmp1 = fdb_tmp.toString();
				fs_tmp1 +=((fs_tmp1.indexOf(".")!=-1)?"":".") + fs_digit.substr(1);
				fi_pos = fs_tmp1.indexOf(".") + 1 + digit;
				fdb_tmp = fs_tmp1.substr(0,fi_pos);
			 }
			break;
		}
		if (isNaN(fdb_tmp) || !isFinite(fdb_tmp)) {
			fdb_tmp = 0;
		}
		if (type == "str") {
			fdb_tmp += "";
		}
		return fdb_tmp;
	};
	/**
	 * 字符串格式化输出
	 * @param {string} fm 格式化的字符串
	 * @example
	 * <code>
	 * var s = "
	 * var str = Util.formatStr('中国{0}世界{1}人民{2}','a','b','c');
	 * //return 中国a世界b人民c
	 * </code>
	 */
	Util.formatStr = function(fm) {
		var args = arguments;
		return String.format(args.slice(1));
	};
	/**
	 * 将字符串日期转换成日期对象<br>
	 * 接受两种格式：2008-02-02 16:26:11; 03/08/2008<br>
	 * 该方法以后不建议使用，建议使用 @see Util.formatDate()
	 * @param {string} gn 字符串日期
	 * @return {date} 日期对象
	 * @deprecated
	 */
	Util.str2Date = function(gn) {
		if(gn.indexOf("-") > 0){
			return Util.parseDate(gn);
		}else{
			return new Date(Date.parse(gn));
		}
	};
	/**
	 * 将日期转化成 2008-08-28 14:53:01 的字符串格式<br>
	 * @param {Date} objDate 要转化成字符串的日期
	 * @deprecated 已过期，不建议使用
	 */
	Util.date2Str = function(objDate) {
		return Util.formatDate(objDate);
	};
	/**
	 * 给小于10的数字加0
	 * @param {number} x 要加的数字
	 */
	Util.appendZero = function(x){
		return(x<0||x>9?"":"0")+x;
	};
	/**
	 * 定义日期的相关常量
	 */
    Util.Date = {
        MONTH_NAMES: ["\u4e00\u6708", "\u4e8c\u6708", "\u4e09\u6708", "\u56db\u6708", "\u4e94\u6708", "\u516d\u6708", "\u4e03\u6708", "\u516b\u6708", "\u4e5d\u6708", "\u5341\u6708", "\u5341\u4e00\u6708", "\u5341\u4e8c\u6708", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        DAY_NAMES: ["\u65e5", "\u4e00", "\u4e8c", "\u4e09", "\u56db", "\u4e94", "\u516d", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    };
	
	//计算小时差的函数，通用
    Util.DateDiff = function(date1, date2){       
        var type1 = typeof(date1), type2 = typeof(date2);
        if (type1 == 'string') 
            date1 = Util.parseDate(date1);
        else if (date1.getTime) 
            date1 = date1.getTime();
        if (type2 == 'string') 
            date2 = Util.parseDate(date2);
        else if (date2.getTime) 
            date2 = date2.getTime();
        return (date1 - date2) / 1000 / 3600;//结果是小时
    };
	/**
	 * 日期对比差异
	 * @param {Object} date1 开始时间
	 * @param {Object} date2 结束时间
	 * @param {Object} strInterval 对比类别
	 */
	Util.DateDiffMore = function(date1, date2,strInterval){       
        var type1 = typeof(date1), type2 = typeof(date2);
        if (type1 == 'string') 
            date1 = Util.parseDate(date1);
        else if (date1.getTime) 
            date1 = date1.getTime();
        if (type2 == 'string') 
            date2 = Util.parseDate(date2);
        else if (date2.getTime) 
            date2 = date2.getTime();
		var returnVal=0;
		switch (strInterval) {
			case 's': //秒
				returnVal = parseInt((date2 - date1) / 1000);
				break;
			case 'n': //分钟
				returnVal = parseInt((date2 - date1) / 60000);
				break;
			case 'h': //小时
				returnVal = parseInt((date2 - date1) / 3600000);
				break;
			case 'd': //天
				returnVal = parseInt((date2 - date1) / 86400000);
				break;
			case 'w': //周
				returnVal = parseInt((date2 - date1) / (86400000 * 7));
				break;
		}
        return returnVal;
    };
	/**
	 * 日期添加
	 * @param {Object} strInterval 添加类别
	 * @param {Object} Number 添加值
	 * @param {Object} date 日期
	 */
	Util.DateAdd = function(strInterval, Number,date){
		var dtTmp = date;
		switch (strInterval) {
			case 's': //秒
				return new Date(dtTmp.getTime() + (1000 * Number));
			case 'n': //分钟
				return new Date(dtTmp.getTime() + (60000 * Number));
			case 'h': //小时
				return new Date(dtTmp.getTime() + (3600000 * Number));
			case 'd': //天
				return new Date(dtTmp.getTime() + (86400000 * Number));
			case 'w': //周
				return new Date(dtTmp.getTime() + ((86400000 * 7) * Number));
			case 'q': //季度
				return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number * 3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
			case 'm': //月
				return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
			case 'y': //年
				return new Date((dtTmp.getFullYear() + Number), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
		}
	};
	
	/**
     * 格式化日期 <br>
     * format格式：<br>
     * Year         | yyyy(4)  | yy (2),y (2 or 4)<br>
     * Month        | mmm (中文)| mm (2),m (1 or 2)<br>
     *              | MM (全称) | M  (缩写) <br>
     * Day of Month | dd (2)   | d (1 or 2)<br>
     * Day of Week  | ww (中文) | w (1)     <br>
     *              | WW (name)| W (abbr)  <br>
     * Hour (1-12)  | hh (2 )  | h (1 or 2)<br>
     * Hour (0-23)  | HH (2 )  | H (1 or 2)<br>
     * Hour (0-11)  | KK (2 )  | K (1 or 2)<br>
     * Hour (1-24)  | kk (2 )  | k (1 or 2)<br>
     * Minute       | nn (2 )  | n (1 or 2)<br>
     * Second       | ss (2 )  | s (1 or 2)<br>
     * Milliseconds | sss                  <br>
     * AM/PM        | a        |           <br>          
     * @param {date} date 要格式化的日期对象，默认为当前日期
     * @param {string} format 格式,默认为：yyy-mm-dd HH:nn:ss
     * @return {string} 格式化以后的日期
     */
	Util.formatDate = function(objDate , strFormat){
		var format = strFormat || "yyyy-mm-dd HH:nn:ss";
		var date = Util.parseDate(objDate) || new Date();
		format=format+"";
		var result="";
		var i_format=0;
		var c="";
		var token="";
		var yyyy=date.getFullYear();
		var m=date.getMonth()+1;
		var d=date.getDate();
		var w=date.getDay();
		var h=date.getHours();
		var n=date.getMinutes();
		var s=date.getSeconds();
		var sss=date.getMilliseconds();
	
		var value = [];
		//年份
		value["y"]=(yyyy<2000)?yyyy-1900:yyyy;
		value["yyyy"]=yyyy;
		value["yy"]=yyyy.toString().substring(2,4);
		//月份
		value["m"]=m;
		value["mm"]=Util.appendZero(m);
		value["mmm"]=Util.Date.MONTH_NAMES[m-1];
		value["MM"]=Util.Date.MONTH_NAMES[m+11];
		value["M"]=Util.Date.MONTH_NAMES[m+23];
		//天
		value["d"]=d;
		value["dd"]=Util.appendZero(d);
		//星期
		value["w"]=w;
		value["ww"]=Util.Date.DAY_NAMES[w];
		value["W"]=Util.Date.DAY_NAMES[w+14];
		value["WW"]=Util.Date.DAY_NAMES[w+7];
		//小时
		value["H"]=h;
		value["HH"]=Util.appendZero(h);
		if (h==0){value["h"]=12;}
		else if (h>12){value["h"]=h-12;}
		else {value["h"]=h;}
		value["hh"]=Util.appendZero(value["h"]);
		if (h>11){value["K"]=h-12;} else {value["K"]=h;}
		value["k"]=h+1;
		value["KK"]=Util.appendZero(value["K"]);
		value["kk"]=Util.appendZero(value["k"]);
		if (h > 11) { value["a"]="PM"; }
		else { value["a"]="AM"; }
		//分钟
		value["n"]=n;
		value["nn"]=Util.appendZero(n);
		//秒
		value["s"]=s;
		value["ss"]=Util.appendZero(s);
		//毫秒
		value["sss"]=sss;
		
		while(i_format < format.length){
			c=format.charAt(i_format);
			token="";
			while((format.charAt(i_format)==c) && (i_format<format.length)){
				token += format.charAt(i_format++);
			}
			if (value[token] != null) { 
				result += value[token]; 
			}
			else{ 
				result += token; 
			}
		}
		return result;
	};
	/**
	 * 将字符串转换成日期对象<br>
	 * 可以直接传入GMT时间格式和UTC时间格式<br>
	 * @param {string} strDate 字符串形式表示的日期
	 * @param {string} strFormat 日期格式 @see Util.formatDate 默认日期格式为yyy-mm-dd HH:nn:ss
	 * @return {Date} 日期对象
	 */
	Util.parseDate = function(strDate,strFormat){
		if(typeof(strDate)=="object"&&(strDate instanceof Date)){
			return strDate;
		}
		if(!strFormat){
			var n = Date.parse(strDate);
			if(n>0){		
					return new Date(n);	
			} 						
		}
		
		var val= strDate+"";
		var format=strFormat||"yyyy-mm-dd HH:nn:ss";
		var i=0;
		var i_val=0;
		var i_format=0;
		var c="";
		var token="";
		var x,y;
		var now=new Date();
		var year=now.getFullYear();
		var month=now.getMonth()+1;
		var date=1;
		var hh=now.getHours();
		var nn=now.getMinutes();
		var ss=now.getSeconds();
		var ampm="";
		
		while (i_format < format.length) {
			c=format.charAt(i_format);
			token="";
			while ((format.charAt(i_format)==c) && (i_format < format.length)) {
				token += format.charAt(i_format++);
			}
			
			switch(token) {
				//取年
				case "yyyy":
				case "yy":
				case "y":
					if (token=="yyyy") { x=4;y=4; }
					if (token=="yy")   { x=2;y=2; }
					if (token=="y")    { x=2;y=4; }
					year=_getInt(val,i_val,x,y);
					if (year==null) { return 0; }
					i_val += year.length;
					if (year.length==2) {
						if (year > 70) { year=1900+(year-0); }
						else { year=2000+(year-0);}
					}
					break;
				//取月
				case "MM":
				case "M":
				case "mmm":
					month=0;
					for (i=0; i<Util.Date.MONTH_NAMES.length; i++) {
						var month_name=Util.Date.MONTH_NAMES[i];
						if (val.substring(i_val,i_val+month_name.length).toLowerCase()==month_name.toLowerCase()) {
							if (token=="mmm"||token=="MM"||(token=="M"&&i>23)){
								month=i+1;
								if (month>12) { month %= 12; }
								i_val += month_name.length;
								break;
							}
						}
					}
					if ((month < 1)||(month>12)){return 0;}
					break;
				case "WW":
				case "W":
				case "ww":
				case "w":
					if (token != "w") {
						for (i=0; i < Util.Date.DAY_NAMES.length; i++) {
							var day_name = Util.Date.DAY_NAMES[i];
							if (val.substring(i_val, i_val + day_name.length).toLowerCase() == day_name.toLowerCase()) {
								i_val += day_name.length;
								break;
							}
						}
					}else{
						i_val += 1;
					}
					break;
				case "mm":
				case "m":
					month=_getInt(val,i_val,token.length,2);
					if(month==null||(month<1)||(month>12)){return 0;}
					i_val+=month.length;
					break;
				case "dd":
				case "d":
					date=_getInt(val,i_val,token.length,2);
					if(date==null||(date<1)||(date>31)){return 0;}
					i_val+=date.length;
					break;
				case "hh":
				case "h":
					hh=_getInt(val,i_val,token.length,2);
					if(hh==null||(hh<1)||(hh>12)){return 0;}
					i_val+=hh.length;
					break;
				case "HH":
				case "H":
					hh=_getInt(val,i_val,token.length,2);
					if(hh==null||(hh<0)||(hh>23)){return 0;}
					i_val+=hh.length;
					break;
				case "KK":
				case "K":
					hh=_getInt(val,i_val,token.length,2);
					if(hh==null||(hh<0)||(hh>11)){return 0;}
					i_val+=hh.length;
					break;
				case "kk":
				case "k":
					hh=_getInt(val,i_val,token.length,2);
					if(hh==null||(hh<1)||(hh>24)){return 0;}
					i_val+=hh.length;hh--;
					break;
				case "nn":
				case "n":
					nn=_getInt(val,i_val,token.length,2);
					if(nn==null||(nn<0)||(nn>59)){return 0;}
					i_val+=nn.length;
					break;
				case "ss":
				case "s":
					ss=_getInt(val,i_val,token.length,2);
					if(ss==null||(ss<0)||(ss>59)){return 0;}
					i_val+=ss.length;
					break;
				case "a":
					if (val.substring(i_val,i_val+2).toLowerCase()=="am") {ampm="AM";}
					else if (val.substring(i_val,i_val+2).toLowerCase()=="pm") {ampm="PM";}
					else {return 0;}
					_val+=2;
					break;
				default:
					if (val.substring(i_val,i_val+token.length)!=token) {return 0;}
					else {i_val+=token.length;}
					break;
			}
		}	
		
		if (i_val != val.length) { return 0; }
		if (month==2) {
			if (((year%4==0)&&(year%100!= 0))||(year%400==0)){
				if (date > 29){return 0;}
			}
			else{
				if (date > 28){return 0;} 
			}
		}
		if ((month==4)||(month==6)||(month==9)||(month==11)) {
			if (date > 30) { return 0; }
		}
		if (hh<12 && ampm=="PM") { hh=hh-0+12; }
		else if (hh>11 && ampm=="AM") { hh-=12; }
		var newdate=new Date(year,month-1,date,hh,nn,ss);
		return newdate;
		
		function _getInt(str,i,minlength,maxlength) {
			for (var x=maxlength; x>=minlength; x--) {
				var token=str.substring(i,i+x);
				if (token.length < minlength) { return null; }
				if (_isInteger(token)) { return token; }
			}
			return null;
		}
		
		function _isInteger(val) {
			return (/^[\d]{1,4}$/).test(val);
		}
	};
	/**
	 * 得到星期
	 * @param {nujmber} n 星期数值
	 * @param {number} a 星期的样式(1:中文(默认);2:英语全称;3:英语缩写) 
	 * @return {string} 返回星期
	 */
	Util.getWeekDay = function(n,a){
		a = a||1;
		return Util.Date.DAY_NAMES[(a-1)*7+n];
	};
    Util.getDateByTimezone = function(date, timezone){
        var utc = date.getTime() + (-8 * 3600000);
        var nd = new Date(utc + (3600000 * timezone));
		return nd;
    };
	Util.convertTimezoneDate = function(date, srctimezone,destimezone){
        var utc = date.getTime() + (-srctimezone * 3600000);
        var nd = new Date(utc + (3600000 * destimezone));
		return nd;
    };
	/**
	 * 将xml 转成对象
	 * @param {xml} cq xml文档对象
	 */
	Util.dom2Obj = function(cq) {
		var ao = null;
		if (cq) {
			var i, a, l, t, k;
			if (cq.nodeType == 9) {
				for (i= 0,a =cq.childNodes,l=a.length;i<l&&(t= a[i]);i++){
					if (t.nodeType != 1) {
						continue;
					}
					ao = this.dom2Obj(t);
					break;
				}
			} else {
				switch (cq.nodeName) {
					case "object" :
						ao = {};
						for (i = 0, a = cq.childNodes, l = a.length; i < l&& (t = a[i]); i++) {
							if (t.nodeType != 1) {
								continue;
							}
							k = "";
							if (t.attributes) {
								k = t.attributes.getNamedItem("name").value;
							}
							if (k) {
								ao[k] = this.dom2Obj(t);
							}
						}
						break;
					case "array" :
						ao = [];
						for (i = 0, a = cq.childNodes, l = a.length; i < l&& (t = a[i]); i++) {
							if (t.nodeType != 1) {
								continue;
							}
							ao.push(this.dom2Obj(t));
						}
						break;
					case "int" :
					case "long" :
					case "number" :
						var iv = this.getXMLValue(cq);
						iv = (iv.trim() == "") ? "0" : iv;
						ao = parseInt(iv, 10);
						break;
					case "boolean" :
						ao = this.getXMLValue(cq) == "true" ? true : false;
						break;
					case "date" :
						ao = this.str2Date(this.getXMLValue(cq));
						break;
					case "base64" :
						ao = this.getXMLValue(cq);
						break;
					case "null" :
						ao = null;
						break;
					default :
						ao = this.getXMLValue(cq);
						break;
				}
			}
		}
		return ao;
	};
	/**
	 * 将xml 转成对象 节点nodeName为对象属性
	 * @param {xml} cq xml文档对象
	 */
	Util.dom2Obj2 = function(cq) {
		var ao = null;
		if (cq) {
			var i, a, l, t, k;
			if (cq.nodeType == 9) {
				for (i= 0,a =cq.childNodes,l=a.length;i<l&&(t= a[i]);i++){
					if (t.nodeType != 1) {
						continue;
					}
					ao = this.dom2Obj2(t);
					break;
				}
			} else {
				switch (cq.nodeName) {
					case "object" :
						ao = {};
						for (i = 0, a = cq.childNodes, l = a.length; i < l&& (t = a[i]); i++) {
							if (t.nodeType != 1) {
								continue;
							}
							var k = t.nodeName;
							if (k) {
								ao[k] = this.dom2Obj2(t);
							}
						}
						break;
					case "array" :
						ao = [];
						for (i = 0, a = cq.childNodes, l = a.length; i < l&& (t = a[i]); i++) {
							if (t.nodeType != 1) {
								continue;
							}
							ao.push(this.dom2Obj2(t));
						}
						break;
					case "int" :
					case "long" :
					case "number" :
						var iv = this.getXMLValue(cq);
						iv = (iv.trim() == "") ? "0" : iv;
						ao = parseInt(iv, 10);
						break;
					case "boolean" :
						ao = this.getXMLValue(cq) == "true" ? true : false;
						break;
					case "date" :
						ao = this.str2Date(this.getXMLValue(cq));
						break;
					case "base64" :
						ao = this.getXMLValue(cq);
						break;
					case "null" :
						ao = null;
						break;
					default :
						ao = this.getXMLValue(cq);
						break;
				}
			}
		}
		return ao;
	};
	/**
	 * 将对象转成xml文档对象
	 * @param {Object} v 要转换成xml文档的对象
	 */
	Util.obj2Dom = function(v) {
		var cq = Util.getXMLDom();
		if (!cq) {
			return this.error("Create DOM error.");
		}
		function dp(af) {
			return cq.createElement(af);
		}
		function Abp(da, Aom) {
			da.appendChild(Aom);
		}
		function hx(aa, bv) {
			aa.appendChild(cq.createTextNode(bv));
		}
		function Aiz(aa, af, bb) {
			aa.setAttribute(af, bb);
		}
		function mu(ao) {
			var r, i, l, t;
			if (ao != null) {
				switch (ao.constructor) {
					case Boolean :
						r = dp("boolean");
						hx(r, ao ? "true" : "false");
						break;
					case String :
						r = dp("string");
						hx(r, ao.toString());
						break;
					case Number :
						if (ao.toString().indexOf('.') >= 0) {
							r = dp("number");
						} else if (ao < (-1024 * 1024 * 1024)
								|| ao >= (1024 * 1024 * 1024)) {
							r = dp("long");
						} else {
							r = dp("int");
						}
						hx(r, ao.toString());
						break;
					case Date :
						r = dp("date");
						hx(r, Util.date2Str(ao));
						break;
					case Array :
						r = dp("array");
						for (i = 0, l = ao.length; i < l; ++i) {
							Abp(r, mu(ao[i]));
						}
						break;
					default :
						r = dp("object");
						for (i in ao) {
							t = ao[i];
							if (typeof t != 'undefined'
									&& typeof t != 'function') {
								Abp(r, mu(t));
								Aiz(r.lastChild, "name", i);
							}
						}
						break;
				}
			} else {
				r = dp("null");
			}
			return r;
		}
		return mu(v);
	};
	/**
	 * dom 文档转换成string
	 * @param {Object} cq dom 文档
	 * @return {string} 转换以后的字符串
	 */
	Util.dom2Str = function(cq) {
		var r;
		if (window.XMLSerializer) {
			r = new XMLSerializer().serializeToString(cq);
		} else {
			r = cq.xml;
		}
		return r;
	};
	/**
	 * string转换成dom 文档
	 * @param {string} Ayc 要转换成dom对象的字符串
	 * @return {object} dom 文档
	 */
	Util.str2Dom = function(xml) {
		if (Browser.value == "opera") {
			xml = xml.replace(/&lt;/gi, "<").replace(/&gt;/gi, ">");
		}
		var r;
		var s = "XML paser error.";
		if (window.ActiveXObject) {
			r = Util.getXMLDom();
			r.loadXML(xml);
			if (r.parseError != 0) {
				return null;
			}
		} else if (window.DOMParser) {
			r = new DOMParser().parseFromString(xml, "text/xml");
			if (!r.documentElement || r.documentElement.tagName == "parsererror") {
				return null;
			}
		} else {
			r = document.createElement('div');
			r.innerHTML = xml;
		}
		return r;
	};
	/**
	 * 将对象转换成String
	 * @param {Object} v 要转换的对象
	 * @return {String} 转换以后的字符串
	 */
	Util.obj2Str = function(v) {
		return this.dom2Str(this.obj2Dom(v));
	};
	/**
	 * 将字符串转换成对象
	 * @param {String} bi 要转换成对象的字符串
 	 * @return {Object}
	 */
	Util.str2Obj = function(bi) {
		return this.dom2Obj(this.str2Dom(bi));
	};
	/**
	 * 格式化容量显示格式
	 * @param {Number} size 文件大小，单位为字节(byte)
	 * @param {String} strUnit 单位，为字符串(K,M,G)
	 * @param {Number} dotnum 小数点位数
	 * @param {String} sep 数字与单位之间分隔字符串，默认为空
	 * @return {String} 格式化以后容量显示
	 */
	Util.formatSize = function(size,strUnit,dotnum,sep){
	    var unit = "K";
		size = Util.str2Num(size,2);
		var num = isNaN(parseInt(dotnum,10))?"":dotnum;
		var ret  = size;
		var Kb = 1024;
	    var Mb = Kb * Kb;
		var Gb = Mb * Kb;
        var s = (typeof(sep)=="string")?sep: " ";
		if(typeof(strUnit)=="string"){
			strUnit = strUnit.toUpperCase();
			switch(strUnit)
			{
		        case "B":
					ret = size;
					unit = "B";
					break;
				case "K":
					unit = "K";
					ret = size.div(Kb);
					break;
				 case "M":
					unit = "M";
					ret = size.div(Mb);
					break;
				 case "G":
					unit = "G";
					ret = size.div(Gb);
					break;
		    }
		}else{
	       if(Kb<=size && size<Mb){
				unit = "K";
				ret = size.div(Kb);
			}else if(Mb<=size && size<Gb){
				unit = "M";
				ret = size.div(Mb);
			}else if(size>=Gb){
				unit = "G";
				ret = size.div(Gb);
			}else{
				unit = "B";
			}
		}
		if(typeof num == "number"){
			return Util.str2Num(ret,num) + s + unit;
		}else{
			return Util.str2Num(ret) + s + unit;
		}
		
	};
	/**
	 * 以字节形式得到容量大小
	 * @param {Number|String} s 容量大小(不带单位的数字或带单位的字符串,158K|158)
	 * @param {Object} unit 单位(B,K,M,G)
	 */
	Util.getSizeByByte = function(s,unit){
	    var Kb = 1024;
	    var Mb = Kb * 1024;
		var Gb = Mb * 1024;
		var sSize = (s || "")+"";
		sSize = sSize.replace(/\s/g,"");
	    var myregexp = /(\d+\.?\d*)([BKMG]?)/i;
	    var match = myregexp.exec(sSize);
	    var result = 0;
	    var strUnit = "";
	    if (match != null) {
		    result = match[1];
		    strUnit= match[2];
	    }
	    result = Util.str2Num(result);
	    if (typeof(unit) == "string" && unit != "") {
			strUnit = unit;
		}
	    strUnit = strUnit.toUpperCase();
	    switch(strUnit)
	    {
	         case "B":
			 	result = result;
			    break;
			 case "K":
			    result = result.mul(Kb);
			    break;
		     case "M":
			    result = result.mul(Mb);
			    break;
		     case "G":
			    result = result.mul(Gb);
			    break;
		    default:
		        break;
	    }
	    return result;
	};
	/**
	 * 根据文件名称得到文件显示的图片样式名称
	 * @param {Object} fileName
	 */
	Util.getFileClasssName = function(fileName)
	{
		  fileName = fileName.toLowerCase();
		  var ico = "other";
		 
		  if(fileName.indexOf(".")>0)
		  {
		  	var extension=fileName.substr(fileName.lastIndexOf('.')+1);
			if (extension == "7z") 
				ico = "rar";
			else {
				var icoClass = ["other", "tif", "txt", "psd", "rar", "zip", "xml", "html", "java", "fon", "jpg", "gif", "png","jpeg", "bmp", "tiff", "mpeg", "avi", "wmv", "mov", "mpg", "vob", "rmvb", "mp3", "wma", "wav", "asf", "mp4", "sis", "sisx", "cab", "doc", "docx", "pdf", "xls", "xlsx", "ppt", "pptx", "swf", "fla", "share", "folder", "mp3-hover", "upload", "i-hand", "flv", "folder-m", "folder-p", "exe", "css", "rm", "midi", "chm", "iso", "vsd", "no-load"];
				for (var i = 0; i < icoClass.length; i++) {
					if (extension.indexOf(icoClass[i]) >= 0) {
						ico = icoClass[i];
						break;
					}
				}
			}
		  }
          return ico;
	}
	/**
	 * 空函数
	 */
	Util.emptyFunction = function() {};

	Util.error = function(rb, bk) {
		if (bk) {
			CC.showMsg(this.obj2Str(bk),true);
		} else {
			CC.showMsg(rb,true);
		}
		return false;
	};
    Util.writeLogError = function(func,reqUrl,msg){
        Util.writeLog(func,reqUrl,msg,gConst.logLevel.error);
    };
    /**
     * 向服务器写入错误日志
     * @param {String} func
     * @param {String} seq
     * @param {String} reqUrl
     * @param {String} msg
     */
	Util.writeLog = function(func,reqUrl,msg,logLevel){
        if (IsWriteLog!="0") {
            var url = gMain.webLogServer + "/service/weblog.ashx";
            var pm = {
                func: func,
                level:logLevel || gConst.logLevel.info,
                sid: gMain.sid,
                uid: gMain.userNumber,
                reqUrl: encodeURIComponent(reqUrl),
                msg: encodeURIComponent(msg)
            };
            var logMsg = Util.getUrlData(pm);
            url += "?" + logMsg;
            if (url.length > gConst.webLogLength) {
                url = url.lefts(gConst.webLogLength, true);
            }
            var img = $("weblog_img"+logLevel);
            if (img) {
                img.src = url;
            } else {
                img = new Image();
                img.id = "weblog_img" + logLevel;
                img.src = url;
                img.style.display = "none";
                document.body.appendChild(img);
            }
        }
	};
    Util.getStack = function(){
        var func = arguments.callee;//当前函数引用
        var log = "";
        while(func){
            log += func.toString().match(/function\s*(\w*\([^(]*\))/)[1] + "\n";
            func = func.caller;//调用当前函数的函数
        }
        return log;
    };
	Util.subFunc = {};

	/**
	 * 对json数组对象转成url形式的数据
	 */
	Util.getUrlData = function(od){
		od = od || [];
		var html = [],i=0;
		Util.eachObj(od,function(n,v){
			html[i] = n+"="+v;
            i++;
		});
		return html.join("&");
	};
	
	Util.each = function(obj,func){
		if(obj&&func){
			if(obj instanceof Array){
				obj.each(func);
			}else if(typeof(obj)=="object"){
				Util.eachObj(obj,func);
			}
		}
	};
	Util.eachObj = function(obj,func){
		if (typeof(obj) == "object") {
			for (var n in obj) {
				func(n, obj[n]);
			}
		}
	};
	Util.getFileShortName = function(fn,len){
		len = len || 20;
		if(fn) {
			if (fn.length <= len) {
				return fn;
			}
		    var point = fn.lastIndexOf(".");
		    if(point==-1){
				return fn.substring(0,len-3)+"...";
			}
            var m = parseInt((len-10)/2,10);
			var reg = new RegExp("^(.{"+m+"}).*(.{"+m+"}\.[^.]+)$");
		    return fn.replace(reg,"$1......$2");
		}else{
            return "";
        } 
	};
	Util.getFileNameByPath = function(filePath) {
        return filePath.replace(/^.+?\\([^\\]+)$/, "$1");
    };
	Util.jsonToXml = function(obj){
		return Util.varToXml(null,obj,"\n").substr(1);
	};
	Util.varToXml = function(name, obj, prefix){	
      if (obj == null) {
          return prefix + tagXML("null", name);
      }
      var s = "",sep = "",type = Util.getVarType(obj);
      switch(type){
          case "object":
              if (obj.nodeType) {
                  return "";
              }
              for (var n in obj) {
                  s += Util.varToXml(n, obj[n], prefix + "  ");
              }
              sep = prefix;
              break;
          case "array":
              for (var i = 0; i < obj.length; i++) {
                  s += Util.varToXml(null, obj[i], prefix + "  ");
              }
              sep = prefix;
              break;
          case "date":
              s = Util.formatDate(obj,"yyyy-mm-dd");
              if (obj.getHours() > 0 || obj.getMinutes() > 0 || obj.getSeconds() > 0) {
                  s = Util.formatDate(obj,"yyyy-mm-dd HH:nn:ss");
              }
              break; 
          case "boolean":
              s = obj.toString();
              break;
          case "string":
              s = textXML(obj);
              break;
          case "number":
              s = obj.toString();  
              type = Util.getNumberType(obj);
              break;
          default:
              return "";
      }
      return prefix + tagXML(type, name, s + sep);
      
      function textXML(s){
          //s=s.htmlencode();
          if(s){
             s = s.replace(/[\x00-\x08\x0b\x0e-\x1f]/g, "");
			 if(s.substr(0,9) == "<![CDATA[")
			 	return s;
			 	//return s.replace(/\'/g,"\\'");
			 else
             	return s.encodeXML();
          }else{
              return "";
          }
      }
	  
      function tagXML(dataType, name, val){
          var s = "<" + dataType;
          if (name) {
              s += " name=\"" + textXML(name) + "\"";
          }
          if (val) {
              s += ">" + val;
              if (val.charAt(val.length - 1) == ">") {
                  s += "\n";
              }
              return s + "</" + dataType + ">";
          } else {
              return s + "></" + dataType + ">";
          }
      }
    };
    /**
     * 得到数字精确类型，用于和CoreMail数据映射
       var s = v.toString(); // 实际传输时需要转换为10进制字符串
       if (s 包含 '.')        --> TDouble number
       else v in [-2G,2G)     --> TInt32  int
       else                   --> TInt64  long
     * @param {Object} n 传入的数字
     */
    Util.getNumberType = function(n){
        var s = n.toString();
        var ret = "number";
        if(s.indexOf(".")==-1){
            if(n>=-2147483648&n<2147483648){
                ret = "int";
            }else if(!isNaN(n)){
               ret = "long";
            }
        }
        return ret;
    };
    /**
     * 获取js变量类型，只能得到系统内置类型，对用户自定义类型无效
     * 支持跨iframe
     */
    Util.getVarType = function(o){
        var _toS = Object.prototype.toString;
        var _types = {
            'undefined'         : 'undefined',
            'number'            : 'number',
            'boolean'           : 'boolean',
            'string'            : 'string',
            '[object Function]' : 'function',
            '[object RegExp]'   : 'regexp',
            '[object Array]'    : 'array',
            '[object Date]'     : 'date',
            '[object Error]'    : 'error'
        };
        return  _types[typeof(o)] || _types[_toS.call(o)] || (o?'object':'null');
    };
    /**
     * 去除数组中的重复值 
     * @param {Object} arr 要去除的数组
     * @param {Object} func 自定义去除的函数
     */
    Util.unique = function(arr,func){
			//高效算法
            if(!arr){
                return;
            }
			var a = {},i=0,v="";
			if(typeof(func)=="function"){
                for (i = 0; i < arr.length; i++) {
                    v = arr[i];
                    var t = func(v);
                    if (typeof(a[t]) == 'undefined' && t != "") {
                        a[t] = v;
                    }
                }
				arr.length=0; 
			  	for(i in a){
			        arr[arr.length] = a[i];
			    }
			}else{
				for (i = 0; i < arr.length; i++) {
                    v = arr[i];
                    if (typeof(a[v]) == 'undefined' && v != "") {
                        a[v] = 1;
                    }
                }
				arr.length=0; 
			  	for(var j in a){
			        arr[arr.length] = j;
			    }
			}
			return arr;
		};
        /**
         * 查找一个数组中指定的值，返回数组中该值的索引
         * @param {Array} items 原数组
         * @param {String} value 要查找的值
         * @param {Function} 自定义取值方法，用于查询一个对象数组时用
         * @return {Number} 查找到的索引值
         */
        Util.binarySearch = function(items,value,find){
            var startIndex = 0;
            var stopIndex = items.length - 1;
            var middle = Math.floor((startIndex+stopIndex)/2);
            if (typeof find == "function") {
                 while (find(middle) != value && startIndex < stopIndex) {
                    if (value < items[middle]) {
                        stopIndex = middle - 1;
                    } else {
                        startIndex = middle + 1;
                    }
                    middle = Math.floor((stopIndex + startIndex) / 2);
                }
                return (find(middle) != value) ? -1 : middle;
            } else {
                while (items[middle] != value && startIndex < stopIndex) {
                    if (value < items[middle]) {
                        stopIndex = middle - 1;
                    } else {
                        startIndex = middle + 1;
                    }
                    middle = Math.floor((stopIndex + startIndex) / 2);
                }
                return (items[middle] != value) ? -1 : middle;
            }
        };
        /**
         * 获取rm状态码
         */
        Util.getRmCode = function(resp,reg){
        	if(typeof resp=="object"){
        		reg = reg || ""
        		var summary = resp.summary || "";
        		var match = resp.match(/(\w+)\s+[\s\S]+=(\d+)/i);
        		if(match){
        			var m = (match[1] || "").toUpperCase();
        			return m + (match[2] || "");
        		}
        	}
        	return "";
        };
        /**
         * 将表单里面的元素转成json对象
         */
        Util.formToObject = function(form){
        	if(!form){
				return null;
			}
			var params = {};
			
			var radioTag=[];
						
			for (var i = 0; i < form.elements.length; i++) {
				var ele = form.elements[i];
				var type = ele.type;
				var format = ele.getAttribute("format") || "string";
				var name = ele.name;
				if(name){
					var val = "";
					
					if(type.substring(0,6)=="select"){
						val = ele.options[ele.selectedIndex].value;
					}else if(type=="text" || type=="textarea" || type=="password" || type=="hidden"){
						val = ele.value;
					}else if(type== "radio"){
						var tmp=form[name];
						
						if(!radioTag.has(name)){
							radioTag.push(name);	
						}else{
							continue; 
						}
						
						for(var j=0;j<tmp.length;j++){
							if(tmp[j].checked){
								val=tmp[j].value;
								break;
							}
						}
														
					}else if(type== "checkbox"){
						if(!radioTag.has(name)){
							radioTag.push(name);	
						}else{
							continue; 
						}
						
						var checkBoxVal=[];
						for(var j=0;j<tmp.length;j++){
							if(tmp[j].checked){
								checkBoxVal.push(tmp[j].value);
							}
						}
						
						val=checkBoxVal;
					}
					
					
					if(format=="int"){
						val = Util.str2Num(val,0,"num");
					}else if(format=="boolean"){
						val = val?true:false;
					}else{
						val = val || "";
					}
					
					params[name] = val;
				}
			}
			return params; 
        };
        /**
         * 将JSON数据填充至FORM中
         */
        Util.jsonToForm=function(json,form){        	
        	if(!form){
        		return null;
        	}
        	for (var i = 0; i < form.elements.length; i++){
        		var ele = form.elements[i];
        		var type = ele.type;
        		var name = ele.name;
        		
        		if(type=="text" || type=="textarea" || type=="password"){
        			if(json[name])
        				ele.value=json[name].decodeHTML();
        		}else if(type.substring(0,6)=="select"){
        			for(var j=0;j<ele.options.length;j++){
        				if(ele.options[j].value==json[name]){
        					ele.options[j].selected=true;
        				}
        			}
        		}else if(type== "checkbox" || type== "radio"){
        			if(ele.value==json[name]){
        				ele.checked=true;
        			}
        		}        		
        	}
        	
        };
        
        
        Util.formToJson = function(form){
        	return JSON.stringify(Util.formToObject(form));
        };
        Util.setAttrsValue = function(attrs,n,v){
            var ret = "";
    		if (attrs) {
			   attrs = attrs.decodeHTML();
               var reg = new RegExp("(^|&|\\?|\\s)"+n+"\\s*=\\s*([^&]*?)(\\s|&|$)","i");  
    		   var match = reg.exec(attrs); 
               if(match){
        			ret = attrs.replace(reg, "$1" + n +"=" + v + "$3");
        		}else{
        			ret = attrs + "&" + name + "=" + v;
        		}
            }else{
                ret = name + "=" + v;
            }
    		return ret.encodeHTML();  
        };
		/***
		 * 获取文件后缀缩略图样式
		 * @param {Object} extensionName
		 */
		Util.getFileExtensionCss = function(extensionName){			
            extensionName = extensionName.toLowerCase();
            var ico = "other";
            var icoClass = [
			{"eName":"tif","cName":"tif"}, {"eName":"txt","cName":"txt"}, {"eName":"no-load","cName":"no-load"},
			{"eName":"psd","cName":"psd"}, {"eName":"rar","cName":"rar"}, {"eName":"zip","cName":"zip"},
			{"eName":"xml","cName":"xml"}, {"eName":"html","cName":"html"},{"eName":"java","cName":"java"},
			{"eName":"fon","cName":"fon"}, {"eName":"jpg","cName":"jpg"}, {"eName":"gif","cName":"gif"},
			{"eName":"png","cName":"png"}, {"eName":"bmp","cName":"bmp"}, {"eName":"tiff","cName":"tiff"},
			{"eName":"mpeg","cName":"mpeg"}, {"eName":"avi","cName":"avi"}, {"eName":"wmv","cName":"wmv"}, 
			{"eName":"mov","cName":"mov"}, {"eName":"mpg","cName":"mpg"}, {"eName":"vob","cName":"vob"}, 
			{"eName":"rmvb","cName":"rmvb"}, {"eName":"mp3","cName":"mp3"}, {"eName":"wma","cName":"wma"}, 
			{"eName":"wav","cName":"wav"}, {"eName":"asf","cName":"asf"}, {"eName":"mp4","cName":"mp4"},
			{"eName":"sis","cName":"sis"}, {"eName":"sisx","cName":"sisx"}, {"eName":"cab","cName":"cab"},
			{"eName":"doc","cName":"doc"}, {"eName":"docx","cName":"docx"}, {"eName":"pdf","cName":"pdf"},
			{"eName":"xls","cName":"xls"}, {"eName":"xlsx","cName":"xlsx"}, {"eName":"ppt","cName":"ppt"},
			{"eName":"pptx","cName":"pptx"}, {"eName":"swf","cName":"swf"}, {"eName":"fla","cName":"fla"},
			{"eName":"share","cName":"share"}, {"eName":"folder","cName":"folder"}, {"eName":"mp3-hover","cName":"mp3-hover"},
			{"eName":"upload","cName":"upload"}, {"eName":"i-hand","cName":"i-hand"}, {"eName":"flv","cName":"flv"},
			{"eName":"folder-m","cName":"folder-m"}, {"eName":"folder-p","cName":"folder-p"}, {"eName":"exe","cName":"exe"},
			{"eName":"css","cName":"css"}, {"eName":"rm","cName":"rm"}, {"eName":"midi","cName":"midi"}, 
			{"eName":"chm","cName":"chm"}, {"eName":"iso","cName":"iso"}, {"eName":"vsd","cName":"vsd"}, 
			{"eName":"htm","cName":"html"}];
            for (var i = 0; i < icoClass.length; i++) {
                if (extensionName.indexOf(icoClass[i].eName) >= 0) {
                    ico = icoClass[i].cName;
                    break;
                }
            }
            return ico;       
		};
		Util.ajaxForm = function (o){
			var doc = document,
			body = doc.body,
			form = doc.createElement("form"),
			input = createInput(o.inputName, o.data);
	
			form.name = o.formName;
			form.method = "post";
			form.action = o.url;
			if (form.encoding) {
				form.setAttribute("encoding", "multipart/form-data");
			}
			form.setAttribute("enctype", "multipart/form-data");
			if (!document.getElementById(o.iframeName)) {
				body.appendChild(createIframe(o.iframeName));
			}
			form.target = o.iframeName;
			form.appendChild(input);
			body.appendChild(form);
			form.submit();
			body.removeChild(form);

		function createInput(name, value){
			var input = document.createElement("input");
			input.value = value;
			input.name = name;
			input.type = "hidden";
			return input;
		}
		function createIframe(name){
			var iframe;
			try{
				iframe = document.createElement('<iframe name="'+name+'"></iframe>');	
			}catch(ex){
				iframe = document.createElement("iframe");
				iframe.name = name;
			}
			iframe.id = name;
			iframe.style.display = "none";
			return iframe;
		}
	};
   	
	/***
	 * 高亮关键字
	 * @param {Object} key 关键字
	 * @param {Object} content 内容
	 * @param {Object} isencode 是否HTML编码
	 * @param {Object} leftStr 左边HTML
	 * @param {Object} rightStr 右边HTML
	 */	
	Util.keyHighLight=function(key,content,isencode,leftStr,rightStr){		
		leftStr = leftStr || "<span style='background-color:Gold;padding-left:2px;padding-right:2px;'>";
		rightStr = rightStr || "</span>";
		var regValue = leftStr + key +rightStr;
        regTrim = function(s){
            var imp = /[\^\.\\\|\(\)\*\+\-\$\[\]\?]/g;
            var imp_c = {};
            imp_c["^"] = "\\^";
            imp_c["."] = "\\.";
            imp_c["\\"] = "\\\\";
            imp_c["|"] = "\\|";
            imp_c["("] = "\\(";
            imp_c[")"] = "\\)";
            imp_c["*"] = "\\*";
            imp_c["+"] = "\\+";
            imp_c["-"] = "\\-";
            imp_c["$"] = "\$";
            imp_c["["] = "\\[";
            imp_c["]"] = "\\]";
            imp_c["?"] = "\\?";
            s = s.replace(imp, function(o){
                return imp_c[o];
            });
            return s;
        }
		var reg = new RegExp(regTrim(key), "g");
		if (isencode) {
			content = content.decodeHTML();
			content = content.replace(reg, "{keyHighLight}").encodeHTML();
			content = content.replace(new RegExp("{keyHighLight}", "g"), regValue);
		}else{
			content = content.replace(reg, regValue); 
		}
		return content;
	}
})();



