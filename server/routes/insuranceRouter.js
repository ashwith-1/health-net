const express = require("express");
const router = express.Router();

const {
  createPlan,
  getPlans
} = require("../controllers/insuranceController");

// admin/hospital creates plan
router.post("/", createPlan);

// patient views plans
router.get("/", getPlans);

module.exports = router;