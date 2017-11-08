// JavaScript Document
/*OA审批手机端跳转出页面的js*/
function AjaxClass(){

    var XmlHttp = false;  
    try  
    {  
        XmlHttp = new XMLHttpRequest();        //FireFox专有  
    }  
    catch(e)  
    {  
        try  
        {  
            XmlHttp = new ActiveXObject("MSXML2.XMLHTTP");  
        }  
        catch(e2)  
        {  
            try  
            {  
                XmlHttp = new ActiveXObject("Microsoft.XMLHTTP");  
            }  
            catch(e3)  
            {  
                alert(top.Lang.Mail.Write.ndllqbzcdxqsjdysbbDSPoZIxT);  //你的浏览器不支持XMLHTTP对象，请升级到IE6以上版本！
                XmlHttp = false;  
            }  
        }  
    }  
  
    var me = this;  
    this.Method = "POST";  
    this.Url = "";  
    this.Async = true;  
    this.Arg = "";  
    this.CallBack = function(){};  
    this.Loading = function(){};  
      
    this.Send = function()  
    {  
        if (this.Url=="")  
        {  
            return false;  
        }  
        if (!XmlHttp)  
        {  
            return IframePost();  
        }  
  
        XmlHttp.open (this.Method, this.Url, this.Async);  
        if (this.Method=="POST")  
        {  
            XmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");  
        }  
        XmlHttp.onreadystatechange = function()  
        {  
            if (XmlHttp.readyState==4)  
            {  
                var Result = false;  
                if (XmlHttp.status==200)  
                {  
                    Result = XmlHttp.responseText;  
                }  
                XmlHttp = null;  
                  
                me.CallBack(Result);  
            }  
             else  
             {  
                me.Loading();  
             }  
        }  
        if (this.Method=="POST")  
        {  
            XmlHttp.send(this.Arg);  
        }  
        else  
        {  
            XmlHttp.send(null);  
        }  
    }  
      
    //Iframe方式提交  
    function IframePost()  
    {  
        var Num = 0;  
        var obj = document.createElement("iframe");  
        obj.attachEvent("onload",function(){ me.CallBack(obj.contentWindow.document.body.innerHTML); obj.removeNode() });  
        obj.attachEvent("onreadystatechange",function(){ if (Num>=5) {alert(false);obj.removeNode()} });  
        obj.src = me.Url;  
        obj.style.display = 'none';  
        document.body.appendChild(obj);  
    }  
};

