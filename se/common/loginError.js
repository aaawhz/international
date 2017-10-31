var LEM = {
		getErrorMsg : function (code, lang) {
			lang = lang || "zh_CN";
			code = code + "_" + lang;
			
		    switch (code) {
            case 'USER_NOT_FOUND_zh_CN': 
            	return '用户没有找到';
            case 'USERID_INVALID_zh_CN': 
            	return '用户账号不合法';
            case 'PASSWD_ERR_zh_CN': 
            	return '用户账号或密码错误';
            case 'IMAGE_VERIFICATION_zh_CN': 
            	return '您登录的次数过多,请稍后再试';
            case 'LIMIT_USER_zh_CN': 
            	return '您登录的次数过多,请稍后再试';
            case 'USERDISABLE_zh_CN': 
            	return '您的帐号已被禁止';
            case 'USER_OFF_zh_CN': 
            	return '用户账号已注销';
            case 'DOMAIN_INFALID_zh_CN': 
            	return '域名填写不合法';
            case 'PASSWORD_INVALID_zh_CN': 
            	return '密码填写不合法';
            case 'DOMAIN_NOT_FOUND_zh_CN': 
            	return '域名不存在';
            case 'PERMISSIONS_NOT_ASSIGNED_zh_CN': 
            	return '您还未被授予任何权限哦';
            default : 
            	return '登录失败';
		    }
		}
};