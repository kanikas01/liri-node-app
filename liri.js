require("dotenv").config();
var keys = require("./keys.js");
var fs = require("fs");
var instructionsFile = 'random.txt';
var action = process.argv[2];
var userQuery = process.argv.slice(3).join(' ');

main(action, userQuery);

// concert-this
// node liri.js concert-this <artist/band name here>

// spotify-this-song
// node liri.js spotify-this-song '<song name here>'

// movie-this
// node liri.js movie-this '<movie name here>'

// do-what-it-says
// node liri.js do-what-it-says




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

function spotifyThisSong(queryString) {
  var Spotify = require('node-spotify-api');
  var spotify = new Spotify(keys.spotify);
  if (!queryString) {
    queryString = 'The Sign';
  }

  spotify.search({ type: 'track', query: queryString, limit: 10 }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }

    console.log(JSON.stringify(data, null, 2));
  });

}

function movieThis(queryString) {

}

// Execute instructions in instructionsFile
function doWhatItSays() {
  // Read file content
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
        
    // Recursively call main function
    main(action, queryString);
  });
}

// Show script useage
function showUsage() {
  console.log(`usage: node liri.js concert-this <artist/band name>
       node liri.js spotify-this-song <song name>
       node liri.js movie-this <movie name>
       node liri.js do-what-it-says`);
}