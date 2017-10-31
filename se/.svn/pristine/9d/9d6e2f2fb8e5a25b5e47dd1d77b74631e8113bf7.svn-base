var autoReply = new OptionBase();

autoReply.attrs = {
	id : 'autoReply',
	authority: 'MAIL_CONFIG_AUTOREPLY',
	divId : 'pageAutoReply',
	textBox : null,
    list:{type:"url",func:gConst.func.getAttrs},            //鑾峰彇鏁版嵁/鍒楄〃鏃舵寚浠わ紝鏁版嵁
    save:{type:"url",func:gConst.func.setAttrs},          //鏇存柊鏁版嵁鏃秄unc鎸囦护,鍙婃暟鎹�
    tips: Lang.Mail.ConfigJs.reply_lbl_tips,
    data: { 
		auto_replay_status: {
		    text: Lang.Mail.ConfigJs.reply_lbl_isopen,
			type: 'radio',
			className: '',
			attribute: {
				value: '',
				defaultValue: '',
				className: ''
			},
			items: { '1': Lang.Mail.ConfigJs.reply_lbl_yes, '0': Lang.Mail.ConfigJs.reply_lbl_no },
			format: 'int'
		},
		auto_replay_content_label: {
		    text:Lang.Mail.ConfigJs.reply_lbl_respcontent1,
			type: 'label',
			className: '',
            row:true,
            noset:true
		},
        auto_replay_content: {
			text: '',
			type: 'textarea',
			className: 'autoReplay',
            row:true,
            attribute: {
				value: '',
				defaultValue: '',
				className: '',
                rows:7,
                cols:50
			},
            format:"text"
		},
		auto_setting_time:{
			text:'',
			type:'html',
			className:'',
			row:true,
			noset:true,
			html:''
		},		
		auto_replay_starttime: {
			text: '',
			type: 'text',
            attribute: {
				value: '',
				defaultValue: ''
			},
			display:false,
            format:"text"
		},
		auto_replay_endtime: {
			text: '',
			type: 'text',
            attribute: {
				value: '',
				defaultValue: ''
			},
			display:false,
            format:"text"
		}
	}		
};
autoReply.changeDays = function(id)
{
	var objSelect = document.getElementById(id+"Day");
	objSelect.options.length = 0;
	var d1 = new Date(document.getElementById(id+"Year").value,document.getElementById(id+"Month").value,0); 
	var a ="";
	 for (i = 1; i <= d1.getDate(); i++) {
	 	a=i;
	 	if(i<10)
			a="0"+i;
	 	var varItem = new Option(a, a);
	 	objSelect.options.add(varItem);
	 }
};
autoReply.init = function(){
	
	var a = this.attrs;
	//a.textBox = new RichTextBox({id: "option_auto_replay_content"});	
	//a.auto_replay_starttime="";
	//a.auto_replay_endtime="";
    this.request(a);
    
    /*window.setTimeout(function(){
        var obj = p.getEl("auto_replay_content");
        Vd.limitMaxInput(obj, gConst.autoRepaly_max, null,false); 
    },1000);*/
};
autoReply.getHtml = function(ad)
{
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
		
		html.push("<div class=\"setWrapper\" id=\"autoReplyWrapper\">");
		var headHTML = "<h2 class=\"set_til\"> {0}<span>({1})</span></h2>".format(title,ad.tips);

		html.push(this.getHead(title,"",headHTML));
		html.push(before);
		//html.push();
		var setTimeHtml ="";
		var setleftTimeHTML = "";
		var settimeStatus=false;
		var check = ad.data["auto_replay_status"].attribute.value;
		if(ad.data.auto_replay_starttime.attribute.value !=0 && ad.data.auto_replay_endtime.attribute.value!="")
			settimeStatus=true;
		//setleftTimeHTML = "<input onclick=\"if(this.checked){document.getElementById('selctTimeDiv').style.display='';}else{document.getElementById('selctTimeDiv').style.display='none';}\" "+(settimeStatus==true?"checked='checked'":"")+" type=\"checkbox\" id=\"chkSetTime\" > "+Lang.Mail.ConfigJs.settime+"：&nbsp;&nbsp;&nbsp;&nbsp;";
		setleftTimeHTML = "<input "+(settimeStatus==true?"checked='checked'":"")+" type=\"checkbox\" id=\"chkSetTime\" > "+Lang.Mail.ConfigJs.settime+"：&nbsp;&nbsp;";
		//setTimeHtml += "<span id='selctTimeDiv' style=\"position:relative; top:-2px;display:"+(settimeStatus=="true"?"":"none")+"\"><label>"+Lang.Mail.ConfigJs.from+"</label><input type=\"input\"  id=\"startTime\" onfocus=\"WdatePicker({dateFmt:'yyyy-MM-dd',skin:'default'});\" value=\""+(settimeStatus=="true"?Util.formatDate(ad.data.auto_replay_starttime.attribute.value,"yyyy-mm-dd"):"")+"\"> &nbsp;&nbsp;" +Lang.Mail.ConfigJs.to;
		//setTimeHtml +="<input type=\"input\" class=\"set-select\" id=\"endTime\" onfocus=\"WdatePicker({dateFmt:'yyyy-MM-dd',skin:'default'});\" value=\""+(settimeStatus=="true"?Util.formatDate(ad.data.auto_replay_endtime.attribute.value,"yyyy-mm-dd"):"")+"\"></span>";
		var startTime = endTime =new Date().format("yyyy-mm-dd");
		if (settimeStatus && check+"" == "1") {
			 startTime = Util.formatDate(new Date(parseInt(ad.data.auto_replay_starttime.attribute.value)*1000), "yyyy-mm-dd");
			 endTime = Util.formatDate(new Date(parseInt(ad.data.auto_replay_endtime.attribute.value)*1000), "yyyy-mm-dd");
		}
		startTime=startTime.split('-');
		endTime = endTime.split('-');
		setTimeHtml += "<p id='selctTimeDiv' class='set-time-p' style='width:500px'>";
		setTimeHtml += '<select id="selYear"  class="set-select" onchange="autoReply.changeDays(\'sel\')" >'+this.getdateHtml(2012,2020,startTime[0])+'</select><span class="select_mod">'+Lang.Mail.Write.lb_timesend_year+'</span><select id="selMonth"  class="set-select" onchange="autoReply.changeDays(\'sel\')">'+this.getdateHtml(1,12,startTime[1])+'</select><span class="select_mod">'+Lang.Mail.Write.lb_timesend_month+'</span><select id="selDay"  class=\"set-select\">'+this.getdateHtml(1,31,startTime[2])+'</select><span class="select_mod">'+Lang.Mail.Write.lb_timesend_day+'</span><strong>'+Lang.Mail.ConfigJs.to+'</strong>';
		setTimeHtml += '<select id="endYear"  class="set-select" onchange="autoReply.changeDays(\'end\')" >'+this.getdateHtml(2012,2020,endTime[0])+'</select><span class="select_mod">'+Lang.Mail.Write.lb_timesend_year+'</span><select id="endMonth"  class="set-select" onchange="autoReply.changeDays(\'end\')">'+this.getdateHtml(1,12,endTime[1])+'</select><span class="select_mod">'+Lang.Mail.Write.lb_timesend_month+'</span><select id="endDay"  class=\"set-select\">'+this.getdateHtml(1,31,endTime[2])+'</select><span class="select_mod">'+Lang.Mail.Write.lb_timesend_day+'</span></p>';
		//ad.data.auto_setting_time.html =setTimeHtml;
		//var table =this.getTable(ad);
		//var tableList = table.split('</textarea></td></tr>'); 
		//html.push(tableList[0]);
		//html.push('</textarea></td></tr>');
		
		html.push("<div class=\"autoReply-wrap\">");
		html.push("<table class=\"autoReply-table\" >");
		html.push("<tr class=\"line1\">");
		html.push("<td width=\"145\" class='ta_r'>{0}：</td>".format(title));
		html.push("<td><input class=\"set-radio\" id=\"option_auto_replay_status1\" value=\"1\" name=\"option_auto_replay_status\" type=\"radio\"/><label for=\"option_auto_replay_status1\">{0}</label></td>".format(Lang.Mail.ConfigJs.reply_lbl_yes));
		html.push("</tr>");
		html.push("<tr class=\"line2\">");
		html.push("<td>&nbsp;</td>");
		html.push("<td><input class=\"set-radio\" id=\"option_auto_replay_status0\" value=\"0\" checked=\"checked\" name=\"option_auto_replay_status\" type=\"radio\"/><label for=\"option_auto_replay_status0\">{0}</label></td>".format(Lang.Mail.ConfigJs.reply_lbl_no));
		html.push("</tr>");
		html.push("<tr class=\"line3\">");
		html.push("<td class='ta_r' valign=\"top\">{0}</td>".format(Lang.Mail.ConfigJs.reply_lbl_respcontent1));
		html.push("<td>");		
		//html.push("<div style='position:relative;'>");
		html.push('<textarea style="margin:0 0 7px 0;" class="w346" cols="50" rows="7" name="option_auto_replay_content" id="option_auto_replay_content" type="text"></textarea>');
		//html.push(p.attrs.textBox.getHtml());
		//html.push("</div>");
		html.push("</td>");
		html.push("</tr>");
		html.push("<tr class=\"line4\">");
		html.push("<td>&nbsp;</td>");
		html.push("<td>"+Lang.Mail.ConfigJs.reply_content_maxLength.format(gConst.autoRepaly_max)+"</td>");
		html.push("</tr>");
		html.push("<tr>");
		html.push("<td class='ta_r'>{0}</td><td>{1}</td>".format(setleftTimeHTML,setTimeHtml));
		//html.push("<td></td>");
		html.push("</tr>");
		html.push("</table>");
		html.push("</div>");
		
		//html.push(tableList[1]);
		html.push(after);
		//html.push(this.getBottom(ad.bottomHtml));
		html.push("<div style=\"width:100%\" class=\"btm_pager fl\">");
		html.push("<a href=\"javascript:fGoto();\"  onclick=\"autoReply.save('');\" class=\"n_btn_on mt_5 ml_10\"><span><span>{0}</span></span></a>".format(Lang.Mail.ConfigJs.save));
		html.push("<a href=\"javascript:fGoto();\"  onclick=\"autoReply.goBack('');\" class=\"n_btn mt_5\"><span><span>{0}</span></span></a>".format(Lang.Mail.ConfigJs.pref_cancel));
		html.push("</div>");
		
		html.push("</div></div></div>");
		
		MM[gConst.setting].update(this.attrs.id, html.join(""));
		
		pref.updatePosition("autoReplyWrapper");
		
		var content = ad.data["auto_replay_content"].attribute.value;
		if(check){
			$("option_auto_replay_status"+check).checked = true;
		}		
		//setTimeout(function(){
		//	RTB_items.init();
		if(content){
				//$("option_auto_replay_content").innerHTML = content;
				//RTB_items["option_auto_replay_content"].setEditorValue(content);
			$("option_auto_replay_content").value = content;	//.decodeHTML()
		}
		//},200);
		p.loadEvent();
		//disabled
    	//MM[gConst.setting].update(this.attrs.id,html.join(""));
};

