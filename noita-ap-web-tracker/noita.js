class Location {
	id = -1;
	type = "_NONE_";
	name = "_NONE_";
	
	constructor(id, type, name) {
		this.id = id;
		this.type = type;
		this.name = name;
	}
}

class Region {
	name = "_NONE_";
	locations = {};
	
	constructor(name) {
		this.name = name;
	}
	
	addLocation(id, type, name) {
		if (trackerData.locationIds.hasOwnProperty(id)) { console.log(id, type, name); return; }
		trackerData.locationIds[id] = new Location(id, type, name);
		this.locations[id] = trackerData.locationIds[id];
	}
	
	getLocations(type) {
		var resultSet = Object.values(this.locations);
		if (type != null) {
			resultSet = resultSet.filter(function(loc) { return loc.type == type; });
		}
		return resultSet;
	}
}

var AP = {
	server: null,
	slotname: null,
	password: null,
	
	ws: null,
	dataPackage: null,
	locations: {
		checked: [],
		missing: [],
	},
	
	locationMap: {
		
		"111900": [ "", [ "Forge Emerald Tablet - Volume I" ], [ "The Sky" ] ], //Unforgeable
		"111901": [ "", [ "Forge Emerald of Thoth" ], [ "Pyramid" ] ], //Unforgeable
		"111902": [ "", [ "Forge Emerald Tablet - Volume II" ], [ "Frozen Vault" ] ],
		"111903": [ "", [ "Forge Emerald Tablet - Volume III" ], [ "Below Lava Lake" ] ], //Unforgeable
		"111904": [ "", [ "Forge Emerald Tablet - Volume IV" ], [ "Sandcave" ] ],
		"111905": [ "", [ "Forge Emerald Tablet - Volume V" ], [ "Magical Temple" ] ],
		"111906": [ "", [ "Forge Emerald Tablet - Volume VI" ], [ "Lukki Lair" ] ],
		"111907": [ "", [ "Forge Emerald Tablet - Volume VII" ], [ "Abyss Orb Room" ] ],
		"111908": [ "", [ "Forge Emerald Tablet - Volume VIII" ], [ "The Work (Hell)" ] ],
		"111909": [ "", [ "Forge Emerald Tablet - Volume IX" ], [ "Snowy Chasm" ] ],
		"111910": [ "", [ "Forge Emerald Tablet - Volume X" ], [ "Desert Chasm" ] ],

		"111899": [ "", [ "Forge Portal Spell" ], [ "Snowy Depths" ] ],
		"111898": [ "", [ "Forge Broken Wand" ], [ "Anywhere" ] ],
		
		"112001": [ "player", [ "Minä", "Me" ], [ "Forest" ] ],
		"112002": [ "sheep", [ "Lammas", "Sheep" ], [ "Lake" ] ],
		"112003": [ "sheep_bat", [ "Lentolammas", "Flying Sheep" ], [ "" ] ],
		"112004": [ "sheep_fly", [ "Suhiseva lammas", "Buzzing Sheep" ], [ "" ] ],
		"112005": [ "scorpion", [ "Skorpioni", "Scorpion" ], [ "Pyramid", "Temple of the Art", "Watchtower", "Wizards' Den" ] ],
		"112006": [ "fish", [ "Eväkäs", "Fish" ], [ "Forest", "Holy Mountain", "Lake", "Hiisi Base" ] ],
		"112007": [ "fish_large", [ "Suureväkäs", "Large Fish" ], [ "Lake", "Snowy Depths" ] ],
		"112008": [ "duck", [ "Ankka", "Duck" ], [ "Lake" ] ],
		"112009": [ "wolf", [ "Susi", "Wolf" ], [ "Lake", "The Tower" ] ],
		"112010": [ "deer", [ "Nelikoipi", "Deer" ], [ "Lake" ] ],
		"112011": [ "elk", [ "Poro", "Reindeer" ], [ "Lake" ] ],
		"112012": [ "eel", [ "Nahkiainen", "Lamprey" ], [ "Lake" ] ],
		"112013": [ "zombie_weak", [ "Heikkohurtta", "Weak Hound" ], [ "Mines" ] ],
		"112014": [ "zombie", [ "Hurtta", "Hound" ], [ "Collapsed Mines", "Fungal Caverns", "The Tower" ] ],
		"112015": [ "miner_weak", [ "Tappurahiisiläinen", "Weak Hiisi Miner" ], [ "Mines", "Coal Pits" ] ],
		"112016": [ "miner", [ "Tappurahiisi", "Miner Hiisi" ], [ "Collapsed Mines", "Coal Pits", "The Tower" ] ],
		"112017": [ "miner_fire", [ "Tulihiisi", "Fire Hiisi" ], [ "Collapsed Mines", "Coal Pits", "The Tower" ] ],
		"112018": [ "miner_santa", [ "Jouluhiisi", "Christmas Hiisi" ], [ "Mines", "Collapsed Mines", "Coal Pits" ] ],
		"112019": [ "miner_chef", [ "Kokkihiisi", "Hiisi Chef" ], [ "Hiisi Base" ] ],
		"112020": [ "goblin_bomb", [ "Sähikäismenninkäinen", "Firecracker Goblin" ], [ "Coal Pits", "The Tower" ] ],
		"112021": [ "shotgunner_weak", [ "Heikko haulikkohiisi", "Weak Shotgun Hiisi" ], [ "Mines" ] ],
		"112022": [ "shotgunner", [ "Haulikkohiisi", "Shotgun Hiisi" ], [ "Mines", "Collapsed Mines", "Coal Pits", "Snowy Depths", "Hiisi Base", "The Tower" ] ],
		"112023": [ "scavenger_smg", [ "Rynkkyhiisi", "Hiisi Gunner" ], [ "Snowy Depths", "Hiisi Base", "Underground Jungle", "The Vault", "Sandcave", "Desert Chasm", "Frozen Vault", "Snowy Chasm", "The Tower" ] ],
		"112024": [ "scavenger_grenade", [ "Kranuhiisi", "Hiisi Grenadier" ], [ "Snowy Depths", "Hiisi Base", "Underground Jungle", "The Vault", "Sandcave", "Desert Chasm", "Frozen Vault", "Snowy Chasm", "The Tower" ] ],
		"112025": [ "scavenger_mine", [ "Miinankylväjä", "Hiisi Mine Thrower" ], [ "Coal Pits", "Snowy Depths", "Hiisi Base", "Underground Jungle", "The Vault", "Sandcave", "Frozen Vault", "The Tower" ] ],
		"112026": [ "scavenger_heal", [ "Parantajahiisi", "Hiisi Healer" ], [ "Hiisi Base", "Underground Jungle", "The Vault", "Sandcave", "Frozen Vault", "The Tower" ] ],
		"112027": [ "scavenger_glue", [ "Liimahiisi", "Glue Hiisi" ], [ "Snowy Depths", "The Vault", "Frozen Vault", "Power Plant" ] ],
		"112028": [ "scavenger_invis", [ "Häivehiisi", "Stealth Hiisi" ], [ "Fungal Caverns", "Frozen Vault", "Sandcave" ] ],
		"112029": [ "scavenger_shield", [ "Kilpihiisi", "Shield Hiisi" ], [ "Fungal Caverns", "Frozen Vault", "The Tower" ] ],
		"112030": [ "scavenger_poison", [ "Myrkkyhiisi", "Hiisi Poisoner" ], [ "Underground Jungle", "Sandcave", "The Tower" ] ],
		"112031": [ "scavenger_clusterbomb", [ "Isohiisi", "Hiisi Bomber" ], [ "Hiisi Base", "Underground Jungle", "Sandcave", "The Tower" ] ],
		"112032": [ "scavenger_leader", [ "Toimari", "Hiisi Leader" ], [ "Snowy Depths", "Hiisi Base", "Underground Jungle", "The Vault", "Frozen Vault", "Sandcave", "Desert Chasm", "The Tower" ] ],
		"112033": [ "alchemist", [ "Puistokemisti", "Hiisi Alchemist" ], [ "Mines", "Coal Pits", "Fungal Caverns", "Pyramid", "Overgrown Cavern", "The Tower" ] ],
		"112034": [ "sniper", [ "Snipuhiisi", "Hiisi Sniper" ], [ "Snowy Depths", "Hiisi Base", "The Vault", "The Tower" ] ],
		"112035": [ "shaman", [ "Märkiäinen", "Swampling" ], [ "Mines", "Collapsed Mines", "Underground Jungle" ] ],
		"112036": [ "coward", [ "Raukka", "Coward" ], [ "Hiisi Base", "Underground Jungle", "The Vault", "Frozen Vault", "The Tower" ] ],
		"112037": [ "flamer", [ "Liekkari", "Flamer" ], [ "Underground Jungle", "The Vault", "The Tower" ] ],
		"112038": [ "icer", [ "Jäähdytyslaite", "Icer" ], [ "The Vault", "Frozen Vault", "The Tower" ] ],
		"112039": [ "bigzombie", [ "Mätänevä ruumis", "Rotting Corpse" ], [ "The Vault", "Frozen Vault", "Fungal Caverns", "The Tower" ] ],
		"112040": [ "bigzombietorso", [ "Mätänevä kroppa", "Rotting Body" ], [ "The Vault", "Frozen Vault", "Fungal Caverns", "The Tower" ] ],
		"112041": [ "bigzombiehead", [ "Mätänevä pää", "Rotting Head" ], [ "The Vault", "Frozen Vault", "Fungal Caverns", "The Tower" ] ],
		"112042": [ "slimeshooter_weak", [ "Heikko limanuljaska", "Weak Toxic Slime" ], [ "Mines" ] ],
		"112043": [ "slimeshooter", [ "Limanuljaska", "Toxic Slime" ], [ "Coal Pits", "Fungal Caverns", "Snowy Depths", "The Tower" ] ],
		"112044": [ "acidshooter_weak", [ "Heikko happonuljaska", "Weak Acid Slime" ], [ "Mines" ] ],
		"112045": [ "acidshooter", [ "Happonuljaska", "Acid Slime" ], [ "Mines", "Fungal Caverns", "The Vault", "Temple of the Art", "Frozen Vault", "The Tower" ] ],
		"112046": [ "lasershooter", [ "Mulkkio", "Gazer" ], [ "The Vault", "Frozen Vault", "Temple of the Art", "The Tower" ] ],
		"112047": [ "giantshooter_weak", [ "Heikko äitinuljaska", "Weak Mother Slime" ], [ "Mines" ] ],
		"112048": [ "giantshooter", [ "Äitinuljaska", "Mother Slime" ], [ "Mines", "Fungal Caverns", "The Tower" ] ],
		"112049": [ "miniblob", [ "Möykky", "Blob" ], [ "Fungal Caverns", "Overgrown Cavern", "The Vault", "Frozen Vault", "The Tower" ] ],
		"112050": [ "blob", [ "Kiukkumöykky", "Angry Blob" ], [ "Fungal Caverns", "Overgrown Cavern", "The Vault", "Frozen Vault", "The Tower" ] ],
		"112051": [ "ant", [ "Murkku", "Ant" ], [ "Fungal Caverns", "Overgrown Cavern", "The Tower" ] ],
		"112052": [ "rat", [ "Rotta", "Rat" ], [ "Mines", "Coal Pits", "Fungal Caverns", "Snowy Depths", "Hiisi Base", "Meat Realm", "The Tower" ] ],
		"112053": [ "bat", [ "Lepakko", "Bat" ], [ "Coal Pits", "The Tower" ] ],
		"112054": [ "bigbat", [ "Suurlepakko", "Large Bat" ], [ "Coal Pits", "The Tower" ] ],
		"112055": [ "firebug", [ "Pikkutulikärpänen", "Lesser firefly" ], [ "Coal Pits", "The Tower" ] ],
		"112056": [ "bigfirebug", [ "Suurtulikärpänen", "Greater firefly" ], [ "Coal Pits", "The Tower" ] ],
		"112057": [ "bloom", [ "Puska", "Bloom" ], [ "Underground Jungle", "The Tower" ] ],
		"112058": [ "shooterflower", [ "Plasmakukka", "Plasma Flower" ], [ "Underground Jungle", "The Tower" ] ],
		"112059": [ "fly", [ "Amppari", "Wasp" ], [ "Underground Jungle", "Fungal Caverns", "The Tower" ] ],
		"112060": [ "frog", [ "Konna", "Toad" ], [ "Collapsed Mines", "Fungal Caverns", "The Tower" ] ],
		"112061": [ "frog_big", [ "Jättikonna", "Big Toad" ], [ "Collapsed Mines", "Fungal Caverns", "Overgrown Cavern", "The Tower" ] ],
		"112062": [ "fungus", [ "Laahustussieni", "Shuffling Fungus" ], [ "Mines", "Fungal Caverns", "Overgrown Cavern", "Underground Jungle", "The Tower", "Lukki Lair" ] ],
		"112063": [ "fungus_big", [ "Nuijamalikka", "Club-foot" ], [ "Fungal Caverns", "Overgrown Cavern", "Mines", "The Tower", "Lukki Lair" ] ],
		"112064": [ "fungus_giga", [ "Huhtasieni", "Pollen Morel" ], [ "Overgrown Cavern", "The Tower" ] ],
		"112065": [ "lurker", [ "Varjokupla", "Shadow Bubble" ], [ "Lukki Lair" ] ],
		"112066": [ "maggot", [ "Toukka", "Maggot" ], [ "Underground Jungle", "Fungal Caverns", "The Vault", "Temple of the Art", "The Tower" ] ],
		"112067": [ "skullrat", [ "Kallorotta", "Skull Rat" ], [ "Pyramid", "Temple of the Art", "The Tower" ] ],
		"112068": [ "skullfly", [ "Kallokärpänen", "Skull Fly" ], [ "Pyramid", "Temple of the Art", "The Tower" ] ],
		"112069": [ "tentacler_small", [ "Pikkuturso", "Small Tentacler" ], [ "Fungal Caverns", "Temple of the Art", "The Tower" ] ],
		"112070": [ "tentacler", [ "Turso", "Tentacler" ], [ "Fungal Caverns", "The Vault", "Temple of the Art", "The Tower" ] ],
		"112071": [ "ghoul", [ "Sylkyri", "Spitter" ], [ "The Tower" ] ],
		"112072": [ "giant", [ "Hiidenkivi", "Rock Giant" ], [ "Snowy Depths", "The Tower" ] ],
		"112073": [ "pebble", [ "Lohkare", "Rock Spirit" ], [ "Snowy Depths", "The Tower" ] ],
		"112074": [ "longleg", [ "Hämis", "Spidey" ], [ "Mines", "Collapsed Mines", "Pyramid", "Temple of the Art", "The Tower" ] ],
		"112075": [ "lukki_tiny", [ "Pikkuhämähäkki", "Small Spider" ], [ "Underground Jungle" ] ],
		"112076": [ "lukki", [ "Hämähäkki", "Spider" ], [ "Underground Jungle", "Lukki Lair" ] ],
		"112077": [ "lukki_longleg", [ "Lukki", "Daddy Longlegs" ], [ "Underground Jungle" ] ],
		"112078": [ "lukki_creepy_long", [ "Kasvoton Lukki", "Faceless spider" ], [ "Lukki Lair" ] ],
		"112079": [ "lukki_dark", [ "Kammolukki", "Toothy spider" ], [ "Lukki Lair" ] ],
		"112080": [ "worm_tiny", [ "Pikkumato", "Small Worm" ], [ "Snowy Depths" ] ],
		"112081": [ "worm", [ "Mato", "Worm" ], [ "Mines", "Collapsed Mines", "Snowy Depths", "Underground Jungle", "Temple of the Art", "Meat Realm" ] ],
		"112082": [ "worm_big", [ "Jättimato", "Giant Worm" ], [ "Giant Tree", "Mines", "Collapsed Mines", "Coal Pits", "Fungal Caverns", "Snowy Depths", "Underground Jungle", "Meat Realm" ] ],
		"112083": [ "worm_skull", [ "Kalmamato", "Death Worm" ], [ "Temple of the Art", "The Work (Sky)" ] ],
		"112084": [ "worm_end", [ "Helvetinmato", "Hell Worm" ], [ "The Work (Hell)" ] ],
		"112085": [ "drone_physics", [ "Lennokki", "Drone" ], [ "Fungal Caverns", "The Vault", "Frozen Vault", "The Tower" ] ],
		"112086": [ "drone_lasership", [ "Jättilaser-lennokki", "Giant Laser-Drone" ], [ "Hiisi Base", "The Vault", "Frozen Vault", "Power Plant" ] ],
		"112087": [ "drone_shield", [ "Turvalennokki", "Safety Drone" ], [ "Frozen Vault", "The Tower", "Power Plant", "Lukki Lair" ] ],
		"112088": [ "basebot_sentry", [ "Tarkkailija", "Observer" ], [ "Power Plant" ] ],
		"112089": [ "basebot_hidden", [ "Vakoilija", "Spy" ], [ "Power Plant" ] ],
		"112090": [ "basebot_neutralizer", [ "Pysäyttäjä", "Stopper" ], [ "Power Plant" ] ],
		"112091": [ "basebot_soldier", [ "Teloittaja", "Executioner" ], [ "Power Plant" ] ],
		"112092": [ "healerdrone_physics", [ "Korjauslennokki", "Repair Drone" ], [ "The Vault", "Frozen Vault", "Power Plant", "The Tower" ] ],
		"112093": [ "roboguard", [ "Robottikyttä", "Robo-Cop" ], [ "Fungal Caverns", "The Vault", "Frozen Vault", "The Tower" ] ],
		"112094": ["roboguard_big", [ "Kyrmyniska", "Hunchback" ], [ "Power Plant" ] ],
		"112095": [ "assassin", [ "Salamurhaajarobotti", "Assassin Robot" ], [ "The Vault", "Frozen Vault", "Fungal Caverns", "The Tower" ] ],
		"112096": [ "spearbot", [ "Peitsivartija", "Lance Sentry" ], [ "Underground Jungle", "The Vault", "Frozen Vault", "Cloudscape", "The Work (Sky)", "The Tower" ] ],
		"112097": [ "tank", [ "KK-Tankki", "Tank" ], [ "Snowy Depths", "Hiisi Base", "The Vault", "Frozen Vault", "Desert Chasm", "Snowy Chasm", "The Tower" ] ],
		"112098": [ "tank_rocket", [ "IT-Tankki", "Rocket Tank" ], [ "Snowy Depths", "Hiisi Base", "Sandcave", "Frozen Vault", "The Tower" ] ],
		"112099": [ "tank_super", [ "Laser-Tankki", "Laser Tank" ], [ "Snowy Depths", "Hiisi Base", "The Vault", "Frozen Vault", "Power Plant", "The Tower" ] ],
		"112100": [ "turret_left", [ "Torjuntalaite", "Turret" ], [ "Hiisi Base", "The Vault", "Frozen Vault", "Power Plant", "The Tower" ] ],
		"112101": [ "turret_right", [ "Torjuntalaite", "Turret" ], [ "Hiisi Base", "The Vault", "Frozen Vault", "Power Plant", "The Tower" ] ],
		"112102": [ "monk", [ "Munkki", "Monk" ], [ "Snowy Depths", "Underground Jungle", "The Vault", "The Tower" ] ],
		"112103": [ "missilecrab", [ "Heinäsirkka", "Cricket" ], [ "The Vault", "Frozen Vault", "The Tower" ] ],
		"112104": [ "necrobot", [ "Tuonelankone", "Necrobot" ], [ "Frozen Vault", "The Tower", "Power Plant", "Meat Realm" ] ],
		"112105": [ "necrobot_super", [ "Marraskone", "Super Necrobot" ], [ "Frozen Vault", "Power Plant", "Meat Realm" ] ],
		"112106": [ "fireskull", [ "Liekkiö", "Fire Spirit" ], [ "Mines", "Coal Pits", "The Tower" ] ],
		"112107": [ "iceskull", [ "Jäätiö", "Ice Spirit" ], [ "Snowy Depths", "Snowy Chasm", "The Tower" ] ],
		"112108": [ "thunderskull", [ "Sähkiö", "Thunder Spirit" ], [ "Pyramid", "Snowy Depths", "Underground Jungle", "The Vault", "Snowy Chasm", "The Work (Hell)", "The Work (Sky)", "The Tower" ] ],
		"112109": [ "firemage_weak", [ "Stendari", "Fire Mage" ], [ "Mines", "Collapsed Mines", "Desert Chasm" ] ],
		"112110": [ "firemage", [ "Eldari", "Hellfire Mage" ], [ "Fungal Caverns", "The Vault", "Wizards' Den", "Frozen Vault", "Desert Chasm", "The Tower" ] ],
		"112111": [ "icemage", [ "Pakkasukko", "Old Man Winter" ], [ "Snowy Depths", "Frozen Vault", "Wizards' Den", "Snowy Chasm", "Snowy Wasteland", "The Tower" ] ],
		"112112": [ "thundermage", [ "Ukko", "Thunder Mage" ], [ "Fungal Caverns", "Snowy Depths", "The Vault", "Frozen Vault", "Wizards' Den", "Cloudscape", "Snowy Chasm", "Mines", "Desert Chasm", "The Tower" ] ],
		"112113": [ "thundermage_big", [ "Suur-Ukko", "Great Thunder Mage" ], [ "Cloudscape", "The Work (Sky)", "Pyramid", "Frozen Vault", "Snowy Chasm", "The Tower" ] ],
		"112114": [ "barfer", [ "Turvonnu velho", "Bloated Wizard" ], [ "Temple of the Art", "Wizards' Den", "The Tower" ] ],
		"112115": [ "wizard_dark", [ "Sokaisunmestari", "Master of Blinding" ], [ "Fungal Caverns", "Snowy Depths", "The Vault", "Temple of the Art", "Wizards' Den", "Desert Chasm", "The Tower", "Lukki Lair" ] ],
		"112116": [ "wizard_tele", [ "Siirtäjämestari", "Master of Teleportation" ], [ "Fungal Caverns", "Snowy Depths", "Temple of the Art", "Wizards' Den", "The Work (Sky)", "Cloudscape", "Desert Chasm", "The Tower" ] ],
		"112117": [ "wizard_poly", [ "Muodonmuutosmestari", "Master of Polymorphing" ], [ "Fungal Caverns", "Temple of the Art", "Wizards' Den", "The Tower" ] ],
		"112118": [ "wizard_swapper", [ "Vaihdosmestari", "Master of Exchange" ], [ "Fungal Caverns", "Snowy Depths", "Temple of the Art", "Wizards' Den", "Cloudscape", "The Tower" ] ],
		"112119": [ "wizard_neutral", [ "Maadoittajamestari", "Master of Grounding" ], [ "Ancient Laboratory", "Magical Temple", "The Vault", "Temple of the Art", "Pyramid", "Wizards' Den", "Snowy Depths", "The Tower" ] ],
		"112120": [ "wizard_returner", [ "Palauttajamestari", "Master of Returning" ], [ "Ancient Laboratory", "Magical Temple", "Temple of the Art", "Wizards' Den", "Desert Chasm", "The Tower" ] ],
		"112121": [ "wizard_hearty", [ "Haavoittajamestari", "Master of Wounding" ], [ "Underground Jungle", "Magical Temple", "The Vault", "Temple of the Art", "The Tower", "Pyramid", "Frozen Vault", "Wizards' Den", "Meat Realm", "Lukki Lair" ] ],
		"112122": [ "wizard_homing", [ "Kohdennusmestari", "Master of Homing" ], [ "The Tower", "Wizards' Den", "Lukki Lair" ] ],
		"112123": [ "wizard_weaken", [ "Turvattomuusmestari", "Master of Vulnerability" ], [ "Desert Chasm", "The Tower", "Pyramid", "Frozen Vault", "Cloudscape", "Wizards' Den", "Lukki Lair" ] ],
		"112124": [ "wizard_twitchy", [ "Sätkymestari", "Master of Twitching" ], [ "Fungal Caverns", "Underground Jungle", "Magical Temple", "The Vault", "Temple of the Art", "Pyramid", "Wizards' Den", "The Tower", "Lukki Lair" ] ],
		"112125": [ "enlightened_alchemist", [ "Valaistunut alkemisti", "Enlightened Alchemist" ], [ "Ancient Laboratory", "Magical Temple", "Temple of the Art", "Desert Chasm", "The Tower" ] ],
		"112126": [ "failed_alchemist", [ "Kadotettu alkemisti", "Damned Alchemist" ], [ "Ancient Laboratory", "Magical Temple", "Temple of the Art", "Wizards' Den", "Meat Realm", "The Tower" ] ],
		"112127": [ "failed_alchemist_b", [ "Epäalkemisti", "Non-alchemist" ], [ "Ancient Laboratory", "Magical Temple", "Temple of the Art", "The Tower" ] ],
		"112128": [ "wraith", [ "Hyypiö", "Creep" ], [ "Temple of the Art", "The Tower", "The Work (Hell)", "Cloudscape" ] ],
		"112129": [ "wraith_storm", [ "Ukkoshyypiö", "Thunder Creep" ], [ "The Tower", "Cloudscape", "The Work (Sky)" ] ],
		"112130": [ "wraith_glowing", [ "Hohtava hyypiö", "Glowing Creep" ], [ "Magical Temple", "Temple of the Art", "Cloudscape", "The Work (Hell)", "The Tower", "The Work (Sky)" ] ],
		"112131": [ "statue", [ "Patsas", "Statue" ], [ "Ancient Laboratory", "The Tower" ] ],
		"112132": [ "statue_physics", [ "Hohtonaamio", "Glowing Mask" ], [ "Magical Temple", "The Tower" ] ],
		"112133": [ "snowcrystal", [ "Haamukivi", "Ghost Crystal" ], [ "Snowy Chasm", "The Tower" ] ],
		"112134": [ "hpcrystal", [ "Elvytyskristalli", "Recovery Crystal" ], [ "Snowy Chasm", "Desert Chasm", "The Tower" ] ],
		"112135": [ "ghost", [ "Houre", "Delirium" ], [ "Temple of the Art", "Wizards' Den", "Snowy Chasm" ] ],
		"112136": [ "wand_ghost", [ "Taikasauva", "Magic Wand" ], [ "Magical Temple" ] ],
		"112137": [ "ethereal_being", [ "Olematon", "Non-existent" ], [ "Snowy Chasm", "Pyramid" ] ],
		"112138": [ "playerghost", [ "Kummitus", "Ghost" ], [ "Mines", "Collapsed Mines", "Coal Pits", "Fungal Caverns", "Snowy Depths", "Underground Jungle", "The Vault", "Temple of the Art", "Frozen Vault", "Lukki Lair", "Wizards' Den", "Overgrown Cavern", "Power Plant" ] ],
		"112139": [ "phantom_a", [ "Spiraalikalma", "Spiral Phantom" ], [ "Pyramid", "Magical Temple", "Temple of the Art", "Snowy Chasm", "The Tower" ] ],
		"112140": [ "phantom_b", [ "Kiukkukalma", "Angry Phantom" ], [ "Pyramid", "Magical Temple", "Temple of the Art", "Snowy Chasm", "The Tower" ] ],
		"112141": [ "confusespirit", [ "Utu-Aave", "Fog Spirit" ], [ "Fungal Caverns", "Overgrown Cavern", "Pyramid" ] ],
		"112142": [ "berserkspirit", [ "Viha-Aave", "Anger Spirit" ], [ "Overgrown Cavern", "Pyramid" ] ],
		"112143": [ "weakspirit", [ "Kaamo-Aave", "Depression Spirit" ], [ "Pyramid" ] ],
		"112144": [ "slimespirit", [ "Neva-Aave", "Bog Spirit" ], [ "Coal Pits", "Fungal Caverns", "Meat Realm" ] ],
		"112145": [ "necromancer", [ "Hahmonvaihtaja", "Shapechanger" ], [ "Magical Temple", "Temple of the Art", "Snowy Depths", "The Tower" ] ],
		"112146": [ "gazer", [ "Helvetinkatse", "Hell Gazer" ], [ "The Work (Hell)", "The Tower" ] ],
		"112147": [ "skygazer", [ "Taivaankatse", "Sky Gazer" ], [ "The Work (Sky)" ] ],
		"112148": [ "spitmonster", [ "Helvetin sylkijä", "Hell Spitter" ], [ "The Work (Hell)", "The Tower" ] ],
		"112149": [ "crystal_physics", [ "Kirottu kristalli", "Cursed Crystal" ], [ "Temple of the Art", "The Tower" ] ],
		"112150": [ "bloodcrystal_physics", [ "Verikristalli", "Blood Crystal" ], [ "The Work (Hell)", "Meat Realm", "The Tower" ] ],
		"112151": [ "skycrystal_physics", [ "Taivaskristalli", "Celestial Crystal" ], [ "The Tower", "Cloudscape", "The Work (Sky)" ] ],
		"112152": [ "chest_mimic", [ "Matkija", "Mimic" ], [ "" ] ],
		"112153": [ "chest_leggy", [ "Jalkamatkatavara", "Leggy Mimic" ], [ "" ] ],
		"112154": [ "miner_hell", [ "Hornantappurahiisi", "Hell Miner Hiisi" ], [ "Meat Realm" ] ],
		"112155": [ "shotgunner_hell", [ "Hornahiisi", "Hell Shotgun Hiisi" ], [ "Meat Realm" ] ],
		"112156": [ "sniper_hell", [ "Hornasnipuhiisi", "Hiisi Hell Sniper" ], [ "Meat Realm" ] ],
		"112157": [ "dark_alchemist", [ "Pahan muisto", "Memory of Evil" ], [ "Treasure Chest" ] ],
		"112158": [ "shaman_wind", [ "Valhe", "Lie" ], [ "" ] ],
		"112159": [ "necromancer_shop", [ "Stevari", "Guard" ], [ "Holy Mountain", "The Tower" ] ],
		"112160": [ "necromancer_super", [ "Skoude", "Cop" ], [ "Holy Mountain", "The Tower" ] ],
		"112161": [ "boss_dragon", [ "Suomuhauki", "Dragon" ], [ "Dragoncave" ] ],
		"112162": [ "boss_limbs", [ "Kolmisilmän Koipi", "Three-Eye's Legs" ], [ "Pyramid" ] ],
		"112163": [ "boss_meat", [ "Kolmisilmän sydän", "Three-Eye's Heart" ], [ "Meat Realm" ] ],
		"112164": [ "boss_alchemist", [ "Ylialkemisti", "High Alchemist" ], [ "Abandoned Alchemy Lab" ] ],
		"112165": [ "parallel_alchemist", [ "Alkemistin Varjo", "Alchemist's Shadow" ], [ "Parallel Worlds" ] ],
		"112166": [ "boss_ghost", [ "Unohdettu", "Forgotten" ], [ "Forgotten Cave" ] ],
		"112167": [ "boss_ghost_polyp", [ "Häive", "Fade" ], [ "Forgotten Cave" ] ],
		"112168": [ "islandspirit", [ "Tapion vasalli", "Tapio's Vassal" ], [ "Lake Island" ] ],
		"112169": [ "boss_pit", [ "Sauvojen tuntija", "Connoisseur of Wands" ], [ "Lava Lake" ] ],
		"112170": [ "boss_robot", [ "Kolmisilmän silmä", "Three-Eye's Eye" ], [ "Power Plant" ] ],
		"112171": [ "fish_giga", [ "Syväolento", "Creature of the Deep" ], [ "Lake" ] ],
		"112172": [ "maggot_tiny", [ "Limatoukka", "Slime Maggot" ], [ "Buried skull" ] ],
		"112173": [ "parallel_tentacles", [ "Kolmisilmän Kätyri", "Three-eye's Minion" ], [ "Parallel Worlds" ] ],
		"112174": [ "minipit", [ "Pienkätyri", "Tiny Minion" ], [ "Frozen Vault", "The Tower", "Power Plant", "Meat Realm" ] ],
		"112175": [ "gate_monster_a", [ "Veska", "Goalkeeper" ], [ "Temple of the Art" ] ],
		"112176": [ "gate_monster_b", [ "Molari", "Goalkeeper" ], [ "Temple of the Art" ] ],
		"112177": [ "gate_monster_c", [ "Mokke", "Goalkeeper" ], [ "Temple of the Art" ] ],
		"112178": [ "gate_monster_d", [ "Seula", "Sieve" ], [ "Temple of the Art" ] ],
		"112179": [ "boss_wizard", [ "Mestarien mestari", "Master of Masters" ], [ "Throne Room" ] ],
		"112180": [ "boss_centipede", [ "Kolmisilmä", "Three-Eye" ], [ "The Laboratory" ] ],
		"112181": [ "ultimate_killer", [ "Kauhuhirviö", "Horror Monster" ], [ "Frozen Vault", "Friend Room" ] ],
		"112182": [ "friend", [ "Toveri", "Friend" ], [ "Friend Room" ] ],
		"112183": [ "boss_sky", [ "Kivi", "Stone" ], [ "Kivi Temple" ] ],
		
		"112184": [ "darkghost", [ "Haamu", "Wraith" ], [ "" ] ],
		"112185": [ "meatmaggot", [ "Mätäryömijä", "Putrid Crawler" ], [ "Meat Realm" ] ],
		
		"110646": [ "boss_centipede", [ "Kolmisilmä", "Three-Eye"], [ "The Laboratory" ] ],
		"110647": [ "maggot_tiny", [ "Limatoukka", "Slime Maggot" ], [ "Buried skull" ] ],
		"110648": [ "boss_dragon", [ "Suomuhauki", "Dragon" ], [ "Dragoncave" ] ],
		"110649": [ "boss_limbs", [ "Kolmisilmän Koipi", "Three-Eye's Legs'" ], [ "Pyramid" ] ],
		"110650": [ "boss_pit", [ "Sauvojen tuntija", "Connoisseur of Wands" ], [ "Lava Lake" ] ],
		"110651": [ "fish_giga", [ "Syväolento", "Creature of the Deep" ], [ "Lake" ] ],
		"110652": [ "gate_monster_a", [ "Veska", "Goalkeeper" ], [ "Temple of the Art" ] ],
		"110653": [ "boss_ghost", [ "Unohdettu", "Forgotten" ], [ "Forgotten Cave" ] ],
		"110654": [ "friend", [ "Toveri", "Friend" ], [ "Friend Room" ] ],
		"110655": [ "boss_wizard", [ "Mestarien mestari", "Master of Masters" ], [ "Throne Room" ] ],
		"110656": [ "boss_alchemist", [ "Ylialkemisti", "High Alchemist" ], [ "Abandoned Alchemy Lab" ] ],
		"110657": [ "boss_robot", [ "Kolmisilmän silmä", "Three-Eye's Eye" ], [ "Power Plant" ] ],
		"110669": [ "islandspirit", [ "Tapion vasalli", "Tapio's Vassal" ], [ "Lake Island" ] ],
		"110670": [ "boss_sky" , [ "Kivi" , "Stone" ], [ "Kivi Temple" ] ],
		"110671": [ "boss_meat", [ "Kolmisilmän sydän", "Three-Eye's Heart" ], [ "Meat Realm" ] ],
		
		"113001": [ "crystal_green", [ "Green Crystal", "Green Crystal" ], [ "Temple of the Art" ] ],
		"113002": [ "crystal_pink", [ "Pink Crystal", "Pink Crystal" ], [ "Temple of the Art" ] ],
		"113003": [ "crystal_red", [ "Red Crystal", "Red Crystal" ], [ "Temple of the Art" ] ],
		"113004": [ "forcefield_generator", [ "Forcefield Generator", "Forcefield Generator" ], [ "Hiisi Base" ] ],
		"113005": [ "barrel_unstable", [ "Oil Barrel", "Oil Barrel" ], [ "Mines" ] ],
		"113006": [ "barrel_radioactive", [ "Toxic Barrel", "Toxic Barrel" ], [ "Mines" ] ],
		"113007": [ "tnt", [ "Explosive Box", "Explosive Box" ], [ "Mines" ] ],
		"113008": [ "crate", [ "Gunpowder Crate", "Gunpowder Crate" ], [ "Hiisi Base" ] ],
		"113009": [ "pressure_tank", [ "Pressure Tank", "Pressure Tank" ], [ "The Vault" ] ],
		"113010": [ "propane_tank", [ "Propane Tank", "Propane Tank" ], [ "Snowy Depths" ] ],
		"113011": [ "seamine", [ "Sea Mine", "Sea Mine" ], [ "Coal Pits" ] ],
		"113012": [ "apparatus_01", [ "Vault Apparatus (Hot)", "Vault Apparatus (Hot)" ], [ "The Vault" ] ],
		"113013": [ "apparatus_02", [ "Vault Apparatus (Cold)", "Vault Apparatus (Cold)" ], [ "The Vault" ] ],
		"113014": [ "cocoon", [ "Worm Cocoon", "Worm Cocoon" ], [ "Underground Jungle" ] ],
		"113015": [ "lukki_eggs", [ "Lukki Eggs", "Lukki Eggs" ], [ "Underground Jungle" ] ],
		
		"112201": [ "cat_mocreeps", [ "Kissa", "Cat" ], [ "Forest" ] ],
		"112202": [ "bubble_liquid", [ "Nestemäinen kupla", "Liquid Bubble" ], [ "Coal Pits", "The Vault", "Fungal Caverns" ] ],
		"112203": [ "hiisi_thief", [ "Varashiisi", "Thief Hiisi" ], [ "Mines", "Coal Pits", "Snowy Depths", "Fungal Caverns", "Ant Nest" ] ],
		"112204": [ "hisii_minecart", [ "Kaivoskärryhaulikkohiisi", "Minecart Hiisi" ], [ "Mines", "Coal Pits" ] ],
		"112205": [ "hisii_minecart_tnt", [ "Kaivoskärrytappurahaulikkohiisi", "Minecart Miner Hiisi" ], [ "Mines", "Coal Pits" ] ],
		"112206": [ "hisii_giga_bomb", [ "Psykopaattihiisi", "Giga Bomb Hiisi" ], [ "Mines" ] ],
		"112207": [ "hisii_engineer", [ "Insinöörihiisi", "Hiisi Engineer" ], [ "Snowy Depths", "Hiisi Base", "Frozen Vault", "The Vault" ] ],
		"112208": [ "hisii_rocketshotgun", [ "Rakettihaulikkohiisi", "Rocket Shotgun Hiisi" ], [ "Underground Jungle", "The Vault", "Frozen Vault" ] ],
		"112209": [ "hisii_hobo", [ "Koditonhiisi", "Hiisi Hobo" ], [ "Forest", "Hisii Base", "The Vault", "Frozen Vault", "Lake" ] ],
		"112210": [ "hisii_hobo_rich", [ "Rikashiisi", "Rich Hiisi" ], [ "Unsorted" ] ],
		"112211": [ "shaman_greater_apotheosis", [ "Suur-Märkiäinen", "Greater Swampling" ], [ "Fungal Caverns", "Overgrown Cavern" ] ],
		"112212": [ "blindgazer", [ "Sokeakatselija", "Blind Gazer" ], [ "The Vault", "Frozen Vault" ] ],
		"112213": [ "slime_leaker_weak", [ "Heikko Vuotavajaska", "Weak Leaking Slime" ], [ "Mines" ] ],
		"112214": [ "slime_leaker", [ "Vuotavajaska", "Leaking Slime" ], [ "Coal Pits", "The Vault" ] ],
		"112215": [ "slime_teleporter", [ "Säröilevä limanuljaska", "Warping Slime" ], [ "Unsorted" ] ],
		"112216": [ "goo_slug", [ "Liimanetana", "Glue Slug" ], [ "Mines", "Coal Pits", "The Vault" ] ],
		"112217": [ "poring", [ "Hyytelö", "Jelly" ], [ "Mines", "Coal Pits", "Desert", "Sandcave" ] ],
		"112218": [ "poring_lukki", [ "Lukkihyytelö", "Jelly Longlegs" ], [ "Unsorted" ] ],
		"112219": [ "poring_magic", [ "Lumottuhyytelö", "Magic Jelly" ], [ "Temple of the Art", "Wizards' Den", "Pyramid", "Magical Temple" ] ],
		"112220": [ "poring_devil", [ "Epäpyhähyytelö", "Unholy Jelly" ], [ "The Work (Hell)" ] ],
		"112221": [ "poring_holy", [ "Jumalallinenhyytelö", "Divine Jelly" ], [ "The Work (Sky)" ] ],
		"112222": [ "poring_holy_arch", [ "Korkeajumalallinenhyytelö", "High Divine Jelly" ], [ "The Work (Sky)" ] ],
		"112223": [ "blob_big", [ "Isomöykky", "Big Blob" ], [ "The Vault", "Fungal Caverns", "Overgrown Cavern" ] ],
		"112224": [ "blob_huge", [ "Kammottavamöykky", "Creepy Blob" ], [ "Overgrown Cavern" ] ],
		"112225": [ "ant_fire", [ "Tulimurkku", "Fire Ant" ], [ "Ant Nest" ] ],
		"112226": [ "ant_suffocate", [ "Tukahduttajamurkku", "Suffocating Ant" ], [ "Ant Nest" ] ],
		"112227": [ "ant_pheromone", [ "Sairaanhoitajamurkku", "Nursing Ant" ], [ "Ant Nest" ] ],
		"112228": [ "rat_birthday", [ "Juhlarotta", "Birthday Rat" ], [ "Forest" ] ],
		"112229": [ "ccc_bat_psychic", [ "Psyykkinenlepakko", "Psychic Bat" ], [ "Coal Pits" ] ],
		"112230": [ "mudman_friendly", [ "Mutamies", "Mudman" ], [ "Coal Pits" ] ],
		"112231": [ "ceiling_fungus", [ "Kattosieni", "Ceiling Fungus" ], [ "Fungal Caverns", "Overgrown Cavern" ] ],
		"112232": [ "poisonmushroom", [ "Myrkyllinensieni", "Poisonous Mushroom" ], [ "Underground Jungle", "Lukki Lair", "Overgrown Cavern" ] ],
		"112233": [ "fungus_smoking_creep", [ "Savuavasieni", "Smoking Fungus" ], [ "Overgrown Cavern" ] ],
		"112234": [ "lukki_fungus", [ "Revitty sieni", "Uprooted Fungus" ], [ "Fungal Caverns", "Overgrown Cavern" ] ],
		"112235": [ "hideous_mass", [ "Hirvittävämassa", "Hideous Mass" ], [ "Temple of the Art", "Pyramid" ] ],
		"112236": [ "tentacler_big", [ "Isoturso", "Big Tentacler" ], [ "The Vault", "Fungal Caverns", "Overgrown Cavern", "Temple of the Art" ] ],
		"112237": [ "longleg_pillar", [ "Kohoava Pilari-hämis", "Towering Pillar of Hamis" ], [ "Forest" ] ],
		"112238": [ "lukki_swarmling", [ "Nopealukki", "Swarmling Lukki" ], [ "Lukki Lair" ] ],
		"112239": [ "sunken_creature", [ "Sukelluskello", "Diving Bell" ], [ "Sunken Cavern" ] ],
		"112240": [ "lukki_fire_tiny", [ "Pikku Tulihämähäkki", "Tiny Fire Spider" ], [ "Core Mines" ] ],
		"112241": [ "lukki_fire_miniboss", [ "Nuori Tulihämähäkki", "Juvenile Fire Spider" ], [ "Core Mines" ] ],
		"112242": [ "giant_centipede", [ "Nuori Tuhatjalkainen", "Juvenile Centipede" ], [ "Underground Jungle" ] ],
		"112243": [ "locust_swarm", [ "Heinäsirkka", "Locust Swarm" ], [ "Underground Jungle", "Pyramid", "Desert" ] ],
		"112244": [ "devourer_magic", [ "Taikainen syöjä", "Magic Devourer" ], [ "Underground Jungle", "Sandcave", "Snowy Chasm", "Temple of the Art", "Pyramid", "Ancient Laboratory" ] ],
		"112245": [ "seeker", [ "Etsijä", "Seeker" ], [ "Power Plant" ] ],
		"112246": [ "miniboss_pit_02", [ "Wandsin Arvostelija", "Appreciator of Wands" ], [ "Sunken Cavern", "Temple of Sacrilegious Remains" ] ],
		"112247": [ "star_child", [ "Tähtilapsi", "Star Child" ], [ "Temple of the Art", "The Work (Sky)" ] ],
		"112248": [ "worm_wall", [ "Seinätoukka", "Wall Worm" ], [ "The Laboratory" ] ],
		"112249": [ "worm_maggot_big", [ "Pieni Limatoukka", "Small Slimy Maggot" ], [ "Meat Realm" ] ],
		"112250": [ "worm_end_big_apotheosis", [ "Suur-Helvetinmato", "Greater Hell Worm" ], [ "The Work (Hell)" ] ],
		"112251": [ "worm_mechanical", [ "Mekaaninenmato", "Mechanical Worm" ], [ "The Vault" ] ],
		"112252": [ "worm_spine", [ "Kirottuselkäranka", "Cursed Spine" ], [ "Temple of Sacrilegious Remains"  ] ],
		"112253": [ "drone_status_ailment", [ "Parannuskeinolennokki", "Ailment Drone" ], [ "The Vault", "Fungal Caverns", "Frozen Vault" ] ],
		"112254": [ "drone_mini", [ "Pieni Lennokki", "Mini Drone" ], [ "Hiisi Base", "The Vault", "Frozen Vault", "Power Plant" ] ],
		"112255": [ "gazer_robot", [ "Aluebotti", "Zoner" ], [ "Power Plant" ] ],
		"112256": [ "tesla_turret", [ "Teslatötterö", "Tesla Turret" ], [ "Hiisi Base", "Snowy Depths", "Desert", "Power Plant" ] ],
		"112257": [ "c_basebot_speeder_apotheosis", [ "Johtaja", "Manager" ], [ "Power Plant" ] ],
		"112258": [ "tank_flame_apotheosis", [ "Sytytystankki", "Ignition Tank" ], [ "Hiisi Base", "The Vault", "Frozen Vault" ] ],
		"112259": [ "waterskull", [ "Vesiö", "Water Spirit" ], [ "Ant Nest", "Forest" ] ],
		"112260": [ "wizard_firemage_greater", [ "Suur-Stendari", "Greater Fire Mage" ], [ "Wizards' Den", "The Works (Hell)" ] ],
		"112261": [ "watermage", [ "Vesimagi", "Water Mage" ], [ "Mines", "Temple of the Art", "Sunken Cavern" ] ],
		"112262": [ "watermage_greater", [ "Suur-Vesimagi", "Greater Water Mage" ], [ "Sunken Cavern" ] ],
		"112263": [ "barfer_greater_apotheosis", [ "Suur-Turvonnu velho", "Greater Barfer" ], [ "Unsorted" ] ],
		"112264": [ "wizard_ambrosia", [ "Kuolemattomuudenmestari", "Master of Immortality" ], [ "Wizards' Den" ] ],
		"112265": [ "wizard_copeseethmald", [ "Uistelunmestari", "Master of Trolling" ], [ "Desert Chasm", "Fungal Caverns" ] ],
		"112266": [ "wizard_duck", [ "Sinisorsienmestari", "Master of Mallards" ], [ "Temple of the Art", "Wizards' Den", "Ancient Laboratory" ] ],
		"112267": [ "enchanted_duck", [ "Lumottu ankka", "Enchanted Duck" ], [ "Temple of the Art", "Wizards' Den", "Ancient Laboratory" ] ],
		"112268": [ "wizard_explosive", [ "Räjähteidenmestari", "Master of Explosives" ], [ "Wizards' Den" ] ],
		"112269": [ "wizard_jackofalltrades", [ "Eimitäänmestari", "Master of None" ], [ "The Vault", "Wizards' Den", "Underground Jungle", "Lukki lair" ] ],
		"112270": [ "wizard_manaeater", [ "Mananmestari", "Master of Mana" ], [ "Temple of the Art", "Wizards' Den", "Pyramid", "Ancient Laboratory", "Magical Temple" ] ],
		"112271": [ "wizard_transmutation", [ "Transmutaatioidenmestari", "Master of Transmutation" ], [ "The Vault", "Wizards' Den", "Lukki lair", "Overgrown Cavern",  ] ],
		"112272": [ "wizard_z_poly_miniboss", [ "Yli-innokas Muudonmuutosmestari", "Overzealous Master of Polymorphing" ], [ "Wizards' Den", "Temple of the Art" ] ],
		"112273": [ "wizard_corrupt_wands", [ "Nukketeatterinmestari", "Master of Puppets" ], [ "Temple of Sacrilegious Remains" ] ],
		"112274": [ "wizard_corrupt_ambrosia", [ "Korruptoitunut Kuolemattomuudenmestari", "Corrupt Master of Immortality" ], [ "Temple of Sacrilegious Remains" ] ],
		"112275": [ "wizard_corrupt_returner", [ "Korruptoitunut Palauttajamestari", "Corrupt Master of Returning" ], [ "Temple of Sacrilegious Remains" ] ],
		"112276": [ "wizard_corrupt_hearty", [ "Korruptoitunut Haavoittajamestari", "Corrupt Master of Wounding" ], [ "Temple of Sacrilegious Remains" ] ],
		"112277": [ "wizard_corrupt_manaeater", [ "Korruptoitunut Mananmestari", "Corrupt Master of Mana" ], [ "Temple of Sacrilegious Remains" ] ],
		"112278": [ "wizard_corrupt_neutral", [ "Korruptoitunut Maadoittajamestari", "Corrupt Master of Grounding" ], [ "Temple of Sacrilegious Remains" ] ],
		"112279": [ "wizard_corrupt_swapper", [ "Korruptoitunut Vaihdosmestari", "Corrupt Master of Exchange" ], [ "Temple of Sacrilegious Remains" ] ],
		"112280": [ "wizard_corrupt_teleport", [ "Korruptoitunut Siirtäjämestari", "Corrupt Master of Teleportation" ], [ "Temple of Sacrilegious Remains" ] ],
		"112281": [ "wizard_corrupt_twitchy", [ "Korruptoitunut Sätkymestari", "Corrupt Master of Twitching" ], [ "Temple of Sacrilegious Remains" ] ],
		"112282": [ "wizard_corrupt_weaken", [ "Korruptoitunut Turvattomuusmestari", "Corrupt Master of Vulnerability" ], [ "Temple of Sacrilegious Remains" ] ],
		"112283": [ "lukki_tentacle_hungry", [ "Kirottuolento", "Cursed Being" ], [ "Temple of Sacrilegious Remains" ] ],
		"112284": [ "flesh_wizard_wands", [ "Kirottu Nukketaiteilija", "Cursed Puppeteer" ], [ "Temple of Sacrilegious Remains" ] ],
		"112285": [ "flesh_wizard_manaeater", [ "Kirottu Manavampyyri", "Cursed Manasapper" ], [ "Temple of Sacrilegious Remains" ] ],
		"112286": [ "flesh_wizard_neutral", [ "Kirottu Neutraloija", "Cursed Grounder" ], [ "Temple of Sacrilegious Remains" ] ],
		"112287": [ "flesh_wizard_swapper", [ "Kirottu Korvaaja", "Cursed Swapper" ], [ "Temple of Sacrilegious Remains" ] ],
		"112288": [ "flesh_wizard_twitchy", [ "Kirottu Sätkijä", "Cursed Twitcher" ], [ "Temple of Sacrilegious Remains" ] ],
		"112289": [ "wraith_weirdo_shield", [ "Härö", "Weirdo" ], [ "Temple of the Art", "The Vault", "Sandcave" ] ],
		"112290": [ "wraith_returner_apotheosis", [ "Heijastava Härö", "Reflective Weirdo" ], [ "Temple of the Art", "Pyramid", "The Work (Sky)" ] ],
		"112291": [ "wraith_alchemy_apotheosis", [ "Alkeeminen Härö", "Alchemic Weirdo" ], [ "Temple of Sacrilegious Remains" ] ],
		"112292": [ "whisp", [ "Virvatuli", "Will o' the whisp" ], [ "Coal Pits", "Core Mines", "Sandcave" ] ],
		"112293": [ "whisp_big", [ "Jättivirvatuli", "Giant Will o' the whisp" ], [ "Core Mines", "The Tower" ] ],
		"112294": [ "whisp_giga", [ "Kolossaalinenvirvatuli", "Colossal Will o' the whisp" ], [ "Unsorted" ] ],
		"112295": [ "fairy_cheap", [ "Keiju", "Fairy" ], [ "Mines", "Coal Pits", "Underground Jungle" ] ],
		"112296": [ "fairy_big", [ "Jättikeiju", "Giant Fairy" ], [ "Coal Pits", "Underground Jungle" ] ],
		"112297": [ "fairy_giant", [ "Kolossaalinenkeiju", "Colossal Fairy" ], [ "Unsorted" ] ],
		"112298": [ "fairy_big_discord", [ "Jättiristiriitakeiju", "Giant Discord Fairy" ], [ "Temple of the Art", "The Work (Sky)", "Sandcave" ] ],
		"112299": [ "fairy_esoteric", [ "Esoteerinenpäiväuni", "Esoteric Fairy" ], [ "Temple of the Art" ] ],
		"112300": [ "esoteric_being", [ "Esoteerinenolento", "Esoteric Being" ], [ "Temple of the Art", "Magical Temple" ] ],
		"112301": [ "worm_esoteric", [ "Esoteerinenmato", "Esoteric Worm" ], [ "Unsorted" ] ],
		"112302": [ "musical_being", [ "Kuulumaton", "Unheard" ], [ "Pyramid", "Snowy Chasm", "Sandcave" ] ],
		"112303": [ "musical_being_weak", [ "Hiljainen", "Quiet" ], [ "Snowy Chasm" ] ],
		"112304": [ "phantom_c_apotheosis", [ "Pakkomielteinenkalma", "Obsessive Phantom" ], [ "Unsorted" ] ],
		"112305": [ "devourer_ghost", [ "Nälkäinenaave", "Devouring Phantom" ], [ "Temple of the Art", "Magical Temple", "Pyramid" ] ],
		"112306": [ "ghost_bow", [ "Haamujousi", "Phantom Bow" ], [ "Magical Temple" ] ],
		"112307": [ "forsaken_eye", [ "Hylättysilmä", "Forsaken Eye" ], [ "Snowy Depths", "Snowy Chasm", "Wizards' Den" ] ],
		"112308": [ "spirit_healing", [ "Parantava-Aave", "Healing Spirit" ], [ "Pyramid", "Coal Pits" ] ],
		"112309": [ "gazer_greater", [ "Suur-Helvetinkatse", "Greater Hell Gazer" ], [ "The Work (Hell)" ] ],
		"112310": [ "gazer_greater_sky", [ "Suur-Taivaankatse", "Greater Sky Gazer" ], [ "The Work (Sky)" ] ],
		"112311": [ "gazer_cold_apotheosis", [ "Jäänkatse", "Cold Gazer" ], [ "Snowy Depths", "Snowy Chasm" ] ],
		"112312": [ "gazer_greater_cold", [ "Suur-Jäänkatse", "Greater Cold Gazer" ], [ "Snowy Depths", "Snowy Chasm" ] ],
		"112313": [ "gazer_parasitic", [ "Parasiittinenkatse", "Parasitic Gazer" ], [ "Virulent Caverns" ] ],
		"112314": [ "sentry", [ "Vartiomies", "Sentry" ], [ "The Vault", "The Work (Hell)", "Frozen Vault", "Snowy Depths" ] ],
		"112315": [ "triangle_gem", [ "Kolmionmuotoinenkristalli", "Triangular Gem" ], [ "Temple of the Art", "Sandcave" ] ],
		"112316": [ "mimic_explosive_box", [ "Räjähdysherkkämatkija", "Explosive Box Mimic" ], [ "Mines", "Coal Pits", "The Vault", "Hiisi Base" ] ],
		"112317": [ "snowman", [ "Lumiukko", "Snowman" ], [ "Snowy Depths" ] ],
		"112318": [ "mimic_perk_twwe", [ "Paskiainen", "Tinker With Wands Everywhere Mimic" ], [ "Coal Pits Holy Mountain" ] ],
		"112319": [ "hiisi_chef_hell", [ "Hornakokkihiisi", "Hell Chef" ], [ "The Work (Hell)" ] ],
		"112320": [ "boss_toxic_worm_parallel", [ "Madon Muisti", "Worm Memory" ], [ "Coal Pits" ] ],
		"112321": [ "boss_toxic_worm", [ "Jättimäinenmyrkkymato", "Giant Toxic Worm" ], [ "Coal Pits" ] ],
		"112322": [ "boss_toxic_worm_minion", [ "Myrkyllinenmato", "Toxic Worm" ], [ "Coal Pits" ] ],
		"112323": [ "boss_musical_ghost", [ "Hylättyorkesteri", "Abandoned Orchestra" ], [ "Sandcave" ] ],
		"112324": [ "blob_titan", [ "Kolossaalimöykky", "Colossal Blob" ], [ "Overgrown Cavern" ] ],
		"112325": [ "boss_fire_lukki", [ "Tulen Esteetikko", "Aesthete of Heat" ], [ "Lava Lake" ] ],
		"112326": [ "boss_flesh_monster", [ "Kerettiläinenhirviö", "Heretical Monster" ], [ "Temple of Sacrilegious Remains" ] ],
		"112327": [ "forest_monolith", [ "Monoliitti", "Monolith" ], [ "Forest" ] ],
	}
};

