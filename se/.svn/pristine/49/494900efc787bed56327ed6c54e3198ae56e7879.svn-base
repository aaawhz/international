/***
 * @description 日程提醒月视图
 * @auth tangl
 */
(function($){
	var Cal = {
    CurDate: "2012/07/09", //当前日期
    CurSelectedItem: {
        Id: 0,
        Date: "2012/07/05"
    }, //当前用户选中项
   	CurPageIndex: 1, //当前页码
    IsBodyOnClick: false, //是否body的点击
    IsHideAddCalFrm: false,//是否隐藏添加日程窗口   
    CurItemRowCount: 4,//当前日历项显示内容的行数
    CurItemRowIndex: 0,//当前选中项的行标
   	JsonData : null,//数据集	
   	PostURL : "/cal/usercal.do",
	PositionItem :{
		1 : {r:1,c:1,p:"l"},2:{r:1,c:2,p:"l"},3:{r:1,c:3,p:"l"},4:{r:1,c:4,p:"l"},5:{r:1,c:5,p:"r"},6:{r:1,c:6,p:"r"},7:{r:1,c:7,p:"r"},
		8 : {r:2,c:1,p:"l"},9:{r:2,c:2,p:"l"},10:{r:2,c:3,p:"l"},11:{r:2,c:4,p:"l"},12:{r:2,c:5,p:"r"},13:{r:2,c:6,p:"r"},14:{r:2,c:7,p:"r"},
		15 : {r:3,c:1,p:"l"},16:{r:3,c:2,p:"l"},17:{r:3,c:3,p:"l"},18:{r:3,c:4,p:"l"},19:{r:3,c:5,p:"r"},20:{r:3,c:6,p:"r"},21:{r:3,c:7,p:"r"},
		22 : {r:4,c:1,p:"l"},23:{r:4,c:2,p:"l"},24:{r:4,c:3,p:"l"},25:{r:4,c:4,p:"l"},26:{r:4,c:5,p:"r"},27:{r:5,c:6,p:"r"},28:{r:4,c:7,p:"r"},
		29 : {r:5,c:1,p:"l"},30:{r:5,c:2,p:"l"},31:{r:5,c:3,p:"l"},32:{r:5,c:4,p:"l"},33:{r:5,c:5,p:"r"},34:{r:6,c:6,p:"r"},35:{r:5,c:7,p:"r"},
		36 : {r:6,c:1,p:"l"},37:{r:6,c:2,p:"l"},38:{r:6,c:3,p:"l"},39:{r:6,c:4,p:"l"},40:{r:6,c:5,p:"r"},41:{r:7,c:6,p:"r"},42:{r:6,c:7,p:"r"}
	},//固定位置
	ChDay:{
		1:"",2:"初二",3:"初三",4:"初四",5:"初五",6:"初六",7:"初七",8:"初八",9:"初九",10:"初十",
		11:"十一",12:"十二",13:"十三",14:"十四",15:"十五",16:"十六",17:"十七",18:"十八",19:"十九",20:"廿十",
		21:"廿一",22:"廿二",23:"廿三",24:"廿四",25:"廿五",26:"廿六",27:"廿七",28:"廿八",29:"廿九",30:"三十"
	},//农历日
	ChMonth:{
		1:"一月",2:"二月",3:"三月",4:"四月",5:"五月",6:"六月",7:"七月",8:"八月",9:"九月",10:"十月",11:"十一月",12:"十二月"
	},//农历月
	/**
	 * 页面数据加载事件
	 */	
    Load: function(){
		
		var cdate =	GC.getUrlParamValue(location.href,"date"); 
		if (cdate) {
			this.CurDate = cdate;
		}
		else {
			this.CurDate = initDate.curDate;
		}		
		//var postDate = new Date(this.CurDate.replace(/-/g, "/"));
		var postDate = parent.Util.parseDate(this.CurDate.replace(/-/g, "/"));
		var postdata = {"calMonth": postDate.format("yyyy-mm")};
		this.Ajax("cal:byMonth", postdata, this.Init);
		
    },
	/**
	 * 页面HTML组装事件
	 * @param {Object} data
	 */
	LoadHTML: function(data){
		var html = [];		
        var json = data;//加载数据        
		var data = json["var"].calMonthList;
		this.JsonData = data;
		
		if(data.length == 42){
			//this.CurItemRowCount = 3;
			//$("#div_content").css("height","460")
		}else
		{
			$("#last_border").hide();
		}
		var cdate =parent.Util.parseDate(this.CurDate.replace(/-/g, "/"));		
		$("#curCalDate").html(cdate.format(calLang.dateFormatYM));		
		
        for (var i = 1; i <= data.length; i++) {
            if (i == 1 || ((i - 1) % 7 == 0)) {
                html.push('<div class="week_line"><table><tbody><tr>');
                html.push('<td class="week_1st_td weekend " onclick="Cal.CalOnClick(' + i + ');">');
            }
            else if (i % 7 == 0) {
			  	html.push('<td class="week_last_td weekend" onclick="Cal.CalOnClick(' + i + ');">');
            }
            else {
                html.push('<td onclick="Cal.CalOnClick(' + i + ');">');
            }
            
            html.push(this.GetCalHtml(i,data[i-1]));
            html.push('</td>');
            
            if (i % 7 == 0) {
                html.push('</tr></tbody></table></div>');
            }
        }
        $("#calList_Div").html(html.join(""));
		$("#div_content").css("height","570px");
		/*
		$("#addCalDiv").attr("onclick","Cal.AddCalFrmOnClick()");		
		var frame_resize = function(){
			var v = 90;
			if(Cal.CurItemRowCount == 3){
				v = v+90;
			}
			$('#div_content').height($(this).height()-v);			
		}
		frame_resize();
		this.AdaptiveHeight();
		window.onresize = frame_resize;
		*/
	},	
	AdaptiveHeight:function(){
        var itemcount = 35;
        if (this.CurItemRowCount == 3) {
            itemcount = 42;
        }
		
        for (var i = 1; i <= itemcount; i++) {
            var item = $("#calItem" + i);
            var itemHeigth = item.height();
            var childdiv = item.children().get(0);
            var ccdiv = $(childdiv).children().get(0);
            var ccul = $(childdiv).children().get(1);
            var itemChildHeigth = $(ccdiv).height() + $(ccul).height() - 16;
            if (itemHeigth - itemChildHeigth < 16) {
			/*
				var ulchild = $(ccul).children();
							var removeul = ulchild.get(ulchild.length - 2);
							var removeaddul = ulchild.get(ulchild.length - 2);
							$(removeul).hide();
							$(removeaddul).hide();
			*/
                $("#calItem" + i).addClass("date_overflow");
            }
	           /*
					 else {
					                $("#calItem" + i).removeClass("date_overflow");
					            }
					*/
        }
	},
	/**
	 * 加载数据
	 */
    Init: function(data){
		
		var bDate =	new Date(initDate.beginDate.replace(/-/g, "/")); 
		var eDate = new Date(initDate.endDate.replace(/-/g, "/")); 
		
		var dayCount = parent.Util.DateDiffMore(bDate,eDate,"d")+1;
		if(dayCount % 7 != 0){
			parent.CC.alert(calLang.dateFormatError);			
			return;
		}
		var curdata = {
			"code": "S_OK",
			"var": {
				"calMonthList": []
			}
		};
       
		var nextDate = bDate;
		var postdata =  data["var"].calMonthList;
		for(var i = 0;i < dayCount;i++)
		{
			var calMonthListData = {
	            "calDate": "",
	            "beanList": []
	        };      
			calMonthListData.calDate = nextDate.format("yyyy-mm-dd");
			calMonthListData.beanList = [];
			for(var j=0; j < postdata.length; j++){
				var postdate = postdata[j].calDate;
				if( postdate== nextDate.format("yyyy-mm-dd"))
				{
					calMonthListData.beanList = postdata[j].beanList;
					break;
				}
			}
			curdata["var"].calMonthList.push(calMonthListData);
			nextDate = parent.Util.DateAdd("d",1,nextDate);
		}
		Cal.LoadHTML(curdata);        
    },
	/**
	 * 跳转月份
	 * @param {Object} t 类别: 1、next 下个月或年 2、top 上个月或年
	 * @param {Object} dtype 日期类别: 1、y 年,2、m 月
	 */
	GoToDate: function(t,dtype){
		var cdate = parent.Util.parseDate(this.CurDate.replace(/-/g, "/"));
		var date = new Date();
		if(t=="next"){			
			date = parent.Util.DateAdd(dtype,1,cdate);			
		}else if(t == "top"){
			date = parent.Util.DateAdd(dtype,-1,cdate);
		}
		location.href =	"indexcal.do?sid={0}&date={1}".format(GC.getUrlParamValue(location.href,"sid"),date.format("yyyy-mm-dd"));
	},	
	/**
	 * 展示（添加/显示）日程小窗口
	 * @param {Object} index 日程项索引
	 * @param {Object} obj 被点击的html元素
	 * @param {Object} t 显示类别: add、添加日程窗口,show、显示某个日程事件窗口
	 * @param {Object} rowindex 日程事件行索引,t参数为show时有用
	 */
    ShowAddCalFrm: function(index, obj,t,rowindex){
		this.GetAddCalFrmHTML(t,index,rowindex);
        $("#addCalDiv").show(); //显示添加日程提醒窗口
        var offset = $(obj).offset(); //获取新建 按钮坐标
		var top = 25; //箭头默认top值
		$("#addCalDiv_arrow").css("top",top); //设置箭头top值
		var position = this.PositionItem[index];//获取日程项位置
		
		//添加日程提醒窗口展示
		$("#addCalDiv").attr("class", "qmbubble bubble_" + position.p);//显示左或者右
		$("#addCalDiv").css("top", offset.top - top);//显示添加日程提醒窗口top位置
		if (position.p == "l") {	//如果显示在左边
			var itemWidth = $("#calItem" + index).width();		
			$("#addCalDiv").css("left", offset.left + itemWidth);			
		}else if(position.p == "r") //显示在右边
		{			
			var addCalFrmWidth = $("#addCalDiv").width();
			var	addCalArrow = $("#addCalDiv_arrow").width();
			$("#addCalDiv").css("left",offset.left - addCalFrmWidth - addCalArrow);
		}
		
		if(position.r >=4){
			var addCalFrmeigHeight = $("#addCalDiv").height();//添加日程提醒窗口高度
			var itemHeight = $("#calItem" + index).height(); //日程项高度
			var itemTop = $("#calItem" + index).offset().top; //日程项top位置
			
			$("#addCalDiv").css("top", itemTop - addCalFrmeigHeight+itemHeight);
			$("#addCalDiv_arrow").css("top", addCalFrmeigHeight-itemHeight+ (offset.top - itemTop)-6);
		}
		        
        this.IsHideAddCalFrm = false;
    },
	/**
	 * 关闭（添加/显示）日程小窗口
	 */
    ColseAddCalFrm: function(){
    	$("#addCalDiv").hide();
    },
	/**
	 * 刷新日程项头内容
	 * @param {Object} data 当前日程项数据
	 */
	RefreshCalItemHTML: function(data){
		this.CurPageIndex = 1;
		$("#spanOther" + this.CurSelectedItem.Id).html(data.length - this.CurItemRowCount);        
        if ($("#calItem" + this.CurSelectedItem.Id).attr("class").indexOf("date_expand") == -1) {
            if (data.length > this.CurItemRowCount) {
                $("#calItem" + this.CurSelectedItem.Id).addClass("date_overflow");                
            }
			else{
				$("#calItem" + this.CurSelectedItem.Id).removeClass("date_overflow");
			}
        }
        else {
            var pageCout = parseInt(data.length / this.CurItemRowCount);
            if (data.length % this.CurItemRowCount > 0) {
                pageCout++;
            }
            this.CurPageIndex = pageCout;
        }  
		$("#monthDateUL" + this.CurSelectedItem.Id).html(this.ShowExpandPager(this.CurPageIndex, data,this.CurSelectedItem.Id));
	},
	/**
	 * 添加日程
	 */
    SaveAddCal: function(){		
		var _operate = "add";		
		var _eventFlag = "1";
		var _eventContent = $("#addCalDiv_Text").val();
		if(!_eventContent){
			parent.CC.alert(calLang.eventContentNull);			
			return;
		}		
		
		var _beginTime =$("#curDateSpan").attr("name")+" "+$("#addCalDiv_BeginTime").val();
		var _endTime =$("#curDateSpan").attr("name")+" "+$("#addCalDiv_EndTime").val();
		var _beforeMinutes = $("#addCalDiv_TQ").val();
		var _beforeMinutesStr = $("#addCalDiv_TQ").find("option:selected").text();
		
		
		var selectBDT = parent.Util.parseDate(_beginTime.replace(/-/g, "/")+":00");
		var selectEDT = parent.Util.parseDate(_endTime.replace(/-/g, "/")+":00");
		var mCount = parent.Util.DateDiffMore(selectBDT,selectEDT,"n");
		
		if(mCount < 0){
			parent.CC.alert(calLang.beginMoreEndDate);			
			return;
		}
		
				
		var initDT = new Date();
		var dateCount = parent.Util.DateDiffMore(initDT,selectBDT,"n");
		var isSendNotice = "N";
		var notifyType = 0;
		var notifySendStatus =0;		
		var beforeNotifyMsg = "{0} - {1}".format(_beginTime,_endTime);
		if(dateCount >= parseInt(_beforeMinutes)){			
			isSendNotice = "Y";
			notifyType=7;
			notifySendStatus = 1;
		}else{			
			parent.CC.alert(calLang.noSendAlter);
		}
		
		//if(parent.gMain.lang == "en_US"){
		//	beforeNotifyMsg = "{0} - {1}".format(_beginTime,_endTime);
		//}
		
        var datatemp = {
            "calId": "0",
            "eventContent": _eventContent.encodeHTML(),
            "eventTime": $("#addCalDiv_BeginTime").val(),
            "eventDetailTime": "",
            "beforeNotifyMsg": beforeNotifyMsg,
            "notifyType": notifyType,
            "notifySendStatus": notifySendStatus
        };
		this.JsonData[this.CurSelectedItem.Id-1].beanList.push(datatemp);	
		var data = this.JsonData[this.CurSelectedItem.Id-1].beanList;
		this.RefreshCalItemHTML(data);
		
		
        var postdata = {
            "operate": "add",
            "eventFlag": "1",
            "eventContent": _eventContent,
            "beginTime": _beginTime+":00",
            "endTime": _endTime+":00",
            "isDayEvent": "N",
            "isRepeat": "N",
            "repeatType": "",
            "repeatValue": "",
            "isSendNotice": isSendNotice,
            "noticeType": notifyType,
            "noticeTimeFlag": "2",
            "sendTime": "",
            "beforeMinutes": _beforeMinutes,
            "notifyMobileNums": "",
            "notifyEmailAddrs": ""        
        };
        var callback = function(data){			
			var calItem = Cal.JsonData[Cal.CurSelectedItem.Id-1].beanList;
            if (data.code == "S_OK") {
				calItem[calItem.length-1].calId = data["var"];		
				$("#addCalDiv").hide();			
            }
            else {
				calItem.splice(calItem.length-1,1);				
				Cal.RefreshCalItemHTML(calItem);
		        parent.CC.alert(data.summary);				
            }
        };
		var failback = function(data){
			var calItem = Cal.JsonData[Cal.CurSelectedItem.Id-1].beanList;
			calItem.splice(calItem.length-1,1);				
			Cal.RefreshCalItemHTML(calItem);
		    parent.CC.alert(data.summary);			
		};
		this.Ajax("cal:add",postdata,callback,failback);
		
    },
	/**
	 * 删除日程事件——警告 
	 * @param {Object} rowindex 日程事件行索引
	 */
	DeleteCalConfirm: function(rowindex){
		 this.CurItemRowIndex = rowindex;
		 parent.CC.confirm(calLang.deleteTip, Cal.DeleteCal);
	},
	/**
	 * 删除日程事件
	 */
	DeleteCal: function(){		
		var calid =Cal.JsonData[Cal.CurSelectedItem.Id - 1].beanList[Cal.CurItemRowIndex].calId;
		Cal.JsonData[Cal.CurSelectedItem.Id - 1].beanList.splice(Cal.CurItemRowIndex, 1);
		var data = Cal.JsonData[Cal.CurSelectedItem.Id - 1].beanList;
		Cal.CurPageIndex = 1;
		$("#spanOther" + Cal.CurSelectedItem.Id).html(data.length - Cal.CurItemRowCount);    
		$("#calItem" + Cal.CurSelectedItem.Id).removeClass("date_expand");        
        if (data.length <= Cal.CurItemRowCount) {
            $("#calItem" + Cal.CurSelectedItem.Id).removeClass("date_overflow");
        }
        else {
            $("#calItem" + Cal.CurSelectedItem.Id).addClass("date_overflow");
        }
		$("#monthDateUL" + Cal.CurSelectedItem.Id).html(Cal.ShowExpandPager(Cal.CurPageIndex, data, Cal.CurSelectedItem.Id));
		$("#monthDate" + Cal.CurSelectedItem.Id).html(Cal.GetCalItemHeadHTML(Cal.JsonData[Cal.CurSelectedItem.Id - 1].calDate));
		$("#addCalDiv").hide();
		
		 var postdata = {
           "calIds" : []
         };
		postdata.calIds.push(calid);
        var callback = function(data){
            if (data.code == "S_OK") {
            	location.reload();
            }
            else {
                parent.CC.alert(data.summary);
            }
        };
		Cal.Ajax("cal:delete",postdata,callback);

	},
	/**
	 * 组装（添加/显示）日程小窗口的HTML
	 * @param {Object} t 显示类别: add、添加日程窗口,show、显示某个日程事件窗口
	 * @param {Object} index 日程项索引
	 * @param {Object} rowindex 日程事件行索引
	 */
    GetAddCalFrmHTML: function(t,index,rowindex){
        var html = [];		
		var data = this.JsonData[index - 1];
        if (t == "add") {
            html.push('<div id="">');
            html.push('<div class="bubble_content">');
            html.push('<div class="event_row">');
            html.push('   <label class="event_left"><b>'+calLang.time+'</b></label>');
            html.push('   <span id="curDateSpan" name="{1}">{0}'.format(new Date(data.calDate.replace(/-/g, "/")).format(calLang.dateFormatMD),data.calDate));
            html.push('   <select id="addCalDiv_BeginTime" onchange="CalCommon.timeSelected(this)">');
			html.push(this.GetAddCalTimeHTML("b"));           
            html.push('    </select>');
            html.push('    <label>'+calLang.to+'</label>');
            html.push('    <select id="addCalDiv_EndTime" onchange="CalCommon.timeSelected(this)">');
            html.push(this.GetAddCalTimeHTML("e"));
            html.push('    </select>');
            html.push('     </span>');
            html.push('     </div>');
            html.push('   <div class="event_row">');
            html.push('     <label class="event_left"><b>'+calLang.content+'</b></label>');
            html.push('     <input id="addCalDiv_Text" class="input_text input_event" maxlength="110" name="subject" value="">');
            html.push('  </div> ');
            html.push('   <div class="event_row">');
            html.push('      <label class="event_left"><i class="alert"></i></label>');
            html.push('       <p class="c_999 cb_top" style="top:-12px;">' + calLang.eventBefore);
            html.push('     <select id="addCalDiv_TQ">');
            html.push(this.GetBeforeMinutesHTML());
            html.push('     </select>'+calLang.remindMe+'</br>');
            html.push('     <span style="padding-left:25px;_padding-left:5px;">'+calLang.addTips+'</span>');            
            html.push(getNoMoblieTip());            
            html.push('     </p>     ');
            html.push('    </div>');
            html.push('     <div class="clr"></div>');
            html.push('   </div>');
            html.push('   <div class="bubble_operate">');
            html.push('		<a href="javascript:;" onclick="Cal.GoToAddCalPage(\'add\');return false;" class="btn_gray left">{0}</a>'.format(calLang.addDetails));
            html.push('		<a href="javascript:;" onclick="Cal.SaveAddCal()" class="btn_blue">'+calLang.OK+'</a>');
            html.push('		<a href="javascript:;" onclick="Cal.ColseAddCalFrm()" class="btn_gray">'+calLang.close+'</a>');
            html.push('		<div class="clr"></div>');
            html.push('  </div>');
            html.push('  <div class="bubble_calendar menu_bd" style="display:none"></div>');
            html.push(' </div>');
            html.push(' <div class="arrow" style="top: 25px; "  id="addCalDiv_arrow">');
            html.push('  <div class="arrow_dk"></div>');
            html.push('   <div class="arrow_lt"></div>');
            html.push(' </div>');
		}else{
			data = data.beanList[rowindex];			
			html.push('<div>');
		    html.push('<div class="bubble_content event_view">');
		    html.push('  <div class="view_subject">');
		    html.push('    <h2>{0}</h2>'.format(data.eventContent));
		    html.push('    <p class="view_time b_size c_999 fz2">{0}</p>'.format(data.eventDetailTime));
		    html.push('    <p class="fz2">');
			html.push(' <span style="padding-right:8px;">{0}</span>'.format(data.beforeNotifyMsg));
			html.push(this.ShowAlterImgage(data.notifyType));
		    html.push(' </p> </div>');
		    html.push('  <div class="event_row cal_from"></div>');
		    html.push('  <div class="clr"></div>');
		    html.push('</div>');
		    html.push('<div class="bubble_operate">');
			html.push('<a class="btn_gray left" href="javascript:;" onclick="Cal.DeleteCalConfirm({0})">{1}</a>'.format(rowindex,calLang.calDelete));
			html.push('<a class="btn_blue" href="addcal.do?sid={0}&cid={1}">{2}</a>'.format(GC.getUrlParamValue(location.href,"sid"),data.calId,calLang.edit));
			html.push('<a class="btn_gray" onclick="Cal.ColseAddCalFrm()" href="javascript:;">'+calLang.close+'</a>');
		    html.push('  <div class="clr"></div>');
		    html.push('</div>');
		  	html.push('</div>');
		  	html.push('<div style="top: 25px; " class="arrow" id="addCalDiv_arrow">');
		    html.push('<div class="arrow_dk"></div>');
		    html.push('<div class="arrow_lt"></div>');
		  	html.push('</div>');
		}
       	$("#addCalDiv").html(html.join(""));        
    },
	/**
	 * 组装提醒图标
	 * @param {Object} noticeType 提醒类别
	 */
	ShowAlterImgage : function(noticeType){
		var html = [];
		var mail = '<i title="'+calLang.emailRemind+'" class="alt-mail cb_top"></i>';
		var sms = '<i title="'+calLang.smsRemind+'" class="alt-phone cb_top"></i>';
        if(noticeType == 1 || noticeType == 4 || noticeType == 7 || noticeType == 5  || noticeType == 6 )
		{
			html.push(mail);
			html.push(sms);
		}else if(noticeType == 2){
			html.push(sms);
		}else if(noticeType == 3){
			html.push(mail);
		}
		return html.join("");
	},
	/**
	 * 组装添加日程窗口里的事件事件HTML
	 * @param {Object} t 组装类别: begin、开始时间,end 结束时间
	 */
	GetAddCalTimeHTML:function(t){
		var timeList = [
			{"text":"0:00","value":"00:00","h":0,"t":"b"},{"text":"0:30","value":"00:30","h":0,"t":"e"},
			{"text":"1:00","value":"01:00","h":1,"t":"b"},{"text":"1:30","value":"01:30","h":1,"t":"e"},
			{"text":"2:00","value":"02:00","h":2,"t":"b"},{"text":"2:30","value":"02:30","h":2,"t":"e"},
			{"text":"3:00","value":"03:00","h":3,"t":"b"},{"text":"3:30","value":"03:30","h":3,"t":"e"},
			{"text":"4:00","value":"04:00","h":4,"t":"b"},{"text":"4:30","value":"04:30","h":4,"t":"e"},
			{"text":"5:00","value":"05:00","h":5,"t":"b"},{"text":"5:30","value":"05:30","h":5,"t":"e"},
			{"text":"6:00","value":"06:00","h":6,"t":"b"},{"text":"6:30","value":"06:30","h":6,"t":"e"},
			{"text":"7:00","value":"07:00","h":7,"t":"b"},{"text":"7:30","value":"07:30","h":7,"t":"e"},
			{"text":"8:00","value":"08:00","h":8,"t":"b"},{"text":"8:30","value":"08:30","h":8,"t":"e"},
			{"text":"9:00","value":"09:00","h":9,"t":"b"},{"text":"9:30","value":"09:30","h":9,"t":"e"},
			{"text":"10:00","value":"10:00","h":10,"t":"b"},{"text":"10:30","value":"10:30","h":10,"t":"e"},
			{"text":"11:00","value":"11:00","h":11,"t":"b"},{"text":"11:30","value":"11:30","h":11,"t":"e"},
			{"text":"12:00","value":"12:00","h":12,"t":"b"},{"text":"12:30","value":"12:30","h":12,"t":"e"},
			{"text":"13:00","value":"13:00","h":13,"t":"b"},{"text":"13:30","value":"13:30","h":13,"t":"e"},
			{"text":"14:00","value":"14:00","h":14,"t":"b"},{"text":"14:30","value":"14:30","h":14,"t":"e"},
			{"text":"15:00","value":"15:00","h":15,"t":"b"},{"text":"15:30","value":"15:30","h":15,"t":"e"},
			{"text":"16:00","value":"16:00","h":16,"t":"b"},{"text":"16:30","value":"16:30","h":16,"t":"e"},
			{"text":"17:00","value":"17:00","h":17,"t":"b"},{"text":"17:30","value":"17:30","h":17,"t":"e"},
			{"text":"18:00","value":"18:00","h":18,"t":"b"},{"text":"18:30","value":"18:30","h":18,"t":"e"},
			{"text":"19:00","value":"19:00","h":19,"t":"b"},{"text":"19:30","value":"19:30","h":19,"t":"e"},
			{"text":"20:00","value":"20:00","h":20,"t":"b"},{"text":"20:30","value":"20:30","h":20,"t":"e"},
			{"text":"21:00","value":"21:00","h":21,"t":"b"},{"text":"21:30","value":"21:30","h":21,"t":"e"},
			{"text":"22:00","value":"22:00","h":22,"t":"b"},{"text":"22:30","value":"22:30","h":22,"t":"e"},
			{"text":"23:00","value":"23:00","h":23,"t":"b"},{"text":"23:30","value":"23:30","h":23,"t":"e"}
		];
		
		var html = [];
		var cur_Time = new Date();	
		var curHours = new Date().getHours()+1;	
		var nextHours = parent.Util.DateAdd("h", 1, new Date(cur_Time.format("yyyy/mm/dd HH:00:00")));
		var hoursnumber = parent.Util.DateDiffMore(cur_Time,nextHours,"n");
		var tempHours= curHours;
		if(hoursnumber < 30){
			tempHours++;
		}
		for(var i = 0;i < timeList.length;i++){
			var item = timeList[i];
			if (tempHours != curHours) {
				
				if(curHours == item.h && item.t =="e" && t=="b"){
					html.push('<option selected="selected" value="{1}">{0}</option>'.format(item.text, item.value));
				}else if(tempHours == item.h && item.t=="b" && t=="e"){
					html.push('<option selected="selected" value="{1}">{0}</option>'.format(item.text, item.value));
				}			
				else{
					html.push('<option value="{1}">{0}</option>'.format(item.text, item.value));
				}
			}
			else {
				if (curHours == item.h && t == item.t) {
					html.push('<option selected="selected" value="{1}">{0}</option>'.format(item.text, item.value));
				}
				else {
					html.push('<option value="{1}">{0}</option>'.format(item.text, item.value));
				}
			}
		}
				
		return html.join("");
	},
	/**
	 * 组装日程事件提前时间的HTML
	 */
	GetBeforeMinutesHTML: function(){
		var getmin = function(t,val){
			var retmin = 0;
			if(t == "m"){
				retmin = val;
			}
			else if(t == "h"){
				retmin = val*60;
			}
			else if(t == "d"){
				retmin = val*60*24;
			}
			return retmin;
		};
		var html = [];
		html.push('<option value="{0}">5{1}</option>'.format(getmin("m",5),calLang.minute));
		html.push('<option value="{0}" selected="selected">15{1}</option>'.format(getmin("m",15),calLang.minute));
		html.push('<option value="{0}">30{1}</option>'.format(getmin("m",30),calLang.minute));
		html.push('<option value="{0}">1{1}</option>'.format(getmin("h",1),calLang.hour));
		html.push('<option value="{0}">2{1}</option>'.format(getmin("h",2),calLang.hour));
		html.push('<option value="{0}">3{1}</option>'.format(getmin("h",3),calLang.hour));
		html.push('<option value="{0}">6{1}</option>'.format(getmin("h",6),calLang.hour));
		html.push('<option value="{0}">12{1}</option>'.format(getmin("h",12),calLang.hour));
		html.push('<option value="{0}">1{1}</option>'.format(getmin("d",1),calLang.unitDay));
		html.push('<option value="{0}">2{1}</option>'.format(getmin("d",2),calLang.unitDay));
		html.push('<option value="{0}">3{1}</option>'.format(getmin("d",3),calLang.unitDay));
		html.push('<option value="{0}">4{1}</option>'.format(getmin("d",4),calLang.unitDay));
		html.push('<option value="{0}">5{1}</option>'.format(getmin("d",5),calLang.unitDay));
		html.push('<option value="{0}">6{1}</option>'.format(getmin("d",6),calLang.unitDay));
		html.push('<option value="{0}">7{1}</option>'.format(getmin("d",7),calLang.unitDay));
		html.push('<option value="{0}">8{1}</option>'.format(getmin("d",8),calLang.unitDay));
		html.push('<option value="{0}">9{1}</option>'.format(getmin("d",9),calLang.unitDay));
		html.push('<option value="{0}">10{1}</option>'.format(getmin("d",10),calLang.unitDay));
		html.push('<option value="{0}">11{1}</option>'.format(getmin("d",11),calLang.unitDay));
		html.push('<option value="{0}">12{1}</option>'.format(getmin("d",12),calLang.unitDay));
		html.push('<option value="{0}">13{1}</option>'.format(getmin("d",13),calLang.unitDay));
		html.push('<option value="{0}">14{1}</option>'.format(getmin("d",14),calLang.unitDay));
		return html.join("");
	},
	/**
	 * 点击更多日程
	 * @param {Object} index 日程项索引
	 * @param {Object} gdate 公历日期 如：7月1日
	 * @param {Object} ldate 农历日期 如: 农历十三
	 */
	ShowExpandCalItem: function(index,gdate,ldate){
		$("#calItem" + index).addClass("date_expand");	//展开日程项
		$("#calItem" + index).removeClass("date_overflow");//隐藏另外多个的按钮
		//展开日程项改变头HTML
		var html = [];		
		html.push('<span class="right nextPage">');
		html.push('<a class="cb_top5" href="javascript:;"><i onclick="Cal.OnClickPager({0},\'top\')" title="{1}" class="icon_last"></i></a>'.format(index,calLang.page_pre));
		html.push('<a class="cb_top5" href="javascript:;"><i onclick="Cal.OnClickPager({0},\'next\')" title="{1}" class="icon_next"></i></a>'.format(index,calLang.page_next));
		html.push('</span>');
		html.push('<span class="">{0}</span>'.format(gdate));
		html.push('<span class="">{0}</span>'.format(ldate));
		$("#monthDate"+index).html(html.join(""));
	},
	/**
	 * 展开更多日程时，日程项的翻页
	 * @param {Object} pageIndex 当前页码
	 * @param {Object} data 当前日程项数据
	 * @param {Object} index  当前日程项索引
	 */
	ShowExpandPager : function(pageIndex,data,index){
		var curPage = pageIndex; //当前页码
		var sizePage = this.CurItemRowCount;//每页条数		
		var curDataIndex = (curPage * sizePage)-sizePage;
		
		var html = [];
		for(var i = 1;curDataIndex < data.length; curDataIndex++,i++)
		{
			var icon = "";
			var curBean = data[curDataIndex];
			if(curBean.notifySendStatus == 1)
			{
				icon = '<i class="alert right"></i>';
			}else if(curBean.notifySendStatus == 2)
			{
				icon = '<i class="alert_gray right"></i>';
			}						
			html.push('<li onclick="Cal.ShowAddCalFrm({0},this,\'show\',{1})"><i class="ico_square"></i>'.format(index,curDataIndex));
         	html.push('<p class="event_msg">{1}<span class="event_text" title="{0}">{0}</span></p>'.format(curBean.eventContent,icon));
         	html.push('</li>');			
			if(i==sizePage){
				break;
			}
		}
		html.push('<li class="addevent">');
        html.push('<a href="javascript:;" OnClick="Cal.ShowAddCalFrm({0},this,\'add\')">{1}…</a>'.format(index,calLang.newEvent));
        html.push('<span class="event_time"></span>');
        html.push('</li>');
		return html.join("");
	},
	/**
	 * 展开更多日程时,点击翻页
	 * @param {Object} index 当前日程项索引
	 * @param {Object} t 类别: top、上一页,next、下一页
	 */
	OnClickPager: function(index, t){
	
		if (this.CurSelectedItem.Id != index) {
			this.CurPageIndex = 1;
		}
		if(this.CurPageIndex == 1 && t == "top"){return;}
		var data = this.JsonData[index-1].beanList;
		var pageCout = parseInt(data.length / this.CurItemRowCount);
		if(data.length % this.CurItemRowCount >0 ){
			pageCout++;
		}
		if(this.CurPageIndex == pageCout && t == "next"){return;}		
		if (t == "top") {
			this.CurPageIndex--;
		}
		else if(t == "next"){
			this.CurPageIndex++;
		}	
		
	 	var htmlStr=this.ShowExpandPager(this.CurPageIndex, data,index);		
		$("#monthDateUL"+index).html(htmlStr);
			
	},	
	/**
	 * 组装日程项头部HTML
	 * @param {Object} date 日期
	 */
	GetCalItemHeadHTML: function(date){
		var d_date = new Date(date.replace(/-/g, "/")); 
		var d_year = d_date.getFullYear();
		var d_month= d_date.getMonth();
		var d_day = d_date.getDate();
		
		var curDate = parent.Util.parseDate(this.CurDate.replace(/-/g, "/"));
		var c_year = curDate.getFullYear();
		var c_month= curDate.getMonth();
		var c_day = curDate.getDate();
		
		var oCal = new calendar(d_year,d_month);
		var l_date = oCal[d_day-1]; 
		var l_month = l_date.lMonth;
		var l_day = l_date.lDay;		
		var str_lDay = "";
		var returnStr;
		//农历字符串
		if(calLang.lang_cookie != "en_US"){
			if(l_day == 1){
				str_lDay = this.ChMonth[l_month];
			} else	{
				str_lDay = this.ChDay[l_day];
			}
		} 
		
		if (d_year == c_year && d_month == c_month) {
			returnStr = '<span class="right">{0}</span><span class="month_date_num" onclick="Cal.GoDayList(\'{2}\')">{1}</span>'.format(str_lDay, d_day,date);
		}
		else {
			returnStr = '<span class="right">{0}</span><span class="month_date_num month_date_compete" onclick="Cal.GoDayList(\'{3}\')">{1}{2}</span>'.format(str_lDay, Cal.GetFullNumForDate(d_month + 1) + calLang.month, Cal.GetFullNumForDate(d_day) + calLang.day,date);
		}
		
		return returnStr;
		
	},
	/**
	 * 组装日程项HTML
	 * @param {Object} index 当前日程项索引
	 * @param {Object} data 当前日程项数据
	 */
    GetCalHtml: function(index,data){
        var html = [];
		//公历日期
		var d_date = new Date(data.calDate.replace(/-/g, "/")); 
		var d_year = d_date.getFullYear();
		var d_month= d_date.getMonth();
		var d_day = d_date.getDate();
		//当前公历日期	
        var curDate = parent.Util.parseDate(this.CurDate.replace(/-/g, "/"));
        var c_year = curDate.getFullYear();
        var c_month = curDate.getMonth();
        var c_day = curDate.getDate();
		//今天公历日期
		var jtDate =  new Date(initDate.curDate.replace(/-/g, "/"));
		var j_year = jtDate.getFullYear();
		var j_month= jtDate.getMonth();
		var j_day = jtDate.getDate();
		//农历日期
		var oCal = new calendar(d_year,d_month);
		var l_date = oCal[d_day-1]; 
		var l_month = l_date.lMonth;
		var l_day = l_date.lDay;		
		var str_lDay = "";
		//农历字符串
		if(calLang.lang_cookie != "en_US"){
			if(l_day == 1){
				str_lDay = this.ChMonth[l_month];
			} else	{
				str_lDay = this.ChDay[l_day];
			}
		} 
		var temphtml = [];
		var morecss ="";
		for(var i = 0;i < data.beanList.length;i++){
			if(i == this.CurItemRowCount){				
				morecss = "date_overflow";
				break;
			}
			var curBean = data.beanList[i];
			var icon = "";
			if(curBean.notifySendStatus == 1)
			{
				icon = '<i class="alert right"></i>';
			}else if(curBean.notifySendStatus == 2)
			{
				icon = '<i class="alert_gray right"></i>';
			}						
			temphtml.push('<li onclick="Cal.ShowAddCalFrm({0},this,\'show\',{1})"><i class="ico_square"></i>'.format(index,i));
         	temphtml.push('<p class="event_msg">{1}<span class="event_text" title="{0}">{0}</span></p>'.format(curBean.eventContent,icon));
         	temphtml.push('</li>');
		}
		var itemDivCss = "";
		var itemDivHeadCss = "";
		if (d_year == j_year && d_month == j_month && d_day == j_day) {
			itemDivCss = "date_selected";
			itemDivHeadCss = "today_title";
			this.CurSelectedItem.Id=index;
		}
        html.push('<div id="calItem{2}" class="date_box {0} {1}">'.format(morecss,itemDivCss,index));
        html.push('<div class="selected_border">');		
		html.push('<div id="monthDate{1}" class="month_date {0}">'.format(itemDivHeadCss,index));
		if (d_year == c_year && d_month == c_month) {
			html.push('<span class="right">{0}</span><span class="month_date_num" onclick="Cal.GoDayList(\'{2}\')">{1}</span>'.format(str_lDay,d_day,d_date.format("yyyy-mm-dd")));
		}else
		{
			html.push('<span class="right">{0}</span><span class="month_date_num month_date_compete" onclick="Cal.GoDayList(\'{3}\')">{1}{2}</span>'.format(str_lDay,Cal.GetFullNumForDate(d_month+1)+ calLang.month,Cal.GetFullNumForDate(d_day) + calLang.day,d_date.format("yyyy-mm-dd")));
		}
        html.push('</div>');
        html.push('<ul class="month_event" id="monthDateUL{0}">'.format(index));
		html.push(temphtml.join(""));	
        
        html.push('<li class="addevent">');
        html.push('<a href="javascript:;" OnClick="Cal.ShowAddCalFrm({0},this,\'add\')">{1}…</a>'.format(index,calLang.newEvent));
        html.push('<span class="event_time"></span>');
        html.push('</li>');
        html.push('              </ul>');
        html.push('            </div>');
        html.push('<div class="month_event_more">');
        if(calLang.lang_cookie != "en_US"){        	
        	html.push('<a href="javascript:;" onclick="Cal.ShowExpandCalItem({1},\'{2}\',\'{3}\')">{4}<span id="spanOther{1}">{0}</span>个</a></div>'.format(data.beanList.length-this.CurItemRowCount,index,"{0}{1}".format(Cal.GetFullNumForDate(d_month+1)+ calLang.month,Cal.GetFullNumForDate(d_day)+ calLang.day),"农历{0}".format(str_lDay),calLang.other));
        } else {
        	html.push('<a href="javascript:;" onclick="Cal.ShowExpandCalItem({1},\'{2}\',\'{3}\')">{4}<span id="spanOther{1}">{0}</span></a></div>'.format(data.beanList.length-this.CurItemRowCount,index,"{0}{1}".format(Cal.GetFullNumForDate(d_month+1)+ calLang.month,Cal.GetFullNumForDate(d_day)+ calLang.day),"{0}".format(str_lDay),calLang.other));
		}
        html.push('          </div>');
        return html.join("");
    },
    
    /**
     * 如果月份和天的值是一位，自动补0
     * @param num
     * @returns
     */
    GetFullNumForDate: function(num){
    	if(num < 10){
    		return "0" + num;
    	}
    	return num;
    },    
	/**
	 * 跳转到日列表页
	 * @param {Object} date 日期
	 */
	GoDayList: function(date){
		location.href =	"daylist.do?sid={0}&date={1}".format(GC.getUrlParamValue(location.href,"sid"),date);
	},
	/**
	 * 跳转到添加页
	 * @param {Object} t 类别:1 add 添加(带值过去) 2 defualt 默认
	 */
	GoToAddCalPage: function(t){
		//var cdate = new Date(this.CurDate.replace(/-/g, "/"));
		if(t == "add"){
			var date =$("#curDateSpan").attr("name");
			var begintime = $("#addCalDiv_BeginTime").val();
			var endtime = $("#addCalDiv_EndTime").val();
			var content = $("#addCalDiv_Text").val();
			var betime = $("#addCalDiv_TQ").val();
			location.href = "addcal.do?sid={0}&date={1}&b={2}&e={3}&c={4}&tq={5}".format(GC.getUrlParamValue(location.href,"sid"),
			date,begintime,endtime,escape(content),betime);
		}else if(t == "defualt"){
			location.href = "addcal.do?sid={0}&date={1}".format(GC.getUrlParamValue(location.href,"sid"),this.CurDate);
		}
	},
	/**
	 * 点击日程项
	 * @param {Object} index 当前日程项索引
	 */
    CalOnClick: function(index){
        if (this.CurSelectedItem.Id != 0) { 
            $("#calItem" + this.CurSelectedItem.Id).removeClass("date_selected"); //上一个被选中的日历项选中样式移除
            $("#calItem" + this.CurSelectedItem.Id).parent().removeClass("td_selected");//上一个被选中的日历项选中的父TD样式移除
            $("#calItem" + this.CurSelectedItem.Id).parent().parent().parent().parent().parent().removeClass("week_selected");
            if (this.CurSelectedItem.Id != index) { //当选择另一个日历项
                $("#calItem" + this.CurSelectedItem.Id).removeClass("date_expand"); //移除日程项展开样式
                var jd = this.JsonData[this.CurSelectedItem.Id - 1]; //获取上个被选中的日程项数据
                if (jd.beanList.length > this.CurItemRowCount) { //如果上个被选中的日程项数据大于当前显示日程项数据个数
                    $("#calItem" + this.CurSelectedItem.Id).addClass("date_overflow");	//添加显示更多日程的样式				
					$("#monthDate" + this.CurSelectedItem.Id).html(this.GetCalItemHeadHTML(jd.calDate));//改变日程项头部HTML
					this.CurPageIndex = 1; //当前页码
					//上个被点击的日程项 的 日程事件 显示为第一页
					$("#monthDateUL" + this.CurSelectedItem.Id).html(this.ShowExpandPager(this.CurPageIndex, jd.beanList,this.CurSelectedItem.Id));
                }
            }
        }
		
				
        this.CurSelectedItem.Id = index; //设置当前选择日程项索引
        $("#calItem" + index).addClass("date_selected"); //添加被选择日程项的样式
        $("#calItem" + index).parent().addClass("td_selected");//添加被选择日程项TD的样式
		$("#calItem" + index).parent().parent().parent().parent().parent().addClass("week_selected");
        if (this.IsHideAddCalFrm) {
            $("#addCalDiv").hide();
        }
        this.IsHideAddCalFrm = true;
        this.IsBodyOnClick = false;		
    },
	/*
	 * body点击事件，作用与改变当前日程项
	 */
    BodyOnClick: function(){  
		//当点击body      
        if (this.IsBodyOnClick) { 
            $("#addCalDiv").hide(); //隐藏添加日程窗口
            if (this.CurSelectedItem.Id > 0) {
				$("#calItem" + this.CurSelectedItem.Id).removeClass("date_selected");//移除当前日程项的选中样式
				$("#calItem" + this.CurSelectedItem.Id).removeClass("date_expand");//移除当前日程项的展开样式
				$("#calItem" + this.CurSelectedItem.Id).parent().removeClass("td_selected");//移除当前日程项TD的选中样式
				$("#calItem" + this.CurSelectedItem.Id).parent().parent().parent().parent().parent().removeClass("week_selected");
				var jd = this.JsonData[this.CurSelectedItem.Id - 1]; //获取当前日程项的数据
				if (jd.beanList.length > this.CurItemRowCount) { //当数据个数大与当前日程项显示个数
					$("#calItem" + this.CurSelectedItem.Id).addClass("date_overflow");//添加显示更多日程的样式			
					$("#monthDate" + this.CurSelectedItem.Id).html(this.GetCalItemHeadHTML(jd.calDate));//还原日程项头部HTML
					this.CurPageIndex = 1;//当前页码
					//上个被点击的日程项 的 日程事件 显示为第一页
					$("#monthDateUL" + this.CurSelectedItem.Id).html(this.ShowExpandPager(this.CurPageIndex, jd.beanList, this.CurSelectedItem.Id));
				}
			}
            this.CurSelectedItem.Id = 0; //设置当前选中的日程项
        }
        this.IsBodyOnClick = true;
    },
	AddCalFrmOnClick: function(){
		this.IsBodyOnClick = false;
	},
	/**
     * Ajax请求
     * @param {Object} func
     * @param {Object} data
     * @param {Object} callback
     */
    Ajax: function(func, data, callback,fcall){
		var failCall = function(d){
                if (d.summary) 
                    parent.CC.alert(d.summary);
        };
        parent.MM.doService({
            url: Cal.PostURL,
            func: func,
            data: data,
            failCall: fcall || failCall,
            call: function(d){
                callback(d);
            },
            param: ""
        });
    }	
};

window.Cal = Cal;
})(jQuery)

