function Setting(){
    this.isLoad = false;
    this.name = gConst.setting;
    this.defaultMenu = "index";
    this.menuId = "MAIL";
    this.isIframe = false;
	
    /*
     *  this.menuType[n].text:
     *  设置首页
	 *	常规
	 *	账号与安全
	 *	邮箱管理
	 *	邮件收发
	 *	短信提醒
	 *	黑白名单
	 *	邮件夹
     */
    this.menuType = {
        index:{text:Lang.Mail.Config.setIndex,menus:["index"]},
        info: {text:Lang.Mail.Config.Conventional,menus:["pref","skin","sign"]},
        account:{text:Lang.Mail.ConfigJs.accountAndSafe,menus:["account","password","folderlock","foldBind"]},
        mailManager:{text:Lang.Mail.Config.mailManager,menus:["defaultAccount","memManager"]},
        mail: {text:Lang.Mail.Config.mail,menus:["autoReply","autoForward","mailPOP","filter"]},
        mobilemail: {text:Lang.Mail.ConfigJs.smsNotify,menus:["notify","loginNotify"]},
        anti: {text: Lang.Mail.Config.anti, menus:["black", "white","antiGarbage","antiViru"]},
        sso: {text: "授权登录", menus:["sso"]}
        //others: {text: Lang.Mail.Config.other, menus: ["myFolder"]}    
    };
	//顶部菜单项
    this.menus = ["index","info","mail","account","mailManager","anti","mobilemail","sso"];
	
	//左侧菜单项
    this.menuItem = {
		/***
         * 设置首页
         */
        index:{
            type:"index",
            name:Lang.Mail.tab_Setting
        },
        /***
         * 基本参数
         */
        pref: {
            type:"info",
            name: Lang.Mail.ConfigJs.pref_preference,
            text: Lang.Mail.ConfigJs.pref_preference_desc
        },
		/***
         * 语言设置
         */
        face: {
              type:"info",
              name: Lang.Mail.ConfigJs.pref_faceset,
              text: Lang.Mail.ConfigJs.pref_faceset_desc
        },
		/***
         * 换肤
         */
        skin: {
        	type: "info",
        	name: Lang.Mail.ConfigJs.switchSkin,
        	text: Lang.Mail.ConfigJs.switchSkin
        },
		/***
         * 邮件签名
         */
        sign: {
            type:"info",
            name: Lang.Mail.ConfigJs.pref_signature,
            text: Lang.Mail.ConfigJs.pref_signature_desc
        },
		/***
         * 自动回复
         */
        autoReply: {
            type:"mail",
            name: Lang.Mail.ConfigJs.pref_autoresp,
            text: Lang.Mail.ConfigJs.pref_autoresp_desc 
        },
		/***
         * 自动转发
         */
        autoForward: {
            type:"mail",
            name: Lang.Mail.ConfigJs.pref_forward,
            text: Lang.Mail.ConfigJs.pref_forward_desc
        },
		/***
         * 邮件代收
         */
        mailPOP: {
            type:"mail",
            name: Lang.Mail.ConfigJs.pref_pop_settings,
            text: parent.corpMailCollMsg
        },
		/***
         * 邮件分拣
         */      
        filter: {
            type:"mail",
            name: Lang.Mail.ConfigJs.pref_filter,
            text: Lang.Mail.ConfigJs.pref_filter_desc
        },
		/***
         * 账号设置，包括别名，发件人姓名 	 (账号与安全)
         */
        account: {
            type:"account",            
            name: Lang.Mail.ConfigJs.accountSettings,
            text: Lang.Mail.ConfigJs.pref_aliasname_desc
        },
		/***
         * 修改密码	 (账号与安全)
         */
        password: {
            type:"account",
            name: Lang.Mail.ConfigJs.pref_setpassword,
            text: Lang.Mail.ConfigJs.pref_setpassword_desc
        },
		//安全锁      						 (账号与安全)
        folderlock: {
            type:"account",
            name: Lang.Mail.ConfigJs.safeLock ,//"安全锁",
            text: Lang.Mail.ConfigJs.safeLockDes  //"给你的邮件夹加上锁，提高邮件使用安全性"
        },
		//手机绑定 (text 待确定)			 (账号与安全)
		phoneBind:{
			type:"account",
			name:Lang.Mail.ConfigJs.phoneBind, //"手机绑定",
			text:Lang.Mail.ConfigJs.phoneBindDes //" 移动用户绑定手机号码后可享受自写短信和邮件到达短信通知等特色服务。"
		},
		//默认账号                                                               (邮箱管理)
        defaultAccount: {
        	type:"mailManager",
        	name: Lang.Mail.ConfigJs.defaultAccount,
        	text: Lang.Mail.ConfigJs.defaultAccount_desc
        },
		//成员管理						  (邮箱管理)
        memManager: {
        	type: "mailManager",
        	name: Lang.Mail.ConfigJs.memManager,
        	text: Lang.Mail.ConfigJs.memManager_desc
        },
        //安全锁       
        /*
        lock: {
            type:"account",
            name: "安全锁"
            text: "给你的文件夹加上锁，提高邮件使用安全性"
        },
       */
        /*folderPass: {
            type:"config",
            name: "邮件夹加密",
            text: "邮件夹加密双重保护你的邮件安全",
			event: CC.goFolderMain
        },
        folderPOP:{
            type:"config",
            name: "文件夹POP",
            text: "针对自定义邮件夹单独设置POP服务权限" 
        },       
        mailSearch: {
            type:"filter",
            name: Lang.Mail.ConfigJs.pref_search_settings,
            text: Lang.Mail.ConfigJs.pref_search_settings_desc
        },     
        */
        mailSearch: {
            type:"index",
            name: Lang.Mail.ConfigJs.pref_search_settings,
            text: Lang.Mail.ConfigJs.pref_search_settings_desc
        },   
		//黑名单 						  (黑白名单)
        black:{
        	type:"anti",
        	name: Lang.Mail.ConfigJs.pref_refuselist,
            text: Lang.Mail.ConfigJs.pref_refuselist_desc
        },
		//白名单                                                                     (黑白名单)
        white: {
            type:"anti",
            name: Lang.Mail.ConfigJs.pref_safelist,
            text: Lang.Mail.ConfigJs.pref_safelist_desc,
            noload:true
        }, 
		//  反垃圾    防止垃圾邮件的袭扰
		antiGarbage: {
			type:"anti",
			name:Lang.Mail.ConfigJs.fanlaji,
			text:Lang.Mail.ConfigJs.fangxirao 
		},
		//反病毒   让病毒邮件自觉走开
		antiViru:{
			type:"anti",
            name: Lang.Mail.ConfigJs.virusMail,
            text: Lang.Mail.ConfigJs.virusGo
		},
        /*             
        fanlaji:{
        	type:"anti",
        	name: "反垃圾",
            text: "防止垃圾邮件的袭扰"
        },
        fanbingdu: {
            type:"anti",
            name: "反病毒",
            text: "让病毒邮件自觉走开"
        },  
         */    
		//短信提醒 
        notify: {
            type:"mobilemail",
            name: Lang.Mail.ConfigJs.pref_mail_notify,
            text: Lang.Mail.ConfigJs.pref_mail_notify_desc
        },
        loginNotify: {
            type:"mobilemail",
            name: Lang.Mail.ConfigJs.loginNotify,
            text: '手机接收登录提醒，第一时间掌握登录情况'
        },
        sso :{
            type:"sso",
            name: "授权登录",
            text: "第三方授权登录站点"
        }


        /*,
        myFolder: {
            type:"others",
            name: Lang.Mail.ConfigJs.pref_my_mailfolder,
            text: Lang.Mail.ConfigJs.pref_my_mailfolder_desc,
			event: CC.goFolderMain,
            noload:true
        }
        ,
		新功能暂时屏蔽
        attachList: {
            type:"filter",
            name: "附件管理",
            text: "统一管理和查询邮件附件",
            event:CC.goAttachList,
            noload:true
        },
        deliver: {
            type:"filter",
            name: "邮件投递状态",
            text: "查询每封邮件的详细投递状态",
            event:CC.goDeliver,
            noload:true
        },
        corp: {
            type:"filter",
            name: "企业接口",
            text: "企业管理接口测试"
        },
        user: {
            type:"filter",
            name: "用户接口",
            text: "用户接口测试模块"
        }*/
    };
}

