/***
 * @description 日程提醒日视图
 * @auth tangl
 */
var DayList = {
	CurDate : "2012/07/12", // 当前时间
	PostURL : "/cal/usercal.do", //ajax post请求URL
	SelectedIds:[], //选中的日程ID集合
	JsonData: null, //数据JSON
	PageSize: 7, //页大小
	CurPageIndex:1, //当前页
	PageCout:1, //页数
	ChDay:{
		1:"",2:"初二",3:"初三",4:"初四",5:"初五",6:"初六",7:"初七",8:"初八",9:"初九",10:"初十",
		11:"十一",12:"十二",13:"十三",14:"十四",15:"十五",16:"十六",17:"十七",18:"十八",19:"十九",20:"廿十",
		21:"廿一",22:"廿二",23:"廿三",24:"廿四",25:"廿五",26:"廿六",27:"廿七",28:"廿八",29:"廿九",30:"三十"
	},//农历日
	ChMonth:{
		1:"一月",2:"二月",3:"三月",4:"四月",5:"五月",6:"六月",7:"七月",8:"八月",9:"九月",10:"十月",11:"十一月",12:"十二月"
	},//农历月	
	/**
	 * 页面加载事件
	 */
	Load: function(){
		var cdate =	GC.getUrlParamValue(location.href,"date"); 
		if (cdate) {
			this.CurDate = cdate;
		}
		else {
			this.CurDate = initDate.curDate;
		}
		this.LoadDateHTML();
		this.LoadNLDate();
		this.LoadListHTML();
	},
	/**
	 * 加载右边日历数据
	 */
	LoadNLDate: function(){
		//今天的公历日期
		var curDate = new Date(this.CurDate.replace(/-/g, "/"));
		var c_year = curDate.getFullYear();
		var c_month= curDate.getMonth();
		var c_day = curDate.getDate();
		var oCal = new calendar(c_year,c_month);
		var oCalItem = oCal[c_day-1];
		$("#dayDiv").html(c_day);
		$("#dateDiv").html(curDate.format(addLang.dateFormatYMD.replace("MM","mm"))+" "+weekLang[oCalItem.week]);
		if(addLang.lang_cookie == "en_US"){
			$("#lDateDiv").html("{0}".format(""));
		} else {			
			$("#lDateDiv").html("{0} {1}{2} {3}".format(oCalItem.cYear,this.ChMonth[oCalItem.lMonth],this.ChDay[oCalItem.lDay],oCalItem.lunarFestival));
		}
		$("#dateTD").html(curDate.format(addLang.dateFormatYM));
	},
	/**
	 * 组装日历HTML
	 */
	LoadDateHTML: function(){
		var html = [];
		html.push('<tr>');
		html.push('    <th><a href="javascript:fGoto();">'+weekLang["日"].replace("星期","")+'<i></i></a></th>');
		html.push('    <th><a href="javascript:fGoto();">'+weekLang["一"].replace("星期","")+'<i></i></a></th>');
		html.push('    <th><a href="javascript:fGoto();">'+weekLang["二"].replace("星期","")+'<i></i></a></th>');
		html.push('    <th><a href="javascript:fGoto();">'+weekLang["三"].replace("星期","")+'<i></i></a></th>');
		html.push('    <th><a href="javascript:fGoto();">'+weekLang["四"].replace("星期","")+'<i></i></a></th>');
		html.push('    <th><a href="javascript:fGoto();">'+weekLang["五"].replace("星期","")+'<i></i></a></th>');
		html.push('    <th><a href="javascript:fGoto();">'+weekLang["六"].replace("星期","")+'<i></i></a></th>');
	  	html.push('</tr>');
	  
		var bDate =	new Date(initDate.beginDate.replace(/-/g, "/")); 
		var eDate = new Date(initDate.endDate.replace(/-/g, "/")); 
		
		var dayCount = parent.Util.DateDiffMore(bDate,eDate,"d")+1;
		if(dayCount % 7 != 0){
			parent.CC.alert(addLang.dateFormatError);			
			return;
		}
		//今天的公历日期
		var curDate = new Date(this.CurDate.replace(/-/g, "/"));
		var c_year = curDate.getFullYear();
		var c_month= curDate.getMonth();
		var c_day = curDate.getDate();
		
		var nextDate = bDate;	
		for (var i = 1; i <= dayCount; i++) {
			if(i == 1 || (i-1) % 7 == 0){
				html.push('<tr>');
			}
			var classstr = "";
			var tdclass = "";
			var n_year = nextDate.getFullYear();
			var n_month= nextDate.getMonth();
			var n_day = nextDate.getDate();
			if(n_year != c_year || n_month != c_month){
				classstr = ' class="normal"';				
			}
			if(n_year == c_year && n_month == c_month && n_day == c_day)
			{
				tdclass = ' class="today_selectedtd"';
			}
			
			html.push('<td{2}><a onclick="DayList.CalOnClick(\'{3}\');return false;" href="javascript:fGoto();"{0}>{1}<i></i></a></td>'.format(classstr,n_day,tdclass,nextDate.format("yyyy-mm-dd")));
			if (i % 7 == 0) {
                html.push('</tr>');
            }		    
		   nextDate = parent.Util.DateAdd("d",1,nextDate);
		}
		$("#calTable").html(html.join(""));
	},
	/**
	 * 组装数据列表
	 */
	LoadListHTML: function(){
		var postdata = {
			"calDate" : this.CurDate
		};
		var callback = function(data){
			if(data.code == "S_OK")
			{
				var html = [];
				var beanlist = data["var"].beanList;
				DayList.JsonData = beanlist;
				DayList.LoadPager();	
				DayList.GoToPage();				
			}else{
				parent.CC.alert(data.summary);
			}
		};
		this.Ajax("cal:byDate",postdata,callback);
	},
	/**
	 * 加载默认页
	 */
	LoadPager: function(){
		var data = this.JsonData;
		this.PageCout = parseInt(data.length / this.PageSize);
		if(data.length % this.PageSize >0 ){
			this.PageCout++;
		}
		
		for (var i = 1; i <= this.PageCout; i++) {
			$("#selectPage").append("<option value='{0}{1}'>{0}/{1}</option>".format(i,this.PageCout)); 
		}
		
	},
	/**
	 * 显示/隐藏 翻页按钮
	 */
	ShowPagerButton: function(){
		var data = this.JsonData;
		if (data.length > 0) {
			$("#selectPage ").val("{0}{1}".format(this.CurPageIndex,this.PageCout));
			if (this.CurPageIndex == 1) {
				$("#firstPage").hide();
				$("#firstSpan").hide();
				$("#topPage").hide();
				$("#topSpan").hide();
				$("#lastPage").show();
                $("#nextPage").show();
                $("#nextSpan").show();
				$("#selectPage").show();
			}
			else if (this.CurPageIndex == this.PageCout) {
                $("#lastPage").hide();
                $("#nextPage").hide();
                $("#nextSpan").hide();
				$("#firstPage").show();
				$("#firstSpan").show();
				$("#topPage").show();	
				$("#selectPage").show();			
			}else{
				$("#firstPage").show();
				$("#firstSpan").show();
				$("#topPage").show();
				$("#topSpan").show();
				$("#lastPage").show();
				$("#nextPage").show();
				$("#nextSpan").show();
				$("#selectPage").show();			
			}
			
			if(this.CurPageIndex == 1 && this.PageCout == 1){
				$("#firstPage").hide();
				$("#firstSpan").hide();
				$("#topPage").hide();
				$("#topSpan").hide();
				$("#lastPage").hide();
				$("#nextPage").hide();
				$("#nextSpan").hide();
				$("#selectPage").hide();	
			}
		}
		else {
			$("#firstPage").hide();
			$("#firstSpan").hide();
			$("#topPage").hide();
			$("#topSpan").hide();
			$("#lastPage").hide();
			$("#nextPage").hide();
			$("#nextSpan").hide();
			$("#selectPage").hide();			
		}
	},
	/**
	 * 翻页
	 * @param {Object} t
	 */
	GoToPage: function(t){		
		if(t == "next") this.CurPageIndex++;
		else if(t=="top") this.CurPageIndex--;
		else if(t=="first") this.CurPageIndex = 1;
		else if(t=="last") this.CurPageIndex = this.PageCout;
		else if(t=="go"){
			var selectedPage =	$("#selectPage").find("option:selected").text();
			selectedPage = selectedPage.substr(0,selectedPage.indexOf("/"));
			this.CurPageIndex = parseInt(selectedPage);
		}
		var curDataIndex = (this.CurPageIndex * this.PageSize)-this.PageSize;
		this.ShowPagerButton();
		var data = this.JsonData;
		var html = [];
		for (var i = 1 ; curDataIndex < data.length; i++,curDataIndex++) {
			var item = data[curDataIndex];
			html.push('<li>');
			html.push('<div class="bar">');
			html.push('<input onclick="DayList.OneSelected()" type="checkbox" value="{0}" name="calItem">'.format(item.calId));
			html.push('<a class="cb_top2" href="addcal.do?sid={1}&cid={2}">{0}</a>'.format(item.eventDetailTime,GC.getUrlParamValue(location.href,"sid"),item.calId));
			html.push('<div class="status">');
			html.push('<a href="addcal.do?sid={0}&cid={1}">'.format(GC.getUrlParamValue(location.href,"sid"),item.calId));
			if (item.notifySendStatus == 1) {
				html.push('<i class="alert"></i>');
			}else if(item.notifySendStatus == 2){
				html.push('<i class="alert_gray alert_relative"></i>');
			}
			html.push('<span>{0}</span>'.format(item.beforeNotifyMsg));
			html.push('</a>');
			html.push(this.ShowAlterImgage(item.notifyType));
			html.push('</div>');
			html.push('<div style="display: none; " class="tool">');
			html.push('<a title="'+addLang.calDelete+'" href="#"><i class="del"></i></a>');
			html.push('</div></div>');
			html.push('<div class="ctns">');
			html.push('<a href="addcal.do?sid={1}&cid={2}">{0}</a>'.format(item.eventContent,GC.getUrlParamValue(location.href,"sid"),item.calId));
			html.push('</div></li>');
			if(i == this.PageSize)
				break;
		}
		$("#dayListLi").html(html.join(""));	
	},	
	/**
	 * 组装提醒图标
	 * @param {Object} noticeType
	 */
	ShowAlterImgage : function(noticeType){
		var html = [];
		var mail = '<i title="'+addLang.emailRemind+'" class="alt-mail"></i>';//邮件提醒
		var sms = '<i title="'+addLang.smsRemind+'" class="alt-phone"></i>';//短信提醒
        if(noticeType == 1 || noticeType == 4 || noticeType == 7 || noticeType == 5 || noticeType == 6 )
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
	 * 点击日历上的日期跳转
	 * @param {Object} date
	 */
	CalOnClick : function(date){
		location.href =	"daylist.do?sid={0}&date={1}".format(GC.getUrlParamValue(location.href,"sid"),date);
	},
	/**
	 * 上下月跳转
	 * @param {Object} t
	 */
	GoToDate: function(t){
		var cdate = new Date(this.CurDate.replace(/-/g, "/"));
		var date = new Date();
		if(t=="top"){
			date = parent.Util.DateAdd("m",-1,cdate);
		}
		else if(t=="next"){
			date = parent.Util.DateAdd("m",1,cdate);
		}
		location.href =	"daylist.do?sid={0}&date={1}".format(GC.getUrlParamValue(location.href,"sid"),date.format("yyyy-mm-dd"));
	},	
	/**
	 * 跳转添加日程页
	 */
	GoToAddCalPage: function(){		
		location.href = "addcal.do?sid={0}&date={1}".format(GC.getUrlParamValue(location.href,"sid"),this.CurDate);
	},
	/**
	 * 跳转月视图
	 */
	GoToCalIndexPage: function(){
		location.href = "indexcal.do?sid={0}&date={1}".format(GC.getUrlParamValue(location.href,"sid"),this.CurDate);
	},
	/**
	 * 选中单个日程提醒
	 */
	OneSelected: function(){
		if($("input[name='calItem']:checked").size()==$("input[name='calItem']").size()){
			$('#cb_allSelected').attr('checked',true);
		}else{
			$('#cb_allSelected').attr('checked',false);
		}
	},
	/**
	 * 全选
	 * @param {Object} obj
	 */
	AllSelected: function(obj){		        
        if (obj.checked == false) {            
            $("input[name='calItem']").each(function(){
                $(this).attr("checked", false);
            });
        }
        else {
            $("input[name='calItem']").each(function(){
                $(this).attr("checked", true);                
            });
        }
	},
	/**
	 * 获取选中的日程提醒ID
	 */
	GetSelectFileIDList: function(){
        DayList.SelectedIds = [];
        $("input[name='calItem']").each(function(){
            if (this.checked == true) {
                DayList.SelectedIds.push($(this).val());
            }
        });
    },
	/**
	 * 是否删除
	 */
	DeleteCalConfirm: function(){	
		 DayList.GetSelectFileIDList();	
		 if(DayList.SelectedIds.length == 0)
		 {
		 	parent.CC.alert(addLang.noSelectTip);//请选择要删除的日程!
			return;
		 }
		 parent.CC.confirm(addLang.deleteTip, DayList.DeleteCal);
	},
	/**
	 * 删除日程
	 */
	DeleteCal: function(){		
		 var postdata = {
           "calIds" : []
         };
		postdata.calIds= DayList.SelectedIds;
        var callback = function(data){
            if (data.code == "S_OK") {
				$('#cb_allSelected').attr('checked',false);            	
				location.reload();
            }
            else {
                parent.CC.alert(data.summary);
            }
        };
		DayList.Ajax("cal:delete",postdata,callback);
	},
	/**
     * Ajax请求
     * @param {Object} func
     * @param {Object} data
     * @param {Object} callback
     */
    Ajax: function(func, data, callback){
        parent.MM.doService({
            url: DayList.PostURL,
            func: func,
            data: data,
            failCall: function(d){
                if (d.summary) 
                    parent.CC.alert(d.summary);
            },
            call: function(d){
                callback(d);
            },
            param: ""
        });
    }	
};
