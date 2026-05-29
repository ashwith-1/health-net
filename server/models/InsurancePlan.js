const mongoose = require("mongoose");

const insurancePlanSchema = new mongoose.Schema({

  hospitalName: String,

  planName: String,     // Basic / Premium / ICU Cover

  coverage: String,     // e.g. "Heart, Sugar, ICU"

  pricePerMonth: Number,

  emergencyCoverage: Boolean,

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("InsurancePlan", insurancePlanSchema);