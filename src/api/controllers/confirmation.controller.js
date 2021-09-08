const config = require("../../../config");
const store = require("../store/confirmation.store");
const TABLA = config.consultTable;
const { getPerson } = require("../../utils/getPerson");
const { getDate } = require("../../utils/consultationDate");

class Confirmation {
  constructor() {
    this.data;
  }

  getMyDateForm(req, res) {
    res.render("patient", { data: this.data });
  }

  async getMyDate(req, res) {
    let patient = await getPerson(config.patientTable, req.body.name);
    if (!patient || patient === undefined) {
      return res.status(400).json("No está registrado en el sistema");
    }
    store
      .confirmConuslt(TABLA, req.body.name)
      .then((result) => {
        let data;
        if (result) {
          data = {
            ...result,
            fecha_consulta: getDate(new Date(result.fecha_consulta)),
          };
        } else {
          data = "No tiene programado una cita";
        }
        this.data = data;
        res.redirect("/");
      })
      .catch((err) => {
        res.status(400).json({ err: "Somethim wrong", message: err.message });
      });
  }
}

module.exports = Confirmation;
