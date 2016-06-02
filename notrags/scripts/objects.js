objects = { };

objects.baseball_bat = {
	
	name : "Baseball Bat",
	description : "It's super bloody. Like, blood and gore. Everywhere. So gorey. Oh lord it's so gorey. Like brain matter gorey.",
	context : ["Examine","Pickup","Bludgeon_Billy"]
	
}

objects.baseball_bat.Bludgeon_Billy = function() {
	
	gametext.setText("Oh shit. You dun fucked up.");
	
}