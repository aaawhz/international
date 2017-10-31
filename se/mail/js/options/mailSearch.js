var mailSearch = new OptionBase();

mailSearch.attrs = {
	id : 'mailSearch',
	authority: 'MAIL_CONFIG_MAILSEARCH',
    free: true,
    divId:"pageSearch",
    noReq: true,
    tableClass:"searcForm",
    tableBefore:'<div class="formArea"><form id="option_searchForm" name="option_searchForm">',
    tableAfter:'</form></div>',
    //list:{type:"url",func:gConst.func.getAttrs},//获取数据/列表时指令，数据
    buttons:[
        { text: Lang.Mail.ConfigJs.mail_search, clickEvent: 'mailSearch.save' },
        { text: Lang.Mail.ConfigJs.sign_btn_cancel2, clickEvent: 'mailSearch.goBack' }
    ],
	data: {
		keyword: {
		text: Lang.Mail.ConfigJs.mailSearch_keywords,
			type: 'text',
			className: '',
			attribute: {
				value: '',
				defaultValue: '',
                maxLength:34,
                ext:' onkeydown="mailSearch.doKeyDown();"'
			},
			format: 'string',
			after: "<span>" + Lang.Mail.ConfigJs.mailSearch_PromptMsg + "</span>"
		},
        fid:{
        text: Lang.Mail.ConfigJs.mailSearch_inFolder,
          type:"select",
          attribute: {
				value: '',
				defaultValue: '0'
			},
			items: [function(){
				var af = {};
				af.fid = 0;
				af.parentId = 0;
				af.name = Lang.Mail.ConfigJs.mailSearch_allFolder;
				return af;
			}()]
        },
        read: {
            text: Lang.Mail.ConfigJs.mailSearch_ReadNo,
			type: 'select',
			attribute: {
				value: '',
				defaultValue: ''
			},
			items: { '': Lang.Mail.ConfigJs.mailSearch_noLimit, '1': Lang.Mail.ConfigJs.mailSearch_noRead, '0': Lang.Mail.ConfigJs.mailSearch_read },
			format: 'int'
		},
        attached: {
            text: Lang.Mail.ConfigJs.mailSearch_attachmentNo,
			type: 'select',
			attribute: {
				value: '',
				defaultValue: ''
			},
			items: { '': Lang.Mail.ConfigJs.mailSearch_noLimit, '0': Lang.Mail.ConfigJs.mailSearch_NoAttachment, '1': Lang.Mail.ConfigJs.mailSearch_attachment },
			format: 'int'
		},
        priority:{
            text: Lang.Mail.ConfigJs.mailSearch_mailpriority,
			type: 'select',
			attribute: {
				value: '',
				defaultValue: ''
			},
			items: { '0': Lang.Mail.ConfigJs.mailSearch_noLimit, '1': Lang.Mail.ConfigJs.mailSearch_urgency, '3': Lang.Mail.ConfigJs.mailSearch_NoUrgency },
			format: 'int'
		}
	}	
};

mailSearch.init = function(id){
	var items = [{fid:0,parentId:0,name:Lang.Mail.ConfigJs.mailSearch_allFolder}];
	var temp =this.getFolders([GE.folder.sys,GE.folder.user]);
    
    //for(var n in items){
        this.attrs.data.fid.items = items.concat(temp);//this.attrs.data.fid.items.concat(items);
    //}
    this.request(this.attrs);
};

mailSearch.doKeyDown = function(){
    var ev = EV.getEvent() || window.event;
	if (EV.getCharCode(ev) == 13){
		//searchMail(1);
        CC.searchMailByTop(this.getEl("keyword"));
		EV.stopEvent(ev);
    }
    return true;  
};

mailSearch.save = function(resp){
    try {
        //MM[gConst.searchMail].search($("option_searchForm"));
         //var cond = ["size","sendDate","receivedDate"];
        var param = {};
        var keys = ["subject","from","to"];
        var key = this.getTextValue("keyword").trim();
        var fid = Util.str2Num(this.getValue("fid","select"));
        var priority = this.getValue("priority","select");
        var flags = {},i = 0;
        var flagsObj = {
            "read":this.getValue("read","select"),
            "attached":this.getValue("attached","select")
        };

        /**处理搜索选项 */
        var options = {
            ignoreCase:1,
            recursive:0
        };
        
        /** 邮件标志*/
        for(var fg in flagsObj){
           if(flagsObj[fg] != undefined && flagsObj[fg] != ""){
               flags[fg] = Util.str2Num(flagsObj[fg]);
           }
        } 
        
        var condictionsArray = [];
        /**
         * 关键字匹配
         */
        for(i=0;i<keys.length;i++){
            if(key){
                condictionsArray.push({
                    field: keys[i],
                    operator: "contains",
                    value: key
                });
            }
            
        }
        if (priority!= "0") {
           condictionsArray.push({
                field: "priority",
                operator: "",
                value: priority
            }); 
        }
        /**
         * 邮件大小及日期匹配
         */
        /*for(var j=0;j<cond.length;j++){
            var id = cond[j];
            addCond(id+"_start");
            addCond(id+"_end");
        }
        if (form["priority"].value != "0") {
           condictionsArray.push({
                field: "priority",
                operator: form["priority"].value,
                value: 3
            }); 
        }
        
        function addCond(id){
            var v = 0;
            var op = "";
            var name = "",type="";
            if(id){
                name = id.split("_")[0];
                type = id.split("_")[1];
                var obj = form[id];
                if(obj){
                    v = obj.value;
                    if(id.indexOf("size")>=0){
                        v = Util.str2Num(v);
                        v = v * 1024;
                    }else{
                        v = getTimes(v);
                    }
                    if(type=="start"){
                        op = ">=";
                    }else{
                        op = "<=";
                    }
                    if(v>0){
                        condictionsArray.push({
                            field: name,
                            operator: op,
                            value: v
                        }); 
                    }
                }
            }
        }
        function getTimes(v){
            var val = Util.parseDate(v,"yyyy-mm-dd");
            if(val instanceof Date){
                val = val.getTime()/1000;
                return val;
            }else{
                return 0;
            }
        }*/
       CC.searchMailByParm(key,fid,condictionsArray,flags,options);  
    }catch(e){//CC.alert();
    }
};


