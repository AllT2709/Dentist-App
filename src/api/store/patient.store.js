//const db = require("../../database/dummy");
const db = require("../../database/database");
const { getPerson, getById } = require("../../utils/getPerson");
/* exports.getPatient = (tabla) => {
  let query = `SELECT * FROM ${tabla}`;
  return new Promise ((resolve) => {
    db.query(query, (err,result) => {
      resolve(result)
    })
  })
}; */

exports.getPatientById = (tabla, id) => {
  let query = `SELECT * FROM ${tabla} WHERE id_patient='${id}'`;
  return new Promise((resolve, reject) => {
    db.query(query, (err, data) => {
      if (err || data[0] === undefined) {
        reject(err);
      }
      resolve(data[0]);
    });
  });
};

exports.addPatient = async (tabla, data) => {
  let patientExist = await getPerson(tabla, data.name);
  if (patientExist) {
    throw new Error("the patient exist");
  }
  /* let query = `INSERT INTO ${tabla} (id_patient,Name${
    data[0][2] ? ",Advance" : ""
  }) VALUES ?`; */
  let query = `INSERT INTO ${tabla} SET ?`;
  return new Promise((resolve, reject) => {
    db.query(
      query,
      [{ id_patient: data.id, Name: data.name, Advance: data.avance }],
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      }
    );
  });
};

exports.deletePatient = async (tabla, id) => {
  let patient = await getById(tabla, id);
  if (patient === undefined) {
    throw new Error("Patient does not exist");
  }
  let query = `DELETE FROM ${tabla} WHERE id_patient='${id}'`;
  return new Promise((resolve, reject) => {
    db.query(query, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve("data deleted");
    });
  });
};

exports.updatePatient = async (tabla, data, id) => {
  let patient = await getById(tabla, id);
  if (patient === undefined) {
    throw new Error("Patient does not exist");
  }
  let query = `UPDATE ${tabla} SET ? WHERE id_patient='${id}'`;
  return new Promise((resolve, reject) => {
    db.query(query, [data], (err, result) => {
      if (err) {
        reject(err);
      }
      resolve("Patient Updated");
    });
  });
};