var trackerData = {
	regions: {},
	locationIds: {},
	locationRules: {
		"bosses": [110670, 110649, 110651, 110669, 110656, 110650, 110648, 110652, 110655, 110657, 110653, 110647, 110671, 110646, 110654],
	}
};

function bindSocketEv(AP) {
	if (AP.ws == null) { return; }
	AP.ws.onmessage = function(ev) {
		var evData = JSON.parse(ev.data);
		console.log(evData);
		for (var i = 0; i < evData.length; i++) {
			var cmd = evData[i]?.cmd;
			
			switch (cmd) {
				case "RoomInfo":
					APSendPacket(AP, "GetDataPackage");
					break;
				case "DataPackage":
					AP.dataPackage = evData[i].data.games["Noita-Killsanity"];
					parseLocationSet(AP.dataPackage?.location_name_to_id);
					APSendPacket(AP, "Connect");
					break;
				case "Connected":
					APAddChecked(AP, evData[i].checked_locations);
					APAddMissing(AP, evData[i].missing_locations);
					updateViews();
					break;
				case "RoomUpdate":
					APAddChecked(AP, evData[i].checked_locations);
					APAddMissing(AP, evData[i].missing_locations);
					updateViews();
					break;
			}
		}
	}
}

function APAddChecked(AP, checked_list) {
	if (!Array.isArray(checked_list)) { return; }
	for (var i = 0; i < checked_list.length; i++) {
		if (AP.locations.checked.indexOf(checked_list[i]) == -1) {
			AP.locations.checked.push(checked_list[i]);
		}
	}
}

