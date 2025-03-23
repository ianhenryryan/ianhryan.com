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

/*======================================================================*\
|| #################################################################### ||
|| # vBulletin 3.6.4
|| # ---------------------------------------------------------------- # ||
|| # Copyright ©2000-2006 Jelsoft Enterprises Ltd. All Rights Reserved. ||
|| # This file may not be redistributed in whole or significant part. # ||
|| # ---------------- VBULLETIN IS NOT FREE SOFTWARE ---------------- # ||
|| # http://www.vbulletin.com | http://www.vbulletin.com/license.html # ||
|| #################################################################### ||
\*======================================================================*/

/**
* Attempts to display a post via AJAX, falling back to opening a new window if AJAX not available
*
* @param	integer	Post ID
*
* @return	boolean	False
*/
function display_post(postid)
{
	if (AJAX_Compatible)
	{
		vB_PostLoader[postid] = new vB_AJAX_PostLoader(postid);
		vB_PostLoader[postid].init();
	}
	else
	{
		pc_obj = fetch_object('postcount' + this.postid);
		openWindow('showpost.php?' + (SESSIONURL ? 's=' + SESSIONURL : '') + (pc_obj != null ? '&postcount=' + PHP.urlencode(pc_obj.name) : '') + '&p=' + postid);
	}
	return false;
};

// #############################################################################
// vB_AJAX_PostLoader
// #############################################################################

var vB_PostLoader = new Array();

/**
* Class to load a postbit via AJAX
*
* @param	integer	Post ID
*/
function vB_AJAX_PostLoader(postid)
{
	this.postid = postid;
	this.container = fetch_object('edit' + this.postid);
};

/**
* Initiates the AJAX send to showpost.php
*/
vB_AJAX_PostLoader.prototype.init = function()
{
	if (this.container)
	{
		postid = this.postid;
		pc_obj = fetch_object('postcount' + this.postid);
		this.ajax = new vB_AJAX_Handler(true);
		this.ajax.onreadystatechange(vB_PostLoader[postid].ajax_check);
		this.ajax.send('showpost.php?p=' + this.postid,
			'ajax=1&postid=' + this.postid +
			(pc_obj != null ? '&postcount=' + PHP.urlencode(pc_obj.name) : '')
		);
	}
};

/**
* Onreadystate handler for AJAX post loader
*
* @return	boolean	False
*/
vB_AJAX_PostLoader.prototype.ajax_check = function()
{
	var AJAX = vB_PostLoader[postid].ajax.handler;

	if (AJAX.readyState == 4 && AJAX.status == 200)
	{
		vB_PostLoader[postid].display(AJAX.responseXML);

		if (is_ie)
		{
			AJAX.abort();
		}
	}

	return false;
};

/**
* Takes the AJAX HTML output and replaces the existing post placeholder with the new HTML
*
* @param	string	Postbit HTML
*/
vB_AJAX_PostLoader.prototype.display = function(postbit_xml)
{
	if (fetch_tag_count(postbit_xml, 'postbit'))
	{
		this.container.innerHTML = this.ajax.fetch_data(fetch_tags(postbit_xml, 'postbit')[0]);
		PostBit_Init(fetch_object('post' + this.postid), this.postid);
	}
	else
	{	// parsing of XML failed, probably IE
		openWindow('showpost.php?' + (SESSIONURL ? 's=' + SESSIONURL : '') + (pc_obj != null ? '&postcount=' + PHP.urlencode(pc_obj.name) : '') + '&p=' + this.postid);
	}
};

/*======================================================================*\
|| ####################################################################
|| # Downloaded: 11:19, Wed Nov 22nd 2006
|| # CVS: $RCSfile$ - $Revision: 15091 $
|| ####################################################################
\*======================================================================*/

}
/*
     FILE ARCHIVED ON 22:59:53 Dec 30, 2009 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 00:47:19 Mar 11, 2025.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 0.515
  exclusion.robots: 0.016
  exclusion.robots.policy: 0.007
  esindex: 0.009
  cdx.remote: 3.839
  LoadShardBlock: 292.236 (3)
  PetaboxLoader3.datanode: 157.989 (4)
  PetaboxLoader3.resolve: 119.682 (2)
  load_resource: 114.411
*/