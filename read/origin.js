/**
 * @fileoverview 登录验证控件
 * @author Ryan(撒子都学) <zengyi.zal@gmail.com>
 **/

/**
 * @name PJS
 * @class  类继承语法糖
 * @constructor
 * @extends Object
 * @param {Object} _superclass  超类（需要继承的类）
 * @param {Button} definition  子类，扩展属性
 * @example
 * var class = p(function(){
 *      this.init = function(name){
 *          this.name = name;
 *      }
 * });
 *
 * var Sub = p(class,function(){
 *      this.hello = function(){
 *          alert(this.name);
 *      }
 * })
 *
 * var _sub =  new Sub('zhagnsan');
 * _sub.hello();
 */
var P = (function (prototype, ownProperty, undefined) {
    return function P(_superclass /* = Object */, definition) {
        // handle the case where no superclass is given
        if (definition === undefined) {
            definition = _superclass;
            _superclass = Object;
        }
        function C() {
            var self = this instanceof C ? this : new Bare;
            self.init.apply(self, arguments);
            return self;
        }

        function Bare() {
        }

        C.Bare = Bare;

        var _super = Bare[prototype] = _superclass[prototype];
        var proto = Bare[prototype] = C[prototype] = C.p = new Bare;
        var key;

        proto.constructor = C;

        C.extend = function (def) {
            return P(C, def);
        }

        return (C.open = function (def) {
            if (typeof def === 'function') {
                def = def.call(C, proto, _super, C, _superclass);
            }
            if (typeof def === 'object') {
                for (key in def) {
                    if (ownProperty.call(def, key)) {
                        proto[key] = def[key];
                    }
                }
            }

            if (!('init' in proto)) proto.init = _superclass;

            return C;
        })(definition);
    }
})('prototype', ({}).hasOwnProperty);


/**
 * @name WLogin
 * @class 登录验证组件
 * @constructor
 * @extends Object
 * @param {String} config.id 控件ID，用于标识当前控件
 * @param {String} config.title 弹窗标题
 * @param {Number} config.width 弹窗宽度
 * @param {String} config.func  设置控件提交时的接口函数
 * @param {String} config.href  登录操作失败，跳转的地址
 * @param {String} config.mail  需要验证登录的邮箱帐号 默认取系统登录的用户ID
 * @example
 * // 弹出登录窗口，并且监控登录失败函数
 * var win = new WLogin({
 *      id:"mylogin",        // 默认
 *      title: "登录验证",    // 默认
 *      width: "424",        // 默认
 *      func: "user:login",  // 默认
 *      href: "/webmail/login/login.do",  // 登录失败后跳转地址
 *      mail: "zengyi@richinfo.cn"   // 需要登录的邮箱帐号
 * }).show();
 *
 * win.on("error",function(){
 *      alert("登录失败，页面即将跳转。");
 * });
 *
 */
