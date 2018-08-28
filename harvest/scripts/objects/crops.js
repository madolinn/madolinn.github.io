'use strict';

import { _cv, _g, isWithin } from '../client.js';
import { game } from '../game.js';
import { image } from '../image.js';
import { mapManager } from '../mapManager.js';
import { worldManager } from '../worldManager.js';

export class BaseCrop {

	constructor() {
	
		this.faction = "";
		this.map = -1;
		this.pos = [-100,-100];
		this.size = [32,32];
		this.collider = "square";
		this.solid = "false";
		this.moveVector = [0,0];
		
		this.sheet = image.getSheet(1);
		this.imageOffset = [4,4];
		this.layer = 4;
		
		this.action = "idle";
		this.actionList = { idle : [[48,72],[24,24],4] };
		this.frame = 0;
		
		this.daysAlive = 0;
		this.stages = [1,3,7];
	
	}
	
	step() {
	
	}
	
	daily() {
	
		this.daysAlive++;
		if (this.frame < this.stages.length) {
			if (this.daysAlive == this.stages[this.frame]) {
				this.frame++;
				this.layer = 5;
			}
		}
	
	}
	
	draw(pos, action, frame, scale) {
	
		pos = pos || this.pos;
		action = action || this.action;
		frame = frame || this.frame;
		scale = scale || 1;
		
		if (this.frame > this.actionList[action][2]) { this.frame = 0; }
		
		_cv[0].drawImage(
		this.sheet, 
		this.actionList[action][0][0]+(this.actionList[action][1][0]*frame), 
		this.actionList[action][0][1],
		this.actionList[action][1][0], 
		this.actionList[action][1][1],
		pos[0]+(this.imageOffset[0]*scale),
		pos[1]+(this.imageOffset[1]*scale),
		this.actionList[action][1][0]*scale, 
		this.actionList[action][1][1]*scale);
		
		/*_cv[0].strokeStyle = "rgba(255,255,255,1)";
		_cv[0].beginPath();
		_cv[0].arc(pos[0]+this.size[0]/2,pos[1]+this.size[0]/2,this.size[0]/2,Math.PI*2,0);
		_cv[0].stroke();*/
	
	}

}

export class CropTomato extends BaseCrop {

	constructor() {
	
		super();
		
		this.faction = "FARM";
	
	}
	
	step() {
		
	}

}