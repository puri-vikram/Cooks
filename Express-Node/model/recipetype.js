const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipetypeSchema = new mongoose.Schema({
  name: { type: String }
});

module.exports = mongoose.model("recipetype", recipetypeSchema);