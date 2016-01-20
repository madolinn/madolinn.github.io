room = { };

room.load = function(room) {
	
	gametext.setText(rooms[room].text);
	object.set(rooms[room].objects);
	character.set(rooms[room].characters);
	
}