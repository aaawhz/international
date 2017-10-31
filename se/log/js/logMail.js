
/**
 * @author liuxingmi
 * @description 后台日志查询
 * @date 2012-09-05
 */

var LogMail = {
	
	initUrl : {
		"login":"common/login.do",//登录
		"send":"common/send.do",//发信
	    "recv":"common/recv.do",//收信
	    "del":"common/del.do",//删信
	    "emailToOrder":"common/emailtoorder.do"//工单生成
	},
	
	/**
	 * post 异步请求
	 * @param url
	 * @param obj
	 * @param id
	 */
    post:function(url,obj,id){
        //ajax post请求
    	$.post(url,obj,function(data){        	
    		$("#"+id).html(data);
    		$("#selPageSize").val(pageSize);
    	});      
    }
		
};


