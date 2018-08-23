 

    case "change_email":

      msg = dictionaryTable.login[code];

      if (!msg) {
        this.$message.success(o.$t('message.youxiangbangdingchenggong'));
      } else {
        this.$message.error(msg);
      }
      break;

      case "change_login_password":

      msg = dictionaryTable.login[code];

      if (!msg) {
        this.$message.success(o.$t('message.caozuochenggong'));
      } else {
        this.$message.error(msg);
      }
      break;  
      case "change_mobile":

      msg = dictionaryTable.login[code];

      if (!msg) {
        this.$message.success(o.$t('message.shoujibangdingchenggong'));
      } else {
        this.$message.error(msg);
      }
      break;

      case "nick_name":

      msg = dictionaryTable.login[code];

      if (!msg) {
        this.$message.success(o.$t('message.nichenxiugaichenggong'));
      } else {
        this.$message.error(msg);
      }
      break;
  