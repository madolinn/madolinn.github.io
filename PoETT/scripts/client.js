_cv = null;

map = {};

w = 400;

mt = "Rarity: Unique\n\
Malicious Intent\n\
Cobalt Jewel\n\
--------\n\
Item Level: 74\n\
--------\n\
5% chance to Gain Unholy Might for 4 seconds on Melee Kill\n\
--------\n\
Each life taken makes the next a little easier.\n\
--------\n\
Place into an allocated Jewel Socket on the Passive Skill Tree. Right click to remove from the Socket.";

moduLoad.ready = function() {

	_cv = ($("#cv")[0].getContext('2d'));
	resetDefaults();
	parseText();
	
}

parseText = function() {
	
	map.split = mt.split("\n");
	map.rarity = map.split[0].match(/: (.+)/)[1];
	
	for (var i = 0; i < map.split.length; i++) {
		var meas = _cv.measureText(map.split[i]).width;
		if (meas+30 > w) {
			w = meas+30;
		}
	}
	
	if (w != 400) {
		_cv.canvas.width = w;
		resetDefaults();
	}
	
	position = 15;
	
	for (var i = 0; i < map.split.length; i++) {
		if (i == map.split.length-1) {
			if (map.split[i-1] == "--------") {
				if (map.split[i].length > 50) {
					_cv.fillStyle = "#7f7f7f";
				}
			}
		}
		position = parseLine(map.split[i], position);
	}
	
}

resetDefaults = function() {
	_cv.fillStyle = "#8787fe";
	_cv.strokeStyle = "#FFF";
	_cv.font = "18px Fontin";
	_cv.textAlign = "center";
}

parseLine = function(text, pos) {

	var multi = text.match(/(.+): (.+)/);

	if (text != "--------") {
		if (multi == null) {
			_cv.fillText(text, w/2, pos);
		} else {
			multi.splice(0,1);
			multi[0] += ": ";
			offsetText(multi, w/2, pos, ["#7f7f7f","#8787fe"]);
		}
		pos += 18;
	} else {
		_cv.beginPath();
		_cv.lineTo(w/2-100,pos-12);
		_cv.lineTo(w/2+100,pos-12);
		_cv.stroke();
		pos += 5;
	}
	
	return pos;
	
}

offsetText = function(text, x, y, color) {
	
	color = color || ["#8787fe"];
	
	var len = 0;
	var tot = 0;
	
	for (var i = 0; i < text.length; i++) {
		tot += _cv.measureText(text[i]).width;
	}
	
	_cv.textAlign = "left";
	
	for (var i = 0; i < text.length; i++) {
		_cv.fillStyle = color[Math.min(i,text.length)];
		_cv.fillText(text[i], x-(tot/2)+len, y);
		len += _cv.measureText(text[i]).width;
	}
	
	_cv.textAlign = "center";
	_cv.fillStyle = "#8787fe";
}