draw = {};

draw.planet = function(planet) {
	
	var ra = planet.size;
	var vs = planet.vs;
	var px = planet.pos[0];
	var py = planet.pos[1];
	
	var rr = 0;
	
	_cv[0].strokeStyle = "rgb(100,100,100)"
	_cv[0].lineWidth = 2;
	_cv[0].beginPath();
	_cv[0].arc(px,py,ra,0,2*Math.PI);
	_cv[0].stroke();
	
	
	_cv[0].strokeStyle = "rgb(255,255,255)"
	_cv[0].beginPath();
	_cv[0].moveTo(px+(Math.cos(vs[0][0]+rr)*(ra+(vs[0][1]))),py+(Math.sin(vs[0][0]+rr)*(ra+vs[0][1])));
	
	for (var i = 0; i < vs.length; i++) {
		_cv[0].lineTo(px+(Math.cos(vs[i][0]+rr)*(ra+(vs[i][1]))),py+(Math.sin(vs[i][0]+rr)*(ra+vs[i][1])));
	}
	_cv[0].lineTo(px+(Math.cos(vs[0][0]+rr)*(ra+(vs[0][1]))),py+(Math.sin(vs[0][0]+rr)*(ra+vs[0][1])));
	
	_cv[0].stroke();
}