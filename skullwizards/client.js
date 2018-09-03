'use strict';

var _g = { 

	classes : ["Fighter","Thief","Wizard","Priest","Barbarian","Paladin"],
	chosen : [],
	offsets : [],
	indexes : -1,
	players : [],
	encounterCooldown : 0
	
};

function start() {

	$("#buttonRandomize").click(function() { chooseIndexes(); });
	$("#buttonParse").click(function() { parsePlayers(); });
	$("#buttonConfigOut").click(function() { prompt("Current indexes", _g.chosen.join(",")); });
	$("#buttonConfigIn").click(function() { parseConfigIn(); });
	
	$("#buttonEncounter").click(function() { randomEncounter(); });
	$("#buttonMonster").click(function() { randomMonster(); });
	$("#buttonFork").click(function() { forkRandomize(); });
	$("#buttonShopkeeper").click(function() { shopkeeperRandomize(); });
	
	$(".shopkeeperEntryItem").click(function() { $(this).toggleClass("purchased").next().toggleClass("purchased"); });
	
	$("#buttonAddPlayer").click(function() { addPlayer(); });
	
	$("#buttonParse").addClass("disabledButton");
	
	$(document).on("mousedown",".playerSkill",function(e) { skillClicked(e); });

	populateDummies();

}

function randomMonster() {

	if (_g.encounterCooldown != 0) { return; }
	_g.encounterCooldown = 1;
	
	setTimeout(function() { _g.encounterCooldown = 0; },1000);
	
	$("#encounterCompleteIndicator").css("display","block");
	$("#encounterCompleteIndicator").fadeOut(1000);
	
	$("#encounterContainer").children(".encounter").css("display","none");
	
	$("#monsterContainer").css("display","block");
	
	var str = chooseRandomly.call(allWords("a"),false)[0].capitalize() + " " + chooseRandomly.call(allWords("m"),false)[0].capitalize() + " with the power of " + chooseRandomly.call(allWords("v"),false)[0].capitalize();
	
	$("#monsterName").text(str);
	
}

function randomEncounter() {

	if (_g.encounterCooldown != 0) { return; }
	_g.encounterCooldown = 1;
	setTimeout(function() { _g.encounterCooldown = 0; },1000);

	var encs = $("#encounterContainer").children(".encounter").length;
	
	$("#encounterCompleteIndicator").css("display","block");
	$("#encounterCompleteIndicator").fadeOut(1000);
	
	var r = Math.floor(Math.random()*encs);
	
	$("#monsterContainer").css("display","none");
	$("#encounterContainer").children(".encounter").css("display","none");
	$("#encounterContainer").children(".encounter").eq(r).css("display","block");
	$("#encounterContainer").children(".encounter").eq(r).children(".configHealth").children(".healthPoint").removeClass("healthPointDamaged").eq(parseInt($("#encounterContainer").children(".encounter").eq(r).children(".configHealth").attr("data-default"))-1).nextAll().addClass("healthPointDamaged");
	
	var reads = ["A $a Door","A Hazard","A $v Trap","A Split Path","TREASURE!","A Shopkeeper"];
	
	var str = reads[r];
	
	str = str.replace("$a",chooseRandomly.call(allWords("a"),false)[0]);
	str = str.replace("$v",chooseRandomly.call(allWords("v"),false)[0]);
	
	$("#encounterType").text(str);
	
	$(".shopkeeperEntryItem").text("-");
	$(".shopkeeperEntryCost").text("1G");
	
	$(".forkValue").text("-");
	
}

function forkRandomize() {

	$(".forkValue").eq(0).text("Passage of the "+chooseRandomly.call(allWords("n"),false)[0]);
	$(".forkValue").eq(1).text("Passage of the "+chooseRandomly.call(allWords("n"),false)[0]);

}

function shopkeeperRandomize() {

	var qual = $("#shopkeeperQuality").val();
	qual = parseInt(qual) || 0;
	qual = Math.max(-5,Math.min(qual,5));
	
	console.log(qual);
	
	var inv = 3;
	
	for (var i = 0; i < inv; i++) {
	
		var str = "";
		var base = 0;
		
		if (Math.random()*5 >= 4) {
		
			str += "(C) ";
			base--;
		
		}
		
		if (Math.random()*2 >= 1) {
		
			str += chooseRandomly.call(allWords("a"),false)[0].capitalize() + " ";
		
		}
		
		str += chooseRandomly.call(allWords("n"),false)[0].capitalize();
		
		if (Math.random()*2 >= 1) {
		
			str += " of "+chooseRandomly.call(allWords("v"),false)[0].capitalize();
			base++;
		
		}
		
		var iq = base + Math.floor(Math.random()*qual);
		
		if (iq >= 0) { str += "+"; }
		
		str += iq;
		
		var cost = Math.max(1,Math.min(4,Math.floor(Math.random()*iq)));
		
		$(".shopkeeperEntryItem").eq(i).text(str).removeClass("purchased");
		$(".shopkeeperEntryCost").eq(i).text(cost+"G").removeClass("purchased");
	
	}

}

