'use strict';

import { _cv, _g } from './client.js';
import { game } from './game.js';

class bin {

	constructor() {
	
		this.pieces = [];
		this.pos = [160,208];
		this.size = [320,128];
		
		this.newPiece();
		this.newPiece();
		this.newPiece();
	
	}
	
	newPiece() {
	
		if (this.pieces.length < 3) {
		
			this.pieces.push(new shape());
			
		} else {
		
			for (var i = 0; i < this.pieces.length; i++) {
			
				if (this.pieces[i].board > -1) {
				
					this.pieces[i] = new shape();
				
				}
			
			}
		
		}
	
	}
	
	drawBin() {
	
		_cv[0].fillStyle = "rgba(54,54,54,1)";
		_cv[0].fillRect(this.pos[0],this.pos[1],this.size[0],this.size[1]);
		
		this.drawPieces();
	
	}
	
	drawPieces() {
	
		_cv[0].fillStyle = "rgba(203,156,109,1)";
	
		for (var i = 0; i < this.pieces.length; i++) {
		
			if (this.pieces[i].held == false) {
		
				var mpos = this.pos.slice(0);
				mpos[0]+=(100*i)+50-(this.pieces[i].layout[0].length*16/2);
				mpos[1]+=64-(this.pieces[i].layout.length*16/2);
			
				this.pieces[i].drawShape(mpos);
				
			} else {
			
				this.pieces[i].drawShape([(Math.floor(game.mousePos[0]/16)*16)-(Math.floor(this.pieces[i].layout[0].length/2)*16),(Math.floor(game.mousePos[1]/16)*16)-(Math.floor(this.pieces[i].layout.length/2)*16)]);
			
			}
		
		}
	
	}

}

class board {

	constructor(ind) {
	
		this.index = ind;
		this.accepting = true;
		this.layout = [];
		this.pieces = [];
		this.pos = [];
		this.size = [320,320];
		
		this.setupPosition(ind);
		this.setupLayout();
	
	}
	
	setupPosition(ind) {
	
		var l = _g.boffsets;
	
		this.pos = l[ind];
	
	}
	
	setupLayout() {
	
		var l = [
			[[0,1,1,1,1,1,1,1],[0,1,1,1,1,1,1,0],[1,1,1,1,1,1,1,0]],
			[[0,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,0],[0,1,1,1,1,1,1,0]],
			[[1,1,1,1,1,1,1,0,0],[0,0,1,1,1,1,1,1,1],[0,0,1,1,1,1,1,0,0],[0,0,1,1,1,1,1,1,0]],
			[[1,1,1,1,1,1,1],[1,1,1,1,1,1,0],[1,1,1,1,1,1,1],[0,1,1,1,1,1,0]],
			[[1,1,1,1,1,1,0],[1,1,1,1,1,1,0],[1,1,1,1,1,1,0],[1,1,1,1,1,1,1]],
			[[1,1,1,1,1,1,0],[1,1,1,1,1,1,1],[0,1,1,1,1,1,1],[1,1,1,1,1,1,0]],
			[[0,1,1,1,1,1,1,0],[1,1,1,1,1,1,1,1],[0,1,1,1,1,1,0,0],[0,1,1,1,1,1,1,0]],
			[[0,1,1,1,1,1,1],[0,1,1,1,1,1,1],[0,1,1,1,1,1,1],[1,1,1,1,1,1,1]],
			[[0,1,1,1,1,1,1,0],[0,1,1,1,1,1,1,0],[0,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,0],[0,1,1,1,1,1,1,0],[0,1,1,1,1,1,1,0],[0,1,1,1,1,1,1,0],[0,1,1,1,1,1,1,0]]
		];
		
		var p = Math.floor(Math.random()*l.length);
		
		var t = l[p];
		
		var r = [];
		
		for (var i = 0; i < t[0].length; i++) { r.push(0); }
		
		for (var i = 0; i < 4; i++) {
		
			t.unshift(r.slice(0))
			t.push(r.slice(0));
		
		}
		
		for (var y = 0; y < t.length; y++) {
		
			for (var i = 0; i < 4; i++) {
		
				t[y].unshift(0);
				t[y].push(0);
		
			}
		
		}
		
		this.layout = t;
	
	}
	
	placePiece(pos,shape) {
	
		if (!this.accepting) { return false; }
	
		var can = false;
	
		for (var y = 0; y < shape.layout.length; y++) {
			for (var x = 0; x < shape.layout[0].length; x++) {
			
				if (shape.layout[y][x] != 0) {
				
					if (pos[0]+x >= 0 && pos[0]+x < this.layout[0].length) {
						if (pos[1]+y >= 0 && pos[1]+y < this.layout.length) {
							if (this.layout[pos[1]+y][pos[0]+x] != 0) {
							
								this.layout[pos[1]+y][pos[0]+x]++;
								
								can = true;
							
							}
						}
					}
				
				}
			}
		}
		
		if (can) {
			this.checkCompletion();
			return true;
		} else { return false; }
	
	}
	
