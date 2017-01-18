parse = {};

parse.parseAlert = function(data) {

	var entry = {};
	
	console.log(data);
	
	entry.image = 'none';
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
	
	var reward = parse.parseReward(entry.reward);
	entry.reward = reward[0];
	if (reward[1]) {
		entry.image = reward[1];
	}
	
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

parse.parseReward = function(reward) {

	var rewardText = parseInt(reward.credits).toLocaleString();
	var image = false;

	if (reward.hasOwnProperty('countedItems')) {
		if (reward.countedItems.ItemType == "/Lotus/Types/Items/MiscItems/Alertium") {
			
			rewardText += ' + NITAIN EXTRACT';
			image = "nitainBig.png";
			
		} else {
			var item = reward.countedItems.ItemType;
			var i = item.lastIndexOf("/");
			item = item.substr(i+1);
			item = item.replace(/([^A-Z])([A-Z][^A-Z])/g,'$1 $2');
			rewardText += ' + ' + item.toUpperCase() + ' ('+reward.countedItems.ItemCount+')';
		}
	} else if (reward.hasOwnProperty('items')) {
		if (reward.items == "/Lotus/StoreItems/Upgrades/Mods/FusionBundles/AlertFusionBundleLarge") {
		
			rewardText += ' + <img class = "inlineImage" src = "endo.png">150';
			image = "endoBig.png";
			
		} else if (reward.items == "/Lotus/StoreItems/Upgrades/Mods/FusionBundles/AlertFusionBundleMedium") {
		
			rewardText += ' + <img class = "inlineImage" src = "endo.png">100';
			image = "endoBig.png";
			
		} else if (reward.items == "/Lotus/StoreItems/Upgrades/Mods/FusionBundles/AlertFusionBundleSmall") {
		
			rewardText += ' + <img class = "inlineImage" src = "endo.png">80';
			image = "endoBig.png";

		} else {
		
			var item = reward.items;
			var i = item.lastIndexOf("/");
			item = item.substr(i+1);
			item = item.replace(/([^A-Z])([A-Z][^A-Z])/g,'$1 $2');
			rewardText += ' + ' + item.toUpperCase();
			
		}
	} else {
		image = "creditsBig.png";
	}
	
	return [rewardText, image];

}

parse.parseExpire = function(expire) {

	var ex = new Date(expire*1000);
	var ti = new Date();
	var dif = new Date(ex-ti);
	
	var expireText = Math.max(dif.getHours()-19,0)+'h '+dif.getMinutes()+'m '+dif.getSeconds()+'s';

	return expireText;

}