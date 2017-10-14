_cv = [];

moduLoad("physics")
//moduLoad("draw")
//moduLoad("celestials")

_g = { fps : 60 , cwidth : 0, cheight : 0 };

_cv.setupAll = function() {
	$("canvas").each(function(ind) {
		_cv[ind] = $(this)[0].getContext('2d');
	});
	return $("canvas").length;
}

moduLoad.ready = function() {
	
	_cv.setupAll();
	
	_g.cwidth = _cv[0].canvas.width;
	_g.cheight = _cv[0].canvas.height;
	
	map.create();
	creature.create();
	
	setInterval(function() { step(); },1000/_g.fps);//step();
	
}

step = function() {
	
	creature.step();
	drawScreen();
	
}


////////////////////////////////////////////////////////////////////////////////////////////////////

drawScreen = function() {

	_cv[0].clearRect(0,0,map.attr.size[0],map.attr.size[1]);
	
	_cv[0].beginPath()
	_cv[0].strokeStyle = "rgb(170,30,30)";
	_cv[0].lineWidth = "1";
	_cv[0].rect(0,0,map.attr.size[0],map.attr.size[1]);
	_cv[0].stroke();
	
	_cv[0].fillStyle = "rgb(170,30,30)";
	_cv[0].fillRect(200,150,100,100);
	
	_cv[1].clearRect(0,0,650,650);
	
	_cv[1].fillStyle = "rgb(30,30,90)";
	_cv[1].fillRect(map.attr.finish[0]-5,map.attr.finish[1]-5,10,10);
	
	_cv[1].fillStyle = "rgb(170,30,30)";
	_cv[1].drawImage(creature.image.canvas,creature.pos[0]-25,creature.pos[1]-25);
	
	_cv[1].beginPath();
	_cv[1].strokeStyle = "rgba(255,0,0)";
	_cv[1].moveTo(creature.pos[0],creature.pos[1]);
	_cv[1].lineTo(map.attr.finish[0],map.attr.finish[1]);
	_cv[1].stroke();

}

////////////////////////////////////////////////////////////////////////////////////////////////////

map = { attr : {} };
map.create = function() {

	map.attr.size = [500,300];
	map.attr.start = [50,150];
	map.attr.finish = [400,150];
	
	_g.xoffset = (_g.cwidth-map.attr.size[0])/2;
	_g.yoffset = (_g.cheight-map.attr.size[1])/2;

}

////////////////////////////////////////////////////////////////////////////////////////////////////

creature = { attr : {} , forces : [] };
creature.create = function() {

	creature.pos = [map.attr.start[0],map.attr.start[1]];
	
	creature.image = _cv[2];
	_cv[2].fillStyle = "rgb(170,30,30)";
	_cv[2].fillRect(14,14,22,22);
	creature.createCollisionData();
	creature.attr.mass = 484;
	
	creature.attr.laziness = .1;
	
	creature.attr.force = 2000;
	creature.attr.forceCD = 1;
	creature.attr.angleVariance = Math.PI/2;
	creature.cforceCD = 0;
	
	creature.vel = [0,0];
	creature.attr.friction = 0.15;
	
	creature.mutateRate = 600;
	
	creature.scores = [];
	creature.score = 0;
	creature.highscore = 0;
	
	creature.previousMutate = "";
	creature.previousMutateValue = 0;
	creature.previousMutateData = 0;
	
	console.log(creature.attr);
	
	creature.failSafe = setTimeout(function() { creature.mutate(); }, 1000*creature.mutateRate);

}

