const mongoose = require("mongoose");

const TuanhocSchema = new mongoose.Schema({
  number: { type: Number, required: true, unique: true }
});

module.exports = mongoose.model("Tuanhoc", TuanhocSchema);
