const Hospital = require("../models/Hospital");
const sendEmail = require("../utils/sendEmail");

// ================= GET HOSPITALS =================
exports.getHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find();

    res.json({
      success: true,
      hospitals
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// ================= ADD HOSPITAL =================
exports.addHospital = async (req, res) => {
  try {
    const hospital = await Hospital.create(req.body);

    res.status(201).json({
      success: true,
      hospital
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// ================= MANUAL ALERT =================
exports.sendHospitalAlerts = async (req, res) => {
  try {
    const { message } = req.body;

    const hospitals = await Hospital.find();

    for (const h of hospitals) {
      if (h.email) {
        try {
          await sendEmail(
            h.email,
            `🚨 Emergency Alert

${message}`
          );
        } catch (err) {
          console.log("Failed:", h.email);
        }
      }
    }

    res.json({
      success: true,
      message: "Sent to hospitals"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};