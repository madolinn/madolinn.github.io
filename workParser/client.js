<<<<<<< HEAD
'use strict';

import * as DATAA from './exportedData.js';
import * as DATAB from './exportedData1.js';

var _g = {};

function start() {

	_g.dataset = Array.concat(DATAA.dataset, DATAB.dataset);
	//_g.dataset = DATAB.dataset;
	_g.low = 0;
	_g.high = _g.dataset.length;
	_g.graphData = {};
	_g.graphData.interval = 30;
	_g.graphData.colorGrid = {};
	
	sortData();
	setupHooks();

}

function toggleEntry(e) {

	$(e.currentTarget).toggleClass("strikeout");

	var tar = e.currentTarget.dataset.name;
	
	$(".graphPoint[data-name=\""+tar+"\"]").toggle();

}

function drawGraph() {

	$("#graphContainer").html("");
	//$("#legendContainer").html("");
	
	for (var key in _g.graphData.colorGrid) {
		_g.graphData.colorGrid[key].edge = 0;
	}
	
	var STEP = 0;
	var EDGE = 0;
	
	for (var i = 0; i < 400; i += (_g.graphData.yScale*350)) {
	
		$("<div>", { class : "graphYAxis", style : "bottom:"+i+"px;" , "data-Y" : i }).appendTo("#graphContainer");
	
	}
	
	var XLabelCalc = Math.floor(_g.graphData.step.length/30);
	
	for (var i = 0; i < _g.graphData.step.length; i++) {
	
		$("<div>", { class : "graphXAxis", style : "top:0px; left:"+(i*1000*_g.graphData.xScale)+"px;" , "data-X" : i}).appendTo("#graphContainer");
		var e = $("<div>", { class : "graphXLabelContainer" , style : "left:"+((i+0.5)*1000*_g.graphData.xScale)+"px;" }).appendTo("#graphContainer");
		
		if (_g.graphData.step.length < 30 || i%XLabelCalc == 0) {
			$("<div>", { class : "graphXLabel", "data-X" : i , text : _g.graphData.xLabels[i] }).appendTo(e);
		}
	
		for (var key in _g.graphData.step[i]) {
		
			if (!($("[data-name=\""+key+"\"]").hasClass("strikeout"))) {
			
				if (!(key in _g.graphData.colorGrid)) {
				
					_g.graphData.colorGrid[key] = {};
				
					_g.graphData.colorGrid[key].edge = EDGE;
					_g.graphData.colorGrid[key].color = "rgb("+(Math.random()*256)+","+(Math.random()*256)+","+(Math.random()*256)+")";
					$("<div>", { class : "legendEntry" , style : "color:"+_g.graphData.colorGrid[key].color+";" , "data-name" : key , text : key }).appendTo("#legendContainer");
					
					
					EDGE += ((1000*_g.graphData.xScale)/_g.graphData.xSize);
					console.log((1000*_g.graphData.xScale)/_g.graphData.xSize);
				
				} else if (_g.graphData.colorGrid[key].edge == 0) {
					_g.graphData.colorGrid[key].edge = EDGE;
					EDGE += ((1000*_g.graphData.xScale)/_g.graphData.xSize);
				}
			
				var CHATS = (_g.graphData.step[i][key].length)*(350*_g.graphData.yScale);
			
				//$("<div>", { class : "graphPoint" , "data-name" : key , "data-num" : _g.graphData.step[i][key].length , style : "background-color:"+_g.graphData.colorGrid[key]+"; bottom:"+(CHATS)+"px; left:"+((i*1000*_g.graphData.xScale)+EDGE)+";" }).appendTo("#graphContainer");
			
				$("<div>", { class : "graphPoint" , "data-name" : key , "data-num" : _g.graphData.step[i][key].length , style : "background-color:"+_g.graphData.colorGrid[key].color+"; height:"+(CHATS)+"px; left:"+((i*1000*_g.graphData.xScale)+_g.graphData.colorGrid[key].edge)+"px;" }).appendTo("#graphContainer");
			
			}
		
		}
		
	}

}