function allWords(type) {

	var r = [];

	for (var i = 0; i < _g.players.length; i++) {
		if (_g.players[i][type] != undefined) {
			for (var e = 0; e < _g.players[i][type].length; e++) {
			
				r.push(_g.players[i][type][e]);
		
			}
		}
	}
	
	return r;

}

function parseConfigIn() {

	var p = prompt("Input custom indexes");
	
	if (p != null) {
	
		chooseIndexes();
	
		p = p.split(",");
		if (p.length == _g.chosen.length) {
		
			_g.chosen = p;
		
		}
	
	}

}

function addPlayer() {

	$(".playerEntry").eq(0).clone().appendTo("#playersContainer");

}

function skillClicked(e) {

	e.preventDefault();

	if (e.button == 1) { //Middle Click
	
		$(e.currentTarget).toggleClass("playerSkillProf");
	
	} else if (e.button == 2) {
	
		$(e.currentTarget).toggleClass("playerSkillDisabled");
	
	}

}

function parsePlayers() {

	$(".playerInput").each(function(i) {
	
		var arr = $(this).val().split(",");
		if (arr.length != _g.indexes) {
			$(this).css("border-color","#911");
			return;
		}
		var order = ["n","w","v","p","j","a","m","d"];
		
		var iterator = 0;
		
		_g.players[i] = {};
		
		for (var e = 0; e < order.length; e++) {
			for (var o = 0; o < _g.offsets[e]; o++) {
			
				if (_g.players[i][order[e]] == undefined) { _g.players[i][order[e]] = []; }
		
				if (order[e] == "d") { arr[iterator] = parseInt(arr[iterator]) || 0; }
				
				var elem = arr[iterator];
				
				if (typeof elem == "string") { elem = elem.trim(); }
		
				_g.players[i][order[e]].push(elem);
				iterator++;
			}
		}
		
		$(this).css("border-color","#555");
		
		console.log(i);
		
		updatePlayers(i);
	
	});

}

function updatePlayers(i) {

	(function() { $(this).text(_g.players[i].n[_g.chosen[0]].capitalize() + " " + _g.classes[_g.players[i].d[0]-1].capitalize()); }).call($(".playerClass").eq(i)[0]);
	(function() { $(this).text(_g.players[i].w[_g.chosen[1]].capitalize() + "-person") }).call($(".playerRace").eq(i)[0]);
	(function() { $(this).text(_g.players[i].p[_g.chosen[4]].capitalize() + " " + _g.players[i].j[_g.chosen[5]].capitalize()); }).call($(".playerEmployment").eq(i)[0]);
	(function() { $(this).text(_g.players[i].n[_g.chosen[2]].capitalize() + " of " + _g.players[i].v[_g.chosen[3]].capitalize()); }).call($(".playerWeapon").eq(i)[0]);
	
	(function() {
	
		$(this).children(".playerSkill").eq(0).val(_g.players[i].v[_g.chosen[6]].capitalize()+"+0").removeClass("playerSkillProf");
		$(this).children(".playerSkill").eq(1).val(_g.players[i].v[_g.chosen[7]].capitalize()+"+0").removeClass("playerSkillProf");
		$(this).children(".playerSkill").eq(2).val(_g.players[i].v[_g.chosen[8]].capitalize()+"+0").removeClass("playerSkillProf");
		
	}).call($(".playerSkillContainer").eq(i)[0]);

}

function createReadout() {

	$(".readoutValue").eq(0).text(_g.classes.join(", "));
	$(".readoutValue").eq(1).text("Noun #"+(_g.chosen[0]+1)+" + Class = Dice #1");
	$(".readoutValue").eq(2).text("Thing #"+(_g.chosen[1]+1));
	$(".readoutValue").eq(3).text("Personality #"+(_g.chosen[4]+1)+" + Job #"+(_g.chosen[5]+1));
	$(".readoutValue").eq(4).text("Noun #"+(_g.chosen[2]+1)+" + Verb #"+(_g.chosen[3]+1));
	$(".readoutValue").eq(5).text("Verb #"+(_g.chosen[6]+1)+", #"+(_g.chosen[7]+1)+", #"+(_g.chosen[8]+1));

}

