/**
 * 全局事件类
 * @type {{}}
 */

var documentEventManager = {
    evts: {},
    docs: [],
    eventList: [],
    addEvent: function(type, func){
        var f = this.get(func);
        var k = type.toString() + '_' + func.toString();
        if(f){
            for(var i= 0,l=this.eventList.length;i<l;i++){
                if(this.eventList[i][0] === k){
                    return;
                }
            }
            this.eventList.push([k, type, func]);
        }
    },
    delEvent: function(type, func){
        var f = this.get(func);
        var k = type.toString() + '_' + func.toString();
        if(f){
            for(var i= 0,l=this.eventList.length;i<l;i++){
                if(this.eventList[i][0] === k){
                    this.eventList.splice(i,1);
                }
            }
        }
    },
    register: function(k,f){
        this.evts[k] = f;
    },
    unregister: function(k){
        delete this.evts[k];
    },
    get: function(k){
        return this.evts[k] || false;
    },
    isDocument: function(doc){
        if(typeof Document != 'undefined'){
            return doc instanceof Document;
        }
        else{
            if(typeof doc == 'object' && doc.body){
                return true;
            }
            else{
                return false;
            }
        }
    },
    isVisibilityDocument: function(doc){
        if(doc){
            try{
                if(doc.visibilityState){
                    return  doc.visibilityState == 'hidden' ? false : true;
                }
                if(doc.webkitVisibilityState){
                    return doc.webkitVisibilityState == 'visible';
                }
                if(doc.mozHidden != undefined){
                    return !doc.mozHidden;
                }
                if(doc.hidden != undefined){
                    return !doc.hidden;
                }
                if(doc.body.isDisabled != undefined){
                    return !doc.body.isDisabled;
                }
            }
            catch(e){
                //console && console.log(e);
            }
        }
        return false;
    },
    filterDoc: function(){
        if(this.docs.length){
            for(var i=0;i<this.docs.length;i++){
                if(!this.isVisibilityDocument(this.docs[i])){
                    this.docs.splice(i,1);
                }
            }
        }
    },
    addDoc: function(doc){
        //if(this.isDocument(doc)){ 
            var isExit = false;
            for(var i = 0,l = this.docs.length; i<l; i++){
                if(this.docs[i] == doc){
                    isExit = true;
                }
            }
            if(!isExit){
                this.docs.push(doc);
            }

            this.bind();
        //}
    },
    bind: function(){
        var k, t, f;
        if(this.docs.length && this.eventList.length){
            this.unbind();
            this.filterDoc();
            for(var i= 0,l=this.docs.length;i<l;i++){
                for(var j= 0,m=this.eventList.length;j<m;j++){
                    t = this.eventList[j][1];
                    k = this.eventList[j][2];
                    f = this.get(k);
                    if(t && k && f){
                        try{
                            EV.observe(this.docs[i], t, f, false);
                        }
                        catch(e){
                            //console && console.log(e);
                        }
                    }
                }
            }
        }
    },
    unbind: function(doc){
        var p = this;
        if(doc){
            unbind(doc);
        }
        else{
            for(var i= 0,l=this.docs.length;i<l;i++){
                unbind(this.docs[i]);
            }
        }

        function unbind(doc){
            var k, t, f;
            for(var i= 0,l= p.eventList.length;i<l;i++){
                t = p.eventList[i][1];
                k = p.eventList[i][2];
                f = p.get(k);
                if(t && k && f){
                    try{
                        EV.stopObserving(doc,t,f,false);
                    }
                    catch(e){
                        //console && console.log(e);
                    }
                }
            }
        }
    }
};