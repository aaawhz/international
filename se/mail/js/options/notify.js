var notify = new OptionBase();
var contact =null;
notify.attrs = {
	id: 'notify',
	authority: 'MAIL_CONFIG_NOTIFY',
    divId: 'pageNotify',
    list: {func: "mail:getNotify"},             //获取数据/列表时指令，数据 
    save:{func:"mail:setNotify"},           //更新数据时func指令,及数据
    tips: Lang.Mail.Config.notify_msg1,	
    data: {
        notifyType: {
            text: Lang.Mail.Config.note_mode,
            type: 'radio',
            className: '',
            attribute: {
                value: '',
                defaultValue:'1'
            },
            items: {
            	'0': Lang.Mail.Config.disable,
                '1': Lang.Mail.Config.common_smsmode,
                '2': Lang.Mail.Config.mms_mode,
                '3': Lang.Mail.ConfigJs.wapPush,//'5': Lang.Mail.Config.dismaind_smsmode,
                '4': Lang.Mail.ConfigJs.reply_lbl_yes//Lang.Mail.Config.long_smsmode         
            },
            format: 'int'
        },	
        beginTime: {
            text: Lang.Mail.Config.beginTime +"：",
			type: 'select',
			attribute: {
				value: '',
				defaultValue: '8'
			},
			items: { 
			'0': '0', 
			'1': '01',
			'2': '02',
			'3': '03',
			'4': '04',
			'5': '05',
			'6': '06',
			'7': '07',
			'8': '08',
			'9': '09',
			'10': '10',
			'11': '11',
			'12': '12',
			'13': '13',
			'14': '14',
			'15': '15',
			'16': '16',
			'17': '17',
			'18': '18',
			'19': '19',
			'20': '20',
			'21': '21',
			'22': '22',
			'23': '23' },
			format: 'int'
		},
		endTime: {
            text: Lang.Mail.Config.endTime + "：",
			type: 'select',
			attribute: {
				value: '',
				defaultValue: '22'
			},
			items: { 
			'1': '01',
			'2': '02',
			'3': '03',
			'4': '04',
			'5': '05',
			'6': '06',
			'7': '07',
			'8': '08',
			'9': '09',
			'10': '10',
			'11': '11',
			'12': '12',
			'13': '13',
			'14': '14',
			'15': '15',
			'16': '16',
			'17': '17',
			'18': '18',
			'19': '19',
			'20': '20',
			'21': '21',
			'22': '22',
			'23': '23',
			'24': '24' },
			format: 'int'
		}
		
    }
	
};

notify.init = function(){
	
	if(!parent.CC.isMobileBind(parent.gMain.flags) && IsOA != 1){
		// CC.alert(Lang.Mail.ConfigJs.notify_nomobile);
        var url = ""
            aTag = "",
            wo = null;
        if(window.gMain && gMain.webPath && gMain.sid){
            url = gMain.webPath+"/se/account/accountindex.do?sid="+gMain.sid+"&mode=Mobile";
        }
        if(url){
            wo = function(){
                window.location.href = url;
            }
        }
        CC.alert(Lang.Mail.ConfigJs.phoneBindTip,wo );//"您还没有绑定手机号码，请进入设置-账号与安全中绑定您的手机号码。"
        if(url){
            jQuery("#divDialogClosealertbtn_0").find("span").find("span").html("立即绑定");
        }
		return;

	}
	this.toolTip_Black =new ToolTips({
		id:"toolTip_Black",
		direction:ToolTips.direction.Right,
		//closeTime : 10000,
		left: 511,
		top: -44
	});	
	this.whiteListData = {};
    this.blackListData = {};
    this.resultData = {};
    this.initService(this.attrs,this.getHtml);    
};

