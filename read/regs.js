
  var fs = require('fs');
   //中文 http://blog.csdn.net/leolu007/article/details/8576490  注意不要加g
  var zhRe = /[\u4E00-\u9FA5]/;
 

  var chineseToPinYin = require("./pinyin.js");
  //匹配 <br> </br> </  br>  或者  <br  /> <br/>
  var allowTag = /<br\s{0,20}(\/?)>|<(\/?)\s{0,20}br>/;

  //ncname匹配的是以a-zA-Z_开头，然后是0或多个a-zA-Z_、-或.。
  var ncname = '[a-zA-Z_][\\w\\-\\.]*';

  //(?:' + ncname + '\\:)? 这个主要是为了兼容这样的标签 <svg:path.test /> => <svg:path.test， 是ncname的加强
  var qnameCapture = '((?:' + ncname + '\\:)?' + ncname + ')';

  var startTagOpen = new RegExp('<' + qnameCapture);
  var startTag = new RegExp('<' + qnameCapture + '[^>]*?(\/)?>');

  //'</div>'.match(endTag)
  // ["</div>", "div", index: 0, input: "</div>"]
  var endTag = new RegExp('<\\/' + qnameCapture + '[^>]*?(\/)?>');
  var getTag = new RegExp('<(\\/)?' + qnameCapture + '[^>]*>', 'g');


  /** -----------------------attrs  REGs -----------------------**/

  // 比如 "href='https://www.taobao.com'".match(attribute)
  // ["href='https://www.taobao.com'", "href", "=", 
  // undefined, "https://www.taobao.com", undefined, 
  // index: 0, input: "href='https://www.taobao.com'"]

  // href
  var singleAttrIdentifier = /([^\s"'<>/=]+)/;
  // =
  var singleAttrAssign = /(?:=)/;
  // https://www.taobao.com

  //注意先后顺序
  var singleAttrValues = [
      // attr value double quotes
      /"([^"]*)"+/.source,
      // attr value, single quotes
      /'([^']*)'+/.source,

      /\\\'([^\s"'=<>`]+)\\\'/.source,
      /\\\"([^\s"'=<>`\\]+)\\\"/.source,
      //attr value, no quotes
      /([^\s"'=<>`]+)/.source
  ]

  var attribute = new RegExp(
      singleAttrIdentifier.source +
      '\\s*(' + singleAttrAssign.source + ')' +
      '\\s*(' + singleAttrValues.join('|') + ')',
      'g'
  )

 
  var GLOBELCACHE = {
      hasTrans: false
  };

  var GLOBELOPTION = {
     langpath : "top.Lang.Mail.Write.",
     langkey : "mail.Write."
  };

  var Util = {
      haszh: function(str) {
          //中文
          var zhRe = /[\u4E00-\u9FA5]/;

          return zhRe.test(str);
      },
      //检查字符串是否符合国际化要求， 返回true就全部提取出来， 返回false则进入标签解析， 分段提取
      checkTag: function(str) {
          //字符串是否只有容许的标签， 如果 'abc<br/>好滴' 就把这个整体提取出来做国际化， 简单易行
          var onlyAllowTag = true;
          //如果有标签
          if (getTag.test(str)) {
              str.replace(getTag, function($s) {
                  if (!allowTag.test($s)) {
                      onlyAllowTag = false;
                      return onlyAllowTag;
                  }
              });
              return onlyAllowTag;
          } else {
              return onlyAllowTag;
          }
      },
      /**  
       输入 "<br><br> 葫芦娃  <input> 变形金刚 "
       输出 

          spliteValue: 
          0: {value: "<br>", isTag: true}
          1: {value: "<br>", isTag: true}
          2: {value: " 葫芦娃  ", isTag: false}
          3: {value: "<input>", isTag: true}
          4: {value: " 变形金刚 ", isTag: false}

       }
       **/
      getTextsAndTags: function(str) {

          var item, isTag = false,
              s = '';
          var TextsAndTags = [], strTag = '', oldIsTag,
              o = {};

          for (var i = 0; i < str.length; i++) {
              var item = str.charAt(i);

              if (item == '<') {
                  //用来保存试探的标签
                  strTag = '';
                  //判断剩余的是不是标签
                  for (var j = i; j< str.length; ) {
                      strTag += str.charAt(j);

                      if( startTag.test(strTag) || endTag.test(strTag)){
                        oldIsTag = isTag;
                        isTag = true;
                        //console.log(strTag)
                        break;
                      }

                      j++
                  }

                  if( isTag ){
                    //如果 < 前面有字符， 先push
                    if (s) {
                        o = {
                          value: s,
                          isTag: oldIsTag
                        }
                        TextsAndTags.push(o);
                       // console.log("s============"+s)
                         s = '';

                    }


                    //console.log("tag======"+strTag)


                    //跳过匹配的标签
                    i = j;

                    o = {
                          value: strTag,
                          isTag: isTag
                        }

                    strTag = '';    
                   
                    TextsAndTags.push(o);
                    s = '';
                    isTag = false;
                  }else{
                    // 如果匹配不到
                    s += item;
                  }
              }else{
              
                s += item;
              }
          }

          //收尾
          if (s) {
              o = {
                  value: s,
                  isTag: isTag
              };

              TextsAndTags.push(o);
          }

          return {
              spliteValue: TextsAndTags
          }
      }

  };


  /** '拼写检查暂不支持中文。<br><br>        <input id="editorSpellChkTip" />&nbsp;不再提示'
 
      '排序{0} en<span style="aa" title="这是升序哦"> 升序 
      <span title=\"我是{0}降序\"></span></span>'；
  */

  /**
   用标签来分割不明智， 应该直接循环用<>来判断， 遇到就截取

   1.看看标签属性有没有中文

   1.把位置中间的取出来， 看看有没有中文， 如果有中文就全部提取
  **/

  function pickText(str) {
      var o = Util.getTextsAndTags(str).spliteValue,
          item, value, reArray = [];

      for (var i = 0; i < o.length; i++) {
          item = o[i];
          value = item.value;

          // console.log("value   start========="+value)
          //处理标签属性， 有中文直接替换
          if (item.isTag) {
              //console.log('------------------' + value);
              value = value.replace(attribute, function($0, $1, $2, $3, $4) {
    
                  //replace 会改变匹配到的那部分， 只需要改变值后， 但不会改变原值
                  if (Util.haszh($3)) {
        
                      return $1 + $2 + transf($3, false, true)
                  } else {
                      return $0
                  }


              });

              // console.log(value)

          } else {
              // ad处理文字， cc有中文直接替换ddfd
              // ad  + 处理文字， cc有中文直接替换ddfd
              if (Util.haszh(value)) {
                var inners = '';
                var innerStrStart = '';
                var innerZh = '';
                var hasMatchZh = false;
                var innerStrEnd = '';
                var pos = '';//爱的发达<sad;   ==> pos:-4  

                for (var j = 0; j < value.length; j++) {
                  inners= value.charAt(j);

                  //console.log('zhRe.test(inners)' + zhRe.test(inners) +'and  ' +inners)
               
                  if(!!zhRe.test(inners) || hasMatchZh){
                    innerZh += inners;
                    hasMatchZh = true;
                  }else{
                    innerStrStart += inners;
                  }

                }

                /*console.log(innerZh)
                // 发达sad;
                // 1
                for (var n = innerZh.length-1; n >0; n--) {
                   if(zhRe.test(innerZh[n])){
                      pos = n+1;
                      break;
                   } 
                }


                
                innerStrEnd = innerZh.substring( pos, innerZh.length );
                innerZh = innerZh.substring(0,pos);

                console.log('value   :'+item.value)
               
                */
                /* console.log('innerStrStart   :'+innerStrStart);
                 console.log('innerZh   :'+innerZh);
                console.log('innerStrEnd  :'+innerStrEnd)*/
                value = innerStrStart +  transf(innerZh, true) ; // + innerStrEnd;
              }
          }

           // console.log("value   end=========="+value)
          reArray.push(value);
      }

      // console.log(reArray.join(''))
      return reArray.join('');
  }

  //demo
  var Lang = {
      "Mail": {
          "Write": {
              hlw: '葫芦娃',
              hh: '呵呵',
              ddd: 'd的d',
              bxjg: '变形金刚'
          }
      }
  }



  //test

  //var str = '<br><br> 葫芦娃  <input title="呵呵"> <input ttt=\'d的d\'> 变形金刚 ';
  /**
    ============= start ===============
  **/

  function TransStr(str) {
      var res = '';
      var otherEndChar = /(?:(\+\'\")$)|(?:(\+\"\')$)|(?:(\+\')$)|(?:(\+\")$)/;
      var otherStartChar = /(?:^(\'\"\+))|(?:^(\"\'\+)$)|(?:^(\'\+))|(?:^(\"\+))/;

      if (Util.haszh(str)) {
          // console.log('-----------------'+str)
          if (!Util.checkTag(str)) {
              //进入提取中文
              res = pickText(str);
          } else {
              //str全部提取， 直接转换
              res = transf(str);
          }
      } else {
          //跳过 result += str; i = j;
          res = str;
      }

      if (otherEndChar.test(res)) {
          console.log('=================== otherEndChar success====================')
      }

      if (otherStartChar.test(res)) {
          console.log('=================== otherStartChar success====================')
      }
      //去掉多余的字符
      res = res.replace(otherStartChar, '');
      res = res.replace(otherEndChar, '');

      return res;
  }



  function transf(str, isMix, isAttr) {
      var lagPropery = '';
      var py = chineseToPinYin(str.replace(/[\\\/\<\>0123456789\-\=`,\./"'~!@\#$%^&*()?:]/g, ''));
      //console.log( py );

      //进入到了正方法说明已经被转换了
      GLOBELCACHE.hasTrans = true;

      // console.log('debug===================================' + GLOBELCACHE.hasTrans)

      str = str.replace(/^['"]/, '');
      str = str.replace(/['"]$/, '')
      lagPropery =  '' + GLOBELOPTION.langkey+py +' : ' + str + '\r\n';
     

      fs.appendFile("./propertis.js", lagPropery);


      if (isMix) {
          //字符串str是单引号开头
          if (GLOBELCACHE.signleQuoteStart) {
              return "\'+" + ( GLOBELOPTION.langpath + py) + "+\'";
          } else {
              return "\"+" + (GLOBELOPTION.langpath + py) + "+\"";
          }
      } else if (isAttr) {
          //字符串str是单引号开头
          if (GLOBELCACHE.signleQuoteStart) {
              return "\"\'+" + ( GLOBELOPTION.langpath + py) + "+\'\"";
          } else { 
              return "\'\"+" + ( GLOBELOPTION.langpath + py) + "+\"\'";
          }
      } else {
          return (GLOBELOPTION.langpath + py);

          if (GLOBELCACHE.signleQuoteStart) {
              return "\'+" + ( GLOBELOPTION.langpath + py) + "+\'";
          } else {
              return "\"+" + ( GLOBELOPTION.langpath + py) + "+\"";
          }
      }


  };


  module.exports = {
      TransStr: TransStr,
      GLOBELCACHE: GLOBELCACHE
  };