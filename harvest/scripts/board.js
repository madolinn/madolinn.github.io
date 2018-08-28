'use strict';

import { _cv, _g, isWithin } from './client.js';
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

}

export { board, shape, bin };