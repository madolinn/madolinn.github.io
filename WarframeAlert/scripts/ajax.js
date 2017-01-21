ajax = {};

ajax.getAlerts = function() {
	$.getJSON("http://query.yahooapis.com/v1/public/yql",
		{
			q: " select * from json where url=\"http://content.warframe.com/dynamic/worldState.php?fmt=JSON\"",
			format: "json"
		},
	function(data) {
		ajax.getRSS(data);
		//ajax.parseData(data);
	});

}

ajax.getRSS = function(alerts) {

	$.getJSON("http://query.yahooapis.com/v1/public/yql",
		{
			q: " select * from rss where url='http://content.warframe.com/alerts.xml'",
			format: "json"
		},
	function(rss) {
		ajax.parseData(alerts, rss);
	});

}

ajax.parseData = function(alerts, rss) {

	console.log(alerts, rss);

	var rssData = false;

	for (var i = 0; i < alerts.query.results.json.Alerts.length; i++) {
	
		for (var x = rss.query.results.item.length-1; x > -1; x--) {
		
			var ex = new Date(alerts.query.results.json.Alerts[i].Expiry.sec*1000);
			var exT = ex.toUTCString();
			exT = exT.substr(0,exT.length-4)+" +0000";
			
			if (exT == rss.query.results.item[x].expiry) {
				rssData = rss.query.results.item[x];
				break;
			}
		
		}
	
		parse.parseAlert(alerts.query.results.json.Alerts[i], rssData);
	}

}

	/*query : {
		count = 1,
		created = date,
		lang = "en-US",
		results.json : {
			ActiveMissions : [6][
				{
					Activation : {
						sec : "1484618941",
						usec : "934000"
					},
					Expiry : {
						sec : "1484624484"
						usec : 	"997000"
					},
					Modifier : "VoidT1",
					Node : "SolNode101",
					Region : "2",
					Seed : "58107"
					_id : { _id : "587d7cbd09ba97ea542dea0e" }
				}
			],
			Alerts : [4][
				{
					Activation : {
						sec : "1484618941",
						usec : "934000"
					},
					Expiry : {
						sec : "1484624484"
						usec : 	"997000"
					},
					MissionInfo : {
						difficulty : "0.81398855452675",
						enemySpec : "/Lotus/Types/Game/EnemySpecs/CorpusSurvivalA",
						faction : "FC_CORPUS",
						levelOverride : "/Lotus/Levels/Proc/Corpus/CorpusShipSurvivalRaid",
						location : "SolNode215",
						maxEnemyLevel :	"23",
						maxWaveNum : "10",
						minEnemyLevel : "21",
						missionReward : {
							countedItems : {
								ItemCount : "1",
								ItemType : "/Lotus/Types/Items/MiscItems/Alertium"
							}
							credits : "8300",
						},
						missionType : "MT_SURVIVAL",
						seed : 	"59709"
					}
				}
			]
		}
	}*/