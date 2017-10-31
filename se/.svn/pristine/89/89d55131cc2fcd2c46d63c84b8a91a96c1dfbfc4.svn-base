/**
 *
 */
var CalCommon = {
    getCookie: function(name){//取cookies函数        
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null) {
            return unescape(arr[2]);
        }
        return null;
    },
    
    dayEn: {
        "01": "1st",
        "02": "2nd",
        "03": "3rd",
        "04": "4th",
        "05": "5th",
        "06": "6th",
        "07": "7th",
        "08": "8th",
        "09": "9th",
        "10": "10th",
        "11": "11th",
        "12": "12th",
        "13": "13th",
        "14": "14th",
        "15": "15th",
        "16": "16th",
        "17": "17th",
        "18": "18th",
        "19": "19th",
        "20": "20th",
        "21": "21st",
        "22": "22nd",
        "23": "23rd",
        "24": "24th",
        "25": "25th",
        "26": "26th",
        "27": "27th",
        "28": "28th",
        "29": "29th",
        "30": "30th",
        "31": "31st"
    },
    
    monthEn: {
        "01": "Jan.",
        "02": "Feb.",
        "03": "Mar.",
        "04": "Apr.",
        "05": "May.",
        "06": "June.",
        "07": "July.",
        "08": "Aug.",
        "09": "Sept.",
        "10": "Oct.",
        "11": "Nov.",
        "12": "Dec."
    },
    
    /**
     *根据使用语言获取天
     * key 天 01,02....31
     * lang 语言  en_US , cn_CH...
     */
    getDay: function(key, lang){
        if (lang == "en_US" || lang == "en_UK") {
            return CalCommon.dayEn[key];
        }
        return key;
    },
    /**
     *根据使用语言获取月
     * key 天 01,02....12
     * lang 语言  en_US , cn_CH...
     */
    getMonth: function(key, lang){
        if (lang == "en_US" || lang == "en_UK") {
            return CalCommon.monthEn[key];
        }
        return key;
    },
	timeSelected: function(obj,bdate,edate){		
		var objList_beginMonth = $("#beginMonth").find("option:selected").text();
		var objList_endMonth = $("#endMonth").find("option:selected").text();		
		var repeat = $("#RepeatType").val();
		
		if (obj.id == "beginMonth") {			
			var val_bYear = parseInt(objList_beginMonth);
			var val_eYear = parseInt(objList_endMonth);
			var val_bMonth = $("#beginMonth").val();
			//var val_eMonth = $("#endMonth").val();
			
			if(val_bYear > val_eYear){
				$("#endMonth").val(val_bMonth);			
				AddCal.SelectMonth(document.getElementById("endMonth"));
			}		
		}
		else if (obj.id == "endMonth") {
			var val_bYear = parseInt(objList_beginMonth);
			var val_eYear = parseInt(objList_endMonth);
			//var val_bMonth = $("#beginMonth").val();
			var val_eMonth = $("#endMonth").val();
			
			if(val_bYear > val_eYear){
				$("#beginMonth").val(val_eMonth);
				AddCal.SelectMonth(document.getElementById("beginMonth"));
			}		
		}
		else if (obj.id == "beginDay") {
			var dayList = this.GetDayStr(repeat);
			var val_bYear = parseInt(dayList.b);
			var val_eYear = parseInt(dayList.e);
			var val_bDay = $("#beginDay").val();
			//var val_eDay =  $("#endDay").val();
			
			if(val_bYear > val_eYear){
				$("#endDay").val(val_bDay);
			}		
		}
		else if (obj.id == "endDay") {
			var dayList = this.GetDayStr(repeat);
			var val_bYear = parseInt(dayList.b);
			var val_eYear = parseInt(dayList.e);
			//var val_bDay = $("#beginDay").val();
			var val_eDay =  $("#endDay").val();
			
			if(val_bYear > val_eYear){
				$("#beginDay").val(val_eDay);
			}		
		}
		else if (obj.id == "beginTime") {
			var  timeList = this.GetTimeStr(repeat);			
			var val_bTime = $("#beginTime").val();			
			
			if(timeList){
				$("#endTime").val(val_bTime);
			}		
		}
		else if (obj.id == "endTime") {
			var  timeList = this.GetTimeStr(repeat);			
			var val_eTime = $("#endTime").val();
			
			if(timeList){
				$("#beginTime").val(val_eTime);
			}		
		}else if(obj.id == "addCalDiv_BeginTime"){
			var addList_beginTime = $("#addCalDiv_BeginTime").find("option:selected").text().replace(/:/g, "");
			var addList_endTime = $("#addCalDiv_EndTime").find("option:selected").text().replace(/:/g, "");
			var val_bYear = parseInt(addList_beginTime);
			var val_eYear = parseInt(addList_endTime);		
			var val_bTime = $("#addCalDiv_BeginTime").val();
			var val_eTime = $("#addCalDiv_EndTime").val();
			if(val_bYear > val_eYear){
				$("#addCalDiv_EndTime").val(val_bTime);
			}					
				
		}else if(obj.id == "addCalDiv_EndTime"){
			var addList_beginTime = $("#addCalDiv_BeginTime").find("option:selected").text().replace(/:/g, "");
			var addList_endTime = $("#addCalDiv_EndTime").find("option:selected").text().replace(/:/g, "");
			var val_bYear = parseInt(addList_beginTime);
			var val_eYear = parseInt(addList_endTime);		
			var val_bTime = $("#addCalDiv_BeginTime").val();
			var val_eTime = $("#addCalDiv_EndTime").val();
			if(val_bYear > val_eYear){
				$("#addCalDiv_BeginTime").val(val_eTime);
			}		
		}
		
	},
	GetTimeStr: function(repeat){		
		var timeList = false;
		var objList_BeginDate = $("#txt_BeginDate").val().replace(/-/g, "/");
		var objList_EndDate = $("#txt_EndDate").val().replace(/-/g, "/");
		var objList_beginMonth = $("#beginMonth").val();
		var objList_endMonth = $("#endMonth").val();
		var objList_beginDay = $("#beginDay").val();
		var objList_endDay = $("#endDay").val();
		var objList_beginTime = $("#beginTime").val();
		var objList_endTime = $("#endTime").val();
		
		if(repeat == "0"){			
			var val_b = new Date(objList_BeginDate+" "+objList_beginTime+":00");
			var val_e = new Date(objList_EndDate+" "+objList_endTime+":00");
			var nCount = parent.Util.DateDiffMore(val_b,val_e,"n");
			if(nCount < 0){
				timeList = true;
			}
		}		
		else if(repeat == "3"){			
			var d_b = new Date(new Date().setDate(objList_beginDay)).format("yyyy/mm/dd");
			var d_e = new Date(new Date().setDate(objList_endDay)).format("yyyy/mm/dd");
			var val_b = new Date(d_b+" "+objList_beginTime+":00");
			var val_e = new Date(d_e+" "+objList_endTime+":00");
			var nCount = parent.Util.DateDiffMore(val_b,val_e,"n");
			if(nCount < 0){
				timeList = true;
			}
		}
		else if(repeat == "4"){
			var d_b = new Date().getFullYear() +"/"+objList_beginMonth+"/"+objList_beginDay;
			var d_e = new Date().getFullYear() +"/"+ objList_endMonth+"/"+objList_endDay;
			var val_b = new Date(d_b+" "+objList_beginTime+":00");
			var val_e = new Date(d_e+" "+objList_endTime+":00");
			var nCount = parent.Util.DateDiffMore(val_b,val_e,"n");
			if(nCount < 0){
				timeList = true;
			}
			
			//timeList.b = objList_beginMonth+objList_beginDay+ objList_beginTime;
			//timeList.e = objList_endMonth+objList_endDay+ objList_endTime;
		}else {
			objList_beginTime = $("#beginTime").find("option:selected").text().replace(/:/g, "");
		    objList_endTime = $("#endTime").find("option:selected").text().replace(/:/g, "");
			var val_b = parseInt(objList_beginTime);
			var val_e = parseInt(objList_endTime);
			if(val_b > val_e){
				timeList = true;
			}
		}
		return timeList;
	},
	GetDayStr: function(repeat){		
		var timeList = {};		
		var objList_beginMonth = $("#beginMonth").find("option:selected").text();
		var objList_endMonth = $("#endMonth").find("option:selected").text();
		var objList_beginDay = $("#beginDay").val();
		var objList_endDay = $("#endDay").val();
		
		if(repeat == "3"){
			timeList.b =objList_beginDay;
			timeList.e =objList_endDay;
		}
		else if(repeat == "4"){
			timeList.b = objList_beginMonth+objList_beginDay;
			timeList.e = objList_endMonth+objList_endDay;
		}
		return timeList;
	}
    
};