function chooseIndexes() {

	$("#buttonParse").removeClass("disabledButton");

	var ranges = $(".configEntry > .configRange");
	
	console.log(ranges);
	
	_g.indexes = 0;
	
	ranges.each(function() { _g.indexes += parseInt(this.childNodes[1].textContent); });
	
	$("#indexesCount").text(_g.indexes);

	_g.offsets = [];
	
	var n = new Array(parseInt(ranges[0].childNodes[1].textContent));
	_g.offsets.push(n.length);
	var w = new Array(parseInt(ranges[1].childNodes[1].textContent));
	_g.offsets.push(w.length);
	var v = new Array(parseInt(ranges[2].childNodes[1].textContent));
	_g.offsets.push(v.length);
	var p = new Array(parseInt(ranges[3].childNodes[1].textContent));
	_g.offsets.push(p.length);
	var j = new Array(parseInt(ranges[4].childNodes[1].textContent));
	_g.offsets.push(j.length);
	var a = new Array(parseInt(ranges[5].childNodes[1].textContent));
	_g.offsets.push(a.length);
	var m = new Array(parseInt(ranges[6].childNodes[1].textContent));
	_g.offsets.push(m.length);
	//Dice Rolls are 1
	_g.offsets.push(1);
	
	//ORDER: CLASSNAME (NOUN), RACE (W), WEAPON (NOUN), + (VERB), BACKGROUND (P), + (JOB), SKILLS (V), + (V), + (V)
	
	_g.chosen[0] = chooseRandomly.call(n)[1];
	_g.chosen[1] = chooseRandomly.call(w)[1];
	_g.chosen[2] = chooseRandomly.call(n)[1];
	_g.chosen[3] = chooseRandomly.call(v)[1];
	_g.chosen[4] = chooseRandomly.call(p)[1];
	_g.chosen[5] = chooseRandomly.call(j)[1];
	_g.chosen[6] = chooseRandomly.call(v)[1];
	_g.chosen[7] = chooseRandomly.call(v)[1];
	_g.chosen[8] = chooseRandomly.call(v)[1];
	
	_g.classes.shuffle();
	
	createReadout();

}

function chooseRandomly(modify) {

	modify = (modify == undefined) ? true : false;
	
	var r = Math.floor(Math.random()*this.length);
	
	if (this[r] != "Picked") {
		var res = [this[r],r];
		if (modify) { this[r] = "Picked"; }
		return res;
	} else {
	
		var failSafe = 0;
	
		while (failSafe < 3) {
		
			r++;
			if (r >= this.length) { r = 0; failSafe++; }
			
			if (this[r] != "Picked") {
				var res = [this[r],r];
				if (modify) { this[r] = "Picked"; }
				return res;
			}
		
		}
	
	}
	
	return false;

}

function populateDummies() {

	$(".configRange").each(function() {
	
		$(this).text($(this).attr("data-min"));
		$("<span />", { class : "configRangeLess", text : "<" }).prependTo($(this));
		$("<span />", { class : "configRangeMore", text : ">" }).appendTo($(this));
	
	});

	$(document).on("click",".configRangeLess, .configRangeMore",function(e) { configRangeClicked.call(this,e); });
	
	$(".configHealth").each(function() {
	
		for (var i = 0; i < parseInt($(this).attr("data-max")); i++) {

			var e = $("<span />", { class : "healthPoint" }).appendTo($(this));
			
			if (i >= parseInt($(this).attr("data-default"))) {
			
				e.addClass("healthPointDamaged");
			
			}
			
			if (i >= (parseInt($(this).attr("data-softmax")) || 9)) {
			
				e.addClass("healthPointAbsent");
			
			}
		
		}		
	
	});
	
	$(document).on("mousedown",".healthPoint",function(e) { healthPointClicked.call(this,e); });
}

function healthPointClicked(e) {

	var cla = "healthPointDamaged";

	if (e.button != 0) {
		e.preventDefault();
	}
	
	if (e.button == 1) {
		cla = "healthPointAbsent";
	}
	
	$(this).toggleClass(cla);
	
	var has = $(this).hasClass(cla);
	
	if (!has) {
		$(this).prevAll().removeClass(cla);
		if (cla = "healthPointDamaged") {
			$(this).removeClass("healthPointAbsent").prevAll().removeClass("healthPointAbsent");
		}
	} else {
		$(this).nextAll().addClass(cla);
	}

}

function configRangeClicked(e) {

	if (this.className == "configRangeLess") {
	
		this.nextSibling.textContent = Math.max(parseInt(this.parentNode.dataset.min),parseInt(this.nextSibling.textContent)-1);
		$("#buttonParse").addClass("disabledButton");
	
	} else {
	
		this.previousSibling.textContent = Math.min(parseInt(this.parentNode.dataset.max),parseInt(this.previousSibling.textContent)+1);
		$("#buttonParse").addClass("disabledButton");
	
	}
	
}

Array.prototype.shuffle = function() {

	var temp = this.slice();
	
	for (var i = 0; i < this.length; i++) {
	
		this[i] = chooseRandomly.call(temp)[0];
	
	}

}

String.prototype.capitalize = function() {

	return this.substr(0,1).toUpperCase() + this.substr(1).toLowerCase();

}

$(function() {

	start();

});

