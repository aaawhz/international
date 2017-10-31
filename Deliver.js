//����״̬����
function Deliver(){
    this.divId = "divListDeliver_"; 
}

Deliver.prototype = {
    initialize: function(){
        var od = MM[gConst.deliver];
        od.name = "deliver";
        od.needRequest = true;
        od.func = "mbox:getDeliverStatus";
        od.start = 0;
        od.sort = 0;
        od.total = 200;
        od.data = {sort:0,start:0,total:200};
        od.call = function(){}; 
        GMC.initialize(od.name, this);
    },  
    getDeliverStatus:function(){
        var p1 = this;
        var o = p1.name;
        var call = function(ao){
            try {
                CM[o] = ao;
                var html = p1.getHtml();
                $(gConst.mainBody + o).innerHTML = html;
                p1.setDivHeight();
            }catch(e){
                
            }
        };
        MM.mailRequest({
            func:gConst.func.deliverStatus,
            data: {sort:this.sort,start:0,total:200},
            call:call,
            msg: Lang.Mail.deliver.viewDeliverStatus //"��ѯ�ʼ�Ͷ��״̬"
        });
    },
    getHtml:function(){
        var html = [];
        var p1 = this;
        var o = p1.name;
        var om = CM["deliver"]["var"];
        p1.deliverData = {info:{},items:[]};
        p1.headId = "headStatus_" + o +"_";
        var DomainValue = {
            "0":Lang.Mail.deliver.bynomailgroup,//"������ʼ���",
            "1":Lang.Mail.deliver.bdmailgroup,//"�����ʼ���",
            "2":Lang.Mail.deliver.foreignmail//"�����ʼ�"
        };
        var DSV = {
            "0":Lang.Mail.deliver.goqueque,//"�������",
            "1":Lang.Mail.deliver.bydelivered,//"������Ͷ��",
            "2":Lang.Mail.deliver.byreaded,//"�����û����Ķ�",
            "3":Lang.Mail.deliver.bydeleted,//"�����û���ɾ��",
            "99":Lang.Mail.deliver.bydfail,//"����Ͷ��ʧ��",
            "100":Lang.Mail.deliver.bytransfroms,//"������ת�����Է�������",
            "101":Lang.Mail.deliver.foreigncf//"�������ط�"
        };
        var objStatus = {iTotal:0,iOk:0,iFail:0,iDeliver:0};

        //var text = p1.text.lefts(30);
        var strTitle = '<h1>'+ Lang.Mail.deliver.mailsendstauts+'</h1><p></p>';
       
        html.push("<div id=\"mailsentStatus\" class=\"mailsentStatus\">");
        html.push("<div class=\"wrapper\"><div class=\"container\">");
        
        //html.push("<div class=\"pageNav\"><a id=\"prev1\" href=\"#\">��һҳ</a>|<a id=\"next1\" href=\"#\">��һҳ</a>");
        //html.push("<select id=\"goto1\"><option value=\"1\">1/12</option></select>");
        //html.push("</div>");
 
        html.push("<h3><strong>"+ Lang.Mail.deliver.mailsendstauts+"</strong><span>[</span><div class=\"clearfloat\">");
        html.push("<div class=\"deliver\"><i class=\"i-mD1\"></i><span id=\"{0}ok\">"+ Lang.Mail.deliver.lsuccess+"</span></div>".format(p1.headId));
        html.push("<div class=\"deliver\"><i class=\"i-mD2\"></i><span id=\"{0}deliver\">"+ Lang.Mail.deliver.lsending+"</span></div>".format(p1.headId));
        html.push("<div class=\"deliver\"><i class=\"i-mD3\"></i><span id=\"{0}fail\">"+ Lang.Mail.deliver.lfailed+"</span></div>".format(p1.headId));
        html.push("</div><span>]</span></h3>");
        /** table head */
        html.push("<div class=\"list\" id=\"{0}{1}_main\"><table><tbody>".format(p1.divId,o));
        html.push("<tr><th class=\"tos\">"+ Lang.Mail.deliver.sender+"</th><th class=\"subject\" >"+ Lang.Mail.deliver.theme+"</th>");
        html.push("<th class=\"dlStatus\" >"+ Lang.Mail.deliver.sendStatus+"</th>");
        html.push("<th class=\"date\" onclick=\"MM['"+o+"'].rankList();\"><a title=\""+ Lang.Mail.deliver.clickbysort+"\" href=\"javascript:fGoto();\">"+ Lang.Mail.deliver.time+" </a><i id=\"" + gConst.listMailSortIcon + "receiveDate_deliver\" class=\"desc\"></i></th>");
        
        if (om.length > 0) {
            html[html.length] = '<table>';
            for (var i = 0; i < om.length; i++) {
                var item = om[i];
                var toObj = p1.getToInfo(item.tos);
                tos = toObj.toTotal.join(",");
                tos = tos.encodeHTML();
                var date = Util.formatDate(item.sendDate);
                var subject = item.subject || "<"+ Lang.Mail.deliver.sendStatus+">";
                subject = subject.encodeHTML();
                toObj.subject = subject;
                toObj.date = date;
                 /** table body */
                html.push("<tr class=\"\">");
                html.push("<td class=\"tos\">{0}</td>".format(tos));
                html.push("<td class=\"subject\" >{0}</td>".format(subject));
                html.push("<td class=\"dlStatus\" >");
                html.push("<div>");
                html.push("<div class=\"deliver\"><i class=\"i-mD1\"></i><a href=\"javascript:fGoto();\" onclick=\"MM['{0}'].showSendStatus(0,{1})\">{2}"+ Lang.Mail.deliver.isuccess+"</a></div>".format(o,i,toObj.iOk));
                html.push("<div class=\"deliver\"><i class=\"i-mD2\"></i><span>{0}"+ Lang.Mail.deliver.isending+"</span></div>".format(toObj.iDeliver));
                html.push("<div class=\"deliver\"><i class=\"i-mD3\"></i><a href=\"javascript:fGoto();\" onclick=\"MM['{0}'].showSendStatus(1,{1})\">{2}"+ Lang.Mail.deliver.ifail+"</a></div>".format(o,i,toObj.iFail));
                html.push("</div></td>");
                html.push("<td class=\"date\" >{0}</td>".format(date));
                html.push("</tr>");
                objStatus.iOk += toObj.iOk;
                objStatus.iTotal += toObj.iTotal;
                objStatus.iFail += toObj.iFail;
                objStatus.iDeliver += toObj.iDeliver;
                p1.deliverData.items.push(toObj);
            }
            p1.deliverData.info = objStatus;
            html.push("</tbody></table>");
        } else {
            html[html.length] = '<p class="empty" style="display:block">'+ Lang.Mail.deliver.nosenderecorder+'</p>';
        }  
        html.push("</div>");
        //html.push("<h3><div class=\"pageNav\">");
        //html.push("<a id=\"prev1\" href=\"#\">��һҳ</a>|<a id=\"next1\" href=\"#\">��һҳ</a>");
        //html.push("<select id=\"goto1\">");
        //html.push("<option value=\"1\">1/12</option>");
        //html.push("</select>");
        //html.push("</div>");
        //html.push("</h3>");
        html.push("</div></div>");
        html.push("</div>");
        return html.join("");
    },
    /**
     * �õ��ʼ�Ͷ��״̬��Ϣ���ռ���
     * @param {Object} tos �ռ��˶���
     * @param {Object} һ������
     * {iOk:0,    //Ͷ�ݳɹ���
     * iFail:0,   //Ͷ��ʧ����
     * iDeliver:0, //�´�Ͷ�ݵ��ʼ���
     * iTotal:0,   //�ռ�������
     * tos:["test@richinfo.cn"], //�ռ�������
     * }
     */
    getToInfo:function(tos){        
        var obj = {iTotal:0,iOk:0,iFail:0,iDeliver:0,toTotal:[],toOk:[],toFail:"",toDeliver:[]};
        for(var i=0,l=tos.length;i<l;i++){
            var to_item = tos[i];
            var flag = to_item.flag;
            var state = to_item.state;
            var mail = to_item.mail;
            obj.toTotal.push(mail);
            obj.iTotal++;
            if(state==0||state==101){                      //Ͷ����
                obj.iDeliver ++;
                obj.toDeliver.push(mail);
            }else if(state>=1 || state<=3 || state==100){ //Ͷ�ݳɹ�
                obj.iOk ++;
                obj.toOk.push(mail);
            }else {                                        //Ͷ��ʧ��
                obj.iFail ++; 
                obj.toFail.push(mail);        
            }
        }
        return obj;
    },
    updateStatus:function(){
        var id = this.headId;
        var data = this.deliverData.info;
        var n1 = $(id+"ok");
        var n2 = $(id+"fail");
        var n3 = $(id+"deliver");
        n1.innerHTML  = data.iOk + ""+ Lang.Mail.deliver.isuccess+"";
        n2.innerHTML = data.iFail + ""+ Lang.Mail.deliver.isending+"";
        n3.innerHTML = data.iDeliver + ""+ Lang.Mail.deliver.ifail+"";
    },
    /**
     * ��ʾ����״̬����
     * @param {Object} type ���� 0��Ͷ�ݳɹ���1:Ͷ��ʧ��
     * @param {Object} index ��������
     */
    showSendStatus:function(type,index){
        var html = [];
        var id = "showMsg_" + this.name + "_" + type + "_" + index;
        var data = this.deliverData.items[index];
        if (data) {
            var tos = (type==0)?data.toOk:data.toFail;
            var status = (type==0)?""+ Lang.Mail.deliver.sendesuccess+"":"sendefail";
            html.push("<div class=\"mailsentStatus\"><div class=\"list\">");
            html.push("<h3><strong>{0}</strong></h3>".format(data.subject));
            html.push("<br><table><tbody>");
            html.push("<tr><th class=\"to\">"+ Lang.Mail.deliver.toer+"</th>");
            html.push("<th class=\"type\" >"+ Lang.Mail.deliver.sendestatus+"</th>");
            html.push("<th class=\"date\" >"+ Lang.Mail.deliver.time+"</th></tr>");
            for (var i = 0; i < tos.length; i++) {
                html.push("<tr class=\"\">");
                html.push("<td class=\"to\">{0}</td>".format(tos[i]));
                html.push("<td class=\"type\">{0}</td>".format(status));
                html.push("<td class=\"date\" >{0}</td>".format(data.date));
                html.push("</tr>");
            }
            html.push("</tbody></table><br></div></div>");    
            var ao = {
                id : id,
                title : ""+ Lang.Mail.deliver.sendestatus+"",
                text : html.join(""),
                width:400,
                zindex : 1100,
                buttons : []
            };
            CC.msgBox(ao); 
        }
    },        
    init:function(){
        this.updateStatus();
        this.setDivHeight();
    },
    setDivHeight: function(){
        var p1 = this;
        var o = p1.name;
        //�õ��ʼ��б�ҳ���ܸ߶�(����������)        
        var mh = CC.docHeight() - GE.pos()[1];    //$(gConst.divToolbar + o).offsetHeight;
        var rh = 0;
       //�õ��ʼ��б���ʾ����߶�(���������״̬��)
        //var bodyH = mh - $(gConst.listHeaderId + o).offsetHeight - $(gConst.listHeaderId + o).offsetHeight;
        //bodyH += 4;
        var bodyH = mh;
        try {
            El.setStyle($("mailsentStatus"), {
                "height": bodyH + "px"
            });
        } catch (e1) { 
        }
    },
    rankList:function(){
        this.sort = 1 - this.sort;
        this.getDeliverStatus();
        var icon = (this.sort==0)?"desc":"asc";
        El.setClass($(gConst.listMailSortIcon + 'receiveDate_deliver'), icon);
    },
    resize: function(){
        var p1 = this;
        p1.setDivHeight();
    },
    exit: function(){
        return true;
    }
};
