/**
 * 自定义下拉选择框
 * @author 
 * 
 * 第一步：初始化对象实例
 * var dropMailType = new DropSelect({
			id:"opMailType",
			data:[{text:'大于等于',value:'1'},{text:'小于',value:'2'}],
			type:"", //邮件夹下拉框: fileTree,普通下拉框: "":
			selectedValue:"1",
			width:100,
			height:200,
			folderList:[{text:'全部邮件夹',value:'1',position:"top或者down,默认值为top"}] //邮件夹下拉框额外下拉项数组,下拉框类别为fileTree才有效 
	});
	
	第二步：获取HTML代码
	dropMailType.getHTML();
	第三步 :  初始化控件事件
	dropMailType.loadEvent();
	*********************************************
	获取选中value: dropMailType.getValue();
	设置选中value: dropMailType.setValue();
 */

function DropSelect(obj){
	obj = obj || {};
	var p = this;
	this.id	  = obj.id || 'selectDrop';     //控件容器的id
	this.data = obj.data || [];	 //如果type=fileTree 则传入公共邮件夹数据 	
	this.type = obj.type || "";	 //邮件夹下拉框: fileTree
	this.selectedValue = obj.selectedValue || ""; //设置默认选中值
	this.width = obj.width || 0; 
	this.height =obj.height || 0;
	this.widthStr = obj.width ? "width:"+obj.width+"px;" : ""; //控件宽度	
	this.heightStr = obj.height ? "height:"+obj.height+"px;" : ""; //控件高度

	//控件相关id的集合
	this.idList = {
		div : "drop_Div_"+ this.id,         //控件id
		text : "drop_Text_"+this.id,		//选中项span的id
		ul : "drop_UL_"+this.id,            //选项的ul的id
		drop : "drop_"+this.id,				//ul父级的id
		dropSelect : "drop_select_"+this.id
	};
    this.folderList = obj.folderList || []; //文件树的列表
	this.itemClick = obj.itemClick || "";   //点击事件
	
	//兼容不同iframe的页面，保证找的EV类，用top.EV可以兼容嵌套了多个iframe里面的下拉框控件
	var event = typeof(EV) == "undefined" ?  parent.EV : EV;
    
	//在页面点击的时候，隐藏下拉框
    event.observe(window.document, "click", function(){		
        if (p.isShow) {
            p.hideItem();
        }
        p.isShow = true;
    });
	
	p.curSelectIndex = 0;
	event.observe(window.document, "keyup", function(e){
		if(!p.DropSelectObj) return;
		if(p.DropSelectObj.find("#"+p.idList.drop).attr("class") == "menuPop shadow wherewjPop hide") return;
		//键盘往下按
		if(e.keyCode  == 40){			
            jQuery(p.liList[p.curSelectIndex]).removeClass("on");
			//如果已经是最后一个选项，重置为第一个选项
            if (p.curSelectIndex == p.liList.length-1) 
                p.curSelectIndex = -1;
            p.curSelectIndex++;
			
			//找到下一个选项，添加选中样式
            var nextLi = p.liList[p.curSelectIndex];
            if (nextLi) {               
                jQuery(nextLi).addClass("on");
				
				//改变选中的值
				var span = jQuery(nextLi).children().children();	
				var spanValue = span.attr("val");
				var spanText = span.attr("text").split("|");
				var level = span.attr("level");
				p.setShowItem((spanText[1]?'<i class="i-colorsquare mr_5 '+spanText[1]+'"></i>':"")+spanText[0],spanValue,level);
            }
		}
		else if(e.keyCode  == 38){
			//键盘往下按，同理
			jQuery(p.liList[p.curSelectIndex]).removeClass("on");
            if (p.curSelectIndex == 0) 
                p.curSelectIndex = p.liList.length;
            p.curSelectIndex--;
            var topLi = p.liList[p.curSelectIndex];
			
            if (topLi) {                
                jQuery(topLi).addClass("on");
				var span = jQuery(topLi).children().children();	
				var spanValue = span.attr("val");
                var spanText = span.attr("text").split("|");
				var level = span.attr("level");
                p.setShowItem((spanText[1]?'<i class="i-colorsquare mr_5 '+spanText[1]+'"></i>':"")+spanText[0],spanValue,level);
            }
		}else if(e.keyCode  == 13){
			//按enter键
			p.hideItem();
		}
			
		    		
	});
}

