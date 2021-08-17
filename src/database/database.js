const mysql = require('mysql')
const config = require('../../config/index')

let pool = mysql.createPool({
  connectionLimit: 10,
  host: config.host,
  user: config.userDB,
  password: config.password,
  database: config.database,
  port: config.dbPort
})
/* connection.connect(err => {
  if (err) {
    console.error('error', err.stack);
  }else{
    console.log('DB connected!!');
  }
}) */


module.exports = pool;