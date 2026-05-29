const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "EMERGENCY",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Alert = mongoose.model("Alert", alertSchema);

module.exports = Alert;