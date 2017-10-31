/**
 * Rich text box _ a easy web editor
 */

var RTB_items = {};
var RTB_length = 1;

function RichTextBox() {
	this.initiliaze.apply(this, arguments);
}

(function () {
	var $ = function (id) {
		return document.getElementById(id);
	}

	RichTextBox.prototype = {
		initiliaze : function(settings) {
			settings = settings || {};
			this.id = settings.id + '' || RTB_length;
			this.initilized = false;

			RTB_items[this.id] = this;
			RTB_length++;
		},
		init : function(container) {
			var p = this;
			if(this.initilized){			
				return;
			}		
			this.menu = null;
			this.isHtml = true;
			this.savedBookmark = null;
			try {
				var ifm = jQuery("#htmlEditor" + this.id)[0];
				var f = ifm.contentWindow;
				var doc = f.document;
				var body = doc.body;
				
				if(parent.gMain.lang == "en_US") {
					// $("editToolBar1").innerHTML = "";
					// $("editToolBar2").innerHTML = "";
					// $("editToolBar3").innerHTML = "";
				}
				this.ifmElement = ifm;
				this.win = f;
				this.doc = doc;
				this.body = body;
				this.$ = function(id) {
					return p.doc.getElementById(id);
				};
			 }catch (e) {
			 }
			 
			 if(this.ifmElement && this.win && this.doc && this.body){
			 	this.initilized = true;
			 }
			 else{
			 	this.initilized = false;
			 	p.init();
			 	return;
			 }
			 
			 if(this.ifmElement.style.display != "none") {
				if(document.addEventListener) {
					this.doc.addEventListener("click", function() {
						p.hideMenu();
					}, true);
				} else if(document.attachEvent) {
					this.doc.attachEvent("onclick", function() {
						p.hideMenu();
					});
				}
				top.jQuery(document, this.win).ready(function(){
					//p.initFrameContent();
					p.active();
				});
				if(!parent.Browser.isIE) {
					this.doc.designMode = "on";
					//文档进入可编辑模式
					this.doc.contentEditable = true;
					//doc.open(); //打开流
					//doc.close();
				}
			}
			if(container) {
				if(( typeof container != 'object') && ( typeof container == 'string')) {
					container = document.getElementById(container);
				}
				container.innerHTML = this.getHtml();
			}
			 
             if(top.Browser.isIE && this.doc && this.ifmElement){
                parent.EV.observe(this.ifmElement, 'beforedeactivate', function(){
                    p.savedBookmark = p.getBookMark(p.doc);
                });
                parent.EV.observe(this.ifmElement, 'activate', function(){
                    if(p.savedBookmark){
                        p.moveToBookMark(p.doc, p.savedBookmark);
                        p.savedBookmark = null;
                    }
                });
                parent.GE.compatIETag = function(e){
                    if(e.keyCode == 13){
                        if(p.getEditorMode()){
                            var note = p.getEditorValue();

                            if(note == '' || /^<p>/i.test(note)){
                                if(note == ''){
                                    p.setEditorValue('<div></div>');
                                }
                                else{
                                    p.setEditorValue(note.replace(/<p>&nbsp;<\/p>/img, '<div></div>').replace(/<p>(.*?)<\/p>/img, '<div>$1</div>'));
                                    try{
                                        p.moveRange(-1);
                                        p.moveRange(2);
                                    }
                                    catch(e){}
                                }
                            }
                            else{
                                //parent.EV.stopObserving(p.doc, 'keyup', parent.GE.compatIETag);
                            }
                        }
                    }
                }

                 parent.EV.observe(p.doc, 'keyup', parent.GE.compatIETag);
             }
		},
		showMenu : function(id) {
			if(!this.getEditorMode()) {
				this.menu = null;
				return;
			}
			var obj = $(id);
			this.hideMenu();
			obj.style.display = "block";
			this.menu = obj;
			var ev = parent.EV.getEvent() || event;
			parent.EV.stopEvent(ev);
		},
		/**隐藏菜单*/
		hideMenu : function() {
			var menu = this.menu;
			if(menu) {
				menu.style.display = "none";
			}
		},
		/**
		 * 激活当前控件
		 */
		active: function(){
			jQuery('#txtAdvSearch', top.document).focus().blur();
		},
		/**
		 * 编辑器功能操作
		 * @param {Object} type 菜单操作
		 * @param {Object} name 操作类型
		 */
		doMenu : function(type, name) {
			var p = this;
			var support = true;
			
			if(!this.getEditorMode()) {
				this.menu = null;
				return;
			}
			this.win.focus();
			switch(type.toLowerCase()){
				case 'insertimage':
					if((top.Browser.isIE && top.Browser.ie != 9)){
						var html = "<img crs='{0}' src='{0}' />".format(name);
			            var sel = p.getSelection(p.win);
			            var range = p.getRangeObj(sel);
			            if (sel.type.toLowerCase() == 'control') {
			                range.item(0).outerHTML = html;
			            } else {
			                try {
			                    range.pasteHTML(html);
			                } catch (e) {
			                    p.body.innerHTML = html + p.body.innerHTML;
			                }
			            }
			            top.jQuery("img[crs='{0}']".format(name), p.doc).each(function(){
			                this.src = name;
			                top.jQuery(this, p.doc).removeAttr('crs');
			            });
			            support = false;
		            }
		            else{
		            	support = true;
		            }
				break;
				default:
					support = true;
				break;
			}
			
			if(support){
				execCommand();
			}
			
			function execCommand(){
				if(!name) {
					if(parent.Browser.isIE) {
						p.doc.execCommand(type);
					} else {
						p.doc.execCommand(type, false, false);
					}
				} else {
					p.doc.execCommand(type, false, name);
				}
			}
			this.hideMenu();
		},
		/**
		 * 初始化内容iframe的值
		 */
		initFrameContent: function(){
			if(this.doc && this.doc.body){
				this.doc.body.innerHTML = '<div></div>';
			}		
		},
		showPortrait : function() {
			if(!this.getEditorMode()) {
				this.menu = null;
				return;
			}
			this.hideMenu();
			this.menu = $("divPortrait" + this.id);
			var div = $("divPortrait" + this.id);
			div.style.display = "block";
			if(div.innerHTML == "") {
				var url = parent.gConst.portraitUrl;
				div.innerHTML = "<iframe id='frmPortrait" + this.id + "' border='0' marginWidth=0 marginHeight=0 frameBorder=no style='width:208px;height:202px' src='#'></iframe>";
				$("frmPortrait" + this.id).src = url + '&id=' + this.id;
			}
			var ev = parent.EV.getEvent() || event;
			if(ev){
				parent.EV.stopEvent(ev);
			}
		},
		getEditorMode : function() {
			return this.isHtml;
		},
		getHtmlToTextContent : function() {
			var body = this.doc.getElementsByTagName("BODY")[0];

			var content = "";
			if(parent.Browser.isIE) {
				content = body.innerText;
			} else {
				var tmp = body.innerHTML;
				tmp = tmp.replace(/<script(?:.*?)>.*?<\/script>/g, "");
				tmp = tmp.replace(/<style(?:.*?)>.*?<\/style>/g, "");
				if(tmp == "" || tmp == "<br>" || tmp == "<br/>") {
					return "";
				} else {
					tmp = tmp.replace(/<br\s?\/?>/ig, "\n");
					var div = document.createElement("div");
					div.innerHTML = tmp;
					content = div.textContent;
				}
			}
			return content;
		},
		setEditorValue : function(val) {
			if(this.getEditorMode()) {
				this.body.innerHTML = val.replace(/\n/g, '');
			}
		},
		getEditorValue : function() {
			var htmlMode = this.getEditorMode();
			var body = this.body;
			if(htmlMode) {
				return body.innerHTML.replace(/\n+(<br>)*$/, '');
			}
			return '';
		},
		disable: function(){
			var layer = parent.jQuery('#editor_layer_' + this.id);
			var size = parent.El.getSize(parent.jQuery('#editor_body' + this.id)[0]);
			if(layer && layer.length){			
				layer.css({
					height: size.height + 'px'
				}).show();
			}
			else{
				parent.jQuery('#editor_body' + this.id).append('<div id="editor_layer_' + this.id + '"></div>');
				parent.jQuery('#editor_layer_' + this.id).addClass('cover-layer').css({
					position: 'absolute',
					width: '100%',
					height: size.height + 'px',
					top: 0
				}).show();
			}
		},
		enable: function(){
			var layer = parent.jQuery('#editor_layer_' + this.id);
			if(layer && layer.length){
				layer.hide();
			}
		},
		/**
		 * 获取书签
		 * @param {object} doc : document object
		 * @return {object} bookmark
		 */
		getBookMark: function(doc){
			var range = doc.selection.createRange();
	        var textLength = doc.body.innerHTML.length;
	        var result = {};
	        if (range.getBookmark) {
	            result.bookmark = range.getBookmark();
	            result.startOffset = range.moveStart("character", -textLength);
	            result.endOffset = range.moveEnd("character", textLength);
	        }
	        return result;
		},
		/**
		 * 移动到书签
		 * @param {object} doc: document object.
		 * @param {object} mark: bookmark object.
		 * move to the correct position.
		 */
		moveToBookMark: function(doc, mark){
			if (!mark || !mark.bookmark) return;
	        var range = doc.body.createTextRange();
	        var textLength = doc.body.innerHTML.length;
	        range.moveToBookmark(mark.bookmark);
	        var copy = range.duplicate();
	        var startOffset = copy.moveStart("character", -textLength);
	        var endOffset = copy.moveEnd("character", textLength);
	        if (startOffset != mark.startOffset || endOffset != mark.endOffset) {
	            range.moveStart("character", startOffset - mark.startOffset);
	            range.moveEnd("character", endOffset - mark.endOffset);
	        }
	        try{
		        range.select();
			}catch(e){}
		},
		getRangeObj: function(rang){
			if(rang.createRange){
				return rang.createRange();
			}
			else{
				if(rang.getRangeAt){
					return rang.getRangeAt(0);
				}
				else{
					if(this.doc.createRange){
						var d = this.doc.createRange();
						d.setStart(rang.anchorNode, rang.anchorOffset);
						d.setEnd(rang.focusNode, rang.focusOffset);
						return d;
					}
				}
			}
		},
		getSelection: function(win){
			win = win || window;
			var s;
			if(win.getSelection){
				s = win.getSelection();
			}
			else{
				if(win.document.selection){
					s = win.document.selection;
				}
			}
			return s;
		},
        moveRange: function(offset){
            var p = this;
            var sel = p.getSelection(p.win);
            var range = p.getRangeObj(sel);

            range.moveStart('character', offset);
            range.moveEnd('character', offset);

            range.select();
        },
		/**
		 * 设置编辑器内容iframe的z-index值
		 */
		setIfrmTabIndex: function(index){
			this.ifrm_tabIndex = index;
		},
		/**
		 * 设置编辑器内容iframe的style属性值
		 */
		setIfrmStyle: function(s){
			var style = '';
			if(typeof s == 'object'){
				for(var k in s){
					if(k && k[s]){
						style += k + ':' + s[k] + ';';
					}
				}
			}
			else if(typeof s == 'string'){
				style = s;
			}
			this.ifrm_style = style;
		},
		getHtml : function() {
			var html = [];
			var style = '';
			var tabIndex = '';
			
			if(this.ifrm_tabIndex){
				tabIndex = this.ifrm_tabIndex;
			}
			
			if(this.ifrm_style){
				style = this.ifrm_style + 'width:100%;';
			}
			if(tabIndex !=''){
				tabIndex = 'tabIndex=\"' + tabIndex + '\"';
			}
			
			html.push("<div id='editor__" + this.id + "' class=\"edi_container\">");
			html.push("<div id=\"editor_body" + this.id + "\" class=\"eidt-body\">");
			html.push("<div id=\"editorToolbar" + this.id + "\" class=\"eidt-bar\">");
			html.push("<div id=\"editor_tool_bar_up" + this.id + "\" class=\"eidt-bar-li\"> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('Bold');\" class=\"edit-btn\" title=\"加粗\">");
			html.push("<!-- 选 中 加上  edit-btn-on -->");
			html.push("<span class=\"edit-btn-rc\"> <b class=\"ico-edit ico-edit-b\">");
			html.push("加粗");
			html.push("</b> </span> </a> <span class=\"line\"></span> <a class=\"edit-btn editor-btn-select\" href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].showMenu('fontFamily" + this.id + "');\" title=\"字体\"> <span class=\"edit-btn-rc\">");
			html.push("字体");
			html.push("</span> </a> <a class=\"edit-btn editor-btn-select\" href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].showMenu('fontSize" + this.id + "');\" title=\"字号\">");
			html.push("<span class=\"edit-btn-rc\">");
			html.push("字号");
			html.push("</span> </a> <span class=\"line\"></span> <a href=\"javascript:fGoto();\" class=\"edit-btn\" title=\"字体颜色\" onclick=\"RTB_items['" + this.id + "'].showMenu('fontColorSelect" + this.id + "');\"> <span class=\"edit-btn-rc\"> <b class=\"ico-edit ico-edit-color\">");
			html.push("字体颜色");
			html.push("</b> </span> </a> <a href=\"javascript:fGoto();\" class=\"edit-btn\" title=\"背景色\" onclick=\"RTB_items['" + this.id + "'].showMenu('bgColorSelect" + this.id + "');\"> <span class=\"edit-btn-rc\"> <b class=\"ico-edit ico-edit-fb\">");
			html.push("背景色");
			//html.push("</b> </span> </a> <span class=\"line\"></span> <a href=\"javascript:fGoto();\" class=\"edit-btn\" title=\"图片\" onclick=\"RTB_items['" + this.id + "'].createImages();return false;\"> <span class=\"edit-btn-rc\"> <b class=\"ico-edit ico-edit-pic\">");
			//html.push("图片");
			//html.push("</b> </span> </a> <a href=\"javascript:fGoto();\" class=\"edit-btn\" title=\"截屏\" onclick=\"RTB_items['" + this.id + "'].captureScreen();\"> <span class=\"edit-btn-rc\"> <b class=\"ico-edit ico-edit-scr\">");
			//html.push("截屏");
			html.push("</b> </span> </a> <span class=\"line\"></span> ");
			html.push("<span id=\"spanEditor" + this.id + "\"> <a href=\"javascript:fGoto();\" class=\"edit-btn\" title=\"斜体\" onclick=\"RTB_items['" + this.id + "'].doMenu('Italic');\"> <span class=\"edit-btn-rc\"> <b class=\"ico-edit ico-edit-i\">");
			html.push("斜体");
			html.push("</b> </span> </a> <a href=\"javascript:fGoto();\" class=\"edit-btn\" title=\"下划线\" onclick=\"RTB_items['" + this.id + "'].doMenu('Underline');\"> <span class=\"edit-btn-rc\"> <b class=\"ico-edit ico-edit-ud\">");
			html.push("下划线");
			//html.push("</b> </span> </a> <a href=\"javascript:fGoto();\" class=\"edit-btn\" title=\"无序列表\" onclick=\"RTB_items['" + this.id + "'].doMenu('Insertunorderedlist');\"> <span class=\"edit-btn-rc\"> <b class=\"ico-edit ico-edit-xl\">");
			//html.push("无序列表");
			//html.push("</b> </span> </a> <a href=\"javascript:fGoto();\" class=\"edit-btn\" title=\"有序列表\" onclick=\"RTB_items['" + this.id + "'].doMenu('Insertorderedlist');\"> <span class=\"edit-btn-rc\"> <b class=\"ico-edit ico-edit-xl2\">");
			//html.push("有序列表");
			html.push("</b> </span> </a> <span class=\"line\"></span> <a href=\"javascript:fGoto();\" class=\"edit-btn\" title=\"左对齐\" onclick=\"RTB_items['" + this.id + "'].doMenu('Justifyleft');\"> <span class=\"edit-btn-rc\"> <b class=\"ico-edit ico-edit-alil\">");
			html.push("左对齐");
			html.push("</b> </span> </a> <a href=\"javascript:fGoto();\" class=\"edit-btn\" title=\"居中对齐\" onclick=\"RTB_items['" + this.id + "'].doMenu('Justifycenter');\"> <span class=\"edit-btn-rc\"> <b class=\"ico-edit ico-edit-aliz\">");
			html.push("居中对齐");
			html.push("</b> </span> </a> <a href=\"javascript:fGoto();\" class=\"edit-btn\" title=\"右对齐\" onclick=\"RTB_items['" + this.id + "'].doMenu('Justifyright');\"> <span class=\"edit-btn-rc\"> <b class=\"ico-edit ico-edit-alir\">");
			html.push("右对齐");
			//html.push("</b> </span> </a> <span class=\"line\"></span> <a href=\"javascript:fGoto();\" class=\"edit-btn\" title=\"减少缩进\" onclick=\"RTB_items['" + this.id + "'].doMenu('Outdent');\"> <span class=\"edit-btn-rc\"> <b class=\"ico-edit ico-edit-jdsj\">");
			//html.push("减少缩进");
			//html.push("</b> </span> </a> <a href=\"javascript:fGoto();\" class=\"edit-btn\" title=\"缩进\" onclick=\"RTB_items['" + this.id + "'].doMenu('Indent');\"> <span class=\"edit-btn-rc\"> <b class=\"ico-edit ico-edit-addsj\">");
			//html.push("缩进");
			//html.push("</b> </span> </a> <a href=\"javascript:fGoto();\" class=\"edit-btn\"> <span class=\"edit-btn-rc\"> <b class=\"ico-edit ico-edit-sxali\">上下对齐</b> </span> </a> <a href=\"javascript:fGoto();\" class=\"edit-btn\" title=\"链接\" onclick=\"RTB_items['" + this.id + "'].doMenu('createLink');\"> <span class=\"edit-btn-rc\"> <b class=\"ico-edit ico-edit-link\">");
			//html.push("链接");
			// html.push("</b> </span> </a> <a href=\"javascript:fGoto();\" class=\"edit-btn\" title=\"表情\" onclick=\"RTB_items['" + this.id + "'].showPortrait();return false;\"> <span class=\"edit-btn-rc\"> <b class=\"ico-edit ico-edit-smile\">");
			// html.push("表情");
			html.push("</b> </span> </a></div>");
			html.push("</div>");
			html.push("<!----编辑器子菜单----->");
			html.push("<div id=\"fontFamily" + this.id + "\" class=\"pop_wrapper w178 font_Family\" style=\"display:none;\">");
			html.push("<ul class=\"fontType popList-style\">");
			html.push("<li><a style=\"font-family: '宋体';\" href=\"javascript:fGoto();\" onclick=\"jQuery('#fontFamily" + this.id + " a').removeClass('current'); jQuery(this).addClass('current');RTB_items['" + this.id + "'].doMenu('fontname','宋体');\"><i></i>宋体</a></li>");
			html.push("<li><a style=\"font-family: '黑体';\" href=\"javascript:fGoto();\" onclick=\"jQuery('#fontFamily" + this.id + " a').removeClass('current'); jQuery(this).addClass('current');RTB_items['" + this.id + "'].doMenu('fontname','黑体');\"><i></i>黑体</a></li>");
			html.push("<li><a style=\"font-family: '楷体';\" href=\"javascript:fGoto();\" onclick=\"jQuery('#fontFamily" + this.id + " a').removeClass('current'); jQuery(this).addClass('current');RTB_items['" + this.id + "'].doMenu('fontname','楷体');\"><i></i>楷体</a></li>");
			html.push("<li><a style=\"font-family: '隶书';\" href=\"javascript:fGoto();\" onclick=\"jQuery('#fontFamily" + this.id + " a').removeClass('current'); jQuery(this).addClass('current');RTB_items['" + this.id + "'].doMenu('fontname','隶书');\"><i></i>隶书</a></li>");
			html.push("<li><a style=\"font-family: '幼圆';\" href=\"javascript:fGoto();\" onclick=\"jQuery('#fontFamily" + this.id + " a').removeClass('current'); jQuery(this).addClass('current');RTB_items['" + this.id + "'].doMenu('fontname','幼圆');\"><i></i>幼圆</a></li>");
			html.push("<li><a style=\"font-family: 'Arial';\" href=\"javascript:fGoto();\" onclick=\"jQuery('#fontFamily" + this.id + " a').removeClass('current'); jQuery(this).addClass('current');RTB_items['" + this.id + "'].doMenu('fontname','Arial');\"><i></i>Arial</a></li>");
			html.push("<li><a style=\"font-family: 'Arial Black';\" href=\"javascript:fGoto();\" onclick=\"jQuery('#fontFamily" + this.id + " a').removeClass('current'); jQuery(this).addClass('current');RTB_items['" + this.id + "'].doMenu('fontname','Arial Black');\"><i></i>Arial Black</a></li>");
			html.push("<li><a style=\"font-family: 'Arial Narrow';\" href=\"javascript:fGoto();\" onclick=\"jQuery('#fontFamily" + this.id + " a').removeClass('current'); jQuery(this).addClass('current');RTB_items['" + this.id + "'].doMenu('fontname','Verdana');\"><i></i>Arial Narrow</a></li>");
			html.push("<li><a style=\"font-family: 'Times New Roman';\" href=\"javascript:fGoto();\" onclick=\"jQuery('#fontFamily" + this.id + " a').removeClass('current'); jQuery(this).addClass('current');RTB_items['" + this.id + "'].doMenu('fontname','Times New Roman');\"><i></i>Times New Roman</a></li>");
			html.push("<li><a style=\"font-family: 'Verdana';\" href=\"javascript:fGoto();\" onclick=\"jQuery('#fontFamily" + this.id + " a').removeClass('current'); jQuery(this).addClass('current');RTB_items['" + this.id + "'].doMenu('fontname','Verdana');\"><i></i>Verdana</a></li>");
			html.push("<li><a style=\"font-family: 'Comic Sans MS';\" href=\"javascript:fGoto();\" onclick=\"jQuery('#fontFamily" + this.id + " a').removeClass('current');jQuery(this).addClass('current');RTB_items['" + this.id + "'].doMenu('fontname','Verdana');\"><i></i>Comic Sans MS</a></li>");
			html.push("<li><a style=\"font-family: 'Courier';\" href=\"javascript:fGoto();\" onclick=\"jQuery('#fontFamily" + this.id + " a').removeClass('current');jQuery(this).addClass('current');RTB_items['" + this.id + "'].doMenu('fontname','Verdana');\"><i></i>Courier</a></li>");
			html.push("<li><a style=\"font-family: 'System';\" href=\"javascript:fGoto();\" onclick=\"jQuery('#fontFamily" + this.id + " a').removeClass('current');jQuery(this).addClass('current');RTB_items['" + this.id + "'].doMenu('fontname','Verdana');\"><i></i>System</a></li>");
			html.push("</ul>");
			html.push("</div>");
			html.push("<div id=\"fontSize" + this.id + "\" class=\"pop_wrapper w175 font_Size\" style=\"display:none;\">");
			html.push("<ul class=\"popList-style fontSize\">");
			html.push("<li><a href=\"javascript:fGoto();\" onclick=\"jQuery('#fontSize" + this.id + " a').removeClass('current'); jQuery(this).addClass('current');RTB_items['" + this.id + "'].doMenu('fontsize',3);\" style=\"font-size:small\"><i></i>");
			html.push("<span>特小</span>");
			html.push("</a></li>");
			html.push("<li><a href=\"javascript:fGoto();\" onclick=\"jQuery('#fontSize" + this.id + " a').removeClass('current'); jQuery(this).addClass('current');RTB_items['" + this.id + "'].doMenu('fontsize',4);\" style=\"font-size:medium\"><i></i>");
			html.push("<span>中</span>");
			html.push("</a></li>");
			html.push("<li><a href=\"javascript:fGoto();\" onclick=\"jQuery('#fontSize" + this.id + " a').removeClass('current'); jQuery(this).addClass('current');RTB_items['" + this.id + "'].doMenu('fontsize',5);\" style=\"font-size:larger\"><i></i>");
			html.push("<span>大</span>");
			html.push("</a></li>");
			html.push("<li><a href=\"javascript:fGoto();\" onclick=\"jQuery('#fontSize" + this.id + " a').removeClass('current'); jQuery(this).addClass('current');RTB_items['" + this.id + "'].doMenu('fontsize',6);\" style=\"font-size:large\"><i></i>");
			html.push("<span>较大</span>");
			html.push("</a></li>");
			html.push("<li><a href=\"javascript:fGoto();\" onclick=\"jQuery('#fontSize" + this.id + " a').removeClass('current'); jQuery(this).addClass('current');RTB_items['" + this.id + "'].doMenu('fontsize',7);\" style=\"font-size:x-large\"><i></i>");
			html.push("<span>很大</span>");
			html.push("</a></li>");
			html.push("</ul>");
			html.push("</div>");
			html.push("<div id=\"bgColorSelect" + this.id + "\" class=\"menuPop shadow font-colorpop bg_ColorSelect\" style=\"display:none;\">");
			html.push("<div class=\"fontcolor-list m_clearfix\"> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('backcolor','#000000');\"><span style=\"background-color: rgb(0, 0, 0);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('backcolor','#993300');\"><span style=\"background-color: rgb(153, 51, 0);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('backcolor','#333300');\"><span style=\"background-color: rgb(51, 51, 0);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('backcolor','#003300');\"><span style=\"background-color: rgb(0, 51, 0);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('backcolor','#003366');\"><span style=\"background-color: rgb(0, 51, 102);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('backcolor','#000080');\"><span style=\"background-color: rgb(0, 0, 128);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('backcolor','#333399');\"><span style=\"background-color: rgb(51, 51, 153);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('backcolor','#333333');\"><span style=\"background-color: rgb(51, 51, 51);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('backcolor','#800000');\"><span style=\"background-color: rgb(128, 0, 0);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('backcolor','#FF6600');\"><span style=\"background-color: rgb(255, 102, 0);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('backcolor','#808000');\"><span style=\"background-color: rgb(128, 128, 0);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('backcolor','#008000');\"><span style=\"background-color: rgb(0, 128, 0);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('backcolor','#008080');\"><span style=\"background-color: rgb(0, 128, 128);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('backcolor','#0000FF');\"><span style=\"background-color: rgb(0, 0, 255);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('backcolor','#666699');\"><span style=\"background-color: rgb(102, 102, 153);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('backcolor','#808080');\"><span style=\"background-color: rgb(128, 128, 128);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('backcolor','#FF0000');\"><span style=\"background-color: rgb(255, 0, 0);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('backcolor','#FF9900');\"><span style=\"background-color: rgb(255, 153, 0);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('backcolor','#99CC00');\"><span style=\"background-color: rgb(153, 204, 0);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('backcolor','#339966');\"><span style=\"background-color: rgb(51, 153, 102);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('backcolor','#33CCCC');\"><span style=\"background-color: rgb(51, 204, 204);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('backcolor','#3366FF');\"><span style=\"background-color: rgb(51, 102, 255);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('backcolor','#800080');\"><span style=\"background-color: rgb(128, 0, 128);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('backcolor','#999999');\"><span style=\"background-color: rgb(153, 153, 153);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('backcolor','#FF00FF');\"><span style=\"background-color: rgb(255, 0, 255);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('backcolor','#FFCC00');\"><span style=\"background-color: rgb(255, 204, 0);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('backcolor','#FFFF00');\"><span style=\"background-color: rgb(255, 255, 0);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('backcolor','#00FF00');\"><span style=\"background-color: rgb(0, 255, 0);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('backcolor','#00FFFF');\"><span style=\"background-color: rgb(0, 255, 255);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('backcolor','#00CCFF');\"><span style=\"background-color: rgb(0, 204, 255);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('backcolor','#993366');\"><span style=\"background-color: rgb(153, 51, 102);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('backcolor','#C0C0C0');\"><span style=\"background-color: rgb(192, 192, 192);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('backcolor','#FF99CC');\"><span style=\"background-color: rgb(255, 153, 204);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('backcolor','#FFCC99');\"><span style=\"background-color: rgb(255, 204, 153);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('backcolor','#FFFF99');\"><span style=\"background-color: rgb(255, 255, 153);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('backcolor','#CCFFCC');\"><span style=\"background-color: rgb(204, 255, 204);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('backcolor','#CCFFFF');\"><span style=\"background-color: rgb(204, 255, 255);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('backcolor','#99CCFF');\"><span style=\"background-color: rgb(153, 204, 255);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('backcolor','#CC99FF');\"><span style=\"background-color: rgb(204, 153, 255);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('backcolor','#FFFFFF');\"><span style=\"background-color: rgb(255, 255, 255);\"></span></a> </div>");
			html.push("</div>");
			html.push("<div id=\"fontColorSelect" + this.id + "\" class=\"menuPop shadow font-colorpop font_ColorSelect\" style=\"display:none;\">");
			html.push("<div class=\"fontcolor-list m_clearfix\"> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('forecolor','#000000');\"><span style=\"background-color: rgb(0, 0, 0);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('forecolor','#993300');\"><span style=\"background-color: rgb(153, 51, 0);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('forecolor','#333300');\"><span style=\"background-color: rgb(51, 51, 0);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('forecolor','#003300');\"><span style=\"background-color: rgb(0, 51, 0);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('forecolor','#003366');\"><span style=\"background-color: rgb(0, 51, 102);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('forecolor','#000080');\"><span style=\"background-color: rgb(0, 0, 128);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('forecolor','#333399');\"><span style=\"background-color: rgb(51, 51, 153);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('forecolor','#333333');\"><span style=\"background-color: rgb(51, 51, 51);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('forecolor','#800000');\"><span style=\"background-color: rgb(128, 0, 0);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('forecolor','#FF6600');\"><span style=\"background-color: rgb(255, 102, 0);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('forecolor','#808000');\"><span style=\"background-color: rgb(128, 128, 0);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('forecolor','#008000');\"><span style=\"background-color: rgb(0, 128, 0);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('forecolor','#008080');\"><span style=\"background-color: rgb(0, 128, 128);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('forecolor','#0000FF');\"><span style=\"background-color: rgb(0, 0, 255);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('forecolor','#666699');\"><span style=\"background-color: rgb(102, 102, 153);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('forecolor','#808080');\"><span style=\"background-color: rgb(128, 128, 128);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('forecolor','#FF0000');\"><span style=\"background-color: rgb(255, 0, 0);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('forecolor','#FF9900');\"><span style=\"background-color: rgb(255, 153, 0);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('forecolor','#99CC00');\"><span style=\"background-color: rgb(153, 204, 0);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('forecolor','#339966');\"><span style=\"background-color: rgb(51, 153, 102);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('forecolor','#33CCCC');\"><span style=\"background-color: rgb(51, 204, 204);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('forecolor','#3366FF');\"><span style=\"background-color: rgb(51, 102, 255);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('forecolor','#800080');\"><span style=\"background-color: rgb(128, 0, 128);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('forecolor','#999999');\"><span style=\"background-color: rgb(153, 153, 153);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('forecolor','#FF00FF');\"><span style=\"background-color: rgb(255, 0, 255);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('forecolor','#FFCC00');\"><span style=\"background-color: rgb(255, 204, 0);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('forecolor','#FFFF00');\"><span style=\"background-color: rgb(255, 255, 0);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('forecolor','#00FF00');\"><span style=\"background-color: rgb(0, 255, 0);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('forecolor','#00FFFF');\"><span style=\"background-color: rgb(0, 255, 255);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('forecolor','#00CCFF');\"><span style=\"background-color: rgb(0, 204, 255);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('forecolor','#993366');\"><span style=\"background-color: rgb(153, 51, 102);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('forecolor','#C0C0C0');\"><span style=\"background-color: rgb(192, 192, 192);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('forecolor','#FF99CC');\"><span style=\"background-color: rgb(255, 153, 204);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('forecolor','#FFCC99');\"><span style=\"background-color: rgb(255, 204, 153);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('forecolor','#FFFF99');\"><span style=\"background-color: rgb(255, 255, 153);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('forecolor','#CCFFCC');\"><span style=\"background-color: rgb(204, 255, 204);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('forecolor','#CCFFFF');\"><span style=\"background-color: rgb(204, 255, 255);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('forecolor','#99CCFF');\"><span style=\"background-color: rgb(153, 204, 255);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('forecolor','#CC99FF');\"><span style=\"background-color: rgb(204, 153, 255);\"></span></a> <a href=\"javascript:fGoto();\" onclick=\"RTB_items['" + this.id + "'].doMenu('forecolor','#FFFFFF');\"><span style=\"background-color: rgb(255, 255, 255);\"></span></a> </div>");
			html.push("</div>");
			html.push("<div id=\"divPortrait" + this.id + "\" class=\"fontSelect div_Portrait\"></div>");
			html.push("<div id=\"divImage" + this.id + "\" class=\"fontSelect div_Image\"></div>");
			html.push("<!----编辑器子菜单结束----->");
			html.push("<div class=\"eidt-content\">");
			html.push("<iframe tabindex=\"8\" hidefocus=\"1\" id=\"htmlEditor" + this.id + "\" name=\"htmlEditor" + this.id + "\" frameborder=\"0\" src='" + top.gMain.webPath + "/static/se/mail/editor.htm' marginHeight=\"0\" marginWidth=\"0\" width=\"100%\" style=\"" + style + "\" " + tabIndex + "></iframe>");
			html.push("<textarea id=\"sourceEditor" + this.id + "\" name=\"sourceEditor" + this.id + "\" class=\"eidt-textarea\"style=\"height:100%;width:100%;display:none;border:0px;white-space: pre-wrap;white-space: -moz-pre-wrap;white-space: -pre-wrap;white-space: -o-pre-wrap;word-wrap: break-word;\"></textarea>");
			html.push("</div>");
			html.push("<a href=\"javascript:void(0)\" class=\"stationery\"></a> </div>");
			html.push("</div>");

			return html.join('');
		}
	};
})();

RTB_items.init = function() {
	for(var k in RTB_items) {
		if(RTB_items[k] instanceof RichTextBox) {
			if(RTB_items[k].initilized !== true) {
				RTB_items[k].init();
			}
		}
	}
};

// Editor iframe need to spent a little time to load it's page. so we should confirm the class was initilized.
// var loadedScript = setInterval(function(){
	// var loaded = true;
	// for(var k in RTB_items){
		// if(RTB_items[k] instanceof RichTextBox){
			// if(RTB_items[k].initilized !== true){
				// RTB_items[k].init();
				// loaded = false;
			// }
		// }
	// }
	// if(loaded){
		// clearInterval(loadedScript);
	// }
// }, 100);


