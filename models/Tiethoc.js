const mongoose = require("mongoose");

const TiethocSchema = new mongoose.Schema({
  number: { type: Number, required: true, unique: true }
});

module.exports = mongoose.model("Tiethoc", TiethocSchema);
