var sign = new OptionBase();
sign.attrs = {
	id: 'sign',
    authority: 'MAIL_CONFIG_MAILSIGN',
    divId: 'pageSetSignature',
    list: {
        func: gConst.func.getSign,
        type: 'url',
        data: {},
		count:0
    },
    save: {
        func: gConst.func.setSign,
        type: 'xml',
        opType: {
            add: 1,
            del: 2,
            update: 3
        }
    },
	data: {},
	bSend:true,
	values: ""
};
sign.list = {};
sign.init = function(){
    this.request(this.attrs, this.getHtml);
};

/**
 * 保存签名前检查标题是否重复
 */
sign.checkTitle = function(title,id){
	var values = p.attrs.values;
	var len = values.length;
	var i = 0;
	for(i=0; i<len; i++){
		//但修改后的值和其他签名标题相同时提示
		if(values[i].id != id){
			//要对后台传过来的数据decodeHTML,因为特殊字符后台传过来的格式是:&amp开头
			if(title == values[i].title.decodeHTML()){
			jQuery("#editWrip"+id).css('display','inline');
			jQuery("#emTip"+id).html(Lang.Mail.ConfigJs.signTitleExitsts);
			jQuery("#title"+id).focus();
			p.attrs.bSend = false;
			}
		}
		
	}
};
/**
 * 保存签名前检查内容长度是都超过4000字符
 */

sign.checkContent = function(content){
	//去掉html标签，得到编辑框文字的数量
	//content = decodeURI(content);
	//len方法返回字节数，中文占两个
	if(content.len()>4000){
		CC.alert(Lang.Mail.ConfigJs.signCharacters);
		p.attrs.bSend = false;
	}
};

/**
 * 保存或者修改 签名
 * @param {Object} id 当前签名的id 1、2、3 ....
 */
sign.save = function(id){
	//还原初始提示内容“标题不能为空”
	jQuery("#emTip"+id).html(Lang.Mail.ConfigJs.titleRequired);
	jQuery("#editWrip"+id).css('display','none');
	p = sign;
	p.attrs.bSend = true;
	var data = "";
	var oSign = {}; //  给gMain.signList数组增加的元素
	var content = sign['edit_'+id].getContent();
    //提示标题不能为空
	if(jQuery("#title"+id).val().trim()==''){
		jQuery("#editWrip"+id).css('display','inline');
		return
	}
	
	p.checkTitle(jQuery("#title"+id).val().trim(),id);
	p.checkContent(sign['edit_'+id].getContentTxt());
	
	if(p.attrs.bSend == false){
		return;
	}
    
	
	//修改上传数据有id 和新增数据不同
    if(id == 0){
		if(p.attrs.list.count >=5){
			CC.showMsg(Lang.Mail.ConfigJs.signatureLimit,true,false,"error");
			return false;
		}
		data = {
			opType : 1,
			title : jQuery("#title0").val().trim(),
			//content : jQuery("#content0").val().encodeHTML(),
			content : content,
			isDefault : jQuery("#default0").is(":checked")? 1 : 0,
		    isAutoDate : jQuery("#autoDate0").is(":checked")? 1 : 0,
		    isHtml: 1		
			}
	}else{
		data = {
			opType : 3,
			title : jQuery("#title"+id).val().trim(),
			//content : jQuery("#content"+id).val().encodeHTML(),
			content : content,
			isDefault : jQuery("#default"+id).is(":checked")? 1 : 0,
		    isAutoDate : jQuery("#autoDate"+id).is(":checked")? 1 : 0,
			id : id,
			isHtml: 1	
		}	
	}

    oSign = {
		"content" : data.content,
		"id" : id,
		"isAutoDate" : data.isAutoDate,
		"isDefault" : data.isDefault,
		"isHtml" : 0,
		"isSMTP" : 0,
		"title" : data.title,
		"type" : 0
	};
	
    p.ajaxRequest("user:signatures", data, function() {
		//如果新增 则总数加一
		if(id == 0){
			p.attrs.list.count++;
			
		}
		 CC.showMsg(Lang.Mail.ConfigJs.signSuc,true,false,"option");
         p.init(p.attrs.id);
	//p.getHtml();
	}, function() {
     p.fail(Lang.Mail.ConfigJs.setParaFail)

	},"/RmWeb/mail?func=user:signatures&sid="+gMain.sid);	
	
};

