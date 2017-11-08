/***
 * @description 短信记录
 */
var smsLang=Lang.Sms;
var smsRecord = {
    showType:'',    //显示记录类型
    allRecord:jQuery('#allrecord'),
    timeRecord:jQuery('#timerecord'),
    recordSet:jQuery('#recordset'),
    sendMsgUrl:'/sms/sms.do',                            //短信url
    getSmsConfigFunc:'sms:getSmsConfig',                 //获取短信设置命令
    updateSmsConfigFunc:'sms:updateSmsConfig',           //修改短信设置命令
    getSmsRecordFunc:'sms:listSendRecord',               //获取短信记录命令
    delSmsRecordFunc:'sms:delSendRecord',                //删除短信记录命令
    recoreSetLoad:false,                                 //短信记录设置是否加载完成
    saveSuccTips:smsLang.saveSuccTips,                   //短信记录设置保存成功提示
    recordnumRadio:jQuery('input[name="recordnum"]'),
    autosaveRadio:jQuery('input[name="isautosave"]'),
    delRecordNoSelectTips:smsLang.delRecordNoSelectTips, //请选择要删除的短信提示
    delRecordConfirmTips:smsLang.delRecordConfirmTips,   //删除短信记录确认提示
    delRecordSucc:smsLang.delRecordSucc,                 //短信记录删除成功提示
    queryRecordEmpty:smsLang.queryRecordEmpty,           //请输入要查询的短信内容提示
    currAjaxFlag:'',
    searchKey:'',
    /**
     * 初始化导航
     */
    initNav:function(reflag){
        var _this=this;
        _this.showType=reflag;
        _this.allRecord.die().live('click',function(){
            jQuery('#sms_record').removeClass('show-setting');
            jQuery('#topPage_sys2').hide();
            _this.showAllRecord(1);
        })
        _this.timeRecord.die().live('click',function(){
            jQuery('#sms_record').removeClass('show-setting');
            jQuery('#topPage_sys2').hide();
            _this.showTimeRecord(1);
        })
        _this.recordSet.die().live('click',function(){
            jQuery('#sms_record').addClass('show-setting');
            _this.showRecordSet();
        })

        if(_this.showType!=''&&_this.showType=='time'){
            _this.showTimeRecord(1);
        }else{
            _this.showAllRecord(1);
        }

    },
    /**
     * 显示所有记录
     */
    showAllRecord:function(pageNo){
        var _this=this;
        _this.currAjaxFlag='all';
        var url=_this.sendMsgUrl,
            func=_this.getSmsRecordFunc,
            data={
                'sendusernumber':parent.gMain.loginName,
                'searchText':'',
                'sendflag':0,
                'currPage':pageNo
            },
            callback=allRecordCall;
        _this.Ajax(url,func,data, callback);

        function allRecordCall(data){
            var flag='all';
            if(flag==_this.currAjaxFlag){
                _this.showRecordList(data,'all');
            }
        }
    },
    /**
     * 显示定时记录
     */
    showTimeRecord:function(pageNo){
        var _this=this;
        _this.currAjaxFlag='time';
        var url=_this.sendMsgUrl,
            func=_this.getSmsRecordFunc,
            data={
                'sendusernumber':parent.gMain.loginName,
                'searchText':'',
                'sendflag':1,
                'currPage':pageNo
            },
            callback=timeRecordCall;
        _this.Ajax(url,func,data, callback);

        function timeRecordCall(data){
            var flag='time';
            if(flag==_this.currAjaxFlag){
                _this.showRecordList(data,'time');
            }
        }
    },
    /**
     * 显示记录列表
     */
    showRecordList:function(data,flag){
        if(data.code='S_OK'){
            var data=data["var"],
                list=data.list,
                currPage=data.currPage,
                totalPage=data.totalPage,
                pageSize=data.pageSize,
                totalRecords=data.totalRecords,
                totalAllRecord=data.allRecords,
                totalTimeRecord=data.fixedTimeRecords,
                searchText=data.searchText.decodeHTML().decodeHTML().replace(/([\.\?\*\+\\\/\^\$\(\)\[\]\{\}\|\'\"\<\>\=\!])/g,'\\$1')||'';
            jQuery('#allrecord span').html(totalAllRecord);
            jQuery('#timerecord span').html(totalTimeRecord);

            var listWrap=jQuery('#sms_record_list');
            if(list&&list.length>0){
                jQuery('#del_btn').show();
                jQuery('#topPage_sys2').show();
                listWrap.removeClass('empty-info');
                this.createPager(currPage,totalPage);
                var tableHtml='<table class="enclosure_table storage-table" style="width:100%">'
                             +'<thead>'
                             +'  <tr>'
                             +'    <th class="jnotice_border_r" style="width:28px;padding-left:0;"><input type="checkbox" id="checkBox_AllChecked"></th>'
                             +'    <th class="jnotice_border_r" style="width:200px;">'+smsLang.receiver+'</th>'
                             +'    <th>'+smsLang.sendMsg+'</th>'
                             +'    <th class="size" style="width:136px;border-right:medium none;">'+smsLang.sendTime+'</th>'
                             +'    <th class="time" style="width:90px">&nbsp;</th>'
                             +'  </tr>'
                             +'</thead>'
                             +'<tbody>';

                for(var i=0;i<list.length;i++){
                    if(!list[i].sendtime){
                        continue;
                    }
                    var sendStatus=list[i].sendstatus;
                    var statucClass='';
                    var statusTitle='';
                    switch(sendStatus){
                        case 0:
                            statucClass='sms-status-icon sms-succ-icon';
                            statusTitle=top.Lang.Mail.Write.fasongchenggong;//发送成功
                            break;
                        case 1:
                            statucClass='sms-status-icon sms-fail-icon';
                            statusTitle=top.Lang.Mail.Write.fasongshibai;//发送失败
                            break;
                        case 2:
                            statucClass='sms-status-icon sms-time-icon';
                            statusTitle=top.Lang.Mail.Write.dingshifasong;//定时发送
                            break;
                        case 3:
                            statucClass='sms-status-icon sms-sending-icon';
                            statusTitle=top.Lang.Mail.Write.fasongzhong;//发送中
                            break;
                    }

                    var sendmsgStr=list[i].sendmsg.decodeHTML().decodeHTML().length>40?list[i].sendmsg.decodeHTML().decodeHTML().substr(0,40)+'...':list[i].sendmsg.decodeHTML().decodeHTML();
                    var sendmsg=(searchText!='')?sendmsgStr.encodeHTML().replace(new RegExp('('+searchText.encodeHTML()+')','gi'),'<span style="padding-right: 2px; padding-left: 2px; background-color: gold;">$1</span>'):sendmsgStr.encodeHTML();
                    var receiverStr=list[i].receivername!=''?list[i].receivername:list[i].receivernumber;
                    var receiver=(searchText!='')?receiverStr.encodeHTML().replace(new RegExp('('+searchText.encodeHTML()+')','gi'),'<span style="padding-right: 2px; padding-left: 2px; background-color: gold;">$1</span>'):receiverStr.encodeHTML();

                    tableHtml+='<tr>'
                              +'<td style="width:28px;padding-left:4px;"><input class="fl"  type="checkbox" value="" dir="1" name="checkBox_mid" id="'+list[i].serialid+'"></td>'
                              +'<td><span title="'+statusTitle+'" class="'+statucClass+'"></span><a href="javascript:fGoto();" style="color:#000;" title="'+receiverStr+'<'+list[i].receivernumber+'>" onclick="smsRecord.editSMS('+list[i].serialid+','+list[i].sendflag+',\'mobile\');return false;">'+receiver+'</a></td>'
                              +'<td><a href="javascript:fGoto();" title="'+list[i].sendmsg.decodeHTML()+'" onclick="smsRecord.editSMS('+list[i].serialid+','+list[i].sendflag+',\'content\');return false;">'+sendmsg+'</a></td>'
                              +'<td style="width:136px">'+list[i].sendtime.replace(new Date().getFullYear()+'-','')+'</td>'
                              +'<td><a href="javascript:fGoto();" onclick="smsRecord.editSMS('+list[i].serialid+','+list[i].sendflag+');return false;">'+smsLang.editFunc+'</a>&nbsp;&nbsp;<a href="javascript:fGoto();" onclick="smsRecord.delRecord(['+list[i].serialid+'],['+totalPage+','+currPage+','+pageSize+','+totalRecords+']);return false;">'+smsLang.delLinkMan+'</a></td>'
                              +'</tr>';
                }
                tableHtml+='</tbody></table><input type="hidden" id="recordstatus" value="'+totalPage+','+currPage+','+pageSize+','+totalRecords+'" /> ';
                jQuery('#record_list').html(tableHtml);

                jQuery('#checkBox_AllChecked').die().live('click',function(){
                    var checkboxs=jQuery('#record_list table td input[type="checkbox"]');
                    if(jQuery(this).attr('checked')=='checked'){
                        checkboxs.attr('checked','checked');
                    }else{
                        checkboxs.removeAttr('checked');
                    }
                })
                this.initDelRecord();
            }else{
                jQuery('#del_btn').hide();
                jQuery('#topPage_sys2').hide();
                jQuery('#record_list').html('');
                listWrap.addClass('empty-info');
                var emptyrecord=jQuery('#empty_record');
                if(flag!=null&&flag=='search'){
                    emptyrecord.html('<p class="set_rule_box_tips">'+smsLang.recordNoFind+'</p>');
                }else if(flag=="all"){
                    emptyrecord.html('<p class="set_rule_box_tips">'+smsLang.noRecordTips+'，&nbsp;&nbsp;<a href="'+parent.gMain.webPath+'/se/sms/smsindex.do?sid='+parent.gMain.sid+'" class="fw_n"> '+smsLang.sendMsgBtnName+'&gt;&gt; </a></p>');
                }else{
                    emptyrecord.html('<p class="set_rule_box_tips">'+smsLang.noTimeRecordTips+'，&nbsp;&nbsp;<a href="'+parent.gMain.webPath+'/se/sms/smsindex.do?sid='+parent.gMain.sid+'" class="fw_n"> '+smsLang.sendMsgBtnName+'&gt;&gt; </a></p>');
                }
            }
        }else{
            parent.CC.alert(data.summary);
        }
    },
    /**
     * 生成页码
     */
    createPager:function(currPage,totalPage){
        var pager=jQuery('#topPage_sys2');
        if(totalPage>1){
            pager.show();
            var pageHtml='';
            if(currPage>1){
                pageHtml+='<a href="javascript:fGoto();" onclick="smsRecord.goPage(1);">'+smsLang.first+'</a> <span class="separate-line">|</span> ';
            }
            if(currPage>1){
                var display=(currPage==totalPage)?'none':'inline-block';
                pageHtml+='<a href="javascript:fGoto();" onclick="smsRecord.goPage('+(currPage-1)+');">'+smsLang.prev+'</a> <span class="separate-line" style="display:'+display+'">|</span> ';
            }

            if(currPage<totalPage){
                pageHtml+='<a href="javascript:fGoto();" onclick="smsRecord.goPage('+(currPage+1)+');">'+smsLang.next+'</a> <span class="separate-line">|</span> ';
            }

            if(currPage<totalPage){
                pageHtml+='<a href="javascript:fGoto();" onclick="smsRecord.goPage('+totalPage+');">'+smsLang.end+'</a> ';
            }
            pageHtml+='<select id="select_page_sys2" name="select_page_sys2"></select>';
            pager.html(pageHtml);

            var select=jQuery('#select_page_sys2');
            for(var i=1;i<=totalPage;i++){
                if(i==currPage){
                    select.append('<option value="'+i+'" selected="selected">'+i+'/'+totalPage+'</option>');
                }else{
                    select.append('<option value="'+i+'">'+i+'/'+totalPage+'</option>');
                }
            }
            select[0].onchange=function(){
                smsRecord.goPage(select[0].options[select[0].selectedIndex].value);
            }
        }else{
            pager.hide().html('');
        }
    },
    goPage:function(pageno){
        var _this=this;
        var currAjaxFlag=_this.currAjaxFlag;
        if(currAjaxFlag=='all'){
            _this.showAllRecord.call(_this,pageno);
        }else if(currAjaxFlag=='time'){
            _this.showTimeRecord.call(_this,pageno);
        }else if(currAjaxFlag=='search'){
            _this.goSearch.call(_this,pageno,_this.searchKey);
        }
    },
    /**
     * 删除短信记录
     */
    initDelRecord:function(){
        var _this=this;
        var delbtn=jQuery('#del_btn');
        var table=jQuery('#record_list table');
        delbtn.die().live('click',function(){
            if(table[0]){
                var checkboxs=table.find('td input[type="checkbox"]:checked');
                var checkboxLen=checkboxs.size();
                var ids=[];
                for(var i=0;i<checkboxLen;i++){
                    ids.push(checkboxs.eq(i).attr('id'));
                }
                var status=jQuery('#recordstatus').val().split(',');
                function confirmCall(){
                    _this.delRecord(ids,status);
                }

                if(checkboxLen>0){
                    parent.CC.confirm(_this.delRecordConfirmTips,confirmCall);
                }else{
                    parent.CC.alert(_this.delRecordNoSelectTips);
                }
            }
        })
    },
    delRecord:function(ids,status){
        var _this=this;
        var url=_this.sendMsgUrl,
            func=_this.delSmsRecordFunc,
            data={
                'sendusernumber':parent.gMain.loginName,
                'ids':ids
            },
            callback=delRecordCall;
        this.Ajax(url,func,data, callback);

        function delRecordCall(data){
            var totalpage=status[0],
                currpage=status[1],
                pagesize=status[2],
                totalRecords=status[3],
                delNum=ids.length;

            if(data.code='S_OK'){
                var rowsObj=jQuery('#record_list table tr');
                for(var i=0;i<rowsObj.length;i++){
                    var rowobj=rowsObj.eq(i);
                    var rowid=rowobj.find('td input[type="checkbox"]').eq(0).attr('id');
                    for(var j=0;j<ids.length;j++){
                        if(rowid==ids[j]){
                            rowobj.hide().remove();
                            break;
                        }
                    }
                }
                jQuery('#recordstatus').val(totalpage+','+currpage+','+pagesize+','+(totalRecords-delNum));

                var allcheck=jQuery('#checkBox_AllChecked');
                if(allcheck.attr('checked')=='checked'){
                    allcheck.removeAttr('checked');
                }
                parent.CC.showMsg(_this.delRecordSucc, true, false, "option");

                /*删除后重构记录列表*/
                var lastRowRecord=totalRecords-(totalpage-1)*pagesize;
                if(totalpage>1){
                    if(currpage<totalpage){
                        smsRecord.goPage(currpage);
                    }else{
                        if(delNum==lastRowRecord){
                            smsRecord.goPage(currpage-1);
                        }else{
                            smsRecord.goPage(currpage);
                        }
                    }
                }else{
                    smsRecord.goPage(currpage);
                }
            }else{
                parent.CC.alert(data.summary);
            }
        }
    },
    /**
     * 短信查找
     */
    searchRecord:function(){
        var _this=this;
        var searchInput=jQuery('#searchKey');
        var searchBtn=jQuery('#searchBtn');
        var val=searchInput.val();
        searchInput.focus(function(){
            var curr=jQuery(this);
            if(val==curr.val()){
                curr.val('');
            }
            curr.css('color','#000');
        });
        searchInput.blur(function(){
            var curr=jQuery(this);
            if(curr.val()==''){
                curr.val(val);
                curr.css('color','#cfcfcf');
            }

        });

        searchBtn.die().live('click',function(){
            queryrecord();
        });

        jQuery('body').keyup(function(event){
            if(event.keyCode=='13'){
                queryrecord();
                event.returnValue = false;
            }
        });

        function queryrecord(){
            jQuery('#sms_record').removeClass('show-setting');
            if(jQuery.trim(searchInput.val())!=val){
                _this.searchKey=jQuery.trim(searchInput.val());
                _this.goSearch(1,jQuery.trim(searchInput.val()));
            }else{
                parent.CC.alert(_this.queryRecordEmpty);
            }
        }
    },
    goSearch:function(pageno,key){
        var _this=this;
        _this.currAjaxFlag='search';
        var url=_this.sendMsgUrl,
            func=_this.getSmsRecordFunc,
            data={
                'sendusernumber':parent.gMain.loginName,
                'searchText':key.encodeHTML(),
                'sendflag':0,
                'currPage':pageno
            },
            callback=searchRecordCall;
         _this.Ajax(url,func,data, callback);

         function searchRecordCall(data){
             var flag='search';
             if(flag==_this.currAjaxFlag){
                _this.showRecordList(data,'search');
             }
         }
    },
    /**
     * 显示记录设置
     */
    showRecordSet:function(){
        var _this=this;
        _this.recoreSetLoad=false;
        var url=_this.sendMsgUrl,
            func=_this.getSmsConfigFunc,
            data={'sendusernumber':parent.gMain.loginName},
            callback=initSet;
        _this.Ajax(url,func,data, callback);

        function initSet(data){
            if(data.code='S_OK'){
                var pagesize=data["var"].pagesize;
                var autosave=data["var"].autosave;
                var radioIndex={
                    '10':0,
                    '20':1,
                    '50':2,
                    '100':3
                };
                var autoSaveIndex={
                    '0':1,
                    '1':0
                };
                _this.recordnumRadio.removeAttr('checked').eq(radioIndex[pagesize]).attr('checked','checked');
                _this.autosaveRadio.removeAttr('checked').eq(autoSaveIndex[autosave]).attr('checked','checked');
                _this.recoreSetLoad=true;
            }else{
                parent.CC.alert(data.summary);
            }
        }
    },
    /**
     * 初始化短信记录设置
     */
    initRecordSet:function(){
        var _this=this;
       _this.recordnumRadio.die().live('click',function(){
            var curr=jQuery(this);
            if(curr.attr('checked')=='checked'){
                _this.recordnumRadio.removeAttr('checked');
                curr.attr('checked','checked');
            }
        });

        _this.autosaveRadio.die().live('click',function(){
            var curr=jQuery(this);
            if(curr.attr('checked')=='checked'){
                _this.autosaveRadio.removeAttr('checked');
                curr.attr('checked','checked');
            }
        });

        jQuery('#saveBtn').die().live('click',function(){
            if(_this.recoreSetLoad){
                _this.saveRecordSet();
            }
        });

        jQuery('#cancelBtn').die().live('click',function(){
            jQuery('#sms_record').removeClass('show-setting');
        });
    },
    /**
     * 保存短信记录设置
     */
    saveRecordSet:function(){
        var _this=this;
        var url=_this.sendMsgUrl,
            func=_this.updateSmsConfigFunc,
            data={
                'sendusernumber':parent.gMain.loginName,
                'pagesize':jQuery('input[name="recordnum"][checked]').val(),
                'autosave':jQuery('input[name="isautosave"][checked]').val()
            },
            callback=saveCallBack;
        _this.Ajax(url,func,data, callback);

        function saveCallBack(data){
            if(data.code='S_OK'){
                parent.CC.alert(_this.saveSuccTips);
            }else{
                parent.CC.alert(data.summary);
            }
        }
    },
    /**
     * 编辑短信内容
     */
    editSMS:function(smsid,sendflag,editflag){
        var editflag=editflag||'';
        window.location.href=parent.gMain.webPath + "/se/sms/smsindex.do?sid="+parent.gMain.sid+'&smsid='+smsid+'&editflag='+editflag+'&sendflag='+sendflag;
    },
    Ajax: function(url,func,data, callback,failcallback){
        failcallback = failcallback || function(d){
            parent.CC.alert(d.summary);
        };
        parent.MM.doService({
            url:url,
            func: func,
            data: data,
            failCall: failcallback,
            call: function(d){
                callback(d)
            },
            param: ""
        });
    },
    setSiderHeight:function(){
        var _this=this;
        var iframeH=jQuery('#ifrm_outLink_sms',window.parent.document).outerHeight();
        var smstabH=jQuery('#set_head').outerHeight();
        jQuery('#adjManage .sm-sidewrap').css('height',(iframeH-smstabH-90)+'px');
    },
    Init: function(reflag){
        this.initNav(reflag);
        this.searchRecord();
        this.initRecordSet();
        this.setSiderHeight();
        //重写关闭标签
        var labId=parent.CC.getCurLabId();
        top.document.getElementById('tab_h_'+labId).getElementsByTagName('a')[0].onclick=function(){
            parent.GE.tab.del(labId);
        }
    }
}


