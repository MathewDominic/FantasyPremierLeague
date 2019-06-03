var allInfo = "https://fantasy.premierleague.com/drf/bootstrap-static";
var id = "107827";  // Login to fantasy and click on points tab. Replace this variable with id u find in the url
var sorted_players = [];
$.get(allInfo, function(allInfo) {
	var all_players = allInfo["elements"];
	var players = {};
	var gw_players = [];
	
	var j = 0;
	var lastWeek = 38;  // Change value to last game week value
	function fetchNextGw() {
		j++;
		var uri="https://fantasy.premierleague.com/drf/entry/" + id + "/event/" + j.toString() + "/picks"

		$.get(uri, function(data) {
		    for(var i in data["picks"]) {
		    	// console.log("players",data["picks"][i]["element"]);
		    	gw_players.push(data["picks"][i]["element"]);
		    	if(!(data["picks"][i]["element"] in players)) {
		    		players[data["picks"][i]["element"]] = { "points":0, "num_of_appearances":1, "gameweeks_in_team": [j]};
		    	} else {
		    		players[data["picks"][i]["element"]]["num_of_appearances"]++;
					players[data["picks"][i]["element"]]["gameweeks_in_team"].push(j)	
		    	}
		    }
		    var uri2="https://fantasy.premierleague.com/drf/event/" + j.toString() + "/live"
		    console.log("\nGameweek " + j.toString() + "\n");
			$.get(uri2, function(data2) {
				for(var i in gw_players) {
					var filter = $.grep(all_players, function(ele) { return ele.id==gw_players[i]; });
					players[gw_players[i]]["points"] += data2["elements"][gw_players[i]]["stats"]["total_points"];
		        	console.log(filter[0]["web_name"],data2["elements"][gw_players[i]]["stats"]["total_points"]);
		        }
		        if(j < lastWeek) {   
		        	gw_players = [];
		        	setTimeout(fetchNextGw, 500);
		        }
		        else {
		        	for(var player in players) {
		        		var filter = $.grep(all_players, function(ele) { return ele.id==parseInt(player); });
		        		players[player]["avg_points"] = players[player]["points"]/players[player]["num_of_appearances"];
		        		sorted_players.push({"Name":filter[0]["web_name"],"Total Points earned for u":players[player]["points"],"No of times in team":players[player]["num_of_appearances"],"Avg score":players[player]["avg_points"], "Gameweek Appearences": players[player]["gameweeks_in_team"]});
		        	}
		        	sorted_players.sort(function(a,b) { 
		        		return b["Avg score"]-a["Avg score"]; // Change "Avg score" to "Total Points earned for u" or "No of times in team" to print in that order
		        	}); 
		        	console.log("Ranking",sorted_players);
		        }
			});
			
		});
	}	
	setTimeout(fetchNextGw, 500);
});
