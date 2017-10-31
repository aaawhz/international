/**
 *  新手向导
 * 
 * 实例化
 * var noviceWizard = new NoviceWizard({
 *		});
 *		
 */ 
 
 function NoviceWizard(){
	//用init方法 初始化控件的基本属性
	this.init.apply(this,arguments);
};

NoviceWizard.prototype = {
	init: function () {
		this.initWizard();
		this.registerEvent();
	},
	initWizard: function () {
		var This = this;
		This.nextStep(1);
	},
	registerEvent:function () {
		
	},
	nextStep: function (step) {
		
		var This = this;
		var res = gMain.resourceRoot;
		if (This.objWizardContainer) {
			This.objWizardContainer.innerHTML = "";
		}
		
		for(var i = 0; i < 4; i++) {
			if (i == step - 1) {
				
				var objWizardContainer = parent.El.createElement("div", "", "");
				var tempHtml = "";
				var divBackDrop = parent.El.createElement("div", "", "backdrop");
				//parent.El.setStyle(divBackDrop, {height:document.body.offsetHeight+"px"});

				objWizardContainer.appendChild(divBackDrop);
				objWizardContainer.onclick = function (e) {
					if (step == 4) {
							var stepPannel = document.getElementById("account_panel");
							if (stepPannel) {
								stepPannel.style.display = "block";
								stepPannel.onmouseout=function() {
									stepPannel.style.display= "block";
								}
							}
						parent.EV.stopEvent(e);
					}
				}
				var img = parent.El.createElement("img", "", "");
				
				
				//改变图片位置
				if (step == 1) {
					parent.El.setStyle(img, {position: "absolute",top:"115px",left:"5px","zIndex":20200});
					parent.El.setAttr(img, {width: 190,height: 32,alt: "",src: res+"/images/guaid/wm.jpg"});
				} else if (step == 2) {
					//打开我的办公
					var fileTemp = jQuery('#boxWorkOrder i').click();
					var arrayPosition = El.pos(jQuery("#diskTemp a")[0]);
					if (!arrayPosition) {
						This.nextStep(3);
						return;
						arrayPosition = [0,596];
					}
					parent.El.setStyle(img, {position: "absolute",top: arrayPosition[1] + "px",left:(arrayPosition[0]-8)+"px","zIndex":20200});
					parent.El.setAttr(img, {width: 87,height: 28,alt: "",src: res+"/images/guaid/state.jpg"});
				} else if (step == 3) {
					parent.El.setStyle(img, {position: "absolute",top:"0px",left:"88px","zIndex":20200});
					parent.El.setAttr(img, {width: 236,height: 30,alt: "",src: res+"/images/guaid/toplinks.jpg"});
				} else if (step == 4) {
					window.setTimeout(function(){
						var stepPannel = document.getElementById("account_panel");
						if (stepPannel) {
							stepPannel.style.display = "block";
							stepPannel.onmouseout=function(){
								stepPannel.style.display= "block";
							}
						}
				        
				    },100);
				}
				objWizardContainer.appendChild(img);
				
				//文件中转站位置
				var arrayPosition = El.pos(jQuery("#diskTemp")[0]);
				var isIe6 = false;
				if (window.ActiveXObject) {
					var ua = navigator.userAgent.toLowerCase();
					var ie=ua.match(/msie ([\d.]+)/)[1];
					if(ie==6.0){
						//alert("您的浏览器版本过低，在本系统中不能达到良好的视觉效果，建议你升级到ie8以上！");
						//window.close();
						isIe6=true;
					}
				}
				//第几步图片的位置
				var divGuide;
				//alert(isIe6);
				if (step == 1) {
					divGuide = parent.El.createElement("div", "", "guaide1");
					//alert(''+res+"/images/guaid/ng1.png");
					//divGuide.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src='+res+'"/images/guaid/ng1.png", sizingMethod="scale")';
					//http://oa.se139.com/resource_think/se/images/guaid/ng1.png
					//divGuide.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="http://oa.se139.com/resource_think/se/images/guaid/ng1.png", sizingMethod="scale")';
					if(isIe6) {
						divGuide.style.filter= "filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=scale, src="+res+"/images/guaid/ng1.png,no-repeat)"
					}
					//divGuide.style.backgroundImage = "none";
					//parent.El.setStyle(divGuide, {
					//	backgroundImage: "none",  //resource_think/se/images/guaid/ng1.png
					//	"filter":'progid:DXImageTransform.Microsoft.AlphaImageLoader(src='+res+'"/images/ng1.png", sizingMethod="scale")'
					//});
				} else if (step == 2) {
					divGuide = parent.El.createElement("div", "", "guaide2");
					if(isIe6) {
						divGuide.style.filter= "filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=scale, src="+res+"/images/guaid/ng2.png,no-repeat)"
					}
					parent.El.setStyle(divGuide, {top: arrayPosition[1] - 150 + "px"});
				} else if (step == 3) {
					divGuide = parent.El.createElement("div", "", "guaide3");
					if(isIe6) {
						divGuide.style.filter= "filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=scale, src="+res+"/images/guaid/ng3.png,no-repeat)"
					}
				} else if (step == 4) {
					divGuide = parent.El.createElement("div", "", "guaide4");
					if(isIe6) {
						divGuide.style.filter= "filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=scale, src="+res+"/images/guaid/ng4.png,no-repeat)"
					}
				}
				
				var aClose = parent.El.createElement("a", "", "guaide_cls");
				//aClose.innerHTML="wewewew";
				//var divguaideCon = parent.El.createElement("div", "", "guaideCon1");
				
				
				aClose.onclick = function (e) {
					This.closeWizard();
					parent.EV.stopEvent(e);
				}
				var divContainter;// = parent.El.createElement("div", "", "guaideWrap1");
				//"关闭"按钮的位置
				if (step == 1) {
					////divguaideCon = parent.El.createElement("div", "", "guaideCon1");
					divContainter = parent.El.createElement("div", "", "guaideWrap1");
					
					parent.El.setStyle(aClose, {right: "8px",top: "29px"});
				} else if(step == 2) {
					divContainter = parent.El.createElement("div", "", "guaideWrap2");
					parent.El.setStyle(divContainter, {top: arrayPosition[1] - 163 + "px"});//147
					parent.El.setStyle(aClose, {right: "3px",top: "21px"});
					////divguaideCon = parent.El.createElement("div", "", "guaideCon2");
					//parent.El.setStyle(divguaideCon, {right: "11px",top: "22px"});
				} else if (step == 3) {
					divContainter = parent.El.createElement("div", "", "guaideWrap3");
					parent.El.setStyle(aClose, {top: "85px",right: "-3px"});
					//parent.El.setStyle(aClose, {right: "8px",top: "29px"});
					////divguaideCon = parent.El.createElement("div", "", "guaideCon3");
					//parent.El.setStyle(divguaideCon, {right: "21px",top: "82px"});
				} else if (step == 4) {
					divContainter = parent.El.createElement("div", "", "guaideWrap4");
					parent.El.setStyle(aClose, {right: "15px",top: "86px"});
					////divguaideCon = parent.El.createElement("div", "", "guaideCon4");
					//parent.El.setStyle(divguaideCon, {right: "41px",top: "82px"});
				}
				
				aClose.href = "javascript:;";
				/*
				divguaideCon.appendChild(aClose);
				divguaideCon.onclick = function (e) {
					This.closeWizard();
					parent.EV.stopEvent(e);
				}
				*/
				
				
				
				
				//var divContainter = parent.El.createElement("div", "", "guaideWrap1");
				divContainter.appendChild(divGuide);
				divContainter.appendChild(aClose);

				var aNextBtn = parent.El.createElement("a", "", "guaide_btn");
				aNextBtn.href = "javascript:;";
				aNextBtn.onclick = function (e) {
					This.nextStep(step+1);
					parent.EV.stopEvent(e);
				}
				//改变"下一步"按钮的位置
				if (step == 1) {
					parent.El.setStyle(aNextBtn, {left: "213px",top: "140px"});
				} else if (step == 2) {
					parent.El.setStyle(aNextBtn, {left: "217px",top: "133px"});
				} else if (step == 3) {
					parent.El.setStyle(aNextBtn, {left: "213px",top: "202px"});
				} else if (step == 4) {
					parent.El.setStyle(aNextBtn, {left: "164px",top: "205px"});
				}
				divContainter.appendChild(aNextBtn);
				objWizardContainer.appendChild(divContainter);
				
				parent.El.setStyle(objWizardContainer, {zoom: "1"});
				parent.El.insertElement(document.body, objWizardContainer, "beforeEnd");
				This.objWizardContainer = objWizardContainer;
			}
		}
		if (step == 5) {
			var ao = {
				id:"NoviceWizardSetp5",
				dragStyle:1,
				title:"温馨提示",
				text:"<div style='color: rgb(188, 188, 188);padding: 10px 20px 0;'>用于密码找回、重置密码</div><div style='padding: 10px 20px;'>为了您的账号安全，建议您绑定手机或设置密保问题</div>",
				scoll:"auto",
				buttons:[{
					text:"绑定手机",
					clickEvent:function(){top.location.href=parent.gMain.webPath+'/se/account/accountindex.do?sid='+parent.gMain.sid+'&mode=Mobile';},
					isCancelBtn:false
				},{
					text:"密保问题",
					clickEvent:function(){top.location.href=parent.gMain.webPath+'/se/account/accountindex.do?sid='+parent.gMain.sid+'&mode=PassSec';},
					isCancelBtn:false
				}],
				sysCloseEvent:true
			};
			CC.msgBox(ao);
			This.hideAccountPanel();
		}
	},
	hideAccountPanel: function () {
		var stepPannel = document.getElementById("account_panel");
		if (stepPannel) {
			stepPannel.style.display= "none";
		}
	},
	closeWizard: function () {
		this.objWizardContainer.innerHTML = "";
		this.hideAccountPanel();
	},
	show: function () {
		
	},
	hide: function () {
		
	}
	
}