function APAddMissing(AP, missing_list) {
	if (!Array.isArray(missing_list)) { return; }
	for (var i = 0; i < missing_list.length; i++) {
		if (AP.locations.missing.indexOf(missing_list[i]) == -1) {
			AP.locations.missing.push(missing_list[i]);
		}
	}
}

function APSendGetDataPackage(AP, frame) {
	frame[0].games = ["Noita-Killsanity"];
	AP.ws.send(JSON.stringify(frame));
}

function APSendPacket(AP, type) {
	
	var frame = [{
		cmd: type,
	}];
	
	switch (type) {
		case "GetDataPackage":
			APSendGetDataPackage(AP, frame);
			break;
		case "Connect":
			APLogin(AP, frame);
			break;
	}
}

function showTooltip(loc_id, type = "kill") {
	var tooltip = document.querySelector("#killlist-tooltip");
	tooltip.querySelector("h4").innerText = AP.locationMap[loc_id][1][0];
	if (type == "kill") {
		tooltip.querySelector("a").href = "https://noita.wiki.gg/wiki/" + AP.locationMap[loc_id][1][0];
		tooltip.querySelector("a").style.display = "inline";
	} else {
		tooltip.querySelector("a").style.display = "none";
	}
	tooltip.querySelector("article").innerText = AP.locationMap[loc_id][2].join(", ");
	
	tooltip.showPopover();
}

