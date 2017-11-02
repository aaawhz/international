
//匹配 <br> </br> </  br>  或者  <br  /> <br/>
var allowTag = /<br\s{0,20}(\/?)>|<(\/?)\s{0,20}br>/;


//ncname匹配的是以a-zA-Z_开头，然后是0或多个a-zA-Z_、-或.。
var ncname = '[a-zA-Z_][\\w\\-\\.]*';

//(?:' + ncname + '\\:)? 这个主要是为了兼容这样的标签 <svg:path.test /> => <svg:path.test， 是ncname的加强
var qnameCapture = '((?:' + ncname + '\\:)?' + ncname + ')';


var startTagOpen = new RegExp('<' + qnameCapture);

var startTag = new RegExp('<' + qnameCapture + '[^>]*>');

//'</div>'.match(endTag)
// ["</div>", "div", index: 0, input: "</div>"]
var endTag = new RegExp('<\\/' + qnameCapture + '[^>]*>');

var getTag = new RegExp('<(\\/)?' + qnameCapture + '[^>]*>', 'g');


/** attrs  REGs **/

// 比如 "href='https://www.imliutao.com'".match(attribute)

// ["href='https://www.imliutao.com'", "href", "=", 
// undefined, "https://www.imliutao.com", undefined, 
// index: 0, input: "href='https://www.imliutao.com'"]

var singleAttrIdentifier = /([^\s"'<>/=]+)/
var singleAttrAssign = /(?:=)/

var singleAttrValues = [
  // attr value double quotes
  /"([^"]*)"+/.source,
  // attr value, single quotes
  /'([^']*)'+/.source,
  // attr value, no quotes
  /([^\s"'=<>`]+)/.source
]

var attribute = new RegExp(
  '^\\s*' + singleAttrIdentifier.source +
  '(?:\\s*(' + singleAttrAssign.source + ')' +
  '\\s*(?:' + singleAttrValues.join('|') + '))?'
)


var Util = {


 haszh: function (str){
 	//中文
	var zhRe = /[\u4E00-\u9FA5]/;

 	return zhRe.test(str);
 },

//检查字符串是否符合国际化要求， 返回true就全部提取出来， 返回false则进入标签解析， 分段提取
 checkTag: function (str){
 	//字符串是否只有容许的标签， 如果 'abc<br/>好滴' 就把这个整体提取出来做国际化， 简单易行
	 var onlyAllowTag = true;
	 //如果有标签
	 if( getTag.test(str) ){
	 	str.replace(getTag, function ($s) {
	 		if(!allowTag.test($s)){
	 			onlyAllowTag = false;
	 			return onlyAllowTag;
	 		}
	 	});

	 	return onlyAllowTag;
	 }else{
	 	return onlyAllowTag;
	 }
 }

};

 
 /** '拼写检查暂不支持中文。<br><br>        <input id="editorSpellChkTip" />&nbsp;不再提示'

    ||
    ||
    ||

   拼写检查暂不支持中文。 
   <br><br>                          <input id="editorSpellChkTip" type="checkbox"/>&nbsp;
   不再提示

 */

 /*
     '排序{0}  &bnsp; h hehe 呵呵 en<span style="aa" title="这是升序哦"> 升序 
     <span title=\"我是{0}降序\"></span></span>'；
 */
 

 /**
 	还是第一个大步， 记录好每个标签的位置吧 , 利用repalce

 	1.看看标签属性有没有中文

 	1.把位置中间的取出来， 看看有没有中文， 如果有中文就全部提取
 **/
function pickText(str){

}




 var str = '<br><br> 葫芦娃  <input> 变形金刚 ';
 

 if(Util.haszh(str)){
 	if(Util.checkTag(str)){
 		//进入提取中文
 		pickText(str);
 	}else{
 		//str全部提取， 直接转换
 		transf(str);
 	}
 }else{
 	//跳过 result += str; i = j;
 }
  





function transform(str){

};

 console.log(onlyAllowTag);