sign.setSignList = function(values){
	var len = signList.length;
	var len1 = values.length;
	var data = {};
	var i = 0;
	//先清空
	signList.splice(0,len);

	for (var i = 0; i < len1; i++) {	   
	    
	    data = {
		"content" : values[i].content,
		"id" : values[i].id,
		"isAutoDate" : values[i].isAutoDate,
		"isDefault" : values[i].isDefault,
		"isHtml" : 0,
		"isSMTP" : 0,
		"title" : values[i].title,
		"type" : 0
	   };
	   signList.push(data);
	  
	}
}


/***
 *编辑
 * @param {string} id 标题id
 */
sign.edit = function(id,title,content,isDefault,isAutoDate,n){

return sign.getEditHtml(id,title,content,isDefault,isAutoDate,n);

};
/***
 *设为默认签名
 */
sign.setDefaultSign = function(id,title,content,isDefault,isAutoDate){
	
	 p = sign;
	 var bDefault = (jQuery("#defaultBtn"+id).text() == Lang.Mail.ConfigJs.sign_btn_fault) ? 1 : 0;
	 //先全部初始化显示为： 设为默认
     var aDefaultBtn = document.getElementsByName("defaultBtn");
	 var len = aDefaultBtn.length;
	 for (var i=0; i<len; i++){
	 	aDefaultBtn[i].innerHTML = Lang.Mail.ConfigJs.sign_btn_fault;
	 }
	 jQuery(":checkbox[name=defaultCheckbox]").attr("checked",false);
	
	 //如果当前显示为：设为默认  则改为 ： 取消默认	
	 if(bDefault){
	 	jQuery("#defaultBtn"+id).html(Lang.Mail.ConfigJs.sign_btn_not_fault);
		isDefault = 1;
		jQuery("#default"+id).attr("checked",true);
	 } else{
	 	isDefault = 0;
	 }
 	
	  var oDate={
	  	opType : 3,
	  	id : id,
		title : decodeURI(title).decodeHTML(),
		content : decodeURI(content).decodeHTML(),
		isDefault : isDefault,
		isAutoDate : isAutoDate
	  }
	 
	  p.ajaxRequest(p.attrs.save.func, oDate, function(){
	  	top.CC.showMsg(Lang.Mail.ConfigJs.signSuc,true,false,"option");
	  	/*
if(bDefault){
			top.CC.showMsg(Lang.Mail.ConfigJs.setDefaultTip,true,false,"option");
			//parent.CC.alert(Lang.Mail.ConfigJs.setDefaultTip);
		}else{
			top.CC.showMsg(Lang.Mail.ConfigJs.cancelDefaultTip,true,false,"option");
			//parent.CC.alert(Lang.Mail.ConfigJs.cancelDefaultTip);
		}
*/
 	    sign.setSignListDefault(id,isDefault); //在gMain.signList 使默认签名的设置及时生效
        });
};

/**
 * 在gMain.signList 设置默认签名
 * @param {Object} values
 */
sign.setSignListDefault = function(id,isDefault){
	var len =  signList.length;
	var i = 0;
	for (i=0; i<len; i++){
		
		if( signList[i].id == id){	
		     signList[i].isDefault = isDefault;
		}else{
			signList[i].isDefault = 0;
		}
	}
};

sign.moveto = function(num){
			jQuery('#setWrapp').scrollTop(num);
			}
			
sign.getSignList = function(values){
   var p=sign;
   var html = [];
   var n = 2;
	var len=values.length;
	len = len>5 ? 5 : len;
	for (var i=0; i<len; i++){
	   var id = values[i].id;
	   var title = values[i].title.encodeHTML();
	   var content = values[i].content;
	   var isDefault = values[i].isDefault;
	   var isAutoDate = values[i].isAutoDate;
	   var defaultLang=Lang.Mail.ConfigJs.sign_btn_fault;
	   if(isDefault == 1){
	   	  defaultLang = Lang.Mail.ConfigJs.sign_btn_not_fault;
	   }
	   sign.list[id]= values[i];
	  n = n+2; //编辑框的tabindex依次增加，分别为2、4、5、8、10
	  html += sign.edit(id,title,content,isDefault,isAutoDate,n);
	
	}
	
     return html;
      
}
/***
 * 得到编辑框 给不同的id 防止不同的编辑框的id重复
 * @param {string} titleId 给标题输入框一个预设的id
 * @param {string} contentId 给内容输入框一个预设的id
 * @param {string} defaultId 给默认框一个预设的id
 * @param {string} autoDateId 给自动加入日期框一个预设的id
 * @param {string} autoDateId 给保存按钮一个预设的id
 * @param {string} autoDateId 给取消按钮一个预设的id
 */	
