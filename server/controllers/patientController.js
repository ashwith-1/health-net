const Patient =
require("../models/Patient");

exports.createPatient =
async (req, res) => {

 try {

  const patient =
   await Patient.create(req.body);

  res.status(201).json(patient);

 } catch (error) {

  res.status(500).json({
   message: error.message
  });
 }
};

exports.getPatient =
async (req, res) => {

 try {

  const patient =
   await Patient.findById(
    req.params.id
   );

  res.json(patient);

 } catch (error) {

  res.status(500).json({
   message: error.message
  });
 }
};