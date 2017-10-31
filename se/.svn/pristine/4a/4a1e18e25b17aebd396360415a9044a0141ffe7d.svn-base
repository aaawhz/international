UE.registerUI('buttonSpeelCheck',function(editor,uiName){
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
        title:"拼写检查",
        //需要添加的额外样式，指定icon图标，这里默认使用一个重复的icon
        cssRules :'background-position: -123px -19px;',
        //点击时执行的命令
        onclick:function () {
            //这里可以不用执行命令,做你自己的操作也可
		 	
			spellCheck();
			 
        }
    });﻿
	
	
	function spellCheck() {
		//下一次检测的时候需要去掉上一次wrap的错误标示标签
		if(checkSpell.res.length>0){
			var ifmDoc = editor.document;
			checkSpell.ignoreAll(ifmDoc);
		}
		var _str = editor.getContent();
		var noTagStr =editor.getContentTxt()||""; //Editor.getHtmlToTextContent() || '';
		jQuery("#editor_spellcheck").html("重新检查");
		if(checkSpell.checkState==1){//正在检查请稍候重试
			parent.CC.showMsg("正在检查...", true, false, 'caution');
		}
		var checkOrNot = false;
		if (!/[a-zA-z]+/.test(noTagStr)) {
			parent.CC.alert("对不起，拼写检查暂时只支持英文。", null, "系统提示");
			checkOrNot =  false;
		} else {
			if (/[\u4E00-\u9FA5]+/.test(noTagStr)) {
				var customSpellChkMemoray =CC.getUserAttributeFromLocal('_custom_editorSpellChkTip')
				var needTips = customSpellChkMemoray !==""  ? false : true ;
				var ao = {
				    id : 'confirm',
				    title: '系统提示',
					type : 'text',
				    text : '拼写检查暂不支持中文。不过，我们仍可以检查您邮件中的所有英文拼写。<br><br>                         <input id="editorSpellChkTip" type="checkbox"/>&nbsp;不再提示',
					zindex:1090,
					dragStyle:1,
					buttonType:'confirm',
					buttons: [{
						text: "检查",
						clickEvent: function(){
							checkSpell.doCheck(_str);
							var chk = jQuery('#editorSpellChkTip',parent.window.document).prop("checked");
							if(chk){
								CC.writeUserAttributesToServer({_custom_editorSpellChkTip: '1'}) 
							}
						}
					}, {
						text: "不检查",
						clickEvent: function() {
							var chk = jQuery('#editorSpellChkTip',parent.window.document).prop("checked");
							if(chk){
								CC.writeUserAttributesToServer({_custom_editorSpellChkTip: '1'}) 
							}
					},
						isCancelBtn: true
					}]
				};
				if(needTips){//需要提示
					parent.CC.msgBox(ao);
				}else{//保存过用户习惯 不需要提示 
					checkOrNot = true;
				}
			}else{
				checkOrNot = true;
			}
		}
		var tmpreg = /<(script|style)(?:.*?)>.*?<\/\1>/g;
		checkSpell.toBeAdded = _str.match(tmpreg)||[];
		_str = _str.replace(tmpreg, "");
		if(checkOrNot){checkSpell.doCheck(_str)}
	}
	
	var checkSpell = {
	checkState:0,//0检查之前 1正在检查 2检查完成
	res:[],//错误单词结果数组
	tagArr:[],//送检过滤掉的html标签数组
	listNum:5,//错误单词建议提示项数
	toBeAdded:[],//脚本样式不用检测，送检前过滤掉了，回显时需要加上
	doCheck:function(_str){
		var _str =     _str.replace(/\r\n|\r|\n/g, "").replace(/(<(\/div|br\s*\/?)>)/gi,'\n$1'),
			tagReg	   = /(?:<.*?>)+/g,  			//标签正则
			tagArr     = _str.match(tagReg)||[];	//标签数组

 		pureTxtArr = _str.split(tagReg);   //标签分隔后的纯文本数组
		var  pureTxtArr = checkSpell.arrFilter.call(pureTxtArr,function(i){return (i !== undefined && i !== "");}), //过滤掉 split可能产生的undefined项
		pureTxtStr = pureTxtArr.join(""),	//纯文本
		reTxt      = [],					//返回结果
	    pureTxtItemRed = [];				//pureTxtArr 各项pos范围内的错误信息数组
		    
		parent.CC.showMsg("正在检查...", true, false, 'option');
		checkSpell.checkState = 1;//正在检查
		var htmlStr = "<div id=\"checkSpellLayout\" style=\"position: absolute; z-index: 1000; height: 100%; width: 100%; top: 0px; left: 0px;\"></div>";
		jQuery(".editorWrap").append(htmlStr);
		pureTxtStr = pureTxtStr.decodeHTML();
		// 请求检查结果
		jQuery.ajax({
			type: "POST",
			url: top.gMain.urlService+"/mail/conf.do?func="+top.gConst.func.spellCheck+"&sid="+top.gMain.sid+"&r="+new Date().getTime(),
			data:pureTxtStr,
			contentType:"application/json",
			dataType: "json",
			success:function(_res){
				//扩展错误单词信息 分配id， containTag这个单词起始字符之间的标签
				var scanPos=0,i=0,k=0;
				if(_res.code=="S_OK"){
					_res=_res["var"];
				}else{
					parent.CC.showMsg("很抱歉，拼写检查出错了", true, false, "error");
					return;
				}
				if(_res==null||_res.length<1){
					parent.CC.showMsg("检查成功", true, false, 'option');
					checkSpell.checkState = 2;//2检查完成
					jQuery("#checkSpellLayout").remove();
					return;
				}
				checkSpell.arrrForEach.call(_res,function(_v,_i){
					var spanId = new Date();
					spanId = spanId.getTime() + Math.random() + "";
					_res[_i].sId  = spanId;
					_res[_i].containTag = [];
					_res[_i].pos = parseInt(_res[_i].pos);
				});
				checkSpell.res = _res;
				checkSpell.tagArr = tagArr;
				checkSpell.arrrForEach.call(pureTxtArr,function(_arr,_index){
					pureTxtArr[_index] = pureTxtArr[_index].decodeHTML();
				});
				for (; i < pureTxtArr.length; i++) {
					var tmpScanPos = scanPos;
					scanPos += pureTxtArr[i].length;
					pureTxtItemRed[i] = [];			//pureTxtArr[i]里的错误
					for (; k < _res.length;k++ ) {
						if(_res[k].pos< scanPos && _res[k].pos+_res[k].src.length>scanPos){
							pureTxtItemRed[i].push({
												"src": _res[k].src,
												"pos": _res[k].pos-tmpScanPos,
												"sId":_res[k].sId
											});
							break;
						}else if(_res[k].pos< tmpScanPos && _res[k].pos+_res[k].src.length>tmpScanPos){
							pureTxtItemRed[i].push({
												"src": _res[k].src,
												"pos": _res[k].pos-tmpScanPos,
												"sId":_res[k].sId
											});
							k++;
							break;
						}else if(_res[k].pos< scanPos){
							pureTxtItemRed[i].push({
												"src": _res[k].src,
												"pos": _res[k].pos-tmpScanPos,
												"sId":_res[k].sId
											});
						}else{
							break;
						}
					};
				};
				checkSpell.arrrForEach.call(pureTxtItemRed,function(_arr,_index){ //处理pureTxtArr里每一项所包含的所有错误单词，包裹标签
					pureTxtArr[_index] = checkSpell.addRedSpan(_arr,pureTxtArr[_index]);

				});
				for (var i = 0; i < Math.max(tagArr.length, pureTxtArr.length); i++) { //拼接源格式中的标签和处理过错误的纯文本
					if (tagArr[i]) {
						reTxt.push(tagArr[i]);
					}
					if (pureTxtArr[i]) {
						reTxt.push(pureTxtArr[i].replace(/\n/g, ""));
					}
				};
				for (var j = 0,len=checkSpell.toBeAdded.length;j < len; j++) {
					reTxt.push(checkSpell.toBeAdded[j]);
				};
				
				//Editor.setEditorValue(reTxt.join("").replace(/&nbsp;/g, " "));
				editor.setContent(reTxt.join("").replace(/&nbsp;/g, " "));
				var ifmDoc = editor.document;
				jQuery("span.errorWord",ifmDoc).bind("click",function(event){
					var eTarget = event.currentTarget; 
						checkSpell.showSuggestPanel.call(eTarget,ifmDoc);
					event.stopPropagation();
				});
				parent.CC.showMsg("检查成功", true, false, 'option');
				checkSpell.checkState = 2;//2检查完成
				jQuery("#checkSpellLayout").remove();
			},
			fail: function () {
				jQuery("#checkSpellLayout").remove();
			}
		});
	},
	//错误单词字符内部有无没闭合的标签 [table Todo]
	hasUnCloseTag:function (_errorId){
		var tagStr = "",ctagArr = [];
		var preSpanReg=/<[^>/]*>$/,lastSpanReg=/^<\/[^>*]>/;
		for (var i = 0; i < checkSpell.res.length; i++) {
			if(checkSpell.res[i].sId == _errorId){
				ctagArr = checkSpell.res[i].containTag;
				for(var j=0;j<ctagArr.length;j++){
					tagStr += checkSpell.tagArr[ctagArr[j]];
				};
				break;
			}
		};
		return preSpanReg.test(tagStr)||lastSpanReg.test(lastSpanReg);
	},
	//错误单词包裹标签，如果某个错误单词字符内部有未闭合的标签 则不包裹
	addRedSpan:function (_arr,_str){
		var txt = _str,resTxt=[],searchPos = txt.length;
		for (var i = _arr.length - 1; i >= 0; i--) {
			var redWordStartPos = _arr[i].pos,wordLen = _arr[i].src.length;
			if(redWordStartPos>=0){
				if(redWordStartPos+wordLen>searchPos){
					if(!checkSpell.hasUnCloseTag(_arr[i].sId)){
			 			resTxt.unshift("<span class='errorWord' id='"+_arr[i].sId+"'>"+txt.substring(redWordStartPos).encodeHTML());
			 		}else{					//单词字符内部有未闭合的标签
			 			resTxt.unshift(txt.substring(redWordStartPos).encodeHTML());
					}
				}else{
					resTxt.unshift("<span class='errorWord' id='"+_arr[i].sId+"'>"+txt.substring(redWordStartPos,redWordStartPos+wordLen).encodeHTML()+"</span>"+txt.substring(redWordStartPos+wordLen,searchPos).encodeHTML());
				}
			}else if(redWordStartPos<0){ 
				if(Math.abs(redWordStartPos)+searchPos>=wordLen){
					if(!checkSpell.hasUnCloseTag(_arr[i].sId)){
						resTxt.unshift(txt.encodeHTML().substring(0,redWordStartPos+wordLen)+"</span>"+txt.encodeHTML().substring(redWordStartPos+wordLen));
			 		}else{					//单词字符内部有未闭合的标签
						resTxt.unshift(txt.encodeHTML().substring(0,redWordStartPos+wordLen)+txt.encodeHTML().substring(redWordStartPos+wordLen));
					}
				}else{
						resTxt.unshift(txt.encodeHTML());
				}
			}
			searchPos = redWordStartPos;
		};
		resTxt.unshift(txt.substring(0,searchPos).encodeHTML());
		
		return resTxt.join("");
	},
	//错误标识单词点击显示拼写建议面板
	showSuggestPanel:function(doc){
		var panel = jQuery("#suggestPanel"),errorId = this.id;
		if(panel.length<=0){
			panel = document.createElement("div");
			panel.id = "suggestPanel";
			panel.className = "pop_wrapper w135";
			jQuery("#edui1").append(panel);
			//editor.execCommand('insertHtml', panel)
			//jQuery("#editor_body").append(panel);
			panel.style.textAlign = "center";
			panel.style.zIndex = 1001;
		}else{
			panel.show();
			panel = panel.get(0);
		}
		//错误拼写建议列表
		var panelHtml ='<ul class="module_pop" style="min-width:120px">';
		var errorArr = checkSpell.res||[],len = errorArr.length;
		for (var i = 0; i < len; i++) {
			if(errorArr[i].sId == errorId){
				if(errorArr[i].cases.length>0){
					for (var j = 0; j < Math.min(checkSpell.listNum,errorArr[i].cases.length); j++) {
						panelHtml+='<li>'+errorArr[i].cases[j]+'</li>'
					};
				}else{
					panelHtml+='<li>暂无提示</li>';
				}
				break;
			}
		};
		panelHtml+='<li class="line"></li><li>忽略</li><li>忽略全部</li></ul>';
		panel.innerHTML = panelHtml;
		var $errorWords = jQuery(this);
		var errorCoor = $errorWords.position();
		var stop = doc.documentElement.scrollTop || doc.body.scrollTop;
		var ptop = errorCoor.top-stop > jQuery("#editor_body").outerHeight()/2 ? errorCoor.top-stop+34-panel.offsetHeight: errorCoor.top-stop+34+this.offsetHeight;
		jQuery(panel).css({"left" :errorCoor.left+"px","top":ptop+ "px"});
		jQuery(panel).unbind( "click" ).bind("click",function(event){
			checkSpell.clickSuggestItem.call($errorWords,event,doc);
			jQuery("#suggestPanel").hide();
		}).find("li:not(.line)").hover(
			function(){
				jQuery(this).css("background","#3b5998");
			},function(){
				jQuery(this).css("background","");
			}
		);

		if(parent.documentEventManager){
			//注册全局事件隐藏拼写建议菜单
			parent.documentEventManager.register('hideSpellPanel', function(){
				jQuery("#suggestPanel").hide();

			});
			parent.documentEventManager.addEvent('click', 'hideSpellPanel');
			parent.documentEventManager.addDoc(document);
		}

	},
	//拼写建议项单击
	clickSuggestItem:function(event,doc){
		var target = event.target,$errorWord = this;
		var suggestOpt = target.innerHTML;
		if(jQuery(target).is("li:not(.line)")){
			if (suggestOpt.indexOf("全部") >= 0) {
				checkSpell.ignoreAll(doc);
			} else {
				if (suggestOpt.indexOf("忽略") >= 0) {
					checkSpell.ignore($errorWord);
				} else {
					if (suggestOpt && suggestOpt.indexOf("暂无提示") < 0) {
						checkSpell.wordReplace($errorWord,suggestOpt);
					}
				}
			}

		}
	},
	//忽略错误
	ignore:function(_errorWord){
		jQuery(_errorWord).replaceWith(jQuery(_errorWord).text());
	},
	//使用选择的建议项替换错误标示的单词
	wordReplace:function(_errorWord,_suggestOpt){
		jQuery(_errorWord).replaceWith(_suggestOpt);
	},
	ignoreAll:function(doc){
		jQuery(".errorWord",doc).each(function(index){
			var thisTxt = jQuery(this).text();
			jQuery(this).replaceWith(thisTxt);
		});
	},
	/**
	 * Ajax请求封装
	 * @param {object} obj ajax请求hash map
	 */
	ajaxRequest: function(obj){
		var callback = obj.callback || function(){};
		var failback = obj.failback || function(){};
		var func = obj.func || '';
		var url = obj.url || '';
		var data = obj.data || [];

		var reqObj = {
            func: func,
			data: data,
			call: callback,
			failCall: failback
		};
		if(url != ''){
			reqObj.url = url;
			parent.MM.mailRequestWebApi(reqObj);
		}
        else{
            parent.MM.mailRequest(reqObj);
        }
	},
	arrrForEach: function(fn, context) {
		for (var k = 0, length = this.length; k < length; k++) {
			if (typeof fn === "function" && Object.prototype.hasOwnProperty.call(this, k)) {
				fn.call(context, this[k], k, this);
			}
		}
	},
	arrFilter: function(fn, context) {
		var arr = [];
		if (typeof fn === "function") {
			for (var k = 0, length = this.length; k < length; k++) {
				fn.call(context, this[k], k, this) && arr.push(this[k]);
			}
		}
		return arr;
	}
};
return btn;
},[26])