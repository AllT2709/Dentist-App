const router = require("express").Router();
const ConfirmConsultation = require("../controllers/confirmation.controller");

const confirmation = new ConfirmConsultation();

//router.get("/patient-date", confirmation.getMyDate);
router.get("/", confirmation.getMyDateForm);
router.post("/patient-date", confirmation.getMyDate);

module.exports = router;
