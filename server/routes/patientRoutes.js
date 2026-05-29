const express = require("express");

const router = express.Router();

const authMiddleware =
require("../middleware/authMiddleware");

const {
 createPatient,
 getPatient
} = require("../controllers/patientController");

router.post(
 "/",
 authMiddleware,
 createPatient
);

router.get(
 "/:id",
 authMiddleware,
 getPatient
);

module.exports = router;