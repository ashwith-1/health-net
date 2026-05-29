const mongoose = require("mongoose");

const relativeSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },

  name: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true
  },

  relation: {
    type: String,
    default: "Family"
  },

  email: {
    type: String,
    default: ""
  }
}, { timestamps: true });

module.exports = mongoose.model("Relative", relativeSchema);