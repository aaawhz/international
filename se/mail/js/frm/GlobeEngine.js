/**
 * 定义邮箱左侧最基本的菜单名称, 以及相关的配置, 枚举 
 */
function GEInit(){
    cmail.GlobeEngine = cmail.createClass();
    cmail.GlobeEngine.prototype = {
        initialize: function (){
            var fg = ["init"];
            cmail.initMethod(cmail.GlobeEngine, fg);
        },
        init: function (){
            this.isLoaded = true;
        },
        name: "GlobeEngine"
    };
    var MAIL = cmail.createClass();
    MAIL.prototype = {
        editContent: "",
        oLinks: null,
        currentTab: 0,
        currentNav: null,
        dragNav: null,

        pref_quota: 2048,
        tempFrame: top.frames["template"],
        timeS: new Date(),
        timeC: new Date(),
        titles: [],
        network: 1,
        tab: null,
        pos: function (){
            return El.pos($(gConst.divMain));
        },
        subMenu: [],
        cSubmenu: null,
        cRelSubmenu: [],
        cRelItem: [],
        urls: {},
		folder : {
			search:0,
			inbox:1,
			draft:2,
			sent:3,
			del:4,
			junk:5,
			virus:6,
            limit:(gMain.maxFolders-0) || 15,//文件夹总数限制
            labelLimit:50, //标签总数限制
			sys:"sys",
            admin:"admin",
			user:"user",
			pop:"pop",
            label:"label",
            inner:"inner"
		},
        folderType:{			
            sys:1,
            user:3,
            label:5,
			pop:6
        },
		folderObj: {
			search:"sys0",
			inbox:"sys1",
			draft:"sys2",
			sent:"sys3",
			del:"sys4",
			junk:"sys5",
			virus:"sys6"
		},
		/***
		 * 优先级
		 */
        priority:{
          hight:1,
          common:3,
          low:5
        },
        list:{
          order:"receiveDate",
          orderField:["receiveDate","from","to","size","subject","sendDate","status"],
          orderCount:5,
          pageSize:20,
          topmid:""
        },
		signLimit:5,//邮件签名个数限制
		diskFiles:[],
		newMail: 0,
		maxComposeId : 0,
		maxFolder : 10000,	    //coremail自定义文件id的起始值
		sysLocation:1,          //系统文件夹排序起始位置
		adminLocation:5000,     //管理文件夹排序起始位置
		userLocation:10000,     //用户文件夹排序起始位置
		labelLocation:30000,    //标签文件夹排序起始位置
		allLocation:50000,      //标签文件夹排序起始位置
		locationAdd:100,        //排序标志增量
		lastComposeId: "",
        secondSearch:{fid:"0",name:'sys0'},
        isSecondSearch:false,
        topNum:0,
        topMids:[],
        addrList:{}
		//foldersName:["search","inbox","draft","sent","del","junk","virus"]
	};
    Object.extend(cmail.GlobeEngine.prototype, new MAIL());
}






