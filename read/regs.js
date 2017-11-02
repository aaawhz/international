
//匹配 <br> </br> </  br>  或者  <br  /> <br/>
var allowTag = /<br\s{0,20}(\/?)>|<(\/?)\s{0,20}br>/;

//ncname匹配的是以a-zA-Z_开头，然后是0或多个a-zA-Z_、-或.。
var ncname = '[a-zA-Z_][\\w\\-\\.]*';

//(?:' + ncname + '\\:)? 这个主要是为了兼容这样的标签 <svg:path.test />， 是ncname的加强
var qnameCapture = '((?:' + ncname + '\\:)?' + ncname + ')';


var startTagOpen = new RegExp('^<' + qnameCapture);

//'</div>'.match(endTag)
// ["</div>", "div", index: 0, input: "</div>"]
var endTag = new RegExp('^<\\/' + qnameCapture + '[^>]*>');


