function Address(){
	var p = this;
	this.win = null;
	this.name = gConst.address;
	this.menuId = "ADDR";
	this.path = "addr";
	this.config = {
		myaddr:{text:"",url:"index.do"},
		csaddr:{text:"",url:"index.do"},
		epaddr:{text:"",url:"index.do"},
		newaddr:{text:"",url:"quickadd.do"},
		importAddr:{text:"",url:"importfromfile.do"},
		exportAddr:{text:"",url:"exportaddr.do"},
		corpaddr:{text:"",url:"corpaddr.do"},
		/*"import":{text:"",url:"addr_data_importOne.do"},
		"export":{text:"",url:"addr_data_exportNew.do"},
		sync:{text:"",url:"sync/MobileSetting.do"},
		mycard:{text:"",url:"addr_mycard_config.do"},
		myinfo:{text:"",url:"addr_myinfo.do"},
		epcard:{text:"",url:"addr_epcard_config.do"},
		myview:{text:"",url:"addr_myinfo.do"},
		mgraddr:{text:"",url:"addr_contact_mangerNew.do"},
		mgrgroup:{text:"",url:"addr_group.do"},
		print:{text:"",url:"addr_data_printOne.do"},
        moveaddr:{text:"",url:"addr_detail_clone.do"},*/
		defaultUrl:{text:"",url:"index.do"}
	};
}


Address.prototype = {
    initialize: function(){
        GMC.initialize(this.name, this);
    },
    getHtml: function(){
        return '<div id="' + gConst.mainToolbar + this.name + '"></div>' + CC.getIframe(this.name, this.url, "auto");
    },
    init: function(){
        var p1 = this;
        p1.setDivHeight();      
    },  
    getToolbar: function(o){
       /* var p1 = this;
        var menu = p1.menu;
		if(menu && menu.length>0){
			return menu;
		}else{
			menu = gMenu[p1.menuId].children;
            menu.push({
               isShow:1,
               name:"MAIL_ADDR_SENDMAIL",
               text:Lang.Mail.tb_Send,
               attrs:"className=email",
               url: "menu"
            });
            p1.menu = menu;
			return p1.menu;	
		} */
    },
    resize: function(){
        this.setDivHeight();    
    },
    exit: function(){
        GMC.gcMem(this.name);
        return true;
        
    },
    setDivHeight: function(){
        GMC.setDivHeight(this.name);
    },
    getUrl: function(m){
        m = m || "defaultUrl";
		if(m =="defaultUrl" && !GC.check("CONTACTS_ENT"))
		{
			m ="corpaddr";
		}
        var p1 = this;
        var conf = p1.config;
        var url = conf[m].url || "index.do";
        var name = conf[m].text || Lang.Mail.tab_addr;
        var surl = "/addr/" + url;
        return {
            url: surl,
            name: name
        };
    },  
    setUrl: function(url,isrefresh){
        return GMC.setUrl(this.name, url,isrefresh);
    },
    /**
     * @param {String} o 模块名称
     * @param {String} mid 菜单id(去掉父模块后的值 )
     * @param {Object} om 菜单节点对象
     */
    doMenu: function(o,mid,om){
    	var p = MM[o];
    	var win = p.getWin();
 		if(!win){
 			return;
 		}
    	switch(mid){
    		case "ADD":
    		case "USER":
				win.AddrCom.opAddr("addUser",Lang.Mail.addr_AddLink);
				break;
			case "GROUP":
				win.AddrCom.opAddr("addGroup", Lang.Mail.addr_AddGroup);
				break;
			case "LIST":
			case "PERSON":
				win.AddrCom.opAddr("myAddr", Lang.Mail.addr_AddGroup);
				break;
			case "EP":
				win.AddrCom.opAddr("epAddr", Lang.Mail.addr_AddGroup);
				break;
			case "CS":
				win.AddrCom.opAddr("csAddr", Lang.Mail.addr_AddGroup);
				break;
           case "SENDMAIL":
				win.AddrCom.opAddr("sendMail", Lang.Mail.tb_SendMail);
				break;
           case "IMPORT":
        	   CC.goAddress("importAddr","",true);
        	   break;
           case "FILE":
        	   CC.goAddress("importAddr","",true);
        	   break;
           case "EXPORT":
        	   CC.goAddress("exportAddr");
        	   break;
		}
    },
    getWin:function(){
    	if(this.win){
    		return this.win;
    	}
    	return GMC.getFrameWin(this.name);
    }
};

