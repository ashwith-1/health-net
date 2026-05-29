const express = require("express");
const router = express.Router();

const { addHealthData, getHealthData } = require("../controllers/healthController");

// 🟢 ADD HEALTH DATA (POST)
router.post("/", addHealthData);

// 🟢 GET HEALTH DATA (BY PATIENT ID)
router.get("/:patientId", getHealthData);

module.exports = router;