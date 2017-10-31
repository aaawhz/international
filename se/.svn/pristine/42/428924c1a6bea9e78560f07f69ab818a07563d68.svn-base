/**
 * Created with JetBrains WebStorm.
 * ColorBox 颜色选择组件
 * User: Ryan
 * Date: 13-5-10
 * Time: 下午3:29
 * To change this template use File | Settings | File Templates.
 * demo1:
 * new ColorBox(element,{colors:[],target:input,callback:function(val,color){
 *     ....
 * }})
 * demo2:
 * $(element).colorbox({colors:[],target:input,callback:function(val,color){
 *     ....
 * }})
 */
;;;(function ($, window) {
    var _$window = $(window),
        _$document = $(document);

    /**
     * Color色块选择组件
     * @param element
     * @param options
     * @constructor
     */
    var ColorBox = function (element, options) {
        this.initialize.apply(this, arguments);
    }

    ColorBox.prototype = {
        /**
         * 构造函数
         */
        constructor: ColorBox,
        /**
         * 初始化函數
         * @param element
         * @param options
         */
        initialize: function (element, options) {
            this.element = $(element);
            this.colors = options.colors || gConst.labelColor;
            this.direction = options.direction || ColorBox.direction.Left;     //默认提示控件在左边
            this.target = $(options.target);
            this.isInput = this.target.is("input");
            this.callback = options.callback || null;
            this._getDOM();
            this._bind();
        },
        /**
         * 构造DOM结构
         * @private
         */
        _getDOM: function () {
            var html = [];
            for (var i = 0, l = this.colors.length; i < l; i++) {
                html.push('<li data-index="' + i + '" data-rol="action"><a href="javascript:;"><i class="i-colorsquare ' + this.colors[i] + '"></i></a></li>');
            }
            this.box = $("<div />", {
                "class": "menuPop shadow creatTagpop"
            }).css({
                    position: "absolute",
                    zIndex: "9000",
                    height: "120px",
                    display: "none",
                    top: 0, left: 0
                }).html('<ul>' + html.join("") + '</ul>').appendTo('body');
        },
        /**
         * 事件绑定
         * @private
         */
        _bind: function () {
            this.box.bind({
                click: $.proxy(this._click, this)
            });
            this.element.bind({
                click: $.proxy(this.show, this)
            });
        },
        /**
         * 点击监控
         * @param e
         * @private
         */
        _click: function (e) {
            var target = $(e.target).closest('li'),
                action = target.data("rol");
            if (action) {
                var val = target.data("index");
                this.setValue(val);
            }
        },
        /**
         * 设置值
         * @param val
         * @returns {boolean}
         */
        setValue: function (val) {
            this.element.attr("data-val", val);
            this.target.length && this.target[this.isInput ? "val" : "html"](val);
            if (this.callback) {
                var flag = this.callback.call(this, val, this.colors[val]);
                if (!flag) {
                    this.hide();
                } else {
                    return false;
                }
            }
            this.hide();
        },
        /**
         * 获取值
         * @returns {*}
         */
        getValue: function () {
            return this.element.data("val");
        },
        /**
         * 显示组件
         * @returns {boolean}
         */
        show: function () {
            if(this.closed) return false;

            this.height = this.element.outerHeight();
            this.width = this.element.outerWidth();
            this.box.show();
            this.offset();
            _$window.bind('resize', $.proxy(this.offset, this));

            var that = this;
            _$document.bind('mousedown', function (ev) {
                var target = $(ev.target);
                if (target.closest(that.box).length == 0 && target.closest(that.element).length == 0) {
                    that.hide();
                }
            });
            this.closed = true;
        },
        /**
         * 隐藏组件
         */
        hide: function () {
            this.box.hide();
            this.closed = false;
            _$window.unbind('resize');
            _$document.unbind('mousedown');
        },
        /**
         * 定位组件
         */
        offset: function () {
            var offset = this.element.offset();
            var top = offset.top,
                left = offset.left,
                ww = _$window.width(),
                wh = _$window.height(),
                pw = this.box.width(),
                ph = this.box.height();

            var css = { top: wh <= (ph + top)? top - (ph + this.height - 3) : top + this.height };
            switch (this.direction){
                case "Left":
                    css.left = left >= pw ? (left - pw - 7) + this.width : left
                    break;
                case "Right":
                    css.left =  ww <= (pw + left) ? left - pw + this.width : left
                    break;
            }
            this.box.css(css);
        }
    };

    //定义常量
    ColorBox.direction = {
        Top: 'Top',			//上边
        Right: 'Right',		//右边
        Bottom: 'Bottom',	//下边
        Left: 'Left'		//左边
    };

    /** 全局变量  **/
    window.ColorBox = ColorBox;
    $.fn.colorbox = function (option) {
        var args = Array.apply(null, arguments);
        args.shift();
        return this.each(function () {
            var $this = $(this),
                data = $this.data('ColorBox'),
                options = typeof option === 'object' && option;
            if (!data) {
                $this.data('ColorBox', (data = new ColorBox(this, options)));
            }
            if (typeof option == 'string' && typeof data[option] == 'function') {
                data[option].apply(data, args);
            }
        });
    };
    $.fn.colorbox.Constructor = ColorBox;
})(jQuery, window);