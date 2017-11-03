var rf=require("fs");  

var Regs = require("./regs");
var data=rf.readFileSync("origin.js","utf-8");  

var str = '';
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

 
var isSingglezs = false;
var isDoublezs = false;
var iszs = false;

for (var i = 0; i < data.length; i++) {
	item = data[i];
    
    ditem = item + data[i+1]; 

    //判断是否是单行注释
    if(singlezs.test(ditem)  ){
    	//console.log(singlezs)
    	iszs = true;
    	isSingglezs = true;
    }

    if(doublezs_start.test(ditem)){
    	iszs = true;
    	isDoublezs = true;
    }

    //如果是回车，单行注释失效
    if( item == '\r' && isSingglezs ){	 
    	//console.log(ditem)
    	iszs = false;
    	isSingglezs = false;
    }

    if( isDoublezs &&   doublezs_end.test(ditem)){
    	iszs = false;
    	isDoublezs = false;
    }

    if(spliterRe.test(item) && !iszs ){ //如果匹配 item 就是引号, 而且不在注释中
    	str = '';
    	if( /[\']/.test(item) ){
    		Regs.GLOBELCACHE.signleQuoteStart = true;
    	}else{
    		Regs.GLOBELCACHE.signleQuoteStart = false;
    	}
    	
    	next = data[i+1];
 		j = i;
 	 		
 			j++
    		//console.log(data[j])
    		//console.log(item)

    		//如果前一个字符是 \\ ， 也继续往前走， 避免这种情况 "abc\"bcd"
    		while( data[j] !== item || data[j-1] == '\\' ){
    			
    			str += data[j]; 
    			j++
    		}
    		// 执行到这里获取到引号之间的字符串

    		console.log( item + str + item )
    		str = Regs.TransStr(item + str + item );


    		result += str;

    		//console.log(str);
    		//跳过已匹配的
    		i = j;  		
    	 
    	
    }else{

		result += item;
    }



}

 
//同步方法
rf.writeFileSync('./result.js', result);
  


 
