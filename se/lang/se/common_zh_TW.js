﻿function CreateNameSpace(ns){if(!ns||typeof(ns)!="string")return;ns=ns.split(".");var o=(window[ns[0]]=window[ns[0]]||{});for(i=1;i<ns.length;i++){var ni=ns[i];o=(o[ni]=o[ni]||{});}}CreateNameSpace("Lang.Common");Lang.Common={"OK":"\u78BA\u5B9A","BackToHome":"\u8FD4\u56DE\u9996\u9801","Success":"\u6210\u529F","Back":"\u8FD4\u56DE","page_next":"\u4E0B\u4E00\u9801","page_prefix":"\u6BCF\u9801","page_suffix":"\u689D","page_index":"\u9996\u9801","page_pre":"\u4E0A\u4E00\u9801","page_suf":"\u5C3E\u9801","sequence":"\u5E8F\u5217","create_time":"\u5275\u5EFA\u6642\u9593","operation":"\u64CD\u4F5C","delete":"\u522A\u9664","update":"\u4FEE\u6539","power":"\u6B0A\u9650","modify_time":"\u4FEE\u6539\u6642\u9593","delete_tip":"\u78BA\u5BE6\u8981\u522A\u9664\u6B64\u8A18\u9304\u55CE\uFF1F","Info":"\u8A73\u60C5","corp_id":"\u4F01\u696D\u0069\u0064","search":"\u67E5\u8A62","select_option_choose":"\u8ACB\u9078\u64C7","statusNormal":"\u6B63\u5E38","statusPause":"\u66AB\u505C","sureToDelete":"\u78BA\u5B9A\u8981\u522A\u9664","choice":"\u9078\u64C7","not_fonud_data":"\u6C92\u6709\u6578\u64DA","uin":"\u0049\u0044","showall":"\u986F\u793A\u6240\u6709","form_rule":"\u8868\u55AE\u586B\u5BEB\u898F\u5247\u5982\u4E0B","Resume":"\u6062\u5FA9","Off":"\u6CE8\u92B7","Resume_tip":"\u78BA\u5BE6\u8981\u6062\u5FA9\u6B64\u8A18\u9304\u55CE\uFF1F","Off_tip":"\u78BA\u5BE6\u8981\u6CE8\u92B7\u6B64\u8A18\u9304\u55CE\uFF1F","user":"\u7528\u6236","corp":"\u4F01\u696D","login_timeout":"\u767B\u9304\u8D85\u6642","return_login":"\u8FD4\u56DE\u767B\u9304","sys_tip":"\u7CFB\u7D71\u63D0\u793A","operation_error":"\u64CD\u4F5C\u51FA\u932F","not_power":"\u5C0D\u4E0D\u8D77\u002C\u0020\u60A8\u6C92\u6709\u6B0A\u9650\u54E6","Yes":"\u662F","No":"\u5426","delete_choosed":"\u522A\u9664\u6240\u9078\u9805","SelectAll":"\u5168\u9078","operation_sucess":"\u64CD\u4F5C\u6210\u529F","upload_success":"\u4E0A\u50B3\u6210\u529F","uploading":"\u6B63\u5728\u4E0A\u50B3","loading":"\u6B63\u5728\u8F09\u5165","revise_system_default":"\u6062\u5FA9\u7CFB\u7D71\u9ED8\u8A8D","importing":"\u6B63\u5728\u5C0E\u5165","back":"\u8FD4\u56DE","processing":"\u6B63\u5728\u8655\u7406","CHOOSE":"\u9078\u64C7","control_findStr":"\u67E5\u627E\u5230\uFF1A","control_findNoStr":"\u6C92\u6709\u627E\u5230\u7D50\u679C\uFF01","control_inputEmailTip":"\u8ACB\u8F38\u5165\u59D3\u540D\u3001\u90F5\u4EF6\u5730\u5740","control_inputEmailGroupTip":"\u8ACB\u8F38\u5165\u90F5\u4EF6\u7D44\u540D\uFF0C\u6216\u90F5\u7BB1\u5730\u5740","control_empty":"\u6E05\u7A7A","control_selectedMailGroup":"\u5DF2\u9078\u64C7\u90F5\u4EF6\u7D44","control_selectUser":"\u9078\u64C7\u6210\u54E1","control_selectMailGroup":"\u9078\u64C7\u90F5\u4EF6\u7D44","control_selectUserTip":"\u8ACB\u5F9E\u4E0B\u9762\u9078\u64C7\u8981\u6DFB\u52A0\u7684\u6210\u54E1","control_selectedUserTip":"\u5DF2\u9078\u64C7\u6210\u54E1","control_selectDepart":"\u9078\u64C7\u90E8\u9580","choose_a_record":"\u81F3\u5C11\u9078\u64C7\u4E00\u689D\u8A18\u9304","tag_page_wap_item_page":"\u9801","view_power":"\u67E5\u770B\u6B0A\u9650","page_next_user":"\u4E0B\u9801","page_pre_user":"\u4E0A\u9801","page_suf_user":"\u672B\u9801","step_next":"\u4E0B\u4E00\u6B65","add":"\u6DFB\u52A0","importFailed":"\u5C0E\u5165\u5931\u6557","add_impower":"\u6DFB\u52A0\u6388\u6B0A\u90F5\u7BB1","last_login":"\u4E0A\u6B21\u767B\u9304","option_choose":"\u8ACB\u9078\u64C7","auditpower":"\u5BE9\u8A08\u6B0A\u9650","userpower":"\u7528\u6236\u6B0A\u9650","adminpower":"\u7BA1\u7406\u6B0A\u9650","invalid_time":"\u5931\u6548\u65E5\u671F","copy":"\u5FA9\u5236","recover":"\u6062\u5FA9","unlock":"\u89E3\u9396","lock":"\u9396\u5B9A","Cancel":"\u53D6\u6D88","reserved_by_china_mobile":"\u4E2D\u570B\u79FB\u52D5\u901A\u4FE1\u7248\u6B0A\u6240\u6709","bold":"\u52A0\u7C97","italic":"\u659C\u9AD4","underline":"\u4E0B\u5283\u7DDA","typeface":"\u5B57\u9AD4","Font_Size":"\u5B57\u865F","font_color":"\u5B57\u9AD4\u984F\u8272","Background_Color":"\u80CC\u666F\u8272","unordered_list":"\u7121\u5E8F\u5217\u8868","Ordered_list":"\u6709\u5E8F\u5217\u8868","Align":"\u5C45\u4E2D\u5C0D\u9F4A","Align_Right":"\u53F3\u5C0D\u9F4A","Align_left":"\u5DE6\u5C0D\u9F4A","name":"\u59D3\u540D","ge":"\u500B","paste":"\u7C98\u8CBC","cut":"\u526A\u5207","enterkeyword":"\u8ACB\u8F38\u5165\u95DC\u9375\u5B57","find":"\u67E5\u627E\u5230","Noresultsfound":"\u6C92\u6709\u627E\u5230\u7D50\u679C\u0021","email":"\u90F5\u4EF6","space":"\u5360\u7528","justnow":"\u525B\u525B","minutesago":"\u5206\u9418\u524D","hoursago":"\u5C0F\u6642\u524D","earlymorning":"\u51CC\u6668","Morning":"\u4E0A\u5348","noon":"\u4E2D\u5348","afternoon":"\u4E0B\u5348","night":"\u665A\u4E0A","Lateatnight":"\u6DF1\u591C","control_selectMailGroupTip":"\u8ACB\u5F9E\u4E0B\u9762\u9078\u64C7\u8981\u6DFB\u52A0\u7684\u90F5\u4EF6\u7D44","1111111":"\u007B\u0022\u0043\u004F\u0052\u0050\u005F\u004C\u0049\u0053\u0054\u0022\u003A\u0022\u4F01\u696D\u5217\u8868\u0022\u002C\u0022\u0043\u004F\u0052\u0050\u005F\u0050\u0041\u0043\u004B\u0041\u0047\u0045\u0053\u0022\u003A\u0022\u5957\u9910\u7BA1\u7406\u0022\u002C\u0022\u0043\u004F\u0052\u0050\u005F\u0052\u004F\u004C\u0045\u0022\u003A\u0022\u89D2\u8272\u7BA1\u7406\u0022\u002C\u0022\u0055\u0053\u0045\u0052\u005F\u0055\u0053\u0045\u0052\u0022\u003A\u0022\u90E8\u9580\u7FA4\u7D44\u0022\u002C\u0022\u0055\u0053\u0045\u0052\u005F\u0047\u0052\u004F\u0055\u0050\u0022\u003A\u0022\u5B89\u5168\u90F5\u4EF6\u7D44\u0022\u002C\u0022\u0053\u0041\u0046\u0045\u005F\u0053\u0059\u0053\u0022\u003A\u0022\u7CFB\u7D71\u5B89\u5168\u0022\u002C\u0022\u0053\u0041\u0046\u0045\u005F\u0053\u0059\u0053\u005F\u0057\u0045\u0041\u004B\u0050\u0057\u0044\u0022\u003A\u0022\u5F31\u5BC6\u78BC\u5EAB\u0022\u002C\u0022\u0053\u0041\u0046\u0045\u005F\u0053\u0059\u0053\u005F\u0053\u004B\u0049\u004E\u0022\u003A\u0022\u7CFB\u7D71\u63DB\u819A\u0022\u002C\u0022\u0053\u0041\u0046\u0045\u005F\u0053\u0059\u0053\u005F\u0049\u0050\u004C\u0049\u004D\u0049\u0054\u0022\u003A\u0022\u767B\u9304\u0049\u0050\u9650\u5236\u0022\u002C\u0022\u0053\u0041\u0046\u0045\u005F\u0053\u0059\u0053\u005F\u0053\u0045\u004E\u0053\u0049\u0054\u0049\u0056\u0045\u0022\u003A\u0022\u654F\u611F\u5B57\u8A2D\u7F6E\u0022\u002C\u0022\u0053\u0041\u0046\u0045\u005F\u0053\u0059\u0053\u005F\u0050\u0057\u0044\u0022\u003A\u0022\u5BC6\u78BC\u5B89\u5168\u8A2D\u7F6E\u0022\u002C\u0022\u0053\u0041\u0046\u0045\u005F\u0050\u0055\u0052\u0056\u0049\u0045\u0057\u0022\u003A\u0022\u6B0A\u9650\u7BA1\u7406\u0022\u002C\u0022\u0053\u0041\u0046\u0045\u005F\u0050\u0055\u0052\u0056\u0049\u0045\u0057\u005F\u0041\u0044\u004D\u0049\u004E\u0022\u003A\u0022\u7BA1\u7406\u54E1\u0022\u002C\u0022\u0053\u0041\u0046\u0045\u005F\u0050\u0055\u0052\u0056\u0049\u0045\u0057\u005F\u0050\u004F\u0057\u0045\u0052\u0022\u003A\u0022\u6B0A\u9650\u89D2\u8272\u0022\u002C\u0022\u0053\u0041\u0046\u0045\u005F\u0050\u0055\u0052\u0056\u0049\u0045\u0057\u005F\u0053\u0045\u0052\u0056\u0049\u0043\u0045\u0022\u003A\u0022\u7528\u6236\u5957\u9910\u0022\u002C\u0022\u0053\u0041\u0046\u0045\u005F\u0043\u0048\u0045\u0043\u004B\u0022\u003A\u0022\u76E3\u63A7\u8207\u5BE9\u6838\u0022\u002C\u0022\u0053\u0041\u0046\u0045\u005F\u0043\u0048\u0045\u0043\u004B\u005F\u004D\u004F\u004E\u0049\u0054\u004F\u0022\u003A\u0022\u90F5\u4EF6\u76E3\u63A7\u0022\u002C\u0022\u0053\u0041\u0046\u0045\u005F\u0043\u0048\u0045\u0043\u004B\u005F\u0041\u0055\u0044\u0049\u0054\u0022\u003A\u0022\u90F5\u4EF6\u5BE9\u6838\u0022\u002C\u0022\u0052\u0045\u0050\u004F\u0052\u0054\u005F\u0044\u0041\u0054\u0041\u0022\u003A\u0022\u65E5\u5FD7\u6578\u64DA\u0022\u002C\u0022\u0052\u0045\u0050\u004F\u0052\u0054\u005F\u0044\u0041\u0054\u0041\u005F\u004C\u004F\u0047\u0049\u004E\u0022\u003A\u0022\u767B\u9304\u65E5\u5FD7\u0022\u002C\u0022\u0052\u0045\u0050\u004F\u0052\u0054\u005F\u0044\u0041\u0054\u0041\u005F\u004F\u0050\u0022\u003A\u0022\u64CD\u4F5C\u65E5\u5FD7\u0022\u002C\u0022\u0052\u0045\u0050\u004F\u0052\u0054\u005F\u0044\u0041\u0054\u0041\u005F\u004D\u0041\u0049\u004C\u0022\u003A\u0022\u90F5\u4EF6\u65E5\u5FD7\u0022\u002C\u0022\u0052\u0045\u0050\u004F\u0052\u0054\u005F\u0044\u0041\u0054\u0041\u005F\u0041\u0055\u0044\u0049\u0022\u003A\u0022\u76E3\u63A7\u8207\u5BE9\u6838\u65E5\u5FD7\u0022\u002C\u0022\u0052\u0045\u0050\u004F\u0052\u0054\u005F\u0044\u0041\u0054\u0041\u005F\u0053\u0045\u004E\u0053\u0049\u0054\u0049\u0056\u0045\u0022\u003A\u0022\u654F\u611F\u5B57\u904E\u6FFE\u65E5\u5FD7\u0022\u002C\u0022\u0052\u0045\u0050\u004F\u0052\u0054\u005F\u0053\u0054\u0041\u0054\u0049\u0053\u0054\u0049\u0043\u0053\u0022\u003A\u0022\u7D71\u8A08\u5831\u8868\u0022\u002C\u0022\u0052\u0045\u0050\u004F\u0052\u0054\u005F\u0053\u0054\u0041\u0054\u0049\u0053\u0054\u0049\u0043\u0053\u005F\u0054\u004F\u0050\u0022\u003A\u0022\u6D3B\u8E8D\u7528\u6236\u6578\u0022\u002C\u0022\u0052\u0045\u0050\u004F\u0052\u0054\u005F\u0053\u0054\u0041\u0054\u0049\u0053\u0054\u0049\u0043\u0053\u005F\u004D\u0041\u0049\u004C\u0053\u0049\u005A\u0045\u0022\u003A\u0022\u90F5\u4EF6\u5927\u5C0F\u5206\u5E03\u0022\u002C\u0022\u0052\u0045\u0050\u004F\u0052\u0054\u005F\u0053\u0054\u0041\u0054\u0049\u0053\u0054\u0049\u0043\u0053\u005F\u0041\u0043\u0043\u0045\u0053\u0053\u0022\u003A\u0022\u90F5\u7BB1\u8A2A\u554F\u60C5\u6CC1\u0022\u002C\u0022\u0052\u0045\u0050\u004F\u0052\u0054\u005F\u0053\u0054\u0041\u0054\u0049\u0053\u0054\u0049\u0043\u0053\u005F\u004D\u0041\u0049\u004C\u004E\u0055\u004D\u0022\u003A\u0022\u90F5\u4EF6\u6536\u767C\u91CF\u0022\u002C\u0022\u0056\u0041\u0053\u005F\u0041\u004E\u004E\u004F\u0055\u004E\u0043\u0045\u004D\u0045\u004E\u0054\u0022\u003A\u0022\u5167\u90E8\u516C\u544A\u0022\u002C\u0022\u0056\u0041\u0053\u005F\u0047\u0052\u004F\u0055\u0050\u0022\u003A\u0022\u90E8\u9580\u7FA4\u767C\u0022\u002C\u0022\u0056\u0041\u0053\u005F\u0050\u0055\u0042\u004C\u0049\u0043\u004D\u0041\u0049\u004C\u0022\u003A\u0022\u516C\u5171\u90F5\u7BB1\u0022\u002C\u0022\u0056\u0041\u0053\u005F\u004D\u0041\u0049\u004C\u0047\u0052\u0041\u004E\u0054\u0022\u003A\u0022\u90F5\u7BB1\u6388\u6B0A\u0022\u002C\u0022\u0043\u004F\u004E\u0046\u0049\u0047\u005F\u0049\u004E\u0046\u004F\u0022\u003A\u0022\u6211\u7684\u6A5F\u69CB\u0022\u002C\u0022\u0043\u004F\u004E\u0046\u0049\u0047\u005F\u0049\u004E\u0046\u004F\u005F\u0050\u0052\u0045\u0046\u0022\u003A\u0022\u57FA\u672C\u4FE1\u606F\u0022\u002C\u0022\u0043\u004F\u004E\u0046\u0049\u0047\u005F\u0049\u004E\u0046\u004F\u005F\u004C\u004F\u0047\u004F\u0022\u003A\u0022\u004C\u004F\u0047\u004F\u8A2D\u7F6E\u0022\u002C\u0022\u0043\u004F\u004E\u0046\u0049\u0047\u005F\u004D\u0041\u0049\u004C\u0022\u003A\u0022\u90F5\u7BB1\u7BA1\u7406\u0022\u002C\u0022\u0043\u004F\u004E\u0046\u0049\u0047\u005F\u004D\u0041\u0049\u004C\u005F\u0053\u0047\u0049\u004E\u0022\u003A\u0022\u7D71\u4E00\u7C3D\u540D\u0022\u002C\u0022\u0043\u004F\u004E\u0046\u0049\u0047\u005F\u004D\u0041\u0049\u004C\u005F\u004D\u004F\u0056\u0045\u0022\u003A\u0022\u90F5\u4EF6\u642C\u5BB6\u0022\u002C\u0022\u0043\u004F\u004E\u0046\u0049\u0047\u005F\u004D\u0041\u0049\u004C\u005F\u0041\u004E\u0054\u0049\u0053\u0050\u0041\u004D\u0022\u003A\u0022\u5916\u57DF\u9ED1\u540D\u55AE\u0022\u002C\u0022\u0043\u004F\u004E\u0046\u0049\u0047\u005F\u004D\u0041\u0049\u004C\u005F\u0046\u004F\u004C\u0044\u0045\u0052\u0022\u003A\u0022\u90F5\u4EF6\u593E\u540D\u7A31\u0022\u002C\u0022\u0043\u004F\u004E\u0046\u0049\u0047\u005F\u004D\u0041\u0049\u004C\u005F\u0043\u004F\u004E\u0046\u0022\u003A\u0022\u90F5\u4EF6\u6536\u767C\u9650\u5236\u0022\u002C\u0022\u0043\u004F\u004E\u0046\u0049\u0047\u005F\u0041\u0044\u0044\u0052\u0022\u003A\u0022\u901A\u8A0A\u9304\u7BA1\u7406\u0022\u002C\u0022\u0043\u004F\u004E\u0046\u0049\u0047\u005F\u0041\u0044\u0044\u0052\u005F\u0043\u004F\u004D\u004D\u004F\u004E\u0022\u003A\u0022\u5E38\u7528\u806F\u7CFB\u4EBA\u0022\u007D"};
