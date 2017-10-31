 
 
 
 
 $(document).ready(function(){

       var g_name="";
     
	  $("#sendEmail").click(function(){
	  
	       var mail=$("#viewEmail").text();
		   var name = $("ul li").eq(0).find("p").text();
		   mail=name+" <"+mail+">";
		   mail = encodeURI(mail);
		   parent.CC.compose(mail);
	  
	  });
	  
	  $("#goBackSpan").click(function(){
									  
							
							 window.location.href=contentPath+"/se/addr/corpaddr.do?sid="+Addr.getQueryString("sid");		  
									  
									  });

			 var userId = Addr.getSingleId();
			 var pName=decodeURI(Addr.getUrlVal("pName"));
	 	     
		     var data={userId:userId,type:2,depName:pName};
			 
			
			 //$("#personImage").attr("src",userImgUrl);
			 
		
			 
			 function callBack(userlistdata){
					var name=userlistdata["var"].trueName;
					g_name=name;
					var mail=userlistdata["var"].email;
					var phone=userlistdata["var"].businessPhone;
					var mobile=userlistdata["var"].mobile;
					var fax=userlistdata["var"].fax;
					var department=userlistdata["var"].depName;
					var sex=(userlistdata["var"].userSex==0)?Lang.importTwo_M:Lang.importTwo_F;
					sex=(userlistdata["var"].userSex==2)?Lang.detailEdit_Unknown:sex
					var birthday=userlistdata["var"].birthday;
					var memo=userlistdata["var"].memo;
					
					if(birthday==null){
						birthday="";
						}
					else{
				    birthday=birthday.substring(0,birthday.lastIndexOf("-")+3);
					}
					
					//alert(userlistdata["var"].imageUrl);
					
					//var imgUrl=readyUrl+"5f7df969-fe33-41ca-9fca-0fbfc0a61193.jpg";
					var imgUrl=readyUrl+userlistdata["var"].imageUrl;
					//
					  //var imgUrl=readyUrl+"d2bdbbbf-4169-4772-b18e-74db2a3de602.jpg";
			       $("#personImage").attr("src",imgUrl)
					
					$(".catInfo_title h2").html(Lang.contactDetails+" - "+name);
					$(".catInfo_mes ul li:eq(0) p").html(name);
					$(".catInfo_mes ul li:eq(1) p").html(mail);
					$(".catInfo_mes ul li:eq(2) p").html(mobile);
					$(".catInfo_mes ul li:eq(3) p").html(phone);
					$(".catInfo_mes ul li:eq(4) p").html(fax);
					$(".catInfo_mes ul li:eq(5) p").html(department);
					
					$(".catInfo_mes ul li:eq(6) p").html(sex);
					$(".catInfo_mes ul li:eq(7) p").html(birthday);
					$(".catInfo_mes ul li:eq(8) p").html(memo);
					$(".catInfo_phone img").attr("alt",name);
				
			 }
			 
		  Addr.Ajax("addr:getUser",data,callBack,function(){
		    alert(Lang.info_viewF);  
			window.location.href=contentPath+"/se/addr/corpaddr.do?sid="+Addr.getQueryString("sid");
			 }); 
	
	 
	 
	 });