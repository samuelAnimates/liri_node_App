//==================   DECLARE FUNCTIONS    ============================================

/*
*/
function movieThis(movieTitleStr){

    var queryURL = "http://www.omdbapi.com/?t=" + movieTitleStr + "&y=&plot=short&apikey=40e9cece";

    var request = require("request");
	request(queryURL, function(error, response, body){

	    // If the request is successful
	    if (!error && response.statusCode === 200) {
	    	
	    	console.log("\n======================= IMDB  SEARCH  RESULTS ===================================");
	    	
	    	//Displaying the Title
			console.log("MOVIE TITLE: \t" + JSON.parse(body).Title);

	    	//Displaying the Release Year
			console.log("RELEASE YEAR: \t" + JSON.parse(body).Year);

			//Displaying the country
			console.log("COUNTRY: \t" + JSON.parse(body).Country);

			//Displaying the actors
			console.log("STARRING: \t" + JSON.parse(body).Actors);

			//Displaying the plot
			console.log("\nPLOT:" + JSON.parse(body).Plot);


			//Displaying the ratings
			console.log("\nRATINGS:")
			for (i=0; i<JSON.parse(body).Ratings.length; i++){
				console.log("  " + JSON.parse(body).Ratings[i].Source + ": " + JSON.parse(body).Ratings[i].Value);
			}

			console.log("=======================     END  RESULTS     ===================================");
		}

		else{
			console.log("RESPONSE CODE: " + response.statusCode);
		}

	});

};

/*
*/
function showMyTweets(){

	var Twitter = require('twitter');
	var keys = require("./keys.js");
	var tweetLimitNum = 20;
 
	var client = new Twitter({
	  consumer_key: keys.twitterKeys.consumer_key,
	  consumer_secret: keys.twitterKeys.consumer_secret,
	  access_token_key: keys.twitterKeys.access_token_key,
	  access_token_secret: keys.twitterKeys.access_token_secret
	});
 
	var params = {
		screen_name: 'LacklustrKard',
		count: tweetLimitNum,
		trim_user: true
	};

	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
	  	console.log("\nHERE ARE MY LAST 20 TWEETS\n==========================================================");
	  	for ( i=0; i<tweetLimitNum; i++){
	    	console.log("TWEETED AT [ " + tweets[i].created_at + " ] : " + tweets[i].text);
		}
		console.log("==========================================================\nEND OF REQUESTED TWEETS");
	  }
	  else {
	  	console.log("SORRY, THERE WAS AN ERROR RETRIEVING TWEETS~");
	  }
	});

};

/*
*/
function spotifyThisSong(songTitleStr){
	
	var albumNameStr = "test";

	var keys = require("./keys.js");

	var Spotify = require('node-spotify-api');
 
	var spotify = new Spotify({
	  id: keys.spotifyKeys.client_id,
	  secret: keys.spotifyKeys.client_secret
	});
	 
	spotify.search({ type: 'track', query: songTitleStr }, function(err, data) {
	  if (err) {
	    return console.log('Error occurred: ' + err);
	  }
	
	console.log("\n==================== TOP SPOTIFY SEARCH RESULT ====================");
	console.log("\nTRACK TITLE:\t" + data.tracks.items[0].name);
	console.log("ARTIST:\t\t" + data.tracks.items[0].artists[0].name);
	console.log("ALBUM:\t\t" + data.tracks.items[0].album.name);
	console.log("PREVIEW URL:\t" + data.tracks.items[0].preview_url);
	console.log("\n==================== END SPOTIFY SEARCH RESULTS ====================");
	});

};

//==================   GLOBAL VARIABLES    =============================================

//grab the data from keys.js. Then store the keys in a variable.
var keys = require("./keys.js");
var localTwitterKeys = keys.twitterKeys;

//global variable to refer to the node inputs
var nodeArgs = process.argv;

//==================   INCLUDE JQUERY    =============================================


//==================   INPUT/OUTPUT    =================================================

/*
*/
if (process.argv[2] === "my-tweets"){
	
	showMyTweets();

}

/*
*/
if (process.argv[2] === "spotify-this-song"){

	if (nodeArgs.length === 3){	
		var userInput = nodeArgs[3];
		spotifyThisSong(userInput);
	}

	if (nodeArgs.length > 3){	
		
		userInput = nodeArgs[3];

		for (i=4; i<nodeArgs.length; i++){
			nextWordInTitle = nodeArgs[i];
			userInput += (" " + nextWordInTitle);
		}

		spotifyThisSong(userInput);

	}

}

/*
*/
if (process.argv[2] === "movie-this"){
	

	if (nodeArgs.length === 3){	
		var userInput = nodeArgs[3];
		movieThis(userInput);
	}

	if (nodeArgs.length > 3){	
		
		userInput = nodeArgs[3];

		for (i=4; i<nodeArgs.length; i++){
			nextWordInTitle = nodeArgs[i];
			userInput += ("+" + nextWordInTitle);
		}

		movieThis(userInput);

	}

}