UE.registerUI('buttonTemplate',function(editor,uiName){
    //注册按钮执行时的command命令，使用命令默认就会带有回退操作
    editor.registerCommand(uiName,{
        execCommand:function(){
            alert('execCommand:' + uiName)
        }
    });
	var p = this;
    //创建一个button
    var btn = new UE.ui.Button({
        //按钮的名字
        name:uiName,
        //提示
        title:"邮件模版",
        //需要添加的额外样式，指定icon图标，这里默认使用一个重复的icon
        cssRules :'background-position: -339px -40px; display:none;',
        //点击时执行的命令
        onclick:function () {
            //这里可以不用执行命令,做你自己的操作也可
		 	var rect = baidu.editor.ui.uiUtils.getClientRect(this.getDom());
			rect.top += 1;
			rect.bottom -= 1;
			rect.height -= 2;
			p.popup.showAnchorRect(rect);
			setTemplateState();
           //editor.execCommand(uiName);
        }
    });
	var Menu = baidu.editor.ui.Menu;
	var data = [{
			text : top.Lang.Mail.tips051,
			file : "tz.htm"
			},
			{
				text : top.Lang.Mail.tips052,
				file : "hyjy.htm"
			},
			{
				text : top.Lang.Mail.tips054,
				file : "zwjd.htm"
			},
			{
				text : top.Lang.Mail.tips056,
				file : "hyyq.htm"
			},
			{
				text : top.Lang.Mail.tips058,
				file : "qj.htm"
			},
			{
				text : top.Lang.Mail.tips059,
				file : "hx.htm"
			}
			];
	
	var items = [];
    for(var i=0,ci=data.length;i<ci;i++){
		var v = data[i];
        items.push({
            //显示的条目
            label:data[i].text,
            //选中条目后的返回值
            value:data[i].file
            //针对每个条目进行特殊的渲染
            /*renderLabelHtml:function () {
                //这个是希望每个条目的字体是不同的
                return '<div class="edui-label %%-label" style="line-height:2;font-size:' +
                    this.value + 'px;">' + (this.label || '') + '</div>';
            }*/
        });
    }
	 items.push({
            //显示的条目
            label:"不使用模版",
            //选中条目后的返回值
            value:"-1",
            //针对每个条目进行特殊的渲染
            renderLabelHtml:function () {
                //这个是希望每个条目的字体是不同的
                return '<a href="javascript:fGoto();"  class="set">不使用模版</a>';
            }
        });
	
	 this.items = items;
	for (var i=0; i<this.items.length; i++) {
		var item = this.items[i];
		item.uiName = 'listitem';
		item.index = i;
		//item.value = item.value;
		item.onclick = function (){
			if (this.value == "-1") {
				oTemplate.hideTemplate();
			}
			else {
				oTemplate.getTemplate(this.value);
			}
		};
	}
	this.popup = new Menu({
		items: this.items,
		uiName: 'list',
		editor:editor,
		captureWheel: true,
		combox: btn
	});
	
 

			
 jQuery("#tzhai").click(function (argument) {
 	 oTemplate.getTemplate("tz.htm");
 })

 jQuery("#hyyqmainhai").click(function (argument) {
 	 //oTemplate.getTemplate("hyyqmain.htm");
 	 var url = '/webmail/webtransit.do?sid='+ parent.gMain.sid+'&func=mail:meeting';
 	 CC.goOutLink(url,"meeting","会议邀请");
 	 return false;
 })


  jQuery("#hyjyhai").click(function (argument) {
 	 oTemplate.getTemplate("hyjy.htm");
 })

   jQuery("#zwjdhai").click(function (argument) {
 	 oTemplate.getTemplate("zwjd.htm");
 })

    jQuery("#qjhai").click(function (argument) {
 	 oTemplate.getTemplate("qj.htm");
 })

   jQuery("#hxhai").click(function (argument) {
 	 oTemplate.getTemplate("hx.htm");
 })

jQuery("#hyyqhai").click(function (argument) {
 	 oTemplate.getTemplate("hyyq.htm");
 })

     

 jQuery("#morehai").click(function(e){
 	
 	if( jQuery("#morewraphai").is(":hidden") ){
 		jQuery("#composeBarHai").css("zIndex", 3090);
 	}else{
 		jQuery("#composeBarHai").css("zIndex", 3090);
 	}

 	jQuery("#morewraphai").toggle();
 	e.stopPropagation();
 });

 jQuery("#morewraphai").mouseleave(function(e){
 	//jQuery("#composeBarHai").css("zIndex", 1090);
 	jQuery(this).hide();
 	e.stopPropagation();
 });

 jQuery("#nomudulehai").click(function(){
 	oTemplate && oTemplate.hideTemplate();
 	setTemplateState(true);
 });

jQuery("#nomudulehai,#hyyqhai,#hxhai,#qjhai,#zwjdhai, #hyjyhai").click(function(){
		jQuery("#morewraphai").hide();
});


function setTemplateState(cancel){
	cancel? top.gMain.isModel = false : top.gMain.isModel = true;

}


 
 
var oTemplate = {
	getTemplate : function(sFile) {
		setTemplateState();

		$("ifrmTmp").src = parent.gMain.webPath + "/static/se/mail/template/" + sFile;
	},
	showTemplate : function(oIfrm) {
		var c = editor.getContent();
		if(c) {
			top.CC.confirm(top.Lang.Mail.Write.replaceMail, function() {
				initContent();
			});
		} else {
			initContent();
		}
		function initContent() {
			var sHtml = oIfrm.contentWindow.document.body.innerHTML;
			sHtml = sHtml.replace(/<script>.*<\/script>/g, "");
			sHtml = sHtml.replace(/\$RESOURCE_ROOT\$/g, (parent.gMain.resourceRoot.indexOf('http') > -1 ? parent.gMain.resourceRoot : location.protocol + '//' + location.host + parent.gMain.resourceRoot) + "/images");
			try {
				oWrite.ue.setContent(sHtml);
				oTemplate.setEdit(oWrite.ue.window);
			} catch (e) {
			}
		}
	},
	hideTemplate: function(){
		var c = editor.getContent();
		if(c) {
			CC.confirm(Lang.Mail.Write.replaceMail, function() {
				initContent();
			});
		} else {
			initContent();
		}
		
		function initContent(){
			editor.setContent("");
		}
		
		//Editor.hideMenu();
	},
	setEdit : function(oWin) {
		var editTpl = {};
		editTpl.keyClass = "grayEdit";
		editTpl.keyClassOn = "grayPreEdit";
		editTpl.keyClassDoing = "grayEditing";
		editTpl.doc = null;
		editTpl.init = function() {
			try {
				this.doc = oWin.document;
			} catch(e) {
				return;
			}
			if(document.all) {
				var oStyleSheet = this.doc.createStyleSheet();
				oStyleSheet.addRule(".grayEdit", "color:#999999;");
				oStyleSheet.addRule(".grayPreEdit", "color:#999999;background:#316AC5;");
			} else {
				var cssObj = this.doc.createElement("style");
				var tnObj = this.doc.createTextNode(".grayEdit{color:#999999;}.grayPreEdit{color:#999999;background:#316AC5;}body{margin:0;}");
				cssObj.appendChild(tnObj);
				this.doc.body.appendChild(cssObj);
			}
			var list = this.doc.getElementsByTagName("SPAN");
			try {
				for(var i = list.length; i > 0; i--) {
					var oSpan = list[ i - 1];
					if(oSpan.className.indexOf(editTpl.keyClass) > -1) {
						try {
							if(document.all) {
								oSpan.onclick = eObjClick;
								oSpan.onmouseover = eObjMouseover;
								oSpan.onmouseout = eObjMouseout
							} else {
								oSpan.addEventListener("click", eObjClick, false);
								oSpan.addEventListener("mouseover", eObjMouseover, false);
								oSpan.addEventListener("mouseout", eObjMouseout, false);
								oSpan.addEventListener("blur", eObjBlur, false);
							}
						} catch(e) {
							break;
						}
					} else {
						continue;
					}

				}
			} catch(e) {
			}
			function eObjClick() {
				try {
					this.className = this.className.replace(editTpl.keyClassOn, editTpl.keyClassDoing);
					this.className = this.className.replace(editTpl.keyClass, editTpl.keyClassDoing);
					this.innerHTML = '';
					this.parentNode.replaceChild(document.createTextNode("  "), this);
				} catch(e) {
				}
			}

			function eObjBlur() {
				try {
					this.className = this.className.replace(editTpl.keyClassDoing, "");
					this.innerHTML = this.innerHTML.replace(/^(&nbsp;)+|(&nbsp;)+$/ig, '');
					if(document.all) {
						oSpan.onclick = function() {
						};
					} else {
						oSpan.addEventListener("click", function() {
						}, false);
					}
				} catch(e) {
				}
			}

			function eObjMouseover() {
				this.className = this.className.replace(editTpl.keyClass, editTpl.keyClassOn);
			}

			function eObjMouseout() {
				this.className = this.className.replace(editTpl.keyClassOn, editTpl.keyClass);
			}

			function SetCwinHeight(obj) {
				var cwin = obj;
				if(document.getElementById) {
					if(cwin && !window.opera) {
						if(cwin.contentDocument && cwin.contentDocument.body.offsetHeight) {
							cwin.style.height = cwin.contentDocument.body.offsetHeight;
						} else if(cwin.Document && cwin.Document.body.scrollHeight) {
							cwin.style.height = cwin.Document.body.scrollHeight;
						}
					}

				}
			}

		};
		editTpl.init();
	}
};	
window.oTemplate = oTemplate;
    //因为你是添加button,所以需要返回这个button
    return btn;
}/*index 指定添加到工具栏上的那个位置，默认时追加到最后,editorId 指定这个UI是那个编辑器实例上的，默认是页面上所有的编辑器都会添加这个按钮*/);