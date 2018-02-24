/**
 * @class
 * @desc
 * @date 13-9-12
 */
(function ($) {
    CVSKeys={
        "姓":["姓氏"],
        "名":["名字","姓名"],
        "常用邮箱一":["电邮地址","电子邮件地址","邮件地址"],
        "常用邮箱二":["电邮地址2"],
        "常用手机一":["手机","移动电话"],
        "常用手机二":[],
        "常用电话一":["主要电话","联系电话"],
        "常用传真":["商务传真"],
        "组名":[],
        "昵称":["名称","昵称"],
        "街道(详细)":["住宅街道","住宅所在街道"],
        "家庭地址":["住宅街道","联系地址"],
        "邮政编号(详细)":["住宅邮编","住宅所在地的邮政编码","邮政编码"],
        "固话(详细)":["住宅电话"],
        "传真(详细)":["住宅传真","传真","传真电话"],
        "备注":["附注"],
        "公司名称":["公司"],
        "职务":["职务"],
        "商务手机":[],
        "商务固话":["商务电话","公司电话","公司电话"],
        "商务传真":["商务传真"],
        "商务邮箱":["邮件地址2"],
        "公司主页":[],
        "街道(商务)":["商务街道"],
        "公司地址":["商务街道","公司地址"],
        "邮政编码(商务)":["商务邮编","公司邮政"],
        "个人主页":["网页","个人主页","主页地址"],
        "其它主页":[],
        "QQ":["QQ"],
        "MSN":["MSN"],
        "其它聊天工具":[]
    };
    var titles139=["姓","名","常用邮箱一","常用邮箱二","常用手机一","常用手机二",
        "常用电话一","常用传真","组名","昵称","街道(详细)","家庭地址",
        "邮政编号(详细)","固话(详细)","传真(详细)","备注","公司名称",
        "职务","商务手机","商务固话","商务传真","商务邮箱","公司主页",
        "街道(商务)","公司地址","邮政编码(商务)","个人主页","其它主页",
        "QQ","MSN","其它聊天工具","性别","生日"];
    var titleCache={};
    function getTitleMatch139Title(titles,title139){
        if(titleCache[title139])return titleCache[title139];
        var arr=CVSKeys[title139];
        var result="";
        for(var i=0;i<arr.length;i++){
            var index=titles.indexOf(arr[i]);
            if(index>=0){
                result=titles[index];
                break;
            }
        }
        titleCache[title139]=result;
        return result;
    }
    
    Array.prototype.indexOf=function(obj){
        for(var i=0,len=this.length;i<len;i++){
            if(this[i]==obj)return i;
        }
        return -1;
    }
    String.prototype.fm=function(){
        return this.replace(/,/g,"，").replace(/^\s+|\s+$/g,"");
    }
    
    
    var CsvTitles;
    function parseCsvAddr(cvsData){
        var lines=cvsData.split(/\r?\n/);
        var friendly=true;
        if(lines[0].indexOf("\"")!=0){
            friendly=false;
            CsvTitles=lines[0].split(",");
        }else{
            CsvTitles=eval("["+lines[0]+"]");
        }
        var result=[],dataRow,dataObj;
        //result[0]=titles139.toString();
        for(var i=1,len=lines.length;i<len;i++){
            if(friendly){
                dataRow=eval("["+lines[i]+"]");
            }else{
                dataRow=lines[i].split(",");
            }
            dataObj=new CsvDataRow();
            for(var j=0,jlen=CsvTitles.length;j<jlen;j++){
                dataObj[CsvTitles[j]]=dataRow[j];
            }
            if(!dataObj.formated)dataObj.format();
            result.push(dataObj);
        }
        return result;
    }
    function isRealData(dataString){
        if(dataString.indexOf("\"名称\",\"名字\"")==0){
            return true;
        }
        return false;
    }
    function CsvDataRow(){
    
    }
    CsvDataRow.prototype.format=function(){
        var This=this;
        $(titles139).each(
            function(){
                var title=getTitleMatch139Title(CsvTitles,this)
                This[this]=title?This[title]:"";
            }
        );
        this.formated=true;
    }
    CsvDataRow.prototype.toString=function(){
        var This=this;
        //if(!this.formated)this.format();
        var result=[];
        $(titles139).each(function(){
            var str=This[this];
            //组名设置成邮件地址
            if(this=="组名"){
                str=mailID;
            }
            result.push(str?str.fm():"");
        });
        return result.join(",");
    }
    
    
    function createXmlDomFromString(xml){
        if(window.ActiveXObject){
            var xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async="false";
            xmlDoc.loadXML(xml);
        }else{
            var parser=new DOMParser();
            var xmlDoc=parser.parseFromString(xml,"text/xml");
        }
        return xmlDoc;
    }
    
    //用jquery解析xml文档
    function parse163Addr(xml){
        if(typeof xml == "string")xml=createXmlDomFromString(xml);
        //获得组
        var groupList=$(xml).find("boolean[@name='reserved']").parent();
        var group=[];
        group.getGroupById=function(id){
            for(var i=0;i<this.length;i++){
                if(this[i].id==id)return this[i].name;
            }
            return "";
        }
        groupList.each(
            function(){
                group.push(
                    {
                        id:getChildText(this,"string","id"),
                        name:getChildText(this,"string","name")
                    }
                );
            }
        )
        //获得通讯录项
        var list=$(xml).find("array object array")[0];
        var result=[];
        $("object",list).each(function(){
            var item=new CsvDataRow();
            var tmp;
            item["姓"]="";
            item["名"]=getChildText(this,"string","FN");
            item["常用邮箱一"]   = getChildText(this,"string","EMAIL;PREF");
            item["商务邮箱"]     = getChildText(this,"string","EMAIL;BAK1");
            item["常用邮箱二"]   = getChildText(this,"string","EMAIL;BAK2");
            item["常用手机一"]=getChildText(this,"string","TEL;CELL");
            item["常用传真"]=getChildText(this,"string","TEL;WORK;FAX");
            item["组名"]=(tmp=$(this).find("array[@name='groups'] string")).length>0?group.getGroupById($(tmp[0]).text()):"";
            item["昵称"]=getChildText(this,"string","FN");
            item["家庭地址"]=getChildText(this,"string","ADR;HOME");
            item["邮政编号(详细)"]=getChildText(this,"string","PC;HOME");
            item["固话(详细)"]=getChildText(this,"string","TEL;HOME;VOICE");
            item["传真(详细)"]=getChildText(this,"string","TEL;WORK;FAX");
            item["备注"]=getChildText(this,"string","ZS");
            item["公司名称"]=getChildText(this,"string","ORGNAME");
            item["职务"]=getChildText(this,"string","TITLE");
            item["商务手机"]=getChildText(this,"string","TEL;CELL");
            item["商务固话"]=getChildText(this,"string","TEL;WORK;VOICE");
            item["商务传真"]=getChildText(this,"string","TEL;WORK;FAX");
            item["公司地址"]=getChildText(this,"string","ADR;WORK");
            item["邮政编码(商务)"]=getChildText(this,"string","PC;WORK");
            item["生日"]=getChildText(this,"date","BDAY");
            item["QQ"]=(tmp=getChildText(this,"string","ICQ")).indexOf("qq:")>=0?tmp.replace(/^.*?qq:(\d+).*?$/,"$1"):"";
            item["MSN"]=(tmp=getChildText(this,"string","ICQ")).indexOf("msn:")>=0?tmp.replace(/^.*?msn:([^;]+).*?$/,"$1"):"";
            result.push(item);
        })
        return result;
    
        //返回xml元素子节点的文本，如不存在返回""
        function getChildText(node,tagName,attrVale){
            var result=$(node).find(tagName+"[@name='"+attrVale+"']");
    
            if (result.length == 0) {
                return "";
            }
    
            result = result.text();
    
            if (result.indexOf("\n")>-1){
                //result = '"'+result+'"';  //TODO:这样修改需要服务端也做相应的修改，暂后。
                result = result.replace(/[\r\n]/g, "");
            }
    
            return result;
        }
    }
    
    
    function parseQQMailAddr(text){
        var match=text.match(/g_addrs = (\[(?:[\s\S]*?)\];)/);
        if(!match){
            return "";
        }
        var list=eval(match[1]);
        var result=[];
        var tmp,item;
        if(list){
            for(var i=0,len=list.length-1;i<len;i++){
                tmp=new CsvDataRow();
                item=list[i];
                tmp["名"]=Utils.htmlDecode(item[3]);
                tmp["常用邮箱一"]=item[2];
                result[i]=tmp;
            }
        }
        return result;
    }
    function parseSinaAddr(text){
        var list=eval(text);
        var result=[];
        var tmp,item;
        if(list){
            for(var i=0,len=list.length;i<len;i++){
                tmp=new CsvDataRow();
                item=list[i];
                tmp["名"]=item.name;
                tmp["常用邮箱一"]=item.email;
                tmp["常用手机一"]=item.mobile;
                result[i]=tmp;
            }
        }
        return result;
    }
    function parseYahooAddr(text){
        eval(text);
        var result=[];
        var tmp,item;
        if(InitialContacts){	//yahoo返回的变量名为InitialContacts
            for(var i=0;i<InitialContacts.length;i++){
                row=new CsvDataRow();
                item=InitialContacts[i];
                row["名"]=item.contactName;
                row["常用邮箱一"]=item.email;
                result[i]=row;
            }
        }
        return result;
    }
    function parseSohuAddr(text){
        var fieldmap =
        {"昵称":"姓"
            ,"电子邮件地址":"常用邮箱一"
            ,"移动电话":"常用手机一"
            ,"商务电话":"商务固话"
            ,"商务传真":"商务传真"
            ,"住宅电话":"常用电话一"
            ,"公司所在地的邮政编码":"邮政编码(商务)"
            ,"个人网页":"个人主页"
            ,"公司所在街道":"公司地址"
            ,"家庭所在街道":"家庭地址"
            ,"家庭所在地的邮政编码":"邮政编号(详细)"
            ,"附注":"备注"
        };
        var rows = text.split("\n");
        var contacts = [];
    
        //得到头部标题
        var title = [];
        var row = rows.shift();
        row = row.split(",");
        for(var i=0; i<row.length; i++){
            title[i] = row[i];
        }
        //得到所有数据
        while(rows.length > 0 && row!=""){
            row = rows.shift();
            row = row.split(",");
            var obj = {};
            for(var i=0; i<row.length; i++){
                obj[title[i]]=row[i];
            }
            contacts.push(obj);
        }
    
        //根据映射关系得到139标准格式
        while(contacts.length>0){
            row = contacts.shift();
            var obj=new CsvDataRow();
            for(var field in fieldmap){
                obj[fieldmap[field]] = row[field];
            }
            rows.push(obj);
        }
        return rows;
    }
    function parse21cnAddr(text){
        var fieldmap =
        {"姓名":"姓"
            ,"电子邮件地址":"常用邮箱一"
            ,"生日":"生日"
            ,"性别":"性别"
            ,"QQ":"QQ"
            ,"MSN":"MSN"
            ,"手机":"常用手机一"
            ,"公司电话":"商务固话"
            ,"住宅电话":"常用电话一"
            ,"公司":"公司名称"
            ,"邮政编码":"邮政编码(商务)"
            ,"个人主页":"个人主页"
            ,"联系地址":"公司地址"
            ,"昵称":"昵称"
            ,"附注":"备注"
        };
        var rows = text.split("\n");
        var contacts = [];
    
        //得到头部标题
        var title = [];
        var row = rows.shift();
        row = row.split(",");
        for(var i=0; i<row.length; i++){
            title[i] = row[i];
        }
        //得到所有数据
        while(rows.length > 0 && row!=""){
            row = rows.shift();
            row = row.split(",");
            var obj = {};
            for(var i=0; i<row.length; i++){
                obj[title[i]]=row[i];
            }
            contacts.push(obj);
        }
    
        //根据映射关系得到139标准格式
        while(contacts.length>0){
            row = contacts.shift();
            if (!row["姓名"]) continue;
            var obj=new CsvDataRow();
            for(var field in fieldmap){
                obj[fieldmap[field]] = row[field];
            }
            rows.push(obj);
        }
        return rows;
    }
    
    function parsetomAddr(text){
        var fieldmap =
        {"姓名":"姓"
            ,"邮件地址":"常用邮箱一"
            ,"生日":"生日"
            ,"ICQ":"QQ"
            ,"MSN":"MSN"
            ,"移动电话":"常用手机一"
            ,"公司电话":"商务固话"
            ,"公司地址":"公司地址"
            ,"联系电话":"常用电话一"
            ,"传真电话":"商务传真"
            ,"公司":"公司名称"
            ,"公司邮政":"邮政编码(商务)"
            ,"邮政编码":"邮政编号(详细)"
            ,"主页地址":"公司主页"
            ,"联系地址":"家庭地址"
        };
        text = text.replace(/[\"\;]/g, "");
        var rows = text.split("\n");
        var contacts = [];
    
        //得到头部标题
        var title = [];
        var row = rows.shift();
        row = row.split(",");
        for(var i=0; i<row.length; i++){
            title[i] = row[i];
        }
        //得到所有数据
        while(rows.length > 0){
            row = rows.shift();
            row = row.split(",");
            var obj = {};
            for(var i=0; i<row.length; i++){
                obj[title[i]]=row[i];
            }
            contacts.push(obj);
        }
    
        //根据映射关系得到139标准格式
        while(contacts.length>0){
            row = contacts.shift();
            if (row["姓名"] == undefined || row["姓名"].length==0) continue;
            var obj=new CsvDataRow();
            for(var field in fieldmap){
                obj[fieldmap[field]] = row[field];
            }
            rows.push(obj);
        }
        top.jslog(rows);
        return rows;
    }
    ﻿
    //尽可能聚合顶层的对象;
    var Pt = {
    
        $U: top.$Url,
        $RM: top.$RM,
    
        getSid: function() {
            return top.$App.getSid();
        },
    
        getUid: function() {
            return top.$User.getUid();
        },
    
        ucDomain: function(path) {
            return top.getDomain("webmail") + path + "?sid=" + this.getSid();
        },
    
        callOldApi: function(option) {
            var api = "/g2/addr/apiserver/" + option.action;
            var params = option.params || {};
            params.sid = this.getSid();
    
            var _url = this.$U.makeUrl(api, params);
    
            this.$RM.call(_url, option.data, function(json) {
                json = json.responseText;
                $.isFunction(option.success) && option.success(json);
            }, { headers: { "Content-Type": "application/x-www-form-urlencoded" } });
        }
    };
    
    
    Array.prototype.repush=function(arr){//数组参数
        for(var i=0;i<arr.length;i++){//遍历数组参数
            var e=arr[i];
            var b=1;
            for(var j=0;j<this.length;j++){//与遍历数组本身
                if(e==this[j]){//如果已经存在，则不加入
                    b=0;
                    break;
                }
            }
            if(b)
                this.push(e)//如果不存在，则push
        }
        return this
    };
    
    var mailID="";
    
    
    //var PageMsg = ADDR_I18N[ADDR_I18N.LocalName].input;
    var PageMsg = '';
    var maxLimit = 1000;
    //var maxLimit = top.Contacts.getMaxContactLimit();
    
        var importTerminatorAddr = function () {
    
        }
    
    
    //导入客户端通讯录
    var iptCltServer={
        iptFm:1,//Foxmail
        iptMo:2,//MicrosoftOutlook
        iptOe:3,//OutlookExpress
        iptType:-1,//导入类型:1.Foxmail,2.MicrosoftOutlook,3.OutlookExpress
        cltId:-1,//当前版本ID
        cltId1:-1,//Foxmail主版本号,
        cltId2:-1,//MicrosoftOutlook
        cltId3:-1,//OutlookExpress
        groupName:"",//当前导入分组名
        groupName1:"",
        groupName2:"",
        groupName3:"",//OutlookExpress导入分组名
        max:500,//500,提交每批联第人最大值
        total:0,//客户端联系人总数
        currIndex:1,//取联系人序号
        contactIndex:0,//取到数据的联系人数组索引
        row:null,
        mv1:"",//Foxmail主版本号
        mv2:"",//MicrosoftOutlook
        mv3:"",//OutlookExpress
        lastTime1:"",//最后一次导入时间
        lastTime2:"",
        lastTime3:"",
        lastCount1:"",//最后一次导入的人数
        lastCount2:"",
        lastCount3:"",
        repeatType:"1",//遇重复联系人处理方式：1.不要导入[跳过]2.以覆盖方式导入3.以新建方式导入
        iptCount:0,
        contantData:"",//取到的客户端联系人数据
        arrAll:null,//all
        arrCurr:null,
        mesIptErr:"",//失败提示语
        batch:1,//当前导入批次号－－可以不用
        isNew:1,//1：首次导入，-1非首次导入
    
        setRepeat:function()//如遇重复设置
        {
            var dialog = top.$Msg.open({
                dialogTitle: "导入提示",
                url: "addr/addr_dialog_repeattype.html?checked=ignore&disableField=merge",
                onclose: function(){
                    iptCltServer.setBtnState(false);
                },
                contentButtonPath: "#btnCancel"
            });
            var ifr = dialog.$el.find('iframe')[0];
            ifr.options = {
                sure: function(type){
    
                    if(type == "replace")
                    {
                        iptCltServer.repeatType="2";
                    }
                    else if(type == "new")
                    {
                        iptCltServer.repeatType="3";
                    }
    
                    top.FF.close();
                    iptCltServer.startIptContacts();
                }
                //,cancel: function() {
                //    iptCltServer.setBtnState(false);
                //    top.FF.close();
                //}
            };
            dialog.on("contentbuttonclick", function(e) {
                iptCltServer.setBtnState(false);
            });
        },
        setBtnState:function(isIptIng)
        {
            var btnStr="btnIpt";
            $(".r a").each(function(){
                var tmpId=this.id;
                var idLast=tmpId.substr(btnStr.length,tmpId.length-btnStr.length);
                if(idLast!=iptCltServer.iptType)
                {
                    $(this).unbind( "click" );
                    if(isIptIng){
                        $(this).addClass("pray");
                    }else{
                        $(this).removeClass("pray");
                        switch(idLast)
                        {
                        case "1":
                            $(this).bind("click",iptCltServer.clickIptFm);
                            break;
                        case "2":
                            $(this).bind("click",iptCltServer.clickIptMo);
                            break;
                        case "3":
                            $(this).bind("click",iptCltServer.clickIptOe);
                            break;
                        }
                    }
                }
            });
        },
        SetCltCout:function()//
        {
            if(document.all)//IE
            {
                iptCltServer.total=uploader.GetContactsCount(""+iptCltServer.cltId);//得到客户端联系人总数
            }
            else
            {
                iptCltServer.total=$("#embed1")[0].GetContactsCount(""+iptCltServer.cltId);//得到客户端联系人总数
            }
        },
        checkOver:function()
        {
            iptCltServer.SetCltCout();
    
            if (top.Contacts.data.TotalRecord >= maxLimit) {
                top.FloatingFrame.alert(PageMsg['error_overlimit'].format(maxLimit));
                return false;
            }
    
            if(iptCltServer.total>maxLimit || (top.Contacts.data.TotalRecord+iptCltServer.total)>maxLimit)
            {
                top.FloatingFrame.alert(PageMsg['error_overlimit2'].format(maxLimit));
                return false;
            }
            return true;
        },
        clickIptFm:function()
        {
            iptCltServer.iptType=iptCltServer.iptFm;
            iptCltServer.cltId=iptCltServer.cltId1;
            iptCltServer.groupName=iptCltServer.groupName1;
            if(!iptCltServer.checkOver())
            {
                return false;
            }
            iptCltServer.setBtnState(true);
            iptCltServer.setRepeat();
        },
        clickIptMo:function()
        {
            iptCltServer.iptType=iptCltServer.iptMo;
            iptCltServer.cltId=iptCltServer.cltId2;
            iptCltServer.groupName=iptCltServer.groupName2;
            if(!iptCltServer.checkOver())
            {
                return false;
            }
            iptCltServer.setBtnState(true);
            iptCltServer.setRepeat();
        },
        clickIptOe:function()
        {
            iptCltServer.iptType=iptCltServer.iptOe;
            iptCltServer.cltId=iptCltServer.cltId3;
            iptCltServer.groupName=iptCltServer.groupName3;
            if(!iptCltServer.checkOver())
            {
                return false;
            }
            iptCltServer.setBtnState(true);
            iptCltServer.setRepeat();
        },
        initIptClt:function()//初始化导入页面
        {
            $("a.tdu").attr("href", top.getDomain("uec") + "/jumpFeedbackRedirect.do?isdirect=1&nav=3&isfirst=1&sid=" + top.$App.getSid());
    
            iptCltServer.setClientInfo();
            var strVersion="";
            if(iptCltServer.cltId1!=-1)
            {
                iptCltServer.cltId=iptCltServer.cltId1;
                iptCltServer.SetCltCout();
                strVersion=iptCltServer.setVersionInfo(iptCltServer.iptFm,iptCltServer.mv1);
                if(strVersion)
                {
                    $(strVersion).replaceAll("#divIptInfo"+iptCltServer.iptFm);
                    if(iptCltServer.total>0)
                    {
                        iptCltServer.getLastIptInfo(iptCltServer.iptFm);
                    }
                }
            }
            if(iptCltServer.cltId2!=-1)
            {
                iptCltServer.cltId=iptCltServer.cltId2;
                iptCltServer.SetCltCout();
                strVersion=iptCltServer.setVersionInfo(iptCltServer.iptMo,iptCltServer.mv2);
                if(strVersion)
                {
                    $(strVersion).replaceAll("#divIptInfo"+iptCltServer.iptMo);
                    if(iptCltServer.total>0)
                    {
                        iptCltServer.getLastIptInfo(iptCltServer.iptMo);
                    }
                }
            }
            if(iptCltServer.cltId3!=-1)
            {
                iptCltServer.cltId=iptCltServer.cltId3;
                iptCltServer.SetCltCout();
                strVersion=iptCltServer.setVersionInfo(iptCltServer.iptOe,iptCltServer.mv3);
                if(strVersion)
                {
                    $(strVersion).replaceAll("#divIptInfo"+iptCltServer.iptOe);
                    if(iptCltServer.total>0)
                    {
                        iptCltServer.getLastIptInfo(iptCltServer.iptOe);
                    }
                }
            }
        },
        setLastIptBtn:function(iptType,isGet)//设置导入按扭
        {
            $("#divIptBtn"+iptType).empty();
    
            var btnInfo = ['<div class="btn_normal" style="inline-block">'
                ,'<ul class="btn_main">'
                ,'<li class="mr_10"><a id="btnIpt{0}" hidefocus="1" href="javascript:void(0)"><i class="l_border"></i>立即{1}<i class="r_border"></i></a></li>'
                ,'</ul>'
                ,'</div>'].join('');
    
            var nameIpt="更新";
            if(!isGet)
            {
                nameIpt="导入";
                $("#divIptBtn"+iptType).append(btnInfo.format(iptType,nameIpt));
                return;
            }
            $("divIptBtn"+iptType).append(btnInfo.format(iptType,nameIpt));
            var timeInfo='<p class="mt-10">上次导入<span class="cf60 fwb">{0}</span>个联系人</p>\
    <p>导入时间：{1}</p>';
            $("#divIptBtn"+iptType).append(btnInfo.format(iptType,nameIpt));
            switch(iptType)
            {
            case iptCltServer.iptFm:
                $("#divIptBtn"+iptType).append(timeInfo.format(iptCltServer.lastCount1,iptCltServer.lastTime1));
                break;
            case iptCltServer.iptMo:
                $("#divIptBtn"+iptType).append(timeInfo.format(iptCltServer.lastCount2,iptCltServer.lastTime2));
                break;
            case iptCltServer.iptOe:
                $("#divIptBtn"+iptType).append(timeInfo.format(iptCltServer.lastCount3,iptCltServer.lastTime3));
                break;
            }
        },
        getLastIptInfo:function(iptType)//得到最后一次导入信息：人数，时间
        {
            var iptSource="";
            switch(iptType)
            {
            case iptCltServer.iptFm://Foxmail:202
                iptSource="202";
                break;
            case iptCltServer.iptMo://MicrosoftOutlook:201
                iptSource="201";
                break;
            case iptCltServer.iptOe://OutlookExpress:204
                iptSource="204";
                break;
            }
            var request="<GetBatchOperHistoryRecord><UserNumber>{0}</UserNumber><OperSource>{1}</OperSource></GetBatchOperHistoryRecord>".format(Pt.getUid(),iptSource);
            var result={};
            function successHandler(doc){
                var tmp= doc.responseData;
    
                if(tmp.ResultCode == "0")
                {
                    var operSource = tmp.OperSource;
                    var operTime = tmp.OperTime;
                    var batchCount = tmp.BatchCount;
                    switch(iptType)
                    {
                    case iptCltServer.iptFm:
                        if(operSource=="202")
                        {
                            iptCltServer.lastCount1=batchCount;
                            iptCltServer.lastTime1=operTime;
                            iptCltServer.setLastIptBtn(iptCltServer.iptFm,true);
                            iptCltServer.bindIptClick(iptType);
                            return true;
                        }
                        break;
                    case iptCltServer.iptMo:
                        if(operSource=="201")
                        {
                            iptCltServer.lastCount2=batchCount;
                            iptCltServer.lastTime2=operTime;
                            iptCltServer.setLastIptBtn(iptCltServer.iptMo,true);
                            iptCltServer.bindIptClick(iptType);
                            return true;
                        }
                        break;
                    case iptCltServer.iptOe:
                        if(operSource=="204")
                        {
                            iptCltServer.lastCount3=batchCount;
                            iptCltServer.lastTime3=operTime;
                            iptCltServer.setLastIptBtn(iptCltServer.iptOe,true);
                            iptCltServer.bindIptClick(iptType);
                            return true;
                        }
                        break;
                    }
                }
                iptCltServer.setLastIptBtn(iptType,false);
                iptCltServer.bindIptClick(iptType);
            }
    
            var api = "GetBatchOperHistoryRecord";
    
            top.$RM.call(api, request, function(a){
                successHandler(a);
            }, { error: function(){
                iptCltServer.setLastIptBtn(iptType,false);
                iptCltServer.bindIptClick(iptType);
            } });
        },
        bindIptClick:function(iptType){
            switch(iptType)
            {
            case iptCltServer.iptFm:
                $("#btnIpt"+iptType).bind("click",iptCltServer.clickIptFm);
                break;
            case iptCltServer.iptMo:
                $("#btnIpt"+iptType).bind("click",iptCltServer.clickIptMo);
                break;
            case iptCltServer.iptOe:
                $("#btnIpt"+iptType).bind("click",iptCltServer.clickIptOe);
                break;
            }
        },
        startIptContacts:function()//iptType定义:1:Foxmail ,2:MicrosoftOutlook,3:OutlookExpress
        {
            if(iptCltServer.cltId!=-1)
            {
                iptCltServer.contactIndex=0;
                iptCltServer.iptCount=0;
                iptCltServer.isNew=1;
                iptCltServer.batchOperId = "";
                iptCltServer.currIndex=0;//当前导入联系人索引
                mailID=iptCltServer.groupName;//导入分组名
    
                iptCltServer.setBtnState(true);
                iptCltServer.processCltContacts();
            }
        },
        setVersionInfo:function(iptType,mv)//设置版本信息
        {
            var verstion="";
            var name="";
            var totalHtm='共有<span class="cf60">{0}</span>个联系人，是否立即导入？';
            if(mv=="")
            {
                return verstion;
            }
            mv=$.trim(mv);
            var verstionInfo='<div class="m lt" id="divIptInfo{0}">\
    <p><strong>您的电脑安装了{1} {2}</strong></p>\
    <p><strong>{3}</strong></p>\
    </div>';
            switch(iptType)
            {
            case iptCltServer.iptFm://Foxmail
                name="Foxmail";
                if(mv=="6.15")
                {
                    verstion="6.5";
                }
                if(mv=="7.0")
                {
                    verstion="7.0";
                }
                iptCltServer.groupName1=name+verstion;
                break;
            case iptCltServer.iptMo://MicrosoftOutlook
                name="Outlook";
                if(mv=="11.0")
                {
                    verstion="2003";
                }
                else if(mv=="12.0")
                {
                    verstion="2007";
                }
                iptCltServer.groupName2=name+verstion;
                break;
            case iptCltServer.iptOe://OutlookExpress
                name="OutlookExpress";
                if(mv=="6.0")
                {
                    verstion="6";
                }
                iptCltServer.groupName3=name+verstion;
                break;
            }
            if(verstion)
            {
                if(iptCltServer.total<1)
                {
                    totalHtm="暂无可导入联系人";
                }
                else{
                    totalHtm=totalHtm.format(iptCltServer.total)
                }
                verstionInfo=verstionInfo.format(iptType,name,verstion,totalHtm);
                return verstionInfo;
            }
            return "";
        },
        setCltData:function(objCurr){
    
            if(objCurr.FullName)
            {
                iptCltServer.row["名"]=objCurr.FullName;
            }
            else
            {
                if(objCurr.LastName)
                    iptCltServer.row["姓"]=objCurr.LastName;
                if(objCurr.FirstName)
                    iptCltServer.row["名"]=objCurr.FirstName;
            }
            if(objCurr.Emails)
                iptCltServer.row["常用邮箱一"]=objCurr.Emails;
            if(objCurr.Email2)
                iptCltServer.row["常用邮箱二"]=objCurr.Email2;
            if(objCurr.Email3)
                iptCltServer.row["商务邮箱"]=objCurr.Email3;
            if(objCurr.NickName)
                iptCltServer.row["昵称"]=objCurr.NickName;
            if(objCurr.Mobile)
                iptCltServer.row["常用手机一"]=objCurr.Mobile;
            if(objCurr.OICQ)
                iptCltServer.row["QQ"]=objCurr.OICQ;
            if(objCurr.HomePage)
                iptCltServer.row["个人主页"]=objCurr.HomePage;
    
            if(objCurr.Sex)
            {
                switch(iptCltServer.iptType)
                {
                case iptCltServer.iptFm:
                    if(objCurr.Sex=="1")
                        iptCltServer.row["性别"]="男";
                    if(objCurr.Sex=="2")
                        iptCltServer.row["性别"]="女";
                    break;
                default:
                    iptCltServer.row["性别"]=objCurr.Sex;
                }
            }
            if(objCurr.Birthday)
                iptCltServer.row["生日"]=objCurr.Birthday;
    
            if(objCurr.FmPostcode)
                iptCltServer.row["邮政编号(详细)"]=objCurr.FmPostcode;
            if(objCurr.HomeTel)
                iptCltServer.row["固话(详细)"]=objCurr.HomeTel;
            if(objCurr.FmFax)
                iptCltServer.row["传真(详细)"]=objCurr.FmFax;
    
            var homeAddress="";//家庭地址
            if(objCurr.FmCountry)
                homeAddress=objCurr.FmCountry;
            if(objCurr.FmProvince)
                homeAddress+=objCurr.FmProvince;
            if(objCurr.FmCity)
                homeAddress+=objCurr.FmCity;
            if(objCurr.FmStreetAddr)
                homeAddress+=objCurr.FmStreetAddr;
            if(homeAddress)
                iptCltServer.row["家庭地址"]=homeAddress;
    
            if(objCurr.Company)
                iptCltServer.row["公司名称"]=objCurr.Company;
    
            if(objCurr.PostCode)
                iptCltServer.row["邮政编码(商务)"]=objCurr.PostCode;
    
            if(objCurr.OfHomePage)
                iptCltServer.row["公司主页"]=objCurr.OfHomePage;
            if(objCurr.OfPosition)
                iptCltServer.row["职务"]=objCurr.OfPosition;
            if(objCurr.OfficeTel2)
                iptCltServer.row["商务手机"]=objCurr.OfficeTel2;
            if(objCurr.OfficeTel)
                iptCltServer.row["商务固话"]=objCurr.OfficeTel;
            if(objCurr.Fax)
                iptCltServer.row["商务传真"]=objCurr.Fax;
    
            var cPAddress="";//公司地址
            if(objCurr.OfCountry)
                cPAddress=objCurr.OfCountry;
            if(objCurr.OfProvince)
                cPAddress+=objCurr.OfProvince;
            if(objCurr.OfCity)
                cPAddress+=objCurr.OfCity;
    
            if(objCurr.CompanyStreet) cPAddress += objCurr.CompanyStreet;
    
            if(objCurr.HomeAddress)
                cPAddress += objCurr.HomeAddress;
    
            if(cPAddress)
                iptCltServer.row["公司地址"]=cPAddress;
    
    
        },
        setClientInfo:function()//获取本地系统客户端版本信息
        {
            var clientInfo=null;
            if(document.all)//IE
            {
                clientInfo= uploader.GetMailClients();
            }
            else
            {
                clientInfo= $("#embed1")[0].GetMailClients();
            }
            if(clientInfo)
            {
                objClients=eval("tmp="+clientInfo);
                if(objClients && objClients.resultcode==0)
                {
                    if(objClients.Foxmail)
                    {
                        iptCltServer.cltId1=objClients.Foxmail.id;
                        iptCltServer.mv1=objClients.Foxmail.majorversion;
                    }
                    if(objClients.MicrosoftOutlook)
                    {
                        iptCltServer.cltId2=objClients.MicrosoftOutlook.id;
                        iptCltServer.mv2=objClients.MicrosoftOutlook.majorversion;
                    }
                    if(objClients.OutlookExpress)
                    {
                        iptCltServer.cltId3=objClients.OutlookExpress.id;
                        iptCltServer.mv3=objClients.OutlookExpress.majorversion;
                    }
                }
            }
        },
        importing:function()
        {
            var showHtm='<div class="r" id="divIptBtn{0}">\
        <div class="ip-load">\
        <i></i>\
        <span>正在导入...</span>\
        </div>\
    </div>';
            showHtm=showHtm.format(iptCltServer.iptType);
            $(showHtm).replaceAll("#divIptBtn"+iptCltServer.iptType);
        },
        intervalID:0,
        batchOperId:"",
        iptStatus:function(iptCount){//查询批量导入状态
            var request="<GetBatchOperStatus><UserNumber>{0}</UserNumber><BatchOperId>{1}</BatchOperId></GetBatchOperStatus>".format(Pt.getUid(),iptCltServer.batchOperId);
            function successHandler(returnValue){
    
                returnValue = returnValue.responseData;
                if(returnValue){//ResultCode,LoadStatus
                    if(returnValue.ResultCode == "0")
                    {
                        switch(returnValue.LoadStatus)//0:完成1:处理中2:失败 3:超时失效
                        {
                        case "1":
                            return;
                            break;
    
                        case "0":
                            window.clearInterval(iptCltServer.intervalID);
                            iptCltServer.iptCount = parseInt(iptCount);
                            //此处导入积分（添加完成后，需要导入积分的逻辑）
                            if (top.postJiFen) {
                                top.postJiFen(70, iptCount);
                            }
    
                            if(iptCltServer.contactIndex<iptCltServer.total) {
                                iptCltServer.processCltContacts();
                            } else {
                                iptCltServer.iptSuccess();
                                iptCltServer.setBtnState(false);
                            }
                            return;
                            break;
    
                        case "2":
                        case "3":
                            window.clearInterval(iptCltServer.intervalID);
                            iptCltServer.iptFail();
                            iptCltServer.setBtnState(false);
                            break;
                        }
                    }
                }
                window.clearInterval(iptCltServer.intervalID);
                iptCltServer.iptFail();
                iptCltServer.setBtnState(false);
            }
    
            var api = "GetBatchOperStatus";
            top.$RM.call(api, request, function(a){
                successHandler(a);
            }, { error: function(){
                window.clearInterval(iptCltServer.intervalID);
                iptCltServer.iptFail();
                iptCltServer.setBtnState(false);
            } });
        },
        iptContants:function()
        {
            function successHandler(returnValue){
                if(returnValue)
                {
                    var res = M139.JSON.tryEval(returnValue);
    
                    if(res)
                    {
                        iptCltServer.batchOperId=res.batchOperId;//批次ID
                        switch(res.iptResult)
                        {
                        case "-2":
                        case "1280":
                            iptCltServer.mesIptErr="你操作太快了，请休息一下再试!";
                            break;
                        case "0":
                        case "1":
                            //导入状态查询
                            iptCltServer.intervalID = window.setInterval("iptCltServer.iptStatus({0})".format(res.iptCount), 2000);
                            return;
                            break;
                        case "21":
                            iptCltServer.mesIptErr = PageMsg['error_overlimit'].format(maxLimit);
                            if(iptCltServer.contactIndex>=iptCltServer.max)//第一批以后导入...
                            {
                                iptCltServer.mesIptErr = PageMsg['error_overlimit'].format(maxLimit);
                            }
                            break;
                        case "24":
                            iptCltServer.mesIptErr = PageMsg['error_overlimit3'].format(maxLimit);
                            if(iptCltServer.contactIndex>=iptCltServer.max)//第一批以后导入...
                            {
                                iptCltServer.mesIptErr = PageMsg['error_overlimit3'].format(maxLimit);
                            }
                            break;
                        }
                    }
                }
                iptCltServer.iptFail();
                iptCltServer.setBtnState(false);
            }
    
            var callback=null;
    
            //正在导入设置
            iptCltServer.importing();
    
            Pt.callOldApi({
                action: "iptclientcontants.ashx",
                params: {
                    IptType: iptCltServer.iptType,
                    GroupName: iptCltServer.groupName,
                    repeatType: iptCltServer.repeatType,
                    batch: iptCltServer.batchOperId,
                    isNew: iptCltServer.isNew
                },
                data: "xml=" + encodeURIComponent(iptCltServer.contantData),
                success: function(a){
                    successHandler(a);
                },
                error: function(){
                    iptCltServer.iptFail();
                }
            });
    
            iptCltServer.isNew=-1;
        },
        iptFail:function()
        {
            var showHtm='<div class="r" id="divIptBtn{0}">\
        <i class="i-small-fail"></i>\
        <p class="fs14 {1}"><strong>{2}</strong></p>\
        {3}\
    </div>';
            var failClass="mt-10";
            var sourceErr="导入失败，请稍后再试";
            var retry='<p><a href="javascript:iptCltServer.iptContants()" title="重新导入" class="tdu">重新导入</a></p>';
            if(iptCltServer.mesIptErr)
            {
                failClass="pt5";
                retry="";
                sourceErr=iptCltServer.mesIptErr;
            }
            else if(iptCltServer.contactIndex>=iptCltServer.max)//第一批以后导入...
            {
                iptCltServer.sourceErr="部分联系人导入失败，请稍后再试";
            }
            showHtm=showHtm.format(iptCltServer.iptType,failClass,sourceErr,retry);
            $(showHtm).replaceAll("#divIptBtn"+iptCltServer.iptType);
        },
        iptSuccess:function()
        {
            var showInfo='<div class="r" id="divIptBtn{0}"><i class="i-small-succ"></i>\
        <p class="mt-10 fs14 c390"><strong>成功导入<span class="cf60">{1}</span>个联系人</strong></p>\
        <p><a id="aIptInfo{2}" href="javascript:" title="告知好友" class="tdu tellFriend">告知好友</a></p></div>';
    
            //&nbsp;&nbsp;<a href="javascript:top.Links.show(\'invite\');" title="发送邀请" class="tdu pl20">发送邀请</a>
    
            showInfo=showInfo.format(iptCltServer.iptType,iptCltServer.iptCount,iptCltServer.iptType);
            var msgPanel = $(showInfo);
            msgPanel.replaceAll("#divIptBtn"+iptCltServer.iptType);
    
            var lnkTell = msgPanel.find(".tellFriend");
    
            //replace的DOM操作会延时一段时间，才能绑定成功
            setTimeout(function(){
    
                lnkTell.click(function(){
                    var tmpType="";
                    switch(this.id)
                    {
                    case "aIptInfo"+iptCltServer.iptFm:
                        tmpType=iptCltServer.iptFm;
                        break;
                    case "aIptInfo"+iptCltServer.iptMo:
                        tmpType=iptCltServer.iptMo;
                    case "aIptInfo"+iptCltServer.iptOe:
                        tmpType=iptCltServer.iptOe;
                    }
                    if(tmpType)
                    {
                        var url = Pt.ucDomain("/addr/matrix/input/invite.aspx");
                        url += "&invitetype=5&groupname={0}&batch={1}".format(iptCltServer.groupName,tmpType);
                        location.href = url;
                    }
                    return false;
                });
    
            }, 256);
    
            setTimeout(function() {
                top.$App.trigger("change:contact_maindata");
            }, 2000);
        },
        processCltContacts:function()//处理客户端联系人数据
        {
            if(iptCltServer.arrCurr)
            {
                iptCltServer.arrAll.repush(iptCltServer.arrCurr);
                iptCltServer.arrCurr=new Array();//当前组联系人
            }else{
                iptCltServer.arrCurr=new Array();//当前组联系人
                iptCltServer.arrAll=new Array();
            }
            iptCltServer.currIndex=0;//当前组索引
    
            for(;iptCltServer.currIndex<=iptCltServer.total && iptCltServer.contactIndex<iptCltServer.total;iptCltServer.currIndex++)
            {
                if(document.all)//IE
                {
                    contactCurr= uploader.GetContactFromIndex(""+iptCltServer.cltId,""+iptCltServer.contactIndex);
                }
                else
                {
                    contactCurr= $("#embed1")[0].GetContactFromIndex(""+iptCltServer.cltId,""+iptCltServer.contactIndex);
                }
                iptCltServer.contactIndex++;
                if(contactCurr)
                {
                    objCurr=eval("tmp="+contactCurr);
                    if(objCurr.resultcode==0)
                    {
                        iptCltServer.row=new CsvDataRow();
                        iptCltServer.setCltData(objCurr);
                        iptCltServer.arrCurr[iptCltServer.contactIndex]=iptCltServer.row;
                        if(iptCltServer.contactIndex%iptCltServer.max==0)//防止客户端联系人较多，分批提交数据
                        {
                            iptCltServer.contantData=titles139+"\r\n"+iptCltServer.arrCurr.join("\r\n");
                            iptCltServer.iptContants();
                            return;
                        }
                    }
                }
            }
            if(iptCltServer.arrCurr.length>0)//未到时iptCltServer.max时
            {
                iptCltServer.contantData=titles139+"\r\n"+iptCltServer.arrCurr.join("\r\n");
                iptCltServer.iptContants();
            }
        }
    }
    
    $(function() {
        var control='<embed id="embed1" type="application/x-richinfo-mail139activex" hiden="true" height="0">';
        if(document.all)//IE
        {
            control='<OBJECT ID="uploader" name="uploader" CLASSID="CLSID:63A691E7-E028-4254-8BD5-BDFDB8EF6E66" height="0"></OBJECT>';
        }
        $(".ml3P-contacts").prepend(control);
        top.addBehavior("从我的电脑导入页面");
    
        var isCheckCtl = $Url && $Url.queryString("check"); //未传参，则是由通讯录导入首页校验过后进来的。
        if (isCheckCtl && !iptCtlHelper.checkCtl()) {
            //检查控件标记为打开，并且控件未安装时，直接返回
            return;
        }
        iptCltServer.initIptClt();
    });
    
    iptCtlHelper = {
        checkCtl: function () {
            var result = false;
    
            if (ADDR_I18N) {
                var PageMsg2 = ADDR_I18N[ADDR_I18N.LocalName].clone;
            }
            var _this = this;
    
            var cmd = "<param><command>common_getversion</command></param>";
            var vn = "", returnValue = "";
            var iptVerstion = 16777221;
            try {
                if (document.all)//IE
                {
                    returnValue = uploader.Command(cmd);
                    if (returnValue) {
                        vn = _this.getVersion(returnValue);
                    }
                }
                else {
                    if ($("#embed1") && $("#embed1")[0]) {
                        returnValue = $("#embed1")[0].Command(cmd);
                    }
                    if (returnValue) {
                        vn = _this.getVersion(returnValue);
                    }
                }
            } catch (err) {
            }
            if (vn && parseInt(vn) > iptVerstion) {
                result = true;
            }
            else if (vn && parseInt(vn) <= iptVerstion)//已安装须升级
            {
                var toolsMes = "您已安装139邮箱小工具，需升级才能从电脑导入通讯录。确定要现在升级吗？";
                if (PageMsg2['ipt139ToolsUpdate']) {
                    toolsMes = PageMsg2['ipt139ToolsUpdate'];
                }
                _this.showSetup(toolsMes);
            }
            else {//未安装<return><error>1</error></return>
                var toolsMes = "您需要安装139邮箱小工具，才能从电脑导入通讯录。确定要现在安装吗？";
                if (PageMsg2['iptClt139Tools']) {
                    toolsMes = PageMsg2['iptClt139Tools'];
                }
                _this.showSetup(toolsMes);
            }
            return result;
        },
        getVersion: function (str) {
            var rv = "";
            var strVn = "<version>";
            var index = str.indexOf(strVn) + strVn.length;
            if (index > 0) {
                var endIndex = str.indexOf("</version>");
                if (endIndex > index) {
                    var numVn = str.substr(index, endIndex - index);
                    if (numVn) {
                        rv = numVn;
                    }
                }
            }
            return rv;
        },
        showSetup: function (mes) {
            top.FloatingFrame.confirm(mes, function () {
                top.addBehaviorExt({ actionId: 30190, thingId: 0, moduleId: 14 });
                var url = top.ucDomain + "/LargeAttachments/html/control139.htm";
                window.open(url);
            });
        }
    };
    }(jQuery));