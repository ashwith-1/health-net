const Alert = require("../models/Alert");
const Relative = require("../models/Relative");
const Hospital = require("../models/Hospital");

const sendEmail = require("../utils/sendEmail");
const sendTelegram = require("../utils/sendTelegram");

// ================= CREATE ALERT =================
exports.createAlert = async (req, res) => {
  try {
    const { patientId, message } = req.body;

    if (!patientId || !message) {
      return res.status(400).json({
        success: false,
        message: "patientId and message are required",
      });
    }

    // 1. SAVE ALERT
    const alert = await Alert.create({
      patientId,
      message,
      createdAt: new Date(),
    });

    // 2. SOCKET
    const io = req.app.get("io");
    if (io) io.emit("new-alert", alert);

    // 3. RELATIVES
    const relatives = await Relative.find({ patientId });

    // ================= EMAIL TO RELATIVES =================
    await Promise.all(
      relatives
        .filter(r => r.email)
        .map(async (r) => {
          try {
            await sendEmail(
              r.email,
              `🚨 Emergency Alert

Message: ${message}

- HealthNet ICU System`
            );
          } catch (err) {
            console.log("Relative email failed:", r.email);
          }
        })
    );

    // ================= TELEGRAM =================
    try {
      await sendTelegram(`🚨 ICU ALERT\n\n${message}`);
    } catch (e) {
      console.log("Telegram failed");
    }

    // 4. HOSPITALS
    const hospitals = await Hospital.find();

    // ================= EMAIL TO HOSPITALS =================
    await Promise.all(
      hospitals
        .filter(h => h.email)
        .map(async (h) => {
          try {
            await sendEmail(
              h.email,
              `🚨 HOSPITAL ALERT

${message}

Patient ID: ${patientId}`
            );
          } catch (err) {
            console.log("Hospital email failed:", h.email);
          }
        })
    );

    return res.status(201).json({
      success: true,
      message: "Alert processed successfully",
      alert,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= GET ALERTS =================
exports.getAlerts = async (req, res) => {
  try {
    const { patientId } = req.params;

    const alerts = await Alert.find({ patientId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      alerts,
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};