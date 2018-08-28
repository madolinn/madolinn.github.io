'use strict';

import { _cv, _g, isWithin } from './client.js';
import { game } from './game.js';
import { mapManager } from './mapManager.js';

import * as Objects from './objects/objectList.js';

var objectManager = {};

objectManager.create = function(type, props) {

	if ({}.hasOwnProperty.call(Objects, type)) {
		var o = new Objects[type]();
		for (var key in props) {
			o[key] = props[key];
		}
		return o;
	} else {
		console.warn("No such type ["+type+"]");
		return objectManager.create("BaseNPC",props);
	}

}

export { objectManager };