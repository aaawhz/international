/**
 * 公共通讯数据加载类<br>
 * 一个单实例类：LMD <br>
 * @class
 */
function LinkManDialog(){	
	this.id				= 'selectLinkMan';
    this.searchDivId    = "dd_search";
    this.displayDivId   = "dd_display";
    this.searchKeyId    = "LMDSearchKey";
    this.searchDeleteId = "LMDSearchDelete";
    this.maxSearchLine  = 100;      //搜索时，显示的最大结果数
	this.loadCount 		= 3;		//重试次数
	this.loadTime       = 0;
	this.isUser 		= true;
	this.lastType 		= 1;
	this.lastGroup      = "-1";
	this.addrType       = 15;
	this.returnCallback	= null;
	this.rtb			= null;  
	this.selLinkMan 	= new Hashtable();	
	this.isComplete		= false;
	this.html 			= "";
	this.url            = "";
	this.addrDataPower  = [0,0,0,0,0,0];
	this.addrGroup 		= [];
	this.addrValue 		= [1,2,4,8,16,32];
	
	this.dataType 		= [];
	this.dataTypeValue	= ["email","mobile","fax"];
    this.listIndex      = {"tid":0,"id":1,"name":2,"email":3,"mobile":4,"fax":5,"word":6,"spell":7};
	this.groupIndex     = {"tid":0,"id":1,"name":2,"items":3};
    this.groupListIndex = {"tid":0,"gid":1,"lid":2};
    this.typeIndex      = {"EP":0,"CS":1,"PERSON":2,"MAILGROUP":3,"GROUPMEMBER":4,"RECENT":5};
    this.type			= 0;
	this.opt 			= {};
    this.isSearch       = false;
    
	this.personalGroupMap=[];//存储个人通讯录组
	this.emailGroupMap =[];//存储邮件组通讯录数据
    this.groupMap =[];//存储组（部门）对象
	this.group_contactListMap_mail=[];//存储组与人员关联对象(有邮件地址的人员对象)
	this.group_contactListMap_phone=[];//存储组与人员关联对象(有手机号码的人员对象)
    this.loadStatus=0;//判断通讯录数据是否加载完毕
    this.RecentContactsMap=[];//存储最近联系人列表对象
    this.deptPersonCount_mail=[];//每个部门下的所有人数，含所有子部门；
    this.deptPersonCount_phone=[];//每个部门下的所有人数，含所有子部门；
    this.emailGroupCount=[];//邮件组数量统计
    this.userContancts = [];//存储个人通讯录数据，用以判断发信的联系人是否已经保存；
    this.orgContactList_autoFile = [];
	this.allContactList_autoFile =[];
    this.init = function(){
        this.addrGroup = Lang.Mail.addr_AddrType.split(",");
    	this.dataType = Lang.Mail.addr_ValueType.split(",");
        var sid = gMain.sid;
    	this.dataUrl =gMain.webPath+"/service/contacts";// "http://oa.se139.com/addr/alldept.do";//gConst.addrApiUrl;
    	//this.dataUrl += "?sid=" + sid;
    	//this.dataUrl = GC.rfUrl(this.dataUrl);  
        this.initHtml();
    };
   
	this.initHtml = function(){	
		var ah = [];
		ah[ah.length] = '<div class="pageConectDialog" id="LMDDiv"><dl>';
		ah[ah.length] = '<dt>'+Lang.Mail.addr_SelectAddrItem+'<span>('+Lang.Mail.addr_SelectAddrItemTips+')</span>';
        ah[ah.length] = '<div class="searchArea"><div id="searchButton" class="searchInput">';
        ah[ah.length] = '<div><input type="text" value="" title="" id="'+this.searchKeyId+'" name="'+this.searchKeyId+'" class="searchInput" maxlength="20"></div>';
        ah[ah.length] = '<a id="'+this.searchDeleteId+'" class="" href="javascript:fGoto();"></a></div></div>';
        ah[ah.length] = '</dt>';
        ah[ah.length] = '<dd class="dd1">';
		ah[ah.length] = '<ul id="ulTabs">';
		for(i=0;i<this.addrGroup.length;i++){
			if (i == 0) {
				ah[ah.length] = '<li id="addrGroup_'+(i+1)+'" onclick="LMD.fillGroup('+(i+1)+');" class="on" style="display:none;">'+this.addrGroup[i]+'</li>';
			}else{
				ah[ah.length] = '<li id="addrGroup_'+(i+1)+'" onclick="LMD.fillGroup('+(i+1)+');" style="display:none;">'+this.addrGroup[i]+'</li>';
			}
		}
		ah[ah.length] = '</ul>';
		ah[ah.length] = '<div class="scWrapper">';
        /*正常模式*/
        ah[ah.length] = '<div id="'+this.displayDivId+'">';
		ah[ah.length] = '<div class="nav" id="LMDdivGroup"></div>';
		ah[ah.length] = '<span class="select"><select id="LMDSelect" name="LMDSelect" ondblclick="LMD.addSel(\'LMDSelect\');" onkeydown="LMD.doKeyDown(\'LMDSelect\',0);" multiple size="7"></select></span>';
		ah[ah.length] = '</div>';
        /*搜索模式*/
        ah[ah.length] = '<div id="'+this.searchDivId+'" style="display:none;">';
		ah[ah.length] = '<div class="searchSelect" id="LMDSearchResult"><select id="LMDSearchSelect" name="LMDSearchSelect" ondblclick="LMD.addSel(\'LMDSearchSelect\');" onkeydown="LMD.doKeyDown(\'LMDSearchSelect\',0);" multiple size="7"></select></div>';
		ah[ah.length] = '<span class="searchSelect" id="LMDSearchNoResult" style="display:none;"></span>';
        ah[ah.length] = '</div>';  
        ah[ah.length] = '<div class="action">';
		ah[ah.length] = '<a class="btn" href="javascript:fGoto();" onclick="LMD.addAll();"><b class="r1"></b><span class="rContent"><span>'+Lang.Mail.addr_AddAllItem+'</span></span><b class="r1"></b></a>';
		ah[ah.length] = '<a class="btn" href="javascript:fGoto();" onclick="LMD.addSel();"><b class="r1"></b><span class="rContent"><span>'+Lang.Mail.addr_AddSelItem+'</span></span><b class="r1"></b></a>';
		ah[ah.length] = '<a class="btn" href="javascript:fGoto();" onclick="LMD.refresh();"><b class="r1"></b><span class="rContent"><span>'+Lang.Mail.addr_Fresh+'</span></span><b class="r1"></b></a>';
		ah[ah.length] = '</div></div></dd>';
        
		ah[ah.length] = '<dt>'+Lang.Mail.addr_SelectAddrItem+'<span>('+Lang.Mail.addr_SelectAddrItemTips+')</span></dt>';
		ah[ah.length] = '<dd class="dd0">';
		ah[ah.length] = '<div class="scWrapper">';
		ah[ah.length] = '<span class="select"><select id="LMDSelected" name="LMDSelected" ondblclick="LMD.removeSel();" onkeydown="LMD.doKeyDown(1);" multiple size="6"></select></span>';
		ah[ah.length] = '<div class="action">';
		ah[ah.length] = '<a class="btn" href="javascript:fGoto();"  onclick="LMD.removeAll();"><b class="r1"></b><span class="rContent"><span>'+Lang.Mail.addr_DelAllItem+'</span></span><b class="r1"></b></a>';
		ah[ah.length] = '<a class="btn" href="javascript:fGoto();"  onclick="LMD.removeSel();"><b class="r1"></b><span class="rContent"><span>'+Lang.Mail.addr_DelSelItem+'</span></span><b class="r1"></b></a>';
		ah[ah.length] = '</div></div></dd></dl>';
		ah[ah.length] = '<p class="action">';
		ah[ah.length] = '<a class="btn" href="javascript:fGoto();"  onclick="LMD.ok();"><b class="r1"></b><span class="rContent"><span>'+Lang.Mail.Ok+'</span></span><b class="r1"></b></a>';
		ah[ah.length] = '<a class="btn" href="javascript:fGoto();"  onclick="LMD.hide();"><b class="r1"></b><span class="rContent"><span>'+Lang.Mail.Close+'</span></span><b class="r1"></b></a>';
		ah[ah.length] = '</p></div>';
		this.html = ah.join("");
	};
    
    //调用初始化方法
    this.init();
	
	this.initGroup = function(){
		for(var it=1;it<this.addrGroup.length+1;it++){
			var m = this.addrValue[it-1];
			if((m&this.addrType)&&this.addrDataPower[it-1]){
				$("addrGroup_"+it).style.display = "";
                //$("addrGroupSearch_"+it).style.display = "";
			}
		}
	};
	
	this.fillGroup = function(tid){
		var p = this;
        if(p.isSearch){
           p.changeDiv(0); 
        }
		if (!tid){
	        tid = p.lastType;
	    } 
		for(var it=1;it<p.addrGroup.length+1;it++){
			if(it==tid){
				$("addrGroup_"+it).className = "on";
			}else{
				$("addrGroup_"+it).className = "";
			}	
		}
		var divGroup = $("LMDdivGroup");
		var htmlArray = [],i=0;
		var gd = p.listDataTree[tid];
		htmlArray[0] = '<a href="javascript:fGoto();" onclick="LMD.fillLink(\''+tid+'\',\'-1\')">'+Lang.Mail.addr_All+'</a>';	
        for (var n in gd) {
            var go = gd[n];
            var gid = go.Gid;
            var gname = go.Gname;
            htmlArray[i + 1] = '<a href="javascript:fGoto();" onclick="LMD.fillLink(\'' + tid + '\',\'' + gid + '\');">' + gname + '</a>';
            i++;
        }
		divGroup.innerHTML = htmlArray.join('');
		p.fillLink(tid,"0");
	};
	this.fillLink = function(tid,gid){
	    var p = this;
		if (!tid){
	        tid = p.lastType;
	    } 
		if(!gid){
			gid = p.lastGroup;
		}
	    p.lastType = tid;
		p.lastGroup = gid;
		var i = 0,n,linkman,v,isExt;
		var lmdSelect = $("LMDSelect");	
		var valueType = p.dataTypeValue[p.type];
        var groupDatas = p.listDataTree[tid];
        var items = null,len=0,item = null;
		p.clearOption(lmdSelect);
		if (gid == "0"){	
            for (var gn in groupDatas) {
                 items = groupDatas[gn].items;
                 len = items.length;
                 for (i = 0; i < len; i++) {
                    item = items[i];
                    v = item[valueType];			                
                    addLink(item.id,item.name,v);
                 }
            }		
		}else{	
            items = groupDatas[gid].items;
            len = items.length;
            for (i = 0;i<len; i++) {
                item = items[i];
                v = item[valueType];			                
			    addLink(item.id,item.name,v);
            }
		}
        
        function addLink(id,n,v){
            var name = "";               
		    var isExt = p.checkIsExist(id,v);
	        if (!isExt && v){
				name = n + " " + v;
				if(n!=""&&v!=""){
					p.addOption(lmdSelect,id,name,v); 
				}
            }
        }
		
		if(lmdSelect.options.length>0){
			lmdSelect.options[0].selected = true;
		}
	};
	this.addOption = function(sel,id,name,value){
		var item = new Option(name,value);
		item.id = id;
		sel.options.add(item);	
	};
    this.addItem = function(sel,item){
        if(item){
            var v = item.value;
            var id = item.id;
            var isExt = this.checkIsExist(id,v);
            if(!isExt){
    			var n = item.name + " " + v;
    			if(item.name!=""&&v!=""){
    				this.addOption(sel,id,n,v); 
    			}
            }
        }		
    };
	this.clearOption = function(sel){
		for(var i=sel.options.length;i>-1;i--){
			var item = sel.options[i];
			if(item){
				sel.removeChild(item);
			}	
		}
	};
	
    this.getLinkManByValue = function(value){
        var p1 = this;
		value = value.trim();
        var valueType = p1.dataTypeValue[p1.type];
        var ld = p1.listData;
        for(var i=0;i<ld.length;i++){
           if(ld[i][valueType]==value){
               return ld[i];
           }
        }
        return "";
    };
    this.checkIsExist = function(id,val){
        return this.selLinkMan.contains(id)||this.selLinkMan.has(val);
    };
	
    this.add = function(vl){
        var p = this;
		var ha = [];
		var s = '';
		var selObj = $('LMDSelected');
		var n,v,linkman;
		vl = vl || [];
		for (var i = 0, l = vl.length; i < l; i++){
			linkman = p.getLinkManByValue(vl[i]);
			if (linkman != null){
				v = linkman[p.dataTypeValue[p.type]];
				n = linkman.name + " " + v;
				if(linkman.name!=""&&v!=""){
					p.addOption(selObj,linkman.id,n,v); 
				}  
				p.selLinkMan.add(linkman.id,v);    
		    }else if(vl[i] != null && vl[i] != ''){
				v = vl[i];
				n = v + " " + v;
				if(v!=""){
					p.addOption(selObj,v,n,v); 
				}  	       
		    } 
		}
	};
	
	this.addSel = function(){
		var p = this;
        var sid = p.isSearch?"LMDSearchSelect":"LMDSelect";
		var fromObj = $(sid);
		var toObj   = $('LMDSelected');
		var sel     = [];	
		var iSel    = 0;
		if(fromObj.length==0){
		    return false;
		}
		for (var i= 0,l=fromObj.length; i < l; i++){		    
		    var itemfrom = fromObj.options[i];
		    if (itemfrom.selected) {
				var id = itemfrom.id;
				var value = itemfrom.value.trim();
				var item = new Option(itemfrom.text, value);
				if (!p.checkIsExist(id,value)){
					item.id = id;
					toObj.options.add(item);
					p.selLinkMan.add(id,value);
				}
				sel[sel.length] = i;
				iSel = i;
			}                   
		}
		if(sel.length>0){
			toObj.options[0].selected = true;
		}
        if (!p.isSearch) {
            if (fromObj.options.length > 0) {
                iSel = (iSel - 1) > 0 ? iSel - 1 : 0;
                if (iSel > 0) {
                    fromObj.options[iSel].selected = true;
                }
            }
            for (var j = sel.length - 1; j > -1; j--) {
                var item1 = fromObj.options[sel[j]];
                if (item1) {
                    fromObj.removeChild(item1);
                }
            }
        }
	};

	this.addAll = function(){	      
	   	var p = this;
		var fromObj = $('LMDSelect');
        if(p.isSearch){
            fromObj = $('LMDSearchSelect');
        }
		var toObj   = $('LMDSelected');		
		if(fromObj.length==0){
		    return false;
		}
		for (var i = 0;i<fromObj.length; i++){    
		    var itemfrom = fromObj.options[i];
			var id = itemfrom.id;
			var value = itemfrom.value;
			var item = new Option(itemfrom.text, value);
			if(!p.checkIsExist(id,value)){			
				item.id = id;
				toObj.options.add(item);
				p.selLinkMan.add(itemfrom.id, itemfrom.value);
			}
		}
		fromObj.options[0].selected = true;
		p.clearOption(fromObj);
	};
	
	this.removeSel = function(){	
	    var fromObj = $('LMDSelected');
        //if()
		var iSel = 0;	
		if(fromObj.length==0){
		    return false;
		}
		for (var i = fromObj.length - 1; i > -1; i--){	
		    var itemfrom = fromObj.options[i];
		    if (itemfrom.selected){	  
		        fromObj.removeChild(itemfrom);
				this.selLinkMan.remove(itemfrom.id);
				iSel = i;
		    }           
		}
		if(fromObj.options.length>0){
			iSel = (iSel-1)>0?iSel-1:0;
			fromObj.options[iSel].selected = true;
		}
	    this.fillLink();   
	};
	
	this.removeAll = function()	{
	    this.clearOption($('LMDSelected'));
	    this.selLinkMan.clear();
	    this.fillLink();
	};
	this.doKeyDown = function(id,t){
		var ev = EV.getEvent();
		var kc = EV.getCharCode(ev);
		if(kc==46){
			if(t){
				LMD.removeSel(id);
			}else{
				LMD.addSel(id);
			}
		}
	};
	
	/**
	 * 显示选择联系人对话框
	 * @param {Object} rtb			text的对象
	 * @param {Object} callback		确定按钮回车事件
	 * @param {number} type	联系人类型(0:邮件地址,1:手机号码,2:传真号码)
	 * @param {number} valueType (1:个人通讯录，2:客户通讯录，4:企业通讯录，8:邮件组列表，16:邮件组成员,32:最近联系人)
	 * @param {Object} opt 其它参数选项。max:最大可以选择的人数
	 * @example
	 * <code>
	 *  LMD.show(obj,function(){},0);
	 * </code>
	 */
	this.show = function(rtb,callback,type,valueType,opt){
		if(!this.isComplete){
			CC.alert(Lang.Mail.addr_AddrNotComplate);
			return;
		}
		var p1 =this;
		if(typeof(opt)=="object"){
			LMD.opt = opt;
		}
		type = type || 0;
		p1.type = type;
		if (valueType) {
			p1.addrType = valueType;
		}
		var title = Lang.Mail.addr_SelectLinkMan+this.dataType[type];
		var ao = {
            id : this.id,
            title : title,
            text : this.html,
			width:560,
			zindex : 1100,
            buttons : []
    	};
		CC.msgBox(ao);
		this.selLinkMan.clear();
		var s = rtb.value;
		if (!s){
		    s = '';
		}
		s = s.replace(/;/gi, ',');
		s = s.replace(/^,|,$/gi,'');
		var sell = s.split(',');
		if(s&&sell&&sell.length>0){
		    this.add(sell);
		} 
		this.rtb = $(rtb);
		this.returnCallback = callback;
		this.initGroup();
	    this.fillGroup(1);
        this.initSearch();
	};
	this.refresh = function(){
	    this.loadData();
		this.fillGroup();
	};
	this.hide = function(){
		CC.closeMsgBox(LMD.id);
	};
	
    this.ok = function(){              
        var sel = [];
		var max = LMD.opt.max;
        var fromObj = $('LMDSelected');	
        for (var i = 0, l = fromObj.options.length; i < l; i++){
            sel[i] = fromObj.options[i].value;
        }
		if(typeof(max)=="number"&&max>0){
			if(sel.length>max){
				CC.alert(Lang.Mail.addr_MaxSelect.format(max));
				return;
			}
		}
        var v = sel.join(',');
        if(this.rtb){
            this.rtb.value = v;
        }
        this.hide();
        if (this.returnCallback){
		    this.returnCallback(v);
        }
		if(this.rtb){
			GC.textChange(this.rtb);
			this.rtb.focus();	
		}	
    };
    this.changeDiv = function(v){
        var p = this;
        v = v || 0;
        if (v == 0) { //0为没有搜关键字，非搜索模式
            LMD.isSearch = false;
            $(LMD.searchKeyId).value = "";
            $(LMD.searchDeleteId).className = "";
            $(LMD.searchDivId).style.display = "none";
            $(LMD.displayDivId).style.display = "";   
        } else {  //搜索模式
            LMD.isSearch = true;
            $(LMD.searchDeleteId).className = "searchDelete";
            $(LMD.searchDivId).style.display = "";
            $(LMD.displayDivId).style.display = "none";
            
        }
    };
    this.initSearch = function(){              
        var p = this;
        var text = $(p.searchKeyId);
        var dt = p.dataTypeValue[p.type];
        var data = AutoFill.datas[dt];
        var sel = $("LMDSearchSelect");
        var noResult = $("LMDSearchNoResult");
        El.show($("LMDSearchResult"));
        El.hide(noResult);
        var ap = {
            div: p.searhDiv,
            line: 20,
            isSearch:1,
            single:true,
            statsCall:p.changeDiv,
            matchCall:function(data){
                if(data){
                    p.addItem(sel,data);
                }
            },
            changeCall:function(v,bv){
                p.clearOption(sel);
            },
            resultCall:function(n,v){
                v = v.encodeHTML();
                if(n==0){
                    El.hide($("LMDSearchResult"));
                    noResult.innerHTML = Lang.Mail.addr_SearchNoResult.format(v);
                    El.show(noResult);             
                }else{
                    El.hide(noResult);
                    El.show($("LMDSearchResult"));
                }
                
            }
        };
        var fill = new AutoFill(text,window,ap);
	    fill.data =  data;
	    fill.init(dt);
        p.fillData = data;
        EV.addEvent($(p.searchDeleteId), "click", function(){
            $(p.searchKeyId).value = "";
            p.changeDiv(0);
        });
        
       
    };
        
}


