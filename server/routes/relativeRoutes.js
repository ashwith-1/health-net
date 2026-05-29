const express = require("express");
const router = express.Router();

const {
  addRelative,
  getRelatives,
  updateRelative,
  deleteRelative
} = require("../controllers/relativeController");

// CREATE
router.post("/:patientId", addRelative);

// READ
router.get("/:patientId", getRelatives);

// UPDATE
router.put("/:id", updateRelative);

// DELETE
router.delete("/:id", deleteRelative);

module.exports = router;