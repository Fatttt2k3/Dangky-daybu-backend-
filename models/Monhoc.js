
const mongoose = require("mongoose");

const MonhocSchema = new mongoose.Schema({
  name: { type: String, required: true }
});

module.exports = mongoose.model("Monhoc", MonhocSchema);
