const supertest = require("supertest");
const config = require("../../../config");
const { getPerson, getPatient } = require("../getPerson");
const { app } = require("../../app");
const db = require("../../database/database");

const api = supertest(app);

const getPatients = async (table) => {
  const data = await getPatient(table);
  return {
    allData: data,
    id: data.map((d) => (table === "Patient" ? d.id_patient : d.id)),
  };
};

const getPat = async (table, name) => {
  const data = await getPerson(table, name);
  return data;
};

const getConsultations = (tabla) => {
  let query = `SELECT c.fecha_consulta, c.Monto, p.Name, c.id_consultation 
              FROM ${tabla} c 
              INNER JOIN Patient p 
              ON c.id_patient = p.id_patient ORDER BY c.fecha_consulta`;

  return new Promise((resolve) => {
    db.query(query, (err, result) => {
      resolve(result);
    });
  });
};
const getDate = (tabla, name) => {
  let query = `SELECT c.id_consultation, c.Monto 
              FROM ${tabla} c 
              INNER JOIN Patient p 
              ON c.id_patient = p.id_patient AND p.Name='${name}'`;

  return new Promise((resolve) => {
    db.query(query, (err, result) => {
      resolve(result);
    });
  });
};

module.exports = {
  api,
  getPatients,
  getPat,
  getConsultations,
  getDate,
};