function calculateData() {

	var deadzone = 0;
	var deadzoneD = [0,0];
	
	_g.graphData.interval = parseInt($("#dataInterval").val()) || 30;

	_g.graphData.deadzone = [];
	_g.graphData.step = [];
	_g.graphData.xScale = 1;
	_g.graphData.xSize = 1;
	_g.graphData.yScale = 1;
	_g.graphData.xLabels = [];
	
	var baseInt = _g.dataset[_g.low][2];
	var step = 0;
	_g.graphData.xLabels.push(baseInt);
	baseInt = addToDate(baseInt,_g.graphData.interval);
	
	for ( var i = _g.low; i < _g.high; i++ ) {
	
		if (_g.dataset[i][2] >= baseInt) {
	
			step++;
			if (deadzone == 0) { deadzoneD[0] = baseInt; }
			deadzone++;
			baseInt = addToDate(baseInt,_g.graphData.interval);
			_g.graphData.xLabels.push(baseInt);
			
		}
	
		if (_g.dataset[i][2] < baseInt) {
		
			if (deadzone > 1) {
				deadzoneD[1] = baseInt;
				_g.graphData.deadzone.push(deadzoneD);
			}
			deadzone = 0;
		
			if (_g.graphData.step[step] == undefined) {
				_g.graphData.step[step] = {};
			}
			
			if (!(_g.dataset[i][1] in _g.graphData.step[step])) {
				_g.graphData.step[step][_g.dataset[i][1]] = [];
			}
			
			_g.graphData.step[step][_g.dataset[i][1]].push(_g.dataset[i]);
		
		}
	
	}
	
	_g.graphData.xScale = 1/(step+1);
	
	var MAXCHAT = 1;
	var MAXEMP = 0;
	
	var EMPS = {};
	
	for (var i = 0; i < _g.graphData.step.length; i++) {
	
		for (var key in _g.graphData.step[i]) {
		
			if (_g.graphData.step[i][key].length > MAXCHAT) {
				MAXCHAT = _g.graphData.step[i][key].length;
			}
			
			if (!(key in EMPS)) {
			
				if (!($("[data-name=\""+key+"\"]").hasClass("strikeout"))) {
					MAXEMP++;
				}
				EMPS[key] = "";
			
			}
		
		}
	
	}
	
	_g.graphData.yScale = 1/MAXCHAT;
	_g.graphData.xSize = MAXEMP;
	
	drawGraph();

}

function addToDate(d,m) {

	if (typeof d == "string") { d = parseDate(d); };
	if (d.length != 5) return null;
	
	for (var i = 0; i < d.length; i++) {
		d[i] = parseInt(d[i]);
	}
	
	d[4]+=m;
	
	while (d[4] >= 60) { d[4] -= 60; d[3] += 1; }
	while (d[3] >= 24) { d[3] -= 24; d[1] += 1; }
	while (d[1] > 31) { d[1] = 1; d[0]++; }
	
	if (d[1] < 10) { d[1] = "0"+d[1]; }
	if (d[3] < 10) { d[3] = "0"+d[3]; }
	if (d[4] < 10) { d[4] = "0"+d[4]; }
	d = d[0]+"/"+d[1]+"/"+d[2]+" "+d[3]+":"+d[4];
	
	return d;

}

function setDataRange() {

	var l = $("#dataRangeLow").val() || $("#dataRangeLow").attr("placeholder");
	var h = $("#dataRangeHigh").val() || $("#dataRangeHigh").attr("placeholder");
	
	console.log(l,h);
	
	l = parseDate(l,true);
	h = parseDate(h,true);
	
	if (l && h) {
	
		if (l[3] < 10) { l[3] = "0"+l[3]; }
		if (h[3] < 10) { h[3] = "0"+h[3]; }
	
		l = l[0]+"/"+l[1]+"/"+l[2]+" "+l[3]+":"+l[4];
		h = h[0]+"/"+h[1]+"/"+h[2]+" "+h[3]+":"+h[4];
		
		_g.low = 0;
		_g.high = _g.dataset.length;
		
		for (var i = 0; i < _g.dataset.length; i++) {
			
			if (l >= _g.dataset[Math.max(0,i-1)][2] && l <= _g.dataset[Math.min(_g.dataset.length-1,i+1)][2]) {
				console.log("set" + (i+1));
				_g.low = i+1;
				break;
			}
		}
		
		for (var i = 0; i < _g.dataset.length; i++) {
			if (h >= _g.dataset[Math.max(0,i-1)][2] && h <= _g.dataset[Math.min(_g.dataset.length-1,i+1)][2]) {
				console.log("set" + i);
				_g.high = i;
				break;
			}
		}
		
	}

}

