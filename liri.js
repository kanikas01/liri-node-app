require("dotenv").config();
var axios = require("axios");
var fs = require("fs");
var keys = require("./keys.js");
var moment = require('moment');
var Spotify = require('node-spotify-api');
var instructionsFile = 'random.txt';
var action = process.argv[2];
var userQuery = process.argv.slice(3).join(' ');

// Execute main function
main(action, userQuery);


// ---------- Functions ---------- //

function main(action, userQuery) {
  switch (action) {
    case "concert-this":
      concertThis(userQuery);
      break;

    case "spotify-this-song":
      spotifyThisSong(userQuery);
      break;

    case "movie-this":
      movieThis(userQuery);
      break;

    case "do-what-it-says":
      doWhatItSays();
      break;

    default:
      showUsage();
      break;
  }
}

function concertThis(queryString) {

}

// Query Spotify API for information about a song
function spotifyThisSong(queryString) {
  var spotify = new Spotify(keys.spotify);
  // If no song is given, set song title to "The Sign"
  if (!queryString) {
    queryString = 'The Sign';
  }

  // Create Spotify query
  var spotifyQuery = spotify.search({
    type: 'track',
    query: queryString
  });

  // Execute Spotify query
  spotifyQuery.then(function (data) {
    console.log('\n-------------------\n');
    for (var i = 0; i < data.tracks.items.length; i++) {
      // If song title is an exact match, print results
      if (data.tracks.items[i].name.toLowerCase() === queryString.toLowerCase()) {
        console.log("Artist: " + data.tracks.items[i].artists[0].name);
        console.log("Song: " + data.tracks.items[i].name);
        console.log("Link: " + data.tracks.items[i].external_urls.spotify);
        console.log("Album: " + data.tracks.items[i].album.name);
        console.log('\n-------------------\n');
      }
    }
  })
  .catch(function(err) {
    console.log(err);
  });
}

function movieThis(queryString) {
  // console.log(JSON.stringify(data, null, 2));
}

// Execute instructions in instructionsFile
function doWhatItSays() {
  // Read file contents
  fs.readFile(instructionsFile, "utf8", function (error, data) {
    if (error) {
      return console.log(error);
    }
    // Parse file content into variables
    var [action, queryString] = data.split(",");

    // Abort execution if infinite loop is detected
    if (action === 'do-what-it-says') {
      console.log("FATAL: Infinite loop detected - aborting script\n");
      return;
    }
    
    // Call main function with new parameters
    main(action, queryString);
  });
}

// Show script usage
function showUsage() {
  console.log(`usage: node liri.js concert-this <artist/band name>
       node liri.js spotify-this-song <song name>
       node liri.js movie-this <movie name>
       node liri.js do-what-it-says`);
}