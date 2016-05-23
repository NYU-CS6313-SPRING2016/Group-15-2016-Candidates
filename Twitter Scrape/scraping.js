var credentials = require('./credentials.js');
var twitter = require('twitter');
//var sentiment = require('sentiment');

var AlchemyAPI = require('./alchemyapi');
var alchemyapi = new AlchemyAPI();

const fs = require('fs');

var tweets = [];

//added candidate List
var candidates = ['tCruz', 'bSanders', 'hClinton', 'dTrump', 'jKasich'];

var candidateFilter = ['Hillary Clinton','Hillary','Clinton'];

process.on('uncaughtException', function(err) {
	console.log(err);
});

var t = new twitter({
	consumer_key: credentials.consumer_key,
	consumer_secret: credentials.consumer_secret,
	access_token_key: credentials.access_token_key,
	access_token_secret: credentials.access_token_secret
});


function parseTwitterDate($stamp) {
	var date = new Date(Date.parse($stamp));
	var output = date.getUTCFullYear() + '-' + ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' + date.getUTCDate() + ' ' + ('00' + date.getUTCHours()).slice(-2) + ':' + ('00' + date.getUTCMinutes()).slice(-2) + ':' + ('00' + date.getUTCSeconds()).slice(-2);
	return output;
}

function printThisFunction(tweet, score){
	console.log("Tweet: " + tweet + "\r\n" + "Sentiment:" + score + "\r\n-------------------------\r\n");
}

//added candidates parameter
function parseTweet(tweet, candidates, filter) {

	if ( tweet.lang == 'en' )  { // sentiment module only works on English

		var tweet_text = tweet.text;
		var created_at = parseTwitterDate(tweet.created_at);
		var screen_name = tweet.user.screen_name;
		var name = tweet.user.name;
		var retweets = 0;
		if (tweet.retweeted_status) {
			retweets = tweet.retweeted_status.retweet_count;
		}
		
		var filteredTweet = tweet_text;

		
		for(var i = 0; i< 3 ; i++) {
			filteredTweet = filteredTweet.replace(filter[i], "Entity");
		}

		
		alchemyapi.sentiment_targeted("text", filteredTweet, "Entity",  {}, function(response) {
			var sentimentScore = response["docSentiment"]["type"];
	
			//Wierd Scoping error here, had to write to file from within sentiment function.
			if(candidates == "tCruz"){
				fs.appendFile("Cruz.json", JSON.stringify({
				network: screen_name,
				date: created_at,
				sentiment: sentimentScore,
				impact: retweets,
				text: tweet_text
			})+",\r\n");
			}
			if(candidates == "bSanders"){
				fs.appendFile("Sanders.json", JSON.stringify({
				network: screen_name,
				date: created_at,
				sentiment: sentimentScore,
				impact: retweets,
				text: tweet_text
			})+",\r\n");
			}
			if(candidates == "dTrump"){
				fs.appendFile("Trump.json", JSON.stringify({
				network: screen_name,
				date: created_at,
				sentiment: sentimentScore,
				impact: retweets,
				text: tweet_text
			})+",\r\n");
			}
			if(candidates == "hClinton"){
				fs.appendFile("Clinton.json", JSON.stringify({
				network: screen_name,
				date: created_at,
				sentiment: sentimentScore,
				impact: retweets,
				text: tweet_text
			})+",\r\n");
			}
			if(candidates == "jKasich"){
				fs.appendFile("Kasich.json", JSON.stringify({
				network: screen_name,
				date: created_at,
				sentiment: sentimentScore,
				impact: retweets,
				text: tweet_text
			})+",\r\n");
			}
		});

	}

	return 0;
	return tweet.id;
}

var tweets = {
	cnn: {
		max_id: null,
		since_id: null,
		tweets: []
	},
	fox: {
		max_id: null,
		since_id: null,
		tweets: []
	},
	bbc: {
		max_id: null,
		since_id: null,
		tweets: []
	}
};

function getAllTweets(source, search) {
	var max_id = undefined;
	var prev_max = undefined;
	do {
		prev_max = max_id;

		getTweets(source, search, max_id).then(function(response) {
			console.log("Success!", response);
			max_id = response;
		}, function(error) {
			console.error("Failed!", error);
		}).then(function(response) {
			console.log("-----: " + max_id);
		});

		//setTimeout(max_id = getTweets(source, search, max_id), 10000);
	} while(max_id <= prev_max);
	console.log(max_id);
}

function streamTweets(search) {
	t.stream('statuses/filter', {
			//follow: 'cnn, foxnews, msnbc, abc, bbc',
			track: search
	}, function(stream) {
  //  t.stream('statuses/sample', function(stream) {
      stream.on('data', function (tweet) {
        parseTweet(tweet);
      });
      stream.on('error', function(tweet) {
        parseTweet(tweet);
      });
      stream.on('end', function(response) {
        console.error("End:");
        //console.error(response);
        stream.destroy();
      });
    });
}

function getTweets(source, search, maxID) {
	return new Promise(function(resolve, reject) {
		var search_obj = {
			screen_name: source,
			//follow: 'cnn, foxnews, msnbc, abc, bbc',
			track: search,
			exclude_replies: true,
			count: 200
		}
		if(maxID != undefined) {
			search_obj['max_id'] = maxID;
		}
		console.log(search_obj);
		t.get('statuses/user_timeline',
			search_obj,
			function(error, tweets, response) {
				for(i in tweets) {
					var max;
					if(tweets[i].text.indexOf("Ted") != -1 || tweets[i].text.indexOf("Cruz") != -1 ){
						//console.log(tweets[i].text);
						max = parseTweet(tweets[i], candidates[0], ['Ted Cruz','Ted','Cruz']);
						if(maxID == undefined || max < maxID) {
							maxID = max;
						}
					}
					if(tweets[i].text.indexOf("Bernie") != -1 || tweets[i].text.indexOf("Sanders") != -1){
						//console.log(tweets[i].text);
						max = parseTweet(tweets[i], candidates[1], ['Bernie Sanders','Bernie','Sanders']);
						if(maxID == undefined || max < maxID) {
							maxID = max;
						}
					}
					if(tweets[i].text.indexOf("Hillary") != -1 || tweets[i].text.indexOf("Clinton") != -1){
						//console.log(tweets[i].text);
						max = parseTweet(tweets[i], candidates[2], ['Hillary Clinton','Hillary','Clinton']);
						if(maxID == undefined || max < maxID) {
							maxID = max;
						}
					}
					if(tweets[i].text.indexOf("Donald") != -1 || tweets[i].text.indexOf("Trump") != -1){
						//console.log(tweets[i].text);
						max = parseTweet(tweets[i], candidates[3], ['Donald Trump','Donald','Trump']);
						if(maxID == undefined || max < maxID) {
							maxID = max;
						}
					}
					if(tweets[i].text.indexOf("Kasich") != -1){
						//console.log(tweets[i].text);
						max = parseTweet(tweets[i], candidates[4], ['John Kasich','John','Kasich']);
						if(maxID == undefined || max < maxID) {
							maxID = max;
						}
					}
				}
			}
		);
		//console.log("-----: " + maxID);
		if(maxID == undefined) {
			reject(Error("No search terms found"));
		}
		else {
			resolve(maxID);
		}
	});
}

getTweets('cnnpolitics');
getTweets('foxnewspolitics');
getTweets('nbcpolitics');
getTweets('abcpolitics');
getTweets('bbcnewsus');

