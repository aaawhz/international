
/**
 * 数组去重
 */
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(el, index){
        var n = this.length >>> 0, i = ~ ~ index;
        if (i < 0) 
            i += n;
        for (; i < n; i++) 
            if (i in this && this[i] === el) 
                return i;
        return -1;
    }
}

Array.prototype.unique1 = function(){
    var n = []; //一个新的临时数组
    for (var i = 0; i < this.length; i++) //遍历当前数组
    {
        var s = this[i].toString().substring(this[i].toString().indexOf("<"), this[i].toString().length);
        if (n.join("").indexOf(s) == -1) {
            n.push(this[i])
        };
            }
    return n;
    
}



/**
 * 通讯列表类
 **/
var Addr = {

    type: 0, //通讯录类型：0：个人通讯录 1：客户通讯录(暂时去掉) 2：企业通讯录
    depId: 0, //部门id 
    groupId: 0, //通讯录组id  0：所有联系人  -1：未分组联系人
    pageNo: 0, //当前页码
    pageSize: 20, //每页显示记录数
    count: -1, //本类型通讯录下联系人总数
    letter: "", //按姓名首字母查询
    departData: null,//获取部门列表数据
    op: "",//当前操作的类型
    userId: "",//编辑联系人或组ID
    groupName: "",//新建组名	
    pageCount: 0,//总页数
    curGroup: "",//当前组名
    curGroupId:"",//当前组ID
    key: "", //搜索关键字
    initValue: "",//搜索初始值
    allContactsCount: 0,//所有联系人总数
    curLetter : "ALL",//当前选中的字母
    /**
     * 按首字母、关键字 查询
     * @param {Object} c
     * @param {int} type 通讯录类型
     * @param {string} op 操作类型
     */
    searchList: function(c, type, op){
        var p = this;
        
       Addr.resetCssL();
       //$(".current").removeClass();
		
        p.pageNo = 0;
        
        p.op = op;
        p.type = type;
        p.count = -1;
        //按字母
        if (op == "l") {
	        var focuItem = $("#"+c);

			focuItem.addClass("current")
            
            if (p.type == 0) {
                p.depId = 0;
            }
            if (p.type == 2) {
                p.groupId = 0;
            }
            
            if (c == "ALL") {
                p.letter = "";
            }
            else {
                p.letter = c;
                
            }
            p.loadList(type);
        }
        //按关键字
        else 
            if (op == "k") {
            
                var oKey = $("#keyword")[0];
                
                if (Addr.initValue == "") {
                    Addr.initValue = $("#keyword").val();
                }
                if (oKey.value === Addr.initValue) {
                    oKey.value = '';
                    
                }
                
                
                var keyword = $("#" + c).val().trim();//关键字内容
                if (oKey.value == '' || keyword == '' || keyword == Addr.initValue) {
                    parent.CC.alert(Lang.serchkeyInput);
                    return false;
                }
                p.key = keyword;
                
                p.letter = "";
                p.depId = 0;
                p.groupId = 0;
                Addr.op = "k";
                var txt = new RegExp("[\\~,\\$,\\%,\\^,\\+,\\*,\\\\,\\/,\\?,\\|,\\<,\\>,\\{,\\},\\(,\\),\\'',\"]");
                if (keyword.search(txt) != -1) {
                    top.CC.alert(Lang.noSpecialcTip);
                    $("#keyword").focus();
                }
                else {
                    p.loadList(type);
                }
            }//高级搜索跳转到通讯录页面搜索关键字
            else 
                if (op == "key") {
                    p.key = c;
                    p.type = 0;
                    p.op = "k";
                    p.loadList(type);
                }
        
        
        
        
        
        
        //关键字搜索后清空搜索栏,并且清除分组的选择效果
        if (op == "k") {
            $("#keyword").val("").focus();
            $("#ALL").addClass("current");
            $("#linkmanGroup").find("li").removeClass();
            $("#linkmanGroup").find("li").find("span").css("display", "none");
            p.curGroup = "";
        }
        
        
        $("#linkmanGroup ul li ul li").removeClass();
        $("#checkAll").attr("checked", false);
        
    },
    /**
     * 按部门查询
     */
    searchDepartment: function(depId){
        Addr.resetCssL();
        $("#ALL").addClass("current");
        var p = this;
        var keyword = "";
        p.op = "";
        p.type = 2;
        p.key = keyword;
        p.letter = "";
        p.depId = depId;
        p.groupId = 0;
        p.count = -1;
        p.pageNo = 0;
        p.loadList(p.type);
        Addr.showDepCount(depId);
        $("#checkAll").attr("checked", false);
    },
    
    /**
     * 按组查询
     */
    searchGroup: function(groupId, groupName, count, q){
        var p = this;
        Addr.resetCssL();
        $("#ALL").addClass("current");
        p.type = 0;
        p.op = "sgroup";
        p.key = "";
        p.letter = "";
        p.depId = 0;
        p.groupId = groupId;
        p.count = -1;
        p.pageNo = 0;
        p.loadList(p.type);
        Addr.curGroup = groupName;
        $("#checkAll").attr("checked", false);
        if (groupId == 0) {
            $("#linkmanGroup ul li").removeClass();
            $("#linkmanGroup ul li span").css("display", "none");
        }
        
        $("#linkmanGroup ul li ").removeClass();
        $("#linkmanGroup ul li span").css("display", "none");
        if (q != "empty") {
            $(q).parent().addClass("clcolor");
            $(q).parent().find("span").css("display", "inline");
        }
        
        
        
    },
    
    /**
     * 点击tr,选择checkbox
     * param {object} p 点击对象
     */
    listTrClick: function(p){
    
        if ($(p).find("input").attr("checked") == "checked") {
            $(p).find("input").attr("checked", false);
            $(p).removeClass("checkColor");
            $(p).addClass("overColor");
            
        }
        else {
            $(p).find("input").attr("checked", true);
            $(p).removeClass();
            $(p).addClass("checkColor");
        }
        
        
        
        
    },
    
    /**
     * 移入li改变背景颜色
     * param {object} p 点击对象
     */
    umouseover: function(p){
        if ($(p).attr("class") != "clcolor") {
            $(p).addClass("overColor_li");
        }
        $(p).find("span").css("display", "inline");
    },
    
    
    /**
     * 移出改变背景颜色
     * param {object} p 点击对象
     */
    umouseout: function(p){
    
        if ($(p).attr("class") != "clcolor") {
            $(p).removeClass();
            $(p).find("span").css("display", "none");
        }
    },
    
    
    /**
     * 页显示和隐藏
     */
    pageShowHide: function(){
    
        //开始默认所有分页标签都显示
        $("#showPageDetail,#showPageDetail1").show();
        $("#homePage,#homePage1").show();
        $("#pageUp,#pageUp1").show();
        $("#nextPage,#nextPage1").show();
        $("#lastPage,#lastPage1").show();
        
        if (Addr.pageNo == Addr.pageCount - 1) { //如果当前页码是末页，则隐藏末页和下一页
            $("#nextPage,#nextPage1").hide();
            $("#lastPage,#lastPage1").hide();
        }
        else 
            if (Addr.pageNo == 0 || Addr.count <= 0) {//如果当前页码是首页，则隐藏首页和上一页
                $("#homePage,#homePage1").hide();
                $("#pageUp,#pageUp1").hide();
                
            }
        
        //改变下拉框的选中状态
        $('#selectPage')[0].selectedIndex = Addr.pageNo;
        $('#selectPage1')[0].selectedIndex = Addr.pageNo;
        //取消全选按钮的选中状态
        $("#checkAll").attr("checked", false);
    },
    
    /**
     * 显示部门目录及当前部门人数
     */
    showDepCount: function(){

	    var p = this;
	    var resHTML = "";
		var countHTML = "";
	    var da = new department();
	    var result = da.getParentDeptList(Addr.departData, p.depId);
	    var count = result[0].count;
	    
	    for (var i = result.length - 1; i >= 0; i--) {
	        resHTML += result[i].name + " / ";
	    }
	    
	    resHTML = resHTML.substring(0, resHTML.length - 2);
	    countHTML = " <font style=\"font-size:12px\">(" + count + Lang.person + ")</font>";
	    $("#totalCount").html("<strong style='font-size:14px'>"+resHTML+"</strong>"+countHTML);
    
	},
	
  /*
  showDepCount: function(){
    
         var p = this;
         var resHTML = "";
         var countHTML = "";
         var da = new department();
         var result = da.getParentDeptList(Addr.departData, p.depId);
         //  var count = result[0].count;
         
         var count = 1;
         for (var i = result.length - 1; i >= 0; i--) {
         resHTML += result[i].name + "/";
         }
         
        var depName = $("#li_2_a").text();
        var countHTML = " <font style=\"font-size:12px;font-weight:normal\">(" + count + Lang.person + ")</font>";
        $("#totalCount").html("<strong style='font-size:14px'>" + resHTML + "</strong>" + countHTML);
        
    },
*/
    
    /**
     * 重置A标签按钮的样式
     */
    resetCssL: function(){

	   $("#ALL,#A,#B,#C,#D,#E,#F,#G,#H,#I,#J,#K,#L,#M,#N,#O,#P,#Q,#R,#S,#T,#U,#V,#W,#X,#Y,#Z").removeClass("current");
 
    },
    
    /**
     * 鼠标移入事件
     * @param {Object} p 发生事件的对象 this
     */
    ffocus: function(p){
    
        if (!Addr.initValue) {
            Addr.initValue = p.value;
        }
        if (p.value == Addr.initValue) {
            p.value = '';
            $(p).css("color", "black");
        }
    },
    
    /**
     * 鼠标移除事件
     * @param {Object} p 发生事件的对象 this
     */
    fblur: function(p){
    
        if (p.value == '' || p.value == null) {
            p.value = Addr.initValue;
            $(p).css("color", "#BFBFBF");
        }
    },
    
    /**
     * 首页
     */
    homePage: function(){
    
        Addr.pageNo = 0;
        Addr.loadList(Addr.type);
        
    },
    
    /**
     * 末页
     */
    lastPage: function(){
    
        Addr.pageNo = Addr.pageCount - 1;
        Addr.loadList(Addr.type);
        
    },
    
    /**
     * 上一页
     */
    pageUp: function(){
    
        Addr.pageNo--;
        Addr.loadList(Addr.type);
    },
    
    /**
     * 下一页
     */
    nextPage: function(){
        Addr.pageNo++;
        Addr.loadList(Addr.type);
    },
    
    /**
     * 选择更新页数事件
     */
    selectChange: function(id){
    
        var pageValue = $(id + " option:selected").val();
        Addr.pageNo = pageValue;
        
        if (id == "#selectPage") {
            $('#selectPage1')[0].selectedIndex = Addr.pageNo;
        }
        else {
            $('#selectPage')[0].selectedIndex = Addr.pageNo;
        }
        
        
        
        if (Addr.pageNo == parseInt(Addr.count / 10) || Addr.count <= 0) {
            $("#nextPage,#nextPage1").hide();
            $("#lastPage,#lastPage1").hide();
            $("#homePage,#homePage1").show();
            $("#pageUp,#pageUp1").show();
        }
        else 
            if (Addr.pageNo == 0 || Addr.count <= 0) {
            
                $("#homePage,#homePage1").hide();
                $("#pageUp,#pageUp1").hide();
                $("#nextPage,#nextPage1").show();
                $("#lastPage,#lastPage1").show();
            }
            else {
            
                $("#homePage,#homePage1").show();
                $("#pageUp,#pageUp1").show();
                $("#nextPage,#nextPage1").show();
                $("#lastPage,#lastPage1").show();
            }
        
        
        
        Addr.loadList(Addr.type);
        $("#checkAll").attr("checked", false);
        
    },
    
    
    
    
    /**
     *发邮件
     */
    sendMail: function(){
        var receivers = [];
        var isSend = false;
        var isCheck = false;
        $("input:checkbox[name=addrcheckbox]:checked").each(function(){
            var mail = $(this).parent().parent().find("td").eq(2).find("a").text();
            var name = $(this).parent().parent().find("td").eq(1).find("a").text();
            isCheck = true;
            if (mail != null && mail != "") {
            	mail=mail.decodeHTML();
            	if(mail.indexOf("<")>0)
            	{
       				mail=mail.substring(mail.indexOf("<")+1,mail.indexOf(">"));
       			}
                receivers.push(name + " <" + mail + ">;");
                isSend = true;
            }
            
        });
        
        if (!isCheck) {
            parent.CC.alert(Lang.selectContact);
            return;
        }
        
        if (isSend) {
            receivers = receivers.unique1();
            parent.CC.compose(encodeURI(receivers.join("")));
        }
        else {
            parent.CC.alert(Lang.choiseContactsTip);
        }
        
    },
    
    /**
     *搜索框鼠标按下事件
     */
    initSearch: function(id, n, op){
        var ele = jQuery('#' + id);
        ele.bind('keydown', function(evt){
            if (parent.EV.getCharCode(evt) == 13) {
                Addr.searchList(id, n, op);
                Addr.op = "k";
            }
        });
        
        
    },
    
    noSearchResult: function(){
        //隐藏黑线
        //$("letterList").css("border-bottom","none");
        var p = this;
        var tip = "";
        if (p.key == "" && p.letter == "") {
            tip = Lang.viewContactsTip;
        }
        else {
            tip = Lang.index_notSearchContacts;
        }
        
        var aoo = "<tr><td colspan='5' style=\"padding-left:0;\"><div class=\"addrList-gbox\" style='margin-top:10px'>" + tip +
        "</div></td></tr>";
        
        $("#newsletterTable > tbody").empty();
        $("#newsletterTable > tbody").append(aoo);
        $("#bottomTip,#showPageDetail1,#newsletterTableHead").hide();
        
    },
    /**
     * 弹出提示
     * param {string} s 提示内容
     */
    alertMsg: function(s){
    
        parent.CC.alert(s);
    },
    
    resetParameter: function(){
        var p = this;
        p.key = "";
        p.type = 2;
        p.letter = "";
        p.group
        p.depId = 0;
        p.pageNo = 0, p.pageSize = 20, p.count = -1, p.curGroup = ""
    },
    /**
     * 返回所有联系人
     */
    goContactList: function(){
        var p = this;
        
        if (p.type == 0) {
        
            p.searchGroup(0, Lang.all_contacts, 1, "empty")
            
        }
        else {
        
            p.resetParameter();
            p.op = "allDep"
            p.loadList(2);
            
        }
        
    },
    /**
     * 搜索关键字后在页面左上角的提示设置
     */
    afterSearchKey: function(){
        p = this;
        var html = [];
        var totalDep = "";
		
		if(parent.IsOA == 1){
			totalDep = $("#li_2_a").text();
		}else{
			totalDep = $("#allDepList").text();
            //totalDep = totalDep.substring(0,totalDep.lastIndexOf("("));
		}
        //parent.LMD.groupMap["0_-1"][0][2]
        /*
         if(p.type == 2){
         //取的第一级部门名称，通过组织结构，如se139(3000) 取 se139;
         totalDep = $("#allDepList").text();
         totalDep = totalDep.substring(0,totalDep.lastIndexOf("("));
         //个人通讯录显示“所有联系人”，组织通讯录显示第一级部门名称
         }
         */
        var totalTip = p.type == 0 ? Lang.all_contacts : totalDep;
        //$("#allTip").html(totalTip);
        var fontStyle = "";
        var fontSize = "";
        if (parent.GC.check("ADDR_LIST_EP")) {
            fontStyle = "font-weight:normal";
            fontSize = "font-size:;"
        }
        else {
            fontStyle = "font-weight:normal";
            fontSize = "font-size:12px;"
        }
        html.push("<h2 style='" + fontStyle + "'><strong  style='" + fontStyle + "'>");
        html.push("<span onclick='Addr.goContactList();' class='hoverUnderline' style='cursor:pointer;'>" + totalTip + "</span>");
        if (p.key != "") {
			if(parent.CC.isBigFont()){
				html.push("<span id='ContactList_title' style='font-size:14px'>&nbsp;&gt;&gt;&nbsp;" + Lang.searchKeyWord + ": " + p.key + "</span>");
			}else{
				html.push("<span id='ContactList_title' style='font-size:12px'>&nbsp;&gt;&gt;&nbsp;" + Lang.searchKeyWord + ": " + p.key + "</span>");
			}
            
        }
        
		if (parent.CC.isBigFont()) {
			html.push("</strong><span style='" + fontStyle + ";font-size:14px'>  (<em id='ContactList_AllCount'>" + p.count + "</em>" + Lang.person + ")</span></h2>");
		}else{
			html.push("</strong><span style='" + fontStyle + ";font-size:12px'>  (<em id='ContactList_AllCount'>" + p.count + "</em>" + Lang.person + ")</span></h2>");
		}
        
        
        
        
        return html.join("");
    },
    
    
    
    /**
     * 按首字母、关键字、分组、部门加载数据
     * param {object} n 通讯录类型
     */
    loadList: function(n){
    
        var p = Addr;
        p.type = n;
        
        //组装请求通讯录联系人列表的上传数据
        var data = {
            type: p.type,
            depId: p.depId,
            pageNo: p.pageNo,
            pageSize: p.pageSize,
            count: p.count,
            letter: p.letter,
            key: p.key,
            groupId: p.groupId
        };
        
        var isChange = true;//总数是否改变
        //如果总数不为-1，说明总数不用改变，以这个总数上传，服务器就不用重新计算总数
        if (p.count != -1) {
            isChange = false;
        }
        
        //异步请求联系人列表成功后的回调函数
        function callBack(addrlistdata){
        
            //得到联系人列表的HTML
            var temp = p.getAddrListHTML(addrlistdata);
            
            try {
                //刷新联系人列表
                p.refreshContactsList(temp);
                
                //isChange --> 如果执行其他操作，联系人的总数已改变，则刷新下拉框
                if (p.pageCount >= 2) {
                    p.refreshSelectControl(isChange);
                }
                
                //刷新提示
                p.refreshTips();
                
                //控制页数及下拉框的显示 (当数据都在页面显示后)
                p.togglePageDetail();
                
				//阻止checkbox mailName冒泡
				p.stopFieldPropagation();
		
				
				//选择checkbox改变该行的背景颜色
				p.changeTrBgColor();
				
				//调用了smap接口后的提示
				if(parent.IsOA == 1){
					p.showDepSm();
				}else{
					p.showDepTree();
				}
               
				
				//鼠标移上去显示滚动条
				//p.showHideScroll();
            } 
            catch (e) {
            
            }
            
        }
        Addr.Ajax("addr:listUser", data, callBack);
        $("#checkAll").attr("checked", false);
        
    },
	
	showHideScroll : function(){
		$("#linkmanGroup").css("overflow-y","hidden").mouseleave(function(){
			$(this).css("overflow-y","hidden");
		})
		.mouseenter(function(){
			$(this).css("overflow-y","auto");
		});	
	},
	
	changeTrBgColor : function(){
		$(":checkbox[name=addrcheckbox]").each(function(){
			$(this).click(function(){
				if($(this).attr("checked") == "checked"){
					$(this).parent().parent().attr("class","checkColor");
				}else{
					$(this).parent().parent().attr("class","overColor");
				}
			});
		});	
	},
	
	/*
	 * 显示smap接口所有联系人的提示
	 */
    showDepSm: function(){
        var p = this;
        if (p.type == 2 && p.op == "allDep" ) {
            var html = "";
            var text = $("#li_2_a").text();
            
            html = "<strong style='font-size:14px;'>" + text + "</strong>";
            html += "<label style='font-size:12px; font-weight:normal'> (" + p.count + Lang.person + ")</label>";
            $("#totalCount").html(html);
        }
    },
	/*
	 * 显示getDepTree接口所有联系人的提示
	 */
	showDepTree : function(){
		var p = this;
        if (p.type == 2 && p.op == "allDep" ) {
            var html = "";
            var text = $("#allDepList").text();
           // text = text.substring(0,text.lastIndexOf("("));
            
            html = "<strong style='font-size:14px;'>" + text + "</strong>";
            html += "<label style='font-size:12px; font-weight:normal'> (" + p.count + Lang.person + ")</label>";
           
		    $("#totalCount").html(html);
        }
	},
	
	stopFieldPropagation : function(){
			
	    $(":checkbox[name=addrcheckbox]").each(function(){
			$(this).click(function(ev){
				ev.stopPropagation();
			});
		});
		
		$(".td_mailName a").each(function(){
			$(this).click(function(ev){
				ev.stopPropagation();
			});
		})
	
	},
    /**
     * 得到所有联系人的数量
     */
    getAllContacts: function(){
        var data = {
            type: 1,
            depId: "",
            pageNo: 0,
            pageSize: 20,
            count: -1,
            letter: "",
            key: "",
            groupId: ""
        };
        var count = 0;
        function callBack(data){
        
        
        }
        Addr.Ajax("addr:listUser", data, callBack);
    },
    
    /**
     * 刷新提示
     */
    refreshTips: function(){
        var fontW = "normal";
        var p = this;
        //第一次加载默认显示所有联系人
        if ((p.curGroup == "" && p.type == 0 && p.key == "" && p.letter == "") || p.op =="deleteGroup") {
			if(parent.CC.isBigFont()){
				 $("#showPersonListDetail").html(decodeURI(Lang.all_contacts) + " <font style=\"font-size: 14px;font-weight:" + fontW + ";\">(" + p.count + Lang.person + ")</font>");
			}else{
				 $("#showPersonListDetail").html(decodeURI(Lang.all_contacts) + " <font style=\"font-size: 12px;font-weight:" + fontW + ";\">(" + p.count + Lang.person + ")</font>");
			}
           
        }
        
        /*

        if (p.op == "l" && p.type == 2) {
            var allDep = $("#allDepList").text();
            $("#totalCount").html("<strong style='font-size:14px'>" + $("#li_2_a").text() + "</strong>");
        }
*/
        
        
        //如果是在一个组中删除,移动，复制联系人，显示该组的名称及人数的提示,保持该组选中
        
        if ((p.op == "deleteContacts" || p.op == "copyTo" || p.op == "moveTo") && p.curGroup != "" && p.type == 0) {
        
            $("#showPersonListDetail").html("<label id=\"tip_groupName\">"+p.curGroup + "</label> <span class=\"\"><font style=\"font-size: 12px;font-weight:" + fontW + ";\">(" + p.count + Lang.person + ")</font></span>");
            
        }
        
        //如果按组查询
        else 
            if (Addr.op == "sgroup" && Addr.op != "deleteGroup" && p.type == 0) {
                $("#showPersonListDetail").html("<label id=\"tip_groupName\">"+p.curGroup + "</label><span class=\"\"> <font style=\"font-size: 12px;font-weight:" + fontW + ";\">(" + p.count + Lang.person + ")</font></span>");
            }
            
            
            //关键字不为空，刷新提示	
            else 
                if (p.key != "" && p.letter == "") {
                
                    if (p.type == 0) {
                    
                        //$("#showPersonListDetail").html(Addr.key + "<span class=\"\">  <font style=\"font-size: 12px;font-weight:lighter;\">(" + p.count + Lang.person + ")</font></span>");
                        $("#showPersonListDetail").empty().append(p.afterSearchKey());
                    }
                    else 
                        if (p.type == 2) {
                        
                            //$("#totalCount").html( p.key + "  <font>(" + p.count + Lang.person + ")</font>");
                            $("#totalCount").html("<strong>" + p.afterSearchKey() + "</strong>");
                        }
                }
                
                
                
                //如果关键字为空进行搜索，显示所以联系人的提示 或 所有部门的提示
                else 
                    if ((p.key == "" && p.op == "k")) {
                    
                        if (p.type == 0) {
                            //个人通讯录
                            $("#showPersonListDetail").html(p.afterSearchKey());
                        //$("#showPersonListDetail").html(decodeURI(Lang.all_contacts)+" <span class=\"\"><font style=\"font-size: 12px;font-weight:lighter;\">("+p.count+Lang.person+")</font></span>");
                        }
                        else {
                            //组织通讯录
                            Addr.depId = 0;
                            Addr.showDepCount();
                            
                        }
                    }
        
        //如果无联系人,给出相应的提示
        if (Addr.count == 0 && p.type == 0 && p.op == "k") {
        
            /*
             var aoo = "<tr><td colspan='5'><span style=\"padding-left:20px\">" + Lang.index_notSearchContacts + "</span></td></tr>";
             $("#newsletterTable > tbody").empty();
             $("#newsletterTable > tbody").append(aoo);
             
             */
            p.createImportTip();
        }
        else 
            if (Addr.count == 0 && p.type == 2 && p.op == "k") {
                /*
             var aoo = "<tr><td colspan='5'><span style=\"padding-left:20px\">" + Lang.index_notSearchContacts + "</span></td></tr>";
             $("#newsletterTable > tbody").empty();
             $("#newsletterTable > tbody").append(aoo);
             */
                p.noSearchResult();
                
            }
            else 
                if (Addr.count == 0 && p.type == 2) {
                    /*
             var aoo = "<tr><td colspan='5'><span style=\"padding-left:20px\">" + Lang.index_noContact + "</span></td></tr>";
             $("#newsletterTable > tbody").empty();
             $("#newsletterTable > tbody").append(aoo);
             */
                    p.noSearchResult();
                    
                }//首字母搜索
                else 
                    if (Addr.count == 0 && p.type == 0) {
                    
                        p.createImportTip();
                    }
                    else 
                        if (Addr.count > 0 && Addr.pageCount == 1) {
                            $("#homePage,#homePage1").hide();
                            $("#pageUp,#pageUp1").hide();
                            $("#bottomTip").show(); // added by liweifeng
                            //$(".newsletterData").hide(); // added by liweifeng
                            $(".labelIndex").show();
                            $("#showPageDetail1").hide();
                            $("#newsletterTableHead").show();
                        }
                        else 
                            if (Addr.count > 0 && Addr.pageCount > 1) {
                                $("#homePage,#homePage1").show();
                                $("#pageUp,#pageUp1").show();
                                $("#bottomTip").show(); // added by liweifeng
                                //$(".newsletterData").hide(); // added by liweifeng
                                $(".labelIndex").show();
                                $("#showPageDetail1").show();
                                $("#newsletterTableHead").show();
                            }
    },
    
    //得到联系人列表的HTML
    getAddrListHTML: function(addrlistdata){
        var at = [];
        var p = this;
        //获取服务器返回的联系人总数
        p.count = addrlistdata["var"].page.totalCount;
        var dep = "";
        p.pageCount = addrlistdata["var"].page.pageCount;//获取列表的页数
        p.pageNo = addrlistdata["var"].page.curPage - 1;//返回的第一页pageNo为1，而请求第一页时，pageNo为0
        for (var i = 0; i < addrlistdata["var"].list.length; i++) {
			
            var tId = p.type == 0 ? addrlistdata["var"].list[i].id : addrlistdata["var"].list[i].userId;
            
            var mobile = addrlistdata["var"].list[i].mobile;
            var mail = addrlistdata["var"].list[i].email;
            var tName = addrlistdata["var"].list[i].userName;
            var memo = addrlistdata["var"].list[i].memo;
            var department = addrlistdata["var"].list[i].department;
            var titleMail = mail;
            var titleName = tName;
            dep = department;
            
            //如果常用邮箱mail为空，则显示商务邮箱bussinessEmail
            if (mail == "") {
                mail = addrlistdata["var"].list[i].bussinessEmail;
            }
            
            //如果手机mobile为空，则显示商务手机bussinessMobile
            if (mobile == "") {
                mobile = addrlistdata["var"].list[i].bussinessMobile;
            }
            
            //关键字高亮显示
            if (p.key.replace(/\s/g, "") != "") {
            
            
                var re = new RegExp(p.key, "g");
               // var s = "<font style=\'background:#FDFE7F\'>" + p.key + "</font>";
               
				var s = "<span style=\' background-color:Gold;padding-left:2px;padding-right:2px;\'>" + p.key + "</span>";
                tName = tName.replace(re, s);
                mail = mail.replace(re, s);
                mobile = mobile.replace(re, s);
                
            }
            //onclick='Addr.listTrClick(this)'
			/*
if(p.type == 0){
				 if (parent.GC.check("ADDR_UPDATEUSER") ) {
				 	at.push("<tr width=\"100%\" onmouseover='Addr.mouseover(this);' onclick=\"Addr.linkQuickAdd('" + tId + "')\"   onmouseout='Addr.mouseout(this)'>");
			
			
				}else {
					at.push("<tr width=\"100%\" onmouseover='Addr.mouseover(this);' onclick=\"Addr.noEditPermission('" + tId + "')\"   onmouseout='Addr.mouseout(this)'>");
				}
			}else{
				at.push("<tr width=\"100%\" onmouseover='Addr.mouseover(this);' onclick='Addr.listTrClick(this)'  onmouseout='Addr.mouseout(this)'>");
			}
			
*/   
            at.push("<tr width=\"100%\" onmouseover='Addr.mouseover(this);' onclick='Addr.listTrClick(this)'  onmouseout='Addr.mouseout(this)'>");
           
			//复选框列
            at.push("<td width=\"5%\" align=\"left\" style=\"padding-left:10px;\"><input id='" + tId + "' type=\"checkbox\" name=\"addrcheckbox\"  value=\"" + tId + "\"></td>");
            
           
            //姓名列
            if (p.type == 0) {
				 if (parent.GC.check("ADDR_UPDATEUSER")) {
				 	at.push("<td width=\"25%\" align=\"left\"  id=\"td_userName\" class=\"td_mailName\"  ><a style=\"zoom:1\" onclick=\"Addr.linkQuickAdd('" + tId + "')\"  title=\""+Lang.editContact+"\" class=\"color_333333\"  >" +
				 	tName +
				 	"</a></td>");
				 }else{
				 	at.push("<td width=\"25%\" align=\"left\" onclick=\"Addr.noEditPermission('" + tId + "')\" ><a  class=\"color_333333\" title=\"" + titleName + "\" >" +
				 	tName +
				 	"</a></td>");
				 }
                
            }
            
            
            //查看联系人
            if (p.type == 2) {
            
                at.push("<td width=\"25%\" align=\"left\"><a  class=\"color_333333\" 	 href=\"viewuser.do?sid=" + Addr.getQueryString("sid") + "&uid=" + tId + "&pName=" + department+"\"  title=\"" + titleName +
                "\">" +
                tName +
                "</a></td>");
                
            }
            
            
            //邮件地址列
            
            
            /*
             at.push("<td width=\"30%\" align=\"left\" style=\"padding-left:12px\">&nbsp;<a class=\"color_333333\"");
             at.push(" name='mail'  title='" + titleMail + "'  onclick='Addr.send(\"" + titleName + "<" + mail + ">\")'");
             at.push("alt='" + titleMail + "'>" + mail + "</a></td>");
             */
            var enMail = titleName + "<" + titleMail + ">;";
            enMail = encodeURI(enMail);
            if(titleMail == ""){
				 at.push("<td  width=\"30%\" align=\"left\" id=\"td_mailName\" class=\"td_mailName\" style=\"padding-left:12px\">&nbsp;<a  style=\"zoom:1\" class=\"color_333333\" name=\"mail\" alt=\"" + titleMail + "\">" + mail + "</a></td>");
			}else{
				 at.push("<td  width=\"30%\" align=\"left\" class=\"td_mailName\" style=\"padding-left:12px\">&nbsp;<a onclick = \"Addr.send('"+titleName+"',\'" + titleMail + "\')\"  title=\"" + Lang.index_sendEmail  + "\" class=\"color_333333\" name=\"mail\" alt=\"" + titleMail + "\">" + mail + "</a></td>");
			}
           
            
            
            
            //手机号码列
            
            if (p.type == 0) {
				if (parent.GC.check("ADDR_UPDATEUSER")) {
					at.push("<td width=\"17%\" align=\"left\"  >" + mobile + "</td>");
				}else{
					at.push("<td width=\"17%\" align=\"left\" >" + mobile + "</td>");
				}
			}
            else {
                at.push("<td width=\"25%\" align=\"left\">" + mobile + "</td>");
            }
            
            //备注 或 部门
            if (p.type == 0) {
				if (parent.GC.check("ADDR_UPDATEUSER")) {
					at.push("<td width=\"35%\" align=\"left\"  >" + memo + "</td></tr>");
				}else{
					at.push("<td width=\"35%\" align=\"left\" >" + memo + "</td></tr>");
				}
			}
            else {
                at.push("<td  align=\"left\">" + department + "</td></tr>");
            }
        }
        
        return at.join("");
    },
    
    /**
     * 无编辑联系人权限提示
     */
    noEditPermission: function(){
        parent.CC.alert(Lang.noEditPermission);
    },
    
    /**
     * 刷新联系人列表
     * @param {Object} temp 含返回数据的联系人列表的HTML
     */
    refreshContactsList: function(temp){
        var p = this;
        
        //document.getElementById("newsletterTable_id").innerHTML = "a";
        //刷新通讯录联系人列表
        $("#newsletterTable > tbody").empty();
        $("#newsletterTable > tbody").append(temp);
        //document.getElementById("newsletterTable_tbody").innerHTML = temp;   
    },
    
    /**
     * 控制页数及下拉框的显示
     */
    togglePageDetail: function(){
        var p = this;
        $("#showPageDetail,#showPageDetail1").show();
        //根据当前是第几页来隐藏，显示：首页、上一页  或者  末页、下一页
        p.pageShowHide();
        //如果数据不到两页，则不显示 页数选择下拉框
        if (p.pageCount < 2) {
            $("#showPageDetail,#showPageDetail1").hide();
        }
    },
    /**
     * 刷新下拉框控件
     * @param {Object} isChange
     */
    refreshSelectControl: function(isChange){
        var p = this;
        var html = [];
        if (isChange) {
            $("#selectPage,#selectPage1").empty();
            
            if (p.pageCount == 0) {
                $("#selectPage,#selectPage1").append("<option >" + (1 + " / " + 1) + "</option>");
            }
            else {
                for (var i = 0; i < p.pageCount; i++) {
                    html.push("<option value=\"" + i + "\">" + (i + 1 + " / " + p.pageCount) + "</option>");
                }
                $("#selectPage").html(html.join(""));
                $("#selectPage1").html(html.join(""));
            }
        }
    },
    
    /**
     * 个人通讯录没有搜索到联系人，创建的HTML提示：暂无联系人，请 新建 或 导入。
     */
    createImportTip: function(){
        var aoo = "<tr><td colspan='5' style=\"padding-left:0;\"><div class=\"addrList-gbox\" style='margin-top:10px'>" + Lang.noContcactTip +
        " <a onmouseover=\"this.style.color='#003be2'\" onmouseout=\"this.style.color='#495BAC'\" style=\"color:#495BAC\" onclick=\"Addr.bOverCount()\" >" +
        Lang.create +
        "</a> " +
        Lang.or +
        " <a onmouseover=\"this.style.color='#003be2'\" onmouseout=\"this.style.color='#495BAC'\" style=\"color:#495BAC\" href=\"javascript:void(0);\" onclick=\"Addr.importFile();return false;\">" +
        Lang.import_n +
        "</a>。</div></td></tr>";
        $("#newsletterTable > tbody").empty();
        $("#newsletterTable > tbody").append(aoo);
        //labelIndex m_clearfix
        $("#homePage,#homePage1").hide();
        $("#pageUp,#pageUp1").hide();
        $("#bottomTip").hide(); // added by liweifeng
        //$(".newsletterData").hide(); // added by liweifeng
        //$(".labelIndex").hide();
        $("#showPageDetail1").hide();
        $("#newsletterTableHead").hide();
    },
    
    /**
     * 判断通讯录联系人是否超过5000，是则不能新建
     */
    bOverCount: function(){
        var data = {
            type: 0,
            depId: 0,
            pageNo: 0,
            pageSize: 20,
            count: -1,
            letter: "",
            key: "",
            groupId: 0
        };
        var callBack = function(data){
            if (data["var"].page.totalCount >= 5000) {
                parent.CC.alert(Lang.maxConTip);
                
            }
            else {
                window.location.href = "../addr/quickadd.do?sid=" + Addr.getQueryString("sid")+"&op=addInMailList&mailListGroupId="+Addr.groupId;
            }
        };
        Addr.Ajax("addr:listUser", data, callBack);
    },
    
    linkQuickAdd: function(tId){
        window.location.href = "../addr/quickadd.do?sid=" + Addr.getQueryString("sid") + "&uid=" + tId + "&op=edit";
    },
    
    linkViewContact: function(tId, department){
        window.location.href = "../addr/viewuser.do?sid=" + Addr.getQueryString("sid") + "&uid=" + tId + "&pName=" + department;
    },
    
    /**
     * 转到写信页面
     * @param {Object} s
     */
    send: function(name,mail){
        /*
         var firstChar = mail.substr(0,1);
         var len = mail.length;
         while(firstChar == "'" || firstChar =='"'){
         mail = mail.substring(1,len);
         }
         */
		if(mail.indexOf("<")>0)
		{
			mail = mail.substring(mail.indexOf("<")+1,mail.indexOf(">"));
		}
		mail = name+"<"+mail+">;";
        parent.CC.compose(mail);
    },
    /**
     * 到导入界面
     */
	importFile : function(){
		if(parent.GC.check("ADDR_IMPORT")){
			window.location.href = "../addr/importfromfile.do?sid=" + Addr.getQueryString("sid") + "&groupId=" 
			 +Addr.groupId;
		}else{
			parent.CC.alert(Lang.noImportPermission);
		}
		
	},
    showGroupColor: function(){
        //如果组名ID不为0，则高亮显示该组  [groupId: 0-->所有联系人; -1 -->未分组联系人]
        if (Addr.groupId != 0) {
        
            $("#linkmanGroup ul li").each(function(){
                var id = $(this).attr("id");
                
                if (Addr.groupId == id) {
                    $(this).addClass("clcolor");
                    $(this).find("span").css("display", "inline");
                }
            });
        }

    },
    
    
    /**
     * 更新组织通讯录联系人列表
     * @param {Object} data
     */
    refreshDepList: function(data, department){
    
        //联系人具体信息
        var userList = data;
        var p = this;
        var at = [];
		
		department = department.decodeHTML();
        $("#totalCount").empty();
		var html = "";
	    html = "<strong style='font-size:14px'>" + department + "</strong>"
        html += "<font style='font-size:12px,font-weight:normal'> (" + 0 + Lang.person + ")</font>";
		
		if(userList == "" || userList == undefined){
			
           
            $("#totalCount").html(html);
            
            p.noSearchResult();
            return;
		}	
			
        //如果返回的数据为空，（现在返回undefined，有可能返回空数组）
        if (userList.length <= 0) {
           
            $("#totalCount").html(html);
            
            p.noSearchResult();
            return;
        }
        else {
            var len = userList.length;
            var html = "";
			//通讯录首页左上角的提示
            html = "<strong style='font-size:14px'>" + department + "</strong>"
            html += "<font style='font-size:12px,font-weight:normal'> (" + len + Lang.person + ")</font>";
            $("#totalCount").html(html);
			
			//显示表格头部和尾部
			$("#bottomTip,#newsletterTableHead").show();
            
        }
        
        if (len > 0) {
            for (var i = 0, len = userList.length; i < len; i++) {
            
                var mobile = "";
                var mail = userList[i][0];
                var name = userList[i][1];
                
                
                at.push("<tr width=\"100%\" onmouseover='Addr.mouseover(this);' onclick='Addr.listTrClick(this)'  onmouseout='Addr.mouseout(this)'>");
                
                //复选框列
                at.push("<td width=\"5%\" align=\"left\" style=\"padding-left:10px;\"><input  type=\"checkbox\" name=\"addrcheckbox\" ></td>");
                
                //姓名列	
                at.push("<td width=\"25%\" align=\"left\"><a  class=\"color_333333\"  title=\"" + name +
                "\">" +
                name +
                "</a></td>");
                
                //邮件地址列
                var enMail = name + "<" + mail + ">;";
                enMail = encodeURI(enMail);
                
                at.push("<td width=\"30%\" align=\"left\" style=\"padding-left:12px\">&nbsp;");
                at.push("<a class=\"color_333333\" name=\"mail\" title=\"" + mail + "\" onclick = \"Addr.send('"+name+"','" + mail + "')\" alt=\"" + mail + "\">" + mail + "</a></td>");
                
                //手机号码列
                at.push("<td width=\"25%\" align=\"left\">" + mobile + "</td>");
                
                //备注 或 部门
                at.push("<td  align=\"left\">" + department + "</td></tr>");
            }
            
            $("#newsletterTable > tbody").empty().html(at.join(""));
        }
        else {
            //该部门没有联系人的显示
            p.noSearchResult();
        }
		
		//阻止checkbox冒泡
		p.stopCheckboxPropagation();
    },
    
	
	
	
    /**
     * 加载组织通讯录结构列表
     * @param {Object} id 根据这个ID来获取子部门和当前id对应部门的联系人
     * @param {Object} index 改变下一级部门的位置
     */
    loadDepList: function(id, index, pName){
        var p = this;
        var type = 2;
        var id = id;
        //是否要把请求的数据追加到组织通讯录结构列表中
        var isChangeList = true;
        p.key = "";
        p.type = 2;
        
		if(pName){
			pName = pName.encodeHTML();
		}
		
		
        //只有点击右边的组织结构，就没有分页
        $("#showPageDetail1").hide();
        
        if (index == 1) {
            id = 0;
        }
        
        //如果三角形向下     [i_sadd:向左   i-hminus:向下]
        if (jQuery("#i_" + type + "_" + id).attr("class") == "mr_5 i-hminus") {
            //改变三角形方向：向左
            jQuery("#i_" + type + "_" + id).attr("class", "mr_5 i-sadd");
            //如果已经有子部门列表，则隐藏、收起，并且不重复在组织通讯录列表中追加子部门
            if (jQuery("#ul_" + type + "_" + id).length > 0) {
                jQuery("#ul_" + type + "_" + id).attr("style", "display:none");
                isChangeList = false;
            }
        }
        else {
            //否则改变三角形方向：向下
            jQuery("#i_" + type + "_" + id).attr("class", "mr_5 i-hminus");
            //如果有子部门列表，则显示出来，并且不重复在组织通讯录列表中追加子部门，否则就进行AJAX请求
            if (jQuery("#ul_" + type + "_" + id).length > 0) {
                jQuery("#ul_" + type + "_" + id).attr("style", "display:''");
                isChangeList = false;
            }
        }
        
        //第一级的总部
        var p = this;
        var data = {
            depId: id,//后台只根据id返回相应的数据
            type: "2",
            paging: 1,
            pageNo: 0,
            pageSize: 20,
            count: -1,
            letter: "",
            key: "",
            groupId: 0
        };
        
        //只有第一次进入组织通讯录显示根节点
        if (index == 0 && isChangeList) {
        	
			//提示用户点击右边组织架构查看联系人  
			p.noSearchResult();  
			  
            Addr.Ajax("addr:getDepTree", {}, function(dataOk){
            
                //var da = new department();
                //var result = da.getParentDeptList(dataOk["var"], 0);
                //var name = result[0].name;
				//数据库出错后，可能返回空字符串
				if(dataOk["var"] == "" || dataOk["var"][0] == "" || dataOk["var"][0].name == ""){
					return;
				}
				
				//url传值
                var name = dataOk["var"][0].name.decodeHTML();
                
                var data1 = {
                    id: id,
                    name: name
                };
                //创建跟右边的组织结构跟节点
                Addr.getDepListHTML(data1, index);
                //$("#departList").html(deptHTML);
                
				//因为要显示根部门（中国移动通信集团）的子部门，所以根部门的三角形向下
				$("#i_2_0").removeClass("i-sadd").addClass("i-hminus");
				
                $("#totalCount").html("<strong>" + $("#li_2_a").text() + "</stong>");
                
				 var firstLevelData = {
		            depId: 0,//后台只根据id返回相应的数据
		            type: "2",
		            paging: 1,
		            pageNo: 0,
		            pageSize: 20,
		            count: -1,
		            letter: "",
		            key: "",
		            groupId: 0
		       	 };
		        
				
				//得到根部门名称后(sm接口是不会返回根部门的);在请求根部门下的子部门，并显示
				contact.Ajax("/addr/user", "addr:ListSmapUser", firstLevelData, function(data){
					if(data.code == "S_OK"){
						if(data["var"] == "" || data["var"] == undefined){
							return;
						}
						
						if(data["var"].length == 0){
							return;
						}
						
						if(data["var"][0].length == 0 || data["var"][0] == ""){
							return;
						}
						
						Addr.getDepListHTML(data, 1 ,data["var"][0][0][3]);
						
					}
				})
			
            });
                
        }else{
			 //回调函数
	        function callBack(data){
	        
	            if (data.code == "S_OK") {
	                if (index != 0) {
	                    if (isChangeList) {
	                        //跟新列表
	                        Addr.getDepListHTML(data, index, id);
	                    }
	                    //必须更新左边的联系人列表,传入被点击部门的联系人数据
	                    p.refreshDepList(data["var"][1], pName.encodeHTML());
	                }
	            }
	        }
	        
	        //取得sm数据的AJAX请求
	        contact.Ajax("/addr/user", "addr:ListSmapUser", data, callBack)
			}

    },
    
    /**
     * 得到sm下的组织通讯录部门结构列表
     * @param {Object} data 服务器返回的子部门的列表和被点击部门（当前部门）的数据
     * @param {Object} index
     * @param {Object} id 被点击部门的id，赋值给子部门的ul的id
     */
    getDepListHTML: function(data, index, id){
        var html = [];
        var deptListHtml = "";
        var type = 2;
        var a_style = "padding-left:" + (27 + (index * 16)) + "px";
        var title = 2;
        var id = 0;
        
		
        if (index == 0) {
            html.push("<li id='li_" + type + "_" + data.id + "' >");
            html.push("<span style='" + a_style + "' class='fw_b departList_span' ");
            html.push(" onmouseover=\"this.className='fw_b departList_span overColor'\" onmouseout=\"this.className='fw_b departList_span'\" ");
            html.push("onclick = \"Addr.loadDepList('" + data.id + "'," + (index + 1) + ",'" + data.name.encodeHTML() + "')\">");
            html.push("<a id=\"li_2_a\" href='javascript:;' class='contactList departList_a'>");
            html.push("<i class=\"mr_5 i-sadd\"  id='i_" + type + "_" + data.id + "' ></i>");
            html.push(data.name + "</a></span></li>");
        }
        else {
        
		    if(data["var"] == "" || data["var"]==undefined){
				return;
			}else if(data["var"].length == 0){
				return;
			}
			
			if(data["var"][0] == "" || data["var"][0] == undefined){
				return;
			}else if(data["var"][0].length == 0){
				return;		
			}
			
            //公司部门列表数据
            var userDeptList = data["var"][0];
            //联系人列表数据
            var userList = data["var"][1];
            
            for (var i = 0; i < userDeptList.length; i++) {
                id = userDeptList[i][3];
                html.push("<li id='li_" + type + "_" + userDeptList[i][1] + "' >");
                html.push("<span style='" + a_style + "' class='fw_b departList_span' ");
                html.push(" onmouseover=\"this.className='fw_b departList_span overColor'\" onmouseout=\"this.className='fw_b departList_span'\" ");
                html.push("onclick = \"Addr.loadDepList('" + userDeptList[i][1] + "'," + (index + 1) + ",'" + userDeptList[i][2].encodeHTML() + "')\">");
                html.push("<a href='javascript:;' class='contactList departList_a'>");
                html.push("<i class=\"mr_5 i-sadd\"  id='i_" + type + "_" + userDeptList[i][1] + "' ></i>");
                html.push(userDeptList[i][2] + "</a></span></li>");
            }
        }
        
        
        
        
        if (index == 0) {
            if (html.join("") != "") {
                deptListHtml = "<ul>" + html.join("") + "</ul>";
            }
            
            $("#departList").html(deptListHtml);
        }
        else {
            if (html.join("") != "") {
                if (index == 1) {
                    deptListHtml = "<ul id='ul_" + type + "_" + 0 + "'>" + html.join("") + "</ul>";
                }
                else {
                    deptListHtml = "<ul id='ul_" + type + "_" + id + "'>" + html.join("") + "</ul>";
                }
                
            }
            
            if (index == 1) {
                //插入子部门
                jQuery("#li_" + type + "_" + 0).append(deptListHtml);
            }
            else {
                //插入子部门
                jQuery("#li_" + type + "_" + id).append(deptListHtml);
            }
            
        }
        
        
        
    },
    
    /**
     * 得到联系组的组织结构
     */
    getUserLinkManGroup: function(id){
        Addr.Ajax("addr:listGroup", {
            groupFlag: 0
        }, function(data){
            var dept = new department();
            var deptHTML = dept.getUserLinkMan(data["var"].group);
            $("#" + id).html(deptHTML);
            Addr.showGroupColor();
        });
    },
    /**
     * AJAX请求通用方法
     * @param {Object} func
     * @param {Object} data
     * @param {Object} callback
     */
    Ajax: function(func, data, callback, failcallback,url){
		var url = url || "/addr/user"; 
        parent.MM.doService({
            url: url,
            func: func,
            data: data,
            failCall: failcallback,
            call: callback,
            param: ""
        });
    },
    
    
    
    /**
     *鼠标移出行
     */
    mouseout: function(p){
    
        if ($(p).attr("class") != "checkColor") {
        
            $(p).removeClass();
        }
        
    },
    
    /**
     *鼠标移入行
     */
    mouseover: function(p){
    
        if ($(p).attr("class") != "checkColor") {
            $(p).addClass("overColor");
        }
        
    },
    
    
    
    /**
     * 获取当前用户ID
     */
    getSingleId: function(){
        return parent.GC.getUrlParamValue(window.location.href, "uid");
    },
    
    /**
     * 获取当前操作类型
     */
    getOp: function(){
        return GC.getUrlParamValue(window.location.href, "op");
    },
    /**
     * 获取url参数
     */
    getUrlVal: function(s){
        return GC.getUrlParamValue(window.location.href, s);
    },
    /**
     * 获取选择联系人的ID组
     */
    getUserId: function(){
        var userId = "";
        $("input:checkbox[name=addrcheckbox]:checked").each(function(){
            userId += $(this).val() + ",";
            
        });
        var reg = /,$/gi;
        userId = userId.replace(reg, "");
        
        return userId;
        
    },
    
    
    /**
     * 获取当前的通讯录类型
     */
    getType: function(){
      
        return this.type;
    },
    /**
     * 弹窗窗口
     * @param {Object} obj 当前的tr
     * @param {Object} isOver 颜色
     */
    showHtml: function(id, title, url, w, h){
        var ao = {
            id: id,
            title: title,
            url: url,
            
            width: w,
            height: h,
            scoll: "no",
            buttons: [],
            zindex: 1800
        
        };
        
        parent.CC.showHtml(ao);
    },
    /**
     * 得到url参数
     * @param {Object} name
     */
    getQueryString: function(name){
        // 如果链接没有参数，或者链接中不存在我们要获取的参数，直接返回空
        var source = location.href;
        var reg = new RegExp("(^|&|\\?|\\s)" + name + "\\s*=\\s*([^&]*?)(\\s|&|$)", "i");
        if (reg.test(source)) 
            return RegExp.$2.replace(/[\x0f]/g, ";");
        return "";
        
    },
    
    
    /**
     * 编辑分组
     * @param {Object}  id 分组id
     */
    editGroup: function(id, groupName){
        this.userId = id;
        this.groupName = groupName;
       // alert(groupName.encodeHTML());
        Addr.showHtml("editGroup", Lang.group_Update, "../addr/updategroup.do?sid=" + Addr.getQueryString("sid"), "380", "130");
    },
    
    getGroupName: function(){
        return Addr.groupName;
    },
    
    reloadIndex: function(){
        location.reload();
    },
    
    /**
     * 删除分组
     * @param {Object}  id 分组id
     */
    deleteGroup: function(id){
        var id = parseInt(id);
        function callBack(data){
            if (data.code == "S_OK") {
                Addr.op = "deleteGroup";
                Addr.count = -1;
                Addr.groupId = 0;
                Addr.getUserLinkManGroup("linkmanGroup");
                Addr.loadList(0);
                top.CC.showMsg(Lang.delGroupSuc, true, false, "option");
            }
        };
        
        parent.CC.confirm(Lang.index_sureDelGroup + "<p class='msgDialog tips-default-color'>" + Lang.notRemove + "</p>", function(){
            var data = {
                groupId: id,
                groupName: ""
            };
            Addr.Ajax("addr:deleteGroup", data, callBack);
            
            
        }, Lang.cardsend_systemTip, null, 'delUsers');
        
    },
    
    /**
     * 复制到 组
     * @param {int}  type 通讯录类型
     */
    copyTo: function(type){
    
        Addr.type = type;
        var userId = Addr.getUserId();
        
        if (userId.replace(/\s/g, "") == "") {
            parent.CC.alert(Lang.selectCopyContact);
        }
        else {
            Addr.showHtml("copyTo", Lang.copyTo_group, "../addr/copytogroup.do?sid=" + Addr.getQueryString("sid") + "&curGroup=" + Addr.curGroup, "380", "244");
            
        }
        
        
    },
    
    /**
     * 移动到组
     */
    moveTo: function(){
    
    
        var userId = Addr.getUserId();
        
        if (userId.replace(/\s/g, "") == "") {
            parent.CC.alert(Lang.selectMoveContact);
        }
        else {
        
            Addr.showHtml("moveTo", Lang.moveTo_group, "../addr/movetogroup.do?sid=" + Addr.getQueryString("sid") + "&curGroup=" + Addr.curGroup, "380", "244")
            
        }
        
    },
    /**
     * 组名重复
     * @param {string} s 当前组名
     */
    groupRepeate: function(s){
    
        $("#linkmanGroup ul li").each(function(){
            if ($(this).text.trim() == s) {
                return true;
            }
        });
        return false;
        
    },
    
    /**
     * 全选复选框
     * @param {Object} p 发生选择事件的对象
     */
    checkAll: function(p, type){
    
    
        if ($(p).attr("checked") == "checked") {
            if (type == 0) {
                $("#newsletterTable > tbody :checkbox").each(function(){
                    $(this).attr("checked", true);
                    $(this).parent().parent().removeClass();
                    $(this).parent().parent().addClass("checkColor");
                });
            }
            else {
            
                $("#newsletterTable > tbody :checkbox").each(function(){
                    $(this).attr("checked", true);
                    $(this).parent().parent().removeClass();
                    $(this).parent().parent().addClass("checkColor");
                })
            }
        }
        else {
            if (type == 0) {
                $("#newsletterTable > tbody :checkbox").each(function(){
                    $(this).attr("checked", false);
                    $(this).parent().parent().removeClass("checkColor");
                });
            }
            else {
            
                $("#newsletterTable > tbody :checkbox").each(function(){
                    $(this).attr("checked", false);
                    $(this).parent().parent().removeClass("checkColor");
                });
            }
        }
        
    },
    /**
     * 得到部门的组织结构
     */
    getDeptList: function(){
        Addr.Ajax("addr:getDepTree", {}, function(data){
            var dept = new department();
			//得到部门结构
            var deptHTML = dept.getDepartHTML(data["var"]);
			//赋值部门的列表数据
            Addr.departData = data["var"];
			//更新树结构
            $("#departList").html(deptHTML);
        });
    },
    /**
     * 得到一个错误提示的小div
     * @param {Object} tipId div的id
     * @param {Object} textId 提示内容会发生改变时，可以根据这个id给提示框赋值
     * @param {Object} text 具体的提示内容
     * @param {Object} top 相对父级上边距
     * @param {Object} left 相对父级左边距
     */
    getFalseTip: function(tipId, text, textId){
        var html = [];
        
        html.push("<div id='" + tipId + "' class='tips write-tips'  ");
        html.push("style='display:none; color:black; margin-top:-2px; margin-left:8px; padding-top: 3px;padding-bottom:3px; z-index:7;'>");
        html.push("<div id='" + textId + "' class=\"tips-text\" >" + text);
        html.push("</div>");
        html.push("<div class=\"tipsLeft diamond\"></div>");
        html.push("</div>");
        
        return html.join("");
    },
    /**
     * 禁止用户输入可能引起程序错误的特殊字符
     */
    ValidateSpecialCharacter: function(){
        var code;
        if (document.all) { //判断是否是IE浏览器 
            code = window.event.keyCode;
        }
        else {
            code = arguments.callee.caller.arguments[0].which;
        }
        var character = String.fromCharCode(code);
        var txt = new RegExp("[\\`,\\%,\\&,\\\\,\\/,\\<,\\>,\\'',\"]");
        //特殊字符正则表达式 
        if (txt.test(character)) {
            if (document.all) {
                window.event.returnValue = false;
            }
            else {
                arguments.callee.caller.arguments[0].preventDefault();
            }
        }
    },
    /**
     * 替换特殊字符\ / % 为空
     */
    emptySpecial: function(s){
    
        var txt = new RegExp("[\\\\\\/\%]", "g");
        if (s.search(txt) != -1) {
            s = s.replace(txt, "");
        }
        return s;
        
    },
    
     /**
     * 新建联系组
     */
    createGroup: function(){
        Addr.showHtml("createGroup", Lang.group_NewAdd, "../addr/addgroup.do?sid=" + Addr.getQueryString("sid"), "380", "130")
    },
	
	
    /**
     * 删除联系人
     */
    deleteContactList: function(){
    
        var p = Addr;
        var ids = [];
        var data = {};
        p.op = "deleteContacts";
        //删除联系人，总数必定改变，所有联系人重置为-1，后台会重新计算
        p.count = -1;
        p.pageNo = 0;
        $("input:checkbox[name=addrcheckbox]:checked").each(function(){
            ids.push(parseInt($(this).val()));
            
        });
        
        data = {
            id: ids,
            del: 1 //[0:删除关系; 1:彻底删除]
            //gid : p.groupId
        };
        if (ids.length == 0) {
            parent.CC.alert(Lang.selectDelContact);
        }
        else {
            //如果没有选组，提示是否在所有组删除联系人  
            if (p.curGroup == "" || p.groupId == 0 || p.groupId == -1) {
                parent.CC.confirm(Lang.deleteContacts_tip +
                "<p class='msgDialog tips-default-color'>" +
                Lang.deleteInAllGroup +
                "。</p>", function(){
                    p.Ajax("addr:deleteUser", data, function(data){
                        if (data.code == "S_OK") {
                        
                            top.CC.showMsg(Lang.index_contactDelSuccess, true, false, "option");
                            // p.count = -1;
                            
                            p.loadList(0);
                            p.getUserLinkManGroup("linkmanGroup");
                            $("#checkAll").attr("checked", false);
                        }
                    });
                    //Lang.cardsend_systemTip
                }, Lang.cardsend_systemTip, null, 'delUsers');
            }
            else 
                if (p.curGroup != "") {
                    //如果选组，默认只在该组删除选中联系人；如果勾选“并在通讯录中彻底删除”，则在所有组中删除
                    parent.CC.confirm(Lang.deleteInTheGroup +
                    "<p class='msgDialog'><input id='deleteCheck' type='checkbox'/>" +
                    "<label for='deleteCheck'> " +
                    Lang.allDelete +
                    "</label></p>", function(){
                        data.gid = p.groupId;
                        if ($(window.parent.document).find("#deleteCheck").attr("checked") == "checked") {
                            data.del = 1;
                        }
                        else {
                            data.del = 0;
                        }
                        p.Ajax("addr:deleteUser", data, function(data){
                            if (data.code == "S_OK") {
                            
                                top.CC.showMsg(Lang.index_contactDelSuccess, true, false, "option");
                                // p.count = -1;	
                                p.loadList(0);
                                p.getUserLinkManGroup("linkmanGroup");
                                $("#checkAll").attr("checked", false);
                            }
                        });
                    //Lang.cardsend_systemTip
                    }, Lang.cardsend_systemTip, null, 'delUsers');
                }
        }
    }
}






