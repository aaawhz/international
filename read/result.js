//操作相关 如 校验 提交 等
var task = {
    canSubmit: false,
    currentBusinessId: '',
    attachmentList: [],
    enableDateFilter: false,
    imageIndex:0,
    contactDialogId:'',

    chinaMobileRe:/^((\\+86)|(86))?((13[4-9])|(15[0-2 7-9])|(18[2-4 7-8])|(147))+\d{8}$/g,

    TASK_TYPE: 1,
    uploadingAttachmentNumber: 0,
    STATE: {
        SEND: 1,
        READER_READ: 2,
        READER_CONFIRM: 3,
        SENDER_READ_AFTER_READER_READ: 4,
        SENDER_READ_AFTER_CONFIRM: 5,// 发起人在审阅人确认之后再次查看
        FINISH: 6,
        READER_EDIT: 7

    },
    NODE_ID: {
        AFTER_SUBMIT: 1,
        AFTER_CONFIRM: 2,
        FINISH: 3
    },

    getHandlers:function(callback){
        data = {
        };
        var config = {
            func: "workflow:getSendUserList",
            data: data,
            call: function (response) {
                callback(response['var'])
            },
            failCall: task.failCallback,
            params: {
            },
            isNotAddUrl: true,
            url: '../../workflow.do',
            msg: top.Lang.Mail.Write.zhengzaifasong
        };//正在发送
        parent.MM.doService(config);
    },

    changeNewTipNum:function(type){
        var numtype = type || 1;
        var data = {
            
            "taskState": 4,
            
            "messageType": numtype  //类型：1是我的发起，2是我的审批
        
        }
        var dataComplete = {
            "taskState": 4,
            
            "messageType": numtype  //类型：1是我的发起，2是我的审批
        };
        var taskParams = type == 1 ? 4: 2;
        var taskParamsComplete = type == 1 ? 3 : 2;

        data.taskState = taskParams ; //我的发起才需要传这个taskState,  我的审批的这个值是随便写的
        dataComplete.taskState = taskParamsComplete;
        
        jQuery.ajax({
            type: 'POST',
            dateType: 'JSON',
            url : '/webmail/workflow.do?func=workflow:readBizMsg&sid='+top.gMain.sid,
            data: JSON.stringify(data),
            sucess: function(){},
            error: function(){}
        });

        parent.MM.doService({

            func: "workflow:readBizMsg",
            data: data,
            type: 'JSON',
            call: function (response) {
        
                 top.LM.getOATip();
    
            },
            failCall: function(){},
       
            url: '../../workflow.do'
            
        });

         parent.MM.doService({

            func: "workflow:readBizMsg",
            data: dataComplete,
            type: 'JSON',
            call: function (response) {
        
                 top.LM.getOATip();
    
            },
            failCall: function(){},
       
            url: '../../workflow.do'
            
        })

    },

    //弹出通讯录的框
    createContactDialog: function (sucessFn) {

        if(!top.handlerList){
            task.getHandlers(function(list){
                top.handlerList=list
                init()
            })
        }else{
            init()
        }

        function init(){
            var callback=function(arr){
                sucessFn(arr)

                //top['task_contact_'+index]=null
                //task.contact=null
            }
            var cancelback=function(){
                //console.log(arguments)
                //top['task_contact_'+index]=null
                //task.contact=null
            }
            var s = []
            if (top.GC.check("CONTACTS_ENT")) {
                s.push("0")
            }
            if (top.GC.check("CONTACTS_PER")) {
                s.push("2")
            }
            //if(!task.contactDialogId){
            //    task.contactDialogId=new Date().getTime()
            //}
            //var index=task.contactDialogId

            top.task_contact = new top.Contact("top.task_contact",{maxCount:1,showList:top.handlerList});
            //top['task_contact_'+index]=task.contact
            top.task_contact.groupMap = top.LMD.groupMap;
            //top.task_contact.addAsGroup = true;
            top.task_contact.group_contactListMap = top.LMD.group_contactListMap_mail;
            top.task_contact.inItContanct("publicPerson_ContactDialog", s, callback, cancelback);
        }

    },
    initPlaceholder:function(){
        jQuery('[placeholder]').each(function(){
            var str=jQuery(this).attr('placeholder')
            jQuery(this).on('blur',function(){
                if(/^\s*$/g.test(jQuery(this).val())){
                    jQuery(this).val(str)
                    jQuery(this).css('color','#bfbfbf')
                }
            })
            jQuery(this).on('focus',function(){
                if(jQuery(this).val()==str){
                    jQuery(this).val('')
                    jQuery(this).css('color','black')
                }
            })
            //if()
            jQuery(this).removeAttr('placeholder')
            jQuery(this).val(str)
            jQuery(this).css('color','#bfbfbf')
        })

    },

    //审批列表页面
    initListHome:function(){
        function initListPage(vm){
            var search_status = new DropSelect({
                id:vm.$id+"_search_status",
                data:vm.$aSearchStatus,
                type:"", //邮件夹下拉框: fileTree,普通下拉框: "":
                selectedValue:"0",
                width:98,
                height:130,
                itemClick:function(){
                    vm.search_status=search_status.getValue();
                    vm.search();
                }
            });
            jQuery('#'+vm.$id).find('.search_status').eq(0).html(search_status.getHTML());
            search_status.loadEvent();
            // task.initPlaceholder();

        }

        //先改变我的发起的数量
        task.changeNewTipNum(1);



        var roles=[];
        for(var i=0;i<top.gMain.taskRoles.length;i++){
            roles.push(top.gMain.taskRoles[i]);
        }
        var pageVm=avalon.define({
            $id:'page',
            roles:roles,
            currentModule:'',
            toggleTab:function(index){
                switch (index){
                    case 0:
                        pageVm.currentModule='mySend'
                        if(sendVm.$firstLoad){
                            sendVm.$renderList()
                        }
                        break;
                    case 1:
                        pageVm.currentModule='myHandle'
                        if(handleVm.$firstLoad){
                            handleVm.$renderList()
                             //先改变我的审批的 数量  
                             task.changeNewTipNum(2);
                        }
                        break;
                    case 2:
                        pageVm.currentModule='myCheck'
                        if(checkVm.$firstLoad){
                            checkVm.$renderList()
                        }
                        break;
                }
            }
        })
        //if(pageVm.roles[0]){
            var sendVm = avalon.define({
                $id: "mySend",
                id: "mySend",
                search_status:0,
                search_placeholder:top.Lang.Mail.Write.qsrsxmcsscBRPJ,//请输入事项名称搜索
                $firstLoad:true,
                showCreatePanel:false,
                searchKey:'',
                total: 0,
                processing:0,
                undototal: 0,
                completed:0,
                reject:0,
                listItems: [],
                initList:function(){
                    initListPage(sendVm)
                },
                $aSearchStatus:[{text:top.Lang.Mail.Write.quanbushixiang,value:0},{text:top.Lang.Mail.Write.weishenpi,value:1},{text:top.Lang.Mail.Write.wanchengshenpi,value:3},{text:top.Lang.Mail.Write.shenpizhong,value:2},{text:top.Lang.Mail.Write.beibohui,value:4}],//全部事项  ||  未审批  ||  完成审批  ||  审批中  ||  被驳回
                search:function(){
                    sendVm.$renderList()
                },
                preSearch:function(event){
                    if(event.keyCode==13){
                        sendVm.search()
                    }
                },
                createTask:function(){
                    top.CC.goOutLink( '../../workflow/createhome.do?sid='+ top.gMain.sid, 'createhome', top.Lang.Mail.Write.xinjianshenpi);//新建审批
                },
                $renderList:function(start){
                    var data={}
                    var start=start||0
                    var data={
                        key:sendVm.searchKey==sendVm.search_placeholder?'':jQuery.trim(sendVm.searchKey),
                        taskFlags:sendVm.search_status
                    }

                    data.fnName='workflow:getSendWorkFlowList'
                    task.getTasks(data, start,function(data){
                        sendVm.$firstLoad=false
                        sendVm.total=data.totals
                        sendVm.reject=data.reject
                        sendVm.undototal=data.untreated
                        sendVm.completed=data.completed
                        sendVm.processing=data.processing
                        sendVm.listItems.clear()
                        sendVm.listItems.pushArray(data.list)
                        var page = new Page({
                            count: Math.ceil(sendVm.total/20),
                            index:start/20,
                            node: jQuery('#'+sendVm.$id).find('.pager')[0],
                            onChange: function (index) {
                                sendVm.$renderList(index*20)
                            }
                        })
                    });
                },
                goToTaskDetials:function($event,el){
                    //task.goToTaskDetials(el.businessId)
                    task.goToTaskDetials(el.taskType,el.businessId,el.taskId,'sender')
                    $event.preventDefault()
                }
            })

        //}
        //if(pageVm.roles[1]){
            var handleVm = avalon.define({
                $id: "myHandle",
                id: "myHandle",
                search_status:0,
                search_placeholder:top.Lang.Mail.Write.qsrsxHQqwvfqrss,//请输入事项名称或发起人搜索
                $firstLoad:true,
                searchKey:'',
                total: 0,
                processing: 0,
                listItems: [{}],
                initList:function(){
                    initListPage(handleVm)
                },
                //search_status:0,
                $aSearchStatus:[{text:top.Lang.Mail.Write.quanbushixiang,value:0},{text:top.Lang.Mail.Write.weishenpi,value:1},{text:top.Lang.Mail.Write.wanchengshenpi,value:3},{text:top.Lang.Mail.Write.bohui,value:4},{text:top.Lang.Mail.Write.shenpizhong,value:2}],//全部事项  ||  未审批  ||  完成审批  ||  驳回  ||  审批中
                search:function(){
                    handleVm.$renderList()
                },
                preSearch:function(event){
                    if(event.keyCode==13){
                        handleVm.search()
                    }
                },
                $renderList:function(start){
                    var data={}
                    var start=start||0
                    var data={
                        key:handleVm.searchKey==handleVm.search_placeholder?'':jQuery.trim(handleVm.searchKey),
                        taskFlags:handleVm.search_status
                    }
                    data.fnName='workflow:getCheckWorkFlowList'
                    task.getTasks(data,start,function(data){
                        handleVm.$firstLoad=false
                        handleVm.total=data.totals
                        handleVm.processing=data.totals-data.checked
                        handleVm.listItems.clear()
                        handleVm.listItems.pushArray(data.list)
                        var page = new Page({
                            count: Math.ceil(handleVm.total/20),
                            index:start/20,
                            node: jQuery('#'+handleVm.$id).find('.pager')[0],
                            onChange: function (index) {
                                handleVm.$renderList(index*20)
                            }
                        })
                    });
                },
                goToTaskDetials:function($event,el){
                    //task.goToTaskDetials(el.businessId)
                    task.goToTaskDetials(el.taskType,el.businessId,el.taskId,'handler')
                    $event.preventDefault()
                }
            })

        //}

        //if(pageVm.roles[2]){
            var checkVm = avalon.define({
                $id: "myCheck",
                id: "myCheck",
                search_status:0,
                search_placeholder:top.Lang.Mail.Write.qsrsxOnydyfqrss,//请输入事项名称或发起人搜索
                $firstLoad:true,
                searchKey:'',
                total: 0,
                readed:0,
                listItems: [{}],
                $aSearchStatus:[{text:top.Lang.Mail.Write.quanbushixiang,value:0},{text:top.Lang.Mail.Write.weichayue,value:1},{text:top.Lang.Mail.Write.yichayue,value:2}],//全部事项  ||  未查阅  ||  已查阅
                search:function(){
                    checkVm.$renderList()
                },
                preSearch:function(event){
                    if(event.keyCode==13){
                        checkVm.search()
                    }
                },
                initList:function(){
                    initListPage(checkVm)
                },
                $renderList:function(start){
                    var data={}
                    var start=start||0
                    var data={
                        key:checkVm.searchKey==checkVm.search_placeholder?'':jQuery.trim(checkVm.searchKey),
                        taskFlags:checkVm.search_status
                    }

                    data.fnName='workflow:getCheckWorkFlowList'
                    task.getTasks(data,start,function(data){
                        checkVm.$firstLoad=false
                        checkVm.total=data.totals
                        checkVm.readed=data.readed
                        checkVm.listItems.clear()
                        checkVm.listItems.pushArray(data.list)
                        var page = new Page({
                            count: Math.ceil(checkVm.total/20),
                            index:start/20,
                            node: jQuery('#'+checkVm.$id).find('.pager')[0],
                            onChange: function (index) {
                                checkVm.$renderList(index*20)
                            }
                        })
                    });
                },
                goToTaskDetials:function($event,el){
                    //task.goToTaskDetials(el.businessId)
                    task.goToTaskDetials(el.taskType,el.businessId,el.taskId,'checker')
                    $event.preventDefault()
                }
            })
        //}

        avalon.scan()
        //初始化显示的列表
        function initList(){
            if(pageVm.roles[0]){
                pageVm.toggleTab(0)
            }else if(pageVm.roles[1]){
                pageVm.toggleTab(1)
            }else if(pageVm.roles[0]){
                pageVm.toggleTab(2)
            }
        }
        initList()
    },

    //请求审批人顺序
    getCheckPersonList:function(taskId,tplId,frameId){
        var frameId = "ifrm_outLink_" + frameId;
        data = {
            "taskId":taskId,
            "templateId":tplId
        };
        var config = {
            func: "workflow:getCheckPersonList",
            data: data,
            call: function (response) {                
                $("#"+frameId,parent.document).contents().find('.oaflow_name').find('.col999').find('span').html(response['var']);

            },
            failCall: function(){
                task.failCallback();
                return "";
            },
            params: {
            },
            isNotAddUrl: true,
            url: '../../workflow.do',
            msg: top.Lang.Mail.Write.zhengzaifasong
        };//正在发送
        parent.MM.doService(config); 
        // task.getInfoByDecodeHTML(config);       
    },

    //通用审批
    initCreateGeneral:function(){
        jQuery(function(){
            // task.initPlaceholder()
        })
        // jQuery('#addHandlePerson').click(function(){
        //     task.createContactDialog(function(arr){
        //         //console.log(arr)
        //         var person=arr[0]
        //         vm.examineUserId=person.id
        //         vm.examineUserName=person.name||person.id.split('@')[0]
        //     })
        // })
        function validateForm(){
            this.canSubmit = true;

            if(!vm.subject){
                task.validateAlert(top.Lang.Mail.Write.qsrsphDopqlxhzt)//请输入审批事项类型或主题
                return false
            }
            if(!vm.title){
                task.validateAlert(top.Lang.Mail.Write.qsrspbtccQJS)//请输入审批标题
                return false
            }
            if(!vm.content){
                task.validateAlert(top.Lang.Mail.Write.qsrspsxsmrKKLc)//请输入审批事项说明
                return false
            }
            if (task.uploader.getStats().progressNum != 0) {
                this.canSubmit = false
                parent.CC.showMsg(top.Lang.Mail.Write.hywjzzsctFlhP, true, false, 'error')//还有文件正在上传
                return false
            }
            return true
        }

        //填充审批人顺序-start
        var taskId = parseInt(parent.GC.getUrlParamValue(window.location.href, "taskId"));
        var tplId = parseInt(parent.GC.getUrlParamValue(window.location.href, "templateId"));
        var frameId = parent.GC.getUrlParamValue(window.location.href, "frameId");
        task.getCheckPersonList(taskId,tplId,frameId);
        //填充审批人顺序-end

        var vm=avalon.define({
            $id:'task',
            subject:top.Lang.Mail.Write.tongyongshenpi,//通用审批
            bizDesc:top.Lang.Mail.Write.yytyspGUIcb,//用于通用审批
            content:'', 
            title:'',                       

            cancel:function(){
                if (confirm(top.Lang.Mail.Write.gbbjySSmLjsfygb)) {//关闭编辑页，内容将丢失，是否要关闭？
                    parent.CC.exit();
                }
            },
            submit:function(){
                if(!validateForm()){
                    return
                }
                data = {
                    "attrs":vm.title,   //H5上的是title，这里还没有title，先这样传
                    "taskId":taskId,
                    "templateId":tplId,
                    "bizSubject": vm.subject,
                    "contentJson":{
                        "content": vm.content,
                        "title": vm.title                     
                    },                    
                    "attachmentList": task.attachmentList
                };
                var config = {
                    func: "workflow:createWorkFlow",
                    data: data,
                    call: function (response) {
                        // var jsonVar=$.parseJSON(response['var'])
                        var jsonVar=eval("("+response['var']+")")
                        
                        var businessId=jsonVar['businessId']
                        var type=jsonVar['taskType']

                        location.replace(location.protocol + "//" + location.host + parent.gMain.webPath+'/workflow/createok.do?sid='+parent.gMain.sid+'&type='+type+'&taskId='+taskId+'&businessId='+businessId+'&role=sender')
                        
                    },
                    failCall: task.failCallback,
                    params: {
                    },
                    isNotAddUrl: true, //判断是否需要在URL前加webmail
                    url: '../../workflow.do',
                    msg: top.Lang.Mail.Write.zhengzaifasong
                };//正在发送
                // parent.MM.doService(config);
                task.getInfoByDecodeHTML(config);
            }
        })
        avalon.scan()
        avalon.duplexHooks.limit={
            get:function(str,data){
                var limit=parseFloat(data.element.getAttribute('data-duplex-limit'))
                if(str.length>limit){
                    return data.element.value=str.slice(0,limit)
                }
                return str
            }
        }

    },
    initGetGeneral:function(id,role,taskId){
        var id=id||task.util.getQueryString('businessId')
        var role=role||task.util.getQueryString('role')
        var taskId=taskId||task.util.getQueryString('taskId')
        // task.initPlaceholder()

        // jQuery('#addHandlePerson').click(function(){
        //     task.createContactDialog(function(arr){
        //         var person=arr[0]
        //         vm.examineUserId=person.id
        //         vm.examineUserName=person.name||person.id.split('@')[0]
        //     })
        // })

        var vm=avalon.define({
            $id:'task',
            role:role,
            businessId:id,
            taskId:taskId,
            createDate:'',
            examineList:'',
            examineUserId:top.gMain.loginName,  //邮箱地址名字
            examineUserName:top.gMain.trueName,  //
            taskState:0,
            nodeId:'',
            suggestion:'',
            checkPower:false,
            attachmentList:'',
            senderUserName:'',
            content:'',
            title:'',

            approve:function(index){task.approve(vm,index)}, //index: 1通过  2驳回

            // reject:function(){task.reject(vm)},
            deleteTask:function(){
                task.deleteTask(vm)
            },
            cancel:function(){
                parent.CC.exit()
            },
            submit:function(){

            }
        })
        avalon.scan()

        var data = {
            // "taskId":2,
            businessId:parseInt(id)
        };
        if(role=='checker'){
            data.isRead=1
        }
        var config = {
            func: "workflow:getWorkFlow",
            data: data,
            call: function (resp) {
                var jsonVar = resp['var']
                var taskResp = jsonVar['webTaskBusinessModel']
                // var taskInfo = $.parseJSON(taskResp['taskInfo'])
                var taskInfo = eval("("+taskResp['taskInfo']+")")
                var contentJson = taskInfo['contentJson']
                var examineList = jsonVar['examineList']

                vm.examineList=examineList
                vm.taskState=taskResp.taskState
                vm.createDate=jsonVar.createDate
                vm.checkPower=jsonVar.checkPower

                vm.content=contentJson.content
                vm.title=contentJson.title


                //显示附件
                task.attachmentList = taskInfo["attachmentList"]
                var attachmentList = taskInfo["attachmentList"]
                var attachmentListStr = ''
                jQuery.each(attachmentList, function (i, attachment) {
                    attachmentStr = '<li class="attachment" id="' + attachment.id + '.' + attachment.extension + '">' + attachment.name.encodeHTML() + task.getPreviewLink(attachment) + '<a href="service/user.do?func=upload:getAttachment&flag=0&fileName=' + attachment.id + '.' + attachment.extension + '&sid=' + parent.gMain.sid + '&trueName=' + attachment.name.encodeHTML() + '" class="ml_5" >'+top.Lang.Mail.Write.xiazai+'</a></li>'
                    attachmentListStr += attachmentStr;//" class="ml_5" >下载</a></li>
                })
                jQuery('#attachmentList').html(attachmentListStr)
                vm.attachmentList=task.attachmentList

                var list='',
                    listStr='',
                    colorStr='',
                    tipStr='',
                    nameIng=''
                jQuery.each(examineList, function(i, el) {
                    switch(el.examineResult){
                        case 0: //正在审批
                            colorStr="#00b615"
                            tipStr=top.Lang.Mail.Write.zhengzaishenpi
                            nameIng=el.examineUser//正在审批
                            break
                        case 2: //驳回
                            colorStr="red"
                            tipStr=top.Lang.Mail.Write.bohui
                            break//驳回
                        default:
                            colorStr=''
                            tipStr=top.Lang.Mail.Write.tongguo
                    }//通过
                    list = '<tr><td>' + el.nodeName + '</td><td>' + el.examineUser.encodeHTML() + '</td><td title="'+ tipStr +'" style="color:'+colorStr+'">' + tipStr + '</td><td title="'+ el.examineOpinion.encodeHTML() +'" style="color:'+colorStr+'">' + (el.examineOpinion.encodeHTML()==""?'--':el.examineOpinion.encodeHTML()) + '</td><td>' + (el.examineDate==null?'--':el.examineDate) + '</td></tr>'
                    // if(el.examineOpinion!=''){
                    //     list2 = '<tr><td></td><td></td><td title="'+ el.examineOpinion.encodeHTML() +'" style="color:'+colorStr+'">' + el.examineOpinion.encodeHTML() + '</td><td></td></tr>'
                    //     list +=list2
                    // } 
                    
                    listStr += list
                    if(el.examineResult==0){
                        vm.nodeId = el.nodeId;
                    }
                })
                jQuery('#pList').html(listStr);

                vm.senderUserName = jsonVar.senderUserName;

               //显示审批人顺序
                var nameAarry = (jsonVar.examineOrder).split('>>');
                nameAarry = task.encodeHTMLArray(nameAarry);
                var newStr ='';
                for (var i = 0; i < nameAarry.length; i++) {
                    if(nameAarry[i].decodeHTML()==nameIng){
                        nameAarry[i]="<b style=\"color:black;\">"+nameAarry[i]+"</b>";
                    }
                    if(i!==nameAarry.length-1){
                        newStr+=nameAarry[i]+'&gt;&gt;';
                    }else{
                        newStr+=nameAarry[i];
                    }
                }
                jQuery('.oaflow_name').find('.col999').find('span').html(newStr);
            },
            failCall: task.failCallback,
            params: {
            },
            isNotAddUrl: true,
            url: '../../workflow.do',
            msg: top.Lang.Mail.Write.zhengzaifasong
        };//正在发送
        task.getInfoByDecodeHTML(config);

    },
    //请假审批
    initCreateAskForLeave:function(){
        //初始化选择审批人模块
        // jQuery('#addHandlePerson').click(function(){
        //     task.createContactDialog(function(arr){
        //         var person=arr[0]
        //         vm.examineUserId=person.id
        //         vm.examineUserName=person.name||person.id.split('@')[0]
        //     })
        // })
        jQuery(function(){
            // task.initPlaceholder()
        })
        new CCalendar($("#date_start"), {
            onSelectBack: function (data) {
                vm.date_start=data.back
                return true;
            }
        });
        new CCalendar($("#date_start_i"), {
            onSelectBack: function (data) {
                vm.date_start=data.back
                jQuery("#ifrm_outLink_createaskforleave",parent.document).contents().find("#date_start").val(data.back)
                return true;
            }
        });
        new CCalendar($("#date_end"), {
            onSelectBack: function (data) {
                vm.date_end=data.back
                return true;
            }
        });
        new CCalendar($("#date_end_i"), {
            onSelectBack: function (data) {
                vm.date_end=data.back
                jQuery("#ifrm_outLink_createaskforleave",parent.document).contents().find("#date_end").val(data.back)
                return true;
            }
        });        

        function validateForm(){
            this.canSubmit = true;

            if(!vm.subject){
                task.validateAlert(top.Lang.Mail.Write.qsrspttDaBlxhzt)//请输入审批事项类型或主题
                return false
            }
            if(!vm.content){
                task.validateAlert(top.Lang.Mail.Write.qsrspnrsmpYafG)//请输入审批内容说明
                return false
            }
            if(!vm.holidayType){
                task.validateAlert(top.Lang.Mail.Write.qxzqjlxeSnnj)//请选择请假类型
                return false
            }
            if(!/^\d+(\.\d+)?$/g.test(vm.dayNum)){
                task.validateAlert(top.Lang.Mail.Write.qsrzqdqjtsIhibi)//请输入正确的请假天数
                return false
            }            
            if(!(vm.date_start&&vm.date_end&&vm.hour_start&&vm.hour_end)){
                task.validateAlert(top.Lang.Mail.Write.qxzqjsjAPnUb)//请选择请假时间
                return false
            }
            if(vm.date_start+vm.hour_start>vm.date_end+vm.hour_end){
                task.validateAlert(top.Lang.Mail.Write.kssjbLjzUdyjssj)//开始时间不能大于结束时间
                return false
            }
            if (task.uploader.getStats().progressNum != 0) {
                this.canSubmit = false
                parent.CC.showMsg(top.Lang.Mail.Write.hywjzzscAROcX, true, false, 'error')//还有文件正在上传
                return false
            }

            return true

        }

        //填充审批人顺序-start
        var taskId = parseInt(parent.GC.getUrlParamValue(window.location.href, "taskId"));
        var tplId = parseInt(parent.GC.getUrlParamValue(window.location.href, "templateId"));
        var frameId = parent.GC.getUrlParamValue(window.location.href, "frameId");
        task.getCheckPersonList(taskId,tplId,frameId);
        //填充审批人顺序-end
        var vm=avalon.define({
            $id:'task',
            subject:top.Lang.Mail.Write.qingjiashenpi,//请假审批
            bizDesc:top.Lang.Mail.Write.yyqjspWjQmI,//用于请假审批
            content:'',
            // mobilePhone:'',
            // examineUserId:'',
            // examineUserName:'',
            date_start:'',
            date_end:'',
            hour_start:'',
            hour_end:'',
            dayNum:'',
            hourNum:'',
            holidayType:'',
            // emailNotify:false,
            // smsNotify:false,
            cancel:function(){
                if (confirm(top.Lang.Mail.Write.gbbjyxtsHBsfygb)) {//关闭编辑页，内容将丢失，是否要关闭？
                    parent.CC.exit();
                }
            },
            submit:function(){
                if(!validateForm()){
                    return
                }
                var data_start_temp = vm.date_start;   //1790-01-01
                var data_end_temp = vm.date_end;       //1790-01-01
                data_start_temp = data_start_temp.substr(5);          //01-01
                data_end_temp = data_end_temp.substr(5);        //01-01
                data = {
                    "taskId":taskId,
                    "templateId":tplId,
                    "bizSubject": vm.subject,
                    "attrs": vm.dayNum + top.Lang.Mail.Write.tian + data_start_temp + top.Lang.Mail.Write.zhi + data_end_temp + ")",//天(  ||  至
                    "bizDesc": vm.bizDesc,
                    "attachmentList": task.attachmentList,
                    "contentJson":{
                        "content": vm.content,
                        "holidayType": vm.holidayType+'',
                        "beginDate": vm.date_start,
                        "beginTime": vm.hour_start,
                        "endDate": vm.date_end,
                        "endTime": vm.hour_end,
                        "dayNum": vm.dayNum,
                        "hourNum": vm.hourNum                        
                    }                    
                };
                var config = {
                    func: "workflow:createWorkFlow",
                    data: data,
                    call: function (response) {
                        // var jsonVar=$.parseJSON(response['var'])
                        var jsonVar=eval("("+response['var']+")")
                        var businessId=jsonVar['businessId']
                        var type=jsonVar['taskType']

                        location.replace(location.protocol + "//" + location.host + parent.gMain.webPath+'/workflow/createok.do?sid='+parent.gMain.sid+'&type='+type+'&taskId='+taskId+'&businessId='+businessId+'&role=sender')                        
                    },
                    failCall: task.failCallback,
                    params: {
                    },
                    isNotAddUrl: true,
                    url: '../../workflow.do',
                    msg: top.Lang.Mail.Write.zhengzaifasong
                };//正在发送
                // parent.MM.doService(config);
                task.getInfoByDecodeHTML(config);              
            }
        })
        avalon.scan()
        avalon.duplexHooks.limit={
            get:function(str,data){
                var limit=parseFloat(data.element.getAttribute('data-duplex-limit'))
                if(str.length>limit){
                    return data.element.value=str.slice(0,limit)
                }
                return str
            }
        }
    },
    initGetAskForLeave:function(id,role,taskId){
        var id=id||task.util.getQueryString('businessId')
        var role=role||task.util.getQueryString('role')
        var taskId=taskId||task.util.getQueryString('taskId')        

        // task.initPlaceholder()
        // jQuery('#addHandlePerson').click(function(){
        //     task.createContactDialog(function(arr){
        //         var person=arr[0]
        //         vm.examineUserId=person.id
        //         vm.examineUserName=person.name||person.id.split('@')[0]
        //     })
        // })

        function validateForm(){
            this.canSubmit = true;
            return true

        }

        var vm=avalon.define({
            $id:'task',
            role:role,
            businessId:id,
            taskId:taskId,
            createDate:'',
            examineList:'',
            examineUserId:top.gMain.loginName,  //邮箱地址名字
            examineUserName:top.gMain.trueName,  //
            taskState:0,
            nodeId:'',
            suggestion:'',
            checkPower:false,
            attachmentList:'',
            senderUserName:'',
            content:'',
            holidayType:'',
            date_start:'',
            date_end:'',
            hour_start:'',
            hour_end:'',
            dayNum:'',
            hourNum:'',

            approve:function(index){task.approve(vm,index)}, //index: 1通过  2驳回
            reject:function(){task.reject(vm)},
            deleteTask:function(){
                task.deleteTask(vm)
            },
            cancel:function(){
                parent.CC.exit()
            },
            submit:function(){

            }
        })
        avalon.scan()

        data = {
            // "taskId":3,
            businessId:id
        };
        if(role=='checker'){
            data.isRead=1
        }
        var config = {
            func: "workflow:getWorkFlow",
            data: data,
            call: function (resp) {
                var jsonVar = resp['var']
                var taskResp = jsonVar['webTaskBusinessModel']
                // var taskInfo = jQuery.parseJSON(taskResp['taskInfo'])
                var taskInfo = eval("("+taskResp['taskInfo']+")")
                var contentJson = taskInfo['contentJson']
                var examineList = jsonVar['examineList']
                var holidayNum = {
                    '1':top.Lang.Mail.Write.shijia,//事假
                    '2':top.Lang.Mail.Write.nianjia,//年假
                    '3':top.Lang.Mail.Write.burujia,//哺乳假
                    '4':top.Lang.Mail.Write.hulijia,//护理假
                    '5':top.Lang.Mail.Write.bingjia,//病假
                    '6':top.Lang.Mail.Write.gongjia,//公假
                    '7':top.Lang.Mail.Write.hunjia,//婚假
                    '8':top.Lang.Mail.Write.chanqianjia,//产前假
                    '9':top.Lang.Mail.Write.chanjia,//产假
                    '10':top.Lang.Mail.Write.qita
                }//其他
                vm.examineList=examineList
                vm.taskState=taskResp.taskState
                vm.createDate=jsonVar.createDate
                vm.checkPower=jsonVar.checkPower

                vm.content=contentJson.content
                vm.date_start=contentJson.beginDate
                vm.date_end=contentJson.endDate
                vm.hour_start=contentJson.beginTime
                vm.hour_end=contentJson.endTime                        
                vm.dayNum=contentJson.dayNum
                vm.hourNum=contentJson.hourNum                
                vm.holidayType=holidayNum[contentJson.holidayType+''];

                //显示附件
                task.attachmentList = taskInfo["attachmentList"]
                var attachmentList = taskInfo["attachmentList"]
                var attachmentListStr = ''
                jQuery.each(attachmentList, function (i, attachment) {
                    attachmentStr = '<li class="attachment" id="' + attachment.id + '.' + attachment.extension + '">' + attachment.name.encodeHTML() + task.getPreviewLink(attachment) + '<a href="service/user.do?func=upload:getAttachment&flag=0&fileName=' + attachment.id + '.' + attachment.extension + '&sid=' + parent.gMain.sid + '&trueName=' + attachment.name.encodeHTML() + '" class="ml_5" >'+top.Lang.Mail.Write.xiazai+'</a></li>'
                    attachmentListStr += attachmentStr;//" class="ml_5" >下载</a></li>
                })
                jQuery('#attachmentList').html(attachmentListStr)
                vm.attachmentList=task.attachmentList

                var list='',
                    listStr='',
                    colorStr='',
                    tipStr='',
                    nameIng=''
                jQuery.each(examineList, function(i, el) {
                    switch(el.examineResult){
                        case 0: //正在审批
                            colorStr="#00b615"
                            tipStr=top.Lang.Mail.Write.zhengzaishenpi
                            nameIng=el.examineUser//正在审批
                            break
                        case 2: //驳回
                            colorStr="red"
                            tipStr=top.Lang.Mail.Write.bohui
                            break//驳回
                        default:
                            colorStr=''
                            tipStr=top.Lang.Mail.Write.tongguo
                    }//通过
                    list = '<tr><td>' + el.nodeName + '</td><td>' + el.examineUser.encodeHTML() + '</td><td title="'+ tipStr +'" style="color:'+colorStr+'">' + tipStr + '</td><td title="'+ el.examineOpinion.encodeHTML() +'" style="color:'+colorStr+'">' + (el.examineOpinion.encodeHTML()==""?'--':el.examineOpinion.encodeHTML()) + '</td><td>' + (el.examineDate==null?'--':el.examineDate) + '</td></tr>'

                    // list = '<tr><td>' + el.nodeName + '</td><td>' + el.examineUser.encodeHTML() + '</td><td title="'+ tipStr +'" style="color:'+colorStr+'">' + tipStr + '</td><td>' + (el.examineDate==null?'--':el.examineDate) + '</td></tr>'
                    // if(el.examineOpinion!=''){
                    //     list2 = '<tr><td></td><td></td><td title="'+ el.examineOpinion.encodeHTML() +'" style="color:'+colorStr+'">' + el.examineOpinion.encodeHTML() + '</td><td></td></tr>'
                    //     list +=list2
                    // } 
                    
                    listStr += list
                    if(el.examineResult==0){
                        vm.nodeId = el.nodeId;
                    }
                })
                jQuery('#pList').html(listStr);

                vm.senderUserName = jsonVar.senderUserName;
               //显示审批人顺序
                var nameAarry = jsonVar.examineOrder.split('>>');
                nameAarry = task.encodeHTMLArray(nameAarry);                 
                var newStr ='';
                for (var i = 0; i < nameAarry.length; i++) {
                    if(nameAarry[i].decodeHTML()==nameIng){
                        nameAarry[i]="<b style=\"color:black;\">"+nameAarry[i]+"</b>";
                    }
                    if(i!==nameAarry.length-1){
                        newStr+=nameAarry[i]+'&gt;&gt;';
                    }else{
                        newStr+=nameAarry[i];
                    }
                }
                jQuery('.oaflow_name').find('.col999').find('span').html(newStr);


            },
            failCall: task.failCallback,
            params: {
            },
            isNotAddUrl: true,
            url: '../../workflow.do',
            msg: top.Lang.Mail.Write.zhengzaifasong
        };//正在发送
        task.getInfoByDecodeHTML(config);
    },
    //加班审批
    initCreateWorkOverTime:function(){
        //初始化选择审批人模块
        // jQuery('#addHandlePerson').click(function(){
        //     task.createContactDialog(function(arr){
        //         var person=arr[0]
        //         vm.examineUserId=person.id
        //         vm.examineUserName=person.name||person.id.split('@')[0]
        //     })
        // })
        jQuery(function(){
            // task.initPlaceholder()
        })
        new CCalendar($("#date_start"), {
            onSelectBack: function (data) {
                vm.date_start=data.back
                return true;
            }
        });
        new CCalendar($("#date_start_i"), {
            onSelectBack: function (data) {
                vm.date_start=data.back
                jQuery("#ifrm_outLink_createworkovertime",parent.document).contents().find("#date_start").val(data.back)
                return true;
            }
        });
        new CCalendar($("#date_end"), {
            onSelectBack: function (data) {
                vm.date_end=data.back
                return true;
            }
        });
        new CCalendar($("#date_end_i"), {
            onSelectBack: function (data) {
                vm.date_end=data.back
                jQuery("#ifrm_outLink_createworkovertime",parent.document).contents().find("#date_end").val(data.back)
                return true;
            }
        });        

        function validateForm(){
            this.canSubmit = true;

            if(!vm.subject){
                task.validateAlert(top.Lang.Mail.Write.qsrspwjocqlxhzt)//请输入审批事项类型或主题
                return false
            }
            if(!vm.content){
                task.validateAlert(top.Lang.Mail.Write.qsrspnrsmuhJoX)//请输入审批内容说明
                return false
            }

            if(!(vm.date_start&&vm.date_end&&vm.hour_start&&vm.hour_end)){
                task.validateAlert(top.Lang.Mail.Write.qxzjbsjFvNkL)//请选择加班时间
                return false
            }
            if(vm.date_start+vm.hour_start>vm.date_end+vm.hour_end){
                task.validateAlert(top.Lang.Mail.Write.kssjbzwqVWyjssj)//开始时间不能大于结束时间
                return false
            }
            if(!/^\d+(\.\d+)?$/g.test(vm.dayNum)){
                task.validateAlert(top.Lang.Mail.Write.qsrzqdjbtsLgNwp)//请输入正确的加班天数
                return false
            }
            if(!/^\d+(\.\d+)?$/g.test(vm.hourNum)){
                task.validateAlert(top.Lang.Mail.Write.qsrzqmUqSEjbxss)//请输入正确的加班小时数
                return false
            }
            // if(!vm.examineUserId){
            //     task.validateAlert('请选择添加审批人')
            //     return false
            // }
            // if(vm.smsNotify){
            //     if(!task.chinaMobileRe.test(vm.mobilePhone)){
            //         task.validateAlert('请输入11位移动手机号码')
            //         return false
            //     }
            // }

            if (task.uploader.getStats().progressNum != 0) {
                this.canSubmit = false
                parent.CC.showMsg(top.Lang.Mail.Write.hywjzzscrGGeI, true, false, 'error')//还有文件正在上传
                return false
            }

            return true

        }

        //填充审批人顺序-start
        var taskId = parseInt(parent.GC.getUrlParamValue(window.location.href, "taskId"));
        var tplId = parseInt(parent.GC.getUrlParamValue(window.location.href, "templateId"));
        var frameId = parent.GC.getUrlParamValue(window.location.href, "frameId");
        task.getCheckPersonList(taskId,tplId,frameId);
        //填充审批人顺序-end

        var vm=avalon.define({
            $id:'task',
            subject:top.Lang.Mail.Write.jiabanshenpi,//加班审批
            bizDesc:top.Lang.Mail.Write.yyjbspJTNfX,//用于加班审批
            content:'',
            // mobilePhone:'',
            // examineUserId:'',
            // examineUserName:'',
            date_start:'',
            date_end:'',
            hour_start:'',
            hour_end:'',
            dayNum:'',
            hourNum:'',
            // emailNotify:false,
            // smsNotify:false,
            cancel:function(){
                if (confirm(top.Lang.Mail.Write.gbbjyiXuWFsfygb)) {//关闭编辑页，内容将丢失，是否要关闭？
                    parent.CC.exit();
                }
            },
            submit:function(){
                if(!validateForm()){
                    return
                }
                var data_start_temp = vm.date_start;   //1790-01-01
                var data_end_temp = vm.date_end;       //1790-01-01
                data_start_temp = data_start_temp.substr(5);          //01-01
                data_end_temp = data_end_temp.substr(5);        //01-01
                data = {
                    "taskId":taskId,
                    "templateId":tplId,
                    "bizSubject": vm.subject,                    
                    "attrs":  vm.dayNum + top.Lang.Mail.Write.tian + data_start_temp + top.Lang.Mail.Write.zhi + data_end_temp + ")",//天(  ||  至
                    "bizDesc": vm.bizDesc,
                    "attachmentList": task.attachmentList,
                    "contentJson":{
                        "content": vm.content,
                        "beginDate": vm.date_start,
                        "beginTime": vm.hour_start,
                        "endDate": vm.date_end,
                        "endTime": vm.hour_end,
                        "dayNum": vm.dayNum,
                        "hourNum": vm.hourNum                        
                    }
                    // "examineUserId": vm.examineUserId,
                    // "examineUserName": vm.examineUserName,
                    // "remindType": vm.emailNotify+vm.smsNotify*2+'',
                    // "mobilePhone": vm.mobilePhone,

                };
                var config = {
                    func: "workflow:createWorkFlow",
                    data: data,
                    call: function (response) {
                        // var jsonVar=jQuery.parseJSON(response['var'])
                        var jsonVar=eval("("+response['var']+")")
                        var businessId=jsonVar['businessId']
                        var type=jsonVar['taskType']

                        location.replace(location.protocol + "//" + location.host + parent.gMain.webPath+'/workflow/createok.do?sid='+parent.gMain.sid+'&type='+type+'&taskId='+taskId+'&businessId='+businessId+'&role=sender')                        
                    },
                    failCall: task.failCallback,
                    params: {
                    },
                    isNotAddUrl: true,
                    url: '../../workflow.do',
                    msg: top.Lang.Mail.Write.zhengzaifasong
                };//正在发送
                // parent.MM.doService(config);
                task.getInfoByDecodeHTML(config);            
            }
        })
        avalon.scan()
        avalon.duplexHooks.limit={
            get:function(str,data){
                var limit=parseFloat(data.element.getAttribute('data-duplex-limit'))
                if(str.length>limit){
                    return data.element.value=str.slice(0,limit)
                }
                return str
            }
        }

    },
    initGetWorkOverTime:function(id,role,taskId){
        var id=id||task.util.getQueryString('businessId')
        var role=role||task.util.getQueryString('role')
        var taskId=taskId||task.util.getQueryString('taskId')

        // task.initPlaceholder()
        // jQuery('#addHandlePerson').click(function(){
        //     task.createContactDialog(function(arr){
        //         var person=arr[0]
        //         vm.examineUserId=person.id
        //         vm.examineUserName=person.name||person.id.split('@')[0]
        //     })
        // })

        function validateForm(){
            this.canSubmit = true;
            return true

        }
        var vm=avalon.define({
            $id:'task',
            role:role,
            businessId:id,
            taskId:taskId,
            createDate:'',
            examineList:'',
            examineUserId:top.gMain.loginName,  //邮箱地址名字
            examineUserName:top.gMain.trueName,  //
            taskState:0,
            nodeId:'',
            suggestion:'',
            checkPower:false,
            attachmentList:'',
            senderUserName:'',
            content:'',            
            date_start:'',
            date_end:'',
            hour_start:'',
            hour_end:'',
            dayNum:'',
            hourNum:'',

            approve:function(index){task.approve(vm,index)}, //index: 1通过  2驳回
            reject:function(){task.reject(vm)},
            deleteTask:function(){
                task.deleteTask(vm)
            },
            cancel:function(){
                parent.CC.exit()
            },
            submit:function(){

            }
        })
        avalon.scan()

        data = {
            // "taskId":4,
            businessId:parseInt(id)
        };
        if(role=='checker'){
            data.isRead=1
        }
        var config = {
            func: "workflow:getWorkFlow",
            data: data,
            call: function (resp) {
                var jsonVar = resp['var']
                var taskResp = jsonVar['webTaskBusinessModel']
                // var taskInfo = jQuery.parseJSON(taskResp['taskInfo'])
                var taskInfo = eval("("+taskResp['taskInfo']+")")
                var contentJson = taskInfo['contentJson']
                var examineList = jsonVar['examineList']

                vm.examineList=examineList
                vm.taskState=taskResp.taskState
                vm.createDate=jsonVar.createDate
                vm.checkPower=jsonVar.checkPower                
/*
            nodeId:'',
            suggestion:'',
                vm.date_start=taskResp.beginDate.slice(0,10)
                vm.hour_start=taskResp.beginDate.slice(10,12)
                vm.date_end=taskResp.endDate.slice(0,10)
                vm.hour_end=taskResp.endDate.slice(10,12)            
 */

                vm.content=contentJson.content
                vm.date_start=contentJson.beginDate
                vm.date_end=contentJson.endDate
                vm.hour_start=contentJson.beginTime
                vm.hour_end=contentJson.endTime                        
                vm.dayNum=contentJson.dayNum
                vm.hourNum=contentJson.hourNum

                //显示附件
                task.attachmentList = taskInfo["attachmentList"]
                var attachmentList = taskInfo["attachmentList"]
                var attachmentListStr = ''
                jQuery.each(attachmentList, function (i, attachment) {
                    attachmentStr = '<li class="attachment" id="' + attachment.id + '.' + attachment.extension + '">' + attachment.name.encodeHTML() + task.getPreviewLink(attachment) + '<a href="service/user.do?func=upload:getAttachment&flag=0&fileName=' + attachment.id + '.' + attachment.extension + '&sid=' + parent.gMain.sid + '&trueName=' + attachment.name.encodeHTML() + '" class="ml_5" >'+top.Lang.Mail.Write.xiazai+'</a></li>'
                    attachmentListStr += attachmentStr;//" class="ml_5" >下载</a></li>
                })
                jQuery('#attachmentList').html(attachmentListStr)
                vm.attachmentList=task.attachmentList

                var list='',
                    listStr='',
                    colorStr='',
                    tipStr='',
                    nameIng=''
                jQuery.each(examineList, function(i, el) {
                    switch(el.examineResult){
                        case 0: //正在审批
                            colorStr="#00b615"
                            tipStr=top.Lang.Mail.Write.zhengzaishenpi
                            nameIng=el.examineUser//正在审批
                            break
                        case 2: //驳回
                            colorStr="red"
                            tipStr=top.Lang.Mail.Write.bohui
                            break//驳回
                        default:
                            colorStr=''
                            tipStr=top.Lang.Mail.Write.tongguo
                    }//通过
                    list = '<tr><td>' + el.nodeName + '</td><td>' + el.examineUser.encodeHTML() + '</td><td title="'+ tipStr +'" style="color:'+colorStr+'">' + tipStr + '</td><td title="'+ el.examineOpinion.encodeHTML() +'" style="color:'+colorStr+'">' + (el.examineOpinion.encodeHTML()==""?'--':el.examineOpinion.encodeHTML()) + '</td><td>' + (el.examineDate==null?'--':el.examineDate) + '</td></tr>'

                    // list = '<tr><td>' + el.nodeName + '</td><td>' + el.examineUser.encodeHTML() + '</td><td title="'+ tipStr +'" style="color:'+colorStr+'">' + tipStr + '</td><td>' + (el.examineDate==null?'--':el.examineDate) + '</td></tr>'
                    // if(el.examineOpinion!=''){
                    //     list2 = '<tr><td></td><td></td><td title="'+ el.examineOpinion.encodeHTML() +'" style="color:'+colorStr+'">' + el.examineOpinion.encodeHTML() + '</td><td></td></tr>'
                    //     list +=list2
                    // } 
                    
                    listStr += list
                    if(el.examineResult==0){
                        vm.nodeId = el.nodeId;
                    }
                })
                jQuery('#pList').html(listStr);
                vm.senderUserName = jsonVar.senderUserName;
               //显示审批人顺序
                var nameAarry = jsonVar.examineOrder.split('>>');
                nameAarry = task.encodeHTMLArray(nameAarry);                 
                var newStr ='';
                for (var i = 0; i < nameAarry.length; i++) {
                    if(nameAarry[i].decodeHTML()==nameIng){
                        nameAarry[i]="<b style=\"color:black;\">"+nameAarry[i]+"</b>";
                    }
                    if(i!==nameAarry.length-1){
                        newStr+=nameAarry[i]+'&gt;&gt;';
                    }else{
                        newStr+=nameAarry[i];
                    }
                }
                jQuery('.oaflow_name').find('.col999').find('span').html(newStr);                
            },
            failCall: task.failCallback,
            params: {
            },
            isNotAddUrl: true,
            url: '../../workflow.do',
            msg: top.Lang.Mail.Write.zhengzaifasong
        };//正在发送
        task.getInfoByDecodeHTML(config);
    },

    //项目审批
    initCreateWorkflow:function(){
        //初始化选择审批人模块
        // jQuery('#addHandlePerson').click(function(){
        //     task.createContactDialog(function(arr){
        //         var person=arr[0]
        //         vm.examineUserId=person.id
        //         vm.examineUserName=person.name||person.id.split('@')[0]
        //     })
        // })
        // jQuery(function(){
        //     task.initPlaceholder()
        // })
        new CCalendar($("#task_plan_online_time"), {
            onSelectBack: function (data) {
                vm.onlineDate=data.back
                return true;
            }
        });

        new CCalendar($("#task_plan_online_time_i"), {
            onSelectBack: function (data) {
                vm.onlineDate=data.back
                jQuery("#ifrm_outLink_createworkflow",parent.document).contents().find("#task_plan_online_time").val(data.back)
                return true;
            }
        });        

        function validateForm(){
            this.canSubmit = true;

            if(!vm.subject){
                task.validateAlert(top.Lang.Mail.Write.qsrspnHezblxhzt)//请输入审批事项类型或主题
                return false
            }
            if(!vm.demandExplain){
                task.validateAlert(top.Lang.Mail.Write.qsrxqsmlGfeB)//请输入需求说明
                return false
            }

            // if(!vm.examineUserId){
            //     task.validateAlert('请选择添加审批人')
            //     return false
            // }
            // if(vm.smsNotify){
            //     if(!task.chinaMobileRe.test(vm.mobilePhone)){
            //         task.validateAlert('请输入11位移动手机号码')
            //         return false
            //     }
            // }

            if (task.uploader.getStats().progressNum != 0) {
                this.canSubmit = false
                parent.CC.showMsg(top.Lang.Mail.Write.hywjzzscaVisn, true, false, 'error')//还有文件正在上传
                return false
            }

            return true

        }
        //填充审批人顺序-start
        var taskId = parseInt(parent.GC.getUrlParamValue(window.location.href, "taskId"));
        var tplId = parseInt(parent.GC.getUrlParamValue(window.location.href, "templateId"));
        var frameId = parent.GC.getUrlParamValue(window.location.href, "frameId");
        task.getCheckPersonList(taskId,tplId,frameId);
        //填充审批人顺序-end

        var vm=avalon.define({
            $id:'task',
            subject:top.Lang.Mail.Write.xiangmushenpi,//项目审批
            bizDesc:top.Lang.Mail.Write.yyxmspDomEz,            //用于项目审批
            content:'',
            mobilePhone:'',
            examineUserId:'',
            examineUserName:'',
            onlineDate:'',
            workType:'',
            demandExplain:'',
            projectPlan:'',
            num:'',
            remindType:'',
            version:'',
            emailNotify:false,
            smsNotify:false,
            cancel:function(){
                if (confirm(top.Lang.Mail.Write.gbgdbukhqAsfygb)) {//关闭工单编辑页，内容将丢失，是否要关闭？
                    parent.CC.exit();
                }
            },
            submit:function(){
                if(!validateForm()){
                    return
                }
                data = {
                    "taskId": taskId,
                    "templateId":tplId,                    
                    "bizSubject": vm.subject,
                    "attrs": vm.demandExplain,
                    "bizDesc": vm.bizDesc, 

                    "contentJson":{
                        "num": vm.num,
                        "ver": vm.version,
                        "onlineDate": vm.onlineDate,
                        "workType": vm.workType,
                        "demandExplain": vm.demandExplain,
                        "projectPlan": vm.projectPlan                        
                    },

                    "attachmentList": task.attachmentList
                };
                var config = {
                    func: "workflow:createWorkFlow",
                    data: data,
                    call: function (response) {
                        // var jsonVar=$.parseJSON(response['var'])
                        var jsonVar=eval("("+response['var']+")")
                        var businessId=jsonVar['businessId']
                        var type=jsonVar['taskType']

                        location.replace(location.protocol + "//" + location.host + parent.gMain.webPath+'/workflow/createok.do?sid='+parent.gMain.sid+'&type='+type+'&taskId='+taskId+'&businessId='+businessId+'&role=sender')
                        
                    },
                    failCall: task.failCallback,
                    params: {
                    },
                    isNotAddUrl: true,
                    url: '../../workflow.do',
                    msg: top.Lang.Mail.Write.zhengzaifasong
                };//正在发送
                // parent.MM.doService(config);
                task.getInfoByDecodeHTML(config);                
            }
        })
        avalon.scan()
        avalon.duplexHooks.limit={
            get:function(str,data){
                var limit=parseFloat(data.element.getAttribute('data-duplex-limit'))
                if(str.length>limit){
                    return data.element.value=str.slice(0,limit)
                }
                return str
            }
        }

    },
    initGetWorkflow:function(id,role,taskId){
        var id=id||task.util.getQueryString('businessId')
        var role=role||task.util.getQueryString('role')
        var taskId=taskId||task.util.getQueryString('taskId')

        // task.initPlaceholder()
        jQuery('#addHandlePerson').click(function(){
            task.createContactDialog(function(arr){
                var person=arr[0]
                vm.examineUserId=person.id
                vm.examineUserName=person.name||person.id.split('@')[0]
            })
        })

        function validateForm(){
            this.canSubmit = true;
            return true

        }
        var vm=avalon.define({
            $id:'task',
            businessId:id,
            role:role,            
            taskId:taskId,
            num:'',
            taskState:0,
            attachmentList:'',
            demandExplain:'',
            projectPlan:'',
            workType:'',
            version:'',
            onlineDate:'',
            createDate:'',
            examineList:'',
            examineUserId:top.gMain.loginName,  //邮箱地址名字
            examineUserName:top.gMain.trueName,  //
            nodeId:'',
            suggestion:'',
            checkPower:false,
            senderUserName:'',
            approve:function(index){task.approve(vm,index);}, //index: 1通过  2驳回
            // reject:function(){task.reject(vm)},
            deleteTask:function(){
                task.deleteTask(vm)
            },
            cancel:function(){
                parent.CC.exit()
            },
            submit:function(){
            }
        })
        avalon.scan()

        data = {
            // "taskId":taskId,
            businessId:parseInt(id)
        };
        if(role=='checker'){
            data.isRead=1
        }
        var config = {
            func: "workflow:getWorkFlow",
            data: data,
            call: function (resp) {
                var jsonVar = resp['var']
                var taskResp = jsonVar['webTaskBusinessModel']
                // var taskInfo = $.parseJSON(taskResp['taskInfo'])    //parseJSON解析需要json数据是标准的json,双引号
                var taskInfo=eval("("+taskResp['taskInfo']+")")
                var contentJson = taskInfo['contentJson']
                var examineList = jsonVar['examineList']

                vm.examineList=examineList
                vm.taskState=taskResp.taskState
                vm.num=contentJson.num
                vm.demandExplain=contentJson.demandExplain
                vm.workType=contentJson.workType
                vm.version=contentJson.ver
                vm.projectPlan=contentJson.projectPlan
                vm.onlineDate=contentJson.onlineDate
                vm.createDate=jsonVar.createDate
                vm.checkPower=jsonVar.checkPower

                //显示附件
                task.attachmentList = taskInfo["attachmentList"]
                var attachmentList = taskInfo["attachmentList"]
                var attachmentListStr = ''
                jQuery.each(attachmentList, function (i, attachment) {
                    attachmentStr = '<li class="attachment" id="' + attachment.id + '.' + attachment.extension + '">' + attachment.name.encodeHTML() + task.getPreviewLink(attachment) + '<a href="service/user.do?func=upload:getAttachment&flag=0&fileName=' + attachment.id + '.' + attachment.extension + '&sid=' + parent.gMain.sid + '&trueName=' + attachment.name.encodeHTML() + '" class="ml_5" >'+top.Lang.Mail.Write.xiazai+'</a></li>'
                    attachmentListStr += attachmentStr;//" class="ml_5" >下载</a></li>
                })
                jQuery('#attachmentList').html(attachmentListStr)
                vm.attachmentList=task.attachmentList

                var list='',
                    listStr='',
                    colorStr='',
                    tipStr='',
                    nameIng=''
                jQuery.each(examineList, function(i, el) {
                    switch(el.examineResult){
                        case 0: //正在审批
                            colorStr="#00b615"
                            tipStr=top.Lang.Mail.Write.zhengzaishenpi
                            nameIng=el.examineUser//正在审批
                            break
                        case 2: //驳回
                            colorStr="red"
                            tipStr=top.Lang.Mail.Write.bohui
                            break//驳回
                        default:
                            colorStr=''
                            tipStr=top.Lang.Mail.Write.tongguo
                    }//通过
                    list = '<tr><td>' + el.nodeName + '</td><td>' + el.examineUser.encodeHTML() + '</td><td title="'+ tipStr +'" style="color:'+colorStr+'">' + tipStr + '</td><td title="'+ el.examineOpinion.encodeHTML() +'" style="color:'+colorStr+'">' + (el.examineOpinion.encodeHTML()==""?'--':el.examineOpinion.encodeHTML()) + '</td><td>' + (el.examineDate==null?'--':el.examineDate) + '</td></tr>'

                    // list = '<tr><td>' + el.nodeName + '</td><td>' + el.examineUser.encodeHTML() + '</td><td title="'+ tipStr +'" style="color:'+colorStr+'">' + tipStr + '</td><td>' + (el.examineDate==null?'--':el.examineDate) + '</td></tr>'
                    // if(el.examineOpinion!=''){
                    //     list2 = '<tr><td></td><td></td><td title="'+ el.examineOpinion.encodeHTML() +'" style="color:'+colorStr+'">' + el.examineOpinion.encodeHTML() + '</td><td></td></tr>'
                    //     list +=list2
                    // } 
                    
                    listStr += list
                    if(el.examineResult==0){
                        vm.nodeId = el.nodeId;
                    }
                })
                jQuery('#pList').html(listStr);
                vm.senderUserName = jsonVar.senderUserName;
               //显示审批人顺序
                var nameAarry = jsonVar.examineOrder.split('>>');
                nameAarry = task.encodeHTMLArray(nameAarry);    
                var newStr ='';
                for (var i = 0; i < nameAarry.length; i++) {
                    if(nameAarry[i].decodeHTML()==nameIng){
                        nameAarry[i]="<b style=\"color:black;\">"+nameAarry[i]+"</b>";
                    }
                    if(i!==nameAarry.length-1){
                        newStr+=nameAarry[i]+'&gt;&gt;';
                    }else{
                        newStr+=nameAarry[i];
                    }
                }
                jQuery('.oaflow_name').find('.col999').find('span').html(newStr);                

            },
            failCall: task.failCallback,
            params: {
            },
            isNotAddUrl: true,
            url: '../../workflow.do',
            msg: top.Lang.Mail.Write.zhengzaifasong
        };//正在发送
        task.getInfoByDecodeHTML(config);
    },

    approve:function(vm,index){   //index: 1通过  2驳回
        // if(vm.action!='approve'){
        //     vm.action='approve'
        // }else{


            var data = {
//{"taskId":3,"businessId":17,"examineUserId":"admin@139.com","examineUserName":"admin","nodeId":1,"pass":true,"suggestion":"符合要求"}
                "taskId":vm.taskId,
                "businessId":vm.businessId,
                "examineUserId":vm.examineUserId,
                "examineUserName":vm.examineUserName,
                "nodeId":vm.nodeId,
                "pass":index==1?true:false,
                "suggestion":vm.suggestion
            };
            var config = {
                func: "workflow:confirmWorkFlow",
                data: data,
                call: function (resp) {
                    location.reload()
                },
                failCall: task.failCallback,
                params: {
                },
                isNotAddUrl: true,
                url: '../../workflow.do',
                msg: top.Lang.Mail.Write.zhengzaifasong
            };//正在发送
            parent.MM.doService(config);
        // }
    },
    // reject:function(vm){
    //     if(vm.action!='reject'){
    //         vm.action='reject'
    //     }else{
    //         var data = {
    //             "taskId":vm.taskId,
    //             businessId:vm.businessId,
    //             taskNodeId:4,
    //             suggestion:vm.rejectComment
    //         };
    //         var config = {
    //             func: "workflow:confirmWorkFlow",
    //             data: data,
    //             call: function (resp) {
    //                 location.reload()
    //             },
    //             failCall: task.failCallback,
    //             params: {},
    //             isNotAddUrl: true,
    //             url: '../../workflow.do',
    //             msg: '正在发送'
    //         };
    //         parent.MM.doService(config);
    //     }

    // },
    deleteTask:function(vm){
        if(confirm(top.Lang.Mail.Write.qrscsppdbcC)){//确认删除审批？
            var data = {
                // taskId:vm.taskId,
                "businessId":parseInt(vm.businessId)
            };
            var config = {
                func: "workflow:deleteUncheckWebTask",
                data: data,
                call: function (resp) {
                    var p = parent;
                    parent.CC.showMsg(top.Lang.Mail.Write.shanchuchenggong, true, false, 'option')//删除成功
                    // parent.GE.tab.close("outLink_oatask")
                    // var tabId=parent.CC.getCurLabId()
                    // parent.GE.tab.close(tabId)
                    parent.CC.exit()
                    p.CC.goOutLink( '../../workflow/listcheckworkflow.do?sid='+ p.gMain.sid, 'oatask', top.Lang.Mail.Write.shenpi)//OA审批
                },
                failCall: task.failCallback,
                params: {
                },
                isNotAddUrl: true,
                url: '../../workflow.do',
                msg: top.Lang.Mail.Write.zhengzaishanchu
            };//正在删除
            parent.MM.doService(config);
        }
    },
    //创建成功后，查看表单
    readTask:function(){
        var tabId=parent.CC.getCurLabId()
        task.goToTaskDetials()
        parent.GE.tab.close(tabId)
    },
    //查看我发起的
    readMySend:function(){
        top.CC.goOutLink( '../../workflow/listcheckworkflow.do?sid='+ top.gMain.sid, 'oatask', top.Lang.Mail.Write.shenpi)//OA审批
    },
    continueWrite:function(){
        top.CC.goOutLink( '../../workflow/createhome.do?sid='+ top.gMain.sid, 'createhome', top.Lang.Mail.Write.xinjianshenpi)//新建审批
    },

    init: function () {

        //flash模式上传附件 IE下 eval 对var 关键字有问题
        var evalCopy = eval;
        eval = function (str) {
            if (str.indexOf('var:') >= 0) {
                return evalCopy(str.replace('var:', '"var":'))
            } else {
                return evalCopy(str)
            }
        }
    },

    validateAlert:function(msg){
        var ao = {
            id: 'confirm_box',
            title: top.Lang.Mail.Write.xitongtishi,//系统提示
            type: 'div',
            icon:'warning',
            text: '<div class="pop-wrap pt_15"><p class="">'+msg+'</p></div>',
            changeStyle: false,
            zindex: 1090,
            dragStyle: 1,
            width: 350,
            buttons: [{text: parent.Lang.Mail.Ok}]
        };
        parent.CC.msgBox(ao);
    },


    getPreviewLink: function (file) {
        var extensions = ['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt', 'pdf', 'zip', 'rar']
        var imgextensions = ['gif', 'png', 'jpg', 'jpeg']
        extensions=extensions.join("")
        imgextensions=imgextensions.join("")
        if (imgextensions.indexOf(file.extension) >= 0) {
            var str = '<a previewType="image" fileName="'+file.name.encodeHTML()+'" imageIndex="'+task.imageIndex+'" href="javascript:void(0);" onclick="task.previewImg(this);" href="' + task.getPreviewLinkHref(file) + '"  class="ml_5" ">'+top.Lang.Mail.Write.zaixianyulan+'</a> '
            task.imageIndex++;//"  class="ml_5" ">在线预览</a> 
            return str;
        }
        if (extensions.indexOf(file.extension) >= 0) {
            var str = '<a target="_blank" href="' + task.getPreviewLinkHref(file) + '" class="ml_5" >'+top.Lang.Mail.Write.zaixianyulan+'</a> '
            return str//" class="ml_5" >在线预览</a> 
        } else {
            return ''
        }
    },
    previewImg: function (node) {
        focusImagesView = null;
        top.jQuery("head").append("<link rel=\"stylesheet\" href=\"" + parent.gMain.resourceRoot + "/css/preview/module/attrview.css\" type=\"text/css\" />");
        top.jQuery("body").append('<div class="jon-mark" id="jonMark" style="z-index:9999"><img style="position:absolute;top:50%;left:50%" src="' + parent.gMain.resourceRoot + '/images/module/attr/loading.gif" /></div>')

        var il = [parseInt($(node).attr('imageIndex')), getImagesList()];
        focusImagesView = new M2012.OnlinePreview.FocusImages.View();
        focusImagesView.render({ data: il[1], num: il[0] }, 1);


        function getImagesList(){
            var list=[]
            $('[previewType="image"]').each(function(i){
                var imageObj={
                    downLoad:location.protocol + "//" + location.host + parent.gMain.webPath+'/'+$(this).next().attr("href"),
                    fileName:$(this).attr("fileName"),
                    imgUrl:""
                }
                list.push(imageObj)
            })
            return list
        }
    },
    getPreviewLinkHref: function (file) {
        //有预览的权限，而且该附件大小必须<最大的预览大小
        var downLink = '/service/view.do?func=upload:getAttachment&flag=0&fileName=' + file.id + '.' + file.extension + '&sid=' + parent.gMain.sid + '&trueName=' + encodeURIComponent(file.name)

        if (downLink.indexOf("http") != 0) {
            downLink = location.protocol + "//" + location.host + parent.gMain.webPath + downLink;
        }
        var oAttacheType = parent.CC.getAttachType(file.name, file.size) ||
        {
            isView: false,
            type: ''
        };//附件类型（是否可预览，附件扩展名对应的样式名称）
        var linkHref = '';
        if (oAttacheType.isView) {
            //附件预览
            var vLink = parent.CC.getViewLink(parent.gMain.webPath || 'http://view.se139.com', 'cmail', parent.gMain.sid, downLink, parent.gMain.loginName, file.name, file.size, parent.gMain.mailId, file.id, 0);
        }
        return vLink;
    },
    initAttachmentPlugin: function () {
        jQuery(function () {
            task.uploader = WebUploader.create({
                auto: true,
                // swf文件路径
                swf: location.protocol + "//" + location.host + parent.gMain.resourceServer + '/se/task/workflow/js/Uploader.swf',

                // 文件接收服务端。
                server: 'service/user.do?func=upload:saveAttachment&sid=' + parent.gMain.sid + '&r=' + Math.random(),
                // 选择文件的按钮。可选。
                // 内部根据当前运行是创建，可能是input元素，也可能是flash.
                pick: '#addAttachment',
                // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
                resize: false
            });


            task.uploader.on('beforeFileQueued', function (file) {
                function hashString(str) {
                    var hash = 0,
                        i = 0,
                        len = str.length,
                        _char;

                    for (; i < len; i++) {
                        _char = str.charCodeAt(i);
                        hash = _char + (hash << 6) + (hash << 16) - hash;
                    }
                    return hash;
                }

                //判读文件是否上传过
                var hash = file.__hash || (file.__hash = hashString(file.name +
                    file.size + file.lastModifiedDate));

                $.each(task.uploader.getFiles(), function (i, file) {
                    if (file.__hash == hash) {
                        if (file.getStatus() == 'complete') {
                            $('#fileId_' + file.id).show();
                            task.attachmentList.push({
                                "extension": file.ext,
                                "id": $('#fileId_' + file.id).attr('sqlFileId'),
                                _fileId: file.id,
                                "name": file.name,
                                "size": file.size
                            })
                        }
                    }
                })

                if (file.size > 50 * 1024 * 1024) {
                    var tooBig = '<span class="tooBig" style="">'+top.Lang.Mail.Write.wjcgbnsckySQO+'</span>'
                    $('#fileList').append('<p id="fileId_' + file.id + '"><span class="fileName">' + file.name + '</span><span class="process">' + tooBig + '</span> </p>');//<span class="tooBig" style="">文件超过50M，不能上传</span>
                    jQuery('#fileId_' + file.id).find(".delBtn").show();
//                    jQuery('#fileId_'+file.id).find(".delBtn").click(function(){
//                        uploader.cancelFile(file);
//                    })
                    return false;
                }
            })

// 当有文件被添加进队列的时候
            task.uploader.on('fileQueued', function (file) {
                $('#fileList').append('<p class="attachment" id="fileId_' + file.id + '"><span class="fileName">' + file.name + '</span><span class="process"></span> <a href="javascript:void(0);" onclick="task.delAttachment(this)" class="delBtn" style="display: none;">'+top.Lang.Mail.Write.shanchu+'</a></p>');//</span><span class="process"></span> <a href="javascript:void(0);" onclick="task.delAttachment(this)" class="delBtn" style="display: none;">删除</a></p>
//                jQuery('#fileId_'+file.id).find(".delBtn").show();
                jQuery('#fileId_' + file.id).find(".delBtn").click(function () {
//                    task.uploader.cancelFile(file);
                })
            });


            task.uploader.on('uploadProgress', function (file, percentage) {
//                percentage=percentage==1?"上传成功":(percentage*100).toFixed(2)+"%";
//                jQuery('#fileId_'+file.id).find(".process").html((percentage*100).toFixed(2)+"%");
                jQuery('#fileId_' + file.id).find(".process").html('<span style="color: red;">'+top.Lang.Mail.Write.shangchuanzhong+'</span>');//<span style="color: red;">上传中...</span>
            });
//    uploader.on( 'uploadComplete', function( file ) {
//    })
            task.uploader.on('uploadError', function (file) {
                $('#fileId_' + file.id).find('.process').html('<span style="color:red;" >'+top.Lang.Mail.Write.shangchuanchucuo+'<span>');//<span style="color:red;" >上传出错<span>
            });

            task.uploader.on('uploadAccept', function (file, response) {
                if (response.code == "S_OK") {    //上传成功
                    $('#fileId_' + file.file.id).find('.process').html('<span style="color:green;" >'+top.Lang.Mail.Write.shangchuanchenggong+'<span>');//<span style="color:green;" >上传成功<span>
                    jQuery('#fileId_' + file.file.id).find(".delBtn").show();
                    if (response["var"].fileName.indexOf(".") == -1) {
                        var fileId = response["var"].fileName;
                    } else {
                        var fileName = response["var"].fileName
                        var fileId = fileName.substr(0, fileName.indexOf('.'))
                    }
                    jQuery('#fileId_' + file.file.id).attr('sqlFileId', fileId);
                    task.attachmentList.push({
                        "extension": file.file.ext,
                        "id": fileId,
                        _fileId: file.file.id,
                        "name": file.file.name,
                        "size": file.file.size
                    })
                } else {
                    jQuery('#fileId_' + file.file.id).find(".process").html("<span style='color: red;'>"+top.Lang.Mail.Write.shangchuanshibai+"</span>");//<span style='color: red;'>上传失败</span>
                }

            });

        })
    },
    delAttachment: function (obj) {
        $(obj).parent().hide()
        task.attachmentList = $.grep(task.attachmentList, function (item) {
            if ('fileId_' + (item._fileId || item.id) == $(obj).parent().attr("id")) {
                return false;
            } else {
                return true;
            }
        })
    },
    downloadAttachment: function (obj) {
        var config = {
            func: "upload:getAttachment&fileName=" + $(obj).parent().attr("id") + '&flag=0',
//            data: data,
            call: function (resp) {
            },
            failCall: task.failCallback,
            params: {
            },
            method: 'GET',
            isNotAddUrl: true,
            url: '../../service/user.do',
            msg: top.Lang.Mail.Write.zhengzaichaxun
        };//正在查询
        parent.MM.doService(config);
    },
    goToTaskDetials: function (type,id,taskId,role) {
        var businessId = parseInt(id||task.util.getQueryString('businessId'))
        var role = role||task.util.getQueryString('role')
        var type=parseInt(type||task.util.getQueryString('type'))
        var taskId=parseInt(taskId||task.util.getQueryString('taskId'))
        var jspUrl='';
        switch (type){
            case 4://工单流程
                jspUrl='getworkflowinfo.do'
                break
            case 3://
                jspUrl='getgeneralinfo.do'
                break
            case 2:
                jspUrl='getaskforleaveinfo.do'
                break
            case 1:
                jspUrl='getworkovertimeinfo.do'
                break
        }
        parent.CC.showMsg(top.Lang.Mail.Write.tzdxqymFXVXC, true, false, 'tipsfinish')//跳转到详情页面
        parent.CC.goOutLink('../../workflow/'+jspUrl+'?sid=' + parent.gMain.sid + '&businessId=' +
        businessId+'&taskId='+taskId+'&role='+role, 'type_'+type+'_businessId_' + businessId, top.Lang.Mail.Write.chakanxiangqing);//查看详情
    },

    //对响应的信息做decodeHTML转码
    getInfoByDecodeHTML:function(config){
        var call=config.call
        String.prototype.decodeHTML=top.String.prototype.decodeHTML
        function decodeHTML(obj){

            jQuery.each(obj,function(i){
                switch (jQuery.type(obj[i])){
                    case 'string':
                        obj[i]=obj[i].decodeHTML()
                        break;
                    case 'object':
                        decodeHTML(obj[i])
                        break;
                    case 'array':
                        decodeHTML(obj[i])
                        break;
                }
            })
        }

        config.call=function(resp){
            decodeHTML(resp)
            call(resp)
        }
        parent.MM.doService(config);
    },
    getTasks: function (data, start,callback) {
        var config = {
            func: data.fnName+"&pageNo=" + start + "&pageSize=20",
            data: data,
            call: function (resp) {
                callback(resp["var"])
            },
            failCall: task.failCallback,
            params: {
            },
            isNotAddUrl: true,
            url: '../../workflow.do',
            msg: top.Lang.Mail.Write.zhengzaichaxun
        };//正在查询
        task.getInfoByDecodeHTML(config);
    },
     /**
     * html编码<br>
     * "<" -> &lt; <br>
     * ">" -> &gt; <br>
     * @return {string} html编码以后的字符串
     */
    encodeHTMLArray : function(obj) {
        jQuery.each(obj,function(i){
            switch (jQuery.type(obj[i])){
                case 'string':
                    obj[i]=obj[i].encodeHTML()
                    break;
                case 'object':
                    encodeHTMLArray(obj[i])
                    break;
                case 'array':
                    encodeHTMLArray(obj[i])
                    break;
            }
        })
        return obj;
    },

    failCallback: function (resp) {
        var me = this,
            errorMsg = "",
            code = resp.code;

        switch (code) {
            case "FA_ATTACH_EXCEED_LIMIT":
                errorMsg = "," + top.Lang.Mail.Write.attachmentSize;
                break;
            case "FA_RECEIVER_EXCEED_LIMIT":
                errorMsg = "," + top.Lang.Mail.Write.ReceiverLimit;
                break;
            case "FA_ID_NOT_FOUND":
                errorMsg = "," + top.Lang.Mail.Write.composeid;
                break;
            case "FA_FORBIDDEN":
                errorMsg = "," + top.Lang.Mail.Write.forbidden;
                break;
            case "FA_OVERFLOW":
                errorMsg = "," + top.Lang.Mail.Write.Overflow;
                break;
            case "FA_NO_RECEIPT":
                errorMsg = "," + top.Lang.Mail.Write.NoReceipt;
                break;
            case "FA_WRONG_RECEIPT":
                errorMsg = "," + top.Lang.Mail.Write.WrongReceipt;
                break;
            case "FA_INVALID_DATE":
                errorMsg = "," + top.Lang.Mail.Write.noTime;
                break;
            case "FA_NEED_VERIFY_CODE":
                errorMsg = "," + top.Lang.Mail.Write.needCode;
                break;
            case "FA_INVALID_VERIFY_CODE":
                errorMsg = "," + top.Lang.Mail.Write.codeErr;
                break;
            case "FA_INVALID_ACCOUNT":
                errorMsg = "," + top.Lang.Mail.Write.accountErr;
                break;
            case "FA_IS_SPAM":
                errorMsg = "," + top.Lang.Mail.Write.MailAsSpan;
                break;
            case "FA_INVALID_PARAMETER":
                errorMsg = "," + top.Lang.Mail.Write.ParamErr;
                break;
            case "FA_FORBIDDEN_FORWARD_OUT_USER":
                errorMsg = "," + top.Lang.Mail.tips041;
                break;
            case "CHANGE DESC IS NOT ALLOW":
                errorMsg=top.Lang.Mail.Write.caozuoshibai;//操作失败
                break;
            case "TASK_IS_NOT_ALLOW":
                errorMsg=top.Lang.Mail.Write.caozuoshibai;//操作失败
                break;
            case "FS_UNKNOWN":
                errorMsg = "," + top.Lang.Mail.sysW;
                break;
            default :
                errorMsg=top.Lang.Mail.Write.caozuoshibai;//操作失败
                break;

        }
        ;

        if (top.IsDebug) {
            errorMsg += " code:" + (code || "") + " msg:" + (resp["var"] || resp["summary"] || "");
        }
        parent.CC.showMsg(errorMsg, true, false, 'error');
    }
}

task.util = {
    getQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    },
    getDateStr:function(tDate){
        var tDate = new Date();
        var month = tDate.getMonth() + 1;
        var date= tDate.getDate();
        var formatMonth = month < 10 ? '0' + month : month;
        var formatDate=date<10?'0'+date:date;
        return tDate.getFullYear() + "-" + formatMonth + "-" + formatDate;
    }
}

//task.init()