notify.getHtml=function(attrs, values){
	
	var p = this;
	var html = [];
	var ad = this.attrs;
    var data = ad.data;
    var first = true;
    
    if(values.beginTime || values.endTime || values.week != ""){
    	first = false;
    }
    this.Allalias = values;
    var title = MM[gConst.setting].menuItem[ad.id].name;
    var after = ad.tableAfter || "";
    var before = ad.tableBefore || "";
    
    html.push(this.getNavMenu(ad.id));
    
    
    html.push('<div class="notify">');
    
    html.push(this.getTopHtml());
    html.push(this.getLeftHtml());
    
    html.push("<div id=\"notifyWrapper\" class=\"setWrapper\">");
    
    //标题段。。。
    //html.push('<div>');  
    //html.push('<h1 style="font-weight:bold;">'+title+'</h1>');
    //html.push('<p>'+attrs.tips+'</p>');
    //html.push('</div>');
    
    html.push("<h2 class=\"set_til\"> " + title + "<span>( " + attrs.tips + " )</span></h2>");
    
    html.push("<div class=\"codeSet-wrap dotBtm\"><ul class=\"setCode-name\">");
    html.push("<li><span class=\"left\">" + attrs.data.notifyType.text + "</span>");
    
    //到达通知方式
    //html.push('<div class="notify_way">');
    //html.push('<dl class="mode">');
    //html.push('<dt>'+attrs.data.notifyType.text+'</dt>');
    
    
    var ntr0 = ntr1 = ntr2 = ntr3 = ntr4 = slt = kq = "";
    switch (values.notifyType) {
        case 0:
            ntr0 = "checked=\"checked\"";
            slt = "disable";
            kq = "disabled=\"disabled\"";
            break;
        case 1:
            ntr1 = "checked=\"checked\"";
            break;
        case 2:
            ntr2 = "checked=\"checked\"";
            break;
        case 3:
            ntr3 = "checked=\"checked\"";
        case 4:
            ntr4 = "checked=\"checked\"";
            break;
    }
    html.push('<input onclick="notify.changNotifyType(this)" class="set-radio" type="radio"  ' + ntr0 + ' id="option_notifyType0" value=\"0\" name="option_notifyType">');
    //html.push("<input type=\"radio\" name=\"\" class=\"set-radio\" id=\"sendNote-off\">");
    html.push("<label for=\"option_notifyType0\">" + attrs.data.notifyType.items["0"] + "</label></li>");
    html.push("<li class=\"pl155 pt_5\" style=\"_padding-left:158px;\"><div>");
    html.push('<input onclick="notify.changNotifyType(this)" class="set-radio" type="radio"  ' + ntr4 + ' id="option_notifyType4" value=\"4\" name="option_notifyType">');
    //html.push("<input type=\"radio\" name=\"\" class=\"set-radio\" id=\"sendNote-on\">");
    html.push("<label for=\"option_notifyType4\">" + attrs.data.notifyType.items["4"] + "</label><em class=\"red-commend\">（" + Lang.Mail.ConfigJs.index_recommend + "）</em></div></li>");
    html.push("</ul>  </div>");
    
    /*html.push('<dd><input onclick="notify.changNotifyType(this)" type="radio"  '+ntr0+' id="option_notifyType0" value=\"0\" name="option_notifyType"><label class="ov">'+attrs.data.notifyType.items["0"]+'</label></dd>');
     html.push('<dd><input onclick="notify.changNotifyType(this)" type="radio"  '+ntr1+' id="option_notifyType1" value=\"1\" name="option_notifyType"><label class="ov">'+attrs.data.notifyType.items["1"]+'</label></dd>');
     html.push('<dd><input onclick="notify.changNotifyType(this)" type="radio"  '+ntr2+' id="option_notifyType2" value=\"2\" name="option_notifyType"><label class="ov">'+attrs.data.notifyType.items["2"]+'</label></dd>');
     html.push('<dd><input onclick="notify.changNotifyType(this)" type="radio"  '+ntr3+' id="option_notifyType3" value=\"3\" name="option_notifyType"><label class="ov">'+attrs.data.notifyType.items["3"]+'</label></dd>');
     html.push('<dd><input onclick="notify.changNotifyType(this)" type="radio"  '+ntr4+' id="option_notifyType4" value=\"4\" name="option_notifyType"><label class="ov">'+attrs.data.notifyType.items["4"]+'</label></dd>');
     html.push('</dl>');*/
    //***********手机接收时间**********
    /*html.push('<dl class="mode">');
     html.push('<dt>'+Lang.Mail.ConfigJs.receiveMessageTime+'：</dt>');
     html.push('<dd>');
     html.push('<span id="receiveMessageInfo">' + p.getTimeRangeTips(values.beginTime, values.endTime, values.week) + '</span><a class="configA" id="receiveMessageSetting" href="javascript:fGoto();">' + ( first == true ? Lang.Mail.ConfigJs.addTimeRange : Lang.Mail.ConfigJs.modify ) + '</a>');
     html.push('</dd>');
     html.push('</dl>');*/
    html.push("<div class=\"codeSet-wrap dotBtm\" {0} id=\"notifyTime\"> <ul class=\"setCode-name\"> <li>".format(values.notifyType==0?"style='display:none;'":""));
    html.push("<span class=\"left\">" + Lang.Mail.ConfigJs.receiveMessageTime + "：</span>");
    //html.push("<span>6点-7点&nbsp;&nbsp;每天&nbsp;&nbsp;<a href=\"javascript:fGoto();\">修改</a></span>");
	values.week = values.week || "0,1,2,3,4,5,6";
    html.push('<span id="receiveMessageInfo">' + p.getTimeRangeTips(values.beginTime, values.endTime, values.week));
    html.push('</span><a class="configA {0}" id="receiveMessageSetting" href="javascript:fGoto();" >'.format(slt) + (first == true ? Lang.Mail.ConfigJs.addTimeRange : Lang.Mail.ConfigJs.modify) + '</a>');
    html.push("</li> </ul> </div>");
    
    //*******到达通知过滤********
    //html.push('<dl class="mode">');
    //html.push('<dt>' + Lang.Mail.ConfigJs.receiveMessageFilter + ': </dt>');
    html.push("<div class=\"codeSet-wrap\">");
    html.push("<ul class=\"setCode-name\" style=\"display:none;\"><li>");
    html.push("<span class=\"left\">" + Lang.Mail.ConfigJs.receiveMessageFilter + "：</span>");
    
    var kqChk1 = kqChk2 = "", disable = "", notifyDis = "", wld = "", bld = "", notifylist = "";
    if (values.limitFlag) {
        kqChk1 = "checked=\"checked\"";
    }
    else {
        kqChk2 = "checked=\"checked\"";
        disable = "disabled=\"disabled\"";
        notifyDis = "style=\"display:none\"";
        wld = "disabled=\"disabled\"";
        bld = "disabled=\"disabled\"";
        notifylist = "style=\"display:none\"";
    }
    html.push('<input id="openFilter" type="radio" name="receiveFilter" onclick="notify.kaiqi(this)" value="1" ' + kqChk1+" "+ kq + ' />');
    //html.push("<input type=\"radio\" name=\"\" class=\"set-radio\" id=\"filterNote-on\">");
    html.push("<label for=\"openFilter\">" + Lang.Mail.ConfigJs.openFilter + "</label></li>");
    html.push("<li class=\"pl155 pt_5\"><div>");
    html.push('<input id="closeFilter" type="radio" name="receiveFilter" onclick="notify.kaiqi(this)" value="0" ' + kqChk2 + ' />');
    //html.push("<input type=\"radio\" name=\"\" class=\"set-radio\" id=\"fliterNote-off\">");
    html.push("<label for=\"fliterNote-off\">" + Lang.Mail.ConfigJs.closeFilter + "</label>");
    html.push("</div></li></ul>");
    
    //html.push('<dd><input id="openFilter" type="radio" name="receiveFilter" onclick="notify.kaiqi(this)" value="1" ' + kqChk1 + ' /><label>' + Lang.Mail.ConfigJs.openFilter + '</label></dd>');
    //html.push('<dd><input id="closeFilter" type="radio" name="receiveFilter" onclick="notify.kaiqi(this)" value="0" ' + kqChk2 + ' /><label>' + Lang.Mail.ConfigJs.closeFilter + '</label></dd>');
    //html.push('</dl>');   		
    
    //*****黑白名单列表******
    //*****白名单开始*****
    //html.push('<dl id="notify_list1" class="mode notify_list" '+ notifyDis +'><dt>&nbsp;</dt><dd>');   		
    //html.push('<div class="list_div">');
    
    html.push("<ul class=\"setCode-name\" id=\"notify_list1\" " + notifyDis + ">");
	
    html.push("<li>");
	html.push("<span class=\"left\">" + Lang.Mail.ConfigJs.receiveMessageFilter + "：</span>");
    var wc = "", bc = "", bl = "", wl = "", bcls = wcls = bld = wld = "";
    
    
    if (values.item1 && values.limitType == 1) {
        wc = "checked=checked";
        bcls = "disable";
        bld = "disabled='disabled'"
    }
    else 
        if (values.limitType == 2 || values.limitType == 0) {
            bc = "checked=checked";
            wcls = "disable";
            wld = "disabled='disabled'";
        }
    //html.push('<p><input type="radio" name="filterList" '+wc+' id="white" onclick="notify.listKaiqi(\'w\')"/><label class="ov">'+Lang.Mail.Config.whiteList+'</label>');
    //html.push('<span class="configGray">(' + Lang.Mail.ConfigJs.mailWhiteListDesc  + ')</span>');
    //html.push('<div><input type="text" id="addWhiteInput" class="configAddInput" ' + wld + ' />');
    //html.push('<a id="addWhite" class="configA ' + wcls + '" href="javascript:fGoto();">' + Lang.Mail.ConfigJs.add  + '</a></div>');
    //html.push('<div class="list_area  '+wcls+'" name="whiteList" id="whiteList"></div>');
    //html.push('</div></dd>');//end the first list area(list_div).
    
    html.push('<input class="set-radio" type="radio" name="filterList" ' + wc + ' id="white" onclick="notify.listKaiqi(\'w\')"/>');
    html.push("<label for=\"white\">" + Lang.Mail.Config.whiteList + "</label>");
    html.push("<span class=\"setCode-name-tips\">(" + Lang.Mail.ConfigJs.mailWhiteListDesc + ")</span></li>");
    html.push("<li class=\"pl155 pt_5\" style='position: relative;zoom:1;'>");
    html.push("<span class=\"fake-txt w285\">");
    html.push('<input type="text" id="addWhiteInput" class="configAddInput" style="width:260px;" ' + wld + ' />');
	html.push("<i title='"+Lang.Mail.ConfigJs.chooseFromMailList+"' style='position:absolute;left:267px;top:7px;"+ (wc ? "" : "display:none;")+"' class=\"i-rush\" id='notify_WhiteAddContact'></i>");
    html.push("</span>");
    html.push("<a class=\"add_Link\" class=\"configA " + wcls + "\" id=\"addWhite\" href=\"javascript:fGoto();\">");
    html.push("<i class=\"i_addMail\"></i>" + Lang.Mail.ConfigJs.add + "</a></li>");
    html.push("<li class=\"pl155 pt_5\">");
    html.push("<div class=\"fake-txt-pop\">");
    html.push("<ul id=\"whiteList\" class=\"fake-txt-popList " + wcls + "\"></ul>");
    html.push("</div>");
    html.push("</li>");
    
    //********黑名单开始******
    //html.push('<dd><div class="list_div">');  		
    //html.push('<p><input type="radio" name="filterList" '+bc+' id="black"  onclick="notify.listKaiqi(\'b\')"/><label class="ov">'+Lang.Mail.Config.blackList+'</label>');
    //html.push('<span class="configGray">(' + Lang.Mail.ConfigJs.mailBlackListDesc  + ')</span>');
    //html.push('<div><input type="text" id="addBlackInput" class="configAddInput"  ' + bld + ' /><a id="addBlack" class="configA ' + bcls + '" href="javascript:fGoto();">' + Lang.Mail.ConfigJs.add  + '</a></div>');
    //html.push('<div class="list_area ' + bcls + '" name="blackList" id="blackList"></div>');
    //html.push('</div></dd>');//end the second list area(list_div).
    //html.push('</dl>');
    //html.push('</div>');//end notify_way   		
    
    html.push("<li class=\"pl155 pt_15\">");
    html.push("<input type=\"radio\" " + bc + " name=\"filterList\" class=\"set-radio\" id=\"black\" onclick=\"notify.listKaiqi('b')\">");
    html.push("<label for=\"black\">" + Lang.Mail.Config.blackList + "</label>");
    html.push("<span class=\"setCode-name-tips\">（" + Lang.Mail.ConfigJs.mailBlackListDesc + "）</span></li>");
    
    html.push("<li class=\"pl155 pt_5\" style='position: relative;zoom:1;'>");
    html.push("<span class=\"fake-txt w285\">");
    html.push('<input type="text" id="addBlackInput" class="configAddInput" style="width:260px;"  ' + bld + ' />');
	html.push("<i title='"+Lang.Mail.ConfigJs.chooseFromMailList+"' style='position:absolute;left:267px;top:7px;"+ (bc ? "" : "display:none;")+"' class=\"i-rush\" id='notify_BlackAddContact'></i>");
    html.push("</span>");
    html.push("<a id=\"addBlack\" class=\"add_Link " + bcls + "\" href=\"javascript:fGoto();\"><i class=\"i_addMail\"></i>" + Lang.Mail.ConfigJs.add + "</a>");
    html.push("</li>");
    html.push("<li class=\"pl155 pt_5\">");
    html.push("<div class=\"fake-txt-pop\">");
    html.push("<ul id=\"blackList\" class=\"fake-txt-popList " + bcls + "\"></ul>");
    html.push("</div>");
    html.push("</li>");
    html.push("</ul></div>");
	
	html.push("<div style=\"\" class=\"btm_pager\">");
    html.push("<a href=\"javascript:fGoto();\"  onclick=\"notify.save('');\" class=\"n_btn_on mt_5 ml_10\"><span><span>{0}</span></span></a>".format(Lang.Mail.ConfigJs.save));
    html.push("<a href=\"javascript:fGoto();\"  onclick=\"notify.goBack('');\" class=\"n_btn mt_5\"><span><span>{0}</span></span></a>".format(Lang.Mail.ConfigJs.pref_cancel));
    html.push("</div>");
	
    html.push("</div>");
    //html.push("<div style=''><div style='width:60px; float:left; text-align:left; color:#666;'>"+Lang.Mail.Config.Explain+"</div>");
    //html.push("<div style='width:700px; float:left; color:#999; margin-bottom:12px;'><div>"+Lang.Mail.Config.Explain1+"</div>");
    //html.push("<div>"+Lang.Mail.Config.Explain2+"</div></div>");
    //html.push('</div>');//end 790 div
    
    
    //html.push("</div>");
    //html.push("<div style='width:790px; overflow:hidden;'><a onclick=\"notify.save('');\" href=\"javascript:fGoto();\" class=\"btn\" style=\"float:left;width:3.5em;margin-left:260px\"><b class=\"r1\"></b><span class=\"rContent\"><span>"+Lang.Mail.Config.ok+"</span></span>");
    //html.push("<b class=\"r1\"></b></a><a onclick=\"notify.goBack('');\" href=\"javascript:fGoto();\" class=\"btn\" style=\"float:left;width:3.5em;margin-left:10px\"><b class=\"r1\">");
    //html.push("</b><span class=\"rContent\"><span>"+Lang.Mail.Config.cancel+"</span></span><b class=\"r1\"></b></a></div>");
    //html.push('</div>');//div: end setWrapper	
    
    MM[gConst.setting].update(this.attrs.id, html.join(""));
    pref.updatePosition("notifyWrapper");
    p.bindEvents(values);
    p.initDefaultData(values);           
}
notify.weeks = [Lang.Mail.ConfigJs.Sunday, Lang.Mail.ConfigJs.Monday, Lang.Mail.ConfigJs.Tuesday, Lang.Mail.ConfigJs.Wednesday, Lang.Mail.ConfigJs.Thursday, Lang.Mail.ConfigJs.Friday, Lang.Mail.ConfigJs.Saturday];
notify.getTimeRangeHtml = function(data){
	var html = [];
	var everyday = workday = weekday = selfDefine = false;
	var str1 = str2 = str3 = str4 = "";
	var expandos = "display:none", cls = "";
	
	if(data.week == "0,1,2,3,4,5,6"){
		everyday = true;
	}
	else if(data.week == "1,2,3,4,5"){
		workday = true;
	}
	else if(data.week == "0,6"){
		weekday = true;
	}
	else if(data.week != ""){
		selfDefine = true;
		expandos = "";
	}
	if(everyday)str1 = 'checked="checked"';
	if(workday)str2 = 'checked="checked"';
	if(weekday)str3 = 'checked="checked"';
	if(selfDefine)str4 = 'checked="checked"';
	if(data.week == '' &&(str1 == '' && str2 == '' && str3 == '' && str4 == '')){
		str1 = 'checked="checked"';
	}
	
    //html.push('<div id="selectTimeRangeDiv">');
	//html.push('<dl class="timeRangeDL">');
    //html.push('<dt>' + Lang.Mail.ConfigJs.date + ':</dt>');
	//html.push(Lang.Mail.Config.clock + ' - <select id="option_endTime">' + formatTimeOption(data.endTime) + '</select>' + Lang.Mail.Config.clock);
    //html.push('</dd></dl>');
	html.push("<div class=\"boxIframeText mailFile-pad\" id=\"selectTimeRangeDiv\">");
	html.push("<ul class=\"timeSet-pop\" id=\"timeRangeGroup\">");
	
	html.push("<li>");
	html.push("<span class=\"left\">"+ Lang.Mail.ConfigJs.date +"：</span>");    
    html.push('<select id="option_beginTime" class="set-select" onchange="notify.changeOption(this)">' + formatTimeOption(data.beginTime, 0) + '</select>');
	html.push("<span class=\"select_mod\">"+Lang.Mail.Config.clock+"</span>&nbsp;&nbsp;&mdash;&nbsp;&nbsp;");
	html.push('<select class="set-select" id="option_endTime">' + formatTimeOption(data.endTime, 1, data.beginTime) + '</select>');
	html.push("<span class=\"select_mod\">"+Lang.Mail.Config.clock+"</span>");
	html.push("</li>");
    
    //html.push('<dl class="timeRangeDL">');
    //html.push('<dt>' + Lang.Mail.list_Date + ':</dt>');
    //html.push('<dd id="timeRangeGroup"><input id="TR_everyday" name="timeRangeGroup" type="radio" value="0" ' + str1 + ' /><label>' + Lang.Mail.ConfigJs.everyday + '</label><br />');
    //html.push('<input id="TR_workday" name="timeRangeGroup" type="radio" value="1" ' + str2 + ' /><label>' + Lang.Mail.ConfigJs.workday + '</label><br />');
    //html.push('<input id="TR_weekday" name="timeRangeGroup" type="radio" value="2" ' + str3 + ' /><label>' + Lang.Mail.ConfigJs.weekday + '</label><br />');
    //html.push('<input id="TR_define" name="timeRangeGroup" type="radio" value="3" ' + str4 + ' /><label>' + Lang.Mail.ConfigJs.yourselfDefine + '</label>');
    //html.push('</dd></dl>');
	html.push("<li class=\"pt_15\">");
	html.push("<span class=\"left\">"+ Lang.Mail.list_Date +"：</span>");
	html.push('<input id="TR_everyday" name="timeRangeGroup" class="set-radio" type="radio" value="0" ' + str1 + ' />');
	html.push("<label for=\"q1\">"+Lang.Mail.ConfigJs.everyday+"</label>");
	html.push("</li>");
	
	html.push("<li class=\"pt_5 pl_50\">");
	html.push('<input id="TR_workday" name="timeRangeGroup" class="set-radio" type="radio" value="1" ' + str2 + ' />');
	html.push("<label for=\"q1\">"+Lang.Mail.ConfigJs.workday+"</label>");
	html.push("</li>");
	
	html.push("<li class=\"pt_5 pl_50\">");
	html.push('<input id="TR_weekday" name="timeRangeGroup" class="set-radio" type="radio" value="2" ' + str3 + ' />');
	html.push("<label for=\"q1\">"+Lang.Mail.ConfigJs.weekday+"</label>");
	html.push("</li>");
	
	html.push("<li class=\"pt_5 pl_50\">");
	html.push('<input id="TR_define" name="timeRangeGroup" class="set-radio" type="radio" value="3" ' + str4 + ' />');
	html.push("<label for=\"q1\">"+Lang.Mail.ConfigJs.yourselfDefine+"</label>");
	html.push("</li>");
	
	html.push("<li class=\"pl_50\">");
	html.push("<div class=\"daySelect-box\" id=\"autoDefine\"  style=\"" + expandos + "\">");
	html.push("<ul class=\"dayList\" id=\"autoDefineItems\">");
    //html.push('<dl id="autoDefine" class="timeRangeDL" style="' + expandos + '">');
    //html.push('<dt>&nbsp;</dt><dd id="autoDefineItems">');
    for(var i=1;i<notify.weeks.length;i++){
    	if((i+"").inStr(data.week)){
    		cls = 'checked="checked"';
    	}
    	else{
    		cls = "";
    	}
		html.push("<li>");
		html.push("<input type=\"checkbox\" name=\"selfDefine\" class=\"set-check\" value=\"" + i + "\""  + cls + ">");
		html.push("<label for=\"mon\">"+notify.weeks[i]+"</label>");
		html.push("</li>");
    	//html.push('<input type="checkbox" name="selfDefine" value="' + i + '" ' + cls + ' /><label>' + notify.weeks[i] + '</label>');
    	//if(i == 3){
    	//	html.push('<br />');
    	//}
    }
    if(("0").inStr(data.week)){
    	cls = 'checked="checked"';
    }
    else{
    	cls = "";
    }
	html.push("<li>");
	html.push("<input type=\"checkbox\" name=\"selfDefine\" class=\"set-check\" value=\"0\""  + cls + ">");
	html.push("<label for=\"mon\">"+notify.weeks[0]+"</label>");
	html.push("</li>");
    //html.push('<input type="checkbox" name="selfDefine" value="0" ' + cls + ' /><label>' + notify.weeks[0] + '</label>');
   // html.push('</dd></dl>');
    //html.push('</div>');
    html.push("</ul></div></li>");    
    html.push("<li class=\"pl_50\"><span class=\"error\" id=\"errorSelfDefine\"></span></li>");
    html.push("</ul></div>");
    function formatTimeOption(sel, type, dis){
    	// type [0: 开始值, 1: 结束值]
    	var opts = [], from = 0, to = 24;
    	sel = sel || 0;
    	if(type == 0){
    		to = 23;
    	}
    	else if(type == 1){
    		from = 1;
    	}
    	    	
    	for(var i=from;i<=to;i++){
    		if(sel == i){
    			s = 'selected="selected"';
    		}
    		else{
    			s = '';
    		}
    		if(type == 1){
    			if(i<=dis){
    				s += ' disabled="" class="disable"';
    			}
    		}
    		opts.push('<option value="' + i + '" ' + s + '>' + i + '</option>');
    	}
    	return opts.join('');
    }
    
    return html.join('');
};
notify.bindEvents = function(values){
	var p = this;
	var addTime = p.$('receiveMessageSetting');
	var white = p.$('addWhite');
	var black = p.$('addBlack');	
	
	var addWhite = p.addWhite(p);
	var addBlack = p.addBlack(p);
	var showTimeRange = p.showTimeRange(p);
	
	//EV.observe(addTime, 'click', showTimeRange, false);
	
	addTime.onclick=function(){
		if(!(('disable').inStr(this.className))){
			p.showTimeRangeDialog();
		}
	};

	if(values.item1){
		EV.observe(white, 'click', addWhite, false);
	}
	if(values.item2){	
		EV.observe(black, 'click', addBlack, false);
	}
	
	//注册enter事件
	EV.observe(p.$('addWhiteInput'), 'keydown', function(e){
		if( EV.getCharCode(e) == 13 ){
			p.addWhite(p)();
		}
	}, false);
	EV.observe(p.$('addBlackInput'), 'keydown', function(e){
		if( EV.getCharCode(e) == 13 ){
			p.addBlack(p)();
		}
	}, false);
	
	
	var i_white = jQuery("#notify_WhiteAddContact");
	i_white.mouseover(function(){
		jQuery(this).attr("class","i-rush-on");										 
	}).mouseout(function(){
		jQuery(this).attr("class","i-rush");		
	});
	i_white.click(function(){		
		p.addWhiteDialog();									 
	});
	
	var i_black = jQuery("#notify_BlackAddContact");
	i_black.mouseover(function(){
		jQuery(this).attr("class","i-rush-on");										 
	}).mouseout(function(){
		jQuery(this).attr("class","i-rush");		
	});	
	i_black.click(function(){		
		p.addBlackDialog();									 
	});
	
};
notify.addWhite = function(context){
	return function(){
		if(!(('disable').inStr(this.className))){
			var input = context.$('addWhiteInput');
			var btn = context.$('addWhite');
			var val = Vd.getRmDomain(input.value);			
			if(val.trim()!=""){				
				if(Vd.checkData("email",val) || Vd.checkData("*@domain",val)){
					//如果输入的地址不存在列表中，则添加
					if(notify.check_exist(val,"whiteList")){
						context.whiteListData[val] = val;
						context.updateListItem('w');
						input.value = '';
					}else{
						
						context.toolTip_Black.show(btn, Lang.Mail.ConfigJs.addressExist);
						
					}
					
				}
				else{
					if (jQuery("#white").attr("checked") == "checked") {
						//CC.alert(Lang.Mail.ConfigJs.errorEmailFormat);
						context.toolTip_Black.show(btn, Lang.Mail.ConfigJs.errorEmailFormat);
					}
				}
			}
			else{
				//context.addWhiteDialog();
				//CC.alert(Lang.Mail.ConfigJs.errorEmailFormat);
				if (jQuery("#white").attr("checked") == "checked") {
					context.toolTip_Black.show(btn, Lang.Mail.ConfigJs.errorEmailFormat);
				}
			}
		}
	};
};
notify.check_exist = function(val,id){
	var bExist = false;
	jQuery("#"+id+" li span").each(function(){
		if(jQuery(this).text() == val){
			bExist = true;
		}	
		
	});
	if(bExist){
		return false;
	}else{
		return true;
	}
	
};
notify.addBlack = function(context){
	return function(){
		if(!(('disable').inStr(this.className))){
			var input = context.$('addBlackInput');
			var btn = context.$('addBlack');
			var val = Vd.getRmDomain(input.value);
			if(val.trim()!=""){
				if(Vd.checkData("email",val) || Vd.checkData("*@domain",val)){
					//如果输入的地址不存在列表中，则添加
					if(notify.check_exist(val,"blackList")){
						context.blackListData[val] = val;
						context.updateListItem('b');
						input.value = '';
					}else{	
						context.toolTip_Black.show(btn, Lang.Mail.ConfigJs.addressExist);		
					}
					
				}
				else{
					if (jQuery("#black").attr("checked") == "checked") {
						//CC.alert(Lang.Mail.ConfigJs.errorEmailFormat);
						context.toolTip_Black.show(btn, Lang.Mail.ConfigJs.errorEmailFormat);
					}
				}
			}
			else{
				//context.addBlackDialog();
				//CC.alert(Lang.Mail.ConfigJs.errorEmailFormat);
				if (jQuery("#black").attr("checked") == "checked") {
					context.toolTip_Black.show(btn, Lang.Mail.ConfigJs.errorEmailFormat);
				}
			}
		}
	};
};
notify.showTimeRange = function(context){
	var p = this;
	return function(){
		if(!(('disable').inStr(this.className))){
			context.showTimeRangeDialog();
		}
	}
};
notify.initDefaultData = function(data){
	if(data.item1 && data.item1.length>0){
		for(var i=0, l=data.item1.length; i<l; i++){
			this.whiteListData[data.item1[i]] = data.item1[i];
		}
	}
	if(data.item2 && data.item2.length>0){
		for(var i=0, l=data.item2.length; i<l; i++){
			this.blackListData[data.item2[i]] = data.item2[i];
		}
	}
	if(data.limitType==1){
		this.updateListItem('w');
	}
	if(data.limitType==2){
		this.updateListItem('b');
	}
	if(!data.limitType || data.limitType ==0){
		data.limitType = 2;
	}
	this.resultData = data;
};
notify.updateListItemEvent = function(){
	var p = this;
	var objs = jQuery("li[name='listItem']"); //document.getElementsByClassName ? document.getElementsByClassName('listItem') : document.getElementsByName('listItem');
	var len = objs.length;
	var el, id, mode, parentNode;
	if(objs && len > 0){
		parentNode = objs[0].parentNode;
		if(parentNode.id == 'blackList'){
			mode = 'b';
		}
		if(parentNode.id == 'whiteList'){
			mode = 'w';
		}
		for(var i=0;i<len;i++){
			el = objs[i];
			id = el.id.substr(2);
			var remove = (function(id){
				return function(){
					p.removeItem(id, mode);
				}
			})(id);
			if( el.childNodes && el.childNodes[1] && id){
				EV.observe(el.childNodes[1], 'click', remove, false);
			}			
		}
	}
};
notify.removeItem = function(id, mode){
	if(!mode)return;
	var data = mode == 'b' ? this.blackListData : this.whiteListData;
	delete data[id];
	this.updateListItem(mode);
};
notify.changeOption=function(obj){
	var start=parseInt(obj.options[obj.selectedIndex].value);
	
	var endObj=document.getElementById("option_endTime");
	var endSlt= parseInt(endObj.options[endObj.selectedIndex].value);
	var text="", item;
	if(endSlt<=start){
		endSlt = start+1;
	}	
	endObj.options.length = 0;	
	for(var i=1;i<=24;i++){
		 text = i;//Lang.Mail.Config.nextDay
		 item = new Option(text,i);
		 if(i<=start){
		 	item.disabled = true;
		 	item.className = 'disable';
		 }		 
		 if(endSlt==i){
		 	item.selected = true;
		 }
		 endObj.options.add(item);
	}
		
}

