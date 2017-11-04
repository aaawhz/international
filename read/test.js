
var rf=require("fs");  

//var Regs = require("./ot");
var data=rf.readFileSync("ot.js",{
    encoding: 'utf-8'
}
);  

var result = '';
 

var s = '';

for (var i = 0; i < data.length; i++) {
    s += data[i];
}






var reg = /((\+\'\")$)|(\+\"\')$/;
 
 
console.log(reg.test(s));

 

//同步方法
rf.writeFileSync('./rt.js', result);
  