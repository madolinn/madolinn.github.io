'use strict';

import { _g, isWithin } from './client.js';
import { draw } from './draw.js';
import { preload } from './preload.js';
import { mapManager } from './mapManager.js';
import { objectManager } from './objectManager.js';
import { worldManager } from './worldManager.js';
import { itemManager } from './itemManager.js';

var game = {
	
};

game.newGame = function() {

	mapManager.createMaps();
	mapManager.setMap();
	
	worldManager.playerObject = worldManager.addObject("Human",[32,32]);
	itemManager.give(worldManager.playerObject,"toolHoe");
	console.log(worldManager.playerObject);

	/*for (var i = 32; i < 200; i+=24) {
		worldManager.addObject("BaseCrop",[i,64]);
		worldManager.addObject("BaseCrop",[i+48,96]);
	}*/
	
	worldManager.addObject("CropTomato",[64,64]);
	
	setTimeout(function() { game.step(); },1000/60);

}

game.step = function() {

	//console.time("Render");
	draw.renderLoop();
	//console.timeEnd("Render");
	//console.time("Steps");
	worldManager.stepGlobalObjects();
	mapManager.stepLocalObjects();
	//console.timeEnd("Steps");
	//draw.renderLoop();
	
	setTimeout(function() { game.step(); },1000/60);

}


game.keypress = function(e, s) {

	if (worldManager.playerObject != undefined) {
		worldManager.playerObject.keyboardInput(e, s);
	}

}

export { game };