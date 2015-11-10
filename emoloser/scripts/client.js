timer = 800;

moduLoad.ready = function() {
	
	letsaGo();
	
}

letsaGo = function() {
	
	poop();
	
}

poop = function() {
	var a = $("<img>", { src : "12227624_10208186704362814_1329790137226094113_n.jpg" }).appendTo("body");
	a.css("position","absolute");
	a.css("top",Math.floor(Math.random()*1000));
	a.css("left",Math.floor(Math.random()*1000));
	setTimeout(function() {
		poop();
	}, Math.max(50,timer));
	timer-=50;
}