room = { };

room.load = function(rm) {
	
	if (rooms.hasOwnProperty(rm)) {
	
		room.current = rm;
		
		if (rooms[rm].hasOwnProperty("text")) { gametext.setText(rooms[rm].text); } else { console.log("Text for ["+rm+"] does not exist."); }
		if (rooms[rm].hasOwnProperty("objects")) { object.set(rooms[rm].objects); } else { console.log("Objects for ["+rm+"] does not exist."); }
		if (rooms[rm].hasOwnProperty("characters")) { character.set(rooms[rm].characters); } else { console.log("Characters for ["+rm+"] does not exist."); }
		if (rooms[rm].hasOwnProperty("directions")) { navigation.set(rooms[rm].directions); } else { console.log("Navigation for ["+rm+"] does not exist."); }
		
	} else {
		console.log("Roomm ["+rm+"] does not exist.");
	}
}