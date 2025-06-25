const mongoose = require("mongoose");

const createdRecipeSchema = new mongoose.Schema({
  name: String,
  ingredients: String,
  tips: String,
  tags: [String],
  mediaUrl: String,
  mediaType: String,
  userEmail: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CreatedRecipe", createdRecipeSchema, "created");
