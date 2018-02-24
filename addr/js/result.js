/**
 * @class
 * @desc
 * @date 13-2-21
 */
(function (window) {
    var ajax = window.Ajax || {};
    var noop = function () {};
    var $jq = jQuery || {};
    var util = window.util || {};
    var tip = window.tip || {};
    var UC = window.UC || {};
    var Lang = window.Lang || {};
    var document = window.document;
    var resourceURL = window.resourceURL || '/resource_addr';

    var maxNameLen = 6;

    var fields = {
        "1": "name",
        "2": "emails",
        "3": "mobiles"
    };
    var logoutUrl = window.logOutUrl || window.location.href;

    //覆盖原有的报错方法
    window.Ajax.error = function (url, method, summary) {
        var msg = "method=" + method + " | summary=" + summary;
        console.log(msg, 'Ajax Error:');
    };

    var URL = {
        serviceUrl: window.serviceUrl
    };

    //缓存对象
    var cache = {
        //用户缓存
        users: null,
        //重复联系人试图
        view: null,
        /**
         * 设置重复联系人试图
         * @param key
         * @param view
         */
        setView: function (key, view) {
            //写入缓存
            cache.view || (cache.view = {});
            key && (cache.view[key] = view);
        },
        /**
         * 获取重复联系人试图
         * @param key
         * @returns {*}
         */
        getView: function (key) {
            return key ? cache.view && cache.view[key] : cache.view;
        },
        /**
         * 将用户写入缓存
         * @param users
         */
        setUsers: function (users) {
            //写入缓存
            cache.users || (cache.users = {});
            if (!$jq.isArray(users)) users = [users];
            for (var i = 0, l = users.length; i < l; i++) {
                var user = users[i];
                cache.users[user.id] = user;
            }
        },
        /**
         * 从缓存中查找用户，返回找到的用户和没找到的ID
         * @param id
         * @returns {{users: Array, nid: Array}}
         */
        getUsers: function (id) {
            if (!$jq.isArray(id)) id = [id];
            var users = [],
                nid = [];

            //先去缓存中找
            if (cache.users) {
                for (var i = 0, l = id.length; i < l; i++) {
                    var user = cache.users[id[i]];
                    if (!user) {
                        nid.push(id[i]);
                    } else {
                        users.push(user);
                    }
                }
            } else {
                nid = id;
            }
            return { "users": users, "nid": nid };
        },
        /**
         * 删除缓存数据
         * @param id
         */
        del: function (id) {
            if (!$jq.isArray(id)) id = [id];
            if (cache.users) {
                for (var i = 0, l = id.length; i < l; i++) {
                    delete cache.users[id[i]];
                }
            }
        }
    };

    var CommMail = function (list, user) {
        this.data = [];
        if (list && list.length && user) {
            this.literal(list, user);
        }
        return this;
    };
    CommMail.prototype = {
        literal: function (list, user) {
            var t = this;
            t.data = $jq.map(list, function (mail) {
                //var mailReg = /.*<(.*)>.*/;
                //var to = mail.to.replace(mailReg, '$1');
                //var from = mail.from.replace(mailReg, '$1');
                //return to == from ? null : t.exchange(mail, user);
                return t.exchange(mail, user);
            });
        },
        getData: function () {
            return this.data;
        },
        exchange: function (mail, user) {
            var t = {};
            var dateFormat = 'yyyy-mm-dd';
            var timeFormat = 'HH:nn:ss';
            var now = new Date();
            user = user || {};
            t.mid = mail.mid || 0;
            t.fid = mail.fid || 0;
            t.mailSession = mail.mailSession || 0;
            t.size = mail.size || 0;
            t.sendDate = new Date(mail.sendDate * 1000) || now;
            t.receiveDate = new Date(mail.receiveDate * 1000) || now;
            t.modifyDate = new Date(mail.modifyDate * 1000) || now;
            t.taskDate = mail.taskDate || 0;
            t.priority = mail.priority || 0;
            t.color = mail.color || 0;
            t.antivirusStatus = mail.antivirusStatus || 0;
            t.attachmentNum = mail.attachmentNum || 0;
            t.mailNum = mail.mailNum || 0;
            t.rcptFlag = mail.rcptFlag || 1;
            t.mailFlag = mail.mailFlag || 0;
            t.billType = mail.billType || 0;
            t.starType = mail.starType || 0;
            t.logoType = mail.logoType || 0;
            t.securityLevel = mail.securityLevel || 0;
            t.denyForward = mail.denyForward || 0;
            t.auditStatus = mail.auditStatus || 0;
            t.flags = mail.flags || {};
            t.label = mail.label || [];
            t.from = util.encodeHTML(mail.from || '');
            t.to = util.encodeHTML(mail.to || '');
            t.subject = util.encodeHTML(mail.subject || '');
            t.summary = util.encodeHTML(mail.summary || '');

            t.receiveDay = util.formatDate(t.receiveDate, dateFormat);
            t.modifyDay = util.formatDate(t.modifyDate, dateFormat);
            t.sendDay = util.formatDate(t.sendDate, dateFormat);
            t.receiveTime = util.formatDate(t.receiveDate, timeFormat);
            t.modifyTime = util.formatDate(t.modifyDate, timeFormat);
            t.sendTime = util.formatDate(t.sendDate, timeFormat);

            t.isOwn = mail.from.indexOf(window.account.email) != -1;
            t.uid = user.id || '';
            var avatar = util.getAvatar();
            t.avatar = t.isOwn ? avatar : user.avatar;
            t.username = user.name || '';

            t.hasAcc = mail.flags.attached;
            return t;
        }
    };

    var Friend = function (obj) {
        this._oldData = obj;
        if (obj) {
            this.init(obj);
        }
        return this;
    };
    Friend.prototype = {
        init: function (obj) {
            this.id = null;
            this.data = {};
            this.map = {
                'id': 'id',
                'emailObj': 'email',
                'mobileObj': 'mobile_number_desc',
                'vip': 'isvip',
                'telephone': 'telephone',
                'uin': 'uin',
                'birthday': 'birthday',
                'companyName': 'company_name',
                'zip': 'company_zip',
                'sex': 'sex',
                'position': 'position',
                'address': 'home_address',
                'fax': 'fq_number',
                'groupId': 'group_id',
                'nameFirstChar': 'name_first_char',
                'nameFullChar': 'name_full_char',
                'image_path': 'image_path',
                'memo': 'memo'
            };
            this.exchange(obj);
        },
        getFriend: function () {
            return this.data || [];
        },
        exchange: function (obj) {
            var user = {};
            obj = obj || {};
            //直接对应
            for (var key in this.map) {
                var objKey = this.map[key];
                if ($jq.type(obj[objKey]) == 'string') {
                    user[key] = util.encodeQuot(obj[objKey]);
                } else {
                    user[key] = obj[objKey];
                }
            }

            this.id = user.id;

            user.corpId = window.gMain.corpId;

            //name and short name
            var firstName = util.encodeHTML(obj['first_name']);
            var secondName = util.encodeHTML(obj['seconde_name']);
            var shortNameLen = 6;
            user.name = firstName + secondName;
            user.shortName = util.cut(user.name, shortNameLen);

            //邮箱和无效联系人
            user.invalid = false;
            user.invalidStatus = [];
            user.emails = $jq.map(user.emailObj || [], function (email) {
                if (util.allowInvalid() && email.status && !user.invalid) {
                    user.invalidStatus.push(email.status);
                    user.invalid = true;
                }

                return email && email.name ? util.encodeHTML(email.name) : null;
            });

            user.mobiles = [];
            user.mobileObj = $jq.map(user.mobileObj || [], function (mobile, index) {
                var region = mobile['city_desc'] == mobile['province_desc'] ?
                             mobile['city_desc'] : mobile['province_desc'] + mobile['city_desc'];
                mobile.region = region;
                mobile.mobile_number = util.encodeHTML(mobile.mobile_number);
                if (mobile.mobile_number) {
                    user.mobiles.push(mobile.mobile_number);
                    return mobile;
                }
                return null;
            });

            //birthday
            user.birthday = user.birthday === '00-00-00' ? '' : user.birthday;
            user.sexual = user.sex == 1 ? top.Lang.Addr.nan : (user.sex == 2 ? top.Lang.Addr.nv : top.Lang.Addr.baomi);//男  ||  女  ||  保密

            user.avatar = util.avatarUrl(user['image_path']);

            var temp = {};
            if (obj.mix) {
                obj.mix = obj.mix.replace(/\\\\/g, '\\');
                eval('temp=' + obj.mix);
            }
            if (!temp) {
                temp = {};
            }
            temp.im = temp.im || [];
            user.im = $jq.map(temp.im, function (i) {
                var result = {
                    name: 'QQ',
                    value: ''
                };
                if (i && i.value) {
                    result = {
                        name: util.encodeQuot(i.name),
                        value: util.encodeQuot(i.value)
                    };
                }
                return result;
            });
            temp.custom = temp.custom || [];
            user.custom = $jq.map(temp.custom, function (i) {
                if (i && i.value) {
                    return {
                        name: util.encodeQuot(i.name),
                        value: util.encodeQuot(i.value)
                    };
                }
                return null;
            });

            //groups
            user.groupId = user.groupId || [];
            user.groupId = $jq.map(user.groupId, function (id) {
                return id ? id : null;
            }) || [];

            this.data = user;
            return user;
        },
        exchangeModified: function (user) {
            var result = [];
            var map = {
                'id': 'id',
                'image_path': 'image_path',
                'isvip': 'vip',
                'telephone': 'telephone',
                'uin': 'uin',
                'birthday': 'birthday',
                'company_name': 'companyName',
                'company_zip': 'zip',
                'sex': 'sex',
                'position': 'position',
                'home_address': 'address',
                'fq_number': 'fax',
                'group_id': 'groupId',
                'name_first_char': 'nameFirstChar',
                'email': 'emails',
                'mobile_number': 'mobiles',
                'memo': 'memo'
            };

            for (var key in map) {
                var objKey = map[key];
                if ($jq.type(user[objKey]) == 'string') {
                    result[key] = util.decodeHTML(user[objKey]);
                } else {
                    result[key] = user[objKey];
                }
            }

            //mix data
            var mix = {
                im: user.im,
                custom: user.custom
            };
            result['mix'] = JSON.stringify(mix);

            return result;
        }
    };

    var PersonalContact = function (data) {
        this.objData = data;
        this.init();
        return this;
    };
    PersonalContact.prototype = {
        init: function () {
            this.data = [];
            this.friendObj = [];
            this.literal();
        },
        literal: function () {
            var t = this;
            var users = t.objData;
            var contact = $jq.map(users, function (item) {
                var user = new Friend(item);
                if (user.id) {
                    t.friendObj.push(user);
                    return user.getFriend();
                }
                return null;
            });
            t.data = contact;
            return contact;
        },
        getContact: function () {
            return this.data;
        },
        getUsers: function (ids) {
            return $jq.map(this.data, function (item) {
                if (util.inArray(item.id, ids)) {
                    return item;
                }
                return null;
            });
        },
        getUser: function (id) {
            return this.getUsers([id])[0];
        },
        modify: function (user) {
            var t = this;
            $jq.each(t.data, function (index, oldUser) {
                if (oldUser.id == user.id) {
                    t.data[index] = user;
                    return false;
                }
            });
        },
        add: function (users) {
            var t = this;
            if ($jq.type(users) != 'array') {
                users = [users];
            }
            t.data = $jq.merge(users, t.data);
        },
        del: function (ids) {
            var t = this;
            if (!ids.length || !ids[0]) {return;}
            t.data = $jq.map(t.data, function (user) {
                if (user && util.inArray(user.id, ids)) {
                    return null;
                }
                return user;
            });
        },
        getLength: function () {
            return this.data.length || 0;
        },
        getAlphabetCount: function () {
            var contact = this.data;
            var alphabet = {};
            for (var i = 0; i < contact.length; i++) {
                var friend = contact[i];
                var first = friend['nameFirstChar'][0];
                if (first) {
                    first = first.toUpperCase();
                    alphabet[first] = alphabet[first] ? alphabet[first] + 1 : 1;
                }
            }

            return alphabet;
        }
    };

    var User = function (users) {
        this.data = [];
        if (users) {
            this.literal(users);
        }
        return this;
    };

    User.prototype = {
        literal: function (users) {
            var t = this;
            t.data = $jq.map(users, function (user) {
                return user.id ? t.exchange(user) : null;
            });
        },
        getData: function () {
            return this.data || [];
        },
        exchange: function (user) {
            if (user.exchanged) {
                return user;
            }
            user.id = user.id || 0;
            var firstName = util.encodeHTML(util.decodeXML((user['first_name'] || user['firstName'] || '')));
            var secondName = util.encodeHTML(util.decodeXML((user['second_name'] || user['secondName'] || '')));
//            user.firstName = firstName;
//            user.secondName = secondName;
            user.name = user.name || (firstName + secondName);

            user.shortName = util.cut(user.name, 6);

            //email
            user.invalid = user.invalid || false;
            user.invalidStatus = user.invalidStatus || [];
            user.emails = user.emails || user.email || [];
            user.email = user.email || [];
            if (!$jq.isArray(user.email)) {
                user.email = [user.email];
            }
            user.email = $jq.map(user.emails, function (email) {
                if (email.status && !user.invalid) {
                    user.invalidStatus.push(email.status);
                    user.invalid = true;
                }
                return email && email.name ? email.name : null;
            });

            if (!util.allowInvalid()) {
                user.invalid = false;
                $jq.each(user.invalidStatus, function (index) {
                    user.invalidStatus[index] = 0;
                });
            }

            //user mobile number
            user.mobile_number_desc = user.mobile_number_desc || [];
            var mobiles = user.mobile_number_desc || [];
            user.mobiles = $jq.map(mobiles, function (mobile) {
                var m = {};
                if (mobile.mobile_number) {
                    m.number = mobile.mobile_number;
                    m.address = mobile['province_desc'] == mobile['city_desc'] ? mobile['city_desc'] :
                                mobile['province_desc'] + mobile['city_desc'];
                    return m;
                }
                return null;
            });
            user.mobile_number = $jq.map(mobiles, function (mobile, index) {
                var reg = /^(\+?86)?\d+$/;
                if (!reg.test(mobile.mobile_number)) {
                    mobiles[index]['mobile_number'] = '';
                    return null;
                }
                return mobile.mobile_number;
            });
            //birthday
            user.birthday = user.birthday === '00-00-00' ? '' : user.birthday;
            user.sexual = user.sex == 1 ? top.Lang.Addr.nan : (user.sex == 2 ? top.Lang.Addr.nv : top.Lang.Addr.baomi);//男  ||  女  ||  保密

            user.avatar = util.avatarUrl(user['image_path']);

            var temp = {};
            if (user.mix) {
                eval('temp=' + user.mix);
            }
            if (!temp) {
                temp = {};
            }

            user.im = temp.im;
            user.custom = temp.custom;

            //groups
            user.group_id = user.group_id || [];
            user.group_id = $jq.map(user.group_id, function (id) {
                return id ? id : null;
            }) || [];
            user.exchanged = 1;
            return user;
        }
    };

    var ComUser = function (users, depts) {
        this.data = [];
        this.depts = depts || {};
        if (users) {
            this.literal(users);
        }
        return this;

    };
    ComUser.prototype = {
        literal: function (users) {
            var t = this;
            t.data = $jq.map(users, function (user) {
                return user.id ? t.exchange(user) : null;
            });
        },
        getData: function () {
            return this.data || [];
        },
        exchange: function (user) {
            var t = this;
//            var dept = t.getDept(user.dept_id[0]);

            var firstName = util.decodeHTML(user['firstName'] || '');
            var secondName = util.decodeHTML(user['secondName'] || '');
            //            user.firstName = firstName;
            //            user.secondName = secondName;
            user.name = firstName + secondName;

            user.shortName = util.cut(user.name, 6);

            //email
            user.email = user.email || [];
            if (!$jq.isArray(user.email)) {
                user.email = [user.email];
            }

            user.email[0] = util.encodeHTML(user.email[0]);

            //user mobile number
            var mobiles = user.mobile_number_desc || [];
            user.mobileAddr = [];
            user.mobile_number = $jq.map(mobiles, function (mobile, index) {
                var p = mobile['province_desc'] || '';
                var c = mobile['city_desc'] || '';
                if (mobile.mobile_number) {
                    user.mobileAddr[index] = p && c == p ? p : ($jq.trim(p + c));
                    return util.encodeHTML(mobile.mobile_number);
                }
                return null;
            }) || [];

            user.shortTel = util.encodeHTML(user['bak_str_01']);
            user.telephone = util.encodeHTML(user.telephone);

            user.avatar = util.avatarUrl(user.imagePath);

            user.barCode = getBarCode(user.id, user.corp_id);

            //部门
            user.deptId = user['dept_id'];
            user.deptTotal = [];
            //部门领导
            user.leaderName = [];
            user.deptNames = user['dept_name_list'] || [];
            user.shortDeptNames = $jq.map(user.deptNames, function (deptName) {
                return util.cut(deptName, 8);
            });
            user.deptName = [];
            user.dept = $jq.map(user['dept_id'], function (id, index) {
                var dept = t.getDept(id);
                if (dept) {
                    user.deptName[index] = dept.name;
                    user.leaderName[index] = dept.leaderName || '';
                    return dept;
                }
                return null;
            });

            if (user['common_flag']) {
                var item = {};
                if (user['common_memo']) {
                    eval('item = ' + user['common_memo']);
                }
                user.commonAttr = item;
            }
            return user;
        },
        /**
         * 将企业通讯录联系人转化为个人通讯录联系人（添加前）
         * @param users
         * @return {Array}
         */
        exchange2Personal: function (users) {
            var map = {
                'firstName': 'first_name',
                'mobile_number': 'mobile_number',
                'email': 'email',
                'telephone': 'telephone',
                'position': 'position',
                'sex': 'sex',
                'birthday': 'birthday',
                'memo': 'memo'
            };
            var result = [];
            $jq.each(users, function (i, user) {
                result[i] = {};
                for (var name in map) {
                    var key = map[name];
                    if (key && name && result[i]) {
                        result[i][key] = user[name];
                    }
                }

                //sex hack, 企业通讯录和个人通讯录的性别差异造成的
                result[i]['sex'] = fixedSex(result[i]['sex']);

                //company_name
            });

            function fixedSex (sex) {
                switch (Number(sex)) {
                case 0:
                    sex = 1;
                    break;
                case 1:
                    sex = 2;
                    break;
                default:
                    sex = 0;
                }
                return sex;
            }

            return result;
        },
        getDept: function (id) {
            return this.depts['_' + id];
        }
    };

    var ComUserInfo = function (user) {
        if (user) {
            this.exchange(user);
        }
    };

    ComUserInfo.prototype = {
        exchange: function (user) {
            var userDeptNameList = user['dept_name_list'];
            user.name = util.encodeHTML(user['firstName']) + util.encodeHTML(user['secondName']);
            user.deptName = util.encodeHTML(userDeptNameList.join('; '));
            user.sex = user.sex == 0 ? top.Lang.Addr.nan : user.sex == '1' ? top.Lang.Addr.nv : top.Lang.Addr.baomi;//男  ||  女  ||  保密

            user.avatar = util.avatarUrl(user['imagePath']);

            //todo 归属地部分还没有
            user.mobile_number = [util.encodeHTML(user['mobileNumber'])];

            //清除生日默认值
            if (user.birthday == '00-00-00') {
                user.birthday = '';
            }
            user.birthday = util.encodeHTML(user.birthday);

            user.barCode = getBarCode(user.id, user.corp_id);

            user.mobileAddr = '';
            user.address = util.decodeHTML(user['home_address']) || '';
            user.fax = util.encodeHTML(user.fax) || '';
            user.zip = util.encodeHTML(user.zip) || '';
            user.memo = util.encodeHTML(user.memo) || '';
            user.telephone = util.encodeHTML(user.telephone) || '';

            if (user['common_flag']) {
                var item = {};
                if (user['common_memo']) {
                    eval('item = ' + user['common_memo']);
                }
                user.commonAttr = item;
            }

            user.userDate = util.encodeHTML(user['user_date']) || '';
            user.userDateType = user['user_date_type'] ? top.Lang.Addr.ruxueshijian : top.Lang.Addr.ruzhishijian;//入学时间  ||  入职时间
            user.userNumber = util.encodeHTML(user['user_number']) || '';
            user.userNumberType = user['user_number_type'] ? top.Lang.Addr.xuehao : top.Lang.Addr.gonghao;//学号  ||  工号

            user.customInfo = [];
            var customInfo = {};
            if (user['mix']) {
                eval('customInfo=' + user['mix']);
            }

            var mix = obj2Arr(customInfo['mix']);
            if (mix.length) {
                $jq.merge(user.customInfo, mix);
            }

            this.data = user;
            return user;
        },
        getData: function () {
            return this.data;
        }
    };

    var Dept = function (depts, parentId) {
        this.depts = {};
        this.arrayDepts = [];
        this.parentId = parentId || 0;
        if (depts) {
            this.loop(depts);
        }
        return this;
    };

    Dept.prototype = {
        getDepts: function () {
            return this.depts;
        },
        getDept: function (id) {
            if (id == undefined) {
                return tip(top.Lang.Addr.bumenbucunzai);//部门id不存在
            }
            return this.depts['_' + id];
        },
        getArrayDepts: function () {
            return this.arrayDepts;
        },
        getParentId: function () {
            return this.parentId;
        },
        loop: function (depts) {
            var t = this;
            var data = this.depts;
            for (var i = 0; i < depts.length; i++) {
                var dept = t.exchange(depts[i]);
//                dept.parentId = depts.id || '';

                data['_' + dept.id] = dept;
                t.arrayDepts.push(dept);
            }

        },
        exchange: function (dept) {
            dept.shortName = util.cut(dept.name, 8);
            dept.leaderName = util.encodeHTML(dept['leader_first_name'] || '')
                + util.encodeHTML(dept['leader_second_name'] || '');
            dept.leaderShortName = util.cut(dept.leaderName, 8);
            return dept;
        }
    };

    var IdCard = function (user) {
        this.data = {};
        if (user) {
            this.exchange(user);
        }
        return this;
    };

    IdCard.prototype = {
        exchange: function (user) {
            if ($jq.isArray(user)) {
                user = user[0];
            }
            this.user = user;
        },
        getData: function () {
            return this.user;
        },
        render: function (type) {
            type = type || 0;
            var template = this.template[type];
            return window.tmpl(template, {user: this.user, lang: Lang.Addr});
        },
        template: {
            //个人通讯录
            "0": [
                "#s#=lang.a0069#e#: #s#=user.name#e#<br/>",
                "#s#if(user.emails && user.emails.length){#e#",
                "#s#=lang.a0200#e#：#s#=user.emails.join(';')#e#<br/>",
                "#s#}#e#",
                "#s#if(user.mobiles){#e#",
                "#s#=lang.a0148#e#：#s#=user.mobiles.join(';')#e#<br/>",
                "#s# } #e#",
                "#s#if(user.birthday){#e#",
                "#s#=lang.a0136#e#：#s#=user.birthday#e#<br/>",
                "#s#}#e#",
                "#s#if(user.telephone){#e#",
                "#s#=lang.a0058#e#：#s#=user.telephone#e#<br/>",
                "#s#}#e#",
                "#s#if(user.address){#e#",
                "#s#=lang.a0074#e#：#s#=user.address#e#<br/>",
                "#s#}#e#",
                "#s#if(user.companyName){#e#",
                "#s#=lang.a0032#e#：#s#=user.companyName#e#<br/>",
                "#s#}#e#",
                "#s#if(user.position){#e#",
                "#s#=lang.a0157#e#：#s#=user.position#e#<br/>",
                "#s#}#e#",
                "#s#if(user.memo){#e#",
                "#s#=lang.a0063#e#：#s#=user.memo#e#<br/>",
                "#s#}#e#",
                "#s#if(user.groupName && user.groupName.length){#e#",
                "#s#=lang.a0095#e#：#s#=user.groupName.join(';')#e#<br/>",
                "#s#}#e#"
            ].join(''),
            //企业通讯录
            "1": [
                "#s#=lang.a0069#e#: #s#=user.name#e#<br/>",
                "#s#if (user.email && user.email.length) {#e#",
                "#s#=lang.a0200#e#：#s#=user.email.join(';')#e#<br/>",
                "#s#}#e#",
                "#s#if(user.mobile_number && user.mobile_number.length){#e#",
                "#s#=lang.a0148#e#：#s#=user.mobile_number.join(';')#e#<br/>",
                "#s#}#e#",
                "#s#if(user.telephone){#e#",
                "#s#=lang.a0058#e#：#s#=user.telephone#e#<br/>",
                "#s#}#e#",
                "#s#if(user.position){#e#",
                "#s#=lang.a0157#e#：#s#=user.position#e#<br/>",
                "#s#}#e#",
                "#s#if(user.address){#e#",
                "#s#=lang.a0034#e#：#s#=user.address#e#<br/>",
                "#s#}#e#",
                "#s#if(user.deptName && this.enterprise != 'post'){#e#",
                "#s#=lang.a0096#e#：#s#=user.deptName#e#<br/>",
                "#s#}#e#",
                "#s#if(user.birthday){#e#",
                "#s#=lang.a0136#e#：#s#=user.birthday#e#<br/>",
                "#s#}#e#",
                "#s#if(user.sex){#e#",
                ""+top.Lang.Addr.xingbie,//性别：#s#=user.sex#e#<br/>
                "#s#}#e#",
                "#s#if(user.fax){#e#",
                "#s#=lang.a0021#e#：#s#=user.fax#e#<br/>",
                "#s#}#e#",
                "#s#if(user.zip){#e#",
                ""+top.Lang.Addr.youzhengbianma,//邮政编码：#s#=user.zip#e#<br/>
                "#s#}#e#",
                "#s#if(user.memo){#e#",
                "#s#=lang.a0063#e#：#s#=user.memo#e#<br/>",
                "#s#}#e#"
            ].join(''),
            //客户通讯录
            "2": [
                "#s#=lang.a0069#e#: #s#=user.name#e#<br/>",
                "#s#if (user.email) {#e#",
                "#s#=lang.a0200#e#：#s#=user.email#e#<br/>",
                "#s#}#e#",
                "#s# if(user.mobile_number.length){#e#",
                "#s#=lang.a0148#e#：#s#=user.mobile_number#e#<br/>",
                "#s#}#e#",
                "#s#if(user.telephone){#e#",
                "#s#=lang.a0058#e#：#s#=user.telephone#e#<br/>",
                "#s#}#e#",
                "#s#if(user.address){#e#",
                "#s#=lang.a0034#e#：#s#=user.address#e#<br/>",
                "#s#}#e#",
                "#s#if(user.group_id && user.group_id.length){#e#",
                "#s#=lang.a0095#e#：#s#=user.groupName.join(';')#e#<br/>",
                "#s#}#e#",
                "#s#if(user.birthday){#e#",
                "#s#=lang.a0136#e#：#s#=user.birthday#e#<br/>",
                "#s#}#e#",
                "#s#if(user.sex){#e#",
                ""+top.Lang.Addr.xingbie,//性别：#s#=user.sex#e#<br/>
                "#s#}#e#",
                "#s#if(user.fax){#e#",
                "#s#=lang.a0021#e#：#s#=user.fax#e#<br/>",
                "#s#}#e#",
                "#s#if(user.company_name){#e#",
                "#s#=lang.a0032#e#：#s#=user.company_name#e#<br/>",
                "#s#}#e#",
                "#s#if(user.position){#e#",
                "#s#=lang.a0157#e#：#s#=user.position#e#<br/>",
                "#s#}#e#",
                "#s#if(user.zip){#e#",
                ""+top.Lang.Addr.youzhengbianma,//邮政编码：#s#=user.zip#e#<br/>
                "#s#}#e#",
                "#s#if(user.memo){#e#",
                "#s#=lang.a0063#e#：#s#=user.memo#e#<br/>",
                "#s#}#e#",
                "#s#if (user.commonInfo && user.commonInfo.length) {#e#",
                "#s# for(var i =0; i < user.commonInfo.length; i++) {",
                "var item = user.commonInfo[i]; #e#",
                "#s#if (item.text) {#e#",
                "#s#=item.text#e#：#s#=item.value#e#<br/>",
                "#s#}#e#",
                "#s# } #e#",
                "#s#}#e#"
            ].join('')
        }
    };

    var MailGroup = function (list) {
        this.data = [];
        if (list) {
            this.loop(list);
        }
        return this;
    };

    MailGroup.prototype = {
        getData: function () {
            return this.data;
        },
        loop: function (list) {
            var t = this;
            t.data = $jq.map(list, function (item) {
                return t.exchange(item);
            });
        },
        exchange: function (mailGroup) {
            var mg = {};

            //            status = -1 // 未审核
            //            status = 0 // 审核中
            //            status = 1  // 审核通过
            //            status = 2 //审核不通过
            var status = mailGroup.status;
            mg.id = mailGroup.groupId || '';
            mg.name = mailGroup.groupName || '';
            mg.uin = mailGroup['uin'] || '';
            mg.openIn = mailGroup['joinPrivilege'] || 0;
            mg.quit = mailGroup['exitPrivilege'] || 0;
            mg.mail = mailGroup.mail || '';
            mg.adm = mailGroup['memberName'] || '';

            mg.fullOpen = (mg.openIn == 1);
            mg.halfOpen = (mg.openIn == 2 && status == -1);


            mg.auditing = mg.openIn == 2 && status == 0;
            mg.unAudit = mg.openIn == 2 && status == 2;
            return mg;
        },
        getGroup: function (id) {
            if (!id) {
                return;
            }
            var groups = this.data;
            for (var i = 0; i < groups.length; i++) {
                var group = groups[i];
                if (group.id == id) {
                    return group;
                }
            }
        },
        remove: function (id) {
            if (!id) {
                return;
            }
            this.data = $jq.map(this.data, function (group) {
                return group.id == id ? null : group;
            });
        },
        setStatus: function (id, status) {
            var t = this;
            $jq.each(t.data, function (index, group){
                if (group.id == id) {
                    if (status == -1) {
                        group.halfOpen = true;
                        group.auditing = false;
                        group.unAudit = false;
                    } else if (status == 0) {
                        group.halfOpen = false;
                        group.auditing = true;
                        group.unAudit = false;
                    } else if (status == 2) {
                        group.halfOpen = false;
                        group.auditing = false;
                        group.unAudit = true;
                    } else {
                        group.halfOpen = false;
                        group.auditing = false;
                        group.unAudit = false;
                    }

                    return;
                }
            });
        }
    };

    var CommonContact = function (users, depts) {
        this.data = [];
        this.depts = depts;
        if (users) {
            this.loop(users);
        }
        return this;
    };
    CommonContact.prototype = {
        getData: function () {
           return this.data;
        },
        loop: function (users) {
            var t = this;
            t.data = $jq.map(users, function (user) {
                return t.exchange(user);
            });
        },
        exchange: function (user) {
            user = new ComUser(null, this.depts).exchange(user);
            var cu = user || {};
            if (user['common_flag']) {
                var item = {};
                eval('item = ' + user['common_memo']);
//                cu.
//                cu = item;
//                cu.id = user.id;
//                cu.phone = user.phone;
//                cu.position = user.position;
//                cu.avatar = user.image_path ? avatarUrl + user.image_path : resourceURL+"/images/default_p.jpg";
//                if ($jq.isArray(user.email)) {
//                    cu.email = user.email[0];
//                } else {
//                    cu.email = user.email;
//                }

//                cu.mobilePos = mobile[0].city_desc + mobile[0].province_desc;

                if (item.phone && item.phone.length) {
                    cu.comMobile = $jq.map(item.phone, function (m) {
                        return m.value;
                    }) || [];
                }

                cu.tip = item.desc ? item.desc.value || '' : '';
            }

            return cu;
        }
    };

    var PublicContact = function (users) {
        this.data = [];
        if (users) {
            this.loop(users);
        }
        return this;
    };
    PublicContact.prototype = {
        getData: function () {
            return this.data;
        },
        loop: function (users) {
            var t = this;
            t.data = $jq.map(users, function (user) {
                return t.exchange(user);
            });
        },
        exchange: function (user) {
            user = user || {};
            var cu = {};
//            adminList
//            createDate
//            mailId
//            mailName
//            mailNameDomain
//            managers
//            serviceId
//            status
//            type
//            userList
            cu.id = user.mailId || '';
            cu.name = user.mailName || '';
            cu.email = user.mailNameDomain || '';
            cu.managers = user.managers || '';


            return cu;
        }
    };

    var ClientGroup = function (groups) {
        this.data = [];
        if (groups) {
            this.loop(groups);
        }
        return this;
    };
    ClientGroup.prototype = {
        getData: function () {
            return this.data;
        },
        getGroup: function (id) {
            var groups = this.data;
            var result = {};
            $jq.each(groups, function (gid, group) {
                if ( gid == id ) {
                    result = group;
                    return false;
                }
            });

            return result;
        },
        loop: function (groups) {
            for (var i = 0, len = groups.length; i < len; i++) {
                var group = groups[i];
                this.data.push(this.exchange(group));
            }
        },
        exchange: function (group) {
            group = group || {};
            group.shortName = util.cut(group.name, 8);
            group.count = group['client_count'] || 0;
            return group;
        },
        getObjData: function (id) {
            if (!this.objData) {
                this.objData = {};
                for (var i = 0; i < this.data.length; i++) {
                    this.objData[this.data[i].id] = this.data[i];
                }

            }
            return this.objData;
        }

    };

    var ClientUser = function (users, groups) {
        this.data = [];
        this.groups = this.exchangeGroups(groups);
        if (users) {
            this.loop(users);
        }
        return this;
    };

    ClientUser.prototype = {
        getData: function () {
            return this.data;
        },
        getUser: function (id) {
            var result = {};
            for (var i = 0; i < this.data.length; i++) {
                var user = this.data[i];
                if (id == user.id) {
                    result = user;
                    break;
                }
            }
            return result;
        },
        loop: function (users) {
            for (var i = 0; i < users.length; i++) {
                var user = users[i];
                this.data.push(this.exchange(user));
            }
        },
        exchange: function (user) {
            var t = this;
            user.name = (user.first_name || '') + (user.second_name || '');
            user.emails = [user.email];
            user.mobile = user.mobile_number;
            user.mobiles = [user.mobile_number];
            user.avatar = util.avatarUrl(user['image_path']);
            user.sex = user.sex == 0 ? top.Lang.Addr.nan : user.sex == '1' ? top.Lang.Addr.nv : top.Lang.Addr.baomi;//男  ||  女  ||  保密
            if (user.group_id && !user.group_id.length) {
                user.group_id[0] = 0; //未分组联系人
            }
            user.groupShortName = [];
            user.groupName = $jq.map(user.group_id, function (id) {
                if (t.groups[id]) {
                    var name = t.groups[id].name;
                    var shortName = util.cut(name, 8);
                    user.groupShortName.push(shortName);
                    return name;
                }
                return null;
            });
            var common_info = {};
            eval('common_info=' + user['common_memo']);
            user.commonInfo = [];
//            备注信息
            if (common_info['desc']) {
                user.commonInfo.push(common_info['desc']);
            }
            //即时聊天工具
            var ims = obj2Arr(common_info['im']);
            if (ims.length) {
                $jq.merge(user.commonInfo, ims);
            }
            //邮箱
            var common_mails = obj2Arr(common_info['mail']);
            common_mails.shift();
            if (common_mails.length) {
                $jq.merge(user.commonInfo, common_mails);
            }

            var common_mobile = obj2Arr(common_info['phone']);
            common_mobile.shift();
            if (common_mobile.length) {
                $jq.merge(user.commonInfo, common_mobile);
            }

            var common_phone = obj2Arr(common_info['familyPhone']);
            if (common_phone.length) {
                $jq.merge(user.commonInfo, common_phone);
            }

            var mix = obj2Arr(common_info['mix']);
            if (mix.length) {
                $jq.merge(user.commonInfo, mix);
            }
            $jq.each(user.commonInfo, function (index, item) {
                user.commonInfo[index].text = item.text;
                user.commonInfo[index].value = item.value;
            });

            return user;
        },
        exchangeGroups: function (groups) {
            var result = {};
            groups = groups || [];
            $jq.each(groups, function (index, group) {
                result[group.id] = group;
            });
            return result;
        }
    };


    var Enterprise = function (data) {
        this.init(data);

    };
    Enterprise.prototype = {
        init: function (data) {
            this.oData = data || {};
            this.data = {};
            this.exchange(data);
        },
        /**
         * 转化为对象数据
         * @param data
         */
        exchange:function (data) {
            var ent = {};
            var map = {
                id: 'corpId',
                name: 'corpName',
                count: 'count'
            };
            for (var key in map) {
                ent[key] = util.encodeHTML(data[map[key]]);
            }
            this.data = ent;
        },
        /**
         * 获取企业信息
         * @return {object}
         */
        getEnt: function () {
            return this.data;
        },
        /**
         * 获取企业id
         * @return {string}
         */
        getId: function () {
            return this.data.id || 0;
        },
        /**
         *获取企业名称
         * @return {string}
         */
        getName: function () {
            return this.data.name || '';
        },
        /**
         * 获取截取后的企业名称
         * @param [len] {number}
         * @return {*|string}
         */
        getShortName: function (len) {
            len = len || 6;
            return util.cut(this.data.name, len);
        }
    };

    var Corps = function (data) {
        this.init(data);
    };
    Corps.prototype = {
        init: function (data) {
            this.oData = data || [];
            //array info
            this.data = [];
            //object info
            this.objData = {};
            //Object
            this.corps = [];

            this.depts = {};
            //array department list
            this.arrDepts = {};
            //object department list
            this.objDepts = {};
            this.loop();
        },
        /**
         * 将原始数据转化为对象内部数据
         */
        loop: function () {
            var corps = this.oData;
            for (var i = 0; i < corps.length; i++) {
                var ent = new Enterprise(corps[i]);
                var entInfo = ent.getEnt();
                this.corps.push(ent);
                this.data.push(entInfo);
                this.objData[entInfo.id] = entInfo;
            }
        },
        /**
         * 获取企业对象
         * @param id {string}
         * @return {object|null}
         */
        getCorp: function (id) {
            if (!id){
                tip('Get corp ID failure, please check data or programm.');
            }
            var corps = this.corps,
                len = corps.length,
                result = null;
            for (var i = 0; i < len; i++) {
                var corp = corps[i];
                if (id && corp['id'] && id == corp['id']) {
                    result = corp;
                }
            }
            return result;
        },
        /**
         * 获取企业列表
         * @param [type] {string}
         * @return {array|object}
         */
        getCorpsList: function (type) {
            type = type || 'array';
            if (type == 'object') {
                return this.objData;
            }
            return this.data;
        },
        /**
         * 获取企业列表
         * @param id
         * @param type
         * @return {*}
         */
        getCorpInfo: function (id, type) {
            type = type || 'id';
            var getFirstUpperCase = function (str) {
                return str.replace(/^\w/, function (s) {
                    return s.toUpperCase();
                });
            };
            type = getFirstUpperCase(type);
            return this['getCorpBy' + type](id);

        },
        /**
         * 根据id获取企业信息
         * @param id
         * @return {*}
         */
        getCorpById: function (id) {
            return this.objData[id];
        },
        /**
         * 根据索引获取企业信息
         * @param index
         * @return {*}
         */
        getCorpByIndex: function (index) {
            return this.data[index];
        },
        /**
         * 获取用户所在企业
         * @return {*}
         */
        getMyCorp: function () {
            return this.data[0];
        },
        getMyCorpId: function () {
            return  this.getMyCorp() ? this.getMyCorp().id : window.gMain.corpId;
        },
        /**
         * 初始化部门
         * @param corpId {string}
         * @param depts {object}
         */
        initDept: function (corpId, arrayDepts) {
            var depts = new Dept(arrayDepts);
            this.setDepts(depts, corpId);
        },
        setDepts: function (depts, corpId) {
            var parentDeptId = depts.getParentId();
            var arrDeptList = depts.getArrayDepts();
            var objDepts = depts.getDepts();
            this.depts[corpId] = this.depts[corpId] || {};
            this.depts[corpId][parentDeptId] = arrDeptList;
            $jq.extend(this.objDepts, objDepts || {});
        },
        /**
         * 获取部门对象，只能获取一级
         * @param corpId
         * @param deptId 所在部门id，默认为0（顶级部门）
         * @return {*}
         */
        getDepts: function (corpId, deptId) {
            deptId = deptId || 0;
            return this.depts[corpId][deptId];
        },
        getAllDepts: function () {
            return this.objDepts;
        },
        /**
         * 获取部门列表 （数组形式），只能获取一级
         * @param corpId
         * @param deptId 所在部门id，默认为0（顶级部门）
         * @return {*}
         */
        getArrayDepts: function (corpId, deptId) {
            return this.depts[corpId][deptId];
        },
//        /**
//         * 获取部门树（对象形式）
//         * @param deptId
//         * @return {*}
//         */
//        getObjectDepts: function (deptId) {
//            return this.objDepts[deptId];
//        },
        /**
         * 获取部门
         * @param corpId
         * @param deptId
         * @return {*}
         */
        getDept: function (deptId) {
            return this.objDepts['_' + deptId];
        }
    };


    function obj2Arr (obj) {
        var result = [];
        if (obj && $jq.isPlainObject(obj)) {
            result = $jq.map(obj, function (item) {
                return item;
            });
        } else if ($jq.isArray(obj)) {
            result = obj;
        }
        return result;
    }

    var Addr = function () {
        var t = this;
        $jq(document).bind('rerender', function () {
            t.reRender();
        });
    };

    var isOk = function (code) {
        return code === "S_OK";
    };

    function getBarCode (id, corpId) {
        var serviceUrl = window.serviceUrl || '/s';
        corpId = corpId || window.gMain.corpId;
        return util.sidUrl(serviceUrl + '?func=addr:getQRenCode', {
            'user_id': id,
            'corp_id': corpId
        });
    }

    var func = function (func) {
        return typeof func === "function" ? func : noop;
    }

    var uids = function (list) {
        var ids = [];
        if (list) for (var i = 0, l = list.length; i < l; i++) {
            var item = list[i];
            ids.push(item.id);
        }
        return ids;
    }

    /**
     *  合并数组
     * @param arr1
     * @param arr2
     * @returns {Array|undefined}
     */
    var mergeArray = function (arr1, arr2) {
        if (!$jq.isArray(arr1) || !$jq.isArray(arr2)) {
            return;
        }
        return $jq.unique(arr1.concat(arr2)).reverse();
    }

    var serializePostData = function (data) {
        return util.varToXml(null, data, "\n").substr(1) + '\n\n';
    };

    var funcId = {
        //--查询联系人列表
        "contact": "addr:linkmanQuery",

        //---contact---联系人增删改查
        'contactManager': "addr:linkmanAdmin",

        //--增加联系人记录，要分清和上面的那个有什么区别
        "addContact": "addr:addLinkRecord",
        "contactGroupAdmin": "addr:linkmanGroupAdmin",
        //        'searchContact': '',
        //--分组管理
        "group": "addr:groupAdmin",
        //--获取所有分组列表
        "groupList": "addr:groupQuery",
        //--获取分组成员列表
        "groupMember": "addr:groupMemberAdmin",

        "groupMemberAdmin": "addr:groupMemberAdmin",
        //--部门用户列表
        "comMembers": "addr:listDeptUserInfo",
        //--获取部门
        "deptUserQuery": "addr:deptUserQuery",
        "department": "addr:getDepTree",
        //--企业用户查询
        "comSearchDept": "addr:searchDeptUserInfo",
        //--发送短息
        "sendSMS": "sms:send",
        //--#s#=this.Lang.a0049#e#
        "sendEmail": "mbox:compose",
        //--保存到联系人
        "save2Addr": "addr:save",
        //--获取签名
        "getSignatures": "user:getSignatures",
        //--获取写信事务
        "getComposeId": "mbox:getComposeId",
        //发送接口序列
        'sequential': 'global:sequential',
        //搜索邮件组
        'mailGroup': 'user:listGroupByUser',
        //已加入邮件组
        'joinedMailGroup': 'user:listJoinGroup',
        //加入邮件组
        'applyMailGroup': 'user:applyGroup',
        //退出邮件组
        'exitGroup': 'user:exitGroup',
        //管理邮件组
        'setMailGroup': 'suite:setMailGroup',
        //管理邮件组成员
        'mailGroupMemberManager': 'suite:setMailGroupUser',
        //查找邮件
        "searchMail": 'mbox:searchMessages',
        //快速回复
        "quickReply": "mbox:replyMessage",
        //读信
        "readMail": "mbox:readMessage",
        "comUserQuery": "addr:listUsers",
        //查询部门（包括子部门）用户
        "searchComUsers": "addr:searchUsers",
        "getComUserInfo": "addr:userQuery",
        "commonContact": "addr:corpCommonQuery",
        //查询客户通讯录分组
        "clientGroupQuery": "addr:clientGroupQuery",
        //查询客户通讯录列表
        "clientQuery": "addr:clientQuery",
        "clientSearch": "addr:searchClient",
//        "publicContact": "addr:corpPubAcntQuery",
        "publicContact": "vas:listPublic",
        //获取企业列表
        "getCorps": "corp:accessListQuery"
    };

    var GET_DATA_TIME = 3;

    Addr.prototype = {
        //--------data---------
        /**
         * 联系人列表
         */
//        contact: [],

        /**
         * 最近联系人
         */
        recentContact: [],

        /**
         * 公司联系人列表
         */
        comContact: {},

        /**
         * 分组列表
         */
        groups: {},

        //指示是否成功获取到联系人
        contactIsReady: false,

        /**
         * 获取数据接口，调用serverAPI，这里需要考虑是否需要这个层面的接口,
         * 现预计封装“正在加载”的提示，禁止重复提交等操作
         * @param id {string}
         * @param options
         * {
     *     url {string}
     *     params {object}
     *     xmlData {string}
     *     async {boolean}
     *     dataType {string}      xml(default)|json 传输数据格式
     *     success {function}
     *     error {function}
     *     before {function}
     * }
         * @return {object}
         */
        dataApi: function (id, options) {
            var t = this;
            if (!id) {
                return;
            }
            tip(Lang.Addr.a0131, 1);
            //            try {
            //                var url = sUrl;
            var method = options.method || "POST";
            var resType = "html";
            var isJson = options.dataType === 'json';
            var head = ["Content-Type", (isJson ? "application/json" : "text/xml") + "; charset=utf-8"];
            var noSetCT = true;

            var success = func(options.success);
            var fail = func(options.failCall);
            var before = func(options.before);
            var data = options.data; //post data
            var params = options.params || {}; //params url中的参数
            params.func = id;
            params.sid = window.sid || null;

            //增加一个前置回调，用来完整的反转控制ajax请求流程
            before(options);

            var url = options.url || URL.serviceUrl;

            url = util.obj2Url(params, url);

            var xhrOptions = {
                url: url,
                async: options.async,
                method: method,
                head: head,
                noSetCT: noSetCT,
                resType: resType,
                //                heads: {
                //                    'Accept': 'application/xml; charset=UTF-8'
                //                },
                callback: function (resp, ru) {
                    tip(false);
                    if ($jq.type(resp) == 'string') {
                        eval('resp=' + resp);
                    }
                    if (t._beforeResp(resp)) {
                        success(resp);
                    } else {
                        if (resp.summary) {
                            tip(resp.summary, 2);
                        }
                        fail(resp, ru);
                    }
                },
                failCall: function (error, ru) {
                    tip(false);
                    fail(error, ru);
                }
            };
            xhrOptions.data = isJson ?
                              JSON.stringify(data) : serializePostData(data);
            ajax.request(xhrOptions);
            //            } catch (error) {
            //                ch("Addr.dataApi", error);
            //                CC.hideMsg();
            //            }
        },

        sequentialData: function (data) {
            var result = {};
            result.items = $jq.map(data, function (item) {
                var ditem = {
                    func: item.func
                };
                ditem['var'] = item;
                delete ditem['var']['func'];
                return ditem.func ? ditem : null;
            });
            return result;
        },

        getCorpId: function () {
            var gMain = window.gMain || {};
            return gMain.corpId;
        },

        //--------list---------
        /**
         * 获取联系人列表
         * @param type {boolean}
         * @param options {object}
         */
        getContact: function (type, options) {
            var t = this;
            var fid = funcId.contact;
            if ($jq.type(type) == 'object') {
                options = type;
                type = null;
            }
            if (type) {
                fid = funcId.comMembers;
            }
            var successCallback = func(options.success);
            var data = {
//                                "data_type": 1,
                "invalid_linkman_flag": 1
            };

            options.data = $jq.extend(true, data, options.data);

            options.success = function (resp) {
                if (isOk(resp.code)) {
                    //执行回调
                    successCallback(resp);
                } else {
                    //failure
                    ajax.error('getContact');
                }
            };
            this.dataApi(fid, options);
        },

        /**
         * 获取所有联系人详情
         * @param {function} success 成功回调
         */
        getAllUserInfo: function (success) {
            var t = this;
            var opt = {
                data: {
                    "data_type": 1,
                    "invalid_linkman_flag": 1
                },
                success: function (resp) {
                    var originUsers = resp['var'];
                    if (originUsers.length) {
                        var userModel = new PersonalContact(originUsers);
                        var users = userModel.getContact();
                        func(success)(users);
                        cache.setUsers(users);
                    } else {
                        tip(Lang.Addr.a0101, 2);
                    }
                }
            };
            t.dataApi(funcId.contact, opt);
        },

        /**
         * 获取具体联系人详情
         * @param {Array|string} id  联系人id，只有一个id时可传string
         * @param {function} success 成功回调
         */
        getUserInfo: function (id, success) {
            if (!id) {
                return;
            }
            if (!$jq.isArray(id)) {
                id = [id];
            }

            var t = this, cacheUsers = cache.getUsers(id);
            $jq.each(cacheUsers.nid, function (i, nid) {
                cacheUsers.nid[i] = Number(nid);
            });
            //缓存中找不到，就取查数据库
            if (cacheUsers.nid.length) {
                var opt = {
                    data: {
                        "data_type": 1,
                        "linkman_id": cacheUsers.nid,
                        "invalid_linkman_flag": 1
                    },
                    success: function (resp) {
                        var originUsers = resp['var'];
                        if (originUsers.length) {
                            var userModel = new PersonalContact(originUsers);
                            var users = userModel.getContact();
                            func(success)(mergeArray(users, cacheUsers.users));
                            cache.setUsers(users);
                        } else {
                            tip(Lang.Addr.a0101, 2);
                        }
                    }
                };
                t.dataApi(funcId.contact, opt);
            } else {
                if (cacheUsers.users.length) {
                    func(success)(cacheUsers.users);
                } else {
                    tip(Lang.Addr.a0101, 2);
                }
            }
        },

        /**
         * 从contact中获取联系人
         * @param {String|Array} id 单个联系人id或id数组
         * @return {Array|undefined}
         */
        getUserFromContact: function (id) {
            if (!id) {
                return;
            }
            if (!$jq.isArray(id)) {
                id = [id];
            }
            return this.contact.getUsers(id);
        },

        /**
         * 获取分组联系人列表
         * @param groupId 分组id
         * @return {array}
         */
        getGroupMembers: function (groupId) {
            var t = this;
            var contact = [];
            if (t.contact) {
                contact = t.contact.getContact();

            }
            var result = $jq.map(contact, function (user) {
                var groups = user.groupId;
                if (util.inArray(groupId, groups)) {
                    return user;
                }
                return null;
            });
            return result;
        },

        /**
         * 删除联系人数据
         * @param userIds
         */
        delContact: function (userIds) {
            var t = this;
            if (!$jq.isArray(userIds)) {
                userIds = [userIds];
            }
            var groups = [];

            t.contact.del(userIds);
            t.updateTotal();
            t.updateGroupByContact();
        },

        /**
         * 添加联系人数据
         * @param user
         */
        addContact: function (user) {
            if (!user) {
                return;
            }
            var t = this;
            if ($jq.type(user) != 'array') {
                user = [user];
            }
            var users = new PersonalContact(user);
            if (t.contact) {
                t.contact.add(users.getContact());
                t.updateTotal();
                t.updateGroupByContact();
            }
        },

        /**
         * 修改联系人（contact）
         * 非细节替换，而是整个用户替换，因此需要注意传递过来的user数据应该是全量的联系人资料
         * @param {Array|Object} users 修改后的联系人
         */
        modifyContact: function (users) {
            var t = this;
            if (!$jq.isArray(users)) {
                users = [users];
            }
            $jq.each(users, function (i, user) {
                t.contact.modify(user);
            });
            t.updateGroupByContact();
        },

        /**
         * 删除分组时更新联系人
         * @param gid
         */
        updateContactByDelGroup: function (gid) {
            var t = this;
            var users = [];
            var contact = t.contact.getContact();
            $jq.each(contact, function (index, user) {
                var groups = user.groupId;
                for (var i = 0; i < groups.length; i++) {
                    var id = groups[i];
                    if (id == gid) {
                        groups.splice(i, 1);
                        break;
                    }
                }
                user.groupId = groups;
                users.push(user);
            });
            t.modifyContact(users);
        },

        updateTotal: function () {
            this.total = this.contact.getContact().length;
        },

        /**
         * 初始化联系人列表，设置联系人姓名,设置显示手机号码等
         * @param {Array|object} users
         * @return {*}
         */
        initContact: function (users) {
            return new PersonalContact(users);
        },

        /**
         * 合并重复联系人
         * @param {String | int} type
         * @param {String} value
         * @param {Function} success
         */
        combineContact: function (type, value, success) {
            var t = this,
                fid = funcId.group,
                key = fields["" + type];

            if (value != null) {
                var view = cache.getView(key);
                if (view) {
                    var users = view.users,
                        values = value.split(",");

                    //var ids = [];
                    for (var i = 0, l = values.length; i < l; i++) {
                        var val = values[i], ids = uids(users[val]);
                        //ids = mergeArray(ids,uids(users[values[i]]));
                        t.getUserInfo(ids, function (u) {
                            var delete_ids = [];
                            //获取合并后的结果，汇总更新数据，和删除数据
//                            u = new PersonalContact(u);
                            var data = t.getCombineModel(u);
                            delete_ids = mergeArray(delete_ids, data.dids);
                            t.combineUsers(data.fuser, delete_ids, type, success);
                        });
                    }
                }
            }
        },

        combineUsers: function (user1, user2Id, type, handler, success) {
            var t = this;
            user1 = user1 || {};
            user2Id = user2Id || 0;
            var addData = exchangeModified(user1);
            t.modify(addData);
            //删除合并后的数据
            t.del(user2Id, {
                success: function () {
                    t.delContact(user2Id);
                    tip(Lang.Addr.a0055);
                    t.showCombineContact(type, handler);
                    func(success)();
                }
            });

            function exchangeModified(user) {
                var result = {};
                var map = {
                    'id': 'id',
                    'first_name': 'name',
                    'image_path': 'image_path',
                    'isvip': 'vip',
                    'telephone': 'telephone',
                    'uin': 'uin',
                    'birthday': 'birthday',
                    'company_name': 'companyName',
                    'company_zip': 'zip',
                    'sex': 'sex',
                    'position': 'position',
                    'home_address': 'address',
                    'fq_number': 'fax',
                    'group_id': 'groupId',
                    'name_first_char': 'nameFirstChar',
                    'email': 'emails',
                    'mobile_number': 'mobiles',
                    'memo': 'memo'
                };

                for (var key in map) {
                    var objKey = map[key];
                    if ($jq.type(user[objKey]) == 'string') {
                        result[key] = util.decodeHTML(user[objKey]);
                    } else {
                        result[key] = user[objKey];
                    }
                }

                //mix data
                var mix = {
                    im: user.im,
                    custom: user.custom
                };
                result['mix'] = JSON.stringify(mix);

                return result;
            }
        },

        /**
         * 渲染个人联系人列表
         * @param options {object}
         * {
         *  container     {object}    列表容器
         *  [type] {boolean}      数据类型
         *  [data]        {object}    post数据
         *  [list]        {array}     数据，如果没有则默认为全部联系人
         *  [page]        {number}    渲染的页数，默认为第一页
         *  [success]     {function}  渲染成功回调
         *  [pageSize]    {number}    每页数量
         *  }
         */
        renderList: function (options) {
            var t = this;
            var list = options.list || [];
            if (t.contact && t.contact.getContact) {
                list = t.contact.getContact();
            }
            options.page = options.page || 1;
            options.pageSize = options.pageSize;
            options.success = options.success || noop;
            if (!options.container || !options.container.length) {
                return;
            }

            if (list.length) {
                t._render(options);
                return func(options.success)();
            }

            t.getContact(options.type, {
                data: options.data,
                param: options.param,
                success: function (resp) {
                    var data = resp['var'];
                    t.contact = new PersonalContact(data);
                    t.initRecentContact(resp['last_contact_id']);
                    t._render(options);
                }
            });
        },

        /**
         * 重新刷新视图
         */
        reRenderView: function () {
            $jq(document).trigger('rerender');
        },
        reRender: function () {
            var t = this;
            var currentView = t.currentView;
            if (!currentView) {
                return;
            }
            t._render(currentView);
        },

        /**
         * 创建最近联系人数据模型
         * @param {Array} data
         */
        initRecentContact: function (data) {
            if (!data) {
                return;
            }
            if (!$jq.isArray(data)) {
                data = [data];
            }
            this.recentContact = data;
            $jq(document.body).trigger('recentContactReady');
        },

        /**
         * 更新最近联系人数据
         * @param id {array|string}
         * @param [del] {boolean} 删除则为true
         */

        updateRecentContact: function (id, del) {
            if (!id) {
                return;
            }
            del = Boolean(del);
            if (!$jq.isArray(id)) {
                id = [id];
            }
            var t = this;
            if (del) {
                t.recentContact = $jq.map(t.recentContact, function (rid){
                    return util.inArray(rid, id) ? null : rid;
                });
            } else {
                t.recentContact = util.uniqueArray(id.concat(t.recentContact));
            }
            t.updateGroup();
        },

        getClientGroup: function (success) {
            var t = this;
            var options = {
                data: {
                    corp_id: this.getCorpId(),
                    type: 1
                },
                success: function (resp) {
                    if (isOk(resp['code'])) {
                        t.clientGroups = new ClientGroup(resp['var']);
                        func(success)(t.clientGroups.getData(), resp);
                    }
                }
            };
            this.dataApi(funcId.clientGroupQuery, options);
        },

        /**
         * 获取客户联系人列表
         * @param {int|function} [groupId]  分组
         * @param {function} [success] 成功回调
         */
        getClients: function (groupId, success) {
            if (typeof groupId === 'function') {
                success = groupId;
                groupId = 0;
            }
            var t = this;
            var options = {
                data: {
                    corp_id: t.getCorpId(),
                    group_id: groupId
                },
                success: function (resp) {
                    if (isOk(resp['code'])) {
                        var groups = t.clientGroups.getData();
                        t.clients = new ClientUser(resp['var'], groups);
                        func(success)(t.clients.getData(), resp);
                    }
                }
            };
            this.dataApi(funcId.clientQuery, options);
        },

        /**
         * 渲染客户通讯录列表
         * @param {object|string} container
         * @param {array} clients
         * @param {int|function} [page]
         * @param {function} [success]
         */
        renderClientContact: function (container, clients, page, success) {
            var t = this;
            var id = 'clientList';
            if ($jq.isFunction(page)) {
                success = page;
                page = 1;
            }
            clients = clients || t.clients.getData();
            container = $jq(container);
            var total = clients.length;
            var pageSize = 20;
            page = page || 1;
            container.data('list', clients);
            var pager = new Pager({
                container: container,
                current: page,
                total: total,
                size: pageSize,
                clickCallback: function (e, to) {
                    t.renderClientContact(container, container.data('list'), to, success);
                    return false;
                }
            });
            var data = {
                list: clients,
                pager: pager
            };
            t.renderTemplate(id, data, function (html) {
                container.html(html);
                func(success)(html, clients);
            });
        },

        renderClientDetail: function (id, success) {
            var list = this.clients;
            var user = list.getUser(id);

            this.renderTemplate('clientInfo', {user: user}, function (html) {
                success(html, user);
            });
        },

        getLocalClient: function (id) {
            if (id) {
                var clients = this.clients.getData();
                var result = {};
                for (var i = 0, len = clients.length; i < len; i++) {
                    var client = clients[i];
                    if (client.id == id) {
                        result = client;
                    }
                }
                return result;
            }
        },

        /**
         * 获取分页html
         * @param list
         * @param current
         * @param size
         * @param [container]
         * @param turnPage
         * @return {*}
         */
        getPager: function (list, current, size, container, turnPage) {
            var pager = new Pager({
                total: list.length,
                current: current,
                size: size,
                container: container,
                clickCallback: turnPage
            });
            return pager;
        },

        alphabetFilter: function (letter, container, success) {
            var t = this, result = [];
            var list = t.contact.getContact() || [];
            if (!list.length) {
                return;
            }

            t._render({
//                list: result,
                condition: {
                    alpha: letter
                },
                container: container,
                success: function () {
                    func(success)(result);
                }
            });

        },

        getAddrAlphaCounts: function (corpId, type, success) {
            var t = this;
            type = type || 0;
            var countCache = t.getAlphaCount(type);
            if (countCache) {
                return func(success)(countCache, type);
            }
            var did = 'addr:charUserCountQuery';
            var corpId = corpId || t.getCorpId();

            this.dataApi(did, {
                data: {
                    corpId: corpId,
                    addr_type: type
                },
                success: function (response) {
                    if (isOk(response['code'])) {
                        t.setAlphaCount(response['var'], type);
                        var counts = t.getAlphaCount(type);
                        func(success)(counts, type);
                    }
                },
                failCall: function (err) {
                    func(success)({}, type);
                }
            });
        },

        setAlphaCount: function (data, type) {
            data = data || [];
            var result = {};
            for (var i = 0; i < data.length; i++) {
                var letterObj = data[i];
                var letter = (letterObj['letter']).toUpperCase();
                result[letter] = letterObj['count'];
            }
            switch (type) {
            case 0:
                this.entAlphaCount = result;
                break;
            case 1:
                this.clientAlphaCount = result;
            }
        },

        getAlphaCount: function (type) {
            var count;
            switch (type) {
            case 0:
                count = this.entAlphaCount;
                break;
            case 1:
                count = this.clientAlphaCount;
            }
            return count;
        },

        /**
         * 搜索列表
         * @param text 待搜索文字
         * @param container 列表容器
         * @param success 成功回调
         * @param flag 通讯录类型
         * @param {string} corpId
         */
        search: function (text, container, success, flag, corpId) {
            text = $jq.trim(text);
            tip(Lang.Addr.a0130, 1);
            if (!text) {
                return;
            }
            //flag 判断搜索范围，0 为企业通讯录，1为个人通讯录
            flag = flag || 0;
            container.data('kw', text);
            container.data('type', flag);
            if (flag == 1) {
                this.searchInPersonal(text, container, success);
            } else if (flag == 2) {
                this.searchInClient({key: text}, container, 1, success);
            } else {
                this.searchInCom(text, container, 1, corpId, success);
            }

        },

        searchInClient: function (data, container, page, success, temp) {
            var t = this;
            page = page || 1;
            var pageSize = 1000;
            var start = (page - 1) * pageSize + 1;
            var searchFlag = page == 1 ? 1 : 0;
            data = $jq.extend({
//                key: kw,
                start: start,
                total: pageSize,
                search_flag: searchFlag
            }, data);
            var succ = function (resp) {
                var groups = [];
                if (t.clientGroups) {
                    groups = t.clientGroups.getData();
                }
                var clientUsers = new ClientUser(resp['var']['client_list'], groups);
                var list = clientUsers.getData();
                var total = resp['client_count'] || 0;
                var pager = new Pager({
                    current: page,
                    total: total,
                    size: pageSize,
                    clickCallback: function (e, to) {
                        t.searchInClient(data, container, to, success);
                        return false;
                    }
                });
                t.renderTemplate('cclist', {
                    list: list,
                    pager: pager.html
                }, function (html) {
                    container.html(html);
                    func(success)(list, html);
                });
            };
            if (temp) {
                succ = success;
            }
            var options = {
                data: data,
                success: succ
            };
            this.dataApi(funcId.clientSearch, options);
        },

        searchInPersonal: function (kw, container, success) {
            var result = [];
            var t = this;
            var pRange = ['name', 'emails', 'mobiles', 'name_full_char'];
            var contact = t.contact.getContact();
            var plist = t.matchWord(kw, contact, pRange);

            var groupsName = {};
            var groupsShortName = {};
            $jq.each(t.groups, function (index, item) {
                groupsName[item.id] = item.name;
                groupsShortName[item.id] = item.shortName;
            });

            t.renderTemplate('pslist',
                {
                    keyword: kw,
                    plist: plist,
                    groupsName: groupsName,
                    groupsShortName: groupsShortName
                },
                function (html) {
                    container.html(html);
                    t.bindDrag(container);
                    tip(false);
                    func(success)(html);
                });

            return result;
        },

        searchInCom: function (kw, container, page, corpId, success) {
            var t = this;
            page = page || 1;
            if ($jq.isFunction(corpId)) {
                success = corpId;
                corpId = t.getCorpId();
            }
            var pageSize = 1000;
            var start = (page - 1) * pageSize + 1;
            var searchFlag = page == 1 ? 1 : 0;
            var data = {
                content: kw,
                start: start,
                total: pageSize,
                corpId: corpId,
                search_flag: searchFlag
            };
            this.searchComUsers(corpId, data, function (list, total) {
                var pager = new Pager({
                    current: page,
                    total: total,
                    size: pageSize,
                    clickCallback: function (e, to) {
                        t.searchInCom(kw, container, to, corpId, success);
                        return false;
                    }
                });
                t.renderTemplate('cslist', {
                    list: list,
                    pager: pager.html,
                    enterpriseName: enterpriseName || ''
                }, function (html) {
                    container.html(html);
                    func(success)(list, html);
                });
            });
        },

        /**
         *
         * @param {string}  text
         * @param {Array}   searchList
         * @param {Array}   [range]
         * @return {Array}
         */
        matchWord: function (text, searchList, range) {
            range = range;
            if (!range || !range.length) {
                return [];
            }

            searchList = searchList || [];

            var result = $jq.map(searchList, function (item) {
                return !text || match(item, text, range) ? item : null;
            });

            function match(item, text, field) {
                var split = '&';
                var matchList = getMatchText(item, field, split);
                text  = encodeURIComponent(text);
                text = text.replace(new RegExp(split, 'g'), '');
                var pattern = new RegExp(text, 'i');
                return pattern.test(matchList);
            }

            function getMatchText(source, field, split) {
                var txt = [];
                $jq.each(field, function (index, val) {
                    var v = encodeURIComponent(source[val]);
                    if (v) {
                        switch ($jq.type(v)) {
                        case 'array':
                            v = v.join(split);
                            break;
                        case 'string':
                            break;
                        default:
                            v = '';
                        }
                        txt.push(v);
                    }
                });
                return txt.join(split);
            }

            return result;
        },

        getClientByGroup: function (gid) {
            var clients = this.clients.getData() || {};
            return $jq.map(clients, function (client) {
                var groups = client['group_id'];
                if (util.inArray(gid, groups)) {
                    return client;
                }
                return null;
            });
        },

        getInvalidCount: function () {
            return this.getInvalidList().length;
        },

        getInvalidList: function () {
            var contact = this.contact && this.contact.getContact ?
                          this.contact.getContact() : [];
            var result = $jq.map(contact, function (user) {
                return user.invalid ? user : null;
            }) || [];
            return result;
        },

        //--------template-------

        template: {},


        /**
         * 获取模板
         * @param id 模板id
         * @param options 成功回调
         */
        getTemplate: function (id, options) {
            var t = this;

            var success = options.success;
            options.success = function (template) {
                t.template[id] = template;
                success(template);
            };
            //callback if cache
            if (t.template[id]) {
                success(t.template[id]);
                return;
            }
            var r = util.gRnd();
            var urlPattern = window.resourceURL + '/template/{0}.html?r={1}';
            var url = util.format(urlPattern, id, r);
            $jq.ajax($jq.extend(true, {
                url: url,
                dataType: 'text',
                error: function (error) {
                    tip(error);
                }
            }, options));
        },

        /**
         * 渲染模板
         * @param id 模板id
         * @param [data] 模板数据
         * @param [success] 成功回调
         */
        renderTemplate: function (id, data, success) {
            this.getTemplate(id, {
                success: function (template) {
                    var html = template;
                    var type = $jq.type(data);
                    if (type === 'function') {
                        success = data;
                        data = {};
                    }

                    data.encodeHTML = util.encodeHTML;
                    data.resourceURL = resourceURL || window.location.host;
                    data.permission = gPower || {};
                    data.Lang = Lang.Addr || {};

                    html = window.tmpl(html, data);
                    func(success)(html, template, data);
                }
            });
        },

        //--------contact manager--------
        /**
         * 显示个人联系人详情
         * @param userId
         * @param callback
         */
        showUserInfo: function (userId, callback) {
            var t = this,
                data = {};

            t.getUserInfo(userId, function (users) {
                hander(users);
            });

            function hander(users) {
                data.groups = function (groupId) {
                    for (var i = 0; i < t.groups.length; i++) {
                        var group = t.groups[i];
                        if (group.id == groupId) {
                            return group.name;
                        }
                    }
                };
//                var user = new Friend(users[0]);
//                data.user = user.getFriend();
                data.user = users[0];
                t.renderTemplate('showInfo', data, function (html) {
                    callback(html, data.user);
                });
            }
        },

        /**
         * 显示公司联系人详情
         * @param corpId
         * @param cId
         * @param callback
         */
        showComInfo: function (corpId, cId, callback) {
            var t = this,
                data;
            t.getComUserInfo(corpId, cId, function (user) {

                if (user) {

                    user.enterprise = window.enterprise || '';
                    t.renderTemplate('cominfo', user, function (html) {
                        callback(html, user);
                    });
                } else {
                    tip(Lang.Addr.a0101, 2);
                }
            });
        },
        /**
         * 返回联系人合并对象
         * @param users
         * @returns {*}
         */
        getCombineModel: function (users) {
            if (!users) return null;
            users.sort(function (a, b) {return a.id < b.id ? 1 : -1});
            var data = {
                    users: users,
                    fuser: {},
                    dids: []
                },
                cuser = data.users[0];
            data.fuser = util.clone(cuser);

            for (var i = 1, l = users.length; i < l; i++) {
                var user = users[i];
                for (var pro in user) {
                    var item = user[pro],
                        citem = data.fuser[pro],
                        temp;

                    if (pro == "id") {
                        temp = citem;
                    } else {
                        if (item instanceof Array) {
                            temp = util.uniqueArray(mergeArray(citem, item));
                        } else {
                            temp = citem || item;
                        }
                    }
                    data.fuser[pro] = temp;
                }
                data.dids.push(user.id);
            }
            return data;
        },
        /**
         * 显示合并详情
         * @param {Int|Sring} type
         * @param {String} value 重复联系人分组标示
         * @param callback
         */
        showCombineDetail: function (type, value, callback) {
            var t = this,
                key = fields["" + type];

            var view = cache.getView(key);
            if (view) {
                t.getUserInfo(uids(view.users[value]), function (users) {
//                    var users = new PersonalContact(u);
                    var data = t.getCombineModel(users);
                    if (data) {
                        data.groups = function (groupId) {
                            for (var i = 0; i < t.groups.length; i++) {
                                var group = t.groups[i];
                                if (group.id == groupId) {
                                    return group.name;
                                }
                            }
                        };
                        t.renderTemplate('combineDetail', data, function (html) {
                            callback(data, html);
                        });
                    }
                });
            }
        },
        /**
         * 显示SMS窗口
         * @param {string} recieverNumber 接收手机号码
         * @param {string} title
         * @param {Function} callback
         */
        showSMS: function (recieverNumber, title, callback) {
            recieverNumber = recieverNumber || '';
            title = title || '';
            var t = this,
                data = {
                    receiverNumber: recieverNumber,
                    title: title
                };

            t.renderTemplate('sendMsg', data, callback);
        },
        /**
         * 获取邮件签名列表
         * @param {Object} options
         */
        getSignatures: function (options) {
            var t = this,
                success = options.success;
            options.success = function (resp) {
                if (isOk(resp.code)) {
                    var defaultSign = {
                        content: ''
                    };
                    var data = resp['var'];
                    for (var i = 0, len = data.length; i < len; i++) {
                        var item = data[i];
                        if (item.isDefault) {
                            defaultSign = item;
                            break;
                        }
                    }
                    func(success)(defaultSign);
                }
            };
            t.dataApi(funcId.getSignatures, options);
        },

        /**
         * 显示Email窗口
         * @param {String} to
         * @param {Function} callback
         */
        showEmail: function (to, callback) {
            var t = this,
                data = {
                    to: to
                };
            t.renderTemplate('sendEmail', data, callback);
        },
        /**
         * 显示，填充合并联系人窗口
         * @param type 合并类型 {1:按照姓名,2:按照Email,3:按照手机号码}
         * @param callback 成功回调
         */
        showCombineContact: function (type, callback) {
            if (!type) return null;
            var t = this,
                view = fields["" + type],
                data = {
                    type: type,
                    view: view,
                    list: t._getListByKey(view)
                };
            t.renderTemplate('combine', data, callback);
        },

        /**
         * 增加联系人
         * @param user {Array|Object}
         * @param options
         */
        add: function (user, options) {
            var t = this;
            if (!user) {
                return;
            }
            if (!util.isArray(user)) {
                user = [user];
            }
            var success = options.success;
            options.success = function (resp) {
                var nUsers = resp['var'];
                var newUsers = $jq.map(nUsers, function (nuser, index) {
                    nuser.id = nuser['linkman_id'];
                    return $jq.extend(transformUser(user[index]), nuser);
                })
                t.addContact(newUsers);

                //更新contact数据及列表视图
                t.reRenderView();
                func(success)(resp);

                function transformUser (u) {
                    if (u.email && u.email.length) {
                        u.email = $jq.map(u.email, function (email) {
                            return {
                                name: email,
                                status: 0
                            };
                        });
                    }

                    return u;
                }
            }
            options.data = {
                opType: "add",
                 repeat_operate_type: 1,
                users: user
            };
            this.dataApi(funcId.contactManager, options);
        },

        /**
         * 删除指定联系人
         * @param {array|string} id    待删除的联系人的id
         * @param {object} options 配置项
         *  {
         *      success {function} 删除成功回调
         *  }
         */
        del: function (id, options) {
            var t = this;
            var fid = funcId.contactManager;
            if (!id) {
                return;
            }
            if (!$jq.isArray(id)) {
                id = [id];
            }
            var data = $jq.map(id, function (item) {
                return {id: parseInt(item)};
            });
            var opt = {
                data: {
                    opType: "delete",
                    id: data
                },
                //                data: {
                //                  id: id,
                //                  del: 1
                //                },
                success: function (resp) {
                    //删除成功
                    if (isOk(resp.code)) {
                        t.delContact(id);
                        //更新contact数据及列表视图
                        t.reRenderView();
                        cache.del(id);
                        func(options.success)(resp);
                    }
                }
            };

            this.dataApi(fid, opt);
        },

        /**
         * 因user info在上传的时候参数是很分散的，所以这里要考虑extend到data中去
         * @param {Object} user 单个用户信息 @see this.contact
         *  {
         *      id {string}
         *      email {string}
         *      mobile_number {string}
         *      ...
         *  }
         * @param {function} success
         */
        modify: function (user, success) {
            if (!user) {
                return;
            }
            if (!user.id) {
                return tip(Lang.Addr.a0100, 2);
            }
            var t = this;
            var modifyData = {
                func: funcId.contactManager,
                opType: 'update',
                users: [user]
            };
            var id = user.id;
            var cuser = t.getUserFromContact(id)[0];
            var data = getModifyData(cuser, user, modifyData);

            var opt = {
                data: data,
                success: function (resp) {
                    var extendData = resp['var'][0];
                    user.id = extendData.linkman_id;
                    user.email = fixedValidEmail(cuser.emailObj, user.email);
                    var newUser = $jq.extend(true, user, extendData);
                    var friend = new Friend(newUser);
                    t.modifyContact(friend.getFriend());
                    //更新contact数据及列表视图
                    t.reRenderView();
                    cache.del(newUser.id);
//                    tip('合并联系人成功');
                    func(success)(resp);

                    function fixedValidEmail (oldEmails, newEmails) {
                        return $jq.map(newEmails, function (email) {
                            var obj = {
                                name: email,
                                status: 0
                            };

                            $jq.each(oldEmails, function (index, oldEmail) {
                                if (email && email == oldEmail.name) {
                                    obj.status = oldEmail.status;
                                    return false;
                                }
                            });
                            return obj;
                        });
                    }
                }
            };
            this.dataApi(funcId.sequential, opt);

            function getModifyData(cuser, user, modifyData) {
                var temp = [];
                var cg = cuser.groupId, ug = user.group_id || [];
                //分组有改变
                var ad = getDiff(ug, cg);
                var dd = getDiff(cg, ug);
                if (ad && ad.length) {
                    var addGroupData = {
                        func: funcId.contactGroupAdmin,
                        'group_list': ad,
                        'linkman_id': id,
                        opType: 'add'
                    };
                    temp.push(addGroupData);
                }
                if (dd && dd.length) {
                    var delGroupData = {
                        func: funcId.contactGroupAdmin,
                        'group_list': dd,
                        'linkman_id': id,
                        opType: 'delete'
                    };
                    temp.push(delGroupData);
                }
                if (!(ad && ad.length || dd && dd.length)) {
                    return modifyData;
                }
                temp.push(modifyData);

                return t.sequentialData(temp);
            }

            function getDiff(arr1, arr2) {
                return $jq.map(arr1, function (item) {
                    return util.inArray(item, arr2) ? null : item;
                });
            }
        },

        getMyCorpId: function () {
            return  window.gMain.corpId;
        },

        //--------group----------

        /**
         * 根据id获取分组
         * @param {Array|number} id 分组id
         * @return {object|Array|undefined}
         */
        getGroupsById: function (id) {
            var groups = [];
            if (!id) {
                return;
            }
            if (!$jq.isArray(id)) {
                id = [id];
            }
            for (var i = 0; i < this.groups.length; i++) {
                var g = this.groups[i];
                if (util.inArray(g.id, id)) {
                    if (id.length == 1) {
                        return g;
                    } else {
                        groups.push(g);
                    }
                }
            }
            return groups;
        },

        /**
         * 增加或减少分组成员数
         * @param {Array|number} gid
         * @param {number} num
         */
        updateGroupCount: function (gid, num) {
            var t = this;
            if (!gid) {
                return;
            }
            if (!$jq.isArray(gid)) {
                gid = [gid];
            }
            num = num || 0;
            $jq.each(t.groups, function (index) {
                for (var i = 0; i < gid.length; i++) {
                    var g = gid[i];
                    if (g == t.groups[index].id) {
                        t.groups[index].linkman_count += num;
                    }
                }
            });

            t.updateGroup();
        },

        showListByGroup: function (id, container, success) {
            var name = 'group_id';
            this.showListByCondition(id, name, container, success);
        },

        showRecentList: function (container, success) {
            var t = this;
            var options = {
                container: container,
                success: success,
                condition: {
                    recent: true
                }
            };
            t._render(options);
        },
        showInvalidList: function (container, success) {
            var t = this;
            var options = {
                container: container,
                success: success,
                condition: {
                    invalid: true
                }
            };
            t._render(options);
        },
        showListByCondition: function (id, condition, container, success, type) {
            var t = this;
            var options = {
                container: container,
                success: success,
                type: type
            };
            if (type) {
                options.condition ={
                    dept: id
                };
            } else {
                options.condition = {
                    group: id
                };
            }
            t._render(options);
        },
        showListByDept: function (deptId, container, success) {
            var t = this;
            var type = 1;
            var options = {
                container: container,
                type: type,
                success: success,
                condition: {
                    dept: deptId
                }
            };
            t._render(options);
        },
        /**
         * 管理分组，包括删除，增加，和编辑，这个接口是共用接口，制动判断管理类型
         * @param options xhr配置
         *  {
         *      data {object}
         *          ｛
         *              [group_id] {number} 分组id
         *              [group_name] {string} 分组名称
         *          ｝
         *      ...
         *  }
         */
        manageGroup: function (options) {
            var t = this;
            options.data = options.data || {};
            var name = options.data.group_name;
            var id = options.data.group_id;
            var type = 'add';
            if (id) {
                type = name ? 'update' : 'delete';
            }
            options.data.opType = type;
            var success = func(options.success);
            options.success = function (resp) {
                name = util.encodeHTML(name);
                switch (type) {
                case 'add':
                    id = resp['var'];
                    t.addLocalGroup(id, name);
                    break;
                case 'update':
                    t.modifyGroupName(id, name);
                    break;
                case 'delete':
                    t.delLocalGroup(id);
                    break;
                }
                t.reRenderView();
                success(resp);
            };
            this.dataApi(funcId.group, options);
        },

        modifyGroup: function (options) {
            var t = this;
            var data ={
                id: null,
                name: null,
                addMembers: [],
                delMembers: []
            };
            var sendData = [];
            $jq.extend(data, options.data);

            if (!data.id) {
                return tip(Lang.Addr.a0211, 2);
            }

            if (!data.name) {
                return tip(Lang.Addr.a0039, 2);
            }

            if (t.addr.checkRepeatGroup(data.name)) {
                return tip(Lang.Addr.a0167, 2);
            }

            //分组名称无变更
            if (t.getGroupName(data.id) != data.name) {

            }

            if (data.addMembers.length) {

            }

            if (data.delMembers.length) {

            }

        },

        /**
         * 删除分组
         * @param {String|Number} groupId 分组id
         * @param {Object} [options] 其他xhr配置，不包括data
         */
        delGroup: function (groupId, options) {
            if (!groupId) {
                return;
            }
            var t = this;
            groupId = parseInt(groupId);
            options = options || {};
            options.data = {
                group_id: groupId
            };

            t.manageGroup(options);
        },
        /**
         * 触发更新分组的通知
         */
        updateGroup: function () {
            $jq(document.body).trigger('updateGroup');
        },

        checkRepeatGroup: function (name) {
            var t = this;
            var result = false;
            if (name) {
                $jq.each(t.groups, function (index, group) {
                    if (group.name && (group.name.toLowerCase() == name.toLowerCase())) {
                        result = true;
                        return true;
                    }
                });
            }

            return result;
        },

        /**
         * 添加分组（客户端）
         * @param {number} id
         * @param {string} name
         * @param {number} [count]
         */
        addLocalGroup: function (id, name, count) {
            if (!id || !name) {
                return;
            }
            var t = this;
            var group = {};
            count = count || 0;
            group.id = id;
            group.name = name;
            group.linkman_count = count;
            group = t.setGroupShortName(group)[0];
            t.groups.unshift(group);
            t.updateGroup();
        },
        /**
         * 删除分组（客户端）
         * @param id
         */
        delLocalGroup: function (id) {
            var t = this;
            $jq.each(t.groups, function (index, item) {
                if (item.id == id) {
                    t.groups.splice(index, 1);
                    t.updateGroup();

                    t.delUsersFromGroup(null, id);
                    return false;
                }
            });
        },
        /**
         * 修改分组名称
         * @param id {number} 分组id
         * @param name {string} 分组名称
         */
        modifyGroupName: function (id, name) {
            var t = this;
            if (!id || !name) {
                return;
            }
            $jq.each(t.groups, function (index, item) {
                if (item.id == id) {
                    t.groups[index].name = name;
                    t.groups[index] = t.setGroupShortName(t.groups[index])[0];
                    t.updateGroup();
                    return false;
                }
            });
        },

        /**
         * 变更分组成员数
         * @param groupId
         * @param count
         */
        updateGroupMembersCount: function (groupId, count) {
            if (!groupId) {
                return;
            }
            var t = this;
            $jq.each(t.groups, function (index, group) {
                if (groupId == group.id) {
                    t.groups[index].linkman_count = count;
                    t.updateGroup();
                    return;
                }
            });
        },

        manageGroupMembers: function (type, ids, gid, success) {
            var t = this;
            if (!ids || !ids.length || !gid) {
                return;
            }
            if ($jq.type(ids) !== 'array') {
                ids = [ids];
            }
            ids = $jq.map(ids, function (item) {
                return parseInt(item);
            });
            var options = {};
            options.data = {
                opType: type,
                linkman_list: ids,
                group_id: parseInt(gid)
            };
            options.success = function (resp) {
                func(success)(resp);
            };
            this.dataApi(funcId.groupMemberAdmin, options);
        },

        addGroupMembers: function (ids, gid, success) {
            var type = 'add';
            var t = this;
            var s = function (resp) {
                t.addUsersToGroup(ids, gid);
                t.reRenderView();
                func(success)(resp);
            };
            this.manageGroupMembers(type, ids, gid, s);
        },
        delGroupMembers: function (ids, gid, success) {
            var type = 'delete';
            var t = this;
            var s = function (resp) {
                t.delUsersFromGroup(ids, gid);
                t.reRenderView();
                func(success)(resp);
            };
            this.manageGroupMembers(type, ids, gid, s);
        },

        /**
         * 获取分组
         * @param [success]
         */
        getGroup: function (success) {
            var t = this;

            function callback () {
                $jq(document.body).trigger('groupReady');
                func(success)(t.groups);
            }
            if (t.groupInited) {
                return callback();
            }
            var id = funcId.groupList;
            var options = {};
            options.success = function (resp) {
                if (isOk(resp.code)) {
                    t.total = resp['linkman_count'] || 0;
                    t._initGroups(resp['var']);
                    t.groupInited = 1;
                    callback(resp);
                }
            };
            this.dataApi(id, options);
        },

        _initGroups: function (groups) {
            var t = this;
            var groups = t.setGroupShortName(groups);
            t.groups = groups;
            t.updateGroup();
        },

        /**
         * 获取分组名称
         * @param id
         * @return {*}
         */
        getGroupName: function (id) {
            for (var i = 0; i < this.groups.length; i++) {
                var group = this.groups[i];
                if (group.id == id) {
                    return group.name;
                }
            }
        },
        /**
         * 设置分组短名称
         * @param groups {array|object}
         * @return {array|undefined|object}
         */
        setGroupShortName: function (groups) {
            if (!groups) {
                return;
            }
            if (!$jq.isArray(groups)) {
                groups = [groups];
            }

            $jq.each(groups, function (i, group) {
                groups[i]['name'] = util.decodeHTML(group.name);
                groups[i]['shortName']= util.cut(groups[i]['name'], maxNameLen);
            });
            return groups;
        },


        /**
         * 添加用户组（可单个）到新组（可单个）
         * @param {Array|number} ids 用户id
         * @param {number} groupId 分组id
         */
        addUsersToGroup: function (ids, groupId) {
            var t = this;
            if (!ids && !groupId) {
                return;
            }
            if (!$jq.isArray(ids)) {
                ids = [ids];
            }
            var result = [];
            $jq.each(ids, function (index, id) {
                var user = t.getUserFromContact(id)[0];
                if (!user) {
                    return;
                }
                if (!util.inArray(groupId, user.groupId)) {
                    user.groupId.push(groupId);
                }
                result.push(user);
            });
            t.modifyContact(result);
        },
        delUsersFromGroup: function (ids, groupId) {
            var t = this;
            var users = [];
            if (!groupId && !ids) {
                return;
            }
            if (ids === null) {
                users = t.contact.getContact();
            } else {
                if (!$jq.isArray(ids)) {
                    ids = [ids];
                }
                users = t.getUserFromContact(ids);
            }

            t.modifyContact(t.removeGroupFromUsers(users, groupId));
        },

        showMyContact: function (container, success) {
            var t = this;
            var options = {
                container: container,
                success: success,
                condition: {
                    type: 0
                }
            };
//            options.list = t.getMyContact();
            t._render(options);
        },

        showUngroupContact: function (container, success) {
            var t = this;
            var options = {
                container: container,
                success: success,
                condition: {
                    ungroup: true
                }
            };
            t._render(options);
        },

        /**
         * 缓存企业联系人到本地
         * @param users
         */
        addComContact: function (users) {
            if (!users) {
                return;
            }
            var t = this;
            if (!$jq.isArray(users)) {
                users = [users];
            }
            $jq.each(users, function (index, user) {
                t.comContact[user.id] = user;
            });
        },

        /**
         * 获取常用联系人
         * @param container 渲染容器
         * @param success
         */
        getCommonContact: function (container, success) {
            var t = this;
            var tid = 'commonContact';
            var opt = {
                success: function (resp) {
                    var depts = t.corps.getAllDepts();
                    var commonContact = new CommonContact(resp['var'], depts);
                    var list = commonContact.getData();
                    t.addComContact(list);
                    t.renderTemplate(tid, {
                        list: list
                    }, function (html) {
                        container.html(html);
                        func(success)(resp);
                    });
                }
            }

            this.dataApi(funcId.commonContact, opt);
        },

        getPublicContact: function (container, success) {
            var t = this;
            var tid = 'publicContact';
            var url = publicApiUrl || '';
            var params = {
                pageNo: 0,
                pageSize: 100
            };
            var opt = {
                url: url,
                params: params,
                dataType: 'json',
                data: {},
                success: function (resp) {
                    var data = resp['var'] || {};
                    var obj  = data.obj;
                    var publicContact = new PublicContact(obj);
                    var list = publicContact.getData();
                    t.renderTemplate(tid, {
                        list: list
                    }, function (html) {
                        container.html(html);
                        func(success)(resp);
                    });
                }
            }

            this.dataApi(funcId.publicContact, opt);
        },

        /**
         * 获取我加入的邮件组
         * @param success
         */
        getMyMailGroup: function (success) {
            var data = {
//                'type': 0
            };
            var id = funcId.joinedMailGroup;
            this.searchMailGroup(id, data, success);
        },
        /**
         * 获取可加入的邮件组
         * @param success
         */
        getJoinableMailGroup: function (success) {
            var data = {
//                'type': 1
            };
            var id = funcId.mailGroup;
            this.searchMailGroup(id, data, success);
        },

        /**
         * 查询邮件组
         * @param id
         * @param data 查询条件参数
         * @param success
         */
        searchMailGroup: function (id, data, success) {
            var t = this;
            var url = window.adminApiUrl || 'webadmin/service/user';
            var options = {
                url: url,
                dataType: 'json',
                data: data,
                success: function (resp) {
                    if (isOk(resp.code)) {
                        t.mailGroup = new MailGroup(resp['var']);
                        func(success)(t.mailGroup.getData());
                    } else {
                        tip(resp.summary);
                    }
                }
            };
            t.dataApi(id, options);
        },

        /**
         * 申请加入邮件组
         * @param {string} id 邮件组id
         * @param {string} content 申请理由
         * @param {function} success
         */
        joinMailGroup: function (id, content, success) {
            var mailGroup = this.mailGroup;
            var url = window.adminApiUrl || 'webadmin/service/user';
            var group = mailGroup.getGroup(id);
            var groupName = group.name;
            var flag = group.openIn;
            if ($jq.isFunction(content)) {
                success = content;
                content = '';
            }
            if (content.length > 200) {
                return tip(top.Lang.Addr.shenqingliyoubudechaoguozifu, 2);//申请理由不得超过200字符
            }
            var data = {
                groupId: id,
                groupName: groupName,
                flag: flag,
                applyContent: content || ''
            };
            var options = {
                url: url,
                data: data,
                dataType: 'json',
                success: success
            };
            this.dataApi(funcId.applyMailGroup, options);
        },

        /**
         * 申请退出邮件组
         * @param id 邮件组id
         * @param success
         */
        rejectMailGroup: function (id, success) {
            var url = window.adminApiUrl || 'webadmin/service/api';
            var data =  {
                    groupId: id
                };
            var options = {
                url: url,
                dataType: 'json',
                data: data,
                success: success
            };
            this.dataApi(funcId.exitGroup, options);
        },

        /**
         * 管理邮件组成员
         * @param data
         * @param success
         */
        manageMailGroupMembers: function (data, success) {
            var corpId = this.getCorpId();
            data = $jq.extend({corpId: corpId}, data);
            var options = {
                data: data,
                success: function (resp) {
                    if (isOk(resp.code)) {
                        func(success)(resp['var']);
                    } else {
                        tip(resp.summary);
                    }
                }
            };
            this.dataApi(funcId.mailGroupMemberManager, options);
        },

        /**
         * 将企业通讯录联系人添加到个人通讯录
         * @param {Array} users
         * @param {Array|Number} gid
         * @param {Function} success
         */
        ent2perAddr: function (users, gid, success) {
            var t = this;
            if (!$jq.isArray(gid)) {
                gid = [gid];
            }
            var comUserModel = new ComUser();
            var pUsers = comUserModel.exchange2Personal(users);
            $jq.each(pUsers, function (i, user) {
                user['group_id'] = gid;
            })
            t.add(pUsers, {
               success: success
            });
        },

        getLocalComUser: function (id) {
            return this.comContact[id];
        },

        getLocalClientUser: function (id) {
            return this.clients.getUser(id);
        },

        getLocalUser: function (id) {
            var t = this;
            var user = t.comContact[id];
            if (!user && t.contact) {
                user = t.contact.getUser(id);
            }
            if (!user && t.clients) {
                user = t.clients.getUser(id);
            }

            return user || {};
        },

        getIdCard: function (user) {
            return new IdCard(user);
        },

        getCommMail: function (id, email, success, page) {
            var t = this;
            var url = window.sendMailUrl || '';
            var pageSize = 10;
            page = page || 1;
            if (!id) {
                return tip('id is invalid.');
            }
            var user = t.getLocalUser(id);
            var myEmail = window.account.email;
            var corpId = t.getCorpId();
            if (!myEmail) {
                return;
            }
            var target = email + ';' + myEmail;
            var start = pageSize * (page - 1) + 1;
            var options = {
                url: url,
                data: {
                    'order': 'date',
                    'desc': 1,
                    'isSearch': 1,

                    'recursive': 0,
                    'start': start,
                    'total': pageSize,
                    'isFullSearch': 0,
                    'operator': 'and',
                    'condictions': [
                        {
                            field: 'to',
                            operator: 'eq',
                            value: target
                        },
                        {
                            field: 'from',
                            operator: 'eq',
                            value: target
                        }
                    ],
                    'exceptFids': [2, 4]
                },
                success: function (resp) {
                    if (isOk(resp.code)) {
                        func(success)(resp, user);
                    } else {
                        tip(resp.summary);
                    }
                }
            };
            if (!user) {
                t.getComUserInfo(corpId, id, function (u) {
                    user = u;
                    t.dataApi(funcId.searchMail, options);
                });
            } else {
                t.dataApi(funcId.searchMail, options);
            }
        },

        /**
         * 渲染带分页的往来邮件
         * @param container
         * @param id
         * @param email
         * @param page
         * @param success
         */
        renderCommMailWithPage: function (container, id, email, page, success) {
            var t = this;
            var times = 3;
//            page = (page || 1) * times;
            t.getCommMail(id, email, function (resp, user) {
                var commMail =new CommMail(resp['var'], user);
                var list = commMail.getData();
//                var total = list.length;
                var total = resp['stats']['messageCount'] || 0;
                var pageSize = 10 * times;
                var pager = new Pager({
                    total: total,
                    current: page,
                    size: pageSize,
                    totalTip: top.Lang.Addr.gongfengyoujian,//共{0}封邮件
                    container: container,
                    clickCallback: function (e, cpage) {
                        var mail = container.find('.itemsContainer').data('email');
                        t.renderCommMailWithPage(container, id, mail, cpage, success);
                        return false;
                    }
                });
                t.renderTemplate('commMail', {
                    list: list,
                    pager: pager.render(),
                    email: email,
                    uid: id,
                    total: total
                }, function (html) {
                    container.html(html);
                    func(success)(resp, user);
                });
            }, ((page || 1) - 1) * times + 1);
        },

        /**
         * 渲染下滚出现的往来邮件
         * @param container
         * @param id
         * @param email
         * @param page
         * @param success
         */
        renderCommMail: function (container, id, email, page, success) {
            var t = this;
            t.getCommMail(id, email, function (resp, user) {
                var commMail = new CommMail(resp['var'], user);
                var list = commMail.getData();
                t.renderTemplate('commMail', {
                    list: list,
                    onlyList: 1
                }, function (html) {
                    if (container.find('.pager').length) {
                        container.find('.pager').before(html);
                    } else {
                        container.find('.itemsContainer').append(html);
                    }
                    func(success)(resp, user);
                });
            }, page);
        },

        /**
         * 快速回复
         * @param mid 邮件标识
         * @param content 回复内容
         * @param success
         */
        quickReply: function (mid, content, success) {
            var t = this;
            //只回复给发件人

            if ($jq.trim(content) == '') {
                alert(top.Lang.Addr.qingshuruhuifunarong);//请输入回复内容
                return;
            }
            var url = sendMailUrl || '';
            var reqData = {
                url: url,
                data: {
                    "mid":mid,
                    "toAll":0
                },
                success : function(resp) {
                    if(isOk(resp.code)) {
                        sendReply (resp['var']);
                    }
                }
            };
            t.dataApi(funcId.quickReply, reqData);

            function sendReply (data) {
                var mailInfo = {
                    account: window.account.name + "<"+window.account.email+">",
                    to: data.to,
                    //                            cc: respData.cc,
                    // bcc: MR.data.bcc,
                    showOneRcpt: 0,
                    isHtml: 1,
                    subject: data.subject,
                    content: util.encodeHTML(content),
                    priority: 3,
                    requestReadReceipt: 0,
                    saveSentCopy: 1,
                    inlineResources: 0,
                    scheduleDate: 0,
                    normalizeRfc822: 0,
                    omid:mid,
                    attachments: []
                };

                var succ = function(resp){
                    tip(top.Lang.Addr.youjianhuifuchenggong);//邮件回复成功
                    func(success)(resp);
                };
                t.dataApi(funcId.sendEmail, {
                    url: url,
                    data: {
                        attrs: mailInfo,
                        "returnInfo": 1,
                        "action": "reply"
                    },
                    success: succ
                });
            }
        },

        /**
         * 获取往来邮件的附件
         * @param mid
         * @param fid
         * @param success
         */
        readAcc: function (mid, fid, success) {
            if (!mid) { return;}
            if ($jq.isFunction(fid)) {
                success = fid;
                fid = null;
            }
            var url = sendMailUrl || '';
            var options = {
                url: url,
                data: {
                    mid: mid,
                    fid: fid,
                    mode: "html"
                },
                success: function (resp) {
                    if (isOk(resp.code)) {
                        func(success)(resp['var']);
                    }
                }
            };
            this.dataApi(funcId.readMail, options);
        },

        /**
         * get company users
         * @param container
         * @param page
         * @param [corpId]
         * @param success
         */
        getComUsers: function (container, page, corpId, success) {
            var t = this;
            page = parseInt(page, 10);
            if ($jq.isFunction(corpId)) {
                success = corpId;
                corpId = t.getCorpId();
            }
            corpId = corpId || t.getCorpId();
            if (page <= 0) {
                page = 1;
            }
            var pageSize = 20;
            var start = pageSize * (page - 1) + 1;
            var opt = {
                data: {
                    start: start,
                    total: pageSize,
                    corpId: corpId
                },
                success: function (resp) {
                    var depts = t.corps.getAllDepts();
                    var comUser = new ComUser(resp['var'], depts);
                    var list = comUser.getData();
//                    var total = 1000; //resp.total
                    var total = resp.employee_count;
                    var pager = {
                        total: total,
                        current: page
                    };
                    var clickEvent = function (e, to) {
                        t.getComUsers(container, to, corpId, success);
                        return false;
                    };
                    container.data('clickEvent', clickEvent);
                    t.renderComList(container, list, pager, function () {
                        func(success)(list);
                    });
                    t.addComContact(list);
                }
            };
            this.dataApi(funcId.comUserQuery, opt);
        },


        getClientByInitial: function (container, letter, page, success) {
            var t = this;
            this.searchInClient({top_char: letter}, container, page, function (resp) {
                var clients = new ClientUser(resp['var']['client_list'], t.clientGroups).getData();
                t.renderClientContact(container, clients, 1, success);
            }, 1);
        },

        /**
         * search company users by initial of one's name
         * @param {object} container
         * @param {string} letter initial letter
         * @param {int} page
         * @param {function} success callback
         * @param {string|function} [corpId] 企业id
         */
        getComUsersByInitial: function (container, letter, page, corpId, success) {
            var t = this;
            if (!letter) {
                return this.getComUsers(container, 1, corpId, success);
            }
            if ($jq.isFunction(corpId)) {
                success = corpId;
                corpId = t.getCorpId();
            }
            page = page || 1;
            var pageSize = 20;
            var start = (page -1) * pageSize + 1;
            var searchFlag = page == 1 ? 1 : 0;
            var data = {
                'top_char': letter,
                start: start,
                total: pageSize,
                search_flag: searchFlag,
                corpId: corpId
            };
            var succ = function (users, total) {
                var pager = {
                    total: total,
                    current: page
                };
                var clickEvent = function (resp, to) {
                    t.getComUsersByInitial(container, letter, to, success);
                    return false;
                };
                var depts = t.corps.getAllDepts();
                container.data('clickEvent', clickEvent);
                var comUser = new ComUser(users, depts);
                var list = comUser.getData();

                t.addComContact(list);
                t.renderComList(container, list, pager, success);
            };
            this.searchComUsers(corpId, data, succ);
        },

        /**
         * 获取部门（树状结构），不包含用户列表
         * @param corpId
         * @param deptId
         * @param success
         * @return {*}
         */
        getDepts: function (corpId, deptId, success) {
            var t = this;
            corpId = corpId || t.corps.getMyCorp();
//            var oDept = t.corps.getArrayDepts(corpId);
//            if (oDept) {
//                return func(success)(oDept);
//            }
            deptId = deptId || null;
            if ($jq.isFunction(deptId)) {
                success = deptId;
                deptId = 0;
            }
            var dataType = 1; //类型，可指定返回部门、用户列表、或统计信息
            var data = {
//                dataType: dataType,
                corpId: corpId,
                deptId: deptId,
                depth: 1
            };
            var opt = {
                data: data,
                success: function (resp) {
                    var respData = resp['var'];
                    if (isOk(resp['code'])) {
                        var deptList = respData['deptList'];
                        var arrDepts = new Dept(deptList, deptId);
                        t.corps.setDepts(arrDepts, corpId);
                        var depts = t.corps.getArrayDepts(corpId, deptId);
                        if (depts && !deptId) {
                            t.depts = depts;
                        }
                        func(success)(depts);
                    } else {
                        tip(respData);
                    }
                }
            }
            this.dataApi(funcId.deptUserQuery, opt);
        },

        /**
         * 获取部门用户列表
         * @param container
         * @param deptId
         * @param page
         * @param success
         * @param corpId
         */
        getUsersByDept: function (container, deptId, corpId, page, success) {
            if (deptId === undefined) {
                return;
            }
            page = page || 1;
            var t = this;
            corpId = corpId || t.getCorpId();
            //            var dataType = 2;
            var pageSize = 20;
            var start = (page - 1) * pageSize + 1;
            var searchFlag = page == 1 ? 1 : 0;
            var data = {
                start: start,
                total: pageSize,
                deptId: deptId,
                recursive_flag: 1,
                corpId: corpId,
                search_flag: searchFlag
            };
            var opt = {
                data:data,
                success: function (resp) {
                    var depts = t.corps.getAllDepts();
                    var comUser = new ComUser(resp['var'], depts);
                    var list = comUser.getData();
                    t.addComContact(list);
                    var total = resp['employee_count']; //resp.total
                    var pager = {
                        total: total,
                        current: page
                    };
                    var clickEvent = function (resp, to) {
                        t.getUsersByDept(container, deptId, corpId, to, success);
                        return false;
                    };
                    container.data('clickEvent', clickEvent);
                    t.renderComList(container, list, pager, function () {
                        func(success)(list);
                    });
                }
            };
            t.dataApi(funcId.searchComUsers, opt);
        },

        getCorps: function (success) {
            var t = this;
            var data = {};
            var callback = function (resp) {
                if (isOk(resp['code'])) {
                    var corps = resp['var'];
                    //如果只有一个企业，则该企业默认为此用户的企业
                    if (corps.length == 1) {
                        gMain.corpId = corps[0].corpId;
                    }
                    t.corps = new Corps(resp['var']);
                    func(success)(t.corps);
                }
            };
            if (util.allowCrossDomain()) {
                if (t.corps) {
                    return func(success)(t.corps);
                }
                var opt = {
                    data: data,
                    success: callback
                };
                this.dataApi(funcId.getCorps, opt);
            } else {
                var myCorp = [{
                    corpId: gMain.corpId || '',
                    corpName: top.Lang.Addr.qiyetongxunlu
                }];//企业通讯录
                callback({code: 'S_OK', 'var': myCorp});
            }

        },

        /**
         * 查询企业通讯录的用户
         * @param {object} data
         * @param {function} success
         * @param corpId
         */
        searchComUsers: function (corpId, data, success) {
            var t = this;
            var corpId = corpId || t.getCorpId();
            $jq.extend({
                corpId: corpId
            }, data || {});
            var opt = {
                data: data || {},
                success: function (resp) {
                    var depts = {};
                    if (t.corps) {
                        depts = t.corps.getAllDepts();
                    }
                    var comUser = new ComUser(resp['var'], depts);
                    var list = comUser.getData();
                    t.addComContact(list);
                    func(success)(list, resp['employee_count']);
                }
            };
            this.dataApi(funcId.searchComUsers, opt);

        },

        removeGroupFromUsers: function (users, gid) {
            if (!users) {
                return;
            }
            if (!$jq.isArray(users)) {
                users = [users];
            }
            var result = [];
            $jq.each(users, function (index, user) {
                $jq.each(user.groupId, function (index, item) {
                    if (item == gid) {
                        user.groupId.splice(index, 1);
                        return false;
                    }
                });
                result.push(user);
            });
            return result.length === 1 ? result[0] : result;
        },
        updateGroupByContact: function () {
            var t = this;
            var groups = [];
            $jq.each(t.groups, function (i, group) {
                groups[i] = group;
                var count = 0;
                var contact = t.contact.getContact();
                $jq.each(contact, function (index, user) {
                    if (util.inArray(group.id, user.groupId)) {
                        count++;
                    }
                });
                groups[i]['linkman_count'] = count;
            });
            t.groups = groups;
            t.updateGroup();
        },
        //        updateContactByGroup: function () {
        //
        //        },
        //获取写信事务ID
        getComposeId: function (url, success) {
            var t = this;
            this.dataApi(funcId.getComposeId, {
                url: url,
                success: function (resp) {
                    if (isOk(resp.code)) {
                        func(success)(resp);
                    } else {
                        tip(Lang.Addr.a0164, 2);
                    }
                }
            });
        },
        //仅发送邮件
        sendEmail: function (options) {
            var t = this,
                successCallback = func(options.success),
                data = {
                    attrs: {
                        account: "",
                        to: "",
                        cc: "",
                        bcc: "",
                        showOneRcpt: 0,  //是否群发单显
                        isHtml: 1,
                        subject: "",
                        content: "",
                        priority: 3,      //是否重要
                        requestReadReceipt: 0, //回执
                        saveSentCopy: 1,      //保存到发件箱
                        inlineResources: 0,  //是否内联图片
                        scheduleDate: 0,     //
                        denyForward: 0, // 禁止转发
                        normalizeRfc822: 0,
                        id: "",
                        headers: {"X-RM-FontColor": 0},
                        isCommonUser: 0
                    },
                    returnInfo: 1,
                    action: "deliver"
                };
            options.data = $jq.extend(true, data, options.data);
            options.success = function (resp) {
                if (isOk(resp.code)) {
                    successCallback(resp);
                }
            };
            this.dataApi(funcId.sendEmail, options);//
        },

        //发送短息
        sendSMS: function (options) {
            var t = this;
            var successCallback = func(options.success);

            var data = {
                sendFlag: 0
            };

            $jq.extend(true, options.data, data);
            options.dataType = 'json';
            options.success = function (resp) {
                if (isOk(resp.code)) {
                    //执行回调
                    t.contactIsReady = true;
                    successCallback(resp);
                } else {
                    //failure
                    tip(Lang.Addr.a0145, 2);
                }
            };
            this.dataApi(funcId.sendSMS, options);
        },

        save2Addr: function (emails, success) {
            var t = this;
            var from = '';
            var reg = new RegExp("[a-z0-9\.!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?", "ig");
            emails = emails.match(reg);
            var list = $jq.map(emails, function (email, index) {
                var item = {};
                item.email = email;
                item.name = email.split('@')[0];
                item.index = index;
                return item;
            });

            var data = {
                from: from,
                list: list
            };
            t.dataApi(funcId.save2Addr, {
                data: data,
                dataType: 'json',
                success: function (resp) {

                    if (isOk(resp.code)) {
                        var cb = resp['var'];
                        if (cb && cb.length) {
                            var users = $jq.map(cb, function (item) {
                                var user = {};
                                user.id = item[1];
                                user.first_name = item[0];
                                user.email = [];
                                user.email[0] = {
                                    name: item[2],
                                    status: 0
                                };
                                t.updateRecentContact(user.id);
                                return user;
                            });
                            t.addContact(users);
                        } else {
                            if (t.contact) {
                                for (var i = 0; i < emails.length; i++) {
                                    var email = emails[i];
                                    var user = t.getUserByEmail(email);
                                    t.updateRecentContact(user.id);
                                }
                            }
                        }
                        func(success)(resp);
                    }
                }
            });

        },

        getUserByEmail: function (email) {
            var t = this;
            var contact = t.contact.getContact();
            var users = $jq.map(contact, function (user) {
                    return util.inArray(email, user['emails']) ? user : null;
            });
            return users[0];
        },

        /**
         * 判断是否为最近联系人视图
         * @return {boolean}
         */
        isRecentView: function () {
            try {
                return this.currentView.condition.recent;
            } catch (e) {
                return false;
            }
        },

        getGroupMember: function () {

        },

        //--------company--------
        getDept: {},

        renderComList: function (container, list, pager, success) {
            var t = this;

            if (!list) {
                return;
            }

            var pager = new Pager({
                total: pager.total || 0,
                current: pager.current || 1,
                size: pager.size || 20,
                container: container,
                clickCallback: function (e, to) {
                    var ev = container.data('clickEvent');
                    ev(e, to);
                }
            });
            var data = {
                list: list,
                pager: pager.html
            };
            t.renderTemplate('comlist', data, function (html) {
                container.html(html);
                func(success)(html, data);
            });
        },
        renderDeptMenu: function (container, corpId, success) {
            var t = this;
            var tid = 'deptMenu';
            if ($jq.isFunction(corpId)) {
                success = corpId;
                corpId = t.corps.getMyCorpId();
            }

            t.getDepts(corpId, function (depts) {
                var current = false;
                if (t.currentView && t.currentView.condition) {
                    current = Boolean(t.currentView.condition.dept);
                }
                var list = $jq.map(depts, function (dept) {
                    return !dept.parentId ? dept : null;
                });
                var corps = t.corps.getCorpsList();
                var showNum = util.allowShowDeptCount();
                t.renderTemplate(tid, {
                    depts: list,
                    corps: corps,
                    currentCorpId: corpId,
                    current: current,
                    showNum: showNum,
                    showMyDept: t.showMyDept,
                    showEntPublic: util.allowEntPublic(),
                    showCommonContact: util.allowCommonContact(),
                    showMailGroup: !util.isPublicMail() && util.allowMailGroup(),
                    corpId: corpId
                }, function (html) {
                    container.html(html);
                    t.showMyDept = 1;
                    func(success)(depts);
                });
            });
        },
        _iterateComContact: function (contact, handle) {
            var t = this;
            if (!contact) {
                return;
            }
            var userListName = 'userList';
            var deptListName = 'deptList';
            var userList = contact[userListName];
            var deptList = contact[deptListName];
            func(handle)(contact, userList, deptList);
            for (var i = 0; i < deptList.length; i++) {
                var dept = deptList[i];
                t._iterateComContact(dept, handle);
            }
        },
        /**
         * 根据id从列表中获取用户
         * @param list
         * @param id
         * @return {object}
         */
        getUser: function (id, list) {
            for (var i = 0; i < list.length; i++) {
                var user = list[i];
                if (user.id == id) {
                    return user;
                }
            }
            return {};
        },
        getLocalComUserInfo: function (id) {
            var t = this;
            if (!id) {
                return;
            }
            return t.comContact[id];
        },
        /**
         * 获取企业通讯录联系人详情
         * @param corpId
         * @param id
         * @param success
         */
        getComUserInfo: function (corpId, id, success) {
            var t = this;
            if (!id) {
                return;
            }
            success = func(success);
            var opt = {
                data: {
                    'corp_id': corpId,
                    'user_id': id
                },
                success: function (resp) {
                    var comUserInfo = new ComUserInfo(resp['var']);
                    var user = comUserInfo.getData();
                    success(user);
                }
            };
            this.dataApi(funcId.getComUserInfo, opt);
        },
        /**
         * 根据部门id获取部门信息
         * @param {number} deptId
         * @param {number} corpId
         * @return {object|undefined}
         */
        getDeptFromCompany: function (corpId, deptId) {
            var t = this;
            if (!deptId) {
                return;
            }
            return t.corps.getDept(corpId, deptId);
        },

        getRepeat: function (name, elem, exclude) {
            var t = this;
            var list = t.contact.getContact();
            if (!name || !elem || !list.length) {
                return [];
            }
            return t._getRepeat(name, elem, exclude, list);
        },

        //--------private--------
        _getRepeat: function (name, elem, exclude, list) {
            var type = $jq.type(list[0][elem]);
            var result = $jq.map(list, function (item) {
                var equal = type == 'array' ?
                            util.inArray(name, item[elem]) :
                            name == item[elem];
                return equal && (!exclude || exclude != item.id) ? item : null;
            }) || [];
            return result;
        },
        _getUserInfo: function (key, value) {
            if (!this.contactIsReady) {
                return;
            }
            var i,
                l,
                users = [],
                c = this.contact.getContact();

            for (i = 0, l = c.length; i < l; i++) {
                var u = c[i];
                if (u[key] == value) {
                    users.push(u);
                }
            }
            return users;
        },
        /**
         * 根据Key分组联系人
         * @return {*}
         */
        _getListByKey: function (key, list) {
            var t = this,
                hash = {},
                res,
                list = list || this.contact.getContact();
            if (!key) return res;
            if (!res) {
                res = { count: 0 }
                for (var i = 0, l = list.length; i < l; i++) {
                    var item = list[i], _key = item[key];
                    if (_key instanceof Array) {
                        for (var k = 0, kl = _key.length; k < kl; k++) {
                            var value = _key[k];
                            var ak = value.mobile_number != undefined ? value.mobile_number : value;
                            !!ak && setKey(ak, item);
                        }
                    } else
                        setKey(_key, item);

                }
                for (var _key in hash) {
                    var item = hash[_key];
                    if (item.length > 1) {
                        res.count++;
                    } else {
                        delete hash[_key];
                    }
                }
                res.users = hash;
                cache.setView(key, res);
            }
            return res;
            function setKey(key, item) {
                key = $jq.trim(key);
                var value = hash[key];
                if (!value) {
                    hash[key] = [item];
                } else {
                    value.length < 4 && value.push(item);
                }
            }
        },
        _beforeResp: function (au) {
            var code = au.code;
            if (au && isOk(code)) {
                return true;
            } else {
                if (code == "FA_INVALID_SESSION" || code == "FA_SECURITY" || au.errorCode == 2012 || au.errorCode == 2053 ) {
//                    if (code) {
                    /**
                     * Lang.Mail.FA_INVALID_SESSION session不通过的提示
                     * Main.doSessionOut session不通过的callback函数
                     * Lang.Mail.sys_LoginOT session过期提示
                     */
                    var loginBox = window.WLogin || {};
                    if (loginBox.show) {
                        var showDialog = function (content, success, title, cancel, id) {
                            confirm(content, success, title, cancel, 'divDialogconfirm' + id);
                        };
                        loginBox.show(showDialog, {model: 'ADDR'});
                    }
                }

                return false;
            }
        },
        /**
         * 渲染列表
         * @param options
         * {
         *      container {object}
         *      [list] {array}
         *      [page] {number}
         *      [pageSize] {number}
         *      [condition] {object}
         * }
         * @private
         */
        _render: function (options) {

            var t = this;
            var ps = UC.pageSize || 20;
            options.condition = options.condition || {};
            var tid = options.type ? 'comlist' : 'list';
            var contact = t.contact.getContact();
            var list = options.list && options.list.length ? options.list : contact;
            list = t.filterUsers(list, options.condition);
//            options.list = options.list || t.contact;
            var data = {
                list: list
            };
            var page = options.page || 1;
            var pageSize = options.pageSize || ps;
            var turnPage = function (e, to) {
                if (to) {
                    t.renderList($jq.extend(options, {
                        page: to,
                        condition: t.currentView.condition
                    }));
                }
                return false;
            };
            var pager = t.getPager(data.list, page, pageSize, options.container, turnPage);
            data.pager = pager.html;
            data.topPager = pager.simpleHtml;
            data.page = pager.page;

            data.groupsName = {};
            data.groupsShortName = {};
            $jq.each(t.groups, function (index, item) {
                data.groupsName[item.id] = item.name;
                data.groupsShortName[item.id] = item.shortName;
            });
            t.renderTemplate(tid, data, function (html) {
                options.container.html(html);
                t.currentView = {
                    container: options.container,
                    page: page,
                    pageSize: pageSize,
                    condition: options.condition
                };
                if (!options.type) {
                    t.bindDrag(options.container);
                }
                func(options.success)(html);
            });
        },

        bindDrag: function (container) {
            var checkElem = container.find('.item-checkbox').not(':disabled');
            var items = checkElem.closest('.item, .litem');
            if (!checkElem.length) {
                return;
            }

            //drag and drop
            items.draggable({
                cursor: 'move',
                cursorAt: {left: 5, top: 5},
                delay: 100,
                start: function (event, ui) {
                    $jq(event.target).find(checkElem).prop('checked', true);
                    setHelper(ui.helper);
                },
                revert: true,
                helper: function () {

                    var helper = $jq('<div class="gragcon m_box"><div class="gragcon_bd"><i class="i-move mr_5"></i><span class="grag_txt"></span></div></div>');
                    helper.css('zIndex', 1000).appendTo('body');
                    return helper;
                },
                opacity: 0.8
            });
            function getCheckedCount () {
                return checkElem.filter(':checked').length || 0;
            }

            function setHelper(helper) {
                var count = getCheckedCount();
                var html = util.format('<div class="gragcon_bd"><i class="i-move mr_5"></i><span class="grag_txt">{0}</span></div>', util.format(top.Lang.Addr.zhengtuodonggelianxiren, count));//正拖动{0}个联系人
                helper.html(html);
            }
        },
        filterUsers: function (list, data) {
            var t = this;
            list = list || [];
            data = data || {};
            var group = data.group | '';
            var alpha = data.alpha || '';
            var dept = data.dept || '';
            var recent = data.recent || false;
            var type = data.type;
            var ungroup = data.ungroup || false;
            var invalid = data.invalid || false;
            if (group) {

                list = $jq.map(list, function (item) {
                    return util.inArray(group, item.groupId) ? item : null;
                });
            }
            if (dept) {
                list = t.getDeptAllMembers(dept);
            }
            if (alpha) {
                alpha = alpha.charAt(0).toLowerCase();
                list = $jq.map(list, function (item) {
                    var first = item['nameFirstChar'] || item['name_first_char'] || item['name'];
                    first = first.charAt(0).toLowerCase();
                    return first == alpha ? item : null;
                });
            }

            if (recent) {
                list = t.contact.getUsers(t.recentContact);
            }

            if (ungroup) {
                list = t.getUngroupUsers();
            }

            if (invalid) {
                list = t.getInvalidList();
            }

//            if (type == 0) {
//                list = t.getMyContact();
//            }

            return list;
        },
        getUngroupUsers: function () {
            var t = this;
            if (typeof t.contact == 'undefined'
                || typeof t.contact.getContact == 'undefined') {return [];}
            var contact = t.contact.getContact();
            return $jq.map(contact, function (user) {
                return user.groupId && user.groupId.length ? null : user;
            });
        },
        getUngroupUsersLen: function () {
            return this.getUngroupUsers().length;
        },
        readMail: function (mid, success) {
            var url = sendMailUrl || '';
            var data = {
                "mode":"both",
                "filterStylesheets":"0",
                "filterImages":"0",
                "filterLinks":"0",
                "supportTNEF":"0",
                "fileterScripts":"1",
                "filterFrames":"1",
                "markRead":"1",
                "encoding":"utf-8",
                "mid": mid || null,
                "fid":0
            };

            var opt = {
                url: url,
                data: data,
                success: func(success)
            };

            this.dataApi(funcId.readMail, opt);

        }
    };



    window.Addr = Addr;
}(window, jQuery));