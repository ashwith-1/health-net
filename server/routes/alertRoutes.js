const express = require("express");
const {
  createAlert,
  getAlerts,
} = require("../controllers/alertController");

const router = express.Router();

// 🚨 CREATE ALERT (will also trigger emails inside controller)
router.post("/", createAlert);

// 📩 GET ALERTS BY PATIENT
router.get("/:patientId", getAlerts);

module.exports = router;