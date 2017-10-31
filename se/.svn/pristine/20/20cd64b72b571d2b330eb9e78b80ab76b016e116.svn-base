/**
 * @class
 * @desc
 * @date 15-7-13
 */
(function (win, $, top) {
    var g = top.gMain || {};
    var imgUrl = g.webPath + (g.imgCodeUrl || '/common/validatecode.do');


    $.fn.captcha = function (options) {
        var opt = $.extend($.fn.captcha.defaultSettings, options || {});


        return this.each(function () {
            var $this = $(this);

            var img = $(opt.img, $this);
            var input = $(opt.input, $this);
            var changeBtn = $(opt.changeBtn, $this);


            //var template = $(opt.template);

            img.click(function () {
                refresh(img);
            });
            changeBtn.click(function () {
                refresh(img);
                return false;
            });

            //�۽�ʱȫѡ
            input.focus(function () {
                $(this).select();
            });

            $this.on('refresh', function () {
                refresh(img);
            });

            $this.trigger('refresh');

            function refresh() {
                var url = imgUrl + '?r=' + (new Date()).getTime();
                img.attr('src', url);
                input.focus().val('');
            }


        });
    };
    $.fn.captcha.defaultSettings = {
        input: '.captcha_input',
        img: '.captcha_img',
        changeBtn: '.captcha_changeBtn'
    };
}(window, jQuery, top));