/**
 * 通讯录操作对象
 */
var LMD = new LinkManDialog();
var FS = new FileSelect();


/**
 * 初始始化通讯录类别数据
 */
LMD.initData = function(){
    this.isLoad = false;
    this.isComplete = false;
    this.listDataTree = [];    //通讯录树结构对象，直接直接遍历输出通讯录
    this.listData = [];        //通讯录原始数据
    this.groupData = [];       //所有通讯录组数据，带tid
    this.tempGroupLink = [];   //临时对象，保存组与联系人的关系
  
	
	for(var i=0;i<this.addrGroup.length+1;i++){
        this.listDataTree[i] = {};
        this.tempGroupLink[i] = {};
        //初始化未分组联系人
        this.listDataTree[i]["-1"] = [i,-1,Lang.Mail.Write.Others,[]];
        /*this.listDataTree[i]["-1"] = {
            Tid:i,
            Gid:'-1',
            Gname:Lang.Mail.Write.Others,
            items:[]
        };*/
        this.groupData[i]      = [];
		this.listData[i]       = [];
	}
    for(var j=0;j<this.dataTypeValue.length;j++){
        AutoFill.datas[this.dataTypeValue[j]] = [];
    }
};

/**
 * 将通讯录数据添加到缓存中
 * @param {Object} type  数据类型
 * @param {Object} deptId  部门ID
 * @param {Object} userid  用户ID
 * @param {Object} name   姓名
 * @param {Object} email  email
 */