autoReply.getdateHtml=function(startIndex,endIndex,index)
{
	html=[];
	var a =0;
	for(var i = startIndex;i<=endIndex;i++)
	{
		a=i+"";
		if(a<10)
			a="0"+a;
		html.push("<option value='"+a+"' "+(a==index?"selected":"")+">"+a+"</option>");
	}
	return html.join("");
};
autoReply.save = function() {
    var p = this;
	var beginTime=document.getElementById("selYear").value+"-"+document.getElementById("selMonth").value+"-"+document.getElementById("selDay").value +" 00:00:00";
	var endTime=document.getElementById("endYear").value+"-"+document.getElementById("endMonth").value+"-"+document.getElementById("endDay").value +" 23:59:59";
	
	var auto_replay_status = p.getFormatValue("auto_replay_status");
	var	auto_replay_content	=p.getFormatValue("auto_replay_content"); //RTB_items["option_auto_replay_content"].getEditorValue(); 
	//auto_replay_content = auto_replay_content.replace(/\n|\r|(\r\n)|(\u0085)|(\u2028)|(\u2029)/g, "<br>");
	var limitFlag=0;
	if(!p.check(true)) return;
	if(auto_replay_status){
		if(document.getElementById("chkSetTime").checked){
			
			var sDate = Util.str2Date(beginTime);
			beginTime = sDate.getTime()/1000;
			var eDate = Util.str2Date(endTime);
			endTime = eDate.getTime()/1000;
			if (beginTime > endTime) {
				CC.alert(Lang.Mail.ConfigJs.endDateEquerStartDate);
				return;
			}	
			var d = Util.DateDiffMore(eDate.format("yyyy/mm/dd"),new Date().format("yyyy/mm/dd"),"d");
			if(d >= 1)
			{
				CC.alert(Lang.Mail.ConfigJs.reply_DateErrMsg);
				return;
			}
		}
		else
		{
			beginTime = 0;
			endTime = 0;
		}	
	}
	var data={
			auto_replay_status:auto_replay_status,
			//auto_replay_content:auto_replay_content.toCData(),
			auto_replay_content:auto_replay_content,
			auto_replay_starttime:beginTime,
			auto_replay_endtime:endTime
			};
	
	p.ajaxRequest(p.attrs.save.func, data, function(ao){
				p.ok(Lang.Mail.ConfigJs.autoRepleySuc)
			}, function(ao){
				p.fail(Lang.Mail.ConfigJs.filter_saveFail,d);
			});

	/*
var postData = {
		func : p.attrs.save.func,
		data : data,
		url  : gConst.reqUrl,
		call : function(ao){
			p.ok(Lang.Mail.ConfigJs.autoRepleySuc);
		},
		failCall : function(ao){
			p.fail(Lang.Mail.ConfigJs.filter_saveFail,d);
		}
	};

	var url = gConst.reqUrl+"?func=" + p.attrs.save.func + "&sid=" + gMain.sid;
	MM.post(url,data, function(ao){
			p.ok(Lang.Mail.ConfigJs.autoRepleySuc)
		},"");*/
};
/**
 * 
 * @param {Object} no_checkEmpty 不检查是否为空
 */
