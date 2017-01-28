moduLoad("ajax");
moduLoad("staticnodes");
moduLoad("parse");
moduLoad("ExportManifest");
moduLoad("languages");
moduLoad("DateC");

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
	var faction = $("<div>", { "class" : "alertFaction" }).css("background","url('./images/"+data.faction.toLowerCase()+".png')").appendTo(wrap);
	$("<div>", { "class" : "alertData" ,
		html : '<span class = "bold">'+data.planet+'</span> Level '+data.levelmin+'-'+data.levelmax+'<br><span class = "bold">'+data.mode+' - '+data.faction+'</span><br>Reward: <img class = "inlineImage" src = "./images/credits.png">'+data.reward
	}).appendTo(wrap);
	$("<div>", { "class" : "alertExpireTime" , "data-time" : data.expire }).appendTo(elem);
	
	elem.appendTo($("#alertContainer"));

	if (data.rss == false) {
		$("<span>", { "class" : "noRSSData" , html : "RSS Missing" }).appendTo(faction);
	}
	
	refreshTime();
	
}

addTraderEntry = function(data) {

	var elem = $("<div>", { "class" : "traderEntry" });
	$("<div>", { "class" : "traderImage"}).css("background","url('"+data.image+"')").appendTo(elem);
	$("<div>", { "class" : "traderCost" , html : '<img class = "inlineImage" src = "./images/ducats.png">'+data.ducats+' + <img class = "inlineImage" src = "./images/credits.png">'+data.credits}).appendTo(elem);

	elem.appendTo($("#voidContainer"));
	
}

tryProp = function(prop, obj) {

	if (obj.hasOwnProperty(prop)) {
		return obj[prop];
	} else {
		return false;
	}

}

refreshTime = function() {

	$(".alertExpireTime").each(function(i, e) {
	
		var t = $(e).attr("data-time");
		if (t == undefined) { return; }
		
		if (t ==  "Expired") { $(e).parent().fadeOut(5000,function() { $(this).remove(); }); return; }
		
		t = t.split(" ");

		$(e).html(t[0]+'h '+t[1]+'m '+t[2]+'s');
		
	});
	
	$(".voidTimer").each(function(i, e) {
	
		var t = $(e).attr("data-time");
		if (t == undefined) { return; }
		
		if (t == "Expired") { $(".voidTimer").css("display","inline");	$(e).css("display","none"); return; }
		
		t = t.split(" ");
		
		$(e).html(t[0]+'d '+t[1]+'h '+t[2]+'m '+t[3]+'s');

	});
}

incrementTime = function(inc) {

	$(".alertExpireTime").each(function(i, e) {
	
		var t = $(e).attr("data-time");
		if (t == undefined) { return; }
		
		if (t == "Expired") { $(e).parent().fadeOut(5000,function() { $(this).remove(); }); return; }
		
		t = t.split(" ");
		
		for (var i = 0; i < t.length; i++) {
			t[i] = parseInt(t[i]);
		}
		
		t[2] -= inc;
		
		for (var i = t.length-1; i > -1; i--) {
			if (t[i] < 0) {
				if (i-1 > 0) {
					t[i-1] -= 1;
					t[i] += 60;
				} else {
					$(e).html("Expired");
					$(e).parent().fadeOut(5000,function() { $(this).remove(); });
					return;
				}
			}
		}
		
		$(e).attr("data-time", t.join(" "));
		
		$(e).html(t[0]+'h '+t[1]+'m '+t[2]+'s');
	
	});
	
	$(".voidTimer").each(function(i, e) {
	
		var frames = [30,24,60,60];
		var t = $(e).attr("data-time");
		if (t == undefined) { return; }
		
		if (t == "Expired") { $(".voidTimer").css("display","inline");	$(e).css("display","none"); return; }
		
		t = t.split(" ");
		
		for (var i = 0; i < t.length; i++) {
			t[i] = parseInt(t[i]);
		}
		
		t[3] -= inc;
		
		for (var i = t.length-1; i > -1; i--) {
			if (t[i] < 0) {
				if (i-1 > 0) {
					t[i-1] -= 1;
					t[i] += frames[i];
				} else {
					$(".voidTimer").css("display","inline");
					$(e).css("display","none");
					return;
				}
			}
		}
		
		$(e).attr("data-time", t.join(" "));
		
		$(e).html(t[0]+'d '+t[1]+'h '+t[2]+'m '+t[3]+'s');
	
	});

}

/*incrementTime = function(inc) {


	$(".alertExpireTime").each(function(i, e) {
	
		var t = $(e).html();
		
		if (t ==  "Expired") { $(e).parent().fadeOut(5000,function() { $(this).remove(); }); return; }
		
		t = t.split(/[a-z] /);
		//t[2] = t[2].substring(0,t[2].length-1);
		
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
	
	$("#voidTimer").each(function(i, e) {
	
		var t = $(e).html();
		
		t = t.split(/[a-z] /);
		//t[3] = t[3].substring(0,t[3].length-1);
		
		for (var i = 0; i < t.length; i++) {
			t[i] = parseInt(t[i]);
		}
		
		t[3] -= inc;
		
		while (t[3] < 0) {
			t[2] -= 1;
			t[3] += 60;
		}
		
		while (t[2] < 0) {
			t[1] -= 1;
			t[2] += 60;
		}
		
		while (t[1] < 0) {
			t[0] -= 1;
			t[1] += 60;
		}
		
		if (t[0] < 0) {
			$(e).css("display","none");
			return;
		}
		
		var text = t[0]+'d '+t[1]+'h '+t[2]+'m '+t[3]+'s ';
		
		$(e).html(text);
	
	});

}*/