var credentials = require('./credentials.js');
var twitter = require('twitter');

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

		console.log(screen_name + ": " + tweet_text);
	}
}

function getTweets() {
	/*
  t.stream('statuses/filter', {track: 'Bernie Sanders, Hillary Clinton'}, function(stream) {
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
      getTweets();
    });
  });
	*/
	t.get('statuses/user_timeline',
		{	
			screen_name: 'cnn',
			exclude_replies: true,
			count: 200
		},
		function(error, tweets, response) {
			for(i in tweets) {
				if(tweets[i].text.indexOf("Cruz") != -1 ){
					//console.log(tweets[i].text);
					parseTweet(tweets[i]);
				}
				else if(tweets[i].text.indexOf("Bernie") != -1 || tweets[i].text.indexOf("Sanders") != -1){
					//console.log(tweets[i].text);
					parseTweet(tweets[i]);
				}
				else if(tweets[i].text.indexOf("Hillary") != -1 || tweets[i].text.indexOf("Clinton") != -1){
					//console.log(tweets[i].text);
					parseTweet(tweets[i]);
				}
				else if(tweets[i].text.indexOf("Donald") != -1 || tweets[i].text.indexOf("Trump") != -1){
					//console.log(tweets[i].text);
					parseTweet(tweets[i]);
				}
				else if(tweets[i].text.indexOf("John") != -1 || tweets[i].text.indexOf("Kasich") != -1){
					//console.log(tweets[i].text);
					parseTweet(tweets[i]);
				}
			}
		}
	);
}

getTweets();
