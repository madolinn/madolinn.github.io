physics = { G : "6.674e-11", fScale : 0 };

physics.gravity = function(ba, bb) {
	
	//F = G x Mass1 x Mass2 / D^2
	
	var d = (Math.pow(bb.pos[0]-ba.pos[0],2)+Math.pow(bb.pos[1]-ba.pos[1],2));//*_g.worldScale;
	var f = physics.G * ba.mass * bb.mass / d;
	
	var dir = Math.atan2((bb.pos[1]-ba.pos[1]),(bb.pos[0]-ba.pos[0]));
	
	if (f > 2e40) { f = 2e40; }
	
	var vec = [f,dir];
	
	return vec;
	
}

physics.toint = function(s) {
	
	var i = parseFloat(s);
	
	/*var ind = s.indexOf(" x 10^");
	if (ind == -1) { console.log("phsyics.toint : ["+s+"] is not scientifically formatted."); return -1; }
	var ex = s.substr(ind+6);
	i = i * Math.pow(10,ex);*/
	//Writing as [NUM-e-POW] works just fine.
	
	return i;
}