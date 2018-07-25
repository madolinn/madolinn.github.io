'use strict';

import {draw} from './draw.js';
import {game} from './game.js';

var _cv = [];
var _g = { boffsets : [[0,0],[320,0],[0,320],[320,320]] , bsize : [320,320]};

_cv.setupAll = function() {
	$("canvas").each(function(ind) {
		_cv[ind] = $(this)[0].getContext('2d');
	});
	return $("canvas").length;
}

function ready() {

	_cv.setupAll();
	
	game.newGame();
	
	setInterval(function() { draw.renderLoop(); },1000/30);

}

function isWithin(pos, bound, size)  {

	if (pos[0] >= bound[0] && pos[0] <= bound[0]+size[0] && pos[1] >= bound[1] && pos[1] <= bound[1]+size[1]) {
		return true;
	}
	
	return false;

}

$("canvas").eq(1).mousemove(function(e) { game.mouseMove(e); });
$("canvas").eq(1).click(function(e) { game.mouseClick(e); });
$("canvas").eq(1).contextmenu(function(e) { game.mouseClick(e); return false; }); 
$(document).keypress(function(e) { game.keypress(e); });

$(function() { ready(); });

export { _cv, _g, isWithin }