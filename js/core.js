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

String.prototype.ltrim = function () {
	return this.replace(/^\s/, "");
}
String.prototype.rtrim = function () {
	return this.replace(/\s$/, "");
}
String.prototype.trim = function () {
	return this.ltrim().rtrim();
}
String.prototype.left = function(count) {
	return (count > this.length) ? this : this.substr(0, count);
}
String.prototype.right = function(count) {
	return (count > this.length) ? this : this.substr(this.length - count);
}

var VIS_VISIBILITY = 1;
var VIS_DISPLAY    = 2;

var WIN_SCROLLBARS = 1;
var WIN_RESIZABLE  = 2;
var WIN_MENUBAR    = 4;
var WIN_TOOLBAR    = 8;
var WIN_STATUS     = 16;
var WIN_CENTER     = 32;
var WIN_LOCATION   = 64;

var CClass = {
	create: function() {
		return function() {
			this.init.apply(this, arguments);
		}
	}
};

var CBrowser = {
	Version: {
		IE:     !!(window.attachEvent && !window.opera),
		Opera:  !!window.opera,
		WebKit: navigator.userAgent.indexOf('AppleWebKit/') > -1,
		Gecko:  navigator.userAgent.indexOf('Gecko') > -1 && navigator.userAgent.indexOf('KHTML') == -1
	},
	Features: {
		GetById: document.getElementById,
		GetByTagName: document.getElementsByTagName,
		XPath: !!document.evaluate,
		ElementExtensions: !!window.HTMLElement
	},
	getWidth: function() {
		return Math.floor(window.innerWidth ? window.innerWidth : (document.documentElement.clientWidth ? document.documentElement.clientWidth : document.body.clientWidth));
	},
	getHeight: function() {
		return Math.floor(window.innerHeight ? window.innerHeight : (document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.clientHeight));
	},
	getOffsetX: function() {
		return self.pageXOffset ? self.pageXOffset : (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
	},
	getOffsetY: function() {
		return self.pageYOffset ? self.pageYOffset : (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
	}
};

var CEvent = {
	Features: {
		EventListener: window.addEventListener,
		AttachEvent: window.attachEvent
	},
	add: function(obj, eventType, fn) {
		if (this.Features.EventListener) {
			obj.addEventListener(eventType, fn, false);
			return true;
		}
		else if (this.Features.AttachEvent) {
			return obj.attachEvent("on"+eventType, fn);
		}
		else {
			return false;
		}
	},
	remove: function(obj, eventType, fn) {
		if (this.Features.EventListener) {
			obj.removeEventListener(eventType, fn, false);
			return true;
		}
		else if (this.Features.AttachEvent) {
			return obj.detachEvent("on"+eventType, fn);
		}
		else {
			return false;
		}
	},
	get: function(e) {
		return (e) ? e : ((window.event) ? window.event : false);
	},
	getTarget: function(e) {
		return (e.target) ? e.target : e.srcElement;
	},
	cancelBubble: function(e) {
		e = CEvent.get(e);
		if (e.stopPropogation) {
			e.stopPropogation();
            e.preventDefault();
		}
		else {
			e.cancelBubble = true;
		}
	}
};

var CEventStack = {
	_stack: new Array(),
	push: function(obj) { this._stack.push(obj); },
	execute: function() {
		var e = this._stack.shift();
		eval(e.obj.e.fn + "(" + e.args + ");");
	}
};

var CCookie = {
	set: function(name, value, days) {
		var expires = "";
		if (days) {
			var date = new Date();
			date.setTime(date.getTime() + (days*24*60*60*1000));
			var expires = "; expires=" + date.toGMTString();
		}
		document.cookie = name + "=" + escape(value) + expires + "; path=/; domain=gamebattles.com";
	},
	get: function(name) {
		var name_search = name + "=";
		var cookies = document.cookie.split(';');
		for (var i=0; i<cookies.length; i++) {
			var c = cookies[i].ltrim();
			if (c.indexOf(name_search) == 0) {
				return unescape(c.substring(name_search.length, c.length));
			}
		}
		return null;
	},
	remove: function(name) {
		CCookie.set(name, "" , -1);
	}
};

var CUrl = {
	get: function(url) {
		document.location.href = url;
	},
	getRedirect: function(url) {
		this.get(url + '&r=' + escape(document.location.href));
	},
	getRedirectUrl: function(url, redirectUrl) {
		this.get(url + '&r=' + escape(redirectUrl));
	}
}

var CForm = {
	checkAll: function(form, field, value) {
		for (var i=0; i<form.elements.length; i++){
			if (form.elements[i].name == field) {
				form.elements[i].checked = value;
			}
		}
	}
};

var CValidate = {
	isEmpty: function(v) {
		return (v == null) || (v.length == 0);
	},
	isNumeric: function(v) {
		if (this.isEmpty(v)) return false;
		return typeof v != "boolean" && !isNaN(+ v);
	},
	isEmail: function(v) {
		if (this.isEmpty(v)) return false;
		//var pattern = /^.+@.+\..{2,3,4,6}$/;
		var pattern = new RegExp("^.+@.+\..{2,3,4,6}$");
		return pattern.test(v);
	},
	isUrl: function(v) {
		if (this.isEmpty(v)) return false;
		//var pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
		var pattern = new RegExp("(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?");
		return pattern.test(v);
	},
	isPhone: function(v) {
		if (this.isEmpty(v)) return false;
		return this.isNumeric(v.replace(/[\(\)\.\-\ ]/g, ''));
	}
}

var COpacity = {
	set: function (obj, opacity) {
		if (obj.style.opacity != undefined) {
			obj.style.opacity = opacity / 100;
			return true;
		}
		else if (obj.style.MozOpacity != undefined) {
			obj.style.MozOpacity = opacity / 100;
			return true;
		}
		else if (obj.style.filter != undefined) {
			obj.style.filter = "alpha(opacity=" + Math.round(opacity)+")";
			return true;
		}
		else {
			return false;
		}
	},
	fade: function (obj, startOpacity, endOpacity, interval) {
		if (startOpacity > endOpacity) {
			for (var i=startOpacity, timer=0; i>=endOpacity; i-=5, timer++) {
				window.setTimeout("COpacity.set("+obj+", "+i+")", (timer * interval));
			}
		}
		else if (startOpacity < endOpacity) {
			for (var i=startOpacity, timer=0; i<=endOpacity; i+=5, timer++) {
				window.setTimeout("COpacity.set("+obj+", "+i+")", (timer * interval));
			}
		}
	}
};

var CPosition = {
	shiftTo: function(objId, x, y) {
		var obj_style = document.getElementById(objId).style;
		if (obj_style) {
			if (x != null) obj_style.left = x + "px";
			if (y != null) obj_style.top = y + "px";
		}
	},
	shiftBy: function(objId, x, y) {
		var obj_style = document.getElementById(objId).style;
		if (obj_style) {
			var obj_x = parseInt(obj_style.left) || 0;
			var obj_y = parseInt(obj_style.top) || 0;
			if (x != null) obj_style.left += x + "px";
			if (y != null) obj_style.top += y + "px";
		}
	},
	glideTo: function (objId, x, y, steps, zindex, display) {
		var obj_style = document.getElementById(objId).style;
		var x_pos = parseInt(obj_style.left) || 0;
		var y_pos = parseInt(obj_style.top) || 0;

		if (x_pos != x || y_pos != y) {
			x_delta = x == null ? null : x_pos + (x - x_pos) / steps;
			y_delta = y == null ? null : y_pos + (y - y_pos) / steps;
			this.shiftTo(objId, x_delta, y_delta);
			steps--;
			if (steps > 0) {
				setTimeout("CPosition.glideTo('"+objId+"',"+x+","+y+","+steps+","+zindex+")", 30);
			}
			else if (zindex) {
				obj_style.zIndex = zindex;
			}
			else if (display) {
				obj_style.display = display;
			}
		}
	},
	glideBy: function (objId, x, y, steps) {
		var obj_style = document.getElementById(objId).style;
		var obj_x = parseInt(obj_style.left) || 0;
		var obj_y = parseInt(obj_style.top) || 0;
		this.glideTo(objId, obj_x + x, obj_y + y, steps);
	},
    heightTo: function (objId, h, steps) {
        var obj_style = document.getElementById(objId).style;
		var h_pos = parseInt(obj_style.height) || 0;

		if (h_pos != h) {
			h_delta = h == null ? null : h_pos + (h - h_pos) / steps;
            obj_style.height = h_delta+"px";
			steps--;
			if (steps > 0) {
				setTimeout("CPosition.heightTo('"+objId+"',"+h+","+steps+")", 30);
			}
		}
    }
};

var CVisibility = {
	show: function(objId, whichAttribute) {
		var obj_style = document.getElementById(objId).style;
		if (whichAttribute & VIS_VISIBILITY) obj_style.visibility = "visible";
		if (whichAttribute & VIS_DISPLAY) obj_style.display = "";
	},
	hide: function(objId, whichAttribute) {
		var obj_style = document.getElementById(objId).style;
		if (whichAttribute & VIS_VISIBILITY) obj_style.visibility = "hidden";
		if (whichAttribute & VIS_DISPLAY) obj_style.display = "none";
	}
};

var CWindow = {
	open: function(url, width, height, options) {
		if (url.length <= 0 || width <= 0 || height <= 0) {
			return null;
		}

		var s_options = 'width=' + width + ',height=' + height;

		s_options += options & WIN_CENTER ? ',left=' + ((screen.width - width) / 2) + ',top=' + ((screen.height - height) / 2) : '';
		s_options += options & WIN_SCROLLBARS ? ',scrollbars=1': '';
		s_options += options & WIN_RESIZABLE ? ',resizable=1' : '';
		s_options += options & WIN_MENUBAR ? ',menubar=1' : '';
		s_options += options & WIN_TOOLBAR ? ',toolbar=1' : '';
		s_options += options & WIN_STATUS ? ',status=1' : '';
		s_options += options & WIN_LOCATION ? ',location=1' : '';

		return window.open(url, '_gb_popwin', s_options);
	}
};

var CHelp = {
	show: function(questionId) {
		return CWindow.open("/helpinline.php?question="+questionId+"&output=popup", 660, 500, WIN_CENTER | WIN_SCROLLBARS);
	}
};

var CInfoPop = {
	show: function(content) {
	},
	hide: function() {
	}
};

var CTooltip = {
	show: function(content) {
	},
	hide: function() {
	}
};

var CPopupInfo = {
	init: false,
	box: null,

	initialize: function() {
		this.box = document.getElementById("popalert");
		CEvent.add(this.box, "mouseout", this.mouseLeave);
		this.init = true;
	},
	show: function(e, title, content) {
		if (!this.init) {
			this.initialize();
		}
		this.box.innerHTML = '<div id="popalert-arrow"></div><div id="popalert-title">'+title+'</div><div id="popalert-content">'+content+'</div><div id="popalert-bottom"></div>';
		this.update(e);
		this.box.style.visibility = "visible";
	},
	mouseLeave: function(e) {
		CEvent.cancelBubble(e);

		e = CEvent.get(e);

		var toEl = CEvent.getTarget(e);
		var fromEl = e.relatedTarget||e.fromElement;
		var box = document.getElementById("popalert");

		// walk through the event node to all parents to determine if it is a child of #popalert, if it is return
		var node = fromEl;
		var depth = 0;
		while (node.nodeType != 9) {
			if (node.id.length > 0) {
				if (node.id.left(8) == "popalert" && depth > 1) {
					return false;
				}
			}
			node = node.parentNode;
			depth++;
		}

		if (fromEl.id.length == 0) {
			var box = document.getElementById("popalert");
			box.style.visibility = "hidden";
		}
		return false;
	},
	hide: function(e) {
		e = CEvent.get(e);

		var toEl = CEvent.getTarget(e);
		var fromEl = e.relatedTarget||e.fromElement;

		if (fromEl.id.left(8) != "popalert") {
			this.box.style.visibility = "hidden";
		}
		return false;
	},
	update: function(e) {
		e = CEvent.get(e);

        if (e.pageX || e.pageY) {
            var posx = e.pageX;
            var posy = e.pageY;
        }
        else if (e.clientX || e.clientY) {
            var posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            var posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }

		if (this.box) {
			this.box.style.top = (posy-48)+"px";
			this.box.style.left = posx+"px";
		}
	}
};

var CPopupAlert = {
	init: false,
	dimmer: null,
	alertbox: null,
	end_opacity: 70,
	cur_opacity: 0,
	opacity_increment: 14,
	fade_interval: 50,

	initialize: function() {
		this.dimmer = document.getElementById("dimmer");
		this.alertbox = document.getElementById("popalert");
		CEvent.add(window, "resize", this.handleWindowResize);
		CEvent.add(window, "scroll", this.handleWindowResize);
		COpacity.set(this.dimmer, 0);
		this.dimmer.style.display = "none";
		this.init = true;
	},
	show: function(content) {
		if (!this.init) {
			this.initialize();
		}
		this.alertbox.innerHTML = '<div id="popalert-title">GameBattles: Personal Alert</div><div id="popalert-close"><a href="#PopupAlert" onclick="return CPopupAlert.hide();">Close Alert</a></div><div id="popalert-content">'+content+'<br /><div id="popalert-options"><a href="http://web.archive.org/web/20100104152542/http://gamebattles.com/account/edit/preferences">Set Notification Preferences</a></div></div><div id="popalert-bottom"></div>';
		this.update();
		this.showDimmer();
		this.alertbox.style.visibility = "visible";
	},
	showMlg: function(content) {
		if (!this.init) {
			this.initialize();
		}
		this.alertbox.innerHTML = '<div id="popalert-title">MLG Alert</div><div id="popalert-close"><a href="#PopupAlert" onclick="return CPopupAlert.hide();">Close Alert</a></div><div id="popalert-content">'+content+'<br /></div><div id="popalert-bottom"></div>';
		this.update();
		this.showDimmer();
		this.alertbox.style.visibility = "visible";
	},
	hide: function() {
		this.alertbox.style.visibility = "hidden";
		this.hideDimmer();
		return false;
	},
	update: function() {
		if (this.alertbox) {
			this.alertbox.style.top = (CBrowser.getHeight()/2 - this.alertbox.offsetHeight/2 + CBrowser.getOffsetY())+"px";
			this.alertbox.style.left = (CBrowser.getWidth()/2 - this.alertbox.offsetWidth/2)+"px";
		}
	},
	autofade: function() {
		//COpacity.fade(this.dimmer, this.cur_opacity, this.end_opacity, this.fade_interval);
		this.fade(this.cur_opacity + this.opacity_increment);
		if (this.cur_opacity < this.end_opacity) {
			window.setTimeout("CPopupAlert.autofade()", this.fade_interval);
		}
	},
	fade: function(opacity) {
		this.cur_opacity = opacity;
		COpacity.set(this.dimmer, this.cur_opacity);
	},
	showDimmer: function() {
		this.updateDimmer();
		this.dimmer.style.display = "block";
		this.autofade();
	},
	hideDimmer: function() {
		this.dimmer.style.display = "none";
		this.cur_opacity = 0;
		this.fade(0);
	},
	updateDimmer: function() {
		if (this.dimmer) {
			this.dimmer.style.height = CBrowser.getHeight() + "px";
			this.dimmer.style.top = CBrowser.getOffsetY() + "px";
		}
	},
	handleWindowResize: function() {
		CPopupAlert.update();
		CPopupAlert.updateDimmer();
	}
};

}
/*
     FILE ARCHIVED ON 15:25:42 Jan 04, 2010 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 00:47:19 Mar 11, 2025.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 0.692
  exclusion.robots: 0.023
  exclusion.robots.policy: 0.009
  esindex: 0.013
  cdx.remote: 41.574
  LoadShardBlock: 649.975 (3)
  PetaboxLoader3.datanode: 190.85 (4)
  PetaboxLoader3.resolve: 524.485 (3)
  load_resource: 98.65
*/