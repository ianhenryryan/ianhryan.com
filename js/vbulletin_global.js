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
|| # Copyright �2000-2006 Jelsoft Enterprises Ltd. All Rights Reserved. ||
|| # This file may not be redistributed in whole or significant part. # ||
|| # ---------------- VBULLETIN IS NOT FREE SOFTWARE ---------------- # ||
|| # http://www.vbulletin.com | http://www.vbulletin.com/license.html # ||
|| #################################################################### ||
\*======================================================================*/

// #############################################################################
// Initial setup

// ensure SESSIONURL exists
if (typeof SESSIONURL == 'undefined')
{
	SESSIONURL = '';
}

// ensure vbphrase exists
if (typeof vbphrase == 'undefined')
{
	vbphrase = new Array();
}

// Array of message editor objects
var vB_Editor = new Array();

// Ignore characters within [quote] tags in messages for length check
var ignorequotechars = false;

// Number of pagenav items dealt with so far
var pagenavcounter = 0;

// #############################################################################
// Browser detection and limitation workarounds

// DefinevB_AJAX_XML_Builder the browser we have instead of multiple calls throughout the file
var userAgent = navigator.userAgent.toLowerCase();
var is_opera  = ((userAgent.indexOf('opera') != -1) || (typeof(window.opera) != 'undefined'));
var is_saf    = ((userAgent.indexOf('applewebkit') != -1) || (navigator.vendor == 'Apple Computer, Inc.'));
var is_webtv  = (userAgent.indexOf('webtv') != -1);
var is_ie     = ((userAgent.indexOf('msie') != -1) && (!is_opera) && (!is_saf) && (!is_webtv));
var is_ie4    = ((is_ie) && (userAgent.indexOf('msie 4.') != -1));
var is_moz    = ((navigator.product == 'Gecko') && (!is_saf));
var is_kon    = (userAgent.indexOf('konqueror') != -1);
var is_ns     = ((userAgent.indexOf('compatible') == -1) && (userAgent.indexOf('mozilla') != -1) && (!is_opera) && (!is_webtv) && (!is_saf));
var is_ns4    = ((is_ns) && (parseInt(navigator.appVersion) == 4));
var is_mac    = (userAgent.indexOf('mac') != -1);

// Catch possible bugs with WebTV and other older browsers
var is_regexp = (window.RegExp) ? true : false;

// Is the visiting browser compatible with AJAX?
var AJAX_Compatible = false;

// Help out old versions of IE that don't understand element.style.cursor = 'pointer'
var pointer_cursor = (is_ie ? 'hand' : 'pointer');

/**
* Workaround for heinous IE bug - add special vBlength property to all strings
* This method is applied to ALL string objects automatically
*
* @return	integer
*/
String.prototype.vBlength = function()
{
	return (is_ie && this.indexOf('\n') != -1) ? this.replace(/\r?\n/g, '_').length : this.length;
}

/**
* Pop function for browsers that don't have it built in
*
* @param	array	Array from which to pop
*
* @return	mixed	null on empty, value on success
*/
function array_pop(a)
{
	if (typeof a != 'object' || !a.length)
	{
		return null;
	}
	else
	{
		var response = a[a.length - 1];
		a.length--;
		return response;
	}
}

if (typeof Array.prototype.shift === 'undefined')
{
	Array.prototype.shift = function()
	{
		for(var i = 0, b = this[0], l = this.length-1; i < l; i++)
		{
			this[i] = this[i + 1];
		}
		this.length--;
		return b;
	};
}

/**
* Push function for browsers that don't have it built in
*
* @param	array	Array onto which to push
* @param	mixed	Value to push onto array
*
* @return	integer	Length of array
*/
function array_push(a, value)
{
	a[a.length] = value;
	return a.length;
}

/**
* Function to emulate document.getElementById
*
* @param	string	Object ID
*
* @return	mixed	null if not found, object if found
*/
function fetch_object(idname)
{
	if (document.getElementById)
	{
		return document.getElementById(idname);
	}
	else if (document.all)
	{
		return document.all[idname];
	}
	else if (document.layers)
	{
		return document.layers[idname];
	}
	else
	{
		return null;
	}
}

/**
* Function to emulate document.getElementsByTagName
*
* @param	object	Parent object (eg: document)
* @param	string	Tag type (eg: 'td')
*
* @return	array
*/
function fetch_tags(parentobj, tag)
{
	if (parentobj == null)
	{
		return new Array();
	}
	else if (typeof parentobj.getElementsByTagName != 'undefined')
	{
		return parentobj.getElementsByTagName(tag);
	}
	else if (parentobj.all && parentobj.all.tags)
	{
		return parentobj.all.tags(tag);
	}
	else
	{
		return new Array();
	}
}

/**
* Function to count the number of tags in an object
*
* @param	object	Parent object (eg: document)
* @param	string	Tag type (eg: 'td')
*
* @return	integer
*/
function fetch_tag_count(parentobj, tag)
{
	return fetch_tags(parentobj, tag).length;
}

// #############################################################################
// Event handlers

