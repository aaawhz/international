/**
 * @author Administrator
 */

var antiSpam = new OptionBase();

antiSpam.attrs = {
    id : 'antiSpam',
    authority: 'MAIL_CONFIG_ANTIVIRU',
    divId:'pageAntiSpam',
	noReq: true
};
antiSpam.init = function(){
    this.request(this.attrs);
};

/**
 * 得到反垃圾的html
 * @param {Object} ad
 * @param {Object} emails
 */
antiSpam.getHtml = function(ad, emails) {
    var p = black;
    p.attrs.emails = emails;
    var getListObj = function() {
    	var title = "";
        var ao = { title: title, items: [] };
		//<input type='checkbox' onclick='black.selectAll(this)'/>
        ao.head = { title: ["", Lang.Mail.ConfigJs.filter_emailaddress, Lang.Mail.ConfigJs.filter_operate], className: ['td1', 'td2', 'td3'] };

	    if (typeof (emails) == 'object' && emails.length > 0) {
            for (var i = 0; i < emails.length; i++) {
				if(emails[i] != ""){
					var mail = emails[i].encodeHTML();
					try{
					 ao.items[i] = [];
                     ao.items[i][0] = "<input type='checkbox' name='checkMail'/>";
                     ao.items[i][1] = mail;
                     ao.items[i][2] = ('<a onclick="black.save(\'{0}\',\'delete\'); return false;"  href="javascript:void(0)">'+Lang.Mail.ConfigJs.filter_delete+'</a>').format(mail);
                    }catch(e){}
                }	
     
            }
        } else {
        	ao.items = p.attrs.type == 0 ? Lang.Mail.ConfigJs.NoCreateBlackList : Lang.Mail.ConfigJs.NoCreateWhiteList;
        }
		
        return ao;
    };
	
	var getNoList = function(){
		var listHtml = [];
		var wbTip = black.attrs.type == 0 ? Lang.Mail.ConfigJs.NoCreateBlackList  : Lang.Mail.ConfigJs.NoCreateWhiteList;
		listHtml.push("<p class=\"set_rule_box_tips\">"+wbTip+"</p>");
	    return listHtml.join("");
	}

    var getAddHtml = function() {
        var html = []
        html.push("<div class=\"bwSet\" >"); 
        html.push("<h2 class=\"set_til\">");
        html.push(p.attrs.type == 0 ? Lang.Mail.ConfigJs.setBlackList : Lang.Mail.ConfigJs.setWhiteList);
		html.push("<span class=\"\">({0})</span>".format(p.attrs.type == 0 ? Lang.Mail.ConfigJs.Rejection : Lang.Mail.ConfigJs.sureReceive ));
        html.push("</h2>");
		html.push("<fieldset class=\"formSet\">");
        html.push("<div class=\"write_adr_wrap\">");
       // html.push("<div style='position:relative;width:500px;height:32px;'><table  cellpadding=\"0\">");
        html.push("<table  cellpadding=\"0\"><tbody><tr><td width='455' >");
               
        html.push("<div style='background: none repeat scroll 0 0 white; border: 1px solid #DBDBDB; ");
        html.push("box-shadow: 1px 1px 2px #DBDBDB inset;font-family: Tahoma;height: auto !important;");
        html.push("line-height: 28px;min-height: 28px;padding:2px 2px 2px 10px; width:440px; float:left'>");
		
        html.push("<input id=\"option_wblist\" style='width:415px;height:30px;color:#BFBFBF;border:none;height:28px; line-height:28px;' ");
        html.push(" class=\"clearfix\" value='" + Lang.Mail.ConfigJs.semicolon + "'");
        html.push(" type=\"text\" maxLength='146'><i title='"+Lang.Mail.ConfigJs.chooseFromMailList+"' style='position:absolute;left:434px;top:72px' " +
            "class=\" i-rush\" id='addContact'></i></div></td><td width=\"75\">");
        html.push("<a href=\"javascript:void(0);\" id=\"AAdd\" onclick=\"black.save(); return false;\" class=\"add_Link\" " +
            "style='display:inline-block;zoom:1;margin-top:0px;vertical-align:middle'>");
        html.push("<i class=\"i_addMail\"></i>" + Lang.Mail.ConfigJs.filter_add + "</a></td>");
        html.push("</tr>");
        html.push("</tbody></table>");
        html.push("</div>");
        html.push("</fieldset>");
        html.push("</div>");
		
        return html.join("");
    };

    var html = [];
    var addDiv = getAddHtml();
    var tabList = p.getTableList(getListObj());
    //html.push(p.getNavMenu(ad.id));
    html.push("<div class=\"bodySet bodyBwList\" style='align:text;position:relative'");
    if (ad.divId) {
        html.push(" id=\"{0}\"".format(ad.divId));
    }
    html.push("><div id=\"container\" style=\"position:relative\">");

    html.push(this.getTopHtml());
    html.push(this.getLeftHtml());
    html.push("<div class=\"setWrapper\" id='blackWrapper' style=\"position:relative\">");
    html.push(addDiv);
 

    html.push("</div></div></div>");
    MM[gConst.setting].update(p.attrs.id, html.join(""));
	p.updatePosition("blackWrapper");
	p.initEvent();
	      
};
