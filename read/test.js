
var rf=require("fs");  

//var Regs = require("./ot");
var data=rf.readFileSync("ot.js",{
    encoding: 'utf-8'
})
 
 for (var i = 0; i < data.length; i++) {
      
     if(data[i] == '\r'){
        console.log('a')
     }

     if(data[i] == '\n'){
        console.log('b')
     }
       
 }


 

//同步方法
/*rf.writeFileSync('./rt.js', result);
*/  