const InsurancePlan = require("../models/InsurancePlan");

// ➕ CREATE PLAN (Admin / Hospital side)
exports.createPlan = async (req, res) => {
  try {
    const plan = await InsurancePlan.create(req.body);

    res.status(201).json({
      success: true,
      plan
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// 📄 GET ALL PLANS (Patient view)
exports.getPlans = async (req, res) => {
  try {
    const plans = await InsurancePlan.find();

    res.json({
      success: true,
      plans
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};