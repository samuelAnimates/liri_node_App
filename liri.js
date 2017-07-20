//==================   DECLARE FUNCTIONS    ============================================

function doWhatItSays(){

	// includes FS package for reading and writing packages
	var fs = require("fs");

	// 
	fs.readFile("random.txt", "utf8", function(err, data) {
		
		if (err) {
			return console.log(err);
		}

		// Break the string down by comma separation and store the contents into the output array.
		var output = data.split(",");
		var functionToCall = output[0];
		var userInput;
		  
		if (functionToCall === "spotify-this-song"){
			
			if (output.length === 1){
				var userInput = "The sign Ace of Base";
				spotifyThisSong(userInput);
			}

			if (output.length === 2){
			
				var userInput = output[1];
				spotifyThisSong(userInput);

			}

			if (output.length >2){

				var userInput = output[1];

				for (i=4; i<nodeArgs.length; i++){
					nextWordInTitle = nodeArgs[i];
					userInput += (" " + nextWordInTitle);
				}

				spotifyThisSong(userInput);
			}
			
		}

		if (functionToCall === "movie-this"){
		  	
		  	if (output.length === 1){
				var userInput = "Mr+Nobody";
				movieThis(userInput);
			}

			if (output.length === 2){
			
				var userInput = output[1];
				movieThis(userInput);

			}

			if (output.length >2){
				
				var userInput = output[1];

				for (i=4; i<nodeArgs.length; i++){
					nextWordInTitle = nodeArgs[i];
					userInput += ("+" + nextWordInTitle);
				}

				movieThis(userInput);
			}

		}

		if (functionToCall === "my-tweets"){
		  	showMyTweets();
		}
	});

};

/*
FUNCTION NAME: movieThis
DESCRIPTION: runs an OMDB API call to search for a movie and display relevant information based on user input

INPUT: one string (presumably a real movie), ormatted with "+" between words instead of spaces, e.g. "Mr+Nobody"
OUTPUT: console.log of title, year, country, actors, plot, and ratings of movie retrieved from IMDB
*/
function movieThis(movieTitleStr){

    var queryURL = "http://www.omdbapi.com/?t=" + movieTitleStr + "&y=&plot=short&apikey=40e9cece";

    //include Request packcage needed to run OMDB API calls
    var request = require("request");
	request(queryURL, function(error, response, body){

	    // If the request is successful
	    if (!error && response.statusCode === 200) {
	    	
	    	console.log("\n======================= IMDB  SEARCH  RESULTS ===================================");
	    	
	    	//Display the Title
			console.log("MOVIE TITLE: \t" + JSON.parse(body).Title);

	    	//Display the Release Year
			console.log("RELEASE YEAR: \t" + JSON.parse(body).Year);

			//Displaythe country
			console.log("COUNTRY: \t" + JSON.parse(body).Country);

			//Display the actors
			console.log("STARRING: \t" + JSON.parse(body).Actors);

			//Display the plot
			console.log("\nPLOT:" + JSON.parse(body).Plot);


			//Displaying the ratings. Requiring a loop through a ratings array, as not all movies are rated by the same sources.
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

	//include Twitter package required to run Twitter API calls
	var Twitter = require('twitter');
	
	//includes the keys exported from our keys.js file
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
FUNCTION NAME: spotifyThisSong
DESCRIPTION: runs a Spotify API call to search for a song based on user input

INPUT: one string (presumably a song title)
OUTPUT: console.log of title, artist, album, and preview URL of song retrieved from Spotify
*/
function spotifyThisSong(songTitleStr){

	//
	var keys = require("./keys.js");
	var Spotify = require('node-spotify-api');
 
 	//
	var spotify = new Spotify({
	  id: keys.spotifyKeys.client_id,
	  secret: keys.spotifyKeys.client_secret
	});
	 
	spotify.search({ type: 'track', query: songTitleStr }, function(err, data) {

		if (err){
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


//==================   INPUT/OUTPUT        =================================================

/*
*/
if (process.argv[2] === "my-tweets"){
	
	showMyTweets();

}

/*
*/
if (process.argv[2] === "spotify-this-song"){

	//handles the case in which the user does not enter a movie title
	if (nodeArgs.length === 3){
		
		console.log("\nYou're supposed to enter a song to search. Here's some Ace of Base:");
		
		//uses the song The Sign by default
		var userInput = "The sign Ace of Base";
		spotifyThisSong(userInput);
	
	}

	//handles the case in which the user inputs a single-word song title, e.g. Toxic
	else if (nodeArgs.length === 4){	
		var userInput = nodeArgs[3];
		spotifyThisSong(userInput);
	}

	///handles the case in which the user types in a multi-word song title, e.g. Genie in a Bottle
	else {	
		
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
	
	//handles the case in which the user does not enter a movie title
	if (nodeArgs.length === 3){
		
		console.log("\nYou're supposed to enter a movie to search. Here's Mr. Nobody:");
		
		//uses the movie Mr.Nobody by default
		var userInput = "Mr+Nobody";
		movieThis(userInput);

	}

	//handles the case in which the user inputs a single-word movie title, e.g. Cars
	if (nodeArgs.length === 4){	
		var userInput = nodeArgs[3];
		movieThis(userInput);
	}

	//handles the case in which the user types in a multi-word movie title, e.g. Toy Story 3
	if (nodeArgs.length > 4){	
		
		userInput = nodeArgs[3];

		//formats the multi-word input so that the movieThis function will be able to accept it as input
		for (i=4; i<nodeArgs.length; i++){
			
			nextWordInTitle = nodeArgs[i];
			//appends "+" and the next word in the title to the userInput string
			userInput += ("+" + nextWordInTitle);
		}

		movieThis(userInput);

	}

}

/*
*/
if (process.argv[2] === "do-what-it-says"){

	doWhatItSays();

}