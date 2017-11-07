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
            var date = Util.parseDate(curDate, "yyyy-m月d日");
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
        var provinceArr = ["北京", "天津", "上海", "广东", "广西", "河北", "河南", "湖北", "湖南", "福建", "山东", "安徽", "浙江", "四川", "重庆", "贵州", "云南", "江苏", "山西", "辽宁", "吉林", "内蒙古", "黑龙江", "西藏", "陕西", "甘肃", "青海", "宁夏", "新疆", "江西", "海南", "台湾", "香港", "澳门"];
        html[html.length] = '<a class="close" href="javascript:fGoto();" onclick="MM[\'weather\'].showWeather(true)">关闭</a>';
        html[html.length] = '<p class="action"><label id="cityDiv"></label>';
        html[html.length] = '<select name="selProvince" id="selProvince" onchange="MM[\'weather\'].getCity(this.options[this.selectedIndex].value)">';
        html[html.length] = '<option>==省份==</option>';
        provinceArr.each(function(i, v){
            html[html.length] = '<option value="' + (101 + i) + '">' + v + '</option>';
        });
        html[html.length] = '</select>';
        html[html.length] = '<select id="selCity" name="selCity">';
        html[html.length] = '<option value="">==地市==</option></select>';
        html[html.length] = '<a class="btn btnSee" href="javascript:fGoto();" onclick="MM[\'weather\'].doChangeCity(true);return false;"><b class="r1"></b><span class="rContent"><span>查看</span></span><b class="r1"></b></a>';
        html[html.length] = '<a class="btn btnSetDefault" href="javascript:fGoto();" onclick="MM[\'weather\'].doChangeCity();return false;"><b class="r1"></b><span class="rContent"><span>设为默认城市</span></span><b class="r1"></b></a>';
        html[html.length] = '</p>';
        html[html.length] = '<div id="weatherContent">';
        html[html.length] = '</div>';
        html[html.length] = '<div class="weatherLoading" id="weatherLoading">数据加载中，请稍候....</div>';
        html[html.length] = '</div>';
        cityDiv.innerHTML = html.join("");
    },
    
    getWeatherList: function(isDefault, isView){
        var html = [];
        var infoArr = ["穿衣指数", "感冒指数", "晨练指数", "交通指数", "中暑指数", "公园指数", "防晒指数", "旅行指数"];
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
                html[html.length] = ["北京", "54511"];
                break;
            case "102":
                html[html.length] = ["天津", "54517"];
                break;
            case "103":
                html[html.length] = ["上海", "58367"];
                break;
            case "104":
                html[html.length] = ["广州", "59287"];
                html[html.length] = ["潮州", "59312"];
                html[html.length] = ["肇庆", "59278"];
                html[html.length] = ["汕尾", "59501"];
                html[html.length] = ["河源", "59293"];
                html[html.length] = ["韶关", "59082"];
                html[html.length] = ["揭阳", "59315"];
                html[html.length] = ["梅州", "59117"];
                html[html.length] = ["中山", "59485"];
                html[html.length] = ["惠州", "59298"];
                html[html.length] = ["东莞", "59289"];
                html[html.length] = ["清远", "59280"];
                html[html.length] = ["江门", "59473"];
                html[html.length] = ["茂名", "59659"];
                html[html.length] = ["云浮", "59471"];
                html[html.length] = ["阳江", "59663"];
                html[html.length] = ["汕头", "59316"];
                html[html.length] = ["深圳", "59493"];
                html[html.length] = ["珠海", "59488"];
                html[html.length] = ["湛江", "59658"];
                html[html.length] = ["佛山", "59279"];
                break;
            case "105":
                html[html.length] = ["南宁", "59432"];
                html[html.length] = ["百色", "59211"];
                html[html.length] = ["柳州", "59046"];
                html[html.length] = ["梧州", "59265"];
                html[html.length] = ["玉林", "59453"];
                html[html.length] = ["桂平", "59254"];
                html[html.length] = ["贺州", "59065"];
                html[html.length] = ["钦州", "59632"];
                html[html.length] = ["贵港", "59249"];
                html[html.length] = ["阳朔", "59051"];
                html[html.length] = ["桂林", "57957"];
                html[html.length] = ["北海", "59644"];
                html[html.length] = ["河池", "59023"];
                break;
            case "106":
                html[html.length] = ["石家庄", "53698"];
                html[html.length] = ["唐山", "54534"];
                html[html.length] = ["张家口", "54401"];
                html[html.length] = ["廊坊", "54515"];
                html[html.length] = ["邯郸", "53892"];
                html[html.length] = ["邢台", "53798"];
                html[html.length] = ["沧州", "54616"];
                html[html.length] = ["衡水", "54702"];
                html[html.length] = ["承德", "54423"];
                html[html.length] = ["秦皇岛", "54449"];
                html[html.length] = ["保定", "54602"];
                break;
            case "107":
                html[html.length] = ["郑州", "57083"];
                html[html.length] = ["开封", "57091"];
                html[html.length] = ["安阳", "53898"];
                html[html.length] = ["焦作", "53982"];
                html[html.length] = ["鹤壁", "53990"];
                html[html.length] = ["平顶山", "57171"];
                html[html.length] = ["商丘", "58005"];
                html[html.length] = ["濮阳", "54900"];
                html[html.length] = ["南阳", "57178"];
                html[html.length] = ["许昌", "57089"];
                html[html.length] = ["信阳", "57297"];
                html[html.length] = ["三门峡", "57051"];
                html[html.length] = ["驻马店", "57290"];
                html[html.length] = ["周口", "57195"];
                html[html.length] = ["新乡", "53986"];
                html[html.length] = ["洛阳", "57073"];
                html[html.length] = ["开封", "57091"];
                break;
            case "108":
                html[html.length] = ["武汉", "57494"];
                html[html.length] = ["黄冈", "57498"];
                html[html.length] = ["恩施", "57447"];
                html[html.length] = ["荆州", "57476"];
                html[html.length] = ["神农架", "57362"];
                html[html.length] = ["十堰", "57256"];
                html[html.length] = ["咸宁", "57590"];
                html[html.length] = ["襄樊", "57278"];
                html[html.length] = ["孝感", "57482"];
                html[html.length] = ["随州", "57381"];
                html[html.length] = ["黄石", "58407"];
                html[html.length] = ["荆门", "57377"];
                html[html.length] = ["鄂州", "57496"];
                html[html.length] = ["宜昌", "57461"];
                break;
            case "109":
                html[html.length] = ["长沙", "57687"];
                html[html.length] = ["邵阳", "57766"];
                html[html.length] = ["常德", "57662"];
                html[html.length] = ["郴州", "57972"];
                html[html.length] = ["吉首", "57649"];
                html[html.length] = ["株洲", "57780"];
                html[html.length] = ["娄底", "57763"];
                html[html.length] = ["湘潭", "57773"];
                html[html.length] = ["永州", "57866"];
                html[html.length] = ["岳阳", "57584"];
                html[html.length] = ["衡阳", "57872"];
                html[html.length] = ["怀化", "57749"];
                html[html.length] = ["韶山", "57771"];
                html[html.length] = ["张家界", "57558"];
                html[html.length] = ["衡山", "57777"];
                break;
            case "110":
                html[html.length] = ["福州", "58847"];
                html[html.length] = ["龙岩", "58927"];
                html[html.length] = ["南平", "58834"];
                html[html.length] = ["宁德", "58846"];
                html[html.length] = ["莆田", "58946"];
                html[html.length] = ["泉州", "59137"];
                html[html.length] = ["三明", "58828"];
                html[html.length] = ["漳州", "59126"];
                html[html.length] = ["厦门", "59134"];
                html[html.length] = ["武夷山市", "58730"];
                break;
            case "111":
                html[html.length] = ["济南", "54823"];
                html[html.length] = ["枣庄", "58024"];
                html[html.length] = ["聊城", "54806"];
                html[html.length] = ["曲阜", "54918"];
                html[html.length] = ["济宁", "54915"];
                html[html.length] = ["临沂", "54938"];
                html[html.length] = ["菏泽", "54906"];
                html[html.length] = ["泰安", "54827"];
                html[html.length] = ["日照", "54945"];
                html[html.length] = ["东营", "54736"];
                html[html.length] = ["青岛", "54857"];
                html[html.length] = ["威海", "54774"];
                html[html.length] = ["泰山", "54826"];
                html[html.length] = ["烟台", "54765"];
                html[html.length] = ["潍坊", "54843"];
                html[html.length] = ["淄博", "54830"];
                break;
            case "112":
                html[html.length] = ["合肥", "58321"];
                html[html.length] = ["巢湖", "58326"];
                html[html.length] = ["蚌埠", "58221"];
                html[html.length] = ["安庆", "58424"];
                html[html.length] = ["六安", "58311"];
                html[html.length] = ["滁州", "58236"];
                html[html.length] = ["马鞍山", "58336"];
                html[html.length] = ["阜阳", "58203"];
                html[html.length] = ["宣城", "58433"];
                html[html.length] = ["铜陵", "58429"];
                html[html.length] = ["淮北", "58116"];
                html[html.length] = ["芜湖", "58334"];
                html[html.length] = ["亳州", "58102"];
                html[html.length] = ["宿州", "58122"];
                html[html.length] = ["淮南", "58224"];
                html[html.length] = ["黄山站", "58437"];
                html[html.length] = ["九华山", "58423"];
                break;
            case "113":
                html[html.length] = ["杭州", "58457"];
                html[html.length] = ["湖州", "58450"];
                html[html.length] = ["金华", "58549"];
                html[html.length] = ["宁波", "58563"];
                html[html.length] = ["丽水", "58646"];
                html[html.length] = ["衢州", "58633"];
                html[html.length] = ["嘉兴", "58452"];
                html[html.length] = ["台州", "58660"];
                html[html.length] = ["舟山", "58477"];
                html[html.length] = ["鄞县", "58562"];
                html[html.length] = ["乐清", "58656"];
                html[html.length] = ["温州", "58659"];
                html[html.length] = ["舟山", "58477"];
                break;
            case "114":
                html[html.length] = ["成都", "56294"];
                html[html.length] = ["泸州", "57602"];
                html[html.length] = ["内江", "57504"];
                html[html.length] = ["凉山", "56571"];
                html[html.length] = ["阿坝", "56171"];
                html[html.length] = ["巴中", "57313"];
                html[html.length] = ["广元", "57206"];
                html[html.length] = ["乐山", "56386"];
                html[html.length] = ["绵阳", "56196"];
                html[html.length] = ["德阳", "56198"];
                html[html.length] = ["攀枝花", "56666"];
                html[html.length] = ["雅安", "56287"];
                html[html.length] = ["宜宾", "56492"];
                html[html.length] = ["自贡", "56396"];
                html[html.length] = ["甘孜州", "56146"];
                html[html.length] = ["达州", "57328"];
                html[html.length] = ["峨眉山", "56385"];
                break;
            case "115":
                html[html.length] = ["重庆", "57516"];
                break;
            case "116":
                html[html.length] = ["贵阳", "57816"];
                html[html.length] = ["安顺", "57806"];
                html[html.length] = ["赤水", "57609"];
                html[html.length] = ["遵义", "57713"];
                html[html.length] = ["铜仁", "57741"];
                html[html.length] = ["六盘水", "56693"];
                html[html.length] = ["毕节", "57707"];
                html[html.length] = ["凯里", "57825"];
                html[html.length] = ["都匀", "57827"];
                break;
            case "117":
                html[html.length] = ["通什", "59941"];
                html[html.length] = ["昆明", "56778"];
                html[html.length] = ["保山", "56748"];
                html[html.length] = ["楚雄", "56768"];
                html[html.length] = ["德宏", "56844"];
                html[html.length] = ["红河", "56975"];
                html[html.length] = ["临沧", "56951"];
                html[html.length] = ["怒江", "56533"];
                html[html.length] = ["曲靖", "56783"];
                html[html.length] = ["思茅", "56964"];
                html[html.length] = ["文山", "56994"];
                html[html.length] = ["玉溪", "56875"];
                html[html.length] = ["昭通", "56586"];
                html[html.length] = ["大理", "56751"];
                html[html.length] = ["丽江", "56651"];
                html[html.length] = ["德钦", "56444"];
                break;
            case "118":
                html[html.length] = ["昆山", "58356"];
                html[html.length] = ["南京", "58238"];
                html[html.length] = ["南通", "58259"];
                html[html.length] = ["太仓", "58377"];
                html[html.length] = ["苏州", "58357"];
                
                html[html.length] = ["徐州", "58027"];
                html[html.length] = ["宜兴", "58346"];
                html[html.length] = ["镇江", "58248"];
                html[html.length] = ["淮安", "58145"];
                html[html.length] = ["常熟", "58352"];
                html[html.length] = ["盐城", "58151"];
                html[html.length] = ["泰州", "58246"];
                html[html.length] = ["苏州", "58357"];
                html[html.length] = ["无锡", "58354"];
                html[html.length] = ["连云港", "58044"];
                html[html.length] = ["扬州", "58245"];
                html[html.length] = ["常州", "58343"];
                break;
            case "119":
                html[html.length] = ["太原", "53772"];
                html[html.length] = ["阳泉", "53782"];
                html[html.length] = ["晋城", "53976"];
                html[html.length] = ["晋中", "53778"];
                html[html.length] = ["临汾", "53868"];
                html[html.length] = ["运城", "53959"];
                html[html.length] = ["长治", "53882"];
                html[html.length] = ["朔州", "53578"];
                html[html.length] = ["忻州", "53674"];
                html[html.length] = ["大同", "53487"];
                html[html.length] = ["五台山", "53588"];
                break;
            case "120":
                html[html.length] = ["沈阳", "54342"];
                html[html.length] = ["葫芦岛", "54453"];
                html[html.length] = ["旅顺", "54660"];
                html[html.length] = ["本溪", "54346"];
                html[html.length] = ["朝阳", "54324"];
                html[html.length] = ["抚顺", "54353"];
                html[html.length] = ["铁岭", "54249"];
                html[html.length] = ["辽阳", "54347"];
                html[html.length] = ["营口", "54471"];
                html[html.length] = ["阜新", "54237"];
                html[html.length] = ["大连", "54662"];
                html[html.length] = ["丹东", "54497"];
                html[html.length] = ["鞍山", "54339"];
                html[html.length] = ["锦州", "54337"];
                break;
            case "121":
                html[html.length] = ["长春", "54161"];
                html[html.length] = ["延吉", "54292"];
                html[html.length] = ["吉林", "54172"];
                html[html.length] = ["白山", "54371"];
                html[html.length] = ["白城", "50936"];
                html[html.length] = ["四平", "54157"];
                html[html.length] = ["松原", "50946"];
                html[html.length] = ["辽源", "54260"];
                html[html.length] = ["长白", "54386"];
                html[html.length] = ["大安", "50945"];
                html[html.length] = ["通化", "54363"];
                break;
            case "122":
                html[html.length] = ["呼和浩特", "53463"];
                html[html.length] = ["包头", "53446"];
                html[html.length] = ["赤峰", "54218"];
                html[html.length] = ["海拉尔", "50527"];
                html[html.length] = ["锡林浩特", "54102"];
                html[html.length] = ["乌海", "53512"];
                html[html.length] = ["鄂尔多斯", "53543"];
                html[html.length] = ["牙克石", "50526"];
                html[html.length] = ["满洲里", "50514"];
                break;
            case "123":
                html[html.length] = ["哈尔滨", "50953"];
                html[html.length] = ["牡丹江", "54094"];
                html[html.length] = ["齐齐哈尔", "50745"];
                html[html.length] = ["大庆", "50842"];
                html[html.length] = ["伊春", "50774"];
                html[html.length] = ["双鸭山", "50884"];
                html[html.length] = ["鹤岗", "50775"];
                html[html.length] = ["鸡西", "50978"];
                html[html.length] = ["佳木斯", "50873"];
                html[html.length] = ["七台河", "50971"];
                html[html.length] = ["绥化", "50853"];
                html[html.length] = ["黑河", "50468"];
                html[html.length] = ["牡丹江", "54094"];
                html[html.length] = ["大兴安岭", "50442"];
                html[html.length] = ["黑河", "50468"];
                break;
            case "124":
                html[html.length] = ["拉萨", "55591"];
                html[html.length] = ["昌都", "56137"];
                html[html.length] = ["阿里", "55437"];
                html[html.length] = ["那曲", "55299"];
                html[html.length] = ["日喀则", "55578"];
                html[html.length] = ["山南", "55598"];
                html[html.length] = ["林芝", "56312"];
                break;
            case "125":
                html[html.length] = ["西安", "57036"];
                html[html.length] = ["韩城", "53955"];
                html[html.length] = ["汉中", "57127"];
                html[html.length] = ["宝鸡", "57016"];
                html[html.length] = ["咸阳", "57048"];
                html[html.length] = ["榆林", "53646"];
                html[html.length] = ["渭南", "57045"];
                html[html.length] = ["商州", "57143"];
                html[html.length] = ["铜川", "53947"];
                html[html.length] = ["华山", "57046"];
                html[html.length] = ["延安", "53845"];
                break;
            case "126":
                html[html.length] = ["兰州", "52889"];
                html[html.length] = ["白银", "52896"];
                html[html.length] = ["庆阳", "53829"];
                html[html.length] = ["酒泉", "52533"];
                html[html.length] = ["天水", "57006"];
                html[html.length] = ["武威", "52679"];
                html[html.length] = ["张掖", "52652"];
                html[html.length] = ["甘南", "50741"];
                html[html.length] = ["临夏", "52984"];
                html[html.length] = ["平凉", "53915"];
                html[html.length] = ["定西", "52995"];
                html[html.length] = ["金昌", "52675"];
                html[html.length] = ["敦煌", "52418"];
                break;
            case "127":
                html[html.length] = ["西宁", "52866"];
                html[html.length] = ["海北", "52754"];
                html[html.length] = ["海南", "52856"];
                html[html.length] = ["海西", "52737"];
                html[html.length] = ["黄南", "56065"];
                html[html.length] = ["海东", "52875"];
                html[html.length] = ["果洛", "56043"];
                html[html.length] = ["玉树", "56029"];
                break;
            case "128":
                html[html.length] = ["银川", "53614"];
                html[html.length] = ["固原", "53817"];
                html[html.length] = ["中卫", "53704"];
                html[html.length] = ["石嘴山", "53518"];
                html[html.length] = ["吴忠", "53612"];
                break;
            case "129":
                html[html.length] = ["乌鲁木齐", "51463"];
                html[html.length] = ["阿勒泰", "51076"];
                html[html.length] = ["阿克苏", "51628"];
                html[html.length] = ["昌吉", "51368"];
                html[html.length] = ["哈密", "52203"];
                html[html.length] = ["和田", "51828"];
                html[html.length] = ["喀什", "51709"];
                html[html.length] = ["克拉玛依", "51243"];
                html[html.length] = ["石河子", "51356"];
                html[html.length] = ["塔城", "51133"];
                html[html.length] = ["库尔勒", "51656"];
                html[html.length] = ["伊宁", "51431"];
                html[html.length] = ["吐鲁番", "51573"];
                break;
            case "130":
                html[html.length] = ["南昌", "58606"];
                html[html.length] = ["井冈山", "57894"];
                html[html.length] = ["萍乡", "57786"];
                html[html.length] = ["九江", "58502"];
                html[html.length] = ["上饶", "58637"];
                html[html.length] = ["抚州", "58617"];
                html[html.length] = ["吉安", "57799"];
                html[html.length] = ["鹰潭", "58627"];
                html[html.length] = ["宜春", "57793"];
                html[html.length] = ["庐山", "58506"];
                html[html.length] = ["赣州", "57993"];
                html[html.length] = ["都昌", "58517"];
                html[html.length] = ["新余", "57796"];
                html[html.length] = ["景德镇", "58527"];
                break;
            case "131":
                html[html.length] = ["海口", "59758"];
                html[html.length] = ["儋州", "59845"];
                html[html.length] = ["琼山", "59757"];
                html[html.length] = ["通什", "59941"];
                html[html.length] = ["文昌", "59856"];
                html[html.length] = ["三亚", "59948"];
                html[html.length] = ["西沙", "59981"];
                html[html.length] = ["南沙岛", "59997"];
                break;
            case "132":
                html[html.length] = ["台北", "58968"];
                html[html.length] = ["高雄", "59554"];
                break;
            case "133":
                html[html.length] = ["香港", "45005"];
                break;
            case "134":
                html[html.length] = ["澳门", "45011"];
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



