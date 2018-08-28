'use strict';

import { game } from './game.js';
import { _cv } from './client.js';
import { mapManager } from './mapManager.js';
import { worldManager } from './worldManager.js';

var draw = { order : new Array(1000) };


draw.renderLoop = function() {

	//console.time("Render Time");

	_cv[0].clearRect(0,0,700,700);

	for (var y = 0; y < mapManager.current.size[1]; y++) {
		for (var x = 0; x < mapManager.current.size[0]; x++) {
		
			if (mapManager.current.layers.collision[y][x] == 1) { _cv[0].fillStyle = "rgba(125,125,125,1)"; } else { _cv[0].fillStyle = "rgba(200,200,200,1)"; }
			if (mapManager.current.layers.groundType[y][x] == 2) { _cv[0].fillStyle = "rgba(100,125,175,1)"; }
		
			_cv[0].fillRect(x*32,y*32,32,32);
		
		}
	}
	
	var o = Array.concat(worldManager.objects,mapManager.current.objects);
	
	for (var e = 1; e < o.length; e++) {
		for (var i = e; i > 0; i--) {
			if (o[i].layer < o[i-1].layer) {
			
				var t = o[i];
				o[i] = o[i-1];
				o[i-1] = t;
				//break;
				
			} else if (o[i].layer == o[i-1].layer) {
				if (o[i].pos[1] < o[i-1].pos[1]) {
				
					var t = o[i];
					o[i] = o[i-1];
					o[i-1] = t;
					//break;
				
				} else if (o[i].pos[1] == o[i-1].pos[1]) {
					if (o[i].pos[0] < o[i-1].pos[0]) {
						var t = o[i];
						o[i] = o[i-1];
						o[i-1] = t;
						//break;
					}
				
				}
			}
		}
	}
	
	for (var i = 0; i < o.length; i++) {
	
		o[i].draw();
	
	}
	
	//console.timeEnd("Render Time");

}

/*elem.element = class element {

	constructor(x,y) {
	
		this.x = x;
		this.y = y;
	
	}

}*/

export { draw };