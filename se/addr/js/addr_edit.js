for (var i=0; i<x; i++) {
	
};
var AddrEdit = {
	HidStatus:function(divID,tbID){
		  window.document.getElementById("div1").style.display = "none";
		  window.document.getElementById("div2").style.display = "none";
		  window.document.getElementById("div3").style.display = "none";
		  window.document.getElementById("div4").style.display = "none";
		  window.document.getElementById(divID).style.display = "block";
		  window.document.getElementById("tb1").className="captionWhite";
		  window.document.getElementById("tb2").className= "captionWhite";
		  window.document.getElementById("tb3").className = "captionWhite";
		  window.document.getElementById("tb4").className = "captionWhite";
		  window.document.getElementById(tbID).className = "captionBlack";

	},
	
	addrSave:function(){
		
		if(parent.Util.formToObject){
			
			var firstName=document.getElementById("addrFirstName").value;
			
			if(!firstNameReg.test(firstName)){
				parent.CC.alert(errorMsg);
				return false;
			}			
			
			if(!AddrEdit.checkForm(document.getElementById("form1"))){
				return false;
			}
			
						
			var data =parent.Util.formToObject(document.getElementById("form1"));
			
			var birDay=$("#birday").val();
			var BirDay2=$("#BirDay2").val();
			var BirDay3=$("#BirDay3").val();
		    
			data.birday=birDay+"-"+BirDay2+"-"+BirDay3;
					
			var func="";
			
			if(data.addrId){
				func="addr:updateUser";				
			}else{				
				func="addr:addUser";
			}
			
			AddrEdit.Ajxa("/addr/user",func,data,function(d){
				if(d.code=="S_OK"){
							parent.CC.closeMsgBox("adduser");
							parent.CC.refreshModule('address','p'); 
							
							parent.CC.synData(null, "common_addr");

						}
						else{
							parent.CC.alert(d.summary);
						}
			});
			
		
	
		}else{
			CC.alert("no parent.Util.formToObject");						
		}
		
		return false;
		
	},
	
	quickAdd:function(mid,index){

			var firstName=document.getElementById("addrFirstName").value;
			
			if(!AddrEdit.checkForm(document.getElementById("form1"))){
				return false;
			}	
			var data =parent.Util.formToObject(document.getElementById("form1"));
			
			AddrEdit.Ajxa("/addr/user","addr:addUser",data,function(d){
				if(d.code=="S_OK"){
							parent.CC.closeMsgBox("adddetail");
							
							var objCC = parent.CC;
                			if(typeof(objCC)!="object") objCC = parent.parent.CC;
                				objCC.hideReadMailAddr(mid,index);
							
							parent.CC.synData(null, "common_addr");
													
						}
						else{
							parent.CC.alert(d.summary);
						}
			});
			
	},
    
	closeWin:function(id){		
		parent.CC.closeMsgBox(id);		
	},
	
    checkForm:function(form){
    	    if(!form){
        		return null;
        	} 
        	
        	for (var i = 0; i < form.elements.length; i++){
        		var ele = form.elements[i];
        		var type = ele.type;
        		
        		var valid=$(ele).attr("valid");
        		
        		if(valid=="tel"){        			
					var val=$(ele).val();	
        			if(val!=""){
				
						if(!reg_user_phone.test(val)){
							
							var msg=$(ele).siblings("label").text();
							parent.CC.alert(msg+telErrorMsg,function(ele){$(ele).focus();});						
							return false;
						}
				
					}			
        		}else if(valid=="email"){        			
					var val=$(ele).val();	
        			if(val!=""){
				
						if(!reg_user_email.test(val)){
							var msg=$(ele).siblings("label").text();
							parent.CC.alert(msg+emailErrorMsg,function(ele){$(ele).focus();});	
							return false;
						}
				
					}			
        		}       		
        		
        		if(type=='text'||type=="textarea"){
        			var len=20;
        			if(ele.attributes["len"]){
        				len=parseInt(ele.getAttribute("len"));
        			}
        			var clen=ele.value.length;
        			
        			if(clen>len){
        				
        				var msg=$(ele).siblings("label").text();
        				parent.CC.alert(msg+"长度超过了系统限制",function(ele){$(ele).focus();});	      				
        				return false;
        			}
        		}
        		
            }
            
            return true; 	  	
    },
    Ajxa:function(url,func,data,callback){
		parent.MM.doService({
				   url:url,
				   func:func,
				   data:data,
				   failCall:function(d){
				   	  if(data.summary)
				   		parent.CC.alert(data.summary);			   	
				   },
				   call:callback,
				   param:""		   
				});
	}
    
	
};