notify.kaiqi=function(obj){
	if(obj.value != "1"){//关闭
		this.$("white").disabled=true;
		this.$("black").disabled=true;
		this.$("whiteList").disabled=true;
		this.$("blackList").disabled=true;
		this.$("notify_list1").style.display="none";
		this.$("notifyTime").style.display="none";
	}
	else{//开启
		this.$("white").disabled=false;
		this.$("black").disabled=false;
		if(this.$("white").checked){
		    this.$("whiteList").disabled=false;
		}
		if(this.$("black").checked){
			this.$("blackList").disabled=false;
		}		
		this.$("notify_list1").style.display="";		
		this.$("notifyTime").style.display="";
	}
	this.resultData['limitFlag'] = obj.value;
}

notify.changNotifyType=function(obj){
	var o = {};
	if(obj.value=="0" && obj.checked){
		El.addClass(this.$("receiveMessageSetting"), "disable");
		this.$('openFilter').disabled = true;
		this.$('openFilter').checked = false;
		this.$('closeFilter').disabled = false;
		this.$('closeFilter').checked = true;
		o.value = "0";
	}
	else{
		El.removeClass(this.$("receiveMessageSetting"), "disable");
		this.$('openFilter').disabled = false;
		this.$('openFilter').checked = true;
		this.$('closeFilter').disabled = false;
		this.$('closeFilter').checked = false;
		o.value = "1";
	}
	notify.kaiqi(o);
	this.resultData['notifyType'] = obj.value;
}