autoReply.check = function(checkEmpty){
    var elRF = this.getFormatValue("auto_replay_status");
    var elAC = this.getEl("auto_replay_content");
    var txt =  elAC.value.replace(/^[ \t\n\r]+/g, "").replace(/[ \t\n\r]+$/g, "");//RTB_items["option_auto_replay_content"].getEditorValue();
    //if(txt) txt = txt.unescapeHTML().trim().replace(/ /g, "");
    if (checkEmpty && elRF == 1 && txt == '') {
        CC.alert(Lang.Mail.ConfigJs.InputReplayContent);	
        return false;
    }
	
	 if(txt.len()>gConst.autoRepaly_max){
        CC.alert(Lang.Mail.ConfigJs.reply_length_limit);
		elAC.value = txt.substring(0,gConst.autoRepaly_max);	
		return false;
     }
    return true;
};
autoReply.loadEvent = function(){
	var status0 = $("option_auto_replay_status0");
	var status1 = $("option_auto_replay_status1");	
	var p		= this;
	
	var statusFunc = function(){
		jQuery("#autoReplyWrapper").find("input[type='checkbox']").each(function(){
			if (status1.checked) {
				jQuery(this).removeAttr("disabled");				
			}
			else if (status0.checked) {
				jQuery(this).attr("disabled", "disabled");
			}
		});
		jQuery("#autoReplyWrapper").find("select").each(function(){
			if (status1.checked) {
				jQuery(this).removeAttr("disabled");				
			}
			else if (status0.checked) {
				jQuery(this).attr("disabled", "disabled");
			}
		});
		
        
        if (status1.checked) {
            //RTB_items['option_auto_replay_content'].enable();
            jQuery("#option_auto_replay_content").removeAttr("disabled");
            
        }
        else 
            if (status0.checked) {
                //RTB_items['option_auto_replay_content'].disable();
           	jQuery("#option_auto_replay_content").attr("disabled", "disabled");
        }
		
	};
	statusFunc();
	status0.onclick=function(){statusFunc();};
	status1.onclick=function(){statusFunc();};	
	
	jQuery("#option_auto_replay_content").keyup(function(){
		p.check(false);
	});
};