DropSelect.prototype.loadLiSelected = function(){
	var p = this;
	var liIndex = 0;

	//选项集合
	p.liList = p.DropSelectObj.find("#"+p.idList.ul).find("li[id]");
    p.liList.each(function(){
		var span = jQuery(this).children().children();	
		var spanValue = span.attr("val");
        var spanText = span.attr("text").split("|");
        var level = span.attr("level");
		
		//如果选中的值就是这个选项，则高亮此选项，并标示当前选中的下标为这个选项的index
        if (p.selectedValue ==  spanValue) {
            jQuery(this).addClass("on");
            p.setShowItem((spanText[1]?'<i class="i-colorsquare mr_5 '+spanText[1]+'"></i>':"")+spanText[0],spanValue,level);
            p.curSelectIndex = liIndex;
        }
        jQuery(this).attr("index", liIndex);
        liIndex++;	
		//鼠标移入，这个项变成选中的背景颜色	
        this.onmouseover = function(){
			jQuery(p.liList[p.curSelectIndex]).removeClass("on");
            jQuery(this).addClass("on");			
            p.curSelectIndex = jQuery(this).attr("index").toInt();
        };        
    });
	
	if(p.curSelectIndex == 0){
		var obj = p.liList[0];
		var span = jQuery(obj).children().children();	
		if(span.length){
            var spanValue = span.attr("val");
            var spanText = span.attr("text").split("|");
            var level = span.attr("level");
            p.setShowItem((spanText[1]?'<i class="i-colorsquare mr_5 '+spanText[1]+'"></i>':"")+spanText[0],spanValue,level);
            jQuery(obj).addClass("on");
        }
	}
};
/***
 * 加载OnClick事件 
 */
DropSelect.prototype.loadEvent = function(obj){
	var p = this;	
	var drop = document.getElementById(p.idList.dropSelect)||obj;		
	var queryDiv = jQuery(drop);
	var dropDiv = queryDiv.find("#"+p.idList.div);
	p.DropSelectObj = queryDiv;
	var dropId = p.idList.drop;
	var TextId = p.idList.text;
	var ulId = p.idList.ul;
	var type = p.type;
	var itemclick = p.itemClick;     //点击选项的回调函数
	p.isShow = false;
	dropDiv.click(function(){ //点击DIV事件		
		p.isShow = false;
		var drop = queryDiv.find("#"+dropId); //jQuery("#"+dropId);
		var className = drop.attr("class");
        if(p.data.length){
            if(className == "menuPop shadow wherewjPop"){
                p.hideItem();
            }
            else{
                p.showItem();
                p.setHeight();
            }
        }
	});	
	var itemOnclick=function(obj){ //点击下拉项
		p.isShow = false;
		var spanText = jQuery(obj).children().children();
		var dropText = queryDiv.find("#"+TextId);		
		var text = jQuery(spanText).attr("text").split("|");
		var value = jQuery(spanText).attr("val");
		var level = jQuery(spanText).attr("level");
		if(level)dropText.attr("level",level);		
		dropText.html((text[1]?'<i class="i-colorsquare mr_5 '+text[1]+'"></i>':"")+text[0].encodeHTML());
		dropText.attr("val",value);					
		p.hideItem();
		
		if (typeof(itemclick) == "function")
			itemclick(value,text[0],obj);
		
	};
	var dropUL =queryDiv.find("#"+ulId).children(); 
	for(var i =0; i<dropUL.length;i++){
		dropUL[i].onclick = function(){
			itemOnclick(this);
		}
	}
	
	p.loadLiSelected(); 
	
	
};
//隐藏下拉框
DropSelect.prototype.hideItem = function(){
	var dropId = this.idList.drop;	
	if(this.DropSelectObj)
		this.DropSelectObj.find("#"+dropId).attr("class","menuPop shadow wherewjPop hide");	
};
//显示下拉框
DropSelect.prototype.showItem = function(){
	var dropId = this.idList.drop;	
	if(this.DropSelectObj)
		this.DropSelectObj.find("#"+dropId).attr("class","menuPop shadow wherewjPop");	
};

//改变选项的值
DropSelect.prototype.setShowItem = function(text,value,level){
	this.DropSelectObj.find("#" + this.idList.text).html(text);
	this.DropSelectObj.find("#" + this.idList.text).attr("val",value);	
	//level 用来分层树形结构
	if(level) this.DropSelectObj.find("#" + this.idList.text).attr("level",level);
};

//得到选项的值
DropSelect.prototype.getValue = function(){	
	return this.DropSelectObj.find("#"+this.idList.text).attr("val");
};

DropSelect.prototype.getAttrValue = function(attrName){
	var attrval = this.DropSelectObj.find("#"+this.idList.text).attr(attrName);
	return attrval || "";
};

DropSelect.prototype.setValue = function(value){
	if(this.type == "fileTree"){	
		var f = MM.getFolderObject(value);
		var fname ="";
		if(f){
			fname = (f.type==5?'<i class="i-colorsquare mr_5 '+gConst.labelColor[f.folderColor]+'"></i>':"")+f.name;
		}else{
			if (this.folderList) {
				for (var i = 0; i < this.folderList.length; i++) {
					var val = this.folderList[i];
					if (val.value == value) {
						fname = val.text;
						break;
					}
				}
			}
		}
		this.DropSelectObj.find("#" + this.idList.text).html(fname);
		this.DropSelectObj.find("#" + this.idList.text).attr("val",value);
	}
	else{
		for (var i = 0; i < this.data.length; i++) {
			var val = this.data[i];
			if (val.value == value) {				
				this.DropSelectObj.find("#" + this.idList.text).html(val.text);
				this.DropSelectObj.find("#" + this.idList.text).attr("val",val.value);
			}
		}
	}
};
DropSelect.prototype.setWidth = function(width){
	this.DropSelectObj.find("#"+this.idList.drop).width(width);
	this.DropSelectObj.width(width);	
};
DropSelect.prototype.setHeight = function(height){
	var h = height || this.height;
	if (h > 0) {
		var dropItem = this.DropSelectObj.find("#" + this.idList.drop);
		if (dropItem.height() > h) {
			dropItem.height(h);
		}
	}
};

