

export default {
  data () {
    return {
      //初始化数据
      kw: null,
      checked: false,
      title_cn: this.$t('message.tibidizhi'),//提币地址
      title_en: 'Withdraw Address',
      options: [{
        value: '0',
        label: 'BTC'
      }, {
        value: '1',
        label: 'ETH'
      }, {
        value: '2',
        label: 'XXX'
      }, {
        value: '3',
        label: 'XXX'
      }],
     value: '',
     tableData: [{
       coin_type: 'BTC',
       coin_address: 'QK6fqF7r433AUoWrpirxeDq1YPBdbRExr6',
       remark: this.$t('message.wu'),//无
       status: this.$t('message.yidaozhang')
     }],//已到账
    };
  },
  mounted: function(){
    if (this.$cookie.get("token") == null) {
      this.$router.replace({ path: "/login" });
      return;
    } else{
      this.load_account();
      this.set_title();
    }
  },
  methods: {
    //设置每个页面的标题（多语言）
    set_title: function() {
      //从localstorage取出当前语言
      let lang = localStorage.getItem('lang')
      //根据当前语言设置标题
      if(lang=='zh-CN'){
        document.title = this.title_cn
      } else if(lang=='en'){
        document.title = this.title_en
      } else {  //默认语言
        document.title = this.title_cn
      }
    },

    //加载账号信息
    load_account: function(){
      //从cookie取出token
      let token = this.$cookie.get('token');

      //ajax
      this.$http.get(this.$global.domain + 'account/detail',{
        headers:{
            Token: token
        },
      }).then(res => {
        if(res.data.result.code==0){  //获取成功
          //填充数据
          let data = res.data.data
          this.email = data.email
          this.is_pay_password_set = data.isPayPasswordSet
          this.is_two_auth_set = data.isTwoAuthenticatorSet
          this.nickname = data.nickname
          this.security_level = data.securityLevel
          this.uid = data.uid

          //安全等级
          if(this.security_level==null || this.security_level<=2){
            this.security_level_str = this.$t('message.di')
            this.percentage = 33//低
            this.color = "red"
          } else if(this.security_level>=3 && this.security_level<=4){
            this.security_level_str = this.$t('message.zhong')
            this.percentage = 66//中
            this.color = "#FECF21"
          } else if(this.security_level==5){
            this.security_level_str = this.$t('message.gao')
            this.percentage = 100//高
            this.color = "green"
          }

        } else {  //报错
         this.notify("load_account", 200, res, this);
        }

      }).catch(e => {  //处理报错
        //已经使用axios全局拦截处理报错 记录日志了
      })


    },

  }
}