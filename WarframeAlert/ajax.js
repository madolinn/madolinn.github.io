ajax = {};


ajax.getAlerts = function() {
	$.getJSON("http://query.yahooapis.com/v1/public/yql",
		{
			q: " select * from json where url=\"http://content.warframe.com/dynamic/worldState.php?fmt=JSON\"",
			format: "json"
		},
	function(data) {
		ajax.parseData(data);
	});

}

ajax.parseData = function(data) {

	for (var i = 0; i < data.query.results.json.Alerts.length; i++) {
		parse.parseAlert(data.query.results.json.Alerts[i]);
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