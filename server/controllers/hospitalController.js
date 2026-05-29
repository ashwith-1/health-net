const Hospital = require("../models/Hospital");
const sendEmail = require("../utils/sendEmail");

// 🏥 GET ALL HOSPITALS
exports.getHospitals = async (req, res) => {

  try {

    const hospitals = await Hospital.find();

    res.status(200).json({
      success: true,
      count: hospitals.length,
      hospitals,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// 🏥 ADD HOSPITAL
exports.addHospital = async (req, res) => {

  try {

    const {
      name,
      email,
      latitude,
      longitude,
    } = req.body;

    if (!name || !email) {

      return res.status(400).json({
        success: false,
        message: "Name and email required",
      });
    }

    const hospital = await Hospital.create({
      name,
      email,
      latitude,
      longitude,
    });

    res.status(201).json({
      success: true,
      message: "Hospital added successfully",
      hospital,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// 🚨 SEND EMERGENCY EMAIL TO ALL HOSPITALS
exports.sendHospitalAlerts = async (req, res) => {

  try {

    const { message } = req.body;

    if (!message) {

      return res.status(400).json({
        success: false,
        message: "Message required",
      });
    }

    const hospitals = await Hospital.find();

    for (const hospital of hospitals) {

      if (hospital.email) {

        try {

          await sendEmail(

            hospital.email,

            `🚨 Emergency Patient Alert

${message}

🏥 Immediate medical support may be required.

- HealthNet ICU AI System`
          );

        } catch (err) {

          console.log(
            "Hospital email failed:",
            hospital.email
          );
        }
      }
    }

    res.status(200).json({
      success: true,
      message: "Hospital alerts sent",
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};