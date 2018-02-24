var fs = require('fs');
//中文 http://blog.csdn.net/leolu007/article/details/8576490  注意不要加g
var zhRe = /[\u4E00-\u9FA5]/;


var chineseToPinYin = require("./pinyin.js");
//匹配 <br> </br> </  br>  或者  <br  /> <br/>
var allowTag = /<br\s{0,20}(\/?)>|<(\/?)\s{0,20}br>/;

//ncname匹配的是以a-zA-Z_开头，然后是0或多个a-zA-Z_、-或.。
var ncname = '[a-zA-Z_][\\w\\-\\.]*';

//(?:' + ncname + '\\:)? 这个主要是为了兼容这样的标签 <svg:path.test /> => <svg:path.test， 是ncname的加强
var qnameCapture = '((?:' + ncname + '\\:)?' + ncname + ')';

var startTagOpen = new RegExp('<' + qnameCapture);
var startTag = new RegExp('<' + qnameCapture + '[^>]*?(\/)?>');

//'</div>'.match(endTag)
// ["</div>", "div", index: 0, input: "</div>"]
var endTag = new RegExp('<\\/' + qnameCapture + '[^>]*?(\/)?>');
var getTag = new RegExp('<(\\/)?' + qnameCapture + '[^>]*(>)?', 'g');

var lickTag = new RegExp('<(\\/)?' + qnameCapture + '[^>]*');

var myTemplateStart = /#s#/;
var myTemplateEnd = /#e#/;


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

