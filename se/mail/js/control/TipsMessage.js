/**
 * @author Dream
 */
/**
 * Tipst������ʾ����
 * 
 */

function Tips_Message(width,height,title,contentHtml,speed)
{
    this.title  = title;   //����
    this.width    = width?width:200;//���  
    this.height = height?height:120; //�߶�
    this.speed    = speed; //����Ƶ��
    this.timer    = 0; 
    this.autoHide    = true; //�Ƿ��Զ�����
    this.HideTime = 6000;//���ٺ�������أ�
    this.innerHTML=contentHtml;
} 
//��ʾ����������
Tips_Message.prototype.hidden =function()
{
    var me =this;
    var down = function()
    {
        var height =parseInt(document.getElementById("tip").style.height); 
      
      if (parseInt(height)<=0)
      {
        document.getElementById("tip").style.display="none";
        clearInterval(me.timer);
      }
      else
       document.getElementById("tip").style.height=parseInt(height)-5+"px";
    }
    this.timer = setInterval(down,this.speed);

}
//��ʾ��������ʾ
Tips_Message.prototype.show=function()
{
    var obj = document.getElementById("tip");
    var width=this.width;
    var p_height = this.height+24;
    
   var str ="<DIV id ='tip' style='border:solid 1px #000000;overflow:hidden;display:none  Z-INDEX: 99999;width: "+width+"px;height:0px;  POSITION: absolute;right: 0px;bottom: 0px; '>";
       str +="<TABLE style='BORDER-TOP: #ffffff 1px solid; BORDER-LEFT: #ffffff 1px solid' cellSpacing=0 cellPadding=0 width='100%' border=0>"
       str +="<TR>";
       str +="<TD style='FONT-SIZE: 12px; width=30 height=24></TD>";
       str +="<TD style='PADDING-LEFT: 4px; FONT-WEIGHT: normal; FONT-SIZE: 12px; PADDING-TOP: 4px' vAlign=center width='100%'>"+this.title+"</TD><TD style='PADDING-RIGHT: 2px; PADDING-TOP: 2px' vAlign=center align=right width=19>";
       str +="<SPAN title=�ر� style='FONT-WEIGHT: bold; FONT-SIZE: 20px; CURSOR: hand; COLOR: red; MARGIN-RIGHT: 4px' id='btSysClose' >��</SPAN></TD>";
       str +="</TR>";
       str +="<tr><td colspan='3'>"
       str +=this.innerHTML;
       str +="</td></tr></table>"
       str +="</DIV>";
    document.write(str);
    var me  = this;  
    var up = function()
    {
     var height =parseInt(document.getElementById("tip").style.height); 
      if (parseInt(height)>=p_height)
      {
        clearInterval(me.timer);
      }
      else
       document.getElementById("tip").style.height=parseInt(height)+5+"px";
    }   
    this.timer = setInterval(up,this.speed);
 
    document.getElementById("btSysClose").onclick = function()
    {
        me.hidden();
    }
    if(me.autoHide)
     setTimeout(function(){ me.hidden() },me.HideTime);

} 