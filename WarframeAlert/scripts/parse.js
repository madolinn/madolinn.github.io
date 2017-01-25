parse = {};

parse.parseVoidTrader = function(data) {

	var arrival = parse.parseExpire(data.Activation.sec, true);
	var depart = parse.parseExpire(data.Expiry.sec, true);
	if (arrival == "Expired") {
		$("#voidTimer.voidArrive").css("display","none");
	}
	
	$("#voidTimer.voidArrive").html(arrival);
	$("#voidTimer.voidDepart").html(depart);

}

parse.parseAlert = function(data, rssData) {

	if (!rssData) { return; }
	console.log(data, rssData);

	var entry = {};
	
	entry.planet = tryProp('location', data.MissionInfo) || 'TestNode215';
	entry.levelmin = tryProp('minEnemyLevel', data.MissionInfo) || '-1';
	entry.levelmax = tryProp('maxEnemyLevel', data.MissionInfo) || '99';
	entry.mode = tryProp('missionType', data.MissionInfo) || 'TestMode';
	entry.faction = tryProp('faction', data.MissionInfo) || 'TestFaction';
	entry.reward = tryProp('missionReward', data.MissionInfo) || 'TestReward';
	entry.expire = tryProp('sec', data.Expiry) || 'Test';
	entry.seed = tryProp('seed', data.MissionInfo) || 'TestSeed';
	
	entry.planet = parse.parsePlanet(entry.planet);
	entry.mode = parse.parseMode(entry.mode);
	entry.faction = parse.parseFaction(entry.faction);
	entry.expire = parse.parseExpire(entry.expire);
	
	var reward = parse.parseReward(entry.reward, rssData);
	entry.reward = reward[0];
	entry.image = reward[1];
	entry.blueprint = reward[2];
	
	addEntry(entry, 'alert');

}

parse.parsePlanet = function(planet) {

	planet = tryProp(planet, staticnodes);
	var planetText = planet[1] + ' ('+planet[0]+')';

	return planetText;

}

parse.parseMode = function(mode) {

	if (mode.substr(0,3) == "MT_") {
		mode = mode.substr(3);
	}
	mode = mode.replace(/_/g," ");
	if (mode == "RETRIEVAL") { mode = "HIJACK"; }
	if (mode == "TERRITORY") { mode = "INTERCEPTION"; }
	if (mode == "INTEL") { mode = "SPY"; }
	
	return mode;

}

parse.parseFaction = function(faction) {

	if (faction.substr(0,3) == "FC_") {
		faction = faction.substr(3);
	}
	
	return faction;

}

parse.parseReward = function(reward, rssData) {

	var image = "./images/missingBig.png";
	var blueprint = "./images/none.png";
	var fullItem = "";
	var item = "";
	var itemCount = 1;
	var rewardText = parseInt(reward.credits).toLocaleString();
	
	if (reward.hasOwnProperty('countedItems')) {
		fullItem = reward.countedItems.ItemType;
		itemCount = reward.countedItems.ItemCount;
	}
	else if (reward.hasOwnProperty('items')) {
		fullItem = reward.items;
	}
	
	var type = fullItem.match(/.*\/(.*)\//);
	type = ( type != null ) ? type[type.length-1] : false;
	
	var i = fullItem.lastIndexOf("/");
	item = fullItem.substr(i+1);
	
	if (item.includes("Blueprint")) {
		item = item.replace("Blueprint","");
		item = item.replace("StatlessV2","");
		item = item.replace("Statless","");
		blueprint = "url('./images/blueprint.png')";
	}
	
	if (type == "WarframeRecipes") {
		item = item+"Component";
	}
	
	if (ExportManifest.hasOwnProperty(item)) {
		
		image = "http://content.warframe.com/MobileExport"+ExportManifest[item].textureLocation;
	}
	
	if (parse.items.hasOwnProperty(item)) {
		rewardText += ' + ' + parse.items[item].text.replace(/\%c/g,itemCount);
	} else {
		var rssText = rssData.title;
		rssText = rssText.split(" - ");
		if (rssText[rssText.length-1].search(/\d+?cr/) == -1) {
			var formattedText = rssText[rssText.length-1];
			if (formattedText.search(/\d+?x /) > -1) {
				formattedText = formattedText.replace(/\d+?x /,"");
				formattedText += " ("+itemCount+")";
			}
			formattedText = formattedText.replace(/\(Blueprint\)/,"Blueprint");
			formattedText = formattedText.replace(/\(Resource\)/,"");
			rewardText += ' + ' +formattedText.toUpperCase();
		}
	}
	
	if (!rewardText.includes(' + ')) {
		image = "./images/creditsBig.png";
	}
	
	return [rewardText, image, blueprint];
	
}


parse.findRealName = function(name) {

	realName = name;
	
	//if (tryProp

	return realName;

}

parse.parseExpire = function(expire, days = false) {

	var ex = new Date(expire*1000);
	var ti = new Date();
	
	if (ti > ex) { return "Expired"; }
	
	var dif = new Date(ex-ti);
	
	if (!days) {
		var expireText = Math.max(dif.getHours()-19,0)+'h '+dif.getMinutes()+'m '+dif.getSeconds()+'s';
	} else {
		var expireText = Math.max(dif.getDay()-4,0)+'d '+Math.max(dif.getHours()-19,0)+'h '+dif.getMinutes()+'m '+dif.getSeconds()+'s';
	}

	return expireText;

}

parse.items = {};
parse.items["Alertium"] = { text : "NITAIN EXTRACT" };
parse.items["VoidTearDrop"] = { text : "VOID TRACES (%c)" };
parse.items["ArgonCrystal"] = { text : "ARGON CRYSTAL (%c)" };
parse.items["AlloyPlate"] = { text : "ALLOY PLATE (%c)" };
parse.items["Neurode"] = { text : "NEURODE (%c)" };
parse.items["AlertFusionBundleLarge"] = { text : '<img class = "inlineImage" src = "./images/endo.png">150' };
parse.items["AlertFusionBundleMedium"] = { text : '<img class = "inlineImage" src = "./images/endo.png">100' };
parse.items["AlertFusionBundleSmall"] = { text : '<img class = "inlineImage" src = "./images/endo.png">80' };

parse.nameCorrections = {};
parse.nameCorrections["Trapper"] = "VAUBAN";
parse.nameCorrections["Statless "] = "";