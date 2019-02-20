require("dotenv").config();
var keys = require("./keys.js");

// concert-this
// node liri.js concert-this <artist/band name here>

// spotify-this-song
// node liri.js spotify-this-song '<song name here>'

// movie-this
// node liri.js movie-this '<movie name here>'

// do-what-it-says
// node liri.js do-what-it-says

var action = process.argv[2];

switch (action) {
  case "concert-this":
    concertThis();
    break;

  case "spotify-this-song":
    spotifyThisSong();
    break;

  case "movie-this":
    movieThis();
    break;

  case "do-what-it-says":
    doWhatItSays();
    break;

  default:
    showUsage();
    break;
}


// ---------- Functions ---------- //

function concertThis() {

}

function spotifyThisSong() {
  var Spotify = require('node-spotify-api');
  var spotify = new Spotify(keys.spotify);
  

}

function movieThis() {

}

function doWhatItSays() {

}

function showUsage() {
  console.log(`usage: node liri.js concert-this <artist/band name>
       node liri.js spotify-this-song <song name>
       node liri.js movie-this <movie name>
       node liri.js do-what-it-says`);
}