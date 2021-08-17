const router = require("express").Router();
const { verifyDoc } = require("../../auth/jwt");
const { upload } = require("../controllers/upload.controller");
const ControllerPatient = require("../controllers/patient.controller");
const ControllerConsult = require("../controllers/consult.controller");
const ControllerDoctor = require("../controllers/doctor.controller");

const controllerPatient = new ControllerPatient();
const controllerConsult = new ControllerConsult();
const controllerDoc = new ControllerDoctor();

require("express-async-errors");

//*********LOGIN DOCTOR********//

router.get("/", controllerDoc.lofinForm);
router.get("/register", controllerDoc.registerForm);
router.post("/", controllerDoc.loginDoctor);
router.post("/register", controllerDoc.postDoctor);
router.get("/logout", controllerDoc.logOut);
router.get("/doctor", verifyDoc, controllerDoc.getDoctors);
router.delete("/doctor/:id", verifyDoc, controllerDoc.deleteDoctor);

//*********PATIENTS MANAGE********//
router.get("/patients", verifyDoc, controllerPatient.getPatients);
router.get("/patient/:id", verifyDoc, controllerPatient.getPatientById);
router.get(
  "/update/patient/:id",
  verifyDoc,
  controllerPatient.getPatienToUpdate
);
router.post("/patient", verifyDoc, upload, controllerPatient.addPatient);
router.get("/delete/patient/:id", verifyDoc, controllerPatient.deletePatient);
router.post(
  "/update/patient/:id",
  verifyDoc,
  upload,
  controllerPatient.updatePatient
);

//********CONSULTATION MANAGE*********//
router.get("/consult/consults", verifyDoc, controllerConsult.getConsultations);
router.get("/consult", verifyDoc, controllerConsult.getConsultationsByDay);
router.get(
  "/update/consult/:id",
  verifyDoc,
  controllerConsult.getConsultationByID
);
router.post("/consult", verifyDoc, controllerConsult.addConsultation);
router.get(
  "/delete/consult/:id",
  verifyDoc,
  controllerConsult.deleteConsultation
);
router.post(
  "/update/consult/:id",
  verifyDoc,
  controllerConsult.updateConsultation
);

module.exports = router;
