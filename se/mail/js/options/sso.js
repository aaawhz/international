/**
 * @author Administrator
 */
var sso = new OptionBase();

sso.getUrl = function(func){
    return gMain.webPath+'/service/mail/conf?func={0}&sid={1}'.format(func,gMain.sid);
};

sso.attrs = {
    id : "sso",
    free: true,
    authority: "MAIL_CONFIG_SSO",
    divId: "pageSSO",
    // noReq: true,
    list: { type: "url", func: gConst.func.getSSOList, data: {}}
};
sso.init = function(){
    this.attrs.url = this.getUrl(this.attrs.list.func);
    this.request(this.attrs,this.getHtml,null,true);
}
/**
 * 拼接html
 * @param  {[type]} attrs [sso.attrs]
 * @param  {[type]} val   [接口返回的值]
 */
sso.getHtml = function(attrs,val){
    var val = val || [],    //后台返回的"var"部分
        p = this,
        html = [];
    html.push("<div class=\"bodySet bodyBwList\" style='align:text;position:relative'");
    // if (ad.divId) {
    //     html.push(" id=\"{0}\"".format(ad.divId));
    // }
    html.push("><div id=\"container\" style=\"position:relative\">");
    html.push(p.getTopHtml());
    html.push("<div id='ssoWrapper' style=\"position:relative\">");

    if(val.length > 0){
        html.push("<div class=\"accredit-login\"><h3 class=\"fz_14 mb_10\">"+top.Lang.Mail.Write.disanfangshouquandengluzhandian+"</h3>");//<div class=\"accredit-login\"><h3 class=\"fz_14 mb_10\">第三方授权登录站点</h3>

        jQuery.each(val, function(i, v) {
            html.push("<div class=\"accredit-login-table\"><table><tr>");
            html.push("<td><div class=\"td1\">" + v.webName + "</div></td>");
            html.push("<td><div class=\"td2\">"+top.Lang.Mail.Write.shouquanriqi + v.createTime + "</div></td>");//<td><div class=\"td2\">授权日期
            if(v.grantType == 1){
                html.push("<td><div class=\"td3\">"+top.Lang.Mail.Write.sangeyuenayouxiao+"</div></td>");//<td><div class=\"td3\">三个月内有效</div></td>
            }else{
                html.push("<td><div class=\"td3\">"+top.Lang.Mail.Write.yongjiuyouxiao+"</div></td>");//<td><div class=\"td3\">永久有效</div></td>
            }
            html.push("<td><a href=\"javascript:;\" onclick=\"sso.showConfirm('"+ v.uniqueCode +"');\" id=\"cancelBtn\">"+top.Lang.Mail.Write.quxiaoshouquan+"</a></td>");//');\" id=\"cancelBtn\">取消授权</a></td>
            html.push("</tr></table></div>")
        });

        html.push("</div>");
    }else{
        html.push("<div class=\"accredit-login\">"+top.Lang.Mail.Write.zwdsfdlsqzdvQNIAVkz+"</div>");//<div class=\"accredit-login\">暂无第三方登录授权站点！</div>
    }

    html.push("</div>");
    MM[gConst.setting].update(p.attrs.id, html.join(""));
}


/**
 * 
 */
 sso.showConfirm = function(code){

    CC.confirm(top.Lang.Mail.Write.qdyqxdsfsqmVIobumFl,function(){//确定要取消第三方授权吗？
        var p = sso,
            _func = gConst.func.cancelSSO,
            _data = {
                uniqueCode:code
            },
            _url = p.getUrl(_func);

        var _callback = function(ao){
            CC.showMsg(top.Lang.Mail.Write.quxiaoshouquanchenggong,true,false,"option");//取消授权成功
            sso.cancelSuc();
        }

        var _fcb = function(ao){
            CC.showMsg(top.Lang.Mail.Write.quxiaoshouquanshibai,true,false,"error");//取消授权失败
        }

        p.doService(_func, _data, _callback, _fcb);
    },top.Lang.Mail.Write.tishi);//提示

 }

/**
 * 点击取消授权按钮
 * @return {[type]} [description]
 */


/**
 * 成功取消授权后的回调函数
 * @return {[type]} [description]
 */
sso.cancelSuc = function(){
    var p = this,
        _func = gConst.func.getSSOList,
        _data = {},
        _url = p.getUrl(_func);

    var _callback = function(ao){
        sso.getHtml(sso.attrs,ao);
    }

    var _fcb = function(ao){
        CC.showMsg(top.Lang.Mail.Write.huoqushouquanxinxishibai,true,false,"error");//获取授权信息失败
    }

    this.ajaxRequest(_func, _data, _callback, _fcb, _url);
}