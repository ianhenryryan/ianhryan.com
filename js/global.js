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

function gbSearchboxFocus(obj) {
	if (obj.value == 'Search') {
		obj.value = '';
	}
}

function gbDismissArenaAlert(alert_id) {
	document.getElementById("arena-alert").style.display = "none";
	if (CValidate.isNumeric(alert_id))
	{
		var alert_ids = CCookie.get("alerts");
		if (CValidate.isEmpty(alert_ids)) {
			alert_ids = alert_id.toString();
		}
		else {
			alert_ids += "," + alert_id.toString();
		}
		CCookie.set("alerts", alert_ids, 365);
	}
}

var lastTeamId = 0;
var avatar_height = 64;
var stats_init = false;
var avatarpopup = null;
var statspanel = null;

function avatarInit()
{
	if (!stats_init)
	{
		avatarpopup = document.getElementById("AvatarPopup");
		statspanel = document.getElementById("StatsPanel");
		stats_init = true;
	}
}

function avatarShowBig(e, teamId, avatar)
{
	avatarInit();

	if (lastTeamId == teamId) {
		return false;
	}

	var e = (e) ? e : window.event;
	var eSrc = (document.all) ? e.srcElement : e.target;
	var node = eSrc;

	while (node.nodeName != 'TR') {
		node = node.parentNode;
	}

	//offsetTop
	//offsetLeft

	if (e.pageX || e.pageY) {
		posx = e.pageX;
		posy = e.pageY;
	}
	else if (e.clientX || e.clientY) {
		posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}

	if (node.offsetTop <= node.offsetHeight + 10) {
		avatarpopup.style.top = node.offsetTop.toString() + "px";
	}
	else if (node.offsetTop > statspanel.offsetHeight - avatar_height / 2) {
		avatarpopup.style.top = (statspanel.offsetHeight - avatar_height).toString() + "px";
	}
	else {
		avatarpopup.style.top = (node.offsetTop - node.offsetHeight/2).toString() + "px";
	}

	avatarpopup.name = teamId;
	avatarpopup.src = avatar;
	avatarpopup.style.visibility = "visible";

	lastTeamId = teamId;
}

function avatarHideBig()
{
	if (avatarpopup != null)
	{
		if (avatarpopup.name == lastTeamId.toString())
		{
			avatarpopup.style.visibility = 'hidden';
			lastTeamId = 0;
		}
	}
}

function tabClickListener(event) {
	var e = CEvent.get(event);
	if (e) {
		var t = CEvent.getTarget(e);
		if (t) {
			ul = t.parentNode.parentNode;
			src = document.getElementById(t.href.split('#')[1]);
			document.getElementById(ul.id.split('_')[0]+"_Display").innerHTML = src.innerHTML;
			node = ul.firstChild;
			while (node != null) { if (node.nodeName == "LI") { node.className = ""; } node = node.nextSibling; }
			t.parentNode.className = "on";
		}
		CEvent.cancelBubble(e);
	}
	return false;
}

function registerTabbedRegion(id) {
	if (CBrowser.Features.GetById && CBrowser.Features.GetByTagName) {
		var obj = document.getElementById(id);
		if (obj) {
			var links = obj.getElementsByTagName("a");
			for (var i=0; i<links.length; i++) {
				links[i].className = "tab";
				if (/\btab\b/.exec(links[i].className)) {
					CEvent.add(links[i], "click", tabClickListener);
					CEvent.add(links[i], "mousedown", tabMousedownListener);
					if (i == 0) {
						tabClickListener({"target":links[i]});
					}
				}
			}
		}
	}
}

function tabMousedownListener(e) {
    CEvent.cancelBubble(e);
    return false;
}

