function enunicode(code){
code=code.replace(/[\u00FF-\uFFFF]/g,function($0){
		return '\\u'+$0.charCodeAt().toString(16);
});
return code;
};