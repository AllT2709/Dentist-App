const store = require("../store/consult.store");
let { v4: uuid } = require("uuid");
const config = require("../../../config");
const { getConsul } = require("../../utils/getConsultation");
const { getDate } = require("../../utils/consultationDate");

const TABLA = config.consultTable;

class Consultation {
  constructor() {
    this.data;
  }

  getConsultations(req, res) {
    store
      .getConsultations(TABLA)
      .then((result) => {
        let data = !result ? "there are not consultations" : result;
        console.log(data);
        res.status(200).json(data);
      })
      .catch((err) => {
        res.status(500).json({ err: "Internal error" });
      });
  }
  getConsultationsByDay(req, res) {
    let newDate = req.query.fecha_consulta
      ? new Date(req.query.fecha_consulta)
      : new Date();
    let day = `${newDate.getMonth() + 1}-${newDate.getDate()}`;
    store
      .getConsultationsByDay(TABLA, day)
      .then((result) => {
        let data;
        let myDay = getDate(newDate);
        if (result[0] === undefined) {
          data = "there are not consultations this day";
        } else {
          data = result.map((r) => {
            let result = {
              ...r,
              fecha_consulta: getDate(new Date(r.fecha_consulta)),
            };
            return result;
          });
        }
        res.status(200).render("doctorLanding", { data: data, day: myDay });
      })
      .catch((err) => {
        res.status(404).json({ err: "An error ocurred" });
      });
  }
  async getConsultationByID(req, res) {
    let data = await getConsul(TABLA, req.params.id);
    if (data) {
      res.render("consultForm", { data: data });
    }
  }

  addConsultation(req, res) {
    let body = {
      ...req.body,
      id: uuid(),
      date: req.body.fecha,
    };
    store
      .addConsutlation(TABLA, body)
      .then((consult) => {
        res.status(201).redirect("/admin/consult");
      })
      .catch((err) => {
        res
          .status(500)
          .json({ message: "Error to add consult", err: err.message });
      });
  }

  deleteConsultation(req, res) {
    store
      .deleteConsultation(TABLA, req.params.id)
      .then((patient) => {
        //res.status(204).json(patient);
        res.status(204).redirect("/admin/consult");
      })
      .catch((err) => {
        res.status(404).json({ err: "An error ocurred", message: err.message });
      });
  }

  updateConsultation(req, res) {
    let body = {
      monto: req.body.monto,
      date: req.body.fecha,
    };
    store
      .updateConsultation(TABLA, body, req.params.id)
      .then((patient) => {
        //res.status(200).json(patient);
        res.status(201).redirect("/admin/consult");
      })
      .catch((err) => {
        res.status(404).json({ err: "An error", message: err.message });
      });
  }
}

module.exports = Consultation;
