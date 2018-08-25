var rf = require("fs");
var fs = rf;

var Regs = require("./regs");
var data = rf.readFileSync("origin.html", "utf-8");

var str = '';
var resstr = '';
var result = '';
var spliterRe = /[\"\']/;
var zhRe = /[\u4E00-\u9FA5]/;
var item = '';
var enterQuote = false;

var j = 0;




/**/


var enterchar = '\r';
var sprit = '/';
var slash = '\\';

var zsstart = /^<!--/;
var zsend = /^-[-]+>/;
var iszs = false;
var isReg = false;
var regPos = 0; //记录正则位置，避免把前后两个反斜杠混淆
var matchQuote = false;

//是否是新的一行， 而且没有进入引号的领地
var islineStart = true;

var handleStr = '';
var prevValue = '';
var nextValue = '';
var readzs = [];

//兼容 str = " abc \
//              大 \   
//如果是字符串跨行匹配
var matchQuoteInseverLine = false;
var matchQuoteInseverLineStr = '';
var startQuout = '';

fs.writeFileSync('./zh_result.js', '');
fs.writeFileSync('./en_result.js', '');


for (var i = 0; i < data.length; i++) {
    item = data[i];


    prevValue = data[i - 1] ? data[i - 1] : '';
    nextValue = data[i + 1] ? data[i + 1] : '';
    ditem = item + nextValue;

    if (!iszs && item == "<" && data.substring(i).match(zsstart)) {
        iszs = true;
    }

    if (iszs && item == "-" && data.substring(i).match(zsend)) {
        console.log(11111111)
        iszs = false;
    }


    if (enterQuote && spliterRe.test(item)) {
        enterQuote = false;
    }

    if (!iszs && zhRe.test(item)) { // 

        //如果前一个是引号, 就
        if (spliterRe.test(prevValue)) {
            enterQuote = true;

        } else {

        }

        if (enterQuote) { //前面是引号, 就不处理了
            result += item;
        } else {
            j = i;


            str = '';
            str += item;
            j++;




            while (data[j] != '<' && data[j] != "'" && data[j] != '"') {
                str += data[j];
                j++;

            }

            console.log('j end' + j)
            if (str) {
                resstr = Regs.TransStr(str);
                readzs.push(str)
            }

            result += resstr;

            i = j - 1;

            console.log('i end' + i)
        }

    } else {
        result += item;
    }



    //如果要换行了， 把被替换掉的文字追加上去
    if ((nextValue == enterchar || nextValue == '\n') && Regs.GLOBELCACHE.hasTrans) {
        //result[i-1] = '';
        result += '<!--' + readzs.join('  ||  ') + '-->';

        console.log(333333333)
        //result += item;
        //清空数组
        readzs.splice(0, readzs.length);
        //换行后重置
        Regs.GLOBELCACHE.hasTrans = false;
    }

}

//同步方法
rf.writeFileSync('./result.html', result);

//repeat();