/**
* Handles the different event models of different browsers and prevents event bubbling
*
* @param	event	Event object
*
* @return	event
*/
function do_an_e(eventobj)
{
	if (!eventobj || is_ie)
	{
		window.event.returnValue = false;
		window.event.cancelBubble = true;
		return window.event;
	}
	else
	{
		eventobj.stopPropagation();
		eventobj.preventDefault();
		return eventobj;
	}
}

/**
* Handles the different event models of different browsers and prevents event bubbling in a lesser way than do_an_e()
*
* @param	event	Event object
*
* @return	event
*/
function e_by_gum(eventobj)
{
	if (!eventobj || is_ie)
	{
		window.event.cancelBubble = true;
		return window.event;
	}
	else
	{
		if (eventobj.target.type == 'submit')
		{
			// naughty safari
			eventobj.target.form.submit();
		}
		eventobj.stopPropagation();
		return eventobj;
	}
}

// #############################################################################
// Message manipulation and validation

/**
* Checks that a message is valid for submission to PHP
*
* @param	string	Message text
* @param	mixed	Either subject text (if you want to make sure it exists) or 0 if you don't care
* @param	integer	Minimum acceptable character limit for the message
*
* @return	boolean
*/
function validatemessage(messagetext, subjecttext, minchars)
{
	if (is_kon || is_saf || is_webtv)
	{
		// ignore less-than-capable browsers
		return true;
	}
	else if (subjecttext.length < 1)
	{
		// subject not specified
		alert(vbphrase['must_enter_subject']);
		return false;
	}
	else
	{
		var stripped = PHP.trim(stripcode(messagetext, false, ignorequotechars));

		if (stripped.length < minchars)
		{
			// minimum message length not met
			alert(construct_phrase(vbphrase['message_too_short'], minchars));
			return false;
		}
		else if (typeof(document.forms.vbform) != 'undefined' && typeof(document.forms.vbform.imagestamp) != 'undefined')
		{	// This form has image verification enabled
			if (document.forms.vbform.imagestamp.value.length != 6)
			{
				alert(vbphrase['complete_image_verification']);
				document.forms.vbform.imagestamp.focus();
				return false;
			}
			else
			{
				return true;
			}
		}
		else
		{
			// everything seems ok
			return true;
		}
	}
}

/**
* Strips quotes and bbcode tags from text
*
* @param	string	Text to manipulate
* @param	boolean	If true, strip <x> otherwise strip [x]
* @param	boolean	If true, strip all [quote]...contents...[/quote]
*
* @return	string
*/
function stripcode(str, ishtml, stripquotes)
{
	if (!is_regexp)
	{
		return str;
	}

	if (stripquotes)
	{
		var start_time = new Date().getTime();

		while ((startindex = PHP.stripos(str, '[quote')) !== false)
		{
			if (new Date().getTime() - start_time > 2000)
			{
				// while loop has been running for over 2 seconds and has probably gone infinite
				break;
			}

			if ((stopindex = PHP.stripos(str, '[/quote]')) !== false)
			{
				fragment = str.substr(startindex, stopindex - startindex + 8);
				str = str.replace(fragment, '');
			}
			else
			{
				break;
			}
			str = PHP.trim(str);
		}
	}

	if (ishtml)
	{
		// exempt image tags -- they need to count as characters in the string
		// as the do as BB codes
		str = str.replace(/<img[^>]+src="([^"]+)"[^>]*>/gi, '$1');

		var html1 = new RegExp("<(\\w+)[^>]*>", 'gi');
		var html2 = new RegExp("<\\/\\w+>", 'gi');

		str = str.replace(html1, '');
		str = str.replace(html2, '');

		var html3 = new RegExp('(&nbsp;)', 'gi');
		str = str.replace(html3, ' ');
	}
	else
	{
		var bbcode1 = new RegExp("\\[(\\w+)[^\\]]*\\]", 'gi');
		var bbcode2 = new RegExp("\\[\\/(\\w+)\\]", 'gi');

		str = str.replace(bbcode1, '');
		str = str.replace(bbcode2, '');
	}

	return str;
}

// #############################################################################
// vB_PHP_Emulator class
// #############################################################################

/**
* PHP Function Emulator Class
*/
function vB_PHP_Emulator()
{
}

// =============================================================================
// vB_PHP_Emulator Methods

/**
* Find a string within a string (case insensitive)
*
* @param	string	Haystack
* @param	string	Needle
* @param	integer	Offset
*
* @return	mixed	Not found: false / Found: integer position
*/
vB_PHP_Emulator.prototype.stripos = function(haystack, needle, offset)
{
	if (typeof offset == 'undefined')
	{
		offset = 0;
	}

	index = haystack.toLowerCase().indexOf(needle.toLowerCase(), offset);

	return (index == -1 ? false : index);
}

/**
* Trims leading whitespace
*
* @param	string	String to trim
*
* @return	string
*/
vB_PHP_Emulator.prototype.ltrim = function(str)
{
	return str.replace(/^\s+/g, '');
}

/**
* Trims trailing whitespace
*
* @param	string	String to trim
*
* @return	string
*/
vB_PHP_Emulator.prototype.rtrim = function(str)
{
	return str.replace(/(\s+)$/g, '');
}

/**
* Trims leading and trailing whitespace
*
* @param	string	String to trim
*
* @return	string
*/
vB_PHP_Emulator.prototype.trim = function(str)
{
	return this.ltrim(this.rtrim(str));
}

