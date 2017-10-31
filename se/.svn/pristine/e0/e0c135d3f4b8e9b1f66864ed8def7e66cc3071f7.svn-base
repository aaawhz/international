/**
 * 文件柜公共选择模块
 * @author Dream
 */

function FileSelect(obj){
	obj = obj || {};
	this.id	  = obj.id || 'selectDiskFilesTree';
	this.data = obj.data || {};
	this.url = "/disk/userdisk.do";
	this.iconPath =  (obj.iconPath || gMain.resourceRoot)  + "/images/tree/";
	this.isload = false;
	this.isOk = false;
}


FileSelect.prototype.loadData = function(){
	var sel = (this.folder)?"dir":"all";
	var url = this.url + "&sel=" + sel;
	MM.doService({
		url:this.url,
        func:"disk:listFileByEml",
		call:function(ao){
			var data = ao["var"];
			FS.isOk = data.retcode;
            FS.data = data.datalist;
            FS.update();
		},
		failCall:function(){
			FS.isOk = false;
            FS.data = null;
            FS.update();
		},
		data:{
			diskType:0,
            isSubDir:1,
            isSubFile:1
		}
	});
};


/*var testObj = {
	folder:true,		
	type:1,
	prj:1,			//项目id
	checkbox:true,	//是否显示复选框
	callback:function(){}
};*/

FileSelect.prototype.show = function(obj){
	this.type 	= this.type || 1;		//1 选择目录，2 转存，3 发邮件，默认为1
	this.prj    = this.prj;				//项目	
	this.folder = obj.folder||false;	//选择模式，为true可以文件和目录，为false只选目录，默认为true
	this.callback = obj.callback;		//回调函数，传选择文件的对象数组(包括文件名，大小，下载地址等)
	this.checkbox = obj.checkbox || false;//是否可以 多选，默认为false
	this.len = obj.len || 30;				//文件名长度
	window.FSTree = new Tree("FSTree",this.checkbox);
	this.tree = window.FSTree;
	this.tree.setIconPath(this.iconPath);
	this.width = 400;
	this.loadData();
	var html = [];
	html[html.length] = '<div class="pageConectDialog" id="DiskFilesTreeDiv">';
	html[html.length] = '<div id="'+this.id+'_div" class="FileSelectTree"></div>';
	html[html.length] = '<div class="boxIframeBtn"><div class="topborder">';
	html[html.length] = '<a class="n_btn_on mt_8" href="javascript:fGoto();"  onclick="FS.ok();return false;"><span><span>'+Lang.Mail.Ok+'</span></span></a>';
	html[html.length] = '<a class="n_btn mt_8" href="javascript:fGoto();"  onclick="FS.hide();return false;"><span><span>'+Lang.Mail.Close+'</span></span></a>';
	html[html.length] = '</div></div></div>';
	

	var ao = {
        id : this.id,
        title : Lang.Mail.disk_Select,
		text:html.join(""),
		width:this.width,
		zindex : 1100,
        buttons : []
	};
	CC.msgBox(ao);
};

FileSelect.prototype.update = function(){
	if(this.isOk){
		this.makeTree();
		$(this.id+"_div").innerHTML = this.tree.toString();
		this.tree.expandAll();
	}else{
		$(this.id+"_div").innerHTML = Lang.Mail.disk_LoadDataFail;
	}
	
};

FileSelect.prototype.hide = function(){
	CC.closeMsgBox(this.id);
};
	
FileSelect.prototype.ok = function(){     
    var o = null;
	var temp = {};
	if (this.checkbox) {
		o = [];
		if (this.folder) {
			o = this.getCheckedValue("0");
		} else {
			o = this.getCheckedValue("1");
		}
	}else{
		o = this.getSelect();	
	}
    this.hide();
    if (this.callback){
	    this.callback(o);
    }
};

FileSelect.prototype.makeTree = function(){
	var data = this.data;
	if (data) {
		for (var i = 0; i < data.length; i++) {
			var d = data[i];
            var o = {
                id: d.dirid,
                pid: 0,
                text: d.dirname,
                type: 0,
                data: "type=0&size=&url=&id="+d.dirid
            };
			this.makeNode(o);
			var ld = d.subdir;
			var lf = d.files;
			this.makeFoldersNodes(ld, d.dirid);
			if (!this.folder) {
				this.makeFilesNodes(lf, d.dirid);
			}
		}
	}
};


FileSelect.prototype.makeFoldersNodes = function(ld,pid){
	var i = 0;
	if(ld&&ld.length>0){
		for(i=0;i<ld.length;i++){
			var subdir = ld[i].subdir;
			var files = ld[i].files;
			var id  = ld[i].dirid;
			var o = {
				id : id,
				text: ld[i].dirname,
				data: "type=0&size=&url=&id="+id,
				pid: pid,
				type:0
			};
			this.makeNode(o);
			this.makeFoldersNodes(subdir,id);
			if(!this.folder){
				this.makeFilesNodes(files,id);
			}
		}
	}
};

FileSelect.prototype.makeFilesNodes = function(files,pid){
	var j = 0;
	if(files&&files.length>0){
		for(j=0;j<files.length;j++){
			var f = files[j];
			var id  = f.seqno;
			var url = encodeURIComponent(f.url);
			var data = "id="+id+"&type=1&url="+url+"&size="+f.size;
			var o = {
				pid:pid,
				id:id,
				text:f.fname,
				data:data,
				type:1
			};
			this.makeNode(o);
		}
	}
};

FileSelect.prototype.makeNode = function(o){
    var t = o.text.decodeHTML();
	var name = Util.getFileShortName(t,this.len);
	var str = 'id:{0};text:{1};hint:{2};data:{3}'.format(o.id,name,t,o.data);
	if(this.checkbox){
		str += ';checkValue:'+o.type;
	}
	if(o.type==1){
		str += ';icon:file';
	}else{
		str += ';icon:folder';
	}
	this.tree.nodes[o.pid+"_"+o.id] = str;
};

FileSelect.prototype.getCheckedValue = function(v){
	var ret = [];
	this.tree.getCheckedNodes(null,v);
	var obj = this.tree.checkedNodes;
	if(obj){
		for(var i=0;i<obj.length;i++){
			var o = obj[i];
			var size = GC.getUrlParamValue(o.data,"size");
			var url = GC.getUrlParamValue(o.data,"url");
			var id = GC.getUrlParamValue(o.data,"id");
			url = decodeURIComponent(url);
			ret[ret.length]={
				id:id,
				name:o.hint,
				size:size,
				url:url
			};
		}
	}
	return ret;
};

FileSelect.prototype.getSelect = function(){
	var ret = [];
	var node = this.tree.currentNode;
	if(node){
		var size = GC.getUrlParamValue(node.data,"size");
		var url = GC.getUrlParamValue(node.data,"url");
		var id = GC.getUrlParamValue(node.data,"id");
		url = decodeURIComponent(url);
		ret = [{
			id:id,
			name:node.hint,
			size:size,
			url:url
		}];
	}
	return ret;
};


