    //**************************************************AJAX请求**********************************************
	function AjaxObject()
    {
        var req = null ;
        var _onInceptMetbod = null;
        var _url = null;
        var _params = null;
        var _HttpMetbod = null;
        //请求对象发生改变时
        this.onReadyStateChange = function()
        {
            var ready = this.req.readyState;        
            var data = "";
            if( ready == 4)
            {
                data = this.req.responseText;
                this._onInceptMetbod( ready,data);
            }
            else
            {
                data = "Loading ... [" + ready + "]<br>";
            }
            //this._onInceptMetbod( ready,data);
        };
        //发送一个请求
        this.sendRequest = function (url , params , HttpMetbod,onInceptMetbod)
        {
            this._onInceptMetbod = onInceptMetbod ;
            this._url = url;
            this._params = params;
            this._HttpMetbod = HttpMetbod;
            
            if( ! HttpMetbod )
            {
                HttpMetbod = "POST";
            }
             
            this.req = this.getXMLHTTPRequest();
            if( this.req )
            {   
                try
                {
                    var loader = this;
                    this.req.onreadystatechange = function()
                    {
                        loader.onReadyStateChange.call(loader);
                    };
                    this.req.open( HttpMetbod ,url ,true);
                    this.req.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
                    this.req.send(params);
                }
                catch(err)
                {
                     alert( "Error Fetcahing Data !"
                        + "\nreadyState:" + this.req.readyState
                        + "\nstatus:" + this.req.status
                        + "\nheaders:" + this.req.getAllResponseHeaders());
                }
            }
        };
        //重新请求
        this.reSendRqeust = function ()
        {
            this.sendRequest(this._url , this._params , this._HttpMetbod,this._onInceptMetbod);
        };
        
        //建立请求对象
        this.getXMLHTTPRequest = function ()
        {
            var xRequest = null ;
            if( window.XMLHttpRequest)
            {
                xRequest = new XMLHttpRequest();
            }
            else if( typeof ActiveXObject != 'undefined' )
            {
                xRequest = new ActiveXObject("Microsoft.XMLHTTP");
            }
            return xRequest;
        };
    }   
    

//****************************************************上传数据结构体*****************************************************
function NewUpload(id,fname,fsize,dirid,dirname,state)
{
    return {
    id:id,
    filename:fname,
    filesize:fsize,
    dirid:dirid,
    dirname:dirname,
    state:state,
    progress:0,
    uploadsize:0,
    time:0,
    errinfo:""
    };
}

function NewUploadHtml(idx)
{
    //txt_ico=文件上传的图标
    //txt_name=文件名称
    //txt_size=文件大小
    //txt_state=上传状态
    //txt_bar=控制进度条是否可见
    //txt_barval=上传的%比
    //txt_barwidth=进度条显示的宽度(%比*2)
    //txt_action=可操作动作(暂停,继续,删除)
    //txt_upinfo=上传信息控制
    //txt_celer=上传速度
    //txt_time=剩余时间
    
    //以上名称后都需要加上 index
	
    var str = "";
    str+="<i id='txt_ico" + idx + "'></i>";
    str+="<strong id='txt_name" + idx + "'></strong><span id='txt_size" + idx + "'>(14k)</span><em class='r' id='txt_state" + idx + "'>"+fastLang.fast_upload_uploading+"</em>";
	str+=	"<div class='upLoad'>";
	str+=		"<div id='txt_bar" + idx + "' class='bar'><em id='txt_barval" + idx + "'>20%</em><i id='txt_barwidth" + idx + "' style='width:0px;'></i></div><a id='txt_action" + idx + "' onclick='uploadDiv.Action(this,"+idx+")' class='r'>"+fastLang.fast_cancal+"</a>";
	str+=		"<p id='txt_upinfo" + idx + "'>"+fastLang.fast_upload_speed+"<span id='txt_celer" + idx + "'>150</span>kb/s&nbsp;&nbsp;&nbsp;"+fastLang.fast_upload_with_time+"<span id='txt_time" + idx + "'>90</span></p>";
    str+=	"</div>";
    //str = str.replace(/" + idx + "/gi,idx);
    return str;
    
}

