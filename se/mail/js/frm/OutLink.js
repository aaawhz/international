// this.name,this.h;this.div;
function OutLink(){
}
OutLink.prototype = {
    initialize: function(){
        var name = "outLink";
        var i, t;
        for (i in this) {
            t = this[i];
            if (typeof(t) == "function") {
                MM[name][i] = t;
            }
        }
        MM["outLink"].h = 800;
    },
    getHtml: function(){
        return GMC.getHtml(this.name, this.url);
    }, 
    init: function(){
        GMC.setUrl(this.name, this.url);
    },
    resize: function(){
        this.setDivHeight();
    },
    setDivHeight: function(){
        try {
            GMC.setDivHeight(this.name);
        } catch (e1) {
        }
    },
    exist: function(af){
        return GE.tab.exist(af);
    },
    exit: function(o) {
        var id = CC.getCurLabId();
        var p1 = this;
        var win ;
        //读信页面是没有iframe的
        try{
            win=jQuery('#ifrm_' + id)[0].contentWindow;
        } catch(error){

        }
        if (win&&win.Meeting) {
                if (win.Meeting.isChanged()) {
                    parent.CC.confirm(top.Lang.Mail.Write.xzlkybjdhycTgRgyRpjhdssfqrgb, function () {//现在离开已编辑的会议邀请内容将会丢失,是否确认关闭?
                        GE.tab.del(id)
                    });
                    return false;
                }else{
                    GMC.gcMem(this.name);
                    return true;
                }

        }else{
            return true;
        }



    }
};
