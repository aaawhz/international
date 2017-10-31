/**
 * @author Jiangwb
 */

var OptionBase = function() {
	// 清除RichTextBox 实例
	if(RTB_items){
		for(var k in RTB_items){
			if(k && RTB_items[k] instanceof RichTextBox){
				RTB_items[k] = null;
				delete RTB_items[k];
			}
		}
	}
};

OptionBase.prototype = {
	/**
	 * initService
	 */
	initService : function(attrs, cb, fcb) {
		if(this.attrs.free || GC.check(this.attrs.authority)){
			var p = this;
			var callback = function(ao) {
				p.initData(ao["var"], cb);
			};
			p.doService(attrs.list.func, attrs.list.data, callback, fcb);
		}else{
			CC.forbidden();
		}
	},
	doService : function(func, data, cb, fcb,url) {
		var callback = function(ao) {
			if( typeof (cb) == "function") {
				cb(ao);
			}
		};
		
		var url = url || "/mail/conf";
		fcb = fcb ||
		function() {
			//CC.alert(Lang.Mail.ConfigJs.filter_failed);
		};
		
		MM.doService({
			url : url,
			func : func,
			data : data,
			failCall : fcb,
			call : callback,
			param : ""
		});
	},
	doServiceInXml : function(func, data, cb, fcb,url) {
		var callback = function(ao) {
			if( typeof (cb) == "function") {
				cb(ao);
			}
		};

		var url = url || "/mail/conf";
		fcb = fcb ||
			function() {
				//CC.alert(Lang.Mail.ConfigJs.filter_failed);
			};

		MM.doService({
			url : url,
			func : func,
			dataType: 'xml',
			data : data,
			params: {
				format: 'xml'
			},
			failCall : fcb,
			call : callback,
			param : ""
		});
	},
	/***
	 * Ajax请求封装
	 * @param {Object} attrs 数据
	 * @param {Object} cb 成功回调函数
	 * @param {Object} fcb 失败回调函数
	 * @param {Object} isUseUrl 是否自定义服务器url /自定义url需自行封装func和ssoid
	 */
	request : function(attrs, cb, fcb, isUseUrl) {
	
		if(this.attrs.free || GC.check(this.attrs.authority)){
			var p = this;
			if(!attrs.noReq) {
				var list = attrs.list || {};
				var data = list.data || this.getData(attrs.data);
				var callback = function(ao) {
					p.initData(ao, cb);
				};
				if(isUseUrl) {//是否使用
					p.ajaxRequest(attrs.list.func, data, callback, fcb, attrs.url, attrs.ajaxType);
				} else {
					p.ajaxRequest(attrs.list.func, data, callback, fcb, attrs.ajaxType);
				}
			} else {
				p.initData("", cb);
			}
		}
		else{
			CC.forbidden();
		}
	},
	/***
	 * ajax请求
	 * @param {Object} func
	 * @param {Object} data
	 * @param {Object} cb
	 * @param {Object} fcb
	 * @param {Object} url 自行组装func和ssoid /url不为空时会忽略func
	 */
	ajaxRequest : function(func, data, cb, fcb, url, type) {
		var callback = function(data) {
			try {
				if( typeof (cb) == "function") {
					cb(data["var"]);
				}
			} catch(e) {
				
			}
		};
		fcb = fcb ||
		function() {
			//CC.alert(Lang.Mail.ConfigJs.filter_failed);
		};

		var obj = {
			data : data,
			call : callback,
			failCall : fcb
		};
		if(type == 2 || func === "user:getSignatures") {
			if (func === "user:getSignatures") {
				obj.func = "user:getSignatures";
			}
			obj.url = url;
			MM.mailRequestApi(obj);
			return;
		}
		if(url) {
			if(func){
				// obj.func = func;
			}
			obj.url = url;
			MM.mailRequestWebApi(obj);
		} else {
			obj.func = func;
			MM.mailRequest(obj);
		}

	},
	seqRequest : function(data, cb, fcb, msg) {
		MM.seqRequest(data, cb, null, msg);
	},
	/***
	 * 获取对象属性名组装成特定字符串返回
	 * @param {Object} ad 属性对象
	 */
	getData : function(ad) {
		var da = [];
		//if (ad.type == "url") {
		for(var o in ad) {
			da.push(o.toLowerCase());
		}
		return da.join("&");
		//}
	},
	initDataField : function() {
		var data = this.attrs.data;
		for(var o in data) {
			var ao = data[o];
			if(ao.attribute) {
				ao.attribute.value = "";
			}

		}
	},
	/***
	 * 初始化属性
	 * @param {Object} val 返回值（对象）
	 * @param {Object} cb 回调函数
	 */
	initData : function(val, cb) {
		var p = this;
		var attrs = p.attrs;
		try {
			data = attrs.data || attrs;
			var type = Util.getVarType(val);
			if(type != "array" && !p.attrs.noReq) {
				for(var o in data) {
					var ao = data[o];
					var v = "";
					if(val) {
						v = val[o];
						if( typeof (v) != "undefined") {
							if(ao.format) {
								switch (ao.format) {
									case "time":
										v = parent.Util.formatDate(v);
										break;
									case "html":
										v = (v + "").decodeHTML();
									break;
									case  "cdata":
										v = (v + "");
									break
									default:
										//由于后台没有对xml解码后的报文进行的还原，因此在这里
										v = (v + "").decodeXML();
										break;
								}
							}
							if(ao.attribute) {
								ao.attribute.value = v;
							} else {
								ao.attribute = {};
								ao.attribute.value = v;
							}
						}
					}
				}
			}
			if( typeof (cb) == "function") {
				cb.call(p, attrs, val);
			} else {
				this.getHtml(attrs, val);
			}
		} catch(e) {
			CC.alert(e);
		}
	},
	/***
	 * 获取导航部分信息
	 */
	getNavMenu : function(id) {
		var html = [];
		var datas = MM[gConst.setting].menuData;
		var type = MM[gConst.setting].menuItem[id].type;
		var items = datas[type].items;
/*
		 html.push("<ul class=\"navSet\" id=\"option_menu_{0}\">".format(id));
		 for (var n in items) {
		 if (GC.check("MAIL_CONFIG_" + n.toUpperCase())) {
		 var itemname = items[n].name;
		 if (id == n) {
		 html.push("<li class=\"on\">·{0}</li>".format(itemname));
		 } else {
		 html.push("<li>·<a onclick=\"CC.setConfig('{0}');return false;\" href=\"javascript:fGoto();\">{1}</a></li>".format(n, itemname));
		 }
		 }
		 }
		 html.push("</ul>");
	*/

		return html.join("");
	},
	/***
	 * 获取设置页面头部信息
	 * @param {String} title 标题信息
	 * @param {String} tips 标题详细说明信息，
	 * @param {String} 自定义说明信息，自己组装html字符串
	 */
	getHead : function(title, tips, s) {
		//var html = "<h1>{0}</h1>".format(title);
		var html="";
		if(tips) {
			html += "<p class=\"explanation\">{0}</p>".format(tips);
		} else if(s) {
			html += s;
		}
		return html;
	},
	/***
	 * 获取底部信息，
	 * @param {string} s 底部信息字符串
	 */
	getBottom : function(s) {
		if(s) {
			return "<ol class=\"tips\">{0}</ol>".format(s);
		} else {
			return "";
		}
	},
	/***
	 * 标准表格组装
	 * @param {Object} attrs
	 */
	getTable : function(attrs, tbid, display) {
		var html = [];
		var cn = (attrs.tableClass) ? " class=\"" + attrs.tableClass + "\"" : "";
		html.push("<fieldset class=\"formSet\"><table cellpadding=\"0\"{0} id='{1}' style='{2}'><tbody>".format(cn, tbid || '', display || ''));
		for(var o in attrs.data) {
			var item = attrs.data[o];
			if( typeof (item) == 'object' && ( typeof (item.display) == 'undefined' || item.display)) {
				var cid = typeof (attrs.data.id) != 'object' ? attrs.data.id : '';
				html.push(this.getTr(o, item, cid));
			}
		}
		html.push(this.getButtons(attrs.buttons, attrs.data.id));
		html.push("</tbody></table></fieldset>");
		return html.join("");
	},
	/***
	 * 表格列表组装HTML
	 * ao{title:'',head:{title:[],className:[]},items[[]]}
	 * items为二维数组 name为列名称
	 * @param {Object} ao
	 */
	getTableList : function(ao) {
		var html = [], i;
		html.push("<div class=\"{0}\"><h2 style=\"font-weight:bold\">{1}</h2>".format('bwlist', ao.title));

		html.push("<table class=\"tblSetList\" cellpadding='0'><tbody><tr>");
		for( i = 0; i < ao.head.title.length; i++) {
			html.push("<th class='{0}'>{1}</th>".format(ao.head.className[i], ao.head.title[i]));
		}
		html.push("</tr>");
		if( typeof (ao.items) == 'object') {
			for( i = 0; i < ao.items.length; i++) {
				if(ao.items[i])
				{
					html.push("<tr>");
					for(var j = 0; j < ao.items[i].length; j++) {
						html.push("<td class='{0}'>{1}</td>".format(ao.head.className[j], ao.items[i][j]));
					}
					html.push("</tr>");
				}
			}
		} else {
			html.push("</tbody><tbody id=\"tbList\"><tr class=\"msgSetList\"><td colspan=\"3\">{0}</td></tr>".format(ao.items));
		}
		html.push("</tbody></table></div>");
		return html.join("");
	},
	/***
	 * 获取组装好的的HTML字符串
	 * @param {Object} ad
	 */
	getHtml : function(ad) {
		var p = this;
		var html = [];
		var title = MM[gConst.setting].menuItem[ad.id].name;
		var after = ad.tableAfter || "";
		var before = ad.tableBefore || "";
		//html.push(this.getNavMenu(ad.id));
		html.push("<div class=\"bodySet\" style='align:text;'");
		if(ad.divId) {
			html.push(" id=\"{0}\"".format(ad.divId));
		}


		var type = MM[gConst.setting].menuItem[p.attrs.id].type;
		
		html.push("><div id=\"container\">");
		html.push(this.getTopHtml());
		
		if(p.attrs.id!="mailSearch")
		{
			
			html.push(this.getLeftHtml());
		}
		
		html.push("<div class=\"setWrapper\">");

		html.push(this.getHead(title,ad.tips));
		html.push(before);
		html.push(this.getTable(ad));
		html.push(after);
		html.push(this.getBottom(ad.bottomHtml));
		html.push("</div></div></div>");
		MM[gConst.setting].update(this.attrs.id, html.join(""));
	},
	/***
	 * 组装 按钮行
	 * @param {Object} ao
	 */
	getButtons : function(ao, cid) {
		cid = cid || '';
		if(!ao) {
			ao = [{
				text : Lang.Mail.Ok,
				clickEvent : this.attrs.id + '.save'
			}, {
				text : Lang.Mail.Cancel,
				clickEvent : this.attrs.id + '.goBack'
			}];
		}
		var html = [];
		html.push('<tr><td></td><td>');
		for(var i = 0; i < ao.length; i++) {
			html.push('<a class="btn" href="javascript:fGoto();" onclick="{0}(\'{1}\');"><b class="r1"></b><span class="rContent"><span>{2}</span></span><b class="r1"></b></a>'.format(ao[i].clickEvent, cid, ao[i].text));
		}
		html.push('</td></tr>');
		return html.join("");
	},
	/***
	 * 组装行TR
	 * @param {Object} o 属性名
	 * @param {Object} ao 属性对象
	 * @param {object} id 控件ID后缀
	 */
	getTr : function(o, ao, cid) {
		var html = [];
		var attr = ao.attribute || {};
		var val = attr.value;
		var type = ao.type;
		var func = this.getFun[type]||function(){};
		var text = ao.text || "";
		var before = ao.before || "";
		var after = ao.after || "";
		var ext = (ao.ext ? " " + ao.ext : "");
		if(type == 'others') {
			o = this;
			attr = ao.values;
		}
		var value = func(o, attr, ao.items || ao.text, cid)||ao.html||"";
		if(ao.row) {
			html.push('<tr{4}><td colspan="2">{0}{1}{2}{3}</td></tr>'.format(text, before, value, after, ext));
		} else {
			html.push('<tr{4}><th>{0}</th><td>{1}{2}{3}</td></tr>'.format(text, before, value, after, ext));
		}
		return html.join("");
	},
	getTextValue : function(id) {
		var val = "";
		var o = this.getEl(id);
		if(o) {
			val = o.value || "";
			val = val.trim();
		}
		return val;
	},
	getCheckBoxValue : function(name) {
		var values = [];
		var objs = this.getElementsByName(name);
		for(var i = 0; i < objs.length; i++) {
			if(objs[i].checked == true) {
				values.push(objs[i].value);
			}
		}
		return values.join(",") || "0";
	},
	getRadioValue : function(name) {
		var objs = this.getElementsByName(name);
		for(var i = 0; i < objs.length; i++) {
			if(objs[i].checked == true) {
				return objs[i].value;
			}
		}
		return "0";
	},
	getSelectValue : function(id) {
		var o = this.getEl(id);
		if(o.options.length > 0) {
			return o.options[o.selectedIndex].value;
		} else {
			return "0";
		}
	},
	getValue : function(id, type) {
		type = type || "text";
		var val = "";
		switch(type) {
			case "text":
			case "textarea":
			case "password":
				val = this.getTextValue(id);
				break;
			case "radio":
				val = this.getRadioValue(id);
				break;
			case "select":
				val = this.getSelectValue(id);
				break;
			case "checkbox":
				val = this.getCheckBoxValue(id);
				break;
		}
		return val;
	},
	/***
	 * 取得格式化后的值
	 * @param {Object} o id
	 * @param {Object} ao 对象/节中对象
	 */
	getFormatValue : function(o, ao) {
		ao = ao || this.attrs.data[o];
		if(!ao) {
			return "";
		}
		var format = ao.format;
		var v = this.getValue(o, ao.type);
		if(v == "" || v == null || v == undefined) {
			ao.attribute = ao.attribute || {};
			v = ao.attribute.defaultValue || '';
		}
		if(format) {
			switch (ao.format) {
				case "int":
					v = v - 0;
					if(isNaN(v)) {
						v = 0;
					}
					break;
				case "time":
					v = parent.Util.parseDate(v).getTime() / 1000;
					break;
				case "text":
					v = (v + "").trim();
					break;
				default:
					v = (v + "").encodeHTML().trim();
					break;
			}
		} else {
			v = (v + "").trim();
		}
		return v;
	},
	getEl : function(id) {
		return $("option_" + id);
	},
	getElementsByName : function(name) {
		return document.getElementsByName("option_" + name);
	},
	/***
	 * 取HTML标签
	 * @param {Object} id
	 * @param {Object} attr
	 * @param {Object} 标签对象
	 */
	getFun : {
		text : function(id, attr, text, cid) {
			cid = cid || '';
			var val = attr.value || attr.defaultValue || '';
			if(val && typeof (val) == 'string')
				val = val.replace(/"/g, "&quot;");
			var cn = attr.className || "text";
			var ml = attr.maxLength || 40;
			var readonly = attr.readonly ? " readonly='readonly'" : "";
			return '<input type="text" id="option_{0}" name="option_{0}" value="{1}" maxlength="{2}" class="{3}" {4} {5}/>'.format(id + cid, val, ml, cn, attr.ext || "", readonly);
		},
		password : function(id, attr, text, cid) {
			cid = cid || '';
			var val = attr.value || attr.defaultValue || '';
			var cn = attr.className || "text";
			var ml = attr.maxLength || 20;
			return '<input type="password" id="option_{0}" name="option_{0}" value="{1}" maxlength="{2}" class="{3}"  AUTOCOMPLETE="off" {4}/>'.format(id + cid, val, ml, cn, attr.ext || "");
		},
		radio : function(id, attr, items, cid) {
			cid = cid || '';
			items = items || [];
			attr.value = '' + attr.value;
			var val = attr.value || attr.defaultValue;
			var after = attr.after || "";
			var before = attr.before || "";
			var html = [];
			for(var name in items) {
				var rid = id + name;
				html.push(before);
				html.push('<label><input type="radio" name="option_{0}" id="option_{1}" value="{2}" {3} class="{4}"/>{5}</label>'.format(id + cid, rid, name, (val == name ? ' checked="true"' : ''), attr.className || '', items[name]));
				html.push(after);
			}
			return html.join("");
		},
		checkbox : function(id, attr, items, controlId) {
			controlId = controlId || '';
			items = items || [];
			attr.value = '' + attr.value;
			var val = attr.value || attr.defaultValue;
			var after = attr.after || "";
			var before = attr.before || "";
			var html = [];
			for(var name in items) {
				var eventHtml = [];
				var events = attr.event || {};
				for(var o in events) {
					eventHtml.push(o + '=' + events[o] + '(\'' + id + name + '\') ');
				}
				var cid = id + name;
				html.push(before);
				html.push('<label><input type="checkbox" name="option_{0}" id="option_{1}" value="{2}" {3} class="{4}" {6}/>{5}</label>'.format(id + controlId, cid, name, (val == name ? ' checked="true"' : ''), attr.className || '', items[name], eventHtml.join(',')));
				html.push(after);
			}
			return html.join("");
		},
		select : function(id, attr, options, cid) {
			cid = cid || '';
			options = options || [];
			attr.value = '' + attr.value;
			var val = attr.value || attr.defaultValue;
			var html = [];
			html.push('<select name="option_{0}" id="option_{0}" class="{1}" {2}>'.format(id + cid, attr.className || "", attr.ext || ""));
			if( options instanceof Array) {
				var recursion = function(of, icon) {
					var aw = null, hassub = false, text = "", isCurEnd = false;
					var icon1 = "", icon2 = "";
					for(var i = 0, l = of.length; i < l; i++) {
						aw = of[i];
						hassub = (aw.nodes && aw.nodes.length > 0);
						isCurEnd = (i == of.length - 1);
						icon1 = icon || "";
						icon2 = (aw.parentId == 0) ? "" : ((isCurEnd) ? "└ " : "├ ");
						text = icon1 + icon2 + aw.name;
						html.push('<option value="{0}" {1}>{2}</option>'.format(aw.fid, (val == aw.fid ? ' selected="true"' : ''), text));
						if(hassub) {
							icon1 += (isCurEnd || aw.parentId == 0) ? "&nbsp;" : "│ ";
							recursion(aw.nodes, icon1);
						}
					}
				};
				recursion(options);
			} else {
				for(var n in options) {
					html.push('<option value="{0}" {1}>{2}</option>'.format(n, (val == n ? ' selected="true"' : ''), options[n]));
				}
			}
			html.push('</select>');
			return html.join("");
		},
		textarea : function(id, attr, text, cid) {
			cid = cid || '';
			var val = attr.value || attr.defaultValue || '';
			var rowsVal = attr.rows || 4;
			var colsVal = attr.cols || 80;
			return '<textarea type="text" id="option_{0}" name="option_{0}" rows="{1}" cols="{2}" class="{3}">{4}</textarea>'.format(id + cid, rowsVal, colsVal, attr.className || "", val);
		},
		label : function(id, attr, text, cid) {
			cid = cid || '';
			var val = attr.value || attr.defaultValue || '';
			return '<span id=\"option_{0}\" class=\"{1}\">{2}</span>'.format(id + cid, attr.className || '', val);
		},
		others : function(p, controls, text, cid) {
			var html = [];
			for(var o in controls) {
				var ao = controls[o];
				var func = p.getFun[ao.type];
				var attr = ao.attribute || {};

				var str = func(o, attr, ao.items || ao.text, cid);
				html.push(str);
			}
			return html.join("");
		}
	},

	/***
	 * 返回格式 data{preference_letters:20,preference_reply:1,...}
	 *
	 * 获取需要保存的数据
	 * @param {Object} ad
	 * @param {Object} chkFun
	 */
	getSaveData : function(ad, chkFun) {
		var p = this, isOk = true;
		if( typeof (chkFun) == 'function') {
			isOk = chkFun.call(p);
		}
		if(isOk) {
			var data = {};
			for(var o in ad) {
				var ao = ad[o];
				if(!ao.noset && ao.type != "label") {
					data[o] = p.getFormatValue(o, ao);
				}
			}
			return data;
		}
	},
	/***
	 * 显示错误信息
	 * @param {Object} html
	 */
	displayErr : function(html) {
		if(html) {
			$('td_err').innerHtml = html;
			$('tr_err').display = "block";
		} else {
			$('tr_err').display = "none";
		}
	},
	/***
	 * 返回
	 */
	goBack : function() {
		CC.setConfig('');
	},
	ok : function(s) {
		var p = this;
		CC.showMsg(s,true,false,"option");
		//CC.alert(s, function() {
		//	p.goBack();
		//});
	},
	fail : function(s, ao) {
		if( typeof (ao) == "object" && IsDebug) {
			s += "<br>" + Lang.Mail.ConfigJs.failed_code + (ao.errorCode || "") + "," + Lang.Mail.ConfigJs.err_message + (ao.summary || "");
		}
		CC.alert(s);
	},
	/***
	 * 保存
	 */
	save : function(data) {
		var p = this;
		var isOk = true;
		var beforeSave = p["saveBefore"];
		if( typeof (beforeSave) == "function") {
			isOk = p["saveBefore"]();
		}
		isOk = isOk && p.check();
		if(isOk) {
			data = data || p.getSaveData(p.attrs.data);
			p.ajaxRequest(this.attrs.save.func, data, function(ao) {
				try {
					var after = p["saveAfter"];
					if( typeof (after) == "function") {
						after.call(p, ao);
					} else {
						p.ok(Lang.Mail.Write.saveSucc);
					}
				} catch (e) {
					p.fail(Lang.Mail.ConfigJs.filter_saveFail, ao);
				}
			}, function(ao) {
				p.fail(Lang.Mail.ConfigJs.filter_saveFail, ao);
			}, p.attrs.url || "", p.attrs.ajaxType);
		}
	},
	/***
	 * 检查this.attrs.data对应表单所有值是否正确
	 * @param {Object} attrsdata
	 * @param {Object} chkFun
	 */
	check : function(attrsdata, chkFun) {
		var p = this;
		var ad = p.attrs.data || attrsdata || {};
		var isOk = true;
		var data = {};
		for(var o in ad) {
			var ao = ad[o];
			isOk = p.checkItem(o, chkFun);
			if(!isOk) {
				return isOk;
			}
		}
		return true;
	},
	/***
	 * 检查指定项值（不合符条件的弹出提示）
	 * @param {Object} o
	 * @param {Object} chkFun
	 */
	checkItem : function(o, chkFun) {
		var p = this;
		var ao = p.attrs.data[o];
		if(ao.check && typeof (ao.check) == "object") {
			var check = ao.check;
			var type = check.type;
			var text = ao.text || "";
			text = text.replace(/[：:]\s*$/i, "");
			var tips = check.tips || (type == "empty" ? text + Lang.Mail.ConfigJs.option_noEmpty : Lang.Mail.ConfigJs.option_inputReal + text);
			isOk = Vd.checkData(check.type, p.getValue(o, ao.type), check.reg);
			if(!isOk) {
				CC.alert(tips, function() {
					try {
						p.getEl(o).focus();
					} catch (e) {

					}
				});
				if( typeof (chkFun) == 'function') {
					chkFun.call(p, isOk);
				}
				return false;
			}
		}
		return true;
	},
	/***
	 * 自定义检查指定项的值是否符合
	 * @param {Object} ao 需要检查的项组合
	 * @return {Object} 返回校验结果
	 * 参数格式示例：items = [{id:'',type:'',reg:'',text:'',tips:''},...]
	 * id 控件ID
	 * type 控件类型 number/int,email,mobile,phone,empty,domain,reg,custom（默认:empty）
	 * reg 正则匹配（type=reg或custom时设置此项）
	 * text 需校验的控件名称（tips为空时可设置此项）
	 * tips 提示语 校验失败的提示语(若设置此项，请忽略掉text)
	 */
	checkItems : function(items) {
		var p = this;
		for(var i = 0; i < items.length; i++) {
			var ao = items[i];
			var val = p.getFormatValue(ao.id, {
				type : 'text'
			});
			//控件值
			var text = ao.text;
			//控件名称
			var type = ao.type;
			//(ao.type == 'undefined' ? 'empty' :( ao.type == 'int' ? ao.type : 'reg'));//校验类型
			if(!type) {
				type = 'empty';
			}
			var isOk = Vd.checkData(type, val, ao.reg || '');
			if(!isOk) {
				var tips = ao.tips || (type == "empty" ? text + Lang.Mail.ConfigJs.option_noEmpty : Lang.Mail.ConfigJs.option_inputReal + text);
				//校验失败的提示语
				CC.alert(tips, function() {
					p.getEl(ao.id).focus();
				});
				return false;
			}
		}
		return true;
	},
	getFolders : function(n) {
		return CC.getFolders(n);
	},
	getTopHtml:function(){
        return MM[gConst.setting].getTopHtml(this.attrs.id);
	},
	getLeftHtml:function(){
		var attrs = this.attrs;
		var type = MM[gConst.setting].menuItem[attrs.id].type;
		var html=[];
		html.push('<div class="left_setWrapper" id="leftWrap">')
		html.push('<ul>');		
		var leftmenu = "";
		var p=this;
		Util.each(MM[gConst.setting].menuItem, function(i, o) {			
			if(o.type == type && o.name!=Lang.Mail.tab_Setting) {
				if(CC.checkConfig(i)){
					if(p.attrs.id!=i)
					{
						leftmenu += "<li><a onclick=\"CC.setConfig('"+i+"');return false;\" href=\"javascript:fGoto();\">" + o.name + "</a></li>";
					}else{
						leftmenu += "<li><a onclick=\"CC.setConfig('"+i+"');return false;\" href=\"javascript:fGoto();\" class=\"ahover\">" + o.name + "</a></li>";
					}
				}
			}
		});		
		html.push(leftmenu)
		html.push('</ul>');
		html.push('</div>');
		
		return html.join("");
	},
	getEmailName: function(mail){
		mail = mail.toString();
		var At = mail.lastIndexOf('@');
		if (mail && At > 0) {
			return mail.substring(0, At);
		}else{
			return mail;
		}
	},
	
  ifIE6 : function(){
	var browser = navigator.appName
    
    var b_version = navigator.appVersion
    
    var version = b_version.split(";");
    if(version[1]){
		 var trim_Version = version[1].replace(/[ ]/g, "");
    
	    if (browser == "Microsoft Internet Explorer" && trim_Version == "MSIE6.0") {
	    
	        return true;
	        
	    }
	    else {
	        return false;
	    }
	}else{
		return false;
	}
 },
	/**
	 * 根据左边侧边栏的高来调整高度
	 * @param {Object} id 自适应高度窗口的id
	 */
	updatePosition : function(id,num){
		var p = this;
		var h = jQuery("#leftContainer").css("height");		
	    if(num != 79){
			num = 46;
		} else
		{
			num = 83;
		}
		
		if(p.ifIE6()){
			h = parseInt(h) -9;
		}
		jQuery("#leftWrap").css("height",parseInt(h)-54);
		//jQuery("#"+id).css({"height":parseInt(h)-num,"overflow-y":"auto","overflow-x":"hidden"});//,"position":"relative"
		jQuery("#"+id).css({"height":parseInt(h)-num,"overflow-y":"auto","overflow-x":"hidden","position":"relative"});
		jQuery(window).resize(function(){
			
			var h = jQuery("#leftContainer").css("height");
	        
			if(p.ifIE6()){
				h = parseInt(h) -9;
			}
			jQuery("#leftWrap").css("height",parseInt(h)-54);
			jQuery("#"+id).css("height",parseInt(h)-num);
			
		});
		
	},
	/**
	 * 根据IE6调整窗口的宽度
	 * @param {Object} id
	 */
	correctWidthInIE6 : function(id,vs){
			var IWidth = window.document.documentElement.clientWidth || window.document.body.clientWidth;
			var left_width = 364;
		    var a_width = IWidth - left_width;
		    var a_width = jQuery("#main_Setting").width() - jQuery("#leftWrap").outerWidth();
			var min_width = 638;

			
			if (jQuery.browser.msie && jQuery.browser.version == "6.0") {
				a_width = a_width - 4;
				if(a_width < min_width){
					a_width = min_width;
					jQuery("#"+id).css("width", a_width);
				}
			}else if(vs){
				if(a_width < min_width){
					a_width = min_width;
					jQuery("#"+id).css("width", a_width);
				}
			}
			
			jQuery(window).resize(function(){
				var IWidth = window.document.documentElement.clientWidth || window.document.body.clientWidth;
		   	    var a_width = IWidth - left_width;
				if (jQuery.browser.msie && jQuery.browser.version == "6.0") {
					a_width = a_width - 4;
				}
				if(a_width < min_width){
					a_width = min_width;
					jQuery("#"+id).css("width", a_width);
				}
			});
	},
	/**
	 * 得到一个错误提示的小div,显示要用display:inline
	 * @param {Object} tipId div的id
	 * @param {Object} textId 提示内容会发生改变时，可以根据这个id给提示框赋值
	 * @param {Object} text 具体的提示内容
	 */
	getFalseTip : function(tipId,textId,text){
		var html = [];
		html.push("<div id='"+tipId+"' class=\"tips write-tips\"  ");
		html.push("style=\"display:none;margin-top:-2px; margin-left:8px; padding-top: 3px;padding-bottom:3px; z-index:7;\">");
		html.push("<div class=\"tips-text\" id='"+textId+"'>"+text);       
		html.push("</div>");
		html.push("<div class=\"tipsLeft diamond\"></div>");
		html.push("</div>");
		
		return html.join("");
	},
	$: function(id){
		return document.getElementById(id);
	},
	chk: {
		email: function( email ){
			return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(email);
		}
	}
};
