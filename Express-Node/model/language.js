const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LanguagesSchema = new mongoose.Schema({
  name: { type: String }
});

module.exports = mongoose.model("language", LanguagesSchema);