function registerSelectBox(id, boxWidth, mnuWidth, mnuHeight) {
	var btn = document.getElementById("btn_"+id);
	CEvent.add(btn, "focus", sbOpen);
	CEvent.add(btn, "blur", sbClose);
    if (boxWidth != undefined) document.getElementById(id).parentNode.style.width = boxWidth + "px";
	var mnu = document.getElementById("mnu_"+id);
	if (mnuWidth != undefined) mnu.getElementsByTagName("ul")[0].style.width = (mnuWidth-2) + "px";
	if (mnuHeight != undefined) mnu.getElementsByTagName("ul")[0].style.height = mnuHeight + "px";
	var links = mnu.getElementsByTagName("a");
	for (var i=0; i<links.length; i++) {
		CEvent.add(links[i], "mousedown", sbClick);
	}
}
function sbOpen(e) {
	document.getElementById(CEvent.getTarget(e).id.replace("btn","mnu")).style.display='block';
}
function sbClose(e) {
	document.getElementById(CEvent.getTarget(e).id.replace("btn","mnu")).style.display='none';
}
function sbClick(e) {
	var tgt = CEvent.getTarget(e);
	document.getElementById(tgt.parentNode.parentNode.parentNode.id.replace("mnu_","")).value=tgt.href;
	document.getElementById(tgt.parentNode.parentNode.parentNode.id.replace("mnu","btn")).value=tgt.innerHTML;
	CEvent.cancelBubble(e);
	return false;
}

function registerJumpBox(id, boxWidth, mnuWidth, mnuHeight) {
	var btn = document.getElementById("btn_"+id);
	CEvent.add(btn, "click", jbOpen);
	CEvent.add(btn, "blur", jbClose);
    if (boxWidth != undefined) document.getElementById(id).parentNode.style.width = boxWidth + "px";
	var mnu = document.getElementById("mnu_"+id);
	if (mnuWidth != undefined) mnu.getElementsByTagName("ul")[0].style.width = (mnuWidth-2) + "px";
	if (mnuHeight != undefined) mnu.getElementsByTagName("ul")[0].style.height = mnuHeight + "px";
    var links = mnu.getElementsByTagName("a");
	for (var i=0; i<links.length; i++) {
		CEvent.add(links[i], "mousedown", jbClick);
	}
}
function jbOpen(e) {
    document.getElementById(CEvent.getTarget(e).id.replace("btn","mnu")).style.display='block';
}
function jbClose(e) {
	document.getElementById(CEvent.getTarget(e).id.replace("btn","mnu")).style.display='none';
}
function jbClick(e) {
	document.location.href=CEvent.getTarget(e).href;
}

function registerComboBox(id, boxWidth, mnuWidth, mnuHeight) {
	var box = document.getElementById(id);
	CEvent.add(box, "focus", cbOpen);
	CEvent.add(box, "blur", cbClose);
	CEvent.add(box, "keydown", cbKeydown);
    if (boxWidth != undefined) document.getElementById(id).parentNode.style.width = boxWidth + "px";
	var mnu = document.getElementById("mnu_"+id);
	if (mnuWidth != undefined) mnu.getElementsByTagName("ul")[0].style.width = (mnuWidth-2) + "px";
	if (mnuHeight != undefined) mnu.getElementsByTagName("ul")[0].style.height = mnuHeight + "px";
	var links = mnu.getElementsByTagName("a");
	for (var i=0; i<links.length; i++) {
		CEvent.add(links[i], "mousedown", cbClick);
	}
}
function cbOpen(e) {
	var tgt_id = CEvent.getTarget(e).id;
	document.getElementById(tgt_id).select();
	document.getElementById("mnu_"+tgt_id).style.display='block';
}
function cbClose(e) {
	document.getElementById("mnu_"+CEvent.getTarget(e).id).style.display='none';
}
function cbKeydown(e) {
	if (e.keyCode == 13) {
		cbClose(e);
		CEvent.getTarget(e).blur();
	}
}
function cbClick(e) {
	var tgt = CEvent.getTarget(e);
	document.getElementById(tgt.parentNode.parentNode.parentNode.id.replace("mnu_","")).value=tgt.innerHTML;
	CEvent.cancelBubble(e);
	return false;
}

