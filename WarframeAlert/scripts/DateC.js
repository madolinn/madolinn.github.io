//1/24/2017

DateC = function(a, b) {

	this.expired = false;
	this.time = [];

	this.time[0] = ( a == "now" ) ? new Date().getTime()/1000 : a;
	this.time[1] = ( b == "now" ) ? new Date().getTime()/1000 : b;
	
	if (this.time[0] > this.time[1]) {
		this.expired = true;
	}

}

DateC.year = function() {
	return 31556926;
}

DateC.month = function() {
	return 2629743;
}

DateC.day = function() {
	return 86400;
}

DateC.hour = function() {
	return 3600;
}

DateC.minute = function() {
	return 60;
}

DateC.prototype.compare = function(format) {

	format = format || "h m s";

	//"d h m s"
	var timeList = [DateC.year(), DateC.month(), DateC.day(), DateC.hour(), DateC.minute(), 1];
	var fullFrame = ["y","n","d","h","m","s"];
	var ind = [0,0,0,0,0,0];
	
	var frame = format.split(" ");
	
	var string = "";
	
	if (this.time[0] <= this.time[1]) {
		var a = this.time[0];
		var b = this.time[1];
	} else {
		var a = this.time[1];
		var b = this.time[0];
	}
	
	for (var i = 0; i < timeList.length; i++) {
		while (a + timeList[i] < b) {
			a += timeList[i];
			ind[i] += 1;
		}
	}
	
	for (var i = 0; i < frame.length; i++) {
		for (var x = 0; x < fullFrame.length; x++) {
			if (fullFrame[x] == frame[i]) {
				string += ind[x]+fullFrame[x]+' ';
			}
		}
	}
	
	return string;
	
}