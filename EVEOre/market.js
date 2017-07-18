market = { data : {}};

market.getPrices = function() {

	$.get("http://api.eve-central.com/api/marketstat/json?regionlimit=10000002,10000032,10000042,10000043&typeid="+itemIDs.join(","), function(d) { market.makePrices(d); });

}

market.makePrices = function(data) {

	for (var i = 0; i < data.length; i++) {
		market.data[data[i].all.forQuery.types[0]] = { avg : data[i].buy.avg , max : data[i].buy.max };
	}

	market.fillTable();
	
}

market.fillTable = function() {

	for (id in market.data) {
		$("#table > .tableGroup > .tableEntry[typeID='"+id+"'] > .tableEntryPrice").html(((market.data[id].avg+market.data[id].max)/2).toLocaleString("en", {minimumFractionDigits:2, maximumFractionDigits:2}));
		$("#table > .tableGroup > .tableEntry[typeID='"+id+"'] > .tableEntryPerV").html((((market.data[id].avg+market.data[id].max)/2)/itemData[id].volume).toLocaleString("en", {minimumFractionDigits:2, maximumFractionDigits:2}));
		
		$(".tableGroupContainer > .tableEntry[typeID='"+id+"'] > .tableEntryPrice").each(function() {
			var price = ((market.data[id].avg+market.data[id].max)/2)/itemData[id].volume*parseInt($(this).parent().children(".tableEntryVolume").text().replace(/,/g,""));
			$(this).html(price.toLocaleString("en", {minimumFractionDigits:2, maximumFractionDigits:2}));
		});
	}
	
	$(".tableEntry[anomid]").each(function() {
	
		var tot = 0;
	
		$(this).siblings("[typeid]").each(function() {
			tot += parseFloat($(this).children(".tableEntryPrice").text().replace(/,/g,""))
		});
	
		$(this).children(".tableEntryPrice").text(tot.toLocaleString("en", {minimumFractionDigits:2, maximumFractionDigits:2}))
	
	});
	
	calcMiningSpeed();

}