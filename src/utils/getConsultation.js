const db = require("../database/database");

exports.getConsul = (tabla, id) => {
  let query = `SELECT * FROM ${tabla} WHERE id_consultation='${id}'`;
  return new Promise((resolve, reject) => {
    db.query(query, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data[0]);
    });
  });
};