DropSelect.prototype.getHTML = function(){
	var p = this;
	var html = [];	
	var lineHTML = '<li class="line"></li>';
	var liHTML = "<li style=\"padding:0\" id=\"li_{0}_{1}\" name=\"{0}\"><a id=\"drop_{0}_{1}\" href=\"javascript:void(0);\">";
		liHTML +="<span  val=\"{1}\" text=\"{2}\" {3}> {2} </span></a></li>";
	html.push("<span class=\"dropDown\" style=\"{0}\" id=\"{1}\">".format(this.widthStr,this.idList.dropSelect));
    html.push("<span id=\"{0}\">".format(this.idList.div));
    html.push("<span class=\"dropDownA\" href=\"javascript:void(0);\">");
    html.push("<i class=\"i_triangle_d\"></i>");
    html.push("</span>");
	html.push("<span id=\""+this.idList.text+"\"  class=\"dropDownText\"></span>");
	html.push("</span>");	
    
	var isSelectHTML = false;
	var sValue= p.selectedValue;    
    html.push("<div class=\"menuPop shadow wherewjPop hide\" id=\"{0}\" style=\"{1}overflow:auto;\">".format(this.idList.drop,this.widthStr));
    html.push("<ul id=\"{0}\">".format(this.idList.ul));
	if(this.type == "fileTree"){
		var items = this.data;
		var idstr = this.id;	
			
		var otherList = this.folderList;	
		
		//得到树的结构
        var getFolderTree = function(nodes, icon,parentId,level){
            var aw = null, icon1 = "", icon2 = "", text = "", isCurEnd = false,fid="",name="",childNodes=[],isLabel=false;
			level = level || 0;level++;

            for (var i = 0; i < nodes.length; i++) {					
                aw = nodes[i];
				fid = aw.fid || aw.folderId;
				name = aw.name.encodeHTML() || aw.folderName;
				
				//"├ " 前面的其他图标，比如安全锁标签
				icon1 = icon || "";		
				//传入的子节点			
				childNodes = aw.nodes || aw.childFolderList;		
                isCurEnd = (i == nodes.length - 1);     
				//判断是否这一级的最后一个元素，给出标示           "└ "，否则用  "├ "
                icon2 = (!parentId || parentId == 0) ? "" : ((isCurEnd) ? "└ " : "├ ");
                if(aw.type==5){
                    icon1 = '<i class="i-colorsquare mr_5 '+gConst.labelColor[aw.folderColor]+'"></i>';
                    isLabel = true;
                }
                text = icon1 + icon2 + name.encodeHTML();
				html.push('<li id="li_{0}_{1}" name="{0}"><a href="javascript:void(0);" id="drop_{0}_{1}">'.format(idstr,fid));
                html.push('<span class="text" val="{1}" text="{2}{5}" level="{4}">{3}</span></a>'.format(idstr,fid,name,text,level,(isLabel ? "|"+gConst.labelColor[aw.folderColor]:"")));
                html.push('</li>');				
                if (childNodes && childNodes.length > 0) {
                    icon1 += (isCurEnd || parentId == 0) ? "&nbsp;" : "│ ";
                    getFolderTree(childNodes, icon1,fid,level);
                }
            }
        };
		if (otherList) {			
			for (var i = 0; i < otherList.length; i++) {
				var val = otherList[i];
				if (typeof(val.position) == "undefined" || val.position == "top") {					
					html.push(liHTML.format(idstr,val.value,val.text.encodeHTML(),val.attr || ""));
					if (val.addDownHTML) {
						if (val.addDownHTML == "line") 
							html.push(lineHTML);
						else 
							html.push(val.addDownHTML);
					}
				}
			}
		}
   		getFolderTree(items);
		if (otherList) {			
			for (var i = 0; i < otherList.length; i++) {
				var val = otherList[i];
				if (val.position == "down") {			
					html.push(liHTML.format(idstr,val.value,val.text.encodeHTML(),val.attr || ""));
					if (val.addDownHTML) {
						if (val.addDownHTML == "line") 
							html.push(lineHTML);
						else 
							html.push(val.addDownHTML);
					}
				}
			}
		}
	}
	else{		
		for(var i =0;i < this.data.length;i++){
			var val = this.data[i];
			html.push(liHTML.format(this.id,val.value,String(val.text).encodeHTML(),val.attr || ""));
			
			if (val.addDownHTML) {
				if (val.addDownHTML == "line") 
					html.push(lineHTML);
				else 
					html.push(val.addDownHTML);
			}
		}
	}
    html.push("</ul>");
    html.push("</div>");
    html.push("</span>");
	return  html.join("");
};
