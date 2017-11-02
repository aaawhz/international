
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


/** -----------------------attrs  REGs -----------------------**/

// 比如 "href='https://www.taobao.com'".match(attribute)

// ["href='https://www.taobao.com'", "href", "=", 
// undefined, "https://www.taobao.com", undefined, 
// index: 0, input: "href='https://www.taobao.com'"]

// href
var singleAttrIdentifier = /([^\s"'<>/=]+)/;
// =
var singleAttrAssign = /(?:=)/;
// https://www.taobao.com

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


/** -----------------------attrs  end -----------------------**/


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
 },

 getPositonsAndTag: function(str){
   // pos 用来记录位置，和 标签的长度
   var pos = [],  arr=[] ,len,end;
   var tags = [], texts = '';

   str.replace(getTag, function(tag,$0,$1,start){

      len = tag.length;
      arr = [start, len];
      
      tags.push(tag);
      pos.push(arr);

   });

   /*
     [0, 4]
    
     [4, 4]
    
     [14, 7]
    */
   function getTextByPos(str, pos){
      var ts = [], item, s, start = 0, end = 0, len = pos.length,
           wb = pos[len-1][0] + pos[len-1][1];

      //处理 头部  [4,5] 这种情况
      if( pos[0][0] != 0 ){
        s = str.substring(0,pos[0][0]+1);
        ts.push(s);
      }

      for (var i = 0; i < len-1; i++) {
        item = pos[i];
        start = item[0] + item[1];
        end = pos[++i][0];

        console.log(start + '  ' + end)

        if(end > start){
          s = str.substring(start, end);
        
          ts.push(s);
        }
        

      }

      //处理 尾巴 情况
      if( wb < str.length ){
        ts.push( str.substring(wb, str.length));
      }

      return ts;
   }

   texts = getTextByPos(str, pos);

   return {
      tags: tags,
      texts: texts
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
   var posTag = Util.getPositonsAndTag(str);

   console.dir(posTag)
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
  





function transf(str){

};

 