LMD.addContact_Cache =function(type,deptId,userid,name,email)
{
	if(LMD.group_contactListMap_mail[type+"_"+deptId])
	{
		LMD.group_contactListMap_mail[type+"_"+deptId].push([type, userid, name, email, "", "", "" ,"" ,0]);
	}
	else
	{
		LMD.group_contactListMap_mail[type+"_"+deptId]=[];
		LMD.group_contactListMap_mail[type+"_"+deptId].push([type, userid, name, email, "", "", "" ,"" ,0]);
	}
	if (type == "2") {
		LMD.userContancts[userid] = "y";
	}
}
/**
 * 初始化通讯录组对象
 * @param {Object} gd 通讯录组对象
 */
LMD.initGroupData = function(gd){
    var gi = this.groupIndex;
    var len = gd.length;
    var iTid = gi["tid"];
    var iGid = gi["id"];
    var iName = gi["name"];
    for(var i=0;i<len;i++){
        var group = gd[i];
        var tid = parseInt(group[iTid],10);
        var gid = parseInt(group[iGid],10);
        //group.items = [];
        this.listDataTree[tid][gid] = [tid,gid,group[iName],[]];
        /*this.listDataTree[tid][gid] =  {
            Tid:tid,
            Gid:gid,
            Gname:group[iName],
            items:[]
        };*/
    }
   
};