/**
* Emulation of PHP's preg_quote()
*
* @param	string	String to process
*
* @return	string
*/
vB_PHP_Emulator.prototype.preg_quote = function(str)
{
	// replace + { } ( ) [ ] | / ? ^ $ \ . = ! < > : * with backslash+character
	return str.replace(/(\+|\{|\}|\(|\)|\[|\]|\||\/|\?|\^|\$|\\|\.|\=|\!|\<|\>|\:|\*)/g, "\\$1");
}

/**
* Emulates unhtmlspecialchars in vBulletin
*
* @param	string	String to process
*
* @return	string
*/
vB_PHP_Emulator.prototype.unhtmlspecialchars = function(str)
{
	f = new Array(/&lt;/g, /&gt;/g, /&quot;/g, /&amp;/g);
	r = new Array('<', '>', '"', '&');

	for (var i in f)
	{
		str = str.replace(f[i], r[i]);
	}

	return str;
}

/**
* Unescape CDATA from vB_AJAX_XML_Builder PHP class
*
* @param	string	Escaped CDATA
*
* @return	string
*/
vB_PHP_Emulator.prototype.unescape_cdata = function(str)
{
	var r1 = /<\=\!\=\[\=C\=D\=A\=T\=A\=\[/g;
	var r2 = /\]\=\]\=>/g;

	return str.replace(r1, '<![CDATA[').replace(r2, ']]>');
}

/**
* Emulates PHP's htmlspecialchars()
*
* @param	string	String to process
*
* @return	string
*/
vB_PHP_Emulator.prototype.htmlspecialchars = function(str)
{
	//var f = new Array(/&(?!#[0-9]+;)/g, /</g, />/g, /"/g);
	var f = new Array(
		(is_mac && is_ie ? new RegExp('&', 'g') : new RegExp('&(?!#[0-9]+;)', 'g')),
		new RegExp('<', 'g'),
		new RegExp('>', 'g'),
		new RegExp('"', 'g')
	);
	var r = new Array(
		'&amp;',
		'&lt;',
		'&gt;',
		'&quot;'
	);

	for (var i = 0; i < f.length; i++)
	{
		str = str.replace(f[i], r[i]);
	}

	return str;
}

/**
* Searches an array for a value
*
* @param	string	Needle
* @param	array	Haystack
* @param	boolean	Case insensitive
*
* @return	integer	Not found: -1 / Found: integer index
*/
vB_PHP_Emulator.prototype.in_array = function(ineedle, haystack, caseinsensitive)
{
	var needle = new String(ineedle);

	if (caseinsensitive)
	{
		needle = needle.toLowerCase();
		for (var i in haystack)
		{
			if (haystack[i].toLowerCase() == needle)
			{
				return i;
			}
		}
	}
	else
	{
		for (var i in haystack)
		{
			if (haystack[i] == needle)
			{
				return i;
			}
		}
	}
	return -1;
}

/**
* Emulates PHP's strpad()
*
* @param	string	Text to pad
* @param	integer	Length to pad
* @param	string	String with which to pad
*
* @return	string
*/
vB_PHP_Emulator.prototype.str_pad = function(text, length, padstring)
{
	text = new String(text);
	padstring = new String(padstring);

	if (text.length < length)
	{
		padtext = new String(padstring);

		while (padtext.length < (length - text.length))
		{
			padtext += padstring;
		}

		text = padtext.substr(0, (length - text.length)) + text;
	}

	return text;
}

/**
* A sort of emulation of PHP's urlencode - not 100% the same, but accomplishes the same thing
*
* @param	string	String to encode
*
* @return	string
*/
vB_PHP_Emulator.prototype.urlencode = function(text)
{
	text = escape(text.toString()).replace(/\+/g, "%2B");

	// this escapes 128 - 255, as JS uses the unicode code points for them.
	// This causes problems with submitting text via AJAX with the UTF-8 charset.
	var matches = text.match(/(%([0-9A-F]{2}))/gi);
	if (matches)
	{
		for (var matchid = 0; matchid < matches.length; matchid++)
		{
			var code = matches[matchid].substring(1,3);
			if (parseInt(code, 16) >= 128)
			{
				text = text.replace(matches[matchid], '%u00' + code);
			}
		}
	}

	// %25 gets translated to % by PHP, so if you have %25u1234,
	// we see it as %u1234 and it gets translated. So make it %u0025u1234,
	// which will print as %u1234!
	text = text.replace('%25', '%u0025');

	return text;
}

/**
* Works a bit like ucfirst, but with some extra options
*
* @param	string	String with which to work
* @param	string	Cut off string before first occurence of this string
*
* @return	string
*/
vB_PHP_Emulator.prototype.ucfirst = function(str, cutoff)
{
	if (typeof cutoff != 'undefined')
	{
		var cutpos = str.indexOf(cutoff);
		if (cutpos > 0)
		{
			str = str.substr(0, cutpos);
		}
	}

	str = str.split(' ');
	for (var i = 0; i < str.length; i++)
	{
		str[i] = str[i].substr(0, 1).toUpperCase() + str[i].substr(1);
	}
	return str.join(' ');
}

// initialize the PHP emulator
var PHP = new vB_PHP_Emulator();

