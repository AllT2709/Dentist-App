const bcrypt = require("bcrypt");
const config = require("../../../config");
const store = require("../store/doctor.store");
const { getPerson, getPatient } = require("../../utils/getPerson");
const { v4: uuid } = require("uuid");
const jwt = require("../../auth/jwt");

const TABLA = config.doctorTable;

class Controller {
  constructor() {}

  getDoctors(req, res) {
    getPatient(TABLA)
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(400).json({ message: err.message });
      });
  }
  deleteDoctor(req, res) {
    store
      .deleteDoc(TABLA, req.params.id)
      .then((result) => {
        res.status(204).json("Eliminated!");
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({ message: err.message });
      });
  }
  registerForm(req, res) {
    res.render("register");
  }
  async postDoctor(req, res) {
    if (!req.body.name) {
      return res.status(400).json("Require parameters");
    }
    let doctorAdmin = await getPerson(config.doctorTable, req.body.name);
    if (doctorAdmin) {
      return res.status(400).json("Ese usuario ya esxiste");
    }
    let id = uuid();
    let password = await bcrypt.hash(req.body.password, 8);
    let doctor = [[id, req.body.name, password]];
    store
      .addDoc(TABLA, doctor)
      .then((result) => {
        res.status(201).redirect("/admin/");
      })
      .catch((err) => {
        res.status(500).json({ err: "something wrong", message: err.message });
      });
  }

  lofinForm(req, res) {
    res.render("loginDoctor");
  }
  async loginDoctor(req, res) {
    let doctor = await getPerson(TABLA, req.body.name);
    let pass = !doctor
      ? false
      : await bcrypt.compare(req.body.password, doctor.password);

    if (!doctor || !pass) {
      //return res.status(400).json("nombre o  contraseña invalidos");
      req.flash("error", "constraseña o usuario incorrectos");
      return res.status(400).redirect("/admin/");
    }
    let dataToSign = {
      name: doctor.name,
      id: doctor.id,
    };
    let token = await jwt.sign(dataToSign);
    req.session.user = true;
    res
      .cookie("jwt", token, {
        httpOnly: true,
        secure: !config.dev,
      })
      .status(200)
      .redirect("/admin/consult");
    //.json({ token, message: "logeado!" });
  }

  logOut(req, res) {
    if (req.cookies["jwt"]) {
      //res.clearCookie("jwt").status(200).json("has salido de la sesión");
      req.session.destroy();
      res.clearCookie("jwt").status(200).redirect("/admin/");
    } else {
      res.status(401).json("token inválido");
    }
  }
}

module.exports = Controller;
