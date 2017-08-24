// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var Promotion = require("./models/Promotion.js");
var urls = require("./models/domains.js");
// var Location = require("./models/Location.js")
var request = require("request");
var cheerio = require("cheerio");
mongoose.Promise = Promise;
var app = express();
app.use(logger("dev"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static("public"));
// app.set('view engine', 'html');
var PORT = process.env.PORT || 4000;

// Database configuration with mongoose
var db = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(db, function(error) {
  if (error) {
    console.log(error);
  }
  else {
    console.log("mongoose connection is successful");
  }
});


// Routes //


app.get("/", function(req, res) {
  // console.log(urls);


  urls.forEach(function(el) {

    request(el, function(error, response, html) {

      var host = this.uri.host;
      var site;
      var result = {};
      var locationResult = {};
      var promosArray = [];
      //formatting for various host strings
      if (host.startsWith("www")) {
        // console.log(host)
        site = "https://" + host;

      } else {
        // console.log(host)
        site = "https://www." + host;
      }

      var imageURL = "https://" + site.slice(12);
      console.log (imageURL);

      var $ = cheerio.load(html);
      //grabbing each specials div
      $("div.specials-listing-item").each(function(i, element) {
        var image;
        var promo;
        var price;

        $("div.special-listing-item-body").each(function(i, element) {
          promo = $(this).children("p").text();
          var title = $(this).children(".special-listing-item-body-inner-top").text();

          image = $(this).prev("div.special-listing-item-image").children().attr("src");

          var location = site.slice(12, -4);
          result.site = site;
          result.promo = promo;
          result.title = title;
          result.location = location;
          result.image = imageURL + image;

          // need to create if statements to cut out any random unncessary promos before they reach the DB
          var entry = new Promotion(result);
            entry.save(function(err, doc) {

              if (err) {
                // console.log(err);

              } else {

            }
          });
        });
      });
    });
  });

  res.render("Scrape Complete");
});


/////////////////GRABS ALL DATA SUCCESSFULLY/////////////////////////
// // This will get the promotionss we scraped from the mongoDB
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
///////////////////////////////////////////////////////////////////




//GRABS SPECIFIC STORES///
app.get("/promotions/:location?", function(req, res) {
  // Grab every doc in the Promotions array
  Promotion.find({location: req.params.location}, function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error// Or send the doc to the browser as a json object
      );
    } else {
      res.json(doc);
    }
  });
});


app.get("/fullpromo/:id?", function(req, res) {
  // Grab every doc in the Promotions array
  Promotion.findOne({_id: req.params.id}, function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error// Or send the doc to the browser as a json object
      );
    } else {
      res.json(doc);
    }
  });
});


// Listen on port 3000
app.listen(PORT, function() {
  console.log("App running on port" + PORT);
});