/**
 * 初始化通讯录组与联系人关系数据
 * @param {Object} gl 联系人与组关系数组
 */
LMD.initGroupListData = function(gl){
    var gli = this.groupListIndex;
    var len = gl.length;
    var iTid = gli["tid"];
    var iGid = gli["gid"];
    var iLid = gli["lid"];
    for(var i=0;i<len;i++){
        var item = gl[i];
        var tid = item[iTid];
        var gid = item[iGid];
        var lid = item[iLid];
        this.tempGroupLink[tid][lid] = gid;
    }
};
LMD.initContactFilter= function(data)
{
	// 存储通讯录本地副本
    if(GE){
        GE.addressLocalStore = data;
    }
    this.groupMap =[];//存储组（部门）对象
	this.group_contactListMap_mail=[];//存储组与人员关联对象(有邮件地址的人员对象)
	this.group_contactListMap_phone=[];//存储组与人员关联对象(有手机号码的人员对象)
	this.RecentContactsMap=[];//存储最近联系人与邮件组数据，默认存储的是所有没有下级子数据的数据；
    this.loadStatus=0;//判断通讯录数据是否加载完毕
	this.userContancts=[];   
	this.orgContactList_autoFile = [];
	this.allContactList_autoFile =[];
	this.deptObj={};//存部门基本信息的;
	if(data=="")
	{
		this.loadStatus=1;
		return ;
	}
	var groupList = data[0];
	var group_contactList = data[1];
	var contactList = data[2];
	
	
	//存储的是每个组下面的子分组（不包含子分组下的分组），只限下一级；
	for (var i = 0; i < groupList.length; i++)
	{
		if(groupList[i][0]=="0")
			this.deptObj[groupList[i][1]] = groupList[i];
		//类型ID+组ID
		var gid = groupList[i][0]+"_"+groupList[i][3];
			if (!this.groupMap[gid]) {
				this.groupMap[gid]=[];
				this.groupMap[gid].push(groupList[i]);
			}
			else {
				this.groupMap[gid].push(groupList[i]);
			}
	}
	
	//存储联系人ID对应的人员对象 ：hash(联系人ID，联系人对象)
	var t1 =[];
	var t2 =[];
	var temp =[];
	var tempMyContact ={};
	var mailGroup=[];
	var userContact=[];
	var orgContact =[];
	for(var z = 0;z<contactList.length;z++)
	{
		var contactObj = contactList[z];
		
		if (contactObj[3] != "")
		{
			var mail = contactObj[3].decodeHTML();
			if(mail.indexOf("<")>0)//zhangsan<zhangsan@se.com>
			{
				var email = mail.substring(mail.indexOf("<")+1,mail.indexOf(">"));
				contactList[z][3] = email;
			}
			if (contactObj[0] == "5") {
				this.allContactList_autoFile.push({
					id: contactObj[3],
					name: contactObj[2],
					value: contactObj[3],
					word: contactObj[6],
					fullword: contactObj[7]
				});
			}
			if(contactObj[0]==3)
			{
				mailGroup.push({
					id: contactObj[3],
					name: contactObj[2],
					value: contactObj[3],
					word: contactObj[6],
					fullword: contactObj[7]
				});
			}
			if(contactObj[0] == 0)
			{
				orgContact.push({
					id: contactObj[3],
					name: contactObj[2],
					value: contactObj[3],
					word: contactObj[6],
					fullword: contactObj[7]
				});
				this.orgContactList_autoFile.push({
						id: contactObj[3],
						name: contactObj[2],
						value: contactObj[3],
						word: contactObj[6],
						fullword: contactObj[7],
						type:contactObj[0]
					});
			}
			if (contactObj[0] == 2) {
				userContact.push({
					id: contactObj[3],
					name: contactObj[2],
					value: contactObj[3],
					word: contactObj[6],
					fullword: contactObj[7]
				});
					this.orgContactList_autoFile.push({
						id: contactObj[3],
						name: contactObj[2],
						value: contactObj[3],
						word: contactObj[6],
						fullword: contactObj[7],
						type:contactObj[0]
					});
				}
				
			
		}
		if (contactObj[4] != "")//phone不为空
		{
				t2.push({
				id: contactObj[1],
				name: contactObj[2],
				value: contactObj[4],
				word: contactObj[6],
				fullword: contactObj[7]
			});
		}
		if(contactObj[0] == 5 || contactObj[0] == 3)
		{
			if(!this.RecentContactsMap[contactObj[0]])
			{
				this.RecentContactsMap[contactObj[0]]=[];
			}
			this.RecentContactsMap[contactObj[0]].push(contactObj);
			
		}
		else if(contactObj[0] == 0 || contactObj[0] == 2)
		{
			temp[contactObj[0]+"_"+contactObj[1]]=contactObj;
			if(contactObj[0] == 2 )
			{
				if(contactObj[3] != "")
					this.userContancts[contactObj[3]]="y";
				//tempMyContact[contactObj[1]]=contactObj;
			}
		}
	}
	
    this.allContactList_autoFile=this.allContactList_autoFile.concat(userContact,orgContact);
    if(gMain.hideMailGroup!="1"){
        this.allContactList_autoFile=this.allContactList_autoFile.concat(mailGroup);
    }
	for(var j=0;j<group_contactList.length;j++)
	{
		var user = temp[group_contactList[j][0]+"_"+group_contactList[j][2]];
		if(user)
		{
			/*
			if(user[0]=="2")
			{
				if(tempMyContact[user[1]])
				{
					delete tempMyContact[user[1]];
				}
			}*/
			
			if (user[3] != "") {//email不为空
			if (!this.group_contactListMap_mail[user[0]+"_"+group_contactList[j][1]]) {
				this.group_contactListMap_mail[user[0]+"_"+group_contactList[j][1]] = [];
				this.group_contactListMap_mail[user[0]+"_"+group_contactList[j][1]].push(user);
			}
			else {
				this.group_contactListMap_mail[user[0]+"_"+group_contactList[j][1]].push(user);
			}
			}
			if (user[4] != "")//phone不为空
			{
				if (!this.group_contactListMap_phone[user[0]+"_"+group_contactList[j][1]]) {
					this.group_contactListMap_phone[user[0]+"_"+group_contactList[j][1]] = [];
					this.group_contactListMap_phone[user[0]+"_"+group_contactList[j][1]].push(user);
				}
				else {
					this.group_contactListMap_phone[user[0]+"_"+group_contactList[j][1]].push(user);
				}
			}
		}
	}
	
	/*
	//个人通讯录未分组联系人
	this.group_contactListMap_mail["2_-1"]=[];
	this.group_contactListMap_phone["2_-1"]=[];
	for(var o in tempMyContact)
	{
		
		if(tempMyContact.hasOwnProperty(o))
		{
			var user = tempMyContact[o];
			if (user) {
				if (user[3] != "") {
					this.group_contactListMap_mail["2_-1"].push(tempMyContact[o]);
				}
				if (user[4] != "") {
					this.group_contactListMap_phone["2_-1"].push(tempMyContact[o]);
				}
			}
		}
	}
	*/
	AutoFill.datas["email"] = this.allContactList_autoFile;
	AutoFill.datas["mobile"] = t2;

	this.loadStatus=1;
}
/**
 * 初始化联系人数据
 * @param {Object} links 联系人信息数组
 *  0: tid 通讯录类型
    1:联系人id
    2:联系人姓名
    3:联系人邮箱地址
    4:手机号码
    5:传真号码
    6:姓名拼音首字母
    7:姓名拼音全拼

 */
