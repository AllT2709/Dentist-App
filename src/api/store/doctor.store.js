const db = require("../../database/database");

/* exports.getDoctor = async (name) => {
  let query = `SELECT * FROM Doctor WHERE name='${name}'`
  return new Promise((resolve,reject) => {
    db.query(query,(err,result) => {
      err ? reject(err) : resolve(result[0])
    })
  })
} */

exports.addDoc = (tabla, data) => {
  let query = `INSERT INTO ${tabla} (id, name, password) VALUES ?`;
  return new Promise((resolve, reject) => {
    db.query(query, [data], (err, result) => {
      err ? reject(err) : resolve("created!");
    });
  });
};
exports.deleteDoc = (tabla, id) => {
  let query = `DELeTE FROM ${tabla} WHERE id='${id}'`;
  return new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      err ? reject(err) : resolve("eliminated");
    });
  });
};