//注意先后顺序
var singleAttrValues = [
    // attr value double quotes
    /"([^"]*)"+/.source,
    // attr value, single quotes
    /'([^']*)'+/.source,

    /\\\'([^\s"'=<>`]+)\\\'/.source,
    /\\\"([^\s"'=<>`\\]+)\\\"/.source,
    //attr value, no quotes
    /([^\s"'=<>`]+)/.source
]

var attribute = new RegExp(
    singleAttrIdentifier.source +
    '\\s*(' + singleAttrAssign.source + ')' +
    '\\s*(' + singleAttrValues.join('|') + ')',
    'g'
)


var GLOBELCACHE = {
    hasTrans: false,
    isInTemplate: false
};

var GLOBELOPTION = {
    langpath: "top.Lang.Addr.",
    langkey: ""
};

var Util = {
    haszh: function (str) {
        //中文
        var zhRe = /[\u4E00-\u9FA5]/;

        return zhRe.test(str);
    },
    //检查字符串是否符合国际化要求， 返回true就全部提取出来， 返回false则进入标签解析， 分段提取
    checkAllowTag: function (str) {
       var myTemplateStart = /#s#/;
        //字符串是否只有容许的标签， 如果 'abc<br/>好滴' 就把这个整体提取出来做国际化， 简单易行
        var hasTag = false;
       
        //如果有标签
        if (getTag.test(str)) {
            str.replace(getTag, function ($s) {
                if (!allowTag.test($s)) {
                    hasTag = true;
                    return hasTag;
                }
            });
            
        }
        
        if(myTemplateStart.test(str) || myTemplateEnd.test(str)){
           
            return true;
        } 

        return hasTag;
    },
    /**  
     * isPre 说明不需要trans
     * 
     输入 "<br><br> 葫芦娃  <input> 变形金刚 #s#hah#e# "
     输出 

        spliteValue: 
        0: {value: "<br>", isTag: true}
        1: {value: "<br>", isTag: true}
        2: {value: " 葫芦娃  ", isTag: false}
        3: {value: "<input>", isTag: true}
        4: {value: " 变形金刚 ", isTag: false}
        5: {value: "#s#hah#e#", isPre :true }
     }
     **/
    getTextsAndTags: function (str) {

        var item, isTag = false,
            isPre = false,
            preText = '',
            s = '';
        var TextsAndTags = [],
            strTag = '',
            oldIsTag,
            o = {};

        for (var i = 0; i < str.length; i++) {
            item = str.charAt(i);

            

            // "性别：#s#=user.sex#e#<br/>",
            if (!isPre && str[i] == '#' && str[i + 1] == 's' && str[i + 2] == '#') {
                
                //如果 #s# 前面有字符文字， 先push
                if (s) {
                    o = {
                        value: s,
                        isTag: oldIsTag
                    }
                    TextsAndTags.push(o);
                    // console.log("s============"+s)
                    s = '';

                }

                preText += str[i];
                isPre = true;
                continue;
            }

            if (str[i-2] == '#' && str[i - 1] == 'e' && str[i] == '#') {
                isPre = false;
                o = {
                    value: preText,
                    isPre: true
                };
                preText += str[i];
                
                TextsAndTags.push(o);              
                preText = '';
                continue;
            }
            
            //如果经过 模板前后检查， 发现还在模板中
            if( isPre ){
                preText += str[i];
                continue;
            }
 
            //2. 判断是否是标签
            if ( str.charAt(i - 1) != '\\' && item == '<') {
                //用来保存试探的标签
                strTag = '';
                //判断剩余的是不是标签
                for (var j = i; j < str.length;) {
                    strTag += str.charAt(j);

                    if ((startTag.test(strTag) || endTag.test(strTag))) {
                        oldIsTag = isTag;
                        isTag = true;
                        //console.log(strTag)
                        break;
                    }

                    j++;
                }

                if (!isTag) {
                    if (lickTag.test(strTag)) {
                        oldIsTag = isTag;
                        isTag = true;
                    }
                }

                if (isTag) {
                    //如果 < 前面有字符文字， 先push
                    if (s) {
                        o = {
                            value: s,
                            isTag: oldIsTag
                        }
                        TextsAndTags.push(o);
                        
                        s = '';

                    }
 

                    //跳过匹配的标签
                    i = j;

                    o = {
                        value: strTag,
                        isTag: isTag
                    }

                    strTag = '';

                    TextsAndTags.push(o);
                    s = '';
                    isTag = false;

                } else {
                    // 如果匹配不到
                    s += item;
                }
            } else {

                s += item;
            }
        }

        //收尾
        if (s) {
            o = {
                value: s,
                isTag: isTag
            };

            TextsAndTags.push(o);
        }

        return {
            spliteValue: TextsAndTags
        }
    }

};



 
//============================  入口 ==========================

function TransStr(str) {
    var res = '';
    var otherEndChar = /(?:(\+\'\")$)|(?:(\+\"\')$)|(?:(\+\')$)|(?:(\+\")$)/;
    var otherStartChar = /(?:^(\'\"\+))|(?:^(\"\'\+)$)|(?:^(\'\+))|(?:^(\"\+))/;

    if (Util.haszh(str)) {
        // console.log('-----------------'+str)

        // 如果含义需要提取的标签
        if (Util.checkAllowTag(str)) {
           
            //进入标签的中文提取
            res = pickText(str);
        } else {
            //str全部提取， 直接转换
            res = transf(str);
        }
    } else {
        //跳过 result += str; i = j;
        res = str;
    }

    if (otherEndChar.test(res)) {
        console.log('=================== otherEndChar success====================')
    }

    if (otherStartChar.test(res)) {
        console.log('=================== otherStartChar success====================')
    }
    //去掉多余的字符
    res = res.replace(otherStartChar, '');
    res = res.replace(otherEndChar, '');

    //最终返回的结果
    return res;
}


/**
 * ================================ 4种情况 ======================================== 
 * '拼写检查暂不支持中文。<br><br>        <input id="editorSpellChkTip" />&nbsp;不再提示'
    '排序{0} en<span style="aa" title="这是升序哦"> 升序 
    '<span title=\"我' + ...
     '提升，#s#=this.userName#e# <span>利息'
    ================================================================================
*/

/** ======================== 分割文字 html标签 自定义模板标签 主方法===================
 * 
 0.通过 getTestsAndTags 把字符串转换成 含有中文和标签的对象

 1.看看标签属性有没有中文

 2.把位置中间的取出来， 看看有没有中文， 如果有中文就全部提取

**/

function pickText(str) {
    var o = Util.getTextsAndTags(str).spliteValue,
        item, value, reArray = [];
 
    for (var i = 0; i < o.length; i++) {
        item = o[i];
        value = item.value;
        
        // console.log("value   start========="+value)
        //处理标签属性， 有中文直接替换
        if (item.isTag) {
            // console.log('------------------' + value);
            value = value.replace(attribute, function ($0, $1, $2, $3, $4) {

                //replace 会改变匹配到的那部分， 只需要改变值后， 但不会改变原值
                if (Util.haszh($3)) {
                    return $1 + $2 + transf($3, false, true)
                } else {
                    return $0;
                }
            });

        } else if ( !item.isPre && Util.haszh(value)) {
            var inners = '';
            var innerStrStart = '';
            var innerZh = '';
            var hasMatchZh = false;
            var innerStrEnd = '';
            var pos = '';  

            for (var j = 0; j < value.length; j++) {
                inners = value.charAt(j);

                if (!!zhRe.test(inners) || hasMatchZh) {
                    innerZh += inners;
                    hasMatchZh = true;
                } else {
                    innerStrStart += inners;
                }
            }

            value = innerStrStart + transf(innerZh, true);  
        }

      

        reArray.push(value);
    }

    //最后把处理过的value组合在一起返回
    return reArray.join('');
}

/**
 * 
 * @param {} str 
 * @param {*} isMix 
 * @param {*} isAttr 
 */
function transf(str, isMix, isAttr) {
    var lagPropery = '';
    var py = chineseToPinYin(str.replace(/[\\\/\<\>0123456789\-\=`,\./"'~!@\#$%^&*()?:]/g, ''));
    //console.log( py );

    //进入到了正方法说明已经被转换了
    GLOBELCACHE.hasTrans = true;

    // console.log('debug===================================' + GLOBELCACHE.hasTrans)

    str = str.replace(/^['"]/, '');
    str = str.replace(/['"]$/, '')
    lagPropery = '"' + GLOBELOPTION.langkey + py + '"' + ' :  "' + str + '" ,\r\n';


    fs.appendFileSync("../.././propertis.json", lagPropery);


    if (isMix) {
        //字符串str是单引号开头
        if (GLOBELCACHE.signleQuoteStart) {
            return "\'+" + (GLOBELOPTION.langpath + py) + "+\'";
        } else {
            return "\"+" + (GLOBELOPTION.langpath + py) + "+\"";
        }
    } else if (isAttr) {
        //字符串str是单引号开头
        if (GLOBELCACHE.signleQuoteStart) {
            return "\"\'+" + (GLOBELOPTION.langpath + py) + "+\'\"";
        } else {
            return "\'\"+" + (GLOBELOPTION.langpath + py) + "+\"\'";
        }
    } else {
        return (GLOBELOPTION.langpath + py);

        if (GLOBELCACHE.signleQuoteStart) {
            return "\'+" + (GLOBELOPTION.langpath + py) + "+\'";
        } else {
            return "\"+" + (GLOBELOPTION.langpath + py) + "+\"";
        }
    }


};


module.exports = {
    TransStr: TransStr,
    GLOBELCACHE: GLOBELCACHE
};