function setupHooks() {

	$("#dataRangeLow").attr("placeholder",_g.dataset[0][2]);
	$("#dataRangeHigh").attr("placeholder",_g.dataset[_g.dataset.length-1][2]);
	$("#dataRangeSubmit").click(function() { setDataRange(); });
	
	$("#parse").click(function() { calculateData(); });
	
	$("#legendContainer").on("click",".legendEntry",function(e) { toggleEntry(e); });
	
	$("#legendHide").click(function() {	$(".legendEntry").not(".strikeout").click(); });
	$("#legendShow").click(function() {	$(".legendEntry.strikeout").click(); });
	
	$("#graphContainer").on("mouseenter",".graphPoint",function(e) {
		$("#tooltip").show().text(e.currentTarget.dataset.name+" : "+e.currentTarget.dataset.num).css("top",e.pageY).css("left",e.pageX+20);
	}).on("mouseleave",".graphPoint", function() { $("#tooltip").hide()}); 

}

function sortData() {

	if (_g.dataset.length < 1) { return; }
	
	var o = _g.dataset;
	
	/*for (var e = 1; e < o.length; e++) {
		if (e % 500 == 0) { console.log(e); }
	
		for (var i = e; i > 0; i--) {
		
			var a = parseDate(o[i][2]);
			var b = parseDate(o[i-1][2]);
			
			if (a[1] < b[1]) {
			
				var t = o[i];
				o[i] = o[i-1];
				o[i-1] = t;
			
			}
		
		}
	
	}*/
	o.timsort(function(a,b) { if (a[2] < b[2]) { return -1; } if (a[2] > b[2]) { return 1; } return 0; });
	
	console.log(o);

}

function parseDate(d, s = false) {

	var r = 0;
	
	d = d.replace(" ","/");
	d = d.replace(":","/");
	d = d.split("/");
	
	if (d.length == 5) {
	
		return d;
		
	} else if (d.length == 3 && s) {

		d.push("0");
		d.push("0");
		
		return d;
	
	} else {
		
		console.error("parseDate : [" + d.toString() + "] did not parse properly. ");
		return null;
		
	}

}

$(function() {

	start();

});

=======
'use strict';

import {dataset} from './exportedData.js';

var _g = {};

function start() {

	_g.dataset = dataset;
	_g.low = 0;
	_g.high = _g.dataset.length;
	_g.graphData = {};
	
	sortData();
	setupHooks();

}

function toggleEntry(e) {

	$(e.currentTarget).toggleClass("strikeout");

	var tar = e.currentTarget.dataset.name;
	
	$(".graphPoint[data-name=\""+tar+"\"]").toggle();

}

