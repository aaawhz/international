/**
 * 通过模板绑定生成列表型界面，实现类似于asp.net的数据绑定，模板列机制。
 * 调用方式非常简单，一般只需要两行代码，只需要模板字符串和数据源就可以工作
 * 模板语法也非常简单，只有4个关键字
 * <!--item start--> 列表开始标记
 * <!--item end--> 列表结束标记
 * $变量名：输出数据源中当前行中的字段值到当前位置
 * @函数名：通过自定义函数生成html片段，输出到当前位置，自定义函数在this.Functions中定义
 * 
 * 行绑定事件：
 * ItemDataBound在生成每行数据的html之后会触发，可以对生成的html做二次处理，完成一些更复杂的逻辑
 * 
 * 注意所有的更改都要在DataBind之前完成
 * 
 * @example
 * repeater有两种使用方式：1.指定dom元素，生成后直接渲染dom 2.只传入模板字符串和数据源，返回生成的html代码，不操作dom
 * 方式一:
 * 第1步，在dom元素中声明模板
 * <div id="repeater1">
    	<table>
    		<tr><td>标题</td><td>发件人</td><td>发送日期</td></tr>
			<!--item start-->
			<tr name="item"><td><a href="#">$index</a>-@getTitle(subject,from)</td><td>$from</td><td>$sentDate</td></tr>
			<!--item end-->
    	</table>
    </div>
    第2步，获取数据源（json数据格式）
    var dataSource=[{
'id':'43:1tbiKwH1mEKNltb5qAAAsZ',
'from':'"铁喜光" <tiexg@139.com>',
'subject':'邮件主题',
'sentDate':new Date()
}]);
第3步，实例化repeater，调用DataBind方法
 var rp=new Repeater(document.getElementById("repeater1")); //传入dom元素，dom元素即做为容器又做为模板字符串
 rp.DataBind(dataSource); //数据源绑定后即直接生成dom
 
 方式二:(适用于不在html页面中声明模板的情况)
不同的只有第3步
var templateStr=document.getElementById("repeater1").innerHTML;
var rp=new Repeater(templateStr);//传入模板字符
var htmlStr=rp.DataBind(dataSource); //生成字符串，不操作dom
 
 *
 */
