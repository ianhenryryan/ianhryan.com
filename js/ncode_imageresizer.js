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

// nCode Image Resizer for vBulletin 3.6.0
// http://www.ncode.nl/vbulletinplugins/
// Version: 1.0.1
//
// (c) 2007 nCode


NcodeImageResizer.IMAGE_ID_BASE = 'ncode_imageresizer_container_';
NcodeImageResizer.WARNING_ID_BASE = 'ncode_imageresizer_warning_';
NcodeImageResizer.scheduledResizes = [];

function NcodeImageResizer(id, img) {
	this.id = id;
	this.img = img;
	this.originalWidth = 0;
	this.originalHeight = 0;
	this.warning = null;
	this.warningTextNode = null;
	this.originalWidth = img.originalWidth;
	this.originalHeight = img.originalHeight;
	
	img.id = NcodeImageResizer.IMAGE_ID_BASE+id;
}

NcodeImageResizer.executeOnload = function() {
	var rss = NcodeImageResizer.scheduledResizes;
	for(var i = 0; i  < rss.length; i++) {
		NcodeImageResizer.createOn(rss[i], true);
	}
}

NcodeImageResizer.schedule = function(img) {
	if(NcodeImageResizer.scheduledResizes.length == 0) {
		if(window.addEventListener) {
			window.addEventListener('load', NcodeImageResizer.executeOnload, false);
		} else if(window.attachEvent) {
			window.attachEvent('onload', NcodeImageResizer.executeOnload);
		}
	}
	NcodeImageResizer.scheduledResizes.push(img);
}

NcodeImageResizer.getNextId = function() {
	var id = 1;
	while(document.getElementById(NcodeImageResizer.IMAGE_ID_BASE+id) != null) {
		id++;
	}
	return id;
}

NcodeImageResizer.createOnId = function(id) {
	return NcodeImageResizer.createOn(document.getElementById(id));
}

NcodeImageResizer.createOn = function(img, isSchedule) {
	if(typeof isSchedule == 'undefined') isSchedule = false;
	
	if(!img || !img.tagName || img.tagName.toLowerCase() != 'img') {
		alert(img+' is not an image ('+img.tagName.toLowerCase()+')');
	}
	
	if(img.width == 0 || img.height == 0) {
		if(!isSchedule)
			NcodeImageResizer.schedule(img);
		return;
	}
	
	if(!img.originalWidth) img.originalWidth = img.width;
	if(!img.originalHeight) img.originalHeight = img.height;
	
	if((NcodeImageResizer.MAXWIDTH > 0 && img.originalWidth > NcodeImageResizer.MAXWIDTH) || (NcodeImageResizer.MAXHEIGHT > 0 && img.originalHeight > NcodeImageResizer.MAXHEIGHT)) {
		var isRecovery = false; // if this is a recovery from QuickEdit, which only restores the HTML, not the OO structure
		var newid, resizer;
		if(img.id && img.id.indexOf(NcodeImageResizer.IMAGE_ID_BASE) == 0) {
			newid = img.id.substr(NcodeImageResizer.IMAGE_ID_BASE.length);
			if(document.getElementById(NcodeImageResizer.WARNING_ID_BASE+newid) != null) {
				resizer = new NcodeImageResizer(newid, img);
				isRecovery = true;
				resizer.restoreImage();
			}
		} else {
			newid = NcodeImageResizer.getNextId();
			resizer = new NcodeImageResizer(newid, img);
		}
		
		if(isRecovery) {
			resizer.reclaimWarning(newid);
		} else {
			resizer.createWarning();
		}
		resizer.scale();
	}
}

NcodeImageResizer.prototype.restoreImage = function() {
	newimg = document.createElement('IMG');
	newimg.src = this.img.src;
	this.img.width = newimg.width;
	this.img.height = newimg.height;
}

NcodeImageResizer.prototype.reclaimWarning = function(id) {
	this.warning = document.getElementById(NcodeImageResizer.WARNING_ID_BASE+id);
	this.warningTextNode = this.warning.firstChild.firstChild.childNodes[1].firstChild;
	this.warning.resize = this;
	
	this.scale();
}