function drawGraph() {

	$("#graphContainer").html("");
	$("#legendContainer").html("");
	
	var colorGrid = {};
	
	var STEP = 0;
	var EDGE = 0;
	
	for (var i = 0; i < 400; i += (_g.graphData.yScale*350)) {
	
		$("<div>", { class : "graphYAxis", style : "bottom:"+i+"px;" , "data-Y" : i }).appendTo("#graphContainer");
	
	}
	
	for (var i = 0; i < _g.graphData.step.length; i++) {
	
		$("<div>", { class : "graphXAxis", style : "top:0px; left:"+(i*1000*_g.graphData.xScale)+"px;" , "data-X" : i}).appendTo("#graphContainer");
		var e = $("<div>", { class : "graphXLabelContainer" , style : "left:"+((i+0.5)*1000*_g.graphData.xScale)+"px;" }).appendTo("#graphContainer");
		$("<div>", { class : "graphXLabel", "data-X" : i , text : _g.graphData.xLabels[i] }).appendTo(e);
	
		for (var key in _g.graphData.step[i]) {
		
			if (!(key in colorGrid)) {
			
				colorGrid[key] = {};
			
				colorGrid[key].edge = EDGE;
				colorGrid[key].color = "rgb("+(Math.random()*256)+","+(Math.random()*256)+","+(Math.random()*256)+")";
				$("<div>", { class : "legendEntry" , style : "color:"+colorGrid[key].color+";" , "data-name" : key , text : key }).appendTo("#legendContainer");
				
				
				EDGE += ((1000*_g.graphData.xScale)/_g.graphData.xSize);
				console.log((1000*_g.graphData.xScale)/_g.graphData.xSize);
			
			}
		
			var CHATS = (_g.graphData.step[i][key].length)*(350*_g.graphData.yScale);
		
			//$("<div>", { class : "graphPoint" , "data-name" : key , "data-num" : _g.graphData.step[i][key].length , style : "background-color:"+colorGrid[key]+"; bottom:"+(CHATS)+"px; left:"+((i*1000*_g.graphData.xScale)+EDGE)+";" }).appendTo("#graphContainer");
		
			$("<div>", { class : "graphPoint" , "data-name" : key , "data-num" : _g.graphData.step[i][key].length , style : "background-color:"+colorGrid[key].color+"; height:"+(CHATS)+"px; left:"+((i*1000*_g.graphData.xScale)+colorGrid[key].edge)+"px;" }).appendTo("#graphContainer");
		
		}
		
	}

}

function calculateData() {

	_g.graphData.interval = 30;
	_g.graphData.step = [];
	_g.graphData.xScale = 1;
	_g.graphData.xSize = 1;
	_g.graphData.yScale = 1;
	_g.graphData.xLabels = [];
	
	var baseInt = _g.dataset[_g.low][2];
	var step = 0;
	_g.graphData.xLabels.push(baseInt);
	baseInt = addToDate(baseInt,30);
	
	for ( var i = _g.low; i < _g.high; i++ ) {
	
		if (_g.dataset[i][2] >= baseInt) {
	
			step++;
			baseInt = addToDate(baseInt,30);
			_g.graphData.xLabels.push(baseInt);
			
		}
	
		if (_g.dataset[i][2] < baseInt) {
		
			if (_g.graphData.step[step] == undefined) {
				_g.graphData.step[step] = {};
			}
			
			if (!(_g.dataset[i][1] in _g.graphData.step[step])) {
				_g.graphData.step[step][_g.dataset[i][1]] = [];
			}
			
			_g.graphData.step[step][_g.dataset[i][1]].push(_g.dataset[i]);
		
		}
	
	}
	
	_g.graphData.xScale = 1/(step+1);
	
	var MAXCHAT = 1;
	var MAXEMP = 0;
	
	var EMPS = {};
	
	for (var i = 0; i < _g.graphData.step.length; i++) {
	
		for (var key in _g.graphData.step[i]) {
		
			if (_g.graphData.step[i][key].length > MAXCHAT) {
				MAXCHAT = _g.graphData.step[i][key].length;
			}
			
			if (!(key in EMPS)) {
			
				MAXEMP++;
				EMPS[key] = "";
			
			}
		
		}
	
	}
	
	_g.graphData.yScale = 1/MAXCHAT;
	_g.graphData.xSize = MAXEMP;
	
	console.log(_g.graphData, 1000*_g.graphData.xScale);
	
	drawGraph();

}

