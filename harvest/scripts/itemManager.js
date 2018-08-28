'use strict';

import { _cv, _g, isWithin } from './client.js';
import { game } from './game.js';

import * as Items from './items/itemList.js';

var itemManager = {};

itemManager.give = function(obj, type, quan, props) {

	quan = quan || 1;
	props = props || {};
	props.quantity = quan;

	var item = itemManager.create(type, props);
	
	for (var r = 0; r < obj.inventory.length; r++) {
		for (var s = 0; s < obj.inventory[r].length; s++) {
		
			if (obj.inventory[r][s] == undefined) {
			
				obj.inventory[r][s] = item;
				return true;
			
			}
		
		}
	
	}
	
	return false;

}

itemManager.create = function(type, props) {

	if ({}.hasOwnProperty.call(Items, type)) {
		var o = new Items[type]();
		for (var key in props) {
			o[key] = props[key];
		}
		return o;
	} else {
		console.warn("No such type ["+type+"]");
		return itemManager.create("BaseTool",props);
	}

}

export { itemManager };