UE.registerUI('mailSign',function(editor,uiName){
    //注册按钮执行时的command命令,用uiName作为command名字，使用命令默认就会带有回退操作
    editor.registerCommand(uiName,{
        execCommand:function(cmdName,value){
            //这里借用fontsize的命令
           this.execCommand('inserthtml',value)
        },
        queryCommandValue:function(){
            //这里借用fontsize的查询命令
          //  return this.queryCommandValue('fontsize1')
        }
    });


    //创建下拉菜单中的键值对，这里我用字体大小作为例子
    var itemsSign = [],signList =top.signList ,corpSignList =top.corpSignList;
	itemsSign.push({
            //显示的条目
            label:"不使用",
            //选中条目后的返回值
            value:"-2",
			renderLabelHtml:function(){
				   return '<div class="edui-box edui-label edui-listitem-label edui-default">不使用</div>';
			}
      });
	  
     for(var i= 0,ci=signList.length;i<ci;i++){
        itemsSign.push({
            //显示的条目
            label:signList[i].title.encodeHTML(),
			isAutoDate:signList[i].isAutoDate,
            //选中条目后的返回值
            value:signList[i].content
        });
    }
	 for(var i= 0,ci=corpSignList.length;i<ci;i++){
        itemsSign.push({
            //显示的条目
            label:corpSignList[i].title.encodeHTML(),
			isAutoDate:corpSignList[i].isAutoDate,
            //选中条目后的返回值
            value:corpSignList[i].content
        });
    }
	itemsSign.push({
            //显示的条目
            label:"设置邮件签名",
            //选中条目后的返回值
            value:"-1",
			renderLabelHtml:function(){
				   return '<a href="javascript:fGoto();"  class="set">设置签名</a>';
			}
      });
	var p = this;
	 var btn = new UE.ui.Button({
        //按钮的名字
        name:uiName,
        //提示
        title:"邮件签名",
        //需要添加的额外样式，指定icon图标，这里默认使用一个重复的icon
        cssRules :'background-position: -463px -22px ',
        //点击时执行的命令
        onclick:function () {
            //这里可以不用执行命令,做你自己的操作也可
		 	var rect = baidu.editor.ui.uiUtils.getClientRect(this.getDom());
			rect.top += 1;
			rect.bottom -= 1;
			rect.height -= 2;
			p.popupSign.showAnchorRect(rect);
			
           //editor.execCommand(uiName);
        }
    });
	for (var i=0; i<itemsSign.length; i++) {
		var item = itemsSign[i];
		item.uiName = 'listitem';
		item.index = i;
		item.onclick = function (){
			if(this.value=="-1"){
				top.CC.setConfig("sign");
				return;
			}
			var editorContent = jQuery("body",editor.document).html();
			var signHtml,divsignature = jQuery("#divsignature",editor.document);
			
		 	if(this.value=="-2"){
				//editor.setContent(editorContent.replace(divsignature.html(),""))
				divsignature.remove();
				return;
			}
			if(divsignature.length>0){
				divsignature.html(this.value.decodeHTML()+"<br/>"+(this.isAutoDate=="1"?new Date().format("yyyy-mm-dd"):""));
			}else{
				signHtml = '<br/><br/><span id="divsignature">'+this.value.decodeHTML()+"<br/>"+(this.isAutoDate=="1"?new Date().format("yyyy-mm-dd"):"")+'</span>';
				editor.execCommand("inserthtml",signHtml);
			}
		};
	}
	 var MenuSing = baidu.editor.ui.Menu;
	 this.popupSign = new MenuSing({
		items: itemsSign,
		uiName: 'list',
		editor:editor,
		captureWheel: true,
		combox: btn
	});
		
    return btn;
},25/*index 指定添加到工具栏上的那个位置，默认时追加到最后,editorId 指定这个UI是那个编辑器实例上的，默认是页面上所有的编辑器都会添加这个按钮*/);