// #############################################################################
// vB_AJAX_Handler
// #############################################################################

/**
* XML Sender Class
*
* @param	boolean	Should connections be asyncronous?
*/
function vB_AJAX_Handler(async)
{
	/**
	* Should connections be asynchronous?
	*
	* @var	boolean
	*/
	this.async = async ? true : false;
}

// =============================================================================
// vB_AJAX_Handler methods

/**
* Initializes the XML handler
*
* @return	boolean	True if handler created OK
*/
vB_AJAX_Handler.prototype.init = function()
{
	if (typeof vb_disable_ajax != 'undefined' && vb_disable_ajax == 2)
	{
		// disable all ajax features
		return false;
	}

	try
	{
		this.handler = new XMLHttpRequest();
		return (this.handler.setRequestHeader ? true : false);
	}
	catch(e)
	{
		try
		{
			this.handler = eval("new A" + "ctiv" + "eX" + "Ob" + "ject('Micr" + "osoft.XM" + "LHTTP');");
			return true;
		}
		catch(e)
		{
			return false;
		}
	}
}

/**
* Detects if the browser is fully compatible
*
* @return	boolean
*/
vB_AJAX_Handler.prototype.is_compatible = function()
{
	if (typeof vb_disable_ajax != 'undefined' && vb_disable_ajax == 2)
	{
		// disable all ajax features
		return false;
	}

	if (is_ie && !is_ie4) { return true; }
	else if (typeof XMLHttpRequest != 'undefined')
	{
		try { return XMLHttpRequest.prototype.setRequestHeader ? true : false; }
		catch(e)
		{
			try { var tester = new XMLHttpRequest(); return tester.setRequestHeader ? true : false; }
			catch(e) { return false; }
		}
	}
	else { return false; }
}

/**
* Checks if the system is ready
*
* @return	boolean	False if ready
*/
vB_AJAX_Handler.prototype.not_ready = function()
{
	return (this.handler.readyState && (this.handler.readyState < 4));
}

/**
* OnReadyStateChange event handler
*
* @param	function
*/
vB_AJAX_Handler.prototype.onreadystatechange = function(event)
{
	if (!this.handler)
	{
		if  (!this.init())
		{
			return false;
		}
	}
	if (typeof event == 'function')
	{
		this.handler.onreadystatechange = event;
	}
	else
	{
		alert('XML Sender OnReadyState event is not a function');
	}
}

/**
* Sends data
*
* @param	string	Destination URL
* @param	string	Request Data
*
* @return	mixed	Return message
*/
vB_AJAX_Handler.prototype.send = function(desturl, datastream)
{
	if (!this.handler)
	{
		if (!this.init())
		{
			return false;
		}
	}
	if (!this.not_ready())
	{
		this.handler.open('POST', desturl, this.async);
		this.handler.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		this.handler.send(datastream + '&s=' + fetch_sessionhash());

		if (!this.async && this.handler.readyState == 4 && this.handler.status == 200)
		{
			return true;
		}
	}
	return false;
}

/**
* Fetches the contents of an XML node
*
* @param	object	XML node
*
* @return	string	XML node contents
*/
vB_AJAX_Handler.prototype.fetch_data = function(xml_node)
{
	if (xml_node && xml_node.firstChild && xml_node.firstChild.nodeValue)
	{
		return PHP.unescape_cdata(xml_node.firstChild.nodeValue);
	}
	else
	{
		return '';
	}
}

// we can check this variable to see if browser is AJAX compatible
var AJAX_Compatible = vB_AJAX_Handler.prototype.is_compatible();

// #############################################################################
// vB_Hidden_Form
// #############################################################################

/**
* Form Generator Class
*
* Builds a form filled with hidden fields for invisible submit via POST
*
* @param	string	Script (my_target_script.php)
*/
function vB_Hidden_Form(script)
{
	this.action = script;
	this.variables = new Array();
}

// =============================================================================
// vB_Hidden_Form methods

/**
* Adds a hidden input field to the form object
*
* @param	string	Name attribute
* @param	string	Value attribute
*/
vB_Hidden_Form.prototype.add_variable = function(name, value)
{
	this.variables[this.variables.length] = new Array(name, value);
};

/**
* Fetches all form elements inside an HTML element and performs 'add_input()' on them
*
* @param	object	HTML element to search
*/
vB_Hidden_Form.prototype.add_variables_from_object = function(obj)
{
	var inputs = fetch_tags(obj, 'input');
	for (var i = 0; i < inputs.length; i++)
	{
		switch (inputs[i].type)
		{
			case 'checkbox':
			case 'radio':
				if (inputs[i].checked)
				{
					this.add_variable(inputs[i].name, inputs[i].value);
				}
				break;
			case 'text':
			case 'hidden':
			case 'password':
				this.add_variable(inputs[i].name, inputs[i].value);
				break;
			default:
				continue;
		}
	}

	var textareas = fetch_tags(obj, 'textarea');
	for (var i = 0; i < textareas.length; i++)
	{
		this.add_variable(textareas[i].name, textareas[i].value);
	}

	var selects = fetch_tags(obj, 'select');
	for (var i = 0; i < selects.length; i++)
	{
		if (selects[i].multiple)
		{
			for (var j = 0; j < selects[i].options.length; j++)
			{
				if (selects[i].options[j].selected)
				{
					this.add_variable(selects[i].name, selects[i].options[j].value);
				}
			}
		}
		else
		{
			this.add_variable(selects[i].name, selects[i].options[selects[i].selectedIndex].value);
		}
	}
};

