var person = new OptionBase();

person.getUrl = function(func){
    return gMain.webApiServer+'/userconfig/NewModifyUserInfo.aspx?func={0}&rmsid={1}&sid={2}'.format(func,gMain.sid,GC.sid);
};

person.attrs = {
    id : 'person',
    divId : 'pageModifyUserInfo',
    list:{type:"url",func:gConst.func.getUserInfo},//获取数据/列表时指令，数据
    save:{func:gConst.func.setUserInfo},//更新数据时func指令,及数据
    del:{},//删除数据时func指令，报文格式，无删除操作留空
    data: {
        true_name: {
            text: top.Lang.Mail.Write.zhenshixingming,//真实姓名
            type: 'text',
            className: '',
            attribute: {
                value: '',
                defaultValue: '',
                className: ''
            },
            format: 'string'
        },
        mobileNumber: {
            text: top.Lang.Mail.Write.yonghushoujihaoma,//用户手机号码
            type: 'text',
            className: '',
            attribute: {
                value: '',
                defaultValue: '',
                className: '',
                regexStr : ''
            },
            format: 'string'
        }
    }   
};

person.init = function(id){
    this.attrs.url = this.getUrl(this.attrs.list.func);
    this.request(this.attrs,this.getHtml,null,true);
};

person.saveBefore = function(){
    this.attrs.url = this.getUrl(gConst.func.setUserInfo);
    return true;     
};
/*
        roleId: {
            text: '角色ID',
            type: 'label',
            className: '',
            attribute: {
                value: '',
                defaultValue: '',
                className: ''
            },
            format: 'int'
        },
        status: {
            text: '用户状态',
            type: 'label',
            className: '',
            attribute: {
                value: '',
                defaultValue: '',
                className: ''
            },
            format: 'int'
        },
        lastLoginTime: {
            text: '用户最后登录时间',
            type: 'label',
            className: '',
            attribute: {
                value: '',
                defaultValue: '',
                className: ''
            },
            format: 'time'
        },
        regIp: {
            text: '注册IP地址',
            type: 'label',
            className: '',
            attribute: {
                value: '',
                defaultValue: '',
                className: ''
            },
            format: 'string'
<<<<<<< .mine
        },
        trueName: {
            text: '真实姓名',
            type: 'text',
            className: '',
            attribute: {
                value: '',
                defaultValue: '',
                className: '',
                maxLength : 60
            },
            format: 'string'
        },
        mobileNumber: {
            text: '用户手机号码',
            type: 'text',
            className: '',
            attribute: {
                value: '',
                defaultValue: '',
                className: ''
            },
            format: 'string',
            noset: true
        }
    },
    //buttons:[{text: '确定',clickEvent: this.doSave}, {text: '取消',clickEvent: this.goBack}],
    request:{get:'user:getUserInfo',set:'user:setUserInfo'}             
};
=======
},*/ 

