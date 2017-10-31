﻿function CreateNameSpace(ns){if(!ns||typeof(ns)!="string")return;ns=ns.split(".");var o=(window[ns[0]]=window[ns[0]]||{});for(i=1;i<ns.length;i++){var ni=ns[i];o=(o[ni]=o[ni]||{});}}CreateNameSpace("Lang.Cal");Lang.Cal={"eventContentMoreSize":"\u65E5\u7A0B\u5185\u5BB9\u5927\u4E8E\u007B\u0030\u007D\u4E2A\u5B57\u3002","unitDay":"\u5929","dateFormatMD":"\u006D\u006D\u6708\u0064\u0064\u65E5","event":"\u4E8B\u9879","remind":"\u63D0\u9192","noSelectTip":"\u8BF7\u9009\u62E9\u8981\u5220\u9664\u7684\u65E5\u7A0B\u0021","addSchedule":"\u6DFB\u52A0\u65E5\u7A0B","wordsTips":"\u8FD8\u53EF\u8F93\u5165\u003C\u0065\u006D\u0020\u0069\u0064\u003D\u0022\u0074\u0078\u0074\u0043\u0075\u0072\u004C\u0065\u006E\u0067\u0074\u0068\u0022\u003E\u003C\u002F\u0065\u006D\u003E\u5B57\uFF0C\u6700\u591A\u003C\u0065\u006D\u0020\u0069\u0064\u003D\u0022\u0074\u0078\u0074\u004D\u0061\u0078\u004C\u0065\u006E\u0067\u0074\u0068\u0022\u003E\u003C\u002F\u0065\u006D\u003E\u5B57","allDayEvent":"\u5168\u5929\u4E8B\u4EF6","dayEventTimeTip":"\uFF08\u6301\u7EED\u4E00\u6574\u5929\u7684\u4E8B\u9879\uFF0C\u4E0B\u53D1\u63D0\u9192\u65F6\u95F4\u4EE5\u5F53\u5929\u007B\u0030\u007D\u003A\u0030\u0030\u70B9\u4E3A\u57FA\u51C6\uFF09","repeatEvent":"\u91CD\u590D\u4E8B\u4EF6","notRepeat":"\u4E0D\u91CD\u590D","noEmail":"\u4E0D\u662F\u90AE\u7BB1\u5730\u5740","noSendAlter":"\u63D0\u9192\u65F6\u95F4\u5C0F\u4E8E\u5F53\u524D\u65F6\u95F4\u002C\u8BE5\u65E5\u7A0B\u4E8B\u4EF6\u4E0D\u63D0\u4F9B\u901A\u77E5\u529F\u80FD\u0021","previousYear":"\u4E0A\u4E00\u5E74","nextYear":"\u4E0B\u4E00\u5E74","previousMonth":"\u4E0A\u4E00\u6708","afternoon":"\u4E0B\u5348","beforeDawn":"\u65E9\u4E0A","day":"\u65E5","earlyMorning":"\u51CC\u6668","hour":"\u5C0F\u65F6","lateNight":"\u6DF1\u591C","minute":"\u5206\u949F","month":"\u6708","morning":"\u4E0A\u5348","night":"\u665A\u4E0A","noon":"\u4E2D\u5348","perDay":"\u6BCF\u5929","perMonth":"\u6BCF\u6708","perWeek":"\u6BCF\u5468","perYear":"\u6BCF\u5E74","to":"\u5230","year":"\u5E74","advance":"\u63D0\u524D","sendRemind":"\u63D0\u524D\u007B\u0030\u007D\u53D1\u9001\u63D0\u9192","sentMoreCurrentTime":"\u4E0B\u53D1\u63D0\u9192\u7684\u65F6\u95F4\u4E0D\u80FD\u65E9\u4E8E\u5F53\u524D\u65F6\u95F4\uFF0C\u8BF7\u91CD\u65B0\u9009\u62E9\u63D0\u9192\u65F6\u95F4\u0021","fail":"\u5931\u8D25\u3001\u7CFB\u7EDF\u9519\u8BEF","addFail":"\u6DFB\u52A0\u65E5\u7A0B\u5931\u8D25\uFF01","updateFail":"\u66F4\u65B0\u65E5\u7A0B\u5931\u8D25\uFF01","deleteFail":"\u5220\u9664\u65E5\u7A0B\u5931\u8D25\uFF01","findFail":"\u67E5\u8BE2\u65E5\u7A0B\u5931\u8D25\uFF01","reqDataNull":"\u8BF7\u6C42\u6570\u636E\u4E0D\u80FD\u4E3A\u7A7A\uFF01","dateFormatError":"\u65E5\u671F\u683C\u5F0F\u4E0D\u6B63\u786E\uFF01","beginMoreEndDate":"\u63D0\u9192\u7ED3\u675F\u65F6\u95F4\u4E0D\u80FD\u5C0F\u4E8E\u5F00\u59CB\u65F6\u95F4\u002C\u8BF7\u91CD\u65B0\u9009\u62E9\u0021","repeatTypeError":"\u4E8B\u4EF6\u7C7B\u578B\u4E0D\u5B58\u5728\uFF01","findByNotExist":"\u67E5\u8BE2\u7C7B\u578B\u4E0D\u5B58\u5728\uFF01","today":"\u4ECA\u5929","thursday":"\u661F\u671F\u56DB","friday":"\u661F\u671F\u4E94","saturday":"\u661F\u671F\u516D","sunday":"\u661F\u671F\u65E5","newEvent":"\u65B0\u5EFA\u4E8B\u4EF6","nextMonth":"\u4E0B\u4E00\u6708","menuMonth":"\u6708","menuDay":"\u65E5","emailRemind":"\u90AE\u4EF6\u63D0\u9192","smsRemind":"\u77ED\u4FE1\u63D0\u9192","other":"\u53E6\u5916","close":"\u5173\u95ED","edit":"\u7F16\u8F91","addDetails":"\u6DFB\u52A0\u8BE6\u7EC6\u4FE1\u606F","addTips":"\u6E29\u99A8\u63D0\u793A\uFF1A\u8BBE\u7F6E\u6210\u529F\u540E\u5C06\u901A\u8FC7\u514D\u8D39\u77ED\u4FE1\u548C\u90AE\u4EF6\u63D0\u9192\u81EA\u5DF1\u3002","time":"\u65F6\u95F4\uFF1A","content":"\u5185\u5BB9\uFF1A","eventBefore":"\u5728\u4E8B\u4EF6\u524D","remindMe":"\u63D0\u9192\u6211","deleteTip":"\u786E\u5B9A\u8981\u5220\u9664\u6B64\u65E5\u7A0B\u5417\u003F","noMobile":"\u4E0D\u662F\u624B\u673A\u53F7\u7801","gregorianCal":"\u516C\u5386","sendRemindPage":"\u53D1\u9001\u63D0\u9192\u901A\u77E5","remindSelf":"\u63D0\u9192\u81EA\u5DF1","selfDesc":"\u0028\u5C06\u901A\u8FC7\u514D\u8D39\u77ED\u4FE1\u548C\u90AE\u4EF6\u63D0\u9192\u0029","noMoblieTip":"\u63D0\u793A\uFF1A\u7531\u4E8E\u60A8\u672A\u7ED1\u5B9A\u624B\u673A\uFF0C\u53EA\u80FD\u4EE5\u90AE\u4EF6\u7684\u65B9\u5F0F\u53D1\u9001\u3002","reminfFriend":"\u63D0\u9192\u597D\u53CB","sendSms":"\u53D1\u77ED\u4FE1","contacts":"\u901A\u8BAF\u5F55","sendEmail":"\u53D1\u90AE\u4EF6","selectWeek":"\u8BF7\u81F3\u5C11\u9009\u62E9\u6BCF\u5468\u4E2D\u7684\u4E00\u5929\u3002","eventContentNull":"\u65E5\u7A0B\u5185\u5BB9\u4E0D\u80FD\u4E3A\u7A7A\uFF01","calendarList":"\u65E5\u7A0B\u5217\u8868","dateFormat":"\u0079\u0079\u0079\u0079\u5E74\u004D\u004D\u6708\u0064\u0064\u65E5","dateFormatYM":"\u0079\u0079\u0079\u0079\u5E74\u006D\u006D\u6708","test":"\u6D4B\u8BD5","parameter_not_right":"\u5BF9\u4E0D\u8D77\uFF01\u4F20\u5165\u53C2\u6570\u4E0D\u5BF9\uFF01","parameter_wrong":"\u4F20\u5165\u53C2\u6570\u9519\u8BEF\u0021","Yearoutofrange":"\u5E74\u4EFD\u8D85\u51FA\u8303\u56F4","Lessthan1minute":"\u4E0D\u8DB3\u0031\u5206\u949F","selectmonth":"\u9009\u62E9\u6708","thrus":"\u5468\u56DB","fri":"\u5468\u4E94","sat":"\u5468\u516D","sun":"\u5468\u65E5","monday":"\u661F\u671F\u4E00","mon":"\u5468\u4E00","tuesday":"\u661F\u671F\u4E8C","tues":"\u5468\u4E8C","wednesday":"\u661F\u671F\u4E09","wed":"\u5468\u4E09"};

