navigation = { };

navigation.bindCompass = function() {
	
	$("#compass_n").click(function() { });
	$("#compass_s").click(function() { });
	$("#compass_e").click(function() { });
	$("#compass_w").click(function() { });
	$("#compass_u").click(function() { });
	$("#compass_d").click(function() { });
	
}

navigation.set = function(dirs) {
	
	if (dirs.hasOwnProperty("n")) {
		$("#compass_n").css("opacity","1");
		$("#compass_n").click(function() { navigation.move(dirs.n); });
	} else {
		$("#compass_n").css("opacity","0.1");
	}
	
	if (dirs.hasOwnProperty("s")) {
		$("#compass_s").css("opacity","1");
		$("#compass_s").click(function() { navigation.move(dirs.s); });
	} else {
		$("#compass_s").css("opacity","0.1");
	}
	
	if (dirs.hasOwnProperty("e")) {
		$("#compass_e").css("opacity","1");
		$("#compass_e").click(function() { navigation.move(dirs.e); });
	} else {
		$("#compass_e").css("opacity","0.1");
	}
	
	if (dirs.hasOwnProperty("w")) {
		$("#compass_w").css("opacity","1");
		$("#compass_w").click(function() { navigation.move(dirs.w); });
	} else {
		$("#compass_w").css("opacity","0.1");
	}
	
	if (dirs.hasOwnProperty("u")) {
		$("#compass_u").css("opacity","1");
		$("#compass_u").click(function() { navigation.move(dirs.u); });
	} else {
		$("#compass_u").css("opacity","0.1");
	}
	
	if (dirs.hasOwnProperty("d")) {
		$("#compass_d").css("opacity","1");
		$("#compass_d").click(function() { navigation.move(dirs.d); });
	} else {
		$("#compass_d").css("opacity","0.1");
	}
	
}

navigation.move = function(rm) {
	
	room.load(rm);
	
}