/**
 * ContexMenu 右键菜单
 * 
 * 第一步：实例化此提示控件
 * var contexMenu = new parent.contexMenu({
                win: window,    //
                event: event,   //鼠标事件，决定邮件菜单显示的位置
                
            });
 * 
 *
 * 第二步: 调用控件显示
 * 
 *  contexMenu.show();
 *      
 */ 


function ContexMenu(){
    //用init方法 初始化控件的基本属性
    this.init.apply(this,arguments);
};

ContexMenu.prototype = {
    init: function (config) {
        this.currentMenuName = config.currentMenuName;
        //this.event = config.event;
        this.parent = config.win || window;
        //if(documentEventManager && window.document){
        //  documentEventManager.addDoc(window.document);
        //}
        this.e = config.e;
        this.passFlag = config.passFlag || false;
        this._getMenuObj();
        this._getSelectedId();
        this._changeInitCondition();
    },
    //组织右键菜单，并添加到document.body上
    _getMenuObj: function () {
        var This = this;
        //构建div容器，存放右键菜单
        var objDivContainer = parent.El.createElement("div", "", "pop_wrapper w135");
        objDivContainer.id = "ContexMenuContainer";
        This.HasEnableClick = {};
        /*
        parent.El.setStyle(objDivContainer,{
            //position: "absolute!important",
            left: "0px", 
            top: "0px", 
            opacity: "1", 
            visibility: "hide" //"visible"
        });
        */
        var objUl = parent.El.createElement("ul", "", "module_pop");
        var currentMenuName = This.currentMenuName;
        //右键菜单内容的数据，
        var arrayMenuItem = {
            "span_1":
            [
                {"liClass":"", "isLiEmpty":"false", "aClass":"", "aHref":"", "aShowValue":top.Lang.Mail.Write.dakai,"id": currentMenuName+"_"},//打开
                {"liClass":"line", "isLiEmpty":"true"},
                {"liClass":"", "isLiEmpty":"false", "aClass":"notuse", "aHref":"", "aShowValue":top.Lang.Mail.Write.chakanweidu},//查看未读
                {"liClass":"", "isLiEmpty":"false", "aClass":"notuse", "aHref":"", "aShowValue":top.Lang.Mail.Write.quanbubiaojiweiyidu},//全部标记为已读
                {"liClass":"line", "isLiEmpty":"true"},
                {"liClass":"", "isLiEmpty":"false", "aClass":"", "aHref":"", "aShowValue":top.Lang.Mail.Write.chuangjianfenjianguize}//创建分拣规则
            ],
            "span_2":
            [
                {"liClass":"", "isLiEmpty":"false", "aClass":"", "aHref":"", "aShowValue":top.Lang.Mail.Write.dakai,"id": currentMenuName+"_"}//打开
            ],
            "span_3":
            [
                {"liClass":"", "isLiEmpty":"false", "aClass":"", "aHref":"", "aShowValue":top.Lang.Mail.Write.dakai,"id": currentMenuName+"_"},//打开
                {"liClass":"line", "isLiEmpty":"true"},
                {"liClass":"", "isLiEmpty":"false", "aClass":"notuse", "aHref":"", "aShowValue":top.Lang.Mail.Write.quanbubiaojiweiyidu},//全部标记为已读
                {"liClass":"", "isLiEmpty":"false", "aClass":"", "aHref":"", "aShowValue":top.Lang.Mail.Write.chakantoudizhuangtai}//查看投递状态
            ],
            "span_4":
            [
                {"liClass":"", "isLiEmpty":"false", "aClass":"", "aHref":"", "aShowValue":top.Lang.Mail.Write.dakai,"id": currentMenuName+"_"},//打开
                {"liClass":"line", "isLiEmpty":"true"},
                {"liClass":"", "isLiEmpty":"false", "aClass":"notuse", "aHref":"", "aShowValue":top.Lang.Mail.Write.quanbubiaojiweiyidu},//全部标记为已读
                {"liClass":"", "isLiEmpty":"false", "aClass":"notuse", "aHref":"", "aShowValue":top.Lang.Mail.Write.qingkongyishanchu},//清空已删除
                {"liClass":"", "isLiEmpty":"false", "aClass":"", "aHref":"", "aShowValue":top.Lang.Mail.Write.chakanshanxinzhuangtai}//查看删信状态
            ],
            "span_5":
            [
                {"liClass":"", "isLiEmpty":"false", "aClass":"", "aHref":"", "aShowValue":top.Lang.Mail.Write.dakai,"id": currentMenuName+"_"},//打开
                {"liClass":"line", "isLiEmpty":"true"},
                {"liClass":"", "isLiEmpty":"false", "aClass":"notuse", "aHref":"", "aShowValue":top.Lang.Mail.Write.quanbubiaojiweiyidu},//全部标记为已读
                {"liClass":"", "isLiEmpty":"false", "aClass":"notuse", "aHref":"", "aShowValue":top.Lang.Mail.Write.qingkonglajiyoujian}//清空垃圾邮件
            ],
            "span_6":
            [
                {"liClass":"", "isLiEmpty":"false", "aClass":"", "aHref":"", "aShowValue":top.Lang.Mail.Write.dakai,"id": currentMenuName+"_"},//打开
                {"liClass":"line", "isLiEmpty":"true"},
                {"liClass":"", "isLiEmpty":"false", "aClass":"notuse", "aHref":"", "aShowValue":top.Lang.Mail.Write.quanbubiaojiweiyidu},//全部标记为已读
                {"liClass":"", "isLiEmpty":"false", "aClass":"notuse", "aHref":"", "aShowValue":top.Lang.Mail.Write.qingkongbingduyoujian}//清空病毒邮件
            ],
            "span_12":
            [
                {"liClass":"", "isLiEmpty":"false", "aClass":"", "aHref":"", "aShowValue":top.Lang.Mail.Write.dakai,"id": currentMenuName+"_"},//打开
                {"liClass":"line", "isLiEmpty":"true"},
                {"liClass":"", "isLiEmpty":"false", "aClass":"notuse", "aHref":"", "aShowValue":top.Lang.Mail.Write.quanbubiaojiweiyidu}//全部标记为已读
            ],
            "span_13":
            [
                {"liClass":"", "isLiEmpty":"false", "aClass":"", "aHref":"", "aShowValue":top.Lang.Mail.Write.dakai,"id": currentMenuName+"_"},//打开
                {"liClass":"line", "isLiEmpty":"true"},
                {"liClass":"", "isLiEmpty":"false", "aClass":"notuse", "aHref":"", "aShowValue":top.Lang.Mail.Write.quanbubiaojiweiyidu}//全部标记为已读
            ],
            "span_14":
            [
                {"liClass":"", "isLiEmpty":"false", "aClass":"", "aHref":"", "aShowValue":top.Lang.Mail.Write.dakai,"id": currentMenuName+"_"},//打开
                {"liClass":"line", "isLiEmpty":"true"},
                {"liClass":"", "isLiEmpty":"false", "aClass":"notuse", "aHref":"", "aShowValue":top.Lang.Mail.Write.quanbushenhetongguo},//全部审核通过
                {"liClass":"", "isLiEmpty":"false", "aClass":"notuse", "aHref":"", "aShowValue":top.Lang.Mail.Write.quanbushenhebutongguo}//全部审核不通过
            ],
            "span_-1":
            [
                {"liClass":"", "isLiEmpty":"false", "aClass":"", "aHref":"", "aShowValue":top.Lang.Mail.Write.zhankaizimulu,"id": currentMenuName+"_"},//展开子目录
                {"liClass":"line", "isLiEmpty":"true"},
                //{"liClass":"", "isLiEmpty":"false", "aClass":"notuse", "aHref":"", "aShowValue":"子目录标记为已读"},
                {"liClass":"", "isLiEmpty":"false", "aClass":"notuse", "aHref":"", "aShowValue":top.Lang.Mail.Write.xinjianyoujianjia},//新建邮件夹
                //{"liClass":"", "isLiEmpty":"false", "aClass":"notuse", "aHref":"", "aShowValue":"创建分拣规则"},
                {"liClass":"", "isLiEmpty":"false", "aClass":"notuse", "aHref":"", "aShowValue":top.Lang.Mail.Write.youjianjiaguanli}//邮件夹管理
            ],
            "span_-2":
            [
                {"liClass":"", "isLiEmpty":"false", "aClass":"", "aHref":"", "aShowValue":top.Lang.Mail.Write.zhankai,"id": currentMenuName+"_"},//展开
                {"liClass":"line", "isLiEmpty":"true"},
                //{"liClass":"", "isLiEmpty":"false", "aClass":"notuse", "aHref":"", "aShowValue":"全部标记为已读"},
                {"liClass":"", "isLiEmpty":"false", "aClass":"notuse", "aHref":"", "aShowValue":top.Lang.Mail.Write.xinjianbiaoqian},//新建标签
                //{"liClass":"", "isLiEmpty":"false", "aClass":"notuse", "aHref":"", "aShowValue":"创建分拣规则"},
                {"liClass":"", "isLiEmpty":"false", "aClass":"notuse", "aHref":"", "aShowValue":top.Lang.Mail.Write.biaoqianguanli}//标签管理
            ],
            "span_-3":
            [
                {"liClass":"", "isLiEmpty":"false", "aClass":"", "aHref":"", "aShowValue":top.Lang.Mail.Write.dakai,"id": currentMenuName+"_"},//打开
                {"liClass":"line", "isLiEmpty":"true"},
                //{"liClass":"", "isLiEmpty":"false", "aClass":"notuse", "aHref":"", "aShowValue":"全部标记为已读"},
                {"liClass":"", "isLiEmpty":"false", "aClass":"notuse", "aHref":"", "aShowValue":top.Lang.Mail.Write.xinjianyoujianjia},//新建邮件夹
                {"liClass":"", "isLiEmpty":"false", "aClass":"notuse", "aHref":"", "aShowValue":top.Lang.Mail.Write.chuangjianfenjianguize},//创建分拣规则
                {"liClass":"", "isLiEmpty":"false", "aClass":"notuse", "aHref":"", "aShowValue":top.Lang.Mail.Write.youjianjiaguanli}//邮件夹管理
            ],
            "span_-4":
            [
                {"liClass":"", "isLiEmpty":"false", "aClass":"", "aHref":"", "aShowValue":top.Lang.Mail.Write.zhankai,"id": currentMenuName+"_"},//展开
                {"liClass":"line", "isLiEmpty":"true"},
                //{"liClass":"", "isLiEmpty":"false", "aClass":"notuse", "aHref":"", "aShowValue":"全部标记为已读"},
                {"liClass":"", "isLiEmpty":"false", "aClass":"notuse", "aHref":"", "aShowValue":top.Lang.Mail.Write.xinjianbiaoqian},//新建标签
                {"liClass":"", "isLiEmpty":"false", "aClass":"notuse", "aHref":"", "aShowValue":top.Lang.Mail.Write.chuangjianfenjianguize},//创建分拣规则
                {"liClass":"", "isLiEmpty":"false", "aClass":"notuse", "aHref":"", "aShowValue":top.Lang.Mail.Write.biaoqianguanli}//标签管理
            ]
            
        };
        var arraySpanFolder = arrayMenuItem[currentMenuName];
        
        //构建ul和li
        for (var i = 0; i < arraySpanFolder.length; i++) {
            var tempItem = arraySpanFolder[i];
            if (!tempItem) continue;//ie下length多一个
            
            var objLi = parent.El.createElement("li", "", "");
            if (tempItem["liClass"] != "") {
                parent.El.addClass(objLi, tempItem["liClass"]);
            }
                    
            //创建a标签并设置属性
            if (tempItem["isLiEmpty"] == "false") {
                var objA = parent.El.createElement("a", "", tempItem["liClass"]);
                parent.El.setAttr(objA, {"innerHTML":tempItem["aShowValue"],"id":currentMenuName+"_"+i, "href": "javascript:;"});
                objLi.appendChild(objA);
            }
            objUl.onclick = function (e) {
                //处理右键菜单的点击事件
                This._doContexMenuClick(e);
            }
            objUl.appendChild(objLi);
        }
        objDivContainer.appendChild(objUl);
        This.objDivContainer = objDivContainer;
        if (CC.IsEnableContexMenu()) {
            parent.El.insertElement(document.body, objDivContainer, "beforeEnd");   
        }
        
        parent.El.setStyle(This.objDivContainer,{
            //position: "absolute!important",
            left: "0px", 
            top: "0px", 
            opacity: "1"
            ////////visibility: "hide"  //"visible",
            //id: "ContexMenuContainer"
        });
        This.menuHeight = parent.El.height(objDivContainer);
        This.menuWidth = parent.El.width(objDivContainer);
        //parent.El.hide(This.objDivContainer);
    },
    /*
     * 获取右键菜单的显示left位置
     * @param {e} html对象
     */
    _getMenuPositionX: function (e) {
        if (!e) return 0;
        var MenuPositionX = 0;
        var docWidth = parent.El.docWidth();//窗口宽度
        var mousePositionX = e.clientX +document.body.scrollLeft - document.body.clientLeft;
        if(mousePositionX + this.menuWidth > docWidth) {
            MenuPositionX = mousePositionX - this.menuWidth;
        } else {
            MenuPositionX = mousePositionX;
        }
        return MenuPositionX;
        
    },
    _getMenuPositionY: function (e) {
        if (!e) return 0;
        var MenuPositionY = 0;
        var docHeight = parent.El.docHeight();//窗口高度
        var mousePositionY = e.clientY + document.body.scrollTop - document.body.clientTop;
        if (mousePositionY + this.menuHeight > docHeight) {
            MenuPositionY = mousePositionY - this.menuHeight;
        } else {
            MenuPositionY = mousePositionY;
        }
        return MenuPositionY;
    },
    show: function (event) {
        var This = this;
        parent.El.setStyle(This.objDivContainer,{
            ////////visibility: "visible",
            left: ""+This._getMenuPositionX(event)+"px", 
            top: ""+This._getMenuPositionY(event)+"px"
        });
    },
    hide: function () {
        //parent.El.setStyle(this.objDivContainer,{visibility: "hide"});
        parent.El.hide(this.objDivContainer);
    },
    _doContexMenuClick: function (e) {
        var This = this;
        parent.El.hide(This.objDivContainer);
        ////////parent.El.setStyle(This.objDivContainer,{visibility: "hide"});
        var event =  EV.getTarget(e,false);
        var menuId = event.getAttribute("id");
        if (!menuId) {
            return false;
        }
        var TypeInbox = GE.folderObj.inbox;
        
        //收件箱邮件
        if (menuId == "span_1_0") { //打开
            CC.goFolder("1", TypeInbox);
        } else if (menuId == "span_1_2" && This.HasEnableClick["span_1_2"]) { //查看未读
            CC.filterMail(1, [], {read:1}, 2, TypeInbox);
        } else if (menuId == "span_1_3" && This.HasEnableClick["span_1_3"]) { //全部标记为已读
            This.setAllMailRead("sys1");
        } else if (menuId == "span_1_5") { //创建分拣规则
            This.setMailConfig();
        } else if (menuId == "span_2_0") { //打开草稿箱
            CC.goFolder(2, "sys2");
        } else if (menuId == "span_3_0") { //已发送
            CC.goFolder("strip", "sys3");
        } else if (menuId == "span_3_2" && This.HasEnableClick["span_3_2"]) { //已发送全部标记为已读
            This.setAllMailRead("sys3");
        } else if (menuId == "span_3_3") { //查看投递状态
            //CC.goOutLink(gMain.webPath + "/se/log/logroute.do?sid="+gMain.sid,"log",Lang.Mail.main_msg_log);
            //CC.goOutLink(gMain.webPath + "/se/log/usermain.do?sid="+gMain.sid+"&menuId=showSend","log",Lang.Mail.main_msg_log);
            CC.goLogLink(top.Lang.Mail.Write.zizhuchaxun,"send");//自助查询
        } else if (menuId == "span_4_0") { //已删除
            CC.goFolder(4, "sys4");
        } else if (menuId == "span_4_2" && This.HasEnableClick["span_4_2"]) { //全部标记为已读
            This.setAllMailRead("sys4");
        } else if (menuId == "span_4_3") { //清空已删除
            MM["folderMain"].opt("empty", 4);
        } else if (menuId == "span_4_4") { //查看删信状态
            //CC.goOutLink(gMain.webPath + "/se/log/logroute.do?sid="+gMain.sid,"log",Lang.Mail.main_msg_log);
            //CC.goOutLink(gMain.webPath + "/se/log/usermain.do?sid="+gMain.sid+"&menuId=showDel","log",Lang.Mail.main_msg_log);
            CC.goLogLink(top.Lang.Mail.Write.zizhuchaxun,"del");//自助查询
        } else if (menuId == "span_12_0") { //打开网盘邮件夹
            CC.goFolder(12, "sys12");
        } else if (menuId == "span_12_2" && This.HasEnableClick["span_12_2"]) { //网盘邮件，全部标记为已读  
            This.setAllMailRead("sys12");
        } else if (menuId == "span_5_0") { //打开垃圾邮件
            CC.goFolder(5, "sys5");
        } else if (menuId == "span_5_2" && This.HasEnableClick["span_5_2"]) { //垃圾邮件全部标记为已读
            This.setAllMailRead("sys5");
        } else if (menuId == "span_5_3") { //清空垃圾邮件
            MM["folderMain"].opt("empty", 5);
        } else if (menuId == "span_6_0") { //打开病毒邮件夹
            CC.goFolder(6, "sys6");
        } else if (menuId == "span_6_2" && This.HasEnableClick["span_6_2"]) { //病毒邮件全部标记为已读
            This.setAllMailRead("sys6");
        } else if (menuId == "span_6_3") { //清空病毒邮件
            MM["folderMain"].opt("empty", 6);
        } else if (menuId == "span_13_0") { //打开监控邮件
            CC.goFolder(13, "sys13");
        } else if (menuId == "span_13_2" && This.HasEnableClick["span_13_2"]) { //监控邮件全部标记为已读
            This.setAllMailRead("sys13");
        } else if (menuId == "span_14_0") { //打开审核邮件
            CC.goFolder(14, "sys14");
        } else if (menuId == "span_14_2") { //全部审核通过
            
        } else if (menuId == "span_14_3") { //全部审核不通过
            
        } else if (menuId == "span_-1_0") { //展开所有子目录
            var subUl = document.getElementById("leftFolderContainer_-1");
            var objLi = jQuery("#ulService").children("li[id='-1']")[0];
            var objLi_icon = objLi.childNodes[0];
            LM.showOrHiddenMyLabel(subUl, objLi_icon, objLi);
        } else if (menuId == "span_-1_2") { //子目录都标记为已读
            
        //} else if (menuId == "span_-1_3") { //新建邮件夹
            MM["folderMain"].opt("addUser");
        } else if (menuId == "span_-1_3") { //邮件夹管理
            CC.goFolderMain(function (o) {
                CC.isLabelMail() && MM["folderMain"].folderCallback(-1);
            }); 
        } else if (menuId == "span_-2_0") { //展开我的标签
            var subUl = document.getElementById("leftFolderContainer_-2");
            var objLi = jQuery("#ulService").children("li[id='-2']")[0];
            var objLi_icon = objLi.childNodes[0];
            LM.showOrHiddenMyLabel(subUl, objLi_icon, objLi);
        } else if (menuId == "span_-2_2") { //我的标签--全部标记为已读 
            //接口有问题，暂时屏蔽掉
            /*
            return ;
            var childrenTag = document.getElementById("leftFolderContainer_-2").childNodes;
            if (childrenTag) {
                for (var i=0; i< childrenTag.length; i++) {
                    var tempItem = childrenTag[i];
                    var tempName = "label" + tempItem.id;
                    if (jQuery("#"+tempName)) {
                        This.setAllMailRead(tempName);
                    }
                }
            }*/
        //} else if (menuId == "span_-2_3") { //我的标签--新建标签
            MM["folderMain"].opt("addLabel");
        } else if (menuId == "span_-2_3") { //我的标签--标签管理
            CC.goFolderMain(function (o) {
                CC.isLabelMail() && MM["folderMain"].folderCallback(-2);
            });
        } else if(menuId == "span_-3_0") { //我的邮件夹子文件夹--打开
            if(This.passFlag && gMain.lock_close){
                var o = {};
                o.obj = jQuery("#"+LM.selectFolderId);
                o.p = this;
                o.id = id;
                //o.url = url;
                folderlock.unlocked(0,"leftLock",o);          //跳到安全锁页面 lock.js 解锁
                    
            } else {
                var currentLabelId = This.selectedId;
                CC.goFolder(currentLabelId, "user"+currentLabelId);
            }
            
        } else if(menuId == "span_-3_2") { //我的邮件夹子文件夹--全部标记为已读
            
        //} else if(menuId == "span_-3_3") { //我的邮件夹子文件夹--新建邮件夹
            MM["folderMain"].opt("addUser");
        } else if(menuId == "span_-3_3") { //我的邮件夹子文件夹--创建分拣规则
            This.setMailConfig();
        } else if(menuId == "span_-3_4") { //我的邮件夹子文件夹--邮件夹管理
            CC.goFolderMain(function (o) {
                CC.isLabelMail() && MM["folderMain"].folderCallback(-1);
            });
        } else if(menuId == "span_-4_0") { //我的标签子文件夹--打开
            var currentLabelId = This.selectedId;
            if (currentLabelId == "9999999") {
                CC.receiveMail(true);
            } else {
                CC.goFolder(currentLabelId, "label"+currentLabelId);    
            }
        } else if(menuId == "span_-4_2") { //我的标签子文件夹--全部标记为已读
            //This.setAllMailRead("");
        //} else if(menuId == "span_-4_3") { //我的标签子文件夹--新建标签
            MM["folderMain"].opt("addLabel");
        } else if(menuId == "span_-4_3") { //我的标签子文件夹--创建分拣规则
            This.setMailConfig("label");
        } else if(menuId == "span_-4_4") { //我的标签子文件夹--标签管理
            CC.goFolderMain(function (o) {
                CC.isLabelMail() && MM["folderMain"].folderCallback(-2);
            });
        }   
    },
    //全部标记为已读
    setAllMailRead: function (o) {
        var p1 = MM[o];
        p1.isAll = true;
        p1.mark("", "read", 0, top.Lang.Mail.Write.yidu);//已读
        p1.isAll = false;
    },
    //动态修改显示文字和menu可用性
    _changeInitCondition: function () {
        var This = this;
        //修改我的标签显示文字为折叠或展开
        var subUl = document.getElementById("leftFolderContainer_-2");
        if (subUl) {
            var isshow = (subUl.style.display == "none");
            if (jQuery("#span_-2_0")[0]) {
                jQuery("#span_-2_0")[0].innerHTML=(isshow ? top.Lang.Mail.Write.zhankai : top.Lang.Mail.Write.zhedie);//展开  ||  折叠
            }
        }

        //修改我的邮件夹显示文字为折叠子目录或展开子目录
        var subUl = document.getElementById("leftFolderContainer_-1");
        if (subUl) {
            var isshow = (subUl.style.display == "none");
            if (jQuery("#span_-1_0")[0]) {
                jQuery("#span_-1_0")[0].innerHTML=(isshow ? top.Lang.Mail.Write.zhankaizimulu : top.Lang.Mail.Write.zhediezimulu);//展开子目录  ||  折叠子目录
            }
        }

        //修改我的标签子文件夹打开
        var childMyLabel = document.getElementById("span_-4_0");
        if (childMyLabel) {
            if (childMyLabel) {
                childMyLabel.innerHTML=top.Lang.Mail.Write.dakai;//打开
            }
        }
        
        var folderDetailList = MM['folderMain'].Folders[GE.folder.sys];
        if (folderDetailList) {
            
            //收件箱的"查看未读"和"全部标记为已读"置灰
            if(This._getUnreadCount(1) > 0){
            //if (folderDetailList[0].stats.unreadMessageCount > 0) {
                jQuery("#span_1_2").removeClass("notuse");
                jQuery("#span_1_3").removeClass("notuse");
                This.HasEnableClick["span_1_2"] = true;
                This.HasEnableClick["span_1_3"] = true;
            } else {
                jQuery("#span_1_2").addClass("notuse");
                jQuery("#span_1_3").addClass("notuse");
                This.HasEnableClick["span_1_2"] = false;
                This.HasEnableClick["span_1_3"] = false;
            }
            //已发送"全部标记为已读"置灰
            if (This._getUnreadCount(3) > 0) {
                jQuery("#span_3_2").removeClass("notuse");
                This.HasEnableClick["span_3_2"] = true;
            } else {
                jQuery("#span_3_2").addClass("notuse");
                This.HasEnableClick["span_3_2"] = false;
            }
            //已删除"全部标记为已读"置灰
            if (This._getUnreadCount(4) > 0) {
                jQuery("#span_4_2").removeClass("notuse");
                This.HasEnableClick["span_4_2"] = true;
            } else {
                jQuery("#span_4_2").addClass("notuse");
                This.HasEnableClick["span_4_2"] = false;
            }

            if (!GC.check("MAIL_INBOX_DELETE")) {
                jQuery("#span_4_3").hide();
            }
            
            //网盘邮件"全部标记为已读"置灰
            if (This._getUnreadCount(12) > 0) {
                jQuery("#span_12_2").removeClass("notuse");
                This.HasEnableClick["span_12_2"] = true;
            } else {
                jQuery("#span_12_2").addClass("notuse");
                This.HasEnableClick["span_12_2"] = false;
            }
            
            //垃圾邮件"全部标记为已读"置灰
            if (This._getUnreadCount(5) > 0) {
                jQuery("#span_5_2").removeClass("notuse");
                This.HasEnableClick["span_5_2"] = true;
            } else {
                jQuery("#span_5_2").addClass("notuse");
                This.HasEnableClick["span_5_2"] = false;
            }
            
            //病毒邮件"全部标记为已读"置灰
            if (This._getUnreadCount(6) > 0) {
                jQuery("#span_6_2").removeClass("notuse");
                This.HasEnableClick["span_6_2"] = true;
            } else {
                jQuery("#span_6_2").addClass("notuse");
                This.HasEnableClick["span_6_2"] = false;
            }
            
            //监控邮件"全部标记为已读"置灰
            if (This._getUnreadCount(13) > 0) {
                jQuery("#span_13_2").removeClass("notuse");
                This.HasEnableClick["span_13_2"] = true;
            } else {
                jQuery("#span_13_2").addClass("notuse");
                This.HasEnableClick["span_13_2"] = false;
            }
            if (GC.check("MAIL_VAS_LOG") != "1") {
                jQuery("#span_3_3").hide();
                jQuery("#span_4_4").hide();
            } else {
                jQuery("#span_3_3").show();
                jQuery("#span_4_4").show();
            }
            if (GC.check("MAIL_VAS_LOG") == "1" && This.selectedId == "9999999"){
                jQuery("#span_-4_3").hide();
            } else {
                jQuery("#span_-4_3").show();
            }
            if (!GC.check("MAIL_INBOX_DELETE")) {
                jQuery("#span_5_3").hide();
            }

            if (!GC.check("MAIL_MANAGER_FILTER")) {
                jQuery("#span_1_5").parent().hide();
                jQuery("#span_1_5").parent().prev().hide();
                jQuery("#span_-3_3").parent().hide();
                jQuery("#span_-4_3").parent().hide();
            }
        }
    },
    _getSelectedId: function () {
        var This = this;
        try {
            var spanId = EV.getTarget(This.e,false).getAttribute("id");
            if (!spanId) {
                spanId = EV.getTarget(This.e,false).parentNode.getAttribute("id");
            } 
            if (spanId) {
                var temp = spanId.match(/span_(\d*)/);
                if (temp.length > 1) {
                    This.selectedId = temp[1];
                }
            }
        } catch(e) {
        }
    },
    //获取未读邮件数
    _getUnreadCount: function(currentFid) {
        var This = this;
        var folderDetailList = MM['folderMain'].Folders[GE.folder.sys];
        var unreadCount = "-1";
        if (folderDetailList) {
            for (var i = 0; i < folderDetailList.length; i++) {
                var tempItem = folderDetailList[i];
                if (tempItem.fid == currentFid) {
                    unreadCount = tempItem.stats.unreadMessageCount;
                    break;
                }
            }
        }
        return unreadCount;
    },
    //创建分拣规则
    setMailConfig: function (folderFlag) {
        
        var fid = LM.selectFolderId;
        var oFolder = MM.getFolderObject(fid);
        var obj = {
            name: oFolder.name,
            folderId: fid
        };
        //if(name == "label"){
        obj.callback = function () {
            if ("label" == folderFlag) {
                filter.showAdd();
                if ($("option_check_dealType5")) {
                    $("option_check_dealType5").checked = true;
                    filter.attrs.dropLabel.setValue(oFolder.fid);
                }
                filter.attrs.dropLabel.setValue(oFolder.fid);
            } else {
                filter.showAdd();
                if ($("option_check_dealType2")) {
                    $("option_check_dealType2").checked = true;
                }
            }
            
        }
        //} 
        CC.setConfig('filter', obj);
    }
};