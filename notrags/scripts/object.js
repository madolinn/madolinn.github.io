object = { };

object.set = function(objs) {
	
	for (var i = 0; i < objs.length; i++) {
		
		object.makeEntry(objs[i]);
		
	}
	
}

object.makeEntry = function(obj) {
	
	var o = $("<div>", { class : "objects_entry", html : objects[obj].name }).appendTo("#game_room_objects");
	o.click(function() { object.createContextMenu(obj); });
	
}

object.createContextMenu = function(obj) {
	
	$("#game_graphics").html(objects[obj].description);
	
	
}