creature.step = function() {

	creature.score--;

	var cat = creature.attr;
	
	if (creature.cforceCD <= 0) {
	
		var dir = Math.atan2((map.attr.finish[1]-creature.pos[1]),(map.attr.finish[0]-creature.pos[0]));
		var fangle = dir-(cat.angleVariance/2)+(Math.random()*cat.angleVariance);
		
		creature.forces.push([cat.force,fangle]);
		creature.cforceCD = cat.forceCD;
		
	} else {
		creature.cforceCD -= 1/_g.fps;
	}
	
	creature.applyForces();
	creature.doFriction();
	
	var precision = Math.max(1,Math.min(3,Math.floor(creature.vel[0])));
	
	for (var i = 0; i < precision; i++) {
		var xtest = creature.pos[0] + (Math.cos(creature.vel[1])*creature.vel[0]/creature.attr.mass/precision);
		var ytest = creature.pos[1] + (Math.sin(creature.vel[1])*creature.vel[0]/creature.attr.mass/precision);
		
		var xpass = true;
		var ypass = true;
		
		var mapData = _cv[0].getImageData(Math.round(xtest)-25,Math.round(creature.pos[1])-25,50,50).data;
		for (var t = 0; t < creature.collisionData.length; t++) {
			if (mapData[creature.collisionData[t]] != 0) {
				xpass = false;
				break;
			}
		}
		
		if (xpass) {
			creature.pos[0] = xtest;
		}
		
		var mapData = _cv[0].getImageData(Math.round(creature.pos[0])-25,Math.round(ytest)-25,50,50).data;
		for (var t = 0; t < creature.collisionData.length; t++) {
			if (mapData[creature.collisionData[t]] != 0) {
				ypass = false;
				break;
			}
		}
		
		if (ypass) {
			creature.pos[1] = ytest;
		} else if (!xpass) {
			creature.vel = [0,0];
		}
		
	}
	creature.forces = [];
	
	creature.checkFinished();

}

creature.mutate = function(attr) {

	console.log("Mutating");
	
	var avgScore = 0;
	for (var i = 0; i < creature.scores.length; i++) {
		avgScore += creature.scores[i];
	}
	avgScore = avgScore/creature.scores.length;
	
	if (avgScore < creature.highscore*(1+creature.attr.laziness)) {
		if (creature.previousMutate != "") {
			if (Math.random() > creature.attr.laziness) {
				console.log("Bad Mutation, reverting.");
				creature.attr[creature.previousMutate] = creature.previousMutateValue;
				if (creature.previousMutate == "mass") {
					creature.image.clearRect(0,0,creature.image.canvas.width,creature.image.canvas.height);
					creature.image.putImageData(creature.previousMutateData,0,0);
					creature.createCollisionData()
				}
			} else {
				console.log("Lazy, didn't mutate.");
			}
		} else {
			creature.highscore = avgScore;
		}
	} else {
		creature.highscore = avgScore;
	}
	
	var r = Math.floor(Math.random()*Object.keys(creature.attr).length);
	var key = attr || Object.keys(creature.attr)[r];
	
	creature.previousMutate = key;
	creature.previousMutateValue = creature.attr[key];
	
	creature.attr[key] = creature.attr[key]*(1-((Math.random()-0.5)/5));
	
	if (creature.previousMutate == "mass") {
		creature.previousMutateData = creature.image.getImageData(0,0,creature.image.canvas.width,creature.image.canvas.height);
		
		creature.attr.mass = Math.floor(creature.attr.mass/2)*2;
		
		var growthPoints = creature.getGrowthPoints();
		var reductionPoints = creature.getReductionPoints();
		var newImage = creature.previousMutateData.data.slice();
		
		for (var i = 0; i < Math.abs(creature.attr.mass - creature.previousMutateValue); i+=2) {
		
			if (creature.attr.mass > creature.previousMutateValue) {
				console.log("growing");
				var r = Math.floor(Math.random()*growthPoints.length);
				var mirror = newImage.length-(((Math.floor(growthPoints[r]/(creature.image.canvas.width*4)))+1)*(creature.image.canvas.width*4))+(growthPoints[r]%(creature.image.canvas.width*4));
				
				newImage[growthPoints[r]] = newImage[mirror] = Math.floor(Math.random()*226)+30;
				newImage[growthPoints[r]+1] = newImage[mirror+1] = Math.floor(Math.random()*226)+30;
				newImage[growthPoints[r]+2] = newImage[mirror+2] = Math.floor(Math.random()*226)+30;
				newImage[growthPoints[r]+3] = newImage[mirror+3] = 255;
				
				growthPoints.splice(r,1);
			}
			
			if (creature.attr.mass < creature.previousMutateValue) {
				console.log("reducing");
				
				var r = Math.floor(Math.random()*reductionPoints.length);
				var mirror = newImage.length-(((Math.floor(reductionPoints[r]/(creature.image.canvas.width*4)))+1)*(creature.image.canvas.width*4))+(reductionPoints[r]%(creature.image.canvas.width*4));
				//d.data[d.data.length-(((Math.floor(i/200))+1)*200)+(i%200)] = d.data[i];
				
				newImage[reductionPoints[r]] = newImage[mirror] = 0;
				newImage[reductionPoints[r]+1] = newImage[mirror+1] = 0;
				newImage[reductionPoints[r]+2] = newImage[mirror+2] = 0;
				newImage[reductionPoints[r]+3] = newImage[mirror+3] = 0;
				
				reductionPoints.splice(r,1);
			}
		}
		
		creature.image.clearRect(0,0,creature.image.canvas.width,creature.image.canvas.height);
		creature.image.putImageData(new ImageData(newImage,creature.image.canvas.width,creature.image.canvas.height),0,0);
		creature.createCollisionData()
		
	}
	
	creature.pos = [map.attr.start[0], map.attr.start[1]];
	creature.score = 0;
	creature.scores = new Array();
	creature.vel = [0,0];
	
	console.log(creature.attr);

}

