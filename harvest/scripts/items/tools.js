'use strict';

import { _cv, _g, isWithin, isInBounds } from '../client.js';
import { game } from '../game.js';
import { image } from '../image.js';
import { mapManager } from '../mapManager.js';
import { worldManager } from '../worldManager.js';

export class BaseTool {

	constructor() {
	
		this.usable = true;
		this.windUp = false;
		this.level = 1;
		
		this.maxStack = 1;
		this.quantity = 1;
		
		this.name = "A tool";
		this.desc = "Probably shouldn't have this. Probably.";
	
	}
	
	useItem(obj) {
	
		console.log(this, "using with", obj);
	
	}
	
}

export class toolHand extends BaseTool {

	constructor() {
	
		super();
	
	}
	
	useItem(obj) {
	
	}

}

export class toolHoe extends BaseTool {

	constructor() {
	
		super();
	
		this.windUp = true;
		
		this.name = "Hoe";
		this.desc = "Use to till the ground."
	
	}
	
	useItem(obj) {
	
		var loc = [obj.pos[0]+(obj.size[0]/2),obj.pos[1]+(obj.size[1]/2)];
		
		var facing = [0,0];
		
		if (obj.facing == "Down") { facing[1] += 1; }
		else if (obj.facing == "Up") { facing[1] -= 1; }
		else if (obj.facing == "Left") { facing[0] -= 1; }
		else if (obj.facing == "Right") { facing[0] += 1; }
		
		loc = [Math.floor((loc[0]+(facing[0]*obj.size[0]))/32),Math.floor((loc[1]+(facing[1]*obj.size[1]))/32)];
		
		if (this.level >= 3 && obj.toolWindup >= 120) {
		
			for (var y = -1; y < 2; y++) {
				for (var x = -1; x < 2; x++) {
				
					if (isInBounds(loc[1]+facing[1]+y,mapManager.current.layers.groundType.length) && isInBounds(loc[0]+facing[0]+x,mapManager.current.layers.groundType[0].length)) {
				
						if (mapManager.current.layers.groundType[loc[1]+facing[1]+y][loc[0]+facing[0]+x] == 1) {
					
							mapManager.current.layers.groundType[loc[1]+facing[1]+y][loc[0]+facing[0]+x] = 2;
					
						}
					
					} else { continue; }
					
				}
			}
		
		} else if (this.level >= 2 && obj.toolWindup >= 60) {
		
			for (var i = 0; i < 3; i++) {
			
				if (isInBounds(loc[1]+(facing[1]*i),mapManager.current.layers.groundType.length) && isInBounds(loc[0]+(facing[0]*i),mapManager.current.layers.groundType[0].length)) {
			
					if (mapManager.current.layers.groundType[loc[1]+(facing[1]*i)][loc[0]+(facing[0]*i)] == 1) {
				
						mapManager.current.layers.groundType[loc[1]+(facing[1]*i)][loc[0]+(facing[0]*i)] = 2;
				
					}
				
				} else { continue; }
			}
			
		} else if (this.level >= 1) {
		
			if (mapManager.current.layers.groundType[loc[1]][loc[0]] == 1) {
			
				mapManager.current.layers.groundType[loc[1]][loc[0]] = 2;
			
			}
			
		} 
	
		obj.toolWindup = 0;
		
		console.log("ASD");
	
	}

}