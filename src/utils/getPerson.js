const db = require("../database/database");

exports.getPerson = async (table, name) => {
  let query = `SELECT * FROM ${table} WHERE name='${name}'`;
  return new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      err ? reject(err) : resolve(result[0]);
    });
  });
};

exports.getPatient = (tabla) => {
  let query = `SELECT * FROM ${tabla}`;
  return new Promise((resolve) => {
    db.query(query, (err, result) => {
      resolve(result);
    });
  });
};

exports.getById = (tabla, id) => {
  let query = `SELECT * FROM ${tabla} WHERE id_patient='${id}'`;
  return new Promise((resolve, reject) => {
    db.query(query, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data[0]);
    });
  });
};
