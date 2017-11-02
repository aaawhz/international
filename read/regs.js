
//ncname匹配的是以a-zA-Z_开头，然后是0或多个a-zA-Z_、-或.。
var ncname = '[a-zA-Z_][\\w\\-\\.]*';

var startTagOpen = new RegExp('^<' + qnameCapture);

var allowTag = /<br\s{0,20}\/>|<\/\s{0,20}br>/;