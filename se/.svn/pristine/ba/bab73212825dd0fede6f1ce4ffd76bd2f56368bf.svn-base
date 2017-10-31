/***
 * @description 文件目录树
 * @auth tangl
 */
var folderTree = {
    selectedFid: "",//选中的文件夹ID
    selectedCss: "select_disk",//选中的样式	
    url: "/disk/userdisk.do",//AJAX请求URL
    postData: null, //post JSON数据
    /**
     * 加载文件夹类别
     * @param {int} disktype 文件柜类别
     */
    LoadFolderTree: function(disktype){
        folderTree.postData = {
            "diskType": disktype,
            "parentId": 0,
            "isSubDir": 1,
            "isSubFile": 0
        };
        callback = function(au){
            if (au.code == "S_OK") {
                var data = au["var"];
                var level = 1;
                var html = [];
                folderTree.ReadFolder(data, level, html);
                $("#folderTree").html(html.join(""));
            }
        }
        
        folderTree.Ajax("disk:listFolder", folderTree.postData, callback);
    },
    /**
     * 读取文件夹递归
     * @param {Object} data
     * @param {Object} level
     * @param {Object} html
     */
    ReadFolder: function(data, level, html){
        if (folderTree.CheckFid(data.folderId)) {
            if (level == 1) {
                html.push('<li class="select_disk"  id="liRootNode" ftype="0" fid="{0}"><a href="javascript:void(0)" style="background-color: #F6F0D0" onclick="folderTree.OperateNode(this)" class="">{1}</a>'.format(data.folderId, data.folderName));
                folderTree.selectedFid = data.folderId;
            }
            else {
                html.push('	<li ftype="0" class="{1}" fid="{0}" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">'.format(data.folderId, (data.childFolderList.length > 0 ? "" : "none")));
				html.push(' <a href="javascript:;" onclick="folderTree.OperateNode(this)" title="{0}" class="{1}">{0}</a>'.format(data.folderName,data.childFolderList.length > 0 ? "on" : ""));
            }
            
            if (data.childFolderList.length > 0) {
                level++;
                html.push('<ul level="{0}" style="display: {1}; ">'.format(level, (level == 2 ? "block" : "none")));
                for (var i = 0; i < data.childFolderList.length; i++) {
                    folderTree.ReadFolder(data.childFolderList[i], level, html);
                }
                html.push('</ul>');
            }
            html.push('</li>');
        }
    },
	/**
	 * 检查folderId是否存在移动源folderIdlist中
	 *    false等于存在,true等于不存在
	 * @param {Object} folderId
	 * @return 
	 */
    CheckFid: function(folderId){
        var fileidlist = folderTree.getQueryString("fileIdList");
        var list = fileidlist.split(",");
        
        for (var i = 0; i < list.length; i++) {
            if (folderId == list[i]) {
                return false;
            }
        }
        return true;
    },
    /**
     * 操作节点
     * @param {Object} c
     */
    OperateNode: function(c){
        $("a").removeAttr("style");
        var jc = $(c).parent();
        var cssValue = jc.attr("class");
        if (cssValue != "none") {
            if (cssValue == folderTree.selectedCss) {
                var node = jc.find("ul")[0];
                $(node).attr("style", "display: none");
                jc.attr("class", "");
                folderTree.currentDom = c;
                //alert(node.level);				
				$(c).addClass("on");
            }
            else {
                var node = jc.find("ul")[0];
                $(node).attr("style", "display: block");
                jc.attr("class", folderTree.selectedCss);
				$(c).removeClass("on");
            }
        }
        folderTree.selectedFid = jc.attr("fid");
        $(c).attr("style", "background-color: #F6F0D0");
		//$(c).addClass("checkColor");
    },
    /**
     * 移动到文件夹
     */
    MoveToFolder: function(){
		var parentid = folderTree.getQueryString("parentId");
		if(parentid == folderTree.selectedFid)
		{
			 $("#msg").text(lang.MoveTo_NotMoveCurrentDir);
			 $("#folderTree").attr("style","height:188px");
			 $("#msg").attr("style", "display: block");
			 return;
		}
        var fileidlist = folderTree.getQueryString("fileIdList");
        var list = fileidlist.split(",");
        var intList = [];
        for (var i = 0; i < list.length; i++) {
            intList[i] = (parseInt(list[i]));
        }
        folderTree.postData = {
            "fileIdList": intList,
            "copyToFolderId": parseInt(folderTree.selectedFid),
            isCopy: 1
        };
        callback = function(au){
            if (au.code == "S_OK") {
                parent.GMC.getFrameWin('outLink_diskMine').diskList.getFolderList(); 
				//parent.CC.alert(lang.MoveTo_MoveSuccess);
				parent.CC.showMsg(lang.MoveTo_MoveSuccess,true,false,"option");               
                parent.CC.closeMsgBox('moveToHTML');				
            }
            else {
                $("#msg").text(au.summary);
				$("#folderTree").attr("style","height:188px");
                $("#msg").attr("style", "display: block");
            }
        };
        folderTree.Ajax("disk:moveTo", folderTree.postData, callback);
        
    },
    /**
     * Ajax请求
     * @param {Object} func
     * @param {Object} data
     * @param {Object} callback
     */
    Ajax: function(func, data, callback){
        parent.MM.doService({
            url: folderTree.url,
            func: func,
            data: data,
            failCall: function(d){
                if (d.summary) 
                    parent.CC.alert(d.summary);
            },
            call: function(d){
                callback(d)
            },
            param: ""
        });
    },
    /**
     * 得到url参数
     * @param {Object} name
     */
    getQueryString: function(name){
        // 如果链接没有参数，或者链接中不存在我们要获取的参数，直接返回空   
        if (location.href.indexOf("?") == -1 || location.href.indexOf(name + '=') == -1) 
            return '';
        var queryString = location.href.substring(location.href.indexOf("?") + 1);
        var parameters = queryString.split("&");
        var pos, paraName, paraValue;
        for (var i = 0; i < parameters.length; i++) {
            // 获取等号位置   
            pos = parameters[i].indexOf('=');
            if (pos == -1) {
                continue;
            }
            
            // 获取name 和 value   
            paraName = parameters[i].substring(0, pos);
            paraValue = parameters[i].substring(pos + 1);
            
            // 如果查询的name等于当前name，就返回当前值，同时，将链接中的+号还原成空格   
            if (paraName == name) 
                return unescape(paraValue.replace(/\+/g, " "));
        }
        return '';
    }
}
