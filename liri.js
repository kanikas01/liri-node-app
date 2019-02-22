
// ---------- Imports and global vars ---------- //

require("dotenv").config();
var axios = require("axios");
var fs = require("fs");
var keys = require("./keys.js");
var moment = require('moment');
var Spotify = require('node-spotify-api');
var instructionsFile = 'random.txt';
var action = process.argv[2];
var userQuery = process.argv.slice(3).join(' ');


// ---------- Execute main function ---------- //

main(action, userQuery);


// ---------- Function definitions ---------- //

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
  }
}

function concertThis(queryString) {
  // Set query string
  var query = "https://rest.bandsintown.com/artists/" + queryString + "/events?app_id=codingbootcamp";

  // Run get request
  axios.get(query)
    .then(function (response) {
      var venue, city, region, country, location, date;
      console.log('\n-------------------\n');
      for (var i = 0; i < response.data.length; i++) {
        // Assign json values to variables
        venue = response.data[i].venue.name;
        city = response.data[i].venue.city;
        region = response.data[i].venue.region;
        country = response.data[i].venue.country;
        date = response.data[i].datetime.split('T');

        // Set location 
        if (region) {
          location = city + ', ' + region + ', ' + country;
        } else {
          location = city + ', ' + country;
        }

        // Print output
        console.log("Venue: " + venue);
        console.log("Location: " + location);
        console.log("Date: " + moment(date[0], 'YYYY-MM-DD').format('MM/DD/YYYY'));
        console.log('\n-------------------\n');
      }
    })
    .catch(function (error) {
      console.log(error);
    });
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
    var artist, song, preview, album;
    console.log('\n-------------------\n');
    for (var i = 0; i < data.tracks.items.length; i++) {
      // If song title is an exact match, print results
      if (data.tracks.items[i].name.toLowerCase() === queryString.toLowerCase()) {
        // Assign json values to variables
        artist = data.tracks.items[i].artists[0].name;
        song = data.tracks.items[i].name;
        preview = data.tracks.items[i].external_urls.spotify;
        album = data.tracks.items[i].album.name;

        // Print output
        console.log("Artist: " + artist);
        console.log("Song: " + song);
        console.log("Preview: " + preview);
        console.log("Album: " + album);
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
  
  // Set query string
  // Run get request
  // Print output
}

// Execute instructions in instructionsFile
function doWhatItSays() {
  // Read file contents
  fs.readFile(instructionsFile, "utf8", function (error, data) {
    if (error) {
      return console.log(error);
    }

    // Parse file content into variables
    var [fileAction, fileQueryString] = data.split(",");
    fileQueryString = fileQueryString.replace(/"/g, '').trim();

    // Abort execution if infinite loop is detected
    if (fileAction === 'do-what-it-says') {
      console.log("FATAL: Infinite loop detected - aborting script\n");
      return;
    }
    
    // Call main function with new parameters
    main(fileAction, fileQueryString);
  });
}

// Show script usage
function showUsage() {
  console.log(`usage: node liri.js concert-this <artist/band name>
       node liri.js spotify-this-song <song name>
       node liri.js movie-this <movie name>
       node liri.js do-what-it-says`);
}