sign.getEditHtml = function(id,title,content,isDefault,isAutoDate,n){		
	    var html=[];
		var showHtml = "";
		//给编辑栏加相对定位，保证里面的iframe 不会错位
		html.push("<div style='position:relative;' class='set-edit-wrap'>");
		//id 为 0 是 新建签名，显示标题，否则根据返回数据动态显示标题，并且要加上三角形图标 		
		if(id == 0){
		   //开始加载table	
		   html.push("<table width=\"100%\" class=\"set-edit-table\" id='"+id+"'><tbody><tr>"); 
		
		   showHtml = "<td class='titlePadding singtitleWidth' style='padding-top:5px'>";
		   showHtml += "<label>"+Lang.Mail.ConfigJs.title +"</label></td>";
		}else{
		   //修改签名table  不需要样式 "set-edit-table	 
		   html.push("<table width=\"100%\" id='"+id+"'><tbody><tr>");
		   	
		   showHtml = "<td class='title_hide_w' style='height:31px; padding-bottom:0'>";
		   showHtml += "<a class=\"setSign-box-til\" href=\"javascript:void(0);\"  onclick='sign.showEdit(this); return false;'>";
		   showHtml += "<i class=\"i-sli\" ></i></a>";
		   showHtml += "<em id='emText"+id+"'><font style='font-weight:bold'>"+title+"</font></em></td>";
		}
		
		html.push(showHtml);
        html.push(" <td  style='height:31px; padding-bottom:0' class='titleOper'>");
		html.push("<input type=\"text\" value=\""+title+"\" maxLength='15' name='titleText' ");
		//hideText 样式隐藏input，加载完成在显示出新建签名的标题输入框
		html.push("class=\"rm_txt w284 hideText\" id='title"+id+"'>");
		//错误提示框
		html.push(sign.getFalseTip("editWrip"+id,"emTip"+id,Lang.Mail.ConfigJs.titleRequired));
		html.push("</td>");
		//是否隐藏  编辑内容和保存  这两行的样式
		var bDisplay = "";
		//初始是 “设为默认”
		var defaultHtml = Lang.Mail.ConfigJs.sign_btn_fault;
		
		//如果返回的数据 isDefault 为 1 ，说明这个签名已经是默认的，则显示为 “取消默认”
		if(isDefault){
			defaultHtml = Lang.Mail.ConfigJs.sign_btn_not_fault ;
		}
	
		//如果 id 不为 0 ,则这个签名不是新建，而是修改签名框，需要加上 修改、设为默认、删除等标签
		if (id != 0) {
			html.push("<td id='signOp"+id+"' class='signOp ta_r' >");
			
			html.push("<a href=\"javascript:void(0);\" name='defaultBtn' id='defaultBtn" + id + "' ");
			html.push("onclick=\"sign.setDefaultSign(" + id + ",'" + encodeURI(title).encodeHTML() + "','" + encodeURI(content).encodeHTML()+ "'," + isDefault + "," + isAutoDate + ")\">"+defaultHtml+"</a>");
			html.push("<a href=\"javascript:void(0);\" onclick='sign.showEdit(this)'>"+Lang.Mail.ConfigJs.modify +"</a>");
			html.push("<a  href=\"javascript:void(0);\" onclick='sign.delSign("+id+")'>"+Lang.Mail.ConfigJs.deleteO +"</a></td>");
			
			bDisplay = "style ='display:none'";//修改签名隐藏标题输入框
		
		}else{
			html.push("<td ></td>");
			bDisplay = "style = ''"//新建签名的标题输入框始终显示
		}
		html.push("</tr>");//表格第一行（标题栏）结束
		
    	html.push("<tr "+bDisplay+">");
		html.push("<td valign=\"top\" class='titlePadding'>"+Lang.Mail.ConfigJs.content +"</td>");
		html.push("<td colspan=\"2\">");
		//编辑框开始
		html.push("<div id=\"edit_"+id+"\" >");
		
		//获取编辑框控件实例		
	//	var rtb = new parent.RichTextBox({
		//	id: id
		//	});
        //给编辑框设置tabindex属性，方便用户Tab键切换
		//rtb.setIfrmTabIndex(n);
		//编辑框加载到页面
		//html.push(rtb.getHtml());		
		html.push("</div>");
		//编辑框结束
		html.push("</td></tr>");//表格第二行（内容栏）结束
		
		html.push("<tr "+bDisplay+" class='signContent'>");
		html.push("<td>&nbsp;</td>");
		html.push("<td>");
		//保存按钮
		html.push("<a class=\"n_btn_on font-bold mr_10\" onclick=sign.save('"+id+"') id='save"+id+"'><span>");
		html.push("<span>"+Lang.Mail.ConfigJs.save+"</span></span></a>");
		//取消按钮
		html.push("<a class=\"n_btn font-bold mr_10\" id='cancel' ");
		html.push(" onclick=\"sign.goBack('');\" ><span>");
		html.push("<span>"+Lang.Mail.ConfigJs.cancelTip +"</span></span></a>");
		//是否默认签名 复选框
		html.push("<input type=\"checkbox\" "+(isDefault==1?"checked":"")+" class=\"rm_cb\" id=\"default"+id+"\" ");
		html.push("name='defaultCheckbox' \>");
		html.push("<label class=\"mr_10\"");
		html.push("for=\"default"+id+"\">"+Lang.Mail.ConfigJs.sign_isdefault+"</label>");
		//是否自动加入日期 复选框
		html.push("<input type=\"checkbox\" class=\"rm_cb\"  "+(isAutoDate==1?"checked":"")+"  id=\"autoDate"+id+"\" \>");
		html.push("<label for=\"autoDate"+id+"\">"+Lang.Mail.ConfigJs.automaticJoin+"</label>");
		html.push("</td>");
		//<span class=\"col999\">"+Lang.Mail.ConfigJs.fec+"</span>
		html.push("<td class=\"ta_r\">&nbsp;</td>");
		html.push("</tr>");//表格第三行（保存取消栏）结束
		html.push("</tbody></table>");//表格结束
		html.push("</div><!--set-edit-wrap-->");
		return html.join("");
};	
sign.getHtml = function(attrs,values) {
    var p = sign;
	
	//先在页面加载 服务器返回的几个 签名 编辑框 ，并实现设置默认的功能
	var listHTML = sign.getSignList(values);
	p.attrs.values = values;
	sign.setSignList(values);
    var getAddHtml = function() {
        var html = [];
	    html.push("<div class=\"set_rule_box\" id='sign_list' style='position:relative'>");
		html.push("<h2 class=\"set_til\">"+Lang.Mail.ConfigJs.pref_signature+"<span>");
		html.push("("+Lang.Mail.ConfigJs.bottomTip+")</span></h2>");
		html.push("<h3 id='otherSet'>"+Lang.Mail.ConfigJs.otherSet+"<var id='num'> ");
		html.push("</var>"+Lang.Mail.ConfigJs.signtures+"</h3>");
		html.push("<div style=\"position:relative;\">")
	    html.push(sign.getEditHtml(0,"","",0,0,2));
  
	   return html.join("");
    };

    var html = [];
    var addDiv = getAddHtml();
    html.push("<div class=\"bodySet bodyBwList\"> ");
    html.push("<div id=\"container\">");
    html.push(this.getTopHtml());
    html.push(this.getLeftHtml());
    html.push("<div class=\"setWrapper\"  id=\"setWrapp\">");
    html.push(addDiv);
	html.push(listHTML);
    html.push("</div></div></div></div></div>");
    MM[gConst.setting].update(p.attrs.id, html.join(""));
	pref.updatePosition("setWrapp");
	p.correctWidthInIE6("prefWrapper",1);
	jQuery("#title0").removeClass("hideText").focus();
    
	
	var k = 0;
	var len = values.length;
	
	if(len > 0){
		k = values[len-1].id;
	}
	sign["edit_0"] = UE.getEditor('edit_0', {
			toolbars: [["bold", "fontfamily", "fontsize", "forecolor", "backcolor", "italic", "underline", "justifyleft", "justifycenter", "justifyright"]],
			zIndex: 2009,
			autoupload: false,
			autoClearinitialContent: true, //focus时自动清空初始化时的内容
			wordCount: false, //关闭字数统计
			elementPathEnabled: false,//关闭elementPath
			"initialFrameWidth":"100%",
			"autoHeightEnabled":false,
			"initialFrameHeight":"160",
			"sourceEditor":"textarea",
			 isReload:true
	});
	sign["edit_0"].ready(function(){
		if (jQuery("#edit_0").html().length == 0) {
			sign["edit_0"].render("edit_0");
		}
		jQuery("#num").html(5 - (len>5?5:len));
	})
	sign.attrs.list.count=len;
	
 /*
   if(jQuery.browser.msie && jQuery.browser.version == "6.0"){
		jQuery(".set-edit-wrap").css("width","97.7%");

	}
	

	var oFrame = document.getElementById("htmlEditor"+k)

    
	if(oFrame){
		if(oFrame.attachEvent){
			oFrame.attachEvent("onload",function(){
				RTB_items.init();
				sign.setValues(values);
				var num = 5 - p.attrs.list.count;
				num = num==0? "0" : num;
				jQuery("#num").html(num);
			})
		}else{
			oFrame.onload = function(){
				RTB_items.init();
				sign.setValues(values);
				var num = 5 - p.attrs.list.count;
				num = num==0? "0" : num;
				jQuery("#num").html(num);
				
			};
		} 
	}
	
*/
	
	
	
	
		
		//jQuery("#sign_list").append(listHTML);
		/*
setTimeout(function(){
			RTB_items.init();
			sign.setValues(values);
			var num = 5 - p.attrs.list.count;
			num = num==0? "0" : num;
			jQuery("#num").html(num);
		},500);
		 
*/
};
sign.getRequest = function(idx){
	var p = this;
	var getVal  = function(o){
		var val = p.getValue(o.id+idx, o.type);
		if (o.type == 'checkbox') {
			if (val == '1')//当前选中项
				val = 1;//选中
			else
				val = 0;
		}
		return val;
	};

    var ao = {
        opType: '',
        title: getVal({id:'title',type:'text',format:''}),
        content: getVal({id:'content',type:'textarea',format:'html'}),
        //isHtml: getVal({id:'isHtml',type:'checkbox',format:'int'}),
        isDefault: getVal({id:'isDefault',type:'checkbox',format:'int'}),
        isAutoDate: getVal({id:'isAutoDate',type:'checkbox',format:'int'})
        //isSMTP: getVal({id:'isSMTP',type:'checkbox',format:'int'}),
        //type: getVal({id:'type',type:'select',format:'int'})
    };
	return ao;
};

