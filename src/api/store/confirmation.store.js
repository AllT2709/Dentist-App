const db = require('../../database/database')

exports.confirmConuslt = (table, name) => {
  let query = `SELECT c.fecha_consulta, c.Monto, p.Name, p.Advance 
               FROM ${table} c, Patient p
               WHERE c.id_patient = p.id_patient AND p.Name = '${name}'
               ORDER BY fecha_consulta`
  return new Promise((resolve,reject)=> {
    db.query(query,(err,result) => {
      err ? reject(err) : resolve(result[0])
    })
  })
}