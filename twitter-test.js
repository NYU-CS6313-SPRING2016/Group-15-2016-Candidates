var credentials = require('./credentials.js');
var twitter = require('twitter');
var sentiment = require('sentiment');

const fs = require('fs');

var tweets = [];

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


function parseTweet(tweet) {

	if ( tweet.lang == 'en' )  { // sentiment module only works on English

		var tweet_text = tweet.text;
		var created_at = parseTwitterDate(tweet.created_at);
		var user_id = tweet.user.id_str;
		var screen_name = tweet.user.screen_name;
		var name = tweet.user.name;
		var retweets = 0;
		if (tweet.retweeted_status) {
			retweets = tweet.retweeted_status.retweet_count;
		}
		tweet["sentiment"] = sentiment(tweet.text);
		fs.appendFile("data.json", JSON.stringify(tweet)+",");
		console.log(tweet.id + ": " + tweet.created_at);
		console.log(screen_name + ": " + tweet_text)
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

/*
https://dev.twitter.com/streaming/overview/request-parameters

SAMPLE INPUT
{
	delimited: 'length',
	stall_warnings: true,
	filter_level: 'none'|'low'|'medium',
	language: 'en',
	follow: 'cnn, foxnews, bbc, abc, msnbc',
	track: 'trump, cruz, kasich, clinton, sanders',
	locations: '-122.75,36.8,-121.75,37.8,-74,40,-73,41',
	count: 150000,
	with: 'user'|'site',
	replies: 'all',
	stringify_friend_id: true
}

SAMPLE OUTPUT
{
	"retweet_count":0,
	"text":"Man I like me some @twitterapi",
	"entities": {
		"urls":[],
		"hashtags":[],
		"user_mentions":[
			{
				"indices":[19,30],
				"name":"Twitter API",
				"id":6253282,
				"screen_name":"twitterapi",
				"id_str":"6253282"
			}
		]
	},
	"retweeted":false,
	"in_reply_to_status_id_str":null,
	"place":null,
	"in_reply_to_user_id_str":null,
	"coordinates":null,
	"source":"web",
	"in_reply_to_screen_name":null,
	"in_reply_to_user_id":null,
	"in_reply_to_status_id":null,
	"favorited":false,
	"contributors":null,
	"geo":null,
	"truncated":false,
	"created_at":"Wed Feb 29 19:42:02 +0000 2012",
	"user": {
		"is_translator":false,
		"follow_request_sent":null,
		"statuses_count":142,
		"profile_background_color":"C0DEED",
		"default_profile":false,
		"lang":"en",
		"notifications":null,
		"profile_background_tile":true,
		"location":"",
		"profile_sidebar_fill_color":"ffffff",
		"followers_count":8,
		"profile_image_url":"http:\/\/a1.twimg.com\/profile_images\/1540298033\/phatkicks_normal.jpg",
		"contributors_enabled":false,
		"profile_background_image_url_https":"https:\/\/si0.twimg.com\/profile_background_images\/365782739\/doof.jpg",
		"description":"I am just a testing account, following me probably won't gain you very much",
		"following":null,
		"profile_sidebar_border_color":"C0DEED",
		"profile_image_url_https":"https:\/\/si0.twimg.com\/profile_images\/1540298033\/phatkicks_normal.jpg",
		"default_profile_image":false,
		"show_all_inline_media":false,
		"verified":false,
		"profile_use_background_image":true,
		"favourites_count":1,
		"friends_count":5,
		"profile_text_color":"333333",
		"protected":false,
		"profile_background_image_url":"http:\/\/a3.twimg.com\/profile_background_images\/365782739\/doof.jpg",
		"time_zone":"Pacific Time (US & Canada)",
		"created_at":"Fri Sep 09 16:13:20 +0000 2011",
		"name":"fakekurrik",
		"geo_enabled":true,
		"profile_link_color":"0084B4",
		"url":"http:\/\/blog.roomanna.com",
		"id":370773112,
		"id_str":"370773112",
		"listed_count":0,
		"utc_offset":-28800,
		"screen_name":"fakekurrik"
	},
	"id":174942523154894848,
	"id_str":"174942523154894848"
}
*/

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
			cconsole.log("-----: " + max_id);
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
						max = parseTweet(tweets[i]);
						if(maxID == undefined || max < maxID) {
							maxID = max;
						}
					}
					else if(tweets[i].text.indexOf("Bernie") != -1 || tweets[i].text.indexOf("Sanders") != -1){
						//console.log(tweets[i].text);
						max = parseTweet(tweets[i]);
						if(maxID == undefined || max < maxID) {
							maxID = max;
						}
					}
					else if(tweets[i].text.indexOf("Hillary") != -1 || tweets[i].text.indexOf("Clinton") != -1){
						//console.log(tweets[i].text);
						max = parseTweet(tweets[i]);
						if(maxID == undefined || max < maxID) {
							maxID = max;
						}
					}
					else if(tweets[i].text.indexOf("Donald") != -1 || tweets[i].text.indexOf("Trump") != -1){
						//console.log(tweets[i].text);
						max = parseTweet(tweets[i]);
						if(maxID == undefined || max < maxID) {
							maxID = max;
						}
					}
					else if(tweets[i].text.indexOf("Kasich") != -1){
						//console.log(tweets[i].text);
						max = parseTweet(tweets[i]);
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

getTweets('cnn');
getTweets('foxnews');
getTweets('msnbc');
getTweets('abc');
getTweets('bbc');
