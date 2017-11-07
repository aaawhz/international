 
 var rf = require('fs'); 

 function repeat(){
 	var cc = rf.readFileSync('./propertis.js',"utf-8");
	var property = [];
	var s = ''
	var o = {};
	var newO = '';
 
	for (var i = 0; i < cc.length; i++) {
		if( cc[i] == '\r' || cc[i] == '\n'){
			if(s){
				property.push(s);
				s = '';
			}
		}else{
			s+= cc[i]
		}
		//cc[i];
	}

	 
	for (var i = 0; i < property.length; i++) {
	  	var item = property[i];

	  	var arr = item.split(':');

	   
	  	var key = trim(arr[0]);
	  	var value = trim(arr[1]);
 		 
	  	if( !o[key] ){
 			
	  		o[key] = value;
	  		newO = newO + key + ' : ' + value;	  		 
	  	}else{

	  		if(o[key] == value){

	  		}else{
	  			var newkey = key + 1;


	  			///newO = newO + key + ' : ' + value
	  		}
	  	}


	  } 


	  function trim(str) {
	  		//console.log('============='+str)
	   	str = str.replace(/^(\s+)|(\s+)$/,'');


	   	if(str.indexOf('mail.Write')>-1){
	   		str = str.split('.')[2]
	   	}

	   	return  str;
	   } 

	   console.log(222222222)

	 	rf.writeFileSync('./propertis.js', newO)
 }


 module.exports = repeat;
