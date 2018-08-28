'use strict';

import { _cv, _g, isWithin } from './client.js';
import { game } from './game.js';
import { mapManager } from './mapManager.js';
import { objectManager } from './objectManager.js';

var worldManager = { objects : [] , playerObject : undefined, time : 0};

worldManager.stepGlobalObjects = function() {

	for (var i = 0; i < worldManager.objects.length; i++) {
	
		worldManager.objects[i].step();
	
	}
	
	this.time++;

}

worldManager.addObject = function(type, pos, props) {

	props = props || {};

	props.pos = pos;
	
	var o = objectManager.create(type,props);
	worldManager.objects.push(o);
	
	return o;

}

export { worldManager };