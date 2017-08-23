// Require mongoose
var mongoose = require("mongoose");
// Create Schema class
var Schema = mongoose.Schema;

// Create promotion schema
var PromotionSchema = new Schema({
  // title is a required string
  image: {
    type: String,
    required: false
  },

  site: {
    type: String,
    required: true
  },

  promo: {
    type: String,
    require: true,
    unique: true
  },

  location: {
    type: String,
    require: false
  },
  title: {
    type: String,
    require: true
  }
});

// Create the Promotion model with the PromotionSchema
var Promotion = mongoose.model("Promotion", PromotionSchema);

// Export the model
module.exports = Promotion;