//****************************************************上传对象************************************************************
var uploadActivex = new Object();
uploadActivex.upload = null;

//检查是否安装了控件，并初始化
uploadActivex.check = function()
{
    if(!document.all)return null;
	this.upload = document.all("cxdndctrl");
	if(this.upload==null)
	{
		return false;
	}
	else
	{
	    try
	    {
    	    var obj = new ActiveXObject("RIMailToolAutoUpdateCtrl.AutoUpdate.1");
			if(obj== null)return false;
			var version = obj.GetActiveXVersion("Cxdndctrl.Upload.1");
			return true; 
	    } catch(err) {
	        return false;
	    }
	}
};

//取得控件当前版本号
uploadActivex.getversion=function(){return this.upload.getversion();};

//选择文件部分接口  返回是否选择了文件。也就是说，返回非0表示点了确定，0表示取消
uploadActivex.getopenfilename=function(filter,title){return this.upload.getopenfilename(filter,title);};

//取得选择文件的个数
uploadActivex.getfilecount=function(){return this.upload.getfilecount();};

//取得上传文件名称 文件在文件列表中的下标，取值范围应满足[0, getfilecount()-1].
uploadActivex.getfilename=function(index){return this.upload.getfilename(index);};

//取得上传文件的大小(字节)  
uploadActivex.getfilesize=function(index){return this.upload.getfilesize(index);};

//开始上传文件
uploadActivex.uploadFile=function(id ,from,key,seradr,cmdport,dataport,filename,filesize,taskno)
{    
   //HRESULT upload(long id, long comefrom, BSTR key, BSTR serveraddress, long commandport, long dataport, long proxytype, BSTR proxyaddress, long proxyport, BSTR proxyusername, BSTR proxypassword, BSTR filename, unsigned long filesize, BSTR ssoid, BSTR userlevel, BSTR usernumber, BSTR flowtype, BSTR taskno, long resumetransmit, long* ret);
    return this.upload.upload( parseInt( id), parseInt(from), key,seradr, parseInt( cmdport),parseInt( dataport), 0, "",0,"","", filename, parseInt( filesize), "","1","","0",taskno,true);    
};

//开始上传文件
uploadActivex.uploadexFile=function(params)
{    
    return this.upload.uploadex(params);    
};

//停址上传文件
uploadActivex.uploadStop=function(id){return this.upload.stop(id);};

uploadActivex.uploadErrorReason = function(id){return this.upload.getstopreason(id);};

//*****************************************************上传对象管理**********************************************************
var uploadDiv = new Object();
uploadDiv.files = new Array();
uploadDiv.httpPath="";
uploadDiv.sid="";
uploadDiv.from="";
uploadDiv.upCount=0;
//UI名称
uploadDiv.divName="txt";
//上传索引器
uploadDiv.upIndex = 0;
//已完成文件个数
uploadDiv.upFinish = 0;

