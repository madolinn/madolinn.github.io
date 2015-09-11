celestials = function(kind) {
	
	celestials.list.push(this);
	this.mass = 1;
	this.size = 3;
	this.forces = [];
	this.pos = [50,50];
	this.vel = [1,1];
	this.name = kind || "Earth";
	
	switch (kind) {
		case "sun":
			this.mass = 1.989e30;
			this.pos = [325,250];
			this.size = 20;
			break;
		case "jup":
			this.mass = 5.972e25;
			this.vel = [-2e43,0];
			this.pos = [325,350];
			this.size = 5;
			break;
		case "mar":
			this.mass = 7.222e26;
			this.vel = [3e44,0];
			this.pos = [325,175];
			this.size = 7;
			break;
		default:
			this.mass = 5.972e24;
			this.vel = [1.5e42,0];
			this.pos = [300,100];
	}
	
	this.createMesh();
}

celestials.prototype.createMesh = function(notasun) {
	notasun = notasun || true;
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