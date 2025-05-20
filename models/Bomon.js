const mongoose = require("mongoose");

const bomonSchema = new mongoose.Schema({
  ten: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model("Bomon", bomonSchema);