function rebuildViews() {
	
	function killLoc(region, loc) {
		if (document.querySelector("#kill-" + loc.id) != null) { return; }
		
		var imgKey = AP.locationMap[loc.id][0];
		
		var wrap = document.createElement("button");
		wrap.id = "kill-" + loc.id;
		wrap.dataset['locationId'] = loc.id;
		wrap.className = "location-check kill-icon";
		wrap.innerHTML = '<img src="animal_icons/' + imgKey + '.png">';
		
		document.querySelector("#noita-killlist>.location-container").append(wrap);
		
		wrap.addEventListener('click', function() { showTooltip(loc.id); });
	}
	
	function genericLoc(region, loc) {
		var regionWrap = document.querySelector("#noita-map-" + region.name.replaceAll(" ", "_").replaceAll(/[^A-z_]/g, ""));
		
		if (regionWrap == null) {
			regionWrap = document.createElement("div");
			regionWrap.id = "noita-map-" + region.name.replaceAll(" ", "_").replaceAll(/[^A-z_]/g, "");
			regionWrap.innerHTML = '<h6>' + region.name + "</h6><section><div></div></section>";
			regionWrap.className = "region-check";
			document.querySelector("#noita-map .location-container").append(regionWrap);
		}
		
		var wrap = regionWrap.querySelector("div");
		
		var check = document.createElement("button");
		check.id = loc.type + "-" + loc.id;
		check.dataset['locationId'] = loc.id;
		check.className = "location-check generic-icon";
		if (loc.type == "chest") {
			check.innerHTML = '<img src="animal_icons/stash.png">';
		} else if (loc.type == "pedestal") {
			check.innerHTML = '<img src="animal_icons/potion.png">';
		} else if (loc.type == "refresh") {
			check.innerHTML = '<img src="animal_icons/shaman_wind.png">';
		} else if (loc.type == "shop") {
			check.innerHTML = '<img src="animal_icons/extra_shop_item.png">';
		}
		
		wrap.append(check);
	}
	
	function forgeLoc(region, loc) {
		var regionWrap = document.querySelector("#noita-map-forges");
		
		if (regionWrap == null) {
			regionWrap = document.createElement("div");
			regionWrap.id = "noita-map-forges";
			regionWrap.innerHTML = '<h6>Anvil Forges</h6><section><div></div></section>';
			regionWrap.className = "region-check";
			document.querySelector("#noita-map .location-container").append(regionWrap);
		}
		
		var wrap = regionWrap.querySelector("div");
		
		var check = document.createElement("button");
		check.id = loc.type + "-" + loc.id;
		check.dataset['locationId'] = loc.id;
		check.className = "location-check generic-icon";
		
		if (loc.name.indexOf("Broken Wand") > -1) {
			check.innerHTML = '<img src="animal_icons/broken_wand.png">';
		} else if (loc.name.indexOf("Portal Spell") > -1) {
			check.innerHTML = '<img src="animal_icons/broken_spell.png">';
		} else {
			check.innerHTML = '<img src="animal_icons/emerald_tablet.png">';
		}
		
		wrap.append(check);
		
		check.addEventListener('click', function() { showTooltip(loc.id, "forge"); });
	}
	
	Object.values(trackerData.regions).forEach(function(region, ri) {
		region.getLocations("kill").forEach(function(loc) {
			killLoc(region, loc);
		});
		region.getLocations("refresh").forEach(function(loc) {
			genericLoc(region, loc);
		});
		region.getLocations("shop").forEach(function(loc) {
			genericLoc(region, loc);
		});
		region.getLocations("chest").forEach(function(loc) {
			genericLoc(region, loc);
		});
		region.getLocations("pedestal").forEach(function(loc) {
			genericLoc(region, loc);
		});
		region.getLocations("boss").forEach(function(loc) {
			killLoc(region, loc);
		});
		region.getLocations("forge").forEach(function(loc) {
			forgeLoc(region, loc);
		});
	});
	
	updateViews();
}

