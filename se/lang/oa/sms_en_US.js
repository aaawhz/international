﻿function CreateNameSpace(ns){if(!ns||typeof(ns)!="string")return;ns=ns.split(".");var o=(window[ns[0]]=window[ns[0]]||{});for(i=1;i<ns.length;i++){var ni=ns[i];o=(o[ni]=o[ni]||{});}}CreateNameSpace("Lang.Sms");Lang.Sms={"smsReceiverTips":"\u0049\u0074\u0020\u0073\u0075\u0070\u0070\u006F\u0072\u0074\u0073\u0020\u0073\u0065\u006E\u0064\u0069\u006E\u0067\u0020\u0074\u006F\u0020\u006D\u006F\u0072\u0065\u0020\u0074\u0068\u0061\u006E\u0020\u006F\u006E\u0065\u0020\u006D\u006F\u0062\u0069\u006C\u0065\u0020\u0075\u0073\u0065\u0072\u0020\u0061\u0074\u0020\u0074\u0068\u0065\u0020\u0073\u0061\u006D\u0065\u0020\u0074\u0069\u006D\u0065\u002E\u0020\u0050\u006C\u0065\u0061\u0073\u0065\u0020\u0073\u0065\u0070\u0061\u0072\u0061\u0074\u0065\u0020\u0074\u0068\u0065\u0073\u0065\u0020\u006D\u006F\u0062\u0069\u006C\u0065\u0020\u006E\u0075\u006D\u0062\u0065\u0072\u0073\u0020\u0077\u0069\u0074\u0068\u0020\u0022\u003B\u0022\u002E","smsReceiverMaxError":"\u0059\u006F\u0075\u0020\u0063\u0061\u006E\u0020\u0073\u0065\u006E\u0064\u0020\u0069\u0074\u0020\u0074\u006F\u0020\u0061\u0074\u0020\u006D\u006F\u0073\u0074\u0020\u007B\u0030\u007D\u0020\u0075\u0073\u0065\u0072\u0073\u0020\u0061\u0074\u0020\u0074\u0068\u0065\u0020\u0073\u0061\u006D\u0065\u0020\u0074\u0069\u006D\u0065\u002E","smsReceiveEmptyTips":"\u0050\u006C\u0065\u0061\u0073\u0065\u0020\u0065\u006E\u0074\u0065\u0072\u0020\u006D\u006F\u0062\u0069\u006C\u0065\u0020\u006E\u0075\u006D\u0062\u0065\u0072\u0073\u002C\u0020\u0061\u006E\u0064\u0020\u0073\u0065\u0070\u0061\u0072\u0061\u0074\u0065\u0020\u0074\u0068\u0065\u006D\u0020\u0077\u0069\u0074\u0068\u0020\u0022\u003B\u0022\u002E","smsReceiveErrorTips":"\u0054\u0068\u0065\u0020\u0065\u006E\u0074\u0065\u0072\u0065\u0064\u0020\u006D\u006F\u0062\u0069\u006C\u0065\u0020\u006E\u0075\u006D\u0062\u0065\u0072\u0020\u0069\u0073\u0020\u0077\u0072\u006F\u006E\u0067\u002E","timeEarlyTips":"\u0053\u006F\u0072\u0072\u0079\u002C\u0020\u0074\u0068\u0065\u0020\u0065\u006E\u0074\u0065\u0072\u0065\u0064\u0020\u0073\u0063\u0068\u0065\u0064\u0075\u006C\u0065\u0064\u0020\u0073\u0068\u006F\u0072\u0074\u0020\u006D\u0065\u0073\u0073\u0061\u0067\u0065\u0020\u0074\u0069\u006D\u0065\u0020\u0069\u0073\u0020\u0065\u0061\u0072\u006C\u0069\u0065\u0072\u0020\u0074\u0068\u0061\u006E\u0020\u0074\u0068\u0065\u0020\u0063\u0075\u0072\u0072\u0065\u006E\u0074\u0020\u0074\u0069\u006D\u0065\u002C\u0020\u0070\u006C\u0065\u0061\u0073\u0065\u0020\u0072\u0065\u0074\u0072\u0079\u0020\u0061\u0066\u0074\u0065\u0072\u0020\u0063\u0068\u0065\u0063\u006B\u0069\u006E\u0067\u0020\u0069\u0074\u002E","searchkeyValue":"\u0046\u0069\u006E\u0064\u0069\u006E\u0067\u0020\u0061\u0020\u0063\u006F\u006E\u0074\u0061\u0063\u0074\u2026","saveSuccTips":"\u0054\u0068\u0065\u0020\u0073\u0068\u006F\u0072\u0074\u0020\u006D\u0065\u0073\u0073\u0061\u0067\u0065\u0020\u0072\u0065\u0063\u006F\u0072\u0064\u0020\u0073\u0065\u0074\u0074\u0069\u006E\u0067\u0073\u0020\u0068\u0061\u0076\u0065\u0020\u0062\u0065\u0065\u006E\u0020\u0073\u0061\u0076\u0065\u0064\u0020\u0073\u0075\u0063\u0063\u0065\u0073\u0073\u0066\u0075\u006C\u006C\u0079\u002E","delRecordNoSelectTips":"\u0050\u006C\u0065\u0061\u0073\u0065\u0020\u0073\u0065\u006C\u0065\u0063\u0074\u0020\u0074\u0068\u0065\u0020\u0073\u0068\u006F\u0072\u0074\u0020\u006D\u0065\u0073\u0073\u0061\u0067\u0065\u0073\u0020\u0074\u006F\u0020\u0062\u0065\u0020\u0064\u0065\u006C\u0065\u0074\u0065\u0064\u002E","delRecordConfirmTips":"\u0041\u0072\u0065\u0020\u0079\u006F\u0075\u0020\u0073\u0075\u0072\u0065\u0020\u0074\u006F\u0020\u0064\u0065\u006C\u0065\u0074\u0065\u0020\u0074\u0068\u0065\u0020\u0073\u0065\u006C\u0065\u0063\u0074\u0065\u0064\u0020\u0073\u0068\u006F\u0072\u0074\u0020\u006D\u0065\u0073\u0073\u0061\u0067\u0065\u0020\u0072\u0065\u0063\u006F\u0072\u0064\u0028\u0073\u0029\u003F","delRecordSucc":"\u0054\u0068\u0065\u0020\u0073\u0068\u006F\u0072\u0074\u0020\u006D\u0065\u0073\u0073\u0061\u0067\u0065\u0020\u0072\u0065\u0063\u006F\u0072\u0064\u0028\u0073\u0029\u0020\u0068\u0061\u0076\u0065\u0020\u0062\u0065\u0065\u006E\u0020\u0064\u0065\u006C\u0065\u0074\u0065\u0064\u0020\u0073\u0075\u0063\u0063\u0065\u0073\u0073\u0066\u0075\u006C\u006C\u0079\u002E","queryRecordEmpty":"\u0050\u006C\u0065\u0061\u0073\u0065\u0020\u0065\u006E\u0074\u0065\u0072\u0020\u0074\u0068\u0065\u0020\u0073\u0068\u006F\u0072\u0074\u0020\u006D\u0065\u0073\u0073\u0061\u0067\u0065\u0020\u0063\u006F\u006E\u0074\u0065\u006E\u0074\u0020\u0074\u006F\u0020\u0071\u0075\u0065\u0072\u0079\u002E","receiver":"\u0052\u0065\u0063\u0065\u0069\u0076\u0069\u006E\u0067\u0020\u0063\u006F\u006E\u0074\u0061\u0063\u0074","sendMsg":"\u0053\u0068\u006F\u0072\u0074\u0020\u006D\u0065\u0073\u0073\u0061\u0067\u0065\u0020\u0063\u006F\u006E\u0074\u0065\u006E\u0074","sendTime":"\u0053\u0065\u006E\u0064\u0069\u006E\u0067\u0020\u0074\u0069\u006D\u0065","editFunc":"\u0045\u0064\u0069\u0074","recordNoFind":"\u0046\u0061\u0069\u006C\u0065\u0064\u0020\u0066\u0069\u006E\u0064\u0020\u0079\u006F\u0075\u0072\u0020\u0071\u0075\u0065\u0072\u0069\u0065\u0064\u0020\u0073\u0068\u006F\u0072\u0074\u0020\u006D\u0065\u0073\u0073\u0061\u0067\u0065\u0020\u0072\u0065\u0063\u006F\u0072\u0064\u002E","noRecordTips":"\u0059\u006F\u0075\u0020\u0068\u0061\u0076\u0065\u0020\u006E\u006F\u0020\u0073\u0068\u006F\u0072\u0074\u0020\u006D\u0065\u0073\u0073\u0061\u0067\u0065\u0020\u0073\u0065\u006E\u0064\u0069\u006E\u0067\u0020\u0072\u0065\u0063\u006F\u0072\u0064\u002E","sendMsgBtnName":"\u0057\u0072\u0069\u0074\u0065\u0020\u0061\u0020\u0073\u0068\u006F\u0072\u0074\u0020\u006D\u0065\u0073\u0073\u0061\u0067\u0065\u0020\u006E\u006F\u0077","first":"\u0046\u0069\u0072\u0073\u0074\u0020\u0070\u0061\u0067\u0065","prev":"\u0050\u0072\u0065\u0076\u0069\u006F\u0075\u0073\u0020\u0070\u0061\u0067\u0065","next":"\u004E\u0065\u0078\u0074\u0020\u0070\u0061\u0067\u0065","end":"\u0045\u006E\u0064\u0020\u0070\u0061\u0067\u0065","smsSaveErr":"\u0046\u0061\u0069\u006C\u0065\u0064\u0020\u0074\u006F\u0020\u0073\u0061\u0076\u0065\u0020\u0074\u0068\u0065\u0020\u0063\u006F\u006E\u0074\u0061\u0063\u0074\u002E","timeSendSucc":"\u0054\u0068\u0065\u0020\u0073\u0063\u0068\u0065\u0064\u0075\u006C\u0065\u0064\u0020\u0073\u0068\u006F\u0072\u0074\u0020\u006D\u0065\u0073\u0073\u0061\u0067\u0065\u0073\u0020\u0068\u0061\u0076\u0065\u0020\u0062\u0065\u0065\u006E\u0020\u0073\u0065\u006E\u0074\u0020\u0063\u006F\u006D\u0070\u006C\u0065\u0074\u0065\u006C\u0079\u002E","sendMsgSucc":"\u0054\u0068\u0065\u0020\u0073\u0068\u006F\u0072\u0074\u0020\u006D\u0065\u0073\u0073\u0061\u0067\u0065\u0073\u0020\u0068\u0061\u0076\u0065\u0020\u0062\u0065\u0065\u006E\u0020\u0073\u0065\u006E\u0074\u0020\u0063\u006F\u006D\u0070\u006C\u0065\u0074\u0065\u006C\u0079\u002E","receiverIndex":"\u0042\u0061\u0074\u0063\u0068\u0020\u007B\u0030\u007D","savedas":"\u0053\u0061\u0076\u0065\u0064\u0020\u0061\u0073","modifyLinkMan":"\u004D\u006F\u0064\u0069\u0066\u0079","delLinkMan":"\u0044\u0065\u006C\u0065\u0074\u0065","editLinkMan":"\u0045\u0064\u0069\u0074\u0020\u0061\u0020\u0063\u006F\u006E\u0074\u0061\u0063\u0074","delLinkManTips":"\u0044\u006F\u0020\u0079\u006F\u0075\u0020\u0077\u0061\u006E\u0074\u0020\u0074\u006F\u0020\u0064\u0065\u006C\u0065\u0074\u0065\u0020\u0074\u0068\u0065\u0020\u0063\u006F\u006E\u0074\u0061\u0063\u0074\u003F","delLinkManSucc":"\u0044\u0065\u006C\u0065\u0074\u0069\u006E\u0067\u0020\u0061\u0020\u0063\u006F\u006E\u0074\u0061\u0063\u0074\u0020\u0073\u0075\u0063\u0063\u0065\u0065\u0064\u0065\u0064","sysTips":"\u0053\u0079\u0073\u0074\u0065\u006D\u0020\u0070\u0072\u006F\u006D\u0070\u0074","closeSMSTips":"\u0044\u006F\u0020\u0079\u006F\u0075\u0020\u0077\u0061\u006E\u0074\u0020\u0074\u006F\u0020\u0067\u0069\u0076\u0065\u0020\u0075\u0070\u0020\u0073\u0065\u006E\u0064\u0069\u006E\u0067\u0020\u006F\u0066\u0020\u0074\u0068\u0069\u0073\u0020\u0073\u0068\u006F\u0072\u0074\u0020\u006D\u0065\u0073\u0073\u0061\u0067\u0065\u003F\u0020\u0054\u0068\u0065\u0020\u0065\u0064\u0069\u0074\u0065\u0064\u0020\u0073\u0068\u006F\u0072\u0074\u0020\u006D\u0065\u0073\u0073\u0061\u0067\u0065\u0020\u0063\u006F\u006E\u0074\u0065\u006E\u0074\u0020\u0077\u0069\u006C\u006C\u0020\u006E\u006F\u0074\u0020\u0062\u0065\u0020\u0073\u0061\u0076\u0065\u0064\u0020\u0069\u0066\u0020\u0079\u006F\u0075\u0020\u006C\u0065\u0061\u0076\u0065\u0020\u006E\u006F\u0077\u002E","noTimeRecordTips":"\u0059\u006F\u0075\u0020\u0073\u0074\u0069\u006C\u006C\u0020\u0068\u0061\u0076\u0065\u0020\u006E\u006F\u0020\u0072\u0065\u0063\u006F\u0072\u0064\u0020\u006F\u0066\u0020\u0073\u0063\u0068\u0065\u0064\u0075\u006C\u0065\u0064\u0020\u0073\u0065\u006E\u0064\u0020\u006D\u0065\u0073\u0073\u0061\u0067\u0065","Turned":"\u0054\u0075\u0072\u006E\u0065\u0064","Texting":"\u0074\u0065\u0078\u0074\u0069\u006E\u0067","send":"\u0073\u0065\u006E\u0064","send_50_divide":"\u0059\u006F\u0075\u0020\u0063\u0061\u006E\u0020\u0073\u0065\u006E\u0064\u0020\u0075\u0070\u0020\u0074\u006F\u0020\u0035\u0030\u0020\u0070\u0065\u006F\u0070\u006C\u0065\u0020\u0061\u0074\u0020\u006F\u006E\u0065\u0020\u0074\u0069\u006D\u0065\u002C\u0020\u0074\u0068\u0069\u0073\u0020\u006D\u0065\u0073\u0073\u0061\u0067\u0065\u0020\u0077\u0069\u006C\u006C\u0020\u0062\u0065\u0020\u0064\u0069\u0076\u0069\u0064\u0065\u0064\u0020\u0069\u006E\u0074\u006F\u0020\u0074\u0068\u0065\u0020\u0066\u006F\u006C\u006C\u006F\u0077\u0069\u006E\u0067","batches_sent":"\u0062\u0061\u0074\u0063\u0068\u0065\u0073\u0020\u0074\u006F\u0020\u0073\u0065\u006E\u0074\u0021","Texted":"\u0054\u0065\u0078\u0074\u0065\u0064","receiving_user":"\u0072\u0065\u0063\u0065\u0069\u0076\u0069\u006E\u0067\u0020\u0075\u0073\u0065\u0072","Continuetowritemessages":"\u0043\u006F\u006E\u0074\u0069\u006E\u0075\u0065\u0020\u0074\u006F\u0020\u0077\u0072\u0069\u0074\u0065\u0020\u006D\u0065\u0073\u0073\u0061\u0067\u0065\u0073","contacts_saved":"\u0054\u0068\u0065\u0020\u0066\u006F\u006C\u006C\u006F\u0077\u0069\u006E\u0067\u0020\u0063\u006F\u006E\u0074\u0061\u0063\u0074\u0073\u0020\u0068\u0061\u0076\u0065\u0020\u0062\u0065\u0065\u006E\u0020\u0073\u0061\u0076\u0065\u0064\u0020\u0074\u006F\u0020\u0074\u0068\u0065\u0020\u0061\u0064\u0064\u0072\u0065\u0073\u0073\u0020\u0062\u006F\u006F\u006B","Phonenumberformatwrong":"\u0050\u0068\u006F\u006E\u0065\u0020\u006E\u0075\u006D\u0062\u0065\u0072\u0020\u0066\u006F\u0072\u006D\u0061\u0074\u0020\u0069\u0073\u0020\u0077\u0072\u006F\u006E\u0067","Fixedtelephonemalformed":"\u0046\u0069\u0078\u0065\u0064\u0020\u0074\u0065\u006C\u0065\u0070\u0068\u006F\u006E\u0065\u0020\u006D\u0061\u006C\u0066\u006F\u0072\u006D\u0065\u0064","Faxformaterror":"\u0046\u0061\u0078\u0020\u006E\u0075\u006D\u0062\u0065\u0072\u0020\u0066\u006F\u0072\u006D\u0061\u0074\u0020\u0065\u0072\u0072\u006F\u0072","Zipformaterror":"\u005A\u0069\u0070\u0020\u0066\u006F\u0072\u006D\u0061\u0074\u0020\u0065\u0072\u0072\u006F\u0072","setaliasessuccessfully":"\u0073\u0065\u0074\u0020\u006D\u0061\u0069\u006C\u0020\u0061\u006C\u0069\u0061\u0073\u0065\u0073\u0020\u0073\u0075\u0063\u0063\u0065\u0073\u0073\u0066\u0075\u006C\u006C\u0079","DeletingAliassuccess":"\u0044\u0065\u006C\u0065\u0074\u0069\u006E\u0067\u0020\u0041\u006C\u0069\u0061\u0073\u0020\u003F\u003F\u0073\u0075\u0063\u0063\u0065\u0073\u0073","enteralias":"\u0050\u006C\u0065\u0061\u0073\u0065\u0020\u0065\u006E\u0074\u0065\u0072\u0020\u0074\u0068\u0065\u0020\u006D\u0061\u0069\u006C\u0062\u006F\u0078\u0020\u0061\u006C\u0069\u0061\u0073","setlanguageSuccessfully":"\u0073\u0065\u0074\u0020\u006C\u0061\u006E\u0067\u0075\u0061\u0067\u0065\u0020\u0053\u0075\u0063\u0063\u0065\u0073\u0073\u0066\u0075\u006C\u006C\u0079","Setskinsuccessfully":"\u0053\u0065\u0074\u0020\u0073\u006B\u0069\u006E\u0020\u0073\u0075\u0063\u0063\u0065\u0073\u0073\u0066\u0075\u006C\u006C\u0079","Sentsuccessfully":"\u0053\u0065\u006E\u0074\u0020\u0073\u0075\u0063\u0063\u0065\u0073\u0073\u0066\u0075\u006C\u006C\u0079","Sendfailed":"\u0053\u0065\u006E\u0064\u0020\u0066\u0061\u0069\u006C\u0065\u0064","sending":"\u0073\u0065\u006E\u0064\u0069\u006E\u0067","boundphonenumbers":"\u0059\u006F\u0075\u0020\u0068\u0061\u0076\u0065\u0020\u006E\u006F\u0074\u0020\u0062\u006F\u0075\u006E\u0064\u0020\u0070\u0068\u006F\u006E\u0065\u0020\u006E\u0075\u006D\u0062\u0065\u0072\u0073\u002C\u0065\u006E\u0074\u0065\u0072\u0020\u0022\u0053\u0065\u0074\u0074\u0069\u006E\u0067\u0073\u0022\u0020\u002D\u0020\u0022\u0061\u0063\u0063\u006F\u0075\u006E\u0074\u0020\u006E\u0075\u006D\u0062\u0065\u0072\u0020\u0061\u006E\u0064\u0020\u0073\u0065\u0063\u0075\u0072\u0069\u0074\u0079\u0022\u0020\u0074\u006F\u0020\u0062\u006F\u0075\u006E\u0064\u0020\u0079\u006F\u0075\u0072\u0020\u0070\u0068\u006F\u006E\u0065\u0020\u006E\u0075\u006D\u0062\u0065\u0072\u002E","Todayyouhaveonly":"\u0054\u006F\u0064\u0061\u0079\u0020\u0079\u006F\u0075\u0020\u0068\u0061\u0076\u0065\u0020\u006F\u006E\u006C\u0079","messagesleft":"\u006D\u0065\u0073\u0073\u0061\u0067\u0065\u0073\u0020\u006C\u0065\u0066\u0074\u0021","suretoleave":"\u0059\u006F\u0075\u0020\u0073\u0074\u0069\u006C\u006C\u0020\u0068\u0061\u0076\u0065\u0020\u006E\u006F\u0074\u0020\u0073\u0065\u006E\u0074\u0020\u0074\u006F\u0020\u0073\u006F\u006D\u0065\u0020\u006F\u0066\u0020\u0074\u0068\u0065\u0020\u0063\u006F\u006E\u0074\u0061\u0063\u0074\u0073\u002C\u0020\u0073\u0075\u0072\u0065\u0020\u0074\u006F\u0020\u006C\u0065\u0061\u0076\u0065\u0020\u0074\u0068\u0069\u0073\u0020\u0070\u0061\u0067\u0065\u003F","sentandsave":"\u0054\u0068\u0069\u0073\u0020\u006D\u0065\u0073\u0073\u0061\u0067\u0065\u0020\u0073\u0065\u006E\u0074\u0020\u0073\u0075\u0063\u0063\u0065\u0073\u0073\u0066\u0075\u006C\u006C\u0079\u002C\u0020\u0061\u006E\u0064\u0020\u0068\u0061\u0076\u0065\u0020\u0062\u0065\u0065\u006E\u0020\u0073\u0061\u0076\u0065\u0064\u0020\u0074\u006F\u0020\u0074\u0068\u0065\u0020\u0022\u004D\u0065\u0073\u0073\u0061\u0067\u0065\u0020\u004C\u006F\u0067\u0022","CheckNow":"\u0043\u0068\u0065\u0063\u006B\u0020\u004E\u006F\u0077","SMSnotsaved":"\u0054\u0068\u0065\u0020\u0053\u004D\u0053\u0020\u0068\u0061\u0073\u0020\u006E\u006F\u0074\u0020\u0062\u0065\u0065\u006E\u0020\u0073\u0061\u0076\u0065\u0064\u0020\u0079\u0065\u0074\u002E","Immediatelyturnautosave":"\u0049\u006D\u006D\u0065\u0064\u0069\u0061\u0074\u0065\u006C\u0079\u0020\u0074\u0075\u0072\u006E\u0020\u0061\u0075\u0074\u006F\u0073\u0061\u0076\u0065","storedtosend":"\u0054\u0068\u0069\u0073\u0020\u006D\u0065\u0073\u0073\u0061\u0067\u0065\u0020\u0069\u0073\u0020\u0074\u0065\u006D\u0070\u006F\u0072\u0061\u0072\u0069\u006C\u0079\u0020\u0073\u0074\u006F\u0072\u0065\u0064\u0020\u0069\u006E\u0020\u0074\u0068\u0065\u0020\u0022\u0074\u0069\u006D\u0065\u0020\u006D\u0065\u0073\u0073\u0061\u0067\u0065\u0022\u002C\u0020\u0069\u0074\u0020\u0077\u0069\u006C\u006C\u0020\u0062\u0065\u0020\u0073\u0065\u006E\u0064\u0020\u0061\u0074\u0020\u0074\u0068\u0065\u0020\u0074\u0069\u006D\u0065\u0020\u0079\u006F\u0075\u0020\u0073\u0070\u0065\u0063\u0069\u0066\u0079\u002E","setsuccessfully":"\u0073\u0065\u0074\u0020\u0022\u0073\u0061\u0076\u0065\u0020\u0053\u004D\u0053\u0020\u0072\u0065\u0063\u006F\u0072\u0064\u0020\u0061\u0075\u0074\u006F\u006D\u0061\u0074\u0069\u0063\u0061\u006C\u006C\u0079\u0022\u0020\u0073\u0075\u0063\u0063\u0065\u0073\u0073\u0066\u0075\u006C\u006C\u0079","Youhaveset":"\u0059\u006F\u0075\u0020\u0068\u0061\u0076\u0065\u0020\u0073\u0065\u0074\u0020\u0022\u0073\u0061\u0076\u0065\u0020\u006D\u0065\u0073\u0073\u0061\u0067\u0065\u0073\u0020\u0072\u0065\u0063\u006F\u0072\u0064\u0073\u0020\u0061\u0075\u0074\u006F\u006D\u0061\u0074\u0069\u0063\u0061\u006C\u006C\u0079\u0022\u002E","fillincontentinformation":"\u0050\u006C\u0065\u0061\u0073\u0065\u0020\u0066\u0069\u006C\u006C\u0020\u0069\u006E\u0020\u0074\u0068\u0065\u0020\u0063\u006F\u006E\u0074\u0065\u006E\u0074\u0020\u006F\u0066\u0020\u0069\u006E\u0066\u006F\u0072\u006D\u0061\u0074\u0069\u006F\u006E"};