/***
 * 删除签名
 * @param {Object} idx
 */
sign.delSign = function(idx){
	var p = this;
	var callback = function(){
        var ao = p.getRequest(idx);
		ao.id = idx-0;
		ao.opType = p.attrs.save.opType.del;
        p.ajaxRequest(p.attrs.save.func, ao, function(){
			CC.showMsg(Lang.Mail.ConfigJs.sign_info_del_success,true,false,"option");
            sign.init("",true);
        });
	};
	var cancelCallbak = function(){};
	CC.confirm(Lang.Mail.ConfigJs.DeleteSign, callback, Lang.Mail.ConfigJs.mailpop_sysPrompt);
};

/**
 * 根据返回的数值 给 编辑框 赋值 title content， 预选好默认 和 自动 复选框
 */
sign.setValues = function(values){
	var len = values.length;
	
	jQuery("#default0").attr("checked",true);
	sign.attrs.list.count = len;
	
	//循环每一组数据 根据id关联 来赋值
	for(var i=0; i<len; i++){		
	    var id = values[i].id;
	    var title = values[i].title;
	    var content = values[i].content;
	    var isDefault = values[i].isDefault;
	    var isAutoDate = values[i].isAutoDate;
		//给标题输入框赋值
		jQuery("#title"+id).val(title.decodeHTML());
		//给标题label赋值
		jQuery("#emText"+id).html("<font style='font-weight:bold'>"+jQuery("#title"+id).val().encodeHTML()+"</font>");
		content = content.decodeHTML();

		RTB_items[id].setEditorValue(content);
		
		RTB_items[id].active();
		if(isDefault){
			jQuery("#default"+id).attr("checked",true);
		}else{
			jQuery("#default"+id).attr("checked",false);
		}
		if(isAutoDate){
			jQuery("#autoDate"+id).attr("checked",true);
		}else{
			jQuery("#autoDate"+id).attr("checked",false);
		}
		jQuery("cancel").click(function(){
			sign.goBack("");
		});
		
        //根据不同的id来修改， id和保存按钮的id 关联
        var saveN = document.getElementById("save"+id);
	
		(function(a){
			saveN.onclick = function(){
				sign.save(a);
				return false
			};
		})(id);
		
	    
		
		//页面刚加载完成先隐藏输入框
		jQuery("#title"+id).css('display','none');
	}
	var n = 1;
	var m = 2;
	//给Input iframe 添加 tabindex属性
	jQuery("input[name='titleText']").each(function(){
		jQuery(this).attr("tabindex",n);
		n = n + 2;
	});
		
	/*
jQuery("[name^='htmlEditor'").each(function(){
		jQuery(this).attr("tabindex",m)
		m = m + 2;
	});
*/
	
	//每次刷新后改变gMain的signList值，使得签名设置及时生效
	sign.setSignList(values);
};	

