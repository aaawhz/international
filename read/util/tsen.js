
var tso = require('./translate.js');
var fs = require('fs');
var tranfn = tso.translate;
var data = fs.readFileSync('./zh.js', "utf-8")

var str = '';
var linestr = '';
var item = '';
var j = 0;
 
 
for(var i =0; i<data.length; i++){
    linestr = '';
    j = i;

    while(true){
        if( j< data.length){

            linestr += data[j];

            if(data[j] == '\r' || j<=data.length){
                 break;
            }
           
            
        }
        
    }

    console.log(linestr)

    i=j;
 

    // tranfn(str).then(result => {
    //     fs.appendFileSync("./en_result.js", '' + GLOBELOPTION.langkey + py + ' : "' + result.result + '",' + '\r\n');
    // });
}