function updateViews() {
	for (var i = 0; i < AP.locations.missing.length; i++) {
		var locId = AP.locations.missing[i];
		document.querySelectorAll(".location-check[data-location-id='" + locId + "']").forEach(function(el) {
			el.classList.add("location-valid");
		});
	}
	
	for (var i = 0; i < AP.locations.checked.length; i++) {
		var locId = AP.locations.checked[i];
		document.querySelectorAll(".location-check[data-location-id='" + locId + "']").forEach(function(el) {
			el.classList.add("location-valid");
			el.classList.add("location-checked");
		});
	}
	
	var totalChecks = document.querySelectorAll("#noita-killlist .location-valid").length;
	var checked = document.querySelectorAll("#noita-killlist .location-valid.location-checked").length;
	
	document.querySelectorAll("#noita-killlist-stats span").forEach(function(el, i) {
		if (i == 0) {
			el.innerText = checked;
		} else {
			el.innerText = totalChecks;
		}
	});
	
}

function parseLocationSet(locations) {
	Object.entries(locations).forEach(function(locData, i) {
		var key = locData[0];
		var locationId = locData[1];
		
		var region = "Unsorted";
		var type = "Unsorted";
		
		if (key.endsWith(" Orb")) {
			type = "static";
			region = key.replace(" Orb", "");
		} else if (key.startsWith("Kill ")) {
			type = "kill";
		} else if (key.startsWith("Forge ")) {
			type = "forge";
		} else if (key.search(/ chest \d+/i) > -1) {
			type = "chest";
			region = key.replace(/ chest \d+/i, "");
		} else if (key.search(/ pedestal \d+/i) > -1) {
			type = "pedestal";
			region = key.replace(/ pedestal \d+/i, "");
		} else if (key.search(/ shop item \d+/i) > -1) {
			type = "shop";
			region = key.replace(/ shop item \d+/i, "");
		} else if (key.search(/ spell refresh/i) > -1) {
			type = "refresh";
			region = key.replace(/ spell refresh/i, "");
		} else if (trackerData.locationRules.bosses.indexOf(locationId) > -1) {
			type = "boss";
		}
		
		if (region == "Secret") { region = "Secret Shop"; }
		
		if (!trackerData.regions.hasOwnProperty(region)) {
			trackerData.regions[region] = new Region(region);
		}
		trackerData.regions[region].addLocation(locationId, type, key);
	});
	
	rebuildViews();
}

