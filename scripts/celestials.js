celestials = function(kind) {
	
	celestials.list.push(this);
	this.mass = 1;
	this.size = 10;
	this.forces = [];
	this.pos = [50,50];
	this.vel = [0,0];
	
	switch (kind) {
		case "sun":
			this.mass = "1.989e30";
			this.pos = [325,250];
			this.size = 40;
			break;
			
		default:
			this.mass = "5.972e24";
	}
	
	this.createMesh();
}

celestials.prototype.createMesh = function( notasun = true ) {
	if (!notasun) {
		alert("It's a sun.");
		return;
	}
	
	var ra = this.size;
	this.vs = [];
	var vmax = ra*3;
	
	for (var i = 0; i < vmax; i++) {
	
		this.vs[i] = [];
		this.vs[i][0] = (((Math.PI*2)/vmax)*i)-((Math.PI*2)/vmax/6)+(Math.random()*((Math.PI*2)/vmax/3));
		this.vs[i][1] = (Math.random()*(ra/5))-(ra/10);
	
	}
}

celestials.list = [];