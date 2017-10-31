/***
 * @author Jiangwb
 * @createtime 2010-12-07
 */

var folderPass = new OptionBase();
folderPass.attrs = {
	id:'',
	divid:'',
	//folderPassFlag:0,//当前状态：0关闭 1开启
	list:{type:'xml',func:'mbox:getAllFolders'},
	savePass:{type:'xml',func:'mbox: setFolderPass'},
	saveFolders:{type:'xml',func:'mbox: updateFolderPass'},
	data:{
		folderPassFlag:{
			text:Lang.Mail.ConfigJs.folderPwd,
			type:'radio',
			className:'',
			attribute:{
				value:'',
				defaultValue:'',
				className:''
			},
			items:{
				'1':Lang.Mail.ConfigJs.open ,
				'0':Lang.Mail.ConfigJs.set_sessionMode_off
			},
			format:'int'
		},
		folderPass:{
			text:Lang.Mail.ConfigJs.folderPwd,
			type:'text',
			className:'',
			attribute:{
				value:'',
				defaultValue:'',
				className:''
			},
			format:'string',
			again:2//重复两次
		},
		setFolderPass:{
			text:Lang.Mail.ConfigJs.setedFolderPwd,
			type:'custom',
			className:'',
			attribute:{
				value:'<span>********</span><a href="forgetsecretfolderpwd.aspx">'+Lang.Mail.ConfigJs.forgetPwd+'</a>'
			},
			noset: true
		},
		folders:{
			text:Lang.Mail.ConfigJs.PleaseChoiseProtectRange,
			type:'checkbox',
			className:'',
			attribute:{
				value:'',
				defaultValue:'',
				className:''
			},
			items:{},
			format:'string'
		}
		
	}
};
folderPass.getHtml = function(attrs, ad) {
}
/***
 * 初始化数据和attr对象
 */
folderPass.init = function(){
	
};

/***
 * 数据校验
 * @param {Object} type 类型 0关闭密码保护,1开户密码保护，2管理密码保护文件夹
 */
folderPass.checkData = function(type){
	
};

/***
 * 保存数据
 */
folderPass.Save = function(){
	
};