LMD.initListData = function(links){
    var len = links.length;
    var di = this.listIndex;
    this.listData = links || [];
    var iId = di["id"];
    var iTid = di["tid"];
    var iName = di["name"];
    var iEmail = di["email"];
    var iMobile = di["mobile"];
    var iFax = di["fax"];
    var iWord = di["word"];
    var iItem = this.groupIndex["items"];
    var iSpell = di["spell"];
    for(var i=0;i<len;i++){
        var v = links[i];
        var tid = v[0];
        var lid = v[1];
        var gid = this.tempGroupLink[tid][lid] || "-1";
        v.Gid = gid;
        
        
        var t1 = AutoFill.datas["email"];
		var t2 = AutoFill.datas["mobile"];
		var t3 = AutoFill.datas["fax"];   
        
        //if (LMD.addrDataPower[tid - 1]) {
        //判断这个组是否在在，如果不存在将不初始化数据
        if (typeof this.listDataTree[tid][gid] == "object") {
            this.listDataTree[tid][gid][iItem].push(v);
        }
        //初始化自动完成类AutoFill全局数据
        if (Vd.checkData("email", v[iEmail])) {
            t1.push({
                id:v[iId],
                name: v[iName],
                value: v[iEmail],
                word: v[iWord],
                fullword:v[iSpell]
            });
        }
        if (Vd.checkData("mobile", v[iMobile])) {
            t2.push({
                id:v[iId],
                name: v[iName],
                value: v[iMobile],
                word: v[iWord],
                fullword:v[iSpell]
            });
        }
        if (Vd.checkData("phone", v[iFax])) {
            t3.push({
                id:v[iId],
                name: v[iName],
                value: v[iFax],
                word: v[iWord],
                fullword:v[iSpell]
            });
        }
    }
    //}
    var d1 = AutoFill.datas["email"];
	var d2 = AutoFill.datas["mobile"];
	var d3 = AutoFill.datas["fax"];   
    d1.data = d1.unique(function(v){
		return v.value + v.word + v.name;
	});
    d2.data = d2.unique(function(v){
		return v.value + v.word + v.name;
	});
    d3.data = d3.unique(function(v){
		return v.value + v.word + v.name;
	});
};


