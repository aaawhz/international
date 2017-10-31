function SWFObject(swf, id, w, h, ver, c) {
    this.params = new Object();
    this.variables = new Object();
    this.attributes = new Object();
    this.setAttribute("id", id);
    this.setAttribute("name", id);
    this.setAttribute("width", w);
    this.setAttribute("height", h);
    this.setAttribute("version", ver);
    this.setAttribute("swf", swf);
    this.setAttribute("classid", "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000");
    this.addParam("bgcolor", c);
}
SWFObject.prototype.addParam = function(key, value) {
    this.params[key] = value;
}
SWFObject.prototype.getParam = function(key) {
    return this.params[key];
}
SWFObject.prototype.addVariable = function(key, value) {
    this.variables[key] = value;
}
SWFObject.prototype.getVariable = function(key) {
    return this.variables[key];
}
SWFObject.prototype.setAttribute = function(key, value) {
    this.attributes[key] = value;
}
SWFObject.prototype.getAttribute = function(key) {
    return this.attributes[key];
}
SWFObject.prototype.getVariablePairs = function() {
    var variablePairs = new Array();
    for (key in this.variables) {
        variablePairs.push(key + "=" + this.variables[key]);
    }
    return variablePairs;
}
SWFObject.prototype.getHTML = function() {
    var con = '';
    if (navigator.plugins && navigator.mimeTypes && navigator.mimeTypes.length) {
        con += '<embed type="application/x-shockwave-flash"  pluginspage="'+location.protocol+'//www.macromedia.com/go/getflashplayer" src="' + this.getAttribute('swf') + '" width="' + this.getAttribute('width') + '" height="' + this.getAttribute('height') + '"';
        con += ' id="' + this.getAttribute('id') + '" name="' + this.getAttribute('id') + '" ';
        for (var key in this.params) {
            con += [key] + '="' + this.params[key] + '" ';
        }
        var pairs = this.getVariablePairs().join("&");
        if (pairs.length > 0) {
            con += 'flashvars="' + pairs + '"';
        }
        con += '/>';
    } else {
        con = '<object id="' + this.getAttribute('id') + '" classid="' + this.getAttribute('classid') + '"  codebase="'+location.protocol+'//download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=' + this.setAttribute("version") + ',0,0,0" width="' + this.getAttribute('width') + '" height="' + this.getAttribute('height') + '">';
        con += '<param name="movie" value="' + this.getAttribute('swf') + '" />';
        for (var key in this.params) {
            con += '<param name="' + key + '" value="' + this.params[key] + '" />';
        }
        var pairs = this.getVariablePairs().join("&");
        if (pairs.length > 0) { con += '<param name="flashvars" value="' + pairs + '" />'; }
        con += "</object>";
    }
    return con;
}
SWFObject.prototype.write = function(elementId) {
    if (typeof elementId == 'undefined') {
        document.write(this.getHTML());
    } else {
        var n = (typeof elementId == 'string') ? document.getElementById(elementId) : elementId;
        n.innerHTML = this.getHTML();
    }
}