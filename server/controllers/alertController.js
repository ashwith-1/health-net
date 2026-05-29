const Alert = require("../models/Alert");
const Relative = require("../models/Relative");
const Hospital = require("../models/Hospital");

const sendEmail = require("../utils/sendEmail");
const sendTelegram = require("../utils/sendTelegram");

// 🚨 CREATE ALERT + EMAIL + TELEGRAM + HOSPITALS + SOCKET
exports.createAlert = async (req, res) => {

  try {

    const { patientId, message } = req.body;

    if (!patientId || !message) {

      return res.status(400).json({
        success: false,
        message: "patientId and message are required",
      });
    }

    // 1️⃣ SAVE ALERT
    const alert = await Alert.create({
      patientId,
      message,
      createdAt: new Date(),
    });

    // 2️⃣ SOCKET REALTIME ALERT
    const io = req.app.get("io");

    if (io) {
      io.emit("new-alert", alert);
    }

    // 3️⃣ FETCH RELATIVES
    const relatives = await Relative.find({ patientId });

    // 4️⃣ SEND EMAILS TO RELATIVES
    const emailPromises = relatives
      .filter((r) => r.email)
      .map(async (relative) => {

        try {

          await sendEmail(

            relative.email,

            `🚨 Emergency Alert for your family member

Message: ${message}

💪 Stay strong, patient is under continuous AI monitoring.
🏥 HealthNet ICU System`
          );

          console.log("✅ Email sent to:", relative.email);

        } catch (err) {

          console.log(
            "❌ Email failed:",
            relative.email,
            err.message
          );
        }
      });

    await Promise.all(emailPromises);

    // 5️⃣ SEND TELEGRAM ALERT
    try {

      await sendTelegram(

        `🚨 HEALTHNET ICU ALERT

${message}

🏥 Patient under monitoring
💪 Stay Strong`
      );

      console.log("✅ Telegram alert sent");

    } catch (telegramError) {

      console.log(
        "❌ Telegram error:",
        telegramError.message
      );
    }

    // 6️⃣ FETCH HOSPITALS
    const hospitals = await Hospital.find();

    // 7️⃣ SEND EMAILS TO HOSPITALS
    const hospitalPromises = hospitals
      .filter((h) => h.email)
      .map(async (hospital) => {

        try {

          await sendEmail(

            hospital.email,

            `🚨 EMERGENCY PATIENT ALERT

${message}

🏥 Immediate medical support may be required.

Patient ID:
${patientId}

- HealthNet AI ICU System`
          );

          console.log(
            "✅ Hospital email sent:",
            hospital.email
          );

        } catch (err) {

          console.log(
            "❌ Hospital email failed:",
            hospital.email,
            err.message
          );
        }
      });

    await Promise.all(hospitalPromises);

    // 8️⃣ RESPONSE
    return res.status(201).json({
      success: true,
      message:
        "Alert created + socket + email + telegram + hospital alerts sent",
      alert,
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// 📩 GET ALERTS
exports.getAlerts = async (req, res) => {

  try {

    const { patientId } = req.params;

    if (!patientId) {

      return res.status(400).json({
        success: false,
        message: "patientId is required",
      });
    }

    const alerts = await Alert.find({
      patientId,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: alerts.length,
      alerts,
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};