sign.switchFoc = function(id){

    
	
//jQuery(document.getElementById('htmlEditor0').contentWindow.document).focus();
	if(window.event.keyCode == 9){
        document.getElementById("htmlEditor"+id).focus();
    }

};

sign.showEdit = function(p){
	
	p = jQuery(p);
    var oTabel = p.closest("table");
	var signId = oTabel.attr("id")
	var signObj = sign.list[signId];
	var val = signObj.title.encodeHTML(); //标题 内容
	
	if (jQuery("#edit_" + signId).html().length == 0) {
		sign['edit_'+signId] = UE.getEditor('edit_'+signId, {
			toolbars:[["bold","fontfamily","fontsize","forecolor","backcolor","italic","underline","justifyleft","justifycenter","justifyright"]],
			zIndex: 2009,
			autoupload: false,
	    autoClearinitialContent: true, //focus时自动清空初始化时的内容
			wordCount: false, //关闭字数统计
			elementPathEnabled: false,//关闭elementPath
			"initialFrameWidth":"100%",
			"autoHeightEnabled":false,
			"initialFrameHeight":"160",
			"sourceEditor":"textarea",
			 isReload:true
	    });
		sign['edit_'+signId].ready(function(){
			load();
		})
	}else{
		load();
	}
	
	function load(){
		if (p.text() == Lang.Mail.ConfigJs.modify) {//"修改"
		oTabel.find("tbody tr").slice(1).show();
	    jQuery(p).html(Lang.Mail.ConfigJs.fold);
		oTabel.find("input").show();
		oTabel.find("em").html(Lang.Mail.ConfigJs.title);
		oTabel.find("i").removeClass().addClass("i-sli-show");
		oTabel.find("td").eq(0).removeClass().addClass("title_show_w");
		oTabel.addClass("set-edit-table");
		sign['edit_'+signId].setContent(signObj.content.decodeHTML());
	}else if(p.text() == Lang.Mail.ConfigJs.fold){//"收起"
		oTabel.find("tbody tr").slice(1).hide();
	    jQuery(p).html(Lang.Mail.ConfigJs.modify);
		oTabel.find("em").html("<font style='font-weight:bold'>"+val+"</font>");
		oTabel.find("input").hide();
		oTabel.find("i").removeClass().addClass("i-sli");
		oTabel.find("td").eq(0).removeClass().addClass("title_hide_w");
		oTabel.removeClass("set-edit-table");
		
	}else if(p.find("i").attr("class") == 'i-sli'){//展开
	    //sign.moveto(1500);
		sign['edit_'+signId].setContent(signObj.content.decodeHTML());
		oTabel.find("tbody tr").slice(1).show();
		//oTabel.find("tr").eq(1).show().end().eq(2).show();
		p.children().eq(0).removeClass();
		p.children().eq(0).addClass("i-sli-show")
		oTabel.find("input").show();
		oTabel.find("em").html(Lang.Mail.ConfigJs.title);
		oTabel.find("a").eq(2).html(Lang.Mail.ConfigJs.fold);
		oTabel.find("td").eq(0).removeClass().addClass("title_show_w");
		oTabel.addClass("set-edit-table");
		
		
	}else{//隐藏
		oTabel.find("tbody tr").slice(1).hide();
		p.children().eq(0).removeClass();
		p.children().eq(0).addClass("i-sli")
		oTabel.find("em").html("<font style='font-weight:bold'>"+val+"</font>");
		oTabel.find("input").hide();
		oTabel.find("a").eq(2).html(Lang.Mail.ConfigJs.modify);
		oTabel.find("td").eq(0).removeClass().addClass("title_hide_w");
		oTabel.removeClass("set-edit-table");
	
	}
	}


	
}


