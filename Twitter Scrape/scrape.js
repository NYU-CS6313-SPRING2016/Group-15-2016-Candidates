var t = require("./nodejs-twitter-api-interface/twitter-interface.js");
const fs = require('fs');

t.getAllTweetsMultiple(
	['CNNPolitics', 'foxnewspolitics', 'ABCPolitics', 'BBCWorld', 'MSNBC'],
	['trump', 'cruz', 'kasich', 'clinton', 'sanders'],
	function(tweets_split_search, tweets_split_source) {
		for(candidate in tweets_split_search) {
			fs.writeFile(""+candidate+".json", JSON.stringify(tweets_split_search[candidate]));
		}
		//fs.writeFile("data.json", JSON.stringify(data));
	}
);
