const mongoose = require("mongoose");

const LopSchema = new mongoose.Schema({
  name: { type: String, required: true }
});

module.exports = mongoose.model("Lop", LopSchema);
