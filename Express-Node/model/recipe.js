const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipeSchema = new mongoose.Schema({
  title: { type: String, default: null },
 // type: { type: Schema.Types.ObjectId, ref: 'Recipetype', default: null },
  type: { type: String, default: null },
  description: { type: String, default: null },
  diet_type: { type: Array, default: [] },
  meal_type: { type: Array, default: [] },
  cuisine_type: { type: Array, default: [] },
  categories: { type: Array, default: [] },
  ingredients: { type: Array, default: [] },
  recipe_hours: { type: String, default: null },
  recipe_minute: { type: String, default: null },
  why_work: { type: String, default: null },
  user_id: { type: Schema.Types.ObjectId, ref: 'Cook' },
  images: { type: Array, default: null },
  best_recipes : { type: Boolean, default: false },
  speciality : { type: Boolean, default: false },
});

module.exports = mongoose.model("recipe", recipeSchema);