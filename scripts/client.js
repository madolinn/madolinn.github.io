_cv = [];

moduLoad("physics")
moduLoad("draw")
moduLoad("celestials")

_g = { players: [] , worldScale: 60e15 };

_cv.setupAll = function() {
	$("canvas").each(function(ind) {
		_cv[ind] = $(this)[0].getContext('2d');
	});
	return $("canvas").length;
}

moduLoad.ready = function() {
	
	_cv.setupAll();
	new celestials("sun");
	_g.players[0] = new celestials();
	new celestials("jup");
	
	$("canvas").click(function(e) {
		var o = $(this).offset();
		_g.players[0].pos[0] = e.pageX - o.left;
		_g.players[0].pos[1] = e.pageY - o.top;
	});
	
	setInterval(function() { step(); },1000/30);//step();
	
}

step = function() {
	
	_cv[0].fillStyle = "rgb(0,0,0)";
	_cv[0].fillRect(0,0,650,650);
	
	var l = celestials.list;
	
	for (var i = 0; i < l.length; i++) {
		for (var x = 0; x < l.length; x++) {
			if (i != x) {
				l[i].forces.push(physics.gravity(l[i], l[x]));
			}
		}
	}
	
	for (var i = 0; i < l.length; i++) {
		l[i].forces.push(l[i].vel);
		l[i].vel = physics.addvectors(l[i].forces);
		console.log(i + " : " +(l[i].vel[0]/l[i].mass/_g.worldScale));
	}
	
	for (var i = 0; i < l.length; i++) {
		l[i].pos[0] += Math.cos(l[i].vel[1])*l[i].vel[0]/l[i].mass/_g.worldScale;
		l[i].pos[1] += Math.sin(l[i].vel[1])*l[i].vel[0]/l[i].mass/_g.worldScale;
	}	
	
	for (var i = 0; i < l.length; i++) {
		draw.planet(l[i]);
		l[i].forces = [];
	}
	
}