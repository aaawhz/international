
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
 
 //'拼写检查暂不支持中文。不过，我们仍可以检查您邮件中的所有英文拼写。<br><br>                         <input id="editorSpellChkTip" type="checkbox"/>&nbsp;不再提示'
 //拼写检查暂不支持中文。不过，我们仍可以检查您邮件中的所有英文拼写。
 //<br><br>                          <input id="editorSpellChkTip" type="checkbox"/>
 //&nbsp;不再提示


 var str = '<br><br> abc  <input> ddd ';
 
 //字符串是否只有容许的标签， 如果 'abc<br/>好滴' 就把这个整体提取出来做国际化， 简单易行
 var onlyAllowTag = true;
 //如果有开始标签
 if( getTag.test(str) ){
 	str.replace(getTag, function ($s) {
 		if(!allowTag.test($s)){
 			onlyAllowTag = false;
 		}
 	})
 }

 console.log(onlyAllowTag);