/**
* Fetches a variable value
*
* @param	string	Variable name
*
* @return	mixed	Variable value
*/
vB_Hidden_Form.prototype.fetch_variable = function(varname)
{
	for (var i = 0; i < this.variables.length; i++)
	{
		if (this.variables[i][0] == varname)
		{
			return this.variables[i][1];
		}
	}

	return null;
};

/**
* Submits the hidden form object
*/
vB_Hidden_Form.prototype.submit_form = function()
{
	this.form = document.createElement('form');
	this.form.method = 'post';
	this.form.action = this.action;

	for (var i = 0; i < this.variables.length; i++)
	{
		var inputobj = document.createElement('input');

		inputobj.type  = 'hidden';
		inputobj.name  = this.variables[i][0];
		inputobj.value = this.variables[i][1];

		this.form.appendChild(inputobj);
	}

	document.body.appendChild(this.form).submit();
};

/**
* Builds a URI query string from the given variables
*/
vB_Hidden_Form.prototype.build_query_string = function()
{
	var query_string = '';

	for (var i = 0; i < this.variables.length; i++)
	{
		query_string += this.variables[i][0] + '=' + PHP.urlencode(this.variables[i][1]) + '&';
	}

	return query_string;
}

/**
* Legacy functions for backward compatability
*/
vB_Hidden_Form.prototype.add_input = vB_Hidden_Form.prototype.add_variable;
vB_Hidden_Form.prototype.add_inputs_from_object = vB_Hidden_Form.prototype.add_variables_from_object;

// #############################################################################
// Window openers and instant messenger wrappers

/**
* Opens a generic browser window
*
* @param	string	URL
* @param	integer	Width
* @param	integer	Height
* @param	string	Optional Window ID
*/
function openWindow(url, width, height, windowid)
{
	return window.open(
		url,
		(typeof windowid == 'undefined' ? 'vBPopup' : windowid),
		'statusbar=no,menubar=no,toolbar=no,scrollbars=yes,resizable=yes'
		+ (typeof width != 'undefined' ? (',width=' + width) : '') + (typeof height != 'undefined' ? (',height=' + height) : '')
	);
}

/**
* Opens control panel help window
*
* @param	string	Script name
* @param	string	Action type
* @param	string	Option value
*
* @return	window
*/
function js_open_help(scriptname, actiontype, optionval)
{
	return openWindow(
		'help.php?s=' + SESSIONHASH + '&do=answer&page=' + scriptname + '&pageaction=' + actiontype + '&option=' + optionval,
		600, 450, 'helpwindow'
	);
}

/**
* Opens a window to show a list of attachments in a thread (misc.php?do=showattachments)
*
* @param	integer	Thread ID
*
* @return	window
*/
function attachments(threadid)
{
	return openWindow(
		'misc.php?' + SESSIONURL + 'do=showattachments&t=' + threadid,
		480, 300
	);
}

/**
* Opens a window to show a list of posters in a thread (misc.php?do=whoposted)
*
* @param	integer	Thread ID
*
* @return	window
*/
function who(threadid)
{
	return openWindow(
		'misc.php?' + SESSIONURL + 'do=whoposted&t=' + threadid,
		230, 300
	);
}

/**
* Opens an IM Window
*
* @param	string	IM type
* @param	integer	User ID
* @param	integer	Width of window
* @param	integer	Height of window
*
* @return	window
*/
function imwindow(imtype, userid, width, height)
{
	return openWindow(
		'sendmessage.php?' + SESSIONURL + 'do=im&type=' + imtype + '&u=' + userid,
		width, height
	);
}

/**
* Sends an MSN message
*
* @param	string	Target MSN handle
*
* @return	boolean	false
*/
function SendMSNMessage(name)
{
	if (!is_ie)
	{
		alert(vbphrase['msn_functions_only_work_in_ie']);
		return false;
	}
	else
	{
		MsgrObj.InstantMessage(name);
		return false;
	}
}

/**
* Adds an MSN Contact (requires MSN)
*
* @param	string	MSN handle
*
* @return	boolean	false
*/
function AddMSNContact(name)
{
	if (!is_ie)
	{
		alert(vbphrase['msn_functions_only_work_in_ie']);
		return false;
	}
	else
	{
		MsgrObj.AddContact(0, name);
		return false;
	}
}

/**
* Detects Caps-Lock when a key is pressed
*
* @param	event
*
* @return	boolean	True if Caps-Lock is on
*/
function detect_caps_lock(e)
{
	e = (e ? e : window.event);

	var keycode = (e.which ? e.which : (e.keyCode ? e.keyCode : (e.charCode ? e.charCode : 0)));
	var shifted = (e.shiftKey || (e.modifiers && (e.modifiers & 4)));
	var ctrled = (e.ctrlKey || (e.modifiers && (e.modifiers & 2)));

	// if characters are uppercase without shift, or lowercase with shift, caps-lock is on.
	return (keycode >= 65 && keycode <= 90 && !shifted && !ctrled) || (keycode >= 97 && keycode <= 122 && shifted);
}

