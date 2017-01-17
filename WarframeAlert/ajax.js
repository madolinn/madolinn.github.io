ajax = {};

ajax.getAlerts = function() {

	$("body").load("http://content.warframe.com/dynamic/worldState.php", function(data) {
		//ajax.parseData(data);
		console.log(data);
	});

}

ajax.parseData = function(data) {

	console.log(data);

}