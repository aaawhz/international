var rf=require("fs");  

var Regs = require("./regs");
var data=rf.readFileSync("origin.js","utf-8");  
var repeat = require("./repeat");
var str = '';
var resstr = '';
var result = '';
var spliterRe = /[\"\']/;
var zhRe = /[\u4E00-\u9FA5]/;
var item = '';
var next = '';
var j = 0;
var ditem = '';

/**/

var singlezs = /\/\//; //单行注释
var doublezs_start = /\/\*/; //多行注释
var doublezs_end = /\*\//;
var enterchar = '\r';
var sprit = '/';
var slash = '\\';

 
var isSingglezs = false;
var isDoublezs = false;
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

/**
   多行注释 - 单行注释 - 正则 - 字符串
**/ 

for (var i = 0; i < data.length; i++) {
    item = data[i];
 
    prevValue = data[i-1] ? data[i-1] : '';
    nextValue = data[i+1] ? data[i+1] : '';
    ditem = item + nextValue;
    
     
    //如果是跨行匹配字符串， 优先级最高
    if(matchQuoteInseverLine){
 
        //如果已经结束
        if( item == startQuout && prevValue != slash ){
            // 执行到这里获取到引号之间的字符串
            handleStr =  matchQuoteInseverLineStr + item;


            resstr = Regs.TransStr(handleStr);    

             
           
            result += resstr;

            matchQuoteInseverLine = false;
            //break
 
        }else{
            matchQuoteInseverLineStr += item;
        }
        
        continue;
    }

    if (doublezs_start.test(ditem)) {
        iszs = true;
        isDoublezs = true;
    }

    //判断是否是单行注释
    if (!isDoublezs && singlezs.test(ditem)) {
        //console.log(singlezs)
        iszs = true;
        isSingglezs = true;
    }
 
    //如果是回车，单行注释失效
    if (item == enterchar && isSingglezs) {
        //console.log(ditem)
        iszs = false;
        isSingglezs = false;
    }

    if (isDoublezs && doublezs_end.test(ditem)) {
        iszs = false;
        isDoublezs = false;
    }

    //如果是正则， / 开头， 就不匹配继续加, 这里要先判断，因为字符串中也有/
    //比如 /["]/.test("海南岛")  需要排除掉  /["]/， 再进行引号匹配
    // 并且避免掉 // /* */ 单行和多行注释
    if(!iszs && !matchQuote && !isReg &&item == sprit && prevValue != sprit && nextValue != sprit && nextValue != '*' && prevValue != '*'){
    	isReg = true;
 
    	regPos = i;
    	matchQuote = false;
    } 

    /*console.log('matchQuote    '+ matchQuote )
    console.log('b      '+isReg )
    console.log('item     '+item)*/
    //首先得不在注释中，不在正则中， 才去判断是否是引号开头， 而且不能是\"开头的
    if (!iszs && !isReg && spliterRe.test(item) && (data[i - 1] && data[i - 1] != "\\")) {
    	//console.log('c       '+isReg )
        //已经匹配到了引号
        matchQuote = true;
        str = '';
        //进入引号领地了
        islineStart = false;

        if (/[\']/.test(item)) {
            Regs.GLOBELCACHE.signleQuoteStart = true;
        } else {
            Regs.GLOBELCACHE.signleQuoteStart = false;
        }
 
        j = i;

        j++;
        //console.log(data[j])
        //console.log(item)
   
        //走到这里， item是引号， 如果不是引号，就继续取文字 ~~
        // 然后排除 "abc\"bcd" 这种情况,
        // j-2 != .. 是排除这种情况  '\\'+v;
        while (data[j] !== item || (data[j] == item && data[j - 1] == '\\' && data[j-2] != '\\')) {
        	
        	//如果遇到换行符，
            if (data[j] == enterchar || data[i] == '\n') {
   
                //兼容 str = " abc \
                //              大 \  
                
                if(data[j-1] == slash){
                    startQuout = item;
                    matchQuoteInseverLine = true;
                    matchQuote = false;
                   
                }else{
                    //说明这一行没有可以取的文字
                    matchQuote = false;
                }
                break;
            } else {

                str += data[j];
                j++;

            }

        }

        if(matchQuoteInseverLine){
            matchQuoteInseverLineStr = item + str;
            i = j;
        }else if (matchQuote) {
            // 执行到这里获取到引号之间的字符串
            handleStr = item + str + item;

            //console.log('isReg  ' + isReg)
            //console.log( item + str + item )

           
            resstr =  Regs.TransStr(handleStr);    

            if(resstr == '' ){
            	resstr = item + item;
            }      
            result += resstr;
           
           
            //console.log( 'GLOBELCACHE.hasTrans:============='+Regs.GLOBELCACHE.hasTrans)
            //如果有中文,保存到数组， 后面追加到文本后面
            if(Regs.GLOBELCACHE.hasTrans && zhRe.test(str)){
            	readzs.push(str);
            }

            //console.log(str);
            //跳过已匹配的
            i = j;
            matchQuote = false;
        }
    } else {

        result += item;
        
    }

    // 匹配正则最后的那个反斜杠
    if( isReg && i>regPos && item == sprit && prevValue != slash){
    	regPos = 0;
    	isReg = false;
    }
 	
 	if( nextValue == enterchar ){
 		//即将到来新的一天
 		islineStart = true;
 		isReg = false;
 		matchQuote = false;
 
 	}

    //如果要换行了， 把被替换掉的文字追加上去
    if(nextValue == enterchar && Regs.GLOBELCACHE.hasTrans ){
    	//result[i-1] = '';
    	result += '//'+readzs.join('  ||  ');
    	//result += item;
    	//清空数组
    	readzs.splice(0,readzs.length);
    	//换行后重置
    	Regs.GLOBELCACHE.hasTrans = false;
    }

}
 
//同步方法
rf.writeFileSync('./result.js', result);
 
//repeat();

