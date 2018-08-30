'use strict';

import * as Names from './names.js';

var db;
var _g = { dragging : undefined , fields : new Array(1000), loaded : 0, total : 744 };

function start() {

	//populateOverlay();
	//$(document).on("mousedown", ".ovPkPortrait", function(e) { clickedPortrait(this,e); });
	//$(document).on("mouseup", function(e) { releasePortrait(e); });
	//$(document).mousemove(function(e) { $(".dragging").css("top",e.clientY+7).css("left",e.clientX+7); });
	
	$("#searchBox").val("");
	$("#chartLink").click(function() { $("#chart").toggle(); });
	
	$(document).on("click", ".type1, .type2, .route", function(e) { editField(e); });
	$("#searchBox").change(function(e) { useSearch(e); });

	var req = window.indexedDB.open("FakedexDB", 1);
	
	req.onupgradeneeded = function(e) { updateDB(e); }
	req.onerror = function(e) { console.log(e); }
	req.onsuccess = function(e) { dbOpened(e); }

}

function useSearch(e) {

	if ($("#searchBox").val() == "") {

		$(".pokemonEntry").css("display","block");
		
	} else {
	
		$(".pokemonEntry").css("display","none");
		
		var s = $("#searchBox").val().toLowerCase();
		
		for (var i = 0; i < _g.total; i++) {
		
			if (Names.Names[i].substr(0,s.length).toLowerCase() == s) {
			
				$(".pokemonEntry").eq(i).css("display","block");
			
			}
		
		}
		
	
	}

}

function formatColor(obj, index) {

	var t = ["normal", "fighting", "flying", "poison", "ground", "rock", "bug", "ghost", "steel", "question", "fire", "water", "grass", "electric", "psychic", "ice", "dragon", "dark"];

	for (var i = 0; i < t.length; i++) {
	
		$(obj).removeClass(t[i]);
	
	}
	
	if (index < 18) {
	
		$(obj).addClass(t[index]);
		
	}

}

function applyColor(search) {

	search = search || ".type1, .type2";

	$(search).each(function() {
	
		var te = $(this).text().toLowerCase();
	
			if (te == "normal") { formatColor(this,0); }
		else if (te == "fighting" || te == "fight") { formatColor(this,1); }
		else if (te == "flying") { formatColor(this,2); }
		else if (te == "poison") { formatColor(this,3); }
		else if (te == "ground") { formatColor(this,4); }
		else if (te == "rock") { formatColor(this,5); }
		else if (te == "bug") { formatColor(this,6); }
		else if (te == "ghost") { formatColor(this,7); }
		else if (te == "steel") { formatColor(this,8); }
		else if (te == "???") { formatColor(this,9); }
		else if (te == "fire") { formatColor(this,10); }
		else if (te == "water") { formatColor(this,11); }
		else if (te == "grass") { formatColor(this,12); }
		else if (te == "electric") { formatColor(this,13); }
		else if (te == "psychic") { formatColor(this,14); }
		else if (te == "ice") { formatColor(this,15); }
		else if (te == "dragon") { formatColor(this,16); }
		else if (te == "dark") { formatColor(this,17); }
		else { formatColor(this,18); }
	
	});

}

function editField(e) {

	var p = prompt("Edit","");
	
	if (p != null) {
		p = p.substr(0,1).toUpperCase() + p.substr(1).toLowerCase();
		
		e.currentTarget.textContent = p;
		applyColor(e.currentTarget);
		
		updateFields();
	}

}

function updateFields() {

	var os = db.transaction(["pokemon"], "readwrite").objectStore("pokemon");

	for (var i = 0; i < _g.total; i++) {
	
		_g.fields[i] = [];
	
		var f = $(".pokemonEntry").eq(i);
		
		_g.fields[i].push([$(f).children(".type1").text(),$(f).children(".type2").text(),$(f).children(".route").text()]);
		
		os.put(_g.fields[i].join(","), i);
	
	}

}

function readDB() {

	var os = db.transaction(["pokemon"], "readwrite").objectStore("pokemon");
	
	for (var i = 0; i < _g.total; i++) {
	
		var r = os.get(i);
		
		const t = i;
		
		r.onsuccess = function(e) { _g.fields[t] = e.explicitOriginalTarget.result.split(","); populateFields(); }
		
	}

}

function populateFields() {

	_g.loaded++;
	
	if (_g.loaded < _g.total) { return; }
	
	for (var i = 0; i < _g.total; i++) { 
		
		var x = (i%32)*40;
		var y = (Math.floor(i/32))*30;
	
		var p = $("<div />", { class : "pokemonEntry" });
		$("<div />", { class : "pokemonEntryImage", style : "background-position:-"+x+"px -"+y+"px;" }).appendTo(p);
		$("<div />", { class : "pokemonEntryName" , text : Names.Names[i] }).appendTo(p);
		$("<div />", { class : "type1" , html : _g.fields[i][0] }).appendTo(p);
		$("<div />", { class : "type2" , html : _g.fields[i][1] }).appendTo(p);
		$("<div />", { class : "route" , html : _g.fields[i][2] }).appendTo(p);
		p.appendTo("#pokemonContainer");
		
		if (Names.Names[i].substr(0,1) == "+") { p.addClass("MEGAHIDE"); }
	
	}
	
	applyColor();

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

