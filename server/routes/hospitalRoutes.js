const express = require("express");

const {
  getHospitals,
  addHospital,
  sendHospitalAlerts,
} = require("../controllers/hospitalController");

const router = express.Router();

// 🏥 GET HOSPITALS
router.get("/", getHospitals);

// ➕ ADD HOSPITAL
router.post("/", addHospital);

// 🚨 SEND ALERTS TO HOSPITALS
router.post("/send-alerts", sendHospitalAlerts);

module.exports = router;