// #############################################################################
// Cookie handlers

/**
* Sets a cookie
*
* @param	string	Cookie name
* @param	string	Cookie value
* @param	date	Cookie expiry date
*/
function set_cookie(name, value, expires)
{
	document.cookie = name + '=' + escape(value) + '; path=/' + (typeof expires != 'undefined' ? '; expires=' + expires.toGMTString() : '');
}

/**
* Deletes a cookie
*
* @param	string	Cookie name
*/
function delete_cookie(name)
{
	document.cookie = name + '=' + '; expires=Thu, 01-Jan-70 00:00:01 GMT' +  '; path=/';
}

/**
* Fetches the value of a cookie
*
* @param	string	Cookie name
*
* @return	string
*/
function fetch_cookie(name)
{
	cookie_name = name + '=';
	cookie_length = document.cookie.length;
	cookie_begin = 0;
	while (cookie_begin < cookie_length)
	{
		value_begin = cookie_begin + cookie_name.length;
		if (document.cookie.substring(cookie_begin, value_begin) == cookie_name)
		{
			var value_end = document.cookie.indexOf (';', value_begin);
			if (value_end == -1)
			{
				value_end = cookie_length;
			}
			return unescape(document.cookie.substring(value_begin, value_end));
		}
		cookie_begin = document.cookie.indexOf(' ', cookie_begin) + 1;
		if (cookie_begin == 0)
		{
			break;
		}
	}
	return null;
}

// #############################################################################
// Form element managers (used for 'check all' type systems

/**
* Sets all checkboxes, radio buttons or selects in a given form to a given state, with exceptions
*
* @param	object	Form object
* @param	string	Target element type (one of 'radio', 'select-one', 'checkbox')
* @param	string	Selected option in case of 'radio'
* @param	array	Array of element names to be excluded
* @param	mixed	Value to give to found elements
*/
function js_toggle_all(formobj, formtype, option, exclude, setto)
{
	for (var i =0; i < formobj.elements.length; i++)
	{
		var elm = formobj.elements[i];
		if (elm.type == formtype && PHP.in_array(elm.name, exclude, false) == -1)
		{
			switch (formtype)
			{
				case 'radio':
					if (elm.value == option) // option == '' evaluates true when option = 0
					{
						elm.checked = setto;
					}
				break;
				case 'select-one':
					elm.selectedIndex = setto;
				break;
				default:
					elm.checked = setto;
				break;
			}
		}
	}
}

/**
* Sets all <select> elements to the selectedIndex specified by the 'selectall' element
*
* @param	object	Form object
*/
function js_select_all(formobj)
{
	exclude = new Array();
	exclude[0] = 'selectall';
	js_toggle_all(formobj, 'select-one', '', exclude, formobj.selectall.selectedIndex);
}

/**
* Sets all <input type="checkbox" /> elements to have the same checked status as 'allbox'
*
* @param	object	Form object
*/
function js_check_all(formobj)
{
	exclude = new Array();
	exclude[0] = 'keepattachments';
	exclude[1] = 'allbox';
	exclude[2] = 'removeall';
	js_toggle_all(formobj, 'checkbox', '', exclude, formobj.allbox.checked);
}

/**
* Sets all <input type="radio" /> groups to have a particular option checked
*
* @param	object	Form object
* @param	mixed	Selected option
*/
function js_check_all_option(formobj, option)
{
	exclude = new Array();
	exclude[0] = 'useusergroup';
	js_toggle_all(formobj, 'radio', option, exclude, true);
}

/**
* Alias to js_check_all
*/
function checkall(formobj) { js_check_all(formobj); }

/**
* Alias to js_check_all_option
*/
function checkall_option(formobj, option) { js_check_all_option(formobj, option); }

/**
* Resize function for CP textareas
*
* @param	integer	If positive, size up, otherwise size down
* @param	string	ID of the textarea
*
* @return	boolean	false
*/
function resize_textarea(to, id)
{
	if (to < 0)
	{
		var rows = -5;
		var cols = -10;
	}
	else
	{
		var rows = 5;
		var cols = 10;
	}

	var textarea = fetch_object(id);
	if (typeof textarea.orig_rows == 'undefined')
	{
		textarea.orig_rows = textarea.rows;
		textarea.orig_cols = textarea.cols;
	}

	var newrows = textarea.rows + rows;
	var newcols = textarea.cols + cols;

	if (newrows >= textarea.orig_rows && newcols >= textarea.orig_cols)
	{
		textarea.rows = newrows;
		textarea.cols = newcols;
	}

	return false;
}

// #############################################################################
// Collapsible element handlers

