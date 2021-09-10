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
    res.render("patient");
  }

  async getMyDate(req, res) {
    let patient = await getPerson(config.patientTable, req.body.name);
    if (!patient || patient === undefined) {
      req.flash("error", "No esta registrado en el sistema");
      res.status(406);
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
        //this.data = data;
        req.session.data = data;
        res.redirect("/");
      })
      .catch((err) => {
        //req.flash('error', 'something wrong')
        res.status(400).json({ err: "Somethim wrong", message: err.message });
      });
  }
}

module.exports = Confirmation;