notify.save = function() {
    var p = this;
    var resultData = p.resultData;
    resultData.item1 = p.whiteListData;
    resultData.item2 = p.blackListData;
	var beginTime = resultData.beginTime;
	var endTime = resultData.endTime;
	var notifyType = resultData.notifyType;
	var limitFlag = resultData.limitFlag;		
	var limitType = resultData.limitType;
	var week = resultData.week;
	var item1 = [], item2 = [];
	for(var k in resultData.item1){
		if(k && resultData.item1[k]){
			item1.push(resultData.item1[k]);
		}
	}
	for(var k in resultData.item2){
		if(k && resultData.item2[k]){
			item2.push(resultData.item2[k]);
		}
	}
	
	var data={beginTime:beginTime,endTime:endTime,notifyType:notifyType,limitFlag:limitFlag,limitType:limitType,item1:item1,item2:item2,week:week};
	this.doService(p.attrs.save.func,data,callback,function(d){
	   	  if (d.summary) {
              p.fail(d.summary);
          }else{
              p.fail(Lang.Mail.Config.notify_fail,d); //设置失败
          }		   	
	 });

	function callback(d){
		if(d.code=="S_OK"){
			p.ok(Lang.Mail.Config.notify_sucess);//设置成功
		}else{
			p.fail(Lang.Mail.Config.notify_fail,d); //设置失败
		}
	}			
				
};

