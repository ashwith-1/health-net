const mongoose = require("mongoose");

const healthSchema = new mongoose.Schema({

  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  heartbeat: Number,

  spo2: Number,

  sugar: Number,

  bp: String,

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model(
  "Health",
  healthSchema
);