function callback(str){
    /*审批类通用页面渲染*/
    var arr=eval('('+str+')');
    var taskstr=arr['var'].webTaskBusinessModel.taskInfo;
    var strr=taskstr.replace(/&quot;/g, "'");
    var taskstrr=eval('('+strr+')');
    var tbody=document.getElementById("tbody");
    var tdlist=arr['var'].examineList;


    /*if(document.getElementById("passHref")){
        document.getElementById("passHref").href='javascript:;';
        document.getElementById("rejectHref").href='javascript:;';
    }*/
    
    document.getElementById("taskSubject").innerHTML=arr['var'].webTaskBusinessModel.taskSubject;
        document.getElementById("senderUserName").style.color="black";
    document.getElementById("createTime").innerHTML=arr['var'].webTaskBusinessModel.createTime;
        document.getElementById("createTime").style.color="black";
    document.getElementById("senderUserName").innerHTML=arr['var'].senderUserName;
        document.getElementById("senderUserName").style.color="black";
    
    var Order=arr['var'].examineOrder;
    var theUser=tdlist[tdlist.length-1].examineUser;
    var examineOrder=Order.replace(new RegExp(theUser,'g'), "<span style='color:black'>"+theUser+"</span>");

     document.getElementById("firstOrder").innerHTML=examineOrder;

        //document.getElementById("firstOrder").style.color="black";
    document.getElementById("middleOrder").style.display="none";
    document.getElementById("lastOrder").style.display="none";
    for(var i=0;i<tdlist.length;i++){
        if(tdlist[i]){
            var tr=document.createElement("tr");
            var td1=document.createElement("td");
            td1.innerHTML=tdlist[i].nodeName;
            tr.appendChild(td1);
            
            var td2=document.createElement("td");
            td2.innerHTML=tdlist[i].examineUser;
            tr.appendChild(td2);
            
            var td3=document.createElement("td");
            if(tdlist[i].examineResult==0){
                td3.innerHTML=top.Lang.Mail.Write.zhengzaishenpi;//正在审批
                td3.style.color="#00B615";
                
            }
            else if(tdlist[i].examineResult==1){
                td3.innerHTML=top.Lang.Mail.Write.shenpitongguo;//审批通过
                td3.style.color="#00B615";
            }
            else{
                    td3.innerHTML=top.Lang.Mail.Write.shenpibohui;//审批驳回
                    td3.style.color="red";
            }
            tr.appendChild(td3);

            var td4=document.createElement("td");
            if(tdlist[i].examineDate==null){tdlist[i].examineDate="---"}
            td4.innerHTML=tdlist[i].examineDate;
            tr.appendChild(td4);

            tbody.appendChild(tr);
            if(tdlist[i].examineOpinion!=""){
                var tr=document.createElement("tr");
                var td=document.createElement("td");
                td.colSpan="4";
                td.className="creattrtd";
                td.innerHTML=top.Lang.Mail.Write.shenpiyijian+tdlist[i].examineOpinion;//审批意见：<br>&nbsp;&nbsp;
                tr.appendChild(td);
                tbody.appendChild(tr);
            }
        }
    }
    
    /*审批类通用页面渲染*/
    
    /*加班审批时间渲染*/
        if(document.getElementById("title")){document.getElementById("title").innerHTML=taskstrr.contentJson.title;}
        if(document.getElementById("content")){document.getElementById("content").innerHTML=taskstrr.contentJson.content;}
        if(document.getElementById("dayNum")){document.getElementById("dayNum").innerHTML=taskstrr.contentJson.dayNum;}
        if(document.getElementById("beginDate")){document.getElementById("beginDate").innerHTML=taskstrr.contentJson.beginDate;}
        if(document.getElementById("beginTime")){document.getElementById("beginTime").innerHTML=taskstrr.contentJson.beginTime;}
        if(document.getElementById("endDate")){document.getElementById("endDate").innerHTML=taskstrr.contentJson.endDate;}
        if(document.getElementById("endTime")){document.getElementById("endTime").innerHTML=taskstrr.contentJson.endTime;}
        if(document.getElementById("hourNum")){document.getElementById("hourNum").innerHTML=taskstrr.contentJson.hourNum;}
    
    /*加班审批时间完成*/

    /*请假审批时间渲染*/
        //if(document.getElementById("content")){document.getElementById("content").innerHTML=taskstrr.contentJson.content;}
        var n=taskstrr.contentJson.holidayType;
        if(document.getElementById("holidayType")){
            switch(n)
            {
                case '1':
                document.getElementById("holidayType").innerHTML=top.Lang.Mail.Write.shijia;//事假
                break;
                case '2':
                document.getElementById("holidayType").innerHTML=top.Lang.Mail.Write.nianjia;//年假
                break;
                case '3':
                document.getElementById("holidayType").innerHTML=top.Lang.Mail.Write.burujia;//哺乳假
                break;
                case '4':
                document.getElementById("holidayType").innerHTML=top.Lang.Mail.Write.huli;//护理
                break;
                case '5':
                document.getElementById("holidayType").innerHTML=top.Lang.Mail.Write.bingjia;//病假
                break;
                case '6':
                document.getElementById("holidayType").innerHTML=top.Lang.Mail.Write.gongjia;//公假
                break;
                case '7':
                document.getElementById("holidayType").innerHTML=top.Lang.Mail.Write.hunjia;//婚假
                break;
                case '8':
                document.getElementById("holidayType").innerHTML=top.Lang.Mail.Write.chanqianjia;//产前假
                break;
                case '9':
                document.getElementById("holidayType").innerHTML=top.Lang.Mail.Write.chanjia;//产假
                break;
                case '10':
                document.getElementById("holidayType").innerHTML=top.Lang.Mail.Write.qita;//其他
                break;
            }
        }
        //if(document.getElementById("dayNum")){document.getElementById("dayNum").innerHTML=taskstrr.contentJson.dayNum;}
        //if(document.getElementById("beginDate")){document.getElementById("beginDate").innerHTML=taskstrr.contentJson.beginDate;}
        //if(document.getElementById("beginTime")){document.getElementById("beginTime").innerHTML=taskstrr.contentJson.beginTime;}
        //if(document.getElementById("endDate")){document.getElementById("endDate").innerHTML=taskstrr.contentJson.endDate;}
        //if(document.getElementById("endTime")){document.getElementById("endTime").innerHTML=taskstrr.contentJson.endTime;}
    
    /*请假审批时间渲染*/

    /*通用审批*/
    
        //if(document.getElementById("content")){document.getElementById("content").innerHTML=taskstrr.contentJson.content;}
    
    /*通用审批结束*/

    /*项目审批*/
    
        if(document.getElementById("demandExplain")){document.getElementById("demandExplain").innerHTML=taskstrr.contentJson.demandExplain;}
        if(document.getElementById("num")){document.getElementById("num").innerHTML=taskstrr.contentJson.num==''?'&nbsp;':taskstrr.contentJson.num;}
        if(document.getElementById("onlineDate")){document.getElementById("onlineDate").innerHTML=taskstrr.contentJson.onlineDate;}
        if(document.getElementById("projectPlan")){document.getElementById("projectPlan").innerHTML=taskstrr.contentJson.projectPlan;}
        if(document.getElementById("ver")){document.getElementById("ver").innerHTML=taskstrr.contentJson.ver==''?'&nbsp;':taskstrr.contentJson.ver;}
        if(document.getElementById("workType")){document.getElementById("workType").innerHTML=taskstrr.contentJson.workType==''?'&nbsp;':taskstrr.contentJson.workType;}
    
    /*项目审批结束*/
}


