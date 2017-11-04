
var rf=require("fs");  

//var Regs = require("./ot");
var data=rf.readFileSync("ot.js",{
    encoding: 'utf-8'
}
);  

var result = '';

var singleAttrIdentifier = /([^\s"'<>/=]+)/;
// =
var singleAttrAssign = /(?:=)/;
// https://www.taobao.com

var singleAttrValues = [
  // attr value double quotes
  /"([^"]*)"+/.source,
  // attr value, single quotes
  /'([^']*)'+/.source,
  // attr value, no quotes
  /([^\s"'=<>`]+)/.source,

  /\'([^\s"'=<>`]+)\'/.source,
  /\"([^\s"'=<>`\\]+)\"/.source 
]

var attribute = new RegExp(
   singleAttrIdentifier.source +
  '\\s*(' + singleAttrAssign.source + ')' +
  '\\s*(' + singleAttrValues.join('|') + ')',
  'g'
)

var s = '';

for (var i = 0; i < data.length; i++) {
    s += data[i];
}

var ss = "\"abc\"";
var abc =  /\\\"([a-z]+)\\\"/g;

console.log(s == "\\\"a\\\"")

s = s + "";

console.log(s)
console.log(abc.test(s));

 

//同步方法
rf.writeFileSync('./rt.js', result);
  