/**
 * 开始加载数据源
 * @param {funciton} loadCall 加载成功后回调函数
 */
LMD.loadData = function(loadCall){
	if (!LMD.isLoad && !LMD.isComplete) {
        LMD.isLoad = true;
        var obj = {
             url: LMD.dataUrl,
             func:"addr:autoWriteLetter",
			  method:"post",
			  isNotAddUrl:true,
            // method:"get",
			// param:"&sycn=1",
			 data:{sycn:(gMain.synMode?parseInt(gMain.synMode):0)},
             call: function(ld){
			 	LMD.initContactFilter(ld["var"]);
				LMD.isComplete = true;
                /* var st = new Date().getTime();
                 try {
                     if (typeof ld == "object" && ld.code==gConst.statusOk) {
					 	alert(ld);
                         var data = ld["var"];
                         LMD.initGroupData(data[0]);
                         LMD.initGroupListData(data[1]);
                         LMD.initListData(data[2]);
                         var et = new Date().getTime();
                         LMD.isComplete = true;
                        if (typeof(loadCall) == "function") {
                            loadCall(et - st);
                        }
                    } 
                } catch (e) {
                    ch("LMD.loadData", e);
                    LMD.isComplete = false;
                }*/
            },
            failCall:function(data){
                 //ch("LMD.loadData");
                 LMD.isComplete = false;
            }
        };
        MM.doService(obj);
    }
};