	completeBoard() {
	
		this.accepting = false;
		setTimeout(this.cleanupBoard.bind(this),5000);
	
	}
	
	cleanupBoard() {

		game.newBoard(this.index);
	
	}
	
	checkCompletion() {
	
		for (var y = 0; y < this.layout.length; y++) {
			for (var x = 0; x < this.layout[0].length; x++) {
		
				if (this.layout[y][x] == 1) {
				
					return;
				
				}
		
			}
		}
	
		this.completeBoard();
	
	}
	
	drawBoard() {
	
		_cv[0].fillStyle = "rgba(155,113,70,1)";
		
		_cv[0].fillRect(this.pos[0],this.pos[1],this.size[0],this.size[1]);
	
		_cv[0].fillStyle = "rgba(0,0,0,1)";
	
		for (var y = 0; y < this.layout.length; y++) {
			for (var x = 0; x < this.layout[0].length; x++) {
				
				if (this.layout[y][x] > 0) {
					_cv[0].fillRect(this.pos[0]+(x*16),this.pos[1]+(y*16),16,16);
				}
				
			}
		}
		
		/*_cv[0].fillStyle = "rgba(255,0,0,1)";
		for (var y = 0; y < this.layout.length; y++) {
			for (var x = 0; x < this.layout[0].length; x++) {
		
				if (this.layout[y][x] > 1) {
				
					_cv[0].fillRect(this.pos[0]+(x*16),this.pos[1]+(y*16),16,16);
				}
				}
				}
		
		*/
	
	}
	
	drawPieces() {
	
		_cv[0].fillStyle = "rgba(203,156,109,1)";
	
		for (var i = 0; i < this.pieces.length; i++) {
			this.pieces[i].drawShape(this.pos);
		}
	}

}

class shape {

	constructor() {
	
		this.layout = [];
		this.board = -1;
		this.boardPos = [0,0];
		this.held = false;
		
		this.setupLayout();
	
	}
	
	setupLayout() {
	
		var l = [
			[[1,1,1],[0,1,1]],
			[[0,1,1],[1,1,0],[0,1,0]],
			[[1,1,1,1],[0,1,0,0]],
			[[1,1,1],[0,1,0],[0,1,0]],
			[[1,0,0],[1,1,0],[0,1,1]],
			[[1,1,0,0],[0,1,1,1]],
			[[1,0,1],[1,1,1]],
			[[1,0,0],[1,0,0],[1,1,1]],
			[[0,0,0,1],[1,1,1,1]],
			[[1,1,0],[0,1,0],[0,1,1]],
			[[0,1,0],[1,1,1],[0,1,0]],
			[[1,1,1,1,1]]
		];
		
		var fs = [22,14,14,7,4,8,4,4,8,4,3,2];
		
		var p = Math.ceil(Math.random()*94);
		var t = 0;
		
		for (var k = 0; k < fs.length; k++) {
			t += fs[k];
			if (p <= t) { this.layout = l[k]; break; }
		}
		
	}
	
	drawShape(bpos) {
	
		for (var y = 0; y < this.layout.length; y++) {
			for (var x = 0; x < this.layout[0].length; x++) {
				
				if (this.layout[y][x] == 1) {
					_cv[0].fillRect(bpos[0]+(this.boardPos[0]*16)+(x*16),bpos[1]+(this.boardPos[1]*16)+(y*16),16,16);
				}
				
			}
		}
	
	}
	
	rotateShape(dir) {

		dir = dir || 0;
		
		var nl = [];
		
		if (dir == 1) {
		
			for (var y = 0; y < this.layout[0].length; y++) {
				nl.push(new Array());
				for (var x = 0; x < this.layout.length; x++) {
					nl[y].push(this.layout[x][this.layout[0].length-y-1]);
				}
			}
		
		} else {
		
			for (var y = 0; y < this.layout[0].length; y++) {
				nl.push(new Array());
				for (var x = 0; x < this.layout.length; x++) {
					nl[y].push(this.layout[x][this.layout[0].length-y-1]);
				}
			}
		
		}
		
		this.layout = nl;
	
	}
	
	mirrorShape() {
	
		var nl = [];
		
		for (var y = 0; y < this.layout.length; y++) {
			nl.push(new Array());
			for (var x = 0; x < this.layout[0].length; x++) {
				nl[y].push(this.layout[y][this.layout[0].length-1-x]);
			}
		}
		
		this.layout = nl;
	
	}

}

export { board, shape, bin };