const Health = require("../models/Health");
const Alert = require("../models/Alert");
const sendTelegram = require("../utils/sendTelegram");

// 🟢 ADD HEALTH DATA + AUTO ALERT SYSTEM
exports.addHealthData = async (req, res) => {
  try {
    console.log("🔥 HEALTH API HIT");
    console.log("BODY:", req.body);

    const { patientId, heartbeat, spo2, bp, sugar } = req.body;

    // ❌ VALIDATION
    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: "patientId missing",
      });
    }

    // 🟢 SAVE HEALTH DATA (SAFE WAY)
    const health = await Health.create({
      patientId,
      heartbeat,
      spo2,
      bp,
      sugar,
    });

    let message = null;

    // 🟢 RULE ENGINE (FIXED LOGIC)

    if (heartbeat && heartbeat > 140) {
      message = "🚨 High Heart Rate Detected!";
    } 
    else if (spo2 && spo2 < 85) {
      message = "🚨 Low Oxygen Level Detected!";
    } 
    else if (sugar && sugar > 200) {
      message = "🚨 High Sugar Level Detected!";
    } 
    else if (bp) {
      const sys = parseInt(bp.split("/")[0]); // FIXED BP LOGIC
      if (sys > 140) {
        message = "🚨 High Blood Pressure Detected!";
      }
    }

    let alert = null;

    // 🟢 CREATE ALERT IF NEEDED
    if (message) {
      alert = await Alert.create({
        patientId,
        message,
        type: "EMERGENCY",
        createdAt: new Date(),
      });

      console.log("🚨 ALERT CREATED:", message);

      // 🔥 SOCKET ALERT
      const io = req.app.get("io");
      if (io) {
        io.emit("new-alert", alert);
      }

      // 📲 TELEGRAM ALERT (SAFE)
      try {
        await sendTelegram(
          `🚨 HEALTH ALERT\nPatient: ${patientId}\n${message}`
        );
      } catch (tgErr) {
        console.log("Telegram Error:", tgErr.message);
      }
    }

    // 🟢 RESPONSE
    res.status(201).json({
      success: true,
      health,
      alert,
    });

  } catch (error) {
    console.log("❌ HEALTH CONTROLLER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 🟢 GET HEALTH DATA
exports.getHealthData = async (req, res) => {
  try {
    const data = await Health.find({
      patientId: req.params.patientId,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data,
    });

  } catch (error) {
    console.log("❌ GET HEALTH ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};