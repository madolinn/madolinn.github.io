moduLoad("ajax");
moduLoad("staticnodes");
moduLoad("parse");
moduLoad("ExportManifest");
moduLoad("languages");

moduLoad.ready = function() {
	
	ajax.getAlerts();
	setInterval(function() { incrementTime(5); }, 5000);
	setInterval(function() { ajax.getAlerts() }, 1000*60*5);
	
}


addEntry = function(data, kind) {

	if ($("*[data-seed='"+data.seed+"']").length != 0) { return; }

	var elem = $("<div>", { "class" : "alertEntry" , "data-seed" : data.seed });
	var wrap = $("<div>", { "class" : "alertDataWrapper" }).appendTo(elem);
	var blue = $("<div>", { "class" : "alertImageBlueprint" }).css("background",data.blueprint).appendTo(wrap);
	$("<div>", { "class" : "alertImage" }).css("background","url('"+data.image+"')").appendTo(blue);
	$("<div>", { "class" : "alertFaction" }).css("background","url('"+data.faction.toLowerCase()+".png')").appendTo(wrap);
	$("<div>", { "class" : "alertData" ,
		html : '<span class = "bold">'+data.planet+'</span> Level '+data.levelmin+'-'+data.levelmax+'<br><span class = "bold">'+data.mode+' - '+data.faction+'</span><br>Reward: <img class = "inlineImage" src = "credits.png">'+data.reward
	}).appendTo(wrap);
	$("<div>", { "class" : "alertExpireTime" , html : data.expire }).appendTo(elem);
	
	if (kind == "alert") {
		elem.appendTo($("#alertContainer"));
	}

}

tryProp = function(prop, obj) {

	if (obj.hasOwnProperty(prop)) {
		return obj[prop];
	} else {
		return false;
	}

}

incrementTime = function(inc) {


	$(".alertExpireTime").each(function(i, e) {
	
		var t = $(e).html();
		
		if (t ==  "Expired") { $(e).parent().fadeOut(5000,function() { $(this).remove(); }); return; }
		
		t = t.split(/[a-z] /);
		t[2] = t[2].substring(0,t[2].length-1);
		
		for (var i = 0; i < t.length; i++) {
			t[i] = parseInt(t[i]);
		}
		
		t[2] -= inc;
		
		while (t[2] < 0) {
			t[1] -= 1;
			t[2] += 60;
		}
		
		while (t[1] < 0) {
			t[0] -= 1;
			t[1] += 60;
		}
		
		if (t[0] < 0) {
			$(e).html("Expired");
			$(e).parent().fadeOut(5000,function() { $(this).remove(); });
			return;
		}
		
		var text = t[0]+'h '+t[1]+'m '+t[2]+'s';
		
		$(e).html(text);
		
	});

}