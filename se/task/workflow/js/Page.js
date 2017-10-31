//依赖jQuery
/**
 *
 * @param config
 *      node:要插入到的节点
 *      count:10,//页面总数
 *      index:0,//初始默认页面号
 *      onChange:function(index){
 *      }
 * @constructor
 */

var Page=function(config){
    //this.index=config.index||0
    this.config=config
    //修复当数据为空的bug
    if(config.count<1){
        config.count=1
    }

    var html='<div  class="pager"><div class="pagediv"><span class="pageNum pageNum-on"><var>'+(config.index+1)+'/'+config.count+'</var><i class="ptg"></i></span><a class="page_forword" href="javascript:void(0);" 上一页</a><a class="page_next" href="javascript:void(0);" >下一页</a><ul class="pageitem" style="display: none;">'
    for(var i=0;i<config.count;i++){
        html+='<li><a href="javascript:void(0);" index="'+i+'">'+(i+1)+' / '+config.count+'</a></li></li>'
    }
    html+='</ul></div></div>'

    jQuery(config.node).html(html)
    this.element=jQuery(config.node).find('.pager')[0]
    //初始化事件
    var self=this
    jQuery(self.element).find('.pageNum,.pageitem').on('mouseover',function(){
        jQuery(self.element).find('.pageitem').show()
    })
    jQuery(self.element).find('.pageNum,.pageitem').on('mouseout',function(){
        jQuery(self.element).find('.pageitem').hide()
    })
    //跳页
    jQuery(self.element).find('.pageitem a').on('click',function(){
        self.turn(parseInt(jQuery(this).attr('index')),self.config.onChange)
        jQuery(self.element).find('.pageitem').hide()
    })
    //上一页
    jQuery(this.element).find('.page_forword').on('click',function(){
        if(jQuery(this).hasClass('disable')){
            return
        }else{
            self.turn(self.index-1,self.config.onChange)
        }
    })
    //下一页
    jQuery(this.element).find('.page_next').on('click',function(){
        if(jQuery(this).hasClass('disable')){
            return
        }else{
            self.turn(self.index+1,self.config.onChange)
        }
    })
    self.turn(this.config.index)
    if(self.count==1){
        jQuery(self).hide()
    }
}
//翻页
Page.prototype.turn=function(index,callback){
    if(index==this.index||index<0||index>=this.config.count){
        return
    }else{
        jQuery(this.element).find('var').text(index+1+'/'+this.config.count)
        if(index==0){
            jQuery(this.element).find('.page_forword').addClass('disable')
        }else{
            jQuery(this.element).find('.page_forword').removeClass('disable')
        }
        if(index==this.config.count-1){
            jQuery(this.element).find('.page_next').addClass('disable')
        }else{
            jQuery(this.element).find('.page_next').removeClass('disable')
        }
        this.index=index
        if(callback){
            callback(this.index)
        }
    }
}


