moduLoad("xparray");

moduLoad.ready = function() {
	
	addField(2);
	bindMerge();
	
}

bindMerge = function() {

	$("#monstersMerged").click(function() {
	
		var level = $("#mergedClass").html();
		var splittext;
		var clas = "";
		if ((splittext = level.search(" ")) != -1) {
			clas = level.substr(splittext+1);
			level = parseInt(level.substring(0,splittext)) || 0;
		} else {
			level = parseInt(level) || 0;
		}
	
		$(".monEntry").remove();
		addField(2);
		$("#monster_0 > .monInputLevel").val(level);
		$("#monster_0 > .monInputClass").val(clas);
		$(".monInputLevel").trigger("keyup");
	
	});

}

addField = function(amount = 1) {

	var last_id = $("[id^=monster]").last().attr("id") || "-1";
	last_id = parseInt(last_id.substr(8))+1 || "0";

	for (var i = 0; i < amount; i++) {
		$("<div>", { "class" : "monEntry" , "id" : "monster_"+last_id , "html" : "<input class = 'monInputLevel' placeholder = 'Level'></input> <input class = 'monInputClass' placeholder = 'Class'></input> <span class = 'enext'></span> - <span class = 'xp'></span>" }).appendTo($("#monsterEntries"));
		last_id++;
	}

	bindFields(true)
	
}

bindFields = function(remove = false) {
	
	if (remove) {
		$(".monInputLevel").unbind();
		$(".monInputClass").unbind();
	}

	$(".monInputLevel").bind("keyup", function() { monInputChange($(this)); });
	$(".monInputClass").bind("keyup", function() { monInputChange($(this)); });
	
}

monInputChange = function(self) {

	var level = self.parent().find(".monInputLevel").val().split("/");
	var clas = self.parent().find(".monInputClass").val();
	var calculated_XP = calculateXP(level,clas);
	self.parent().find(".enext").html(calculateEnext(level));
	self.parent().find(".xp").html(calculated_XP);
	calculateFinals();

}

calculateFinals = function() {

	var totalxp = 0;
	var totallvl = 0;
	$(".monEntry > span.xp").each(function() { var x = parseInt($(this).text() || 0); totalxp += x; });
	$(".monEntry > .monInputLevel").each(function() { var l = parseInt($(this).val() || 0); totallvl += l; });
	var convtotal = parseInt(totalxp);
	
	var highclass = -1;
	var clas = "";
	$(".monEntry > .monInputLevel").each(function() { if (parseInt($(this).val()) > highclass) { highclass = $(this).val(); clas = $(this).parent().find(".monInputClass").val() }});
	var classmod = calculateClassMod(clas);
	
	var convmerged = Math.floor(6+parseInt(xparray.level[totallvl-1])*0.02*5*classmod) || 0;
	
	$("#monstersMerged > span.xp").html(convmerged.toLocaleString());
	$("#monstersTotal > span.xp").html(convtotal.toLocaleString());
	$("#mergedClass").html(totallvl + " " + clas);
	
	if (convtotal != convmerged) {
		if (convtotal > convmerged) {
			$("#monstersTotal").css("background","rgba(146, 219, 138, .25)");
			$("#monstersMerged").css("background","none");
		} else {
			$("#monstersMerged").css("background","rgba(146, 219, 138, .25)");
			$("#monstersTotal").css("background","none");
		}
	}

}

calculateEnext = function(contents) {
	
	var level = parseInt(contents[0]) || 0;
	var basexp = xparray.level[parseInt(level-1)]*5;
	
	return Math.floor(basexp) || 0;
	
}

calculateClassMod = function(clas) {

	var mod = 10;

	if (xparray.clas.hasOwnProperty(clas.toLowerCase())) {
		mod = xparray.clas[clas];
	}
	
	return mod;

}

calculateXP = function(contents, clas) {

	var level = parseInt(contents[0]) || 0;
	var mods = contents[1] || false;
	var classmod = calculateClassMod(clas);
	var basexp = xparray.level[parseInt(level-1)]*5*0.02*classmod;
	var xp = basexp;
	
	if (mods) {
		switch(mods) {
			case "b":
			case "g":
				xp*=1.5;
				break;
			case "c":
				xp*=.25;
			case "k":
				xp*=2;
				break;
			case "god":
				xp*=2.5;
				break;
			case "god2":
				xp*=3;
				break;
		}
	}
	
	return Math.floor(xp+6) || 0;
}