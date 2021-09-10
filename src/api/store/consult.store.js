const db = require("../../database/database");
const { getPerson } = require("../../utils/getPerson");
const { getConsul } = require("../../utils/getConsultation");
const config = require("../../../config");

exports.addConsutlation = async (tabla, body) => {
  if (!body.id || !body.date || !body.monto || body.name == undefined) {
    return Promise.reject(new Error("You must provide data to add"));
  }
  let idPatient = await getPerson(config.patientTable, body.name);
  if (!idPatient || idPatient === undefined) {
    throw new Error("Patient does not exist");
  }
  let query = `INSERT INTO ${tabla} (id_consultation,Fecha_consulta,Monto,id_patient) VALUES ?`;
  return new Promise((resolve, reject) => {
    let data = [[body.id, body.date, body.monto, idPatient.id_patient]];
    db.query(query, [data], (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
};

exports.getConsultations = (tabla) => {
  let query = `SELECT c.fecha_consulta, c.Monto, p.Name, c.id_consultation 
              FROM ${tabla} c 
              INNER JOIN Patient p 
              ON c.id_patient = p.id_patient ORDER BY c.fecha_consulta`;

  return new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      err ? reject(err) : resolve(result);
    });
  });
};

exports.getConsultationsByDay = (tabla, day) => {
  let query = `SELECT c.fecha_consulta,c.Monto, p.Name,c.id_consultation  FROM ${tabla} c, Patient p 
          WHERE c.fecha_consulta LIKE '%${day}%' AND c.id_patient = p.id_patient`;

  return new Promise((resolve) => {
    db.query(query, (err, result) => {
      err ? reject(err) : resolve(result);
    });
  });
};

exports.deleteConsultation = async (tabla, id) => {
  let consult = await getConsul(tabla, id);
  if (consult === undefined) {
    throw new Error("Date does not exist");
  }
  let query = `DELETE FROM ${tabla} WHERE id_consultation='${id}'`;
  return new Promise((resolve, reject) => {
    db.query(query, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve("data deleted");
    });
  });
};

exports.updateConsultation = async (tabla, data, id) => {
  let consult = await getConsul(tabla, id);
  if (consult === undefined) {
    throw new Error("Date does not exist");
  }

  let datos;
  if (data.monto) {
    datos = `Monto=${data.monto}`;
  } else if (data.date) {
    datos = `Fecha_consulta='${data.date}'`;
  } else {
    return Promise.reject(new Error("You must provide data to update"));
  }
  let colom =
    data.monto && data.date
      ? `Monto=${data.monto}, Fecha_consulta='${data.date}'`
      : datos;
  let query = `UPDATE ${tabla} SET ${colom} WHERE id_consultation='${id}'`;
  //let date = [[data.date]];
  //let query = `UPDATE ${tabla} SET ${datos}, Fecha_consulta=? WHERE id_consultation='${id}'`;
  return new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      if (err) {
        console.log(err.stack);
        reject(err);
      }
      resolve("Patient Updated");
    });
  });
};
