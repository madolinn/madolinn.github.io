'use strict';

import { _cv, _g, isWithin } from '../client.js';
import { game } from '../game.js';
import { image } from '../image.js';
import { mapManager } from '../mapManager.js';
import { worldManager } from '../worldManager.js';

export class BaseNPC {

	constructor() {
	
		this.faction = "";
		this.map = -1;
		this.pos = [-100,-100];
		this.size = [32,32];
		this.collider = "circle";
		this.solid = "partial";
		this.moveVector = [0,0];
		
		this.sheet = image.getSheet(0);
		this.imageOffset = [-4,-16];
		this.layer = 5;
		
		this.action = "idle";
		this.actionList = { idleDown : [[45,55],[23,32],3] };
		this.frame = 0;
		this.facing = "Down";
	
		this.toolWindup = 0;
		this.inventory = [new Array(10),new Array(10),new Array(10),new Array(10)];
		this.invSelected = 0;
	}
	
	step() {
	
	}
	
	daily() {
	
	}
	
	useItem() {
	
		if (this.inventory[0][this.selected] != undefined) {
		
			if (this.inventory[0][this.selected].usable = true) {
			
				this.inventory[0][this.selected].useItem(this);
			
			}
		
		}
	
	}
	
	tryMove(vec) {
	
		if (Math.abs(vec[0]+vec[1]) < this.size[0]) {
		
			//console.time("a");
		
			var collisions = [false,false];
			
			var tpos = [this.pos[0]+vec[0]+(this.size[0]/2),this.pos[1]+vec[1]+(this.size[1]/2)];
			
			var dualCheck = (vec[0] != 0 && vec[1] != 0) ? true : false;
			
			var gpos = [Math.floor(tpos[0]/32),Math.floor(tpos[1]/32)];
			
			//////////// Check Terrain Collisions ////////////
			
			for (var y = -1; y < 2; y++) {
				for (var x = -1; x < 2; x++) {
				
					if (gpos[0]+x < 0 || gpos[1]+y < 0) { continue; }
					if (gpos[0]+x >= mapManager.current.size[0] || gpos[1]+y >= mapManager.current.size[1]) { continue; }
					
					if (mapManager.current.layers.collision[gpos[1]+y][gpos[0]+x] == 1) {
						var c = this.checkCollision(tpos, { size : [32,32], pos : [(gpos[0]+x)*32,(gpos[1]+y)*32], collider : "square", solid : "true"}, dualCheck);
						
						for (var i = 0; i < 2; i++) {
						
							if (c[i] == true) { collisions[i] = true; }
							if (c.every(function(v) { v == true; })) { return; }
						
						}
						
					}
				
				}
			}
			
			////////////////////////////////////////////////////////////
			
			//////////// Check Local and Global Collisions ////////////
			
			var collidersList = [worldManager.objects,mapManager.current.objects];
			
			for (var l = 0; l < collidersList.length; l++) {
				
				for (var o = 0; o < collidersList[l].length; o++) {
				
					if (collidersList[l][o] == this || collidersList[l][o].solid == "false") { continue; }
				
					if (Math.sqrt(Math.pow(collidersList[l][o].pos[0]-this.pos[0],2)+Math.pow(collidersList[l][o].pos[1]-this.pos[1],2)) < (Math.sqrt(Math.pow(collidersList[l][o].size[0]+this.size[0],2)+Math.pow(collidersList[l][o].size[1]+this.size[1],2))*1.5)) {
				
					var c = this.checkCollision(tpos, collidersList[l][o], dualCheck);
							
					}	
					
					if (collidersList[l][o].solid == "true") {
					
						for (var i = 0; i < 2; i++) {
						
							if (c[i] == true) { collisions[i] = true; }
							if (c.every(function(v) { v == true; })) { return; }
						
						}
						
					}
			
				}
				
			}
			
			////////////////////////////////////////////////////////////
			
			//console.timeEnd("a");
			
			//this.checkCollision(tpos, { size:[32,32],pos:[100,100]});
			
			
			//this.checkCollision(tpos,
			
			//for (
			
			for (var i = 0; i < 2; i++) {
				if (collisions[i] == false) {
					this.pos[i] += vec[i];
				}
			}
			
			//this.pos[0] += vec[0];
			//this.pos[1] += vec[1];
			
		}
	
	}
	