function addToDate(d,m) {

	if (typeof d == "string") { d = parseDate(d); };
	if (d.length != 5) return null;
	
	for (var i = 0; i < d.length; i++) {
		d[i] = parseInt(d[i]);
	}
	
	d[4]+=m;
	
	while (d[4] >= 60) { d[4] -= 60; d[3] += 1; }
	while (d[3] >= 24) { d[3] -= 24; d[1] += 1; }
	while (d[1] > 31) { d[1] = 1; d[0]++; }
	
	if (d[3] < 10) { d[3] = "0"+d[3]; }
	if (d[4] < 10) { d[4] = "0"+d[4]; }
	d = d[0]+"/"+d[1]+"/"+d[2]+" "+d[3]+":"+d[4];
	
	return d;

}

function setDataRange() {

	var l = $("#dataRangeLow").val() || $("#dataRangeLow").attr("placeholder");
	var h = $("#dataRangeHigh").val() || $("#dataRangeHigh").attr("placeholder");
	
	console.log(l,h);
	
	l = parseDate(l,true);
	h = parseDate(h,true);
	
	if (l && h) {
	
		if (l[3] < 10) { l[3] = "0"+l[3]; }
		if (h[3] < 10) { h[3] = "0"+h[3]; }
	
		l = l[0]+"/"+l[1]+"/"+l[2]+" "+l[3]+":"+l[4];
		h = h[0]+"/"+h[1]+"/"+h[2]+" "+h[3]+":"+h[4];
		
		_g.low = 0;
		_g.high = _g.dataset.length;
		
		for (var i = 0; i < _g.dataset.length; i++) {
			
			if (l >= _g.dataset[Math.max(0,i-1)][2] && l <= _g.dataset[Math.min(_g.dataset.length-1,i+1)][2]) {
				console.log("set" + (i+1));
				_g.low = i+1;
				break;
			}
		}
		
		for (var i = 0; i < _g.dataset.length; i++) {
			if (h >= _g.dataset[Math.max(0,i-1)][2] && h <= _g.dataset[Math.min(_g.dataset.length-1,i+1)][2]) {
				console.log("set" + i);
				_g.high = i;
				break;
			}
		}
		
	}

}

function setupHooks() {

	$("#dataRangeLow").attr("placeholder",_g.dataset[0][2]);
	$("#dataRangeHigh").attr("placeholder",_g.dataset[_g.dataset.length-1][2]);
	$("#dataRangeSubmit").click(function() { setDataRange(); });
	
	$("#parse").click(function() { calculateData(); });
	
	$("#legendContainer").on("click",".legendEntry",function(e) { toggleEntry(e); });
	
	$("#legendHide").click(function() {	$(".legendEntry").not(".strikeout").click(); });
	$("#legendShow").click(function() {	$(".legendEntry.strikeout").click(); });
	
	$("#graphContainer").on("mouseenter",".graphPoint",function(e) {
		$("#tooltip").show().text(e.currentTarget.dataset.name+" : "+e.currentTarget.dataset.num).css("top",e.pageY).css("left",e.pageX+20);
	}).on("mouseleave",".graphPoint", function() { $("#tooltip").hide()}); 

}

function sortData() {

	if (_g.dataset.length < 1) { return; }
	
	var o = _g.dataset;
	
	/*for (var e = 1; e < o.length; e++) {
		if (e % 500 == 0) { console.log(e); }
	
		for (var i = e; i > 0; i--) {
		
			var a = parseDate(o[i][2]);
			var b = parseDate(o[i-1][2]);
			
			if (a[1] < b[1]) {
			
				var t = o[i];
				o[i] = o[i-1];
				o[i-1] = t;
			
			}
		
		}
	
	}*/
	o.timsort(function(a,b) { if (a[2] < b[2]) { return -1; } if (a[2] > b[2]) { return 1; } return 0; });
	
	console.log(o);

}

function parseDate(d, s = false) {

	var r = 0;
	
	d = d.replace(" ","/");
	d = d.replace(":","/");
	d = d.split("/");
	
	if (d.length == 5) {
	
		return d;
		
	} else if (d.length == 3 && s) {

		d.push("0");
		d.push("0");
		
		return d;
	
	} else {
		
		console.error("parseDate : [" + d.toString() + "] did not parse properly. ");
		return null;
		
	}

}

$(function() {

	start();

});

>>>>>>> fa06a25019505fad403f667f3c5c4474dfa7360b
