
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
   singleAttrIdentifier.source +
  '(?:\\s*(' + singleAttrAssign.source + ')' +
  '\\s*(' + singleAttrValues.join('|') + '))',
  'g'
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
 /**  
  输入 "<br><br> 葫芦娃  <input> 变形金刚 "
  输出 

     spliteValue: 
     0: {value: "<br>", isTag: true}
     1: {value: "<br>", isTag: true}
     2: {value: " 葫芦娃  ", isTag: false}
     3: {value: "<input>", isTag: true}
     4: {value: " 变形金刚 ", isTag: false}

  }
  **/
 getTextsAndTags: function(str){
   // pos 用来记录位置，和 标签的长度
   var  item, isTag = false, s = '';
   var tags = [], o = {};
 
   for (var i = 0; i < str.length; i++) {
       var item = str.charAt(i);

       if(item == '<'){
          
          //如果 < 前面有字符， 先push
          if(s){
            o = {
              value: s,
              isTag: isTag
            }

            tags.push(o);
          }

          isTag = true;
          s = '';
          s += item;

          
       }
 
       if(item == '>'){
          
          s+= item;

          o = {
            value: s,
            isTag: isTag
          };
          tags.push(o);

          isTag = false;
          s = ''
       }

       if( item != '>' && item != '<'){
          s += item;
       }
       
   }

   if(s){
     o = {
            value: s,
            isTag: isTag
        };

     tags.push(o);   
   }
  
   return {
      spliteValue: tags
   }
 } 

};

 
 /** '拼写检查暂不支持中文。<br><br>        <input id="editorSpellChkTip" />&nbsp;不再提示'
 
     '排序{0} en<span style="aa" title="这是升序哦"> 升序 
     <span title=\"我是{0}降序\"></span></span>'；
 */
 
 /**
 	用标签来分割不明智， 应该直接循环用<>来判断， 遇到就截取

 	1.看看标签属性有没有中文

 	1.把位置中间的取出来， 看看有没有中文， 如果有中文就全部提取
 **/

function pickText(str){
   var o = Util.getTextsAndTags(str).spliteValue, item, value, reArray = [];
    
    for (var i = 0; i < o.length; i++) {
      item = o[i];
      value = item.value;
      //处理标签属性， 有中文直接替换
      if(item.isTag){
       
        value = value.replace(attribute,function($0,$1,$2,$3,$4){
                    /*console.log($0)
                    console.log($1)
                    console.log($2)
                    console.log($3)
                    console.log($4)*/
                    if(Util.haszh($3)){
                      return $3 = $1 + $2 + transf($3)
                    } else{
                      return $0
                    }
                  });

        console.log(value)
 
      }else{
        //处理文字， 有中文直接替换
        if(Util.haszh(value)){
          value = transf(value);
        }
      }

      reArray.push(value);
    }

    console.dir(reArray)
    return reArray;
}




//test

 var str = '<br><br> 葫芦娃  <input title="呵呵"> <input ttt="ddd"> 变形金刚 ';
 
 if(Util.haszh(str)){
 	if(!Util.checkTag(str)){
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
   return 'uu' + str + 'uu'
};

 