/**
* Toggles the collapse state of an object, and saves state to 'vbulletin_collapse' cookie
*
* @param	string	Unique ID for the collapse group
*
* @return	boolean	false
*/
function toggle_collapse(objid)
{
	if (!is_regexp)
	{
		return false;
	}

	obj = fetch_object('collapseobj_' + objid);
	img = fetch_object('collapseimg_' + objid);
	cel = fetch_object('collapsecel_' + objid);

	if (!obj)
	{
		// nothing to collapse!
		if (img)
		{
			// hide the clicky image if there is one
			img.style.display = 'none';
		}
		return false;
	}

	if (obj.style.display == 'none')
	{
		obj.style.display = '';
		save_collapsed(objid, false);
		if (img)
		{
			img_re = new RegExp("_collapsed\\.(gif|png)$");
			img.src = img.src.replace(img_re, '.$1');
		}
		if (cel)
		{
			cel_re = new RegExp("^(thead|tcat)(_collapsed)$");
			cel.className = cel.className.replace(cel_re, '$1');
		}
	}
	else
	{
		obj.style.display = 'none';
		save_collapsed(objid, true);
		if (img)
		{
			img_re = new RegExp("\\.(gif|png)$");
			img.src = img.src.replace(img_re, '_collapsed.$1');
		}
		if (cel)
		{
			cel_re = new RegExp("^(thead|tcat)$");
			cel.className = cel.className.replace(cel_re, '$1_collapsed');
		}
	}
	return false;
}

/**
* Updates vbulletin_collapse cookie with collapse preferences
*
* @param	string	Unique ID for the collapse group
* @param	boolean	Add a cookie
*/
function save_collapsed(objid, addcollapsed)
{
	var collapsed = fetch_cookie('vbulletin_collapse');
	var tmp = new Array();

	if (collapsed != null)
	{
		collapsed = collapsed.split('\n');

		for (var i in collapsed)
		{
			if (collapsed[i] != objid && collapsed[i] != '')
			{
				tmp[tmp.length] = collapsed[i];
			}
		}
	}

	if (addcollapsed)
	{
		tmp[tmp.length] = objid;
	}

	expires = new Date();
	expires.setTime(expires.getTime() + (1000 * 86400 * 365));
	set_cookie('vbulletin_collapse', tmp.join('\n'), expires);
}

// #############################################################################
// Event Handlers for PageNav menus

/**
* Class to handle pagenav events
*/
function vBpagenav()
{
}

/**
* Handles clicks on pagenav menu control objects
*/
vBpagenav.prototype.controlobj_onclick = function(e)
{
	this._onclick(e);
	var inputs = fetch_tags(this.menu.menuobj, 'input');
	for (var i = 0; i < inputs.length; i++)
	{
		if (inputs[i].type == 'text')
		{
			inputs[i].focus();
			break;
		}
	}
};

/**
* Submits the pagenav form... sort of
*/
vBpagenav.prototype.form_gotopage = function(e)
{
	if ((pagenum = parseInt(fetch_object('pagenav_itxt').value, 10)) > 0)
	{
		window.location = this.addr + '&page=' + pagenum;
	}
	return false;
};

/**
* Handles clicks on the 'Go' button in pagenav popups
*/
vBpagenav.prototype.ibtn_onclick = function(e)
{
	return this.form.gotopage();
};

/**
* Handles keypresses in the text input of pagenav popups
*/
vBpagenav.prototype.itxt_onkeypress = function(e)
{
	return ((e ? e : window.event).keyCode == 13 ? this.form.gotopage() : true);
};

// #############################################################################
// DHTML Popup Menu Handling (complements vbulletin_menu.js)

/**
* Wrapper for vBmenu.register
*
* @param	string	Control ID
* @param	boolean	No image (true)
* @param	boolean	Does nothing any more
*/
function vbmenu_register(controlid, noimage, datefield)
{
	if (typeof vBmenu == 'object')
	{
		return vBmenu.register(controlid, noimage);
	}
}

// #############################################################################
// Stuff that really doesn't fit anywhere else

/**
* Sets an element and all its children to be 'unselectable'
*
* @param	object	Object to be made unselectable
*/
function set_unselectable(obj)
{
	if (!is_ie4 && typeof obj.tagName != 'undefined')
	{
		if (obj.hasChildNodes())
		{
			for (var i = 0; i < obj.childNodes.length; i++)
			{
				set_unselectable(obj.childNodes[i]);
			}
		}
		obj.unselectable = 'on';
	}
}

/**
* Fetches the sessionhash from the SESSIONURL variable
*
* @return	string
*/
function fetch_sessionhash()
{
	return (SESSIONURL == '' ? '' : SESSIONURL.substr(2, 32));
}

/**
* Emulates the PHP version of vBulletin's construct_phrase() sprintf wrapper
*
* @param	string	String containing %1$s type replacement markers
* @param	string	First replacement
* @param	string	Nth replacement
*
* @return	string
*/
function construct_phrase()
{
	if (!arguments || arguments.length < 1 || !is_regexp)
	{
		return false;
	}

	var args = arguments;
	var str = args[0];
	var re;

	for (var i = 1; i < args.length; i++)
	{
		re = new RegExp("%" + i + "\\$s", 'gi');
		str = str.replace(re, args[i]);
	}
	return str;
}

/**
* Handles the quick style/language options in the footer
*
* @param	object	Select object
* @param	string	Type (style or language)
*/
function switch_id(selectobj, type)
{
	var id = selectobj.options[selectobj.selectedIndex].value;

	if (id == '')
	{
		return;
	}

	var url = new String(window.location);
	var fragment = new String('');

	// get rid of fragment
	url = url.split('#');

	// deal with the fragment first
	if (url[1])
	{
		fragment = '#' + url[1];
	}

	// deal with the main url
	url = url[0];

	// remove id=x& from main bit
	if (url.indexOf(type + 'id=') != -1 && is_regexp)
	{
		re = new RegExp(type + "id=\\d+&?");
		url = url.replace(re, '');
	}

	// add the ? to the url if needed
	if (url.indexOf('?') == -1)
	{
		url += '?';
	}
	else
	{
		// make sure that we have a valid character to join our id bit
		lastchar = url.substr(url.length - 1);
		if (lastchar != '&' && lastchar != '?')
		{
			url += '&';
		}
	}

	window.location = url + type + 'id=' + id + fragment;
}

