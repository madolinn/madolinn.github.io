'use strict';

import { _g, isWithin } from './client.js';
import { draw } from './draw.js';
import { board, shape, bin } from './board.js';

var game = {

	boards : [],
	
	inHand : undefined,
	
	lastPlaced : undefined,
	
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

	if (slot != undefined) {

		game.inHand = game.bin.pieces[slot];

		game.bin.pieces[slot].held = true;
		
	} else {
	
		game.boards[game.lastPlaced].undoPiece();
	
		var p = game.boards[game.lastPlaced].pieces.pop();
	
		game.inHand = p;
		p.boardPos = [0,0];
		p.held = true;
	
	}

}

game.dropPiece = function() {

	if (game.inHand == undefined) { return; }

	if (game.inHand.board == -1) {
	
		game.inHand.held = false;
		game.inHand = undefined;
		
	}
	
}

game.placePiece = function(b, e) {

	if (game.inHand == undefined) { return; }
	
	if (game.inHand.board != -1 && game.inHand.board != b) { return; }

	var pos = [0,0];
	pos[0] = Math.floor((game.mousePos[0]-_g.boffsets[b][0])/16)-(Math.floor(game.inHand.layout[0].length/2));
	pos[1] = Math.floor((game.mousePos[1]-_g.boffsets[b][1])/16)-(Math.floor(game.inHand.layout.length/2));
	
	if (game.boards[b].placePiece(pos,game.inHand)) {
	
		game.inHand.board = b;
		game.inHand.boardPos = pos;
		game.inHand.held = false;
		game.boards[b].pieces.push(game.inHand);
		game.inHand = undefined;
		game.lastPlaced = b;
		
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
				
					if (game.inHand != undefined) {
						game.placePiece(i,e);
					} else {
					
						if (game.lastPlaced == i) {
					
							var ps = l[i].slice();
							ps[0] += game.boards[game.lastPlaced].pieces[game.boards[game.lastPlaced].pieces.length-1].boardPos[0]*16;
							ps[1] += game.boards[game.lastPlaced].pieces[game.boards[game.lastPlaced].pieces.length-1].boardPos[1]*16;
						
							if (isWithin([e.offsetX,e.offsetY], ps, [game.boards[game.lastPlaced].pieces[game.boards[game.lastPlaced].pieces.length-1].layout[0].length*16,game.boards[game.lastPlaced].pieces[game.boards[game.lastPlaced].pieces.length-1].layout.length*16])) {
							
								game.grabPiece();
							
							}
						
						}
					}
				}
			
			}
		
		}
		
	}
}

export { game };