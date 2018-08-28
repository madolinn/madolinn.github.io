'use strict';

import { _cv, _g, isWithin } from './client.js';
import { game } from './game.js';
import { objectManager } from './objectManager.js';

import * as Maps from './maps/mapList.js';

var mapManager = { current : -1 };


mapManager.createMaps = function() {

	for (var key in Maps) {
	
		Maps[key].create();
	
	}

}

mapManager.setMap = function(ind) {

	this.current = Maps.farm;

}

mapManager.addObjectToCurrent = function(type, pos, props) {

	props = props || {};

	props.pos = pos;
	props.map = mapManager.current;
	
	var o = objectManager.create(type,props);
	mapManager.current.objects.push(o);
	
	return o;

}

mapManager.stepLocalObjects = function() {

	

}

class Map {

	constructor() {
	
		this.objects = [];
		this.size = [0,0];
		
		this.layers = {
		
			collision : new Array(1000),
			tile : new Array(1000),
			groundType : new Array(1000)
		
		}
		
		for (var i = 0; i < this.layers.collision.length; i++) {
		
			this.layers.collision[i] = new Array(1000);
			this.layers.tile[i] = new Array(1000);
			this.layers.groundType[i] = new Array(1000);
		
		}
	
	}

}

export { mapManager, Map };