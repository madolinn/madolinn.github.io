'use strict';

import { game } from './game.js';
import { _cv } from './client.js';

var draw = { };


draw.renderLoop = function() {

	_cv[0].clearRect(0,0,700,700);

	for (var i = 0; i < game.boards.length; i++) {
	
		game.boards[i].drawBoard();
		game.boards[i].drawPieces();
	
	}
	
	game.bin.drawBin();
	game.bin.drawHand();

}

/*elem.element = class element {

	constructor(x,y) {
	
		this.x = x;
		this.y = y;
	
	}

}*/

export { draw };