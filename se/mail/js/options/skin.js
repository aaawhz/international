var skin = new OptionBase();

skin.attrs = {
    id: 'skin',
    authority: 'MAIL_CONFIG_SKIN',
    free: true,
    listData : null,
    divId: 'changeSkin',
    list: {
        type: 'url',
        func: gConst.func.getSkinList,//gConst.func.getFilter,
        data: {}
    },
    save: {
        func: gConst.func.setUserSkin,
        type: 'url',
        data: {}
    }
};
skin.init = function(){
    this.initService(this.attrs, this.getHtml);
    //this.request(this.attrs, this.getHtml);
};
skin.getHtml = function(attrs, values){
    var p = this;
    var html = [];
    var list = p.listData= values;
    
    html.push(this.getNavMenu(attrs.id));
    html.push(this.getTopHtml());
    html.push(this.getLeftHtml());
    html.push("<div class=\"setWrapper\" id=\"skinWrapper\">");
    html.push("<div class=\"skin-page\">");
    html.push("<p class=\"skin-topNote\">"+top.Lang.Mail.Write.djtphjkzjgRAlkDqvuhhxtzdwnbc+"</p>");//<p class=\"skin-topNote\">点击图片后即可直接更换皮肤，切换后，系统自动为您保存。</p>
    
    /*var list =[
    {"corpId":0,"createTime":null,"cssName":"skin_snow","isDefault":0,"mailCorpId":0,"mailId":"","mailType":0,"modifyTime":null,"skinId":1,"skinName":"雪山","skinTypeId":1,"skinTypeName":"经典皮肤","userId":""},
    {"corpId":0,"createTime":null,"cssName":"skin_bluesky","isDefault":0,"mailCorpId":0,"mailId":"","mailType":0,"modifyTime":null,"skinId":2,"skinName":"天空蓝","skinTypeId":1,"skinTypeName":"经典皮肤","userId":""},
    {"corpId":0,"createTime":null,"cssName":"skin_mobilestar","isDefault":0,"mailCorpId":0,"mailId":"","mailType":0,"modifyTime":null,"skinId":3,"skinName":"移动星空","skinTypeId":2,"skinTypeName":"商务时尚","userId":""},
    {"corpId":0,"createTime":null,"cssName":"skin_peonyred","isDefault":0,"mailCorpId":0,"mailId":"","mailType":0,"modifyTime":null,"skinId":4,"skinName":"牡丹红","skinTypeId":2,"skinTypeName":"商务时尚","userId":""},
    {"corpId":0,"createTime":null,"cssName":"skin_woodgrain","isDefault":0,"mailCorpId":0,"mailId":"","mailType":0,"modifyTime":null,"skinId":5,"skinName":"木纹","skinTypeId":3,"skinTypeName":"其他","userId":""}];
    */
    
    var getSkinTypeName = function(id){
        var retVal = {};
        for (var i=0; i < list.length; i++) {
           if(list[i].skinTypeId == id){
                retVal = list[i];
                break;
           }
        }
        return retVal;
    };
        var tt= [];
        for (var i=0; i < list.length; i++) {
              tt.push(list[i].skinTypeId);
        };
    var tempList = tt.unique();
    
    for (var i=0; i < tempList.length; i++) {
        var id = tempList[i];       
        var currItem = getSkinTypeName(id);
        html.push("<div class=\"skin-list\">");
        html.push("<fieldset><legend>{0}</legend></fieldset>".format(currItem.skinTypeName));
        html.push("<ul class=\"skin-items m_clearfix\">");
        for (var j=0; j < list.length; j++) {
            var item = list[j];
            if(id == item.skinTypeId){          
                html.push("<li onclick=\"skin.save("+item.skinId+");\" id=\"li_skin"+item.skinId+"\">");
                var selected = "";
                if(item.isDefault == 1){
                    html.push('<em class="selected-skin"></em>');
                    selected = "skin-img-on";
                }
                html.push("<a href=\"javascript:fGoto();\" class=\"skin-img {0}\">".format(selected));
                html.push("<img src=\"{1}/images/{0}.jpg\" width=\"90\" height=\"90\" alt=\"{2}\"/>".format(item.cssName,gMain.resourceRoot,item.skinName));
                html.push("</a>");
                html.push("<a href=\"javascript:fGoto();\" class=\"skin-name\">{0}</a>".format(item.skinName));
                html.push("</li>");     
            }
        };
        html.push("</ul>");
        html.push("</div>");
        
    };
        
    html.push("</div><!--skin-page-->");
    html.push("</div>");
    
    MM[gConst.setting].update(this.attrs.id, html.join(''));
    skin.updatePosition("skinWrapper");
};
skin.save = function(id){
    var p = this;
    var data = {skinId : id};
    p.doService(p.attrs.save.func,data,callback,function(d){
          if (d.summary) {
              p.fail(d.summary);
          }else{
              p.fail(Lang.Mail.ConfigJs.loginNotifyFail,d); //设置失败
          }         
     });
     function callback(d){
        if(d.code=="S_OK"){
            var row = p.getRowData(id);
            gMain.userSkinConfig = row.cssName;
            p.setDefaultSkin(row);
            ChangeSkin.changeLink("topLinks", row.cssName);
            ChangeSkin.changeLink("iframeLinks", row.cssName);
            //p.ok(Lang.Mail.ConfigJs.loginNotifySuccess);//设置成功
        }else{
            //p.fail(Lang.Mail.ConfigJs.loginNotifyFail,d); //设置失败
        }
    }
};
skin.getRowData = function(skinId){
    var p = this;
    var relVal;
    for (var i=0; i < p.listData.length; i++) {
       if(p.listData[i].skinId == skinId){
            relVal = p.listData[i];
            break;
       }
    };
    return relVal;
};
skin.setDefaultSkin = function(row){
    
    var img = jQuery("#imgLogo");
    var src = img.attr("src");
    var skinPath = parent.gMain.skinPath || '/se/images/skin';
    var cssName = row.cssName.replace("skin_","");
    var imgSrc = parent.gMain.resourceServer + skinPath + '/' + cssName + '/logo.png';
    if(src){
//      var temp = src.substr(0,src.lastIndexOf("/"));
//      temp = temp.substr(temp.lastIndexOf("/")+1);
//      img.attr("src",src.replace(temp,row.cssName.replace("skin_","")));
        img.attr('src', imgSrc);
    }
    else
    {
        if (jQuery.browser.msie && (jQuery.browser.version == "6.0") && !jQuery.support.style)
            img.attr("style","DISPLAY: inline-block; FILTER: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='{0}{1}/{2}/logo.png', sizingMethod='scale'); WIDTH: 170px; HEIGHT: 60px".format(parent.gMain.resourceServer, skinPath, row.cssName.replace("skin_","")));
    }

    var skinLiList = jQuery("#skinWrapper").find("li");
    for (var i=0; i < skinLiList.length; i++) {
        var li = jQuery(skinLiList[i]);
        var em = li.find("em");
        if(em) em.remove();
        var a = jQuery(li.find("a").get(0));
        a.attr("class","skin-img");
    };
    var selectedLi = jQuery("#li_skin"+row.skinId);
    selectedLi.prepend("<em class=\"selected-skin\"></em>");
    var selectedA = jQuery(selectedLi.find("a").get(0));
    selectedA.attr("class","skin-img skin-img-on");
}

