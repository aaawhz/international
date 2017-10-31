/**
 * 新的Home类实现
 * 复写原Home类实现
 */
function Home(){
    this.name = gConst.home;
    this.host = null;
    this.templatePrefix = 'custom_home_';
    this.datas = {};
}

Home.prototype = {
    /**
     * 实例化时初始化函数
     */
    initialize: function(){
        GMC.initialize(this.name, this);
    },
    /**
     * 初始化，函数数据收集、整理、合并以及触发模板检测
     * @param obj {object} 用于合并到初始数据集里的数据
     * @param host {window} 宿主[主动拉数据的模板Window对象]
     */
    init: function(host, obj,childDocument){
        obj = obj || {};
        CC.syncMailData();
        this.host = host;
        this.mergeData(obj);
        this.update();
        if(documentEventManager && host.document){
            documentEventManager.addDoc(host.document);
        }
        if(typeof this.loadedCallback == 'function'){
            this.loadedCallback(this);
        }
		if (childDocument) {
			this.loadHomeData(childDocument);
			//this.bindCalData(childDocument);
			this.childDocument = childDocument;
		}
		this.registerHostEvents(childDocument);
    },
	/**
	 *日期转化为yyyy-MM-dd的时间格式
	 */
	getFormatDate: function(thisDate) {
		var tempMonth = thisDate.getMonth()-0+1;
		var month = tempMonth < 10?"0"+tempMonth:tempMonth;
		var tempDay = thisDate.getDate()-0;
		var day = tempDay < 10?"0"+tempDay:tempDay;
		return thisDate.getFullYear()+"-"+month+"-"+day;
	},
	registerHostEvents: function(hDoc){
		var notice = jQuery('#custom_home_corp_notice',hDoc);
		var cal = jQuery('#custom_home_recent_sch',hDoc);

		if(cal && cal.size() > 0){
			// 有日程提醒
			if(notice && notice.size() > 0){
				// 有企业公告，则注册点击事件
				var once = (function(context){
					var exec = false;
					return function(){
						return exec || (exec = context.bindCalData(context.childDocument));
					}
				})(this);
				cal.bind('click', function(){
					once();
				});
			}
			else{
				this.bindCalData(this.childDocument);
			}
		}
	},
	/**
	 *得到日程的数据
	 */
	bindCalData: function (childDocument) {
		var This = this;
		var nowDate=new Date();
		var startDate = This.getFormatDate(nowDate);
		var tempDate=new Date();
		var secondAfter30 = tempDate.setDate(tempDate.getDate()+30);
		//30天后的日期
		var dateAfter30 = new Date(secondAfter30);
		var endDate = This.getFormatDate(dateAfter30);
		var ojbdata = {
			comeFrom:0,
			startDate:startDate,
			endDate:endDate,
			maxCount:0
		};
		var callBack = function (retData) {
			jQuery("#custom_home_recent_tab",childDocument)[0].innerHTML = This.getCalHtml(retData);
        };
		var callBackFail = function (au) {
			console.log(au);
        };
		var sendData = Util.varToXml(null, ojbdata, "\n").substr(1) + '\n\n';
		var param = {
			data:sendData,
			method:"post",
			resType:"json",
			failCall:callBackFail,
			encode:"gb2312"
		};
		parent.CC.requestWebApi(gMain.urlCal+"/s?func=calendar:getRecentCalendarView&sid="+gMain.sid,callBack,param);
		return true;
	},
	goCal:function () {
		top.location.href = parent.gMain.urlCal + "/index.do?sid="+parent.gMain.sid;
	},
	/**
	 *得到日程的html
	 */
	getCalHtml: function (obj) {
		if (!obj) {
			return "";
		}
		var tempVar = obj["var"];
		var tempTable = obj.table;
		var tmpHtml = '<div class="timeLinewrap">';
		tmpHtml += '<a href="javascript:void(0)" onClick="parent.MM[parent.gConst.home].goCal()" class="more">查看所有日程&gt;&gt;</a>';
		tmpHtml += '<div class="timeline-container"><div class="timeline"></div></div>';
		tmpHtml += '';
		//确定每条日程的top位置
		var top = 10;
		var maxCount = 5;
		for(var day in tempVar) {
			var tempDays = tempVar[day];
			if (tempDays && tempDays.info) {
				for(var i = 0; i < tempDays.info.length; i++) {
					maxCount -= 1;
					//只显示5条日程
					if (maxCount < 0 || top > 160) {
						tmpHtml +=		'</div>';
						tmpHtml += '</div>';
						tmpHtml += '</div>';
						return tmpHtml;
					}
					if (i == 0) {
						tmpHtml += '<div class="brick" style="top:'+top+'px; left:115px;">';
						tmpHtml +=		'<div class="brick-date">'+this.getCalDay(day)+'</div>';
						tmpHtml +=		'<em class="arrow"></em>';
						tmpHtml +=		'<div class="brick-inner">';
						top += 23;
					}
					var tempCal = tempDays.info[i];
					var tempData = tempTable[tempCal];
					var timeLength = tempData.startTime.toString().length;
					var tempStartArray = tempData.startDate.split("-");
					var tempEndArray = tempData.endDate.split("-");
					var startEndTime = "";

					var objStartDate = new Date(tempData.startDate.replace(/-/g,"/"));
					var objShowDate = new Date(day.replace(/-/g,"/"));
					var objCurentDate = new Date();
					if (tempStartArray.length == 3 && tempEndArray.length == 3) {
						//若开始时间比今天小，开始时间为今天
						if (objCurentDate > objStartDate) {
							startEndTime = (objShowDate.getMonth()-0+1)+"月"+objShowDate.getDate()+"日 "+tempData.startTime.toString().substring(0,timeLength-2)+":"+tempData.startTime.toString().substring(timeLength-2,4);							
						} else {
							startEndTime = tempStartArray[1]+"月"+tempStartArray[2]+"日 "+tempData.startTime.toString().substring(0,timeLength-2)+":"+tempData.startTime.toString().substring(timeLength-2,4);
						}
						startEndTime +=	"-"+tempEndArray[1]+"月"+tempEndArray[2]+"日 "+tempData.endTime.toString().substring(0,timeLength-2)+":"+tempData.endTime.toString().substring(timeLength-2,4);
					}
					
					
					tmpHtml +=	'<div class="clist">';
					tmpHtml +=		'<p class="time">'+startEndTime+'</p>';
					tmpHtml +=		'<i class="i-welcalendar"></i><span style="padding-left: 5px;">'+tempData.title+'</span>';
					tmpHtml +=	'</div>';
					top += 20;
				}
			}
			tmpHtml +=		'</div>';
			tmpHtml += '</div>';
		}
		tmpHtml += '</div>';
		if (maxCount == 5) {
			tmpHtml = '<div class="timeLinewrap">';
			//tmpHtml += '<a href="javascript:void(0)" onClick="parent.MM[parent.gConst.home].goCal()" class="more">查看所有日程&gt;&gt;</a>';
			tmpHtml += '<div style="padding: 93px 20px 40px 220px;position: relative;height: 8px;overflow: hidden;margin-right: 20px;">您还没有安排活动，马上去<a href="javascript:void(0)" onClick="parent.MM[parent.gConst.home].goCal()" >创建活动</a></div>';
			tmpHtml += '';
			tmpHtml += '</div>';
		}
		return tmpHtml;
	},
	/**
	 *时间格式转换
	 */
	getCalDay: function (day) {
		if (!day) {
			return "";
		}
		var oDate = new Date(day.replace(/-/g,"/"));
		var nowDate=new Date(); 
		var tempDate=new Date(); 
		//得到明天和后天的毫秒数 
		var secondTommorrow = tempDate.setDate(nowDate.getDate()+1);
		var secondAfterTommorrow = tempDate.setDate(nowDate.getDate()+2);
		if (nowDate.toLocaleDateString() == oDate.toLocaleDateString()) {
			return "今天";
		} else if (new Date(secondTommorrow).toLocaleDateString()==oDate.toLocaleDateString()) {
			return "明天";
		} else if (new Date(secondAfterTommorrow).toLocaleDateString()==oDate.toLocaleDateString()) {
			return "后天";
		}

		var tempArray = day.split("-");
		if (oDate.getYear()-nowDate.getYear() == 1) { //跨年度，2103年10月30日
			return day;
		} else if (tempArray.length == 3) { //10月30日
			return tempArray[1]+"月"+tempArray[2]+"日";
		}
		return day;
	},
	/**
     * 加载home页面数据
     */
	loadHomeData: function (childDocument) {
		var This = this;
		var folders = CM.folderMain[gConst.dataName];
		var topTipsContainer = jQuery("#custom_home_topTips",childDocument)[0];
		if (topTipsContainer) {
			topTipsContainer.innerHTML = "";
			topTipsContainer.innerHTML +='<a style="display:none;" id="custom_home_newMailCount_a" href="javascript:void(0);" onClick="parent.CC.goFolder(1, parent.GE.folderObj.inbox); return false;">收件箱（<var class="col_orange" id="custom_home_newMailCount_sys1">Loading</var>）</a>';
		} else {
			return;
		}
		
		for(var z=0;z<folders.length;z++){
			var cur = folders[z];
			if(cur.fid > 9 && (cur.type==3 || cur.type == 6)){
				var unreadMessageCount = cur.stats.unreadMessageCount;
				if ((unreadMessageCount-0) > 0)
				{
					var objA = childDocument.createElement('a');
					//objA.className = "ml_20";
					objA.setAttribute("fid",cur.fid);
					objA.setAttribute("folderPassFlag",cur.folderPassFlag);
					objA.setAttribute("href","javascript:void(0);");
					objA.onclick = function () {
						var fid = jQuery(this)[0].getAttribute("fid");
						var passFlag = jQuery(this)[0].getAttribute("folderPassFlag");
						if(passFlag == "1" && parent.gMain.lock_close){
							var o = {};
							o.obj = jQuery("#"+fid);
							o.p = this;
							o.id = id;
							o.url = function () {
								parent.CC.goFolder(fid, "user"+fid);
							};
							folderlock.unlocked(0,"leftLock",o); //跳到安全锁页面 lock.js 解锁 
						} else {
							parent.CC.goFolder(fid, "user"+fid);
						}
					}
					objA.innerHTML = cur.name+'（<var class="col_orange">'+unreadMessageCount+'</var>）</a>';
					if (topTipsContainer) {
						topTipsContainer.appendChild(objA);
					}
				}
			}
		}

		//jQuery("#custom_home_topTips",childDocument)[0].innerHTML = tempHtml;
		//收件箱未读邮件
		var unreadMessage = jQuery("#custom_home_newMailCount_sys1",childDocument)[0];
		if (unreadMessage) {
			var unReadCount = parent.MM[gConst.folderMain].Folders.sys[0].stats.unreadMessageCount;
			var objSys1 = jQuery("#custom_home_newMailCount_a",childDocument);
			if ((unReadCount-0)>0) {
				objSys1.show();
			} else {
				objSys1.hide();
			}
			unreadMessage.innerHTML = unReadCount;
		}
	},
    /**
     * 获取模板数据
     */
    getData: function(){
        return this.datas;
    },
    /**
     * 设置模板需要使用的数据
     * @param d {object} hash表
     */
    setData: function(d){
        if(typeof d == 'object'){
            this.datas = d;
        }
    },
    updateCallback: function(){
        this.loadedCallback();
    },
    /**
     * 收集模板需要使用的最新数据
     */
    gatherData: function(){
        var d = this.datas;
        var md = CC.getMailInfo();
        for(var k in md){
            d[k] = md[k];
        }
        try{
            var now = new Date();
			// 写入上次登录地点
			var tempLastLoginCity="";
			if(parent.lastLoginCity && parent.lastLoginCity != ""&&parent.lastLoginIp) {
				tempLastLoginCity = parent.lastLoginCity+" ("+parent.lastLoginIp+")";
			}
            // 写入上次登录时间
            d['lastLoginTime'] = parent.lastLoginTime;
			d['lastLoginIp'] = tempLastLoginCity;
            // 写入问候语
            d['timeWord'] = this.getWelcome(now);
            // 处理无限容量
            var showTotal = md.totalSize;
            showTotal = showTotal.replace(" ","");
            if ( showTotal =="UNLIMITED") {
                d['isUNLIMITED'] = Lang.Mail.Unlimited;
                d['unlimitedPlaceholder'] = '';
            }
        }
        catch(e){

        }
    },
    /**
     *根据不同的时间段，得到不同的问候语
     */
    getWelcome: function(now){
        var hour = now.getHours();
        var Lang = parent.Lang;
        if (hour < 6) {
            return Lang.Mail.home_Hello_0;               //凌晨好
        } else if (hour < 9) {
            return Lang.Mail.home_Hello_1;               //早上好
        } else if (hour < 12) {
            return Lang.Mail.home_Hello_2;               //上午好
        } else if (hour < 14) {
            return Lang.Mail.home_Hello_3;               //中午好
        } else if (hour < 17) {
            return Lang.Mail.home_Hello_4;               //下午好
        } else if (hour < 19) {
            return Lang.Mail.home_Hello_5;               //傍晚好
        } else if (hour < 22) {
            return Lang.Mail.home_Hello_6;               //晚上好
        } else {
            return Lang.Mail.home_Hello_7;               //深夜好
        }
    },
    /**
     * 合并数据，若存在则覆盖
     * @param d
     */
    mergeData: function(d){
        if(typeof d == 'object'){
            for(var k in d){
                if(typeof d[k] == 'string' || typeof d[k] == 'number'){
                    this.datas[k] = d[k];
                }
            }
        }
    },
    /**
     * 向主框架输出iframe字符串
     * @return {String}
     */
    getHtml: function(){
        var url = this.getUrl(GC.userType);
        var html = [];
        html[html.length] = CC.getIframe(this.name, url, 'auto');
        return html.join("");
    },
    /**
     * 获取iframe的地址
     * @return {*}
     */
    getUrl: function(){
        return gConst.mailHomeUrl;
    },
    /**
     * 更新模板
     */
    update: function(){
        this.gatherData();
        this.replaceTemplate();
        this.updateCallback();
        this.setHeight();
    },
    /**
     * 模板替换
     */
    replaceTemplate: function(){
        var host = this.host;
        if(host && host.document && host.document.body){
            var doc = host.document;
            var el_id, v;
            try{
                for(var k in this.datas)
                {
                    el_id = this.templatePrefix + k;
                    v = this.datas[k];
 					

					if( k == "totalSize"  ){
							 
						var unlimit =  this.datas.totalSize && this.datas.totalSize.indexOf("G")>=0 && parseInt( this.datas.totalSize, 10 ) >= 200;
						
						if( unlimit || this.datas.limitMessageSize == "UNLIMITED") {
							v =  Lang.Mail.Unlimited || "无限容量";
						}
						
					}
					
					/*if( k== "limitMessageSize" ){
						v = Lang.Mail.Unlimited || '无限容量';
					}*/

                    if(doc.getElementById(el_id)){
                        doc.getElementById(el_id).innerHTML = v;
                    }
                }
            }
            catch(e){

            }
        }
        
        //首页(欢迎页) 收件数量信息
        var topTipsContainer=jQuery("#ifrm_home").contents().find(".gwel-info p")[0];
		if(topTipsContainer){
			//首页 页面收件箱数量信息
			topTipsContainer.style.wordWrap="break-word";
			topTipsContainer.style.overflow="hidden";
        	topTipsContainer.innerHTML=" <i class='i-symail' style='position: relative;margin-bottom: 3px;'></i><a href='javascript:void(0)' style='font-size: 14px; font-weight:200; margin-right:8px; width:auto;' onclick='parent.MM.home.receiveMail();return false;'>您有<var id='custom_home_unreadMessageCount'>loading</var>封新邮件</a>";
	        var folders=CM.folderMain[gConst.dataName];
	        var v=0;
	        for (var z = 0; z < folders.length; z++) {
				var cur = folders[z];
				if ((cur.stats.unreadMessageCount > 0)&&(cur.type != 6) && (cur.folderColor == 0)&& (cur.fid != 4)) {
					v += cur .stats.unreadMessageCount;
				}
	    	}
	        var unreadMessageCount = jQuery("#ifrm_home").contents().find("#custom_home_unreadMessageCount")[0];
	        if(unreadMessageCount){
				unreadMessageCount.innerHTML=v;
			}

			//分类邮件夹 代收邮件数量信息
	       	var num=0,html1="",html="";
	       	for (var z = 0; z < folders.length; z++) {
				var cur = folders[z];
				if ((cur.stats.unreadMessageCount > 0) && (cur.type == 6)) {
					if(num>0){
						num++;
						html +="  <a href='javascript:void(0)' style='font-size: 14px; font-weight:200; margin-right:15px;' onclick='parent.CC.searchNewMail("+cur.fid+", true, undefined, undefined);return false;'>"+cur.name+"(&nbsp;"+cur.stats.unreadMessageCount+"&nbsp;)</a>"
					}else{
						num++;
						html1+="  <a href='javascript:void(0)' style='font-size: 14px; font-weight:200; margin-right:15px;' onclick='parent.CC.searchNewMail("+cur.fid+", true, undefined, undefined);return false;'>"+cur.name+"(&nbsp;"+cur.stats.unreadMessageCount+"&nbsp;)</a>";
					}
				}
	    	}
	    	if(num>2){
	    		topTipsContainer.innerHTML +=html1+"<a href='javascript:void(0)' class='showhide' style='color:#999999; font-size: 10px; font-weight:100; margin-left:-12px;' id='ssd' onclick='parent.MM.home.showhide(this);return false;'>显示更多&gt;&gt;</a><span style='word-wrap:break-word; display:none'>   "+html+"</span>";
			}
			else{
				topTipsContainer.innerHTML +=html1+html;
			}
	    	/*var num=0,html1="",html="";
	        for (var z = 0; z < folders.length; z++) {
				var cur = folders[z];
				if ((cur.stats.unreadMessageCount > 0)&&(cur.type == 3)) {
					if(num>0){
						num++;
						html +="  <a href='javascript:void(0)' style='font-size: 14px; font-weight:200; margin-right:15px;' onclick='parent.CC.searchNewMail("+cur.fid+", true, undefined, undefined);return false;'>"+cur.name+"(&nbsp;"+cur.stats.unreadMessageCount+"&nbsp;)</a>"
					}else{
						num++;
						html1+="  <a href='javascript:void(0)' style='font-size: 14px; font-weight:200; margin-right:15px;' onclick='parent.CC.searchNewMail("+cur.fid+", true, undefined, undefined);return false;'>"+cur.name+"(&nbsp;"+cur.stats.unreadMessageCount+"&nbsp;)</a>";
					}
				}
	    	}
	    	if(num>2){
	    		topTipsContainer.innerHTML +=html1+"<a href='javascript:void(0)' class='showhide' style='color:#999999; font-size: 8px; font-weight:100; margin-left:-12px;' id='ssd' onclick='parent.MM.home.showhide(this);return false;'>显示更多&gt;&gt;</a><span style='word-wrap:break-word; display:none'>   "+html+"</span>";
			}
			else{
				topTipsContainer.innerHTML +=html1+html;
			}*/
			var pheight=jQuery("#ifrm_home").contents().find(".gwel-info p").height();
			if(pheight<70){
    			jQuery("#ifrm_home").contents().find(".gwel-info p")[0].style.marginBottom="10px";
    			jQuery("#ifrm_home").contents().find(".gwel-info")[0].style.height="110px";
    		}else if(pheight>70){
    			jQuery("#ifrm_home").contents().find(".gwel-info")[0].style.height="auto";
    			jQuery("#ifrm_home").contents().find(".gwel-info")[0].style.minHeight="110px";
    			jQuery("#ifrm_home").contents().find(".gwel-info p")[0].style.marginBottom="10px";
    		}
		}
    },

    showhide:function(_this){
    	var anextspan=jQuery(_this).next()[0].style.display;
    	if(anextspan=="inline"){
    		_this.innerHTML="显示更多&gt;&gt;";
    		jQuery(_this).next()[0].style.display="none";
    		var pheight=jQuery("#ifrm_home").contents().find(".gwel-info p").height();
    		if(pheight<70){
    			jQuery("#ifrm_home").contents().find(".gwel-info p")[0].style.marginBottom="10px";
    			jQuery("#ifrm_home").contents().find(".gwel-info")[0].style.height="110px";
    		}
    	}else{
    		jQuery("#ifrm_home").contents().find(".gwel-info p > span").css({display:"none"});
    		jQuery("#ifrm_home").contents().find(".gwel-info p > .showhide").css("color","#CCC").html("显示更多&gt;&gt;");
    		_this.innerHTML="隐藏&lt;&lt;";
    		jQuery(_this).next()[0].style.display="inline";
    		var pheight=jQuery("#ifrm_home").contents().find(".gwel-info p").height();
    		if(pheight>70){
    			jQuery("#ifrm_home").contents().find(".gwel-info")[0].style.height="auto";
    			jQuery("#ifrm_home").contents().find(".gwel-info")[0].style.minHeight="110px";
    			jQuery("#ifrm_home").contents().find(".gwel-info p")[0].style.marginBottom="10px";
    		}
    	}
    	
    },
    // 本邮箱未读邮件数量 （除代收邮件） 
    receiveMail:function(){
	    var ps = parent.CC.getPageSize();
	    var opt = null;
	    var fid = 0;
	    var cond = null;
	    var flags = {read:1}; 
	    var isFullSearch=2; 
	    var isLoadNoReadMail=false;
	    var key = ""; 
	    parent.GE.currentFid = fid;
	    parent.GE.searchFlag = flags;
	    isFullSearch = typeof(isFullSearch) == "undefined" ? 2 : isFullSearch;
	    var order = parent.GE.list.order;
	    var desc = 1;
	    var recursive = 0;
	    var ignoreCase = 0;
	    var total = parent.CC.getPageSize();
	    var searchParam = {
	        fid: fid,
	        order: order,
	        desc: desc,
	        recursive: recursive,
	        condictions: cond,
	        flags: flags,
	        total: total,
	        start: 1,
	        ignoreCase: ignoreCase,
	        isSearch: 1,
	        statType: 1,
	        isFullSearch: isFullSearch
	    };

	    /*if (sentDate) {
	        searchParam.sentDate = sentDate;
	    }

	    if (label) {
	        searchParam.label = label;
	    }*/
	    //屏蔽删除邮件
        searchParam.exceptFids = [4];

	    var folders=CM.folderMain[gConst.dataName];
	        var v=[];
	        for (var z = 0; z < folders.length; z++) {
				var cur = folders[z];
				console.log(cur.label);
				if ((cur.stats.unreadMessageCount > 0)&&(cur.type == 6)) {
					v[v.length]= cur.fid;
				}
	    	}

	    searchParam.exceptFids = v;

	    if (key) {
	       parent.GE.searchKey = key;
	    } else {
	        parent.GE.searchKey = "";
	    }
	    parent.GE.searchData = searchParam;
	    parent.CC.searchMail(searchParam, isLoadNoReadMail);
	},
    
    /**
     * 框架调整大小时触发函数
     */
    resize: function(){
        this.setHeight();
    },
    /**
     * 设置iframe高度
     */
    setHeight: function(){
        var p = this;
        setH();
        function setH(){
            var h = CC.docHeight() - GE.pos()[1];
            if (h > 0) {
                var contentH = h;
                var ifrm = GMC.getFrameObj(p.name);
                El.height(ifrm, contentH);
            } else {
                window.setTimeout(setH, 200);
            }
        }
    },
    loadedCallback: function(){
        var This = this;
		if(!This.host){
            return;
        }

		
        var doc = This.host.document;
		parent.MM[parent.gConst.home].doc=doc;
        var volume = "";
		var	needTips = false;
        var usedPercent = this.datas['usedPercent'] || 0;
        var totalSize = this.datas['totalSize'] || '';
        if(usedPercent.indexOf('%')){
            usedPercent = usedPercent.replace(/%/ig, '');
        }
        usedPercent = (usedPercent - 0);
        if(usedPercent > 80 && usedPercent < 100){
            volume = '<div>提醒：您的邮箱容量即将达到上限{0}，请<span id="clear" class="c_ff6600 pl_5 pr_5">清理邮件</span>或';
			volume+= '<span id="contact" class="c_ff6600 pl_5 pr_5">联系管理员升级容量</span>。<a id="closeVolume2" onclick="parent.MM[parent.gConst.home].closeVolumeTips()" href="javascript:void(0)">关闭提醒</a></div>';
            needTips = true;
        }
        else if(usedPercent >= 100){
            volume = '<div>提醒：您的邮箱容量已满，已达到上限{0}，请<span id="clear" class="c_ff6600 pl_5 pr_5">清理邮件</span>或';
			volume+= '<span id="contact" class="c_ff6600 pl_5 pr_5">联系管理员升级容量</span>。<a id="closeVolume2" onclick="parent.MM[parent.gConst.home].closeVolumeTips()" href="javascript:void(0)">关闭提醒</a></div>';
            needTips = true;
        }

        
		
		if (doc)
		{
			This.loadHomeData(This.childDocument);
            /*
			var objTipsContainer = jQuery('#top_tips_container', doc);
			//isFirstRun防止滚动条对象多次初始化
			if (objTipsContainer.attr("isFirstRun")!="false") {
				objTipsContainer.attr("isFirstRun","false").css({
					'line-height': '24px',
					'border-bottom': 'dash 1px gray'
				}).show();
				
				var marqueeContent = new Array();   //滚动标题
				var forgetpassword = window.forgetpwd || "0";
				if (typeof(isSetUserQuestion)!="undefined"&&isSetUserQuestion != "true"&& forgetpassword =="1") {
					var url = gMain.webPath+"/se/account/accountindex.do?sid="+gMain.sid+"&mode=Mobile";
					marqueeContent[0] = '<div>消息：未设置帐号密码保护。 <a href="javascript:void(0);" onclick="parent.MM[parent.gConst.home].setUserQuestion()" id="setUserQuestion" class="f12red">立即设置</a><br></div>'.decodeHTML();
				}
				if (volume != "") {
					//marqueeContent[1] = volume.format(totalSize);
					marqueeContent.push(volume.format(totalSize));
				}
				
				var objMarqueeContent = new MarqueeContent({
					doc:doc,
					marqueeContent:marqueeContent
				});
				parent.MM[parent.gConst.home].objMarqueeContent=objMarqueeContent;
				if (marqueeContent.length==0){
					var objTipsContainer = jQuery('#top_tips_container', parent.MM[parent.gConst.home].doc);
					objTipsContainer.hide();
				}
			}
            */
		}
    },
	closeVolumeTips: function (doc) {
		var tempItems = parent.MM[parent.gConst.home].objMarqueeContent.contentItem;//.splice(1,1);
		var tempLength = tempItems.length;
		var isExsit;
		var removeIndex;
		if (tempLength > 0) {
			for (var i = 0; i < tempLength; i++) {
				isExsit = jQuery(tempItems[i]).find("a[id='closeVolume2']")[0];
				if (isExsit) {
					removeIndex = i;
					break;
				}
			}
			if (isExsit) {
				tempItems.splice(removeIndex,1);
			}
			//不存在滚动内容时，隐藏父容器
			if (tempItems.length == 0) {
				var objTipsContainer = jQuery('#top_tips_container', parent.MM[parent.gConst.home].doc);
				objTipsContainer.hide();
			}
			parent.MM[parent.gConst.home].objMarqueeContent.refresh();
		}
	},
	setUserQuestion: function () {
		top.location.href = gMain.webPath+"/se/account/accountindex.do?sid="+gMain.sid+"&mode=PassSec";
	}
};
