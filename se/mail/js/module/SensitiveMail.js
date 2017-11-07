;(function ($) {
    var SensitiveMail = {
        /**
        * 列表页添加敏感提示html
        */
        addTips: function () {
            var html = "";

            html += "<div style=\"display: none;\" class=\"y_tips ta_c\" id=\"tipsSensitive\"><p>";
            html += top.Lang.Mail.Write.cyjjzkfIjhhljsc;//此邮件夹中的邮件包含敏感信息，建议您阅读后立即删除
            html += "<a href=\"javascript:;\" class=\"col_red ml_10\" onclick=\"SensitiveMail.closeTips();\">"+top.Lang.Mail.Write.buzaitixing+"</a>"
            html += "</p></div>";//<a href=\"javascript:;\" class=\"col_red ml_10\" onclick=\"SensitiveMail.closeTips();\">不再提醒</a>

            return html;
        },

        /**
        * 打开敏感提示tips
        */
        openTips: function () {
            $("#tipsSensitive").slideDown();
        },

        /**
        * 关闭敏感提示tips
        */
        closeTips: function () {
            $("#tipsSensitive").slideUp();
            CC.writeUserAttributesToServer({"tipsSensOpen": "true"});
        },

        /**
        * 打开敏感邮件标签
        */
        openFolder: function () {
            CC.searchNewMail(0, true, undefined, {"signed": 1});
        },

        /**
        * 获取读信页敏感词提示tips html
        */
        getReadTips: function (data) {
            var signedArr = [],
                html = "";

            if (data.flag && data.flag.signed === 1) {
                if (typeof data.headers["X-RM-SENSITIVE-WORDS"] !== "undefined" && data.headers["X-RM-SENSITIVE-WORDS"] !== null) {
                    signedArr =  data.headers["X-RM-SENSITIVE-WORDS"].split(",");
                }
                for (var i = 0; i < signedArr.length; i++) {
                    signedArr[i] = "\"" + signedArr[i] + "\""; 
                }
                html = "<div class=\"yellowTips\">"+top.Lang.Mail.Write.cyjjzmiMTcbhmgc+"<span class=\"col_red\">" + signedArr.join(",") + "</span></div>";//<div class=\"yellowTips\">此邮件夹中的邮件包含敏感词 <span class=\"col_red\">
            }
            return html;
        }
    };

    window.SensitiveMail = SensitiveMail;
})(jQuery);