creature.createCollisionData = function() {

	var imageData = creature.image.getImageData(0,0,50,50);
	var collisionData = [];
	for (var i = 0; i < imageData.data.length; i+=4) {
	
		if (imageData.data[i] != 0) {
			collisionData.push(i);
		}
	
	}
	creature.collisionData = collisionData;

}

creature.applyForces = function() {

	creature.forces.push(creature.vel);
	creature.vel = physics.addvectors(creature.forces);

}

creature.doFriction = function() {

	creature.vel = physics.friction(creature.vel,creature.attr.friction);

}

creature.checkFinished = function() {

	var d = Math.sqrt((Math.pow(map.attr.finish[0]-creature.pos[0],2)+Math.pow(map.attr.finish[1]-creature.pos[1],2)));
	if (d < 8*(1+creature.attr.laziness)) {
		console.log("Score: " + creature.score + " | High: " + creature.highscore + " (" + (1+creature.attr.laziness)*creature.highscore + ")");
		clearTimeout(creature.failSafe);
		creature.failSafe = setTimeout(function() { creature.mutate(); }, 1000*creature.mutateRate);
		creature.pos = [map.attr.start[0],map.attr.start[1]];
		creature.scores.push(creature.score);
		creature.score = 0;
		if (creature.scores.length >= 5) {
			creature.mutate();
		}
	}
	
	var printout = "";
    for (var key in creature.attr) {
		printout += key + " : " + creature.attr[key].toFixed(2) + "<br>";
    }
    $(".floater").eq(0).html(printout);
	
	var printout = "Highscore : " + creature.highscore + "<br>";
	for (var i = 0; i < creature.scores.length; i++) {
		printout += "Score["+i+"] : " + creature.scores[i] + "<br>";
	}
	$(".floater").eq(1).html(printout);

}

creature.getGrowthPoints = function() {

	var cwidth = creature.image.canvas.width;
	var cheight = creature.image.canvas.height;
	
	var data = creature.image.getImageData(0,0,cwidth,cheight).data;
	var points = [];
	
	console.log(data.length);
	
	for (var i = 0; i < data.length/2; i+=4) {
	
		if (data[i] == 0) {
		
			if (i - 4 > 0) { // Left
				if (data[i-4] != 0) { points.push(i); continue; }
			}
			
			if (i + 4 < data.length) { // Right
				if (data[i+4] != 0) { points.push(i); continue; }
			}
			
			if (i - (cwidth*4) > 0) { // Up
				if (data[i-(cwidth*4)] != 0) { points.push(i); continue; }
			}
			
			if (i + (cwidth*4) < data.length) { // Down
				if (data[i+(cwidth*4)] != 0) { points.push(i); continue; }
			}
			
		}
		
	}
	
	return points;

}

creature.getReductionPoints = function() {

	var cwidth = creature.image.canvas.width;
	var cheight = creature.image.canvas.height;
	
	var data = creature.image.getImageData(0,0,cwidth,cheight).data;
	var points = [];
	
	for (var i = 0; i < data.length/2; i+=4) {
	
		if (data[i] != 0) {
			if (i - 4 > 0) { // Left
				if (data[i-4] == 0) { points.push(i); continue; }
			}
			
			if (i + 4 < data.length) { // Right
				if (data[i+4] == 0) { points.push(i); continue; }
			}
			
			if (i - (cwidth*4) > 0) { // Up
				if (data[i-(cwidth*4)] == 0) { points.push(i); continue; }
			}
			
			if (i + (cwidth*4) < data.length) { // Down
				if (data[i+(cwidth*4)] == 0) { points.push(i); continue; }
			}
			
		}
		
	}
	
	return points;

}

////////////////////////////////////////////////////////////////////////////////////////////////////