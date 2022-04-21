const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cuisinesSchema = new mongoose.Schema({
  name: { type: String }
});

module.exports = mongoose.model("cuisine", cuisinesSchema);