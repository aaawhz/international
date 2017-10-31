/**
 * 滚动标题
 * @param t {string}  标题
 * @constructor
 * eg:
 * var mt = new MarqueeTitle('this is a title');
 * mt.run();
 *
 * or
 *
 * var mt = new MarqueeTitle();
 * mt.setTitleText('this is a title');
 * mt.run();
 */

;
function MarqueeTitle(t){
    this.title = t || '';
    this.speed = 1000;
    this.init.apply(this, arguments);
};

MarqueeTitle.prototype = {
    init: function(){
        if(!document.all){
            if(document && document.getElementsByTagName('title').length){
                this.container = document.getElementsByTagName('title')[0];
            }
            else{
                var head = document.getElementsByTagName('head')[0];
                this.container = document.createElement('title');
                head.appendChild(this.container);
            }
        }
        this.originalTitle = this.getTitle();
    },
    setTitleText: function(t){
        if(t){
            this.title = t;
        }
    },
    setTitle: function(t){
        if(document.all){
            document.title = t;
        }
        else{
            if(this.container){
                this.container.innerHTML = t;
            }
        }
    },
    getTitle: function(){
        if(document.all){
            return document.title;
        }
        else{
            var title;
            if(document && document.getElementsByTagName('title').length){
                title = document.getElementsByTagName('title')[0];
            }
            else{
                var head = document.getElementsByTagName('head')[0];
                title = document.createElement('title');
                title.innerHTML = '';
                head.appendChild(title);
            }
            return title.innerHTML;
        }
    },
    repeat: function(n){
        var tmp = '';
        if(this.title && this.title.length){
            if(n && n-0 > 0){
                for(var i=0;i<n-0;i++){
                    tmp += this.title;
                }
            }
        }
        return tmp;
    },
    run: function(){
        var p = this;
        var title = this.repeat(2);
        var len = this.title.length;
        var count = 0;
        if(this.running){
            return;
        }
        this.running = true;
        var runTitle = function(){
            p.setTitle(title);
            title = title.substr(1);
            count++;
            if(count >= len){
                title = p.repeat(2);
                count = 0;
            }
        };
        this.interval = setInterval(runTitle, this.speed);
    },
    stop: function(){
        clearInterval(this.interval);
        this.running = false;
        this.setTitle(this.originalTitle);
    }
};