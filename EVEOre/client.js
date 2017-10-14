_g = { groups : 2 , editting : "" };

moduLoad("itemIDs");
moduLoad("market");
moduLoad("anoms");


moduLoad.ready = function() {

	createTableEntries();
	createAnomEntries();
	dimRows();
	market.getPrices();
	bindElements();
	
	//$("#toolbarContainer").toggle();
	$(".tableEntryHider").parent().next().toggle();
	calcLockTime();
	
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
	
	$("#editDefault").click(function() {
	
		var totals = $(_g.editting).parent().siblings().last().children(".tableEntryVolume");
		totals.text((parseInt(totals.text().replace(/,/g,""))-parseInt($(_g.editting).text().replace(/,/g,""))+parseInt($(_g.editting).attr("default").replace(/,/g,""))).toLocaleString("en", {minimumFractionDigits:0, maximumFractionDigits:0}));
		
		$(_g.editting).text($(_g.editting).attr("default"));
		$("#editBox").hide();
		market.fillTable();
	
	});
	
	$("#editSave").click(function() {
	
		if (isNaN(parseInt($("#editInput").val()))) { $("#editBox").hide(); return; }
	
		var totals = $(_g.editting).parent().siblings().last().children(".tableEntryVolume");
		totals.text((parseInt(totals.text().replace(/,/g,""))-parseInt($(_g.editting).text().replace(/,/g,""))+parseInt($("#editInput").val())).toLocaleString("en", {minimumFractionDigits:0, maximumFractionDigits:0}));
	
		$(_g.editting).text(parseInt($("#editInput").val()).toLocaleString("en", {minimumFractionDigits:0, maximumFractionDigits:0}));
		$("#editBox").hide();
		market.fillTable();
	
	});

	$(".tableGroupContainer > .tableEntry[typeid] > .tableEntryVolume").click(function() {
		_g.editting = this;
		$("#editInput").val($(this).attr("default"));
		$("#editBox").show();
		$("#editInput").focus();
	});
	
	$("#editBox").click(function(e) {
		if (e.target.id == "editBox") {
			$(this).hide();
		}
	});
	
	$("#toolbarExpander").click(function() {
	
		$("#toolbarContainer").toggle();
	
	});
	
	$("#toolbarRes").change(function() { calcLockTime(); });
	$("#toolbarSig").change(function() { calcLockTime(); });
}

calcLockTime = function() {

	var res = parseInt($("#toolbarRes").val());
	var sig = parseInt($("#toolbarSig").val());
	
	if (isNaN(res)) { return; }
	if (isNaN(sig)) { return; }
	
	$("#toolbarLockTime").html((((40000/res)/(Math.pow(Math.asinh(sig),2)))*(1-5*0.05)).toLocaleString("en", {minimumFractionDigits:2, maximumFractionDigits:2})+"s");

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
			$("<div>", { "class" : "tableEntryPerM" , "html" : "Isk/Min" }).appendTo(entry);
			entry.appendTo($("#table > .tableGroup").eq(Math.floor(i/(itemIDs.length/_g.groups))));
		}
		
		var entry = $("<div>", { "class" : "tableEntry" , "typeID" : itemIDs[i] });
		$("<div>", { "class" : "tableEntryName" , "html" : itemData[itemIDs[i]].name }).appendTo(entry);
		$("<div>", { "class" : "tableEntryVolume" , "html" : itemData[itemIDs[i]].volume }).appendTo(entry);
		$("<div>", { "class" : "tableEntryPrice" , "html" : "&nbsp;" }).appendTo(entry);
		$("<div>", { "class" : "tableEntryPerV" , "html" : "&nbsp;" }).appendTo(entry);
		$("<div>", { "class" : "tableEntryPerM" , "html" : "&nbsp;" }).appendTo(entry);
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
		
		var totalVolume = 0;
		
		for (var r = 0; r < anoms[i].ores.length; r++) {
			var entry = $("<div>", { "class" : "tableEntry" , "typeID" : itemIDs[r] });
			$("<div>", { "class" : "tableEntryName" , "html" : itemData[itemIDs[r]].name }).appendTo(entry);
			$("<div>", { "class" : "tableEntryVolume" , "default" : anoms[i].ores[r].toLocaleString("en", {minimumFractionDigits:0, maximumFractionDigits:0}) , "html" : anoms[i].ores[r].toLocaleString("en", {minimumFractionDigits:0, maximumFractionDigits:0}) }).appendTo(entry);
			$("<div>", { "class" : "tableEntryPrice" , "html" : "&nbsp;" }).appendTo(entry);
			$("<div>", { "class" : "tableEntryTime" , "html" : "&nbsp;" }).appendTo(entry);
			entry.appendTo(container);
			
			totalVolume += anoms[i].ores[r];
		}
		
		//Totals row
		var entry = $("<div>", { "class" : "tableEntry" , "anomID" : i });
		$("<div>", { "class" : "tableEntryName" , "html" : "Totals" }).appendTo(entry);
		$("<div>", { "class" : "tableEntryVolume" , "html" : totalVolume.toLocaleString("en", {minimumFractionDigits:0, maximumFractionDigits:0}) }).appendTo(entry);
		$("<div>", { "class" : "tableEntryPrice" , "html" : "&nbsp;" }).appendTo(entry);
		$("<div>", { "class" : "tableEntryTime" , "html" : "&nbsp;" }).appendTo(entry);
		entry.appendTo(container);
		
		container.appendTo($("#tableAnoms > .tableGroup").eq(i));
	
	}

}

calcMiningSpeed = function() {

	var speed = parseFloat($("#miningSpeed").val());
	
	if (isNaN(speed)) { return; }

	$(".tableEntryPerM").each(function() {
	
		if ($(this).text() == "Isk/Min") { return; }
	
		var m = parseFloat($(this).parent().children(".tableEntryPerV").text().replace(/,/g,""));
		$(this).text((m*speed*60).toLocaleString("en", {minimumFractionDigits:2, maximumFractionDigits:2}));
	
	});
	
	$(".tableEntryTime").each(function() {
	
		if ($(this).text() == "Time to Harvest") { return; }
	
		var vol = parseInt($(this).parent().children(".tableEntryVolume").text().replace(/,/g,""));
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