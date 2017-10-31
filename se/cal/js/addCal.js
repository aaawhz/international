var contact = null;


/***
 * @description 添加页面
 * @auth tangl
 */
var AddCal = {
	CalId : "", //日程ID
	PostURL : "/cal/usercal.do", //ajax post请求URL
	CurDate : "", //当前时间	
	/**
	 * 数据加载事件
	 */
	Load: function(){		
		this.CalId = GC.getUrlParamValue(location.href, "cid");
		var cdate =	GC.getUrlParamValue(location.href,"date"); 
		if (cdate) {
			this.CurDate = cdate;
		}
		else {
			this.CurDate = initDate.curDate;
		}
		$("#txt_content").attr("maxlength",config.maxEventContentLength);
		$("#txtMaxLength").html(config.maxEventContentLength);
		this.InitDefaultValue();
		
		if (this.CalId.length > 0) {
			var postdata = {
				"calId": this.CalId
			}
			this.Ajax("cal:byCalId", postdata, this.LoadCalData);
		}
	},
	/**
	 * 添加默认值填充
	 */
	InitDefaultValue: function(){		
		var txtvalue = GC.getUrlParamValue(location.href,"c");
		$("#txt_content").val(unescape(txtvalue));				
		$("#txtCurLength").html(config.maxEventContentLength- txtvalue.length);
		
		var date = new Date(this.CurDate.replace(/-/g, "/"));
		$("#txt_BeginDate").val(this.CurDate);
		$("#txt_EndDate").val(this.CurDate);			
		$("#beginMonth").val(date.format("mm"));
		$("#endMonth").val(date.format("mm"));	
		$("#beginDay").val(date.format("dd"));
		$("#endDay").val(date.format("dd"));
		
		var begintime = GC.getUrlParamValue(location.href,"b");
		var endtime = GC.getUrlParamValue(location.href,"e");
		if (begintime && endtime) {
			$("#beginTime").val(begintime);
			$("#endTime").val(endtime);
			$("#beforeTime").val(GC.getUrlParamValue(location.href,"tq"));
		}
		else {
			var cur_Time = new Date();
			var nextHours = parent.Util.DateAdd("h", 1, new Date(cur_Time.format("yyyy/mm/dd HH:00:00")));
			var hoursnumber = parent.Util.DateDiffMore(cur_Time,nextHours,"n");
			var curHours =1;
			var nextDate = parent.Util.DateAdd("h", 1, cur_Time);
			if(hoursnumber > 30){
				//curHours++;
				$("#beginTime").val(nextDate.format("HH:00"));
				$("#endTime").val(nextDate.format("HH:30"));
			}else{				
				$("#beginTime").val(nextDate.format("HH:30"));
				nextDate = parent.Util.DateAdd("h", 2, cur_Time);
				$("#endTime").val(nextDate.format("HH:00"));
			}
		}
	},
	/**
	 * 修改默认值填充
	 * @param {Object} data
	 */
	LoadCalData: function(data){
		if(data.code == "S_OK"){
			var d = data["var"].calEventInfo;
			//AddCal.JsonData = d;
			$("#txt_content").val(d.eventContent.decodeHTML());
			$("#txtCurLength").html(config.maxEventContentLength- d.eventContent.length);
			var isdayevent = d.isDayEvent =="Y";			
			$("#cb_isDayEvent").attr("checked",isdayevent);
			$("#RepeatType").val(d.repeatType);
			if(d.repeatType == "1"){
				if(!isdayevent){
					var rValue = d.repeatValue.split("&nbsp;");
					$("#beginTime").val(rValue[0]);
					$("#endTime").val(rValue[1]);
				}
			}		
			else if(d.repeatType == "2"){
				var rValue = d.repeatValue.split(",");				
				if (!isdayevent) {
					var templist = rValue[rValue.length - 1].split("&nbsp;");
					var btime = templist[1];
					var etime = templist[2];
					rValue[rValue.length - 1] = templist[0];
					$("#beginTime").val(btime);
					$("#endTime").val(etime);		
				}			
				for(var i=0;i<rValue.length;i++){
					$("input[name='week'][value='{0}']".format(rValue[i])).attr("checked","checked");
				}	
			}
			else if(d.repeatType == "3"){
				var rValue = d.repeatValue.split(",");
				if (!isdayevent) {
					var tempblist = rValue[0].split("&nbsp;");
					var tempelist = rValue[1].split("&nbsp;");
					var bday = tempblist[0];
					var btime = tempblist[1];
					var eday = tempelist[0];
					var etime = tempelist[1];
					rValue[0] = bday;
					rValue[1] = eday;
					$("#beginTime").val(btime);
					$("#endTime").val(etime);		
				}
				$("#beginDay").val(rValue[0]);
				$("#endDay").val(rValue[1]);	
			}
			else if(d.repeatType == "4"){
				var rValue = d.repeatValue.split(",");
				if (!isdayevent) {
					var tempblist = rValue[0].split("&nbsp;");
					var tempelist = rValue[1].split("&nbsp;");
					var bday = tempblist[0];
					var btime = tempblist[1];
					var eday = tempelist[0];
					var etime = tempelist[1];
					rValue[0] = bday;
					rValue[1] = eday;
					$("#beginTime").val(btime);
					$("#endTime").val(etime);		
				}
				$("#beginMonth").val(rValue[0].substr(0,2));
				$("#endMonth").val(rValue[1].substr(0,2));	
				$("#beginDay").val(rValue[0].substr(2));
				$("#endDay").val(rValue[1].substr(2));	
			}	
			else{
				var begintime =  new Date(d.beginTime.replace(/-/g, "/"));	
				var endtime =  new Date(d.endTime.replace(/-/g, "/"));	
				$("#txt_BeginDate").val(begintime.format("yyyy-mm-dd"));					
				$("#txt_EndDate").val(endtime.format("yyyy-mm-dd"));
				if(!isdayevent)	{
					$("#beginTime").val(begintime.format("HH:nn"));
					$("#endTime").val(endtime.format("HH:nn"));
				}				
			}			
			
			$("#beforeTime").val(d.beforeMinutes);
			if(d.noticeType == "4" || d.noticeType == "5" || d.noticeType == "6" || d.noticeType == "7"){
				$("#noticeMy").attr("checked","checked");
			}
			
			if(d.notifyMobileNums){
				$("#txt_SmsNotice").val(d.notifyMobileNums);		
				$("#sendSms").attr("checked","checked");		
				$("#sendAll").attr("checked","checked");
				$("#sendNotice").show();
			}else{
				$("#psms").hide();
			}
			
			if(d.notifyEmailAddrs){
				$("#txt_MailNotice").val(d.notifyEmailAddrs);		
				$("#sendMail").attr("checked","checked");		
				$("#sendAll").attr("checked","checked");
				$("#sendNotice").show();
			}else{
				$("#pmail").hide();
			}
			AddCal.Repeat(d.repeatType,isdayevent);
			
		}		
	},	
	/**
	 * 全天事件 HTML元素的操作
	 * @param {Object} isdayevent 是否全天事件 true,false
	 */
	DayEvent: function(isdayevent){		
		if(isdayevent){
			$("#beginTime").hide();
			$("#endTime").hide();
			$("#labTo").hide();			
		}else{
			$("#beginTime").show();
			$("#endTime").show();
			$("#labTo").show();
		}
	},
	/**
	 * 重复事件 HTML 元素操作
	 * @param {Object} repeattype 重复事件类别
	 * @param {Object} isdayevent 是否全天事件
	 */
	Repeat: function(repeattype,isdayevent){		
		var temp =  document.getElementById("cb_isDayEvent").checked;
		repeattype = repeattype || $("#RepeatType").val();
		if (typeof(isdayevent) == "undefined" || isdayevent.length == 0) {
			isdayevent = temp;
		}
        
        if (repeattype == "1") { //1：每天；
            this.DayRepeat(isdayevent);
        }
        else if (repeattype == "2") {//2：每周；
            this.WeekRepeat(isdayevent);
      	}
        else if (repeattype == "3") { //3：每月的几号到几号；
            this.MonthRepeat(isdayevent);
        }
        else if (repeattype == "4") { //4：每年的几月几号	到几月几号。
            this.YearRepeat(isdayevent);
        }
        else {			
			this.HideWarnTimeDom();
            this.DayEvent(isdayevent);			
			$("#span_BeginDate").show();
			$("#span_EndDate").show();
            $("#showTime").hide();     
			$("#labTo").show();     
        }
	},
	/**
	 * 每天重复事件 
	 * @param {Object} isdayevent
	 */
	DayRepeat:function(isdayevent){		
		begintime = $("#beginTime").val();
		endtime = $("#endTime").val();
		this.HideWarnTimeDom();
		this.DayEvent(isdayevent);
	
		$("#showTime").show();
		var msg  = addLang.perDay; // "每天 ";
		if(!isdayevent){
			msg += "{0}{2} {1}".format(begintime,endtime,addLang.to);
		}
			
		$("#showTime").html(msg);
	},
	/**
	 * 每周重复事件
	 * @param {Object} isdayevent
	 */
	WeekRepeat: function(isdayevent){
		var list = $("input[name='week']:checked");
		var weekStr = "";
		
		for(var i=0; i < list.length;i++){
			weekStr += $(list[i]).next().html()+"、";
		}
		if(weekStr.length > 0){
			weekStr = weekStr.substr(0,weekStr.length -1);
		}
		this.HideWarnTimeDom();
		this.DayEvent(isdayevent);		
		
		$("#showWeek").show();
		$("#showTime").show();
		if (weekStr) {
			if (isdayevent) {
				$("#showTime").html("{1} {0} ".format(weekStr,addLang.perWeek));
			}else{
				$("#showTime").html("{3} {0}{1}{4}{2} ".format(weekStr,$("#beginTime").val(),$("#endTime").val(),addLang.perWeek,addLang.to));
			}
		}else
		{			
			$("#showTime").hide();
		}
	},
	/**
	 * 每月重复事件
	 * @param {Object} isdayevent
	 */
	MonthRepeat: function(isdayevent){
		this.HideWarnTimeDom();
		this.DayEvent(isdayevent);		
		
		$("#beginDayDiv").show();
		$("#endDayDiv").show();
		$("#showTime").show();
		$("#labTo").show();
		var beginday = $("#beginDay").val();
		var endday = $("#endDay").val();
		var msg  = "{2}{0}{3}{4}{1}{3}".format(beginday,endday,addLang.perMonth,addLang.day,addLang.to);
		if(addLang.lang_cookie == "en_US"){
			msg = "{0}{1}{2}{3}".format(addLang.perMonth,CalCommon.getDay(beginday, addLang.lang_cookie),addLang.to,CalCommon.getDay(endday, addLang.lang_cookie));
		}
		if(!isdayevent){
			msg  = "{4}{0}{5}{2}{6}{1}{5}{3}".format(beginday,endday,$("#beginTime").val(),$("#endTime").val(),
			addLang.perMonth,addLang.day,addLang.to);
			if(addLang.lang_cookie == "en_US"){
				msg = "{0}{1}{2}{3}{4}{5}{6}{7}".format(addLang.perMonth,CalCommon.getDay(beginday, addLang.lang_cookie)," ",$("#beginTime").val(),
						addLang.to,CalCommon.getDay(endday, addLang.lang_cookie)," ",$("#endTime").val());
			}					
		}		
		$("#showTime").html(msg);
	},
	/**
	 * 每年重复事件
	 * @param {Object} isdayevent
	 */
	YearRepeat: function(isdayevent){
		this.HideWarnTimeDom();
		this.DayEvent(isdayevent);
		$("#beginMonthDiv").show();
		$("#endMonthDiv").show();
		$("#beginDayDiv").show();
		$("#endDayDiv").show();
		$("#showTime").show();
		$("#labTo").show();
		var beginmonth = $("#beginMonth").val();
		var endmonth = $("#endMonth").val();
		var beginday = $("#beginDay").val();
		var endday =  $("#endDay").val();
		
		var msg  = "{4}{0}{5}{1}{6}{7}{2}{5}{3}{6}".format(beginmonth,beginday,endmonth,endday,
		addLang.perYear,addLang.month,addLang.day,addLang.to);		
		if(addLang.lang_cookie == "en_US"){
			msg = "{0}{1}{2}{3}{4}{5}{6}{7}".format(addLang.perYear,CalCommon.getMonth(beginmonth, addLang.lang_cookie)," ",CalCommon.getDay(beginday, addLang.lang_cookie),
					addLang.to,CalCommon.getMonth(endmonth, addLang.lang_cookie)," ",CalCommon.getDay(endday, addLang.lang_cookie));
		}
		
		if(!isdayevent){
			var beginTime =$("#beginTime").val();
			var endTime =$("#endTime").val();
			var temp1 = "{0}{1}{2}{3}{4}{5}".format(addLang.perYear,beginmonth,addLang.month,beginday,addLang.day,beginTime);
			var temp2= "{0}{1}{2}{3}{4}{5}".format(addLang.to,endmonth,addLang.month,endday,addLang.day,endTime);			
			if(addLang.lang_cookie == "en_US"){
				temp1 = "{0}{1}{2}{3}{4}{5}".format(addLang.perYear,CalCommon.getMonth(beginmonth, addLang.lang_cookie)," ",CalCommon.getDay(beginday, addLang.lang_cookie)," ",beginTime);
				temp2= "{0}{1}{2}{3}{4}{5}".format(addLang.to,CalCommon.getMonth(endmonth, addLang.lang_cookie)," ",CalCommon.getDay(endday, addLang.lang_cookie)," ",endTime);
			}
			
			msg = temp1 + temp2;			
		}		
		$("#showTime").html(msg);
	},
	/**
	 * 隐藏重复事件相关的HTML元素
	 */
	HideWarnTimeDom:function(){
		$("#span_BeginDate").hide();
		$("#beginMonthDiv").hide();
		$("#beginDayDiv").hide();
		$("#beginTime").hide();
		$("#span_EndDate").hide();
		$("#endMonthDiv").hide();
		$("#endDayDiv").hide();
		$("#endTime").hide();
		$("#showTime").hide();
		$("#showWeek").hide();
		$("#labTo").hide();
	},	
	/**
	 * 添加日程
	 */
	AddCal: function(){		
		var eventContent = $("#txt_content").val().replace(/	/g, "  ");
		if(!eventContent){
			parent.CC.alert(addLang.eventContentNull);
			return;
		}
		var isDayEvent = document.getElementById("cb_isDayEvent").checked;  	
		var repeatType = $("#RepeatType").val();		
		var isDayEventStr= isDayEvent?"Y":"N";
		var isRepeatStr = repeatType != "0" ? "Y":"N";
		var beginTime = $("#beginTime").val();
		var endTime = $("#endTime").val();
		var beginDate ="";
		var endDate ="";
		var repeatValue = "";
		var isSend = "N";
		var beforeMinutes = $("#beforeTime").val();
		
		if(repeatType == "0"){
			beginDate ="{0} {1}:00".format($("#txt_BeginDate").val(),$("#beginTime").val());
			endDate = "{0} {1}:00".format($("#txt_EndDate").val(),$("#endTime").val());	
			var selectBDT = parent.Util.parseDate(beginDate.replace(/-/g, "/"));
			var selectEDT = parent.Util.parseDate(endDate.replace(/-/g, "/"));
			var mCount = parent.Util.DateDiffMore(selectBDT,selectEDT,"n");
			
			if(mCount < 0){
				parent.CC.alert(addLang.beginMoreEndDate);			
				return;
			}		
			
			var initDT = new Date(); 
			var dateCount = parent.Util.DateDiffMore(initDT,selectBDT,"n");
			if(dateCount >= parseInt(beforeMinutes)){			
				isSend = "Y";				
			}else{
				isSend = "N";
				parent.CC.alert(addLang.noSendAlter);
			}			
			
		}
		else if(repeatType == "1"){
			if(!isDayEvent){
				repeatValue = "{0} {1}".format(beginTime,endTime);					
			}			
		}
		else if(repeatType == "2"){
            var list = $("input[name='week']:checked");
            var weekStr = "";
            for (var i = 0; i < list.length; i++) {
                weekStr += list[i].value + ",";
            }
            if (weekStr.length > 0) {
                weekStr = weekStr.substr(0, weekStr.length - 1);
            }
			else{
				parent.CC.alert(addLang.selectWeek);
				return;
			}
			
			if(isDayEvent){				
				repeatValue = weekStr;
			}
			else{
				repeatValue = "{0} {1} {2}".format(weekStr,beginTime,endTime);
			}
		}
		else if(repeatType == "3"){
			var beginDay = $("#beginDay").val();
			var endDay = $("#endDay").val();			
			if (isDayEvent) {
				repeatValue = beginDay + ","+endDay;
			}
			else{
				repeatValue = "{0} {1},{2} {3}".format(beginDay,beginTime,endDay,endTime)
			}
		}
		else if(repeatType == "4"){
			var beginMonth = $("#beginMonth").val();
			var endMonth = $("#endMonth").val();
			var beginDay = $("#beginDay").val();
			var endDay = $("#endDay").val();	
			var beginDateTime = new Date().getFullYear()+"/"+beginMonth+"/"+beginDay;
			var endDateTime = new Date().getFullYear()+"/"+beginMonth+"/"+beginDay;			
			if(isDayEvent){
				var date1 = new Date(beginDateTime);
				var date2 = new Date(endDateTime);
				
				repeatValue = "{0}{1},{2}{3}".format(beginMonth,beginDay,endMonth,endDay);
			}else{
				repeatValue = "{0}{1} {2},{3}{4} {5}".format(beginMonth,beginDay,beginTime,endMonth,endDay,endTime);
			}
		}
		
		var noticeType = 0;
		var smsNotice = document.getElementById("sendSms").checked;
		var mailNotice = document.getElementById("sendMail").checked;
		var noticeMy = document.getElementById("noticeMy").checked;
		var smsNoticeUsers="";
		var mailNoticeUsers ="";
		var isSendNotice = "N";
		if(noticeMy)
		{
			isSendNotice = "Y";
		}
		
		if(smsNotice){
			smsNoticeUsers=$("#txt_SmsNotice").val();
			if(smsNoticeUsers){
				isSendNotice = "Y";
				var list = smsNoticeUsers.split(";");
				list = parent.Util.unique(list);
				smsNoticeUsers=list.join(";");
				var noList = [];
				for(var i = 0; i < list.length; i++){
					var item = list[i];
					if(item)
					{
						if(!parent.Vd.checkData("mobile",item)){
							noList.push(item);							
						}							
					}
				}
				if(noList.length > 0){
					parent.CC.alert("{0}{1}".format(noList.join(","),addLang.noMobile));
					return;
				}
			}else{
				smsNotice = false;
			}
		}		
		if(mailNotice){
			mailNoticeUsers=$("#txt_MailNotice").val();
			if(mailNoticeUsers){
				isSendNotice = "Y";
				var list = mailNoticeUsers.split(";");
				list = parent.Util.unique(list);
				mailNoticeUsers=list.join(";");
				var noList = [];
				for(var i = 0; i < list.length; i++){
					var item = list[i];
					if(item)
					{
						if(!parent.Vd.checkData("email",item)){
							noList.push(item);							
						}							
					}
				}
				if(noList.length > 0){
					parent.CC.alert("{0}{1}".format(noList.join(","),addLang.noEmail));
					return;
				}
			}
			else{
				mailNotice = false;
			}
		}
		if(repeatType == "0"){
			isSendNotice = isSend;
		}
		
		
		if (isSendNotice == "Y") {
			if(smsNotice && mailNotice && noticeMy){
				noticeType = 4;
			}
			else if(smsNotice && mailNotice && !noticeMy){
				noticeType = 1;
			}
			else if(smsNotice && !mailNotice && !noticeMy){
				noticeType = 2;
			}
			else if(!smsNotice && mailNotice && !noticeMy){
				noticeType = 3;
			}
			else if(smsNotice && !mailNotice && noticeMy){
				noticeType = 5;
			}
			else if(!smsNotice && mailNotice && noticeMy){
				noticeType = 6;
			}
			else if(!smsNotice && !mailNotice && noticeMy){
				noticeType = 7;
			}
		}
		
		if(noticeType == 0){
			isSendNotice= "N";
		}
		
		
		
		var operate = this.CalId ? "update" : "add";
        var postdata = {
            "operate": operate,
            "eventFlag": "1",
            "eventContent": eventContent,
            "beginTime": beginDate,
            "endTime": endDate,
            "isDayEvent": isDayEventStr,
            "isRepeat": isRepeatStr,
            "repeatType": repeatType,
            "repeatValue": repeatValue,
            "isSendNotice": isSendNotice,
            "noticeType": noticeType,
            "noticeTimeFlag": "2",
            "sendTime": "",
            "beforeMinutes": beforeMinutes,
            "notifyMobileNums": smsNoticeUsers,
            "notifyEmailAddrs": mailNoticeUsers
        };
		
		if(operate == "update"){
			postdata.calId = this.CalId;
		}
		
		var callback = function(data){
			if(data.code=="S_OK"){				
				if($.browser.msie){
					history.back(-1);
				}else{
					location.href = document.referrer;
				}
			}
		}
		this.Ajax("cal:add", postdata, callback);
		
	},
	/**
	 * 月下拉框联动事件
	 * @param {Object} obj 当前下拉框
	 */
	SelectMonth: function(obj){		
        var month = obj.value;
		var monthTxt = $(obj).find("option:selected").text();     
		var cdate = new Date(this.CurDate.replace(/-/g, "/"));
		var dayCount = new Date(cdate.format("yyyy"),monthTxt,0).getDate();
		var objName = "";
		if(obj.id == "beginMonth"){
			objName = "beginDay";
		}else
		{
			objName = "endDay";
		}
		var objDay = $("#"+objName);
		var selected = objDay.val();
		objDay.empty();
		for(var i = 1; i <= dayCount; i++){
			var doubleValue = i < 10 ? "0"+i : i;
			objDay.append("<option value='{0}'>{1}</option>".format(doubleValue,i));
		}
		objDay.val(selected);
	},	
	/*
	 * 显示/隐藏 通知类型事件
	 */
	ShowNotice: function(t,obj){
		if(t=="all"){
			if(obj.checked){
				$("#sendNotice").show();
				$("#psms").show();
				$("#pmail").show();
				
				$("#sendSms").attr("checked",true);
				$("#sendMail").attr("checked",true);
			}else{
				$("#sendSms").attr("checked",false);
				$("#sendMail").attr("checked",false);
				$("#sendNotice").hide();				
			}
		}
		else if(t == "sms"){
			if(obj.checked){
				$("#psms").show();
			}else{
				$("#psms").hide();
			}
		}
		else if(t == "mail"){
			if(obj.checked){
				$("#pmail").show();
			}else{
				$("#pmail").hide();
			}
		}
	},	
	/**
	 * 手机号码与邮箱地址文本框失去焦点事件,作用:清除重复数据
	 * @param {Object} obj 当前文本框
	 */
	TextOnBlur: function(obj){
		var val = obj.value.replace(/ |　/g,"");
		if (!val) {
			return;
		}	
		var list = val.split(";");
		list = parent.Util.unique(list);
		obj.value=list.join(";")+";";		
	},
	TextKeyDown: function(obj){
		 $(obj).keydown(function(e){
            var curKey = e.which;
            if (curKey == 13) {
               	AddCal.TextOnBlur(this);
                return false;
            }
        });
	},
	OpenAddr:function(t){
		//parent.contact.type=t;
		//parent.contact.inItContanct("calAddr",["0","2"],AddCal.AddrFrmOk,null);		
		contact = new parent.Contact("window.frames['ifrm_outLink_cal'].contact");
		contact.groupMap = parent.LMD.groupMap;
		contact.group_contactListMap = parent.LMD.group_contactListMap_mail;
		contact.type=t;
		
		contact.inItContanct("calAddr",["0","2"],AddCal.AddrFrmOk,null);
	},
	AddrFrmOk:function(data){
		var d = data;
		var v = "";
		for(var i=0;i <d.length;i++){
			var temp = d[i].value.decodeHTML();
			if(temp || temp.lastIndexOf("<") > -1 || temp.lastIndexOf(">") > -1 ){
				var index =temp.lastIndexOf("<")+1;
				var le = temp.lastIndexOf(">") - index;
				temp = temp.substr(index,le);
				v += temp +";";
			}			
		}
		
		if(contact.type == "3"){
			$("#txt_MailNotice").val($("#txt_MailNotice").val()+v);
			AddCal.TextOnBlur(document.getElementById("txt_MailNotice"));
		}else{
			$("#txt_SmsNotice").val($("#txt_SmsNotice").val()+v);
			AddCal.TextOnBlur(document.getElementById("txt_SmsNotice"));
		}
	},
	/**
     * Ajax请求
     * @param {Object} func
     * @param {Object} data
     * @param {Object} callback
     */
    Ajax: function(func, data, callback){
        parent.MM.doService({
            url: AddCal.PostURL,
            func: func,
            data: data,
            failCall: function(d){
                if (d.summary) 
                    parent.CC.alert(d.summary);
            },
            call: function(d){
                callback(d)
            },
            param: ""
        });
    }	
}
