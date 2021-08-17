let fs = require("fs");
let store = require("../store/patient.store");
let { getPatient, getById } = require("../../utils/getPerson");
let { v4: uuid } = require("uuid");
const config = require("../../../config");
const path = require("path");

const TABLA = config.patientTable;

class Controller {
  constructor() {}
  adminLanding(req, res) {
    res.status(200).json("login form for admin!!");
  }

  getPatients(req, res) {
    getPatient(TABLA)
      .then((patient) => {
        if (!patient) {
          res.status(200).json("thera are not patients");
        }
        let outData = [];
        patient.map((p) => {
          if (p.Advance !== null) {
            fs.writeFileSync(
              path.join(__dirname, `../public/downloads/${p.Name}-date.pdf`),
              p.Advance
            );
          }
          outData.push({
            name: p.Name,
            pdf: p.Advance === null ? "No hay avances" : `${p.Name}-date.pdf`,
            id: p.id_patient,
          });
        });
        res.status(200).render("patientForm", { data: outData });
      })
      .catch((err) => {
        res.status(500).json({ err: "An error ocurred", message: err.message });
      });
  }

  getPatientById(req, res) {
    store
      .getPatientById(TABLA, req.params.id)
      .then((patient) => {
        res.status(200).json(patient);
      })
      .catch((err) => {
        res.status(404).json({ err: "No se encontro id" });
      });
  }

  async getPatienToUpdate(req, res) {
    let data = await getById(TABLA, req.params.id);
    if (data) {
      res.render("updatePatientsForm", { data: data });
    }
  }

  addPatient(req, res) {
    let id = uuid();
    if (!req.body.name) {
      return res.status(400).json("Se require el campo nombre");
    }
    let pathFile = path.join(__dirname, "../public/uploads");
    let file = req.file
      ? fs.readFileSync(`${pathFile}/${req.file.filename}`)
      : false;
    let newPatient = { id: id, name: req.body.name.toUpperCase() };
    newPatient.avance = file ? file : null;
    store
      .addPatient(TABLA, newPatient)
      .then((patient) => {
        res.status(201).redirect("/admin/patients");
      })
      .catch((err) => {
        res.status(409).json({ err: "An error ocurred", message: err.message });
      });
  }

  deletePatient(req, res) {
    store
      .deletePatient(TABLA, req.params.id)
      .then((patient) => {
        res.status(204).redirect("/admin/patients");
      })
      .catch((err) => {
        res.status(404).json({ err: "An error ocurred", message: err.message });
      });
  }

  updatePatient(req, res) {
    let pathFile = path.join(__dirname, "../public/uploads");
    let file = req.file
      ? fs.readFileSync(`${pathFile}/${req.file.filename}`)
      : false;
    let body = {
      Name: req.body.name.toUpperCase(),
    };
    if (file !== false) {
      body.Advance = file;
    }
    store
      .updatePatient(TABLA, body, req.params.id)
      .then((patient) => {
        res.status(200).redirect("/admin/patients");
      })
      .catch((err) => {
        res.status(404).json({ err: "An error", message: err.message });
      });
  }
}

module.exports = Controller;