(function (root, factory) {
    if (typeof module === "object" && module.exports) {
        // CMD
    } else if (typeof define === "function" && define.amd) {
        // AMD
    } else {
        // Browser globals
        root.WLogin = factory(root.CC, root.jQuery, root);
    }
}(this, function (CC, $, global, undefined) {

    "use strict";

    /**
     * 构造函数
     */
    var WLogin = P(function (login) {
        /** @lends WLogin.prototype*/
        var $this = $(this);

        /**
         * @name _private
         * @desc  私有属性集
         * @type Object
         * @default {xhtml:'....',defaults:{...}}
         */
        var _private = {

            xhtml: ['\
                <div class="pop-wrap">\
                    <div class="msgDialog fz_14">\
                        <form method="post" action="{webPath}/login/loginapi.do" id="login_form">\
                            <p>您的邮箱可能由于您长时间未进行操作，导致登录超时，已被退出，请重新登录</p>\
                            <p class="mt_20">账号：{mail}</p>\
                            <p class="mt_10">密码：\
                                <input type="password" name="password" class="rm_txt w162" name="titleText" maxlength="15" value="" tabindex="1">\
                            </p>\
                            <input type="hidden" name="loginType" value="WEB" /> \
                            <input type="hidden" name="returnurl" value="{href}" />\
                            <input type="hidden" name="userid" id="userid" />   \
                            <input type="hidden" name="domain" id="domain" value="" />          \
                            <input type="hidden" name="model" id="model" value="{model}" />     \
                        </form>\
                    </div>\
                </div>'
            ].join(''),

            /**
             * @name defaults 默认配置属性
             * @type Object
             * @default {
                    id: "WLogin",
                    title: "登录验证",
                    width: "424",
                    func: "user:login",
                    href: "/webmail/login/login.do",
                    mail: gMain.loginName || ""
                }
             */

            defaults: {
                id: "WLogin",
                model: "MAIL",
                title: "登录验证",
                width: "424",
                func: "user:login",
                webPath: gMain.webPath,
                href: gMain.returnUrl || "/webmail/login/login.do",
                mail: gMain.loginName || ""
            },

            /**
             * @name attributes 属性容器
             * @type Object
             * @default {}
             */
            attributes: {
            }
        };


        /**
         * @name WLogin#go
         * @desc  重定向跳转
         * @event
         * @param {Number} type 跳转类型，1为错误，2为超时
         * @param {String} error 错误码，type 为1 时有效。默认为 err_004
         */
        login.go = function (type, error) {
            var url = this.get("href");

            error = error || "err_004";

            if (type === 1 && error) {
                url += "?code=" + error;
            } else if (type === 2) {
                url += "?from=iframe";
            }
            global.location = url;
        };


        /**
         * @name WLogin#set
         * @desc  属性设置 （key也可以是 json结构｛a:''｝ 对象）
         * @event
         * @param {Object} key 属性名
         * @param {Object} val 属性值
         */
        login.set = function (key, val) {

            var attr, attrs, current;
            if (key == null) return this;

            // Handle both `"key", value` and `{key: value}` -style arguments.
            if (typeof key === 'object') {
                attrs = key;
            } else {
                (attrs = {})[key] = val;
            }

            current = _private.attributes;
            // For each `set` attribute, update or delete the current value.
            for (attr in attrs) {
                val = attrs[attr];
                current[attr] = val;
            }
        };

        /**
         * @name WLogin#get
         * @desc  属性获取
         * @event
         * @param {String} attr 属性的名字
         * @return {Object}  返回对应的值
         */
        login.get = function (attr) {
            return _private.attributes[attr];
        };


        /**
         * @name WLogin#has
         * @desc  判断属性是否存在
         * @event
         * @param {String} attr 属性的名字
         * @return {Boolean}
         */
        login.has = function (attr) {
            return this.get(attr) != null;
        };


        /**
         * @name WLogin#init
         * @desc  控件初始化
         * @event
         * @param {String}
         */
        login.init = function (attrs) {

            var defaults = _private.defaults;
            attrs = $.extend({}, defaults || {}, attrs);
            this.set(attrs)
        };

        /**
         * @name WLogin#post
         * @desc  登录校验
         * @event
         * @param {String}
         */
        login.post = function () {
            var uid = login.get("mail"), arr = uid.split("@"), pwd = login.password.val();
            if (arr) {
                login.userid.val($.trim(arr[0]) || "");
                login.domain.val($.trim(arr[1]) || "");
            }

            //空密码，跳转到登录页
            if ($.trim(pwd) === "") {
                login.go(1);
                return false;
            }

            login.iform.submit();
            //_login(pwd);
            return true;
        };


        /**
         * 登录
         * @param pwd
         * @private
         */
        function _login(pwd) {

            //API 请求参数
//            var data = {
//                "userId": login.get("mail"),
//                "password": pwd
//            };

            //$

//            //执行操作
//            MM.mailRequestApi({
//                func: login.get("func"),
//                data: data,
//                call: function (json) {
//
//                    if (json["code"] === "S_OK") {
//                        var attrs = json["var"].attrs.split("=");
//                        attrs.length && GC.setCookie(attrs[0], attrs[1], "/", "", 0);
//                        console.log(attrs[0], attrs[1]);
//                        //global.location = global.location.href.replace(/sid=(\w*)/g, "$1");
//                    }
//
//                    //如果设置了回调，就执行回调函数
//                    login.trigger("login");
//                    login.hide();
//                },
//                failCall: function () {
//
//                    //失败回调
//                    if (login.trigger("error") !== true) {
//                        login.go(1);
//                    }
//                }
//            });


        }

        /**
         * @name WLogin#show
         * @desc  显示登录验证控件,该方法调用CC的showDiv方法初始化弹窗
         * @event
         */
        login.show = function (showDiv) {

            //登录框中的HTML内容 模版
            var html = _private.xhtml, attrs = _private.attributes;

            //调用弹窗控件
            showDiv = showDiv || CC.showDiv;
            showDiv(html.replace(/{([^}]+)}/g, function ($0, $1) {
                var value = attrs[$1];
                return typeof value === 'string' ? value : '';
            }), this.post, this.get("title"), function () {
                login.go(2);
            }, this.get("id"), this.get("width"));

            //初始化 DOM元素
            login.element = $("#divDialogconfirm" + login.get("id"));
            login.password = $(":password", login.element);
            login.iform = $("#login_form", login.element);
            login.userid = $("#userid", login.element);
            login.domain = $("#domain", login.element);

            //显示弹窗后的回调
            $this.trigger("show", login);

            //为密码框绑定回车提交
            login.password.focus().select();
            login.password.on("keypress", function (event) {
                var keyCode = event.keyCode;
                if (keyCode === 13) {
                    login.post();
                }
            });

            return login;
        };


        /**
         * @name WLogin#on
         * @desc  绑定事件
         * @event
         * @param {String} type 支持“error,login,show,hide”
         * @param {Function} func 回调处理函数
         */
        login.on = function () {
            $this.on.apply($this, arguments)
        };

        /**
         * @name WLogin#trigger
         * @desc  触发事件
         * @event
         * @param {String} type 支持“error,login,show,hide”
         */
        login.trigger = function () {
            $this.trigger.apply($this, arguments)
        };

        /**
         *
         * @name WLogin#hide
         * @desc  隐藏弹窗
         * @event
         * @returns {boolean}
         */
        login.hide = function () {
            login.trigger("hide");
            //隐藏
            login.element.hide();
            CC.hideTransparent();
            $this.off();
            return true;
        };

        /**
         * @name WLogin#close
         * @desc  销毁弹窗
         * @event
         */

    });

    /**
     * @name WLogin.show
     * @desc  简写方式，参数采用默认值
     * param  {function}  showDiv 弹框方法
     * param  {object}   attr  重置默认参数
     * @event
     */
    WLogin.show = function (showDiv, attr) {
        var w = WLogin(attr).show(showDiv);

//        //登录失败回调
//        w.on("error",function(){
//
//        });
//
//        //登录成功回调
//        w.on("login",function(){
//
//        });
//
//        //控件关闭回调
//        w.on("hide",function(){
//
//        });
    };


    return WLogin;
}));





