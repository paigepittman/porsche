// Require mongoose
var mongoose = require("mongoose");
// Create Schema class
var Schema = mongoose.Schema;

// Create promotion schema
var PromotionSchema = new Schema({
  // title is a required string
  image: {
    type: String,
    required: true

  },

  site: {
    type: String,
    required: true
  },

  promo: {
    type: String,
    require: true
  },

  location: {
    type: String,
    require: false
  },
  title: {
    type: String,
    require: true

  },
  category: {
    type: String,
    require: false
  }
});

PromotionSchema.index({ location: 1, promo: 1 }, {unique: true});

// Create the Promotion model with the PromotionSchema
var Promotion = mongoose.model("Promotion", PromotionSchema);

// Export the model
module.exports = Promotion;