function bindButtons() {
	document.querySelector("#ap-connect-show").addEventListener('click', function() { APConnectDialog(); });
	document.querySelector("#ap-connect-dialog>form").addEventListener('submit', function(e) { e.preventDefault(); APConnect(e); });
}

function APLogin(AP, frame) {
	frame[0].password = null;
	frame[0].name = AP.slotname;
	frame[0].game = "Noita-Killsanity";
	frame[0].uuid = "A" + Math.random();
	frame[0].tags = ["Tracker", "NoText"];
	frame[0].version = {major: 0, minor: 6, build: 1, class: "Version"};
	frame[0].items_handling = 7;
	frame[0].slotData = true;
	AP.ws.send(JSON.stringify(frame));
}

function APConnect(ev) {
	var serv = ev.target.querySelector("[name='ap-host']").value;
	var slot = ev.target.querySelector("[name='ap-slot']").value;
	var pass = ev.target.querySelector("[name='ap-pass']").value;
	
	AP.ws = new WebSocket("wss://" + serv);
	AP.server = serv;
	AP.slotname = slot;
	AP.password = pass;
	
	bindSocketEv(AP);
	document.querySelector("#ap-connect-dialog").hidePopover();
}

function APConnectDirect(ev) {
	var serv = "localhost:38281";
	var slot = "Player1";
	var pass = "";
	
	AP.ws = new WebSocket("wss://" + serv);
	AP.server = serv;
	AP.slotname = slot;
	AP.password = pass;
	
	bindSocketEv(AP);
	document.querySelector("#ap-connect-dialog").hidePopover();
}

function APConnectDialog() {
	document.querySelector("#ap-connect-dialog").showPopover();
}

document.addEventListener('DOMContentLoaded', function() {
	bindButtons();
});