/**
* Takes the 'alt' attribute for an image and attaches it to the 'title' attribute
*
* @param	object	Image object
*/
function img_alt_2_title(img)
{
	if (!img.title && img.alt != '')
	{
		img.title = img.alt;
	}
}

// #############################################################################
// Initialize a PostBit

/**
* This function runs all the necessary Javascript code on a PostBit
* after it has been loaded via AJAX. Don't use this method before a
* complete page load or you'll have problems.
*
* @param	object	Object containing postbits
*/
function PostBit_Init(obj, postid)
{
	if (typeof vBmenu != 'undefined')
	{
		// init profile menu(s)
		var divs = fetch_tags(obj, 'div');
		for (var i = 0; i < divs.length; i++)
		{
			if (divs[i].id && divs[i].id.substr(0, 9) == 'postmenu_')
			{
				vBmenu.register(divs[i].id, true);
			}
		}
	}

	if (typeof vB_QuickEditor != 'undefined')
	{
		// init quick edit controls
		vB_AJAX_QuickEdit_Init(obj);
	}

	if (typeof vB_QuickReply != 'undefined')
	{
		// init quick reply button
		qr_init_buttons(obj);
	}

	if (typeof mq_init != 'undefined')
	{
		// init quick reply button
		mq_init(obj);
	}

	if (typeof vBrep != 'undefined')
	{
		if (typeof postid != 'undefined' && typeof postid != 'null')
		{
			vbrep_register(postid);
		}
	}

	if (typeof inlineMod != 'undefined')
	{
		im_init(obj);
	}
}

// #############################################################################
// Main vBulletin Javascript Initialization

/**
* This function runs (almost) at the end of script loading on most vBulletin pages
*
* It sets up things like image alt->title tags, turns on the popup menu system etc.
*
* @return	boolean
*/
function vBulletin_init()
{
	// don't bother doing any exciting stuff for WebTV
	if (is_webtv)
	{
		return false;
	}

	// set 'title' tags for image elements
	var imgs = fetch_tags(document, 'img');
	for (var i = 0; i < imgs.length; i++)
	{
		img_alt_2_title(imgs[i]);
	}

	// finalize popup menus
	if (typeof vBmenu == 'object')
	{
		// close all menus on document click
		if (window.attachEvent && !is_saf)
		{
			document.attachEvent('onclick', vbmenu_hide);
			window.attachEvent('onresize', vbmenu_hide);
		}
		else if (document.addEventListener && !is_saf)
		{
			document.addEventListener('click', vbmenu_hide, false);
			window.addEventListener('resize', vbmenu_hide, false);
		}
		else
		{
			window.onclick = vbmenu_hide;
			window.onresize = vbmenu_hide;
		}

		// add popups to pagenav elements
		var pagenavs = fetch_tags(document, 'td');
		for (var n = 0; n < pagenavs.length; n++)
		{
			if (pagenavs[n].hasChildNodes() && pagenavs[n].firstChild.name && pagenavs[n].firstChild.name.indexOf('PageNav') != -1)
			{
				var addr = pagenavs[n].title;
				pagenavs[n].title = '';
				pagenavs[n].innerHTML = '';
				pagenavs[n].id = 'pagenav.' + n;
				var pn = vBmenu.register(pagenavs[n].id);
				if (is_saf)
				{
					pn.controlobj._onclick = pn.controlobj.onclick;
					pn.controlobj.onclick = vBpagenav.prototype.controlobj_onclick;
				}
			}
		}

		// process the pagenavs popup form
		if (typeof addr != 'undefined')
		{
			fetch_object('pagenav_form').addr = addr;
			fetch_object('pagenav_form').gotopage = vBpagenav.prototype.form_gotopage;
			fetch_object('pagenav_ibtn').onclick = vBpagenav.prototype.ibtn_onclick;
			fetch_object('pagenav_itxt').onkeypress = vBpagenav.prototype.itxt_onkeypress;
		}

		// activate the menu system
		vBmenu.activate(true);
	}

	return true;
}

/*======================================================================*\
|| ####################################################################
|| # Downloaded: 11:19, Wed Nov 22nd 2006
|| # CVS: $RCSfile$ - $Revision: 15892 $
|| ####################################################################
\*======================================================================*/


}
/*
     FILE ARCHIVED ON 23:15:29 Dec 30, 2009 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 00:47:19 Mar 11, 2025.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 1.261
  exclusion.robots: 0.024
  exclusion.robots.policy: 0.011
  esindex: 0.013
  cdx.remote: 24.618
  LoadShardBlock: 333.897 (3)
  PetaboxLoader3.datanode: 350.114 (4)
  load_resource: 117.358
  PetaboxLoader3.resolve: 60.861
*/