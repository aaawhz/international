var rf=require("fs");  
var data=rf.readFileSync("test.txt","utf-8");  

var str = '';
var result = '';
var spliterRe = /[\r]/;
var item = '';

for (var i = 0; i < data.length; i++) {
	item = data[i];

	if( spliterRe.test(item) ){
		
		str = trans(str)
		result += str ;
		result += '\r\n';
		//console.log('--------');
		str = '';

	}

	if(!/[\r\n]/.test(item)){
		str += item;
	}
	

}


//处理最后那行
if(str){
	result += trans(str);
}


function trans(str){
	 if(!str){
	 	return;
	 }

	var arr = str.split('=');
	var code = arr[1].toString().trim();
	//console.log(str)
	if(str){
		//console.log(enunicode(code))
		return arr[0] + '= ' +enunicode(code);
 	}else{
 		return '';
 	}
}

 
function enunicode(code){
	var s = '';
	for (var i = 0; i < code.length; i++) {
		s += '\\u' + code[i].charCodeAt().toString(16).toUpperCase();
	}
	return s;
};
  
console.log(result); 