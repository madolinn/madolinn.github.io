'use strict';

import { _cv, _g, isWithin } from './client.js';
import { preload } from './preload.js';
//import { game } from './game.js';

var image = { list : new Array(1000) };

image.getSheet = function(ind) {

	if (image.list[ind] != undefined) { return image.list[ind]; } else { return image.list[0]; }

}

export { image };