var _____WB$wombat$assign$function_____ = function(name) {return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name)) || self[name]; };
if (!self.__WB_pmw) { self.__WB_pmw = function(obj) { this.__WB_source = obj; return this; } }
{
  let window = _____WB$wombat$assign$function_____("window");
  let self = _____WB$wombat$assign$function_____("self");
  let document = _____WB$wombat$assign$function_____("document");
  let location = _____WB$wombat$assign$function_____("location");
  let top = _____WB$wombat$assign$function_____("top");
  let parent = _____WB$wombat$assign$function_____("parent");
  let frames = _____WB$wombat$assign$function_____("frames");
  let opener = _____WB$wombat$assign$function_____("opener");

//
// For correct measurement, DO NOT HOST THIS FROM ANOTHER SERVER
//
function _qcdst(){if(_qctzoff(0)!=_qctzoff(6))return 1;return 0;}
function _qctzoff(m){
var d1=new Date(2000,m,1,0,0,0,0);
var t=d1.toGMTString();
var d3=new Date(t.substring(0,t.lastIndexOf(" ")-1));
return d1-d3;
}
function _qceuc(s){
if(typeof(encodeURIComponent)=='function'){return encodeURIComponent(s);}
else{return escape(s);}
}
function _qcrnd(){return Math.round(Math.random()*2147483647);}
function _qcgc(n){
 var v='';
 var c=document.cookie;if(!c)return v;
 var i=c.indexOf(n+"=");
 var len=i+n.length+1;
 if(i>-1){
  var end=c.indexOf(";", len);
  if(end<0)end=c.length;
  v=c.substring(len,end);
 }
 return v;
}
function _qcdomain(){
 var d=document.domain;
 if(d.substring(0,4)=="www.")d=d.substring(4,d.length);
 var a=d.split(".");var len=a.length;
 if(len<3)return d;
 var e=a[len-1];
 if(e.length<3)return d;
 d=a[len-2]+"."+a[len-1];
 return d;
}
function _qcsc(m){
 var s="";var d=_qcdomain();
 if (m=="ad"||d=="doubleclick.net"||d=="atdmt.com"||d=="yieldmanager.com"||d=="fimserve.com"||
  d=="tribalfusion.com"||d=="trafficmp.com"){s+=";fpan=u;fpa=";return s;}
 var u=document;var a=_qcgc("__qca");
 if(a.length>0){s+=";fpan=0;fpa="+a;}
 else{
  var da=new Date();
  a='P0-'+_qcrnd()+'-'+da.getTime();
  u.cookie="__qca="+a+"; expires=Sun, 18 Jan 2038 00:00:00 GMT; path=/; domain="+d;
  a=_qcgc("__qca");
  if(a.length>0){s+=";fpan=1;fpa="+a;}
  else{s+=";fpan=u;fpa=";}
 }
 return s;
}
function _qcdc(n){
 document.cookie=n+"=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/; domain="+_qcdomain();
}
function _qpxload(){
 if((_qimg)&& typeof _qimg.width =="number"){
  if (_qimg.width==3){_qcdc("__qca");}
}}
function quantserve(){
 var r=_qcrnd();
 var sr='',qo='',qm='',url='',ref='',je='u',ns='1',media='webpage',event='load';
 if(typeof _qoptions !="undefined" && _qoptions!=null){
  for(var k in _qoptions){
   if(typeof(_qoptions[k])!='string'){continue;}
   if(k=='qacct'){_qacct=_qoptions[k];}
   else{qo+=';'+k+'='+_qceuc(_qoptions[k]);}
   if(k=='media'){media=_qoptions[k];}
   if(k=='event'){event=_qoptions[k];}
  }
  _qoptions=null;
 }
 if((typeof _qacct =="undefined")||(_qacct.length==0))return;
 if(media=='webpage' && event=='load'){
  if((typeof _qpixelsent !="undefined")&&(_qpixelsent==_qacct))return;
  _qpixelsent=_qacct;}
 var ce=(navigator.cookieEnabled)?"1":"0";
 if(typeof navigator.javaEnabled !='undefined')je=(navigator.javaEnabled())?"1":"0";
 if(typeof _qmeta !="undefined" && _qmeta!=null){qm=';m='+_qceuc(_qmeta);_qmeta=null;}
 if(self.screen){sr=screen.width+"x"+screen.height+"x"+screen.colorDepth;}
 var d=new Date();
 var dst=_qcdst();
 var dg="P10076-u-u-u";var qs="http://web.archive.org/web/20100224203830/http://pixel.quantserve.com";
 var fp=_qcsc(media);
 if(window.location && window.location.href)url=_qceuc(window.location.href);
 if(window.document && window.document.referrer)ref=_qceuc(window.document.referrer);
 if(self==top)ns='0';
 _qimg=new Image();
 _qimg.alt="";
 _qimg.src=qs+'/pixel'+';r='+r+fp+';ns='+ns+';url='+url+';ref='+ref+';ce='+ce+';je='+je+';sr='+sr+';dg='+dg+';dst='+dst+';et='+d.getTime()+';tzo='+d.getTimezoneOffset()+';a='+_qacct+qo+qm;
 _qimg.onload=function() {_qpxload();}
}
quantserve();


}
/*
     FILE ARCHIVED ON 20:38:30 Feb 24, 2010 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 00:47:19 Mar 11, 2025.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 0.964
  exclusion.robots: 0.031
  exclusion.robots.policy: 0.013
  esindex: 0.014
  cdx.remote: 45.771
  LoadShardBlock: 427.691 (6)
  PetaboxLoader3.datanode: 224.096 (7)
  PetaboxLoader3.resolve: 175.565 (2)
  load_resource: 198.358
*/