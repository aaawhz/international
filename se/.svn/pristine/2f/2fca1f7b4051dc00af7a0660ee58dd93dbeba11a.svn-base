/**
 * 滚动内容 支持上下或左右滚动，单行或模块滚动
 * @param t {string}  标题
 * @constructor
 * eg:
 * 
 *
 * var mt = new MarqueeContent();
 * mt.setTitleText('this is a title');
 * mt.run();
 */



//滚动内容
function MarqueeContent(){
	this.init.apply(this,arguments);
};

/*
var marqueeContent=new Array();   //滚动新闻
marqueeContent[0]='<font color="#0000CC">14:25 </font><a href=# target=_blank class="f12red">小泉称若自民党在议会选举中失败</a><br>';
marqueeContent[1]='<font color="#0000CC">14:25 </font><a href=# target=_blank class="f12red">布什发表广播讲话</a><br>';
marqueeContent[2]='<font color="#0000CC">14:25 </font><a href=# target=_blank class="f12red">伊斯兰武装炸毁印控克什米尔铁路导致列车出轨</a><br>';
marqueeContent[3]='<font color="#0000CC">14:25 </font><a href=# target=_blank class="f12red">布雷默：即使抓住了萨达姆也难以结束抵抗行动</a><br>';

*/

var marqueeInterval=new Array();  //定义一些常用而且要经常用到的变量
var marqueeId=0;
//var marqueeDelay=2000;
var marqueeHeight=24;

MarqueeContent.prototype = {
	init: function (config) {
		//this.direction = config.direction || "DOWN";
		//this.template = config.template;
		//this.containerId = config.containerId;
		this.marqueeDelay = config.marqueeDelay || 15000;
		this.doc= config.doc;
		this.contentItem = config.marqueeContent;
		this.getHTML();
	},
	getHTML: function (config) {
		var This = this;
		var str=This.contentItem[0];
	    var tempHtml = '<div id="marqueeBox" style="overflow:hidden;height:'+marqueeHeight+'px" ><div>'+str+'</div>';
	    jQuery('#top_tips_container',this.doc).html(tempHtml.decodeHTML());
		marqueeId++;
	    marqueeInterval[0]=setInterval(function(){
			This.startMarquee();
		},This.marqueeDelay);
		var marqueeBox = jQuery('#marqueeBox',This.doc)[0];
		if (marqueeBox)
		{
			This.marqueeBox = marqueeBox;
			marqueeBox.onmouseover = function () {
				clearInterval(marqueeInterval[0]);
			};
			marqueeBox.onmouseout = function () {
				marqueeInterval[0]=setInterval(function () {
					This.startMarquee();
				},This.marqueeDelay);
			}
		}
	},
	startMarquee: function () {
		var This= this;
		var str=This.contentItem[marqueeId];
		if (!str) {
			str = "";
		}
		//if (isSetUserQuestion != "true" && jQuery(This.contentItem[0]).find("a[id='setUserQuestion']")[0]) {
			//This.contentItem.splice(0,1);
		//}
		marqueeId++;
	    if(marqueeId>=This.contentItem.length) 
			marqueeId=0;
		
		marqueeBox= This.marqueeBox;
		if (marqueeBox)
		{
			if(marqueeBox.childNodes.length==1) {
				var nextLine=document.createElement('DIV');
				nextLine.innerHTML=str;
				marqueeBox.appendChild(nextLine);
			} else {
				marqueeBox.childNodes[0].innerHTML=str;
				marqueeBox.appendChild(marqueeBox.childNodes[0]);
				marqueeBox.scrollTop=0;
			}
			clearInterval(marqueeInterval[1]);
			marqueeInterval[1]=setInterval(function(){
				This.scrollMarquee();
			},24);
		}
	},
	scrollMarquee: function () {
		this.marqueeBox.scrollTop++;
		if(this.marqueeBox.scrollTop%marqueeHeight==(marqueeHeight-1)){
			clearInterval(marqueeInterval[1]);
		}
	},
	add: function (marqueeContentItem) {
		var This = this;
		This.contentItem.push(marqueeContentItem);
	},
	refresh: function () {
		this.getHTML();
	}
};


/*
//滚动内容
function MarqueeContentItem(){
	this.init.apply(this,arguments);
};

MarqueeContentItem.prototype = {
	init: function(config){
		//this.direction = config.direction || "DOWN";
		//this.template = config.template;
		//this.containerId = config.containerId;
		this.marqueeDelay = config.marqueeDelay || 2000;
		this.doc = config.doc;
		this.contentItem = config.marqueeContent;
		this.getHTML();
	}
}


*/



