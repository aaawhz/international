# international
a node project to pickText and transform 国际化

把js中的中文转成国际化配置， 并最终提取到propertyies.js中 

demo1:

CC.showMsg("取消授权失败",true,false,"error");

==》

CC.showMsg(top.Lang.Mail.Write.quxiaoshouquanshibai,true,false,"error");//取消授权失败

demo2:

 html.push("<td><div class=\"td3\">三个月内有效</div></td>");
 
 ==>
 
 html.push("<td><div class=\"td3\">"+top.Lang.Mail.Write.sangeyuenayouxiao+"</div></td>");//<td><div class=\"td3\">三个月内有效</div></td>
 
 demo3: 
 
 html += <input id=\"chkAutoDestroy\" tabindex=\"21\" type=\"checkbox\" title=\"阅读\"><label for=\"chkAutoDestroy\" title=\"阅读\">
 
 ==>
 
 html += " <input id=\"chkAutoDestroy\" tabindex=\"21\" type=\"checkbox\" title='"+top.Lang.Mail.Write.yjydhzxhhywaMoVJJfcgxztshzxh+"'><label for=\"chkAutoDestroy\" title='"+top.Lang.Mail.Write.yjydhzxhhyRosoBRRccgxztshzxh+"'>";// 
 
 demo4: 
 
 "html.push(\'<li >\"
    <p>\
    <div>\
    例子
    </p>\
    </div>\
    </li>\');//
    
 ==>
 
  html.push(\'<li >\
    <p>\
    <div>\
    top.Lang.Mail.Write.liezi
    </p>\
    </div>\
    </li>\');//
 