Setting.prototype = {
    initialize: function(){
        var aw = MM[gConst.setting];
        this.menuData = {};
		
		
        for(var n in this.menuItem){
            var item = this.menuItem[n];
            var type = item.type;
			//this.defaultMenu  : index
            if(type!=this.defaultMenu){
				//给menuData赋值 ： 文字 , items,如果有就不再增加（用户会重复点）
                if(!this.menuData[type]){
                    this.menuData[type] = {title:this.menuType[type].text,items:{}};
                }
				//把它的子项加载进来，比如[账号与安全] 包括[账号设置，密码修改，安全锁，手机绑定]等子项
                this.menuData[type].items[n] = item;
            }
        }
        GMC.initialize(this.name, this);
        aw.menuId = this.menuId;
        aw.defaultMenu = "index";
		
    },
    getHtml: function(){ 
        var html = (this.menuId==this.defaultMenu&&CC.checkConfig(this.defaultMenu))?this.getIndexHtml():"";
        return "<div id=\"{0}\" style=\"padding:0px;margin:0px;clear:both;text-align:left;\">{1}</div>".format(gConst.mainSetting,html);
    },
	//得到顶部的菜单
    getTopHtml:function(id){
        var p = this;
        id = id || this.defaultMenu;
        var type = p.menuItem[id].type;
        var menusSort = p.menus;
        var html=[];
        html.push('<div id="set_head" class="header"><div><ul class="nav-hd">');
        //html.push('<li><a href="javascript:fGoto();" onclick="CC.setConfig();return false;">'++'</a></li>');
        for(var i=0;i<menusSort.length;i++){
            var n = menusSort[i];
            var mn = p.getConfigSubMenu(n);
			//如果子菜单都没权限，则这个父菜单不会显示(比如：account)
            if (mn) {
				//第一个有权限的选项项选择状态
				var param = mn;
				//如果是点击account 或者 mobilemail （短信提醒）都要加一个参数给后面弹出框判断
			    if(n == "account" ){
					param = mn + '\',\'' + n;
				}
				
				if(n == "mobilemail"){
					param = mn + '\',\'' + 'notify';
				}
				
                if (n == type) {
					
                    html.push('<li class="currentd"><a href="javascript:fGoto();" onclick="CC.setConfig(\'' + param + '\');return false;">' + p.menuType[n].text + '</a></li>');
                } else {
                    html.push('<li><a href="javascript:fGoto();" onclick="CC.setConfig(\'' + param + '\');return false;">' + p.menuType[n].text + '</a></li>');
                }
            }
        }
        html.push('</ul></div></div>');
        return html.join("");
    },
	//暂时没用到
    getIndexHtml:function(){
        var html = [];
        var o = this.name;
        var data = this.menuData;
        html.push("<div id=\"pageSetIndex\">");
        
        var str= this.getTopHtml("index");
        //html.push("<h1>"+Lang.Mail.ConfigJs.pref_h1_pref+"</h1>");
        html.push(str);
        
        html.push("<div id='settingList'><ul class=\"userSet\">");
		
		//循环输出选项卡
        for (var li in data) {
            var itemsObj = data[li].items;
            if (this.getConfigSubMenu(li)) {
                html.push("<li><h2>{0}</h2><dl>".format(data[li].title));
                for (var name in itemsObj) {
                    if (CC.checkConfig(name)) {
                        html.push("<dt><a href=\"javascript:fGoto();\" onclick=\"CC.setConfig('{1}');return false;\">{2}</a></dt>".format(o, name, itemsObj[name].name));
                        html.push("<dd>{0}</dd>".format(itemsObj[name].text));
                    }
                }
                html.push("</dl></li>");
            }
        }
        html.push("</ul></div></div>");
        this.menuId = this.defaultMenu;
        return html.join("");
    },
    getUrlHtml:function(id,url){
        var html = [];
        html.push("<div class=\"bodySet\" style='align:text;' id='{0}_{1}'>".format(gConst.mainSetting,id));
        html.push("<div id=\"container\">");
        html.push(OptionBase.prototype.getNavMenu(id));  
        html.push(CC.getIframe(id,url,"no"));
        html.push("</div></div>");
        return html.join("");
    },
    update:function(id,html){
        id = id || this.defaultMenu;
        $(gConst.mainSetting).innerHTML = html;
        CC.updateTitleNew(this.menuItem[id].name);
        this.setDivHeight();
    },
    doMenu:function(o,mid,ao){
        var id = mid.replace("CONFIG_","").toLowerCase();
        if (id == "mailpop") {
            CC.setConfig("mailPOP");
        } else {
            CC.setConfig(id);
        }
    },
    /**
     * 先处理模块event事件，再处理url，最后处理gethtml方法
     * @param {Object} id
     * @param {Object} parm
     */
    optSetting: function(id,param){
        var p = this;
        id = id || p.defaultMenu;
        param = param || "";
		p.phoneBindTip(id,param);
		
        if (p.menuId != id) {
            //打开设置首页
            if(id==p.defaultMenu){
                if(CC.checkConfig(this.defaultMenu)){
                     p.menuId = id;
                     p.update(p.defaultMenu, p.getIndexHtml()); 
					 pref.updatePosition("settingList");
                     return;
                 }else{
                     id = p.getIndexMenu();
                 }
            }
            if(!CC.checkConfig(id)){
               return;
            }
            var obj = p.menuItem[id];
            var optObj = window[id];
            //属性里面有event属性，优先处理
            if (p.menuItem[id] && typeof(p.menuItem[id].event) == "function") {
                //p.menuId = id;
                p.menuItem[id].event();
            } else if (obj && obj.url) { //没有event属性，则处理url属性
                p.menuId = id;
                p.update(p.defaultMenu, p.getUrlHtml(id,obj.url+param));
            } else if (optObj) { //无event,url属性开始调用模块的init方法，初始化对应模块
                opt();
            } else { //模块没有下载完成，等待
                window.setTimeout(function(){
                    //MM[gConst.setting].optSetting(id, param);
                    opt();
                }, 100);
            }
			
        }else{
            param.callback && param.callback.call(window[id],null);
        }

        function opt(){
            if (id == 'notify' || id == 'loginNotify') {
                if (optObj && typeof(optObj.init) == "function") {
                    optObj.init(function() {
                        p.menuId = id; //弹出之类的阻止掉的话，就说明没打开相应的页面
                    });
                }
            } else {
                p.menuId = id;
                if (optObj && typeof(optObj.init) == "function") {
                    optObj.init(id, param)
                }
            }
        }
    },
	/**
	 * 左侧的[发短信] ，设置页面的  [短信提醒]，[绑定手机]都  用这个方法判断后弹出
	 * @param {Object} id
	 * @param {Object} param
	 */
	phoneBindTip : function(id,param){
		//如果没有这个权限，返回
		if(window.gMain && gMain.flags){
			if(CC.isMobileBind(gMain.flags)){
				return;
			}
		}
		
		//如果是account，并且有绑定手机的权限，又 没绑定手机，则弹出框提示用户，可以绑定手机
		//分别在点击“发短信”  “账号与安全”
		//goOutLink（moduleCC.js)  optSetting 中调用这个方法 notify
		if(GC.check("CENTER_BIND") &&(( id == "notify" && param == "notify") || id == "sms")){
			checkBindPhone();
		}
		
		//您还没有绑定手机号码，请进入设置-账号与安全中绑定您的手机号码
		function showMsg(){
			var url = ""
				aTag = "",
				wo = null;
			
			if(window.gMain && gMain.webPath && gMain.sid){
				url = gMain.webPath+"/se/account/accountindex.do?sid="+gMain.sid+"&mode=Mobile";
			}
			
			if(url){
				aTag = "<a href="+url+">进入帐户管理中心</a>";
				
				wo = function(){
					window.location.href = url;
				}
			}
			
			
			
			CC.alert(Lang.Mail.ConfigJs.phoneBindTip,wo );//"您还没有绑定手机号码，请进入设置-账号与安全中绑定您的手机号码。"
			
			if(url){
				jQuery("#divDialogClosealertbtn_0").find("span").find("span").html("立即绑定");
			}
			
		}
		
		
		function checkBindPhone(){
			var	data 	= {},
				fnSuc	= null,
				fnFail	= null,
				sucMsg	= "",
				failMsg	= "";
			
			fnSuc = function(ao){
				if(ao && ao["var"] && ao["var"].flags!=0 && ao["var"].mobilePhone){
					//赋初始值----------->gMain.hasPhone
					if(window.gMain){
						gMain.hasPhone = ao["var"].mobilePhone;
					}
				}else{
					showMsg();
					if(window.gMain){
						gMain.hasPhone = "";
					}
				}
			};	
			
			fnFail = function(ao){
				if(window.gMain){
					gMain.hasPhone = "fail";
				}
				return;
			};
			phoneBind.doService("mail:getUserInfo",data,fnSuc,fnFail);
		}
		
	},
	
    init: function(){
        var p1 = this;
        //p1.setDivHeight();
       
    },
    getToolbar: function(o){    	
    },
    getToolbarMenu: function(af){
        var p1 = this;
		var ak = [];
        return ak;
    },
    resize: function(){
        this.setDivHeight(); 
    },
    exit: function(){
        this.menuId = "";
        return true;
        
    },
    setDivHeight: function(){
        var p = this;
        var  o = this.name;
        var id = this.menuId;
        var obj = this.menuItem[id];
       // setDivHeight();
        
        function setDivHeight(){
            var mdiv = $(gConst.mainSetting);
            var gw = CC.docWidth() - GE.pos()[0];
            var gh = GMC.getMainHeight(o);
            var mh = gh;
            
            var oMenu = $("option_menu_"+id);
            if(oMenu){
                mh = gh - (oMenu.offsetHeight || 32);
            }
            //if(Browser.isIE&&Browser.version==6&&(p.menuId=="person"||p.menuId=="notify")){
                //El.width($(mdiv),gw -34);
            //}
            El.height(mdiv,gh);
            if (obj && obj.url) {
                var ifrm = GMC.getFrameObj(id);
    			var win = GMC.getFrameWin(id);
                El.height($(gConst.mainSetting+"_"+id),gh);
    			try{
    				if(ifrm){
                        //win.document.body.style.height = (mh)+ "px";
                        var bodyH = (id=="person")?200:460;
    					ifrm.style.height = bodyH + "px";
    					//win.document.body.style.width = (gw-40)+ "px";
    					//win.document.body.style.height = (mh)+ "px";
    				}
    			}catch(e){} 
                }
        }
    },
    /**
     * 用户点击设置页面，根据权限，打开对应的设置项
     */
    getIndexMenu:function(){
        var p = this;
		//"index", "info", "mail","manage","anti".
        var menusSort = p.menus;
        for(var i=0;i<menusSort.length;i++){
            var n = menusSort[i];
            var mn = p.getConfigSubMenu(n);
            if (mn) {
                return mn;
            }
        }  
    },
     /**
     * 获取主菜单下面的子菜单节点，根据权限判断获取第一个有权限的节点 
     * @param {Object} name
     */
    getConfigSubMenu:function(name){
        //var id = this.defaultMenu;
        //if(!name || name==this.defaultMenu){
        //    return this.defaultMenu;
        //}
		//每一个子项，如account,password,lock,phoneBind
        var menus = this.menuType[name].menus;
		//如果有权限，返回第一个有权限的子项的id，在optSetting方法中check这个id
		//如果都没有，返回"undefined"
        for(var i=0;i<menus.length;i++){
            if(CC.checkConfig(menus[i])){
                return menus[i];
            }
        }
    }
    
};

