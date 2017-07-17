_g = { groups : 2 };

moduLoad("itemIDs");
moduLoad("market");
moduLoad("anoms");


moduLoad.ready = function() {

	createTableEntries();
	createAnomEntries();
	calcMiningSpeed();
	dimRows();
	market.getPrices();
	bindElements();
	
	$(".tableEntryHider").parent().next().toggle();
	
}

bindElements = function() {

	$("#miningSpeed").change(function() { calcMiningSpeed() });
	
	$(".tableEntryHider").click(function() {
	
		$(this).parent().next().toggle();
		if ($(this).parent().next().is(":visible")) {
			$(this).parent().parent().prependTo("#tableAnoms");
		} else {
			$(this).parent().parent().appendTo("#tableAnoms");
		}
	
	});

}

createTableEntries = function() {

	for (var i = 0; i < _g.groups; i++) {
		$("<div>", { "class" : "tableGroup" }).appendTo("#table");
	}
	
	for (var i = 0; i < itemIDs.length; i++) {
		
		if (i%(itemIDs.length/_g.groups) == 0) {
			var entry = $("<div>", { "class" : "tableEntry tableHeader" });
			$("<div>", { "class" : "tableEntryName" , "html" : "Name" }).appendTo(entry);
			$("<div>", { "class" : "tableEntryVolume" , "html" : "Volume" }).appendTo(entry);
			$("<div>", { "class" : "tableEntryPrice" , "html" : "Price" }).appendTo(entry);
			$("<div>", { "class" : "tableEntryPerV" , "html" : "/M<sup>3</sup>" }).appendTo(entry);
			entry.appendTo($("#table > .tableGroup").eq(Math.floor(i/(itemIDs.length/_g.groups))));
		}
		
		var entry = $("<div>", { "class" : "tableEntry" , "typeID" : itemIDs[i] });
		$("<div>", { "class" : "tableEntryName" , "html" : itemData[itemIDs[i]].name }).appendTo(entry);
		$("<div>", { "class" : "tableEntryVolume" , "html" : itemData[itemIDs[i]].volume }).appendTo(entry);
		$("<div>", { "class" : "tableEntryPrice" , "html" : "&nbsp;" }).appendTo(entry);
		$("<div>", { "class" : "tableEntryPerV" , "html" : "&nbsp;" }).appendTo(entry);
		entry.appendTo($("#table > .tableGroup").eq(Math.floor(i/(itemIDs.length/_g.groups))));
		
	}
}

createAnomEntries = function() {
	
	for (var i = 0; i < anoms.length; i++) {
		$("<div>", { "class" : "tableGroup" }).appendTo("#tableAnoms");
		var name = $("<div>", { "class" : "tableAnomName" , "html" : anoms[i].siteName }).appendTo($("#tableAnoms > .tableGroup").eq(i));
		$("<span>", { "class" : "tableEntryHider" , "html" : "Hide" }).appendTo(name);
		var container = $("<div>", { "class" : "tableGroupContainer" });
		var entry = $("<div>", { "class" : "tableEntry tableHeader" });
		$("<div>", { "class" : "tableEntryName" , "html" : "Name" }).appendTo(entry);
		$("<div>", { "class" : "tableEntryVolume" , "html" : "Volume" }).appendTo(entry);
		$("<div>", { "class" : "tableEntryPrice" , "html" : "Price" }).appendTo(entry);
		$("<div>", { "class" : "tableEntryTime" , "html" : "Time to Harvest" }).appendTo(entry);
		entry.appendTo(container);
		
		for (var r = 0; r < anoms[i].ores.length; r++) {
			var entry = $("<div>", { "class" : "tableEntry" , "typeID" : itemIDs[r] });
			$("<div>", { "class" : "tableEntryName" , "html" : itemData[itemIDs[r]].name }).appendTo(entry);
			$("<div>", { "class" : "tableEntryVolume" , "html" : anoms[i].ores[r].toLocaleString("en", {minimumFractionDigits:0, maximumFractionDigits:0}) }).appendTo(entry);
			$("<div>", { "class" : "tableEntryPrice" , "html" : "&nbsp;" }).appendTo(entry);
			$("<div>", { "class" : "tableEntryTime" , "html" : "&nbsp;" }).appendTo(entry);
			entry.appendTo(container);
		}
		
		container.appendTo($("#tableAnoms > .tableGroup").eq(i));
	
	}

}

calcMiningSpeed = function() {

	$(".tableEntryTime").each(function() {
	
		if ($(this).text() == "Time to Harvest") { return; }
	
		var vol = parseInt($(this).parent().children(".tableEntryVolume").text().replace(/,/g,""));
		var speed = parseFloat($("#miningSpeed").val());
		
		$(this).text(((vol/speed/60).toLocaleString("en", {minimumFractionDigits:2, maximumFractionDigits:2}))+" mins");
	
	});

}

dimRows = function() {

	$(".tableEntryVolume").each(function() {
	
		if ($(this).text() == "0") {
			$(this).parent().children().css("color","#333");
		}
	
	});

}