NcodeImageResizer.prototype.createWarning = function() {
	var mtable = document.createElement('TABLE');
	var mtbody = document.createElement('TBODY');
	var mtr = document.createElement('TR');
	var mtd1 = document.createElement('TD');
	var mtd2 = document.createElement('TD');
	var mimg = document.createElement('IMG');
	var mtext = document.createTextNode('');
	
	mimg.src = NcodeImageResizer.BBURL+'/images/statusicon/wol_error.gif';
	mimg.width = 16;
	mimg.height = 16;
	mimg.alt = '';
	mimg.border = 0;
	
	mtd1.width = 20;
	mtd1.className = 'td1';
	
	mtd2.unselectable = 'on';
	mtd2.className = 'td2';
	
	mtable.className = 'ncode_imageresizer_warning';
	mtable.textNode = mtext;
	mtable.resize = this;
	mtable.id = NcodeImageResizer.WARNING_ID_BASE+this.id;
	
	mtd1.appendChild(mimg);
	mtd2.appendChild(mtext);
	
	mtr.appendChild(mtd1);
	mtr.appendChild(mtd2);
	
	mtbody.appendChild(mtr);
	
	mtable.appendChild(mtbody);
	
	this.img.parentNode.insertBefore(mtable, this.img);
	
	this.warning = mtable;
	this.warningTextNode = mtext;
}

NcodeImageResizer.prototype.setText = function(text) {
	var newnode = document.createTextNode(text);
	this.warningTextNode.parentNode.replaceChild(newnode, this.warningTextNode);
	this.warningTextNode = newnode;
}

NcodeImageResizer.prototype.scale = function() {
	this.img.height = this.originalHeight;
	this.img.width = this.originalWidth;
	
	if(NcodeImageResizer.MAXWIDTH > 0 && this.img.width > NcodeImageResizer.MAXWIDTH) {
		this.img.height = (NcodeImageResizer.MAXWIDTH / this.img.width) * this.img.height;
		this.img.width = NcodeImageResizer.MAXWIDTH;
	}
	
	if(NcodeImageResizer.MAXHEIGHT > 0 && this.img.height > NcodeImageResizer.MAXHEIGHT) {
		this.img.width = (NcodeImageResizer.MAXHEIGHT / this.img.height) * this.img.width;
		this.img.height = NcodeImageResizer.MAXHEIGHT;
	}
	
	this.warning.width = this.img.width;
	this.warning.onclick = function() { return this.resize.unScale(); }
	
	if(this.img.width < 450) {
		this.setText(vbphrase['ncode_imageresizer_warning_small']);
	} else if(this.img.fileSize && this.img.fileSize > 0) {
		this.setText(vbphrase['ncode_imageresizer_warning_filesize'].replace('%1$s', this.originalWidth).replace('%2$s', this.originalHeight).replace('%3$s', Math.round(this.img.fileSize/1024)));
	} else {
		this.setText(vbphrase['ncode_imageresizer_warning_no_filesize'].replace('%1$s', this.originalWidth).replace('%2$s', this.originalHeight));
	}
	
	return false;
}

NcodeImageResizer.prototype.unScale = function() {
	switch(NcodeImageResizer.MODE) {
		case 'samewindow':
			window.open(this.img.src, '_self');
			break;
		case 'newwindow':
			window.open(this.img.src, '_blank');
			break;
		case 'enlarge':
		default:
			this.img.width = this.originalWidth;
			this.img.height = this.originalHeight;
			this.img.className = 'ncode_imageresizer_original';
			if(this.warning != null) {
				this.setText(vbphrase['ncode_imageresizer_warning_fullsize']);
				this.warning.width = this.img.width;
				this.warning.onclick = function() { return this.resize.scale() };
			}
			break;
	}
	
	return false;
}

}
/*
     FILE ARCHIVED ON 23:15:12 Dec 30, 2009 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 00:47:18 Mar 11, 2025.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 0.796
  exclusion.robots: 0.028
  exclusion.robots.policy: 0.013
  esindex: 0.013
  cdx.remote: 5.04
  LoadShardBlock: 88.765 (3)
  PetaboxLoader3.datanode: 103.061 (4)
  load_resource: 65.1
  PetaboxLoader3.resolve: 45.207
*/