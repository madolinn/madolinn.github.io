'use strict';

var db;
var _g = { dragging : undefined , fields : new Array(3), loaded : 0 };

function start() {

	populateOverlay();
	$(document).on("mousedown", ".ovPkPortrait", function(e) { clickedPortrait(this,e); });
	$(document).on("mouseup", function(e) { releasePortrait(e); });
	$(document).mousemove(function(e) { $(".dragging").css("top",e.clientY+7).css("left",e.clientX+7); });

	var req = window.indexedDB.open("NuzlockeDB", 2);
	
	req.onupgradeneeded = function(e) { updateDB(e); }
	req.onerror = function(e) { console.log(e); }
	req.onsuccess = function(e) { dbOpened(e); }

}

function updateFields() {

	for (var i = 0; i < 3; i++) {
	
		_g.fields[i] = [];
	
		var f = $(".contractable").eq(i);
		
		f.children().each(function() { _g.fields[i].push(this.attributes.style.nodeValue); });
	
	}
	
	var os = db.transaction(["pokemon"], "readwrite").objectStore("pokemon");
	var r = os.put(_g.fields[0], 0);
	var r = os.put(_g.fields[1], 1);
	var r = os.put(_g.fields[2], 2);

}

function readDB() {

	var os = db.transaction(["pokemon"], "readwrite").objectStore("pokemon");
	var r = os.get(0);
	r.onsuccess = function(e) { _g.fields[0] = e.explicitOriginalTarget.result; populateFields(); }
	var r = os.get(1);
	r.onsuccess = function(e) { _g.fields[1] = e.explicitOriginalTarget.result; populateFields(); }
	var r = os.get(2);
	r.onsuccess = function(e) { _g.fields[2] = e.explicitOriginalTarget.result; populateFields(); }

}

function populateFields() {

	console.log(_g);

	_g.loaded++;
	
	console.log(_g.loaded);
	
	if (_g.loaded < 3) { return; }
	
	for (var i = 0; i < 3; i++) {
	
		for (var e = 0; e < _g.fields[i].length; e++) {
		
			$("<div />", { class : "ovPkPortrait", style : _g.fields[i][e] }).appendTo($(".contractable").eq(i));
		
		}
	
	}

}

function updateDB(e) {

	var d = e.target.result;
	
	var os = d.createObjectStore("pokemon");

}

function dbOpened(e) {

	db = e.target.result;
	console.log(e);
	
	readDB();

}

function populateOverlay() {

	var e = $("#overlay");

	for (var i = 0; i < 163; i++) {
	
		if (i == 3 || i == 7 || i == 8 || i == 12 || i == 69 || i == 99 || i == 121 || i == 134 || i == 138 || i == 151 || i == 160 || i == 161 ) { continue; }
	
		//x:32
	
		var x = (i%32)*40;
		var y = (Math.floor(i/32))*30;
	
		$("<div />", { class : "ovPkPortrait", style : "background-position:-"+x+"px -"+y+"px;" }).appendTo(e);
	
	}

}

function clickedPortrait(obj, e) {

	if (_g.dragging != undefined) { return; }
	
	e.preventDefault();
	
	if (obj.parentNode.id == "overlay") {
	
		obj = $(obj).clone().appendTo("body");
	
	}
	
	_g.dragging = obj;

	$(obj).addClass("dragging");
	$(".dragging").css("top",e.clientY+7).css("left",e.clientX+7);

}

function releasePortrait(e) {

	if (_g.dragging == undefined) { return; }

	if (e.target.className == "contractable") { 
	
		$(_g.dragging).removeClass("dragging");
		$(_g.dragging).appendTo(e.target);
		_g.dragging = undefined;
	
	} else {
	
		_g.dragging.remove();
		_g.dragging = undefined;
	
	}
	
	updateFields();

}

$(function() {

	start();

});

