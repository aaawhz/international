


    /**
     * 包含以下特殊字符不让输入 \"/'% (此方法暂时停用)
     */
	function ValidateSpecialCharacter() { 
	   var code; 
	   if (document.all) { 
		code = window.event.keyCode; 
	   } else { 
		code = arguments.callee.caller.arguments[0].which; 
	   } 
	   var character = String.fromCharCode(code); 
	   var txt=new RegExp("[\\%\"\\\\\\/\']"); 
	
	   if (false) { 
		if (document.all) { 
		 window.event.returnValue = false; 
		} else { 
		 arguments.callee.caller.arguments[0].preventDefault(); 
		} 
	   } 
	} 
	/*

	//非通讯录页面    调用     通讯录接口   要兼容云通讯录，作为标准版
	function Ajax(func, data, callback, failcallback){
        parent.MM.doService({
            url: parent.gConst.addrApiUrl,     //"/addr/user",
            func: func,
            data: data,
            failCall: failcallback,
            call: callback,
            param: ""
        });
    }
*/
	
	/**
	 * 得到一个错误提示的小div
	 * @param {Object} tipId div的id
	 * @param {Object} textId 提示内容会发生改变时，可以根据这个id给提示框赋值
	 * @param {Object} text 具体的提示内容
	 * @param {Object} top 相对父级上边距
	 * @param {Object} left 相对父级左边距
	 */
	var getFalseTip = function(tipId,text,textId){
		var html = [];
		html.push("<div id='"+tipId+"' class='tips write-tips'  ");
		html.push("style='display:none; color:black; margin-top:-2px; margin-left:8px; padding-top: 3px;padding-bottom:3px; z-index:7;'>");
		html.push("<div id='"+textId+"' class=\"tips-text\" >"+text);       
		html.push("</div>");
		html.push("<div class=\"tipsLeft diamond\"></div>");
		html.push("</div>");
		
		return html.join("");
	};
    
	/**
	 * 加载错误提示框
	 */
	var loadFalseTips = function(){
		$("#textfield1").after(getFalseTip("nameTip",Lang.contactNotEmpty,"nameTipText"));
		$("#textfield2").after(getFalseTip("emailTip",Lang.mailBoxFError,"emailTipText"));
		$("#textfield3").after(getFalseTip("telTip",Lang.onlyDigital));
		$("#textfield4").after(getFalseTip("phoneTip",Lang.telOnlyDigital));
		$("#textfield11").after(getFalseTip("bEmailTip",Lang.bMailFError));
		$("#textfield12").after(getFalseTip("bTelTip",Lang.onlyDigital));
		$("#textfield13").after(getFalseTip("bPhoneTip",Lang.telOnlyDigital));
		$("#textfield14").after(getFalseTip("bFaxTip",Lang.faxOnlyDigital));  
		
		//新建分组错误提示
		$("#addNewGroupDiv").append(getFalseTip("addGroupTip",Lang.quotationMarks));  
		
		$("#addNewGroupText").blur(function(){
			$("#addGroupTip").hide();
		});
	}
	/**
	 * 基本信息隐藏与显示功能
	 */
	var baseClick = function(){
		var $icon = $("#baseInfo i");
		 $("#baseInfo").click(function(){
		   if( $("#baseInfoUL").is(":visible")){
			   $icon.removeClass().addClass("i-sli");
			   correctIconPosition_InIe6($icon,-72);
			   $("#baseInfoUL").hide();
		   }
		   else{
			   $icon.removeClass().addClass("i_senior_sli");
			   correctIconPosition_InIe6($icon,-80);
			   $("#baseInfoUL").show();
		   }
		});
	};
	
	var correctIconPosition_InIe6 = function($obj,n){
		if($.browser.version == "6.0"){   //如果当前的浏览器是ie浏览器
			$obj.css({backgroundPositionY:n+"px"});

		}
	
	};
	/**
	 * 个人信息信息隐藏与显示功能
	 */
	var personalClick = function(){
		var $icon = $("#personalInfo i");
		
		$("#personalInfo").click(function(){
		   if( $("#personalInfoUL").is(":visible")){
			   $icon.removeClass().addClass("i-sli");
			    correctIconPosition_InIe6($icon,-72);
			   $("#personalInfoUL").hide();
		   }
		   else{
			   $icon.removeClass().addClass("i_senior_sli");
			   correctIconPosition_InIe6($icon,-80);
			   $("#personalInfoUL").show();
		   }
		});
	};
	
	/**
	 * 商务信息信息隐藏与显示功能
	 */
	var businessClick = function(){
		$("#businessInfo").click(function(){
		   if( $("#businessInfoUL").is(":visible")){
			   $("#businessInfo i").removeClass().addClass("i-sli");
			   $("#businessInfoUL").hide();
		   }
		   else{
			   $("#businessInfo i").removeClass().addClass("i_senior_sli");
			   $("#businessInfoUL").show();
			  
		   }
		});
	};
	
	function addNewGroup() {
		$("#addNewGroupHlink").hide();
		$("#addNewGroupDiv").show();
		$("#addNewGroupText").focus();
	}

	function addNewGroupCancel() {
		$("#addNewGroupHlink").show();
		$("#addNewGroupDiv").hide();
	}
	
	var showHide = function(){		   
	    //隐藏与显示
	    $("#showHide").click(function(){
		   if($("#personDetail").is(":visible")){
		     $("#personDetail").hide();
		   }
		   else{
		     $("#personDetail").show();
		   } 
		});	   
	};
	
	/**
	 * 给生日下拉框赋值
	 */
	var setBirthday = function(){
			if(birday!=null)
				{
					//
					var year=birday.substr(0,4);
					var month=toSingle(birday.substr(5,2));
					var date=toSingle(birday.substr(8,2));
					
				   //
				   jQuery.fn.setSelectedText = function(text)     
					{     
						  
						var count = this.size();    
						
						for(var i=0;i<count;i++)     
						{     
						   if($(this).get(i).text == text)     
							{     
								$(this).get(i).selected = true;     
								   
								break;     
						   }     
						}   
					}	

					//
					$("#yyyy option").setSelectedText(year);
					YYYYMM(year);
						
					$("#mm option").setSelectedText(month);
					MMDD(month);
					
					$("#dd option").setSelectedText(date);								
				}  
	};
	
	/**
	 * 根据ID选中组
	 */
	var checkGroup = function(groupIds){
		//这里要先加载组列表，而列表是一个AJAX请求，获取数据也是一个AJAX请求，所以用了延时
		setTimeout(function()
		{
			 for(var i=0;i< groupIds.length; i++)
			 {
				  $("#"+groupIds[i]).attr("checked",true);
			 }
		 },1000)
	};
	
	var hideOther = function(){
		$("#showHide").hide();
		$("#memoShow").hide();
		//$("#baseInfoHide").hide();
		$("#mailAddContactHide").hide();
		$("#mailAddContactShow").show();
		$("#addContactInfoHide").hide();
		$("#detailAdd_TelHide").hide().css({"height":"0","fontSize":"0"});
	}
	
	/**
	 * 在收件人页面添加联系人
	 */
	var addSimpleContact = function(){
		//隐藏其他项
		hideOther();
		
		//给姓名、邮箱栏 赋值
		$("#textfield1").attr("value",uName);
		$("#textfield2").val(uMail);
		$("#lxrzl h2").html(Lang.contactDetails+"   -  "+Lang.create);
		//取消则关闭弹出框
		$("#cancel").click(function(){
			 parent.CC.closeMsgBox("adddetail");
	    });		
	};
	
	/**
	 * 在通讯录页面添加联系人
	 */
	var addContact = function(){
		//获取空图片路径，并赋值给页面
		var userImgUrl=readyUrl+""
		$("#preViewAvatar").attr("src",userImgUrl);
		
		//默认性别为保密
	    $("input[name=rd]:eq(2)").attr("checked",'checked'); 
	
	    //点击取消则返回首页
		$("#cancel").click(function(){
		    window.location.href=contentPath+"/se/addr/index.do?sid="+Addr.getQueryString("sid");
			return false;
		});
		
		
       
      
        //个人信息的显示与隐藏
		personalClick();

		//商务信息的显示与隐藏
		businessClick();
		//initDate();
		//页面顶部显示为“联系人详细信息-新建”
        $("#lxrzl h2").html(Lang.contactDetails+"   -  "+Lang.create);
	};
	
	/**
	 * 写信完成页修改姓名
	 */
	var changeGMain = function(email,name){
		var recentContacts = top.LMD.RecentContactsMap[5];
   
		for(var i = 0;i<recentContacts.length;i++)
		{
			 
			if(email == recentContacts[i][3])
			{
				parent.LMD.RecentContactsMap[5][i][2]= name;
				
				return;
			} 
		}
	};
	
	/**
	 * 在通讯录页面编辑联系人
	 */
	var editContacts = function(){
		
		//页面顶部显示为“联系人详细信息-编辑”
		$("#topTitleInfo").html(Lang.contactDetails+"   -  "+Lang.index_editor);
		var usId = "";
		if (op == "edit") {
			usId=userId;
		}else{
			usId = editId;
			$("#topTitleInfo,#addContactInfoHide").hide();
			
			//在写信完成页编辑联系人，邮箱地址不能修改
            if(!flag){
                $("#textfield2").attr("disabled","true");
                $("#textfield3").removeAttr("disabled");
            }else{
                $("#textfield3").attr("disabled","true");
                $("#textfield2").removeAttr("disabled");
            }

			hideOther();
		}
		

		//编辑
		var dataLi={addrId:parseInt(usId),type:0}	
		 
		//initDate();	
		
		 //个人信息的显示与隐藏
		personalClick();

		//商务信息的显示与隐藏
		businessClick();		
		
		//请求用户资料成功后 函数
		function call(data){
			if (data == "" || typeof data == "undefined") {
				return;
			}
			
			if(data["var"] == "" || typeof data["var"] == "undefined"){
				return;
			}
			
			var data_var = data["var"];
			
			userImgUrl=readyUrl+data_var.image;//获取图片的url 
			$("#preViewAvatar").attr("src",userImgUrl);
			
			if (typeof data_var.businessPhone != "undefined") {
				var businessPhone=data_var.businessPhone;
			}
			
			if (typeof data_var.businessFax != "undefined") {
				var businessFax=data_var.businessFax;
			}
			
			if (typeof data_var.groupIds != "undefined") {
				var groupIds=data_var.groupIds;//获取当前联系人所在组的ID
			}
		    
		    
			//如果当前联系人已有所属组，则先把这些组选中
			if(groupIds.length>0)
			{				
				checkGroup(groupIds);
			}
			createTime = data_var.createTime;

		    //给基本信息 赋值
			if (typeof data_var.addrFirstName != "undefined") {
				$("#textfield1").val(data_var.addrFirstName.decodeHTML());//姓名
			}
			
			if (typeof data_var.email != "undefined") {
				$("#textfield2").val(data_var.email.decodeHTML());		//邮箱
			}
			
			if (typeof data_var.mobilePhone != "undefined") {
				$("#textfield3").val(data_var.mobilePhone);				//手机
			}
	
			if (typeof data_var.familyPhone != "undefined") {
				$("#textfield4").val(data_var.familyPhone);				//固话
			}
			
			if (typeof data_var.memo != "undefined") {
				$("#textarea").val(data_var.memo.decodeHTML());			//备注
			}
			
				
			//2.给个人信息赋值
			if (typeof data_var.addrNickName != "undefined") {
				$("#textfield5").val(data_var.addrNickName.decodeHTML());  //别名
			}
			
			if (typeof data_var.userSex != "undefined") {
				var n=data_var.userSex;
				$("input[name=rd]:eq("+n+")").attr("checked",'checked');	//性别
			}
			
			if (typeof data_var.homeAddress != "undefined") {
				$("#textFamilyAddress").val(data_var.homeAddress.decodeHTML());//家庭地址
			}	
			
			if (typeof data_var.oicq != "undefined") {
				$("#textfield7").val(data_var.oicq.decodeHTML());		//qq
			}	
			
			if (typeof data_var.msn != "undefined") {
				$("#textfield8").val(data_var.msn.decodeHTML());		//msn
			}
			
		    if (typeof data_var.birday != "undefined") {
				var birday=data_var.birday;
				if(birday != null && birday != ""){
					$("#birthday").val(birday.substr(0,10));			//生日
				}
			}
			
							  	
		    //3给商务信息赋值
			if (typeof data_var.cpName != "undefined") {
				$("#textfield9").val(data_var.cpName.decodeHTML());		//公司名称
			}
			
			if (typeof data_var.userJob != "undefined") {
				$("#textfield10").val(data_var.userJob.decodeHTML());  	//职务
			}
			
			if (typeof data_var.businessEmail != "undefined") {
				$("#textfield11").val(data_var.businessEmail);			//商务邮箱
			}
			
			if (typeof data_var.businessMobile != "undefined") {
				$("#textfield12").val(data_var.businessMobile);			//商务手机
			}
			
			if (typeof data_var.businessPhone != "undefined") {
				$("#textfield13").val(data_var.businessPhone);			//商务电话
			}
			
			if (typeof data_var.businessFax != "undefined") {
				$("#textfield14").val(data_var.businessFax);			//商务传真
			}
			
			if (typeof data_var.cpAddress != "undefined") {
				$("#textfield15").val(data_var.cpAddress);				//公司地址
			}
			
			if (typeof data_var.cpZipCode != "undefined") {
				$("#textfield16").val(data_var.cpZipCode.decodeHTML());  //公司邮编		
			}
					
		}
		
		var getUserUrl = "",
			getUserFunc = "";
		
		/*
		 * 如果是写信完成页编辑联系人，就用 gConst的addrApiUrl
		 * 如果是在通讯录的编辑联系人，就用 "addr:getUser"
		 * 如果确定要调云通讯录的接口，需要用云通讯录的上传数据
		 * 这里和普通通讯录上传的数据一样
		 */
		if(op =="editContactInSend" && parent.CC.isRmAddr()){
			getUserUrl = parent.gConst.addrApiUrl;
			getUserFunc =  "addr:getUser";
		}else{
			getUserUrl = "/addr/user";
			getUserFunc =  "addr:getUser";
		}
				
		//获取联系人数据的AJAX请求
		Addr.Ajax(getUserFunc, dataLi, call,function(){
			parent.CC.alert(Lang.info_editF);							//失败提示
			if (op == "edit") {
				window.location.href = contentPath + "/se/addr/index.do?sid=" + Addr.getQueryString("sid");
			}			
		},getUserUrl);	
	}
	/**
	 * 隐藏所有提示
	 */
	var hideTips = function(){
		$("#nameTip,#emailTip,#telTip,#phoneTip,#bEmailTip,#bTelTip,#bPhoneTip,#bFaxTip").css("display","none");
	}
	 /**
	  * 点击保存，提交表单前先验证
	  */
	 var validateForm = function(isSub){
	 	//获取输入框电话、邮箱、姓名、传真的值
	 	var contactName = $("#textfield1").val().trim();
		var email = $("#textfield2").val().trim();
		var tel = $("#textfield3").val().trim().replace(/\-/gi,"");
		var phone =$("#textfield4").val().trim().replace(/\-/gi,"");
		var bEmail =$("#textfield11").val().trim();
		var bTel =$("#textfield12").val().trim().replace(/\-/gi,"");
		var bPhone =$("#textfield13").val().trim().replace(/\-/gi,"");
		var bFax =$("#textfield14").val().trim().replace(/\-/gi,"");
		//每次bsend为真
		bsend = true;
		
		//判断姓名是否为空，邮箱、电话、传真是否错误，如果是就终止，并提示
		if(contactName == ""){
			if(isSub){
				$("#nameTip").css("display","inline");
				//$("#textfield1").focus();
				bsend = false;
			}
			
		}else if(contactName.search(/[\"\'\%\/\\\&\;；，]/g) != -1){

			$("#nameTip").css("display","inline");
			$("#nameTipText").html(Lang.noQuotesTip+" & \\ \/， ; % \" \'");
			bsend = false;
		}
		 if(email != ""){
			if(!reg_user_email.test(email)){
				$("#emailTip").css("display","inline");
				$("#emailTipText").html(Lang.mailBoxFError);
				//$("#textfield2").focus();
			    bsend = false;
			}			
		}
		if(tel != ""){
			if(!reg_user_phone.test(tel)){
				$("#telTip").css("display","inline");
				//$("#textfield3").focus();
			    bsend = false;
			}
			
		}
		if(phone != ""){
			if(!reg_user_phone.test(phone)){
				$("#phoneTip").css("display","inline");
				//$("#textfield4").focus();
			    bsend = false;
			}
			
		}
		if(bEmail !=""){
			if(!reg_user_email.test(bEmail)){
				$("#bEmailTip").css("display","inline");
				$("#businessInfoUL").show();
				//$("#textfield11").focus();
			    bsend = false;
			}
			
		}
		if(bTel != ""){
			if(!reg_user_phone.test(bTel)){
				$("#bTelTip").css("display","inline");
				$("#businessInfoUL").show();
				//$("#textfield112").focus();
			    bsend = false;
			}
			
		}
		if(bPhone != ""){
			if(!reg_user_phone.test(bPhone)){
				$("#bPhoneTip").css("display","inline");
				$("#businessInfoUL").show();
				//$("#textfield113").focus();
			    bsend = false;
			}
			
		}
		if(bFax != ""){
			if(!reg_user_phone.test(bFax)){
				$("#bFaxTip").css("display","inline");
				$("#businessInfoUL").show();
				//$("#textfield114").focus();
			    bsend = false;
			}
			
		}
		
	 };
    
	 /**
	  * 点击保存，提交表单
	  */
     var saveAll = function (){
	 	
		validateForm(1);
		
	    if(!bsend){
			$("#businessInfoUL").show();
			return false;
		}
		//保存图片  
		var fileName=$("#fileName").val()||"";
		var fileId=$("#fileId").val()||"";
		
		//基本信息取值
		var id=0;
		var addrFirstName=$("#textfield1").val().trim();
		var addrFirstName=Addr.emptySpecial(addrFirstName).trim();
		var familyEmail=$("#textfield2").val().trim();
		var	mobilePhone=$("#textfield3").val().replace(/\-/gi,"").trim();
		var familyPhone=$("#textfield4").val().replace(/\-/gi,"").trim();
		
		var memo=$("#textarea").val().trim();
		memo=Addr.emptySpecial(memo);
		//2.个人信息取值
		var addrNickName=$("#textfield5").val().trim();
		addrNickName=Addr.emptySpecial(addrNickName).trim();
		var userSex=$('input:radio[name="rd"]:checked').val()||"";
		var homeAddress=$("#textFamilyAddress").val().trim();
		homeAddress=Addr.emptySpecial(homeAddress);
		var oicq=$("#textfield7").val().trim();
		oicq=Addr.emptySpecial(oicq);
		var msn=$("#textfield8").val().trim();
		msn=Addr.emptySpecial(msn);
		var birday="";
		var year="";
		var month="";
		var date="";
		var tDate=new Date();
		var newGroup=""; 
		  
		
		year= $("#yyyy option:selected").val();
		year=year=="40"?tDate.getFullYear():year;
		
		month=$("#mm option:selected").val();
		month=month=="40"?toDouble((tDate.getMonth()+1)):month;
		
		date=$("#dd option:selected").val();
		date=date=="40"?toDouble(tDate.getDate()):date;
		
		
		//年月日取值
		birday=$("#birthday").val()||"";
		if(birday != ""){
			birday=birday.split("-");
		    birday=birday[0]+"-"+toDouble(birday[1])+"-"+toDouble(birday[2]);
		}
		
		
		//如果 uMail不为空，说明这个操作是收件人页面添加到通讯录的，页面是没有生日输入框，所以清空birday
		if(uMail!="")
		{
		  birday="";
		}
		
		//3商务信息取值
		var cpName=$("#textfield9").val();
		cpName=Addr.emptySpecial(cpName).trim();
		var userJob=$("#textfield10").val().trim();
		userJob=Addr.emptySpecial(userJob);
		var businessEmail=$("#textfield11").val().replace(/\-/gi,"").trim();
		var businessMobile=$("#textfield12").val().replace(/\-/gi,"").trim();
		
		var businessPhone=$("#textfield13").val().replace(/\-/gi,"").trim();
		var businessFax=$("#textfield14").val().replace(/\-/gi,"").trim();
		var cpAddress=$("#textfield15").val().trim();
		cpAddress=Addr.emptySpecial(cpAddress);
		var cpZipCode=$("#textfield16").val().trim();
		cpZipCode=Addr.emptySpecial(cpZipCode);
		
		//保存成功后，回调函数 
		function callBack(data){
			if(data.code="S_OK"){
				if(uMail!="" && (op == "addContactInFrom" || op == "addContactToCc")){
					
					//收件人页面新建联系人
				    parent.CC.showMsg(Lang.createdTip,true,false,"option");	
				
					if (CCOrTo == "ccType") {
						parent.document.getElementById("ifrmReadmail_Content_readMail" + mid).contentWindow
						.document.getElementById("addCC").style.display = 'none';
						
					}
					else if(CCOrTo == "toType") {
						parent.document.getElementById("ifrmReadmail_Content_readMail" + mid).contentWindow
						.document.getElementById("to_" + mid).style.display = 'none';
						
						//parent.LMD.addContact_Cache("2","-1",addrId, addrFirstName, email);
					}else{
						parent.LMD.userContancts[uMail]="y";
						parent.document.getElementById("ifrmReadmail_Content_readMail"+mid).contentWindow
						.document.getElementById("addToContact1_"+mid).style.display='none';
					}
					
					var arr = data["var"],
					    len    = 0,
						addrId = "",
						email  = "",
						cache  = parent.LMD.addContact_Cache,
						groupIdLen = groupId.length;    //用户选中的组id长度

					if(arr){
						len = arr.length;
					}
					
					for(var i=0; i<len; i++){
							addrFirstName = arr[i][0];
							addrId		  = arr[i][1];
							email		  = arr[i][2];
							
					}
					
					//把新增到通讯录的联系人放到缓存中 [没返回新增联系人的id以及联系人在哪个组]
					//选多个组id 循环，加到缓存中
					if(typeof cache == "function" && groupIdLen){
						for(var j=0; j<groupIdLen; j++){
							parent.LMD.addContact_Cache("2",groupId[i],addrId, addrFirstName, email);
						}
					}
					
					parent.CC.closeMsgBox("adddetail");
						
				}
			    else if(op=="mod" || op=="edit"){
					
					//在通讯录修改联系人
					top.CC.showMsg(Lang.editTip,true,false,"option");
					window.location.href=contentPath+"/se/addr/index.do?sid="+Addr.getQueryString("sid");
			    }
			
				else if(op=="editContactInSend" ){
					
					//在写信完成页修改联系人
					top.CC.showMsg(Lang.editTip,true,false,"option");
					
					
					//改变页面GMian的联系人姓名
					if(uName != addrFirstName  && op =="editContactInSend"){
						changeGMain(familyEmail,addrFirstName);
					}
	
					//$(window.top.document).find("#item_"+editId).find("font").text(addrFirstName);
					var oFrame = parent.document.getElementById(parent.gConst.ifrm + parent.GE.tab.curid);
					
					if(oFrame && op=="editContactInSend"){
						var oSpan = oFrame.contentWindow
						.document.getElementById("item_"+editId).getElementsByTagName("span");
						
						if(oSpan[0]){
							oSpan[0].innerHTML = addrFirstName;
						}
					}
					parent.CC.closeMsgBox("adddetail");
				}
				else if(data.code="S_OK"){
					
					//在通讯录新建联系人
					top.CC.showMsg(Lang.createdTip,true,false,"option");
					//window.location.href=contentPath+"/se/addr/index.do?sid="+Addr.getQueryString("sid");	
				}
			}
			 
		}
      
	    
		var groupId=[];			//用户选中的组ID,以数字提交
		var opration = "";		//上传的操作
		$("input:checkbox[name=checkbox]:checked").each(function(){ 
			groupId.push(parseInt($(this).attr("id"))); 
		})
	    
		//在通讯录修改联系人，修改为mod 进行提交
		if(op=="edit" || op=="mod" ){
			opration="mod";
			id=userId;			//url传过来的id
		}
		//在写信完成页修改联系人，修改为mod 进行提交
		else if(op=='editContactInSend'){
			opration="mod";
			id=editId;			//url传过来的id
		}
		else {
			opration="add";
			id=0;				//新建id默认为0
		}
		
		//不能输入 \ % /
		newGroup=Addr.emptySpecial(newGroup);
		
		var data = "";
		var addFunc = "";
		
		/*
		 * data 需要修改，因为云通讯录添加联系人和 批量添加联系人用的是同一个接口
		 * 而通讯录中添加联系人 和 批量添加联系人的接口是分开的  [addr:save 批量添加    addr:addUser 添加单个联系人]
		 * 这里还需要判断  && RM  否则走下面的接口
		 *  parent.CC.isRmAddr() 是来判断是否要上传云通讯录特定的数据，否则上传普通数据
		 */
		
		//在读信页 增加联系人[addContactInFrom 添加一个发件人 addContactToCc添加收件人或者抄送人 ] 
		//而且是调用云通讯录接口
		if ((op == "addContactInFrom" || op == "addContactToCc")&& parent.CC.isRmAddr()) { 
			data = {
				"groupIds": groupId,
				"from": "",
				"list": [{
					//"createTime":createTimeMail,
					//"index":"0",
					"name": addrFirstName,
					"mobile": mobilePhone,
					"email": familyEmail.trim()
				}]
			};
			
			addFunc = "addr:save";
			
		}
		else //在写信完成页 增加联系人[editContactInSend 修改一个联系人 ]
			if (op == "editContactInSend" && parent.CC.isRmAddr()) {
				
				
				/*
				 * 【编辑联系人】走RM的云通讯录的接口  上传的数据 和 调用不同通讯录的接口上传数据不一样
				 * 这里要分开
				 */
			
				data = {
					"addrFirstName":addrFirstName,
					"addrId":editId,
					"email":familyEmail.trim(),
					"groupIds":groupId,
				    "mobilePhone":mobilePhone
				};
				addFunc = "addr:updateUser";
				
				
				
			}
			else {
				//在读信页新增联系人  、在写信完成页 编辑联系人、在通讯录新建、编辑联系人
				//调用普通通讯录接口 提交 的数据
				data = {
					op: opration, //在通讯录增加 或者 修改联系人 的提交数据
					addrId: parseInt(id),
					fileName: fileName,
					fileId: fileId,
					groupIds: groupId,
					groupName: newGroup.trim(),
					addrFirstName: addrFirstName,
					email: familyEmail.trim(),
					mobilePhone: mobilePhone,
					familyPhone: familyPhone,
					memo: memo,
					addrNickName: addrNickName,
					userSex: userSex,
					homeAddress: homeAddress,
					oicq: oicq,
					msn: msn,
					birday: birday,
					cpName: cpName,
					userJob: userJob,
					businessEmail: businessEmail.trim(),
					businessMobile: businessMobile,
					businessPhone: businessPhone,
					businessFax: businessFax,
					cpAddress: cpAddress,
					cpZipCode: cpZipCode,
					createTime: createTimeMail == "" ? createTime : createTimeMail
				
				};//最终数据组装
				addFunc = "addr:addUser";
			}
		
			
			if(op=="editContact"){
				data.updateRecent="UPDATE";
			}
				
			/*
			 *  AJAX请求 [ 修改 | 新增 联系人]
			 */	
			if(opration == "mod"){
				var addUrl = "";
				
				//如果是写信完成页修改联系人，调用兼容的接口
				if (op == "editContactInSend") {
					addUrl = parent.gConst.addrApiUrl;
				}else{
					addUrl = "/addr/user";
				}
				
				Addr.Ajax("addr:updateUser", data,callBack,function(ao){
					if(ao.code == "EMAIL_NAME_REPEAT"){
						
						$("#emailTip").css("display","inline");
						$("#emailTipText").html(Lang.mailExits);
					}else if(ao.result[0] =="4504907"){
						parent.CC.alert("您的个人通讯录中联系人数已达到系统上限，不能再继续添加");
					}
					else{
						if(ao && ao.summary){
							parent.CC.alert(ao.summary);
						}else{
							parent.CC.alert("修改联系人失败");
						}
						
					}																															
				},addUrl);	
			}
			else
			{
				var addUrl = "";
				
				//如果是读信页添加联系人，先判断【是否接云通讯录接口】，否则在通讯录添加联系人 用调用内部接口
				if (op == "addContactInFrom" || op == "addContactToCc" || op == "editContactInSend") {
					addUrl = parent.gConst.addrApiUrl;
				}else{
					addUrl = "/addr/user";
				}
				
				Addr.Ajax(addFunc, data,callBack,function(ao){
					if(ao.code == "EMAIL_NAME_REPEAT"){
						
						$("#emailTip").css("display","inline");
						$("#emailTipText").html(Lang.mailExits);
						}else if(ao.result[0] =="4504907"){
							parent.CC.alert("您的个人通讯录中联系人数已达到系统上限，不能再继续添加");
						}
						else{
							if(ao && ao.summary){
								parent.CC.alert(ao.summary);
							}else{
								parent.CC.alert("保存联系人失败");
							}
							
						}		
				},addUrl);	
			}				
	}
	
	

	//toDouble
	function toDouble(s){
		s=s+"";	
		if(s.length==2){
			return s;
		}
		else{
			return 0+s;
		}		
	}
	
	//toSingle
	function toSingle(s){	
		if(s.substr(0,1)=="0"){
			return s.substr(1,1);
		}
		else
		{
			return s;
		}
	}
	

	

    //获取url传过来的数据
	var op=Addr.getOp();    
	var userId=Addr.getSingleId(); 					//通讯录修改联系人的ID
	var uName=Addr.getUrlVal("name");				//写信完成页传的用户名
    var uMail=Addr.getUrlVal("mail");				//写信完成页传的地址
	var mid=Addr.getUrlVal("mid");
	var type = Addr.getUrlVal("type");   			// ["addcontacts" : 在读信页添加联系人]
	var CCOrTo=Addr.getUrlVal("CCOrTo");
	var editId=Addr.getUrlVal("editId");			//写信完成页修改联系人的ID
	var createTimeMail = "";
	createTimeMail = new Date();					//写信完成页创建联系人的时间
    var flag=Addr.getUrlVal("flag");				//发短信完成页传的flag
	var userImgUrl="";
	var bsend = true;								//是否提交数据
	uName=decodeURI(uName);
	userId=parseInt(userId);
	var createTime = "";							//编辑联系人需要上传
	var mailListGroupId = Addr.getUrlVal("mailListGroupId");
	
	//临时做一个兼容
	if (op == "editContact") {
		op = "editContactInSend";
	}
	

//页面加载完后
$(document).ready(function(){
     
	//支持enter 在新建分组输入框
	$("#addNewGroupText").bind("keydown",function(ev){
		if(parent.EV.getCharCode(ev) == 13){
			$("#addNewGroupSave")[0].click();
		}
	})
	
	//点击取消 则返回通讯录首页
	$("#cancel").click(function(){
		//window.location.href=contentPath+"/se/addr/index.do?sid="+Addr.getQueryString("sid")+"&op=mailListEdit";
		window.location.href=contentPath+"/se/addr/index.do?sid="+Addr.getQueryString("sid");	
	});

	     
	//加载验证提示框
	loadFalseTips();
	
	//当光标失去焦点的时候 验证邮箱、手机、固定电话 
	$("#textfield1,#textfield2,#textfield3,#textfield4,#textfield11,#textfield12,#textfield13,#textfield14")
	.blur(function(){
		hideTips();
		validateForm(0);
	});
	
	var $memo = $("#textarea");
	//控制备注栏只能为1000字符
	$memo.keyup(function(){
		
		var memoVal = $memo.val();
		var strVal = "";
		if(memoVal.length>1000){
			strVal = memoVal.substring(0,1000);
			$(this).val(strVal);
		}
	});
	//自适应高度
	var h = $("#ulMailFunc").css("height") + $("#ulService").css("height");
	$("#content").css({"height":h+75,"height":"auto"});
	
	var oDelImg=document.getElementById("deleteImg");
	
	//删除图片
	$("#deleteImg").click(function(){
		parent.CC.confirm(Lang.dePicTip+"?", function()
		{	
			userImgUrl=readyUrl+""
			$("#preViewAvatar").attr("src",userImgUrl);
			$("#fileName").val("");
			$("#fileId").val("");	
		}
		, Lang.cardsend_systemTip, null, 'delUsers');
	});

    /*
     * 不同页面的入口                 分别进入 新建 编辑页面  [op:editContactInSend 表示在写信完成页编辑联系人]
	 * op:edit 表示在通讯录编辑联系人
	 */
	if(op=="edit" || op == "editContactInSend"){
		//编辑联系人
		editContacts();
	}else if(op == "addInMailList"){
		//新增联系人 [通讯录]
		addContact();	
	}else{	
		//新增联系人 [写信页  读信页]
		addSimpleContact();
	}	 
		 
	var newGroup="";//上传的新组名
	//var label = Lang.group_NewAdd;//默认显示“新建组名”
	var groupId=[]; //上传的组ID
    var lData={}; //上传的数据集合
  
	//获取组列表数据成功后的回调函数    
	function callBackList(data){
		//每次先清空列表
		$("#checkListNew").empty();
		var liList = [];
		
		//循环创建组列表
		for(var i =0,len=data["var"].length; i<len; i++)
		{
			var tId = data["var"][i][0];
			tId = parseInt(tId);
			var tName = data["var"][i][1];
			if(tId!=0  && tId!=-1)
			{
				liList.push( "<li> <input type='checkbox'  name='checkbox'  id='"+tId+"'>");
				liList.push( "<label style='margin-left:4px;' for='"+tId+"'>"+tName+"</label></li>");
			}
		}
		
		//页面加载组列表
	    $("#checkListNew").html(liList.join(""));
		
		//如果通讯录组名不为空，选中改组
		if(mailListGroupId != "" && mailListGroupId != undefined && op =="addInMailList"){
			$("#"+mailListGroupId).attr("checked",true);
		}
		 
	}	
	
	var getGroupList_Url = "",
		getGroupList_func = "addr:getGroupList";
	
	/*
	 * 得到通讯录联系人分组的兼容处理
	 * [addContactInFrom	  读信页 在收件人添加一个联系人 addContactToCc	   读信页 在发件人 抄送人添加一个联系人
     * editContactInSend            写信完成页 修改联系人       batchContacts                 读信页批量添加]	
	 */
	if(op == "addContactInFrom" || op == "addContactToCc" || op =="editContactInSend")	{
		getGroupList_Url = parent.gConst.addrApiUrl;
	}else{
		getGroupList_Url = "/addr/user";
	}
	
	//获取组列表AJAX请求	
	Addr.Ajax(getGroupList_func, lData, callBackList, "",getGroupList_Url);	
	  	
	  	jQuery("#addNewGroupSave").click(function(){
		   	//获取用户输入的组名
			var newGroupText = jQuery("#addNewGroupText").val().trim();
            $("#addGroupTip").hide();
			if (newGroupText.trim() == ""){
				parent.CC.alert(Lang.inputGroupNameTip);//组名为空，提示“请输入组名”
				return false;
			}
			else if (newGroupText.trim() == Lang.all_contacts || newGroupText.trim() == Lang.ungrouped_contacts || newGroupText.trim() == Lang.ungroup ) {
				parent.CC.alert(Lang.groupName_repeat + "!");//输入“所有联系人”，提示重复
				return false;
			} else if (newGroupText.search(/["'“‘\\\/\^\<\>]/) != -1) {
				parent.CC.alert(Lang.quotationMarks);
				//$("#addGroupTip").css("display","inline");//不能输入引号
				return false;
			}
			else {
				//清空特殊字符
				newGroupText=Addr.emptySpecial(newGroupText);
				//newGroup=Addr.emptySpecial(newGroup);
			    //新建组数据
			    data={op:"add",groupId:0,groupName:newGroupText};
				//新建组成功后回调函数 
				function callBack(data)
				{
					if(data.code=="S_OK")
					{		
						top.CC.showMsg(Lang.NewGropSucTip,true,false,"option");	
						jQuery("#addGroupTip").hide();	 
						jQuery("#addNewGroupHlink").show();
						jQuery("#addNewGroupText").val("");
						jQuery("#addNewGroupDiv").hide();
						//Addr.Ajax("addr:getGroupList", lData, callBackList);
						//在组列表显示新增的组名
						var html = [];
						html.push("<li><input type='checkbox'  checked='checked' name='checkbox'  id='"+data["var"]+"'>");
						html.push("<label style='margin-left:4px;' for='"+data["var"]+"'>"+newGroupText+"</label></li>");
						jQuery("#checkListNew").append(html.join(""));						
					}
				}
				
				var batchCopy_url = "";
				
				//如果批量添加中新增组，增加提示的内容
			    if (op == "addContactInFrom" || op == "addContactToCc" || op =="editContactInSend") {
					//可能调用RM接口   这个路径是通过 gConst.addrApiUrl(这个常量) 来判断
				    batchCopy_url = parent.gConst.addrApiUrl;
				}else{
					//在通讯录新增组，一定是调用内部的接口
					batchCopy_url = "/addr/user";
				}
				 
		        //新建组的AJAX请求  注意：第五个参数才是url
				Addr.Ajax("addr:addGroup",data,callBack,function(data)
				{   

					if(data.code=="NAME_REPEAT" || data.summary == "record_repeat")
					{ 
					    parent.CC.alert(Lang.groupName_repeat + "!");
						
					}
					else 
					{
						//parent.CC.closeMsgBox('createGroup')
						parent.CC.alert(Lang.newGroup_fail);
					}				
				},batchCopy_url);			
			}
		});
/*
	
		//新建组输入框默认显示”新建组名”，灰色，光标移入变黑				 
        $('#addNewGroupText').css('color','gray').val(label)
        .focus(function(){
            if($(this).val() == label){
                $(this).val('').css('color','black');//清空输入框、字体变黑色
				//$("#newGroupCheckbox").attr("checked",true);
			}
        })
        .blur(function(){
            if($(this).val().trim() == ''){
                $(this).val(label).css('color','gray');//字体变灰色、恢复默认值
            }
        })
*/


	
	
  });
