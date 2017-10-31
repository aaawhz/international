/**
 * CCalendar
 *
 * development by Ryan
 * mail: zengyi.zal@gmail.com
 *
 * useing jQuery JavaScript frame v1.6.1+
 */
function initAppDomain(){
    var allcookies = document.cookie;
    var reg = /(^|;)\s*maindomain=([^;]*)\s*(;|$)/;
    var match = reg.exec(allcookies);
    var ret = "";
    if (match != null) {
        var value = match[2];
        ret = decodeURIComponent(value);
        if(ret && ret!=location.host){
            document.domain = ret;
        }
    }
}
initAppDomain();
;;;
(function($) {
    var _$window  =$(window),
        _$document = $(document),
        _expando ="CCalendar-"+ (+new Date()) +"-",
        _count = 0;

    var CCalendar = function(element, options) {
        this.initialize.apply(this, arguments);
        _count ++ ;
    }
    /** 原型函数 **/
    CCalendar.prototype = {
        //构造函数
        constructor : CCalendar,
        //初始化函數
        initialize : function(element, options) {
            this.element = $(element);
            this.format = GLOBLE.parseFormat(options.format || this.element.data('date-format') || 'yyyy-mm-dd');
            this.isInput = this.element.is("input");

            // 合并默认配置
            var dftCfg = CCalendar.defcfg;
            for (var i in dftCfg) {
                if (options[i] === undefined) {
                    options[i] = dftCfg[i];
                };
            };
            options.id =  options.id ||  _expando + _count;
            this.picker = $("<div/>", {"id" : options.id,"class" : "ui-date"})
                .appendTo('body').bind({
                    click: $.proxy(this.click, this)
                });

            this.component = this.element.is('.date') ? this.element.find('.add-on') : false;
            this.create(options);
            //如果是输入框
            if (this.isInput) {
                this.element.bind({
                    focus : $.proxy(this.show, this),
                    keyup : $.proxy(this.update, this)
                });
            } else {
                if (this.component) {
                    this.component.bind('click', $.proxy(this.show, this));
                } else {
                    this.element.bind('click', $.proxy(this.show, this));
                }
            }
        },
        //初始化配置
        setOptions : function(options) {
            this.options = options;
            this.options.startDate && typeof this.options.startDate === "string" && (this.options.startDate = GLOBLE.parseDate(this.options.startDate,this.format));
            this.lang = GLOBLE.lang[this.options.lang];
            (this.options.maxDate && (this.options.maxDate = GLOBLE.parseDate(this.options.maxDate, this.format)));
            (this.options.minDate && (this.options.minDate = GLOBLE.parseDate(this.options.minDate, this.format)));
            this.date = {
                year : this.options.startDate.getFullYear(),
                month : this.options.startDate.getMonth(),
                days : this.options.startDate.getDate()
            };
        },
        //创建日历
        create : function(options) {
            this.setOptions(options);
            this.fill(this.date);
        },
        //监听点击事件
        click:function(e){
            e.stopPropagation();
            e.preventDefault();
            var dp = this,
                options = dp.options,
                target = $(e.target).closest('a')[0];
            if(!target) return false;
            if(target.getAttribute('data-disabled') == "true")return false;
            var action = target.getAttribute('data-action');
            if(!action) return false;

            switch( action ){
                case "SELECT_YEAR":{
                    dp.createYearModel(dp.date.year,target);
                }
                    break;
                case "PREV-10-YEAR":
                case "NEXT-10-YEAR":{
                    dp.createYearModel(parseInt(target.getAttribute("data-year")),null);
                }
                    break;
                case "SELECT_MONTH":{
                    dp.createMonthModel(dp.date.month,target);
                }
                    break;
                case "YEAR":{
                    dp.fill({
                        year : parseInt(target.getAttribute("data-year"))
                    });
                }
                    break;
                case "MONTH":{
                    dp.fill({
                        month : parseInt(target.getAttribute("data-month")-1)
                    });
                }
                    break;
                case "DAY":{
                    this.select(target);
                }
                    break;
                case "TODAY":{
                    dp.select(target);
                    dp.update();
                }
                    break;
                case "YEAR_LEFT":{
                    dp.date.year -= options.showCount;
                    dp.fill(dp.date);
                }
                    break;
                case "YEAR_RIGHT":{
                    dp.date.year += options.showCount;
                    dp.fill(dp.date);
                }
                    break;
                case "MONTH_LEFT":{
                    dp.date.month -= options.showCount;
                    if (dp.date.month < 0) {
                        dp.date.month = dp.date.month + 12;
                        dp.date.year--;
                    }
                    dp.fill(dp.date);
                }
                    break;
                case "MONTH_RIGHT":{
                    dp.date.month += options.showCount;
                    if (dp.date.month > 11) {
                        dp.date.month = dp.date.month - 12;
                        dp.date.year++;
                    }
                    dp.fill(dp.date);
                }
                    break;
                default :{}
            }
        },
        //构建主体
        fill: function(date) {
            var dp = this,
                options = dp.options;

            var disabled,
                isShowToday = true,
                year = (date.year || this.date.year),
                month = (date.month == undefined ? this.date.month : date.month),
                __today = new Date(GLOBLE.today.year, GLOBLE.today.month, GLOBLE.today.date);

            this.date.year = year,
                this.date.month = month;

            var main = this.dom ? this.dom.main : $("<div/>",{"class":"main"}).appendTo(this.picker);
            main.empty();
            for (var i = 0; i < options.showCount; i++) {

                var dayCount = GLOBLE.getDaysInMonth(year,month),
                    prev = GLOBLE.getPNDate(year,(month+1),-1),
                    next = GLOBLE.getPNDate(year,(month+1),1),
                    startPad = new Date(year, month, 1).getDay(),
                    pday,
                    list = $("<div/>",{
                        "class":"ui-date-list ui-month"+ i + (options.showCount > 1 && year == GLOBLE.today.year && month == (GLOBLE.today.month+1) ? ' ui-month-cur' : '')
                    });

                var html = ['<div class="ui-date-head ui-date-top">'];
                (i == 0) && html.push('<a  data-action="YEAR_LEFT" class="ui-year-left" href="javascript:void(0)" title="' + dp.lang.previousYear + '">&laquo;</a><a  data-action="MONTH_LEFT" class="ui-month-left" href="javascript:void(0)" title="' + dp.lang.previousMonth + '">&lsaquo;</a>');
                html.push('<a  data-action="SELECT_YEAR"  class="ui-year" href="javascript:void(0)" title="' + dp.lang.selectYear + '">' + year + '</a>年<a  data-action="SELECT_MONTH" class="ui-month" data-year="' + year + '" href="javascript:void(0)" data-dom="month" title="' + dp.lang.selectMonth + '" >' + (((month+1)< 10 ? '0' : '')+(month+1)) + '</a>月');
                (i + 1 == options.showCount) &&	html.push('<a  data-action="MONTH_RIGHT"  class="ui-month-right" href="javascript:void(0)" title="' + dp.lang.nextMonth + '">&rsaquo;</a><a  data-action="YEAR_RIGHT"  class="ui-year-right" href="javascript:void(0)" title="' + dp.lang.nextYear + '">&raquo;</a>');

                //星期
                html.push('</div><div class="ui-date-content clearfix"><div class="ui-date-week">');
                for (var j = 0; j < 7; j++) html.push('<span class="ui-week ' + j + '">' + dp.lang.week[j] + '</span>');

                html.push('</div><div class="ui-date-days">');
                var nday = startPad = startPad == 0 ? 6 : startPad-1;
                for(;startPad>=0;startPad--) pday = (prev.day-startPad),html.push('<div class="'+(options.expired ? "ui-days-old" : "")+' ui-days-other d-' + pday + '"><a data-old="'+(options.expired ? "1" : "0")+'" data-action="DAY"  href="javascript:void(0)" data-year="' + prev.year + '" data-month="' + (prev.month + 1 ) + '" data-day="' + pday + '">' + pday + '</a></div>')


                for (var j = 1; j <= dayCount; j++) {
                    disabled = false;
                    var day = new Date(year, month, j).getDay();
                    html.push('<div class="d-'+ day);

                    if (options.maxDate && options.maxDate <= new Date(year, month, j) || options.minDate && options.minDate >= new Date(year, month, j)) {
                        disabled = true;
                        html.push(' ui-days-disabled');
                    }

                    if (options.expired && new Date(year, month, j) < __today)
                        html.push(' ui-days-old');

                    if (GLOBLE.today.year == year && GLOBLE.today.month == month && GLOBLE.today.date == j) {
                        html.push(' ui-days-current');
                        if (disabled) isShowToday = false;
                    }
                    html.push('"><a  data-action="DAY"  href="javascript:void(0)" data-year="' + year + '" data-month="' + (month + 1 ) + '" data-day="' + j + '" data-disabled="' + disabled + '" data-old="' + (new Date(year, month, j) < __today ? 1 : 0 ) + '" >' + j + '</a></div>');
                }
                for (var j = 1; j < 42 - dayCount - nday; j++) {
                    html.push('<div class="ui-days-other">');
                    html.push('<a data-action="DAY"  href="javascript:void(0)" data-year="' + next.year + '" data-month="' + (next.month + 1 ) + '" data-day="' + j + '">' + j + '</a>');
                    html.push('</div>');
                }
                html.push('</div></div>');
                list.html(html.join(""));
                main.append(list);
                if (++month == 12) {
                    year++;
                    month = 0;
                }
            }

            if (GLOBLE.ie) {
                this.picker.width(210 * options.showCount);
                if(GLOBLE.ie == 6){
                    var background = $('<div />',{"class":"ui-date-mark"}).css({
                        width:this.picker.innerWidth(),
                        height:this.picker.innerHeight()
                    }).html('<iframe frameborder="0" src="about:blank" scrolling="no"></iframe>');
                    this.picker.append(background);
                }
            }
            this.dom = {
                main: main
            };
        },
        //创建年份面板
        createYearModel : function (year,target) {
            var self = this,
                years = $(".ui-year-list",self.dom.main);

            if(years.length == 0){
                years = $("<div/>",{"class":"ui-year-list"});
                self.dom.main.append(years);
                self.dom["year"] = years;
                self.dom.main.bind("mousedown",function(ev){
                    if ($(ev.target).closest('.ui-year-list').length == 0) {
                        years.hide();
                    }
                    return false;
                });
            }

            if(target){
                var offset = $(target).position();
                years.css({
                    top:offset.top+17,
                    left:offset.left-37/2
                }).show();
            }

            var items = [
                {
                    value: year - 10,
                    label: '&laquo;',
                    role: 'PREV-10-YEAR'
                }
            ];

            for (var i = year - 6; i < year + 4; i++) {
                items.push({
                    value: i,
                    label: i,
                    role: 'YEAR'
                });
            }
            items[7] = {value: year, label: year, role: 'YEAR', current: true};
            items.push({
                value: year + 10,
                label: '&raquo;',
                role: 'NEXT-10-YEAR'
            });

            var current = {
                value: year,
                label: year
            };
            var html = [];
            for(var j=0,l=items.length;j<l;j++){
                var y = items[j]
                html.push('<a href="javascript:void(0)" data-action="'+y.role+'" class="'+(y.value < GLOBLE.today.year ? " ui-date-old" : "")+(y.value == GLOBLE.today.year ? " ui-date-current" : "")+'" data-year="' + y.value + '">' + y.label + '</a>');

            }
            years.html(html.join(""));
        },
        //创建月份面板
        createMonthModel : function (month,target) {
            var self = this,
                list = $(".ui-month-list",self.dom.main);

            if(list.length == 0){
                list = $("<div/>",{"class":"ui-month-list"});
                self.dom.main.append(list);
                self.dom["month"] = list;
                self.dom.main.bind("mousedown",function(ev){
                    if ($(ev.target).closest('.ui-month-list').length == 0) {
                        list.hide();
                    }
                    return false;
                });
            }

            if(target){
                var offset = $(target).position();
                list.css({
                    top:offset.top+26,
                    left:offset.left-23/2
                }).show();
            }


            var items = [];

            for (var i = 1; i <= 12; i++) {
                items.push({
                    value: i,
                    label: i,
                    role: 'MONTH'
                });
            }

            var current = {
                value: month,
                label: month
            };
            var html = [];
            for(var j=0,l=items.length;j<l;j++){
                var m = items[j]
                html.push('<a href="javascript:void(0)" data-action="'+m.role+'" class="'+(m.value < GLOBLE.today.month+1 ? " ui-date-old" : "")+(m.value == GLOBLE.today.month+1 ? " ui-date-current" : "")+'" data-month="' + m.value + '">' + m.label + '</a>');

            }
            list.html(html.join(""));
        },
        //更新
        update : function(newDate) {
            var date = GLOBLE.parseDate(
                typeof newDate === 'string' ? newDate : (this.isInput ? this.element.prop('value') : this.element.data('date')),
                this.format
            );
            this.fill({
                year:date.getFullYear(),
                month:date.getMonth(),
                day:date.getDate()
            });
        },
        select : function(target){
            var dp = this,
                options = dp.options;

            if (options.expired && target.getAttribute('data-old') == 1) return false;
            var yyyy = target.getAttribute('data-year'),
                yy = yyyy.substr(2),
                m = parseInt(target.getAttribute('data-month')),
                mm = m < 10 ? '0' + m : m,
                d = parseInt(target.getAttribute('data-day')),
                dd = d < 10 ? '0' + d : d,
                date = new Date(yyyy, m - 1, d),
                time = date.getTime(),
                back =  GLOBLE.formatDate(date,dp.format),
                backData = {
                    yyyy : yyyy,
                    yy : yy,
                    mm : mm,
                    m : m,
                    dd : dd,
                    d : d,
                    back : back,
                    date : date,
                    time : time
                };

            //选择日期前
            if(this.options.onSelect && !this.options.onSelect.call(dp , backData)) return null;
            if (!dp.isInput) {
                if (dp.component){
                    dp.element.find('input').prop('value', back);
                }
                dp.element.data('date', back);
            } else {
                dp.element.prop('value', back);
            }

            //选择日期后
            if (this.options.onSelectBack) {
                if (this.options.onSelectBack.call(dp , backData)) dp.hide();
                return false;
            }
        },
        //显示
        show : function(e) {
            this.picker.show();
            this.height = this.component ? this.component.outerHeight() : this.element.outerHeight();
            this.width = this.component ? this.component.outerWidth() : this.element.outerWidth();
            this.offset();
            _$window.bind('resize', $.proxy(this.offset, this));
            if (e ) {
                e.stopPropagation();
                e.preventDefault();
            }

            var that = this;
            _$document.unbind('mousedown').bind('mousedown', function(ev){
                if ($(ev.target).closest('.ui-date').length == 0) {
                    that.hide();
                }
            });

            this.element.trigger({
                type: 'show',
                date: this.date
            });
        },
        offset: function(){
            var offset = this.component ? this.component.offset() : this.element.offset();
            var top = offset.top,
                left = offset.left,
                ww = _$window.width(),
                pw = this.picker.width();

            this.picker.css({
                top: top + this.height,
                left: ww <= (pw+left) ? left-pw + this.width : left
            });
        },
        //隐藏
        hide : function() {
            this.picker.hide();
            _$window.unbind('resize', this.offset);
            if (!this.isInput) {
                $(document).unbind('mousedown', this.hide);
            }
            this.element.trigger({
                type: 'hide',
                date: this.date
            });
        }
    };

    /** 静态对象 **/
    var GLOBLE = {
        ie : document.all && navigator.userAgent.match(/\s{1}\d{1}/),
        //语言包
        lang : {
            "cn" : {
                week : ['日', '一', '二', '三', '四', '五', '六'],
                previousMonth : '上一月',
                nextMonth : '下一月',
                previousYear : '上一年',
                nextYear : '下一年',
                selectYear : '选择年',
                selectMonth : '选择月',
                more : '更多',
                today : '今'
            }
        },
        //今天
        today : {
            year : new Date().getUTCFullYear(),
            month : new Date().getMonth(),
            date : new Date().getDate()
        },
        //是否是闰年
        isLeapYear : function(year) {
            return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0))
        },
        //获取月份的天数
        getDaysInMonth : function(year, month) {
            return [31, (GLOBLE.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month]
        },
        //获取上下月
        getPNDate: function(year,month,path){
            if ((month += (path || 0))<1) {
                month = 12;
                year --;
            } else if(month>12) {
                month =1;
                year++;
            }
            var date = new Date(year,month,0);
            return {
                year:date.getFullYear(),
                month:date.getMonth(),
                day:date.getDate()
            };
        },
        //转换为格式对象
        parseFormat : function(format) {
            var separator = format.match(/[.\/\-\s].*?/), parts = format.split(/\W+/);
            if (!separator || !parts || parts.length === 0) {
                throw new Error("Invalid date format.");
            }
            return {
                separator : separator,
                parts : parts
            };
        },
        //格式化字符日期
        parseDate : function(date, format) {
            var parts = date.split(format.separator), date = new Date(), val;
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);
            if (parts.length === format.parts.length) {
                var year = date.getFullYear(), day = date.getDate(), month = date.getMonth();
                for (var i = 0, cnt = format.parts.length; i < cnt; i++) {
                    val = parseInt(parts[i], 10) || 1;
                    switch(format.parts[i]) {
                        case 'dd':
                        case 'd':
                            day = val;
                            date.setDate(val);
                            break;
                        case 'mm':
                        case 'm':
                            month = val - 1;
                            date.setMonth(val - 1);
                            break;
                        case 'yy':
                            year = 2000 + val;
                            date.setFullYear(2000 + val);
                            break;
                        case 'yyyy':
                            year = val;
                            date.setFullYear(val);
                            break;
                    }
                }
                date = new Date(year, month, day, 0, 0, 0);
            }
            return date;
        },
        //格式化日期字符串
        formatDate : function(date, format) {
            var val = {
                d : date.getDate(),
                m : date.getMonth() + 1,
                yy : date.getFullYear().toString().substring(2),
                yyyy : date.getFullYear()
            };
            val.dd = (val.d < 10 ? '0' : '') + val.d;
            val.mm = (val.m < 10 ? '0' : '') + val.m;
            var date = [];
            for (var i = 0, cnt = format.parts.length; i < cnt; i++) {
                date.push(val[format.parts[i]]);
            }
            return date.join(format.separator);
        }
    };
    //默认配置
    CCalendar.defcfg ={
        id : null,
        showCount : 1,
        startDate : new Date(),
        maxDate : false,
        minDate : false,
        expired : false,
        lang : 'cn',
        isShowTo : false,
        onSelect : null,
        onSelectBack : null
    };

    /** 全局变量  **/
    window.CCalendar = CCalendar;
    $.fn.ccalendar = function (option) {
        var args = Array.apply(null, arguments);
        args.shift();
        return this.each(function () {
            var $this = $(this),
                data = $this.data('CCalendar'),
                options = typeof option === 'object' && option;
            if (!data) {
                $this.data('CCalendar', (data = new CCalendar(this, options)));
            }
            if (typeof option == 'string' && typeof data[option] == 'function') {
                data[option].apply(data, args);
            }
        });
    };
    $.fn.ccalendar.Constructor = CCalendar;
})(jQuery);