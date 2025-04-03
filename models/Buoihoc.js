const mongoose = require("mongoose");

const BuoihocSchema = new mongoose.Schema({
  name: { type: String, required: true }
});

module.exports = mongoose.model("Buoihoc", BuoihocSchema);
