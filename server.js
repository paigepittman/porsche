// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var Note = require("./models/Note.js");
var Promotion = require("./models/Promotion.js");
var request = require("request");
var cheerio = require("cheerio");
mongoose.Promise = Promise;
var app = express();
app.use(logger("dev"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static("public"));

// Database configuration with mongoose
mongoose.connect("mongodb://localhost/myapp");
var db = mongoose.connection;
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});
db.once("open", function() {
  console.log("Mongoose connection successful.");
});


// Routes
// ======


app.get("/scrape", function(req, res) {
  console.log("scrape");

  var urls = ["https://circleporsche.com/specials/", "https://www.beverlyhillsporsche.com/specials/", "https://porschemarin.com/specials/"];

  urls.forEach(function(el) {

    request(el, function(error, response, html) {

      var host = this.uri.host;
      var site;
      var result = {};
      //formatting for various host strings
      if (host.startsWith("www")) {
        console.log(host)
        site = "https://" + host;

      } else {
        console.log(host)
        site = "https://www." + host;
      }

      var $ = cheerio.load(html);
      //grabbing each specials div
      $("div.specials-listing-item").each(function(i, element) {
        var image;
        var promo;
        var price;
        ///nested for each to pick up the promotion info

        $("div.special-listing-item-body").each(function(i, element) {
          promo = $(this).children().text();
          var location = site.splice
          result.site = site;
          result.promo = promo;
          var entry = new Promotion(result);

          // still having trouble grabbing images due to asynchronisity, need to work with the nested for each's to get the correct image src to save with each entry
          // result.image = site + image;


          // need to create if statements to cut out any random unncessary promos before they reach the DB

            entry.save(function(err, doc) {

              if (err) {
                console.log(err);

              } else {

                console.log(doc);


              }

            });
          // }


        });

      });
    });
  });

  res.send("Scrape Complete");
});

// This will get the promotionss we scraped from the mongoDB
app.get("/promotions", function(req, res) {
  // Grab every doc in the Promotions array
  Promotion.find({}, function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error// Or send the doc to the browser as a json object
      );
    } else {
      res.json(doc);
    }
  });
});

// Grab an promotion by it's ObjectId
// app.get("/promotions/:id", function(req, res) {
//   // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
//   Promotion.findOne({ "_id": req.params.id })
//   // ..and populate all of the notes associated with it
//   .populate("note")
//   // now, execute our query
//   .exec(function(error, doc) {
//     // Log any errors
//     if (error) {
//       console.log(error);
//     }
//     // Otherwise, send the doc to the browser as a json object
//     else {
//       res.json(doc);
//     }
//   });
// });

// Create a new note or replace an existing note
// app.post("/promotions/:id", function(req, res) {
//   // Create a new note and pass the req.body to the entry
//   var newNote = new Note(req.body);
//
//   // And save the new note the db
//   newNote.save(function(error, doc) {
//     // Log any errors
//     if (error) {
//       console.log(error);
//     }
//     // Otherwise
//     else {
//       // Use the promotion id to find and update it's note
//       Promotion.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
//       // Execute the above query
//       .exec(function(err, doc) {
//         // Log any errors
//         if (err) {
//           console.log(err);
//         }
//         else {
//           // Or send the document to the browser
//           res.send(doc);
//         }
//       });
//     }
//   });
// });

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
