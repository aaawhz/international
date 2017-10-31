var folderPOP = new OptionBase();

folderPOP.attrs = {
	id : 'folderPOP',
	authority: 'MAIL_CONFIG_FOLDERPOP',
    free: true,
	divId : 'pageFolderPOP',    
    save:{type:"url",func:gConst.func.setAttrs},          //更新数据时func指令,及数据
    noReq: true,
    tips: Lang.Mail.ConfigJs.folder_pop_custom_tip,
    data: { 
        myFolderId:{
          text:"",
          type:"checkbox",
          attribute: {
				value: '',
				defaultValue: '',
				className: '',
				event: {
					onclick: 'folderPOP.myFolder_OnClick'
				}
			}, 
            items:{'0':Lang.Mail.ConfigJs.pref_my_mailfolder },
            format: 'int' 
        },
		folderId: {
		    text: "",
			type: 'checkbox',
			className: '',
			attribute: {
				value: '',
				defaultValue: '',
				className: '',
                before:"&nbsp;&nbsp;&nbsp;&nbsp;",
                after:"<br><br>"
			},
			items: '',
			format: 'int'
		}
	}			
};

folderPOP.init = function(){
	this.attrs.data.folderId.items = CC.getFolders();//this.getSecFolder();
    this.request(this.attrs);
	this.initChecked();
};

/***
 * 取文件夹名称
 */
folderPOP.getSecFolder = function(){
    var folders = CC.getFolders(GE.folder.user);    
    var obj = {};    
    for(var i=0;i<folders.length;i++){
        var fid = folders[i].fid;
        var name = folders[i].name;
        obj[fid] = name; 
    } 
    return obj;
};

/***
 * 保存设置
 */
folderPOP.save = function(){
	var objs = document.getElementsByName("option_folderId");
	var oFolders = [];
	for(var i=0;i<objs.length;i++){
		var o = objs[i];
		var folder = MM.getFolderObject(o.value);    
        if (folder) {
            if (o.checked) {
                folder.pop3Flag = 1;
            }
            else {
                folder.pop3Flag = 0;
            }
            oFolders.push(folder);
        }
	}
	
    var p1 = this;
    var aw = {item:[]};
    for (var i = 0; i < oFolders.length; i++) {
        var folder = oFolders[i];
        var item = {
            func: gConst.func.updateFolder,
            'var': {
                fid: folder.fid,
                type: 4,
                parentId: folder.parentId,
                name: folder.name,
                folderPass: '',
                pop3Flag: folder.pop3Flag
            }
        };
        aw.item.push(item);
    }
    
    aw.item.push({
        func: gConst.func.listFolder,
        'var': {
            stats: 0,
            type: 0
        }
    });
    var fcb = function(){
        CC.alert(Lang.Mail.ConfigJs.updateFolderPOPFailed);
    };
    MM.mailRequest({
        func: gConst.func.seq,
        data: aw,
        call: function(au){
			MM[gConst.folderMain].callback(au);
			folderPOP.refresh();
			CC.alert(Lang.Mail.ConfigJs.updateFolderPOPSuc);
		},
        failCall: fcb
    });
};

/***
 * 刷新文件夹
 */
folderPOP.refresh = function(){
	this.initChecked();
};

/***
 * 全选或取消全选
 * @param {Object} id
 */
folderPOP.myFolder_OnClick = function(id){
	var o = this.getEl(id);
	var isChk = o.checked;
	var objs = this.getElementsByName('folderId');
	for(var i=0;i<objs.length;i++){
		objs[i].checked = isChk; 
	}
};

/***
 * 初始化默认选择数据
 */
folderPOP.initChecked = function(){
	var folders = CC.getFolders(GE.folder.user);
	for(var i=0;i<folders.length;i++){
		var o = folders[i];
        var fid = o.fid;                
		this.getEl('folderId'+fid).checked = o.pop3Flag==1?true:false;
    }
};