uploadDiv.stopFlag = false;
//新增上传
uploadDiv.AddUpload=function(dirid,dirname)
{
    //parent.Ajax.get(url,successcallback1,failcallback,option);
    var rlt = uploadActivex.getopenfilename("*.*",fastLang.fast_upload_select_file);//"请选择需要上传的文件(支持多选)"
    if(rlt==1)
    {
        var count = uploadActivex.getfilecount();
        var maxFileCount = $("#maxFileCount").val();
        var maxFileTotalSize = $("#maxFileTotalSize").val();
        var maxFileNameLength = $("#maxFileNameLength").val();
        if(count > maxFileCount){
        	alert(fastLang.fast_upload_count +  maxFileCount + fastLang.fast_upload_files );
        	return;
        }
        var totalSize = 0;
        for(var i = 0;i<count;i++)
        {
            var fsize = uploadActivex.getfilesize(i);
            totalSize += fsize;
            
        }
        
        if(totalSize > maxFileTotalSize){
        	alert(fastLang.fast_upload_total_size + " " + parent.Util.formatSize(maxFileTotalSize, null, 2));
        	return;
        }
        
		var reg = /[\\\/:*?|"<>]/g;
        var maxSize = $("#maxFileSize").val();
		for(var i = 0;i<count;i++)
        {
            //取得文件信息
            var fname = uploadActivex.getfilename(i);
            var fsize = uploadActivex.getfilesize(i);
			var fileName = fname.substring(fname.lastIndexOf("\\")+1);
            var minFn = fileName;

			if(fsize == 0){
				alert(fastLang.upload_file_size_zero.replace("|0|",minFn));
			    continue;	
			}
            
            if(fileName.length > 30){
            	minFn = fileName.substring(0,10)+ "..." + fileName.substring(fileName.length-10);
            }
			if (fileName.replace(/[^\x00-\xff]/g, "**").length > maxFileNameLength){
				alert('"' +minFn + '"' + fastLang.max_file_name_length +" "+ maxFileNameLength + fastLang.file_not_upload );
				continue;
			}
						
			if(fsize>maxSize){
			  alert(fastLang.fast_file + ' "' +minFn + '" ' + fastLang.fast_more_than + " " + parent.Util.formatSize(maxSize, null, 2));
			  continue;	
			}
			
			if (reg.test(fileName)) {
                parent.CC.alert('"' +minFn + '" ' + fastLang.garbage_file_name);
                continue;
            }
			
            //向UI增加显示
            this.upIndex++;
            this.upCount++;
            
            //处理界面显示
            $("#uprule").css("display","none");
            $("#selinfo").css("display","");
            $("#divlist").css("display","");
            $("#selinfocount").text(this.upCount);                      
            this.AddUI(this.upIndex,fname,fsize,dirid,dirname);
        }
        //检查上传
        //uploadDiv.CheckUpload();
    }
};

//增加一个文件的选择
uploadDiv.AddUI=function(id,fname,fsize,dirid,dirname)
{
    var ao = NewUpload(id,fname,fsize,dirid,dirname,-1);//所有选择文件初始化都在排队中
    this.files.push(ao);
    //Add UI
    var oContainer = document.createElement("li");
    oContainer.id=this.divName+id;
    var str = NewUploadHtml(id);
    oContainer.innerHTML= str;
    document.getElementById("ullist").appendChild(oContainer);
    this.showUI(id);
};

//更新UI显示
uploadDiv.showUI=function(id)
{

    var file = this.getUpload(id);
    if(file==null)return ;
   
    //显示图标
    
    //txt_ico=文件上传的图标
    //txt_name=文件名称
    //txt_size=文件大小
    //txt_state=上传状态
    //txt_bar=控制进度条是否可见
    //txt_barval=上传的%比
    //txt_barwidth=进度条显示的宽度(%比*2)
    //txt_action=可操作动作(暂停,继续,删除)
    //txt_upinfo=上传信息控制
    //txt_celer=上传速度
    //txt_time=剩余时间
    
    //以上名称后都需要加上 index
    //上传的状态信息-1=正在等待上传中 0=文件验证 1=正在上传 2=stop 3=0表示上传成功，4=1表示人为停止，5=2表示意外停止，比如网络断了，6=3表示发现病毒（只有上传完成后，才会发现病毒）
	
    //上传状态
    var obj = $("#" + this.divName+"_state"+id);
    switch(file.state)
    {
        case -1:obj.html(fastLang.fast_upload_wait); break;//"等待上传"
        case 0:obj.html(fastLang.fast_upload_verify); break;//"验证中"
        case 1:obj.html(fastLang.fast_upload_uploading); break;//"上传中";
        case 2:obj.html(fastLang.fast_upload_pause); break;//"暂停中"
        case 3:obj.html(fastLang.fast_upload_finish); break;//"完成";
        case 4:obj.html(fastLang.fast_upload_fail); break;//"失败";
        case 5:obj.html(fastLang.fast_upload_fail); break;//"失败";
        default:obj.html(fastLang.fast_upload_fail); break;   //"失败";
    }
    
      
    //文件名称
    var filename = file.filename.split('\\');
    filename = filename[filename.length-1];
    
    if( filename.length>15)
    {
        var exp = filename.split('.')[filename.split('.').length-1];
        if(exp.length==filename.length)exp="";
        filename=filename.substring(0,12)+"..."+exp;
    }
    
    $("#" + this.divName+"_name"+id).html(filename);
    //文件大小
    var sizecall  = "KB";
    var size = file.filesize / 1024;
    if( size > 1024)
    {
        sizecall="MB";
        size = size/1024;
        if(size>1024)
        {
            sizecall="GB";
            size=size/1024;
        }
    }
    $("#"+this.divName+"_size"+id).html(" ("+size.toFixed(2) +sizecall+") ");
    
    
    //进度条是否可见
    if(file.state>=-1 && file.state<=3)
    {
        $("#" + this.divName+"_bar"+id).css("display","");
        //计算速度
        if(file.state==0)
        {
            //txt_barval=上传的%比
            //txt_barwidth=进度条显示的宽度(%比*2)
            //txt_celer=上传速度
            //txt_time=剩余时间
            $("#" + this.divName+"_barval"+id).html("0%");
            $("#" + this.divName+"_barwidth"+id).css("width","0px");
            $("#" + this.divName+"_celer"+id).html("0");
            $("#" + this.divName+"_time"+id).html("");//未计算
            
            $("#" + this.divName+"_action"+id).text(fastLang.fast_upload_delete);//"删除";	
           
        }
        else 
        {
            //window.status = file.uploadsize +"    "+  file.time;
            var caer = file.uploadsize/file.time/1024;//返回KB/S
            //window.status = caer + "   " + caer.toFixed(2);
            if(!isNaN(caer) )caer = caer.toFixed(2);
            if(caer==Infinity)caer=0;
            var time = (file.filesize-file.progress)/1024/caer;//返回还差多少时间(小时)
            if( isNaN( time))time=0;
            if(time=="Infinity")time = 0;
            var t1,t2,t3;
           
            t1=parseInt(time/60/60);   
            t2=parseInt((time-t1*60*60)/60);   
            t3=parseInt(time-t1*60*60-t2*60);   
            time = t1+":"+t2+":"+t3;
            
            var pro =parseInt( file.progress/file.filesize*100);
            if( isNaN(pro))pro=0;
            pro = pro.toFixed(2);
            
            //window.status = pro;
            var obj;
            obj = $("#" + this.divName+"_barval"+id);
            if( obj!=null)
            {
                if(file.state==3)
                {
                    obj.html("100%");
                }
                else
                {
                    obj.html(pro+"%");
                }
            }
            obj = $("#" + this.divName+"_barwidth"+id);
            if( obj!=null)
            {
                if(file.state==3)
                {
                    obj.css("width","200px");
                }
                else
                {
                	obj.css("width",(pro*2) + "px");
                }
            }
            obj = $("#" + this.divName+"_celer"+id);
            if( obj!=null) obj.html(isNaN(caer)?"0":caer);
            
            obj = $("#" + this.divName+"_time"+id);
            if( obj!=null) obj.html(time);			
            if(file.state==1){
            	$("#" + this.divName+"_action"+id).text(fastLang.fast_upload_pause);// "暂停";
            } else if(file.state == -1) {
                $("#" + this.divName+"_action"+id).text(fastLang.fast_upload_delete);// "删除";
            } else if(file.state==3 ){
            	$("#" + this.divName+"_action"+id).text("");//什么操作都没有
            } else {
            	$("#" + this.divName+"_action"+id).text(fastLang.fast_upload_continue);//"继续";
            }
        }
       
    }
    else
    {
    	$("#" +this.divName+"_bar"+id).css("display","none");
        //txt_upinfo=上传信息控制
        $("#" + this.divName+"_upinfo"+id).html(file.errinfo);
        //txt_action=可操作动作(暂停,继续,删除)
        $("#" + this.divName+"_action"+id).text(fastLang.fast_upload_delete);//"删除";
    }
    if(file.state==3 )
    {
    	$("#" + this.divName+"_action"+id).text("");//什么操作都没有
    }
};
//查询已存在的上传对象
uploadDiv.getUpload=function(id)
{
    for(var i =0;i<this.files.length;i++)
    {
        if( this.files[i].id==id)
        {
            return this.files[i];
        }
    }
    return null;
};

//开始上传
uploadDiv.StartUpload=function(id,seradr,params)
{
    //alert(seradr +"^"+cmdport+"^"+dataport);
    if(uploadDiv.stopFlag) return;//如果已经关闭上传，则返回
    var val = 0;
    if(seradr=="")
    {
        val = -1;
    }
    else
    {
        val = uploadActivex.uploadexFile(params);
    }
 
    if(val==0)
    {
        //表示，任务没有接收
        var file = this.getUpload(id);
        if(file==null)return ;
        file.state=5;
        file.errinfo=fastLang.fast_upload_not_accept;// "目标文件不接受上传或已在上传中";
        this.showUI(id);
    }
    else if(val== -1)
    {
        var file = this.getUpload(id);
        if(file==null)return ;
        file.state=5;
        file.errinfo=fastLang.fast_upload_network_fail;//"网络不通，上传失败";
        this.showUI(id);
    }
    
};
//上传对象信息发生改变时
uploadDiv.ProChanged=function(id,progress,uploadsize,time)
{
    var file = this.getUpload(id);
    if(file==null)return ;
    file.progress = progress;
    file.uploadsize = uploadsize;
    file.time = time;
    file.state=1;//表示文件正在上传中
    this.showUI(id);
};
//结束上传
//

uploadDiv.StopUpload=function(id,result,fileid)
{
    //alert(id+"^"+result+"^"+fileid);
	if(uploadDiv.stopFlag) return;//如果已经关闭上传，则返回
    var file = this.getUpload(id);
    if(file==null)return ;
    file.state = result+3;//-1=正在等待上传中 0=文件验证 1=正在上传 2=stop 3=0表示上传成功，4=1表示人为停止，5=2表示意外停止，比如网络断了，6=3表示发现病毒（只有上传完成后，才会发现病毒）

    if(file.state==4)
    {
        file.state=2;
        file.errinfo=fastLang.fast_upload_user_stop;// "用户停止上传";
    }
    else if(file.state==5)
    {
        file.errinfo=fastLang.fast_upload_failed;//"上传失败";
    }
    else if(file.state==6)
    {
        //当前处理为正常
        file.state=3;
    }
    
    this.showUI(id);
    if(file.state == 3 )
    {
    	try {
            document.getElementById(this.divName+"_ico"+id).className="load"; 
            var index = id;
            var url =  "../disk/celerityupload.do?sid="+parent.gMain.sid+"&diskType="+diskList.getQueryString("diskType")+"&doUpload=2&folderid="+file.dirid+"&filesize="+ file.filesize +"&fileid="+fileid+"&from="+this.from+"&filename="+ encodeURIComponent(encodeURIComponent(file.filename)) + "&index=" + index;
            new AjaxObject().sendRequest(url,null,null,uploadDiv.UploadOK);
		} catch (e) {
			
		}

        //parent.Ajax.get(url,function(text){ uploadDiv.UploadOK(text);},function(o){uploadDiv.UploadFail(index);});
    }
    
    
};

//上传结束验证
uploadDiv.UploadOK=function(ready,text)
{
	   try{
		    if(uploadDiv.stopFlag) return;//如果已经关闭上传，则返回
			var argsJson = eval("(" + text + ")");
		    if(argsJson.code != "S_OK")
		    {
		        var file = uploadDiv.getUpload(argsJson.fileId);
		        if(file==null)return ;
		        file.state = 5;
		        file.errinfo = argsJson.summary;
		        uploadDiv.showUI(file.id);
		       
		    }
		    /*显示已完成上传数量*/
		    uploadDiv.upFinish++;
		    $("#finishcount").text(uploadDiv.upFinish);
			parent.GMC.getFrameWin('outLink_diskMine').diskList.getFolderList();
		}catch (e) {
			
		}
    //alert(text);
};
//入库时失败
uploadDiv.UploadFail=function(index)
{

};
//暂停,继续,删除 操作方法
uploadDiv.Action=function(o,index)
{
    if( o == null ) return ;
    var file = this.getUpload(index);
    if(file==null)return ;

    if( o.innerText == fastLang.fast_upload_pause)//"暂停"
    {
        uploadActivex.uploadStop(index);
        file.state = 2;
        this.showUI(index);
    }  else if( o.innerText==fastLang.fast_upload_continue ) {//"继续"
        file.state= -1;
        this.showUI(index);   
    } else { //删除
        file.state = 4;//人为删除;
        uploadActivex.uploadStop(index);
        //删除UI
        document.getElementById("ullist").removeChild( document.getElementById( this.divName+index ) );
        this.upCount--;
        //处理界面显示
        $("#selinfocount").text(this.upCount);
    }
    
};

//定时检查上控情况
uploadDiv.CheckUpload=function()
{   
	if(uploadDiv.stopFlag) return;//如果已经关闭上传，则返回
    var upindex1= -1,upindex2 = -1,upindex3 = -1;
    var upcount = 0;
    for(var i =0;i<this.files.length;i++)
    {
        if( this.files[i].state == -1 )
        {
            if( upindex1== -1 )
            {
                upindex1= this.files[i].id;
            }
            else if( upindex2== -1 )
            {
                upindex2= this.files[i].id;
            }
            else if(upindex3== -1)
            {
                upindex3= this.files[i].id;
            }
        }
        if( this.files[i].state==1 )
        {
            upcount++;
        }
    }
    if( upcount >= 3 )
    {
        //window.status="没有找到可上传的文件！";
        return;//同时支持三个上传
    }
    
    //alert( upcount+"^"+upindex1+"^"+upindex2+"^"+upindex3);
    
    if( upcount<2 && upindex1 != -1 )
    {
        
        //启动上传
        var file1 =  this.getUpload(upindex1);
        var url1="../disk/celerityupload.do?sid="+parent.gMain.sid+"&diskType="+diskList.getQueryString("diskType")+"&filesize="+file1.filesize+"&doUpload=1&index="+file1.id;
        //parent.Ajax.get(url1 ,function(text){ uploadDiv.CheckOK(text);},function(o){uploadDiv.CheckFail(file1.id);});
        file1.state = 1;
        new AjaxObject().sendRequest(url1,null,null,uploadDiv.CheckOK);
    }
    if( upcount<3 && upindex2 != -1)
    {
        //启动上传
        
        var file1 =  this.getUpload(upindex2);
        var url1="../disk/celerityupload.do?sid="+parent.gMain.sid+"&diskType="+diskList.getQueryString("diskType")+"&filesize="+file1.filesize+"&doUpload=1&index="+file1.id;
        //parent.Ajax.get(url1 ,function(text){ uploadDiv.CheckOK(text);},function(o){uploadDiv.CheckFail(file1.id);});
        file1.state = 1;
        new AjaxObject().sendRequest(url1,null,null,uploadDiv.CheckOK);

    }
    if( upcount<4 && upindex3 != -1 )
    {
        //启动上传
        var file1 =  this.getUpload(upindex3);
        var url1="../disk/celerityupload.do?sid="+parent.gMain.sid+"&comeFrom="+diskList.getQueryString("diskType")+"&filesize="+file1.filesize+"&doUpload=1&index="+file1.id;
        //parent.Ajax.get(url1 ,function(text){ uploadDiv.CheckOK(text);},function(o){uploadDiv.CheckFail(file1.id);});
        file1.state = 1;
        new AjaxObject().sendRequest(url1,null,null,uploadDiv.CheckOK);
    }
    //window.status=upcount+"^"+upindex1+"^"+upindex2+"^"+upindex3
};
//上传验证OK
uploadDiv.CheckOK=function(ready,text)
{
    
    //分解返的信息
    //0=状态^1=信息^2=IP^3=Port^4=DataPort,5=fileindex,6=key,7=comfrom,8=taskno,9=uploadPort,
	//10=fastUploadCmdUrl,11 = fastUploadDataUrl
	if(uploadDiv.stopFlag) return;//如果已经关闭上传，则返回
    var args = text.split('^');
    var fileid = 0;
    if(args.length>=5)
    {
        fileid= parseInt( args[5]);
    }
    else
    {
        fileid=parseInt(args[2]);
    }
    
    var file = uploadDiv.getUpload( fileid );
    if(file==null)return ;
    if(args[0]!="1")
    {
        file.state=5;//表示服务器不接受
        file.errinfo=args[1];
    }
    else
    {
        
    	
    	
    	file.state=1;//表示正在上传    	
    	
 	   var mybrowsetype = 200;
       if ($.browser.msie) {
           mybrowsetype = 0;
       } else if (window.navigator.userAgent.indexOf("Firefox") >= 0) {
           mybrowsetype = 151;
           if (/Firefox\/(?:[4-9]|3\.[0-3])/.test(navigator.userAgent)) {//3.6.3及以前 
               mybrowsetype = 150;
           }
       }
       var storageId = 0;
       var resumetransmit = 0;
       if (file.storageId) {
           resumetransmit = 1;
           storageId = file.storageId;
       }

       var v = uploadActivex.getversion() >= 196867 ? 2 : 1;
       //0=状态^1=信息^2=IP^3=Port^4=DataPort,5=fileindex,6=key,7=comfrom,8=taskno,9=uploadPort,
   	//10=fastUploadCmdUrl,11 = fastUploadDataUrl,12=comefrom
       var myparams = "<parameters><id>"+args[5]+"</id><comefrom>"+args[12]+"</comefrom><key>"+args[6]+"</key>" 
       		+ "<serveraddress>"+args[2]+"</serveraddress>"
    		+ "<commandport>"+args[3]+"</commandport><dataport>"+args[4]+"</dataport><filename>"+file.filename.replace(/[&]/g, "&amp;").replace(/[']/g, "&apos;")+"</filename>" 
    		+ "<filesize>"+file.filesize+"</filesize><ssoid>"+parent.gMain.sid+"</ssoid>"
    		+ "<userlevel>0</userlevel><usernumber>"+parent.gMain.uid+"</usernumber><flowtype>0</flowtype><taskno>"+args[8]+"</taskno>"
    		+ "<resumetransmit>0</resumetransmit><commandcgi>"+args[10]+"</commandcgi><datacgi>"+args[11]+"</datacgi>" 
    		+ "<browsertype>"+mybrowsetype+"</browsertype>"
    		+ "<fileid>0</fileid><ver>"+v+"</ver></parameters>";
        //id ,from,key,seradr,cmdport,dataport,filename,filesize,taskno
        uploadDiv.StartUpload(args[5],args[2],myparams);
    }
    uploadDiv.showUI(file.id);
};
//上传验证失败
uploadDiv.CheckFail=function(index)
{
    //document.getElementById(this.divName+index+"info").innerText="上传失败";
};

//-1=正在等待上传中 0=文件验证 1=正在上传 2=stop 3=0表示上传成功，4=1表示人为停止，5=2表示意外停止，比如网络断了，6=3表示发现病毒（只有上传完成后，才会发现病毒）
//检查是否有正在上传或等待上传的文件
uploadDiv.checkUpFinish = function(){
	try {
		var count = this.files.length;
		for(var i=0;i<count;i++){
			var file = this.files[i];
			if(file != null){
				if(file.state < 2){
					return true;
				}				
			}
		}
		
	} catch (e) {
		
	}
	return false;
};

//关闭所有上传
uploadDiv.closeAllUp = function(){
	try {
		uploadDiv.stopFlag = true;
		var count = this.files.length;
		for(var i=0;i<count;i++){
			var file = this.files[i];
			if(file != null){
				if(file.state <2){
					uploadActivex.uploadStop(file.id);
					file.state = 4;		
					document.getElementById("ullist").removeChild( document.getElementById( uploadDiv.divName+file.id ) );
					uploadDiv.upCount--;
				}				
			}
		}
		
	} catch (e) {		
	}
};

