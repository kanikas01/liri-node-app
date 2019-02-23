
// ---------- Imports and global vars ---------- //

require("dotenv").config();
var axios = require("axios");
var fs = require("fs");
var keys = require("./keys.js");
var moment = require('moment');
var Spotify = require('node-spotify-api');
var instructionsFile = 'random.txt';
var logFile = 'log.txt';
var action = process.argv[2];
var userQuery = process.argv.slice(3).join(' ');

// ---------- Execute main function ---------- //

main(action, userQuery);

// ---------- Function definitions ---------- //

function main(action, userQuery) {
  // Write user request to log file
  logCommand(action, userQuery);

  // Execute user request
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

// Query Bands In Town API for upcoming concert info and output results
function concertThis(queryString) {
  // Set query string
  var query = "https://rest.bandsintown.com/artists/" + queryString + "/events?app_id=codingbootcamp";

  // Run get request
  axios.get(query)
    .then(function (response) {
      // Check to see if the artist in question has any upcoming shows
      if (response.data.length > 0) {
        console.log('\n-------------------\n');
        for (var i = 0; i < response.data.length; i++) {
          // Parse JSON into concert object properties
          var concert = {};
          concert.venue = response.data[i].venue.name;
          concert.city = response.data[i].venue.city;
          concert.region = response.data[i].venue.region;
          concert.country = response.data[i].venue.country;
          concert.date = response.data[i].datetime.split('T');

          // Not all concerts have a region associated with them, so set location as appropriate 
          if (concert.region) {
            concert.location = concert.city + ', ' + concert.region + ', ' + concert.country;
          } else {
            concert.location = concert.city + ', ' + concert.country;
          }

          // Print output
          console.log("Venue: " + concert.venue);
          console.log("Location: " + concert.location);
          console.log("Date: " + moment(concert.date[0], 'YYYY-MM-DD').format('MM/DD/YYYY'));
          console.log('\n-------------------\n');
        }
      } else {
          // Alert user if song is not found
          console.log("No upcoming concerts found for that artist.");
        }
    })
    .catch(function (error) {
      console.log(error);
    });
}

// Query Spotify API for information about a song and output results
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
    // Check to see if a song exists with the given title
    if (data.tracks.items.length > 0) {
      console.log('\n-------------------\n');
      for (var i = 0; i < data.tracks.items.length; i++) {
        // Only print results if song title is an exact match
        if (data.tracks.items[i].name.toLowerCase() === queryString.toLowerCase()) {
          // Parse JSON into song object properties
          var song = {};
          song.artist = data.tracks.items[i].artists[0].name;
          song.title = data.tracks.items[i].name;
          song.preview = data.tracks.items[i].external_urls.spotify;
          song.album = data.tracks.items[i].album.name;

          // Print output
          console.log("Artist: " + song.artist);
          console.log("Title: " + song.title);
          console.log("Preview: " + song.preview);
          console.log("Album: " + song.album);
          console.log('\n-------------------\n');
        }
      }
    } else {
      // Alert user if song is not found
      console.log("No song found with that title.");
    }
  })
  .catch(function(err) {
    console.log(err);
  });
}

// Query OMDB API for info about a movie title and output results
function movieThis(queryString) {
  // If no movie is given, set movie title to "Mr Nobody"
  if (!queryString) {
    queryString = 'Mr Nobody';
  }
  
  // Create OMDB query
  var query = "http://www.omdbapi.com/?apikey=trilogy&t=" + queryString;

  // Run get request
  axios.get(query)
    .then(function (response) {
      // Check to see if movie exists
      if (response.data.Title) {
        // Parse JSON into movie object properties
        var movie = {}; 
        movie.title = response.data.Title;
        movie.year = response.data.Year;
        movie.imdbRating = response.data.imdbRating;
        movie.country = response.data.Country;
        movie.language = response.data.Language;
        movie.plot = response.data.Plot;
        movie.actors = response.data.Actors;
        
        // Not all films have a Rotten Tomatoes rating, so set Rotten Tomatoes rating as appropriate
        movie.rottenTomatoesRating = 'None';
          response.data.Ratings.forEach(element => {
            if (element.Source == 'Rotten Tomatoes') {
              movie.rottenTomatoesRating = element.Value;
            }
          });

        // Print output
        console.log('\n-------------------\n');
        console.log("Title: " + movie.title);
        console.log("Year: " + movie.year);
        console.log("IMDB Rating: " + movie.imdbRating);
        console.log("Rotten Tomatoes Rating: " + movie.rottenTomatoesRating);
        console.log("Country: " + movie.country);
        console.log("Language: " + movie.language);
        console.log("Plot: " + movie.plot);
        console.log("Actors: " + movie.actors);
        console.log('\n-------------------\n');
      } else {
        // Alert user if movie is not found
        console.log("No film found with that title.");
      }
    })
    .catch(function (error) {
      console.log(error);
    });
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

// Write user request to log file
function logCommand(action, userQuery) {
  if (action) {
    var request = action + ',"' + userQuery + '"\n';
    fs.appendFile(logFile, request, function (err) {
      // Log any errors to console
      if (err) {
        console.log(err);
      }
    });
  }
}