notify.listKaiqi=function(type){
	var p = this;
	var aW = p.$('addWhite');
	var aB = p.$('addBlack');
	var lw = p.$("whiteList");
	var lb = p.$("blackList");
	
	if(type=="w")
	{
		El.addClass(aB, 'disable');
		El.removeClass(aW, 'disable');
		El.removeClass(lw, 'disable');
		El.addClass(lb, 'disable');
		p.$('blackList').innerHTML = '';
		p.updateListItem('w');
		p.$("addWhiteInput").disabled=false;
		p.$("addBlackInput").disabled=true;
		p.resultData['limitType'] = 1;
		jQuery("#notify_WhiteAddContact").show();
		jQuery("#notify_BlackAddContact").hide();
	}
	else{
		El.addClass(aW, 'disable');
		El.removeClass(aB, 'disable');
		El.removeClass(lb, 'disable');
		El.addClass(lw, 'disable');
		p.$('whiteList').innerHTML = '';
		p.updateListItem('b');
		p.$("addWhiteInput").disabled=true;
		p.$("addBlackInput").disabled=false;
		p.resultData['limitType'] = 2;
		jQuery("#notify_WhiteAddContact").hide();
		jQuery("#notify_BlackAddContact").show();
	}
};
notify.getTimeRangeTips = function(bt, et, week){
	var weekTip = "";
	if(week == "0,1,2,3,4,5,6"){
		weekTip = Lang.Mail.ConfigJs.everyday;
	}
	else if(week == "1,2,3,4,5"){
		weekTip = Lang.Mail.ConfigJs.workday;
	}
	else if(week == "0,6"){
		weekTip = Lang.Mail.ConfigJs.weekday;
	}
	else if(week != ""){
		var w = week.split(',');
		for(var i=0;i<w.length;i++){
			weekTip += ' / ' + notify.weeks[w[i]];
		}
		if(weekTip != ""){
			weekTip = weekTip.substr(3);
		}
	}
	
	return bt + Lang.Mail.Config.clock + ' - ' + et + Lang.Mail.Config.clock + ' &nbsp;&nbsp; ' + weekTip + '&nbsp;&nbsp;';
};
notify.createListItem = function(email){
	var p = this;
	var mailId = email;
	var html = '<li id="m_' + mailId + '" class="listItem" name="listItem" title="' + email + '"><span class="text">'+ email +'</span><i class="i-fakeTxt-close"></i></li>';
	//'<div id="m_' + mailId + '" class="listItem" name="listItem" title="' + email + '"><span class="text">'+ email +'</span><span class="close">×</span></div>';
	return html;
};
notify.showTimeRangeDialog = function(){
	var p = this;
	var html = notify.getTimeRangeHtml(this.resultData);
	var callback = function(){
		var btObj = p.$('option_beginTime');
		var etObj = p.$('option_endTime');
		var tipDoc = p.$('receiveMessageInfo');
		var beginTime = btObj.options[btObj.selectedIndex].value;
		var endTime = etObj.options[etObj.selectedIndex].value;
		if(beginTime-0>=endTime-0){
			$('errorSelfDefine').innerHTML = Lang.Mail.ConfigJs.timeW;
			return true;
		}
		var week = '', weekTip = '';
		if(p.$('TR_everyday').checked){
			week = '0,1,2,3,4,5,6';			
		}
		if(p.$('TR_workday').checked){
			week = '1,2,3,4,5';			
		}
		if(p.$('TR_weekday').checked){
			week = '0,6';
		}
		if(p.$('TR_define').checked){
			var selfDefines = p.$('autoDefineItems').getElementsByTagName('input');
			var l = selfDefines.length;
			for(var i=0;i<l;i++){
				if(selfDefines[i] && selfDefines[i].tagName == 'INPUT' && selfDefines[i].checked){
					week += ',' + selfDefines[i].value;
				}
			}
			if(week != ''){
				week = week.substr(1);
			}			
		}
		if(week == ''){
			$('errorSelfDefine').innerHTML = Lang.Mail.ConfigJs.choiseCtime+'.';
			return true;
		}
		
		p.resultData['beginTime'] = beginTime;
		p.resultData['endTime'] = endTime;
		p.resultData['week'] = week;
		
		tipDoc.innerHTML = p.getTimeRangeTips(beginTime, endTime, week);
	};
	var cancelback = function(){
		
	};
	
	var ao = {
        id : 'confirm_time_range_dialog',
        title: Lang.Mail.ConfigJs.messageNotifySetting,
		type : 'div',
        text : html,
		changeStyle:false,
		zindex:1090,
		dragStyle:1,
		width: 380,
        buttons : [{text:Lang.Mail.Ok,clickEvent:callback},{text:Lang.Mail.Cancel,clickEvent:cancelback,isCancelBtn:true}]        
    };
    CC.msgBox(ao);
    notify.bindTimeRangeEvents();
};
notify.bindTimeRangeEvents = function(){
	//var timeRangeItems = this.$('timeRangeGroup').getElementsByTagName('input');
	var timeRangeItems =jQuery("input[name='timeRangeGroup']"); 
	if(timeRangeItems && timeRangeItems.length > 0){
		for(var i=0; i<timeRangeItems.length;i++){			
			//EV.observe(timeRangeItems[i], 'click', chkList, false);
			timeRangeItems[i].onclick = function(){
				//chkList(timeRangeItems[i]);
				var val = this.value;
				var ele = document.getElementById('autoDefine');
				if(ele){
					if(val && val == "3"){
						jQuery("input[name='selfDefine']").attr("checked",false); 
						El.show(ele);
					}
					else{
						El.hide(ele);
					}
				}
			};
		}
	}
	
	EV.observe($('autoDefineItems'), 'click', function(e){
		var el = EV.getTarget(e);
		if(el && el.tagName.toLowerCase() == 'input'){
			$('errorSelfDefine').innerHTML = '';
		}
	}, false);
	
	/*
function chkList(obj){
		var val = obj.value;
		var ele = document.getElementById('autoDefine');
		if(ele){
			if(val && val == "3"){
				El.show(ele);
			}
			else{
				El.hide(ele);
			}
		}
	}
*/
};
notify.showContactDialog = function(type, callback, cancelcallback, attrs){
		contact = new parent.Contact("contact");
		contact.groupMap = LMD.groupMap;
		contact.group_contactListMap = LMD.group_contactListMap_mail;
		contact.inItContanct(notify.attrs.id + "_ContactDialog",type,callback,null);
};
notify.addWhiteDialog = function(){
	if($("white").checked == false) return;
	var p = this;
	var type = ["0","2"];
	var callback = function(ao){
		var email;
		for(var i = 0, l=ao.length; i<l; i++){
			email = p.getClearEmail(ao[i].value);
			p.whiteListData[email] = email;
		}
		p.updateListItem('w');
	}
	notify.showContactDialog(type, callback);
};
notify.addBlackDialog = function(){
	if($("black").checked == false) return;
	var p = this;
	var type = ["0","2"];
	var callback = function(ao){
		var email;
		for(var i = 0, l=ao.length; i<l; i++){
			email = p.getClearEmail(ao[i].value);
			p.blackListData[email] = email;
		}
		p.updateListItem('b');
	}
	notify.showContactDialog(type, callback);
};
notify.getClearEmail = function(email){
	email = email.decodeHTML();
	var start = email.indexOf('<')+1;
	var len = email.lastIndexOf('>') - start;
	return email.substr(start, len);
};
notify.updateListItem = function(type){
	var html = [];
	if(type=='w'){
		for(var k in this.whiteListData){
			html.push(this.createListItem(this.whiteListData[k]));
		}
		this.$('whiteList').innerHTML = html.reverse().join('');
	}
	else if(type=='b'){
		for(var k in this.blackListData){
			html.push(this.createListItem(this.blackListData[k]));
		}
		this.$('blackList').innerHTML = html.reverse().join('');
	}
	notify.updateListItemEvent();
	html = null;
};


