const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mealsSchema = new mongoose.Schema({
  name: { type: String }
});

module.exports = mongoose.model("meal", mealsSchema);