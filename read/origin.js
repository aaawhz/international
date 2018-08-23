 

    case "change_email":

      msg = dictionaryTable.login[code];

      if (!msg) {
        this.$message.success('邮箱绑定成功');
      } else {
        this.$message.error(msg);
      }
      break;

      case "change_login_password":

      msg = dictionaryTable.login[code];

      if (!msg) {
        this.$message.success('操作成功');
      } else {
        this.$message.error(msg);
      }
      break;  
      case "change_mobile":

      msg = dictionaryTable.login[code];

      if (!msg) {
        this.$message.success('手机绑定成功');
      } else {
        this.$message.error(msg);
      }
      break;

      case "nick_name":

      msg = dictionaryTable.login[code];

      if (!msg) {
        this.$message.success('昵称修改成功');
      } else {
        this.$message.error(msg);
      }
      break;
  