//LMD.loadAddrData = function(){
     //GC.getOtherDomainData("addrData", LMD.dataUrl); 
     //GC.loadScript("addrData",LMD.dataUrl);
//};





/**
 * 通讯录通用刷新方法
 */
LMD.freshData = function(cb){
	LMD.isComplete = false;
    LMD.isLoad = false;
    LMD.initData();
	LMD.loadData(cb);
};


/**
 * 侧边通讯录加载全局调用方法，AddrList
 */
LMD.loadList = function(div,win,ao){
    try {
        var al = new AddrList(div, win, ao);
        al.init();
        return al;
    }catch(e){}
};

/**
 * 手机号码自动完成快速调用方法<br>
 * 参数参见AutoFill类
 * @param {Object} id
 * @param {Object} doc
 * @param {Object} ao
 * @return {Object} Fill对象实例
 */
LMD.fillMobile = function(id,win,ao){
	return LMD.loadTimeout(id,win,ao,"mobile");
};

/**
 * 邮件地址自动完成快速调用方法<br>
 * 参数参见AutoFill类
 * @param {Object} id
 * @param {Object} doc
 * @param {Object} ao
 * @return {Object} Fill对象实例
 */
LMD.fillEmail = function(id,win,ao){
	return LMD.loadTimeout(id,win,ao,"email");
};

/**
 * 传真号码自动完成快速调用方法<br>
 * 参数参见AutoFill类
 * @param {Object} id
 * @param {Object} doc
 * @param {Object} ao
 * @return {Object} Fill对象实例
 */
LMD.fillFax = function(id,win,ao){
	return LMD.loadTimeout(id,win,ao,"fax");
};

LMD.autoFillInstances = {};
LMD.loadTimeout = function(id,win,ao,type){
    function load(){
        if (typeof(win) == "object") {
            if (LMD.isComplete) {
                try {
                    var fill = new AutoFill(id, win, ao);
                    fill.data = AutoFill.datas[type];
                    fill.init(type);
                    LMD.autoFillInstances[(typeof id) == 'object' ? id.id : id] = fill;
                    return fill;
                }catch(e){}
            } else {
                window.setTimeout(load, 500);
            }
        }
    }
    return load();
};

function control_Init(){
    var p = typeof performance != 'undefined' ? performance === "1" : false;
    if(p){
        return ;
    }

    LMD.initData();
	window.setTimeout(function(){
        try {
            if (!LMD.isLoad && !LMD.isComplete) {
                LMD.loadData();
            }
        }catch(e){}
    },gConst.loadAddr_Timeout);
}



