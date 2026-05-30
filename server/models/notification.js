const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  patientId: String,
  type: String, // "RELATIVE" | "HOSPITAL"
  email: String,
  message: String,
  status: {
    type: String,
    default: "SENT"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Notification", notificationSchema);