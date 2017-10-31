var sender = new OptionBase();

sender.attrs = {
	id : 'sender',
	authority: 'MAIL_CONFIG_SENDER',
    free: true,
    divId:"pageSetSenderName",
    list:{type:"url",func:gConst.func.getUserInfo},//获取数据/列表时指令，数据
    tips: Lang.Mail.ConfigJs.person_sendername_tips,
    save:{type:"url",func:gConst.func.setUserInfo},          //更新数据时func指令,及数据
	data: {
		true_name: {
		    text: Lang.Mail.ConfigJs.person_sendername,
			type: 'text',
			className: '',
			attribute: {value: '',defaultValue: '',className: '',maxLength : 20},
			format: 'string',
            check:{type:"empty"}
		}
	}		
};

sender.init = function(id){
    this.request(this.attrs);
};

sender.saveBefore = function(){
    var oname = this.getEl("true_name");
    var trueName = this.getFormatValue("true_name");
    if ((!trueName.checkSpecialChar()) || (/[\ &\.\*]/.test(trueName))) {
        CC.alert(Lang.Mail.folder_NotInputChar,function(){
            oname.focus();
            return false;
        });
        return false;
    }
    return true;
};

sender.saveAfter = function(resp){
    try {
        var p = this;
        var tn = this.getFormatValue("true_name");
        gMain.trueName = tn;
        this.ok(Lang.Mail.ConfigJs.person_successMod  + "！");
    }catch(e){}
};






