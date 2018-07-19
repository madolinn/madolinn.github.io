'use strict';

import { _g } from './client.js';
import { draw } from './draw.js';
import { board, shape, bin } from './board.js';

var game = {

	boards : [],
	
	inHand : undefined,
	
	mousePos : [0,0],
	
	bin : undefined
	
	};

game.newGame = function() {

	game.boards = [];
	game.newBoard();
	game.newBoard();
	game.newBoard();
	game.newBoard();
	game.bin = new bin();

}

game.newBoard = function(b) {

	if (b != undefined) {
	
		game.boards[b] = new board(b);

	
	} else {
	
		game.boards.push(new board(game.boards.length));
	
	}


}

game.grabPiece = function(slot) {

	game.inHand = game.bin.pieces[slot];

	game.bin.pieces[slot].held = true;

}

game.dropPiece = function() {

	game.inHand = undefined;
	
	for (var i = 0; i < game.bin.pieces.length; i++) {
	
		game.bin.pieces[i].held = false;
		
	}

}

game.placePiece = function(b, e) {

	if (game.inHand == undefined) { return; }

	var pos = [0,0];
	pos[0] = Math.floor((game.mousePos[0]-_g.boffsets[b][0])/16)-(Math.floor(game.inHand.layout[0].length/2));
	pos[1] = Math.floor((game.mousePos[1]-_g.boffsets[b][1])/16)-(Math.floor(game.inHand.layout.length/2));
	
	if (game.boards[b].placePiece(pos,game.inHand)) {
	
		game.inHand.board = b;
		game.inHand.boardPos = pos;
		game.inHand.held = false;
		game.boards[b].pieces.push(game.inHand);
		game.inHand = undefined;
		
		game.bin.newPiece();
	
	}

}

game.rotatePiece = function(dir) {

	if (game.inHand == undefined) { return; }

	game.inHand.rotateShape(dir);

}

game.keypress = function(e) {

	if (game.inHand != undefined) { 

		if (e.key == "x") {
			game.inHand.rotateShape();
		} else if (e.key == "c") {
			game.inHand.rotateShape(1);
		} else if (e.key == "z") {
			game.inHand.mirrorShape();
		}
	
	}

}

game.mouseMove = function(e) {

	game.mousePos = [e.offsetX, e.offsetY];

}

game.mouseClick = function(e) {

	if (e.which == 3) {
	
		game.dropPiece();
	
	} else {
	
		if (isWithin([e.offsetX,e.offsetY], game.bin.pos, game.bin.size)) {
		
			if (game.inHand == undefined) {
		
				var c = game.bin.pos[0];
			
				for (var x = 0; x < 3; x++) {
				
					c+=(game.bin.size[0]/3);
					if (e.offsetX <= c) {
						game.grabPiece(x);
						break;
					}
				
				}
				
			} else {
			
				game.dropPiece();
			
			}
		
		} else {
		
			var l = _g.boffsets;
		
			for (var i = 0; i < l.length; i++) {
			
				if (isWithin([e.offsetX,e.offsetY], l[i], [320,320])) {
				
					game.placePiece(i,e);
				
				}
			
			}
		
		}
		
	}
}

function isWithin(pos, bound, size)  {

	if (pos[0] >= bound[0] && pos[0] <= bound[0]+size[0] && pos[1] >= bound[1] && pos[1] <= bound[1]+size[1]) {
		return true;
	}
	
	return false;

}

export { game };