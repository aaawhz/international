/**
 * 天气预报模块
 * @author Dream
 */
function Weather(){
    this.name = gConst.weather;
    this.imgUrl = GC.frmPath;
    this.url = GC.apiServer + "/WebService/GetWeatherDetail.aspx";
    this.userNumber = gMain.userNumber;
}

Weather.prototype = {
    init: function(){
        var p = this;
        this.weatherDiv = $("homeWeatherDiv");
        this.weatherDetailDiv = $("homeCityDiv");
        if (this.weatherDiv && this.weatherDetailDiv) {
            this.getWeatherDetail();
            this.getWeather();
        } /*else {
            window.setTimeout(function(){
                MM[p.name].init();
            }, 200);
        }*/
    },
    /***
     * 设置获取天气预报信息
     * @param {Object} pm
     * @param {Object} callback
     * @param {Object} isDay
     * @param {Object} isChargeCity
     */
    setData: function(pm, callback, isDay,isChargeCity){
        var dataHref = this.url + "?usernumber=" + this.userNumber + pm;
        El.show($("weatherLoading"));
        El.hide($("weatherContent"));
        if (!WeatherForecast || isChargeCity) {
            /*GC.getOtherDomainData("scriptWeather", dataHref, function(){
                if (typeof(WeatherForecast) == "object") {
                    if (isDay) {
                        Weather.data = WeatherForecast;
                    }
                    callback(WeatherForecast);
                    El.hide($("weatherLoading"));
                    El.show($("weatherContent"));
                }
            });*/
            CC.requestWebApi(dataHref, function(){
                if (typeof(WeatherForecast) == "object") {
                    if (isDay) {
                        Weather.data = WeatherForecast;
                    }
                    callback(WeatherForecast);
                    El.hide($("weatherLoading"));
                    El.show($("weatherContent"));
                }
            });
        }else{
            if (typeof(WeatherForecast) == "object") {
                    if (isDay) {
                        Weather.data = WeatherForecast;
                    }
                    callback(WeatherForecast);
                    El.hide($("weatherLoading"));
                    El.show($("weatherContent"));
                }
        }
    },
    
    /***
     * 显示/隐藏天气预报Div
     * @param {Object} isHide
     */
    showWeather: function(isHide){
        if (isHide) {
            El.hide(this.weatherDetailDiv);
        } else {
            El.show(this.weatherDetailDiv);
        }
        var ev = EV.getEvent();
        EV.stopPropagation(ev);
    },
    
    /***
     * 改变城市
     * @param {Object} isView
     */
    doChangeCity: function(isView){
        var p = this;
        var oc = $("selCity");
        var areaCode = oc.value;
        if (areaCode == "") {
            if (isView) {
                alert(Lang.Mail.weather_SelectViewCity);
                return;
            } else {
                alert(Lang.Mail.weather_SelectViewCity);
                return;
            }
        }
        if (isView) {
            this.getWeatherList(false, isView);
        } else {
            this.getWeather(0, areaCode,true);
        }
    },
    
    /***
     * 获取天气
     * @param {Object} day
     * @param {Object} areaCode
     * @param {Object} isLoad
     */
    getWeather: function(day, areaCode,isChargeCity){
        var p = this;
        var oc = $("selCity");
        day = day || 0;
        if (typeof(day) == "string") {
            day = day.toInt();
        }
        var pm = "";
        if (areaCode) {
            pm += "&areaCode=" + areaCode;
        }
        var strDay = (day) ? Lang.Mail.weather_Tomorrow : Lang.Mail.weather_Today;
        var strTemp = (day) ? Lang.Mail.weather_TomorrowTemper : Lang.Mail.weather_TodayTemper;
        if (areaCode || !Weather.data) {        
            p.setData(pm, setHtml, true, isChargeCity||false);
        }
        setHtml(Weather.data);        
        
        function setHtml(data){
            var html = [];
            var ul = p.weatherDiv;
            var bigImg = $("iconWeather");
            var dt = MM["home"].userInfo.nowTime;
            var curDate = dt.getFullYear() + "-" + data.Weather[day].date;
            var date = Util.parseDate(curDate, top.Lang.Mail.Write.yueripVpufWyr);//yyyy-m月d日
            var pic0 = data.Weather[day].pic0;
            //var strDate = Util.formatDate(date,"m{0}d{1} {2}ww".format(Lang.Mail.date_Month,Lang.Mail.date_Day,Lang.Mail.date_Week));  
            var strDate = Util.formatDate(date, Lang.Mail.date_mmddww);
            var bigImgUrl = p.imgUrl + '/images/weather/' + pic0 + '.gif';
            //html[html.length] = '<ul class="weather" id="homeWeatherDiv">';
            if (pic0) {
                html[html.length] = '<li>' + strDate + '<a class="city" href="javascript:fGoto();" onclick="MM[\'weather\'].showWeather()">' + data.city + '</a></li>';
                html[html.length] = '<li>' + strTemp + "&nbsp;" + data.Weather[day].temper1 + '~' + data.Weather[day].temper0 + '</li>';
                html[html.length] = '<li><a href="javascript:fGoto();" onclick="MM[\'weather\'].getWeather(' + (1 - day) + ');return false;">' + ((day) ? Lang.Mail.weather_Today : Lang.Mail.weather_Tomorrow) + '</a><a href="javascript:fGoto();" onclick="MM[\'weather\'].showWeather();">' + Lang.Mail.weather_ViewOtherCity + '</a></li>';
                //html[html.length] = '</ul>';
                bigImg.style.backgroundImage = "url(" + bigImgUrl + ")";
                bigImg.alt = data.weather;
            }
            ul.innerHTML = html.join("");
            p.getWeatherList(true);
        }
    },
    
    
    getWeatherDetail: function(){
        var html = [];
        var cityDiv = this.weatherDetailDiv;
        var provinceArr = [top.Lang.Mail.Write.beijingIhqTQvxm, top.Lang.Mail.Write.tianjinNZQkSnQN, top.Lang.Mail.Write.shanghaiHsYYGLKw, top.Lang.Mail.Write.guangdongSPzJQQee, top.Lang.Mail.Write.guangxiWBORfTyT, top.Lang.Mail.Write.hebeiJXhKyozi, top.Lang.Mail.Write.henanOhxnTXWi, top.Lang.Mail.Write.hubeigOEbGypi, top.Lang.Mail.Write.hunanoYwisJbA, top.Lang.Mail.Write.fujianWIZscpgR, top.Lang.Mail.Write.shandongFbqrhVrX, top.Lang.Mail.Write.anhuiLScorcKX, top.Lang.Mail.Write.zhejiangWDyAnTdp, top.Lang.Mail.Write.sichuanijvjElVE, top.Lang.Mail.Write.zhongqingIoUmIEYz, top.Lang.Mail.Write.guizhoutEpzMybI, top.Lang.Mail.Write.yunnanKeHXxYwu, top.Lang.Mail.Write.jiangsusKihxJWJ, top.Lang.Mail.Write.shanxitUMxUHUP, top.Lang.Mail.Write.liaoningPmkDMjZI, top.Lang.Mail.Write.jilinnOQvFPmk, top.Lang.Mail.Write.namengguXXuMGgfW, top.Lang.Mail.Write.heilongjiangjuIdhcfJ, top.Lang.Mail.Write.xicangbjSQUxLw, top.Lang.Mail.Write.shanxiLiQVBkxE, top.Lang.Mail.Write.gansucGKlKFdz, top.Lang.Mail.Write.qinghaieKByMGdX, top.Lang.Mail.Write.ningxiavbKxSyni, top.Lang.Mail.Write.xinjiangXUSlPHDF, top.Lang.Mail.Write.jiangxirfceNRgU, top.Lang.Mail.Write.hainanYUkzrKAe, top.Lang.Mail.Write.taiwanhEdrQKLl, top.Lang.Mail.Write.xianggangOxofdNxA, top.Lang.Mail.Write.aomenJwsjOEQT];//北京  ||  天津  ||  上海  ||  广东  ||  广西  ||  河北  ||  河南  ||  湖北  ||  湖南  ||  福建  ||  山东  ||  安徽  ||  浙江  ||  四川  ||  重庆  ||  贵州  ||  云南  ||  江苏  ||  山西  ||  辽宁  ||  吉林  ||  内蒙古  ||  黑龙江  ||  西藏  ||  陕西  ||  甘肃  ||  青海  ||  宁夏  ||  新疆  ||  江西  ||  海南  ||  台湾  ||  香港  ||  澳门
        html[html.length] = '<a class="close" href="javascript:fGoto();" onclick="MM[\'weather\'].showWeather(true)">'+top.Lang.Mail.Write.guanbiSKDYjoqs+'</a>';//<a class="close" href="javascript:fGoto();" onclick="MM[\'weather\'].showWeather(true)">关闭</a>
        html[html.length] = '<p class="action"><label id="cityDiv"></label>';
        html[html.length] = '<select name="selProvince" id="selProvince" onchange="MM[\'weather\'].getCity(this.options[this.selectedIndex].value)">';
        html[html.length] = '<option>=='+top.Lang.Mail.Write.shengfenitkubJdN+'</option>';//<option>==省份==</option>
        provinceArr.each(function(i, v){
            html[html.length] = '<option value="' + (101 + i) + '">' + v + '</option>';
        });
        html[html.length] = '</select>';
        html[html.length] = '<select id="selCity" name="selCity">';
        html[html.length] = '<option value="">=='+top.Lang.Mail.Write.dishidBqUuUGG+'</option></select>';//<option value="">==地市==</option></select>
        html[html.length] = '<a class="btn btnSee" href="javascript:fGoto();" onclick="MM[\'weather\'].doChangeCity(true);return false;"><b class="r1"></b><span class="rContent"><span>'+top.Lang.Mail.Write.chakanFPpBeDcr+'</span></span><b class="r1"></b></a>';//<a class="btn btnSee" href="javascript:fGoto();" onclick="MM[\'weather\'].doChangeCity(true);return false;"><b class="r1"></b><span class="rContent"><span>查看</span></span><b class="r1"></b></a>
        html[html.length] = '<a class="btn btnSetDefault" href="javascript:fGoto();" onclick="MM[\'weather\'].doChangeCity();return false;"><b class="r1"></b><span class="rContent"><span>'+top.Lang.Mail.Write.sheweimorenchengshiaFuoiBUf+'</span></span><b class="r1"></b></a>';//<a class="btn btnSetDefault" href="javascript:fGoto();" onclick="MM[\'weather\'].doChangeCity();return false;"><b class="r1"></b><span class="rContent"><span>设为默认城市</span></span><b class="r1"></b></a>
        html[html.length] = '</p>';
        html[html.length] = '<div id="weatherContent">';
        html[html.length] = '</div>';
        html[html.length] = '<div class="weatherLoading" id="weatherLoading">'+top.Lang.Mail.Write.shujujiazaizhongqingshaohouqreerUYh+'</div>';//<div class="weatherLoading" id="weatherLoading">数据加载中，请稍候....</div>
        html[html.length] = '</div>';
        cityDiv.innerHTML = html.join("");
    },
    
    getWeatherList: function(isDefault, isView){
        var html = [];
        var infoArr = [top.Lang.Mail.Write.chuanyizhishucchhnmgS, top.Lang.Mail.Write.ganmaozhishuSiVraPzF, top.Lang.Mail.Write.chenlianzhishuJfdEQENE, top.Lang.Mail.Write.jiaotongzhishuBYLLykxD, top.Lang.Mail.Write.zhongshuzhishuocFKQCzg, top.Lang.Mail.Write.gongyuanzhishupQMUHpeZ, top.Lang.Mail.Write.fangshaizhishuOnbzmxEc, top.Lang.Mail.Write.lvxingzhishuAQTUwnXE];//穿衣指数  ||  感冒指数  ||  晨练指数  ||  交通指数  ||  中暑指数  ||  公园指数  ||  防晒指数  ||  旅行指数
        var p = this;
        var oc = $("selCity");
        var areaCode = "";
        var imgUrl = p.imgUrl || "";
        if (oc) {
            areaCode = oc.value;
        }
        var pm = "";
        if (areaCode) {
            pm += "&areaCode=" + areaCode;
        }
        if (isView) {
            pm += "&view=view";
        }
        if (isDefault) {
            setHtml(Weather.data);
        } else {
            this.setData(pm, setHtml,false,true);
        }
        
        function setHtml(data){
            var div = $("weatherContent");
            $("cityDiv").innerHTML = data.city;
            html[html.length] = '<ul id="detailWeatherList">';
            data.Weather.each(function(i, v){
                if (i == data.Weather.length - 1) {
                    html[html.length] = '<li class="last">';
                } else {
                    html[html.length] = '<li>';
                }
                if (v.pic0 && v.pic1) {
                    var img1 = imgUrl + '/images/weather/small/' + v.pic0 + '.gif';
                    var img2 = imgUrl + '/images/weather/small/' + v.pic1 + '.gif';
                    html[html.length] = '<p>' + v.date + '</p>';
                    html[html.length] = '<p><img alt="' + v.weather + '" src="' + img1 + '" /><img alt="' + v.weather + '" src="' + img2 + '" /></p>';
                    html[html.length] = '<p>' + v.weather + '</p>';
                    html[html.length] = '<p><span class="from">' + v.temper1 + '</span>～<span class="to">' + v.temper0 + '</span></p>';  
                }
                html[html.length] = '</li>';
            });
            html[html.length] = '</ul>';
            
            html[html.length] = '<dl id="detailWeatherInfo">';
            infoArr.each(function(i, v){
                var text = data["index" + i];
                html[html.length] = '<dt>' + v + '</dt>';
                html[html.length] = '<dd title="' + text + '">' + text + '</dd>';
            });
            html[html.length] = '</dl>';
            div.innerHTML = html.join("");
        }
    },
    
    
    
    getCity: function(code){
        var html = [];
        code += "";
        switch (code) {
            case "101":
                html[html.length] = [top.Lang.Mail.Write.beijingWSgHLIxl, "54511"];//北京
                break;
            case "102":
                html[html.length] = [top.Lang.Mail.Write.tianjinvxdruVAT, "54517"];//天津
                break;
            case "103":
                html[html.length] = [top.Lang.Mail.Write.shanghaiVklIBSdr, "58367"];//上海
                break;
            case "104":
                html[html.length] = [top.Lang.Mail.Write.guangzhouYygrEomC, "59287"];//广州
                html[html.length] = [top.Lang.Mail.Write.chaozhoucbUrtiMZ, "59312"];//潮州
                html[html.length] = [top.Lang.Mail.Write.zhaoqingHJYOaDDS, "59278"];//肇庆
                html[html.length] = [top.Lang.Mail.Write.shanweivQlkPPKi, "59501"];//汕尾
                html[html.length] = [top.Lang.Mail.Write.heyuanFnIsqphb, "59293"];//河源
                html[html.length] = [top.Lang.Mail.Write.shaoguanOkHSOIjU, "59082"];//韶关
                html[html.length] = [top.Lang.Mail.Write.jieyangBCCGGJRk, "59315"];//揭阳
                html[html.length] = [top.Lang.Mail.Write.meizhouDqkUWXPx, "59117"];//梅州
                html[html.length] = [top.Lang.Mail.Write.zhongshanWjtCrwRu, "59485"];//中山
                html[html.length] = [top.Lang.Mail.Write.huizhouQApGNJuI, "59298"];//惠州
                html[html.length] = [top.Lang.Mail.Write.dongguanwDNVYpDE, "59289"];//东莞
                html[html.length] = [top.Lang.Mail.Write.qingyuanPfqVxslh, "59280"];//清远
                html[html.length] = [top.Lang.Mail.Write.jiangmengiehfXLo, "59473"];//江门
                html[html.length] = [top.Lang.Mail.Write.maomingwmkJKNpI, "59659"];//茂名
                html[html.length] = [top.Lang.Mail.Write.yunfuSOQzHtwF, "59471"];//云浮
                html[html.length] = [top.Lang.Mail.Write.yangjiangxmpzJDDY, "59663"];//阳江
                html[html.length] = [top.Lang.Mail.Write.shantouybqpPVTI, "59316"];//汕头
                html[html.length] = [top.Lang.Mail.Write.shenchouggkhgTwE, "59493"];//深圳
                html[html.length] = [top.Lang.Mail.Write.zhuhaicctGpByP, "59488"];//珠海
                html[html.length] = [top.Lang.Mail.Write.zhanjiangWFTrcYPY, "59658"];//湛江
                html[html.length] = [top.Lang.Mail.Write.fushanVSCdmfys, "59279"];//佛山
                break;
            case "105":
                html[html.length] = [top.Lang.Mail.Write.nanningILnkmBKB, "59432"];//南宁
                html[html.length] = [top.Lang.Mail.Write.baiseaqWPFlNL, "59211"];//百色
                html[html.length] = [top.Lang.Mail.Write.liuzhouATuiDgRZ, "59046"];//柳州
                html[html.length] = [top.Lang.Mail.Write.wuzhoumgbffIUj, "59265"];//梧州
                html[html.length] = [top.Lang.Mail.Write.yulinfLKmeblU, "59453"];//玉林
                html[html.length] = [top.Lang.Mail.Write.guipinghQLlAocS, "59254"];//桂平
                html[html.length] = [top.Lang.Mail.Write.hezhouAYLXBstH, "59065"];//贺州
                html[html.length] = [top.Lang.Mail.Write.qinzhouWwEuMcBg, "59632"];//钦州
                html[html.length] = [top.Lang.Mail.Write.guigangGhFhqmWx, "59249"];//贵港
                html[html.length] = [top.Lang.Mail.Write.yangshuorhZLSBvp, "59051"];//阳朔
                html[html.length] = [top.Lang.Mail.Write.guilinRyehkgbw, "57957"];//桂林
                html[html.length] = [top.Lang.Mail.Write.beihaisymehjAP, "59644"];//北海
                html[html.length] = [top.Lang.Mail.Write.hechiKAihfEBt, "59023"];//河池
                break;
            case "106":
                html[html.length] = [top.Lang.Mail.Write.shijiazhuangsZiUsQKk, "53698"];//石家庄
                html[html.length] = [top.Lang.Mail.Write.tangshanjZeWmCGB, "54534"];//唐山
                html[html.length] = [top.Lang.Mail.Write.zhangjiakoupOtutLEm, "54401"];//张家口
                html[html.length] = [top.Lang.Mail.Write.langfangkfpFVElH, "54515"];//廊坊
                html[html.length] = [top.Lang.Mail.Write.handanMeKVvmwW, "53892"];//邯郸
                html[html.length] = [top.Lang.Mail.Write.xingtaicXmTryUu, "53798"];//邢台
                html[html.length] = [top.Lang.Mail.Write.cangzhouHGotYMSD, "54616"];//沧州
                html[html.length] = [top.Lang.Mail.Write.hengshuibRbQnMFj, "54702"];//衡水
                html[html.length] = [top.Lang.Mail.Write.chengdeDLcvrnsT, "54423"];//承德
                html[html.length] = [top.Lang.Mail.Write.qinhuangdaojptKyRFM, "54449"];//秦皇岛
                html[html.length] = [top.Lang.Mail.Write.baodingpsrCEZPI, "54602"];//保定
                break;
            case "107":
                html[html.length] = [top.Lang.Mail.Write.zhengzhouTZCkMqCP, "57083"];//郑州
                html[html.length] = [top.Lang.Mail.Write.kaifengihRnYNWf, "57091"];//开封
                html[html.length] = [top.Lang.Mail.Write.anyangWdMSHMdb, "53898"];//安阳
                html[html.length] = [top.Lang.Mail.Write.jiaozuoCYfwFJSq, "53982"];//焦作
                html[html.length] = [top.Lang.Mail.Write.hebiNDtjfQRT, "53990"];//鹤壁
                html[html.length] = [top.Lang.Mail.Write.pingdingshanciUwNXuG, "57171"];//平顶山
                html[html.length] = [top.Lang.Mail.Write.shangqiurONNuXAn, "58005"];//商丘
                html[html.length] = [top.Lang.Mail.Write.puyangwBoAjyeB, "54900"];//濮阳
                html[html.length] = [top.Lang.Mail.Write.nanyangYJRWrzCD, "57178"];//南阳
                html[html.length] = [top.Lang.Mail.Write.xuchangJiCTbiwL, "57089"];//许昌
                html[html.length] = [top.Lang.Mail.Write.xinyangesYrgCuF, "57297"];//信阳
                html[html.length] = [top.Lang.Mail.Write.sanmenxiaSsepKKYF, "57051"];//三门峡
                html[html.length] = [top.Lang.Mail.Write.zhumadianwNprCcZJ, "57290"];//驻马店
                html[html.length] = [top.Lang.Mail.Write.zhoukouqyEBUHwX, "57195"];//周口
                html[html.length] = [top.Lang.Mail.Write.xinxiangPKkcqmHT, "53986"];//新乡
                html[html.length] = [top.Lang.Mail.Write.luoyangnbiYHEAN, "57073"];//洛阳
                html[html.length] = [top.Lang.Mail.Write.kaifenghYYfWsUW, "57091"];//开封
                break;
            case "108":
                html[html.length] = [top.Lang.Mail.Write.wuhanxvYXXDvf, "57494"];//武汉
                html[html.length] = [top.Lang.Mail.Write.huanggangsdwgfoyt, "57498"];//黄冈
                html[html.length] = [top.Lang.Mail.Write.enshiMvJDhUqj, "57447"];//恩施
                html[html.length] = [top.Lang.Mail.Write.jingzhouMiPIdQVv, "57476"];//荆州
                html[html.length] = [top.Lang.Mail.Write.shennongjiaPoGkHiMY, "57362"];//神农架
                html[html.length] = [top.Lang.Mail.Write.shiyanPOttwwky, "57256"];//十堰
                html[html.length] = [top.Lang.Mail.Write.xianningMTLErCPy, "57590"];//咸宁
                html[html.length] = [top.Lang.Mail.Write.xiangfanvtCAeeei, "57278"];//襄樊
                html[html.length] = [top.Lang.Mail.Write.xiaoganPsiDnQKQ, "57482"];//孝感
                html[html.length] = [top.Lang.Mail.Write.suizhouGbocSLWa, "57381"];//随州
                html[html.length] = [top.Lang.Mail.Write.huangshiTOQjdeYt, "58407"];//黄石
                html[html.length] = [top.Lang.Mail.Write.jingmenHhZYELPQ, "57377"];//荆门
                html[html.length] = [top.Lang.Mail.Write.ezhouvLjrNACP, "57496"];//鄂州
                html[html.length] = [top.Lang.Mail.Write.yichangWQzSVLOJ, "57461"];//宜昌
                break;
            case "109":
                html[html.length] = [top.Lang.Mail.Write.changshaOLitpdGg, "57687"];//长沙
                html[html.length] = [top.Lang.Mail.Write.shaoyangfumMmJox, "57766"];//邵阳
                html[html.length] = [top.Lang.Mail.Write.changdexPLcUpZc, "57662"];//常德
                html[html.length] = [top.Lang.Mail.Write.chenzhouoLEXSkVI, "57972"];//郴州
                html[html.length] = [top.Lang.Mail.Write.jishouQvHxlvwp, "57649"];//吉首
                html[html.length] = [top.Lang.Mail.Write.zhuzhouCbnBTaXZ, "57780"];//株洲
                html[html.length] = [top.Lang.Mail.Write.loudinJSXbVMN, "57763"];//娄底
                html[html.length] = [top.Lang.Mail.Write.xiangtanLIUctHjw, "57773"];//湘潭
                html[html.length] = [top.Lang.Mail.Write.yongzhoubDoYAwOR, "57866"];//永州
                html[html.length] = [top.Lang.Mail.Write.yueyangRQVKxNjC, "57584"];//岳阳
                html[html.length] = [top.Lang.Mail.Write.hengyangllqaDpAc, "57872"];//衡阳
                html[html.length] = [top.Lang.Mail.Write.huaihuamCyPUwIb, "57749"];//怀化
                html[html.length] = [top.Lang.Mail.Write.shaoshanTSXPWYHt, "57771"];//韶山
                html[html.length] = [top.Lang.Mail.Write.zhangjiajieIjdnvUqH, "57558"];//张家界
                html[html.length] = [top.Lang.Mail.Write.hengshanPYXIJubN, "57777"];//衡山
                break;
            case "110":
                html[html.length] = [top.Lang.Mail.Write.fuzhoujgMWGypp, "58847"];//福州
                html[html.length] = [top.Lang.Mail.Write.longyanrEGqkTqC, "58927"];//龙岩
                html[html.length] = [top.Lang.Mail.Write.nanpingCEgoYWEW, "58834"];//南平
                html[html.length] = [top.Lang.Mail.Write.ningdecTFsqpoQ, "58846"];//宁德
                html[html.length] = [top.Lang.Mail.Write.putianvUPcoAlR, "58946"];//莆田
                html[html.length] = [top.Lang.Mail.Write.quanzhouMebdCKYY, "59137"];//泉州
                html[html.length] = [top.Lang.Mail.Write.sanmingMVrMjWXr, "58828"];//三明
                html[html.length] = [top.Lang.Mail.Write.zhangzhouvVCsEufb, "59126"];//漳州
                html[html.length] = [top.Lang.Mail.Write.xiamenpUtLCoTJ, "59134"];//厦门
                html[html.length] = [top.Lang.Mail.Write.wuyishanshiHNvpccMS, "58730"];//武夷山市
                break;
            case "111":
                html[html.length] = [top.Lang.Mail.Write.jinanqBrVXMzO, "54823"];//济南
                html[html.length] = [top.Lang.Mail.Write.zaozhuangKrKiuFUq, "58024"];//枣庄
                html[html.length] = [top.Lang.Mail.Write.liaochengkRlUpkxA, "54806"];//聊城
                html[html.length] = [top.Lang.Mail.Write.qufuLRrYeEOF, "54918"];//曲阜
                html[html.length] = [top.Lang.Mail.Write.jiningTpFvIyEZ, "54915"];//济宁
                html[html.length] = [top.Lang.Mail.Write.linyiBPZVULtT, "54938"];//临沂
                html[html.length] = [top.Lang.Mail.Write.hezeAweJAMVx, "54906"];//菏泽
                html[html.length] = [top.Lang.Mail.Write.taianyHZJWOZw, "54827"];//泰安
                html[html.length] = [top.Lang.Mail.Write.rizhaodXFFlBUe, "54945"];//日照
                html[html.length] = [top.Lang.Mail.Write.dongyingniRXqzmj, "54736"];//东营
                html[html.length] = [top.Lang.Mail.Write.qingdaomdeEUkXw, "54857"];//青岛
                html[html.length] = [top.Lang.Mail.Write.weihairkswAVSI, "54774"];//威海
                html[html.length] = [top.Lang.Mail.Write.taishanNHxWvbkD, "54826"];//泰山
                html[html.length] = [top.Lang.Mail.Write.yantaiPBGCSQPJ, "54765"];//烟台
                html[html.length] = [top.Lang.Mail.Write.weifangeqcjOsmB, "54843"];//潍坊
                html[html.length] = [top.Lang.Mail.Write.zibopMSavfUc, "54830"];//淄博
                break;
            case "112":
                html[html.length] = [top.Lang.Mail.Write.hefeiPYKYmwCV, "58321"];//合肥
                html[html.length] = [top.Lang.Mail.Write.chaohujIRRndfh, "58326"];//巢湖
                html[html.length] = [top.Lang.Mail.Write.bangbujiHUoPrX, "58221"];//蚌埠
                html[html.length] = [top.Lang.Mail.Write.anqingGUrIiPDh, "58424"];//安庆
                html[html.length] = [top.Lang.Mail.Write.liuanXFooXJNh, "58311"];//六安
                html[html.length] = [top.Lang.Mail.Write.chuzhouSqsWjiQA, "58236"];//滁州
                html[html.length] = [top.Lang.Mail.Write.maanshanfPlBymms, "58336"];//马鞍山
                html[html.length] = [top.Lang.Mail.Write.fuyangNcmHtdOb, "58203"];//阜阳
                html[html.length] = [top.Lang.Mail.Write.xuanchengKAQDyMCC, "58433"];//宣城
                html[html.length] = [top.Lang.Mail.Write.tonglingsKSuVYhd, "58429"];//铜陵
                html[html.length] = [top.Lang.Mail.Write.huaibeisMuUSXqf, "58116"];//淮北
                html[html.length] = [top.Lang.Mail.Write.wuhukiwdYaeu, "58334"];//芜湖
                html[html.length] = [top.Lang.Mail.Write.bozhouTnwsmvAK, "58102"];//亳州
                html[html.length] = [top.Lang.Mail.Write.suzhouFCfnBvYn, "58122"];//宿州
                html[html.length] = [top.Lang.Mail.Write.huainanuisNEdSz, "58224"];//淮南
                html[html.length] = [top.Lang.Mail.Write.huangshanzhanFgVNykrv, "58437"];//黄山站
                html[html.length] = [top.Lang.Mail.Write.jiuhuashanghebGIMk, "58423"];//九华山
                break;
            case "113":
                html[html.length] = [top.Lang.Mail.Write.hangzhoukWhAfFRf, "58457"];//杭州
                html[html.length] = [top.Lang.Mail.Write.huzhouSKUICXro, "58450"];//湖州
                html[html.length] = [top.Lang.Mail.Write.jinhuaBvahuimd, "58549"];//金华
                html[html.length] = [top.Lang.Mail.Write.ningbocXnDiMmg, "58563"];//宁波
                html[html.length] = [top.Lang.Mail.Write.lishuiUXXBBpGd, "58646"];//丽水
                html[html.length] = [top.Lang.Mail.Write.quzhouPUxjwEZv, "58633"];//衢州
                html[html.length] = [top.Lang.Mail.Write.jiaxingtRVvufDC, "58452"];//嘉兴
                html[html.length] = [top.Lang.Mail.Write.taizhousybETzAE, "58660"];//台州
                html[html.length] = [top.Lang.Mail.Write.zhoushanZuOrOYXg, "58477"];//舟山
                html[html.length] = [top.Lang.Mail.Write.yinxianrwNKIvAw, "58562"];//鄞县
                html[html.length] = [top.Lang.Mail.Write.leqingdoXlkLVh, "58656"];//乐清
                html[html.length] = [top.Lang.Mail.Write.wenzhoutqTPxRbw, "58659"];//温州
                html[html.length] = [top.Lang.Mail.Write.zhoushanwiJrSlTf, "58477"];//舟山
                break;
            case "114":
                html[html.length] = [top.Lang.Mail.Write.chengdumkIMsEbN, "56294"];//成都
                html[html.length] = [top.Lang.Mail.Write.luzhouvtJVzSFR, "57602"];//泸州
                html[html.length] = [top.Lang.Mail.Write.najiangpMbixLAI, "57504"];//内江
                html[html.length] = [top.Lang.Mail.Write.liangshanadpsfrUn, "56571"];//凉山
                html[html.length] = [top.Lang.Mail.Write.abaFeXskWtQ, "56171"];//阿坝
                html[html.length] = [top.Lang.Mail.Write.bazhongTysriZoe, "57313"];//巴中
                html[html.length] = [top.Lang.Mail.Write.guangyuanZDMXFuJg, "57206"];//广元
                html[html.length] = [top.Lang.Mail.Write.leshanLgSkhWms, "56386"];//乐山
                html[html.length] = [top.Lang.Mail.Write.mianyangCBUtykMH, "56196"];//绵阳
                html[html.length] = [top.Lang.Mail.Write.deyangYYKzRilA, "56198"];//德阳
                html[html.length] = [top.Lang.Mail.Write.panzhihuajCVkzulg, "56666"];//攀枝花
                html[html.length] = [top.Lang.Mail.Write.yaanSabylsuc, "56287"];//雅安
                html[html.length] = [top.Lang.Mail.Write.yibinAJyeYmmX, "56492"];//宜宾
                html[html.length] = [top.Lang.Mail.Write.zigongzWAZOwqN, "56396"];//自贡
                html[html.length] = [top.Lang.Mail.Write.ganzizhouWMNmbHhQ, "56146"];//甘孜州
                html[html.length] = [top.Lang.Mail.Write.dazhouIlzgLksF, "57328"];//达州
                html[html.length] = [top.Lang.Mail.Write.emeishanGmFFDHUJ, "56385"];//峨眉山
                break;
            case "115":
                html[html.length] = [top.Lang.Mail.Write.zhongqingVQumMWXe, "57516"];//重庆
                break;
            case "116":
                html[html.length] = [top.Lang.Mail.Write.guiyangXPrrfsyd, "57816"];//贵阳
                html[html.length] = [top.Lang.Mail.Write.anshunJOwnnqtN, "57806"];//安顺
                html[html.length] = [top.Lang.Mail.Write.chishuiaztgxQdP, "57609"];//赤水
                html[html.length] = [top.Lang.Mail.Write.zunyihzYqbHmq, "57713"];//遵义
                html[html.length] = [top.Lang.Mail.Write.tongrenDzHyOrnn, "57741"];//铜仁
                html[html.length] = [top.Lang.Mail.Write.liupanshuiZTazcIdR, "56693"];//六盘水
                html[html.length] = [top.Lang.Mail.Write.bijiesJfwOfiR, "57707"];//毕节
                html[html.length] = [top.Lang.Mail.Write.kailicnOIykQf, "57825"];//凯里
                html[html.length] = [top.Lang.Mail.Write.duyunUSjJHcml, "57827"];//都匀
                break;
            case "117":
                html[html.length] = [top.Lang.Mail.Write.tongshiLicMcTaT, "59941"];//通什
                html[html.length] = [top.Lang.Mail.Write.kunmingpupKzfTY, "56778"];//昆明
                html[html.length] = [top.Lang.Mail.Write.baoshanoGvOsQqi, "56748"];//保山
                html[html.length] = [top.Lang.Mail.Write.chuxiongsynKOenA, "56768"];//楚雄
                html[html.length] = [top.Lang.Mail.Write.dehongbujqkyXB, "56844"];//德宏
                html[html.length] = [top.Lang.Mail.Write.hongheoKRngZKh, "56975"];//红河
                html[html.length] = [top.Lang.Mail.Write.lincangucnqUUyL, "56951"];//临沧
                html[html.length] = [top.Lang.Mail.Write.nujianghcjDFGfF, "56533"];//怒江
                html[html.length] = [top.Lang.Mail.Write.qujingkRnOIpVU, "56783"];//曲靖
                html[html.length] = [top.Lang.Mail.Write.simaoHonpjBsa, "56964"];//思茅
                html[html.length] = [top.Lang.Mail.Write.wenshanxhXhmPGG, "56994"];//文山
                html[html.length] = [top.Lang.Mail.Write.yuxicTIEtDXg, "56875"];//玉溪
                html[html.length] = [top.Lang.Mail.Write.zhaotongEDqXgDjN, "56586"];//昭通
                html[html.length] = [top.Lang.Mail.Write.dalitTLdTtKG, "56751"];//大理
                html[html.length] = [top.Lang.Mail.Write.lijiangPoKJRoGL, "56651"];//丽江
                html[html.length] = [top.Lang.Mail.Write.deqinIxvsvsnF, "56444"];//德钦
                break;
            case "118":
                html[html.length] = [top.Lang.Mail.Write.kunshanGOUoynfY, "58356"];//昆山
                html[html.length] = [top.Lang.Mail.Write.nanjingOMTDDvyQ, "58238"];//南京
                html[html.length] = [top.Lang.Mail.Write.nantongFBppRqkC, "58259"];//南通
                html[html.length] = [top.Lang.Mail.Write.taicangpGYLXJFT, "58377"];//太仓
                html[html.length] = [top.Lang.Mail.Write.suzhouLdsojWSG, "58357"];//苏州
                
                html[html.length] = [top.Lang.Mail.Write.xuzhoukFbrkSMA, "58027"];//徐州
                html[html.length] = [top.Lang.Mail.Write.yixingQvIedKOm, "58346"];//宜兴
                html[html.length] = [top.Lang.Mail.Write.zhenjiangrvwrBnVv, "58248"];//镇江
                html[html.length] = [top.Lang.Mail.Write.huaianCxzXYBWu, "58145"];//淮安
                html[html.length] = [top.Lang.Mail.Write.changshupcVzbVnu, "58352"];//常熟
                html[html.length] = [top.Lang.Mail.Write.yanchengjkCbgAeM, "58151"];//盐城
                html[html.length] = [top.Lang.Mail.Write.taizhouueUxLddS, "58246"];//泰州
                html[html.length] = [top.Lang.Mail.Write.suzhouiTUHnVGd, "58357"];//苏州
                html[html.length] = [top.Lang.Mail.Write.wuxisyNBMJry, "58354"];//无锡
                html[html.length] = [top.Lang.Mail.Write.lianyungangJdcnAzPN, "58044"];//连云港
                html[html.length] = [top.Lang.Mail.Write.yangzhouiwlLKJSo, "58245"];//扬州
                html[html.length] = [top.Lang.Mail.Write.changzhouzhFkBfMs, "58343"];//常州
                break;
            case "119":
                html[html.length] = [top.Lang.Mail.Write.taiyuanYDPyqHMv, "53772"];//太原
                html[html.length] = [top.Lang.Mail.Write.yangquanlyoEMxHF, "53782"];//阳泉
                html[html.length] = [top.Lang.Mail.Write.jinchengCHpblNKg, "53976"];//晋城
                html[html.length] = [top.Lang.Mail.Write.jinzhongrLxOVtAn, "53778"];//晋中
                html[html.length] = [top.Lang.Mail.Write.linfenpgjXuUJz, "53868"];//临汾
                html[html.length] = [top.Lang.Mail.Write.yunchengzlPIHsYY, "53959"];//运城
                html[html.length] = [top.Lang.Mail.Write.changzhiKzmtzqbX, "53882"];//长治
                html[html.length] = [top.Lang.Mail.Write.shuozhouDGEFKdFA, "53578"];//朔州
                html[html.length] = [top.Lang.Mail.Write.xinzhouMjwVgIRU, "53674"];//忻州
                html[html.length] = [top.Lang.Mail.Write.datongeFABEhuR, "53487"];//大同
                html[html.length] = [top.Lang.Mail.Write.wutaishannFCrdPRK, "53588"];//五台山
                break;
            case "120":
                html[html.length] = [top.Lang.Mail.Write.shenyangksQMBCuv, "54342"];//沈阳
                html[html.length] = [top.Lang.Mail.Write.huludaolpScObqj, "54453"];//葫芦岛
                html[html.length] = [top.Lang.Mail.Write.lvshunnhPMscRz, "54660"];//旅顺
                html[html.length] = [top.Lang.Mail.Write.benxilMhTISGj, "54346"];//本溪
                html[html.length] = [top.Lang.Mail.Write.chaoyangPUSKUPdD, "54324"];//朝阳
                html[html.length] = [top.Lang.Mail.Write.fushunnGLcsrtn, "54353"];//抚顺
                html[html.length] = [top.Lang.Mail.Write.tielingbroyMPZF, "54249"];//铁岭
                html[html.length] = [top.Lang.Mail.Write.liaoyangcGcPxnwg, "54347"];//辽阳
                html[html.length] = [top.Lang.Mail.Write.yingkouPeOipzWJ, "54471"];//营口
                html[html.length] = [top.Lang.Mail.Write.fuxinepMWjoBx, "54237"];//阜新
                html[html.length] = [top.Lang.Mail.Write.dalianZEsUqYEU, "54662"];//大连
                html[html.length] = [top.Lang.Mail.Write.dandongYWFyJcBz, "54497"];//丹东
                html[html.length] = [top.Lang.Mail.Write.anshanrooizNqW, "54339"];//鞍山
                html[html.length] = [top.Lang.Mail.Write.jinzhoukCWLvCMQ, "54337"];//锦州
                break;
            case "121":
                html[html.length] = [top.Lang.Mail.Write.changchunMbzgCFhB, "54161"];//长春
                html[html.length] = [top.Lang.Mail.Write.yanjiEPHtecVv, "54292"];//延吉
                html[html.length] = [top.Lang.Mail.Write.jilinlBEvwhLX, "54172"];//吉林
                html[html.length] = [top.Lang.Mail.Write.baishanmVpjFksP, "54371"];//白山
                html[html.length] = [top.Lang.Mail.Write.baichengCaXNYDZd, "50936"];//白城
                html[html.length] = [top.Lang.Mail.Write.sipingguXFeBhH, "54157"];//四平
                html[html.length] = [top.Lang.Mail.Write.songyuanXdqPBgvW, "50946"];//松原
                html[html.length] = [top.Lang.Mail.Write.liaoyuanUtSlehJr, "54260"];//辽源
                html[html.length] = [top.Lang.Mail.Write.changbaiJYFbaQhd, "54386"];//长白
                html[html.length] = [top.Lang.Mail.Write.daanPjJjWxIQ, "50945"];//大安
                html[html.length] = [top.Lang.Mail.Write.tonghuaGTPuoTRN, "54363"];//通化
                break;
            case "122":
                html[html.length] = [top.Lang.Mail.Write.huhehaoteUomKBeXt, "53463"];//呼和浩特
                html[html.length] = [top.Lang.Mail.Write.baotouxpEosHgt, "53446"];//包头
                html[html.length] = [top.Lang.Mail.Write.chifengjePctcKb, "54218"];//赤峰
                html[html.length] = [top.Lang.Mail.Write.hailaerOURiiQjM, "50527"];//海拉尔
                html[html.length] = [top.Lang.Mail.Write.xilinhaoteAzeRtgqt, "54102"];//锡林浩特
                html[html.length] = [top.Lang.Mail.Write.wuhaiTfMpiShc, "53512"];//乌海
                html[html.length] = [top.Lang.Mail.Write.eerduositTdLxDyt, "53543"];//鄂尔多斯
                html[html.length] = [top.Lang.Mail.Write.yakeshitkLArdKn, "50526"];//牙克石
                html[html.length] = [top.Lang.Mail.Write.manzhoulijmwlMDLS, "50514"];//满洲里
                break;
            case "123":
                html[html.length] = [top.Lang.Mail.Write.haerbinIOdybOLp, "50953"];//哈尔滨
                html[html.length] = [top.Lang.Mail.Write.mudanjiangEDwsjyAb, "54094"];//牡丹江
                html[html.length] = [top.Lang.Mail.Write.qiqihaeryRTIRXfx, "50745"];//齐齐哈尔
                html[html.length] = [top.Lang.Mail.Write.daqingpYmUlpcR, "50842"];//大庆
                html[html.length] = [top.Lang.Mail.Write.yichunlwXKTTOi, "50774"];//伊春
                html[html.length] = [top.Lang.Mail.Write.shuangyashanyyGhTHgx, "50884"];//双鸭山
                html[html.length] = [top.Lang.Mail.Write.hegangsuKSTNEZ, "50775"];//鹤岗
                html[html.length] = [top.Lang.Mail.Write.jixixwoYcKan, "50978"];//鸡西
                html[html.length] = [top.Lang.Mail.Write.jiamusiLhsVBLjH, "50873"];//佳木斯
                html[html.length] = [top.Lang.Mail.Write.qitaihekXugTsVY, "50971"];//七台河
                html[html.length] = [top.Lang.Mail.Write.suihuaNWzwzHHs, "50853"];//绥化
                html[html.length] = [top.Lang.Mail.Write.heiheWhMCWHEL, "50468"];//黑河
                html[html.length] = [top.Lang.Mail.Write.mudanjianglTiCBFzG, "54094"];//牡丹江
                html[html.length] = [top.Lang.Mail.Write.daxinganlingObvoTvQq, "50442"];//大兴安岭
                html[html.length] = [top.Lang.Mail.Write.heiheJBEvTLsG, "50468"];//黑河
                break;
            case "124":
                html[html.length] = [top.Lang.Mail.Write.lasaqeQxlMkk, "55591"];//拉萨
                html[html.length] = [top.Lang.Mail.Write.changduODYDRDNq, "56137"];//昌都
                html[html.length] = [top.Lang.Mail.Write.alicXAKINSe, "55437"];//阿里
                html[html.length] = [top.Lang.Mail.Write.naquLGgDywkz, "55299"];//那曲
                html[html.length] = [top.Lang.Mail.Write.rikazeTMEThVjI, "55578"];//日喀则
                html[html.length] = [top.Lang.Mail.Write.shannanpJWwZxbm, "55598"];//山南
                html[html.length] = [top.Lang.Mail.Write.linzhivwmEocDq, "56312"];//林芝
                break;
            case "125":
                html[html.length] = [top.Lang.Mail.Write.xianzjqZhumG, "57036"];//西安
                html[html.length] = [top.Lang.Mail.Write.hanchengNgfyiwtE, "53955"];//韩城
                html[html.length] = [top.Lang.Mail.Write.hanzhongcqlJzKdR, "57127"];//汉中
                html[html.length] = [top.Lang.Mail.Write.baojiRoGOGxGe, "57016"];//宝鸡
                html[html.length] = [top.Lang.Mail.Write.xianyangIkxuOkzK, "57048"];//咸阳
                html[html.length] = [top.Lang.Mail.Write.yulinzrOfmFmP, "53646"];//榆林
                html[html.length] = [top.Lang.Mail.Write.weinanyzIujpYJ, "57045"];//渭南
                html[html.length] = [top.Lang.Mail.Write.shangzhoutmSUkLcs, "57143"];//商州
                html[html.length] = [top.Lang.Mail.Write.tongchuanVXBCtfAt, "53947"];//铜川
                html[html.length] = [top.Lang.Mail.Write.huashankqLuuHLW, "57046"];//华山
                html[html.length] = [top.Lang.Mail.Write.yananRzCFqdNe, "53845"];//延安
                break;
            case "126":
                html[html.length] = [top.Lang.Mail.Write.lanzhourJbdSiKU, "52889"];//兰州
                html[html.length] = [top.Lang.Mail.Write.baiyiniidoYSoy, "52896"];//白银
                html[html.length] = [top.Lang.Mail.Write.qingyangSdhWVzyx, "53829"];//庆阳
                html[html.length] = [top.Lang.Mail.Write.jiuquanMdVdonTD, "52533"];//酒泉
                html[html.length] = [top.Lang.Mail.Write.tianshuijKRwKSmz, "57006"];//天水
                html[html.length] = [top.Lang.Mail.Write.wuweiINSufXzs, "52679"];//武威
                html[html.length] = [top.Lang.Mail.Write.zhangyecAPwJMts, "52652"];//张掖
                html[html.length] = [top.Lang.Mail.Write.gannaneseLsciW, "50741"];//甘南
                html[html.length] = [top.Lang.Mail.Write.linxiaHVzpUevp, "52984"];//临夏
                html[html.length] = [top.Lang.Mail.Write.pingliangFbFkSDWy, "53915"];//平凉
                html[html.length] = [top.Lang.Mail.Write.dingximFvuCmah, "52995"];//定西
                html[html.length] = [top.Lang.Mail.Write.jinchangdIrDiEqf, "52675"];//金昌
                html[html.length] = [top.Lang.Mail.Write.dunhuangGLiFoepI, "52418"];//敦煌
                break;
            case "127":
                html[html.length] = [top.Lang.Mail.Write.xiningdSCydNwx, "52866"];//西宁
                html[html.length] = [top.Lang.Mail.Write.haibeivbqpXYdL, "52754"];//海北
                html[html.length] = [top.Lang.Mail.Write.hainanoiMlrLTs, "52856"];//海南
                html[html.length] = [top.Lang.Mail.Write.haixiFKRshitM, "52737"];//海西
                html[html.length] = [top.Lang.Mail.Write.huangnanSXQYrAsn, "56065"];//黄南
                html[html.length] = [top.Lang.Mail.Write.haidongNnDKtMER, "52875"];//海东
                html[html.length] = [top.Lang.Mail.Write.guoluoCTMtirtF, "56043"];//果洛
                html[html.length] = [top.Lang.Mail.Write.yushusuRuDgUI, "56029"];//玉树
                break;
            case "128":
                html[html.length] = [top.Lang.Mail.Write.yinchuanFdJIzxXR, "53614"];//银川
                html[html.length] = [top.Lang.Mail.Write.guyuannbVONzxG, "53817"];//固原
                html[html.length] = [top.Lang.Mail.Write.zhongweicGrJEtbM, "53704"];//中卫
                html[html.length] = [top.Lang.Mail.Write.shizuishanZwrLTOpq, "53518"];//石嘴山
                html[html.length] = [top.Lang.Mail.Write.wuzhongXAJhaOOt, "53612"];//吴忠
                break;
            case "129":
                html[html.length] = [top.Lang.Mail.Write.wulumuqiaFTyXyWV, "51463"];//乌鲁木齐
                html[html.length] = [top.Lang.Mail.Write.aletaiaSelgwOi, "51076"];//阿勒泰
                html[html.length] = [top.Lang.Mail.Write.akesuwRUCQgPt, "51628"];//阿克苏
                html[html.length] = [top.Lang.Mail.Write.changjiDkSsNaXH, "51368"];//昌吉
                html[html.length] = [top.Lang.Mail.Write.hamiwSDJenAu, "52203"];//哈密
                html[html.length] = [top.Lang.Mail.Write.hetianPbiFsuez, "51828"];//和田
                html[html.length] = [top.Lang.Mail.Write.kashiVwLFZxyf, "51709"];//喀什
                html[html.length] = [top.Lang.Mail.Write.kelamayiNAiLNmuU, "51243"];//克拉玛依
                html[html.length] = [top.Lang.Mail.Write.shihezidToJERwg, "51356"];//石河子
                html[html.length] = [top.Lang.Mail.Write.tachengwtyISiHA, "51133"];//塔城
                html[html.length] = [top.Lang.Mail.Write.kuerlenZFBcfOC, "51656"];//库尔勒
                html[html.length] = [top.Lang.Mail.Write.yiningAmAdgUOj, "51431"];//伊宁
                html[html.length] = [top.Lang.Mail.Write.tulufandUfsdDVm, "51573"];//吐鲁番
                break;
            case "130":
                html[html.length] = [top.Lang.Mail.Write.nanchangoNbcsSRg, "58606"];//南昌
                html[html.length] = [top.Lang.Mail.Write.jinggangshanMEfdygQK, "57894"];//井冈山
                html[html.length] = [top.Lang.Mail.Write.pingxiangDqicUCqT, "57786"];//萍乡
                html[html.length] = [top.Lang.Mail.Write.jiujiangKnQozcRz, "58502"];//九江
                html[html.length] = [top.Lang.Mail.Write.shangraoRQbCgFOm, "58637"];//上饶
                html[html.length] = [top.Lang.Mail.Write.fuzhouNcvqPLXh, "58617"];//抚州
                html[html.length] = [top.Lang.Mail.Write.jiandOJsVAVS, "57799"];//吉安
                html[html.length] = [top.Lang.Mail.Write.yingtanHkhDyJqX, "58627"];//鹰潭
                html[html.length] = [top.Lang.Mail.Write.yichunhSTQGgzR, "57793"];//宜春
                html[html.length] = [top.Lang.Mail.Write.lushanlsidIYBd, "58506"];//庐山
                html[html.length] = [top.Lang.Mail.Write.ganzhouFzyscrYt, "57993"];//赣州
                html[html.length] = [top.Lang.Mail.Write.duchangOdzYUvnd, "58517"];//都昌
                html[html.length] = [top.Lang.Mail.Write.xinyuYNNPjAdr, "57796"];//新余
                html[html.length] = [top.Lang.Mail.Write.jingdezhenbcLocEiY, "58527"];//景德镇
                break;
            case "131":
                html[html.length] = [top.Lang.Mail.Write.haikouINlvMpep, "59758"];//海口
                html[html.length] = [top.Lang.Mail.Write.danzhouMXwaMpKq, "59845"];//儋州
                html[html.length] = [top.Lang.Mail.Write.qiongshanRcEHrPQF, "59757"];//琼山
                html[html.length] = [top.Lang.Mail.Write.tongshivvuAVJGi, "59941"];//通什
                html[html.length] = [top.Lang.Mail.Write.wenchangBiDRxeGf, "59856"];//文昌
                html[html.length] = [top.Lang.Mail.Write.sanyaxyTDrvjR, "59948"];//三亚
                html[html.length] = [top.Lang.Mail.Write.xishaQfOsdJxG, "59981"];//西沙
                html[html.length] = [top.Lang.Mail.Write.nanshadaoHLANLFgx, "59997"];//南沙岛
                break;
            case "132":
                html[html.length] = [top.Lang.Mail.Write.taibeiYYKvKXGL, "58968"];//台北
                html[html.length] = [top.Lang.Mail.Write.gaoxiongigTXwLot, "59554"];//高雄
                break;
            case "133":
                html[html.length] = [top.Lang.Mail.Write.xianggangYMrhNhwh, "45005"];//香港
                break;
            case "134":
                html[html.length] = [top.Lang.Mail.Write.aomenzVKpUkDh, "45011"];//澳门
                break;
        }
        var oCity = $("selCity");
        oCity.options.length = 1;
        html.each(function(i, v){
            var item = new Option(v[0], v[1]);
            oCity.options.add(item);
        });
    }
};



