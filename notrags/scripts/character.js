character = { };

character.set = function(chrs) {
	
	for (var i = 0; i < chrs.length; i++) {
		
		character.makeEntry(chrs[i]);
		
	}
	
}

character.makeEntry = function(chr) {
	
	if (characters.hasOwnProperty(chr)) {
	
		var o = $("<div>", { class : "characters_entry", html : characters[chr].name }).appendTo("#game_room_characters");
		o.click(function() { character.createContextMenu(chr); });
	
	} else {
		console.log("Character ["+chr+"] is missing an entry.");
	}
	
}

character.createContextMenu = function(chr) {
	
	$("#game_graphics").html(characters[chr].description);
	
	
}