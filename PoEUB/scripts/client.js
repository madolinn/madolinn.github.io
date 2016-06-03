var maingems = ["Abyssal Cry",
"Ancestral Protector",
"Animate Guardian",
"Cleave",
"Dominating Blow","Earthquake","Flame Totem","Glacial Hammer",
"Ground Slam",
"Heavy Strike",
"Ice Crash",
"Infernal Blow",
"Leap Slam",
"Molten Shell",
"Molten Strike",
"Reckoning",
"Searing Bond",
"Shield Charge",
"Shockwave Totem",
"Static Strike",
"Summon Flame Golem",
"Summon Stone Golem",
"Sunder",
"Sweep",
"Vengeance",
"Vigilant Strike",
"Animate Weapon",
"Barrage",
"Bear Trap",
"Blade Vortex",
"Bladefall",
"Blast Rain",
"Blink Arrow",
"Burning Arrow",
"Caustic Arrow",
"Cyclone",
"Desecrate",
"Detonate Dead",
"Double Strike",
"Dual Strike",
"Elemental Hit",
"Ethereal Knives",
"Explosive Arrow",
"Fire Trap",
"Flicker Strike",
"Freeze Mine",
"Frenzy",
"Frost Blades",
"Ice Shot",
"Ice Trap",
"Lightning Arrow",
"Lightning Strike",
"Mirror Arrow",
"Phase Run",
"Puncture",
"Rain of Arrows",
"Reave",
"Riposte",
"Shrapnel Shot",
"Siege Ballista",
"Smoke Mine",
"Spectral Throw",
"Split Arrow",
"Summon Ice Golem",
"Tornado Shot",
"Viper Strike",
"Whirling Blades",
"Wild Strike",
"Ancestral Warchief",
"Arc",
"Arctic Breath",
"Ball Lightning",
"Cold Snap",
"Contagion",
"Conversion Trap",
"Discharge",
"Essence Drain",
"Fire Nova Mine",
"Fireball",
"Firestorm",
"Flame Dash",
"Flame Surge",
"Flameblast",
"Freezing Pulse",
"Frost Bomb",
"Frost Wall",
"Frostbite",
"Frostbolt",
"Glacial Cascade",
"Ice Nova",
"Ice Spear",
"Incinerate",
"Kinetic Blast",
"Lacerate",
"Lightning Tendrils",
"Lightning Trap",
"Lightning Warp",
"Magma Orb",
"Orb of Storms",
"Power Siphon",
"Raise Spectre",
"Raise Zombie",
"Righteous Fire",
"Shock Nova",
"Spark",
"Storm Call",
"Summon Chaos Golem",
"Summon Lightning Golem",
"Summon Raging Spirit",
"Summon Skeletons",
"Tempest Shield",
"Vortex"];

var supgems = ["Anger",
"Decoy Totem",
"Devouring Totem",
"Determination",
"Enduring Cry",
"Herald of Ash",
"Immortal Call",
"Punishment",
"Purity of Fire",
"Rallying Cry",
"Rejuvenation Totem",
"Vitality",
"Warlord's Mark",
"Arctic Armour",
"Blood Rage",
"Grace",
"Haste",
"Hatred",
"Herald of Ice",
"Poacher's Mark",
"Projectile Weakness",
"Purity of Ice",
"Temporal Chains",
"Assassin's Mark",
"Bone Offering",
"Clarity",
"Conductivity",
"Convocation",
"Discipline",
"Elemental Weakness",
"Enfeeble",
"Flammability",
"Flesh Offering",
"Herald of Thunder",
"Purity of Elements",
"Purity of Lightning",
"Spirit Offering",
"Vulnerability",
"Wither",
"Wrath"];

var keystones = ["Acrobatics",
"Ancestral Bond",
"Arrow Dancing",
"Avatar of Fire",
"Blood Magic",
"Chaos Inoculation",
"Conduit",
"Eldritch Battery",
"Elemental Equilibrium",
"Elemental Overload",
"Ghost Reaver",
"Iron Grip",
"Iron Reflexes",
"Mind Over Matter",
"Minion Instability",
"Necromantic Aegis",
"Pain Attunement",
"Phase Acrobatics",
"Point Blank",
"Resolute Technique",
"Unwavering Stance",
"Vaal Pact",
"Zealot's Oath"];

var chosengems = [];

moduLoad.ready = function() {

	randomgem(maingems);
	
	var r = 4;
	while ((Math.random()*r) <= 4) {
		randomgem();
		r*=2;
	}
	
	randomgem(keystones)
	
	for (var i = 0; i < chosengems.length; i++) {
		$("#wrapper").append($("<div>", { class : "gem "+chosengems[i].color, html : "<a href = 'http://pathofexile.gamepedia.com/"+chosengems[i].linkname+"'>"+chosengems[i].name+"</a></div>"}));
	}
	
	
}

randomgem = function(type) {
	
	type = type || supgems;
	
	if (type == keystones) {
		if (Math.random()*10 < 5) { return; }
	}
	
	var gem = {};
	
	gem.type = type;
	gem.id = Math.floor(Math.random()*type.length);
	gem.name = type[gem.id];
	gem.linkname = gem.name.replace("/ /g","_");
	
	gem.color = "blue";
	if (type == supgems) {
		if (gem.id < 23) { gem.color = "green"; }
		if (gem.id < 13) { gem.color = "red"; }
	} else if (type == maingems) {
		if (gem.id < 65) { gem.color = "green"; }
		if (gem.id < 23) { gem.color = "red"; }
	} else {
		gem.color = "white";
	}
	
	chosengems.push(gem);
	
}