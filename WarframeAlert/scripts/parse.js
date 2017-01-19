parse = {};

parse.parseAlert = function(data) {

	var entry = {};
	
	console.log(data);
	
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

parse.parseReward = function(reward) {

	var rewardText = parseInt(reward.credits).toLocaleString();
	var image = "./images/none.png";
	var blueprint = "./images/none.png";

	if (reward.hasOwnProperty('countedItems')) {
		if (parse.countedItems.hasOwnProperty(reward.countedItems.ItemType)) {
		
			var formatted = parse.countedItems[reward.countedItems.ItemType].text.replace(/\%c/g,reward.countedItems.ItemCount);
			rewardText += ' + ' + formatted;
			
			var i = reward.countedItems.ItemType.lastIndexOf("/");
			var item = item.substr(i+1);
			
			
			if (ExportManifest.hasOwnProperty(item)) {
				image = "http://content.warframe.com/MobileExport"+ExportManifest[item].textureLocation;
			}
		
		} else {
		
			var item = reward.countedItems.ItemType;
			var i = item.lastIndexOf("/");
			item = item.substr(i+1);
			item = item.replace(/([^A-Z])([A-Z][^A-Z])/g,'$1 $2');
			
			for (key in parse.nameCorrections) {
				item = item.replace(key, parse.nameCorrections[key]);
			}
			
			rewardText += ' + ' + item.toUpperCase() + ' ('+reward.countedItems.ItemCount+')';
		}
	} else if (reward.hasOwnProperty('items')) {
		if (parse.items.hasOwnProperty(reward.items)) {
		
			rewardText += ' + ' +parse.items[reward.items].text;;
			image = parse.items[reward.items].image;
			
			var i = reward.items.lastIndexOf("/");
			var item = reward.items.substr(i+1);
			
			if (ExportManifest.hasOwnProperty(item)) {
				image = "http://content.warframe.com/MobileExport"+ExportManifest[item].textureLocation;
			}
		
		} else {
		
			var item = reward.items;
			
			var type = item.match(/.*\/(.*)\//)[1];
			
			var i = item.lastIndexOf("/");
			item = item.substr(i+1);
			
			var itemImageName = item;
			var itemTextName = item;
			
			if (itemImageName.search("Blueprint") > -1) {
				itemImageName = itemImageName.replace("Blueprint","");
				blueprint = "url('./images/blueprint.png')";
			}
			
			//if (itemImageName.search("Systems
			
			if (itemImageName.search("Statless") > -1) {
				itemImageName = itemImageName.replace("Statless","");
				itemImageName += "Statless";
			}
			
			if (type == "WarframeRecipes") {
				itemImageName += "Component";
				itemTextName = parse.findRealName(itemTextName);
			}
			
			if (ExportManifest.hasOwnProperty(itemImageName)) {
				image = "http://content.warframe.com/MobileExport"+ExportManifest[itemImageName].textureLocation;
			}
			
			itemTextName = itemTextName.replace(/([^A-Z])([A-Z][^A-Z])/g,'$1 $2');
			
			rewardText += ' + ' + itemTextName.toUpperCase();
			
		}
	} else {
		image = "./images/creditsBig.png";
	}
	
	return [rewardText, image, blueprint];

}

parse.findRealName = function(name) {

	realName = name;
	
	//if (tryProp

	return realName;

}

parse.parseExpire = function(expire) {

	var ex = new Date(expire*1000);
	var ti = new Date();
	
	if (ti > ex) { return "Expired"; }
	
	var dif = new Date(ex-ti);
	
	var expireText = Math.max(dif.getHours()-19,0)+'h '+dif.getMinutes()+'m '+dif.getSeconds()+'s';

	return expireText;

}

parse.countedItems = {};
parse.countedItems["/Lotus/Types/Items/MiscItems/Alertium"] = { text : "NITAIN EXTRACT" };
parse.countedItems["/Lotus/Types/Items/MiscItems/VoidTearDrop"] = { text : "VOID TRACES (%c)" };
parse.countedItems["/Lotus/Types/Items/MiscItems/ArgonCrystal"] = { text : "ARGON CRYSTAL (%c)" };
parse.countedItems["/Lotus/Types/Items/MiscItems/AlloyPlate"] = { text : "ALLOY PLATE (%c)" };
parse.countedItems["/Lotus/Types/Items/MiscItems/Neurode"] = { text : "NEURODE (%c)" };

parse.items = {};
parse.items["/Lotus/StoreItems/Upgrades/Mods/FusionBundles/AlertFusionBundleLarge"] = { text : '<img class = "inlineImage" src = "./images/endo.png">150' };
parse.items["/Lotus/StoreItems/Upgrades/Mods/FusionBundles/AlertFusionBundleMedium"] = { text : '<img class = "inlineImage" src = "./images/endo.png">100' };
parse.items["/Lotus/StoreItems/Upgrades/Mods/FusionBundles/AlertFusionBundleSmall"] = { text : '<img class = "inlineImage" src = "./images/endo.png">80' };
parse.items["/Lotus/Types/Items/MiscItems/Alertium"] = { text : "NITAIN EXTRACT" };

parse.nameCorrections = {};
parse.nameCorrections["Trapper"] = "VAUBAN";
parse.nameCorrections["Statless "] = "";