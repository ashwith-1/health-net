const Relative = require("../models/Relative");

// ================= ADD =================
exports.addRelative = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { name, phone, relation, email } = req.body;

    const relative = await Relative.create({
      patientId,
      name,
      phone,
      relation,
      email
    });

    res.status(201).json({
      success: true,
      relative
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================= GET =================
exports.getRelatives = async (req, res) => {
  try {
    const { patientId } = req.params;

    const relatives = await Relative.find({ patientId });

    res.json({
      success: true,
      relatives
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================= UPDATE =================
exports.updateRelative = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Relative.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      updated
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================= DELETE =================
exports.deleteRelative = async (req, res) => {
  try {
    const { id } = req.params;

    await Relative.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Deleted successfully"
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};