function toggleMybarContent(type) {
	var obj_style = document.getElementById("mybar-content").style;
	var top = parseInt(obj_style.top) || 0;
	if (top <= 0) {
		obj_style.top = "-45px";
		CPosition.glideTo("mybar-content", null, 25, 6, 100);
		if (type == "login") {
			document.getElementById("login_username").focus();
			document.getElementById("login_username").select();
		}
		else if (type == "gamercard") {
			document.getElementById("gamercard_toggle").className = "collapse";
			CCookie.remove("gc_hide");
		}
	}
	else {
		obj_style.zIndex = "5";
		CPosition.glideTo("mybar-content", null, -45, 6, 5);
		if (type == "gamercard") {
			document.getElementById("gamercard_toggle").className = "expand";
			CCookie.set("gc_hide", 1, 365);
		}
	}
	return false;
}

function setSimpleUrl(objId, s, convertToLowerCase, overrideValue) {
	var url = convertToLowerCase ? s.toLowerCase() : s;
    url = url.replace(/[\ \_]/g, '-');
	url = url.replace(/\-+/g, '-');
    url = url.replace(/[^a-zA-Z0-9\-]/g, '');
	if (overrideValue) {
		document.getElementById(objId).value = url;
	}
	else {
		if (document.getElementById(objId).value.length == 0) {
			document.getElementById(objId).value = url;
		}
	}
}

function flagForDelete(obj, status, id) {
	obj.checked = status;
	obj.parentNode.parentNode.className = status ? "flag-delete" : "";
	document.getElementById("update_" + id).checked = false;
}

function flagForUpdate(obj, status, id) {
	obj.checked = status;
	obj.parentNode.parentNode.className = status ? "flag-update" : "";
	document.getElementById("remove_" + id).checked = false;
}

function toggleArenaHeader(obj) {
	if (obj.className == 'collapse') {
		obj.className = 'expand';
		document.getElementById('arena-logo').style.display='none';
		document.getElementById('arena-header').style.height='25px';
		document.getElementById('arena-menu').style.top='0px';
		CCookie.set("arenahdr_hide", 1, 7);
	}
	else {
		obj.className = 'collapse';
		document.getElementById('arena-logo').style.display='block';
		document.getElementById('arena-header').style.height='105px';
		document.getElementById('arena-menu').style.top='80px';
		CCookie.remove("arenahdr_hide");
	}
}

var stateImages = Array('expand.png','collapse.png');
var searchState = 0;
function toggleSearch(expandImageId) {
	searchState = 1 - searchState;
	if (searchState) {
		CVisibility.hide('filtersHint', VIS_DISPLAY);
		CVisibility.show('filters', VIS_DISPLAY);
	}
	else  {
		CVisibility.hide('filters', VIS_DISPLAY);
		CVisibility.show('filtersHint', VIS_DISPLAY);
	}
	document.getElementById('expandImage').src='/skins/common/'+stateImages[searchState];
}

function right(str, n)
{
	if (n <= 0) return "";
	if (n > String(str).length) return str;
	var len = String(str).length;
	return String(str).substring(len, len - n);
}

function submitDateForm()
{
	var form = document.getElementById('dateform');
	var year = form['year'][form['year'].selectedIndex].value;
	var month = form['month'][form['month'].selectedIndex].value;
	var day = form['day'][form['day'].selectedIndex].value;
	document.location.href = form.action + '?date=' + year + right("00"+month, 2) + right("00"+day, 2);
}

}
/*
     FILE ARCHIVED ON 14:59:03 Jan 04, 2010 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 00:47:19 Mar 11, 2025.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 0.645
  exclusion.robots: 0.03
  exclusion.robots.policy: 0.017
  esindex: 0.011
  cdx.remote: 7.278
  LoadShardBlock: 191.228 (3)
  PetaboxLoader3.datanode: 228.381 (4)
  PetaboxLoader3.resolve: 103.185 (2)
  load_resource: 160.864
*/