const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dietarySchema = new mongoose.Schema({
  name: { type: String }
});

module.exports = mongoose.model("dietary", dietarySchema);