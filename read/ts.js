var rf=require("fs");  
var data=rf.readFileSync("origin.js","utf-8");  

var str = '';
var result = '';
var spliterRe = /[\"\']/;
var zhRe = /[\u4E00-\u9FA5]/;
var item = '';
var next = '';
var j = 0;
var ditem = '';

var singlezs = /\/\//;
var iszs = false;

for (var i = 0; i < data.length; i++) {
	item = data[i];
    
    ditem = item + data[i+1]; 

    //判断是否是单行注释
    if(singlezs.test(ditem)){
    	console.log(singlezs)
    	iszs = true;
    }

    //如果是回车，单行注释失效
    if(item == '\r'){
    	 
    	iszs = false;
    }

    if(spliterRe.test(item) && !iszs ){ //如果匹配 item 就是引号, 而且不在注释中
    	str = '';

    	next = data[i+1];
 		j = i;

    	if(zhRe.test(next)){ //如果第一个是中文
    		str += next; //存第一个中文
    		
    		j++

    		console.log(data[j])
    		console.log(item)

    		//如果前一个字符是 \\ ， 也继续往前走
    		while(   data[j] !== item || data[j-1] == '\\'     ){
    			
    			str += data[j];
    			j++
    		}

    		//console.log(str)
    		str = item + 'hahhahahha' + item
    		result += str;

    		//console.log(str);
    		//跳过已匹配的
    		i = j;

    		
    	}else{
    		result += item;
    	}
    	
    }else{

		result += item;
    }



}

 
//同步方法
rf.writeFileSync('./result.js', result);
  
 
















function trans(str){
	 if(!str){
	 	return '';
	 }

	var arr = str.split('=');
	var code = arr[1].toString().trim();
	//console.log(str)
	if(str){
		//console.log(enunicode(code))
		return arr[0] + '= ' + enunicode(code);
 	}else{
 		return '';
 	}
}

 
function enunicode(code){
	var s = '';
	var item = '';
	for (var i = 0; i < code.length; i++) {
		item = code[i].charCodeAt().toString(16).toUpperCase();
		item = pad(item);

		s += '\\u' + item;
	}
	return s;
};

function pad(str){
	if ( str.length < 4 ){
		 var len = str.length;

		 var ps = 4 - len;
		 var pd = '0000';

		 return pd.substring(0,ps) + str;
	}else{
		return str;
	}
}

