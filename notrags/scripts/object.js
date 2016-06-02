object = { };

object.set = function(objs) {
	
	$("#game_room_objects").html("");
	
	for (var i = 0; i < objs.length; i++) {
		object.addToRoom(objs[i]);
	}
	
}

object.addToRoom = function(obj) {
	
	var o = $("<div>", { class : "objects_entry", html : objects[obj].name }).appendTo("#game_room_objects");
	o.click(function() { object.createContextMenu(obj); });
	
}

object.removeFromRoom = function(obj) {
	
	for (var i = 0; i < rooms[room.current].objects; i++) {
		if (rooms[room.current].objects[i] == objects[obj].name) {
			rooms[room.current].objects.splice(i,1);
		}
	}
	
	object.set(rooms[room].objects);
	
}

object.createContextMenu = function(obj) {
	
	$("#game_graphics").html(objects[obj].description);
	
	
}