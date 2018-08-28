'use strict';

import {draw} from './draw.js';
import {game} from './game.js';
import {image} from './image.js';
import {preload} from './preload.js';

var _cv = [];
var _g = {};

_cv.setupAll = function() {
	$("canvas").each(function(ind) {
		$(this).attr("height",$(this).height()).attr("width",$(this).width());
		_cv[ind] = $(this)[0].getContext('2d');
		_cv[ind].imageSmoothingEnabled = false;
	});
	image.wCV = _cv[_cv.length-1];
	return $("canvas").length;
}

function preready() {

	_cv.setupAll();
	preload.start();

}

function ready() {

	console.log("READY!");
	game.newGame();
	
}

$(document).on("readya", function() { ready(); });

$(document).keydown(function(e) { game.keypress(e, "down"); });
$(document).keyup(function(e) { game.keypress(e, "up"); });

function isWithin(pos, bound, size) {

	if (pos[0] >= bound[0] && pos[0] <= bound[0]+size[0] && pos[1] >= bound[1] && pos[1] <= bound[1]+size[1]) {
		return true;
	}
	
	return false;

}

function isInBounds(index, max) {

	if (index >= 0 && index < max) { return true; }

	return false;

}

$(function() { preready(); });

export { _cv, _g, isWithin, isInBounds }