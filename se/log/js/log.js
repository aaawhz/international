(function ($) {
	$(function () {
		var isExtMail = parent.CC.isExtMail(),
			reqStr = {
				"login": isExtMail ? "publicMailLogin" : "userLogin",
				"send": isExtMail ? "publicMailOperator" : "mailOperator",
				"del": isExtMail ? "publicMailOperator" : "mailOperator",
				"op": isExtMail ? "publicOperator" : "userOperator"
			},
			types = [{
				type: "login",
				url: "/user.do?func=log:" + reqStr.login + "&type=2&sid=" + parent.gMain.sid,
				title: "最近30天登录记录",
				noLogMsg: "目前还没有产生登录日志",
				tableTitle: ["时间", "登录IP", "登录方式", "登录状态"],
				titleStyle: ["width = \"150\"", "", "", ""],
				field: ["time", "loginIp", "channel", "loginResult"],
				exps: ["",  "", "", ""]
			}, {
				type: "send",
				url: "/user.do?func=log:" + reqStr.send + "&mailtype=0&type=2&sid=" + parent.gMain.sid,
				title: "最近30天发信记录",
				noLogMsg: "您目前还没有发送过邮件",
				tableTitle: ["时间", "收件人", "主题", "投递状态"],
				titleStyle: ["width = \"100\"", "width = \"300\"", "", ""],
				field: ["time", "recUser", "mailSubJect", "sendStatus"],
				exps: ["",  "exp2", "mailSubJect", ""]
			}, {
				type: "recv",
				url: "/user.do?func=log:mailOperator&mailtype=1&type=2&sid=" + parent.gMain.sid,
				title: "最近30天收信记录",
				noLogMsg: "您目前还没有接收过邮件",
				tableTitle: ["时间", "发件人", "主题", "收信状态"],
				titleStyle: ["width = \"100\"", "width = \"200\"", "", ""],
				field: ["time", "sendUser", "mailSubJect", "sendStatus"],
				exps: ["",  "exp1", "mailSubJect", ""]
			}, {
				type: "del",
				url: "/user.do?func=log:" + reqStr.del + "&mailtype=2&type=2&sid=" + parent.gMain.sid,
				title: "最近30天删信记录",
				noLogMsg: "您目前还没有删除过邮件",
				tableTitle: ["时间", "发件人", "主题", "删信状态"],
				titleStyle: ["width = \"100\"", "width = \"200\"", "", ""],
				field: ["time", "sendUser", "mailSubJect", "mark"],
				exps: ["",  "exp1", "mailSubJect", ""]
			}, {
				type: "agent",
				url: "/user.do?func=log:agentMailOperator&type=2&sid=" + parent.gMain.sid,
				title: "代收邮箱收取记录（最近30天）",
				noLogMsg: "您目前还没有代收过邮件",
				tableTitle: ["时间", "邮箱帐号", "收取方式", "收取状态"],
				titleStyle: ["width = \"100\"", "width = \"300\"", "width = \"200\"", ""],
				field: ["time", "agentAccount", "agentType", "agentResult"],
				exps: ["",  "", "", ""]
			}, {
				type: "operate",
				url: "/user.do?func=log:" + reqStr.op + "&type=1&sid=" + parent.gMain.sid,
				title: "最近30天操作记录",
				noLogMsg: "您目前没有操作记录",
				tableTitle: ["时间", "操作者", "账号", "操作类型", "相关数据", "结果"],
				titleStyle: ["", "", "", "", "", ""],
				field: ["time", "opName", "opUserId", "opType", "opContent", "opStatus"],
				exps: ["", "exp1" ,"exp2", "", "", ""]
			}],
			currentType = 0,
			currentPage = 1,
			pageSize = 20,
			dayCount = 30,
			type = GC.getUrlParamValue(location.href, "type"),
			ajax = null,
			pageCount;

		// 初始化
		(function init() {
			initDom();
			bindEvent();
			getData(types[currentType].url, {"dayCount": dayCount, "pageSize": pageSize, "currentPage": 1}, function (data) {
				pageCount = parseInt(data["var"].pageCount, 10);
				if (pageCount > 1) {
					updateSelect(pageCount);
					$(".bottomPageWrap").show();
				}
				showPageText();
			});
		})();

		// 初始化Dom
		function initDom () {
			var i = 0,
				tempData;


			switch (type) {
				case "login":
					currentType = 0;
					break;
				case "send":
					currentType = 1;
					break;
				case "recv":
					currentType = 2;
					break;
				case "del":
					currentType = 3;
					break;
				case "agent":
					currentType = 4;
					break;
				case "operate":
					currentType = 5;
					break;
			}
			$(".bottomPageWrap").hide();
			if (type !== "agent") {
				$(".topPageWrap > .loginSearch_paging").hide();
			}
			$(".topPageWrap > h2 > span").eq(0).html(types[currentType].title);
			if (isExtMail) {
				$(".loginSearchWrap > .loginSearchTab > li").eq(2).hide();
			}
			if (!parent.GC.check("MAIL_MANAGER_MAILPOP")) {
				$(".loginSearchWrap > .loginSearchTab > li").eq(4).hide();
			} else {
				if(parent.popList && parent.popList.length > 0){
					for(i = 0; i < parent.popList.length; i++) {
						tempData = parent.popList[i];
						$("#agentUser").append("<option value='" + tempData.email + "'>" + tempData.email + "</option>");
					}
				}
			}
			
			$(".loginSearchWrap .loginSearchTab li .current").removeClass("current");
			$(".loginSearchWrap > .loginSearchTab > li > a").eq(currentType).addClass("current");
		}

		// 更新翻页select控件
		function updateSelect (pageCount) {
			$("#selectPage").empty();
			for (var i = 0; i < pageCount; i++) {
				$("#selectPage").append("<option value=\"" + (i + 1) + "\">" + (i + 1) + "/" + pageCount + "</option>");
			}
		}

		// 给HTML元素绑定事件
		function bindEvent () {

			// tab点击切换不同类型的日志类型
			$(".loginSearchTab > li > a").click(function () {
				var index = $(".loginSearchTab > li > a").index($(this)),
					pars = {
						dayCount: dayCount,
						pageSize: pageSize,
						currentPage: 1,
						agentAccount: $("#agentUser").val()
					};

				currentType = index;
				currentPage = 1;
				$(".loginSearchTab > li > .current").removeClass("current");
				$(this).addClass("current");
				$(".topPageWrap > h2 > span").eq(0).html(types[index].title);

				// 如果是代收邮箱日志，显示右上角的select控件，否则不显示
				if (index !== 4) {
					$(".topPageWrap > .loginSearch_paging").hide();
				} else {
					$(".topPageWrap > .loginSearch_paging").show();
				}
				getData(types[index].url, pars, function (data) {
					pageCount = parseInt(data["var"].pageCount, 10);
					if (pageCount > 1) {
						updateSelect (pageCount);
						$(".bottomPageWrap").show();
					} else {
						$(".bottomPageWrap").hide();
					}
				});
			});

			$(".btn-page-first").click(function () {
				var pars = {};

				if (currentPage > 1) {
					currentPage = 1;
					showPageText();
					pars = {
						"dayCount": dayCount,
						"pageSize": pageSize,
						"currentPage": currentPage,
						"agentAccount": $("#agentUser").val()
					};
					getData(types[currentType].url, pars, function () {
						selectOption(currentPage);
					});
				}
			});

			$(".btn-page-pre").click(function () {
				var pars = {};

				if (currentPage > 1) {
					currentPage--;
					showPageText();
					pars = {
						"dayCount": dayCount,
						"pageSize": pageSize,
						"currentPage": currentPage,
						"agentAccount": $("#agentUser").val()
					};
					getData(types[currentType].url, pars, function () {
						selectOption(currentPage);
					});
				}
			});

			$(".btn-page-next").click(function () {
				var pars = {};

				if (currentPage < pageCount) {
					currentPage++;
					showPageText();
					pars = {
						"dayCount": dayCount,
						"pageSize": pageSize,
						"currentPage": currentPage,
						"agentAccount": $("#agentUser").val()
					};
					getData(types[currentType].url, pars, function () {
						selectOption(currentPage);
					});
				}
			});

			$(".btn-page-last").click(function () {
				var pars = {};

				if (currentPage < pageCount) {
					currentPage = pageCount;
					showPageText();
					pars = {
						"dayCount": dayCount,
						"pageSize": pageSize,
						"currentPage": currentPage,
						"agentAccount": $("#agentUser").val()
					};
					getData(types[currentType].url, pars, function () {
						selectOption(currentPage);
					});
				}
			});

			$("#selectPage").change(function () {
				var pars = {};

				currentPage = parseInt($(this).val(), 10);
				pars = {
					"dayCount": dayCount,
					"pageSize": pageSize,
					"currentPage": currentPage,
					"agentAccount": $("#agentUser").val()
				};
				getData(types[currentType].url, pars);
			});

			$("#agentUser").change(function () {
				var agentAccount = $(this).val(),
					pars = {
						"dayCount": dayCount,
						"pageSize": pageSize,
						"currentPage": 1,
						"agentAccount": agentAccount
					};
				
				currentPage = 1;
				getData(types[4].url, pars, function (data) {
					pageCount = parseInt(data["var"].pageCount, 10);
					if (pageCount > 1) {
						updateSelect(pageCount);
						$(".bottomPageWrap").show();
					} else {
						$(".bottomPageWrap").hide();
					}
				});
			});

			$(".boxLogTable").delegate(".btnViewDetails", "click", function () {
				var pars = {},
					me = this,
					recNum;

				if (+($(me).attr("isRequest")) !== 1) {
					pars = {
						"dayCount": dayCount,
						"currentPage": currentPage,
						"corpId": $(this).attr("corpId"),
						"recordAddr": $(this).attr("recordAddr"),
						"pageSize": pageSize
					};
					if (+($(me).attr("sendDetail")) === 5) {
						pars.reserve4 = $(this).attr("transId");
						pars.sendDetail = +($(this).attr("sendDetail"));
					} else {
						pars.transId = $(this).attr("transId");
					}
					getDetailData(pars, function () {
						$(me).attr({"isRequest": 1});
					}, me);
				} else {
					recNum = +($(this).attr("recNum"));
					if (recNum > 0) {
						$(me).parent().parent().nextAll().slice(0, recNum).toggle();
					}
				}
			});

			// 更新select option选择
			function selectOption(page) {
				$("#selectPage").children().eq(page - 1).prop("selected", true);
			}
		}

		function showPageText() {
			if (currentPage === 1) {
				$(".btn-page-pre").hide();
				$(".btn-page-pre").next().hide();
				$(".btn-page-first").hide();
				$(".btn-page-first").next().hide();
			} else {
				$(".btn-page-pre").show();
				$(".btn-page-pre").next().show();
				$(".btn-page-first").show();
				$(".btn-page-first").next().show();
			}

			if (currentPage === pageCount) {
				$(".btn-page-next").hide();
				$(".btn-page-next").next().hide();
				$(".btn-page-last").hide();
			} else {
				$(".btn-page-next").show();
				$(".btn-page-next").next().show();
				$(".btn-page-last").show();
			}
		}

		/**
		* 获取日志列表
		*/
		function getData(url, pars, callback) {
			var contentType = "application/json;";

			pars = top.JSON.stringify(pars);
			if (ajax && ajax.abort) {
				ajax.abort();
			}
			parent.CC.showMsg("数据加载中...", true, false, "option");
			ajax = $.ajax({
				type: "POST",
				contentType: contentType + "charset=UTF-8",
				url: getPostURL(url),
				dataType: "json",
				data: pars,
				success: function (data) {
					var html;

					data = (typeof data === "string") ? top.JSON.parse(data) : data;
					if (data.code === "S_OK") {
						html = "<table class=\"loginSearchTable\" width=\"100%\">";
						html += getTbTitHtml();
						html += getSuccessTbBodyHmtl(data);
						html += "</table>";
						$(".boxLogTable").html(html);
						parent.jQuery("#tipsfinish").hide();
						if (typeof callback === "function") {
							callback(data);
						}
					}
				},
				error: function (data) {
					var html;

					html = "<table class=\"loginSearchTable\" width=\"100%\">";
					html += getTbTitHtml();
					if (data !== ajax) {
						html += getErrorTbBodyHtml(types[currentType].noLogMsg);
					}
					html += "</table>";
					$(".boxLogTable").html(html);
					parent.jQuery("#tipsfinish").hide();
				}
			});
		}

		// 获取日志详情
		function getDetailData (pars, callback, scope) {
			var contentType = "application/json;",
				type = 0;

			pars = top.JSON.stringify(pars);
			parent.CC.showMsg("数据加载中...", false, false, "option");

			if (+($(scope).attr("sendDetail")) === 5) {
				type = 5;
			}
			$.ajax({
				type: "POST",
				contentType: contentType + "charset=UTF-8",
				url: getPostURL("/user?func=log:sendDetailMail&type=" + type + "&sid=" + parent.gMain.sid),
				dataType: "json",
				data: pars,
				success: function (data) {
					data = (typeof data === "string") ? top.JSON.parse(data) : data;
					if (data.code === "S_OK") {
						renderDetailHtml(data, scope);
						if (typeof callback === "function") {
							callback(data);
						}
					}
				}
			});

		}

		// 加载发信数据详情
		function renderDetailHtml(data, scope) {
			var html = [],
				len = 0,
				i = 0,
				tempData = "",
				fileds = {
					"user": "recUser",
					"subject": "mailSubJect",
					"status": "sendStatus"
				};

			if (+($(scope).attr("sendDetail")) === 5) {
				fileds = {
					"user": "opUserId",
					"subject": "opContent",
					"status": "opStatus" 
				};
			}

			for (len = data["var"].length; i < len; i++) {
				tempData = data["var"][i];

				html.push("<tr>");
				html.push("<td></td>");
				html.push("<td>", tempData[fileds.user], "</td>");
				html.push("<td>", tempData[fileds.subject], "</td>");
				html.push("<td>", tempData[fileds.status], "</td>");
				html.push("</tr>");
			}

			$(scope).attr("recNum", len);
			$(html.join("")).insertAfter($(scope).parent().parent());
			parent.jQuery("#tipsfinish").hide();
		}

		// 获取数据表格title html
		function getTbTitHtml () {
			var titleHtml = [],
				i = 0;

			titleHtml.push("<thead>");
			titleHtml.push("<tr>");
			for (; i < types[currentType].tableTitle.length ; i++) {
				titleHtml.push("<th " + types[currentType].titleStyle[i] + ">", types[currentType].tableTitle[i], "</th>");
			}
			titleHtml.push("</tr>");
			titleHtml.push("</thead>");

			return titleHtml.join("");
		}

		// 获取数据表格body html
		function getErrorTbBodyHtml (data) {
			var bodyHtml = [];

			bodyHtml.push("<tbody>", "<tr>", "<td colspan=\"" + types[currentType].field.length + "\">", "<p class=\"set_rule_box_tips\" style=\"display:block\">");
			bodyHtml.push(data);
			bodyHtml.push("</p>" ,"</td>" ,"<tr>", "</tbody>");

			return bodyHtml.join("");
		}

		// 获取成功表格body html
		function getSuccessTbBodyHmtl (data) {
			var bodyHtml = [],
				datas = [],
				i = 0,
				j = 0,
				k = 0,
				len,
				tempData,
				tempItems,
				tempItemsTitle,
				tempItemsLen,
				type;

			len = data["var"].datas.length;
			bodyHtml.push("<tbody>");
			if (len > 0) {
				for (i = 0; i < data["var"].datas.length; i++) {
					tempData = data["var"].datas[i];
					bodyHtml.push("<tr>", "<th colspan=\"" + types[currentType].field.length + "\">");
					bodyHtml.push(dataToStr(tempData.shortOperationTime));
					bodyHtml.push("</th>", "</tr>");
					for (j = 0; j < tempData.dtos.length; j ++) {
						bodyHtml.push("<tr>");
						bodyHtml.push("<td>", tempData.dtos[j][types[currentType].field[0]] , "</td>");
						bodyHtml.push("<td style=\"white-space:nowrap;overflow:hidden;text-overflow:ellipsis;\">");
						if (currentType === 1 || currentType === 2 || currentType === 3) {
							tempItems = tempData.dtos[j][types[currentType].field[1]].split(";");
							tempItemsTitle = tempData.dtos[j][types[currentType].exps[1]].split(";");
							for (k = 0, tempItemsLen = tempItems.length; k < tempItemsLen; k++) {
								bodyHtml.push("<span ");
								bodyHtml.push("title=\"", tempItemsTitle[k], "\"");
								bodyHtml.push(" >");
								bodyHtml.push(tempItems[k]);
								bodyHtml.push("</span>&nbsp;&nbsp;");
							}
						} else {
							bodyHtml.push(tempData.dtos[j][types[currentType].field[1]]);
						}
						bodyHtml.push("</td>");
						bodyHtml.push("<td style=\"white-space:nowrap;overflow:hidden;text-overflow:ellipsis;\">");
						bodyHtml.push("<span");
						if (types[currentType].exps[2]) {
							bodyHtml.push(" title=\"" + tempData.dtos[j][types[currentType].exps[2]] + "\"");
						}
						bodyHtml.push(">");
						bodyHtml.push(tempData.dtos[j][types[currentType].field[2]]);
						bodyHtml.push("</span");
						bodyHtml.push("</td>");
						
						bodyHtml.push("<td>");
						if (currentType === 1) {
							type = +(tempData.dtos[j].sendDetail);
							bodyHtml.push("<span");
							if (type === 0) {
								if (+(tempData.dtos[j].opResult) === 0) {
									bodyHtml.push(">", "发信成功");
								} else {
									bodyHtml.push(" style=\"color: red;\">", "发信失败");
								}
							} else if (type === 1) {
								bodyHtml.push(">", "召回成功");
							} else if (type === 2) {
								bodyHtml.push(" style=\"color: red;\">", "召回失败");
							} else if (type === 3) {
								bodyHtml.push(" style=\"color: red;\">", "部分召回成功");
							} else if (type === 5) {
								if (+(tempData.dtos[j].opResult) === 0) {
									bodyHtml.push(">", "召回成功");
								} else {
									bodyHtml.push(" style=\"color: red;\">", "召回失败");
								}
							}
							bodyHtml.push("</span>");
							if (~~tempData.dtos[j].recNum > 1) {
								bodyHtml.push("&nbsp;&nbsp;&nbsp;<span style=\"cursor:pointer;color: #1e5494;\" sendDetail =" + tempData.dtos[j].sendDetail + " recNum=\"" + parseInt(tempData.dtos[j].recNum, 10) + "\" transId=\"" + tempData.dtos[j].transId + "\" recordAddr=\"" + tempData.dtos[j].recordAddr + "\" corpId=\"" + tempData.dtos[j].corpId + "\"");
								bodyHtml.push(" class=\"btnViewDetails\"");
								bodyHtml.push(" href=\"javascript:;\">查看</span>");
							}
						} else {
							bodyHtml.push(tempData.dtos[j][types[currentType].field[3]]);
						}
						bodyHtml.push("</td>");
						if (currentType === 5) {
							bodyHtml.push("<td>", tempData.dtos[j][types[currentType].field[4]] , "</td>");
							bodyHtml.push("<td>", tempData.dtos[j][types[currentType].field[5]] , "</td>");
						}
						bodyHtml.push("</tr>");
					}
				}
			} else {
				bodyHtml.push("<tr>", "<td colspan=\"" + types[currentType].field.length + "\">", "<p class=\"set_rule_box_tips\" style=\"display:block\">");
				bodyHtml.push(types[currentType].noLogMsg);
				bodyHtml.push("</p>" ,"</td>" ,"<tr>");
			}
			bodyHtml.push("</tbody>");

			return bodyHtml.join("");
		}

		// 获取post提交的URL
		function getPostURL(apiUrl) {
			var urlService = parent.gMain.urlAdmin,
				url;

			if (/^http/.test(urlService))  {
				url = urlService + apiUrl;
			} else {
				url = location.protocol + "//" + location.host + urlService + "/service" + apiUrl;
			}
			return url;
		}

		// 转化时间为字符
		function dataToStr(data) {
			var today = new Date(),
				yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
				dataArr = data.split("-");

			if (today.getFullYear() === parseInt(dataArr[0], 10) && today.getMonth() + 1 === parseInt(dataArr[1], 10) && today.getDate() === parseInt(dataArr[2], 10)) {
				return "今天";
			} else if (yesterday.getFullYear() === parseInt(dataArr[0], 10) && yesterday.getMonth() + 1 === parseInt(dataArr[1], 10) && yesterday.getDate() === parseInt(dataArr[2], 10)) {
				return "昨天";
			} else {
				return data;
			}
		}
	});
})(jQuery);