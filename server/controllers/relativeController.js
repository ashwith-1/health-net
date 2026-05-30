const Relative = require("../models/Relative");

// ================= ADD RELATIVE =================
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
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// ================= GET RELATIVES =================
exports.getRelatives = async (req, res) => {
  try {
    const { patientId } = req.params;

    const relatives = await Relative.find({ patientId });

    res.json({
      success: true,
      relatives
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// ================= UPDATE =================
exports.updateRelative = async (req, res) => {
  try {
    const updated = await Relative.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      updated
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// ================= DELETE =================
exports.deleteRelative = async (req, res) => {
  try {
    await Relative.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Deleted"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};