	checkCollision(tpos, obj, dualCheck) {
		
		var collisions = [false,false];
		
		//tpos OK
		//v OK
		
		var tests = [[tpos[0],tpos[1]],[0,0]];
		
		if (dualCheck) {
			tests[0] = [tpos[0],this.pos[1]+(this.size[0]/2)];
			tests[1] = [this.pos[0]+(this.size[0]/2),tpos[1]];
		}
		
		for (var i = 0; i < 1+(dualCheck); i++) {
		
			//console.log(tests[i]);
			
			if (obj.collider == "square") {
			
				//Vectors of position difference
		
				var v = [tests[i][0]-obj.pos[0]-(obj.size[0]/2),tests[i][1]-obj.pos[1]-(obj.size[1]/2)];
				
				//Point of nearest contact
			
				var p = [Math.max((obj.size[0]/2*-1),Math.min(v[0],(obj.size[0]/2))),Math.max((obj.size[1]/2*-1),Math.min(v[1],(obj.size[1]/2)))];
				
				//Distance to point of nearest contact
				
				var d = Math.sqrt(Math.pow(obj.pos[0]+(obj.size[0]/2)+p[0]-tests[i][0],2)+Math.pow(obj.pos[1]+(obj.size[1]/2)+p[1]-tests[i][1],2));
				
				_cv[0].fillStyle = "rgba(100,255,100,1)";
				_cv[0].strokeRect(obj.pos[0],obj.pos[1],obj.size[0],obj.size[1]);
				
				_cv[0].fillStyle = "rgba(255,10,10,1)";
				_cv[0].fillRect(obj.pos[0]+p[0]+16,obj.pos[1]+p[1]+16,1,1);
				
			} else {
			
				//Vectors of position difference
			
				var v = [tests[i][0]-obj.pos[0]-(obj.size[0]/2),tests[i][1]-obj.pos[1]-(obj.size[1]/2)];
			
				var d = Math.sqrt(Math.pow(v[0],2)+Math.pow(v[1],2))-(obj.size[0]/2);
			
			}
			
			if (d < this.size[0]/2) {
			
				if (obj.solid == "true") {
			
					if (dualCheck) { collisions[i] = true; } else { collisions = [true,true]; }
					
				} else {
				
					//if (dualCheck) { collisions[i] = true; } else { collisions = [true,true]; }
					this.moveVector = [Math.abs(v[0])/v[0] || 0,Math.abs(v[1])/v[1] || 0];
					
					//console.log(this.moveVector);
				
				}
			
			}
			
			_cv[0].strokeStyle = "rgba(255,255,255,1)";
			_cv[0].beginPath();
			_cv[0].moveTo(tpos[0],tpos[1]);
			_cv[0].lineTo(tpos[0]-v[0],tpos[1]-v[1]);
			_cv[0].stroke();
			
		}
			
		return collisions;
	
	}
	
	draw(pos, action, frame, dir, scale) {
	
		pos = pos || this.pos;
		action = action || this.action;
		frame = frame || this.frame;
		scale = scale || 2;
		dir = dir || this.facing;
		
		action += dir;
		
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

export class Human extends BaseNPC {

	constructor() {
	
		super();
		
		this.faction = "FARM";
		this.inputs = [false,false,false,false,false];
		this.keyMap = { ArrowUp : 0, ArrowLeft : 1, ArrowDown : 2, ArrowRight : 3, z : 4};
		this.layer = 5;
	
	}
	
	step() {
	
		var tempVec = this.moveVector.slice();
		
		if (!this.inputs[4]) {
		
			if (this.toolWindup > 0) {
			
				this.inventory[0][this.invSelected].useItem(this);
			
			} else {
		
				tempVec[0] += (this.inputs[1]*-1) + (this.inputs[3]);
				tempVec[1] += (this.inputs[0]*-1) + (this.inputs[2]);
				
			}
			
		} else {
		
			if (this.inventory[0][this.invSelected] != undefined) {
			
				if (this.inventory[0][this.invSelected].usable == true) {
				
					if (this.inventory[0][this.invSelected].windUp == true) { this.toolWindup++;
					} else { this.inventory[0][this.invSelected].useItem(this); }
				
				}
			
			} else {
			
				// Use "Hand" tool
			
			}
		
		}
		
		if (tempVec[0] != 0 || tempVec[1] != 0) { this.tryMove(tempVec); }
		
		//this.moveVector[0] *= 0.5;
		//this.moveVector[1] *= 0.5;
		
		for (var i = 0; i < this.moveVector.length; i++) {
		
			this.moveVector[i] *= 0.5;
			if (Math.abs(this.moveVector[i]) <= 0.05) {
				this.moveVector[i] = 0;
			}
		
		}
		
	}
	
	keyboardInput(e, s) {
	
		if (s == "down") {
		
			if (this.keyMap[e.key] != undefined) {
				this.inputs[this.keyMap[e.key]] = true;
			}
		
		} else {
		
			if (this.keyMap[e.key] != undefined) {
				this.inputs[this.keyMap[e.key]] = false;
			}
		
		}
		
	}

}