(function (){
M139.core.namespace("M139.UI",{ 
Repeater: function(container,options){	
	this.HtmlTemplate=null;
	this.HeaderTemplate=null;
	this.FooterTemplate=null;
	this.ItemTemplate; 
	this.EmptyTemplate="暂无数据"
	this.SeparateTemplate;
	this.Functions=null;
	this.DataSource=null;
	this.ItemContainer;
	this.ItemDataBound=null;
	this.RenderMode=0;	//0，同步渲染，界面一次性组装，1.异步渲染，50毫秒生成一行
	this.RenderCallback=null;	//异步渲染模式用到的，行渲染回调函数
	this.Element=null;	
	this.Instance=null;
	this.DataRow=null;	//当前行数据
	
	var self=this; 
	if (typeof(container) != undefined) {
		if (typeof(container) == "string") {
			this.HtmlTemplate = container;	//直接传入html模板字符串
		}
		else {
			this.Element = container;
		}
		//n=findChild(obj,"name","item");
	}
	function getOptions(){	//初始化参数
			for(elem in options){
				if(elem){
					this[elem]=options[elem];
				}
			}
	}
	getOptions();
		
	this.DataBind = function(datasource) {

		var self=this;
	    this.DataSource=datasource;
	    if(this.DataSource.constructor!=Array){
	    	this.DataSource=[this.DataSource];//如果是object,转化为数组
	    }
	    if (this.HtmlTemplate == null) {
	        this.HtmlTemplate = this.Element.innerHTML;
	    }
	    //this.ItemTemplate=this.HtmlTemplate.match(/(<!--item\s+start-->)([\r\n\w\W]+)(<!--item\s+end-->)/ig)[0];
	    var re = /(<!--item\s+start-->)([\r\n\w\W]+)(<!--item\s+end-->)/i;
	    if (!datasource || datasource.length == 0) {
	        this.Render([]);
	        return this.HtmlTemplate.replace(re, "");
	    }
	    //re.exec(this.HtmlTemplate);
	    var match = this.HtmlTemplate.match(re);
	    this.ItemTemplateOrign = match[0];
	    this.ItemTemplate = match[2];

	    if(this.HtmlTemplate.indexOf("section")>=0){
	    	var sectionMatch=this.HtmlTemplate.match(/(<!--section start-->)([\w\W]+?)(<!--item start-->)([\w\W]+?)(<!--item end-->)([\w\W]+?)(<!--section end-->)/i);
	    	this.sectionStart=sectionMatch[2];
	    	this.sectionEnd=sectionMatch[6];

	    	//this.sectionStart=
	    }

	    
	    reg1 = /\$[\w\.]+\s?/ig; //替换变量的正则
	    reg2 = /\@(\w+)\s?(\((.*?)\))?/ig; //替换函数的正则
	    //reg2 = /\@(\w+)\s?\((.*?)\)/ig; //替换函数的正则
	    var result = new Array(); //每一行的html会push到result数组中
	    this.prevSectionName=""; //前一分组名称
	    for (var i = 0; i < this.DataSource.length; i++) {
	        var dataRow = this.DataSource[i];
	        dataRow["index"] = i;//追加索引
	        this.DataRow = dataRow; //设置当前行数据
	        var row = this.ItemTemplate;

	        row = row.replace(reg2, function($0, $1, $2,$3) { //替换函数
	            var name = $1.trim();
	            var paramList =[];
	            if($3){ paramList= $3.split(",");} //非空检测，如果有参数
	           
	            var param = new Array();
	            for (var i = 0; i < paramList.length; i++) {
	                if (dataRow[paramList[i]]!=null) {
	                    param.push(dataRow[paramList[i]]);
	                } else {
	                    param.push(paramList[i]);
	                }
	            }
	            if (self.Functions[name]) {
	                //return self.Functions[name](param);
	                var context = self;
	                if (self.Instance) {
	                    self.Instance.DataRow = dataRow;
	                    context = self.Instance;
	                }
	                return self.Functions[name].apply(context, param);

	            }


	        });
	        row = row.replace(reg1, function($0) { //替换变量
	            m = $0.substr(1).trim();
				if(dataRow[m]!=undefined){
					//一级变量
					return dataRow[m]; 
				}else{
					if(m.indexOf(".")>=0){// //多级变量
						var arr=m.split(".");
						var temp=dataRow;//多级变量暂存器
						for(var i=0;i<arr.length;i++){
							if(temp[arr[i]]!=undefined){
								temp=temp[arr[i]]
							}else{//变量不存在
								return "";
							}
							
						}
						return temp;
					}
					return "";
				}
	            

	        });
	        
	        var sectionName="";
	       	if(self.Functions && self.Functions["getSectionName"]){
	       		sectionName=self.Functions["getSectionName"].call(self, self.DataRow );
	       	}
	       	
       		if(this.sectionStart && sectionName!=this.prevSectionName){//分组名改变，生成新分组
				if(i==0){//第一行记录
					this.prevSectionName=sectionName;
					this.firstSectionName=sectionName;//暂存第一个sections名称，最后整体替换时用
				}else{
					result.push(this.sectionEnd); //因为htmltemplate一开始已经包含了第一个section的start标记，所以每行总是先追加end+内容+start
					result.push(this.sectionStart.replace("@getSectionName",sectionName));
					this.prevSectionName=sectionName;
				}
				
      			
       		}
	       	
	        if(this.HtmlTemplate.indexOf("<!--display")>=0){//模板中包含显示标记才执行，避免多余的执行
	        	row=row.replace(/(<!--display\s+start-->)(\W+<\w+[^>]+display:none[\w\W]+?)(<!--display end-->)/ig,"");//移除不显示的html
	        }
				
	        var itemArgs = {	//事件参数
	            index: i,
	            sectionName:sectionName,
	            data: dataRow,
	            html: row
	        };
	        if (this.ItemDataBound) {	//是否设置了行绑定事件
	            var itemRet = this.ItemDataBound(itemArgs);
	            if (itemRet) {
	                row = itemRet;
	            }
	        }
	        result.push(row);
	        
	       	
	    }
	    
	    return this.Render(result);
	};

	/***
	 * 将行数据join成一个字符串，替换item模板,header模板,footer模板.
	 */
	this.Render = function(result) {
        var str = result.join("");
        //因为jscript 5.5以上 String.prototype.replace(pattern, replacement)
        //如果pattern是正则表达式, replacement参数中的$&表示表达式中匹配的字符串
        //例: replace(/\d/g, "$&cm") 就表示将每一个数字追加上cm。
        //这样下面的对html的replace，就会在str出现 $& 的位置插入完整的ItemTemplateOrign
        //所以需要做$的转义 $$ 表示一个 $，测试时可以发邮件标题为 $<b>$ test</b> 来重现
        if ('0'.replace('0',"$&")==='0'){
            str = str.replace(/\$/ig,"$$$$");
        }

        var html = "";
        if (this.HtmlTemplate) {
        	if(this.firstSectionName){
        		html=this.HtmlTemplate.replace("@getSectionName",this.firstSectionName);
        	}else{
        		html=this.HtmlTemplate;
        	}
            html = html.replace(this.ItemTemplateOrign, str);
        } else {
            //html = this.ItemTemplate.replace(this.ItemTemplateOrign, str);
        }
        if (this.HeaderTemplate)
            html = this.HeaderTemplate + html;
        if (this.FooterTemplate) {
            html = html + this.FooterTemplate;
        }
        if(html==""){
			html=this.EmptyTemplate;
		
        }
        
        if(this.Element){
         	this.Element.innerHTML = html;
         	this.Element.style.display="";
        }

        return html;
	    
	}		
}

});
window.Repeater = M139.UI.Repeater;
})();

