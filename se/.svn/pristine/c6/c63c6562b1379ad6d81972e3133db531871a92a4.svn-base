window.onload = function () {
   function initAppDomain(){
    var allcookies = document.cookie;
    var reg = /(^|;)\s*maindomain=([^;]*)\s*(;|$)/;
    var match = reg.exec(allcookies);
    var ret = "";
    if (match != null) {
        var value = match[2];
        ret = decodeURIComponent(value);
        if (ret && ret != location.host) {
            document.domain = ret;
        }
    }
}

initAppDomain();
    editor.setOpt({
        emotionLocalization:false
    });
	createTab();
    //emotion.SmileyPath = editor.options.emotionLocalization === true ? 'images/' : "http://img.baidu.com/hi/";
   // emotion.SmileyBox = createTabList( emotion.tabNum );
   // emotion.tabExist = createArr( emotion.tabNum );

  //  initImgName();
  //  initEvtHandler( "tabHeads" );
};

function initImgName() {
    for ( var pro in emotion.SmilmgName ) {
        var tempName = emotion.SmilmgName[pro],
                tempBox = emotion.SmileyBox[pro],
                tempStr = "";

        if ( tempBox.length ) return;
        for ( var i = 1; i <= tempName[1]; i++ ) {
            tempStr = tempName[0];
            if ( i < 10 ) tempStr = tempStr + '0';
            tempStr = tempStr + i + '.gif';
            tempBox.push( tempStr );
        }
    }
}

function initEvtHandler( conId ) {
    var tabHeads = $G( conId );
    for ( var i = 0, j = 0; i < tabHeads.childNodes.length; i++ ) {
        var tabObj = tabHeads.childNodes[i];
        if ( tabObj.nodeType == 1 ) {
            domUtils.on( tabObj, "click", (function ( index ) {
                return function () {
                    switchTab( index );
                };
            })( j ) );
            j++;
        }
    }
    switchTab( 0 );
    $G( "tabIconReview" ).style.display = 'none';
}

function InsertSmiley( url, evt ) {
    var obj = {
        src:"/resource/se/images/face/face"+url+".gif"
    };
    obj._src = obj.src;
    editor.execCommand( 'insertimage', obj );
    if ( !evt.ctrlKey ) {
        dialog.popup.hide();
    }
}




function createTab( tabName ) {
    var faceVersion = "?v=1.1", //版本号
            tab = $G( "tab0" ), //获取将要生成的Div句柄
			textHTML = ['<table>'];
			var index=0;
	for(var i =0;i<11;i++){
		textHTML.push( '<tr>' );
		for(var j=0;j<8;j++){
				if(index<84){
				 textHTML.push( '<td  class="js"   border="1" width="3%" style="border-collapse:collapse;" align="center"  bgcolor="transparent" onclick="InsertSmiley(\'' + index + '\',event)" ');
                textHTML.push( '<span>' );
                textHTML.push( '<i class="i-fc_'+index+'"></i>' );
                textHTML.push( '</span>' );
				textHTML.push( '</td>' );
				}else{
					textHTML.push( '<td></td>' );
				}
				index++;
		}
		   textHTML.push( '</tr>' );
	}
	textHTML.push( '</table>' );
    textHTML = textHTML.join( "" );
    tab.innerHTML = textHTML;

    
}

function over( td, srcPath, posFlag ) {
    td.style.backgroundColor = "#ACCD3C";
    $G( 'faceReview' ).style.backgroundImage = "url(/resource/se/images/face/face"+index+".gif)";
    //if ( posFlag == 1 ) $G( "tabIconReview" ).className = "show";
    //$G( "tabIconReview" ).style.display = 'block';
}

function out( td ) {
    td.style.backgroundColor = "transparent";
    var tabIconRevew = $G( "tabIconReview" );
    tabIconRevew.className = "";
    tabIconRevew.style.display = 'none';
}

function createTabList( tabNum ) {
    var obj = {};
    for ( var i = 0; i < tabNum; i++ ) {
        obj["tab" + i] = [];
    }
    return obj;
}

function createArr( tabNum ) {
    var arr = [];
    for ( var i = 0; i < tabNum; i++ ) {
        arr[i] = 0;
    }
    return arr;
}