var loginNotify = new OptionBase();
loginNotify.attrs = {
	id: 'loginNotify',
	authority: 'MAIL_CONFIG_LOGIN',
	divId: 'pageNotify',
	list: {type: 'url', func:gConst.func.getLoginNotify},
	save: {type: 'url', func:gConst.func.setLoginNotify},
	data: {
		
	}
};
loginNotify.init = function(){
    if(!parent.CC.isMobileBind(parent.gMain.flags) && IsOA != 1){
        // CC.alert(Lang.Mail.ConfigJs.notify_nomobile);
        var url = ""
            aTag = "",
            wo = null;
        if(window.gMain && gMain.webPath && gMain.sid){
            url = gMain.webPath+"/se/account/accountindex.do?sid="+gMain.sid+"&mode=Mobile";
        }
        if(url){
            wo = function(){
                window.location.href = url;
            }
        }
        CC.alert(Lang.Mail.ConfigJs.phoneBindTip,wo );//"您还没有绑定手机号码，请进入设置-账号与安全中绑定您的手机号码。"
        if(url){
            jQuery("#divDialogClosealertbtn_0").find("span").find("span").html("立即绑定");
        }     
        return;
    }

	this.resultData = {};
	this.resultData.userList = {};
	this.initService(this.attrs, this.getHtml);
}
loginNotify.getHtml = function(attr, values){
	var html = [];
	
	var oStatus=cStatus=iStatus="";
	if(values.limitFlag == 1){
		oStatus = "checked='checked'";
	} else if (values.limitFlag==0){
		cStatus = "checked='checked'";
	} else {
		iStatus = "checked='checked'";
	}
	html.push(this.getNavMenu(this.attrs.id));
    html.push('<div class="notify">');	
	html.push(this.getTopHtml());
	html.push(this.getLeftHtml());
	html.push("<div class=\"setWrapper\" id=\"loginsetWrapper\">");
	
	// html.push('<div class="loginNotifyItem">');
	// html.push('<div class="title">' + Lang.Mail.ConfigJs.loginNotify + ': </div>');
	// html.push('<div class="content">');
	// html.push('<input id="ln_close" name="ln_gate" type="radio" value="0" ' + cStatus + ' onclick="loginNotify.setStatus(0)" /><label>' + Lang.Mail.ConfigJs.set_sessionMode_off + '</label>');
	// html.push('<input id="ln_open" name="ln_gate" type="radio" value="1"  ' + oStatus + ' onclick="loginNotify.setStatus(1)" /><label>' + Lang.Mail.ConfigJs.set_sessionMode_on + '</label>');
	// html.push('</div>');//end content
	// html.push('</div>');//end Item1
// 	
	// html.push('<div class="ln_choseUser">' + Lang.Mail.ConfigJs.notifyEmailManager + '</div>');
// 	
	// html.push('<div class="loginNotifyItem">');
	// html.push('<div class="title">' + Lang.Mail.ConfigJs.choseUser + ':</div>');
	// html.push('<div class="content">');
	// html.push('<ul id="userListContainer" class="ln_userListContainer"></ul>');
	// html.push('<a id="add_user_btn" class="configA" href="javascript:fGoto();">' + Lang.Mail.ConfigJs.add + '</a>');
	// html.push('</div>');//end content	
	// html.push('</div>');// end Item2
	// html.push("<div style='width:500px; margin:12px 0; overflow:hidden;'><a onclick=\"loginNotify.save('');\" href=\"javascript:fGoto();\" class=\"btn\" style=\"float:left;width:3.5em;margin-left:90px\"><b class=\"r1\"></b><span class=\"rContent\"><span>"+Lang.Mail.Config.ok+"</span></span>");
    // html.push("<b class=\"r1\"></b></a><a onclick=\"loginNotify.goBack('');\" href=\"javascript:fGoto();\" class=\"btn\" style=\"float:left;width:3.5em;margin-left:10px\"><b class=\"r1\">");
    // html.push("</b><span class=\"rContent\"><span>"+Lang.Mail.Config.cancel+"</span></span><b class=\"r1\"></b></a></div>");
	// html.push('<div id="ln_tips">' + Lang.Mail.ConfigJs.introductionForLoginNotify + '</div>');
	
		
	html.push("<h2 class=\"set_til\"> " + Lang.Mail.ConfigJs.loginNotify + "<span>"+Lang.Mail.ConfigJs.loginNotifyTip+"</span></h2>");
	html.push("<div class=\"codeSet-wrap dotBtm\">");
	html.push("<ul class=\"setCode-name\">");
	
	////html.push("<li class=\"pl155 pt_5\"><span class=\"left\">"+Lang.Mail.ConfigJs.setLonginNotify+"</span>");
	html.push("<li class=\"pt_5\"><span class=\"left\">"+Lang.Mail.ConfigJs.setLonginNotify+"</span>");
	html.push("<div>");
	html.push("<input id=\"ln_exception\" name=\"ln_gate\" type=\"radio\" class=\"set-radio\" value=\"0\" " + iStatus + " onclick=\"loginNotify.setStatus(2)\">");
	html.push("<label for=\"\">异常时发送</label>");
	//html.push("<label for=\"\">"+Lang.Mail.ConfigJs.set_sessionMode_exception+"</label>");
	html.push('<span style="display: inline-block;  color: #828282;  font-weight: normal;  padding-left: 10px;">在其他城市(不是您经常登录的城市，包括海外)登录时，会发送登录提醒短信给您。</span>');
	html.push("</div>");
	html.push("</li>");
	
	html.push("<li class=\"pl155 pt_15\">");
	html.push("<input id=\"ln_open\" name=\"ln_gate\" type=\"radio\" class=\"set-radio\" value=\"1\" " + oStatus + " onclick=\"loginNotify.setStatus(1)\">");
	////html.push("<label for=\"\">" + Lang.Mail.ConfigJs.set_sessionMode_on + "</label>");
	html.push("<label for=\"\">每次都发送</label>");
	html.push('<span style="display: inline-block;  color: #828282;  font-weight: normal;  padding-left: 10px;"></span>');//每次登录企业邮箱，都发送登陆安全提醒短信。为免打扰，同一IP段每4小时最多发送一条。
	////<span style="display: inline-block;  color: #828282;  font-weight: normal;  padding-left: 10px;">在其他城市(不是在您经常登录的城市)登录企业邮箱时，前5此发送登陆提醒给您；密码作物次数超限时，会发送短信给您</span>
	html.push("</li>");
	html.push("<li class=\"pl155 pt_15\">");
	html.push("<div>");
	html.push("<input id=\"ln_close\" name=\"ln_gate\" type=\"radio\" class=\"set-radio\" value=\"0\" " + cStatus + " onclick=\"loginNotify.setStatus(0)\">");
	////html.push("<label for=\"\">" + Lang.Mail.ConfigJs.set_sessionMode_off + "</label>");
	html.push("<label for=\"\">不发送</label>");
	html.push("</div>");
	html.push("</li>");
	//上次登陆时间和IP,首次登陆隐藏该信息
	if (lastLoginTime!="") {
		var oDate = new Date(lastLoginTime.replace(/-/g,"/"));
		var day = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六")[oDate.getDay()];
		
		html.push("</li>");
		html.push("<li class=\"pt_15\" style=\"padding-left: 60px;\">");
		html.push("<div>");
		if (lastLoginTime!=""&&lastLoginTime!="") {
			html.push("上次登录时间：<label style=\"padding-right: 200px;\">"+lastLoginTime+" ("+day+")</label>");
		}
		if(lastLoginIp!=""&&lastLoginCity!="") {
			html.push("上次登录IP：<label style=\"padding-right: 20px;\">"+lastLoginIp+"("+lastLoginCity+")</label>");	
		}
		
		html.push('<a onclick="loginNotify.goLoginLog();" href="javascript:;">登录记录查询</a>');
		html.push("</div>");
		html.push("</li>");
	}
	html.push("</ul>");
	html.push("</div>");
	html.push("<div class=\"btm_pager\"><a class=\"n_btn_on mt_5 ml_10\" onclick=\"loginNotify.save('');\" href=\"javascript:fGoto();\"><span><span>" + Lang.Mail.ConfigJs.save + "</span></span></a><a class=\"n_btn mt_5\" onclick=\"loginNotify.goBack('');\" href=\"javascript:fGoto();\"><span><span>" + Lang.Mail.Config.cancel + "</span></span></a></div>");

	html.push('<div>');//end setWrapper
	html.push('</div>');//end notify	

	MM[gConst.setting].update( this.attrs.id, html.join(''));
	pref.updatePosition("loginsetWrapper");
	this.loadDefaultData(values);
	this.initEvents();
};
loginNotify.loadDefaultData = function(data){
	this.resultData = data;
	// var uIds = data.userId;
	// var users = uIds.split(',');
	// for(var i=0, l=users.length; i<l;i++){
		// if(users[i] && users[i]!=""){
			// this.resultData.userList[users[i]] = 1;
		// }
	// };
	// for(var k in data){
		// this.resultData[k] = data[k];
	// }
	//this.updateList();
};
loginNotify.goLoginLog = function() {
	CC.goLogLink("发信日志","login");
};
loginNotify.initEvents = function(){
	// var p = this;
	// var addDoc = p.$('add_user_btn');
	// var addEvt = p.userDialog(p);
	// EV.observe(addDoc, 'click', addEvt, false);
	
};
loginNotify.userDialog = function(context){
	return function(){
		context.showUserDialog();
	};
};
loginNotify.showUserDialog = function(){
	var p = this;
	var callback = function(ao){
		var email;
		for(var i = 0, l=ao.length; i<l; i++){
			p.resultData.userList[ao[i].value] = 1;
		}
		p.updateList();
	};
	var cancelback = function(){
		
	};	
	contact = new parent.Contact("contact");
	contact.inItUser(notify.attrs.id + "_UserDialog",callback,null);
};
loginNotify.updateList = function(){
	var html = [];
	var d = this.resultData.userList;
	for(var k in d){
		if( k && d[k]){
			html.push(this.createListItem(k));
		}
	}
	this.$('userListContainer').innerHTML = html.reverse().join('');
	this.bindListItemEvents();
};
loginNotify.createListItem = function(d){
	return '<li id="u_' + d + '" class="ln_item" title="' + d + '"><span class="ln_note">' + d + '</span><span class="ln_close">×</span></li>';
};
loginNotify.removeListItem = function(id){
	delete this.resultData.userList[id];
	this.updateList();
};
loginNotify.bindListItemEvents = function(){
	var p = this;
	var items = this.$('userListContainer').getElementsByTagName('li');
	var id, node, evt;
	for(var i=0,l=items.length;i<l;i++){
		id = items[i].id;
		id = id.substr(2);
		node = items[i].getElementsByTagName('span')[1];
		evt = (function(id){
			return function(){
				p.removeListItem(id);
			};
		})(id);
		if(node && id != ""){
			EV.observe(node, 'click', evt, false);
		}
	}
};
loginNotify.setStatus = function(v){
	this.resultData.limitFlag = v;
};
loginNotify.save = function(){
	var p = this;
	var data = this.resultData;
	// var userList = [];
	// for(var u in data.userList){
		// userList.push(p.getEmailName(u));
	// }
	// data.userId = userList.join(',');
	// delete data.userList;
	this.doService(p.attrs.save.func,data,callback,function(d){
	   	  if (d.summary) {
              p.fail(d.summary);
          }else{
              p.fail(Lang.Mail.ConfigJs.loginNotifyFail,d); //设置失败
          }		   	
	 });

	function callback(d){
		if(d.code=="S_OK"){
			p.ok(Lang.Mail.ConfigJs.loginNotifySuccess);//设置成功
		}else{
			p.fail(Lang.Mail.ConfigJs.loginNotifyFail,d); //设置失败
		}
	}
};
loginNotify.getClearEmail = function(email){
	return notify.getClearEmail(email);
};

